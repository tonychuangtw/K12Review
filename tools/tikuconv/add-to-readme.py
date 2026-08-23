#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把新的 add 檔加進某科 README.md 的檔案表與重建指令（一律接在指令最後面）。
用法：python3 tools/tikuconv/add-to-readme.py <科目目錄> <冊代號> <冊名> [add 檔數，預設 3]
例：python3 tools/tikuconv/add-to-readme.py tools/tikuconv/physics ph12 十二上
"""
import sys, os, re, datetime

d, stem, bookname = sys.argv[1], sys.argv[2], sys.argv[3]
n = int(sys.argv[4]) if len(sys.argv) > 4 else 3
p = os.path.join(d, 'README.md')
s = open(p, encoding='utf-8').read()
today = datetime.date.today().isoformat().replace('-0', '-').replace('-', '-')
today = datetime.date.today().strftime('%Y-%m-%d')

names = ['%s-add%d' % (stem, i) for i in range(1, n + 1)]
row = '| %s.jsonl | %s加題（%s，補到每單元 24 題） | — |' % (' / '.join(names), bookname, today)
if row in s:
    print('README 已含此列，略過')
else:
    # 插在檔案表最後一列之後
    lines = s.split('\n')
    last = max(i for i, l in enumerate(lines) if l.startswith('| ') and '---' not in l)
    lines.insert(last + 1, row)
    s = '\n'.join(lines)

# 重建指令：接在最後一個 $XF/....jsonl 之後
m = list(re.finditer(r'^(\s+\$\w+/[\w-]+\.jsonl)\s*$', s, re.M))
if not m:
    sys.exit('找不到重建指令的最後一行')
last = m[-1]
var = re.match(r'\s+\$(\w+)/', last.group(1)).group(1)
add = ' \\\n' + ' \\\n'.join('  $%s/%s.jsonl' % (var, nm) for nm in names)
s = s[:last.end(1)] + add + s[last.end(1):]
open(p, 'w', encoding='utf-8').write(s)
print('README 已更新：%s（%d 檔）' % (stem, n))
