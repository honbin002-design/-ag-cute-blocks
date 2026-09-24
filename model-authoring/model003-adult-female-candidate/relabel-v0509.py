from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
OUT=Path('output');font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
angles=[0,45,90,135,180,225,270,315]
def convert(src,dst,state,angle):
 im=Image.open(src).convert('RGB');d=ImageDraw.Draw(im);d.rectangle((0,0,660,48),fill=(230,235,240));d.text((24,18),f'MODEL003 ADULT FEMALE CANDIDATE 016 | {state.upper()} | {angle} DEG | V0.5.09',fill='#294359',font=font);im.save(dst);return im
shots=[]
for a in angles:shots.append(convert(OUT/f'adult-female-candidate-003-rest-{a}.png',OUT/f'adult-female-candidate-016-rest-{a}.png','rest',a))
sheet=Image.new('RGB',(2640,1760))
for i,im in enumerate(shots):sheet.paste(im,((i%4)*660,(i//4)*880))
sheet.save(OUT/'adult-female-candidate-016-eight-view.png')
convert(OUT/'adult-female-candidate-003-walk-45.png',OUT/'adult-female-candidate-016-walk-45.png','walk',45)
convert(OUT/'adult-female-candidate-003-joint-45-base.png',OUT/'adult-female-candidate-016-joint-45-base.png','joint',45)
