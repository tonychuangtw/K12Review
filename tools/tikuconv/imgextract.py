# -*- coding: utf-8 -*-
"""把題本 docx 裡的插圖抽出來，並對應到題號。

parse.py 只記「這題有幾張圖」（img 欄位），沒記是哪張。這支照同樣的段落走法，
額外抓 <a:blip r:embed> / <v:imagedata r:id>，用 word/_rels/document.xml.rels 換成
word/media/xxx，輸出成 <out>/<題號>-<序號>.<副檔名>，並寫一份 imgmap.json：
    {"1505000123": ["1505000123-1.png", ...], ...}

用法：python3 imgextract.py <題本根目錄> <輸出目錄>
      python3 imgextract.py 五上社會題本檔案 imgs
"""
import zipfile, re, os, json, sys, collections

HEAD = re.compile(r'^\s*題號：(\d+)\s*難易度：(\S)')
REL = re.compile(r'<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"')
IMGREF = re.compile(r'<a:blip[^>]*r:embed="([^"]+)"|<v:imagedata[^>]*r:id="([^"]+)"')

def rels_of(z):
    try:
        xml = z.read('word/_rels/document.xml.rels').decode('utf8')
    except KeyError:
        return {}
    return {m.group(1): m.group(2) for m in REL.finditer(xml)}

def extract(path, outdir, imgmap):
    z = zipfile.ZipFile(path)
    rels = rels_of(z)
    xml = z.read('word/document.xml').decode('utf8')
    cur = None
    for m in re.finditer(r'<w:p[ >].*?</w:p>', xml, re.S):
        s = m.group(0)
        t = ''.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>', s, re.S)).strip()
        h = HEAD.match(t)
        if h:
            cur = h.group(1)
            continue
        if cur is None:
            continue
        for r in IMGREF.finditer(s):
            rid = r.group(1) or r.group(2)
            tgt = rels.get(rid)
            if not tgt:
                continue
            name = 'word/' + tgt.lstrip('/') if not tgt.startswith('word/') else tgt
            try:
                data = z.read(name)
            except KeyError:
                try:
                    data = z.read(tgt)
                except KeyError:
                    continue
            ext = os.path.splitext(tgt)[1] or '.png'
            k = len(imgmap.get(cur, [])) + 1
            fn = f'{cur}-{k}{ext}'
            with open(os.path.join(outdir, fn), 'wb') as f:
                f.write(data)
            imgmap.setdefault(cur, []).append(fn)

def main():
    root, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    imgmap = {}
    n = 0
    for dirpath, _, files in os.walk(root):
        for f in sorted(files):
            if not f.lower().endswith(('.doc', '.docx')):
                continue
            try:
                extract(os.path.join(dirpath, f), outdir, imgmap)
                n += 1
            except zipfile.BadZipFile:
                print('不是 docx，略過：', f)
    print('掃過檔案', n, '有圖的題', len(imgmap), '圖檔總數', sum(len(v) for v in imgmap.values()))
    json.dump(imgmap, open(os.path.join(outdir, 'imgmap.json'), 'w'), ensure_ascii=False, indent=1)
    ext = collections.Counter(os.path.splitext(v)[1] for vs in imgmap.values() for v in vs)
    print('副檔名分布', dict(ext))

if __name__ == '__main__':
    main()
