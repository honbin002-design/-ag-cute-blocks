import {advanceDailySnapshot} from './daily-progression-system.js';

const WORLD_KEY='ag_cute_blocks_world_v04';
const SETTINGS_KEY='ag_cute_blocks_settings_v048_special_models_r2';
const CARE_KEY='ag_cute_blocks_crop_care_v1';
const $=s=>document.querySelector(s);
const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??fallback}catch{return fallback}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const style=document.createElement('style');
style.textContent=`
 .sleepMorning{position:fixed;z-index:88;left:auto;right:max(104px,calc(env(safe-area-inset-right) + 96px));top:max(96px,calc(env(safe-area-inset-top) + 84px));transform:none;border:0;border-radius:18px;padding:11px 15px;background:#304766e8;color:white;font-size:13px;font-weight:900;box-shadow:0 5px 22px #0004;display:none;pointer-events:auto;touch-action:manipulation;white-space:nowrap}.sleepMorning.show{display:block}.sleepFade{position:fixed;z-index:180;inset:0;background:#263858;opacity:0;pointer-events:none;transition:opacity .42s ease;display:flex;align-items:center;justify-content:center;color:white;font-size:22px;font-weight:900}.sleepFade.on{opacity:1}.sleepFade small{display:block;font-size:12px;text-align:center;margin-top:8px;opacity:.75}@media(max-height:430px){.sleepMorning{top:max(92px,calc(env(safe-area-inset-top) + 80px));right:max(98px,calc(env(safe-area-inset-right) + 90px));padding:9px 13px;font-size:12px}}`;
document.head.appendChild(style);
const btn=document.createElement('button');btn.className='sleepMorning';btn.textContent='😴 睡到天亮';btn.setAttribute('aria-label','睡到天亮');document.body.appendChild(btn);
const fade=document.createElement('div');fade.className='sleepFade';fade.innerHTML='<div>🌙 晚安…<small>世界會安全存檔，明早再繼續</small></div>';document.body.appendChild(fade);

function isLying(){return ($('#status')?.textContent||'').includes('躺下休息')||($('#lifeInteract')?.textContent||'').includes('起身')&&($('#status')?.textContent||'').includes('躺下')}
function refresh(){btn.classList.toggle('show',isLying())}
new MutationObserver(refresh).observe(document.body,{subtree:true,childList:true,characterData:true});
setInterval(refresh,500);refresh();

function localExit(x,z,rot,d=1.55){return {x:x+Math.sin(rot||0)*d,z:z+Math.cos(rot||0)*d}}
function nearestBed(world){const p=world?.player||{x:0,z:0};let best=null,dist=3;for(const o of world?.objects||[]){if(o.type!=='bed'&&o.type!=='starBed')continue;const d=Math.hypot((o.x||0)-(p.x||0),(o.z||0)-(p.z||0));if(d<dist){dist=d;best=o}}return best}
function advanceOneDay(world,settings,careStore){
  const result=advanceDailySnapshot(world,settings,careStore,{wakeMinute:360});
  settings.wakeMessage=result.earned?`早安！昨天的出貨收入 +${result.earned} 金幣`:'早安！新的一天開始了 ☀️';
  const bed=nearestBed(world);if(bed&&world.player){const e=localExit(Number(bed.x||0),Number(bed.z||0),Number(bed.rot||0));world.player.x=e.x;world.player.z=e.z;world.player.y=0}
  return result;
}

btn.onclick=()=>{
  if(!isLying())return;
  globalThis.AGCBCharacterPose?.('sleep');
  $('#saveNow')?.click();btn.disabled=true;fade.classList.add('on');
  setTimeout(()=>{
    const world=read(WORLD_KEY,null),settings=read(SETTINGS_KEY,{}),careStore=read(CARE_KEY,{});if(!world){fade.innerHTML='<div>找不到世界存檔<small>請先離開床再試一次</small></div>';btn.disabled=false;return}
    advanceOneDay(world,settings,careStore);write(WORLD_KEY,world);write(SETTINGS_KEY,settings);
    fade.innerHTML='<div>☀️ 早安！<small>新的一天準備好了</small></div>';
    setTimeout(()=>location.reload(),650);
  },260);
};

globalThis.__AGCB_SLEEP_ROUTINE={version:'V0.4.85',settingsKey:SETTINGS_KEY,sameActiveSettingsKey:true};
