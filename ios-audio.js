/* צליל באייפון (חן, 30.10.26: "שומעים 'תפסתם את' בלי ההמשך... אין סאונד למשחק עצמו, רק קולות שלי")
   1. מצב שקט באייפון משתיק את צלילי המשחק (הצלחה, פספוס, נסיעה) אבל לא את ההקלטות. audioSession=playback מנגן גם במצב שקט.
   2. אייפון חוסם נגן קול חדש שנוצר בלי נגיעה, ולכן ההקלטה השנייה ברצף לא נשמעה. נגן אחד שנפתח בנגיעה הראשונה ומשמש לכל ההקלטות. */
(function(){
  var ctxs=[], A=window.AudioContext||window.webkitAudioContext;
  if(A){ var W=function(o){ var c=new A(o); ctxs.push(c); return c }; W.prototype=A.prototype; window.AudioContext=W; window.webkitAudioContext=W }
  var SIL='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=', done=false;
  window.WGAudio={ play:function(u){ var a=window.aud; if(!a||!a.play){ a=window.aud=new Audio() } a.src=u; return a } };
  function un(){ try{ if(navigator.audioSession) navigator.audioSession.type='playback' }catch(e){}
    ctxs.forEach(function(c){ if(c.state!=='running') try{c.resume()}catch(e){} });
    if(!done){ done=true; var a=window.aud; if(a&&a.play&&!a.src){ try{ a.src=SIL; var p=a.play(); if(p&&p.catch) p.catch(function(){}) }catch(e){} } } }
  ['pointerdown','touchstart','touchend','click','keydown'].forEach(function(e){ document.addEventListener(e,un,{capture:true,passive:true}) });
})();
