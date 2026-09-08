// AG Cute Blocks V0.5.80 - UAL3 exact active-furniture fitting layer + observable telemetry.
// Core enterFurniture() already owns the authoritative anchor + furniture yaw.
// Never search/guess a nearest furniture object here: the UAL visual is a child of
// the already-positioned player and only receives pose-specific local fitting.
import * as THREE from 'three';
const VERSION='V0.5.80';
const SEAT_SURFACE_LOCAL={chair:.71,sofa:.695,swingGarden:1.005};
const SEAT_PELVIS_CLEARANCE={chair:.10,sofa:.10,swingGarden:.10};
const BED_SURFACE_LOCAL={bed:.79,starBed:.79};
const tmp=new THREE.Vector3(),box=new THREE.Box3(),delta=new THREE.Vector3(),parentQ=new THREE.Quaternion();
let active=null,base=null,lastMode='',lastAnchor=null,settleUntil=0,poseForced='';
let telemetry={version:VERSION,active:false,mode:'',type:'',action:'',settling:false,targetY:null,currentY:null,errorY:null,centerErrorXZ:null,status:'IDLE'};
function api(){return globalThis.__AGCB_TEST_CHARACTER_INTEGRATION}
function state(){return globalThis.__AGCB_ACTIVE_FURNITURE_STATE}
function pelvis(root){let found=null;root?.traverse?.(o=>{if(found||!o.name)return;const n=o.name.toLowerCase();if(n==='pelvis'||n==='hips'||n==='hip'||n.endsWith('_pelvis'))found=o});return found}
function remember(candidate){if(active===candidate&&base)return;active=candidate;base={position:candidate.root.position.clone(),rotation:candidate.root.rotation.clone()};lastMode='';lastAnchor=null;poseForced=''}
function reset(candidate){if(candidate?.root&&base&&active===candidate){candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation);candidate.root.updateMatrixWorld(true)}active=null;base=null;lastMode='';lastAnchor=null;poseForced='';settleUntil=0;telemetry={version:VERSION,active:false,mode:'',type:'',action:'',settling:false,targetY:null,currentY:null,errorY:null,centerErrorXZ:null,status:'IDLE'}}
function forcePose(a,mode){const wanted=mode==='lie'?'sleep':'sit';if(poseForced===wanted&&a.candidate?.action===wanted)return;poseForced=wanted;a.force?.(wanted,mode==='lie'?0:86400000);settleUntil=performance.now()+(mode==='lie'?420:220)}
function freezeSleep(candidate){const action=candidate.actions?.sleep;if(!action)return false;const dur=action.getClip?.().duration||4.4;action.enabled=true;action.paused=false;action.time=Math.max(0,dur-.10);candidate.mixer?.update?.(0);action.paused=true;return true}
function worldToLocalDelta(root,worldDelta){const parent=root.parent;if(!parent)return worldDelta;parent.getWorldQuaternion(parentQ);return worldDelta.applyQuaternion(parentQ.invert())}
function seatWorldY(anchor,type){const y=SEAT_SURFACE_LOCAL[type];if(!Number.isFinite(y))return null;anchor.updateMatrixWorld(true);return anchor.localToWorld(new THREE.Vector3(0,y,0)).y}
function bedWorldY(anchor,type){const y=BED_SURFACE_LOCAL[type];if(!Number.isFinite(y))return null;anchor.updateMatrixWorld(true);return anchor.localToWorld(new THREE.Vector3(0,y,0)).y+.018}
function n3(v){return Number.isFinite(v)?Math.round(v*1000)/1000:null}
function fitSit(candidate,player,anchor,type){
  const p=pelvis(candidate.root),surface=seatWorldY(anchor,type);if(!p||surface===null){telemetry.status='SIT_TARGET_UNAVAILABLE';return}
  // Core already placed/rotated player at furnitureAnchorWorld/furnitureYaw.
  // Preserve X/Z and yaw exactly; only solve the UAL pelvis height for this pose.
  candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation);candidate.root.updateMatrixWorld(true);p.updateMatrixWorld(true);
  const pp=p.getWorldPosition(tmp),target=surface+(SEAT_PELVIS_CLEARANCE[type]??.10),dy=target-pp.y;
  delta.set(0,dy,0);worldToLocalDelta(candidate.root,delta);candidate.root.position.add(delta);candidate.root.updateMatrixWorld(true);
  p.updateMatrixWorld(true);const after=p.getWorldPosition(tmp);
  telemetry={version:VERSION,active:true,mode:'sit',type,action:candidate.action||'',settling:false,targetY:n3(target),currentY:n3(after.y),errorY:n3(target-after.y),centerErrorXZ:0,status:'FIT_SIT'};
}
function fitSleep(candidate,player,anchor,type){
  const surface=bedWorldY(anchor,type);if(surface===null||!freezeSleep(candidate)){telemetry.status='SLEEP_TARGET_UNAVAILABLE';return}
  candidate.root.position.copy(base.position);
  // AG sleep clip rotates the body from upright into its local X axis. Bed depth/long
  // axis is local Z, so add 90° around Y while retaining the core furniture yaw.
  candidate.root.rotation.copy(base.rotation);candidate.root.rotation.y+=Math.PI/2;candidate.root.updateMatrixWorld(true);
  box.setFromObject(candidate.root);if(box.isEmpty()){telemetry.status='SLEEP_BBOX_EMPTY';return}
  const c=box.getCenter(tmp);
  // The player's world position IS the authoritative core furniture anchor.
  // Center the settled lying body on that exact anchor, never on a guessed object.
  const beforeCenterError=Math.hypot(player.position.x-c.x,player.position.z-c.z);
  delta.set(player.position.x-c.x,surface-box.min.y,player.position.z-c.z);
  worldToLocalDelta(candidate.root,delta);candidate.root.position.add(delta);candidate.root.updateMatrixWorld(true);
  box.setFromObject(candidate.root);const afterC=box.getCenter(tmp);
  telemetry={version:VERSION,active:true,mode:'lie',type,action:candidate.action||'',settling:false,targetY:n3(surface),currentY:n3(box.min.y),errorY:n3(surface-box.min.y),centerErrorXZ:n3(Math.hypot(player.position.x-afterC.x,player.position.z-afterC.z)),preFitCenterErrorXZ:n3(beforeCenterError),status:'FIT_SLEEP'};
}
function tick(){
  requestAnimationFrame(tick);const a=api(),candidate=a?.candidate,player=a?.player,s=state();
  if(!candidate?.root||a?.selected!=='ual3'||!player||!s?.active){if(active)reset(active);return}
  const mode=s.mode,anchor=s.anchor,type=s.type;if((mode!=='sit'&&mode!=='lie')||!anchor)return;
  remember(candidate);
  if(lastMode!==mode||lastAnchor!==anchor){candidate.root.position.copy(base.position);candidate.root.rotation.copy(base.rotation);lastMode=mode;lastAnchor=anchor;poseForced='';forcePose(a,mode)}else forcePose(a,mode);
  if(performance.now()<settleUntil){telemetry={version:VERSION,active:true,mode,type,action:candidate.action||'',settling:true,targetY:null,currentY:null,errorY:null,centerErrorXZ:null,status:'SETTLING'};return}
  if(mode==='lie'){if(candidate.action!=='sleep'){poseForced='';forcePose(a,mode);telemetry.status='WAIT_SLEEP_ACTION';return}fitSleep(candidate,player,anchor,type)}
  else{if(candidate.action!=='sit'){poseForced='';forcePose(a,mode);telemetry.status='WAIT_SIT_ACTION';return}fitSit(candidate,player,anchor,type)}
}
requestAnimationFrame(tick);
globalThis.__AGCB_UAL_FURNITURE_FIT={version:VERSION,status:'EXACT_CORE_ACTIVE_FURNITURE_ANCHOR+POSE_ONLY_LOCAL_FIT+BED_LONG_AXIS+OBSERVABLE_TELEMETRY+VISUAL_PENDING',seatSurface:SEAT_SURFACE_LOCAL,bedSurface:BED_SURFACE_LOCAL,getTelemetry:()=>({...telemetry})};
