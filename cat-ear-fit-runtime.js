// AG Cute Blocks - test character 3 cat-ear replacement patch v6.
// Body/back accessory/UI/character scale/movement are locked PASS. Only cat-ear placement is adjusted.
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
function makeEar(side){const grp=new THREE.Group();grp.name=side<0?'ag-cat-ear-left-v6':'ag-cat-ear-right-v6';grp.add(new THREE.Mesh(earGeometry(),outerMat));const p=new THREE.Mesh(innerGeometry(),innerMat);p.rotation.x=-.04;grp.add(p);return grp;}
function apply(){
 const root=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION?.candidate?.root;if(!root||root===lastRoot)return;
 const base=root.getObjectByName?.('ag-cat-ear-rig');if(!base||!base.parent)return;const head=base.parent;base.visible=false;
 ['ag-cat-ear-rig-v3','ag-cat-ear-rig-v4','ag-cat-ear-rig-v5'].forEach(n=>{const x=head.getObjectByName?.(n);if(x)x.visible=false;});
 const rig=new THREE.Group();rig.name='ag-cat-ear-rig-v6';head.add(rig);
 // V6 from latest iPhone front/back/top review: seat roots on the crown rather than side-mounting.
 // Bring both ears inward, slightly forward, minimally taller, and keep near-vertical alignment.
 rig.position.set(0,.158,.018);
 const l=makeEar(-1),r=makeEar(1);
 l.position.set(-.086,0,.012);r.position.set(.086,0,.012);
 l.rotation.set(-.015,-.008,.028);r.rotation.set(-.015,.008,-.028);
 rig.add(l,r);
 lastRoot=root;root.userData.agEarFit='v6-crown-centered-forward-natural';
}
setInterval(apply,150);globalThis.__AGCB_CAT_EAR_FIT={version:6,loaded:true,target:'crown-centered-forward-natural'};
