import {createEconomyState,settleShipping} from './economy-system.js';

const WORLD_KEY='ag_cute_blocks_world_v04';
const SETTINGS_KEY='ag_cute_blocks_settings_v03';
const $=s=>document.querySelector(s);
const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??fallback}catch{return fallback}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const style=document.createElement('style');
style.textContent=`
.sleepMorning{position:fixed;z-index:88;left:50%;top:58%;transform:translate(-50%,-50%);border:0;border-radius:18px;padding:12px 17px;background:#304766e8;color:white;font-size:14px;font-weight:900;box-shadow:0 5px 22px #0004;display:none;pointer-events:auto}.sleepMorning.show{display:block}.sleepFade{position:fixed;z-index:180;inset:0;background:#263858;opacity:0;pointer-events:none;transition:opacity .42s ease;display:flex;align-items:center;justify-content:center;color:white;font-size:22px;font-weight:900}.sleepFade.on{opacity:1}.sleepFade small{display:block;font-size:12px;text-align:center;margin-top:8px;opacity:.75}`;
document.head.appendChild(style);
const btn=document.createElement('button');btn.className='sleepMorning';btn.textContent='😴 睡到早上';document.body.appendChild(btn);
const fade=document.createElement('div');fade.className='sleepFade';fade.innerHTML='<div>🌙 晚安…<small>世界會安全存檔，明早再繼續</small></div>';document.body.appendChild(fade);

function isLying(){return ($('#status')?.textContent||'').includes('躺下休息')||($('#lifeInteract')?.textContent||'').includes('起身')&&($('#status')?.textContent||'').includes('躺下')}
function refresh(){btn.classList.toggle('show',isLying())}
new MutationObserver(refresh).observe(document.body,{subtree:true,childList:true,characterData:true});
setInterval(refresh,500);refresh();

function localExit(x,z,rot,d=1.55){return {x:x+Math.sin(rot||0)*d,z:z+Math.cos(rot||0)*d}}
function nearestBed(world){const p=world?.player||{x:0,z:0};let best=null,dist=3;for(const o of world?.objects||[]){if(o.type!=='bed'&&o.type!=='starBed')continue;const d=Math.hypot((o.x||0)-(p.x||0),(o.z||0)-(p.z||0));if(d<dist){dist=d;best=o}}return best}
function advanceOneDay(world,settings){
  const oldDay=Number(settings.worldDay||1),newDay=oldDay+1,season=settings.season||'spring',weather=settings.weather||'sunny';
  const economy=createEconomyState(settings.economy||{});const earned=settleShipping(economy);
  for(const o of world.objects||[]){
    if(['carrot','corn','pumpkin','tomato','strawberry','cabbage','potato'].includes(o.type)&&Number(o.growth||0)<1)o.growth=Math.min(1,Number(o.growth||0)+(weather==='rain'?.18:.10));
    if(['appleTree','orangeTree','peachTree'].includes(o.type)&&Number(o.growth||0)<1&&season!=='winter')o.growth=Math.min(1,Number(o.growth||0)+.09);
    if(['cow','sheep','chicken'].includes(o.type)&&!o.productReady){const wait=o.type==='sheep'?3:1;if(newDay-Number(o.lastProductDay||0)>=wait)o.productReady=true}
  }
  settings.worldDay=newDay;settings.simMinutes=360;settings.economy=economy;settings.wakeMessage=earned?`早安！昨天的出貨收入 +${earned} 金幣`:'早安！新的一天開始了 ☀️';
  const bed=nearestBed(world);if(bed&&world.player){const e=localExit(Number(bed.x||0),Number(bed.z||0),Number(bed.rot||0));world.player.x=e.x;world.player.z=e.z;world.player.y=0}
  world.version=Math.max(Number(world.version)||4.3,4.4);world.savedAt=Date.now();
}

btn.onclick=()=>{
  if(!isLying())return;
  $('#saveNow')?.click();btn.disabled=true;fade.classList.add('on');
  setTimeout(()=>{
    const world=read(WORLD_KEY,null),settings=read(SETTINGS_KEY,{});if(!world){fade.innerHTML='<div>找不到世界存檔<small>請先離開床再試一次</small></div>';btn.disabled=false;return}
    advanceOneDay(world,settings);write(WORLD_KEY,world);write(SETTINGS_KEY,settings);
    fade.innerHTML='<div>☀️ 早安！<small>新的一天準備好了</small></div>';
    setTimeout(()=>location.reload(),650);
  },180);
};
