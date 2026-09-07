import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const VERSION='V0.5.28';
const KEY='agcb_luxury_castle_v0528';
const CASTLE_ID='agcb-luxury-castle-v0528';
const state={built:false,anchor:null,doorOpen:false,parts:[],doors:[]};
const stone=new THREE.MeshStandardMaterial({color:0xd8d1c4,roughness:.84});
const trim=new THREE.MeshStandardMaterial({color:0xb69b72,roughness:.75});
const roof=new THREE.MeshStandardMaterial({color:0x56667d,roughness:.7});
const glass=new THREE.MeshStandardMaterial({color:0x9dd9ef,roughness:.25,metalness:.05,transparent:true,opacity:.58});
const wood=new THREE.MeshStandardMaterial({color:0x75472f,roughness:.72});
const gold=new THREE.MeshStandardMaterial({color:0xd5ad4e,roughness:.42,metalness:.18});

function livePlayer(){const a=[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(x=>x?.parent);return a[a.length-1]||null}
function world(){return livePlayer()?.parent||null}
function mark(mesh,solid=true){mesh.userData={...(mesh.userData||{}),kind:solid?'block':'decoration',solid,castleId:CASTLE_ID,shape:'castle'};state.parts.push(mesh);return mesh}
function addBox(w,x,y,z,sx,sy,sz,mat=stone,solid=true){const m=mark(new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat),solid);m.position.set(x,y,z);w.add(m);return m}
function addCylinder(w,x,y,z,r,h,mat=stone,solid=true){const m=mark(new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,18),mat),solid);m.position.set(x,y,z);w.add(m);return m}
function addCone(w,x,y,z,r,h,mat=roof){const m=mark(new THREE.Mesh(new THREE.ConeGeometry(r,h,18),mat),false);m.position.set(x,y,z);w.add(m);return m}
function addWindow(w,x,y,z,ry=0){const m=addBox(w,x,y,z,.06,1.15,.72,glass,false);m.rotation.y=ry;return m}
function invalidate(m){globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(m);globalThis.__AGCB_WORLD_HOTPATH?.reindexSolid?.(m)}
function clearCastle(){for(const p of state.parts){p.parent?.remove(p);p.geometry?.dispose?.()}state.parts=[];state.doors=[];state.built=false}
function stairFlight(w,ax,az,y0,dirX=1){for(let i=0;i<10;i++){const h=.18*(i+1);addBox(w,ax+dirX*i*.48,y0+h/2,az,0.5,h,1.25,trim,true)}}
function buildAt(anchor){const w=world();if(!w)return false;clearCastle();const {x,z}=anchor;const Y=0;
  // Main keep: three full usable floors with a large central hall.
  for(const floor of [0,3.2,6.4]) addBox(w,x,Y+floor-.08,z,14,.16,11,trim,true);
  // Front/back/side walls split around doors and windows so rooms remain walkable.
  for(const floor of [0,3.2,6.4]){
    const cy=Y+floor+1.55;
    addBox(w,x-4.8,cy,z-5.45,4.2,3.1,.35,stone,true);addBox(w,x+4.8,cy,z-5.45,4.2,3.1,.35,stone,true);
    addBox(w,x,cy,z+5.45,14,3.1,.35,stone,true);
    addBox(w,x-6.85,cy,z, .35,3.1,11,stone,true);addBox(w,x+6.85,cy,z,.35,3.1,11,stone,true);
    for(const wx of [-4,-1.8,1.8,4]){addWindow(w,x+wx,cy+.2,z+5.25,0);if(floor>0)addWindow(w,x+wx,cy+.2,z-5.25,0)}
  }
  // Four tall corner towers with roofs.
  for(const [tx,tz] of [[-7.4,-5.9],[7.4,-5.9],[-7.4,5.9],[7.4,5.9]]){addCylinder(w,x+tx,Y+4.5,z+tz,1.65,9,stone,true);addCone(w,x+tx,Y+10.2,z+tz,2.05,3.2,roof)}
  // Battlements and roof terrace.
  addBox(w,x,Y+9.5,z,14,.22,11,trim,true);
  for(let i=-6;i<=6;i+=2){addBox(w,x+i,Y+10,z-5.25,1,.9,.6,stone,true);addBox(w,x+i,Y+10,z+5.25,1,.9,.6,stone,true)}
  for(let i=-4;i<=4;i+=2){addBox(w,x-6.55,Y+10,z+i, .6,.9,1,stone,true);addBox(w,x+6.55,Y+10,z+i,.6,.9,1,stone,true)}
  // Grand entrance arch impression + balcony.
  addBox(w,x,Y+3.8,z-5.15,5,.3,1.3,trim,true);addBox(w,x,Y+4.15,z-5.0,4.4,.18,1.7,trim,true);
  addBox(w,x,Y+5.05,z-5.35,4.7,1.6,.18,stone,true);
  for(const bx of [-2.1,2.1]) addBox(w,x+bx,Y+4.25,z-5.05,.22,1.1,.22,gold,false);
  // Interior stairs connecting 1F→2F→3F and roof.
  stairFlight(w,x-4.8,z+2.6,Y,1);stairFlight(w,x+4.8,z+1.0,Y+3.2,-1);stairFlight(w,x-4.8,z-1.0,Y+6.4,1);
  // Double front doors: real collision toggles with state.
  const left=addBox(w,x-.92,Y+1.35,z-5.3,1.75,2.7,.25,wood,true),right=addBox(w,x+.92,Y+1.35,z-5.3,1.75,2.7,.25,wood,true);
  left.name='ag-castle-door-left';right.name='ag-castle-door-right';left.userData.hinge='left';right.userData.hinge='right';state.doors=[left,right];
  for(const d of state.doors){const knob=addBox(w,d.position.x+(d===left?.62:-.62),Y+1.35,z-5.47,.12,.12,.12,gold,false);knob.userData.castleDoorKnob=true}
  state.anchor={x,z};state.built=true;setDoor(state.doorOpen,false);localStorage.setItem(KEY,JSON.stringify({anchor:state.anchor,doorOpen:state.doorOpen}));return true;
}
function setDoor(open,persist=true){state.doorOpen=!!open;if(state.doors.length!==2)return;const [l,r]=state.doors;for(const d of state.doors){d.userData.solid=!open;d.userData.kind=open?'decoration':'block'}
  if(open){l.rotation.y=-Math.PI*.48;r.rotation.y=Math.PI*.48;l.position.x=state.anchor.x-1.72;r.position.x=state.anchor.x+1.72}
  else{l.rotation.y=0;r.rotation.y=0;l.position.x=state.anchor.x-.92;r.position.x=state.anchor.x+.92}
  state.doors.forEach(invalidate);if(persist)localStorage.setItem(KEY,JSON.stringify({anchor:state.anchor,doorOpen:state.doorOpen}));
}
function playerPos(){const p=livePlayer();if(!p)return null;const v=new THREE.Vector3();p.getWorldPosition(v);return v}
function nearDoor(){if(!state.built||!state.anchor)return false;const p=playerPos();if(!p)return false;return Math.hypot(p.x-state.anchor.x,p.z-(state.anchor.z-5.3))<3.3}
function installUI(){if(document.getElementById('agLuxuryCastleBtn'))return;const panel=document.getElementById('adminPanel');if(panel){const btn=document.createElement('button');btn.id='agLuxuryCastleBtn';btn.textContent='🏰 一鍵生成豪華大城堡';btn.style.cssText='width:100%;margin-top:10px;border:0;border-radius:13px;padding:12px;background:#fff;font-weight:900;color:#3d5556;box-shadow:0 2px 9px #0001';btn.onclick=()=>{const p=playerPos();if(!p)return;buildAt({x:Math.round(p.x),z:Math.round(p.z-18)});document.getElementById('status')&&(document.getElementById('status').textContent='🏰 豪華三層大城堡已完成');};panel.appendChild(btn)}
  const door=document.createElement('button');door.id='agCastleDoorBtn';door.style.cssText='display:none;position:fixed;z-index:92;right:max(112px,calc(env(safe-area-inset-right) + 104px));bottom:max(118px,calc(env(safe-area-inset-bottom) + 108px));border:0;border-radius:16px;padding:10px 14px;background:#fff7d8e8;font-weight:900;color:#42565c;box-shadow:0 3px 12px #0003';door.onclick=()=>setDoor(!state.doorOpen);document.body.appendChild(door);
  setInterval(()=>{const show=nearDoor();door.style.display=show?'block':'none';door.textContent=state.doorOpen?'🚪 關門':'🚪 開門'},250)
}
function restore(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s?.anchor){state.doorOpen=!!s.doorOpen;let tries=0;const run=()=>{if(world())buildAt(s.anchor);else if(++tries<40)setTimeout(run,250)};run()}}catch{}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{installUI();restore()},{once:true});else{installUI();restore()}
globalThis.__AGCB_LUXURY_CASTLE={version:VERSION,state,buildAt,setDoor,clear:clearCastle};
