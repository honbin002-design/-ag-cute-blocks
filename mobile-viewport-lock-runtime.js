// AG Cute Blocks V0.5.59 — hardened iPhone viewport/gesture lock.
const VERSION='V0.5.59';
function normalizeViewport(){let meta=document.querySelector('meta[name="viewport"]');if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta)}meta.setAttribute('content','width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');document.documentElement.style.webkitTextSizeAdjust='100%';document.documentElement.style.textSizeAdjust='100%'}
normalizeViewport();
const prevent=e=>{if(e.cancelable)e.preventDefault()};
for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,prevent,{passive:false,capture:true});
const CONTROL_SELECTOR='#joy,#jump,#add,#del,#rot,#lifeInteract,#cam,#lifeBtn,#runToggle,#agWardrobeBtn,#agWardrobe,.item,.cat,.panel,.lifePanel,.waterCropBtn,.sleepMorning,.sleepWake';
const gameplay=t=>!!t?.target?.closest?.(CONTROL_SELECTOR);
document.addEventListener('touchmove',e=>{if(!e.touches||e.touches.length<2)return;const ts=[...e.touches];if(ts.every(gameplay))return;prevent(e)},{passive:false,capture:true});
// Safari double-tap zoom guard: block only rapid taps on the canvas/background, never buttons/controls.
let lastEnd=0;document.addEventListener('touchend',e=>{if(e.changedTouches?.length!==1)return;if(gameplay(e.changedTouches[0])){lastEnd=0;return}const now=performance.now();if(now-lastEnd<330)prevent(e);lastEnd=now},{passive:false,capture:true});
document.addEventListener('dblclick',e=>{if(!e.target?.closest?.(CONTROL_SELECTOR))prevent(e)},{passive:false,capture:true});
// Re-assert viewport after Safari page restore/orientation changes and after delayed app bootstrap.
for(const ms of [0,250,1000,2500])setTimeout(normalizeViewport,ms);addEventListener('orientationchange',()=>setTimeout(normalizeViewport,80),{passive:true});addEventListener('pageshow',()=>{normalizeViewport();setTimeout(normalizeViewport,250)},{passive:true});
globalThis.__AGCB_VIEWPORT_LOCK={version:VERSION,gestureLock:true,pinchLock:true,doubleTapZoomLock:true,multitouchGameplayPreserved:true,controlAwareTouchGuard:true,safariRestoreGuard:true,normalize:normalizeViewport};