// AG Cute Blocks - test character 3 cat-ear replacement patch v8.
// Locked PASS: body/back accessory/UI/scale/movement. Only cat-ear placement is changed.
import * as THREE from 'three';
let lastRoot=null;
const outerMat=new THREE.MeshStandardMaterial({color:0x26335d,roughness:.72,side:THREE.DoubleSide});
const innerMat=new THREE.MeshStandardMaterial({color:0xf2c9df,roughness:.8,side:THREE.DoubleSide});
function earGeometry(w=.105,h=.138,d=.042){
 const g=new THREE.BufferGeometry();
 const v=[-w*.52,0,d*.42,w*.52,0,d*.42,-w*.43,h*.35,d*.48,w*.43,h*.35,d*.48,0,h,d*.12,-w*.52,0,-d*.42,w*.52,0,-d*.42,-w*.43,h*.35,-d*.48,w*.43,h*.35,-d*.48,0,h,-d*.12];
 const i=[0,1,3,0,3,2,2,3,4,6,5,7,7,5,8,7,8,9,0,5,1,0,6,5,2,4,9,2,9,7,3,8,9,3,9,4,0,2,7,0,7,6,1,5,8,1,8,3];
 g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(i);g.computeVertexNormals();return g;
}
function innerGeometry(){const s=new THREE.Shape();s.moveTo(-.032,0);s.quadraticCurveTo(-.038,.05,0,.1);s.quadraticCurveTo(.038,.05,.032,0);s.closePath();const g=new THREE.ShapeGeometry(s,8);g.translate(0,.014,.023);return g;}
function makeEar(side){const grp=new THREE.Group();grp.name=side<0?'ag-cat-ear-left-v8':'ag-cat-ear-right-v8';grp.add(new THREE.Mesh(earGeometry(),outerMat));const p=new THREE.Mesh(innerGeometry(),innerMat);p.rotation.x=-.04;grp.add(p);return grp;}
function hideOlder(root,head){
 ['ag-cat-ear-rig','ag-cat-ear-rig-v3','ag-cat-ear-rig-v4','ag-cat-ear-rig-v5','ag-cat-ear-rig-v6','ag-cat-ear-rig-v7'].forEach(n=>{
   const x=root.getObjectByName?.(n)||head?.getObjectByName?.(n);if(x)x.visible=false;
 });
}
function apply(){
 const root=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION?.candidate?.root;if(!root)return;
 const base=root.getObjectByName?.('ag-cat-ear-rig');
 const head=base?.parent || root.getObjectByName?.('ag-cat-ear-rig-v7')?.parent || root.getObjectByName?.('ag-cat-ear-rig-v6')?.parent;
 if(!head)return;
 hideOlder(root,head);
 if(root===lastRoot && head.getObjectByName?.('ag-cat-ear-rig-v8'))return;
 const prior=head.getObjectByName?.('ag-cat-ear-rig-v8');if(prior)prior.removeFromParent();
 const rig=new THREE.Group();rig.name='ag-cat-ear-rig-v8';head.add(rig);
 // User-approved target from annotated reference: inner roots close to the top-center of the round head,
 // both ears still flare outward about 10 degrees. Deliberately much closer than v7 so the change is unmistakable.
 rig.position.set(0,.158,.040);
 const l=makeEar(-1),r=makeEar(1);
 l.position.set(-.030,0,.010);r.position.set(.030,0,.010);
 const outward=Math.PI/18;
 l.rotation.set(-.015,-.008,outward);r.rotation.set(-.015,.008,-outward);
 rig.add(l,r);
 lastRoot=root;root.userData.agEarFit='v8-close-roots-outward10-front-crown';
}
setInterval(apply,120);globalThis.__AGCB_CAT_EAR_FIT={version:8,loaded:true,target:'close-roots-outward10-front-crown'};
