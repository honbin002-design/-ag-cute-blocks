import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const mat=(color,roughness=.84)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.012});
const skin=mat(0xf2c5a5,.9),eye=mat(0x27313a,.66),white=mat(0xfffdf8,.8),shoe=mat(0x665f5b,.88),nose=mat(0x2b2d30,.72);
function ellipsoid(parent,r,x,y,z,color,scale=[1,1,1],segments=20){const m=new THREE.Mesh(new THREE.SphereGeometry(r,segments,Math.max(12,segments-6)),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function capsule(parent,r,length,x,y,z,color){const pivot=new THREE.Group();pivot.position.set(x,y,z);const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,length-r*2),6,12),typeof color==='number'?mat(color):color);m.castShadow=true;pivot.add(m);parent.add(pivot);return pivot}
function cone(parent,r,h,x,y,z,color,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,10),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m}
function tinyCylinder(parent,r,h,x,y,z,color,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.8,r,h,8),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m}

export function createCuteChildAvatar(style='girl',options={}){
  const g=new THREE.Group(),girl=style==='girl';
  const hair=mat(options.hairColor??(girl?0x69493c:0x4e3c35),.93),shirt=mat(options.shirtColor??(girl?0xf1a5b6:0x73afd8),.88),denim=mat(options.bottomColor??0x6684a1,.9),cream=mat(0xfff3d8,.9),sock=mat(0xf7efe7,.92);
  const head=new THREE.Group();head.position.set(0,1.70,0);g.add(head);
  ellipsoid(head,.34,0,0,0,skin,[.95,1.02,.90],24);
  ellipsoid(head,.35,0,.12,.025,hair,[1,.63,.94],24);
  // Side fringe makes the face read less like a ball from oblique third-person angles.
  ellipsoid(head,.15,-.18,.16,-.21,hair,[.72,.46,.30],16);ellipsoid(head,.13,.17,.18,-.20,hair,[.64,.42,.28],16);
  if(girl){ellipsoid(head,.145,-.28,-.03,.06,hair,[.70,1.34,.68],18);ellipsoid(head,.145,.28,-.03,.06,hair,[.70,1.34,.68],18);ellipsoid(head,.064,-.28,-.22,.06,0xf2b1be,[1.2,.55,1],12);ellipsoid(head,.064,.28,-.22,.06,0xf2b1be,[1.2,.55,1],12)}
  else for(let i=0;i<6;i++)ellipsoid(head,.098,(i-2.5)*.094,.28+(i%2)*.018,-.01,hair,[.9,.72,.9],14);
  // Ears, eyes, nose, mouth and blush.
  ellipsoid(head,.058,-.325,0,.0,skin,[.55,.85,.42],12);ellipsoid(head,.058,.325,0,.0,skin,[.55,.85,.42],12);
  for(const x of[-.115,.115]){ellipsoid(head,.036,x,.05,-.315,eye,[1,.95,.55],12);ellipsoid(head,.011,x+.011,.062,-.336,white,[1,1,.4],10)}
  ellipsoid(head,.022,0,-.015,-.332,0xe8a98f,[.7,.62,.42],10);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.055,.009,7,16,Math.PI),mat(0xb96f69,.8));smile.rotation.z=Math.PI;smile.position.set(0,-.07,-.317);head.add(smile);
  ellipsoid(head,.037,-.22,-.04,-.292,0xf1aaa3,[1.25,.48,.38],10);ellipsoid(head,.037,.22,-.04,-.292,0xf1aaa3,[1.25,.48,.38],10);

  // Compact farm-life body: chibi, but with shoulders, waist and layered work clothes.
  ellipsoid(g,.345,0,1.14,0,shirt,[.79,1.01,.57],22);ellipsoid(g,.275,0,1.02,-.205,denim,[.88,.76,.24],18);
  const strapL=capsule(g,.033,.44,-.155,1.22,-.22,denim),strapR=capsule(g,.033,.44,.155,1.22,-.22,denim);strapL.rotation.z=-.04;strapR.rotation.z=.04;
  ellipsoid(g,.035,-.13,1.03,-.245,cream,[1,1,.5],10);ellipsoid(g,.035,.13,1.03,-.245,cream,[1,1,.5],10);
  const leftArm=capsule(g,.083,.55,-.37,1.14,0,shirt);leftArm.rotation.z=-.11;const rightArm=capsule(g,.083,.55,.37,1.14,0,shirt);rightArm.rotation.z=.11;
  ellipsoid(leftArm,.096,0,-.29,-.01,skin,[.90,1,.90],14);ellipsoid(rightArm,.096,0,-.29,-.01,skin,[.90,1,.90],14);
  ellipsoid(g,.305,0,.77,0,denim,[1,.48,.72],18);
  const leftLeg=capsule(g,.101,.53,-.16,.43,0,skin),rightLeg=capsule(g,.101,.53,.16,.43,0,skin);
  ellipsoid(leftLeg,.105,0,-.255,0,sock,[1,.72,1],12);ellipsoid(rightLeg,.105,0,-.255,0,sock,[1,.72,1],12);
  ellipsoid(leftLeg,.145,0,-.32,-.055,shoe,[1,.58,1.38],16);ellipsoid(rightLeg,.145,0,-.32,-.055,shoe,[1,.58,1.38],16);
  g.userData={avatarStyle:style,animatedParts:{head,leftArm,rightArm,leftLeg,rightLeg},motionPhase:Math.random()*Math.PI*2};return g;
}

