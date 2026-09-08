// AG Cute Blocks V0.5.52 — activate and classify the dedicated mobile-game HUD.
// Keep CSS cache-busting tied to the visible release so iPhone does not keep an older HUD after deploy.
const VERSION=String(globalThis.AG_GAME_VERSION||'V0.5.52').replace(/^V/i,'');
const href=`./mobile-controls.css?v=${encodeURIComponent(VERSION)}`;
let link=document.querySelector('link[data-agcb-mobile-controls="1"]');
if(!link){link=document.createElement('link');link.rel='stylesheet';link.dataset.agcbMobileControls='1';document.head.appendChild(link)}
if(link.getAttribute('href')!==href)link.href=href;
const roles={jump:'primary-action',lifeInteract:'context-action',add:'build-action',del:'build-action',rot:'build-action',joy:'movement',lifeBtn:'menu',runToggle:'movement-mode'};
function annotate(){
  for(const [id,role] of Object.entries(roles)){const el=document.getElementById(id);if(el)el.dataset.controlRole=role}
  const interact=document.getElementById('lifeInteract');if(interact&&!interact.getAttribute('aria-label'))interact.setAttribute('aria-label','互動');
  const water=document.querySelector('.waterCropBtn');if(water){water.dataset.controlRole='context-action';if(!water.getAttribute('aria-label'))water.setAttribute('aria-label','澆水')}
}
annotate();
const observer=new MutationObserver(annotate);observer.observe(document.body,{childList:true,subtree:true});
addEventListener('pageshow',()=>{if(link&&link.getAttribute('href')!==href)link.href=href;annotate()},{passive:true});
globalThis.__AGCB_MOBILE_CONTROLS={version:'5.52',layout:'aov-lower-right-cluster-reserved-hotbar-lane',stylesheet:href,roles,observer,crosshairVisualOnly:true,releaseSyncedCss:true};
