import re, html, sys, json

f = sys.argv[1]
h = open(f, encoding='utf-8', errors='ignore').read()

# meta
for prop in ['og:title', 'og:description', 'article:published_time', 'og:type']:
    m = re.search(r'<meta[^>]+(?:property|name)="%s"[^>]+content="([^"]+)"' % re.escape(prop), h)
    if m: print(f'META {prop}: {html.unescape(m.group(1))[:300]}')

print('--- paragraphs ---')
paras = re.findall(r'<p[^>]*>(.*?)</p>', h, re.S)
seen = set()
n = 0
for p in paras:
    t = html.unescape(re.sub(r'<[^>]+>', ' ', p))
    t = re.sub(r'\s+', ' ', t).strip()
    if len(t) < 45 or t.lower().startswith(('click here', 'advertisement', 'follow us', 'related', 'share this', 'copyright', 'all rights')):
        continue
    if t in seen: continue
    seen.add(t)
    print('*', t)
    n += 1
    if n > 40: break
