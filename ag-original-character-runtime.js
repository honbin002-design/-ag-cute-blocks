import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const AG_ORIGINAL_CHARACTER_SCHEMA=1;
const PAPER_DOLL_SLOTS=['bodyBase','underlayer','top','bottom','dress','shoes','hair','hat','glasses','accessory'];
const SKIN={light:0xf2c5a5,warm:0xc88963,deep:0x8c5a3c,rosy:0xf0b09e};
const HAIR={chestnut:0x68483b,black:0x2c2528,honey:0xb87845,plum:0x543c67};
const TOP={pink:0xf1a4b5,sky:0x74afd7,mint:0x8acbb9,lavender:0xbfa4e7};
const BOTTOM={denim:0x6685a3,navy:0x4e5c88,cream:0xe8c78b,rose:0xc87891};
const UNDERWEAR=0xf3a8b7;

function smoothUnion(a,b,k=.13){const h=Math.max(k-Math.abs(a-b),0);return Math.min(a,b)-h*h/(4*k)}
function ellipsoid(p,c,r){const dx=(p.x-c[0])/r[0],dy=(p.y-c[1])/r[1],dz=(p.z-c[2])/r[2];return (Math.sqrt(dx*dx+dy*dy+dz*dz)-1)*Math.min(r[0],r[1],r[2])}
function bodyField(p){
  const parts=[
    [[0,.84,0],[.39,.29,.28]],[[0,1.18,0],[.40,.52,.30]],[[0,1.43,0],[.36,.34,.29]],
    [[0,1.61,0],[.20,.18,.19]],[[0,1.84,0],[.43,.43,.37]],
    [[-.34,1.31,0],[.17,.30,.17]],[[.43,1.08,0],[.15,.28,.15]],
    [[.34,1.31,0],[.17,.30,.17]],[[ -.43,1.08,0],[.15,.28,.15]],
    [[-.44,.78,0],[.15,.14,.16]],[[.44,.78,0],[.15,.14,.16]],
    [[-.18,.64,0],[.21,.35,.22]],[[.18,.64,0],[.21,.35,.22]],
    [[-.18,.29,0],[.16,.32,.18]],[[.18,.29,0],[.16,.32,.18]],
    [[-.18,.07,-.08],[.20,.13,.28]],[[.18,.07,-.08],[.20,.13,.28]]
  ];
  let value=Infinity;for(const part of parts)value=smoothUnion(value,ellipsoid(p,part[0],part[1]));return value;
}
const TETS=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
const EDGES=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
function makeConnectedBodyGeometry(c){
  const nx=20,ny=31,nz=16,minX=-.78,maxX=.78,minY=-.08,maxY=2.30,minZ=-.62,maxZ=.58;
  const dx=(maxX-minX)/nx,dy=(maxY-minY)/ny,dz=(maxZ-minZ)/nz,verts=[],colors=[],indices=[];
  const sample=(ix,iy,iz)=>{const p={x:minX+ix*dx,y:minY+iy*dy,z:minZ+iz*dz};return {p,v:bodyField(p)}};
  const colorAt=p=>{
    let color=SKIN[c.skin]||SKIN.light;
    if(c.outfit==='underwear'){
      if(p.y>.87&&p.y<1.43&&Math.abs(p.x)<.33)color=TOP.pink;
      else if(p.y>.54&&p.y<.92&&Math.abs(p.x)<.36)color=UNDERWEAR;
    }else{
      if(p.y>.89&&p.y<1.48&&Math.abs(p.x)<.35)color=TOP[c.top]||TOP.pink;
      if(p.y>.52&&p.y<.95&&Math.abs(p.x)<.38)color=BOTTOM[c.bottom]||BOTTOM.denim;
      if(c.outfit==='dress'&&p.y>.52&&p.y<1.48&&Math.abs(p.x)<.42)color=TOP[c.top]||TOP.pink;
    }
    return new THREE.Color(color);
  };
  const pushPoint=(a,b)=>{
    const t=a.v/(a.v-b.v),p={x:a.p.x+(b.p.x-a.p.x)*t,y:a.p.y+(b.p.y-a.p.y)*t,z:a.p.z+(b.p.z-a.p.z)*t};
    const i=verts.length/3;verts.push(p.x,p.y,p.z);const col=colorAt(p);colors.push(col.r,col.g,col.b);return i;
  };
  for(let x=0;x<nx;x++)for(let y=0;y<ny;y++)for(let z=0;z<nz;z++){
    const q=[sample(x,y,z),sample(x+1,y,z),sample(x+1,y,z+1),sample(x,y,z+1),sample(x,y+1,z),sample(x+1,y+1,z),sample(x+1,y+1,z+1),sample(x,y+1,z+1)];
    for(const ids of TETS){
      const t=ids.map(i=>q[i]),inside=t.filter(v=>v.v<0).length;if(!inside||inside===4)continue;
      const cut=[];for(const [a,b] of EDGES)if((t[a].v<0)!==(t[b].v<0))cut.push(pushPoint(t[a],t[b]));
      if(cut.length>=3)for(let i=1;i<cut.length-1;i++)indices.push(cut[0],cut[i],cut[i+1]);
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
function bone(name,parent,x,y,z){const b=new THREE.Bone();b.name=name;b.position.set(x,y,z);(parent||null)?.add(b);return b}
function segmentDistance(p,a,b){const ab=new THREE.Vector3().subVectors(b,a),t=Math.max(0,Math.min(1,ab.dot(new THREE.Vector3().subVectors(p,a))/Math.max(ab.lengthSq(),.0001)));return p.distanceTo(new THREE.Vector3().copy(a).addScaledVector(ab,t))}
function bindConnectedBody(mesh,bones,positions){
  const pos=mesh.geometry.getAttribute('position'),si=[],sw=[];
  // Keep the continuous body intact while the authored skeleton remains available for poses.
  // The previous proximity weights were calculated in a different bind space and visibly tore the mesh.
  for(let i=0;i<pos.count;i++){si.push(0,0,0,0);sw.push(1,0,0,0)}
  mesh.geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(si,4));
  mesh.geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(sw,4));
  mesh.add(bones[0]);bones[0].updateMatrixWorld(true);mesh.updateMatrixWorld(true);
  const skeleton=new THREE.Skeleton(bones);mesh.bind(skeleton);mesh.pose();
  mesh.userData.skinningMode='root-stabilized-connected-v1';
  return skeleton;
}
function addFaceAndHair(visual,c,bones){
  const head=bones.head,face=new THREE.Group();face.name='agcb-original-face';head.add(face);face.position.set(0,.12,-.33);
  const skinMat=new THREE.MeshStandardMaterial({color:SKIN[c.skin]||SKIN.light,roughness:.88}),hairMat=new THREE.MeshStandardMaterial({color:HAIR[c.hair]||HAIR.chestnut,roughness:.9}),eyeMat=new THREE.MeshStandardMaterial({color:0x26333b,roughness:.55}),whiteMat=new THREE.MeshStandardMaterial({color:0xfffdf8,roughness:.8}),mouthMat=new THREE.MeshStandardMaterial({color:0x854a50,roughness:.8});
  const sphere=(parent,r,x,y,z,mat,scale)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,18,12),mat);m.position.set(x,y,z);if(scale)m.scale.set(...scale);m.castShadow=true;parent.add(m);return m};
  for(const x of[-.145,.145]){sphere(face,.11,x,.05,-.045,whiteMat,[1,.96,.38]);sphere(face,.061,x,.05,-.088,eyeMat,[1,1,.48]);sphere(face,.019,x-.018,.078,-.108,whiteMat,[1,1,.45])}
  sphere(face,.024,0,-.015,-.070,skinMat,[.8,.72,.65]);const smile=new THREE.Mesh(new THREE.TorusGeometry(.052,.009,7,16,Math.PI),mouthMat);smile.rotation.z=Math.PI;smile.position.set(0,-.075,-.075);face.add(smile);sphere(face,.042,-.22,-.045,-.058,new THREE.MeshBasicMaterial({color:0xf0a19e,transparent:true,opacity:.5}),[1,.48,.24]);sphere(face,.042,.22,-.045,-.058,new THREE.MeshBasicMaterial({color:0xf0a19e,transparent:true,opacity:.5}),[1,.48,.24]);
  const hair=new THREE.Group();hair.name='agcb-original-hair';head.add(hair);hair.position.set(0,.14,.02);sphere(hair,.43,0,.10,.02,hairMat,[1.08,.68,.94]);for(const x of[-.34,-.22,-.08,.08,.23,.35]){const lock=sphere(hair,.13,x,.04,-.33,hairMat,[.95,.82,.54]);lock.rotation.z=(x/.35)*.18}
  if(c.hairStyle==='ponytail'||c.hairStyle==='long'){sphere(hair,.18,.34,.02,.25,hairMat,[.8,1.45,.8]);sphere(hair,.16,.28,-.18,.20,hairMat,[.9,1.3,.8])}
  if(c.hat==='beanie'){sphere(hair,.29,0,.36,.02,new THREE.MeshStandardMaterial({color:0x8bb8d8,roughness:.86}),[1.08,.72,1])}
  if(c.hat==='sun'){const hatMat=new THREE.MeshStandardMaterial({color:0xf0c56b,roughness:.88});const brim=new THREE.Mesh(new THREE.TorusGeometry(.34,.055,8,24),hatMat);brim.rotation.x=Math.PI/2;brim.position.set(0,.31,-.01);hair.add(brim);const crown=new THREE.Mesh(new THREE.CylinderGeometry(.20,.23,.20,20),hatMat);crown.position.set(0,.39,.01);hair.add(crown)}
  if(c.glasses==='round'){const frame=new THREE.MeshStandardMaterial({color:0x453d48,roughness:.62});for(const x of[-.145,.145]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.086,.012,8,20),frame);ring.position.set(x,.05,-.102);face.add(ring)}const bridge=new THREE.Mesh(new THREE.BoxGeometry(.10,.012,.012),frame);bridge.position.set(0,.05,-.103);face.add(bridge)}
  if(c.accessory==='scarf'){const scarf=new THREE.Mesh(new THREE.TorusGeometry(.25,.035,8,24),new THREE.MeshStandardMaterial({color:0xe48791,roughness:.84}));scarf.rotation.x=Math.PI/2;scarf.position.set(0,-.23,.02);head.add(scarf)}
  if(c.accessory==='bow'){const bow=new THREE.Group();bow.name='agcb-bow-accessory';for(const x of[-.10,.10])sphere(bow,.12,x,0,-.02,new THREE.MeshStandardMaterial({color:0xe48791,roughness:.84}),[1.25,.75,.35]);sphere(bow,.045,0,0,-.05,new THREE.MeshStandardMaterial({color:0xd96779,roughness:.82}),[1,.8,.5]);bow.position.set(0,-.18,-.34);head.add(bow)}
  if(c.accessory==='backpack'){const pack=new THREE.Mesh(new THREE.BoxGeometry(.32,.38,.12),new THREE.MeshStandardMaterial({color:0xf09a68,roughness:.88}));pack.name='agcb-backpack-accessory';pack.position.set(0,.02,.31);head.add(pack)}
  return {face,hair};
}
function addPaperDollMarkers(visual,c){
  const slots={};for(const slot of PAPER_DOLL_SLOTS){const marker=new THREE.Group();marker.name='agcb-paper-doll-'+slot;marker.userData={slot,assetId:slot==='bodyBase'?'ag-character-base-underwear-v1':slot==='underlayer'?'ag-underlayer-basic-v1':c[slot]||'none',visible:slot==='bodyBase'||slot==='underlayer'};marker.visible=false;visual.add(marker);slots[slot]=marker}
  visual.userData.paperDollSlots=slots;visual.userData.paperDollSchema=1;return slots;
}
function roundGarment(parent,name,color,position,scale){
  const material=new THREE.MeshStandardMaterial({color,roughness:.82,metalness:.01}),mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),material);
  mesh.name=name;mesh.position.set(...position);mesh.scale.set(...scale);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function applyPaperDoll(visual,c,bones,slots){
  const clear=slot=>{while(slots[slot].children.length)slots[slot].remove(slots[slot].children[0]);slots[slot].visible=false};
  for(const slot of PAPER_DOLL_SLOTS)clear(slot);
  if(c.outfit==='underwear'){
    // The connected body already carries the underwear colors; skip a coplanar overlay to avoid z-fighting speckles.
    slots.underlayer.visible=false;visual.userData.underwearLayerMode='body-color-only-z-fight-safe-v1';return;
  }
  slots.underlayer.visible=true;
  roundGarment(slots.underlayer,'agcb-underlayer-top',UNDERWEAR,[0,.02,0],[.32,.28,.245]);
  roundGarment(slots.underlayer,'agcb-underlayer-bottom',UNDERWEAR,[0,-.04,0],[.30,.18,.24]);
  slots.top.visible=true;
  slots.top.userData.anchor='agcb-chest';
  roundGarment(bones.chest,'agcb-daily-top',TOP[c.top]||TOP.pink,[0,-.25,0],[.38,.42,.29]);
  if(c.outfit==='hoodie')roundGarment(bones.chest,'agcb-hoodie-pocket',0x6d9fca,[0,-.34,-.27],[.17,.10,.035]);
  if(c.outfit==='overall'){
    slots.bottom.visible=true;
    slots.bottom.userData.anchor='agcb-hips';
    roundGarment(bones.hips,'agcb-overall-bottom',BOTTOM[c.bottom]||BOTTOM.denim,[0,-.02,0],[.36,.25,.27]);
    roundGarment(bones.chest,'agcb-overall-bib',BOTTOM[c.bottom]||BOTTOM.denim,[0,-.18,-.25],[.20,.25,.045]);
  }else if(c.outfit==='dress'){
    slots.dress.visible=true;
    slots.dress.userData.anchor='agcb-hips';
    const dressMat=new THREE.MeshStandardMaterial({color:TOP[c.top]||TOP.pink,roughness:.84});
    const dress=new THREE.Mesh(new THREE.CylinderGeometry(.34,.46,.54,24),dressMat);
    dress.name='agcb-formal-dress';dress.position.set(0,-.18,0);dress.castShadow=true;bones.hips.add(dress);
  }
  slots.shoes.visible=true;
  const leftShoe=roundGarment(slots.shoes,'agcb-shoe-l',0x665f5b,[0,-.04,-.08],[.20,.12,.30]);
  const rightShoe=roundGarment(slots.shoes,'agcb-shoe-r',0x665f5b,[0,-.04,-.08],[.20,.12,.30]);
  leftShoe.position.x=-.18;rightShoe.position.x=.18;
  bones.footL.add(leftShoe);bones.footR.add(rightShoe);
}
export function createOriginalCharacter(c){
  const visual=new THREE.Group();visual.name='agcb-original-connected-avatar';visual.userData.assetStatus='AG_ORIGINAL_CONNECTED_BODY';
  const geom=makeConnectedBodyGeometry(c),material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.86,metalness:.01});
  const mesh=new THREE.SkinnedMesh(geom,material);mesh.name='agcb-original-connected-skinned-body';mesh.castShadow=true;mesh.receiveShadow=true;visual.add(mesh);
  const root=bone('agcb-root',null,0,0,0),hips=bone('agcb-hips',root,0,.78,0),spine=bone('agcb-spine',hips,0,.42,0),chest=bone('agcb-chest',spine,0,.28,0),neck=bone('agcb-neck',chest,0,.20,0),head=bone('agcb-head',neck,0,.20,0);
  const upperL=bone('agcb-upper-arm-l',chest,-.34,.02,0),foreL=bone('agcb-forearm-l',upperL,-.12,-.22,0),handL=bone('agcb-hand-l',foreL,-.03,-.22,0);
  const upperR=bone('agcb-upper-arm-r',chest,.34,.02,0),foreR=bone('agcb-forearm-r',upperR,.12,-.22,0),handR=bone('agcb-hand-r',foreR,.03,-.22,0);
  const thighL=bone('agcb-thigh-l',hips,-.18,-.13,0),shinL=bone('agcb-shin-l',thighL,0,-.35,0),footL=bone('agcb-foot-l',shinL,0,-.25,-.08);
  const thighR=bone('agcb-thigh-r',hips,.18,-.13,0),shinR=bone('agcb-shin-r',thighR,0,-.35,0),footR=bone('agcb-foot-r',shinR,0,-.25,-.08);
  const bones=[root,hips,spine,chest,neck,head,upperL,foreL,handL,upperR,foreR,handR,thighL,shinL,footL,thighR,shinR,footR];
  const pairs=[[[0,0,0],[0,.78,0]],[[0,.78,0],[0,1.20,0]],[[0,1.20,0],[0,1.48,0]],[[0,1.48,0],[0,1.68,0]],[[0,1.68,0],[0,1.84,0]],[[0,1.84,0],[0,2.08,0]],[[-.34,1.36,0],[-.46,1.08,0]],[[-.46,1.08,0],[-.46,.78,0]],[[-.46,.78,0],[-.46,.70,0]],[[.34,1.36,0],[.46,1.08,0]],[[.46,1.08,0],[.46,.78,0]],[[.46,.78,0],[.46,.70,0]],[[-.18,.78,0],[-.18,.64,0]],[[-.18,.64,0],[-.18,.29,0]],[[-.18,.29,0],[-.18,.07,-.08]],[[.18,.78,0],[.18,.64,0]],[[.18,.64,0],[.18,.29,0]],[[.18,.29,0],[.18,.07,-.08]]];
  bindConnectedBody(mesh,bones,pairs);const extras=addFaceAndHair(visual,c,{head});const slots=addPaperDollMarkers(visual,c);applyPaperDoll(visual,c,{head,chest,hips,footL,footR},slots);slots.hair.visible=true;slots.hat.visible=c.hat!=='none';slots.glasses.userData.assetId=c.glasses||'none';slots.accessory.userData.assetId=c.accessory||'none';
  const parts={leftArm:upperL,rightArm:upperR,leftLeg:shinL,rightLeg:shinR,legs:[shinL,shinR],body:chest,bib:slots.top};
  const g=new THREE.Group();g.name='agcb-original-character';g.add(visual);g.userData={agOriginal:true,assetStatus:'AG_ORIGINAL_CONNECTED_BODY',visual,animatedParts:parts,baseBodyY:chest.position.y,body:chest,legs:parts.legs,paperDollSlots:slots,paperDollApplied:true,face:extras.face,hair:extras.hair};
  const scale=c.body==='tall'?[.95,1.07,.97]:c.body==='petite'?[.94,.94,.95]:[1.05,1,1.02];g.scale.set(...scale);return g;
}
globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>createOriginalCharacter(c);
globalThis.__AGCB_ORIGINAL_CHARACTER={schema:AG_ORIGINAL_CHARACTER_SCHEMA,enabled:true,source:'AG authored procedural connected skinned mesh',body:'ag-character-base-underwear-v1',paperDollSlots:PAPER_DOLL_SLOTS,animalStatus:'authoring'};
