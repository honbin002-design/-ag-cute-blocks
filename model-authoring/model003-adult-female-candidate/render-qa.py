import json,math,pathlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
OUT=pathlib.Path('output')
def render(state,angle):
 W,H=660,880;ms=json.loads((OUT/f'qa-{state}.json').read_text());zbuf=np.full((H,W),np.inf);rgb=np.zeros((H,W,3),np.float32);rgb[:]=[.9,.92,.94];a=math.radians(angle);rot=np.array([[math.cos(a),0,-math.sin(a)],[0,1,0],[math.sin(a),0,math.cos(a)]]);light=np.array([-.5,.8,-.65]);light/=np.linalg.norm(light)
 for m in ms:
  v=np.asarray(m['positions'],dtype=np.float64).reshape(-1,3)@rot.T;f=np.asarray(m['indices'],dtype=np.int64).reshape(-1,3);norm=np.zeros_like(v);cr=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
  for k in range(3):np.add.at(norm,f[:,k],cr)
  norm/=np.maximum(np.linalg.norm(norm,axis=1)[:,None],1e-10);scr=np.stack([v[:,0]*385+W/2,H-62-v[:,1]*385,v[:,2]],axis=1);col=np.asarray(m['color'],dtype=np.float64);lum=.48+.49*np.maximum(0,norm@light)
  for ids in f:
   t=scr[ids];x0=max(0,int(np.floor(t[:,0].min())));x1=min(W-1,int(np.ceil(t[:,0].max())));y0=max(0,int(np.floor(t[:,1].min())));y1=min(H-1,int(np.ceil(t[:,1].max())));ax,ay=t[0,:2];bx,by=t[1,:2];cx,cy=t[2,:2];den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy)
   if x0>x1 or y0>y1 or den<=1e-8:continue
   yy,xx=np.mgrid[y0:y1+1,x0:x1+1];xx=xx.astype(np.float64)+.5;yy=yy.astype(np.float64)+.5;u=((by-cy)*(xx-cx)+(cx-bx)*(yy-cy))/den;vv=((cy-ay)*(xx-cx)+(ax-cx)*(yy-cy))/den;w=1-u-vv;dep=u*t[0,2]+vv*t[1,2]+w*t[2,2];buf=zbuf[y0:y1+1,x0:x1+1];mask=(u>=0)&(vv>=0)&(w>=0)&(dep<buf)
   if mask.any():buf[mask]=dep[mask];L=u*lum[ids[0]]+vv*lum[ids[1]]+w*lum[ids[2]];patch=rgb[y0:y1+1,x0:x1+1];patch[mask]=np.clip(L[mask,None]*col,0,1)
 im=Image.fromarray((rgb*255).astype('uint8'));d=ImageDraw.Draw(im);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17);d.text((22,18),f'MODEL003 ADULT FEMALE CANDIDATE 001 | {angle} DEG | V0.4.94',fill='#294359',font=font);p=OUT/f'adult-female-candidate-rest-{angle}.png';im.save(p);return im
shots=[render('rest',a) for a in [0,45,90,135,180,225,270,315]];sheet=Image.new('RGB',(2640,1760));[sheet.paste(im,((i%4)*660,(i//4)*880)) for i,im in enumerate(shots)];sheet.save(OUT/'adult-female-candidate-001-eight-view.png')