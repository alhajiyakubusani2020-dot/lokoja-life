#!/usr/bin/env python3
"""
Stage 6 world generator — network.json -> src/game/world3d/geo.ts (+ geo-map.ts)
Everything downstream (layout.ts, MapCanvas) consumes these GENERATED modules.
Real geographic data (c) OpenStreetMap contributors, ODbL.
"""
import json, math, os
from collections import defaultdict

GEO = os.path.dirname(os.path.abspath(__file__))
NET = os.path.join(GEO, "network.json")
OUT_TS = "/home/z/my-project/src/game/world3d/geo.ts"
OUT_MAP = "/home/z/my-project/src/components/game/geo-map.ts"

WORLD_HALF = 310          # game units
BOX = WORLD_HALF + 6      # clip box (roads may poke slightly past terrain edge)
MAP_SPAN = WORLD_HALF * 2 / 100 * 2  # 100-unit map grid -> world: mapX*MAP_SCALE-...

# ---- road class -> game style/width (world units; 1u = 26 m) ----
STYLE = {
    "highway":   {"style": "asphalt",  "w": 0.44},
    "major":     {"style": "asphalt",  "w": 0.36},
    "secondary": {"style": "asphalt",  "w": 0.30},
    "minor":     {"style": "laterite", "w": 0.20},
    "service":   {"style": "laterite", "w": 0.16},
    "track":     {"style": "dirt",     "w": 0.14},
    "foot":      {"style": "path",     "w": 0.10},
}
KEEP_CLASSES = {"highway", "major", "secondary", "minor", "track", "foot"}
MAJOR_CLASSES = {"highway", "major", "secondary"}                    # lamps, poles, building clearance, loops

# ---- rivers ----
NIGER_W, BENUE_W, STREAM_MIN_W = 12.5, 10.0, 1.7     # world units

# manual place labels the locals know (name, hint lat/lon) — snapped to nearest road later
MANUAL_PLACES = [
    ("Felele",   7.7555, 6.7380),
    ("Crusher",  7.7390, 6.7390),
    ("Ganaja",   7.7760, 6.7900),
    ("Kpata",    7.7780, 6.7340),
    ("Otokiti",  7.7660, 6.7230),
    ("Zango",    7.8100, 6.7300),
]

def seg_int(p1, p2, p3, p4):
    d1 = (p2[0]-p1[0], p2[1]-p1[1]); d2 = (p4[0]-p3[0], p4[1]-p3[1])
    den = d1[0]*d2[1] - d1[1]*d2[0]
    if abs(den) < 1e-12: return None
    t = ((p3[0]-p1[0])*d2[1] - (p3[1]-p1[1])*d2[0]) / den
    u = ((p3[0]-p1[0])*d1[1] - (p3[1]-p1[1])*d1[0]) / den
    if 0 <= t <= 1 and 0 <= u <= 1:
        return (p1[0]+t*d1[0], p1[1]+t*d1[1])
    return None

def clip_polyline(pts, box=None):
    """Circular clip at the terrain rim crest: roads end cleanly on the rim
    slope, no boundary-hugging fragments, no shortcut jumps."""
    R = WORLD_HALF - 8.0   # 302 — the rim crest zone
    out = []
    pen_down = False
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        ra = math.hypot(a[0], a[1])
        rb = math.hypot(b[0], b[1])
        ain, bin = ra <= R, rb <= R
        if ain and bin:
            if not pen_down:
                out.append(a)
            out.append(b)
            pen_down = True
            continue
        # line-circle intersection: |a + t(b-a)| = R
        dx, dz = b[0] - a[0], b[1] - a[1]
        A = dx * dx + dz * dz
        B = 2 * (a[0] * dx + a[1] * dz)
        C = a[0] * a[0] + a[1] * a[1] - R * R
        hits = []
        if A > 1e-12:
            disc = B * B - 4 * A * C
            if disc >= 0:
                sq = math.sqrt(disc)
                for t in ((-B - sq) / (2 * A), (-B + sq) / (2 * A)):
                    if 0 <= t <= 1:
                        hits.append(t)
        def at(t):
            return (a[0] + dx * t, a[1] + dz * t)
        if ain and not bin:
            out.append(at(hits[-1]) if hits else b)
            pen_down = False
        elif bin and not ain:
            if not pen_down:
                out.append(at(hits[0]) if hits else a)
            out.append(b)
            pen_down = True
        else:
            if len(hits) >= 2:
                # chord through the circle — keep the inside span
                out.append(at(hits[0]))
                out.append(at(hits[1]))
            pen_down = False
    if len(out) == 1:
        out = []
    return out

