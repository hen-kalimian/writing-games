/* סיום משחק במסך מלא (חן, 29.10.26): "בסיום כל משחק יופיע X סגור או משולש שחקו שוב, בכל המשחקים, במסך מלא,
   ככה הילדים יוכלו לחזור לאתר שלי". קובץ אחד לכל המשחקים.
   מופעל כשמשחק נגמר: משחק ששולח parent.postMessage({wgDone:1}) נתפס לבד, ומשחק אחר קורא ל-WGEnd().
   מופיע רק במסך מלא (מסך מלא אמיתי, או הלשונית הנפרדת של "משחק במסך מלא" fsm=1).
   X = יציאה מהמסך המלא וחזרה לשיעור באתר. משולש = שחקו שוב (כפתור "שוב" של המשחק אם יש, אחרת טעינה מחדש). */
(function () {
  if (window.WGEnd) return;
  var d = document, top = window.self === window.top, FSM = /[?&]fsm=1/.test(location.search);
  function inFs() { return !!(d.fullscreenElement || d.webkitFullscreenElement) || (FSM && top) }
  function css() {
    if (d.getElementById('wgend-css')) return;
    var s = d.createElement('style'); s.id = 'wgend-css';
    s.textContent = '#wgend{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;gap:clamp(22px,6vw,56px);background:rgba(253,225,234,.55);backdrop-filter:blur(3px);animation:wgendIn .4s ease}' +
      '@keyframes wgendIn{from{opacity:0}to{opacity:1}}' +
      '#wgend button{position:static!important;transform:none;margin:0!important;padding:0!important;flex:none!important;width:clamp(96px,22vw,150px);height:clamp(96px,22vw,150px);border-radius:50%;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 0 rgba(0,0,0,.12),0 0 0 6px #fff;animation:wgendPop .5s cubic-bezier(.2,1.6,.4,1)}' +
      '#wgend button:active{transform:translateY(4px)}#wgend svg{width:50%;height:50%}' +
      '#wgend .wgx{background:#FBC5D6!important}#wgend .wgagain{background:#EF406E!important}' +
      '@keyframes wgendPop{from{transform:scale(.4)}to{transform:scale(1)}}';
    (d.head || d.documentElement).appendChild(s);
  }
  function close() {
    var o = d.getElementById('wgend'); if (o) o.remove();
    try { if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d) } catch (e) {}
    if (FSM && top) { // הלשונית הנפרדת: סוגרים אותה, והשיעור פתוח בלשונית הקודמת
      var b = [].filter.call(d.querySelectorAll('button,[role=button],a'), function (x) { return /סגירה|יציאה/.test(x.textContent || x.getAttribute('aria-label') || '') })[0];
      if (b) { b.click(); return }
      try { window.close() } catch (e) {} setTimeout(function () { if (!window.closed && history.length > 1) history.back() }, 300);
    }
  }
  function again() {
    var o = d.getElementById('wgend'); if (o) o.remove();
    if (typeof window.WGEnd.replay === 'function') return window.WGEnd.replay();
    var re = /שוב|שחקו|משחקים|עוד פעם|again|replay|נוסעים/i, nk = function (t) { return String(t || '').replace(/[֑-ׇ]/g, '') };
    var btn = [].filter.call(d.querySelectorAll('button,[role=button],.btn,a'), function (x) { if (x.closest && x.closest('#wgend')) return false;
      var st = getComputedStyle(x); return x.offsetParent !== null && st.visibility !== 'hidden' && re.test(nk((x.textContent || '') + ' ' + (x.getAttribute('aria-label') || '')));
    })[0];
    if (btn) btn.click(); else location.reload();
  }
  var shown = 0;
  function WGEnd() {
    if (!inFs() || d.getElementById('wgend') || Date.now() - shown < 1500) return;
    shown = Date.now();
    setTimeout(function () {
      if (!inFs() || d.getElementById('wgend')) return;
      css(); var o = d.createElement('div'); o.id = 'wgend'; o.setAttribute('dir', 'rtl');
      o.innerHTML = '<button class="wgx" type="button" aria-label="סגירה וחזרה לאתר"><svg viewBox="0 0 24 24" fill="none" stroke="#B8236B" stroke-width="3.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<button class="wgagain" type="button" aria-label="שחקו שוב"><svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg></button>';
      o.querySelector('.wgx').onclick = close; o.querySelector('.wgagain').onclick = again;
      (d.body || d.documentElement).appendChild(o);
    }, 1600);
  }
  window.WGEnd = WGEnd;
  // משחקים ששולחים wgDone: בלשונית נפרדת ההודעה מגיעה לחלון עצמו; בתוך האתר (iframe) עוטפים את parent כדי לשמוע אותה
  addEventListener('message', function (e) { try { if (e.data && e.data.wgDone && e.source === window) WGEnd() } catch (x) {} });
  if (!top) {
    try {
      var real = window.parent;
      window.parent = { postMessage: function (m, o, t) { try { if (m && m.wgDone) WGEnd() } catch (x) {} return real.postMessage(m, o, t) }, location: real.location, frames: real.frames, window: real };
    } catch (e) {}
  }
  // יציאה ידנית מהמסך המלא מעלימה את הכפתורים
  function fsc() { if (!(d.fullscreenElement || d.webkitFullscreenElement) && !(FSM && top)) { var o = d.getElementById('wgend'); if (o) o.remove() } }
  d.addEventListener('fullscreenchange', fsc); d.addEventListener('webkitfullscreenchange', fsc);
})();
/* כפתור מסך מלא תמיד לחיץ (חן, 30.10.26: "בהטמעה אין לי מסך מלא"): כשמסך הפתיחה מכסה את הכפתור,
   מוצג עותק קטן שלו באותו מקום מעל מסך הפתיחה, ולחיצה עליו לוחצת על הכפתור המקורי */
