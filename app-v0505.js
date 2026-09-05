// V0.5.05 is an additive release wrapper over the verified V0.5.04 world core.
// Keeping the core untouched minimizes regression risk while allowing independently tested extensions.
import './app-v0504.js';

const VERSION='V0.5.05';
const badge=document.querySelector('#menuBtn small,.title small');if(badge)badge.textContent=VERSION;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',VERSION);
const note=document.querySelector('.note');if(note)note.textContent=note.textContent.replace(/V0\.5\.04/g,VERSION);
globalThis.__AGCB_RELEASE_OVERLAY={version:'0.5.05',base:'0.5.04',additive:true};
