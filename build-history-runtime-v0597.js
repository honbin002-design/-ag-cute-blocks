// AG Cute Blocks V0.5.97 — conflict-safe build-only Undo / Redo.
// Additive runtime: tracks only reversible building/furniture changes in the canonical world snapshot.
// It intentionally excludes crops, tools, trees, animals, shipping and other gameplay/resource state.
const VERSION='0.5.97';
const SAVE_KEY='ag_cute_blocks_world_v04';
const STACK_KEY='ag_cute_blocks_build_history_v0597';
const SAFE_OBJECT_TYPES=new Set(['door','window','fence','chair','table','sofa','bed','lamp','cabinet','fridge','stove','washer','tv','petBedRound','cloudLamp','flowerArch','swingGarden','starBed']);
const MAX_HISTORY=24;
let applying=false;
let lastConflict='';

function readWorld(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}}
function writeWorld(world){localStorage.setItem(SAVE_KEY,JSON.stringify(world))}
function clone(v){return v==null?v:JSON.parse(JSON.stringify(v))}
function entityMap(world){const map=new Map();for(const b of world?.blocks||[])map.set(String(b.id),{kind:'block',record:b});for(const o of world?.objects||[])map.set(String(o.id),{kind:'object',record:o});return map}
function safeEntity(e){return !!e&&(e.kind==='block'||(e.kind==='object'&&SAFE_OBJECT_TYPES.has(e.record?.type)))}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b)}
function diffWorld(before,after){
  const a=entityMap(before),b=entityMap(after),changes=[];
  for(const [id,e] of a){const n=b.get(id);if(!n)changes.push({type:'remove',id,before:clone(e),after:null});else if(e.kind===n.kind&&!same(e.record,n.record))changes.push({type:'change',id,before:clone(e),after:clone(n)})}
  for(const [id,e] of b)if(!a.has(id))changes.push({type:'add',id,before:null,after:clone(e)});
  if(changes.length!==1)return null;
  const c=changes[0],probe=c.after||c.before;if(!safeEntity(probe))return null;
  return c;
}
function loadStacks(){try{const s=JSON.parse(sessionStorage.getItem(STACK_KEY)||'null');if(s&&Array.isArray(s.undo)&&Array.isArray(s.redo))return s}catch{}return{undo:[],redo:[]}}
let stacks=loadStacks();
function saveStacks(){sessionStorage.setItem(STACK_KEY,JSON.stringify(stacks));syncButtons()}
function push(change){stacks.undo.push(change);if(stacks.undo.length>MAX_HISTORY)stacks.undo.shift();stacks.redo=[];lastConflict='';saveStacks()}
function forceSave(){document.getElementById('saveNow')?.click()}
function currentEntity(world,entity){if(!world||!entity)return null;const list=entity.kind==='block'?(world.blocks||[]):(world.objects||[]),id=String(entity.record.id),record=list.find(x=>String(x.id)===id);return record?{kind:entity.kind,record}:null}
function verifyExpected(world,expected){
  if(expected===null)return true;
  const current=currentEntity(world,expected);
  return !!current&&same(current,expected);
}
function verifyAbsent(world,entity){return !currentEntity(world,entity)}
function replaceEntity(world,entity){if(!world||!entity)return false;const list=entity.kind==='block'?(world.blocks||(world.blocks=[])):(world.objects||(world.objects=[]));const id=String(entity.record.id),i=list.findIndex(x=>String(x.id)===id);if(i>=0)list[i]=clone(entity.record);else list.push(clone(entity.record));return true}
function deleteEntity(world,entity){if(!world||!entity)return false;const list=entity.kind==='block'?(world.blocks||[]):(world.objects||[]),id=String(entity.record.id),i=list.findIndex(x=>String(x.id)===id);if(i<0)return false;list.splice(i,1);return true}
function conflict(reason){lastConflict=reason;syncButtons();console.warn('[AG] build history conflict:',reason);return false}
function applyChange(change,direction){
  forceSave();const world=readWorld();if(!world)return conflict('world-save-missing');
  const target=direction==='undo'?change.before:change.after;
  const expected=direction==='undo'?change.after:change.before;
  if(expected===null){const probe=target;if(probe&&!verifyAbsent(world,probe))return conflict('entity-already-exists')}
  else if(!verifyExpected(world,expected))return conflict('entity-state-changed');
  let ok=false;
  if(target===null)ok=deleteEntity(world,expected);else ok=replaceEntity(world,target);
  if(!ok)return conflict('apply-failed');
  world.savedAt=Date.now();writeWorld(world);lastConflict='';return true;
}
function reloadAfterApply(){location.reload()}
function undo(){if(applying||!stacks.undo.length)return false;applying=true;const c=stacks.undo.pop();if(!applyChange(c,'undo')){stacks.undo.push(c);applying=false;syncButtons();return false}stacks.redo.push(c);saveStacks();reloadAfterApply();return true}
function redo(){if(applying||!stacks.redo.length)return false;applying=true;const c=stacks.redo.pop();if(!applyChange(c,'redo')){stacks.redo.push(c);applying=false;syncButtons();return false}stacks.undo.push(c);saveStacks();reloadAfterApply();return true}

