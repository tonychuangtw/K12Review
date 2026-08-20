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

重建：

```bash
EF=tools/tikuconv/english
node tools/tikuconv/build-bank.js english js/data/english.js $EF/header.txt --renumber e \
  $EF/e1.jsonl $EF/e1b.jsonl $EF/e2.jsonl $EF/e2b.jsonl $EF/e3.jsonl $EF/e3b.jsonl \
  $EF/e4.jsonl $EF/e4b.jsonl $EF/e5.jsonl $EF/e5b.jsonl $EF/e6.jsonl $EF/e6b.jsonl
node test/test.js
```

⚠️ **加題一律開新的 `<冊>-addN.jsonl`，並放在重建指令的最後面**：`--renumber` 照
「檔案順序 → 檔內順序」重編號，加在尾巴既有題目的 id 才不會位移（id 一變，使用者
的錯題本就會對到別題）。新題的 `book`／`lesson` 照舊填，前端依這兩個欄位分單元。

| 加題檔 | 範圍 |
| --- | --- |
| e5-add1.jsonl | 五上加題（2026-08-20，補到每單元 24 題） |
