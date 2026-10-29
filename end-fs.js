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
