# -*- coding: utf-8 -*-
"""把來源 jsonl 裡指定行的重複題換成新題（保留原本的 id/grade/book/lesson 等欄位骨架）。
用法：在呼叫端組好 {檔名: {行號: {q,options,exp,tag,diff,qtype}}} 再呼叫 apply()。"""
import json, os, re

def norm(s):
    return re.sub(r'[「」『』（）()，,。？?、：:；;\s．.\-—─]', '', s or '')

def apply(subj_dir, edits, verbose=True):
    total = 0
    for fname, byline in edits.items():
        p = os.path.join(subj_dir, fname)
        lines = [l for l in open(p, encoding='utf-8').read().split('\n') if l.strip()]
        for lineno, new in byline.items():
            d = json.loads(lines[lineno - 1])
            old_q = d['q']
            d['q'] = new['q']
            d['options'] = new['options']
            d['exp'] = new['exp']
            d['answer'] = 0
            if 'tag' in new: d['tag'] = new['tag']
            if 'diff' in new: d['diff'] = new['diff']
            if 'qtype' in new: d['qtype'] = new['qtype']
            assert len(d['options']) == 4 and len(set(d['options'])) == 4, new['q']
            assert all(k in d['exp'] for k in '✅❌📚'), new['q']
            body = d['q'] + ''.join(d['options']) + d['exp']
            assert not re.search(r'[Ѐ-ӿ぀-ヿ가-힯]', body), '混進西里爾/假名/諺文：' + new['q']
            # 中文句子裡混進英文單字（例如「背風side」）。科學單位是正常的，所以只擋
            # 「小寫英文字母直接黏在中文字旁邊」且不在白名單裡的情形。
            # ⚠️ 英文科不適用：那一科的題目本來就是中英夾雜（題幹中文、例句英文）。
            for m in ([] if '/english' in subj_dir else
                      re.finditer(r'[\u4e00-\u9fff]([a-z]{2,})|([a-z]{2,})[\u4e00-\u9fff]', body)):
                w = m.group(1) or m.group(2)
                assert w in ('nm', 'mm', 'cm', 'km', 'kg', 'mol', 'ppm', 'pc', 'eV', 'sp',
                             'ml', 'mg', 'hf', 'ma', 'gh', 'pH'), '中文裡混進英文「%s」：%s' % (w, new['q'])
            lines[lineno - 1] = json.dumps(d, ensure_ascii=False)
            total += 1
            if verbose:
                print('  %s:%d  換掉「%s」' % (fname, lineno, old_q[:26]))
        open(p, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    return total
