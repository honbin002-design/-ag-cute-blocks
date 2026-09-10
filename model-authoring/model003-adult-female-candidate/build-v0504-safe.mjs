import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import fs from 'node:fs/promises';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(x=>{this.result=x;this.onloadend?.()})}readAsDataURL(b){b.arrayBuffer().then(x=>{this.result=`data:${b.type};base64,${Buffer.from(x).toString('base64')}`;this.onloadend?.()})}};
await import('./build-v0502-source.mjs');
const src='output/AG_Model003_Adult_Female_Candidate_009.glb';
const data=await fs.readFile(src);const asset=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');const scene=asset.scene;
const get=n=>scene.getObjectByName(n);
function bboxDeform(name,fn){const o=get(name);if(!o?.geometry)throw new Error('missing '+name);const g=o.geometry.clone();g.computeBoundingBox();const b=g.boundingBox.clone(),c=new T.Vector3();b.getCenter(c);const size=new T.Vector3();b.getSize(size);const a=g.attributes.position,p=new T.Vector3();for(let i=0;i<a.count;i++){p.fromBufferAttribute(a,i);const n=new T.Vector3(size.x?2*(p.x-c.x)/size.x:0,size.y?2*(p.y-c.y)/size.y:0,size.z?2*(p.z-c.z)/size.z:0);const q=fn(p.clone(),n,c.clone(),size.clone());a.setXYZ(i,q.x,q.y,q.z)}a.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();o.geometry=g}
function remove(name){const o=get(name);if(o)o.removeFromParent()}
// Remove the spherical shoulder caps that read as ball joints. Do not alter arm bones or animation pivots.
remove('blouse-shoulder-cap--1');remove('blouse-shoulder-cap-1');
// Slightly flare the blouse only near its upper edge using normalized local mesh coordinates.
bboxDeform('ivory-sleeveless-blouse',(p,n,c)=>{const top=T.MathUtils.smoothstep(n.y,.45,1);const dx=p.x-c.x;p.x=c.x+dx*(1+.045*top);return p});
// Turn oval hands into flatter palm silhouettes around each mesh's own center; no world-coordinate assumptions.
for(const side of ['l','r'])bboxDeform('adult-hand-'+side,(p,n,c)=>{p.x=c.x+(p.x-c.x)*.76;p.z=c.z+(p.z-c.z)*.62;const wrist=T.MathUtils.smoothstep(n.y,.25,1);p.x=c.x+(p.x-c.x)*(1-.10*wrist);return p});
// Slim the rear hair mass and taper its lower half, again relative to its actual exported bounds.
bboxDeform('rear-hair-layer',(p,n,c)=>{const lower=T.MathUtils.clamp((1-n.y)/2,0,1);const taper=1-.18*lower;p.x=c.x+(p.x-c.x)*.82*taper;p.z=c.z+(p.z-c.z)*.68;return p});
// Refine side face-frame strands modestly, keeping all existing skinning and material assignments.
for(const name of ['face-frame--1','face-frame-1','outer-wave--1','outer-wave-1'])bboxDeform(name,(p,n,c)=>{p.x=c.x+(p.x-c.x)*.88;p.z=c.z+(p.z-c.z)*.86;return p});
scene.name='AG_Adult_Female_Model003_Candidate_011';scene.userData={...(scene.userData||{}),assetId:'ag-model003-adult-female-candidate-011',status:'INDEPENDENT_CANDIDATE_NOT_GAME_INTEGRATED',appearanceAccepted:false,gameIntegrated:false,design:'SAFE_BBOX_REFINEMENT_FROM_SOURCE_LEVEL_V0502'};scene.traverse(o=>{if(o.userData?.assetId)o.userData.assetId=String(o.userData.assetId).replaceAll('candidate-009','candidate-011')});const clips=asset.animations;scene.animations=clips;
const bytes=await new GLTFExporter().parseAsync(scene,{binary:true,animations:clips,onlyVisible:false});await fs.writeFile('output/AG_Model003_Adult_Female_Candidate_011.glb',Buffer.from(bytes));let boneCount=0,meshCount=0;scene.traverse(o=>{if(o.isBone)boneCount++;if(o.isMesh)meshCount++});const manifest={id:'ag-model003-adult-female-candidate-011',status:'INDEPENDENT_CANDIDATE_NOT_GAME_INTEGRATED',version:'0.5.04',bytes:bytes.byteLength,bones:boneCount,slots:['bodyBase','underlayer','top','bottom','hair','shoes','accessory'],clips:clips.map(c=>c.name),meshCount,appearanceAccepted:false,realDeviceTested:false,gameIntegrated:false,notes:['V0.5.04 restarts from the clean V0.5.02 source-level baseline, not from regressed V0.5.03.','All refinements use each mesh local bounding box; no fixed world-coordinate deformation is used.','Ball-shaped shoulder caps removed without changing arm bones.','Hands flattened toward palm silhouettes using local bounds.','Rear and side hair volume reduced safely; eyes and facial micro-meshes are intentionally untouched this round.','Technical validation is not appearance approval.']};await fs.writeFile('output/AG_Model003_Adult_Female_Candidate_011_manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest));
