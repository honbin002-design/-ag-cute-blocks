import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female face pass 6: refine only cheek/jaw silhouette and softness.
// Eyes, brows, nose, mouth, lashes and hair intentionally remain untouched.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function contourGeometry(profile,segments=28){
  const pts=profile.map(([x,y])=>new THREE.Vector2(x,y));
  const shape=new THREE.Shape();
  shape.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++)shape.lineTo(pts[i].x,pts[i].y);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape,{depth:.010,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.006,bevelThickness:.004,curveSegments:segments});
}

function refineAdultFemaleContour(character){
  const face=character?.userData?.face;
  if(!face)return character;

  // A restrained lower-face skin shell narrows the jaw gradually toward a soft chin.
  // It is intentionally shallow so the authored head remains the structural base.
  const skinSource=face.children.find(o=>o.name==='agcb-nose')?.material;
  const skinMat=skinSource||new THREE.MeshStandardMaterial({color:0xf2c5a5,roughness:.90});
  const shell=new THREE.Mesh(contourGeometry([
    [-.205,.020],[-.188,-.045],[-.150,-.105],[-.092,-.148],[0,-.166],
    [.092,-.148],[.150,-.105],[.188,-.045],[.205,.020],[.145,.055],[0,.068],[-.145,.055]
  ]),skinMat);
  shell.name='agcb-adult-female-cheek-jaw-shell-v1';
  shell.position.set(0,-.010,-.050);
  shell.rotation.x=Math.PI;
  face.add(shell);

  // Keep cheek volume subtle and closer to the eyes; these replace only the legacy blush pads.
  const oldCheeks=[];
  face.traverse(o=>{if(o!==face&&['agcb-cheek-l','agcb-cheek-r'].includes(o.name))oldCheeks.push(o)});
  for(const o of oldCheeks)o.parent?.remove(o);
  const cheekMat=new THREE.MeshBasicMaterial({color:0xf09b98,transparent:true,opacity:.30});
  for(const x of[-.145,.145]){
    const cheek=new THREE.Mesh(new THREE.SphereGeometry(.028,14,8),cheekMat);
    cheek.name=x<0?'agcb-adult-female-cheek-soft-l-v1':'agcb-adult-female-cheek-soft-r-v1';
    cheek.scale.set(1.18,.58,.20);
    cheek.position.set(x,-.028,-.074);
    face.add(cheek);
  }

  face.userData.contourGeometry='adult-female-soft-cheek-jaw-v1';
  face.userData.contourFit={jawWidth:.188,chinY:-.166,cheekX:.145};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?refineAdultFemaleContour(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_FACE_CONTOUR={version:1,scope:'adult-female-cheek-jaw-only',geometry:'soft-cheek-jaw-v1',loaded:true};
