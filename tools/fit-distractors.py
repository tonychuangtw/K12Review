#!/usr/bin/env python3
"""把手寫的誘答補到夠長（誘答重寫第三輪用）。

用法：python3 tools/fit-distractors.py <file.json> [--write]
  讀 [{id, d:[3條]}｜{id, one:"…"}]，算出該題誘答至少要多長（正解長度 − 5），
  差 6 字以內的在最長那條前面加一句語氣詞補上去，差更多的印出來人工重寫。

⛔ 語氣詞最長只到 6 字，而且同一長度有好幾種、依 id 輪流用。
   理由：2026-09-03 一開始想用程式一次補完 1,900 題，補到 14 字會生出
   「按照絕大多數人的一般理解來說…」這種沒人這樣講的句子；而且如果誤答
   都用同一個開頭，反而變成新的破綻——孩子會學到「開頭是這幾個字的就是錯的」。
"""
import json, math, subprocess, sys

POOL = {
    2: ['其實', '應該'],
    3: ['基本上', '事實上'],
    4: ['一般來說', '通常來講'],
    5: ['就目前來看', '大致上來說'],
    6: ['在多數情況下', '就一般情形說'],
}
JS = '''global.window=global;
["science","social","english","math","civics","geography","history","physics","chemistry","biology","earth"]
  .forEach(s=>{try{require("/home/tony/TelegramClaude/chinese/js/data/"+s+".js")}catch(e){}});
const M={};Object.values(global.APP_DATA).forEach(a=>{if(Array.isArray(a))a.forEach(it=>{
  if(it&&it.id)M[it.id]=String(it.options[it.answer]).length;});});
console.log(JSON.stringify(M));'''


def main():
    path = sys.argv[1]
    write = '--write' in sys.argv
    data = json.load(open(path))
    cor = json.loads(subprocess.run(['node', '-e', JS], capture_output=True, text=True).stdout)
    fixed = todo = 0
    for e in data:
        c = cor.get(e['id'])
        if c is None:
            print('✗ 找不到 ' + e['id']); todo += 1; continue
        ds = e['d'] if 'd' in e else [e['one']]
        i = max(range(len(ds)), key=lambda k: len(ds[k]))
        need = c - 5 - len(ds[i])
        if need <= 0:
            continue
        # 2026-09-03：機械加語氣詞會生出「大致上來說4 個；…」「應該有絲分裂會使…」這種
        # 讀不通的句子（誘答開頭是數字或動詞時特別明顯），一律改成只報告、人工重寫。
        print('需手補：%s 差 %d 字（現 %d，正解 %d）' % (e['id'], need, len(ds[i]), c)); todo += 1; continue
        opts = POOL[max(need, 2)]
        new = opts[sum(ord(ch) for ch in e['id']) % len(opts)] + ds[i]
        if 'd' in e:
            e['d'][i] = new
        else:
            e['one'] = new
        fixed += 1
    print('補了 %d 題%s' % (fixed, '，需人工 %d 題' % todo if todo else ''))
    if write:
        json.dump(data, open(path, 'w'), ensure_ascii=False)


main()
