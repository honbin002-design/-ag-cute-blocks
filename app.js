import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const VERSION='V0.3';
const WORLD_SIZE=180;
const HALF=WORLD_SIZE/2;
const SAVE_KEY='ag_cute_blocks_world_v03';
const SETTINGS_KEY='ag_cute_blocks_settings_v03';
const ui={
  status:document.querySelector('#status'),cats:document.querySelector('#cats'),items:document.querySelector('#items'),
  cam:document.querySelector('#cam'),admin:document.querySelector('#admin'),panel:document.querySelector('#adminPanel'),
  season:document.querySelector('#season'),weather:document.querySelector('#weather'),timeSpeed:document.querySelector('#timeSpeed'),
  avatar:document.querySelector('#avatar'),save:document.querySelector('#saveNow'),closeAdmin:document.querySelector('#closeAdmin'),
  add:document.querySelector('#add'),del:document.querySelector('#del'),jump:document.querySelector('#jump'),rot:document.querySelector('#rot'),
  joy:document.querySelector('#joy'),knob:document.querySelector('#knob'),clock:document.querySelector('#clock')
};

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9ed9ff);
scene.fog=new THREE.Fog(0x9ed9ff,62,170);
const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.1,260);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
document.body.prepend(renderer.domElement);

const hemi=new THREE.HemisphereLight(0xfff5d8,0x6e9864,2.15);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,2.0);sun.position.set(45,70,25);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-55;sun.shadow.camera.right=55;sun.shadow.camera.top=55;sun.shadow.camera.bottom=-55;scene.add(sun);
const moon=new THREE.DirectionalLight(0xb8c8ff,0);moon.position.set(-30,45,-25);scene.add(moon);

function canvasTexture(kind,a,b){
  const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle=a;x.fillRect(0,0,128,128);x.strokeStyle=b;x.lineWidth=3;
  if(kind==='wood'){for(let y=8;y<128;y+=18){x.beginPath();x.moveTo(0,y);x.bezierCurveTo(34,y-7,82,y+8,128,y-1);x.stroke()}for(let i=0;i<8;i++){x.beginPath();x.ellipse(12+i*17,38+(i%3)*24,5,2.5,0,0,Math.PI*2);x.stroke()}}
  else if(kind==='stone'){for(let i=0;i<42;i++){x.fillStyle=i%2?b:'#ffffff18';x.beginPath();x.arc(Math.random()*128,Math.random()*128,3+Math.random()*8,0,Math.PI*2);x.fill()}}
  else if(kind==='brick'){for(let y=0;y<128;y+=22){x.beginPath();x.moveTo(0,y);x.lineTo(128,y);x.stroke();for(let xx=((y/22)%2)*16;xx<128;xx+=32){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,y+22);x.stroke()}}}
  else if(kind==='tile'){for(let p=0;p<=128;p+=24){x.beginPath();x.moveTo(p,0);x.lineTo(p,128);x.moveTo(0,p);x.lineTo(128,p);x.stroke()}}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;
}
const mats={
  grass:new THREE.MeshLambertMaterial({color:0x8fd47b}),
  wood:new THREE.MeshLambertMaterial({map:canvasTexture('wood','#c99b68','#855d3b')}),
  darkwood:new THREE.MeshLambertMaterial({map:canvasTexture('wood','#8d654c','#563d2f')}),
  stone:new THREE.MeshLambertMaterial({map:canvasTexture('stone','#aab0b6','#7c858e')}),
  marble:new THREE.MeshLambertMaterial({map:canvasTexture('stone','#e9e7e2','#b9b3ae')}),
  brick:new THREE.MeshLambertMaterial({map:canvasTexture('brick','#c97868','#8e5147')}),
  concrete:new THREE.MeshLambertMaterial({color:0xc7cbce}),
  white:new THREE.MeshLambertMaterial({color:0xf7f4ed}),
  pink:new THREE.MeshLambertMaterial({color:0xf4a6b8}),
  blue:new THREE.MeshLambertMaterial({color:0x90c8ee}),
  yellow:new THREE.MeshLambertMaterial({color:0xf3d477}),
  roof:new THREE.MeshLambertMaterial({color:0xb86f58}),
  soil:new THREE.MeshLambertMaterial({color:0x79563b}),
  glass:new THREE.MeshPhongMaterial({color:0xa8e8f3,transparent:true,opacity:.48,shininess:90,side:THREE.DoubleSide}),
  metal:new THREE.MeshPhongMaterial({color:0x9da4aa,shininess:80}),
  water:new THREE.MeshPhongMaterial({color:0x4fb7df,transparent:true,opacity:.73,shininess:100}),
  leaf:new THREE.MeshLambertMaterial({color:0x67ad62}),
  leafFall:new THREE.MeshLambertMaterial({color:0xd8954f}),
  snow:new THREE.MeshLambertMaterial({color:0xf2f7fb})
};

