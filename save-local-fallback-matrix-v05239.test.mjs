// AG Cute Blocks V0.5.239 deterministic TEST matrix for local-save fallback.
// Pure in-memory harness: never touches browser localStorage or PROD data.
const SAVE='ag_cute_blocks_world_v04',OLD='ag_cute_blocks_world_v03',BACKUP='ag_cute_blocks_world_v04_corrupt_backup';
const parse=raw=>{if(!raw)return null;try{const d=JSON.parse(raw);return d&&typeof d==='object'&&!Array.isArray(d)?d:null}catch{return null}};
const valid=d=>!!d&&(Array.isArray(d.blocks)||Array.isArray(d.objects)||!!d.player);
class Store{constructor(seed={},failWrite=false){this.m=new Map(Object.entries(seed));this.failWrite=failWrite}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){if(this.failWrite&&k===SAVE)throw new Error('injected write failure');this.m.set(k,String(v))}}
function recover(store){let status='CURRENT_OK';try{const currentRaw=store.getItem(SAVE),current=parse(currentRaw);if(!valid(current)){const legacyRaw=store.getItem(OLD),legacy=parse(legacyRaw);if(valid(legacy)){if(currentRaw){try{store.setItem(BACKUP,currentRaw)}catch{}}store.setItem(SAVE,legacyRaw);const verify=parse(store.getItem(SAVE));status=valid(verify)?(currentRaw?'RECOVERED_CORRUPT_CURRENT':'MIGRATED_LEGACY'):'RECOVERY_WRITE_FAILED'}else status=currentRaw?'CURRENT_INVALID_NO_LEGACY':'NO_SAVE'}}catch{status='PRELOAD_ERROR'}return status}
const goodCurrent=JSON.stringify({objects:[],player:{x:1}}),goodLegacy=JSON.stringify({blocks:[],player:{x:2}}),bad='{broken';
const cases=[
 ['current-valid',new Store({[SAVE]:goodCurrent,[OLD]:goodLegacy}),'CURRENT_OK',goodCurrent,null],
 ['current-corrupt-legacy-valid',new Store({[SAVE]:bad,[OLD]:goodLegacy}),'RECOVERED_CORRUPT_CURRENT',goodLegacy,bad],
 ['current-missing-legacy-valid',new Store({[OLD]:goodLegacy}),'MIGRATED_LEGACY',goodLegacy,null],
 ['both-invalid',new Store({[SAVE]:bad,[OLD]:'[]'}),'CURRENT_INVALID_NO_LEGACY',bad,null],
 ['migration-write-fails',new Store({[OLD]:goodLegacy},true),'PRELOAD_ERROR',null,null]
];
let failed=0;for(const [name,store,wantStatus,wantSave,wantBackup] of cases){const got=recover(store),save=store.getItem(SAVE),backup=store.getItem(BACKUP);const ok=got===wantStatus&&save===wantSave&&backup===wantBackup;console.log(`${ok?'PASS':'FAIL'} ${name}: ${got}`);if(!ok){failed++;console.error({wantStatus,got,wantSave,save,wantBackup,backup})}}
if(failed)throw new Error(`AGCB local-save matrix failed: ${failed}/${cases.length}`);console.log(`PASS matrix: ${cases.length}/${cases.length}`);
