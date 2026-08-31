# 化學原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`f1_1`…），重建時由 `--renumber ch` 統一編號。
檔案順序＝年級順序，改動某一冊不會影響其他冊的內容，但會讓其後所有題的 id 位移。

> 2026-08-23 補建此 README（2026-08-20 建置時沒留下重建指令）。
> ⛔ 加題一律開新的 `<冊>-addN.jsonl` 並接在下面指令的**最後面**，不要動既有 jsonl 的內容與順序。
> ⛔ 寫完 add 檔先跑 `python3 tools/tikuconv/check-add.py tools/tikuconv/chemistry <冊>.jsonl <add檔...>`。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| ch10.jsonl / ch10b.jsonl | 十上 / 十下 | 9 / 9 |
| ch11.jsonl / ch11b.jsonl | 十一上 / 十一下 | 9 / 9 |
| ch12.jsonl / ch12b.jsonl | 十二上 / 十二下 | 9 / 9 |
| ch10-add1 / ch10-add2 / ch10-add3.jsonl | 十上加題（2026-08-23，補到每單元 24 題） | — |
| ch10b-add1 / ch10b-add2 / ch10b-add3.jsonl | 十下加題（2026-08-23，補到每單元 24 題） | — |
| ch11-add1 / ch11-add2 / ch11-add3.jsonl | 十一上加題（2026-08-23，補到每單元 24 題） | — |
| ch11b-add1 / ch11b-add2 / ch11b-add3.jsonl | 十一下加題（2026-08-23，補到每單元 24 題） | — |
| ch12-add1 / ch12-add2 / ch12-add3.jsonl | 十二上加題（2026-08-23，補到每單元 24 題） | — |
| ch12b-add1 / ch12b-add2 / ch12b-add3.jsonl | 十二下加題（2026-08-23，補到每單元 24 題） | — |
| ch10-add4.jsonl | 化學十上加題（2026-08-26，補到每單元 32 題） | — |
| ch10b-add4.jsonl | 化學十下加題（2026-08-26，補到每單元 32 題） | — |
| ch11-add4.jsonl | 化學十一上加題（2026-08-26，補到每單元 32 題） | — |
| ch11b-add4.jsonl | 化學十一下加題（2026-08-26，補到每單元 32 題） | — |
| ch12-add4.jsonl | 化學十二上加題（2026-08-26，補到每單元 32 題） | — |
| ch12b-add4.jsonl | 化學十二下加題（2026-08-26，補到每單元 32 題） | — |
| ch10-add5.jsonl | 十上加題（2026-09-05，補「易」難度入門題與實驗／圖表／素養題，每單元 8 題→40 題） | — |
| ch10b-add5.jsonl | 十下加題（2026-09-05，同上） | — |
| ch11-add5.jsonl | 十一上加題（2026-09-05，同上） | — |
| ch11b-add5.jsonl | 十一下加題（2026-09-05，同上） | — |

重建：

```bash
CF=tools/tikuconv/chemistry
node tools/tikuconv/build-bank.js chemistry js/data/chemistry.js $CF/header.txt --renumber ch \
  $CF/ch10.jsonl $CF/ch10b.jsonl \
  $CF/ch11.jsonl $CF/ch11b.jsonl \
  $CF/ch12.jsonl $CF/ch12b.jsonl \
  $CF/ch10-add1.jsonl \
  $CF/ch10-add2.jsonl \
  $CF/ch10-add3.jsonl \
  $CF/ch10b-add1.jsonl \
  $CF/ch10b-add2.jsonl \
  $CF/ch10b-add3.jsonl \
  $CF/ch11-add1.jsonl \
  $CF/ch11-add2.jsonl \
  $CF/ch11-add3.jsonl \
  $CF/ch11b-add1.jsonl \
  $CF/ch11b-add2.jsonl \
  $CF/ch11b-add3.jsonl \
  $CF/ch12-add1.jsonl \
  $CF/ch12-add2.jsonl \
  $CF/ch12-add3.jsonl \
  $CF/ch12b-add1.jsonl \
  $CF/ch12b-add2.jsonl \
  $CF/ch12b-add3.jsonl \
  $CF/ch10-add4.jsonl \
  $CF/ch10b-add4.jsonl \
  $CF/ch11-add4.jsonl \
  $CF/ch11b-add4.jsonl \
  $CF/ch12-add4.jsonl \
  $CF/ch12b-add4.jsonl \
  $CF/ch10-add5.jsonl \
  $CF/ch10b-add5.jsonl \
  $CF/ch11-add5.jsonl \
  $CF/ch11b-add5.jsonl
node test/test.js
```
