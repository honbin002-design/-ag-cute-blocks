import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const loader=new GLTFLoader();
const TEST_CHARACTERS={
  test1:{label:'測試角色1',model:'https://raw.githubusercontent.com/eturner58/game-assets/main/kenney/3D%20assets/Blocky%20Characters/Models/GLB%20format/character-a.glb'},
  test2:{label:'測試角色2',model:'https://raw.githubusercontent.com/Quaternius/Universal-Base-Characters/main/assets/human.glb'},
  test3:{label:'測試角色3',model:'https://raw.githubusercontent.com/agentkaerf/FreeModels/main/Universal%20Animation%20Library%202%5BStandard%5D/Female%20Mannequin/Unreal-Godot/Mannequin_F.glb',animations:'https://raw.githubusercontent.com/agentkaerf/FreeModels/main/Universal%20Animation%20Library%202%5BStandard%5D/Unreal-Godot/UAL2_Standard.glb'}
};
function load(url){return new Promise((resolve,reject)=>loader.load(url,resolve,undefined,reject))}
function normalize(root,targetHeight=2.0){const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());root.position.sub(center);root.position.y+=size.y/2;const scale=targetHeight/Math.max(size.y,.001);root.scale.multiplyScalar(scale);return root}
function chooseClip(clips,keys){for(const k of keys){const c=clips.find(x=>(x.name||'').toLowerCase().includes(k));if(c)return c}return clips[0]||null}
async function create(id){const spec=TEST_CHARACTERS[id];if(!spec)throw new Error(`Unknown test character: ${id}`);const model=await load(spec.model);const root=normalize(model.scene);root.name=`ag-${id}`;root.userData={...(root.userData||{}),agTestCharacter:id,label:spec.label};let clips=model.animations||[];if(spec.animations){const lib=await load(spec.animations);if(lib.animations?.length)clips=lib.animations}
 const mixer=new THREE.AnimationMixer(root),actions={};
 const map={idle:['idle'],walk:['walk'],run:['run','sprint'],jump:['jump'],fish:['fish'],farm:['farm','plant'],chop:['chop','axe'],attack:['attack'],dodge:['dodge','roll']};
 for(const [name,keys] of Object.entries(map)){const clip=chooseClip(clips,keys);if(clip)actions[name]=mixer.clipAction(clip,root)}
 let current=null;
 function play(name){const next=actions[name]||actions.idle||Object.values(actions)[0];if(!next||next===current)return;current?.fadeOut(.12);next.reset().fadeIn(.12).play();current=next}
 play('idle');
 return{root,mixer,actions,clips,play,update(dt){mixer.update(dt)}}
}
globalThis.__AGCB_TEST_CHARACTER_RUNTIME={version:1,characters:TEST_CHARACTERS,create};
export{TEST_CHARACTERS,create};