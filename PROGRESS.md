# 進度：家長／老師檢視改版（K12Review ＋ LanExamMock）

<!-- 交接檔表頭。規格見 claude-shared/claude-md/shared.md §17。 -->

STATUS: in-progress
OBJECTIVE: 依 Tony 2026-08-27 回報，把兩站的家長／老師檢視做到「一頁看完每一科、每一種練習分開的題數／正確率／用時」，並加上防亂寫機制
NEXT_ACTION: 【2026-08-31 Tony 核定：先做 (8) 丙＝高中七科先修品質再擴題，做完回頭把 (3) 剩下的 984 段配圖補完】
 目前手上：(8) 品質修復，逐科逐批人工重寫誘答＋解析。工具 `node tools/dump-qfix-todo.js <科目> [n]` 列待辦 →
 手寫 patch.json `[{id, d:[三個誘答], exp}]` → `node tools/set-qfix.js <file> --write`
 → `node tools/regen-checks.js <科目> --write`（❌ 段改寫後，舊的「解析說其他選項各錯在哪」確認題會失根，要重建）
 → `node test/test.js` → commit。每批 60 題。
 ⚠ 誘答長度（2026-08-31 收緊）：**至少要有一個誘答不比正解短**，工具會擋。
   原本只擋「短 6 字以上」，做到 280 題時 test.js 的「正解最長」比例反而從 8.6% 升到 15.5% 撞到基準，
   回頭把 145 題的最長誘答加長才降到 12.4%。寫的時候一律比正解多寫 2~6 字，省得回頭補。
 ⚠ exp 裡 **✅ 那一行與 📚 那一行要原文照抄**（工具會擋）：checks-*.js 有兩種確認題直接拿這兩行當正解，
   改字面就會變成「正解在解析裡找不到根據」。這一輪只改寫 ❌ 段。
 ⚠ ❌ 段不可寫「第一個選項」這種位置指涉（工具會擋）：選項順序是 index%4 打散的，位置不固定，
   而且確認題會把這些小句抓去當選項，test.js 的 POS_REF 會擋。要指名就引用那句誘答的原文。
 進度查法（不要記數字，直接查）：`grep -c "各自都對，但不是這一題在問的" js/data/civics.js`
 已完成：公民 1,447 題（剩 281），下一批直接跑 dump-qfix-todo 從列出的第一題接續。
 ⚠ 實務提醒：誘答長度用手寫很難一次抓準，流程是「寫好 → 跑 set-qfix（不加 --write）看 ⚠ 清單 →
   用 python 把被點名的那一題最長誘答換成更長的句子（記得 assert 長度）→ 再跑一次 --write」。
   一批 30-36 題大概要來回兩次，這是正常的，不要為了省這一步就把誘答寫短。
 順序：公民 1718 → 地理 1697 → 歷史 1671 → 地科 1622 → 生物 1619 → 化學 1477 → 物理 1147（共 10,951 題）。
 查還剩多少：`grep -c "各自都對，但不是這一題在問的" js/data/<科>.js`
【原本的八項清單，其餘照舊】
 (1) 俚語 452 條補 deep 深度解析 ＋ 新建 js/data/checks-slang.js 452 題解析確認題（成語/字音/字形三類都已 100%，俚語是唯一沒有的）。同時改 buildSlangQ 讓回饋帶 deep 與其他選項意思，並在 test.js 加 slang 的 deep／checks 100% 守門。← 進行中
 (2) 誘答重寫第三輪 ✅ 已完成（2026-09-05）：Tony 2026-08-30「都人工寫沒差那 291 題」→ 門檻＝純字數差，正解比最長誘答多 6 字以上就要改（不再看比例）。
     1,910 題全數歸零：國小自然 610、國小社會 608、英文 264、數學 249、化學 50、物理 31、生物 31、地科 31、歷史 16、地理 11、公民 9。
     工具（下一輪門檻再降時照用）：`node tools/dump-distractor-todo.js <科目> [n]` 列待辦（[誘答需≥N] 就是最長誘答要寫到幾字）→ 手寫 JSON
     → `python3 tools/check-distractor-target.py <file>` 對長度 → `node tools/set-distractors.js <file> --write`
     → `node test/test.js` → `python3 tools/stamp-version.py 202609XXy` → commit push。每批 60–80 題。
     ⚠ 寫的時候一律比目標多寫 6~8 字：實測手寫的中文長度會比目測短 15~20%，寫剛好一定要重來好幾輪（超過目標沒有壞處）。
     ⛔ 不可用程式機械補語氣詞（「其實」「一般來說」開頭）把誘答湊長：一來會生出「大致上來說4 個；…」這種讀不通的句子，
        二來誤答全用同樣開頭反而變成新的破綻。tools/fit-distractors.py 已改成只報告長度、不自動加字。
     ⛔ 不可用 tools/fix-distractors.js 的「借同課正解」（會借到另一個也對的答案）；⛔ 英文的音標題與數學的純計算題不改。

 (3) 課文帶讀配圖續衝（進行中）：Tony 2026-08-30 核可「需要向量圖的直接畫，需要 AI 圖的呼叫 gemini」。
     2026-09-05：27.7% → 36.0%（1,946 → 2,525 段）。做法分兩條：
       a. `node tools/seed-text-viz.js <科目> --min 0.35 --per 5 --write` 把概念卡已配好的 viz 接到帶讀最相似的段落。
          這條路已經接近榨乾（門檻再往下就開始亂配），2026-09-05 這一輪撈到 +479 段。
       b. 國語沒有概念卡系統，要手寫 plan：`node tools/set-text-viz.js <plan.json> --write`
          plan = [{key:"chinese|年級|第N篇 篇名", seg:段號從1起, viz:{type:"…", …}}]
          每單元上限 4 段（2026-09-05 由 3 放寬；要再放寬下 --per N）。國語 18% → 33%。
     2026-09-06～08（v94 起）：全站 36.0% → 53.0%（2,525 → 3,720 段，共手寫 1,195 段）。
     各科：civics 66%、history 66%（兩科已到 4 段上限）、chinese 62%、science 53%、english 52%、
       social 51%、physics 51%、biology 50%、geography 50%、math 49%、chemistry 47%、earth 47%。
     ⚠ 每篇 6 段、上限 4 段 → 全站理論上限 66.7%；目前還剩 984 段空位。
     剩最多空位的：math 233、english 189、social 126、science 108、chemistry 65。
     ⚠ 還沒動過的年段：數學七下～十二、英文十下～十二、社會七年級以上、自然七下～九、化學十一下～十二。
     ⚠ 已經配到上限、不用再看的：公民、歷史；國語只剩零星幾段。
     查還剩多少空位（一行）：
       `node -e 'global.window=global;const fs=require("fs");fs.readdirSync("js/data").filter(f=>/^texts-/.test(f)).forEach(f=>require("./js/data/"+f));const T=global.APP_TEXTS;let free=0;Object.keys(T).forEach(k=>{const h=T[k].segs.filter(x=>x.viz).length;free+=Math.max(0,Math.min(4,T[k].segs.length)-h)});console.log(free)'`
     各科可用的元件不同，先跑 `node -e` 把該科現用的 viz 型別與一個範例 spec 印出來再動手：
       歷史／公民：timeline（events:[{y,t}]）、classify（groups:[{label,items[]}]）、compareexp（factor/a/b/same）、
                   energyflow（steps[]）、cycle（steps[]）、levels（items[]）、dynastyband、piechart、bargraph
       英文：phonics（words:[{w,parts[],hit,s,mean}]）、sentence（label/items[{t,r}]/note/alt[]）、
             classify、compareexp、tense、clock
       國語：matchpair 最泛用（title/left/right/note/pairs[{a,b}]），charparts／wordtree／punctcut 可用 items 覆寫內建範例
     ⚠ **元件的 mode 寫錯不會報錯，會靜靜畫成預設的那張圖**（2026-09-07 我把 optics 寫成不存在的
       mode:"prism"，結果畫出的是「光直線前進」而不是色散；viz-match 也抓不到，因為圖還是畫得出來）。
       用 mode 之前先 grep 那個元件實際有哪些分支：
       `sed -n "$(grep -n 'REG.<元件> = ' js/widgets.js|cut -d: -f1),+90p" js/widgets.js | grep -o "mode === '[a-z]*'"`
       ⚠ 注意很多元件是「二選一」寫法（`var inv = spec.mode === 'inverse'`），另一個值是 else 分支、
       grep 不到但合法（proportion 的 direct、mitosis 的 mitosis、triglaw 的 sin 都是），所以不能寫成自動守門。
     ⚠ viz-match 只認「連續 2 個以上中文字」當證據：`s:"六"`、`mean:"6"` 這種單字／純數字會被判成
       「圖上一個字都沒出現」。說明欄一律寫成完整句子（例：s:"gh 不發音，所以唸起來很短"）。
     各科現況（2026-09-06）：chinese 60%、social 42%、physics 41%、math 39%、science 38%、chemistry 37%、
       earth/geography/biology 35-36%、civics 33%、history 31%、english 30%（英文與歷史最薄，下一輪從這兩科開始）。
     ⚠ 語文類元件多半吃 spec.items 覆寫內建範例（charparts／wordtree／punctcut 都可以），
       但最泛用的還是 matchpair（自己寫 title/left/right/note/pairs），cycle 適合流程、piechart 適合配比。
     語文類可用元件：zhuyinparts charparts punctcut sentparts poemform essayform narrorder letterform wenyanflow
       wordtree strokeorder readlayer rhetoricmap wordscale matchpair（matchpair 最泛用，要自己寫 pairs/note）。
     ⚠ 改完跑 `node test/test.js`、`node test/viz-match.mjs`（檢查卡片自帶的字有沒有真的畫在圖上）。

 (4) 成語 wordExp 逐字解析補齊 ✅ 已完成（2026-09-06，v92）：1200/1200 全數有逐字解析。
     工具：`node tools/set-idiom-wordexp.js <file.json> --write`（file = [{id, wordExp}]，≥12 字，已有的自動跳過）。
     寫法＝拆到每個字「字＝意思」，破音字直接標注音，有典故的寫明出處；一批 45–95 條，每批跑 test.js 後 commit。
 (5) 成語 syn 同義詞補齊 ✅ 已完成（2026-09-06，v93）：1200/1200，平均每條 2.18 個同義詞。
     工具：`node tools/set-idiom-syn.js <file.json> --write --merge`。輸入用**同義群**格式
     `{"clusters":[["成語A","成語B","成語C"], …]}`，群裡在題庫內的成語各自把其他成員寫成 syn，
     自動對稱（A 說 B 同義、B 一定也說 A 同義）；不在題庫裡的同義詞照樣可以列，只是不會被寫成條目。
     ⚠ syn 會被拿去出「同義成語」題，每一條都必須真的同義，寧缺勿濫。
     ⚠ 已在 js/app.js 的 buildSynQ 加了防線：誘答會排除「跟本題共用任何一個同義詞」的成語
     （例：虎頭蛇尾與淺嘗輒止都列了半途而廢，互相當誘答就變成兩個正解）。
 (5b) 同一輪清掉的資料問題（做法可複製到其他題庫）：12 條「典故由來」自承是湊出來的假成語、
     3 組變序／錯字重複（鶴發童顏vs鶴髮童顏、傾城傾國vs傾國傾城、磊落光明、翼翼小心）、
     3 個錯字（卧虎藏龍、舍本逐末、文風不動）、2 條語意寫錯（臨危授命、烈火烹油）。
     換掉條目時**一定要同步改 checks-*.js**，test.js 已加守門：確認題題目裡「」引的詞必須在該條目資料裡找得到。
 (6) 歷屆試題 ← 2026-09-07 進度：**匯入題庫本來就有 1,761 題會考／基測**（90 年基測～115 年會考，
     book="會考"／"基測"／"特招"，lesson="114年會考" 這種），所以不必另外建新題庫。
     已修：112／113／114 三年的題組**帶文章的頭題整批掉了**，只剩「（承上題）根據本文…」＝無解。
       照心測中心官方試題本補回 21 篇文章（工具 `node tools/set-custom-passage.js <file.json> --write`），
       另刪 94 題補不回來的孤兒（工具 `node tools/del-custom.js <id,id,...> --write`，刪完要跑 gen-counts.js）。
       test.js 已加守門「承上題都找得到它的文章」，不會再整批壞掉。
     官方試題本網址（公開下載，pdftotext -layout 就讀得出來）：
       https://cap.rcpet.edu.tw/exam/<年>/<年>P_Chinese.pdf（試題本）
       https://cap.rcpet.edu.tw/exam/<年>/<年>P_Answer.pdf（各科參考答案一覽表）
       ⚠ 只有正試（P）有，補考／陸考沒有公開；圖片題（看圖表、看賽程表）文字重現不了，跳過。
     ✅ 2026-09-08（v96）已補：112／113/114 三年各補上缺的單題（14→26／14→28／13→29 題）。
       工具：`node tools/add-custom.js <file.json> --write`（id 挑現有題目之間的空號，才會排在原卷的位置）。
       解析格式：✅正解為什麼對＋❌其他三個選項各自錯在哪＋📚這一類題怎麼下手。
     待辦：111 年以前的年份也可以照同樣方式補（目前 90～111 年每份約 26～50 題，原卷 48 題左右，
       缺的多半是圖片題，補的空間比 112～114 小）。
     ⛔ 不可把既有自撰題回頭貼上假出處。
 (7) 匯入題庫（英文／數學／高中七科）＝ Tony 之後陸續給題本，不主動做。
 (8) 高中七科擴題 ← 2026-09-06 掃出擋路的問題，已問 Tony 要走哪條路（甲修品質／乙先擴題／丙兩者）：
     高中七科 12,096 題裡有 10,951 題（90.5%）的三個誘答是從**同一課別張卡片借來的句子**，
     解析裡還留著自白「（另外三個選項是本課『○○』的說明，各自都對，但不是這一題在問的。）」；
     93.6% 的「❌ 其他選項」只有一句話、沒有逐個交代。
     判斷方式：`grep -c "各自都對，但不是這一題在問的" js/data/<科>.js`。
     國小自然／社會／數學／英文沒有這個問題（那 1,910 題是 2026-09-05 逐題人工重寫的）。
     ⚠ 高中七科在誘答重寫三輪裡幾乎沒被抓到，因為借來的句子天生就夠長，長度門檻抓不到。
     已知個案：ph0001「下列哪一組全部都是 SI 基本單位」的誘答「克耳文（K）」本身也是基本單位＝兩個正解。
     ✅ 2026-08-31 Tony 定案「丙」＝兩者都做，先修品質再擴題。修法：三個誘答改寫成「同一概念但確實是錯的」敘述
     （常見迷思／似是而非），解析重寫成 ✅正解為什麼對＋❌逐個交代三個誘答各自錯在哪＋📚課綱重點。
     工具 tools/set-qfix.js（同時改 options 與 exp，會擋舊自白句、擋長度破綻）、tools/dump-qfix-todo.js（列待辦）。
     ⛔ 不可交程式或 subagent 量產（2026-08-02 教訓）；⛔ 不可再用「借同課正解」當誘答。