function paw(parent,x,y,z,color){const p=ellipsoid(parent,.085,x,y,z,color,[1.05,.48,1.40],13);return p}
function makePetLeg(g,x,z,bodyMat,pawMat,isHind=false){const pivot=new THREE.Group();pivot.position.set(x,isHind?.29:.30,z);g.add(pivot);const upper=capsule(pivot,isHind?.058:.052,isHind?.29:.31,0,-.03,0,bodyMat);upper.position.y=-.04;if(isHind){const hock=capsule(pivot,.047,.20,0,-.22,.055,bodyMat);hock.rotation.x=-.42}paw(pivot,0,-.31,-.035,pawMat);return pivot}
function createPetBase(type,colors){
  const g=new THREE.Group(),bodyMat=mat(colors.body,.94),detailMat=mat(colors.detail,.94),muzzleMat=mat(colors.muzzle,.94),dog=type==='dog';
  // Torso, shoulder and haunch volumes create a believable silhouette from the side.
  const torso=ellipsoid(g,dog?.34:.30,0,.49,.08,bodyMat,dog?[1.58,.78,.88]:[1.55,.75,.82],24);
  const shoulder=ellipsoid(g,dog?.23:.205,0,.52,-.27,bodyMat,[1.03,1.22,.88],20);
  const haunch=ellipsoid(g,dog?.245:.22,0,.49,.34,bodyMat,[1.08,1.08,.92],20);
  const neck=new THREE.Group();neck.position.set(0,.59,-.36);g.add(neck);ellipsoid(neck,dog?.17:.15,0,0,0,bodyMat,[.95,1.15,.86],18);
  const head=new THREE.Group();head.position.set(0,.66,-.55);g.add(head);ellipsoid(head,dog?.225:.205,0,0,0,bodyMat,dog?[1.04,.98,.93]:[.98,.98,.90],22);
  ellipsoid(head,dog?.108:.086,0,-.055,-.205,muzzleMat,dog?[1.28,.72,1.14]:[1.16,.66,1.05],16);ellipsoid(head,.046,0,-.025,-.287,nose,[1.08,.72,.8],12);
  for(const x of[-.092,.092]){ellipsoid(head,.030,x,.067,-.19,eye,[1,.98,.58],10);ellipsoid(head,.009,x+.008,.078,-.205,white,[1,1,.4],8)}
  let ears=[],tail;
  if(dog){
    const le=ellipsoid(head,.135,-.195,.08,.02,detailMat,[.62,1.25,.48],16),re=ellipsoid(head,.135,.195,.08,.02,detailMat,[.62,1.25,.48],16);le.rotation.z=-.25;re.rotation.z=.25;ears=[le,re];
    tail=new THREE.Group();tail.position.set(0,.57,.55);g.add(tail);const t1=capsule(tail,.043,.31,0,.10,.06,bodyMat);t1.rotation.x=-.92;const t2=capsule(tail,.034,.28,0,.27,.19,bodyMat);t2.rotation.x=-.50;
  }else{
    ears=[cone(head,.102,.25,-.15,.22,.015,bodyMat,[0,0,-.08]),cone(head,.102,.25,.15,.22,.015,bodyMat,[0,0,.08])];
    tail=new THREE.Group();tail.position.set(0,.50,.54);const t1=capsule(tail,.037,.38,0,.12,.10,bodyMat);t1.rotation.x=-1.00;const t2=capsule(tail,.032,.38,0,.25,.31,bodyMat);t2.rotation.x=-.52;const t3=capsule(tail,.026,.30,0,.38,.53,bodyMat);t3.rotation.x=-.10;g.add(tail);
    for(let s=-1;s<=1;s+=2)for(let i=0;i<3;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(.0042,.0042,.30,5),detailMat);w.rotation.z=Math.PI/2;w.position.set(s*.13,-.055,-.265);w.rotation.y=(i-1)*.12;head.add(w)}
  }
  const legs=[makePetLeg(g,-.20,-.15,bodyMat,detailMat,false),makePetLeg(g,.20,-.15,bodyMat,detailMat,false),makePetLeg(g,-.22,.31,bodyMat,detailMat,true),makePetLeg(g,.22,.31,bodyMat,detailMat,true)];
  g.userData={petType:type,animatedParts:{head,ears,tail,legs},torso,shoulder,haunch,motionPhase:Math.random()*Math.PI*2};return g;
}
export function createCuteDog(variant='golden'){const p={golden:{body:0xd9a66f,detail:0xb97949,muzzle:0xe9c79d},cream:{body:0xdfd0b7,detail:0xbda17f,muzzle:0xeee1ce},brown:{body:0x916044,detail:0x67412f,muzzle:0xb98b6d}};return createPetBase('dog',p[variant]||p.golden)}
export function createCuteCat(variant='gray'){const p={gray:{body:0xaeb4bd,detail:0x737a85,muzzle:0xd5d8dd},orange:{body:0xd99a61,detail:0xad693e,muzzle:0xeac29a},white:{body:0xe9e9e5,detail:0x968b83,muzzle:0xf7f7f4}};return createPetBase('cat',p[variant]||p.gray)}

