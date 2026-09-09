// AG Character 3 - Adult female geometric head attachment scaffold
// Scope: test-only structural scaffold. Does not replace the production head art or UAL3 rig.
import * as THREE from 'three';

function findHead(root){
  let head=null;
  root?.traverse?.(o=>{ if(!head && o?.name==='Head') head=o; });
  return head;
}

function applySingleHeadSkin(geometry,headIndex){
  const count=geometry.attributes.position.count;
  const skinIndex=new Uint16Array(count*4);
  const skinWeight=new Float32Array(count*4);
  for(let i=0;i<count;i++){
    skinIndex[i*4]=headIndex;
    skinWeight[i*4]=1;
  }
  geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(skinIndex,4));
  geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(skinWeight,4));
  return geometry;
}

function makePlaceholderGeometry(){
  // Start from a sphere, then reshape it into a simple adult-female stylized head.
  // This stage intentionally contains no eyes, mouth, nose or hair.
  const g=new THREE.SphereGeometry(0.12,32,24);
  const p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    let x=p.getX(i), y=p.getY(i), z=p.getZ(i);

    // Overall adult-female head proportions: slightly narrower than tall,
    // with reduced depth versus a pure sphere.
    x*=0.92;
    y*=1.08;
    z*=0.90;

    // Lower-face taper. Keep cheeks softer, then narrow progressively into chin.
    const ny=(y/0.1296); // normalized against post-scale vertical radius
    if(ny<0){
      const lower=Math.min(1,Math.max(0,-ny));
      const taper=1-(0.22*lower*lower);
      x*=taper;

      // Slightly flatten the lower front/back volume so the jaw reads less spherical.
      z*=1-(0.08*lower);

      // Gentle chin extension without making it pointy.
      if(ny<-0.55) y-=0.008*((-ny-0.55)/0.45);
    }

    // Soft cheek fullness around the lower-middle face.
    if(ny>-0.45 && ny<0.15){
      const cheek=1-Math.min(1,Math.abs(ny+0.12)/0.33);
      x*=1+(0.035*cheek);
    }

    p.setXYZ(i,x,y+0.022,z);
  }
  p.needsUpdate=true;
  g.computeVertexNormals();
  g.computeBoundingBox();
  g.computeBoundingSphere();

  // Placeholder vertices are later remapped to the real Head bone index.
  applySingleHeadSkin(g,0);
  g.userData={
    stage:'ADULT_FEMALE_GEOMETRIC_TEST_HEAD',
    containsFaceFeatures:false,
    containsHair:false,
    intent:'silhouette-only'
  };
  return g;
}

function makeFaceGuideMesh(geometry,material,skeleton,bindMatrix,headIndex,name){
  applySingleHeadSkin(geometry,headIndex);
  const mesh=new THREE.SkinnedMesh(geometry,material);
  mesh.name=name;
  mesh.frustumCulled=false;
  mesh.bind(skeleton,bindMatrix);
  return mesh;
}

function attachFaceLandmarkGuides(root,{skeleton,bindMatrix,headIndex,frontSign=1,visible=true}={}){
  const sign=frontSign<0?-1:1;
  const material=new THREE.MeshBasicMaterial({transparent:true,opacity:.72,depthTest:false});
  const eyeY=0.060;
  const noseY=0.012;
  const mouthY=-0.030;
  const frontZ=0.103*sign;

  // Horizontal eye-height reference. It is a guide only, not an eye mesh.
  const eyeGeo=new THREE.BoxGeometry(0.155,0.003,0.003);
  eyeGeo.translate(0,eyeY,frontZ);
  const eyeLine=makeFaceGuideMesh(eyeGeo,material,skeleton,bindMatrix,headIndex,'ag-c3-face-guide-eye-line');

  // Nose-tip landmark.
  const noseGeo=new THREE.SphereGeometry(0.006,12,8);
  noseGeo.translate(0,noseY,(0.112*sign));
  const nosePoint=makeFaceGuideMesh(noseGeo,material,skeleton,bindMatrix,headIndex,'ag-c3-face-guide-nose-tip');

  // Horizontal mouth-height reference. It is a guide only, not a mouth mesh.
  const mouthGeo=new THREE.BoxGeometry(0.095,0.003,0.003);
  mouthGeo.translate(0,mouthY,(0.106*sign));
  const mouthLine=makeFaceGuideMesh(mouthGeo,material,skeleton,bindMatrix,headIndex,'ag-c3-face-guide-mouth-line');

  const guides=[eyeLine,nosePoint,mouthLine];
  for(const guide of guides){
    guide.visible=!!visible;
    guide.renderOrder=999;
    root.add(guide);
  }

  return {
    stage:'ADULT_FEMALE_FACE_LANDMARK_GUIDES_V1',
    frontSign:sign,
    eyeY,
    noseY,
    mouthY,
    eyeLine,
    nosePoint,
    mouthLine,
    guides
  };
}

function attachHeadPlaceholder(root,{visible=true,showFaceGuides=true,frontSign=1}={}){
  const head=findHead(root);
  if(!head) return {ok:false,reason:'HEAD_NOT_FOUND'};
  const neck=head.parent||null;
  if(!neck) return {ok:false,reason:'HEAD_PARENT_NOT_FOUND'};

  // Test scaffold uses the already cloned Technical Base skeleton instance.
  let sourceSkinned=null;
  root.traverse(o=>{ if(!sourceSkinned && o?.isSkinnedMesh && o.skeleton) sourceSkinned=o; });
  if(!sourceSkinned) return {ok:false,reason:'SKINNED_MESH_NOT_FOUND',head,neck};

  const bones=sourceSkinned.skeleton.bones;
  const headIndex=bones.indexOf(head);
  if(headIndex<0) return {ok:false,reason:'HEAD_NOT_IN_SKELETON',head,neck};

  const geometry=makePlaceholderGeometry();
  const si=geometry.getAttribute('skinIndex');
  for(let i=0;i<si.count;i++) si.setX(i,headIndex);
  si.needsUpdate=true;

  const material=new THREE.MeshStandardMaterial({transparent:true,opacity:.32,roughness:.55,metalness:0});
  const mesh=new THREE.SkinnedMesh(geometry,material);
  mesh.name='ag-c3-head-placeholder';
  mesh.frustumCulled=false;
  mesh.visible=!!visible;
  mesh.bind(sourceSkinned.skeleton,sourceSkinned.bindMatrix);
  root.add(mesh);

  const faceGuides=attachFaceLandmarkGuides(root,{
    skeleton:sourceSkinned.skeleton,
    bindMatrix:sourceSkinned.bindMatrix,
    headIndex,
    frontSign,
    visible:showFaceGuides
  });

  return {
    ok:true,
    head,
    neck,
    neckName:neck.name||'',
    headIndex,
    skeleton:sourceSkinned.skeleton,
    placeholder:mesh,
    faceGuides,
    sourceSkinnedMesh:sourceSkinned,
    stage:'ADULT_FEMALE_GEOMETRIC_TEST_HEAD',
    strategy:'SAME_SKELETON_SKINNED_HEAD_PLACEHOLDER'
  };
}

globalThis.__AGCB_C3_HEAD_PLACEHOLDER={version:3,findHead,attachHeadPlaceholder,attachFaceLandmarkGuides};
export{findHead,attachHeadPlaceholder,attachFaceLandmarkGuides};
