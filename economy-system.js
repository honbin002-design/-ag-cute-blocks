// AG Cute Blocks gentle optional economy.
// Coins are a side-goal only: no debt, interest, daily pressure, login streaks or punishment.
export const ECONOMY_SCHEMA=2;

export const ITEM_NAMES={
  carrot:'紅蘿蔔',corn:'玉米',pumpkin:'南瓜',tomato:'番茄',strawberry:'草莓',cabbage:'高麗菜',potato:'馬鈴薯',
  apple:'蘋果',orange:'橘子',peach:'桃子',egg:'雞蛋',milk:'牛奶',wool:'羊毛'
};
export const SELL_VALUES={
  carrot:18,corn:26,pumpkin:42,tomato:24,strawberry:30,cabbage:28,potato:20,
  apple:24,orange:26,peach:30,egg:18,milk:34,wool:38
};
export const SHOP_ITEMS=[
  {id:'sapling-peach',name:'特選桃樹苗',price:180,kind:'sapling',icon:'🌳'},
  {id:'pet-bed-round',name:'圓圓寵物床',price:220,kind:'furniture',icon:'🧺'},
  {id:'lamp-cloud',name:'雲朵燈',price:280,kind:'decoration',icon:'☁️'},
  {id:'arch-flower',name:'花朵拱門',price:360,kind:'decoration',icon:'🌸'},
  {id:'swing-garden',name:'花園鞦韆',price:420,kind:'decoration',icon:'🌿'},
  {id:'bed-star',name:'星星床',price:520,kind:'furniture',icon:'⭐'}
];

export function createEconomyState(saved={}){
  const inventory={};for(const [k,v] of Object.entries(saved.inventory||{})){const n=Math.max(0,Math.floor(Number(v)||0));if(n)inventory[k]=n}
  return {schema:ECONOMY_SCHEMA,coins:Math.max(0,Number(saved.coins)||0),inventory,shipping:Array.isArray(saved.shipping)?saved.shipping:[],owned:Array.isArray(saved.owned)?saved.owned:[]};
}
export function addInventory(state,itemId,qty=1){qty=Math.max(1,Math.floor(qty));state.inventory[itemId]=(state.inventory[itemId]||0)+qty;return state.inventory[itemId]}
export function inventoryCount(state,itemId){return Math.max(0,state.inventory[itemId]||0)}
export function removeInventory(state,itemId,qty=1){qty=Math.max(1,Math.floor(qty));const have=inventoryCount(state,itemId);if(have<qty)return false;const next=have-qty;if(next)state.inventory[itemId]=next;else delete state.inventory[itemId];return true}
export function shipItem(state,itemId,qty=1){qty=Math.max(1,Math.floor(qty));if(!SELL_VALUES[itemId])return {ok:false,reason:'not-sellable'};if(!removeInventory(state,itemId,qty))return {ok:false,reason:'inventory'};state.shipping.push({itemId,qty,unit:SELL_VALUES[itemId],addedAt:Date.now()});return {ok:true}}
export function shipAllSellable(state){let count=0,value=0;for(const itemId of Object.keys(state.inventory)){const qty=inventoryCount(state,itemId);if(!qty||!SELL_VALUES[itemId])continue;if(shipItem(state,itemId,qty).ok){count+=qty;value+=SELL_VALUES[itemId]*qty}}return {count,value}}
export function pendingShippingValue(state){return state.shipping.reduce((sum,x)=>sum+(SELL_VALUES[x.itemId]||x.unit||0)*(x.qty||1),0)}
export function settleShipping(state){const earned=pendingShippingValue(state);state.shipping=[];state.coins+=earned;return earned}
export function ownedCount(state,itemId){return state.owned.reduce((n,x)=>n+(x.itemId===itemId?1:0),0)}
export function buyShopItem(state,itemId){const item=SHOP_ITEMS.find(x=>x.id===itemId);if(!item)return {ok:false,reason:'missing'};if(ownedCount(state,itemId)>0)return {ok:false,reason:'owned'};if(state.coins<item.price)return {ok:false,reason:'coins',need:item.price-state.coins};state.coins-=item.price;state.owned.push({itemId,boughtAt:Date.now()});return {ok:true,item}}
