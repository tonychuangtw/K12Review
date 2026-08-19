# -*- coding: utf-8 -*-
"""自然批5-6：勾選題／活用題「有圖但選項寫在題目文字裡」的那些 → 沿用批2a 同一套規則

（原批2a 只要有圖就跳過；這一支放行有圖的，但小題仍然只從題目文字切，
 選項只印在圖片裡的題自然會因為切不出小題而跳過，留給人工讀圖處理。）

原批2a 說明：

沿用社會批3 的規則：
  · 一個原題拆成多個小題，id 為「nc原題號-序號」
  · 勾選題：答案列出的編號＝正確敘述，其餘＝錯誤敘述
  · 錯的小題若原檔沒有對應詳解就不收（不生出沒有解析的題）
  · 有圖的題留給後續批次
小題標記三種都支援：甲乙丙丁、(1)(2)(3)、①②③
"""
import json, re, collections
from convsci import SRC, lesson_of, sortkey, kps_of, tail, base

its = json.load(open('items.json'))
GAN = '甲乙丙丁戊己庚辛壬癸'
CIRC = '①②③④⑤⑥⑦⑧⑨⑩'

def idx_of(t):
    """'甲'/'①'/'3' → 0-based 序號。注意 '①'.isdigit() 也是 True，要先判圈號"""
    if t in GAN:
        return GAN.index(t)
    if t in CIRC:
        return CIRC.index(t)
    return int(t) - 1

def split_subs(body):
    """回傳 ([(idx, 文字)], 第一個標記的位置)；三種標記擇一（以切出最多小題者為準）"""
    cands = []
    # 甲.／甲、
    m = [(GAN.index(x.group(1)), x.start(), x.end()) for x in re.finditer('([' + GAN + r'])[.、．,]', body)]
    cands.append(m)
    # (1) （1） 1.
    m = [(int(x.group(1)) - 1, x.start(), x.end()) for x in re.finditer(r'[（(](\d{1,2})[)）]', body)]
    cands.append(m)
    # ①②③
    m = [(CIRC.index(x.group(1)), x.start(), x.end()) for x in re.finditer('([' + CIRC + '])', body)]
    cands.append(m)
    best = max(cands, key=len)
    if len(best) < 2:
        return [], 0
    out = []
    for i, (idx, s, e) in enumerate(best):
        nxt = best[i + 1][1] if i + 1 < len(best) else len(body)
        out.append((idx, body[e:nxt]))
    return out, best[0][1]     # 小題清單 + 第一個標記的位置（題幹到此為止）

def marks_of(ans, subs):
    """答案 → {idx: 對/錯}；讀不出回 None"""
    if '○' in ans or '╳' in ans:
        mk = {}
        for m in re.finditer(r'[（(]?(\d{1,2}|[' + GAN + CIRC + r'])[)）]?\s*[.、．]?\s*([○╳])', ans):
            t = m.group(1)
            idx = idx_of(t)
            mk[idx] = m.group(2) == '○'
        if len(mk) != len(subs):
            return None
        return mk
    checked = set()
    for m in re.finditer(r'[（(](\d{1,2})[)）]', ans):
        checked.add(int(m.group(1)) - 1)
    for ch in ans:
        if ch in GAN:
            checked.add(GAN.index(ch))
        elif ch in CIRC:
            checked.add(CIRC.index(ch))
    if not checked:
        return None
    return {idx: idx in checked for idx, _ in subs}

def exp_by_index(it):
    """原詳解依 (1)／甲／① 拆成 {idx: 說明}"""
    out = {}
    if not it['exp']:
        return out
    e = it['exp']
    hits = [(m, m.start()) for m in re.finditer(r'[（(](\d{1,2})[)）]|([' + GAN + CIRC + '])', e)]
    for i, (m, s) in enumerate(hits):
        t = m.group(1) or m.group(2)
        idx = idx_of(t)
        nxt = hits[i + 1][1] if i + 1 < len(hits) else len(e)
        txt = e[m.end():nxt].strip(' 　；;。')
        if len(txt) >= 4:
            out[idx] = txt
    return out

