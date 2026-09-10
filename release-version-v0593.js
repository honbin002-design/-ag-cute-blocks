// AG Cute Blocks V0.5.93 — reload-stable runtime version owner overlay.
// V0.5.92 could briefly fall back to the stable bootstrap's legacy V0.5.91 badge after reload.
// Keep the stable bootstrap filename while making the current release authoritative on every DOM/version write.
const RELEASE='V0.5.93';
const VERSION='0.5.93';
let applying=false;
function applyV0593(){
  if(applying)return;applying=true;
  try{
    const badge=document.querySelector('.title small,#menuBtn small');if(badge&&badge.textContent!==RELEASE)badge.textContent=RELEASE;
    const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta&&meta.getAttribute('content')!==RELEASE)meta.setAttribute('content',RELEASE);
    const note=document.querySelector('.note');if(note&&/V0\.5\.\d+/.test(note.textContent))note.textContent=note.textContent.replace(/V0\.5\.\d+/g,RELEASE);
    globalThis.AG_GAME_VERSION=RELEASE;
    if(globalThis.__AGCB_BOOTSTRAP){
      globalThis.__AGCB_BOOTSTRAP.version=VERSION;
      globalThis.__AGCB_BOOTSTRAP.versionOwner='release-version-v0593.js';
      if(!String(globalThis.__AGCB_BOOTSTRAP.target||'').includes('reload-stable-version-owner'))globalThis.__AGCB_BOOTSTRAP.target+='+reload-stable-version-owner';
    }
    if(globalThis.__AGCB_RELEASE_OVERLAY){globalThis.__AGCB_RELEASE_OVERLAY.runtimeVersion=VERSION;globalThis.__AGCB_RELEASE_OVERLAY.versionOwner='release-version-v0593.js'}
  }finally{applying=false}
}
const observer=new MutationObserver(()=>queueMicrotask(applyV0593));
observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['content']});
queueMicrotask(applyV0593);for(const ms of [0,40,250,650,1850,2600,4200])setTimeout(applyV0593,ms);window.addEventListener('pageshow',applyV0593,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)applyV0593()},{passive:true});
globalThis.__AGCB_VERSION_OVERLAY={version:VERSION,status:'RELOAD_STABLE_ACTIVE',versionOwner:'release-version-v0593.js',apply:applyV0593,observerActive:true};
