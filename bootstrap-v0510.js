// AG Cute Blocks V0.5.24 bootstrap over recovered world core.
// Base world is startup-critical; additive runtimes fail-open.
import './app-v0510.js';

const release='V0.5.24';
const badge=document.querySelector('.title small');if(badge)badge.textContent=release;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',release);
globalThis.AG_GAME_VERSION=release;
globalThis.__AGCB_BOOTSTRAP={version:'0.5.24',loaded:true,baseWorld:'0.5.03',optional:{},testCharacterRuntime:false,recovery:'v0504-tdz-bypass',target:'final-character-single-init+wardrobe'};

const optional=[
 './render-performance-runtime.js','./collision-cache-runtime.js','./raycast-budget-runtime.js',
 './mobile-viewport-lock-runtime.js?v=0.5.24','./ag-original-character-runtime.js','./ag-original-animal-runtime.js',
 './heading-runtime.js','./furniture-safety-runtime.js','./procedural-material-runtime.js',
 './building-extension-runtime.js?v=0.5.24','./character-polish-runtime.js','./asset-fetch-resilience-runtime.js?v=0.5.24',
 './character-asset-runtime-v0499.js','./character-motion-fix-runtime.js?v=0.5.24','./pet-grounding-runtime.js',
 './mobile-controls-runtime.js?v=0.5.24','./ui-compact-v0515-runtime.js?v=scroll-v2','./aim-reticle-runtime.js?v=0.5.24','./movement-mode-persistence-runtime.js?v=0.5.24',
 './mobile-input-runtime.js?v=0.5.24','./animal-life-runtime.js','./crop-care-runtime.js','./orchard-runtime.js',
 './furniture-life-details.js','./sleep-routine-v0499.js','./wildlife-live-runtime.js','./weather-visual-runtime.js',
 './fishing-ecology-runtime-v0505.js?v=0.5.24','./fishing-forecast-runtime-v0506.js?v=0.5.24','./fishing-journal-runtime-v0510.js?v=0.5.24',
 './cat-ear-fit-runtime.js?v=earfit-v9','./wardrobe-runtime.js?v=0.5.24'
];

for(const path of optional){
 import(path).then(()=>{globalThis.__AGCB_BOOTSTRAP.optional[path]='ok'})
 .catch(err=>{globalThis.__AGCB_BOOTSTRAP.optional[path]=String(err?.message||err);console.warn('[AG] optional runtime skipped:',path,err)});
}

// V0.5.24: retired the old delayed test-character layer.
// It was replacing the already-loaded formal character ~1.2s after startup,
// reverting the visible version to V0.5.17 and making wardrobe edits target the discarded model.
globalThis.__AGCB_BOOTSTRAP.testCharacterRuntime='retired';
globalThis.__AGCB_BOOTSTRAP.testCharacterIntegration='retired';
