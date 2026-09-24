from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
OUT=Path('output')
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
for src in sorted(OUT.glob('adult-female-candidate-003-*.png')):
    im=Image.open(src).convert('RGB')
    d=ImageDraw.Draw(im)
    d.rectangle((0,0,660,48),fill=(230,235,240))
    tail=src.stem.replace('adult-female-candidate-003-','')
    parts=tail.split('-')
    state=parts[0].upper(); angle=parts[1] if len(parts)>1 else '0'
    d.text((24,18),f'MODEL003 ADULT FEMALE CANDIDATE 004 | {state} | {angle} DEG | V0.4.97',fill='#294359',font=font)
    dst=OUT/src.name.replace('candidate-003','candidate-004')
    im.save(dst)
    print(dst,flush=True)
