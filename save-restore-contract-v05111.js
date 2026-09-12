// AG Cute Blocks V0.5.111 — non-destructive TEST restore contract.
// Restore is intentionally staged: validate first, preserve current TEST save, then explicit apply.
(()=>{
'use strict';
const VERSION='0.5.111';
const ENV='TEST';
const FORMAT='AG_CUTE_BLOCKS_SAVE_ENVELOPE';
const PROJECT='AG Cute Blocks';
const PREFIX='ag_cute_blocks_';
const REQUIRED=['ag_cute_blocks_world_v04','ag_cute_blocks_settings_v048_special_models_r2'];
function canonical(b){return JSON.stringify({project:b.project,format:b.format,schema:b.schema,saveSchema:b.saveSchema,environment:b.environment,gameVersion:b.gameVersion,createdAt:b.createdAt,source:b.source,requiredKeys:b.requiredKeys,missingRequired:b.missingRequired,records:b.records})}
async function sha256(text){const bytes=new TextEncoder().encode(String(text));const digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')}
async function validate(envelope){if(!envelope||envelope.project!==PROJECT||envelope.format!==FORMAT)throw new Error('restore-envelope-invalid');if(String(envelope.environment||'').toUpperCase()!==ENV)throw new Error('restore-cross-environment-rejected');if(!envelope.integrity||envelope.integrity.algorithm!=='SHA-256'||!envelope.integrity.sha256)throw new Error('restore-integrity-missing');const actual=await sha256(canonical(envelope));if(actual!==envelope.integrity.sha256)throw new Error('restore-integrity-mismatch');const records=envelope.records&&typeof envelope.records==='object'?envelope.records:{};for(const key of REQUIRED)if(!(key in records))throw new Error('restore-required-record-missing');for(const key of Object.keys(records))if(!key.startsWith(PREFIX))throw new Error('restore-record-outside-project-prefix');return{ok:true,sha256:actual,environment:ENV,gameVersion:String(envelope.gameVersion||'')};}
function snapshotCurrent(){const records={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&key.startsWith(PREFIX))records[key]=localStorage.getItem(key)}return records}
function applyRecords(records){for(const [key,value] of Object.entries(records))localStorage.setItem(key,String(value));}
async function prepare(envelope){const verified=await validate(envelope);return{ok:true,status:'VALIDATED_NOT_APPLIED',verified,currentSnapshot:snapshotCurrent(),envelope};}
async function apply(prepared){if(!prepared||prepared.status!=='VALIDATED_NOT_APPLIED')throw new Error('restore-not-prepared');await validate(prepared.envelope);const before=snapshotCurrent();try{applyRecords(prepared.envelope.records);return{ok:true,status:'TEST_RESTORE_APPLIED_RELOAD_REQUIRED',before,sha256:prepared.envelope.integrity.sha256};}catch(err){applyRecords(before);throw err}}
globalThis.__AGCB_TEST_RESTORE_CONTRACT={VERSION,ENV,status:'TEST_ONLY_VALIDATE_PRESERVE_APPLY_NO_PROD',validate,prepare,apply};
})();
