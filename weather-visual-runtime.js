// Lightweight screen-space weather for the mobile build. It is intentionally visual-only:
// world rules remain in the existing season/weather systems, while this layer follows the same UI state.
const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none'});
const hud=document.querySelector('.hud');hud?.parentNode?.insertBefore(canvas,hud);const ctx=canvas.getContext('2d',{alpha:true});
const particles=[];let w=1,h=1,lastWeather='',frame=0;
function resize(){w=Math.max(1,visualViewport?.width||innerWidth);h=Math.max(1,visualViewport?.height||innerHeight);canvas.width=Math.round(w);canvas.height=Math.round(h)}
addEventListener('resize',resize);visualViewport?.addEventListener('resize',resize);resize();
function weather(){return document.querySelector('#weather')?.value||'sunny'}
function tier(){return globalThis.__AGCB_PERF_TIER||'normal'}
function targetCount(kind,q){if(kind==='rain')return q==='high'?105:q==='low'?48:76;if(kind==='snow')return q==='high'?72:q==='low'?34:52;return 0}
function seed(kind){return{x:Math.random()*w,y:Math.random()*h,v:kind==='rain'?8+Math.random()*7:.35+Math.random()*.8,drift:-.25+Math.random()*.5,size:kind==='rain'?8+Math.random()*8:1.5+Math.random()*2.8,phase:Math.random()*6.28}}
function ensure(kind,count){while(particles.length<count)particles.push(seed(kind));if(particles.length>count)particles.length=count}
function drawFog(now,kind){
  const strength=kind==='fog'?.12:.045;ctx.fillStyle=`rgba(235,245,245,${strength})`;ctx.fillRect(0,0,w,h);
  const x=(Math.sin(now*.00008)*.5+.5)*w;const grad=ctx.createRadialGradient(x,h*.46,0,x,h*.46,w*.58);grad.addColorStop(0,`rgba(255,255,255,${kind==='fog'?.09:.035})`);grad.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
}
function drawParticles(kind,q){
  const count=targetCount(kind,q);ensure(kind,count);ctx.lineCap='round';
  for(const p of particles){
    if(kind==='rain'){
      p.x-=1.8;p.y+=p.v;if(p.y>h+20||p.x<-20){p.x=Math.random()*w+20;p.y=-20-Math.random()*h*.15}
      ctx.strokeStyle='rgba(205,235,255,.52)';ctx.lineWidth=1.15;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+2.4,p.y-p.size);ctx.stroke();
    }else{
      p.phase+=.018;p.x+=Math.sin(p.phase)*.22+p.drift;p.y+=p.v;if(p.y>h+8){p.x=Math.random()*w;p.y=-8}
      if(p.x<-8)p.x=w+8;if(p.x>w+8)p.x=-8;ctx.fillStyle='rgba(255,255,255,.82)';ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
    }
  }
}
function loop(now){
  requestAnimationFrame(loop);frame++;const kind=weather(),q=tier();if(q==='low'&&frame%2)return;if(kind!==lastWeather){particles.length=0;lastWeather=kind}ctx.clearRect(0,0,w,h);
  if(kind==='sunny')return;
  if(kind==='cloudy'||kind==='fog')drawFog(now,kind);
  if(kind==='rain'){drawFog(now,'cloudy');drawParticles('rain',q)}
  if(kind==='snow'){drawFog(now,'cloudy');drawParticles('snow',q)}
}
requestAnimationFrame(loop);
globalThis.__AGCB_WEATHER_VISUAL={canvas,get weather(){return weather()},get quality(){return tier()}};
