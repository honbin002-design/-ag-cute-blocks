// AG Cute Blocks - Candidate 018 production gameplay runtime.
// Validated path: VRM normalized humanoid + W0 world-space delta retarget.
import * as THREE from 'three';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import {VRMLoaderPlugin,VRMUtils} from 'https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3.4.4/lib/three-vrm.module.js';

const DONOR='https://raw.githubusercontent.com/ruslanmv/3D-Avatar-Chatbot/c8c4e13d2c76038e53fdc02bd897d5850eb44cea/vendor/avatars/HairSample_Female.vrm';
const UAL_BASE='https://raw.githubusercontent.com/J-Ponzo/gltf-universal-animation-library/e24c23cf2a1323488a3faa226ea7ea21f644b73e/glTF/';
const UAL1=UAL_BASE+'AnimationLibrary_Godot_Standard.gltf';
const cache=new Map();
function load(loader,url){const key=url;if(cache.has(key))return cache.get(key);const p=new Promise((res,rej)=>loader.load(url,res,undefined,rej));cache.set(key,p);p.catch(()=>cache.delete(key));return p}

const legacy={hips:'DEF-hips',spine:'DEF-spine.001',chest:'DEF-spine.002',upperChest:'DEF-spine.003',neck:'DEF-neck',head:'DEF-head',leftShoulder:'DEF-shoulder.L',leftUpperArm:'DEF-upper_arm.L',leftLowerArm:'DEF-forearm.L',leftHand:'DEF-hand.L',rightShoulder:'DEF-shoulder.R',rightUpperArm:'DEF-upper_arm.R',rightLowerArm:'DEF-forearm.R',rightHand:'DEF-hand.R',leftUpperLeg:'DEF-thigh.L',leftLowerLeg:'DEF-shin.L',leftFoot:'DEF-foot.L',leftToes:'DEF-toe.L',rightUpperLeg:'DEF-thigh.R',rightLowerLeg:'DEF-shin.R',rightFoot:'DEF-foot.R',rightToes:'DEF-toe.R'};
for(const [side,S] of [['left','L'],['right','R']])for(const [f,ff] of [['Thumb','thumb'],['Index','f_index'],['Middle','f_middle'],['Ring','f_ring'],['Little','f_pinky']])for(const [k,seg] of [['Proximal','01'],['Intermediate','02'],['Distal','03']])legacy[side+f+k]=`DEF-${ff}.${seg}.${S}`;

function fitHeight(root,target=2){root.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(root),s=b.getSize(new THREE.Vector3());const k=target/Math.max(s.y,.001);root.scale.multiplyScalar(k);root.updateMatrixWorld(true);const b2=new THREE.Box3().setFromObject(root),c=b2.getCenter(new THREE.Vector3());root.position.x-=c.x;root.position.z-=c.z;root.position.y-=b2.min.y;root.updateMatrixWorld(true)}
function depth(o){let d=0;for(let x=o;x.parent;x=x.parent)d++;return d}
function snap(nodes){return nodes.map(o=>({o,p:o.position.clone(),q:o.quaternion.clone(),s:o.scale.clone()}))}
function restore(rows){for(const x of rows){x.o.position.copy(x.p);x.o.quaternion.copy(x.q);x.o.scale.copy(x.s)}}

