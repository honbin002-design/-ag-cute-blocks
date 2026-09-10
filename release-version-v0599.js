// AG Cute Blocks V0.5.99 — finite reload-stable version convergence helper.
// Bootstrap remains authoritative. No persistent MutationObserver.
const RELEASE='V0.5.99';
const VERSION='0.5.99';
let applying=false;
function applyV0599(){if(applying)return;applying=true;try{const badge=document.querySelector('.title small,#menuBtn small');if(badge&&badge.textContent!==RELEASE)badge.textContent=RELEASE;const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta&&meta.getAttribute('content')!==RELEASE)meta.setAttribute('content',RELEASE);const note=document.querySelector('.note');if(note&&/V0\.5\.\d+/.test(note.textContent))note.textContent=note.textContent.replace(/V0\.5\.\d+/g,RELEASE);globalThis.AG_GAME_VERSION=RELEASE;if(globalThis.__AGCB_BOOTSTRAP){globalThis.__AGCB_BOOTSTRAP.version=VERSION;globalThis.__AGCB_BOOTSTRAP.versionOwner='bootstrap-v0510.js'}if(globalThis.__AGCB_RELEASE_OVERLAY){globalThis.__AGCB_RELEASE_OVERLAY.runtimeVersion=VERSION;globalThis.__AGCB_RELEASE_OVERLAY.versionOwner='bootstrap-v0510.js'}}finally{applying=false}}
queueMicrotask(applyV0599);for(const ms of [0,40,250,650,1850,4200])setTimeout(applyV0599,ms);window.addEventListener('pageshow',applyV0599,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)applyV0599()},{passive:true});
globalThis.__AGCB_VERSION_OVERLAY={version:VERSION,status:'FINITE_RELOAD_STABLE_ACTIVE',versionOwner:'bootstrap-v0510.js',apply:applyV0599,observerActive:false};
