import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Non-destructive V0.4.5 visual polish layered on top of the live procedural models.
// Original geometry only; this runtime intentionally avoids replacing the base animation/state owners.
const polished=new WeakSet();
const mat=(color,roughness=.84,metalness=.015)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const dark=mat(0x3a3130,.78),warm=mat(0xf3d8b7,.9),cream=mat(0xfff4dc,.9),pink=mat(0xe88fa8,.86),blue=mat(0x6b9fc9,.84),gold=mat(0xe7bf63,.72,.04);
function ellipsoid(parent,r,x,y,z,material,scale=[1,1,1],segments=14){const m=new THREE.Mesh(new THREE.SphereGeometry(r,segments,Math.max(8,segments-4)),material);m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function capsule(parent,r,length,x,y,z,material,rot=[0,0,0]){const p=new THREE.Group();p.position.set(x,y,z);p.rotation.set(...rot);const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,length-r*2),5,10),material);m.castShadow=true;m.receiveShadow=true;p.add(m);parent.add(p);return p}
function torus(parent,major,tube,x,y,z,material,rot=[0,0,0],arc=Math.PI*2){const m=new THREE.Mesh(new THREE.TorusGeometry(major,tube,7,18,arc),material);m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m}
function cone(parent,r,h,x,y,z,material,rot=[0,0,0],scale=[1,1,1]){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,9),material);m.position.set(x,y,z);m.rotation.set(...rot);m.scale.set(...scale);m.castShadow=true;parent.add(m);return m}
function whisker(parent,x,y,z,side,material=cream){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.set(0,side<0?-.22:.22,side<0?-.10:.10);for(const dy of[-.028,.012,.052])capsule(g,.006,.23,side*.105,dy,-.02,material,[0,0,Math.PI/2]);parent.add(g);return g}

function polishAvatar(g){
  const u=g?.userData;if(!u?.avatarStyle||polished.has(g))return false;const v=u.visual||g,p=u.animatedParts||{};
  const girl=u.avatarStyle==='girl';
  const collar=torus(v,.205,.018,0,1.365,-.205,cream,[Math.PI/2,0,0],Math.PI*1.42);collar.rotation.z=.64;
  for(const arm of[p.leftArm,p.rightArm])if(arm)torus(arm,.087,.014,0,-.20,-.005,cream,[Math.PI/2,0,0]);
  for(const leg of[p.leftLeg,p.rightLeg])if(leg){torus(leg,.112,.014,0,-.26,-.035,cream,[Math.PI/2,0,0]);for(const z of[-.15,-.10])capsule(leg,.009,.12,0,-.31,z,dark,[0,0,Math.PI/2]);ellipsoid(leg,.055,0,-.325,-.205,cream,[1.45,.40,.62],10)}
  const hairColor=girl?0x68483b:0x4f3c34,hair=mat(hairColor,.93);
  ellipsoid(v,.075,-.31,1.79,-.16,hair,[.68,1.28,.50],12);ellipsoid(v,.075,.31,1.79,-.16,hair,[.68,1.28,.50],12);
  if(girl){ellipsoid(v,.07,-.33,1.53,-.02,pink,[1.35,.56,.52],10);ellipsoid(v,.07,.33,1.53,-.02,pink,[1.35,.56,.52],10)}else{ellipsoid(v,.085,-.24,1.97,-.12,hair,[.70,.90,.62],10);ellipsoid(v,.085,.24,1.97,-.12,hair,[.70,.90,.62],10)}
  const pocket=new THREE.Mesh(new THREE.BoxGeometry(.18,.12,.025),girl?pink:blue);pocket.position.set(0,1.07,-.302);pocket.rotation.x=-.04;pocket.castShadow=true;v.add(pocket);
  for(const x of[-.115,.115])capsule(v,.006,.043,x,1.72,-.341,dark,[0,0,x<0?-.28:.28]);
  const cheek=mat(0xf3a8a5,.92);ellipsoid(v,.026,-.165,1.69,-.354,cheek,[1.5,.55,.35],9);ellipsoid(v,.026,.165,1.69,-.354,cheek,[1.5,.55,.35],9);
  polished.add(g);return true;
}

