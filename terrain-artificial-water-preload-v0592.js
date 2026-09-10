// AG Cute Blocks V0.5.92 — connected artificial-water visuals over the V0.5.91 data model.
// Persistence remains existing objects/worldIndex/save; only water-cell rendering gains neighbor-aware banks.
const nativeFetch=globalThis.fetch.bind(globalThis);
let intercepted=false;
const patches=[
  {
    id:'terrain-water-query-api-v0592',
    from:"function inWater(x,z){const rx=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-rx)<7||dx*dx+dz*dz<324}",
    to:"function artificialWaterCellAt(x,z){return objects.find(o=>o.userData?.type==='waterCell'&&Math.abs(o.position.x-x)<.46&&Math.abs(o.position.z-z)<.46)||null}function removeArtificialWaterVisual(g){const old=g?.userData?.waterVisual;if(!old)return;g.remove(old);old.traverse?.(n=>{n.geometry?.dispose?.();if(n.material&&n.userData?.agOwnedMaterial)n.material.dispose?.()});g.userData.waterVisual=null}function refreshArtificialWaterVisuals(){const cells=objects.filter(o=>o.userData?.type==='waterCell');const has=(x,z)=>cells.some(o=>Math.abs(o.position.x-x)<.46&&Math.abs(o.position.z-z)<.46);for(const g of cells){removeArtificialWaterVisual(g);const v=new THREE.Group();v.name='AGWaterCellVisual';v.userData.agArtificialWaterVisual=true;const water=new THREE.Mesh(new THREE.BoxGeometry(1.035,.038,1.035),mats.water);water.position.y=.012;water.receiveShadow=true;water.userData.waterSurface=true;v.add(water);const x=Math.round(g.position.x),z=Math.round(g.position.z),edge=.085,h=.055,y=-.006;if(!has(x-1,z))box(v,edge,h,1.08,-.515,y,0,'soil');if(!has(x+1,z))box(v,edge,h,1.08,.515,y,0,'soil');if(!has(x,z-1))box(v,1.08,h,edge,0,y,-.515,'soil');if(!has(x,z+1))box(v,1.08,h,edge,0,y,.515,'soil');g.add(v);g.userData.waterVisual=v}}function removeTerrainObject(o){if(!o)return false;removeArtificialWaterVisual(o);unregisterSolid(o);unregisterCameraTarget(o);unregisterInteractionTarget(o);unregisterBuildAimTarget(o);unregisterWorldEntity(o);world.remove(o);const i=objects.indexOf(o);if(i>=0)objects.splice(i,1);changed=true;queueMicrotask(refreshArtificialWaterVisuals);return true}function inWater(x,z){const rx=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-rx)<7||dx*dx+dz*dz<324||!!artificialWaterCellAt(Math.round(x),Math.round(z))}function digTerrainAt(x,z){x=Math.round(x);z=Math.round(z);if(inWater(x,z))return{ok:false,reason:'already-water',x,z};const soil=objects.find(o=>o.userData?.tilled&&Math.abs(o.position.x-x)<.2&&Math.abs(o.position.z-z)<.2);if(soil){removeTerrainObject(soil);const water=addObject({type:'waterCell',x,z,rot:0});refreshArtificialWaterVisuals();saveWorld();return{ok:true,stage:'water',id:water?.userData?.id||null,x,z}}const plot=addObject({type:'soilPlot',x,z,rot:0});saveWorld();return{ok:true,stage:'soil',id:plot?.userData?.id||null,x,z}}function listArtificialWaterCells(){return objects.filter(o=>o.userData?.type==='waterCell').map(o=>({id:o.userData.id,x:o.position.x,z:o.position.z}))}globalThis.__AGCB_TERRAIN_API={version:2,status:'PERSISTENT_ARTIFICIAL_WATER_CONNECTED_VISUALS',worldOwner:'objects/worldIndex',visualMode:'neighbor-aware-perimeter-bank',digAt:digTerrainAt,isWater:(x,z)=>inWater(Number(x),Number(z)),listArtificialWaterCells,refreshVisuals:refreshArtificialWaterVisuals,removeWaterById(id){const o=objects.find(x=>x.userData?.type==='waterCell'&&String(x.userData.id)===String(id));if(!o)return{ok:false,reason:'missing-water'};removeTerrainObject(o);refreshArtificialWaterVisuals();saveWorld();return{ok:true,id}}}"
  },
  {
    id:'terrain-watercell-model-v0592',
    from:"else if(t==='soilPlot'){box(g,1.82,.08,1.82,0,.04,0,'soil');g.userData.solid=false;g.userData.tilled=true}\nelse if(t==='petDog'||t==='petCat')",
    to:"else if(t==='soilPlot'){box(g,1.82,.08,1.82,0,.04,0,'soil');g.userData.solid=false;g.userData.tilled=true}\nelse if(t==='waterCell'){g.userData.solid=false;g.userData.terrain=true;g.userData.waterCell=true;queueMicrotask(refreshArtificialWaterVisuals)}\nelse if(t==='petDog'||t==='petCat')"
  },
  {
    id:'terrain-hoe-two-stage-v0592',
    from:"if(category==='農具'&&selected==='hoe'){const x=Math.round(p.x),z=Math.round(p.z);if(inWater(x,z))return toast('水面不能開墾');if(objects.some(o=>o.userData.tilled&&Math.abs(o.position.x-x)<.2&&Math.abs(o.position.z-z)<.2))return toast('這格已經挖好土');addObject({type:'soilPlot',x,z,rot:0});toast('已用鋤頭開墾土地 ✓');return}",
    to:"if(category==='農具'&&selected==='hoe'){const r=digTerrainAt(p.x,p.z);if(!r.ok)return toast(r.reason==='already-water'?'這裡已經是水域':'目前不能挖掘');toast(r.stage==='water'?'⛏️ 再挖一層，形成連續水域 ✓':'已用鋤頭開墾土地；同一格再挖一次可形成水域 ✓');return}"
  }
];
globalThis.fetch=async function agTerrainWaterFetchV0592(input,init){
  const url=typeof input==='string'?input:String(input?.url||input||'');
  if(intercepted||!/(?:^|\/)app-v0504\.js(?:[?#]|$)/.test(url))return nativeFetch(input,init);
  intercepted=true;
  try{
    const response=await nativeFetch(input,init);if(!response.ok)return response;
    let source=await response.text();const applied=[];
    for(const patch of patches){const count=source.split(patch.from).length-1;if(count!==1)throw new Error(`V0.5.92 terrain signature mismatch (${patch.id}): expected 1, got ${count}`);source=source.replace(patch.from,patch.to);applied.push(patch.id)}
    globalThis.__AGCB_TERRAIN_PRELOAD={version:'0.5.92',status:'CONNECTED_ARTIFICIAL_WATER_VISUALS_PATCHED',sameWorldStore:true,applied};
    return new Response(source,{status:response.status,statusText:response.statusText,headers:new Headers(response.headers)});
  }finally{globalThis.fetch=nativeFetch}
};
