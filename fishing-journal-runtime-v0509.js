// AG Cute Blocks V0.5.09 fishing journal + first-discovery + ecology guide.
// Additive only: observes catch toasts and reads the existing ecology rules; never mutates fishing/economy state.
import {getFishingWeights} from './fishing-ecology-system.js';
const KEY='ag_cute_blocks_fishing_journal_v1';
const FISH=[['小魚','smallFish','🐟'],['河魚','riverFish','🐠'],['金色稀有魚','goldFish','✨']];
const SEASONS=[['spring','春天'],['summer','夏天'],['autumn','秋天'],['winter','冬天']];
const WEATHERS=[['sunny','晴天'],['cloudy','陰天'],['rain','下雨'],['thunderstorm','雷雨'],['fog','起霧'],['snow','下雪']];
const TIMES=[['清晨',390],['白天',720],['黃昏',1080],['夜晚',1320]];
const $=s=>document.querySelector(s);
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return{}}}
const journal=load();for(const [,id] of FISH)journal[id]=Math.max(0,Math.floor(Number(journal[id])||0));
function save(){localStorage.setItem(KEY,JSON.stringify(journal))}
function found(){return FISH.filter(([,id])=>journal[id]>0).length}
function total(){return FISH.reduce((n,[,id])=>n+journal[id],0)}
function bestLabel(entries,score){let best=entries[0],bestScore=-Infinity;for(const e of entries){const s=score(e);if(s>bestScore){best=e;bestScore=s}}return best[1]}
function guideFor(id){
  const season=bestLabel(SEASONS,([v])=>getFishingWeights({season:v,weather:'sunny',minute:720})[id]);
  const weather=bestLabel(WEATHERS,([v])=>getFishingWeights({season:'spring',weather:v,minute:720})[id]);
  const time=bestLabel(TIMES,([,minute])=>getFishingWeights({season:'spring',weather:'sunny',minute})[id]);
  return `${season}・${weather}・${time}`;
}
const style=document.createElement('style');style.textContent=`.fishJournalBtn{display:none;position:fixed;z-index:84;right:max(12px,calc(env(safe-area-inset-right) + 8px));top:max(158px,calc(env(safe-area-inset-top) + 150px));border:0;border-radius:13px;background:#fff8e8ee;color:#4d5f65;box-shadow:0 3px 12px #0002;padding:7px 10px;font-size:11px;font-weight:900;pointer-events:auto}.fishJournalBtn.on{display:block}.fishJournalPanel{position:fixed;z-index:96;right:0;top:0;height:100dvh;width:min(350px,90vw);background:#fffaf2f8;box-shadow:-8px 0 28px #0003;transform:translateX(110%);transition:.2s;pointer-events:auto;padding:max(18px,env(safe-area-inset-top)) 14px max(16px,env(safe-area-inset-bottom));color:#40585e;overflow:auto}.fishJournalPanel.open{transform:translateX(0)}.fishJournalPanel h3{margin:2px 42px 12px 0}.fishJournalClose{position:absolute;right:12px;top:max(10px,env(safe-area-inset-top));width:38px;height:38px;border:0;border-radius:50%;background:#fff;font-size:20px;font-weight:900}.fishJournalRow{display:grid;grid-template-columns:1fr auto;gap:8px 10px;padding:11px 10px;margin:7px 0;background:#fff;border-radius:12px}.fishJournalRow small{grid-column:1/-1;font-size:10px;opacity:.72;font-weight:800}.fishJournalUnknown{opacity:.48;filter:grayscale(1)}.fishJournalSummary{font-size:12px;font-weight:800;margin-bottom:10px}.fishJournalGuideNote{font-size:10px;line-height:1.45;background:#eef7e8;border-radius:10px;padding:8px 9px;margin-bottom:10px}.fishDiscovery{display:none;position:fixed;z-index:98;right:max(14px,calc(env(safe-area-inset-right) + 10px));top:max(208px,calc(env(safe-area-inset-top) + 200px));max-width:min(260px,52vw);background:#fff8c9f2;color:#4d5a5f;border:2px solid #fff;border-radius:14px;padding:9px 12px;box-shadow:0 4px 16px #0003;font-size:12px;font-weight:900;pointer-events:none}.fishDiscovery.on{display:block}@media(max-height:430px){.fishJournalBtn{top:max(146px,calc(env(safe-area-inset-top) + 138px));font-size:10px}.fishJournalPanel{width:min(330px,86vw)}.fishDiscovery{top:max(190px,calc(env(safe-area-inset-top) + 182px));font-size:11px}}`;document.head.appendChild(style);
const btn=document.createElement('button');btn.id='fishJournalBtn';btn.className='fishJournalBtn';document.body.appendChild(btn);
const panel=document.createElement('aside');panel.id='fishJournalPanel';panel.className='fishJournalPanel';panel.innerHTML='<button class="fishJournalClose" aria-label="關閉釣魚圖鑑">×</button><h3>🐟 釣魚圖鑑</h3><div id="fishJournalSummary" class="fishJournalSummary"></div><div class="fishJournalGuideNote">較容易出現條件依目前季節／天氣／時段生態規則推算，不顯示機率百分比。</div><div id="fishJournalRows"></div>';document.body.appendChild(panel);
const discovery=document.createElement('div');discovery.id='fishDiscovery';discovery.className='fishDiscovery';document.body.appendChild(discovery);
let discoveryTimer=0;
function showFirstDiscovery(name,icon){discovery.textContent=`✨ 首次發現！${icon} ${name} 已加入圖鑑`;discovery.classList.add('on');clearTimeout(discoveryTimer);discoveryTimer=setTimeout(()=>discovery.classList.remove('on'),2400)}
function render(){btn.textContent=`🐟 圖鑑 ${found()}/${FISH.length}`;$('#fishJournalSummary').textContent=`已發現 ${found()}/${FISH.length} 種・累計釣獲 ${total()} 尾`;$('#fishJournalRows').innerHTML=FISH.map(([name,id,icon])=>journal[id]>0?`<div class="fishJournalRow"><span>${icon} ${name}</span><b>×${journal[id]}</b><small>較容易：${guideFor(id)}</small></div>`:`<div class="fishJournalRow fishJournalUnknown"><span>❔ 尚未發現</span><b>—</b><small>捕獲後解鎖出現條件提示</small></div>`).join('')}
function selectedFishingRod(){const item=$('#items .item.on');return !!item&&item.textContent.includes('釣魚竿')}
function refreshVisibility(){btn.classList.toggle('on',selectedFishingRod())}
btn.onclick=()=>{render();panel.classList.add('open')};panel.querySelector('.fishJournalClose').onclick=()=>panel.classList.remove('open');
const status=$('#status');if(status){let previous=status.textContent;new MutationObserver(()=>{const text=status.textContent||'';if(text===previous)return;previous=text;for(const [name,id,icon] of FISH){if(text.includes('釣到')&&text.includes(name)){const first=journal[id]===0;journal[id]++;save();render();if(first)showFirstDiscovery(name,icon);break}}}).observe(status,{childList:true,subtree:true,characterData:true})}
render();refreshVisibility();setInterval(refreshVisibility,700);
globalThis.__AGCB_FISHING_JOURNAL={version:'0.5.09',active:true,persistent:true,observesCatchToast:true,firstDiscoveryFeedback:true,ecologyGuide:true,get counts(){return {...journal}},get found(){return found()},get total(){return total()},guideFor};
