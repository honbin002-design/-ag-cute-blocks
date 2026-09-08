// AG Cute Blocks V0.5.77 - UAL3 real furniture fitting layer.
// Actual iPhone furniture interaction in V0.5.76 proved the former height-only fit insufficient.
// This revision forces the correct UAL pose, waits for it to settle, then fits the visual to the real furniture centre/surface.
import * as THREE from 'three';
const VERSION='V0.5.77',WORLD_KEY='ag_cute_blocks_world_v04';
const SEAT_TOP={chair:.71,sofa:.695,swingGarden:1.005};
const SEAT_PELVIS_LIFT={chair:.18,sofa:.18,swingGarden:.17};
const BED_TOP={bed:.80,starBed:.80};
const FURNITURE=new Set([...Object.keys(SEAT_TOP),...Object.keys(BED_TOP)]);
const tmp=new THREE.Vector3(),box=new THREE.Box3();
let active=null,base=null,lastMode='',lastFurnitureId='',settleUntil=0,poseForced='';
function readWorld(){try{return JSON.parse(localStorage.getItem(WORLD_KEY)||'null')}catch{return null}}
function api(){return globalThis.__AGCB_TEST_CHARACTER_INTEGRATION}
function furnitureMode(){const life=document.getElementById('lifeInteract')?.textContent||'',status=document.getElementById('status')?.textContent||'';if(!life.includes('起身'))return'';if(/躺下|睡/.test(status)||/躺下休息/.test(status))return'sleep';if(/坐下休息|放鬆中|舒服坐|休息中/.test(status))return'sit';return''}
function nearestFurniture(player){if(!player)return null;const w=readWorld();let best=null,bestD=3.2;for(const o of w?.objects||[]){if(!FURNITURE.has(o.type))continue;const d=Math.hypot((o.x||0)-player.position.x,(o.z||0)-player.position.z);if(d<bestD){bestD=d;best=o}}return best}
function pelvis(root){let found=null;root?.traverse?.(o=>{if(found||!o.name)return;const n=o.name.toLowerCase();if(n==='pelvis'||n==='hips'||n==='hip'||n.endsWith('_pelvis'))found=o});return found}
function remember(candidate){if(active===candidate&&base)return;active=candidate;base={position:candidate.root.position.clone(),rotation:candidate.root.rotation.clone()};lastMode='';lastFurnitureId='';poseForced=''}
function reset(candidate){if(candidate?.root&&base&&active===candidate){candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation)}active=null;base=null;lastMode='';lastFurnitureId='';poseForced='';settleUntil=0}
function forcePose(a,mode){const wanted=mode==='sleep'?'sleep':'sit';if(poseForced===wanted&&a.candidate?.action===wanted)return;poseForced=wanted;a.force?.(wanted,mode==='sleep'?0:86400000);settleUntil=performance.now()+(mode==='sleep'?380:180)}
function freezeSleep(candidate){const action=candidate.actions?.sleep;if(!action)return;const dur=action.getClip?.().duration||4.4;action.enabled=true;action.paused=false;action.time=Math.max(0,dur-.10);candidate.mixer?.update?.(0);action.paused=true}
function targetSeatWorldY(f){return (SEAT_TOP[f.type]??.72)+(SEAT_PELVIS_LIFT[f.type]??.18)}
function fitSit(candidate,f){const p=pelvis(candidate.root);if(!p)return;candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation);candidate.root.updateMatrixWorld(true);p.updateMatrixWorld(true);const pp=p.getWorldPosition(tmp);const dy=targetSeatWorldY(f)-pp.y;candidate.root.position.y+=Math.max(-1.25,Math.min(1.25,dy));candidate.root.updateMatrixWorld(true)}
function fitSleep(candidate,f){freezeSleep(candidate);candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation);candidate.root.updateMatrixWorld(true);box.setFromObject(candidate.root);if(box.isEmpty())return;const c=box.getCenter(tmp);const targetX=Number(f.x)||0,targetZ=Number(f.z)||0;const worldDelta=new THREE.Vector3(targetX-c.x,0,targetZ-c.z);const parent=candidate.root.parent;if(parent){const q=new THREE.Quaternion();parent.getWorldQuaternion(q);worldDelta.applyQuaternion(q.invert())}candidate.root.position.x+=worldDelta.x;candidate.root.position.z+=worldDelta.z;candidate.root.updateMatrixWorld(true);box.setFromObject(candidate.root);const top=(BED_TOP[f.type]??.80)+.025;const dy=top-box.min.y;candidate.root.position.y+=Math.max(-1.8,Math.min(1.8,dy));candidate.root.updateMatrixWorld(true)}
function tick(){requestAnimationFrame(tick);const a=api(),candidate=a?.candidate,player=a?.player;if(!candidate?.root||a?.selected!=='ual3'||!player){if(active)reset(active);return}const mode=furnitureMode();if(!mode){if(active)reset(candidate);return}const f=nearestFurniture(player);if(!f)return;remember(candidate);const fid=`${f.id||f.type}:${f.x}:${f.z}:${f.rot||0}`;if(lastMode!==mode||lastFurnitureId!==fid){candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation);lastMode=mode;lastFurnitureId=fid;poseForced='';forcePose(a,mode)}else forcePose(a,mode);if(performance.now()<settleUntil)return;if(mode==='sleep'){if(candidate.action!=='sleep')return;fitSleep(candidate,f)}else{if(candidate.action!=='sit')return;fitSit(candidate,f)}}
requestAnimationFrame(tick);
globalThis.__AGCB_UAL_FURNITURE_FIT={version:VERSION,seatTop:SEAT_TOP,bedTop:BED_TOP,status:'ACTUAL_IPHONE_FAIL_REWORK+FORCED_POSE+CENTERED_MATTRESS_FIT'};
