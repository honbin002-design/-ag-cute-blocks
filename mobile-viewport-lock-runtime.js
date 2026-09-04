// AG Cute Blocks V0.4.81 — iPhone viewport/gesture lock.
// Keeps the game canvas + HUD at a fixed visual scale while preserving multi-touch gameplay.
const VERSION='V0.4.81';

function normalizeViewport(){
  const meta=document.querySelector('meta[name="viewport"]');
  if(meta)meta.setAttribute('content','width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');
}
normalizeViewport();

const prevent=e=>{if(e.cancelable)e.preventDefault()};
for(const type of ['gesturestart','gesturechange','gestureend']){
  document.addEventListener(type,prevent,{passive:false,capture:true});
}
// Safari can still try native pinch handling on a two-finger move even when the
// viewport meta is strict. Block only the browser gesture; pointer events remain available.
document.addEventListener('touchmove',e=>{if(e.touches?.length>1)prevent(e)},{passive:false,capture:true});
// Double taps are gameplay taps, never browser zoom gestures.
document.addEventListener('dblclick',prevent,{passive:false,capture:true});

// Reinforce fixed-layout behavior after orientation / standalone transitions.
const root=document.documentElement;
root.style.webkitTextSizeAdjust='100%';
root.style.textSizeAdjust='100%';
addEventListener('orientationchange',()=>setTimeout(normalizeViewport,0),{passive:true});
addEventListener('pageshow',normalizeViewport,{passive:true});

globalThis.__AGCB_VIEWPORT_LOCK={version:VERSION,gestureLock:true,pinchLock:true,doubleTapZoomLock:true,multitouchGameplayPreserved:true};
