// AG Cute Blocks V0.5.24 — explicit Service Worker registration with forced update checks.
(()=>{
  const VERSION='V0.5.24';
  const state={version:VERSION,supported:'serviceWorker' in navigator,registered:false,controlled:!!navigator.serviceWorker?.controller,error:null};
  globalThis.__AGCB_SERVICE_WORKER=state;
  if(!state.supported)return;
  let reloaded=false;
  const KEY='agcb_sw_reload_0524';
  const reloadOnce=()=>{state.controlled=!!navigator.serviceWorker.controller;if(reloaded||sessionStorage.getItem(KEY)==='1')return;reloaded=true;sessionStorage.setItem(KEY,'1');location.reload()};
  navigator.serviceWorker.addEventListener('controllerchange',reloadOnce);
  navigator.serviceWorker.register('./sw.js?v=0.5.24',{scope:'./',updateViaCache:'none'}).then(reg=>{
    state.registered=true;state.scope=reg.scope;
    const update=()=>reg.update().catch(()=>{});
    update();
    addEventListener('focus',update,{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')update()},{passive:true});
  }).catch(error=>{state.error=String(error?.message||error)});
})();
