// Adult-female visual refinement v1.
// Conservative whole-character correction after face/body/full-silhouette passes.
// It preserves authored facial parts and only tightens the adult overall read.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function mulScale(o,x=1,y=1,z=1){if(!o)return false;o.scale.x*=x;o.scale.y*=y;o.scale.z*=z;return true;}

function refineAdultFemaleVisual(character){
  const visual=character?.userData?.visual;
  const face=character?.userData?.face;
  const hair=character?.userData?.hair;
  if(!visual||!face||!hair)return character;
  const get=n=>visual.getObjectByName(n);

  const head=get('agcb-head'),neck=get('agcb-neck'),chest=get('agcb-chest'),spine=get('agcb-spine'),hips=get('agcb-hips');
  const thighL=get('agcb-thigh-l'),thighR=get('agcb-thigh-r');
  const shinL=get('agcb-shin-l'),shinR=get('agcb-shin-r');

  // Adult read: a tiny extra head reduction, cleaner neck/shoulder rhythm,
  // and a slightly clearer waist-to-hip transition. Values are intentionally small.
  mulScale(head,.982,.988,.988);
  mulScale(neck,.985,1.012,.985);
  mulScale(chest,1.012,1.004,1.008);
  mulScale(spine,.985,1.008,.990);
  mulScale(hips,1.012,1.004,1.010);

  // Keep the lower body long and light rather than childlike/compact.
  for(const o of[thighL,thighR])mulScale(o,.985,1.010,.990);
  for(const o of[shinL,shinR])mulScale(o,.988,1.008,.992);

  // Hair should frame the face/body instead of widening the silhouette.
  for(const name of['agcb-adult-female-side-lock-l-v1','agcb-adult-female-side-lock-r-v1']){
    const o=hair.getObjectByName(name);if(o)o.position.x+=name.includes('-l-')?.006:-.006;
  }
  for(const name of['agcb-adult-female-back-lock-l-v1','agcb-adult-female-back-lock-r-v1']){
    const o=hair.getObjectByName(name);if(o){o.position.x+=name.includes('-l-')?.008:-.008;o.scale.x*=.985;}
  }
  const crown=hair.getObjectByName('agcb-adult-female-hair-crown-v1');
  if(crown){crown.scale.x*=.985;crown.scale.y*=1.006;}

  character.userData.adultFemaleVisualGeometry='adult-female-refined-visual-v1';
  character.userData.adultFemaleVisualFit={head:[.982,.988,.988],neckY:1.012,chestX:1.012,waistX:.985,hipX:1.012,legY:[1.010,1.008],hairInward:true};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?refineAdultFemaleVisual(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_VISUAL_REFINEMENT={version:1,scope:'adult-female-visual-refinement-only',geometry:'refined-visual-v1',loaded:true};
