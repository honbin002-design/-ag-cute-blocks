import * as THREE from 'three';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/utils/SkeletonUtils.js';

const loader=new GLTFLoader();
const MODEL_TIMEOUT=20000;
const ANIMATION_TIMEOUT=9000;
const cache=new Map();
const TEST_CHARACTERS={
  test1:{label:'測試角色1',model:'https://raw.githubusercontent.com/eturner58/game-assets/main/kenney/3D%20assets/Blocky%20Characters/Models/GLB%20format/character-a.glb'},
  test2:{label:'測試角色2',model:'https://raw.githubusercontent.com/Seyamalam/blood-league-kickoff/main/public/assets/vendor/quaternius/night-striker.glb'},
  test3:{label:'測試角色3',model:'https://raw.githubusercontent.com/iamenahs/xlunar-ai-avatar/main/public/avatars/VRoid_Sample_A.glb',style:'CC0 VRoid日系女角・白髮貓耳目標V2',animeBase:true}
};
function load(url,timeout=MODEL_TIMEOUT){if(cache.has(url))return cache.get(url);const task=new Promise((resolve,reject)=>{let done=false;const timer=setTimeout(()=>{if(done)return;done=true;reject(new Error(`載入逾時：${url.split('/').pop()}`))},timeout);loader.load(url,g=>{if(done)return;done=true;clearTimeout(timer);resolve(g)},undefined,e=>{if(done)return;done=true;clearTimeout(timer);reject(e)})});cache.set(url,task);task.catch(()=>cache.delete(url));return task}
function normalize(root,targetHeight=2.0){root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());const scale=targetHeight/Math.max(size.y,.001);root.scale.multiplyScalar(scale);root.updateMatrixWorld(true);const scaledBox=new THREE.Box3().setFromObject(root),scaledCenter=scaledBox.getCenter(new THREE.Vector3());root.position.x-=scaledCenter.x;root.position.z-=scaledCenter.z;root.position.y-=scaledBox.min.y;root.updateMatrixWorld(true);return root}
function chooseClip(clips,keys){for(const k of keys){const c=clips.find(x=>(x.name||'').toLowerCase().includes(k));if(c)return c}return null}
function recolorMaterial(mat,color){if(!mat)return mat;const n=mat.clone();if(n.color)n.color.set(color);if('roughness'in n)n.roughness=Math.max(n.roughness??.5,.48);return n}
function tintAnimeHair(root){root.traverse(o=>{if(!o.isMesh&&!o.isSkinnedMesh)return;const names=`${o.name||''} ${Array.isArray(o.material)?o.material.map(m=>m?.name||'').join(' '):o.material?.name||''}`.toLowerCase();if(!/(hair|髮|kami)/.test(names))return;const arr=Array.isArray(o.material)?o.material:[o.material];const next=arr.map(m=>recolorMaterial(m,0xf1f3ff));o.material=Array.isArray(o.material)?next:next[0]})}
function addMockupStyle(root){const navy=new THREE.MeshStandardMaterial({color:0x152b5c,roughness:.62,metalness:.02});const inner=new THREE.MeshStandardMaterial({color:0xe7eaff,roughness:.68});const gold=new THREE.MeshStandardMaterial({color:0xf3ca55,roughness:.45,metalness:.1});const earGeo=new THREE.ConeGeometry(.13,.31,3);const left=new THREE.Mesh(earGeo,navy),right=new THREE.Mesh(earGeo,navy);left.position.set(-.17,1.86,-.005);right.position.set(.17,1.86,-.005);left.rotation.z=.09;right.rotation.z=-.09;left.name='ag-cat-ear-left';right.name='ag-cat-ear-right';root.add(left,right);const innerGeo=new THREE.ConeGeometry(.072,.18,3);const il=new THREE.Mesh(innerGeo,inner),ir=new THREE.Mesh(innerGeo,inner);il.position.set(-.17,1.86,-.075);ir.position.set(.17,1.86,-.075);il.rotation.z=.09;ir.rotation.z=-.09;root.add(il,ir);const bow=new THREE.Group();bow.name='ag-back-bow';const wingGeo=new THREE.SphereGeometry(.12,12,8);const l=new THREE.Mesh(wingGeo,navy),r=new THREE.Mesh(wingGeo,navy);l.scale.set(1.5,.68,.42);r.scale.set(1.5,.68,.42);l.position.x=-.13;r.position.x=.13;const knot=new THREE.Mesh(new THREE.SphereGeometry(.065,10,8),navy);const star=new THREE.Mesh(new THREE.OctahedronGeometry(.045,0),gold);star.position.z=-.06;bow.add(l,r,knot,star);bow.position.set(0,1.27,.18);root.add(bow)}

