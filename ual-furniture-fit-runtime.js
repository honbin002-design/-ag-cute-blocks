// AG Cute Blocks V0.5.75 - UAL3 furniture fitting layer.
// Keeps validated animation poses, but aligns the rendered UAL candidate to the actual chair/sofa/bed surface.
import * as THREE from 'three';
const VERSION='V0.5.75',WORLD_KEY='ag_cute_blocks_world_v04';
const SEAT_TOP={chair:.71,sofa:.695,swingGarden:1.005};
const BED_TOP={bed:.80,starBed:.80};
const FURNITURE=new Set([...Object.keys(SEAT_TOP),...Object.keys(BED_TOP)]);
const box=new THREE.Box3(),center=new THREE.Vector3(),target=new THREE.Vector3(),localTarget=new THREE.Vector3();
let active=null,base=null,lastKind='';
function readWorld(){try{return JSON.parse(localStorage.getItem(WORLD_KEY)||'null')}catch{return null}}
function api(){return globalThis.__AGCB_TEST_CHARACTER_INTEGRATION}
function nearestFurniture(player){if(!player)return null;const w=readWorld();let best=null,bestD=3;for(const o of w?.objects||[]){if(!FURNITURE.has(o.type))continue;const d=Math.hypot((o.x||0)-player.position.x,(o.z||0)-player.position.z);if(d<bestD){bestD=d;best=o}}return best}
function pelvis(root){let found=null;root?.traverse?.(o=>{if(found||!o.name)return;const n=o.name.toLowerCase();if(n==='pelvis'||n==='hips'||n==='hip'||n.endsWith('_pelvis'))found=o});return found}
function furnitureMode(){const life=document.getElementById('lifeInteract')?.textContent||'',status=document.getElementById('status')?.textContent||'';if(!life.includes('起身'))return'';if(/躺下|睡|休息中/.test(status)&&!/坐下休息/.test(status))return'sleep';if(/坐下休息|休息中|放鬆中|舒服坐/.test(status))return'sit';return''}
function reset(candidate){if(!candidate?.root)return;if(base&&active===candidate){candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation)}active=null;base=null;lastKind=''}
function ensureBase(candidate){if(active===candidate&&base)return;active=candidate;base={position:candidate.root.position.clone(),rotation:candidate.root.rotation.clone()};lastKind=''}
function fitSit(candidate,f){const p=pelvis(candidate.root);if(!p)return;candidate.root.updateMatrixWorld(true);p.updateMatrixWorld(true);const pp=p.getWorldPosition(target);const wanted=(SEAT_TOP[f.type]??.72)+.015;let dy=wanted-pp.y;dy=Math.max(-.75,Math.min(.9,dy));candidate.root.position.y+=dy*.72;
  // Keep the pelvis over the furniture center so the avatar cannot sit in front of/behind the seat.
  target.set(Number(f.x||0),pp.y,Number(f.z||0));const parent=candidate.root.parent;if(parent){parent.worldToLocal(localTarget.copy(target));const currentParent=parent.worldToLocal(p.getWorldPosition(center));candidate.root.position.x+=(localTarget.x-currentParent.x)*.70;candidate.root.position.z+=(localTarget.z-currentParent.z)*.70}}
function fitSleep(candidate,f){candidate.root.updateMatrixWorld(true);box.setFromObject(candidate.root);if(box.isEmpty())return;box.getCenter(center);const top=BED_TOP[f.type]??.80;let dy=top+.012-box.min.y;dy=Math.max(-1.4,Math.min(1.4,dy));candidate.root.position.y+=dy*.78;
  // After the sleep clip rotates the skeleton, recenter the full posed body on the mattress.
  target.set(Number(f.x||0),center.y,Number(f.z||0));const parent=candidate.root.parent;if(parent){parent.worldToLocal(localTarget.copy(target));const currentParent=parent.worldToLocal(center.clone());candidate.root.position.x+=(localTarget.x-currentParent.x)*.72;candidate.root.position.z+=(localTarget.z-currentParent.z)*.72}}
function tick(){requestAnimationFrame(tick);const a=api(),candidate=a?.candidate,player=a?.player;if(!candidate?.root||a?.selected!=='ual3'||!player){if(active)reset(active);return}const mode=furnitureMode();if(!mode){if(active)reset(candidate);return}const f=nearestFurniture(player);if(!f)return;ensureBase(candidate);if(lastKind!==f.type){candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation);lastKind=f.type}
  // Let the animation pose settle first, then only fit translation. Pose rotations remain untouched.
  if(mode==='sleep'&&candidate.action==='sleep')fitSleep(candidate,f);else if(mode==='sit'&&candidate.action==='sit')fitSit(candidate,f)}
requestAnimationFrame(tick);
globalThis.__AGCB_UAL_FURNITURE_FIT={version:VERSION,seatTop:SEAT_TOP,bedTop:BED_TOP,status:'POSE_PRESERVED_FURNITURE_ALIGNMENT'};
