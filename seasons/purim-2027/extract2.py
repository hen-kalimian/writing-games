import re, json, io

def strip_arts(obj):
    if isinstance(obj, dict):
        return {k: strip_arts(v) for k, v in obj.items() if k != 'arts'}
    if isinstance(obj, list):
        return [strip_arts(x) for x in obj]
    return obj

files = ["game-find.html","game-maze.html","game-runner.html","game-quiz-a23.html","game-quiz-a45.html","game-quiz-a68.html","coloring-a23.html","coloring-a45.html","coloring-a68.html"]
out = {}
for fn in files:
    s = io.open(fn, encoding='utf-8').read()
    m = re.search(r'var D=(\{.*?\});', s, re.S)
    if m:
        try:
            data = json.loads(m.group(1))
            out[fn] = strip_arts(data)
        except Exception as e:
            out[fn] = {"ERROR": str(e)}
    else:
        out[fn] = {"ERROR": "no var D found"}
with io.open("extracted_slim.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
for k,v in out.items():
    print(k, len(json.dumps(v, ensure_ascii=False)))