const VRoidAliases={
 hips:['J_Bip_C_Hips','Normalized_J_Bip_C_Hips'],spine:['J_Bip_C_Spine','Normalized_J_Bip_C_Spine'],chest:['J_Bip_C_Chest','Normalized_J_Bip_C_Chest'],
 lUpperArm:['J_Bip_L_UpperArm','Normalized_J_Bip_L_UpperArm'],rUpperArm:['J_Bip_R_UpperArm','Normalized_J_Bip_R_UpperArm'],
 lLowerArm:['J_Bip_L_LowerArm','Normalized_J_Bip_L_LowerArm'],rLowerArm:['J_Bip_R_LowerArm','Normalized_J_Bip_R_LowerArm'],
 lUpperLeg:['J_Bip_L_UpperLeg','Normalized_J_Bip_L_UpperLeg'],rUpperLeg:['J_Bip_R_UpperLeg','Normalized_J_Bip_R_UpperLeg'],
 lLowerLeg:['J_Bip_L_LowerLeg','Normalized_J_Bip_L_LowerLeg'],rLowerLeg:['J_Bip_R_LowerLeg','Normalized_J_Bip_R_LowerLeg']
};
function findBone(root,names){for(const n of names){const o=root.getObjectByName(n);if(o)return o}return null}
function makeProceduralAnimator(root){
 const bones={};for(const [k,names] of Object.entries(VRoidAliases))bones[k]=findBone(root,names);
 const rest={};for(const [k,b] of Object.entries(bones))if(b)rest[k]=b.quaternion.clone();
 const poseQ=new THREE.Quaternion(),targetQ=new THREE.Quaternion();let action='idle',phase=0;
 function pose(k,x=0,y=0,z=0,blend=.24){const b=bones[k],r=rest[k];if(!b||!r)return;poseQ.setFromEuler(new THREE.Euler(x,y,z,'XYZ'));targetQ.copy(r).multiply(poseQ);b.quaternion.slerp(targetQ,blend)}
 function reset(blend=.18){for(const [k,b] of Object.entries(bones)){if(b&&rest[k])b.quaternion.slerp(rest[k],blend)}}
 function update(dt){phase+=dt;const s=Math.sin(phase*(action==='run'?10:action==='walk'?7:2.1));const c=Math.cos(phase*(action==='run'?10:action==='walk'?7:2.1));
  reset(.15);
  if(action==='idle'){pose('lUpperArm',.02,0,-1.18,.2);pose('rUpperArm',-.02,0,1.18,.2);pose('lLowerArm',0,0,-.08,.2);pose('rLowerArm',0,0,.08,.2);pose('chest',.015*Math.sin(phase*2),0,.018*Math.sin(phase),.12);return}
  if(action==='walk'||action==='run'){
   const run=action==='run',legAmp=run?.72:.48,armAmp=run?.58:.38;
   pose('lUpperArm',s*armAmp,0,-1.12,.32);pose('rUpperArm',-s*armAmp,0,1.12,.32);
   pose('lLowerArm',run?.28:.12,0,-.12,.28);pose('rLowerArm',run?.28:.12,0,.12,.28);
   pose('lUpperLeg',-s*legAmp,0,0,.35);pose('rUpperLeg',s*legAmp,0,0,.35);
   pose('lLowerLeg',Math.max(0,s)*-(run?.72:.42),0,0,.32);pose('rLowerLeg',Math.max(0,-s)*-(run?.72:.42),0,0,.32);
   pose('chest',run?.08:.04,0,c*(run?.055:.03),.2);return
  }
  if(action==='jump'){pose('lUpperArm',-.5,0,-.72,.35);pose('rUpperArm',-.5,0,.72,.35);pose('lUpperLeg',-.25,0,0,.35);pose('rUpperLeg',-.25,0,0,.35);pose('lLowerLeg',-.42,0,0,.35);pose('rLowerLeg',-.42,0,0,.35);return}
  if(action==='fish'){pose('lUpperArm',-.38,0,-.55,.25);pose('rUpperArm',-.38,0,.55,.25);pose('lLowerArm',-.65,0,-.1,.25);pose('rLowerArm',-.65,0,.1,.25);return}
  if(action==='farm'){pose('chest',.32,0,0,.25);pose('lUpperArm',-.48,0,-.45,.3);pose('rUpperArm',-.48,0,.45,.3);pose('lLowerArm',-.55,0,0,.3);pose('rLowerArm',-.55,0,0,.3);return}
  if(action==='chop'||action==='attack'){const hit=Math.sin(phase*8);pose('lUpperArm',-.85+hit*.35,0,-.45,.35);pose('rUpperArm',-.85+hit*.35,0,.45,.35);pose('lLowerArm',-.42,0,0,.3);pose('rLowerArm',-.42,0,0,.3);return}
  if(action==='dodge'){pose('chest',.25,0,.22,.32);pose('lUpperLeg',-.22,0,0,.3);pose('rUpperLeg',.22,0,0,.3);return}
 }
 return{available:['idle','walk','run','jump','fish','farm','chop','attack','dodge'],play(name){action=name||'idle'},update,get action(){return action},bonesFound:Object.values(bones).filter(Boolean).length};
}

