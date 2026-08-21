#!/usr/bin/env python3
"""把 index.html 裡本站 js/css 的 ?v= 版本戳統一換成今天（或指定值）。

為什麼要這支：這是純靜態站，GitHub Pages 回 Cache-Control: max-age=600，
瀏覽器會把 js/app.js 快取起來。改完版如果網址沒變，使用者手機上最多要等 10 分鐘
才看得到新版——2026-08-21 Tony 回報「我看還是有鎖」就是這個原因（程式已經改好、
線上檔案也對，是他手機拿到舊的 app.js）。把 ?v= 換掉等於換一個網址，快取立刻失效。

用法：
    python3 tools/stamp-version.py           # 蓋今天的日期（20260821a）
    python3 tools/stamp-version.py 20260821b # 指定戳記（同一天上第二次版時用）

⚠️ 每次改到 js/ 或 css/ 的內容、要 push 上線之前都要跑一次，再一起 commit。
"""
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / 'index.html'

stamp = sys.argv[1] if len(sys.argv) > 1 else date.today().strftime('%Y%m%d') + 'a'
html = INDEX.read_text(encoding='utf-8')

# 只蓋本站的相對路徑（js/… css/…），外部 CDN 不碰
PAT = re.compile(r'(?P<attr>src|href)="(?P<path>(?:js|css)/[^"?]+\.(?:js|css))(?:\?v=[^"]*)?"')


def repl(m):
    return f'{m.group("attr")}="{m.group("path")}?v={stamp}"'


new, n = PAT.subn(repl, html)
if new != html:
    INDEX.write_text(new, encoding='utf-8')
print(f'版本戳 {stamp}：更新 {n} 個 js/css 連結'
      f'{"" if new != html else "（內容沒變，可能已經是這個戳記）"}')
