import subprocess,sys
png=sys.argv[1]; x0,y0,x1,y1=map(int,sys.argv[2:6])
w,h=[int(v) for v in subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',png],capture_output=True,text=True).stdout.strip().split(',')]
buf=subprocess.run(['ffmpeg','-v','error','-i',png,'-f','rawvideo','-pix_fmt','gray','-'],capture_output=True).stdout
xs=[];ys=[]
for y in range(y0,min(y1,h)):
    row=buf[y*w:(y+1)*w]
    for x in range(x0,min(x1,w)):
        if row[x]<150: xs.append(x);ys.append(y)
print('ink bbox x:%d-%d y:%d-%d'%(min(xs),max(xs),min(ys),max(ys)) if xs else 'empty')
