import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female face pass 5: replace only the legacy mouth.
// Eyes, brows, nose, cheeks, lashes and hair intentionally remain untouched.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function lipCurveGeometry(width=.084,height=.020,depth=.006,segments=18,upper=true){
  const pts=[];
  for(let i=0;i<=segments;i++){
    const t=i/segments;
    const x=(t-.5)*width;
    const arch=Math.sin(Math.PI*t);
    const y=upper ? arch*height*.58 : -arch*height*.42;
    pts.push(new THREE.Vector3(x,y,0));
  }
  const curve=new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve,segments,depth,6,false);
}

function replaceAdultFemaleMouth(character){
  const face=character?.userData?.face;
  if(!face)return character;

  const legacy=[];
  face.traverse(o=>{
    if(o!==face&&o.geometry?.type==='TorusGeometry'&&Math.abs((o.position?.y||0)+.070)<.02)legacy.push(o);
  });
  for(const o of legacy)o.parent?.remove(o);

  const lipMat=new THREE.MeshStandardMaterial({color:0xa55468,roughness:.78});
  const creaseMat=new THREE.MeshStandardMaterial({color:0x6d3644,roughness:.88});
  const mouthY=-.0705,mouthZ=-.064;

  const upper=new THREE.Mesh(lipCurveGeometry(.082,.017,.0046,20,true),lipMat);
  upper.name='agcb-adult-female-upper-lip-v1';
  upper.position.set(0,mouthY+.004,mouthZ);
  face.add(upper);

  const lower=new THREE.Mesh(lipCurveGeometry(.080,.019,.0052,20,false),lipMat);
  lower.name='agcb-adult-female-lower-lip-v1';
  lower.position.set(0,mouthY-.002,mouthZ-.001);
  face.add(lower);

  const crease=new THREE.Mesh(new THREE.BoxGeometry(.058,.0038,.0034),creaseMat);
  crease.name='agcb-adult-female-mouth-crease-v1';
  crease.position.set(0,mouthY-.0015,mouthZ-.004);
  crease.rotation.z=.005;
  face.add(crease);

  face.userData.mouthGeometry='adult-female-soft-lips-v1';
  face.userData.mouthFit={y:mouthY,z:mouthZ,width:.082};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?replaceAdultFemaleMouth(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_MOUTH={version:1,scope:'adult-female-mouth-only',geometry:'soft-lips-v1',loaded:true};