const world=new THREE.Group();scene.add(world);
const groundMat=new THREE.MeshLambertMaterial({color:0x8fd47b});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE,WORLD_SIZE),groundMat);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.userData={ground:true};world.add(ground);
const grid=new THREE.GridHelper(WORLD_SIZE,WORLD_SIZE,0x679b5f,0x7abb70);grid.position.y=.008;grid.material.opacity=.18;grid.material.transparent=true;world.add(grid);

const waterMeshes=[];
function makeWater(){
  const river=new THREE.Mesh(new THREE.PlaneGeometry(14,145),mats.water);river.rotation.x=-Math.PI/2;river.rotation.z=.10;river.position.set(-38,.035,3);world.add(river);waterMeshes.push(river);
  const lake=new THREE.Mesh(new THREE.CircleGeometry(18,48),mats.water);lake.rotation.x=-Math.PI/2;lake.position.set(42,.04,-38);lake.scale.set(1.35,.78,1);world.add(lake);waterMeshes.push(lake);
  for(let i=0;i<9;i++){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1.2+Math.random()*1.5,0),mats.stone);rock.position.set(-43+Math.random()*10,.3,-50+i*13+Math.random()*5);rock.scale.y=.55;rock.castShadow=true;world.add(rock)}
}
makeWater();

const hills=[];
function makeHills(){
  const positions=[[-75,-55,15],[-65,55,18],[70,58,17],[74,-5,13],[18,76,12],[-5,-78,14]];
  for(const [x,z,s] of positions){const h=new THREE.Mesh(new THREE.SphereGeometry(s,22,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshLambertMaterial({color:0x78b66c}));h.scale.y=.48;h.position.set(x,-.1,z);h.receiveShadow=true;world.add(h);hills.push(h)}
}
makeHills();

const plotCenters=[[-58,-30],[-58,28],[-4,-54],[-2,53],[52,-8],[55,48]];
function makePlots(){
  plotCenters.forEach(([x,z],i)=>{
    const pad=new THREE.Mesh(new THREE.PlaneGeometry(34,30),new THREE.MeshLambertMaterial({color:i%2?0x96d483:0x9cda89,transparent:true,opacity:.52}));pad.rotation.x=-Math.PI/2;pad.position.set(x,.012,z);world.add(pad);
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(34,.04,30)),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.5}));edge.position.set(x,.03,z);world.add(edge);
    const sign=new THREE.Group();sign.position.set(x-14.5,0,z-12);box(sign,.18,1.25,.18,0,.62,0,'wood');box(sign,2.8,.85,.15,0,1.35,0,0xffefd1);const label=makeLabel(`莊園 ${i+1}`);label.position.set(0,1.35,-.09);sign.add(label);world.add(sign);
  });
}
function makeLabel(text){const c=document.createElement('canvas');c.width=256;c.height=96;const x=c.getContext('2d');x.fillStyle='#fff4d8';x.fillRect(0,0,256,96);x.fillStyle='#4d5a57';x.font='bold 34px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,128,48);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.Mesh(new THREE.PlaneGeometry(2.5,.85),new THREE.MeshBasicMaterial({map:t,transparent:true}))}
makePlots();

const blocks=new Map();
const objects=[];
const wildlife=[];
let changed=false;
const blockKey=(x,y,z)=>`${x},${y},${z}`;

function geometryFor(shape){
  if(shape==='cube')return new THREE.BoxGeometry(1,1,1);
  if(shape==='rect')return new THREE.BoxGeometry(2,1,1);
  if(shape==='cylinder')return new THREE.CylinderGeometry(.5,.5,1,20);
  if(shape==='sphere')return new THREE.SphereGeometry(.58,20,14);
  if(shape==='triangle'){const s=new THREE.Shape();s.moveTo(-.55,-.5);s.lineTo(.55,-.5);s.lineTo(0,.5);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false});g.translate(0,0,-.5);g.rotateY(Math.PI/2);return g}
  return new THREE.BoxGeometry(1,1,1);
}
function addBlock(rec,mark=true){
  const k=rec.id||crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;const m=new THREE.Mesh(geometryFor(rec.shape||'cube'),mats[rec.mat]||mats.wood);m.position.set(rec.x,rec.y,rec.z);m.rotation.y=rec.rot||0;m.castShadow=m.receiveShadow=true;m.userData={kind:'block',id:k,shape:rec.shape||'cube',mat:rec.mat||'wood'};world.add(m);blocks.set(k,m);if(mark)changed=true;return m;
}
function box(parent,sx,sy,sz,x,y,z,mat){const material=typeof mat==='string'?(mats[mat]||mats.white):new THREE.MeshLambertMaterial({color:mat||0xffffff});const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
function sphere(parent,r,x,y,z,mat,scale=[1,1,1]){const material=typeof mat==='string'?(mats[mat]||mats.white):new THREE.MeshLambertMaterial({color:mat||0xffffff});const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),material);m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;parent.add(m);return m}

