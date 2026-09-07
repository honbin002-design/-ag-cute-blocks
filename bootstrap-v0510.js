// AG Cute Blocks V0.5.28 bootstrap over recovered world core.
// Protected test3 special character remains the primary gameplay character.
import './app-v0510.js';

const release='V0.5.28';
const badge=document.querySelector('.title small');if(badge)badge.textContent=release;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',release);
globalThis.AG_GAME_VERSION=release;
globalThis.__AGCB_BOOTSTRAP={version:'0.5.28',loaded:true,baseWorld:'0.5.03',optional:{},specialCharacter:'protected-test3',target:'sleep+wardrobe+luxury-castle'};

const optional=[
 './render-performance-runtime.js','./collision-cache-runtime.js','./raycast-budget-runtime.js',
 './mobile-viewport-lock-runtime.js?v=0.5.28','./ag-original-character-runtime.js','./ag-original-animal-runtime.js',
 './heading-runtime.js','./furniture-safety-runtime.js','./procedural-material-runtime.js',
 './building-extension-runtime.js?v=0.5.28','./luxury-castle-runtime.js?v=0.5.28','./character-polish-runtime.js','./asset-fetch-resilience-runtime.js?v=0.5.28',
 './character-asset-runtime-v0499.js','./character-motion-fix-runtime.js?v=0.5.28','./pet-grounding-runtime.js',
 './mobile-controls-runtime.js?v=0.5.28','./ui-compact-v0515-runtime.js?v=scroll-v2','./aim-reticle-runtime.js?v=0.5.28','./movement-mode-persistence-runtime.js?v=0.5.28',
 './mobile-input-runtime.js?v=0.5.28','./animal-life-runtime.js','./crop-care-runtime.js','./orchard-runtime.js',
 './furniture-life-details.js','./sleep-routine-v0499.js','./wildlife-live-runtime.js','./weather-visual-runtime.js',
 './fishing-ecology-runtime-v0505.js?v=0.5.28','./fishing-forecast-runtime-v0506.js?v=0.5.28','./fishing-journal-runtime-v0510.js?v=0.5.28',
 './cat-ear-fit-runtime.js?v=earfit-v9'
];
for(const path of optional){import(path).then(()=>{globalThis.__AGCB_BOOTSTRAP.optional[path]='ok'}).catch(err=>{globalThis.__AGCB_BOOTSTRAP.optional[path]=String(err?.message||err);console.warn('[AG] optional runtime skipped:',path,err)})}

(async()=>{
 try{
  await import('./test-character-game-runtime.js?v=0.5.26');
  localStorage.setItem('ag_cute_blocks_test_character_v1','test3');
  await import('./test-character-game-integration.js?v=0.5.27');
  globalThis.__AGCB_BOOTSTRAP.specialCharacter='test3-ready';
  await import('./wardrobe-runtime.js?v=0.5.23');
  globalThis.__AGCB_BOOTSTRAP.optional['./wardrobe-runtime.js']='ok';
 }catch(err){
  globalThis.__AGCB_BOOTSTRAP.specialCharacter='load-error:'+(err?.message||err);
  console.error('[AG] protected special character load failed',err);
 }
})();
