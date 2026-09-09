import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female face pass 2: refine only eye proportion and face fit.
// Brows, nose, mouth, cheeks, lashes and hair intentionally remain untouched.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function almondGeometry(width,height,depth,segments=24){
  const vertices=[];
  const indices=[];
  // Lens/almond outline: pointed inner/outer corners, restrained vertical opening.
  for(const z of[-depth/2,depth/2]){
    vertices.push(0,0,z);
    for(let i=0;i<segments;i++){
      const a=(i/segments)*Math.PI*2;
      const x=Math.cos(a)*width;
      const y=Math.sin(a)*height*(0.76+0.24*Math.abs(Math.cos(a)));
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

  const sclera=new THREE.MeshStandardMaterial({color:0xfffdf9,roughness:.80});
  const iris=new THREE.MeshStandardMaterial({color:0x5a4037,roughness:.60});
  const pupil=new THREE.MeshStandardMaterial({color:0x241d1d,roughness:.54});
  const shine=new THREE.MeshBasicMaterial({color:0xffffff});
  // Pass 2: slightly narrower spacing, less vertical opening and shallower projection
  // so the eyes sit into the authored adult-female face instead of reading as attached beads.
  const eyeGap=.099,eyeY=.037,eyeZ=-.078;
  for(const x of[-eyeGap,eyeGap]){
    const white=new THREE.Mesh(almondGeometry(.050,.0265,.0075),sclera);white.name='agcb-adult-female-eye-sclera-v2';white.position.set(x,eyeY,eyeZ);face.add(white);
    const irisMesh=new THREE.Mesh(new THREE.SphereGeometry(.0185,18,10),iris);irisMesh.name='agcb-adult-female-eye-iris-v2';irisMesh.scale.set(1,.91,.24);irisMesh.position.set(x,eyeY,-.0835);face.add(irisMesh);
    const pupilMesh=new THREE.Mesh(new THREE.SphereGeometry(.0088,14,8),pupil);pupilMesh.name='agcb-adult-female-eye-pupil-v2';pupilMesh.scale.set(.86,1,.22);pupilMesh.position.set(x,eyeY,-.0875);face.add(pupilMesh);
    const h=new THREE.Mesh(new THREE.SphereGeometry(.0038,10,6),shine);h.name='agcb-adult-female-eye-highlight-v2';h.position.set(x-.0055,eyeY+.0065,-.0905);face.add(h);
  }
  face.userData.eyeGeometry='adult-female-almond-face-fit-v2';
  face.userData.eyeFit={gap:eyeGap,y:eyeY,z:eyeZ,width:.050,height:.0265};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?replaceAdultFemaleEyes(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_EYES={version:2,scope:'adult-female-eyes-only',geometry:'almond-face-fit-v2',loaded:true};
