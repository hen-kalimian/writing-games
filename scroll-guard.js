/* מאפשר לגלול את העמוד בנייד מעל אזורי משחקים: כל משחק מכוסה בשכבה שקופה עם "לחצי כדי לשחק".
   נגיעה וגרירה על השכבה גוללת את העמוד כרגיל, ונגיעה קצרה מפעילה את המשחק. כפתור "גלילה" מחזיר את הנעילה. */
(function () {
  var touch = false;
  try { touch = window.matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window; } catch (e) { }
  if (!touch) return;
  var css = document.createElement('style');
  css.textContent = '.sg-ov{position:absolute;z-index:20;display:flex;align-items:flex-end;justify-content:center;background:rgba(255,255,255,.02);cursor:pointer;touch-action:pan-y;-webkit-tap-highlight-color:transparent;border-radius:18px}' +
    '.sg-ov span{margin-bottom:14px;background:#EF406E;color:#fff;font:700 15px Rubik,Arial,sans-serif;border-radius:99px;padding:8px 20px;box-shadow:0 3px 0 #D14175;pointer-events:none}' +
    '.sg-lock{position:absolute;z-index:21;background:#fff;color:#B8236B;border:2px solid #F8B9B6;border-radius:99px;font:700 13px Rubik,Arial,sans-serif;padding:5px 12px;cursor:pointer;display:none;box-shadow:0 2px 6px rgba(0,0,0,.12)}';
  document.head.appendChild(css);
  var items = [];
  function place(it) {
    var f = it.f, p = f.offsetParent || f.parentNode;
    var l = f.offsetLeft, t = f.offsetTop, w = f.offsetWidth, h = f.offsetHeight;
    var s = it.ov.style; s.left = l + 'px'; s.top = t + 'px'; s.width = w + 'px'; s.height = h + 'px';
    var b = it.lock.style; b.left = (l + 8) + 'px'; b.top = (t + 8) + 'px';
  }
  function setOn(it, on) {
    it.on = on; it.ov.style.display = on ? 'none' : 'flex'; it.lock.style.display = on ? 'block' : 'none'; it.f.style.pointerEvents = on ? '' : 'none';
  }
  function init() {
    var fr = document.querySelectorAll('iframe');
    Array.prototype.forEach.call(fr, function (f) {
      if (f.dataset.sg) return; f.dataset.sg = '1';
      var par = f.offsetParent || f.parentNode;
      if (par && par !== document.body && getComputedStyle(par).position === 'static') par.style.position = 'relative';
      var ov = document.createElement('div'); ov.className = 'sg-ov'; ov.innerHTML = '<span>לחצי כדי לשחק</span>';
      var lock = document.createElement('button'); lock.type = 'button'; lock.className = 'sg-lock'; lock.textContent = '↕ לגלילה';
      f.parentNode.insertBefore(ov, f.nextSibling); f.parentNode.insertBefore(lock, ov.nextSibling);
      var it = { f: f, ov: ov, lock: lock, on: false }; items.push(it);
      var moved = false, sx = 0, sy = 0;
      var t0 = 0; ov.addEventListener('touchstart', function (e) { moved = false; t0 = Date.now(); var t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
      ov.addEventListener('touchend', function (e) { if (!moved && Date.now() - t0 < 700) { setOn(it, true); } }, { passive: true });
      ov.addEventListener('touchmove', function (e) { var t = e.touches[0]; if (Math.abs(t.clientX - sx) > 14 || Math.abs(t.clientY - sy) > 14) moved = true; }, { passive: true });
      ov.addEventListener('click', function () { if (moved) { moved = false; return; } setOn(it, true); });
      lock.addEventListener('click', function (e) { e.stopPropagation(); setOn(it, false); });
      setOn(it, false); place(it);
    });
    items.forEach(place);
  }
  function go() { init(); setTimeout(init, 800); setTimeout(function () { items.forEach(place); }, 2500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  window.addEventListener('resize', function () { items.forEach(place); });
  window.addEventListener('scroll', function () { items.forEach(place); }, { passive: true });
  document.addEventListener('touchstart', function () { items.forEach(place); }, { passive: true, capture: true });
  setInterval(function () { init(); items.forEach(place); }, 500);
  if ('ResizeObserver' in window) { try { new ResizeObserver(function () { items.forEach(place); }).observe(document.documentElement); } catch (e) { } }
  window.addEventListener('load', function () { items.forEach(place); });
})();
