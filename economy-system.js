// AG Cute Blocks gentle optional economy.
// Coins are a side-goal only: no debt, interest, daily pressure, login streaks or punishment.
export const ECONOMY_SCHEMA=1;

export const SELL_VALUES={
  carrot:18,corn:26,pumpkin:42,tomato:24,strawberry:30,cabbage:28,potato:20,
  apple:24,orange:26,peach:30,egg:18,milk:34,wool:38
};

export const SHOP_ITEMS=[
  {id:'seed-strawberry',name:'草莓種子',price:35,kind:'seed'},
  {id:'sapling-peach',name:'桃樹苗',price:180,kind:'sapling'},
  {id:'pet-bed-round',name:'圓圓寵物床',price:220,kind:'furniture'},
  {id:'swing-garden',name:'花園鞦韆',price:420,kind:'decoration'},
  {id:'bed-star',name:'星星床',price:520,kind:'furniture'},
  {id:'lamp-cloud',name:'雲朵燈',price:280,kind:'decoration'}
];

export function createEconomyState(saved={}){
  return {schema:ECONOMY_SCHEMA,coins:Math.max(0,Number(saved.coins)||0),shipping:Array.isArray(saved.shipping)?saved.shipping:[],owned:Array.isArray(saved.owned)?saved.owned:[]};
}
export function shipItem(state,itemId,qty=1){
  qty=Math.max(1,Math.floor(qty));
  if(!SELL_VALUES[itemId])return {ok:false,reason:'not-sellable'};
  state.shipping.push({itemId,qty,unit:SELL_VALUES[itemId],addedAt:Date.now()});
  return {ok:true};
}
export function settleShipping(state){
  const earned=state.shipping.reduce((sum,x)=>sum+(SELL_VALUES[x.itemId]||x.unit||0)*(x.qty||1),0);
  state.shipping=[];state.coins+=earned;return earned;
}
export function buyShopItem(state,itemId){
  const item=SHOP_ITEMS.find(x=>x.id===itemId);if(!item)return {ok:false,reason:'missing'};
  if(state.coins<item.price)return {ok:false,reason:'coins',need:item.price-state.coins};
  state.coins-=item.price;state.owned.push({itemId,boughtAt:Date.now()});return {ok:true,item};
}
