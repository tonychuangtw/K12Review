# 英文原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`x2`…），重建時由 `--renumber e` 統一編號。
檔案順序＝年級順序。規格見 `PROGRESS.md`（一冊 9 單元 = 3 段考 × 3 單元，每單元 8 題）。

重建：

```bash
node tools/tikuconv/build-bank.js english js/data/english.js tools/tikuconv/english/header.txt --renumber e \
  tools/tikuconv/english/e1.jsonl tools/tikuconv/english/e1b.jsonl ... （照年級順序列出所有冊）
node test/test.js
```
