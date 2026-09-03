#!/usr/bin/env python3
"""歷屆試題的附圖裁切工具（2026-09-01 Tony：「乙．要全部題都有」＝圖表題也要收）。

流程（0 token，純指令）：
  1. 先看整頁：python3 tools/exam-crop.py page <試卷.pdf> <頁碼> [out.png]
     （預設 100 dpi，會印出圖片尺寸，用來抓裁切座標）
  2. 再裁圖：python3 tools/exam-crop.py crop <試卷.pdf> <頁碼> <x> <y> <w> <h> <輸出路徑.webp>
     x/y/w/h 是「100 dpi 那張圖」上的像素座標；工具會自動換算成 200 dpi 重新算圖，
     所以裁出來的圖是兩倍解析度，手機上放大也清楚。

輸出一律 webp（cwebp -q 82），檔案放在 img/exam/<卷 id>/ 底下。
需要 poppler-utils 的 pdftoppm 與 cwebp，兩者本機都有。

⭐ 基測（90-102）的掃描題本上有粉紅色「新聞試題本」浮水印，兩個指令都可以加 `--depink`，
   會在轉檔前呼叫 tools/depink.sh 把粉紅色去掉（黑字完整保留）。例：
     python3 tools/exam-crop.py page 102B_Math.pdf 2 p2.png --depink
     python3 tools/exam-crop.py crop 102B_Math.pdf 2 600 300 160 160 out.webp --depink
"""
import subprocess, sys, os, tempfile

VIEW_DPI = 100          # 看整頁用的解析度（也是座標的基準）
OUT_DPI = 200           # 實際裁切輸出的解析度


def run(cmd):
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        sys.exit('指令失敗：' + ' '.join(cmd) + '\n' + r.stderr.decode('utf-8', 'ignore'))
    return r


DEPINK = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'depink.sh')


def depink(png):
    """去掉基測掃描題本的粉紅色浮水印（就地覆寫）。"""
    tmp = png + '.dp.png'
    run([DEPINK, png, tmp])
    os.replace(tmp, png)


def page(pdf, pno, out, dp=False):
    prefix = out[:-4] if out.endswith('.png') else out
    run(['pdftoppm', '-r', str(VIEW_DPI), '-f', pno, '-l', pno, '-png', '-singlefile', pdf, prefix])
    if dp:
        depink(prefix + '.png')
    print(prefix + '.png')


def crop(pdf, pno, x, y, w, h, out, dp=False):
    k = OUT_DPI / VIEW_DPI
    args = ['-x', str(int(x * k)), '-y', str(int(y * k)), '-W', str(int(w * k)), '-H', str(int(h * k))]
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        prefix = os.path.join(td, 'crop')
        run(['pdftoppm', '-r', str(OUT_DPI), '-f', pno, '-l', pno, '-png', '-singlefile'] + args + [pdf, prefix])
        if dp:
            depink(prefix + '.png')
        run(['cwebp', '-quiet', '-q', '82', prefix + '.png', '-o', out])
    print(out, os.path.getsize(out), 'bytes')


if __name__ == '__main__':
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    argv = [a for a in sys.argv if a != '--depink']
    dp = '--depink' in sys.argv
    mode = argv[1]
    if mode == 'page':
        page(argv[2], argv[3], argv[4] if len(argv) > 4 else 'page.png', dp)
    elif mode == 'crop':
        _, _, pdf, pno, x, y, w, h, out = argv
        crop(pdf, pno, int(x), int(y), int(w), int(h), out, dp)
    else:
        sys.exit(__doc__)