def dedupe_close(pts, min_d=0.05):
    out = []
    for p in pts:
        if not out or math.hypot(p[0]-out[-1][0], p[1]-out[-1][1]) > min_d:
            out.append(p)
    return out if len(out) >= 2 else []

def path_len(pts):
    return sum(math.hypot(pts[i+1][0]-pts[i][0], pts[i+1][1]-pts[i][1]) for i in range(len(pts)-1))

def fmt(v):
    return f"{v:.1f}".rstrip('0').rstrip('.')

def fmt_pts(pts):
    return "[" + ",".join(f"[{fmt(x)},{fmt(z)}]" for x, z in pts) + "]"

def main():
    d = json.load(open(NET))
    # ---- dedupe ----
    seen = set(); roads = []
    for r in d["roads"]:
        if r["osm"] in seen: continue
        seen.add(r["osm"]); roads.append(r)
    seen = set(); rivers = []
    for v in d["rivers"]:
        if v["osm"] in seen: continue
        seen.add(v["osm"]); rivers.append(v)
    places = d["places"]

    # ---- roads: filter + clip + clean ----
    geo_roads = []
    for r in roads:
        if r["cls"] not in KEEP_CLASSES: continue
        if r["tunnel"]: continue
        pts = dedupe_close(clip_polyline(r["pts"]))
        if len(pts) < 2: continue
        L = path_len(pts)
        if r["cls"] in ("minor", "service") and L < 0.8: continue   # fragments
        if r["cls"] == "foot" and L < 8: continue                   # keep only real trails
        name = r["name"].strip() if r["name"] else None
        if name in ("", "\\", "-"): name = None
        st = STYLE[r["cls"]]
        geo_roads.append({
            "osm": r["osm"], "name": name, "cls": r["cls"],
            "style": st["style"], "w": round(max(st["w"], 0.10), 3),
            "major": r["cls"] in MAJOR_CLASSES, "bridge": bool(r["bridge"]),
            "pts": [(round(x, 1), round(z, 1)) for x, z in pts], "len": round(L, 1),
        })
    geo_roads.sort(key=lambda r: -r["len"])

    # ---- riverside road push (called later, after rivers + bridges are known) ----
    def push_roads_out_of_water():
        """roads get pushed away from river centrelines so they never render
        inside the carved channel or on the shelf. Bridge-carrying roads are
        pushed EXCEPT near their own bridge (the approach must stay put)."""
        bridge_roads = defaultdict(list)
        for b in bridges:
            bridge_roads[b["road"]].append((b["x"], b["z"]))
        # river SEGMENTS (not just points) — distance must match the game's
        # polyline queries or long straight runs leak through
        riv_segs = []
        for v in geo_rivers:
            hw = v["w"] / 2
            carve = hw + (8.0 if hw > 4 else 4.6)   # carve margin + road clearance
            pts = v["pts"]
            for i in range(len(pts) - 1):
                riv_segs.append((pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1], carve))
        pushed = 0
        for r in geo_roads:
            own_bridges = bridge_roads.get(r["osm"], [])
            for i, (x, z) in enumerate(r["pts"]):
                # keep bridge approaches in place
                if any(math.hypot(x-bx, z-bz) < 15 for bx, bz in own_bridges):
                    continue
                # nearest river segment (point-to-segment distance)
                best = None
                for (ax, az, bx, bz, carve) in riv_segs:
                    dx, dz = bx-ax, bz-az
                    l2 = dx*dx + dz*dz
                    t = 0 if l2 == 0 else max(0.0, min(1.0, ((x-ax)*dx + (z-az)*dz) / l2))
                    px, pz = ax + dx*t, az + dz*t
                    d2 = (px-x)**2 + (pz-z)**2
                    if best is None or d2 < best[0]:
                        best = (d2, px, pz, carve)
                d2, rx, rz, carve = best
                d = math.sqrt(d2)
                if d < carve:
                    if d < 0.4:
                        continue  # degenerate — leave it (bridge detection handles real crossings)
                    nx, nz = (x-rx)/d, (z-rz)/d
                    r["pts"][i] = (round(rx + nx*carve, 1), round(rz + nz*carve, 1))
                    pushed += 1
        return pushed

    # ---- rivers ----
    def big_river(named, w):
        cands = [v for v in rivers if v["name"] and named in v["name"].lower()]
        v = max(cands, key=lambda v: len(v["pts"]))
        pts = dedupe_close(clip_polyline(v["pts"]), 0.3)
        return {"id": named[:5], "name": v["name"], "w": w, "pts": [(round(x,2), round(z,2)) for x, z in pts]}
    niger = big_river("niger", NIGER_W)
    benue = big_river("benu", BENUE_W)
    streams = []
    for v in rivers:
        if v["kind"] != "stream": continue
        pts = dedupe_close(clip_polyline(v["pts"]), 0.3)
        if len(pts) < 8 or path_len(pts) < 12: continue
        streams.append({"id": f"s{v['osm']%100000}", "name": v["name"], "w": STREAM_MIN_W,
                        "pts": [(round(x,1), round(z,1)) for x, z in pts]})
    streams.sort(key=lambda v: -path_len(v["pts"]))
    streams = streams[:14]
    geo_rivers = [niger, benue] + streams

    # ---- bridges: road x river segment intersections ----
    bridges = []
    river_segs = []
    for rv in geo_rivers:
        for i in range(len(rv["pts"]) - 1):
            river_segs.append((rv["pts"][i], rv["pts"][i+1], rv["w"]))
    for r in geo_roads:
        if r["style"] == "path": continue
        for i in range(len(r["pts"]) - 1):
            a, b = r["pts"][i], r["pts"][i+1]
            for (c, e, rw) in river_segs:
                x = seg_int(a, b, c, e)
                if not x: continue
                dx, dz = b[0]-a[0], b[1]-a[1]
                L = math.hypot(dx, dz)
                if L < 0.2: continue
                yaw = math.atan2(dx, dz)  # three.js: rotY around +Y, forward +Z
                need = max(rw + 5.0, 7.0)
                # deck width follows GAMEPLAY render width of the carrying road
                RENDER_W = {"asphalt": 6.2, "laterite": 4.8, "dirt": 3.2, "path": 2.2}
                rw_render = RENDER_W.get(r["style"], 4.8)
                bw = max(rw_render + 1.8, 4.6)
                bw = min(bw, 9.0)
                bridges.append({"x": round(x[0],2), "z": round(x[1],2), "yaw": round(yaw,3),
                                "len": round(need,1), "w": round(bw, 2),
                                "cls": r["style"], "road": r["osm"]})
                break
    # merge bridges closer than 3.5u (dual carriageways)
    merged = []
    for b in sorted(bridges, key=lambda b: (b["x"], b["z"])):
        hit = None
        for m in merged:
            if math.hypot(m["x"]-b["x"], m["z"]-b["z"]) < 3.5:
                hit = m; break
        if hit:
            hit["x"] = (hit["x"]+b["x"])/2; hit["z"] = (hit["z"]+b["z"])/2
            hit["w"] = max(hit["w"], b["w"] + 1.6, 6.0)
        else:
            merged.append(b)
    bridges = merged

    # keep non-bridge roads out of the carved channels
    pushed_pts = push_roads_out_of_water()
    print(f"riverside push: {pushed_pts} road points moved clear of water")

    # ---- road graph for traffic loops (proximity-linked endpoints) ----
    adj = defaultdict(list)
    major_ways = [(i, r) for i, r in enumerate(geo_roads) if r["major"] and r["len"] >= 2]
    endpoints = []
    for i, r in major_ways:
        endpoints.append((r["pts"][0], i, 0))
        endpoints.append((r["pts"][-1], i, 1))
    for a in range(len(endpoints)):
        pa, ia, sa = endpoints[a]
        for b in range(a+1, len(endpoints)):
            pb, ib, sb = endpoints[b]
            if ia == ib: continue
            if math.hypot(pa[0]-pb[0], pa[1]-pb[1]) < 2.6:
                adj[ia].append((ib, sb))
                adj[ib].append((ia, sa))

    def chain_loop(seed, max_ways=9):
        """start from way `seed`, chain ways sharing endpoints until loop closes"""
        loop_pts = list(geo_roads[seed]["pts"])
        used = {seed}
        cur = seed
        endp = loop_pts[-1]
        for _ in range(max_ways):
            nxt = None
            for (j, _) in adj.get(cur, []):
                if j in used: continue
                pts = geo_roads[j]["pts"]
                d0 = math.hypot(pts[0][0]-endp[0], pts[0][1]-endp[1])
                d1 = math.hypot(pts[-1][0]-endp[0], pts[-1][1]-endp[1])
                if min(d0, d1) < 2.6:
                    nxt = j; break
            if nxt is None: return None
            used.add(nxt)
            pts = geo_roads[nxt]["pts"]
            if math.hypot(pts[0][0]-loop_pts[-1][0], pts[0][1]-loop_pts[-1][1]) < \
               math.hypot(pts[-1][0]-loop_pts[-1][0], pts[-1][1]-loop_pts[-1][1]):
                loop_pts += pts
            else:
                loop_pts += list(reversed(pts))
            if math.hypot(loop_pts[0][0]-loop_pts[-1][0], loop_pts[0][1]-loop_pts[-1][1]) < 3.0 and path_len(loop_pts) > 40:
                return loop_pts[:-1]
            cur = nxt
            endp = loop_pts[-1]
        return None

    loops = []
    seed_names = ["Ibb way", "Taiwo Road", "Lokoja-Otukpo Road", "Hassan Usman Katsina Road", "Kunama Road", "Wada Road"]
    for i, r in enumerate(geo_roads):
        if r["name"] in seed_names:
            lp = chain_loop(i)
            if lp and path_len(lp) > 45 and all(math.hypot(lp[j+1][0]-lp[j][0], lp[j+1][1]-lp[j][1]) <= 42 for j in range(len(lp)-1)):
                loops.append([(round(x,1), round(z,1)) for x, z in lp])
    # dedupe loops that share >60% of points
    uniq = []
    for lp in loops:
        dup = False
        for u in uniq:
            close = sum(1 for p in lp if any(abs(p[0]-q[0])<2 and abs(p[1]-q[1])<2 for q in u))
            if close / max(len(lp),1) > 0.6: dup = True; break
        if not dup: uniq.append(lp)
    loops = uniq[:6]

    # ---- places: real nodes + manual, snapped to nearest major road point ----
    allpts = [(p[0], p[1]) for r in geo_roads if r["major"] for p in r["pts"]]
    def snap(x, z):
        best = min(allpts, key=lambda q: (q[0]-x)**2 + (q[1]-z)**2)
        return best
    geo_places = []
    for p in places:
        if p["kind"] in ("city", "state") or p["name"] in ("Kpatakpali", "Kpatakpoli"): continue
        x, z = snap(p["x"], p["z"])
        geo_places.append({"name": p["name"], "x": round(x,1), "z": round(z,1), "kind": "suburb" if p["kind"] in ("town","neighbourhood") else "village"})
    used_names = {p["name"].lower() for p in geo_places}
    for nm, lat, lon in MANUAL_PLACES:
        if nm.lower() in used_names: continue
        ex = (lon - 6.753) * 110292 / 26
        ez = -(lat - 7.79) * 110540 / 26
        x, z = snap(ex, ez)
        geo_places.append({"name": nm, "x": round(x,1), "z": round(z,1), "kind": "suburb"})

    # ---- lamps along major roads ----
    lamps = []
    for ri, r in enumerate(geo_roads):
        if not r["major"]: continue
        side = 1 if ri % 2 == 0 else -1
        acc = 0.0
        for i in range(len(r["pts"]) - 1):
            a, b = r["pts"][i], r["pts"][i+1]
            seg = math.hypot(b[0]-a[0], b[1]-a[1])
            while acc < seg:
                t = acc / seg if seg else 0
                x, z = a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t
                nx, nz = -(b[1]-a[1])/max(seg,1e-6), (b[0]-a[0])/max(seg,1e-6)
                lamps.append((round(x + nx*2.6*side, 1), round(z + nz*2.6*side, 1)))
                acc += 17
            acc -= seg
    lamps = lamps[:900]

    # ---- suggested anchors: snap game locations to nearest major road ----
    ANCHOR_HINTS = [  # (location id, lat, lon) — real positions
        ("home",             7.7740, 6.7280),
        ("kpata-market",     7.7780, 6.7330),
        ("ganaja-junction",  7.7710, 6.7480),
        ("confluence",       7.7525, 6.7485),
        ("mount-patti",      7.8210, 6.7325),
        ("historic-lokoja",  7.8020, 6.7360),
        ("government-area",  7.7860, 6.7300),
        ("university-area",  7.8060, 6.7180),
        ("food-area",        7.7765, 6.7305),
        ("transport-area",   7.7660, 6.7395),
    ]
    anchors = {}
    placed = []
    for lid, lat, lon in ANCHOR_HINTS:
        ex = (lon - 6.753) * 110292 / 26
        ez = -(lat - 7.79) * 110540 / 26
        # snap to nearest major-road point at least 14u from other anchors
        cands = sorted(allpts, key=lambda q: (q[0]-ex)**2 + (q[1]-ez)**2)[:60]
        pick = cands[0]
        for q in cands:
            if all(math.hypot(q[0]-px, q[1]-pz) >= 14 for px, pz in placed):
                pick = q; break
        x, z = pick
        placed.append((x, z))
        anchors[lid] = (round(x,1), round(z,1))

    stats = {
        "roads": len(geo_roads), "major_roads": sum(1 for r in geo_roads if r["major"]),
        "road_points": sum(len(r["pts"]) for r in geo_roads),
        "total_len_u": round(sum(r["len"] for r in geo_roads)),
        "real_km": round(sum(r["len"] for r in geo_roads) * 26 / 1000),
        "rivers": len(geo_rivers), "streams": len(streams),
        "bridges": len(bridges), "loops": len(loops), "places": len(geo_places),
        "lamps": len(lamps),
    }
    print(json.dumps(stats, indent=2))
    print("anchor suggestions (world coords):")
    for k, (x, z) in anchors.items():
        print(f"  {k:>18} @ ({x}, {z})   map=({50+x/6.2:.1f}, {50+z/6.2:.1f})")
    print("loops:", [(len(l), round(path_len(l))) for l in loops])
    print("named roads kept:", sorted({r['name'] for r in geo_roads if r['name']}))

    # ================= emit geo.ts =================
    def road_entry(r):
        n = json.dumps(r["name"]) if r["name"] else "null"
        return (f'  {{ osm: {r["osm"]}, name: {n}, cls: "{r["cls"]}", style: "{r["style"]}", '
                f'w: {r["w"]}, major: {"true" if r["major"] else "false"}, bridge: {"true" if r["bridge"] else "false"}, '
                f'pts: {fmt_pts(r["pts"])} }},')
    def river_entry(v):
        n = json.dumps(v["name"]) if v.get("name") else "null"
        return f'  {{ id: "{v["id"]}", name: {n}, w: {v["w"]}, pts: {fmt_pts(v["pts"])} }},'
    def bridge_entry(b):
        return (f'  {{ x: {fmt(b["x"])}, z: {fmt(b["z"])}, yaw: {b["yaw"]}, len: {fmt(b["len"])}, '
                f'w: {fmt(b["w"])}, cls: "{b["cls"]}" }},')
    def place_entry(p):
        return f'  {{ name: {json.dumps(p["name"])}, x: {p["x"]}, z: {p["z"]}, kind: "{p["kind"]}" }},'
    def loop_entry(lp):
        return f'  {fmt_pts(lp)},'
    lamp_entry = lambda l: f'  [{l[0]},{l[1]}],'

    ts = f"""// GENERATED by scripts/geo/generate_world.py — DO NOT hand-edit.
// Source: OpenStreetMap (c) OpenStreetMap contributors, ODbL. Real Lokoja road network.
// 1 world unit = 26 m. North = -Z. World center (0,0) = 6.753E, 7.790N.
// Roads: {stats['roads']} ways ({stats['real_km']} km real), rivers {stats['rivers']}, bridges {stats['bridges']}.

export interface GeoRoad {{
  osm: number
  name: string | null
  cls: 'highway' | 'major' | 'secondary' | 'minor' | 'track' | 'foot'
  style: 'asphalt' | 'laterite' | 'dirt' | 'path'
  w: number
  major: boolean
  bridge: boolean
  pts: [number, number][]
}}
export interface GeoRiver {{ id: string; name: string | null; w: number; pts: [number, number][] }}
export interface GeoBridge {{ x: number; z: number; yaw: number; len: number; w: number; cls: string }}
export interface GeoPlace {{ name: string; x: number; z: number; kind: string }}

export const GEO_WORLD_HALF = {WORLD_HALF}

export const GEO_ROADS: GeoRoad[] = [
{chr(10).join(road_entry(r) for r in geo_roads)}
]

export const GEO_RIVERS: GeoRiver[] = [
{chr(10).join(river_entry(v) for v in geo_rivers)}
]

export const GEO_BRIDGES: GeoBridge[] = [
{chr(10).join(bridge_entry(b) for b in bridges)}
]

export const GEO_PLACES: GeoPlace[] = [
{chr(10).join(place_entry(p) for p in geo_places)}
]

/** Closed traffic loops along real major roads. */
export const GEO_LOOPS: [number, number][][] = [
{chr(10).join(loop_entry(lp) for lp in loops)}
]

/** Street lamps along real major roads. */
export const GEO_LAMPS: [number, number][] = [
{chr(10).join(lamp_entry(l) for l in lamps)}
]

/** Suggested anchor world coords for the 10 game locations (road-snapped). */
export const GEO_ANCHOR_SUGGESTIONS: Record<string, [number, number]> = {json.dumps({k: list(v) for k, v in anchors.items()})}
"""
    with open(OUT_TS, "w") as f:
        f.write(ts)
    print(f"wrote {OUT_TS} ({os.path.getsize(OUT_TS):,} bytes)")

    # ================= emit geo-map.ts (2D map, grid 0-100) =================
    # map grid: mapX = 50 + x/6.2 ; mapY = 50 + z/6.2
    S = WORLD_HALF * 2 / 100  # = 6.2
    def m(p): return (50 + p[0]/S, 50 + p[1]/S)
    def dpath(pts, close=False):
        c = "M" + " L".join(f"{mx:.1f} {my:.1f}" for mx, my in (m(p) for p in pts))
        return c + (" Z" if close else "")
    tiers = {"trunk": [], "main": [], "minor": []}
    for r in geo_roads:
        if r["style"] == "path": continue
        d = dpath(r["pts"])
        if r["cls"] in ("highway",): tiers["trunk"].append(d)
        elif r["cls"] in ("major", "secondary"): tiers["main"].append(d)
        else: tiers["minor"].append(d)
    water = [dpath(v["pts"]) for v in geo_rivers if len(v["pts"]) >= 2]
    labels = [(p["name"], 50 + p["x"]/S, 50 + p["z"]/S, p["kind"]) for p in geo_places]
    bridge_dots = [(b["x"], b["z"]) for b in bridges]

    # river metadata for the 2D map: stroke width + name label positions
    RIV_W = {"niger": 5.4, "benue": 4.4}
    river_meta = []
    for i, v in enumerate(geo_rivers):
        if len(v["pts"]) < 2: continue
        w = RIV_W.get(v["id"], 0.9)
        mid = v["pts"][len(v["pts"]) // 2]
        a = v["pts"][max(0, len(v["pts"]) // 2 - 2)]
        b = v["pts"][min(len(v["pts"]) - 1, len(v["pts"]) // 2 + 2)]
        import math as _m
        rot = _m.degrees(_m.atan2((50 + b[1]/S) - (50 + a[1]/S), (50 + b[0]/S) - (50 + a[0]/S)))
        river_meta.append({
            "id": v["id"], "name": v.get("name"), "d": dpath(v["pts"]), "w": round(w, 2),
            "lx": round(50 + mid[0]/S, 1), "ly": round(50 + mid[1]/S, 1), "rot": round(rot, 1),
        })

    def arr(xs): return "[" + ",".join(xs) + "]"
    map_ts = f"""// GENERATED by scripts/geo/generate_world.py — DO NOT hand-edit.
// 2D map geometry from the SAME real Lokoja data as the 3D world (OpenStreetMap, ODbL).
export interface GeoMapLabel {{ name: string; x: number; y: number; kind: string }}

export const GEO_MAP_TRUNK: string[] = {arr(['"' + d + '"' for d in tiers['trunk']])}

export const GEO_MAP_MAIN: string[] = {arr(['"' + d + '"' for d in tiers['main']])}

export const GEO_MAP_MINOR: string[] = {arr(['"' + d + '"' for d in tiers['minor']])}

export const GEO_MAP_WATER: string[] = {arr(['"' + d + '"' for d in water])}

export interface GeoMapRiver {{ id: string; name: string | null; d: string; w: number; lx: number; ly: number; rot: number }}

export const GEO_MAP_RIVERS: GeoMapRiver[] = [
{chr(10).join(f'  {{ id: {json.dumps(rv["id"])}, name: {json.dumps(rv["name"])}, d: "{rv["d"]}", w: {rv["w"]}, lx: {rv["lx"]}, ly: {rv["ly"]}, rot: {rv["rot"]} }},' for rv in river_meta)}
]

export const GEO_MAP_BRIDGES: [number, number][] = {arr([f'[{fmt(50 + x / S)},{fmt(50 + z / S)}]' for x, z in bridge_dots])}

export const GEO_MAP_LABELS: GeoMapLabel[] = [
{chr(10).join(f'  {{ name: {json.dumps(nm)}, x: {mx:.2f}, y: {my:.2f}, kind: "{kind}" }},' for nm, mx, my, kind in labels)}
]
"""
    with open(OUT_MAP, "w") as f:
        f.write(map_ts)
    print(f"wrote {OUT_MAP} ({os.path.getsize(OUT_MAP):,} bytes)")

if __name__ == "__main__":
    main()
