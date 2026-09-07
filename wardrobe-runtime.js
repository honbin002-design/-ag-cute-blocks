// AG Cute Blocks wardrobe runtime — V0.5.18
// iPhone-first, local-only wardrobe state. No paid services or network dependency.
(() => {
  const VERSION='V0.5.18';
  const COLORS=['白色','藍色','灰色','紅色','黃色','粉紅色'];
  const BACKS=['無','和服大蝴蝶結','特大蝴蝶結','蝴蝶翅膀','天使翅膀','大天使翅膀','惡魔翅膀'];
  const EARS=['貓耳'];
  const KEY='agcb.wardrobe.v1';
  let state={color:'粉紅色',back:'無',ears:'貓耳'};
  try{state={...state,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
  const save=()=>{localStorage.setItem(KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('ag-wardrobe-change',{detail:{...state}}));};
  function mount(){
    if(document.getElementById('agWardrobeBtn'))return;
    const css=document.createElement('style');css.textContent=`#agWardrobeBtn{position:fixed;z-index:88;right:max(18px,env(safe-area-inset-right));top:max(118px,calc(env(safe-area-inset-top) + 108px));border:3px solid #fff;border-radius:18px;background:#fffde8e8;padding:8px 11px;font-weight:900;color:#42565c;box-shadow:0 3px 12px #0002}#agWardrobe{display:none;position:fixed;z-index:150;inset:0;background:#0005;align-items:center;justify-content:center;padding:16px}#agWardrobe.open{display:flex}#agWardrobeCard{width:min(520px,92vw);max-height:86dvh;overflow:auto;background:#fffaf0;border-radius:22px;padding:16px;color:#3d5556;box-shadow:0 12px 40px #0005}#agWardrobeCard h2{margin:0 0 12px}.agWRow{margin:12px 0}.agWLabel{font-weight:900;margin-bottom:6px}.agWOptions{display:flex;gap:7px;flex-wrap:wrap}.agWOpt{border:2px solid #e5dccb;border-radius:12px;background:white;padding:8px 10px;font-weight:800}.agWOpt.on{outline:3px solid #ffe06b}.agWClose{float:right;border:0;border-radius:50%;width:38px;height:38px;background:#fff;font-size:22px;font-weight:900;box-shadow:0 2px 8px #0002}`;document.head.appendChild(css);
    const btn=document.createElement('button');btn.id='agWardrobeBtn';btn.textContent='👗 衣櫃';document.body.appendChild(btn);
    const modal=document.createElement('div');modal.id='agWardrobe';modal.innerHTML=`<div id="agWardrobeCard"><button class="agWClose">×</button><h2>👗 衣櫃 <small>${VERSION}</small></h2><div class="agWRow"><div class="agWLabel">服裝色系</div><div class="agWOptions" data-k="color"></div></div><div class="agWRow"><div class="agWLabel">背飾</div><div class="agWOptions" data-k="back"></div></div><div class="agWRow"><div class="agWLabel">耳飾系列</div><div class="agWOptions" data-k="ears"></div></div></div>`;document.body.appendChild(modal);
    const sets={color:COLORS,back:BACKS,ears:EARS};
    const render=()=>Object.entries(sets).forEach(([k,arr])=>{const box=modal.querySelector(`[data-k="${k}"]`);box.innerHTML='';arr.forEach(v=>{const b=document.createElement('button');b.className='agWOpt'+(state[k]===v?' on':'');b.textContent=v;b.onclick=()=>{state[k]=v;save();render()};box.appendChild(b)})});
    btn.onclick=()=>{render();modal.classList.add('open')};modal.querySelector('.agWClose').onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});render();save();
  }
  window.AGWardrobe={version:VERSION,get:()=>({...state}),set:(v)=>{state={...state,...v};save()}};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount):mount();
})();
