import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female face pass 1: replace only the legacy round eye pieces.
// Brows, nose, mouth, cheeks, lashes and hair intentionally remain untouched.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function almondGeometry(width,height,depth,segments=20){
  const vertices=[];
  const indices=[];
  // Lens/almond outline: pointed inner/outer corners, soft upper/lower arcs.
  for(const z of[-depth/2,depth/2]){
    vertices.push(0,0,z);
    for(let i=0;i<segments;i++){
      const a=(i/segments)*Math.PI*2;
      const x=Math.cos(a)*width;
      const y=Math.sin(a)*height*(0.78+0.22*Math.abs(Math.cos(a)));
      vertices.push(x,y,z);
    }
  }
  const front=0,back=segments+1;
  for(let i=0;i<segments;i++){
    const n=(i+1)%segments;
    indices.push(front,1+i,1+n);
    indices.push(back,back+1+n,back+1+i);
    indices.push(1+i,back+1+i,1+n,1+n,back+1+i,back+1+n);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  g.setIndex(indices);g.computeVertexNormals();return g;
}

function replaceAdultFemaleEyes(character){
  const face=character?.userData?.face;
  if(!face)return character;
  const remove=[];
  face.traverse(o=>{if(o!==face&&['agcb-eye-white','agcb-eye-pupil','agcb-eye-highlight'].includes(o.name))remove.push(o)});
  for(const o of remove)o.parent?.remove(o);

  const sclera=new THREE.MeshStandardMaterial({color:0xfffdf9,roughness:.78});
  const iris=new THREE.MeshStandardMaterial({color:0x5a4037,roughness:.58});
  const pupil=new THREE.MeshStandardMaterial({color:0x241d1d,roughness:.52});
  const shine=new THREE.MeshBasicMaterial({color:0xffffff});
  const eyeGap=.102,eyeY=.036;
  for(const x of[-eyeGap,eyeGap]){
    const white=new THREE.Mesh(almondGeometry(.052,.030,.010),sclera);white.name='agcb-adult-female-eye-sclera-v1';white.position.set(x,eyeY,-.080);face.add(white);
    const irisMesh=new THREE.Mesh(new THREE.SphereGeometry(.020,16,10),iris);irisMesh.name='agcb-adult-female-eye-iris-v1';irisMesh.scale.set(1,.92,.34);irisMesh.position.set(x,eyeY,-.089);face.add(irisMesh);
    const pupilMesh=new THREE.Mesh(new THREE.SphereGeometry(.010,14,8),pupil);pupilMesh.name='agcb-adult-female-eye-pupil-v1';pupilMesh.scale.set(.88,1,.30);pupilMesh.position.set(x,eyeY,-.096);face.add(pupilMesh);
    const h=new THREE.Mesh(new THREE.SphereGeometry(.0046,10,6),shine);h.name='agcb-adult-female-eye-highlight-v1';h.position.set(x-.006,eyeY+.008,-.101);face.add(h);
  }
  face.userData.eyeGeometry='adult-female-almond-v1';
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?replaceAdultFemaleEyes(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_EYES={version:1,scope:'adult-female-eyes-only',loaded:true};
