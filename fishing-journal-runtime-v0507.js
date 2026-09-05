// AG Cute Blocks V0.5.07 fishing journal.
// Additive only: observes the existing catch toast and never alters fishing/economy state.
const KEY='ag_cute_blocks_fishing_journal_v1';
const FISH=[['小魚','smallFish','🐟'],['河魚','riverFish','🐠'],['金色稀有魚','goldFish','✨']];
const $=s=>document.querySelector(s);
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return{}}}
const journal=load();for(const [,id] of FISH)journal[id]=Math.max(0,Math.floor(Number(journal[id])||0));
function save(){localStorage.setItem(KEY,JSON.stringify(journal))}
function found(){return FISH.filter(([,id])=>journal[id]>0).length}
function total(){return FISH.reduce((n,[,id])=>n+journal[id],0)}

const style=document.createElement('style');style.textContent=`.fishJournalBtn{display:none;position:fixed;z-index:84;right:max(12px,calc(env(safe-area-inset-right) + 8px));top:max(158px,calc(env(safe-area-inset-top) + 150px));border:0;border-radius:13px;background:#fff8e8ee;color:#4d5f65;box-shadow:0 3px 12px #0002;padding:7px 10px;font-size:11px;font-weight:900;pointer-events:auto}.fishJournalBtn.on{display:block}.fishJournalPanel{position:fixed;z-index:96;right:0;top:0;height:100dvh;width:min(330px,88vw);background:#fffaf2f8;box-shadow:-8px 0 28px #0003;transform:translateX(110%);transition:.2s;pointer-events:auto;padding:max(18px,env(safe-area-inset-top)) 14px max(16px,env(safe-area-inset-bottom));color:#40585e}.fishJournalPanel.open{transform:translateX(0)}.fishJournalPanel h3{margin:2px 42px 12px 0}.fishJournalClose{position:absolute;right:12px;top:max(10px,env(safe-area-inset-top));width:38px;height:38px;border:0;border-radius:50%;background:#fff;font-size:20px;font-weight:900}.fishJournalRow{display:grid;grid-template-columns:1fr auto;gap:10px;padding:11px 10px;margin:7px 0;background:#fff;border-radius:12px}.fishJournalUnknown{opacity:.48;filter:grayscale(1)}.fishJournalSummary{font-size:12px;font-weight:800;margin-bottom:10px}@media(max-height:430px){.fishJournalBtn{top:max(146px,calc(env(safe-area-inset-top) + 138px));font-size:10px}.fishJournalPanel{width:min(310px,84vw)}}`;document.head.appendChild(style);
const btn=document.createElement('button');btn.id='fishJournalBtn';btn.className='fishJournalBtn';document.body.appendChild(btn);
const panel=document.createElement('aside');panel.id='fishJournalPanel';panel.className='fishJournalPanel';panel.innerHTML='<button class="fishJournalClose" aria-label="關閉釣魚圖鑑">×</button><h3>🐟 釣魚圖鑑</h3><div id="fishJournalSummary" class="fishJournalSummary"></div><div id="fishJournalRows"></div>';document.body.appendChild(panel);
function render(){btn.textContent=`🐟 圖鑑 ${found()}/${FISH.length}`;$('#fishJournalSummary').textContent=`已發現 ${found()}/${FISH.length} 種・累計釣獲 ${total()} 尾`;$('#fishJournalRows').innerHTML=FISH.map(([name,id,icon])=>journal[id]>0?`<div class="fishJournalRow"><span>${icon} ${name}</span><b>×${journal[id]}</b></div>`:`<div class="fishJournalRow fishJournalUnknown"><span>❔ 尚未發現</span><b>—</b></div>`).join('')}
function selectedFishingRod(){const item=$('#items .item.on');return !!item&&item.textContent.includes('釣魚竿')}
function refreshVisibility(){btn.classList.toggle('on',selectedFishingRod())}
btn.onclick=()=>{render();panel.classList.add('open')};panel.querySelector('.fishJournalClose').onclick=()=>panel.classList.remove('open');
const status=$('#status');if(status){let previous=status.textContent;new MutationObserver(()=>{const text=status.textContent||'';if(text===previous)return;previous=text;for(const [name,id] of FISH){if(text.includes('釣到')&&text.includes(name)){journal[id]++;save();render();break}}}).observe(status,{childList:true,subtree:true,characterData:true})}
render();refreshVisibility();setInterval(refreshVisibility,700);
globalThis.__AGCB_FISHING_JOURNAL={version:'0.5.07',active:true,persistent:true,observesCatchToast:true,get counts(){return {...journal}},get found(){return found()},get total(){return total()}};
