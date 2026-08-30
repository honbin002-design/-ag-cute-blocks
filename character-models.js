import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const LIVE_AVATARS=globalThis.__AGCB_LIVE_AVATARS||(globalThis.__AGCB_LIVE_AVATARS=new Set());
const LIVE_PETS=globalThis.__AGCB_LIVE_PETS||(globalThis.__AGCB_LIVE_PETS=new Set());
const mat=(color,roughness=.84)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.015});
const skin=mat(0xf2c5a5,.9),eye=mat(0x27313a,.66),white=mat(0xfffdf8,.8),shoe=mat(0x665f5b,.88);
function ellipsoid(parent,r,x,y,z,color,scale=[1,1,1],segments=20){const m=new THREE.Mesh(new THREE.SphereGeometry(r,segments,Math.max(12,segments-6)),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function capsule(parent,r,length,x,y,z,color){const pivot=new THREE.Group();pivot.position.set(x,y,z);const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,length-r*2),6,12),typeof color==='number'?mat(color):color);m.castShadow=true;pivot.add(m);parent.add(pivot);return pivot}
function cone(parent,r,h,x,y,z,color,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,10),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m}

export function createCuteChildAvatar(style='girl',options={}){
  const g=new THREE.Group(),girl=style==='girl';
  const hair=mat(options.hairColor??(girl?0x68483b:0x4f3c34),.93),shirt=mat(options.shirtColor??(girl?0xf1a4b5:0x74afd7),.88),denim=mat(options.bottomColor??0x6685a3,.9),cream=mat(0xfff3d8,.9);
  ellipsoid(g,.34,0,1.72,-.01,skin,[.96,1.02,.91],24);ellipsoid(g,.35,0,1.84,.02,hair,[1,.63,.94],24);
  if(girl){ellipsoid(g,.15,-.27,1.67,.05,hair,[.72,1.35,.7],18);ellipsoid(g,.15,.27,1.67,.05,hair,[.72,1.35,.7],18);ellipsoid(g,.07,-.27,1.48,.05,0xf2b1be,[1.2,.55,1],12);ellipsoid(g,.07,.27,1.48,.05,0xf2b1be,[1.2,.55,1],12)}else for(let i=0;i<6;i++)ellipsoid(g,.105,(i-2.5)*.095,1.99+(i%2)*.02,-.015,hair,[.9,.72,.9],14);
  ellipsoid(g,.036,-.115,1.75,-.315,eye,[1,.95,.55],12);ellipsoid(g,.036,.115,1.75,-.315,eye,[1,.95,.55],12);ellipsoid(g,.011,-.104,1.762,-.336,white,[1,1,.4],10);ellipsoid(g,.011,.126,1.762,-.336,white,[1,1,.4],10);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.055,.009,7,16,Math.PI),mat(0xb96f69,.8));smile.rotation.z=Math.PI;smile.position.set(0,1.63,-.317);g.add(smile);ellipsoid(g,.037,-.22,1.66,-.292,0xf1aaa3,[1.25,.48,.38],10);ellipsoid(g,.037,.22,1.66,-.292,0xf1aaa3,[1.25,.48,.38],10);
  ellipsoid(g,.35,0,1.14,0,shirt,[.78,1.02,.56],22);ellipsoid(g,.29,0,1.02,-.205,denim,[.86,.78,.24],18);
  const strapL=capsule(g,.035,.45,-.16,1.22,-.22,denim),strapR=capsule(g,.035,.45,.16,1.22,-.22,denim);strapL.rotation.z=-.04;strapR.rotation.z=.04;ellipsoid(g,.035,-.13,1.03,-.245,cream,[1,1,.5],10);ellipsoid(g,.035,.13,1.03,-.245,cream,[1,1,.5],10);
  const leftArm=capsule(g,.085,.56,-.37,1.14,0,shirt);leftArm.rotation.z=-.11;const rightArm=capsule(g,.085,.56,.37,1.14,0,shirt);rightArm.rotation.z=.11;ellipsoid(g,.095,-.40,.82,0,skin,[.9,1,.9],14);ellipsoid(g,.095,.40,.82,0,skin,[.9,1,.9],14);
  ellipsoid(g,.31,0,.76,0,denim,[1,.48,.72],18);const leftLeg=capsule(g,.105,.55,-.16,.43,0,skin),rightLeg=capsule(g,.105,.55,.16,.43,0,skin);ellipsoid(leftLeg,.145,0,-.32,-.055,shoe,[1,.58,1.38],16);ellipsoid(rightLeg,.145,0,-.32,-.055,shoe,[1,.58,1.38],16);
  const visual=new THREE.Group();while(g.children.length)visual.add(g.children[0]);g.add(visual);g.userData={avatarStyle:style,visual,pose:'idle',animatedParts:{leftArm,rightArm,leftLeg,rightLeg}};
  LIVE_AVATARS.add(g);globalThis.AGCBCharacterPose=pose=>setCuteCharacterPose(g,pose);return g;
}

