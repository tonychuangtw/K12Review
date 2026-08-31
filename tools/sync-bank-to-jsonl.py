#!/usr/bin/env python3
"""把 js/data/<科>.js 的現況同步回 tools/tikuconv/<科>/*.jsonl（2026-09-05）

為什麼要這支：js/data/<科>.js 是 build-bank.js 從 jsonl 產出來的，但 set-qfix.js／
set-distractors.js 這類「逐題人工重寫」的工具是直接改 js/data。兩邊一旦分岔，
下次照 SOP 加題重建就會把人工重寫的成果整批洗掉（高中七科 10,951 題差點就這樣沒了）。

做法：README 的重建指令決定 jsonl 的串接順序，而 build-bank 是照這個順序 renumber，
所以「第 N 題對第 N 題」。以 q 欄位逐題核對，全部對得上才寫回 options／answer／exp。

用法：python3 tools/sync-bank-to-jsonl.py <科目> [--write]
"""
import json, re, sys, os

SUBJ = sys.argv[1] if len(sys.argv) > 1 else None
WRITE = '--write' in sys.argv
if not SUBJ:
    sys.exit('用法：python3 tools/sync-bank-to-jsonl.py <科目> [--write]')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PF = os.path.join(ROOT, 'tools/tikuconv', SUBJ)
JS = os.path.join(ROOT, 'js/data', SUBJ + '.js')

rd = open(os.path.join(PF, 'README.md'), encoding='utf-8').read()
cmd = re.search(r'```bash\n(.*?)```', rd, re.S).group(1)
files = re.findall(r'(?:\$\w+|tools/tikuconv/\w+)/([\w\-.]+\.jsonl)', cmd)
if not files:
    sys.exit('✗ README 裡找不到重建指令的檔案清單')

lines = {}          # 檔名 -> [原始行]
order = []          # [(檔名, 行號, dict)]
for f in files:
    ls = [l.rstrip('\n') for l in open(os.path.join(PF, f), encoding='utf-8')]
    lines[f] = ls
    for i, l in enumerate(ls):
        if l.strip():
            order.append((f, i, json.loads(l)))

js = []
for l in open(JS, encoding='utf-8'):
    if l.startswith('{"id":'):
        js.append(json.loads(l.rstrip('\n').rstrip(',')))

if len(order) != len(js):
    sys.exit('✗ 題數對不上：jsonl %d vs js/data %d' % (len(order), len(js)))

bad = [i for i, ((f, n, s), j) in enumerate(zip(order, js)) if s['q'] != j['q']]
if bad:
    sys.exit('✗ 第 %d 題起 q 對不上，順序已經走鐘，不要硬寫' % (bad[0] + 1))

changed = 0
for (f, n, s), j in zip(order, js):
    if s['options'] == j['options'] and s['answer'] == j['answer'] and s['exp'] == j['exp']:
        continue
    s['options'] = j['options']
    s['answer'] = j['answer']
    s['exp'] = j['exp']
    lines[f][n] = json.dumps(s, ensure_ascii=False)
    changed += 1

print('%s：%d 題，其中 %d 題與 js/data 不同' % (SUBJ, len(js), changed))
if not WRITE:
    print('（沒有加 --write，只看不改）')
    sys.exit(0)
for f, ls in lines.items():
    open(os.path.join(PF, f), 'w', encoding='utf-8').write('\n'.join(ls) + '\n')
print('已寫回 %d 個 jsonl' % len(lines))
