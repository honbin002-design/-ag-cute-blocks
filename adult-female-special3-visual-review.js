import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const SPECIAL3_BASE='./assets/characters/special3/model.v051.b64.';
const SPECIAL3_TOTAL_BYTES=38501928;
const SPECIAL3_PART_COUNT=13;
const host=document.getElementById('viewer');
const status=document.getElementById('status');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xf3f0ea);
const camera=new THREE.PerspectiveCamera(28,1,.05,80);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x918980,2.2));
const key=new THREE.DirectionalLight(0xffffff,2.8);key.position.set(4,6,5);key.castShadow=true;scene.add(key);
const fill=new THREE.DirectionalLight(0xffffff,1.0);fill.position.set(-3,3,2);scene.add(fill);
const ground=new THREE.Mesh(new THREE.CircleGeometry(1.8,64),new THREE.MeshStandardMaterial({color:0xe2ded7,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.01;ground.receiveShadow=true;scene.add(ground);

async function loadBase64Gltf(){
  const parts=await Promise.all(Array.from({length:SPECIAL3_PART_COUNT},(_,i)=>fetch(SPECIAL3_BASE+String(i).padStart(3,'0'),{cache:'force-cache'}).then(async r=>{
    if(!r.ok)throw new Error(`Special3 part ${i+1}/${SPECIAL3_PART_COUNT} failed: ${r.status}`);
    return r.text();
  })));
  const bytes=new Uint8Array(SPECIAL3_TOTAL_BYTES);let offset=0;
  for(const encoded of parts){
    const raw=atob(encoded);
    if(offset+raw.length>bytes.length)throw new Error('Special3 model size overflow');
    for(let i=0;i<raw.length;i++)bytes[offset+i]=raw.charCodeAt(i);
    offset+=raw.length;
  }
  if(offset!==SPECIAL3_TOTAL_BYTES)throw new Error(`Special3 size mismatch ${offset}/${SPECIAL3_TOTAL_BYTES}`);
  return new Promise((resolve,reject)=>new GLTFLoader().parse(bytes.buffer,'',resolve,reject));
}

function styleAdultFemale(root){
  root.traverse(o=>{
    if(!o.isMesh)return;
    if(Array.isArray(o.material))o.material=o.material.map(m=>m?.clone?.()||m);else if(o.material)o.material=o.material.clone();
    const mats=Array.isArray(o.material)?o.material:[o.material];
    for(const m of mats){
      if(!m?.color)continue;
      const label=(o.name+' '+(m.name||'')).toLowerCase();
      if(m.map)m.color.setHex(0xffffff);
      if(/hair|bang|pony|fringe/.test(label))m.color.setHex(0x65463b);
      else if(/skin|face|head|hand|arm|leg/.test(label))m.color.setHex(0xf2c5a5);
      else if(/shirt|blouse|top|sleeve|upper|torso|cloth/.test(label))m.color.setHex(0xf7f3ec);
      else if(/pant|trouser|bottom|jean/.test(label))m.color.setHex(0xd9d2c7);
      else if(/shoe|boot|sole/.test(label))m.color.setHex(0xc7beb3);
      if('metalness'in m)m.metalness=Math.min(.06,m.metalness||0);
      if('roughness'in m)m.roughness=Math.max(.70,m.roughness||.76);
      m.needsUpdate=true;
    }
    o.castShadow=true;o.receiveShadow=true;
  });
  const chest=root.getObjectByName('chest')||root.getObjectByName('Chest');
  const hips=root.getObjectByName('hips')||root.getObjectByName('Hips');
  if(chest)chest.scale.x*=1.035;
  if(hips)hips.scale.x*=1.055;

  // Non-destructive curled-hair silhouette layer used by the playable candidate.
  const hair=new THREE.Group();hair.name='agcb-adult-female-long-curled-hair-review-v1';
  const mat=new THREE.MeshStandardMaterial({color:0x65463b,roughness:.82,metalness:0});
  const strands=[[-.26,1.36,.03,-.15],[-.31,1.16,.06,-.23],[-.27,.96,.10,-.31],[.26,1.36,.03,.15],[.31,1.16,.06,.23],[.27,.96,.10,.31]];
  for(const [x,y,z,rz] of strands){
    const mesh=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.34,8,16),mat);
    mesh.position.set(x,y,z);mesh.rotation.z=rz;mesh.scale.set(1,.92,.78);hair.add(mesh);
  }
  const back=new THREE.Mesh(new THREE.CapsuleGeometry(.24,.64,10,20),mat);back.position.set(0,1.12,.20);back.scale.set(1.16,1,.58);hair.add(back);
  root.add(hair);
  root.userData.adultFemaleApprovedLook='chibi-long-curled-hair-white-top-light-pants-v1';
  return root;
}

let character=null;
function fit(){
  if(!character)return;
  character.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(character),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  const h=Math.max(size.y,1),dist=h/Math.tan(THREE.MathUtils.degToRad(camera.fov*.5))*.62;
  camera.position.set(0,center.y+.02,dist);camera.lookAt(0,center.y,0);camera.updateProjectionMatrix();
  ground.position.y=box.min.y-.015;
}
function setView(deg){
  if(character)character.rotation.y=THREE.MathUtils.degToRad(deg);
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',Number(b.dataset.view)===deg));
}
function resize(){const w=Math.max(host.clientWidth,1),h=Math.max(host.clientHeight,1);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();fit();}
new ResizeObserver(resize).observe(host);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(Number(b.dataset.view))));

try{
  status.textContent='載入測試角色3 GLB…';
  const gltf=await loadBase64Gltf();
  character=styleAdultFemale(gltf.scene);
  character.name='agcb-special3-adult-female-eight-view';
  character.rotation.y=0;scene.add(character);fit();setView(0);status.textContent='V0.4.79｜Special3 GLB 成年女性候選｜八方向驗收';
}catch(err){console.error(err);status.textContent='模型載入失敗：'+err.message;}
renderer.setAnimationLoop(()=>renderer.render(scene,camera));

globalThis.__AGCB_ADULT_FEMALE_SPECIAL3_VISUAL_REVIEW={version:1,base:'Meshy_AI_Meshy_Merged_Animations.glb',views:[0,-45,-90,-135,180,135,90,45],look:'chibi-long-curled-hair-white-top-light-pants-v1',loaded:true};