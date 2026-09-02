import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const LIVE_CROPS=globalThis.__AGCB_LIVE_CROPS||(globalThis.__AGCB_LIVE_CROPS=new Set());
const LIVE_TREES=globalThis.__AGCB_LIVE_TREES||(globalThis.__AGCB_LIVE_TREES=new Set());
const M=(c,r=.92)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:.005});
function ball(g,r,x,y,z,c,s=[1,1,1],seg=14){const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(9,seg-4)),typeof c==='number'?M(c):c);m.position.set(x,y,z);m.scale.set(...s);m.castShadow=true;g.add(m);return m}
function cone(g,r,h,x,y,z,c){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,9),M(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
function stem(g,x,y,z,h=.45,c=0x4f9b4b,r=.025){const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.72,r,h,7),M(c));m.position.set(x,y+h/2,z);m.castShadow=true;g.add(m);return m}
function leaf(g,x,y,z,scale=1,c=0x58a84f,rotY=0){const m=ball(g,.13,x,y,z,c,[.42,.18,1.35],14);m.rotation.x=.32;m.rotation.y=rotY;return m}
function flower(g,x,y,z,color=0xfff3ee,scale=1){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;ball(g,.035*scale,x+Math.sin(a)*.045*scale,y+Math.cos(a)*.045*scale,z,color,[1.15,.5,1],10)}ball(g,.022*scale,x,y,z-.008,0xf1c65d,[1,1,.6],9)}

export const FRUIT_SEASONS={apple:['autumn'],orange:['autumn','winter'],peach:['summer']};
export function treeCanFruit(kind,season,stage=1){return stage>=.88&&(FRUIT_SEASONS[kind]||[]).includes(season)}

export function createCropModel(kind='carrot',stage=1){
  const g=new THREE.Group();stage=Math.max(.06,Math.min(1,stage));const young=.45+.55*stage;g.scale.setScalar(young);g.userData={cropKind:kind,stage};
  if(kind==='carrot'){
    for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const l=leaf(g,Math.sin(a)*.07,.22+Math.abs(Math.sin(a))*.04,Math.cos(a)*.07,.78,0x579f49,a);l.rotation.z=(i%2?-.18:.18)}
    if(stage>.68){const root=cone(g,.14,.42,0,.04,0,0xed7830);root.rotation.x=Math.PI;root.position.y=.03;ball(g,.105,0,.22,0,0xed7830,[1.05,.55,1.05],12)}
  }else if(kind==='corn'){
    const h=.48+stage*1.05;stem(g,0,0,0,h,0x4d963c,.035);for(let i=0;i<6;i++){const y=.26+i*.19;if(y>h-.05)break;const side=i%2?1:-1,l=leaf(g,side*.15,y,0,.95,0x5ba747,side>0?.25:-.25);l.rotation.z=side>0?-.78:.78}
    if(stage>.62){for(const [side,y] of [[1,.68],[-1,.92]]){const cob=new THREE.Mesh(new THREE.CylinderGeometry(.085,.105,.34,12),M(0xefcf57));cob.position.set(side*.13,Math.min(h*.72,y),-.02);cob.rotation.z=side*.48;cob.castShadow=true;g.add(cob);const husk=leaf(g,side*.17,cob.position.y+.02,.02,.62,0x6aaa4c,0);husk.rotation.z=side*.65}}
    if(stage>.82)for(let i=0;i<4;i++)flower(g,(i-1.5)*.035,h+.06,0,0xe8dba9,.7);
  }else if(kind==='pumpkin'){
    for(let i=0;i<5;i++){const vine=new THREE.Mesh(new THREE.TorusGeometry(.24+i*.065,.016,6,20,Math.PI*1.4),M(0x4c9340));vine.rotation.x=Math.PI/2;vine.rotation.z=i*.92;vine.position.y=.045;g.add(vine);const a=i*.92;leaf(g,Math.sin(a)*(.22+i*.045),.10,Math.cos(a)*(.22+i*.045),.86,0x5ba24a,a)}
    if(stage>.55){const fruits=stage>.86?[[0,0,.27],[.34,.2,.20],[-.33,.23,.18]]:[[0,0,.20]];for(const [x,z,r] of fruits){const p=ball(g,r,x,r*.82,z,0xe77e2b,[1.15,.82,1.15],18);for(let k=0;k<6;k++){const ridge=new THREE.Mesh(new THREE.TorusGeometry(r*.78,.008,5,16,Math.PI),M(0xce6921));ridge.rotation.y=k*Math.PI/6;ridge.position.copy(p.position);g.add(ridge)}stem(g,x,r*1.55,z,.11,0x587b35,.025)}}
  }else if(kind==='tomato'){
    const h=.48+stage*.55;stem(g,0,0,0,h,0x4d9343,.03);for(let i=0;i<7;i++){const a=i/7*Math.PI*2,y=.26+(i%3)*.18;stem(g,0,y,0,.25,0x4d9343,.018).rotation.z=(i%2?1:-1)*.85;leaf(g,Math.sin(a)*.22,y+.08,Math.cos(a)*.22,.72,0x5aa34e,a);if(stage>.62&&i%2===0){const f=ball(g,.082,Math.sin(a)*.23,y-.03,Math.cos(a)*.23,stage>.84?0xe64e43:0x8fbe52,[1,1.05,1],13);stem(g,f.position.x,y+.03,f.position.z,.09,0x4d9343,.012)}}
  }else if(kind==='strawberry'){
    for(let i=0;i<9;i++){const a=i/9*Math.PI*2;leaf(g,Math.sin(a)*.17,.15+(i%2)*.025,Math.cos(a)*.17,.68,0x559e46,a);if(stage>.58&&i%3===0)flower(g,Math.sin(a)*.19,.23,Math.cos(a)*.19,0xfff5f2,.72)}
    if(stage>.72)for(let i=0;i<5;i++){const a=i/5*Math.PI*2,r=.18+(i%2)*.04;const f=ball(g,.07,Math.sin(a)*r,.11,Math.cos(a)*r,0xe7474f,[.9,1.25,.9],13);cone(g,.035,.055,f.position.x,.18,f.position.z,0x4c9844)}
  }else if(kind==='cabbage'){
    for(let ring=0;ring<4;ring++){const count=8-ring;for(let i=0;i<count;i++){const a=i/count*Math.PI*2,r=.31-ring*.065,l=leaf(g,Math.sin(a)*r,.10+ring*.06,Math.cos(a)*r,.92-ring*.13,ring<2?0x68ad57:0x81bd66,a);l.rotation.z=Math.sin(a)*.35}}
    if(stage>.62)ball(g,.22+stage*.035,0,.26,0,0x91c976,[1,1,.92],18);
  }else if(kind==='potato'){
    for(let i=0;i<7;i++){const a=i/7*Math.PI*2;stem(g,Math.sin(a)*.08,0,Math.cos(a)*.08,.38+stage*.22,0x4e9344,.022);leaf(g,Math.sin(a)*.19,.31+(i%2)*.12,Math.cos(a)*.19,.66,0x5da451,a)}
    if(stage>.55)for(let i=0;i<4;i++)flower(g,(i-1.5)*.10,.58,(i%2?-.07:.07),0xf7f1ed,.65);
    if(stage>.88){for(const [x,z] of [[-.16,.08],[.15,-.08],[.04,.15]])ball(g,.072,x,.045,z,0xb78b5f,[1.18,.7,1],12)}
  }
  LIVE_CROPS.add(g);return g;
}

