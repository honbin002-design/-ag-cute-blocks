import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const LIVE_AVATARS=globalThis.__AGCB_LIVE_AVATARS||(globalThis.__AGCB_LIVE_AVATARS=new Set());
const LIVE_PETS=globalThis.__AGCB_LIVE_PETS||(globalThis.__AGCB_LIVE_PETS=new Set());
const mat=(color,roughness=.84)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.015});
const skin=mat(0xf2c5a5,.9),eye=mat(0x27313a,.66),white=mat(0xfffdf8,.8),shoe=mat(0x665f5b,.88),sole=mat(0xf4eee6,.92);
function ellipsoid(parent,r,x,y,z,color,scale=[1,1,1],segments=20){const m=new THREE.Mesh(new THREE.SphereGeometry(r,segments,Math.max(12,segments-6)),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function capsule(parent,r,length,x,y,z,color){const pivot=new THREE.Group();pivot.position.set(x,y,z);const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,length-r*2),6,12),typeof color==='number'?mat(color):color);m.castShadow=true;pivot.add(m);parent.add(pivot);return pivot}
function cone(parent,r,h,x,y,z,color,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,10),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m}

export function createCuteChildAvatar(style='girl',options={}){
  const incoming=typeof style==='object'?style:{...options,gender:options.gender||style};
  const c=normalizeAvatarCustomization(incoming,typeof style==='string'?style:'girl');
  const g=new THREE.Group(),girl=c.gender==='girl';
  const skin=mat(options.skinColor??SKIN_PALETTE[c.skin],.9),hair=mat(options.hairColor??HAIR_PALETTE[c.hair],.93),shirt=mat(options.shirtColor??TOP_PALETTE[c.top],.88),denim=mat(options.bottomColor??BOTTOM_PALETTE[c.bottom],.9),cream=mat(0xfff3d8,.9),sock=mat(0xf8f4ec,.92),legMat=c.outfit==='dress'?skin:denim;
  // Head/ears/hair silhouette: rounded farm-life chibi proportions, front is local -Z.
  ellipsoid(g,.43,0,1.75,-.01,skin,[1.00,1.06,.95],28);ellipsoid(g,.055,-.33,1.72,-.01,skin,[.55,1,.45],12);ellipsoid(g,.055,.33,1.72,-.01,skin,[.55,1,.45],12);ellipsoid(g,.45,0,1.88,.02,hair,[1.08,.70,1.00],28);
  // Layered fringe keeps the face readable from gameplay distance instead of a helmet-like hair cap.
  ellipsoid(g,.17,-.23,1.91,-.405,hair,[1.10,.78,.46],18);ellipsoid(g,.19,-.06,1.96,-.425,hair,[1.12,.82,.44],18);ellipsoid(g,.17,.12,1.94,-.415,hair,[1.10,.78,.46],18);ellipsoid(g,.14,.26,1.88,-.385,hair,[1.04,.78,.44],16);
  if(c.hairStyle==='bob'){ellipsoid(g,.15,-.27,1.67,.05,hair,[.72,1.35,.7],18);ellipsoid(g,.15,.27,1.67,.05,hair,[.72,1.35,.7],18);ellipsoid(g,.07,-.27,1.48,.05,0xf2b1be,[1.2,.55,1],12);ellipsoid(g,.07,.27,1.48,.05,0xf2b1be,[1.2,.55,1],12)}else if(c.hairStyle==='long'){ellipsoid(g,.17,-.30,1.63,.06,hair,[.76,1.78,.72],18);ellipsoid(g,.17,.30,1.63,.06,hair,[.76,1.78,.72],18)}else if(c.hairStyle==='ponytail'){ellipsoid(g,.15,.29,1.66,.06,hair,[.72,1.35,.70],18);ellipsoid(g,.18,.34,1.96,.18,hair,[.72,1.15,.72],16)}else if(c.hairStyle==='curly'){for(let i=0;i<9;i++)ellipsoid(g,.105,(i-4)*.09,1.96+(i%3)*.04,.01,hair,[.95,.78,.92],14)}else for(let i=0;i<6;i++)ellipsoid(g,.105,(i-2.5)*.095,1.99+(i%2)*.02,-.015,hair,[.9,.72,.9],14);
  // Eyes + catchlights + brows + tiny nose/mouth/blush make the face legible rather than mask-like.
  ellipsoid(g,.060,-.14,1.77,-.455,eye,[1,.98,.54],16);ellipsoid(g,.060,.14,1.77,-.455,eye,[1,.98,.54],16);ellipsoid(g,.018,-.122,1.792,-.492,white,[1,1,.4],10);ellipsoid(g,.018,.158,1.792,-.492,white,[1,1,.4],10);
  const browMat=hair;for(const x of[-.115,.115]){const brow=new THREE.Mesh(new THREE.CapsuleGeometry(.008,.055,4,8),browMat);brow.rotation.z=Math.PI/2;brow.position.set(x,1.85,-.445);g.add(brow)}ellipsoid(g,.024,0,1.69,-.455,0xe5a989,[.65,.7,.42],10);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.055,.009,7,16,Math.PI),mat(0xb96f69,.8));smile.rotation.z=Math.PI;smile.position.set(0,1.625,-.455);g.add(smile);ellipsoid(g,.040,-.22,1.66,-.435,0xf1aaa3,[1.25,.48,.38],10);ellipsoid(g,.040,.22,1.66,-.435,0xf1aaa3,[1.25,.48,.38],10);
  // Clothing has a clear collar/overall layer instead of one undifferentiated body blob.
  ellipsoid(g,.39,0,1.17,0,shirt,[.86,1.08,.62],26);ellipsoid(g,.40,0,1.24,.015,shirt,[.88,.82,.58],22);ellipsoid(g,.095,-.11,1.405,-.245,cream,[1,.42,.30],12);ellipsoid(g,.095,.11,1.405,-.245,cream,[1,.42,.30],12);
  ellipsoid(g,.29,0,1.02,-.205,denim,[.86,.78,.24],18);const bib=ellipsoid(g,.19,0,1.13,-.275,denim,[1,.85,.18],16);
  const strapL=capsule(g,.035,.45,-.16,1.22,-.22,denim),strapR=capsule(g,.035,.45,.16,1.22,-.22,denim);strapL.rotation.z=-.04;strapR.rotation.z=.04;ellipsoid(g,.035,-.13,1.03,-.245,cream,[1,1,.5],10);ellipsoid(g,.035,.13,1.03,-.245,cream,[1,1,.5],10);
  const leftArm=capsule(g,.108,.64,-.41,1.16,0,shirt);leftArm.rotation.z=-.11;const rightArm=capsule(g,.108,.64,.41,1.16,0,shirt);rightArm.rotation.z=.11;ellipsoid(g,.122,-.45,.80,0,skin,[.94,1.05,.94],16);ellipsoid(g,.122,.45,.80,0,skin,[.94,1.05,.94],16);
  // Shorts/skirt silhouette, socks and shoes with separate soles improve the walking read.
  ellipsoid(g,.35,0,.78,0,denim,[1.05,.52,.78],20);if(girl){const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.38,.46,.24,20),denim);skirt.position.set(0,.72,0);skirt.castShadow=true;g.add(skirt)}
  const leftLeg=capsule(g,.135,.54,-.17,.43,0,legMat),rightLeg=capsule(g,.135,.54,.17,.43,0,legMat);ellipsoid(leftLeg,.115,0,-.245,-.01,sock,[1,.62,1],14);ellipsoid(rightLeg,.115,0,-.245,-.01,sock,[1,.62,1],14);ellipsoid(leftLeg,.175,0,-.31,-.055,shoe,[1.06,.64,1.48],18);ellipsoid(rightLeg,.175,0,-.31,-.055,shoe,[1.06,.64,1.48],18);ellipsoid(leftLeg,.158,0,-.375,-.070,sole,[1.06,.28,1.46],16);ellipsoid(rightLeg,.158,0,-.375,-.070,sole,[1.06,.28,1.46],16);
  addAvatarAccessories(g,c,hair,shirt);const visual=new THREE.Group();while(g.children.length)visual.add(g.children[0]);g.add(visual);const bodyScale={round:[1.05,1,1.02],tall:[.95,1.07,.97],petite:[.94,.94,.95]}[c.body]||[1,1,1];g.scale.set(...bodyScale);g.userData={avatarStyle:c.gender,avatarCustomization:c,avatarVisualStyle:'premium-chibi-v4',visual,pose:'idle',animatedParts:{leftArm,rightArm,leftLeg,rightLeg,bib}};
  LIVE_AVATARS.add(g);globalThis.AGCBCharacterPose=pose=>setCuteCharacterPose(g,pose);globalThis.__AGCB_UPGRADE_AVATAR?.(g,c);return g;
}

