// בונה את קובץ המשפטים מקבצי הטקסט של הסימנים
import fs from 'node:fs';
const signs = ['kp','sh','ch','ho','tz','sk']; const out = {};
for (const s of signs) {
  const f = `src/${s}.txt`; if (!fs.existsSync(f)) continue; out[s] = { l1: [], l2: [] }; let cur = null;
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const L = line.trim(); if (!L) continue;
    if (L === '#l1') { cur = 'l1'; continue } if (L === '#l2') { cur = 'l2'; continue }
    const [t, p] = L.split('|'); out[s][cur].push({ id: `${s}-${cur === 'l1' ? 1 : 2}-${String(out[s][cur].length + 1).padStart(2, '0')}`, t: t.trim(), p: p === '0' ? 0 : 1 });
  }
}
fs.writeFileSync('sentences.json', JSON.stringify(out, null, 1));
console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.l1.length}/${v.l2.length}`).join('  '));
