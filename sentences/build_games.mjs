// חן 25.11.26: בונה את משחקי המשפטים (קריאה חוזרת, בונים משפט, מוצאים מילה) מהמשפטים שחן אישרה (picks.json).
// כל רשימה של 20 משפטים: כל משחק לוקח חלק אחר והמשפטים חוזרים בין המשחקים. משחק התמונות נבנה בנפרד כשיש איורים (build_pic.mjs).
// הרצה: node build_games.mjs [--signs=kp,sh,ch]
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
const WG = path.join(os.homedir(), 'yy', 'wg') + '/';
const picks = JSON.parse(fs.readFileSync(WG + 'sentences/picks.json', 'utf8'));
const MAP = { kp: 'a', sh: 'shva', ch: 'i', ho: 'o', tz: 'e', sk: 'u' };
const HN = { kp: 'קמץ ופתח', sh: 'שווא', ch: 'חיריק', ho: 'חולם', tz: 'צירה וסגול', sk: 'שורוק וקובוץ' };
const only = ((process.argv.find(a => a.startsWith('--signs=')) || '').slice(8) || 'kp,sh,ch').split(',');
const BK = path.join(os.homedir(), 'Documents', 'Claude', 'נובמבר 2026', 'גיבוי לפני משפטי חן 25.11.26'); fs.mkdirSync(BK, { recursive: true });
const strip = t => t.replace(/[֑-ׇ]/g, '');
const words = t => t.replace(/[.,!?״"׳:;]/g, ' ').split(/\s+/).filter(Boolean);
const FUNC = new Set(['את', 'ו', 'לא', 'של', 'על', 'עם', 'אל', 'גם', 'כל', 'הוא', 'היא', 'זה', 'זו']);
const rnd = (a, n) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return n == null ? b : b.slice(0, n); };
const save = (id, d) => { const f = WG + 'play/data/' + id + '.json'; if (fs.existsSync(f)) fs.copyFileSync(f, path.join(BK, id + '.json')); fs.writeFileSync(f, JSON.stringify(d)); };
for (const sk of only) for (const L of [1, 2]) {
  const list = picks[sk + '-l' + L]; if (!list || list.length < 12) { console.log('דילוג', sk, L); continue; }
  const P = MAP[sk], S = list.map(x => x.t); const n = S.length;
  const take = (from, c) => Array.from({ length: c }, (_, i) => S[(from + i) % n]);
  save('snt_' + P + '_' + L + '_reread', { id: 'snt_' + P + '_' + L + '_reread', title: 'קריאה חוזרת ' + HN[sk] + ' רמה ' + L, ins: 'קִרְאוּ אֶת הַמִּשְׁפָּט שָׁלוֹשׁ פְּעָמִים', kind: 'reread', lines: take(0, 8) });
  save('snt_' + P + '_' + L + '_order', { id: 'snt_' + P + '_' + L + '_order', title: 'בונים משפט ' + HN[sk] + ' רמה ' + L, ins: '', kind: 'order', tpl: 72, pairs: take(6, 8).map(t => ({ a: { t }, b: {} })) });
  const pool = [...new Set(S.flatMap(words).filter(w => strip(w).length >= 3 && !FUNC.has(strip(w))))];
  const target = rnd(pool, 10);
  save('snt_' + P + '_' + L + '_words', { id: 'snt_' + P + '_' + L + '_words', title: 'מוצאים מילה ' + HN[sk] + ' רמה ' + L, ins: 'לַחֲצוּ עַל הַמִּלָּה שֶׁשּׁוֹמְעִים', kind: 'quiz', tpl: 5, hideWord: true, opts: 4,
    qs: target.map(w => ({ q: { t: w }, a: rnd([{ t: w, ok: true }, ...rnd(pool.filter(x => strip(x) !== strip(w)), 3).map(t => ({ t, ok: false }))]), n: 1 })) });
  console.log(sk, 'רמה', L, 'נבנו: קריאה חוזרת 8, בונים משפט 8, מילים', target.length, '(מאגר ' + pool.length + ')');
}
