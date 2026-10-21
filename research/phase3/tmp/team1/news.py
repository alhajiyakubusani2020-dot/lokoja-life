#!/usr/bin/env python3
"""Google News RSS batch fetcher for Lokoja research."""
import subprocess, re, html, json, sys, time

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"

QUERIES = [
    ("mtpatti", "Mount Patti Lokoja"),
    ("flood2022", "Lokoja flood 2022 submerged"),
    ("nihisa", "NIHSA Lokoja River Niger level flood"),
    ("harmattan25", "harmattan dust haze Nigeria 2025"),
    ("sandmining", "River Niger sand mining Lokoja dredging"),
    ("confluence", "Niger Benue confluence Lokoja tourism"),
    ("vegetation", "Kogi State vegetation savanna tree species"),
    ("geology", "Kogi State geology basement complex Lokoja"),
    ("elevation", "Lokoja elevation floodplain meters"),
    ("ganaja", "Ganaja Lokoja river village"),
    ("wards", "Lokoja Local Government Area wards"),
    ("sunrise", "Lokoja sunrise sunset time"),
    ("climate", "Lokoja climate rainfall annual"),
    ("harmattan2026", "harmattan Nigeria 2026 weather"),
    ("flood2025", "Lokoja flood 2025"),
]

def fetch(q, out):
    url = f"https://news.google.com/rss/search?q={q.replace(' ', '+')}&hl=en-NG&gl=NG&ceid=NG:en"
    r = subprocess.run(["curl", "-s", "-m", "25", "-A", UA, url], capture_output=True, text=True)
    xml = r.stdout
    items = re.findall(r"<item>(.*?)</item>", xml, re.S)
    rows = []
    for it in items[:10]:
        t = re.search(r"<title>(.*?)</title>", it, re.S)
        d = re.search(r"<pubDate>(.*?)</pubDate>", it, re.S)
        s = re.search(r"<source[^>]*>(.*?)</source>", it, re.S)
        l = re.search(r"<link/?>?", it)
        rows.append({
            "title": html.unescape(t.group(1)).strip() if t else "",
            "date": d.group(1).strip() if d else "",
            "source": html.unescape(s.group(1)).strip() if s else "",
        })
    return rows

allout = {}
for key, q in QUERIES:
    try:
        rows = fetch(q, key)
        allout[key] = {"query": q, "rows": rows}
        print(f"== {key}: {q} — {len(rows)} items")
        for r in rows[:8]:
            print(f"   {r['date'][:16]} | {r['source'][:28]} | {r['title'][:95]}")
        time.sleep(1.5)
    except Exception as e:
        print(f"== {key}: ERR {e}")

json.dump(allout, open("news_all.json", "w"), indent=1)
print("\nsaved news_all.json")
