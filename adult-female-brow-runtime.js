import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female face pass 3: replace only the legacy eyebrows.
// Eyes, nose, mouth, cheeks, lashes and hair intentionally remain untouched.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function browGeometry(length=.082,thickness=.010,depth=.007,segments=10,side=1){
  const vertices=[];
  const indices=[];
  const rings=[];
  for(let i=0;i<=segments;i++){
    const t=i/segments;
    const x=(t-.5)*length;
    // Soft adult-female arch: inner brow lower/full, gentle peak near outer third,
    // then a light taper toward the tail.
    const arch=Math.sin(Math.PI*t)*.018 + Math.max(0,t-.62)*.010;
    const taper=1-.42*Math.max(0,(t-.58)/.42);
    const half=thickness*.5*taper;
    rings.push(vertices.length/3);
    vertices.push(x,arch-half,-depth/2,x,arch+half,-depth/2,x,arch-half,depth/2,x,arch+half,depth/2);
  }
  for(let i=0;i<segments;i++){
    const a=rings[i],b=rings[i+1];
    indices.push(a,a+1,b,a+1,b+1,b);
    indices.push(a+2,b+2,a+3,a+3,b+2,b+3);
    indices.push(a,a+2,b,a+2,b+2,b);
    indices.push(a+1,b+1,a+3,a+3,b+1,b+3);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  g.setIndex(indices);g.computeVertexNormals();
  if(side<0)g.scale(-1,1,1);
  return g;
}

function replaceAdultFemaleBrows(character){
  const face=character?.userData?.face;
  if(!face)return character;
  const remove=[];
  face.traverse(o=>{if(o!==face&&o.name==='agcb-brow')remove.push(o)});
  for(const o of remove)o.parent?.remove(o);

  const browMat=new THREE.MeshStandardMaterial({color:0x4a3432,roughness:.86});
  const gap=.101,browY=.119,browZ=-.079;
  for(const side of[-1,1]){
    const brow=new THREE.Mesh(browGeometry(.084,.0105,.0065,12,side),browMat);
    brow.name=side<0?'agcb-adult-female-brow-l-v1':'agcb-adult-female-brow-r-v1';
    brow.position.set(side*gap,browY,browZ);
    brow.rotation.z=side<0?-.045:.045;
    face.add(brow);
  }
  face.userData.browGeometry='adult-female-soft-arch-v1';
  face.userData.browFit={gap,y:browY,z:browZ,length:.084,thickness:.0105};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?replaceAdultFemaleBrows(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_BROWS={version:1,scope:'adult-female-brows-only',geometry:'soft-arch-v1',loaded:true};
