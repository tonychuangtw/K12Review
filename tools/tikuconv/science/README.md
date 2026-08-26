# 自然科原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`y1`…），重建時由 `--renumber n` 統一編號。
檔案順序＝年級順序（三上～九下，自然科從三年級才有）。

⚠️ **加題一律開新的 `<冊>-addN.jsonl`，並放在重建指令的最後面**：`--renumber` 是照
「檔案順序 → 檔內順序」重編號，加在尾巴既有題目的 id 才不會位移（id 一變，使用者
的錯題本就會對到別題）。新題的 `book`／`lesson` 照舊填，前端依這兩個欄位分單元，
放在陣列尾巴不影響單元歸屬。

| 檔案 | 冊 |
| --- | --- |
| n3.jsonl / n3b.jsonl … n9.jsonl / n9b.jsonl | 三上 / 三下 … 九上 / 九下（各 9 單元） |
| n5-add1.jsonl / n5-add2.jsonl | 五上加題（2026-08-20，補到每單元 24 題） |
| n5b-add1〜add3.jsonl | 五下加題（2026-08-21，補到每單元 24 題） |
| n6-add1 / n6-add2.jsonl | 六上加題（2026-08-21，補到每單元 24 題） |
| n6b-add1〜add3.jsonl | 六下加題（2026-08-21，補到每單元 24 題） |
| n3-add1〜add3.jsonl | 三上加題（2026-08-21，補到每單元 24 題） |
| n3b-add1〜add3.jsonl | 三下加題（2026-08-21，補到每單元 24 題） |
| n7-add3.jsonl | 七上加題（2026-08-25，補到每單元 32 題） |
| n7b-add3.jsonl | 七下加題（2026-08-25，補到每單元 32 題） |
| n8-add3.jsonl | 八上加題（2026-08-26，補到每單元 32 題） |
| n8b-add3.jsonl | 八下加題（2026-08-26，補到每單元 32 題） |
| n9-add3.jsonl | 九上加題（2026-08-26，補到每單元 32 題） |
| n9b-add3.jsonl | 九下加題（2026-08-26，補到每單元 32 題） |
| n3-add4.jsonl | 自然三上加題（2026-08-26，補到每單元 32 題） | — |
| n3b-add4.jsonl | 自然三下加題（2026-08-26，補到每單元 32 題） | — |
| n4-add3.jsonl | 自然四上加題（2026-08-26，補到每單元 32 題） | — |
| n4b-add3.jsonl | 自然四下加題（2026-08-26，補到每單元 32 題） | — |
| n5-add3.jsonl | 自然五上加題（2026-08-26，補到每單元 32 題） | — |
| n5b-add4.jsonl | 自然五下加題（2026-08-26，補到每單元 32 題） | — |

重建：

```bash
node tools/tikuconv/build-bank.js science js/data/science.js tools/tikuconv/science/header.txt --renumber n \
  tools/tikuconv/science/n3.jsonl tools/tikuconv/science/n3b.jsonl \
  tools/tikuconv/science/n4.jsonl tools/tikuconv/science/n4b.jsonl \
  tools/tikuconv/science/n5.jsonl tools/tikuconv/science/n5b.jsonl \
  tools/tikuconv/science/n6.jsonl tools/tikuconv/science/n6b.jsonl \
  tools/tikuconv/science/n7.jsonl tools/tikuconv/science/n7b.jsonl \
  tools/tikuconv/science/n8.jsonl tools/tikuconv/science/n8b.jsonl \
  tools/tikuconv/science/n9.jsonl tools/tikuconv/science/n9b.jsonl \
  tools/tikuconv/science/n5-add1.jsonl \
  tools/tikuconv/science/n5-add2.jsonl \
  tools/tikuconv/science/n5b-add1.jsonl \
  tools/tikuconv/science/n5b-add2.jsonl \
  tools/tikuconv/science/n5b-add3.jsonl \
  tools/tikuconv/science/n6-add1.jsonl \
  tools/tikuconv/science/n6-add2.jsonl \
  tools/tikuconv/science/n6b-add1.jsonl \
  tools/tikuconv/science/n6b-add2.jsonl \
  tools/tikuconv/science/n6b-add3.jsonl \
  tools/tikuconv/science/n7-add1.jsonl \
  tools/tikuconv/science/n7-add2.jsonl \
  tools/tikuconv/science/n7b-add1.jsonl \
  tools/tikuconv/science/n7b-add2.jsonl \
  tools/tikuconv/science/n8-add1.jsonl \
  tools/tikuconv/science/n8-add2.jsonl \
  tools/tikuconv/science/n8b-add1.jsonl \
  tools/tikuconv/science/n8b-add2.jsonl \
  tools/tikuconv/science/n9-add1.jsonl \
  tools/tikuconv/science/n9-add2.jsonl \
  tools/tikuconv/science/n9b-add1.jsonl \
  tools/tikuconv/science/n9b-add2.jsonl \
  tools/tikuconv/science/n4-add1.jsonl \
  tools/tikuconv/science/n4-add2.jsonl \
  tools/tikuconv/science/n4b-add1.jsonl \
  tools/tikuconv/science/n4b-add2.jsonl \
  tools/tikuconv/science/n3-add1.jsonl \
  tools/tikuconv/science/n3-add2.jsonl \
  tools/tikuconv/science/n3-add3.jsonl \
  tools/tikuconv/science/n3b-add1.jsonl \
  tools/tikuconv/science/n3b-add2.jsonl \
  tools/tikuconv/science/n3b-add3.jsonl \
  tools/tikuconv/science/n7-add3.jsonl \
  tools/tikuconv/science/n7b-add3.jsonl \
  tools/tikuconv/science/n8-add3.jsonl \
  tools/tikuconv/science/n8b-add3.jsonl \
  tools/tikuconv/science/n9-add3.jsonl \
  tools/tikuconv/science/n9b-add3.jsonl \
  tools/tikuconv/science/n3-add4.jsonl \
  tools/tikuconv/science/n3b-add4.jsonl \
  tools/tikuconv/science/n4-add3.jsonl \
  tools/tikuconv/science/n4b-add3.jsonl \
  tools/tikuconv/science/n5-add3.jsonl \
  tools/tikuconv/science/n5b-add4.jsonl
node test/test.js
```

build-bank.js 會順便報：每冊題數與單元數、答案位置分布、id 重複、完全重複題。
撰寫規格見 `PROGRESS.md`（每單元 24 題＝一次段考 3 單元共 72 題；每題附
✅正解／❌其他選項為何不對／📚課綱重點）。
