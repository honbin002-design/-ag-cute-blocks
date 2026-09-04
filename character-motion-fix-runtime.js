import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// V0.4.90: external-rig locomotion correction retained from V0.4.78.
const VERSION='V0.4.90';
const originalUpdate=THREE.AnimationMixer.prototype.update;
if(!THREE.AnimationMixer.prototype.__agcbMotionFixV478){
  THREE.AnimationMixer.prototype.update=function(delta){
    const result=originalUpdate.call(this,delta);
    const root=this.getRoot?.();
    const visual=root?.parent,group=visual?.parent,u=group?.userData;
    if(!u?.assetWalkBones||!['boy','girl'].includes(u.assetVariant))return result;
    const moving=u.assetAction&&(u.assetAction===u.assetActions?.walk||u.assetAction===u.assetActions?.run);
    const phase=u.assetWalkPhase||0;
    const run=u.assetAction===u.assetActions?.run;
    const amp=moving?(run?.48:.39):.012;
    const swing=Math.sin(phase)*amp;
    const b=u.assetWalkBones;
    const add=(bone,x,z=0)=>{if(!bone)return;bone.rotation.x+=x;bone.rotation.z+=z};
    add(b.upperL,swing,swing*.11);add(b.lowerL,swing*.30,swing*.04);add(b.handL,swing*.09,swing*.02);
    add(b.upperR,-swing,-swing*.11);add(b.lowerR,-swing*.30,-swing*.04);add(b.handR,-swing*.09,-swing*.02);
    return result;
  };
  THREE.AnimationMixer.prototype.__agcbMotionFixV478=true;
}

const priorSetMotion=globalThis.__AGCB_ASSET_SET_MOTION;
if(priorSetMotion&&!priorSetMotion.__agcbMotionFixV478){
  const fixed=(group,state='idle')=>{
    const runPressed=document.querySelector('#runToggle')?.getAttribute('aria-pressed')==='true';
    const routed=state==='walk'&&runPressed?'run':state;
    priorSetMotion(group,routed);
    const u=group?.userData,action=u?.assetAction;
    if(action){
      if(routed==='walk')action.setEffectiveTimeScale(1.48);
      else if(routed==='run')action.setEffectiveTimeScale(1.18);
    }
  };
  fixed.__agcbMotionFixV478=true;
  globalThis.__AGCB_ASSET_SET_MOTION=fixed;
}

const badge=document.querySelector('.title small');if(badge)badge.textContent=VERSION;
const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.content=VERSION;
const note=document.querySelector('.note');if(note)note.textContent=note.textContent.replace(/^V0\.4\.\d+：/,`${VERSION}：`);
globalThis.__AGCB_CHARACTER_MOTION_FIX={version:VERSION,postMixerArmSwing:true,runClipRouting:true};
