'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const sourcePath = process.argv[2] || path.join(root, 'character-asset-runtime.js');
const source = fs.readFileSync(sourcePath, 'utf8');
const runtime = { GLTFLoader: class {}, console };
// Execute the real module's callbacks, without network, rendering, or asset loading.
vm.runInNewContext(source.replace(/^import .*;\s*$/gm, ''), runtime, {filename: sourcePath});
const tick = runtime.__AGCB_ASSET_TICK;
const motion = runtime.__AGCB_ASSET_SET_MOTION;
const names = {upperL:'upperarm_L',lowerL:'lowerarm_L',handL:'hand_L',upperR:'upperarm_R',lowerR:'lowerarm_R',handR:'hand_R'};
let frameCount = 0;
function avatar(baseline = {x:.04,y:-.02,z:.03}) {
  const bones = {}, base = {};
  for (const key of Object.keys(names)) {
    base[key] = {...baseline};
    bones[key] = {name:names[key],rotation:{...baseline,set(x,y,z){this.x=x;this.y=y;this.z=z;}}};
  }
  return {userData:{assetWalkBones:bones,assetArmBaseline:base,assetWalkBlend:0,assetWalkPhase:0}};
}
function check(group, moving, dt) {
  tick(group, moving, dt); frameCount++;
  for (const [key,bone] of Object.entries(group.userData.assetWalkBones)) if (bone) {
    for (const axis of ['x','y','z']) assert.ok(Number.isFinite(bone.rotation[axis]), `${key}.${axis} is ${bone.rotation[axis]} at frame ${frameCount}, moving=${moving}, dt=${String(dt)}`);
  }
  assert.ok(Number.isFinite(group.userData.assetWalkPhase));
  assert.ok(group.userData.assetWalkBlend>=0 && group.userData.assetWalkBlend<=1);
}
// This first frame fails on V0.4.51: pose.x is absent, and undefined * 0 is NaN.
const first = avatar(); check(first,false,0);
for (const key of Object.keys(names)) assert.deepEqual({...first.userData.assetWalkBones[key].rotation,set:undefined}, {...first.userData.assetArmBaseline[key],set:undefined});
for (const fps of [30,60,120]) {
  const group = avatar(), range = Object.fromEntries(Object.keys(names).map(k=>[k,[Infinity,-Infinity]]));
  for (let cycle=0;cycle<3;cycle++) {
    for (const [moving,seconds] of [[false,2],[true,8],[false,3],[true,4],[false,3]]) {
      for (let frame=0;frame<seconds*fps;frame++) {
        check(group,moving,1/fps);
        if (moving) for (const key of Object.keys(names)) {const y=group.userData.assetWalkBones[key].rotation.y;range[key][0]=Math.min(range[key][0],y);range[key][1]=Math.max(range[key][1],y);}
      }
      if (!moving) for (const key of Object.keys(names)) for(const axis of ['x','y','z']) assert.ok(Math.abs(group.userData.assetWalkBones[key].rotation[axis]-group.userData.assetArmBaseline[key][axis])<1e-7,'stopped arm must return to baseline');
    }
  }
  for (const [key,[min,max]] of Object.entries(range)) assert.ok(max-min>.12, `${key} does not swing`);
}
for (const dt of [undefined,null,NaN,Infinity,-Infinity,-1,0,1e-12,10,'bad']) {
  const group=avatar({x:NaN,y:Infinity});
  group.userData.assetWalkPhase=Infinity; group.userData.assetWalkBlend=NaN;
  check(group,true,dt); check(group,false,1/60);
}
for (const blend of [-2,2,Infinity,NaN]) { const group=avatar();group.userData.assetWalkBlend=blend;check(group,true,1/60); }
tick(null,true,0);tick({},false,0);tick({userData:{}},false,0);
const partial=avatar();partial.userData.assetWalkBones.lowerL=null;delete partial.userData.assetArmBaseline.handR;check(partial,true,1/60);
// Keep the existing gait rate and verify idle/walk state changes.
function action(){return {scale:null,resets:0,reset(){this.resets++;return this;},fadeIn(){return this;},fadeOut(){return this;},play(){return this;},setEffectiveTimeScale(v){this.scale=v;return this;}};}
const idle=action(),walk=action(),g=avatar();g.userData.assetActions={idle,walk};
motion(g,'idle');assert.equal(idle.scale,1);motion(g,'walk');assert.equal(walk.scale,1.35);motion(g,'walk');assert.equal(walk.resets,1);motion(g,'idle');assert.equal(idle.resets,2);
const modelSource=fs.readFileSync(path.join(root,'character-models.js'),'utf8');
assert.ok(modelSource.includes('__AGCB_ASSET_TICK?.(group,moving,dt)'),'per-frame call missing');
console.log(`PASS runtime: ${frameCount} frames; six arm bones; 30/60/120 fps; idle/walk/stop/restart; invalid inputs; 1.35x walk.`);