function paw(parent,x,z,color,front=false){const p=ellipsoid(parent,.085,x,.075,z,color,[1.05,.48,front?1.42:1.32],12);ellipsoid(parent,.026,x-.032,.086,z-.080,color,[.62,.40,.72],8);ellipsoid(parent,.026,x+.032,.086,z-.080,color,[.62,.40,.72],8);return p}
function createPetBase(type,colors){
  const g=new THREE.Group(),bodyMat=mat(colors.body,.94),detailMat=mat(colors.detail,.94),muzzleMat=mat(colors.muzzle,.94),noseMat=mat(0x2b2c2d,.72),dog=type==='dog';
  const body=ellipsoid(g,dog?.36:.32,0,.48,.08,bodyMat,dog?[1.55,.78,.88]:[1.48,.76,.84],24);ellipsoid(g,dog?.23:.215,0,.63,-.49,bodyMat,dog?[1.08,1,.96]:[1,.98,.9],22);ellipsoid(g,dog?.19:.17,0,.50,-.29,bodyMat,[.94,1.20,.88],18);
  // Chest patch and shoulder mass keep the animals from reading as a cylinder with sticks.
  ellipsoid(g,dog?.17:.14,0,.43,-.30,muzzleMat,[.88,1.16,.34],16);ellipsoid(g,.17,0,.49,.28,bodyMat,[1.20,.86,.82],16);
  const legs=[];for(const [i,[x,z]] of [[0,[-.22,-.14]],[1,[.22,-.14]],[2,[-.22,.30]],[3,[.22,.30]]]){const front=i<2,p=capsule(g,dog?.058:.052,front?.38:.35,x,.24,z,bodyMat);legs.push(p);paw(g,x,z-.040,detailMat,front)}
  // Species-specific face: dog has longer muzzle + hanging ears, cat has short muzzle + upright ears.
  ellipsoid(g,dog?.115:.088,0,.57,-.70,muzzleMat,dog?[1.34,.74,1.18]:[1.16,.66,1.05],16);ellipsoid(g,.048,0,.605,-.795,noseMat,[1.10,.72,.82],12);for(const x of[-.097,.097]){ellipsoid(g,.033,x,.70,-.675,eye,[1,.98,.58],10);ellipsoid(g,.009,x+.009,.711,-.691,white,[1,1,.4],8)}
  let tail;if(dog){const le=ellipsoid(g,.15,-.225,.70,-.43,detailMat,[.62,1.38,.44],16),re=ellipsoid(g,.15,.225,.70,-.43,detailMat,[.62,1.38,.44],16);le.rotation.z=-.20;le.rotation.x=-.15;re.rotation.z=.20;re.rotation.x=-.15;tail=capsule(g,.052,.52,0,.57,.58,bodyMat);tail.rotation.x=-.82;tail.position.z=.53}else{cone(g,.112,.29,-.15,.89,-.47,bodyMat,[0,0,-.08]);cone(g,.112,.29,.15,.89,-.47,bodyMat,[0,0,.08]);ellipsoid(g,.055,-.11,.61,-.735,muzzleMat,[1.05,.55,.68],10);ellipsoid(g,.055,.11,.61,-.735,muzzleMat,[1.05,.55,.68],10);tail=new THREE.Group();tail.position.set(0,.50,.54);const t1=capsule(tail,.040,.52,0,.12,.12,bodyMat);t1.rotation.x=-.88;const t2=capsule(tail,.036,.46,0,.18,.39,bodyMat);t2.rotation.x=-.34;g.add(tail);for(let s=-1;s<=1;s+=2)for(let i=0;i<3;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(.0045,.0045,.30,5),detailMat);w.rotation.z=Math.PI/2;w.position.set(s*.14,.57,-.74);w.rotation.y=(i-1)*.12;g.add(w)}}
  const collarMat=mat(dog?0xd86f79:0x78a8d8,.72),collar=new THREE.Mesh(new THREE.TorusGeometry(dog?.19:.17,.025,8,18),collarMat);collar.rotation.x=Math.PI/2;collar.position.set(0,.64,-.12);collar.castShadow=true;g.add(collar);if(dog){const tag=new THREE.Mesh(new THREE.SphereGeometry(.035,10,8),mat(0xf4cf67,.55));tag.position.set(0,.59,-.30);g.add(tag)}else{ellipsoid(g,.07,0,.62,-.31,collarMat,[1.7,.8,.45],10)}g.userData={petType:type,petState:'idle',stateUntil:0,animatedParts:{tail,legs},body,baseBodyY:body.position.y};LIVE_PETS.add(g);return g;
}
export function createCuteDog(variant='golden'){const p={golden:{body:0xd9a66f,detail:0xb97949,muzzle:0xe9c79d},cream:{body:0xdfd0b7,detail:0xbda17f,muzzle:0xeee1ce},brown:{body:0x916044,detail:0x67412f,muzzle:0xb98b6d}};return createPetBase('dog',p[variant]||p.golden)}
export function createCuteCat(variant='gray'){const p={gray:{body:0xaeb4bd,detail:0x737a85,muzzle:0xd5d8dd},orange:{body:0xd99a61,detail:0xad693e,muzzle:0xeac29a},white:{body:0xe9e9e5,detail:0x968b83,muzzle:0xf7f7f4}};return createPetBase('cat',p[variant]||p.gray)}

