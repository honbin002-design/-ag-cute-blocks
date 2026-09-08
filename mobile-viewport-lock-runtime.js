// AG Cute Blocks V0.5.63 — hardened iPhone viewport/gesture lock.
const VERSION='V0.5.63';
function normalizeViewport(){let meta=document.querySelector('meta[name="viewport"]');if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta)}meta.setAttribute('content','width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');document.documentElement.style.webkitTextSizeAdjust='100%';document.documentElement.style.textSizeAdjust='100%'}
normalizeViewport();
const prevent=e=>{if(e.cancelable)e.preventDefault()};
for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,prevent,{passive:false,capture:true});
const CONTROL_SELECTOR='#joy,#jump,#add,#del,#rot,#lifeInteract,#cam,#lifeBtn,#runToggle,#agWardrobeBtn,#agWardrobe,.item,.cat,.panel,.lifePanel,.waterCropBtn,.sleepMorning,.sleepWake';
function touchIsGameplayControl(t){return !!t?.target?.closest?.(CONTROL_SELECTOR)}
// The historical V0.5.04 blanket touchmove/double-tap listeners are removed by
// app-v0504-fixed-loader.js before the core module executes. This listener is the
// single multitouch policy owner: mixed joystick+camera/control gestures survive;
// browser/background multitouch remains locked against page zoom/pan.
document.addEventListener('touchmove',e=>{if(!e.touches||e.touches.length<2)return;const ts=[...e.touches];if(ts.some(touchIsGameplayControl))return;prevent(e)},{passive:false,capture:true});
// Safari double-tap zoom guard: block only rapid taps on canvas/background, never controls.
let lastEnd=0;document.addEventListener('touchend',e=>{if(e.changedTouches?.length!==1)return;if(touchIsGameplayControl(e.changedTouches[0])){lastEnd=0;return}const now=performance.now();if(now-lastEnd<330)prevent(e);lastEnd=now},{passive:false,capture:true});
document.addEventListener('dblclick',e=>{if(!e.target?.closest?.(CONTROL_SELECTOR))prevent(e)},{passive:false,capture:true});
for(const ms of [0,250,1000,2500])setTimeout(normalizeViewport,ms);addEventListener('orientationchange',()=>setTimeout(normalizeViewport,80),{passive:true});addEventListener('pageshow',()=>{normalizeViewport();setTimeout(normalizeViewport,250)},{passive:true});
globalThis.__AGCB_VIEWPORT_LOCK={version:VERSION,gestureLock:true,pinchLock:true,doubleTapZoomLock:true,multitouchGameplayPreserved:true,mixedTwoThumbGameplayPreserved:true,controlAwareTouchGuard:true,legacyBlanketTouchBlockerSuppressed:true,legacyDoubleTapBlockerSuppressed:true,safariRestoreGuard:true,normalize:normalizeViewport,touchIsGameplayControl};