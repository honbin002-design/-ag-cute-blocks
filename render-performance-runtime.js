import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createPerformanceGovernor,performanceBudget,samplePerformance} from './mobile-performance-system.js';

// Runtime-only adaptive quality. Saved world data is never changed.
const originalRender=THREE.WebGLRenderer.prototype.render;
const states=new WeakMap();

function apply(renderer,state){
  const budget=performanceBudget(state.governor.tier);
  const ratio=Math.min(Number(globalThis.devicePixelRatio||1),budget.pixelRatio);
  if(Math.abs(renderer.getPixelRatio()-ratio)>.01)renderer.setPixelRatio(ratio);
  state.appliedTier=state.governor.tier;
  state.pixelRatio=ratio;
}

THREE.WebGLRenderer.prototype.render=function(scene,camera){
  let state=states.get(this);
  const now=performance.now();
  if(!state){
    state={governor:createPerformanceGovernor({tier:'normal'}),last:now,appliedTier:null,pixelRatio:1.25,frames:0};
    states.set(this,state);apply(this,state);
  }else{
    const frameMs=Math.max(1,Math.min(100,now-state.last));state.last=now;state.frames++;
    const sampled=samplePerformance(state.governor,frameMs);
    if(sampled.changed||state.appliedTier!==state.governor.tier)apply(this,state);
  }
  return originalRender.call(this,scene,camera);
};

globalThis.__AGCB_RENDER_PERF={states,description:'adaptive pixel ratio only; world data untouched'};