export function createFruitTreeModel(kind='apple',stage=1,season='spring'){
  const g=new THREE.Group();stage=Math.max(.18,Math.min(1,stage));const trunkH=.72+stage*1.55,trunkColor=kind==='peach'?0x8d6553:0x80614b;
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12*stage+.045,.19*stage+.06,trunkH,11),M(trunkColor));trunk.position.y=trunkH/2;trunk.castShadow=true;g.add(trunk);
  if(stage>.36){for(const side of[-1,1]){const b=new THREE.Mesh(new THREE.CylinderGeometry(.045,.065,.72*stage,8),M(trunkColor));b.position.set(side*.17*stage,trunkH*.70,0);b.rotation.z=side*.62;b.castShadow=true;g.add(b)}}
  const palettes={apple:{leaf:0x5fa657,fall:0xcf8445},orange:{leaf:0x4d9851,fall:0x76a04d},peach:{leaf:0x70a95d,fall:0xd59255}};const pal=palettes[kind]||palettes.apple,leafColor=season==='autumn'?pal.fall:season==='winter'?(kind==='orange'?0x688e58:0xb6c2ac):pal.leaf;
  const crownY=trunkH*.90,crownScale=kind==='orange'?.90:kind==='peach'?1.02:.96,lobes=stage<.42?[[0,0,0,.52]]:[[0,0,0,1],[.48,.02,.05,.72],[-.46,.06,.13,.74],[.12,.23,.38,.67],[-.10,.22,-.37,.68]];for(const [x,y,z,s] of lobes)ball(g,.67*stage*crownScale,x*stage,crownY+y*stage,z*stage,leafColor,[1,s,1],18);
  if(stage>.58&&season==='spring'){const blossom=kind==='peach'?0xf4a9b5:kind==='apple'?0xffe2e5:0xfff3df;for(let i=0;i<11;i++){const a=i*2.399,r=.30+.32*(i%3)/2;flower(g,Math.sin(a)*r,crownY-.08+(i%4)*.14,Math.cos(a)*r,blossom,.78)}}
  if(treeCanFruit(kind,season,stage)){const fc={apple:0xe45249,orange:0xee9332,peach:0xf09a82}[kind]||0xe45249;for(let i=0;i<10;i++){const a=i*2.399,r=.32+.34*(i%3)/2;const f=ball(g,.075+stage*.025,Math.sin(a)*r,crownY-.16+(i%4)*.14,Math.cos(a)*r,fc,kind==='peach'?[1.06,.92,1.03]:[1,1,1],13);stem(g,f.position.x,f.position.y+.06,f.position.z,.10,0x5f7e42,.012)}}
  if(season==='winter'&&kind!=='orange'){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;ball(g,.22,Math.sin(a)*.40,crownY+.32,Math.cos(a)*.40,0xeef4f3,[1.4,.25,1.15],12)}}
  g.userData={treeKind:kind,stage,season,fruitReady:treeCanFruit(kind,season,stage)};LIVE_TREES.add(g);return g;
}
