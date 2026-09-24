import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import fs from 'node:fs/promises';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(x=>{this.result=x;this.onloadend?.()})}readAsDataURL(b){b.arrayBuffer().then(x=>{this.result=`data:${b.type};base64,${Buffer.from(x).toString('base64')}`;this.onloadend?.()})}};
await import('./build-adult-female.mjs');
const src='output/AG_Model003_Adult_Female_Candidate_004.glb';
const data=await fs.readFile(src);const asset=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
asset.scene.name='AG_Adult_Female_Model003_Candidate_005';asset.scene.userData={...asset.scene.userData,assetId:'ag-model003-adult-female-candidate-005',appearanceAccepted:false,gameIntegrated:false};
function deform(o,fn){const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i);fn(p);a.setXYZ(i,p.x,p.y,p.z)}a.needsUpdate=true;o.geometry.computeVertexNormals()}
asset.scene.traverse(o=>{if(!o.isMesh)return;
  if(o.name==='ivory-smooth-fitted-torso')deform(o,p=>{p.x*=1.055;p.z*=1.24;if(p.y>.99&&p.y<1.20&&p.z>0)p.z+=.012});
  if(o.name==='back-hair-mass')deform(o,p=>{p.x*=.93;p.z=-.092+(p.z+.092)*.78;p.y=1.43+(p.y-1.43)*.94});
});
const bytes=await new GLTFExporter().parseAsync(asset.scene,{binary:true,animations:asset.animations,onlyVisible:false});
await fs.writeFile('output/AG_Model003_Adult_Female_Candidate_005.glb',Buffer.from(bytes));
const manifest={id:'ag-model003-adult-female-candidate-005',status:'INDEPENDENT_CANDIDATE_NOT_GAME_INTEGRATED',bytes:bytes.byteLength,bones:[],slots:['bodyBase','underlayer','top','bottom','hair','shoes','accessory'],clips:asset.animations.map(a=>a.name),meshCount:0,appearanceAccepted:false,realDeviceTested:false,gameIntegrated:false,notes:['V0.4.98 focused correction over V0.4.97 exported GLB.','Expanded blouse depth/width to stop body geometry piercing through chest.','Reduced back-hair shell depth and height while preserving improved face and 18-bone animation structure.','Technical validation is not appearance approval.']};asset.scene.traverse(o=>{if(o.isBone)manifest.bones.push(o.name);if(o.isMesh)manifest.meshCount++});await fs.writeFile('output/AG_Model003_Adult_Female_Candidate_005_manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest));
