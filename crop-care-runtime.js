import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createCropModel} from './crop-models.js';
import {createCropCare,waterCrop,cropCareLabel,CROP_CARE_RULES} from './crop-care-system.js';

const CARE_KEY='ag_cute_blocks_crop_care_v1',SETTINGS_KEY='ag_cute_blocks_settings_v03';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let careStore=read(CARE_KEY,{}),target=null,lastScan=0;
const crops=()=>[...(globalThis.__AGCB_LIVE_CROPS||[])].filter(m=>m?.parent?.parent&&m.parent.userData?.crop);
const avatars=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(m=>m?.parent?.isGroup);
function player(){const a=avatars();return a.length?a[a.length-1]:null}
function worldDay(){return Number(read(SETTINGS_KEY,{}).worldDay||1)}
function weather(){return document.querySelector('#weather')?.value||read(SETTINGS_KEY,{}).weather||'sunny'}
function careFor(group){const id=group.userData.id||group.uuid;return careStore[id]||(careStore[id]=createCropCare())}

const style=document.createElement('style');style.textContent=`.waterCropBtn{position:fixed;z-index:84;left:max(132px,calc(env(safe-area-inset-left) + 122px));bottom:max(147px,calc(env(safe-area-inset-bottom) + 137px));border:0;border-radius:18px;padding:9px 12px;background:#dff6ffed;color:#315765;font-size:12px;font-weight:900;box-shadow:0 3px 12px #0003;display:none;pointer-events:auto}.waterCropBtn.show{display:block}.waterCropBtn:disabled{opacity:.72}@media(max-height:430px){.waterCropBtn{left:118px;bottom:130px;padding:8px 10px;font-size:10px}}`;document.head.appendChild(style);
const btn=document.createElement('button');btn.className='waterCropBtn';document.body.appendChild(btn);

function wetDisc(group,on){
  let d=group.userData.__wetDisc;if(on&&!d){const mat=new THREE.MeshBasicMaterial({color:0x4b3427,transparent:true,opacity:.43,depthWrite:false});d=new THREE.Mesh(new THREE.CircleGeometry(.46,22),mat);d.rotation.x=-Math.PI/2;d.position.y=.018;d.renderOrder=1;group.add(d);group.userData.__wetDisc=d}
  if(d)d.visible=!!on;
}
function splash(group){
  const g=new THREE.Group(),mat=new THREE.MeshBasicMaterial({color:0x86d9ff,transparent:true,opacity:.9});const drops=[];
  for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.025,7,6),mat.clone());const a=i/9*Math.PI*2;m.position.set(Math.cos(a)*(.12+Math.random()*.20),.34+Math.random()*.18,Math.sin(a)*(.12+Math.random()*.20));m.userData.v=.004+.003*Math.random();g.add(m);drops.push(m)}
  const start=performance.now();g.onBeforeRender=()=>{const age=performance.now()-start;for(const m of drops){m.position.y-=m.userData.v*3;m.material.opacity=Math.max(0,1-age/850)}if(age>900){group.remove(g);g.onBeforeRender=null}};group.add(g);
}
function nearestCrop(){
  const p=player();if(!p)return null;const pos=p.getWorldPosition(new THREE.Vector3());let best=null,dist=2.55;
  for(const model of crops()){const group=model.parent,d=Math.hypot(group.position.x-pos.x,group.position.z-pos.z);if(d<dist){best={model,group,d};dist=d}}
  return best;
}
function rebuild(t,newGrowth){
  const {model,group}=t,kind=group.userData.crop;group.userData.growth=newGrowth;group.remove(model);const next=createCropModel(kind,newGrowth);group.add(next);group.userData.model=next;t.model=next;
}
function scan(){
  const day=worldDay(),w=weather(),p=player(),pp=p?.getWorldPosition(new THREE.Vector3());target=nearestCrop();
  for(const model of crops()){const group=model.parent,care=careFor(group),near=pp&&Math.hypot(group.position.x-pp.x,group.position.z-pp.z)<18;wetDisc(group,near&&(w==='rain'||care.wateredDay===day))}
  if(!target||Number(target.group.userData.growth||0)>=.95){btn.classList.remove('show');return}
  const care=careFor(target.group),label=cropCareLabel(care,day,w);btn.textContent=label;btn.disabled=w==='rain'||care.wateredDay===day;btn.classList.add('show');
}
btn.onclick=()=>{
  if(!target)return;const day=worldDay(),w=weather(),group=target.group,care=careFor(group);if(w==='rain')return;
  const r=waterCrop(care,day,Date.now());if(!r.ok)return;const kind=group.userData.crop,rules=CROP_CARE_RULES[kind]||{waterBonus:.07},old=Number(group.userData.growth||0),next=Math.min(.94,old+rules.waterBonus*.48);rebuild(target,next);wetDisc(group,true);splash(group);write(CARE_KEY,careStore);document.querySelector('#saveNow')?.click();document.querySelector('#status').textContent=`💧 ${kind} 澆好水了・成長稍微加快`;scan();
};
function loop(t){requestAnimationFrame(loop);if(t-lastScan>520){lastScan=t;scan()}}
requestAnimationFrame(loop);
