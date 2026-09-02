import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createCuteChildAvatar,createCuteDog,createCuteCat,animateCuteCharacter} from './character-models.js';
import {createCow,createSheep,createChicken,animateAnimal} from './animal-models.js';
import {createCropModel,createFruitTreeModel} from './crop-models.js';
import {
  createEconomyState,addInventory,shipAllSellable,settleShipping,buyShopItem,
  SHOP_ITEMS,ITEM_NAMES,pendingShippingValue,ownedCount
} from './economy-system.js';

const VERSION='V0.4.2';
const WORLD_SIZE=180;
const HALF=WORLD_SIZE/2;
const FARM_YAW=-0.72;
const SAVE_KEY='ag_cute_blocks_world_v04';
const OLD_SAVE_KEY='ag_cute_blocks_world_v03';
const SETTINGS_KEY='ag_cute_blocks_settings_v03';

const ui={
  status:document.querySelector('#status'),cats:document.querySelector('#cats'),items:document.querySelector('#items'),
  cam:document.querySelector('#cam'),admin:document.querySelector('#admin'),panel:document.querySelector('#adminPanel'),
  season:document.querySelector('#season'),weather:document.querySelector('#weather'),timeSpeed:document.querySelector('#timeSpeed'),
  avatar:document.querySelector('#avatar'),save:document.querySelector('#saveNow'),closeAdmin:document.querySelector('#closeAdmin'),
  add:document.querySelector('#add'),del:document.querySelector('#del'),jump:document.querySelector('#jump'),rot:document.querySelector('#rot'),
  joy:document.querySelector('#joy'),knob:document.querySelector('#knob'),clock:document.querySelector('#clock')
};

function installLifeUI(){
  const style=document.createElement('style');
  style.textContent=`
    .lifeInteract{position:fixed;z-index:75;right:max(72px,calc(env(safe-area-inset-right) + 66px));bottom:max(148px,calc(env(safe-area-inset-bottom) + 138px));width:62px;height:62px;border:0;border-radius:50%;background:#fff7cce8;box-shadow:0 3px 12px #0003;font-size:24px;font-weight:900;color:#42565c;pointer-events:auto;touch-action:manipulation}
    .lifeInteract small{display:block;font-size:8px;line-height:10px;margin-top:-2px}.lifeBtn{position:fixed;z-index:75;right:max(10px,env(safe-area-inset-right));top:max(47px,calc(env(safe-area-inset-top) + 40px));border:0;border-radius:13px;background:#fffde8e8;color:#36515d;padding:7px 9px;font-size:12px;font-weight:900;box-shadow:0 2px 8px #0002;pointer-events:auto}
    .lifePanel{position:fixed;z-index:95;left:0;top:0;height:100%;height:100dvh;width:min(390px,94vw);background:#fffaf0f7;box-shadow:8px 0 28px #0003;transform:translateX(-108%);transition:transform .22s ease;pointer-events:auto;overflow:auto;padding:max(16px,env(safe-area-inset-top)) 14px max(18px,env(safe-area-inset-bottom));color:#3d5556}
    .lifePanel.open{transform:translateX(0)}.lifeClose{position:absolute;right:12px;top:max(10px,env(safe-area-inset-top));width:36px;height:36px;border:0;border-radius:50%;background:#fff;font-size:18px;font-weight:900}
    .lifePanel h2{font-size:20px;margin:3px 42px 3px 0}.lifeSummary{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0 13px}.lifeChip{background:#fff;border-radius:12px;padding:8px 10px;font-size:12px;font-weight:900;box-shadow:0 2px 8px #0001}
    .lifeSection{background:#ffffffb8;border-radius:15px;padding:10px;margin:9px 0}.lifeSection h3{font-size:14px;margin:0 0 8px}.lifeEmpty{font-size:12px;opacity:.65;padding:6px 2px}.invRow,.shopRow{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:7px 2px;border-bottom:1px solid #0000000c;font-size:12px}.invRow:last-child,.shopRow:last-child{border-bottom:0}.invName,.shopName{font-weight:800}.invMeta,.shopMeta{font-size:10px;opacity:.65;margin-top:2px}.buyBtn{border:0;border-radius:10px;background:#ffe98b;padding:7px 9px;font-size:11px;font-weight:900;color:#46575b}.buyBtn:disabled{background:#e8e7df;color:#999}.lifeNote{font-size:10px;line-height:1.55;opacity:.7;margin-top:10px}
    @media(max-height:430px){.lifeInteract{width:54px;height:54px;right:max(64px,calc(env(safe-area-inset-right) + 58px));bottom:max(132px,calc(env(safe-area-inset-bottom) + 122px));font-size:21px}.lifeBtn{top:max(40px,calc(env(safe-area-inset-top) + 34px));font-size:10px;padding:6px 7px}}
  `;
  document.head.appendChild(style);
  const wrap=document.createElement('div');
  wrap.innerHTML=`
    <button id="lifeInteract" class="lifeInteract" aria-label="互動">✨<small>互動</small></button>
    <button id="lifeBtn" class="lifeBtn">🎒 生活</button>
    <aside id="lifePanel" class="lifePanel">
      <button id="lifeClose" class="lifeClose">×</button>
      <h2>🎒 生活小屋</h2>
      <div class="lifeSummary"><div id="coinChip" class="lifeChip">🪙 0</div><div id="shipChip" class="lifeChip">📦 待結算 0</div></div>
      <section class="lifeSection"><h3>背包</h3><div id="inventoryList"></div></section>
      <section class="lifeSection"><h3>小商城</h3><div id="shopList"></div></section>
      <div class="lifeNote">這只是額外的小目標：收成不要的東西可以放進出貨箱，隔天換成金幣。沒有欠債、每日任務、登入獎勵或強迫賺錢。</div>
    </aside>`;
  document.body.appendChild(wrap);
  return {
    interact:document.querySelector('#lifeInteract'),btn:document.querySelector('#lifeBtn'),panel:document.querySelector('#lifePanel'),
    close:document.querySelector('#lifeClose'),coins:document.querySelector('#coinChip'),shipping:document.querySelector('#shipChip'),
    inventory:document.querySelector('#inventoryList'),shop:document.querySelector('#shopList')
  };
}
const lifeUI=installLifeUI();

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
const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(45,70,25);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const moon=new THREE.DirectionalLight(0xb8c8ff,0);scene.add(moon);

