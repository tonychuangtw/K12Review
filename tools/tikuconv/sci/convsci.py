# 五上自然題本 → K12Review「自然自創題庫」(scienceCustom)
# 沿用社會那套規則：選擇題機械轉、是非題轉○╳、勾選/活用拆小題（錯的沒詳解就不收）
import json,re,collections
its=json.load(open('items.json'))
CIRC='①②③④⑤⑥⑦⑧⑨⑩'; FULL='１２３４５６７８９０'
NUM={**{c:i for i,c in enumerate(CIRC)},**{c:i for i,c in enumerate(FULL)},**{str(i+1):i for i in range(10)}}
SRC={'01_題庫題目':'題庫','02_習作':'習作','03_素養題':'素養題','04_強化演練':'強化演練','05_TASA':'TASA'}
UNIT={'01':'第1單元 動物世界','02':'第2單元 探索聲光世界','03':'第3單元 神祕的天空','04':'第4單元 燃燒與生鏽'}
def lesson_of(it):
    f=it['lesson']
    m=re.match(r'(\d\d)-(\d\d)(活動 \d.*)$', f)
    if m: return UNIT[m.group(1)]+' '+m.group(3).replace('活動 ','活動')
    m2=re.match(r'第 (\d) 單元　(.+)$', f)
    if m2: return '第%s單元 %s 綜合' % (m2.group(1), m2.group(2))
    return f
LORDER=[]
for u in ['01','02','03','04']:
    for a in ['1','2','3']: LORDER.append((u,a))
def sortkey(it):
    l=lesson_of(it)
    return (l, list(SRC).index(it['cat']), it['no'])
def kps_of(it):
    out=[]
    for k in (it['kp'] or '').split(','):
        k=k.strip()
        if k and k not in out: out.append(k)
    return out
def tail(it,les,extra=None):
    e=list(extra or [])
    ks=kps_of(it)
    if ks: e.append('📚 知識點：'+'、'.join(ks))
    e.append('（出處：五上自然 '+les+'・'+SRC[it['cat']]+'）')
    return e
def base(it,les,qtype,q,opts,ai,exp):
    return {'id':'nc'+it['no'],'grade':5,'book':'五上','lesson':les,
            'tag':(kps_of(it)[0] if kps_of(it) else ''),'diff':it['diff'],'qtype':qtype,
            'q':q,'options':opts,'answer':ai,'exp':exp,'src':SRC[it['cat']]}
def split_opts(stem):
    i=stem.find('①')
    if i<0: return None,None
    head=stem[:i].strip()
    parts=re.split('['+CIRC+']', stem[i:])
    opts=[p.strip().strip('。').strip() for p in parts[1:]]
    if len(opts)!=4 or not all(opts): return None,None
    return head,opts
out=[];skip=collections.Counter()
picked=sorted([i for i in its if i['sec'] in ('選擇題','是非題(單題)')], key=sortkey)
for it in picked:
    if it['img']: skip['有圖']+=1; continue
    body=re.sub(r'^（\s*）','',' '.join(it['body']).strip()).strip()
    a=(it['ans'] or '').strip().strip('。')
    les=lesson_of(it)
    if it['sec']=='選擇題':
        head,opts=split_opts(body)
        if not head or a not in NUM: skip['選擇題切不出']+=1; continue
        ai=NUM[a]
        if ai>=4: skip['答案超出範圍']+=1; continue
        exp=([it['exp']] if it['exp'] else [])+['✅ 正解：'+opts[ai]]
        out.append(base(it,les,'選擇題',head,opts,ai,'\n'.join(exp+tail(it,les))))
    else:
        if a not in ('○','╳') or not body: skip['是非答案異常']+=1; continue
        ai=0 if a=='○' else 1
        exp=[it['exp']] if it['exp'] else []
        if ai==0: exp+= ['✅ 正解：○（敘述正確）','💡 這句話本身就是本課重點，記起來：'+body]
        else:
            if not it['exp']: skip['錯的是非無詳解→不收']+=1; continue
            exp+=['✅ 正解：╳（敘述不正確，正確說法見上面的說明）']
        out.append(base(it,les,'是非題','判斷對錯：'+body,['○ 正確','╳ 錯誤'],ai,'\n'.join(exp+tail(it,les))))
print('轉出',len(out),'跳過',dict(skip))
json.dump(out,open('sci1.json','w'),ensure_ascii=False)
print(collections.Counter(x['lesson'] for x in out))
import random; random.seed(2)
for x in random.sample(out,3): print('---',json.dumps(x,ensure_ascii=False)[:400])
