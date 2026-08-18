# 批3：活用題（多小題○╳）、勾選題（打ˇ→逐項判斷）、圈圈看（逐格二選一）
import json,re,collections
from conv1 import SRC,lesson_of,sortkey
its=json.load(open('items.json'))
CIRC='①②③④⑤⑥⑦⑧⑨⑩'
FULL='１２３４５６７８９０'
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
    e.append('（出處：五上社會 '+les+'・'+SRC[it['cat']]+'）')
    return e
def exp_by_index(it):
    """把原詳解依 ①②③ 拆成 {index: 說明}"""
    out={}
    if not it['exp']: return out
    parts=re.split('(['+CIRC+'])',it['exp'])
    i=1
    while i < len(parts)-1:
        idx=CIRC.index(parts[i])
        txt=parts[i+1].strip()
        if txt: out[idx]=txt
        i+=2
    return out
def split_items(body):
    """把 ①…②…③… 切成 [(index, 文字)]"""
    parts=re.split('(['+CIRC+'])',body)
    out=[]
    i=1
    while i < len(parts)-1:
        out.append((CIRC.index(parts[i]), parts[i+1].strip()))
        i+=2
    return out
def clean(t):
    t=t.replace('_______','').replace('（　　）','').replace('（  ）','').replace('□','')
    return t.strip().strip('。').strip()

out=[];skipped=collections.Counter();notes=[]
picked=[i for i in its if i['sec'] in ('活用題','勾選題')]
picked.sort(key=sortkey)
for it in picked:
    if it['img']: skipped['有圖']+=1; continue
    body=' '.join(it['body'])
    subs=split_items(body)
    if len(subs)<2: skipped['切不出小題']+=1; continue
    ans=(it['ans'] or '')
    marks={}
    if '○' in ans or '╳' in ans:
        for m in re.finditer('(['+CIRC+'])\\s*([○╳ˇ])',ans):
            marks[CIRC.index(m.group(1))]= (m.group(2) in '○ˇ')
    else:  # 勾選：請將 １、４、５ 打ˇ
        checked=set()
        for ch in ans:
            if ch in FULL: checked.add(FULL.index(ch))
            elif ch in CIRC: checked.add(CIRC.index(ch))
        if not checked: skipped['答案讀不出']+=1; continue
        for idx,_ in subs: marks[idx]= idx in checked
    if len(marks)!=len(subs): skipped['答案數不合']+=1; continue
    exps=exp_by_index(it)
    les=lesson_of(it)
    n=0
    for idx,txt in subs:
        txt=clean(txt)
        if not txt or len(txt)<6: continue
        ok=marks[idx]
        if not ok and idx not in exps: skipped['錯的小題無原詳解→不收']+=1; continue
        body_exp=[]
        if idx in exps: body_exp.append(exps[idx])
        if ok: body_exp.append('✅ 正解：○（敘述正確）\n💡 這句話本身就是本課重點，記起來：'+txt)
        else: body_exp.append('✅ 正解：╳（敘述不正確，正確說法見上面的說明）')
        n+=1
        out.append({'id':'o'+it['no']+'-'+str(idx+1),'grade':5,'book':'五上','lesson':les,
                    'tag':(kps_of(it)[0] if kps_of(it) else ''),'diff':it['diff'],
                    'qtype':'是非題','q':'判斷對錯：'+txt,'options':['○ 正確','╳ 錯誤'],'answer':0 if ok else 1,
                    'exp':'\n'.join(body_exp+tail(it,les)),'src':SRC[it['cat']]})

# 圈圈看：每個（ A ／ B ）拆一題
circle=[i for i in its if i['sec']=='圈圈看']
circle.sort(key=sortkey)
BLANK=re.compile(r'（\s*([^（）／]+?)\s*／\s*([^（）／]+?)\s*）')
for it in circle:
    if it['img']: skipped['有圖']+=1; continue
    body=' '.join(it['body']).strip()
    body=re.sub(r'^請閱讀短文後，圈出正確的選項。','',body).strip()
    blanks=list(BLANK.finditer(body))
    if not blanks: skipped['圈圈看無空格']+=1; continue
    ans=(it['ans'] or '').strip().strip('。')
    toks=[t.strip() for t in re.split('[、，,]',ans) if t.strip()]
    picks=[]
    okall=True
    if len(toks)==len(blanks):
        # 逐格對逐個答案（先精準比對，避免「有」被「沒有」誤配）
        for m,t in zip(blanks,toks):
            a,b=m.group(1).strip(),m.group(2).strip()
            if t==a: picks.append(a)
            elif t==b: picks.append(b)
            elif a in t and b not in t: picks.append(a)
            elif b in t and a not in t: picks.append(b)
            else: okall=False; break
    else:
        for m in blanks:
            a,b=m.group(1).strip(),m.group(2).strip()
            ina, inb = a in ans, b in ans
            if ina == inb: okall=False; break
            picks.append(a if ina else b)
    if not okall or len(picks)!=len(blanks): skipped['圈圈看對不上答案']+=1; notes.append(it['no']); continue
    # 完整正確句（所有空格填正解）
    full=body; off=0
    for m,p in zip(blanks,picks):
        full=full[:m.start()+off]+p+full[m.end()+off:]
        off += len(p)-(m.end()-m.start())
    les=lesson_of(it)
    for k,(m,p) in enumerate(zip(blanks,picks)):
        a,b=m.group(1).strip(),m.group(2).strip()
        # 題幹：這一格挖空成（？），其他格填上正解
        q=body; off=0
        for j,(mj,pj) in enumerate(zip(blanks,picks)):
            rep = '（　？　）' if j==k else pj
            q=q[:mj.start()+off]+rep+q[mj.end()+off:]
            off += len(rep)-(mj.end()-mj.start())
        out.append({'id':'o'+it['no']+'-'+str(k+1),'grade':5,'book':'五上','lesson':les,
                    'tag':(kps_of(it)[0] if kps_of(it) else ''),'diff':it['diff'],
                    'qtype':'選詞填空','q':'（　？　）裡應該填哪一個？\n'+q,'options':[a,b],'answer':0 if p==a else 1,
                    'exp':'\n'.join(([it['exp']] if it['exp'] else [])+['✅ 正解：'+p,'💡 完整正確的說法：'+full]+tail(it,les)),
                    'src':SRC[it['cat']]})
print('轉出',len(out))
print('跳過',dict(skipped), notes[:10])
json.dump(out,open('batch3.json','w'),ensure_ascii=False)
import random
random.seed(1)
for x in random.sample(out,4): print('---',json.dumps(x,ensure_ascii=False)[:420])