const lm=c=>new THREE.MeshLambertMaterial({color:c});
const mats={
  grass:lm(0x8fd47b),wood:lm(0xc99b68),darkwood:lm(0x805a43),stone:lm(0xaab0b6),marble:lm(0xe9e7e2),brick:lm(0xc97868),
  concrete:lm(0xc7cbce),white:lm(0xf7f4ed),pink:lm(0xf4a6b8),blue:lm(0x90c8ee),yellow:lm(0xf3d477),roof:lm(0xb86f58),soil:lm(0x79563b),
  metal:new THREE.MeshPhongMaterial({color:0x9da4aa,shininess:80}),
  glass:new THREE.MeshPhongMaterial({color:0xa8e8f3,transparent:true,opacity:.48,shininess:90,side:THREE.DoubleSide}),
  water:new THREE.MeshPhongMaterial({color:0x4fb7df,transparent:true,opacity:.73,shininess:100})
};

const world=new THREE.Group();scene.add(world);
const groundMat=mats.grass.clone();
const ground=new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE,WORLD_SIZE),groundMat);
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.userData.ground=true;world.add(ground);
const grid=new THREE.GridHelper(WORLD_SIZE,WORLD_SIZE,0x679b5f,0x7abb70);
grid.position.y=.008;grid.material.opacity=.13;grid.material.transparent=true;world.add(grid);

const waterMeshes=[];
{
  const river=new THREE.Mesh(new THREE.PlaneGeometry(14,145),mats.water);river.rotation.x=-Math.PI/2;river.rotation.z=.1;river.position.set(-38,.035,3);world.add(river);waterMeshes.push(river);
  const lake=new THREE.Mesh(new THREE.CircleGeometry(18,48),mats.water);lake.rotation.x=-Math.PI/2;lake.position.set(42,.04,-38);lake.scale.set(1.35,.78,1);world.add(lake);waterMeshes.push(lake);
}
const plotCenters=[[-58,-30],[-58,28],[-4,-54],[-2,53],[52,-8],[55,48]];
for(const [i,p] of plotCenters.entries()){
  const pad=new THREE.Mesh(new THREE.PlaneGeometry(34,30),lm(i%2?0x96d483:0x9cda89));pad.material.transparent=true;pad.material.opacity=.38;pad.rotation.x=-Math.PI/2;pad.position.set(p[0],.012,p[1]);world.add(pad);
}

const blocks=new Map();
const objects=[];
const ranch=[];
const history=[];
const redoStack=[];
let changed=false;
let settings={};
try{settings=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}catch{}
let season=settings.season||'spring';
let weather=settings.weather||'sunny';
let timeSpeed=Number(settings.timeSpeed||1);
let simMinutes=settings.simMinutes??480;
let worldDay=Number(settings.worldDay||1);
let economy=createEconomyState(settings.economy||{});

