/* Scroll position is the timeline: no automatic or continuous motion. */
(() => {
  const scene=document.querySelector('.book-scene');
  if(!scene)return;
  const pin=scene.querySelector('.book-pin'),stage=scene.querySelector('.book-stage'),canvas=scene.querySelector('.book-canvas');
  const spreads=[...scene.querySelectorAll('.book-spread')],leaf=scene.querySelector('.book-leaf');
  const front=scene.querySelector('.leaf-front'),back=scene.querySelector('.leaf-back');
  const prev=scene.querySelector('.book-prev'),next=scene.querySelector('.book-next'),current=scene.querySelector('.book-current');
  let enabled=false,travel=0,top=0,frame=0,index=-1,position=0;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function draw(){
    frame=0;if(!enabled)return;
    position=clamp((top-scene.getBoundingClientRect().top)/travel,0,1)*(spreads.length-1);
    const page=Math.min(Math.floor(position),spreads.length-2),fraction=position-page;
    const turn=clamp((fraction-.18)/.64,0,1);
    if(page!==index){
      index=page;
      spreads.forEach((spread,i)=>{spread.classList.toggle('show-left',i===page);spread.classList.toggle('show-right',i===page+1);spread.setAttribute('aria-hidden',String(i!==Math.round(position)));});
      front.replaceChildren(spreads[page].querySelector('.spread-right').cloneNode(true));
      front.querySelector('.book-photo').loading='eager';
      back.replaceChildren(spreads[page+1].querySelector('.spread-left').cloneNode(true));
    }
    leaf.style.transform=`rotateY(${-180*turn}deg)`;
    leaf.style.setProperty('--turn-shadow',String(Math.sin(turn*Math.PI)*.7));
    const visible=page+(turn>=.5?1:0);
    spreads.forEach((spread,i)=>spread.setAttribute('aria-hidden',String(i!==visible)));
    current.textContent=String(visible+1).padStart(2,'0');
    scene.querySelector('.book-readable').textContent=spreads[visible].querySelector('h3').textContent;
    prev.disabled=position<.02;next.disabled=position>spreads.length-1-.02;
  }
  function schedule(){if(enabled&&!frame)frame=requestAnimationFrame(draw);}
  function layout(){
    enabled=document.documentElement.classList.contains('motion-enabled')&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    scene.classList.toggle('book-interactive',enabled);
    if(!enabled){scene.style.height='';spreads.forEach(s=>s.removeAttribute('aria-hidden'));return;}
    const zoom=scene.getBoundingClientRect().width/scene.offsetWidth;
    canvas.style.transform=`scale(${stage.clientWidth/1280})`;
    const h=pin.getBoundingClientRect().height;
    top=Math.max(20,(innerHeight-h)/2);
    travel=Math.max(520,innerHeight*.8)*(spreads.length-1);
    scene.style.setProperty('--book-top',`${top/zoom}px`);
    scene.style.height=`${(h+travel)/zoom}px`;
    index=-1;draw();
  }
  function go(delta){
    const target=clamp(Math.round(position)+delta,0,spreads.length-1);
    scrollTo({top:scrollY+scene.getBoundingClientRect().top-top+travel*target/(spreads.length-1),behavior:'smooth'});
  }
  prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',layout,{passive:true});
  new MutationObserver(layout).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  document.fonts.ready.then(layout);layout();
})();