async function create(id){const spec=TEST_CHARACTERS[id];if(!spec)throw new Error(`Unknown test character: ${id}`);const source=await load(spec.model);const root=cloneSkeleton(source.scene);let clips=source.animations||[];normalize(root);if(spec.animeBase)tintAnimeHair(root);if(spec.style)addMockupStyle(root);root.name=`ag-${id}`;root.userData={...(root.userData||{}),agTestCharacter:id,label:spec.label,style:spec.style||'',animeBase:!!spec.animeBase};let animationLibraryStatus='embedded';if(spec.animations){try{const lib=await load(spec.animations,ANIMATION_TIMEOUT);if(lib.animations?.length){clips=lib.animations;animationLibraryStatus='loaded'}else animationLibraryStatus='empty'}catch(e){animationLibraryStatus='skipped';console.warn('[AG] optional candidate animation library skipped:',id,e)}}const mixer=new THREE.AnimationMixer(root),actions={};const map={idle:['idle','stand','breath'],walk:['walk'],run:['run','sprint','jog'],jump:['jump'],fish:['fish'],farm:['farm','plant','hoe'],chop:['chop','axe'],attack:['attack','slash','punch'],dodge:['dodge','roll']};for(const [name,keys] of Object.entries(map)){const clip=chooseClip(clips,keys);if(clip)actions[name]=mixer.clipAction(clip,root)}
 let current=null,procedural=null;
 if(spec.animeBase&&Object.keys(actions).length<3){procedural=makeProceduralAnimator(root);animationLibraryStatus=`procedural:${procedural.bonesFound}`}
 function play(name){if(procedural){procedural.play(name);return}const next=actions[name]||actions.idle||actions.walk||Object.values(actions)[0];if(!next||next===current)return;current?.fadeOut(.12);next.reset().fadeIn(.12).play();current=next}
 play('idle');
 return{root,mixer,actions,clips,play,update(dt){if(procedural)procedural.update(dt);else mixer.update(dt)},available:procedural?procedural.available:Object.keys(actions),animationLibraryStatus,hairStatus:spec.animeBase?'embedded':'none',styleStatus:spec.style||'',forwardYaw:Math.PI,procedural:!!procedural};
}
globalThis.__AGCB_TEST_CHARACTER_RUNTIME={version:9,characters:TEST_CHARACTERS,create,modelTimeout:MODEL_TIMEOUT,animationTimeout:ANIMATION_TIMEOUT,cache,sharedThree:true,target:'cc0-vroid-anime-cat-ear-v2-procedural-motion'};
export{TEST_CHARACTERS,create};
