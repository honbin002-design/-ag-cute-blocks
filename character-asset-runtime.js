import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/utils/SkeletonUtils.js';

// Complete-avatar pipeline: use the supplied Manus5 rigged character as the visible base.
// continuous-skinned-mesh: complete GLB owns the visible body.
// The old procedural character remains available as a data/compatibility layer,
// but it must never be rendered beside the complete GLB.
const RIGGED_AVATAR_SCHEMA=2;
const MANUS5_SOURCE='./assets/characters/manus5/chibi_8_variants_rigged.glb';
// GitHub's connected file writer cannot store this large GLB as one payload.
// The runtime reassembles these exact binary parts before GLTFLoader.parse().
const MANUS5_CHUNK_BASE='./assets/characters/manus5/chibi_8_variants_rigged.glb.part';
const MANUS5_CHUNK_BYTES=4000000,MANUS5_TOTAL_BYTES=62191812,MANUS5_CHUNK_COUNT=16;
const SOURCES={
  girl:MANUS5_SOURCE,
  boy:MANUS5_SOURCE
};
const loader=new GLTFLoader(),loaded=new Map(),pending=new Map();
const MANUS5_DEFAULT_VARIANT='CHARACTER_01_01_Ruby_Ranger';
function selectManus5Variant(root,requested=MANUS5_DEFAULT_VARIANT){
  const variants=[];
  root.traverse(o=>{if(/^CHARACTER_\d+_/.test(o.name))variants.push(o)});
  const selected=variants.find(o=>o.name===requested)||variants[0]||null;
  variants.forEach(o=>{o.visible=o===selected;if(o===selected){o.position.set(0,0,0);o.traverse(child=>{if(child.isMesh)child.visible=true})}});
  const source=root.getObjectByName('Mesh_0');if(source)source.visible=false;
  return selected;
}
async function loadManus5Gltf(){
  const bytes=new Uint8Array(MANUS5_TOTAL_BYTES);let offset=0;
  for(let i=0;i<MANUS5_CHUNK_COUNT;i++){
    const url=MANUS5_CHUNK_BASE+String(i).padStart(3,'0'),response=await fetch(url,{cache:'force-cache'});
    if(!response.ok)throw new Error(`Manus5 model part ${i+1}/${MANUS5_CHUNK_COUNT} failed: ${response.status}`);
    const part=new Uint8Array(await response.arrayBuffer());
    if(part.byteLength>MANUS5_CHUNK_BYTES||offset+part.byteLength>bytes.byteLength)throw new Error('Manus5 model part size mismatch');
    bytes.set(part,offset);offset+=part.byteLength;
  }
  if(offset!==MANUS5_TOTAL_BYTES)throw new Error(`Manus5 model size mismatch: ${offset}/${MANUS5_TOTAL_BYTES}`);
  return await new Promise((resolve,reject)=>loader.parse(bytes.buffer,'',resolve,reject));
}
function loadVariant(key){
  if(loaded.has(key))return Promise.resolve(loaded.get(key));
  if(pending.has(key))return pending.get(key);
  const p=loadManus5Gltf().then(gltf=>{loaded.set(key,gltf);return gltf});
  pending.set(key,p);return p;
}
function findClip(clips,pattern){return clips.find(c=>pattern.test(c.name))||null}
function bodyScale(c){const age=c.age==='child'?.84:1;const body=c.body==='tall'?1.04:c.body==='petite'?.93:1;return age*body}
function tuneRigForCustomization(root,c){
  const child=c.age==='child',find=name=>root.getObjectByName(name);
  const head=find('head'),chest=find('chest'),hips=find('hips');
  if(head){const s=child?1.14:1;head.scale.setScalar(s)}
  if(chest)chest.scale.x*=child?.90:c.body==='tall'?1.04:c.body==='petite'?.96:1;
  if(hips)hips.scale.x*=child?.93:c.body==='tall'?.98:c.body==='petite'?.96:1;
  root.traverse(o=>{if(!o.name)return;if(child&&/Cape|Hat/i.test(o.name))o.visible=false});
}
function setManus5AlphaMaterials(root){
  root.traverse(o=>{if(!o.isMesh)return;const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list){if(!m)continue;m.transparent=true;m.alphaTest=.08;m.depthTest=true;m.depthWrite=true;if(m.map)m.map.needsUpdate=true;}});
}
function setAssetMaterialPolish(root,c){
  root.traverse(o=>{if(!o.isMesh)return;const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list){if(!m)continue;if('roughness'in m)m.roughness=Math.max(.68,Math.min(.86,m.roughness??.76));if('metalness'in m)m.metalness=Math.min(.08,m.metalness??0);m.flatShading=false;m.needsUpdate=true}});
}
function repairManus5LimbWeights(root,selectedVariant){
  if(!selectedVariant)return;
  const isArmName=name=>/^(upperarm|lowerarm|hand|thumb_|index_|middle_|ring_|pinky_)/.test(name||'');
  const isLegName=name=>/^(thigh|shin|foot)_/.test(name||'');
  const sideOf=name=>/_L$/.test(name)?'L':/_R$/.test(name)?'R':'';
  selectedVariant.traverse(mesh=>{
    if(!mesh.isSkinnedMesh||!mesh.skeleton)return;
    const pos=mesh.geometry.getAttribute('position'),ji=mesh.geometry.getAttribute('skinIndex'),sw=mesh.geometry.getAttribute('skinWeight'),bones=mesh.skeleton.bones;
    if(!pos?.array||!ji?.array||!sw?.array)return;
    const rootIndex=Math.max(0,bones.findIndex(bone=>bone.name==='root')),pa=pos.array,ja=ji.array,wa=sw.array;
    for(let i=0;i<pos.count;i++){
      const x=pa[i*3],y=pa[i*3+1];
      // Keep arm weights only on the lateral upper-limb zone. This prevents
      // arm rotations from pulling the head, hair, chest or opposite side.
      const armSide=y>-.24&&y<.50&&Math.abs(x)>.22?(x>0?'L':'R'):'';
      // Keep thigh/shin/foot weights below the pelvis and on their own side.
      const legSide=y<-.36&&Math.abs(x)>.025?(x>0?'L':'R'):'';
      let sum=0;
      for(let k=0;k<4;k++){
        const at=i*4+k,name=bones[ja[at]]?.name||'',arm=isArmName(name),leg=isLegName(name);
        if(arm&&(!armSide||sideOf(name)!==armSide))wa[at]=0;
        if(leg&&(!legSide||sideOf(name)!==legSide))wa[at]=0;
        sum+=wa[at];
      }
      if(sum<.001){ja[i*4]=rootIndex;wa[i*4]=1;ja[i*4+1]=ja[i*4+2]=ja[i*4+3]=0;wa[i*4+1]=wa[i*4+2]=wa[i*4+3]=0;sum=1}
      else for(let k=0;k<4;k++)wa[i*4+k]/=sum;
    }
    ji.needsUpdate=true;sw.needsUpdate=true;
  });
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
function augmentWalkClip(clip,bones,baseQuaternions){
  if(!clip)return clip;
  const names=new Set(Object.values(bones).filter(Boolean).map(b=>b.name));
  const duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:1;
  const times=Array.from({length:9},(_,i)=>duration*i/8),tracks=clip.tracks.filter(track=>!names.has(String(track.name).split('.')[0]));
  const profiles={upperL:[.34,.42],lowerL:[.18,.25],handL:[.10,.18],upperR:[.34,.42],lowerR:[.18,.25],handR:[.10,.18]};
  for(const [key,bone] of Object.entries(bones)){
    if(!bone)continue;
    const base=baseQuaternions[key]?.clone?.()||bone.quaternion.clone(),values=[];
    for(const time of times){
      const swing=Math.sin(time/duration*Math.PI*2),[yAmp,zAmp]=profiles[key]||[0,0];
      const delta=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,swing*yAmp,swing*zAmp));
      values.push(...base.clone().multiply(delta).toArray());
    }
    tracks.push(new THREE.QuaternionKeyframeTrack(bone.name+'.quaternion',times,values));
  }
  return new THREE.AnimationClip((clip.name||'Walk_Cycle')+'-agcb-hands',duration,tracks);
}

