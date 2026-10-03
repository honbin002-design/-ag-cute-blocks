// AG Cute Blocks V0.5.94 — lightweight catalogue search for mobile.
// Additive only: does not replace catalogue rendering or game actions.
const VERSION='0.5.94';
const catalog=document.querySelector('.catalog');
const cats=document.getElementById('cats');
const items=document.getElementById('items');

function activeText(root,selector){return root?.querySelector(selector)?.textContent?.trim()||''}
function byText(root,selector,text){return [...(root?.querySelectorAll(selector)||[])].find(el=>(el.textContent||'').trim()===text)}
function itemName(btn){return btn?.querySelector('small')?.textContent?.trim()||''}
function restore(categoryName,itemLabel){
  const cat=byText(cats,'.cat',categoryName);if(cat)cat.click();
  if(itemLabel){const item=[...(items?.querySelectorAll('.item')||[])].find(b=>itemName(b)===itemLabel);if(item)item.click()}
}
function runSearch(){
  const query=(prompt('搜尋建材、家具、農作或其他物品：')||'').trim();
  if(!query)return;
  const originalCategory=activeText(cats,'.cat.on');
  const originalItem=itemName(items?.querySelector('.item.on'));
  const categoryNames=[...(cats?.querySelectorAll('.cat')||[])].map(b=>(b.textContent||'').trim()).filter(Boolean);
  const needle=query.toLocaleLowerCase('zh-Hant');
  for(const categoryName of categoryNames){
    const cat=byText(cats,'.cat',categoryName);if(!cat)continue;cat.click();
    const matches=[...(items?.querySelectorAll('.item')||[])].filter(b=>itemName(b).toLocaleLowerCase('zh-Hant').includes(needle));
    if(matches.length){matches[0].click();matches[0].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});return}
  }
  restore(originalCategory,originalItem);
  alert(`找不到「${query}」`);
}

if(catalog&&!document.getElementById('agCatalogSearch')){
  const style=document.createElement('style');
  style.textContent='#agCatalogSearch{position:absolute;left:0;top:-35px;z-index:92;width:34px;height:30px;border:0;border-radius:11px;background:#fffde8e8;box-shadow:0 2px 8px #0002;font-size:16px;font-weight:900;color:#42565c;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}@media(max-height:430px){#agCatalogSearch{top:-31px;width:31px;height:27px;font-size:14px}}';
  document.head.appendChild(style);
  const button=document.createElement('button');button.id='agCatalogSearch';button.type='button';button.textContent='🔎';button.setAttribute('aria-label','搜尋建材與物品');button.onclick=runSearch;catalog.appendChild(button);
}

globalThis.__AGCB_CATALOG_SEARCH={version:VERSION,status:'ACTIVE',search:runSearch};
