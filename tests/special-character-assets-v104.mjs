import assert from 'node:assert/strict';
import fs from 'node:fs';
import {registerHooks} from 'node:module';
registerHooks({resolve(s,c,n){if(s==='three')return {url:new URL('../vendor/three-0.180.0/build/three.module.js',import.meta.url).href,shortCircuit:true};return n(s,c)}});
import * as THREE from '../vendor/three-0.180.0/build/three.module.js';
const {GLTFLoader}=await import('../vendor/three-0.180.0/examples/jsm/loaders/GLTFLoader.js');
const parse=GLTFLoader.prototype.parse;
GLTFLoader.prototype.parse=function(...args){this.register(()=>({name:'TEXTURE_STUB',loadTexture:()=>Promise.resolve(new THREE.Texture())}));return parse.apply(this,args)};
globalThis.setInterval=()=>0;globalThis.clearInterval=()=>{};
globalThis.fetch=async url=>{let data=fs.readFileSync(new URL('../'+url,import.meta.url));return{ok:true,arrayBuffer:async()=>data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength)}};
await import('../test-character-game-runtime.js');
await import('../special-character-assets-runtime.js');
for(const id of ['special2','special5']){const c=await globalThis.__AGCB_TEST_CHARACTER_RUNTIME.create(id);assert(c.root.isObject3D);let meshes=0;c.root.traverse(o=>{if(o.isMesh)meshes++});assert(meshes>0);let skins=0;c.root.traverse(o=>{if(o.isSkinnedMesh){skins++;const w=o.geometry.attributes.skinWeight;for(let i=0;i<w.count;i++)assert(Math.abs(w.getX(i)+w.getY(i)+w.getZ(i)+w.getW(i)-1)<1e-5)}});assert(skins>0);const poses=[];for(const a of ['idle','walk','run','jump']){c.play(a);for(let i=0;i<10;i++)c.update(1/60);const pose=[];c.root.traverse(o=>{if(o.isBone)pose.push(...o.quaternion.toArray())});poses.push(pose)}for(let i=1;i<poses.length;i++)assert(poses[i].some((x,j)=>Math.abs(x-poses[0][j])>.001),id+' '+i+' unchanged pose');console.log(id,meshes,c.available)}
