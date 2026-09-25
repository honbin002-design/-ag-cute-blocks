// AG Cute Blocks release-version compatibility helper.
// Bootstrap is the single runtime version authority. This module must never overwrite it.
const FALLBACK_RELEASE='V0.5.119';
function authoritativeRelease(){
  const boot=globalThis.__AGCB_BOOTSTRAP?.version;
  if(boot)return 'V'+String(boot).replace(/^V/i,'');
  const game=String(globalThis.AG_GAME_VERSION||'').trim();
  if(/^V?\d+\.\d+\.\d+$/i.test(game))return game.toUpperCase().startsWith('V')?game:'V'+game;
  return FALLBACK_RELEASE;
}
function sync(){
  const release=authoritativeRelease();
  const badge=document.querySelector('.title small,#menuBtn small');if(badge)badge.textContent=release;
  const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',release);
  if(!globalThis.__AGCB_BOOTSTRAP)globalThis.AG_GAME_VERSION=release;
  globalThis.__AGCB_RELEASE_VERSION={version:release.slice(1),release,status:'BOOTSTRAP_AUTHORITY_COMPAT',versionOwner:globalThis.__AGCB_BOOTSTRAP?'bootstrap-v0510.js':'legacy-fallback'};
}
sync();queueMicrotask(sync);setTimeout(sync,500);setTimeout(sync,1500);addEventListener('pageshow',sync,{once:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()},{once:true});
