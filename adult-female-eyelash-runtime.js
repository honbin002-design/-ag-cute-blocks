import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female face pass 7: replace only legacy lashes.
// Eyes, brows, nose, mouth, cheeks/jaw and hair intentionally remain untouched.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function lashGeometry(length=.034,thickness=.0032,segments=5){
  const pts=[];
  for(let i=0;i<=segments;i++){
    const t=i/segments;
    // slight upward curl with tapered outer tip
    const x=t*length;
    const y=Math.sin(t*Math.PI*.72)*.006 + t*.004;
    pts.push(new THREE.Vector3(x,y,0));
  }
  const curve=new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve,segments*2,thickness,5,false);
}

function replaceAdultFemaleLashes(character){
  const face=character?.userData?.face;
  if(!face)return character;

  const legacy=[];
  face.traverse(o=>{if(o!==face&&o.name==='agcb-eyelash')legacy.push(o)});
  for(const o of legacy)o.parent?.remove(o);

  const lashMat=new THREE.MeshStandardMaterial({color:0x34272a,roughness:.66});
  const eyeGap=.099,baseY=.064,baseZ=-.087;
  // Three lashes per eye, with the outer lash longest and most lifted.
  for(const side of[-1,1]){
    const outerDir=side<0?-1:1;
    const specs=[
      {dx:.019,dy:.001,len:.020,rot:.15},
      {dx:.035,dy:.003,len:.027,rot:.25},
      {dx:.049,dy:.006,len:.036,rot:.37}
    ];
    specs.forEach((s,i)=>{
      const lash=new THREE.Mesh(lashGeometry(s.len,.0026+i*.00025,5),lashMat);
      lash.name=`agcb-adult-female-eyelash-${side<0?'l':'r'}-${i+1}-v1`;
      lash.position.set(side*eyeGap + outerDir*s.dx,baseY+s.dy,baseZ);
      lash.rotation.z=side<0?Math.PI-s.rot:s.rot;
      lash.rotation.y=side<0?-.05:.05;
      face.add(lash);
    });
  }

  face.userData.eyelashGeometry='adult-female-fanned-lashes-v1';
  face.userData.eyelashFit={eyeGap,baseY,baseZ,countPerEye:3};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?replaceAdultFemaleLashes(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_EYELASHES={version:1,scope:'adult-female-eyelashes-only',geometry:'fanned-lashes-v1',loaded:true};
