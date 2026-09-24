// AG Cute Blocks V0.5.205 — native AGCB GLB adapter (TEST ONLY / PROD HOLD)
import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/utils/SkeletonUtils.js';

const REQUIRED_ACTIONS=['Idle','Walk','Run','Jump'];
const REQUIRED_BONES=['agcb-root','agcb-hips','agcb-spine','agcb-chest','agcb-neck','agcb-head','agcb-upper-arm-l','agcb-forearm-l','agcb-hand-l','agcb-upper-arm-r','agcb-forearm-r','agcb-hand-r','agcb-thigh-l','agcb-shin-l','agcb-foot-l','agcb-thigh-r','agcb-shin-r','agcb-foot-r'];

function fitHeight(root,target=1.55){
  root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());
  if(!Number.isFinite(size.y)||size.y<=0) throw new Error('AGCB character invalid bounds');
  root.scale.multiplyScalar(target/size.y); root.updateMatrixWorld(true);
  const b2=new THREE.Box3().setFromObject(root),c=b2.getCenter(new THREE.Vector3());
  root.position.x-=c.x; root.position.z-=c.z; root.position.y-=b2.min.y; root.updateMatrixWorld(true);
}

function inspect(root,animations){
  const names=new Set(); let skeleton=null;
  root.traverse(o=>{if(o.name)names.add(o.name); if(!skeleton&&o.isSkinnedMesh&&o.skeleton)skeleton=o.skeleton;});
  const missingBones=REQUIRED_BONES.filter(n=>!names.has(n));
  const clipNames=new Set((animations||[]).map(a=>a.name));
  const missingActions=REQUIRED_ACTIONS.filter(n=>!clipNames.has(n));
  if(missingBones.length) throw new Error(`AGCB missing bones: ${missingBones.join(',')}`);
  if(missingActions.length) throw new Error(`AGCB missing actions: ${missingActions.join(',')}`);
  if(!skeleton||skeleton.bones.length!==18) throw new Error(`AGCB expected 18-bone skeleton, got ${skeleton?.bones?.length||0}`);
  return {skeleton,clipNames};
}

async function createFromUrl(url,{targetHeight=1.55,label='AGCB Cute Character'}={}){
  const loader=new GLTFLoader();
  const gltf=await loader.loadAsync(url); const root=cloneSkeleton(gltf.scene); root.name='agcb-cute-character-v05205';
  const {skeleton}=inspect(root,gltf.animations); fitHeight(root,targetHeight);
  const mixer=new THREE.AnimationMixer(root),actions={};
  for(const clip of gltf.animations||[]) actions[clip.name.toLowerCase()]=mixer.clipAction(clip,root);
  let currentName='idle',current=null;
  function play(name='idle'){
    const key=String(name).toLowerCase(),next=actions[key]||actions.idle;
    if(!next) throw new Error(`AGCB action unavailable: ${name}`);
    if(next!==current){current?.fadeOut(.12);next.reset().enabled=true;next.setEffectiveWeight(1);next.setLoop(key==='jump'?THREE.LoopOnce:THREE.LoopRepeat,key==='jump'?1:Infinity);next.clampWhenFinished=key==='jump';next.fadeIn(.12).play();current=next;}
    currentName=key; return currentName;
  }
  function update(dt){mixer.update(Math.max(0,Number(dt)||0));}
  function dispose(){mixer.stopAllAction();root.traverse(o=>{o.geometry?.dispose?.();const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms)if(m){for(const v of Object.values(m))if(v?.isTexture)v.dispose?.();m.dispose?.();}});}
  play('idle');
  return {root,mixer,actions,play,update,dispose,available:Object.keys(actions),mappedBones:skeleton.bones.length,skeletonIdentityOK:true,styleStatus:`V0.5.205 ${label} TEST`,get action(){return currentName;}};
}

globalThis.__AGCB_CUTE_CHARACTER_RUNTIME={version:205,release:'V0.5.205',status:'TEST_NATIVE_18_BONE_ADAPTER',requiredBones:REQUIRED_BONES,requiredActions:REQUIRED_ACTIONS,createFromUrl};
export {createFromUrl,REQUIRED_BONES,REQUIRED_ACTIONS};
