import re, json, io
files = ["game-find.html","game-maze.html","game-runner.html","game-quiz-a23.html","game-quiz-a45.html","game-quiz-a68.html","coloring-a23.html","coloring-a45.html","coloring-a68.html"]
out = {}
for fn in files:
    s = io.open(fn, encoding='utf-8').read()
    m = re.search(r'var D=(\{.*?\});', s, re.S)
    if m:
        try:
            data = json.loads(m.group(1))
            out[fn] = data
        except Exception as e:
            out[fn] = {"ERROR": str(e), "raw_start": m.group(1)[:200]}
    else:
        out[fn] = {"ERROR": "no var D found"}
with io.open("extracted_theme_data.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("done")
