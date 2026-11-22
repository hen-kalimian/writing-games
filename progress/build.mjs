// בונה את כלי מעקב ההתקדמות (progress/index.html) מתוך דף המיפוי (mapping/index.html).
// למה: חן רוצה שכלי המיפוי וכלי המעקב אחרי הילדים יהיו בשני קישורים נפרדים.
// הרצה אחרי כל שינוי בדף המיפוי:  node progress/build.mjs   (מתוך התיקייה wg)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', 'mapping', 'index.html'), 'utf8');

const modeOld = "PROGRESS = (h === 'progress' || h === 'kids');";
if (!src.includes(modeOld)) throw new Error('שורת מצב המעקב לא נמצאה בדף המיפוי');
let out = src.replace(modeOld, 'PROGRESS = true;');
// תמונות: הנתיב היחסי מצביע לתיקיית המיפוי
out = out.split('img/').join('../mapping/img/').split('../mapping/../mapping/img/').join('../mapping/img/');
out = out.replace(new RegExp('<title>[^<]*<' + '/title>'), '<title>מעקב התקדמות ילדים</title>');
fs.writeFileSync(path.join(here, 'index.html'), out);
console.log('נבנה progress/index.html', out.length, 'תווים');
