# 歷史原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`h1_1`…），重建時由 `--renumber hi` 統一編號。
檔案順序＝年級順序，改動某一冊不會影響其他冊的內容，但會讓其後所有題的 id 位移。

> 2026-08-23 補建此 README（2026-08-20 建置時沒留下重建指令）。
> ⛔ 加題一律開新的 `<冊>-addN.jsonl` 並接在下面指令的**最後面**，不要動既有 jsonl 的內容與順序。
> ⛔ 寫完 add 檔先跑 `python3 tools/tikuconv/check-add.py tools/tikuconv/history <冊>.jsonl <add檔...>`。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| hi10.jsonl / hi10b.jsonl | 十上 / 十下 | 9 / 9 |
| hi11.jsonl / hi11b.jsonl | 十一上 / 十一下 | 9 / 9 |
| hi12.jsonl / hi12b.jsonl | 十二上 / 十二下 | 9 / 9 |
| hi10-add1 / hi10-add2 / hi10-add3.jsonl | 十上加題（2026-08-23，補到每單元 24 題） | — |
| hi10b-add1 / hi10b-add2 / hi10b-add3.jsonl | 十下加題（2026-08-23，補到每單元 24 題） | — |

重建：

```bash
HF=tools/tikuconv/history
node tools/tikuconv/build-bank.js history js/data/history.js $HF/header.txt --renumber hi \
  $HF/hi10.jsonl $HF/hi10b.jsonl \
  $HF/hi11.jsonl $HF/hi11b.jsonl \
  $HF/hi12.jsonl $HF/hi12b.jsonl \
  $HF/hi10-add1.jsonl \
  $HF/hi10-add2.jsonl \
  $HF/hi10-add3.jsonl \
  $HF/hi10b-add1.jsonl \
  $HF/hi10b-add2.jsonl \
  $HF/hi10b-add3.jsonl
node test/test.js
```
