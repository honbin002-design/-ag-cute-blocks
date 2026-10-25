import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const read=p=>fs.readFileSync(p,'utf8');
const index=read('index.html'),boot=read('bootstrap-v0510.js');
const version=boot.match(/const release='V([^']+)'/)[1];
assert(index.includes(`content="V${version}"`));
assert(index.includes(`bootstrap-v0510.js?v=${version}`));
assert(boot.includes(`version:'${version}'`));
assert(boot.includes("runtimeEnvironment:'PROD'"));
assert(boot.includes("saveNamespace:'agcb_prod_v1_'"));
assert(!index.includes('src="./service-worker-register.js'));
assert(index.includes('agcb-v0501-sw-retire'));
assert(!index.match(/option value="(?:boy|girl|special)"/));
const graph=new Set();
function visit(file){
  if(graph.has(file))return;graph.add(file);
  assert(fs.existsSync(file),`Missing active dependency: ${file}`);
  if(!file.endsWith('.js'))return;
  for(const m of read(file).matchAll(/(?:from\s*|import\s*\(?\s*|new URL\(\s*)['"](\.\.?\/[^'"]+\.js(?:\?[^'"]*)?)['"]/g)){
    visit(path.normalize(path.join(path.dirname(file),m[1].split('?')[0])));
  }
}
visit('app-v0510.js');
for(const m of boot.matchAll(/['"](\.\/[^'"]+\.js(?:\?[^'"]*)?)['"]/g))visit(m[1].split('?')[0]);
for(const [base,count,size] of [
  ['assets/characters/formal/character3-v101.glb.part',16,15321932],
  ['assets/characters/special2/model.b64.',9,48368084],
  ['assets/characters/special5/model.v094.glb.part',14,39650000]
]){
  let total=0;for(let i=0;i<count;i++)total+=fs.statSync(base+String(i).padStart(3,'0')).size;
  assert.equal(total,size,base);
}
const boy=fs.readFileSync('assets/characters/formal/boy005.glb');
assert.equal(boy.readUInt32LE(0),0x46546c67);assert.equal(boy.readUInt32LE(8),boy.length);
const integration=read('test-character-game-integration.js');
assert(integration.includes("STORAGE_KEY='agcb_prod_v1_character_selection'"));
for(const role of ['ual3','boy005','special2','special5'])assert(integration.includes(`'${role}'`));
assert(read('special-character-assets-runtime.js').includes('Object.freeze({...rt.characters,...SPECIAL})'));
assert(!boot.includes('AGCB_BRIDGE_TOKEN'));
console.log(`PASS V${version}: ${graph.size} active dependencies, exact asset sizes, selector and PROD namespace`);
