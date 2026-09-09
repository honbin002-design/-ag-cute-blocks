import json,math,pathlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
OUT=pathlib.Path('output')
def render(state,angle,base=False):
    W,H=660,880; meshes=json.loads((OUT/f'qa-{state}.json').read_text());zbuffer=np.full((H,W),np.inf);rgb=np.zeros((H,W,3),np.float32);rgb[:]=[.9,.92,.94]
    a=math.radians(angle);rot=np.array([[math.cos(a),0,-math.sin(a)],[0,1,0],[math.sin(a),0,math.cos(a)]])
    light=np.array([-.5,.8,-.65]);light/=np.linalg.norm(light)
    for mesh in meshes:
      if base and mesh['slot'] in ['top','bottom','shoes','accessory']:continue
      v=np.asarray(mesh['positions'],dtype=np.float64).reshape(-1,3)@rot.T;f=np.asarray(mesh['indices'],dtype=np.int64).reshape(-1,3);normals=np.zeros_like(v);cr=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
      for k in range(3):np.add.at(normals,f[:,k],cr)
      normals/=np.maximum(np.linalg.norm(normals,axis=1)[:,None],1e-10)
      screen=np.stack([v[:,0]*385+W/2, H-62-v[:,1]*385, v[:,2]],axis=1)
      col=np.asarray(mesh['color'],dtype=np.float64);lighting=.48+.49*np.maximum(0,normals@light);lighting+=.09*np.maximum(0,normals@np.array([.7,.2,.6]))
      for ids in f:
        t=screen[ids];x0=max(0,int(np.floor(t[:,0].min())));x1=min(W-1,int(np.ceil(t[:,0].max())));y0=max(0,int(np.floor(t[:,1].min())));y1=min(H-1,int(np.ceil(t[:,1].max())))
        if x0>x1 or y0>y1:continue
        ax,ay=t[0,:2];bx,by=t[1,:2];cx,cy=t[2,:2];den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy)
        if den<=1e-8:continue
        yy,xx=np.mgrid[y0:y1+1,x0:x1+1];xx=xx.astype(np.float64)+.5;yy=yy.astype(np.float64)+.5
        u=((by-cy)*(xx-cx)+(cx-bx)*(yy-cy))/den;vv=((cy-ay)*(xx-cx)+(ax-cx)*(yy-cy))/den;w=1-u-vv;depth=u*t[0,2]+vv*t[1,2]+w*t[2,2];buf=zbuffer[y0:y1+1,x0:x1+1];mask=(u>=0)&(vv>=0)&(w>=0)&(depth<buf)
        if not mask.any():continue
        buf[mask]=depth[mask];lum=u*lighting[ids[0]]+vv*lighting[ids[1]]+w*lighting[ids[2]];patch=rgb[y0:y1+1,x0:x1+1];patch[mask]=np.clip(lum[mask,None]*col,0,1)
    im=Image.fromarray((rgb*255).astype('uint8'));d=ImageDraw.Draw(im);d.text((24,18),f'MODEL003 ADULT FEMALE CANDIDATE 002 | {state.upper()} | {angle} DEG | V0.4.95',fill='#294359',font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18));d.text((24,H-27),'INDEPENDENT CANDIDATE / ACTUAL EXPORTED GLB / NOT GAME INTEGRATED',fill='#496071',font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13));p=OUT/f'adult-female-candidate-002-{state}-{angle}{"-base" if base else ""}.png';im.save(p);print(p,flush=True);return im
if __name__=='__main__':
    shots=[render('rest',a) for a in [0,45,90,135,180,225,270,315]]
    sheet=Image.new('RGB',(2640,1760))
    for i,im in enumerate(shots):sheet.paste(im,((i%4)*660,(i//4)*880))
    sheet.save(OUT/'adult-female-candidate-002-eight-view.png')
    render('walk',45);render('joint',45,True)
