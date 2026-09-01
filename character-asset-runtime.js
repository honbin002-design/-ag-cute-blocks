import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/utils/SkeletonUtils.js';

// Complete-avatar pipeline: use a CC0 rigged character as the visible base.
// The old procedural character remains available as a data/compatibility layer,
// but it must never be rendered beside the complete GLB.
const RIGGED_AVATAR_SCHEMA=2;
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
function bodyScale(c){const age=c.age==='child'?.84:1;const body=c.body==='tall'?1.04:c.body==='petite'?.93:1;return age*body}
function setAssetMaterialPolish(root,c){
  root.traverse(o=>{if(!o.isMesh)return;const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list){if(!m)continue;if('roughness'in m)m.roughness=Math.max(.68,Math.min(.86,m.roughness??.76));if('metalness'in m)m.metalness=Math.min(.08,m.metalness??0);m.flatShading=false;m.needsUpdate=true}});
}
function addAssetDetailLayer(parent,c,box){
  const size=box.getSize(new THREE.Vector3()),min=box.min,layer=new THREE.Group();layer.name='agcb-face-clothing-detail-layer';layer.renderOrder=8;
  const faceY=min.y+size.y*.78,faceZ=min.z-.018,cheekMat=new THREE.MeshBasicMaterial({color:0xf09b9d,transparent:true,opacity:.48,depthWrite:false}),skinMat=new THREE.MeshBasicMaterial({color:0xe8a184}),smileMat=new THREE.MeshBasicMaterial({color:0x743f48}),frameMat=new THREE.MeshBasicMaterial({color:0x40343d});
  for(const x of[-size.x*.18,size.x*.18]){const cheek=new THREE.Mesh(new THREE.CircleGeometry(Math.max(.025,size.y*.023),20),cheekMat);cheek.rotation.y=Math.PI;cheek.scale.set(1.45,.62,1);cheek.position.set(x,faceY-size.y*.055,faceZ);layer.add(cheek)}
  const nose=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.018,size.y*.017),12,8),skinMat);nose.position.set(0,faceY-size.y*.005,faceZ-.016);layer.add(nose);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(Math.max(.035,size.y*.034),Math.max(.004,size.y*.0048),7,18,Math.PI),smileMat);smile.rotation.y=Math.PI;smile.position.set(0,faceY-size.y*.10,faceZ-.022);layer.add(smile);
  if(c.glasses==='round'){for(const x of[-size.x*.17,size.x*.17]){const ring=new THREE.Mesh(new THREE.TorusGeometry(Math.max(.045,size.y*.047),Math.max(.005,size.y*.006),8,20),frameMat);ring.rotation.y=Math.PI;ring.scale.x=1.12;ring.position.set(x,faceY,faceZ-.025);layer.add(ring)}const bridge=new THREE.Mesh(new THREE.BoxGeometry(size.x*.10,size.y*.009,.012),frameMat);bridge.position.set(0,faceY,faceZ-.026);layer.add(bridge)}
  const torsoZ=min.z+size.z*.17,pocketMat=new THREE.MeshBasicMaterial({color:c.outfit==='hoodie'?0x78afd1:c.outfit==='dress'?0xd87996:0xc58b58});const pocket=new THREE.Mesh(new THREE.BoxGeometry(size.x*.28,size.y*.105,.026),pocketMat);pocket.position.set(0,min.y+size.y*.46,torsoZ);layer.add(pocket);
  if(c.accessory==='scarf'){const scarf=new THREE.Mesh(new THREE.TorusGeometry(size.x*.18,size.y*.022,8,22),new THREE.MeshBasicMaterial({color:0xe48791}));scarf.rotation.x=Math.PI/2;scarf.position.set(0,min.y+size.y*.62,0);layer.add(scarf)}else if(c.accessory==='bow'){const bowMat=new THREE.MeshBasicMaterial({color:0xe48791});for(const x of[-size.x*.10,size.x*.10]){const b=new THREE.Mesh(new THREE.SphereGeometry(size.y*.065,12,8),bowMat);b.scale.set(1.25,.72,.30);b.position.set(x,min.y+size.y*.55,torsoZ-.02);layer.add(b)}}else if(c.accessory==='backpack'){const pack=new THREE.Mesh(new THREE.BoxGeometry(size.x*.30,size.y*.24,size.z*.10),new THREE.MeshBasicMaterial({color:0xf09a68}));pack.position.set(0,min.y+size.y*.38,box.max.z+size.z*.04);layer.add(pack)}
  parent.add(layer);return layer;
}
function applyAsset(group,c,gltf){
  if(!group?.parent)return;
  const u=group.userData;if(u.assetRoot)u.visual.remove(u.assetRoot);if(u.assetDetailLayer)u.visual.remove(u.assetDetailLayer);
  const root=SkeletonUtils.clone(gltf.scene);root.name='agcb-rigged-avatar';root.rotation.y=Math.PI;root.userData.forwardCorrection='pi';
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(Array.isArray(o.material))o.material=o.material.map(m=>m.clone());else if(o.material)o.material=o.material.clone()}});
  const rawBox=new THREE.Box3().setFromObject(root),rawSize=rawBox.getSize(new THREE.Vector3());
  const scale=2.18/Math.max(rawSize.y,.001)*bodyScale(c);root.scale.setScalar(scale);root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root);root.position.y-=box.min.y;root.updateMatrixWorld(true);setAssetMaterialPolish(root,c);
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
  const primitiveChildren=[...u.visual.children];primitiveChildren.forEach(child=>{child.visible=false});u.visual.add(root);u.visual.visible=true;u.assetRoot=root;u.assetDetailLayer=null;u.assetMixer=mixer;u.assetActions=actionMap;u.assetVariant=c.gender==='boy'?'boy':'girl';u.assetAction=null;u.assetLastTime=0;u.assetLoaded=true;u.assetSource='KayKit CC0';u.assetAge=c.age||'child';u.assetCustomization={...c};globalThis.__AGCB_RIGGED_AVATAR.loaded++;
  globalThis.__AGCB_ASSET_SET_MOTION(group,'idle');globalThis.__AGCB_ASSET_SET_POSE?.(group,u.pose||'idle');
}
function upgrade(group,c){
  const u=group?.userData;
  const key=c.gender==='boy'?'boy':'girl';if(u.assetVariant===key&&u.assetRoot)return;
  u.assetVariant=key;loadVariant(key).then(gltf=>applyAsset(group,c,gltf)).catch(error=>{u.assetError=String(error);globalThis.__AGCB_RIGGED_AVATAR.failed=(globalThis.__AGCB_RIGGED_AVATAR.failed||0)+1});
}
globalThis.__AGCB_ASSET_SET_MOTION=(group,state='idle')=>{
  const u=group?.userData;if(!u?.assetActions)return;const next=u.assetActions[state]||u.assetActions.idle;if(!next||u.assetAction===next)return;
  if(u.assetAction)u.assetAction.fadeOut(.18);next.reset().fadeIn(.18).play();u.assetAction=next;
};
globalThis.__AGCB_ASSET_SET_POSE=(group,pose='idle')=>{
  const u=group?.userData;if(!u?.assetActions)return;const map={sit:'sit',lie:'lie',sleep:'lie',swing:'swing',dine:'dine',interact:'interact'};globalThis.__AGCB_ASSET_SET_MOTION(group,map[pose]||'idle');
};
globalThis.__AGCB_RIGGED_AVATAR={schema:RIGGED_AVATAR_SCHEMA,source:'KayKit Character Pack Adventures',sourceCommit:SOURCE_COMMIT,license:'CC0 1.0',loaded:0,failed:0,originalPreserved:true,visibleBase:'complete-rigged-glb',legacyProceduralHidden:true};
globalThis.__AGCB_UPGRADE_AVATAR=(group,c)=>{upgrade(group,c);};
for(const group of globalThis.__AGCB_LIVE_AVATARS||[])upgrade(group,group.userData.avatarCustomization||{gender:group.userData.avatarStyle||'girl'});
