import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const mat=(color,roughness=.82)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.02});
const skin=mat(0xf4c6a8,.9);
const eye=mat(0x28323c,.65);
const white=mat(0xffffff,.78);
const shoe=mat(0x6f7d91,.8);

function ellipsoid(parent,r,x,y,z,color,scale=[1,1,1],segments=20){
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,segments,Math.max(12,segments-6)),typeof color==='number'?mat(color):color);
  m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function roundedLimb(parent,r,length,x,y,z,color,axis='y'){
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,length-r*2),6,12),typeof color==='number'?mat(color):color);
  if(axis==='x')body.rotation.z=Math.PI/2;if(axis==='z')body.rotation.x=Math.PI/2;body.castShadow=true;g.add(body);return g;
}

export function createCuteChildAvatar(style='girl',options={}){
  const g=new THREE.Group();
  const girl=style==='girl';
  const hairColor=options.hairColor??(girl?0x5a4038:0x493832);
  const shirtColor=options.shirtColor??(girl?0xf39ab8:0x6fb8e8);
  const bottomColor=options.bottomColor??(girl?0x8174b8:0x4d6f98);
  const hair=mat(hairColor,.92),shirt=mat(shirtColor,.86),bottom=mat(bottomColor,.88);

  // Slightly oversized head + soft proportions: cute child, not voxel/block-shaped.
  ellipsoid(g,.39,0,1.78,0,skin,[1,.98,.92],24);
  ellipsoid(g,.405,0,1.89,.015,hair,[1,.68,.93],24);
  if(girl){
    ellipsoid(g,.19,-.29,1.66,.04,hair,[.85,1.45,.75],18);
    ellipsoid(g,.19,.29,1.66,.04,hair,[.85,1.45,.75],18);
  }else{
    for(let i=0;i<5;i++)ellipsoid(g,.12,(i-2)*.12,2.05,-.01,hair,[1,.8,1],14);
  }

  // Face.
  ellipsoid(g,.042,-.135,1.82,-.36,eye,[1,.9,.5],12);
  ellipsoid(g,.042,.135,1.82,-.36,eye,[1,.9,.5],12);
  ellipsoid(g,.013,-.12,1.835,-.386,white,[1,1,.4],10);
  ellipsoid(g,.013,.15,1.835,-.386,white,[1,1,.4],10);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.075,.012,8,18,Math.PI),mat(0xb96868,.78));smile.rotation.z=Math.PI;smile.position.set(0,1.68,-.365);g.add(smile);
  ellipsoid(g,.055,-.25,1.72,-.335,0xf5a8a7,[1.2,.55,.45],12);ellipsoid(g,.055,.25,1.72,-.335,0xf5a8a7,[1.2,.55,.45],12);

  // Torso, arms and hands.
  ellipsoid(g,.42,0,1.14,0,shirt,[.78,1.08,.58],22);
  const leftArm=roundedLimb(g,.105,.62,-.43,1.15,0,shirt,'y');leftArm.rotation.z=-.12;
  const rightArm=roundedLimb(g,.105,.62,.43,1.15,0,shirt,'y');rightArm.rotation.z=.12;
  ellipsoid(g,.12,-.47,.80,0,skin,[.9,1,.9],14);ellipsoid(g,.12,.47,.80,0,skin,[.9,1,.9],14);

  // Shorts/skirt and legs.
  if(girl){const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.34,.42,.34,18),bottom);skirt.position.y=.75;skirt.castShadow=true;g.add(skirt)}
  else ellipsoid(g,.36,0,.76,0,bottom,[1,.55,.7],18);
  roundedLimb(g,.12,.58,-.18,.44,0,skin,'y');roundedLimb(g,.12,.58,.18,.44,0,skin,'y');
  ellipsoid(g,.16,-.18,.10,-.05,shoe,[1,0.62,1.45],16);ellipsoid(g,.16,.18,.10,-.05,shoe,[1,.62,1.45],16);

  g.userData={avatarStyle:style,animatedParts:{leftArm,rightArm}};
  return g;
}

