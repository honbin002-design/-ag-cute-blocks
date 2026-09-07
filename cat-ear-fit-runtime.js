// AG Cute Blocks - test character 3 cat-ear replacement patch v3.
// Accepted body/back accessory/UI stay untouched. Rebuild only the cat ears with broad fitted bases.
import * as THREE from 'three';
let lastRoot=null;
const outerMat=new THREE.MeshStandardMaterial({color:0x152b5c,roughness:.62,metalness:.02,side:THREE.DoubleSide});
const innerMat=new THREE.MeshStandardMaterial({color:0xf0e9ff,roughness:.72,side:THREE.DoubleSide});
function earGeometry(w=.145,h=.215,d=.055){
 const g=new THREE.BufferGeometry();
 // Broad curved-looking base, narrower shoulder, single tip. Front/back thickness avoids flat triangle-board appearance.
 const v=[
  -w*.50,0,d*.38, w*.50,0,d*.38, -w*.36,h*.28,d*.46, w*.36,h*.28,d*.46, 0,h,d*.10,
  -w*.50,0,-d*.38, w*.50,0,-d*.38, -w*.36,h*.28,-d*.46, w*.36,h*.28,-d*.46, 0,h,-d*.10
 ];
 const idx=[0,1,3,0,3,2,2,3,4, 6,5,7,7,5,8,7,8,9, 0,5,1,0,6,5, 2,4,9,2,9,7, 3,8,9,3,9,4, 0,2,7,0,7,6, 1,5,8,1,8,3];
 g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function innerGeometry(w=.088,h=.145,z=.031){
 const s=new THREE.Shape();s.moveTo(-w*.5,0);s.lineTo(w*.5,0);s.lineTo(w*.30,h*.30);s.lineTo(0,h);s.lineTo(-w*.30,h*.30);s.closePath();
 const g=new THREE.ShapeGeometry(s);g.translate(0,.025,z);return g;
}
function makeEar(side){
 const grp=new THREE.Group();grp.name=side<0?'ag-cat-ear-left-v3':'ag-cat-ear-right-v3';
 const shell=new THREE.Mesh(earGeometry(),outerMat);shell.name=`${grp.name}-shell`;grp.add(shell);
 const panel=new THREE.Mesh(innerGeometry(),innerMat);panel.name=`${grp.name}-inner`;panel.rotation.x=-.035;grp.add(panel);
 return grp;
}
function apply(){
 const root=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION?.candidate?.root;if(!root||root===lastRoot)return;
 const old=root.getObjectByName?.('ag-cat-ear-rig');if(!old||!old.parent)return;
 const head=old.parent;old.visible=false;
 const rig=new THREE.Group();rig.name='ag-cat-ear-rig-v3';head.add(rig);
 // Place broad bases on the left/right crown surface. Lower vertical seat + outward X keeps roots attached rather than floating/penetrating.
 rig.position.set(0,.205,.018);
 const l=makeEar(-1),r=makeEar(1);
 l.position.set(-.135,.015,.018);r.position.set(.135,.015,.018);
 l.rotation.set(-.055,-.035,.24);r.rotation.set(-.055,.035,-.24);
 rig.add(l,r);lastRoot=root;
 root.userData.agEarFit='v3-rebuilt-broad-base-fitted-shell';
}
setInterval(apply,150);
globalThis.__AGCB_CAT_EAR_FIT={version:3,loaded:true,target:'rebuilt-broad-base-ear-shells-fitted-to-crown'};
