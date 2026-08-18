# 批4a：配合題 → 逐格／逐句單選（選項用原題給的甲乙丙丁詞語）
import json,re,collections
from conv1 import SRC,lesson_of,sortkey
from conv3 import kps_of,tail
its=json.load(open('items.json'))
GAN='甲乙丙丁戊己庚辛壬癸'
CIRC='①②③④⑤⑥⑦⑧⑨⑩'
def parse_opts(seg):
    out={}
    for m in re.finditer('(['+GAN+'])、\\s*(.+?)(?=['+GAN+']、|$)', seg):
        t=m.group(2).strip().strip('。').strip()
        if t: out[m.group(1)]=t
    return out
def amap_of(ans):
    """①甲　②丙 → {0:'甲'}；一格多答案的略過"""
    single={};multi=set()
    for m in re.finditer('(['+CIRC+'])\\s*(['+GAN+'])(\\s*、\\s*['+GAN+'])?', ans):
        i=CIRC.index(m.group(1))
        if m.group(3): multi.add(i)
        else: single[i]=m.group(2)
    return single,multi
def pick4(correct, others, seed):
    d=[o for o in others if o!=correct][:3]
    ch=[correct]+d
    pos=seed%len(ch)
    return ch[1:1+pos]+[correct]+ch[1+pos:]
out=[];skip=collections.Counter();notes=[]
picked=[i for i in its if i['sec']=='配合題']
picked.sort(key=sortkey)
for it in picked:
    if it['img']: skip['有圖']+=1; continue
    body=' '.join(it['body']).strip()
    ans=(it['ans'] or '').strip()
    les=lesson_of(it); tg=(kps_of(it)[0] if kps_of(it) else '')
    seed=int(it['no'][-2:])
    gs=body.find('甲、')
    if gs<0: skip['沒有選項清單']+=1; continue
    # 選項區的結尾：短文型看「　　」，敘述型看第一個 ①（含前面的底線/括號）
    m_pass=re.search('　　', body[gs:])
    m_mark=re.search('[_＿]*[（(]?　*[)）]?\\s*['+CIRC+']', body[gs:])
    passage_mode = bool(m_pass) and (not m_mark or m_pass.start() < m_mark.start())
    end = (m_pass.start() if passage_mode else (m_mark.start() if m_mark else len(body)-gs)) + gs
    opts=parse_opts(body[gs:end])
    if len(opts)<2: skip['選項讀不出']+=1; notes.append(it['no']); continue
    order=[opts[g] for g in GAN if g in opts]
    single,multi=amap_of(ans)
    if passage_mode:
        # 短文填空：本格挖空、其他格填正解
        passage=body[end:].strip()
        if len(passage)<10: skip['短文太短']+=1; continue
        for idx,g in sorted(single.items()):
            if g not in opts: continue
            q=passage
            for j in range(len(CIRC)):
                if CIRC[j] not in q: continue
                rep='（　？　）' if j==idx else (opts.get(single.get(j,''),'') or '（　　）')
                q=re.sub(re.escape(CIRC[j])+r'[_＿]*', rep, q, count=1)
            if '（　？　）' not in q: continue
            q=re.sub(r'[_＿]{3,}','（　　）',q)
            correct=opts[g]
            ch=pick4(correct,order,seed+idx)
            if len(ch)<3: continue
            out.append({'id':'o'+it['no']+'-'+str(idx+1),'grade':5,'book':'五上','lesson':les,'tag':tg,
                        'diff':it['diff'],'qtype':'選詞填空','q':'（　？　）裡應該填入哪一個？\n'+q,
                        'options':ch,'answer':ch.index(correct),
                        'exp':'\n'.join(([it['exp']] if it['exp'] else [])+['✅ 正解：'+correct]+tail(it,les)),
                        'src':SRC[it['cat']]})
    else:
        # 敘述配對：每句敘述問「這段描述指的是哪一個」
        seg=body[end:]
        parts=re.split('(['+CIRC+'])',seg)
        stmts={}
        i=1
        while i<len(parts)-1:
            stmts[CIRC.index(parts[i])]=re.sub(r'^[_＿（(　)）]+','',parts[i+1]).strip().strip('。')
            i+=2
        for idx,g in sorted(single.items()):
            if g not in opts or idx not in stmts: continue
            st=stmts[idx]
            if len(st)<6: continue
            st=re.sub(r'[_＿]{3,}','（　　）',st)
            correct=opts[g]
            ch=pick4(correct,order,seed+idx)
            if len(ch)<3: continue
            out.append({'id':'o'+it['no']+'-'+str(idx+1),'grade':5,'book':'五上','lesson':les,'tag':tg,
                        'diff':it['diff'],'qtype':'配合題','q':'下列敘述說的是哪一個？\n'+st,
                        'options':ch,'answer':ch.index(correct),
                        'exp':'\n'.join(([it['exp']] if it['exp'] else [])+['✅ 正解：'+correct]+tail(it,les)),
                        'src':SRC[it['cat']]})
    if multi: skip['一格多答案（該格略過）']+=len(multi)
# 品質守門：選項/題幹殘留怪字元的丟掉
clean=[]
for x in out:
    if any(re.search(r'[（）()_＿①-⑩]',o) for o in x['options']): skip['選項有殘留符號']+=1; continue
    if any(len(o)>24 for o in x['options']): skip['選項過長']+=1; continue
    if re.search('['+CIRC+']',x['q']): skip['題幹殘留編號']+=1; continue
    clean.append(x)
print('轉出',len(clean),'跳過',dict(skip),notes[:8])
json.dump(clean,open('batch4a.json','w'),ensure_ascii=False)
import random; random.seed(7)
for x in random.sample(clean,6): print('---',json.dumps(x,ensure_ascii=False)[:420])