function installPetLocomotion(g){const u=g?.userData,p=u?.animatedParts;if(!u?.petType||!Array.isArray(p?.legs)||u.petLocomotionSchema===2)return;const host=g.parent||g,state={x:host.position.x,z:host.position.z,phase:Math.random()*Math.PI*2},previous=g.onBeforeRender;u.petLocomotionSchema=2;g.onBeforeRender=function(...args){if(previous)previous.apply(this,args);if(['sleep','petResponse'].includes(u.petState||'idle')){state.x=host.position.x;state.z=host.position.z;return}const dx=host.position.x-state.x,dz=host.position.z-state.z,travel=Math.hypot(dx,dz);state.x=host.position.x;state.z=host.position.z;const moving=travel>.00045;if(moving)state.phase+=Math.min(.42,travel*18);const phase=state.phase,amp=u.petType==='cat'?.38:.35,lift=u.petType==='cat'?.030:.026;p.legs.forEach((leg,i)=>{const a=phase+(i===0||i===3?0:Math.PI),step=Math.sin(a);leg.rotation.z=0;leg.rotation.x=moving?step*amp:0;const base=leg.userData._agcbBaseY??(leg.userData._agcbBaseY=leg.position.y);leg.position.y=base+(moving?Math.max(0,step)*lift:0)});if(u.body){u.body.position.y=(u.baseBodyY||.48)-(moving?Math.abs(Math.sin(phase*2))*.012:0);u.body.rotation.z=moving?Math.sin(phase)*.012:0}if(p.tail&&moving)p.tail.rotation.y=Math.sin(phase)*.28}}

function polishPet(g){
  const u=g?.userData;if(!u?.petType||polished.has(g))return false;const dog=u.petType==='dog';
  if(dog){
    const nose=mat(0x2b2928,.72),paw=mat(0xe8caa8,.91);
    ellipsoid(g,.13,-.27,.47,.02,warm,[.92,1.18,.82],12);ellipsoid(g,.13,.27,.47,.02,warm,[.92,1.18,.82],12);
    ellipsoid(g,.115,0,.42,-.36,cream,[1.02,1.18,.36],12);torus(g,.205,.025,0,.585,-.26,pink,[Math.PI/2,0,0]);ellipsoid(g,.035,0,.46,-.485,gold,[.82,1,.45],10);
    ellipsoid(g,.055,-.10,.75,-.61,warm,[1.12,.42,.48],10);ellipsoid(g,.055,.10,.75,-.61,warm,[1.12,.42,.48],10);ellipsoid(g,.07,-.13,.54,-.61,cream,[1.15,.65,.58],10);ellipsoid(g,.07,.13,.54,-.61,cream,[1.15,.65,.58],10);
    ellipsoid(g,.058,0,.615,-.742,nose,[1.05,.70,.55],10);ellipsoid(g,.045,0,.545,-.718,cream,[1.7,.72,.55],10);
    for(const x of[-.24,.24]){ellipsoid(g,.07,x,.095,-.22,paw,[1.14,.40,1.36],10);for(const dx of[-.026,0,.026])capsule(g,.005,.035,x+dx,.087,-.275,dark,[Math.PI/2,0,0])}
  }else{
    const nose=mat(0xc77884,.86),paw=mat(0xf0ddd0,.93);
    ellipsoid(g,.105,-.23,.49,.00,warm,[.78,1.12,.80],12);ellipsoid(g,.105,.23,.49,.00,warm,[.78,1.12,.80],12);
    ellipsoid(g,.075,-.145,.59,-.64,cream,[1.22,.78,.48],10);ellipsoid(g,.075,.145,.59,-.64,cream,[1.22,.78,.48],10);ellipsoid(g,.052,0,.505,-.705,cream,[1.12,.62,.58],10);
    torus(g,.18,.021,0,.585,-.23,blue,[Math.PI/2,0,0]);ellipsoid(g,.030,0,.47,-.445,gold,[.82,1,.45],9);
    const inner=mat(0xd9a0a7,.9);for(const x of[-.15,.15]){const e=new THREE.Mesh(new THREE.ConeGeometry(.064,.19,8),inner);e.position.set(x,.89,-.49);e.scale.z=.46;e.rotation.z=x<0?-.08:.08;e.castShadow=true;g.add(e)}
    ellipsoid(g,.032,0,.575,-.748,nose,[1.0,.72,.50],9);whisker(g,-.025,.565,-.735,-1);whisker(g,.025,.565,-.735,1);
    for(const x of[-.19,.19]){ellipsoid(g,.058,x,.085,-.19,paw,[1.08,.38,1.34],10);for(const dx of[-.021,0,.021])capsule(g,.004,.032,x+dx,.081,-.24,dark,[Math.PI/2,0,0])}
  }
  installPetLocomotion(g);polished.add(g);return true;
}

