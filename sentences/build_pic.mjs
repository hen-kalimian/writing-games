// חן 25.11.26: בונה את משחק "קוראים ומתאימים ציור" מהמשפטים שחן אישרה ומהאיורים שנוצרו להם (img/snt/s_<רשימה>_<מספר>.jpg).
// רק רשימה שיש לכל משפטים שנבחרו לאיור איור קיים נבנית. הרצה: node build_pic.mjs
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
const WG = path.join(os.homedir(), 'yy', 'wg') + '/';
const picks = JSON.parse(fs.readFileSync(WG + 'sentences/picks.json', 'utf8')), sel = JSON.parse(fs.readFileSync(WG + 'sentences/picsel.json', 'utf8'));
const MAP = { kp: 'a', sh: 'shva', ch: 'i', ho: 'o', tz: 'e', sk: 'u' }, HN = { kp: 'קמץ ופתח', sh: 'שווא', ch: 'חיריק', ho: 'חולם', tz: 'צירה וסגול', sk: 'שורוק וקובוץ' };
const BK = path.join(os.homedir(), 'Documents', 'Claude', 'נובמבר 2026', 'גיבוי לפני משפטי חן 25.11.26'); fs.mkdirSync(BK, { recursive: true });
const rnd = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
for (const [key, idxs] of Object.entries(sel)) {
  const [sk, lv] = key.split('-l'); const have = idxs.filter(i => fs.existsSync(WG + 'play/assets/img/snt/s_' + key + '_' + i + '.jpg'));
  if (have.length < idxs.length) { console.log('ממתין לאיורים:', key, have.length + '/' + idxs.length); continue; }
  const list = picks[key]; const id = 'snt_' + MAP[sk] + '_' + lv + '_pic';
  const qs = idxs.map(i => ({ q: { t: list[i].t }, a: rnd([{ i: 'img/snt/s_' + key + '_' + i + '.jpg', ok: true }, ...rnd(idxs.filter(j => j !== i)).slice(0, 2).map(j => ({ i: 'img/snt/s_' + key + '_' + j + '.jpg', ok: false }))]), n: 1 }));
  const f = WG + 'play/data/' + id + '.json'; if (fs.existsSync(f)) fs.copyFileSync(f, path.join(BK, id + '.json'));
  fs.writeFileSync(f, JSON.stringify({ id, title: 'קוראים ומתאימים ציור ' + HN[sk] + ' רמה ' + lv, ins: 'קִרְאוּ אֶת הַמִּשְׁפָּט, וְאָז בַּחֲרוּ אֶת הַצִּיּוּר הַמַּתְאִים', kind: 'quiz', tpl: 5, readFirst: true, opts: 3, qs }));
  console.log('נבנה', id, qs.length, 'שאלות');
}
