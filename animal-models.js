import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const LIVE_LIVESTOCK=globalThis.__AGCB_LIVE_LIVESTOCK||(globalThis.__AGCB_LIVE_LIVESTOCK=new Set());
const M=(c,r=.91)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:.01});
function ell(g,r,x,y,z,c,s=[1,1,1],seg=18){const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(10,seg-6)),typeof c==='number'?M(c):c);m.position.set(x,y,z);m.scale.set(...s);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function leg(g,x,z,c,h=.55,hoof=0x4d423c){const p=new THREE.Group();p.position.set(x,h/2,z);const m=new THREE.Mesh(new THREE.CapsuleGeometry(.06,Math.max(.04,h-.12),5,9),typeof c==='number'?M(c):c);m.castShadow=true;p.add(m);g.add(p);ell(g,.078,x,.07,z-.025,hoof,[1,.52,1.32],12);return p}
function cone(g,r,h,x,y,z,c,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,9),M(c));m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;g.add(m);return m}
function eye(g,x,y,z){ell(g,.030,x,y,z,0x22282c,[1,.95,.55],10);ell(g,.009,x+.006,y+.008,z-.012,0xffffff,[1,1,.4],8)}
function baseState(type,headY,bodyY){return {state:'idle',baseHeadY:headY,baseBodyY:bodyY,stateChangedAt:0,holdPosition:null}}
function register(g){LIVE_LIVESTOCK.add(g);return g}

