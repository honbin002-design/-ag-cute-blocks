// AG Cute Blocks V0.5.111 — finite release-version convergence helper.
// Bootstrap remains the single version owner. No permanent MutationObserver.
const RELEASE='V0.5.111';
const VERSION='0.5.111';
function sync(){const badge=document.querySelector('.title small,#menuBtn small');if(badge)badge.textContent=RELEASE;const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',RELEASE);globalThis.AG_GAME_VERSION=RELEASE}
sync();queueMicrotask(sync);setTimeout(sync,500);setTimeout(sync,1500);addEventListener('pageshow',sync,{once:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()},{once:true});globalThis.__AGCB_RELEASE_VERSION={version:VERSION,release:RELEASE,status:'FINITE_CONVERGENCE_BOOTSTRAP_OWNER'};
