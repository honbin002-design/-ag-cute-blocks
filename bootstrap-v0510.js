// AG Cute Blocks V0.5.25 bootstrap over recovered world core.
// Special character (the approved test3 VRoid cat-ear character) is a protected primary gameplay asset.
import './app-v0510.js';

const release='V0.5.25';
const badge=document.querySelector('.title small');if(badge)badge.textContent=release;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',release);
globalThis.AG_GAME_VERSION=release;
globalThis.__AGCB_BOOTSTRAP={version:'0.5.25',loaded:true,baseWorld:'0.5.03',optional:{},specialCharacter:'protected-test3',recovery:'v0504-tdz-bypass',target:'special-character-primary+wardrobe'};

const optional=[
 './render-performance-runtime.js','./collision-cache-runtime.js','./raycast-budget-runtime.js',
 './mobile-viewport-lock-runtime.js?v=0.5.25','./ag-original-character-runtime.js','./ag-original-animal-runtime.js',
 './heading-runtime.js','./furniture-safety-runtime.js','./procedural-material-runtime.js',
 './building-extension-runtime.js?v=0.5.25','./character-polish-runtime.js','./asset-fetch-resilience-runtime.js?v=0.5.25',
 './character-asset-runtime-v0499.js','./character-motion-fix-runtime.js?v=0.5.25','./pet-grounding-runtime.js',
 './mobile-controls-runtime.js?v=0.5.25','./ui-compact-v0515-runtime.js?v=scroll-v2','./aim-reticle-runtime.js?v=0.5.25','./movement-mode-persistence-runtime.js?v=0.5.25',
 './mobile-input-runtime.js?v=0.5.25','./animal-life-runtime.js','./crop-care-runtime.js','./orchard-runtime.js',
 './furniture-life-details.js','./sleep-routine-v0499.js','./wildlife-live-runtime.js','./weather-visual-runtime.js',
 './fishing-ecology-runtime-v0505.js?v=0.5.25','./fishing-forecast-runtime-v0506.js?v=0.5.25','./fishing-journal-runtime-v0510.js?v=0.5.25',
 './cat-ear-fit-runtime.js?v=earfit-v9'
];
for(const path of optional){import(path).then(()=>{globalThis.__AGCB_BOOTSTRAP.optional[path]='ok'}).catch(err=>{globalThis.__AGCB_BOOTSTRAP.optional[path]=String(err?.message||err);console.warn('[AG] optional runtime skipped:',path,err)})}

// V0.5.25: restore the approved special character, but do NOT restore the old 1.2s delayed swap.
// Load its runtime immediately, then integration; persist test3 as the primary visible character.
(async()=>{
 try{
  await import('./test-character-game-runtime.js?v=0.5.25');
  localStorage.setItem('ag_cute_blocks_test_character_v1','test3');
  await import('./test-character-game-integration.js?v=0.5.25');
  globalThis.__AGCB_BOOTSTRAP.specialCharacter='test3-ready';
  await import('./wardrobe-runtime.js?v=0.5.25');
  globalThis.__AGCB_BOOTSTRAP.optional['./wardrobe-runtime.js']='ok';
 }catch(err){
  globalThis.__AGCB_BOOTSTRAP.specialCharacter='load-error:'+(err?.message||err);
  console.error('[AG] protected special character load failed',err);
 }
})();
