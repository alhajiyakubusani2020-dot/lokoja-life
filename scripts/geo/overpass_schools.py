#!/usr/bin/env python3
"""Query Overpass API for ALL education POIs in the Lokoja region (full OSM data,
beyond the road-focused tiles). Output scripts/geo/schools_overpass.json.
Data (c) OpenStreetMap contributors, ODbL."""
import json
import urllib.request
import urllib.parse

BBOX = "7.64,6.60,7.96,6.86"  # S,W,N,E — Lokoja LGA + Felele + FUL permanent site
QUERY = f"""
[out:json][timeout:180];
(
  nwr["amenity"~"^(school|college|university|kindergarten)$"]({BBOX});
  nwr["building"~"^(school|college|university|kindergarten)$"]({BBOX});
  nwr["landuse"="education"]({BBOX});
);
out center tags;
"""

url = "https://overpass-api.de/api/interpreter"
data = urllib.parse.urlencode({"data": QUERY}).encode()
req = urllib.request.Request(url, data=data, headers={"User-Agent": "LokojaLife-game-research/1.0"})
with urllib.request.urlopen(req, timeout=200) as r:
    payload = json.load(r)

els = payload.get("elements", [])
out = []
for el in els:
    tags = el.get("tags", {})
    if el["type"] == "node":
        lat, lon = el.get("lat"), el.get("lon")
        poly = None
    elif "center" in el:
        lat, lon = el["center"]["lat"], el["center"]["lon"]
        poly = None
    else:
        lat = el.get("lat"); lon = el.get("lon"); poly = None
    out.append({
        "type": el["type"], "osm_id": el["id"],
        "lat": lat, "lon": lon,
        "poly": poly,
        "name": tags.get("name"),
        "tags": tags,
    })

with open("/home/z/my-project/scripts/geo/schools_overpass.json", "w") as f:
    json.dump(out, f, indent=1)

named = sorted([o for o in out if o.get("name")], key=lambda o: o["name"])
print(f"total: {len(out)}, named: {len(named)}")
for o in named:
    kind = o["tags"].get("amenity") or o["tags"].get("building") or o["tags"].get("landuse")
    print(f"  [{kind:11s}] {o['name'][:48]:48s} @ ({o['lat']:.5f},{o['lon']:.5f})")
unnamed = [o for o in out if not o.get("name")]
print(f"unnamed: {len(unnamed)}")
