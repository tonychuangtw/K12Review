# 批1：選擇題 + 高層次思考題（①②③④四選一）→ K12Review 自創題庫 schema
import json,re,collections
its=json.load(open('items.json'))
UNIT={ '1.臺灣的地理位置與文化發展有何關係？':'第1單元 臺灣我的家',
       '2.社會規範如何影響人們的行為？':'第1單元 臺灣我的家',
       '3.為什麼法律與我們的生活有關係？':'第1單元 臺灣我的家',
       '1.地形如何影響我們的生活？':'第2單元 臺灣的自然環境與生活',
       '2.氣候如何影響我們的生活？':'第2單元 臺灣的自然環境與生活',
       '1.史前人類如何利用環境與資源來生活？':'第3單元 尋根探源話臺灣',
       '2.原住民族如何與環境共存？':'第3單元 尋根探源話臺灣',
       '1.大航海時代臺灣如何登上世界舞臺？':'第4單元 大航海時代的臺灣',
       '2.大航海時代有哪些人經營臺灣？':'第4單元 大航海時代的臺灣',
       '3.大航海時代對臺灣帶來什麼影響？':'第4單元 大航海時代的臺灣',
       '99':'TASA 綜合測驗' }
SRC={'01_題庫題目':'題庫','02_習作':'習作','03_素養題':'素養題','04_強化演練':'強化演練','05_TASA':'TASA'}
NUM={'１':0,'２':1,'３':2,'４':3,'①':0,'②':1,'③':2,'④':3,'1':0,'2':1,'3':2,'4':3}
def lesson_of(it):
    u=UNIT[it['lesson']]
    return u if u.startswith('TASA') else u + ' ' + it['lesson']
LORDER=['第1單元 臺灣我的家 1.臺灣的地理位置與文化發展有何關係？',
        '第1單元 臺灣我的家 2.社會規範如何影響人們的行為？',
        '第1單元 臺灣我的家 3.為什麼法律與我們的生活有關係？',
        '第2單元 臺灣的自然環境與生活 1.地形如何影響我們的生活？',
        '第2單元 臺灣的自然環境與生活 2.氣候如何影響我們的生活？',
        '第3單元 尋根探源話臺灣 1.史前人類如何利用環境與資源來生活？',
        '第3單元 尋根探源話臺灣 2.原住民族如何與環境共存？',
        '第4單元 大航海時代的臺灣 1.大航海時代臺灣如何登上世界舞臺？',
        '第4單元 大航海時代的臺灣 2.大航海時代有哪些人經營臺灣？',
        '第4單元 大航海時代的臺灣 3.大航海時代對臺灣帶來什麼影響？',
        'TASA 綜合測驗']
def sortkey(it):
    l=lesson_of(it)
    return (LORDER.index(l), list(SRC).index(it['cat']), it['no'])
def split_opts(stem):
    i=stem.find('①')
    if i<0: return None,None
    head=stem[:i].strip()
    rest=stem[i:]
    parts=re.split(r'[①②③④]',rest)
    opts=[p.strip().strip('。').strip() for p in parts[1:]]
    if len(opts)!=4 or not all(opts): return None,None
    return head,opts
def convert(sec_names,prefix_start=1):
    out=[];bad=[]
    picked=[i for i in its if i['sec'] in sec_names]
    picked.sort(key=sortkey)
    n=prefix_start
    for it in picked:
        if it['img']: bad.append((it['no'],'有圖')); continue
        body=' '.join(it['body']).strip()
        body=re.sub(r'^（\s*）','',body).strip()
        head,opts=split_opts(body)
        if not head or it['ans'] is None: bad.append((it['no'],'切不出選項')); continue
        a=it['ans'].strip().strip('。')
        if a not in NUM: bad.append((it['no'],'答案異常:'+a)); continue
        ai=NUM[a]
        les=lesson_of(it)
        exp=[]
        if it['exp']: exp.append(it['exp'])
        exp.append('✅ 正解：'+opts[ai])
        if it['kp']:
            kps=[]
            for k in it['kp'].split(','):
                k=k.strip()
                if k and k not in kps: kps.append(k)
            if kps: exp.append('📚 知識點：'+'、'.join(kps))
        exp.append('（出處：五上社會 '+les+'・'+SRC[it['cat']]+'）')
        out.append({'id':'o'+it['no'],'grade':5,'book':'五上','lesson':les,
                    'tag':(it['kp'].split(',')[0].strip() if it['kp'] else ''),
                    'diff':it['diff'],'qtype':('思考題' if it['sec']=='高層次思考題' else '選擇題'),
                    'q':head,'options':opts,'answer':ai,'exp':'\n'.join(exp),'src':SRC[it['cat']]})
        n+=1
    return out,bad
if __name__=='__main__':
    out,bad=convert({'選擇題','高層次思考題'})
    print('轉出',len(out),'跳過',len(bad))
    print(collections.Counter(b[1].split(':')[0] for b in bad))
    for b in bad[:10]: print(' ',b)
    json.dump(out,open('batch1.json','w'),ensure_ascii=False)
    print(json.dumps(out[0],ensure_ascii=False)[:600])
    print(json.dumps(out[-1],ensure_ascii=False)[:600])