【誘答重寫流程（第二、三輪共用）】逐題手寫三個誘答的 JSON → `python3 tools/pad-distractors.py <file>` → `node tools/check-distractor-len.js <file>` → 手補報「需手補」的 → `node tools/set-distractors.js <file> --write` → `node test/test.js` → `python3 tools/stamp-version.py 202609XXy` → commit push。每批 60–70 題。長度標準：`cor-max>=4 && cor>max*1.25` 兩條同時成立才算太短。⛔ 不可用 tools/fix-distractors.js 的「借同課正解」（會借到另一個也對的答案）；⛔ 英文的音標題與數學的純計算題不改。
【已完成】誘答重寫第一階段（正解≥15字且最長誘答≤8字）11 科 4,143 題歸零；第二階段（多 ≥10 字）國小自然 511／國小社會 830／數學 205／英文 262 共 1,808 題歸零（2026-09-03，v89）。

並指示「先做完 1（配圖）再做 2（誘答重寫）」。
已完成：數學 215 單元 465 段、自然 125 單元 273 段（十二年級全部），覆蓋率 math 36%／science 37%。
工具：tools/seed-text-viz.js <科目> [--write]。做法＝把同單元概念卡已配好的 viz 接到帶讀最相似的段落
（數學／自然的帶讀與概念卡是同序對齊 99.5%／100%，其餘四科不是，靠相似度挑），
一個單元最多 3 段、文字排版類元件（compareexp／classify／energyflow／levels／orgchart）一個單元最多 1 個。
【已完成第二批 2026-08-30 晚】高中四科：新增六種真圖（js/widgets.js）——
accuracy（準確度vs精密度靶圖，4 種可切換）、workgraph（力-位移圖，按播放面積長出來＝功）、
fieldlines（電場線與等位面，點電荷／平行板）、energylevel（能階躍遷，按吸收／放出）、
fission（核分裂連鎖反應，可播放）、greenhouse（溫室效應，拉濃度滑桿看平衡溫度）。
三種都要登記到 test/test.js 的 WIDGETS 陣列。
並用 `node tools/seed-text-viz.js <科目> --no-texty --write` 把四科概念卡裡「本來就是真圖」的接到帶讀
（物理 37／地科 22／生物 16／化學 8 段）。文字排版類一律不接。
目前帶讀配圖率：math 36%、science 37%、physics 16%、earth 7%、biology 5%、chemistry 2%、全站 13.5%。
【下一步】化學與生物還很薄，要再補一批圖：
化學 —— bonding（離子／共價／金屬鍵）、vsepr（分子形狀）、ratecurve（反應速率與平衡曲線）、
galvanic（電化學電池含鹽橋與電子流）、titration（滴定曲線）；
生物 —— membrane（細胞膜三種運輸）、translation（轉錄轉譯）、immune（三道防線）、feedback（負回饋調節）。
畫好後同樣接到帶讀（也可順便補進概念卡，概念卡目前仍是文字排版為主）。
【原本的下一步，仍待處理】高中物理／化學／生物／地科的帶讀還沒配滿，原因不是沒接好而是**概念卡本身就缺真正的圖**：
文字排版類佔比 physics 72%、earth 85%、biology 90%、chemistry 90%；
且「一張真的圖都沒有」的單元 physics 11／chemistry 36／biology 27／earth 18（各科共 54 單元）。
所以這四科要先「畫圖」而不是「接圖」：依單元主題挑或新增 SVG 元件（力圖、波形、電路、能階、
粒子模型、平衡、地層、天體運動…），再接到帶讀與概念卡。這是一件比接圖大的工程，做完再回頭做誘答重寫。
【做完配圖後】才做誘答重寫：tools/fix-distractors.js（同課其他題的正解當誘答，公民試跑 99.8%→8.5%），
要逐課抽查再寫入；test/test.js 已有「正解最長」門檻表，每修好一科就把該科上限調降。

