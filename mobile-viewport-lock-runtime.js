// AG Cute Blocks V0.4.84 — iPhone viewport/gesture lock.
// Keeps the game canvas + HUD at a fixed visual scale while preserving real two-thumb gameplay.
const VERSION='V0.4.84';

function normalizeViewport(){
  const meta=document.querySelector('meta[name="viewport"]');
  if(meta)meta.setAttribute('content','width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');
}
normalizeViewport();

const prevent=e=>{if(e.cancelable)e.preventDefault()};
for(const type of ['gesturestart','gesturechange','gestureend']){
  document.addEventListener(type,prevent,{passive:false,capture:true});
}

const CONTROL_SELECTOR='#joy,#jump,#add,#del,#rot,#lifeInteract,#cam,#lifeBtn,#runToggle,.item,.cat,.panel,.lifePanel,.waterCropBtn,.sleepMorning';
function touchIsGameplayControl(touch){
  const target=touch?.target;
  return !!(target?.closest?.(CONTROL_SELECTOR));
}

document.addEventListener('touchmove',e=>{
  if(!e.touches||e.touches.length<2)return;
  const touches=[...e.touches];
  if(touches.every(touchIsGameplayControl))return;
  prevent(e);
},{passive:false,capture:true});

const nativeDocumentAdd=document.addEventListener.bind(document);
const inheritedDocumentAdd=document.addEventListener;
let legacyBlanketTouchBlockerSuppressed=false;
document.addEventListener=function(type,listener,options){
  if(type==='touchmove'&&typeof listener==='function'){
    const src=Function.prototype.toString.call(listener).replace(/\s+/g,'');
    if(src.includes('e.touches.length>1')&&src.includes('e.preventDefault()')){
      legacyBlanketTouchBlockerSuppressed=true;
      return;
    }
  }
  return nativeDocumentAdd(type,listener,options);
};
setTimeout(()=>{document.addEventListener=inheritedDocumentAdd},0);

nativeDocumentAdd('dblclick',prevent,{passive:false,capture:true});
const root=document.documentElement;
root.style.webkitTextSizeAdjust='100%';
root.style.textSizeAdjust='100%';
addEventListener('orientationchange',()=>setTimeout(normalizeViewport,0),{passive:true});
addEventListener('pageshow',normalizeViewport,{passive:true});

globalThis.__AGCB_VIEWPORT_LOCK={version:VERSION,gestureLock:true,pinchLock:true,doubleTapZoomLock:true,multitouchGameplayPreserved:true,controlAwareTouchGuard:true,legacyBlanketTouchBlockerSuppressed:()=>legacyBlanketTouchBlockerSuppressed};