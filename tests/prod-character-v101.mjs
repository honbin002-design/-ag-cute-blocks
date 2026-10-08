import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../vendor/three-0.180.0/build/three.module.js';
import {registerHooks} from 'node:module';
registerHooks({resolve(specifier,context,next){if(specifier==='three')return {url:new URL('../vendor/three-0.180.0/build/three.module.js',import.meta.url).href,shortCircuit:true};return next(specifier,context)}});
const {GLTFLoader}=await import('../vendor/three-0.180.0/examples/jsm/loaders/GLTFLoader.js');
const bytes=Buffer.concat(Array.from({length:16},(_,i)=>fs.readFileSync(new URL('../assets/characters/formal/character3-v101.glb.part'+String(i).padStart(3,'0'),import.meta.url))));
// Renderer-independent real GLB skeleton/animation test; textures are stubbed only here.
GLTFLoader.prototype.register.call(new GLTFLoader(),()=>({name:'unused'}));
const originalParse=GLTFLoader.prototype.parse;GLTFLoader.prototype.parse=function(...args){this.register(()=>({name:'TEST_TEXTURE_STUB',loadTexture:()=>Promise.resolve(new THREE.Texture())}));return originalParse.apply(this,args)};
GLTFLoader.prototype.load=function(url,onLoad,onProgress,onError){this.register(()=>({name:'TEST_TEXTURE_STUB',loadTexture:()=>Promise.resolve(new THREE.Texture())}));this.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'',onLoad,onError)};
globalThis.fetch=async url=>({ok:true,arrayBuffer:async()=>{const b=fs.readFileSync(new URL('../'+url,import.meta.url));return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}});
const {create}=await import('../test-character-game-runtime.js');
const candidate=await create('test3');
let skinned=0;candidate.root.traverse(o=>{if(o.isSkinnedMesh)skinned++});assert(skinned>0);
for(const action of ['idle','walk','run','jump']){candidate.play(action);for(let i=0;i<20;i++)candidate.update(1/60);candidate.root.traverse(o=>assert([...o.position,...o.quaternion,...o.scale].every(Number.isFinite)));}
const player=new THREE.Group(),visual=new THREE.Group();player.add(visual);player.userData={entityId:'player-local',visual};new THREE.Group().add(player);
const storage=new Map([['ag_cute_blocks_test_character_v1','TEST_SENTINEL'],['agcb_prod_v1_character_selection','test3']]);
const context={console,performance,Set,Map,Math,Promise,setTimeout,clearTimeout,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},document:{readyState:'loading',addEventListener(){},getElementById(){return null},body:{},documentElement:{dataset:{}}},MutationObserver:class{observe(){}},requestAnimationFrame(){},__AGCB_LIVE_AVATARS:new Set([player]),__AGCB_TEST_CHARACTER_RUNTIME:{characters:{test3:{label:'特殊角色3'}},create:async()=>candidate},__AGCB_BOOTSTRAP:{characterRuntimeGate:'LOADING'}};
vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../test-character-game-integration.js',import.meta.url),'utf8'),context);
await context.__AGCB_TEST_CHARACTER_INTEGRATION.select('test3');
assert.equal(context.__AGCB_TEST_CHARACTER_INTEGRATION.candidate,candidate);assert.equal(candidate.root.parent,player);assert.equal(visual.visible,false);assert.equal(context.__AGCB_BOOTSTRAP.characterIdentity,'test3');assert.equal(storage.get('ag_cute_blocks_test_character_v1'),'TEST_SENTINEL');assert.equal(storage.get('agcb_prod_v1_character_selection'),'test3');
console.log(JSON.stringify({realGlbParsed:true,skinnedMeshes:skinned,actions:['idle','walk','run','jump'],finiteTransforms:true,oldVisualHidden:true,correctModelAttached:true,testStorageUntouched:true,visualRendering:'NOT_TESTED_WEBGL_DISABLED'},null,2));