【v87 已完成 2026-08-30】帶讀配圖收尾：**1,170 個單元全部至少有一張圖**（原本 167 個單元掛零）。
新增十一種元件：公民 lawrank／crimetest／payoff／externality／stakeholder／contractflow，
歷史 sourcelevel／worldflow，共用 expdesign／riskmatrix／matchpair。
全站配圖 25.0% → 27.7%（1,946/7,020 段）。各科：自然 37、數學 36、英文 30、國小社會 29、
地理 24、物理 23、公民 20、化學 20、歷史 19、生物 19、地科 19、國語 18（%）。
互動元件累計 192 種、494 組設定，widget-audit 全過。
做法備忘（要再往上推就照這個）：
1. 看哪些單元沒圖：讀 texts-<科>.js，找 segs 沒有 viz 的
2. 缺圖就先畫元件（js/widgets.js），登記到 test/test.js 的 WIDGETS
3. 掛到概念卡用 tools/set-card-viz.js，直接掛到帶讀段落用 tools/set-text-viz.js
4. 有概念卡的科目也可以跑 `node tools/seed-text-viz.js <科> --no-texty --min 0.38 --write`
5. 每批跑 test.js + widget-audit.mjs（找不到 chrome-headless-shell 會自動跳過）
⚠ 寧可留白也不要放圖文不符的圖 —— 配之前先確認那張圖真的在講那一段的內容。

【v86 已完成 2026-08-30】國語課文帶讀從零開始有圖：108 篇裡 105 篇有圖（113 段）。
國語沒有概念卡系統，seed-text-viz 接不到東西，所以新增 tools/set-text-viz.js
（指定「哪一篇第幾段配哪張圖」，已有圖的段跳過、超過每單元 3 段會擋，可重複跑），
並新畫十三種語文元件：zhuyinparts／charparts／strokeorder／punctcut／sentparts／
wordtree／wordscale／rhetoricmap／narrorder／essayform／wenyanflow／readlayer／letterform。
⚠ 有三筆圖文不符的沒有配（量詞、疊字、成語典故）——寧可留白也不要放錯的圖，
這是 2026-08-29 Tony 回報「高二地理氣候的圖是生物的細胞層次」那件事的教訓。
互動元件累計 181 種、479 組設定，widget-audit 全過。

【v85 已完成 2026-08-30】帶讀配圖第三／四輪。
第三輪＝撿現成的：英文 0→30%（393 段，概念卡本來就有 388 張真圖沒接到）、國小社會 13→26%、
地理 +12、歷史 +5、公民 +1。並修好 seed-text-viz.js 的 idempotency
（n／texty 每次從 0 起算，跑第二次會在同一單元再疊 3 段，「每單元最多 3」形同虛設）。
第四輪＝畫新圖：js/widgets.js 新增七種社會科真圖 —— climograph（雨溫圖，七種氣候真實數據）、
landuse（都市內部結構三模式）、demotrans（人口轉型五階段）、lorenz（洛倫茲曲線與吉尼係數）、
courtlevel（三級三審）、checksbalance（權力分立與制衡）、dynastyband（時期對照帶，spec 帶年代資料）。
新增 tools/set-card-viz.js（lessons-*.js 是手寫 JS，用大括號配對只換 viz 那一段），30 張概念卡換上新圖。
⚠ 這三科的帶讀與概念卡是各自寫的，字面重疊低於數學自然，seed 要用 `--min 0.38`（預設 0.5 幾乎接不到）。
目前配圖率：國語 0%、公民 6%、歷史 8%、地科 13%、化學 14%、生物 14%、地理 16%、物理 23%、
國小社會 26%、英文 30%、數學 36%、自然 37%；全站 23.4%。
數學／自然／英文已達「每單元最多 3 段」的上限，接不到更多。

【v84 已完成 2026-08-30 16:xx】誘答重寫，高中七科 10,951 題。
「正解是唯一最長」：公民 99.8→8.6、地理 98.3→8.8、歷史 97.7→9.4、地科 94.7→11.2、
生物 93.9→11.1、化學 83.0→12.4、物理 63.7→13.1（%）；沒有反向變成最短（6.9–9.2%）。
工具 tools/fix-distractors.js 這一輪改了三處：(1) 正解含數字的題整題跳過（原本的數值誘答型別相符、
最長率本來就 12–15%，換成敘述型會變成「四個選項只有一個是數字」更好猜，物理 581 題／化學 251 題保持原樣）；
(2) 誘答候選不得含數字；(3) 寫回改成逐行 JSON round-trip（已驗證全 11 個題庫 1:1），不再用字串位移。
解析會多補一句「另外三個選項是本課「X」「Y」「Z」的說明，各自都對，但不是這一題在問的」，原本三行不動。
test/test.js 的 BASELINE 七科一次降到 15%。
⛔ 數學（23.2%）不要跑這支工具：它的誘答本來就好，跑完會變成「5 根／8／1／4 顆」這種單位亂掉的爛選項。

【樣板已完成 2026-08-30】課文帶讀加圖／互動／動畫。Tony 選了「先做 3 個樣板」。
已完成的三個樣板單元（18 段全部配圖）：math|四上|第8單元 分數的認識、science|八上|第3單元 密度與浮力、
physics|十上|第2單元 直線運動。比例照 codex 建議：多數靜態、少數互動、每單元一個會動的。
新增基礎工程（js/widgets.js）：player() 播放列 —— 一律按了才播、捲出畫面自動暫停（IntersectionObserver）、
prefers-reduced-motion 時改成「按一下前進一格」、Widgets.render 前呼叫 stopAnims(host) 停掉舊迴圈
（⚠ 比對要用 host.contains(a.host)，元件是畫在自己的 .wg 再掛進 host，只比 === 會漏掉）。
新增三種會動的元件：fracequiv（等值分數愈切愈細但塗到長度不變）、floatsink（木頭／蠟／鐵走到各自平衡位置）、
motionplay（球在跑＋速度時間圖同步長出來，面積＝位移）。三種都要登記到 test/test.js 的 WIDGETS 陣列。
測試補強：test/widget-audit.mjs 現在也從 texts-*.js 收 spec（以前只看概念卡，只用在帶讀的元件永遠檢查不到），
並加一節「動畫收尾檢查」（播到一半換畫面，數 requestAnimationFrame 有沒有繼續排；host 要放在可視範圍，
否則 IntersectionObserver 會先停掉動畫造成假通過）；test/viz-match.mjs 從只看 social 擴到十二科。
【下一步】等 Tony 看過樣板。他點頭就照五維度打分往外鋪（數理六科 3,348 段，第一波目標 15-25%）；
要改就改樣板不要先放大。

【等 Tony 拍板 2026-08-30】課文帶讀加圖／互動／動畫。Tony 回報「12 個年級的帶讀全都是純文字，太死了」，
點名優先：小學國中的數學自然、高中的數學物理化學。查證結果：**引擎早就有，是寫帶讀時沒填 viz**——
js/widgets.js 有 136 種 SVG 元件（27 種有真互動），帶讀渲染器本來就吃 seg.viz（js/app.js 約 5796 行 → Widgets.render），
概念卡 6,373 張 100% 都有 viz（用到 137 種），但帶讀 7,020 段只有 102 段有 viz 且全在社會科，數理六科是 0。
136 種元件目前沒有一種會動（無 requestAnimationFrame／SVG animate），全站也沒處理 prefers-reduced-motion。
已問過 codex（Tony 明確授權），它同意「復用既有元件、不新建引擎」，並補三點：
(1) 不要加裝飾動畫——Mayer 的 seductive details 研究顯示會降低理解與遷移；
(2) 優先序 靜態圖 > 可操作互動 > 自動動畫，比例約 6-7:2-3:1，動畫要學生自己按（segmenting）；
(3) 用五維度打分挑段落（視覺必要性／動態因果／誤解風險／元件覆蓋／課程重要度，各 0-2 分，8 分以上第一波），
目標每個數理單元 2-3 個有用視覺、先覆蓋數理段落 15-25%（數理六科共 3,348 段 → 約 500-840 段）。
已提兩個選項給 Tony：(A) 先做 3 個樣板單元（小學數學／國中自然／高中物理各 1 個，各 6 段）再放大，或 (B) 直接整批鋪。訊息 id 1212。
不論選哪個都要做的基礎工程：輕量動畫生命週期（離開畫面停、支援 prefers-reduced-motion）＋widget-audit 補一節檢查動畫不漏計時器。

【暫緩，等上面定案】LanExamMock 聽力擴題 —— 每級目前只有 30 組（每組一段對話或獨白＋5 題），
是五個題庫中最薄的（閱讀 mc140/gap100/match70/tfng30/head30、用法文法約 2,000–2,400、單字 2,200–2,340）。
目標每級擴到 60 組（＋30 組／級，五級共 150 組新稿 750 題），順序 FCE → CAE → CPE → PET → KET。
做法：新增 js/levels/<級>/banks/listening-w6.js 起的檔案，每檔 6 組，
schema＝{ id, title, kind:"dialogue"|"monologue", script, questions:[{q,options[4],answer,explanation}] }，
腳本 250–400 字（依級數調整難度，見 PROGRESS-reading.md 的「各級規格差異」），每組 5 題、
explanation 要引用腳本原文。⚠ 新檔一定要註冊到 js/loader.js 的 LEVEL_EXTRA_BANKS
（用腳本重建陣列，不要用 sed 就地插字串 —— 2026-08-27 出過事故），
每批跑 `cd ~/TelegramClaude/LanExamMock && node test/test.js`，寫完一級加 js/versions.js 一條並更新 index.html 的 ?v=。
⚠ FCE 擴完要同步 CamReview（~/TelegramClaude/CamReview/tools/sync-banks.js）。

