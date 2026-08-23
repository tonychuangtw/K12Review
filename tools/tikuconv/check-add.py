#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""加題自我檢查：schema／選項／解析三段／單元名比對／與該冊既有題重複。
用法：python3 tools/tikuconv/check-add.py <科目目錄> <基準冊 jsonl> <add jsonl...>
例：python3 tools/tikuconv/check-add.py tools/tikuconv/physics ph10b.jsonl ph10b-add1.jsonl ...
"""
import json, sys, os, collections, re, difflib

FIELDS = {'id', 'grade', 'book', 'lesson', 'tag', 'diff', 'qtype',
          'q', 'options', 'answer', 'exp', 'src'}
BAD_OPT = ['以上皆非', '以上皆是', '都不對', '都正確', '這裡沒有', '以上皆有可能']

d = sys.argv[1]
base_f = sys.argv[2]
adds = sys.argv[3:]

def norm(s):
    return re.sub(r'[「」『』（）()，,。？?、：:；;\s．.\-—─]', '', s)

base = collections.Counter()
seen = {}
normed = {}
for l in open(os.path.join(d, base_f), encoding='utf-8'):
    if not l.strip():
        continue
    r = json.loads(l)
    base[r['lesson']] += 1
    seen[r['q']] = base_f
    normed[norm(r['q'])] = (r['q'], base_f, r['lesson'])

errs = []
add = collections.Counter()
for f in adds:
    for n, l in enumerate(open(os.path.join(d, f), encoding='utf-8'), 1):
        if not l.strip():
            continue
        r = json.loads(l)
        where = '%s:%d' % (f, n)
        if set(r) != FIELDS:
            errs.append('%s 欄位不符：%s' % (where, sorted(set(r) ^ FIELDS)))
        if len(r.get('options', [])) != 4 or len(set(r['options'])) != 4:
            errs.append('%s 選項不是 4 個相異值' % where)
        for o in r.get('options', []):
            if any(b in o for b in BAD_OPT):
                errs.append('%s 爛誘答：%s' % (where, o))
        for k in ['✅', '❌', '📚']:
            if k not in r.get('exp', ''):
                errs.append('%s 解析缺 %s 段' % (where, k))
        if r['lesson'] not in base:
            errs.append('%s 單元名與基準冊不符：%s' % (where, r['lesson']))
        if r['q'] in seen:
            errs.append('%s 與 %s 題目重複：%s' % (where, seen[r['q']], r['q'][:30]))
        else:
            # 近似重複：去掉標點後比對，相似度 ≥ 0.75 視為同一題（同單元才比）
            k = norm(r['q'])
            for k2, (q2, f2, les2) in normed.items():
                if les2 != r['lesson']:
                    continue
                if difflib.SequenceMatcher(None, k, k2).ratio() >= 0.75:
                    errs.append('%s 與 %s 題目近似（可能重複）：\n     新：%s\n     舊：%s'
                                % (where, f2, r['q'], q2))
                    break
            normed[k] = (r['q'], f, r['lesson'])
        seen[r['q']] = f
        add[r['lesson']] += 1

for u in base:
    print('%-28s %2d + %2d = %d' % (u, base[u], add[u], base[u] + add[u]))
if errs:
    print('\n'.join(['✗ ' + e for e in errs]))
    sys.exit(1)
print('ok')
