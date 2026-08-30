// Lightweight screen-space weather for the mobile build. It is intentionally visual-only:
// world rules remain in the existing season/weather systems, while this layer follows the same UI state.
const SETTINGS_KEY='ag_cute_blocks_settings_v03';
const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none'});
const hud=document.querySelector('.hud');hud?.parentNode?.insertBefore(canvas,hud);const ctx=canvas.getContext('2d',{alpha:true});
const particles=[];let w=1,h=1,lastWeather='',frame=0,nextFlashAt=0,flashUntil=0;
function resize(){w=Math.max(1,visualViewport?.width||innerWidth);h=Math.max(1,visualViewport?.height||innerHeight);canvas.width=Math.round(w);canvas.height=Math.round(h)}
addEventListener('resize',resize);visualViewport?.addEventListener('resize',resize);resize();
function savedWeather(){try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}').weather||''}catch{return ''}}
function weather(){return document.querySelector('#weather')?.value||savedWeather()||'sunny'}
function tier(){return globalThis.__AGCB_PERF_TIER||'normal'}
function installThunderstormOption(){const select=document.querySelector('#weather');if(!select)return;if(!select.querySelector('option[value="thunderstorm"]')){const o=document.createElement('option');o.value='thunderstorm';o.textContent='⛈️ 雷雨';const rain=select.querySelector('option[value="rain"]');rain?.after(o);if(!rain)select.appendChild(o)}const saved=savedWeather();if(saved==='thunderstorm'&&!select.value)select.value=saved}
installThunderstormOption();
function targetCount(kind,q){
  if(kind==='rain')return q==='high'?105:q==='low'?48:76;
  if(kind==='thunderstorm')return q==='high'?128:q==='low'?58:92;
  if(kind==='snow')return q==='high'?72:q==='low'?34:52;return 0
}
function seed(kind){const wet=kind==='rain'||kind==='thunderstorm';return{x:Math.random()*w,y:Math.random()*h,v:wet?8+Math.random()*8:.35+Math.random()*.8,drift:-.25+Math.random()*.5,size:wet?9+Math.random()*9:1.5+Math.random()*2.8,phase:Math.random()*6.28}}
function ensure(kind,count){while(particles.length<count)particles.push(seed(kind));if(particles.length>count)particles.length=count}
function drawFog(now,kind){
  const storm=kind==='thunderstorm',strength=kind==='fog'?.12:storm?.11:.045;ctx.fillStyle=storm?`rgba(66,78,96,${strength})`:`rgba(235,245,245,${strength})`;ctx.fillRect(0,0,w,h);
  const x=(Math.sin(now*.00008)*.5+.5)*w;const grad=ctx.createRadialGradient(x,h*.46,0,x,h*.46,w*.58);grad.addColorStop(0,storm?'rgba(130,145,170,.08)':`rgba(255,255,255,${kind==='fog'?.09:.035})`);grad.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
}
function drawParticles(kind,q){
  const count=targetCount(kind,q);ensure(kind,count);ctx.lineCap='round';const storm=kind==='thunderstorm';
  for(const p of particles){
    if(kind==='rain'||storm){
      p.x-=storm?2.7:1.8;p.y+=p.v*(storm?1.12:1);if(p.y>h+24||p.x<-28){p.x=Math.random()*w+28;p.y=-20-Math.random()*h*.18}
      ctx.strokeStyle=storm?'rgba(206,226,255,.62)':'rgba(205,235,255,.52)';ctx.lineWidth=storm?1.35:1.15;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+(storm?3.4:2.4),p.y-p.size*(storm?1.08:1));ctx.stroke();
    }else{
      p.phase+=.018;p.x+=Math.sin(p.phase)*.22+p.drift;p.y+=p.v;if(p.y>h+8){p.x=Math.random()*w;p.y=-8}
      if(p.x<-8)p.x=w+8;if(p.x>w+8)p.x=-8;ctx.fillStyle='rgba(255,255,255,.82)';ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
    }
  }
}
function scheduleFlash(now,q){
  if(!nextFlashAt)nextFlashAt=now+3500+Math.random()*5200;if(now<nextFlashAt)return;
  flashUntil=now+(q==='low'?70:105);nextFlashAt=now+4200+Math.random()*7200;
}
function drawLightning(now,q){
  scheduleFlash(now,q);if(now>flashUntil)return;
  const age=Math.max(0,flashUntil-now),alpha=Math.min(.22,age/(q==='low'?70:105)*.22);ctx.fillStyle=`rgba(235,244,255,${alpha})`;ctx.fillRect(0,0,w,h);
  if(q==='low')return;
  const x=w*(.2+Math.random()*.6),y=h*.08;ctx.strokeStyle=`rgba(245,250,255,${Math.min(.7,alpha*3)})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-12,h*.18);ctx.lineTo(x+4,h*.26);ctx.lineTo(x-9,h*.34);ctx.stroke();
}
function loop(now){
  requestAnimationFrame(loop);frame++;const kind=weather(),q=tier();if(q==='low'&&frame%2)return;if(kind!==lastWeather){particles.length=0;lastWeather=kind;nextFlashAt=0;flashUntil=0}ctx.clearRect(0,0,w,h);
  if(kind==='sunny')return;
  if(kind==='cloudy'||kind==='fog')drawFog(now,kind);
  if(kind==='rain'){drawFog(now,'cloudy');drawParticles('rain',q)}
  if(kind==='thunderstorm'){drawFog(now,'thunderstorm');drawParticles('thunderstorm',q);drawLightning(now,q)}
  if(kind==='snow'){drawFog(now,'cloudy');drawParticles('snow',q)}
}
requestAnimationFrame(loop);
globalThis.__AGCB_WEATHER_VISUAL={canvas,get weather(){return weather()},get quality(){return tier()},installThunderstormOption};
