# 公民與社會原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`w1_1`…），重建時由 `--renumber ci` 統一編號。
檔案順序＝年級順序，改動某一冊不會影響其他冊的內容，但會讓其後所有題的 id 位移。

> 2026-08-24 補建此 README（2026-08-20 建置時沒留下重建指令）。
> ⛔ 加題一律開新的 `<冊>-addN.jsonl` 並接在下面指令的**最後面**，不要動既有 jsonl 的內容與順序。
> ⛔ 寫完 add 檔先跑 `python3 tools/tikuconv/check-add.py tools/tikuconv/civics <冊>.jsonl <add檔...>`。
> ⚠ 公民科的概念名詞高度標準化，「XX 的意義是什麼」這種問法極易與原冊重複；
>   加題時盡量用具體情境（案例、判斷、比較）發問，寫完務必跑 dupscan。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| ci10.jsonl / ci10b.jsonl | 十上 / 十下 | 9 / 9 |
| ci11.jsonl / ci11b.jsonl | 十一上 / 十一下 | 9 / 9 |
| ci12.jsonl / ci12b.jsonl | 十二上 / 十二下 | 9 / 9 |
| ci10-add1 / ci10-add2 / ci10-add3.jsonl | 十上加題（2026-08-24，補到每單元 24 題） | — |
| ci10b-add1 / ci10b-add2 / ci10b-add3.jsonl | 十下加題（2026-08-23，補到每單元 24 題） | — |
| ci11-add1 / ci11-add2 / ci11-add3.jsonl | 十一上加題（2026-08-23，補到每單元 24 題） | — |
| ci11b-add1 / ci11b-add2 / ci11b-add3.jsonl | 十一下加題（2026-08-23，補到每單元 24 題） | — |
| ci12-add1 / ci12-add2 / ci12-add3.jsonl | 十二上加題（2026-08-23，補到每單元 24 題） | — |
| ci12b-add1 / ci12b-add2 / ci12b-add3.jsonl | 十二下加題（2026-08-23，補到每單元 24 題） | — |
| ci10-add4.jsonl | 公民十上加題（2026-08-26，補到每單元 32 題） | — |

重建：

```bash
CF=tools/tikuconv/civics
node tools/tikuconv/build-bank.js civics js/data/civics.js $CF/header.txt --renumber ci \
  $CF/ci10.jsonl $CF/ci10b.jsonl \
  $CF/ci11.jsonl $CF/ci11b.jsonl \
  $CF/ci12.jsonl $CF/ci12b.jsonl \
  $CF/ci10-add1.jsonl \
  $CF/ci10-add2.jsonl \
  $CF/ci10-add3.jsonl \
  $CF/ci10b-add1.jsonl \
  $CF/ci10b-add2.jsonl \
  $CF/ci10b-add3.jsonl \
  $CF/ci11-add1.jsonl \
  $CF/ci11-add2.jsonl \
  $CF/ci11-add3.jsonl \
  $CF/ci11b-add1.jsonl \
  $CF/ci11b-add2.jsonl \
  $CF/ci11b-add3.jsonl \
  $CF/ci12-add1.jsonl \
  $CF/ci12-add2.jsonl \
  $CF/ci12-add3.jsonl \
  $CF/ci12b-add1.jsonl \
  $CF/ci12b-add2.jsonl \
  $CF/ci12b-add3.jsonl \
  $CF/ci10-add4.jsonl
node test/test.js
```
