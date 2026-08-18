import json,sys,collections
OUT='/home/tony/TelegramClaude/chinese/js/data/science-custom.js'
items=[]
for f in sys.argv[1:]: items+=json.load(open(f))
dedup=[];k2=set();dropped=[]
for it in items:
    k=it['q'].strip()+'||'+'|'.join(it['options'])+'||'+str(it['answer'])
    if k in k2: dropped.append(it['id']); continue
    k2.add(k); dedup.append(it)
if dropped: print('原檔重複題已略過',len(dropped))
items=dedup
seen=set()
for it in items:
    assert it['id'] not in seen and it['id'].startswith('nc'), it['id']
    seen.add(it['id'])
    assert len(set(it['options']))==len(it['options']) and 0<=it['answer']<len(it['options'])
    assert it['q'] and it['exp'] and it['book'] and it['lesson']
hdr=['window.APP_DATA = window.APP_DATA || {};',
     '// 自然科「自創題庫」（Tony 提供的五上題本轉檔，2026-08-18）。',
     '// 每日練習／單元學習用的是依課綱自編的 js/data/science.js，這支只給「自創題庫（依課練習）」用。',
     '// id = "nc"+原題號；lesson＝單元+活動；qtype＝原題型；src＝卷別。',
     '// 目前題數：%d'%len(items),
     'window.APP_DATA.scienceCustom = [']
body=[json.dumps(i,ensure_ascii=False,separators=(',',':')) for i in items]
open(OUT,'w').write('\n'.join(hdr)+'\n'+',\n'.join(body)+'\n];\n')
print('寫入',OUT,len(items),'題')
