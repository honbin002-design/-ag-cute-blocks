import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

/*
 * AG Original Connected Animals — runtime55
 * Primary bodies are one continuous implicit-surface SkinnedMesh per animal.
 * No cylinders, capsules, spheres or rods are used to assemble the body.
 */
const AG_CONNECTED_ANIMAL_SCHEMA=1;
const LIVE_ANIMALS=globalThis.__AGCB_LIVE_CONNECTED_ANIMALS||(globalThis.__AGCB_LIVE_CONNECTED_ANIMALS=new Set());
const TETS=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
const EDGES=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const PALETTE={
 dog:{body:0xd6a06d,dark:0x9a6545,light:0xf0d0a9,accent:0xd4777f},
 cat:{body:0xaeb5c1,dark:0x707987,light:0xe3c0b2,accent:0x78a7d2},
 cow:{body:0xf0eee7,dark:0x504a49,light:0xe4aaa8,accent:0xc9a56a},
 sheep:{body:0xf1eee5,dark:0x625b59,light:0xe5d0c5,accent:0x4f4543},
 chicken:{body:0xe8d0a7,dark:0xd2ae7d,light:0xc9504d,accent:0xc78a35}
};
const VEC=(x,y,z)=>new THREE.Vector3(x,y,z);
const smooth=(a,b,k=.12)=>{const h=Math.max(k-Math.abs(a-b),0);return Math.min(a,b)-h*h/(4*k)};
const ell=(p,c,r)=>{const x=(p.x-c[0])/r[0],y=(p.y-c[1])/r[1],z=(p.z-c[2])/r[2];return (Math.sqrt(x*x+y*y+z*z)-1)*Math.min(...r)};
const component=(c,r,tag='body')=>({c,r,tag});
function field(type,p){
  const q=[];
  if(type==='dog'){
    q.push(component([0,.50,.08],[.43,.35,.32]),component([0,.65,-.27],[.30,.38,.27]),component([0,.84,-.48],[.28,.31,.25]),component([0,.82,-.73],[.24,.18,.22],'light'));
    q.push(component([-.24,.96,-.54],[.14,.29,.16],'dark'),component([.24,.96,-.54],[.14,.29,.16],'dark'),component([0,.62,.58],[.13,.30,.13]),component([0,.88,.76],[.18,.20,.16],'dark'));
    for(const [x,z] of [[-.23,-.15],[.23,-.15],[-.23,.31],[.23,.31]])q.push(component([x,.27,z],[.13,.30,.13],'dark'));
  }else if(type==='cat'){
    q.push(component([0,.49,.08],[.39,.33,.29]),component([0,.67,-.24],[.26,.37,.24]),component([0,.84,-.45],[.24,.29,.22]),component([0,.80,-.67],[.20,.16,.18],'light'));
    q.push(component([-.18,1.03,-.48],[.14,.34,.13],'dark'),component([.18,1.03,-.48],[.14,.34,.13],'dark'));
    for(const [x,z] of [[-.21,-.14],[.21,-.14],[-.21,.29],[.21,.29]])q.push(component([x,.25,z],[.11,.28,.11],'dark'));
    q.push(component([0,.61,.43],[.12,.26,.12]),component([0,.84,.66],[.15,.23,.12]),component([0,1.01,.82],[.18,.17,.11],'dark'));
  }else if(type==='cow'){
    q.push(component([0,.73,.09],[.56,.40,.38]),component([0,.84,-.42],[.32,.45,.30]),component([0,1.03,-.68],[.34,.31,.29]),component([0,.91,-.92],[.30,.18,.23],'light'));
    q.push(component([-.39,.98,-.66],[.20,.17,.18],'dark'),component([.39,.98,-.66],[.20,.17,.18],'dark'));
    q.push(component([-.20,1.34,-.69],[.08,.27,.08],'accent'),component([.20,1.34,-.69],[.08,.27,.08],'accent'));
    q.push(component([-.34,.78,.18],[.20,.22,.16],'dark'),component([.35,.68,.33],[.18,.20,.15],'dark'),component([0,.48,.28],[.19,.17,.16],'light'));
    for(const [x,z] of [[-.36,-.18],[.36,-.18],[-.38,.37],[.38,.37]])q.push(component([x,.33,z],[.13,.39,.13],'body'));
    q.push(component([0,.84,.61],[.09,.29,.09]),component([0,1.05,.78],[.13,.22,.11],'dark'));
  }else if(type==='sheep'){
    q.push(component([0,.65,.08],[.51,.43,.38]),component([-.34,.76,.16],[.25,.30,.24]),component([.34,.76,.16],[.25,.30,.24]),component([0,.88,-.16],[.30,.32,.25]));
    q.push(component([0,.86,-.51],[.25,.31,.23],'dark'),component([0,.79,-.72],[.19,.17,.18],'dark'),component([0,1.09,-.51],[.13,.16,.13],'body'));
    for(const [x,z] of [[-.29,-.15],[.29,-.15],[-.30,.34],[.30,.34]])q.push(component([x,.27,z],[.11,.32,.11],'dark'));
    q.push(component([0,.69,.51],[.10,.27,.10]));
  }else{
    q.push(component([0,.42,.04],[.34,.43,.43]),component([0,.70,-.22],[.22,.27,.22]),component([0,.78,-.42],[.18,.17,.18],'light'));
    q.push(component([0,.98,.12],[.18,.18,.20],'dark'),component([0,1.06,.32],[.18,.16,.16],'dark'));
    q.push(component([0,.82,-.65],[.15,.11,.16],'accent'),component([0,1.00,-.46],[.10,.13,.08],'light'));
    for(const [x,z] of [[-.12,.02],[.12,.02]])q.push(component([x,.17,z],[.055,.25,.055],'accent'));
  }
  let v=Infinity,tag='body';for(const part of q){const d=ell(p,part.c,part.r);if(d<v){v=d;tag=part.tag}v=smooth(v,d,.13)}return{v,tag};
}
function color(type,p,tag){
  const pal=PALETTE[type];let c=pal.body;
  if(tag==='dark')c=pal.dark;if(tag==='light')c=pal.light;if(tag==='accent')c=pal.accent;
  if(type==='cow'&&p.y>.48&&p.y<.98&&p.z>.05&&p.x<-.12)c=pal.dark;
  if(type==='chicken'&&p.y>.78&&p.z>.05)c=pal.dark;
  return new THREE.Color(c);
}
function makeContinuousGeometry(type){
  const nx=24,ny=25,nz=22,minX=-.86,maxX=.86,minY=-.02,maxY=1.55,minZ=-1.00,maxZ=.92;
  const dx=(maxX-minX)/nx,dy=(maxY-minY)/ny,dz=(maxZ-minZ)/nz,verts=[],cols=[],indices=[];
  const sample=(ix,iy,iz)=>{const p={x:minX+ix*dx,y:minY+iy*dy,z:minZ+iz*dz},f=field(type,p);return{p,v:f.v,tag:f.tag}};
  const cut=(a,b)=>{const t=a.v/(a.v-b.v),p={x:a.p.x+(b.p.x-a.p.x)*t,y:a.p.y+(b.p.y-a.p.y)*t,z:a.p.z+(b.p.z-a.p.z)*t};const i=verts.length/3;verts.push(p.x,p.y,p.z);const c=color(type,p,a.tag);cols.push(c.r,c.g,c.b);return i};
  for(let x=0;x<nx;x++)for(let y=0;y<ny;y++)for(let z=0;z<nz;z++){const q=[sample(x,y,z),sample(x+1,y,z),sample(x+1,y,z+1),sample(x,y,z+1),sample(x,y+1,z),sample(x+1,y+1,z),sample(x+1,y+1,z+1),sample(x,y+1,z+1)];for(const ids of TETS){const t=ids.map(i=>q[i]),inside=t.filter(n=>n.v<0).length;if(!inside||inside===4)continue;const cutIds=[];for(const [a,b] of EDGES)if((t[a].v<0)!==(t[b].v<0))cutIds.push(cut(t[a],t[b]));if(cutIds.length===3)indices.push(...cutIds);else if(cutIds.length===4)indices.push(cutIds[0],cutIds[1],cutIds[2],cutIds[0],cutIds[2],cutIds[3])}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));g.setIndex(indices);g.computeVertexNormals();g.computeBoundingSphere();return g;
}
function segmentDistance(p,a,b){const ab=new THREE.Vector3().subVectors(b,a),ap=new THREE.Vector3().subVectors(p,a),t=Math.max(0,Math.min(1,ap.dot(ab)/Math.max(ab.lengthSq(),.0001)));return p.distanceTo(new THREE.Vector3().copy(a).addScaledVector(ab,t))}
function bind(mesh,bones,segments){const pos=mesh.geometry.getAttribute('position'),si=[],sw=[];for(let i=0;i<pos.count;i++){const p=new THREE.Vector3().fromBufferAttribute(pos,i),rank=segments.map((s,j)=>[segmentDistance(p,s[0],s[1]),j]).sort((a,b)=>a[0]-b[0]).slice(0,4),sum=rank.reduce((n,x)=>n+1/(x[0]+.04),0),idx=[0,0,0,0],w=[0,0,0,0];rank.forEach((x,j)=>{idx[j]=x[1];w[j]=(1/(x[0]+.04))/sum});si.push(...idx);sw.push(...w)}mesh.geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(si,4));mesh.geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(sw,4));const sk=new THREE.Skeleton(bones);mesh.add(bones[0]);mesh.bind(sk);return sk}
function b(name,parent,x,y,z){const n=new THREE.Bone();n.name=name;n.position.set(x,y,z);(parent||null)?.add(n);return n}
function buildRig(type){
  const root=b('agcb-animal-root',null,0,0,0),body=b('agcb-animal-body',root,0,.45,0),head=b('agcb-animal-head',body,0,.34,-.42);
  const legs=[];for(const [name,x,z] of [['l0',-.23,-.14],['r0',.23,-.14],['l1',-.24,.30],['r1',.24,.30]])legs.push(b('agcb-animal-leg-'+name,body,x,-.22,z));
  const tail=b('agcb-animal-tail',body,0,.10,.48),neck=b('agcb-animal-neck',body,0,.25,-.25);
  const bones=[root,body,head,...legs,tail,neck],segs=[
    [VEC(0,0,0),VEC(0,.55,0)],[VEC(0,.40,0),VEC(0,.86,-.42)],[VEC(0,.80,-.42),VEC(0,1.06,-.70)],
    [VEC(-.23,.33,-.14),VEC(-.23,.02,-.14)],[VEC(.23,.33,-.14),VEC(.23,.02,-.14)],[VEC(-.24,.33,.30),VEC(-.24,.02,.30)],[VEC(.24,.33,.30),VEC(.24,.02,.30)],
    [VEC(0,.58,.36),VEC(0,.98,.78)],[VEC(0,.58,-.20),VEC(0,.86,-.48)]
  ];return{root,body,head,legs,tail,neck,bones,segs};
}
function createConnectedAnimal(type){
  const g=new THREE.Group();g.name='agcb-original-connected-'+type;const rig=buildRig(type),mesh=new THREE.SkinnedMesh(makeContinuousGeometry(type),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,metalness:.01}));mesh.name='agcb-original-connected-skinned-'+type;mesh.castShadow=true;mesh.receiveShadow=true;bind(mesh,rig.bones,rig.segs);g.add(mesh);
  rig.legs.forEach(p=>{p.userData.baseY=p.position.y});g.userData={agConnectedAnimal:true,assetStatus:'AG_ORIGINAL_CONNECTED_ANIMAL',animalType:type,legs:rig.legs,tail:rig.tail,headPivot:rig.head,body:rig.body,neck:rig.neck,phase:Math.random()*Math.PI*2,gaitPhase:Math.random()*Math.PI*2,locomotionSchema:3,connectedMesh:true,mesh};
  LIVE_ANIMALS.add(g);return g;
}
export function createCow(){return createConnectedAnimal('cow')}
export function createSheep(){return createConnectedAnimal('sheep')}
export function createChicken(){return createConnectedAnimal('chicken')}
export function setAnimalVisualState(g,state='idle',now=performance.now()){const u=g?.userData;if(!u?.agConnectedAnimal)return;u.state=state;u.stateChangedAt=now}
export function animateAnimal(g,time,speed=0,state='auto'){
  const u=g?.userData;if(!u?.agConnectedAnimal)return;const moving=Math.abs(speed)>.00015,step=Math.min(1,Math.abs(speed)*18),stride=THREE.MathUtils.clamp(step,0,1),phase=(time*.006+u.gaitPhase);
  if(moving){u.gaitPhase+=Math.abs(speed)*20;u.legs.forEach((p,i)=>{const lift=Math.max(0,Math.sin(u.gaitPhase+i*Math.PI))*stride;p.rotation.x=Math.sin(u.gaitPhase+i*Math.PI)*.34*stride;p.position.y=p.userData.baseY+lift*.028})}else u.legs.forEach(p=>{p.rotation.x=THREE.MathUtils.lerp(p.rotation.x,0,.16);p.position.y=THREE.MathUtils.lerp(p.position.y,p.userData.baseY,.16)});
  if(u.tail)u.tail.rotation.x=THREE.MathUtils.lerp(u.tail.rotation.x,moving?Math.sin(phase)*.16:0,.12);if(u.headPivot)u.headPivot.rotation.x=THREE.MathUtils.lerp(u.headPivot.rotation.x,moving?Math.sin(phase*1.3)*.025:0,.12);if(u.body)u.body.rotation.z=THREE.MathUtils.lerp(u.body.rotation.z,moving?Math.sin(phase)*.018:0,.12);
}
globalThis.__AGCB_CONNECTED_ANIMAL_RUNTIME={schema:AG_CONNECTED_ANIMAL_SCHEMA,enabled:true,types:['dog','cat','cow','sheep','chicken'],body:'continuous implicit-surface skinned mesh',prohibitedAssembly:false};
