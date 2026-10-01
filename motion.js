/* Section choreography + center-triggered entrances. Step arrows are entirely static. Layout transforms are preserved. */
(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map(), pending = new Set();
  let frame = 0, paused = false;
  try { paused = sessionStorage.getItem('honnova-motion-paused') === 'true'; } catch {}
  const enabled = () => !paused && !preference.matches;
  const ease = 'cubic-bezier(.16,1,.3,1)';
  const toggle = document.createElement('button');
  toggle.className = 'motion-toggle';
  document.body.append(toggle);

  function animate(element, frames, options = {}) {
    if (!enabled() || !element) return;
    const animation = element.animate(frames, {duration:1050,easing:ease,...options});
    active.set(animation,element);
    const cleanup = () => active.delete(animation);
    animation.addEventListener('finish',cleanup,{once:true});
    animation.addEventListener('cancel',cleanup,{once:true});
    return animation;
  }
  function reveal(element, immediate = false) {
    pending.delete(element); element.classList.remove('motion-pending');
    element.classList.add('motion-shown');
    if (immediate) return;
    const type = element.dataset.motion;
    if (type === 'map') {
      animate(element.querySelector('.map-land'),[{opacity:0,translate:'0 28px'},{opacity:1,translate:'0 0'}],{duration:650,fill:'backwards'});
      element.querySelectorAll('.map-pin').forEach((pin,index)=>animate(pin,[{opacity:0,translate:'0 -72px'},{opacity:1,translate:'0 5px',offset:.8},{opacity:1,translate:'0 0'}],{duration:720,delay:650+index*130,fill:'backwards'}));
      return;
    }
    const side = element.dataset.motionSide || '1';
    const frames = type === 'pop' ? [
      {opacity:0,scale:'.72',translate:'0 65px',rotate:`${Number(side)*-5}deg`},
      {opacity:1,scale:'1.055',translate:'0 -8px',rotate:'1deg',offset:.72},
      {opacity:1,scale:'1',translate:'0 0',rotate:'0deg'}
    ] : type === 'slide' ? [
      {opacity:0,translate:`${Number(side)*70}px 28px`}, {opacity:1,translate:'0 0'}
    ] : type === 'backdrop' ? [
      {opacity:.35}, {opacity:1}
    ] : [{opacity:0,translate:'0 55px',scale:'.97'}, {opacity:1,translate:'0 0',scale:'1'}];
    animate(element,frames,{delay:Number(element.dataset.motionDelay||0),duration:type==='pop'?1250:1050,fill:'backwards'});
  }
  function register(selector,type='rise',stagger=80) {
    document.querySelectorAll(selector).forEach((element,index) => {
      element.dataset.motion=type;
      element.dataset.motionDelay=String((index%3)*stagger);
      element.dataset.motionSide='-1';
      const box=element.getBoundingClientRect();
      if(box.bottom<0){reveal(element,true);return;}
      if(box.top<=innerHeight*.5 && box.bottom>0){reveal(element);return;}
      element.classList.add('motion-pending');pending.add(element);
    });
  }
  // Wait until the leading edge reaches the viewport midpoint. At the page end,
  // reveal remaining visible items that cannot physically scroll to that line.
  function checkEntrances() {
    frame = 0;
    if (!enabled()) return;
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    pending.forEach(element => {
      const box = element.getBoundingClientRect();
      if (box.top <= innerHeight * .5 || (atEnd && box.top < innerHeight)) {
        reveal(element, box.bottom < 0);
      }
    });
  }
  function scheduleEntrances() {
    if (!frame && pending.size) frame = requestAnimationFrame(checkEntrances);
  }
  addEventListener('scroll', scheduleEntrances, {passive:true});
  addEventListener('resize', scheduleEntrances, {passive:true});
  function updateToggle(){toggle.textContent=enabled()?'Ⅱ 動きを停止':'▷ 動きを再生';toggle.setAttribute('aria-pressed',String(enabled()));toggle.disabled=preference.matches;toggle.title=preference.matches?'端末の「動きを減らす」設定を適用しています':'アニメーションの再生・停止';}
  function start() {
    updateToggle(); if(!enabled())return;
    document.documentElement.classList.add('motion-enabled');
    register('.header .brand,.header nav,.menu-toggle','slide',130);
    register('.hero-title span,.hero-title strong','rise',160);
    register('.hero-phone,.social-phones .phone,.step-visual','rise',0);

    register('.hero-back,.hero-hill,.land-left,.land-right,.hero-grass-back,.hero-grass-left,.hero-grass-right,.town-grass,.features-wave,.how-background,.places-background,.follow-background,.footer-grass','backdrop',110);
    register('.ruled-title,#town-title,#features-title,#how-title,.contact-site h1','slide',80);
    register('.books-label,.book-count,.place-count','pop',140);
    register('.town-map','map',0);
    register('.town-closing','rise',0);
    register('.about-content h3,.about-copy p','rise',140);
    register('.cta,.place','slide',90);
    register('.feature','pop',120);
    register('.voice-card','pop',100);
    register('.step-copy h3,.step-copy p','rise',0);
    register('.social-copy p,.social-copy button,.contact-intro,.contact-button,.footer-tagline','pop',100);
    register('.cta-character,.place-character','slide',100);
    register('#contact-form label,#contact-form input,#contact-form textarea,.form-status,.send-button','rise',70);
    scheduleEntrances();
  }
  function stop(){cancelAnimationFrame(frame);frame=0;active.forEach((_,animation)=>animation.cancel());active.clear();pending.forEach(element=>element.classList.remove('motion-pending'));pending.clear();document.documentElement.classList.remove('motion-enabled');document.querySelectorAll('.motion-in-view').forEach(e=>e.classList.remove('motion-in-view'));}
  toggle.addEventListener('click',()=>{paused=!paused;try{sessionStorage.setItem('honnova-motion-paused',String(paused));}catch{}stop();start();});
  preference.addEventListener('change',()=>{stop();start();});
  document.addEventListener('visibilitychange',()=>{active.forEach((element,animation)=>{if(document.hidden)animation.pause();else if(enabled())animation.play();});});
  document.addEventListener('focusin',event=>{pending.forEach(element=>{if(element.contains(event.target)){reveal(element,true);}});});
  // Hold moving clickable ancestors in place between pointer-down and pointer-up.
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('button,a,input,textarea'))return;active.forEach((element,animation)=>{if(element.contains(event.target)&&animation.playState==='running'){animation.pause();setTimeout(()=>{if(enabled()&&!document.hidden&&active.has(animation))animation.play();},450);}});},{passive:true});
  addEventListener('pageshow',event=>{if(event.persisted){stop();start();}});
  start();
})();
