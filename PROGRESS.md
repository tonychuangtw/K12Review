STATUS: in-progress

# 題庫擴展（Tony 2026-08-16 指示「擴展題庫」，依閱讀優先方針每日分批）

## 現量（2026-08-16 盤點）
- 閱讀 210 篇（2026-08-16 批2 後）｜成語 1200｜字音 630（test 顯示 660）｜字形 630（test 顯示 660）｜俚語 452｜寫作素材 60
- 2026-08-02 roadmap 目標（閱讀102/成語1000/字音600/字形600/俚語400）已全數超標，現為持續加量

## 已完成批次
- [x] 2026-08-16 閱讀批1：各年級+1 共 12 篇（r187–r198），v35，commit 6921cf2
- [x] 2026-08-16 閱讀批2：各年級+1 共 12 篇（r199–r210），文言為國8 狐假虎威／高10 桃花源記／高12 勸學，v36；順手把小二 r116 更名為〈爺爺的舊收音機〉避免與小五同名

## 下一步（每批做完就記錄、commit push、回報 Tony）
- [ ] 閱讀繼續每日一批（各年級 1 篇/批，id 從 r211 接續連號；文言/白話輪替平衡——批1文言在7/9/11、批2在8/10/12，下批回到7/9/11；選材避開既有標題——現有標題清單用 python 解析 reading.js 印出）
- [x] 2026-08-16 LanExamMock 閱讀 wave7：五級各 +3 篇 MC（15 篇／90 題），rmc 25→28，loader 已加 reading-mc-w7.js，v18，commit 30600eb
- [ ] LanExamMock 下輪：reading-mc-w8.js（同樣五級各 3 篇，id 用 <level>-rmc8-0N；記得同步 loader BANK_FILES + versions.js；test 要求每篇 ≥250 字、剛好 6 題、選項 4 個不重複、同級標題不可重複）
- [ ] 閱讀量足後其次：俚語/字音/字形續擴；⚠️ 新增成語成本高（需 deep+配圖+劇情動畫全套），無 Tony 指示先不動

## 守則備忘
- 題目逐條人工寫，不可交 subagent；改完必跑 node test/test.js + node test/zy-check.js
- 閱讀 schema：{id,grade,title,genre(白話/文言),src,passage,questions:[{q,options[4],answer,exp}]}，每篇 3 題、答案索引 0-3 平均分布
- 每批加 versions.js vN 條目

## 已結案（不用再做）
- 劇情動畫 1200/1200、成語配圖 1200/1200（2026-08-15）
- webui-fixes 三站派工（2026-08-15，詳見 discussion.md）
