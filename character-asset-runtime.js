import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/utils/SkeletonUtils.js';

// Technical rigged-avatar pass: continuous-skinned-mesh proof using a fixed CC0 source commit.
const RIGGED_AVATAR_SCHEMA=1;
const SOURCE_COMMIT='672074b73ba276876a19e8816ecdc5241817ab47';
const SOURCES={
  girl:'https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/'+SOURCE_COMMIT+'/addons/kaykit_character_pack_adventures/Characters/gltf/Rogue.glb',
  boy:'https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/'+SOURCE_COMMIT+'/addons/kaykit_character_pack_adventures/Characters/gltf/Barbarian.glb'
};
const loader=new GLTFLoader(),loaded=new Map(),pending=new Map();
function loadVariant(key){
  if(loaded.has(key))return Promise.resolve(loaded.get(key));
  if(pending.has(key))return pending.get(key);
  const p=new Promise((resolve,reject)=>loader.load(SOURCES[key]||SOURCES.girl,resolve,undefined,reject)).then(gltf=>{loaded.set(key,gltf);return gltf});
  pending.set(key,p);return p;
}
function findClip(clips,pattern){return clips.find(c=>pattern.test(c.name))||null}
function bodyScale(c){return c.body==='tall'?1.04:c.body==='petite'?.91:1}
function applyAsset(group,c,gltf){
  if(!group?.parent)return;
  const u=group.userData;if(u.assetRoot)u.visual.remove(u.assetRoot);
  const root=SkeletonUtils.clone(gltf.scene);root.name='agcb-rigged-avatar';root.rotation.y=Math.PI;root.userData.forwardCorrection='pi';
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(Array.isArray(o.material))o.material=o.material.map(m=>m.clone());else if(o.material)o.material=o.material.clone()}});
  const rawBox=new THREE.Box3().setFromObject(root),rawSize=rawBox.getSize(new THREE.Vector3());
  const scale=2.18/Math.max(rawSize.y,.001)*bodyScale(c);root.scale.setScalar(scale);root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root);root.position.y-=box.min.y;root.updateMatrixWorld(true);
  const mixer=new THREE.AnimationMixer(root),clips=gltf.animations||[],actions={
    idle:findClip(clips,/idle|stand|breath|rest/i),
    walk:findClip(clips,/walk|move/i),
    run:findClip(clips,/run|sprint/i),
    jump:findClip(clips,/jump|fall/i),
    sit:findClip(clips,/sit|sitt/i),
    lie:findClip(clips,/lie|sleep/i),
    interact:findClip(clips,/interact|use|pick/i),
    dine:findClip(clips,/eat|dine/i),
    swing:findClip(clips,/swing/i)
  };
  const actionMap={};for(const [name,clip] of Object.entries(actions))if(clip)actionMap[name]=mixer.clipAction(clip);
  const primitiveChildren=[...u.visual.children];primitiveChildren.forEach(child=>{child.visible=false});u.visual.add(root);u.visual.visible=true;u.assetRoot=root;u.assetMixer=mixer;u.assetActions=actionMap;u.assetVariant=c.gender==='boy'?'boy':'girl';u.assetAction=null;u.assetLastTime=0;u.assetLoaded=true;u.assetSource='KayKit CC0';globalThis.__AGCB_RIGGED_AVATAR.loaded++;
  globalThis.__AGCB_ASSET_SET_MOTION(group,'idle');globalThis.__AGCB_ASSET_SET_POSE?.(group,u.pose||'idle');
}
function upgrade(group,c){
  const key=c.gender==='boy'?'boy':'girl';if(group.userData.assetVariant===key&&group.userData.assetRoot)return;
  group.userData.assetVariant=key;loadVariant(key).then(gltf=>applyAsset(group,c,gltf)).catch(error=>{group.userData.assetError=String(error);globalThis.__AGCB_RIGGED_AVATAR.failed=(globalThis.__AGCB_RIGGED_AVATAR.failed||0)+1});
}
globalThis.__AGCB_ASSET_SET_MOTION=(group,state='idle')=>{
  const u=group?.userData;if(!u?.assetActions)return;const next=u.assetActions[state]||u.assetActions.idle;if(!next||u.assetAction===next)return;
  if(u.assetAction)u.assetAction.fadeOut(.18);next.reset().fadeIn(.18).play();u.assetAction=next;
};
globalThis.__AGCB_ASSET_SET_POSE=(group,pose='idle')=>{
  const u=group?.userData;if(!u?.assetActions)return;const map={sit:'sit',lie:'lie',sleep:'lie',swing:'swing',dine:'dine',interact:'interact'};globalThis.__AGCB_ASSET_SET_MOTION(group,map[pose]||'idle');
};
globalThis.__AGCB_RIGGED_AVATAR={schema:RIGGED_AVATAR_SCHEMA,source:'KayKit Character Pack Adventures',sourceCommit:SOURCE_COMMIT,license:'CC0 1.0',loaded:0,failed:0};
globalThis.__AGCB_UPGRADE_AVATAR=(group,c)=>{upgrade(group,c);};
for(const group of globalThis.__AGCB_LIVE_AVATARS||[])upgrade(group,group.userData.avatarCustomization||{gender:group.userData.avatarStyle||'girl'});
