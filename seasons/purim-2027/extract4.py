import re, json, io

for fn in ["game-maze.html", "game-runner.html"]:
    s = io.open(fn, encoding='utf-8').read()
    m = re.search(r'var D=(\{.*?\});', s, re.S)
    data = json.loads(m.group(1))
    arts = data.get('arts', {})
    print(fn, list(arts.keys()), [len(v) for v in arts.values()])
