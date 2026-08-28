#!/usr/bin/env python3
"""下載教育部《國語辭典簡編本》開放資料，抽出「詞條 → 注音」索引供 moe-zy-audit.js 比對。

為什麼用簡編本：它的編輯說明載明「本辭典所收的字音，參照教育部公布之《國語一字多音
審訂表》」，是中小學該用的那一本；《重編國語辭典修訂本》是兼收古今音的歷史語言辭典，
兩本在「蜿蜒」「包紮」這類詞上會給不同的音（2026-08-28 校正時實測）。

產物放 .cache/（已 gitignore）。原始資料為教育部開放資料，授權 CC BY-ND 3.0 TW，
故只在本機下載使用，不把衍生索引提交進 repo。
"""
import io, json, os, re, sys, urllib.request, zipfile
import xml.etree.ElementTree as ET

URL = ('https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/'
       'download/dict_concised_2014_20260626.zip')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, '.cache')
ZIPP = os.path.join(CACHE, 'dict_concised.zip')
OUT = os.path.join(CACHE, 'moe-concised.json')
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'


def download():
    os.makedirs(CACHE, exist_ok=True)
    if os.path.exists(ZIPP) and os.path.getsize(ZIPP) > 1_000_000:
        return
    print('下載教育部簡編本開放資料…', file=sys.stderr)
    urllib.request.urlretrieve(URL, ZIPP)


def build():
    z0 = zipfile.ZipFile(ZIPP)
    name = [n for n in z0.namelist() if n.endswith('.xlsx')][0]
    z = zipfile.ZipFile(io.BytesIO(z0.read(name)))
    ss = []
    for _, el in ET.iterparse(z.open('xl/sharedStrings.xml'), events=('end',)):
        if el.tag == NS + 'si':
            ss.append(''.join(t.text or '' for t in el.iter(NS + 't')))
            el.clear()
    idx, py = {}, {}
    hdr = None
    for _, el in ET.iterparse(z.open('xl/worksheets/sheet1.xml'), events=('end',)):
        if el.tag != NS + 'row':
            continue
        cells = {}
        for c in el.findall(NS + 'c'):
            col = re.match(r'[A-Z]+', c.get('r')).group(0)
            v = c.find(NS + 'v')
            if v is None:
                isv = c.find(NS + 'is')
                val = ''.join(x.text or '' for x in isv.iter(NS + 't')) if isv is not None else ''
            else:
                val = ss[int(v.text)] if c.get('t') == 's' else v.text
            cells[col] = val
        el.clear()
        if hdr is None:
            hdr = cells
            continue
        w = (cells.get('A') or '').strip()
        if not w:
            continue
        g = (cells.get('G') or '').replace('　', ' ').strip()   # 注音一式
        i = (cells.get('I') or '').replace('　', ' ').strip()   # 變體注音
        j = (cells.get('J') or '').strip()                          # 漢語拼音
        e = idx.setdefault(w, {'main': [], 'alt': []})
        if g:
            e['main'].append(g)
        if i:
            e['alt'].append(i)
        if len(w) == 1 and g and ' ' not in g and j:
            py.setdefault(g, j)
    json.dump({'idx': idx, 'zy2py': py}, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'索引完成：{len(idx)} 詞條、{len(py)} 個注音→拼音對照 → {OUT}', file=sys.stderr)


if __name__ == '__main__':
    download()
    build()
