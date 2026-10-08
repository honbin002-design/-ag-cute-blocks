import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../vendor/three-0.180.0/build/three.module.js';
const world=new THREE.Group(),avatars=new Set(),storage=new Map([['agcb_prod_v1_character_selection','test3']]);
let player,frame;
function replace(){if(player)world.remove(player);player=new THREE.Group();const visual=new THREE.Group();player.add(visual);player.userData={entityId:'player-local',visual};world.add(player);avatars.add(player)}replace();
const nodes={},sel={value:'special5',dataset:{},appendChild(){},parentNode:{appendChild(el){nodes[el.id]=el}},onchange(){replace()}};nodes.avatar=sel;
const context={console,performance,Set,Map,Math,Promise,setTimeout,clearTimeout,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},document:{readyState:'complete',addEventListener(){},getElementById:id=>nodes[id]||null,createElement:()=>({style:{},dataset:{}}),body:{},documentElement:{dataset:{}}},MutationObserver:class{observe(){}},requestAnimationFrame(fn){frame=fn},__AGCB_LIVE_AVATARS:avatars,__AGCB_TEST_CHARACTER_RUNTIME:{characters:{},create:async id=>({id,root:new THREE.Group(),play(){},update(){}})},__AGCB_BOOTSTRAP:{}};
vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../test-character-game-integration.js',import.meta.url),'utf8'),context);
await new Promise(r=>setTimeout(r,0));const api=context.__AGCB_TEST_CHARACTER_INTEGRATION;
assert.equal(api.selected,'special5');assert.equal(api.candidate.root.parent,player);
for(const [role,id] of [['special3','test3'],['special2','special2'],['special5','special5']]){const old=player;sel.value=role;await sel.onchange({target:sel});assert.equal(old.parent,null);assert.equal(api.player,player);assert.equal(api.selected,id);assert.equal(api.candidate.id,id);assert.equal(api.candidate.root.parent,player);assert.equal(player.userData.visual.visible,false);assert.equal(sel.value,role)}
replace();frame(performance.now());assert.equal(api.candidate.root.parent,player);assert.equal(player.userData.visual.visible,false);
sel.value='boy';await sel.onchange({target:sel});assert.equal(api.candidate,null);assert.equal(player.userData.visual.visible,true);assert.equal(storage.get('agcb_prod_v1_character_selection'),'');assert.equal(sel.value,'boy');
assert.equal(nodes.agTestCharacterSelect,undefined);
console.log('PASS: original dropdown switches 3/2/5; attached player only; replacement reattaches and hides base; boy restores; explicit V1.0.1 special5 selection migrated; no duplicate dropdown. Visual WebGL rendering not tested.');
