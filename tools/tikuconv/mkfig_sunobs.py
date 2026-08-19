# -*- coding: utf-8 -*-
"""產生「太陽觀測器紀錄圖」SVG（自然五上 03-01）。

題本裡有好幾題都是「看太陽觀測器的紀錄圖回答方位與高度角」，每題的紀錄值不同，
所以做成參數化產生器：給影子方位與高度角，畫出左俯視（方位盤＋影子）＋右側視（高度角）兩格。

用法：python3 mkfig_sunobs.py            # 產生 IMAGES 裡列的所有圖到 img/sci/
      產生後用 node tools/svg-preview.mjs 截圖看過再收。
"""
import math, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'img', 'sci')

# 方位 → 俯視圖上的角度（0 度朝右＝東，逆時針為正；北在上）
DIRS = {
    '東': 0, '東北': 45, '北': 90, '西北': 135,
    '西': 180, '西南': 225, '南': 270, '東南': 315,
}
OPP = {'東': '西', '西': '東', '南': '北', '北': '南',
       '東北': '西南', '西南': '東北', '西北': '東南', '東南': '西北'}

TPL = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 400" width="760" height="400" role="img" aria-labelledby="t d">
  <title id="t">太陽觀測器紀錄圖：影子指向{shadow}方，太陽高度角約 {ang} 度</title>
  <desc id="d">左圖是從上往下看的方位盤，吸管的影子指向{shadow}方，所以太陽在相反的{sun}方；右圖是側面看，棉線與地面的夾角就是太陽高度角，約 {ang} 度。</desc>
  <style>
    .ttl {{ font: 700 18px "Noto Sans TC", "Microsoft JhengHei", sans-serif; fill: #1d2430; }}
    .dir {{ font: 700 19px "Noto Sans TC", "Microsoft JhengHei", sans-serif; fill: #3b4657; }}
    .sm  {{ font: 500 15px "Noto Sans TC", "Microsoft JhengHei", sans-serif; fill: #5b6577; }}
    .em  {{ font: 700 17px "Noto Sans TC", "Microsoft JhengHei", sans-serif; fill: #e2622f; }}
  </style>
  <rect width="760" height="400" fill="#ffffff"/>

  <!-- 左：俯視（方位盤） -->
  <text class="ttl" x="40" y="34">從上往下看（方位盤）</text>
  <circle cx="190" cy="220" r="120" fill="#f4f7fb" stroke="#9aa7b8" stroke-width="2"/>
  <circle cx="190" cy="220" r="80" fill="none" stroke="#dde4ed" stroke-width="1"/>
  <line x1="70" y1="220" x2="310" y2="220" stroke="#dde4ed" stroke-width="1"/>
  <line x1="190" y1="100" x2="190" y2="340" stroke="#dde4ed" stroke-width="1"/>
  <text class="dir" x="182" y="92">北</text>
  <text class="dir" x="182" y="364">南</text>
  <text class="dir" x="318" y="228">東</text>
  <text class="dir" x="46" y="228">西</text>
  <!-- 影子 -->
  <line x1="190" y1="220" x2="{sx}" y2="{sy}" stroke="#3b4657" stroke-width="9" stroke-linecap="round" opacity="0.55"/>
  <text class="em" x="40" y="62">影子指向{shadow}方</text>
  <circle cx="190" cy="220" r="9" fill="#f6c14b" stroke="#e2622f" stroke-width="2.5"/>
  <text class="sm" x="150" y="252">吸管</text>

  <!-- 右：側視（高度角） -->
  <text class="ttl" x="420" y="34">從側面看（量高度角）</text>
  <line x1="420" y1="300" x2="730" y2="300" stroke="#9aa7b8" stroke-width="2.5"/>
  <text class="sm" x="420" y="326">地面</text>
  <!-- 吸管（直立） -->
  <line x1="470" y1="300" x2="470" y2="210" stroke="#3b4657" stroke-width="8" stroke-linecap="round"/>
  <text class="sm" x="428" y="200">吸管</text>
  <!-- 影子 -->
  <line x1="470" y1="300" x2="{ex}" y2="300" stroke="#3b4657" stroke-width="8" stroke-linecap="round" opacity="0.35"/>
  <text class="sm" x="{emx}" y="326" text-anchor="middle">影子</text>
  <!-- 棉線：吸管頂端到影子末端 -->
  <line x1="470" y1="210" x2="{ex}" y2="300" stroke="#e2622f" stroke-width="3" stroke-dasharray="7 5"/>
  <text class="sm" x="{cmx}" y="238" fill="#e2622f">棉線</text>
  <!-- 夾角 -->
  <path d="M {ax},300 A 46,46 0 0,1 {axx},{axy}" fill="none" stroke="#e2622f" stroke-width="2.5"/>
  <text class="em" x="{tx}" y="288" text-anchor="middle">{ang}°</text>
  <text class="sm" x="420" y="366">棉線與地面的夾角＝太陽高度角</text>
  <!-- 太陽 -->
  <circle cx="{sunx}" cy="{suny}" r="15" fill="#f6c14b" stroke="#e2622f" stroke-width="2.5"/>
  <text class="sm" x="{sunx}" y="{sunty}" text-anchor="middle">太陽</text>
</svg>
'''

def make(shadow, ang):
    """shadow=影子方位（DIRS 的鍵）、ang=太陽高度角（度）"""
    a = math.radians(DIRS[shadow])
    sx, sy = 190 + 100 * math.cos(a), 220 - 100 * math.sin(a)
    # 側視：吸管高 90，影長 = 90 / tan(高度角)
    shadow_len = min(230, max(40, 90 / math.tan(math.radians(ang))))
    ex = 470 + shadow_len
    # 夾角弧線起點（影子末端往吸管方向 46px）與終點（棉線上 46px 處）
    ax = ex - 46
    hyp = math.hypot(shadow_len, 90)
    axx = ex - 46 * (shadow_len / hyp)
    axy = 300 - 46 * (90 / hyp)
    return TPL.format(
        shadow=shadow, sun=OPP[shadow], ang=ang,
        sx=round(sx, 1), sy=round(sy, 1),
        ex=round(ex, 1), emx=round(470 + shadow_len / 2, 1), cmx=round(470 + shadow_len / 2 - 20, 1),
        ax=round(ax, 1), axx=round(axx, 1), axy=round(axy, 1), tx=round(ex - 62, 1),
        sunx=round(470 - 70, 1), suny=round(300 - 90 - 70 * math.tan(math.radians(ang)), 1),
        sunty=round(300 - 90 - 70 * math.tan(math.radians(ang)) - 24, 1),
    )

# 檔名 → (影子方位, 高度角)；一張圖可以服務多個原題
IMAGES = {
    'sunobs-ne-20.svg': ('東北', 20),
    'sunobs-nw-45.svg': ('西北', 45),
    'sunobs-nw-52.svg': ('西北', 52),
}

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, (d, a) in IMAGES.items():
        with open(os.path.join(OUT, name), 'w', encoding='utf8') as f:
            f.write(make(d, a))
        print('寫出', name, '影子', d, '高度角', a)
