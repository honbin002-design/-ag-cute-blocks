// AG Cute Blocks V0.5.95 — recent items + player favourites for the mobile catalogue.
// Additive only. Uses delegated click tracking; no MutationObserver and no core catalogue replacement.
const VERSION='0.5.95';
const RECENT_KEY='agcb_catalog_recent_v0595';
const FAV_KEY='agcb_catalog_favorites_v0595';
const cats=document.getElementById('cats');
const items=document.getElementById('items');
const catalog=document.querySelector('.catalog');
const MAX_RECENT=8,MAX_FAV=24;
function read(key){try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
function write(key,v){localStorage.setItem(key,JSON.stringify(v))}
function catName(){return cats?.querySelector('.cat.on')?.textContent?.trim()||''}
function itemName(btn){return btn?.querySelector('small')?.textContent?.trim()||''}
function selected(){const btn=items?.querySelector('.item.on');const name=itemName(btn);return name?{category:catName(),name}:null}
function same(a,b){return a?.category===b?.category&&a?.name===b?.name}
function remember(entry){if(!entry?.category||!entry?.name)return;let list=read(RECENT_KEY).filter(x=>!same(x,entry));list.unshift(entry);write(RECENT_KEY,list.slice(0,MAX_RECENT))}
function selectEntry(entry){if(!entry)return false;const cat=[...(cats?.querySelectorAll('.cat')||[])].find(b=>(b.textContent||'').trim()===entry.category);if(!cat)return false;cat.click();const btn=[...(items?.querySelectorAll('.item')||[])].find(b=>itemName(b)===entry.name);if(!btn)return false;btn.click();btn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});return true}
function choose(title,list){if(!list.length){alert(title==='最近使用'?'還沒有最近使用項目':'還沒有收藏項目');return}const text=list.map((x,i)=>`${i+1}. ${x.category}｜${x.name}`).join('\n');const n=Number(prompt(`${title}：\n${text}\n\n輸入編號：`)||0);if(n>=1&&n<=list.length)selectEntry(list[n-1])}
function toggleFavorite(){const entry=selected();if(!entry)return alert('先選一個物品');let list=read(FAV_KEY),exists=list.some(x=>same(x,entry));if(exists){list=list.filter(x=>!same(x,entry));alert(`已取消收藏：${entry.name}`)}else{list.unshift(entry);list=list.slice(0,MAX_FAV);alert(`已收藏：${entry.name}`)}write(FAV_KEY,list);syncStar()}
function syncStar(){const b=document.getElementById('agCatalogFavoriteToggle');if(!b)return;const entry=selected(),on=entry&&read(FAV_KEY).some(x=>same(x,entry));b.textContent=on?'★':'☆';b.setAttribute('aria-label',on?'取消收藏目前物品':'收藏目前物品')}
items?.addEventListener('click',e=>{const b=e.target.closest('.item');if(!b)return;queueMicrotask(()=>{remember(selected());syncStar()})});
cats?.addEventListener('click',()=>queueMicrotask(syncStar));
if(catalog&&!document.getElementById('agCatalogRecent')){
 const style=document.createElement('style');style.textContent='#agCatalogRecent,#agCatalogFavorites,#agCatalogFavoriteToggle{position:absolute;top:-35px;z-index:92;height:30px;border:0;border-radius:11px;background:#fffde8e8;box-shadow:0 2px 8px #0002;font-weight:900;color:#42565c;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}#agCatalogRecent{left:40px;width:40px;font-size:15px}#agCatalogFavorites{left:86px;width:40px;font-size:15px}#agCatalogFavoriteToggle{left:132px;width:36px;font-size:20px}@media(max-height:430px){#agCatalogRecent,#agCatalogFavorites,#agCatalogFavoriteToggle{top:-31px;height:27px}#agCatalogRecent{left:37px;width:36px}#agCatalogFavorites{left:78px;width:36px}#agCatalogFavoriteToggle{left:119px;width:32px}}';document.head.appendChild(style);
 const recent=document.createElement('button');recent.id='agCatalogRecent';recent.textContent='🕘';recent.setAttribute('aria-label','最近使用');recent.onclick=()=>choose('最近使用',read(RECENT_KEY));catalog.appendChild(recent);
 const favs=document.createElement('button');favs.id='agCatalogFavorites';favs.textContent='⭐';favs.setAttribute('aria-label','我的收藏');favs.onclick=()=>choose('我的收藏',read(FAV_KEY));catalog.appendChild(favs);
 const toggle=document.createElement('button');toggle.id='agCatalogFavoriteToggle';toggle.textContent='☆';toggle.onclick=toggleFavorite;catalog.appendChild(toggle);syncStar();
}
globalThis.__AGCB_CATALOG_QUICK={version:VERSION,status:'ACTIVE',recent:()=>read(RECENT_KEY),favorites:()=>read(FAV_KEY),select:selectEntry,toggleFavorite};
