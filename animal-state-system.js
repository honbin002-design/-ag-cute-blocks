// Lightweight behavior state selection for mobile. Visual animation stays model-specific.
export const ANIMAL_STATES=['idle','walk','eat','drink','sleep','petResponse'];

function hash01(seed){let x=Math.sin(seed*12.9898+78.233)*43758.5453;return x-Math.floor(x)}
export function animalDailyProfile(type='cow',entitySeed=1){
  const h=hash01(entitySeed+(type==='chicken'?2:type==='sheep'?3:type==='dog'?4:type==='cat'?5:1));
  return {
    wakeHour:type==='chicken'?5.5:6+h*.8,
    sleepHour:type==='chicken'?19.2:20+h*.9,
    eatPhase:h*Math.PI*2,
    drinkPhase:hash01(entitySeed+19)*Math.PI*2
  };
}
export function decideAnimalState({type='cow',hour=12,moving=false,nearWater=false,nearFood=false,petted=false,entitySeed=1,timeSeconds=0}={}){
  if(petted)return 'petResponse';
  const p=animalDailyProfile(type,entitySeed);
  if(hour<p.wakeHour||hour>=p.sleepHour)return 'sleep';
  if(moving)return 'walk';
  const eatWave=Math.sin(timeSeconds*.10+p.eatPhase),drinkWave=Math.sin(timeSeconds*.065+p.drinkPhase);
  if(nearWater&&drinkWave>.82)return 'drink';
  if(nearFood&&eatWave>.58)return 'eat';
  if(type==='chicken'&&eatWave>.38)return 'eat';
  if((type==='cow'||type==='sheep')&&eatWave>.72)return 'eat';
  return 'idle';
}
export function stateMotionScale(state,type='cow'){
  if(state==='walk')return type==='chicken'?1.12:type==='dog'?1.20:type==='cat'?1.16:1;
  if(state==='petResponse')return .25;
  return 0;
}
export function statePoseHints(state,type='cow'){
  return {
    headDown:state==='eat'||state==='drink',
    lying:state==='sleep',
    tailHappy:state==='petResponse'&&(type==='dog'||type==='cat'),
    wingTuck:state==='sleep'&&type==='chicken',
    eyeSoft:state==='sleep'||state==='petResponse'
  };
}