async function create(){
  const donorLoader=new GLTFLoader();donorLoader.register(p=>new VRMLoaderPlugin(p));
  const sourceLoader=new GLTFLoader();
  const [donorG,srcG]=await Promise.all([load(donorLoader,DONOR),load(sourceLoader,UAL1)]);
  const vrm=donorG.userData.vrm;if(!vrm)throw new Error('Candidate018 VRM 載入失敗');
  VRMUtils.rotateVRM0(vrm);
  const root=vrm.scene,source=srcG.scene;root.name='ag-candidate018';root.userData={agTestCharacter:'ual3',candidate:'018',label:'⭐ Candidate 018 正式角色',visualPending:false};
  fitHeight(root,2);
  source.updateMatrixWorld(true);vrm.humanoid.update();root.updateMatrixWorld(true);
  const byName={};source.traverse(o=>{if(o.name){byName[o.name]=o;byName[THREE.PropertyBinding.sanitizeNodeName(o.name)]=o}});const sget=n=>byName[n]||byName[THREE.PropertyBinding.sanitizeNodeName(n)];
  const pairs=[];for(const [sem,sn] of Object.entries(legacy)){const s=sget(sn),d=vrm.humanoid.getNormalizedBoneNode(sem);if(s&&d){const sb=new THREE.Quaternion(),db=new THREE.Quaternion();s.getWorldQuaternion(sb);d.getWorldQuaternion(db);pairs.push({sem,s,d,sb,db})}}
  if(pairs.length<48)throw new Error(`Candidate018 骨架映射不足 ${pairs.length}`);pairs.sort((a,b)=>depth(a.d)-depth(b.d));
  const sourceHips=sget('DEF-hips'),targetHips=vrm.humanoid.getNormalizedBoneNode('hips');if(!sourceHips||!targetHips)throw new Error('Candidate018 hips 缺失');
  const sourceHipsBind=sourceHips.position.clone(),targetHipsBind=targetHips.position.clone();
  const donorHeight=new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3()).y,sourceHeight=new THREE.Box3().setFromObject(source).getSize(new THREE.Vector3()).y,transScale=donorHeight/Math.max(sourceHeight,.001);
  const targetNodes=[];vrm.humanoid.normalizedHumanBonesRoot.traverse(o=>targetNodes.push(o));const targetRest=snap(targetNodes);
  const clips=srcG.animations||[],find=name=>clips.find(c=>c.name===name),mixer=new THREE.AnimationMixer(source);
  const requested={idle:'Idle_Loop',walk:'Walk_Loop',run:'Jog_Fwd_Loop',jump:'Jump_Loop',sit:'Sitting_Idle_Loop',swim:'Swim_Fwd_Loop',interact:'Interact',dodge:'Roll'};
  const actions={};for(const [k,n] of Object.entries(requested)){const c=find(n);if(c)actions[k]=mixer.clipAction(c,source)}
  // Safe gameplay fallbacks keep furniture/life commands functional while using the validated motion library.
  actions.fish=actions.interact||actions.idle;actions.sleep=actions.sit||actions.idle;
  let current=null,currentName='idle';
  function play(name='idle'){
    const routed=actions[name]?name:'idle',next=actions[routed];if(!next)return;if(next===current){currentName=routed;return}
    const once=['jump','interact','dodge'].includes(routed);current?.fadeOut(.14);next.reset();next.enabled=true;next.setEffectiveWeight(1);next.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat,once?1:Infinity);next.clampWhenFinished=once;next.fadeIn(.14).play();current=next;currentName=routed;
  }
  function retarget(dt=0){
    source.updateMatrixWorld(true);vrm.humanoid.update();root.updateMatrixWorld(true);
    for(const p of pairs){const cur=new THREE.Quaternion();p.s.getWorldQuaternion(cur);const delta=cur.multiply(p.sb.clone().invert());const desired=delta.multiply(p.db.clone());const parentQ=new THREE.Quaternion();if(p.d.parent)p.d.parent.getWorldQuaternion(parentQ);else parentQ.identity();p.d.quaternion.copy(parentQ.invert().multiply(desired));p.d.updateMatrixWorld(true)}
    // Player movement owns X/Z. Keep only vertical pose motion to prevent double translation/sliding.
    const dy=(sourceHips.position.y-sourceHipsBind.y)*transScale;targetHips.position.copy(targetHipsBind);targetHips.position.y+=dy;
    vrm.humanoid.update();root.updateMatrixWorld(true);vrm.update?.(dt);
  }
  function update(dt){mixer.update(dt);retarget(dt)}
  restore(targetRest);vrm.humanoid.update();play('idle');retarget(0);
  return{root,mixer,actions,clips,play,update,available:Object.keys(actions),animationLibraryStatus:`UAL1:Candidate018 W0 / mapped ${pairs.length}`,styleStatus:'Candidate 018 FINAL PASS・VRM normalized W0',forwardYaw:0,get action(){return currentName},get mappedBones(){return pairs.length}};
}

globalThis.__AGCB_UAL_CHARACTER3_RUNTIME={version:18,release:'V0.5.89',candidate:'018',retarget:'VRM normalized humanoid + W0 world-space delta',create,model:DONOR,animations:UAL1,status:'FINAL_PASS_GAME_RUNTIME'};
export{create};
