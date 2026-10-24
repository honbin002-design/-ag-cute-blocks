import assert from 'node:assert/strict';
import fs from 'node:fs';
import {registerHooks} from 'node:module';
registerHooks({resolve(s,c,n){if(s==='three')return {url:new URL('../vendor/three-0.180.0/build/three.module.js',import.meta.url).href,shortCircuit:true};return n(s,c)}});
import * as THREE from '../vendor/three-0.180.0/build/three.module.js';
const {GLTFLoader}=await import('../vendor/three-0.180.0/examples/jsm/loaders/GLTFLoader.js');
THREE.FileLoader.prototype.load=function(url,ok,progress,fail){try{const b=fs.readFileSync('/tmp/agcb-candidate018/AnimationLibrary_Godot_Standard.bin');ok(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength))}catch(e){fail(e)}};
const parse=GLTFLoader.prototype.parse;
GLTFLoader.prototype.parse=function(...args){this.register(()=>({name:'TEXTURE_STUB',loadTexture:()=>Promise.resolve(new THREE.Texture())}));return parse.apply(this,args)};
GLTFLoader.prototype.load=function(url,ok,progress,fail){try{const p=url.endsWith('.vrm')?'donor.vrm':'motion.gltf';const b=fs.readFileSync('/tmp/agcb-candidate018/'+p);this.parse(p.endsWith('.gltf')?b.toString():b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'',ok,fail)}catch(e){fail(e)}};
const {create}=await import('../candidate018-game-runtime.js');
const c=await create();assert(c.mappedBones>=48);
for(const a of ['idle','walk','run','jump']){assert(c.actions[a],a);c.play(a);for(let i=0;i<30;i++)c.update(1/60);c.root.traverse(o=>assert([...o.position,...o.quaternion,...o.scale].every(Number.isFinite)))}
console.log({mappedBones:c.mappedBones,actions:Object.keys(c.actions),realDonorAndMotionParsed:true,webglVisual:'NOT_VERIFIED'});
