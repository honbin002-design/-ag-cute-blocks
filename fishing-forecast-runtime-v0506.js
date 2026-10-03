import {getFishingWeights,fishingTimeBand} from './fishing-ecology-system.js';

const $=s=>document.querySelector(s);
const TIME_LABEL={dawn:'清晨',day:'白天',dusk:'黃昏',night:'夜晚'};
const WEATHER_LABEL={sunny:'晴天',cloudy:'陰天',rain:'雨天',thunderstorm:'雷雨',fog:'霧天',snow:'雪天'};

function selectedFishingRod(){const item=$('#items .item.on');return !!item&&item.textContent.includes('釣魚竿')}
function readContext(){const clock=($('#clock')?.textContent||'12:00').match(/(\d{1,2}):(\d{2})/),minute=clock?(Number(clock[1])*60+Number(clock[2])):720;return{season:$('#season')?.value||'spring',weather:$('#weather')?.value||'sunny',minute}}
function forecastText(ctx){const w=getFishingWeights(ctx),band=fishingTimeBand(ctx.minute),rare=w.goldFish,river=w.riverFish;let trend='一般魚況';if(rare>=.28)trend='稀有魚較活躍';else if(river>=.42)trend='河魚較活躍';else if(w.smallFish>=.54)trend='小魚較活躍';return `🎣 魚況：${TIME_LABEL[band]}・${WEATHER_LABEL[ctx.weather]||'目前天氣'}・${trend}`}

const style=document.createElement('style');style.textContent=`.fishForecast{display:none;position:fixed;z-index:84;right:max(12px,calc(env(safe-area-inset-right) + 8px));top:max(120px,calc(env(safe-area-inset-top) + 112px));max-width:min(300px,42vw);padding:7px 10px;border-radius:13px;background:#eaf8fff0;color:#355a68;box-shadow:0 3px 12px #0002;font-size:11px;font-weight:900;pointer-events:none}.fishForecast.on{display:block}@media(max-height:430px){.fishForecast{top:max(112px,calc(env(safe-area-inset-top) + 104px));font-size:10px;max-width:38vw}}`;document.head.appendChild(style);
const chip=document.createElement('div');chip.id='fishForecast';chip.className='fishForecast';chip.setAttribute('aria-live','polite');document.body.appendChild(chip);
let signature='';function refresh(){const on=selectedFishingRod();chip.classList.toggle('on',on);if(!on)return;const ctx=readContext(),next=`${ctx.season}/${ctx.weather}/${Math.floor(ctx.minute/30)}`;if(next===signature)return;signature=next;chip.textContent=forecastText(ctx)}
refresh();setInterval(refresh,700);

globalThis.__AGCB_FISHING_FORECAST={version:'0.5.06',active:true,position:'right',probabilitiesHidden:true,get text(){return forecastText(readContext())}};
