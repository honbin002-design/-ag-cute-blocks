import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Non-destructive V0.4.5 visual polish layered on top of the live procedural models.
// Original geometry only; this runtime intentionally avoids replacing the base animation/state owners.
const polished=new WeakSet();
const mat=(color,roughness=.84,metalness=.015)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const dark=mat(0x3a3130,.78),warm=mat(0xf3d8b7,.9),cream=mat(0xfff4dc,.9),pink=mat(0xe88fa8,.86),blue=mat(0x6b9fc9,.84),gold=mat(0xe7bf63,.72,.04);
function ellipsoid(parent,r,x,y,z,material,scale=[1,1,1],segments=14){const m=new THREE.Mesh(new THREE.SphereGeometry(r,segments,Math.max(8,segments-4)),material);m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function capsule(parent,r,length,x,y,z,material,rot=[0,0,0]){const p=new THREE.Group();p.position.set(x,y,z);p.rotation.set(...rot);const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,length-r*2),5,10),material);m.castShadow=true;m.receiveShadow=true;p.add(m);parent.add(p);return p}
function torus(parent,major,tube,x,y,z,material,rot=[0,0,0],arc=Math.PI*2){const m=new THREE.Mesh(new THREE.TorusGeometry(major,tube,7,18,arc),material);m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m}

function polishAvatar(g){
  const u=g?.userData;if(!u?.avatarStyle||polished.has(g))return false;const v=u.visual||g;
  const girl=u.avatarStyle==='girl';
  // Small silhouette details that remain readable from the farm camera without changing rig pivots.
  const collar=torus(v,.205,.018,0,1.365,-.205,cream,[Math.PI/2,0,0],Math.PI*1.42);collar.rotation.z=.64;
  // Shirt cuff + ankle trim add a clearer clothing break between limbs and skin.
  for(const x of[-.40,.40])torus(v,.087,.014,x,.90,-.005,cream,[Math.PI/2,0,0]);
  for(const x of[-.16,.16])torus(v,.112,.014,x,.17,-.035,cream,[Math.PI/2,0,0]);
  // Shoe lace bars and toe cap make the feet read as shoes rather than rounded feet.
  for(const x of[-.16,.16]){for(const dz of[-.15,-.10])capsule(v,.009,.12,x,.105,dz,dark,[0,0,Math.PI/2]);ellipsoid(v,.055,x,.075,-.205,cream,[1.45,.40,.62],10)}
  // Hair side wisps soften the helmet silhouette; front remains local -Z.
  const hairColor=girl?0x68483b:0x4f3c34,hair=mat(hairColor,.93);
  ellipsoid(v,.075,-.31,1.79,-.16,hair,[.68,1.28,.50],12);ellipsoid(v,.075,.31,1.79,-.16,hair,[.68,1.28,.50],12);
  if(girl){
    // Simple original ribbon loops, intentionally generic rather than resembling a known character accessory.
    ellipsoid(v,.07,-.33,1.53,-.02,pink,[1.35,.56,.52],10);ellipsoid(v,.07,.33,1.53,-.02,pink,[1.35,.56,.52],10);
  }else{
    ellipsoid(v,.085,-.24,1.97,-.12,hair,[.70,.90,.62],10);ellipsoid(v,.085,.24,1.97,-.12,hair,[.70,.90,.62],10);
  }
  // Tiny overall pocket gives the torso a stronger layered-clothing read.
  const pocket=new THREE.Mesh(new THREE.BoxGeometry(.18,.12,.025),girl?pink:blue);pocket.position.set(0,1.07,-.302);pocket.rotation.x=-.04;pocket.castShadow=true;v.add(pocket);
  // A pair of subtle lower lashes improves facial expression while staying child-like.
  for(const x of[-.115,.115])capsule(v,.006,.043,x,1.72,-.341,dark,[0,0,x<0?-.28:.28]);
  polished.add(g);return true;
}

function polishPet(g){
  const u=g?.userData;if(!u?.petType||polished.has(g))return false;const dog=u.petType==='dog';
  // Keep additions on the model group so the existing gait and state runtime continues to own motion.
  if(dog){
    // Distinct shoulder/haunch mass, dewlap and collar improve canine anatomy from side/farm views.
    ellipsoid(g,.13,-.27,.47,.02,warm,[.92,1.18,.82],12);ellipsoid(g,.13,.27,.47,.02,warm,[.92,1.18,.82],12);
    ellipsoid(g,.115,0,.42,-.36,cream,[1.02,1.18,.36],12);
    torus(g,.205,.025,0,.585,-.26,pink,[Math.PI/2,0,0]);
    ellipsoid(g,.035,0,.46,-.485,gold,[.82,1,.45],10);
    // Small brow pads and cheek fur stop the face reading as a smooth ball.
    ellipsoid(g,.055,-.10,.75,-.61,warm,[1.12,.42,.48],10);ellipsoid(g,.055,.10,.75,-.61,warm,[1.12,.42,.48],10);
    ellipsoid(g,.07,-.13,.54,-.61,cream,[1.15,.65,.58],10);ellipsoid(g,.07,.13,.54,-.61,cream,[1.15,.65,.58],10);
  }else{
    // Cat-specific shoulder blades, cheek ruff, chin and collar retain a compact feline silhouette.
    ellipsoid(g,.105,-.23,.49,.00,warm,[.78,1.12,.80],12);ellipsoid(g,.105,.23,.49,.00,warm,[.78,1.12,.80],12);
    ellipsoid(g,.075,-.145,.59,-.64,cream,[1.22,.78,.48],10);ellipsoid(g,.075,.145,.59,-.64,cream,[1.22,.78,.48],10);ellipsoid(g,.052,0,.505,-.705,cream,[1.12,.62,.58],10);
    torus(g,.18,.021,0,.585,-.23,blue,[Math.PI/2,0,0]);
    ellipsoid(g,.030,0,.47,-.445,gold,[.82,1,.45],9);
    // Upright ear inner planes help the ears read clearly at the farm camera distance.
    const inner=mat(0xd9a0a7,.9);for(const x of[-.15,.15]){const e=new THREE.Mesh(new THREE.ConeGeometry(.064,.19,8),inner);e.position.set(x,.89,-.49);e.scale.z=.46;e.rotation.z=x<0?-.08:.08;e.castShadow=true;g.add(e)}
  }
  polished.add(g);return true;
}

function scan(){let avatars=0,pets=0;for(const a of globalThis.__AGCB_LIVE_AVATARS||[])if(polishAvatar(a))avatars++;for(const p of globalThis.__AGCB_LIVE_PETS||[])if(polishPet(p))pets++;return{avatars,pets}}
let ticks=0;function loop(){requestAnimationFrame(loop);if(++ticks%120===0)scan()}
const first=scan();requestAnimationFrame(loop);
globalThis.__AGCB_CHARACTER_POLISH={schema:1,scan,polished,first};
