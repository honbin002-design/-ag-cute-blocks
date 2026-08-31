// AG Cute Blocks V0.4.5 deterministic runtime bootstrap.
// Performance/collision patches must be active before the main world creates its renderer.
import './render-performance-runtime.js';
import './collision-cache-runtime.js';
import './raycast-budget-runtime.js';

// Main world establishes the live scene/player/object registries used by extension runtimes.
// Midnight progression now calls daily-progression-system.js directly inside the core app.
import './app-v043.js';

// Core corrections and visual surface upgrades attach after base initialization.
import './heading-runtime.js';
import './furniture-safety-runtime.js';
import './procedural-material-runtime.js';

// Input and life extensions attach after the main HUD/world handlers exist.
import './mobile-input-runtime.js';
import './animal-life-runtime.js';
import './crop-care-runtime.js';
import './orchard-runtime.js';
import './furniture-life-details.js';
import './sleep-routine.js';
import './wildlife-live-runtime.js';
import './weather-visual-runtime.js';

globalThis.__AGCB_BOOTSTRAP={version:'0.4.5',loaded:true};
