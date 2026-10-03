// AG Cute Blocks TEST-only local save fallback preload.
// Recovery validation follows the authentic V0.4 loader contract while rejecting malformed coordinates.
const SAVE_KEY='agcb_prod_v1_world_v04';
const OLD_SAVE_KEY='agcb_prod_v1_world_v03';
const CORRUPT_BACKUP_KEY='agcb_prod_v1_world_v04_corrupt_backup';
function parseObject(raw){if(!raw)return null;try{const d=JSON.parse(raw);return d&&typeof d==='object'&&!Array.isArray(d)?d:null}catch{return null}}
function finiteCoord(v){return Number.isFinite(Number(v))}
function sanePlayer(p,{legacy=false}={}){if(!p||typeof p!=='object'||Array.isArray(p)||!finiteCoord(p.x)||!finiteCoord(p.z))return false;if(!legacy&&!finiteCoord(p.y))return false;if(p.y!==undefined&&!finiteCoord(p.y))return false;return true}
function saneBlock(r){return !!r&&typeof r==='object'&&!Array.isArray(r)&&finiteCoord(r.x)&&finiteCoord(r.y)&&finiteCoord(r.z)}
function saneObject(r){return !!r&&typeof r==='object'&&!Array.isArray(r)&&finiteCoord(r.x)&&finiteCoord(r.z)&&typeof r.type==='string'&&r.type.length>0}
function saneCollections(d){return Array.isArray(d.blocks)&&Array.isArray(d.objects)&&d.blocks.length<=20000&&d.objects.length<=10000&&d.blocks.every(saneBlock)&&d.objects.every(saneObject)}
function validCurrentWorld(d){return !!d&&typeof d==='object'&&!Array.isArray(d)&&saneCollections(d)&&sanePlayer(d.player)}
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
globalThis.__AGCB_LOCAL_SAVE_FALLBACK={version:5,status,currentKey:SAVE_KEY,legacyKey:OLD_SAVE_KEY,corruptBackupKey:CORRUPT_BACKUP_KEY};
