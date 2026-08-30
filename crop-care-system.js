// AG Cute Blocks crop care: watering is a helpful bonus, never a punishment.
// Crops continue to grow without daily watering; watering/rain simply speeds growth and gives feedback.
export const CROP_CARE_SCHEMA=1;

export const CROP_CARE_RULES={
  carrot:{base:.10,waterBonus:.08,rainBonus:.10},corn:{base:.085,waterBonus:.075,rainBonus:.09},pumpkin:{base:.075,waterBonus:.07,rainBonus:.085},
  tomato:{base:.09,waterBonus:.08,rainBonus:.095},strawberry:{base:.09,waterBonus:.085,rainBonus:.10},cabbage:{base:.085,waterBonus:.075,rainBonus:.09},potato:{base:.09,waterBonus:.075,rainBonus:.09}
};

export function createCropCare(saved={}){
  return {
    schema:CROP_CARE_SCHEMA,
    wateredDay:Number.isFinite(Number(saved.wateredDay))?Number(saved.wateredDay):-1,
    lastCareDay:Number.isFinite(Number(saved.lastCareDay))?Number(saved.lastCareDay):-1,
    sparkleUntil:Number(saved.sparkleUntil)||0
  };
}
export function waterCrop(care,worldDay,now=Date.now()){
  if(care.wateredDay===worldDay)return {ok:false,reason:'already-watered'};
  care.wateredDay=worldDay;care.lastCareDay=worldDay;care.sparkleUntil=now+2200;return {ok:true};
}
export function isWateredToday(care,worldDay,weather='sunny'){
  return weather==='rain'||care.wateredDay===worldDay;
}
export function dailyCropGrowth(kind,care,worldDay,weather='sunny',seasonAllowed=true){
  if(!seasonAllowed)return 0;
  const r=CROP_CARE_RULES[kind]||{base:.085,waterBonus:.07,rainBonus:.085};
  if(weather==='rain')return r.base+r.rainBonus;
  if(care.wateredDay===worldDay)return r.base+r.waterBonus;
  return r.base;
}
export function cropCareLabel(care,worldDay,weather='sunny'){
  if(weather==='rain')return '🌧️ 雨水已澆灌';
  if(care.wateredDay===worldDay)return '💧 今天澆過水';
  return '🪴 可澆水加速成長';
}