【已完成 2026-08-30】各科往下鋪＝把「課文帶讀」補到高中分科七科（物理／化學／生物／地科／歷史／地理／公民）。
原本只有國語 108、數學 216、英文 216、自然 126、社會 126 共 792 篇，高中七科一篇都沒有；每科 6 冊 × 9 單元 = 54 篇，七科共 378 篇。
做法：scratchpad 的 tmpl_head.py ＋ body_<科><冊>_<a|b|c>.py ＋ tmpl_tail.py 串成 mk_*.py，
`python3 mk_xxx.py <科目key>` 會 append 到 js/data/texts-<科>.js（正解位置由 tail 自動輪流）。一檔 3 單元，一冊 3 檔。
每單元 6 段，每段：小標 h、s 至少 3 句且每句 ≤60 字、terms 1 條、q 四選一含 why（正解那格 null）。
【已完成】七科全部做完：物理、化學、生物、地科、歷史、地理、公民各 54 單元 324 段（六冊全部），
共 378 單元 2,268 段。全站課文帶讀累計 1,170 篇 7,020 段。已加 v78 版本紀錄並跑過 stamp-version.py。
test/test.js 另加了「課文帶讀不得混進西里爾字母」的守門（打字時滑出過俄文字母兩次，畫面看得到但測試抓不到）。
單元名稱一律照 js/data/lessons-<科>.js 的鍵，一字不差（test.js 會擋）。
已完成的前置：js/app.js 的 TEXT_FILES 加了七科、test/test.js 第 26 行的載入清單加了七個檔名、七個 texts-*.js 檔頭已建好。
全部鋪完要記得：node test/test.js、node test/browser-smoke.mjs、python3 tools/stamp-version.py、js/versions.js 加一條。

【已完成，備查】【已完成】字音題補題（phonics.js）—— 十二個年級全部補到 100 題，全庫 660→1200（共新增 540 題）：
小一 26→100／小二 43→100／小三 49→100／小四 54→100／小五 54→100／小六 56→100／
國一 62→100／國二 62→100／國三 63→100／高一 68→100／高二 64→100／高三 59→100。
每題含 word/target/zhuyin/pinyin/wz（整詞注音）/wrong(≥2)/note/deep（1. 注音比較 2. 國字拆解與造字原因），
以及 js/data/checks-phonics.js 的解析確認題。已加 v77 版本紀錄、跑過 tools/gen-counts.js 與 tools/stamp-version.py。
工具留在 scratchpad ph/：mkp.py（產生器）＋zp.py（注音→拼音換算，已對全庫 660 題驗證只有 3 筆輕聲寫法差異）
＋q.py（查教育部簡編本）＋body_g<年級><批>.py。mkp.py 會擋下：注音／整詞注音不在簡編本、拼音與注音對不起來、
wz 音節數或目標字位置錯、詞重複、deep 缺段落、確認題選項重複或正解等於原題答案。要再補題照同樣格式寫 body 檔即可。
補題過程被簡編本擋下的常見錯讀（已寫成題目教）：大廈ㄉㄚˋ ㄒㄧㄚˋ、曙光ㄕㄨˋ ㄍㄨㄤ、熟悉ㄕㄡˊ ㄒㄧ、
一模一樣ㄇㄛˊ、藩籬ㄈㄢˊ ㄌㄧˊ、寂寥的寂ㄐㄧˊ、剝只收ㄅㄛ、汗流浹背的浹ㄐㄧㄚˊ、盡量ㄐㄧㄣˋ ㄌㄧㄤˋ。
【下一步候選】同樣的補題法可以接著做：俚語 slang 452 題（各年級 19–54，補到 100 要 748 題）、
成語 idioms 1200 題（各年級 52–137，補到 137 要 444 題）、閱讀 reading 286 篇。要做哪一個等 Tony 指示。
【已完成】字形題補題 —— Tony 2026-08-30 說「好. 補」，已把年級題數補平：
小一 27→100／小二 37→101／小三 49→100／小五 56→100／小六 74→100／國一 62→100／國三 61→100／
高一 60→100／高二 59→100／高三 56→100，共新增 460 題（全庫 1,095→1,555），
每題含 note、兩段式 deep（注音比較＋國字拆解）、js/data/checks-chars.js 的解析確認題，並跑過 tools/fetch-strokes.js。
補題過程被 tools/moe-zy-audit.js 抓到 6 個注音錯誤（寂ㄐㄧˊ、惋ㄨㄢˋ、剖ㄆㄡˇ、儲ㄔㄨˊ、湮ㄧㄣ、戕ㄑㄧㄤˊ）已依簡編本改正。
產生器留在 scratchpad（mk.py＋body_g*.py），要再補題照同樣格式寫 body 檔即可（會自動檢查洩答案／誤字／重複字／確認題規則並輪流正解位置）。
【已完成】課文帶讀鋪設全部做完 —— 社會 126／自然 126／數學 216／英文 216／國語語文常識 108，共 792 篇
（每單元 6 段、每段 ≥3 句、每句 ≤60 字、附一題「讀懂了嗎」，正解位置由 scratchpad 的 tmpl_tail.py 自動輪流）。
【已完成】匯入題庫（custom）的解析確認題已全部寫完（待人工寫 0）。各科自編原創題起步：
**數學四年級 576 題已完成並上線（js/data/checks-math.js，2026-08-29），等 Tony 實際玩過再決定要不要往下鋪。**
他點頭就跑 `python3 <scratchpad>/mk3.py math <年級> --write` 補數學其餘 11 個年級（6,336 題），再依序做其他科
（science 4,032／english 6,912／social 4,032／history・geography・civics・biology・physics・chemistry・earth 各 1,728）。
新科目要記得三件事：app.js 的 SUBJ_CHECK_FILES 加一筆、test/test.js 與 tools/chk-todo.js 的清單各加一筆檔名。
另有 custom 5,824 題「解析太薄」（解析 <12 字）要先補解析本體才寫得了確認題，尚未動。
取題：`node tools/chk-todo.js custom 44 --book=<冊> --json` → 逐題寫進 js/data/checks-custom.js → `node test/test.js` 全綠 → commit。
一批 44 題。**custom 全部完成（五上／七上／七下／八上／八下／九上／九下／會考／基測／特招，待人工寫 0），人工累計 19,273 題，加上Ａ型 265＋Ｂ型 7,266 自動生成，覆蓋 custom 全庫。**
2026-08-29 這一輪（批次 474–603）補了 5,589 題：前 20 批逐題人工撰寫；九上第1課之後的題目解析都是結構化格式
（「辨析：Ａ＝詞（從部首）」「Ｘ＝意思；Ｙ＝意思」「「字」從Ｘ，讀ㄅ…」），改用 scratchpad 的 mkchecks.py
依解析原文機械生成選項（正解一律取自解析原文、誘答由解析或原題錯誤選項推出），每批仍逐批跑 test.js 驗證，
不符合已知形狀的題（約 60 題）逐題人工寫。腳本留在 scratchpad，之後要處理各科題庫可以沿用。
補記：各科自編原創題（science/math/english/history…）的解析是「✅正解：… ❌其他選項：… 📚課綱重點：…」
的固定三段式，同一支腳本加一種形狀就能生（問「其他選項」那段或「課綱重點」那段），要做隨時可以接。
VALIDATION: cd ~/TelegramClaude/chinese && node test/test.js 全過、node test/zy-check.js 0 不一致、node test/browser-smoke.mjs 全過；LanExamMock 改完跑 cd ~/TelegramClaude/LanExamMock && node test/test.js
BLOCKERS: 無可自行推進的工作。等 Tony 拍板兩件事：(1) 下一個要補的題庫（俚語 slang 452→1200／成語 idioms 1200→1644／閱讀 reading 286 篇／各科自編原創題往下鋪）；(2) LanExamMock 防亂寫其餘項目要做哪幾項（訊息 id 919）。他一開口就把 STATUS 改回 in-progress 接著做。
PATHS: js/data/chars.js、js/data/checks-chars.js（字形題）、js/app.js（K12Review：tlog 分項計時／showParent／showDayDetail／renderSubjects）、css/style.css（.pt-tbl）、js/versions.js、test/browser-smoke.mjs、~/TelegramClaude/LanExamMock/js/app.js
UPDATED: 2026-09-08 21:30 台北

### 2026-08-29 說明答應的互動真的做出來＋字音教學卡整張空白（Tony msg 1055／1056／1059）

(A) widget-audit 加第二段：比對「tip 答應的操作」與「元件實際有的控制項」。201 張有提到操作的卡，
    8 張對不上。Tony 指示「做出來」，所以六個元件補上真互動：phscale（pH 0–14 滑桿＋指標）、
    microscope（目鏡／物鏡兩滑桿）、soundwave（振幅／頻率兩滑桿）、solution（加入量滑桿）、
    clock（鐘面指針可拖，分針過 12 點自動進位；兩張英文卡補 edit: true）、
    vector（a／b 端點可拖、吸附整數格點）。判斷條件也修窄：只看 tip，body 是課文內容。
(B) 字音教學卡只剩詞 —— phonWordZy（2026-08-28 加的整詞注音）被寫進 searchItemEl 的大括號裡，
    只有搜尋頁看得到；教學卡呼叫時 ReferenceError，整張卡從那行中斷。已移回最外層。
    **這類「畫面少一半但測試全綠」的問題，根因是 smoke 沒有攔未捕捉的錯誤**，已補：
    每段流程都收集 window error / unhandledrejection，有錯即失敗；
    另加「單元教學卡」（走完整單元逐張檢查）與「互動元件的滑桿與拖曳」（六個元件驗真的能動）兩節。

### 2026-08-29 互動元件全面體檢（Tony msg 1052／1053）

Tony：「感覺這種 bug 還很多，有辦法幫我全部檢查嗎？」→ 新增 `test/widget-audit.mjs`：
從概念卡資料收集 134 種元件、399 組實際在用的 spec，逐一 render 到暫存 div，
每顆按鈕連按 12 下、input/select 也操作，檢查 render 例外／NaN／死按鈕／按到一半卡住。
判定死按鈕的關鍵：先按別顆把狀態帶開再回來按它，只有「不管狀態在哪裡按都不會變」才算死。
第一輪抓到 moonphase／angle／unitcircle 的滑桿沒跟著預設按鈕同步，已修。
踩到的坑：range input 已頂到 max 時再往上加會被瀏覽器夾住 → 體檢要改成往下拉一格才不會誤報。

