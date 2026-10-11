/* Scroll advances the introduction and phone together. */
(()=>{
 const scene=document.querySelector('.hero-story'),pin=scene.querySelector('.hero-pin'),windowEl=scene.querySelector('.hero-copy-window'),track=scene.querySelector('.hero-copy-track');
 const phone=scene.querySelector('.hero-phone');
 const lines=[...track.children],reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let enabled=false,frame=0,step=1,travel=1,centers=[];
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function draw(){frame=0;if(!enabled)return;const progress=clamp(-scene.getBoundingClientRect().top/travel,0,1);const location=progress*(lines.length-1);const a=Math.min(Math.floor(location),lines.length-2),blend=location-a;const center=centers[a]+(centers[a+1]-centers[a])*blend;track.style.transform=`translateY(${windowEl.clientHeight/2-center}px)`;phone.style.translate=`0 ${-Math.min(location,2)*(innerHeight*.65)}px`;phone.style.opacity=String(clamp(1-location*.7,0,1));lines.forEach((line,i)=>{const distance=Math.abs(i-location);const strength=Math.max(0,1-distance);line.style.transform=`scale(${.77+.23*strength})`;line.style.opacity=String(clamp(1-distance*.85,0,1));});}
 function schedule(){if(!frame&&enabled)frame=requestAnimationFrame(draw);}
 function layout(){enabled=document.documentElement.classList.contains('motion-enabled')&&!reduce.matches;scene.classList.toggle('story-interactive',enabled);if(!enabled){scene.style.height='';track.style.transform='';phone.style.translate='';phone.style.opacity='';lines.forEach(l=>{l.style.transform='';l.style.opacity=''});return;}step=Math.max(280,innerHeight*.42);travel=step*(lines.length-1);scene.style.height=`${pin.offsetHeight+travel}px`;centers=lines.map(l=>l.offsetTop+l.offsetHeight/2);draw();}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',layout,{passive:true});new ResizeObserver(layout).observe(windowEl);new MutationObserver(layout).observe(document.documentElement,{attributes:true,attributeFilter:['class']});document.fonts.ready.then(layout);layout();
 const options=[...document.querySelectorAll('.keyword')],status=document.querySelector('.keyword-status');
 options.forEach(button=>button.addEventListener('click',()=>{button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'));const chosen=options.filter(b=>b.getAttribute('aria-pressed')==='true');status.textContent=chosen.length?`${chosen.length}個の言葉を選択中`:'';}));
 document.querySelector('.keyword-search').addEventListener('click',()=>{document.querySelector('.shelf-bubble').hidden=true;const chosen=options.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.textContent);document.querySelector('#notice-title').textContent='キーワード検索';document.querySelector('#notice-body').textContent=(chosen.length?'選んだ言葉：'+chosen.join('、')+'\n\n':'')+'キーワード検索は準備中です。まちの本棚は「まちの本棚を覗く」からご覧いただけます。';document.querySelector('#notice').showModal();});
})();
