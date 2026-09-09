// Adult-female candidate route built on the existing Special 3 GLB base.
// Keeps the original Special 3 option intact; this mode only coordinates the UI
// and applies an adult-sized, non-gold visual treatment after the asset loads.
const KEY='agcb_adult_female_special3_candidate_v1';
const avatar=document.querySelector('#avatar');
const age=document.querySelector('#avatarAge');
const body=document.querySelector('#avatarBody');

function active(){return localStorage.getItem(KEY)==='1';}
function setActive(v){if(v)localStorage.setItem(KEY,'1');else localStorage.removeItem(KEY);}
function repaintCandidate(){
  if(!active())return;
  for(const group of globalThis.__AGCB_LIVE_AVATARS||[]){
    const u=group?.userData;
    if(u?.assetVariant!=='special3'||u?.assetAge!=='adult'||!u.assetRoot)continue;
    if(u.assetRoot.userData?.adultFemaleSpecial3CandidateApplied)return;
    u.assetRoot.traverse(o=>{
      if(!o.isMesh)return;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      for(const m of mats){
        if(!m?.color)continue;
        const label=(o.name+' '+(m.name||'')).toLowerCase();
        // Restore mapped materials from the blanket Special 3 gold tint; for
        // untextured materials use the adult-female prototype palette as a safe first pass.
        if(m.map)m.color.setHex(0xffffff);
        else if(/hair|bang|pony|fringe/.test(label))m.color.setHex(0x68483b);
        else if(/skin|face|head|body|hand|arm|leg/.test(label))m.color.setHex(0xf2c5a5);
        else if(/shoe|boot|sole/.test(label))m.color.setHex(0x6f5b62);
        else if(/dress|cloth|shirt|skirt|top|sleeve/.test(label))m.color.setHex(0xd8899e);
        else m.color.setHex(0xf4e4d5);
        if('metalness'in m)m.metalness=Math.min(.06,m.metalness||0);
        if('roughness'in m)m.roughness=Math.max(.68,m.roughness||.76);
        m.needsUpdate=true;
      }
    });
    u.assetRoot.userData.adultFemaleSpecial3CandidateApplied=true;
    u.adultFemaleCandidateBase='special3-glb';
    u.adultFemaleCandidateRevision='v1';
  }
}

if(avatar){
  const original=avatar.onchange;
  const option=document.createElement('option');
  option.value='adultFemaleCandidate';
  option.textContent='👩 成年女性候選';
  avatar.appendChild(option);
  avatar.onchange=e=>{
    if(e.target.value!=='adultFemaleCandidate'){
      setActive(false);
      return original?.call(avatar,e);
    }
    setActive(true);
    // Reuse the exact tested Special 3 asset path, then switch only its age/body
    // customization to adult proportions. No second GLB is introduced.
    avatar.value='special3';
    original?.call(avatar,{...e,target:avatar});
    setTimeout(()=>{
      if(age){age.value='adult';age.onchange?.call(age,{target:age});}
      if(body&&[...body.options].some(o=>o.value==='default')){body.value='default';body.onchange?.call(body,{target:body});}
      avatar.value='adultFemaleCandidate';
      repaintCandidate();
    },0);
  };
  if(active())avatar.value='adultFemaleCandidate';
}

const timer=setInterval(repaintCandidate,250);
setTimeout(()=>clearInterval(timer),15000);
globalThis.__AGCB_ADULT_FEMALE_SPECIAL3_CANDIDATE={version:1,scope:'special3-glb-adult-female-candidate-only',base:'Meshy_AI_Meshy_Merged_Animations.glb',preservesOriginalSpecial3:true,loaded:true};
