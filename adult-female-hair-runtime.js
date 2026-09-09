import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female hair pass 1: refine only crown silhouette, side locks and fringe face fit.
// Face geometry and all non-adult-female variants intentionally remain untouched.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function addLock(parent,name,material,points,radius=.018){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,18,radius,7,false),material);
  mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}

function refineAdultFemaleHair(character){
  const hair=character?.userData?.hair;
  if(!hair)return character;

  const legacy=[];
  hair.traverse(o=>{if(o!==hair&&(o.name==='agcb-hair-cap'||o.name.startsWith('agcb-hair-fringe-')||o.name==='agcb-hair-curtain-l'||o.name==='agcb-hair-curtain-r'))legacy.push(o)});
  for(const o of legacy)o.parent?.remove(o);

  const sourceMat=hair.children.find(o=>o.material)?.material;
  const hairMat=sourceMat||new THREE.MeshStandardMaterial({color:0x68483b,roughness:.88});
  const softMat=hairMat.clone();softMat.color=hairMat.color.clone().offsetHSL(0,.01,.045);

  const crown=new THREE.Mesh(new THREE.SphereGeometry(.255,24,16),hairMat);
  crown.name='agcb-adult-female-hair-crown-v1';
  crown.scale.set(1.02,.92,.86);crown.position.set(0,.095,.095);hair.add(crown);

  // Side locks trace the cheek line instead of floating away from the face.
  addLock(hair,'agcb-adult-female-side-lock-l-v1',hairMat,[[-.205,.145,-.205],[-.220,.055,-.215],[-.205,-.055,-.205],[-.185,-.145,-.175]],.019);
  addLock(hair,'agcb-adult-female-side-lock-r-v1',hairMat,[[.205,.145,-.205],[.220,.055,-.215],[.205,-.055,-.205],[.185,-.145,-.175]],.019);

  // Four-piece soft fringe with a slightly open center; outer pieces are longer.
  const fringeSpecs=[
    {name:'l2',x:-.145,len:.155,tilt:-.18,mat:hairMat},
    {name:'l1',x:-.060,len:.125,tilt:-.07,mat:softMat},
    {name:'r1',x:.060,len:.122,tilt:.07,mat:softMat},
    {name:'r2',x:.145,len:.152,tilt:.18,mat:hairMat}
  ];
  for(const s of fringeSpecs){
    const y0=.195,z0=-.215;
    addLock(hair,`agcb-adult-female-fringe-${s.name}-v1`,s.mat,[[s.x,y0,z0],[s.x+s.tilt*.025,y0-s.len*.38,z0-.012],[s.x+s.tilt*.050,y0-s.len*.72,z0-.008],[s.x+s.tilt*.075,y0-s.len,z0+.004]],.016);
  }

  // Back curtain keeps an adult silhouette without adding extreme volume.
  addLock(hair,'agcb-adult-female-back-lock-l-v1',hairMat,[[-.185,.120,.145],[-.205,.010,.165],[-.195,-.120,.165],[-.170,-.235,.135]],.024);
  addLock(hair,'agcb-adult-female-back-lock-r-v1',hairMat,[[.185,.120,.145],[.205,.010,.165],[.195,-.120,.165],[.170,-.235,.135]],.024);

  hair.userData.adultFemaleHairGeometry='adult-female-soft-frame-hair-v1';
  hair.userData.adultFemaleHairFit={crown:[.255,.92,.86],sideLock:'cheek-trace',fringePieces:4};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?refineAdultFemaleHair(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_HAIR={version:1,scope:'adult-female-hair-only',geometry:'soft-frame-hair-v1',loaded:true};
