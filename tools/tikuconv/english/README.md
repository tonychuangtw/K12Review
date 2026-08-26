# 英文原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`x2`…），重建時由 `--renumber e` 統一編號。
檔案順序＝年級順序。規格見 `PROGRESS.md`（一冊 9 單元 = 3 段考 × 3 單元，每單元 8 題）。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| e1.jsonl / e1b.jsonl | 一上 / 一下 | 9 / 9 |
| e2.jsonl / e2b.jsonl | 二上 / 二下 | 9 / 9 |
| e3.jsonl / e3b.jsonl | 三上 / 三下 | 9 / 9 |
| e4.jsonl / e4b.jsonl | 四上 / 四下 | 9 / 9 |
| e5.jsonl / e5b.jsonl | 五上 / 五下 | 9 / 9（五上由原 7 單元 126 題重新歸單元而來） |
| e6.jsonl / e6b.jsonl | 六上 / 六下 | 9 / 9 |
| e7 ~ e12b.jsonl | 七上 ~ 十二下 | 各 9 |

重建（⛔ 24 冊一個都不能漏，漏掉的冊會整批消失）：

```bash
EF=tools/tikuconv/english
node tools/tikuconv/build-bank.js english js/data/english.js $EF/header.txt --renumber e \
  $EF/e1.jsonl $EF/e1b.jsonl $EF/e2.jsonl $EF/e2b.jsonl $EF/e3.jsonl $EF/e3b.jsonl \
  $EF/e4.jsonl $EF/e4b.jsonl $EF/e5.jsonl $EF/e5b.jsonl $EF/e6.jsonl $EF/e6b.jsonl \
  $EF/e7.jsonl $EF/e7b.jsonl $EF/e8.jsonl $EF/e8b.jsonl $EF/e9.jsonl $EF/e9b.jsonl \
  $EF/e10.jsonl $EF/e10b.jsonl $EF/e11.jsonl $EF/e11b.jsonl $EF/e12.jsonl $EF/e12b.jsonl \
  $EF/e5-add1.jsonl $EF/e5b-add1.jsonl $EF/e5b-add2.jsonl \
  $EF/e6-add1.jsonl $EF/e6-add2.jsonl $EF/e6b-add1.jsonl $EF/e6b-add2.jsonl \
  $EF/e7-add1.jsonl $EF/e7-add2.jsonl \
  $EF/e7b-add1.jsonl $EF/e7b-add2.jsonl \
  $EF/e8-add1.jsonl $EF/e8-add2.jsonl \
  $EF/e8b-add1.jsonl $EF/e8b-add2.jsonl \
  $EF/e9-add1.jsonl $EF/e9-add2.jsonl $EF/e9-add3.jsonl \
  $EF/e9b-add1.jsonl $EF/e9b-add2.jsonl \
  $EF/e4-add1.jsonl $EF/e4-add2.jsonl \
  $EF/e4b-add1.jsonl $EF/e4b-add2.jsonl $EF/e4b-add3.jsonl \
  $EF/e3-add1.jsonl $EF/e3-add2.jsonl $EF/e3-add3.jsonl \
  $EF/e3b-add1.jsonl $EF/e3b-add2.jsonl $EF/e3b-add3.jsonl \
  $EF/e2-add1.jsonl $EF/e2-add2.jsonl $EF/e2-add3.jsonl \
  $EF/e2b-add1.jsonl $EF/e2b-add2.jsonl $EF/e2b-add3.jsonl \
  $EF/e1-add1.jsonl $EF/e1-add2.jsonl $EF/e1-add3.jsonl \
  $EF/e1b-add1.jsonl $EF/e1b-add2.jsonl $EF/e1b-add3.jsonl \
  $EF/e10-add1.jsonl $EF/e10-add2.jsonl $EF/e10-add3.jsonl \
  $EF/e10b-add1.jsonl $EF/e10b-add2.jsonl $EF/e10b-add3.jsonl \
  $EF/e11-add1.jsonl $EF/e11-add2.jsonl $EF/e11-add3.jsonl \
  $EF/e11b-add1.jsonl $EF/e11b-add2.jsonl $EF/e11b-add3.jsonl \
  $EF/e12-add1.jsonl $EF/e12-add2.jsonl $EF/e12-add3.jsonl \
  $EF/e12b-add1.jsonl $EF/e12b-add2.jsonl $EF/e12b-add3.jsonl \
  $EF/e7-add3.jsonl \
  $EF/e7b-add3.jsonl \
  $EF/e8-add3.jsonl \
  $EF/e8b-add3.jsonl \
  $EF/e9-add4.jsonl \
  $EF/e9b-add3.jsonl \
  $EF/e10-add4.jsonl \
  $EF/e10b-add4.jsonl \
  $EF/e11-add4.jsonl \
  $EF/e11b-add4.jsonl \
  $EF/e12-add4.jsonl \
  $EF/e12b-add4.jsonl
node test/test.js
```

