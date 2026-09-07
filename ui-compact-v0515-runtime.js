// AG Cute Blocks V0.5.15 compact bottom HUD refinement.
// Shrinks control chrome while increasing readable Traditional Chinese labels.
const old=document.getElementById('agcb-compact-bottom-ui-v0515');if(old)old.remove();
const style=document.createElement('style');style.id='agcb-compact-bottom-ui-v0515';style.textContent=`
.catalog{left:22px!important;right:max(210px,calc(env(safe-area-inset-right) + 200px))!important;bottom:max(8px,env(safe-area-inset-bottom))!important;transform:none!important;width:auto!important;max-width:none!important}
.cats,.items{gap:6px!important;padding:1px!important}.cats{margin-bottom:5px!important}
.cat{height:36px!important;padding:4px 10px!important;border-radius:10px!important;font-size:15px!important;line-height:20px!important;font-weight:900!important}
.item{min-width:62px!important;width:62px!important;height:50px!important;border-width:2px!important;border-radius:10px!important;font-size:24px!important}
.item small{font-size:12px!important;line-height:14px!important;bottom:2px!important;left:2px!important;right:2px!important;font-weight:900!important;background:#fffffff0!important}
@media(max-height:430px){.catalog{left:14px!important;right:max(188px,calc(env(safe-area-inset-right) + 178px))!important}.cat{height:32px!important;padding:3px 8px!important;font-size:14px!important}.item{min-width:56px!important;width:56px!important;height:44px!important;font-size:22px!important}.item small{font-size:11px!important;line-height:12px!important}}
`;document.head.appendChild(style);globalThis.__AGCB_COMPACT_UI={version:'0.5.15',loaded:true};
