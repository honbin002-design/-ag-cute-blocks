// AG Cute Blocks — activate the dedicated mobile-game control stylesheet.
const href='./mobile-controls.css';
if(!document.querySelector(`link[data-agcb-mobile-controls="1"]`)){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  link.dataset.agcbMobileControls='1';
  document.head.appendChild(link);
}
globalThis.__AGCB_MOBILE_CONTROLS={version:'1.0',layout:'staggered-gamepad',stylesheet:href};
