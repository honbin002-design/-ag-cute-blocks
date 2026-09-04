// AG Cute Blocks V0.4.85 — persist walk/run mode through the active settings store.
const VERSION='V0.4.85';
const SETTINGS_KEY='ag_cute_blocks_settings_v048_special_models_r2';
const run=document.getElementById('runToggle');

function readSettings(){
  try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{}}catch{return{}}
}
function writeMode(){
  if(!run)return;
  const settings=readSettings();
  const movementMode=run.getAttribute('aria-pressed')==='true'?'run':'walk';
  if(settings.movementMode===movementMode)return;
  settings.movementMode=movementMode;
  localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));
  globalThis.__AGCB_MOVEMENT_MODE_PERSISTENCE_STATE={version:VERSION,movementMode,settingsKey:SETTINGS_KEY};
}

if(run){
  writeMode();
  new MutationObserver(writeMode).observe(run,{attributes:true,attributeFilter:['aria-pressed']});
}

globalThis.__AGCB_MOVEMENT_MODE_PERSISTENCE={version:VERSION,activeSettingsKey:SETTINGS_KEY,persistsWalkRun:true};
