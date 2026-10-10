#!/usr/bin/env python3
"""Extract clean text from page_reader JSON outputs for research analysis."""
import json, re, sys, html as htmlmod
from pathlib import Path

PAGES = Path("/home/z/my-project/research/pages")
OUT = PAGES / "text"
OUT.mkdir(exist_ok=True)

def strip_html(raw: str) -> str:
    raw = re.sub(r"<script[^>]*>[\s\S]*?</script>", " ", raw, flags=re.I)
    raw = re.sub(r"<style[^>]*>[\s\S]*?</style>", " ", raw, flags=re.I)
    raw = re.sub(r"<noscript[^>]*>[\s\S]*?</noscript>", " ", raw, flags=re.I)
    raw = re.sub(r"<!--[\s\S]*?-->", " ", raw)
    # keep some structure
    raw = re.sub(r"<(h[1-6]|p|li|tr|div|section|article|br)\b[^>]*>", "\n", raw, flags=re.I)
    raw = re.sub(r"<[^>]+>", " ", raw)
    raw = htmlmod.unescape(raw)
    raw = re.sub(r"[ \t]+", " ", raw)
    raw = re.sub(r"\n\s*\n+", "\n", raw)
    return raw.strip()

for f in sorted(PAGES.glob("p*.json")):
    try:
        data = json.loads(f.read_text())
    except Exception as e:
        print(f"{f.name}: PARSE ERROR {e}")
        continue
    # data may be nested under 'data'
    d = data.get("data", data) if isinstance(data, dict) else {}
    title = d.get("title", "")
    url = d.get("url", "")
    html_content = d.get("html", "") or d.get("text", "") or ""
    published = d.get("publishedTime", d.get("publish_time", ""))
    text = strip_html(html_content) if "<" in html_content else html_content
    out_name = f.stem + ".txt"
    header = f"SOURCE: {url}\nTITLE: {title}\nPUBLISHED: {published}\n{'='*70}\n"
    (OUT / out_name).write_text(header + text)
    print(f"{f.name} -> {out_name}: {len(text)} chars | title={title[:70]!r}")
print("DONE")
