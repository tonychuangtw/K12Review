"""某個 y 區間內的「墨柱」：把圖與旁邊的題目文字分開。用法: cols.py <page.png> y0 y1 [x0 x1] [gap]"""
import subprocess,sys
png=sys.argv[1]; y0,y1=int(sys.argv[2]),int(sys.argv[3])
x0,x1=(int(sys.argv[4]),int(sys.argv[5])) if len(sys.argv)>5 else (60,790)
GAP=int(sys.argv[6]) if len(sys.argv)>6 else 8
w,h=[int(v) for v in subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',png],capture_output=True,text=True).stdout.strip().split(',')]
buf=subprocess.run(['ffmpeg','-v','error','-i',png,'-f','rawvideo','-pix_fmt','gray','-'],capture_output=True).stdout
runs=[];cur=None;blank=0
for x in range(x0,min(x1,w)):
    n=sum(1 for y in range(y0,min(y1,h)) if buf[y*w+x]<150)
    if n:
        cur=[x,x,n] if cur is None else [cur[0],x,cur[2]+n]; blank=0
    else:
        if cur is not None:
            blank+=1
            if blank>=GAP: runs.append(cur);cur=None
if cur: runs.append(cur)
for r in runs: print('x %d-%d ink %d'%tuple(r))
