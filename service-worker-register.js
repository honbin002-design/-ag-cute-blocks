// AG Cute Blocks V0.4.92 — explicit Service Worker registration.
(()=>{
  const state={version:'V0.4.92',supported:'serviceWorker' in navigator,registered:false,controlled:!!navigator.serviceWorker?.controller,error:null};
  globalThis.__AGCB_SERVICE_WORKER=state;
  if(!state.supported)return;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{state.controlled=!!navigator.serviceWorker.controller});
  navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>{
    state.registered=true;
    state.scope=reg.scope;
    reg.update().catch(()=>{});
  }).catch(error=>{state.error=String(error?.message||error)});
})();