function id(){return globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`}
function box(parent,sx,sy,sz,x,y,z,material='white'){
  const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),typeof material==='number'?lm(material):(mats[material]||mats.white));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;
}
function sphere(parent,r,x,y,z,color,scale=[1,1,1]){
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),typeof color==='number'?lm(color):(mats[color]||mats.white));m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;parent.add(m);return m;
}
function starGeometry(){
  const s=new THREE.Shape();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2===0?.48:.22,x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y)}s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:1});g.center();return g;
}
function geometryFor(shape){
  if(shape==='rect')return new THREE.BoxGeometry(2,1,1);
  if(shape==='cylinder')return new THREE.CylinderGeometry(.5,.5,1,20);
  if(shape==='sphere')return new THREE.SphereGeometry(.58,20,14);
  if(shape==='triangle'){const s=new THREE.Shape();s.moveTo(-.55,-.5);s.lineTo(.55,-.5);s.lineTo(0,.5);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false});g.translate(0,0,-.5);g.rotateY(Math.PI/2);return g}
  if(shape==='slope'){const s=new THREE.Shape();s.moveTo(-.5,-.5);s.lineTo(.5,-.5);s.lineTo(.5,.5);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false});g.translate(0,0,-.5);g.rotateY(Math.PI/2);return g}
  if(shape==='roof'){const s=new THREE.Shape();s.moveTo(-.65,-.4);s.lineTo(0,.4);s.lineTo(.65,-.4);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:1.4,bevelEnabled:false});g.translate(0,0,-.7);g.rotateY(Math.PI/2);return g}
  return new THREE.BoxGeometry(1,1,1);
}
function addBlock(rec,mark=true){
  const k=rec.id||id();const m=new THREE.Mesh(geometryFor(rec.shape||'cube'),mats[rec.mat]||mats.wood);m.position.set(rec.x,rec.y,rec.z);m.rotation.y=rec.rot||0;m.castShadow=m.receiveShadow=true;m.userData={kind:'block',id:k,shape:rec.shape||'cube',mat:rec.mat||'wood'};world.add(m);blocks.set(k,m);
  if(mark){history.push({op:'addBlock',id:k});redoStack.length=0;changed=true}return m;
}
function makeDoor(g){box(g,1.05,2.05,.16,0,1.03,0,'darkwood');sphere(g,.06,.35,1.02,-.1,0xe3c65f)}
function makeWindow(g){box(g,1.5,.12,.12,0,1.35,0,'white');box(g,.12,1.25,.12,-.69,.75,0,'white');box(g,.12,1.25,.12,.69,.75,0,'white');const pane=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.05),mats.glass);pane.position.set(0,.8,.02);g.add(pane)}
function makeShippingBox(g){box(g,1.55,1.05,1.05,0,.52,0,'wood');const lid=box(g,1.65,.16,1.15,0,1.12,0,'darkwood');lid.rotation.x=-.12;box(g,.9,.36,.05,0,.65,-.54,0xffefd1)}
function makePetBed(g){const base=new THREE.Mesh(new THREE.CylinderGeometry(.65,.70,.18,28),lm(0xc98fa2));base.position.y=.12;base.castShadow=true;g.add(base);const rim=new THREE.Mesh(new THREE.TorusGeometry(.54,.13,10,28),lm(0xe4b4c1));rim.rotation.x=Math.PI/2;rim.position.y=.23;rim.castShadow=true;g.add(rim);sphere(g,.34,0,.23,0,0xffe6c8,[1.2,.32,1])}
function makeGardenSwing(g){for(const x of[-.95,.95]){box(g,.12,2.35,.12,x,1.15,0,'darkwood');const foot=box(g,.12,1.25,.12,x+(x<0?.28:-.28),.58,.42,'darkwood');foot.rotation.z=x<0?-.42:.42}box(g,2.2,.14,.14,0,2.28,0,'darkwood');for(const x of[-.48,.48])box(g,.025,1.25,.025,x,1.56,.02,0xc5b28e);box(g,1.3,.13,.52,0,.94,.02,'wood')}
function makeStarBed(g){box(g,2.25,.44,1.45,0,.34,0,'darkwood');box(g,2.08,.28,1.31,0,.63,0,0xfff2d8);box(g,.74,.17,1.08,-.58,.81,0,'white');const star=new THREE.Mesh(starGeometry(),lm(0xf1cf65));star.position.set(0,1.08,.67);star.rotation.y=Math.PI;star.castShadow=true;g.add(star)}
function makeCloudLamp(g){box(g,.10,1.18,.10,0,.60,0,'metal');box(g,.58,.08,.40,0,.05,0,'metal');for(const [x,y,s] of [[-.22,1.34,.24],[0,1.43,.31],[.26,1.34,.23],[.48,1.29,.17]])sphere(g,s,x,y,0,0xfff3c7,[1.15,.78,.75])}
function makeFlowerArch(g){for(const x of[-.75,.75])box(g,.10,1.72,.10,x,.86,0,'wood');const arch=new THREE.Mesh(new THREE.TorusGeometry(.75,.07,8,22,Math.PI),lm(0x6faa61));arch.position.y=1.72;arch.rotation.z=Math.PI;g.add(arch);for(let i=0;i<8;i++){const a=i/7*Math.PI,x=Math.cos(a)*.75,y=1.72+Math.sin(a)*.75;sphere(g,.075,x,y,-.03,i%2?0xf3a8bd:0xf1d672,[1,1,.55])}}

function addObject(rec,mark=true){
  const g=new THREE.Group();g.position.set(rec.x||0,0,rec.z||0);g.rotation.y=rec.rot||0;
  g.userData={kind:'object',id:rec.id||id(),type:rec.type,solid:true,growth:rec.growth??.2,affection:rec.affection??0,lastProductDay:rec.lastProductDay??0,productReady:rec.productReady};
  const t=rec.type;
  if(t==='chair'){box(g,.8,.12,.8,0,.65,0,'wood');for(const X of[-.3,.3])for(const Z of[-.3,.3])box(g,.12,.7,.12,X,.3,Z,'wood');box(g,.8,.78,.12,0,1,-.34,'wood')}
  else if(t==='table'){box(g,1.8,.14,1.2,0,1,0,'wood');for(const X of[-.72,.72])for(const Z of[-.42,.42])box(g,.12,1,.12,X,.5,Z,'wood')}
  else if(t==='sofa'){box(g,2.2,.55,.9,0,.42,0,0xe98ca0);box(g,2.2,.9,.25,0,.92,.32,0xe98ca0);box(g,.28,.65,.9,-1.08,.55,0,0xe98ca0);box(g,.28,.65,.9,1.08,.55,0,0xe98ca0)}
  else if(t==='bed'){box(g,2.2,.45,1.45,0,.35,0,'darkwood');box(g,2.05,.3,1.3,0,.65,0,0xfff0d8);box(g,.75,.18,1.1,-.58,.83,0,'white')}
  else if(t==='cabinet'){box(g,1.6,1.45,.5,0,.72,0,'wood');for(const X of[-.42,.42])box(g,.06,.32,.06,X,.78,-.27,'metal')}
  else if(t==='fridge'){box(g,.95,1.9,.85,0,.95,0,0xf2f5f6);box(g,.04,.7,.05,.28,1.35,-.44,'metal')}
  else if(t==='washer'){box(g,1,1.05,.85,0,.52,0,'white');const d=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.04,24),mats.metal);d.rotation.x=Math.PI/2;d.position.set(0,.48,-.45);g.add(d)}
  else if(t==='tv'){box(g,1.7,1,.12,0,1.15,0,0x242a31);box(g,.15,.65,.15,0,.45,.1,'metal');box(g,1,.08,.55,0,.1,.1,'metal')}
  else if(t==='stove'){box(g,1.05,.95,.8,0,.48,0,0x55575b);for(const X of[-.25,.25])for(const Z of[-.18,.18]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.02,16),lm(0x202226));p.position.set(X,.97,Z);g.add(p)}}
  else if(t==='lamp'){box(g,.12,1.35,.12,0,.7,0,'metal');sphere(g,.32,0,1.5,0,0xffefa8);g.userData.solid=false}
  else if(t==='door')makeDoor(g);
  else if(t==='window')makeWindow(g);
  else if(t==='shippingBox'){makeShippingBox(g);g.userData.shippingBox=true}
  else if(t==='petBedRound'){makePetBed(g);g.userData.solid=false}
  else if(t==='swingGarden')makeGardenSwing(g);
  else if(t==='starBed')makeStarBed(g);
  else if(t==='cloudLamp'){makeCloudLamp(g);g.userData.solid=false}
  else if(t==='flowerArch')makeFlowerArch(g);
  else if(t==='petDog'||t==='petCat'){
    const pet=t==='petDog'?createCuteDog():createCuteCat();g.add(pet);g.userData.solid=false;g.userData.pet=true;g.userData.model=pet;
  }
  else if(['cow','sheep','chicken'].includes(t)){
    const a=t==='cow'?createCow():t==='sheep'?createSheep():createChicken();g.add(a);g.userData.solid=false;g.userData.ranch=true;g.userData.model=a;g.userData.home=new THREE.Vector2(g.position.x,g.position.z);g.userData.phase=Math.random()*6.28;
    if(g.userData.productReady===undefined)g.userData.productReady=true;ranch.push(g);
  }
  else if(['carrot','corn','pumpkin','tomato','strawberry','cabbage','potato'].includes(t)){
    const crop=createCropModel(t,g.userData.growth);g.add(crop);g.userData.solid=false;g.userData.crop=t;g.userData.model=crop;g.userData.lastGrowthDay=rec.lastGrowthDay??worldDay;
  }
  else if(['appleTree','orangeTree','peachTree'].includes(t)){
    const kind=t.replace('Tree','');const tree=createFruitTreeModel(kind,rec.growth??1,season);g.add(tree);g.userData.treeKind=kind;g.userData.model=tree;g.userData.solid=true;
  }
  else if(t==='tree'){box(g,.42,2,.42,0,1,0,'wood');sphere(g,1.18,0,2.15,0,0x67ad62,[1,.9,1])}
  else if(t==='fence'){box(g,2,.12,.12,0,.6,0,'wood');box(g,2,.12,.12,0,1.08,0,'wood');box(g,.14,1.35,.14,-.9,.65,0,'wood');box(g,.14,1.35,.14,.9,.65,0,'wood')}
  else return null;
  world.add(g);objects.push(g);if(mark){history.push({op:'addObject',id:g.userData.id});redoStack.length=0;changed=true}return g;
}

function createAvatar(style){return createCuteChildAvatar(style)}
let player=createAvatar(settings.avatar||'girl');world.add(player);player.position.set(0,0,8);

const SHOP_BUILD_MAP={
  'sapling-peach':['peachTree','🌳','特選桃樹'],
  'pet-bed-round':['petBedRound','🧺','圓圓寵物床'],
  'lamp-cloud':['cloudLamp','☁️','雲朵燈'],
  'arch-flower':['flowerArch','🌸','花朵拱門'],
  'swing-garden':['swingGarden','🌿','花園鞦韆'],
  'bed-star':['starBed','⭐','星星床']
};
const catalog={
  '形狀':[['cube','▣','正方體'],['rect','▬','長方體'],['sphere','●','圓形'],['cylinder','⬤','圓柱'],['triangle','▲','三角形'],['slope','◢','斜坡'],['roof','⌂','屋頂塊']],
  '建材':[['wood','🪵','木材'],['darkwood','🟫','深木'],['stone','🪨','石材'],['marble','◻️','大理石'],['brick','🧱','磚'],['concrete','⬜','混凝土'],['glass','🪟','玻璃'],['roof','🏠','屋瓦'],['pink','🌸','粉色']],
  '建築':[['door','🚪','門'],['window','🪟','窗'],['fence','🪵','圍欄']],
  '家具':[['chair','🪑','椅子'],['table','🍽️','桌子'],['sofa','🛋️','沙發'],['bed','🛏️','床'],['lamp','💡','燈']],
  '家電':[['fridge','🧊','冰箱'],['stove','🍳','爐具'],['washer','🧺','洗衣機'],['tv','📺','電視'],['cabinet','🗄️','櫃子']],
  '農作':[['carrot','🥕','紅蘿蔔'],['corn','🌽','玉米'],['pumpkin','🎃','南瓜'],['tomato','🍅','番茄'],['strawberry','🍓','草莓'],['cabbage','🥬','高麗菜'],['potato','🥔','馬鈴薯']],
  '果樹':[['appleTree','🍎','蘋果樹'],['orangeTree','🍊','橘子樹'],['tree','🌳','樹木']],
  '動物':[['petDog','🐶','小狗'],['petCat','🐱','小貓'],['chicken','🐔','雞'],['cow','🐄','牛'],['sheep','🐑','羊']],
  '生活':[['shippingBox','📦','出貨箱']],
  '商城':[]
};
function refreshShopCatalog(){
  const seen=new Set();catalog['商城']=economy.owned.flatMap(o=>{if(seen.has(o.itemId)||!SHOP_BUILD_MAP[o.itemId])return[];seen.add(o.itemId);return[SHOP_BUILD_MAP[o.itemId]]});
  if(category==='商城')drawItems();
}
let category='形狀',selectedShape='cube',selectedMat='wood',selectedObject='door',objRot=0,cameraMode=settings.cameraMode||(settings.third?'third':'first');
function drawCats(){ui.cats.innerHTML='';for(const k of Object.keys(catalog)){const b=document.createElement('button');b.className='cat'+(k===category?' on':'');b.textContent=k+(k==='商城'&&catalog[k].length?` ${catalog[k].length}`:'');b.onclick=()=>{category=k;if(k==='形狀')selectedShape=catalog[k][0]?.[0]||'cube';else if(k==='建材')selectedMat=catalog[k][0]?.[0]||'wood';else selectedObject=catalog[k][0]?.[0]||selectedObject;drawCats();drawItems()};ui.cats.appendChild(b)}}
function drawItems(){ui.items.innerHTML='';const rows=catalog[category]||[];if(!rows.length&&category==='商城'){const d=document.createElement('div');d.className='item';d.style.minWidth='120px';d.style.fontSize='10px';d.textContent='到 🎒生活 商城看看';ui.items.appendChild(d);return}for(const [idv,ico,name] of rows){const active=category==='形狀'?idv===selectedShape:category==='建材'?idv===selectedMat:idv===selectedObject,b=document.createElement('button');b.className='item'+(active?' on':'');b.innerHTML=`${ico}<small>${name}</small>`;b.onclick=()=>{if(category==='形狀')selectedShape=idv;else if(category==='建材')selectedMat=idv;else selectedObject=idv;drawItems()};ui.items.appendChild(b)}}
refreshShopCatalog();drawCats();drawItems();

const ray=new THREE.Raycaster();
const cameraRay=new THREE.Raycaster();
function allTargets(){const a=[ground,...waterMeshes,...blocks.values()];for(const g of objects)g.traverse(o=>{if(o.isMesh)a.push(o)});return a}
function aim(){ray.setFromCamera(new THREE.Vector2(0,0),camera);return ray.intersectObjects(allTargets(),false)[0]}
function inWater(x,z){const riverX=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-riverX)<7||dx*dx+dz*dz<324}
const snap=v=>Math.round(v);
function place(){
  const h=aim();if(!h)return;const p=h.point.clone();
  if(category==='形狀'||category==='建材'){
    let pos=h.object.userData?.kind==='block'?h.object.position.clone().add(h.face.normal):p;pos.y=h.object.userData?.kind==='block'?Math.max(.5,Math.round(pos.y*2)/2):.5;if(inWater(pos.x,pos.z))return toast('水面上目前不能建造');addBlock({x:snap(pos.x),y:pos.y,z:snap(pos.z),shape:category==='形狀'?selectedShape:'cube',mat:selectedMat,rot:objRot});
  }else{
    if(inWater(p.x,p.z))return toast('水面上目前不能放置');addObject({type:selectedObject,x:snap(p.x),z:snap(p.z),rot:objRot,growth:.18});
  }
}
function remove(){const h=aim();if(!h||h.object===ground||waterMeshes.includes(h.object))return;let o=h.object;while(o.parent&&o.parent!==world)o=o.parent;if(o.userData.kind==='object'){world.remove(o);const i=objects.indexOf(o);if(i>=0)objects.splice(i,1);const r=ranch.indexOf(o);if(r>=0)ranch.splice(r,1);changed=true}else if(h.object.userData.kind==='block'){world.remove(h.object);blocks.delete(h.object.userData.id);changed=true}}

let yaw=-.4,pitch=-.16,moveX=0,moveY=0,vy=0,onGround=true;
function solidAt(x,z,y=1){if(Math.abs(x)>HALF-2||Math.abs(z)>HALF-2||inWater(x,z))return true;const p=new THREE.Vector3(x,Math.max(.35,y),z);for(const b of blocks.values())if(new THREE.Box3().setFromObject(b).expandByScalar(.24).containsPoint(p))return true;for(const g of objects)if(g.userData.solid&&new THREE.Box3().setFromObject(g).expandByScalar(.22).containsPoint(p))return true;return false}
function movePlayer(dx,dz){const nx=player.position.x+dx,nz=player.position.z+dz;if(!solidAt(nx,player.position.z,player.position.y+1))player.position.x=nx;if(!solidAt(player.position.x,nz,player.position.y+1))player.position.z=nz}

function snapshot(){return {version:4.2,savedAt:Date.now(),player:{x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch},blocks:[...blocks.values()].map(b=>({id:b.userData.id,x:b.position.x,y:b.position.y,z:b.position.z,shape:b.userData.shape,mat:b.userData.mat,rot:b.rotation.y})),objects:objects.map(o=>({id:o.userData.id,type:o.userData.type,x:o.position.x,z:o.position.z,rot:o.rotation.y,growth:o.userData.growth,lastGrowthDay:o.userData.lastGrowthDay,affection:o.userData.affection,lastProductDay:o.userData.lastProductDay,productReady:o.userData.productReady}))}}
function saveWorld(silent=false){try{localStorage.setItem(SAVE_KEY,JSON.stringify(snapshot()));changed=false;if(!silent)toast('世界已存檔 ✓')}catch{if(!silent)toast('存檔空間不足')}}
function loadWorld(){try{const raw=localStorage.getItem(SAVE_KEY)||localStorage.getItem(OLD_SAVE_KEY);if(!raw)return false;const d=JSON.parse(raw);for(const r of d.blocks||[])addBlock(r,false);for(const r of d.objects||[]){if(r.type==='crop')r.type='carrot';if(r.type==='fruitTree')r.type='appleTree';addObject(r,false)}if(d.player){player.position.set(d.player.x||0,d.player.y||0,d.player.z||8);yaw=d.player.yaw??yaw;pitch=d.player.pitch??pitch}changed=false;return true}catch(e){console.warn(e);return false}}
const loaded=loadWorld();
if(!loaded){
  addObject({id:'starter-apple',type:'appleTree',x:4,z:11,growth:1},false);
  addObject({id:'starter-carrot',type:'carrot',x:2,z:10,growth:1},false);
  addObject({id:'starter-dog',type:'petDog',x:-2,z:10},false);
  addObject({id:'starter-box',type:'shippingBox',x:6,z:10},false);
}

const particles=new THREE.Group();scene.add(particles);
function rebuildWeather(){while(particles.children.length)particles.remove(particles.children[0]);scene.fog=new THREE.Fog(scene.background,weather==='fog'?22:62,weather==='fog'?95:170);if(weather==='rain'||weather==='snow'){const count=weather==='rain'?260:190,geo=new THREE.BufferGeometry(),arr=new Float32Array(count*3);for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*70;arr[i*3+1]=Math.random()*35;arr[i*3+2]=(Math.random()-.5)*70}geo.setAttribute('position',new THREE.BufferAttribute(arr,3));particles.add(new THREE.Points(geo,new THREE.PointsMaterial({color:weather==='rain'?0xa8d8ff:0xffffff,size:weather==='rain'?.09:.18,transparent:true,opacity:.75})))}}
function rebuildTree(o){if(!o.userData.treeKind)return;o.remove(o.userData.model);o.userData.model=createFruitTreeModel(o.userData.treeKind,o.userData.growth??1,season);o.add(o.userData.model)}
function rebuildCrop(o){if(!o.userData.crop)return;o.remove(o.userData.model);o.userData.model=createCropModel(o.userData.crop,o.userData.growth);o.add(o.userData.model)}
function refreshSeasonModels(){groundMat.color.setHex({spring:0x8fd47b,summer:0x70c36b,autumn:0xb8bd62,winter:0xdce8e5}[season]);for(const o of objects)if(o.userData.treeKind)rebuildTree(o);ui.season.value=season}
function applyWeather(){ui.weather.value=weather;rebuildWeather()}
refreshSeasonModels();applyWeather();

function cameraLabel(){return cameraMode==='first'?'👁 第一人稱':cameraMode==='third'?'🎥 第三人稱':'🌾 牧場視角'}
function saveSettings(){settings={...settings,avatar:player.userData.avatarStyle||'girl',cameraMode,third:cameraMode==='third',season,weather,timeSpeed,simMinutes,worldDay,economy};localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function setAvatar(style){const p=player.position.clone();const rot=player.rotation.y;world.remove(player);player=createAvatar(style);player.position.copy(p);player.rotation.y=rot;world.add(player);ui.avatar.value=style;saveSettings()}
ui.avatar.value=settings.avatar||'girl';ui.timeSpeed.value=String(timeSpeed);ui.cam.textContent=cameraLabel();

function renderLifePanel(){
  lifeUI.coins.textContent=`🪙 ${economy.coins}`;lifeUI.shipping.textContent=`📦 待結算 ${pendingShippingValue(economy)}`;
  const invEntries=Object.entries(economy.inventory).filter(([,q])=>q>0);
  lifeUI.inventory.innerHTML=invEntries.length?invEntries.map(([idv,qty])=>`<div class="invRow"><div><div class="invName">${ITEM_NAMES[idv]||idv}</div><div class="invMeta">可以保留，也可以拿去出貨</div></div><strong>× ${qty}</strong></div>`).join(''):'<div class="lifeEmpty">目前背包是空的。收成後會放在這裡。</div>';
  lifeUI.shop.innerHTML=SHOP_ITEMS.map(item=>{const owned=ownedCount(economy,item.id)>0,can=economy.coins>=item.price;return `<div class="shopRow"><div><div class="shopName">${item.icon||'✨'} ${item.name}</div><div class="shopMeta">${owned?'已解鎖，可在下方「商城」分類放置':'遊戲金幣 '+item.price}</div></div><button class="buyBtn" data-buy="${item.id}" ${owned?'disabled':''}>${owned?'已擁有':can?'購買':'🪙 '+item.price}</button></div>`}).join('');
}
lifeUI.btn.onclick=()=>{renderLifePanel();lifeUI.panel.classList.add('open')};lifeUI.close.onclick=()=>lifeUI.panel.classList.remove('open');
lifeUI.shop.onclick=e=>{const btn=e.target.closest('[data-buy]');if(!btn)return;const r=buyShopItem(economy,btn.dataset.buy);if(r.ok){toast(`已買到 ${r.item.name} ✓`);refreshShopCatalog();drawCats();renderLifePanel();saveSettings()}else if(r.reason==='coins')toast(`還差 ${r.need} 金幣`);else if(r.reason==='owned')toast('這個已經有了')};

function nearestLifeTarget(){
  let best=null,bestDist=2.45;
  for(const o of objects){const d=Math.hypot(o.position.x-player.position.x,o.position.z-player.position.z);if(d>=bestDist)continue;
    let action=null;
    if(o.userData.crop&&o.userData.growth>=.95)action='harvestCrop';
    else if(o.userData.treeKind&&o.userData.growth>=.95&&season!=='winter')action='harvestFruit';
    else if(o.userData.shippingBox)action='shipping';
    else if(o.userData.ranch&&o.userData.productReady)action='collectProduct';
    else if(o.userData.pet)action='pet';
    if(action){best={o,action};bestDist=d}
  }
  return best;
}
function interactionLabel(target){
  if(!target)return ['✨','互動'];
  if(target.action==='harvestCrop')return ['🧺','收成'];
  if(target.action==='harvestFruit')return ['🍎','採果'];
  if(target.action==='shipping')return ['📦','出貨'];
  if(target.action==='collectProduct')return [target.o.userData.type==='chicken'?'🥚':target.o.userData.type==='cow'?'🥛':'🧶','收取'];
  if(target.action==='pet')return ['💗','摸摸'];
  return ['✨','互動'];
}
let currentLifeTarget=null,lastHintAt=0;
function updateInteractionHint(t){if(t-lastHintAt<180)return;lastHintAt=t;currentLifeTarget=nearestLifeTarget();const [ico,label]=interactionLabel(currentLifeTarget);lifeUI.interact.innerHTML=`${ico}<small>${label}</small>`}
function interactLife(){
  const target=nearestLifeTarget();if(!target)return toast('附近沒有可以互動的東西');const o=target.o;
  if(target.action==='harvestCrop'){
    addInventory(economy,o.userData.crop,1);toast(`收成 ${ITEM_NAMES[o.userData.crop]} ×1`);o.userData.growth=.14;o.userData.lastGrowthDay=worldDay;rebuildCrop(o);changed=true;
  }else if(target.action==='harvestFruit'){
    addInventory(economy,o.userData.treeKind,1);toast(`採到 ${ITEM_NAMES[o.userData.treeKind]} ×1`);o.userData.growth=.72;o.userData.lastGrowthDay=worldDay;rebuildTree(o);changed=true;
  }else if(target.action==='shipping'){
    const r=shipAllSellable(economy);if(!r.count)return toast('背包裡目前沒有可出貨的收成');toast(`已放進出貨箱 ${r.count} 件・明早結算 ${r.value} 金幣`);
  }else if(target.action==='collectProduct'){
    const item=o.userData.type==='chicken'?'egg':o.userData.type==='cow'?'milk':'wool';addInventory(economy,item,1);o.userData.productReady=false;o.userData.lastProductDay=worldDay;toast(`收取 ${ITEM_NAMES[item]} ×1`);changed=true;
  }else if(target.action==='pet'){
    o.userData.affection=Math.min(100,(o.userData.affection||0)+1);o.userData.pettedUntil=performance.now()+1500;toast(o.userData.type==='petDog'?'摸摸小狗 💗':'摸摸小貓 💗');changed=true;
  }
  renderLifePanel();saveSettings();
}
lifeUI.interact.onclick=interactLife;

ui.add.onclick=place;ui.del.onclick=remove;ui.rot.onclick=()=>{objRot=(objRot+Math.PI/2)%(Math.PI*2);toast('已旋轉 90°')};ui.jump.onclick=()=>{if(onGround){vy=.15;onGround=false}};
ui.cam.onclick=()=>{cameraMode=cameraMode==='first'?'third':cameraMode==='third'?'farm':'first';ui.cam.textContent=cameraLabel();toast(cameraMode==='farm'?'牧場視角：人物會朝移動方向前進':cameraMode==='third'?'第三人稱：人物會朝移動方向轉身':'第一人稱');saveSettings()};
ui.admin.onclick=()=>ui.panel.classList.add('open');ui.closeAdmin.onclick=()=>ui.panel.classList.remove('open');ui.save.onclick=()=>saveWorld(false);
ui.season.onchange=e=>{season=e.target.value;refreshSeasonModels();saveSettings()};ui.weather.onchange=e=>{weather=e.target.value;applyWeather();saveSettings()};ui.timeSpeed.onchange=e=>{timeSpeed=Number(e.target.value);saveSettings()};ui.avatar.onchange=e=>setAvatar(e.target.value);
document.querySelector('#resetPos').onclick=()=>{player.position.set(0,0,8);yaw=-.4;pitch=-.16;toast('已回到中央出生點')};
document.querySelector('#backup').onclick=()=>navigator.clipboard?.writeText(JSON.stringify(snapshot())).then(()=>toast('世界備份已複製')).catch(()=>toast('此瀏覽器無法複製備份'));

const joy=ui.joy,knob=ui.knob;let joyId=null;
function setJoy(e){const r=joy.getBoundingClientRect();let x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),d=Math.hypot(x,y)||1,s=Math.min(39,d)/d;x*=s;y*=s;knob.style.transform=`translate(${x}px,${y}px)`;moveX=x/39;moveY=y/39}
joy.addEventListener('pointerdown',e=>{joyId=e.pointerId;joy.setPointerCapture(e.pointerId);setJoy(e)});joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId)setJoy(e)});function joyEnd(e){if(e.pointerId===joyId){joyId=null;moveX=moveY=0;knob.style.transform=''}}joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
let lookId=null,lx=0,ly=0;
renderer.domElement.addEventListener('pointerdown',e=>{if(cameraMode!=='farm'&&e.clientX>innerWidth*.29){lookId=e.pointerId;lx=e.clientX;ly=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)}});
renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerId!==lookId)return;yaw-=(e.clientX-lx)*.0075;pitch-=(e.clientY-ly)*.0061;pitch=Math.max(-1.08,Math.min(.6,pitch));lx=e.clientX;ly=e.clientY});
renderer.domElement.addEventListener('pointerup',e=>{if(e.pointerId===lookId)lookId=null});renderer.domElement.addEventListener('pointercancel',e=>{if(e.pointerId===lookId)lookId=null});

const seasonNames={spring:'春',summer:'夏',autumn:'秋',winter:'冬'};
const weatherNames={sunny:'晴',cloudy:'陰',rain:'雨',fog:'霧',snow:'雪'};
function toast(msg){ui.status.textContent=msg;clearTimeout(toast.t);toast.t=setTimeout(()=>ui.status.textContent=`${seasonNames[season]}・${weatherNames[weather]}・第 ${worldDay} 天・🪙 ${economy.coins}・自動存檔`,2100)}
function resize(){const w=Math.max(1,Math.round(visualViewport?.width||innerWidth)),h=Math.max(1,Math.round(visualViewport?.height||innerHeight));camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);renderer.domElement.style.width=w+'px';renderer.domElement.style.height=h+'px'}
addEventListener('resize',resize);visualViewport?.addEventListener('resize',resize);document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});document.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('beforeunload',()=>{saveWorld(true);saveSettings()});document.addEventListener('visibilitychange',()=>{if(document.hidden){saveWorld(true);saveSettings()}});setInterval(()=>{if(changed)saveWorld(true)},15000);

function growDay(){
  worldDay++;
  const earned=settleShipping(economy);if(earned)toast(`早安！昨天的出貨收入 +${earned} 金幣`);
  for(const o of objects){
    if(o.userData.crop&&o.userData.growth<1){const seasonOk={carrot:['spring','autumn'],corn:['summer'],pumpkin:['autumn'],tomato:['spring','summer'],strawberry:['spring'],cabbage:['spring','winter'],potato:['spring','autumn']}[o.userData.crop]?.includes(season);if(seasonOk){const bonus=weather==='rain'?.23:.15;o.userData.growth=Math.min(1,o.userData.growth+bonus);o.userData.lastGrowthDay=worldDay;rebuildCrop(o);changed=true}}
    if(o.userData.treeKind&&o.userData.growth<1&&season!=='winter'){o.userData.growth=Math.min(1,o.userData.growth+.09);o.userData.lastGrowthDay=worldDay;rebuildTree(o);changed=true}
    if(o.userData.ranch&&!o.userData.productReady){const wait=o.userData.type==='sheep'?3:1;if(worldDay-(o.userData.lastProductDay||0)>=wait)o.userData.productReady=true}
  }
  renderLifePanel();saveSettings();
}
function updateLighting(dt){const prev=simMinutes;simMinutes=(simMinutes+dt*.018*timeSpeed)%1440;if(simMinutes<prev)growDay();const hour=simMinutes/60,ang=(hour-6)/24*Math.PI*2,daylight=Math.max(0,Math.sin(ang));sun.intensity=.15+daylight*2.05;moon.intensity=(1-daylight)*.28;sun.position.set(Math.cos(ang)*65,Math.max(8,Math.sin(ang)*70),25);const sky=daylight<.18?0x263858:weather==='cloudy'||weather==='rain'?0xa9bac5:season==='winter'?0xb9d6e6:0x9ed9ff;scene.background.setHex(sky);scene.fog.color.copy(scene.background);ui.clock.textContent=`${String(Math.floor(hour)).padStart(2,'0')}:${String(Math.floor(simMinutes%60)).padStart(2,'0')}`}
function updateWeather(dt){if(particles.children.length){const pts=particles.children[0],a=pts.geometry.attributes.position.array;for(let i=1;i<a.length;i+=3){a[i]-=(weather==='rain'?.32:.07)*dt;if(a[i]<0)a[i]=35}pts.geometry.attributes.position.needsUpdate=true;particles.position.x=player.position.x;particles.position.z=player.position.z}}
function updateCreatures(t,dt){
  for(const g of objects)if(g.userData.pet){const dx=player.position.x-g.position.x,dz=player.position.z-g.position.z,dist=Math.hypot(dx,dz),petted=(g.userData.pettedUntil||0)>t,moving=!petted&&dist>2.7&&dist<25;if(moving){const target=Math.atan2(-dx,-dz);g.rotation.y=THREE.MathUtils.lerp(g.rotation.y,target,.14);g.position.x+=dx/dist*.018*dt;g.position.z+=dz/dist*.018*dt}animateCuteCharacter(g.userData.model,t,moving,petted?1.8:1.1)}
  for(const g of ranch){g.userData.phase+=.004*dt;const hx=g.userData.home.x,hz=g.userData.home.y,tx=hx+Math.sin(g.userData.phase)*3.2,tz=hz+Math.cos(g.userData.phase*.83)*3.2,dx=tx-g.position.x,dz=tz-g.position.z,dist=Math.hypot(dx,dz);if(dist>.12){const target=Math.atan2(-dx,-dz);g.rotation.y=THREE.MathUtils.lerp(g.rotation.y,target,.10);g.position.x+=dx/dist*.006*dt;g.position.z+=dz/dist*.006*dt}animateAnimal(g.userData.model,t,dist>.12?.006:0)}
}
function safeCameraPosition(from,desired){
  const dir=desired.clone().sub(from);const dist=dir.length();if(dist<.1)return desired;dir.normalize();cameraRay.set(from,dir);cameraRay.far=dist;const targets=[];for(const b of blocks.values())targets.push(b);for(const o of objects)if(o.userData.solid)o.traverse(m=>{if(m.isMesh)targets.push(m)});const hit=cameraRay.intersectObjects(targets,false)[0];if(hit&&hit.distance<dist)return from.clone().add(dir.multiplyScalar(Math.max(.65,hit.distance-.28)));return desired;
}

let last=performance.now();
function loop(t){
  requestAnimationFrame(loop);const dt=Math.min(2.2,(t-last)/16.67);last=t;
  const controlYaw=cameraMode==='farm'?FARM_YAW:yaw;
  const f=new THREE.Vector3(-Math.sin(controlYaw),0,-Math.cos(controlYaw));
  const r=new THREE.Vector3(Math.cos(controlYaw),0,-Math.sin(controlYaw));
  const speed=.135*dt,moving=Math.abs(moveX)+Math.abs(moveY)>.04;
  const dx=f.x*(-moveY)*speed+r.x*moveX*speed,dz=f.z*(-moveY)*speed+r.z*moveX*speed;
  movePlayer(dx,dz);vy-=.009*dt;player.position.y+=vy*dt;if(player.position.y<=0){player.position.y=0;vy=0;onGround=true}
  if(cameraMode==='first')player.rotation.y=yaw;else if(moving){const target=Math.atan2(-dx,-dz);player.rotation.y=THREE.MathUtils.lerp(player.rotation.y,target,.24)}
  animateCuteCharacter(player,t,moving,1.15);
  const eye=player.position.clone().add(new THREE.Vector3(0,1.62,0));
  if(cameraMode==='third'){
    const desired=eye.clone().add(new THREE.Vector3(Math.sin(yaw)*4.6,2.25,Math.cos(yaw)*4.6));camera.position.lerp(safeCameraPosition(eye,desired),.30);camera.lookAt(eye.clone().add(new THREE.Vector3(-Math.sin(yaw)*2.4,pitch*2.2,-Math.cos(yaw)*2.4)));player.visible=true;
  }else if(cameraMode==='farm'){
    const desired=player.position.clone().add(new THREE.Vector3(Math.sin(FARM_YAW)*7.8,6.6,Math.cos(FARM_YAW)*7.8));camera.position.lerp(safeCameraPosition(player.position.clone().add(new THREE.Vector3(0,1,0)),desired),.20);camera.lookAt(player.position.clone().add(new THREE.Vector3(0,.85,0)));player.visible=true;
  }else{
    camera.position.copy(eye);camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;player.visible=false;
  }
  updateLighting(dt);updateWeather(dt);updateCreatures(t,dt);updateInteractionHint(t);renderer.render(scene,camera);
}

resize();renderLifePanel();toast(loaded?'V0.4.2 已接續原世界存檔':'V0.4.2 已建立新的長期世界');requestAnimationFrame(loop);
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
