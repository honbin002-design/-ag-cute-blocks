// AG Cute Blocks - test character 3 cat-ear fit patch v2.
// Keeps accepted body/back accessory untouched; only adjusts the named cat-ear rig after character creation.
let lastRoot=null;
function apply(){
 const root=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION?.candidate?.root;
 if(!root||root===lastRoot)return;
 const rig=root.getObjectByName?.('ag-cat-ear-rig');
 if(!rig)return;
 const l=root.getObjectByName?.('ag-cat-ear-left'),r=root.getObjectByName?.('ag-cat-ear-right');
 // Re-seat the rig so each ear base sits outside the hair shell, not through the crown.
 rig.position.set(0,.225,.028);
 if(l){l.position.set(-.145,.118,.018);l.rotation.set(-.08,0,.23)}
 if(r){r.position.set(.145,.118,.018);r.rotation.set(-.08,0,-.23)}
 // Inner panels follow the same side anchors so the ear reads as one piece from front/side/back.
 const il=root.children?.length?root.getObjectByName?.('ag-cat-ear-inner-left'):null;
 const ir=root.children?.length?root.getObjectByName?.('ag-cat-ear-inner-right'):null;
 if(il){il.position.set(-.145,.118,-.018);il.rotation.set(-.08,0,.23)}
 if(ir){ir.position.set(.145,.118,-.018);ir.rotation.set(-.08,0,-.23)}
 lastRoot=root;
 root.userData.agEarFit='v2-side-seated-on-hair-surface';
}
setInterval(apply,180);
globalThis.__AGCB_CAT_EAR_FIT={version:2,loaded:true,target:'side-seat-ear-bases-outside-hair'};
