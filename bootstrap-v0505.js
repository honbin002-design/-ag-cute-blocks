// AG Cute Blocks V0.5.05 deterministic runtime bootstrap.
import './render-performance-runtime.js';
import './collision-cache-runtime.js';
import './raycast-budget-runtime.js';
import './mobile-viewport-lock-runtime.js?v=0.5.05';
import './ag-original-character-runtime.js';
import './ag-original-animal-runtime.js';

// Verified V0.5.04 world core is retained through a thin V0.5.05 release wrapper.
import './app-v0505.js';

import './heading-runtime.js';
import './furniture-safety-runtime.js';
import './procedural-material-runtime.js';
import './building-extension-runtime.js?v=0.5.05';
import './character-polish-runtime.js';
import './asset-fetch-resilience-runtime.js?v=0.5.05';
import './character-asset-runtime-v0499.js';
import './character-motion-fix-runtime.js?v=0.5.05';
import './pet-grounding-runtime.js';

import './mobile-controls-runtime.js?v=0.5.05';
import './aim-reticle-runtime.js?v=0.5.05';
import './movement-mode-persistence-runtime.js?v=0.5.05';
import './mobile-input-runtime.js?v=0.5.05';
import './animal-life-runtime.js';
import './crop-care-runtime.js';
import './orchard-runtime.js';
import './furniture-life-details.js';
import './sleep-routine-v0499.js';
import './wildlife-live-runtime.js';
import './weather-visual-runtime.js';

// Must load after app/mobile input so both direct button and action-bridge fishing paths are wrapped.
import './fishing-ecology-runtime-v0505.js?v=0.5.05';

globalThis.__AGCB_BOOTSTRAP={version:'0.5.05',loaded:true,baseWorld:'0.5.04'};
