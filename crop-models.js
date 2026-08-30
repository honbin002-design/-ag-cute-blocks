import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.92});
function ball(g,r,x,y,z,c,s=[1,1,1]){const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),M(c));m.position.set(x,y,z);m.scale.set(...s);m.castShadow=true;g.add(m);return m}
function cone(g,r,h,x,y,z,c){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,9),M(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
function stem(g,x,y,z,h=.45,c=0x4f9b4b){const m=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,h,7),M(c));m.position.set(x,y+h/2,z);m.castShadow=true;g.add(m);return m}
function leaf(g,x,y,z,scale=1,c=0x58a84f){const m=ball(g,.13,x,y,z,c,[.45,.22,1.25]);m.rotation.x=.3;return m}
export function createCropModel(kind='carrot',stage=1){
  const g=new THREE.Group();stage=Math.max(.08,Math.min(1,stage));g.scale.setScalar(.55+.45*stage);g.userData={cropKind:kind,stage};
  if(kind==='carrot'){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;leaf(g,Math.sin(a)*.08,.24,Math.cos(a)*.08,.8);if(stage>.72)cone(g,.13,.42,0,.05,0,0xef7d32)}}
  else if(kind==='corn'){const h=.45+stage*.9;stem(g,0,0,0,h,0x579c43);for(let i=0;i<4;i++){const l=leaf(g,(i%2?1:-1)*.12,.28+i*.19,0,.9,0x66aa4c);l.rotation.z=(i%2?-.75:.75)}if(stage>.68){const cob=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.36,10),M(0xf0cf55));cob.position.set(.12,h*.67,-.03);cob.rotation.z=.45;g.add(cob)}}
  else if(kind==='pumpkin'){for(let i=0;i<4;i++){const a=i/4*Math.PI*2;const vine=new THREE.Mesh(new THREE.TorusGeometry(.28+i*.04,.018,6,18,Math.PI*1.25),M(0x4f9844));vine.rotation.x=Math.PI/2;vine.rotation.z=a;vine.position.y=.05;g.add(vine)}if(stage>.6){for(const [x,z] of [[0,0],[.34,.18],[-.3,.22]]){const p=ball(g,.24,x,.23,z,0xe8872f,[1.15,.8,1.15]);for(let k=0;k<5;k++){const ridge=new THREE.Mesh(new THREE.TorusGeometry(.19,.012,5,14,Math.PI),M(0xd86f22));ridge.rotation.y=k*Math.PI/5;ridge.position.copy(p.position);g.add(ridge)}}}}
  else if(kind==='tomato'){stem(g,0,0,0,.85);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;leaf(g,Math.sin(a)*.22,.35+(i%3)*.16,Math.cos(a)*.22,.75);if(stage>.65)ball(g,.09,Math.sin(a)*.2,.32+(i%2)*.2,Math.cos(a)*.2,0xe55245)}}
  else if(kind==='strawberry'){for(let i=0;i<7;i++){const a=i/7*Math.PI*2;leaf(g,Math.sin(a)*.18,.17,Math.cos(a)*.18,.7);if(stage>.65&&i%2===0){const f=ball(g,.075,Math.sin(a)*.2,.12,Math.cos(a)*.2,0xe8464c,[.9,1.2,.9]);f.rotation.z=.2}}}
  else if(kind==='cabbage'){for(let ring=0;ring<3;ring++)for(let i=0;i<7;i++){const a=i/7*Math.PI*2,r=.27-ring*.07;const l=leaf(g,Math.sin(a)*r,.13+ring*.07,Math.cos(a)*r,.85-ring*.12,0x73b85e);l.rotation.y=a}if(stage>.65)ball(g,.22,0,.28,0,0x8bc96f,[1,1,.9])}
  else if(kind==='potato'){for(let i=0;i<6;i++){const a=i/6*Math.PI*2;stem(g,Math.sin(a)*.1,0,Math.cos(a)*.1,.42);leaf(g,Math.sin(a)*.18,.34,Math.cos(a)*.18,.65);if(stage>.8)ball(g,.08,Math.sin(a)*.13,.42,Math.cos(a)*.13,0xf0e6d2)}}
  return g;
}
export function createFruitTreeModel(kind='apple',stage=1,season='spring'){
  const g=new THREE.Group();stage=Math.max(.2,Math.min(1,stage));const trunkH=.8+stage*1.4;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16*stage+.06,.23*stage+.07,trunkH,10),M(0x8c6548));trunk.position.y=trunkH/2;trunk.castShadow=true;g.add(trunk);
  const leafColor=season==='autumn'?0xd8954f:season==='winter'?0xb8c6b1:0x65ad5d;const crownY=trunkH*.88;for(const [x,y,z,s] of [[0,0,0,1],[.55,.05,.1,.75],[-.5,.08,.15,.78],[.15,.25,.45,.7],[-.1,.25,-.42,.72]])ball(g,.72*stage,x*stage,crownY+y*stage,z*stage,leafColor,[1,s,1]);
  const fruitColors={apple:0xe85c52,orange:0xf09a37,peach:0xf4a078};if(stage>.72&&season!=='winter'){const fc=fruitColors[kind]||fruitColors.apple;for(let i=0;i<9;i++){const a=i*2.399;ball(g,.075+stage*.025,Math.sin(a)*(.35+.35*(i%3)/2),crownY-.15+(i%3)*.22,Math.cos(a)*(.35+.35*(i%3)/2),fc)}}g.userData={treeKind:kind,stage,season};return g;
}
