/* שער כניסה למשחקים (חן, 4.11.26): המשחק נפתח בלי בעיה כשהוא בתוך האתר של חן או התוכנית (הטמעה, או כפתור מסך מלא שנפתח משם).
   מי שפותח קישור ישיר שהועבר אליה חייבת להתחבר לאתר, ורק מי שיש לה מנוי פעיל בתוכנית נכנסת.
   שימו לב (גילוי נאות): הדף סטטי, ולכן זו הגנה מפני העברת קישורים, לא הגנה מוחלטת מפני מי שמתעקש ויודע לערוך קוד בדפדפן. */
(function () {
  var H = location.hostname;
  var qs = new URLSearchParams(location.search);
  if (/^(localhost|127\.0\.0\.1)$/.test(H) && !qs.has('wgtest')) return;
  /* משחקי דוגמה ציבוריים (חן, 15.11.26): נפתחים לכולן בלי התחברות, כדי לשלוח ללקוחות. להוסיף כאן עוד מזהי משחק לפי בקשה */
  if (/\/games\/(g4yir)\//.test(location.pathname) && !qs.has('wgtest')) return;
  var okHost = function (h) { return h === H || /^(localhost|127\.0\.0\.1)$/.test(h) || /(^|\.)talkwithkids\.co\.il$/.test(h) || /(^|\.)(wixusercontent\.com|filesusr\.com|usrfiles\.com|wix\.com|wixsite\.com|editorx\.io|wixstudio\.com)$/.test(h) };
  var ok = false;
  /* כלי המיפוי (חן, 22.11.26): מוצר בתשלום, "המיפוי זה משהו אחר לגמרי". הוא נפתח רק מתוך הפאנל החדש בתשלום באתר של חן (הטמעה או קישור משם),
     או אצל חן עצמה (דגל wg-owner שנקבע בדף הפרטי שלה). התחברות לתוכנית ומנוי פעיל אחר, כולל הכשרה, לא פותחים אותו.
     מעקב ההתקדמות (progress) הוא כלי נפרד וחינמי לכל משתתפות ההכשרה, ולכן עובד כמו שאר המשחקים. */
  var isMap = /\/mapping\//.test(location.pathname);
  var isProg = /\/progress\//.test(location.pathname);
  if (isMap) {
    try { ok = localStorage.getItem('wg-owner') === '1' } catch (e) {}
    if (!ok && !qs.has('wgtest')) {
      var mh = [];
      try { mh.push(new URL(document.referrer).hostname) } catch (e) {}
      try { for (var j = 0; j < (location.ancestorOrigins || []).length; j++) mh.push(new URL(location.ancestorOrigins[j]).hostname) } catch (e) {}
      ok = mh.some(function (h) { return /(^|\.)talkwithkids\.co\.il$/.test(h) || /(^|\.)(wixusercontent\.com|filesusr\.com|usrfiles\.com|wix\.com|wixsite\.com|editorx\.io|wixstudio\.com)$/.test(h) });
    }
    if (ok) return;
  }
  if (!isMap) { try { ok = sessionStorage.getItem('wgok') === '1' } catch (e) {} }
  if (!ok && !isMap) { try { ok = (+localStorage.getItem('wg-member-until') || 0) > Date.now() } catch (e) {} }
  if (!ok && !isMap && !qs.has('wgtest')) {
    var hosts = [];
    try { hosts.push(new URL(document.referrer).hostname) } catch (e) {}
    try { for (var i = 0; i < (location.ancestorOrigins || []).length; i++) hosts.push(new URL(location.ancestorOrigins[i]).hostname) } catch (e) {}
    ok = hosts.some(okHost);
    if (!ok && document.referrer) { try { ok = new URL(document.referrer).hostname === H } catch (e) {} }
  }
  if (ok) { try { sessionStorage.setItem('wgok', '1') } catch (e) {} return }
  /* נחסם: מחליפים את כל הדף במסך כניסה, וכל קוד המשחק לא ירוץ */
  var back = location.origin + location.pathname + (function () { var p = new URLSearchParams(location.search); ['code', 'state', 'error', 'error_description'].forEach(function (k) { p.delete(k) }); var s = p.toString(); return s ? '?' + s : '' })();
  var headHtml = '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>כניסה לתוכנית</title>' +
    /*חן 8.11.26: 'הפונט לא בסגנון שלי': אותו גופן כמו במשחקים*/'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap" rel="stylesheet">' +
    '<style>*{box-sizing:border-box}html,body{margin:0;height:100%;font-family:Rubik,Arial,sans-serif;background:linear-gradient(180deg,#fff,#FEF6F5);color:#4A2C3A}' +
    '.w{min-height:100%;display:grid;place-items:center;padding:20px;text-align:center}.c{max-width:420px;background:#fff;border:3px solid #FBC5D6;border-radius:26px;padding:26px 22px;box-shadow:0 6px 18px rgba(184,35,107,.12)}' +
    'h1{font-size:24px;font-weight:800;color:#B8236B;margin:0 0 10px}p{font-size:17px;line-height:1.5;margin:0 0 18px;color:#6b4a5a}' +
    'button,a.b{font:800 19px Rubik,Arial;color:#fff;background:#EF406E;border:0;border-radius:99px;padding:12px 30px;box-shadow:0 4px 0 #D14175;cursor:pointer;text-decoration:none;display:inline-block}' +
    'a.b.alt{background:#fff;color:#D14175;border:3px solid #F8B9B6;box-shadow:none;margin-top:12px}#msg{margin-top:14px;font-size:16px;color:#B8236B;min-height:22px}</style>';
  var bodyHtml = '' +
    '<div class="w"><div class="c"><h1>' + (/\/mapping\//.test(location.pathname) ? 'כלי המיפוי זמין' : 'המשחק הזה זמין') + ' למשתתפות התוכנית</h1><p id="t">' + (/\/mapping\//.test(location.pathname) ? 'כדי להיכנס' : 'כדי לשחק') + ', התחברי לאתר עם המשתמש של התוכנית. מי שיש לה מנוי פעיל נכנסת מיד.</p>' +
    '<button id="go" type="button">התחברות לתוכנית</button><div id="msg"></div><div><a class="b alt" href="https://www.talkwithkids.co.il/">לאתר של חן</a></div></div></div>' +
    '';
  var code = '' +
    'const CLIENT="4eb1ece7-08e9-4d05-9fc7-09c5824b2fc0",BACK=' + JSON.stringify(back) + ',RET="https://hen-kalimian.github.io/writing-games/gate-return.html",OA="wg-gate-oauth";' +
    'const $=id=>document.getElementById(id),msg=t=>{$("msg").textContent=t};' +
    'let sdk=null;async function client(){if(sdk)return sdk;const m=await import("https://esm.sh/@wix/sdk@1.21.16");sdk={m,c:m.createClient({auth:m.OAuthStrategy({clientId:CLIENT})})};return sdk}' +
    '$("go").onclick=async()=>{$("go").disabled=true;msg("עוברות להתחברות...");try{const s=await client();const od=s.c.auth.generateOAuthData(RET,RET);localStorage.setItem(OA,JSON.stringify(od));localStorage.setItem("wg-gate-back",BACK);const {authUrl}=await s.c.auth.getAuthUrl(od);(window.top||window).location.href=authUrl}catch(e){msg("לא הצלחנו לפתוח את ההתחברות, אפשר לנסות שוב");$("go").disabled=false}};';
  if (isMap) { bodyHtml = '<div class="w"><div class="c"><h1>כלי המיפוי זמין בפאנל המיפוי בלבד</h1><p>הכלי נפתח מתוך הפאנל באתר של חן. התחברות לתוכנית אינה מספיקה כדי להיכנס אליו.</p><a class="b" href="https://www.talkwithkids.co.il/">לאתר של חן</a></div></div>'; code = ''; }
  if (isProg) { bodyHtml = bodyHtml.replace('המשחק הזה זמין', 'מעקב ההתקדמות זמין').replace('כדי לשחק', 'כדי להיכנס'); }
    /* מחליפים את כל הדף בצומת חדש: שאר הדף המקורי ימשיך להיטען אל עץ מנותק, ולכן קוד המשחק והצלילים שלו לא ירוצו */
  var nh = document.createElement('html'); nh.setAttribute('lang', 'he'); nh.setAttribute('dir', 'rtl');
  nh.innerHTML = '<head>' + headHtml + '</head><body>' + bodyHtml + '</body>';
  document.replaceChild(nh, document.documentElement);
  var sc = document.createElement('script'); sc.type = 'module'; sc.textContent = code; document.body.appendChild(sc);

})();

/* __LETTERBIG (חן, 18.11.26): בכל מקום שכתוב שם של אות במילים ("האות גימל", "באות הא") מופיעה האות עצמה,
   גדולה משאר המשפט ומודגשת במסגרת ורודה. רק על התצוגה; הקול נשאר כמו שהוא. */
(function () {
  try {
    var M = '[\u0591-\u05C7]*';
    var sp = function (w) { return w.split('').join(M) + M };
    var NAMES = [['כף סופית', 'ך'], ['מם סופית', 'ם'], ['נון סופית', 'ן'], ['פא סופית', 'ף'], ['פה סופית', 'ף'], ['צדי סופית', 'ץ'], ['צדיק סופית', 'ץ'], ['שין ימנית', 'שׁ'], ['שין שמאלית', 'שׂ'],
      ['אלף', 'א'], ['בית', 'ב'], ['גימל', 'ג'], ['דלת', 'ד'], ['הא', 'ה'], ['הי', 'ה'], ['ואו', 'ו'], ['וו', 'ו'], ['זין', 'ז'], ['חית', 'ח'], ['טית', 'ט'], ['יוד', 'י'], ['כף', 'כ'], ['למד', 'ל'], ['מם', 'מ'], ['נון', 'נ'],
      ['סמך', 'ס'], ['עין', 'ע'], ['פא', 'פ'], ['פה', 'פ'], ['צדיק', 'צ'], ['צדי', 'צ'], ['קוף', 'ק'], ['ריש', 'ר'], ['שין', 'ש'], ['סין', 'שׂ'], ['תיו', 'ת'], ['תו', 'ת']];
    var alt = NAMES.map(function (n) { return n[0].split(' ').map(sp).join('\\s+') }).join('|');
    var RE = new RegExp('((?:^|[^\u05D0-\u05EA\u0591-\u05C7])(?:[\u05D4\u05D1\u05DC\u05DE\u05D5\u05E9]' + M + ')?' + sp('אות') + '(?:' + sp('יות') + ')?\\s+)(' + alt + ')(?![\u05D0-\u05EA])', 'g');
    var strip = function (s) { return s.replace(/[֑-ׇ]/g, '').replace(/\s+/g, ' ') };
    var MAP = {}; NAMES.forEach(function (n) { MAP[n[0]] = n[1] });
    var css = '.wgL{display:inline-block;font-size:1.45em;font-weight:800;color:#B8236B;background:#FDE1EA;border:2px solid #F8B9B6;border-radius:.35em;padding:0 .24em;margin:0 .06em;line-height:1.15;vertical-align:middle;font-style:normal}';
    var SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|NOSCRIPT|CODE)$/;
    function fix(root) {
      if (!root || !document.body) return;
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), list = [], n;
      while ((n = w.nextNode())) { var p = n.parentNode; if (!p || SKIP.test(p.nodeName) || (p.closest && (p.closest('.wgL') || p.closest('svg')))) continue; RE.lastIndex = 0; if (RE.test(n.nodeValue)) list.push(n) }
      list.forEach(function (t) {
        var s = t.nodeValue, out = document.createDocumentFragment(), last = 0, m; RE.lastIndex = 0;
        while ((m = RE.exec(s))) {
          var start = m.index + m[1].length; out.appendChild(document.createTextNode(s.slice(last, start)));
          var g = MAP[strip(m[2])] || m[2]; var e = document.createElement('span'); e.className = 'wgL'; e.textContent = g; out.appendChild(e); last = start + m[2].length;
        }
        out.appendChild(document.createTextNode(s.slice(last)));
        t.parentNode.replaceChild(out, t);
      });
    }
    var queued = false;
    function sched() { if (queued) return; queued = true; setTimeout(function () { queued = false; fix(document.body) }, 40) }
    function start() {
      if (!document.getElementById('wgLcss')) { var st = document.createElement('style'); st.id = 'wgLcss'; st.textContent = css; (document.head || document.documentElement).appendChild(st) }
      fix(document.body);
      try { new MutationObserver(sched).observe(document.body, { childList: true, subtree: true, characterData: true }) } catch (e) {}
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  } catch (e) {}
})();
