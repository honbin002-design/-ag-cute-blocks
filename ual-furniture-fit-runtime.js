// AG Cute Blocks V0.5.76 - UAL3 furniture fitting layer.
// The core world already moves/rotates the player to the furniture anchor. This layer only calibrates the UAL visual inside that anchored player.
import * as THREE from 'three';
const VERSION='V0.5.76',WORLD_KEY='ag_cute_blocks_world_v04';
const SEAT_TOP={chair:.71,sofa:.695,swingGarden:1.005};
const SIT_BUTT_OFFSET={chair:.19,sofa:.20,swingGarden:.18};
const BED_TOP={bed:.80,starBed:.80};
const FURNITURE=new Set([...Object.keys(SEAT_TOP),...Object.keys(BED_TOP)]);
const box=new THREE.Box3(),target=new THREE.Vector3();
let active=null,base=null,lastMode='';
function readWorld(){try{return JSON.parse(localStorage.getItem(WORLD_KEY)||'null')}catch{return null}}
function api(){return globalThis.__AGCB_TEST_CHARACTER_INTEGRATION}
function nearestFurniture(player){if(!player)return null;const w=readWorld();let best=null,bestD=3;for(const o of w?.objects||[]){if(!FURNITURE.has(o.type))continue;const d=Math.hypot((o.x||0)-player.position.x,(o.z||0)-player.position.z);if(d<bestD){bestD=d;best=o}}return best}
function pelvis(root){let found=null;root?.traverse?.(o=>{if(found||!o.name)return;const n=o.name.toLowerCase();if(n==='pelvis'||n==='hips'||n==='hip'||n.endsWith('_pelvis'))found=o});return found}
function furnitureMode(){const life=document.getElementById('lifeInteract')?.textContent||'',status=document.getElementById('status')?.textContent||'';if(!life.includes('起身'))return'';if(/躺下|睡/.test(status)||/躺下休息/.test(status))return'sleep';if(/坐下休息|放鬆中|舒服坐|休息中/.test(status))return'sit';return''}
function reset(candidate){if(!candidate?.root)return;if(base&&active===candidate){candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation)}active=null;base=null;lastMode=''}
function ensureBase(candidate){if(active===candidate&&base)return;active=candidate;base={position:candidate.root.position.clone(),rotation:candidate.root.rotation.clone()};lastMode=''}
function freezeSleepPose(candidate){const action=candidate.actions?.sleep;if(!action)return;action.enabled=true;action.paused=true;action.time=Math.max(0,Math.min((action.getClip?.().duration||4.4)-.08,4.3));candidate.mixer?.update?.(0)}
function fitSit(candidate,f){const p=pelvis(candidate.root);if(!p)return;candidate.root.position.x=base.position.x;candidate.root.position.z=base.position.z;candidate.root.updateMatrixWorld(true);p.updateMatrixWorld(true);const pp=p.getWorldPosition(target);const wanted=(SEAT_TOP[f.type]??.72)+(SIT_BUTT_OFFSET[f.type]??.19);let dy=wanted-pp.y;dy=Math.max(-.9,Math.min(.9,dy));if(Math.abs(dy)>.003)candidate.root.position.y+=dy*.86}
function fitSleep(candidate,f){freezeSleepPose(candidate);candidate.root.position.x=base.position.x;candidate.root.position.z=base.position.z;candidate.root.updateMatrixWorld(true);box.setFromObject(candidate.root);if(box.isEmpty())return;const top=(BED_TOP[f.type]??.80)+.018;let dy=top-box.min.y;dy=Math.max(-1.4,Math.min(1.4,dy));if(Math.abs(dy)>.003)candidate.root.position.y+=dy*.90}
function tick(){requestAnimationFrame(tick);const a=api(),candidate=a?.candidate,player=a?.player;if(!candidate?.root||a?.selected!=='ual3'||!player){if(active)reset(active);return}const mode=furnitureMode();if(!mode){if(active)reset(candidate);return}const f=nearestFurniture(player);if(!f)return;ensureBase(candidate);if(lastMode!==mode){candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation);lastMode=mode}if(mode==='sleep'&&candidate.action==='sleep')fitSleep(candidate,f);else if(mode==='sit'&&candidate.action==='sit')fitSit(candidate,f)}
requestAnimationFrame(tick);
globalThis.__AGCB_UAL_FURNITURE_FIT={version:VERSION,seatTop:SEAT_TOP,sitButtOffset:SIT_BUTT_OFFSET,bedTop:BED_TOP,status:'CORE_ANCHOR_PRESERVED+STATIC_SLEEP_FINAL_POSE'};
