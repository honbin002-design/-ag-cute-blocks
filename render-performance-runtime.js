import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createPerformanceGovernor,performanceBudget,samplePerformance} from './mobile-performance-system.js';

// Runtime-only adaptive quality. Saved world data is never changed.
// Pixel density and shadow refresh cadence are governed independently so controls stay responsive
// without making the cozy world suddenly lose its lighting/shadows.
const originalRender=THREE.WebGLRenderer.prototype.render;
const states=new WeakMap();

function shadowStrideFor(tier){return tier==='high'?1:tier==='low'?3:2}

function apply(renderer,state){
  const budget=performanceBudget(state.governor.tier);
  const ratio=Math.min(Number(globalThis.devicePixelRatio||1),budget.pixelRatio);
  if(Math.abs(renderer.getPixelRatio()-ratio)>.01)renderer.setPixelRatio(ratio);
  state.shadowStride=shadowStrideFor(state.governor.tier);
  if(renderer.shadowMap?.enabled){
    renderer.shadowMap.autoUpdate=false;
    renderer.shadowMap.needsUpdate=true;
  }
  state.appliedTier=state.governor.tier;
  state.pixelRatio=ratio;
  globalThis.__AGCB_PERF_TIER=state.governor.tier;
}

THREE.WebGLRenderer.prototype.render=function(scene,camera){
  let state=states.get(this);
  const now=performance.now();
  if(!state){
    state={governor:createPerformanceGovernor({tier:'normal'}),last:now,appliedTier:null,pixelRatio:1.25,frames:0,shadowStride:2,shadowUpdates:0};
    states.set(this,state);apply(this,state);
  }else{
    const frameMs=Math.max(1,Math.min(100,now-state.last));state.last=now;state.frames++;
    const sampled=samplePerformance(state.governor,frameMs);
    if(sampled.changed||state.appliedTier!==state.governor.tier)apply(this,state);
  }
  if(this.shadowMap?.enabled){
    const due=state.shadowStride<=1||state.frames%state.shadowStride===0;
    if(due){this.shadowMap.needsUpdate=true;state.shadowUpdates++}
  }
  return originalRender.call(this,scene,camera);
};

globalThis.__AGCB_RENDER_PERF={
  states,
  description:'adaptive pixel ratio + paced shadow refresh; publishes live tier; world data untouched',
  shadowStrideFor
};
