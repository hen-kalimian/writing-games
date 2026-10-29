/* הקול של חן בכל משחק (חן, 29.10.26: "תנחה את כל יוצרי המשחקים שלך להשתמש בקול שלי").
   כל משחק חדש טוען את הקובץ הזה ומשמיע דרכו כל טקסט: אם חן הקליטה אותו באולפן, נשמעת ההקלטה שלה; אחרת הקול הממוחשב שהמשחק נותן.
   שימוש:  <script src="../hen-voice.js"></script>
           HenVoice.url('מצאו שתי אותיות זהות', 'audio/i_x.mp3', function(u){ play(u) })
           HenVoice.letter('ג', fallbackUrl, cb)  // שם האות בקול של חן
           HenVoice.number(5, fallbackUrl, cb)     // שם המספר בקול של חן
   המפתח של כל טקסט זהה למפתח באולפן (ttsKey), ולכן כל טקסט שחסר באולפן מוסיפים ל-studio/requests.json. */
(function () {
  var base = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/hen-voice\.js.*$/, '') : '../' })();
  var HEN = null, wait = [];
  function load(cb) { if (HEN) return cb(HEN); wait.push(cb); if (wait.length > 1) return;
    fetch(base + 'play/assets/hen/index.json?v=' + Math.floor(Date.now() / 3e5)).then(function (r) { return r.ok ? r.json() : {} }).catch(function () { return {} })
      .then(function (j) { HEN = j || {}; var w = wait; wait = []; w.forEach(function (f) { f(HEN) }) }) }
  function key(t) { t = String(t || '').replace(/\s+/g, ' ').trim(); var h = 2166136261; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0 } return ('0000000' + h.toString(16)).slice(-8) }
  var LN = { 'א': 'אָלֶף', 'ב': 'בֵּית', 'ג': 'גִּימֶל', 'ד': 'דָּלֶת', 'ה': 'הֵא', 'ו': 'וָו', 'ז': 'זַיִן', 'ח': 'חֵית', 'ט': 'טֵית', 'י': 'יוֹד', 'כ': 'כָּף', 'ל': 'לָמֶד', 'מ': 'מֵם', 'נ': 'נוּן', 'ס': 'סָמֶךְ', 'ע': 'עַיִן', 'פ': 'פֵּא', 'צ': 'צָדִי', 'ק': 'קוֹף', 'ר': 'רֵישׁ', 'ש': 'שִׁין', 'ת': 'תָּו',
    'ך': 'כָּף סוֹפִית', 'ם': 'מֵם סוֹפִית', 'ן': 'נוּן סוֹפִית', 'ף': 'פֵּא סוֹפִית', 'ץ': 'צָדִי סוֹפִית' };
  var NUM = ['אֶפֶס', 'אַחַת', 'שְׁתַּיִם', 'שָׁלוֹשׁ', 'אַרְבַּע', 'חָמֵשׁ', 'שֵׁשׁ', 'שֶׁבַע', 'שְׁמוֹנֶה', 'תֵּשַׁע', 'עֶשֶׂר', 'אַחַת עֶשְׂרֵה', 'שְׁתֵּים עֶשְׂרֵה', 'שְׁלוֹשׁ עֶשְׂרֵה', 'אַרְבַּע עֶשְׂרֵה', 'חֲמֵשׁ עֶשְׂרֵה', 'שֵׁשׁ עֶשְׂרֵה', 'שְׁבַע עֶשְׂרֵה', 'שְׁמוֹנֶה עֶשְׂרֵה', 'תְּשַׁע עֶשְׂרֵה', 'עֶשְׂרִים'];
  function url(text, fallback, cb) { load(function (h) { var k = key(text); cb(h[k] ? base + 'play/assets/hen/' + k + '.mp3?v=' + h[k] : fallback) }) }
  function urlSync(text, fallback) { var k = key(text); return HEN && HEN[k] ? base + 'play/assets/hen/' + k + '.mp3?v=' + HEN[k] : fallback }
  window.HenVoice = { key: key, load: load, url: url, urlSync: urlSync, letterName: function (l) { return LN[l] || '' }, numberName: function (n) { return NUM[+n] || '' },
    letter: function (l, fb, cb) { url(LN[l] || l, fb, cb) }, number: function (n, fb, cb) { url(NUM[+n] || String(n), fb, cb) } };
  load(function () {});
})();
