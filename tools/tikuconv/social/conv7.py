# -*- coding: utf-8 -*-
"""批5-3：社會看圖題 → 單選＋臺灣位置與周邊島嶼地圖

原題是「在地圖代號上填國家／海洋／島嶼名稱」，線上沒辦法填圖，因此改成看圖選答：
圖上標了鄰國、四周海域與周邊島嶼，題目改問方位關係（東北邊是誰、西邊隔什麼海峽…），
既要看圖也要懂概念。圖：img/social/taiwan-location.webp —— 底圖由 gen-image.sh（Gemini）畫（Tony 2026-08-19：
地圖類不要自己用向量畫，很醜），中文標籤用 tools/tikuconv/mkfig_taiwan.html 疊上去再截圖。
"""
import json, collections
from conv1 import SRC, lesson_of, sortkey
from conv3 import kps_of, tail

its = {i['no']: i for i in json.load(open('items.json'))}
out = []
used = collections.Counter()
MAP = 'img/social/taiwan-location.webp'

def q(no, question, opts, ai, why, img=MAP):
    it = its[no]
    les = lesson_of(it)
    assert len(set(opts)) == len(opts) and 2 <= len(opts) <= 4, no
    used[no] += 1
    k = used[no]
    sh = ((int(no[-2:]) + k) % len(opts) - ai) % len(opts)
    if sh:
        opts = opts[-sh:] + opts[:-sh]
        ai = (ai + sh) % len(opts)
    o = {
        'id': 'oc' + no + '-m' + str(k), 'grade': 5, 'book': '五上', 'lesson': les,
        'tag': (kps_of(it)[0] if kps_of(it) else ''), 'diff': it['diff'], 'qtype': '看圖題',
        'q': question, 'options': opts, 'answer': ai,
        'exp': '\n'.join(['✅ 正解：' + opts[ai], '💡 ' + why] + tail(it, les)), 'src': SRC[it['cat']],
    }
    if img:
        o['img'] = img
    out.append(o)

# ---- 臺灣地理位置圖 ----
q('1505001405', '看臺灣位置圖：臺灣東北方隔著東海，和哪兩個國家相望？',
  ['日本、南韓（韓國）', '中國、菲律賓', '菲律賓、日本', '中國、南韓（韓國）'], 0,
  '日本與南韓都在臺灣的東北方，中間隔著東海；中國在西邊、菲律賓在南邊。')
q('1505001405', '看臺灣位置圖：臺灣西邊隔著哪一個海峽和中國相望？',
  ['臺灣海峽', '巴士海峽', '東海', '南海'], 0,
  '臺灣海峽在臺灣與中國之間，最窄處約 130 公里；巴士海峽在南邊，隔開臺灣與菲律賓。')
q('1505001405', '看臺灣位置圖：臺灣南邊隔著巴士海峽，和哪一個國家相鄰？',
  ['菲律賓', '日本', '南韓（韓國）', '中國'], 0,
  '菲律賓在臺灣南方，中間隔著巴士海峽；這條海峽也是船隻往來南海與太平洋的重要通道。')
q('1505001405', '看臺灣位置圖：臺灣東邊面對的是哪一個大洋？',
  ['太平洋', '大西洋', '印度洋', '北極海'], 0,
  '臺灣位在亞洲東部、太平洋西側，東邊直接面對太平洋，因此有「亞洲進出太平洋的門戶」之稱。')

# ---- 臺灣島及周邊島嶼位置圖 ----
q('1505001654', '看位置圖：金門、馬祖靠近哪一個國家的沿海？',
  ['中國', '日本', '菲律賓', '南韓（韓國）'], 0,
  '金門在中國福建廈門外海、馬祖在福建閩江口外，兩者離中國沿海很近，卻是臺灣（金門縣、連江縣）的一部分。')
q('1505001654', '看位置圖：澎湖群島位在臺灣本島的哪一個方向？',
  ['西方（臺灣海峽上）', '東方（太平洋上）', '北方（東海上）', '南方（巴士海峽上）'], 0,
  '澎湖群島在臺灣海峽上、臺灣本島的西邊，是臺灣面積最大的離島群。')
q('1505001654', '看位置圖：綠島、蘭嶼位在臺灣本島的哪一個方向？',
  ['東南方', '西北方', '正北方', '正西方'], 0,
  '綠島與蘭嶼都在臺東外海、臺灣本島的東南方；蘭嶼是雅美族（達悟族）的居住地。')
q('1505001654', '看位置圖：哪一個島嶼位在臺灣本島東北方的海面上，外形看起來像烏龜？',
  ['龜山島', '琉球嶼（小琉球）', '澎湖群島', '蘭嶼'], 0,
  '龜山島在宜蘭外海、臺灣本島的東北方，因為外形像浮在海上的烏龜而得名。')

# ---- 不需要圖的（北部海岸多岬角灣澳） ----
q('1505000417', '臺灣某處海岸多岬角與灣澳，海水較深，因此興建許多港口，方便捕魚與貨物運送。這裡最可能是哪一處海岸？',
  ['北部海岸', '東部海岸', '西部海岸', '南部海岸'], 0,
  '北部海岸岩石海岸多岬角與海灣，灣澳水深、風浪較小，適合闢建漁港與商港（如基隆港）。西部是沙岸水淺、東部多斷崖，都不利建港。',
  None)

if __name__ == '__main__':
    ids = [o['id'] for o in out]
    assert len(ids) == len(set(ids))
    out.sort(key=lambda o: (sortkey(its[o['id'][2:12]]), o['id']))
    json.dump(out, open('batch5c.json', 'w'), ensure_ascii=False)
    print('批5-3 社會看圖題轉出', len(out), '題（配圖', len([o for o in out if o.get('img')]), '題）')
    print(collections.Counter(o['answer'] for o in out))
