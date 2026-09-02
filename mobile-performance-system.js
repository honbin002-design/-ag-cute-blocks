// Lightweight adaptive quality governor for iPhone/Android browsers.
// It never changes saved world content; it only suggests render/update budgets.

export const PERF_SCHEMA=1;
export function createPerformanceGovernor(saved={}){
  return {
    schema:PERF_SCHEMA,
    tier:saved.tier||'normal',
    avgMs:Number(saved.avgMs)||16.7,
    slowFrames:0,
    fastFrames:0,
    sampleCount:0,
    locked:!!saved.locked
  };
}

export const PERF_BUDGETS={
  high:{pixelRatio:1.5,shadowMap:1024,maxWildlife:9,creatureFullDistance:24,creatureCullDistance:58,weatherParticles:260,updateStride:1},
  normal:{pixelRatio:1.25,shadowMap:768,maxWildlife:7,creatureFullDistance:20,creatureCullDistance:50,weatherParticles:210,updateStride:1},
  low:{pixelRatio:1.0,shadowMap:512,maxWildlife:5,creatureFullDistance:15,creatureCullDistance:40,weatherParticles:140,updateStride:2}
};

export function performanceBudget(tier='normal'){return PERF_BUDGETS[tier]||PERF_BUDGETS.normal}
export function samplePerformance(g,frameMs){
  if(!Number.isFinite(frameMs)||frameMs<=0)return {changed:false,tier:g.tier,budget:performanceBudget(g.tier)};
  g.sampleCount++;g.avgMs=g.avgMs*.94+frameMs*.06;
  if(g.locked)return {changed:false,tier:g.tier,budget:performanceBudget(g.tier)};
  if(g.avgMs>25){g.slowFrames++;g.fastFrames=0}else if(g.avgMs<17.4){g.fastFrames++;g.slowFrames=Math.max(0,g.slowFrames-1)}else{g.slowFrames=Math.max(0,g.slowFrames-1);g.fastFrames=Math.max(0,g.fastFrames-1)}
  const old=g.tier;
  if(g.slowFrames>90){g.tier=g.tier==='high'?'normal':'low';g.slowFrames=0;g.fastFrames=0}
  else if(g.fastFrames>420){g.tier=g.tier==='low'?'normal':'high';g.slowFrames=0;g.fastFrames=0}
  return {changed:old!==g.tier,tier:g.tier,budget:performanceBudget(g.tier)};
}
export function creatureUpdateAllowed(frameIndex,distance,tier='normal'){
  const b=performanceBudget(tier);if(distance>b.creatureCullDistance)return false;if(distance>b.creatureFullDistance)return frameIndex%(b.updateStride*5)===0;return frameIndex%b.updateStride===0;
}
export function shouldCastCreatureShadow(distance,tier='normal'){return distance<(tier==='high'?18:tier==='normal'?13:9)}
