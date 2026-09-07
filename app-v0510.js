// V0.5.15 recovery wrapper over the last pre-regression V0.5.03 world core.
// V0.5.04 introduced a runtime TDZ in contextual action-label initialization.
import './app-v0503.js';
const VERSION='V0.5.15';
const badge=document.querySelector('#menuBtn small,.title small');if(badge)badge.textContent=VERSION;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',VERSION);
const note=document.querySelector('.note');if(note)note.textContent=note.textContent.replace(/V0\.5\.\d+/g,VERSION);
globalThis.__AGCB_RELEASE_OVERLAY={version:'0.5.15',base:'0.5.03',additive:true,recovery:'v0504-tdz-bypass'};
