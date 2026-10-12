#!/usr/bin/env python3
"""Extract all school/education POIs + tagged school grounds from the downloaded OSM tiles.

Outputs scripts/geo/schools.json with ways/relations that are schools, colleges,
universities, kindergartens, plus named education buildings. Coordinates are
lat/lon centroids + bbox, plus name, tags. (c) OpenStreetMap contributors, ODbL.
"""
import glob
import json
import math
import xml.etree.ElementTree as ET
from collections import defaultdict

TILES = sorted(glob.glob("/home/z/my-project/scripts/geo/tiles/*.osm"))

EDU_AMENITY = {"school", "college", "university", "kindergarten", "language_school", "prep_school"}
EDU_BUILDING = {"school", "college", "university", "kindergarten"}
NAME_KEYWORDS = ("school", "college", "academy", "university", "nursery", "institute", "model science")

def is_edu(tags):
    if tags.get("amenity") in EDU_AMENITY or tags.get("building") in EDU_BUILDING:
        return True
    if tags.get("landuse") == "education":
        return True
    name = tags.get("name", "").lower()
    if name and any(k in name for k in NAME_KEYWORDS):
        return True
    return False

nodes = {}          # id -> (lat, lon)
ways_nodes = {}     # way id -> [node ids]
edu_ways = []       # collected education areas
edu_nodes = []      # node-level POIs

for tile in TILES:
    for event, el in ET.iterparse(tile, events=("start", "end")):
        if event == "end":
            if el.tag == "node":
                nid = int(el.get("id"))
                nodes[nid] = (float(el.get("lat")), float(el.get("lon")))
                tags = {t.get("k"): t.get("v") for t in el.findall("tag")}
                if is_edu(tags):
                    edu_nodes.append({"id": nid, "lat": nodes[nid][0], "lon": nodes[nid][1], "tags": tags})
                el.clear()
            elif el.tag == "way":
                wid = int(el.get("id"))
                refs = [int(nd.get("ref")) for nd in el.findall("nd")]
                ways_nodes[wid] = refs
                tags = {t.get("k"): t.get("v") for t in el.findall("tag")}
                if is_edu(tags):
                    edu_ways.append({"id": wid, "refs": refs, "tags": tags})
                el.clear()
            elif el.tag == "relation":
                el.clear()

print(f"nodes: {len(nodes)}, edu node POIs: {len(edu_nodes)}, edu ways: {len(edu_ways)}")


def centroid(refs):
    pts = [nodes[r] for r in refs if r in nodes]
    if not pts:
        return None, None, None
    lat = sum(p[0] for p in pts) / len(pts)
    lon = sum(p[1] for p in pts) / len(pts)
    lats = [p[0] for p in pts]; lons = [p[1] for p in pts]
    return (lat, lon), (min(lats), min(lons), max(lats), max(lons)), pts


out = []
for w in edu_ways:
    c, bbox, pts = centroid(w["refs"])
    if c is None:
        continue
    area_pts = pts + [pts[0]]
    out.append({
        "type": "way", "osm_id": w["id"],
        "lat": c[0], "lon": c[1],
        "bbox": list(bbox), "poly": [[round(p[0], 6), round(p[1], 6)] for p in area_pts],
        "tags": w["tags"],
    })

for n in edu_nodes:
    out.append({
        "type": "node", "osm_id": n["id"],
        "lat": n["lat"], "lon": n["lon"],
        "bbox": None, "poly": None, "tags": n["tags"],
    })

with open("/home/z/my-project/scripts/geo/schools.json", "w") as f:
    json.dump(out, f, indent=1)

# summary print
named = sorted([o for o in out if o["tags"].get("name")], key=lambda o: o["tags"]["name"])
print(f"total edu POIs: {len(out)}, named: {len(named)}")
for o in named:
    kind = o["tags"].get("amenity") or o["tags"].get("building")
    print(f"  [{kind}] {o['tags']['name']}  @ ({o['lat']:.5f},{o['lon']:.5f}) type={o['type']}")