function trackedInvoke(original,name){
  if(applying||!['add','del','rot'].includes(name))return original(name);
  forceSave();const before=readWorld();const result=original(name);forceSave();const after=readWorld();const change=diffWorld(before,after);if(change)push(change);return result;
}
function installBridge(){
  const bridge=globalThis.__AGCB_GAME_ACTIONS;if(!bridge?.invoke||bridge.__historyWrapped)return false;
  const original=bridge.invoke.bind(bridge);bridge.invoke=name=>trackedInvoke(original,name);bridge.__historyWrapped=true;
  for(const id of ['add','del','rot']){const el=document.getElementById(id);if(el)el.onclick=()=>bridge.invoke(id)}
  return true;
}
function installUI(){
  if(document.getElementById('agBuildHistory'))return;
  const style=document.createElement('style');style.textContent='#agBuildHistory{position:fixed;z-index:86;right:max(10px,env(safe-area-inset-right));bottom:max(118px,calc(env(safe-area-inset-bottom) + 108px));display:flex;gap:6px;pointer-events:auto}#agBuildHistory button{width:42px;height:36px;border:0;border-radius:12px;background:#fffde8e8;box-shadow:0 2px 8px #0002;font-size:19px;font-weight:900;color:#42565c;touch-action:manipulation}#agBuildHistory button:disabled{opacity:.32}@media(max-height:430px){#agBuildHistory{bottom:max(96px,calc(env(safe-area-inset-bottom) + 88px))}#agBuildHistory button{width:38px;height:32px;font-size:17px}}';document.head.appendChild(style);
  const box=document.createElement('div');box.id='agBuildHistory';box.innerHTML='<button id="agUndo" type="button" aria-label="復原上一步建造">↶</button><button id="agRedo" type="button" aria-label="重做上一步建造">↷</button>';document.body.appendChild(box);document.getElementById('agUndo').onclick=undo;document.getElementById('agRedo').onclick=redo;syncButtons();
}
function syncButtons(){const u=document.getElementById('agUndo'),r=document.getElementById('agRedo');if(u)u.disabled=!stacks.undo.length;if(r)r.disabled=!stacks.redo.length}

installUI();let tries=0;const timer=setInterval(()=>{if(installBridge()||++tries>30)clearInterval(timer)},100);installBridge();
addEventListener('keydown',e=>{if(!(e.metaKey||e.ctrlKey)||e.key.toLowerCase()!=='z')return;e.preventDefault();e.shiftKey?redo():undo()});
globalThis.__AGCB_BUILD_HISTORY={version:VERSION,status:'CONFLICT_SAFE_BUILD_ONLY',maxHistory:MAX_HISTORY,safeObjectTypes:[...SAFE_OBJECT_TYPES],undo,redo,get undoCount(){return stacks.undo.length},get redoCount(){return stacks.redo.length},get lastConflict(){return lastConflict}};