def clean(t):
    t = re.sub(r'[_＿]{2,}', '', t)
    t = re.sub(r'[（(][\s　]*[)）]', '', t)          # 空的（　）作答格
    t = t.replace('□', '').replace('■', '')
    t = re.sub(r'其他\s*[:：].*$', '', t)            # 「其他：____」尾巴
    t = re.sub(r'^[　\s.、．]+', '', t)
    t = re.sub(r'[　\s]+', ' ', t)
    return t.strip().strip('。').strip()

def stem_of(body, first_pos):
    """題幹＝第一個小題標記之前的文字，去掉「請在□中打ˇ」這類作答指示語"""
    st = body[:first_pos]
    st = re.sub(r'請[^。？]{0,15}?打[^。？]{0,8}', '', st)      # 請（在正確的□中）打ˇ／打○
    st = re.sub(r'(請)?(勾選|圈選|選出)[^。？]{0,10}$', '', st)
    st = re.sub(r'[（(][\s　]*[)）]', '', st)
    st = st.replace('□', '').replace('　', ' ')
    st = re.sub(r'\s+', ' ', st).strip()
    return st.rstrip('，,。：: ').strip()

def usable(txt):
    return 6 <= len(txt) <= 60 and '？' not in txt and '?' not in txt

def pick(correct, others, seed):
    """1 個正解 + 最多 3 個誘答（至少 2 個），正解位置依 seed 決定性打散"""
    ch = [correct] + others[:3]
    if len(ch) < 3:
        return None, None
    pos = seed % len(ch)
    rest = ch[1:]
    return rest[:pos] + [correct] + rest[pos:], pos

# 題幹提到「下表／如圖」但我們沒有把那張表圖搬進來 → 改寫成自足的題幹；None＝題幹殘缺不收
STEM_FIX = {
    '1505001542': '小柚的班級在春分、夏至、秋分、冬至的正午各量一次 50 公分竹竿的影子長度，也記錄當天太陽升起的方位。下列敘述哪些是正確的？',
    '1505002118': '根據四季代表日的太陽觀測紀錄，下列哪些敘述是正確的？',
    '1505000699': 'A、B、C 三個裝有鋼絲絨球的塑膠杯，A 滴水、B 不滴水、C 滴醋，靜置一段時間後比較鋼絲絨球的變化。下列敘述哪些是正確的？',
    '1505002115': '看「嘉義地區一年中的太陽運行軌跡圖」，下列敘述哪些是正確的？',
    '1505001747': '利用太陽觀測器觀測太陽時，應注意哪些事項？',
    '1505001161': '用一隻手分別按住弦的不同位置，再用另一隻手彈撥同一條弦，會發出高低不同的聲音。下列敘述哪些是正確的？',
    '1505001452': None,
}
IMG_FIX = {'1505002115': 'img/sci/sun-seasons.svg'}

