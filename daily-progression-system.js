import {createCropCare,dailyCropGrowth} from './crop-care-system.js';
import {CROP_DEFS} from './farming-system.js';
import {createEconomyState,settleShipping} from './economy-system.js';

export const DAILY_PROGRESSION_SCHEMA=1;
export const CROP_TYPES=Object.freeze(Object.keys(CROP_DEFS));
export const TREE_TYPES=Object.freeze(['appleTree','orangeTree','peachTree']);
export const LIVESTOCK_TYPES=Object.freeze(['cow','sheep','chicken']);

export function naturalRain(weather='sunny'){return weather==='rain'||weather==='thunderstorm'}
export function cropKindOf(record={}){return record.crop||CROP_TYPES.includes(record.type)?(record.crop||record.type):null}
export function treeKindOf(record={}){if(record.treeKind)return record.treeKind;if(TREE_TYPES.includes(record.type))return record.type.replace('Tree','');return null}
export function livestockTypeOf(record={}){return LIVESTOCK_TYPES.includes(record.type)?record.type:null}
export function cropSeasonAllowed(kind,season){const def=CROP_DEFS[kind];return !!def&&def.seasons.includes(season)}
export function treeDailyGrowth(kind,season){if(season!=='winter')return .09;return kind==='orange'?.09:0}
export function livestockWaitDays(type){return type==='sheep'?3:1}

export function advanceDailyRecord(record,{fromDay=1,toDay=fromDay+1,season='spring',weather='sunny',care=null}={}){
  if(!record)return {changed:false,growthChanged:false,productChanged:false};
  let growthChanged=false,productChanged=false;
  const crop=cropKindOf(record),tree=treeKindOf(record),livestock=livestockTypeOf(record);
  if(crop&&Number(record.growth||0)<1){
    const before=Number(record.growth||0),cropCare=createCropCare(care||{}),delta=dailyCropGrowth(crop,cropCare,fromDay,weather,cropSeasonAllowed(crop,season));
    record.growth=Math.min(1,before+delta);growthChanged=record.growth!==before;
  }else if(tree&&Number(record.growth||0)<1){
    const before=Number(record.growth||0),delta=treeDailyGrowth(tree,season);record.growth=Math.min(1,before+delta);growthChanged=record.growth!==before;
  }
  if(livestock&&!record.productReady){
    const ready=toDay-Number(record.lastProductDay||0)>=livestockWaitDays(livestock);if(ready){record.productReady=true;productChanged=true}
  }
  return {changed:growthChanged||productChanged,growthChanged,productChanged,crop,tree,livestock};
}

export function advanceDailySnapshot(world,settings,careStore={},{wakeMinute=null}={}){
  const fromDay=Number(settings.worldDay||1),toDay=fromDay+1,season=settings.season||'spring',weather=settings.weather||'sunny';
  const economy=createEconomyState(settings.economy||{}),earned=settleShipping(economy);let changed=0;
  for(const record of world?.objects||[]){
    const care=careStore?.[record.id]||null,result=advanceDailyRecord(record,{fromDay,toDay,season,weather,care});if(result.changed)changed++;
  }
  settings.worldDay=toDay;settings.economy=economy;if(Number.isFinite(wakeMinute))settings.simMinutes=wakeMinute;
  if(world){world.savedAt=Date.now();world.version=Math.max(Number(world.version)||4.3,4.5)}
  return {schema:DAILY_PROGRESSION_SCHEMA,fromDay,toDay,earned,changed,season,weather};
}