function applyAsset(group,c,gltf){
  if(!group?.parent)return;
  const u=group.userData;if(u.assetRoot)u.visual.remove(u.assetRoot);if(u.assetDetailLayer)u.visual.remove(u.assetDetailLayer);
  const root=SkeletonUtils.clone(gltf.scene);root.name='agcb-manus5-rigged-avatar';root.rotation.y=Math.PI;root.userData.forwardCorrection='pi';
  const selectedVariant=selectManus5Variant(root,c.manus5Variant||MANUS5_DEFAULT_VARIANT);repairManus5LimbWeights(root,selectedVariant);
  const assetWalkBones={upperL:root.getObjectByName('upperarm_L'),lowerL:root.getObjectByName('lowerarm_L'),handL:root.getObjectByName('hand_L'),upperR:root.getObjectByName('upperarm_R'),lowerR:root.getObjectByName('lowerarm_R'),handR:root.getObjectByName('hand_R')};
  const assetArmBaseline={},assetArmBaseQuaternions={};for(const [key,bone] of Object.entries(assetWalkBones))if(bone){assetArmBaseline[key]={x:bone.rotation.x,y:bone.rotation.y,z:bone.rotation.z};assetArmBaseQuaternions[key]=bone.quaternion.clone();}
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(Array.isArray(o.material))o.material=o.material.map(m=>m.clone());else if(o.material)o.material=o.material.clone()}});
  setManus5AlphaMaterials(root);
  const rawBox=new THREE.Box3().setFromObject(selectedVariant||root),rawSize=rawBox.getSize(new THREE.Vector3());
  const scale=2.18/Math.max(rawSize.y,.001)*bodyScale(c);root.scale.setScalar(scale);root.updateMatrixWorld(true);
  tuneRigForCustomization(root,c);root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(selectedVariant||root);root.position.y-=box.min.y;root.updateMatrixWorld(true);setAssetMaterialPolish(root,c);
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
  if(actions.walk)actions.walk=augmentWalkClip(actions.walk,assetWalkBones,assetArmBaseQuaternions);
  const actionMap={};for(const [name,clip] of Object.entries(actions))if(clip)actionMap[name]=mixer.clipAction(clip);
  const primitiveChildren=[...u.visual.children];primitiveChildren.forEach(child=>{child.visible=false});u.visual.add(root);u.visual.visible=true;u.assetRoot=root;u.assetDetailLayer=null;u.assetMixer=mixer;u.assetActions=actionMap;u.assetWalkBones=assetWalkBones;u.assetArmBaseline=assetArmBaseline;u.assetArmBaseQuaternions=assetArmBaseQuaternions;u.assetArmClip=true;u.assetArmOffsets={};u.assetWalkPhase=0;u.assetWalkBlend=0;u.assetVariant=c.gender==='boy'?'boy':'girl';u.assetManus5Variant=selectedVariant?.name||MANUS5_DEFAULT_VARIANT;u.assetAction=null;u.assetLastTime=0;u.assetLoaded=true;u.assetSource='Manus5 chibi_8_variants_rigged.glb';u.assetAge=c.age||'child';u.assetShapeRevision='manus5-variant01-runtime-test';u.assetCustomization={...c};globalThis.__AGCB_RIGGED_AVATAR.loaded++;
  globalThis.__AGCB_ASSET_SET_MOTION(group,'idle');globalThis.__AGCB_ASSET_SET_POSE?.(group,u.pose||'idle');
}
function upgrade(group,c){
  const u=group?.userData;
  const key=c.gender==='boy'?'boy':'girl';if(u.assetVariant===key&&u.assetRoot)return;
  u.assetVariant=key;loadVariant(key).then(gltf=>applyAsset(group,c,gltf)).catch(error=>{u.assetError=String(error);globalThis.__AGCB_RIGGED_AVATAR.failed=(globalThis.__AGCB_RIGGED_AVATAR.failed||0)+1});
}
globalThis.__AGCB_ASSET_SET_MOTION=(group,state='idle')=>{
  const u=group?.userData;if(!u?.assetActions)return;const next=u.assetActions[state]||u.assetActions.idle;if(!next||u.assetAction===next)return;
  if(u.assetAction)u.assetAction.fadeOut(.18);next.reset().fadeIn(.18).play();next.setEffectiveTimeScale(state==='walk'?1.35:1);u.assetAction=next;
};
globalThis.__AGCB_ASSET_TICK=(group,moving=false,dt=0)=>{
  const u=group?.userData,b=u?.assetWalkBones;if(!u||!b)return;
  // V0.4.56: every Euler component must be finite, even at zero blend.
  // undefined * 0 is NaN and corrupts the bone matrix (and skinned vertices).
  const finite=value=>Number.isFinite(value)?value:0;
  const step=Math.min(.12,Math.max(0,finite(dt)));
  u.assetWalkPhase=(finite(u.assetWalkPhase)+step*(moving?10.5:6.5))%(Math.PI*2);
  const target=moving?1:0,previousBlend=Math.min(1,Math.max(0,finite(u.assetWalkBlend)));
  const blend=previousBlend+(target-previousBlend)*Math.min(1,step*10);u.assetWalkBlend=blend;
  const s=Math.sin(u.assetWalkPhase),offsets={
    // Z is the visible front-view swing axis for this rig; Y remains a subtle depth cue.
    upperL:{x:0,y:s*.34,z:s*.42},lowerL:{x:0,y:s*.18,z:s*.25},handL:{x:0,y:s*.10,z:s*.18},
    upperR:{x:0,y:s*.34,z:s*.42},lowerR:{x:0,y:s*.18,z:s*.25},handR:{x:0,y:s*.10,z:s*.18}
  };
  // The loaded GLB uses a real Walk_Cycle clip with arm quaternion tracks.
  // Keep this hook for compatibility and finite-state telemetry; only legacy
  // callers without the clip receive the old Euler fallback.
  if(!u.assetArmClip)for(const [key,bone] of Object.entries(b)){
    if(!bone)continue;
    const base=u.assetArmBaseline?.[key]||{},pose=offsets[key]||{};
    bone.rotation.set(finite(base.x)+finite(pose.x)*blend,finite(base.y)+finite(pose.y)*blend,finite(base.z)+finite(pose.z)*blend);
  }
  u.assetArmOffsets=offsets;
};
globalThis.__AGCB_ASSET_SET_POSE=(group,pose='idle')=>{
  const u=group?.userData;if(!u?.assetActions)return;const map={sit:'sit',lie:'lie',sleep:'lie',swing:'swing',dine:'dine',interact:'interact'};globalThis.__AGCB_ASSET_SET_MOTION(group,map[pose]||'idle');
};
globalThis.__AGCB_RIGGED_AVATAR={schema:RIGGED_AVATAR_SCHEMA,source:'Manus5 chibi_8_variants_rigged.glb',sourceFile:MANUS5_SOURCE,chunkBase:MANUS5_CHUNK_BASE,chunkCount:MANUS5_CHUNK_COUNT,totalBytes:MANUS5_TOTAL_BYTES,variant:MANUS5_DEFAULT_VARIANT,license:'user-supplied',loaded:0,failed:0,originalPreserved:true,visibleBase:'complete-rigged-glb',legacyProceduralHidden:true};
globalThis.__AGCB_UPGRADE_AVATAR=(group,c)=>{upgrade(group,c);};
for(const group of globalThis.__AGCB_LIVE_AVATARS||[])upgrade(group,group.userData.avatarCustomization||{gender:group.userData.avatarStyle||'girl'});
