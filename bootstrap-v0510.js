// AG Cute Blocks V0.5.12 safe additive bootstrap over verified V0.5.04 world core.
// Critical rule: optional external test-character dependencies must never block the world startup chain.
import './render-performance-runtime.js';
import './collision-cache-runtime.js';
import './raycast-budget-runtime.js';
import './mobile-viewport-lock-runtime.js?v=0.5.12';
import './ag-original-character-runtime.js';
import './ag-original-animal-runtime.js';
import './app-v0510.js';
import './heading-runtime.js';
import './furniture-safety-runtime.js';
import './procedural-material-runtime.js';
import './building-extension-runtime.js?v=0.5.12';
import './character-polish-runtime.js';
import './asset-fetch-resilience-runtime.js?v=0.5.12';
import './character-asset-runtime-v0499.js';
import './character-motion-fix-runtime.js?v=0.5.12';
import './pet-grounding-runtime.js';
import './mobile-controls-runtime.js?v=0.5.12';
import './aim-reticle-runtime.js?v=0.5.12';
import './movement-mode-persistence-runtime.js?v=0.5.12';
import './mobile-input-runtime.js?v=0.5.12';
import './animal-life-runtime.js';
import './crop-care-runtime.js';
import './orchard-runtime.js';
import './furniture-life-details.js';
import './sleep-routine-v0499.js';
import './wildlife-live-runtime.js';
import './weather-visual-runtime.js';
import './fishing-ecology-runtime-v0505.js?v=0.5.12';
import './fishing-forecast-runtime-v0506.js?v=0.5.12';
import './fishing-journal-runtime-v0510.js?v=0.5.12';
const release='V0.5.12';
const badge=document.querySelector('.title small');if(badge)badge.textContent=release;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',release);
globalThis.__AGCB_BOOTSTRAP={version:'0.5.12',loaded:true,baseWorld:'0.5.04',testCharacterRuntime:'deferred'};
// Load candidate-character code only after the base game has had time to create the world/player.
// A CDN/model/import failure is caught here and cannot abort the base-world module graph.
setTimeout(async()=>{
  try{
    await import('./test-character-game-runtime.js?v=0.5.12');
    await import('./test-character-game-integration.js?v=0.5.12');
    globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime=true;
    globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration=true;
  }catch(err){
    globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime=false;
    globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration=false;
    globalThis.__AGCB_BOOTSTRAP.testCharacterError=String(err?.message||err);
    console.warn('[AG] Optional test-character layer skipped; base world remains active.',err);
  }
},1800);