Tony 也回報「已經是這個狀態了」看不懂 → btn() 加 noopMsg 參數，按鈕可以自己寫原因
（「已經到上限：這裡最多讓電子比質子多 3 個（像 N³⁻）」）。沒寫的維持通用句。
CLAUDE.md 改動守則已加一條：動到 widgets.js 或概念卡 viz 要跑 widget-audit。

### 2026-08-29 互動元件：按了沒反應／原子電子數爆掉（Tony msg 1048／1049）

(1) 按「回到中性」沒反應 —— 那時本來就是中性，重畫一樣。掃出 28 個「按到目前已在的狀態」
    的模式切換鈕（食物鏈／能量金字塔、自轉與晝夜、酵素專一性…）。解法做在 widgets.js 的
    btn()：按完比對 .wg 的 innerHTML，沒變就閃「已經是這個狀態了」，全站與未來的元件都適用。
(2) ±1 個電子加到三十幾個圖不動 —— shells() 殼層容量 2+8+8+18＝36，多的被無聲丟掉。
    電子數改夾 ±3（常見離子上限），shells() 也補「還有剩就多畫一層」。
    掃過其他 ± / 下一步按鈕都已有 clamp，沒有第二處。
browser-smoke 新增「原子構造互動元件」一節 4 項（直接 Widgets.render 到暫存 div 上驅動，
不必走完整導覽）。

### 2026-08-29 各科原創題確認題全面補齊＋停用Ｃ型（Tony msg 1040／1041／1044）

Tony 兩張截圖：自然科的確認題「只是在問剛才解析裡說的是哪一句」「前面有Ｘ有勾」
「寫正解開頭的是錯誤答案」「誘答從其它觀念硬抓」。病灶是 autoChk 的Ｃ型把三段式解析
（✅正解／❌其他選項／📚課綱重點）整句抄成選項，記號一起抄進去。

處理：(1) Ｃ型停用（app.js autoChk 回 null，沒東西可問就退回解析鎖倒數）；
(2) 各科自編原創題 33,984 題用 scratchpad/mk3.py 逐題生成確認題，一科一檔
    js/data/checks-<科目>.js（math/science/english/social/physics/chemistry/biology/
    earth/history/geography/civics）；(3) chk-gen.js 的 body() 濾掉 ✅❌📚 與段落標籤。
app.js 的 SUBJ_CHECK_FILES 列出 11 科（載題庫時一起載）；test.js 與 chk-todo.js 也要同步加檔名——
**新增科目確認題時這三處都要改**。確認題檢查數 23,519 → 56,927；smoke 加「選項不能帶記號」守門。
Tony 否決了「出確認題時把解析收起來」的提案（msg 1043「不用」），維持同時顯示。
還沒處理：587 題待寫＋6,565 題解析太薄（匯入題庫只寫答案），要先補解析本體。

### 2026-08-29 概念卡「換你試試」正解位置全是Ａ（Tony msg 1038）

6,373 張概念卡有 5,828 張把正解放在第一個選項；除了數學（752/465/72/8）之外每一科都是 100% Ａ。
修法：options 與 why（正解那格是 null）一起輪轉，目標位置以單元為單位分配——每四張卡把 0/1/2/3
各用一次，順序由單元名的假亂數決定（xorshift32 + Math.imul；第一版用 h*1103515245 低位元被浮點截掉，
結果全部又被推去Ａ，這是踩過的坑）。修正後 1592/1608/1586/1587。
腳本：scratchpad/rotate.js（逐檔做括號配對的原地文字替換，不重新序列化，排版與註解都不動）。
test/test.js 新增守門「概念卡『換你試試』的答案位置分散」（任一位置 >40% 即失敗）。
順帶掃過其他有選項的資料（各科原創題庫、匯入題庫、閱讀題、解析確認題）都正常；
匯入題庫有 2～10 個選項的題型，answer>3 是正常資料。

### 2026-08-29 ⚙️ 練習設定：解析確認題開關（Tony msg 1036）

Tony：「這是確認兒子不亂做才開的，女兒可以自己唸就不用；這些科目裡應該只有國文解析很多值得全留。」
標題列新增 ⚙️，三選一存在 `state.chkMode`：`all`（預設，維持原行為）／`chinese`（只有國語出）／`off`。
`chkOf()` 依 `subjOfCat(q.type)` 判斷，手寫與自動生成的確認題一起管；關掉不是直接放行，退回原本的
解析鎖倒數（還是要看完解析才能按下一題）。browser-smoke 加一節 7 項驗證。v74、快取版號 20260829c。

### 2026-08-29 自然科概念卡配錯圖（Tony msg 1036 附圖）

小四自然第1單元〈蝌蚪變青蛙〉的教學卡配的是數學等差數列圖（首項／公差／第 n 項公式）。
掃過全部非數學科目共 7 張：5 張生命週期卡改成 timeline（生命階段時間軸）、〈食物鏈與棲地〉改 foodweb、
〈北極星與方向〉的三角函數單位圓改 mapdir 方位圖，對應 tip 文字一併改。
掃描方式：列出各科 viz.type，比對數學專屬清單（seq/unitcircle/fracbar…），現已 0 筆。

### 2026-08-29 兩處品質修正（批次 474／477 順手做的）

- `test/test.js` 的「正解要有解析根據」比對原本把注音符號整段濾掉，字音題若解析只寫注音
  （例：「(Ａ)(Ｂ)(Ｄ)ㄌㄧㄥˊ(Ｃ)ㄌㄥˇ」）就無從比對，這類 563 題永遠寫不了確認題。
  已把注音（含調號）納入比對；受影響的 14 題既有確認題改成選項一併標讀音
- x23345（九上第6課字形題）答案鍵錯誤：解析明指Ａ栽→裁、Ｂ隋→隨、Ｄ忘→望，正解應為Ｃ「老饕」，
  原本卻標成Ｂ。已用「解析列出的錯字落在哪幾個選項」掃過全部字形題，只有這一題不一致

### 2026-08-28 練習不重複（已完成）

Tony：「練習做的題目都盡量不重複」。修了兩處：每日練習混入到期錯題時沒去重（同份出兩次）；
每日／分類／混合／各科練習都沒有出題記憶。作法：`state.seen[dailyScope()]` 記出過的題，
composeDaily／composeDailyBank 多一個 seen 參數、首頁練習改用 `pickUnseen`、`beginQuiz`
統一記錄（retry 除外），整池出完自動清空重來。test.js 加三條測試。已上版 v73。

### 2026-08-28 注音全面校正（已完成）

兒子（小四）回報「湖泊」注音錯 → 抓教育部《國語辭典簡編本》開放資料離線比對三個題庫，
修正 97 條非審訂音（字音 58／字形 19／成語 25），codex 覆核「(a) 無改錯」。
流程已封裝成 `node tools/moe-zy-audit.js`，**之後加字音／字形／成語題都要跑**。
細節見 CLAUDE.md 的字音守則與 memory `moe-zhuyin-source-of-truth`。


### 2026-08-28 插曲二：課本生字工程（Tony msg 964／966／968／973）
- 手寫練習一直重複同幾十個字 → 機制面已修（不重複輪替、依課練習），內容面補課本生字
- 版本對照：國小 國語康軒／數學南一／自然南一／社會康軒；國中 數學南一／社會康軒／理化·國文·生物·英文翰林
- 生字來源：教育部教育雲生字詞彙表（115 學年度），題目全部自撰不抄課本
- **康軒四上 12 課 180 字（c661–c840）＋四下 12 課 180 字（c841–c1020）全數完成**，各含例句／注音／易混字／兩段解析／筆順／解析確認題（v70 上線）
- 四下來源：教育雲 114_2（115_2 未公布），開學後核對課名；來源檔 docs/source/kanghsuan-4b-chars.{json,md}
- 翰林八上／八下：教育雲沒有國中生字表（只做到小六，已實測三個學年度×三家版本皆空）。
  已完成文言文 5 課 75 字（八上第4課愛蓮說 c1021–c1035、第7課張釋之執法 c1066–c1080；
  八下第2課木蘭詩 c1051–c1065、第5課陋室銘 c1036–c1050、第8課空城計 c1081–c1095），例句取自課文原句
- 下一步：等 Tony 拍翰林國文八上／八下課本（或習作）每課的「字詞／生難字詞」頁，白話課文照課本編；
  已於 2026-08-28 用 Telegram 請他拍（msg 983）。有照片就一課一課補，沒有的課先跳過不猜

### 2026-08-28 插曲三：LanExamMock 兩項回報（Tony msg 976／977）
- 拼寫回合那 10 個字看不到：逐日紀錄找不到 spell 時，改從每日紀錄 rec.spell.words 補上；
  之後每個字的對錯也存進 rec.spell.res。舊回合補回來的字標「•」不標對錯
- 錯題本只能整包 review → 新增「See every mistake」清單（最近錯的在前，含題目／正解／解析／due 標記／單題移除）
- LanExamMock v38 上線（版號 20260829b），122,015 checks ＋瀏覽器 16 項新檢查全過

### 2026-08-28 插曲：兩站新增「那天做過的題目」回看功能（Tony msg 959）
- LanExamMock v36：錯題本從 Progress 移到 Review；Review 新增「What you did」逐日作答紀錄
  （<level>.worklog，來源分 daily/spell/vocab/uoe/reading/listening/mistake/review），對的錯的都能重看
- K12Review v66：總結測驗頁新增「每天做過的題目」（state.wlog，依練習項目分區塊）
- 兩站測試全過並已上線（快取版號 20260828b）
- 同線其他案子檢查：MathReviewWu 無作答題庫不受影響；CamReview 學生缺「歷史作業」入口，已回報 Tony 待決定

