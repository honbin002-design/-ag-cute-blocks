import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const M=(c,r=.91)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:.01});
function ell(g,r,x,y,z,c,s=[1,1,1],seg=18){const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(10,seg-6)),typeof c==='number'?M(c):c);m.position.set(x,y,z);m.scale.set(...s);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function leg(g,x,z,c,h=.55,hoof=0x4d423c){const p=new THREE.Group();p.position.set(x,h/2,z);const m=new THREE.Mesh(new THREE.CapsuleGeometry(.06,Math.max(.04,h-.12),5,9),typeof c==='number'?M(c):c);m.castShadow=true;p.add(m);g.add(p);ell(g,.075,x,.07,z-.015,hoof,[1,.55,1.25],12);return p}
function cone(g,r,h,x,y,z,c,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,9),M(c));m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;g.add(m);return m}
function eye(g,x,y,z){ell(g,.028,x,y,z,0x22282c,[1,.95,.55],10);ell(g,.008,x+.006,y+.008,z-.012,0xffffff,[1,1,.4],8)}

export function createCow(){
  const g=new THREE.Group(),hide=M(0xf1eee7),dark=M(0x4f4743),pink=M(0xe7aaa9);
  const body=ell(g,.43,0,.73,.10,hide,[1.62,.88,.90],24);
  const neck=ell(g,.29,0,.77,-.42,hide,[.90,1.20,.82],20);
  const headPivot=new THREE.Group();headPivot.position.set(0,.83,-.70);g.add(headPivot);
  ell(headPivot,.28,0,0,0,hide,[1.02,.86,.94],22);ell(headPivot,.16,0,-.11,-.21,pink,[1.35,.66,.90],16);
  ell(g,.18,-.31,.83,.02,dark,[1.2,.65,.28],14);ell(g,.16,.34,.67,.23,dark,[1.1,.72,.25],14);ell(headPivot,.12,.17,.10,.04,dark,[.9,.65,.25],12);
  const legs=[leg(g,-.28,-.16,hide,.58),leg(g,.28,-.16,hide,.58),leg(g,-.30,.36,hide,.58),leg(g,.30,.36,hide,.58)];
  for(const x of[-.22,.22]){const ear=ell(headPivot,.105,x,.10,.03,dark,[1.35,.48,.70],14);ear.rotation.z=x<0?-.20:.20;cone(headPivot,.042,.20,x*.72,.25,.08,0xe1d0a4,[0,0,x<0?.58:-.58])}
  for(const x of[-.105,.105])eye(headPivot,x,.04,-.24);
  ell(g,.16,0,.39,.28,pink,[1.05,.58,.90],14);for(const x of[-.07,.07])for(const z of[.22,.34]){const t=new THREE.Mesh(new THREE.CylinderGeometry(.018,.014,.11,7),pink);t.position.set(x,.27,z);g.add(t)}
  const tail=new THREE.Group();tail.position.set(0,.80,.53);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.58,7),dark);shaft.position.y=-.22;shaft.rotation.x=.22;tail.add(shaft);ell(tail,.065,0,-.52,.10,dark,[.8,1.35,.8],12);g.add(tail);
  g.userData={animalType:'cow',legs,tail,headPivot,body,neck,phase:Math.random()*6.28};return g;
}

export function createSheep(){
  const g=new THREE.Group(),wool=M(0xf0eee7),face=M(0x625b56),hoof=0x493f3b;
  const body=ell(g,.39,0,.62,.08,wool,[1.52,.94,.92],22);
  for(const [x,y,z,s] of [[-.34,.72,.04,.20],[.34,.72,.04,.20],[-.18,.83,.20,.19],[.18,.83,.20,.19],[0,.84,-.10,.20],[-.30,.58,.25,.18],[.30,.58,.25,.18]])ell(g,s,x,y,z,wool,[1.1,.82,1],14);
  const headPivot=new THREE.Group();headPivot.position.set(0,.73,-.55);g.add(headPivot);ell(headPivot,.22,0,0,0,face,[.84,1.12,.78],20);ell(headPivot,.11,0,-.11,-.17,face,[1.08,.72,.88],14);
  const legs=[leg(g,-.23,-.12,face,.48,hoof),leg(g,.23,-.12,face,.48,hoof),leg(g,-.24,.30,face,.48,hoof),leg(g,.24,.30,face,.48,hoof)];
  for(const x of[-.18,.18]){const ear=ell(headPivot,.085,x,.11,.01,face,[1.45,.45,.70],12);ear.rotation.z=x<0?-.25:.25}for(const x of[-.085,.085])eye(headPivot,x,.04,-.18);
  g.userData={animalType:'sheep',legs,headPivot,body,phase:Math.random()*6.28};return g;
}

