// AG Cute Blocks — activate and classify the dedicated mobile-game HUD v3.
const href='./mobile-controls.css?v=0.4.68';
if(!document.querySelector('link[data-agcb-mobile-controls="1"]')){
  const link=document.createElement('link');
  link.rel='stylesheet';link.href=href;link.dataset.agcbMobileControls='1';document.head.appendChild(link);
}
const roles={jump:'primary-action',lifeInteract:'context-action',add:'build-action',del:'build-action',rot:'build-action',joy:'movement',lifeBtn:'menu'};
function annotate(){
  for(const [id,role] of Object.entries(roles)){const el=document.getElementById(id);if(el)el.dataset.controlRole=role}
  const interact=document.getElementById('lifeInteract');if(interact&&!interact.getAttribute('aria-label'))interact.setAttribute('aria-label','互動');
  const water=document.querySelector('.waterCropBtn');if(water){water.dataset.controlRole='context-action';if(!water.getAttribute('aria-label'))water.setAttribute('aria-label','澆水')}
}
annotate();
const observer=new MutationObserver(annotate);observer.observe(document.body,{childList:true,subtree:true});
globalThis.__AGCB_MOBILE_CONTROLS={version:'3.1',layout:'aov-lower-right-cluster-reserved-hotbar-lane',stylesheet:href,roles,observer};