function addObject(rec,mark=true){
  const g=new THREE.Group();g.position.set(rec.x||0,0,rec.z||0);g.rotation.y=rec.rot||0;g.userData={kind:'object',id:rec.id||crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`,type:rec.type,solid:true};
  const t=rec.type;
  if(t==='chair'){box(g,.8,.12,.8,0,.65,0,'wood');for(const X of[-.3,.3])for(const Z of[-.3,.3])box(g,.12,.7,.12,X,.3,Z,'wood');box(g,.8,.78,.12,0,1,-.34,'wood')}
  else if(t==='table'){box(g,1.8,.14,1.2,0,1,0,'wood');for(const X of[-.72,.72])for(const Z of[-.42,.42])box(g,.12,1,.12,X,.5,Z,'wood')}
  else if(t==='sofa'){box(g,2.2,.55,.9,0,.42,0,0xe98ca0);box(g,2.2,.9,.25,0,.92,.32,0xe98ca0);box(g,.28,.65,.9,-1.08,.55,0,0xe98ca0);box(g,.28,.65,.9,1.08,.55,0,0xe98ca0)}
  else if(t==='bed'){box(g,2.2,.45,1.45,0,.35,0,'darkwood');box(g,2.05,.3,1.3,0,.65,0,0xfff0d8);box(g,.75,.18,1.1,-.58,.83,0,'white')}
  else if(t==='cabinet'){box(g,1.6,1.45,.5,0,.72,0,'wood');for(const X of[-.42,.42])box(g,.06,.32,.06,X,.78,-.27,'metal')}
  else if(t==='fridge'){box(g,.95,1.9,.85,0,.95,0,0xf2f5f6);box(g,.04,.7,.05,.28,1.35,-.44,'metal')}
  else if(t==='stove'){box(g,1.05,.95,.8,0,.48,0,0x55575b);for(const X of[-.25,.25])for(const Z of[-.18,.18]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.02,16),new THREE.MeshLambertMaterial({color:0x202226}));p.position.set(X,.97,Z);g.add(p)}}
  else if(t==='washer'){box(g,1.0,1.05,.85,0,.52,0,'white');const d=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.04,24),mats.metal);d.rotation.x=Math.PI/2;d.position.set(0,.48,-.45);g.add(d)}
  else if(t==='tv'){box(g,1.7,1.0,.12,0,1.15,0,0x242a31);box(g,.15,.65,.15,0,.45,.1,'metal');box(g,1.0,.08,.55,0,.1,.1,'metal')}
  else if(t==='lamp'){box(g,.12,1.35,.12,0,.7,0,'metal');sphere(g,.32,0,1.5,0,0xffefa8);g.userData.solid=false}
  else if(t==='tree'||t==='fruitTree'){box(g,.45,2.1,.45,0,1.05,0,'wood');const crown=sphere(g,1.25,0,2.25,0,'leaf',[1.0,.9,1.0]);crown.userData.crown=true;if(t==='fruitTree'){for(let i=0;i<6;i++)sphere(g,.09,Math.sin(i*2.1)*.7,2.15+(i%2)*.35,Math.cos(i*1.7)*.7,0xf0826f)}g.userData.solid=true}
  else if(t==='crop'){box(g,.95,.12,.95,0,.06,0,'soil');for(let i=0;i<5;i++){const p=new THREE.Mesh(new THREE.ConeGeometry(.11,.55,7),new THREE.MeshLambertMaterial({color:0x60a94a}));p.position.set((i-2)*.17,.36,(i%2)*.16-.08);g.add(p)}g.userData.solid=false;g.userData.growth=rec.growth??.45}
  else if(t==='fence'){box(g,2,.12,.12,0,.6,0,'wood');box(g,2,.12,.12,0,1.08,0,'wood');box(g,.14,1.35,.14,-.9,.65,0,'wood');box(g,.14,1.35,.14,.9,.65,0,'wood')}
  else if(t==='petDog'||t==='petCat'){const col=t==='petDog'?0xf1c38f:0xbfc3c7;sphere(g,.38,0,.45,0,col,[1.25,.85,1]);sphere(g,.28,0,.62,-.38,col);for(const X of[-.2,.2])box(g,.1,.34,.1,X,.17,.05,col);g.userData.solid=false;g.userData.pet=true;g.userData.phase=Math.random()*6.28}
  else return null;
  world.add(g);objects.push(g);if(mark)changed=true;return g;
}

function animal(type,x,z){
  const g=new THREE.Group();g.position.set(x,0,z);g.userData={wild:true,type,phase:Math.random()*10,speed:.005+Math.random()*.005,home:new THREE.Vector2(x,z)};
  const color=type==='deer'?0xb98558:type==='rabbit'?0xf0eee8:type==='fox'?0xd98550:0xd7d1c5;
  sphere(g,type==='rabbit'?.25:.38,0,type==='rabbit'?.28:.45,0,color,[1.25,.85,1]);sphere(g,type==='rabbit'?.19:.25,0,type==='rabbit'?.48:.62,-.34,color);
  if(type==='deer'){for(const X of[-.19,.19])box(g,.08,.7,.08,X,.18,.04,color)}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true});world.add(g);wildlife.push(g);return g;
}
function seedNature(){
  const treeSpots=[[-74,-35],[-70,-25],[-67,18],[-75,35],[-20,72],[18,70],[74,63],[77,28],[72,-52],[32,-72],[10,-70],[-70,-65],[-25,22],[25,15],[34,18]];
  treeSpots.forEach((p,i)=>addObject({type:i%4===0?'fruitTree':'tree',x:p[0],z:p[1],rot:0,id:`nature-tree-${i}`},false));
  [['deer',22,-18],['deer',27,-22],['rabbit',-20,26],['rabbit',-16,30],['fox',58,-58],['rabbit',40,66]].forEach(a=>animal(...a));
}
seedNature();

function createAvatar(style='girl'){
  const g=new THREE.Group();
  const skin=0xffd7bd,hair=style==='girl'?0x704b3a:0x513b32,shirt=style==='girl'?0xf29fbc:0x76b9eb,shorts=style==='girl'?0x8a75c2:0x4f739c;
  sphere(g,.34,0,1.72,0,skin);
  const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.35,18,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshLambertMaterial({color:hair}));hairCap.position.y=1.78;g.add(hairCap);
  if(style==='girl'){sphere(g,.17,-.25,1.60,.05,hair);sphere(g,.17,.25,1.60,.05,hair)}
  box(g,.64,.92,.38,0,1.02,0,shirt);box(g,.24,.62,.22,-.18,.34,0,shorts);box(g,.24,.62,.22,.18,.34,0,shorts);
  box(g,.18,.74,.18,-.43,1.03,0,skin);box(g,.18,.74,.18,.43,1.03,0,skin);
  box(g,.28,.14,.5,-.18,.05,-.06,0xffffff);box(g,.28,.14,.5,.18,.05,-.06,0xffffff);
  g.userData.avatarStyle=style;return g;
}
let settings=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}');
let player=createAvatar(settings.avatar||'girl');world.add(player);player.position.set(0,0,8);

const catalog={
  '形狀':[['cube','▣','正方體'],['rect','▬','長方體'],['sphere','●','圓形'],['cylinder','⬤','圓柱'],['triangle','▲','三角形']],
  '建材':[['wood','🪵','木紋'],['darkwood','🟫','深木紋'],['stone','🪨','石紋'],['marble','◻️','大理石'],['brick','🧱','磚'],['concrete','⬜','混凝土'],['glass','🪟','玻璃'],['roof','🏠','屋瓦'],['pink','🌸','彩色']],
  '家具':[['chair','🪑','椅子'],['table','🍽️','桌子'],['sofa','🛋️','沙發'],['bed','🛏️','床'],['cabinet','🗄️','櫃子']],
  '家電':[['fridge','🧊','冰箱'],['stove','🍳','爐具'],['washer','🧺','洗衣機'],['tv','📺','電視'],['lamp','💡','燈']],
  '農牧':[['fruitTree','🍎','果樹'],['tree','🌳','樹木'],['crop','🌱','作物'],['fence','🪵','圍欄'],['petDog','🐶','小狗'],['petCat','🐱','小貓']]
};
let category='形狀',selectedShape='cube',selectedMat='wood',selectedObject='chair',objRot=0,third=!!settings.third;
function drawCats(){ui.cats.innerHTML='';for(const k of Object.keys(catalog)){const b=document.createElement('button');b.className='cat'+(k===category?' on':'');b.textContent=k;b.onclick=()=>{category=k;if(k==='形狀')selectedShape=catalog[k][0][0];else if(k==='建材')selectedMat=catalog[k][0][0];else selectedObject=catalog[k][0][0];drawCats();drawItems()};ui.cats.appendChild(b)}}
function drawItems(){ui.items.innerHTML='';for(const [id,ico,name] of catalog[category]){let active=(category==='形狀'?id===selectedShape:category==='建材'?id===selectedMat:id===selectedObject);const b=document.createElement('button');b.className='item'+(active?' on':'');b.innerHTML=`${ico}<small>${name}</small>`;b.onclick=()=>{if(category==='形狀')selectedShape=id;else if(category==='建材')selectedMat=id;else selectedObject=id;drawItems()};ui.items.appendChild(b)}}drawCats();drawItems();

const ray=new THREE.Raycaster();
function allTargets(){const a=[ground,...waterMeshes,...blocks.values()];for(const g of objects)g.traverse(o=>{if(o.isMesh)a.push(o)});return a}
function aim(){ray.setFromCamera(new THREE.Vector2(0,0),camera);return ray.intersectObjects(allTargets(),false)[0]}
function inWater(x,z){const riverX=-38+z*.10;const inRiver=Math.abs(x-riverX)<7;const dx=(x-42)/1.35,dz=(z+38)/.78;const inLake=dx*dx+dz*dz<18*18;return inRiver||inLake}
function snap(v){return Math.round(v)}
function place(){
  const h=aim();if(!h)return;const p=h.point.clone();
  if(category==='形狀'||category==='建材'){
    let pos;if(h.object.userData?.kind==='block'){pos=h.object.position.clone().add(h.face.normal)}else{pos=p;pos.y=.5}
    const shape=category==='形狀'?selectedShape:'cube';const mat=category==='建材'?selectedMat:selectedMat;if(inWater(pos.x,pos.z))return toast('水面上目前不能建造');
    addBlock({x:snap(pos.x),y:Math.max(.5,Math.round(pos.y*2)/2),z:snap(pos.z),shape,mat,rot:objRot});
  }else{
    if(inWater(p.x,p.z))return toast('水面上目前不能放置');
    addObject({type:selectedObject,x:snap(p.x),z:snap(p.z),rot:objRot});
  }
}
function remove(){const h=aim();if(!h||h.object===ground||waterMeshes.includes(h.object))return;let o=h.object;while(o.parent&&o.parent!==world)o=o.parent;if(o.userData.kind==='object'&&!String(o.userData.id).startsWith('nature-')){world.remove(o);const i=objects.indexOf(o);if(i>=0)objects.splice(i,1);changed=true}else if(h.object.userData.kind==='block'){world.remove(h.object);blocks.delete(h.object.userData.id);changed=true}}

let yaw=-.4,pitch=-.16,moveX=0,moveY=0,vy=0,onGround=true;
function solidAt(x,z,y=1){
  if(Math.abs(x)>HALF-2||Math.abs(z)>HALF-2||inWater(x,z))return true;
  const point=new THREE.Vector3(x,Math.max(.35,y),z);
  for(const b of blocks.values()){const bb=new THREE.Box3().setFromObject(b).expandByScalar(.24);if(bb.containsPoint(point))return true}
  for(const g of objects){if(!g.userData.solid)continue;const bb=new THREE.Box3().setFromObject(g).expandByScalar(.25);if(bb.containsPoint(point))return true}
  return false;
}
function movePlayer(dx,dz){const nx=player.position.x+dx,nz=player.position.z+dz;if(!solidAt(nx,player.position.z,player.position.y+1))player.position.x=nx;if(!solidAt(player.position.x,nz,player.position.y+1))player.position.z=nz}

function worldSnapshot(){
  return {version:3,savedAt:Date.now(),player:{x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch},blocks:[...blocks.values()].map(b=>({id:b.userData.id,x:b.position.x,y:b.position.y,z:b.position.z,shape:b.userData.shape,mat:b.userData.mat,rot:b.rotation.y})),objects:objects.filter(o=>!String(o.userData.id).startsWith('nature-')).map(o=>({id:o.userData.id,type:o.userData.type,x:o.position.x,z:o.position.z,rot:o.rotation.y,growth:o.userData.growth}))};
}
function saveWorld(silent=false){try{localStorage.setItem(SAVE_KEY,JSON.stringify(worldSnapshot()));changed=false;if(!silent)toast('世界已存檔 ✓')}catch(e){if(!silent)toast('存檔空間不足')}}
function loadWorld(){
  try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;const d=JSON.parse(raw);for(const rec of d.blocks||[])addBlock(rec,false);for(const rec of d.objects||[])addObject(rec,false);if(d.player){player.position.set(d.player.x||0,d.player.y||0,d.player.z||8);yaw=d.player.yaw??yaw;pitch=d.player.pitch??pitch}changed=false;return true}catch(e){console.warn(e);return false}
}
function seedStarter(){
  const c=plotCenters[0];for(let x=c[0]-5;x<=c[0]+5;x++){addBlock({id:`starter-a-${x}`,x,y:.5,z:c[1]-5,shape:'cube',mat:'brick'},false);addBlock({id:`starter-b-${x}`,x,y:.5,z:c[1]+5,shape:'cube',mat:'brick'},false)}
  for(let z=c[1]-4;z<=c[1]+4;z++){addBlock({id:`starter-c-${z}`,x:c[0]-5,y:.5,z,shape:'cube',mat:'brick'},false);addBlock({id:`starter-d-${z}`,x:c[0]+5,y:.5,z,shape:'cube',mat:'brick'},false)}
  addObject({id:'starter-table',type:'table',x:c[0],z:c[1]},false);addObject({id:'starter-tree',type:'fruitTree',x:c[0]+10,z:c[1]+8},false);changed=false;
}
const loaded=loadWorld();if(!loaded)seedStarter();

let simMinutes=settings.simMinutes??8*60;
let season=settings.season||'spring';
let weather=settings.weather||'sunny';
let timeSpeed=Number(settings.timeSpeed||1);
const seasonNames={spring:'春',summer:'夏',autumn:'秋',winter:'冬'};
const weatherNames={sunny:'晴',cloudy:'陰',rain:'雨',fog:'霧',snow:'雪'};
const particles=new THREE.Group();scene.add(particles);
function rebuildWeather(){
  while(particles.children.length)particles.remove(particles.children[0]);scene.fog.density=0;scene.fog=new THREE.Fog(scene.background,weather==='fog'?22:62,weather==='fog'?95:170);
  if(weather==='rain'||weather==='snow'){
    const count=weather==='rain'?260:190;const geo=new THREE.BufferGeometry();const arr=new Float32Array(count*3);for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*70;arr[i*3+1]=Math.random()*35;arr[i*3+2]=(Math.random()-.5)*70}geo.setAttribute('position',new THREE.BufferAttribute(arr,3));const mat=new THREE.PointsMaterial({color:weather==='rain'?0xa8d8ff:0xffffff,size:weather==='rain'?.09:.18,transparent:true,opacity:.75});particles.add(new THREE.Points(geo,mat));
  }
}
function applySeason(){
  const colors={spring:0x8fd47b,summer:0x70c36b,autumn:0xb8bd62,winter:0xdce8e5};groundMat.color.setHex(colors[season]);
  for(const o of objects){if(o.userData.type==='tree'||o.userData.type==='fruitTree'){o.traverse(m=>{if(m.isMesh&&m.userData.crown)m.material=season==='autumn'?mats.leafFall:season==='winter'?mats.snow:mats.leaf})}}
  ui.season.value=season;
}
function applyWeather(){ui.weather.value=weather;rebuildWeather()}
function saveSettings(){settings={...settings,avatar:player.userData.avatarStyle||settings.avatar||'girl',third,season,weather,timeSpeed,simMinutes};localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
applySeason();applyWeather();

function setAvatar(style){const pos=player.position.clone();world.remove(player);player=createAvatar(style);player.position.copy(pos);world.add(player);settings.avatar=style;ui.avatar.value=style;saveSettings()}
ui.avatar.value=settings.avatar||'girl';
ui.timeSpeed.value=String(timeSpeed);
ui.cam.textContent=third?'🎥 第三人稱':'👁 第一人稱';

ui.add.onclick=place;ui.del.onclick=remove;ui.rot.onclick=()=>{objRot=(objRot+Math.PI/2)%(Math.PI*2);toast('已旋轉 90°')};ui.jump.onclick=()=>{if(onGround){vy=.15;onGround=false}};
ui.cam.onclick=()=>{third=!third;ui.cam.textContent=third?'🎥 第三人稱':'👁 第一人稱';saveSettings()};
ui.admin.onclick=()=>ui.panel.classList.add('open');ui.closeAdmin.onclick=()=>ui.panel.classList.remove('open');ui.save.onclick=()=>saveWorld(false);
ui.season.onchange=e=>{season=e.target.value;applySeason();saveSettings()};ui.weather.onchange=e=>{weather=e.target.value;applyWeather();saveSettings()};ui.timeSpeed.onchange=e=>{timeSpeed=Number(e.target.value);saveSettings()};ui.avatar.onchange=e=>setAvatar(e.target.value);

document.querySelector('#resetPos').onclick=()=>{player.position.set(0,0,8);yaw=-.4;pitch=-.16;toast('已回到中央出生點')};
document.querySelector('#backup').onclick=()=>{const payload=JSON.stringify(worldSnapshot());navigator.clipboard?.writeText(payload).then(()=>toast('世界備份已複製')).catch(()=>toast('此瀏覽器無法複製備份'))};

const joy=ui.joy,knob=ui.knob;let joyId=null;
function setJoy(e){let r=joy.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),d=Math.hypot(x,y)||1,s=Math.min(39,d)/d;x*=s;y*=s;knob.style.transform=`translate(${x}px,${y}px)`;moveX=x/39;moveY=y/39}
joy.addEventListener('pointerdown',e=>{joyId=e.pointerId;joy.setPointerCapture(e.pointerId);setJoy(e)});joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId)setJoy(e)});function joyEnd(e){if(e.pointerId===joyId){joyId=null;moveX=moveY=0;knob.style.transform=''}}joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
let lookId=null,lx=0,ly=0;
renderer.domElement.addEventListener('pointerdown',e=>{if(e.clientX>innerWidth*.29){lookId=e.pointerId;lx=e.clientX;ly=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)}});
renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerId!==lookId)return;yaw-=(e.clientX-lx)*.0075;pitch-=(e.clientY-ly)*.0061;pitch=Math.max(-1.08,Math.min(.60,pitch));lx=e.clientX;ly=e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(e.pointerId===lookId)lookId=null});renderer.domElement.addEventListener('pointercancel',e=>{if(e.pointerId===lookId)lookId=null});

function toast(msg){ui.status.textContent=msg;clearTimeout(toast.t);toast.t=setTimeout(()=>ui.status.textContent=`${seasonNames[season]}・${weatherNames[weather]}・地圖 ${WORLD_SIZE}×${WORLD_SIZE}・自動存檔`,1800)}
function resize(){const w=Math.max(1,Math.round(visualViewport?.width||innerWidth)),h=Math.max(1,Math.round(visualViewport?.height||innerHeight));camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);renderer.domElement.style.width=w+'px';renderer.domElement.style.height=h+'px'}
let rt;function refit(){clearTimeout(rt);resize();rt=setTimeout(resize,150);setTimeout(resize,420)}addEventListener('resize',refit);visualViewport?.addEventListener('resize',refit);addEventListener('orientationchange',refit);
document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});document.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('beforeunload',()=>{saveWorld(true);saveSettings()});document.addEventListener('visibilitychange',()=>{if(document.hidden){saveWorld(true);saveSettings()}});setInterval(()=>{if(changed)saveWorld(true)},15000);

function updateLighting(dt){
  simMinutes=(simMinutes+dt*.018*timeSpeed)%1440;const hour=simMinutes/60;const ang=(hour-6)/24*Math.PI*2;const daylight=Math.max(0,Math.sin(ang));sun.intensity=.15+daylight*2.05;moon.intensity=(1-daylight)*.28;sun.position.set(Math.cos(ang)*65,Math.max(8,Math.sin(ang)*70),25);const night=daylight<.18;const sky=night?0x263858:weather==='cloudy'||weather==='rain'?0xa9bac5:season==='winter'?0xb9d6e6:0x9ed9ff;scene.background.setHex(sky);scene.fog.color.copy(scene.background);ui.clock.textContent=`${String(Math.floor(hour)).padStart(2,'0')}:${String(Math.floor(simMinutes%60)).padStart(2,'0')}`;
}
function updateWeather(dt){if(particles.children.length){const pts=particles.children[0],a=pts.geometry.attributes.position.array;for(let i=1;i<a.length;i+=3){a[i]-=(weather==='rain'?.32:.07)*dt;if(a[i]<0)a[i]=35}pts.geometry.attributes.position.needsUpdate=true;particles.position.x=player.position.x;particles.position.z=player.position.z}}
function updateAnimals(dt){for(const g of wildlife){g.userData.phase+=g.userData.speed*dt;const h=g.userData.home;const tx=h.x+Math.sin(g.userData.phase*.7)*6,tz=h.y+Math.cos(g.userData.phase*.53)*6;const dx=tx-g.position.x,dz=tz-g.position.z;g.rotation.y=Math.atan2(dx,dz);g.position.x+=dx*.0015*dt;g.position.z+=dz*.0015*dt}for(const g of objects)if(g.userData.pet){g.userData.phase+=.006*dt;const dx=player.position.x-g.position.x,dz=player.position.z-g.position.z,dist=Math.hypot(dx,dz);if(dist>3&&dist<25){g.rotation.y=Math.atan2(dx,dz);g.position.x+=dx/dist*.018*dt;g.position.z+=dz/dist*.018*dt}}}

let last=performance.now();
function loop(t){
  requestAnimationFrame(loop);const dt=Math.min(2.2,(t-last)/16.67);last=t;
  const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));const speed=.135*dt;movePlayer(f.x*(-moveY)*speed+r.x*moveX*speed,f.z*(-moveY)*speed+r.z*moveX*speed);vy-=.009*dt;player.position.y+=vy*dt;if(player.position.y<=0){player.position.y=0;vy=0;onGround=true}player.rotation.y=yaw+Math.PI;
  const eye=player.position.clone().add(new THREE.Vector3(0,1.62,0));if(third){const back=new THREE.Vector3(Math.sin(yaw)*4.4,2.15,Math.cos(yaw)*4.4);camera.position.lerp(eye.clone().add(back),.28);camera.lookAt(eye.clone().add(f.clone().multiplyScalar(3)).add(new THREE.Vector3(0,pitch*2.4,0)));player.visible=true}else{camera.position.copy(eye);camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;player.visible=false}
  updateLighting(dt);updateWeather(dt);updateAnimals(dt);renderer.render(scene,camera);
}
resize();toast(loaded?'已接續上次世界存檔':'已建立新的長期世界');requestAnimationFrame(loop);

if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
