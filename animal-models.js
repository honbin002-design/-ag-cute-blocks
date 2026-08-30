import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const M=(c,r=.91)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:.01});
function ell(g,r,x,y,z,c,s=[1,1,1],seg=18){const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(10,seg-6)),typeof c==='number'?M(c):c);m.position.set(x,y,z);m.scale.set(...s);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function leg(g,x,z,c,h=.55,hoof=0x4d423c){const p=new THREE.Group();p.position.set(x,h/2,z);const m=new THREE.Mesh(new THREE.CapsuleGeometry(.06,Math.max(.04,h-.12),5,9),typeof c==='number'?M(c):c);m.castShadow=true;p.add(m);g.add(p);ell(g,.075,x,.07,z-.015,hoof,[1,.55,1.25],12);return p}
function cone(g,r,h,x,y,z,c,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,9),M(c));m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;g.add(m);return m}
function eye(g,x,y,z){ell(g,.028,x,y,z,0x22282c,[1,.95,.55],10);ell(g,.008,x+.006,y+.008,z-.012,0xffffff,[1,1,.4],8)}

export function createCow(){
  const g=new THREE.Group(),hide=M(0xf1eee7),dark=M(0x4f4743),pink=M(0xe7aaa9);
  // Longer torso, shoulder/neck, forward head and muzzle: cow rather than generic four-legged blob.
  ell(g,.43,0,.73,.10,hide,[1.62,.88,.90],24);ell(g,.29,0,.77,-.42,hide,[.90,1.20,.82],20);ell(g,.28,0,.83,-.70,hide,[1.02,.86,.94],22);ell(g,.16,0,.72,-.91,pink,[1.35,.66,.90],16);
  // Distinct patches.
  ell(g,.18,-.31,.83,.02,dark,[1.2,.65,.28],14);ell(g,.16,.34,.67,.23,dark,[1.1,.72,.25],14);ell(g,.12,.17,.93,-.66,dark,[.9,.65,.25],12);
  const legs=[leg(g,-.28,-.16,hide,.58),leg(g,.28,-.16,hide,.58),leg(g,-.30,.36,hide,.58),leg(g,.30,.36,hide,.58)];
  for(const x of[-.22,.22]){const ear=ell(g,.105,x,.93,-.67,dark,[1.35,.48,.70],14);ear.rotation.z=x<0?-.20:.20;cone(g,.042,.20,x*.72,1.08,-.62,0xe1d0a4,[0,0,x<0?.58:-.58])}
  for(const x of[-.105,.105])eye(g,x,.87,-.94);
  // Udder + teats and a proper hanging tail.
  ell(g,.16,0,.39,.28,pink,[1.05,.58,.90],14);for(const x of[-.07,.07])for(const z of[.22,.34]){const t=new THREE.Mesh(new THREE.CylinderGeometry(.018,.014,.11,7),pink);t.position.set(x,.27,z);g.add(t)}
  const tail=new THREE.Group();tail.position.set(0,.80,.53);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.58,7),dark);shaft.position.y=-.22;shaft.rotation.x=.22;tail.add(shaft);ell(tail,.065,0,-.52,.10,dark,[.8,1.35,.8],12);g.add(tail);
  g.userData={animalType:'cow',legs,tail,phase:Math.random()*6.28};return g;
}

export function createSheep(){
  const g=new THREE.Group(),wool=M(0xf0eee7),face=M(0x625b56),hoof=0x493f3b;
  ell(g,.39,0,.62,.08,wool,[1.52,.94,.92],22);
  // Layered fleece follows the body rather than forming a comic pile of balls.
  for(const [x,y,z,s] of [[-.34,.72,.04,.20],[.34,.72,.04,.20],[-.18,.83,.20,.19],[.18,.83,.20,.19],[0,.84,-.10,.20],[-.30,.58,.25,.18],[.30,.58,.25,.18]])ell(g,s,x,y,z,wool,[1.1,.82,1],14);
  ell(g,.22,0,.73,-.55,face,[.84,1.12,.78],20);ell(g,.11,0,.62,-.72,face,[1.08,.72,.88],14);
  const legs=[leg(g,-.23,-.12,face,.48,hoof),leg(g,.23,-.12,face,.48,hoof),leg(g,-.24,.30,face,.48,hoof),leg(g,.24,.30,face,.48,hoof)];
  for(const x of[-.18,.18]){const ear=ell(g,.085,x,.84,-.55,face,[1.45,.45,.70],12);ear.rotation.z=x<0?-.25:.25}for(const x of[-.085,.085])eye(g,x,.77,-.73);
  g.userData={animalType:'sheep',legs,phase:Math.random()*6.28};return g;
}

export function createChicken(){
  const g=new THREE.Group(),feather=M(0xe8d2ad),wing=M(0xd2b588),red=M(0xc84f49),legMat=M(0xc9913c),beak=M(0xd99837);
  ell(g,.28,0,.39,.04,feather,[1.02,1.05,1.34],20);ell(g,.17,0,.65,-.23,feather,[1,.98,.92],18);
  const wl=ell(g,.17,-.23,.42,.05,wing,[.48,1,1.18],16),wr=ell(g,.17,.23,.42,.05,wing,[.48,1,1.18],16);wl.rotation.z=.15;wr.rotation.z=-.15;
  cone(g,.07,.20,0,.63,-.45,0xd99837,[Math.PI/2,0,0]);for(const x of[-.072,.072])eye(g,x,.69,-.39);
  for(let i=0;i<3;i++)ell(g,.05,(i-1)*.055,.83,-.18,red,[.75,1.15,.72],10);ell(g,.055,0,.56,-.37,red,[.75,1.1,.7],10);
  const legs=[];for(const x of[-.09,.09]){const p=new THREE.Group();p.position.set(x,.20,.06);const shank=new THREE.Mesh(new THREE.CylinderGeometry(.018,.021,.30,7),legMat);p.add(shank);g.add(p);legs.push(p);for(const sx of[-.035,0,.035]){const toe=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.17,6),legMat);toe.rotation.x=Math.PI/2;toe.position.set(sx,-.15,-.08);p.add(toe)}}
  // Tail feather fan.
  for(const x of[-.09,0,.09]){const f=ell(g,.11,x,.48,.34,wing,[.45,1.25,.62],12);f.rotation.x=-.45;f.rotation.z=x*.8}
  g.userData={animalType:'chicken',legs,wings:[wl,wr],phase:Math.random()*6.28};return g;
}

export function animateAnimal(g,time,speed=0){const legs=g.userData?.legs;if(!legs)return;const moving=speed>.001,phase=g.userData.phase||0,swing=moving?Math.sin(time*.0105+phase)*.34:0;legs.forEach((p,i)=>p.rotation.x=(i===0||i===3?swing:-swing));if(g.userData.tail)g.userData.tail.rotation.z=Math.sin(time*.004+phase)*.10;if(g.userData.wings){const w=Math.sin(time*.003+phase)*.035;g.userData.wings[0].rotation.z=.15+w;g.userData.wings[1].rotation.z=-.15-w}g.position.y=moving?Math.abs(Math.sin(time*.0105+phase))*.009:0}