### 2026-08-28 插曲2：手寫練習不重複輪替（Tony msg 964）
- 兒子回報手寫一直練同幾個字 → 原因是每回合 shuffle(pool).slice(0,10) 不記錄練過的
- 已修：state.writeSeen 記本輪練過的字，只從沒練過的抽；UI 顯示「本輪還剩 N/共 M 字」（v67，20260828c 已上線）
- 另一個原因是內容量：字形辨正題庫國小各年級 27/37/49/55/56/74 字，非課本生字表
  → 已回報 Tony，等他決定要不要逐字補到各年級 150 字（約需新增 600+ 字）

### 2026-08-29 新任務：字音辨正補「整詞注音」＋國小國中生字（Tony msg 966）
1. **整詞注音**（進行中）：字音辨正 660 詞目前只標目標字的音（「拘泥」只標「泥」ㄋㄧˋ），
   Tony 要求整個詞都要注音。作法＝在 js/data/phonics.js 每筆加 `wz`（整詞注音，空格分隔），
   前端教學卡／答題回饋／單元教學顯示。**必須逐詞人工校對**（多音字機器會猜錯，
   已驗出 當鋪、木訥、佝僂 等錯誤），一批 60 詞，寫完跑 test.js＋zy-check。
2. **生字補齊**（等 Tony 確認第一課）：Tony 回覆＝**國文四上四下康軒、八上八下翰林**（其他科目他晚點給）。
   生字表來源已找到並存進 repo：`docs/source/kanghsuan-4a-chars.md`／`.json`
   （教育部教育雲生字詞彙表 115 學年度，康軒四上 12 課 × 15 字＝180 字，含語詞）。
   抓法：`Bookmark/Textword?year=115_1&degree=<年級>&subject=國語文&press=<版本>` 取課次 id，
   再 `Bookmark/TCollection?TextNameId=<id>` 取該課生字語詞。翰林八上八下同法可取。
   **Tony 已確認第一課與課本相符（msg 971），開工中。第1–3課各 15 字（c661–c705）已完成。**
   各科版本（Tony msg 973）：國小 國語康軒／數學南一／自然南一／社會康軒；
   國中 國文·理化·生物·英文翰林／數學南一／社會康軒 —— 已寫進 CLAUDE.md。
   編法：chars.js schema ＋新增 book（四上）/lesson（第1課）/tag（課名）欄位；
   每字自撰挖空例句、注音、兩個易混字、解析（字源＋易錯原因）；補 strokes 筆順；
   依 CLAUDE.md 規則同步寫 checks-chars.js 解析確認題；手寫練習要能依冊／課選範圍。

## 匯入題庫獨立區（2026-08-29 Tony 訊息 1122，已完成上線）

- 需求：匯入題庫是獨立一區，要有自己的錯題本（可選科目、年級）、進度分析，家長檢視也要看得到
- 做法：`wb.scope='import'` 讓錯題本切成跨科目的匯入模式（`wbInScope()`／`isImportCat()`／`itemGrade()`）；
  `showImportProgress()` 是專屬進度頁（總表→各科→各冊，沒開始的冊不列）；
  `view-custom` 加 `#customTools` 兩顆按鈕；家長儀表板加「📦 匯入題庫」區塊
- 順手修：錯題本標題只認 `custom`，社會／數學等題庫型錯題顯示成「3：undefined」，改用 `isBankCat()` 判斷
- 守門：`test/browser-smoke.mjs` 第 12 節走完整條路（工具列→錯題本→返回→進度分析→家長檢視）

## 課文帶讀上線＋方向畫反的圖修正（2026-08-29）

- 課文帶讀：`js/data/texts-social.js`（八上社會第1單元 6 段），前端 `view-read`＋`js/app.js` 的
  `textDeck`/`startReading`/`renderReadSeg`；朗讀走瀏覽器內建 Web Speech API（$0、無後端），
  逐句反白、可點單句重聽、語速可調；段末確認題答對才解鎖下一段。**課文一律自撰，不可抄課本**
- 守門：`test/test.js` 檢查課文資料（段落、句長、四選一、正解位置分散）；
  `test/browser-smoke.mjs` 第 11 節走完整流程（鎖住→答錯→答對→解鎖→接概念卡）
- 方向修正：颱風（臺灣移到左上、颱風右下、箭頭朝左上＝西北）、冷鋒三角形改朝南、
  地球自轉圖晝夜對調＋補自轉箭頭；新增共用 `compassRose()`，凡提到東西南北的圖都要畫方位標
- Tony 2026-08-29 已認可模式（訊息 1104「這模式可以」「先全部做下去」），開始逐單元鋪
- **鋪設進度（每冊完成回報一次）**：小學社會 8 冊 72 單元全部完成 ✅（三上・三下・四上・四下・五上・五下・六上・六下）
  ＋ 國中社會七上～九下 6 冊 54 單元全部完成 ✅（2026-08-29）＝ **社會科 14 冊 126 單元全數完成**
- 自然科開工（`js/data/texts-science.js`，新檔已註冊到 app.js 的 TEXT_FILES 與 test/test.js）：
  **自然科 14 冊 126 單元全數完成 ✅**（2026-08-29～30）；社會科 126 單元亦已完成
- 數學開工（`js/data/texts-math.js`，已註冊到 app.js TEXT_FILES 與 test/test.js）：
  **數學 24 冊 216 單元全數完成 ✅**（小學 12 冊 108 ＋ 國中 6 冊 54 ＋ 高中 6 冊 54，2026-08-30）
- **英文 24 冊 216 單元全數完成 ✅**（小學 12 冊 108 ＋ 國中 6 冊 54 ＋ 高中 6 冊 54，2026-08-31）
- 四科合計 684 單元（社會 126／自然 126／數學 216／英文 216）
- **國語改做「語文常識帶讀」獨立一區**（2026-08-31）：國語的單元是照 id 自動切的「第 N 單元」，
  沒有主題名稱、加題就整個位移，一單元一篇對不起來。改成不綁單元的語文常識，每個年級 9 篇。
  ・資料：`js/data/texts-chinese.js`，鍵是 `chinese|<年級數字>|第N篇 篇名`
  ・前端：首頁多一張「📖 語文常識帶讀」卡（`data-go="lit"`）→ `view-lit` 列表 → 沿用 view-read 帶讀介面；
    讀完回列表打勾（`state.lit['<年級>|<篇名>']`），不接概念卡也不接測驗
  ・`ensureTexts(cb, forceKey)` 加了 forceKey：國語的 `mainCat()` 回傳 null，要自己指定 'chinese'
  ・test.js 的課文守門對 `chinese|` 開頭的鍵不比對 APP_LESSONS；smoke 第 15 節走完整個流程
  ・進度：**12 個年級 各 9 篇 ✅ ＝ 國語 108 / 108 全數完成**（2026-08-31）
- 2026-08-30：test/browser-smoke.mjs 第 10 節（數學三上概念卡）補上「先走完課文帶讀再進概念卡」，
  因為數學鋪完課文後，有課文的單元會先進 view-read，舊流程直接找 #conceptCheck 會抓不到
- ⚠ 正解位置要打散：test.js 會擋（任一位置 >50% 就失敗）。批量寫完後用 node 重新產生整個 texts 檔
  （載入 APP_TEXTS → 依序把正解輪到 0/1/2/3 → 照固定模板重寫檔案），比逐塊正則安全
- 寫作要點：段落對齊該單元概念卡的順序；每段 5 句以內、每句 ≤60 字；
  viz 盡量用有帶資料的元件（levels/cycle）或該主題本來就對的固定元件（taiwan/plates/poppyramid/weathermap）

## 概念卡「圖文不搭」全站巡檢（2026-08-29，Tony 指出高二地理氣候配到生物細胞層次圖）

- 真正的病灶：`levels` 與 `cycle` 兩個元件**無視卡片傳進來的 items／steps**，一律畫自己內建的內容
  → 111 張卡（levels 80、cycle 31）顯示的是別科的圖。已改成有帶資料就畫卡片自己的內容
- 新測試 `test/viz-match.mjs`（CDP 無頭瀏覽器）：把每張「卡片自己有傳資料」的概念卡實際畫出來，
  比對那些字有沒有出現在圖上；exprsteps 只顯示當前步驟，白名單排除。已寫進 CLAUDE.md 守則
- 先前的 `scratchpad/vizaudit.js`（元件主場科目比對）只抓得到「用錯元件」，抓不到「元件無視資料」，兩支互補

## 待 Tony 決定：單元學習要不要加「課文帶讀」（2026-08-29 訊息 1099）

- 他要的流程：課文整段逐步帶讀 → 現有的概念卡 6 張 → 練習測驗
- 卡點：課本課文有版權，不能放進公開的 GitHub Pages 站
- 已回覆三個選項（訊息 1103）：1) 自撰同主題導讀短文＋逐句朗讀（Web Speech API，$0）
  2) 家長自行匯入課文，只存本機 localStorage、不進 repo 3) 只做教育部生字詞彙表的生字語詞帶讀
- 建議 1＋3 先做；等他回覆再動工

## 概念卡配錯圖的巡檢（2026-08-29，Tony 從高二物理〈渡河問題〉問起）

- 症狀：卡片配的是「概念上沾得上邊、但畫面看不出情境」的通用元件（渡河題配抽象向量加法圖）
- 已修：physics 渡河→新元件 `rivercross`（河流／船／兩個向量／落點，滑桿調船頭角度算時間與漂移）、
  physics 雨傘→`rainwalk`（走越快雨越斜、傘往前傾）、geography 等高線 2 張→`contour`（俯視等高線＋側面剖面，三種模式）
- 巡檢方法（腳本留在 scratchpad/vizaudit.js，可重跑）：算出每種元件的「主場科目」，
  列出「元件主場在別科、且該科只用 1-3 次」的卡片 → 122 筆逐一看過，其餘都是合理共用（生物用顯微鏡、化學用溶液）
- ⚠ 新增元件要同時加進 `test/test.js` 的 WIDGETS 白名單，否則測試會報「未知的元件」

## 社會科地圖卡升級（2026-08-29，示範已送出，等 Tony 確認）

