// AG Cute Blocks TEST-only local save fallback preload.
// If the current world save is missing or malformed, recover from the legacy save
// before the guarded V0.5.04 core or wildlife reader consumes localStorage.
const SAVE_KEY='ag_cute_blocks_world_v04';
const OLD_SAVE_KEY='ag_cute_blocks_world_v03';
const CORRUPT_BACKUP_KEY='ag_cute_blocks_world_v04_corrupt_backup';
function parseObject(raw){if(!raw)return null;try{const d=JSON.parse(raw);return d&&typeof d==='object'&&!Array.isArray(d)?d:null}catch{return null}}
function validWorld(d){return !!d&&(Array.isArray(d.blocks)||Array.isArray(d.objects)||!!d.player)}
let status='CURRENT_OK';
try{
  const currentRaw=localStorage.getItem(SAVE_KEY),current=parseObject(currentRaw);
  if(!validWorld(current)){
    const legacyRaw=localStorage.getItem(OLD_SAVE_KEY),legacy=parseObject(legacyRaw);
    if(validWorld(legacy)){
      if(currentRaw){try{localStorage.setItem(CORRUPT_BACKUP_KEY,currentRaw)}catch{}}
      localStorage.setItem(SAVE_KEY,legacyRaw);
      const verify=parseObject(localStorage.getItem(SAVE_KEY));
      status=validWorld(verify)?(currentRaw?'RECOVERED_CORRUPT_CURRENT':'MIGRATED_LEGACY'):'RECOVERY_WRITE_FAILED';
    }else status=currentRaw?'CURRENT_INVALID_NO_LEGACY':'NO_SAVE';
  }
}catch(e){status='PRELOAD_ERROR';console.warn('[AGCB] local save fallback preload failed',e)}
globalThis.__AGCB_LOCAL_SAVE_FALLBACK={version:1,status,currentKey:SAVE_KEY,legacyKey:OLD_SAVE_KEY,corruptBackupKey:CORRUPT_BACKUP_KEY};
