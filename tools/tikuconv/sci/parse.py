# 五上社會題本 → 結構化 JSON（題號為單位；保留題型/難易度/知識點/原詳解/圖片標記）
import zipfile,re,os,json,collections
SEC = ['選擇題','是非題(單題)','填填看','勾選題','圈圈看','連連看','配合題','回答問題',
       '看圖回答問題','活用題','排出正確的順序','題組題','高層次思考題','閱讀測驗','綜合題']
def paras(p):
    z=zipfile.ZipFile(p); xml=z.read('word/document.xml').decode('utf8'); out=[]
    for m in re.finditer(r'<w:p[ >].*?</w:p>',xml,re.S):
        s=m.group(0)
        t=''.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>',s,re.S))
        t=t.replace('&amp;','&').replace('&lt;','<').replace('&gt;','>').replace('&quot;','"').replace('&apos;',"'")
        img = len(re.findall(r'<a:blip |v:imagedata',s))
        out.append((t,img))
    return out
HEAD=re.compile(r'^\s*題號：(\d+)\s*難易度：(\S)')
def parse_file(path,cat,lesson):
    items=[]; cur=None; sec='(未標)'
    for t,img in paras(path):
        s=t.strip()
        m=HEAD.match(s)
        if m:
            kp=re.search(r'知識點：(.*)$',s)
            cur={'no':m.group(1),'diff':m.group(2),'sec':sec,'cat':cat,'lesson':lesson,
                 'kp':(kp.group(1).strip() if kp else ''),'body':[],'ans':None,'exp':None,'img':0}
            items.append(cur); continue
        if s in SEC or (s.rstrip('　 ') in SEC): sec=s.rstrip('　 '); continue
        if cur is None: continue
        cur['img']+=img
        if s.startswith('《答案》'): cur['ans']=s[4:].strip()
        elif s.startswith('詳解：') or s.startswith('詳解'): cur['exp']=re.sub(r'^詳解：?','',s).strip()
        elif s: cur['body'].append(s)
    return items
def main():
    root='五上社會題本檔案'; all=[]
    for c in sorted(os.listdir(root)):
        d=os.path.join(root,c,'五上')
        for f in sorted(os.listdir(d)):
            lesson=os.path.splitext(f)[0]
            all+=parse_file(os.path.join(d,f),c,lesson)
    json.dump(all,open('items.json','w'),ensure_ascii=False,indent=1)
    print('items',len(all))
    print('unique 題號',len({i["no"] for i in all}))
    c=collections.Counter((i['sec']) for i in all)
    for k,v in c.most_common(): print(f'{k}\t{v}')
    print('有圖', sum(1 for i in all if i['img']))
    print('無答案', sum(1 for i in all if not i['ans']))
if __name__=='__main__': main()
