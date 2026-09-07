// AG Cute Blocks V0.5.15 compact HUD refinement v3 + collapsible catalog drawer.
const old=document.getElementById('agcb-compact-bottom-ui-v0515');if(old)old.remove();
const style=document.createElement('style');style.id='agcb-compact-bottom-ui-v0515';style.textContent=`
.catalog{left:22px!important;right:max(205px,calc(env(safe-area-inset-right) + 195px))!important;bottom:max(8px,env(safe-area-inset-bottom))!important;transform:none!important;width:auto!important;max-width:none!important;transition:width .18s ease,transform .18s ease,opacity .18s ease!important}
.cats,.items{gap:5px!important;padding:1px!important}.cats{margin-bottom:4px!important}
.cat{height:34px!important;padding:3px 9px!important;border-radius:9px!important;font-size:15px!important;line-height:20px!important;font-weight:900!important;display:flex!important;align-items:center!important;gap:4px!important}
.item{min-width:58px!important;width:58px!important;height:47px!important;border-width:2px!important;border-radius:9px!important;font-size:22px!important}
.item small{font-size:12px!important;line-height:14px!important;bottom:1px!important;left:2px!important;right:2px!important;font-weight:900!important;background:#fffffff2!important}
.actions{transform:scale(.90)!important;transform-origin:right bottom!important}.actionLabel{font-size:11px!important;line-height:12px!important;margin-top:2px!important}
#agCatalogToggle{position:absolute!important;left:-2px!important;bottom:0!important;z-index:30!important;width:42px!important;height:42px!important;border:2px solid #fff!important;border-radius:12px!important;background:#fffbe5!important;box-shadow:0 3px 9px #0002!important;font-size:22px!important;font-weight:900!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important}
.catalog.agCollapsed{right:auto!important;width:44px!important;height:44px!important;min-width:44px!important;overflow:visible!important;background:transparent!important;box-shadow:none!important}
.catalog.agCollapsed .cats,.catalog.agCollapsed .items{display:none!important}
.catalog:not(.agCollapsed) #agCatalogToggle{left:-48px!important}
@media(max-height:430px){.catalog{left:14px!important;right:max(180px,calc(env(safe-area-inset-right) + 170px))!important}.cat{height:31px!important;padding:2px 7px!important;font-size:14px!important}.item{min-width:53px!important;width:53px!important;height:43px!important;font-size:20px!important}.item small{font-size:11px!important;line-height:12px!important}.actions{transform:scale(.86)!important}}
`;document.head.appendChild(style);
const icons={形狀:'🧊',建材:'🌳',建築:'🏠',家具:'🛋️',家電:'🖥️',農具:'🌱',農作:'🌾',果樹:'🌳',動物:'🐾',生活:'🧺'};
function decorateCats(){document.querySelectorAll('.cat').forEach(btn=>{const raw=(btn.textContent||'').trim();const key=Object.keys(icons).find(k=>raw.includes(k));if(!key||btn.dataset.agIconed)return;btn.dataset.agIconed='1';btn.textContent=`${icons[key]} ${raw}`})}
function installDrawer(){const catalog=document.querySelector('.catalog');if(!catalog||document.getElementById('agCatalogToggle'))return;const btn=document.createElement('button');btn.id='agCatalogToggle';btn.type='button';btn.setAttribute('aria-label','收合或展開功能列');const apply=collapsed=>{catalog.classList.toggle('agCollapsed',collapsed);btn.textContent=collapsed?'☰':'‹';btn.title=collapsed?'展開功能列':'收合功能列';btn.setAttribute('aria-expanded',String(!collapsed));localStorage.setItem('ag_catalog_collapsed_v1',collapsed?'1':'0')};btn.addEventListener('click',e=>{e.stopPropagation();apply(!catalog.classList.contains('agCollapsed'))});catalog.appendChild(btn);apply(localStorage.getItem('ag_catalog_collapsed_v1')==='1')}
const mo=new MutationObserver(()=>{decorateCats();installDrawer()});mo.observe(document.documentElement,{childList:true,subtree:true});decorateCats();installDrawer();
globalThis.__AGCB_COMPACT_UI={version:'0.5.15-ui3',loaded:true,target:'compact-collapsible-left-drawer'};