export function setCutePetState(group,state='idle',until=0){const u=group?.userData;if(!u?.petType)return;u.petState=state;u.stateUntil=until||0;if(state==='sleep'&&group.parent&&!u.holdPosition)u.holdPosition=group.parent.position.clone();if(state!=='sleep')u.holdPosition=null}
export function setCuteCharacterPose(group,pose='idle'){
  const u=group?.userData;if(!u?.animatedParts)return;const p=u.animatedParts,v=u.visual;u.pose=pose;globalThis.__AGCB_ASSET_SET_POSE?.(group,pose);group.onBeforeRender=null;
  if(v){v.position.set(0,0,0);v.rotation.set(0,0,0)}p.leftArm.rotation.set(0,0,-.11);p.rightArm.rotation.set(0,0,.11);p.leftLeg.rotation.set(0,0,0);p.rightLeg.rotation.set(0,0,0);
  if(pose==='sit'||pose==='swing'||pose==='dine'){p.leftLeg.rotation.x=-1.22;p.rightLeg.rotation.x=-1.22;p.leftArm.rotation.x=pose==='dine'?-1.02:-.18;p.rightArm.rotation.x=pose==='dine'?-1.02:-.18}
  else if(pose==='lie'||pose==='sleep'){if(v){v.rotation.z=Math.PI/2;v.position.set(.66,0,0)}p.leftArm.rotation.x=pose==='sleep'?.34:.08;p.rightArm.rotation.x=pose==='sleep'?.26:-.08;p.leftLeg.rotation.x=.05;p.rightLeg.rotation.x=-.05}
  if(['lie','sleep','swing','dine'].includes(pose))group.onBeforeRender=()=>animateLockedPose(group,performance.now());
}
function animateLockedPose(group,time){const u=group?.userData,p=u?.animatedParts,v=u?.visual;if(!p||!v)return;if(u.pose==='lie'){v.position.y=Math.sin(time*.0024)*.012}else if(u.pose==='sleep'){v.position.y=Math.sin(time*.0018)*.018;v.rotation.x=Math.sin(time*.0012)*.01}else if(u.pose==='swing'){const a=Math.sin(time*.0024);v.rotation.x=a*.055;v.position.z=a*.035;p.leftLeg.rotation.x=-1.18+a*.08;p.rightLeg.rotation.x=-1.18-a*.08}else if(u.pose==='dine'){const bite=Math.max(0,Math.sin(time*.004));p.leftArm.rotation.x=-.86-bite*.22;p.rightArm.rotation.x=-.98+Math.sin(time*.0032)*.08}}
function petAnimationDue(u,time,moving){
  if(!u?.petType)return true;
  const state=u.petState||'idle';if(state==='sleep'||state==='petResponse')return true;
  const tier=globalThis.__AGCB_PERF_TIER||'normal',gap=tier==='low'?(moving?48:90):tier==='high'?16:(moving?32:64);
  if(u._lastAnimAt&&time-u._lastAnimAt<gap)return false;u._lastAnimAt=time;return true;
}
export function animateCuteCharacter(group,time,moving=false,speed=1){
  const u=group?.userData,p=u?.animatedParts;if(!p)return;if(u.assetMixer){const dt=u._assetLastTime?Math.min(.12,Math.max(0,(time-u._assetLastTime)/1000)):0;u._assetLastTime=time;if(dt)u.assetMixer.update(dt);if(!['sit','lie','sleep','swing','dine'].includes(u.pose))globalThis.__AGCB_ASSET_SET_MOTION?.(group,moving?'walk':'idle');return}if(['sit','lie','sleep','swing','dine'].includes(u.pose))return;
  if(!petAnimationDue(u,time,moving))return;
  if(u.petType){
    if(u.stateUntil&&time>u.stateUntil){u.petState='idle';u.stateUntil=0;u.holdPosition=null}
    const state=u.petState||'idle';if(state==='sleep'){
      if(u.holdPosition&&group.parent)group.parent.position.copy(u.holdPosition);p.legs.forEach((leg,i)=>{leg.rotation.x=i<2?-.82:.78;leg.rotation.z=i%2?-.10:.10});if(u.body)u.body.position.y=(u.baseBodyY||.48)-.18+Math.sin(time*.0016)*.006;if(p.tail)p.tail.rotation.y=Math.sin(time*.0024)*.06;return
    }
    if(u.body)u.body.position.y=u.baseBodyY||.48;
    if(state==='petResponse'){p.legs.forEach(leg=>{leg.rotation.x=0;leg.rotation.z=0});if(p.tail)p.tail.rotation.y=Math.sin(time*.018)*.48;if(u.body)u.body.rotation.z=Math.sin(time*.008)*.015;return}
  }
  const rate=.011*Math.max(.65,speed),swing=moving?Math.sin(time*rate)*.46:Math.sin(time*.003)*.018;if(p.leftArm)p.leftArm.rotation.x=swing;if(p.rightArm)p.rightArm.rotation.x=-swing;if(p.leftLeg)p.leftLeg.rotation.x=-swing*.78;if(p.rightLeg)p.rightLeg.rotation.x=swing*.78;
  if(Array.isArray(p.legs)){const phase=time*rate;p.legs.forEach((leg,i)=>{leg.rotation.z=0;leg.rotation.x=moving?Math.sin(phase+(i===0||i===3?0:Math.PI))*.34:0});if(u.body&&moving)u.body.position.y=(u.baseBodyY||.48)+Math.abs(Math.sin(phase))*-.018}
  if(p.tail)p.tail.rotation.y=Math.sin(time*(moving?.011:.0055))*.30;
}

