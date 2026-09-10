import fs from 'node:fs/promises';
const src=new URL('./build-v0506-source.mjs',import.meta.url);
let s=await fs.readFile(src,'utf8');
s=s.replaceAll('Candidate_013','Candidate_014').replaceAll('candidate-013','candidate-014').replaceAll('0.5.06','0.5.07').replaceAll('V0506','V0507').replaceAll('v0506','v0507');
const generated=new URL('./.generated-v0507-wrapper.mjs',import.meta.url);await fs.writeFile(generated,s);try{await import(generated.href+'?v='+Date.now())}finally{await fs.rm(generated,{force:true})}
