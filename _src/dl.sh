#!/bin/bash
# usage: dl.sh SLUG QUERYSTRING_WITHOUT_SIG  then lines "NN OBJ/NAME SIG" on stdin
slug=$1; Q=$2; B='https://prod-files-secure.s3.us-west-2.amazonaws.com/272d1c40-1203-44d0-8700-c788d96d1def'
d="$(cd "$(dirname "$0")/.." && pwd)/assets/g/$slug"; mkdir -p $d
while read n path sig; do [ -z "$n" ] && continue
  curl -s -o "$d/$n.src" --max-time 40 "$B/$path?$Q&X-Amz-Signature=$sig&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" -w "$n %{http_code} %{size_download}\n"
done
python3 - "$d" <<'PY'
import sys,glob,os
from PIL import Image
d=sys.argv[1]
for p in sorted(glob.glob(d+'/*.src')):
    try:
        im=Image.open(p)
        if getattr(im,'is_animated',False): im.seek(0)
        im=im.convert('RGB')
        if im.width>1400: im=im.resize((1400,round(im.height*1400/im.width)),Image.LANCZOS)
        im.save(p[:-4]+'.jpg',quality=84,optimize=True); os.remove(p)
    except Exception as e: print('ERR',p,e)
js=sorted(glob.glob(d+'/[0-9]*.jpg'))
if js and not os.path.exists(d+'/thumb.jpg'):
    im=Image.open(js[0]); s=min(im.size)
    im.crop(((im.width-s)//2,(im.height-s)//2,(im.width+s)//2,(im.height+s)//2)).resize((240,240),Image.LANCZOS).save(d+'/thumb.jpg',quality=85)
print('ok',len(js))
PY
