export const CROP_DEFS={
  carrot:{name:'紅蘿蔔',seasons:['spring','autumn'],days:4},
  corn:{name:'玉米',seasons:['summer'],days:6},
  pumpkin:{name:'南瓜',seasons:['autumn'],days:7},
  tomato:{name:'番茄',seasons:['spring','summer'],days:5},
  strawberry:{name:'草莓',seasons:['spring'],days:5},
  cabbage:{name:'高麗菜',seasons:['spring','winter'],days:6},
  potato:{name:'馬鈴薯',seasons:['spring','autumn'],days:5}
};

export function createFarmTile({id,x,z,crop=null,stage=0,watered=false,plantedAt=0,lastGrowthDay=0}={}){
  return {id:id||globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,x,z,crop,stage,watered,plantedAt,lastGrowthDay};
}

export function canPlant(crop,season){const d=CROP_DEFS[crop];return !!d&&d.seasons.includes(season)}
export function naturalFarmRain(weather){return weather==='rain'||weather==='thunderstorm'}

export function plant(tile,crop,season,worldDay){
  if(!canPlant(crop,season))return {ok:false,reason:'season'};
  if(tile.crop)return {ok:false,reason:'occupied'};
  tile.crop=crop;tile.stage=0;tile.watered=false;tile.plantedAt=worldDay;tile.lastGrowthDay=worldDay;return {ok:true};
}

export function water(tile){if(!tile.crop)return false;tile.watered=true;return true}

export function advanceFarmDay(tiles,{season,weather,worldDay}){
  const raining=naturalFarmRain(weather);
  for(const tile of tiles){
    if(!tile.crop)continue;
    const def=CROP_DEFS[tile.crop];
    if(!def)continue;
    if(raining)tile.watered=true;
    if(worldDay<=tile.lastGrowthDay)continue;
    if(tile.watered&&def.seasons.includes(season)){
      tile.stage=Math.min(1,tile.stage+1/def.days);
      tile.lastGrowthDay=worldDay;
      tile.watered=false;
    }
  }
}

export function isHarvestReady(tile){return !!tile.crop&&tile.stage>=.999}

export function harvest(tile){
  if(!isHarvestReady(tile))return null;
  const crop=tile.crop;tile.crop=null;tile.stage=0;tile.watered=false;tile.plantedAt=0;return {crop,qty:1};
}

export function serializeFarm(tiles){return tiles.map(t=>({...t}))}
export function restoreFarm(records=[]){return records.map(r=>createFarmTile(r))}
