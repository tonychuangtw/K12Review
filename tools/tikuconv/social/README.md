# 社會科原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`y1`…），重建時由 `--renumber o` 統一編號。
檔案順序＝年級順序（三上～九下，社會科從三年級才有）。`*.py` 是早期轉檔用的腳本。

⚠️ **加題一律開新的 `<冊>-addN.jsonl`，並放在重建指令的最後面**：`--renumber` 照
「檔案順序 → 檔內順序」重編號，加在尾巴既有題目的 id 才不會位移（id 一變，使用者的
錯題本就會對到別題）。新題的 `book`／`lesson` 照舊填，前端依這兩個欄位分單元。

重建：

```bash
node tools/tikuconv/build-bank.js social js/data/social.js tools/tikuconv/social/header.txt --renumber o \
  tools/tikuconv/social/o3.jsonl tools/tikuconv/social/o3b.jsonl \
  tools/tikuconv/social/o4.jsonl tools/tikuconv/social/o4b.jsonl \
  tools/tikuconv/social/o5.jsonl tools/tikuconv/social/o5b.jsonl \
  tools/tikuconv/social/o6.jsonl tools/tikuconv/social/o6b.jsonl \
  tools/tikuconv/social/o7.jsonl tools/tikuconv/social/o7b.jsonl \
  tools/tikuconv/social/o8.jsonl tools/tikuconv/social/o8b.jsonl \
  tools/tikuconv/social/o9.jsonl tools/tikuconv/social/o9b.jsonl \
  tools/tikuconv/social/o5-add1.jsonl \
  tools/tikuconv/social/o5b-add1.jsonl \
  tools/tikuconv/social/o5b-add2.jsonl \
  tools/tikuconv/social/o6-add1.jsonl \
  tools/tikuconv/social/o6-add2.jsonl \
  tools/tikuconv/social/o6b-add1.jsonl \
  tools/tikuconv/social/o6b-add2.jsonl \
  tools/tikuconv/social/o7-add1.jsonl \
  tools/tikuconv/social/o7-add2.jsonl \
  tools/tikuconv/social/o7b-add1.jsonl \
  tools/tikuconv/social/o7b-add2.jsonl
node test/test.js
```

撰寫規格見 `PROGRESS.md`（每單元 24 題＝一次段考 3 單元共 72 題；每題附
✅正解／❌其他選項為何不對／📚課綱重點）。
