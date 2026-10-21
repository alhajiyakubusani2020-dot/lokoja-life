import re, html, sys

f = sys.argv[1] if len(sys.argv) > 1 else 'html_Lokoja.html'
h = open(f).read()

# strip scripts/styles
h = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', h, flags=re.S)
# capture section headings
out = []
for m in re.finditer(r'<h([23])[^>]*>(.*?)</h\1>|<p[^>]*>(.*?)</p>', h, re.S):
    if m.group(1):
        t = re.sub(r'<[^>]+>', '', m.group(2))
        out.append('\n## ' + html.unescape(t).strip() + '\n')
    else:
        t = re.sub(r'<[^>]+>', '', m.group(3))
        t = html.unescape(t).strip()
        if t: out.append(t)

text = '\n'.join(out)
text = re.sub(r'\n{3,}', '\n\n', text)
print(text[:12000])
