// AG Cute Blocks V0.5.56 — wardrobe input/state safety for iPhone.
const VERSION='V0.5.56';
function mount(){const modal=document.getElementById('agWardrobe'),btn=document.getElementById('agWardrobeBtn');if(!modal||!btn)return false;const card=document.getElementById('agWardrobeCard');
for(const b of modal.querySelectorAll('button')){b.type='button';b.style.touchAction='manipulation'}btn.type='button';btn.style.touchAction='manipulation';
const stop=e=>e.stopPropagation();card?.addEventListener('pointerdown',stop,{passive:true});card?.addEventListener('touchstart',stop,{passive:true});
function sync(){const state=globalThis.AGWardrobe?.get?.();if(!state)return;modal.dataset.ears=state.earsOn?'on':'off';modal.dataset.bow=state.bowType==='關閉'?'off':'on';modal.dataset.wing=state.wingType==='關閉'?'off':'on';const root=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION?.candidate?.root;if(root)root.userData.agWardrobeSafetyVersion=VERSION}
modal.addEventListener('click',e=>{if(e.target.closest?.('.agWOpt'))queueMicrotask(sync)},true);window.addEventListener('ag-wardrobe-applied',sync);window.addEventListener('pageshow',()=>setTimeout(()=>{globalThis.AGWardrobe?.apply?.();sync()},60),{passive:true});sync();globalThis.__AGCB_WARDROBE_SAFETY={version:VERSION,sync};return true}
let tries=0,t=setInterval(()=>{if(mount()||++tries>80)clearInterval(t)},50);