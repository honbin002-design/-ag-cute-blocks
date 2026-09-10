// AG Cute Blocks V0.5.91 — guarded artificial-water source preload.
// Uses the existing objects/worldIndex/save core. No second terrain store.
// Installs after the V0.5.88 tree catalog guard and before app-v0504-fixed-loader.js.
const nativeFetch=globalThis.fetch.bind(globalThis);
let intercepted=false;
const patches=[
  {
    id:'terrain-water-query-api-v0591',
    from:"function inWater(x,z){const rx=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-rx)<7||dx*dx+dz*dz<324}",
    to:"function artificialWaterCellAt(x,z){return objects.find(o=>o.userData?.type==='waterCell'&&Math.abs(o.position.x-x)<.91&&Math.abs(o.position.z-z)<.91)||null}function removeTerrainObject(o){if(!o)return false;unregisterSolid(o);unregisterCameraTarget(o);unregisterInteractionTarget(o);unregisterBuildAimTarget(o);unregisterWorldEntity(o);world.remove(o);const i=objects.indexOf(o);if(i>=0)objects.splice(i,1);changed=true;return true}function inWater(x,z){const rx=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-rx)<7||dx*dx+dz*dz<324||!!artificialWaterCellAt(x,z)}function digTerrainAt(x,z){x=Math.round(x);z=Math.round(z);if(inWater(x,z))return{ok:false,reason:'already-water',x,z};const soil=objects.find(o=>o.userData?.tilled&&Math.abs(o.position.x-x)<.2&&Math.abs(o.position.z-z)<.2);if(soil){removeTerrainObject(soil);const water=addObject({type:'waterCell',x,z,rot:0});saveWorld();return{ok:true,stage:'water',id:water?.userData?.id||null,x,z}}const plot=addObject({type:'soilPlot',x,z,rot:0});saveWorld();return{ok:true,stage:'soil',id:plot?.userData?.id||null,x,z}}function listArtificialWaterCells(){return objects.filter(o=>o.userData?.type==='waterCell').map(o=>({id:o.userData.id,x:o.position.x,z:o.position.z}))}globalThis.__AGCB_TERRAIN_API={version:1,status:'PERSISTENT_ARTIFICIAL_WATER_SAME_WORLD_STORE',worldOwner:'objects/worldIndex',digAt:digTerrainAt,isWater:(x,z)=>inWater(Number(x),Number(z)),listArtificialWaterCells,removeWaterById(id){const o=objects.find(x=>x.userData?.type==='waterCell'&&String(x.userData.id)===String(id));if(!o)return{ok:false,reason:'missing-water'};removeTerrainObject(o);saveWorld();return{ok:true,id}}}"
  },
  {
    id:'terrain-watercell-model-v0591',
    from:"else if(t==='soilPlot'){box(g,1.82,.08,1.82,0,.04,0,'soil');g.userData.solid=false;g.userData.tilled=true}\nelse if(t==='petDog'||t==='petCat')",
    to:"else if(t==='soilPlot'){box(g,1.82,.08,1.82,0,.04,0,'soil');g.userData.solid=false;g.userData.tilled=true}\nelse if(t==='waterCell'){const w=new THREE.Mesh(new THREE.BoxGeometry(1.82,.045,1.82),mats.water);w.position.y=.015;w.receiveShadow=true;w.userData={waterCell:true,solid:false};g.add(w);g.userData.solid=false;g.userData.terrain=true;g.userData.waterCell=true}\nelse if(t==='petDog'||t==='petCat')"
  },
  {
    id:'terrain-hoe-two-stage-v0591',
    from:"if(category==='農具'&&selected==='hoe'){const x=Math.round(p.x),z=Math.round(p.z);if(inWater(x,z))return toast('水面不能開墾');if(objects.some(o=>o.userData.tilled&&Math.abs(o.position.x-x)<.2&&Math.abs(o.position.z-z)<.2))return toast('這格已經挖好土');addObject({type:'soilPlot',x,z,rot:0});toast('已用鋤頭開墾土地 ✓');return}",
    to:"if(category==='農具'&&selected==='hoe'){const r=digTerrainAt(p.x,p.z);if(!r.ok)return toast(r.reason==='already-water'?'這裡已經是水域':'目前不能挖掘');toast(r.stage==='water'?'⛏️ 再挖一層，形成水格 ✓':'已用鋤頭開墾土地；同一格再挖一次可形成水格 ✓');return}"
  }
];
globalThis.fetch=async function agTerrainWaterFetch(input,init){
  const url=typeof input==='string'?input:String(input?.url||input||'');
  if(intercepted||!/(?:^|\/)app-v0504\.js(?:[?#]|$)/.test(url))return nativeFetch(input,init);
  intercepted=true;
  try{
    const response=await nativeFetch(input,init);
    if(!response.ok)return response;
    let source=await response.text();
    const applied=[];
    for(const patch of patches){
      const count=source.split(patch.from).length-1;
      if(count!==1)throw new Error(`V0.5.91 terrain signature mismatch (${patch.id}): expected 1, got ${count}`);
      source=source.replace(patch.from,patch.to);applied.push(patch.id);
    }
    globalThis.__AGCB_TERRAIN_PRELOAD={version:'0.5.91',status:'PERSISTENT_ARTIFICIAL_WATER_PATCHED',sameWorldStore:true,applied};
    return new Response(source,{status:response.status,statusText:response.statusText,headers:new Headers(response.headers)});
  }finally{
    globalThis.fetch=nativeFetch;
  }
};
