# -*- coding: utf-8 -*-
"""自然批5-7：有圖的題組題（閱讀短文＋子題）→ 逐子題單選

（批2c 只轉沒有圖的；這一支放行有圖的——這些題的短文與 ①②③④ 選項都在文字裡，
 插圖只是配圖。仍然只從文字切子題，切不出來的自然會跳過。）

原批2c 說明：

有 ①②③④ 選項的題組是機械轉：短文原文一字不動保留在題幹最前面，子題與選項照原檔，
原詳解依子題序號拆開放進解析。開放式（要用寫的）的題組另由 conv2e.py 人工撰寫。
"""
import json, re, collections
from convsci import SRC, lesson_of, sortkey, kps_of, tail, base

its = json.load(open('items.json'))
CIRC = '①②③④'
BLANK = re.compile(r'[（(][　\s]*[)）]')          # 子題前面的空作答格

def sub_chunks(body):
    """用空作答格切出各子題；回傳 (短文, [(序號, 子題文字)])"""
    marks = list(BLANK.finditer(body))
    if len(marks) < 2:
        return None, []
    passage = body[:marks[0].start()].strip()
    subs = []
    for i, m in enumerate(marks):
        end = marks[i + 1].start() if i + 1 < len(marks) else len(body)
        txt = body[m.end():end].strip()
        n = re.match(r'^[（(]?(\d{1,2})[)）]?\s*[.、．]?\s*', txt)
        idx = int(n.group(1)) - 1 if n else i
        if n:
            txt = txt[n.end():]
        subs.append((idx, txt.strip()))
    return passage, subs

def split_opts(txt):
    i = txt.find('①')
    if i < 0:
        return None, None
    head = txt[:i].strip()
    parts = re.split('[' + CIRC + ']', txt[i:])
    opts = [p.strip().strip('。').strip() for p in parts[1:]]
    if len(opts) != 4 or not all(opts) or len(set(opts)) != 4:
        return None, None
    # 選項裡若混進下一個子題的編號或長到不像選項，代表切壞了（例如下一子題是填空、沒有空作答格）
    for o in opts:
        if len(o) > 40 or re.search(r'[（(]\d{1,2}[)）]', o) or '？' in o:
            return None, None
    return head, opts

def ans_map(ans):
    out = {}
    for m in re.finditer(r'[（(]?(\d{1,2})[)）]?\s*[.、．]?\s*([' + CIRC + '])', ans or ''):
        out[int(m.group(1)) - 1] = CIRC.index(m.group(2))
    return out

def exp_map(e):
    out = {}
    if not e:
        return out
    hits = list(re.finditer(r'[（(](\d{1,2})[)）]', e))
    for i, m in enumerate(hits):
        end = hits[i + 1].start() if i + 1 < len(hits) else len(e)
        txt = e[m.end():end].strip(' 　；;')
        if len(txt) >= 4:
            out[int(m.group(1)) - 1] = txt
    return out

if __name__ == '__main__':
    out = []
    skip = collections.Counter()
    import glob
    done = set()
    for f in glob.glob('sci*.json'):
        if f.endswith('sci10.json'):
            continue
        try:
            rows = json.load(open(f))
        except Exception:
            continue
        for r in rows if isinstance(rows, list) else []:
            if isinstance(r, dict) and 'id' in r:
                done.add(r['id'][2:12])
    picked = sorted([i for i in its if i['sec'] == '題組題'], key=sortkey)
    for it in picked:
        if it['no'] in done:
            skip['已轉過'] += 1
            continue
        body = ' '.join(it['body'])
        if '①' not in body:
            skip['開放式（另由 conv2e 人工撰寫）'] += 1
            continue
        passage, subs = sub_chunks(body)
        if not subs:
            skip['切不出子題'] += 1
            continue
        amap, emap = ans_map(it['ans']), exp_map(it['exp'])
        les = lesson_of(it)
        got = 0
        for idx, txt in subs:
            head, opts = split_opts(txt)
            if not head or idx not in amap:
                skip['子題切不出選項/沒答案'] += 1
                continue
            ai = amap[idx]
            exp = ([emap[idx]] if idx in emap else []) + ['✅ 正解：' + opts[ai]]
            q = (passage + '\n' + head) if len(passage) > 10 else head
            o = base(it, les, '題組題', q, opts, ai, '\n'.join(exp + tail(it, les)))
            o['id'] = o['id'] + '-' + str(idx + 1)
            out.append(o)
            got += 1
        if not got:
            skip['整題都沒收到'] += 1
    # 題幹指涉我們沒搬過來的圖表／前一小題 → 改寫成自足題幹，改不動的直接不收
    FIX = {
        'nc1505001514-2': None,   # 「接續第1題，甲、乙兩支直笛」——第1題是連連看，沒有它就答不了
        'nc1505001521-4': '小名記錄春分、夏至、秋分、冬至四天中午 12 時的太陽高度角。'
                          '從春季到夏季、秋季、冬季，中午的太陽高度角呈現什麼變化？',
    }
    kept = []
    for o in out:
        if o['id'] in FIX:
            if FIX[o['id']] is None:
                continue
            o['q'] = FIX[o['id']]
        kept.append(o)
    out = kept
    print('自然批5-7 有圖題組題轉出', len(out))
    print('跳過', dict(skip))
    print(collections.Counter(o['answer'] for o in out))
    json.dump(out, open('sci10.json', 'w'), ensure_ascii=False)
    for x in out[:2]:
        print('---', json.dumps(x, ensure_ascii=False)[:420])
