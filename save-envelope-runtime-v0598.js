// AG Cute Blocks V0.5.98 — read-only complete local save envelope foundation.
// This runtime does not replace, migrate, clear, or restore any canonical game save.
// It only captures all AG Cute Blocks localStorage records into one integrity-checkable bundle
// so a later Google Drive bridge can back up the complete local state without depending on one key.
const VERSION='0.5.98';
const PROJECT='AG Cute Blocks';
const FORMAT='AG_CUTE_BLOCKS_SAVE_ENVELOPE';
const SCHEMA=1;
const PREFIX='ag_cute_blocks_';
const REQUIRED_KEYS=['ag_cute_blocks_world_v04','ag_cute_blocks_settings_v048_special_models_r2'];

function localKeys(){
  const out=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key?.startsWith(PREFIX))out.push(key);
  }
  return out.sort();
}
function captureRecords(){
  const records={};
  for(const key of localKeys())records[key]=localStorage.getItem(key);
  return records;
}
function canonicalPayload(bundle){
  return JSON.stringify({
    project:bundle.project,
    format:bundle.format,
    schema:bundle.schema,
    gameVersion:bundle.gameVersion,
    createdAt:bundle.createdAt,
    source:bundle.source,
    requiredKeys:bundle.requiredKeys,
    missingRequired:bundle.missingRequired,
    records:bundle.records
  });
}
async function sha256(text){
  if(!globalThis.crypto?.subtle)throw new Error('sha256-unavailable');
  const bytes=new TextEncoder().encode(text);
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function captureRaw(){
  const records=captureRecords();
  const missingRequired=REQUIRED_KEYS.filter(key=>records[key]==null);
  return{
    project:PROJECT,
    format:FORMAT,
    schema:SCHEMA,
    gameVersion:String(globalThis.AG_GAME_VERSION||globalThis.__AGCB_BOOTSTRAP?.version||VERSION),
    createdAt:new Date().toISOString(),
    source:'browser-localStorage',
    requiredKeys:[...REQUIRED_KEYS],
    missingRequired,
    records
  };
}
async function capture(){
  const bundle=captureRaw();
  bundle.integrity={algorithm:'SHA-256',sha256:await sha256(canonicalPayload(bundle))};
  return bundle;
}
async function verify(bundle){
  if(!bundle||bundle.project!==PROJECT||bundle.format!==FORMAT||Number(bundle.schema)!==SCHEMA)return{ok:false,reason:'envelope-format-invalid'};
  if(!bundle.integrity||bundle.integrity.algorithm!=='SHA-256'||!bundle.integrity.sha256)return{ok:false,reason:'integrity-missing'};
  const actual=await sha256(canonicalPayload(bundle));
  if(actual!==bundle.integrity.sha256)return{ok:false,reason:'integrity-mismatch',expected:bundle.integrity.sha256,actual};
  const missing=(bundle.requiredKeys||REQUIRED_KEYS).filter(key=>bundle.records?.[key]==null);
  if(missing.length)return{ok:false,reason:'required-save-record-missing',missing};
  return{ok:true,recordCount:Object.keys(bundle.records||{}).length,sha256:actual};
}
function readiness(){
  const raw=captureRaw();
  return{ok:raw.missingRequired.length===0,missingRequired:raw.missingRequired,recordCount:Object.keys(raw.records).length,project:PROJECT,version:VERSION};
}

globalThis.__AGCB_SAVE_ENVELOPE={
  version:VERSION,
  status:'READ_ONLY_DRIVE_BACKUP_FOUNDATION',
  project:PROJECT,
  format:FORMAT,
  schema:SCHEMA,
  prefix:PREFIX,
  requiredKeys:[...REQUIRED_KEYS],
  captureRaw,
  capture,
  verify,
  readiness
};
