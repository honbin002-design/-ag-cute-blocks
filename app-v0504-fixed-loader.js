// AG Cute Blocks guarded V0.5.04 loader.
// Recover the complete V0.5.04 world/fishing feature set while applying only
// verified startup/input compatibility repairs in memory. Historical source stays
// untouched. Every patch is signature-count gated and fails closed on mismatch.

const SOURCE_URL=new URL('./app-v0504.js',import.meta.url);
const original=await fetch(SOURCE_URL,{cache:'no-cache'}).then(r=>{
  if(!r.ok)throw new Error(`V0.5.04 source fetch failed: ${r.status}`);
  return r.text();
});

const patches=[
  {
    id:'syncActionLabels-tdz-defer',
    from:"document.head.appendChild(st)};syncActionLabels();\n\nconst scene=new THREE.Scene()",
    to:"document.head.appendChild(st)};queueMicrotask(syncActionLabels);\n\nconst scene=new THREE.Scene()"
  },
  {
    id:'legacy-doubletap-blocker-suppress',
    from:"let lastTouchEnd=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouchEnd<=350)e.preventDefault();lastTouchEnd=now},{passive:false});",
    to:"let lastTouchEnd=0;/* AG guarded recovery: double-tap policy is owned by mobile-viewport-lock-runtime.js */"
  },
  {
    id:'legacy-blanket-multitouch-suppress',
    from:"document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});",
    to:"/* AG guarded recovery: legacy blanket multitouch blocker suppressed; control-aware policy is owned by mobile-viewport-lock-runtime.js */"
  }
];

let source=original;const applied=[];
for(const patch of patches){
  const count=source.split(patch.from).length-1;
  if(count!==1)throw new Error(`V0.5.04 patch signature mismatch (${patch.id}): expected 1, got ${count}`);
  source=source.replace(patch.from,patch.to);applied.push(patch.id);
}

// Blob modules cannot resolve relative imports against the historical file URL.
// Rewrite static relative JS imports only; all feature code stays byte-equivalent
// apart from the guarded patches above.
source=source.replace(/(from\s*['"]|import\s*['"])(\.\/[^'"]+)(['"])/g,(all,prefix,spec,suffix)=>`${prefix}${new URL(spec,SOURCE_URL).href}${suffix}`);

const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
try{
  await import(blobUrl);
  globalThis.__AGCB_V0504_FIXED={loaded:true,source:'app-v0504.js',patches:applied,signatureCount:applied.length,legacyBlanketTouchBlockerSuppressed:true,legacyDoubleTapBlockerSuppressed:true};
}finally{URL.revokeObjectURL(blobUrl)}
