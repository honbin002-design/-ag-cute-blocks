// AG Cute Blocks V0.4.84 — mode-aware aim reticle.
// First-person: fixed visual-only center reticle.
// Third/farm: restore the existing draggable build reticle handlers from app-v043.js.
const VERSION='V0.4.84';
const cross=document.getElementById('crosshair');
const cam=document.getElementById('cam');
let lastNonFirstLeft='50%',lastNonFirstTop='45%',previousMode='';

function cameraModeFromLabel(){
  const text=cam?.textContent||'';
  if(text.includes('第一人稱'))return'first';
  if(text.includes('牧場'))return'farm';
  return'third';
}

function syncReticle(){
  if(!cross||!cam)return;
  const mode=cameraModeFromLabel();
  if(mode==='first'){
    if(previousMode&&previousMode!=='first'){
      lastNonFirstLeft=cross.style.left||lastNonFirstLeft;
      lastNonFirstTop=cross.style.top||lastNonFirstTop;
    }
    cross.style.setProperty('pointer-events','none','important');
    cross.style.left='50%';
    cross.style.top='50%';
    cross.style.opacity='.42';
    cross.setAttribute('aria-hidden','true');
  }else{
    if(previousMode==='first'||!previousMode){
      cross.style.left=lastNonFirstLeft;
      cross.style.top=lastNonFirstTop;
    }
    cross.style.setProperty('pointer-events','auto','important');
    cross.style.setProperty('touch-action','none','important');
    cross.style.opacity='.58';
    cross.removeAttribute('aria-hidden');
    cross.setAttribute('aria-label','拖曳調整放置準星');
  }
  previousMode=mode;
  globalThis.__AGCB_AIM_RETICLE_STATE={version:VERSION,mode,firstPersonVisualOnly:mode==='first',draggableOutsideFirst:mode!=='first'};
}

syncReticle();
const observer=new MutationObserver(syncReticle);
if(cam)observer.observe(cam,{childList:true,subtree:true,characterData:true});
addEventListener('pageshow',syncReticle,{passive:true});

globalThis.__AGCB_AIM_RETICLE={version:VERSION,modeAware:true,firstPersonCentered:true,thirdFarmDraggable:true,observer,sync:syncReticle};