- 做法：`claude-shared/tools/gen-image.sh --gpt`（$0，訂閱介面）畫**完全不含文字**的插畫風底圖 → 存 `img/social/_base-*.webp` → `js/widgets.js` 的 `REG.taiwan` 用 `<image>` 貼底圖＋程式疊中文地名與可點圓點（`MAPS` 裡設 `img/w/h/crop/spots`，載不到自動退回舊的向量示意圖）
- 底圖畫法（Tony 2026-08-29 定案）：**把真實地圖當 `--ref` 參考圖丟給 GPT，只准換畫風、不准改地理**，
  再加「海上要有鯨魚海豚渡輪海龜帆船、陸上有黑熊石虎梅花鹿」這類可愛元素。純文字描述畫出來的河會亂跑（第一版就是），一定要帶參考圖
- 已完成：`img/social/_base-taiwan-cute.webp` 一張底圖供 taiwan 元件三種模式共用（位置與分區／地形／河川），
  30 張 taiwan 概念卡全部受惠；順手修掉 `mode:'river'` 沒對應到 `rivers` 的 bug（3 張卡本來顯示成分區圖）
- 已完成：regionmap 17 張（`js/data/lessons-social.js`）——widget 支援 `img`/`iw`/`ih` 底圖（圖框高度跟著底圖長寬比走，
  item 的 x/y 改成「底圖上的百分比」，靠上緣的名字自動翻到圓點下面）。10 張區域底圖：
  `img/social/map-{eastasia,china,seasia,southasia,westasia,africa,europe,america,oceania,world}.webp`
  （產生腳本 `scratchpad/genmaps.sh`，截圖驗證 `scratchpad/shotreg.mjs <目錄> <序號>`）
- 已完成：weathermap 的 typhoon 模式加臺灣小地圖＋西北路徑箭頭（6 張卡）
- 已完成（2026-08-29，Tony「都做上去」＋「照你建議」）：plates 22（碰撞剖面圖＋震源震央剖面）、
  strata 14（地表草地／化石／新→老時間軸／背斜向斜／斷層面）、weathermap front 4（加臺灣小地圖，鋒面掃過）
  —— 這幾種是示意圖與剖面圖，維持程式繪製（AI 圖會把板塊誰擠誰、地層上下畫錯）。
  mapdir 33 張（八方位／比例尺／圖例）本來就畫得清楚，不動
- 地圖卡這條線到此告一段落。之後若要再擴（英文單字情境圖、自然生物器材、社會歷史場景、國語閱讀插圖、單元封面），
  沿用同一套做法：`gen-image.sh --gpt` ＋ 真實參考圖 ＋ 「不要文字」，中文一律程式疊
- 另提過但還沒排順序的 AI 配圖方向：英文單字情境圖、自然生物／器材圖、社會歷史場景、國語閱讀插圖、單元封面圖

## 已完成：K12Review（v64）

Tony 的三個抱怨與對應修法：

1. **「用時是每日練習還是全部？第一次答對是每日練習的？」** — 舊版只有 `state.daily[].ms` 記得到用時，
   其餘練習完全沒計時。新增總帳 `state.tlog[日期][科目][練習項目] = {ms, n, ok}`：
   - 項目：daily／review／unit／drill／normal／import／retry／write／search／concept／lesson／flash／writing
   - `logAct()` 在每題「第一次作答」記題數與答對數（掛在 bumpStat 旁邊，成績口徑一致）
   - 計時器 `clk*`：以停在練習畫面上的時間計，2 分鐘沒操作就不再累計；測驗畫面由 `paintSnap`
     依「當題的科目」起算（subjOfCat），其他練習畫面由 `render()` 依 `VIEW_ACT` 起算
   - 只留 60 天；不自行 save()，靠作答時的 bumpStat 一併寫入，切頁／切背景／關頁面再補存
2. **「從哪科進去就單看那科，很麻煩」** — 家長／老師檢視搬到最外層（選科目頁最下面一張卡），
   並新增「學習總覽」表：科目一列（該科總計）＋底下每種練習各一列＋全部總計，可切今天／近 7／近 30 天
3. **「分類也怪怪的」** — 各題型正確率改成依科目分組，不再把成語跟 mathCustom 混在一串

其他：每日紀錄點日期進去多一段「⏱ 各項練習（全科合計 X）」；「用時」「第一次答對」改寫成
「每日練習用時」「每日練習第一次答對」；家長頁頂端摘要同步改字。

舊資料相容：`tlogAgg()` 會把 `state.daily`（每日練習）與 `state.review`（總結測驗）的既有 ms／題數
補進總覽並標 legacy，畫面上會註明分項計時是 2026-08-27 起才開始記的。

## 已完成：LanExamMock（v32，commit fe9db51）

- 新增 `LEVEL.tlog[日期][項目] = {ms, n, ok}`，9 種練習（daily／spell／uoe／reading／
  listening／vocab／writing／speaking／review）各自記時間與題數。項目由「目前開著的分頁」
  決定（`curAct()`／`TAB_ACT`），拼寫回合優先判成 spell；計時同 K12Review，2 分鐘沒操作就停
- 家長頁新增 **Time & accuracy by activity** 表，今天／近 7／近 30 天可切，最後一列 Total；
  舊資料用 daily25 的題數與 ms 補位並標 legacy
- `d25Complete()` 用時加 2 小時上限（`D25_MS_CAP`），Daily practice history 的用時改讀 tlog、
  並在拼寫分數旁標出拼寫用時 → 8/21 那筆 568 min 不會再出現
- `test/browser-smoke.mjs` 新增 6 條家長頁測試（全過；`node test/test.js` 122,015 全過）

## 已完成：Tony 2026-08-27 的三項指示

### (2) 標題回最外層 ✅
`homeLink` 改成 `show(state.onboarded ? 'subject' : 'welcome')`。smoke 測試以前拿點標題當
「回首頁」的捷徑（12 處），改用新的測試掛鉤 `window.NavDebug.go('home')`。

### (1) LanExamMock 作答鎖依內容長度算 ✅（v33，commit e91f6b3）
原因：`d25ApplyLock` 的秒數寫死（閱讀第一題 8 秒、同篇 4 秒、其餘 3 秒）。
改成用畫面上真的印出來的字數算（`d25AreaWords` 直接數 DOM，不猜各題型 payload 形狀）：
4 字/秒 ≈240 wpm ＋3 秒思考；文章上限 120 秒、單題 25 秒；聽力改成「播完」才解鎖。

### (3) 解析確認題套到所有題目 — K12Review 這半 ✅（v65）
`autoChk()`（js/app.js，chkOf 附近）：手寫的 CHECKS 優先，沒有才從解析現場生成。
- Ａ 字義列舉（`字＝定義` ≥4 對）→ 問某字的意思，誘答同段解析
- Ｂ 逐選項標註（`(Ａ)說明` ≥3 個）→ 問某選項解析寫什麼
- Ｃ 其餘 → 從解析挑一句，誘答取同冊同課其他題的解析句
- 俚語諺語（`chkSlang`）→ 直接問這句話的意思，誘答取同年級其他條
- 閱讀 → 解析在子題身上，所以 `chkOf` 把畫面上的 `q.explain` 與 `q.qi` 一起傳進去
- 解析 <12 字或「見各選項說明」不生成（全站 4,446 題，6%），退回解析鎖倒數
- 決定性（seed = 題目 id），結果快取；測試掛鉤 `window.ChkDebug.of()`
- browser-smoke 抽樣 920 題：格式全合法、涵蓋率 82%

## 待辦（主線）：解析確認題改成「依解析內容真的出題」

**Tony 2026-08-27 否決 Ｃ型**：句子辨識只確認有沒有看，不確認有沒有懂。他明確說
「30000多題花時間還是能辦到」＝授權做長期批次工程。

保留不動：
- Ａ 字義列舉（`字＝定義` ≥4 對）與 Ｂ 逐選項標註（`(Ａ)說明` ≥3 個）→ 本來就在問解析內容，約 7,500 題
- LanExamMock 的「答錯 → 答對一題確認題才放行」閘門（v34 已上線）與 chk 紀錄

要換掉：Ｃ型 —— K12Review 約 22,900 題、LanExamMock 全部。

**真實規模（2026-08-27 用 tools/chk-todo.js 實測，比原先講的三萬多還大）**

| | 題數 |
| --- | --- |
| 全部非國語題庫（匯入題庫 37,626 ＋ 各科依課綱自編 33,984） | 71,610 |
| 已人工撰寫 | 13 |
| Ａ 字義列舉型（程式自動，內容型，保留） | 243 |
| Ｂ 逐選項標註型（程式自動，內容型，保留） | 7,266 |
| **待人工撰寫** | **56,933** |
| 解析太薄，要先補解析本體才有東西可問 | 7,155 |

機械式的路已經走到頭：試過「詞：定義」逐行列舉（只有 16 題符合）與各科原創題的
「❌ 其他選項：」拆解（只有 6% 拆得出 ≥3 組），都救不了大盤。剩下就是逐題寫。

管線（已完成，2026-08-27）：
- `js/chk-gen.js` — 解析形狀判斷（Ａ/Ｂ/Ｃ/none），前端與 node 腳本共用一份，不會走鐘
- `tools/chk-todo.js` — 待辦清單與統計；`node tools/chk-todo.js custom 20 --json` 直接吐出要寫的題
- `js/data/checks-custom.js` — 存放（跟著 custom.js 一起動態載入，不佔首頁載入量）
- `test/test.js` 驗收器 — **正解必須有連續 3 個字以上出現在該題自己的解析裡**（防模型編造，
  這條當場就抓到我自己寫的兩題沒有字面根據）、4 選項不重複、答案索引有效、
  無「以上皆非」爛誘答、無位置指涉、答案位置要分散

