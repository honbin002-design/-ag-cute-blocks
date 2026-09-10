// AG Cute Blocks V0.5.100 — environment-bound complete local save envelope.
// Read-only capture/verify. It never restores, clears, migrates, or deletes canonical game data.
const VERSION='0.5.100';
const PROJECT='AG Cute Blocks';
const FORMAT='AG_CUTE_BLOCKS_SAVE_ENVELOPE';
const SAVE_SCHEMA=1;
const PREFIX='ag_cute_blocks_';
const REQUIRED_KEYS=['ag_cute_blocks_world_v04','ag_cute_blocks_settings_v048_special_models_r2'];

function compat(){const c=globalThis.__AGCB_SAVE_ENVIRONMENT_COMPAT;if(!c)throw new Error('save-environment-compat-unavailable');return c}
function runtimeEnvironment(){return compat().normalizeEnvironment(globalThis.AG_RUNTIME_ENVIRONMENT||globalThis.__AGCB_BOOTSTRAP?.runtimeEnvironment)}
function localKeys(){const out=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith(PREFIX))out.push(key)}return out.sort()}
function captureRecords(){const records={};for(const key of localKeys())records[key]=localStorage.getItem(key);return records}
function canonicalPayload(bundle){return JSON.stringify({project:bundle.project,format:bundle.format,schema:bundle.schema,saveSchema:bundle.saveSchema,environment:bundle.environment,gameVersion:bundle.gameVersion,createdAt:bundle.createdAt,source:bundle.source,requiredKeys:bundle.requiredKeys,missingRequired:bundle.missingRequired,records:bundle.records})}
async function sha256(text){if(!globalThis.crypto?.subtle)throw new Error('sha256-unavailable');const bytes=new TextEncoder().encode(text);const digest=await crypto.subtle.digest('SHA-256',bytes);return[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function captureRaw(){const records=captureRecords();const missingRequired=REQUIRED_KEYS.filter(key=>records[key]==null);const env=runtimeEnvironment();return{project:PROJECT,format:FORMAT,schema:SAVE_SCHEMA,saveSchema:SAVE_SCHEMA,environment:env,gameVersion:String(globalThis.AG_GAME_VERSION||globalThis.__AGCB_BOOTSTRAP?.version||VERSION),createdAt:new Date().toISOString(),source:'browser-localStorage',requiredKeys:[...REQUIRED_KEYS],missingRequired,records}}
async function capture(){const bundle=captureRaw();bundle.integrity={algorithm:'SHA-256',sha256:await sha256(canonicalPayload(bundle))};return bundle}
async function verify(bundle,{runtimeEnv=runtimeEnvironment()}={}){if(!bundle||bundle.project!==PROJECT||bundle.format!==FORMAT)return{ok:false,reason:'envelope-format-invalid'};try{compat().validateSaveForRuntime({runtimeEnvironment:runtimeEnv,envelope:bundle})}catch(err){return{ok:false,reason:String(err?.message||err)}}if(!bundle.integrity||bundle.integrity.algorithm!=='SHA-256'||!bundle.integrity.sha256)return{ok:false,reason:'integrity-missing'};const actual=await sha256(canonicalPayload(bundle));if(actual!==bundle.integrity.sha256)return{ok:false,reason:'integrity-mismatch',expected:bundle.integrity.sha256,actual};const missing=(bundle.requiredKeys||REQUIRED_KEYS).filter(key=>bundle.records?.[key]==null);if(missing.length)return{ok:false,reason:'required-save-record-missing',missing};return{ok:true,environment:bundle.environment,saveSchema:Number(bundle.saveSchema??bundle.schema),recordCount:Object.keys(bundle.records||{}).length,sha256:actual}}
function readiness(){const raw=captureRaw();return{ok:raw.missingRequired.length===0,missingRequired:raw.missingRequired,recordCount:Object.keys(raw.records).length,project:PROJECT,version:VERSION,environment:raw.environment,saveSchema:SAVE_SCHEMA}}

globalThis.__AGCB_SAVE_ENVELOPE={version:VERSION,status:'READ_ONLY_ENV_BOUND_DRIVE_BACKUP_FOUNDATION',project:PROJECT,format:FORMAT,schema:SAVE_SCHEMA,saveSchema:SAVE_SCHEMA,prefix:PREFIX,requiredKeys:[...REQUIRED_KEYS],runtimeEnvironment,captureRaw,capture,verify,readiness};
