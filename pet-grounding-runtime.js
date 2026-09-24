import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Runtime38: make visible dog/cat paws follow the animated leg pivots instead of
// leaving decorative root-level paw meshes behind while the legs swing.
const grounded=new WeakSet();
const hiddenRootPaws=new WeakMap();
const pawMatCache=new Map();
function pawMat(color){let m=pawMatCache.get(color);if(!m){m=new THREE.MeshStandardMaterial({color,roughness:.92,metalness:.01});pawMatCache.set(color,m)}return m}
function hideLegacyRootPaws(g){const hidden=[];for(const c of g.children){if(!c?.isMesh)continue;const p=c.position;if(p.y>.17||Math.abs(p.x)<.12||Math.abs(p.x)>.36||p.z<-.38||p.z>.42)continue;c.visible=false;hidden.push(c)}hiddenRootPaws.set(g,hidden)}
function addToe(parent,x,z,material){const m=new THREE.Mesh(new THREE.CapsuleGeometry(.006,.026,4,7),material);m.rotation.x=Math.PI/2;m.position.set(x,-.02,z);m.castShadow=true;parent.add(m)}
function attachPaw(leg,type,index,material){const front=index<2,paw=new THREE.Mesh(new THREE.SphereGeometry(type==='dog'?.078:.068,12,9),material);paw.name='agcb-grounded-paw';paw.scale.set(1.08,.43,front?1.38:1.30);paw.position.set(0,-(front?.205:.19),-.035);paw.castShadow=true;paw.receiveShadow=true;leg.add(paw);for(const x of[-.027,0,.027])addToe(leg,x,paw.position.z-.072,material);leg.userData.__agcbGroundedPaw=paw}
function install(g){const u=g?.userData,p=u?.animatedParts;if(!u?.petType||!Array.isArray(p?.legs)||grounded.has(g))return false;hideLegacyRootPaws(g);const color=u.petType==='dog'?0xe8caa8:0xf0ddd0,material=pawMat(color);p.legs.forEach((leg,i)=>attachPaw(leg,u.petType,i,material));u.pawGroundingSchema=1;grounded.add(g);return true}
function scan(){let count=0;for(const p of globalThis.__AGCB_LIVE_PETS||[])if(install(p))count++;return count}
let tick=0;function loop(){requestAnimationFrame(loop);if(++tick%120===0)scan()}
const first=scan();requestAnimationFrame(loop);
globalThis.__AGCB_PET_GROUNDING={schema:1,scan,grounded,hiddenRootPaws,first,features:['paw-bound-to-leg-pivot','legacy-root-paw-hide','ground-contact-follow-gait']};
