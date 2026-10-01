// AG Cute Blocks TEST-only local save fallback preload.
// Recover structurally sane current worlds and authentic legacy-v03 shapes before guarded core/wildlife consume localStorage.
const SAVE_KEY='ag_cute_blocks_world_v04';
const OLD_SAVE_KEY='ag_cute_blocks_world_v03';
const CORRUPT_BACKUP_KEY='ag_cute_blocks_world_v04_corrupt_backup';
function parseObject(raw){if(!raw)return null;try{const d=JSON.parse(raw);return d&&typeof d==='object'&&!Array.isArray(d)?d:null}catch{return null}}
function finiteCoord(v){return Number.isFinite(Number(v))}
function sanePlayer(p,{legacy=false}={}){if(!p||typeof p!=='object'||Array.isArray(p)||!finiteCoord(p.x)||!finiteCoord(p.z))return false;if(!legacy&&!finiteCoord(p.y))return false;if(p.y!==undefined&&!finiteCoord(p.y))return false;return true}
function saneRecord(r){return !!r&&typeof r==='object'&&!Array.isArray(r)&&finiteCoord(r.x)&&finiteCoord(r.z)&&(r.y===undefined||finiteCoord(r.y))}
function saneCollections(d){return Array.isArray(d.blocks)&&Array.isArray(d.objects)&&d.blocks.length<=20000&&d.objects.length<=10000&&d.blocks.every(saneRecord)&&d.objects.every(saneRecord)}
function validCurrentWorld(d){return !!d&&typeof d==='object'&&!Array.isArray(d)&&saneCollections(d)&&sanePlayer(d)}
function validLegacyWorld(d){return !!d&&typeof d==='object'&&!Array.isArray(d)&&saneCollections(d)&&sanePlayer(d.player,{legacy:true})}
let status='CURRENT_OK';
try{
  const currentRaw=localStorage.getItem(SAVE_KEY),current=parseObject(currentRaw);
  if(!validCurrentWorld(current)){
    const legacyRaw=localStorage.getItem(OLD_SAVE_KEY),legacy=parseObject(legacyRaw);
    if(validLegacyWorld(legacy)){
      if(currentRaw&&!localStorage.getItem(CORRUPT_BACKUP_KEY)){try{localStorage.setItem(CORRUPT_BACKUP_KEY,currentRaw)}catch{}}
      localStorage.setItem(SAVE_KEY,legacyRaw);
      const verify=parseObject(localStorage.getItem(SAVE_KEY));
      status=validLegacyWorld(verify)?(currentRaw?'RECOVERED_CORRUPT_CURRENT':'MIGRATED_LEGACY'):'RECOVERY_WRITE_FAILED';
    }else status=currentRaw?'CURRENT_INVALID_NO_LEGACY':'NO_SAVE';
  }
}catch(e){status='PRELOAD_ERROR';console.warn('[AGCB] local save fallback preload failed',e)}
globalThis.__AGCB_LOCAL_SAVE_FALLBACK={version:4,status,currentKey:SAVE_KEY,legacyKey:OLD_SAVE_KEY,corruptBackupKey:CORRUPT_BACKUP_KEY};
