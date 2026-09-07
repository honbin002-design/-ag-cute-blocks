// AG Cute Blocks - test character 3 cat-ear fit patch v1.
// Keeps accepted body/back accessory untouched; only adjusts the named cat-ear rig after character creation.
let lastRoot=null;
function apply(){
 const root=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION?.candidate?.root;
 if(!root||root===lastRoot)return;
 const rig=root.getObjectByName?.('ag-cat-ear-rig');
 if(!rig)return;
 // Lift the entire rig so the ear bases sit on top of the hair instead of intersecting the head mesh.
 rig.position.y+=0.065;
 rig.position.z+=0.008;
 // Slight outward cant keeps the silhouette cat-like without changing accepted size.
 const l=root.getObjectByName?.('ag-cat-ear-left'),r=root.getObjectByName?.('ag-cat-ear-right');
 if(l){l.position.x-=0.008;l.rotation.z=.16}
 if(r){r.position.x+=0.008;r.rotation.z=-.16}
 lastRoot=root;
 root.userData.agEarFit='v1-lifted-clear-of-hair';
}
setInterval(apply,250);
globalThis.__AGCB_CAT_EAR_FIT={version:1,loaded:true,target:'lift-ear-bases-above-hair'};
