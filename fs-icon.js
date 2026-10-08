/* אייקון קטן למסך מלא בפינה של דפי כתיבה (במקום כפתור גדול מתחת למשחק) */
(function(){
  if(/[?&]embed=1/.test(location.search))return;
  var d=document,el=d.documentElement;
  var can=d.fullscreenEnabled||d.webkitFullscreenEnabled;
  var b=d.createElement('button');b.type='button';b.setAttribute('aria-label','מסך מלא');b.title='מסך מלא';
  b.style.cssText='position:fixed;top:10px;left:10px;z-index:50;width:34px;height:34px;border-radius:50%;border:2px solid #8FD3B6;background:#fff;color:#4FB38C;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.1)';
  b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  b.addEventListener('click',function(){
    var on=d.fullscreenElement||d.webkitFullscreenElement;
    try{
      if(on){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}
      else if(can){(el.requestFullscreen||el.webkitRequestFullscreen).call(el)}
      else{window.open(location.href.replace(/[?&]fit=1/,''),'_blank')}
    }catch(e){window.open(location.href,'_blank')}
  });
  function add(){d.body.appendChild(b)}
  if(d.body)add();else d.addEventListener('DOMContentLoaded',add);
})();
