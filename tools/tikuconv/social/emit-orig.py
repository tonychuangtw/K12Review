# orig*.json → js/data/<subject>.js（科目原創題庫，依課綱自編）
import json,sys,collections
subj=sys.argv[1]; name=sys.argv[2]; files=sys.argv[3:]
OUT='/home/tony/TelegramClaude/chinese/js/data/%s.js'%subj
items=[]
for f in files: items+=json.load(open(f))
ids=set()
for it in items:
    assert it['id'] not in ids, it['id']; ids.add(it['id'])
    assert len(set(it['options']))==len(it['options']), it['id']
    assert 0<=it['answer']<len(it['options'])
    assert it['q'] and it['exp'] and it['book'] and it['lesson']
hdr=['window.APP_DATA = window.APP_DATA || {};',
     '// %s科原創題庫：依教育部 108 課綱社會領域／自然科學領域第三學習階段自編（非題本轉檔）。'%name,
     '// 每日練習、單元學習、依序刷題用這一支；家長提供的題本轉檔在 js/data/%s-custom.js。'%subj,
     '// 目前題數：%d'%len(items),
     'window.APP_DATA.%s = ['%subj]
body=[json.dumps(i,ensure_ascii=False,separators=(',',':')) for i in items]
open(OUT,'w').write('\n'.join(hdr)+'\n'+',\n'.join(body)+'\n];\n')
print('寫入',OUT,len(items),'題')
for k,v in collections.Counter(i['lesson'] for i in items).items(): print(' ',k,v)
