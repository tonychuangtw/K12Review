# 題本轉檔腳本（社會／自然自創題庫）

Tony 提供的五上社會／自然題本（.doc 其實是 docx）→ `js/data/social-custom.js`、`js/data/science-custom.js`
的轉檔流程。原本放在 session scratchpad，因為裡面有大量**逐題人工撰寫的誘答與解析**，
移進 repo 保存，之後五下、六年級與其他科目照同一套流程走。

⚠️ **題本原檔與 `items.json` 不在 repo 裡**（出版社題本有版權，只保留轉檔後的原創解析）。
要重跑必須先有 `items.json`（`parse.py` 從題本產生），把它放在對應目錄下再執行。

## 社會（social/）

| 腳本 | 做什麼 |
| --- | --- |
| `parse.py` | 題本 docx → `items.json`（no/diff/sec/cat/lesson/kp/body/ans/exp/img） |
| `conv1.py` | 批1：選擇題＋高層次思考題 → 選擇題（機械轉），並提供 `SRC`/`lesson_of`/`sortkey` 給其他批次 |
| `conv2.py` | 批2：是非題 → ○╳ 二選一 |
| `conv3.py` | 批3：活用題／勾選題／圈圈看 → 拆小題；另提供 `kps_of`/`tail`/`exp_by_index` |
| `batch3b.py` | 批3b：排序題 6 題（逐題人工撰寫） |
| `conv4.py` | 批4a：配合題 → 逐格單選 |
| `conv4b.py` | 批4b-1：填填看 93 題（選項與解析人工撰寫） |
| `conv4c.py` | 批4b-2：回答問題 80 題（題幹改寫成單選，誘答人工撰寫） |
| `emit.py` | `batch*.json` → `js/data/social-custom.js`（含去重與檔頭題數） |
| `orig1.py`／`orig2.py`／`emit-orig.py` | 依課綱自編的**原創題**（`js/data/social.js`），與題本無關 |

重跑：`python3 emit.py batch1.json batch2.json batch3.json batch3b.json batch4a.json batch4b1.json batch4b2.json`

## 自然（sci/）

| 腳本 | 做什麼 |
| --- | --- |
| `parse.py` | 分卷 zip（.zip + .z01）自行解中央目錄後取題目 → `items.json` |
| `convsci.py` | 批1：選擇題＋是非題；提供 `lesson_of`/`tail`/`base` 給其他批次 |
| `convsci2.py` | 批2a：勾選題／活用題 → **複選改單選**（問「哪一項符合／不符合」） |
| `conv2b.py` | 批2b：填填看 → 分類題／是非題／填空題（人工撰寫） |
| `conv2c.py` | 批2b-2：回答問題 → 單選（人工撰寫） |
| `emit.py` | `sci*.json` → `js/data/science-custom.js` |

重跑：`python3 emit.py sci1.json sci2a.json sci2b.json sci2c.json`

## 共用

- `append.js`：把新一批**原創題** JSON 接到 `js/data/<科目>.js` 陣列尾巴並更新檔頭題數，
  同時把正解位置打散（手寫時容易全部擺第一個）。
  用法：`node tools/tikuconv/append.js <新題.json> js/data/social.js o 4`
- 轉完一律跑 `node test/test.js`（會擋掉沒有解析、選項重複、答案位置過度集中等問題）。
