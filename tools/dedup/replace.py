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
            assert not re.search(r'[Ѐ-ӿ぀-ヿ가-힯]', d['q'] + ''.join(d['options']) + d['exp']), new['q']
            lines[lineno - 1] = json.dumps(d, ensure_ascii=False)
            total += 1
            if verbose:
                print('  %s:%d  換掉「%s」' % (fname, lineno, old_q[:26]))
        open(p, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    return total
