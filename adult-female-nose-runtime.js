import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female face pass 4: replace only the legacy nose.
// Eyes, brows, mouth, cheeks, lashes and hair intentionally remain untouched.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function replaceAdultFemaleNose(character){
  const face=character?.userData?.face;
  if(!face)return character;

  const legacy=[];
  face.traverse(o=>{if(o!==face&&o.name==='agcb-nose')legacy.push(o)});
  const sourceMaterial=legacy[0]?.material;
  for(const o of legacy)o.parent?.remove(o);

  const skinMat=sourceMaterial?.clone?.()||new THREE.MeshStandardMaterial({color:0xf2c5a5,roughness:.9});
  skinMat.roughness=.90;

  // Pass 1: restrained bridge + soft tip. The bridge is narrow and shallow so it
  // reads from 3/4 view without becoming a toy-like protruding peg.
  const bridge=new THREE.Mesh(new THREE.SphereGeometry(.020,18,12),skinMat);
  bridge.name='agcb-adult-female-nose-bridge-v1';
  bridge.scale.set(.52,1.62,.44);
  bridge.position.set(0,.000,-.0615);
  bridge.rotation.x=-.04;
  face.add(bridge);

  const tip=new THREE.Mesh(new THREE.SphereGeometry(.0185,18,12),skinMat);
  tip.name='agcb-adult-female-nose-tip-v1';
  tip.scale.set(.86,.72,.68);
  tip.position.set(0,-.0265,-.0705);
  face.add(tip);

  // Tiny alar volumes keep the base from collapsing to a single dot at gameplay distance.
  for(const side of[-1,1]){
    const ala=new THREE.Mesh(new THREE.SphereGeometry(.0095,14,9),skinMat);
    ala.name=side<0?'agcb-adult-female-nose-ala-l-v1':'agcb-adult-female-nose-ala-r-v1';
    ala.scale.set(.82,.55,.50);
    ala.position.set(side*.0115,-.0285,-.0665);
    face.add(ala);
  }

  face.userData.noseGeometry='adult-female-soft-bridge-tip-v1';
  face.userData.noseFit={bridgeY:.000,bridgeZ:-.0615,tipY:-.0265,tipZ:-.0705};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?replaceAdultFemaleNose(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_NOSE={version:1,scope:'adult-female-nose-only',geometry:'soft-bridge-tip-v1',loaded:true};