export function createCow(){
  const g=new THREE.Group(),hide=M(0xf1eee7),dark=M(0x4f4743),pink=M(0xe7aaa9),horn=M(0xe4d4a9),body=ell(g,.43,0,.73,.10,hide,[1.68,.90,.94],24),neck=ell(g,.29,0,.78,-.43,hide,[.92,1.24,.84],20),headPivot=new THREE.Group();headPivot.position.set(0,.84,-.72);g.add(headPivot);
  ell(headPivot,.285,0,0,0,hide,[1.03,.88,.96],22);ell(headPivot,.17,0,-.12,-.22,pink,[1.38,.68,.92],16);ell(headPivot,.032,-.065,-.12,-.365,0x765d58,[1,.55,.45],9);ell(headPivot,.032,.065,-.12,-.365,0x765d58,[1,.55,.45],9);
  ell(g,.18,-.31,.83,.02,dark,[1.2,.65,.28],14);ell(g,.16,.34,.67,.23,dark,[1.1,.72,.25],14);ell(headPivot,.12,.17,.10,.04,dark,[.9,.65,.25],12);
  const legs=[leg(g,-.28,-.16,hide,.58),leg(g,.28,-.16,hide,.58),leg(g,-.30,.36,hide,.58),leg(g,.30,.36,hide,.58)];for(const [i,x] of[-.22,.22].entries()){const ear=ell(headPivot,.108,x,.10,.03,dark,[1.38,.48,.72],14);ear.rotation.z=x<0?-.20:.20;const h=cone(headPivot,.043,.22,x*.72,.25,.08,0xe1d0a4,[0,0,x<0?.58:-.58]);}for(const x of[-.105,.105])eye(headPivot,x,.04,-.245);
  // Shoulder/hip definition plus udder keeps cow anatomy recognizable from a distance.
  ell(g,.23,0,.72,-.24,hide,[1.38,.92,.60],16);ell(g,.23,0,.70,.38,hide,[1.42,.90,.58],16);ell(g,.16,0,.39,.28,pink,[1.05,.58,.90],14);for(const x of[-.07,.07])for(const z of[.22,.34]){const t=new THREE.Mesh(new THREE.CylinderGeometry(.018,.014,.11,7),pink);t.position.set(x,.27,z);g.add(t)}
  const tail=new THREE.Group();tail.position.set(0,.80,.55);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.60,7),dark);shaft.position.y=-.22;shaft.rotation.x=.22;tail.add(shaft);ell(tail,.068,0,-.53,.10,dark,[.82,1.38,.82],12);g.add(tail);
  g.userData={animalType:'cow',legs,tail,headPivot,body,neck,phase:Math.random()*6.28,...baseState('cow',.84,.73)};return register(g);
}
export function createSheep(){
  const g=new THREE.Group(),wool=M(0xf0eee7),face=M(0x625b56),hoof=0x493f3b,body=ell(g,.39,0,.62,.08,wool,[1.56,.96,.94],22);for(const [x,y,z,s] of [[-.34,.72,.04,.20],[.34,.72,.04,.20],[-.18,.83,.20,.19],[.18,.83,.20,.19],[0,.84,-.10,.20],[-.30,.58,.25,.18],[.30,.58,.25,.18],[-.22,.63,-.24,.17],[.22,.63,-.24,.17]])ell(g,s,x,y,z,wool,[1.1,.82,1],14);
  const headPivot=new THREE.Group();headPivot.position.set(0,.73,-.57);g.add(headPivot);ell(headPivot,.22,0,0,0,face,[.84,1.14,.79],20);ell(headPivot,.115,0,-.115,-.18,face,[1.10,.72,.90],14);ell(headPivot,.075,0,.17,.02,wool,[1.3,.75,.65],12);
  const legs=[leg(g,-.23,-.12,face,.48,hoof),leg(g,.23,-.12,face,.48,hoof),leg(g,-.24,.30,face,.48,hoof),leg(g,.24,.30,face,.48,hoof)];for(const x of[-.18,.18]){const ear=ell(headPivot,.088,x,.11,.01,face,[1.48,.45,.70],12);ear.rotation.z=x<0?-.25:.25}for(const x of[-.085,.085])eye(headPivot,x,.04,-.185);
  // Small tail and layered wool silhouette stop the sheep reading as a generic white oval.
  ell(g,.12,0,.68,.50,wool,[.9,.9,.8],12);
  g.userData={animalType:'sheep',legs,headPivot,body,phase:Math.random()*6.28,...baseState('sheep',.73,.62)};return register(g);
}
export function createChicken(){
  const g=new THREE.Group(),feather=M(0xe8d2ad),wing=M(0xd2b588),red=M(0xc84f49),legMat=M(0xc9913c),body=ell(g,.28,0,.39,.04,feather,[1.02,1.08,1.36],20),headPivot=new THREE.Group();headPivot.position.set(0,.66,-.24);g.add(headPivot);ell(headPivot,.17,0,0,0,feather,[1,.98,.92],18);
  const wl=ell(g,.17,-.23,.42,.05,wing,[.48,1,1.20],16),wr=ell(g,.17,.23,.42,.05,wing,[.48,1,1.20],16);wl.rotation.z=.15;wr.rotation.z=-.15;cone(headPivot,.072,.21,0,-.02,-.225,0xd99837,[Math.PI/2,0,0]);for(const x of[-.072,.072])eye(headPivot,x,.04,-.165);for(let i=0;i<3;i++)ell(headPivot,.05,(i-1)*.055,.18,.05,red,[.75,1.15,.72],10);ell(headPivot,.055,0,-.09,-.14,red,[.75,1.1,.7],10);
  const legs=[];for(const x of[-.09,.09]){const p=new THREE.Group();p.position.set(x,.20,.06);const shank=new THREE.Mesh(new THREE.CylinderGeometry(.018,.021,.30,7),legMat);p.add(shank);g.add(p);legs.push(p);for(const [sx,ang,len] of [[-.035,.08,.18],[0,0,.20],[.035,-.08,.18]]){const toe=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,len,6),legMat);toe.rotation.x=Math.PI/2;toe.rotation.z=ang;toe.position.set(sx,-.15,-.09);p.add(toe)}const backToe=new THREE.Mesh(new THREE.CylinderGeometry(.007,.007,.10,6),legMat);backToe.rotation.x=Math.PI/2;backToe.position.set(0,-.15,.05);p.add(backToe)}for(const x of[-.09,0,.09]){const f=ell(g,.11,x,.48,.35,wing,[.45,1.25,.62],12);f.rotation.x=-.45;f.rotation.z=x*.8}
  g.userData={animalType:'chicken',legs,wings:[wl,wr],headPivot,body,phase:Math.random()*6.28,...baseState('chicken',.66,.39)};return register(g);
}
export function setAnimalVisualState(g,state='idle',now=performance.now()){
  const u=g?.userData;if(!u?.legs)return;u.state=state;u.stateChangedAt=now;
  if(['sleep','eat','drink','petResponse'].includes(state)&&g.parent&&!u.holdPosition)u.holdPosition=g.parent.position.clone();
  if(state==='walk'||state==='idle')u.holdPosition=null;
}
function animalAnimationDue(u,time,moving,forced){
  if(forced)return true;
  const tier=globalThis.__AGCB_PERF_TIER||'normal',gap=tier==='low'?(moving?48:96):tier==='high'?16:(moving?32:70);
  if(u._lastAnimAt&&time-u._lastAnimAt<gap)return false;u._lastAnimAt=time;return true;
}
export function animateAnimal(g,time,speed=0,state='auto'){
  const u=g.userData||{},legs=u.legs;if(!legs)return;const type=u.animalType;if(state!=='auto'&&state!==u.state)setAnimalVisualState(g,state,time);const forced=['sleep','eat','drink','petResponse'].includes(u.state),s=state==='auto'?(forced?u.state:(speed>.001?'walk':'idle')):state;
  if(forced&&u.holdPosition&&g.parent)g.parent.position.copy(u.holdPosition);
  if(!animalAnimationDue(u,time,s==='walk',forced))return;
  const moving=s==='walk'&&speed>.001,phase=u.phase||0,walkRate=type==='chicken'?.015:.0105,swing=moving?Math.sin(time*walkRate+phase)*(type==='chicken'?.46:.34):0;legs.forEach((p,i)=>{p.rotation.z=0;p.rotation.x=type==='chicken'?(i%2?swing:-swing):(i===0||i===3?swing:-swing)});
  const head=u.headPivot,body=u.body,baseHeadY=u.baseHeadY??(type==='cow'?.84:type==='sheep'?.73:.66),baseBodyY=u.baseBodyY??(type==='cow'?.73:type==='sheep'?.62:.39);if(head){head.position.y=baseHeadY;head.rotation.set(0,0,0)}if(body){body.position.y=baseBodyY;body.rotation.set(0,0,0)}if(u.wings){u.wings[0].rotation.z=.15;u.wings[1].rotation.z=-.15}g.position.y=0;
  if(s==='walk'){const step=Math.sin(time*walkRate+phase),lift=Math.abs(step);if(head)head.rotation.x=type==='chicken'?Math.sin(time*.015+phase)*.10:Math.sin(time*.0105+phase)*.045;if(body){body.rotation.z=step*.018;body.position.y=baseBodyY-lift*(type==='chicken'?.012:.010)}g.position.y=lift*(type==='chicken'?.016:.010)}
  else if(s==='eat'||s==='drink'){const dip=s==='drink'?1:.82,peck=type==='chicken'?Math.max(0,Math.sin(time*.010+phase)):.92+.08*Math.sin(time*.003+phase);if(head){head.position.y=baseHeadY-(type==='cow'?.22:type==='sheep'?.18:.11)*dip*peck;head.rotation.x=(type==='chicken'?.78:.72)*dip*peck}if(type==='chicken'&&u.wings){u.wings[0].rotation.z=.10;u.wings[1].rotation.z=-.10}}
  else if(s==='sleep'){if(body){body.position.y=baseBodyY-(type==='chicken'?.16:.22);body.rotation.z=type==='chicken'?.06:.03}legs.forEach((p,i)=>{p.rotation.x=type==='chicken'?(i?-.72:.72):(i<2?-.86:.82);p.rotation.z=i%2?-.10:.10});if(head){head.position.y=baseHeadY-(type==='chicken'?.23:.30);head.rotation.x=type==='chicken'?.40:.30;head.rotation.z=.08*Math.sin(phase)}if(u.wings){u.wings[0].rotation.z=.03;u.wings[1].rotation.z=-.03}g.position.y=Math.sin(time*.0015+phase)*.004}
  else if(s==='petResponse'){if(head){head.rotation.z=Math.sin(time*.006+phase)*.10;head.rotation.x=-.04}if(body)body.rotation.z=Math.sin(time*.005+phase)*.014}
  else{const idleWave=Math.sin(time*.0015+phase);if(head){if(type==='chicken'){const peck=Math.max(0,Math.sin(time*.004+phase)-.72)/.28;head.rotation.x=peck*.72;head.position.y=baseHeadY-peck*.08}else{const graze=Math.max(0,Math.sin(time*.0018+phase)-.45)/.55;head.rotation.x=graze*.72;head.position.y=baseHeadY-graze*(type==='cow'?.18:.14)}}if(body)body.rotation.z=idleWave*.006}
  if(u.tail)u.tail.rotation.z=Math.sin(time*((s==='walk')?.006:.0035)+phase)*(s==='petResponse'?.22:s==='walk'?.16:.10);if(u.wings&&s!=='sleep'&&s!=='eat'&&s!=='drink'){const w=s==='walk'?Math.sin(time*.012+phase)*.045:Math.sin(time*.003+phase)*.028;u.wings[0].rotation.z=.15+w;u.wings[1].rotation.z=-.15-w}
}
