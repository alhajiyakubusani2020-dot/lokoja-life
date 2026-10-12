#!/usr/bin/env python3
"""
Lokoja Life — Stage 6 geo pipeline.
Parse tiled OpenStreetMap XML for Lokoja -> extract roads / rivers / places ->
simplify (Douglas-Peucker) -> project into game world coordinates -> emit JSON.

Coordinate contract (matches src/game/world3d/layout.ts):
  - real meters:  east = (lon - LON0) * 111320 * cos(LAT0), north = (lat - LAT0) * 110540
  - game units:   x = east / SCALE_M,  z = -north / SCALE_M   (north = -Z, three.js)
  - game center (0,0) = (LON0, LAT0)
Run:  python3 scripts/geo/pipeline.py
Out:  scripts/geo/network.json  (+ stats)
"""
import glob, json, math, os, sys
import xml.etree.ElementTree as ET

GEO = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(GEO, "network.json")

# ---- projection anchor: Lokoja city core (Kpata market-ish) ----
LAT0 = 7.7900
LON0 = 6.7530
SCALE_M = 26.0          # game units per meter  ->  1 u ~ 26 m
DP_TOL_M = 12.0         # simplify tolerance in real meters

METERS_PER_DEG_LAT = 110540.0
METERS_PER_DEG_LON = 111320.0 * math.cos(math.radians(LAT0))

HIGHWAY_CLASS = {
    "motorway": "highway", "motorway_link": "highway",
    "trunk": "highway", "trunk_link": "highway",
    "primary": "major", "primary_link": "major",
    "secondary": "secondary", "secondary_link": "secondary",
    "tertiary": "minor", "tertiary_link": "minor",
    "unclassified": "minor",
    "residential": "minor",
    "living_street": "minor",
    "service": "service",
    "track": "track",
    "footway": "foot", "path": "foot", "pedestrian": "foot", "steps": "foot",
}
CLASS_WIDTH_U = {  # real-world road width meters -> game units (26 m/u), min for visibility
    "highway": 0.42,   # ~11 m
    "major":    0.34,   # ~9 m
    "secondary": 0.28,
    "minor":    0.20,
    "service":  0.15,
    "track":    0.14,
    "foot":     0.10,
}
RIVER_WIDTH_M = {"river": 320.0, "stream": 18.0, "canal": 14.0, "drain": 10.0, "ditch": 6.0}

def project(lat, lon):
    east = (lon - LON0) * METERS_PER_DEG_LON
    north = (lat - LAT0) * METERS_PER_DEG_LAT
    return east / SCALE_M, -north / SCALE_M

def dp_simplify(pts, tol_u):
    """Douglas-Peucker on projected points."""
    if len(pts) < 3:
        return pts
    def dseg(p, a, b):
        ax, ay = a; bx, by = b; px, py = p
        dx, dy = bx - ax, by - ay
        L2 = dx * dx + dy * dy
        if L2 == 0:
            return math.hypot(px - ax, py - ay)
        t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / L2))
        return math.hypot(px - (ax + t * dx), py - (ay + t * dy))
    stack = [(0, len(pts) - 1)]
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    while stack:
        lo, hi = stack.pop()
        if hi <= lo + 1:
            continue
        dmax, idx = -1.0, -1
        for i in range(lo + 1, hi):
            d = dseg(pts[i], pts[lo], pts[hi])
            if d > dmax:
                dmax, idx = d, i
        if dmax > tol_u:
            keep[idx] = True
            stack.append((lo, idx)); stack.append((idx, hi))
    return [p for p, k in zip(pts, keep) if k]

