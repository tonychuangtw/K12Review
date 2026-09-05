"""列出整頁圖某個區間裡的「墨帶」：連續有墨的橫列（中間空白 >=GAP 列就切開），
   每一帶印出 y 範圍、x 範圍、墨量，方便精準抓裁圖座標（避免把題目文字含進去）。
   用法: bands.py <page.png> [y0 y1] [x0 x1] [gap]"""
import subprocess,sys
png=sys.argv[1]
w,h=[int(v) for v in subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',png],capture_output=True,text=True).stdout.strip().split(',')]
y0,y1=(int(sys.argv[2]),int(sys.argv[3])) if len(sys.argv)>3 else (0,h)
x0,x1=(int(sys.argv[4]),int(sys.argv[5])) if len(sys.argv)>5 else (0,w)
GAP=int(sys.argv[6]) if len(sys.argv)>6 else 5
buf=subprocess.run(['ffmpeg','-v','error','-i',png,'-f','rawvideo','-pix_fmt','gray','-'],capture_output=True).stdout
rows=[]
for y in range(y0,min(y1,h)):
    xs=[x for x in range(x0,min(x1,w)) if buf[y*w+x]<150]
    rows.append((y,xs))
bands=[];cur=None;blank=0
for y,xs in rows:
    if xs:
        if cur is None: cur=[y,y,min(xs),max(xs),len(xs)]
        else: cur[1]=y;cur[2]=min(cur[2],min(xs));cur[3]=max(cur[3],max(xs));cur[4]+=len(xs)
        blank=0
    else:
        if cur is not None:
            blank+=1
            if blank>=GAP: bands.append(cur);cur=None
if cur: bands.append(cur)
for b in bands: print('y %d-%d  x %d-%d  ink %d'%(b[0],b[1],b[2],b[3],b[4]))
