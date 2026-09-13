# -*- coding: utf-8 -*-
"""把「國小國語5上字音字形.doc」抽出的文字解析成結構化的形近字組。
格式觀察：第N課　課名◎字音字形辨析 ⒈蚊蚊：蚊帳、蚊香  紋紋：紋路、皺紋 ⒉…
每一組＝一個「本課生字」＋幾個形近／同音字，各附兩個詞例。
「字字：」的第一個字才是要教的字（第二個字是原檔的注音提示字，不可靠，丟掉）。
單一個「字：詞例」是前一個字的另一個讀音，先跳過（多音字要人工判斷）。"""
import re, json, sys

src = open('/home/tony/TelegramClaude/chinese-sources/guo5shang/txt/字音字形.txt', encoding='utf-8').read()
CN = '一二三四五六七八九十'
out = {}
# 課的切點
heads = list(re.finditer(r'第([一二三四五六七八九十]+)課\s*(.*?)◎字音字形辨析', src, re.S))
for i, h in enumerate(heads):
    num = h.group(1)
    n = CN.index(num[0]) + 1 if len(num) == 1 else (10 + CN.index(num[1]) + 1 if num.startswith('十') else 0)
    name = h.group(2).strip()
    body = src[h.end(): heads[i+1].start() if i+1 < len(heads) else len(src)]
    # 組的切點：⒈-⒓ 這種圈碼，或 11. 12. 13.
    # ⚠️ 原檔的組號混用圈碼（⒈⒉…）與半形數字（9. 10. 11.）。
    #    以前只認 10-19 的半形，單一位數的「9.」沒被當成組號，
    #    於是第七課的第 8、9 組被併成一組（碌/錄/祿/綠 + 脈），
    #    造出「碌絡」這種跨組的假錯字（2026-09-13 codex／gemini review 抓到）。
    marks = list(re.finditer(r'[⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖]|(?<![0-9])[0-9]{1,2}\.(?=[一-鿿])', body))
    groups = []
    for j, m in enumerate(marks):
        seg = body[m.end(): marks[j+1].start() if j+1 < len(marks) else len(body)]
        pairs = re.findall(r'([一-鿿])[一-鿿]：([一-鿿、]+)', seg)
        items = []
        for ch, wordstr in pairs:
            words = [w for w in re.split('、', wordstr) if w]
            items.append({'c': ch, 'w': words})
        if items:
            groups.append(items)
    if n:
        out[str(n)] = {'name': name, 'groups': groups}
json.dump(out, open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for k in sorted(out, key=int):
    g = out[k]['groups']
    print('第%s課' % k, out[k]['name'], '%d 組' % len(g), '字數', sum(len(x) for x in g))
