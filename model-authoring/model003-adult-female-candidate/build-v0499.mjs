import fs from 'node:fs/promises';
await import('./build-adult-female.mjs');
const src='output/AG_Model003_Adult_Female_Candidate_004.glb';
const dst='output/AG_Model003_Adult_Female_Candidate_006.glb';
const raw=await fs.readFile(src);
const dv=new DataView(raw.buffer,raw.byteOffset,raw.byteLength);
if(dv.getUint32(0,true)!==0x46546c67||dv.getUint32(4,true)!==2)throw new Error('not GLB2');
let off=12,json=null,bin=null;
while(off<raw.length){const len=dv.getUint32(off,true),type=dv.getUint32(off+4,true),data=raw.subarray(off+8,off+8+len);if(type===0x4e4f534a)json=JSON.parse(data.toString('utf8').trimEnd());if(type===0x004e4942)bin=Buffer.from(data);off+=8+len}
if(!json||!bin)throw new Error('missing chunks');
function accessorForMesh(meshName){const mi=json.meshes.findIndex(m=>m.name===meshName);if(mi<0)throw new Error('mesh not found '+meshName);const prim=json.meshes[mi].primitives[0],ai=prim.attributes.POSITION,a=json.accessors[ai],bv=json.bufferViews[a.bufferView];if(a.componentType!==5126||a.type!=='VEC3')throw new Error('unexpected POSITION '+meshName);return{a,bv,start:(bv.byteOffset||0)+(a.byteOffset||0),stride:bv.byteStride||12}}
function eachPosition(meshName,fn){const {a,start,stride}=accessorForMesh(meshName);for(let i=0;i<a.count;i++){const p=start+i*stride,x=bin.readFloatLE(p),y=bin.readFloatLE(p+4),z=bin.readFloatLE(p+8),q=fn(x,y,z);if(q){bin.writeFloatLE(q[0],p);bin.writeFloatLE(q[1],p+4);bin.writeFloatLE(q[2],p+8)}}}
// Hide the skin torso underneath clothing instead of endlessly thickening the garment.
eachPosition('adult-female-connected-base',(x,y,z)=>{if(y>.735&&y<1.285&&Math.abs(x)<.215)return[x*.80,y,z*.62];return[x,y,z]});
// Give the blouse a modest safety envelope while retaining the V0.4.97 silhouette.
eachPosition('ivory-smooth-fitted-torso',(x,y,z)=>[x*1.035,y,z*1.14]);
// Reduce the helmet-like rear hair mass without touching the improved face/fringe.
eachPosition('back-hair-mass',(x,y,z)=>[x*.94,1.43+(y-1.43)*.95,-.092+(z+.092)*.80]);
// Same-length identifier replacement preserves compact JSON layout and all original skin/node hierarchy.
const js=JSON.stringify(json).replaceAll('Candidate_004','Candidate_006').replaceAll('candidate-004','candidate-006');
const jbuf=Buffer.from(js,'utf8'),jpad=(4-jbuf.length%4)%4,jchunk=Buffer.concat([jbuf,Buffer.alloc(jpad,0x20)]),bpad=(4-bin.length%4)%4,bchunk=Buffer.concat([bin,Buffer.alloc(bpad)]),total=12+8+jchunk.length+8+bchunk.length,out=Buffer.alloc(total);let w=0;
out.writeUInt32LE(0x46546c67,w);w+=4;out.writeUInt32LE(2,w);w+=4;out.writeUInt32LE(total,w);w+=4;out.writeUInt32LE(jchunk.length,w);w+=4;out.writeUInt32LE(0x4e4f534a,w);w+=4;jchunk.copy(out,w);w+=jchunk.length;out.writeUInt32LE(bchunk.length,w);w+=4;out.writeUInt32LE(0x004e4942,w);w+=4;bchunk.copy(out,w);
await fs.writeFile(dst,out);
const manifest={id:'ag-model003-adult-female-candidate-006',status:'INDEPENDENT_CANDIDATE_NOT_GAME_INTEGRATED',bytes:out.length,bones:18,slots:['bodyBase','underlayer','top','bottom','hair','shoes','accessory'],clips:['Idle','Walk','Run','Jump','JointInspection'],appearanceAccepted:false,realDeviceTested:false,gameIntegrated:false,notes:['V0.4.99 binary-safe geometry correction preserves the original Model003-derived GLB skin/node hierarchy.','Clothed torso skin is inset so it cannot pierce through the blouse; face/head geometry is unchanged from the improved V0.4.97 direction.','Blouse gets a small coverage margin and rear hair shell is reduced.','Technical validation is not appearance approval.']};await fs.writeFile('output/AG_Model003_Adult_Female_Candidate_006_manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest));
