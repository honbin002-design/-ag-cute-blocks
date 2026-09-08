// AG Cute Blocks V0.5.04 fixed loader.
// Purpose: recover the complete V0.5.04 world/fishing feature set without copying
// or permanently modifying the historical source file. The historical module has
// one known TDZ startup fault: syncActionLabels() executes before category/selected
// are initialized. We patch only that exact first-call sequence in memory, then
// import the resulting module. Any mismatch fails closed instead of silently running
// an unverified transformation.

const SOURCE_URL=new URL('./app-v0504.js',import.meta.url);
const original=await fetch(SOURCE_URL,{cache:'no-cache'}).then(r=>{
  if(!r.ok)throw new Error(`V0.5.04 source fetch failed: ${r.status}`);
  return r.text();
});

const TDZ_SIGNATURE="document.head.appendChild(st)};syncActionLabels();\n\nconst scene=new THREE.Scene()";
const TDZ_FIXED="document.head.appendChild(st)};queueMicrotask(syncActionLabels);\n\nconst scene=new THREE.Scene()";
const occurrences=original.split(TDZ_SIGNATURE).length-1;
if(occurrences!==1)throw new Error(`V0.5.04 TDZ signature mismatch: expected 1, got ${occurrences}`);

let source=original.replace(TDZ_SIGNATURE,TDZ_FIXED);

// Blob modules cannot resolve relative imports against the original file URL.
// Rewrite only static relative JS imports to absolute URLs rooted at app-v0504.js.
source=source.replace(/(from\s*['"]|import\s*['"])(\.\/[^'"]+)(['"])/g,(all,prefix,spec,suffix)=>{
  return `${prefix}${new URL(spec,SOURCE_URL).href}${suffix}`;
});

const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
try{
  await import(blobUrl);
  globalThis.__AGCB_V0504_FIXED={loaded:true,source:'app-v0504.js',patch:'syncActionLabels-tdz-defer',signatureCount:occurrences};
}finally{
  URL.revokeObjectURL(blobUrl);
}
