// AG Cute Blocks V0.5.107 — TEST-only first-save initializer.
// Creates missing canonical TEST records through existing game UI handlers only.
// Never reads PROD, never overwrites existing canonical records, no restore/delete.
const VERSION='0.5.107';
const ENV='TEST';
const WORLD_KEY='ag_cute_blocks_world_v04';
const SETTINGS_KEY='ag_cute_blocks_settings_v048_special_models_r2';
let attempts=0;
let lastResult={ok:false,status:'WAITING_FOR_CORE'};
function runtimeEnv(){return String(globalThis.AG_RUNTIME_ENVIRONMENT||globalThis.__AGCB_BOOTSTRAP?.runtimeEnvironment||'').toUpperCase()}
function validJsonRecord(key){const raw=localStorage.getItem(key);if(raw==null)return false;try{JSON.parse(raw);return true}catch{return false}}
function readiness(){return{ok:validJsonRecord(WORLD_KEY)&&validJsonRecord(SETTINGS_KEY),world:validJsonRecord(WORLD_KEY),settings:validJsonRecord(SETTINGS_KEY),attempts,lastResult}}
function initializeMissing(){
  if(runtimeEnv()!==ENV){lastResult={ok:false,status:'NOT_TEST_RUNTIME'};return readiness()}
  const before=readiness();if(before.ok){lastResult={ok:true,status:'ALREADY_READY'};return readiness()}
  const saveButton=document.getElementById('saveNow');
  const season=document.getElementById('season');
  if(!validJsonRecord(SETTINGS_KEY)&&season){season.dispatchEvent(new Event('change',{bubbles:true}))}
  if(!validJsonRecord(WORLD_KEY)&&saveButton){saveButton.click()}
  const afterWorld=validJsonRecord(WORLD_KEY),afterSettings=validJsonRecord(SETTINGS_KEY);
  lastResult={ok:afterWorld&&afterSettings,status:afterWorld&&afterSettings?'INITIALIZED':'CORE_NOT_READY',createdWorld:!before.world&&afterWorld,createdSettings:!before.settings&&afterSettings};
  return readiness()
}
function tick(){attempts++;const r=initializeMissing();if(r.ok||attempts>=12)return;setTimeout(tick,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(tick,250),{once:true});else setTimeout(tick,250);
globalThis.__AGCB_TEST_INITIAL_SAVE={version:VERSION,status:'TEST_ONLY_NON_DESTRUCTIVE_FIRST_SAVE',readiness,initializeMissing};