(function(){
  var cl=null;
  function fsOn(){ return !!(document.fullscreenElement||document.webkitFullscreenElement) }
  /* חן, 30.10.26: "אין צורך שהמלל מסך מלא יהיה גדול כל כך": אייקון קטן בלבד (בלשונית מסך מלא נשאר "סגירה") */
  var ICO='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="position:static;width:18px;height:18px"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  function slim(){ [].forEach.call(document.querySelectorAll('[data-fsb],#fs'),function(b){ var tx=(b.textContent||'').trim(); if(/סגירה|יציאה|חזרה/.test(tx)) return; if(!b.hasAttribute('data-fsb')&&!/מסך מלא/.test(tx)) return; if(b.hasAttribute('data-fsb')&&b.getAttribute('aria-label')!=='מסך מלא') return;
    var sp=b.querySelector('span'); if(sp) sp.remove(); if(!b.hasAttribute('data-fsb')&&/מסך מלא/.test(b.textContent||'')){ b.innerHTML=ICO; b.setAttribute('aria-label','מסך מלא'); b.title='מסך מלא' }
    if(b.style.width!=='38px'){ b.style.setProperty('width','38px','important'); b.style.setProperty('min-width','38px','important'); b.style.setProperty('padding','0','important'); b.style.setProperty('border-radius','50%','important') } }) }
  function tick(){ slim();
    var b=document.querySelector('#fs,[data-fsb],button[aria-label="מסך מלא"]:not(#wgfs2)'); if(!b||fsOn()){ if(cl) cl.style.display='none'; return }
    var r=b.getBoundingClientRect(), cs=getComputedStyle(b);
    if(!r.width||cs.display==='none'||cs.visibility==='hidden'){ if(cl) cl.style.display='none'; return }
    var x=r.left+r.width/2, y=r.top+r.height/2, top=document.elementFromPoint(x,y);
    if(cl&&cl.style.display!=='none'){ cl.style.pointerEvents='none'; top=document.elementFromPoint(x,y); cl.style.pointerEvents='' } var covered=top&&top!==b&&!b.contains(top)&&top!==cl&&!(cl&&cl.contains(top));
    if(!covered){ if(cl) cl.style.display='none'; return }
    if(!cl){ cl=document.createElement('button'); cl.type='button'; cl.id='wgfs2'; cl.setAttribute('aria-label','מסך מלא');
      cl.style.cssText='position:fixed;z-index:2147483000;border-radius:50%;border:2.5px solid #FBC5D6;background:#FDE1EA;color:#B8236B;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;touch-action:manipulation';
      cl.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="position:static;width:18px;height:18px"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
      cl.addEventListener('click',function(e){ e.stopPropagation(); e.preventDefault(); var o=document.querySelector('#fs,[data-fsb],button[aria-label="מסך מלא"]:not(#wgfs2)'); if(o) o.click() });
      document.body.appendChild(cl) }
    var s=Math.max(36,Math.min(44,r.height)); cl.style.width=cl.style.height=s+'px'; cl.style.left=(x-s/2)+'px'; cl.style.top=(y-s/2)+'px'; cl.style.display='flex' }
  function start(){ tick(); setInterval(tick,400); addEventListener('resize',tick) }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