function polishLivestock(g){
  const u=g?.userData,type=u?.animalType;if(!type||polished.has(g))return false;
  if(type==='cow'){
    const hide=mat(0xf1eee7,.92),pinkSoft=mat(0xe7aaa9,.90),brown=mat(0x5a4a43,.88),collar=mat(0x8c5d43,.82),horn=mat(0xe3d3aa,.90);
    for(const x of[-.31,.31]){ellipsoid(g,.135,x,.53,-.14,hide,[1.05,.78,.88],12);ellipsoid(g,.14,x,.51,.34,hide,[1.06,.76,.90],12)}
    for(const leg of u.legs||[])if(leg)ellipsoid(leg,.075,0,-.14,-.025,brown,[1.05,.70,1.18],10);
    torus(g,.305,.025,0,.77,-.43,collar,[Math.PI/2,0,0]);ellipsoid(g,.047,0,.52,-.68,gold,[.90,1.05,.58],10);
    ellipsoid(g,.115,0,.69,-.50,hide,[1.08,1.28,.66],12);ellipsoid(g,.075,0,.64,-.61,pinkSoft,[1.24,.62,.72],10);
    for(const x of[-.18,.18]){cone(g,.038,.18,x,.99,-.72,horn,[0,0,x<0?.55:-.55],[.82,1,.82]);ellipsoid(g,.032,x*.33,.675,-.825,brown,[1,.52,.46],9)}
    ellipsoid(g,.13,0,.33,.27,pinkSoft,[1.15,.58,.92],12);for(const x of[-.065,.065])for(const z of[.22,.34])capsule(g,.014,.105,x,.225,z,pinkSoft,[0,0,0]);
  }else if(type==='sheep'){
    const wool=mat(0xf0eee7,.95),face=mat(0x625b56,.92),inner=mat(0xb99791,.94);
    for(const leg of u.legs||[])if(leg)ellipsoid(leg,.095,0,-.12,0,wool,[1.12,.78,.92],10);
    ellipsoid(g,.18,0,.69,-.39,wool,[1.12,1.15,.78],14);ellipsoid(g,.085,-.15,.76,-.50,wool,[1.18,.70,.65],10);ellipsoid(g,.085,.15,.76,-.50,wool,[1.18,.70,.65],10);
    ellipsoid(g,.060,0,.58,-.72,face,[1.12,.62,.62],10);
    for(const x of[-.22,.22])ellipsoid(g,.052,x,.78,-.52,inner,[1.45,.38,.65],10);
    ellipsoid(g,.026,0,.59,-.785,inner,[1.0,.58,.45],8);
  }else if(type==='chicken'){
    const feather=mat(0xe8d2ad,.93),wing=mat(0xd2b588,.92),red=mat(0xc84f49,.88),beak=mat(0xd99a36,.86),leg=mat(0xc9913c,.88);
    for(const [x,a,s] of[[-.13,-.32,.92],[0,0,1.05],[.13,.32,.92]])cone(g,.085,.34,x,.52,.38,wing,[-.82,0,a],[.78,1,s]);
    for(const x of[-.19,.19]){ellipsoid(g,.105,x,.49,-.02,feather,[.55,1.10,1.20],12);ellipsoid(g,.075,x,.43,.14,wing,[.60,.92,1.14],10)}
    ellipsoid(g,.045,0,.58,-.36,red,[.75,1.08,.72],9);
    cone(g,.043,.145,0,.64,-.475,beak,[Math.PI/2,0,0],[1,.72,1]);
    for(const x of[-.09,.09])for(const dx of[-.035,0,.035])capsule(g,.006,.12,x+dx,.055,-.04,leg,[Math.PI/2,0,0]);
  }
  polished.add(g);return true;
}

function scan(){let avatars=0,pets=0,livestock=0;for(const a of globalThis.__AGCB_LIVE_AVATARS||[])if(polishAvatar(a))avatars++;for(const p of globalThis.__AGCB_LIVE_PETS||[])if(polishPet(p))pets++;for(const a of globalThis.__AGCB_LIVE_LIVESTOCK||[])if(polishLivestock(a))livestock++;return{avatars,pets,livestock}}
let ticks=0;function loop(){requestAnimationFrame(loop);if(++ticks%120===0)scan()}
const first=scan();requestAnimationFrame(loop);
globalThis.__AGCB_CHARACTER_POLISH={schema:5,scan,polished,first,features:['avatar-cheeks','dog-muzzle-paws','cat-whiskers-paws','pet-distance-gait','cow-horns-udder','sheep-ear-detail','chicken-beak-feet']};
