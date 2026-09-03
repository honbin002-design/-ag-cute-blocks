'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const app = fs.readFileSync(path.join(__dirname, '..', 'app-v043.js'), 'utf8');
assert.match(app, /const JUMP_VELOCITY=\.22,GRAVITY=\.009,PLAYER_RADIUS=\.30/);
assert.match(app, /function supportHeightAt\(x,z\)/);
assert.match(app, /collisionPoint\.set\(x,player\.position\.y\+1,z\)/);
assert.match(app, /supportY=supportHeightAt\(player\.position\.x,player\.position\.z\)/);
const jumpVelocity=.22, gravity=.009, blockTop=1;
let y=0, vy=jumpVelocity, peak=0, landed=false;
for(let frame=0;frame<240;frame++){
  const previousY=y, wasFalling=vy<=0;
  vy-=gravity;
  const nextY=previousY+vy;
  peak=Math.max(peak,nextY);
  if(wasFalling&&previousY>=blockTop-.02&&nextY<=blockTop){y=blockTop;vy=0;landed=true;break}
  if(nextY<=0){y=0;vy=0;break}
  y=nextY;
}
assert.ok(peak>2.4, `jump peak too low: ${peak}`);
assert.equal(landed,true,'jump must land on a one-block platform');
assert.equal(y,blockTop);
console.log(`PASS jump: peak ${peak.toFixed(3)}; one-block platform landing supported.`);