export function animateCuteCharacter(group,time,moving=false,speed=1){
  const p=group?.userData?.animatedParts;if(!p)return;const phase=group.userData.motionPhase||0;
  const rate=.0105*Math.max(.65,speed),step=Math.sin(time*rate+phase),swing=moving?step*.43:Math.sin(time*.0026+phase)*.016;
  if(p.leftArm)p.leftArm.rotation.x=swing;if(p.rightArm)p.rightArm.rotation.x=-swing;
  if(p.leftLeg)p.leftLeg.rotation.x=-swing*.82;if(p.rightLeg)p.rightLeg.rotation.x=swing*.82;
  if(p.head){p.head.rotation.z=moving?Math.sin(time*rate*.5+phase)*.018:Math.sin(time*.0018+phase)*.012;p.head.rotation.x=moving?-.025+Math.abs(step)*.012:Math.sin(time*.0016+phase)*.015}
  if(Array.isArray(p.legs))p.legs.forEach((leg,i)=>{const diagonal=i===0||i===3?0:Math.PI;leg.rotation.x=moving?Math.sin(time*rate+phase+diagonal)*.31:0});
  if(p.tail)p.tail.rotation.y=Math.sin(time*(moving?.0105:.0048)+phase)*(group.userData.petType==='dog'?.34:.22);
  if(Array.isArray(p.ears))p.ears.forEach((ear,i)=>ear.rotation.x=(moving?Math.abs(step):0)*.035*(i?1:-1));
}
