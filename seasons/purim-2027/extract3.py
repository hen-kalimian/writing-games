import io, re, json
out = {}
for fn in ["index.html","age-2-3.html","age-4-5.html","age-6-8.html"]:
    s = io.open(fn, encoding='utf-8').read()
    iframes = re.findall(r'<iframe[^>]*src="([^"]+)"[^>]*>', s)
    h1 = re.findall(r'<h[12][^>]*>([^<]*)</h[12]>', s)
    p = re.findall(r'<p[^>]*>([^<]{5,200})</p>', s)
    out[fn] = {"iframes": iframes, "h": h1, "p": p[:20]}
with io.open("extracted_text.json","w",encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("ok")
