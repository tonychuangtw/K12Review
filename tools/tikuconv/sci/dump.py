import zipfile,re,os,sys,json
def paras(p):
    z=zipfile.ZipFile(p)
    xml=z.read('word/document.xml').decode('utf8')
    out=[]
    for m in re.finditer(r'<w:p[ >].*?</w:p>',xml,re.S):
        s=m.group(0)
        t=''.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>',s,re.S))
        t=t.replace('&amp;','&').replace('&lt;','<').replace('&gt;','>').replace('&quot;','"')
        has_img = '<w:drawing' in s or '<w:pict' in s or 'v:imagedata' in s
        out.append((t,has_img))
    return out
if __name__=='__main__':
    root='五上社會題本檔案'
    tot=0
    for cat in sorted(os.listdir(root)):
        d=os.path.join(root,cat,'五上')
        for f in sorted(os.listdir(d)):
            ps=paras(os.path.join(d,f))
            n=sum(1 for t,_ in ps if t.strip().startswith('題號：'))
            img=sum(1 for t,h in ps if h)
            tot+=n
            print(f'{cat}\t{f[:20]}\t段落{len(ps)}\t題號{n}\t圖段{img}')
    print('TOTAL 題號', tot)