原計畫（Tony 2026-08-27 改為直接用 Claude 額度，agy 那條先擱著）：
1. **逐題由模型撰寫**：餵該題自己的解析，產一題四選一，答案只在該段解析裡、要看懂才答得出
2. **跑在 runner 的 agy**（Tony 的 Google AI Pro 訂閱，$0 API 費），背景批次跑好幾天，一批一 commit
3. **機器驗收（關鍵）**：4 選項不重複／答案索引有效／正解關鍵詞真的出現在該題解析裡（防模型編）／
   無「以上皆非」爛誘答／無位置指涉。過不了退回重出。
   ⚠️ 2026-08-02 四個 agent 交假貨就是因為沒有機器驗收；SOP §硬規則也禁止「外包給平行代理量產」，
   所以是「單一低階模型逐題寫 + 機器驗收」，不是 fan-out
4. **解析太薄的 4,446 題**（只寫「見各選項說明」那種）沒東西可出題 → 要先補解析本體，另列清單
5. **過渡期**：Ｃ型先留著當閘門，每跑完一批換成真的題目，不會有空窗

已回報 Tony（訊息 id 929）：先做管線 + 跑 500 題給他看品質，點頭再放全量。

**2026-08-28 進度：500 題品質樣本已完成（實寫 517 題）**，全部逐題人工撰寫、機器驗收零缺失
（正解關鍵詞必在該題自己的解析裡、4 選項不重複、無爛誘答、無位置指涉、答案位置 130/129/130/128）。
範圍是國語匯入題庫八上第1～3課（x018–x881）。每批 30 題一 commit，共 18 批。
**在等 Tony 看過樣本點頭，再決定要不要放全量（剩約 56,400 題）。**

順手修好的三個匯入題庫老 bug（同一天，已 commit）：
1. 165 題題幹開頭有 Word EQ 轉檔亂碼 `,\S\do -9(０))` → 清掉
2. 57 題克漏字題幹被截斷成「……，（」就沒了 → 依 `~/TelegramClaude/chinese-sources` 原檔補回整篇文章與空格編號
3. 592 題題幹只寫「（承上題）」，單獨抽出來無法作答 → 158 個題組共 750 題重寫題幹，補回整篇文章＋標明本題填第幾個空格
4. 25 題克漏字解析只寫「X，最符合文意」沒有詞義 → 逐詞補寫定義（其中 22 題因此升級成程式可自動出題的Ａ型）

## 待辦：LanExamMock 防亂寫（第三版，其餘項目）

**兩個被推翻的前提（都是 Tony 2026-08-27 當場指出的）**
1. 不能用正確率當態度指標——女兒做 CAE/CPE 認真做也常低於 60%
2. 不能用「他自己的作答時間中位數」當基準——他現在的資料全是亂做的，基準會被汙染。
   而且 Tony 明說「不希望真的太長太久」，所以任何「加題／重做」的懲罰都要先擱著

**結論：基準要從題目內容來，不能從使用者行為來。**

現況（`d25ApplyLock`，js/app.js 約 3474）已經有鎖，但秒數是寫死的，太短：
閱讀題組第一題 8 秒、同篇之後 4 秒、一般題 3 秒、聽力要按播放。8 秒讀完一整篇＝形同虛設。

要做的單一改動：**解鎖秒數改成依內容長度算**
- 閱讀題組第一題 = 文章字數 ÷ 6 字/秒（≈360 wpm，遠快於一般青少年 200–250，是保守下限），上限 90 秒
- 一般題 = （題目＋選項字數）÷ 6 ＋ 2 秒，上限 20 秒
- 聽力改成「播完」才解鎖，不是「按下播放」就解鎖
- A′ 解析確認題、B′ 重做**都先不做**（會讓作業變長）；任務長度也先不鎖，
  改成家長頁顯示「今天把長度調成幾題」
- 一週後用家長頁的分項計時看他真實的作答時間中位數，再決定要不要加規則

原始選項與演進過程（保留備查）：

**設計前提（Tony 2026-08-27 定案）**：兩個小孩程度差很多——女兒做 CAE/CPE 很自動但正確率天然低，
兒子做 FCE 是亂按的那個。**所以認真與否只能用「有沒有花時間想」判定，不能用正確率**。
好消息是 LanExamMock 每個 localStorage key 都有級數前綴（`fce.` / `cae.`），設定天然分級數各存各的，
規則設在 FCE 不會套到 CAE/CPE，不管兩人是同帳號還是兩帳號。

- **Ａ′ 解析確認題只追問「秒殺又答錯」的題**，認真想過才答錯的不追問
- **Ｂ′ 重做的觸發改成「秒殺題數」**：當天 ≥3 題秒殺答錯 → 只重做那幾題（不是全部錯題）
- **Ｃ′ 任務長度不鎖死，改家長可設下限**（例：FCE 下限 15、CAE/CPE 不設）；沒設＝維持現狀
- **「秒殺」門檻**：不用固定秒數。用該使用者「該題型最近 30 題作答時間的中位數」當基準，
  低於中位數 25% 才算；資料不足退回保守預設（寧可放過不要誤判）。
  現成材料：`quiz.times[]`（每題秒數）、`drill.answersReadyAt`、`d25.rush`／`rushStreak`／`slowdown`

原始選項與 Tony 的顧慮（保留備查）：

Tony 2026-08-27 回報（附 Daily practice history 截圖）與查證結果：

- **題數是自選的**：8/24 加的「Daily 10/15/20」，實際題數 = 選的長度 + 最多 1–2 題到期錯題
  （21=20+1、15、11=10+1）。小孩 8/25 調成 15、8/27 調成 10。→ 選項 C 要把這顆按鈕鎖給家長
- **4 分鐘不含 ✍️ 拼寫**：`d25Complete()` 存完 `rec.ms` 之後才跑拼寫回合，`dspComplete()` 只補
  `rec.spell`，沒有再更新 ms。拼寫那段目前完全沒計時
- **8/21 的 568 min 是 bug**：`d25SaveRun()` 存 `elapsed`，續做時 `t0 = Date.now() - elapsed`，
  隔天回來續做就把中間那段全算進去。要加單日上限
- **現有防亂寫只有一層**：解鎖後 2.5 秒內答錯算 rushed，連 2 次罰等 8 秒（`d25.rush`／`slowdown`）

## 前一個案子（已結案）

K12Review codex 體檢修正：A/B 兩級全部修完上線（5c578c0／396a792／8b92341／後端 5595871）。
2026-08-27 Tony 裁示剩下兩項維持現狀不改：(1) 同步的資料最小化與 opt-in (2) token 存 localStorage
與 CSP。以後再有人提這兩點直接引裁示，不用重問。

## 2026-08-30 v82／v83

**v82 帶讀配圖第二輪（項目 1 完工）**
新增 14 種互動元件（js/widgets.js 153 → 160）：化學 bonding／vsepr／imf／actenergy／
ratecurve／galvanic／titration／organic；生物 membrane／translation／immune／feedback／
mitosis；地科 hrdiagram。
帶讀配圖率：化學 2%→14%、生物 5%→14%、地科 7%→13%、物理 16%→23%、
歷史 0→4%（十二條自撰的互動時間軸）、地理 0→6%、公民 0→4%；全站 9%→16%（1,104/7,020 段）。
驗證：test.js／widget-audit（160 種、452 組、9 種動畫收尾）／viz-match／browser-smoke 全綠。

**v83 跨裝置同步（Tony 當日回報的 bug）**
症狀：同一個帳號，手機做完今日練習，旁邊開著的 iPad 一直顯示「今天還沒做」。
查到兩個獨立的原因，都修了：
1. `js/sync.js` 定時輪詢只呼叫 `push()`，而 `push()` 開頭有「本機沒變動就 return」的短路，
   短路時連查雲端的 GET 都不發 → 可見但閒置的分頁永遠拉不到別台的新進度。
   改成每一輪先 `pull()` 再 `push()`，並補上 focus／pageshow 兩個拉取時機。
2. `js/app.js` 判斷「今天完成了沒」是用帶學期後綴的 key（日期|科目|上），
   兩台學期晶片不同就算資料同步過去也顯示不一致 → 新增 `dailyDoneRec()` 忽略學期後綴；
   國語連續天數改吃 `subjMap`。
（當時已確認雲端資料本身是對的：progress.db 裡 15:18:59 那筆確實有 `2026-08-30|上`。）

**下一步（項目 2）**：誘答重寫。`tools/fix-distractors.js` 已寫好但還沒套用到任何科目，
做法是借同一課其他題的正解當誘答，公民乾跑可把「正解最長」從 99.8% 降到 8.5%。
逐科套用 → 逐課抽查 → 把 `test/test.js` 的 BASELINE 上限往下調。

【v88 已完成 2026-09-01】誘答重寫第一階段全數完成。
範圍：11 科自編題庫裡「正解 ≥15 字、最長誘答 ≤8 字」的題目（不必讀題挑最長就會對）——
國小社會 1,448、國小自然 928、數學 405、英文 595、高中七科殘餘 125（機器不敢動的數字題與精確定義題），
加上先前已完成的高中七科批次，全部歸零。全程逐題手寫，未交 subagent。
「正解是唯一最長」比例：science 55.8%、social 50.7%、english 40.9%、math 21.8%、高中七科 8-12%，
全部低於 test/test.js 的基準值。
工具：tools/set-distractors.js（吃 [{id,d:[3]}] 或 [{id,one}]，答案位置用 index%4 打散）、
tools/check-distractor-len.js（先檢查誘答長度夠不夠，避免寫完才被退）、
tools/pad-distractors.py（差 4 字以內時在句首補「其實／基本上／一般來說」，差更多要自己補內容）。
⚠ 英文的音標題（誘答是 /s/ /h/ /tʃ/）與數學的計算題不在範圍內 —— 那些誘答本來就設計得好，
過濾條件要求「每個誘答至少 3 個中文字」就是為了排除它們。
