# 批2：是非題(單題) → ○╳ 二選一
import json,re,collections
from conv1 import UNIT,SRC,LORDER,lesson_of,sortkey
its=json.load(open('items.json'))
# 原檔缺詳解、需人工補寫的解析（逐題手寫）
HAND={'1505000639':'未經同學同意就把合照分享到網路上，會侵犯他人的肖像權與隱私。要張貼含有他人的照片，一定要先取得當事人同意。'}
out=[];bad=[]
picked=[i for i in its if i['sec']=='是非題(單題)']
picked.sort(key=sortkey)
for it in picked:
    if it['img']: bad.append((it['no'],'有圖')); continue
    body=' '.join(it['body']).strip()
    stem=re.sub(r'^（\s*）','',body).strip()
    a=(it['ans'] or '').strip().strip('。')
    if a not in ('○','╳') or not stem: bad.append((it['no'],'答案異常:'+a)); continue
    ai=0 if a=='○' else 1
    les=lesson_of(it)
    exp=[]
    if it['exp']: exp.append(it['exp'])
    elif it['no'] in HAND: exp.append(HAND[it['no']])
    if ai==0:
        exp.append('✅ 正解：○（敘述正確）')
        exp.append('💡 這句話本身就是本課重點，記起來：'+stem)
    else:
        exp.append('✅ 正解：╳（敘述不正確，正確說法見上面的說明）')
    kps=[]
    for k in (it['kp'] or '').split(','):
        k=k.strip()
        if k and k not in kps: kps.append(k)
    if kps: exp.append('📚 知識點：'+'、'.join(kps))
    exp.append('（出處：五上社會 '+les+'・'+SRC[it['cat']]+'）')
    out.append({'id':'o'+it['no'],'grade':5,'book':'五上','lesson':les,
                'tag':(kps[0] if kps else ''),'diff':it['diff'],'qtype':'是非題',
                'q':'判斷對錯：'+stem,'options':['○ 正確','╳ 錯誤'],'answer':ai,
                'exp':'\n'.join(exp),'src':SRC[it['cat']]})
print('轉出',len(out),'跳過',len(bad),bad[:5])
json.dump(out,open('batch2.json','w'),ensure_ascii=False)
print(json.dumps(out[0],ensure_ascii=False)[:400])
missing=[o for o in out if o['exp'].startswith('✅')]
print('只有正解說明沒有詳解的：',len(missing))
