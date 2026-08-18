# batch*.json → js/data/social.js（一題一行 JSON，比照 custom.js）
import json,sys,os,collections
OUT='/home/tony/TelegramClaude/chinese/js/data/social-custom.js'
files=sys.argv[1:]
items=[]
for f in files: items += json.load(open(f))
# 手工修正表（原題本瑕疵）
FIX={'oc1505000857': {'options':['法律','倫理道德','風俗習慣','宗教信仰']}}
for it in items:
    if not it['id'].startswith('oc'): it['id']='oc'+it['id'][1:]   # 自創題庫用 oc 前綴（原創題庫才是 o）
    if it['id'] in FIX: it.update(FIX[it['id']])
# 原題本本身有少數完全重複題（不同題號、題幹選項答案全同）：只留第一筆
dedup=[];k2=set();dropped=[]
for it in items:
    k=it['q'].strip()+'||'+'|'.join(it['options'])+'||'+str(it['answer'])
    if k in k2: dropped.append(it['id']); continue
    k2.add(k); dedup.append(it)
if dropped: print('原檔重複題已略過',len(dropped),dropped[:10])
items=dedup
seen=set()
for it in items:
    assert it['id'] not in seen, it['id']
    seen.add(it['id'])
    assert len(set(it['options']))==len(it['options']), it['id']
    assert 0<=it['answer']<len(it['options']), it['id']
    assert it['q'] and it['exp']
by=collections.Counter(i['lesson'] for i in items)
hdr=['window.APP_DATA = window.APP_DATA || {};',
     '// 社會科「自創題庫」（Tony 提供的五上題本轉檔，2026-08-18 起分批轉入）。',
     '// 每日練習／單元學習用的是依課綱自編的 js/data/social.js，這支只給「自創題庫（依課練習）」用。',
     '// id = "oc"+原題號（可回溯原檔）；lesson＝單元+課；qtype＝原題型；src＝卷別（題庫/習作/素養題/強化演練/TASA）。',
     '// 目前題數：%d' % len(items),
     'window.APP_DATA.socialCustom = [']
body=[json.dumps(i,ensure_ascii=False,separators=(',',':')) for i in items]
open(OUT,'w').write('\n'.join(hdr)+'\n'+',\n'.join(body)+'\n];\n')
print('寫入',OUT,len(items),'題')
for k,v in by.items(): print(' ',k,v)
