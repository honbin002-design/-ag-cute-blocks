import fs from 'node:fs/promises';
const src=new URL('./build-v0509-source.mjs',import.meta.url);
let s=await fs.readFile(src,'utf8');
function swap(from,to,label){if(!s.includes(from))throw new Error('V0.5.10 wrapper anchor missing: '+label);s=s.replace(from,to)}
s=s.replaceAll('Candidate_016','Candidate_017').replaceAll('candidate-016','candidate-017').replaceAll('0.5.09','0.5.10').replaceAll('V0509','V0510').replaceAll('v0509','v0510').replaceAll('SOURCE_LEVEL_LOWER_BODY_CONTOUR_V0509','SOURCE_LEVEL_LOWER_BODY_CONVERGENCE_V0510');
// Move the waistband upward into the blouse hem and make it narrow enough to read as a seam, not a ledge.
swap("[[.150,.745],[.157,.730],[.158,.710],[.154,.695]]","[[.138,.795],[.142,.790],[.142,.780],[.138,.775]]","hidden waistband profile");
swap("g.scale(1,1,.70);bind('trouser-waist-shell'","g.scale(1,1,.65);bind('trouser-waist-shell'","hidden waistband depth");
// Stronger anatomical trouser silhouette: ankle -> calf -> knee -> thigh -> crotch, raised to meet the blouse seam.
swap("[[.045,.075],[.049,.16],[.054,.28],[.057,.37],[.060,.45],[.069,.56],[.079,.66],[.084,.715]]","[[.044,.075],[.050,.16],[.055,.28],[.050,.38],[.057,.45],[.069,.56],[.078,.68],[.082,.782]]","leg contour");
swap("g.scale(1,1,.78);g.translate(x,0,0);","g.scale(1,1,.74);g.translate(x,0,0);","leg depth");
swap("const side=s<0?'l':'r',x=s*.090","const side=s<0?'l':'r',x=s*.080","upper-leg convergence");
swap("h=T.MathUtils.smoothstep(p.y,.57,.70)","h=T.MathUtils.smoothstep(p.y,.60,.76)","upper-leg hip weighting");
s=s.replace("'V0.5.09 preserves the accepted face, hair and upper-body direction while rebuilding only the lower body.'","'V0.5.10 keeps the accepted face, hair, arms and animation unchanged while converging the lower-body silhouette.','The former visible waistband is raised and tucked into the blouse hem so it reads only as a seam.','Each trouser leg has a stronger calf-knee-thigh contour, a higher adult leg line, and upper thighs that converge naturally at the crotch.'");
const generated=new URL('./.generated-v0510-wrapper.mjs',import.meta.url);await fs.writeFile(generated,s);try{await import(generated.href+'?v='+Date.now())}finally{await fs.rm(generated,{force:true})}