export function createChicken(){
  const g=new THREE.Group(),feather=M(0xe8d2ad),wing=M(0xd2b588),red=M(0xc84f49),legMat=M(0xc9913c);
  const body=ell(g,.28,0,.39,.04,feather,[1.02,1.05,1.34],20);
  const headPivot=new THREE.Group();headPivot.position.set(0,.65,-.23);g.add(headPivot);ell(headPivot,.17,0,0,0,feather,[1,.98,.92],18);
  const wl=ell(g,.17,-.23,.42,.05,wing,[.48,1,1.18],16),wr=ell(g,.17,.23,.42,.05,wing,[.48,1,1.18],16);wl.rotation.z=.15;wr.rotation.z=-.15;
  cone(headPivot,.07,.20,0,-.02,-.22,0xd99837,[Math.PI/2,0,0]);for(const x of[-.072,.072])eye(headPivot,x,.04,-.16);
  for(let i=0;i<3;i++)ell(headPivot,.05,(i-1)*.055,.18,.05,red,[.75,1.15,.72],10);ell(headPivot,.055,0,-.09,-.14,red,[.75,1.1,.7],10);
  const legs=[];for(const x of[-.09,.09]){const p=new THREE.Group();p.position.set(x,.20,.06);const shank=new THREE.Mesh(new THREE.CylinderGeometry(.018,.021,.30,7),legMat);p.add(shank);g.add(p);legs.push(p);for(const sx of[-.035,0,.035]){const toe=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.17,6),legMat);toe.rotation.x=Math.PI/2;toe.position.set(sx,-.15,-.08);p.add(toe)}}
  for(const x of[-.09,0,.09]){const f=ell(g,.11,x,.48,.34,wing,[.45,1.25,.62],12);f.rotation.x=-.45;f.rotation.z=x*.8}
  g.userData={animalType:'chicken',legs,wings:[wl,wr],headPivot,body,phase:Math.random()*6.28};return g;
}

export function animateAnimal(g,time,speed=0,state='auto'){
  const u=g.userData||{},legs=u.legs;if(!legs)return;const moving=speed>.001,phase=u.phase||0,type=u.animalType;
  const walkRate=type==='chicken'?.015:.0105,swing=moving?Math.sin(time*walkRate+phase)*(type==='chicken'?.46:.34):0;
  legs.forEach((p,i)=>{if(type==='chicken')p.rotation.x=(i%2?swing:-swing);else p.rotation.x=(i===0||i===3?swing:-swing)});
  const idleWave=Math.sin(time*.0015+phase);
  if(u.headPivot){
    if(moving){u.headPivot.rotation.x=type==='chicken'?Math.sin(time*.015+phase)*.10:Math.sin(time*.0105+phase)*.045;u.headPivot.position.y+=(0-u.headPivot.position.y+(type==='cow'?.83:type==='sheep'?.73:.65))*.08}
    else if(type==='chicken'){const peck=Math.max(0,Math.sin(time*.004+phase)-.72)/.28;u.headPivot.rotation.x=peck*.72;u.headPivot.position.y=.65-peck*.08}
    else{const graze=Math.max(0,Math.sin(time*.0018+phase)-.45)/.55;u.headPivot.rotation.x=graze*.72;u.headPivot.position.y=(type==='cow'?.83:.73)-graze*(type==='cow'?.18:.14)}
  }
  if(u.body){u.body.rotation.z=moving?Math.sin(time*walkRate+phase)*.018:idleWave*.006}
  if(u.tail)u.tail.rotation.z=Math.sin(time*(moving?.006:.0035)+phase)*(moving?.16:.10);
  if(u.wings){const w=(moving?Math.sin(time*.012+phase)*.045:Math.sin(time*.003+phase)*.028);u.wings[0].rotation.z=.15+w;u.wings[1].rotation.z=-.15-w}
  g.position.y=moving?Math.abs(Math.sin(time*walkRate+phase))*(type==='chicken'?.013:.008):0;
}
