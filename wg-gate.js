/* שער כניסה למשחקים (חן, 4.11.26): המשחק נפתח בלי בעיה כשהוא בתוך האתר של חן או התוכנית (הטמעה, או כפתור מסך מלא שנפתח משם).
   מי שפותח קישור ישיר שהועבר אליה חייבת להתחבר לאתר, ורק מי שיש לה מנוי פעיל בתוכנית נכנסת.
   שימו לב (גילוי נאות): הדף סטטי, ולכן זו הגנה מפני העברת קישורים, לא הגנה מוחלטת מפני מי שמתעקש ויודע לערוך קוד בדפדפן. */
(function () {
  var H = location.hostname;
  var qs = new URLSearchParams(location.search);
  if (/^(localhost|127\.0\.0\.1)$/.test(H) && !qs.has('wgtest')) return;
  var okHost = function (h) { return /(^|\.)talkwithkids\.co\.il$/.test(h) || /(^|\.)(wixusercontent\.com|filesusr\.com|usrfiles\.com|wix\.com|wixsite\.com|editorx\.io|wixstudio\.com)$/.test(h) };
  var ok = false;
  try { ok = sessionStorage.getItem('wgok') === '1' } catch (e) {}
  if (!ok) { try { ok = (+localStorage.getItem('wg-member-until') || 0) > Date.now() } catch (e) {} }
  if (!ok && !qs.has('wgtest')) {
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
    '<style>*{box-sizing:border-box}html,body{margin:0;height:100%;font-family:Rubik,Arial,sans-serif;background:linear-gradient(180deg,#fff,#FEF6F5);color:#4A2C3A}' +
    '.w{min-height:100%;display:grid;place-items:center;padding:20px;text-align:center}.c{max-width:420px;background:#fff;border:3px solid #FBC5D6;border-radius:26px;padding:26px 22px;box-shadow:0 6px 18px rgba(184,35,107,.12)}' +
    'h1{font-size:24px;color:#B8236B;margin:0 0 10px}p{font-size:17px;line-height:1.5;margin:0 0 18px;color:#6b4a5a}' +
    'button,a.b{font:800 19px Rubik,Arial;color:#fff;background:#EF406E;border:0;border-radius:99px;padding:12px 30px;box-shadow:0 4px 0 #D14175;cursor:pointer;text-decoration:none;display:inline-block}' +
    'a.b.alt{background:#fff;color:#D14175;border:3px solid #F8B9B6;box-shadow:none;margin-top:12px}#msg{margin-top:14px;font-size:16px;color:#B8236B;min-height:22px}</style>';
  var bodyHtml = '' +
    '<div class="w"><div class="c"><h1>המשחק הזה זמין למשתתפות התוכנית</h1><p id="t">כדי לשחק, מתחברות לאתר עם המשתמש של התוכנית. מי שיש לה מנוי פעיל נכנסת מיד.</p>' +
    '<button id="go" type="button">התחברות לתוכנית</button><div id="msg"></div><div><a class="b alt" href="https://www.talkwithkids.co.il/">לאתר של חן</a></div></div></div>' +
    '';
  var code = '' +
    'const CLIENT="058da38e-a911-4b84-876e-e5efedfa9ae9",BACK=' + JSON.stringify(back) + ',OA="wg-gate-oauth";' +
    'const $=id=>document.getElementById(id),msg=t=>{$("msg").textContent=t};' +
    'let sdk=null;async function client(){if(sdk)return sdk;const m=await import("https://esm.sh/@wix/sdk@1.21.16");sdk={m,c:m.createClient({auth:m.OAuthStrategy({clientId:CLIENT})})};return sdk}' +
    'async function hasAccess(tok){const H={Authorization:tok.accessToken.value,"content-type":"application/json"};' +
    'try{const r=await fetch("https://www.wixapis.com/pricing-plans/v2/member/orders?limit=100",{headers:H});if(r.ok){const j=await r.json();if((j.orders||[]).some(o=>o.status==="ACTIVE"))return true}}catch(e){}' +
    'try{const r=await fetch("https://www.wixapis.com/online-programs/v3/participants/query",{method:"POST",headers:H,body:JSON.stringify({query:{cursorPaging:{limit:1}}})});if(r.ok){const j=await r.json();if((j.participants||[]).length)return true}}catch(e){}' +
    'return false}' +
    'async function finish(){const u=new URL(location.href);if(!u.searchParams.get("code")||!u.searchParams.get("state"))return false;msg("בודקות את המנוי...");$("go").disabled=true;' +
    'try{const s=await client();const od=JSON.parse(localStorage.getItem(OA)||"null");const r=s.c.auth.parseFromUrl();const tk=await s.c.auth.getMemberTokens(r.code,r.state,od);' +
    'if(await hasAccess(tk)){localStorage.setItem("wg-member-until",String(Date.now()+864e5));try{sessionStorage.setItem("wgok","1")}catch(e){}location.replace(BACK);return true}' +
    '$("t").textContent="לא מצאנו מנוי פעיל בתוכנית עבור המשתמש הזה. אם יש לך גישה, כדאי להתחבר עם המשתמש שאיתו נרשמת.";msg("");$("go").disabled=false;$("go").textContent="להתחבר עם משתמש אחר"}' +
    'catch(e){msg("ההתחברות לא הושלמה, אפשר לנסות שוב");$("go").disabled=false}return true}' +
    '$("go").onclick=async()=>{$("go").disabled=true;msg("עוברות להתחברות...");try{const s=await client();const od=s.c.auth.generateOAuthData(BACK,BACK);localStorage.setItem(OA,JSON.stringify(od));const {authUrl}=await s.c.auth.getAuthUrl(od);(window.top||window).location.href=authUrl}catch(e){msg("לא הצלחנו לפתוח את ההתחברות, אפשר לנסות שוב");$("go").disabled=false}};' +
    'finish();';
    /* מחליפים את כל הדף בצומת חדש: שאר הדף המקורי ימשיך להיטען אל עץ מנותק, ולכן קוד המשחק והצלילים שלו לא ירוצו */
  var nh = document.createElement('html'); nh.setAttribute('lang', 'he'); nh.setAttribute('dir', 'rtl');
  nh.innerHTML = '<head>' + headHtml + '</head><body>' + bodyHtml + '</body>';
  document.replaceChild(nh, document.documentElement);
  var sc = document.createElement('script'); sc.type = 'module'; sc.textContent = code; document.body.appendChild(sc);

})();
