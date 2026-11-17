// בודק שכל משפט משתמש רק בסימני הניקוד המותרים לסימן ולרמה
import fs from 'node:fs';
const M = { patah:'ַ', qamats:'ָ', shva:'ְ', hiriq:'ִ', holam:'ֹ', tsere:'ֵ', segol:'ֶ', kubutz:'ֻ', dagesh:'ּ', shin:'ׁ', sin:'ׂ' };
const ORDER = ['kp','sh','ch','ho','tz','sk'];
const OWN = { kp:['patah','qamats'], sh:['shva'], ch:['hiriq'], ho:['holam'], tz:['tsere','segol'], sk:['kubutz'] };
const BASE = ['patah','qamats','dagesh','shin','sin'];
export function allowed(sign, level) {
  const names = new Set(BASE);
  if (level === 1) { OWN[sign].forEach(n => names.add(n)); }
  else { for (const s of ORDER) { OWN[s].forEach(n => names.add(n)); if (s === sign) break } }
  return new Set([...names].map(n => M[n]));
}
export function check(sign, level, text) {
  const al = allowed(sign, level); const bad = new Set();
  const t = text.replace(/לֹא/g, '');            // מילת לא מותרת תמיד (חן כתבה אותה בדוגמאות)
  for (const ch of t) if (/[ְ-ׇ]/.test(ch) && !al.has(ch)) bad.add('U+' + ch.codePointAt(0).toString(16).toUpperCase());
  const words = text.replace(/[.,?!:״"]/g, ' ').trim().split(/\s+/);
  const hebWords = words.filter(w => /[א-ת]/.test(w));
  const noNik = hebWords.filter(w => !/[ְ-ּ]/.test(w)); // מילה בלי ניקוד בכלל
  return { bad: [...bad], nw: hebWords.length, noNik };
}
if (process.argv[1].endsWith('validate.mjs')) {
  const f = process.argv[2]; const d = JSON.parse(fs.readFileSync(f, 'utf8')); let errs = 0;
  for (const sign of Object.keys(d)) for (const lv of [1, 2]) {
    const arr = d[sign]['l' + lv] || []; const seen = new Set();
    arr.forEach((s, i) => {
      const r = check(sign, lv, s.t); const probs = [];
      if (r.bad.length) probs.push('סימן אסור ' + r.bad.join(','));
      if (r.noNik.length) probs.push('בלי ניקוד: ' + r.noNik.join(' '));
      if (lv === 2 && (r.nw < 3 || r.nw > 6)) probs.push('אורך ' + r.nw + ' מילים');
      if (lv === 1 && r.nw > 4) probs.push('ארוך לרמה 1: ' + r.nw);
      if (seen.has(s.t)) probs.push('כפול'); seen.add(s.t);
      if (probs.length) { errs++; console.log(sign, 'l' + lv, i + 1, s.t, '|', probs.join(' ; ')) }
    });
    console.log(sign, 'l' + lv, 'count', arr.length);
  }
  console.log(errs ? 'PROBLEMS ' + errs : 'ALL OK');
}
