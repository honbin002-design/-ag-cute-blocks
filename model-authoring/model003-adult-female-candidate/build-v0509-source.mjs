import fs from 'node:fs/promises';
const src=new URL('./build-v0508-source.mjs',import.meta.url);
let s=await fs.readFile(src,'utf8');
function swap(from,to,label){if(!s.includes(from))throw new Error('V0.5.09 wrapper anchor missing: '+label);s=s.replace(from,to)}
s=s.replaceAll('Candidate_015','Candidate_016').replaceAll('candidate-015','candidate-016').replaceAll('0.5.08','0.5.09').replaceAll('V0508','V0509').replaceAll('v0508','v0509').replaceAll('SOURCE_LEVEL_BODY_CLEANUP_V0508','SOURCE_LEVEL_LOWER_BODY_CONTOUR_V0509');
// Turn the broad hip shell into only a narrow waistband.
swap("[[.158,.77],[.163,.73],[.159,.69],[.149,.64]]","[[.150,.745],[.157,.730],[.158,.710],[.154,.695]]","waist profile");
swap("g.scale(1,1,.69);bind('trouser-waist-shell'","g.scale(1,1,.70);bind('trouser-waist-shell'","waist depth");
// Replace the straight cylinder replacement in V0.5.08 with a source-level lathed leg profile.
const oldLeg="const g=new T.CylinderGeometry(.071,.045,.55,36,10,false);g.translate(x,.335,0);const a=g.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i),t=T.MathUtils.clamp((y-.06)/.55,0,1),knee=1-.075*Math.exp(-Math.pow((t-.43)/.19,2));a.setX(i,x+(a.getX(i)-x)*knee);a.setZ(i,a.getZ(i)*knee)}a.needsUpdate=true;";
const newLeg="const lp=[[.045,.075],[.049,.16],[.054,.28],[.057,.37],[.060,.45],[.069,.56],[.079,.66],[.084,.715]];const g=new T.LatheGeometry(lp.map(([r,y])=>new T.Vector2(r,y)),48);g.scale(1,1,.78);g.translate(x,0,0);";
swap(oldLeg,newLeg,'lathed leg geometry');
swap("const side=s<0?'l':'r',x=s*.104","const side=s<0?'l':'r',x=s*.090","upper-leg spacing");
swap("const k=T.MathUtils.smoothstep(p.y,.30,.44),h=T.MathUtils.smoothstep(p.y,.53,.63)","const k=T.MathUtils.smoothstep(p.y,.31,.45),h=T.MathUtils.smoothstep(p.y,.57,.70)","leg skin weights");
s=s.replace("'V0.5.08 preserves the accepted V0.5.06 face/hair direction while refining only body silhouette.'","'V0.5.09 preserves the accepted face, hair and upper-body direction while rebuilding only the lower body.','Each trouser leg now uses a continuous lathed thigh-knee-calf-ankle profile instead of a cylinder.','The broad pelvis shell is reduced to a narrow waistband and the upper legs meet naturally near the crotch.'");
const generated=new URL('./.generated-v0509-wrapper.mjs',import.meta.url);await fs.writeFile(generated,s);try{await import(generated.href+'?v='+Date.now())}finally{await fs.rm(generated,{force:true})}
