// AG Cute Blocks V0.5.186 — isolated character runtime integration adapter
// TEST branch only. Does not modify input, physics, camera, building or life systems.

export const AGCB_CHARACTER_INTEGRATION_VERSION='V0.5.186';

export const CHARACTER_STATES=Object.freeze({
  IDLE:'Idle',
  WALK:'Walk',
  JOG:'Jog',
  JUMP:'Jump'
});

const DEFAULTS=Object.freeze({
  walkThreshold:0.025,
  jogThreshold:0.58,
  jumpVerticalThreshold:0.02,
  fadeSeconds:0.14
});

export function resolveCharacterState({moving=false,speed01=0,grounded=true,verticalVelocity=0,runEnabled=false}={}){
  if(!grounded || verticalVelocity>DEFAULTS.jumpVerticalThreshold) return CHARACTER_STATES.JUMP;
  if(!moving || speed01<DEFAULTS.walkThreshold) return CHARACTER_STATES.IDLE;
  if(runEnabled || speed01>=DEFAULTS.jogThreshold) return CHARACTER_STATES.JOG;
  return CHARACTER_STATES.WALK;
}

function findClip(clips,state){
  const wanted=String(state).toLowerCase();
  return clips.find(c=>String(c?.name||'').toLowerCase()===wanted)
    || clips.find(c=>String(c?.name||'').toLowerCase().includes(wanted))
    || null;
}

export function createCharacterAnimationAdapter({THREE,root,clips=[],fallback=null,fadeSeconds=DEFAULTS.fadeSeconds}={}){
  if(!THREE || !root || !Array.isArray(clips) || clips.length===0){
    return {
      mode:'fallback',
      state:CHARACTER_STATES.IDLE,
      setState:(state)=>{ if(fallback?.setState) fallback.setState(state); },
      update:(dt)=>{ if(fallback?.update) fallback.update(dt); },
      dispose:()=>{ if(fallback?.dispose) fallback.dispose(); }
    };
  }

  const mixer=new THREE.AnimationMixer(root);
  const actions=new Map();
  for(const state of Object.values(CHARACTER_STATES)){
    const clip=findClip(clips,state);
    if(clip) actions.set(state,mixer.clipAction(clip));
  }

  let currentState=null;
  let currentAction=null;
  const setState=(nextState)=>{
    const state=actions.has(nextState)?nextState:CHARACTER_STATES.IDLE;
    if(state===currentState) return;
    const next=actions.get(state);
    if(!next){ if(fallback?.setState) fallback.setState(nextState); return; }
    next.enabled=true;
    next.reset();
    next.setEffectiveTimeScale(1);
    next.setEffectiveWeight(1);
    if(state===CHARACTER_STATES.JUMP){
      next.setLoop(THREE.LoopOnce,1);
      next.clampWhenFinished=true;
    }else{
      next.setLoop(THREE.LoopRepeat,Infinity);
      next.clampWhenFinished=false;
    }
    if(currentAction && currentAction!==next) currentAction.crossFadeTo(next,fadeSeconds,false);
    next.play();
    currentAction=next;
    currentState=state;
  };

  setState(CHARACTER_STATES.IDLE);
  return {
    mode:'gltf',
    get state(){return currentState;},
    setState,
    update:(dt)=>mixer.update(Math.max(0,Number(dt)||0)),
    dispose:()=>{mixer.stopAllAction();mixer.uncacheRoot(root);}
  };
}

export function updateCharacterAdapter(adapter,motion,dt){
  if(!adapter) return CHARACTER_STATES.IDLE;
  const state=resolveCharacterState(motion);
  adapter.setState(state);
  adapter.update(dt);
  return state;
}