function paw(parent,x,z,color){ellipsoid(parent,.085,x,.075,z,color,[1.05,.48,1.35],12)}
function createPetBase(type,colors){
  const g=new THREE.Group(),bodyMat=mat(colors.body,.94),detailMat=mat(colors.detail,.94),muzzleMat=mat(colors.muzzle,.94),noseMat=mat(0x2b2c2d,.72),dog=type==='dog';
  const body=ellipsoid(g,dog?.36:.32,0,.48,.08,bodyMat,dog?[1.55,.78,.88]:[1.48,.76,.84],24);ellipsoid(g,dog?.23:.215,0,.62,-.49,bodyMat,dog?[1.05,1,.94]:[1,.98,.9],22);ellipsoid(g,.19,0,.50,-.28,bodyMat,[.95,1.22,.9],18);
  const legs=[];for(const [x,z] of [[-.22,-.12],[.22,-.12],[-.22,.30],[.22,.30]]){const p=capsule(g,dog?.055:.05,.34,x,.23,z,bodyMat);legs.push(p);paw(g,x,z-.035,detailMat)}
  ellipsoid(g,dog?.105:.085,0,.57,-.69,muzzleMat,dog?[1.25,.72,1.12]:[1.15,.65,1.05],16);ellipsoid(g,.047,0,.60,-.78,noseMat,[1.08,.72,.8],12);for(const x of[-.095,.095]){ellipsoid(g,.031,x,.69,-.67,eye,[1,.98,.58],10);ellipsoid(g,.009,x+.009,.70,-.686,white,[1,1,.4],8)}
  let tail;if(dog){const le=ellipsoid(g,.14,-.20,.72,-.43,detailMat,[.62,1.25,.48],16),re=ellipsoid(g,.14,.20,.72,-.43,detailMat,[.62,1.25,.48],16);le.rotation.z=-.25;re.rotation.z=.25;tail=capsule(g,.045,.46,0,.55,.55,bodyMat);tail.rotation.x=-.78;tail.position.z=.52}else{cone(g,.105,.25,-.15,.88,-.47,bodyMat,[0,0,-.08]);cone(g,.105,.25,.15,.88,-.47,bodyMat,[0,0,.08]);tail=new THREE.Group();tail.position.set(0,.50,.54);const t1=capsule(tail,.038,.48,0,.12,.12,bodyMat);t1.rotation.x=-.88;const t2=capsule(tail,.034,.42,0,.18,.36,bodyMat);t2.rotation.x=-.38;g.add(tail);for(let s=-1;s<=1;s+=2)for(let i=0;i<3;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(.0045,.0045,.28,5),detailMat);w.rotation.z=Math.PI/2;w.position.set(s*.13,.56,-.72);w.rotation.y=(i-1)*.12;g.add(w)}}
  g.userData={petType:type,petState:'idle',stateUntil:0,animatedParts:{tail,legs},body,baseBodyY:body.position.y};LIVE_PETS.add(g);return g;
}
export function createCuteDog(variant='golden'){const p={golden:{body:0xd9a66f,detail:0xb97949,muzzle:0xe9c79d},cream:{body:0xdfd0b7,detail:0xbda17f,muzzle:0xeee1ce},brown:{body:0x916044,detail:0x67412f,muzzle:0xb98b6d}};return createPetBase('dog',p[variant]||p.golden)}
export function createCuteCat(variant='gray'){const p={gray:{body:0xaeb4bd,detail:0x737a85,muzzle:0xd5d8dd},orange:{body:0xd99a61,detail:0xad693e,muzzle:0xeac29a},white:{body:0xe9e9e5,detail:0x968b83,muzzle:0xf7f7f4}};return createPetBase('cat',p[variant]||p.gray)}

export function setCutePetState(group,state='idle',until=0){const u=group?.userData;if(!u?.petType)return;u.petState=state;u.stateUntil=until||0;if(state==='sleep'&&group.parent&&!u.holdPosition)u.holdPosition=group.parent.position.clone();if(state!=='sleep')u.holdPosition=null}
export function setCuteCharacterPose(group,pose='idle'){
  const u=group?.userData;if(!u?.animatedParts)return;const p=u.animatedParts,v=u.visual;u.pose=pose;group.onBeforeRender=null;
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
  const u=group?.userData,p=u?.animatedParts;if(!p)return;if(['sit','lie','sleep','swing','dine'].includes(u.pose))return;
  if(!petAnimationDue(u,time,moving))return;
  if(u.petType){
    if(u.stateUntil&&time>u.stateUntil){u.petState='idle';u.stateUntil=0;u.holdPosition=null}
    const state=u.petState||'idle';if(state==='sleep'){
      if(u.holdPosition&&group.parent)group.parent.position.copy(u.holdPosition);p.legs.forEach((leg,i)=>{leg.rotation.x=i<2?-.82:.78;leg.rotation.z=i%2?-.10:.10});if(u.body)u.body.position.y=(u.baseBodyY||.48)-.18+Math.sin(time*.0016)*.006;if(p.tail)p.tail.rotation.y=Math.sin(time*.0024)*.06;return
    }
    if(u.body)u.body.position.y=u.baseBodyY||.48;
    if(state==='petResponse'){p.legs.forEach(leg=>{leg.rotation.x=0;leg.rotation.z=0});if(p.tail)p.tail.rotation.y=Math.sin(time*.018)*.48;if(u.body)u.body.rotation.z=Math.sin(time*.008)*.015;return}
  }
  const rate=.011*Math.max(.65,speed),swing=moving?Math.sin(time*rate)*.46:Math.sin(time*.003)*.018;if(p.leftArm)p.leftArm.rotation.x=swing;if(p.rightArm)p.rightArm.rotation.x=-swing;if(p.leftLeg)p.leftLeg.rotation.x=-swing*.78;if(p.rightLeg)p.rightLeg.rotation.x=swing*.78;if(Array.isArray(p.legs))p.legs.forEach((leg,i)=>{leg.rotation.z=0;leg.rotation.x=moving?Math.sin(time*rate+(i===0||i===3?0:Math.PI))*.34:0});if(p.tail)p.tail.rotation.y=Math.sin(time*(moving?.011:.0055))*.30;
}
