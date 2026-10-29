const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','メニューを開く');}));
const dialog=document.querySelector('#notice');
document.querySelectorAll('[data-pending]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#notice-title').textContent=b.dataset.pending;document.querySelector('#notice-body').textContent='ただいま準備中です。\n公開まで、もうしばらくお待ちください。';dialog.showModal();}));
document.querySelectorAll('.dialog-x,.dialog-close').forEach(b=>b.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const voiceTrack=document.querySelector('.voice-track');
if(voiceTrack&&window.innerWidth>700){voiceTrack.style.scrollSnapType='none';voiceTrack.scrollLeft=156;requestAnimationFrame(()=>{voiceTrack.style.scrollSnapType='x proximity';});}
const placeDialog=document.querySelector('#place-detail');
if(placeDialog){document.querySelectorAll('[data-place]').forEach(button=>button.addEventListener('click',()=>{placeDialog.querySelector('h2 span').textContent=button.dataset.place;placeDialog.querySelector('.place-detail-heading').innerHTML=button.closest('.place').querySelector('h3').innerHTML;placeDialog.showModal();placeDialog.scrollTop=0;}));placeDialog.querySelectorAll('.place-dialog-x,.place-dialog-close').forEach(button=>button.addEventListener('click',()=>placeDialog.close()));placeDialog.addEventListener('click',e=>{if(e.target===placeDialog){const r=placeDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)placeDialog.close();}});}
// Keep the reel from competing with the first-screen images for bandwidth.
const followVideo=document.querySelector('.follow-video');
if(followVideo){
  const playVideo=()=>{followVideo.play().catch(()=>{/* Autoplay may be blocked by the browser. */});};
  if('IntersectionObserver' in window){
    const videoObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting)playVideo();else followVideo.pause();});
    },{rootMargin:'300px 0px'});
    videoObserver.observe(followVideo);
  }else{
    playVideo();
  }
}
const contactForm=document.querySelector('#contact-form');
if(contactForm)contactForm.addEventListener('submit',e=>{e.preventDefault();document.querySelector('#send-status').textContent='受付開始前のため、まだ送信されていません。';});
