// AG Cute Blocks V0.5.15 resilient bootstrap over recovered V0.5.03 world core.
// Only the base world is startup-critical. Additive runtimes load independently and fail-open.
import './app-v0510.js';

const release='V0.5.15';
const badge=document.querySelector('.title small');if(badge)badge.textContent=release;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',release);
globalThis.__AGCB_BOOTSTRAP={version:'0.5.15',loaded:true,baseWorld:'0.5.03',optional:{},testCharacterRuntime:'pending',recovery:'v0504-tdz-bypass',target:'scroll-drawer-plus-cat-ear-fit-v2'};

const optional=[
 './render-performance-runtime.js','./collision-cache-runtime.js','./raycast-budget-runtime.js',
 './mobile-viewport-lock-runtime.js?v=0.5.15','./ag-original-character-runtime.js','./ag-original-animal-runtime.js',
 './heading-runtime.js','./furniture-safety-runtime.js','./procedural-material-runtime.js',
 './building-extension-runtime.js?v=0.5.15','./character-polish-runtime.js','./asset-fetch-resilience-runtime.js?v=0.5.15',
 './character-asset-runtime-v0499.js','./character-motion-fix-runtime.js?v=0.5.15','./pet-grounding-runtime.js',
 './mobile-controls-runtime.js?v=0.5.15','./ui-compact-v0515-runtime.js?v=scroll-v2','./aim-reticle-runtime.js?v=0.5.15','./movement-mode-persistence-runtime.js?v=0.5.15',
 './mobile-input-runtime.js?v=0.5.15','./animal-life-runtime.js','./crop-care-runtime.js','./orchard-runtime.js',
 './furniture-life-details.js','./sleep-routine-v0499.js','./wildlife-live-runtime.js','./weather-visual-runtime.js',
 './fishing-ecology-runtime-v0505.js?v=0.5.15','./fishing-forecast-runtime-v0506.js?v=0.5.15','./fishing-journal-runtime-v0510.js?v=0.5.15',
 './cat-ear-fit-runtime.js?v=earfit-v2'
];

for(const path of optional){
 import(path).then(()=>{globalThis.__AGCB_BOOTSTRAP.optional[path]='ok'})
 .catch(err=>{globalThis.__AGCB_BOOTSTRAP.optional[path]=String(err?.message||err);console.warn('[AG] optional runtime skipped:',path,err)});
}

setTimeout(async()=>{
 try{
  await import('./test-character-game-runtime.js?v=0.5.15-accessories-v7');
  await import('./test-character-game-integration.js?v=0.5.15-target4');
  globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime=true;
  globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration=true;
 }catch(err){
  globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime=false;
  globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration=false;
  globalThis.__AGCB_BOOTSTRAP.testCharacterError=String(err?.message||err);
  console.warn('[AG] candidate-character layer skipped; base world remains active.',err);
 }
},1200);