// Verify the original GLB's real skin/joint data on the CPU. No replacement mesh,
// texture changes or WebGL dependency. CI can assemble the existing binary parts.
const modelBase=path.join(root,'assets/characters/manus5/chibi_8_variants_rigged.glb');
const modelPath=process.env.AGCB_GLB_PATH||modelBase;
const bytes=fs.existsSync(modelPath)?fs.readFileSync(modelPath):Buffer.concat(Array.from({length:16},(_,i)=>fs.readFileSync(modelBase+'.part'+String(i).padStart(3,'0'))));
assert.equal(bytes.toString('ascii',0,4),'glTF');assert.equal(bytes.readUInt32LE(8),bytes.length);
let json,bin;
for(let off=12;off<bytes.length;){const len=bytes.readUInt32LE(off),type=bytes.readUInt32LE(off+4);if(type===0x4e4f534a)json=JSON.parse(bytes.subarray(off+8,off+8+len).toString('utf8').trim());if(type===0x004e4942)bin=bytes.subarray(off+8,off+8+len);off+=8+len;}
assert.ok(json&&bin);
const sizes={5121:1,5123:2,5125:4,5126:4},readers={5121:'readUInt8',5123:'readUInt16LE',5125:'readUInt32LE',5126:'readFloatLE'},lengths={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16};
function access(index){const a=json.accessors[index],v=json.bufferViews[a.bufferView],n=lengths[a.type],sz=sizes[a.componentType],stride=v.byteStride||n*sz,start=(v.byteOffset||0)+(a.byteOffset||0);assert.ok(n&&sz&&!a.sparse&&!a.normalized);return Array.from({length:a.count},(_,i)=>Array.from({length:n},(_,k)=>bin[readers[a.componentType]](start+i*stride+k*sz)));}
const meshNode=json.nodes.find(n=>n.skin!==undefined),skin=json.skins[meshNode.skin],primitive=json.meshes[meshNode.mesh].primitives[0];
const position=access(primitive.attributes.POSITION),joints=access(primitive.attributes.JOINTS_0),weights=access(primitive.attributes.WEIGHTS_0),inverse=access(skin.inverseBindMatrices);
assert.equal(position.length,239926,'unexpected source model');
const attrs={position:{array:Float32Array.from(position.flat()),count:position.length},skinIndex:{array:Uint8Array.from(joints.flat())},skinWeight:{array:Float32Array.from(weights.flat())}};
runtime.repairManus5LimbWeights(null,{traverse(fn){fn({isSkinnedMesh:true,skeleton:{bones:skin.joints.map(i=>({name:json.nodes[i].name}))},geometry:{getAttribute(k){return attrs[k]}}})}});
for(let i=0;i<position.length;i++){let sum=0;for(let k=0;k<4;k++)sum+=attrs.skinWeight.array[i*4+k];assert.ok(Math.abs(sum-1)<1e-6);}
const I=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function multiply(a,b){const o=Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function eulerQuaternion({x,y,z}){const c1=Math.cos(x/2),c2=Math.cos(y/2),c3=Math.cos(z/2),s1=Math.sin(x/2),s2=Math.sin(y/2),s3=Math.sin(z/2);return [s1*c2*c3+c1*s2*s3,c1*s2*c3-s1*c2*s3,c1*c2*s3+s1*s2*c3,c1*c2*c3-s1*s2*s3];}
function compose(t,q,s){const [x,y,z,w]=q,[sx,sy,sz]=s,x2=x+x,y2=y+y,z2=z+z,xx=x*x2,xy=x*y2,xz=x*z2,yy=y*y2,yz=y*z2,zz=z*z2,wx=w*x2,wy=w*y2,wz=w*z2;return [(1-yy-zz)*sx,(xy+wz)*sx,(xz-wy)*sx,0,(xy-wz)*sy,(1-xx-zz)*sy,(yz+wx)*sy,0,(xz+wy)*sz,(yz-wx)*sz,(1-xx-yy)*sz,0,...t,1];}
function slerp(a,b,t){let d=a.reduce((s,x,k)=>s+x*b[k],0);if(d<0){b=b.map(x=>-x);d=-d;}if(d>.9995){const q=a.map((x,k)=>x+(b[k]-x)*t),n=Math.hypot(...q);return q.map(x=>x/n);}const theta=Math.acos(Math.min(1,d)),sin=Math.sin(theta);return a.map((x,k)=>(x*Math.sin((1-t)*theta)+b[k]*Math.sin(t*theta))/sin);}
const parents={};json.nodes.forEach((n,i)=>(n.children||[]).forEach(c=>parents[c]=i));
const clips=Object.fromEntries(json.animations.map(a=>[a.name,a.channels.map(ch=>{const s=a.samplers[ch.sampler];assert.ok(!s.interpolation||s.interpolation==='LINEAR');return {node:ch.target.node,path:ch.target.path,times:access(s.input).flat(),values:access(s.output)}})]));
function pose(clip,time){const result={};for(const c of clips[clip]){const ts=c.times,t=time%ts.at(-1);let i=0;while(i<ts.length-2&&ts[i+1]<t)i++;const f=(t-ts[i])/(ts[i+1]-ts[i]),a=c.values[i],b=c.values[i+1];(result[c.node]||={})[c.path]=c.path==='rotation'?slerp(a,b,f):a.map((v,k)=>v+(b[k]-v)*f);}return result;}
function matrices(group,clip,time){const states=pose(clip,time),world={};for(const bone of Object.values(group.userData.assetWalkBones)){const index=json.nodes.findIndex(n=>n.name===bone.name);(states[index]||={}).rotation=eulerQuaternion(bone.rotation);}
  function get(i){if(world[i])return world[i];const n=json.nodes[i],s=states[i]||{},local=n.matrix||compose(s.translation||n.translation||[0,0,0],s.rotation||n.rotation||[0,0,0,1],s.scale||n.scale||[1,1,1]);return world[i]=multiply(parents[i]===undefined?I:get(parents[i]),local);}
  return skin.joints.map((i,k)=>multiply(get(i),inverse[k]));}
const armGroup=avatar({x:0,y:0,z:0});let testedVertices=0;
for(const [label,moving,time] of [['idle',false,0],['walk-a',true,.15],['walk-b',true,.45],['stopped',false,0],['restart',true,.75]]){
  for(let f=0;f<180;f++)check(armGroup,moving,1/60);
  const ms=matrices(armGroup,moving?'Walk_Cycle':'Idle_Breathing',time);ms.forEach(m=>assert.ok(m.every(Number.isFinite),label+' non-finite bone matrix'));
  let max=0,headMin=Infinity,headMax=-Infinity;
  for(let i=0;i<position.length;i++){
    const [x,y,z]=position[i],out=[0,0,0];
    for(let k=0;k<4;k++){const at=i*4+k,m=ms[attrs.skinIndex.array[at]],w=attrs.skinWeight.array[at];for(let axis=0;axis<3;axis++)out[axis]+=w*(m[axis]*x+m[4+axis]*y+m[8+axis]*z+m[12+axis]);}
    assert.ok(out.every(Number.isFinite),label+' non-finite skinned vertex '+i);max=Math.max(max,...out.map(Math.abs));if(y>.5){headMin=Math.min(headMin,out[1]);headMax=Math.max(headMax,out[1]);}testedVertices++;
  }
  assert.ok(max<3,label+' exploded geometry');assert.ok(headMax-headMin>.3,label+' collapsed head');
  console.log(`PASS original GLB skin: ${label}; ${position.length} finite vertices; head Y ${headMin.toFixed(3)}..${headMax.toFixed(3)}; max extent ${max.toFixed(3)}.`);
}
console.log(`PASS total: ${testedVertices} skinned vertex evaluations. CPU checks do not substitute for an iPhone visual acceptance test.`);