def main():
    nodes = {}          # id -> (lat, lon)
    ways = []           # {id, refs, tags}
    files = sorted(glob.glob(os.path.join(GEO, "tiles", "t_*.osm")))
    files = [f for f in files if os.path.getsize(f) > 1000]
    print(f"parsing {len(files)} tiles ...")
    for f in files:
        for ev, el in ET.iterparse(f, events=("end",)):
            tag = el.tag
            if tag == "node":
                nodes[int(el.get("id"))] = (float(el.get("lat")), float(el.get("lon")))
                el.clear()
            elif tag == "way":
                refs = [int(nd.get("ref")) for nd in el.findall("nd")]
                tags = {t.get("k"): t.get("v") for t in el.findall("tag")}
                if refs:
                    ways.append({"id": int(el.get("id")), "refs": refs, "tags": tags})
                el.clear()
            elif tag == "relation":
                el.clear()
    print(f"nodes: {len(nodes):,}   ways: {len(ways):,}")

    roads, rivers, water_areas, places = [], [], [], []
    skipped_unclosed = 0
    for w in ways:
        t = w["tags"]
        hw = t.get("highway")
        ww = t.get("waterway")
        if hw and hw in HIGHWAY_CLASS:
            pts = [nodes[r] for r in w["refs"] if r in nodes]
            if len(pts) < 2:
                continue
            name = t.get("name")
            cls = HIGHWAY_CLASS[hw]
            roads.append({
                "osm": w["id"], "name": name, "cls": cls,
                "bridge": t.get("bridge") in ("yes", "viaduct", "aqueduct", "culvert", "boardwalk"),
                "tunnel": t.get("tunnel") in ("yes", "culvert", "building_passage"),
                "surface": t.get("surface"),
                "latlon": pts,
            })
        elif ww in RIVER_WIDTH_M:
            pts = [nodes[r] for r in w["refs"] if r in nodes]
            if len(pts) < 2:
                continue
            rivers.append({
                "osm": w["id"], "kind": ww, "name": t.get("name"),
                "w_m": RIVER_WIDTH_M[ww], "latlon": pts,
            })
        elif ww == "riverbank":
            # area polygon for the big rivers
            pts = [nodes[r] for r in w["refs"] if r in nodes]
            if len(pts) >= 4 and pts[0] == pts[-1]:
                water_areas.append({"osm": w["id"], "latlon": pts})
            else:
                skipped_unclosed += 1

    # ---- places (real neighborhood names) ----
    for f in files:
        try:
            root = ET.parse(f).getroot()
        except Exception:
            continue
        for nd in root.iter("node"):
            t = {tg.get("k"): tg.get("v") for tg in nd.findall("tag")}
            if "place" in t and "name" in t:
                places.append({
                    "name": t["name"], "kind": t["place"],
                    "lat": float(nd.get("lat")), "lon": float(nd.get("lon")),
                })

    # ---- simplify + project ----
    tol_u = DP_TOL_M / SCALE_M
    for r in roads:
        r["pts"] = dp_simplify([project(*p) for p in r["latlon"]], tol_u)
        del r["latlon"]
    for rv in rivers:
        rv["pts"] = dp_simplify([project(*p) for p in rv["latlon"]], tol_u)
        rv["w_u"] = rv["w_m"] / SCALE_M
        del rv["latlon"]
    for wa in water_areas:
        wa["pts"] = dp_simplify([project(*p) for p in wa["latlon"]], tol_u)
        del wa["latlon"]
    for p in places:
        p["x"], p["z"] = project(p["lat"], p["lon"])

    # ---- stats ----
    from collections import Counter
    cls_c = Counter(r["cls"] for r in roads)
    named = sum(1 for r in roads if r["name"])
    bridges = sum(1 for r in roads if r["bridge"])
    total_pts = sum(len(r["pts"]) for r in roads)
    xs = [p[0] for r in roads for p in r["pts"]] + [p[0] for rv in rivers for p in rv["pts"]]
    zs = [p[1] for r in roads for p in r["pts"]] + [p[1] for rv in rivers for p in rv["pts"]]
    stats = {
        "roads": len(roads), "named": named, "bridges_tagged": bridges,
        "total_points": total_pts,
        "cls": dict(cls_c),
        "rivers": len(rivers), "water_areas": len(water_areas), "places": len(places),
        "x_range": [round(min(xs), 1), round(max(xs), 1)],
        "z_range": [round(min(zs), 1), round(max(zs), 1)],
        "scale_m_per_u": SCALE_M,
    }
    print(json.dumps(stats, indent=2))

    names = Counter(r["name"] for r in roads if r["name"])
    print("\ntop named roads:")
    for n, c in names.most_common(30):
        print(f"  {c:3d}x  {n}")
    print("\nplaces:")
    for p in sorted(places, key=lambda p: -1 * (p["kind"] == "suburb")):
        print(f"  {p['kind']:>13}  {p['name']}  @ ({p['x']:.1f},{p['z']:.1f})")

    with open(OUT, "w") as f:
        json.dump({"stats": stats, "roads": roads, "rivers": rivers,
                   "water_areas": water_areas, "places": places}, f)
    print(f"\nwrote {OUT} ({os.path.getsize(OUT):,} bytes)")

if __name__ == "__main__":
    main()
