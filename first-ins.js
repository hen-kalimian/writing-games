/* ההנחיה בנגיעה הראשונה (חן, 30.10.26: "שבמגע הראשון עם המשחק ההנחיה תישמע, אבל שלא ישמעו לפני").
   לפני נגיעה: שקט. בנגיעה הראשונה במשחק (לא על כפתור שעושה משהו בעצמו): אם המשחק לא השמיע כלום, לוחצים בשבילו על רמקול ההנחיה. */
(function () {
  var last = 0, done = false;
  try { var P = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { if (!/^data:/.test(this.src || '')) last = Date.now(); return P.apply(this, arguments) } } catch (e) {}
  try { var S = AudioBufferSourceNode.prototype.start; AudioBufferSourceNode.prototype.start = function () { if (this.buffer && this.buffer.duration > .5) last = Date.now(); return S.apply(this, arguments) } } catch (e) {}
  try { if (window.speechSynthesis) { var sp = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = function (u) { last = Date.now(); return sp(u) } } } catch (e) {}
  function insBtn() { return document.querySelector('button[aria-label="השמעת ההנחיה"],#insspk,#spkI,[data-say="__goal"],#card [data-say],#spk:not([hidden])') }
  function first(e) {
    if (done) return; done = true;
    var t = e.target && e.target.closest && e.target.closest('button,a,input,select,[role=button],#wgend');
    if (t) return; /* כפתור (בחירת מכונית, התחלה, רמקול, מסך מלא) עושה את שלו */
    var t0 = Date.now();
    var quiet = !!window.WG_FIRST_INS_IFQUIET; /* משחקים שמשמיעים לבד את הקלטת השקופית: רק אם לא נשמע כלום */
    setTimeout(function () { if (quiet && last >= t0) return; var b = insBtn(); if (b) b.click(); else if (typeof window.WG_FIRST_INS === 'function') window.WG_FIRST_INS() }, quiet ? 1200 : 350); /* רק בדפים שלא משמיעים הנחיה לבד */
  }
  /* רק לחיצה אמיתית, לא גלילה (חן, 30.10.26) */
  ['click', 'keydown'].forEach(function (ev) { document.addEventListener(ev, first, { capture: true, passive: true }) });
})();