/* קאבר פתיחה (חן, 30.10.26, עודכן: "הקאבר שקוף ורק מעט מעט כיסוי, וכפתור הפליי ללא שקיפות"; "כל משחק יהיה עם קאבר שקוף מעט מוחשך וכפתור play משולש בסגנון שלי, ואז כשלוחצים שומעים הנחיה ואז מתחיל המשחק").
   הלחיצה על הקאבר היא הנגיעה הראשונה: המשחק משמיע את ההנחיה ומתחיל. משחקים שיש להם מסך פתיחה עם כפתור משלהם לא מקבלים קאבר */
(function(){
  if(window.WG_NO_COVER) return;
  function hasStart(){ var o=document.getElementById('ov'); if(o&&!o.classList.contains('hidden')&&getComputedStyle(o).display!=='none') return true; /*טייני טפ: יש כבר כפתור התחלה משלו, בלי פליי כפול (31.10.26)*/ var t=document.querySelector('[aria-label="התחלה"]'); return !!(t&&t.offsetParent!==null) }
  function add(){
    if(hasStart()||document.getElementById('wgcover')) return;
    var st=document.createElement('style'); st.textContent='#wgcover{position:fixed;inset:0;z-index:2147482000;display:flex;align-items:center;justify-content:center;background:rgba(74,44,58,.08);cursor:pointer;touch-action:manipulation;transition:opacity .25s}'+
      '#wgcover .pl{width:92px;height:92px;border-radius:50%;background:#EF406E;border:7px solid #FBC5D6;box-shadow:0 10px 24px rgba(184,35,107,.30);display:flex;align-items:center;justify-content:center;animation:wgpulse 1.8s ease-in-out infinite}'+
      '#wgcover svg{width:40px;height:40px;margin-left:6px}@keyframes wgpulse{50%{transform:scale(1.07)}}#wgcover.out{opacity:0;pointer-events:none}';
    document.head.appendChild(st);
    var c=document.createElement('div'); c.id='wgcover'; c.setAttribute('aria-label','להתחלת המשחק');
    c.innerHTML='<div class="pl"><svg viewBox="0 0 24 24"><path d="M7 4.8v14.4c0 .8.9 1.3 1.6.8l11-7.2c.6-.4.6-1.2 0-1.6l-11-7.2C7.9 3.5 7 4 7 4.8z" fill="#fff"/></svg></div>';
    var gone=false; function rm(e){ if(e){ e.preventDefault(); e.stopPropagation() } if(gone) return; gone=true; c.classList.add('out'); setTimeout(function(){ c.remove() },300) }
    c.addEventListener('click',rm); c.addEventListener('pointerup',function(e){ setTimeout(function(){ rm() },60) });
    document.body.appendChild(c);
  }
  function go(){ setTimeout(add,700) }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
})();