if __name__ == '__main__':
    out = []
    skip = collections.Counter()
    import glob
    done = set()
    for f in glob.glob('sci*.json'):
        if f.endswith('sci9.json'):   # 自己的輸出不算「已轉過」
            continue
        try:
            rows = json.load(open(f))
        except Exception:
            continue
        for r in rows if isinstance(rows, list) else []:
            if isinstance(r, dict) and 'id' in r:
                done.add(r['id'][2:12])
    picked = sorted([i for i in its if i['sec'] in ('勾選題', '活用題')], key=sortkey)
    for it in picked:
        if it['no'] in done:
            skip['已轉過'] += 1
            continue
        body = ' '.join(it['body'])
        raw, first = split_subs(body)
        if len(raw) < 2:
            skip['切不出小題'] += 1
            continue
        # 一個原題裡若混了兩組小題（編號不是嚴格遞增），拆出來的選項會跨題混在一起 → 不收
        idxs = [i for i, _ in raw]
        if idxs != sorted(set(idxs)) or idxs[0] != 0:
            skip['一題內含多組小題→不收'] += 1
            continue
        mk = marks_of((it['ans'] or ''), raw)
        if mk is None:
            skip['答案讀不出/數量不合'] += 1
            continue
        subs = [(i, clean(t)) for i, t in raw if i in mk]
        subs = [(i, t) for i, t in subs if usable(t)]
        if len(subs) < 2:
            skip['小題文字不適用'] += 1
            continue
        exps = exp_by_index(it)
        les = lesson_of(it)
        seed = int(it['no'][-2:])
        stem = stem_of(body, first)
        if it['no'] in STEM_FIX:
            if STEM_FIX[it['no']] is None:
                skip['題幹殘缺不收'] += 1
                continue
            stem = STEM_FIX[it['no']]
        stem = re.sub(r'[，,]?\s*(下列敘述)?正確的$', '', stem).strip('，, ')
        C = [t for i, t in subs if mk[i]]
        U = [t for i, t in subs if not mk[i]]
        origexp = (it['exp'].strip() + '\n') if it['exp'] else ''
        if '○' in (it['ans'] or '') or '╳' in (it['ans'] or ''):
            # 活用題：小題本身就是一句敘述，逐句轉是非題（錯的沒詳解不收）
            n = 0
            for i, txt in subs:
                ok = mk[i]
                if not ok and i not in exps:
                    skip['錯的小題無原詳解→不收'] += 1
                    continue
                e = ([exps[i]] if i in exps else [])
                e.append('✅ 正解：○（敘述正確）\n💡 這句話本身就是本課重點，記起來：' + txt if ok
                         else '✅ 正解：╳（敘述不正確，正確說法見上面的說明）')
                o = base(it, les, '是非題', '判斷對錯：' + txt, ['○ 正確', '╳ 錯誤'], 0 if ok else 1,
                         '\n'.join(e + tail(it, les)))
                o['id'] = o['id'] + '-' + str(i + 1)
                out.append(o)
                n += 1
            if not n:
                skip['整題都沒收到'] += 1
            continue
        # 勾選題：原題是複選，改成單選（正解＝勾的那項，誘答＝沒勾的），答案位置打散
        if len(stem) < 6:
            skip['讀不出題幹'] += 1
            continue
        made = 0
        if C and len(U) >= 2:
            opts, ai = pick(C[0], U, seed)
            if opts:
                o = base(it, les, '勾選改單選', stem + '\n（單選：下列哪一項符合？）', opts, ai,
                         '\n'.join([origexp + '✅ 正解：' + C[0],
                                    '💡 其餘選項都不符合題目的要求。'] + tail(it, les)))
                o['id'] = o['id'] + '-a'
                if it['no'] in IMG_FIX:
                    o['img'] = IMG_FIX[it['no']]
                out.append(o)
                made += 1
        if U and len(C) >= 2:
            opts, ai = pick(U[0], C, seed + 1)
            if opts:
                o = base(it, les, '勾選改單選', stem + '\n（單選：下列哪一項「不」符合？）', opts, ai,
                         '\n'.join([origexp + '✅ 正解：' + U[0],
                                    '💡 其餘選項都符合題目的要求，只有這一項不符合。'] + tail(it, les)))
                o['id'] = o['id'] + '-b'
                if it['no'] in IMG_FIX:
                    o['img'] = IMG_FIX[it['no']]
                out.append(o)
                made += 1
        if not made:
            skip['勾選題選項數不足'] += 1
    print('自然批5-6 轉出', len(out))
    print('跳過', dict(skip))
    print(collections.Counter(o['qtype'] for o in out), collections.Counter(o['answer'] for o in out))
    json.dump(out, open('sci9.json', 'w'), ensure_ascii=False)
    import random
    random.seed(3)
    for x in random.sample(out, 5):
        print('---', json.dumps(x, ensure_ascii=False)[:400])
