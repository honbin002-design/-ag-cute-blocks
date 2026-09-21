// AG Cute Blocks V0.5.193 — formal CC0 adult game runtime adapter.
// TEST branch only. Uses the existing overlay contract: root / play / update / available.
import * as THREE from 'three';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const TARGET_BASE='https://raw.githubusercontent.com/BoQsc/gpu-marching-cubes/54368c0875c5f72be00160fafb040c6ce5c4e760/models/entities/player/Universal%20Base%20Characters%5BStandard%5D/Base%20Characters/Godot%20-%20UE/';
const UAL_BASE='https://raw.githubusercontent.com/J-Ponzo/gltf-universal-animation-library/e24c23cf2a1323488a3faa226ea7ea21f644b73e/glTF/';
const UAL1=UAL_BASE+'AnimationLibrary_Godot_Standard.gltf';
const MODELS={male:TARGET_BASE+'Superhero_Male_FullBody.gltf',female:TARGET_BASE+'Superhero_Female_FullBody.gltf'};
const cache=new Map();
function load(loader,url){if(cache.has(url))return cache.get(url);const p=new Promise((res,rej)=>loader.load(url,res,undefined,rej));cache.set(url,p);p.catch(()=>cache.delete(url));return p}
const boneMap={'root':'root','DEF-hips':'pelvis','DEF-spine.001':'spine_01','DEF-spine.002':'spine_02','DEF-spine.003':'spine_03','DEF-neck':'neck_01','DEF-head':'Head','DEF-shoulder.L':'clavicle_l','DEF-upper_arm.L':'upperarm_l','DEF-forearm.L':'lowerarm_l','DEF-hand.L':'hand_l','DEF-shoulder.R':'clavicle_r','DEF-upper_arm.R':'upperarm_r','DEF-forearm.R':'lowerarm_r','DEF-hand.R':'hand_r','DEF-thigh.L':'thigh_l','DEF-shin.L':'calf_l','DEF-foot.L':'foot_l','DEF-toe.L':'ball_l','DEF-thigh.R':'thigh_r','DEF-shin.R':'calf_r','DEF-foot.R':'foot_r','DEF-toe.R':'ball_r'};
function findSkeleton(root){let sk=null;root.traverse(o=>{if(!sk&&o.isSkinnedMesh&&o.skeleton?.bones?.length)sk=o.skeleton});return sk}
function sourceMap(root){const m={};root.traverse(o=>{if(o.name)m[o.name]=o});return m}
function targetBones(sk){const m={};for(const b of sk.bones)m[b.name]=b;return m}
function fitHeight(root,target=2){root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());root.scale.multiplyScalar(target/Math.max(size.y,.001));root.updateMatrixWorld(true);const b2=new THREE.Box3().setFromObject(root),c=b2.getCenter(new THREE.Vector3());root.position.x-=c.x;root.position.z-=c.z;root.position.y-=b2.min.y;root.updateMatrixWorld(true)}
function chooseClip(clips,names){for(const n of names){const exact=clips.find(c=>c.name===n);if(exact)return exact}for(const n of names){const q=n.toLowerCase(),hit=clips.find(c=>String(c.name).toLowerCase().includes(q));if(hit)return hit}return null}
async function create(sex='male'){
  const variant=sex==='female'?'female':'male',loader=new GLTFLoader();
  const [targetG,srcG]=await Promise.all([load(loader,MODELS[variant]),load(loader,UAL1)]);
  const root=targetG.scene.clone(true),source=srcG.scene.clone(true);root.name=`ag-formal-cc0-${variant}-v05193`;root.userData={agFormalCharacter:true,release:'V0.5.193',sex:variant};fitHeight(root,2);
  const sk=findSkeleton(root);if(!sk)throw new Error('V0.5.193 target skeleton missing');const src=sourceMap(source),dst=targetBones(sk),pairs=[];
  source.updateMatrixWorld(true);root.updateMatrixWorld(true);
  for(const [sn,tn] of Object.entries(boneMap)){const s=src[sn],d=dst[tn];if(s&&d){const sb=new THREE.Quaternion(),db=new THREE.Quaternion();s.getWorldQuaternion(sb);d.getWorldQuaternion(db);pairs.push({s,d,sb,db})}}
  if(pairs.length<20)throw new Error(`V0.5.193 bone map insufficient ${pairs.length}`);
  const sourceHips=src['DEF-hips'],targetHips=dst['pelvis'];if(!sourceHips||!targetHips)throw new Error('V0.5.193 hips missing');const sourceHipsBind=sourceHips.position.clone(),targetHipsBind=targetHips.position.clone();
  const clips=srcG.animations||[],mixer=new THREE.AnimationMixer(source),requested={idle:['Idle_Loop','Idle'],walk:['Walk_Loop','Walk'],run:['Jog_Fwd_Loop','Jog_Fwd','Jog'],jump:['Jump_Loop','Jump'],sit:['Sitting_Idle_Loop','Sitting_Idle'],swim:['Swim_Fwd_Loop','Swim_Fwd'],interact:['Interact'],dodge:['Roll']},actions={};
  for(const [k,names] of Object.entries(requested)){const c=chooseClip(clips,names);if(c)actions[k]=mixer.clipAction(c,source)}actions.fish=actions.interact||actions.idle;actions.sleep=actions.sit||actions.idle;
  for(const required of ['idle','walk','run','jump'])if(!actions[required])throw new Error(`V0.5.193 required action missing ${required}`);
  let current=null,currentName='idle';
  function play(name='idle'){const routed=actions[name]?name:'idle',next=actions[routed];if(!next)return;if(next===current){currentName=routed;return}const once=['jump','interact','dodge'].includes(routed);current?.fadeOut(.14);next.reset();next.enabled=true;next.setEffectiveWeight(1);next.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat,once?1:Infinity);next.clampWhenFinished=once;next.fadeIn(.14).play();current=next;currentName=routed}
  function retarget(){source.updateMatrixWorld(true);root.updateMatrixWorld(true);for(const p of pairs){const cur=new THREE.Quaternion();p.s.getWorldQuaternion(cur);const delta=cur.multiply(p.sb.clone().invert()),desired=delta.multiply(p.db.clone()),parentQ=new THREE.Quaternion();if(p.d.parent)p.d.parent.getWorldQuaternion(parentQ);else parentQ.identity();p.d.quaternion.copy(parentQ.invert().multiply(desired));p.d.updateMatrixWorld(true)}const dy=sourceHips.position.y-sourceHipsBind.y;targetHips.position.copy(targetHipsBind);targetHips.position.y+=dy;root.updateMatrixWorld(true)}
  function update(dt){mixer.update(Math.max(0,Number(dt)||0));retarget()}play('idle');retarget();
  return{root,mixer,actions,clips,play,update,available:Object.keys(actions),animationLibraryStatus:`UAL1 Formal CC0 / mapped ${pairs.length}`,styleStatus:`V0.5.193 ${variant} TEST`,forwardYaw:0,get action(){return currentName},get mappedBones(){return pairs.length}};
}
globalThis.__AGCB_FORMAL_CC0_RUNTIME={version:193,release:'V0.5.193',status:'TEST_RUNTIME_ADAPTER',models:MODELS,animations:UAL1,createMale:()=>create('male'),createFemale:()=>create('female'),create};
export{create};