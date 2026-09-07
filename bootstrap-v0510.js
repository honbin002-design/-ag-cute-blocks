// AG Cute Blocks V0.5.16 resilient bootstrap over recovered V0.5.03 world core.
// Only the base world is startup-critical. Additive runtimes load independently and fail-open.
import './app-v0510.js';

const release='V0.5.16';
const badge=document.querySelector('.title small');if(badge)badge.textContent=release;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',release);
globalThis.__AGCB_BOOTSTRAP={version:'0.5.16',loaded:true,baseWorld:'0.5.03',optional:{},testCharacterRuntime:'pending',recovery:'v0504-tdz-bypass',target:'version-bump-plus-cat-ear-v8-close-root'};

const optional=[
 './render-performance-runtime.js','./collision-cache-runtime.js','./raycast-budget-runtime.js',
 './mobile-viewport-lock-runtime.js?v=0.5.16','./ag-original-character-runtime.js','./ag-original-animal-runtime.js',
 './heading-runtime.js','./furniture-safety-runtime.js','./procedural-material-runtime.js',
 './building-extension-runtime.js?v=0.5.16','./character-polish-runtime.js','./asset-fetch-resilience-runtime.js?v=0.5.16',
 './character-asset-runtime-v0499.js','./character-motion-fix-runtime.js?v=0.5.16','./pet-grounding-runtime.js',
 './mobile-controls-runtime.js?v=0.5.16','./ui-compact-v0515-runtime.js?v=scroll-v2','./aim-reticle-runtime.js?v=0.5.16','./movement-mode-persistence-runtime.js?v=0.5.16',
 './mobile-input-runtime.js?v=0.5.16','./animal-life-runtime.js','./crop-care-runtime.js','./orchard-runtime.js',
 './furniture-life-details.js','./sleep-routine-v0499.js','./wildlife-live-runtime.js','./weather-visual-runtime.js',
 './fishing-ecology-runtime-v0505.js?v=0.5.16','./fishing-forecast-runtime-v0506.js?v=0.5.16','./fishing-journal-runtime-v0510.js?v=0.5.16',
 './cat-ear-fit-runtime.js?v=earfit-v8'
];

for(const path of optional){
 import(path).then(()=>{globalThis.__AGCB_BOOTSTRAP.optional[path]='ok'})
 .catch(err=>{globalThis.__AGCB_BOOTSTRAP.optional[path]=String(err?.message||err);console.warn('[AG] optional runtime skipped:',path,err)});
}

setTimeout(async()=>{
 try{
  await import('./test-character-game-runtime.js?v=0.5.16-accessories-v7');
  await import('./test-character-game-integration.js?v=0.5.16-target4');
  globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime=true;
  globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration=true;
 }catch(err){
  globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime=false;
  globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration=false;
  globalThis.__AGCB_BOOTSTRAP.testCharacterError=String(err?.message||err);
  console.warn('[AG] candidate-character layer skipped; base world remains active.',err);
 }
},1200);
