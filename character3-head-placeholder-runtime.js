// AG Character 3 - Head placeholder attachment scaffold
// Scope: test-only structural scaffold. Does not replace the production head art or UAL3 rig.
import * as THREE from 'three';

function findHead(root){
  let head=null;
  root?.traverse?.(o=>{ if(!head && o?.name==='Head') head=o; });
  return head;
}

function makePlaceholderGeometry(){
  const g=new THREE.SphereGeometry(0.12,24,16);
  g.translate(0,0.02,0);
  const count=g.attributes.position.count;
  const skinIndex=new Uint16Array(count*4);
  const skinWeight=new Float32Array(count*4);
  for(let i=0;i<count;i++){ skinIndex[i*4]=0; skinWeight[i*4]=1; }
  g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(skinIndex,4));
  g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(skinWeight,4));
  return g;
}

function attachHeadPlaceholder(root,{visible=true}={}){
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

  const material=new THREE.MeshStandardMaterial({transparent:true,opacity:.28,roughness:.55,metalness:0});
  const mesh=new THREE.SkinnedMesh(geometry,material);
  mesh.name='ag-c3-head-placeholder';
  mesh.frustumCulled=false;
  mesh.visible=!!visible;
  mesh.bind(sourceSkinned.skeleton,sourceSkinned.bindMatrix);
  root.add(mesh);

  return {
    ok:true,
    head,
    neck,
    neckName:neck.name||'',
    headIndex,
    skeleton:sourceSkinned.skeleton,
    placeholder:mesh,
    sourceSkinnedMesh:sourceSkinned,
    strategy:'SAME_SKELETON_SKINNED_HEAD_PLACEHOLDER'
  };
}

globalThis.__AGCB_C3_HEAD_PLACEHOLDER={version:1,findHead,attachHeadPlaceholder};
export{findHead,attachHeadPlaceholder};
