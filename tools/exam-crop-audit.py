# -*- coding: utf-8 -*-
"""掃 img/exam 裁圖，找「內容被切到邊」的圖。
   邊界（最外 2 px）的墨色比例 f：
     f >= 0.85  → 多半是圖框本身貼齊邊，視為正常
     0.03 < f < 0.85 → 疑似把文字／線條裁斷，列出來人工複查"""
import os,subprocess,sys,json
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT=os.path.join(R,'img/exam')
BAND=2; DARK=150; LO=0.03; HI=0.85
def info(p):
    out=subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',p],capture_output=True,text=True).stdout
    d=json.loads(out)['streams'][0]; return d['width'],d['height']
def gray(p):
    return subprocess.run(['ffmpeg','-v','error','-i',p,'-f','rawvideo','-pix_fmt','gray','-'],capture_output=True).stdout
rows=[]
targets=sys.argv[1:] or sorted(os.listdir(ROOT))
for d in targets:
    dd=os.path.join(ROOT,d)
    if not os.path.isdir(dd): continue
    for f in sorted(os.listdir(dd)):
        if not f.endswith('.webp'): continue
        p=os.path.join(dd,f)
        try:
            w,h=info(p); buf=gray(p)
        except Exception: continue
        if len(buf)<w*h: continue
        def rowf(y): return sum(1 for v in buf[y*w:(y+1)*w] if v<DARK)/w
        def colf(x): return sum(1 for y in range(h) if buf[y*w+x]<DARK)/h
        best={}
        for name,vals in (('上',[rowf(y) for y in range(BAND)]),
                          ('下',[rowf(h-1-y) for y in range(BAND)]),
                          ('左',[colf(x) for x in range(BAND)]),
                          ('右',[colf(w-1-x) for x in range(BAND)])):
            m=max(vals)
            if LO<m<HI: best[name]=m
        if best:
            score=max(best.values())
            rows.append((score,d,f,'%dx%d'%(w,h),' '.join('%s%.2f'%(k,v) for k,v in best.items())))
rows.sort(reverse=True)
for r in rows: print('%.2f\t%s\t%s\t%s\t%s'%r)
print('---- 疑似裁斷 %d 張 / 全部'%len(rows))
