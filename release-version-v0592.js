// AG Cute Blocks V0.5.92 — runtime version owner overlay.
// Keeps the historical bootstrap filename stable while advancing the visible/runtime release.
const RELEASE='V0.5.92';
function applyV0592(){
  const badge=document.querySelector('.title small,#menuBtn small');if(badge)badge.textContent=RELEASE;
  const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',RELEASE);
  const note=document.querySelector('.note');if(note)note.textContent=note.textContent.replace(/V0\.5\.\d+/g,RELEASE);
  globalThis.AG_GAME_VERSION=RELEASE;
  if(globalThis.__AGCB_BOOTSTRAP){globalThis.__AGCB_BOOTSTRAP.version='0.5.92';globalThis.__AGCB_BOOTSTRAP.versionOwner='release-version-v0592.js';if(!String(globalThis.__AGCB_BOOTSTRAP.target||'').includes('connected-artificial-water-visuals'))globalThis.__AGCB_BOOTSTRAP.target+='+connected-artificial-water-visuals+neighbor-aware-pond-banks'}
  if(globalThis.__AGCB_RELEASE_OVERLAY){globalThis.__AGCB_RELEASE_OVERLAY.runtimeVersion='0.5.92';globalThis.__AGCB_RELEASE_OVERLAY.versionOwner='release-version-v0592.js'}
}
queueMicrotask(applyV0592);for(const ms of [40,650,1850,2600])setTimeout(applyV0592,ms);window.addEventListener('pageshow',applyV0592,{passive:true});
globalThis.__AGCB_VERSION_OVERLAY={version:'0.5.92',status:'ACTIVE',apply:applyV0592};
