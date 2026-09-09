import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import './ag-original-character-runtime.js';
import './adult-female-eye-runtime.js?v=0.4.92';
import './adult-female-brow-runtime.js?v=0.4.92';
import './adult-female-nose-runtime.js?v=0.4.92';
import './adult-female-mouth-runtime.js?v=0.4.92';
import './adult-female-face-contour-runtime.js?v=0.4.92';
import './adult-female-eyelash-runtime.js?v=0.4.92';
import './adult-female-hair-runtime.js?v=0.4.92';
import './adult-female-face-integration-runtime.js?v=0.4.92';
import './adult-female-body-proportion-runtime.js?v=0.4.92';
import './adult-female-full-silhouette-runtime.js?v=0.4.92';
import './adult-female-visual-refinement-runtime.js?v=0.4.92';

const host=document.getElementById('viewer');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xf2efe9);
const camera=new THREE.PerspectiveCamera(30,1,.1,30);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
host.appendChild(renderer.domElement);

const hemi=new THREE.HemisphereLight(0xffffff,0x8a8177,2.4);scene.add(hemi);
const key=new THREE.DirectionalLight(0xffffff,2.4);key.position.set(3,5,4);key.castShadow=true;scene.add(key);
const fill=new THREE.DirectionalLight(0xffffff,1.2);fill.position.set(-3,2,2);scene.add(fill);
const ground=new THREE.Mesh(new THREE.CircleGeometry(1.7,64),new THREE.MeshStandardMaterial({color:0xe1ddd6,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.015;ground.receiveShadow=true;scene.add(ground);

const cfg={gender:'girl',age:'adult',skin:'light',hair:'chestnut',hairStyle:'long',top:'pink',bottom:'denim',outfit:'dress',body:'default',hat:'none',glasses:'none',accessory:'none'};
const character=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR?.(cfg);
if(!character)throw new Error('Adult female character factory unavailable');
character.name='agcb-adult-female-visual-review-character';
character.traverse(o=>{if(o.isMesh)o.castShadow=true});
scene.add(character);

const state={yaw:0};
function fitCamera(){
  const box=new THREE.Box3().setFromObject(character),size=new THREE.Vector3(),center=new THREE.Vector3();
  box.getSize(size);box.getCenter(center);
  const h=Math.max(size.y,1),dist=h/Math.tan(THREE.MathUtils.degToRad(camera.fov*.5))*.60;
  camera.position.set(0,center.y+.02,dist);
  camera.lookAt(0,center.y,0);
  camera.near=.05;camera.far=50;camera.updateProjectionMatrix();
}
function setView(deg){state.yaw=THREE.MathUtils.degToRad(deg);character.rotation.y=state.yaw;document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',Number(b.dataset.view)===deg));}
function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();fitCamera();}
new ResizeObserver(resize).observe(host);resize();setView(0);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(Number(b.dataset.view))));

const review={
  version:2,
  scope:'adult-female-visual-review-only',
  views:{front:0,threeQuarter:-45,side:-90},
  config:cfg,
  requiredRuntimeMarkers:[
    '__AGCB_ADULT_FEMALE_EYE','__AGCB_ADULT_FEMALE_BROW','__AGCB_ADULT_FEMALE_NOSE','__AGCB_ADULT_FEMALE_MOUTH',
    '__AGCB_ADULT_FEMALE_FACE_CONTOUR','__AGCB_ADULT_FEMALE_EYELASH','__AGCB_ADULT_FEMALE_HAIR',
    '__AGCB_ADULT_FEMALE_FACE_INTEGRATION','__AGCB_ADULT_FEMALE_BODY_PROPORTION','__AGCB_ADULT_FEMALE_FULL_SILHOUETTE',
    '__AGCB_ADULT_FEMALE_VISUAL_REFINEMENT'
  ]
};
globalThis.__AGCB_ADULT_FEMALE_VISUAL_REVIEW=review;

renderer.setAnimationLoop(()=>renderer.render(scene,camera));
