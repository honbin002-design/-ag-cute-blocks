import {createCropModel,createFruitTreeModel} from './crop-models.js';
import {advanceDailyRecord} from './daily-progression-system.js';

const SETTINGS_KEY='ag_cute_blocks_settings_v03',CARE_KEY='ag_cute_blocks_crop_care_v1';
const read=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}};
const avatars=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(a=>a?.parent);
function player(){const a=avatars();return a.length?a[a.length-1]:null}
function objects(){return player()?.parent?.children?.filter(x=>x?.userData?.kind==='object')||[]}
function snapshot(o){const u=o.userData||{};return{id:u.id,type:u.type,crop:u.crop,treeKind:u.treeKind,growth:Number(u.growth||0),lastProductDay:Number(u.lastProductDay||0),productReady:!!u.productReady}}
function rebuild(o,season){const u=o.userData;if(u.crop){if(u.model)o.remove(u.model);u.model=createCropModel(u.crop,u.growth);o.add(u.model)}else if(u.treeKind){if(u.model)o.remove(u.model);u.model=createFruitTreeModel(u.treeKind,u.growth,season);o.add(u.model)}}

let settings=read(SETTINGS_KEY,{}),lastDay=Number(settings.worldDay||1),baseline=new Map(),lastScan=0;
function capture(){for(const o of objects())baseline.set(o.userData.id,snapshot(o))}
capture();

function reconcileDay(nextSettings){
  const day=Number(nextSettings.worldDay||lastDay);if(day===lastDay)return false;
  const season=nextSettings.season||'spring',weather=nextSettings.weather||'sunny',careStore=read(CARE_KEY,{}),fromDay=lastDay;let corrected=0;
  for(const o of objects()){
    const id=o.userData.id,before=baseline.get(id)||snapshot(o),expected={...before};
    const result=advanceDailyRecord(expected,{fromDay,toDay:day,season,weather,care:careStore[id]||null});
    if(result.growthChanged&&Math.abs(Number(o.userData.growth||0)-Number(expected.growth||0))>.0001){o.userData.growth=expected.growth;rebuild(o,season);corrected++}
    if(result.productChanged!==undefined&&o.userData.ranch&&o.userData.productReady!==expected.productReady){o.userData.productReady=expected.productReady;corrected++}
  }
  lastDay=day;baseline.clear();capture();if(corrected)document.querySelector('#saveNow')?.click();return corrected>0;
}

function loop(t){requestAnimationFrame(loop);if(t-lastScan<260)return;lastScan=t;const next=read(SETTINGS_KEY,{});if(!reconcileDay(next))capture();settings=next}
requestAnimationFrame(loop);
globalThis.__AGCB_DAILY_PROGRESSION={schema:1,get day(){return lastDay},baseline,reconcileDay};
