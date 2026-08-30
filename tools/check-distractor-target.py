#!/usr/bin/env python3
"""檢查手寫的誘答夠不夠長（誘答重寫第三輪用）。
用法：python3 tools/check-distractor-target.py <file.json>
讀 [{id, d:[3條]}｜{id, one:"…"}]，印出還差幾個字。
"""
import json,sys,subprocess,math
f=sys.argv[1]
data=json.load(open(f))
out=subprocess.run(['node','-e','''
global.window=global;const fs=require("fs");
["science","social","english","math","civics","geography","history","physics","chemistry","biology","earth"].forEach(s=>{try{require("/home/tony/TelegramClaude/chinese/js/data/"+s+".js")}catch(e){}});
const M={};Object.values(global.APP_DATA).forEach(a=>{if(Array.isArray(a))a.forEach(it=>{if(it&&it.id)M[it.id]=String(it.options[it.answer]).length});});
console.log(JSON.stringify(M));'''],capture_output=True,text=True)
COR=json.loads(out.stdout)
bad=0
for e in data:
    c=COR.get(e['id'])
    if c is None: print('✗ 找不到',e['id']); bad+=1; continue
    ds=e['d'] if 'd' in e else [e['one']]
    m=max(len(x) for x in ds)
    need=c-5
    if m<need: print(f"{e['id']} 差 {need-m} 字（現 {m}，需 {need}，正解 {c}）"); bad+=1
print('OK' if not bad else f'--- {bad} 題要改')