重建後先看 build-bank 印出的分冊統計（應為 24 冊、目前 3024 題），再 `git diff --stat`
確認只有新增沒有大量刪除，然後才 commit。

⚠️ **加題一律開新的 `<冊>-addN.jsonl`，並放在重建指令的最後面**：`--renumber` 照
「檔案順序 → 檔內順序」重編號，加在尾巴既有題目的 id 才不會位移（id 一變，使用者
的錯題本就會對到別題）。新題的 `book`／`lesson` 照舊填，前端依這兩個欄位分單元。

| 加題檔 | 範圍 |
| --- | --- |
| e5-add1.jsonl | 五上加題（2026-08-20，補到每單元 24 題） |
| e5b-add1 / e5b-add2.jsonl | 五下加題（2026-08-21，補到每單元 24 題） |
| e6-add1 / e6-add2.jsonl | 六上加題（2026-08-21，補到每單元 24 題） |
| e6b-add1 / e6b-add2.jsonl | 六下加題（2026-08-21，補到每單元 24 題） |
| e7-add1 / e7-add2.jsonl | 七上加題（2026-08-21，補到每單元 24 題） |
| e7b-add1 / e7b-add2.jsonl | 七下加題（2026-08-21，補到每單元 24 題） |
| e8-add1 / e8-add2.jsonl | 八上加題（2026-08-21，補到每單元 24 題） |
| e8b-add1 / e8b-add2.jsonl | 八下加題（2026-08-21，補到每單元 24 題） |
| e9-add1 / e9-add2 / e9-add3.jsonl | 九上加題（2026-08-21，補到每單元 24 題） |
| e9-add4.jsonl | 九上加題（2026-08-26，補到每單元 32 題） |
| e9b-add1 / e9b-add2.jsonl | 九下加題（2026-08-21，補到每單元 24 題） |
| e9b-add3.jsonl | 九下加題（2026-08-26，補到每單元 32 題） |
| e10-add4.jsonl | 十上加題（2026-08-26，補到每單元 32 題） |
| e10b-add4.jsonl | 十下加題（2026-08-26，補到每單元 32 題） |
| e11-add4.jsonl | 十一上加題（2026-08-26，補到每單元 32 題） |
| e11b-add4.jsonl | 十一下加題（2026-08-26，補到每單元 32 題） |
| e12-add4.jsonl | 十二上加題（2026-08-26，補到每單元 32 題） |
| e12b-add4.jsonl | 十二下加題（2026-08-26，補到每單元 32 題） |
| e4-add1 / e4-add2.jsonl | 四上加題（2026-08-21，補到每單元 24 題） |
| e4b-add1 / e4b-add2 / e4b-add3.jsonl | 四下加題（2026-08-21，補到每單元 24 題） |
| e3-add1 / e3-add2 / e3-add3.jsonl | 三上加題（2026-08-21，補到每單元 24 題） |
| e3b-add1 / e3b-add2 / e3b-add3.jsonl | 三下加題（2026-08-21，補到每單元 24 題） |
| e2-add1〜add3 / e2b-add1〜add3.jsonl | 二上／二下加題（2026-08-21，補到每單元 24 題） |
| e1-add1〜add3 / e1b-add1〜add3.jsonl | 一上／一下加題（2026-08-21，補到每單元 24 題） |
| e10-add1〜add3.jsonl | 十上加題（2026-08-21，補到每單元 24 題） |
| e10b-add1〜add3.jsonl | 十下加題（2026-08-21，補到每單元 24 題） |
| e11-add1〜add3.jsonl | 十一上加題（2026-08-21，補到每單元 24 題） |
| e11b-add1〜add3.jsonl | 十一下加題（2026-08-21，補到每單元 24 題） |
| e12-add1〜add3.jsonl | 十二上加題（2026-08-21，補到每單元 24 題） |
| e12b-add1〜add3.jsonl | 十二下加題（2026-08-21，補到每單元 24 題） |
| e9b-add1 / e9b-add2.jsonl | 九下加題（2026-08-21，補到每單元 24 題） |
| e7-add3.jsonl | 七上加題（2026-08-25，補到每單元 32 題） |
| e7b-add3.jsonl | 七下加題（2026-08-26，補到每單元 32 題） |
| e8-add3.jsonl | 八上加題（2026-08-26，補到每單元 32 題） |
| e8b-add3.jsonl | 八下加題（2026-08-26，補到每單元 32 題） |