function createPetBase(type,colors){
  const g=new THREE.Group();
  const bodyMat=mat(colors.body,.94),detailMat=mat(colors.detail,.94),noseMat=mat(0x2d3035,.72);
  const dog=type==='dog';
  ellipsoid(g,dog?.38:.34,0,.46,0,bodyMat,[1.32,.82,.92],22);
  ellipsoid(g,dog?.29:.27,0,.64,-.39,bodyMat,[1,.96,.94],22);
  for(const x of[-.22,.22]){roundedLimb(g,.075,.34,x,.20,-.14,bodyMat,'y');roundedLimb(g,.075,.34,x,.20,.18,bodyMat,'y')}
  ellipsoid(g,.075,0,.62,-.68,noseMat,[1.05,.7,.8],12);
  ellipsoid(g,.038,-.11,.72,-.62,eye,[1,1,.55],10);ellipsoid(g,.038,.11,.72,-.62,eye,[1,1,.55],10);

  if(dog){
    const le=ellipsoid(g,.18,-.23,.79,-.34,detailMat,[.55,1.25,.4],16);le.rotation.z=-.28;
    const re=ellipsoid(g,.18,.23,.79,-.34,detailMat,[.55,1.25,.4],16);re.rotation.z=.28;
    const tail=roundedLimb(g,.055,.42,0,.60,.48,bodyMat,'z');tail.rotation.x=-.72;
    ellipsoid(g,.11,0,.58,-.55,colors.muzzle,[1.45,.75,.65],14);
    g.userData.animatedParts={tail};
  }else{
    const earGeo=new THREE.ConeGeometry(.13,.28,4);
    for(const x of[-.18,.18]){const e=new THREE.Mesh(earGeo,bodyMat);e.position.set(x,.94,-.34);e.rotation.y=Math.PI/4;e.castShadow=true;g.add(e)}
    const tail=new THREE.Mesh(new THREE.TorusGeometry(.28,.05,8,18,Math.PI*1.35),bodyMat);tail.position.set(0,.55,.47);tail.rotation.set(Math.PI/2,.3,0);tail.castShadow=true;g.add(tail);
    for(let s=-1;s<=1;s+=2)for(let i=0;i<3;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(.007,.007,.35,6),detailMat);w.rotation.z=Math.PI/2;w.position.set(s*.16,.60,-.66);w.rotation.y=(i-1)*.13;g.add(w)}
    g.userData.animatedParts={tail};
  }
  g.userData.petType=type;return g;
}

export function createCuteDog(variant='golden'){
  const palettes={golden:{body:0xe8b579,detail:0xc98a52,muzzle:0xf1d3ad},cream:{body:0xead9bd,detail:0xc9aa83,muzzle:0xf4e5cf},brown:{body:0x9d6746,detail:0x74452f,muzzle:0xc99a76}};
  return createPetBase('dog',palettes[variant]||palettes.golden);
}

export function createCuteCat(variant='gray'){
  const palettes={gray:{body:0xb9bdc5,detail:0x777d88,muzzle:0xd9dce1},orange:{body:0xe2a267,detail:0xb96f3f,muzzle:0xf0c79f},white:{body:0xeeeeea,detail:0x9b8f86,muzzle:0xffffff}};
  return createPetBase('cat',palettes[variant]||palettes.gray);
}

export function animateCuteCharacter(group,time,moving=false){
  const p=group?.userData?.animatedParts;if(!p)return;
  const swing=moving?Math.sin(time*.012)*.42:Math.sin(time*.003)*.035;
  if(p.leftArm)p.leftArm.rotation.x=swing;
  if(p.rightArm)p.rightArm.rotation.x=-swing;
  if(p.tail)p.tail.rotation.y=Math.sin(time*.008)*.42;
}
