// V0.5.10 additive release wrapper over the verified V0.5.04 world core.
import './app-v0504.js';
const VERSION='V0.5.10';
const badge=document.querySelector('#menuBtn small,.title small');if(badge)badge.textContent=VERSION;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.setAttribute('content',VERSION);
const note=document.querySelector('.note');if(note)note.textContent=note.textContent.replace(/V0\.5\.0[4-9]/g,VERSION);
globalThis.__AGCB_RELEASE_OVERLAY={version:'0.5.10',base:'0.5.04',additive:true};
