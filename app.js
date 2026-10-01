const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
const dialog=document.querySelector('#notice');
document.querySelectorAll('[data-pending]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#notice-title').textContent=b.dataset.pending;document.querySelector('#notice-body').textContent='ただいま準備中です。\n公開まで、もうしばらくお待ちください。';dialog.showModal();}));
document.querySelectorAll('.dialog-x,.dialog-close').forEach(b=>b.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const voiceTrack=document.querySelector('.voice-track');
if(voiceTrack&&window.innerWidth>700){voiceTrack.style.scrollSnapType='none';voiceTrack.scrollLeft=156;requestAnimationFrame(()=>{voiceTrack.style.scrollSnapType='x proximity';});}
const placeDialog=document.querySelector('#place-detail');
if(placeDialog){document.querySelectorAll('[data-place]').forEach(button=>button.addEventListener('click',()=>{placeDialog.querySelector('h2 span').textContent=button.dataset.place;placeDialog.querySelector('.place-detail-heading').innerHTML=button.closest('.place').querySelector('h3').innerHTML;placeDialog.showModal();placeDialog.scrollTop=0;}));placeDialog.querySelectorAll('.place-dialog-x,.place-dialog-close').forEach(button=>button.addEventListener('click',()=>placeDialog.close()));placeDialog.addEventListener('click',e=>{if(e.target===placeDialog){const r=placeDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)placeDialog.close();}});}
const contactForm=document.querySelector('#contact-form');
if(contactForm)contactForm.addEventListener('submit',e=>{e.preventDefault();document.querySelector('#send-status').textContent='受付開始前のため、まだ送信されていません。';});
