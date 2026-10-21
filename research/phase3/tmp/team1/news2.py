#!/usr/bin/env python3
"""Google News RSS batch 2."""
import subprocess, re, html, json, time

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"

QUERIES = [
    ("sub90", "Lokoja submerged 90 percent flood"),
    ("nema22", "NEMA Lokoja flood displaced 2022"),
    ("cablecar", "Mount Patti cable car Kogi tourism"),
    ("erosion", "Lokoja erosion gully flood control ecological"),
    ("heat", "Lokoja temperature record heat NiMet"),
    ("agbaja", "Agbaja iron ore Itakpe Kogi geology laterite"),
    ("pattigeol", "Patti hill Lokoja basement complex schist"),
    ("vegetation2", "Kogi guinea savanna derived vegetation forest"),
    ("lagdo", "Lagdo dam water release Lokoja NIHSA 2024"),
    ("sand", "Lokoja sand dredging miners Niger river NIMASA"),
    ("pattihistory", "Flora Shaw Nigeria name Mount Patti Lokoja"),
    ("confluencemix", "confluence Niger Benue different colours mix"),
    ("ferry", "Lokoja ferry boat river transport NIWA"),
    ("wards2", "Lokoja LGA 11 wards council"),
]

allout = {}
for key, q in QUERIES:
    try:
        url = f"https://news.google.com/rss/search?q={q.replace(' ', '+')}&hl=en-NG&gl=NG&ceid=NG:en"
        r = subprocess.run(["curl", "-s", "-m", "25", "-A", UA, url], capture_output=True, text=True)
        items = re.findall(r"<item>(.*?)</item>", r.stdout, re.S)
        rows = []
        for it in items[:8]:
            t = re.search(r"<title>(.*?)</title>", it, re.S)
            d = re.search(r"<pubDate>(.*?)</pubDate>", it, re.S)
            s = re.search(r"<source[^>]*>(.*?)</source>", it, re.S)
            rows.append({"title": html.unescape(t.group(1)).strip() if t else "",
                         "date": d.group(1).strip()[:16] if d else "",
                         "source": html.unescape(s.group(1)).strip() if s else ""})
        allout[key] = {"query": q, "rows": rows}
        print(f"== {key}: {q} — {len(rows)}")
        for r_ in rows[:8]:
            print(f"   {r_['date']} | {r_['source'][:26]} | {r_['title'][:95]}")
        time.sleep(1.5)
    except Exception as e:
        print(f"== {key}: ERR {e}")

json.dump(allout, open("news_all2.json", "w"), indent=1)
