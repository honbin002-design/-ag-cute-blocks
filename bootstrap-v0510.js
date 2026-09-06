// AG Cute Blocks V0.5.14 resilient bootstrap over verified V0.5.04 world core.
// Only the base world is startup-critical. Additive runtimes load independently and fail-open.
import './app-v0510.js';

const release='V0.5.14';
const badge=document.querySelector('.title small');if(badge)badge.textContent=release;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',release);
globalThis.__AGCB_BOOTSTRAP={version:'0.5.14',loaded:true,baseWorld:'0.5.04',optional:{},testCharacterRuntime:'pending'};

const optional=[
 './render-performance-runtime.js','./collision-cache-runtime.js','./raycast-budget-runtime.js',
 './mobile-viewport-lock-runtime.js?v=0.5.14','./ag-original-character-runtime.js','./ag-original-animal-runtime.js',
 './heading-runtime.js','./furniture-safety-runtime.js','./procedural-material-runtime.js',
 './building-extension-runtime.js?v=0.5.14','./character-polish-runtime.js','./asset-fetch-resilience-runtime.js?v=0.5.14',
 './character-asset-runtime-v0499.js','./character-motion-fix-runtime.js?v=0.5.14','./pet-grounding-runtime.js',
 './mobile-controls-runtime.js?v=0.5.14','./aim-reticle-runtime.js?v=0.5.14','./movement-mode-persistence-runtime.js?v=0.5.14',
 './mobile-input-runtime.js?v=0.5.14','./animal-life-runtime.js','./crop-care-runtime.js','./orchard-runtime.js',
 './furniture-life-details.js','./sleep-routine-v0499.js','./wildlife-live-runtime.js','./weather-visual-runtime.js',
 './fishing-ecology-runtime-v0505.js?v=0.5.14','./fishing-forecast-runtime-v0506.js?v=0.5.14','./fishing-journal-runtime-v0510.js?v=0.5.14'
];

// Do not serialize unrelated features. A slow/broken optional module cannot delay the others.
for(const path of optional){
 import(path).then(()=>{globalThis.__AGCB_BOOTSTRAP.optional[path]='ok'})
 .catch(err=>{globalThis.__AGCB_BOOTSTRAP.optional[path]=String(err?.message||err);console.warn('[AG] optional runtime skipped:',path,err)});
}

// Candidate characters have their own lane and start shortly after the base world.
setTimeout(async()=>{
 try{
  await import('./test-character-game-runtime.js?v=0.5.14');
  await import('./test-character-game-integration.js?v=0.5.14');
  globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime=true;
  globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration=true;
 }catch(err){
  globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime=false;
  globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration=false;
  globalThis.__AGCB_BOOTSTRAP.testCharacterError=String(err?.message||err);
  console.warn('[AG] candidate-character layer skipped; base world remains active.',err);
 }
},1200);
