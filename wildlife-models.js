import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const M=(c,r=.92)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:.005});
function ell(g,r,x,y,z,c,s=[1,1,1],seg=18){const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(10,seg-6)),typeof c==='number'?M(c):c);m.position.set(x,y,z);m.scale.set(...s);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function cap(g,r,len,x,y,z,c){const p=new THREE.Group();p.position.set(x,y,z);const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,len-r*2),5,9),typeof c==='number'?M(c):c);m.castShadow=true;p.add(m);g.add(p);return p}
function cone(g,r,h,x,y,z,c,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,8),M(c));m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;g.add(m);return m}
function eye(g,x,y,z){ell(g,.026,x,y,z,0x23272b,[1,.95,.55],10);ell(g,.007,x+.006,y+.007,z-.012,0xffffff,[1,1,.4],8)}

export function createDeer(){
  const g=new THREE.Group(),coat=M(0xb8794e),cream=M(0xe6c49d),hoof=M(0x433a35),dark=M(0x5c4437);
  const body=ell(g,.33,0,.72,.10,coat,[1.72,.82,.82],22);ell(g,.20,0,.82,-.38,coat,[.78,1.55,.72],18);
  const head=new THREE.Group();head.position.set(0,1.05,-.55);g.add(head);ell(head,.20,0,0,0,coat,[.86,1.05,.84],20);ell(head,.09,0,-.08,-.20,cream,[1.05,.64,1.25],14);ell(head,.035,0,-.06,-.30,dark,[1,.7,.8],10);for(const x of[-.085,.085])eye(head,x,.04,-.19);
  for(const x of[-.15,.15]){const e=ell(head,.085,x,.13,.01,coat,[1.15,.55,1.65],12);e.rotation.z=x<0?-.28:.28}
  // Simple branching antlers keep the silhouette clearly deer-like without excessive triangles.
  for(const side of[-1,1]){const ant=cap(head,.018,.38,side*.09,.28,.02,dark);ant.rotation.z=side*.18;for(const [yy,zz] of [[.08,-.02],[.18,.01]]){const branch=cap(ant,.013,.20,side*.06,yy,zz,dark);branch.rotation.z=side*.72}}
  const legs=[cap(g,.045,.70,-.22,.38,-.16,coat),cap(g,.045,.70,.22,.38,-.16,coat),cap(g,.048,.72,-.24,.38,.35,coat),cap(g,.048,.72,.24,.38,.35,coat)];
  for(const [x,z] of [[-.22,-.16],[.22,-.16],[-.24,.35],[.24,.35]])ell(g,.055,x,.055,z,hoof,[1,.45,1.35],10);
  const tail=ell(g,.10,0,.78,.58,cream,[.72,1.10,.55],12);tail.rotation.x=-.45;
  g.userData={wildlifeType:'deer',legs,head,body,tail,phase:Math.random()*6.28};return g;
}

export function createRabbit(){
  const g=new THREE.Group(),fur=M(0xc9c4ba),light=M(0xeee7db),pink=M(0xe3aaa8);
  const body=ell(g,.24,0,.30,.12,fur,[1.18,.92,1.42],20),head=new THREE.Group();head.position.set(0,.48,-.22);g.add(head);ell(head,.19,0,0,0,fur,[1,.96,.90],18);
  for(const x of[-.10,.10]){const e=ell(head,.085,x,.29,.03,fur,[.72,2.10,.62],14);e.rotation.z=x<0?-.08:.08;ell(e,.06,0,.015,-.03,pink,[.60,1.55,.40],10)}
  ell(head,.075,0,-.05,-.17,light,[1.25,.62,.95],12);for(const x of[-.075,.075])eye(head,x,.035,-.16);ell(head,.025,0,-.025,-.235,pink,[1,.70,.8],9);
  const hind=[cap(g,.065,.30,-.16,.20,.28,fur),cap(g,.065,.30,.16,.20,.28,fur)],front=[cap(g,.045,.27,-.10,.17,-.13,fur),cap(g,.045,.27,.10,.17,-.13,fur)];
  for(const x of[-.16,.16])ell(g,.10,x,.07,.36,fur,[.95,.45,1.65],12);ell(g,.105,0,.33,.48,light,[1,1,1],12);
  g.userData={wildlifeType:'rabbit',legs:[...front,...hind],head,body,phase:Math.random()*6.28};return g;
}

export function createFox(){
  const g=new THREE.Group(),orange=M(0xc96f3e),cream=M(0xf0d6b4),dark=M(0x453c39);
  const body=ell(g,.29,0,.42,.10,orange,[1.70,.76,.82],22);ell(g,.18,0,.50,-.32,orange,[.84,1.23,.78],18);
  const head=new THREE.Group();head.position.set(0,.61,-.50);g.add(head);ell(head,.20,0,0,0,orange,[1,.92,.92],18);ell(head,.105,0,-.07,-.22,cream,[1.10,.65,1.25],14);ell(head,.035,0,-.06,-.31,dark,[1,.7,.8],10);for(const x of[-.082,.082])eye(head,x,.045,-.19);
  for(const x of[-.14,.14]){const e=cone(head,.095,.25,x,.22,.01,orange,[0,0,x<0?-.10:.10]);cone(e,.05,.14,0,.02,-.01,0x5d463d)}
  const legs=[cap(g,.045,.40,-.18,.23,-.14,orange),cap(g,.045,.40,.18,.23,-.14,orange),cap(g,.05,.42,-.20,.23,.30,orange),cap(g,.05,.42,.20,.23,.30,orange)];
  for(const [x,z] of [[-.18,-.14],[.18,-.14],[-.20,.30],[.20,.30]])ell(g,.06,x,.055,z,dark,[1,.45,1.35],10);
  const tail=new THREE.Group();tail.position.set(0,.46,.44);g.add(tail);const t1=cap(tail,.085,.54,0,.06,.16,orange);t1.rotation.x=-1.02;ell(tail,.13,0,.12,.48,cream,[.75,.70,1.45],14);
  g.userData={wildlifeType:'fox',legs,head,body,tail,phase:Math.random()*6.28};return g;
}

export function animateWildlife(g,time,speed=0){
  const u=g.userData||{},type=u.wildlifeType,phase=u.phase||0,moving=speed>.001,rate=type==='rabbit'?.017:type==='deer'?.012:.013;
  const step=moving?Math.sin(time*rate+phase):0;
  (u.legs||[]).forEach((leg,i)=>{if(type==='rabbit'){leg.rotation.x=(i<2?-step:step)*.34}else leg.rotation.x=(i===0||i===3?step:-step)*.30});
  if(u.head){if(moving)u.head.rotation.x=Math.sin(time*rate*.65+phase)*.035;else{const look=Math.sin(time*.0017+phase);u.head.rotation.y=look*.20;u.head.rotation.x=Math.max(0,Math.sin(time*.0021+phase)-.55)*.25}}
  if(u.body)u.body.rotation.z=moving*Math.sin(time*rate+phase)*.012;
  if(u.tail)u.tail.rotation.y=Math.sin(time*(moving?.009:.004)+phase)*.18;
  if(type==='rabbit'&&moving)g.position.y=Math.abs(Math.sin(time*rate+phase))*.045;else g.position.y=moving?Math.abs(step)*.008:0;
}