export const AVATAR_CUSTOMIZATION_SCHEMA=3;
export const DEFAULT_AVATAR_CUSTOMIZATION={schema:3,gender:'girl',body:'round',skin:'light',hairStyle:'bob',hair:'chestnut',outfit:'overall',top:'pink',bottom:'denim',hat:'none',glasses:'none',accessory:'none'};
const SKIN_PALETTE={light:0xf2c5a5,warm:0xc88963,deep:0x8c5a3c,rosy:0xf0b09e};
const HAIR_PALETTE={chestnut:0x68483b,black:0x2c2528,honey:0xb87845,plum:0x543c67};
const TOP_PALETTE={pink:0xf1a4b5,sky:0x74afd7,mint:0x8acbb9,lavender:0xbfa4e7};
const BOTTOM_PALETTE={denim:0x6685a3,navy:0x4e5c88,cream:0xe8c78b,rose:0xc87891};
export function normalizeAvatarCustomization(input={},legacyStyle='girl'){
  const src=input&&typeof input==='object'?input:{};
  const pick=(v,allowed,fallback)=>allowed.includes(v)?v:fallback;
  const gender=src.gender==='boy'||src.gender==='girl'?src.gender:legacyStyle==='boy'?'boy':'girl';
  return {...DEFAULT_AVATAR_CUSTOMIZATION,schema:3,gender,body:pick(src.body,['round','tall','petite'],'round'),skin:pick(src.skin,Object.keys(SKIN_PALETTE),'light'),hairStyle:pick(src.hairStyle,['bob','short','long','curly','ponytail'],gender==='girl'?'bob':'short'),hair:pick(src.hair,Object.keys(HAIR_PALETTE),'chestnut'),outfit:pick(src.outfit,['overall','dress','hoodie'],'overall'),top:pick(src.top,Object.keys(TOP_PALETTE),gender==='girl'?'pink':'sky'),bottom:pick(src.bottom,Object.keys(BOTTOM_PALETTE),'denim'),hat:pick(src.hat,['none','sun','beanie'],'none'),glasses:pick(src.glasses,['none','round'],'none'),accessory:pick(src.accessory,['none','scarf','backpack','bow'],'none')};
}
function addAvatarAccessories(g,c,hair,shirt){
  const hatMat=mat(c.hat==='beanie'?0x8bb8d8:0xf0c86d,.88),frame=mat(0x4a3d4a,.72),accent=mat(c.accessory==='scarf'?0xe8898f:0xf3c95f,.82),vest=mat(c.outfit==='hoodie'?TOP_PALETTE[c.top]:0x9a6745,.86),trim=mat(0xffd978,.72);
  // premium-chibi-v4: facial meshes sit outside the enlarged head, with a readable hair silhouette.
  for(const x of[-.14,.14])ellipsoid(g,.13,x,1.77,-.435,white,[1,.94,.40],20);
  for(const x of[-.14,.14]){ellipsoid(g,.068,x,1.77,-.492,eye,[1,.98,.52],16);ellipsoid(g,.025,x-.020,1.798,-.528,white,[1,1,.45],10)}
  for(const x of[-.37,.37])ellipsoid(g,.17,x,1.78,-.285,hair,[.78,1.38,.60],18);
  for(const [x,y,r,sx] of[[-.36,2.02,-.56,.84],[-.24,2.10,-.30,1.00],[-.08,2.15,-.10,1.04],[.09,2.14,.12,1.02],[.24,2.08,.34,.92],[.36,2.00,.52,.78]]){const lock=ellipsoid(g,.14,x,y,-.405,hair,[sx,.82,.50],18);lock.rotation.z=r}
  if(c.hat==='sun'){const brim=new THREE.Mesh(new THREE.CylinderGeometry(.40,.45,.05,24),hatMat);brim.position.set(0,2.15,0);brim.castShadow=true;g.add(brim);const crown=new THREE.Mesh(new THREE.CylinderGeometry(.24,.29,.20,18),hatMat);crown.position.set(0,2.26,.01);crown.castShadow=true;g.add(crown)}else if(c.hat==='beanie'){ellipsoid(g,.28,0,2.16,.01,hatMat,[1.08,.70,1.00],20);const brim=new THREE.Mesh(new THREE.TorusGeometry(.235,.03,8,20),hatMat);brim.rotation.x=Math.PI/2;brim.position.set(0,2.08,-.01);g.add(brim)}
  if(c.glasses==='round'){for(const x of[-.14,.14]){const lens=new THREE.Mesh(new THREE.TorusGeometry(.094,.013,8,20),frame);lens.position.set(x,1.77,-.545);lens.castShadow=true;g.add(lens)}const bridge=new THREE.Mesh(new THREE.BoxGeometry(.10,.014,.014),frame);bridge.position.set(0,1.77,-.545);g.add(bridge)}
  if(c.outfit==='overall'){for(const x of[-.22,.22]){const panel=new THREE.Mesh(new THREE.BoxGeometry(.16,.46,.05),vest);panel.position.set(x,1.16,-.335);panel.castShadow=true;g.add(panel)}for(const y of[1.28,1.14,1.00]){const button=new THREE.Mesh(new THREE.SphereGeometry(.025,10,8),trim);button.position.set(-.22,y,-.365);g.add(button)}const collar=new THREE.Mesh(new THREE.TorusGeometry(.135,.026,8,18),trim);collar.rotation.x=Math.PI/2;collar.position.set(0,1.40,-.26);g.add(collar);const belt=new THREE.Mesh(new THREE.BoxGeometry(.48,.055,.045),vest);belt.position.set(0,.91,-.32);g.add(belt)}
  if(c.outfit==='dress'){const dress=new THREE.Mesh(new THREE.CylinderGeometry(.33,.46,.30,20),shirt);dress.position.set(0,.76,0);dress.castShadow=true;g.add(dress);ellipsoid(g,.20,0,1.10,-.31,shirt,[1,.84,.22],16)}else if(c.outfit==='hoodie'){ellipsoid(g,.28,0,1.35,.09,shirt,[1.08,.76,.76],20);ellipsoid(g,.16,0,.98,-.32,accent,[1.20,.76,.20],16)}
  if(c.accessory==='scarf'){ellipsoid(g,.38,0,1.39,0,accent,[.75,.20,.60],18);const tail=ellipsoid(g,.09,.23,1.17,-.04,accent,[.68,1.9,.68],14);tail.rotation.z=-.12}else if(c.accessory==='backpack'){const pack=new THREE.Mesh(new THREE.BoxGeometry(.32,.40,.16),mat(0xf09c6d,.9));pack.position.set(0,1.04,.36);pack.castShadow=true;g.add(pack)}else if(c.accessory==='bow'){ellipsoid(g,.12,-.14,1.57,-.50,accent,[1.30,.84,.34],14);ellipsoid(g,.12,.14,1.57,-.50,accent,[1.30,.84,.34],14);ellipsoid(g,.04,0,1.57,-.53,hatMat,[1,1,.6],10)}
}
