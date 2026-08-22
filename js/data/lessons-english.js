window.APP_LESSONS = window.APP_LESSONS || {};
/* 英文科概念卡（單元學習用的「教材層」）
   key = english|<冊>|<單元名>，單元名要與 js/data/english.js 的 lesson 欄位一字不差。
   寫法與驗收標準見 docs/bank-maintain-sop.md 流程 D；元件長相看 tools/widget-preview.html。
   ⚠ 讀者是「完全沒學過的人」：先給規則的直覺（為什麼這樣說），再給例句與練習。
   ⚠ 中文與英文之間要空一格（test.js 有守門，避免英文黏在中文旁邊）。 */

window.APP_LESSONS['english|三上|第1單元 短母音 a、e、i'] = {
  intro: '英文字母不只有名字，還有「聲音」。學會聽出聲音，你就能自己拼出單字。',
  cards: [
    {
      title: '① 字母的名字與聲音',
      body: '每個字母有兩種身分：名字（唸法）和聲音（在單字裡發出的音）。\n' +
            '例如 a 的名字唸作 ei，但在 cat 裡發的是短母音的音。\n' +
            '⚠ 自然發音法就是「看到字母就知道要發什麼音」，不用一個一個死背單字。',
      viz: { type: 'phonics', words: [
        { w: 'cat', parts: ['c', 'a', 't'], hit: 1, s: 'a 的短音', mean: '貓',
          note: '子音＋母音＋子音的組合裡，中間的母音多半發短音。' },
        { w: 'map', parts: ['m', 'a', 'p'], hit: 1, s: 'a 的短音', mean: '地圖',
          note: '把三個音連起來唸，就拼出整個字。' }] },
      tip: '按下面的單字按鈕，看每個字的目標音。',
      check: {
        q: '「自然發音法」主要在教什麼？',
        options: [
          '看到字母組合就知道怎麼發音，進而拼讀單字',
          '把每個單字的中文意思背起來',
          '只教字母的名字',
          '只教寫字的筆順'
        ],
        answer: 0,
        why: [
          null,
          '背中文意思是字彙學習，不是發音規則。',
          '字母名字只是其中一部分。',
          '書寫與發音是不同的能力。'
        ]
      }
    },
    {
      title: '② 短母音 a',
      body: '在「子音＋母音＋子音」的字裡，a 通常發短音。\n' +
            '例：cat（貓）、map（地圖）、bag（袋子）、hat（帽子）、dad（爸爸）。\n' +
            '⚠ 唸的時候嘴巴張開、聲音短促，不要拉長。',
      viz: { type: 'phonics', words: [
        { w: 'bag', parts: ['b', 'a', 'g'], hit: 1, s: 'a 的短音', mean: '袋子' },
        { w: 'hat', parts: ['h', 'a', 't'], hit: 1, s: 'a 的短音', mean: '帽子' },
        { w: 'dad', parts: ['d', 'a', 'd'], hit: 1, s: 'a 的短音', mean: '爸爸' }] },
      check: {
        q: '下列哪一個單字中的 a 發的是短母音？',
        options: ['bag', 'cake', 'name', 'game'],
        answer: 0,
        why: [
          null,
          '字尾有 e 時，前面的 a 通常發長音。',
          '這個字的 a 同樣發長音。',
          '字尾的 e 讓 a 唸出字母本身的名字。'
        ]
      }
    },
    {
      title: '③ 短母音 e',
      body: '例：bed（床）、pen（筆）、red（紅色）、ten（十）、egg（蛋）。\n' +
            '⚠ 短母音 e 的嘴型比 a 小一些，發音也很短。\n' +
            '練習方法：把子音和母音分開唸，再連起來（b-e-d → bed）。',
      viz: { type: 'phonics', words: [
        { w: 'bed', parts: ['b', 'e', 'd'], hit: 1, s: 'e 的短音', mean: '床' },
        { w: 'pen', parts: ['p', 'e', 'n'], hit: 1, s: 'e 的短音', mean: '筆' },
        { w: 'ten', parts: ['t', 'e', 'n'], hit: 1, s: 'e 的短音', mean: '十' }] },
      check: {
        q: '下列哪一組單字的母音發音相同？',
        options: [
          'bed、pen、ten',
          'bed、cake、pig',
          'pen、name、hot',
          'ten、bike、cup'
        ],
        answer: 0,
        why: [
          null,
          '這三個字分別是短音 e、長音 a 與短音 i。',
          '三個字的母音各不相同。',
          '這三個字的母音也不一樣。'
        ]
      }
    },
    {
      title: '④ 短母音 i',
      body: '例：pig（豬）、big（大的）、sit（坐）、six（六）、fish（魚）。\n' +
            '⚠ 短母音 i 的聲音比較尖、比較短。\n' +
            '和長音比較：sit（坐）／site、pin／pine，字尾多一個 e 就變成長音。',
      viz: { type: 'phonics', words: [
        { w: 'pig', parts: ['p', 'i', 'g'], hit: 1, s: 'i 的短音', mean: '豬' },
        { w: 'six', parts: ['s', 'i', 'x'], hit: 1, s: 'i 的短音', mean: '六' },
        { w: 'sit', parts: ['s', 'i', 't'], hit: 1, s: 'i 的短音', mean: '坐' }] },
      check: {
        q: 'big 和 bike 這兩個字的母音有什麼不同？',
        options: [
          'big 是短母音、bike 因為字尾有 e 而發長母音',
          '兩個字的母音完全相同',
          'big 是長母音、bike 是短母音',
          '兩個字都沒有母音'
        ],
        answer: 0,
        why: [
          null,
          '兩者的母音長短明顯不同。',
          '規則剛好相反，字尾的 e 會讓母音變長音。',
          'i 就是這兩個字的母音。'
        ]
      }
    },
    {
      title: '⑤ 拼讀練習',
      body: '拼讀三步驟：① 把每個字母的音分開唸 ② 慢慢連起來 ③ 加快變成完整的字。\n' +
            '例：c-a-t → cat；b-e-d → bed；p-i-g → pig。\n' +
            '⚠ 遇到不認識的字也可以先試著拼讀，這是自學單字的關鍵能力。',
      viz: { type: 'phonics', words: [
        { w: 'map', parts: ['m', 'a', 'p'], hit: 1, s: 'a 的短音', mean: '地圖' },
        { w: 'red', parts: ['r', 'e', 'd'], hit: 1, s: 'e 的短音', mean: '紅色' },
        { w: 'fish', parts: ['f', 'i', 'sh'], hit: 1, s: 'i 的短音', mean: '魚' }] },
      check: {
        q: '看到一個沒學過的字 mat，可以怎麼唸出來？',
        options: [
          '先分別唸出 m、短音 a、t 三個音，再連起來',
          '直接猜一個發音',
          '一定要先查中文意思才能唸',
          '只能請老師唸給你聽'
        ],
        answer: 0,
        why: [
          null,
          '亂猜不會建立正確的發音習慣。',
          '拼讀不需要先知道中文意思。',
          '自然發音的目的就是能自己拼讀。'
        ]
      }
    },
    {
      title: '⑥ 短母音的比較',
      body: '同樣的子音架構，只換中間的母音，意思就完全不同：\n' +
            'bat（球棒）／bet（打賭）／bit（一點點）；\n' +
            'pan（平底鍋）／pen（筆）／pin（別針）。\n' +
            '⚠ 所以母音聽錯，整個字的意思就錯了——這是聽力練習的重點。',
      viz: { type: 'phonics', words: [
        { w: 'pan', parts: ['p', 'a', 'n'], hit: 1, s: 'a 的短音', mean: '平底鍋' },
        { w: 'pen', parts: ['p', 'e', 'n'], hit: 1, s: 'e 的短音', mean: '筆' },
        { w: 'pin', parts: ['p', 'i', 'n'], hit: 1, s: 'i 的短音', mean: '別針' }] },
      check: {
        q: 'pan、pen、pin 這三個字的差別在哪裡？',
        options: [
          '只有中間的母音不同，意思卻完全不一樣',
          '三個字的意思相同',
          '子音不同',
          '三個字唸起來完全一樣'
        ],
        answer: 0,
        why: [
          null,
          '三個字分別是平底鍋、筆與別針。',
          '開頭的 p 與結尾的 n 都相同。',
          '母音不同，唸起來也不同。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三上|第2單元 短母音 o、u'] = {
  intro: '把五個短母音學完，你就能拼讀出好幾百個常用單字。',
  cards: [
    {
      title: '① 短母音 o',
      body: '例：dog（狗）、hot（熱的）、box（盒子）、top（頂端）、pot（鍋子）。\n' +
            '⚠ 嘴巴要張開成圓形，聲音短促。\n' +
            '和長音比較：hop（跳）／hope（希望）、not（不）／note（筆記）。',
      viz: { type: 'phonics', words: [
        { w: 'dog', parts: ['d', 'o', 'g'], hit: 1, s: 'o 的短音', mean: '狗' },
        { w: 'box', parts: ['b', 'o', 'x'], hit: 1, s: 'o 的短音', mean: '盒子' },
        { w: 'hot', parts: ['h', 'o', 't'], hit: 1, s: 'o 的短音', mean: '熱的' }] },
      tip: '按單字按鈕，看每個字的目標音。',
      check: {
        q: 'hop 和 hope 的差別在哪裡？',
        options: [
          '字尾多了 e，使 o 由短音變成長音',
          '兩個字唸法完全相同',
          'hope 的 o 是短音',
          '兩個字都沒有母音'
        ],
        answer: 0,
        why: [
          null,
          '兩個字的母音長短不同。',
          '字尾有 e 時 o 發長音。',
          'o 就是這兩個字的母音。'
        ]
      }
    },
    {
      title: '② 短母音 u',
      body: '例：cup（杯子）、bus（公車）、sun（太陽）、run（跑）、cut（切）。\n' +
            '⚠ 短音 u 的聲音接近中文的「啊」但更短促，嘴型放鬆。\n' +
            '和長音比較：cut（切）／cute（可愛的）、tub（浴缸）／tube（管子）。',
      viz: { type: 'phonics', words: [
        { w: 'cup', parts: ['c', 'u', 'p'], hit: 1, s: 'u 的短音', mean: '杯子' },
        { w: 'sun', parts: ['s', 'u', 'n'], hit: 1, s: 'u 的短音', mean: '太陽' },
        { w: 'bus', parts: ['b', 'u', 's'], hit: 1, s: 'u 的短音', mean: '公車' }] },
      check: {
        q: '下列哪一個字的 u 發短母音？',
        options: ['bus', 'cute', 'tube', 'use'],
        answer: 0,
        why: [
          null,
          '字尾有 e，u 發長音。',
          '這個字的 u 同樣是長音。',
          'use 的 u 唸出字母本身的名字。'
        ]
      }
    },
    {
      title: '③ 五個短母音一起看',
      body: 'a（cat）、e（bed）、i（pig）、o（dog）、u（cup）。\n' +
            '⚠ 共同規則：出現在「子音＋母音＋子音」結構中時，母音通常發短音。\n' +
            '這個結構在英文裡非常常見，學會就能拼讀大量單字。',
      viz: { type: 'phonics', words: [
        { w: 'cat', parts: ['c', 'a', 't'], hit: 1, s: 'a 的短音', mean: '貓' },
        { w: 'bed', parts: ['b', 'e', 'd'], hit: 1, s: 'e 的短音', mean: '床' },
        { w: 'pig', parts: ['p', 'i', 'g'], hit: 1, s: 'i 的短音', mean: '豬' },
        { w: 'dog', parts: ['d', 'o', 'g'], hit: 1, s: 'o 的短音', mean: '狗' },
        { w: 'cup', parts: ['c', 'u', 'p'], hit: 1, s: 'u 的短音', mean: '杯子' }] },
      check: {
        q: '短母音通常出現在什麼樣的結構中？',
        options: [
          '子音＋母音＋子音（例如 cat、bed、cup）',
          '字尾一定有 e',
          '單字一定有五個字母以上',
          '母音一定在字尾'
        ],
        answer: 0,
        why: [
          null,
          '字尾有 e 時母音多半發長音。',
          '短母音的字通常很短。',
          '母音在字尾時常發長音。'
        ]
      }
    },
    {
      title: '④ 換一個母音就換一個字',
      body: 'bag／beg／big／bog／bug；cat／cot／cut；\n' +
            'hat／hot／hut。\n' +
            '⚠ 這種只差一個音的字組叫「最小對比」，是練習聽力最好的材料。',
      viz: { type: 'phonics', words: [
        { w: 'cat', parts: ['c', 'a', 't'], hit: 1, s: 'a 的短音', mean: '貓' },
        { w: 'cot', parts: ['c', 'o', 't'], hit: 1, s: 'o 的短音', mean: '小床' },
        { w: 'cut', parts: ['c', 'u', 't'], hit: 1, s: 'u 的短音', mean: '切' }] },
      check: {
        q: 'cat、cot、cut 這三個字為什麼意思完全不同？',
        options: [
          '因為中間的母音不同',
          '因為第一個字母不同',
          '因為最後一個字母不同',
          '因為它們其實意思相同'
        ],
        answer: 0,
        why: [
          null,
          '三個字都以 c 開頭。',
          '三個字都以 t 結尾。',
          '三個字分別是貓、小床與切。'
        ]
      }
    },
    {
      title: '⑤ 常見的短母音單字',
      body: '短母音的常用字（sight words 之外的可拼讀字）：\n' +
            'man、pan、hen、net、win、lip、mom、job、fun、bug。\n' +
            '⚠ 每天練習拼讀 5 個字，累積起來就是很大的字彙量。',
      viz: { type: 'phonics', words: [
        { w: 'net', parts: ['n', 'e', 't'], hit: 1, s: 'e 的短音', mean: '網子' },
        { w: 'job', parts: ['j', 'o', 'b'], hit: 1, s: 'o 的短音', mean: '工作' },
        { w: 'fun', parts: ['f', 'u', 'n'], hit: 1, s: 'u 的短音', mean: '樂趣' }] },
      check: {
        q: '學會自然發音之後，遇到沒學過的短單字可以怎麼辦？',
        options: [
          '先自己拼讀出聲，再對照意思',
          '直接跳過不看',
          '一定要等別人教',
          '只能死背整個單字'
        ],
        answer: 0,
        why: [
          null,
          '拼讀能力就是為了自己讀出來。',
          '自然發音的目的正是能自學。',
          '拼讀比死背更有效率。'
        ]
      }
    },
    {
      title: '⑥ 拼寫也用得上',
      body: '反過來也成立：聽到聲音就能寫出字母。\n' +
            '聽到 s-u-n 三個音 → 寫出 sun。\n' +
            '⚠ 這叫「聽寫」，是把發音規則用在拼字上，能大幅減少背單字的負擔。',
      viz: { type: 'phonics', words: [
        { w: 'sun', parts: ['s', 'u', 'n'], hit: 1, s: 'u 的短音', mean: '太陽' },
        { w: 'map', parts: ['m', 'a', 'p'], hit: 1, s: 'a 的短音', mean: '地圖' }] },
      check: {
        q: '自然發音法對「拼字」有什麼幫助？',
        options: [
          '聽到聲音就能推出字母，減少死背的負擔',
          '完全沒有幫助',
          '只對唸讀有用',
          '會讓拼字變得更難'
        ],
        answer: 0,
        why: [
          null,
          '發音與拼字是一體兩面。',
          '拼讀與拼寫可以互相支援。',
          '有規則反而比死背容易。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三上|第3單元 magic e 長母音'] = {
  intro: '字尾加一個不發音的 e，前面的母音就會唸出自己的名字——這是英文最好用的規則之一。',
  cards: [
    {
      title: '① 什麼是 magic e',
      body: '在「子音＋母音＋子音＋e」的結構中，最後的 e 不發音，\n' +
            '但會讓前面的母音發「長音」（也就是字母本身的名字）。\n' +
            '⚠ 例：cap（帽子）→ cape（斗篷）；kit（工具組）→ kite（風箏）。',
      viz: { type: 'phonics', words: [
        { w: 'cap', parts: ['c', 'a', 'p'], hit: 1, s: 'a 的短音', mean: '帽子' },
        { w: 'cape', parts: ['c', 'a', 'p', 'e'], hit: 1, s: 'a 的長音', mean: '斗篷',
          note: '字尾的 e 不發音，卻讓前面的 a 唸出字母的名字。' }] },
      tip: '按兩個單字比較看看差在哪裡。',
      check: {
        q: 'magic e 的作用是什麼？',
        options: [
          '自己不發音，但讓前面的母音變成長音',
          '自己要發音',
          '讓前面的母音消失',
          '讓子音變成母音'
        ],
        answer: 0,
        why: [
          null,
          '字尾的 e 在這個規則中不發音。',
          '母音仍然存在，只是發長音。',
          '子音不會因此改變。'
        ]
      }
    },
    {
      title: '② a_e 的字',
      body: 'cake（蛋糕）、name（名字）、game（遊戲）、late（遲到）、face（臉）。\n' +
            '⚠ 這些字裡的 a 唸出字母 a 的名字。\n' +
            '比較：hat／hate、mad／made、tap／tape。',
      viz: { type: 'phonics', words: [
        { w: 'cake', parts: ['c', 'a', 'k', 'e'], hit: 1, s: 'a 的長音', mean: '蛋糕' },
        { w: 'name', parts: ['n', 'a', 'm', 'e'], hit: 1, s: 'a 的長音', mean: '名字' },
        { w: 'game', parts: ['g', 'a', 'm', 'e'], hit: 1, s: 'a 的長音', mean: '遊戲' }] },
      check: {
        q: 'tap 加上字尾的 e 變成 tape 之後，發音會怎麼改變？',
        options: [
          'a 由短音變成長音',
          '完全不變',
          'a 由長音變成短音',
          'p 不發音'
        ],
        answer: 0,
        why: [
          null,
          '母音的長短明顯改變。',
          '規則的方向剛好相反。',
          'p 仍然要發音。'
        ]
      }
    },
    {
      title: '③ i_e 與 o_e 的字',
      body: 'i_e：bike（腳踏車）、time（時間）、nine（九）、like（喜歡）、ride（騎）。\n' +
            'o_e：nose（鼻子）、home（家）、note（筆記）、rose（玫瑰）、hope（希望）。\n' +
            '⚠ 規則相同：字尾的 e 不發音，前面的母音唸長音。',
      viz: { type: 'phonics', words: [
        { w: 'bike', parts: ['b', 'i', 'k', 'e'], hit: 1, s: 'i 的長音', mean: '腳踏車' },
        { w: 'nine', parts: ['n', 'i', 'n', 'e'], hit: 1, s: 'i 的長音', mean: '九' },
        { w: 'home', parts: ['h', 'o', 'm', 'e'], hit: 1, s: 'o 的長音', mean: '家' }] },
      check: {
        q: '下列哪一個字的母音發「長音」？',
        options: ['nine', 'pin', 'sit', 'big'],
        answer: 0,
        why: [
          null,
          '這個字是短母音 i。',
          '沒有字尾的 e，發短音。',
          '同樣是短母音的字。'
        ]
      }
    },
    {
      title: '④ u_e 與 e_e',
      body: 'u_e：cute（可愛的）、use（使用）、tube（管子）、cube（立方體）。\n' +
            'e_e 較少見：these（這些）、theme（主題）。\n' +
            '⚠ u 的長音有兩種唸法（如 cute 與 rule），先掌握常見的那一種即可。',
      viz: { type: 'phonics', words: [
        { w: 'cute', parts: ['c', 'u', 't', 'e'], hit: 1, s: 'u 的長音', mean: '可愛的' },
        { w: 'cube', parts: ['c', 'u', 'b', 'e'], hit: 1, s: 'u 的長音', mean: '立方體' }] },
      check: {
        q: 'cut 和 cute 的差別是什麼？',
        options: [
          '字尾的 e 使 u 由短音變長音，意思也完全不同',
          '兩個字意思相同',
          '兩個字發音相同',
          'cute 的 u 是短音'
        ],
        answer: 0,
        why: [
          null,
          '一個是切，一個是可愛的。',
          '母音的長短明顯不同。',
          '字尾的 e 讓 u 發長音。'
        ]
      }
    },
    {
      title: '⑤ 長短音的比較練習',
      body: 'mad／made、kit／kite、hop／hope、cub／cube、pet／Pete。\n' +
            '⚠ 練習方法：先唸短音版本，再加上字尾的 e 唸長音版本，\n' +
            '感受嘴型與長度的差別。',
      viz: { type: 'phonics', words: [
        { w: 'kit', parts: ['k', 'i', 't'], hit: 1, s: 'i 的短音', mean: '工具組' },
        { w: 'kite', parts: ['k', 'i', 't', 'e'], hit: 1, s: 'i 的長音', mean: '風箏' },
        { w: 'hop', parts: ['h', 'o', 'p'], hit: 1, s: 'o 的短音', mean: '單腳跳' },
        { w: 'hope', parts: ['h', 'o', 'p', 'e'], hit: 1, s: 'o 的長音', mean: '希望' }] },
      check: {
        q: '要判斷一個單字的母音是長音還是短音，最先要看什麼？',
        options: [
          '字尾有沒有不發音的 e',
          '單字有幾個字母',
          '第一個字母是什麼',
          '單字的中文意思'
        ],
        answer: 0,
        why: [
          null,
          '長度不是判斷的關鍵。',
          '開頭的字母不影響母音長短。',
          '中文意思與發音規則無關。'
        ]
      }
    },
    {
      title: '⑥ 規則也有例外',
      body: '英文的發音規則不是百分之百：have、give、love 的字尾雖有 e，\n' +
            '母音卻不發長音。\n' +
            '⚠ 遇到例外不要慌：規則能幫你處理大部分的字，\n' +
            '少數例外只要多接觸幾次就會記住。',
      viz: { type: 'phonics', words: [
        { w: 'have', parts: ['h', 'a', 'v', 'e'], hit: 1, s: '這裡是短音（例外）', mean: '有' },
        { w: 'cake', parts: ['c', 'a', 'k', 'e'], hit: 1, s: 'a 的長音（規則）', mean: '蛋糕' }] },
      check: {
        q: '遇到不符合發音規則的單字（例如 have），應該怎麼看待？',
        options: [
          '規則能處理大部分的字，少數例外多接觸就會記住',
          '代表發音規則沒有用',
          '應該放棄學發音規則',
          '所有規則都是錯的'
        ],
        answer: 0,
        why: [
          null,
          '規則仍然適用於大多數的單字。',
          '規則能大幅減少學習負擔。',
          '例外的存在不代表規則無效。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三上|第4單元 字母組合 sh、ch、th'] = {
  intro: '有些聲音要兩個字母合作才發得出來——它們是一組，不能拆開唸。',
  cards: [
    {
      title: '① 什麼是字母組合',
      body: '兩個字母合在一起發出「一個新的音」，不是把兩個音分開唸。\n' +
            '⚠ 例：sh 不是唸 s 加 h，而是像要人安靜時發出的那個音。\n' +
            '常見組合：sh、ch、th、ph、wh、ck、ng。',
      viz: { type: 'phonics', words: [
        { w: 'ship', parts: ['sh', 'i', 'p'], hit: 0, s: 'sh 的音', mean: '船',
          note: 'sh 兩個字母合起來只發一個音。' },
        { w: 'fish', parts: ['f', 'i', 'sh'], hit: 2, s: 'sh 的音', mean: '魚' }] },
      tip: '按單字按鈕，看目標的字母組合。',
      check: {
        q: '字母組合 sh 應該怎麼唸？',
        options: [
          '兩個字母合起來發一個音',
          '先唸 s 再唸 h',
          '只唸 s',
          '只唸 h'
        ],
        answer: 0,
        why: [
          null,
          '分開唸就不是這個組合的音了。',
          '省略其中一個字母會發錯音。',
          '兩個字母缺一不可。'
        ]
      }
    },
    {
      title: '② sh 的音',
      body: '例：ship（船）、shop（商店）、fish（魚）、she（她）、wash（洗）。\n' +
            '⚠ sh 可以出現在字首（ship）也可以在字尾（fish）。\n' +
            '發音時嘴唇微微向前噘起，氣流從舌頭上方通過。',
      viz: { type: 'phonics', words: [
        { w: 'shop', parts: ['sh', 'o', 'p'], hit: 0, s: 'sh 的音', mean: '商店' },
        { w: 'wash', parts: ['w', 'a', 'sh'], hit: 2, s: 'sh 的音', mean: '洗' }] },
      check: {
        q: '下列哪一個字含有 sh 的音？',
        options: ['fish', 'sit', 'sad', 'six'],
        answer: 0,
        why: [
          null,
          '這個字只有單獨的 s 音。',
          '開頭的 s 是單獨的子音。',
          'six 的 s 也是單獨發音。'
        ]
      }
    },
    {
      title: '③ ch 的音',
      body: '例：chair（椅子）、cheese（起司）、lunch（午餐）、teach（教）、watch（手錶）。\n' +
            '⚠ ch 的音比 sh 多了一個「頂舌」的開頭，像中文注音的ㄑ但更短促。\n' +
            '同樣可以出現在字首與字尾。',
      viz: { type: 'phonics', words: [
        { w: 'chair', parts: ['ch', 'air'], hit: 0, s: 'ch 的音', mean: '椅子' },
        { w: 'lunch', parts: ['l', 'u', 'n', 'ch'], hit: 3, s: 'ch 的音', mean: '午餐' }] },
      check: {
        q: 'ship 和 chip 的差別在哪裡？',
        options: [
          '開頭的字母組合不同，發音也不同',
          '兩個字完全一樣',
          '只有中間的母音不同',
          '只有結尾不同'
        ],
        answer: 0,
        why: [
          null,
          '兩個字的意思分別是船與薄片。',
          '兩個字的母音相同，差別在開頭。',
          '兩個字都以 p 結尾。'
        ]
      }
    },
    {
      title: '④ th 的音',
      body: 'th 有兩種發音：\n' +
            '① 無聲：three（三）、think（想）、mouth（嘴巴）。\n' +
            '② 有聲：this（這個）、that（那個）、mother（媽媽）。\n' +
            '⚠ 兩者的舌頭位置相同（輕輕放在上下牙齒之間），差別在有沒有振動聲帶。',
      viz: { type: 'phonics', words: [
        { w: 'three', parts: ['th', 'r', 'ee'], hit: 0, s: 'th 無聲', mean: '三' },
        { w: 'this', parts: ['th', 'i', 's'], hit: 0, s: 'th 有聲', mean: '這個' },
        { w: 'mouth', parts: ['m', 'ou', 'th'], hit: 2, s: 'th 無聲', mean: '嘴巴' }] },
      check: {
        q: 'th 的發音有什麼特別的地方？',
        options: [
          '舌尖要輕放在上下牙齒之間，而且有兩種發音',
          '只有一種發音',
          '和 s 完全相同',
          '不用動舌頭'
        ],
        answer: 0,
        why: [
          null,
          'th 分為有聲與無聲兩種。',
          '兩者的舌位不同，s 的舌尖不外伸。',
          '舌位是這個音的關鍵。'
        ]
      }
    },
    {
      title: '⑤ 其他常見組合',
      body: 'ph 發 f 的音：phone（電話）、photo（照片）。\n' +
            'wh：what（什麼）、when（何時）、where（哪裡）。\n' +
            'ck 發 k 的音：duck（鴨子）、back（背後）。\n' +
            'ng：sing（唱歌）、ring（戒指）。',
      viz: { type: 'phonics', words: [
        { w: 'phone', parts: ['ph', 'o', 'n', 'e'], hit: 0, s: 'ph 發 f 的音', mean: '電話' },
        { w: 'duck', parts: ['d', 'u', 'ck'], hit: 2, s: 'ck 發 k 的音', mean: '鴨子' },
        { w: 'sing', parts: ['s', 'i', 'ng'], hit: 2, s: 'ng 的音', mean: '唱歌' }] },
      check: {
        q: 'photo 這個字開頭的 ph 發什麼音？',
        options: [
          '發 f 的音',
          '發 p 的音',
          '發 h 的音',
          '不發音'
        ],
        answer: 0,
        why: [
          null,
          'ph 合起來不唸 p。',
          'h 在這個組合中不單獨發音。',
          '這個組合是要發音的。'
        ]
      }
    },
    {
      title: '⑥ 綜合拼讀',
      body: '把字母組合當成「一個音」來拼讀：\n' +
            'sh-o-p → shop；ch-i-p → chip；th-i-s → this；d-u-ck → duck。\n' +
            '⚠ 看到兩個字母時先想想：它們是一組嗎？\n' +
            '判斷正確，拼讀就會順利。',
      viz: { type: 'phonics', words: [
        { w: 'shop', parts: ['sh', 'o', 'p'], hit: 0, s: 'sh 的音', mean: '商店' },
        { w: 'chip', parts: ['ch', 'i', 'p'], hit: 0, s: 'ch 的音', mean: '薄片' },
        { w: 'this', parts: ['th', 'i', 's'], hit: 0, s: 'th 有聲', mean: '這個' }] },
      check: {
        q: '拼讀 shop 這個字時，正確的切法是什麼？',
        options: [
          'sh／o／p 三個音',
          's／h／o／p 四個音',
          'sho／p 兩個音',
          's／hop 兩個音'
        ],
        answer: 0,
        why: [
          null,
          'sh 是一組，不能拆開。',
          'o 是獨立的母音，不與 sh 合併。',
          '這樣切會唸錯開頭的音。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三上|第5單元 打招呼與介紹他人'] = {
  intro: '學英文的第一件事，是能開口跟人說第一句話。',
  cards: [
    {
      title: '① 基本問候語',
      body: 'Hello.／Hi.（你好）　Good morning.（早安）\n' +
            'Good afternoon.（午安）　Good evening.（晚安，見面時用）\n' +
            '⚠ Good night. 是「道別或睡前」才用的，不是見面時的招呼語。',
      viz: { type: 'sentence', label: '打招呼', items: [
        { t: 'Good', r: '好的' }, { t: 'morning', r: '早晨' }],
        note: 'Good morning 直譯是「好的早晨」，用在中午之前。',
        alt: [
          { label: '午安', items: [{ t: 'Good', r: '好的' }, { t: 'afternoon', r: '下午' }],
            note: '中午之後到傍晚之前使用。' },
          { label: '道別', items: [{ t: 'Good', r: '好的' }, { t: 'night', r: '夜晚' }],
            note: 'Good night 用於道別或睡前，不是見面時的問候。' }] },
      tip: '按按鈕看不同時段的用法。',
      check: {
        q: '晚上第一次見到朋友時，應該說什麼？',
        options: [
          'Good evening.',
          'Good night.',
          'Good morning.',
          'Goodbye.'
        ],
        answer: 0,
        why: [
          null,
          'Good night 是道別或睡前用語。',
          'Good morning 用在早上。',
          'Goodbye 是道別時說的。'
        ]
      }
    },
    {
      title: '② 問候與回答',
      body: 'How are you?（你好嗎？）\n' +
            '回答：I am fine, thank you.／Great!／Not bad.／So-so.\n' +
            '⚠ 回答之後可以反問：And you?（那你呢？）讓對話繼續下去。',
      viz: { type: 'sentence', label: '問句', items: [
        { t: 'How', r: '如何' }, { t: 'are', r: 'be 動詞' }, { t: 'you', r: '你' }],
        note: '疑問詞 How 放在句首，後面接 be 動詞與主詞。',
        alt: [
          { label: '回答', items: [{ t: 'I', r: '我' }, { t: 'am', r: 'be 動詞' },
            { t: 'fine', r: '形容詞' }], note: '主詞＋be 動詞＋形容詞，說明自己的狀態。' }] },
      check: {
        q: '別人問你 How are you? 之後，你回答完可以再說什麼讓對話繼續？',
        options: [
          'And you?',
          'Goodbye.',
          'Thank you very much.',
          'I do not know.'
        ],
        answer: 0,
        why: [
          null,
          '這是道別，會結束對話。',
          '道謝之後對話可能就停住了。',
          '這個回答無法延續話題。'
        ]
      }
    },
    {
      title: '③ 自我介紹',
      body: 'My name is Amy.／I am Amy.（我叫 Amy。）\n' +
            'Nice to meet you.（很高興認識你。）\n' +
            '回應：Nice to meet you, too.（我也很高興認識你。）\n' +
            '⚠ too 表示「也」，放在句尾。',
      viz: { type: 'sentence', label: '自我介紹', items: [
        { t: 'My name', r: '主詞' }, { t: 'is', r: 'be 動詞' }, { t: 'Amy', r: '名字' }],
        note: '主詞是 My name（我的名字），所以 be 動詞用 is。',
        alt: [
          { label: '另一種說法', items: [{ t: 'I', r: '主詞' }, { t: 'am', r: 'be 動詞' },
            { t: 'Amy', r: '名字' }], note: '主詞是 I 時，be 動詞用 am。' }] },
      check: {
        q: '為什麼 My name is Amy 用 is，而 I am Amy 用 am？',
        options: [
          '因為 be 動詞要配合主詞：My name 用 is、I 用 am',
          '因為兩句意思不同',
          '因為 is 比較有禮貌',
          '因為可以隨便用'
        ],
        answer: 0,
        why: [
          null,
          '兩句的意思相同。',
          '禮貌與 be 動詞的選擇無關。',
          'be 動詞必須配合主詞，不能隨意替換。'
        ]
      }
    },
    {
      title: '④ 介紹別人',
      body: 'This is my friend, Ben.（這是我的朋友 Ben。）\n' +
            'He is my brother.（他是我哥哥。）　She is my teacher.（她是我老師。）\n' +
            '⚠ 男生用 he、女生用 she；介紹在場的人用 This is，不用 He is 開頭。',
      viz: { type: 'sentence', label: '介紹他人', items: [
        { t: 'This', r: '這位' }, { t: 'is', r: 'be 動詞' }, { t: 'my friend', r: '說明' }],
        note: '介紹身邊的人時用 This is，就像中文說「這是我朋友」。',
        alt: [
          { label: '談論他', items: [{ t: 'He', r: '他' }, { t: 'is', r: 'be 動詞' },
            { t: 'my brother', r: '說明' }], note: '男生用 he，女生用 she。' }] },
      check: {
        q: '要把身邊的朋友介紹給別人，最自然的說法是什麼？',
        options: [
          'This is my friend, Ben.',
          'He is a book.',
          'I am Ben.',
          'Goodbye, Ben.'
        ],
        answer: 0,
        why: [
          null,
          '人不能用 a book 描述。',
          '這是介紹自己，不是介紹別人。',
          '這是道別而不是介紹。'
        ]
      }
    },
    {
      title: '⑤ 道別用語',
      body: 'Goodbye.／Bye.（再見）　See you.／See you later.（待會見）\n' +
            'See you tomorrow.（明天見）　Have a nice day.（祝你有美好的一天）\n' +
            '⚠ Bye 比 Goodbye 更口語，朋友之間常用。',
      viz: { type: 'sentence', label: '道別', items: [
        { t: 'See', r: '看見' }, { t: 'you', r: '你' }, { t: 'tomorrow', r: '明天' }],
        note: '直譯是「明天見到你」，也就是中文的「明天見」。' },
      check: {
        q: '要跟同學說「明天見」，應該怎麼說？',
        options: [
          'See you tomorrow.',
          'Good morning.',
          'How are you?',
          'Nice to meet you.'
        ],
        answer: 0,
        why: [
          null,
          '這是早上見面時的問候。',
          '這是詢問對方的狀況。',
          '這是初次見面時說的。'
        ]
      }
    },
    {
      title: '⑥ 禮貌用語',
      body: 'Please.（請）　Thank you.／Thanks.（謝謝）\n' +
            'You are welcome.（不客氣）　Sorry.／Excuse me.（對不起／不好意思）\n' +
            '⚠ Excuse me 用在「打擾別人、想借過或提問」之前；\n' +
            'Sorry 用在「做錯事道歉」。',
      viz: { type: 'compareexp',
             factor: '兩種抱歉的用法',
             a: { label: 'Excuse me', note: '想引起注意、借過或提問之前' },
             b: { label: 'Sorry', note: '做錯事或造成困擾時道歉' },
             same: ['都是禮貌用語'] },
      check: {
        q: '想在路上向陌生人問路，開口前應該先說什麼？',
        options: [
          'Excuse me.',
          'Sorry.',
          'Goodbye.',
          'You are welcome.'
        ],
        answer: 0,
        why: [
          null,
          'Sorry 用於做錯事時道歉。',
          '這是道別時說的話，不適合用在開場。',
          '這是回應別人道謝時說的。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三上|第6單元 教室與學校用語'] = {
  intro: '把教室裡每天會用到的英文學起來，英文就從課本走進了生活。',
  cards: [
    {
      title: '① 教室物品',
      body: 'book（書）、pen（筆）、pencil（鉛筆）、eraser（橡皮擦）、ruler（尺）、\n' +
            'bag（書包）、desk（書桌）、chair（椅子）、blackboard（黑板）。\n' +
            '⚠ 記單字時可以「摸得到就唸得出」：指著實物練習最有效。',
      viz: { type: 'classify', groups: [
        { label: '文具', items: ['pen', 'pencil', 'eraser', 'ruler'] },
        { label: '教室設備', items: ['desk', 'chair', 'blackboard', 'door'] }] },
      check: {
        q: '「橡皮擦」的英文是什麼？',
        options: ['eraser', 'ruler', 'pencil', 'desk'],
        answer: 0,
        why: [
          null,
          'ruler 是尺。',
          'pencil 是鉛筆。',
          'desk 是書桌。'
        ]
      }
    },
    {
      title: '② 老師常說的話',
      body: 'Stand up.（起立）　Sit down.（坐下）　Open your book.（打開課本）\n' +
            'Listen carefully.（仔細聽）　Look at the blackboard.（看黑板）\n' +
            '⚠ 這些都是「祈使句」：直接用動詞開頭，主詞 you 被省略了。',
      viz: { type: 'sentence', label: '祈使句', items: [
        { t: '(You)', r: '主詞省略' }, { t: 'Open', r: '動詞' }, { t: 'your book', r: '受詞' }],
        note: '祈使句用來要求或指示，主詞 you 通常省略不說。' },
      check: {
        q: '為什麼 Open your book. 這句話看不到主詞？',
        options: [
          '因為這是祈使句，主詞 you 被省略了',
          '因為忘記寫',
          '因為英文不需要主詞',
          '因為 Open 就是主詞'
        ],
        answer: 0,
        why: [
          null,
          '省略是文法規則而非疏忽。',
          '英文句子多半需要主詞，祈使句是特例。',
          'Open 是動詞。'
        ]
      }
    },
    {
      title: '③ 學生常用的話',
      body: 'May I come in?（我可以進來嗎？）\n' +
            'May I go to the restroom?（我可以去洗手間嗎？）\n' +
            'I do not understand.（我不懂。）　Can you say it again?（可以再說一次嗎？）\n' +
            '⚠ 用 May I…? 比直接說 I want… 更有禮貌。',
      viz: { type: 'sentence', label: '請求許可', items: [
        { t: 'May', r: '助動詞' }, { t: 'I', r: '主詞' }, { t: 'come in', r: '動詞片語' }],
        note: '助動詞 May 放在句首，形成有禮貌的請求。' },
      check: {
        q: '上課遲到想進教室時，最有禮貌的說法是什麼？',
        options: [
          'May I come in?',
          'I come in.',
          'Come in!',
          'You come in.'
        ],
        answer: 0,
        why: [
          null,
          '這是陳述句，聽起來像在通知而非請求。',
          '這是命令別人進來。',
          '這是要求對方進來，不是請求許可。'
        ]
      }
    },
    {
      title: '④ 學校的地方',
      body: 'classroom（教室）、library（圖書館）、playground（操場）、\n' +
            'office（辦公室）、restroom（洗手間）、music room（音樂教室）。\n' +
            '⚠ 說位置時可以用：in the classroom（在教室裡）、\n' +
            'on the playground（在操場上）。',
      viz: { type: 'classify', groups: [
        { label: '室內', items: ['classroom', 'library', 'office', 'restroom'] },
        { label: '室外', items: ['playground', 'garden'] }] },
      check: {
        q: '「圖書館」的英文是什麼？',
        options: ['library', 'office', 'playground', 'classroom'],
        answer: 0,
        why: [
          null,
          'office 是辦公室。',
          'playground 是操場。',
          'classroom 是教室。'
        ]
      }
    },
    {
      title: '⑤ 學校裡的人',
      body: 'teacher（老師）、student（學生）、classmate（同學）、\n' +
            'principal（校長）、friend（朋友）。\n' +
            '⚠ 稱呼老師用 Mr.（男）、Ms.（女）加姓氏，\n' +
            '例如 Mr. Chen、Ms. Wang，不要直接叫 Teacher。',
      viz: { type: 'sentence', label: '介紹身分', items: [
        { t: 'She', r: '主詞' }, { t: 'is', r: 'be 動詞' }, { t: 'my teacher', r: '說明' }],
        note: '主詞是 She 時，be 動詞用 is。' },
      check: {
        q: '在英語系國家，稱呼一位姓 Wang 的女老師比較恰當的方式是什麼？',
        options: [
          'Ms. Wang',
          'Teacher',
          'Wang',
          'Hey you'
        ],
        answer: 0,
        why: [
          null,
          '英文中不直接用 Teacher 當稱呼。',
          '直呼姓氏不夠禮貌。',
          '這樣的叫法非常不禮貌。'
        ]
      }
    },
    {
      title: '⑥ 課堂上的對話',
      body: '練習組合：\n' +
            'A: Good morning, Ms. Wang.　B: Good morning. Sit down, please.\n' +
            'A: May I ask a question?　B: Sure.\n' +
            '⚠ 把單字放進句子、把句子放進對話，才是真正學會。',
      viz: { type: 'sentence', label: '完整對話', items: [
        { t: 'May', r: '助動詞' }, { t: 'I', r: '主詞' }, { t: 'ask', r: '動詞' },
        { t: 'a question', r: '受詞' }],
        note: '請求許可的句型：May I ＋ 動詞 ＋ 受詞。' },
      check: {
        q: '學英文時，為什麼「把單字放進句子練習」比只背單字有效？',
        options: [
          '因為知道怎麼用，才能在真實情境中說出口',
          '因為句子比較短',
          '因為單字不重要',
          '因為老師規定要這樣'
        ],
        answer: 0,
        why: [
          null,
          '句子其實比單字長。',
          '單字仍然是基礎，只是需要用出來。',
          '這是學習效果的問題，不是規定。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三上|第7單元 顏色與形狀'] = {
  intro: '顏色和形狀是最容易「看得見」的英文——指著東西就能練習。',
  cards: [
    {
      title: '① 基本顏色',
      body: 'red（紅）、blue（藍）、yellow（黃）、green（綠）、black（黑）、\n' +
            'white（白）、orange（橘）、purple（紫）、pink（粉紅）、brown（棕）。\n' +
            '⚠ orange 同時是「橘色」與「柳橙」，要看句子判斷。',
      viz: { type: 'classify', groups: [
        { label: '三原色（光）', items: ['red', 'green', 'blue'] },
        { label: '其他常見', items: ['yellow', 'black', 'white', 'pink', 'brown'] }] },
      check: {
        q: 'orange 這個字有哪兩種意思？',
        options: [
          '橘色與柳橙',
          '紅色與蘋果',
          '黃色與香蕉',
          '只有一種意思'
        ],
        answer: 0,
        why: [
          null,
          '紅色是 red，蘋果是 apple。',
          '黃色是 yellow，香蕉是 banana。',
          '這個字同時是顏色與水果。'
        ]
      }
    },
    {
      title: '② 問顏色的句型',
      body: 'What color is it?（它是什麼顏色？）→ It is red.（它是紅色的。）\n' +
            'What color are they?（它們是什麼顏色？）→ They are blue.\n' +
            '⚠ 單數用 is、複數用 are，回答時也要一致。',
      viz: { type: 'sentence', label: '問句', items: [
        { t: 'What color', r: '疑問詞' }, { t: 'is', r: 'be 動詞' }, { t: 'it', r: '主詞' }],
        note: '疑問詞放句首，be 動詞移到主詞前面。',
        alt: [
          { label: '回答', items: [{ t: 'It', r: '主詞' }, { t: 'is', r: 'be 動詞' },
            { t: 'red', r: '形容詞' }], note: '回答時用主詞加 be 動詞加顏色。' }] },
      check: {
        q: '要問「它們是什麼顏色？」應該怎麼說？',
        options: [
          'What color are they?',
          'What color is they?',
          'What color they are?',
          'They what color?'
        ],
        answer: 0,
        why: [
          null,
          '主詞 they 是複數，要用 are。',
          '疑問句要把 be 動詞放到主詞前面。',
          '這個語序不符合英文的疑問句結構。'
        ]
      }
    },
    {
      title: '③ 用顏色形容東西',
      body: '形容詞放在名詞「前面」：a red apple（一顆紅蘋果）、\n' +
            'the blue bag（那個藍色書包）。\n' +
            '⚠ 這和中文順序相同，但和西班牙語等語言不同。\n' +
            '也可以說：The apple is red.（那顆蘋果是紅色的。）',
      viz: { type: 'sentence', label: '形容詞在前', items: [
        { t: 'a', r: '冠詞' }, { t: 'red', r: '形容詞' }, { t: 'apple', r: '名詞' }],
        note: '英文的形容詞放在名詞前面。',
        alt: [
          { label: '用 be 動詞', items: [{ t: 'The apple', r: '主詞' }, { t: 'is', r: 'be 動詞' },
            { t: 'red', r: '形容詞' }], note: '也可以把形容詞放在 be 動詞後面。' }] },
      check: {
        q: '「一個綠色的書包」的英文順序應該是什麼？',
        options: [
          'a green bag',
          'a bag green',
          'green a bag',
          'bag a green'
        ],
        answer: 0,
        why: [
          null,
          '形容詞要放在名詞前面。',
          '冠詞 a 要放在最前面。',
          '這個語序不符合英文結構。'
        ]
      }
    },
    {
      title: '④ 基本形狀',
      body: 'circle（圓形）、square（正方形）、triangle（三角形）、\n' +
            'rectangle（長方形）、star（星形）、heart（心形）。\n' +
            '⚠ 形容詞形式：round（圓的）、square 也可以當形容詞。',
      viz: { type: 'classify', groups: [
        { label: '直線邊', items: ['square', 'triangle', 'rectangle'] },
        { label: '曲線', items: ['circle', 'oval'] }] },
      check: {
        q: '「三角形」的英文是什麼？',
        options: ['triangle', 'circle', 'square', 'star'],
        answer: 0,
        why: [
          null,
          'circle 是圓形。',
          'square 是正方形。',
          'star 是星形。'
        ]
      }
    },
    {
      title: '⑤ 結合顏色與形狀',
      body: '兩個形容詞一起用時，順序通常是「大小 → 形狀 → 顏色 → 名詞」：\n' +
            'a big round red ball（一顆大的圓形紅球）。\n' +
            '⚠ 這個順序不用死背，多接觸就會有語感；\n' +
            '初學時一次用一個形容詞就好。',
      viz: { type: 'sentence', label: '多個形容詞', items: [
        { t: 'a', r: '冠詞' }, { t: 'big', r: '大小' }, { t: 'red', r: '顏色' },
        { t: 'ball', r: '名詞' }],
        note: '形容詞依「大小、形狀、顏色」的順序排在名詞前面。' },
      check: {
        q: '英文中多個形容詞並列時，通常的順序是什麼？',
        options: [
          '大小 → 形狀 → 顏色 → 名詞',
          '顏色 → 大小 → 名詞 → 形狀',
          '名詞 → 顏色 → 大小',
          '沒有任何順序'
        ],
        answer: 0,
        why: [
          null,
          '名詞要放在最後面。',
          '名詞不會放在形容詞前面。',
          '英文的形容詞順序有慣例。'
        ]
      }
    },
    {
      title: '⑥ 用在生活中',
      body: '練習方式：看著身邊的東西造句。\n' +
            'My bag is blue.（我的書包是藍色的。）\n' +
            'I have a yellow pencil.（我有一支黃色鉛筆。）\n' +
            '⚠ 每天說三句，比週末背三十個單字更有效。',
      viz: { type: 'sentence', label: '造句練習', items: [
        { t: 'I', r: '主詞' }, { t: 'have', r: '動詞' }, { t: 'a yellow pencil', r: '受詞' }],
        note: '主詞＋動詞＋受詞是英文最基本的句型。' },
      check: {
        q: '要說「我有一支紅筆」，正確的英文是什麼？',
        options: [
          'I have a red pen.',
          'I have a pen red.',
          'Have I a red pen.',
          'A red pen I have.'
        ],
        answer: 0,
        why: [
          null,
          '形容詞要放在名詞前面。',
          '這個語序像疑問句，不是陳述句。',
          '雖然可以理解，但不是自然的語序。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三上|第8單元 數字 1–30 與年齡'] = {
  intro: '數字是最實用的英文之一：報年齡、說時間、買東西都用得到。',
  cards: [
    {
      title: '① 1 到 12',
      body: 'one、two、three、four、five、six、seven、eight、nine、ten、eleven、twelve。\n' +
            '⚠ 11 和 12（eleven、twelve）是特別的字，不遵守後面的規則，要單獨記。',
      viz: { type: 'classify', groups: [
        { label: '1-5', items: ['one', 'two', 'three', 'four', 'five'] },
        { label: '6-10', items: ['six', 'seven', 'eight', 'nine', 'ten'] },
        { label: '特別的', items: ['eleven', 'twelve'] }] },
      check: {
        q: '數字 11 和 12 的英文有什麼特別之處？',
        options: [
          '它們是獨立的字，不像 13 之後有規則',
          '它們的拼法和 1、2 完全相同',
          '它們不能單獨使用',
          '它們沒有英文說法'
        ],
        answer: 0,
        why: [
          null,
          'eleven 與 one 的拼法完全不同。',
          '這兩個字可以單獨使用。',
          '它們都有標準的英文說法。'
        ]
      }
    },
    {
      title: '② 13 到 19',
      body: 'thirteen、fourteen、fifteen、sixteen、seventeen、eighteen、nineteen。\n' +
            '⚠ 規則：個位數 ＋ teen。\n' +
            '注意例外拼法：thirteen（不是 threeteen）、fifteen（不是 fiveteen）。',
      viz: { type: 'classify', groups: [
        { label: '規則的', items: ['fourteen', 'sixteen', 'seventeen', 'nineteen'] },
        { label: '要注意拼法', items: ['thirteen', 'fifteen', 'eighteen'] }] },
      check: {
        q: '數字 15 的英文怎麼拼？',
        options: ['fifteen', 'fiveteen', 'fivteen', 'fifthteen'],
        answer: 0,
        why: [
          null,
          '不是直接把 five 加上 teen。',
          '這個拼法不正確。',
          'fifth 是序數第五，不是基數。'
        ]
      }
    },
    {
      title: '③ 20 到 30',
      body: 'twenty、twenty-one、twenty-two、…、twenty-nine、thirty。\n' +
            '⚠ 21 到 29 的寫法：twenty 加連字號再加個位數（twenty-one）。\n' +
            '注意 twenty 與 thirty 的拼法（不是 twoty、threety）。',
      viz: { type: 'classify', groups: [
        { label: '整十', items: ['twenty', 'thirty'] },
        { label: '組合', items: ['twenty-one', 'twenty-five', 'twenty-nine'] }] },
      check: {
        q: '數字 24 的正確寫法是什麼？',
        options: ['twenty-four', 'twentyfour', 'twenty four hundred', 'two four'],
        answer: 0,
        why: [
          null,
          '中間要有連字號。',
          '這樣寫變成很大的數字。',
          '這是把兩個數字分開唸，不是二十四。'
        ]
      }
    },
    {
      title: '④ 問年齡',
      body: 'How old are you?（你幾歲？）→ I am nine (years old).（我九歲。）\n' +
            'How old is he?（他幾歲？）→ He is ten.\n' +
            '⚠ 英文說年齡用 be 動詞（I am nine），不是用 have，\n' +
            '這和中文的「我有九歲」不同——中文其實也說「我九歲」。',
      viz: { type: 'sentence', label: '問年齡', items: [
        { t: 'How old', r: '疑問詞組' }, { t: 'are', r: 'be 動詞' }, { t: 'you', r: '主詞' }],
        note: 'How old 意思是「多老」，用來問年齡。',
        alt: [
          { label: '回答', items: [{ t: 'I', r: '主詞' }, { t: 'am', r: 'be 動詞' },
            { t: 'nine', r: '數字' }], note: '英文用 be 動詞表達年齡。' }] },
      check: {
        q: '「我十歲」的正確英文是什麼？',
        options: [
          'I am ten years old.',
          'I have ten years old.',
          'My age ten.',
          'I ten years.'
        ],
        answer: 0,
        why: [
          null,
          '英文年齡用 be 動詞而不是 have。',
          '這個句子缺少動詞。',
          '這個句子同樣缺少動詞。'
        ]
      }
    },
    {
      title: '⑤ 數量的表達',
      body: 'How many books do you have?（你有幾本書？）→ I have five books.\n' +
            '⚠ How many 後面接「可數名詞的複數」；\n' +
            '回答時名詞也要用複數（five books 而不是 five book）。',
      viz: { type: 'sentence', label: '問數量', items: [
        { t: 'How many', r: '疑問詞組' }, { t: 'books', r: '複數名詞' },
        { t: 'do you have', r: '助動詞＋主詞＋動詞' }],
        note: 'How many 後面一定接可數名詞的複數形。' },
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'I have five books.',
          'I have five book.',
          'I have a five books.',
          'I have books five.'
        ],
        answer: 0,
        why: [
          null,
          '數字大於一時名詞要用複數。',
          '有數字時不再加冠詞 a。',
          '數字要放在名詞前面。'
        ]
      }
    },
    {
      title: '⑥ 數字在生活中',
      body: '電話號碼：一個數字一個數字唸。\n' +
            '門牌與樓層：I live on the third floor.（我住三樓。）\n' +
            '⚠ 樓層要用「序數」（first、second、third），不是基數。\n' +
            '這部分之後的單元會詳細學。',
      viz: { type: 'compareexp',
             factor: '兩種數字',
             a: { label: '基數', note: 'one、two、three，用來數數量' },
             b: { label: '序數', note: 'first、second、third，用來表示順序' },
             same: ['都是數字的表達方式'] },
      check: {
        q: '要說「第三層樓」，應該使用哪一種數字？',
        options: [
          '序數 third',
          '基數 three',
          '兩者皆可',
          '不需要數字'
        ],
        answer: 0,
        why: [
          null,
          '基數用來表示數量而非順序。',
          '表示順序時要用序數。',
          '樓層一定要有數字。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三上|第9單元 我的家庭'] = {
  intro: '介紹家人是最常見的英文話題之一——也是練習 be 動詞的好機會。',
  cards: [
    {
      title: '① 家庭成員',
      body: 'father／dad（爸爸）、mother／mom（媽媽）、brother（兄弟）、sister（姊妹）、\n' +
            'grandfather／grandpa（爺爺、外公）、grandmother／grandma（奶奶、外婆）。\n' +
            '⚠ 英文的 brother 不分哥哥與弟弟，需要時才加 older／younger。',
      viz: { type: 'classify', groups: [
        { label: '父母', items: ['father', 'mother'] },
        { label: '兄弟姊妹', items: ['brother', 'sister'] },
        { label: '祖父母', items: ['grandfather', 'grandmother'] }] },
      check: {
        q: '英文的 brother 和中文的「哥哥、弟弟」有什麼不同？',
        options: [
          '英文的 brother 不分年紀，需要時才加 older 或 younger',
          '英文只指哥哥',
          '英文只指弟弟',
          '兩者完全相同'
        ],
        answer: 0,
        why: [
          null,
          'brother 可以指哥哥也可以指弟弟。',
          '它同樣可以指哥哥。',
          '中文有明確的長幼區分，英文沒有。'
        ]
      }
    },
    {
      title: '② 介紹家人',
      body: 'This is my father.（這是我爸爸。）\n' +
            'He is a teacher.（他是老師。）　She is my sister.（她是我姊姊。）\n' +
            '⚠ 男生用 he、女生用 she；不確定或指物品時用 it。',
      viz: { type: 'sentence', label: '介紹', items: [
        { t: 'This', r: '這位' }, { t: 'is', r: 'be 動詞' }, { t: 'my father', r: '說明' }],
        note: '介紹在場的人用 This is。',
        alt: [
          { label: '說明職業', items: [{ t: 'He', r: '主詞' }, { t: 'is', r: 'be 動詞' },
            { t: 'a teacher', r: '職業' }], note: '職業前面要加冠詞 a 或 an。' }] },
      check: {
        q: '「她是我的媽媽」的正確說法是什麼？',
        options: [
          'She is my mother.',
          'He is my mother.',
          'It is my mother.',
          'She are my mother.'
        ],
        answer: 0,
        why: [
          null,
          '媽媽是女性，要用 she。',
          'it 用於物品或動物，不用於人。',
          '主詞 she 要搭配 is。'
        ]
      }
    },
    {
      title: '③ 所有格 my、your、his、her',
      body: 'my（我的）、your（你的）、his（他的）、her（她的）、\n' +
            'our（我們的）、their（他們的）。\n' +
            '⚠ 所有格後面一定要接名詞：my book（我的書）、\n' +
            '不能單獨說 my。',
      viz: { type: 'sentence', label: '所有格', items: [
        { t: 'This', r: '主詞' }, { t: 'is', r: 'be 動詞' }, { t: 'my', r: '所有格' },
        { t: 'sister', r: '名詞' }],
        note: '所有格後面一定要接名詞。' },
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'This is her bag.',
          'This is she bag.',
          'This is her.',
          'This bag is she.'
        ],
        answer: 0,
        why: [
          null,
          '要用所有格 her 而不是主格 she。',
          '這句話文法沒錯，但沒有說明是什麼東西。',
          '主詞與補語的搭配不正確。'
        ]
      }
    },
    {
      title: '④ 家庭人數',
      body: 'How many people are there in your family?（你家有幾個人？）\n' +
            '→ There are four people in my family.（我家有四個人。）\n' +
            '⚠ people 是 person 的複數，不加 s。',
      viz: { type: 'sentence', label: '有幾個人', items: [
        { t: 'There are', r: '有' }, { t: 'four', r: '數量' }, { t: 'people', r: '複數名詞' }],
        note: 'There are 用來表示「有…」，後面接複數名詞。' },
      check: {
        q: 'person 的複數形是什麼？',
        options: ['people', 'persons only', 'personses', 'peoples'],
        answer: 0,
        why: [
          null,
          '日常用法中複數幾乎都用 people。',
          '這不是正確的拼法。',
          'peoples 指的是「多個民族」，意思不同。'
        ]
      }
    },
    {
      title: '⑤ 描述家人',
      body: 'My father is tall.（我爸爸很高。）\n' +
            'My sister is five years old.（我妹妹五歲。）\n' +
            'My mother is a nurse.（我媽媽是護理師。）\n' +
            '⚠ 主詞是第三人稱單數時，be 動詞用 is。',
      viz: { type: 'tense', verb: 'play', highlight: '現在簡單式' },
      tip: '這個元件可以看動詞在不同時態的變化。',
      check: {
        q: '「我的哥哥很高」的正確英文是什麼？',
        options: [
          'My brother is tall.',
          'My brother are tall.',
          'My brother am tall.',
          'My brother tall.'
        ],
        answer: 0,
        why: [
          null,
          '主詞是單數，要用 is。',
          'am 只能配主詞 I。',
          '句子缺少 be 動詞，文法不完整。'
        ]
      }
    },
    {
      title: '⑥ 完整的自我介紹',
      body: '把學過的組合起來：\n' +
            'Hello! My name is Amy. I am nine years old.\n' +
            'There are four people in my family: my father, my mother, my brother, and me.\n' +
            '⚠ 列舉時最後一項前面加 and，項目之間用逗號分隔。',
      viz: { type: 'sentence', label: '自我介紹', items: [
        { t: 'My name', r: '主詞' }, { t: 'is', r: 'be 動詞' }, { t: 'Amy', r: '名字' }],
        note: '先說名字，再說年齡與家庭，是常見的自我介紹順序。',
        alt: [
          { label: '說年齡', items: [{ t: 'I', r: '主詞' }, { t: 'am', r: 'be 動詞' },
            { t: 'nine years old', r: '年齡' }], note: '年齡用 be 動詞表達。' }] },
      check: {
        q: '英文列舉多個項目時，最後一項前面通常會加什麼？',
        options: ['and', 'or only', 'but', '不用加任何字'],
        answer: 0,
        why: [
          null,
          'or 用在選擇的情況。',
          'but 表示轉折，用法不同。',
          '不加連接詞會顯得不完整。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第1單元 一般動詞現在式'] = {
  intro: 'be 動詞說「是什麼」，一般動詞說「做什麼」——這是英文句子的兩大類型。',
  cards: [
    {
      title: '① 什麼是一般動詞',
      body: '表示動作或行為的動詞：go（去）、eat（吃）、play（玩）、like（喜歡）、\n' +
            'have（有）、study（讀書）、run（跑）。\n' +
            '⚠ 一個句子裡通常只有一個主要動詞：\n' +
            '不能說 I am like it，要說 I like it。',
      viz: { type: 'sentence', label: '一般動詞句', items: [
        { t: 'I', r: '主詞' }, { t: 'like', r: '一般動詞' }, { t: 'apples', r: '受詞' }],
        note: '主詞＋一般動詞＋受詞，是最基本的句型。',
        alt: [
          { label: 'be 動詞句', items: [{ t: 'I', r: '主詞' }, { t: 'am', r: 'be 動詞' },
            { t: 'happy', r: '形容詞' }], note: 'be 動詞句用來說明「是什麼、怎麼樣」。' }] },
      tip: '按按鈕比較兩種句型。',
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'I like apples.',
          'I am like apples.',
          'I am likes apples.',
          'I like am apples.'
        ],
        answer: 0,
        why: [
          null,
          '一個句子不能同時有 be 動詞與一般動詞當主要動詞。',
          '這句同時犯了兩個錯誤。',
          '語序不正確，動詞不能放在受詞後面。'
        ]
      }
    },
    {
      title: '② 現在式的用法',
      body: '現在簡單式用來表達：\n' +
            '① 習慣（I go to school every day.）\n' +
            '② 事實或狀態（I like music.）\n' +
            '③ 不變的道理（The sun rises in the east.）\n' +
            '⚠ 它不是「現在正在做」——那是現在進行式。',
      viz: { type: 'tense', verb: 'go', highlight: '現在簡單式' },
      tip: '按按鈕比較不同時態。',
      check: {
        q: '「我每天上學」應該用哪一種時態？',
        options: [
          '現在簡單式，因為這是習慣',
          '現在進行式，因為是現在',
          '過去式',
          '未來式'
        ],
        answer: 0,
        why: [
          null,
          '進行式表示「此刻正在做」。',
          '過去式表示已經結束的事。',
          '未來式表示還沒發生的事。'
        ]
      }
    },
    {
      title: '③ 否定句',
      body: '一般動詞的否定要用助動詞 do／does 加 not：\n' +
            'I do not like it.（＝ I don’t like it.）\n' +
            'He does not like it.（＝ He doesn’t like it.）\n' +
            '⚠ 用了 does 之後，後面的動詞要回到「原形」：\n' +
            '不能說 He doesn’t likes。',
      viz: { type: 'sentence', label: '否定句', items: [
        { t: 'I', r: '主詞' }, { t: 'do not', r: '助動詞＋not' }, { t: 'like', r: '原形動詞' },
        { t: 'it', r: '受詞' }],
        note: '否定時要借助 do 或 does，動詞回到原形。' },
      check: {
        q: '「他不喜歡貓」的正確說法是什麼？',
        options: [
          'He does not like cats.',
          'He do not like cats.',
          'He does not likes cats.',
          'He not like cats.'
        ],
        answer: 0,
        why: [
          null,
          '主詞是第三人稱單數，要用 does。',
          '用了 does 之後動詞要回到原形。',
          '否定句需要助動詞。'
        ]
      }
    },
    {
      title: '④ 疑問句',
      body: 'Do you like it?（你喜歡嗎？）→ Yes, I do.／No, I don’t.\n' +
            'Does he like it?（他喜歡嗎？）→ Yes, he does.／No, he doesn’t.\n' +
            '⚠ 疑問句同樣把 do／does 放到句首，動詞用原形。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Do', r: '助動詞' }, { t: 'you', r: '主詞' }, { t: 'like', r: '原形動詞' },
        { t: 'it', r: '受詞' }],
        note: '把助動詞移到句首就成為疑問句。',
        alt: [
          { label: '第三人稱', items: [{ t: 'Does', r: '助動詞' }, { t: 'he', r: '主詞' },
            { t: 'like', r: '原形動詞' }, { t: 'it', r: '受詞' }],
            note: '主詞是他或她時要用 Does，動詞仍用原形。' }] },
      check: {
        q: '「她喜歡音樂嗎？」的正確問法是什麼？',
        options: [
          'Does she like music?',
          'Do she like music?',
          'Does she likes music?',
          'She likes music?'
        ],
        answer: 0,
        why: [
          null,
          '主詞是第三人稱單數，要用 Does。',
          '用了 Does 之後動詞要用原形。',
          '這是把陳述句加上問號，不是標準的疑問句。'
        ]
      }
    },
    {
      title: '⑤ 常見的頻率說法',
      body: 'every day（每天）、every morning（每天早上）、\n' +
            'on Sundays（每個星期天）、after school（放學後）。\n' +
            '⚠ 這些時間詞常放在句尾：I play basketball after school.\n' +
            '它們也是判斷「要用現在簡單式」的線索。',
      viz: { type: 'sentence', label: '加上時間', items: [
        { t: 'I', r: '主詞' }, { t: 'play', r: '動詞' }, { t: 'basketball', r: '受詞' },
        { t: 'after school', r: '時間' }],
        note: '時間片語通常放在句尾。' },
      check: {
        q: '看到句子裡有 every day，通常表示要用什麼時態？',
        options: [
          '現在簡單式，因為表達的是習慣',
          '過去式',
          '未來式',
          '現在進行式'
        ],
        answer: 0,
        why: [
          null,
          '過去式搭配的是過去的時間詞。',
          '未來式搭配的是未來的時間詞。',
          '進行式描述此刻正在發生的事。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: '肯定：I eat breakfast every morning.\n' +
            '否定：I do not eat breakfast on Sundays.\n' +
            '疑問：Do you eat breakfast every day?\n' +
            '⚠ 三種句型的動詞都用原形（第三人稱單數的肯定句除外，下一單元會學）。',
      viz: { type: 'sentence', label: '肯定', items: [
        { t: 'I', r: '主詞' }, { t: 'eat', r: '動詞' }, { t: 'breakfast', r: '受詞' }],
        note: '肯定句直接用動詞。',
        alt: [
          { label: '否定', items: [{ t: 'I', r: '主詞' }, { t: 'do not', r: '助動詞' },
            { t: 'eat', r: '原形' }, { t: 'breakfast', r: '受詞' }], note: '否定要加 do not。' },
          { label: '疑問', items: [{ t: 'Do', r: '助動詞' }, { t: 'you', r: '主詞' },
            { t: 'eat', r: '原形' }, { t: 'breakfast', r: '受詞' }], note: '疑問把 Do 移到句首。' }] },
      check: {
        q: '一般動詞的否定句與疑問句，共同需要什麼？',
        options: [
          '助動詞 do 或 does，且主要動詞用原形',
          'be 動詞',
          '不需要任何額外的字',
          '要把動詞加 s'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞用於另一類句型。',
          '一般動詞的否定與疑問一定需要助動詞。',
          '加 s 是第三人稱單數肯定句的規則。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第2單元 第三人稱單數 -s'] = {
  intro: '英文有一個很麻煩但很重要的規則：主詞是「他、她、它」時，動詞要加 s。',
  cards: [
    {
      title: '① 什麼是第三人稱單數',
      body: '第一人稱：I、we。第二人稱：you。第三人稱：he、she、it、they。\n' +
            '⚠ 其中「第三人稱＋單數」（he、she、it，以及單數的人名或名詞）\n' +
            '在現在簡單式的肯定句中，動詞要加 s。',
      viz: { type: 'classify', groups: [
        { label: '動詞加 s', items: ['he', 'she', 'it', 'Amy', 'my brother'] },
        { label: '動詞不加 s', items: ['I', 'you', 'we', 'they', 'my friends'] }] },
      tip: '看清楚主詞屬於哪一組。',
      check: {
        q: '下列哪一個主詞後面的動詞要加 s？',
        options: ['my sister', 'I', 'they', 'we'],
        answer: 0,
        why: [
          null,
          '主詞 I 的動詞不加 s。',
          'they 是複數，動詞不加 s。',
          'we 是複數，動詞不加 s。'
        ]
      }
    },
    {
      title: '② 加 s 的規則',
      body: '一般直接加 s：play → plays、like → likes、eat → eats。\n' +
            '字尾是 s、x、sh、ch、o 時加 es：go → goes、watch → watches、\n' +
            'wash → washes、fix → fixes。\n' +
            '⚠ 子音＋y 結尾：去 y 加 ies（study → studies、fly → flies）。',
      viz: { type: 'classify', groups: [
        { label: '直接加 s', items: ['plays', 'likes', 'eats', 'runs'] },
        { label: '加 es', items: ['goes', 'watches', 'washes', 'fixes'] },
        { label: '去 y 加 ies', items: ['studies', 'flies', 'cries'] }] },
      check: {
        q: 'study 的第三人稱單數形是什麼？',
        options: ['studies', 'studys', 'studyes', 'study'],
        answer: 0,
        why: [
          null,
          '子音加 y 結尾要去 y 加 ies。',
          '這個拼法不正確。',
          '第三人稱單數必須變化。'
        ]
      }
    },
    {
      title: '③ 特別的 have',
      body: 'have 的第三人稱單數是 has（不是 haves）。\n' +
            'I have a dog. → He has a dog.\n' +
            '⚠ 這是最常用也最常錯的動詞之一，要特別記住。',
      viz: { type: 'sentence', label: '第一人稱', items: [
        { t: 'I', r: '主詞' }, { t: 'have', r: '動詞原形' }, { t: 'a dog', r: '受詞' }],
        note: '主詞是 I 時用 have。',
        alt: [
          { label: '第三人稱', items: [{ t: 'He', r: '主詞' }, { t: 'has', r: '動詞變化' },
            { t: 'a dog', r: '受詞' }], note: 'have 的第三人稱單數形是 has。' }] },
      check: {
        q: '「她有一隻貓」的正確說法是什麼？',
        options: [
          'She has a cat.',
          'She have a cat.',
          'She haves a cat.',
          'She is have a cat.'
        ],
        answer: 0,
        why: [
          null,
          '第三人稱單數要用 has。',
          'have 的變化是 has 而非 haves。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '④ 否定與疑問時不加 s',
      body: '否定：He does not like it.（不是 doesn’t likes）\n' +
            '疑問：Does he like it?（不是 Does he likes）\n' +
            '⚠ 因為 s 已經「跑到」does 上面了，動詞就回到原形。\n' +
            '這是最常見的錯誤之一。',
      viz: { type: 'sentence', label: '肯定', items: [
        { t: 'He', r: '主詞' }, { t: 'likes', r: '加 s' }, { t: 'cats', r: '受詞' }],
        note: '肯定句的動詞要加 s。',
        alt: [
          { label: '否定', items: [{ t: 'He', r: '主詞' }, { t: 'does not', r: '助動詞帶 s' },
            { t: 'like', r: '原形' }, { t: 'cats', r: '受詞' }],
            note: 's 跑到 does 上面，動詞回到原形。' },
          { label: '疑問', items: [{ t: 'Does', r: '助動詞帶 s' }, { t: 'he', r: '主詞' },
            { t: 'like', r: '原形' }, { t: 'cats', r: '受詞' }],
            note: '疑問句同樣是動詞用原形。' }] },
      check: {
        q: '下列哪一句是正確的？',
        options: [
          'Does she play the piano?',
          'Does she plays the piano?',
          'Do she plays the piano?',
          'She does plays the piano?'
        ],
        answer: 0,
        why: [
          null,
          '用了 Does 之後動詞要用原形。',
          '主詞是第三人稱單數，要用 Does。',
          '這個語序與動詞形式都不正確。'
        ]
      }
    },
    {
      title: '⑤ 常見錯誤整理',
      body: '① He like it.（少了 s）→ He likes it.\n' +
            '② He doesn’t likes it.（多了 s）→ He doesn’t like it.\n' +
            '③ They likes it.（複數不該加 s）→ They like it.\n' +
            '⚠ 檢查三步驟：主詞是不是第三人稱單數？是不是肯定句？時態是不是現在式？',
      viz: { type: 'energyflow', steps: ['看主詞', '是第三人稱單數嗎', '是肯定句嗎', '才加 s'] },
      check: {
        q: '要判斷動詞要不要加 s，需要同時確認哪些條件？',
        options: [
          '主詞是第三人稱單數、句子是肯定句、時態是現在簡單式',
          '只要看主詞就好',
          '只要是現在式都要加',
          '任何句子都要加'
        ],
        answer: 0,
        why: [
          null,
          '否定與疑問句即使主詞相同也不加 s。',
          '否定與疑問句不加 s。',
          '複數主詞的動詞不加 s。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'My sister likes music.（我姊姊喜歡音樂。）\n' +
            'My parents like music.（我父母喜歡音樂。）\n' +
            'Does your sister like music?（你姊姊喜歡音樂嗎？）\n' +
            '⚠ 同一個動詞在不同句子裡形式不同，關鍵永遠在「主詞」與「句型」。',
      viz: { type: 'tense', verb: 'play', highlight: '現在簡單式' },
      tip: '按按鈕比較不同時態的動詞形式。',
      check: {
        q: '「我的父母喜歡音樂」為什麼用 like 而不是 likes？',
        options: [
          '因為 parents 是複數主詞',
          '因為這是否定句',
          '因為這是疑問句',
          '因為 like 沒有變化形'
        ],
        answer: 0,
        why: [
          null,
          '這是肯定句，不是否定句。',
          '這是陳述句而不是疑問句。',
          'like 的第三人稱單數形是 likes。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第3單元 頻率副詞與作息'] = {
  intro: '「總是、常常、有時、從不」——這些字讓你能說清楚一件事發生的頻率。',
  cards: [
    {
      title: '① 常見的頻率副詞',
      body: 'always（總是，100%）、usually（通常，約 80%）、often（常常，約 60%）、\n' +
            'sometimes（有時，約 40%）、seldom（很少）、never（從不，0%）。\n' +
            '⚠ never 本身已經是否定，不能再加 not。',
      viz: { type: 'classify', groups: [
        { label: '頻率高', items: ['always', 'usually', 'often'] },
        { label: '頻率低', items: ['sometimes', 'seldom', 'never'] }] },
      check: {
        q: '下列哪一個頻率副詞表示「從不」？',
        options: ['never', 'always', 'usually', 'often'],
        answer: 0,
        why: [
          null,
          'always 是總是。',
          'usually 是通常。',
          'often 是常常。'
        ]
      }
    },
    {
      title: '② 頻率副詞的位置',
      body: '一般動詞「前面」：I always get up at seven.\n' +
            'be 動詞「後面」：I am always happy.\n' +
            '⚠ 口訣：「一般動詞前、be 動詞後」。\n' +
            'sometimes 比較彈性，也可以放句首或句尾。',
      viz: { type: 'sentence', label: '一般動詞前', items: [
        { t: 'I', r: '主詞' }, { t: 'always', r: '頻率副詞' }, { t: 'get up', r: '一般動詞' },
        { t: 'at seven', r: '時間' }],
        note: '頻率副詞放在一般動詞的前面。',
        alt: [
          { label: 'be 動詞後', items: [{ t: 'I', r: '主詞' }, { t: 'am', r: 'be 動詞' },
            { t: 'always', r: '頻率副詞' }, { t: 'happy', r: '形容詞' }],
            note: '遇到 be 動詞時，頻率副詞放在後面。' }] },
      check: {
        q: '「他總是很忙」的正確說法是什麼？',
        options: [
          'He is always busy.',
          'He always is busy.',
          'Always he is busy.',
          'He is busy always.'
        ],
        answer: 0,
        why: [
          null,
          '遇到 be 動詞時副詞要放在後面。',
          '這個語序不自然。',
          '雖然可以理解，但不是標準的位置。'
        ]
      }
    },
    {
      title: '③ 問頻率',
      body: 'How often do you exercise?（你多常運動？）\n' +
            '→ I exercise three times a week.（我一週運動三次。）\n' +
            '⚠ 次數的說法：once（一次）、twice（兩次）、three times（三次），\n' +
            '後面接 a day／a week／a month。',
      viz: { type: 'sentence', label: '問頻率', items: [
        { t: 'How often', r: '疑問詞組' }, { t: 'do you', r: '助動詞＋主詞' },
        { t: 'exercise', r: '動詞' }],
        note: 'How often 用來詢問頻率。',
        alt: [
          { label: '回答', items: [{ t: 'I', r: '主詞' }, { t: 'exercise', r: '動詞' },
            { t: 'three times a week', r: '頻率' }], note: '次數＋a＋時間單位。' }] },
      check: {
        q: '「一週兩次」的正確英文是什麼？',
        options: [
          'twice a week',
          'two times week',
          'two a week',
          'second a week'
        ],
        answer: 0,
        why: [
          null,
          '兩次習慣上說 twice，而且要加 a。',
          '缺少表示次數的字。',
          'second 是序數，不用於次數。'
        ]
      }
    },
    {
      title: '④ 一天的作息',
      body: 'get up（起床）、brush my teeth（刷牙）、wash my face（洗臉）、\n' +
            'have breakfast（吃早餐）、go to school（上學）、\n' +
            'do my homework（寫功課）、go to bed（睡覺）。\n' +
            '⚠ 這些是「動詞片語」，要整組記，不要拆開。',
      viz: { type: 'classify', groups: [
        { label: '早上', items: ['get up', 'wash my face', 'have breakfast'] },
        { label: '白天', items: ['go to school', 'have lunch', 'study'] },
        { label: '晚上', items: ['do my homework', 'take a shower', 'go to bed'] }] },
      check: {
        q: '「去睡覺」的英文片語是什麼？',
        options: ['go to bed', 'go to sleep bed', 'to bed go', 'sleep to bed'],
        answer: 0,
        why: [
          null,
          '這個說法多了不必要的字。',
          '語序不正確，動詞要放在前面。',
          '這不是慣用的說法。'
        ]
      }
    },
    {
      title: '⑤ 說出自己的作息',
      body: 'I get up at six thirty.（我六點半起床。）\n' +
            'I usually have breakfast at seven.（我通常七點吃早餐。）\n' +
            'I never go to bed after eleven.（我從不十一點以後睡覺。）\n' +
            '⚠ 時間前面用介系詞 at：at seven、at six thirty。',
      viz: { type: 'sentence', label: '描述作息', items: [
        { t: 'I', r: '主詞' }, { t: 'usually', r: '頻率' }, { t: 'have breakfast', r: '動詞片語' },
        { t: 'at seven', r: '時間' }],
        note: '頻率副詞在動詞前，時間片語在句尾。' },
      check: {
        q: '表示「在七點」時，應該用哪一個介系詞？',
        options: ['at', 'in', 'on', 'to'],
        answer: 0,
        why: [
          null,
          'in 用於月份、年份或較長的時段。',
          'on 用於星期與日期。',
          'to 用於方向或目標。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: '把頻率、動作與時間組合起來：\n' +
            'I always brush my teeth before I go to bed.\n' +
            'My brother sometimes plays basketball after school.\n' +
            '⚠ 注意主詞是第三人稱單數時，動詞仍然要加 s（plays）。',
      viz: { type: 'sentence', label: '完整句', items: [
        { t: 'My brother', r: '主詞' }, { t: 'sometimes', r: '頻率' },
        { t: 'plays', r: '動詞加 s' }, { t: 'basketball', r: '受詞' }],
        note: '主詞是第三人稱單數時，動詞仍要加 s。' },
      check: {
        q: '「我哥哥常常打籃球」的正確說法是什麼？',
        options: [
          'My brother often plays basketball.',
          'My brother often play basketball.',
          'My brother plays often basketball.',
          'Often my brother play basketball.'
        ],
        answer: 0,
        why: [
          null,
          '主詞是第三人稱單數，動詞要加 s。',
          '頻率副詞應該放在動詞前面。',
          '語序與動詞形式都不正確。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第4單元 時間：幾點鐘'] = {
  intro: '會問時間、會說時間，就能安排一整天的活動。',
  cards: [
    {
      title: '① 問時間',
      body: 'What time is it?／What’s the time?（現在幾點？）\n' +
            '→ It is three o’clock.（三點整。）\n' +
            '⚠ 回答時主詞用 it，這是英文表達時間、天氣的固定用法。',
      viz: { type: 'sentence', label: '問時間', items: [
        { t: 'What time', r: '疑問詞組' }, { t: 'is', r: 'be 動詞' }, { t: 'it', r: '主詞' }],
        note: '時間的主詞用 it，沒有實際意義。',
        alt: [
          { label: '回答', items: [{ t: 'It', r: '主詞' }, { t: 'is', r: 'be 動詞' },
            { t: 'three o’clock', r: '時間' }], note: '整點用 o’clock。' }] },
      check: {
        q: '回答時間時，主詞應該用什麼？',
        options: ['it', 'the time', 'this', 'now'],
        answer: 0,
        why: [
          null,
          '英文習慣用 it 當主詞。',
          'this 通常指具體的事物。',
          'now 是副詞，不能當主詞。'
        ]
      }
    },
    {
      title: '② 整點與半點',
      body: '整點：It is five o’clock.（五點整）\n' +
            '半點：It is half past five.／It is five thirty.（五點半）\n' +
            '⚠ o’clock 只用在「整點」，五點半不能說 five thirty o’clock。',
      viz: { type: 'clock', h: 5, m: 0 },
      tip: '拉動指針看時間怎麼變。',
      check: {
        q: '下列哪一種說法是錯的？',
        options: [
          'five thirty o’clock',
          'five o’clock',
          'five thirty',
          'half past five'
        ],
        answer: 0,
        why: [
          null,
          '整點用 o’clock 是正確的。',
          '直接說數字是常見的說法。',
          'half past 是傳統的說法，也正確。'
        ]
      }
    },
    {
      title: '③ 幾點幾分',
      body: '直接說法：It is seven fifteen.（七點十五分）\n' +
            '傳統說法：a quarter past seven（七點過一刻）、\n' +
            'a quarter to eight（差一刻八點）。\n' +
            '⚠ past 是「過了」、to 是「差幾分到」。',
      viz: { type: 'clock', h: 7, m: 15 },
      check: {
        q: 'a quarter to eight 是幾點？',
        options: [
          '七點四十五分',
          '八點十五分',
          '八點四十五分',
          '七點十五分'
        ],
        answer: 0,
        why: [
          null,
          '這會是 a quarter past eight。',
          '這是八點過四十五分。',
          '這是 a quarter past seven。'
        ]
      }
    },
    {
      title: '④ 上午與下午',
      body: 'in the morning（早上）、in the afternoon（下午）、in the evening（晚上）、\n' +
            'at night（夜裡）。\n' +
            '⚠ 注意介系詞：morning／afternoon／evening 用 in，\n' +
            '但 night 用 at；noon（中午）與 midnight（午夜）也用 at。',
      viz: { type: 'classify', groups: [
        { label: '用 in', items: ['the morning', 'the afternoon', 'the evening'] },
        { label: '用 at', items: ['night', 'noon', 'midnight'] }] },
      check: {
        q: '「在晚上（夜裡）」的正確說法是什麼？',
        options: ['at night', 'in night', 'on night', 'to night'],
        answer: 0,
        why: [
          null,
          'night 前面用 at 而不是 in。',
          'on 用於星期與日期。',
          'to 表示方向或目標。'
        ]
      }
    },
    {
      title: '⑤ 說明作息時間',
      body: 'I get up at six thirty.（我六點半起床。）\n' +
            'School starts at eight.（八點開始上課。）\n' +
            'What time do you go to bed?（你幾點睡覺？）\n' +
            '⚠ 問「幾點做某事」用 What time do you…?',
      viz: { type: 'sentence', label: '問作息', items: [
        { t: 'What time', r: '疑問詞組' }, { t: 'do you', r: '助動詞＋主詞' },
        { t: 'go to bed', r: '動詞片語' }],
        note: '問幾點做某事，用 What time 加助動詞。' },
      check: {
        q: '要問「你幾點吃晚餐？」應該怎麼說？',
        options: [
          'What time do you have dinner?',
          'What time you have dinner?',
          'What time are you have dinner?',
          'When you dinner?'
        ],
        answer: 0,
        why: [
          null,
          '一般動詞的疑問句需要助動詞 do。',
          '不能同時用 be 動詞與一般動詞。',
          '這個句子缺少動詞。'
        ]
      }
    },
    {
      title: '⑥ 時間的綜合應用',
      body: '課表：Math class is at nine.（數學課在九點。）\n' +
            '邀約：Let’s meet at four thirty.（我們四點半見面吧。）\n' +
            '⚠ 時間前面用 at；日期用 on；月份與年份用 in。\n' +
            '這三個介系詞的用法要一起記。',
      viz: { type: 'classify', groups: [
        { label: 'at（時間點）', items: ['at seven', 'at noon', 'at night'] },
        { label: 'on（日期）', items: ['on Monday', 'on May 5'] },
        { label: 'in（較長時段）', items: ['in May', 'in 2026', 'in the morning'] }] },
      check: {
        q: '「在星期一」應該用哪一個介系詞？',
        options: ['on', 'at', 'in', 'to'],
        answer: 0,
        why: [
          null,
          'at 用於具體的時間點。',
          'in 用於月份、年份或較長的時段。',
          'to 表示方向或目標。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第5單元 食物與點餐'] = {
  intro: '會點餐、能說出自己喜歡什麼——這是最快用得上的英文。',
  cards: [
    {
      title: '① 常見食物',
      body: 'rice（飯）、noodles（麵）、bread（麵包）、egg（蛋）、\n' +
            'chicken（雞肉）、beef（牛肉）、fish（魚）、soup（湯）。\n' +
            '⚠ noodles 通常用複數；rice、bread、soup 是不可數名詞，不加 s。',
      viz: { type: 'classify', groups: [
        { label: '可數', items: ['egg', 'apple', 'sandwich', 'cookie'] },
        { label: '不可數', items: ['rice', 'bread', 'soup', 'water'] }] },
      check: {
        q: '下列哪一個字是「不可數名詞」？',
        options: ['rice', 'egg', 'apple', 'cookie'],
        answer: 0,
        why: [
          null,
          'egg 可以數，有複數形 eggs。',
          'apple 可以數。',
          'cookie 也可以數。'
        ]
      }
    },
    {
      title: '② 飲料與水果',
      body: '飲料：water（水）、milk（牛奶）、juice（果汁）、tea（茶）、coffee（咖啡）。\n' +
            '水果：apple、banana、orange、grape、watermelon（西瓜）、strawberry（草莓）。\n' +
            '⚠ 飲料大多是不可數名詞，要說「一杯」時用 a glass of／a cup of。',
      viz: { type: 'classify', groups: [
        { label: '飲料', items: ['water', 'milk', 'juice', 'tea'] },
        { label: '水果', items: ['apple', 'banana', 'grape', 'strawberry'] }] },
      check: {
        q: '「一杯牛奶」的正確說法是什麼？',
        options: [
          'a glass of milk',
          'a milk',
          'one milks',
          'a milk cup'
        ],
        answer: 0,
        why: [
          null,
          '不可數名詞前面不直接加 a。',
          '不可數名詞沒有複數形。',
          '這個說法的語序不自然。'
        ]
      }
    },
    {
      title: '③ 說喜好',
      body: 'I like apples.（我喜歡蘋果。）\n' +
            'I do not like fish.（我不喜歡魚。）\n' +
            'Do you like milk?（你喜歡牛奶嗎？）\n' +
            '⚠ 表達「喜歡某類食物」時，可數名詞通常用複數（I like apples）。',
      viz: { type: 'sentence', label: '說喜好', items: [
        { t: 'I', r: '主詞' }, { t: 'like', r: '動詞' }, { t: 'apples', r: '複數受詞' }],
        note: '表達喜歡某一類東西時，可數名詞用複數。' },
      check: {
        q: '要表達「我喜歡香蕉（這種水果）」，比較自然的說法是什麼？',
        options: [
          'I like bananas.',
          'I like a banana.',
          'I like banana.',
          'I am like bananas.'
        ],
        answer: 0,
        why: [
          null,
          '加 a 表示特定的一根香蕉。',
          '可數名詞通常不會單獨使用單數形。',
          '不能同時用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '④ 點餐用語',
      body: '店員：May I take your order?（可以幫您點餐了嗎？）\n' +
            '顧客：I would like a hamburger, please.（我想要一個漢堡。）\n' +
            '＝ I’d like…（比 I want 更有禮貌）\n' +
            '⚠ 最後加上 please，語氣會禮貌得多。',
      viz: { type: 'sentence', label: '點餐', items: [
        { t: 'I would like', r: '想要（禮貌）' }, { t: 'a hamburger', r: '餐點' },
        { t: 'please', r: '禮貌用語' }],
        note: 'I would like 比 I want 更有禮貌。' },
      check: {
        q: '在餐廳點餐時，比較有禮貌的說法是什麼？',
        options: [
          'I would like a sandwich, please.',
          'Give me a sandwich.',
          'I want sandwich now.',
          'Sandwich!'
        ],
        answer: 0,
        why: [
          null,
          '直接命令式聽起來不禮貌。',
          '語氣過於直接，也少了冠詞。',
          '只說名詞不算完整的句子。'
        ]
      }
    },
    {
      title: '⑤ 問價錢與數量',
      body: 'How much is it?（多少錢？）→ It is fifty dollars.\n' +
            'How many apples do you want?（你要幾顆蘋果？）→ Three, please.\n' +
            '⚠ How much 問價錢或不可數的量；How many 問可數的數量。',
      viz: { type: 'compareexp',
             factor: '問數量的方式',
             a: { label: 'How much', note: '問價錢或不可數名詞的量' },
             b: { label: 'How many', note: '問可數名詞的數量' },
             same: ['都是詢問量的疑問詞'] },
      check: {
        q: '要問「你要幾顆蛋？」應該用哪一個疑問詞？',
        options: [
          'How many',
          'How much',
          'How old',
          'How often'
        ],
        answer: 0,
        why: [
          null,
          'How much 用於不可數名詞或價錢。',
          'How old 是問年齡。',
          'How often 是問頻率。'
        ]
      }
    },
    {
      title: '⑥ 完整的點餐對話',
      body: 'A: May I take your order?\n' +
            'B: Yes. I’d like a hamburger and a glass of milk, please.\n' +
            'A: Anything else?（還需要別的嗎？）　B: No, thanks.\n' +
            '⚠ 對話的關鍵不是單字多，而是「聽得懂、答得出」。',
      viz: { type: 'sentence', label: '完整點餐', items: [
        { t: 'I would like', r: '想要' }, { t: 'a hamburger', r: '主餐' },
        { t: 'and', r: '連接詞' }, { t: 'a glass of milk', r: '飲料' }],
        note: '用 and 連接兩樣想點的東西。' },
      check: {
        q: '店員問 Anything else? 時，如果不需要別的東西，可以怎麼回答？',
        options: [
          'No, thanks.',
          'Yes, I am.',
          'You are welcome.',
          'How much is it?'
        ],
        answer: 0,
        why: [
          null,
          '這個回答與問題不相符。',
          '這是回應別人道謝時說的。',
          '這是在問價錢，沒有回答問題。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第6單元 動物與棲地'] = {
  intro: '動物是最好記的英文單字——因為你早就認識牠們了。',
  cards: [
    {
      title: '① 常見動物',
      body: '寵物：dog（狗）、cat（貓）、bird（鳥）、fish（魚）、rabbit（兔子）。\n' +
            '農場：cow（牛）、pig（豬）、horse（馬）、duck（鴨）、chicken（雞）。\n' +
            '野生：lion（獅子）、tiger（老虎）、elephant（大象）、monkey（猴子）。',
      viz: { type: 'classify', groups: [
        { label: '寵物', items: ['dog', 'cat', 'bird', 'rabbit'] },
        { label: '農場動物', items: ['cow', 'pig', 'horse', 'duck'] },
        { label: '野生動物', items: ['lion', 'tiger', 'elephant', 'monkey'] }] },
      check: {
        q: '「大象」的英文是什麼？',
        options: ['elephant', 'tiger', 'monkey', 'horse'],
        answer: 0,
        why: [
          null,
          'tiger 是老虎。',
          'monkey 是猴子。',
          'horse 是馬。'
        ]
      }
    },
    {
      title: '② 動物的棲地',
      body: 'farm（農場）、zoo（動物園）、forest（森林）、ocean／sea（海洋）、\n' +
            'river（河）、jungle（叢林）、desert（沙漠）。\n' +
            '⚠ 說「住在哪裡」用 live in：Fish live in water.',
      viz: { type: 'sentence', label: '說棲地', items: [
        { t: 'Fish', r: '主詞（複數）' }, { t: 'live', r: '動詞' }, { t: 'in water', r: '地點' }],
        note: '主詞是複數時動詞不加 s。' },
      check: {
        q: '「魚住在水裡」的正確說法是什麼？',
        options: [
          'Fish live in water.',
          'Fish lives in water.',
          'Fish live on water.',
          'Fish is live in water.'
        ],
        answer: 0,
        why: [
          null,
          'fish 在此為複數，動詞不加 s。',
          '住在水中要用 in 而不是 on。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '③ 描述動物',
      body: 'big（大的）、small（小的）、tall（高的）、fast（快的）、slow（慢的）、\n' +
            'cute（可愛的）、strong（強壯的）。\n' +
            '⚠ 句型：The elephant is big.／It is a big animal.',
      viz: { type: 'sentence', label: '用形容詞', items: [
        { t: 'The elephant', r: '主詞' }, { t: 'is', r: 'be 動詞' }, { t: 'big', r: '形容詞' }],
        note: '形容詞放在 be 動詞後面。',
        alt: [
          { label: '形容詞在名詞前', items: [{ t: 'It', r: '主詞' }, { t: 'is', r: 'be 動詞' },
            { t: 'a big animal', r: '名詞片語' }], note: '形容詞也可以放在名詞前面。' }] },
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'It is a big animal.',
          'It is a animal big.',
          'It is big a animal.',
          'It big animal is.'
        ],
        answer: 0,
        why: [
          null,
          '形容詞要放在名詞前面。',
          '冠詞要放在形容詞前面。',
          '這個語序不符合英文結構。'
        ]
      }
    },
    {
      title: '④ 動物會做什麼',
      body: 'Birds can fly.（鳥會飛。）　Fish can swim.（魚會游泳。）\n' +
            'Rabbits can jump.（兔子會跳。）　Dogs can run fast.（狗跑得快。）\n' +
            '⚠ can 後面接原形動詞，不管主詞是誰都一樣。',
      viz: { type: 'sentence', label: '能力', items: [
        { t: 'Birds', r: '主詞' }, { t: 'can', r: '助動詞' }, { t: 'fly', r: '原形動詞' }],
        note: 'can 後面永遠接原形動詞。' },
      check: {
        q: '「鳥會飛」的正確說法是什麼？',
        options: [
          'Birds can fly.',
          'Birds can flies.',
          'Birds can to fly.',
          'Birds are can fly.'
        ],
        answer: 0,
        why: [
          null,
          'can 後面要接原形動詞。',
          'can 後面不加 to。',
          '不能同時使用 be 動詞與 can。'
        ]
      }
    },
    {
      title: '⑤ 單複數變化',
      body: '一般加 s：dogs、cats、birds。\n' +
            '字尾 s、x、sh、ch 加 es：foxes、fishes（也可用 fish）。\n' +
            '⚠ 不規則變化：mouse → mice（老鼠）、goose → geese（鵝）、\n' +
            'sheep → sheep（羊，單複數同形）、fish → fish（常用同形）。',
      viz: { type: 'classify', groups: [
        { label: '加 s', items: ['dogs', 'cats', 'birds'] },
        { label: '不規則', items: ['mice', 'geese', 'children'] },
        { label: '單複數同形', items: ['sheep', 'fish', 'deer'] }] },
      check: {
        q: 'mouse 的複數形是什麼？',
        options: ['mice', 'mouses', 'mouse', 'mousees'],
        answer: 0,
        why: [
          null,
          '這個字屬於不規則變化。',
          '複數形與單數形不同。',
          '這個拼法不存在。'
        ]
      }
    },
    {
      title: '⑥ 介紹喜歡的動物',
      body: '句型組合：\n' +
            'My favorite animal is the dolphin.（我最喜歡的動物是海豚。）\n' +
            'It lives in the ocean. It can swim very fast. It is very smart.\n' +
            '⚠ 用三到四句就能完成一段簡單的介紹。',
      viz: { type: 'sentence', label: '介紹', items: [
        { t: 'My favorite animal', r: '主詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'the dolphin', r: '補語' }],
        note: '先說是什麼，再說牠住哪裡、會做什麼。' },
      check: {
        q: '要介紹一種動物，比較完整的內容應該包含什麼？',
        options: [
          '牠是什麼、住在哪裡、會做什麼、有什麼特徵',
          '只說牠的名字',
          '只說牠的顏色',
          '只說自己喜歡'
        ],
        answer: 0,
        why: [
          null,
          '只有名字的介紹太簡短。',
          '顏色只是其中一項特徵。',
          '喜好之外還需要具體的說明。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第7單元 身體與健康'] = {
  intro: '身體不舒服時說得出來，是很實用的一課。',
  cards: [
    {
      title: '① 身體部位',
      body: 'head（頭）、hair（頭髮）、eye（眼睛）、ear（耳朵）、nose（鼻子）、\n' +
            'mouth（嘴巴）、hand（手）、arm（手臂）、leg（腿）、foot（腳）。\n' +
            '⚠ 成對的部位常用複數：eyes、ears、hands、feet。\n' +
            'foot 的複數是 feet（不規則變化）。',
      viz: { type: 'classify', groups: [
        { label: '頭部', items: ['head', 'eye', 'ear', 'nose', 'mouth'] },
        { label: '四肢', items: ['hand', 'arm', 'leg', 'foot'] }] },
      check: {
        q: 'foot 的複數形是什麼？',
        options: ['feet', 'foots', 'footes', 'feets'],
        answer: 0,
        why: [
          null,
          '這是不規則變化，不加 s。',
          '這個拼法不存在。',
          '複數形只要 feet 就好。'
        ]
      }
    },
    {
      title: '② 說明不舒服',
      body: 'I have a headache.（我頭痛。）　I have a stomachache.（我肚子痛。）\n' +
            'I have a cold.（我感冒了。）　I have a fever.（我發燒。）\n' +
            '⚠ 這些說法都用 have，而且前面要加冠詞 a。',
      viz: { type: 'sentence', label: '說症狀', items: [
        { t: 'I', r: '主詞' }, { t: 'have', r: '動詞' }, { t: 'a headache', r: '症狀' }],
        note: '英文描述生病常用 have 加症狀名詞。' },
      check: {
        q: '「我感冒了」的正確說法是什麼？',
        options: [
          'I have a cold.',
          'I am cold.',
          'I have cold.',
          'I am a cold.'
        ],
        answer: 0,
        why: [
          null,
          'I am cold 是「我覺得冷」，意思不同。',
          '這個說法少了冠詞 a。',
          '人不能等同於一個 cold。'
        ]
      }
    },
    {
      title: '③ 關心與建議',
      body: 'What’s wrong?／What’s the matter?（怎麼了？）\n' +
            'You should see a doctor.（你應該去看醫生。）\n' +
            'Take care.（保重。）　Get well soon.（早日康復。）\n' +
            '⚠ should 後面接原形動詞，用來提出建議。',
      viz: { type: 'sentence', label: '給建議', items: [
        { t: 'You', r: '主詞' }, { t: 'should', r: '助動詞' }, { t: 'see', r: '原形動詞' },
        { t: 'a doctor', r: '受詞' }],
        note: 'should 用來提出建議，後面接原形動詞。' },
      check: {
        q: '朋友說他不舒服，要建議他去看醫生，可以怎麼說？',
        options: [
          'You should see a doctor.',
          'You should to see a doctor.',
          'You should sees a doctor.',
          'You are should see a doctor.'
        ],
        answer: 0,
        why: [
          null,
          'should 後面不加 to。',
          'should 後面要用原形動詞。',
          '不能同時使用 be 動詞與 should。'
        ]
      }
    },
    {
      title: '④ 健康的習慣',
      body: 'eat healthy food（吃健康的食物）、exercise（運動）、\n' +
            'get enough sleep（睡飽）、wash your hands（洗手）、\n' +
            'drink more water（多喝水）。\n' +
            '⚠ 建議別人時常用祈使句：Wash your hands before meals.',
      viz: { type: 'classify', groups: [
        { label: '好習慣', items: ['exercise', 'eat vegetables', 'sleep early', 'wash hands'] },
        { label: '要避免', items: ['stay up late', 'eat too much junk food'] }] },
      check: {
        q: 'Wash your hands before meals. 這句話屬於什麼句型？',
        options: [
          '祈使句，用來提出指示或建議',
          '疑問句',
          '否定句',
          '感嘆句'
        ],
        answer: 0,
        why: [
          null,
          '句尾是句號而非問號。',
          '句中沒有否定詞。',
          '感嘆句通常以 What 或 How 開頭。'
        ]
      }
    },
    {
      title: '⑤ 看醫生的對話',
      body: 'Doctor: What’s wrong?　Patient: I have a fever and a headache.\n' +
            'Doctor: How long have you felt this way?（不舒服多久了？）\n' +
            'Doctor: Take this medicine twice a day.（這個藥一天吃兩次。）\n' +
            '⚠ twice a day 是「一天兩次」。',
      viz: { type: 'sentence', label: '醫囑', items: [
        { t: 'Take', r: '動詞（祈使）' }, { t: 'this medicine', r: '受詞' },
        { t: 'twice a day', r: '頻率' }],
        note: '祈使句加上頻率，說明服藥方式。' },
      check: {
        q: 'twice a day 是什麼意思？',
        options: [
          '一天兩次',
          '兩天一次',
          '一天二十次',
          '每兩天'
        ],
        answer: 0,
        why: [
          null,
          '順序相反了，這樣變成兩天一次。',
          'twice 是兩次而不是二十次。',
          '這樣的意思要說 every two days。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'A: What’s wrong? You look tired.\n' +
            'B: I have a headache. I did not sleep well last night.\n' +
            'A: You should go home and rest. Get well soon!\n' +
            '⚠ 關心別人的三步驟：詢問 → 傾聽 → 給建議或祝福。',
      viz: { type: 'sentence', label: '關心他人', items: [
        { t: 'You', r: '主詞' }, { t: 'look', r: '動詞' }, { t: 'tired', r: '形容詞' }],
        note: 'look 後面可以直接接形容詞，表示「看起來…」。' },
      check: {
        q: 'You look tired. 這句話的意思是什麼？',
        options: [
          '你看起來很累',
          '你在看疲倦的東西',
          '你要看一下',
          '你很無聊'
        ],
        answer: 0,
        why: [
          null,
          'look 加形容詞表示「看起來如何」。',
          '這個句子不是要求對方看東西。',
          'tired 是疲倦而不是無聊。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第8單元 天氣與衣物'] = {
  intro: '每天都會用到的話題：今天天氣如何、該穿什麼。',
  cards: [
    {
      title: '① 天氣的說法',
      body: 'sunny（晴朗）、cloudy（多雲）、rainy（下雨）、windy（有風）、\n' +
            'snowy（下雪）、hot（熱）、cold（冷）、warm（溫暖）、cool（涼爽）。\n' +
            '⚠ 說天氣時主詞用 it：It is sunny today.',
      viz: { type: 'sentence', label: '說天氣', items: [
        { t: 'It', r: '主詞' }, { t: 'is', r: 'be 動詞' }, { t: 'sunny', r: '形容詞' },
        { t: 'today', r: '時間' }],
        note: '天氣的主詞固定用 it。' },
      check: {
        q: '「今天很熱」的正確說法是什麼？',
        options: [
          'It is hot today.',
          'Today is hot weather.',
          'Weather hot today.',
          'Is hot today.'
        ],
        answer: 0,
        why: [
          null,
          '這個說法不自然，通常直接用 it。',
          '句子缺少 be 動詞，文法不完整。',
          '句子缺少主詞，英文句子需要主詞。'
        ]
      }
    },
    {
      title: '② 問天氣',
      body: 'How is the weather?／What is the weather like?（天氣如何？）\n' +
            '→ It is rainy.／It is raining.\n' +
            '⚠ rainy 是形容詞（多雨的）、raining 是進行式（正在下雨），\n' +
            '兩種說法都通。',
      viz: { type: 'compareexp',
             factor: '兩種說法',
             a: { label: 'It is rainy.', note: '用形容詞描述天氣狀態' },
             b: { label: 'It is raining.', note: '用進行式表示現在正在下' },
             same: ['都表示下雨的天氣'] },
      check: {
        q: '要問「天氣如何？」下列哪一句是正確的？',
        options: [
          'How is the weather?',
          'How the weather is?',
          'What weather?',
          'Weather how?'
        ],
        answer: 0,
        why: [
          null,
          '疑問句要把 be 動詞放在主詞前面。',
          '這個句子不完整。',
          '這個語序不符合英文結構。'
        ]
      }
    },
    {
      title: '③ 四季',
      body: 'spring（春）、summer（夏）、fall／autumn（秋）、winter（冬）。\n' +
            '⚠ 季節前面用 in：in summer（在夏天）。\n' +
            '台灣的夏天很長：It is hot and rainy in summer.',
      viz: { type: 'classify', groups: [
        { label: '四季', items: ['spring', 'summer', 'fall', 'winter'] },
        { label: '搭配的天氣', items: ['warm', 'hot', 'cool', 'cold'] }] },
      check: {
        q: '「在冬天」的正確說法是什麼？',
        options: ['in winter', 'on winter', 'at winter', 'to winter'],
        answer: 0,
        why: [
          null,
          'on 用於星期與日期。',
          'at 用於具體的時間點。',
          'to 表示方向或目標。'
        ]
      }
    },
    {
      title: '④ 衣物',
      body: 'shirt（襯衫）、T-shirt（T 恤）、pants（褲子）、skirt（裙子）、\n' +
            'dress（洋裝）、coat（外套）、shoes（鞋子）、socks（襪子）、hat（帽子）。\n' +
            '⚠ 成雙的衣物用複數：pants、shoes、socks、glasses。\n' +
            '要數的時候用 a pair of（一雙／一件）。',
      viz: { type: 'classify', groups: [
        { label: '單數', items: ['shirt', 'coat', 'hat', 'dress'] },
        { label: '成雙（複數）', items: ['pants', 'shoes', 'socks', 'glasses'] }] },
      check: {
        q: '「一雙鞋」的正確說法是什麼？',
        options: [
          'a pair of shoes',
          'a shoes',
          'one shoe pair',
          'a shoe pair'
        ],
        answer: 0,
        why: [
          null,
          '複數名詞前面不能直接加 a。',
          '語序不正確，應使用固定的說法。',
          '慣用說法是 a pair of。'
        ]
      }
    },
    {
      title: '⑤ 天氣與穿著',
      body: 'It is cold. Put on your coat.（天氣冷，穿上外套。）\n' +
            'It is sunny. Wear a hat.（天氣晴，戴頂帽子。）\n' +
            '⚠ wear 是「穿著（狀態）」、put on 是「穿上（動作）」。',
      viz: { type: 'compareexp',
             factor: '兩個動詞',
             a: { label: 'wear', note: '表示穿著的狀態' },
             b: { label: 'put on', note: '表示穿上的動作' },
             same: ['都與衣物有關'] },
      check: {
        q: 'wear 和 put on 的差別是什麼？',
        options: [
          'wear 是穿著的狀態，put on 是穿上的動作',
          '兩者完全相同',
          'wear 只能用於帽子',
          'put on 只能用於鞋子'
        ],
        answer: 0,
        why: [
          null,
          '兩者的語意重點不同。',
          'wear 可以用於各種衣物。',
          'put on 同樣可以用於各種衣物。'
        ]
      }
    },
    {
      title: '⑥ 綜合對話',
      body: 'A: How is the weather today?\n' +
            'B: It is cold and windy.\n' +
            'A: Then put on your coat before you go out.\n' +
            '⚠ 用 and 連接兩個天氣形容詞，用 before 連接兩個動作。',
      viz: { type: 'sentence', label: '天氣描述', items: [
        { t: 'It', r: '主詞' }, { t: 'is', r: 'be 動詞' }, { t: 'cold and windy', r: '兩個形容詞' }],
        note: '用 and 可以把兩個形容詞連起來。' },
      check: {
        q: '要說「又冷又有風」，應該怎麼連接兩個形容詞？',
        options: [
          '用 and 連接：cold and windy',
          '用 or 連接',
          '直接並排不用連接詞',
          '用 but 連接'
        ],
        answer: 0,
        why: [
          null,
          'or 表示二選一。',
          '英文需要連接詞才通順。',
          'but 表示轉折，語意不合。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|三下|第9單元 can 與能力'] = {
  intro: '一個小小的 can，就能說出你會什麼、不會什麼、可不可以做什麼。',
  cards: [
    {
      title: '① can 的意思',
      body: 'can 表示「能力（會）」或「許可（可以）」。\n' +
            'I can swim.（我會游泳。）　Can I go now?（我可以走了嗎？）\n' +
            '⚠ can 是助動詞，後面永遠接原形動詞，而且不隨主詞變化\n' +
            '（不會有 cans）。',
      viz: { type: 'sentence', label: '能力', items: [
        { t: 'I', r: '主詞' }, { t: 'can', r: '助動詞' }, { t: 'swim', r: '原形動詞' }],
        note: 'can 後面永遠是原形動詞。',
        alt: [
          { label: '第三人稱', items: [{ t: 'He', r: '主詞' }, { t: 'can', r: '助動詞（不變）' },
            { t: 'swim', r: '原形動詞' }], note: 'can 不隨主詞改變，也不加 s。' }] },
      tip: '按按鈕比較不同主詞。',
      check: {
        q: '「他會游泳」的正確說法是什麼？',
        options: [
          'He can swim.',
          'He cans swim.',
          'He can swims.',
          'He is can swim.'
        ],
        answer: 0,
        why: [
          null,
          'can 不隨主詞加 s。',
          'can 後面要接原形動詞。',
          '不能同時使用 be 動詞與 can。'
        ]
      }
    },
    {
      title: '② 否定：cannot／can’t',
      body: 'I cannot swim.＝ I can’t swim.（我不會游泳。）\n' +
            '⚠ 注意拼法：cannot 是一個字（中間不空格）；\n' +
            '縮寫是 can’t。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'I', r: '主詞' }, { t: 'cannot', r: '助動詞否定' }, { t: 'swim', r: '原形動詞' }],
        note: '否定時在 can 後面加 not，動詞仍是原形。' },
      check: {
        q: '下列哪一個拼法是正確的？',
        options: ['cannot', 'can not have to be split', 'cant', 'ca not'],
        answer: 0,
        why: [
          null,
          '一般寫成一個字 cannot。',
          '縮寫要有撇號，寫成 can’t。',
          '這個拼法不正確。'
        ]
      }
    },
    {
      title: '③ 疑問句',
      body: 'Can you swim?（你會游泳嗎？）→ Yes, I can.／No, I can’t.\n' +
            'Can he play the piano?（他會彈鋼琴嗎？）\n' +
            '⚠ 疑問句把 can 移到句首，回答時也用 can。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Can', r: '助動詞' }, { t: 'you', r: '主詞' }, { t: 'swim', r: '原形動詞' }],
        note: '把 can 移到主詞前面就是疑問句。' },
      check: {
        q: 'Can you play the guitar? 的正確簡答是什麼？',
        options: [
          'Yes, I can.',
          'Yes, I do.',
          'Yes, I am.',
          'Yes, I play.'
        ],
        answer: 0,
        why: [
          null,
          '問句用 can，回答也要用 can。',
          'am 用於 be 動詞的問句。',
          '簡答時要用助動詞而非主要動詞。'
        ]
      }
    },
    {
      title: '④ 表達許可',
      body: 'Can I use your pen?（我可以用你的筆嗎？）\n' +
            'May I use your pen?（更有禮貌的說法）\n' +
            '⚠ can 用於一般許可，may 更正式與客氣，\n' +
            '對長輩或不熟的人用 may 比較好。',
      viz: { type: 'compareexp',
             factor: '請求許可的語氣',
             a: { label: 'Can I…?', note: '日常口語，較隨意' },
             b: { label: 'May I…?', note: '較正式禮貌，適合對長輩或陌生人' },
             same: ['都是請求許可'] },
      check: {
        q: '要向不熟的長輩請求許可，比較恰當的說法是什麼？',
        options: [
          'May I use your pen?',
          'I use your pen.',
          'Give me your pen.',
          'Your pen.'
        ],
        answer: 0,
        why: [
          null,
          '這是陳述句，不是請求。',
          '命令句聽起來不禮貌。',
          '只說名詞不是完整的請求。'
        ]
      }
    },
    {
      title: '⑤ 說出自己的能力',
      body: 'I can ride a bike.（我會騎腳踏車。）\n' +
            'I can speak English a little.（我會說一點英文。）\n' +
            'I can’t cook.（我不會煮飯。）\n' +
            '⚠ a little（一點點）可以放在句尾，讓表達更精確。',
      viz: { type: 'sentence', label: '說能力', items: [
        { t: 'I', r: '主詞' }, { t: 'can speak', r: '助動詞＋動詞' },
        { t: 'English', r: '受詞' }, { t: 'a little', r: '程度' }],
        note: '加上程度副詞能讓表達更精確。' },
      check: {
        q: '要說「我會說一點英文」，正確的說法是什麼？',
        options: [
          'I can speak English a little.',
          'I can speaks English.',
          'I can to speak English.',
          'I am can speak English.'
        ],
        answer: 0,
        why: [
          null,
          'can 後面要用原形動詞。',
          'can 後面不加 to。',
          '不能同時使用 be 動詞與 can。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'A: Can you play basketball?　B: Yes, I can. But I can’t swim.\n' +
            'A: Can your brother swim?　B: Yes, he can. He swims very well.\n' +
            '⚠ 注意：用 can 時動詞是原形（can swim），\n' +
            '不用 can 時第三人稱單數要加 s（he swims）。',
      viz: { type: 'sentence', label: '有 can', items: [
        { t: 'He', r: '主詞' }, { t: 'can', r: '助動詞' }, { t: 'swim', r: '原形' }],
        note: '有 can 時動詞用原形。',
        alt: [
          { label: '沒有 can', items: [{ t: 'He', r: '主詞' }, { t: 'swims', r: '動詞加 s' },
            { t: 'very well', r: '副詞' }], note: '沒有助動詞時第三人稱單數要加 s。' }] },
      check: {
        q: '為什麼 He can swim 用 swim，而 He swims well 用 swims？',
        options: [
          '因為 can 後面要用原形動詞，沒有助動詞時第三人稱單數才加 s',
          '因為兩句意思不同',
          '因為 swim 沒有變化形',
          '因為可以隨便用'
        ],
        answer: 0,
        why: [
          null,
          '兩句的差別在文法而非語意。',
          'swim 的第三人稱單數形是 swims。',
          '動詞形式有明確的規則。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第1單元 現在進行式'] = {
  intro: '「我正在做什麼」——這個時態專門用來描述此刻正在發生的事。',
  cards: [
    {
      title: '① 現在進行式的形式',
      body: '主詞 ＋ be 動詞（am／is／are）＋ 動詞-ing。\n' +
            'I am eating.（我正在吃。）　He is reading.（他正在看書。）\n' +
            '⚠ be 動詞與 -ing 缺一不可：不能說 I eating，也不能說 I am eat。',
      viz: { type: 'sentence', label: '現在進行式', items: [
        { t: 'I', r: '主詞' }, { t: 'am', r: 'be 動詞' }, { t: 'eating', r: '動詞-ing' }],
        note: 'be 動詞要配合主詞：I 用 am、he/she/it 用 is、you/we/they 用 are。' },
      tip: '這個元件把句子拆成一格一格。',
      check: {
        q: '「他正在看書」的正確說法是什麼？',
        options: [
          'He is reading.',
          'He reading.',
          'He is read.',
          'He are reading.'
        ],
        answer: 0,
        why: [
          null,
          '缺少 be 動詞。',
          '動詞要加 -ing。',
          '主詞是第三人稱單數，要用 is。'
        ]
      }
    },
    {
      title: '② 和現在簡單式的差別',
      body: '現在簡單式：習慣或事實（I eat breakfast every day.）\n' +
            '現在進行式：此刻正在做（I am eating breakfast now.）\n' +
            '⚠ 判斷線索：now、right now、at the moment 通常搭配進行式；\n' +
            'every day、usually 搭配簡單式。',
      viz: { type: 'tense', verb: 'eat', highlight: '現在進行式' },
      tip: '按按鈕比較不同時態。',
      check: {
        q: '句子裡出現 right now，通常要用什麼時態？',
        options: [
          '現在進行式',
          '現在簡單式',
          '過去式',
          '未來式'
        ],
        answer: 0,
        why: [
          null,
          '簡單式搭配的是 every day 這類頻率詞。',
          '過去式搭配的是過去的時間詞。',
          '未來式搭配的是未來的時間詞。'
        ]
      }
    },
    {
      title: '③ be 動詞的選擇',
      body: 'I ＋ am；he／she／it ＋ is；you／we／they ＋ are。\n' +
            '⚠ 主詞是單數名詞（my brother）用 is；\n' +
            '複數名詞（my parents）用 are。',
      viz: { type: 'classify', groups: [
        { label: '用 am', items: ['I'] },
        { label: '用 is', items: ['he', 'she', 'it', 'my brother', 'the dog'] },
        { label: '用 are', items: ['you', 'we', 'they', 'my parents'] }] },
      check: {
        q: '「我的父母正在看電視」應該用哪一個 be 動詞？',
        options: ['are', 'is', 'am', '不需要 be 動詞'],
        answer: 0,
        why: [
          null,
          'parents 是複數，不用 is。',
          'am 只能搭配主詞 I。',
          '進行式一定要有 be 動詞。'
        ]
      }
    },
    {
      title: '④ 否定句',
      body: '在 be 動詞後面加 not：\n' +
            'I am not eating.　He is not sleeping.（＝ isn’t）\n' +
            'They are not playing.（＝ aren’t）\n' +
            '⚠ 進行式的否定不需要 do／does。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'He', r: '主詞' }, { t: 'is not', r: 'be 動詞＋not' },
        { t: 'sleeping', r: '動詞-ing' }],
        note: '進行式的否定只要在 be 動詞後面加 not。' },
      check: {
        q: '「他沒有在睡覺」的正確說法是什麼？',
        options: [
          'He is not sleeping.',
          'He does not sleeping.',
          'He not is sleeping.',
          'He is not sleep.'
        ],
        answer: 0,
        why: [
          null,
          '進行式的否定不用 does。',
          'not 要放在 be 動詞後面。',
          '動詞要保持 -ing 形。'
        ]
      }
    },
    {
      title: '⑤ 疑問句',
      body: '把 be 動詞移到句首：\n' +
            'Are you eating?→ Yes, I am.／No, I am not.\n' +
            'Is he reading?→ Yes, he is.／No, he isn’t.\n' +
            '⚠ 簡答時用 be 動詞回答，不能說 Yes, I do.',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Are', r: 'be 動詞' }, { t: 'you', r: '主詞' }, { t: 'eating', r: '動詞-ing' }],
        note: '把 be 動詞移到主詞前面就成為疑問句。' },
      check: {
        q: 'Is she singing? 的正確簡答是什麼？',
        options: [
          'Yes, she is.',
          'Yes, she does.',
          'Yes, she sings.',
          'Yes, she can.'
        ],
        answer: 0,
        why: [
          null,
          '問句用 be 動詞，回答也要用 be 動詞。',
          '簡答時不重複主要動詞。',
          'can 沒有出現在問句中。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: '看圖說話是最好的練習：\n' +
            'The boy is running.（男孩正在跑步。）\n' +
            'Two girls are talking.（兩個女孩正在講話。）\n' +
            'The dog is not sleeping. It is eating.\n' +
            '⚠ 注意主詞的單複數會決定 be 動詞。',
      viz: { type: 'sentence', label: '複數主詞', items: [
        { t: 'Two girls', r: '主詞（複數）' }, { t: 'are', r: 'be 動詞' },
        { t: 'talking', r: '動詞-ing' }],
        note: '複數主詞要用 are。' },
      check: {
        q: '「兩隻狗正在跑」的正確說法是什麼？',
        options: [
          'Two dogs are running.',
          'Two dogs is running.',
          'Two dogs are run.',
          'Two dog are running.'
        ],
        answer: 0,
        why: [
          null,
          '複數主詞要用 are。',
          '進行式的動詞要加 -ing。',
          '數字大於一時名詞要用複數。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第2單元 -ing 拼寫規則'] = {
  intro: '動詞加 -ing 看起來簡單，但有三種情況要特別注意拼法。',
  cards: [
    {
      title: '① 一般直接加 -ing',
      body: 'play → playing、read → reading、eat → eating、study → studying。\n' +
            '⚠ 字尾是 y 時「不用」變化，直接加 -ing（study → studying），\n' +
            '這和第三人稱單數加 s 的規則不同。',
      viz: { type: 'classify', groups: [
        { label: '直接加 -ing', items: ['playing', 'reading', 'eating', 'studying'] }] },
      check: {
        q: 'study 加上 -ing 應該怎麼拼？',
        options: ['studying', 'studiing', 'studing', 'studyying'],
        answer: 0,
        why: [
          null,
          '加 -ing 時字尾的 y 不需要變化。',
          '不能省略字尾的 y。',
          '不需要重複字尾的 y。'
        ]
      }
    },
    {
      title: '② 去 e 加 -ing',
      body: '字尾是「不發音的 e」時，去掉 e 再加 -ing：\n' +
            'make → making、write → writing、come → coming、dance → dancing。\n' +
            '⚠ 例外：see → seeing（ee 結尾不去 e）。',
      viz: { type: 'classify', groups: [
        { label: '去 e 加 -ing', items: ['making', 'writing', 'coming', 'dancing'] },
        { label: '例外', items: ['seeing', 'being'] }] },
      check: {
        q: 'write 加上 -ing 應該怎麼拼？',
        options: ['writing', 'writeing', 'writting', 'wrting'],
        answer: 0,
        why: [
          null,
          '字尾不發音的 e 要去掉。',
          '這裡不需要重複子音。',
          '正確的拼法是去掉 e。'
        ]
      }
    },
    {
      title: '③ 重複字尾子音',
      body: '「短母音＋單一子音」結尾的單音節字，要重複字尾子音再加 -ing：\n' +
            'run → running、sit → sitting、swim → swimming、get → getting。\n' +
            '⚠ 判斷方法：唸唸看，如果母音是短音而且只有一個子音結尾，就要重複。',
      viz: { type: 'classify', groups: [
        { label: '重複子音', items: ['running', 'sitting', 'swimming', 'getting'] },
        { label: '不重複', items: ['reading', 'eating', 'playing'] }] },
      check: {
        q: 'run 加上 -ing 應該怎麼拼？',
        options: ['running', 'runing', 'runnning', 'runnig'],
        answer: 0,
        why: [
          null,
          '短母音加單子音結尾要重複子音。',
          '只需要重複一次。',
          '這個拼法漏了重複的字母。'
        ]
      }
    },
    {
      title: '④ 為什麼要重複子音',
      body: '因為要保持母音的短音。\n' +
            '如果不重複：hoping（希望，長音 o）／hopping（單腳跳，短音 o）。\n' +
            '⚠ 這一個字母的差別會讓意思完全不同。',
      viz: { type: 'compareexp',
             factor: '重複與不重複',
             a: { label: 'hoping', note: '來自 hope，母音是長音' },
             b: { label: 'hopping', note: '來自 hop，母音是短音' },
             same: ['都是 -ing 形'] },
      check: {
        q: 'hoping 和 hopping 的差別是什麼？',
        options: [
          '前者來自 hope（希望）、後者來自 hop（單腳跳），母音長短不同',
          '兩者意思相同',
          '只是拼法不同但意思一樣',
          '兩個都是錯的拼法'
        ],
        answer: 0,
        why: [
          null,
          '兩者的原形動詞不同。',
          '拼法不同代表來自不同的動詞。',
          '兩個拼法都正確，只是意思不同。'
        ]
      }
    },
    {
      title: '⑤ 常見動詞整理',
      body: '直接加：go → going、do → doing、say → saying、work → working。\n' +
            '去 e：take → taking、have → having、use → using、ride → riding。\n' +
            '重複：put → putting、cut → cutting、stop → stopping、shop → shopping。\n' +
            '⚠ 兩音節以上時，重音在後才重複（begin → beginning）。',
      viz: { type: 'classify', groups: [
        { label: '直接加', items: ['going', 'doing', 'saying'] },
        { label: '去 e', items: ['taking', 'having', 'using'] },
        { label: '重複子音', items: ['putting', 'stopping', 'beginning'] }] },
      check: {
        q: 'stop 加上 -ing 應該怎麼拼？',
        options: ['stopping', 'stoping', 'stopeing', 'stoppping'],
        answer: 0,
        why: [
          null,
          '短母音加單子音要重複子音。',
          '這裡不需要加 e。',
          '正確的拼法要重複 p。'
        ]
      }
    },
    {
      title: '⑥ 練習與檢查',
      body: '檢查三步驟：\n' +
            '① 字尾是不發音的 e 嗎？→ 去掉 e。\n' +
            '② 是短母音＋單子音結尾嗎？→ 重複子音。\n' +
            '③ 都不是？→ 直接加 -ing。\n' +
            '⚠ 拼錯 -ing 是很常見的失分點，寫完要檢查一次。',
      viz: { type: 'energyflow', steps: ['看字尾', '有不發音 e 就去掉', '短母音單子音就重複', '其餘直接加'] },
      check: {
        q: '要判斷動詞怎麼加 -ing，第一步應該先看什麼？',
        options: [
          '字尾是不是不發音的 e',
          '單字有幾個字母',
          '單字的中文意思',
          '主詞是誰'
        ],
        answer: 0,
        why: [
          null,
          '長度不是判斷的依據。',
          '中文意思與拼寫規則無關。',
          '主詞不影響 -ing 的拼法。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第3單元 現在進行式問句與否定'] = {
  intro: '學會問「你在做什麼？」就能和別人開始一段真正的對話。',
  cards: [
    {
      title: '① Yes／No 問句',
      body: '把 be 動詞移到句首：\n' +
            'Are you studying?（你正在讀書嗎？）\n' +
            'Is she cooking?（她正在煮飯嗎？）\n' +
            '⚠ 進行式的問句不用 do／does，因為句子裡已經有 be 動詞。',
      viz: { type: 'sentence', label: '陳述句', items: [
        { t: 'You', r: '主詞' }, { t: 'are', r: 'be 動詞' }, { t: 'studying', r: '動詞-ing' }],
        note: '陳述句的順序是主詞在前。',
        alt: [
          { label: '疑問句', items: [{ t: 'Are', r: 'be 動詞' }, { t: 'you', r: '主詞' },
            { t: 'studying', r: '動詞-ing' }], note: '把 be 動詞移到主詞前面。' }] },
      tip: '按按鈕比較兩種語序。',
      check: {
        q: '「他正在打電話嗎？」的正確問法是什麼？',
        options: [
          'Is he calling?',
          'Does he calling?',
          'He is calling?',
          'Do he is calling?'
        ],
        answer: 0,
        why: [
          null,
          '進行式的問句不用 does。',
          '疑問句要把 be 動詞移到句首。',
          '一個句子不能同時有兩個助動詞。'
        ]
      }
    },
    {
      title: '② 簡答',
      body: 'Are you eating? → Yes, I am.／No, I am not.\n' +
            'Is he sleeping? → Yes, he is.／No, he isn’t.\n' +
            '⚠ 肯定簡答不能縮寫：Yes, I’m. 是錯的，要說 Yes, I am.',
      viz: { type: 'compareexp',
             factor: '簡答的縮寫',
             a: { label: '肯定簡答', note: '不縮寫：Yes, I am.' },
             b: { label: '否定簡答', note: '可縮寫：No, I am not. 或 No, I’m not.' },
             same: ['都用 be 動詞回答'] },
      check: {
        q: '下列哪一個簡答是錯的？',
        options: [
          'Yes, I’m.',
          'Yes, I am.',
          'No, I’m not.',
          'No, he isn’t.'
        ],
        answer: 0,
        why: [
          null,
          '肯定簡答要用完整形式。',
          '否定簡答可以縮寫。',
          '這個否定簡答的縮寫是正確的。'
        ]
      }
    },
    {
      title: '③ 疑問詞問句',
      body: 'What are you doing?（你正在做什麼？）→ I am reading.\n' +
            'Where is he going?（他要去哪裡？）\n' +
            'Who is singing?（誰在唱歌？）\n' +
            '⚠ 順序：疑問詞 ＋ be 動詞 ＋ 主詞 ＋ 動詞-ing。',
      viz: { type: 'sentence', label: '疑問詞問句', items: [
        { t: 'What', r: '疑問詞' }, { t: 'are', r: 'be 動詞' }, { t: 'you', r: '主詞' },
        { t: 'doing', r: '動詞-ing' }],
        note: '疑問詞放在最前面，接著才是 be 動詞與主詞。' },
      check: {
        q: '「你正在做什麼？」的正確語序是什麼？',
        options: [
          'What are you doing?',
          'What you are doing?',
          'What do you doing?',
          'You are doing what?'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞要放在主詞前面。',
          '進行式不用 do。',
          '這個語序不是標準的疑問句。'
        ]
      }
    },
    {
      title: '④ 常用的回答',
      body: 'What are you doing? → I am doing my homework.\n' +
            'Nothing much.（沒做什麼特別的。）\n' +
            'I am just watching TV.（我只是在看電視。）\n' +
            '⚠ 回答時通常重複問題中的動詞形式（doing → doing）。',
      viz: { type: 'sentence', label: '回答', items: [
        { t: 'I', r: '主詞' }, { t: 'am doing', r: 'be＋動詞-ing' },
        { t: 'my homework', r: '受詞' }],
        note: '回答時同樣要用進行式。' },
      check: {
        q: '別人問 What are you doing? 時，比較合適的回答是什麼？',
        options: [
          'I am watching TV.',
          'I watch TV every day.',
          'I watched TV.',
          'I will watch TV.'
        ],
        answer: 0,
        why: [
          null,
          '這是習慣而非此刻正在做的事。',
          '這是過去式，時間不符。',
          '這是未來的計畫，不是現在正在做。'
        ]
      }
    },
    {
      title: '⑤ 否定的多種說法',
      body: 'He is not playing.＝ He isn’t playing.＝ He’s not playing.\n' +
            '⚠ 三種寫法都正確，口語中縮寫比較常見。\n' +
            '但 I am not 只能縮寫成 I’m not（沒有 I amn’t）。',
      viz: { type: 'classify', groups: [
        { label: '可以縮寫', items: ['isn’t', 'aren’t', 'he’s not', 'they’re not'] },
        { label: '沒有這種縮寫', items: ['amn’t'] }] },
      check: {
        q: '「我沒有在讀書」的正確縮寫是什麼？',
        options: [
          'I’m not studying.',
          'I amn’t studying.',
          'I not am studying.',
          'I’m no studying.'
        ],
        answer: 0,
        why: [
          null,
          '英文沒有 amn’t 這種縮寫。',
          'not 要放在 be 動詞後面。',
          'no 不能用來否定動詞。'
        ]
      }
    },
    {
      title: '⑥ 綜合對話',
      body: 'A: Hi, what are you doing?\n' +
            'B: I am doing my homework. What about you?\n' +
            'A: I am watching a movie. Are you busy now?\n' +
            'B: Yes, I am. Maybe later!\n' +
            '⚠ What about you?（那你呢？）是延續對話的好用句。',
      viz: { type: 'sentence', label: '延續話題', items: [
        { t: 'What about', r: '固定用法' }, { t: 'you', r: '對象' }],
        note: 'What about you? 用來把問題丟回給對方。' },
      check: {
        q: '想把話題轉回給對方，可以說什麼？',
        options: [
          'What about you?',
          'Goodbye.',
          'I do not know.',
          'That is all.'
        ],
        answer: 0,
        why: [
          null,
          '這是道別，會直接結束對話。',
          '這個回答無法延續話題。',
          '這句話帶有結束的意味。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第4單元 地點介系詞'] = {
  intro: '東西在哪裡？上面、裡面、旁邊、後面——這些小字讓描述變得精確。',
  cards: [
    {
      title: '① in、on、under',
      body: 'in（在…裡面）：The book is in the bag.\n' +
            'on（在…上面，有接觸）：The book is on the desk.\n' +
            'under（在…下面）：The cat is under the chair.\n' +
            '⚠ on 強調「接觸表面」，over 則是「在上方但沒接觸」。',
      viz: { type: 'classify', groups: [
        { label: '裡面', items: ['in the bag', 'in the box', 'in the room'] },
        { label: '上面', items: ['on the desk', 'on the wall', 'on the floor'] },
        { label: '下面', items: ['under the chair', 'under the tree'] }] },
      check: {
        q: '「書在書包裡」應該用哪一個介系詞？',
        options: ['in', 'on', 'under', 'to'],
        answer: 0,
        why: [
          null,
          'on 表示在表面上。',
          'under 表示在下面。',
          'to 表示方向或目標。'
        ]
      }
    },
    {
      title: '② 其他常用介系詞',
      body: 'behind（在…後面）、in front of（在…前面）、\n' +
            'next to／beside（在…旁邊）、between（在…之間，兩者）、\n' +
            'near（在…附近）。\n' +
            '⚠ between 用於「兩者之間」；三者以上用 among。',
      viz: { type: 'classify', groups: [
        { label: '前後', items: ['in front of', 'behind'] },
        { label: '旁邊', items: ['next to', 'beside', 'near'] },
        { label: '之間', items: ['between', 'among'] }] },
      check: {
        q: '「在兩棵樹之間」應該用哪一個介系詞？',
        options: ['between', 'among', 'behind', 'under'],
        answer: 0,
        why: [
          null,
          'among 用於三者以上。',
          'behind 是在後面。',
          'under 是在下面。'
        ]
      }
    },
    {
      title: '③ 問位置',
      body: 'Where is my book?（我的書在哪裡？）→ It is on the desk.\n' +
            'Where are my shoes?（我的鞋子在哪裡？）→ They are under the bed.\n' +
            '⚠ 單數用 is、複數用 are；回答時代名詞也要一致（it／they）。',
      viz: { type: 'sentence', label: '問位置', items: [
        { t: 'Where', r: '疑問詞' }, { t: 'is', r: 'be 動詞' }, { t: 'my book', r: '主詞' }],
        note: '疑問詞 Where 放句首，be 動詞在主詞前。',
        alt: [
          { label: '回答', items: [{ t: 'It', r: '代名詞' }, { t: 'is', r: 'be 動詞' },
            { t: 'on the desk', r: '地點' }], note: '用 it 代替單數名詞。' }] },
      check: {
        q: '「我的鞋子在哪裡？」的正確問法是什麼？',
        options: [
          'Where are my shoes?',
          'Where is my shoes?',
          'Where my shoes are?',
          'My shoes where?'
        ],
        answer: 0,
        why: [
          null,
          'shoes 是複數，要用 are。',
          'be 動詞要放在主詞前面。',
          '這個語序不符合英文結構。'
        ]
      }
    },
    {
      title: '④ There is／There are',
      body: '表示「某處有某物」：\n' +
            'There is a book on the desk.（桌上有一本書。）\n' +
            'There are two books on the desk.（桌上有兩本書。）\n' +
            '⚠ be 動詞要配合「後面的名詞」，不是配合 there。',
      viz: { type: 'sentence', label: '單數', items: [
        { t: 'There is', r: '有' }, { t: 'a book', r: '單數名詞' }, { t: 'on the desk', r: '地點' }],
        note: '單數名詞用 There is。',
        alt: [
          { label: '複數', items: [{ t: 'There are', r: '有' }, { t: 'two books', r: '複數名詞' },
            { t: 'on the desk', r: '地點' }], note: '複數名詞用 There are。' }] },
      check: {
        q: '「教室裡有三張桌子」的正確說法是什麼？',
        options: [
          'There are three desks in the classroom.',
          'There is three desks in the classroom.',
          'There have three desks in the classroom.',
          'There are three desk in the classroom.'
        ],
        answer: 0,
        why: [
          null,
          '後面是複數名詞，要用 are。',
          '英文用 There is/are 而不是 There have。',
          '數字大於一時名詞要用複數。'
        ]
      }
    },
    {
      title: '⑤ 地點的說法',
      body: 'at home（在家）、at school（在學校）、in the park（在公園）、\n' +
            'on the playground（在操場上）、in bed（在床上睡覺）。\n' +
            '⚠ 有些是固定用法，不完全照字面推理，例如 at home 不加 the。',
      viz: { type: 'classify', groups: [
        { label: '用 at', items: ['at home', 'at school', 'at work'] },
        { label: '用 in', items: ['in the park', 'in the room', 'in Taipei'] },
        { label: '用 on', items: ['on the playground', 'on the street'] }] },
      check: {
        q: '「在家」的正確說法是什麼？',
        options: ['at home', 'at the home', 'in home', 'on home'],
        answer: 0,
        why: [
          null,
          '這個片語不加冠詞 the。',
          '慣用說法是 at home。',
          'on 用於表面。'
        ]
      }
    },
    {
      title: '⑥ 描述房間',
      body: '練習：用三到四句描述一個空間。\n' +
            'There is a bed in my room. My desk is next to the window.\n' +
            'There are two books on the desk. My bag is under the chair.\n' +
            '⚠ 先說有什麼（There is/are），再說在哪裡（介系詞）。',
      viz: { type: 'sentence', label: '描述空間', items: [
        { t: 'My desk', r: '主詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'next to the window', r: '地點' }],
        note: '主詞加 be 動詞加地點片語，用來說明位置。' },
      check: {
        q: '描述一個房間時，開頭常用什麼句型說明「有什麼」？',
        options: [
          'There is／There are',
          'It is',
          'I have to',
          'Do you have'
        ],
        answer: 0,
        why: [
          null,
          'It is 用來說明某物是什麼。',
          '這是表達必須做某事。',
          '這是疑問句而非描述。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第5單元 There is / There are'] = {
  intro: '要說「有什麼東西在哪裡」，英文有一個專門的句型。',
  cards: [
    {
      title: '① 基本句型',
      body: 'There is ＋ 單數名詞（或不可數名詞）＋ 地點。\n' +
            'There are ＋ 複數名詞 ＋ 地點。\n' +
            '⚠ there 在這裡沒有「那裡」的意思，只是句型的開頭；\n' +
            '真正的主詞是後面的名詞。',
      viz: { type: 'sentence', label: '單數', items: [
        { t: 'There is', r: '句型' }, { t: 'a cat', r: '真正的主詞' },
        { t: 'in the box', r: '地點' }],
        note: 'be 動詞要配合後面的名詞，不是配合 there。',
        alt: [
          { label: '複數', items: [{ t: 'There are', r: '句型' }, { t: 'two cats', r: '複數主詞' },
            { t: 'in the box', r: '地點' }], note: '後面是複數名詞時用 There are。' }] },
      tip: '按按鈕比較單複數。',
      check: {
        q: 'There is 或 There are 的選擇，取決於什麼？',
        options: [
          '後面名詞的單複數',
          'there 這個字',
          '地點的遠近',
          '說話者是誰'
        ],
        answer: 0,
        why: [
          null,
          'there 本身沒有單複數。',
          '距離不影響 be 動詞。',
          '說話者不影響這個句型。'
        ]
      }
    },
    {
      title: '② 不可數名詞',
      body: '不可數名詞一律用 There is：\n' +
            'There is some water in the glass.（杯子裡有一些水。）\n' +
            'There is milk in the fridge.\n' +
            '⚠ 不可數名詞沒有複數形，也不能直接加 a。',
      viz: { type: 'classify', groups: [
        { label: '用 There is', items: ['a book', 'some water', 'milk', 'rice'] },
        { label: '用 There are', items: ['two books', 'some apples', 'many students'] }] },
      check: {
        q: '「桌上有一些水」的正確說法是什麼？',
        options: [
          'There is some water on the table.',
          'There are some water on the table.',
          'There is some waters on the table.',
          'There have some water on the table.'
        ],
        answer: 0,
        why: [
          null,
          '不可數名詞要用 is。',
          '不可數名詞沒有複數形。',
          '英文用 There is 而不是 There have。'
        ]
      }
    },
    {
      title: '③ 否定句',
      body: 'There is not a book on the desk.＝ There isn’t a book…\n' +
            'There are not any books.＝ There aren’t any books.\n' +
            '⚠ 否定句中常用 any 取代 some；\n' +
            '也可以說 There is no book.（更簡潔）',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'There are not', r: '句型否定' }, { t: 'any books', r: '名詞' },
        { t: 'on the desk', r: '地點' }],
        note: '否定句常用 any 而不是 some。' },
      check: {
        q: '「桌上沒有任何書」的正確說法是什麼？',
        options: [
          'There aren’t any books on the desk.',
          'There aren’t some books on the desk.',
          'There isn’t any books on the desk.',
          'There don’t have books on the desk.'
        ],
        answer: 0,
        why: [
          null,
          '否定句通常用 any 而不是 some。',
          '後面是複數名詞，要用 aren’t。',
          '英文不用 There have 這個說法。'
        ]
      }
    },
    {
      title: '④ 疑問句',
      body: 'Is there a book on the desk?→ Yes, there is.／No, there isn’t.\n' +
            'Are there any books?→ Yes, there are.／No, there aren’t.\n' +
            '⚠ 把 be 動詞移到 there 前面；簡答時保留 there。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Are', r: 'be 動詞' }, { t: 'there', r: '句型' }, { t: 'any books', r: '名詞' }],
        note: '把 be 動詞移到 there 前面。' },
      check: {
        q: 'Is there a pen in your bag? 的正確簡答是什麼？',
        options: [
          'Yes, there is.',
          'Yes, it is.',
          'Yes, there has.',
          'Yes, I do.'
        ],
        answer: 0,
        why: [
          null,
          '簡答時要保留 there。',
          '英文沒有 there has 這種用法。',
          '這個問句不是用 do 問的。'
        ]
      }
    },
    {
      title: '⑤ 問數量',
      body: 'How many students are there in your class?（你們班有幾個學生？）\n' +
            '→ There are thirty students.\n' +
            '⚠ 語序：How many ＋ 複數名詞 ＋ are there ＋ 地點。',
      viz: { type: 'sentence', label: '問數量', items: [
        { t: 'How many', r: '疑問詞組' }, { t: 'students', r: '複數名詞' },
        { t: 'are there', r: 'be＋there' }],
        note: '注意 are there 的順序，這是疑問句。' },
      check: {
        q: '「你家有幾個人？」的正確說法是什麼？',
        options: [
          'How many people are there in your family?',
          'How many people there are in your family?',
          'How much people are there in your family?',
          'How many person are there in your family?'
        ],
        answer: 0,
        why: [
          null,
          '疑問句要把 be 動詞放在 there 前面。',
          '人是可數的，要用 How many。',
          'person 的複數是 people。'
        ]
      }
    },
    {
      title: '⑥ 綜合應用',
      body: '描述一個地方：\n' +
            'There is a park near my house. There are many trees in it.\n' +
            'There is a small lake, too. There aren’t any tall buildings.\n' +
            '⚠ 肯定句用 some、否定與疑問用 any，是很常見的搭配。',
      viz: { type: 'compareexp',
             factor: 'some 與 any',
             a: { label: 'some', note: '用於肯定句' },
             b: { label: 'any', note: '用於否定句與疑問句' },
             same: ['都表示不確定的數量'] },
      check: {
        q: 'some 與 any 的用法差別是什麼？',
        options: [
          'some 多用於肯定句，any 多用於否定與疑問句',
          '兩者完全相同',
          'some 只能用於不可數名詞',
          'any 只能用於肯定句'
        ],
        answer: 0,
        why: [
          null,
          '兩者的使用場合不同。',
          'some 可以用於可數與不可數名詞。',
          'any 主要用於否定與疑問句。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第6單元 月份與日期'] = {
  intro: '生日、節日、考試日——會說日期，行事曆就能用英文寫。',
  cards: [
    {
      title: '① 十二個月份',
      body: 'January、February、March、April、May、June、\n' +
            'July、August、September、October、November、December。\n' +
            '⚠ 月份的第一個字母要「大寫」，這是英文的規則。',
      viz: { type: 'classify', groups: [
        { label: '上半年', items: ['January', 'February', 'March', 'April', 'May', 'June'] },
        { label: '下半年', items: ['July', 'August', 'September', 'October', 'November', 'December'] }] },
      check: {
        q: '英文的月份名稱有什麼書寫規則？',
        options: [
          '第一個字母要大寫',
          '全部要大寫',
          '全部要小寫',
          '沒有規則'
        ],
        answer: 0,
        why: [
          null,
          '一般情況下不用全部大寫。',
          '月份屬於專有名詞，首字母要大寫。',
          '英文對專有名詞有明確的規則。'
        ]
      }
    },
    {
      title: '② 星期',
      body: 'Sunday、Monday、Tuesday、Wednesday、Thursday、Friday、Saturday。\n' +
            '⚠ 星期的首字母同樣要大寫。\n' +
            '「在星期一」用 on Monday；「每個星期一」用 on Mondays。',
      viz: { type: 'classify', groups: [
        { label: '平日', items: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
        { label: '週末', items: ['Saturday', 'Sunday'] }] },
      check: {
        q: '「在星期五」的正確說法是什麼？',
        options: ['on Friday', 'in Friday', 'at Friday', 'to Friday'],
        answer: 0,
        why: [
          null,
          'in 用於月份或年份。',
          'at 用於具體的時間點。',
          'to 表示方向或目標。'
        ]
      }
    },
    {
      title: '③ 序數',
      body: '日期要用序數：first（1st）、second（2nd）、third（3rd）、fourth（4th）、\n' +
            'fifth（5th）、…、twentieth（20th）、twenty-first（21st）。\n' +
            '⚠ 大部分是加 th，但 1、2、3 特別（st、nd、rd）。',
      viz: { type: 'classify', groups: [
        { label: '特別的', items: ['first', 'second', 'third', 'fifth', 'ninth', 'twelfth'] },
        { label: '規則加 th', items: ['fourth', 'sixth', 'seventh', 'tenth'] }] },
      check: {
        q: '數字 3 的序數是什麼？',
        options: ['third', 'threeth', 'thirdth', 'threerd'],
        answer: 0,
        why: [
          null,
          '這不是正確的拼法。',
          '不需要重複字尾。',
          '這個拼法不存在。'
        ]
      }
    },
    {
      title: '④ 日期的寫法與唸法',
      body: '美式：May 5, 2026（唸 May fifth）。\n' +
            '英式：5 May 2026（唸 the fifth of May）。\n' +
            '⚠ 唸的時候日期用序數，年份分兩段唸（2026 → twenty twenty-six）。',
      viz: { type: 'sentence', label: '日期', items: [
        { t: 'May', r: '月份' }, { t: '5', r: '日（唸序數）' }, { t: '2026', r: '年' }],
        note: '寫的是數字，唸的時候要用序數。' },
      check: {
        q: 'May 5 應該怎麼唸？',
        options: [
          'May fifth',
          'May five',
          'Five May only',
          'May fiveth'
        ],
        answer: 0,
        why: [
          null,
          '日期要用序數而不是基數。',
          '這個語序不是美式的常見唸法。',
          'five 的序數是 fifth。'
        ]
      }
    },
    {
      title: '⑤ 問日期',
      body: 'What is the date today?（今天幾號？）→ It is May 5.\n' +
            'What day is it today?（今天星期幾？）→ It is Monday.\n' +
            '⚠ date 問「日期」、day 問「星期」，兩個問句不一樣。',
      viz: { type: 'compareexp',
             factor: '兩種問法',
             a: { label: 'What is the date?', note: '問幾月幾號' },
             b: { label: 'What day is it?', note: '問星期幾' },
             same: ['都與時間有關'] },
      check: {
        q: '要問「今天星期幾？」應該怎麼說？',
        options: [
          'What day is it today?',
          'What date is it today?',
          'What time is it today?',
          'How day is today?'
        ],
        answer: 0,
        why: [
          null,
          'date 問的是幾月幾號。',
          'time 問的是幾點。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '⑥ 生日與節日',
      body: 'When is your birthday?（你生日是什麼時候？）→ It is on June 10.\n' +
            'Christmas is on December 25.（聖誕節在十二月二十五日。）\n' +
            '⚠ 具體日期前面用 on；只說月份時用 in（in June）。',
      viz: { type: 'classify', groups: [
        { label: '用 on（具體日期）', items: ['on June 10', 'on Monday', 'on my birthday'] },
        { label: '用 in（月份年份）', items: ['in June', 'in 2026', 'in summer'] }] },
      check: {
        q: '「我的生日在六月」應該用哪一個介系詞？',
        options: ['in June', 'on June', 'at June', 'to June'],
        answer: 0,
        why: [
          null,
          '只說月份時用 in，有具體日期才用 on。',
          'at 用於具體的時間點。',
          'to 表示方向或目標。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第7單元 序數'] = {
  intro: '第一名、第二層樓、第三個路口——順序也需要專門的說法。',
  cards: [
    {
      title: '① 基數與序數的差別',
      body: '基數（cardinal）：one、two、three，表示「數量」。\n' +
            '序數（ordinal）：first、second、third，表示「順序」。\n' +
            '⚠ 序數前面通常加 the：the first day（第一天）。',
      viz: { type: 'compareexp',
             factor: '兩種數字',
             a: { label: '基數', note: 'one、two、three：數量有多少' },
             b: { label: '序數', note: 'first、second、third：排在第幾' },
             same: ['都是數字的表達'] },
      check: {
        q: '要表達「第一名」，應該用哪一種數字？',
        options: [
          '序數 first',
          '基數 one',
          '兩者皆可',
          '不需要數字'
        ],
        answer: 0,
        why: [
          null,
          '基數表示數量而非順序。',
          '表示順序時必須用序數。',
          '名次一定要用數字表達。'
        ]
      }
    },
    {
      title: '② 前十個序數',
      body: 'first（1st）、second（2nd）、third（3rd）、fourth（4th）、fifth（5th）、\n' +
            'sixth（6th）、seventh（7th）、eighth（8th）、ninth（9th）、tenth（10th）。\n' +
            '⚠ 要注意拼法：fifth（不是 fiveth）、ninth（去掉 e）、eighth（只有一個 t）。',
      viz: { type: 'classify', groups: [
        { label: '完全不同', items: ['first', 'second', 'third'] },
        { label: '要注意拼法', items: ['fifth', 'eighth', 'ninth', 'twelfth'] },
        { label: '規則加 th', items: ['fourth', 'sixth', 'seventh', 'tenth'] }] },
      check: {
        q: '數字 9 的序數怎麼拼？',
        options: ['ninth', 'nineth', 'ninenth', 'ninthe'],
        answer: 0,
        why: [
          null,
          '要去掉 nine 的 e。',
          '這個拼法不正確。',
          '正確的拼法是去掉 e。'
        ]
      }
    },
    {
      title: '③ 較大的序數',
      body: 'eleventh、twelfth、thirteenth、…、twentieth、twenty-first。\n' +
            '⚠ 規則：整十的序數把 y 改成 ie 再加 th（twenty → twentieth）；\n' +
            '複合數字只有最後一位變序數（twenty-first）。',
      viz: { type: 'classify', groups: [
        { label: '整十', items: ['twentieth', 'thirtieth', 'fortieth'] },
        { label: '複合', items: ['twenty-first', 'twenty-second', 'thirty-third'] }] },
      check: {
        q: '數字 21 的序數是什麼？',
        options: ['twenty-first', 'twentieth-first', 'twenty-oneth', 'first-twenty'],
        answer: 0,
        why: [
          null,
          '只有最後一位要變成序數。',
          'one 的序數是 first。',
          '語序不正確，序數要放在最後一位。'
        ]
      }
    },
    {
      title: '④ 序數的用法',
      body: '日期：May 5（唸 May fifth）。\n' +
            '樓層：I live on the third floor.\n' +
            '順序：the first question（第一題）、the second time（第二次）。\n' +
            '⚠ 樓層與名次前面通常要加 the。',
      viz: { type: 'sentence', label: '樓層', items: [
        { t: 'I live', r: '主詞＋動詞' }, { t: 'on', r: '介系詞' },
        { t: 'the third floor', r: '序數＋名詞' }],
        note: '樓層用 on the ＋ 序數 ＋ floor。' },
      check: {
        q: '「我住在五樓」的正確說法是什麼？',
        options: [
          'I live on the fifth floor.',
          'I live on the five floor.',
          'I live in the fifth floor.',
          'I live on fifth floor.'
        ],
        answer: 0,
        why: [
          null,
          '樓層要用序數而不是基數。',
          '樓層用 on 而不是 in。',
          '序數前面通常要加 the。'
        ]
      }
    },
    {
      title: '⑤ 名次與比賽',
      body: 'He won first place.（他得第一名。）\n' +
            'She finished second.（她得第二名。）\n' +
            '⚠ 也可以說 the first prize（第一名的獎）。\n' +
            '運動比賽常用：first、second、third place。',
      viz: { type: 'sentence', label: '名次', items: [
        { t: 'He', r: '主詞' }, { t: 'won', r: '動詞（過去式）' },
        { t: 'first place', r: '名次' }],
        note: 'win 的過去式是 won。' },
      check: {
        q: '「她得第二名」的正確說法是什麼？',
        options: [
          'She won second place.',
          'She won two place.',
          'She won second places.',
          'She won the two.'
        ],
        answer: 0,
        why: [
          null,
          '名次要用序數而不是基數。',
          'place 在此用單數。',
          '這個說法不清楚也不自然。'
        ]
      }
    },
    {
      title: '⑥ 順序的表達',
      body: '講步驟時可以用序數：\n' +
            'First, wash your hands. Second, cut the vegetables.\n' +
            'Finally, cook them.（最後，把它們煮熟。）\n' +
            '⚠ 也可以用 first、then、next、finally 來串連步驟。',
      viz: { type: 'energyflow', steps: ['First', 'Then', 'Next', 'Finally'] },
      check: {
        q: '說明步驟時，表示「最後一步」常用哪一個字？',
        options: ['finally', 'first', 'second', 'next'],
        answer: 0,
        why: [
          null,
          'first 是第一步。',
          'second 是第二步。',
          'next 表示接下來，不是最後。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第8單元 學校科目與課表'] = {
  intro: '把課表變成英文，每天都在複習單字。',
  cards: [
    {
      title: '① 常見科目',
      body: 'Chinese（國語）、English（英語）、math（數學）、science（自然）、\n' +
            'social studies（社會）、music（音樂）、art（美術）、PE（體育）、\n' +
            'computer class（電腦課）。\n' +
            '⚠ 語言名稱（Chinese、English）首字母要大寫。',
      viz: { type: 'classify', groups: [
        { label: '學科', items: ['math', 'science', 'social studies'] },
        { label: '語言', items: ['Chinese', 'English'] },
        { label: '藝能', items: ['music', 'art', 'PE'] }] },
      check: {
        q: '下列哪一個單字的首字母一定要大寫？',
        options: ['English', 'math', 'music', 'art'],
        answer: 0,
        why: [
          null,
          '一般學科名稱不用大寫。',
          'music 是普通名詞。',
          'art 也是普通名詞。'
        ]
      }
    },
    {
      title: '② 問課表',
      body: 'What class do you have on Monday?（你星期一有什麼課？）\n' +
            '→ I have math and English.\n' +
            'What is your favorite subject?（你最喜歡哪一科？）→ I like art best.\n' +
            '⚠ subject 是「科目」，class 是「課、班級」。',
      viz: { type: 'sentence', label: '問課表', items: [
        { t: 'What class', r: '疑問詞組' }, { t: 'do you have', r: '助動詞＋主詞＋動詞' },
        { t: 'on Monday', r: '時間' }],
        note: '一般動詞的疑問句要用助動詞 do。' },
      check: {
        q: '「你最喜歡哪一科？」的正確問法是什麼？',
        options: [
          'What is your favorite subject?',
          'What your favorite subject?',
          'What do your favorite subject?',
          'Which you like subject?'
        ],
        answer: 0,
        why: [
          null,
          '句子缺少 be 動詞。',
          '這句已有 be 動詞的結構，不需要 do。',
          '這個語序不符合英文結構。'
        ]
      }
    },
    {
      title: '③ 說明喜好與理由',
      body: 'I like science because it is interesting.（我喜歡自然，因為它很有趣。）\n' +
            'I do not like math because it is difficult.\n' +
            '⚠ because 用來說明原因，後面接完整的句子。',
      viz: { type: 'sentence', label: '說原因', items: [
        { t: 'I like science', r: '主要子句' }, { t: 'because', r: '連接詞' },
        { t: 'it is interesting', r: '原因子句' }],
        note: 'because 後面要接完整的句子（有主詞與動詞）。' },
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'I like art because it is fun.',
          'I like art because fun.',
          'I like art because is fun.',
          'I like art, because.'
        ],
        answer: 0,
        why: [
          null,
          'because 後面要接完整的句子。',
          '這個句子缺少主詞，不完整。',
          '這個句子不完整。'
        ]
      }
    },
    {
      title: '④ 常用形容詞',
      body: 'interesting（有趣的）、boring（無聊的）、easy（簡單的）、\n' +
            'difficult／hard（困難的）、important（重要的）、useful（有用的）。\n' +
            '⚠ 注意：interesting 是「令人感興趣的」，\n' +
            'interested 是「感到有興趣的」（用於人）。',
      viz: { type: 'compareexp',
             factor: '兩個容易混淆的字',
             a: { label: 'interesting', note: '形容事物本身有趣' },
             b: { label: 'interested', note: '形容人對某事感到有興趣' },
             same: ['都與興趣有關'] },
      check: {
        q: '「這本書很有趣」的正確說法是什麼？',
        options: [
          'This book is interesting.',
          'This book is interested.',
          'This book interests.',
          'This book is interest.'
        ],
        answer: 0,
        why: [
          null,
          'interested 用來形容人的感受。',
          '這個句子不完整。',
          'interest 是名詞或動詞，不能直接當形容詞用。'
        ]
      }
    },
    {
      title: '⑤ 說時間與地點',
      body: 'I have English at nine on Monday.（我星期一九點有英文課。）\n' +
            'Our music class is in the music room.\n' +
            '⚠ 時間順序通常是「小到大」：at nine on Monday，\n' +
            '和中文的「星期一九點」順序相反。',
      viz: { type: 'sentence', label: '時間順序', items: [
        { t: 'I have English', r: '主要內容' }, { t: 'at nine', r: '時間（小）' },
        { t: 'on Monday', r: '時間（大）' }],
        note: '英文的時間片語通常由小到大排列。' },
      check: {
        q: '英文中同時說「幾點」與「星期幾」時，順序通常是什麼？',
        options: [
          '先說幾點，再說星期幾',
          '先說星期幾，再說幾點',
          '沒有固定順序',
          '兩者不能同時出現'
        ],
        answer: 0,
        why: [
          null,
          '英文習慣由小單位到大單位。',
          '雖有彈性，但慣例是小到大。',
          '兩者可以同時出現在句中。'
        ]
      }
    },
    {
      title: '⑥ 介紹自己的課表',
      body: '練習：\n' +
            'I have six classes on Tuesday. My first class is math.\n' +
            'I like PE best because I love sports.\n' +
            'I do not like tests, but I like learning new things.\n' +
            '⚠ but 用來表示轉折，前後意思相反。',
      viz: { type: 'sentence', label: '轉折', items: [
        { t: 'I do not like tests', r: '前半' }, { t: 'but', r: '連接詞' },
        { t: 'I like learning', r: '後半' }],
        note: 'but 用來連接意思相反的兩件事。' },
      check: {
        q: '要表達「我不喜歡考試，但我喜歡學新東西」，應該用哪一個連接詞？',
        options: ['but', 'and', 'or', 'because'],
        answer: 0,
        why: [
          null,
          'and 用於並列相同方向的意思。',
          'or 用於二選一。',
          'because 用來說明原因。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四上|第9單元 興趣與嗜好'] = {
  intro: '聊興趣是最容易打開話題的方式——不論用哪一種語言。',
  cards: [
    {
      title: '① 常見的嗜好',
      body: 'reading（閱讀）、drawing（畫畫）、singing（唱歌）、dancing（跳舞）、\n' +
            'swimming（游泳）、playing basketball（打籃球）、\n' +
            'listening to music（聽音樂）、playing video games（打電動）。\n' +
            '⚠ 嗜好多用「動詞-ing」的形式（動名詞）。',
      viz: { type: 'classify', groups: [
        { label: '靜態', items: ['reading', 'drawing', 'listening to music'] },
        { label: '動態', items: ['swimming', 'dancing', 'playing basketball'] }] },
      check: {
        q: '說明嗜好時，動詞通常用什麼形式？',
        options: [
          '動詞-ing（動名詞）',
          '動詞原形',
          '動詞過去式',
          '不需要動詞'
        ],
        answer: 0,
        why: [
          null,
          '原形動詞多用於句子的主要動詞。',
          '過去式表示已經發生的事。',
          '嗜好通常用動詞表達。'
        ]
      }
    },
    {
      title: '② 表達喜好的句型',
      body: 'I like swimming.＝ I like to swim.（兩種都可以）\n' +
            'I love reading.（我熱愛閱讀。）　I enjoy drawing.（我享受畫畫。）\n' +
            '⚠ enjoy 後面只能接動名詞（enjoy drawing），不能說 enjoy to draw。',
      viz: { type: 'compareexp',
             factor: '兩種接法',
             a: { label: 'like', note: '可以接動名詞或不定詞：like swimming／like to swim' },
             b: { label: 'enjoy', note: '只能接動名詞：enjoy swimming' },
             same: ['都用來表達喜好'] },
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'I enjoy reading books.',
          'I enjoy to read books.',
          'I enjoy read books.',
          'I am enjoy reading.'
        ],
        answer: 0,
        why: [
          null,
          'enjoy 後面不能接不定詞。',
          'enjoy 後面要接動名詞。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '③ 問興趣',
      body: 'What do you like to do in your free time?（你空閒時喜歡做什麼？）\n' +
            'What are your hobbies?（你有什麼嗜好？）\n' +
            'Do you like playing basketball?（你喜歡打籃球嗎？）\n' +
            '⚠ hobby 的複數是 hobbies（子音加 y 要去 y 加 ies）。',
      viz: { type: 'sentence', label: '問嗜好', items: [
        { t: 'What', r: '疑問詞' }, { t: 'are', r: 'be 動詞' },
        { t: 'your hobbies', r: '主詞' }],
        note: 'hobbies 是複數，所以用 are。' },
      check: {
        q: 'hobby 的複數形是什麼？',
        options: ['hobbies', 'hobbys', 'hobbyes', 'hobby'],
        answer: 0,
        why: [
          null,
          '子音加 y 結尾要去 y 加 ies。',
          '這個拼法不正確。',
          '複數形必須變化。'
        ]
      }
    },
    {
      title: '④ 頻率與程度',
      body: 'I often play basketball after school.\n' +
            'I really like music.（我真的很喜歡音樂。）\n' +
            'I like it a lot.（我很喜歡。）\n' +
            '⚠ really、very much、a lot 可以加強語氣。',
      viz: { type: 'sentence', label: '加強語氣', items: [
        { t: 'I', r: '主詞' }, { t: 'really like', r: '副詞＋動詞' },
        { t: 'music', r: '受詞' }],
        note: 'really 放在動詞前面加強語氣。' },
      check: {
        q: '要表達「我非常喜歡音樂」，下列哪一句最恰當？',
        options: [
          'I like music very much.',
          'I very like music.',
          'I like very music.',
          'I am very like music.'
        ],
        answer: 0,
        why: [
          null,
          'very 不能直接放在動詞前面。',
          '語序不正確，序數要放在最後一位。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '⑤ 談論不喜歡的事',
      body: 'I do not like getting up early.（我不喜歡早起。）\n' +
            'I hate doing the dishes.（我討厭洗碗。）\n' +
            '⚠ 表達不喜歡時語氣要注意：hate 的語氣很強，\n' +
            '一般情況說 I do not really like… 比較委婉。',
      viz: { type: 'classify', groups: [
        { label: '語氣強', items: ['hate', 'can’t stand'] },
        { label: '語氣委婉', items: ['do not really like', 'am not a fan of'] }] },
      check: {
        q: '想委婉地表達「我不太喜歡」，可以怎麼說？',
        options: [
          'I do not really like it.',
          'I hate it so much.',
          'I never want to see it.',
          'It is terrible.'
        ],
        answer: 0,
        why: [
          null,
          'hate 的語氣相當強烈。',
          '這個說法過於強硬。',
          '這是直接的負面評價。'
        ]
      }
    },
    {
      title: '⑥ 完整的自我介紹',
      body: 'Hi, I am Amy. I am ten years old.\n' +
            'I like drawing and listening to music.\n' +
            'I play the piano every Saturday. What about you?\n' +
            '⚠ play 加樂器時要加 the（play the piano），\n' +
            '但球類不加（play basketball）。',
      viz: { type: 'compareexp',
             factor: 'play 的用法',
             a: { label: '樂器', note: '要加 the：play the piano' },
             b: { label: '球類', note: '不加 the：play basketball' },
             same: ['都用動詞 play'] },
      check: {
        q: '「我彈鋼琴」的正確說法是什麼？',
        options: [
          'I play the piano.',
          'I play piano.',
          'I play a piano.',
          'I am play the piano.'
        ],
        answer: 0,
        why: [
          null,
          '樂器前面通常要加 the。',
          '這個說法指的是某一台鋼琴。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第1單元 購物與價錢'] = {
  intro: '會問價錢、會殺價、會說要哪一個——出國自助旅行就靠這一課。',
  cards: [
    {
      title: '① 問價錢',
      body: 'How much is it?（多少錢？）　How much are they?（它們多少錢？）\n' +
            'How much is this shirt?（這件襯衫多少錢？）\n' +
            '⚠ 價錢一律用 How much，不管東西可不可數。',
      viz: { type: 'sentence', label: '問價錢', items: [
        { t: 'How much', r: '疑問詞組' }, { t: 'is', r: 'be 動詞' }, { t: 'it', r: '主詞' }],
        note: '問價錢固定用 How much。',
        alt: [
          { label: '複數', items: [{ t: 'How much', r: '疑問詞組' }, { t: 'are', r: 'be 動詞' },
            { t: 'they', r: '主詞' }], note: '主詞是複數時 be 動詞要用 are。' }] },
      tip: '按按鈕比較單複數。',
      check: {
        q: '問價錢時應該用哪一個疑問詞組？',
        options: ['How much', 'How many', 'How old', 'How long'],
        answer: 0,
        why: [
          null,
          'How many 問可數名詞的數量。',
          'How old 問年齡。',
          'How long 問長度或時間。'
        ]
      }
    },
    {
      title: '② 說價錢',
      body: 'It is fifty dollars.（五十元。）　They are one hundred dollars.\n' +
            '⚠ dollar 有複數：one dollar、two dollars。\n' +
            '台幣可以說 NT dollars 或直接說 dollars。',
      viz: { type: 'sentence', label: '說價錢', items: [
        { t: 'It', r: '主詞' }, { t: 'is', r: 'be 動詞' }, { t: 'fifty dollars', r: '價錢' }],
        note: '金額大於一時 dollar 要加 s。' },
      check: {
        q: '「二十元」的正確說法是什麼？',
        options: [
          'twenty dollars',
          'twenty dollar',
          'twentieth dollars',
          'twenty a dollar'
        ],
        answer: 0,
        why: [
          null,
          '大於一時要用複數 dollars。',
          '金額要用基數而不是序數。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '③ 購物用語',
      body: '店員：Can I help you?／May I help you?（需要幫忙嗎？）\n' +
            '顧客：I am just looking, thanks.（我只是看看，謝謝。）\n' +
            'I am looking for a T-shirt.（我在找一件 T 恤。）\n' +
            '⚠ look for 是「尋找」，look at 是「看著」。',
      viz: { type: 'compareexp',
             factor: '兩個相似的片語',
             a: { label: 'look for', note: '尋找某樣東西' },
             b: { label: 'look at', note: '注視某樣東西' },
             same: ['都以 look 開頭'] },
      check: {
        q: '「我在找一雙鞋」的正確說法是什麼？',
        options: [
          'I am looking for a pair of shoes.',
          'I am looking at a pair of shoes.',
          'I am looking a pair of shoes.',
          'I look for shoes now.'
        ],
        answer: 0,
        why: [
          null,
          'look at 是注視而不是尋找。',
          'look 後面需要適當的介系詞。',
          '此刻正在進行的動作要用進行式。'
        ]
      }
    },
    {
      title: '④ 選擇與比較',
      body: 'Do you have a bigger one?（有大一點的嗎？）\n' +
            'This one is too expensive.（這個太貴了。）\n' +
            'Do you have anything cheaper?（有便宜一點的嗎？）\n' +
            '⚠ one 用來代替前面提過的名詞，避免重複。',
      viz: { type: 'sentence', label: '用 one 代替', items: [
        { t: 'Do you have', r: '疑問句' }, { t: 'a bigger', r: '比較級' },
        { t: 'one', r: '代替名詞' }],
        note: 'one 代替前面提過的名詞，避免重複。' },
      check: {
        q: '句子中的 one 有什麼作用？',
        options: [
          '代替前面提過的名詞，避免重複',
          '表示數字一',
          '表示唯一',
          '沒有任何意義'
        ],
        answer: 0,
        why: [
          null,
          '這裡的 one 不是數字。',
          '它不是強調唯一。',
          '它有明確的替代功能。'
        ]
      }
    },
    {
      title: '⑤ 付款與結帳',
      body: 'I will take it.（我要買這個。）\n' +
            'How would you like to pay?（您要怎麼付款？）\n' +
            'Cash or credit card?（現金還是信用卡？）\n' +
            'Here is your change.（找您的零錢。）\n' +
            '⚠ take 在購物情境中是「買下」的意思。',
      viz: { type: 'energyflow', steps: ['挑選', '詢問價錢', '決定購買', '結帳付款'] },
      check: {
        q: '決定要買某樣東西時，可以說什麼？',
        options: [
          'I will take it.',
          'I will look at it.',
          'I take it away.',
          'I am it.'
        ],
        answer: 0,
        why: [
          null,
          '這是表示要看看而不是購買。',
          '這個說法容易被誤解為拿走。',
          '這個句子沒有意義。'
        ]
      }
    },
    {
      title: '⑥ 完整的購物對話',
      body: 'A: May I help you?\n' +
            'B: Yes. How much is this shirt?\n' +
            'A: It is three hundred dollars.\n' +
            'B: That is a little expensive. Do you have anything cheaper?\n' +
            '⚠ a little（有一點）可以讓語氣柔和，比直接說 too expensive 客氣。',
      viz: { type: 'sentence', label: '委婉表達', items: [
        { t: 'That is', r: '主詞＋be' }, { t: 'a little', r: '程度（委婉）' },
        { t: 'expensive', r: '形容詞' }],
        note: 'a little 讓語氣比較委婉。' },
      check: {
        q: '想委婉地表示「有點貴」，可以怎麼說？',
        options: [
          'That is a little expensive.',
          'That is too expensive!',
          'It is very very expensive.',
          'You are too expensive.'
        ],
        answer: 0,
        why: [
          null,
          'too 的語氣比較直接。',
          '重複 very 顯得誇張。',
          '貴的是商品而不是店員。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第2單元 城市地點與方向'] = {
  intro: '會問路、會指路——這是在陌生城市生存的基本能力。',
  cards: [
    {
      title: '① 城市裡的地方',
      body: 'school（學校）、hospital（醫院）、bank（銀行）、post office（郵局）、\n' +
            'library（圖書館）、park（公園）、supermarket（超市）、\n' +
            'restaurant（餐廳）、bus stop（公車站）、train station（火車站）。',
      viz: { type: 'classify', groups: [
        { label: '公共設施', items: ['school', 'hospital', 'library', 'post office'] },
        { label: '商業', items: ['bank', 'supermarket', 'restaurant'] },
        { label: '交通', items: ['bus stop', 'train station'] }] },
      check: {
        q: '「郵局」的英文是什麼？',
        options: ['post office', 'bank', 'library', 'station'],
        answer: 0,
        why: [
          null,
          'bank 是銀行。',
          'library 是圖書館。',
          'station 是車站。'
        ]
      }
    },
    {
      title: '② 問路',
      body: 'Excuse me, where is the post office?（不好意思，郵局在哪裡？）\n' +
            'How can I get to the train station?（我要怎麼到火車站？）\n' +
            'Is there a bank near here?（這附近有銀行嗎？）\n' +
            '⚠ 開口前先說 Excuse me 比較有禮貌。',
      viz: { type: 'sentence', label: '問路', items: [
        { t: 'Excuse me', r: '禮貌開場' }, { t: 'where is', r: '疑問詞＋be' },
        { t: 'the post office', r: '目的地' }],
        note: '先說 Excuse me，再問問題。' },
      check: {
        q: '向陌生人問路時，開口前最好先說什麼？',
        options: [
          'Excuse me.',
          'Hey!',
          'Sorry.',
          'Goodbye.'
        ],
        answer: 0,
        why: [
          null,
          '這樣的叫法不夠禮貌。',
          'Sorry 用於做錯事道歉。',
          '這是道別用語，不適合開場。'
        ]
      }
    },
    {
      title: '③ 指路用語',
      body: 'Go straight.（直走。）　Turn left／right.（左轉／右轉。）\n' +
            'Go straight for two blocks.（直走兩個街區。）\n' +
            'It is on your left.（它在你的左手邊。）\n' +
            '⚠ 這些都是祈使句，直接用動詞開頭。',
      viz: { type: 'sentence', label: '指路', items: [
        { t: 'Turn', r: '動詞（祈使）' }, { t: 'left', r: '方向' },
        { t: 'at the corner', r: '地點' }],
        note: '指路時用祈使句，主詞 you 省略。' },
      check: {
        q: '「在轉角右轉」的正確說法是什麼？',
        options: [
          'Turn right at the corner.',
          'You turn right the corner.',
          'Turn to right corner.',
          'Right turn corner.'
        ],
        answer: 0,
        why: [
          null,
          '指路通常用祈使句，不加主詞。',
          '這個說法的介系詞用法不正確。',
          '這個語序不完整。'
        ]
      }
    },
    {
      title: '④ 位置的描述',
      body: 'It is next to the bank.（它在銀行旁邊。）\n' +
            'It is across from the park.（它在公園對面。）\n' +
            'It is between the school and the library.（它在學校和圖書館之間。）\n' +
            '⚠ between A and B 是固定用法，中間用 and 連接。',
      viz: { type: 'classify', groups: [
        { label: '旁邊', items: ['next to', 'beside', 'near'] },
        { label: '對面', items: ['across from', 'opposite'] },
        { label: '之間', items: ['between A and B'] }] },
      check: {
        q: '「在銀行和郵局之間」的正確說法是什麼？',
        options: [
          'between the bank and the post office',
          'between the bank or the post office',
          'between the bank with the post office',
          'in the bank and the post office'
        ],
        answer: 0,
        why: [
          null,
          'between 要搭配 and 而不是 or。',
          'between 的固定搭配是 and。',
          'in 表示在裡面，語意不符。'
        ]
      }
    },
    {
      title: '⑤ 距離與交通方式',
      body: 'It is about ten minutes on foot.（走路大約十分鐘。）\n' +
            'You can take the bus.（你可以搭公車。）\n' +
            '⚠ 交通方式：by bus、by train、by car、on foot（走路）。\n' +
            '注意 on foot 不是 by foot。',
      viz: { type: 'classify', groups: [
        { label: '用 by', items: ['by bus', 'by train', 'by car', 'by bike'] },
        { label: '例外', items: ['on foot'] }] },
      check: {
        q: '「走路去」的正確說法是什麼？',
        options: ['on foot', 'by foot', 'with foot', 'in foot'],
        answer: 0,
        why: [
          null,
          '這是常見的錯誤，正確用法是 on foot。',
          'with 不用於交通方式。',
          'in 不用於這個片語。'
        ]
      }
    },
    {
      title: '⑥ 完整的問路對話',
      body: 'A: Excuse me, how can I get to the library?\n' +
            'B: Go straight for two blocks and turn left. It is on your right.\n' +
            'A: How long does it take?　B: About five minutes on foot.\n' +
            'A: Thank you very much!　B: You are welcome.\n' +
            '⚠ How long does it take? 是問「要花多久時間」。',
      viz: { type: 'energyflow', steps: ['Excuse me 開場', '說出目的地', '聽指示', '道謝'] },
      check: {
        q: '要問「要花多久時間？」應該怎麼說？',
        options: [
          'How long does it take?',
          'How far is it take?',
          'How much time take?',
          'How long is it takes?'
        ],
        answer: 0,
        why: [
          null,
          '這個句子的結構不正確。',
          '句子缺少必要的助動詞與主詞。',
          '一個句子不能有兩個動詞變化。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第3單元 食物與飲食習慣'] = {
  intro: '吃什麼、怎麼吃、喜歡什麼口味——飲食是最容易聊起來的話題。',
  cards: [
    {
      title: '① 三餐與食物',
      body: 'breakfast（早餐）、lunch（午餐）、dinner（晚餐）、snack（點心）。\n' +
            '⚠ 三餐前面通常不加冠詞：have breakfast（吃早餐），\n' +
            '不說 have a breakfast。',
      viz: { type: 'sentence', label: '吃三餐', items: [
        { t: 'I', r: '主詞' }, { t: 'have', r: '動詞' }, { t: 'breakfast', r: '受詞（不加冠詞）' },
        { t: 'at seven', r: '時間' }],
        note: '三餐名稱前面通常不加冠詞。' },
      check: {
        q: '「我七點吃早餐」的正確說法是什麼？',
        options: [
          'I have breakfast at seven.',
          'I have a breakfast at seven.',
          'I eat the breakfast at seven.',
          'I am have breakfast at seven.'
        ],
        answer: 0,
        why: [
          null,
          '三餐前面通常不加冠詞。',
          '這裡也不需要加 the。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '② 可數與不可數',
      body: '可數：an apple、two eggs、three sandwiches。\n' +
            '不可數：rice、bread、water、milk、soup、meat。\n' +
            '⚠ 不可數名詞要用容器或單位來計量：\n' +
            'a bowl of rice、a piece of bread、a glass of water。',
      viz: { type: 'classify', groups: [
        { label: '可數', items: ['apple', 'egg', 'sandwich', 'cookie'] },
        { label: '不可數', items: ['rice', 'bread', 'water', 'meat'] },
        { label: '計量單位', items: ['a bowl of', 'a piece of', 'a glass of', 'a cup of'] }] },
      check: {
        q: '「兩碗飯」的正確說法是什麼？',
        options: [
          'two bowls of rice',
          'two rices',
          'two rice',
          'two bowl of rices'
        ],
        answer: 0,
        why: [
          null,
          '不可數名詞沒有複數形。',
          '不可數名詞不能直接用數字修飾。',
          'bowl 要用複數，rice 則不加 s。'
        ]
      }
    },
    {
      title: '③ 表達飲食喜好',
      body: 'I like noodles.（我喜歡麵。）\n' +
            'I do not like carrots.（我不喜歡紅蘿蔔。）\n' +
            'My favorite food is dumplings.（我最喜歡的食物是水餃。）\n' +
            '⚠ 表達喜歡「某一類」食物時，可數名詞用複數。',
      viz: { type: 'sentence', label: '最愛的食物', items: [
        { t: 'My favorite food', r: '主詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'dumplings', r: '補語' }],
        note: '這個句型用來說明最喜歡的東西。' },
      check: {
        q: '要說「我最喜歡的食物是水餃」，正確的說法是什麼？',
        options: [
          'My favorite food is dumplings.',
          'My favorite food are dumplings.',
          'I favorite dumplings.',
          'My favorite is food dumplings.'
        ],
        answer: 0,
        why: [
          null,
          '主詞 food 是單數，用 is。',
          'favorite 是形容詞，不能當動詞。',
          '這個語序不通順。'
        ]
      }
    },
    {
      title: '④ 口味與描述',
      body: 'sweet（甜）、salty（鹹）、sour（酸）、spicy（辣）、bitter（苦）。\n' +
            'delicious（美味的）、fresh（新鮮的）、healthy（健康的）。\n' +
            '⚠ 說「太辣」用 too spicy；說「有點辣」用 a little spicy。',
      viz: { type: 'classify', groups: [
        { label: '味道', items: ['sweet', 'salty', 'sour', 'spicy', 'bitter'] },
        { label: '評價', items: ['delicious', 'fresh', 'healthy'] }] },
      check: {
        q: '「這道菜有點辣」的正確說法是什麼？',
        options: [
          'This dish is a little spicy.',
          'This dish is too spicy a little.',
          'This dish little spicy.',
          'This dish is spicy little.'
        ],
        answer: 0,
        why: [
          null,
          'too 與 a little 的語氣互相矛盾。',
          '句子缺少 be 動詞。',
          '程度副詞要放在形容詞前面。'
        ]
      }
    },
    {
      title: '⑤ 健康的飲食',
      body: 'eat more vegetables（多吃蔬菜）、drink enough water（喝足夠的水）、\n' +
            'less junk food（少吃垃圾食物）、have a balanced diet（均衡飲食）。\n' +
            '⚠ more／less 用來比較：more vegetables、less sugar。',
      viz: { type: 'classify', groups: [
        { label: '多吃', items: ['vegetables', 'fruit', 'water'] },
        { label: '少吃', items: ['junk food', 'sugar', 'fried food'] }] },
      check: {
        q: '「多吃蔬菜」的正確說法是什麼？',
        options: [
          'Eat more vegetables.',
          'Eat many vegetable.',
          'Eat vegetables more much.',
          'More eat vegetables.'
        ],
        answer: 0,
        why: [
          null,
          '名詞要用複數，而且 many 在此不自然。',
          '這個語序不正確。',
          '祈使句要以動詞開頭。'
        ]
      }
    },
    {
      title: '⑥ 談論飲食習慣',
      body: 'A: What do you usually have for breakfast?\n' +
            'B: I usually have bread and milk. How about you?\n' +
            'A: I have rice and eggs. I do not like bread.\n' +
            '⚠ for breakfast（當早餐）是固定用法。',
      viz: { type: 'sentence', label: '問習慣', items: [
        { t: 'What', r: '疑問詞' }, { t: 'do you usually have', r: '助動詞＋主詞＋副詞＋動詞' },
        { t: 'for breakfast', r: '固定片語' }],
        note: 'for breakfast 表示「當作早餐」。' },
      check: {
        q: '「當早餐」的正確說法是什麼？',
        options: ['for breakfast', 'to breakfast', 'in breakfast', 'at breakfast time only'],
        answer: 0,
        why: [
          null,
          'to 不用於這個片語。',
          'in 不用於三餐。',
          '這個說法過於冗長也不自然。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第4單元 運動與休閒'] = {
  intro: '運動的英文特別實用——因為全世界都在玩同樣的球。',
  cards: [
    {
      title: '① 常見運動',
      body: 'basketball（籃球）、baseball（棒球）、soccer（足球）、\n' +
            'volleyball（排球）、tennis（網球）、badminton（羽球）、\n' +
            'swimming（游泳）、running（跑步）。\n' +
            '⚠ 球類前面不加 the：play basketball。',
      viz: { type: 'classify', groups: [
        { label: '球類（用 play）', items: ['basketball', 'baseball', 'soccer', 'tennis'] },
        { label: '非球類（用 go）', items: ['swimming', 'running', 'hiking'] }] },
      check: {
        q: '「打籃球」的正確說法是什麼？',
        options: [
          'play basketball',
          'play the basketball',
          'go basketball',
          'do basketball'
        ],
        answer: 0,
        why: [
          null,
          '球類前面不加 the。',
          'go 用於 -ing 形的活動，例如 go swimming。',
          'do 不用於球類運動。'
        ]
      }
    },
    {
      title: '② play、go、do 的搭配',
      body: 'play ＋ 球類（play soccer）。\n' +
            'go ＋ 動詞-ing（go swimming、go running、go shopping）。\n' +
            'do ＋ 某些運動（do yoga、do exercise）。\n' +
            '⚠ 這是固定搭配，要整組記起來。',
      viz: { type: 'classify', groups: [
        { label: 'play', items: ['play soccer', 'play tennis', 'play the piano'] },
        { label: 'go', items: ['go swimming', 'go hiking', 'go shopping'] },
        { label: 'do', items: ['do yoga', 'do exercise'] }] },
      check: {
        q: '「去游泳」的正確說法是什麼？',
        options: [
          'go swimming',
          'play swimming',
          'do swimming',
          'go swim'
        ],
        answer: 0,
        why: [
          null,
          'play 用於球類。',
          'do 通常用於瑜伽或運動這類名詞。',
          'go 後面要接動詞-ing 形。'
        ]
      }
    },
    {
      title: '③ 談論運動習慣',
      body: 'I play basketball twice a week.（我一週打兩次籃球。）\n' +
            'How often do you exercise?（你多常運動？）\n' +
            'I go swimming every Sunday.\n' +
            '⚠ 頻率的說法：once／twice／three times ＋ a week／a month。',
      viz: { type: 'sentence', label: '運動頻率', items: [
        { t: 'I play basketball', r: '主要內容' }, { t: 'twice a week', r: '頻率' }],
        note: '頻率片語通常放在句尾。' },
      check: {
        q: '「一個月三次」的正確說法是什麼？',
        options: [
          'three times a month',
          'three time a month',
          'thrice month',
          'three a month times'
        ],
        answer: 0,
        why: [
          null,
          'time 要用複數 times。',
          '這個說法在現代英文中很少使用。',
          '語序不正確，次數要放在前面。'
        ]
      }
    },
    {
      title: '④ 休閒活動',
      body: 'watch TV（看電視）、read books（看書）、listen to music（聽音樂）、\n' +
            'play video games（打電動）、go to the movies（看電影）、\n' +
            'take a walk（散步）、chat with friends（和朋友聊天）。\n' +
            '⚠ listen 後面要加 to：listen to music（不能省略）。',
      viz: { type: 'classify', groups: [
        { label: '室內', items: ['watch TV', 'read books', 'play video games'] },
        { label: '室外', items: ['take a walk', 'go to the movies', 'go hiking'] }] },
      check: {
        q: '「聽音樂」的正確說法是什麼？',
        options: [
          'listen to music',
          'listen music',
          'hear to music',
          'listen the music'
        ],
        answer: 0,
        why: [
          null,
          'listen 後面一定要加 to。',
          'hear 是聽見，語意不同也不加 to。',
          'listen 後面要用 to 而不是 the。'
        ]
      }
    },
    {
      title: '⑤ 邀約與回應',
      body: 'Do you want to play basketball?（你想打籃球嗎？）\n' +
            'Let’s go swimming!（我們去游泳吧！）\n' +
            '回應：Sure!／Sounds good!／Sorry, I can’t.\n' +
            '⚠ Let’s 是 Let us 的縮寫，後面接原形動詞。',
      viz: { type: 'sentence', label: '提議', items: [
        { t: 'Let’s', r: '提議' }, { t: 'go', r: '原形動詞' }, { t: 'swimming', r: '活動' }],
        note: 'Let’s 後面要接原形動詞。' },
      check: {
        q: '「我們去打棒球吧」的正確說法是什麼？',
        options: [
          'Let’s play baseball.',
          'Let’s to play baseball.',
          'Let’s playing baseball.',
          'Let’s plays baseball.'
        ],
        answer: 0,
        why: [
          null,
          'Let’s 後面不加 to。',
          'Let’s 後面要用原形動詞。',
          '原形動詞不加 s。'
        ]
      }
    },
    {
      title: '⑥ 運動的好處',
      body: 'Exercise is good for your health.（運動對健康有益。）\n' +
            'It helps you sleep better.（它幫助你睡得更好。）\n' +
            '⚠ be good for（對…有益）是固定用法；\n' +
            'help 後面可以直接接原形動詞。',
      viz: { type: 'sentence', label: '說好處', items: [
        { t: 'Exercise', r: '主詞' }, { t: 'is good for', r: '固定片語' },
        { t: 'your health', r: '受詞' }],
        note: 'be good for 表示對某事有益。' },
      check: {
        q: '「運動對健康有益」的正確說法是什麼？',
        options: [
          'Exercise is good for your health.',
          'Exercise is good to your health.',
          'Exercise good for health.',
          'Exercise is well for your health.'
        ],
        answer: 0,
        why: [
          null,
          '固定用法是 good for 而不是 good to。',
          '句子缺少 be 動詞。',
          'well 是副詞，這裡要用形容詞 good。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第5單元 服裝與外表描述'] = {
  intro: '描述一個人長什麼樣、穿什麼衣服——這在找人、購物時都用得上。',
  cards: [
    {
      title: '① 服裝單字',
      body: 'shirt、T-shirt、sweater（毛衣）、jacket（夾克）、coat（大衣）、\n' +
            'pants（長褲）、shorts（短褲）、skirt（裙子）、dress（洋裝）、\n' +
            'shoes、socks、hat、cap（鴨舌帽）。\n' +
            '⚠ 成雙的衣物用複數：pants、shorts、shoes、socks。',
      viz: { type: 'classify', groups: [
        { label: '上半身', items: ['shirt', 'sweater', 'jacket', 'coat'] },
        { label: '下半身', items: ['pants', 'shorts', 'skirt'] },
        { label: '配件', items: ['shoes', 'socks', 'hat', 'glasses'] }] },
      check: {
        q: '下列哪一個單字在英文中習慣用複數形？',
        options: ['pants', 'shirt', 'skirt', 'coat'],
        answer: 0,
        why: [
          null,
          'shirt 是單數可數名詞。',
          'skirt 也是單數形。',
          'coat 同樣是單數形。'
        ]
      }
    },
    {
      title: '② 描述外表',
      body: 'tall（高）／short（矮）、big／small、young（年輕）／old（年長）、\n' +
            'long hair（長髮）／short hair（短髮）、\n' +
            'He has brown eyes.（他有棕色的眼睛。）\n' +
            '⚠ 描述五官與髮型常用 have／has。',
      viz: { type: 'sentence', label: '描述外表', items: [
        { t: 'She', r: '主詞' }, { t: 'has', r: '動詞' }, { t: 'long hair', r: '受詞' }],
        note: '描述特徵時常用 have 或 has。' },
      check: {
        q: '「她有長頭髮」的正確說法是什麼？',
        options: [
          'She has long hair.',
          'She have long hair.',
          'She is long hair.',
          'She has long hairs.'
        ],
        answer: 0,
        why: [
          null,
          '第三人稱單數要用 has。',
          '這裡要用 have 而不是 be 動詞。',
          'hair 在指整頭頭髮時是不可數名詞。'
        ]
      }
    },
    {
      title: '③ 穿著的說法',
      body: 'He is wearing a blue shirt.（他穿著藍色襯衫。）\n' +
            'She has on a red dress.（她穿著紅色洋裝。）\n' +
            '⚠ wear 表示「穿著的狀態」，常用進行式來描述此刻的穿著。\n' +
            'put on 則是「穿上」的動作。',
      viz: { type: 'sentence', label: '描述穿著', items: [
        { t: 'He', r: '主詞' }, { t: 'is wearing', r: '進行式' },
        { t: 'a blue shirt', r: '受詞' }],
        note: '描述此刻的穿著常用現在進行式。' },
      check: {
        q: '要描述某人「現在穿著什麼」，最常用的說法是什麼？',
        options: [
          'He is wearing…',
          'He wears… only',
          'He puts on…',
          'He is put on…'
        ],
        answer: 0,
        why: [
          null,
          '一般式表示習慣而非此刻。',
          'put on 是穿上的動作。',
          '這個句子的動詞形式不正確。'
        ]
      }
    },
    {
      title: '④ 尺寸與顏色',
      body: 'Do you have this in a bigger size?（有大一號的嗎？）\n' +
            'What size do you wear?（你穿幾號？）\n' +
            'I wear size M.（我穿 M 號。）\n' +
            '⚠ 形容詞順序：a big red bag（大小在顏色前面）。',
      viz: { type: 'sentence', label: '形容詞順序', items: [
        { t: 'a', r: '冠詞' }, { t: 'big', r: '大小' }, { t: 'red', r: '顏色' },
        { t: 'bag', r: '名詞' }],
        note: '大小通常放在顏色前面。' },
      check: {
        q: '「一個大的紅色書包」的正確順序是什麼？',
        options: [
          'a big red bag',
          'a red big bag',
          'a bag big red',
          'big a red bag'
        ],
        answer: 0,
        why: [
          null,
          '大小通常放在顏色前面。',
          '形容詞要放在名詞前面。',
          '冠詞要放在最前面。'
        ]
      }
    },
    {
      title: '⑤ 詢問與稱讚',
      body: 'You look nice today!（你今天看起來很好看！）\n' +
            'I like your jacket.（我喜歡你的外套。）\n' +
            '回應：Thank you.／Thanks!\n' +
            '⚠ 被稱讚時直接說謝謝就好，不需要否認。',
      viz: { type: 'sentence', label: '稱讚', items: [
        { t: 'You', r: '主詞' }, { t: 'look', r: '動詞' }, { t: 'nice', r: '形容詞' },
        { t: 'today', r: '時間' }],
        note: 'look 後面直接接形容詞，表示「看起來如何」。' },
      check: {
        q: '別人稱讚你 You look nice today! 時，最恰當的回應是什麼？',
        options: [
          'Thank you!',
          'No, I do not.',
          'You are wrong.',
          'Why do you say that?'
        ],
        answer: 0,
        why: [
          null,
          '英語文化中通常直接道謝而非否認。',
          '這個回應顯得不友善。',
          '這個回應會讓對方尷尬。'
        ]
      }
    },
    {
      title: '⑥ 找人的描述',
      body: 'My brother is tall and thin. He has short black hair.\n' +
            'He is wearing a blue jacket and jeans.\n' +
            '⚠ 描述一個人的順序：身材 → 五官髮型 → 穿著。\n' +
            '這樣別人才容易在人群中找到他。',
      viz: { type: 'energyflow', steps: ['身高體型', '髮型五官', '今天的穿著', '其他特徵'] },
      check: {
        q: '要讓別人在人群中認出某個人，描述時最好包含什麼？',
        options: [
          '身材、髮型與今天的穿著等具體特徵',
          '只說他的名字',
          '只說他的個性',
          '只說他的年齡'
        ],
        answer: 0,
        why: [
          null,
          '名字無法幫助辨認外觀。',
          '個性從外觀上看不出來，無法幫助辨認。',
          '年齡只是其中一項資訊。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第6單元 電話與邀約用語'] = {
  intro: '講電話看不到對方的表情，所以固定用語特別重要。',
  cards: [
    {
      title: '① 接電話',
      body: 'Hello, this is Amy.（喂，我是 Amy。）\n' +
            'May I speak to Ben?（請問 Ben 在嗎？）\n' +
            '⚠ 電話中介紹自己用 this is（不是 I am）；\n' +
            '問對方是誰用 Who is this?（不是 Who are you?）',
      viz: { type: 'sentence', label: '電話用語', items: [
        { t: 'This', r: '主詞（電話專用）' }, { t: 'is', r: 'be 動詞' },
        { t: 'Amy', r: '名字' }],
        note: '電話中自我介紹固定用 This is。' },
      check: {
        q: '在電話中要說「我是 Amy」，正確的說法是什麼？',
        options: [
          'This is Amy.',
          'I am Amy speaking now here.',
          'Here is Amy.',
          'It is me Amy.'
        ],
        answer: 0,
        why: [
          null,
          '這個說法冗長且不自然。',
          '這不是電話中的慣用說法。',
          '這個說法不符合電話禮儀的慣例。'
        ]
      }
    },
    {
      title: '② 轉接與留言',
      body: 'Just a moment, please.（請稍等。）\n' +
            'He is not here right now.（他現在不在。）\n' +
            'Can I take a message?（要留言嗎？）\n' +
            'Can I call you back later?（我可以晚點回電嗎？）\n' +
            '⚠ call back 是「回電」。',
      viz: { type: 'classify', groups: [
        { label: '請對方等', items: ['Just a moment', 'Hold on, please'] },
        { label: '留言', items: ['Can I take a message?', 'Please tell him to call me.'] }] },
      check: {
        q: '對方要找的人不在時，可以說什麼？',
        options: [
          'He is not here right now. Can I take a message?',
          'Goodbye.',
          'I do not know him.',
          'Call again.'
        ],
        answer: 0,
        why: [
          null,
          '直接掛電話不禮貌。',
          '這個回應沒有幫助對方。',
          '這個說法語氣過於生硬。'
        ]
      }
    },
    {
      title: '③ 提出邀約',
      body: 'Would you like to go to the movies?（你想去看電影嗎？）\n' +
            'Do you want to play basketball this afternoon?\n' +
            'How about going to the park?（去公園怎麼樣？）\n' +
            '⚠ How about 後面接動詞-ing 形。',
      viz: { type: 'compareexp',
             factor: '三種邀約說法',
             a: { label: 'Would you like to…', note: '較禮貌，後面接原形動詞' },
             b: { label: 'How about…', note: '較口語，後面接動詞-ing' },
             same: ['都是提出邀請'] },
      check: {
        q: '「去公園怎麼樣？」的正確說法是什麼？',
        options: [
          'How about going to the park?',
          'How about to go to the park?',
          'How about go to the park?',
          'How about we going park?'
        ],
        answer: 0,
        why: [
          null,
          'How about 後面不接不定詞。',
          'How about 後面要接動詞-ing。',
          '這個句子的結構不完整。'
        ]
      }
    },
    {
      title: '④ 接受與婉拒',
      body: '接受：Sure!／That sounds great!／I would love to.\n' +
            '婉拒：Sorry, I can’t. I have to study.\n' +
            'Maybe next time.（下次吧。）\n' +
            '⚠ 婉拒時說明理由會比較有禮貌。',
      viz: { type: 'classify', groups: [
        { label: '接受', items: ['Sure!', 'Sounds great!', 'I would love to.'] },
        { label: '婉拒', items: ['Sorry, I can’t.', 'Maybe next time.'] }] },
      check: {
        q: '要婉拒邀約時，比較有禮貌的做法是什麼？',
        options: [
          '說抱歉並簡短說明原因',
          '直接說不要',
          '不回應',
          '假裝沒聽到'
        ],
        answer: 0,
        why: [
          null,
          '直接拒絕容易顯得不友善。',
          '不回應會讓對方尷尬。',
          '忽略對方是不禮貌的。'
        ]
      }
    },
    {
      title: '⑤ 約時間與地點',
      body: 'What time shall we meet?（我們幾點見？）\n' +
            'Let’s meet at three at the school gate.（三點在校門口見。）\n' +
            'See you then!（到時候見！）\n' +
            '⚠ 時間用 at，地點也可以用 at（表示某個定點）。',
      viz: { type: 'sentence', label: '約定', items: [
        { t: 'Let’s meet', r: '提議' }, { t: 'at three', r: '時間' },
        { t: 'at the school gate', r: '地點' }],
        note: '時間與定點都可以用介系詞 at。' },
      check: {
        q: '「三點在校門口見」的正確說法是什麼？',
        options: [
          'Let’s meet at three at the school gate.',
          'Let’s meet in three in the school gate.',
          'Let’s meet on three on the school gate.',
          'Let’s to meet at three.'
        ],
        answer: 0,
        why: [
          null,
          '時間點與定點都用 at。',
          'on 用於日期或表面。',
          'Let’s 後面不加 to。'
        ]
      }
    },
    {
      title: '⑥ 完整的電話對話',
      body: 'A: Hello, this is Amy. May I speak to Ben?\n' +
            'B: This is Ben. What’s up?\n' +
            'A: Would you like to play basketball this afternoon?\n' +
            'B: Sure! What time?　A: How about three?　B: OK, see you then!\n' +
            '⚠ What’s up? 是很口語的「怎麼了？有什麼事？」',
      viz: { type: 'energyflow', steps: ['自我介紹', '說明來意', '討論細節', '確認並道別'] },
      check: {
        q: '打電話給別人時，第一步通常要做什麼？',
        options: [
          '先自我介紹並說明要找誰',
          '直接說出要求',
          '先問對方在做什麼',
          '直接掛掉'
        ],
        answer: 0,
        why: [
          null,
          '沒有自我介紹會讓對方困惑。',
          '這樣的開場不夠清楚。',
          '這樣完全無法溝通。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第7單元 祈使句與指示'] = {
  intro: '要別人做某件事、或告訴別人怎麼做——用的都是祈使句。',
  cards: [
    {
      title: '① 祈使句的形式',
      body: '直接用「原形動詞」開頭，主詞 you 省略：\n' +
            'Open the door.（開門。）　Sit down.（坐下。）　Be quiet.（安靜。）\n' +
            '⚠ be 動詞的祈使句用 Be（不是 Are）：Be careful!（小心！）',
      viz: { type: 'sentence', label: '祈使句', items: [
        { t: '(You)', r: '主詞省略' }, { t: 'Open', r: '原形動詞' },
        { t: 'the door', r: '受詞' }],
        note: '祈使句以原形動詞開頭，主詞 you 省略。' },
      tip: '這個元件把句子拆成一格一格。',
      check: {
        q: '「小心！」的正確說法是什麼？',
        options: [
          'Be careful!',
          'Are careful!',
          'You are careful!',
          'Being careful!'
        ],
        answer: 0,
        why: [
          null,
          '祈使句要用原形 be。',
          '這是陳述句而不是提醒。',
          '這個形式不能單獨當句子。'
        ]
      }
    },
    {
      title: '② 否定的祈使句',
      body: '在動詞前面加 Do not（Don’t）：\n' +
            'Do not run.（不要跑。）　Don’t be late.（不要遲到。）\n' +
            '⚠ 就算是 be 動詞也要用 Don’t be，不能說 Be not。',
      viz: { type: 'sentence', label: '否定祈使句', items: [
        { t: 'Do not', r: '否定' }, { t: 'run', r: '原形動詞' },
        { t: 'in the hallway', r: '地點' }],
        note: '否定祈使句在動詞前加 Do not。' },
      check: {
        q: '「不要遲到」的正確說法是什麼？',
        options: [
          'Don’t be late.',
          'Be not late.',
          'Not be late.',
          'Don’t are late.'
        ],
        answer: 0,
        why: [
          null,
          '否定要用 Don’t 開頭。',
          '這個句子缺少必要的助動詞。',
          'Don’t 後面要接原形 be。'
        ]
      }
    },
    {
      title: '③ 讓語氣更客氣',
      body: '加 please：Please sit down.／Sit down, please.\n' +
            '用問句：Could you open the window?（可以請你開窗嗎？）\n' +
            '⚠ 直接的祈使句對長輩或不熟的人可能顯得強硬，\n' +
            '加上 please 或改用問句會禮貌得多。',
      viz: { type: 'compareexp',
             factor: '語氣的差別',
             a: { label: '祈使句', note: 'Open the window. 直接、適合熟人或緊急情況' },
             b: { label: '問句', note: 'Could you open the window? 較客氣' },
             same: ['都是請對方做某事'] },
      check: {
        q: '要請不熟的人幫忙開窗，比較恰當的說法是什麼？',
        options: [
          'Could you open the window, please?',
          'Open the window!',
          'You open the window.',
          'Window!'
        ],
        answer: 0,
        why: [
          null,
          '直接命令對不熟的人不禮貌。',
          '這個說法像在指使人。',
          '只說名詞無法完整表達請求。'
        ]
      }
    },
    {
      title: '④ 常見的指示與標語',
      body: 'Turn left.（左轉）　Push／Pull（推／拉）　\n' +
            'Keep quiet.（保持安靜）　No smoking.（禁止吸菸）\n' +
            'Do not touch.（請勿觸摸）　Watch your step.（小心台階）\n' +
            '⚠ 標語常用 No ＋ 動名詞：No parking、No swimming。',
      viz: { type: 'classify', groups: [
        { label: '要做', items: ['Keep quiet', 'Watch your step', 'Line up'] },
        { label: '不要做', items: ['No smoking', 'Do not touch', 'No parking'] }] },
      check: {
        q: '「禁止停車」的標語通常怎麼寫？',
        options: [
          'No parking',
          'No park',
          'Not parking',
          'Do not park is here'
        ],
        answer: 0,
        why: [
          null,
          'No 後面要接動名詞。',
          '標語慣用 No 而不是 Not。',
          '這個句子的結構不正確。'
        ]
      }
    },
    {
      title: '⑤ 說明步驟',
      body: '食譜或說明書常用祈使句：\n' +
            'First, wash the vegetables. Then, cut them into small pieces.\n' +
            'Next, put them in the pot. Finally, add some salt.\n' +
            '⚠ 用 First、Then、Next、Finally 標示順序，讀者才好跟著做。',
      viz: { type: 'energyflow', steps: ['First', 'Then', 'Next', 'Finally'] },
      check: {
        q: '寫食譜或操作說明時，為什麼常用祈使句？',
        options: [
          '因為要直接告訴讀者該做什麼，簡潔明確',
          '因為比較有禮貌',
          '因為文法比較簡單',
          '因為沒有其他選擇'
        ],
        answer: 0,
        why: [
          null,
          '祈使句的重點是清楚而非禮貌。',
          '簡潔是結果，目的是清楚指示。',
          '也可以用其他句型，只是祈使句最直接。'
        ]
      }
    },
    {
      title: '⑥ 提議：Let’s',
      body: 'Let’s go!（我們走吧！）　Let’s not talk about it.（我們別談這個。）\n' +
            '⚠ Let’s 包含說話者自己（let us），\n' +
            '和一般祈使句（只叫對方做）不同。',
      viz: { type: 'compareexp',
             factor: '對象的差別',
             a: { label: '祈使句', note: 'Go now. 只叫對方做' },
             b: { label: 'Let’s', note: 'Let’s go. 包含說話者自己' },
             same: ['都以動詞為核心'] },
      check: {
        q: 'Let’s go. 和 Go. 的差別是什麼？',
        options: [
          'Let’s go 包含說話者自己，Go 只叫對方做',
          '兩者完全相同',
          'Let’s go 比較沒禮貌',
          'Go 包含說話者'
        ],
        answer: 0,
        why: [
          null,
          '兩者的對象不同。',
          'Let’s 的語氣其實較為友善。',
          '單獨的 Go 不包含說話者。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第8單元 連接詞 and / but / or'] = {
  intro: '連接詞就像句子的膠水——它決定兩件事的關係是「加上」「相反」還是「二選一」。',
  cards: [
    {
      title: '① and：並列',
      body: '把「方向相同」的兩件事連起來：\n' +
            'I like apples and bananas.（我喜歡蘋果和香蕉。）\n' +
            'He is tall and thin.（他又高又瘦。）\n' +
            '⚠ 連接三個以上時用逗號：A, B, and C。',
      viz: { type: 'sentence', label: '並列', items: [
        { t: 'apples', r: '第一項' }, { t: 'and', r: '連接詞' }, { t: 'bananas', r: '第二項' }],
        note: 'and 用來連接方向相同的兩件事。' },
      check: {
        q: '要連接「又高又瘦」這兩個相同方向的形容詞，應該用哪一個連接詞？',
        options: ['and', 'but', 'or', 'because'],
        answer: 0,
        why: [
          null,
          'but 用於意思相反的情況。',
          'or 用於二選一。',
          'because 用來說明原因。'
        ]
      }
    },
    {
      title: '② but：轉折',
      body: '連接「方向相反」的兩件事：\n' +
            'I like math, but I do not like tests.\n' +
            'He is short but strong.（他雖矮但很強壯。）\n' +
            '⚠ but 前面通常加逗號（連接兩個完整句子時）。',
      viz: { type: 'sentence', label: '轉折', items: [
        { t: 'I like math', r: '前半' }, { t: 'but', r: '轉折' },
        { t: 'I do not like tests', r: '後半' }],
        note: 'but 連接意思相反的兩個部分。' },
      check: {
        q: '「我喜歡英文，但不喜歡考試」應該用哪一個連接詞？',
        options: ['but', 'and', 'or', 'so'],
        answer: 0,
        why: [
          null,
          'and 用於相同方向的並列。',
          'or 用於二選一。',
          'so 用來表示結果。'
        ]
      }
    },
    {
      title: '③ or：選擇',
      body: '表示「二選一」：\n' +
            'Do you want tea or coffee?（你要茶還是咖啡？）\n' +
            'We can go by bus or by train.\n' +
            '⚠ 否定句中 or 表示「兩者都不」：\n' +
            'I do not like tea or coffee.（茶和咖啡我都不喜歡。）',
      viz: { type: 'sentence', label: '選擇', items: [
        { t: 'tea', r: '選項一' }, { t: 'or', r: '連接詞' }, { t: 'coffee', r: '選項二' }],
        note: 'or 用來提供選擇。' },
      check: {
        q: '「你要茶還是咖啡？」應該用哪一個連接詞？',
        options: ['or', 'and', 'but', 'because'],
        answer: 0,
        why: [
          null,
          'and 表示兩者都要。',
          'but 表示轉折。',
          'because 用來說明原因。'
        ]
      }
    },
    {
      title: '④ so 與 because',
      body: 'because 說「原因」：I stayed home because it rained.\n' +
            'so 說「結果」：It rained, so I stayed home.\n' +
            '⚠ 兩者的前後順序剛好相反，\n' +
            '而且同一句中不能同時用 because 和 so。',
      viz: { type: 'compareexp',
             factor: '因果的兩種說法',
             a: { label: 'because', note: '後面接原因：…because it rained.' },
             b: { label: 'so', note: '後面接結果：It rained, so…' },
             same: ['都表達因果關係'] },
      check: {
        q: '「因為下雨，所以我待在家」用英文寫時要注意什麼？',
        options: [
          '只能用 because 或 so 其中一個，不能兩個都用',
          '一定要兩個都用',
          '兩個字可以互換位置',
          '不需要連接詞'
        ],
        answer: 0,
        why: [
          null,
          '英文不像中文可以「因為…所以…」並用。',
          '兩者的位置與功能不同。',
          '沒有連接詞句子會不完整。'
        ]
      }
    },
    {
      title: '⑤ 連接詞與逗號',
      body: '連接兩個「完整句子」時，通常在連接詞前加逗號：\n' +
            'I like dogs, but my sister likes cats.\n' +
            '連接兩個「單字或片語」時不用逗號：\n' +
            'I like dogs and cats.\n' +
            '⚠ 這個規則能讓句子更清楚。',
      viz: { type: 'compareexp',
             factor: '要不要加逗號',
             a: { label: '連接完整句子', note: '前面加逗號：…, but…' },
             b: { label: '連接單字片語', note: '不加逗號：A and B' },
             same: ['都使用連接詞'] },
      check: {
        q: '下列哪一句的標點使用正確？',
        options: [
          'I like dogs, but my sister likes cats.',
          'I like dogs but, my sister likes cats.',
          'I like, dogs and cats.',
          'I like dogs and, cats.'
        ],
        answer: 0,
        why: [
          null,
          '逗號要放在連接詞前面。',
          '連接單字時不需要逗號。',
          '逗號的位置不正確。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: '把短句連成長句，文章會更流暢：\n' +
            '短：I like sports. I do not like swimming.\n' +
            '長：I like sports, but I do not like swimming.\n' +
            '⚠ 但也不要一直用 and 串下去——太長反而難懂。',
      viz: { type: 'energyflow', steps: ['寫出短句', '判斷關係', '選擇連接詞', '合併成長句'] },
      check: {
        q: '把兩個短句合併時，第一步應該做什麼？',
        options: [
          '判斷兩句的關係是並列、轉折還是選擇',
          '隨便挑一個連接詞',
          '把句子縮短',
          '把兩句都刪掉一半'
        ],
        answer: 0,
        why: [
          null,
          '選錯連接詞會讓意思改變。',
          '合併的目的不是縮短。',
          '刪減內容會失去原意。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|四下|第9單元 短文閱讀理解'] = {
  intro: '讀短文不是每個字都要懂——是要抓到「它在說什麼」。',
  cards: [
    {
      title: '① 先看標題與圖片',
      body: '讀文章前先看標題、圖片與問題，心裡先有個底。\n' +
            '⚠ 這叫「預測」：知道大概在講什麼，讀起來會快很多。\n' +
            '看到不認識的字先跳過，讀完整段再回頭猜。',
      viz: { type: 'energyflow', steps: ['看標題與圖', '快速掃過一遍', '再讀細節', '回答問題'] },
      check: {
        q: '開始讀一篇英文短文之前，最有效的第一步是什麼？',
        options: [
          '先看標題、圖片與題目，預測內容',
          '先查所有生字',
          '從最後一段開始讀',
          '先把全文翻譯成中文'
        ],
        answer: 0,
        why: [
          null,
          '先查生字會打斷閱讀的流暢。',
          '倒著讀會失去脈絡。',
          '逐字翻譯很花時間也不必要。'
        ]
      }
    },
    {
      title: '② 找出主旨',
      body: '主旨常出現在「第一句」或「最後一句」。\n' +
            '問自己：這篇文章主要在講誰？在講什麼事？\n' +
            '⚠ 主旨是「整篇的重點」，不是某一個細節。',
      viz: { type: 'classify', groups: [
        { label: '主旨題常問', items: ['What is the passage about?', 'What is the main idea?'] },
        { label: '細節題常問', items: ['When did it happen?', 'Who is Amy?'] }] },
      check: {
        q: '題目問 What is the main idea of the passage? 是在問什麼？',
        options: [
          '整篇文章的主旨',
          '文章的第一個生字',
          '作者的名字',
          '文章有幾個字'
        ],
        answer: 0,
        why: [
          null,
          '單一生字不能代表整篇的主旨。',
          '作者資訊通常不是主旨題的重點。',
          '字數與內容無關。'
        ]
      }
    },
    {
      title: '③ 找細節',
      body: '細節題（who、when、where、what）通常可以在文章中「直接找到答案」。\n' +
            '⚠ 技巧：先看題目的關鍵字，再回文章中找同樣的字，\n' +
            '答案通常就在附近。',
      viz: { type: 'energyflow', steps: ['讀題目', '圈出關鍵字', '回文章找', '對照選項'] },
      check: {
        q: '回答細節題最有效的方法是什麼？',
        options: [
          '找出題目的關鍵字，回文章中定位',
          '憑印象猜答案',
          '把全文背下來',
          '只看第一段'
        ],
        answer: 0,
        why: [
          null,
          '憑印象容易記錯細節。',
          '背誦既費時又沒有必要。',
          '答案可能出現在任何一段。'
        ]
      }
    },
    {
      title: '④ 猜生字',
      body: '從上下文猜意思：看前後句、看例子、看對比詞（but、however）。\n' +
            '⚠ 也可以從字的組成猜：un-（不）、-er（人）、-ful（充滿）。\n' +
            '例：unhappy（不快樂）、teacher（教的人）、helpful（有幫助的）。',
      viz: { type: 'classify', groups: [
        { label: '字首', items: ['un-（不）', 're-（再次）', 'pre-（之前）'] },
        { label: '字尾', items: ['-er（人）', '-ful（充滿）', '-less（沒有）'] }] },
      check: {
        q: '看到 unhappy 這個字，可以怎麼猜它的意思？',
        options: [
          '從字首 un- 表示否定，推測是「不快樂」',
          '完全無法猜',
          '一定要查字典',
          '猜它是名詞'
        ],
        answer: 0,
        why: [
          null,
          '字首與字尾提供了很多線索。',
          '查字典可以確認，但先猜能加快閱讀。',
          '從結構可以判斷它是形容詞。'
        ]
      }
    },
    {
      title: '⑤ 推論',
      body: '有些答案文章沒有直說，要「從線索推出來」。\n' +
            '例：文章說 Amy took her umbrella and put on her boots.\n' +
            '→ 可以推論外面在下雨。\n' +
            '⚠ 推論要有文章的依據，不能憑自己的想像。',
      viz: { type: 'energyflow', steps: ['找出線索', '合理推論', '回文章驗證', '選出答案'] },
      check: {
        q: '做「推論題」時，最重要的原則是什麼？',
        options: [
          '推論必須有文章中的線索支持',
          '憑生活經驗自由聯想',
          '選最長的選項',
          '選最特別的選項'
        ],
        answer: 0,
        why: [
          null,
          '沒有依據的聯想容易出錯。',
          '選項長度與正確性無關。',
          '特別的選項不一定正確。'
        ]
      }
    },
    {
      title: '⑥ 閱讀習慣',
      body: '每天讀一小段（三到五句）比一次讀很多有效。\n' +
            '⚠ 讀完後可以做兩件事：\n' +
            '① 用一句話說出這段在講什麼 ② 記下兩三個有用的字。\n' +
            '長期累積，閱讀速度與字彙量都會提升。',
      viz: { type: 'energyflow', steps: ['每天讀一小段', '說出主旨', '記兩三個字', '長期累積'] },
      check: {
        q: '培養英文閱讀能力，比較有效的方式是什麼？',
        options: [
          '每天讀一小段並整理重點，長期累積',
          '考前一次讀很多篇',
          '只背單字不讀文章',
          '只看中文翻譯'
        ],
        answer: 0,
        why: [
          null,
          '臨時大量閱讀效果有限。',
          '單字要在文章中才學得會用法。',
          '只看翻譯無法培養閱讀能力。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第1單元 字母與母音字母'] = {
  intro: '二十六個字母，五個母音——整個英文系統就建立在這上面。',
  cards: [
    {
      title: '① 二十六個字母',
      body: '大寫：A B C D E F G H I J K L M N O P Q R S T U V W X Y Z。\n' +
            '小寫：a b c d e f g h i j k l m n o p q r s t u v w x y z。\n' +
            '⚠ 大寫用在：句首、專有名詞（人名、地名、月份、星期）、\n' +
            '以及代名詞 I（永遠大寫）。',
      viz: { type: 'classify', groups: [
        { label: '一定大寫', items: ['句首', '人名', '地名', '月份', '星期', 'I'] },
        { label: '通常小寫', items: ['一般名詞', '動詞', '形容詞'] }] },
      check: {
        q: '下列哪一個字在句子中間也一定要大寫？',
        options: ['I', 'book', 'run', 'happy'],
        answer: 0,
        why: [
          null,
          '一般名詞在句中用小寫。',
          '動詞在句中用小寫。',
          '形容詞在句中用小寫。'
        ]
      }
    },
    {
      title: '② 母音與子音',
      body: '母音字母：a、e、i、o、u（有時 y 也當母音，例如 my、happy）。\n' +
            '其餘 21 個是子音字母。\n' +
            '⚠ 每個英文音節都要有一個母音，這是拼字的重要線索。',
      viz: { type: 'classify', groups: [
        { label: '母音字母', items: ['a', 'e', 'i', 'o', 'u'] },
        { label: '有時當母音', items: ['y'] }] },
      check: {
        q: '下列哪一組全部都是母音字母？',
        options: ['a、e、i', 'b、c、d', 'a、b、c', 'm、n、o'],
        answer: 0,
        why: [
          null,
          '這三個都是子音字母。',
          'b 與 c 是子音。',
          'm 與 n 是子音。'
        ]
      }
    },
    {
      title: '③ 母音的長短音',
      body: '短音：cat、bed、pig、dog、cup（子音＋母音＋子音）。\n' +
            '長音：cake、these、bike、home、cute（字尾有不發音的 e）。\n' +
            '⚠ 長音就是「唸出字母本身的名字」。',
      viz: { type: 'phonics', words: [
        { w: 'cap', parts: ['c', 'a', 'p'], hit: 1, s: 'a 的短音', mean: '帽子' },
        { w: 'cape', parts: ['c', 'a', 'p', 'e'], hit: 1, s: 'a 的長音', mean: '斗篷' }] },
      tip: '按單字按鈕比較長短音。',
      check: {
        q: '長母音的特徵是什麼？',
        options: [
          '唸出字母本身的名字',
          '完全不發音',
          '比子音還短',
          '只出現在字尾'
        ],
        answer: 0,
        why: [
          null,
          '長母音是要發音的。',
          '長母音比短母音長。',
          '長母音可以出現在字的中間。'
        ]
      }
    },
    {
      title: '④ 音節',
      body: '音節是「發音的單位」，每個音節有一個母音。\n' +
            'cat（1 個音節）、rab-bit（2 個）、ba-na-na（3 個）、\n' +
            'in-ter-est-ing（4 個）。\n' +
            '⚠ 數音節的方法：把手放在下巴下面，唸一次下巴動幾次就是幾個音節。',
      viz: { type: 'phonics', words: [
        { w: 'rabbit', parts: ['rab', 'bit'], hit: 0, s: '兩個音節', mean: '兔子' },
        { w: 'banana', parts: ['ba', 'na', 'na'], hit: 1, s: '三個音節', mean: '香蕉' }] },
      check: {
        q: 'banana 這個字有幾個音節？',
        options: ['3 個', '1 個', '2 個', '6 個'],
        answer: 0,
        why: [
          null,
          '這個字不只一個母音。',
          '仔細唸會發現有三個母音。',
          '音節數不等於字母數。'
        ]
      }
    },
    {
      title: '⑤ 重音',
      body: '多音節的字有一個音節唸得比較重（重音）。\n' +
            '例：TEA-cher、com-PU-ter、im-POR-tant。\n' +
            '⚠ 重音位置錯了，聽的人可能聽不懂——\n' +
            '所以背單字時要一起記重音在哪裡。',
      viz: { type: 'phonics', words: [
        { w: 'teacher', parts: ['TEA', 'cher'], hit: 0, s: '重音在第一音節', mean: '老師' },
        { w: 'computer', parts: ['com', 'PU', 'ter'], hit: 1, s: '重音在第二音節', mean: '電腦' }] },
      check: {
        q: '為什麼背單字時要注意重音？',
        options: [
          '重音位置錯了可能讓對方聽不懂',
          '重音不影響溝通',
          '重音只影響拼字',
          '重音只在唱歌時才重要'
        ],
        answer: 0,
        why: [
          null,
          '重音是英文發音的重要特徵。',
          '重音影響的是發音而非拼字。',
          '日常對話中重音同樣重要。'
        ]
      }
    },
    {
      title: '⑥ 字母與發音的關係',
      body: '英文的字母與發音不是一對一：同一個字母可能有不同發音\n' +
            '（cat 的 a 與 cake 的 a），不同字母也可能發同樣的音\n' +
            '（see 與 sea）。\n' +
            '⚠ 所以要學「規則」而不是死背個別單字，遇到例外再另外記。',
      viz: { type: 'compareexp',
             factor: '字母與發音',
             a: { label: '同字母不同音', note: 'cat 的 a 與 cake 的 a' },
             b: { label: '不同拼法同音', note: 'see 與 sea' },
             same: ['都說明英文拼音不是一對一'] },
      check: {
        q: 'see 和 sea 這兩個字有什麼特點？',
        options: [
          '拼法不同但發音相同',
          '拼法相同但發音不同',
          '意思完全相同',
          '兩者都不是英文字'
        ],
        answer: 0,
        why: [
          null,
          '兩個字的拼法明顯不同。',
          '一個是看見，一個是海。',
          '兩者都是常用的英文字。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第2單元 自然發音'] = {
  intro: '自然發音不是背單字，是學會「看到字就唸得出來」的規則。',
  cards: [
    {
      title: '① 子音的基本音',
      body: 'b（球）、c（貓，多半發 k 的音）、d、f、g、h、j、k、l、m、n、\n' +
            'p、q（常與 u 一起）、r、s、t、v、w、x、y、z。\n' +
            '⚠ c 在 e、i、y 前面發 s 的音：city、cent、cycle。',
      viz: { type: 'phonics', words: [
        { w: 'cat', parts: ['c', 'a', 't'], hit: 0, s: 'c 發 k 的音', mean: '貓' },
        { w: 'city', parts: ['c', 'i', 'ty'], hit: 0, s: 'c 發 s 的音', mean: '城市' }] },
      tip: '按單字按鈕比較同一個字母的不同發音。',
      check: {
        q: '字母 c 在 city 這個字裡發什麼音？',
        options: [
          '發 s 的音',
          '發 k 的音',
          '不發音',
          '發 ch 的音'
        ],
        answer: 0,
        why: [
          null,
          'c 在 a、o、u 前面才發 k 的音。',
          '這個位置的 c 要發音。',
          'ch 是另一種字母組合。'
        ]
      }
    },
    {
      title: '② 短母音複習',
      body: 'a（cat）、e（bed）、i（pig）、o（dog）、u（cup）。\n' +
            '⚠ 出現在「子音＋母音＋子音」結構中時，母音多半發短音。\n' +
            '這個結構在英文裡非常常見。',
      viz: { type: 'phonics', words: [
        { w: 'cat', parts: ['c', 'a', 't'], hit: 1, s: 'a 的短音', mean: '貓' },
        { w: 'bed', parts: ['b', 'e', 'd'], hit: 1, s: 'e 的短音', mean: '床' },
        { w: 'cup', parts: ['c', 'u', 'p'], hit: 1, s: 'u 的短音', mean: '杯子' }] },
      check: {
        q: '「子音＋母音＋子音」結構中的母音，通常發什麼音？',
        options: ['短音', '長音', '不發音', '兩者皆可'],
        answer: 0,
        why: [
          null,
          '長音多出現在有字尾 e 的結構中。',
          '母音一定要發音。',
          '這個結構有明確的規則。'
        ]
      }
    },
    {
      title: '③ magic e 複習',
      body: 'cake、bike、home、cute、these：字尾的 e 不發音，\n' +
            '但讓前面的母音發長音。\n' +
            '⚠ 比較：cap／cape、kit／kite、hop／hope、cut／cute。',
      viz: { type: 'phonics', words: [
        { w: 'kit', parts: ['k', 'i', 't'], hit: 1, s: 'i 的短音', mean: '工具組' },
        { w: 'kite', parts: ['k', 'i', 't', 'e'], hit: 1, s: 'i 的長音', mean: '風箏' }] },
      check: {
        q: '字尾的 magic e 有什麼作用？',
        options: [
          '本身不發音，讓前面的母音發長音',
          '本身要發音',
          '讓前面的子音消失',
          '沒有任何作用'
        ],
        answer: 0,
        why: [
          null,
          '這個 e 是不發音的。',
          '子音不會因此消失。',
          '它明確改變了母音的發音。'
        ]
      }
    },
    {
      title: '④ 母音組合',
      body: 'ai／ay：rain、day（發 a 的長音）。\n' +
            'ee／ea：see、eat（發 e 的長音）。\n' +
            'oa／ow：boat、snow（發 o 的長音）。\n' +
            '⚠ 口訣：「兩個母音走在一起，第一個說話，第二個不出聲」\n' +
            '（大部分情況適用）。',
      viz: { type: 'phonics', words: [
        { w: 'rain', parts: ['r', 'ai', 'n'], hit: 1, s: 'ai 發 a 的長音', mean: '雨' },
        { w: 'see', parts: ['s', 'ee'], hit: 1, s: 'ee 發 e 的長音', mean: '看見' },
        { w: 'boat', parts: ['b', 'oa', 't'], hit: 1, s: 'oa 發 o 的長音', mean: '船' }] },
      check: {
        q: 'rain 這個字中的 ai 發什麼音？',
        options: [
          'a 的長音',
          'i 的長音',
          'a 的短音',
          '不發音'
        ],
        answer: 0,
        why: [
          null,
          '這個組合中發音的是第一個母音。',
          '母音組合通常發長音。',
          '母音組合一定要發音。'
        ]
      }
    },
    {
      title: '⑤ 特殊組合',
      body: 'oo：book（短）／moon（長）——同一組合有兩種發音。\n' +
            'ou／ow：house、cow（發類似「ㄠ」的音）。\n' +
            'oi／oy：coin、boy。\n' +
            'ar／or／er／ir／ur：car、for、her、bird、turn（r 控制的母音）。\n' +
            '⚠ 這些要多聽多唸才會熟。',
      viz: { type: 'phonics', words: [
        { w: 'book', parts: ['b', 'oo', 'k'], hit: 1, s: 'oo 的短音', mean: '書' },
        { w: 'moon', parts: ['m', 'oo', 'n'], hit: 1, s: 'oo 的長音', mean: '月亮' },
        { w: 'car', parts: ['c', 'ar'], hit: 1, s: 'ar 的音', mean: '汽車' }] },
      check: {
        q: 'book 和 moon 這兩個字的 oo 有什麼差別？',
        options: [
          '同樣的字母組合但發音長短不同',
          '發音完全相同',
          'book 的 oo 不發音',
          '兩者都是短音'
        ],
        answer: 0,
        why: [
          null,
          '仔細唸會發現長度不同。',
          'oo 在 book 中要發音。',
          'moon 的 oo 是長音。'
        ]
      }
    },
    {
      title: '⑥ 用發音規則自學單字',
      body: '看到新字時：① 找出母音 ② 判斷結構（短音、magic e、母音組合）\n' +
            '③ 試著拼讀 ④ 查證發音。\n' +
            '⚠ 這個能力一旦建立，背單字的速度會快很多，\n' +
            '也不容易忘記。',
      viz: { type: 'energyflow', steps: ['找出母音', '判斷結構', '試著拼讀', '查證確認'] },
      check: {
        q: '學會自然發音規則之後，最大的好處是什麼？',
        options: [
          '看到新單字能自己拼讀，學習與記憶都更有效率',
          '不用再學單字',
          '不用再聽英文',
          '所有單字都能猜對意思'
        ],
        answer: 0,
        why: [
          null,
          '仍然需要累積字彙。',
          '聽力練習依然重要。',
          '發音規則幫助讀音，不直接給出意思。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第3單元 be 動詞與自我介紹'] = {
  intro: 'be 動詞是英文最重要的動詞——因為它負責說明「是什麼、在哪裡、怎麼樣」。',
  cards: [
    {
      title: '① be 動詞的三種形式',
      body: 'I ＋ am；he／she／it ＋ is；you／we／they ＋ are。\n' +
            '⚠ 主詞是單數名詞用 is（My brother is…），\n' +
            '複數名詞用 are（My parents are…）。',
      viz: { type: 'classify', groups: [
        { label: 'am', items: ['I'] },
        { label: 'is', items: ['he', 'she', 'it', 'Amy', 'my brother'] },
        { label: 'are', items: ['you', 'we', 'they', 'my parents'] }] },
      check: {
        q: '主詞是 my parents 時，應該用哪一個 be 動詞？',
        options: ['are', 'is', 'am', '不需要 be 動詞'],
        answer: 0,
        why: [
          null,
          'parents 是複數，不用 is。',
          'am 只能配主詞 I。',
          '這類句子需要 be 動詞。'
        ]
      }
    },
    {
      title: '② be 動詞的三種用法',
      body: '① 說明身分：I am a student.\n' +
            '② 說明狀態：She is happy.\n' +
            '③ 說明位置：They are in the classroom.\n' +
            '⚠ 三種用法的共同點是：後面接名詞、形容詞或地點，而不是動作。',
      viz: { type: 'sentence', label: '身分', items: [
        { t: 'I', r: '主詞' }, { t: 'am', r: 'be 動詞' }, { t: 'a student', r: '名詞' }],
        note: '說明身分時後面接名詞。',
        alt: [
          { label: '狀態', items: [{ t: 'She', r: '主詞' }, { t: 'is', r: 'be 動詞' },
            { t: 'happy', r: '形容詞' }], note: '說明狀態時後面接形容詞。' },
          { label: '位置', items: [{ t: 'They', r: '主詞' }, { t: 'are', r: 'be 動詞' },
            { t: 'in the classroom', r: '地點' }], note: '說明位置時後面接地點片語。' }] },
      tip: '按按鈕看三種用法。',
      check: {
        q: 'be 動詞後面「不會」直接接什麼？',
        options: [
          '表示動作的原形動詞',
          '名詞',
          '形容詞',
          '地點片語'
        ],
        answer: 0,
        why: [
          null,
          '名詞可以接在 be 動詞後面。',
          '形容詞是常見的搭配。',
          '地點片語也可以接在後面。'
        ]
      }
    },
    {
      title: '③ 否定句',
      body: '在 be 動詞後面加 not：\n' +
            'I am not a teacher.　He is not tall.（＝ isn’t）\n' +
            'They are not here.（＝ aren’t）\n' +
            '⚠ be 動詞的否定不需要 do／does。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'He', r: '主詞' }, { t: 'is not', r: 'be＋not' }, { t: 'tall', r: '形容詞' }],
        note: 'be 動詞的否定直接加 not。' },
      check: {
        q: '「他不高」的正確說法是什麼？',
        options: [
          'He is not tall.',
          'He does not tall.',
          'He not is tall.',
          'He is no tall.'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞的否定不用 does。',
          'not 要放在 be 動詞後面。',
          '否定要用 not 而不是 no。'
        ]
      }
    },
    {
      title: '④ 疑問句',
      body: '把 be 動詞移到句首：\n' +
            'Are you a student?→ Yes, I am.／No, I am not.\n' +
            'Is she your sister?→ Yes, she is.／No, she isn’t.\n' +
            '⚠ 簡答時要用 be 動詞回答。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Are', r: 'be 動詞' }, { t: 'you', r: '主詞' }, { t: 'a student', r: '補語' }],
        note: '把 be 動詞移到主詞前面就成為疑問句。' },
      check: {
        q: 'Is she a teacher? 的正確簡答是什麼？',
        options: [
          'Yes, she is.',
          'Yes, she does.',
          'Yes, she do.',
          'Yes, she teacher.'
        ],
        answer: 0,
        why: [
          null,
          '問句用 be 動詞，回答也要用 be 動詞。',
          'do 不適用於 be 動詞的問句。',
          '簡答時一定要有動詞才完整。'
        ]
      }
    },
    {
      title: '⑤ 自我介紹的內容',
      body: '名字：My name is Amy.／I am Amy.\n' +
            '年齡：I am eleven years old.\n' +
            '年級：I am in the fifth grade.\n' +
            '興趣：I like reading and swimming.\n' +
            '⚠ 年級用序數：the fifth grade。',
      viz: { type: 'sentence', label: '說年級', items: [
        { t: 'I', r: '主詞' }, { t: 'am in', r: 'be＋介系詞' },
        { t: 'the fifth grade', r: '年級' }],
        note: '年級要用序數，前面加 the。' },
      check: {
        q: '「我五年級」的正確說法是什麼？',
        options: [
          'I am in the fifth grade.',
          'I am in the five grade.',
          'I have five grade.',
          'I am five grade.'
        ],
        answer: 0,
        why: [
          null,
          '年級要用序數 fifth。',
          '英文說年級用 be 動詞而不是 have。',
          '缺少介系詞與冠詞。'
        ]
      }
    },
    {
      title: '⑥ 完整的自我介紹',
      body: 'Hello, everyone. My name is Amy Chen.\n' +
            'I am eleven years old, and I am in the fifth grade.\n' +
            'I like drawing and playing the piano.\n' +
            'Nice to meet you all.\n' +
            '⚠ 順序：問候 → 名字 → 年齡年級 → 興趣 → 結尾。',
      viz: { type: 'energyflow', steps: ['問候', '名字', '年齡年級', '興趣', '結尾'] },
      check: {
        q: '自我介紹的結尾可以說什麼？',
        options: [
          'Nice to meet you.',
          'What is your name?',
          'How much is it?',
          'I do not know.'
        ],
        answer: 0,
        why: [
          null,
          '這是提問而不是結尾。',
          '這是購物用語，與情境不符。',
          '這個回答無法收尾。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第4單元 一般動詞與日常作息'] = {
  intro: '一般動詞負責說「做什麼」——它讓句子動起來。',
  cards: [
    {
      title: '① 一般動詞與 be 動詞的分工',
      body: 'be 動詞：說明「是什麼、怎麼樣、在哪裡」。\n' +
            '一般動詞：說明「做什麼」（go、eat、play、study）。\n' +
            '⚠ 一個句子通常只有一個主要動詞，兩者不能並用。',
      viz: { type: 'compareexp',
             factor: '兩類動詞',
             a: { label: 'be 動詞', note: '說明狀態、身分與位置' },
             b: { label: '一般動詞', note: '說明動作與行為' },
             same: ['都是句子的主要動詞'] },
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'I go to school every day.',
          'I am go to school every day.',
          'I am going to school every day by mistake here.',
          'I to school go every day.'
        ],
        answer: 0,
        why: [
          null,
          '不能同時使用 be 動詞與一般動詞的原形。',
          '這個句子的用詞不自然。',
          '語序不正確，動詞要在主詞後面。'
        ]
      }
    },
    {
      title: '② 第三人稱單數加 s',
      body: '主詞是 he／she／it 或單數名詞時，現在式的肯定句動詞要加 s。\n' +
            'He goes to school.　She studies English.　It rains a lot.\n' +
            '⚠ 拼寫規則：直接加 s、加 es（go→goes）、去 y 加 ies（study→studies）。',
      viz: { type: 'classify', groups: [
        { label: '直接加 s', items: ['plays', 'reads', 'likes'] },
        { label: '加 es', items: ['goes', 'watches', 'washes'] },
        { label: '去 y 加 ies', items: ['studies', 'flies', 'cries'] }] },
      check: {
        q: 'watch 的第三人稱單數形是什麼？',
        options: ['watches', 'watchs', 'watchies', 'watch'],
        answer: 0,
        why: [
          null,
          'ch 結尾要加 es。',
          '這個字尾不需要改成 ies。',
          '第三人稱單數必須變化。'
        ]
      }
    },
    {
      title: '③ 否定與疑問',
      body: '否定：I do not like it.／He does not like it.\n' +
            '疑問：Do you like it?／Does he like it?\n' +
            '⚠ 用了 do／does 之後，主要動詞回到原形。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'He', r: '主詞' }, { t: 'does not', r: '助動詞' }, { t: 'like', r: '原形' },
        { t: 'it', r: '受詞' }],
        note: 's 跑到 does 上面，動詞回原形。' },
      check: {
        q: '「她不吃早餐」的正確說法是什麼？',
        options: [
          'She does not eat breakfast.',
          'She do not eat breakfast.',
          'She does not eats breakfast.',
          'She not eat breakfast.'
        ],
        answer: 0,
        why: [
          null,
          '第三人稱單數要用 does。',
          '用了 does 之後動詞要用原形。',
          '否定句需要助動詞。'
        ]
      }
    },
    {
      title: '④ 日常作息的動詞片語',
      body: 'get up（起床）、take a shower（洗澡）、brush my teeth（刷牙）、\n' +
            'have breakfast／lunch／dinner、go to school、do homework、\n' +
            'watch TV、go to bed。\n' +
            '⚠ 這些是固定搭配，要整組記。',
      viz: { type: 'classify', groups: [
        { label: '早上', items: ['get up', 'brush my teeth', 'have breakfast'] },
        { label: '白天', items: ['go to school', 'have lunch', 'study'] },
        { label: '晚上', items: ['do homework', 'take a shower', 'go to bed'] }] },
      check: {
        q: '「刷牙」的正確說法是什麼？',
        options: [
          'brush my teeth',
          'wash my teeth',
          'clean my tooth',
          'brush my tooth'
        ],
        answer: 0,
        why: [
          null,
          '刷牙的動詞用 brush 而不是 wash。',
          '牙齒是複數 teeth。',
          'tooth 的複數是 teeth。'
        ]
      }
    },
    {
      title: '⑤ 加上時間與頻率',
      body: 'I get up at six thirty every morning.\n' +
            'She usually goes to bed at ten.\n' +
            '⚠ 頻率副詞放在一般動詞前面（usually goes），\n' +
            '時間片語放在句尾（at ten）。',
      viz: { type: 'sentence', label: '完整句', items: [
        { t: 'She', r: '主詞' }, { t: 'usually', r: '頻率副詞' },
        { t: 'goes to bed', r: '動詞片語' }, { t: 'at ten', r: '時間' }],
        note: '頻率副詞在動詞前，時間片語在句尾。' },
      check: {
        q: '「她通常十點睡覺」的正確語序是什麼？',
        options: [
          'She usually goes to bed at ten.',
          'She goes usually to bed at ten.',
          'Usually she goes to bed ten.',
          'She goes to bed usually ten.'
        ],
        answer: 0,
        why: [
          null,
          '頻率副詞要放在動詞前面。',
          '時間前面需要介系詞 at。',
          '語序與介系詞都不正確。'
        ]
      }
    },
    {
      title: '⑥ 描述一天',
      body: '練習寫五句話描述自己的一天：\n' +
            'I get up at six. I have breakfast at seven.\n' +
            'I go to school at seven thirty. I do my homework after school.\n' +
            'I go to bed at ten.\n' +
            '⚠ 用 first、then、after that 可以讓段落更流暢。',
      viz: { type: 'energyflow', steps: ['起床', '上學', '放學', '寫功課', '睡覺'] },
      check: {
        q: '要讓一段描述更流暢，可以加入什麼？',
        options: [
          '表示順序的字，例如 first、then、after that',
          '更多的形容詞',
          '更長的單字',
          '更多的驚嘆號'
        ],
        answer: 0,
        why: [
          null,
          '形容詞增加細節但不改善順序。',
          '單字長度與流暢度無關。',
          '標點符號不能取代連接的詞語。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第5單元 現在進行式'] = {
  intro: '「此刻正在發生」的事，要用專門的時態來說。',
  cards: [
    {
      title: '① 形式與意義',
      body: '主詞 ＋ be 動詞 ＋ 動詞-ing，表示「此刻正在做」。\n' +
            'I am studying now.　They are playing outside.\n' +
            '⚠ 兩個部分缺一不可：be 動詞與 -ing。',
      viz: { type: 'tense', verb: 'play', highlight: '現在進行式' },
      tip: '按按鈕比較不同時態。',
      check: {
        q: '現在進行式的組成是什麼？',
        options: [
          'be 動詞 ＋ 動詞-ing',
          '只要動詞-ing',
          '只要 be 動詞',
          'do ＋ 原形動詞'
        ],
        answer: 0,
        why: [
          null,
          '缺少 be 動詞句子不完整。',
          '沒有 -ing 就不是進行式。',
          'do 用於一般動詞的否定與疑問。'
        ]
      }
    },
    {
      title: '② -ing 的拼寫',
      body: '直接加：play → playing。\n' +
            '去 e：write → writing、make → making。\n' +
            '重複子音：run → running、sit → sitting。\n' +
            '⚠ 判斷順序：先看字尾有沒有不發音的 e，再看是不是短母音加單子音。',
      viz: { type: 'classify', groups: [
        { label: '直接加', items: ['playing', 'reading', 'studying'] },
        { label: '去 e', items: ['writing', 'making', 'coming'] },
        { label: '重複子音', items: ['running', 'sitting', 'swimming'] }] },
      check: {
        q: 'swim 加上 -ing 應該怎麼拼？',
        options: ['swimming', 'swiming', 'swimeing', 'swimmming'],
        answer: 0,
        why: [
          null,
          '短母音加單子音要重複子音。',
          '這裡不需要加 e。',
          '只需要重複一次子音。'
        ]
      }
    },
    {
      title: '③ 與現在簡單式的比較',
      body: '簡單式：習慣、事實（I play basketball every Sunday.）\n' +
            '進行式：此刻正在做（I am playing basketball now.）\n' +
            '⚠ 線索：every day、usually → 簡單式；\n' +
            'now、right now、at the moment、Look! → 進行式。',
      viz: { type: 'compareexp',
             factor: '兩種現在式',
             a: { label: '簡單式', note: '習慣或事實，搭配 every day' },
             b: { label: '進行式', note: '此刻正在做，搭配 now' },
             same: ['都描述現在的情況'] },
      check: {
        q: '句子開頭是 Look! 時，後面通常接什麼時態？',
        options: [
          '現在進行式',
          '現在簡單式',
          '過去式',
          '未來式'
        ],
        answer: 0,
        why: [
          null,
          'Look 是要對方看此刻發生的事。',
          '過去式與此刻無關。',
          '未來式表示還沒發生。'
        ]
      }
    },
    {
      title: '④ 否定與疑問',
      body: '否定：He is not sleeping.（＝ isn’t）\n' +
            '疑問：Are they playing?→ Yes, they are.／No, they aren’t.\n' +
            '⚠ 進行式的否定與疑問都靠 be 動詞，不用 do／does。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Are', r: 'be 動詞' }, { t: 'they', r: '主詞' }, { t: 'playing', r: '動詞-ing' }],
        note: '把 be 動詞移到句首形成疑問句。' },
      check: {
        q: '「他們在玩嗎？」的正確問法是什麼？',
        options: [
          'Are they playing?',
          'Do they playing?',
          'They are playing?',
          'Are they play?'
        ],
        answer: 0,
        why: [
          null,
          '進行式的疑問不用 do。',
          '疑問句要把 be 動詞移到句首。',
          '進行式的動詞要用 -ing 形。'
        ]
      }
    },
    {
      title: '⑤ 不用進行式的動詞',
      body: '有些動詞表示「狀態」而非動作，通常不用進行式：\n' +
            'like、love、know、want、need、have（擁有）、see、hear。\n' +
            '⚠ 所以要說 I like it（不說 I am liking it）。\n' +
            '但 have 當「吃、進行」時可以用：I am having lunch.',
      viz: { type: 'classify', groups: [
        { label: '通常不用進行式', items: ['like', 'know', 'want', 'need'] },
        { label: '可以用進行式', items: ['have lunch', 'play', 'run', 'study'] }] },
      check: {
        q: '下列哪一句的用法「不正確」？',
        options: [
          'I am knowing the answer.',
          'I know the answer.',
          'I am doing my homework.',
          'I am having lunch.'
        ],
        answer: 0,
        why: [
          null,
          'know 表示狀態，用簡單式是正確的。',
          '做功課是動作，可以用進行式。',
          'have 當「吃」時可以用進行式。'
        ]
      }
    },
    {
      title: '⑥ 看圖說話',
      body: '練習：看一張圖，用進行式描述三件事。\n' +
            'A boy is riding a bike. Two girls are talking.\n' +
            'A dog is running after a ball.\n' +
            '⚠ 注意主詞的單複數會影響 be 動詞（is／are）。',
      viz: { type: 'sentence', label: '看圖說話', items: [
        { t: 'Two girls', r: '主詞（複數）' }, { t: 'are', r: 'be 動詞' },
        { t: 'talking', r: '動詞-ing' }],
        note: '複數主詞要用 are。' },
      check: {
        q: '「三個男孩正在跑步」的正確說法是什麼？',
        options: [
          'Three boys are running.',
          'Three boys is running.',
          'Three boy are running.',
          'Three boys are run.'
        ],
        answer: 0,
        why: [
          null,
          '複數主詞要用 are。',
          '數字大於一時名詞要用複數。',
          '進行式的動詞要用 -ing 形。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第6單元 地點介系詞'] = {
  intro: '在裡面、在上面、在旁邊——這些小字讓你能說清楚東西在哪裡。',
  cards: [
    {
      title: '① in、on、at 的基本區別',
      body: 'in：在某個空間內（in the box、in the room、in Taipei）。\n' +
            'on：在某個表面上（on the desk、on the wall、on the floor）。\n' +
            'at：在某個定點（at the door、at the bus stop、at school）。\n' +
            '⚠ 範圍大小：at（點）< on（面）< in（空間）。',
      viz: { type: 'classify', groups: [
        { label: 'in（空間）', items: ['in the box', 'in the room', 'in Taipei'] },
        { label: 'on（表面）', items: ['on the desk', 'on the wall'] },
        { label: 'at（定點）', items: ['at the door', 'at the bus stop'] }] },
      check: {
        q: '「在牆上」應該用哪一個介系詞？',
        options: ['on', 'in', 'at', 'to'],
        answer: 0,
        why: [
          null,
          'in 用於空間內部。',
          'at 用於定點。',
          'to 表示方向。'
        ]
      }
    },
    {
      title: '② 位置關係',
      body: 'under（在下面）、over（在上方，沒接觸）、above（在上方）、\n' +
            'below（在下方）、behind（在後面）、in front of（在前面）、\n' +
            'next to／beside（在旁邊）、between（兩者之間）、among（三者以上之間）。',
      viz: { type: 'classify', groups: [
        { label: '上下', items: ['under', 'over', 'above', 'below'] },
        { label: '前後', items: ['in front of', 'behind'] },
        { label: '之間', items: ['between', 'among'] }] },
      check: {
        q: '「在三棵樹之間」應該用哪一個介系詞？',
        options: ['among', 'between', 'under', 'behind'],
        answer: 0,
        why: [
          null,
          'between 用於兩者之間。',
          'under 是在下面。',
          'behind 是在後面。'
        ]
      }
    },
    {
      title: '③ on 與 over 的差別',
      body: 'on：有接觸（The book is on the table.）\n' +
            'over：在上方但沒接觸（The lamp is over the table.）\n' +
            '⚠ 這個差別在描述空間時很重要。',
      viz: { type: 'compareexp',
             factor: '有沒有接觸',
             a: { label: 'on', note: '直接放在表面上，有接觸' },
             b: { label: 'over', note: '在正上方但沒有接觸' },
             same: ['都表示在上方'] },
      check: {
        q: '「電燈在桌子正上方（沒有接觸）」應該用哪一個介系詞？',
        options: ['over', 'on', 'in', 'under'],
        answer: 0,
        why: [
          null,
          'on 表示有接觸。',
          'in 表示在空間內。',
          'under 表示在下面。'
        ]
      }
    },
    {
      title: '④ 地點的固定用法',
      body: 'at home（在家）、at school（在學校）、at work（在工作）、\n' +
            'in bed（在床上睡覺）、on the bus（在公車上）、in the car（在車裡）。\n' +
            '⚠ 有些是固定搭配，不完全照字面推理：\n' +
            '為什麼是 on the bus 但 in the car？因為公車可以站著走動。',
      viz: { type: 'classify', groups: [
        { label: '不加冠詞', items: ['at home', 'at school', 'in bed'] },
        { label: '交通工具', items: ['on the bus', 'on the train', 'in the car'] }] },
      check: {
        q: '「在公車上」的正確說法是什麼？',
        options: ['on the bus', 'in the bus', 'at the bus', 'to the bus'],
        answer: 0,
        why: [
          null,
          '大型交通工具習慣用 on。',
          'at 用於定點如車站。',
          'to 表示方向。'
        ]
      }
    },
    {
      title: '⑤ 描述位置的句型',
      body: 'The book is on the desk.（主詞 ＋ be ＋ 介系詞片語）\n' +
            'There is a book on the desk.（有一本書在桌上）\n' +
            '⚠ 兩種句型的重點不同：前者強調「那本書」在哪裡，\n' +
            '後者強調「桌上有東西」。',
      viz: { type: 'compareexp',
             factor: '兩種句型',
             a: { label: 'The book is…', note: '談論已知的特定物品在哪裡' },
             b: { label: 'There is a book…', note: '介紹某處有某物（新資訊）' },
             same: ['都在描述位置'] },
      check: {
        q: '要介紹「桌上有一本書」（對方還不知道），比較自然的句型是什麼？',
        options: [
          'There is a book on the desk.',
          'The book is on the desk.',
          'A book on the desk.',
          'Book is desk on.'
        ],
        answer: 0,
        why: [
          null,
          '用 the 表示對方已經知道那本書。',
          '這個句子缺少動詞，並不完整。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '⑥ 描述一個空間',
      body: '練習：用五句描述你的房間。\n' +
            'There is a bed in my room. My desk is next to the window.\n' +
            'There are two pictures on the wall. My bag is under the desk.\n' +
            '⚠ 先說有什麼，再說在哪裡，聽的人比較容易想像。',
      viz: { type: 'energyflow', steps: ['有什麼', '在哪裡', '和什麼相鄰', '整體印象'] },
      check: {
        q: '描述房間時，介系詞的作用是什麼？',
        options: [
          '說明每樣東西的相對位置，讓人能想像空間',
          '讓句子變長',
          '增加單字量',
          '沒有實際作用'
        ],
        answer: 0,
        why: [
          null,
          '長度不是使用介系詞的目的。',
          '單字量是附帶效果。',
          '介系詞在描述空間時非常關鍵。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第7單元 數字、時間與日期'] = {
  intro: '數字看起來簡單，但時間、日期、價錢的說法各有規則。',
  cards: [
    {
      title: '① 基數與序數',
      body: '基數：one、two、three…（數量）。\n' +
            '序數：first、second、third…（順序）。\n' +
            '⚠ 用序數的場合：日期、樓層、名次、章節。\n' +
            '拼寫要注意：fifth、eighth、ninth、twelfth、twentieth。',
      viz: { type: 'compareexp',
             factor: '兩種數字',
             a: { label: '基數', note: '表示數量：two books' },
             b: { label: '序數', note: '表示順序：the second book' },
             same: ['都是數字的表達方式'] },
      check: {
        q: '「第十二」的序數怎麼拼？',
        options: ['twelfth', 'twelveth', 'twelvth', 'twelth'],
        answer: 0,
        why: [
          null,
          '要把 twelve 的 ve 改成 f 再加 th。',
          '這個拼法漏了字母。',
          '這個拼法不正確。'
        ]
      }
    },
    {
      title: '② 大數字',
      body: 'hundred（百）、thousand（千）、million（百萬）。\n' +
            '365 → three hundred and sixty-five。\n' +
            '⚠ hundred、thousand 前面有數字時「不加 s」：\n' +
            'two hundred（不是 two hundreds）。',
      viz: { type: 'classify', groups: [
        { label: '正確', items: ['two hundred', 'three thousand', 'five million'] },
        { label: '錯誤', items: ['two hundreds', 'three thousands'] }] },
      check: {
        q: '「兩百」的正確說法是什麼？',
        options: ['two hundred', 'two hundreds', 'two of hundred', 'twos hundred'],
        answer: 0,
        why: [
          null,
          '前面有數字時 hundred 不加 s。',
          '不需要加 of。',
          '數字本身不加 s。'
        ]
      }
    },
    {
      title: '③ 時間的說法',
      body: '整點：It is seven o’clock.\n' +
            '幾點幾分：It is seven fifteen.／a quarter past seven。\n' +
            '半點：It is seven thirty.／half past seven。\n' +
            '差幾分：It is a quarter to eight.（七點四十五分）\n' +
            '⚠ past 是「過」、to 是「差」。',
      viz: { type: 'clock', h: 7, m: 45 },
      tip: '拉動指針看時間怎麼變。',
      check: {
        q: 'a quarter to nine 是幾點？',
        options: [
          '八點四十五分',
          '九點十五分',
          '九點四十五分',
          '八點十五分'
        ],
        answer: 0,
        why: [
          null,
          '這會是 a quarter past nine。',
          '這個時間要說 a quarter to ten。',
          '這是 a quarter past eight。'
        ]
      }
    },
    {
      title: '④ 日期的說法',
      body: '美式：October 10, 2026（唸 October tenth）。\n' +
            '英式：10 October 2026（唸 the tenth of October）。\n' +
            '⚠ 日期用序數唸；年份分兩段（2026 → twenty twenty-six）。\n' +
            '月份與星期的首字母要大寫。',
      viz: { type: 'sentence', label: '日期', items: [
        { t: 'October', r: '月份（大寫）' }, { t: '10', r: '日（唸序數）' },
        { t: '2026', r: '年份' }],
        note: '寫數字，唸序數。' },
      check: {
        q: 'October 10 應該怎麼唸？',
        options: [
          'October tenth',
          'October ten',
          'Ten October only',
          'October tens'
        ],
        answer: 0,
        why: [
          null,
          '日期在唸的時候要用序數。',
          '這個語序不是美式的常見唸法。',
          '日期不加複數 s。'
        ]
      }
    },
    {
      title: '⑤ 時間介系詞',
      body: 'at ＋ 時間點（at seven、at noon、at night）。\n' +
            'on ＋ 日期或星期（on Monday、on May 5）。\n' +
            'in ＋ 月份、年份、季節、較長的時段（in May、in 2026、in the morning）。\n' +
            '⚠ 記法：範圍越小用 at，越大用 in。',
      viz: { type: 'classify', groups: [
        { label: 'at', items: ['at seven', 'at noon', 'at night'] },
        { label: 'on', items: ['on Monday', 'on May 5', 'on my birthday'] },
        { label: 'in', items: ['in May', 'in 2026', 'in the morning'] }] },
      check: {
        q: '「在早上」的正確說法是什麼？',
        options: ['in the morning', 'on the morning', 'at the morning', 'to the morning'],
        answer: 0,
        why: [
          null,
          'on 用於日期與星期。',
          'at 用於具體的時間點如 at noon。',
          'to 表示方向或目標。'
        ]
      }
    },
    {
      title: '⑥ 綜合應用',
      body: 'My birthday is on June 5.（我的生日在六月五日。）\n' +
            'School starts at eight in the morning.\n' +
            'We have a test on Friday.\n' +
            '⚠ 一個句子可能同時有多個時間片語，\n' +
            '順序通常是「小到大」：at eight on Friday。',
      viz: { type: 'sentence', label: '多個時間片語', items: [
        { t: 'School starts', r: '主要內容' }, { t: 'at eight', r: '時間點' },
        { t: 'in the morning', r: '時段' }],
        note: '英文的時間片語通常由小到大排列。' },
      check: {
        q: '英文中同時出現「幾點」與「早上」時，順序通常是什麼？',
        options: [
          '先說幾點，再說早上',
          '先說早上，再說幾點',
          '沒有固定順序',
          '兩者不能同時使用'
        ],
        answer: 0,
        why: [
          null,
          '英文習慣由小單位到大單位。',
          '雖然有彈性，但慣例是小到大。',
          '兩者可以同時出現。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第8單元 疑問詞與日常對話'] = {
  intro: '五個 W 加一個 H，幾乎能問出所有你想知道的事。',
  cards: [
    {
      title: '① 六個基本疑問詞',
      body: 'who（誰）、what（什麼）、where（哪裡）、when（何時）、\n' +
            'why（為什麼）、how（如何）。\n' +
            '⚠ 疑問詞放在句首，後面接助動詞或 be 動詞，再接主詞。',
      viz: { type: 'classify', groups: [
        { label: '問人事物', items: ['who', 'what', 'whose', 'which'] },
        { label: '問時間地點', items: ['when', 'where'] },
        { label: '問原因方式', items: ['why', 'how'] }] },
      check: {
        q: '要問「為什麼」，應該用哪一個疑問詞？',
        options: ['why', 'what', 'when', 'where'],
        answer: 0,
        why: [
          null,
          'what 是問什麼東西。',
          'when 是問時間。',
          'where 是問地點。'
        ]
      }
    },
    {
      title: '② 疑問句的語序',
      body: 'be 動詞句：Where is your school?（疑問詞 ＋ be ＋ 主詞）\n' +
            '一般動詞句：Where do you live?（疑問詞 ＋ do／does ＋ 主詞 ＋ 原形動詞）\n' +
            '⚠ 最常見的錯誤是漏掉助動詞：\n' +
            'Where you live? 是錯的。',
      viz: { type: 'sentence', label: 'be 動詞句', items: [
        { t: 'Where', r: '疑問詞' }, { t: 'is', r: 'be 動詞' }, { t: 'your school', r: '主詞' }],
        note: 'be 動詞句直接把 be 動詞放在主詞前面。',
        alt: [
          { label: '一般動詞句', items: [{ t: 'Where', r: '疑問詞' }, { t: 'do', r: '助動詞' },
            { t: 'you', r: '主詞' }, { t: 'live', r: '原形動詞' }],
            note: '一般動詞句要加助動詞 do 或 does。' }] },
      tip: '按按鈕比較兩種語序。',
      check: {
        q: '「你住在哪裡？」的正確說法是什麼？',
        options: [
          'Where do you live?',
          'Where you live?',
          'Where are you live?',
          'Where you do live?'
        ],
        answer: 0,
        why: [
          null,
          '一般動詞的疑問句需要助動詞。',
          '不能同時使用 be 動詞與一般動詞。',
          '助動詞要放在主詞前面。'
        ]
      }
    },
    {
      title: '③ how 的延伸用法',
      body: 'How old（幾歲）、How many（多少個）、How much（多少錢／多少量）、\n' +
            'How often（多常）、How long（多久／多長）、How far（多遠）。\n' +
            '⚠ how 後面加形容詞或副詞，可以問各種程度。',
      viz: { type: 'classify', groups: [
        { label: '問數量', items: ['How many', 'How much'] },
        { label: '問程度', items: ['How old', 'How long', 'How far', 'How often'] }] },
      check: {
        q: '要問「多遠」，應該用哪一個疑問詞組？',
        options: ['How far', 'How long', 'How many', 'How old'],
        answer: 0,
        why: [
          null,
          'How long 問的是長度或持續時間。',
          'How many 問可數的數量。',
          'How old 問年齡。'
        ]
      }
    },
    {
      title: '④ 回答疑問詞問句',
      body: '疑問詞問句「不能」用 Yes／No 回答，要直接回答內容：\n' +
            'Where do you live?→ I live in Taipei.\n' +
            'What time is it?→ It is three o’clock.\n' +
            '⚠ Yes／No 只能回答以 be 動詞或助動詞開頭的問句。',
      viz: { type: 'compareexp',
             factor: '兩種問句',
             a: { label: 'Yes/No 問句', note: 'Do you like it? 可以用 Yes 或 No 回答' },
             b: { label: '疑問詞問句', note: 'What do you like? 要回答具體內容' },
             same: ['都是疑問句'] },
      check: {
        q: 'Where do you live? 這個問題可以用 Yes 回答嗎？',
        options: [
          '不行，疑問詞問句要回答具體內容',
          '可以，任何問句都能用 Yes 回答',
          '可以，但要加上地點',
          '不行，因為這不是問句'
        ],
        answer: 0,
        why: [
          null,
          '疑問詞問句需要具體的資訊。',
          '既然要說地點，就不需要 Yes。',
          '這確實是一個問句。'
        ]
      }
    },
    {
      title: '⑤ 日常對話的組合',
      body: 'A: What do you do after school?　B: I usually play basketball.\n' +
            'A: Where do you play?　B: At the park near my house.\n' +
            'A: How often do you play?　B: About three times a week.\n' +
            '⚠ 用不同的疑問詞可以把話題一層層問下去。',
      viz: { type: 'energyflow', steps: ['What（做什麼）', 'Where（在哪）', 'How often（多常）', 'Why（為什麼）'] },
      check: {
        q: '要讓對話延續下去，比較有效的方式是什麼？',
        options: [
          '用不同的疑問詞繼續追問細節',
          '一直問可以用 Yes 或 No 回答的問題',
          '只說自己的事',
          '沉默不說話'
        ],
        answer: 0,
        why: [
          null,
          '封閉式問題容易讓對話中斷。',
          '單向的表達不算對話。',
          '沉默會讓對話結束。'
        ]
      }
    },
    {
      title: '⑥ 禮貌的問法',
      body: '直接問：What is your name?\n' +
            '較禮貌：May I have your name, please?\n' +
            'Could you tell me where the station is?\n' +
            '⚠ 用 Could you…?／May I…? 開頭會比較客氣，\n' +
            '尤其是對陌生人或長輩。',
      viz: { type: 'compareexp',
             factor: '語氣的差別',
             a: { label: '直接問', note: 'Where is the station? 簡潔明確' },
             b: { label: '客氣問', note: 'Could you tell me…? 較有禮貌' },
             same: ['都是在詢問資訊'] },
      check: {
        q: '向陌生人問路時，比較客氣的說法是什麼？',
        options: [
          'Excuse me, could you tell me where the station is?',
          'Station where?',
          'Tell me the station.',
          'You know the station?'
        ],
        answer: 0,
        why: [
          null,
          '這個說法不完整也不禮貌。',
          '命令式的語氣不適合對陌生人。',
          '這個說法過於隨便。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五上|第9單元 主題字彙與生活用語'] = {
  intro: '把單字依主題整理，記起來會比隨機背快得多。',
  cards: [
    {
      title: '① 用主題記單字',
      body: '把相關的字放在一起記：學校、家庭、食物、動物、天氣、身體。\n' +
            '⚠ 為什麼有效？因為大腦習慣用「關聯」記憶，\n' +
            '而且同主題的字常常一起出現在對話中。',
      viz: { type: 'classify', groups: [
        { label: '學校', items: ['classroom', 'teacher', 'homework', 'test'] },
        { label: '食物', items: ['rice', 'noodles', 'fruit', 'juice'] },
        { label: '天氣', items: ['sunny', 'rainy', 'cloudy', 'windy'] }] },
      check: {
        q: '為什麼「依主題」背單字比隨機背有效？',
        options: [
          '因為相關的字有連結，也常一起出現在真實情境中',
          '因為主題的字比較短',
          '因為主題的字比較少',
          '因為不用理解意思'
        ],
        answer: 0,
        why: [
          null,
          '長度與主題無關。',
          '每個主題的字彙量都不少。',
          '理解意思仍然是必要的。'
        ]
      }
    },
    {
      title: '② 一天中的常用語',
      body: '早上：Good morning.／Did you sleep well?\n' +
            '學校：May I go to the restroom?／I do not understand.\n' +
            '晚上：Good night.／See you tomorrow.\n' +
            '⚠ 這些句子每天都用得到，練熟了就能自然說出口。',
      viz: { type: 'classify', groups: [
        { label: '打招呼', items: ['Good morning', 'How are you', 'See you'] },
        { label: '課堂', items: ['May I…', 'I do not understand', 'Say it again, please'] }] },
      check: {
        q: '上課聽不懂時，可以怎麼說？',
        options: [
          'Sorry, I do not understand. Could you say it again?',
          '什麼都不說',
          'I know everything.',
          'Goodbye.'
        ],
        answer: 0,
        why: [
          null,
          '不說出來就得不到協助。',
          '這個回答與實際狀況不符。',
          '這是道別語，不適合此情境。'
        ]
      }
    },
    {
      title: '③ 表達感受',
      body: 'happy（開心）、sad（難過）、tired（累）、excited（興奮）、\n' +
            'nervous（緊張）、bored（無聊）、angry（生氣）。\n' +
            '⚠ 說感受用 be 動詞：I am tired.（不是 I have tired.）',
      viz: { type: 'sentence', label: '說感受', items: [
        { t: 'I', r: '主詞' }, { t: 'am', r: 'be 動詞' }, { t: 'tired', r: '形容詞' }],
        note: '感受用 be 動詞加形容詞表達。' },
      check: {
        q: '「我很累」的正確說法是什麼？',
        options: [
          'I am tired.',
          'I have tired.',
          'I tired.',
          'I am tire.'
        ],
        answer: 0,
        why: [
          null,
          '感受要用 be 動詞而不是 have。',
          '句子缺少 be 動詞。',
          'tire 是動詞，形容詞要用 tired。'
        ]
      }
    },
    {
      title: '④ 表達需求',
      body: 'I need help.（我需要幫忙。）\n' +
            'Can you help me?（你可以幫我嗎？）\n' +
            'I am looking for…（我在找…）\n' +
            '⚠ 需要幫忙時開口問，比自己卡住更有效。',
      viz: { type: 'sentence', label: '求助', items: [
        { t: 'Can', r: '助動詞' }, { t: 'you', r: '主詞' }, { t: 'help', r: '原形動詞' },
        { t: 'me', r: '受詞' }],
        note: 'help 後面用受格 me 而不是主格 I。' },
      check: {
        q: '「你可以幫我嗎？」的正確說法是什麼？',
        options: [
          'Can you help me?',
          'Can you help I?',
          'Can you helping me?',
          'You can help me?'
        ],
        answer: 0,
        why: [
          null,
          '動詞後面要用受格 me。',
          'can 後面要用原形動詞。',
          '疑問句要把 can 放在句首。'
        ]
      }
    },
    {
      title: '⑤ 常見的固定用語',
      body: 'No problem.（沒問題。）　Never mind.（沒關係。）\n' +
            'It’s up to you.（你決定。）　I am not sure.（我不確定。）\n' +
            'Let me think.（讓我想想。）\n' +
            '⚠ 這些短句在對話中非常好用，能爭取思考的時間。',
      viz: { type: 'classify', groups: [
        { label: '回應', items: ['No problem', 'Never mind', 'Sure'] },
        { label: '爭取時間', items: ['Let me think', 'I am not sure', 'Well…'] }] },
      check: {
        q: '被問到一個需要思考的問題時，可以說什麼爭取時間？',
        options: [
          'Let me think.',
          'I do not want to answer.',
          'Goodbye.',
          'You are wrong.'
        ],
        answer: 0,
        why: [
          null,
          '這個回答顯得不合作。',
          '這是道別，會直接中斷對話。',
          '這個回應不友善也不切題。'
        ]
      }
    },
    {
      title: '⑥ 把單字變成能用的句子',
      body: '學單字的三個步驟：\n' +
            '① 知道意思 ② 知道怎麼唸 ③ 能放進句子裡用出來。\n' +
            '⚠ 只做到第一步，考試會寫但開口說不出來。\n' +
            '練習方法：每學一個字，就用它造一個和自己有關的句子。',
      viz: { type: 'energyflow', steps: ['知道意思', '會唸', '造句', '真的用出來'] },
      check: {
        q: '學會一個新單字之後，最有效的下一步是什麼？',
        options: [
          '用它造一個和自己生活有關的句子',
          '把它抄十遍',
          '背它的所有意思',
          '只記中文翻譯'
        ],
        answer: 0,
        why: [
          null,
          '抄寫幫助拼字，但不一定會用。',
          '先掌握最常用的意思即可。',
          '只記翻譯無法在對話中使用。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第1單元 可數與不可數名詞'] = {
  intro: '英文的名詞分成兩種：能一個一個數的，和不能數的。這個分別影響很多用法。',
  cards: [
    {
      title: '① 什麼是可數名詞',
      body: '可以一個一個數的東西：book、apple、chair、student。\n' +
            '⚠ 特徵：有單複數形（a book／two books），\n' +
            '單數前面要加 a／an 或 the。',
      viz: { type: 'classify', groups: [
        { label: '可數', items: ['book', 'apple', 'chair', 'student', 'idea'] },
        { label: '不可數', items: ['water', 'rice', 'money', 'time', 'information'] }] },
      check: {
        q: '可數名詞最主要的特徵是什麼？',
        options: [
          '有單複數形，可以用數字直接修飾',
          '一定是具體的東西',
          '一定很小',
          '沒有複數形'
        ],
        answer: 0,
        why: [
          null,
          'idea 是抽象的，但可數。',
          '大小與可數性無關。',
          '有複數形正是可數名詞的特徵。'
        ]
      }
    },
    {
      title: '② 什麼是不可數名詞',
      body: '不能一個一個數的：water、rice、bread、milk、money、time、\n' +
            'information、homework、advice。\n' +
            '⚠ 特徵：沒有複數形、不能直接加 a／an、\n' +
            '動詞用單數（Water is important.）。',
      viz: { type: 'classify', groups: [
        { label: '液體與粉狀', items: ['water', 'milk', 'sugar', 'rice'] },
        { label: '抽象概念', items: ['time', 'money', 'information', 'advice'] }] },
      check: {
        q: '下列哪一個是「不可數名詞」？',
        options: ['homework', 'book', 'chair', 'student'],
        answer: 0,
        why: [
          null,
          'book 可以數，有複數 books。',
          'chair 可以數。',
          'student 也可以數。'
        ]
      }
    },
    {
      title: '③ 不可數名詞怎麼計量',
      body: '用「容器或單位」：a glass of water、a cup of tea、\n' +
            'a piece of bread、a bowl of rice、a bottle of milk、\n' +
            'a piece of information。\n' +
            '⚠ 要數的是容器：two glasses of water（glass 加 s，water 不加）。',
      viz: { type: 'sentence', label: '計量單位', items: [
        { t: 'two glasses', r: '容器（複數）' }, { t: 'of', r: '介系詞' },
        { t: 'water', r: '不可數名詞' }],
        note: '複數要加在容器上，不可數名詞本身不變。' },
      check: {
        q: '「三杯茶」的正確說法是什麼？',
        options: [
          'three cups of tea',
          'three cup of teas',
          'three teas cup',
          'three of cup tea'
        ],
        answer: 0,
        why: [
          null,
          '複數要加在 cup 上，tea 不加 s。',
          '語序不正確，容器要放在前面。',
          '這個結構不符合英文用法。'
        ]
      }
    },
    {
      title: '④ 動詞的搭配',
      body: '不可數名詞當主詞時，動詞用「單數」：\n' +
            'Water is important.　Money is not everything.\n' +
            '⚠ 可數名詞的複數當主詞時用複數動詞：\n' +
            'Books are expensive.',
      viz: { type: 'compareexp',
             factor: '動詞的選擇',
             a: { label: '不可數名詞', note: '動詞用單數：Water is…' },
             b: { label: '可數複數', note: '動詞用複數：Books are…' },
             same: ['都是主詞'] },
      check: {
        q: '「時間很寶貴」的正確說法是什麼？',
        options: [
          'Time is precious.',
          'Time are precious.',
          'Times is precious.',
          'A time is precious.'
        ],
        answer: 0,
        why: [
          null,
          '不可數名詞要用單數動詞。',
          'time 在此不可數，不加 s。',
          '不可數名詞前面不加 a。'
        ]
      }
    },
    {
      title: '⑤ 有些字兩種都可以',
      body: '同一個字在不同意思下可數性不同：\n' +
            'time（時間，不可數）／three times（三次，可數）\n' +
            'paper（紙，不可數）／a paper（一份報告或報紙，可數）\n' +
            'hair（頭髮整體，不可數）／two hairs（兩根頭髮，可數）\n' +
            '⚠ 要看句子的意思來判斷。',
      viz: { type: 'compareexp',
             factor: '同字不同用法',
             a: { label: 'time（不可數）', note: '指時間：I have no time.' },
             b: { label: 'times（可數）', note: '指次數：three times' },
             same: ['同一個單字'] },
      check: {
        q: 'three times 中的 time 是什麼意思？',
        options: [
          '次數（可數）',
          '時間（不可數）',
          '時鐘',
          '沒有意義'
        ],
        answer: 0,
        why: [
          null,
          '指時間時不能加 s。',
          '時鐘是 clock。',
          '這個用法有明確的意思。'
        ]
      }
    },
    {
      title: '⑥ 常見錯誤整理',
      body: '① a homework ✗ → some homework ✓\n' +
            '② two informations ✗ → two pieces of information ✓\n' +
            '③ many money ✗ → much money ✓\n' +
            '⚠ many 用於可數、much 用於不可數；\n' +
            'a lot of 兩者都可以用。',
      viz: { type: 'classify', groups: [
        { label: '可數用', items: ['many', 'a few', 'How many'] },
        { label: '不可數用', items: ['much', 'a little', 'How much'] },
        { label: '兩者都可', items: ['a lot of', 'some', 'any'] }] },
      check: {
        q: '「很多錢」的正確說法是什麼？',
        options: [
          'a lot of money',
          'many money',
          'many moneys',
          'much moneys'
        ],
        answer: 0,
        why: [
          null,
          'money 是不可數名詞，不用 many。',
          'money 沒有複數形。',
          'money 不加 s。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第2單元 some／any／a lot of'] = {
  intro: '要說「一些、任何、很多」，英文有一套搭配規則。',
  cards: [
    {
      title: '① some 的用法',
      body: 'some 表示「一些」，可數與不可數都能用：\n' +
            'some books（一些書）、some water（一些水）。\n' +
            '⚠ 主要用在「肯定句」：I have some questions.',
      viz: { type: 'sentence', label: 'some 的用法', items: [
        { t: 'I have', r: '主詞＋動詞' }, { t: 'some', r: '限定詞' },
        { t: 'questions', r: '可數複數' }],
        note: 'some 可以搭配可數複數或不可數名詞。' },
      check: {
        q: 'some 通常用在哪一種句子？',
        options: [
          '肯定句',
          '只有否定句',
          '只有疑問句',
          '只有祈使句'
        ],
        answer: 0,
        why: [
          null,
          '否定句通常用 any。',
          '疑問句通常用 any。',
          'some 不限於祈使句。'
        ]
      }
    },
    {
      title: '② any 的用法',
      body: 'any 主要用在「否定句與疑問句」：\n' +
            'I do not have any money.　Do you have any questions?\n' +
            '⚠ any 在肯定句中意思會變成「任何一個」：\n' +
            'Any student can join.（任何學生都能參加。）',
      viz: { type: 'compareexp',
             factor: 'some 與 any',
             a: { label: 'some', note: '用於肯定句：I have some.' },
             b: { label: 'any', note: '用於否定與疑問：I do not have any.' },
             same: ['都表示不確定的數量'] },
      check: {
        q: '「我沒有任何錢」的正確說法是什麼？',
        options: [
          'I do not have any money.',
          'I do not have some money.',
          'I do not have many money.',
          'I have not some money.'
        ],
        answer: 0,
        why: [
          null,
          '否定句通常用 any 而不是 some。',
          'money 是不可數，不用 many。',
          '一般動詞的否定要用 do not。'
        ]
      }
    },
    {
      title: '③ 提出邀請時的 some',
      body: '疑問句本來用 any，但「提出邀請或請求」時用 some 比較自然：\n' +
            'Would you like some tea?（要喝點茶嗎？）\n' +
            'Can I have some water?（可以給我一些水嗎？）\n' +
            '⚠ 因為說話者預期答案是肯定的。',
      viz: { type: 'compareexp',
             factor: '疑問句中的選擇',
             a: { label: '一般詢問', note: 'Do you have any questions? 用 any' },
             b: { label: '邀請或請求', note: 'Would you like some tea? 用 some' },
             same: ['都是疑問句'] },
      check: {
        q: '要邀請客人喝茶，比較自然的說法是什麼？',
        options: [
          'Would you like some tea?',
          'Would you like any tea?',
          'Do you want any tea or not?',
          'You want tea?'
        ],
        answer: 0,
        why: [
          null,
          '邀請時用 some 比較自然也比較親切。',
          '這個說法語氣生硬。',
          '這個說法不夠禮貌完整。'
        ]
      }
    },
    {
      title: '④ many 與 much',
      body: 'many ＋ 可數名詞複數：many books、many students。\n' +
            'much ＋ 不可數名詞：much water、much money。\n' +
            '⚠ much 在肯定句中較少單獨使用，\n' +
            '常說 a lot of money 而不是 much money。',
      viz: { type: 'classify', groups: [
        { label: 'many（可數）', items: ['many books', 'many people', 'many days'] },
        { label: 'much（不可數）', items: ['much water', 'much time', 'much money'] }] },
      check: {
        q: '「很多學生」的正確說法是什麼？',
        options: [
          'many students',
          'much students',
          'many student',
          'much student'
        ],
        answer: 0,
        why: [
          null,
          'student 是可數名詞，要用 many。',
          '可數名詞要用複數形。',
          '這個組合有兩個錯誤。'
        ]
      }
    },
    {
      title: '⑤ a lot of 與 lots of',
      body: 'a lot of（＝ lots of）可數與不可數都能用：\n' +
            'a lot of books、a lot of water。\n' +
            '⚠ 這是最安全的說法，不確定時可以用它。\n' +
            '正式寫作中則多用 many／much。',
      viz: { type: 'classify', groups: [
        { label: '通用', items: ['a lot of', 'lots of', 'plenty of'] },
        { label: '限可數', items: ['many', 'a few', 'several'] },
        { label: '限不可數', items: ['much', 'a little'] }] },
      check: {
        q: '如果不確定名詞是可數還是不可數，用哪一個說法比較安全？',
        options: [
          'a lot of',
          'many',
          'much',
          'a few'
        ],
        answer: 0,
        why: [
          null,
          'many 只能用於可數名詞。',
          'much 只能用於不可數名詞。',
          'a few 只能用於可數名詞。'
        ]
      }
    },
    {
      title: '⑥ a few 與 a little',
      body: 'a few ＋ 可數複數（a few books：有幾本，語氣偏正面）。\n' +
            'a little ＋ 不可數（a little water：有一點）。\n' +
            '⚠ 去掉 a 語氣會變負面：\n' +
            'few books（幾乎沒有書）、little water（幾乎沒有水）。',
      viz: { type: 'compareexp',
             factor: '有沒有 a',
             a: { label: 'a few／a little', note: '有一些，語氣正面' },
             b: { label: 'few／little', note: '幾乎沒有，語氣負面' },
             same: ['都表示少量'] },
      check: {
        q: 'I have few friends. 這句話的意思偏向什麼？',
        options: [
          '我幾乎沒有朋友（語氣負面）',
          '我有一些朋友（語氣正面）',
          '我有很多朋友',
          '我沒有任何朋友'
        ],
        answer: 0,
        why: [
          null,
          '要表達正面語氣要說 a few。',
          '這個說法表示數量很少。',
          '完全沒有要說 no friends。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第3單元 所有格'] = {
  intro: '要說「誰的東西」，英文有兩種方法：加撇號 s，或用所有格代名詞。',
  cards: [
    {
      title: '① 名詞所有格',
      body: '人或動物加 ’s：Amy’s book（Amy 的書）、the dog’s tail（狗的尾巴）。\n' +
            '⚠ 複數字尾是 s 時只加撇號：the students’ books（學生們的書）。\n' +
            '不規則複數仍加 ’s：children’s books。',
      viz: { type: 'classify', groups: [
        { label: '加 ’s', items: ['Amy’s', 'the dog’s', 'children’s'] },
        { label: '只加撇號', items: ['the students’', 'the teachers’'] }] },
      check: {
        q: '「學生們的教室」（複數）的正確寫法是什麼？',
        options: [
          'the students’ classroom',
          'the students’s classroom',
          'the student’s classroom',
          'the students classroom'
        ],
        answer: 0,
        why: [
          null,
          '字尾已有 s 時只加撇號。',
          '這個寫法表示單一學生。',
          '缺少表示所有格的撇號。'
        ]
      }
    },
    {
      title: '② of 所有格',
      body: '無生命的東西通常用 of：\n' +
            'the door of the room（房間的門）、the name of the book。\n' +
            '⚠ 但時間、國家、機構也可以用 ’s：\n' +
            'today’s newspaper、Taiwan’s economy。',
      viz: { type: 'compareexp',
             factor: '兩種所有格',
             a: { label: '’s', note: '用於人、動物、時間、國家' },
             b: { label: 'of', note: '用於無生命的東西' },
             same: ['都表示所有關係'] },
      check: {
        q: '「這本書的書名」比較自然的說法是什麼？',
        options: [
          'the name of the book',
          'the book’s name is best always',
          'the name book',
          'book the name of'
        ],
        answer: 0,
        why: [
          null,
          '這個說法雖可用，但選項的敘述不正確。',
          '這個說法缺少必要的結構。',
          '語序不正確，不符合英文結構。'
        ]
      }
    },
    {
      title: '③ 所有格形容詞',
      body: 'my、your、his、her、its、our、their。\n' +
            '⚠ 後面「一定要接名詞」：my book、your bag。\n' +
            '注意 its（它的）沒有撇號；it’s 是 it is 的縮寫。',
      viz: { type: 'classify', groups: [
        { label: '所有格形容詞', items: ['my', 'your', 'his', 'her', 'its', 'our', 'their'] },
        { label: '常見混淆', items: ['its（它的）', 'it’s（it is）'] }] },
      check: {
        q: 'its 和 it’s 的差別是什麼？',
        options: [
          'its 是「它的」，it’s 是 it is 的縮寫',
          '兩者完全相同',
          'its 是縮寫',
          'it’s 表示所有'
        ],
        answer: 0,
        why: [
          null,
          '兩者的意思完全不同。',
          '有撇號的 it’s 才是縮寫。',
          '表示所有的是沒有撇號的 its。'
        ]
      }
    },
    {
      title: '④ 所有格代名詞',
      body: 'mine、yours、his、hers、ours、theirs。\n' +
            '⚠ 後面「不接名詞」，因為它本身就代表「某人的東西」：\n' +
            'This book is mine.（＝ my book）',
      viz: { type: 'compareexp',
             factor: '兩種形式',
             a: { label: '所有格形容詞', note: '後面接名詞：my book' },
             b: { label: '所有格代名詞', note: '後面不接名詞：mine' },
             same: ['都表示所有關係'] },
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'This book is mine.',
          'This book is my.',
          'This is mine book.',
          'This book is me.'
        ],
        answer: 0,
        why: [
          null,
          'my 後面一定要接名詞。',
          'mine 後面不接名詞。',
          'me 是受格，不表示所有。'
        ]
      }
    },
    {
      title: '⑤ 問所有者',
      body: 'Whose book is this?（這是誰的書？）→ It is Amy’s.／It is mine.\n' +
            '⚠ whose（誰的）與 who’s（who is）發音相同但意思不同，\n' +
            '這是常見的拼字陷阱。',
      viz: { type: 'sentence', label: '問所有者', items: [
        { t: 'Whose', r: '疑問詞' }, { t: 'book', r: '名詞' }, { t: 'is this', r: 'be＋主詞' }],
        note: 'Whose 後面直接接名詞。' },
      check: {
        q: '「這是誰的書？」的正確寫法是什麼？',
        options: [
          'Whose book is this?',
          'Who’s book is this?',
          'Who book is this?',
          'Whose is book this?'
        ],
        answer: 0,
        why: [
          null,
          'who’s 是 who is 的縮寫，意思不同。',
          '要用 whose 才能表示所有。',
          '語序不正確，不符合英文結構。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'This is my brother’s bike.（這是我哥哥的腳踏車。）\n' +
            'That bag is hers, not mine.（那個包包是她的，不是我的。）\n' +
            'Whose pen is this? It is the teacher’s.\n' +
            '⚠ 同一句中可能同時出現不同形式，要看後面有沒有名詞來判斷。',
      viz: { type: 'sentence', label: '雙重所有格', items: [
        { t: 'my brother’s', r: '名詞所有格' }, { t: 'bike', r: '名詞' }],
        note: 'my 修飾 brother，brother’s 修飾 bike。' },
      check: {
        q: '要判斷該用 my 還是 mine，最簡單的方法是什麼？',
        options: [
          '看後面有沒有名詞：有名詞用 my，沒有用 mine',
          '看句子長短',
          '看主詞是誰',
          '隨便用都可以'
        ],
        answer: 0,
        why: [
          null,
          '句子長度與此無關。',
          '主詞不決定所有格的形式。',
          '兩者的用法有明確區別。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第4單元 受格代名詞'] = {
  intro: '同一個人，當主詞時是 I，當受詞時就變成 me——英文的代名詞會換形式。',
  cards: [
    {
      title: '① 主格與受格',
      body: '主格（當主詞）：I、you、he、she、it、we、they。\n' +
            '受格（當受詞）：me、you、him、her、it、us、them。\n' +
            '⚠ you 與 it 的主格受格同形，其餘都會變。',
      viz: { type: 'classify', groups: [
        { label: '主格', items: ['I', 'he', 'she', 'we', 'they'] },
        { label: '受格', items: ['me', 'him', 'her', 'us', 'them'] }] },
      check: {
        q: 'he 的受格是什麼？',
        options: ['him', 'his', 'he', 'himself'],
        answer: 0,
        why: [
          null,
          'his 是所有格而不是受格。',
          'he 是主格，用在主詞的位置。',
          'himself 是反身代名詞。'
        ]
      }
    },
    {
      title: '② 受格用在哪裡',
      body: '① 動詞後面：I like him.（我喜歡他。）\n' +
            '② 介系詞後面：This is for her.（這是給她的。）\n' +
            '⚠ 常見錯誤：between you and I ✗ → between you and me ✓\n' +
            '因為介系詞 between 後面要用受格。',
      viz: { type: 'sentence', label: '動詞後', items: [
        { t: 'I', r: '主格（主詞）' }, { t: 'like', r: '動詞' }, { t: 'him', r: '受格（受詞）' }],
        note: '動詞後面要用受格。',
        alt: [
          { label: '介系詞後', items: [{ t: 'This is', r: '主詞＋be' }, { t: 'for', r: '介系詞' },
            { t: 'her', r: '受格' }], note: '介系詞後面也要用受格。' }] },
      tip: '按按鈕比較兩種位置。',
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'This present is for me.',
          'This present is for I.',
          'This present is for my.',
          'This present is for mine me.'
        ],
        answer: 0,
        why: [
          null,
          '介系詞後面要用受格 me。',
          'my 是所有格，後面要接名詞。',
          '這個說法重複又不正確。'
        ]
      }
    },
    {
      title: '③ 代名詞的四種形式',
      body: '以第三人稱女性為例：\n' +
            '主格 she、受格 her、所有格形容詞 her、所有格代名詞 hers。\n' +
            '⚠ her 有兩種身分（受格與所有格），要看後面有沒有名詞：\n' +
            'I like her.（受格）／her book（所有格）。',
      viz: { type: 'classify', groups: [
        { label: '主格', items: ['I', 'you', 'he', 'she', 'they'] },
        { label: '受格', items: ['me', 'you', 'him', 'her', 'them'] },
        { label: '所有格', items: ['my', 'your', 'his', 'her', 'their'] },
        { label: '所有格代名詞', items: ['mine', 'yours', 'his', 'hers', 'theirs'] }] },
      check: {
        q: '在 I like her book. 這句話中，her 是什麼？',
        options: [
          '所有格形容詞，因為後面接了名詞',
          '受格，因為在動詞後面',
          '主格',
          '所有格代名詞'
        ],
        answer: 0,
        why: [
          null,
          '受格後面不會再接名詞。',
          '主格用在主詞位置。',
          '所有格代名詞後面不接名詞。'
        ]
      }
    },
    {
      title: '④ it 的用法',
      body: 'it 可以指物品、動物，也可以當「虛主詞」：\n' +
            'It is raining.（下雨了。）　It is three o’clock.\n' +
            '⚠ 這時的 it 沒有實際意義，只是句子需要主詞。',
      viz: { type: 'sentence', label: '虛主詞', items: [
        { t: 'It', r: '虛主詞（無意義）' }, { t: 'is', r: 'be 動詞' },
        { t: 'raining', r: '動詞-ing' }],
        note: '天氣、時間、距離的句子用 it 當主詞。' },
      check: {
        q: 'It is raining. 這句話中的 it 指的是什麼？',
        options: [
          '沒有實際意義，只是句子需要主詞',
          '指某個物品',
          '指某個人',
          '指雨滴'
        ],
        answer: 0,
        why: [
          null,
          '這裡的 it 不指涉具體物品。',
          'it 不用於指人。',
          '這是文法上的需要而非指涉雨滴。'
        ]
      }
    },
    {
      title: '⑤ 常見錯誤',
      body: '① Me and my friend went… ✗ → My friend and I went… ✓\n' +
            '（當主詞要用主格，而且習慣把自己放後面）\n' +
            '② He gave it to I. ✗ → He gave it to me. ✓\n' +
            '⚠ 判斷方法：把句子拆開只留自己，看哪個順口。',
      viz: { type: 'energyflow', steps: ['看代名詞的位置', '是主詞用主格', '是受詞用受格', '檢查一次'] },
      check: {
        q: '要判斷該用 I 還是 me，最實用的方法是什麼？',
        options: [
          '看它在句中是主詞還是受詞',
          '看句子長短',
          '哪個順口用哪個',
          '永遠用 me'
        ],
        answer: 0,
        why: [
          null,
          '句子長度與此無關。',
          '語感可能出錯，仍要看文法功能。',
          '當主詞時必須用 I。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'She gave me a book. I thanked her.\n' +
            'We invited them, and they came with us.\n' +
            '⚠ 同一句中主格與受格可能同時出現，\n' +
            '判斷關鍵永遠是「它在句中扮演什麼角色」。',
      viz: { type: 'sentence', label: '雙受詞', items: [
        { t: 'She', r: '主格' }, { t: 'gave', r: '動詞' }, { t: 'me', r: '受格' },
        { t: 'a book', r: '受詞' }],
        note: '有些動詞後面可以接兩個受詞。' },
      check: {
        q: '在 She gave me a book. 這句話中，me 的角色是什麼？',
        options: [
          '受詞（接受東西的人）',
          '主詞',
          '所有格',
          '動詞'
        ],
        answer: 0,
        why: [
          null,
          '主詞是 She。',
          '所有格後面要接名詞。',
          '動詞是 gave。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第5單元 冠詞與指示詞'] = {
  intro: 'a、an、the 這三個小字，是英文最常用也最容易錯的部分。',
  cards: [
    {
      title: '① a 與 an',
      body: '單數可數名詞第一次提到時用 a／an（表示「一個」）。\n' +
            'a ＋ 子音開頭的音：a book、a dog。\n' +
            'an ＋ 母音開頭的音：an apple、an egg、an hour。\n' +
            '⚠ 看的是「發音」不是字母：an hour（h 不發音）、a university（u 發 you 的音）。',
      viz: { type: 'classify', groups: [
        { label: '用 a', items: ['a book', 'a university', 'a European'] },
        { label: '用 an', items: ['an apple', 'an hour', 'an honest man'] }] },
      check: {
        q: '為什麼是 an hour 而不是 a hour？',
        options: [
          '因為 hour 的 h 不發音，實際上以母音開頭',
          '因為 hour 很長',
          '因為 hour 是時間',
          '因為這是特例沒有原因'
        ],
        answer: 0,
        why: [
          null,
          '長度與冠詞的選擇無關。',
          '詞義不決定用 a 還是 an。',
          '這其實符合「看發音」的規則。'
        ]
      }
    },
    {
      title: '② the 的用法',
      body: '① 再次提到已知的事物：I bought a book. The book is interesting.\n' +
            '② 世界上獨一無二的：the sun、the moon、the earth。\n' +
            '③ 說話雙方都知道的：Close the door.\n' +
            '⚠ the 表示「特定的那一個」。',
      viz: { type: 'compareexp',
             factor: 'a 與 the',
             a: { label: 'a', note: '第一次提到、不特定的一個' },
             b: { label: 'the', note: '雙方都知道的特定那一個' },
             same: ['都是冠詞'] },
      check: {
        q: '「我買了一本書。那本書很有趣。」第二句應該用哪個冠詞？',
        options: [
          'the，因為指的是剛才提過的那本書',
          'a，因為還是同一本書',
          '不需要冠詞',
          'an，因為 book 是可數名詞'
        ],
        answer: 0,
        why: [
          null,
          '第二次提到要用 the。',
          '單數可數名詞前面需要冠詞。',
          'book 以子音開頭，也不該用 an。'
        ]
      }
    },
    {
      title: '③ 不用冠詞的情況',
      body: '① 複數名詞泛指：I like dogs.（我喜歡狗這種動物。）\n' +
            '② 不可數名詞泛指：Water is important.\n' +
            '③ 三餐、運動、學科：have breakfast、play tennis、study math。\n' +
            '⚠ 但特指時仍要加 the：The water in this cup is cold.',
      viz: { type: 'classify', groups: [
        { label: '不加冠詞', items: ['I like dogs', 'have lunch', 'play soccer'] },
        { label: '要加 the', items: ['the dog over there', 'the water in the cup'] }] },
      check: {
        q: '「我喜歡狗（這種動物）」的正確說法是什麼？',
        options: [
          'I like dogs.',
          'I like a dogs.',
          'I like the dogs.',
          'I like dog.'
        ],
        answer: 0,
        why: [
          null,
          'a 不能配複數名詞。',
          '加 the 表示特定的那幾隻狗。',
          '泛指時可數名詞要用複數。'
        ]
      }
    },
    {
      title: '④ 指示詞',
      body: 'this（這個，單數近）、these（這些，複數近）、\n' +
            'that（那個，單數遠）、those（那些，複數遠）。\n' +
            '⚠ 這四個字要同時考慮「遠近」與「單複數」。',
      viz: { type: 'classify', groups: [
        { label: '近（this/these）', items: ['this book', 'these books'] },
        { label: '遠（that/those）', items: ['that book', 'those books'] }] },
      check: {
        q: '要指遠處的幾本書，應該用哪一個字？',
        options: ['those', 'this', 'that', 'these'],
        answer: 0,
        why: [
          null,
          'this 指近處的單一物品。',
          'that 指遠處的單一物品。',
          'these 指近處的多個物品。'
        ]
      }
    },
    {
      title: '⑤ 指示詞當主詞',
      body: 'This is my book.（單數用 is）\n' +
            'These are my books.（複數用 are）\n' +
            '⚠ 常見錯誤：These is… ✗\n' +
            '指示詞的單複數要和 be 動詞一致。',
      viz: { type: 'sentence', label: '單數', items: [
        { t: 'This', r: '指示詞（單數）' }, { t: 'is', r: 'be 動詞' },
        { t: 'my book', r: '補語' }],
        note: '單數指示詞配 is。',
        alt: [
          { label: '複數', items: [{ t: 'These', r: '指示詞（複數）' }, { t: 'are', r: 'be 動詞' },
            { t: 'my books', r: '補語' }], note: '複數指示詞配 are。' }] },
      check: {
        q: '「這些是我的書」的正確說法是什麼？',
        options: [
          'These are my books.',
          'These is my books.',
          'This are my books.',
          'These are my book.'
        ],
        answer: 0,
        why: [
          null,
          '複數指示詞要配 are。',
          'this 是單數，不能配 are。',
          '複數的補語也要用複數形。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'I have a cat. The cat is white.\n' +
            'These are my friends. That is our teacher.\n' +
            'I do not like milk, but I like the milk in this bottle.\n' +
            '⚠ 判斷順序：① 是特定的嗎？→ the ② 單數第一次提到？→ a／an\n' +
            '③ 泛指複數或不可數？→ 不加冠詞。',
      viz: { type: 'energyflow', steps: ['是特定的嗎', '是單數嗎', '是第一次提到嗎', '選出冠詞'] },
      check: {
        q: '判斷該用哪一個冠詞時，第一個要問的問題是什麼？',
        options: [
          '這個名詞是不是「特定的那一個」',
          '這個字有幾個字母',
          '這個字好不好唸',
          '句子有多長'
        ],
        answer: 0,
        why: [
          null,
          '字母數與冠詞無關。',
          '發音只影響 a 與 an 的選擇。',
          '句子長度不影響冠詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第6單元 五感與描述'] = {
  intro: '看起來、聽起來、嚐起來——用五感描述，句子會變得生動。',
  cards: [
    {
      title: '① 五感動詞',
      body: 'look（看起來）、sound（聽起來）、taste（嚐起來）、\n' +
            'smell（聞起來）、feel（摸起來／感覺）。\n' +
            '⚠ 這些動詞後面「直接接形容詞」：\n' +
            'It looks good.（不是 It looks well.）',
      viz: { type: 'sentence', label: '五感動詞', items: [
        { t: 'It', r: '主詞' }, { t: 'looks', r: '五感動詞' }, { t: 'good', r: '形容詞' }],
        note: '五感動詞後面直接接形容詞。' },
      check: {
        q: '「這聞起來很香」的正確說法是什麼？',
        options: [
          'It smells good.',
          'It smells well.',
          'It smells goodly.',
          'It is smell good.'
        ],
        answer: 0,
        why: [
          null,
          'well 是副詞，這裡要用形容詞。',
          'good 沒有 goodly 這種形式。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '② 五感動詞 ＋ like',
      body: '要接「名詞」時，中間要加 like：\n' +
            'It tastes like chicken.（嚐起來像雞肉。）\n' +
            'It sounds like a good idea.\n' +
            '⚠ 接形容詞不加 like，接名詞才加 like。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: '接形容詞', note: 'It looks nice. 不加 like' },
             b: { label: '接名詞', note: 'It looks like a cat. 要加 like' },
             same: ['都用五感動詞'] },
      check: {
        q: '「它嚐起來像雞肉」的正確說法是什麼？',
        options: [
          'It tastes like chicken.',
          'It tastes chicken.',
          'It tastes as chicken.',
          'It is taste like chicken.'
        ],
        answer: 0,
        why: [
          null,
          '接名詞時要加 like。',
          '這個用法不自然。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '③ 描述外觀',
      body: 'beautiful（美麗）、cute（可愛）、tall／short、big／small、\n' +
            'new／old、clean／dirty、bright（明亮）、dark（暗）。\n' +
            '⚠ 描述人時要注意用詞的禮貌，例如用 large 比 fat 委婉。',
      viz: { type: 'classify', groups: [
        { label: '外觀', items: ['beautiful', 'cute', 'clean', 'bright'] },
        { label: '尺寸', items: ['big', 'small', 'tall', 'short'] }] },
      check: {
        q: '五感動詞 look 後面應該接什麼詞類？',
        options: [
          '形容詞',
          '副詞',
          '動詞',
          '介系詞'
        ],
        answer: 0,
        why: [
          null,
          '副詞用來修飾一般動詞。',
          '一個句子只需要一個主要動詞。',
          '介系詞後面要接名詞。'
        ]
      }
    },
    {
      title: '④ 描述聲音與味道',
      body: '聲音：loud（大聲）、quiet（安靜）、noisy（吵鬧）、beautiful。\n' +
            '味道：sweet、sour、salty、spicy、bitter、delicious。\n' +
            '氣味：fresh（新鮮）、strong（強烈）。\n' +
            '⚠ 用五感描述能讓文章更有畫面。',
      viz: { type: 'classify', groups: [
        { label: '聲音', items: ['loud', 'quiet', 'noisy'] },
        { label: '味道', items: ['sweet', 'sour', 'salty', 'spicy'] },
        { label: '氣味', items: ['fresh', 'strong'] }] },
      check: {
        q: '「這音樂聽起來很美」的正確說法是什麼？',
        options: [
          'The music sounds beautiful.',
          'The music sounds beautifully.',
          'The music is sound beautiful.',
          'The music hears beautiful.'
        ],
        answer: 0,
        why: [
          null,
          '五感動詞後面用形容詞。',
          '不能同時使用 be 動詞與一般動詞。',
          'hear 是主動去聽，用法不同。'
        ]
      }
    },
    {
      title: '⑤ 描述感受',
      body: 'I feel happy.（我覺得開心。）\n' +
            'I feel tired.（我覺得累。）\n' +
            '⚠ feel 後面接形容詞描述感受；\n' +
            'feel like ＋ 動詞-ing 表示「想要做」：I feel like eating.',
      viz: { type: 'compareexp',
             factor: 'feel 的兩種用法',
             a: { label: 'feel ＋ 形容詞', note: '描述感受：I feel tired.' },
             b: { label: 'feel like ＋ -ing', note: '想要做：I feel like eating.' },
             same: ['都用動詞 feel'] },
      check: {
        q: '「我想吃東西」的正確說法是什麼？',
        options: [
          'I feel like eating something.',
          'I feel like eat something.',
          'I feel eating something.',
          'I feel to eat something.'
        ],
        answer: 0,
        why: [
          null,
          'feel like 後面要接動詞-ing。',
          '缺少 like 意思會改變。',
          'feel like 後面不接不定詞。'
        ]
      }
    },
    {
      title: '⑥ 用五感寫描述',
      body: '練習：描述一個地方或一道菜。\n' +
            'The night market is very noisy. It smells delicious.\n' +
            'The food looks colorful and tastes great.\n' +
            '⚠ 用兩三種感官描述同一個對象，讀者更容易身歷其境。',
      viz: { type: 'energyflow', steps: ['看到什麼', '聽到什麼', '聞到什麼', '嚐起來如何'] },
      check: {
        q: '要讓描述更生動，可以怎麼做？',
        options: [
          '用不同的感官（視覺、聽覺、嗅覺）一起描述',
          '只用最長的形容詞',
          '重複同一個形容詞',
          '只寫看到的'
        ],
        answer: 0,
        why: [
          null,
          '字的長短不影響生動程度。',
          '重複會讓文章單調。',
          '只用視覺會少了很多層次。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第7單元 節慶與慶祝'] = {
  intro: '節慶是文化的窗口——學節慶英文，也是在認識別人的生活。',
  cards: [
    {
      title: '① 西方主要節日',
      body: 'New Year’s Day（元旦，1/1）、Valentine’s Day（情人節，2/14）、\n' +
            'Easter（復活節）、Halloween（萬聖節，10/31）、\n' +
            'Thanksgiving（感恩節）、Christmas（聖誕節，12/25）。\n' +
            '⚠ 節日名稱的首字母要大寫。',
      viz: { type: 'timeline', events: [
        { y: '1/1', t: 'New Year', d: '元旦，慶祝新的一年開始。' },
        { y: '2/14', t: 'Valentine', d: '情人節，交換卡片與禮物。' },
        { y: '10/31', t: 'Halloween', d: '萬聖節，變裝與要糖果。' },
        { y: '12/25', t: 'Christmas', d: '聖誕節，家人團聚與交換禮物。' }] },
      tip: '按「下一個」看一年的節日。',
      check: {
        q: '萬聖節（Halloween）是在哪一天？',
        options: ['10 月 31 日', '12 月 25 日', '2 月 14 日', '1 月 1 日'],
        answer: 0,
        why: [
          null,
          '12 月 25 日是聖誕節。',
          '2 月 14 日是情人節。',
          '1 月 1 日是元旦。'
        ]
      }
    },
    {
      title: '② 台灣的節日',
      body: 'Chinese New Year（農曆新年）、Lantern Festival（元宵節）、\n' +
            'Tomb Sweeping Day（清明節）、Dragon Boat Festival（端午節）、\n' +
            'Mid-Autumn Festival（中秋節）。\n' +
            '⚠ 介紹自己的文化時，這些說法很實用。',
      viz: { type: 'classify', groups: [
        { label: '台灣節日', items: ['Chinese New Year', 'Dragon Boat Festival', 'Mid-Autumn Festival'] },
        { label: '相關活動', items: ['red envelopes', 'dragon boat races', 'moon cakes'] }] },
      check: {
        q: '「端午節」的英文是什麼？',
        options: [
          'Dragon Boat Festival',
          'Moon Festival',
          'Lantern Festival',
          'Spring Festival'
        ],
        answer: 0,
        why: [
          null,
          'Moon Festival 是中秋節。',
          'Lantern Festival 是元宵節。',
          'Spring Festival 是農曆新年。'
        ]
      }
    },
    {
      title: '③ 節慶活動的動詞',
      body: 'celebrate（慶祝）、decorate（裝飾）、give gifts（送禮）、\n' +
            'have a party（開派對）、visit relatives（拜訪親戚）、\n' +
            'watch fireworks（看煙火）、set off firecrackers（放鞭炮）。',
      viz: { type: 'classify', groups: [
        { label: '準備', items: ['decorate', 'buy gifts', 'clean the house'] },
        { label: '慶祝', items: ['celebrate', 'have a party', 'watch fireworks'] }] },
      check: {
        q: '「慶祝」的英文動詞是什麼？',
        options: ['celebrate', 'decorate', 'donate', 'create'],
        answer: 0,
        why: [
          null,
          'decorate 是裝飾。',
          'donate 是捐贈。',
          'create 是創造。'
        ]
      }
    },
    {
      title: '④ 節慶祝賀語',
      body: 'Happy New Year!　Merry Christmas!　Happy birthday!\n' +
            '⚠ 注意搭配：聖誕節習慣用 Merry 而不是 Happy；\n' +
            '其他節日多用 Happy。',
      viz: { type: 'classify', groups: [
        { label: '用 Happy', items: ['Happy New Year', 'Happy birthday', 'Happy Halloween'] },
        { label: '用 Merry', items: ['Merry Christmas'] }] },
      check: {
        q: '聖誕節的祝賀語習慣怎麼說？',
        options: [
          'Merry Christmas!',
          'Happy Christmas Day only!',
          'Good Christmas!',
          'Nice Christmas!'
        ],
        answer: 0,
        why: [
          null,
          '英式英文偶爾用 Happy，但這個說法不自然。',
          'Good 不用於節慶祝賀。',
          'Nice 不是節慶的祝賀用語。'
        ]
      }
    },
    {
      title: '⑤ 介紹自己的節慶',
      body: '句型：\n' +
            'We celebrate Mid-Autumn Festival in September or October.\n' +
            'We eat moon cakes and pomelos.\n' +
            'Families get together and enjoy the full moon.\n' +
            '⚠ 介紹順序：什麼時候 → 做什麼 → 有什麼意義。',
      viz: { type: 'energyflow', steps: ['什麼時候', '吃什麼', '做什麼活動', '有什麼意義'] },
      check: {
        q: '向外國朋友介紹台灣節慶時，比較完整的內容應該包含什麼？',
        options: [
          '時間、活動與背後的意義',
          '只說節日名稱',
          '只說放幾天假',
          '只說吃什麼'
        ],
        answer: 0,
        why: [
          null,
          '只有名稱無法讓對方理解。',
          '假期長短不是文化重點。',
          '食物只是其中一部分。'
        ]
      }
    },
    {
      title: '⑥ 文化差異的尊重',
      body: '不同文化的節慶有不同的禁忌與禮節：\n' +
            '送禮的顏色、數字、拜訪的時間都可能有講究。\n' +
            '⚠ 不確定時可以問：Is it OK if I…?\n' +
            '願意詢問本身就是一種尊重。',
      viz: { type: 'sentence', label: '禮貌詢問', items: [
        { t: 'Is it OK', r: '詢問' }, { t: 'if I', r: '假設' },
        { t: 'take a photo', r: '動作' }],
        note: '不確定時先問，是尊重對方文化的表現。' },
      check: {
        q: '參加不熟悉的文化活動時，最恰當的態度是什麼？',
        options: [
          '事先了解禮節，不確定時禮貌詢問',
          '照自己的習慣做就好',
          '避免參加',
          '批評不合理的規矩'
        ],
        answer: 0,
        why: [
          null,
          '不同文化的禮節可能差很多。',
          '參與是理解文化的好機會。',
          '在別人的場合公開批評並不尊重。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第8單元 校園活動與社團'] = {
  intro: '運動會、社團、比賽——這些是校園生活最有記憶點的部分。',
  cards: [
    {
      title: '① 校園活動',
      body: 'sports day（運動會）、field trip（校外教學）、\n' +
            'school festival（校慶）、graduation（畢業典禮）、\n' +
            'speech contest（演講比賽）、singing contest（歌唱比賽）。',
      viz: { type: 'classify', groups: [
        { label: '活動', items: ['sports day', 'field trip', 'graduation'] },
        { label: '比賽', items: ['speech contest', 'singing contest', 'science fair'] }] },
      check: {
        q: '「校外教學」的英文是什麼？',
        options: ['field trip', 'sports day', 'graduation', 'homework'],
        answer: 0,
        why: [
          null,
          'sports day 是運動會。',
          'graduation 是畢業典禮。',
          'homework 是家庭作業。'
        ]
      }
    },
    {
      title: '② 社團活動',
      body: 'club（社團）：art club、music club、English club、\n' +
            'basketball team、school band（管樂隊）。\n' +
            '⚠ 「參加社團」用 join：I joined the art club.\n' +
            '「是社團成員」用 be in：I am in the art club.',
      viz: { type: 'compareexp',
             factor: '兩種說法',
             a: { label: 'join', note: '加入的動作：I joined the club.' },
             b: { label: 'be in', note: '目前的狀態：I am in the club.' },
             same: ['都與社團有關'] },
      check: {
        q: '「我參加了美術社」的正確說法是什麼？',
        options: [
          'I joined the art club.',
          'I join in the art club yesterday.',
          'I am join the art club.',
          'I joined to the art club.'
        ],
        answer: 0,
        why: [
          null,
          '過去的動作要用過去式，而且 join 後面不加 in。',
          '不能同時使用 be 動詞與一般動詞。',
          'join 後面不加 to。'
        ]
      }
    },
    {
      title: '③ 談論活動',
      body: 'When is the sports day?（運動會是什麼時候？）\n' +
            'What events are there?（有哪些項目？）\n' +
            'I am going to run the 100-meter race.\n' +
            '⚠ 100-meter 當形容詞用時 meter 不加 s。',
      viz: { type: 'sentence', label: '談活動', items: [
        { t: 'I am going to', r: '未來計畫' }, { t: 'run', r: '原形動詞' },
        { t: 'the 100-meter race', r: '項目' }],
        note: 'be going to 用來表達計畫要做的事。' },
      check: {
        q: '「一百公尺賽跑」當作項目名稱時，正確的寫法是什麼？',
        options: [
          'the 100-meter race',
          'the 100-meters race',
          'the 100 meter races',
          'the race of 100 meters long'
        ],
        answer: 0,
        why: [
          null,
          '當形容詞用時單位不加 s。',
          '這個說法的單複數不一致。',
          '這個說法冗長且不自然。'
        ]
      }
    },
    {
      title: '④ 邀請與合作',
      body: 'Do you want to join us?（你要加入我們嗎？）\n' +
            'Let’s work together.（我們一起努力。）\n' +
            'Can you help me with the poster?（你可以幫我做海報嗎？）\n' +
            '⚠ help someone with something 是固定用法。',
      viz: { type: 'sentence', label: '請求協助', items: [
        { t: 'Can you help', r: '請求' }, { t: 'me', r: '受格' },
        { t: 'with the poster', r: '協助的事項' }],
        note: 'help ＋ 人 ＋ with ＋ 事情。' },
      check: {
        q: '「你可以幫我做作業嗎？」的正確說法是什麼？',
        options: [
          'Can you help me with my homework?',
          'Can you help me my homework?',
          'Can you help with me my homework?',
          'Can you help I with homework?'
        ],
        answer: 0,
        why: [
          null,
          '缺少介系詞 with。',
          'with 的位置不正確。',
          '動詞後面要用受格 me。'
        ]
      }
    },
    {
      title: '⑤ 描述經驗',
      body: 'It was fun!（很好玩！）　We had a great time.（我們玩得很開心。）\n' +
            'I learned a lot.（我學到很多。）\n' +
            '⚠ 描述過去的活動要用過去式：was、had、learned。',
      viz: { type: 'tense', verb: 'play', highlight: '過去簡單式' },
      tip: '按按鈕比較不同時態。',
      check: {
        q: '描述昨天發生的活動，應該用什麼時態？',
        options: [
          '過去簡單式',
          '現在簡單式',
          '現在進行式',
          '未來式'
        ],
        answer: 0,
        why: [
          null,
          '現在式用於習慣或事實。',
          '進行式描述此刻正在做的事。',
          '未來式描述還沒發生的事。'
        ]
      }
    },
    {
      title: '⑥ 寫活動心得',
      body: '結構：時間地點 → 做了什麼 → 感受與收穫。\n' +
            'Last Friday, we had our sports day.\n' +
            'I ran in the relay race. Our class won second place.\n' +
            'I was tired but very happy.\n' +
            '⚠ 用 but 連接相反的感受，句子會更真實。',
      viz: { type: 'energyflow', steps: ['時間地點', '做了什麼', '結果如何', '感受收穫'] },
      check: {
        q: '寫活動心得時，最後一段通常寫什麼？',
        options: [
          '自己的感受與收穫',
          '重複活動名稱',
          '別人的成績',
          '明天的計畫'
        ],
        answer: 0,
        why: [
          null,
          '重複會顯得沒有重點。',
          '心得應該以自己的經驗為主。',
          '這與活動心得無關。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|五下|第9單元 短文閱讀入門'] = {
  intro: '從讀懂一段話開始——這是英文從「背單字」變成「能用」的關鍵。',
  cards: [
    {
      title: '① 讀之前先預測',
      body: '先看標題、圖片與問題，猜測文章可能在講什麼。\n' +
            '⚠ 帶著問題讀，比從頭到尾慢慢看有效率得多。\n' +
            '也不要一遇到生字就停下來查。',
      viz: { type: 'energyflow', steps: ['看標題與圖', '看題目', '快速讀一遍', '找答案'] },
      check: {
        q: '開始閱讀前先看題目，有什麼好處？',
        options: [
          '知道要找什麼資訊，閱讀更有方向',
          '可以不用讀文章',
          '可以直接猜答案',
          '沒有任何好處'
        ],
        answer: 0,
        why: [
          null,
          '仍然需要閱讀文章才能作答。',
          '猜測的正確率很低。',
          '先看題目確實能提高效率。'
        ]
      }
    },
    {
      title: '② 抓主旨',
      body: '主旨通常在第一句或最後一句。\n' +
            '問自己：這段主要在講什麼？\n' +
            '⚠ 主旨是「整段的重點」，不是某個細節或例子。',
      viz: { type: 'compareexp',
             factor: '主旨與細節',
             a: { label: '主旨', note: '整段的重點，通常較概括' },
             b: { label: '細節', note: '支持主旨的例子或資料' },
             same: ['都在同一段文章中'] },
      check: {
        q: '判斷一個選項是不是「主旨」，可以怎麼檢查？',
        options: [
          '看它能不能涵蓋整段的內容，而不只是其中一個例子',
          '看它有沒有出現在文章第一個字',
          '看它是不是最長的選項',
          '看它有沒有生字'
        ],
        answer: 0,
        why: [
          null,
          '位置只是線索之一。',
          '長度與正確性無關。',
          '生字多寡不影響判斷。'
        ]
      }
    },
    {
      title: '③ 找細節',
      body: '細節題（who／when／where／what）通常能在文中直接找到。\n' +
            '技巧：圈出題目的關鍵字，回文章中定位。\n' +
            '⚠ 注意數字、時間與人名，這些常是出題重點。',
      viz: { type: 'energyflow', steps: ['讀題目', '圈關鍵字', '回文章定位', '核對選項'] },
      check: {
        q: '回答細節題最快的方法是什麼？',
        options: [
          '用題目的關鍵字回文章中定位',
          '把整篇文章背下來',
          '憑印象作答',
          '只看第一段'
        ],
        answer: 0,
        why: [
          null,
          '背誦既費時也沒必要。',
          '憑印象作答容易記錯細節。',
          '答案可能在任何一段。'
        ]
      }
    },
    {
      title: '④ 猜生字',
      body: '線索：① 上下文 ② 例子 ③ 對比詞（but、however）\n' +
            '④ 字的組成（un-、re-、-er、-ful、-less）。\n' +
            '⚠ 不用每個字都查，能猜出大意就能繼續讀下去。',
      viz: { type: 'classify', groups: [
        { label: '字首', items: ['un-（不）', 're-（再）', 'pre-（前）'] },
        { label: '字尾', items: ['-er（人）', '-ful（充滿）', '-less（沒有）'] }] },
      check: {
        q: '看到 careless 這個字，可以怎麼推測意思？',
        options: [
          '字尾 -less 表示「沒有」，care 是關心，合起來是「不小心的」',
          '完全無法推測',
          '一定要查字典才知道',
          '它應該是名詞'
        ],
        answer: 0,
        why: [
          null,
          '字的組成提供了明確線索。',
          '查字典能確認，但先猜能加快閱讀。',
          '從字尾可以判斷它是形容詞。'
        ]
      }
    },
    {
      title: '⑤ 看懂代名詞指誰',
      body: '文章中的 he、she、it、they 通常指前面提過的人或物。\n' +
            '⚠ 讀到代名詞時要能立刻對應回去，\n' +
            '否則整段的意思會混亂。\n' +
            '技巧：往前找最近的、單複數相符的名詞。',
      viz: { type: 'energyflow', steps: ['看到代名詞', '往前找名詞', '確認單複數', '確定指誰'] },
      check: {
        q: '讀到 they 這個代名詞時，應該怎麼確認它指誰？',
        options: [
          '往前找最近且單複數相符的名詞',
          '往後找',
          '隨便猜一個',
          '忽略它繼續讀'
        ],
        answer: 0,
        why: [
          null,
          '代名詞通常指前面提過的內容。',
          '猜錯會誤解整段意思。',
          '忽略代名詞會讓理解變模糊。'
        ]
      }
    },
    {
      title: '⑥ 培養閱讀習慣',
      body: '每天讀一小段（三到五句），比週末讀一大篇有效。\n' +
            '讀完做兩件事：① 用一句話說出大意 ② 記兩三個有用的字。\n' +
            '⚠ 選擇「稍微有點難但看得懂」的材料最合適，\n' +
            '太難會挫折、太簡單沒有進步。',
      viz: { type: 'energyflow', steps: ['選對難度', '每天一小段', '說出大意', '記幾個字'] },
      check: {
        q: '選擇英文閱讀材料時，什麼樣的難度最合適？',
        options: [
          '稍微有點難、但大部分看得懂',
          '完全看不懂的',
          '每個字都認識的',
          '越難越好'
        ],
        answer: 0,
        why: [
          null,
          '完全看不懂會很快失去動力。',
          '太簡單則沒有學習效果。',
          '難度過高反而降低效率。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第1單元 be 動詞過去式'] = {
  intro: '要說「以前是」「昨天在」，be 動詞也要換成過去的形式。',
  cards: [
    {
      title: '① was 與 were',
      body: 'am／is → was；are → were。\n' +
            'I was at home yesterday.　They were happy.\n' +
            '⚠ 主詞是 I、he、she、it 或單數名詞用 was；\n' +
            'you、we、they 或複數名詞用 were。',
      viz: { type: 'classify', groups: [
        { label: 'was', items: ['I', 'he', 'she', 'it', 'my brother'] },
        { label: 'were', items: ['you', 'we', 'they', 'my parents'] }] },
      check: {
        q: '主詞是 they 時，be 動詞的過去式要用什麼？',
        options: ['were', 'was', 'is', 'are'],
        answer: 0,
        why: [
          null,
          'was 用於 I 與第三人稱單數。',
          'is 是現在式。',
          'are 是現在式。'
        ]
      }
    },
    {
      title: '② 過去式的時間詞',
      body: 'yesterday（昨天）、last night／week／year（上個…）、\n' +
            'two days ago（兩天前）、in 2020、just now（剛才）。\n' +
            '⚠ 看到這些詞就要用過去式，這是最明顯的線索。',
      viz: { type: 'classify', groups: [
        { label: '過去的時間詞', items: ['yesterday', 'last week', 'two days ago', 'in 2020'] },
        { label: '現在的時間詞', items: ['now', 'today', 'every day'] }] },
      check: {
        q: '句子中出現 last night，應該用什麼時態？',
        options: [
          '過去式',
          '現在式',
          '未來式',
          '現在進行式'
        ],
        answer: 0,
        why: [
          null,
          '現在式用於習慣或事實。',
          '未來式用於還沒發生的事。',
          '進行式描述此刻正在做的事。'
        ]
      }
    },
    {
      title: '③ 否定句',
      body: 'I was not tired.（＝ wasn’t）\n' +
            'They were not at home.（＝ weren’t）\n' +
            '⚠ be 動詞的否定直接加 not，不需要 did。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'They', r: '主詞' }, { t: 'were not', r: 'be＋not' },
        { t: 'at home', r: '地點' }],
        note: 'be 動詞的過去式否定直接加 not。' },
      check: {
        q: '「他昨天不在學校」的正確說法是什麼？',
        options: [
          'He was not at school yesterday.',
          'He did not was at school yesterday.',
          'He was not at school tomorrow.',
          'He not was at school yesterday.'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞的否定不用 did。',
          'tomorrow 與過去式矛盾。',
          'not 要放在 be 動詞後面。'
        ]
      }
    },
    {
      title: '④ 疑問句',
      body: 'Were you at the party?→ Yes, I was.／No, I wasn’t.\n' +
            'Was she happy?→ Yes, she was.／No, she wasn’t.\n' +
            '⚠ 把 was／were 移到句首，簡答時也用 was／were。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Were', r: 'be 動詞' }, { t: 'you', r: '主詞' }, { t: 'at the party', r: '地點' }],
        note: '把 be 動詞移到主詞前面。' },
      check: {
        q: 'Was he tired? 的正確簡答是什麼？',
        options: [
          'Yes, he was.',
          'Yes, he did.',
          'Yes, he is.',
          'Yes, he were.'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞的問句不用 did 回答。',
          '問句是過去式，回答也要用過去式。',
          '主詞是單數要用 was。'
        ]
      }
    },
    {
      title: '⑤ there was／there were',
      body: 'There was a park here.（這裡以前有一座公園。）\n' +
            'There were many students.（有很多學生。）\n' +
            '⚠ be 動詞要配合後面的名詞單複數。',
      viz: { type: 'sentence', label: '過去有什麼', items: [
        { t: 'There were', r: '過去有' }, { t: 'many students', r: '複數名詞' },
        { t: 'in the hall', r: '地點' }],
        note: '後面是複數名詞要用 were。' },
      check: {
        q: '「以前這裡有一間書店」的正確說法是什麼？',
        options: [
          'There was a bookstore here.',
          'There were a bookstore here.',
          'There is a bookstore here before.',
          'There has a bookstore here.'
        ],
        answer: 0,
        why: [
          null,
          '單數名詞要用 was。',
          '描述過去要用過去式。',
          '英文用 There is/was 而不是 There has。'
        ]
      }
    },
    {
      title: '⑥ 描述過去',
      body: 'When I was a child, I was very shy.\n' +
            'The weather was nice yesterday.\n' +
            'My grandparents were farmers.\n' +
            '⚠ 描述過去的狀態、身分與位置，都用 was／were。',
      viz: { type: 'tense', verb: 'play', highlight: '過去簡單式' },
      tip: '按按鈕比較不同時態。',
      check: {
        q: '「我小時候很害羞」的正確說法是什麼？',
        options: [
          'When I was a child, I was very shy.',
          'When I am a child, I was very shy.',
          'When I was a child, I am very shy.',
          'When I were a child, I was shy.'
        ],
        answer: 0,
        why: [
          null,
          '兩個子句都應該用過去式。',
          '後半也要用過去式。',
          '主詞 I 的過去式 be 動詞是 was。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第2單元 規則動詞過去式'] = {
  intro: '大部分的動詞只要加 ed，就能表達「昨天做過」。',
  cards: [
    {
      title: '① 加 ed 的基本規則',
      body: '一般直接加 ed：play → played、work → worked、visit → visited。\n' +
            '⚠ 過去式不分主詞：不管是 I、he 還是 they，形式都一樣，\n' +
            '這比現在式簡單。',
      viz: { type: 'sentence', label: '過去式', items: [
        { t: 'I', r: '主詞' }, { t: 'played', r: '過去式' }, { t: 'basketball', r: '受詞' },
        { t: 'yesterday', r: '時間' }],
        note: '過去式的動詞形式不隨主詞改變。' },
      check: {
        q: '規則動詞的過去式，會隨主詞改變形式嗎？',
        options: [
          '不會，所有主詞都用同一個形式',
          '會，第三人稱單數要加 s',
          '會，複數要加 s',
          '會，主詞是 I 時要變化'
        ],
        answer: 0,
        why: [
          null,
          '加 s 是現在式的規則。',
          '過去式不加 s。',
          '主詞不影響過去式的形式。'
        ]
      }
    },
    {
      title: '② 拼寫規則',
      body: '字尾是 e：只加 d（like → liked、live → lived）。\n' +
            '子音＋y：去 y 加 ied（study → studied、cry → cried）。\n' +
            '短母音＋單子音：重複子音再加 ed（stop → stopped、plan → planned）。\n' +
            '⚠ 母音＋y 直接加 ed（play → played）。',
      viz: { type: 'classify', groups: [
        { label: '只加 d', items: ['liked', 'lived', 'moved'] },
        { label: '去 y 加 ied', items: ['studied', 'cried', 'tried'] },
        { label: '重複子音', items: ['stopped', 'planned', 'shopped'] }] },
      check: {
        q: 'study 的過去式怎麼拼？',
        options: ['studied', 'studyed', 'studed', 'studying'],
        answer: 0,
        why: [
          null,
          '子音加 y 要去 y 加 ied。',
          '不能省略字母，拼法不完整。',
          '這是進行式的形式。'
        ]
      }
    },
    {
      title: '③ ed 的三種發音',
      body: '① 唸 t：字尾是無聲子音（worked、stopped、watched）。\n' +
            '② 唸 d：字尾是有聲子音或母音（played、lived、cleaned）。\n' +
            '③ 唸 id：字尾是 t 或 d（wanted、needed、visited）。\n' +
            '⚠ 只有第三種會多一個音節。',
      viz: { type: 'phonics', words: [
        { w: 'worked', parts: ['work', 'ed'], hit: 1, s: 'ed 唸 t', mean: '工作（過去式）' },
        { w: 'played', parts: ['play', 'ed'], hit: 1, s: 'ed 唸 d', mean: '玩（過去式）' },
        { w: 'wanted', parts: ['want', 'ed'], hit: 1, s: 'ed 唸 id', mean: '想要（過去式）' }] },
      tip: '按單字按鈕比較三種發音。',
      check: {
        q: 'wanted 的 ed 應該怎麼唸？',
        options: [
          '唸 id，多一個音節',
          '唸 t',
          '唸 d',
          '不發音'
        ],
        answer: 0,
        why: [
          null,
          '字尾是 t 的動詞不唸 t。',
          '字尾是 t 或 d 時要唸 id。',
          'ed 一定要發音。'
        ]
      }
    },
    {
      title: '④ 否定句',
      body: '用 did not（didn’t）＋ 原形動詞：\n' +
            'I did not play basketball.（不是 didn’t played）\n' +
            '⚠ 因為過去的意思已經在 did 上面了，\n' +
            '主要動詞要回到原形。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'I', r: '主詞' }, { t: 'did not', r: '助動詞（過去）' },
        { t: 'play', r: '原形動詞' }, { t: 'basketball', r: '受詞' }],
        note: '用了 did 之後動詞回到原形。' },
      check: {
        q: '「他昨天沒有去學校」的正確說法是什麼？',
        options: [
          'He did not go to school yesterday.',
          'He did not went to school yesterday.',
          'He not went to school yesterday.',
          'He was not go to school yesterday.'
        ],
        answer: 0,
        why: [
          null,
          '用了 did 之後動詞要用原形。',
          '否定句需要助動詞。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '⑤ 疑問句',
      body: 'Did you play basketball?→ Yes, I did.／No, I didn’t.\n' +
            'What did you do yesterday?→ I studied English.\n' +
            '⚠ 疑問句同樣把 did 放到句首，主要動詞用原形。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Did', r: '助動詞' }, { t: 'you', r: '主詞' }, { t: 'play', r: '原形動詞' },
        { t: 'basketball', r: '受詞' }],
        note: '疑問句把 did 移到句首，動詞用原形。' },
      check: {
        q: '「你昨天做了什麼？」的正確說法是什麼？',
        options: [
          'What did you do yesterday?',
          'What did you did yesterday?',
          'What you did yesterday?',
          'What do you do yesterday?'
        ],
        answer: 0,
        why: [
          null,
          '用了 did 之後動詞要用原形。',
          '疑問句需要把助動詞放在主詞前面。',
          '時間是昨天，助動詞要用 did。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'Last weekend, I visited my grandparents.\n' +
            'We watched a movie and cooked dinner together.\n' +
            'I did not do my homework, so I was busy on Sunday.\n' +
            '⚠ 一段敘述中通常會用很多個過去式動詞，\n' +
            '注意每一個都要改成過去形式。',
      viz: { type: 'energyflow', steps: ['判斷時間', '選擇過去式', '注意拼寫', '否定與疑問用 did'] },
      check: {
        q: '寫一段描述昨天的事情時，最容易犯的錯誤是什麼？',
        options: [
          '有些動詞忘記改成過去式',
          '句子太短',
          '用了太多形容詞',
          '段落太整齊'
        ],
        answer: 0,
        why: [
          null,
          '長度不是文法問題。',
          '形容詞多寡不影響時態。',
          '段落結構與時態無關。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第3單元 不規則動詞過去式'] = {
  intro: '英文最常用的動詞，偏偏都是不規則的——所以一定要記熟。',
  cards: [
    {
      title: '① 什麼是不規則動詞',
      body: '過去式不加 ed，而是改變字形：\n' +
            'go → went、eat → ate、see → saw、come → came。\n' +
            '⚠ 這些多半是最常用的動詞，所以背熟很划算。',
      viz: { type: 'classify', groups: [
        { label: '完全改變', items: ['go→went', 'eat→ate', 'see→saw'] },
        { label: '只改母音', items: ['come→came', 'give→gave', 'sing→sang'] },
        { label: '不變', items: ['put→put', 'cut→cut', 'read→read'] }] },
      check: {
        q: 'go 的過去式是什麼？',
        options: ['went', 'goed', 'gone', 'going'],
        answer: 0,
        why: [
          null,
          'go 是不規則動詞，不加 ed。',
          'gone 是過去分詞，用在完成式。',
          'going 是現在分詞。'
        ]
      }
    },
    {
      title: '② 常見的不規則動詞（一）',
      body: 'be → was／were、have → had、do → did、say → said、\n' +
            'get → got、make → made、know → knew、think → thought。\n' +
            '⚠ 這些都是使用頻率最高的動詞，一定要背熟。',
      viz: { type: 'classify', groups: [
        { label: '最常用', items: ['was/were', 'had', 'did', 'said'] },
        { label: '次常用', items: ['got', 'made', 'knew', 'thought'] }] },
      check: {
        q: 'have 的過去式是什麼？',
        options: ['had', 'haved', 'has', 'having'],
        answer: 0,
        why: [
          null,
          'have 是不規則動詞。',
          'has 是第三人稱單數的現在式。',
          'having 是現在分詞。'
        ]
      }
    },
    {
      title: '③ 常見的不規則動詞（二）',
      body: 'take → took、come → came、give → gave、find → found、\n' +
            'tell → told、become → became、leave → left、feel → felt。\n' +
            '⚠ 有些變化有規律（如 -eel → -elt），可以一起記。',
      viz: { type: 'classify', groups: [
        { label: 'oo 音', items: ['took', 'stood', 'understood'] },
        { label: 'elt/old', items: ['felt', 'told', 'sold'] },
        { label: 'ame', items: ['came', 'became', 'gave'] }] },
      check: {
        q: 'tell 的過去式是什麼？',
        options: ['told', 'telled', 'tells', 'telling'],
        answer: 0,
        why: [
          null,
          'tell 是不規則動詞。',
          'tells 是現在式的第三人稱單數。',
          'telling 是現在分詞。'
        ]
      }
    },
    {
      title: '④ 三態相同或部分相同',
      body: '三態相同：put、cut、hit、let、cost、read（拼法同但發音不同）。\n' +
            '兩態相同：have-had-had、make-made-made、say-said-said。\n' +
            '⚠ read 的過去式拼法相同但唸法不同（唸成 red 的音）。',
      viz: { type: 'classify', groups: [
        { label: '三態相同', items: ['put', 'cut', 'hit', 'cost'] },
        { label: '拼同音不同', items: ['read'] }] },
      check: {
        q: 'read 這個字的過去式有什麼特別之處？',
        options: [
          '拼法和原形相同，但發音不同',
          '拼法完全改變',
          '要加 ed',
          '沒有過去式'
        ],
        answer: 0,
        why: [
          null,
          '拼法其實沒有改變。',
          'read 是不規則動詞。',
          '每個動詞都有過去式。'
        ]
      }
    },
    {
      title: '⑤ 否定與疑問一樣用 did',
      body: '不管動詞規不規則，否定與疑問都用 did：\n' +
            'I did not go.（不是 didn’t went）\n' +
            'Did you eat?（不是 Did you ate）\n' +
            '⚠ 用了 did 之後，動詞一律回到原形——\n' +
            '這反而讓不規則動詞變簡單了。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'I', r: '主詞' }, { t: 'did not', r: '助動詞' }, { t: 'go', r: '原形動詞' }],
        note: '用了 did 之後不規則變化就用不到了。' },
      check: {
        q: '「他昨天沒有吃早餐」的正確說法是什麼？',
        options: [
          'He did not eat breakfast yesterday.',
          'He did not ate breakfast yesterday.',
          'He not ate breakfast yesterday.',
          'He was not eat breakfast yesterday.'
        ],
        answer: 0,
        why: [
          null,
          '用了 did 之後動詞要用原形。',
          '否定句需要助動詞。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '⑥ 怎麼記不規則動詞',
      body: '方法：① 依「變化規律」分組記（sing-sang、ring-rang）\n' +
            '② 每天記五個，寫進句子裡 ③ 用故事把它們串起來。\n' +
            '⚠ 不要一次背一百個——分批記、反覆用，效果最好。',
      viz: { type: 'energyflow', steps: ['分組記憶', '每天五個', '造句使用', '反覆複習'] },
      check: {
        q: '記不規則動詞比較有效的方法是什麼？',
        options: [
          '依變化規律分組，並在句子中反覆使用',
          '一次背完全部',
          '只看不寫',
          '只記中文意思'
        ],
        answer: 0,
        why: [
          null,
          '一次太多容易混淆也記不牢。',
          '動手寫與使用能加深記憶。',
          '不知道形式變化就無法使用。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第4單元 過去式否定與問句'] = {
  intro: 'did 是過去式的萬用鑰匙——否定和疑問都靠它。',
  cards: [
    {
      title: '① did 的角色',
      body: 'did 是 do 的過去式，當「助動詞」使用。\n' +
            '一旦用了 did，主要動詞就回到「原形」。\n' +
            '⚠ 因為時態的資訊已經由 did 表達了，\n' +
            '不需要重複標示兩次。',
      viz: { type: 'sentence', label: '肯定', items: [
        { t: 'I', r: '主詞' }, { t: 'went', r: '過去式' }, { t: 'to school', r: '地點' }],
        note: '肯定句直接用過去式。',
        alt: [
          { label: '否定', items: [{ t: 'I', r: '主詞' }, { t: 'did not', r: '助動詞' },
            { t: 'go', r: '原形' }, { t: 'to school', r: '地點' }],
            note: '過去的資訊移到 did 上面，動詞回原形。' }] },
      tip: '按按鈕比較肯定與否定。',
      check: {
        q: '為什麼 did not 後面的動詞要用原形？',
        options: [
          '因為過去的時態資訊已經在 did 上面了',
          '因為原形比較好唸',
          '因為沒有規則',
          '因為動詞不能變化'
        ],
        answer: 0,
        why: [
          null,
          '這是文法規則而非發音考量。',
          '這個規則非常明確。',
          '動詞在肯定句中是會變化的。'
        ]
      }
    },
    {
      title: '② 否定句',
      body: 'I did not finish my homework.（＝ didn’t）\n' +
            'She did not come to school.\n' +
            '⚠ 不論主詞是誰，都用 did not，\n' +
            '這比現在式的 do／does 簡單。',
      viz: { type: 'classify', groups: [
        { label: '現在式否定', items: ['do not', 'does not'] },
        { label: '過去式否定', items: ['did not（所有主詞）'] }] },
      check: {
        q: '過去式的否定句中，主詞是 she 時要用什麼助動詞？',
        options: ['did not', 'does not', 'do not', 'was not'],
        answer: 0,
        why: [
          null,
          'does not 是現在式。',
          'do not 也是現在式。',
          'was not 用於 be 動詞的句子。'
        ]
      }
    },
    {
      title: '③ Yes／No 問句',
      body: 'Did you see the movie?→ Yes, I did.／No, I didn’t.\n' +
            'Did she call you?→ Yes, she did.\n' +
            '⚠ 簡答時用 did，不重複主要動詞。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Did', r: '助動詞' }, { t: 'you', r: '主詞' }, { t: 'see', r: '原形動詞' },
        { t: 'the movie', r: '受詞' }],
        note: '把 did 移到句首形成疑問句。' },
      check: {
        q: 'Did they win the game? 的正確簡答是什麼？',
        options: [
          'Yes, they did.',
          'Yes, they win.',
          'Yes, they won.',
          'Yes, they were.'
        ],
        answer: 0,
        why: [
          null,
          '簡答要用助動詞而不是主要動詞。',
          '簡答時不重複主要動詞。',
          '問句用 did，回答也要用 did。'
        ]
      }
    },
    {
      title: '④ 疑問詞問句',
      body: 'What did you do yesterday?（你昨天做了什麼？）\n' +
            'Where did she go?（她去了哪裡？）\n' +
            'Why did he leave?（他為什麼離開？）\n' +
            '⚠ 順序：疑問詞 ＋ did ＋ 主詞 ＋ 原形動詞。',
      viz: { type: 'sentence', label: '疑問詞問句', items: [
        { t: 'Where', r: '疑問詞' }, { t: 'did', r: '助動詞' }, { t: 'she', r: '主詞' },
        { t: 'go', r: '原形動詞' }],
        note: '疑問詞在最前面，接著是助動詞與主詞。' },
      check: {
        q: '「他昨天去了哪裡？」的正確說法是什麼？',
        options: [
          'Where did he go yesterday?',
          'Where did he went yesterday?',
          'Where he did go yesterday?',
          'Where he went yesterday?'
        ],
        answer: 0,
        why: [
          null,
          '用了 did 之後動詞要用原形。',
          '助動詞要放在主詞前面。',
          '疑問句需要助動詞。'
        ]
      }
    },
    {
      title: '⑤ 主詞就是疑問詞時',
      body: 'Who called you?（誰打電話給你？）\n' +
            '⚠ 當疑問詞本身就是主詞時，「不用」加 did，\n' +
            '動詞直接用過去式。\n' +
            '比較：Who did you call?（你打給誰？）——這時 who 是受詞。',
      viz: { type: 'compareexp',
             factor: '疑問詞的角色',
             a: { label: 'Who called you?', note: 'who 是主詞，動詞直接用過去式' },
             b: { label: 'Who did you call?', note: 'who 是受詞，要用 did' },
             same: ['都以 Who 開頭'] },
      check: {
        q: '「誰打破了窗戶？」的正確說法是什麼？',
        options: [
          'Who broke the window?',
          'Who did broke the window?',
          'Who did break window?',
          'Whom broke the window?'
        ],
        answer: 0,
        why: [
          null,
          'who 是主詞時不需要 did。',
          '缺少冠詞，而且不需要 did。',
          'whom 用於受詞的位置。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'A: Did you go to the party last night?\n' +
            'B: No, I didn’t. I stayed home.\n' +
            'A: Why didn’t you go?　B: Because I was tired.\n' +
            '⚠ 對話中常常混用 be 動詞過去式（was）與一般動詞過去式（stayed），\n' +
            '要看句子的動詞類型來決定否定與疑問的做法。',
      viz: { type: 'compareexp',
             factor: '兩類動詞的過去式',
             a: { label: 'be 動詞', note: '否定用 was not／were not' },
             b: { label: '一般動詞', note: '否定用 did not ＋ 原形' },
             same: ['都表達過去'] },
      check: {
        q: '「我昨天不累」與「我昨天沒去」的否定方式有什麼不同？',
        options: [
          '前者用 was not，後者用 did not 加原形動詞',
          '兩者都用 did not',
          '兩者都用 was not',
          '兩者都不需要助動詞'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞的句子不用 did。',
          '一般動詞的句子不用 was。',
          '否定句需要適當的否定形式。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第5單元 未來式 be going to'] = {
  intro: '已經計畫好的事，用 be going to 來說。',
  cards: [
    {
      title: '① 形式',
      body: '主詞 ＋ be 動詞 ＋ going to ＋ 原形動詞。\n' +
            'I am going to visit my grandma.（我打算去看奶奶。）\n' +
            '⚠ be 動詞要配合主詞（am／is／are），\n' +
            'going to 後面永遠是原形動詞。',
      viz: { type: 'sentence', label: '未來計畫', items: [
        { t: 'I', r: '主詞' }, { t: 'am going to', r: 'be＋going to' },
        { t: 'visit', r: '原形動詞' }, { t: 'my grandma', r: '受詞' }],
        note: 'be 動詞配合主詞，going to 後面接原形。' },
      tip: '這個元件把句子拆成一格一格。',
      check: {
        q: '「她打算去買東西」的正確說法是什麼？',
        options: [
          'She is going to go shopping.',
          'She are going to go shopping.',
          'She is going to goes shopping.',
          'She going to go shopping.'
        ],
        answer: 0,
        why: [
          null,
          '主詞是第三人稱單數要用 is。',
          'going to 後面要接原形動詞。',
          '句子缺少 be 動詞。'
        ]
      }
    },
    {
      title: '② 用在什麼情況',
      body: '① 已經計畫好的事：We are going to have a party.\n' +
            '② 從跡象判斷即將發生：Look at the clouds. It is going to rain.\n' +
            '⚠ 重點是「已經有跡象或已經決定」。',
      viz: { type: 'compareexp',
             factor: '兩種用法',
             a: { label: '已計畫', note: '我已經決定要做：I am going to study.' },
             b: { label: '有跡象', note: '看起來即將發生：It is going to rain.' },
             same: ['都指向未來'] },
      check: {
        q: '看到天空烏雲密布，說「快下雨了」用哪一種說法最自然？',
        options: [
          'It is going to rain.',
          'It rains.',
          'It rained.',
          'It is raining every day.'
        ],
        answer: 0,
        why: [
          null,
          '現在式表示習慣或事實。',
          '過去式表示已經發生過。',
          '這個說法表示習慣性的降雨。'
        ]
      }
    },
    {
      title: '③ 否定句',
      body: '在 be 動詞後面加 not：\n' +
            'I am not going to go.　He is not going to come.\n' +
            '⚠ 否定的是「計畫」，不是動作本身。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'He', r: '主詞' }, { t: 'is not going to', r: '否定' },
        { t: 'come', r: '原形動詞' }],
        note: '否定時在 be 動詞後面加 not。' },
      check: {
        q: '「他們不打算來」的正確說法是什麼？',
        options: [
          'They are not going to come.',
          'They do not going to come.',
          'They are not going to came.',
          'They not are going to come.'
        ],
        answer: 0,
        why: [
          null,
          '這個句型的否定不用 do。',
          'going to 後面要接原形動詞。',
          'not 要放在 be 動詞後面。'
        ]
      }
    },
    {
      title: '④ 疑問句',
      body: '把 be 動詞移到句首：\n' +
            'Are you going to join us?→ Yes, I am.／No, I am not.\n' +
            'What are you going to do this weekend?\n' +
            '⚠ 簡答時用 be 動詞。',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Are', r: 'be 動詞' }, { t: 'you', r: '主詞' },
        { t: 'going to join', r: 'going to＋原形' }, { t: 'us', r: '受詞' }],
        note: '把 be 動詞移到句首。' },
      check: {
        q: 'Are you going to study tonight? 的正確簡答是什麼？',
        options: [
          'Yes, I am.',
          'Yes, I do.',
          'Yes, I will going.',
          'Yes, I going.'
        ],
        answer: 0,
        why: [
          null,
          '這個句型用 be 動詞回答。',
          '簡答不需要重複 going。',
          '簡答要有 be 動詞。'
        ]
      }
    },
    {
      title: '⑤ 常用的未來時間詞',
      body: 'tomorrow（明天）、next week／month／year（下個…）、\n' +
            'this weekend（這個週末）、tonight（今晚）、\n' +
            'in two days（兩天後）、soon（很快）。\n' +
            '⚠ 這些詞常常和未來式一起出現。',
      viz: { type: 'classify', groups: [
        { label: '未來的時間詞', items: ['tomorrow', 'next week', 'tonight', 'soon'] },
        { label: '過去的時間詞', items: ['yesterday', 'last week', 'ago'] }] },
      check: {
        q: '句子中出現 next Monday，應該用什麼時態？',
        options: [
          '未來式',
          '過去式',
          '現在完成式',
          '過去進行式'
        ],
        answer: 0,
        why: [
          null,
          '過去式用於已經發生的事。',
          '完成式強調與現在的關聯。',
          '過去進行式描述過去某時正在做的事。'
        ]
      }
    },
    {
      title: '⑥ 談論計畫',
      body: 'A: What are you going to do this summer?\n' +
            'B: I am going to visit my cousin in Tainan.\n' +
            'A: That sounds fun! How long are you going to stay?\n' +
            '⚠ 談計畫時用 be going to 最自然，\n' +
            '因為那是已經決定好的事。',
      viz: { type: 'energyflow', steps: ['問對方的計畫', '說出自己的計畫', '追問細節', '回應'] },
      check: {
        q: '要問「你這個暑假打算做什麼？」，正確的說法是什麼？',
        options: [
          'What are you going to do this summer?',
          'What you are going to do this summer?',
          'What do you going to do this summer?',
          'What are you going do this summer?'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞要放在主詞前面。',
          '這個句型不用 do。',
          '缺少 to，going to 是固定用法。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第6單元 未來式 will'] = {
  intro: 'will 用來說「將會」——特別是當下才決定，或對未來的預測。',
  cards: [
    {
      title: '① 形式',
      body: '主詞 ＋ will ＋ 原形動詞。\n' +
            'I will call you later.　She will be here soon.\n' +
            '⚠ will 是助動詞，不隨主詞變化，後面永遠接原形動詞。',
      viz: { type: 'tense', verb: 'go', highlight: '未來式' },
      tip: '按按鈕比較不同時態。',
      check: {
        q: '「他明天會來」的正確說法是什麼？',
        options: [
          'He will come tomorrow.',
          'He wills come tomorrow.',
          'He will comes tomorrow.',
          'He will to come tomorrow.'
        ],
        answer: 0,
        why: [
          null,
          'will 不隨主詞加 s。',
          'will 後面要接原形動詞。',
          'will 後面不加 to。'
        ]
      }
    },
    {
      title: '② will 與 be going to 的差別',
      body: 'will：當下才決定、預測、承諾、提議。\n' +
            'be going to：已經計畫好、有跡象即將發生。\n' +
            '⚠ 例：電話響了 → I will get it!（當下決定）\n' +
            '早就約好 → I am going to meet him at five.',
      viz: { type: 'compareexp',
             factor: '兩種未來式',
             a: { label: 'will', note: '當下決定、預測、承諾' },
             b: { label: 'be going to', note: '事先計畫、有明顯跡象' },
             same: ['都表達未來'] },
      check: {
        q: '電話突然響了，你說「我去接！」應該用哪一種說法？',
        options: [
          'I will get it!',
          'I am going to get it.',
          'I get it.',
          'I got it.'
        ],
        answer: 0,
        why: [
          null,
          'be going to 用於事先計畫好的事。',
          '現在式無法表達當下的決定。',
          '過去式表示已經發生。'
        ]
      }
    },
    {
      title: '③ 否定與縮寫',
      body: 'will not ＝ won’t（注意拼法，不是 willn’t）。\n' +
            'I will not tell anyone.＝ I won’t tell anyone.\n' +
            '⚠ I will 可以縮寫成 I’ll；he will → he’ll。',
      viz: { type: 'classify', groups: [
        { label: '肯定縮寫', items: ['I’ll', 'he’ll', 'they’ll'] },
        { label: '否定縮寫', items: ['won’t'] }] },
      check: {
        q: 'will not 的縮寫是什麼？',
        options: ['won’t', 'willn’t', 'will’nt', 'wo not'],
        answer: 0,
        why: [
          null,
          '英文沒有這種縮寫。',
          '撇號的位置不正確。',
          '這不是標準的縮寫形式。'
        ]
      }
    },
    {
      title: '④ 疑問句',
      body: 'Will you help me?→ Yes, I will.／No, I won’t.\n' +
            'When will they arrive?\n' +
            '⚠ Will you…? 除了問未來，也常用來「請求」：\n' +
            'Will you close the door, please?',
      viz: { type: 'sentence', label: '疑問句', items: [
        { t: 'Will', r: '助動詞' }, { t: 'you', r: '主詞' }, { t: 'help', r: '原形動詞' },
        { t: 'me', r: '受詞' }],
        note: '把 will 移到主詞前面形成疑問句。' },
      check: {
        q: 'Will you help me? 這句話除了問未來，還可能表示什麼？',
        options: [
          '禮貌的請求',
          '過去的事',
          '命令',
          '拒絕'
        ],
        answer: 0,
        why: [
          null,
          'will 用於未來而非過去。',
          '問句形式比命令句客氣。',
          '這是提出請求而不是拒絕。'
        ]
      }
    },
    {
      title: '⑤ 用 will 做預測',
      body: 'I think it will rain tomorrow.（我想明天會下雨。）\n' +
            'She will probably be late.（她可能會遲到。）\n' +
            '⚠ 常搭配 I think、maybe、probably，表示不確定。',
      viz: { type: 'sentence', label: '預測', items: [
        { t: 'I think', r: '表達推測' }, { t: 'it will rain', r: '未來式' },
        { t: 'tomorrow', r: '時間' }],
        note: '加上 I think 讓語氣變成推測。' },
      check: {
        q: '要表達「我想明天會下雨」，比較自然的說法是什麼？',
        options: [
          'I think it will rain tomorrow.',
          'I think it rains tomorrow.',
          'I think it rained tomorrow.',
          'I will think it rains.'
        ],
        answer: 0,
        why: [
          null,
          '明天的事要用未來式。',
          '過去式與 tomorrow 矛盾。',
          '這個語序改變了意思。'
        ]
      }
    },
    {
      title: '⑥ 綜合練習',
      body: 'A: I am going to have a party this Saturday. Will you come?\n' +
            'B: Sure! I will bring some snacks.\n' +
            '⚠ 注意：辦派對是事先計畫（be going to），\n' +
            '帶點心是當下決定（will）。',
      viz: { type: 'compareexp',
             factor: '同一段對話中的兩種未來',
             a: { label: '事先計畫', note: 'I am going to have a party.' },
             b: { label: '當下決定', note: 'I will bring some snacks.' },
             same: ['都在談未來'] },
      check: {
        q: '朋友邀你參加派對，你當場決定要帶東西，應該怎麼說？',
        options: [
          'I will bring some snacks.',
          'I am going to bring some snacks (decided long ago).',
          'I bring some snacks.',
          'I brought some snacks.'
        ],
        answer: 0,
        why: [
          null,
          '這個選項的說明表示是很久以前就決定的。',
          '現在式無法表達當下的決定。',
          '過去式表示已經帶過了。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第7單元 比較級'] = {
  intro: '要說「比較高、比較好」，形容詞要換成比較級的形式。',
  cards: [
    {
      title: '① 短形容詞加 er',
      body: '一到兩音節的形容詞加 er：\n' +
            'tall → taller、fast → faster、young → younger。\n' +
            '⚠ 拼寫規則：字尾 e 只加 r（nice → nicer）；\n' +
            '子音＋y 去 y 加 ier（happy → happier）；\n' +
            '短母音＋單子音要重複（big → bigger）。',
      viz: { type: 'classify', groups: [
        { label: '直接加 er', items: ['taller', 'faster', 'longer'] },
        { label: '去 y 加 ier', items: ['happier', 'easier', 'busier'] },
        { label: '重複子音', items: ['bigger', 'hotter', 'thinner'] }] },
      check: {
        q: 'big 的比較級是什麼？',
        options: ['bigger', 'biger', 'more big', 'bigest'],
        answer: 0,
        why: [
          null,
          '短母音加單子音要重複子音。',
          '短形容詞用 er 而不是 more。',
          '這是最高級的錯誤拼法。'
        ]
      }
    },
    {
      title: '② 長形容詞用 more',
      body: '三音節以上（或部分兩音節）用 more：\n' +
            'more beautiful、more interesting、more expensive、more difficult。\n' +
            '⚠ 不能兩個都用：more taller ✗。',
      viz: { type: 'classify', groups: [
        { label: '加 er', items: ['taller', 'faster', 'smaller'] },
        { label: '用 more', items: ['more beautiful', 'more difficult', 'more important'] }] },
      check: {
        q: 'beautiful 的比較級是什麼？',
        options: [
          'more beautiful',
          'beautifuler',
          'more beautifuler',
          'beautifullest'
        ],
        answer: 0,
        why: [
          null,
          '長形容詞不加 er。',
          '不能同時使用 more 與 er。',
          '這是最高級的形式。'
        ]
      }
    },
    {
      title: '③ 不規則變化',
      body: 'good／well → better；bad → worse；\n' +
            'many／much → more；little → less；far → farther／further。\n' +
            '⚠ 這些是最常用的，一定要背熟。',
      viz: { type: 'classify', groups: [
        { label: '不規則', items: ['good→better', 'bad→worse', 'many→more', 'little→less'] }] },
      check: {
        q: 'good 的比較級是什麼？',
        options: ['better', 'gooder', 'more good', 'best'],
        answer: 0,
        why: [
          null,
          'good 是不規則變化。',
          '不規則形容詞不用 more。',
          'best 是最高級。'
        ]
      }
    },
    {
      title: '④ 比較的句型',
      body: 'A ＋ be ＋ 比較級 ＋ than ＋ B。\n' +
            'He is taller than me.（他比我高。）\n' +
            'This book is more interesting than that one.\n' +
            '⚠ than 後面口語常用受格（than me），\n' +
            '正式寫法可用 than I am。',
      viz: { type: 'sentence', label: '比較句型', items: [
        { t: 'He', r: '主詞' }, { t: 'is taller', r: 'be＋比較級' },
        { t: 'than me', r: '比較對象' }],
        note: '比較級後面用 than 帶出比較的對象。' },
      check: {
        q: '「這本書比那本有趣」的正確說法是什麼？',
        options: [
          'This book is more interesting than that one.',
          'This book is interestinger than that one.',
          'This book is more interesting that one.',
          'This book more interesting than that one.'
        ],
        answer: 0,
        why: [
          null,
          '長形容詞不加 er。',
          '比較時需要 than。',
          '句子缺少 be 動詞。'
        ]
      }
    },
    {
      title: '⑤ 加強比較的語氣',
      body: 'much／a lot ＋ 比較級：much taller（高很多）。\n' +
            'a little ＋ 比較級：a little older（大一點點）。\n' +
            '⚠ 不能用 very 修飾比較級：very taller ✗。',
      viz: { type: 'compareexp',
             factor: '程度的差別',
             a: { label: 'much taller', note: '高很多' },
             b: { label: 'a little taller', note: '高一點點' },
             same: ['都是比較級'] },
      check: {
        q: '要說「高很多」，正確的說法是什麼？',
        options: [
          'much taller',
          'very taller',
          'very tall than',
          'more taller'
        ],
        answer: 0,
        why: [
          null,
          'very 不能修飾比較級。',
          '這個結構不完整。',
          '不能同時用 more 與 er。'
        ]
      }
    },
    {
      title: '⑥ 同級比較',
      body: 'as ＋ 原級 ＋ as：一樣…。\n' +
            'He is as tall as his brother.（他和他哥哥一樣高。）\n' +
            '否定：not as tall as（沒有…那麼高）。\n' +
            '⚠ 兩個 as 中間用「原級」，不是比較級。',
      viz: { type: 'sentence', label: '同級比較', items: [
        { t: 'He is', r: '主詞＋be' }, { t: 'as tall as', r: '同級比較' },
        { t: 'his brother', r: '比較對象' }],
        note: '兩個 as 中間放原級形容詞。' },
      check: {
        q: '「他和我一樣高」的正確說法是什麼？',
        options: [
          'He is as tall as me.',
          'He is as taller as me.',
          'He is as tall than me.',
          'He is so tall as me.'
        ],
        answer: 0,
        why: [
          null,
          '兩個 as 中間要用原級。',
          '同級比較用 as 而不是 than。',
          '肯定句中習慣用 as…as。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第8單元 最高級'] = {
  intro: '三個以上比較時，就會出現「最…的」——這是最高級。',
  cards: [
    {
      title: '① 短形容詞加 est',
      body: '前面加 the，字尾加 est：\n' +
            'the tallest（最高的）、the fastest、the youngest。\n' +
            '⚠ 拼寫規則和比較級相同：\n' +
            'nice → nicest、happy → happiest、big → biggest。',
      viz: { type: 'classify', groups: [
        { label: '原級', items: ['tall', 'big', 'happy'] },
        { label: '比較級', items: ['taller', 'bigger', 'happier'] },
        { label: '最高級', items: ['tallest', 'biggest', 'happiest'] }] },
      check: {
        q: 'happy 的最高級是什麼？',
        options: ['happiest', 'happyest', 'most happy', 'happier'],
        answer: 0,
        why: [
          null,
          '子音加 y 要去 y 加 iest。',
          '短形容詞不用 most。',
          '這是比較級而不是最高級。'
        ]
      }
    },
    {
      title: '② 長形容詞用 most',
      body: 'the most beautiful、the most interesting、the most expensive。\n' +
            '⚠ 同樣不能兩個都用：the most tallest ✗。',
      viz: { type: 'classify', groups: [
        { label: '加 est', items: ['tallest', 'smallest', 'fastest'] },
        { label: '用 most', items: ['most beautiful', 'most difficult', 'most popular'] }] },
      check: {
        q: 'interesting 的最高級是什麼？',
        options: [
          'the most interesting',
          'the interestingest',
          'the most interestingest',
          'more interesting'
        ],
        answer: 0,
        why: [
          null,
          '長形容詞不加 est。',
          '不能同時使用 most 與 est。',
          '這是比較級而不是最高級。'
        ]
      }
    },
    {
      title: '③ 不規則變化',
      body: 'good → better → best；bad → worse → worst；\n' +
            'many／much → more → most；little → less → least。\n' +
            '⚠ 這四組最常用，要一起背。',
      viz: { type: 'classify', groups: [
        { label: 'good', items: ['good', 'better', 'best'] },
        { label: 'bad', items: ['bad', 'worse', 'worst'] },
        { label: 'many', items: ['many', 'more', 'most'] }] },
      check: {
        q: 'bad 的最高級是什麼？',
        options: ['worst', 'baddest', 'most bad', 'worse'],
        answer: 0,
        why: [
          null,
          'bad 是不規則變化。',
          '不規則形容詞不用 most。',
          'worse 是比較級。'
        ]
      }
    },
    {
      title: '④ 最高級的句型',
      body: 'A ＋ be ＋ the ＋ 最高級 ＋ in／of ＋ 範圍。\n' +
            'He is the tallest in our class.（他是班上最高的。）\n' +
            'This is the best of all.（這是所有之中最好的。）\n' +
            '⚠ 範圍是「地方或團體」用 in；是「一群同類」用 of。',
      viz: { type: 'sentence', label: '最高級句型', items: [
        { t: 'He is', r: '主詞＋be' }, { t: 'the tallest', r: '最高級' },
        { t: 'in our class', r: '範圍' }],
        note: '最高級前面要加 the，後面說明比較的範圍。' },
      check: {
        q: '「他是班上最高的」的正確說法是什麼？',
        options: [
          'He is the tallest in our class.',
          'He is tallest in our class.',
          'He is the taller in our class.',
          'He is the most tall in our class.'
        ],
        answer: 0,
        why: [
          null,
          '最高級前面要加 the。',
          '三人以上比較要用最高級。',
          '短形容詞不用 most。'
        ]
      }
    },
    {
      title: '⑤ 常見的搭配',
      body: 'one of the ＋ 最高級 ＋ 複數名詞：\n' +
            'It is one of the best movies I have ever seen.\n' +
            '⚠ 注意名詞要用複數（movies），因為是「其中之一」。',
      viz: { type: 'sentence', label: '其中之一', items: [
        { t: 'one of', r: '其中之一' }, { t: 'the best', r: '最高級' },
        { t: 'movies', r: '複數名詞' }],
        note: 'one of 後面要接複數名詞。' },
      check: {
        q: '「這是最好的電影之一」的正確說法是什麼？',
        options: [
          'It is one of the best movies.',
          'It is one of the best movie.',
          'It is one of best movies.',
          'It is the one of best movie.'
        ],
        answer: 0,
        why: [
          null,
          'one of 後面要接複數名詞。',
          '最高級前面要加 the。',
          '這個結構不正確。'
        ]
      }
    },
    {
      title: '⑥ 三個等級一起看',
      body: '原級：tall（高）　比較級：taller than（比…高）\n' +
            '最高級：the tallest（最高的）\n' +
            '⚠ 判斷用哪一個：比較兩者用比較級，三者以上用最高級，\n' +
            '沒有比較就用原級。',
      viz: { type: 'compareexp',
             factor: '三個等級',
             a: { label: '比較級', note: '兩者比較：A is taller than B.' },
             b: { label: '最高級', note: '三者以上：A is the tallest.' },
             same: ['都用形容詞的變化形'] },
      check: {
        q: '在三個人之間比較身高，應該用哪一種形式？',
        options: [
          '最高級',
          '比較級',
          '原級',
          '不需要變化'
        ],
        answer: 0,
        why: [
          null,
          '比較級用於兩者之間。',
          '原級用於沒有比較的情況。',
          '比較時形容詞必須變化。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六上|第9單元 旅遊與計畫'] = {
  intro: '把時態、比較級和實用句型放進真實情境——旅遊是最好的練習場。',
  cards: [
    {
      title: '① 談論旅遊計畫',
      body: 'Where are you going to go this summer?\n' +
            'I am going to visit Japan.\n' +
            'How long are you going to stay?→ For a week.\n' +
            '⚠ 已經計畫好的行程用 be going to。',
      viz: { type: 'sentence', label: '問計畫', items: [
        { t: 'Where', r: '疑問詞' }, { t: 'are you going to', r: '未來式' },
        { t: 'go', r: '原形動詞' }],
        note: '問已經計畫好的事用 be going to。' },
      check: {
        q: '「你暑假打算去哪裡？」的正確說法是什麼？',
        options: [
          'Where are you going to go this summer?',
          'Where you are going to go this summer?',
          'Where do you going this summer?',
          'Where will you going this summer?'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞要放在主詞前面。',
          '這個句型不用 do。',
          'will 後面要接原形動詞。'
        ]
      }
    },
    {
      title: '② 旅遊相關字彙',
      body: 'trip／journey（旅行）、flight（航班）、ticket（票）、\n' +
            'passport（護照）、luggage（行李）、hotel（旅館）、\n' +
            'sightseeing（觀光）、souvenir（紀念品）。\n' +
            '⚠ luggage 是不可數名詞，不加 s。',
      viz: { type: 'classify', groups: [
        { label: '出發前', items: ['passport', 'ticket', 'luggage', 'booking'] },
        { label: '旅途中', items: ['flight', 'hotel', 'sightseeing', 'souvenir'] }] },
      check: {
        q: '下列哪一個是不可數名詞？',
        options: ['luggage', 'ticket', 'hotel', 'souvenir'],
        answer: 0,
        why: [
          null,
          'ticket 可數，有複數 tickets。',
          'hotel 可數。',
          'souvenir 也可數。'
        ]
      }
    },
    {
      title: '③ 描述地點',
      body: 'Taipei is bigger than Tainan.（台北比台南大。）\n' +
            'It is one of the most popular cities in Asia.\n' +
            '⚠ 描述地方時常用比較級與最高級，\n' +
            '也可以用五感動詞：The food looks delicious.',
      viz: { type: 'sentence', label: '比較地點', items: [
        { t: 'Taipei is', r: '主詞＋be' }, { t: 'bigger than', r: '比較級' },
        { t: 'Tainan', r: '比較對象' }],
        note: '比較兩個地方用比較級。' },
      check: {
        q: '「這是亞洲最受歡迎的城市之一」的正確說法是什麼？',
        options: [
          'It is one of the most popular cities in Asia.',
          'It is one of the most popular city in Asia.',
          'It is the most popular cities in Asia.',
          'It is more popular cities in Asia.'
        ],
        answer: 0,
        why: [
          null,
          'one of 後面要接複數名詞。',
          '加了 one of 才需要複數，這裡結構不一致。',
          '比較級不能這樣使用。'
        ]
      }
    },
    {
      title: '④ 分享過去的旅遊經驗',
      body: 'Last year, I went to Kenting.（去年我去了墾丁。）\n' +
            'We stayed there for three days.\n' +
            'The weather was great and the beach was beautiful.\n' +
            '⚠ 描述過去的旅行要用過去式：went、stayed、was。',
      viz: { type: 'tense', verb: 'go', highlight: '過去簡單式' },
      tip: '按按鈕比較不同時態。',
      check: {
        q: '「去年我去了台東」的正確說法是什麼？',
        options: [
          'Last year, I went to Taitung.',
          'Last year, I go to Taitung.',
          'Last year, I am going to Taitung.',
          'Last year, I will go to Taitung.'
        ],
        answer: 0,
        why: [
          null,
          '去年的事要用過去式。',
          'be going to 表示未來的計畫。',
          'will 表示未來。'
        ]
      }
    },
    {
      title: '⑤ 旅遊實用句',
      body: 'Where is the restroom?（洗手間在哪裡？）\n' +
            'How much is this?（這個多少錢？）\n' +
            'Could you take a photo for us?（可以幫我們拍照嗎？）\n' +
            'I would like to check in.（我要辦入住。）\n' +
            '⚠ 用 Could you…? 開頭比較禮貌。',
      viz: { type: 'classify', groups: [
        { label: '問路購物', items: ['Where is…?', 'How much is…?'] },
        { label: '請求協助', items: ['Could you…?', 'Can you help me?'] }] },
      check: {
        q: '要請路人幫忙拍照，比較禮貌的說法是什麼？',
        options: [
          'Could you take a photo for us, please?',
          'Take a photo!',
          'You take photo.',
          'Photo!'
        ],
        answer: 0,
        why: [
          null,
          '直接的命令句不禮貌。',
          '這個說法像在指使人。',
          '只說名詞無法表達完整的請求。'
        ]
      }
    },
    {
      title: '⑥ 寫旅遊心得',
      body: '結構：時間地點 → 做了什麼 → 印象最深的 → 感想。\n' +
            'Last summer, I went to Hualien with my family.\n' +
            'We visited Taroko Gorge. It was the most beautiful place I have seen.\n' +
            'I hope I can go there again.\n' +
            '⚠ 最後一句用 hope 表達期望，讓文章有收尾。',
      viz: { type: 'energyflow', steps: ['時間地點', '做了什麼', '最深刻的', '感想與期望'] },
      check: {
        q: '寫旅遊心得時，結尾常用什麼方式收束？',
        options: [
          '表達感想或未來的期望',
          '重複開頭的句子',
          '列出所有花費',
          '寫下天氣預報'
        ],
        answer: 0,
        why: [
          null,
          '重複會讓文章顯得單調。',
          '花費通常不是心得的重點。',
          '天氣預報與心得無關。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第1單元 時態綜合複習'] = {
  intro: '把學過的五種時態放在一起看，就會發現它們各有明確的分工。',
  cards: [
    {
      title: '① 五種基本時態',
      body: '現在簡單式（習慣、事實）、現在進行式（此刻正在做）、\n' +
            '過去簡單式（過去發生且結束）、未來式（還沒發生）、\n' +
            '現在完成式（從過去延續到現在，或到目前為止的經驗）。\n' +
            '⚠ 選時態的關鍵是「時間點」與「說話的重點」。',
      viz: { type: 'tense', verb: 'eat', highlight: '現在簡單式' },
      tip: '按按鈕比較五種時態。',
      check: {
        q: '選擇時態時，最重要的判斷依據是什麼？',
        options: [
          '事情發生的時間，以及說話者想強調什麼',
          '句子的長度',
          '主詞是誰',
          '動詞的字母數'
        ],
        answer: 0,
        why: [
          null,
          '長度與時態無關。',
          '主詞影響動詞形式，但不決定時態。',
          '拼字長短與時態無關。'
        ]
      }
    },
    {
      title: '② 時間詞是最好的線索',
      body: 'every day、usually → 現在簡單式。\n' +
            'now、right now、Look! → 現在進行式。\n' +
            'yesterday、last week、ago → 過去式。\n' +
            'tomorrow、next week → 未來式。\n' +
            'already、just、ever、never、since、for → 現在完成式。',
      viz: { type: 'classify', groups: [
        { label: '現在式', items: ['every day', 'usually', 'often'] },
        { label: '過去式', items: ['yesterday', 'last week', 'ago'] },
        { label: '未來式', items: ['tomorrow', 'next week', 'soon'] },
        { label: '完成式', items: ['already', 'just', 'ever', 'since'] }] },
      check: {
        q: '看到句子裡有 since 2020，通常要用什麼時態？',
        options: [
          '現在完成式',
          '過去簡單式',
          '未來式',
          '現在進行式'
        ],
        answer: 0,
        why: [
          null,
          '過去式表示已經結束的事。',
          '未來式指還沒發生的事。',
          '進行式描述此刻正在做的事。'
        ]
      }
    },
    {
      title: '③ 現在簡單式與進行式的對照',
      body: 'I play tennis every Sunday.（習慣）\n' +
            'I am playing tennis now.（此刻）\n' +
            '⚠ 注意：like、know、want 等狀態動詞通常不用進行式。',
      viz: { type: 'compareexp',
             factor: '兩種現在式',
             a: { label: '簡單式', note: '習慣或事實' },
             b: { label: '進行式', note: '此刻正在進行' },
             same: ['都描述現在'] },
      check: {
        q: '下列哪一句的用法「不正確」？',
        options: [
          'I am knowing the answer.',
          'I know the answer.',
          'I am reading a book.',
          'I read every night.'
        ],
        answer: 0,
        why: [
          null,
          '狀態動詞用簡單式是正確的。',
          '讀書是動作，可以用進行式。',
          '這是描述習慣，用簡單式正確。'
        ]
      }
    },
    {
      title: '④ 過去式與現在完成式',
      body: '過去式：明確的過去時間點（I went to Japan last year.）\n' +
            '現在完成式：不強調時間點，重點在「經驗或結果」\n' +
            '（I have been to Japan.）\n' +
            '⚠ 有明確過去時間詞時「不能」用現在完成式：\n' +
            'I have gone yesterday. ✗',
      viz: { type: 'compareexp',
             factor: '兩種談過去的方式',
             a: { label: '過去式', note: '有明確時間點：last year' },
             b: { label: '現在完成式', note: '強調經驗或影響到現在' },
             same: ['都與過去有關'] },
      check: {
        q: '句子裡有 yesterday 時，為什麼不能用現在完成式？',
        options: [
          '因為現在完成式不能搭配明確的過去時間點',
          '因為 yesterday 太短',
          '因為完成式只能用於未來',
          '因為沒有這種規定'
        ],
        answer: 0,
        why: [
          null,
          '長度與文法規則無關。',
          '完成式與未來無關。',
          '這是明確的文法規則。'
        ]
      }
    },
    {
      title: '⑤ 兩種未來式',
      body: 'be going to：已經計畫好、有跡象。\n' +
            'will：當下決定、預測、承諾。\n' +
            '⚠ 也可以用現在進行式表達「已安排好的近期計畫」：\n' +
            'I am meeting him tomorrow.',
      viz: { type: 'classify', groups: [
        { label: 'be going to', items: ['已計畫', '有跡象'] },
        { label: 'will', items: ['當下決定', '預測', '承諾'] },
        { label: '進行式表未來', items: ['已安排好的行程'] }] },
      check: {
        q: '朋友問你要不要一起去，你當場答應「好，我會去」，用哪一種說法最自然？',
        options: [
          'OK, I will go.',
          'OK, I am going to go (planned last month).',
          'OK, I go.',
          'OK, I went.'
        ],
        answer: 0,
        why: [
          null,
          '這個選項的說明表示是很早以前就計畫好的。',
          '現在式無法表達當下的決定。',
          '過去式表示已經去過了。'
        ]
      }
    },
    {
      title: '⑥ 時態一致',
      body: '同一段敘述中，時態要一致：\n' +
            '講昨天的事就整段用過去式，講習慣就用現在式。\n' +
            '⚠ 常見錯誤：Yesterday I go to school and studied English.\n' +
            '（go 應該改成 went）',
      viz: { type: 'energyflow', steps: ['判斷時間', '選定時態', '整段一致', '檢查動詞'] },
      check: {
        q: '寫一段描述昨天的文章時，應該注意什麼？',
        options: [
          '整段的動詞都要用過去式，保持一致',
          '每一句用不同的時態',
          '只有第一句用過去式',
          '時態可以隨意混用'
        ],
        answer: 0,
        why: [
          null,
          '隨意變換時態會讓讀者混亂。',
          '整段都在講過去，都要用過去式。',
          '時態混亂會讓意思不清楚。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第2單元 助動詞 can／must／should'] = {
  intro: '助動詞不表示動作，但能改變整句話的語氣——能力、義務還是建議。',
  cards: [
    {
      title: '① 助動詞的共同規則',
      body: '① 後面接原形動詞 ② 不隨主詞變化（沒有 cans、musts）\n' +
            '③ 否定直接加 not ④ 疑問句把它移到句首。\n' +
            '⚠ 這些規則對 can、must、should、will、may 都適用。',
      viz: { type: 'sentence', label: '助動詞句', items: [
        { t: 'He', r: '主詞' }, { t: 'can', r: '助動詞（不變）' },
        { t: 'swim', r: '原形動詞' }],
        note: '助動詞不隨主詞變化，後面接原形動詞。' },
      check: {
        q: '助動詞後面接的動詞是什麼形式？',
        options: [
          '原形動詞',
          '過去式',
          '動詞-ing',
          '加 s 的形式'
        ],
        answer: 0,
        why: [
          null,
          '助動詞後面不用過去式。',
          '進行式的 -ing 要配合 be 動詞。',
          '助動詞後面的動詞不加 s。'
        ]
      }
    },
    {
      title: '② can：能力與許可',
      body: '能力：I can swim.（我會游泳。）\n' +
            '許可：You can go now.（你可以走了。）\n' +
            '請求：Can you help me?\n' +
            '⚠ 過去式是 could：I could swim when I was five.',
      viz: { type: 'classify', groups: [
        { label: 'can 的用法', items: ['能力', '許可', '請求'] },
        { label: '過去式', items: ['could'] }] },
      check: {
        q: '「我五歲時就會游泳」的正確說法是什麼？',
        options: [
          'I could swim when I was five.',
          'I can swim when I was five.',
          'I could swam when I was five.',
          'I was can swim when I was five.'
        ],
        answer: 0,
        why: [
          null,
          '過去的能力要用 could。',
          'could 後面要接原形動詞。',
          '不能同時使用 be 動詞與助動詞。'
        ]
      }
    },
    {
      title: '③ must：必須',
      body: '表示「必須、一定要」，語氣強烈：\n' +
            'You must wear a helmet.（你必須戴安全帽。）\n' +
            '⚠ must not（mustn’t）表示「禁止」，\n' +
            '不是「不必」——「不必」要說 do not have to。',
      viz: { type: 'compareexp',
             factor: '兩種否定',
             a: { label: 'must not', note: '禁止：絕對不可以做' },
             b: { label: 'do not have to', note: '不必：可做可不做' },
             same: ['都含有否定'] },
      check: {
        q: 'You must not touch it. 是什麼意思？',
        options: [
          '你絕對不可以碰它（禁止）',
          '你不必碰它',
          '你可以選擇要不要碰',
          '你應該碰它'
        ],
        answer: 0,
        why: [
          null,
          '「不必」要說 do not have to。',
          'must not 沒有選擇的空間。',
          '這是禁止而不是建議。'
        ]
      }
    },
    {
      title: '④ should：建議',
      body: '表示「應該」，語氣比 must 溫和：\n' +
            'You should see a doctor.（你應該去看醫生。）\n' +
            'You should not stay up late.\n' +
            '⚠ should 用於提出建議或表達適當的做法。',
      viz: { type: 'sentence', label: '給建議', items: [
        { t: 'You', r: '主詞' }, { t: 'should', r: '助動詞' },
        { t: 'see', r: '原形動詞' }, { t: 'a doctor', r: '受詞' }],
        note: 'should 用來提出建議。' },
      check: {
        q: '朋友身體不舒服，你想建議他去看醫生，應該用哪一個助動詞？',
        options: ['should', 'must', 'can', 'will'],
        answer: 0,
        why: [
          null,
          'must 的語氣像命令，用於建議略強。',
          'can 表示能力或許可。',
          'will 表示未來。'
        ]
      }
    },
    {
      title: '⑤ have to 與 must',
      body: 'have to 也表示「必須」，但語氣通常來自外在規定：\n' +
            'I have to wear a uniform.（學校規定）\n' +
            'must 則常表示說話者自己的強烈認為。\n' +
            '⚠ have to 有時態變化（had to、will have to），\n' +
            'must 沒有過去式。',
      viz: { type: 'compareexp',
             factor: '兩種必須',
             a: { label: 'must', note: '說話者主觀認為必須，沒有過去式' },
             b: { label: 'have to', note: '外在規定，有時態變化' },
             same: ['都表示必須'] },
      check: {
        q: '要表達「我昨天必須早起」，應該怎麼說？',
        options: [
          'I had to get up early yesterday.',
          'I musted get up early yesterday.',
          'I must got up early yesterday.',
          'I was must get up early.'
        ],
        answer: 0,
        why: [
          null,
          'must 沒有過去式形式。',
          'must 後面要接原形，而且不能表達過去。',
          '不能同時使用 be 動詞與助動詞。'
        ]
      }
    },
    {
      title: '⑥ 語氣的強弱',
      body: '由強到弱：must ＞ have to ＞ should ＞ could／might。\n' +
            '⚠ 對別人說話時要注意語氣：\n' +
            '對朋友可以說 You should…，\n' +
            '但對不熟的人用 Maybe you could… 會更委婉。',
      viz: { type: 'classify', groups: [
        { label: '強', items: ['must', 'have to'] },
        { label: '中', items: ['should', 'ought to'] },
        { label: '弱（委婉）', items: ['could', 'might', 'maybe you can'] }] },
      check: {
        q: '想對不熟的人提出建議，語氣最委婉的說法是什麼？',
        options: [
          'Maybe you could try this.',
          'You must do this.',
          'You have to do this.',
          'Do this now.'
        ],
        answer: 0,
        why: [
          null,
          'must 的語氣接近命令。',
          'have to 同樣帶有強制感。',
          '祈使句對不熟的人略顯強硬。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第3單元 動名詞與不定詞'] = {
  intro: '動詞要當名詞用時，有兩種變身方式：加 ing，或加 to。',
  cards: [
    {
      title: '① 什麼是動名詞',
      body: '動詞加 -ing 之後可以當名詞用（動名詞）：\n' +
            'Swimming is fun.（游泳很有趣。）→ 當主詞\n' +
            'I like swimming.→ 當受詞\n' +
            '⚠ 動名詞當主詞時，動詞用單數（Swimming is…）。',
      viz: { type: 'sentence', label: '動名詞當主詞', items: [
        { t: 'Swimming', r: '動名詞（主詞）' }, { t: 'is', r: 'be 動詞（單數）' },
        { t: 'fun', r: '形容詞' }],
        note: '動名詞當主詞時視為單數。' },
      check: {
        q: '「游泳很有趣」的正確說法是什麼？',
        options: [
          'Swimming is fun.',
          'Swimming are fun.',
          'Swim is fun.',
          'To swimming is fun.'
        ],
        answer: 0,
        why: [
          null,
          '動名詞當主詞視為單數。',
          '原形動詞不能直接當主詞。',
          'to 後面要接原形動詞。'
        ]
      }
    },
    {
      title: '② 什麼是不定詞',
      body: 'to ＋ 原形動詞（不定詞）：\n' +
            'I want to go.（我想去。）\n' +
            'To learn English is important.（學英文很重要。）\n' +
            '⚠ 不定詞也可以當主詞，但更常用 It is important to learn English.',
      viz: { type: 'sentence', label: '不定詞當受詞', items: [
        { t: 'I', r: '主詞' }, { t: 'want', r: '動詞' }, { t: 'to go', r: '不定詞' }],
        note: 'want 後面要接不定詞。' },
      check: {
        q: '「我想要去」的正確說法是什麼？',
        options: [
          'I want to go.',
          'I want go.',
          'I want going.',
          'I want to going.'
        ],
        answer: 0,
        why: [
          null,
          'want 後面要接不定詞。',
          'want 後面不接動名詞。',
          'to 後面要接原形動詞。'
        ]
      }
    },
    {
      title: '③ 只接動名詞的動詞',
      body: 'enjoy、finish、practice、mind、keep、avoid、give up。\n' +
            'I enjoy reading.（不能說 enjoy to read）\n' +
            '⚠ 記法：這些動詞多半和「持續或已經在做的事」有關。',
      viz: { type: 'classify', groups: [
        { label: '只接動名詞', items: ['enjoy', 'finish', 'practice', 'mind', 'keep'] }] },
      check: {
        q: '下列哪一句的用法正確？',
        options: [
          'I finished doing my homework.',
          'I finished to do my homework.',
          'I finished do my homework.',
          'I am finish doing my homework.'
        ],
        answer: 0,
        why: [
          null,
          'finish 後面只能接動名詞。',
          'finish 後面不能直接接原形。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '④ 只接不定詞的動詞',
      body: 'want、hope、plan、decide、need、learn、would like、promise。\n' +
            'I hope to see you.（不能說 hope seeing）\n' +
            '⚠ 記法：這些動詞多半和「還沒發生、想做的事」有關。',
      viz: { type: 'compareexp',
             factor: '兩類動詞',
             a: { label: '接動名詞', note: 'enjoy、finish：已經在做或做完' },
             b: { label: '接不定詞', note: 'want、plan：還沒做、想做' },
             same: ['後面都要接動詞的變化形'] },
      check: {
        q: '「我計畫去日本」的正確說法是什麼？',
        options: [
          'I plan to go to Japan.',
          'I plan going to Japan.',
          'I plan go to Japan.',
          'I am plan to go to Japan.'
        ],
        answer: 0,
        why: [
          null,
          'plan 後面要接不定詞。',
          'plan 後面不能直接接原形。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '⑤ 兩者都可以的動詞',
      body: 'like、love、hate、start、begin 兩種都可以：\n' +
            'I like swimming.＝ I like to swim.\n' +
            '⚠ 但少數動詞意思會變：\n' +
            'stop smoking（戒菸）／stop to smoke（停下來去抽菸）。',
      viz: { type: 'compareexp',
             factor: 'stop 的兩種用法',
             a: { label: 'stop ＋ -ing', note: '停止做某事：stop smoking（戒菸）' },
             b: { label: 'stop ＋ to V', note: '停下來去做：stop to smoke（停下來抽菸）' },
             same: ['都用動詞 stop'] },
      check: {
        q: 'He stopped smoking. 是什麼意思？',
        options: [
          '他戒菸了',
          '他停下來抽菸',
          '他開始抽菸',
          '他想抽菸'
        ],
        answer: 0,
        why: [
          null,
          '這是 stopped to smoke 的意思。',
          '這裡的 stop 表示停止。',
          '句中沒有表達意願。'
        ]
      }
    },
    {
      title: '⑥ 介系詞後面用動名詞',
      body: '介系詞後面接動詞時，一律用動名詞：\n' +
            'Thank you for helping me.　I am good at swimming.\n' +
            'She is interested in learning Japanese.\n' +
            '⚠ 注意 to 有時是介系詞（look forward to seeing you），\n' +
            '這時後面也要用動名詞。',
      viz: { type: 'sentence', label: '介系詞後', items: [
        { t: 'Thank you for', r: '介系詞 for' }, { t: 'helping', r: '動名詞' },
        { t: 'me', r: '受詞' }],
        note: '介系詞後面的動詞要用動名詞。' },
      check: {
        q: '「謝謝你幫我」的正確說法是什麼？',
        options: [
          'Thank you for helping me.',
          'Thank you for help me.',
          'Thank you for to help me.',
          'Thank you help me.'
        ],
        answer: 0,
        why: [
          null,
          '介系詞後面要用動名詞。',
          '介系詞後面不接不定詞。',
          '缺少介系詞 for。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第4單元 疑問句綜合'] = {
  intro: '把各種問句放在一起，就會發現它們的規則其實很有系統。',
  cards: [
    {
      title: '① 三種疑問句',
      body: '① be 動詞問句：Are you ready?\n' +
            '② 一般動詞問句：Do you like it?\n' +
            '③ 助動詞問句：Can you swim?／Will you come?\n' +
            '⚠ 共同規則：把 be 動詞或助動詞移到主詞前面。',
      viz: { type: 'classify', groups: [
        { label: 'be 動詞句', items: ['Are you…?', 'Is he…?', 'Were they…?'] },
        { label: '一般動詞句', items: ['Do you…?', 'Does he…?', 'Did they…?'] },
        { label: '助動詞句', items: ['Can you…?', 'Will he…?', 'Should we…?'] }] },
      check: {
        q: '所有疑問句的共同規則是什麼？',
        options: [
          '把 be 動詞或助動詞放到主詞前面',
          '在句尾加問號就好',
          '把動詞放到最後',
          '把主詞省略'
        ],
        answer: 0,
        why: [
          null,
          '語序也必須調整。',
          '英文的疑問句不是靠把動詞放最後構成的。',
          '疑問句中的主詞不能省略。'
        ]
      }
    },
    {
      title: '② 疑問詞問句',
      body: '疑問詞 ＋ 助動詞／be 動詞 ＋ 主詞 ＋ 動詞：\n' +
            'What are you doing?　Where did he go?　Why should I go?\n' +
            '⚠ 疑問詞放最前面，其餘語序和 Yes／No 問句相同。',
      viz: { type: 'sentence', label: '疑問詞問句', items: [
        { t: 'Where', r: '疑問詞' }, { t: 'did', r: '助動詞' }, { t: 'he', r: '主詞' },
        { t: 'go', r: '原形動詞' }],
        note: '疑問詞在最前面，接著助動詞與主詞。' },
      check: {
        q: '「他為什麼哭？」的正確說法是什麼？',
        options: [
          'Why did he cry?',
          'Why he cried?',
          'Why did he cried?',
          'Why he did cry?'
        ],
        answer: 0,
        why: [
          null,
          '疑問句需要助動詞。',
          '用了 did 之後動詞要用原形。',
          '助動詞要放在主詞前面。'
        ]
      }
    },
    {
      title: '③ 主詞疑問句',
      body: '當疑問詞本身就是主詞時，不用助動詞：\n' +
            'Who broke the window?（誰打破窗戶？）\n' +
            'What happened?（發生了什麼事？）\n' +
            '⚠ 這時動詞直接用適當的時態形式。',
      viz: { type: 'compareexp',
             factor: '疑問詞的角色',
             a: { label: '疑問詞當主詞', note: 'Who called? 不用助動詞' },
             b: { label: '疑問詞當受詞', note: 'Who did you call? 要用助動詞' },
             same: ['都以疑問詞開頭'] },
      check: {
        q: '「發生了什麼事？」的正確說法是什麼？',
        options: [
          'What happened?',
          'What did happened?',
          'What did happen it?',
          'What was happen?'
        ],
        answer: 0,
        why: [
          null,
          'what 是主詞，不需要助動詞。',
          '這個句子多了不必要的字。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '④ 附加問句',
      body: '在句尾加一個小問句確認：\n' +
            'You are a student, aren’t you?（你是學生，對吧？）\n' +
            'He can swim, can’t he?\n' +
            '⚠ 規則：前面肯定 → 後面否定；前面否定 → 後面肯定。',
      viz: { type: 'compareexp',
             factor: '附加問句的規則',
             a: { label: '前肯定', note: '後面用否定：You are…, aren’t you?' },
             b: { label: '前否定', note: '後面用肯定：You aren’t…, are you?' },
             same: ['都用來尋求確認'] },
      check: {
        q: 'She is your sister, ____? 空格應該填什麼？',
        options: [
          'isn’t she',
          'is she',
          'doesn’t she',
          'isn’t her'
        ],
        answer: 0,
        why: [
          null,
          '前面是肯定，後面要用否定。',
          '前面是 be 動詞，附加問句也要用 be 動詞。',
          '附加問句要用主格 she。'
        ]
      }
    },
    {
      title: '⑤ 間接問句',
      body: '把問句放進另一個句子裡時，「語序要變回陳述句」：\n' +
            'Where does he live?→ I do not know where he lives.\n' +
            '⚠ 常見錯誤：I do not know where does he live. ✗\n' +
            '間接問句中不用助動詞、也不倒裝。',
      viz: { type: 'compareexp',
             factor: '直接與間接問句',
             a: { label: '直接問句', note: 'Where does he live? 要倒裝' },
             b: { label: '間接問句', note: '…where he lives. 不倒裝' },
             same: ['都在問同一件事'] },
      check: {
        q: '「我不知道他住在哪裡」的正確說法是什麼？',
        options: [
          'I do not know where he lives.',
          'I do not know where does he live.',
          'I do not know where lives he.',
          'I do not know where he live.'
        ],
        answer: 0,
        why: [
          null,
          '間接問句不需要助動詞倒裝。',
          '語序應該是主詞在前。',
          '主詞是第三人稱單數，動詞要加 s。'
        ]
      }
    },
    {
      title: '⑥ 問句的語氣',
      body: '直接：Where is the station?\n' +
            '客氣：Could you tell me where the station is?\n' +
            '⚠ 用 Could you tell me…？開頭會禮貌得多，\n' +
            '而且後面要用間接問句的語序（不倒裝）。',
      viz: { type: 'sentence', label: '客氣的問法', items: [
        { t: 'Could you tell me', r: '禮貌開場' }, { t: 'where', r: '疑問詞' },
        { t: 'the station is', r: '不倒裝' }],
        note: '客氣的問法後面用間接問句的語序。' },
      check: {
        q: '「可以告訴我火車站在哪裡嗎？」的正確說法是什麼？',
        options: [
          'Could you tell me where the train station is?',
          'Could you tell me where is the train station?',
          'Could you tell me the train station where is?',
          'Could you tell where is train station?'
        ],
        answer: 0,
        why: [
          null,
          '間接問句不倒裝。',
          '語序不正確，不符合間接問句的規則。',
          '這個句子缺少受詞也語序錯誤。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第5單元 連接詞與句子連結'] = {
  intro: '會用連接詞，短句就能變成流暢的段落。',
  cards: [
    {
      title: '① 對等連接詞',
      body: 'and（並列）、but（轉折）、or（選擇）、so（結果）。\n' +
            '⚠ 這些連接「地位相同」的兩個部分：\n' +
            '單字對單字、片語對片語、句子對句子。',
      viz: { type: 'classify', groups: [
        { label: '並列', items: ['and'] },
        { label: '轉折', items: ['but', 'yet'] },
        { label: '選擇', items: ['or'] },
        { label: '結果', items: ['so'] }] },
      check: {
        q: '要表達「他很累，所以早睡了」，應該用哪一個連接詞？',
        options: ['so', 'but', 'or', 'because'],
        answer: 0,
        why: [
          null,
          'but 表示轉折。',
          'or 表示選擇。',
          'because 後面接的是原因而不是結果。'
        ]
      }
    },
    {
      title: '② 從屬連接詞：原因',
      body: 'because（因為）、since、as。\n' +
            'I stayed home because it rained.\n' +
            '⚠ because 後面接完整的句子；\n' +
            'because of 後面接名詞（because of the rain）。',
      viz: { type: 'compareexp',
             factor: '兩種說原因的方式',
             a: { label: 'because', note: '後面接句子：because it rained' },
             b: { label: 'because of', note: '後面接名詞：because of the rain' },
             same: ['都表示原因'] },
      check: {
        q: '「因為下雨」的兩種說法中，哪一個是正確的？',
        options: [
          'because of the rain',
          'because the rain',
          'because of it rained',
          'because rain'
        ],
        answer: 0,
        why: [
          null,
          'because 後面要接完整的句子。',
          'because of 後面要接名詞。',
          '缺少必要的結構。'
        ]
      }
    },
    {
      title: '③ 從屬連接詞：時間',
      body: 'when（當…時）、while（當…同時）、before（之前）、after（之後）、\n' +
            'until（直到）、as soon as（一…就…）。\n' +
            '⚠ 時間子句中「不用未來式」：\n' +
            'I will call you when I arrive.（不是 when I will arrive）',
      viz: { type: 'sentence', label: '時間子句', items: [
        { t: 'I will call you', r: '主要子句（未來）' }, { t: 'when', r: '連接詞' },
        { t: 'I arrive', r: '時間子句（現在式）' }],
        note: '時間子句中用現在式表示未來。' },
      check: {
        q: '「我到的時候會打給你」的正確說法是什麼？',
        options: [
          'I will call you when I arrive.',
          'I will call you when I will arrive.',
          'I call you when I will arrive.',
          'I will call you when I arrived.'
        ],
        answer: 0,
        why: [
          null,
          '時間子句中不用未來式。',
          '主要子句應該用未來式。',
          '時間子句不該用過去式。'
        ]
      }
    },
    {
      title: '④ 從屬連接詞：條件與讓步',
      body: '條件：if（如果）、unless（除非）。\n' +
            '讓步：although／though（雖然）、even though。\n' +
            '⚠ 中文可以說「雖然…但是…」，\n' +
            '但英文「不能」同時用 although 與 but。',
      viz: { type: 'compareexp',
             factor: '中英文的差別',
             a: { label: '中文', note: '雖然…但是…（可以並用）' },
             b: { label: '英文', note: 'Although… ，不能再加 but' },
             same: ['都表達讓步'] },
      check: {
        q: '「雖然他很累，但他還是去了」的正確英文是什麼？',
        options: [
          'Although he was tired, he still went.',
          'Although he was tired, but he still went.',
          'Although but he was tired, he went.',
          'He was tired although but went.'
        ],
        answer: 0,
        why: [
          null,
          '英文不能同時使用 although 與 but。',
          '這個語序不正確。',
          '這個句子的結構混亂。'
        ]
      }
    },
    {
      title: '⑤ if 的用法',
      body: '條件句中「不用未來式」：\n' +
            'If it rains tomorrow, we will stay home.\n' +
            '⚠ if 子句用現在式，主要子句用未來式——\n' +
            '這和時間子句的規則相同。',
      viz: { type: 'sentence', label: '條件句', items: [
        { t: 'If it rains', r: '條件（現在式）' }, { t: 'we will stay home', r: '結果（未來式）' }],
        note: 'if 子句用現在式，主要子句用未來式。' },
      check: {
        q: '「如果明天下雨，我們就待在家」的正確說法是什麼？',
        options: [
          'If it rains tomorrow, we will stay home.',
          'If it will rain tomorrow, we will stay home.',
          'If it rains tomorrow, we stay home.',
          'If it rained tomorrow, we will stay home.'
        ],
        answer: 0,
        why: [
          null,
          'if 子句中不用未來式。',
          '主要子句應該用未來式。',
          '這個時態組合不正確。'
        ]
      }
    },
    {
      title: '⑥ 讓文章更流暢',
      body: '除了連接詞，還可以用「轉承語」：\n' +
            'however（然而）、also（也）、for example（例如）、\n' +
            'in addition（此外）、finally（最後）。\n' +
            '⚠ 這些後面通常加逗號，而且要放在句首或句中。',
      viz: { type: 'classify', groups: [
        { label: '補充', items: ['also', 'in addition', 'besides'] },
        { label: '轉折', items: ['however', 'on the other hand'] },
        { label: '舉例', items: ['for example', 'such as'] }] },
      check: {
        q: '要在句子開頭表示「然而」，可以用哪一個字？',
        options: ['However,', 'But however', 'Although,', 'So,'],
        answer: 0,
        why: [
          null,
          '不需要同時使用 but 與 however。',
          'although 後面要接子句而不是逗號。',
          'so 表示結果而不是轉折。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第6單元 日常對話情境'] = {
  intro: '學了這麼多文法，最後都要回到一件事：能不能開口說。',
  cards: [
    {
      title: '① 打招呼與寒暄',
      body: 'How are you doing?／What’s up?（近況如何？）\n' +
            'Long time no see!（好久不見！）\n' +
            'How was your weekend?（週末過得如何？）\n' +
            '⚠ 寒暄不需要長篇大論，簡短回應再反問對方就好。',
      viz: { type: 'energyflow', steps: ['打招呼', '簡短回應', '反問對方', '延伸話題'] },
      check: {
        q: '別人問 How was your weekend? 時，比較好的回應方式是什麼？',
        options: [
          '簡短說明並反問對方',
          '只說 Good 就不再說話',
          '講二十分鐘的細節',
          '不回應'
        ],
        answer: 0,
        why: [
          null,
          '太簡短會讓對話中斷。',
          '過長會讓對方難以接話。',
          '不回應是不禮貌的。'
        ]
      }
    },
    {
      title: '② 在餐廳',
      body: 'A table for two, please.（兩位。）\n' +
            'May I see the menu?（可以看菜單嗎？）\n' +
            'I would like the chicken, please.\n' +
            'Could we have the bill?（可以結帳嗎？）\n' +
            '⚠ 用 I would like 比 I want 有禮貌。',
      viz: { type: 'energyflow', steps: ['入座', '看菜單', '點餐', '結帳'] },
      check: {
        q: '在餐廳點餐時，比較有禮貌的說法是什麼？',
        options: [
          'I would like the chicken, please.',
          'I want chicken.',
          'Give me chicken.',
          'Chicken.'
        ],
        answer: 0,
        why: [
          null,
          'I want 的語氣較直接。',
          '命令句在服務場合不禮貌。',
          '只說名詞不算完整的句子。'
        ]
      }
    },
    {
      title: '③ 購物',
      body: 'I am just looking, thanks.（我只是看看。）\n' +
            'Do you have this in another size／color?\n' +
            'Can I try it on?（可以試穿嗎？）\n' +
            'I will take it.（我要買這個。）\n' +
            '⚠ try on 是「試穿」，代名詞要放中間：try it on。',
      viz: { type: 'sentence', label: '試穿', items: [
        { t: 'Can I try', r: '請求' }, { t: 'it', r: '代名詞（放中間）' },
        { t: 'on', r: '介副詞' }],
        note: '代名詞當受詞時要放在動詞與介副詞之間。' },
      check: {
        q: '「我可以試穿嗎？」（指某件衣服）的正確說法是什麼？',
        options: [
          'Can I try it on?',
          'Can I try on it?',
          'Can I on try it?',
          'Can I try on?'
        ],
        answer: 0,
        why: [
          null,
          '代名詞要放在動詞與介副詞中間。',
          '語序不正確，介副詞不能放在動詞前面。',
          '缺少受詞，沒有說明要試穿什麼。'
        ]
      }
    },
    {
      title: '④ 問路與交通',
      body: 'Excuse me, how do I get to the museum?\n' +
            'Is it far from here?（離這裡遠嗎？）\n' +
            'Which bus should I take?（我該搭哪一班公車？）\n' +
            '⚠ 聽不懂時可以說：Could you say that again, please?',
      viz: { type: 'energyflow', steps: ['Excuse me', '說出目的地', '確認細節', '道謝'] },
      check: {
        q: '對方說的話你沒聽清楚，可以怎麼說？',
        options: [
          'Could you say that again, please?',
          'What?',
          'I do not understand you at all.',
          '不說話直接走開'
        ],
        answer: 0,
        why: [
          null,
          '單獨說 What? 可能顯得不禮貌。',
          '這個說法過於負面。',
          '直接離開非常不禮貌。'
        ]
      }
    },
    {
      title: '⑤ 表達意見',
      body: 'I think…（我認為…）　In my opinion…（依我看…）\n' +
            'I agree.／I do not agree.（我同意／不同意。）\n' +
            'That is a good point.（有道理。）\n' +
            '⚠ 表達不同意時可以說：I see your point, but…\n' +
            '這樣比直接說 You are wrong 委婉得多。',
      viz: { type: 'compareexp',
             factor: '表達不同意的方式',
             a: { label: '委婉', note: 'I see your point, but…' },
             b: { label: '直接', note: 'You are wrong.' },
             same: ['都表示不同意'] },
      check: {
        q: '想表達不同意但又不想太直接，可以怎麼說？',
        options: [
          'I see your point, but I think…',
          'You are wrong.',
          'That is stupid.',
          'No.'
        ],
        answer: 0,
        why: [
          null,
          '這個說法過於直接。',
          '這是人身評價，非常不禮貌。',
          '單獨說 No 顯得生硬。'
        ]
      }
    },
    {
      title: '⑥ 對話的技巧',
      body: '① 用開放式問題（What／How）延續話題。\n' +
            '② 適時回應：Really?／That is interesting!\n' +
            '③ 不懂就問，不要假裝聽懂。\n' +
            '⚠ 說錯不要緊——溝通的目的是讓對方懂，不是零錯誤。',
      viz: { type: 'energyflow', steps: ['開放式提問', '積極回應', '不懂就問', '持續練習'] },
      check: {
        q: '用英文對話時，最重要的心態是什麼？',
        options: [
          '重點是讓對方理解，不必害怕犯錯',
          '一定要文法完全正確才能開口',
          '不懂也要假裝聽懂',
          '講得越快越好'
        ],
        answer: 0,
        why: [
          null,
          '追求完美會讓人不敢開口。',
          '假裝理解會造成更大的誤會。',
          '速度不等於溝通效果。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第7單元 形容詞與副詞'] = {
  intro: '形容詞修飾名詞，副詞修飾動詞——這一個字之差，考試最愛考。',
  cards: [
    {
      title: '① 形容詞的功能',
      body: '修飾名詞，說明「什麼樣的」：a beautiful flower。\n' +
            '也可以放在 be 動詞或五感動詞後面：She is beautiful.／It looks good.\n' +
            '⚠ 形容詞不能修飾動詞。',
      viz: { type: 'sentence', label: '形容詞', items: [
        { t: 'a', r: '冠詞' }, { t: 'beautiful', r: '形容詞' }, { t: 'flower', r: '名詞' }],
        note: '形容詞放在名詞前面修飾它。' },
      check: {
        q: '形容詞主要用來修飾什麼？',
        options: ['名詞', '動詞', '副詞', '介系詞'],
        answer: 0,
        why: [
          null,
          '修飾動詞的是副詞。',
          '副詞可以修飾副詞，但形容詞不行。',
          '介系詞不需要被形容詞修飾。'
        ]
      }
    },
    {
      title: '② 副詞的功能',
      body: '修飾動詞、形容詞或另一個副詞：\n' +
            'He runs quickly.（修飾動詞）\n' +
            'It is very hot.（修飾形容詞）\n' +
            'He runs very quickly.（修飾副詞）\n' +
            '⚠ 大多數副詞由形容詞加 ly 構成：quick → quickly。',
      viz: { type: 'sentence', label: '副詞修飾動詞', items: [
        { t: 'He', r: '主詞' }, { t: 'runs', r: '動詞' }, { t: 'quickly', r: '副詞' }],
        note: '副詞用來說明動作「怎麼做」。' },
      check: {
        q: '「他跑得很快」的正確說法是什麼？',
        options: [
          'He runs quickly.',
          'He runs quick.',
          'He is run quickly.',
          'He quickly is run.'
        ],
        answer: 0,
        why: [
          null,
          '修飾動詞要用副詞。',
          '不能同時使用 be 動詞與一般動詞。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '③ ly 的拼寫規則',
      body: '一般加 ly：slow → slowly、careful → carefully。\n' +
            '子音＋y：去 y 加 ily（happy → happily、easy → easily）。\n' +
            '字尾 le：去 e 加 y（simple → simply）。\n' +
            '⚠ 例外：good 的副詞是 well（不是 goodly）。',
      viz: { type: 'classify', groups: [
        { label: '加 ly', items: ['slowly', 'carefully', 'quietly'] },
        { label: '去 y 加 ily', items: ['happily', 'easily', 'angrily'] },
        { label: '不規則', items: ['good→well', 'fast→fast', 'hard→hard'] }] },
      check: {
        q: 'good 的副詞形是什麼？',
        options: ['well', 'goodly', 'gooder', 'goodily'],
        answer: 0,
        why: [
          null,
          '英文沒有 goodly 這個常用字。',
          'gooder 不是正確的形式。',
          '這個拼法不存在。'
        ]
      }
    },
    {
      title: '④ 同形的形容詞與副詞',
      body: 'fast、hard、early、late、high 的形容詞與副詞同形：\n' +
            'a fast car（形容詞）／He runs fast.（副詞）\n' +
            '⚠ 陷阱：hardly 不是 hard 的副詞，\n' +
            '它的意思是「幾乎不」（I can hardly hear you.）。',
      viz: { type: 'compareexp',
             factor: '容易混淆的字',
             a: { label: 'hard', note: '努力地、硬的：He works hard.' },
             b: { label: 'hardly', note: '幾乎不：He hardly works.' },
             same: ['拼法相似但意思相反'] },
      check: {
        q: 'He hardly works. 是什麼意思？',
        options: [
          '他幾乎不工作',
          '他很努力工作',
          '他工作很困難',
          '他必須工作'
        ],
        answer: 0,
        why: [
          null,
          '努力工作是 He works hard.',
          'hardly 不表示困難。',
          '這句話沒有表達義務。'
        ]
      }
    },
    {
      title: '⑤ 副詞的位置',
      body: '頻率副詞：一般動詞前、be 動詞後。\n' +
            '方式副詞：通常放句尾（He speaks English fluently.）\n' +
            '程度副詞：放在被修飾的字前面（very good、too fast）。\n' +
            '⚠ 位置錯了句子會不自然，甚至改變意思。',
      viz: { type: 'classify', groups: [
        { label: '頻率副詞', items: ['always', 'usually', 'often', 'never'] },
        { label: '方式副詞', items: ['quickly', 'carefully', 'well'] },
        { label: '程度副詞', items: ['very', 'too', 'quite', 'really'] }] },
      check: {
        q: '「他總是很小心」的正確語序是什麼？',
        options: [
          'He is always careful.',
          'He always is careful.',
          'Always he is careful.',
          'He is careful always.'
        ],
        answer: 0,
        why: [
          null,
          '遇到 be 動詞時頻率副詞要放後面。',
          '這個語序不自然。',
          '雖可理解，但不是標準位置。'
        ]
      }
    },
    {
      title: '⑥ 常見錯誤',
      body: '① He speaks English good. ✗ → well ✓\n' +
            '② She sings beautiful. ✗ → beautifully ✓\n' +
            '③ It is a very good book.（very 修飾形容詞，正確）\n' +
            '⚠ 判斷方法：問自己「這個字在修飾誰」——\n' +
            '修飾名詞用形容詞，修飾動詞用副詞。',
      viz: { type: 'energyflow', steps: ['找出被修飾的字', '是名詞嗎', '是動詞嗎', '選形容詞或副詞'] },
      check: {
        q: '要判斷該用形容詞還是副詞，最有效的方法是什麼？',
        options: [
          '看它修飾的是名詞還是動詞',
          '看句子的長度',
          '看字尾有沒有 ly',
          '看主詞是誰'
        ],
        answer: 0,
        why: [
          null,
          '句子長度與詞類無關。',
          '有些副詞沒有 ly，例如 fast。',
          '主詞不決定要用哪一種詞類。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第8單元 短文閱讀理解'] = {
  intro: '國小英文的最後一哩：能讀懂一段完整的短文。',
  cards: [
    {
      title: '① 掌握段落結構',
      body: '英文段落通常有：主題句（第一句）→ 支持細節 → 結論句。\n' +
            '⚠ 找到主題句，整段的重點就掌握了一半。\n' +
            '細節多半是例子、原因或說明。',
      viz: { type: 'energyflow', steps: ['主題句', '支持細節', '例子', '結論句'] },
      check: {
        q: '英文段落的主題句通常出現在哪裡？',
        options: [
          '段落的第一句',
          '段落的正中間',
          '一定在最後一句',
          '沒有固定位置'
        ],
        answer: 0,
        why: [
          null,
          '中間通常是細節說明。',
          '結論句可能在最後，但主題句多在開頭。',
          '英文段落的結構相當有規律。'
        ]
      }
    },
    {
      title: '② 主旨與細節題',
      body: '主旨題：What is the passage mainly about?\n' +
            '細節題：When／Where／Who／What did…?\n' +
            '⚠ 主旨題的答案要能涵蓋全文；\n' +
            '細節題的答案通常能在文中直接找到。',
      viz: { type: 'compareexp',
             factor: '兩種題型',
             a: { label: '主旨題', note: '答案要涵蓋整篇' },
             b: { label: '細節題', note: '答案可在文中定位' },
             same: ['都需要回到文章確認'] },
      check: {
        q: '主旨題的正確答案應該具備什麼特點？',
        options: [
          '能涵蓋整篇文章的內容',
          '出現在文章的最後一句',
          '包含最多生字',
          '是最長的選項'
        ],
        answer: 0,
        why: [
          null,
          '位置只是線索之一。',
          '生字多寡與正確性無關。',
          '長度不能決定答案。'
        ]
      }
    },
    {
      title: '③ 推論題',
      body: '文章沒有直說，但可以從線索推出來：\n' +
            'What can we infer from the passage?\n' +
            '⚠ 推論一定要有文章的依據，\n' +
            '不能只憑自己的生活經驗或想像。',
      viz: { type: 'energyflow', steps: ['找出線索', '合理推論', '回文章驗證', '排除沒有依據的'] },
      check: {
        q: '做推論題時，最重要的原則是什麼？',
        options: [
          '推論必須有文章中的線索支持',
          '選最有趣的選項',
          '憑生活經驗自由聯想',
          '選最短的選項'
        ],
        answer: 0,
        why: [
          null,
          '趣味性與正確性無關。',
          '沒有依據的聯想容易出錯。',
          '長度不能決定答案。'
        ]
      }
    },
    {
      title: '④ 字義猜測',
      body: '線索：上下文、例子、同義或反義詞、字的組成。\n' +
            '⚠ 常見的字首字尾：\n' +
            'un-／in-（不）、re-（再）、-er（人）、-ful（充滿）、\n' +
            '-less（沒有）、-ly（副詞）、-tion（名詞）。',
      viz: { type: 'classify', groups: [
        { label: '否定字首', items: ['un-', 'in-', 'dis-'] },
        { label: '名詞字尾', items: ['-er', '-tion', '-ness'] },
        { label: '形容詞字尾', items: ['-ful', '-less', '-y'] }] },
      check: {
        q: '看到 useless 這個字，可以怎麼推測意思？',
        options: [
          'use 是使用，-less 表示沒有，合起來是「沒有用的」',
          '完全無法推測',
          '它應該是動詞',
          '它表示很有用'
        ],
        answer: 0,
        why: [
          null,
          '字的組成提供了明確線索。',
          '-less 結尾的字通常是形容詞。',
          '-less 表示的是否定。'
        ]
      }
    },
    {
      title: '⑤ 掌握代名詞與連接詞',
      body: '代名詞（he、it、they）指前面提過的人事物。\n' +
            '連接詞（but、however、because、so）提示句子之間的關係。\n' +
            '⚠ 看到 but 或 however，就知道後面要轉折了——\n' +
            '這常常是答案的所在。',
      viz: { type: 'classify', groups: [
        { label: '轉折信號', items: ['but', 'however', 'although'] },
        { label: '因果信號', items: ['because', 'so', 'therefore'] },
        { label: '舉例信號', items: ['for example', 'such as'] }] },
      check: {
        q: '讀到 however 這個字時，代表接下來會出現什麼？',
        options: [
          '和前面相反或不同的內容',
          '和前面完全相同的內容',
          '文章結束',
          '一個例子'
        ],
        answer: 0,
        why: [
          null,
          '轉折詞的作用正是引入不同的內容。',
          'however 不代表文章結束。',
          '舉例會用 for example。'
        ]
      }
    },
    {
      title: '⑥ 閱讀的長期練習',
      body: '① 選對難度（大部分看得懂）② 每天固定讀一小段\n' +
            '③ 讀完說出大意 ④ 記下三個有用的字並造句。\n' +
            '⚠ 閱讀量是英文能力的基礎——\n' +
            '讀得夠多，文法與字彙都會自然變好。',
      viz: { type: 'energyflow', steps: ['每天讀一段', '說出大意', '記三個字', '造句使用'] },
      check: {
        q: '為什麼閱讀量對英文能力這麼重要？',
        options: [
          '因為大量接觸能同時累積字彙、文法與語感',
          '因為讀得多考試就會考到',
          '因為閱讀比聽力簡單',
          '因為不用開口說話'
        ],
        answer: 0,
        why: [
          null,
          '閱讀的價值不只在應付考試。',
          '難易因人而異，重點在累積。',
          '各項能力都需要練習，閱讀是其中之一。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|六下|第9單元 寫作基本句型'] = {
  intro: '寫作不是寫難的句子，是把想說的話說清楚。',
  cards: [
    {
      title: '① 五大基本句型',
      body: '① 主詞＋動詞：Birds fly.\n' +
            '② 主詞＋動詞＋受詞：I like music.\n' +
            '③ 主詞＋be＋補語：She is a teacher.\n' +
            '④ 主詞＋動詞＋間接受詞＋直接受詞：He gave me a book.\n' +
            '⑤ 主詞＋動詞＋受詞＋受詞補語：We call him Tom.',
      viz: { type: 'sentence', label: '主詞＋動詞＋受詞', items: [
        { t: 'I', r: '主詞' }, { t: 'like', r: '動詞' }, { t: 'music', r: '受詞' }],
        note: '這是最常用的句型。',
        alt: [
          { label: '主詞＋be＋補語', items: [{ t: 'She', r: '主詞' }, { t: 'is', r: 'be 動詞' },
            { t: 'a teacher', r: '補語' }], note: '說明主詞是什麼。' },
          { label: '雙受詞', items: [{ t: 'He', r: '主詞' }, { t: 'gave', r: '動詞' },
            { t: 'me', r: '間接受詞' }, { t: 'a book', r: '直接受詞' }],
            note: '有些動詞後面可以接兩個受詞。' }] },
      tip: '按按鈕比較不同句型。',
      check: {
        q: 'He gave me a book. 這句話有幾個受詞？',
        options: [
          '兩個：me 與 a book',
          '一個：a book',
          '一個：me',
          '沒有受詞'
        ],
        answer: 0,
        why: [
          null,
          'me 也是受詞之一。',
          'a book 同樣是受詞。',
          '這個句型有兩個受詞。'
        ]
      }
    },
    {
      title: '② 完整句的三要素',
      body: '一個完整的句子要有：主詞、動詞，並表達完整的意思。\n' +
            '⚠ 常見錯誤：\n' +
            '① 缺動詞：He very tall. ✗ → He is very tall. ✓\n' +
            '② 缺主詞：Is a good idea. ✗ → It is a good idea. ✓',
      viz: { type: 'energyflow', steps: ['有主詞嗎', '有動詞嗎', '意思完整嗎', '才是完整句'] },
      check: {
        q: 'He very tall. 這句話少了什麼？',
        options: [
          '動詞（應該加 be 動詞 is）',
          '主詞',
          '受詞',
          '什麼都不缺'
        ],
        answer: 0,
        why: [
          null,
          'He 就是主詞。',
          '這個句型不需要受詞。',
          '句子缺少動詞就不完整。'
        ]
      }
    },
    {
      title: '③ 段落的結構',
      body: '主題句（說明這段要講什麼）→ 支持句（例子、理由）→ 結論句。\n' +
            '⚠ 一段只講一個重點；換重點就換一段。\n' +
            '這樣讀者才容易跟上。',
      viz: { type: 'energyflow', steps: ['主題句', '支持句一', '支持句二', '結論句'] },
      check: {
        q: '一個英文段落通常應該包含幾個主要重點？',
        options: [
          '一個',
          '至少三個',
          '越多越好',
          '沒有限制'
        ],
        answer: 0,
        why: [
          null,
          '重點太多會讓段落失焦。',
          '過多重點反而不清楚。',
          '一段一個重點是寫作的基本原則。'
        ]
      }
    },
    {
      title: '④ 常用的開頭與結尾',
      body: '開頭：I would like to talk about…／In my opinion…\n' +
            '舉例：For example，…／such as…\n' +
            '結尾：In conclusion，…／All in all，…／That is why…\n' +
            '⚠ 這些「轉承語」讓文章有層次，但不要每句都用。',
      viz: { type: 'classify', groups: [
        { label: '開頭', items: ['In my opinion', 'I think', 'First of all'] },
        { label: '舉例', items: ['For example', 'such as'] },
        { label: '結尾', items: ['In conclusion', 'All in all'] }] },
      check: {
        q: '要在文章結尾做總結，可以用哪一個轉承語？',
        options: [
          'In conclusion',
          'For example',
          'First of all',
          'On the other hand'
        ],
        answer: 0,
        why: [
          null,
          '這是用來舉例的。',
          '這是用在開頭的。',
          '這是用來表示對比的。'
        ]
      }
    },
    {
      title: '⑤ 寫作的檢查表',
      body: '寫完後檢查：\n' +
            '① 每句都有主詞與動詞嗎？\n' +
            '② 時態一致嗎？\n' +
            '③ 主詞與動詞一致嗎（第三人稱單數加 s）？\n' +
            '④ 拼字與標點正確嗎？（句首大寫、句尾句號）\n' +
            '⚠ 檢查比多寫兩句更能提高分數。',
      viz: { type: 'energyflow', steps: ['句子完整嗎', '時態一致嗎', '主詞動詞一致嗎', '拼字標點對嗎'] },
      check: {
        q: '寫完一段英文之後，最應該先檢查什麼？',
        options: [
          '每個句子是否完整、時態是否一致',
          '有沒有使用難的單字',
          '字數夠不夠多',
          '有沒有用到成語'
        ],
        answer: 0,
        why: [
          null,
          '難字用錯反而扣分。',
          '正確性比長度更重要。',
          '基本正確性應該優先。'
        ]
      }
    },
    {
      title: '⑥ 從模仿開始',
      body: '好的寫作是「讀出來的」：\n' +
            '① 找一段喜歡的短文 ② 分析它的結構\n' +
            '③ 用同樣的結構寫自己的內容 ④ 請人幫忙看。\n' +
            '⚠ 一開始不用追求原創的句型，\n' +
            '把學過的句型用對、用熟，比亂用難句更好。',
      viz: { type: 'energyflow', steps: ['讀範文', '分析結構', '模仿寫作', '修改精進'] },
      check: {
        q: '初學英文寫作時，比較有效的做法是什麼？',
        options: [
          '模仿範文的結構，把學過的句型用熟',
          '盡量使用沒學過的難句型',
          '把中文直接逐字翻譯',
          '寫得越長越好'
        ],
        answer: 0,
        why: [
          null,
          '沒把握的句型容易用錯。',
          '逐字翻譯會產生不自然的句子。',
          '長度不代表品質。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第1單元 字母 A–I'] = {
  intro: '英文的第一步：認識 26 個字母。今天先學前面九個。',
  cards: [
    {
      title: '① 字母的大小寫',
      body: '每個字母都有大寫和小寫兩種樣子：A a、B b、C c…\n' +
            '⚠ 大寫用在句子的第一個字、人名與地名；\n' +
            '其他時候多半用小寫。',
      viz: { type: 'classify', groups: [
        { label: '大寫', items: ['A', 'B', 'C', 'D', 'E'] },
        { label: '小寫', items: ['a', 'b', 'c', 'd', 'e'] }] },
      check: {
        q: '英文的每個字母有幾種寫法？',
        options: [
          '兩種：大寫與小寫',
          '只有一種',
          '三種',
          '每個字母不一樣'
        ],
        answer: 0,
        why: [
          null,
          '每個字母都有大小寫兩種形式。',
          '英文字母只有大寫與小寫。',
          '所有字母都有兩種寫法。'
        ]
      }
    },
    {
      title: '② A、B、C',
      body: 'A a：apple（蘋果）　B b：ball（球）　C c：cat（貓）\n' +
            '⚠ 每個字母都有「名字」和「聲音」。\n' +
            '字母 A 的名字唸作 ei，但在 apple 裡發的是另一個音。',
      viz: { type: 'phonics', words: [
        { w: 'apple', parts: ['a', 'pple'], hit: 0, s: 'A 的音', mean: '蘋果' },
        { w: 'ball', parts: ['b', 'all'], hit: 0, s: 'B 的音', mean: '球' },
        { w: 'cat', parts: ['c', 'at'], hit: 0, s: 'C 的音', mean: '貓' }] },
      tip: '按單字按鈕，看每個字母的音。',
      check: {
        q: 'ball 這個字是用哪一個字母開頭的？',
        options: ['B', 'A', 'C', 'D'],
        answer: 0,
        why: [
          null,
          'A 開頭的字例如 apple。',
          'C 開頭的字例如 cat。',
          'D 開頭的字例如 dog。'
        ]
      }
    },
    {
      title: '③ D、E、F',
      body: 'D d：dog（狗）　E e：egg（蛋）　F f：fish（魚）\n' +
            '⚠ 寫字母時要注意方向：\n' +
            'b 和 d 很像，可以用「b 的肚子在右邊」來記。',
      viz: { type: 'phonics', words: [
        { w: 'dog', parts: ['d', 'og'], hit: 0, s: 'D 的音', mean: '狗' },
        { w: 'egg', parts: ['e', 'gg'], hit: 0, s: 'E 的音', mean: '蛋' },
        { w: 'fish', parts: ['f', 'ish'], hit: 0, s: 'F 的音', mean: '魚' }] },
      check: {
        q: 'fish 這個字是用哪一個字母開頭的？',
        options: ['F', 'D', 'E', 'G'],
        answer: 0,
        why: [
          null,
          'D 開頭的字例如 dog。',
          'E 開頭的字例如 egg。',
          'G 開頭的字例如 girl。'
        ]
      }
    },
    {
      title: '④ G、H、I',
      body: 'G g：girl（女孩）　H h：hat（帽子）　I i：ice（冰）\n' +
            '⚠ 字母 I 的大寫是一直線加上下兩橫，\n' +
            '小寫是一直線加上一個點。',
      viz: { type: 'phonics', words: [
        { w: 'girl', parts: ['g', 'irl'], hit: 0, s: 'G 的音', mean: '女孩' },
        { w: 'hat', parts: ['h', 'at'], hit: 0, s: 'H 的音', mean: '帽子' },
        { w: 'ice', parts: ['i', 'ce'], hit: 0, s: 'I 的音', mean: '冰' }] },
      check: {
        q: 'hat 這個字是用哪一個字母開頭的？',
        options: ['H', 'G', 'I', 'A'],
        answer: 0,
        why: [
          null,
          'G 開頭的字例如 girl。',
          'I 開頭的字例如 ice。',
          'A 開頭的字例如 apple。'
        ]
      }
    },
    {
      title: '⑤ 字母的順序',
      body: 'A B C D E F G H I…\n' +
            '⚠ 記住順序很有用：查字典、看名單、排隊都用得到。\n' +
            '可以用字母歌來幫助記憶。',
      viz: { type: 'classify', groups: [
        { label: '前三個', items: ['A', 'B', 'C'] },
        { label: '中間三個', items: ['D', 'E', 'F'] },
        { label: '後三個', items: ['G', 'H', 'I'] }] },
      check: {
        q: '字母 C 的後面是哪一個字母？',
        options: ['D', 'B', 'E', 'A'],
        answer: 0,
        why: [
          null,
          'B 在 C 的前面。',
          'E 在 D 的後面。',
          'A 是第一個字母。'
        ]
      }
    },
    {
      title: '⑥ 練習寫字母',
      body: '寫字母時注意：\n' +
            '① 從上往下寫 ② 注意大小寫的高度不同\n' +
            '③ b、d、p、q 容易搞混，要多練習。\n' +
            '⚠ 寫得工整比寫得快重要。',
      viz: { type: 'classify', groups: [
        { label: '容易混淆', items: ['b 與 d', 'p 與 q', 'm 與 n'] },
        { label: '注意高度', items: ['b、d、f、h、k 較高', 'a、c、e、o 較矮'] }] },
      check: {
        q: '哪兩個小寫字母最容易被搞混？',
        options: [
          'b 和 d',
          'a 和 o',
          'x 和 y',
          'i 和 j'
        ],
        answer: 0,
        why: [
          null,
          '這兩個字母的形狀差別較明顯。',
          '這兩個字母的形狀不同。',
          '兩者雖相似，但 b 與 d 更常被搞混。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第2單元 字母 J–R'] = {
  intro: '接著學中間九個字母，很快就能認完全部了。',
  cards: [
    {
      title: '① J、K、L',
      body: 'J j：jump（跳）　K k：kite（風箏）　L l：lion（獅子）\n' +
            '⚠ 小寫的 j 和 i 一樣有一個點，但下面多了一個勾。',
      viz: { type: 'phonics', words: [
        { w: 'jump', parts: ['j', 'ump'], hit: 0, s: 'J 的音', mean: '跳' },
        { w: 'kite', parts: ['k', 'ite'], hit: 0, s: 'K 的音', mean: '風箏' },
        { w: 'lion', parts: ['l', 'ion'], hit: 0, s: 'L 的音', mean: '獅子' }] },
      tip: '按單字按鈕，看每個字母的音。',
      check: {
        q: 'lion 這個字是用哪一個字母開頭的？',
        options: ['L', 'J', 'K', 'M'],
        answer: 0,
        why: [
          null,
          'J 開頭的字例如 jump。',
          'K 開頭的字例如 kite。',
          'M 開頭的字例如 monkey。'
        ]
      }
    },
    {
      title: '② M、N、O',
      body: 'M m：monkey（猴子）　N n：nose（鼻子）　O o：orange（柳橙）\n' +
            '⚠ m 有兩個駝峰、n 只有一個，可以這樣區分。',
      viz: { type: 'phonics', words: [
        { w: 'monkey', parts: ['m', 'onkey'], hit: 0, s: 'M 的音', mean: '猴子' },
        { w: 'nose', parts: ['n', 'ose'], hit: 0, s: 'N 的音', mean: '鼻子' },
        { w: 'orange', parts: ['o', 'range'], hit: 0, s: 'O 的音', mean: '柳橙' }] },
      check: {
        q: 'm 和 n 這兩個小寫字母的差別是什麼？',
        options: [
          'm 有兩個駝峰、n 只有一個',
          'm 比較矮',
          'n 有一個點',
          '兩者完全一樣'
        ],
        answer: 0,
        why: [
          null,
          '兩者的高度相同。',
          '有點的是 i 和 j。',
          '兩者的形狀不同。'
        ]
      }
    },
    {
      title: '③ P、Q、R',
      body: 'P p：pig（豬）　Q q：queen（皇后）　R r：rabbit（兔子）\n' +
            '⚠ q 後面幾乎都跟著 u：queen、quick、question。',
      viz: { type: 'phonics', words: [
        { w: 'pig', parts: ['p', 'ig'], hit: 0, s: 'P 的音', mean: '豬' },
        { w: 'queen', parts: ['qu', 'een'], hit: 0, s: 'Q 的音', mean: '皇后' },
        { w: 'rabbit', parts: ['r', 'abbit'], hit: 0, s: 'R 的音', mean: '兔子' }] },
      check: {
        q: '字母 q 後面通常會跟著哪一個字母？',
        options: ['u', 'a', 'e', 'o'],
        answer: 0,
        why: [
          null,
          'q 後面幾乎都是 u。',
          '這個組合並不常見。',
          'qo 這個組合在英文中很罕見。'
        ]
      }
    },
    {
      title: '④ 字母的順序（J 到 R）',
      body: 'J K L M N O P Q R\n' +
            '⚠ 可以三個三個一組來記：JKL、MNO、PQR。\n' +
            '這樣比一次記九個容易。',
      viz: { type: 'classify', groups: [
        { label: '第一組', items: ['J', 'K', 'L'] },
        { label: '第二組', items: ['M', 'N', 'O'] },
        { label: '第三組', items: ['P', 'Q', 'R'] }] },
      check: {
        q: '字母 O 的後面是哪一個字母？',
        options: ['P', 'N', 'M', 'Q'],
        answer: 0,
        why: [
          null,
          'N 在 O 的前面。',
          'M 在 N 的前面，離 O 更遠。',
          'Q 在 P 的後面。'
        ]
      }
    },
    {
      title: '⑤ 母音字母',
      body: '在 A 到 R 中，母音字母有：A、E、I、O。\n' +
            '（還有一個 U 在後面的單元）\n' +
            '⚠ 母音很重要：每個英文單字都至少有一個母音。',
      viz: { type: 'classify', groups: [
        { label: '母音字母', items: ['A', 'E', 'I', 'O'] },
        { label: '子音字母', items: ['B', 'C', 'D', 'F', 'G', 'H'] }] },
      check: {
        q: '下列哪一個是母音字母？',
        options: ['O', 'P', 'R', 'M'],
        answer: 0,
        why: [
          null,
          'P 是子音字母。',
          'R 是子音字母。',
          'M 也是子音字母。'
        ]
      }
    },
    {
      title: '⑥ 用字母拼名字',
      body: '練習：把自己的英文名字一個字母一個字母唸出來。\n' +
            '例：Amy → A-M-Y。\n' +
            '⚠ 這叫「拼字」（spelling），\n' +
            '別人聽不清楚時就可以用這個方法。',
      viz: { type: 'phonics', words: [
        { w: 'Amy', parts: ['A', 'm', 'y'], hit: 0, s: '拼出名字', mean: '人名' },
        { w: 'Ben', parts: ['B', 'e', 'n'], hit: 0, s: '拼出名字', mean: '人名' }] },
      check: {
        q: '別人聽不清楚你的名字時，可以怎麼做？',
        options: [
          '一個字母一個字母拼出來',
          '講得更大聲就好',
          '不要再說了',
          '換一個名字'
        ],
        answer: 0,
        why: [
          null,
          '音量大不一定能解決聽不清楚的問題。',
          '放棄溝通無法解決問題。',
          '名字不需要因此更換。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第3單元 字母 S–Z'] = {
  intro: '最後八個字母學完，你就認識全部 26 個了。',
  cards: [
    {
      title: '① S、T、U',
      body: 'S s：sun（太陽）　T t：tiger（老虎）　U u：umbrella（雨傘）\n' +
            '⚠ U 是最後一個母音字母（A、E、I、O、U）。',
      viz: { type: 'phonics', words: [
        { w: 'sun', parts: ['s', 'un'], hit: 0, s: 'S 的音', mean: '太陽' },
        { w: 'tiger', parts: ['t', 'iger'], hit: 0, s: 'T 的音', mean: '老虎' },
        { w: 'umbrella', parts: ['u', 'mbrella'], hit: 0, s: 'U 的音', mean: '雨傘' }] },
      tip: '按單字按鈕，看每個字母的音。',
      check: {
        q: '五個母音字母是哪些？',
        options: [
          'A、E、I、O、U',
          'A、B、C、D、E',
          'S、T、U、V、W',
          'X、Y、Z'
        ],
        answer: 0,
        why: [
          null,
          'B、C、D 是子音字母。',
          'S、T、V、W 都是子音。',
          '這三個都是子音字母。'
        ]
      }
    },
    {
      title: '② V、W、X',
      body: 'V v：van（廂型車）　W w：water（水）　X x：box（盒子）\n' +
            '⚠ x 很少出現在字首，通常在字中或字尾：box、six、fox。',
      viz: { type: 'phonics', words: [
        { w: 'van', parts: ['v', 'an'], hit: 0, s: 'V 的音', mean: '廂型車' },
        { w: 'water', parts: ['w', 'ater'], hit: 0, s: 'W 的音', mean: '水' },
        { w: 'box', parts: ['bo', 'x'], hit: 1, s: 'X 的音', mean: '盒子' }] },
      check: {
        q: '字母 x 通常出現在單字的哪個位置？',
        options: [
          '字中或字尾，例如 box、six',
          '只出現在字首',
          '只出現在人名中',
          '從來不出現'
        ],
        answer: 0,
        why: [
          null,
          '以 x 開頭的英文字非常少。',
          '一般單字中也常見。',
          'x 在許多常用字中都會出現。'
        ]
      }
    },
    {
      title: '③ Y、Z',
      body: 'Y y：yellow（黃色）　Z z：zoo（動物園）\n' +
            '⚠ y 有時候當母音用：my、happy、baby。\n' +
            'z 是最後一個字母。',
      viz: { type: 'phonics', words: [
        { w: 'yellow', parts: ['y', 'ellow'], hit: 0, s: 'Y 的音', mean: '黃色' },
        { w: 'zoo', parts: ['z', 'oo'], hit: 0, s: 'Z 的音', mean: '動物園' },
        { w: 'happy', parts: ['happ', 'y'], hit: 1, s: 'y 當母音', mean: '快樂的' }] },
      check: {
        q: '字母 y 有什麼特別之處？',
        options: [
          '有時候當子音，有時候當母音',
          '永遠是子音',
          '永遠是母音',
          '不發音'
        ],
        answer: 0,
        why: [
          null,
          '在 happy 中它當母音。',
          '在 yellow 中它當子音。',
          'y 是會發音的。'
        ]
      }
    },
    {
      title: '④ 26 個字母全部',
      body: 'A B C D E F G H I J K L M\n' +
            'N O P Q R S T U V W X Y Z\n' +
            '⚠ 一共 26 個：5 個母音（A、E、I、O、U）與 21 個子音。',
      viz: { type: 'classify', groups: [
        { label: '母音（5 個）', items: ['A', 'E', 'I', 'O', 'U'] },
        { label: '子音（21 個）', items: ['B', 'C', 'D', 'F', 'G', '其餘'] }] },
      check: {
        q: '英文一共有幾個字母？',
        options: ['26 個', '24 個', '30 個', '20 個'],
        answer: 0,
        why: [
          null,
          '英文字母比 24 個多。',
          '英文字母沒有 30 個。',
          '英文字母比 20 個多。'
        ]
      }
    },
    {
      title: '⑤ 字母歌與順序',
      body: '唱字母歌是最快記住順序的方法。\n' +
            '⚠ 知道順序的好處：查字典、找名字、排隊都會用到。\n' +
            '練習：從任何一個字母開始往下唸。',
      viz: { type: 'classify', groups: [
        { label: '開頭', items: ['A', 'B', 'C', 'D'] },
        { label: '中間', items: ['L', 'M', 'N', 'O'] },
        { label: '結尾', items: ['W', 'X', 'Y', 'Z'] }] },
      check: {
        q: '英文字母的最後一個是什麼？',
        options: ['Z', 'Y', 'X', 'W'],
        answer: 0,
        why: [
          null,
          'Y 是倒數第二個。',
          'X 是倒數第三個。',
          'W 排在 X 與 Y 的前面。'
        ]
      }
    },
    {
      title: '⑥ 字母與生活',
      body: '生活中處處有字母：\n' +
            '書本、招牌、電腦鍵盤、車牌、遊戲。\n' +
            '⚠ 每天找五個身邊有字母的東西唸出來，\n' +
            '學英文就從這裡開始。',
      viz: { type: 'classify', groups: [
        { label: '生活中的字母', items: ['招牌', '書本', '鍵盤', '車牌'] }] },
      check: {
        q: '學會字母之後，最重要的下一步是什麼？',
        options: [
          '在生活中多注意並唸出看到的字母與單字',
          '把 26 個字母抄一百遍',
          '停止學習',
          '只在課本上看'
        ],
        answer: 0,
        why: [
          null,
          '抄寫有幫助，但要能實際使用。',
          '字母只是英文的第一步。',
          '生活中的接觸能加深印象。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第4單元 打招呼與自我介紹'] = {
  intro: '學會兩三句話，就能用英文和別人打招呼了。',
  cards: [
    {
      title: '① Hello 與 Hi',
      body: 'Hello.（你好）　Hi.（嗨，比較口語）\n' +
            '⚠ 兩個都可以用，Hi 比較輕鬆，Hello 稍微正式一點。\n' +
            '打招呼時可以配上微笑和揮手。',
      viz: { type: 'sentence', label: '打招呼', items: [
        { t: 'Hello', r: '你好' }],
        note: '最基本也最好用的招呼語。',
        alt: [
          { label: '較口語', items: [{ t: 'Hi', r: '嗨' }], note: '朋友之間常用。' }] },
      tip: '按按鈕比較兩種說法。',
      check: {
        q: 'Hi 和 Hello 的差別是什麼？',
        options: [
          'Hi 比較口語輕鬆，Hello 稍微正式',
          '兩者意思完全不同',
          'Hi 只能對長輩說',
          'Hello 是道別用語'
        ],
        answer: 0,
        why: [
          null,
          '兩者的意思相同。',
          'Hi 比較適合對朋友使用。',
          'Hello 是打招呼而不是道別。'
        ]
      }
    },
    {
      title: '② Good morning 系列',
      body: 'Good morning.（早安，中午前）\n' +
            'Good afternoon.（午安，中午到傍晚）\n' +
            'Good evening.（晚安，晚上見面時）\n' +
            '⚠ Good night. 是睡前或道別時才說的。',
      viz: { type: 'classify', groups: [
        { label: '見面時', items: ['Good morning', 'Good afternoon', 'Good evening'] },
        { label: '道別時', items: ['Good night', 'Goodbye', 'See you'] }] },
      check: {
        q: '早上見到老師時應該說什麼？',
        options: [
          'Good morning.',
          'Good night.',
          'Goodbye.',
          'Good afternoon.'
        ],
        answer: 0,
        why: [
          null,
          'Good night 是睡前或道別用語。',
          'Goodbye 是道別。',
          'Good afternoon 是下午用的。'
        ]
      }
    },
    {
      title: '③ 說出自己的名字',
      body: 'I am Amy.／My name is Amy.（我是 Amy。）\n' +
            '⚠ 兩種說法都可以，第一種比較口語。\n' +
            '名字的第一個字母要大寫。',
      viz: { type: 'sentence', label: '自我介紹', items: [
        { t: 'I', r: '我' }, { t: 'am', r: 'be 動詞' }, { t: 'Amy', r: '名字' }],
        note: '最簡單的自我介紹句型。' },
      check: {
        q: '英文名字的第一個字母要怎麼寫？',
        options: [
          '要大寫',
          '要小寫',
          '大小寫都可以',
          '不用寫'
        ],
        answer: 0,
        why: [
          null,
          '名字屬於專有名詞，首字母要大寫。',
          '英文對名字的書寫有明確規定。',
          '名字當然要寫出來。'
        ]
      }
    },
    {
      title: '④ 問對方的名字',
      body: 'What is your name?（你叫什麼名字？）\n' +
            '→ My name is Ben.／I am Ben.\n' +
            '⚠ 問完之後可以說：Nice to meet you.（很高興認識你。）',
      viz: { type: 'sentence', label: '問名字', items: [
        { t: 'What', r: '什麼' }, { t: 'is', r: 'be 動詞' },
        { t: 'your name', r: '你的名字' }],
        note: '疑問詞 What 放在句首。' },
      check: {
        q: '認識新朋友時，介紹完自己可以說什麼？',
        options: [
          'Nice to meet you.',
          'Goodbye.',
          'Good night.',
          'I am sorry.'
        ],
        answer: 0,
        why: [
          null,
          '這是道別時說的話。',
          '這是睡前的問候。',
          '這是道歉時說的話。'
        ]
      }
    },
    {
      title: '⑤ 說再見',
      body: 'Goodbye.／Bye.（再見）\n' +
            'See you.（下次見）　See you tomorrow.（明天見）\n' +
            '⚠ Bye 最口語，朋友之間最常用。',
      viz: { type: 'classify', groups: [
        { label: '道別', items: ['Goodbye', 'Bye', 'See you'] },
        { label: '加上時間', items: ['See you tomorrow', 'See you later'] }] },
      check: {
        q: '要跟同學說「明天見」，可以怎麼說？',
        options: [
          'See you tomorrow.',
          'Good morning.',
          'What is your name?',
          'Nice to meet you.'
        ],
        answer: 0,
        why: [
          null,
          '這是早上見面時的問候。',
          '這是在詢問對方的名字。',
          '這是初次見面時說的。'
        ]
      }
    },
    {
      title: '⑥ 完整的招呼對話',
      body: 'A: Hi! I am Amy. What is your name?\n' +
            'B: Hello! My name is Ben. Nice to meet you.\n' +
            'A: Nice to meet you, too. See you!\n' +
            '⚠ too 是「也」，放在句尾。',
      viz: { type: 'energyflow', steps: ['打招呼', '說名字', '問對方', '道別'] },
      check: {
        q: '別人對你說 Nice to meet you. 時，你可以怎麼回答？',
        options: [
          'Nice to meet you, too.',
          'Goodbye.',
          'What?',
          'No, thanks.'
        ],
        answer: 0,
        why: [
          null,
          '這時候道別太早了。',
          '這個回答不禮貌。',
          '這個回答與情境不符。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第5單元 顏色'] = {
  intro: '顏色是最容易看見、也最容易記住的英文單字。',
  cards: [
    {
      title: '① 三個基本顏色',
      body: 'red（紅色）　blue（藍色）　yellow（黃色）\n' +
            '⚠ 這三個是最常用的顏色，先記熟這三個。\n' +
            '練習：指著身邊的東西說出顏色。',
      viz: { type: 'classify', groups: [
        { label: '基本三色', items: ['red', 'blue', 'yellow'] },
        { label: '例子', items: ['red apple', 'blue sky', 'yellow banana'] }] },
      check: {
        q: '「紅色」的英文是什麼？',
        options: ['red', 'blue', 'yellow', 'green'],
        answer: 0,
        why: [
          null,
          'blue 是藍色。',
          'yellow 是黃色。',
          'green 是綠色。'
        ]
      }
    },
    {
      title: '② 更多顏色',
      body: 'green（綠色）　black（黑色）　white（白色）　orange（橘色）\n' +
            'purple（紫色）　pink（粉紅色）　brown（棕色）\n' +
            '⚠ orange 同時是「橘色」和「柳橙」。',
      viz: { type: 'classify', groups: [
        { label: '深色', items: ['black', 'brown', 'purple'] },
        { label: '淺色', items: ['white', 'pink', 'yellow'] }] },
      check: {
        q: 'orange 這個字有哪兩種意思？',
        options: [
          '橘色與柳橙',
          '紅色與蘋果',
          '綠色與草地',
          '只有一種意思'
        ],
        answer: 0,
        why: [
          null,
          '紅色是 red，蘋果是 apple。',
          '綠色是 green，草地是 grass。',
          '這個字同時是顏色與水果。'
        ]
      }
    },
    {
      title: '③ 問顏色',
      body: 'What color is it?（它是什麼顏色？）\n' +
            '→ It is red.（它是紅色的。）\n' +
            '⚠ 回答時用 It is…，不需要重複整個問題。',
      viz: { type: 'sentence', label: '問顏色', items: [
        { t: 'What color', r: '什麼顏色' }, { t: 'is', r: 'be 動詞' },
        { t: 'it', r: '它' }],
        note: '問顏色的固定句型。',
        alt: [
          { label: '回答', items: [{ t: 'It', r: '它' }, { t: 'is', r: 'be 動詞' },
            { t: 'red', r: '顏色' }], note: '回答時用 It is 加上顏色。' }] },
      tip: '按按鈕看問句與回答。',
      check: {
        q: '別人問 What color is it? 時，可以怎麼回答？',
        options: [
          'It is blue.',
          'Yes, it is.',
          'I am blue.',
          'What color?'
        ],
        answer: 0,
        why: [
          null,
          '這個問題不能用 Yes 回答。',
          '顏色是形容物品而不是自己。',
          '重複問題沒有回答到。'
        ]
      }
    },
    {
      title: '④ 用顏色形容東西',
      body: 'a red apple（一顆紅蘋果）　a blue bag（一個藍色書包）\n' +
            '⚠ 顏色放在名詞「前面」，這和中文順序相同。',
      viz: { type: 'sentence', label: '顏色在前', items: [
        { t: 'a', r: '一個' }, { t: 'red', r: '顏色' }, { t: 'apple', r: '名詞' }],
        note: '顏色放在名詞前面。' },
      check: {
        q: '「一個黃色的球」的正確說法是什麼？',
        options: [
          'a yellow ball',
          'a ball yellow',
          'yellow a ball',
          'ball a yellow'
        ],
        answer: 0,
        why: [
          null,
          '顏色要放在名詞前面。',
          'a 要放在最前面。',
          '這個順序完全顛倒了。'
        ]
      }
    },
    {
      title: '⑤ 說出喜歡的顏色',
      body: 'I like red.（我喜歡紅色。）\n' +
            'My favorite color is blue.（我最喜歡的顏色是藍色。）\n' +
            '⚠ favorite 是「最喜歡的」，後面接名詞。',
      viz: { type: 'sentence', label: '最喜歡的顏色', items: [
        { t: 'My favorite color', r: '主詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'blue', r: '顏色' }],
        note: '說出自己最喜歡的顏色。' },
      check: {
        q: '「我喜歡綠色」的正確說法是什麼？',
        options: [
          'I like green.',
          'I am like green.',
          'I like am green.',
          'Green I like.'
        ],
        answer: 0,
        why: [
          null,
          '不能同時使用 be 動詞與一般動詞。',
          '語序不正確，動詞要放在主詞後面。',
          '這個語序不自然。'
        ]
      }
    },
    {
      title: '⑥ 生活中的顏色',
      body: '紅綠燈：red（停）、yellow（等一下）、green（走）。\n' +
            '天空是 blue、草是 green、雪是 white。\n' +
            '⚠ 練習方法：每天說出三樣東西的顏色，\n' +
            '很快就會記熟。',
      viz: { type: 'classify', groups: [
        { label: '自然中的顏色', items: ['blue sky', 'green grass', 'white snow'] },
        { label: '紅綠燈', items: ['red = stop', 'green = go'] }] },
      check: {
        q: '紅綠燈的綠燈代表什麼？',
        options: [
          'go（可以走）',
          'stop（停止）',
          'wait（等待）',
          'run（跑步）'
        ],
        answer: 0,
        why: [
          null,
          '停止是紅燈代表的意思。',
          '黃燈表示要注意準備停下。',
          '過馬路時不應該奔跑。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第6單元 數字 1–10'] = {
  intro: '從一數到十，是每個學英文的人第一個學會的實用技能。',
  cards: [
    {
      title: '① 一到五',
      body: 'one（1）　two（2）　three（3）　four（4）　five（5）\n' +
            '⚠ two 的 w 不發音；three 開頭是 th 的音。',
      viz: { type: 'phonics', words: [
        { w: 'one', parts: ['o', 'ne'], hit: 0, s: '數字 1', mean: '一' },
        { w: 'two', parts: ['t', 'wo'], hit: 1, s: 'w 不發音', mean: '二' },
        { w: 'three', parts: ['th', 'ree'], hit: 0, s: 'th 的音', mean: '三' }] },
      tip: '按單字按鈕看發音重點。',
      check: {
        q: 'two 這個字有什麼發音特點？',
        options: [
          'w 不發音',
          't 不發音',
          'o 不發音',
          '每個字母都發音'
        ],
        answer: 0,
        why: [
          null,
          '字首的 t 是要發音的。',
          '字中的 o 也是要發音的。',
          'w 在這個字裡不發音。'
        ]
      }
    },
    {
      title: '② 六到十',
      body: 'six（6）　seven（7）　eight（8）　nine（9）　ten（10）\n' +
            '⚠ eight 的 gh 不發音，唸起來像 ate。',
      viz: { type: 'phonics', words: [
        { w: 'six', parts: ['si', 'x'], hit: 1, s: 'x 的音', mean: '六' },
        { w: 'eight', parts: ['ei', 'ght'], hit: 1, s: 'gh 不發音', mean: '八' },
        { w: 'ten', parts: ['t', 'en'], hit: 0, s: '數字 10', mean: '十' }] },
      check: {
        q: 'eight 這個字的 gh 要怎麼唸？',
        options: [
          '不發音',
          '唸 g 的音',
          '唸 h 的音',
          '唸 k 的音'
        ],
        answer: 0,
        why: [
          null,
          '這個組合在此不發 g 的音。',
          'h 在這裡也不發音。',
          '這個字沒有 k 的音。'
        ]
      }
    },
    {
      title: '③ 數東西',
      body: 'one apple（一顆蘋果）　two apples（兩顆蘋果）\n' +
            '⚠ 超過一個時，名詞要加 s：\n' +
            'one book → two books、one cat → three cats。',
      viz: { type: 'sentence', label: '單數', items: [
        { t: 'one', r: '數字 1' }, { t: 'apple', r: '單數名詞' }],
        note: '一個東西時名詞不加 s。',
        alt: [
          { label: '複數', items: [{ t: 'two', r: '數字 2' }, { t: 'apples', r: '複數名詞' }],
            note: '兩個以上要在名詞後面加 s。' }] },
      check: {
        q: '「三隻貓」的正確說法是什麼？',
        options: [
          'three cats',
          'three cat',
          'three a cat',
          'cat three'
        ],
        answer: 0,
        why: [
          null,
          '超過一個時名詞要加 s。',
          '有數字時不需要冠詞 a。',
          '數字要放在名詞前面。'
        ]
      }
    },
    {
      title: '④ 問數量',
      body: 'How many?（有多少個？）\n' +
            'How many apples?→ Three.／Three apples.\n' +
            '⚠ How many 後面接複數名詞。',
      viz: { type: 'sentence', label: '問數量', items: [
        { t: 'How many', r: '多少個' }, { t: 'apples', r: '複數名詞' }],
        note: 'How many 後面要接複數名詞。' },
      check: {
        q: '要問「有幾本書？」應該怎麼說？',
        options: [
          'How many books?',
          'How many book?',
          'How much books?',
          'How many a book?'
        ],
        answer: 0,
        why: [
          null,
          'How many 後面要接複數名詞。',
          '可數名詞要用 How many。',
          '有 How many 時不加冠詞。'
        ]
      }
    },
    {
      title: '⑤ 年齡',
      body: 'How old are you?（你幾歲？）→ I am seven.（我七歲。）\n' +
            '⚠ 英文說年齡用 be 動詞：I am seven（years old）。',
      viz: { type: 'sentence', label: '說年齡', items: [
        { t: 'I', r: '我' }, { t: 'am', r: 'be 動詞' }, { t: 'seven', r: '數字' }],
        note: '年齡用 be 動詞加數字。' },
      check: {
        q: '「我七歲」的正確說法是什麼？',
        options: [
          'I am seven.',
          'I have seven.',
          'I seven.',
          'My age seven.'
        ],
        answer: 0,
        why: [
          null,
          '年齡用 be 動詞而不是 have。',
          '句子缺少 be 動詞。',
          '這個句子不完整。'
        ]
      }
    },
    {
      title: '⑥ 數字的練習',
      body: '生活中的數字：電話號碼、樓層、班級、年齡、時間。\n' +
            '⚠ 練習方法：數樓梯、數同學、數手指，\n' +
            '一邊數一邊用英文說出來。',
      viz: { type: 'classify', groups: [
        { label: '生活中的數字', items: ['電話號碼', '樓層', '年齡', '時間'] }] },
      check: {
        q: '學數字最有效的練習方法是什麼？',
        options: [
          '在生活中一邊數東西一邊用英文說出來',
          '把數字抄一百遍',
          '只在考試前背',
          '只看不說'
        ],
        answer: 0,
        why: [
          null,
          '抄寫幫助拼字，但不一定會說。',
          '臨時抱佛腳記不牢。',
          '開口說才能真正學會。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第7單元 教室用品'] = {
  intro: '書包裡、桌子上的東西，都能用英文說出來。',
  cards: [
    {
      title: '① 文具',
      body: 'pen（筆）　pencil（鉛筆）　eraser（橡皮擦）　ruler（尺）\n' +
            'book（書）　notebook（筆記本）　bag（書包）\n' +
            '⚠ 練習：打開書包，把每樣東西的英文說出來。',
      viz: { type: 'classify', groups: [
        { label: '寫字用', items: ['pen', 'pencil', 'eraser'] },
        { label: '其他', items: ['ruler', 'book', 'bag'] }] },
      check: {
        q: '「鉛筆」的英文是什麼？',
        options: ['pencil', 'pen', 'eraser', 'ruler'],
        answer: 0,
        why: [
          null,
          'pen 是原子筆。',
          'eraser 是橡皮擦。',
          'ruler 是尺。'
        ]
      }
    },
    {
      title: '② 教室裡的東西',
      body: 'desk（書桌）　chair（椅子）　door（門）　window（窗戶）\n' +
            'blackboard（黑板）　clock（時鐘）\n' +
            '⚠ 這些東西每天都看得到，最容易記。',
      viz: { type: 'classify', groups: [
        { label: '家具', items: ['desk', 'chair'] },
        { label: '教室設備', items: ['door', 'window', 'blackboard', 'clock'] }] },
      check: {
        q: '「椅子」的英文是什麼？',
        options: ['chair', 'desk', 'door', 'window'],
        answer: 0,
        why: [
          null,
          'desk 是書桌。',
          'door 是門。',
          'window 是窗戶。'
        ]
      }
    },
    {
      title: '③ 這是什麼',
      body: 'What is this?（這是什麼？）→ It is a pen.（這是一支筆。）\n' +
            '⚠ 回答時單數名詞前面要加 a 或 an。',
      viz: { type: 'sentence', label: '問這是什麼', items: [
        { t: 'What', r: '什麼' }, { t: 'is', r: 'be 動詞' }, { t: 'this', r: '這個' }],
        note: '問東西是什麼的固定句型。',
        alt: [
          { label: '回答', items: [{ t: 'It is', r: '它是' }, { t: 'a pen', r: '冠詞＋名詞' }],
            note: '單數名詞前面要加 a。' }] },
      tip: '按按鈕看問句與回答。',
      check: {
        q: '「這是一本書」的正確說法是什麼？',
        options: [
          'It is a book.',
          'It is book.',
          'It a book.',
          'This book.'
        ],
        answer: 0,
        why: [
          null,
          '單數名詞前面要加 a。',
          '句子缺少 be 動詞。',
          '這個句子不完整。'
        ]
      }
    },
    {
      title: '④ a 與 an',
      body: '子音開頭用 a：a pen、a book、a desk。\n' +
            '母音開頭用 an：an eraser、an apple、an egg。\n' +
            '⚠ 母音字母是 a、e、i、o、u。',
      viz: { type: 'classify', groups: [
        { label: '用 a', items: ['a pen', 'a book', 'a chair'] },
        { label: '用 an', items: ['an eraser', 'an apple', 'an egg'] }] },
      check: {
        q: '「一個橡皮擦」的正確說法是什麼？',
        options: [
          'an eraser',
          'a eraser',
          'the eraser one',
          'eraser a'
        ],
        answer: 0,
        why: [
          null,
          'eraser 以母音開頭，要用 an。',
          '這個說法不自然。',
          '冠詞要放在名詞前面。'
        ]
      }
    },
    {
      title: '⑤ 這是誰的',
      body: 'This is my pen.（這是我的筆。）\n' +
            'Is this your book?（這是你的書嗎？）\n' +
            '⚠ my（我的）、your（你的）後面要接名詞。',
      viz: { type: 'sentence', label: '說是誰的', items: [
        { t: 'This is', r: '這是' }, { t: 'my', r: '我的' }, { t: 'pen', r: '名詞' }],
        note: '所有格後面要接名詞。' },
      check: {
        q: '「這是我的書包」的正確說法是什麼？',
        options: [
          'This is my bag.',
          'This is my.',
          'This my bag.',
          'This is I bag.'
        ],
        answer: 0,
        why: [
          null,
          'my 後面一定要接名詞。',
          '句子缺少 be 動詞。',
          '應該用所有格 my 而不是 I。'
        ]
      }
    },
    {
      title: '⑥ 借東西',
      body: 'Can I borrow your eraser?（可以借我橡皮擦嗎？）\n' +
            'Here you are.（給你。）　Thank you.（謝謝。）\n' +
            '⚠ 借東西要說 please，還東西時要說 thank you。',
      viz: { type: 'energyflow', steps: ['禮貌詢問', '對方遞給你', '道謝', '用完歸還'] },
      check: {
        q: '想跟同學借筆時，比較有禮貌的說法是什麼？',
        options: [
          'Can I borrow your pen, please?',
          'Give me your pen.',
          'Your pen!',
          'I want pen.'
        ],
        answer: 0,
        why: [
          null,
          '命令句聽起來不禮貌。',
          '只說名詞不算完整的請求。',
          '這個說法既不完整也不客氣。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第8單元 家人'] = {
  intro: '介紹自己的家人，是最常見的英文話題之一。',
  cards: [
    {
      title: '① 爸爸媽媽',
      body: 'father／dad（爸爸）　mother／mom（媽媽）\n' +
            '⚠ dad 和 mom 比較口語，father 和 mother 比較正式。\n' +
            '兩種都可以用。',
      viz: { type: 'compareexp',
             factor: '兩種說法',
             a: { label: '正式', note: 'father、mother' },
             b: { label: '口語', note: 'dad、mom' },
             same: ['指的是同一個人'] },
      check: {
        q: '「媽媽」比較口語的說法是什麼？',
        options: ['mom', 'mother', 'sister', 'aunt'],
        answer: 0,
        why: [
          null,
          'mother 是比較正式的說法。',
          'sister 是姊妹。',
          'aunt 是阿姨或姑姑。'
        ]
      }
    },
    {
      title: '② 兄弟姊妹',
      body: 'brother（兄弟）　sister（姊妹）\n' +
            '⚠ 英文的 brother 不分哥哥或弟弟；\n' +
            '需要說明時才加 big／older（哥哥）或 little／younger（弟弟）。',
      viz: { type: 'classify', groups: [
        { label: '兄弟', items: ['brother', 'older brother', 'younger brother'] },
        { label: '姊妹', items: ['sister', 'older sister', 'younger sister'] }] },
      check: {
        q: '英文的 brother 可以指誰？',
        options: [
          '哥哥或弟弟都可以',
          '只能指哥哥',
          '只能指弟弟',
          '指姊妹'
        ],
        answer: 0,
        why: [
          null,
          '它同時可以指弟弟。',
          '它同時可以指哥哥。',
          '姊妹是 sister。'
        ]
      }
    },
    {
      title: '③ 祖父母',
      body: 'grandfather／grandpa（爺爺、外公）\n' +
            'grandmother／grandma（奶奶、外婆）\n' +
            '⚠ 英文不分內外，爺爺和外公都是 grandfather。',
      viz: { type: 'classify', groups: [
        { label: '祖父', items: ['grandfather', 'grandpa'] },
        { label: '祖母', items: ['grandmother', 'grandma'] }] },
      check: {
        q: '英文的 grandmother 可以指誰？',
        options: [
          '奶奶或外婆都可以',
          '只能指奶奶',
          '只能指外婆',
          '指媽媽'
        ],
        answer: 0,
        why: [
          null,
          '英文不區分內外祖母。',
          '它同時也可以指奶奶。',
          '媽媽是 mother。'
        ]
      }
    },
    {
      title: '④ 介紹家人',
      body: 'This is my father.（這是我爸爸。）\n' +
            'This is my sister.（這是我姊姊。）\n' +
            '⚠ 介紹在場的人用 This is，就像中文說「這是我…」。',
      viz: { type: 'sentence', label: '介紹家人', items: [
        { t: 'This is', r: '這是' }, { t: 'my', r: '我的' }, { t: 'father', r: '家人' }],
        note: '介紹身邊的人用 This is。' },
      check: {
        q: '要介紹身邊的媽媽給朋友認識，可以怎麼說？',
        options: [
          'This is my mother.',
          'She is a mother.',
          'My mother is.',
          'This my mother.'
        ],
        answer: 0,
        why: [
          null,
          '這個說法沒有表達出是「我的」媽媽。',
          '這個句子不完整，缺少補語。',
          '句子缺少 be 動詞。'
        ]
      }
    },
    {
      title: '⑤ 他和她',
      body: '男生用 he（他）、女生用 she（她）。\n' +
            'He is my father.　She is my mother.\n' +
            '⚠ 東西或動物用 it。',
      viz: { type: 'classify', groups: [
        { label: 'he（男）', items: ['father', 'brother', 'grandpa'] },
        { label: 'she（女）', items: ['mother', 'sister', 'grandma'] },
        { label: 'it（物）', items: ['book', 'cat', 'bag'] }] },
      check: {
        q: '要說「她是我姊姊」，應該用哪一個代名詞？',
        options: ['she', 'he', 'it', 'they'],
        answer: 0,
        why: [
          null,
          'he 用於男性。',
          'it 用於物品或動物。',
          'they 用於多個人。'
        ]
      }
    },
    {
      title: '⑥ 我的家庭',
      body: 'I have a big family.（我有一個大家庭。）\n' +
            'I love my family.（我愛我的家人。）\n' +
            '⚠ family 是「家庭、家人」，\n' +
            '說「我家有四個人」是 There are four people in my family.',
      viz: { type: 'sentence', label: '家庭人數', items: [
        { t: 'There are', r: '有' }, { t: 'four people', r: '四個人' },
        { t: 'in my family', r: '在我家' }],
        note: '說明家庭人數的句型。' },
      check: {
        q: '「我愛我的家人」的正確說法是什麼？',
        options: [
          'I love my family.',
          'I am love my family.',
          'I love family my.',
          'My family I love.'
        ],
        answer: 0,
        why: [
          null,
          '不能同時使用 be 動詞與一般動詞。',
          '所有格要放在名詞前面。',
          '這個語序不自然。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一上|第9單元 身體部位'] = {
  intro: '從頭到腳，每個部位都有自己的英文名字。',
  cards: [
    {
      title: '① 頭部',
      body: 'head（頭）　hair（頭髮）　face（臉）　eye（眼睛）\n' +
            'ear（耳朵）　nose（鼻子）　mouth（嘴巴）\n' +
            '⚠ 眼睛和耳朵有兩個，通常用複數：eyes、ears。',
      viz: { type: 'classify', groups: [
        { label: '單數', items: ['head', 'face', 'nose', 'mouth'] },
        { label: '常用複數', items: ['eyes', 'ears'] }] },
      check: {
        q: '「鼻子」的英文是什麼？',
        options: ['nose', 'mouth', 'ear', 'eye'],
        answer: 0,
        why: [
          null,
          'mouth 是嘴巴。',
          'ear 是耳朵。',
          'eye 是眼睛。'
        ]
      }
    },
    {
      title: '② 手和腳',
      body: 'hand（手）　arm（手臂）　finger（手指）\n' +
            'leg（腿）　foot（腳）　toe（腳趾）\n' +
            '⚠ foot 的複數是 feet（不是 foots）。',
      viz: { type: 'classify', groups: [
        { label: '上肢', items: ['hand', 'arm', 'finger'] },
        { label: '下肢', items: ['leg', 'foot', 'toe'] }] },
      check: {
        q: 'foot 的複數形是什麼？',
        options: ['feet', 'foots', 'footes', 'foot'],
        answer: 0,
        why: [
          null,
          '這是不規則變化，不加 s。',
          '這個拼法不存在。',
          '複數形要用 feet。'
        ]
      }
    },
    {
      title: '③ 身體的動作',
      body: 'Touch your nose.（摸你的鼻子。）\n' +
            'Clap your hands.（拍手。）\n' +
            'Stamp your feet.（跺腳。）\n' +
            '⚠ 這些是祈使句，直接用動詞開頭。',
      viz: { type: 'sentence', label: '祈使句', items: [
        { t: 'Touch', r: '動詞' }, { t: 'your nose', r: '受詞' }],
        note: '祈使句直接用動詞開頭，主詞 you 省略。' },
      check: {
        q: 'Clap your hands. 是什麼意思？',
        options: [
          '拍手',
          '舉手',
          '洗手',
          '握手'
        ],
        answer: 0,
        why: [
          null,
          '舉手是 raise your hand。',
          '洗手是 wash your hands。',
          '握手是 shake hands。'
        ]
      }
    },
    {
      title: '④ 我有…',
      body: 'I have two eyes.（我有兩隻眼睛。）\n' +
            'I have ten fingers.（我有十根手指。）\n' +
            '⚠ 超過一個時名詞要加 s。',
      viz: { type: 'sentence', label: '說擁有', items: [
        { t: 'I have', r: '我有' }, { t: 'two eyes', r: '複數名詞' }],
        note: '數量超過一個時名詞要用複數。' },
      check: {
        q: '「我有兩隻手」的正確說法是什麼？',
        options: [
          'I have two hands.',
          'I have two hand.',
          'I has two hands.',
          'I am have two hands.'
        ],
        answer: 0,
        why: [
          null,
          '超過一個時名詞要加 s。',
          '主詞是 I 要用 have。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '⑤ 描述外表',
      body: 'I have big eyes.（我有大眼睛。）\n' +
            'She has long hair.（她有長頭髮。）\n' +
            '⚠ 形容詞放在名詞前面；\n' +
            '主詞是 he／she 時要用 has。',
      viz: { type: 'sentence', label: '描述外表', items: [
        { t: 'She has', r: '她有' }, { t: 'long', r: '形容詞' }, { t: 'hair', r: '名詞' }],
        note: '形容詞放在名詞前面。' },
      check: {
        q: '「她有長頭髮」的正確說法是什麼？',
        options: [
          'She has long hair.',
          'She have long hair.',
          'She has hair long.',
          'She is long hair.'
        ],
        answer: 0,
        why: [
          null,
          '主詞是 she 要用 has。',
          '形容詞要放在名詞前面。',
          '這裡要用 have 而不是 be 動詞。'
        ]
      }
    },
    {
      title: '⑥ 身體與健康',
      body: 'Wash your hands.（洗手。）\n' +
            'Brush your teeth.（刷牙。）\n' +
            '⚠ teeth 是 tooth（牙齒）的複數。\n' +
            '這些好習慣每天都要做。',
      viz: { type: 'classify', groups: [
        { label: '每天要做', items: ['wash your hands', 'brush your teeth', 'take a bath'] },
        { label: '不規則複數', items: ['tooth→teeth', 'foot→feet'] }] },
      check: {
        q: 'tooth 的複數形是什麼？',
        options: ['teeth', 'tooths', 'toothes', 'tooth'],
        answer: 0,
        why: [
          null,
          '這是不規則變化，不加 s。',
          '這個拼法不正確。',
          '複數形要用 teeth。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第1單元 子音的自然發音'] = {
  intro: '每個子音字母都有自己的聲音——把聲音記住，就能開始拼字。',
  cards: [
    {
      title: '① 什麼是子音',
      body: '26 個字母中，除了 a、e、i、o、u 之外的 21 個都是子音字母。\n' +
            '⚠ 子音的聲音要靠嘴唇、舌頭或牙齒擋住氣流才發得出來；\n' +
            '母音則是氣流順暢通過。',
      viz: { type: 'classify', groups: [
        { label: '母音字母', items: ['a', 'e', 'i', 'o', 'u'] },
        { label: '子音字母（部分）', items: ['b', 'c', 'd', 'f', 'g', 'h'] }] },
      check: {
        q: '子音與母音最主要的差別是什麼？',
        options: [
          '發子音時氣流會被擋住，發母音時氣流順暢通過',
          '子音比較大聲',
          '母音只出現在字尾',
          '子音不用發音'
        ],
        answer: 0,
        why: [
          null,
          '音量大小與子音母音無關。',
          '母音可以出現在單字的任何位置。',
          '子音是需要發音的。'
        ]
      }
    },
    {
      title: '② b、c、d、f',
      body: 'b：ball（球）　c：cat（貓）　d：dog（狗）　f：fish（魚）\n' +
            '⚠ 字母 c 在 a、o、u 前面發 k 的音（cat、cup），\n' +
            '在 e、i、y 前面發 s 的音（city、cent）。',
      viz: { type: 'phonics', words: [
        { w: 'ball', parts: ['b', 'all'], hit: 0, s: 'b 的音', mean: '球' },
        { w: 'cat', parts: ['c', 'at'], hit: 0, s: 'c 發 k 的音', mean: '貓' },
        { w: 'city', parts: ['c', 'ity'], hit: 0, s: 'c 發 s 的音', mean: '城市' }] },
      tip: '按單字按鈕比較同一個字母的不同發音。',
      check: {
        q: '字母 c 在 cup 這個字裡發什麼音？',
        options: [
          '發 k 的音',
          '發 s 的音',
          '不發音',
          '發 ch 的音'
        ],
        answer: 0,
        why: [
          null,
          'c 在 e、i、y 前面才發 s 的音。',
          '這個位置的 c 是要發音的。',
          'ch 是兩個字母的組合。'
        ]
      }
    },
    {
      title: '③ g、h、j、k',
      body: 'g：girl（女孩）　h：hat（帽子）　j：jump（跳）　k：kite（風箏）\n' +
            '⚠ 字母 g 也有兩種音：\n' +
            'go、girl 發硬的音；giant、gym 發像 j 的音。',
      viz: { type: 'phonics', words: [
        { w: 'girl', parts: ['g', 'irl'], hit: 0, s: 'g 的硬音', mean: '女孩' },
        { w: 'jump', parts: ['j', 'ump'], hit: 0, s: 'j 的音', mean: '跳' },
        { w: 'kite', parts: ['k', 'ite'], hit: 0, s: 'k 的音', mean: '風箏' }] },
      check: {
        q: '字母 g 在 go 這個字裡發什麼音？',
        options: [
          '發硬的 g 音',
          '發 j 的音',
          '不發音',
          '發 k 的音'
        ],
        answer: 0,
        why: [
          null,
          'g 在 e、i、y 前面才可能發 j 的音。',
          '這個位置的 g 要發音。',
          'g 與 k 是不同的音。'
        ]
      }
    },
    {
      title: '④ l、m、n、p',
      body: 'l：lion（獅子）　m：monkey（猴子）　n：nose（鼻子）　p：pig（豬）\n' +
            '⚠ m 和 n 都是鼻音（氣流從鼻子出來），\n' +
            '差別在嘴唇：m 要閉起嘴唇。',
      viz: { type: 'phonics', words: [
        { w: 'monkey', parts: ['m', 'onkey'], hit: 0, s: 'm 的音（閉唇）', mean: '猴子' },
        { w: 'nose', parts: ['n', 'ose'], hit: 0, s: 'n 的音（舌抵上顎）', mean: '鼻子' }] },
      check: {
        q: '發 m 這個音時，嘴巴要怎麼做？',
        options: [
          '閉起嘴唇，氣流從鼻子出來',
          '嘴巴張很大',
          '咬住舌頭',
          '不動嘴巴'
        ],
        answer: 0,
        why: [
          null,
          '張大嘴巴是發母音的動作。',
          '咬舌頭是發 th 的動作。',
          '發音一定需要口腔的動作。'
        ]
      }
    },
    {
      title: '⑤ r、s、t、v、w',
      body: 'r：rabbit（兔子）　s：sun（太陽）　t：tiger（老虎）\n' +
            'v：van（廂型車）　w：water（水）\n' +
            '⚠ v 和 w 常被搞混：\n' +
            'v 的上排牙齒要碰下嘴唇，w 則是嘴唇噘起來。',
      viz: { type: 'compareexp',
             factor: '兩個容易混淆的音',
             a: { label: 'v', note: '上排牙齒輕碰下嘴唇' },
             b: { label: 'w', note: '嘴唇噘成圓形' },
             same: ['都用到嘴唇'] },
      check: {
        q: '發 v 這個音時，要怎麼做？',
        options: [
          '上排牙齒輕碰下嘴唇',
          '嘴唇噘成圓形',
          '舌頭伸出來',
          '牙齒咬緊'
        ],
        answer: 0,
        why: [
          null,
          '噘嘴唇是發 w 的動作。',
          '舌頭伸出來是發 th 的動作。',
          '咬緊牙齒發不出這個音。'
        ]
      }
    },
    {
      title: '⑥ 用子音開始拼字',
      body: '把子音和母音組合起來就能拼字：\n' +
            'b＋a＋t → bat（球棒）；c＋a＋t → cat；m＋a＋p → map。\n' +
            '⚠ 拼讀的順序：先分開唸每個音，再慢慢連起來。',
      viz: { type: 'phonics', words: [
        { w: 'bat', parts: ['b', 'a', 't'], hit: 0, s: '子音開頭', mean: '球棒' },
        { w: 'map', parts: ['m', 'a', 'p'], hit: 0, s: '子音開頭', mean: '地圖' }] },
      check: {
        q: '看到 mat 這個字，可以怎麼唸出來？',
        options: [
          '先分別唸 m、a、t，再連起來',
          '直接猜一個發音',
          '一定要查字典',
          '請別人唸給你聽'
        ],
        answer: 0,
        why: [
          null,
          '亂猜無法建立正確的拼讀習慣。',
          '自然發音的目的就是自己能唸。',
          '學會拼讀就不用每次都問人。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第2單元 短母音 a、e'] = {
  intro: '母音是每個單字的核心——先從最常見的兩個短母音開始。',
  cards: [
    {
      title: '① 短母音 a',
      body: 'cat（貓）、bat（球棒）、map（地圖）、hat（帽子）、bag（袋子）\n' +
            '⚠ 出現在「子音＋母音＋子音」的字裡時，a 通常發短音。\n' +
            '嘴巴要張開，聲音短促。',
      viz: { type: 'phonics', words: [
        { w: 'cat', parts: ['c', 'a', 't'], hit: 1, s: 'a 的短音', mean: '貓' },
        { w: 'map', parts: ['m', 'a', 'p'], hit: 1, s: 'a 的短音', mean: '地圖' },
        { w: 'bag', parts: ['b', 'a', 'g'], hit: 1, s: 'a 的短音', mean: '袋子' }] },
      tip: '按單字按鈕，看每個字的目標音。',
      check: {
        q: '下列哪一個字含有短母音 a？',
        options: ['bag', 'cake', 'bike', 'home'],
        answer: 0,
        why: [
          null,
          'cake 的 a 因為字尾有 e 而發長音。',
          'bike 的母音是 i。',
          'home 的母音是 o。'
        ]
      }
    },
    {
      title: '② 短母音 e',
      body: 'bed（床）、pen（筆）、red（紅色）、ten（十）、net（網子）\n' +
            '⚠ 短音 e 的嘴型比 a 小一點，聲音也很短。',
      viz: { type: 'phonics', words: [
        { w: 'bed', parts: ['b', 'e', 'd'], hit: 1, s: 'e 的短音', mean: '床' },
        { w: 'pen', parts: ['p', 'e', 'n'], hit: 1, s: 'e 的短音', mean: '筆' },
        { w: 'ten', parts: ['t', 'e', 'n'], hit: 1, s: 'e 的短音', mean: '十' }] },
      check: {
        q: '下列哪一組單字的母音都是短音 e？',
        options: [
          'bed、pen、ten',
          'bed、cake、pig',
          'pen、home、bag',
          'ten、bike、cup'
        ],
        answer: 0,
        why: [
          null,
          '這一組包含了長音與其他母音。',
          '這三個字的母音各不相同。',
          '這三個字的母音也都不一樣。'
        ]
      }
    },
    {
      title: '③ 比較 a 和 e',
      body: 'bat／bet、pan／pen、bad／bed、mat／met。\n' +
            '⚠ 只差一個母音，意思就完全不同——\n' +
            '所以聽力練習時要特別注意母音。',
      viz: { type: 'phonics', words: [
        { w: 'bat', parts: ['b', 'a', 't'], hit: 1, s: 'a 的短音', mean: '球棒' },
        { w: 'bet', parts: ['b', 'e', 't'], hit: 1, s: 'e 的短音', mean: '打賭' },
        { w: 'pan', parts: ['p', 'a', 'n'], hit: 1, s: 'a 的短音', mean: '平底鍋' },
        { w: 'pen', parts: ['p', 'e', 'n'], hit: 1, s: 'e 的短音', mean: '筆' }] },
      check: {
        q: 'pan 和 pen 的差別在哪裡？',
        options: [
          '中間的母音不同，意思也完全不同',
          '第一個字母不同',
          '最後一個字母不同',
          '兩個字意思相同'
        ],
        answer: 0,
        why: [
          null,
          '兩個字都以 p 開頭。',
          '兩個字都以 n 結尾。',
          '一個是平底鍋，一個是筆。'
        ]
      }
    },
    {
      title: '④ 拼讀練習',
      body: '三步驟：① 分開唸每個音 ② 慢慢連起來 ③ 加快變成完整的字。\n' +
            'c-a-t → cat；b-e-d → bed；m-a-p → map。\n' +
            '⚠ 練習時可以用手指著字母，一個一個唸。',
      viz: { type: 'phonics', words: [
        { w: 'red', parts: ['r', 'e', 'd'], hit: 1, s: 'e 的短音', mean: '紅色' },
        { w: 'hat', parts: ['h', 'a', 't'], hit: 1, s: 'a 的短音', mean: '帽子' }] },
      check: {
        q: '拼讀單字的第一步應該做什麼？',
        options: [
          '把每個字母的音分開唸出來',
          '直接唸整個字',
          '先看中文意思',
          '先抄寫十遍'
        ],
        answer: 0,
        why: [
          null,
          '直接唸整個字可能會唸錯。',
          '拼讀不需要先知道中文意思。',
          '抄寫幫助記憶但不是拼讀的第一步。'
        ]
      }
    },
    {
      title: '⑤ 常見的短母音單字',
      body: 'a：cat、hat、bag、map、dad、man\n' +
            'e：bed、pen、ten、red、net、hen\n' +
            '⚠ 這些字都很短、很常用，是最好的練習材料。',
      viz: { type: 'classify', groups: [
        { label: '短音 a', items: ['cat', 'hat', 'bag', 'map', 'dad'] },
        { label: '短音 e', items: ['bed', 'pen', 'ten', 'red', 'net'] }] },
      check: {
        q: '下列哪一個字的母音和 bed 相同？',
        options: ['pen', 'cat', 'map', 'bag'],
        answer: 0,
        why: [
          null,
          'cat 的母音是短音 a。',
          'map 的母音也是短音 a。',
          'bag 的母音同樣是短音 a。'
        ]
      }
    },
    {
      title: '⑥ 從拼讀到拼寫',
      body: '反過來也可以：聽到聲音就寫出字母。\n' +
            '聽到 b-e-d 三個音 → 寫出 bed。\n' +
            '⚠ 這樣背單字會輕鬆很多，\n' +
            '因為你是「用規則」而不是「用死記」。',
      viz: { type: 'energyflow', steps: ['聽到聲音', '分辨每個音', '寫出對應字母', '完成單字'] },
      check: {
        q: '學會自然發音之後，對拼寫有什麼幫助？',
        options: [
          '聽到聲音就能推出字母，不用完全死背',
          '完全不用練習拼寫',
          '所有單字都能拼對',
          '只對唸讀有幫助'
        ],
        answer: 0,
        why: [
          null,
          '仍然需要練習才會熟練。',
          '有些單字不符合規則，仍要另外記。',
          '發音規則對拼寫同樣有幫助。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第3單元 短母音 i、o、u'] = {
  intro: '把五個短母音學完，你就能拼讀出好幾百個單字。',
  cards: [
    {
      title: '① 短母音 i',
      body: 'pig（豬）、big（大的）、sit（坐）、six（六）、pin（別針）\n' +
            '⚠ 短音 i 的聲音比較尖、比較短，嘴巴微微張開。',
      viz: { type: 'phonics', words: [
        { w: 'pig', parts: ['p', 'i', 'g'], hit: 1, s: 'i 的短音', mean: '豬' },
        { w: 'six', parts: ['s', 'i', 'x'], hit: 1, s: 'i 的短音', mean: '六' },
        { w: 'sit', parts: ['s', 'i', 't'], hit: 1, s: 'i 的短音', mean: '坐' }] },
      tip: '按單字按鈕，看每個字的目標音。',
      check: {
        q: '下列哪一個字含有短母音 i？',
        options: ['big', 'bike', 'cake', 'bed'],
        answer: 0,
        why: [
          null,
          'bike 的 i 因為字尾有 e 而發長音。',
          'cake 的母音是長音 a。',
          'bed 的母音是短音 e。'
        ]
      }
    },
    {
      title: '② 短母音 o',
      body: 'dog（狗）、hot（熱的）、box（盒子）、top（頂端）、mom（媽媽）\n' +
            '⚠ 嘴巴要張開成圓形，聲音短促。',
      viz: { type: 'phonics', words: [
        { w: 'dog', parts: ['d', 'o', 'g'], hit: 1, s: 'o 的短音', mean: '狗' },
        { w: 'box', parts: ['b', 'o', 'x'], hit: 1, s: 'o 的短音', mean: '盒子' },
        { w: 'hot', parts: ['h', 'o', 't'], hit: 1, s: 'o 的短音', mean: '熱的' }] },
      check: {
        q: '發短母音 o 的時候，嘴巴應該怎麼做？',
        options: [
          '張開成圓形，聲音短促',
          '嘴唇緊閉',
          '牙齒咬住舌頭',
          '完全不動'
        ],
        answer: 0,
        why: [
          null,
          '閉起嘴唇是發 m 的動作。',
          '咬住舌頭是發 th 的動作。',
          '發母音一定要有口腔的動作。'
        ]
      }
    },
    {
      title: '③ 短母音 u',
      body: 'cup（杯子）、bus（公車）、sun（太陽）、run（跑）、cut（切）\n' +
            '⚠ 短音 u 的嘴型比較放鬆，聲音接近中文的「啊」但更短。',
      viz: { type: 'phonics', words: [
        { w: 'cup', parts: ['c', 'u', 'p'], hit: 1, s: 'u 的短音', mean: '杯子' },
        { w: 'sun', parts: ['s', 'u', 'n'], hit: 1, s: 'u 的短音', mean: '太陽' },
        { w: 'bus', parts: ['b', 'u', 's'], hit: 1, s: 'u 的短音', mean: '公車' }] },
      check: {
        q: '下列哪一個字含有短母音 u？',
        options: ['bus', 'cute', 'use', 'tube'],
        answer: 0,
        why: [
          null,
          'cute 的 u 因為字尾有 e 而發長音。',
          'use 的 u 也是長音。',
          'tube 的 u 同樣發長音。'
        ]
      }
    },
    {
      title: '④ 五個短母音一起看',
      body: 'a（cat）、e（bed）、i（pig）、o（dog）、u（cup）。\n' +
            '⚠ 共同的規則：在「子音＋母音＋子音」的結構中，\n' +
            '母音通常發短音。',
      viz: { type: 'phonics', words: [
        { w: 'cat', parts: ['c', 'a', 't'], hit: 1, s: 'a 的短音', mean: '貓' },
        { w: 'bed', parts: ['b', 'e', 'd'], hit: 1, s: 'e 的短音', mean: '床' },
        { w: 'pig', parts: ['p', 'i', 'g'], hit: 1, s: 'i 的短音', mean: '豬' },
        { w: 'dog', parts: ['d', 'o', 'g'], hit: 1, s: 'o 的短音', mean: '狗' },
        { w: 'cup', parts: ['c', 'u', 'p'], hit: 1, s: 'u 的短音', mean: '杯子' }] },
      check: {
        q: '短母音通常出現在什麼樣的字裡？',
        options: [
          '子音＋母音＋子音的結構',
          '字尾有不發音 e 的字',
          '很長的單字',
          '只有母音的字'
        ],
        answer: 0,
        why: [
          null,
          '字尾有 e 時母音多發長音。',
          '短母音的字通常都很短。',
          '英文單字幾乎都有子音。'
        ]
      }
    },
    {
      title: '⑤ 換母音換意思',
      body: 'big／bag／bug；hot／hat／hit；cut／cat／cot。\n' +
            '⚠ 這種只差一個音的字組，是練習聽力最好的材料。\n' +
            '母音聽錯了，整個字的意思就錯了。',
      viz: { type: 'phonics', words: [
        { w: 'big', parts: ['b', 'i', 'g'], hit: 1, s: 'i 的短音', mean: '大的' },
        { w: 'bag', parts: ['b', 'a', 'g'], hit: 1, s: 'a 的短音', mean: '袋子' },
        { w: 'bug', parts: ['b', 'u', 'g'], hit: 1, s: 'u 的短音', mean: '蟲子' }] },
      check: {
        q: 'big、bag、bug 這三個字的差別在哪裡？',
        options: [
          '只有中間的母音不同，意思卻完全不一樣',
          '開頭的字母不同',
          '結尾的字母不同',
          '三個字意思相同'
        ],
        answer: 0,
        why: [
          null,
          '三個字都以 b 開頭。',
          '三個字都以 g 結尾。',
          '三個字分別是大的、袋子與蟲子。'
        ]
      }
    },
    {
      title: '⑥ 拼讀更多單字',
      body: '練習拼讀：sun、run、cut、hop、job、fun、win、lip。\n' +
            '⚠ 每天練五個，一個月就是一百五十個字。\n' +
            '拼讀能力是自學單字的基礎。',
      viz: { type: 'phonics', words: [
        { w: 'run', parts: ['r', 'u', 'n'], hit: 1, s: 'u 的短音', mean: '跑' },
        { w: 'win', parts: ['w', 'i', 'n'], hit: 1, s: 'i 的短音', mean: '贏' },
        { w: 'job', parts: ['j', 'o', 'b'], hit: 1, s: 'o 的短音', mean: '工作' }] },
      check: {
        q: '每天練習拼讀幾個單字，比較容易持續？',
        options: [
          '每天五個，長期累積',
          '一天背一百個',
          '考試前一次背完',
          '完全不用練習'
        ],
        answer: 0,
        why: [
          null,
          '一次太多容易忘記也容易放棄。',
          '臨時抱佛腳的效果有限。',
          '拼讀能力需要練習才會熟練。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第4單元 動物'] = {
  intro: '動物的英文最好記——因為你早就認識牠們了。',
  cards: [
    {
      title: '① 寵物',
      body: 'dog（狗）　cat（貓）　bird（鳥）　fish（魚）　rabbit（兔子）\n' +
            '⚠ fish 的複數通常還是 fish（不加 s）。',
      viz: { type: 'classify', groups: [
        { label: '常見寵物', items: ['dog', 'cat', 'bird', 'fish', 'rabbit'] }] },
      check: {
        q: '「兔子」的英文是什麼？',
        options: ['rabbit', 'dog', 'bird', 'fish'],
        answer: 0,
        why: [
          null,
          'dog 指的是狗，不是兔子。',
          'bird 是鳥。',
          'fish 是魚。'
        ]
      }
    },
    {
      title: '② 農場動物',
      body: 'cow（牛）　pig（豬）　horse（馬）　duck（鴨）　chicken（雞）　sheep（羊）\n' +
            '⚠ sheep 的複數還是 sheep（單複數同形）。',
      viz: { type: 'classify', groups: [
        { label: '農場動物', items: ['cow', 'pig', 'horse', 'duck', 'sheep'] },
        { label: '單複數同形', items: ['sheep', 'fish', 'deer'] }] },
      check: {
        q: 'sheep 的複數形是什麼？',
        options: ['sheep', 'sheeps', 'sheepes', 'sheepies'],
        answer: 0,
        why: [
          null,
          '這個字的單複數同形，不加 s。',
          '這個拼法不存在。',
          '這個拼法也不正確。'
        ]
      }
    },
    {
      title: '③ 野生動物',
      body: 'lion（獅子）　tiger（老虎）　elephant（大象）　monkey（猴子）\n' +
            'bear（熊）　giraffe（長頸鹿）\n' +
            '⚠ 這些動物在動物園（zoo）看得到。',
      viz: { type: 'classify', groups: [
        { label: '大型', items: ['lion', 'tiger', 'elephant', 'bear'] },
        { label: '特別的', items: ['giraffe', 'monkey'] }] },
      check: {
        q: '「大象」的英文是什麼？',
        options: ['elephant', 'lion', 'tiger', 'bear'],
        answer: 0,
        why: [
          null,
          'lion 是獅子。',
          'tiger 是老虎。',
          'bear 是熊。'
        ]
      }
    },
    {
      title: '④ 動物會做什麼',
      body: 'Birds can fly.（鳥會飛。）　Fish can swim.（魚會游泳。）\n' +
            'Rabbits can jump.（兔子會跳。）\n' +
            '⚠ can 後面接原形動詞。',
      viz: { type: 'sentence', label: '說能力', items: [
        { t: 'Birds', r: '主詞' }, { t: 'can', r: '會' }, { t: 'fly', r: '原形動詞' }],
        note: 'can 後面永遠接原形動詞。' },
      check: {
        q: '「魚會游泳」的正確說法是什麼？',
        options: [
          'Fish can swim.',
          'Fish can swims.',
          'Fish can swimming.',
          'Fish is can swim.'
        ],
        answer: 0,
        why: [
          null,
          'can 後面的動詞不加 s。',
          'can 後面要用原形動詞。',
          '不能同時使用 be 動詞與 can。'
        ]
      }
    },
    {
      title: '⑤ 我喜歡的動物',
      body: 'I like dogs.（我喜歡狗。）\n' +
            'My favorite animal is the cat.（我最喜歡的動物是貓。）\n' +
            '⚠ 說喜歡某一類動物時，通常用複數（dogs、cats）。',
      viz: { type: 'sentence', label: '說喜好', items: [
        { t: 'I like', r: '我喜歡' }, { t: 'dogs', r: '複數名詞' }],
        note: '喜歡某一類動物時用複數。' },
      check: {
        q: '「我喜歡貓（這種動物）」的正確說法是什麼？',
        options: [
          'I like cats.',
          'I like a cat.',
          'I like cat.',
          'I am like cats.'
        ],
        answer: 0,
        why: [
          null,
          '加 a 表示特定的某一隻貓。',
          '可數名詞通常不單獨用單數形。',
          '不能同時使用 be 動詞與一般動詞。'
        ]
      }
    },
    {
      title: '⑥ 動物的聲音與特徵',
      body: 'big（大的）　small（小的）　fast（快的）　cute（可愛的）\n' +
            'The elephant is big.（大象很大。）\n' +
            '⚠ 形容詞放在 be 動詞後面，或名詞前面。',
      viz: { type: 'sentence', label: '描述動物', items: [
        { t: 'The elephant', r: '主詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'big', r: '形容詞' }],
        note: '形容詞放在 be 動詞後面。' },
      check: {
        q: '「兔子很可愛」的正確說法是什麼？',
        options: [
          'The rabbit is cute.',
          'The rabbit cute.',
          'The rabbit is cutely.',
          'Cute the rabbit is.'
        ],
        answer: 0,
        why: [
          null,
          '句子缺少 be 動詞。',
          '這裡要用形容詞而不是副詞。',
          '這個語序不自然。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第5單元 食物與飲料'] = {
  intro: '吃的喝的最貼近生活，學起來馬上就用得到。',
  cards: [
    {
      title: '① 常見食物',
      body: 'rice（飯）　bread（麵包）　egg（蛋）　noodles（麵）\n' +
            'meat（肉）　fish（魚）　soup（湯）\n' +
            '⚠ noodles 通常用複數；rice、bread、soup 不加 s。',
      viz: { type: 'classify', groups: [
        { label: '主食', items: ['rice', 'bread', 'noodles'] },
        { label: '蛋白質', items: ['egg', 'meat', 'fish'] }] },
      check: {
        q: '「麵包」的英文是什麼？',
        options: ['bread', 'rice', 'meat', 'soup'],
        answer: 0,
        why: [
          null,
          'rice 指的是米飯。',
          'meat 指的是肉類。',
          'soup 指的是湯。'
        ]
      }
    },
    {
      title: '② 水果',
      body: 'apple（蘋果）　banana（香蕉）　orange（柳橙）　grape（葡萄）\n' +
            'watermelon（西瓜）　strawberry（草莓）\n' +
            '⚠ 水果大多可數，複數要加 s：apples、bananas。',
      viz: { type: 'classify', groups: [
        { label: '常見水果', items: ['apple', 'banana', 'orange', 'grape'] },
        { label: '較長的字', items: ['watermelon', 'strawberry'] }] },
      check: {
        q: '「香蕉」的英文是什麼？',
        options: ['banana', 'apple', 'grape', 'orange'],
        answer: 0,
        why: [
          null,
          'apple 指的是蘋果。',
          'grape 指的是葡萄。',
          'orange 指的是柳橙。'
        ]
      }
    },
    {
      title: '③ 飲料',
      body: 'water（水）　milk（牛奶）　juice（果汁）　tea（茶）\n' +
            '⚠ 飲料大多是不可數名詞，要說「一杯」時用 a glass of。',
      viz: { type: 'classify', groups: [
        { label: '飲料', items: ['water', 'milk', 'juice', 'tea'] },
        { label: '計量方式', items: ['a glass of', 'a cup of', 'a bottle of'] }] },
      check: {
        q: '「一杯牛奶」的正確說法是什麼？',
        options: [
          'a glass of milk',
          'a milk',
          'one milks',
          'a milk glass'
        ],
        answer: 0,
        why: [
          null,
          '不可數名詞前面不能直接加 a。',
          '不可數名詞沒有複數形。',
          '這個說法的語序不自然。'
        ]
      }
    },
    {
      title: '④ 我喜歡吃什麼',
      body: 'I like apples.（我喜歡蘋果。）\n' +
            'I do not like fish.（我不喜歡魚。）\n' +
            '⚠ 說喜歡某一類食物時，可數名詞通常用複數。',
      viz: { type: 'sentence', label: '說喜好', items: [
        { t: 'I like', r: '我喜歡' }, { t: 'apples', r: '複數名詞' }],
        note: '喜歡某一類食物時用複數。' },
      check: {
        q: '「我不喜歡魚」的正確說法是什麼？',
        options: [
          'I do not like fish.',
          'I not like fish.',
          'I am not like fish.',
          'I do not likes fish.'
        ],
        answer: 0,
        why: [
          null,
          '否定句需要助動詞 do。',
          '不能同時使用 be 動詞與一般動詞。',
          '用了 do not 之後動詞要用原形。'
        ]
      }
    },
    {
      title: '⑤ 我餓了、我渴了',
      body: 'I am hungry.（我餓了。）　I am thirsty.（我渴了。）\n' +
            'I want some water.（我想要一些水。）\n' +
            '⚠ 說感受要用 be 動詞：I am hungry（不是 I have hungry）。',
      viz: { type: 'sentence', label: '說感受', items: [
        { t: 'I', r: '我' }, { t: 'am', r: 'be 動詞' }, { t: 'hungry', r: '形容詞' }],
        note: '感受要用 be 動詞加形容詞。' },
      check: {
        q: '「我餓了」的正確說法是什麼？',
        options: [
          'I am hungry.',
          'I have hungry.',
          'I hungry.',
          'I am hunger.'
        ],
        answer: 0,
        why: [
          null,
          '感受要用 be 動詞而不是 have。',
          '句子缺少 be 動詞。',
          'hunger 是名詞，形容詞要用 hungry。'
        ]
      }
    },
    {
      title: '⑥ 用餐的禮貌用語',
      body: 'Here you are.（給你。）　Thank you.（謝謝。）\n' +
            'It is delicious!（很好吃！）\n' +
            'No, thank you.（不用了，謝謝。）\n' +
            '⚠ 拒絕時加上 thank you 會比較禮貌。',
      viz: { type: 'classify', groups: [
        { label: '接受', items: ['Yes, please.', 'Thank you.'] },
        { label: '婉拒', items: ['No, thank you.', 'I am full.'] }] },
      check: {
        q: '別人問你要不要再吃一點，你想婉拒可以怎麼說？',
        options: [
          'No, thank you.',
          'No!',
          'I do not want.',
          'Stop it.'
        ],
        answer: 0,
        why: [
          null,
          '單獨說 No 顯得生硬。',
          '這個說法不完整也不禮貌。',
          '這個說法過於強硬。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第6單元 玩具與物品'] = {
  intro: '玩具是小朋友最熟悉的東西，用英文說出來特別有成就感。',
  cards: [
    {
      title: '① 常見玩具',
      body: 'ball（球）　doll（洋娃娃）　robot（機器人）　car（玩具車）\n' +
            'kite（風箏）　blocks（積木）　puzzle（拼圖）\n' +
            '⚠ blocks 通常用複數，因為積木不會只有一塊。',
      viz: { type: 'classify', groups: [
        { label: '玩具', items: ['ball', 'doll', 'robot', 'kite'] },
        { label: '常用複數', items: ['blocks', 'crayons'] }] },
      check: {
        q: '「風箏」的英文是什麼？',
        options: ['kite', 'ball', 'doll', 'robot'],
        answer: 0,
        why: [
          null,
          'ball 指的是球。',
          'doll 指的是洋娃娃。',
          'robot 指的是機器人。'
        ]
      }
    },
    {
      title: '② 這是什麼',
      body: 'What is this?（這是什麼？）→ It is a ball.（這是一顆球。）\n' +
            'What is that?（那是什麼？）→ It is a kite.\n' +
            '⚠ this 指近的、that 指遠的。',
      viz: { type: 'compareexp',
             factor: '遠近的差別',
             a: { label: 'this', note: '指靠近自己的東西' },
             b: { label: 'that', note: '指離自己較遠的東西' },
             same: ['都用來指某樣東西'] },
      check: {
        q: '要指遠處的一樣東西，應該用哪一個字？',
        options: ['that', 'this', 'these', 'here'],
        answer: 0,
        why: [
          null,
          'this 指的是靠近的東西。',
          'these 是複數形，指近處的多個東西。',
          'here 是「這裡」，不是指物品。'
        ]
      }
    },
    {
      title: '③ 我有…',
      body: 'I have a ball.（我有一顆球。）\n' +
            'I have two dolls.（我有兩個洋娃娃。）\n' +
            '⚠ 超過一個時名詞要加 s。',
      viz: { type: 'sentence', label: '說擁有', items: [
        { t: 'I have', r: '我有' }, { t: 'two dolls', r: '複數名詞' }],
        note: '數量超過一個時名詞要用複數。' },
      check: {
        q: '「我有三顆球」的正確說法是什麼？',
        options: [
          'I have three balls.',
          'I have three ball.',
          'I has three balls.',
          'I have a three balls.'
        ],
        answer: 0,
        why: [
          null,
          '超過一個時名詞要加 s。',
          '主詞是 I 要用 have。',
          '有數字時不需要冠詞 a。'
        ]
      }
    },
    {
      title: '④ 這是誰的',
      body: 'Whose ball is this?（這是誰的球？）\n' +
            '→ It is mine.（是我的。）／It is Amy’s.（是 Amy 的。）\n' +
            '⚠ 人名後面加 ’s 表示「某人的」。',
      viz: { type: 'sentence', label: '說是誰的', items: [
        { t: 'It is', r: '這是' }, { t: 'Amy’s', r: 'Amy 的' }],
        note: '人名加撇號 s 表示所有。' },
      check: {
        q: '「這是 Ben 的書」的正確說法是什麼？',
        options: [
          'This is Ben’s book.',
          'This is Ben book.',
          'This is book Ben.',
          'This is Ben is book.'
        ],
        answer: 0,
        why: [
          null,
          '人名後面要加撇號 s。',
          '語序不正確，所有者要放前面。',
          '這個句子的結構不正確。'
        ]
      }
    },
    {
      title: '⑤ 分享與借用',
      body: 'Can I play with your robot?（我可以玩你的機器人嗎？）\n' +
            'Sure!（好啊！）　Let’s play together.（我們一起玩。）\n' +
            '⚠ 借別人的東西前一定要先問。',
      viz: { type: 'sentence', label: '請求', items: [
        { t: 'Can I play', r: '請求' }, { t: 'with', r: '介系詞' },
        { t: 'your robot', r: '對方的東西' }],
        note: 'play with 是「玩某樣東西」。' },
      check: {
        q: '想玩同學的玩具時，應該先做什麼？',
        options: [
          '先禮貌地詢問對方是否可以',
          '直接拿來玩',
          '等對方不注意時拿',
          '搶過來玩'
        ],
        answer: 0,
        why: [
          null,
          '未經同意拿別人的東西是不對的。',
          '趁人不注意拿東西同樣不恰當。',
          '搶奪會傷害別人也破壞友誼。'
        ]
      }
    },
    {
      title: '⑥ 描述玩具',
      body: 'It is a big red ball.（這是一顆大的紅球。）\n' +
            'My robot is new.（我的機器人是新的。）\n' +
            '⚠ 形容詞的順序：大小在顏色前面（big red）。',
      viz: { type: 'sentence', label: '形容詞順序', items: [
        { t: 'a', r: '冠詞' }, { t: 'big', r: '大小' }, { t: 'red', r: '顏色' },
        { t: 'ball', r: '名詞' }],
        note: '大小通常放在顏色前面。' },
      check: {
        q: '「一輛小的藍色車」的正確順序是什麼？',
        options: [
          'a small blue car',
          'a blue small car',
          'a car small blue',
          'small a blue car'
        ],
        answer: 0,
        why: [
          null,
          '大小通常放在顏色前面。',
          '形容詞要放在名詞前面。',
          '冠詞要放在最前面。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第7單元 數字 11–20'] = {
  intro: '學會二十以內的數字，就能說年齡、日期和大部分的日常數量。',
  cards: [
    {
      title: '① 十一和十二',
      body: 'eleven（11）　twelve（12）\n' +
            '⚠ 這兩個字很特別，不跟後面的規則走，要單獨記。',
      viz: { type: 'phonics', words: [
        { w: 'eleven', parts: ['e', 'leven'], hit: 0, s: '數字 11', mean: '十一' },
        { w: 'twelve', parts: ['twel', 've'], hit: 0, s: '數字 12', mean: '十二' }] },
      tip: '按單字按鈕看發音。',
      check: {
        q: '數字 11 和 12 的英文有什麼特別之處？',
        options: [
          '它們是獨立的字，不遵守後面的 teen 規則',
          '它們的拼法和 1、2 完全相同',
          '它們不能單獨使用',
          '它們沒有英文說法'
        ],
        answer: 0,
        why: [
          null,
          'eleven 與 one 的拼法完全不同。',
          '這兩個字可以單獨使用。',
          '它們都有標準的英文說法。'
        ]
      }
    },
    {
      title: '② 十三到十九',
      body: 'thirteen（13）、fourteen（14）、fifteen（15）、sixteen（16）、\n' +
            'seventeen（17）、eighteen（18）、nineteen（19）。\n' +
            '⚠ 規則：個位數加 teen。\n' +
            '要注意的拼法：thirteen、fifteen、eighteen。',
      viz: { type: 'classify', groups: [
        { label: '規則的', items: ['fourteen', 'sixteen', 'seventeen', 'nineteen'] },
        { label: '拼法要注意', items: ['thirteen', 'fifteen', 'eighteen'] }] },
      check: {
        q: '數字 15 的英文怎麼拼？',
        options: ['fifteen', 'fiveteen', 'fivteen', 'fifthteen'],
        answer: 0,
        why: [
          null,
          '不是直接把 five 加上 teen。',
          '這個拼法漏掉了字母。',
          'fifth 是序數，不用於基數。'
        ]
      }
    },
    {
      title: '③ 二十',
      body: 'twenty（20）\n' +
            '⚠ 注意拼法：不是 twoty。\n' +
            '20 之後的數字（21、22）之後的單元會學。',
      viz: { type: 'phonics', words: [
        { w: 'twenty', parts: ['twen', 'ty'], hit: 0, s: '數字 20', mean: '二十' }] },
      check: {
        q: '數字 20 的正確拼法是什麼？',
        options: ['twenty', 'twoty', 'twentie', 'twanty'],
        answer: 0,
        why: [
          null,
          '這個拼法並不存在。',
          '字尾應該是 ty 而不是 tie。',
          '第一個母音應該是 e。'
        ]
      }
    },
    {
      title: '④ 用數字數東西',
      body: 'How many books?→ Twelve books.\n' +
            '⚠ 超過一個時名詞要加 s：\n' +
            'eleven pens、fifteen apples、twenty students。',
      viz: { type: 'sentence', label: '數東西', items: [
        { t: 'twelve', r: '數字' }, { t: 'books', r: '複數名詞' }],
        note: '數字超過一時名詞要用複數。' },
      check: {
        q: '「十五顆蘋果」的正確說法是什麼？',
        options: [
          'fifteen apples',
          'fifteen apple',
          'fifteen a apple',
          'apple fifteen'
        ],
        answer: 0,
        why: [
          null,
          '超過一個時名詞要加 s。',
          '有數字時不需要冠詞。',
          '數字要放在名詞前面。'
        ]
      }
    },
    {
      title: '⑤ 說年齡',
      body: 'How old are you?→ I am eight.（我八歲。）\n' +
            'My sister is twelve.（我姊姊十二歲。）\n' +
            '⚠ 說年齡用 be 動詞，不用 have。',
      viz: { type: 'sentence', label: '說年齡', items: [
        { t: 'I', r: '我' }, { t: 'am', r: 'be 動詞' }, { t: 'eight', r: '數字' }],
        note: '英文說年齡用 be 動詞加數字。' },
      check: {
        q: '「我十一歲」的正確說法是什麼？',
        options: [
          'I am eleven.',
          'I have eleven.',
          'I am eleven year.',
          'I eleven.'
        ],
        answer: 0,
        why: [
          null,
          '年齡用 be 動詞而不是 have。',
          '要說 years old 或直接說數字。',
          '句子缺少 be 動詞。'
        ]
      }
    },
    {
      title: '⑥ 數字的應用',
      body: '電話號碼：一個數字一個數字唸。\n' +
            '班級：I am in Class Three.（我在三班。）\n' +
            '⚠ 練習：數教室裡的桌子、椅子、同學，\n' +
            '一邊數一邊用英文說出來。',
      viz: { type: 'classify', groups: [
        { label: '生活應用', items: ['電話號碼', '班級', '年齡', '數量'] }] },
      check: {
        q: '要記住數字的英文，最有效的方法是什麼？',
        options: [
          '在生活中一邊數東西一邊用英文說出來',
          '只在課本上看',
          '把數字抄很多遍',
          '等考試前再背'
        ],
        answer: 0,
        why: [
          null,
          '只看不說很難真正學會。',
          '抄寫幫助拼字，但不一定會說。',
          '臨時背誦的效果有限。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第8單元 天氣與季節'] = {
  intro: '今天天氣如何？這是每天都會用到的英文。',
  cards: [
    {
      title: '① 天氣的說法',
      body: 'sunny（晴天）　rainy（雨天）　cloudy（陰天）　windy（有風）\n' +
            'hot（熱）　cold（冷）\n' +
            '⚠ 說天氣時主詞用 it：It is sunny.',
      viz: { type: 'sentence', label: '說天氣', items: [
        { t: 'It', r: '主詞（固定用 it）' }, { t: 'is', r: 'be 動詞' },
        { t: 'sunny', r: '形容詞' }],
        note: '天氣的主詞固定用 it。' },
      check: {
        q: '說天氣時，主詞應該用什麼？',
        options: [
          'it',
          'the weather only',
          'this',
          'he'
        ],
        answer: 0,
        why: [
          null,
          '英文習慣直接用 it 當主詞。',
          'this 通常指具體的東西。',
          'he 用來指人。'
        ]
      }
    },
    {
      title: '② 問天氣',
      body: 'How is the weather?（天氣如何？）\n' +
            '→ It is rainy.／It is hot today.\n' +
            '⚠ 也可以說 What is the weather like?',
      viz: { type: 'sentence', label: '問天氣', items: [
        { t: 'How', r: '如何' }, { t: 'is', r: 'be 動詞' },
        { t: 'the weather', r: '天氣' }],
        note: '問天氣的常用句型。' },
      check: {
        q: '要問「今天天氣如何？」可以怎麼說？',
        options: [
          'How is the weather today?',
          'How the weather is today?',
          'What weather today?',
          'Weather how today?'
        ],
        answer: 0,
        why: [
          null,
          '疑問句要把 be 動詞放在主詞前面。',
          '這個句子不完整。',
          '這個語序不符合英文結構。'
        ]
      }
    },
    {
      title: '③ 四季',
      body: 'spring（春天）　summer（夏天）　fall／autumn（秋天）　winter（冬天）\n' +
            '⚠ 說「在夏天」用 in summer。',
      viz: { type: 'classify', groups: [
        { label: '四季', items: ['spring', 'summer', 'fall', 'winter'] },
        { label: '搭配的天氣', items: ['warm', 'hot', 'cool', 'cold'] }] },
      check: {
        q: '「在冬天」的正確說法是什麼？',
        options: ['in winter', 'on winter', 'at winter', 'to winter'],
        answer: 0,
        why: [
          null,
          'on 用於星期與日期。',
          'at 用於具體的時間點。',
          'to 表示方向或目標。'
        ]
      }
    },
    {
      title: '④ 天氣與活動',
      body: 'It is sunny. Let’s go to the park.（天氣晴，我們去公園吧。）\n' +
            'It is rainy. Take your umbrella.（下雨了，帶把傘。）\n' +
            '⚠ Let’s 是提議，後面接原形動詞。',
      viz: { type: 'sentence', label: '提議', items: [
        { t: 'Let’s', r: '我們來' }, { t: 'go', r: '原形動詞' },
        { t: 'to the park', r: '地點' }],
        note: 'Let’s 後面要接原形動詞。' },
      check: {
        q: '「我們去公園吧」的正確說法是什麼？',
        options: [
          'Let’s go to the park.',
          'Let’s to go to the park.',
          'Let’s going to the park.',
          'Let’s goes to the park.'
        ],
        answer: 0,
        why: [
          null,
          'Let’s 後面不加 to。',
          'Let’s 後面要用原形動詞。',
          '原形動詞不加 s。'
        ]
      }
    },
    {
      title: '⑤ 天氣與衣服',
      body: 'It is cold. Put on your coat.（天氣冷，穿上外套。）\n' +
            'It is hot. Wear a T-shirt.（天氣熱，穿 T 恤。）\n' +
            '⚠ put on 是「穿上」的動作，wear 是「穿著」的狀態。',
      viz: { type: 'classify', groups: [
        { label: '冷的時候', items: ['coat', 'sweater', 'scarf'] },
        { label: '熱的時候', items: ['T-shirt', 'shorts', 'hat'] }] },
      check: {
        q: '天氣很冷的時候應該穿什麼？',
        options: [
          'a coat',
          'shorts',
          'a swimsuit',
          'sandals'
        ],
        answer: 0,
        why: [
          null,
          '短褲適合天氣熱的時候。',
          '泳衣適合游泳的時候。',
          '涼鞋適合夏天穿。'
        ]
      }
    },
    {
      title: '⑥ 我喜歡的季節',
      body: 'I like summer.（我喜歡夏天。）\n' +
            'My favorite season is winter.（我最喜歡的季節是冬天。）\n' +
            'I can swim in summer.（夏天我可以游泳。）\n' +
            '⚠ season 是「季節」。',
      viz: { type: 'sentence', label: '說喜好', items: [
        { t: 'My favorite season', r: '主詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'winter', r: '季節' }],
        note: '說出自己最喜歡的季節。' },
      check: {
        q: '「我最喜歡的季節是春天」的正確說法是什麼？',
        options: [
          'My favorite season is spring.',
          'My favorite season are spring.',
          'I favorite spring season.',
          'My favorite is season spring.'
        ],
        answer: 0,
        why: [
          null,
          '主詞是單數，要用 is。',
          'favorite 是形容詞，不能當動詞用。',
          '這個語序不通順。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|一下|第9單元 課堂用語'] = {
  intro: '課堂上老師常說的話，聽懂了上課就輕鬆多了。',
  cards: [
    {
      title: '① 上課的指令',
      body: 'Stand up.（起立）　Sit down.（坐下）\n' +
            'Open your book.（打開課本）　Close your book.（闔上課本）\n' +
            '⚠ 這些都是祈使句，直接用動詞開頭。',
      viz: { type: 'sentence', label: '祈使句', items: [
        { t: 'Open', r: '動詞' }, { t: 'your book', r: '受詞' }],
        note: '祈使句以動詞開頭，主詞 you 省略。' },
      check: {
        q: 'Sit down. 是什麼意思？',
        options: [
          '坐下',
          '起立',
          '安靜',
          '出去'
        ],
        answer: 0,
        why: [
          null,
          '起立是 Stand up.',
          '安靜是 Be quiet.',
          '出去是 Go out.'
        ]
      }
    },
    {
      title: '② 聽和看',
      body: 'Listen carefully.（仔細聽）　Look at the blackboard.（看黑板）\n' +
            'Repeat after me.（跟我唸）\n' +
            '⚠ listen 後面要加 to 才能接受詞（listen to me），\n' +
            '但單獨使用時不用加。',
      viz: { type: 'classify', groups: [
        { label: '聽的指令', items: ['Listen', 'Repeat after me'] },
        { label: '看的指令', items: ['Look at the board', 'Watch carefully'] }] },
      check: {
        q: 'Repeat after me. 是什麼意思？',
        options: [
          '跟著我唸一遍',
          '安靜坐好',
          '把書打開',
          '交出作業'
        ],
        answer: 0,
        why: [
          null,
          '安靜坐好是另一個指令。',
          '打開書是 Open your book.',
          '交作業是 Hand in your homework.'
        ]
      }
    },
    {
      title: '③ 舉手發言',
      body: 'Raise your hand.（舉手）\n' +
            'May I ask a question?（我可以問問題嗎？）\n' +
            'I do not understand.（我不懂。）\n' +
            '⚠ 不懂就要說出來，這是學習的重要能力。',
      viz: { type: 'sentence', label: '請求發問', items: [
        { t: 'May I', r: '我可以嗎' }, { t: 'ask', r: '原形動詞' },
        { t: 'a question', r: '受詞' }],
        note: 'May I 用來有禮貌地請求。' },
      check: {
        q: '上課有地方聽不懂時，最好的做法是什麼？',
        options: [
          '舉手說 I do not understand，請老師再說一次',
          '假裝聽懂',
          '什麼都不說',
          '和旁邊的同學聊天'
        ],
        answer: 0,
        why: [
          null,
          '假裝聽懂會讓問題累積。',
          '不說出來老師不會知道。',
          '聊天會影響別人也影響自己。'
        ]
      }
    },
    {
      title: '④ 上廁所與喝水',
      body: 'May I go to the restroom?（我可以去洗手間嗎？）\n' +
            'May I drink some water?（我可以喝水嗎？）\n' +
            '⚠ 用 May I…? 比直接說 I want… 有禮貌。',
      viz: { type: 'compareexp',
             factor: '兩種說法',
             a: { label: 'May I…?', note: '有禮貌的請求許可' },
             b: { label: 'I want…', note: '直接表達需求，較不客氣' },
             same: ['都在表達自己的需要'] },
      check: {
        q: '上課想去洗手間，比較有禮貌的說法是什麼？',
        options: [
          'May I go to the restroom?',
          'I want to go.',
          'I go now.',
          'Restroom!'
        ],
        answer: 0,
        why: [
          null,
          '直接說想要略嫌不客氣。',
          '這個說法像在通知而不是請求。',
          '只說名詞無法表達完整的意思。'
        ]
      }
    },
    {
      title: '⑤ 稱讚與鼓勵',
      body: 'Good job!（做得好！）　Very good!（很好！）\n' +
            'Try again.（再試一次。）　Do not give up.（不要放棄。）\n' +
            '⚠ 這些話老師常說，同學之間也可以互相鼓勵。',
      viz: { type: 'classify', groups: [
        { label: '稱讚', items: ['Good job!', 'Very good!', 'Well done!'] },
        { label: '鼓勵', items: ['Try again.', 'Do not give up.', 'You can do it!'] }] },
      check: {
        q: '同學答錯了但很努力，可以對他說什麼？',
        options: [
          'Try again. You can do it!',
          'You are wrong.',
          'That is stupid.',
          'Be quiet.'
        ],
        answer: 0,
        why: [
          null,
          '這個說法只指出錯誤，沒有鼓勵。',
          '這是傷人的話，非常不恰當。',
          '這與答題的情境無關。'
        ]
      }
    },
    {
      title: '⑥ 下課與道別',
      body: 'Class is over.（下課了。）\n' +
            'See you tomorrow.（明天見。）　Have a nice day!（祝你有美好的一天！）\n' +
            '⚠ 離開教室前可以跟老師和同學打招呼。',
      viz: { type: 'energyflow', steps: ['上課問候', '認真聽講', '有問題就問', '下課道別'] },
      check: {
        q: '下課要離開教室時，可以對老師說什麼？',
        options: [
          'Thank you. See you tomorrow.',
          'Good morning.',
          'May I come in?',
          'I do not understand.'
        ],
        answer: 0,
        why: [
          null,
          '這是早上見面時的問候。',
          '這是要進教室時說的。',
          '這是上課中表達不懂時說的。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第1單元 This is 句型'] = {
  intro: '介紹身邊的人和東西，用的就是 This is 這個句型。',
  cards: [
    {
      title: '① This is 的意思',
      body: 'This is a book.（這是一本書。）\n' +
            'This is my mom.（這是我媽媽。）\n' +
            '⚠ this 指離自己近的人或物，is 是 be 動詞。',
      viz: { type: 'sentence', label: '介紹', items: [
        { t: 'This', r: '這個（近）' }, { t: 'is', r: 'be 動詞' },
        { t: 'a book', r: '介紹的對象' }],
        note: '介紹近處的人或物用 This is。' },
      check: {
        q: '「這是一枝筆」的正確說法是什麼？',
        options: [
          'This is a pen.',
          'This a pen.',
          'This are a pen.',
          'This is pen a.'
        ],
        answer: 0,
        why: [
          null,
          '句子缺少 be 動詞 is。',
          '主詞 this 是單數，要用 is。',
          '冠詞 a 要放在名詞前面。'
        ]
      }
    },
    {
      title: '② That is 指遠的',
      body: 'That is a dog.（那是一隻狗。）\n' +
            '⚠ this 近、that 遠；縮寫 that is 可以寫成 that’s。',
      viz: { type: 'compareexp',
             factor: '距離',
             a: { label: 'This is…', note: '介紹靠近自己的' },
             b: { label: 'That is…', note: '介紹離自己較遠的' },
             same: ['都用 is，都是單數句型'] },
      check: {
        q: '指著遠處的一隻貓，應該怎麼說？',
        options: [
          'That is a cat.',
          'This is a cat.',
          'These is a cat.',
          'There a cat.'
        ],
        answer: 0,
        why: [
          null,
          'this 用來指靠近的東西。',
          'these 是複數形，也指近處。',
          '這個句子缺少 be 動詞。'
        ]
      }
    },
    {
      title: '③ 複數：These 和 Those',
      body: 'These are books.（這些是書。）\n' +
            'Those are dogs.（那些是狗。）\n' +
            '⚠ 複數要用 are，名詞也要加 s。',
      viz: { type: 'classify', groups: [
        { label: '單數（用 is）', items: ['This is', 'That is'] },
        { label: '複數（用 are）', items: ['These are', 'Those are'] }] },
      check: {
        q: '「這些是蘋果」的正確說法是什麼？',
        options: [
          'These are apples.',
          'These is apples.',
          'This are apples.',
          'These are apple.'
        ],
        answer: 0,
        why: [
          null,
          '複數主詞要用 are。',
          'this 是單數，不能配 are。',
          '複數名詞要加 s。'
        ]
      }
    },
    {
      title: '④ 否定句',
      body: 'This is not a cat.（這不是貓。）\n' +
            'These are not books.（這些不是書。）\n' +
            '⚠ be 動詞的否定：在 is／are 後面加 not。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'This', r: '主詞' }, { t: 'is not', r: 'be 動詞加 not' },
        { t: 'a cat', r: '補語' }],
        note: 'be 動詞的否定直接在後面加 not。' },
      check: {
        q: '「那些不是我的書」的正確說法是什麼？',
        options: [
          'Those are not my books.',
          'Those not are my books.',
          'Those do not my books.',
          'Those is not my books.'
        ],
        answer: 0,
        why: [
          null,
          'not 要放在 be 動詞後面。',
          'be 動詞句不用助動詞 do。',
          '複數主詞要用 are。'
        ]
      }
    },
    {
      title: '⑤ 疑問句',
      body: 'Is this a book?（這是書嗎？）→ Yes, it is.／No, it is not.\n' +
            'Are these books?→ Yes, they are.\n' +
            '⚠ 疑問句把 be 動詞搬到最前面。',
      viz: { type: 'energyflow', steps: ['This is a book.', '把 is 移到最前面', 'Is this a book?', 'Yes, it is.'] },
      check: {
        q: '要把 This is a pen. 改成疑問句，該怎麼做？',
        options: [
          '把 is 移到句首，變成 Is this a pen?',
          '在句尾加 do',
          '把 this 改成 that',
          '在句首加 do'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞句不需要助動詞 do。',
          '改成 that 只是換了距離，不是疑問句。',
          'be 動詞句的疑問要移動 be 動詞。'
        ]
      }
    },
    {
      title: '⑥ 介紹人',
      body: 'This is my friend, Amy.（這是我的朋友 Amy。）\n' +
            '→ Nice to meet you.（很高興認識你。）\n' +
            '⚠ 介紹人的時候不用 he／she，直接用 This is。',
      viz: { type: 'sentence', label: '介紹朋友', items: [
        { t: 'This is', r: '介紹' }, { t: 'my friend', r: '關係' },
        { t: 'Amy', r: '名字' }],
        note: '介紹人時同樣用 This is。' },
      check: {
        q: '要向別人介紹身旁的朋友 Ben，可以怎麼說？',
        options: [
          'This is my friend, Ben.',
          'He is Ben friend.',
          'That is me friend Ben.',
          'Ben this friend.'
        ],
        answer: 0,
        why: [
          null,
          '這個語序不正確。',
          'me 是受格，「我的」要用 my。',
          '句子缺少 be 動詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第2單元 be 動詞 am／is／are'] = {
  intro: 'be 動詞是英文最常用的動詞，先弄懂三種變化就成功一半。',
  cards: [
    {
      title: '① 三種 be 動詞',
      body: 'I am（我是）　He／She／It is（他／她／它是）\n' +
            'You／We／They are（你／我們／他們是）\n' +
            '⚠ 口訣：我用 am，你們他們用 are，其他單數用 is。',
      viz: { type: 'classify', groups: [
        { label: 'am', items: ['I'] },
        { label: 'is', items: ['he', 'she', 'it', 'Amy'] },
        { label: 'are', items: ['you', 'we', 'they'] }] },
      check: {
        q: '主詞是 she 的時候，be 動詞要用哪一個？',
        options: ['is', 'am', 'are', 'be'],
        answer: 0,
        why: [
          null,
          'am 只跟 I 搭配。',
          'are 用於 you、we、they。',
          'be 是原形，不直接放在句子裡當主要動詞。'
        ]
      }
    },
    {
      title: '② be 動詞是什麼意思',
      body: 'be 動詞本身沒有動作，表示「是」或「在」：\n' +
            'I am a student.（我是學生。）\n' +
            'He is at home.（他在家。）\n' +
            '⚠ 中文常省略「是」，英文不能省。',
      viz: { type: 'compareexp',
             factor: 'be 動詞的兩種用法',
             a: { label: '表示「是」', note: 'I am a student.' },
             b: { label: '表示「在」', note: 'He is at home.' },
             same: ['都用同一套 am／is／are'] },
      check: {
        q: '「我很開心」的正確說法是什麼？',
        options: [
          'I am happy.',
          'I happy.',
          'I is happy.',
          'I are happy.'
        ],
        answer: 0,
        why: [
          null,
          '英文的形容詞句不能省略 be 動詞。',
          '主詞 I 要配 am。',
          'are 不跟 I 搭配。'
        ]
      }
    },
    {
      title: '③ 縮寫',
      body: 'I am → I’m　He is → He’s　They are → They’re\n' +
            'It is → It’s\n' +
            '⚠ 說話時多半用縮寫，聽起來比較自然。',
      viz: { type: 'classify', groups: [
        { label: '原形', items: ['I am', 'he is', 'they are'] },
        { label: '縮寫', items: ['I’m', 'he’s', 'they’re'] }] },
      check: {
        q: 'They are 的縮寫是什麼？',
        options: ['They’re', 'Their', 'There', 'They’s'],
        answer: 0,
        why: [
          null,
          'their 是「他們的」，意思不同。',
          'there 是「那裡」，只是發音相近。',
          '縮寫要照 are 縮，不是 is。'
        ]
      }
    },
    {
      title: '④ 否定句',
      body: 'I am not tired.（我不累。）\n' +
            'She is not here.（她不在這裡。）→ She isn’t here.\n' +
            '⚠ am not 沒有常見縮寫，is not→isn’t、are not→aren’t。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'She', r: '主詞' }, { t: 'is not', r: '否定的 be 動詞' },
        { t: 'here', r: '補語' }],
        note: 'be 動詞後面直接加 not。' },
      check: {
        q: 'She is not here. 的縮寫寫法是什麼？',
        options: [
          'She isn’t here.',
          'She not is here.',
          'She don’t here.',
          'She amn’t here.'
        ],
        answer: 0,
        why: [
          null,
          'not 要放在 be 動詞後面。',
          'be 動詞句不用 do 或 don’t。',
          'am not 沒有這種縮寫，主詞也不對。'
        ]
      }
    },
    {
      title: '⑤ 疑問句與簡答',
      body: 'Are you a student?→ Yes, I am.／No, I am not.\n' +
            'Is he your brother?→ Yes, he is.\n' +
            '⚠ 簡答時 be 動詞要跟著主詞變，不能一律說 yes。',
      viz: { type: 'energyflow', steps: ['You are a student.', 'Are you a student?', 'Yes, I am.'] },
      check: {
        q: '別人問 Are you happy?，肯定的簡答應該怎麼說？',
        options: [
          'Yes, I am.',
          'Yes, you are.',
          'Yes, I is.',
          'Yes, am I.'
        ],
        answer: 0,
        why: [
          null,
          '回答自己的事要用 I。',
          '主詞 I 要配 am。',
          '簡答不用疑問句的語序。'
        ]
      }
    },
    {
      title: '⑥ 常見錯誤',
      body: '✗ I am go to school.→ ✓ I go to school.\n' +
            '⚠ be 動詞和一般動詞不能同時出現。\n' +
            '有動作（go、eat、play）就不用 be 動詞；\n' +
            '沒有動作（形容詞、名詞、地點）才用 be 動詞。',
      viz: { type: 'compareexp',
             factor: '哪一種句子',
             a: { label: '有動作', note: 'I go to school.（不用 be 動詞）' },
             b: { label: '沒有動作', note: 'I am at school.（要用 be 動詞）' },
             same: ['一個句子只要一個主要動詞'] },
      check: {
        q: '「我每天上學」的正確說法是什麼？',
        options: [
          'I go to school every day.',
          'I am go to school every day.',
          'I am going school every day.',
          'I go am to school every day.'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞和一般動詞不能同時當主要動詞。',
          '這個句子少了介系詞 to，時態也不自然。',
          '句中不該再插入 be 動詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第3單元 數字與 How many'] = {
  intro: '學會問數量，就能說清楚「有幾個」。',
  cards: [
    {
      title: '① How many 問數量',
      body: 'How many books?（有幾本書？）\n' +
            'How many students are there?（有幾個學生？）\n' +
            '⚠ How many 後面接的名詞一定要用複數。',
      viz: { type: 'sentence', label: '問數量', items: [
        { t: 'How many', r: '幾個' }, { t: 'books', r: '複數名詞' }],
        note: 'How many 後面接可數名詞的複數。' },
      check: {
        q: '「有幾枝筆？」的正確說法是什麼？',
        options: [
          'How many pens?',
          'How many pen?',
          'How much pens?',
          'How many a pen?'
        ],
        answer: 0,
        why: [
          null,
          'How many 後面要用複數。',
          'How much 用於不可數名詞。',
          '有 How many 時不需要冠詞。'
        ]
      }
    },
    {
      title: '② 回答數量',
      body: 'How many books?→ Three books.／There are three.\n' +
            '⚠ 只有一個時用單數：One book.',
      viz: { type: 'classify', groups: [
        { label: '一個（單數）', items: ['one book', 'a book'] },
        { label: '多個（複數）', items: ['two books', 'ten books'] }] },
      check: {
        q: '「一本書」的正確說法是什麼？',
        options: ['one book', 'one books', 'a books', 'one of book'],
        answer: 0,
        why: [
          null,
          '數字 one 後面用單數。',
          '冠詞 a 後面接單數名詞。',
          '這個說法不符合英文用法。'
        ]
      }
    },
    {
      title: '③ 數字 20 到 100',
      body: 'twenty（20）　thirty（30）　forty（40）　fifty（50）\n' +
            'sixty（60）　seventy（70）　eighty（80）　ninety（90）　one hundred（100）\n' +
            '⚠ forty 沒有 u（不是 fourty）。',
      viz: { type: 'classify', groups: [
        { label: '整十的數字', items: ['twenty', 'thirty', 'forty', 'fifty'] },
        { label: '拼法要注意', items: ['forty', 'fifty', 'eighty'] }] },
      check: {
        q: '數字 40 的正確拼法是什麼？',
        options: ['forty', 'fourty', 'fourteen', 'fortty'],
        answer: 0,
        why: [
          null,
          '這個拼法多了字母 u。',
          'fourteen 是 14，不是 40。',
          '字母 t 不需要重複。'
        ]
      }
    },
    {
      title: '④ 21 到 99',
      body: 'twenty-one（21）　thirty-five（35）　ninety-nine（99）\n' +
            '⚠ 十位和個位之間要加連字號。',
      viz: { type: 'sentence', label: '合成數字', items: [
        { t: 'thirty', r: '十位' }, { t: '-', r: '連字號' }, { t: 'five', r: '個位' }],
        note: '兩位數用連字號連接。' },
      check: {
        q: '數字 35 的正確寫法是什麼？',
        options: [
          'thirty-five',
          'thirtyfive',
          'three five',
          'five-thirty'
        ],
        answer: 0,
        why: [
          null,
          '中間要加連字號。',
          '這只是把兩個數字唸出來。',
          '順序顛倒，十位要在前面。'
        ]
      }
    },
    {
      title: '⑤ There is 與 There are',
      body: 'There is a book on the desk.（桌上有一本書。）\n' +
            'There are five books.（有五本書。）\n' +
            '⚠ 後面接單數用 is，接複數用 are。',
      viz: { type: 'compareexp',
             factor: '後面的名詞',
             a: { label: 'There is', note: '後面接單數：a book' },
             b: { label: 'There are', note: '後面接複數：five books' },
             same: ['都表示「有」某樣東西'] },
      check: {
        q: '「教室裡有二十個學生」的正確說法是什麼？',
        options: [
          'There are twenty students in the classroom.',
          'There is twenty students in the classroom.',
          'There have twenty students.',
          'There are twenty student.'
        ],
        answer: 0,
        why: [
          null,
          '後面接複數要用 are。',
          '英文表示存在用 there is 或 there are。',
          '有數字二十時名詞要用複數。'
        ]
      }
    },
    {
      title: '⑥ 生活中的數字',
      body: '年齡：I am nine years old.\n' +
            '時間：It is five o’clock.\n' +
            '⚠ 說整點用 o’clock。\n' +
            '練習：數家裡的東西並用英文說出數量。',
      viz: { type: 'classify', groups: [
        { label: '數字的用途', items: ['年齡', '時間', '數量', '電話'] }] },
      check: {
        q: '「五點整」的正確說法是什麼？',
        options: [
          'It is five o’clock.',
          'It is five clock.',
          'It is o’clock five.',
          'It five o’clock.'
        ],
        answer: 0,
        why: [
          null,
          'o’clock 要有撇號。',
          '數字要放在 o’clock 前面。',
          '句子缺少 be 動詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第4單元 食物與飲料'] = {
  intro: '把食物的說法再擴充，並學會可數與不可數的差別。',
  cards: [
    {
      title: '① 三餐',
      body: 'breakfast（早餐）　lunch（午餐）　dinner（晚餐）\n' +
            'I have breakfast at seven.（我七點吃早餐。）\n' +
            '⚠ 三餐前面通常不加冠詞：have lunch（不是 have a lunch）。',
      viz: { type: 'sentence', label: '說三餐', items: [
        { t: 'I have', r: '我吃' }, { t: 'breakfast', r: '三餐（不加冠詞）' },
        { t: 'at seven', r: '時間' }],
        note: '吃三餐用 have，前面不加 a。' },
      check: {
        q: '「我吃午餐」的正確說法是什麼？',
        options: [
          'I have lunch.',
          'I have a lunch.',
          'I eat a lunches.',
          'I am lunch.'
        ],
        answer: 0,
        why: [
          null,
          '三餐前面通常不加冠詞。',
          '三餐一般不用複數形。',
          'be 動詞不能取代動作動詞。'
        ]
      }
    },
    {
      title: '② 可數與不可數',
      body: '可數：an apple／two apples、a cookie／three cookies\n' +
            '不可數：water、milk、rice、bread\n' +
            '⚠ 不可數名詞不加 s，也不能直接加 a。',
      viz: { type: 'classify', groups: [
        { label: '可數（能加 s）', items: ['apple', 'egg', 'cookie'] },
        { label: '不可數（不加 s）', items: ['water', 'milk', 'rice', 'bread'] }] },
      check: {
        q: '下列哪一個是不可數名詞？',
        options: ['water', 'apple', 'egg', 'cookie'],
        answer: 0,
        why: [
          null,
          '蘋果可以一顆一顆數。',
          '蛋可以一顆一顆數。',
          '餅乾可以一片一片數。'
        ]
      }
    },
    {
      title: '③ some 與 any',
      body: 'I have some milk.（我有一些牛奶。）\n' +
            'Do you have any bread?（你有麵包嗎？）\n' +
            '⚠ 肯定句用 some，疑問與否定句常用 any。',
      viz: { type: 'compareexp',
             factor: '句型',
             a: { label: 'some', note: '多用在肯定句：I have some water.' },
             b: { label: 'any', note: '多用在疑問與否定：Do you have any?' },
             same: ['都表示不確定的數量'] },
      check: {
        q: '「你有果汁嗎？」的正確說法是什麼？',
        options: [
          'Do you have any juice?',
          'Do you have some juices?',
          'Have you any a juice?',
          'You have any juice?'
        ],
        answer: 0,
        why: [
          null,
          'juice 是不可數名詞，不加 s。',
          '這個語序不是現代常用的英文。',
          '疑問句需要助動詞 do 在句首。'
        ]
      }
    },
    {
      title: '④ 表示分量',
      body: 'a glass of water（一杯水）　a cup of tea（一杯茶）\n' +
            'a piece of bread（一片麵包）　a bowl of rice（一碗飯）\n' +
            '⚠ 不可數名詞要靠容器或單位來計量。',
      viz: { type: 'classify', groups: [
        { label: '杯裝', items: ['a glass of water', 'a cup of tea'] },
        { label: '塊片碗', items: ['a piece of bread', 'a bowl of rice'] }] },
      check: {
        q: '「一碗飯」的正確說法是什麼？',
        options: [
          'a bowl of rice',
          'a rice',
          'one rices',
          'a rice bowl of'
        ],
        answer: 0,
        why: [
          null,
          '不可數名詞不能直接加冠詞 a。',
          '不可數名詞沒有複數形。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '⑤ 點餐',
      body: 'What would you like?（你想要什麼？）\n' +
            '→ I would like a hamburger.（我想要一個漢堡。）\n' +
            '⚠ would like 比 want 有禮貌，縮寫是 I’d like。',
      viz: { type: 'sentence', label: '點餐', items: [
        { t: 'I would like', r: '我想要（禮貌）' }, { t: 'a hamburger', r: '餐點' }],
        note: 'would like 比 want 客氣。' },
      check: {
        q: '在餐廳點餐時，比較有禮貌的說法是什麼？',
        options: [
          'I would like a sandwich, please.',
          'Give me a sandwich.',
          'I want sandwich now.',
          'Sandwich!'
        ],
        answer: 0,
        why: [
          null,
          '直接命令的語氣不夠客氣。',
          '這個說法生硬也少了冠詞。',
          '只說名詞無法表達完整意思。'
        ]
      }
    },
    {
      title: '⑥ 健康飲食',
      body: 'Vegetables are good for you.（蔬菜對你有益。）\n' +
            'Too much candy is not good.（太多糖果不好。）\n' +
            '⚠ 主詞是複數 vegetables 用 are，\n' +
            '不可數的 candy 當一整體用 is。',
      viz: { type: 'classify', groups: [
        { label: '多吃', items: ['vegetables', 'fruit', 'water'] },
        { label: '少吃', items: ['candy', 'soda', 'chips'] }] },
      check: {
        q: '「蔬菜對身體好」的正確說法是什麼？',
        options: [
          'Vegetables are good for you.',
          'Vegetables is good for you.',
          'Vegetable are good for you.',
          'Vegetables good for you.'
        ],
        answer: 0,
        why: [
          null,
          '複數主詞要用 are。',
          '要表達整類蔬菜時用複數。',
          '句子缺少 be 動詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第5單元 I like 句型'] = {
  intro: '說出自己的喜好，是最容易開口的英文。',
  cards: [
    {
      title: '① I like 的用法',
      body: 'I like dogs.（我喜歡狗。）\n' +
            'I like music.（我喜歡音樂。）\n' +
            '⚠ 喜歡一整類東西時，可數名詞用複數。',
      viz: { type: 'sentence', label: '說喜好', items: [
        { t: 'I like', r: '我喜歡' }, { t: 'dogs', r: '複數（整類）' }],
        note: '喜歡某一整類時用複數。' },
      check: {
        q: '「我喜歡貓」（指整類貓）的正確說法是什麼？',
        options: [
          'I like cats.',
          'I like a cats.',
          'I likes cat.',
          'I am like cats.'
        ],
        answer: 0,
        why: [
          null,
          '複數名詞前面不加冠詞 a。',
          '主詞 I 的動詞不加 s。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '② 他喜歡：動詞加 s',
      body: 'He likes dogs.（他喜歡狗。）\n' +
            'She likes music.\n' +
            '⚠ 主詞是第三人稱單數（he／she／it／某人的名字）時，動詞要加 s。',
      viz: { type: 'classify', groups: [
        { label: '動詞原形', items: ['I like', 'you like', 'we like', 'they like'] },
        { label: '動詞加 s', items: ['he likes', 'she likes', 'Amy likes'] }] },
      check: {
        q: '「Amy 喜歡書」的正確說法是什麼？',
        options: [
          'Amy likes books.',
          'Amy like books.',
          'Amy is like books.',
          'Amy likes book.'
        ],
        answer: 0,
        why: [
          null,
          '第三人稱單數的動詞要加 s。',
          'be 動詞不能和一般動詞並用。',
          '指整類書時要用複數。'
        ]
      }
    },
    {
      title: '③ 否定：不喜歡',
      body: 'I do not like fish.（我不喜歡魚。）→ I don’t like fish.\n' +
            'He does not like fish.→ He doesn’t like fish.\n' +
            '⚠ 用了 does 之後，動詞要回到原形（不是 doesn’t likes）。',
      viz: { type: 'sentence', label: '否定', items: [
        { t: 'He', r: '第三人稱單數' }, { t: 'doesn’t', r: '助動詞否定' },
        { t: 'like', r: '原形動詞' }],
        note: '有了 doesn’t，動詞就回到原形。' },
      check: {
        q: '「他不喜歡牛奶」的正確說法是什麼？',
        options: [
          'He doesn’t like milk.',
          'He doesn’t likes milk.',
          'He don’t like milk.',
          'He not like milk.'
        ],
        answer: 0,
        why: [
          null,
          '有了 doesn’t，動詞要用原形。',
          '第三人稱單數要用 doesn’t。',
          '否定句需要助動詞。'
        ]
      }
    },
    {
      title: '④ 問對方喜歡嗎',
      body: 'Do you like apples?→ Yes, I do.／No, I don’t.\n' +
            'Does he like apples?→ Yes, he does.\n' +
            '⚠ 一般動詞的疑問句要借助動詞 do／does。',
      viz: { type: 'energyflow', steps: ['You like apples.', '句首加 Do', 'Do you like apples?', 'Yes, I do.'] },
      check: {
        q: 'Does she like music? 的肯定簡答是什麼？',
        options: [
          'Yes, she does.',
          'Yes, she do.',
          'Yes, she is.',
          'Yes, she likes.'
        ],
        answer: 0,
        why: [
          null,
          '第三人稱單數要用 does。',
          '問句用 does，簡答就用 does。',
          '簡答用助動詞而不是重複主要動詞。'
        ]
      }
    },
    {
      title: '⑤ 喜歡做某件事',
      body: 'I like swimming.／I like to swim.（我喜歡游泳。）\n' +
            '⚠ like 後面可以接動詞 ing 或 to 加原形，兩種都可以。',
      viz: { type: 'compareexp',
             factor: 'like 後面接動作',
             a: { label: 'like + 動詞 ing', note: 'I like swimming.' },
             b: { label: 'like + to + 原形', note: 'I like to swim.' },
             same: ['意思相同，都表示喜歡做這件事'] },
      check: {
        q: '「我喜歡看書」的正確說法是什麼？',
        options: [
          'I like reading books.',
          'I like read books.',
          'I like reads books.',
          'I am like reading books.'
        ],
        answer: 0,
        why: [
          null,
          'like 後面要用 ing 或 to 加原形。',
          '這個形式不符合文法規則。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '⑥ 程度的差別',
      body: 'I love ice cream.（我很愛冰淇淋。）\n' +
            'I like it.（我喜歡。）\n' +
            'I do not like it.（我不喜歡。）\n' +
            'I hate it.（我討厭。）\n' +
            '⚠ 由喜歡到討厭：love → like → don’t like → hate。',
      viz: { type: 'energyflow', steps: ['love（最喜歡）', 'like（喜歡）', 'don’t like（不喜歡）', 'hate（討厭）'] },
      check: {
        q: '下列哪一個表達最強烈的喜歡？',
        options: ['love', 'like', 'do not like', 'hate'],
        answer: 0,
        why: [
          null,
          'like 的程度比 love 弱。',
          '這是否定的表達。',
          'hate 表示討厭，方向相反。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第6單元 動作動詞'] = {
  intro: '動詞是句子的引擎，會用動詞才說得出完整的句子。',
  cards: [
    {
      title: '① 常見動作',
      body: 'run（跑）　jump（跳）　walk（走）　swim（游泳）\n' +
            'eat（吃）　drink（喝）　read（讀）　write（寫）\n' +
            '⚠ 這些是一般動詞，本身就有動作，不用加 be 動詞。',
      viz: { type: 'classify', groups: [
        { label: '身體動作', items: ['run', 'jump', 'walk', 'swim'] },
        { label: '日常動作', items: ['eat', 'drink', 'read', 'write'] }] },
      check: {
        q: '「我跑步」的正確說法是什麼？',
        options: [
          'I run.',
          'I am run.',
          'I runs.',
          'I am running to run.'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞不能和一般動詞並用。',
          '主詞 I 的動詞不加 s。',
          '這個句子重複了同一個動作。'
        ]
      }
    },
    {
      title: '② 第三人稱單數加 s',
      body: 'He runs.　She eats.　It jumps.\n' +
            '⚠ 特殊變化：go→goes、do→does、watch→watches、study→studies。',
      viz: { type: 'classify', groups: [
        { label: '直接加 s', items: ['runs', 'eats', 'jumps'] },
        { label: '加 es', items: ['goes', 'does', 'watches'] },
        { label: 'y 改 ies', items: ['studies', 'flies'] }] },
      check: {
        q: '「他去學校」的正確說法是什麼？',
        options: [
          'He goes to school.',
          'He gos to school.',
          'He go to school.',
          'He goeses to school.'
        ],
        answer: 0,
        why: [
          null,
          'go 的第三人稱單數是 goes。',
          '第三人稱單數的動詞要變化。',
          '這個拼法重複加了字尾。'
        ]
      }
    },
    {
      title: '③ 動詞加受詞',
      body: 'I eat an apple.（我吃一顆蘋果。）\n' +
            'She reads a book.\n' +
            '⚠ 語序：主詞 → 動詞 → 受詞，這是英文句子的骨架。',
      viz: { type: 'sentence', label: '基本語序', items: [
        { t: 'She', r: '主詞' }, { t: 'reads', r: '動詞' }, { t: 'a book', r: '受詞' }],
        note: '英文的基本語序是主詞、動詞、受詞。' },
      check: {
        q: '英文句子的基本語序是什麼？',
        options: [
          '主詞、動詞、受詞',
          '動詞、主詞、受詞',
          '受詞、動詞、主詞',
          '主詞、受詞、動詞'
        ],
        answer: 0,
        why: [
          null,
          '英文的動詞不放在主詞前面（疑問句除外）。',
          '受詞不會放在句首當開頭。',
          '英文的動詞不放在句尾。'
        ]
      }
    },
    {
      title: '④ 否定句',
      body: 'I do not eat meat.（我不吃肉。）\n' +
            'He does not run.（他不跑步。）\n' +
            '⚠ 一般動詞的否定要用 do not／does not，不是加 not 就好。',
      viz: { type: 'compareexp',
             factor: '哪一種動詞',
             a: { label: 'be 動詞', note: 'I am not tired.（直接加 not）' },
             b: { label: '一般動詞', note: 'I do not run.（要借 do）' },
             same: ['都用 not 表示否定'] },
      check: {
        q: '「她不吃魚」的正確說法是什麼？',
        options: [
          'She does not eat fish.',
          'She not eat fish.',
          'She is not eat fish.',
          'She does not eats fish.'
        ],
        answer: 0,
        why: [
          null,
          '一般動詞的否定要借助動詞。',
          'be 動詞不能和一般動詞並用。',
          '有了 does 之後動詞要用原形。'
        ]
      }
    },
    {
      title: '⑤ 現在進行式',
      body: 'I am running.（我正在跑步。）\n' +
            'She is eating.（她正在吃東西。）\n' +
            '⚠ be 動詞加動詞 ing，表示「現在正在做」。',
      viz: { type: 'sentence', label: '正在進行', items: [
        { t: 'She', r: '主詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'eating', r: '動詞加 ing' }],
        note: '現在進行式是 be 動詞加動詞 ing。' },
      check: {
        q: '「他正在游泳」的正確說法是什麼？',
        options: [
          'He is swimming.',
          'He swimming.',
          'He is swim.',
          'He swims now doing.'
        ],
        answer: 0,
        why: [
          null,
          '進行式需要 be 動詞。',
          '進行式的動詞要加 ing。',
          '這個句子的結構不正確。'
        ]
      }
    },
    {
      title: '⑥ 兩種現在式的差別',
      body: 'I eat breakfast every day.（習慣：每天都吃。）\n' +
            'I am eating breakfast now.（此刻：正在吃。）\n' +
            '⚠ 看到 every day、always 用簡單式；\n' +
            '看到 now、look 用進行式。',
      viz: { type: 'compareexp',
             factor: '時間點',
             a: { label: '現在簡單式', note: '習慣、常態：every day' },
             b: { label: '現在進行式', note: '此刻正在做：now' },
             same: ['都在講現在的事'] },
      check: {
        q: '「我現在正在讀書」應該用哪一種時態？',
        options: [
          '現在進行式：I am reading now.',
          '現在簡單式：I read now.',
          '兩種都不行',
          '要用過去式'
        ],
        answer: 0,
        why: [
          null,
          '有 now 表示此刻，要用進行式。',
          '英文有適合的時態可以表達。',
          '過去式用於已經發生的事。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第7單元 學校地點與科目'] = {
  intro: '校園裡的每個地方、每一堂課，都有自己的英文名字。',
  cards: [
    {
      title: '① 校園地點',
      body: 'classroom（教室）　library（圖書館）　playground（操場）\n' +
            'restroom（洗手間）　office（辦公室）　gym（體育館）\n' +
            '⚠ 說「在圖書館」用 in the library。',
      viz: { type: 'classify', groups: [
        { label: '室內', items: ['classroom', 'library', 'office', 'gym'] },
        { label: '室外', items: ['playground', 'garden'] }] },
      check: {
        q: '「圖書館」的英文是什麼？',
        options: ['library', 'classroom', 'playground', 'office'],
        answer: 0,
        why: [
          null,
          'classroom 指的是教室。',
          'playground 指的是操場。',
          'office 指的是辦公室。'
        ]
      }
    },
    {
      title: '② 問地方在哪裡',
      body: 'Where is the library?（圖書館在哪裡？）\n' +
            '→ It is on the second floor.（在二樓。）\n' +
            '⚠ 樓層用序數：first、second、third floor。',
      viz: { type: 'sentence', label: '問地點', items: [
        { t: 'Where', r: '在哪裡' }, { t: 'is', r: 'be 動詞' },
        { t: 'the library', r: '地點' }],
        note: 'Where 開頭問地點。' },
      check: {
        q: '「洗手間在哪裡？」的正確說法是什麼？',
        options: [
          'Where is the restroom?',
          'Where the restroom is?',
          'Where restroom?',
          'What is the restroom?'
        ],
        answer: 0,
        why: [
          null,
          '疑問句要把 be 動詞放在主詞前面。',
          '句子缺少 be 動詞與冠詞。',
          'What 是問「什麼」，不是問地點。'
        ]
      }
    },
    {
      title: '③ 表示位置的介系詞',
      body: 'in（在裡面）　on（在上面）　under（在下面）\n' +
            'next to（在旁邊）　behind（在後面）\n' +
            '⚠ 樓層與地址常用 on：on the third floor。',
      viz: { type: 'classify', groups: [
        { label: '裡外上下', items: ['in', 'on', 'under'] },
        { label: '前後左右', items: ['next to', 'behind', 'in front of'] }] },
      check: {
        q: '「書在桌子上」的正確說法是什麼？',
        options: [
          'The book is on the desk.',
          'The book is in the desk.',
          'The book is under the desk.',
          'The book is desk.'
        ],
        answer: 0,
        why: [
          null,
          'in 表示在裡面（抽屜裡）。',
          'under 表示在下面。',
          '句子缺少介系詞。'
        ]
      }
    },
    {
      title: '④ 科目',
      body: 'Chinese（國語）　English（英語）　math（數學）\n' +
            'science（自然）　social studies（社會）　art（美術）　PE（體育）　music（音樂）\n' +
            '⚠ 語言與國家有關的科目字首要大寫：Chinese、English。',
      viz: { type: 'classify', groups: [
        { label: '字首大寫', items: ['Chinese', 'English'] },
        { label: '一般小寫', items: ['math', 'science', 'art', 'music'] }] },
      check: {
        q: '下列哪一個科目的字首一定要大寫？',
        options: ['English', 'math', 'science', 'art'],
        answer: 0,
        why: [
          null,
          'math 是普通名詞，不需要大寫。',
          'science 是普通名詞，不需要大寫。',
          'art 是普通名詞，不需要大寫。'
        ]
      }
    },
    {
      title: '⑤ 說喜歡的科目',
      body: 'My favorite subject is math.（我最喜歡的科目是數學。）\n' +
            'I like science because it is fun.（我喜歡自然，因為很有趣。）\n' +
            '⚠ because 用來說理由。',
      viz: { type: 'sentence', label: '說理由', items: [
        { t: 'I like science', r: '主要句子' }, { t: 'because', r: '因為' },
        { t: 'it is fun', r: '理由' }],
        note: 'because 後面接完整的理由句。' },
      check: {
        q: '「我喜歡音樂，因為它很好玩」的正確說法是什麼？',
        options: [
          'I like music because it is fun.',
          'I like music because fun.',
          'I like music, so it is fun.',
          'Because I like music it is fun.'
        ],
        answer: 0,
        why: [
          null,
          'because 後面要接完整的句子。',
          'so 表示結果，不是理由。',
          '這樣寫語意變得不通順。'
        ]
      }
    },
    {
      title: '⑥ 課表',
      body: 'We have math on Monday.（我們星期一有數學。）\n' +
            'What class do you have now?（你現在上什麼課？）\n' +
            '⚠ 星期前面用 on。',
      viz: { type: 'sentence', label: '說課表', items: [
        { t: 'We have math', r: '有什麼課' }, { t: 'on Monday', r: '星期用 on' }],
        note: '星期前面的介系詞用 on。' },
      check: {
        q: '「我們星期五有體育課」的正確說法是什麼？',
        options: [
          'We have PE on Friday.',
          'We have PE in Friday.',
          'We have PE at Friday.',
          'We have PE Friday on.'
        ],
        answer: 0,
        why: [
          null,
          'in 用於月份、年份或季節。',
          'at 用於具體的時間點。',
          '介系詞要放在星期前面。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第8單元 星期與作息'] = {
  intro: '一週七天加上每天的作息，就能描述自己的生活。',
  cards: [
    {
      title: '① 一週七天',
      body: 'Monday　Tuesday　Wednesday　Thursday\n' +
            'Friday　Saturday　Sunday\n' +
            '⚠ 星期的字首一定要大寫；Wednesday 中間的 d 不發音但要寫。',
      viz: { type: 'classify', groups: [
        { label: '上學日', items: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
        { label: '週末', items: ['Saturday', 'Sunday'] }] },
      check: {
        q: '「星期三」的正確拼法是什麼？',
        options: ['Wednesday', 'Wensday', 'Wednsday', 'Wedneday'],
        answer: 0,
        why: [
          null,
          '這個拼法漏了字母 d 和 e。',
          '這個拼法漏了字母 e。',
          '這個拼法漏了字母 s。'
        ]
      }
    },
    {
      title: '② 問今天星期幾',
      body: 'What day is it today?（今天星期幾？）\n' +
            '→ It is Monday.（今天星期一。）\n' +
            '⚠ 主詞用 it，跟說天氣一樣。',
      viz: { type: 'sentence', label: '問星期', items: [
        { t: 'What day', r: '星期幾' }, { t: 'is it', r: 'be 動詞加主詞' },
        { t: 'today', r: '今天' }],
        note: '問星期的固定句型。' },
      check: {
        q: '「今天星期二」的正確說法是什麼？',
        options: [
          'It is Tuesday.',
          'Today is tuesday.',
          'It is a Tuesday day.',
          'Today Tuesday.'
        ],
        answer: 0,
        why: [
          null,
          '星期的字首要大寫。',
          '這個說法多了不必要的字。',
          '句子缺少 be 動詞。'
        ]
      }
    },
    {
      title: '③ 每天的作息',
      body: 'get up（起床）　brush my teeth（刷牙）　go to school（上學）\n' +
            'do homework（寫作業）　go to bed（上床睡覺）\n' +
            '⚠ 這些是動詞片語，整組一起記比較好用。',
      viz: { type: 'energyflow', steps: ['get up', 'have breakfast', 'go to school', 'do homework', 'go to bed'] },
      check: {
        q: '「起床」的英文片語是什麼？',
        options: ['get up', 'go up', 'stand up', 'wake down'],
        answer: 0,
        why: [
          null,
          'go up 是「往上走」。',
          'stand up 是「站起來」。',
          '這個片語並不存在。'
        ]
      }
    },
    {
      title: '④ 說時間',
      body: 'I get up at seven.（我七點起床。）\n' +
            'I go to bed at nine thirty.（我九點半睡覺。）\n' +
            '⚠ 時間點前面用 at。',
      viz: { type: 'sentence', label: '說時間', items: [
        { t: 'I get up', r: '做什麼' }, { t: 'at seven', r: '時間點用 at' }],
        note: '幾點鐘前面的介系詞用 at。' },
      check: {
        q: '「我六點起床」的正確說法是什麼？',
        options: [
          'I get up at six.',
          'I get up on six.',
          'I get up in six.',
          'I get up six at.'
        ],
        answer: 0,
        why: [
          null,
          'on 用於星期與日期。',
          'in 用於月份、年份或較長的時間。',
          '介系詞要放在時間前面。'
        ]
      }
    },
    {
      title: '⑤ 頻率副詞',
      body: 'always（總是）　usually（通常）　sometimes（有時）　never（從不）\n' +
            'I always get up at six.\n' +
            '⚠ 頻率副詞通常放在一般動詞前面、be 動詞後面。',
      viz: { type: 'energyflow', steps: ['always（100%）', 'usually（常常）', 'sometimes（有時）', 'never（0%）'] },
      check: {
        q: '「我有時候看電視」的正確說法是什麼？',
        options: [
          'I sometimes watch TV.',
          'I watch sometimes TV.',
          'Sometimes watch I TV.',
          'I am sometimes watch TV.'
        ],
        answer: 0,
        why: [
          null,
          '頻率副詞不放在動詞與受詞中間。',
          '這個語序不符合英文結構。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '⑥ 週末做什麼',
      body: 'On Saturday, I play basketball.（星期六我打籃球。）\n' +
            'On Sunday, I visit my grandparents.\n' +
            '⚠ 說「每個星期六」可以用複數：on Saturdays。',
      viz: { type: 'sentence', label: '說週末', items: [
        { t: 'On Sunday', r: '時間（放句首要加逗號）' },
        { t: 'I visit my grandparents', r: '做什麼' }],
        note: '時間放句首時後面加逗號。' },
      check: {
        q: '「星期日我去公園」的正確說法是什麼？',
        options: [
          'On Sunday, I go to the park.',
          'In Sunday, I go to the park.',
          'At Sunday, I go the park.',
          'Sunday I go park.'
        ],
        answer: 0,
        why: [
          null,
          '星期前面的介系詞要用 on。',
          '星期不用 at，句子也少了介系詞。',
          '句子缺少介系詞與冠詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二上|第9單元 形容詞：大小與外形'] = {
  intro: '形容詞讓句子變得有畫面，說得更清楚。',
  cards: [
    {
      title: '① 大小與長短',
      body: 'big／small（大／小）　long／short（長／短）\n' +
            'tall／short（高／矮）　fat／thin（胖／瘦）\n' +
            '⚠ short 有兩個意思：短的、矮的，要看說什麼。',
      viz: { type: 'classify', groups: [
        { label: '成對的形容詞', items: ['big／small', 'long／short', 'tall／short'] },
        { label: '一字多義', items: ['short（短、矮）'] }] },
      check: {
        q: 'short 這個字可能有哪些意思？',
        options: [
          '短的，也可以是矮的',
          '只能是短的',
          '只能是矮的',
          '表示長的'
        ],
        answer: 0,
        why: [
          null,
          'short 也可以形容身高。',
          'short 也可以形容長度。',
          'long 才是長的。'
        ]
      }
    },
    {
      title: '② 形容詞放哪裡',
      body: 'a big dog（一隻大狗）→ 形容詞放名詞前面\n' +
            'The dog is big.（那隻狗很大。）→ 放 be 動詞後面\n' +
            '⚠ 兩種位置都對，但不能同時用。',
      viz: { type: 'compareexp',
             factor: '形容詞的位置',
             a: { label: '名詞前面', note: 'a big dog' },
             b: { label: 'be 動詞後面', note: 'The dog is big.' },
             same: ['都在說這隻狗很大'] },
      check: {
        q: '「那本書很厚」的正確說法是什麼？',
        options: [
          'The book is thick.',
          'The book thick.',
          'The thick is book.',
          'Is the book thick very.'
        ],
        answer: 0,
        why: [
          null,
          '句子缺少 be 動詞。',
          '主詞與形容詞的位置顛倒了。',
          '這是疑問句的語序，語意也不通。'
        ]
      }
    },
    {
      title: '③ 顏色與形狀',
      body: 'red、blue、green、yellow、black、white\n' +
            'round（圓的）　square（方的）\n' +
            '⚠ 順序：大小 → 形狀 → 顏色 → 名詞：a big round red ball。',
      viz: { type: 'sentence', label: '形容詞順序', items: [
        { t: 'a', r: '冠詞' }, { t: 'big', r: '大小' }, { t: 'round', r: '形狀' },
        { t: 'red', r: '顏色' }, { t: 'ball', r: '名詞' }],
        note: '大小、形狀、顏色的順序。' },
      check: {
        q: '「一顆小的圓形白球」的正確順序是什麼？',
        options: [
          'a small round white ball',
          'a white round small ball',
          'a round small white ball',
          'a white small round ball'
        ],
        answer: 0,
        why: [
          null,
          '顏色通常放在最靠近名詞的位置。',
          '大小要放在形狀前面。',
          '大小要放在顏色前面。'
        ]
      }
    },
    {
      title: '④ 加強語氣',
      body: 'very big（很大）　so tall（好高）　too small（太小了）\n' +
            '⚠ too 帶有「超過了、不好」的意思：\n' +
            'The shoes are too small.（鞋子太小了，不能穿。）',
      viz: { type: 'compareexp',
             factor: '語氣',
             a: { label: 'very／so', note: '單純加強：很、非常' },
             b: { label: 'too', note: '帶有「過頭了」的負面意思' },
             same: ['都放在形容詞前面'] },
      check: {
        q: 'The bag is too heavy. 這句話的意思是什麼？',
        options: [
          '這個包包太重了，重到不方便',
          '這個包包剛剛好',
          '這個包包很輕',
          '這個包包也很重'
        ],
        answer: 0,
        why: [
          null,
          'too 表示已經超過合適的程度。',
          'heavy 是重的意思。',
          '這裡的 too 不是「也」的意思。'
        ]
      }
    },
    {
      title: '⑤ 比較兩個東西',
      body: 'This ball is bigger than that one.（這顆球比那顆大。）\n' +
            '⚠ 短的形容詞加 er，後面用 than。\n' +
            'big→bigger（重複字尾）、happy→happier（y 改 i）。',
      viz: { type: 'classify', groups: [
        { label: '直接加 er', items: ['taller', 'longer', 'smaller'] },
        { label: '重複字尾', items: ['bigger', 'hotter', 'fatter'] },
        { label: 'y 改 ier', items: ['happier', 'easier'] }] },
      check: {
        q: 'big 的比較級是什麼？',
        options: ['bigger', 'biger', 'more big', 'bigest'],
        answer: 0,
        why: [
          null,
          '字尾的 g 要重複。',
          '短形容詞用 er 而不是 more。',
          '這是最高級的形式，拼法也不對。'
        ]
      }
    },
    {
      title: '⑥ 描述一個人或東西',
      body: 'My dog is small and cute.（我的狗又小又可愛。）\n' +
            'He is tall but thin.（他很高但很瘦。）\n' +
            '⚠ and 連接相似的、but 連接相反的。',
      viz: { type: 'compareexp',
             factor: '連接詞',
             a: { label: 'and', note: '連接方向相同的描述' },
             b: { label: 'but', note: '連接有轉折的描述' },
             same: ['都用來把兩個描述接起來'] },
      check: {
        q: '「這個包包很小但是很重」該用哪個連接詞？',
        options: [
          'but，因為小和重有轉折',
          'and，因為兩個都是形容詞',
          'or，因為要二選一',
          '不需要連接詞'
        ],
        answer: 0,
        why: [
          null,
          '詞性相同不代表語意沒有轉折。',
          'or 用在選擇的情況。',
          '兩個描述之間需要連接詞才通順。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第1單元 人稱代名詞'] = {
  intro: '代名詞用來代替名字，說話才不會一直重複。',
  cards: [
    {
      title: '① 主格代名詞',
      body: 'I（我）　you（你）　he（他）　she（她）　it（它）\n' +
            'we（我們）　they（他們）\n' +
            '⚠ 主格放在句首當主詞：He is my brother.',
      viz: { type: 'classify', groups: [
        { label: '單數', items: ['I', 'you', 'he', 'she', 'it'] },
        { label: '複數', items: ['we', 'you', 'they'] }] },
      check: {
        q: '要代替「我的哥哥」當主詞，應該用哪一個代名詞？',
        options: ['he', 'she', 'it', 'him'],
        answer: 0,
        why: [
          null,
          'she 用來代替女性。',
          'it 用來代替東西或動物。',
          'him 是受格，不能當主詞。'
        ]
      }
    },
    {
      title: '② 受格代名詞',
      body: 'me、you、him、her、it、us、them\n' +
            'She likes him.（她喜歡他。）\n' +
            '⚠ 受格放在動詞或介系詞後面。',
      viz: { type: 'sentence', label: '主格與受格', items: [
        { t: 'She', r: '主格（當主詞）' }, { t: 'likes', r: '動詞' },
        { t: 'him', r: '受格（當受詞）' }],
        note: '動詞後面要用受格。' },
      check: {
        q: '「我喜歡她」的正確說法是什麼？',
        options: [
          'I like her.',
          'I like she.',
          'Me like her.',
          'I likes she.'
        ],
        answer: 0,
        why: [
          null,
          '動詞後面要用受格 her。',
          '句首當主詞要用主格 I。',
          '主詞 I 的動詞不加 s，受格也用錯。'
        ]
      }
    },
    {
      title: '③ 所有格：某人的',
      body: 'my、your、his、her、its、our、their\n' +
            'This is my book.（這是我的書。）\n' +
            '⚠ 所有格後面一定要接名詞。',
      viz: { type: 'classify', groups: [
        { label: '主格', items: ['I', 'he', 'she', 'they'] },
        { label: '所有格', items: ['my', 'his', 'her', 'their'] },
        { label: '受格', items: ['me', 'him', 'her', 'them'] }] },
      check: {
        q: '「這是他的書包」的正確說法是什麼？',
        options: [
          'This is his backpack.',
          'This is he backpack.',
          'This is him backpack.',
          'This is his.'
        ],
        answer: 0,
        why: [
          null,
          '主格不能直接修飾名詞。',
          '受格不能直接修飾名詞。',
          '這句話沒有說出是什麼東西。'
        ]
      }
    },
    {
      title: '④ 所有代名詞',
      body: 'mine、yours、his、hers、ours、theirs\n' +
            'This book is mine.（這本書是我的。）\n' +
            '⚠ 所有代名詞後面不接名詞，本身就代表「某人的東西」。',
      viz: { type: 'compareexp',
             factor: '後面接不接名詞',
             a: { label: 'my（所有格）', note: '後面要接名詞：my book' },
             b: { label: 'mine（所有代名詞）', note: '後面不接名詞：It is mine.' },
             same: ['都表示這是我的'] },
      check: {
        q: '「這枝筆是我的」的正確說法是什麼？',
        options: [
          'This pen is mine.',
          'This pen is my.',
          'This pen is me.',
          'This is my.'
        ],
        answer: 0,
        why: [
          null,
          'my 後面一定要接名詞。',
          'me 是受格，不表示所有。',
          '這個句子沒說清楚是什麼東西。'
        ]
      }
    },
    {
      title: '⑤ 用 it 代替東西',
      body: 'I have a cat. It is white.（我有一隻貓，牠是白色的。）\n' +
            '⚠ it 用來代替單數的東西或動物；\n' +
            '也用在天氣、時間、日期的句子裡。',
      viz: { type: 'classify', groups: [
        { label: 'it 代替東西', items: ['a book', 'a cat', 'the bag'] },
        { label: 'it 的特殊用法', items: ['天氣', '時間', '日期'] }] },
      check: {
        q: '下列哪一句的 it 是特殊用法（不代替具體東西）？',
        options: [
          'It is rainy today.',
          'I have a dog. It is big.',
          'This is my bag. It is new.',
          'Look at the cat. It is cute.'
        ],
        answer: 0,
        why: [
          null,
          '這裡的 it 代替前面提到的狗。',
          '這裡的 it 代替前面提到的包包。',
          '這裡的 it 代替前面提到的貓。'
        ]
      }
    },
    {
      title: '⑥ 常見混淆',
      body: 'its（它的）vs. it’s（it is 的縮寫）\n' +
            'their（他們的）vs. they’re（they are）vs. there（那裡）\n' +
            '⚠ 有撇號的是縮寫，沒撇號的 its 才是所有格。',
      viz: { type: 'compareexp',
             factor: '有沒有撇號',
             a: { label: 'its', note: '所有格：Its tail is long.' },
             b: { label: 'it’s', note: '縮寫：It’s a cat.' },
             same: ['發音完全一樣，只能靠意思判斷'] },
      check: {
        q: '「牠的尾巴很長」應該用哪一個字？',
        options: [
          'Its tail is long.',
          'It’s tail is long.',
          'Its’ tail is long.',
          'It is tail is long.'
        ],
        answer: 0,
        why: [
          null,
          '有撇號的是 it is 的縮寫。',
          '這個寫法並不存在。',
          '一個句子不能有兩個 be 動詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第2單元 Yes/No 問句與簡答'] = {
  intro: '能用 Yes 或 No 回答的問句，是最基本的對話。',
  cards: [
    {
      title: '① be 動詞問句',
      body: 'Are you a student?（你是學生嗎？）\n' +
            'Is she your sister?\n' +
            '⚠ 把 be 動詞移到句首就成了問句。',
      viz: { type: 'energyflow', steps: ['You are a student.', '把 are 移到最前面', 'Are you a student?'] },
      check: {
        q: '要把 He is tall. 改成問句，該怎麼做？',
        options: [
          '把 is 移到句首：Is he tall?',
          '句首加 Do：Do he is tall?',
          '句尾加 ?：He is tall?',
          '把 he 改成 him'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞句不需要助動詞 do。',
          '書面英文的問句要調整語序。',
          '換成受格不會變成問句。'
        ]
      }
    },
    {
      title: '② 一般動詞問句',
      body: 'Do you like pizza?（你喜歡披薩嗎？）\n' +
            'Does he play basketball?\n' +
            '⚠ 一般動詞要借 do／does，而且後面的動詞回到原形。',
      viz: { type: 'sentence', label: '問句結構', items: [
        { t: 'Does', r: '助動詞' }, { t: 'he', r: '主詞' },
        { t: 'play', r: '原形動詞' }],
        note: '有了 does，動詞就用原形。' },
      check: {
        q: '「他會彈鋼琴嗎？」的正確說法是什麼？',
        options: [
          'Does he play the piano?',
          'Does he plays the piano?',
          'Do he play the piano?',
          'Is he play the piano?'
        ],
        answer: 0,
        why: [
          null,
          '有了 does，動詞要用原形。',
          '第三人稱單數要用 does。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '③ 簡答的規則',
      body: 'Are you happy?→ Yes, I am.／No, I am not.\n' +
            'Do you like it?→ Yes, I do.／No, I do not.\n' +
            '⚠ 問句用什麼開頭，簡答就用什麼回答。',
      viz: { type: 'compareexp',
             factor: '問句開頭',
             a: { label: 'Are／Is 開頭', note: '簡答用 am／is／are' },
             b: { label: 'Do／Does 開頭', note: '簡答用 do／does' },
             same: ['都要跟著主詞調整'] },
      check: {
        q: 'Do you like music? 的否定簡答是什麼？',
        options: [
          'No, I do not.',
          'No, I am not.',
          'No, I like not.',
          'No, I does not.'
        ],
        answer: 0,
        why: [
          null,
          '問句用 do 開頭，簡答就要用 do。',
          '簡答不重複主要動詞。',
          '主詞 I 要用 do 而不是 does。'
        ]
      }
    },
    {
      title: '④ 簡答的主詞要換',
      body: 'Are you a student?→ Yes, I am.（不是 Yes, you are.）\n' +
            'Is Amy your friend?→ Yes, she is.\n' +
            '⚠ 對方問「你」，你要回答「我」；\n' +
            '人名要換成 he 或 she。',
      viz: { type: 'energyflow', steps: ['問：Are you…?', '換主詞：you → I', '答：Yes, I am.'] },
      check: {
        q: '別人問 Is Ben your brother?，肯定簡答要怎麼說？',
        options: [
          'Yes, he is.',
          'Yes, Ben is.',
          'Yes, it is.',
          'Yes, they are.'
        ],
        answer: 0,
        why: [
          null,
          '簡答要用代名詞而不是重複名字。',
          'it 用來代替東西，不用來代替人。',
          'Ben 是一個人，要用單數。'
        ]
      }
    },
    {
      title: '⑤ 縮寫只用在否定',
      body: 'Yes, I am.（不能縮成 Yes, I’m.）\n' +
            'No, I’m not.（否定可以縮寫。）\n' +
            '⚠ 肯定簡答不縮寫，這是固定用法。',
      viz: { type: 'compareexp',
             factor: '能不能縮寫',
             a: { label: '肯定簡答', note: 'Yes, I am.（不縮寫）' },
             b: { label: '否定簡答', note: 'No, I’m not.（可縮寫）' },
             same: ['都要跟著主詞調整動詞'] },
      check: {
        q: '下列哪一個簡答是正確的？',
        options: [
          'Yes, I am.',
          'Yes, I’m.',
          'Yes, am I.',
          'Yes, I’m am.'
        ],
        answer: 0,
        why: [
          null,
          '肯定簡答不使用縮寫。',
          '簡答不用疑問句的語序。',
          '這個句子重複了 be 動詞。'
        ]
      }
    },
    {
      title: '⑥ 用簡答延伸對話',
      body: 'Do you like dogs?→ Yes, I do. I have two dogs.\n' +
            '⚠ 只回 Yes 或 No 會讓對話結束，\n' +
            '多說一句就能讓對話繼續下去。',
      viz: { type: 'energyflow', steps: ['對方提問', '簡答 Yes／No', '補一句相關資訊', '對話延續'] },
      check: {
        q: '想讓對話繼續，回答問題時最好怎麼做？',
        options: [
          '簡答之後再補一句相關的資訊',
          '只回答 Yes 或 No',
          '不回答',
          '重複對方的問題'
        ],
        answer: 0,
        why: [
          null,
          '只回一個字對話很快就結束了。',
          '不回答會讓對方不知所措。',
          '重複問題不算回答。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第3單元 疑問詞 What 與 Who'] = {
  intro: '想問「什麼」和「誰」，就要用疑問詞開頭。',
  cards: [
    {
      title: '① What 問什麼',
      body: 'What is this?（這是什麼？）\n' +
            'What is your name?（你叫什麼名字？）\n' +
            '⚠ 疑問詞放句首，後面接 be 動詞或助動詞。',
      viz: { type: 'sentence', label: 'What 問句', items: [
        { t: 'What', r: '疑問詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'this', r: '主詞' }],
        note: '疑問詞放在最前面。' },
      check: {
        q: '「你叫什麼名字？」的正確說法是什麼？',
        options: [
          'What is your name?',
          'What your name is?',
          'What name you?',
          'Who is your name?'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞要放在主詞前面。',
          '句子缺少 be 動詞。',
          'Who 是問人，不是問名稱。'
        ]
      }
    },
    {
      title: '② What 配一般動詞',
      body: 'What do you like?（你喜歡什麼？）\n' +
            'What does he do?（他做什麼工作？）\n' +
            '⚠ 一般動詞的問句要借 do／does。',
      viz: { type: 'sentence', label: 'What 加助動詞', items: [
        { t: 'What', r: '疑問詞' }, { t: 'do', r: '助動詞' },
        { t: 'you like', r: '主詞加原形動詞' }],
        note: '一般動詞要用 do 或 does。' },
      check: {
        q: '「她喜歡什麼？」的正確說法是什麼？',
        options: [
          'What does she like?',
          'What she likes?',
          'What do she like?',
          'What is she like it?'
        ],
        answer: 0,
        why: [
          null,
          '問句需要助動詞 does。',
          '第三人稱單數要用 does。',
          '這個句子的結構不正確。'
        ]
      }
    },
    {
      title: '③ Who 問人',
      body: 'Who is he?（他是誰？）\n' +
            'Who is your teacher?\n' +
            '⚠ Who 問的是人的身分。',
      viz: { type: 'compareexp',
             factor: '問什麼',
             a: { label: 'What', note: '問東西、名稱、內容' },
             b: { label: 'Who', note: '問人是誰' },
             same: ['都放在句首當疑問詞'] },
      check: {
        q: '要問「那個女生是誰？」應該用哪個疑問詞？',
        options: ['Who', 'What', 'Where', 'When'],
        answer: 0,
        why: [
          null,
          'What 用來問東西或名稱。',
          'Where 用來問地方。',
          'When 用來問時間。'
        ]
      }
    },
    {
      title: '④ Who 當主詞',
      body: 'Who likes math?（誰喜歡數學？）\n' +
            '⚠ Who 本身當主詞時，後面直接接動詞，\n' +
            '而且動詞當第三人稱單數處理（likes）。',
      viz: { type: 'sentence', label: 'Who 當主詞', items: [
        { t: 'Who', r: '疑問詞兼主詞' }, { t: 'likes', r: '動詞加 s' },
        { t: 'math', r: '受詞' }],
        note: 'Who 當主詞時不用助動詞。' },
      check: {
        q: '「誰想吃蛋糕？」的正確說法是什麼？',
        options: [
          'Who wants cake?',
          'Who do want cake?',
          'Who want cake?',
          'Who is want cake?'
        ],
        answer: 0,
        why: [
          null,
          'Who 當主詞時不需要助動詞。',
          'Who 當主詞時動詞要加 s。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '⑤ Whose 問是誰的',
      body: 'Whose bag is this?（這是誰的包包？）\n' +
            '→ It is Amy’s.\n' +
            '⚠ Who 問人、Whose 問所有權，兩個不一樣。',
      viz: { type: 'compareexp',
             factor: '問的內容',
             a: { label: 'Who', note: '問「是誰」：Who is she?' },
             b: { label: 'Whose', note: '問「誰的」：Whose bag is this?' },
             same: ['發音相近，容易混淆'] },
      check: {
        q: '「這是誰的鉛筆？」應該用哪個疑問詞？',
        options: ['Whose', 'Who', 'What', 'Which one is'],
        answer: 0,
        why: [
          null,
          'Who 問的是人的身分。',
          'What 問的是東西是什麼。',
          '這個說法不是問所有權。'
        ]
      }
    },
    {
      title: '⑥ What 的常用句型',
      body: 'What time is it?（幾點了？）\n' +
            'What color is it?（什麼顏色？）\n' +
            'What day is it today?（今天星期幾？）\n' +
            '⚠ What 後面可以接名詞，變成「什麼樣的…」。',
      viz: { type: 'classify', groups: [
        { label: 'What 加名詞', items: ['What time', 'What color', 'What day'] },
        { label: 'What 單獨用', items: ['What is this?', 'What do you like?'] }] },
      check: {
        q: '「現在幾點？」的正確說法是什麼？',
        options: [
          'What time is it?',
          'What is time?',
          'What clock is it?',
          'How time is it?'
        ],
        answer: 0,
        why: [
          null,
          '問時間的固定說法要加 time 與 it。',
          'clock 是時鐘這個物品。',
          '問時間點用 What 而不是 How。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第4單元 疑問詞 Where 與 When'] = {
  intro: '問地點和時間，是找路和約時間必備的英文。',
  cards: [
    {
      title: '① Where 問地點',
      body: 'Where is the library?（圖書館在哪裡？）\n' +
            'Where do you live?（你住哪裡？）\n' +
            '⚠ be 動詞句用 Where is，一般動詞句要借 do。',
      viz: { type: 'sentence', label: 'Where 問句', items: [
        { t: 'Where', r: '疑問詞' }, { t: 'do', r: '助動詞' },
        { t: 'you live', r: '主詞加原形動詞' }],
        note: '一般動詞的問句要用 do。' },
      check: {
        q: '「你住在哪裡？」的正確說法是什麼？',
        options: [
          'Where do you live?',
          'Where you live?',
          'Where are you live?',
          'Where is you live?'
        ],
        answer: 0,
        why: [
          null,
          '一般動詞的問句需要助動詞。',
          'be 動詞不能和一般動詞並用。',
          '主詞 you 也不能配 is。'
        ]
      }
    },
    {
      title: '② 回答地點',
      body: 'Where is my bag?→ It is on the table.\n' +
            'Where do you live?→ I live in Taipei.\n' +
            '⚠ 城市用 in、街道用 on、門牌號碼用 at。',
      viz: { type: 'classify', groups: [
        { label: 'in（大範圍）', items: ['in Taipei', 'in Taiwan', 'in the room'] },
        { label: 'on（路、樓層）', items: ['on Main Street', 'on the second floor'] },
        { label: 'at（一個點）', items: ['at the door', 'at school'] }] },
      check: {
        q: '「我住在台北」的正確說法是什麼？',
        options: [
          'I live in Taipei.',
          'I live on Taipei.',
          'I live at Taipei.',
          'I live to Taipei.'
        ],
        answer: 0,
        why: [
          null,
          'on 用於街道或樓層。',
          'at 用於較小的定點。',
          'to 表示方向而不是位置。'
        ]
      }
    },
    {
      title: '③ When 問時間',
      body: 'When is your birthday?（你的生日什麼時候？）\n' +
            'When do you get up?（你什麼時候起床？）\n' +
            '⚠ When 問的是時間點或日期。',
      viz: { type: 'compareexp',
             factor: '問什麼',
             a: { label: 'Where', note: '問地點：在哪裡' },
             b: { label: 'When', note: '問時間：什麼時候' },
             same: ['都放在句首，後面接助動詞或 be 動詞'] },
      check: {
        q: '要問「你什麼時候吃晚餐？」應該用哪個疑問詞？',
        options: ['When', 'Where', 'Who', 'What'],
        answer: 0,
        why: [
          null,
          'Where 用來問地方。',
          'Who 用來問人。',
          'What 用來問東西或內容。'
        ]
      }
    },
    {
      title: '④ 時間的介系詞',
      body: 'at seven（七點）　on Monday（星期一）　in May（五月）\n' +
            '⚠ 口訣：點用 at、日用 on、月與年用 in，\n' +
            '範圍由小到大剛好是 at、on、in。',
      viz: { type: 'energyflow', steps: ['at（時刻，最小）', 'on（日期、星期）', 'in（月、年、季節，最大）'] },
      check: {
        q: '「在五月」的正確說法是什麼？',
        options: ['in May', 'on May', 'at May', 'to May'],
        answer: 0,
        why: [
          null,
          'on 用於日期與星期。',
          'at 用於具體的時刻。',
          'to 表示方向。'
        ]
      }
    },
    {
      title: '⑤ 月份',
      body: 'January、February、March、April、May、June、\n' +
            'July、August、September、October、November、December\n' +
            '⚠ 月份的字首要大寫；縮寫如 Jan.、Feb. 後面有句點。',
      viz: { type: 'classify', groups: [
        { label: '上半年', items: ['January', 'February', 'March', 'April', 'May', 'June'] },
        { label: '下半年', items: ['July', 'August', 'September', 'October', 'November', 'December'] }] },
      check: {
        q: '「二月」的正確拼法是什麼？',
        options: ['February', 'Febuary', 'Feburary', 'february'],
        answer: 0,
        why: [
          null,
          '這個拼法漏了字母 r。',
          '字母的順序不正確。',
          '月份的字首要大寫。'
        ]
      }
    },
    {
      title: '⑥ 說日期',
      body: 'My birthday is on May 5.（我的生日是五月五日。）\n' +
            '⚠ 日期用序數唸：May fifth。\n' +
            'first、second、third、fourth、fifth。',
      viz: { type: 'classify', groups: [
        { label: '基數（數量）', items: ['one', 'two', 'three', 'five'] },
        { label: '序數（順序、日期）', items: ['first', 'second', 'third', 'fifth'] }] },
      check: {
        q: '說日期「五月三日」時，數字 3 要怎麼唸？',
        options: [
          'third（序數）',
          'three（基數）',
          'three time',
          'thirty'
        ],
        answer: 0,
        why: [
          null,
          '日期要用序數而不是基數。',
          '這個說法不符合英文用法。',
          'thirty 是三十，數字不對。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第5單元 職業'] = {
  intro: '認識各種工作的英文，也學會怎麼問別人做什麼。',
  cards: [
    {
      title: '① 常見職業',
      body: 'teacher（老師）　doctor（醫生）　nurse（護理師）\n' +
            'farmer（農夫）　cook（廚師）　driver（司機）　police officer（警察）\n' +
            '⚠ 很多職業由動詞加 er 而來：teach→teacher、drive→driver。',
      viz: { type: 'classify', groups: [
        { label: '動詞加 er', items: ['teacher', 'driver', 'farmer', 'singer'] },
        { label: '其他形式', items: ['doctor', 'nurse', 'police officer'] }] },
      check: {
        q: 'drive 加上字尾變成職業，會是哪一個字？',
        options: ['driver', 'drivor', 'driving', 'drived'],
        answer: 0,
        why: [
          null,
          '這個字尾拼法不正確。',
          'driving 是動名詞，不是職業名稱。',
          '這是過去式的形式而且拼法不對。'
        ]
      }
    },
    {
      title: '② 問職業',
      body: 'What do you do?（你做什麼工作？）\n' +
            'What does your father do?\n' +
            '→ He is a doctor.\n' +
            '⚠ 回答時職業前面要加冠詞 a 或 an。',
      viz: { type: 'sentence', label: '回答職業', items: [
        { t: 'He is', r: 'be 動詞' }, { t: 'a', r: '冠詞' }, { t: 'doctor', r: '職業' }],
        note: '單數職業前面要加冠詞。' },
      check: {
        q: '「她是護理師」的正確說法是什麼？',
        options: [
          'She is a nurse.',
          'She is nurse.',
          'She a nurse.',
          'She is the nurses.'
        ],
        answer: 0,
        why: [
          null,
          '單數職業前面要加冠詞。',
          '句子缺少 be 動詞。',
          '指一個人的職業不用複數。'
        ]
      }
    },
    {
      title: '③ 冠詞 a 和 an',
      body: 'a teacher　a doctor\n' +
            'an artist　an engineer\n' +
            '⚠ 字首發母音（a、e、i、o、u 的音）用 an。',
      viz: { type: 'compareexp',
             factor: '字首的發音',
             a: { label: 'a', note: '字首是子音：a teacher' },
             b: { label: 'an', note: '字首是母音：an artist' },
             same: ['都表示「一個」'] },
      check: {
        q: '「一位工程師」的正確說法是什麼？',
        options: [
          'an engineer',
          'a engineer',
          'the a engineer',
          'an engineers'
        ],
        answer: 0,
        why: [
          null,
          '字首是母音時要用 an。',
          '兩個冠詞不能同時使用。',
          '冠詞 an 後面要接單數。'
        ]
      }
    },
    {
      title: '④ 工作地點',
      body: 'A teacher works at a school.（老師在學校工作。）\n' +
            'A doctor works in a hospital.\n' +
            '⚠ work 是一般動詞，第三人稱單數要加 s。',
      viz: { type: 'classify', groups: [
        { label: '職業與地點', items: ['teacher／school', 'doctor／hospital', 'cook／restaurant', 'farmer／farm'] }] },
      check: {
        q: '「醫生在醫院工作」的正確說法是什麼？',
        options: [
          'A doctor works in a hospital.',
          'A doctor work in a hospital.',
          'A doctor is work in a hospital.',
          'A doctor works a hospital.'
        ],
        answer: 0,
        why: [
          null,
          '第三人稱單數的動詞要加 s。',
          'be 動詞不能和一般動詞並用。',
          '句子缺少介系詞。'
        ]
      }
    },
    {
      title: '⑤ 職業在做什麼',
      body: 'A teacher teaches students.（老師教學生。）\n' +
            'A cook makes food.\n' +
            '⚠ 描述職業的工作內容時，用現在簡單式。',
      viz: { type: 'sentence', label: '描述工作', items: [
        { t: 'A teacher', r: '職業' }, { t: 'teaches', r: '動詞加 es' },
        { t: 'students', r: '受詞' }],
        note: '陳述常態時用現在簡單式。' },
      check: {
        q: '「廚師做食物」的正確說法是什麼？',
        options: [
          'A cook makes food.',
          'A cook make food.',
          'A cook making food.',
          'A cook is make food.'
        ],
        answer: 0,
        why: [
          null,
          '第三人稱單數的動詞要加 s。',
          '這個句子缺少 be 動詞才能用 ing。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '⑥ 我的志願',
      body: 'I want to be a teacher.（我想當老師。）\n' +
            '⚠ want to be 後面接職業；\n' +
            'to be 的 be 是原形，不能改成 am 或 is。',
      viz: { type: 'sentence', label: '說志願', items: [
        { t: 'I want', r: '我想要' }, { t: 'to be', r: '成為（原形）' },
        { t: 'a teacher', r: '職業' }],
        note: 'want to 後面接原形動詞。' },
      check: {
        q: '「我想當醫生」的正確說法是什麼？',
        options: [
          'I want to be a doctor.',
          'I want to am a doctor.',
          'I want be a doctor.',
          'I want to be doctor.'
        ],
        answer: 0,
        why: [
          null,
          'to 後面要接原形動詞 be。',
          'want 後面要加 to。',
          '單數職業前面要加冠詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第6單元 交通工具'] = {
  intro: '怎麼去學校、怎麼去旅行，都要用到交通工具的英文。',
  cards: [
    {
      title: '① 常見交通工具',
      body: 'bus（公車）　car（汽車）　bike（腳踏車）　train（火車）\n' +
            'MRT（捷運）　plane（飛機）　ship（船）　scooter（機車）\n' +
            '⚠ 這些都是可數名詞，複數要加 s。',
      viz: { type: 'classify', groups: [
        { label: '陸上', items: ['bus', 'car', 'bike', 'train'] },
        { label: '海上與空中', items: ['ship', 'boat', 'plane'] }] },
      check: {
        q: '「火車」的英文是什麼？',
        options: ['train', 'plane', 'ship', 'bus'],
        answer: 0,
        why: [
          null,
          'plane 指的是飛機。',
          'ship 指的是船。',
          'bus 指的是公車。'
        ]
      }
    },
    {
      title: '② 用 by 說交通方式',
      body: 'I go to school by bus.（我搭公車上學。）\n' +
            'by car、by train、by bike\n' +
            '⚠ by 後面的交通工具不加冠詞、也不加 s。',
      viz: { type: 'sentence', label: '說交通方式', items: [
        { t: 'I go to school', r: '去哪裡' }, { t: 'by bus', r: '交通方式（不加冠詞）' }],
        note: 'by 後面直接接交通工具。' },
      check: {
        q: '「我搭火車去」的正確說法是什麼？',
        options: [
          'I go by train.',
          'I go by a train.',
          'I go by trains.',
          'I go by the a train.'
        ],
        answer: 0,
        why: [
          null,
          'by 後面不加冠詞。',
          'by 後面用單數形。',
          '兩個冠詞不能同時使用。'
        ]
      }
    },
    {
      title: '③ 走路的特殊說法',
      body: 'I walk to school.（我走路上學。）\n' +
            '＝ I go to school on foot.\n' +
            '⚠ 走路不用 by，要說 on foot 或直接用動詞 walk。',
      viz: { type: 'compareexp',
             factor: '怎麼表達走路',
             a: { label: 'walk', note: '直接用動詞：I walk to school.' },
             b: { label: 'on foot', note: '片語：go to school on foot' },
             same: ['意思相同，都是走路去'] },
      check: {
        q: '「走路去」的正確說法是什麼？',
        options: [
          'on foot',
          'by foot',
          'by walk',
          'on walking'
        ],
        answer: 0,
        why: [
          null,
          '走路的固定片語用 on 而不是 by。',
          'walk 是動詞，不能放在 by 後面。',
          '這個說法不是固定用法。'
        ]
      }
    },
    {
      title: '④ 問怎麼去',
      body: 'How do you go to school?（你怎麼上學？）\n' +
            '→ I go by MRT.\n' +
            '⚠ How 問方式或方法。',
      viz: { type: 'sentence', label: 'How 問方式', items: [
        { t: 'How', r: '疑問詞（方式）' }, { t: 'do you', r: '助動詞加主詞' },
        { t: 'go to school', r: '動作' }],
        note: 'How 用來問「怎麼做」。' },
      check: {
        q: '要問「你怎麼去公園？」應該用哪個疑問詞？',
        options: ['How', 'What', 'Where', 'Who'],
        answer: 0,
        why: [
          null,
          'What 用來問東西或內容。',
          'Where 用來問地方。',
          'Who 用來問人。'
        ]
      }
    },
    {
      title: '⑤ 搭與騎',
      body: 'take the bus（搭公車）　ride a bike（騎腳踏車）\n' +
            'drive a car（開車）\n' +
            '⚠ 跨坐的用 ride，自己操作方向盤的用 drive。',
      viz: { type: 'classify', groups: [
        { label: 'take（搭乘）', items: ['take the bus', 'take the MRT', 'take a taxi'] },
        { label: 'ride（跨坐）', items: ['ride a bike', 'ride a horse'] },
        { label: 'drive（駕駛）', items: ['drive a car', 'drive a truck'] }] },
      check: {
        q: '「騎腳踏車」的正確說法是什麼？',
        options: [
          'ride a bike',
          'drive a bike',
          'take a bike',
          'sit a bike'
        ],
        answer: 0,
        why: [
          null,
          'drive 用於汽車這類有方向盤的車。',
          'take 用於搭乘大眾運輸。',
          'sit 是坐下，不用來說騎車。'
        ]
      }
    },
    {
      title: '⑥ 交通安全',
      body: 'Stop at the red light.（紅燈要停。）\n' +
            'Wear a helmet.（要戴安全帽。）\n' +
            'Look both ways.（左右都要看。）\n' +
            '⚠ 這些都是祈使句，用動詞開頭。',
      viz: { type: 'energyflow', steps: ['先停下來', '左右看', '綠燈再走', '走斑馬線'] },
      check: {
        q: '過馬路前最重要的動作是什麼？',
        options: [
          '先停下來看左右有沒有車',
          '直接跑過去',
          '低頭看手機',
          '跟著人群衝'
        ],
        answer: 0,
        why: [
          null,
          '跑過馬路來不及反應很危險。',
          '看手機會忽略周圍的車。',
          '跟著別人走不代表安全。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第7單元 房間與家具'] = {
  intro: '介紹自己的家和房間，是很實用的生活英文。',
  cards: [
    {
      title: '① 家裡的房間',
      body: 'living room（客廳）　bedroom（臥室）　kitchen（廚房）\n' +
            'bathroom（浴室）　dining room（餐廳）\n' +
            '⚠ 很多都是兩個字合成的：bed 加 room。',
      viz: { type: 'classify', groups: [
        { label: '合成字', items: ['bedroom', 'bathroom', 'classroom'] },
        { label: '兩個字分開寫', items: ['living room', 'dining room'] }] },
      check: {
        q: '「廚房」的英文是什麼？',
        options: ['kitchen', 'bedroom', 'bathroom', 'living room'],
        answer: 0,
        why: [
          null,
          'bedroom 指的是臥室。',
          'bathroom 指的是浴室。',
          'living room 指的是客廳。'
        ]
      }
    },
    {
      title: '② 家具',
      body: 'bed（床）　desk（書桌）　chair（椅子）　table（桌子）\n' +
            'sofa（沙發）　lamp（檯燈）　closet（衣櫥）\n' +
            '⚠ desk 是書桌、table 是餐桌或一般桌子。',
      viz: { type: 'classify', groups: [
        { label: '坐與躺', items: ['bed', 'chair', 'sofa'] },
        { label: '放東西', items: ['desk', 'table', 'closet'] }] },
      check: {
        q: '寫功課用的桌子英文是什麼？',
        options: ['desk', 'table', 'chair', 'closet'],
        answer: 0,
        why: [
          null,
          'table 多指餐桌或一般桌子。',
          'chair 是椅子。',
          'closet 是衣櫥。'
        ]
      }
    },
    {
      title: '③ 說東西在哪裡',
      body: 'The lamp is on the desk.（檯燈在書桌上。）\n' +
            'The ball is under the bed.（球在床下。）\n' +
            '⚠ in、on、under、next to、behind 描述位置。',
      viz: { type: 'sentence', label: '說位置', items: [
        { t: 'The lamp', r: '東西' }, { t: 'is', r: 'be 動詞' },
        { t: 'on the desk', r: '位置' }],
        note: '介系詞加地點說明位置。' },
      check: {
        q: '「貓在沙發下面」的正確說法是什麼？',
        options: [
          'The cat is under the sofa.',
          'The cat is on the sofa.',
          'The cat under the sofa.',
          'The cat is sofa under.'
        ],
        answer: 0,
        why: [
          null,
          'on 表示在上面。',
          '句子缺少 be 動詞。',
          '介系詞要放在名詞前面。'
        ]
      }
    },
    {
      title: '④ There is 描述房間',
      body: 'There is a bed in my room.（我房間裡有一張床。）\n' +
            'There are two chairs.（有兩張椅子。）\n' +
            '⚠ 介紹房間裡有什麼，最常用這個句型。',
      viz: { type: 'compareexp',
             factor: '後面的名詞',
             a: { label: 'There is', note: '接單數或不可數' },
             b: { label: 'There are', note: '接複數' },
             same: ['都在說某處有什麼'] },
      check: {
        q: '「我的房間裡有兩張書桌」的正確說法是什麼？',
        options: [
          'There are two desks in my room.',
          'There is two desks in my room.',
          'There have two desks in my room.',
          'There are two desk in my room.'
        ],
        answer: 0,
        why: [
          null,
          '後面接複數要用 are。',
          '英文表示存在不用 have。',
          '有數字兩張時名詞要用複數。'
        ]
      }
    },
    {
      title: '⑤ 在家裡做什麼',
      body: 'I sleep in my bedroom.（我在臥室睡覺。）\n' +
            'We eat in the dining room.\n' +
            'My mom cooks in the kitchen.\n' +
            '⚠ 在某個房間裡用 in。',
      viz: { type: 'classify', groups: [
        { label: '房間與活動', items: ['bedroom／sleep', 'kitchen／cook', 'living room／watch TV', 'bathroom／take a shower'] }] },
      check: {
        q: '「我在客廳看電視」的正確說法是什麼？',
        options: [
          'I watch TV in the living room.',
          'I watch TV on the living room.',
          'I watch TV at living room.',
          'I am watch TV in the living room.'
        ],
        answer: 0,
        why: [
          null,
          '在房間裡面要用 in。',
          '這裡少了冠詞，介系詞也不對。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '⑥ 介紹我的房間',
      body: 'This is my room. It is small but clean.\n' +
            'There is a bed and a desk. I like my room.\n' +
            '⚠ 介紹一個地方的順序：先說是什麼 → 再描述 → 說有什麼 → 說感受。',
      viz: { type: 'energyflow', steps: ['這是我的房間', '房間是什麼樣子', '裡面有什麼', '我的感覺'] },
      check: {
        q: '介紹自己的房間時，比較清楚的說法順序是什麼？',
        options: [
          '先說這是什麼地方，再描述樣子與東西',
          '只說裡面有什麼',
          '只說自己的感覺',
          '把所有句子都用 and 連在一起'
        ],
        answer: 0,
        why: [
          null,
          '沒有開頭聽的人會不知道在說哪裡。',
          '只說感覺讓人無法想像畫面。',
          '句子太長反而不容易聽懂。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第8單元 情緒與感受'] = {
  intro: '說出自己的心情，也學會關心別人。',
  cards: [
    {
      title: '① 基本情緒',
      body: 'happy（開心）　sad（難過）　angry（生氣）\n' +
            'tired（累）　excited（興奮）　scared（害怕）\n' +
            '⚠ 這些都是形容詞，要配 be 動詞。',
      viz: { type: 'classify', groups: [
        { label: '正面', items: ['happy', 'excited', 'glad'] },
        { label: '負面', items: ['sad', 'angry', 'scared', 'tired'] }] },
      check: {
        q: '「我很難過」的正確說法是什麼？',
        options: [
          'I am sad.',
          'I sad.',
          'I have sad.',
          'I am sadly.'
        ],
        answer: 0,
        why: [
          null,
          '形容詞句需要 be 動詞。',
          '感受用 be 動詞而不是 have。',
          'sadly 是副詞，這裡要用形容詞。'
        ]
      }
    },
    {
      title: '② 問對方的心情',
      body: 'How are you?（你好嗎？）\n' +
            'Are you OK?（你還好嗎？）\n' +
            'What is wrong?（怎麼了？）\n' +
            '⚠ 看到朋友不開心，可以主動關心。',
      viz: { type: 'classify', groups: [
        { label: '一般問候', items: ['How are you?', 'How is it going?'] },
        { label: '關心對方', items: ['Are you OK?', 'What is wrong?'] }] },
      check: {
        q: '看到同學一個人在哭，可以先說什麼？',
        options: [
          'Are you OK? What is wrong?',
          'Go away.',
          'Do not cry, it is stupid.',
          'It is not my problem.'
        ],
        answer: 0,
        why: [
          null,
          '叫人走開會讓對方更難過。',
          '批評別人的感受並不恰當。',
          '這樣說會讓對方覺得被冷落。'
        ]
      }
    },
    {
      title: '③ 說原因',
      body: 'I am happy because it is my birthday.\n' +
            'She is sad because her dog is sick.\n' +
            '⚠ because 後面要接完整的句子。',
      viz: { type: 'sentence', label: '說原因', items: [
        { t: 'I am happy', r: '心情' }, { t: 'because', r: '因為' },
        { t: 'it is my birthday', r: '原因（完整句）' }],
        note: 'because 後面要接完整的句子。' },
      check: {
        q: '「我很累，因為我昨天沒睡好」的關鍵連接詞是什麼？',
        options: [
          'because，用來說明原因',
          'but，用來表示轉折',
          'and，用來並列',
          'or，用來選擇'
        ],
        answer: 0,
        why: [
          null,
          'but 表示前後相反。',
          'and 只是把兩件事接起來，沒有因果。',
          'or 用在兩者選一的情況。'
        ]
      }
    },
    {
      title: '④ 安慰別人',
      body: 'Do not worry.（別擔心。）\n' +
            'Cheer up!（振作一點！）\n' +
            'I am here for you.（我在這裡陪你。）\n' +
            '⚠ 安慰的話多用祈使句，直接以動詞開頭。',
      viz: { type: 'classify', groups: [
        { label: '安慰', items: ['Do not worry.', 'It is OK.', 'Cheer up!'] },
        { label: '陪伴', items: ['I am here for you.', 'Let me help you.'] }] },
      check: {
        q: '同學考試考不好很難過，比較恰當的話是什麼？',
        options: [
          'Do not worry. You can try again.',
          'You are so bad at this.',
          'I got a better score.',
          'That is your problem.'
        ],
        answer: 0,
        why: [
          null,
          '批評能力會傷害對方。',
          '比較分數會讓對方更難受。',
          '這樣說是拒絕關心。'
        ]
      }
    },
    {
      title: '⑤ 表達感謝與道歉',
      body: 'Thank you for your help.（謝謝你的幫忙。）\n' +
            'I am sorry.（對不起。）→ That is OK.（沒關係。）\n' +
            '⚠ Thank you for 後面接名詞或動詞 ing。',
      viz: { type: 'sentence', label: '道謝', items: [
        { t: 'Thank you for', r: '謝謝你的' }, { t: 'helping me', r: '動詞 ing' }],
        note: 'for 後面接名詞或動詞 ing。' },
      check: {
        q: '「謝謝你幫我」的正確說法是什麼？',
        options: [
          'Thank you for helping me.',
          'Thank you for help me.',
          'Thank you help me.',
          'Thank you to helping me.'
        ],
        answer: 0,
        why: [
          null,
          'for 後面的動詞要加 ing。',
          '句子缺少介系詞 for。',
          'for 不能和 to 一起用。'
        ]
      }
    },
    {
      title: '⑥ 情緒的兩種形容詞',
      body: 'I am excited.（我覺得興奮。）\n' +
            'The game is exciting.（這個遊戲很刺激。）\n' +
            '⚠ ed 結尾說人的感受，ing 結尾說事物給人的感覺。',
      viz: { type: 'compareexp',
             factor: '字尾',
             a: { label: 'ed 結尾', note: '形容人：I am bored.' },
             b: { label: 'ing 結尾', note: '形容事物：The book is boring.' },
             same: ['同一個字根，位置不同意思就不同'] },
      check: {
        q: '「這本書很無聊」的正確說法是什麼？',
        options: [
          'The book is boring.',
          'The book is bored.',
          'The book is boredom.',
          'The book bores.'
        ],
        answer: 0,
        why: [
          null,
          'ed 結尾用來形容人的感受。',
          'boredom 是名詞，不能當形容詞用。',
          '這個說法在這裡不自然。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|二下|第9單元 節慶與祝賀'] = {
  intro: '過節時說一句祝福，是最溫暖的英文。',
  cards: [
    {
      title: '① 常見節日',
      body: 'Chinese New Year（農曆新年）　Christmas（聖誕節）\n' +
            'Halloween（萬聖節）　Mid-Autumn Festival（中秋節）\n' +
            '⚠ 節日的字首要大寫。',
      viz: { type: 'classify', groups: [
        { label: '台灣的節日', items: ['Chinese New Year', 'Mid-Autumn Festival', 'Dragon Boat Festival'] },
        { label: '西方的節日', items: ['Christmas', 'Halloween', 'Easter'] }] },
      check: {
        q: '節日的英文名稱在書寫時要注意什麼？',
        options: [
          '每個主要字的字首都要大寫',
          '一律小寫',
          '要加引號',
          '不能超過兩個字'
        ],
        answer: 0,
        why: [
          null,
          '專有名詞的字首要大寫。',
          '節日名稱不需要加引號。',
          '節日名稱可以有很多個字。'
        ]
      }
    },
    {
      title: '② 祝賀語',
      body: 'Happy New Year!（新年快樂！）\n' +
            'Merry Christmas!（聖誕快樂！）\n' +
            'Happy Birthday!（生日快樂！）\n' +
            '⚠ 聖誕節習慣用 Merry，其他多半用 Happy。',
      viz: { type: 'classify', groups: [
        { label: 'Happy 開頭', items: ['Happy New Year', 'Happy Birthday', 'Happy Halloween'] },
        { label: 'Merry 開頭', items: ['Merry Christmas'] }] },
      check: {
        q: '「聖誕快樂」最常見的說法是什麼？',
        options: [
          'Merry Christmas!',
          'Happy Christmas Day!',
          'Good Christmas!',
          'Nice Christmas!'
        ],
        answer: 0,
        why: [
          null,
          '英美最常用的說法是 Merry Christmas。',
          '這個說法不是慣用的祝賀語。',
          '這個說法不是慣用的祝賀語。'
        ]
      }
    },
    {
      title: '③ 節日的活動',
      body: 'We eat moon cakes on Mid-Autumn Festival.\n' +
            'We get red envelopes on Chinese New Year.\n' +
            '⚠ 特定節日前面用 on。',
      viz: { type: 'classify', groups: [
        { label: '節日與活動', items: ['新年／紅包', '中秋／月餅', '聖誕／禮物', '萬聖／糖果'] }] },
      check: {
        q: '「在中秋節」的正確介系詞是什麼？',
        options: ['on', 'in', 'at', 'to'],
        answer: 0,
        why: [
          null,
          'in 用於月份、年份或季節。',
          'at 用於具體的時刻。',
          'to 表示方向。'
        ]
      }
    },
    {
      title: '④ 送禮與收禮',
      body: 'This is for you.（這是給你的。）\n' +
            'Thank you! I love it.（謝謝！我很喜歡。）\n' +
            '⚠ 收到禮物時說一句喜歡，對方會很開心。',
      viz: { type: 'energyflow', steps: ['This is for you.', 'Thank you!', 'I love it.', 'You are welcome.'] },
      check: {
        q: '收到朋友送的禮物時，最好的回應是什麼？',
        options: [
          'Thank you! I love it.',
          'I already have one.',
          'It is too small.',
          'Why this one?'
        ],
        answer: 0,
        why: [
          null,
          '這樣說會讓送禮的人尷尬。',
          '批評禮物很不禮貌。',
          '質疑禮物會傷害對方的心意。'
        ]
      }
    },
    {
      title: '⑤ 邀請',
      body: 'Come to my party!（來我的派對！）\n' +
            'Would you like to come?（你想來嗎？）\n' +
            '→ Sure, I would love to.（好啊，我很樂意。）\n' +
            '⚠ Would you like to 是有禮貌的邀請句型。',
      viz: { type: 'sentence', label: '邀請', items: [
        { t: 'Would you like', r: '你想要嗎（禮貌）' }, { t: 'to come', r: 'to 加原形動詞' }],
        note: 'would like to 後面接原形動詞。' },
      check: {
        q: '「你想來我的生日派對嗎？」的正確說法是什麼？',
        options: [
          'Would you like to come to my birthday party?',
          'Would you like come to my party?',
          'Would you to like come?',
          'You like come my party?'
        ],
        answer: 0,
        why: [
          null,
          'would like 後面要加 to。',
          '這個語序不正確。',
          '句子缺少助動詞，語序也不對。'
        ]
      }
    },
    {
      title: '⑥ 寫一張卡片',
      body: 'Dear Amy,（親愛的 Amy，）\n' +
            'Happy Birthday! I hope you have a great day.\n' +
            'Your friend,（你的朋友，）\n' +
            'Ben\n' +
            '⚠ 卡片的格式：稱呼 → 內容 → 署名。',
      viz: { type: 'energyflow', steps: ['Dear（稱呼）', '祝賀與內容', 'Your friend（結尾語）', '署名'] },
      check: {
        q: '英文卡片的開頭稱呼通常怎麼寫？',
        options: [
          'Dear 加上對方的名字，後面加逗號',
          '直接寫內容',
          '先寫自己的名字',
          '寫上日期就好'
        ],
        answer: 0,
        why: [
          null,
          '少了稱呼會顯得不夠禮貌。',
          '自己的名字要放在最後署名。',
          '日期不能取代稱呼。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第1單元 Be 動詞現在式'] = {
  intro: 'be 動詞是英文文法的第一塊地基，句型變化幾乎都從這裡長出來。',
  cards: [
    {
      title: '① 三個形式怎麼分',
      body: '主詞決定 be 動詞：\n' +
            'I → am　　he／she／it／單數名詞 → is　　you／we／they／複數名詞 → are\n' +
            '⚠ 判斷的關鍵不是「人」，而是「主詞是單數還是複數」，\n' +
            '只有 I 和 you 是例外要單獨記。',
      viz: { type: 'classify', groups: [
        { label: 'am', items: ['I'] },
        { label: 'is', items: ['he', 'she', 'it', 'my brother', 'the book'] },
        { label: 'are', items: ['you', 'we', 'they', 'the books'] }] },
      check: {
        q: 'My brother and I ___ students. 空格要填什麼？',
        options: ['are', 'am', 'is', 'be'],
        answer: 0,
        why: [
          null,
          'am 只跟單獨的 I 搭配。',
          '主詞是兩個人，屬於複數。',
          'be 是原形，不能直接當現在式使用。'
        ]
      }
    },
    {
      title: '② be 動詞的兩種語意',
      body: '① 表示「是」：連接主詞與身分、性質\n' +
            '　 She is a nurse.／The soup is hot.\n' +
            '② 表示「在」：連接主詞與地點\n' +
            '　 My keys are in the drawer.\n' +
            '⚠ 兩種用法共用同一套變化，不必分開背。',
      viz: { type: 'compareexp',
             factor: 'be 動詞後面接什麼',
             a: { label: '接名詞或形容詞', note: '表示「是」：She is a nurse.' },
             b: { label: '接地點副詞或介系詞片語', note: '表示「在」：She is at home.' },
             same: ['都不表示動作，只做連接'] },
      check: {
        q: 'The cat ___ under the table. 空格要填什麼？',
        options: ['is', 'are', 'am', 'do'],
        answer: 0,
        why: [
          null,
          '主詞 the cat 是單數。',
          'am 只跟 I 搭配。',
          'do 是助動詞，不能表示存在。'
        ]
      }
    },
    {
      title: '③ 否定與縮寫',
      body: 'is not → isn’t　　are not → aren’t　　am not（沒有縮寫）\n' +
            'She isn’t here.／They aren’t ready.／I’m not tired.\n' +
            '⚠ am not 只能縮 I am 那一半，寫成 I’m not。',
      viz: { type: 'classify', groups: [
        { label: '可縮寫', items: ['isn’t', 'aren’t', 'I’m', 'he’s'] },
        { label: '沒有縮寫', items: ['amn’t（不存在）'] }] },
      check: {
        q: '下列哪一個縮寫是錯的？',
        options: ['I amn’t ready.', 'She isn’t ready.', 'They aren’t ready.', 'I’m not ready.'],
        answer: 0,
        why: [
          null,
          'is not 可以縮成 isn’t。',
          'are not 可以縮成 aren’t。',
          'am not 要縮成 I’m not。'
        ]
      }
    },
    {
      title: '④ 疑問句與簡答',
      body: 'Is she a teacher?→ Yes, she is.／No, she isn’t.\n' +
            'Are you ready?→ Yes, I am.（★ 不可縮成 Yes, I’m.）\n' +
            '⚠ 肯定簡答不縮寫，否定簡答才縮寫，這是固定規則。',
      viz: { type: 'energyflow', steps: ['She is a teacher.', 'be 動詞移到句首', 'Is she a teacher?', 'Yes, she is.'] },
      check: {
        q: 'Are they your classmates? 的肯定簡答是什麼？',
        options: [
          'Yes, they are.',
          'Yes, they’re.',
          'Yes, they do.',
          'Yes, are they.'
        ],
        answer: 0,
        why: [
          null,
          '肯定簡答不使用縮寫。',
          '問句用 be 動詞，簡答就用 be 動詞。',
          '簡答不用疑問句的語序。'
        ]
      }
    },
    {
      title: '⑤ 主詞動詞一致',
      body: '主詞是名詞時，要先判斷單複數：\n' +
            'The book on the shelves is new.（主詞是 book，不是 shelves）\n' +
            '⚠ 主詞後面接的修飾語不影響 be 動詞，\n' +
            '要找出真正的主詞（中心名詞）再決定用 is 還是 are。',
      viz: { type: 'sentence', label: '找出真正的主詞', items: [
        { t: 'The book', r: '真正的主詞（單數）' },
        { t: 'on the shelves', r: '修飾語（不影響動詞）' },
        { t: 'is new', r: 'be 動詞跟主詞一致' }],
        note: '介系詞片語不會改變主詞的單複數。' },
      check: {
        q: 'The pictures on the wall ___ beautiful. 空格要填什麼？',
        options: ['are', 'is', 'am', 'be'],
        answer: 0,
        why: [
          null,
          '真正的主詞是複數的 pictures。',
          'am 只跟 I 搭配。',
          'be 是原形，句子需要現在式。'
        ]
      }
    },
    {
      title: '⑥ 最常見的錯誤',
      body: '✗ I am go to school.（be 動詞和一般動詞並用）\n' +
            '✗ He is have a car.（同上）\n' +
            '⚠ 一個句子只能有一個主要動詞。\n' +
            '有動作 → 用一般動詞；沒有動作（身分、性質、地點）→ 用 be 動詞。',
      viz: { type: 'compareexp',
             factor: '這個句子有沒有動作',
             a: { label: '有動作', note: 'I go to school.（不加 be 動詞）' },
             b: { label: '沒有動作', note: 'I am at school.（要用 be 動詞）' },
             same: ['都是現在式，一個句子只有一個主要動詞'] },
      check: {
        q: '下列哪一句文法正確？',
        options: [
          'She lives in Tainan.',
          'She is live in Tainan.',
          'She is lives in Tainan.',
          'She live in Tainan.'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞不能和一般動詞並用。',
          '這句同時犯了兩個錯誤。',
          '第三人稱單數的動詞要加 s。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第2單元 代名詞與所有格'] = {
  intro: '同一個人有五種說法，弄清楚「放在哪裡」就不會用錯。',
  cards: [
    {
      title: '① 五欄表',
      body: '主格／所有格／受格／所有代名詞／反身代名詞\n' +
            'I／my／me／mine／myself\n' +
            'he／his／him／his／himself\n' +
            'they／their／them／theirs／themselves\n' +
            '⚠ 先記位置，再記形式：位置決定要用哪一欄。',
      viz: { type: 'classify', groups: [
        { label: '主格（當主詞）', items: ['I', 'he', 'she', 'we', 'they'] },
        { label: '所有格（後接名詞）', items: ['my', 'his', 'her', 'our', 'their'] },
        { label: '受格（動詞或介系詞後）', items: ['me', 'him', 'her', 'us', 'them'] }] },
      check: {
        q: 'This is a photo of ___. 空格要填哪一個？',
        options: ['us', 'we', 'our', 'ours'],
        answer: 0,
        why: [
          null,
          '介系詞後面要用受格。',
          '所有格後面必須接名詞。',
          '這裡的空格前面已有 of，語意會重複。'
        ]
      }
    },
    {
      title: '② 主格與受格的位置',
      body: '主格在動詞前面（當主詞）：He called me.\n' +
            '受格在動詞或介系詞後面：I called him.\n' +
            '⚠ 中文的「他」不分主受，英文分，\n' +
            '判斷方法：這個人是「做的人」還是「被做的對象」。',
      viz: { type: 'sentence', label: '主格與受格', items: [
        { t: 'He', r: '主格（做動作的人）' }, { t: 'called', r: '動詞' },
        { t: 'me', r: '受格（被打電話的人）' }],
        note: '動詞前用主格，動詞後用受格。' },
      check: {
        q: 'My teacher helped ___ with my homework. 空格要填什麼？',
        options: ['me', 'I', 'my', 'mine'],
        answer: 0,
        why: [
          null,
          '動詞後面要用受格。',
          '所有格後面必須接名詞。',
          '所有代名詞不能當動詞的受詞用在這裡。'
        ]
      }
    },
    {
      title: '③ 所有格與所有代名詞',
      body: '所有格後面一定接名詞：This is my bike.\n' +
            '所有代名詞後面不接名詞：This bike is mine.\n' +
            '⚠ 換句話說：mine ＝ my bike，本身已經包含名詞。',
      viz: { type: 'compareexp',
             factor: '後面接不接名詞',
             a: { label: 'my（所有格）', note: 'my bike — 一定要有名詞' },
             b: { label: 'mine（所有代名詞）', note: 'It is mine. — 不再接名詞' },
             same: ['都表示這是我的'] },
      check: {
        q: 'Whose pen is this?— It is ___. 空格要填什麼？',
        options: ['hers', 'her', 'she', 'her’s'],
        answer: 0,
        why: [
          null,
          'her 是所有格，後面要接名詞。',
          'she 是主格，不表示所有。',
          '所有代名詞 hers 不加撇號。'
        ]
      }
    },
    {
      title: '④ 名詞的所有格',
      body: '單數：Amy’s book　　My father’s car\n' +
            '複數字尾有 s：the students’ books（撇號放 s 後面）\n' +
            '複數字尾沒有 s：the children’s books\n' +
            '⚠ 判斷順序：先寫出名詞的複數，再決定撇號放哪裡。',
      viz: { type: 'classify', groups: [
        { label: '加撇號 s', items: ['Amy’s', 'the boy’s', 'children’s'] },
        { label: '只加撇號', items: ['the boys’', 'the teachers’'] }] },
      check: {
        q: '「那些學生的教室」的正確寫法是什麼？',
        options: [
          'the students’ classroom',
          'the student’s classroom',
          'the students classroom',
          'the students’s classroom'
        ],
        answer: 0,
        why: [
          null,
          '這個寫法表示只有一位學生。',
          '所有格需要撇號。',
          '複數字尾已有 s 時不再加 s。'
        ]
      }
    },
    {
      title: '⑤ its 與 it’s',
      body: 'its ＝ 它的（所有格，沒有撇號）\n' +
            'it’s ＝ it is 或 it has 的縮寫\n' +
            '⚠ 檢查方法：把 it is 代回句子，讀得通就用 it’s。',
      viz: { type: 'compareexp',
             factor: '代回 it is 通不通',
             a: { label: 'it’s', note: 'It’s cold.→ It is cold. 通' },
             b: { label: 'its', note: 'Its tail is long.→ It is tail… 不通' },
             same: ['發音完全相同'] },
      check: {
        q: 'The dog wagged ___ tail. 空格要填什麼？',
        options: ['its', 'it’s', 'it is', 'its’'],
        answer: 0,
        why: [
          null,
          '有撇號的是 it is 的縮寫。',
          '把 it is 代回去語意不通。',
          '這個寫法並不存在。'
        ]
      }
    },
    {
      title: '⑥ 反身代名詞',
      body: 'myself、yourself、himself、herself、ourselves、themselves\n' +
            'He hurt himself.（動作回到自己身上）\n' +
            'I did it myself.（強調「親自」）\n' +
            '⚠ 單數字尾是 self，複數字尾是 selves。',
      viz: { type: 'classify', groups: [
        { label: '單數（self）', items: ['myself', 'yourself', 'himself', 'herself'] },
        { label: '複數（selves）', items: ['ourselves', 'yourselves', 'themselves'] }] },
      check: {
        q: 'They enjoyed ___ at the party. 空格要填什麼？',
        options: ['themselves', 'themself', 'them', 'their'],
        answer: 0,
        why: [
          null,
          '複數的反身代名詞字尾是 selves。',
          '這裡的動作回到主詞身上，要用反身代名詞。',
          '所有格後面必須接名詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第3單元 一般動詞現在式'] = {
  intro: '一般動詞的現在式，關鍵只有兩件事：什麼時候加 s、否定與疑問怎麼變。',
  cards: [
    {
      title: '① 現在簡單式在說什麼',
      body: '① 習慣：I get up at six every day.\n' +
            '② 事實或不變的道理：Water boils at 100 degrees.\n' +
            '⚠ 現在簡單式不是「現在正在做」，\n' +
            '而是「經常如此」或「本來就這樣」。',
      viz: { type: 'tense', verb: 'play', highlight: '現在簡單式', pick: false },
      check: {
        q: '下列哪一句適合用現在簡單式？',
        options: [
          'I go to school every day.',
          'Look! He is running.',
          'I bought a book yesterday.',
          'I will call you tonight.'
        ],
        answer: 0,
        why: [
          null,
          '有 Look 表示此刻，要用進行式。',
          '有 yesterday 要用過去式。',
          '有 tonight 且是計畫，要用未來式。'
        ]
      }
    },
    {
      title: '② 第三人稱單數加 s',
      body: '主詞是 he／she／it／單數名詞時，動詞要變：\n' +
            '一般：加 s（reads、runs）\n' +
            '字尾 s／x／sh／ch／o：加 es（watches、goes、fixes）\n' +
            '子音加 y：y 改 ies（study→studies）\n' +
            '母音加 y：直接加 s（play→plays）',
      viz: { type: 'classify', groups: [
        { label: '加 s', items: ['reads', 'runs', 'plays'] },
        { label: '加 es', items: ['watches', 'goes', 'fixes'] },
        { label: 'y 改 ies', items: ['studies', 'flies', 'carries'] }] },
      check: {
        q: 'study 的第三人稱單數形是什麼？',
        options: ['studies', 'studys', 'studyes', 'study'],
        answer: 0,
        why: [
          null,
          '子音加 y 時要把 y 改成 ies。',
          '這個拼法不符合規則。',
          '第三人稱單數要有字尾變化。'
        ]
      }
    },
    {
      title: '③ 否定句',
      body: 'I／you／we／they → do not（don’t）\n' +
            'he／she／it → does not（doesn’t）\n' +
            '★ 助動詞已經標示了人稱，主要動詞回到原形：\n' +
            'He doesn’t like（不是 doesn’t likes）。',
      viz: { type: 'sentence', label: '否定的結構', items: [
        { t: 'He', r: '第三人稱單數' }, { t: 'doesn’t', r: '助動詞（已帶 s）' },
        { t: 'like', r: '原形動詞' }],
        note: 's 只出現一次，在助動詞上。' },
      check: {
        q: 'She ___ eat meat. 空格要填什麼？',
        options: ['doesn’t', 'don’t', 'isn’t', 'not'],
        answer: 0,
        why: [
          null,
          '第三人稱單數要用 doesn’t。',
          'be 動詞不能和一般動詞並用。',
          '否定句需要助動詞。'
        ]
      }
    },
    {
      title: '④ 疑問句',
      body: 'Do you like coffee?→ Yes, I do.\n' +
            'Does he play the guitar?→ No, he doesn’t.\n' +
            '⚠ 同樣的規則：助動詞帶走 s，後面用原形。',
      viz: { type: 'energyflow', steps: ['He plays the guitar.', 's 移到助動詞上', 'Does he play the guitar?', 'Yes, he does.'] },
      check: {
        q: '下列哪一個疑問句正確？',
        options: [
          'Does she work here?',
          'Does she works here?',
          'Do she work here?',
          'Is she work here?'
        ],
        answer: 0,
        why: [
          null,
          '有了 does，動詞要用原形。',
          '第三人稱單數要用 does。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '⑤ have 的變化',
      body: 'I have／you have／we have／they have\n' +
            'he has／she has／it has\n' +
            '⚠ have 的第三人稱單數是 has，不是 haves；\n' +
            '否定與疑問仍然用 does：He doesn’t have a car.',
      viz: { type: 'classify', groups: [
        { label: 'have', items: ['I', 'you', 'we', 'they'] },
        { label: 'has', items: ['he', 'she', 'it', 'my sister'] }] },
      check: {
        q: 'He ___ have any brothers. 空格要填什麼？',
        options: ['doesn’t', 'don’t', 'hasn’t', 'isn’t'],
        answer: 0,
        why: [
          null,
          '第三人稱單數要用 doesn’t。',
          '這裡的 have 是一般動詞，否定要借 does。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '⑥ 常見的時間副詞',
      body: 'always、usually、often、sometimes、seldom、never\n' +
            'every day、on Sundays、once a week\n' +
            '⚠ 看到這些字，通常就是現在簡單式的訊號。',
      viz: { type: 'energyflow', steps: ['always（總是）', 'usually（通常）', 'often（常常）', 'sometimes（有時）', 'never（從不）'] },
      check: {
        q: 'She ___ late for school.（她從不遲到）空格要填什麼？',
        options: [
          'is never',
          'never is',
          'doesn’t never',
          'is not never'
        ],
        answer: 0,
        why: [
          null,
          '頻率副詞要放在 be 動詞後面。',
          'never 本身已經是否定，不能再加否定。',
          '同一句不能有兩個否定詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第4單元 疑問詞'] = {
  intro: '五個 W 加一個 H，是英文提問的骨架。',
  cards: [
    {
      title: '① 六個疑問詞',
      body: 'What（什麼）　Who（誰）　Where（哪裡）\n' +
            'When（什麼時候）　Why（為什麼）　How（如何）\n' +
            '⚠ 疑問詞問的是「具體資訊」，\n' +
            '所以不能只用 Yes／No 回答。',
      viz: { type: 'classify', groups: [
        { label: '問人事物', items: ['What', 'Who', 'Whose'] },
        { label: '問時間地點', items: ['When', 'Where'] },
        { label: '問原因方式', items: ['Why', 'How'] }] },
      check: {
        q: '疑問詞開頭的問句，可以用 Yes 或 No 回答嗎？',
        options: [
          '不行，要回答具體的資訊',
          '可以，跟一般問句一樣',
          '只有 Why 可以',
          '只有 How 可以'
        ],
        answer: 0,
        why: [
          null,
          '疑問詞問的是資訊，不是是非。',
          'Why 問原因，要回答理由。',
          'How 問方式，要回答做法。'
        ]
      }
    },
    {
      title: '② 語序：疑問詞放最前面',
      body: '疑問詞 ＋ 助動詞／be 動詞 ＋ 主詞 ＋ 動詞\n' +
            'Where do you live?　When is your birthday?\n' +
            '⚠ 疑問詞只是「加在前面」，\n' +
            '後面仍然是完整的疑問句語序。',
      viz: { type: 'sentence', label: '疑問句語序', items: [
        { t: 'Where', r: '疑問詞' }, { t: 'do', r: '助動詞' },
        { t: 'you', r: '主詞' }, { t: 'live', r: '原形動詞' }],
        note: '疑問詞在前，後面照疑問句排列。' },
      check: {
        q: '下列哪一句語序正確？',
        options: [
          'What time does the movie start?',
          'What time the movie starts?',
          'What time start the movie?',
          'What time does the movie starts?'
        ],
        answer: 0,
        why: [
          null,
          '缺少助動詞，語序也不對。',
          '一般動詞不能直接倒裝到主詞前面。',
          '有了 does，動詞要用原形。'
        ]
      }
    },
    {
      title: '③ Who 當主詞時的特例',
      body: 'Who broke the window?（誰打破窗戶？）\n' +
            '★ Who 本身就是主詞，不用助動詞，\n' +
            '動詞直接接在後面，且視為第三人稱單數。\n' +
            '⚠ 對照：Who do you like?（Who 是受詞，就要用 do）。',
      viz: { type: 'compareexp',
             factor: 'Who 在句中的角色',
             a: { label: 'Who 當主詞', note: 'Who wants coffee?（不用助動詞）' },
             b: { label: 'Who 當受詞', note: 'Who do you like?（要用助動詞）' },
             same: ['都用 Who 開頭'] },
      check: {
        q: '「誰住在這裡？」的正確說法是什麼？',
        options: [
          'Who lives here?',
          'Who do live here?',
          'Who does lives here?',
          'Who live here?'
        ],
        answer: 0,
        why: [
          null,
          'Who 當主詞時不需要助動詞。',
          '有了 does 動詞要用原形，這裡也不需要 does。',
          'Who 當主詞時動詞視為第三人稱單數。'
        ]
      }
    },
    {
      title: '④ How 的家族',
      body: 'How old（幾歲）　How many（多少，可數）　How much（多少，不可數或價錢）\n' +
            'How long（多久／多長）　How often（多常）　How far（多遠）\n' +
            '⚠ How 加形容詞或副詞，問的是「程度」。',
      viz: { type: 'classify', groups: [
        { label: '問數量', items: ['How many', 'How much'] },
        { label: '問程度', items: ['How old', 'How long', 'How far', 'How often'] }] },
      check: {
        q: '要問「這件外套多少錢？」應該用哪一個？',
        options: [
          'How much',
          'How many',
          'How long',
          'How far'
        ],
        answer: 0,
        why: [
          null,
          'How many 問可數名詞的數量。',
          'How long 問時間長度或長短。',
          'How far 問距離。'
        ]
      }
    },
    {
      title: '⑤ How many 與 How much',
      body: 'How many books do you have?（可數 → 複數名詞）\n' +
            'How much water do you need?（不可數）\n' +
            '⚠ 判斷方法：這個名詞能不能加 s，\n' +
            '能就用 many，不能就用 much。',
      viz: { type: 'compareexp',
             factor: '名詞可不可數',
             a: { label: 'How many', note: '後接可數名詞的複數：books' },
             b: { label: 'How much', note: '後接不可數名詞：water、money' },
             same: ['都在問數量'] },
      check: {
        q: 'How ___ money do you have? 空格要填什麼？',
        options: ['much', 'many', 'long', 'old'],
        answer: 0,
        why: [
          null,
          'money 是不可數名詞。',
          'How long 問長度或時間。',
          'How old 問年齡。'
        ]
      }
    },
    {
      title: '⑥ Why 與 Because',
      body: 'Why are you late?→ Because I missed the bus.\n' +
            '⚠ Because 後面接完整的句子（主詞加動詞）；\n' +
            'Because of 後面接名詞：because of the rain。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: 'because', note: '接完整子句：because it rained' },
             b: { label: 'because of', note: '接名詞：because of the rain' },
             same: ['都在說明原因'] },
      check: {
        q: 'We stayed home ___ the typhoon. 空格要填什麼？',
        options: [
          'because of',
          'because',
          'why',
          'so'
        ],
        answer: 0,
        why: [
          null,
          'because 後面要接完整的句子。',
          'why 是疑問詞，不用在陳述句裡。',
          'so 表示結果，不是原因。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第5單元 名詞與冠詞'] = {
  intro: '英文名詞先分可數與不可數，冠詞的用法才會跟著清楚。',
  cards: [
    {
      title: '① 可數與不可數',
      body: '可數：能一個一個數，有單複數（a book／two books）\n' +
            '不可數：物質、抽象概念（water、money、information、advice）\n' +
            '⚠ 中文沒有這個區分，是台灣學生最常錯的地方。',
      viz: { type: 'classify', groups: [
        { label: '可數', items: ['book', 'apple', 'student', 'chair'] },
        { label: '不可數', items: ['water', 'money', 'information', 'advice'] }] },
      check: {
        q: '下列哪一個是不可數名詞？',
        options: ['information', 'book', 'apple', 'chair'],
        answer: 0,
        why: [
          null,
          'book 可以一本一本數。',
          'apple 可以一顆一顆數。',
          'chair 可以一張一張數。'
        ]
      }
    },
    {
      title: '② 複數的變化規則',
      body: '一般加 s：books\n' +
            '字尾 s／x／sh／ch：加 es（boxes、dishes）\n' +
            '子音加 y：y 改 ies（cities）\n' +
            'f／fe 改 ves：leaf→leaves、knife→knives\n' +
            '不規則：man→men、child→children、foot→feet',
      viz: { type: 'classify', groups: [
        { label: '加 es', items: ['boxes', 'dishes', 'watches'] },
        { label: 'y 改 ies', items: ['cities', 'babies'] },
        { label: '不規則', items: ['men', 'children', 'feet', 'teeth'] }] },
      check: {
        q: 'knife 的複數形是什麼？',
        options: ['knives', 'knifes', 'knifies', 'knife'],
        answer: 0,
        why: [
          null,
          '字尾 fe 要改成 ves。',
          '這個拼法不符合任何規則。',
          '這個名詞可數，要有複數形。'
        ]
      }
    },
    {
      title: '③ a 與 an',
      body: '看「發音」而不是看字母：\n' +
            'a university（發音以 y 的子音開頭）\n' +
            'an hour（h 不發音，實際上是母音開頭）\n' +
            '⚠ 唸出來再決定用 a 還是 an。',
      viz: { type: 'compareexp',
             factor: '判斷依據',
             a: { label: '看字母（錯）', note: 'university 開頭是 u，就用 an？' },
             b: { label: '看發音（對）', note: 'university 唸起來是子音開頭，用 a' },
             same: ['都表示「一個」'] },
      check: {
        q: '下列哪一個搭配正確？',
        options: [
          'an hour',
          'a hour',
          'an university',
          'a apple'
        ],
        answer: 0,
        why: [
          null,
          'hour 的 h 不發音，要用 an。',
          'university 唸起來是子音開頭，要用 a。',
          'apple 是母音開頭，要用 an。'
        ]
      }
    },
    {
      title: '④ the 什麼時候用',
      body: '① 前面提過的：I saw a dog. The dog was black.\n' +
            '② 雙方都知道的：Close the door.\n' +
            '③ 世界上唯一的：the sun、the moon\n' +
            '⚠ 第一次提到用 a／an，之後再提就用 the。',
      viz: { type: 'energyflow', steps: ['第一次提到：a dog', '再次提到：the dog', '雙方都知道：the door', '獨一無二：the sun'] },
      check: {
        q: 'I bought ___ book yesterday. ___ book is about space. 兩格依序要填什麼？',
        options: [
          'a … The',
          'the … A',
          'a … A',
          'the … The'
        ],
        answer: 0,
        why: [
          null,
          '第一次提到要用不定冠詞。',
          '第二次提到同一本書要用 the。',
          '第一次提到不能用 the。'
        ]
      }
    },
    {
      title: '⑤ 不加冠詞的情況',
      body: '① 泛指複數：Dogs are loyal.\n' +
            '② 泛指不可數：Water is important.\n' +
            '③ 三餐、球類運動、學科：have lunch、play basketball、study math\n' +
            '⚠ 泛指一整類時不加冠詞。',
      viz: { type: 'classify', groups: [
        { label: '不加冠詞', items: ['play basketball', 'have lunch', 'study math', 'Dogs are loyal'] },
        { label: '要加冠詞', items: ['play the piano', 'the sun'] }] },
      check: {
        q: '下列哪一個說法正確？',
        options: [
          'I play basketball after school.',
          'I play the basketball after school.',
          'I play a basketball after school.',
          'I play basketballs after school.'
        ],
        answer: 0,
        why: [
          null,
          '球類運動前面不加冠詞。',
          '這裡不是指某一顆球。',
          '運動名稱不用複數。'
        ]
      }
    },
    {
      title: '⑥ 不可數名詞怎麼計量',
      body: 'a piece of information（一則資訊）\n' +
            'a glass of water、two cups of coffee、a loaf of bread\n' +
            '⚠ 要變複數時，改的是容器或單位，\n' +
            '不可數名詞本身不加 s：two glasses of water。',
      viz: { type: 'sentence', label: '計量的結構', items: [
        { t: 'two glasses', r: '單位（變複數）' }, { t: 'of', r: '介系詞' },
        { t: 'water', r: '不可數名詞（不變）' }],
        note: '複數變在單位上，不在名詞上。' },
      check: {
        q: '「兩杯水」的正確說法是什麼？',
        options: [
          'two glasses of water',
          'two glass of waters',
          'two waters',
          'two glass of water'
        ],
        answer: 0,
        why: [
          null,
          '複數要變在單位上，water 不加 s。',
          '不可數名詞不能直接加數字與 s。',
          '單位 glass 要變成複數。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第6單元 指示代名詞'] = {
  intro: 'this、that、these、those，靠「遠近」和「單複數」兩個軸決定。',
  cards: [
    {
      title: '① 四個字的兩個軸',
      body: '　　　　近　　　遠\n' +
            '單數　this　　that\n' +
            '複數　these　those\n' +
            '⚠ 先問「幾個」，再問「遠近」，就不會選錯。',
      viz: { type: 'classify', groups: [
        { label: '近（this／these）', items: ['this book', 'these books'] },
        { label: '遠（that／those）', items: ['that book', 'those books'] }] },
      check: {
        q: '指遠處的好幾本書，應該用哪一個？',
        options: ['those', 'these', 'that', 'this'],
        answer: 0,
        why: [
          null,
          'these 指近處的多個。',
          'that 是單數。',
          'this 是單數而且指近處。'
        ]
      }
    },
    {
      title: '② be 動詞要跟著變',
      body: 'This is my bag.／These are my bags.\n' +
            'That is a cat.／Those are cats.\n' +
            '⚠ 主詞是複數，be 動詞與後面的名詞都要跟著變複數。',
      viz: { type: 'sentence', label: '三個地方要一致', items: [
        { t: 'These', r: '複數主詞' }, { t: 'are', r: '複數 be 動詞' },
        { t: 'my books', r: '複數名詞' }],
        note: '主詞、動詞、補語三處要一致。' },
      check: {
        q: '下列哪一句正確？',
        options: [
          'Those are my shoes.',
          'Those is my shoes.',
          'Those are my shoe.',
          'That are my shoes.'
        ],
        answer: 0,
        why: [
          null,
          '複數主詞要用 are。',
          '複數的補語名詞也要用複數。',
          'that 是單數，不能配 are。'
        ]
      }
    },
    {
      title: '③ 當形容詞用',
      body: 'this book（這本書）　those students（那些學生）\n' +
            '⚠ 放在名詞前面時是「指示形容詞」，\n' +
            '單複數同樣要一致：this book／these books。',
      viz: { type: 'compareexp',
             factor: '後面接不接名詞',
             a: { label: '指示代名詞', note: 'This is my book.（單獨當主詞）' },
             b: { label: '指示形容詞', note: 'This book is mine.（修飾名詞）' },
             same: ['四個字的形式完全一樣'] },
      check: {
        q: '下列哪一個搭配正確？',
        options: [
          'these students',
          'this students',
          'these student',
          'those student'
        ],
        answer: 0,
        why: [
          null,
          'this 是單數，不能修飾複數名詞。',
          'these 是複數，後面要接複數名詞。',
          'those 是複數，後面要接複數名詞。'
        ]
      }
    },
    {
      title: '④ 電話與介紹的固定用法',
      body: '電話中：This is Amy.（我是 Amy。）\n' +
            'Is that Mr. Wang?（請問是王先生嗎？）\n' +
            '⚠ 電話裡自稱用 this，稱對方用 that，是固定慣用法。',
      viz: { type: 'energyflow', steps: ['接起電話', 'This is Amy.（我是）', 'Is that Ben?（你是嗎）', '開始對話'] },
      check: {
        q: '打電話時要說「我是小明」，正確的說法是什麼？',
        options: [
          'This is Ming.',
          'I am Ming here.',
          'That is Ming.',
          'Here is Ming speaking me.'
        ],
        answer: 0,
        why: [
          null,
          '電話中自稱的慣用法是 This is。',
          'that 用來稱呼對方。',
          '這個句子的結構不正確。'
        ]
      }
    },
    {
      title: '⑤ 指前面說過的事',
      body: 'He failed the test. That was a surprise.\n' +
            '⚠ that 可以指前面整句話的內容，\n' +
            'this 則常用來引出接下來要說的事。',
      viz: { type: 'compareexp',
             factor: '指前面還是指後面',
             a: { label: 'that', note: '指剛才說過的內容' },
             b: { label: 'this', note: '引出接下來要說的內容' },
             same: ['都可以代替一整句話'] },
      check: {
        q: '「他遲到了。這件事讓大家很意外。」第二句適合用哪一個字開頭？',
        options: [
          'That（指前面說過的事）',
          'These（指多樣東西）',
          'It is（指某個物品）',
          'Those（指遠處的東西）'
        ],
        answer: 0,
        why: [
          null,
          '前面只有一件事，不用複數。',
          '這裡指的是一件事而不是物品。',
          '這裡不是指遠處的具體東西。'
        ]
      }
    },
    {
      title: '⑥ 常見錯誤',
      body: '✗ These is my friends.（動詞沒跟著變）\n' +
            '✗ This are books.（主詞與動詞不一致）\n' +
            '⚠ 檢查步驟：先看指示詞是單數還是複數，\n' +
            '再檢查 be 動詞和後面的名詞有沒有跟上。',
      viz: { type: 'energyflow', steps: ['指示詞單數還是複數', 'be 動詞跟著變', '名詞跟著變', '檢查完成'] },
      check: {
        q: '檢查 These ___ my classmates. 這句時，空格要填什麼？',
        options: ['are', 'is', 'am', 'be'],
        answer: 0,
        why: [
          null,
          'these 是複數，不能配 is。',
          'am 只跟 I 搭配。',
          'be 是原形，句子需要現在式。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第7單元 數字、時間與日期'] = {
  intro: '數字說得準，時間、日期、價格才不會出錯。',
  cards: [
    {
      title: '① 基數與序數',
      body: '基數（數量）：one、two、three、four、five\n' +
            '序數（順序）：first、second、third、fourth、fifth\n' +
            '⚠ 序數多半是基數加 th，但前三個不規則；\n' +
            'five→fifth、nine→ninth、twelve→twelfth 也要注意。',
      viz: { type: 'classify', groups: [
        { label: '不規則序數', items: ['first', 'second', 'third'] },
        { label: '拼法要改', items: ['fifth', 'ninth', 'twelfth', 'twentieth'] },
        { label: '直接加 th', items: ['fourth', 'sixth', 'tenth'] }] },
      check: {
        q: 'nine 的序數形是什麼？',
        options: ['ninth', 'nineth', 'ninenth', 'ninth’s'],
        answer: 0,
        why: [
          null,
          '要去掉字尾的 e 再加 th。',
          '這個拼法多了字母。',
          '序數不需要撇號。'
        ]
      }
    },
    {
      title: '② 說時間',
      body: '整點：It’s seven o’clock.\n' +
            '幾點幾分（直接唸）：It’s seven thirty.\n' +
            '分鐘在前：It’s half past seven.（七點半）\n' +
            '　　　　　It’s a quarter to eight.（差十五分八點）\n' +
            '⚠ past 是「過」，to 是「差」。',
      viz: { type: 'compareexp',
             factor: '過了還是還沒到',
             a: { label: 'past', note: '七點過十分：ten past seven' },
             b: { label: 'to', note: '差十分八點：ten to eight' },
             same: ['說的是同一段時間的不同角度'] },
      check: {
        q: 'a quarter to nine 是幾點？',
        options: [
          '八點四十五分',
          '九點十五分',
          '九點四十五分',
          '八點十五分'
        ],
        answer: 0,
        why: [
          null,
          '這是 a quarter past nine 的意思。',
          '這是 a quarter to ten 的意思。',
          '這是 a quarter past eight 的意思。'
        ]
      }
    },
    {
      title: '③ 時間的介系詞',
      body: 'at：時刻（at six）、at noon、at night\n' +
            'on：日期、星期（on Monday、on May 5）\n' +
            'in：月、年、季節、一天中的時段（in May、in 2026、in the morning）\n' +
            '⚠ 例外：at night（不是 in the night）。',
      viz: { type: 'energyflow', steps: ['at（時刻，範圍最小）', 'on（日期、星期）', 'in（月、年、季節）'] },
      check: {
        q: '「在早上」的正確說法是什麼？',
        options: [
          'in the morning',
          'on the morning',
          'at the morning',
          'to the morning'
        ],
        answer: 0,
        why: [
          null,
          'on 用於日期與星期。',
          'at 只用在 at night 這類固定用法。',
          'to 表示方向。'
        ]
      }
    },
    {
      title: '④ 日期怎麼寫怎麼唸',
      body: '美式：May 5, 2026（唸 May fifth）\n' +
            '英式：5 May 2026（唸 the fifth of May）\n' +
            '⚠ 寫的是數字，唸的是序數。',
      viz: { type: 'sentence', label: '寫與唸不同', items: [
        { t: '寫：May 5', r: '基數字' }, { t: '唸：May fifth', r: '序數' }],
        note: '日期寫數字，但要唸成序數。' },
      check: {
        q: 'March 3 這個日期要怎麼唸？',
        options: [
          'March third',
          'March three',
          'March the three',
          'Three March day'
        ],
        answer: 0,
        why: [
          null,
          '日期要唸序數而不是基數。',
          '美式唸法不加 the。',
          '這個說法不符合英文用法。'
        ]
      }
    },
    {
      title: '⑤ 大數字的唸法',
      body: '三位一組，由左往右唸：\n' +
            '1,234 → one thousand, two hundred (and) thirty-four\n' +
            '⚠ hundred、thousand、million 前面有數字時不加 s：\n' +
            'two hundred（不是 two hundreds）。',
      viz: { type: 'classify', groups: [
        { label: '不加 s', items: ['two hundred', 'three thousand', 'five million'] },
        { label: '加 s 表示很多', items: ['hundreds of', 'thousands of'] }] },
      check: {
        q: '「兩百位學生」的正確說法是什麼？',
        options: [
          'two hundred students',
          'two hundreds students',
          'two hundred of students',
          'two hundreds of student'
        ],
        answer: 0,
        why: [
          null,
          '前面有數字時 hundred 不加 s。',
          '前面有數字時不加 of。',
          '這個說法同時犯了兩個錯誤。'
        ]
      }
    },
    {
      title: '⑥ 價格與電話號碼',
      body: '價格：It’s three hundred dollars.／NT$300\n' +
            '電話：0912-345-678 一個數字一個數字唸，0 唸 zero 或 oh\n' +
            '⚠ 問價錢用 How much：How much is it?',
      viz: { type: 'sentence', label: '問價錢', items: [
        { t: 'How much', r: '多少錢' }, { t: 'is', r: 'be 動詞' },
        { t: 'this shirt', r: '主詞' }],
        note: '問價錢用 How much 加 be 動詞。' },
      check: {
        q: '「這件襯衫多少錢？」的正確說法是什麼？',
        options: [
          'How much is this shirt?',
          'How many is this shirt?',
          'How much this shirt?',
          'How much does this shirt?'
        ],
        answer: 0,
        why: [
          null,
          'How many 用於可數名詞的數量。',
          '句子缺少 be 動詞。',
          '這裡不需要助動詞 does。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第8單元 祈使句'] = {
  intro: '祈使句是最短的句子：省略主詞，直接用動詞下指令。',
  cards: [
    {
      title: '① 什麼是祈使句',
      body: 'Open the door.（把門打開。）\n' +
            'Be quiet.（安靜。）\n' +
            '⚠ 主詞 you 被省略，動詞用原形，\n' +
            '所以 be 動詞的祈使句是 Be，不是 Are。',
      viz: { type: 'sentence', label: '祈使句結構', items: [
        { t: '(You)', r: '主詞省略' }, { t: 'Open', r: '原形動詞' },
        { t: 'the door', r: '受詞' }],
        note: '祈使句直接用原形動詞開頭。' },
      check: {
        q: '「安靜！」的正確說法是什麼？',
        options: [
          'Be quiet!',
          'Are quiet!',
          'Is quiet!',
          'You are quiet!'
        ],
        answer: 0,
        why: [
          null,
          '祈使句要用原形的 be。',
          'is 不是原形。',
          '這是陳述句，不是命令。'
        ]
      }
    },
    {
      title: '② 否定祈使句',
      body: 'Don’t open the door.（別開門。）\n' +
            'Don’t be late.（別遲到。）\n' +
            '⚠ 不管是一般動詞還是 be 動詞，\n' +
            '否定祈使句一律用 Don’t 開頭。',
      viz: { type: 'compareexp',
             factor: '肯定與否定',
             a: { label: '肯定', note: 'Be careful.' },
             b: { label: '否定', note: 'Don’t be careless.' },
             same: ['都省略主詞，都用原形動詞'] },
      check: {
        q: '「別緊張」的正確說法是什麼？',
        options: [
          'Don’t be nervous.',
          'Don’t nervous.',
          'Not be nervous.',
          'Aren’t nervous.'
        ],
        answer: 0,
        why: [
          null,
          '形容詞前面需要 be 動詞。',
          '否定祈使句要用 Don’t 開頭。',
          '祈使句不使用 aren’t。'
        ]
      }
    },
    {
      title: '③ 讓語氣變客氣',
      body: 'Please close the window.／Close the window, please.\n' +
            'Could you close the window?（更客氣）\n' +
            '⚠ 加 please 是最簡單的方法；\n' +
            '改成疑問句則更禮貌。',
      viz: { type: 'energyflow', steps: ['Close it.（直接）', 'Please close it.（客氣）', 'Could you close it?（更客氣）', 'Would you mind closing it?（最客氣）'] },
      check: {
        q: '下列哪一個說法最客氣？',
        options: [
          'Could you help me, please?',
          'Help me.',
          'Help me now.',
          'You help me.'
        ],
        answer: 0,
        why: [
          null,
          '直接的祈使句語氣較強硬。',
          '加上 now 語氣更急迫。',
          '這樣說像在指使別人。'
        ]
      }
    },
    {
      title: '④ Let’s 的提議',
      body: 'Let’s go.（我們走吧。）＝ Let us go.\n' +
            '否定：Let’s not go.\n' +
            '⚠ Let’s 包含說話者自己，\n' +
            '而一般祈使句是叫「對方」做。',
      viz: { type: 'compareexp',
             factor: '誰要做',
             a: { label: '祈使句', note: 'Go now.（叫對方去）' },
             b: { label: 'Let’s', note: 'Let’s go.（大家一起去）' },
             same: ['後面都接原形動詞'] },
      check: {
        q: '「我們別去了」的正確說法是什麼？',
        options: [
          'Let’s not go.',
          'Don’t let’s go.',
          'Let’s don’t to go.',
          'Not let’s go.'
        ],
        answer: 0,
        why: [
          null,
          'Let’s 的否定要把 not 放在 Let’s 後面。',
          '這個說法不符合英文結構。',
          '否定詞不能放在 Let’s 前面。'
        ]
      }
    },
    {
      title: '⑤ 祈使句加連接詞',
      body: 'Hurry up, and you will catch the bus.（快一點，就趕得上。）\n' +
            'Hurry up, or you will miss the bus.（快一點，否則會錯過。）\n' +
            '⚠ and 表示好結果，or 表示壞結果。',
      viz: { type: 'compareexp',
             factor: '後面的結果',
             a: { label: '祈使句 + and', note: '照做就會有好結果' },
             b: { label: '祈使句 + or', note: '不照做就會有壞結果' },
             same: ['前面都是祈使句'] },
      check: {
        q: 'Study hard, ___ you will fail. 空格要填什麼？',
        options: ['or', 'and', 'but', 'so'],
        answer: 0,
        why: [
          null,
          'and 用於好的結果，這裡是壞結果。',
          'but 表示轉折，語意不通。',
          'so 表示因果，這個句型固定用 and 或 or。'
        ]
      }
    },
    {
      title: '⑥ 生活中的祈使句',
      body: '標語：Keep off the grass.（勿踐踏草皮。）\n' +
            '說明書：Add water and stir.\n' +
            '指路：Turn left at the corner.\n' +
            '⚠ 需要簡短清楚的場合，都會用祈使句。',
      viz: { type: 'classify', groups: [
        { label: '警告標語', items: ['Keep out.', 'Do not touch.', 'No parking.'] },
        { label: '步驟說明', items: ['Add water.', 'Mix well.', 'Turn left.'] }] },
      check: {
        q: '寫食譜或說明書的步驟時，通常用哪一種句型？',
        options: [
          '祈使句，簡短又清楚',
          '疑問句',
          '感嘆句',
          '過去式的陳述句'
        ],
        answer: 0,
        why: [
          null,
          '疑問句是在提問，不是指示。',
          '感嘆句表達情緒，不適合說明步驟。',
          '步驟說明不需要用過去式。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七上|第9單元 現在進行式'] = {
  intro: '現在進行式描述「此刻正在發生」，結構是 be 動詞加動詞 ing。',
  cards: [
    {
      title: '① 基本結構',
      body: '主詞 ＋ be 動詞（am／is／are）＋ 動詞 ing\n' +
            'I am reading.／She is cooking.／They are playing.\n' +
            '⚠ 兩個部分缺一不可：少了 be 動詞或少了 ing 都是錯的。',
      viz: { type: 'tense', verb: 'play', highlight: '現在進行式', pick: false },
      check: {
        q: '下列哪一句正確？',
        options: [
          'She is watching TV.',
          'She watching TV.',
          'She is watch TV.',
          'She watches TV now and is watching.'
        ],
        answer: 0,
        why: [
          null,
          '進行式需要 be 動詞。',
          '進行式的動詞要加 ing。',
          '這句重複表達了同一件事。'
        ]
      }
    },
    {
      title: '② ing 的拼法規則',
      body: '一般：直接加 ing（read→reading）\n' +
            '字尾是不發音的 e：去 e 加 ing（write→writing）\n' +
            '短母音加單子音（重音在後）：重複字尾（run→running、sit→sitting）\n' +
            '字尾 ie：改成 y 加 ing（die→dying）',
      viz: { type: 'classify', groups: [
        { label: '直接加', items: ['reading', 'playing', 'going'] },
        { label: '去 e', items: ['writing', 'making', 'taking'] },
        { label: '重複字尾', items: ['running', 'sitting', 'swimming'] }] },
      check: {
        q: 'swim 的現在分詞是什麼？',
        options: ['swimming', 'swiming', 'swimeing', 'swim'],
        answer: 0,
        why: [
          null,
          '短母音加單子音要重複字尾。',
          '這個拼法多了字母 e。',
          '進行式的動詞要加 ing。'
        ]
      }
    },
    {
      title: '③ 否定與疑問',
      body: '否定：She is not cooking.（把 not 放在 be 動詞後面）\n' +
            '疑問：Is she cooking?→ Yes, she is.\n' +
            '⚠ 這裡的變化都發生在 be 動詞上，\n' +
            'ing 的部分完全不動。',
      viz: { type: 'energyflow', steps: ['She is cooking.', '否定：加 not 在 is 後面', '疑問：把 is 移到句首', 'Is she cooking?'] },
      check: {
        q: '「他們沒有在讀書」的正確說法是什麼？',
        options: [
          'They are not studying.',
          'They do not studying.',
          'They are not study.',
          'They not are studying.'
        ],
        answer: 0,
        why: [
          null,
          '進行式的否定用 be 動詞加 not。',
          '進行式的動詞要保持 ing。',
          'not 要放在 be 動詞後面。'
        ]
      }
    },
    {
      title: '④ 和現在簡單式的差別',
      body: 'I play basketball.（習慣：我有打籃球的習慣）\n' +
            'I am playing basketball.（此刻：我正在打）\n' +
            '⚠ 訊號字：every day、usually → 簡單式；\n' +
            'now、right now、Look!、Listen! → 進行式。',
      viz: { type: 'compareexp',
             factor: '講的是什麼時間',
             a: { label: '現在簡單式', note: '習慣或事實：every day' },
             b: { label: '現在進行式', note: '此刻正在發生：now' },
             same: ['都在描述「現在」，但角度不同'] },
      check: {
        q: 'Look! The baby ___. 空格要填什麼？',
        options: ['is crying', 'cries', 'cry', 'cried'],
        answer: 0,
        why: [
          null,
          'Look 表示此刻，要用進行式。',
          '這個形式主詞動詞也不一致。',
          '過去式與 Look 的當下情境不符。'
        ]
      }
    },
    {
      title: '⑤ 不用進行式的動詞',
      body: '狀態動詞通常不用進行式：\n' +
            'know、like、love、want、need、have（擁有）、see、hear\n' +
            '✗ I am knowing him.→ ✓ I know him.\n' +
            '⚠ 這些動詞描述的是狀態而不是動作。',
      viz: { type: 'classify', groups: [
        { label: '可用進行式（動作）', items: ['run', 'eat', 'write', 'play'] },
        { label: '不用進行式（狀態）', items: ['know', 'like', 'want', 'need'] }] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'I want a new bike.',
          'I am wanting a new bike.',
          'I am knowing the answer.',
          'She is liking pizza.'
        ],
        answer: 0,
        why: [
          null,
          'want 是狀態動詞，不用進行式。',
          'know 是狀態動詞，不用進行式。',
          'like 是狀態動詞，不用進行式。'
        ]
      }
    },
    {
      title: '⑥ 表示最近的計畫',
      body: 'I am meeting Amy tomorrow.（我明天要跟 Amy 見面。）\n' +
            '⚠ 現在進行式也可以表示「已經安排好的近期計畫」，\n' +
            '通常會有明確的時間，語氣比 will 更確定。',
      viz: { type: 'compareexp',
             factor: '確定的程度',
             a: { label: '現在進行式', note: '已安排好：I am leaving at six.' },
             b: { label: 'will', note: '當下決定或單純預測' },
             same: ['都可以指未來的事'] },
      check: {
        q: 'We are flying to Japan next week. 這句話的意思是什麼？',
        options: [
          '下週去日本的行程已經安排好了',
          '我們現在正在飛機上',
          '我們考慮要不要去日本',
          '我們以前去過日本'
        ],
        answer: 0,
        why: [
          null,
          '有 next week 表示是未來的事。',
          '進行式表示計畫已經確定。',
          '這句話講的不是過去的經驗。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第1單元 助動詞 can／may'] = {
  intro: '助動詞加在動詞前面，替句子加上「能力、許可、可能」的意思。',
  cards: [
    {
      title: '① 助動詞的三條鐵則',
      body: '① 後面一定接原形動詞：He can swim.（不是 can swims）\n' +
            '② 否定直接加 not：cannot／can’t、may not\n' +
            '③ 疑問把助動詞移到句首：Can you swim?\n' +
            '⚠ 有了助動詞，就不用 do／does。',
      viz: { type: 'sentence', label: '助動詞句型', items: [
        { t: 'He', r: '主詞' }, { t: 'can', r: '助動詞（不隨主詞變化）' },
        { t: 'swim', r: '原形動詞' }],
        note: '助動詞後面永遠接原形動詞。' },
      check: {
        q: '下列哪一句正確？',
        options: [
          'She can play the piano.',
          'She cans play the piano.',
          'She can plays the piano.',
          'She does can play the piano.'
        ],
        answer: 0,
        why: [
          null,
          '助動詞不隨主詞加 s。',
          '助動詞後面要接原形動詞。',
          '有助動詞時不再用 does。'
        ]
      }
    },
    {
      title: '② can 的三種意思',
      body: '① 能力：I can swim.（我會游泳。）\n' +
            '② 許可：You can go now.（你可以走了。）\n' +
            '③ 請求：Can you help me?（可以幫我嗎？）\n' +
            '⚠ 同一個字，靠上下文判斷是哪一種。',
      viz: { type: 'classify', groups: [
        { label: '能力', items: ['I can swim.', 'He can speak English.'] },
        { label: '許可與請求', items: ['You can go.', 'Can you help me?'] }] },
      check: {
        q: 'Can I use your phone? 這句話在表達什麼？',
        options: [
          '請求對方的許可',
          '陳述自己的能力',
          '描述過去的事',
          '表達未來的計畫'
        ],
        answer: 0,
        why: [
          null,
          '這裡問的是可不可以，不是會不會。',
          '句子用的是現在式。',
          '這句沒有提到未來的時間。'
        ]
      }
    },
    {
      title: '③ 否定與縮寫',
      body: 'cannot ＝ can’t（★ 注意 cannot 是一個字，中間不空格）\n' +
            'I can’t swim.（我不會游泳。）\n' +
            'may not（沒有常用縮寫）\n' +
            '⚠ 寫作時 cannot 與 can not 都看得到，但以 cannot 為主。',
      viz: { type: 'classify', groups: [
        { label: '正確寫法', items: ['cannot', 'can’t'] },
        { label: '容易寫錯', items: ['can not（較少用）', 'cann’t（錯）'] }] },
      check: {
        q: 'can 的否定形正確寫法是什麼？',
        options: ['cannot', 'cann’t', 'can’nt', 'do not can'],
        answer: 0,
        why: [
          null,
          '這個縮寫的撇號位置錯了。',
          '這個拼法並不存在。',
          '有助動詞時不再用 do。'
        ]
      }
    },
    {
      title: '④ may 的用法',
      body: '① 正式的許可：May I come in?（比 Can I 更客氣）\n' +
            '② 可能性：It may rain tomorrow.（明天可能會下雨。）\n' +
            '⚠ May I…? 常用在對長輩或不熟的人。',
      viz: { type: 'compareexp',
             factor: '正式程度',
             a: { label: 'Can I…?', note: '日常、朋友之間' },
             b: { label: 'May I…?', note: '正式、對長輩或陌生人' },
             same: ['都在請求許可'] },
      check: {
        q: '向老師請求進教室，比較合適的說法是什麼？',
        options: [
          'May I come in?',
          'I come in.',
          'I want come in.',
          'Come in me.'
        ],
        answer: 0,
        why: [
          null,
          '這是陳述句，不是請求。',
          '這個句子缺少 to，語氣也不客氣。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '⑤ be able to',
      body: 'can ＝ be able to（表示能力時）\n' +
            'I can swim. ＝ I am able to swim.\n' +
            '⚠ can 沒有未來式，要說未來的能力得用：\n' +
            'I will be able to swim next year.',
      viz: { type: 'compareexp',
             factor: '能不能配時態',
             a: { label: 'can', note: '只有現在式與過去式 could' },
             b: { label: 'be able to', note: '可以配任何時態' },
             same: ['表示能力時意思相同'] },
      check: {
        q: '「明年我就能開車了」的正確說法是什麼？',
        options: [
          'I will be able to drive next year.',
          'I will can drive next year.',
          'I can will drive next year.',
          'I am can drive next year.'
        ],
        answer: 0,
        why: [
          null,
          '兩個助動詞不能連用。',
          '助動詞不能連續出現。',
          'be 動詞不能和助動詞 can 並用。'
        ]
      }
    },
    {
      title: '⑥ 常見的請求句型',
      body: 'Can you…?（可以嗎，日常）\n' +
            'Could you…?（更客氣）\n' +
            'Would you…?（更客氣）\n' +
            '⚠ could 在這裡不是過去式，而是讓語氣更委婉。',
      viz: { type: 'energyflow', steps: ['Can you…?（一般）', 'Could you…?（客氣）', 'Would you mind…?（最客氣）'] },
      check: {
        q: 'Could you open the window? 這裡的 could 表示什麼？',
        options: [
          '讓語氣更委婉客氣',
          '表示過去的能力',
          '表示不可能',
          '表示命令'
        ],
        answer: 0,
        why: [
          null,
          '這裡不是在講過去的事。',
          'could 在請求句中不表示否定。',
          '疑問的請求語氣比命令柔和。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第2單元 頻率副詞'] = {
  intro: '多常做一件事，靠頻率副詞說清楚。',
  cards: [
    {
      title: '① 頻率的高低順序',
      body: 'always（100%）→ usually → often → sometimes → seldom／rarely → never（0%）\n' +
            '⚠ seldom 和 never 本身已經是否定的意思，\n' +
            '句子裡不能再加 not。',
      viz: { type: 'energyflow', steps: ['always 總是', 'usually 通常', 'often 常常', 'sometimes 有時', 'seldom 很少', 'never 從不'] },
      check: {
        q: '下列哪一個表示頻率最低？',
        options: ['never', 'seldom', 'sometimes', 'often'],
        answer: 0,
        why: [
          null,
          'seldom 表示很少，但不是完全沒有。',
          'sometimes 表示有時候。',
          'often 表示常常。'
        ]
      }
    },
    {
      title: '② 放在哪裡',
      body: '★ 一般動詞前面：I always get up early.\n' +
            '★ be 動詞後面：He is always late.\n' +
            '★ 助動詞後面：I can never remember his name.\n' +
            '⚠ 口訣：be 後、助後、一般動詞前。',
      viz: { type: 'compareexp',
             factor: '句子裡有什麼動詞',
             a: { label: 'be 動詞句', note: '副詞放後面：is always late' },
             b: { label: '一般動詞句', note: '副詞放前面：always gets up' },
             same: ['副詞的形式不變，只是位置不同'] },
      check: {
        q: '下列哪一句位置正確？',
        options: [
          'She is often tired after school.',
          'She often is tired after school.',
          'She is tired often after school.',
          'Often she is tired after school is.'
        ],
        answer: 0,
        why: [
          null,
          '頻率副詞要放在 be 動詞後面。',
          '這個位置不是標準用法。',
          '句尾多了一個 be 動詞。'
        ]
      }
    },
    {
      title: '③ 用 How often 提問',
      body: 'How often do you exercise?（你多常運動？）\n' +
            '→ Three times a week.（一週三次。）\n' +
            '⚠ 回答可以用頻率副詞，也可以用具體次數。',
      viz: { type: 'sentence', label: '問頻率', items: [
        { t: 'How often', r: '多常' }, { t: 'do you', r: '助動詞加主詞' },
        { t: 'exercise', r: '原形動詞' }],
        note: 'How often 問的是次數或頻率。' },
      check: {
        q: '要問「你多常去圖書館？」應該用哪一個？',
        options: [
          'How often',
          'How long',
          'How many',
          'How far'
        ],
        answer: 0,
        why: [
          null,
          'How long 問時間長度。',
          'How many 問數量。',
          'How far 問距離。'
        ]
      }
    },
    {
      title: '④ 表示次數的說法',
      body: 'once a week（一週一次）　twice a month（一個月兩次）\n' +
            'three times a year（一年三次）　every day（每天）\n' +
            '⚠ 一次是 once、兩次是 twice，三次以上才用 times。',
      viz: { type: 'classify', groups: [
        { label: '特殊說法', items: ['once（一次）', 'twice（兩次）'] },
        { label: '用 times', items: ['three times', 'four times', 'ten times'] }] },
      check: {
        q: '「一個月兩次」的正確說法是什麼？',
        options: [
          'twice a month',
          'two times a month（較少用）',
          'second a month',
          'two time a month'
        ],
        answer: 0,
        why: [
          null,
          '兩次的標準說法是 twice。',
          'second 是序數，不表示次數。',
          'time 要用複數形。'
        ]
      }
    },
    {
      title: '⑤ 頻率副詞的位置變化',
      body: 'sometimes、usually、often 可以放句首或句尾加強語氣：\n' +
            'Sometimes I walk to school.\n' +
            '⚠ 但 always 和 never 不放句首（除非是祈使句或倒裝）。',
      viz: { type: 'classify', groups: [
        { label: '位置較彈性', items: ['sometimes', 'usually', 'often'] },
        { label: '位置固定', items: ['always', 'never', 'seldom'] }] },
      check: {
        q: '下列哪一個副詞可以放在句首？',
        options: ['Sometimes', 'Always', 'Never', 'Seldom'],
        answer: 0,
        why: [
          null,
          'always 一般不放在句首。',
          'never 放句首會需要倒裝的特殊句型。',
          'seldom 放句首也需要倒裝。'
        ]
      }
    },
    {
      title: '⑥ 常見錯誤',
      body: '✗ I don’t never go there.（雙重否定）\n' +
            '✓ I never go there.\n' +
            '✗ He always is late.（位置錯）\n' +
            '✓ He is always late.',
      viz: { type: 'energyflow', steps: ['先看動詞是哪一種', 'be 動詞放後面', '一般動詞放前面', '否定詞不重複'] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'I never eat fast food.',
          'I don’t never eat fast food.',
          'I never don’t eat fast food.',
          'I not never eat fast food.'
        ],
        answer: 0,
        why: [
          null,
          'never 已是否定，不能再加 don’t。',
          '同一句不能有兩個否定詞。',
          '這句同樣犯了雙重否定的錯誤。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第3單元 時間介系詞'] = {
  intro: 'at、on、in 三個字，靠「時間範圍的大小」就能分清楚。',
  cards: [
    {
      title: '① 由小到大：at、on、in',
      body: 'at：時間點（at 7:00、at noon、at night）\n' +
            'on：某一天（on Monday、on May 5、on my birthday）\n' +
            'in：較長的期間（in May、in 2026、in summer、in the morning）\n' +
            '⚠ 範圍越大，介系詞越「大」。',
      viz: { type: 'energyflow', steps: ['at（時刻）', 'on（一天）', 'in（月、年、季節）'] },
      check: {
        q: '「在星期五」的正確介系詞是什麼？',
        options: ['on', 'at', 'in', 'to'],
        answer: 0,
        why: [
          null,
          'at 用於具體的時刻。',
          'in 用於月份、年份等較長的期間。',
          'to 表示方向。'
        ]
      }
    },
    {
      title: '② 要背的例外',
      body: 'at night（不是 in the night）\n' +
            'at noon／at midnight\n' +
            'on Monday morning（有指定某一天時用 on）\n' +
            '⚠ 「早上」一般用 in the morning，\n' +
            '但一旦指定是哪一天，就改用 on。',
      viz: { type: 'compareexp',
             factor: '有沒有指定哪一天',
             a: { label: 'in the morning', note: '泛指早上' },
             b: { label: 'on Monday morning', note: '指定星期一早上' },
             same: ['都在說早上'] },
      check: {
        q: '「在星期日下午」的正確說法是什麼？',
        options: [
          'on Sunday afternoon',
          'in Sunday afternoon',
          'at Sunday afternoon',
          'in the Sunday afternoon'
        ],
        answer: 0,
        why: [
          null,
          '指定了哪一天就要用 on。',
          'at 用於具體的時刻。',
          '指定日期時不用 in。'
        ]
      }
    },
    {
      title: '③ for 與 since',
      body: 'for ＋ 一段時間：for three years、for two hours\n' +
            'since ＋ 起點：since 2020、since last month\n' +
            '⚠ for 說的是「多久」，since 說的是「從什麼時候開始」。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: 'for', note: '接時間長度：for two years' },
             b: { label: 'since', note: '接起始點：since 2020' },
             same: ['常和完成式一起用'] },
      check: {
        q: 'I have lived here ___ 2015. 空格要填什麼？',
        options: ['since', 'for', 'at', 'in'],
        answer: 0,
        why: [
          null,
          'for 後面要接一段時間長度。',
          'at 用於具體的時刻。',
          'in 這裡無法表達從某年開始持續。'
        ]
      }
    },
    {
      title: '④ before、after、during',
      body: 'before dinner（晚餐前）　after school（放學後）\n' +
            'during the summer（暑假期間）\n' +
            '⚠ during 後面接名詞（一段期間），\n' +
            'while 後面接完整的句子。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: 'during', note: '接名詞：during the movie' },
             b: { label: 'while', note: '接句子：while I was watching' },
             same: ['都表示在某段時間之內'] },
      check: {
        q: 'I fell asleep ___ the movie. 空格要填什麼？',
        options: ['during', 'while', 'when I', 'since'],
        answer: 0,
        why: [
          null,
          'while 後面要接完整的句子。',
          '這個選項後面還需要動詞才完整。',
          'since 表示從某時開始，語意不合。'
        ]
      }
    },
    {
      title: '⑤ from…to 與 by',
      body: 'from Monday to Friday（從星期一到星期五）\n' +
            'by five o’clock（在五點之前，最晚五點）\n' +
            '⚠ by 強調「不晚於」，until 強調「一直到」。',
      viz: { type: 'compareexp',
             factor: '意思的差別',
             a: { label: 'by five', note: '五點之前要完成' },
             b: { label: 'until five', note: '一直持續到五點' },
             same: ['都提到五點這個時間'] },
      check: {
        q: 'Please finish it ___ Friday.（星期五之前完成）空格要填什麼？',
        options: ['by', 'until', 'since', 'during'],
        answer: 0,
        why: [
          null,
          'until 表示持續到某時，語意不同。',
          'since 表示從某時開始。',
          'during 後面要接一段期間。'
        ]
      }
    },
    {
      title: '⑥ 不加介系詞的情況',
      body: 'today、tomorrow、yesterday、this morning、next week、last year\n' +
            '★ 這些字前面不加介系詞：\n' +
            '✗ in this morning → ✓ this morning\n' +
            '⚠ 有 this、that、next、last、every 就不加介系詞。',
      viz: { type: 'classify', groups: [
        { label: '不加介系詞', items: ['today', 'this morning', 'next week', 'every day'] },
        { label: '要加介系詞', items: ['in the morning', 'on Monday', 'at six'] }] },
      check: {
        q: '「下星期」的正確說法是什麼？',
        options: [
          'next week',
          'in next week',
          'on next week',
          'at next week'
        ],
        answer: 0,
        why: [
          null,
          '有 next 時前面不加介系詞。',
          'on 用於特定的日期或星期。',
          'at 用於具體的時刻。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第4單元 地點介系詞'] = {
  intro: '同樣是 at、on、in，換到空間上就變成點、面、體。',
  cards: [
    {
      title: '① 點、面、體',
      body: 'at：一個點（at the door、at the bus stop、at school）\n' +
            'on：一個面（on the table、on the wall、on the second floor）\n' +
            'in：一個空間裡面（in the box、in Taipei、in the room）\n' +
            '⚠ at 是點、on 是面、in 是立體空間。',
      viz: { type: 'energyflow', steps: ['at（點）', 'on（面）', 'in（立體空間）'] },
      check: {
        q: '「在牆上」的正確說法是什麼？',
        options: ['on the wall', 'in the wall', 'at the wall', 'to the wall'],
        answer: 0,
        why: [
          null,
          'in the wall 表示嵌在牆裡面。',
          'at the wall 指靠近牆的位置，語意不同。',
          'to 表示方向而不是位置。'
        ]
      }
    },
    {
      title: '② 相對位置',
      body: 'in front of（在前面）　behind（在後面）\n' +
            'next to／beside（在旁邊）　between A and B（在兩者之間）\n' +
            'across from／opposite（在對面）\n' +
            '⚠ between 只能用在兩者之間，三者以上用 among。',
      viz: { type: 'classify', groups: [
        { label: '前後', items: ['in front of', 'behind'] },
        { label: '旁邊與之間', items: ['next to', 'between', 'among'] }] },
      check: {
        q: 'The bank is ___ the post office and the school. 空格要填什麼？',
        options: ['between', 'among', 'behind', 'in'],
        answer: 0,
        why: [
          null,
          'among 用於三者以上。',
          'behind 表示在後面，語意不合。',
          'in 表示在裡面。'
        ]
      }
    },
    {
      title: '③ 上下與內外',
      body: 'over（正上方，不接觸）　above（在上方）\n' +
            'under（正下方）　below（在下方）\n' +
            'inside（在內部）　outside（在外面）\n' +
            '⚠ on 是接觸的上面，over 是不接觸的上方。',
      viz: { type: 'compareexp',
             factor: '有沒有接觸',
             a: { label: 'on', note: '接觸表面：a book on the desk' },
             b: { label: 'over', note: '懸在上方：a lamp over the desk' },
             same: ['都表示在上面'] },
      check: {
        q: '「燈懸在桌子上方」的正確說法是什麼？',
        options: [
          'The lamp is over the table.',
          'The lamp is on the table.',
          'The lamp is in the table.',
          'The lamp is at the table.'
        ],
        answer: 0,
        why: [
          null,
          'on 表示放在桌面上並接觸。',
          'in 表示在桌子內部。',
          'at 指靠近桌子的位置。'
        ]
      }
    },
    {
      title: '④ 表示方向',
      body: 'to（往）　into（進入）　out of（出來）\n' +
            'through（穿過）　across（橫越）　along（沿著）\n' +
            '⚠ 方向的介系詞多半和移動的動詞一起用。',
      viz: { type: 'classify', groups: [
        { label: '位置（靜態）', items: ['in', 'on', 'at', 'under'] },
        { label: '方向（動態）', items: ['to', 'into', 'through', 'across'] }] },
      check: {
        q: 'He walked ___ the room and sat down. 空格要填什麼？',
        options: ['into', 'in', 'on', 'at'],
        answer: 0,
        why: [
          null,
          'in 表示已經在裡面，不表示進入的動作。',
          'on 表示在表面上。',
          'at 表示在某一個定點。'
        ]
      }
    },
    {
      title: '⑤ 地址與交通',
      body: 'in Taiwan、in Taipei（大範圍用 in）\n' +
            'on Zhongshan Road（街道用 on）\n' +
            'at No. 5, Zhongshan Road（門牌號碼用 at）\n' +
            '⚠ 範圍越精確，介系詞越小。',
      viz: { type: 'energyflow', steps: ['in Taiwan（國家）', 'in Taipei（城市）', 'on Main Road（街道）', 'at No. 5（門牌）'] },
      check: {
        q: '「住在中山路上」的正確說法是什麼？',
        options: [
          'live on Zhongshan Road',
          'live in Zhongshan Road',
          'live at Zhongshan Road',
          'live to Zhongshan Road'
        ],
        answer: 0,
        why: [
          null,
          'in 用於城市或更大的範圍。',
          'at 用於具體的門牌號碼。',
          'to 表示方向。'
        ]
      }
    },
    {
      title: '⑥ 容易混淆的固定用法',
      body: 'at home、at school、at work（不加冠詞，強調在做那件事）\n' +
            'in the school（強調在校園這個地方裡）\n' +
            'on the bus／in the car（大車用 on，小車用 in）\n' +
            '⚠ 這些是慣用法，理解之後直接記起來。',
      viz: { type: 'classify', groups: [
        { label: 'on（能走動的交通工具）', items: ['on the bus', 'on the train', 'on a plane'] },
        { label: 'in（空間小的）', items: ['in the car', 'in a taxi'] }] },
      check: {
        q: '「在公車上」的正確說法是什麼？',
        options: ['on the bus', 'in the bus', 'at the bus', 'to the bus'],
        answer: 0,
        why: [
          null,
          '大型可走動的交通工具慣用 on。',
          'at the bus 指在公車旁邊。',
          'to 表示方向。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第5單元 There is／There are'] = {
  intro: '要說「某處有什麼」，英文用的是 There is 而不是 have。',
  cards: [
    {
      title: '① 基本句型',
      body: 'There is ＋ 單數或不可數名詞\n' +
            'There are ＋ 複數名詞\n' +
            'There is a book on the desk.／There are two books.\n' +
            '⚠ there 只是引導詞，真正的主詞在後面。',
      viz: { type: 'sentence', label: '真正的主詞在後面', items: [
        { t: 'There', r: '引導詞（不是主詞）' }, { t: 'are', r: '跟著後面的名詞變' },
        { t: 'two books', r: '真正的主詞' }],
        note: '動詞跟著後面的名詞決定單複數。' },
      check: {
        q: 'There ___ some milk in the fridge. 空格要填什麼？',
        options: ['is', 'are', 'have', 'has'],
        answer: 0,
        why: [
          null,
          'milk 是不可數名詞，要用 is。',
          '英文表示存在不用 have。',
          '這個句型不使用 has。'
        ]
      }
    },
    {
      title: '② 不要用 have',
      body: '中文說「教室裡有三十個學生」，\n' +
            '✗ The classroom has thirty students.（少用）\n' +
            '✓ There are thirty students in the classroom.\n' +
            '⚠ 表示某地存在某物，英文的標準說法是 There is／are。',
      viz: { type: 'compareexp',
             factor: '主詞是誰',
             a: { label: 'There are…', note: '描述某地存在什麼（標準）' },
             b: { label: '某人 has…', note: '描述某人擁有什麼' },
             same: ['中文都翻成「有」'] },
      check: {
        q: '「公園裡有很多樹」的標準說法是什麼？',
        options: [
          'There are many trees in the park.',
          'The park has many trees is.',
          'In the park have many trees.',
          'There have many trees in the park.'
        ],
        answer: 0,
        why: [
          null,
          '句尾多了一個 be 動詞。',
          '這個句子沒有主詞，結構不完整。',
          '這個句型不使用 have。'
        ]
      }
    },
    {
      title: '③ 動詞跟著最近的名詞',
      body: 'There is a pen and two books on the desk.\n' +
            'There are two books and a pen on the desk.\n' +
            '⚠ 有好幾個東西時，be 動詞跟著「最靠近」的那個名詞。',
      viz: { type: 'sentence', label: '就近原則', items: [
        { t: 'There is', r: '跟著下一個名詞' }, { t: 'a pen', r: '單數（最靠近）' },
        { t: 'and two books', r: '後面的不影響' }],
        note: '動詞跟著最靠近的名詞決定。' },
      check: {
        q: 'There ___ a chair and two tables in the room. 空格要填什麼？',
        options: ['is', 'are', 'have', 'be'],
        answer: 0,
        why: [
          null,
          '最靠近的名詞是單數的 a chair。',
          '這個句型不用 have。',
          'be 是原形，句子需要現在式。'
        ]
      }
    },
    {
      title: '④ 否定與疑問',
      body: '否定：There isn’t any water.／There aren’t any books.\n' +
            '疑問：Is there a bank near here?→ Yes, there is.\n' +
            '⚠ 簡答時要保留 there：Yes, there is.（不是 Yes, it is.）',
      viz: { type: 'energyflow', steps: ['There is a bank.', '把 is 移到前面', 'Is there a bank?', 'Yes, there is.'] },
      check: {
        q: 'Are there any students in the classroom? 的肯定簡答是什麼？',
        options: [
          'Yes, there are.',
          'Yes, they are.',
          'Yes, it is.',
          'Yes, there is.'
        ],
        answer: 0,
        why: [
          null,
          '這個句型的簡答要保留 there。',
          '主詞是複數而且要用 there。',
          '問句用 are，簡答也要用 are。'
        ]
      }
    },
    {
      title: '⑤ some 與 any',
      body: '肯定句用 some：There are some apples.\n' +
            '否定與疑問常用 any：There aren’t any apples.\n' +
            '⚠ 但期待對方說 yes 的邀請句仍用 some：\n' +
            'Would you like some tea?',
      viz: { type: 'compareexp',
             factor: '句子的類型',
             a: { label: 'some', note: '肯定句、邀請句' },
             b: { label: 'any', note: '否定句、一般疑問句' },
             same: ['都表示不確定的數量'] },
      check: {
        q: 'There aren’t ___ eggs in the fridge. 空格要填什麼？',
        options: ['any', 'some', 'a', 'much'],
        answer: 0,
        why: [
          null,
          '否定句通常用 any。',
          'a 後面要接單數名詞。',
          'much 用於不可數名詞。'
        ]
      }
    },
    {
      title: '⑥ 過去式與未來式',
      body: 'There was a park here.（以前有一座公園。）\n' +
            'There were many people.（當時有很多人。）\n' +
            'There will be a test tomorrow.（明天會有考試。）\n' +
            '⚠ 未來式固定用 There will be，不隨單複數變。',
      viz: { type: 'classify', groups: [
        { label: '現在', items: ['There is', 'There are'] },
        { label: '過去', items: ['There was', 'There were'] },
        { label: '未來', items: ['There will be'] }] },
      check: {
        q: '「明天會有一場演唱會」的正確說法是什麼？',
        options: [
          'There will be a concert tomorrow.',
          'There will is a concert tomorrow.',
          'There will are a concert tomorrow.',
          'There is will a concert tomorrow.'
        ],
        answer: 0,
        why: [
          null,
          'will 後面要接原形的 be。',
          'will 後面不能接 are。',
          '助動詞要放在 be 動詞前面。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第6單元 形容詞與副詞'] = {
  intro: '形容詞修飾名詞、副詞修飾動詞，用錯位置意思就走樣。',
  cards: [
    {
      title: '① 兩者的分工',
      body: '形容詞修飾名詞：a careful driver（小心的駕駛）\n' +
            '副詞修飾動詞：He drives carefully.（他開車很小心。）\n' +
            '⚠ 判斷方法：這個字在形容「人事物」還是在形容「怎麼做」。',
      viz: { type: 'compareexp',
             factor: '修飾誰',
             a: { label: '形容詞', note: '修飾名詞：a slow car' },
             b: { label: '副詞', note: '修飾動詞：drives slowly' },
             same: ['字根相同，字尾不同'] },
      check: {
        q: 'She sings ___.（她唱得很好）空格要填什麼？',
        options: ['well', 'good', 'goodly', 'the good'],
        answer: 0,
        why: [
          null,
          'good 是形容詞，不能修飾動詞。',
          '這個字並不存在。',
          '加冠詞在這裡並不通順。'
        ]
      }
    },
    {
      title: '② 副詞的變化規則',
      body: '一般：形容詞加 ly（quick→quickly）\n' +
            '子音加 y：y 改 ily（happy→happily）\n' +
            '字尾 le：去 e 加 y（simple→simply）\n' +
            '不規則：good→well、fast→fast、hard→hard',
      viz: { type: 'classify', groups: [
        { label: '加 ly', items: ['quickly', 'slowly', 'carefully'] },
        { label: 'y 改 ily', items: ['happily', 'easily'] },
        { label: '形式不變', items: ['fast', 'hard', 'late', 'early'] }] },
      check: {
        q: 'fast 的副詞形是什麼？',
        options: ['fast', 'fastly', 'fastily', 'quickly fast'],
        answer: 0,
        why: [
          null,
          'fast 的副詞形和形容詞相同。',
          '這個拼法並不存在。',
          '這個說法重複多餘。'
        ]
      }
    },
    {
      title: '③ 陷阱：ly 不一定是副詞',
      body: 'friendly、lovely、lonely、ugly 都是形容詞，不是副詞。\n' +
            '✗ He smiled friendly.\n' +
            '✓ He gave me a friendly smile.\n' +
            '⚠ 這些字沒有對應的副詞形，要換句話說。',
      viz: { type: 'classify', groups: [
        { label: 'ly 結尾但是形容詞', items: ['friendly', 'lovely', 'lonely', 'ugly'] },
        { label: 'ly 結尾的副詞', items: ['quickly', 'slowly', 'happily'] }] },
      check: {
        q: '下列哪一個 ly 結尾的字是形容詞？',
        options: ['friendly', 'quickly', 'carefully', 'happily'],
        answer: 0,
        why: [
          null,
          'quickly 是副詞，修飾動詞。',
          'carefully 是副詞，修飾動詞。',
          'happily 是副詞，修飾動詞。'
        ]
      }
    },
    {
      title: '④ 連綴動詞後面用形容詞',
      body: 'be、look、sound、smell、taste、feel、become 後面接形容詞：\n' +
            'The soup tastes good.（不是 tastes well）\n' +
            'You look tired.\n' +
            '⚠ 這些動詞沒有真正的動作，是在描述主詞的狀態。',
      viz: { type: 'sentence', label: '連綴動詞', items: [
        { t: 'The soup', r: '主詞' }, { t: 'tastes', r: '連綴動詞' },
        { t: 'good', r: '形容詞（描述主詞）' }],
        note: '連綴動詞後面要用形容詞。' },
      check: {
        q: 'The flower smells ___. 空格要填什麼？',
        options: ['sweet', 'sweetly', 'sweetness', 'to sweet'],
        answer: 0,
        why: [
          null,
          'smell 是連綴動詞，後面要接形容詞。',
          'sweetness 是名詞，語意不通。',
          '這裡不需要不定詞。'
        ]
      }
    },
    {
      title: '⑤ 形容詞的排列順序',
      body: '冠詞 → 數量 → 主觀評價 → 大小 → 新舊 → 顏色 → 出處 → 材質 → 名詞\n' +
            'a beautiful small old brown wooden table\n' +
            '⚠ 實際說話很少超過三個，記大方向即可：\n' +
            '主觀在前、客觀在後、材質最靠近名詞。',
      viz: { type: 'sentence', label: '排列順序', items: [
        { t: 'a', r: '冠詞' }, { t: 'small', r: '大小' }, { t: 'old', r: '新舊' },
        { t: 'wooden', r: '材質' }, { t: 'box', r: '名詞' }],
        note: '越客觀的形容詞越靠近名詞。' },
      check: {
        q: '下列哪一個順序正確？',
        options: [
          'a big red plastic ball',
          'a plastic red big ball',
          'a red big plastic ball',
          'a plastic big red ball'
        ],
        answer: 0,
        why: [
          null,
          '材質要放在最靠近名詞的位置。',
          '大小要放在顏色前面。',
          '材質不能放在最前面。'
        ]
      }
    },
    {
      title: '⑥ 副詞的位置',
      body: '方式副詞多放句尾：He speaks English fluently.\n' +
            '程度副詞放在被修飾的字前面：very good、quite fast\n' +
            '⚠ 不要插在動詞和受詞中間：\n' +
            '✗ He speaks fluently English.',
      viz: { type: 'energyflow', steps: ['主詞', '動詞', '受詞', '方式副詞（放最後）'] },
      check: {
        q: '下列哪一句位置正確？',
        options: [
          'She plays the piano beautifully.',
          'She plays beautifully the piano.',
          'She beautifully plays the piano well.',
          'Beautifully she plays piano the.'
        ],
        answer: 0,
        why: [
          null,
          '副詞不插在動詞與受詞之間。',
          '這句重複表達了同樣的意思。',
          '這個語序完全不符合英文結構。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第7單元 過去式 be 動詞'] = {
  intro: '過去的 be 動詞只有兩個字：was 和 were。',
  cards: [
    {
      title: '① was 與 were',
      body: 'am／is → was　　are → were\n' +
            'I was busy.／He was late.／They were happy.\n' +
            '⚠ 現在式有三個形式，過去式只剩兩個，反而更好記。',
      viz: { type: 'classify', groups: [
        { label: 'was', items: ['I', 'he', 'she', 'it', '單數名詞'] },
        { label: 'were', items: ['you', 'we', 'they', '複數名詞'] }] },
      check: {
        q: 'The students ___ in the library yesterday. 空格要填什麼？',
        options: ['were', 'was', 'are', 'is'],
        answer: 0,
        why: [
          null,
          '主詞是複數，要用 were。',
          '有 yesterday 要用過去式。',
          '主詞是複數而且要用過去式。'
        ]
      }
    },
    {
      title: '② 否定與縮寫',
      body: 'was not ＝ wasn’t　　were not ＝ weren’t\n' +
            'I wasn’t at home.／They weren’t ready.\n' +
            '⚠ 過去式的否定同樣直接在 be 動詞後面加 not。',
      viz: { type: 'sentence', label: '否定的位置', items: [
        { t: 'I', r: '主詞' }, { t: 'wasn’t', r: 'be 動詞加 not' },
        { t: 'at home', r: '地點' }],
        note: 'be 動詞後面加 not。' },
      check: {
        q: '「他們昨天不在學校」的正確說法是什麼？',
        options: [
          'They weren’t at school yesterday.',
          'They didn’t at school yesterday.',
          'They wasn’t at school yesterday.',
          'They not were at school yesterday.'
        ],
        answer: 0,
        why: [
          null,
          'be 動詞的否定不用 didn’t。',
          '主詞是複數，要用 weren’t。',
          'not 要放在 be 動詞後面。'
        ]
      }
    },
    {
      title: '③ 疑問句與簡答',
      body: 'Was he at the party?→ Yes, he was.／No, he wasn’t.\n' +
            'Were you tired?→ Yes, I was.\n' +
            '⚠ 疑問句把 was／were 移到句首，其他規則和現在式一樣。',
      viz: { type: 'energyflow', steps: ['He was late.', '把 was 移到句首', 'Was he late?', 'Yes, he was.'] },
      check: {
        q: 'Were they happy? 的否定簡答是什麼？',
        options: [
          'No, they weren’t.',
          'No, they wasn’t.',
          'No, they didn’t.',
          'No, they aren’t.'
        ],
        answer: 0,
        why: [
          null,
          '主詞是複數，要用 weren’t。',
          'be 動詞的簡答不用 didn’t。',
          '問句是過去式，簡答也要用過去式。'
        ]
      }
    },
    {
      title: '④ 過去的時間副詞',
      body: 'yesterday、last night、last week、two days ago、in 2020\n' +
            '⚠ 看到這些字，就要把動詞改成過去式。\n' +
            'ago 要放在時間後面：three years ago。',
      viz: { type: 'classify', groups: [
        { label: '過去的訊號字', items: ['yesterday', 'last week', 'two days ago', 'in 2019'] },
        { label: '現在的訊號字', items: ['now', 'today', 'every day'] }] },
      check: {
        q: '「三年前」的正確說法是什麼？',
        options: [
          'three years ago',
          'ago three years',
          'before three years',
          'three years before now'
        ],
        answer: 0,
        why: [
          null,
          'ago 要放在時間長度後面。',
          'before 的用法與 ago 不同。',
          '這個說法多餘而且不自然。'
        ]
      }
    },
    {
      title: '⑤ There was／There were',
      body: 'There was a school here.（以前這裡有一所學校。）\n' +
            'There were many trees.\n' +
            '⚠ 同樣跟著後面的名詞決定單複數。',
      viz: { type: 'sentence', label: '過去的存在句', items: [
        { t: 'There', r: '引導詞' }, { t: 'were', r: '跟著後面的名詞' },
        { t: 'many trees', r: '真正的主詞（複數）' }],
        note: '動詞跟著後面的名詞決定單複數。' },
      check: {
        q: 'There ___ a lot of people at the concert. 空格要填什麼？',
        options: ['were', 'was', 'are', 'is'],
        answer: 0,
        why: [
          null,
          'people 是複數概念，要用 were。',
          '句子描述的是過去的事。',
          '這裡既要過去式也要複數。'
        ]
      }
    },
    {
      title: '⑥ 過去進行的鋪陳',
      body: 'was／were ＋ 動詞 ing ＝ 過去進行式\n' +
            'I was watching TV when he called.\n' +
            '⚠ 過去進行式用來描述「當時正在做的背景」，\n' +
            '突然發生的事則用過去簡單式。',
      viz: { type: 'compareexp',
             factor: '角色',
             a: { label: '過去進行式', note: '當時的背景：was watching TV' },
             b: { label: '過去簡單式', note: '突然發生：he called' },
             same: ['都在講過去的事'] },
      check: {
        q: 'I ___ dinner when the phone rang. 空格要填什麼？',
        options: [
          'was cooking',
          'cooked',
          'am cooking',
          'cook'
        ],
        answer: 0,
        why: [
          null,
          '這裡要表達當時正在進行的背景動作。',
          '句子講的是過去的事。',
          '現在簡單式與過去的情境不符。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第8單元 規則動詞過去式'] = {
  intro: '規則動詞的過去式加 ed，重點是拼法與發音兩件事。',
  cards: [
    {
      title: '① 拼法規則',
      body: '一般：加 ed（play→played）\n' +
            '字尾 e：只加 d（like→liked）\n' +
            '子音加 y：y 改 ied（study→studied）\n' +
            '短母音加單子音（重音在後）：重複字尾（stop→stopped）',
      viz: { type: 'classify', groups: [
        { label: '加 ed', items: ['played', 'watched', 'wanted'] },
        { label: '只加 d', items: ['liked', 'lived', 'used'] },
        { label: 'y 改 ied', items: ['studied', 'carried', 'tried'] },
        { label: '重複字尾', items: ['stopped', 'planned'] }] },
      check: {
        q: 'stop 的過去式是什麼？',
        options: ['stopped', 'stoped', 'stopd', 'stopied'],
        answer: 0,
        why: [
          null,
          '短母音加單子音時要重複字尾。',
          '這個拼法不符合規則。',
          '字尾不是 y，不能改成 ied。'
        ]
      }
    },
    {
      title: '② ed 的三種發音',
      body: '字尾是無聲子音（p、k、f、s、sh、ch）→ 唸 t（stopped、watched）\n' +
            '字尾是 t 或 d → 唸 id（wanted、needed）\n' +
            '其他（有聲）→ 唸 d（played、lived）\n' +
            '⚠ 拼法都一樣，發音靠字尾的音決定。',
      viz: { type: 'classify', groups: [
        { label: '唸 t', items: ['stopped', 'watched', 'washed'] },
        { label: '唸 id', items: ['wanted', 'needed', 'started'] },
        { label: '唸 d', items: ['played', 'lived', 'opened'] }] },
      check: {
        q: 'wanted 的字尾 ed 要怎麼發音？',
        options: [
          '發成 id 這個音節',
          '發成 t',
          '發成 d',
          '不發音'
        ],
        answer: 0,
        why: [
          null,
          '字尾是 t 時要多發一個音節。',
          '字尾是 t 或 d 時不會只發 d。',
          'ed 在過去式裡一定要發音。'
        ]
      }
    },
    {
      title: '③ 否定句用 didn’t',
      body: 'I didn’t go.（不是 didn’t went）\n' +
            '★ did 已經帶走了過去的意思，主要動詞回到原形。\n' +
            '⚠ 這和現在式的 doesn’t 是同一個道理。',
      viz: { type: 'sentence', label: '過去式否定', items: [
        { t: 'I', r: '主詞' }, { t: 'didn’t', r: '助動詞（已表過去）' },
        { t: 'watch', r: '原形動詞' }],
        note: '過去的訊息只出現一次，在助動詞上。' },
      check: {
        q: '「他昨天沒有打電話給我」的正確說法是什麼？',
        options: [
          'He didn’t call me yesterday.',
          'He didn’t called me yesterday.',
          'He don’t call me yesterday.',
          'He wasn’t call me yesterday.'
        ],
        answer: 0,
        why: [
          null,
          '有了 didn’t，動詞要用原形。',
          'don’t 是現在式，與 yesterday 不合。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '④ 疑問句用 Did',
      body: 'Did you watch the game?→ Yes, I did.／No, I didn’t.\n' +
            '⚠ 同樣的規則：Did 之後動詞回到原形。',
      viz: { type: 'energyflow', steps: ['You watched the game.', '過去移到助動詞上', 'Did you watch the game?', 'Yes, I did.'] },
      check: {
        q: '下列哪一個疑問句正確？',
        options: [
          'Did she finish her homework?',
          'Did she finished her homework?',
          'Does she finished her homework?',
          'Was she finish her homework?'
        ],
        answer: 0,
        why: [
          null,
          '有了 did，動詞要用原形。',
          'does 是現在式，動詞也要用原形。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    },
    {
      title: '⑤ 過去式的用法',
      body: '① 過去某個時間發生並結束的事：I visited Japan last year.\n' +
            '② 過去的習慣：I played basketball every day when I was ten.\n' +
            '⚠ 過去式強調「已經結束」，與現在沒有直接關聯。',
      viz: { type: 'tense', verb: 'play', highlight: '過去簡單式', pick: false },
      check: {
        q: '下列哪一句適合用過去簡單式？',
        options: [
          'I visited my grandma last Sunday.',
          'I visit my grandma every Sunday.',
          'I am visiting my grandma now.',
          'I will visit my grandma tomorrow.'
        ],
        answer: 0,
        why: [
          null,
          'every Sunday 是習慣，用現在簡單式。',
          '有 now 要用現在進行式。',
          '有 tomorrow 要用未來式。'
        ]
      }
    },
    {
      title: '⑥ 檢查清單',
      body: '寫過去式的句子時檢查三件事：\n' +
            '① 有沒有過去的時間副詞\n' +
            '② 動詞有沒有改成過去式\n' +
            '③ 否定與疑問有沒有用 did 並把動詞改回原形\n' +
            '⚠ 一個句子裡「過去」只需標示一次。',
      viz: { type: 'energyflow', steps: ['看時間副詞', '改動詞', '否定疑問用 did', '動詞回原形'] },
      check: {
        q: '寫過去式的否定句時，最常見的錯誤是什麼？',
        options: [
          '用了 didn’t 之後還把動詞改成過去式',
          '在句尾加時間副詞',
          '主詞用了代名詞',
          '句首字母大寫'
        ],
        answer: 0,
        why: [
          null,
          '句尾加時間副詞是正常的寫法。',
          '主詞用代名詞完全正確。',
          '句首大寫是基本的書寫規則。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|七下|第9單元 不規則動詞過去式'] = {
  intro: '不規則動詞背起來很煩，但依變化型態分組就好記多了。',
  cards: [
    {
      title: '① 三態都一樣',
      body: 'cut－cut－cut　　put－put－put\n' +
            'hit－hit－hit　　cost－cost－cost　　let－let－let\n' +
            '⚠ 這一組最好記：完全不變。\n' +
            '判斷時態要靠句子裡的時間副詞。',
      viz: { type: 'classify', groups: [
        { label: '三態相同', items: ['cut', 'put', 'hit', 'cost', 'let', 'hurt'] }] },
      check: {
        q: 'I ___ my finger yesterday.（cut 的過去式）空格要填什麼？',
        options: ['cut', 'cutted', 'cuted', 'cutting'],
        answer: 0,
        why: [
          null,
          'cut 是不規則動詞，不加 ed。',
          '這個拼法並不存在。',
          '進行式的形式與這個句子不合。'
        ]
      }
    },
    {
      title: '② 過去式與過去分詞相同',
      body: 'buy－bought－bought　　teach－taught－taught\n' +
            'find－found－found　　make－made－made\n' +
            'have－had－had　　say－said－said\n' +
            '⚠ 只要記兩個形式就夠。',
      viz: { type: 'classify', groups: [
        { label: 'ought／aught 型', items: ['bought', 'taught', 'caught', 'thought'] },
        { label: '其他', items: ['found', 'made', 'had', 'said'] }] },
      check: {
        q: 'teach 的過去式是什麼？',
        options: ['taught', 'teached', 'teachted', 'teach'],
        answer: 0,
        why: [
          null,
          'teach 是不規則動詞，不加 ed。',
          '這個拼法並不存在。',
          '過去式需要有形式變化。'
        ]
      }
    },
    {
      title: '③ 三態都不同',
      body: 'go－went－gone　　eat－ate－eaten　　see－saw－seen\n' +
            'write－wrote－written　　speak－spoke－spoken\n' +
            'take－took－taken　　give－gave－given\n' +
            '⚠ 這一組要完整記三個形式。',
      viz: { type: 'tense', verb: 'write', highlight: '過去簡單式', pick: false },
      check: {
        q: 'see 的過去式與過去分詞依序是什麼？',
        options: [
          'saw, seen',
          'seen, saw',
          'saw, saw',
          'seed, seen'
        ],
        answer: 0,
        why: [
          null,
          '兩個形式的順序顛倒了。',
          'see 的三態各不相同。',
          'see 是不規則動詞，不加 ed。'
        ]
      }
    },
    {
      title: '④ 母音變化的規律',
      body: 'i → a → u：sing－sang－sung、drink－drank－drunk、swim－swam－swum\n' +
            'i → o → i(t)：write－wrote－written、drive－drove－driven\n' +
            '⚠ 找出母音的規律，一次記一整組。',
      viz: { type: 'classify', groups: [
        { label: 'i／a／u 型', items: ['sing sang sung', 'drink drank drunk', 'swim swam swum', 'begin began begun'] }] },
      check: {
        q: 'drink 的過去式是什麼？',
        options: ['drank', 'drunk', 'drinked', 'drink'],
        answer: 0,
        why: [
          null,
          'drunk 是過去分詞，不是過去式。',
          'drink 是不規則動詞，不加 ed。',
          '過去式需要有形式變化。'
        ]
      }
    },
    {
      title: '⑤ 最常用的幾個',
      body: 'be－was／were－been　　do－did－done\n' +
            'have－had－had　　go－went－gone　　get－got－gotten\n' +
            '⚠ 這幾個出現頻率最高，一定要背到滾瓜爛熟。',
      viz: { type: 'classify', groups: [
        { label: '出現頻率最高', items: ['be', 'do', 'have', 'go', 'get', 'make', 'take'] }] },
      check: {
        q: 'do 的過去式是什麼？',
        options: ['did', 'done', 'doed', 'does'],
        answer: 0,
        why: [
          null,
          'done 是過去分詞。',
          'do 是不規則動詞，不加 ed。',
          'does 是現在式的第三人稱單數形。'
        ]
      }
    },
    {
      title: '⑥ 別忘了 didn’t 之後用原形',
      body: '✗ I didn’t went.→ ✓ I didn’t go.\n' +
            '✗ Did you saw it?→ ✓ Did you see it?\n' +
            '⚠ 不規則動詞的規則和規則動詞完全一樣：\n' +
            '有了 did，主要動詞就回到原形。',
      viz: { type: 'energyflow', steps: ['肯定：I went.', '否定：I didn’t go.', '疑問：Did you go?', '動詞一律回原形'] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'Did you see the movie?',
          'Did you saw the movie?',
          'Did you seen the movie?',
          'Do you saw the movie?'
        ],
        answer: 0,
        why: [
          null,
          '有了 did，動詞要用原形。',
          'seen 是過去分詞，不能接在 did 後面。',
          'do 是現在式，動詞也要用原形。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第1單元 未來式'] = {
  intro: '講未來有兩種主要說法，差別在「什麼時候決定的」。',
  cards: [
    {
      title: '① will 的基本用法',
      body: '主詞 ＋ will ＋ 原形動詞\n' +
            'I will call you tonight.／She will be here soon.\n' +
            '否定：won’t（will not）　疑問：Will you…?\n' +
            '⚠ will 是助動詞，不隨主詞變化。',
      viz: { type: 'tense', verb: 'go', highlight: '未來式', pick: false },
      check: {
        q: '下列哪一句正確？',
        options: [
          'She will come tomorrow.',
          'She wills come tomorrow.',
          'She will comes tomorrow.',
          'She will to come tomorrow.'
        ],
        answer: 0,
        why: [
          null,
          '助動詞不隨主詞加 s。',
          'will 後面要接原形動詞。',
          'will 後面不加 to。'
        ]
      }
    },
    {
      title: '② be going to',
      body: '主詞 ＋ be 動詞 ＋ going to ＋ 原形動詞\n' +
            'I am going to study abroad.（我打算出國念書。）\n' +
            '⚠ be 動詞要隨主詞變：am／is／are going to。',
      viz: { type: 'sentence', label: 'be going to 結構', items: [
        { t: 'I', r: '主詞' }, { t: 'am going to', r: 'be 動詞加 going to' },
        { t: 'study', r: '原形動詞' }],
        note: 'be 動詞隨主詞變化。' },
      check: {
        q: 'He ___ going to buy a car. 空格要填什麼？',
        options: ['is', 'are', 'am', 'will'],
        answer: 0,
        why: [
          null,
          '主詞是第三人稱單數，要用 is。',
          'am 只跟 I 搭配。',
          'will 不能和 going to 一起用。'
        ]
      }
    },
    {
      title: '③ 兩者的差別',
      body: 'will：說話當下才決定，或單純預測\n' +
            '　　（電話響了）I’ll get it!\n' +
            'be going to：早就計畫好，或有明顯跡象\n' +
            '　　Look at the clouds. It is going to rain.\n' +
            '⚠ 判斷關鍵：「什麼時候決定的」與「有沒有跡象」。',
      viz: { type: 'compareexp',
             factor: '決定的時間點',
             a: { label: 'will', note: '當下決定或預測' },
             b: { label: 'be going to', note: '事先計畫或有跡象' },
             same: ['都指未來的事'] },
      check: {
        q: '看到滿天烏雲，說「要下雨了」比較自然的說法是什麼？',
        options: [
          'It is going to rain.',
          'It rains.',
          'It rained.',
          'It is raining every day.'
        ],
        answer: 0,
        why: [
          null,
          '現在簡單式表示習慣或事實。',
          '過去式與眼前的情境不符。',
          '這句在講每天的習慣，語意不合。'
        ]
      }
    },
    {
      title: '④ 用現在式表示未來',
      body: '① 時刻表：The train leaves at six.（火車六點開。）\n' +
            '② 現在進行式表示已安排的計畫：I am meeting him at five.\n' +
            '⚠ 越確定的未來，越可能用現在式表達。',
      viz: { type: 'energyflow', steps: ['will（不確定或當下決定）', 'be going to（有計畫）', '現在進行式（已安排）', '現在簡單式（時刻表，最確定）'] },
      check: {
        q: '「這班公車七點發車」（時刻表）最自然的說法是什麼？',
        options: [
          'The bus leaves at seven.',
          'The bus will leaving at seven.',
          'The bus is leave at seven.',
          'The bus leave at seven.'
        ],
        answer: 0,
        why: [
          null,
          'will 後面要接原形動詞。',
          'be 動詞後面不能直接接原形動詞。',
          '第三人稱單數的動詞要加 s。'
        ]
      }
    },
    {
      title: '⑤ 未來的時間副詞',
      body: 'tomorrow、next week、soon、in three days、later\n' +
            '⚠ in three days ＝ 三天後（不是三天內）；\n' +
            '注意 in 在未來式裡表示「經過多久之後」。',
      viz: { type: 'classify', groups: [
        { label: '未來的訊號字', items: ['tomorrow', 'next month', 'soon', 'in two hours'] },
        { label: '過去的訊號字', items: ['yesterday', 'last week', 'two days ago'] }] },
      check: {
        q: 'I will be back in ten minutes. 這句話的意思是什麼？',
        options: [
          '十分鐘後我會回來',
          '我在十分鐘之內都會在',
          '我十分鐘前回來了',
          '我每十分鐘回來一次'
        ],
        answer: 0,
        why: [
          null,
          '這個句型指的是經過十分鐘之後。',
          '句子用的是未來式。',
          '句中沒有表示重複的字。'
        ]
      }
    },
    {
      title: '⑥ 時間與條件子句用現在式',
      body: '★ when、if、before、after 引導的子句裡，\n' +
            '要用現在式代替未來式：\n' +
            'I will call you when I arrive.（不是 when I will arrive）\n' +
            '⚠ 主要子句用 will，附屬子句用現在式。',
      viz: { type: 'sentence', label: '主句與附屬子句', items: [
        { t: 'I will call you', r: '主要子句（用 will）' },
        { t: 'when I arrive', r: '附屬子句（用現在式）' }],
        note: '時間與條件子句裡不用 will。' },
      check: {
        q: 'If it ___ tomorrow, we will stay home. 空格要填什麼？',
        options: ['rains', 'will rain', 'is raining will', 'rained'],
        answer: 0,
        why: [
          null,
          '條件子句裡不用 will。',
          '這個形式重複了助動詞。',
          '過去式與明天的情境不符。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第2單元 比較級'] = {
  intro: '兩個東西比一比，形容詞要變形。',
  cards: [
    {
      title: '① 基本句型',
      body: 'A ＋ be 動詞 ＋ 比較級 ＋ than ＋ B\n' +
            'John is taller than Mike.\n' +
            '⚠ 比較級一定要有 than，除非上下文已經很清楚。',
      viz: { type: 'sentence', label: '比較級句型', items: [
        { t: 'John is', r: '主詞加 be 動詞' }, { t: 'taller', r: '比較級' },
        { t: 'than Mike', r: '比較的對象' }],
        note: '比較級後面用 than 接對象。' },
      check: {
        q: '下列哪一句正確？',
        options: [
          'She is smarter than her brother.',
          'She is more smart than her brother.',
          'She is smarter then her brother.',
          'She is smart than her brother.'
        ],
        answer: 0,
        why: [
          null,
          '短形容詞用 er 而不是 more。',
          'then 是「然後」，比較要用 than。',
          '比較句要用比較級形式。'
        ]
      }
    },
    {
      title: '② 短形容詞加 er',
      body: '一般：tall→taller\n' +
            '字尾 e：只加 r（nice→nicer）\n' +
            '子音加 y：y 改 ier（happy→happier）\n' +
            '短母音加單子音：重複字尾（big→bigger、hot→hotter）',
      viz: { type: 'classify', groups: [
        { label: '加 er', items: ['taller', 'longer', 'faster'] },
        { label: 'y 改 ier', items: ['happier', 'easier', 'busier'] },
        { label: '重複字尾', items: ['bigger', 'hotter', 'thinner'] }] },
      check: {
        q: 'hot 的比較級是什麼？',
        options: ['hotter', 'hoter', 'more hot', 'hottest'],
        answer: 0,
        why: [
          null,
          '短母音加單子音要重複字尾。',
          '單音節形容詞用 er 而不是 more。',
          '這是最高級的形式。'
        ]
      }
    },
    {
      title: '③ 長形容詞用 more',
      body: '三音節以上，或多數兩音節的形容詞用 more：\n' +
            'more beautiful、more expensive、more interesting\n' +
            '⚠ 不能兩個都用：\n' +
            '✗ more taller　✗ more prettier',
      viz: { type: 'compareexp',
             factor: '音節長短',
             a: { label: '短形容詞', note: '加 er：taller、bigger' },
             b: { label: '長形容詞', note: '用 more：more beautiful' },
             same: ['後面都接 than'] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'This book is more interesting than that one.',
          'This book is interestinger than that one.',
          'This book is more interestinger than that one.',
          'This book is most interesting than that one.'
        ],
        answer: 0,
        why: [
          null,
          '長形容詞不加 er。',
          '不能同時用 more 和 er。',
          'most 是最高級，不能配 than。'
        ]
      }
    },
    {
      title: '④ 不規則變化',
      body: 'good／well → better\n' +
            'bad／badly → worse\n' +
            'many／much → more\n' +
            'little → less\n' +
            'far → farther（距離）／further（程度）',
      viz: { type: 'classify', groups: [
        { label: '不規則比較級', items: ['better', 'worse', 'more', 'less', 'farther'] }] },
      check: {
        q: 'good 的比較級是什麼？',
        options: ['better', 'gooder', 'more good', 'best'],
        answer: 0,
        why: [
          null,
          'good 是不規則變化，不加 er。',
          '不規則形容詞不用 more。',
          'best 是最高級。'
        ]
      }
    },
    {
      title: '⑤ 加強語氣',
      body: 'much／far／a lot ＋ 比較級：much bigger（大得多）\n' +
            'a little／a bit ＋ 比較級：a little taller（高一點）\n' +
            '⚠ ✗ very bigger（very 不能修飾比較級）。',
      viz: { type: 'energyflow', steps: ['a little bigger（一點點）', 'bigger（比較大）', 'much bigger（大得多）', 'far bigger（大很多）'] },
      check: {
        q: '「這個大得多」的正確說法是什麼？',
        options: [
          'This one is much bigger.',
          'This one is very bigger.',
          'This one is more bigger.',
          'This one is too bigger.'
        ],
        answer: 0,
        why: [
          null,
          'very 不能修飾比較級。',
          '不能同時用 more 和 er。',
          'too 不用來修飾比較級。'
        ]
      }
    },
    {
      title: '⑥ 其他比較句型',
      body: 'as ＋ 原級 ＋ as：as tall as（和…一樣高）\n' +
            'not as ＋ 原級 ＋ as：not as tall as（沒有…高）\n' +
            '比較級 ＋ and ＋ 比較級：hotter and hotter（越來越熱）\n' +
            'The ＋ 比較級, the ＋ 比較級：The more, the better.',
      viz: { type: 'classify', groups: [
        { label: '一樣（原級）', items: ['as tall as', 'as big as'] },
        { label: '不一樣（比較級）', items: ['taller than', 'bigger than'] }] },
      check: {
        q: '「他和我一樣高」的正確說法是什麼？',
        options: [
          'He is as tall as I am.',
          'He is as taller as I am.',
          'He is as tall than I am.',
          'He is so tall as me is.'
        ],
        answer: 0,
        why: [
          null,
          'as 之間要用原級形容詞。',
          'as 的句型不用 than。',
          '這個句子的結構不正確。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第3單元 最高級'] = {
  intro: '三者以上比較，選出「最」的那一個。',
  cards: [
    {
      title: '① 基本句型',
      body: 'the ＋ 最高級 ＋ in／of ＋ 範圍\n' +
            'He is the tallest in his class.\n' +
            'She is the smartest of the three.\n' +
            '⚠ 最高級前面幾乎一定要加 the。',
      viz: { type: 'sentence', label: '最高級句型', items: [
        { t: 'the tallest', r: '最高級（要加 the）' },
        { t: 'in his class', r: '比較的範圍' }],
        note: '最高級前面要加 the。' },
      check: {
        q: '下列哪一句正確？',
        options: [
          'He is the fastest runner in our school.',
          'He is fastest runner in our school.',
          'He is the faster runner in our school.',
          'He is the most fast runner in our school.'
        ],
        answer: 0,
        why: [
          null,
          '最高級前面要加 the。',
          '三者以上比較要用最高級。',
          '短形容詞用 est 而不是 most。'
        ]
      }
    },
    {
      title: '② in 與 of 的差別',
      body: 'in ＋ 地方或團體：in the class、in Taiwan\n' +
            'of ＋ 同類的複數：of the three、of all the students\n' +
            '⚠ 判斷方法：後面是「範圍」用 in，是「群體成員」用 of。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: 'in', note: '接地點或團體：in my family' },
             b: { label: 'of', note: '接同類的複數：of the four' },
             same: ['都在指定比較的範圍'] },
      check: {
        q: 'She is the youngest ___ the five sisters. 空格要填什麼？',
        options: ['of', 'in', 'at', 'on'],
        answer: 0,
        why: [
          null,
          'in 後面接地點或團體。',
          'at 用於具體的定點。',
          'on 用於表面或日期。'
        ]
      }
    },
    {
      title: '③ 變化規則',
      body: '短形容詞加 est：tallest、biggest、happiest\n' +
            '長形容詞用 most：the most beautiful\n' +
            '不規則：good→best、bad→worst、many→most、little→least\n' +
            '⚠ 規則和比較級完全對應。',
      viz: { type: 'classify', groups: [
        { label: '原級／比較級／最高級', items: ['tall taller tallest', 'good better best', 'bad worse worst'] }] },
      check: {
        q: 'bad 的最高級是什麼？',
        options: ['worst', 'baddest', 'most bad', 'worse'],
        answer: 0,
        why: [
          null,
          'bad 是不規則變化，不加 est。',
          '不規則形容詞不用 most。',
          'worse 是比較級。'
        ]
      }
    },
    {
      title: '④ 加序數表示「第幾」',
      body: 'the second largest city（第二大的城市）\n' +
            'the third longest river\n' +
            '⚠ 序數放在 the 和最高級中間。',
      viz: { type: 'sentence', label: '第幾名', items: [
        { t: 'the', r: '定冠詞' }, { t: 'second', r: '序數' },
        { t: 'largest', r: '最高級' }, { t: 'city', r: '名詞' }],
        note: '序數放在最高級前面。' },
      check: {
        q: '「第二高的建築」的正確說法是什麼？',
        options: [
          'the second tallest building',
          'the tallest second building',
          'second the tallest building',
          'the two tallest building'
        ],
        answer: 0,
        why: [
          null,
          '序數要放在最高級前面。',
          '定冠詞要放在最前面。',
          '這裡要用序數而不是基數。'
        ]
      }
    },
    {
      title: '⑤ one of the 最高級',
      body: 'one of the ＋ 最高級 ＋ 複數名詞\n' +
            'It is one of the best movies I have ever seen.\n' +
            '⚠ 後面的名詞一定要用複數（是「其中之一」）。',
      viz: { type: 'sentence', label: '其中之一', items: [
        { t: 'one of', r: '其中之一' }, { t: 'the best', r: '最高級' },
        { t: 'movies', r: '複數名詞' }],
        note: '這個句型後面的名詞要用複數。' },
      check: {
        q: '下列哪一句正確？',
        options: [
          'She is one of the smartest students in class.',
          'She is one of the smartest student in class.',
          'She is one of smartest students in class.',
          'She is the one of smartest students.'
        ],
        answer: 0,
        why: [
          null,
          '這個句型後面要用複數名詞。',
          '最高級前面要加 the。',
          '這個句子的冠詞位置不正確。'
        ]
      }
    },
    {
      title: '⑥ 用比較級表達最高級',
      body: 'He is taller than any other student in his class.\n' +
            '＝ He is the tallest student in his class.\n' +
            '⚠ any other 後面接單數名詞，\n' +
            '這是換句話說的常見考點。',
      viz: { type: 'compareexp',
             factor: '兩種表達',
             a: { label: '最高級', note: 'the tallest in his class' },
             b: { label: '比較級加 any other', note: 'taller than any other student' },
             same: ['意思完全相同'] },
      check: {
        q: 'He runs faster than any other boy in his class. 這句話的意思是什麼？',
        options: [
          '他是班上跑最快的男生',
          '他跑得比某個男生快',
          '他跑得比別班的男生快',
          '他跑得和別人一樣快'
        ],
        answer: 0,
        why: [
          null,
          'any other 指的是所有其他人。',
          '句中的範圍是他自己的班上。',
          '這個句型表達的是差異而不是相同。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第4單元 動名詞'] = {
  intro: '動詞加 ing 之後可以當名詞用，這就是動名詞。',
  cards: [
    {
      title: '① 什麼是動名詞',
      body: '動詞 ＋ ing ＝ 名詞的功能\n' +
            'Swimming is fun.（游泳很有趣。）→ 當主詞\n' +
            'I like swimming.→ 當受詞\n' +
            '⚠ 動名詞當主詞時視為單數，動詞用單數形。',
      viz: { type: 'sentence', label: '動名詞當主詞', items: [
        { t: 'Swimming', r: '動名詞（視為單數）' }, { t: 'is', r: '單數動詞' },
        { t: 'fun', r: '補語' }],
        note: '動名詞當主詞時動詞用單數。' },
      check: {
        q: 'Reading books ___ good for you. 空格要填什麼？',
        options: ['is', 'are', 'be', 'were'],
        answer: 0,
        why: [
          null,
          '主詞是動名詞，視為單數。',
          'be 是原形，句子需要現在式。',
          '句子講的是一般的道理，不用過去式。'
        ]
      }
    },
    {
      title: '② 介系詞後面用動名詞',
      body: '★ 介系詞後面一定接名詞或動名詞，不能接原形動詞：\n' +
            'Thank you for helping me.\n' +
            'He is good at playing basketball.\n' +
            '⚠ 特別注意 to 有時是介系詞：look forward to seeing you。',
      viz: { type: 'sentence', label: '介系詞加動名詞', items: [
        { t: 'good at', r: '介系詞片語' }, { t: 'playing', r: '動名詞' }],
        note: '介系詞後面要用動名詞。' },
      check: {
        q: 'She is interested in ___ Japanese. 空格要填什麼？',
        options: ['learning', 'learn', 'to learn', 'learns'],
        answer: 0,
        why: [
          null,
          '介系詞後面不能接原形動詞。',
          '介系詞後面不接不定詞。',
          '介系詞後面不接動詞的變化形。'
        ]
      }
    },
    {
      title: '③ 只接動名詞的動詞',
      body: 'enjoy、finish、mind、practice、keep、avoid、give up、suggest\n' +
            'I enjoy reading.（不是 enjoy to read）\n' +
            '⚠ 口訣：完成、享受、避免、練習的動詞多接動名詞。',
      viz: { type: 'classify', groups: [
        { label: '只接動名詞', items: ['enjoy', 'finish', 'mind', 'practice', 'avoid', 'keep'] },
        { label: '只接不定詞', items: ['want', 'hope', 'decide', 'plan'] }] },
      check: {
        q: 'I finished ___ my homework. 空格要填什麼？',
        options: ['doing', 'to do', 'do', 'did'],
        answer: 0,
        why: [
          null,
          'finish 後面只接動名詞。',
          'finish 後面不接原形動詞。',
          '這個形式不能接在 finished 後面。'
        ]
      }
    },
    {
      title: '④ 兩者都可以的動詞',
      body: 'like、love、hate、start、begin、continue 後面兩種都行：\n' +
            'I like swimming. ＝ I like to swim.\n' +
            '⚠ 意思幾乎相同，動名詞略偏「一般的喜好」，\n' +
            '不定詞略偏「特定的一次」。',
      viz: { type: 'compareexp',
             factor: '語感差別',
             a: { label: 'like ＋ 動名詞', note: '一般的喜好、習慣' },
             b: { label: 'like ＋ 不定詞', note: '偏向特定的一次或選擇' },
             same: ['大多數情況兩者可互換'] },
      check: {
        q: '下列哪一個動詞後面兩種形式都可以？',
        options: ['like', 'enjoy', 'want', 'finish'],
        answer: 0,
        why: [
          null,
          'enjoy 後面只接動名詞。',
          'want 後面只接不定詞。',
          'finish 後面只接動名詞。'
        ]
      }
    },
    {
      title: '⑤ 意思會變的動詞',
      body: 'stop doing（停止做這件事）／stop to do（停下來去做另一件事）\n' +
            'remember doing（記得做過）／remember to do（記得要去做）\n' +
            'forget doing（忘了做過）／forget to do（忘了要去做）\n' +
            '⚠ 動名詞看向過去，不定詞看向未來。',
      viz: { type: 'compareexp',
             factor: '時間方向',
             a: { label: '接動名詞', note: '指已經做過的事' },
             b: { label: '接不定詞', note: '指還沒做的事' },
             same: ['同一個動詞，意思完全不同'] },
      check: {
        q: 'He stopped smoking. 這句話的意思是什麼？',
        options: [
          '他戒菸了',
          '他停下來去抽菸',
          '他正在抽菸',
          '他想開始抽菸'
        ],
        answer: 0,
        why: [
          null,
          '停下來去抽菸要說 stopped to smoke。',
          '這句話表示動作已經停止。',
          '句子表達的是停止而不是開始。'
        ]
      }
    },
    {
      title: '⑥ 動名詞的常見片語',
      body: 'go ＋ 動名詞（活動）：go shopping、go swimming、go fishing\n' +
            'be busy ＋ 動名詞：I am busy preparing for the test.\n' +
            'How about ＋ 動名詞：How about going out?\n' +
            '⚠ 這些是固定用法，直接整組記。',
      viz: { type: 'classify', groups: [
        { label: '固定接動名詞的片語', items: ['go shopping', 'be busy doing', 'How about…?', 'It is no use…'] }] },
      check: {
        q: 'How about ___ to the movies? 空格要填什麼？',
        options: ['going', 'go', 'to go', 'goes'],
        answer: 0,
        why: [
          null,
          'about 是介系詞，後面要接動名詞。',
          '介系詞後面不接不定詞。',
          '介系詞後面不接動詞的變化形。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第5單元 不定詞'] = {
  intro: 'to 加原形動詞，可以當名詞、形容詞或副詞用。',
  cards: [
    {
      title: '① 三種角色',
      body: '名詞：To learn English is important.（當主詞）\n' +
            '形容詞：I have something to tell you.（修飾名詞）\n' +
            '副詞：I came here to see you.（表示目的）\n' +
            '⚠ 同一個形式，靠位置判斷它在做什麼。',
      viz: { type: 'classify', groups: [
        { label: '當名詞', items: ['To swim is fun.', 'I want to go.'] },
        { label: '當形容詞', items: ['something to eat', 'a book to read'] },
        { label: '當副詞（目的）', items: ['I study to pass.'] }] },
      check: {
        q: 'I need something to drink. 這裡的 to drink 在做什麼？',
        options: [
          '修飾前面的 something',
          '當句子的主詞',
          '表示目的',
          '當動詞'
        ],
        answer: 0,
        why: [
          null,
          '句子的主詞是 I。',
          '這裡不是在說明為什麼要做某事。',
          '句子的動詞是 need。'
        ]
      }
    },
    {
      title: '② 只接不定詞的動詞',
      body: 'want、hope、decide、plan、promise、agree、need、learn\n' +
            'I want to go.（不是 want going）\n' +
            '⚠ 口訣：計畫、希望、決定的動詞多接不定詞，\n' +
            '因為它們指的都是「還沒做的事」。',
      viz: { type: 'compareexp',
             factor: '事情做了沒',
             a: { label: '接不定詞', note: '還沒發生：want to go' },
             b: { label: '接動名詞', note: '已經在做或做過：enjoy going' },
             same: ['都放在主要動詞後面'] },
      check: {
        q: 'They decided ___ early. 空格要填什麼？',
        options: ['to leave', 'leaving', 'leave', 'left'],
        answer: 0,
        why: [
          null,
          'decide 後面只接不定詞。',
          'decide 後面不接原形動詞。',
          'decide 後面不接過去式。'
        ]
      }
    },
    {
      title: '③ 用 It 當虛主詞',
      body: 'To learn English is important.\n' +
            '→ It is important to learn English.（更常用）\n' +
            '⚠ 主詞太長時，用 it 放在前面，真正的主詞移到後面。',
      viz: { type: 'sentence', label: '虛主詞句型', items: [
        { t: 'It is', r: '虛主詞加 be 動詞' }, { t: 'important', r: '形容詞' },
        { t: 'to learn English', r: '真正的主詞' }],
        note: 'it 代替後面的不定詞片語。' },
      check: {
        q: '「早起很重要」用虛主詞怎麼說？',
        options: [
          'It is important to get up early.',
          'It is important getting up early.',
          'That is important to get up early.',
          'It is important that get up early.'
        ],
        answer: 0,
        why: [
          null,
          '虛主詞句型後面接不定詞。',
          '虛主詞要用 it。',
          'that 子句裡需要有主詞。'
        ]
      }
    },
    {
      title: '④ 表示目的',
      body: 'I got up early to catch the train.\n' +
            '＝ in order to catch／so as to catch\n' +
            '⚠ 想確認是不是表示目的，就在前面加「為了」，\n' +
            '讀得通就是目的用法。',
      viz: { type: 'classify', groups: [
        { label: '表示目的的說法', items: ['to catch', 'in order to catch', 'so as to catch'] }] },
      check: {
        q: 'She studies hard to enter a good school. 這裡的不定詞表示什麼？',
        options: [
          '目的：為了進好學校',
          '結果：她進了好學校',
          '原因：因為學校很好',
          '時間：進學校的時候'
        ],
        answer: 0,
        why: [
          null,
          '句子沒有說她已經進去了。',
          '不定詞在這裡不表示原因。',
          '不定詞在這裡不表示時間。'
        ]
      }
    },
    {
      title: '⑤ 疑問詞加不定詞',
      body: 'I don’t know what to do.（不知道該做什麼。）\n' +
            'Can you tell me how to get there?\n' +
            '⚠ 疑問詞 ＋ to ＋ 原形動詞，等於一個名詞子句的縮短版。',
      viz: { type: 'sentence', label: '疑問詞加不定詞', items: [
        { t: 'I don’t know', r: '主要句子' }, { t: 'what to do', r: '疑問詞加不定詞' }],
        note: '這個結構等於一個受詞。' },
      check: {
        q: '「我不知道該怎麼去」的正確說法是什麼？',
        options: [
          'I don’t know how to get there.',
          'I don’t know how get there.',
          'I don’t know how to getting there.',
          'I don’t know to how get there.'
        ],
        answer: 0,
        why: [
          null,
          '疑問詞後面要加 to。',
          'to 後面要接原形動詞。',
          '疑問詞要放在 to 前面。'
        ]
      }
    },
    {
      title: '⑥ 不加 to 的情況',
      body: '助動詞後面：can go、will come、must study\n' +
            '使役動詞：make／let／have ＋ 受詞 ＋ 原形動詞\n' +
            '感官動詞：see／hear／watch ＋ 受詞 ＋ 原形動詞\n' +
            '⚠ 這些情況叫原形不定詞，to 要省略。',
      viz: { type: 'compareexp',
             factor: '要不要加 to',
             a: { label: '一般動詞後', note: 'want to go（要加 to）' },
             b: { label: '使役與感官動詞後', note: 'make him go（不加 to）' },
             same: ['後面都是動詞的原形'] },
      check: {
        q: 'My mom made me ___ my room. 空格要填什麼？',
        options: ['clean', 'to clean', 'cleaning', 'cleaned'],
        answer: 0,
        why: [
          null,
          '使役動詞 make 後面不加 to。',
          '這個位置要用原形動詞。',
          '這個位置不用過去式。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第6單元 連綴動詞與感官動詞'] = {
  intro: '有一類動詞不接受詞，而是接形容詞來描述主詞。',
  cards: [
    {
      title: '① 什麼是連綴動詞',
      body: 'be、become、get、turn、grow ＋ 形容詞\n' +
            'He became famous.／It is getting cold.\n' +
            '⚠ 連綴動詞不表示動作，只是把主詞和描述連起來。',
      viz: { type: 'sentence', label: '連綴動詞結構', items: [
        { t: 'He', r: '主詞' }, { t: 'became', r: '連綴動詞' },
        { t: 'famous', r: '形容詞（描述主詞）' }],
        note: '連綴動詞後面接形容詞而不是副詞。' },
      check: {
        q: 'The weather is getting ___. 空格要填什麼？',
        options: ['warmer', 'warmly', 'warmth', 'to warm'],
        answer: 0,
        why: [
          null,
          '連綴動詞後面要接形容詞不是副詞。',
          'warmth 是名詞，語意不通。',
          '這裡不需要不定詞。'
        ]
      }
    },
    {
      title: '② 五種感官動詞',
      body: 'look（看起來）　sound（聽起來）　smell（聞起來）\n' +
            'taste（嚐起來）　feel（摸起來、覺得）\n' +
            '★ 後面直接接形容詞：It smells good.\n' +
            '⚠ ✗ It smells well.（well 是副詞）',
      viz: { type: 'classify', groups: [
        { label: '感官連綴動詞', items: ['look', 'sound', 'smell', 'taste', 'feel'] },
        { label: '後面接形容詞', items: ['looks tired', 'sounds great', 'tastes sweet'] }] },
      check: {
        q: 'You look ___ today. 空格要填什麼？',
        options: ['tired', 'tiredly', 'tiring me', 'to tire'],
        answer: 0,
        why: [
          null,
          '感官動詞後面要接形容詞。',
          '這個說法在句中不通順。',
          '這裡不需要不定詞。'
        ]
      }
    },
    {
      title: '③ 接名詞時要加 like',
      body: 'It looks like a cat.（看起來像貓。）\n' +
            'It sounds like a good idea.\n' +
            '⚠ 後面接形容詞 → 不加 like；\n' +
            '後面接名詞 → 一定要加 like。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: '接形容詞', note: 'It looks nice.（不加 like）' },
             b: { label: '接名詞', note: 'It looks like a toy.（要加 like）' },
             same: ['都在描述主詞給人的感覺'] },
      check: {
        q: 'That ___ a great plan. 空格要填什麼？',
        options: [
          'sounds like',
          'sounds',
          'sounds as',
          'is sound like'
        ],
        answer: 0,
        why: [
          null,
          '後面接名詞時要加 like。',
          'as 在這個句型裡不適用。',
          '這個句子多了 be 動詞。'
        ]
      }
    },
    {
      title: '④ 感官動詞的另一種用法',
      body: 'see／hear／watch／feel ＋ 受詞 ＋ 原形動詞或動詞 ing\n' +
            'I saw him cross the street.（看到整個過程）\n' +
            'I saw him crossing the street.（看到正在進行的一瞬間）\n' +
            '⚠ 原形強調完整，ing 強調當下正在進行。',
      viz: { type: 'compareexp',
             factor: '看到的範圍',
             a: { label: '接原形動詞', note: '看到動作從頭到尾' },
             b: { label: '接動詞 ing', note: '看到動作正在進行的片段' },
             same: ['都不加 to'] },
      check: {
        q: 'I heard someone ___ the piano when I passed by. 哪一個最合適？',
        options: [
          'playing',
          'to play',
          'played',
          'plays'
        ],
        answer: 0,
        why: [
          null,
          '感官動詞後面不加 to。',
          '這個位置不用過去式。',
          '這個位置不用第三人稱單數形。'
        ]
      }
    },
    {
      title: '⑤ 一字兩用',
      body: '同一個動詞可能是連綴動詞，也可能是一般動詞：\n' +
            'The soup tastes good.（連綴：湯嚐起來好吃）\n' +
            'She tasted the soup.（一般：她嚐了湯）\n' +
            '⚠ 有受詞就是一般動詞，接形容詞就是連綴動詞。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: '連綴用法', note: '接形容詞：tastes good' },
             b: { label: '一般用法', note: '接受詞：tasted the soup' },
             same: ['同一個動詞'] },
      check: {
        q: 'She felt the cloth carefully. 這裡的 felt 是哪一種用法？',
        options: [
          '一般動詞，後面有受詞',
          '連綴動詞，後面接形容詞',
          '助動詞',
          'be 動詞'
        ],
        answer: 0,
        why: [
          null,
          '句中 the cloth 是受詞而不是形容詞。',
          'felt 不是助動詞。',
          'felt 是 feel 的過去式，不是 be 動詞。'
        ]
      }
    },
    {
      title: '⑥ 最常考的陷阱',
      body: '✗ It tastes deliciously.→ ✓ It tastes delicious.\n' +
            '✗ He looks happily.→ ✓ He looks happy.\n' +
            '⚠ 檢查方法：把動詞換成 be 動詞讀讀看，\n' +
            '讀得通就要用形容詞。',
      viz: { type: 'energyflow', steps: ['看到 look／sound／taste', '把它換成 be 動詞', '讀得通就用形容詞', '要接名詞就加 like'] },
      check: {
        q: '判斷感官動詞後面該用形容詞還是副詞，最快的方法是什麼？',
        options: [
          '把動詞換成 be 動詞讀讀看，通順就用形容詞',
          '看句子有幾個字',
          '看主詞是不是複數',
          '看句尾有沒有句點'
        ],
        answer: 0,
        why: [
          null,
          '句子長度和詞性選擇無關。',
          '主詞單複數不影響這個判斷。',
          '標點符號和詞性選擇無關。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第7單元 對等連接詞'] = {
  intro: '對等連接詞把兩個地位相同的東西接在一起。',
  cards: [
    {
      title: '① 四個基本連接詞',
      body: 'and（並列）　but（轉折）　or（選擇）　so（結果）\n' +
            '⚠ 對等：前後接的東西詞性要一樣，\n' +
            '名詞配名詞、句子配句子。',
      viz: { type: 'classify', groups: [
        { label: '方向相同', items: ['and', 'so'] },
        { label: '方向相反或選擇', items: ['but', 'or'] }] },
      check: {
        q: 'I was tired, ___ I went to bed early. 空格要填什麼？',
        options: ['so', 'but', 'or', 'because'],
        answer: 0,
        why: [
          null,
          'but 表示轉折，這裡是因果。',
          'or 表示選擇，語意不通。',
          'because 引導原因，但位置與語意不符。'
        ]
      }
    },
    {
      title: '② 詞性要對等',
      body: '✓ I like swimming and running.（動名詞配動名詞）\n' +
            '✗ I like swimming and to run.\n' +
            '⚠ 這叫「平行結構」，是寫作的基本要求。',
      viz: { type: 'sentence', label: '平行結構', items: [
        { t: 'swimming', r: '動名詞' }, { t: 'and', r: '連接詞' },
        { t: 'running', r: '動名詞（形式相同）' }],
        note: '連接詞兩邊的形式要一致。' },
      check: {
        q: '下列哪一句符合平行結構？',
        options: [
          'She is smart, kind, and funny.',
          'She is smart, kind, and a funny person.',
          'She is smart, kindly, and funny.',
          'She is smart, being kind, and funny.'
        ],
        answer: 0,
        why: [
          null,
          '前兩個是形容詞，第三個變成名詞片語。',
          'kindly 是副詞，與形容詞不對等。',
          'being kind 的形式與形容詞不對等。'
        ]
      }
    },
    {
      title: '③ so 與 because 不能同時用',
      body: '中文說「因為…所以…」，英文只能擇一：\n' +
            '✓ Because it rained, we stayed home.\n' +
            '✓ It rained, so we stayed home.\n' +
            '✗ Because it rained, so we stayed home.',
      viz: { type: 'compareexp',
             factor: '從哪個角度說',
             a: { label: 'because', note: '先講原因：Because…, …' },
             b: { label: 'so', note: '先講原因再說結果：…, so…' },
             same: ['都在表達因果，但只能用一個'] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'Because he was sick, he stayed home.',
          'Because he was sick, so he stayed home.',
          'He was sick, because so he stayed home.',
          'So he was sick, because he stayed home.'
        ],
        answer: 0,
        why: [
          null,
          '中文的「因為所以」不能直接照搬。',
          '兩個連接詞不能連用。',
          '這句的因果關係顛倒了。'
        ]
      }
    },
    {
      title: '④ 相關連接詞',
      body: 'both A and B（兩者都）\n' +
            'either A or B（兩者之一）\n' +
            'neither A nor B（兩者都不）\n' +
            'not only A but also B（不只…而且）\n' +
            '⚠ A 和 B 的詞性同樣要對等。',
      viz: { type: 'classify', groups: [
        { label: '兩者都', items: ['both…and'] },
        { label: '二選一', items: ['either…or'] },
        { label: '都不', items: ['neither…nor'] }] },
      check: {
        q: '「他既不會唱歌也不會跳舞」的正確說法是什麼？',
        options: [
          'He can neither sing nor dance.',
          'He can neither sing or dance.',
          'He can either sing nor dance.',
          'He can not neither sing nor dance.'
        ],
        answer: 0,
        why: [
          null,
          'neither 要搭配 nor。',
          'either 要搭配 or。',
          'neither 已含否定，不能再加 not。'
        ]
      }
    },
    {
      title: '⑤ 動詞跟誰一致',
      body: 'both A and B → 複數動詞\n' +
            'either A or B／neither A nor B／not only A but also B → 動詞跟著 B\n' +
            'Neither he nor I am wrong.（動詞跟著 I）\n' +
            '⚠ 這叫「就近原則」，考試很愛考。',
      viz: { type: 'sentence', label: '就近原則', items: [
        { t: 'Neither he nor', r: '前面的不算' }, { t: 'I', r: '最靠近動詞的主詞' },
        { t: 'am wrong', r: '動詞跟著 I' }],
        note: '動詞跟著最靠近的主詞。' },
      check: {
        q: 'Either you or he ___ going to win. 空格要填什麼？',
        options: ['is', 'are', 'am', 'be'],
        answer: 0,
        why: [
          null,
          '動詞跟著最靠近的主詞 he。',
          'am 只跟 I 搭配。',
          'be 是原形，句子需要現在式。'
        ]
      }
    },
    {
      title: '⑥ 標點的規則',
      body: '連接兩個完整句子時，連接詞前面要加逗號：\n' +
            'I was tired, but I kept working.\n' +
            '連接的不是完整句子時不加逗號：\n' +
            'I like tea and coffee.',
      viz: { type: 'compareexp',
             factor: '後面是不是完整句子',
             a: { label: '加逗號', note: '接完整句子：…, but I stayed.' },
             b: { label: '不加逗號', note: '接詞或片語：tea and coffee' },
             same: ['都用對等連接詞'] },
      check: {
        q: '下列哪一句標點正確？',
        options: [
          'She studied hard, and she passed the test.',
          'She studied hard and, she passed the test.',
          'She likes, tea and coffee.',
          'She studied hard and she, passed the test.'
        ],
        answer: 0,
        why: [
          null,
          '逗號要放在連接詞前面。',
          '這裡連接的不是完整句子，不加逗號。',
          '逗號的位置不正確。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第8單元 附屬連接詞'] = {
  intro: '附屬連接詞帶出一個「不能單獨存在」的子句。',
  cards: [
    {
      title: '① 主句與附屬子句',
      body: 'When I got home, my mom was cooking.\n' +
            '★ When I got home 不能單獨成句，它是附屬子句；\n' +
            'my mom was cooking 才是主句。\n' +
            '⚠ 附屬子句放句首時，後面要加逗號。',
      viz: { type: 'sentence', label: '兩個部分', items: [
        { t: 'When I got home', r: '附屬子句（不能單獨存在）' },
        { t: 'my mom was cooking', r: '主句（可以單獨成句）' }],
        note: '附屬子句放句首時要加逗號。' },
      check: {
        q: '下列哪一個不能單獨成為一個句子？',
        options: [
          'Because he was late.',
          'He was late.',
          'He arrived at nine.',
          'The class started.'
        ],
        answer: 0,
        why: [
          null,
          '這是完整的句子。',
          '這是完整的句子。',
          '這是完整的句子。'
        ]
      }
    },
    {
      title: '② 時間類',
      body: 'when（當…時）　while（正當…時）　before／after\n' +
            'until（直到）　as soon as（一…就）　since（自從）\n' +
            '⚠ while 後面通常接進行式，when 兩種都可以。',
      viz: { type: 'classify', groups: [
        { label: '時間點', items: ['when', 'as soon as', 'before', 'after'] },
        { label: '持續期間', items: ['while', 'until', 'since'] }] },
      check: {
        q: '___ I was walking home, I met an old friend. 空格填什麼最合適？',
        options: ['While', 'Until', 'Because', 'Although'],
        answer: 0,
        why: [
          null,
          'until 表示直到某時，語意不通。',
          'because 表示原因，語意不合。',
          'although 表示讓步，語意不合。'
        ]
      }
    },
    {
      title: '③ 原因與結果',
      body: 'because、since、as（因為）\n' +
            'so ＋ 形容詞 ＋ that（如此…以致於）\n' +
            'He was so tired that he fell asleep.\n' +
            '⚠ so…that 中間放形容詞或副詞，\n' +
            'such…that 中間放名詞片語。',
      viz: { type: 'compareexp',
             factor: '中間放什麼',
             a: { label: 'so…that', note: '中間放形容詞：so tired that' },
             b: { label: 'such…that', note: '中間放名詞：such a good movie that' },
             same: ['都表示程度導致的結果'] },
      check: {
        q: 'It was ___ a good movie that I watched it twice. 空格要填什麼？',
        options: ['such', 'so', 'very', 'too'],
        answer: 0,
        why: [
          null,
          'so 後面要接形容詞而不是名詞片語。',
          'very 不能搭配 that 子句。',
          'too 的句型是 too…to，不搭配 that。'
        ]
      }
    },
    {
      title: '④ 讓步：雖然',
      body: 'although／though／even though（雖然）\n' +
            'Although he was tired, he kept working.\n' +
            '⚠ ✗ Although…, but…（中文的「雖然但是」不能照搬）\n' +
            '英文只能用一個連接詞。',
      viz: { type: 'compareexp',
             factor: '中文與英文的差別',
             a: { label: '中文', note: '雖然…但是…（兩個都要）' },
             b: { label: '英文', note: 'Although…, ….（只能用一個）' },
             same: ['都在表達轉折'] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'Although it rained, we went out.',
          'Although it rained, but we went out.',
          'Although it rained, so we went out.',
          'But although it rained, we went out too.'
        ],
        answer: 0,
        why: [
          null,
          'although 和 but 不能同時使用。',
          'although 表示轉折，不能配 so。',
          '句首多了不必要的連接詞。'
        ]
      }
    },
    {
      title: '⑤ 條件：如果',
      body: 'if（如果）　unless（除非，＝ if not）\n' +
            'You will fail unless you study.\n' +
            '＝ You will fail if you don’t study.\n' +
            '⚠ unless 本身已含否定，後面不再加 not。',
      viz: { type: 'compareexp',
             factor: '否定在哪裡',
             a: { label: 'if…not', note: 'if you don’t study' },
             b: { label: 'unless', note: 'unless you study（不再加 not）' },
             same: ['意思相同'] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'You will be late unless you hurry.',
          'You will be late unless you don’t hurry.',
          'You will be late unless not you hurry.',
          'You will be late if unless you hurry.'
        ],
        answer: 0,
        why: [
          null,
          'unless 已含否定，不能再加 not。',
          '否定詞的位置不正確。',
          '兩個連接詞不能連用。'
        ]
      }
    },
    {
      title: '⑥ 時間與條件子句不用未來式',
      body: 'I will call you when I get there.（不是 when I will get）\n' +
            'If it rains tomorrow, we will cancel it.\n' +
            '⚠ 這是最常考的規則：\n' +
            '主句用 will，時間與條件子句用現在式。',
      viz: { type: 'sentence', label: '兩邊時態不同', items: [
        { t: 'I will call you', r: '主句：未來式' },
        { t: 'when I get there', r: '時間子句：現在式' }],
        note: '時間與條件子句裡不用 will。' },
      check: {
        q: 'We will start the meeting as soon as he ___. 空格要填什麼？',
        options: ['arrives', 'will arrive', 'arrived', 'is arrive'],
        answer: 0,
        why: [
          null,
          '時間子句裡不用 will。',
          '句子講的是未來，不用過去式。',
          'be 動詞不能和一般動詞並用。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八上|第9單元 過去進行式'] = {
  intro: '描述「過去某一刻正在進行」的動作。',
  cards: [
    {
      title: '① 基本結構',
      body: 'was／were ＋ 動詞 ing\n' +
            'I was studying at eight last night.\n' +
            'They were playing basketball.\n' +
            '⚠ 只是把現在進行式的 be 動詞改成過去式。',
      viz: { type: 'sentence', label: '過去進行式', items: [
        { t: 'I', r: '主詞' }, { t: 'was', r: '過去的 be 動詞' },
        { t: 'studying', r: '動詞 ing' }],
        note: 'be 動詞用過去式，動詞保持 ing。' },
      check: {
        q: 'They ___ watching TV when I came in. 空格要填什麼？',
        options: ['were', 'was', 'are', 'is'],
        answer: 0,
        why: [
          null,
          '主詞是複數，要用 were。',
          '句子講的是過去的事。',
          '主詞是複數而且要用過去式。'
        ]
      }
    },
    {
      title: '② 搭配 when 與 while',
      body: 'when ＋ 過去簡單式（短暫、突然發生）\n' +
            'while ＋ 過去進行式（持續的背景）\n' +
            'I was cooking when the phone rang.\n' +
            'While I was cooking, the phone rang.',
      viz: { type: 'compareexp',
             factor: '搭配的時態',
             a: { label: 'when', note: '後面多接過去簡單式：when he came' },
             b: { label: 'while', note: '後面多接過去進行式：while I was eating' },
             same: ['都在描述兩件同時發生的事'] },
      check: {
        q: '___ I was doing my homework, my brother was playing games. 空格填什麼最合適？',
        options: ['While', 'When he', 'Because', 'Until'],
        answer: 0,
        why: [
          null,
          '這個選項多了主詞，句子會不通。',
          'because 表示原因，語意不合。',
          'until 表示直到某時，語意不合。'
        ]
      }
    },
    {
      title: '③ 兩件事同時進行',
      body: 'While I was reading, my sister was listening to music.\n' +
            '⚠ 兩個動作都用過去進行式，\n' +
            '表示同一段時間裡兩件事並行。',
      viz: { type: 'energyflow', steps: ['過去某段時間', '我在看書（進行）', '妹妹在聽音樂（進行）', '兩件事並行'] },
      check: {
        q: '要表達「我在寫功課的同時，弟弟在看電視」，兩個動詞應該用什麼時態？',
        options: [
          '兩個都用過去進行式',
          '兩個都用過去簡單式',
          '一個用現在式一個用過去式',
          '兩個都用未來式'
        ],
        answer: 0,
        why: [
          null,
          '過去簡單式無法表達持續並行。',
          '同一段時間的事不會用不同時態。',
          '句子講的是過去的事。'
        ]
      }
    },
    {
      title: '④ 被打斷的動作',
      body: 'I was sleeping when the alarm went off.\n' +
            '★ 進行中的長動作被短動作打斷：\n' +
            '長的用進行式，短的用簡單式。\n' +
            '⚠ 兩個都用簡單式會變成「先後發生」，意思不同。',
      viz: { type: 'compareexp',
             factor: '動作的長短',
             a: { label: '長動作（背景）', note: '過去進行式：was sleeping' },
             b: { label: '短動作（打斷）', note: '過去簡單式：the alarm went off' },
             same: ['發生在同一個時間點'] },
      check: {
        q: 'When the teacher came in, the students ___. 哪一個最合適？',
        options: [
          'were talking',
          'talk',
          'will talk',
          'are talking'
        ],
        answer: 0,
        why: [
          null,
          '現在簡單式與過去的情境不符。',
          '未來式與過去的情境不符。',
          '現在進行式與過去的情境不符。'
        ]
      }
    },
    {
      title: '⑤ 否定與疑問',
      body: '否定：I wasn’t sleeping.／They weren’t listening.\n' +
            '疑問：Was he sleeping?→ Yes, he was.\n' +
            '⚠ 變化都發生在 be 動詞上，ing 完全不動。',
      viz: { type: 'energyflow', steps: ['He was reading.', '否定：wasn’t reading', '疑問：Was he reading?', '簡答：Yes, he was.'] },
      check: {
        q: '「他們當時沒有在讀書」的正確說法是什麼？',
        options: [
          'They weren’t studying.',
          'They didn’t studying.',
          'They weren’t study.',
          'They wasn’t studying.'
        ],
        answer: 0,
        why: [
          null,
          '進行式的否定不用 didn’t。',
          '進行式的動詞要保持 ing。',
          '主詞是複數，要用 weren’t。'
        ]
      }
    },
    {
      title: '⑥ 說故事的時態搭配',
      body: '寫記敘文時：\n' +
            '背景與情境 → 過去進行式（It was raining. People were running.）\n' +
            '推進情節 → 過去簡單式（Suddenly, a car stopped.）\n' +
            '⚠ 兩者交錯使用，故事才有層次。',
      viz: { type: 'energyflow', steps: ['過去進行式鋪背景', '過去簡單式推情節', '再回到背景', '故事有層次'] },
      check: {
        q: '寫故事時，描寫「當時的背景與氣氛」適合用哪一種時態？',
        options: [
          '過去進行式',
          '現在簡單式',
          '未來式',
          '現在完成式'
        ],
        answer: 0,
        why: [
          null,
          '現在簡單式與過去的故事情境不符。',
          '未來式無法描寫已經發生的背景。',
          '現在完成式強調對現在的影響，不適合鋪陳背景。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第1單元 現在完成式（經驗）'] = {
  intro: '「有沒有做過」用現在完成式，重點在經驗而不是時間。',
  cards: [
    {
      title: '① 基本結構',
      body: 'have／has ＋ 過去分詞（p.p.）\n' +
            'I have been to Japan.（我去過日本。）\n' +
            'He has seen that movie.\n' +
            '⚠ 主詞是第三人稱單數用 has，其餘用 have。',
      viz: { type: 'tense', verb: 'go', highlight: '現在完成式', pick: false },
      check: {
        q: 'She ___ finished her homework. 空格要填什麼？',
        options: ['has', 'have', 'is', 'had'],
        answer: 0,
        why: [
          null,
          '第三人稱單數要用 has。',
          '完成式用 have 或 has 而不是 be 動詞。',
          'had 是過去完成式，時態不符。'
        ]
      }
    },
    {
      title: '② 表示經驗的關鍵字',
      body: 'ever（曾經）　never（從未）　before（以前）\n' +
            'once／twice／three times（次數）\n' +
            'Have you ever been abroad?\n' +
            '⚠ ever 多用在疑問句，never 用在肯定句表示否定。',
      viz: { type: 'classify', groups: [
        { label: '經驗的訊號字', items: ['ever', 'never', 'before', 'twice'] },
        { label: '過去式的訊號字', items: ['yesterday', 'last week', 'in 2020'] }] },
      check: {
        q: 'Have you ___ tried Thai food? 空格要填什麼？',
        options: ['ever', 'yesterday', 'ago', 'last night'],
        answer: 0,
        why: [
          null,
          '有明確的過去時間就要用過去式。',
          'ago 表示過去某時，不能配完成式。',
          '有明確的過去時間就要用過去式。'
        ]
      }
    },
    {
      title: '③ been 與 gone 的差別',
      body: 'have been to ＝ 去過（已經回來了）\n' +
            'have gone to ＝ 去了（人還在那裡）\n' +
            'He has been to Japan.（他去過日本，人在這裡。）\n' +
            'He has gone to Japan.（他去日本了，人不在。）',
      viz: { type: 'compareexp',
             factor: '人在不在這裡',
             a: { label: 'have been to', note: '去過並且回來了' },
             b: { label: 'have gone to', note: '去了還沒回來' },
             same: ['都用現在完成式'] },
      check: {
        q: '「他去美國了，現在人不在台灣」的正確說法是什麼？',
        options: [
          'He has gone to the US.',
          'He has been to the US.',
          'He has went to the US.',
          'He is gone to the US.'
        ],
        answer: 0,
        why: [
          null,
          'been to 表示去過並已回來。',
          'went 是過去式，不是過去分詞。',
          '完成式要用 have 或 has。'
        ]
      }
    },
    {
      title: '④ 不能配明確的過去時間',
      body: '✗ I have seen him yesterday.\n' +
            '✓ I saw him yesterday.\n' +
            '✓ I have seen him before.\n' +
            '⚠ 現在完成式的重點是「對現在的影響」，\n' +
            '一旦指明過去某個時間點，就要用過去式。',
      viz: { type: 'compareexp',
             factor: '有沒有指明時間',
             a: { label: '現在完成式', note: '不指明時間：I have seen it.' },
             b: { label: '過去簡單式', note: '指明時間：I saw it yesterday.' },
             same: ['動作都發生在過去'] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'I visited Japan last year.',
          'I have visited Japan last year.',
          'I have visit Japan last year.',
          'I am visited Japan last year.'
        ],
        answer: 0,
        why: [
          null,
          '有 last year 就要用過去式。',
          '完成式後面要用過去分詞，時間詞也不對。',
          'be 動詞不能這樣使用。'
        ]
      }
    },
    {
      title: '⑤ 過去分詞怎麼來',
      body: '規則動詞：和過去式一樣加 ed（played、watched）\n' +
            '不規則動詞：要背第三態（see－saw－seen、go－went－gone）\n' +
            '⚠ 完成式用的是第三態，不是第二態：\n' +
            '✗ I have saw → ✓ I have seen',
      viz: { type: 'classify', groups: [
        { label: '三態相同', items: ['cut', 'put', 'hit'] },
        { label: '二三態相同', items: ['bought', 'taught', 'made'] },
        { label: '三態都不同', items: ['gone', 'seen', 'written', 'eaten'] }] },
      check: {
        q: 'I have ___ that book.（read 的過去分詞）空格要填什麼？',
        options: ['read', 'readed', 'reads', 'reading'],
        answer: 0,
        why: [
          null,
          'read 是不規則動詞，不加 ed。',
          '完成式後面要用過去分詞。',
          '完成式後面不用動名詞。'
        ]
      }
    },
    {
      title: '⑥ 疑問與簡答',
      body: 'Have you ever seen a whale?→ Yes, I have.／No, I haven’t.\n' +
            'Has he finished?→ Yes, he has.\n' +
            '⚠ 把 have／has 移到句首，簡答也用 have／has。',
      viz: { type: 'energyflow', steps: ['You have seen it.', '把 have 移到句首', 'Have you seen it?', 'Yes, I have.'] },
      check: {
        q: 'Has she left? 的否定簡答是什麼？',
        options: [
          'No, she hasn’t.',
          'No, she doesn’t.',
          'No, she isn’t.',
          'No, she haven’t.'
        ],
        answer: 0,
        why: [
          null,
          '完成式的簡答要用 has 或 have。',
          '完成式的簡答不用 be 動詞。',
          '第三人稱單數要用 hasn’t。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第2單元 現在完成式（完成與持續）'] = {
  intro: '同一個結構，還可以表示「剛完成」和「一直持續到現在」。',
  cards: [
    {
      title: '① 剛剛完成',
      body: 'I have just finished my homework.（我剛寫完功課。）\n' +
            'They have already left.（他們已經走了。）\n' +
            '⚠ just（剛剛）、already（已經）多放在 have 和 p.p. 中間。',
      viz: { type: 'sentence', label: '副詞的位置', items: [
        { t: 'I have', r: '助動詞' }, { t: 'just', r: '副詞（放中間）' },
        { t: 'finished', r: '過去分詞' }],
        note: 'just 與 already 放在助動詞後面。' },
      check: {
        q: '下列哪一句位置正確？',
        options: [
          'She has already eaten lunch.',
          'She already has eaten lunch.',
          'She has eaten already lunch.',
          'Already she has eaten has lunch.'
        ],
        answer: 0,
        why: [
          null,
          'already 通常放在助動詞後面。',
          '副詞不插在動詞與受詞中間。',
          '這句重複了助動詞。'
        ]
      }
    },
    {
      title: '② yet 與 already',
      body: 'already：肯定句（已經）\n' +
            'yet：否定句（還沒）與疑問句（還沒嗎），放句尾\n' +
            'I haven’t finished yet.／Have you finished yet?',
      viz: { type: 'compareexp',
             factor: '用在哪種句子',
             a: { label: 'already', note: '肯定句，放中間' },
             b: { label: 'yet', note: '否定與疑問句，放句尾' },
             same: ['都表示動作完成與否'] },
      check: {
        q: 'I haven’t seen that movie ___. 空格要填什麼？',
        options: ['yet', 'already', 'ever', 'just'],
        answer: 0,
        why: [
          null,
          'already 用在肯定句。',
          'ever 多用在疑問句。',
          'just 表示剛剛，用在肯定句。'
        ]
      }
    },
    {
      title: '③ 持續到現在',
      body: 'I have lived here for ten years.（我住這裡十年了，現在還住。）\n' +
            '⚠ 過去式 I lived here for ten years 表示「已經不住了」。\n' +
            '完成式強調現在仍然如此。',
      viz: { type: 'compareexp',
             factor: '現在還是不是這樣',
             a: { label: '現在完成式', note: 'have lived — 現在還住著' },
             b: { label: '過去簡單式', note: 'lived — 現在已經不住了' },
             same: ['都提到住了十年'] },
      check: {
        q: 'I have worked here for five years. 這句話表示什麼？',
        options: [
          '我五年前開始在這裡工作，現在還在',
          '我五年前離職了',
          '我明年會來這裡工作',
          '我只工作過五天'
        ],
        answer: 0,
        why: [
          null,
          '完成式表示狀態持續到現在。',
          '句子用的是完成式，不是未來式。',
          'five years 是五年而不是五天。'
        ]
      }
    },
    {
      title: '④ for 與 since',
      body: 'for ＋ 一段時間：for three years、for a long time\n' +
            'since ＋ 起點：since 2020、since I was a child\n' +
            '⚠ since 後面也可以接一整個過去式子句。',
      viz: { type: 'sentence', label: '兩種說法', items: [
        { t: 'for ten years', r: '持續多久' }, { t: 'since 2016', r: '從何時開始' }],
        note: '兩種說的是同一段時間。' },
      check: {
        q: 'He has been sick ___ last Monday. 空格要填什麼？',
        options: ['since', 'for', 'in', 'during'],
        answer: 0,
        why: [
          null,
          'for 後面要接一段時間長度。',
          'in 不用於這個句型。',
          'during 後面接一段期間的名詞。'
        ]
      }
    },
    {
      title: '⑤ 現在完成進行式',
      body: 'have／has been ＋ 動詞 ing\n' +
            'I have been studying for three hours.\n' +
            '⚠ 強調動作「一直在進行」而且可能還會繼續，\n' +
            '比單純的完成式更強調過程。',
      viz: { type: 'compareexp',
             factor: '強調什麼',
             a: { label: '現在完成式', note: '強調結果：I have read the book.' },
             b: { label: '現在完成進行式', note: '強調過程：I have been reading it.' },
             same: ['都從過去延續到現在'] },
      check: {
        q: 'I have been waiting for an hour. 這句話強調什麼？',
        options: [
          '等的這個過程持續了一小時，現在可能還在等',
          '我一小時前等過',
          '我明天要等一小時',
          '我只等了一下下'
        ],
        answer: 0,
        why: [
          null,
          '完成進行式強調持續到現在。',
          '句子用的不是未來式。',
          'an hour 是一小時，不是一下下。'
        ]
      }
    },
    {
      title: '⑥ 三種用法整理',
      body: '① 經驗：have been to、have ever seen\n' +
            '② 完成：have just finished、haven’t yet\n' +
            '③ 持續：have lived for／since\n' +
            '⚠ 三種都用同一個結構，靠上下文與關鍵字判斷。',
      viz: { type: 'classify', groups: [
        { label: '經驗', items: ['ever', 'never', 'twice'] },
        { label: '完成', items: ['just', 'already', 'yet'] },
        { label: '持續', items: ['for', 'since', 'so far'] }] },
      check: {
        q: '看到 since 2015 這個訊號，應該判斷是哪一種用法？',
        options: [
          '持續：從那時一直到現在',
          '經驗：曾經做過',
          '完成：剛剛做完',
          '未來：接下來要做'
        ],
        answer: 0,
        why: [
          null,
          '經驗的訊號字是 ever 或 never。',
          '完成的訊號字是 just 或 already。',
          'since 指的是過去的起點而不是未來。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第3單元 被動語態（現在）'] = {
  intro: '把「誰做的」變成「被怎麼樣」，重點就換人了。',
  cards: [
    {
      title: '① 主動與被動',
      body: '主動：Many people speak English.\n' +
            '被動：English is spoken by many people.\n' +
            '★ 結構：be 動詞 ＋ 過去分詞（＋ by 加行為者）\n' +
            '⚠ 受詞變主詞，主詞變成 by 後面的部分。',
      viz: { type: 'sentence', label: '被動語態結構', items: [
        { t: 'English', r: '原本的受詞變主詞' }, { t: 'is spoken', r: 'be 動詞加過去分詞' },
        { t: 'by many people', r: '原本的主詞' }],
        note: '受詞升格為主詞，動詞改成被動形式。' },
      check: {
        q: '下列哪一句是正確的被動語態？',
        options: [
          'The room is cleaned every day.',
          'The room is clean every day.',
          'The room cleans every day.',
          'The room is cleaning by us every day.'
        ],
        answer: 0,
        why: [
          null,
          '被動語態要用過去分詞。',
          '這是主動語態，語意變成房間會自己打掃。',
          '這裡要用被動而不是進行式。'
        ]
      }
    },
    {
      title: '② be 動詞要跟著主詞',
      body: 'The book is written in English.（單數）\n' +
            'The books are written in English.（複數）\n' +
            '⚠ 被動語態的 be 動詞要跟新主詞的單複數一致。',
      viz: { type: 'classify', groups: [
        { label: '單數主詞', items: ['is made', 'is used', 'is sold'] },
        { label: '複數主詞', items: ['are made', 'are used', 'are sold'] }] },
      check: {
        q: 'These shoes ___ made in Taiwan. 空格要填什麼？',
        options: ['are', 'is', 'was', 'be'],
        answer: 0,
        why: [
          null,
          '主詞是複數的 shoes。',
          '句子講的是現在的事實。',
          'be 是原形，句子需要現在式。'
        ]
      }
    },
    {
      title: '③ 什麼時候用被動',
      body: '① 不知道或不重要是誰做的：My bike was stolen.\n' +
            '② 想強調被影響的對象：The window is broken.\n' +
            '③ 客觀陳述（科學、新聞）：Water is used to cool the machine.\n' +
            '⚠ 沒必要時不用刻意改成被動，主動通常更有力。',
      viz: { type: 'compareexp',
             factor: '重點放在誰',
             a: { label: '主動', note: '重點在做的人：Tom broke the window.' },
             b: { label: '被動', note: '重點在被做的東西：The window was broken.' },
             same: ['講的是同一件事'] },
      check: {
        q: '什麼情況下最適合用被動語態？',
        options: [
          '不知道或不需要說明是誰做的時候',
          '想強調做事的人時',
          '句子太短的時候',
          '任何時候都應該用被動'
        ],
        answer: 0,
        why: [
          null,
          '想強調做事的人應該用主動語態。',
          '句子長短不是選擇語態的理由。',
          '過度使用被動會讓文章拗口。'
        ]
      }
    },
    {
      title: '④ by 常常可以省略',
      body: 'Rice is grown in Taiwan.（不用說 by farmers）\n' +
            '⚠ 行為者很明顯、不重要或不知道時，by 片語就省略。',
      viz: { type: 'classify', groups: [
        { label: '通常省略 by', items: ['is made in Japan', 'was built in 1990', 'is spoken here'] },
        { label: '保留 by', items: ['written by Hemingway', 'painted by Van Gogh'] }] },
      check: {
        q: '下列哪一種情況通常會保留 by 片語？',
        options: [
          '行為者很重要，例如作品的作者',
          '行為者是一般人',
          '行為者不知道是誰',
          '任何被動句都要寫 by'
        ],
        answer: 0,
        why: [
          null,
          '行為者是一般人時通常省略。',
          '不知道是誰時無法寫出 by 片語。',
          '多數被動句不需要 by 片語。'
        ]
      }
    },
    {
      title: '⑤ 否定與疑問',
      body: '否定：The room isn’t cleaned every day.\n' +
            '疑問：Is the room cleaned every day?\n' +
            '⚠ 變化都發生在 be 動詞上，過去分詞不變。',
      viz: { type: 'energyflow', steps: ['It is made here.', '否定：isn’t made', '疑問：Is it made here?', '過去分詞不變'] },
      check: {
        q: '「這些書不是在台灣印的」的正確說法是什麼？',
        options: [
          'These books aren’t printed in Taiwan.',
          'These books don’t printed in Taiwan.',
          'These books aren’t print in Taiwan.',
          'These books isn’t printed in Taiwan.'
        ],
        answer: 0,
        why: [
          null,
          '被動語態的否定用 be 動詞加 not。',
          '被動語態要用過去分詞。',
          '主詞是複數，要用 aren’t。'
        ]
      }
    },
    {
      title: '⑥ 有些動詞不能用被動',
      body: '沒有受詞的動詞（不及物動詞）不能改被動：\n' +
            '✗ An accident was happened.→ ✓ An accident happened.\n' +
            '⚠ happen、occur、appear、rise、arrive 都不能用被動。',
      viz: { type: 'classify', groups: [
        { label: '不能用被動', items: ['happen', 'occur', 'appear', 'arrive', 'rise'] },
        { label: '可以用被動', items: ['make', 'build', 'write', 'break'] }] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'The accident happened last night.',
          'The accident was happened last night.',
          'The accident is happened last night.',
          'The accident has been happened.'
        ],
        answer: 0,
        why: [
          null,
          'happen 沒有受詞，不能用被動。',
          'happen 不能改成被動語態。',
          'happen 不能改成被動語態。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第4單元 被動語態（過去）'] = {
  intro: '過去的被動只要把 be 動詞換成 was／were。',
  cards: [
    {
      title: '① 過去被動的結構',
      body: 'was／were ＋ 過去分詞\n' +
            'The house was built in 1990.\n' +
            'These pictures were taken by my father.\n' +
            '⚠ be 動詞決定時態，過去分詞決定「被動」。',
      viz: { type: 'sentence', label: '兩個部分各管一件事', items: [
        { t: 'was', r: 'be 動詞：決定時態' },
        { t: 'built', r: '過去分詞：表示被動' }],
        note: 'be 動詞管時態，過去分詞管被動。' },
      check: {
        q: 'The letters ___ sent yesterday. 空格要填什麼？',
        options: ['were', 'was', 'are', 'is'],
        answer: 0,
        why: [
          null,
          '主詞是複數的 letters。',
          '有 yesterday 要用過去式。',
          '這裡既要複數也要過去式。'
        ]
      }
    },
    {
      title: '② 主動改被動的三步驟',
      body: '① 把受詞移到句首當主詞\n' +
            '② 動詞改成 be 動詞（配合時態）加過去分詞\n' +
            '③ 原本的主詞加 by 放句尾（可省略）\n' +
            'Tom broke the window.→ The window was broken by Tom.',
      viz: { type: 'energyflow', steps: ['受詞移到句首', '動詞改被動形式', '原主詞加 by', '完成'] },
      check: {
        q: 'Someone stole my bike. 改成被動語態是什麼？',
        options: [
          'My bike was stolen.',
          'My bike was stole.',
          'My bike is stolen yesterday.',
          'My bike stole by someone.'
        ],
        answer: 0,
        why: [
          null,
          '被動語態要用過去分詞 stolen。',
          '這個句子的時態不一致。',
          '被動語態需要 be 動詞。'
        ]
      }
    },
    {
      title: '③ 各種時態的被動',
      body: '現在：is／are ＋ p.p.\n' +
            '過去：was／were ＋ p.p.\n' +
            '未來：will be ＋ p.p.\n' +
            '完成：have／has been ＋ p.p.\n' +
            '⚠ 只有 be 動詞在變，過去分詞永遠不變。',
      viz: { type: 'classify', groups: [
        { label: '各時態的被動', items: ['is made', 'was made', 'will be made', 'has been made'] }] },
      check: {
        q: '「這棟大樓明年會被拆掉」的正確說法是什麼？',
        options: [
          'The building will be torn down next year.',
          'The building will torn down next year.',
          'The building will be tear down next year.',
          'The building is will be torn down.'
        ],
        answer: 0,
        why: [
          null,
          '被動語態需要 be 動詞。',
          'be 後面要接過去分詞。',
          '助動詞不能和 be 動詞這樣連用。'
        ]
      }
    },
    {
      title: '④ 助動詞的被動',
      body: 'can be done、must be finished、should be sent\n' +
            'The work must be finished today.\n' +
            '⚠ 助動詞後面用原形的 be，再加過去分詞。',
      viz: { type: 'sentence', label: '助動詞的被動', items: [
        { t: 'must', r: '助動詞' }, { t: 'be', r: '原形 be' },
        { t: 'finished', r: '過去分詞' }],
        note: '助動詞後面用原形的 be。' },
      check: {
        q: 'This problem can ___ easily. 空格要填什麼？',
        options: [
          'be solved',
          'is solved',
          'be solve',
          'solved'
        ],
        answer: 0,
        why: [
          null,
          '助動詞後面要用原形的 be。',
          'be 後面要接過去分詞。',
          '被動語態需要 be 動詞。'
        ]
      }
    },
    {
      title: '⑤ 有兩個受詞的句子',
      body: 'He gave me a book.（兩個受詞）\n' +
            '→ I was given a book.（人當主詞）\n' +
            '→ A book was given to me.（物當主詞，人前面加 to）\n' +
            '⚠ 物當主詞時，人的前面要補介系詞。',
      viz: { type: 'compareexp',
             factor: '誰當主詞',
             a: { label: '人當主詞', note: 'I was given a book.' },
             b: { label: '物當主詞', note: 'A book was given to me.' },
             same: ['都由同一個主動句改來'] },
      check: {
        q: 'She sent me a letter. 改成以 letter 當主詞的被動句是什麼？',
        options: [
          'A letter was sent to me.',
          'A letter was sent me.',
          'A letter sent to me.',
          'A letter was send to me.'
        ],
        answer: 0,
        why: [
          null,
          '物當主詞時人的前面要加 to。',
          '被動語態需要 be 動詞。',
          'be 後面要接過去分詞。'
        ]
      }
    },
    {
      title: '⑥ 用其他介系詞的被動',
      body: 'be interested in（對…有興趣）\n' +
            'be worried about（擔心）\n' +
            'be covered with（被…覆蓋）\n' +
            'be known for（以…聞名）\n' +
            '⚠ 這些是固定搭配，不一定用 by。',
      viz: { type: 'classify', groups: [
        { label: '搭配 in', items: ['be interested in'] },
        { label: '搭配 with', items: ['be covered with', 'be filled with'] },
        { label: '搭配 for／to', items: ['be known for', 'be known to'] }] },
      check: {
        q: 'The mountain is covered ___ snow. 空格要填什麼？',
        options: ['with', 'by', 'in', 'of'],
        answer: 0,
        why: [
          null,
          '這個片語的固定搭配是 with。',
          'in 不用於這個片語。',
          'of 不用於這個片語。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第5單元 關係代名詞'] = {
  intro: '用一個子句去修飾名詞，句子就能說得更完整。',
  cards: [
    {
      title: '① 關係代名詞在做什麼',
      body: 'I know a boy. ＋ He can speak five languages.\n' +
            '→ I know a boy who can speak five languages.\n' +
            '★ who 代替 he，同時把兩句連起來。\n' +
            '⚠ 關係代名詞身兼「代名詞」與「連接詞」兩個角色。',
      viz: { type: 'sentence', label: '合併兩句', items: [
        { t: 'I know a boy', r: '主句' }, { t: 'who', r: '關係代名詞' },
        { t: 'can speak five languages', r: '形容詞子句' }],
        note: '關係代名詞既連接又代替。' },
      check: {
        q: '關係代名詞同時扮演哪兩個角色？',
        options: [
          '代名詞與連接詞',
          '動詞與名詞',
          '介系詞與副詞',
          '形容詞與助動詞'
        ],
        answer: 0,
        why: [
          null,
          '關係代名詞不是動詞也不是名詞。',
          '關係代名詞不是介系詞。',
          '關係代名詞不是助動詞。'
        ]
      }
    },
    {
      title: '② 選哪一個關係代名詞',
      body: '先行詞是人：who（主格）／whom（受格）／whose（所有格）\n' +
            '先行詞是物：which\n' +
            '人或物都可以：that\n' +
            '⚠ 先看先行詞是人還是物，再看它在子句裡當主詞還是受詞。',
      viz: { type: 'classify', groups: [
        { label: '人', items: ['who', 'whom', 'whose'] },
        { label: '物', items: ['which', 'whose'] },
        { label: '通用', items: ['that'] }] },
      check: {
        q: 'This is the book ___ I bought yesterday. 空格要填什麼？',
        options: ['which', 'who', 'whose', 'whom'],
        answer: 0,
        why: [
          null,
          'who 用於人。',
          'whose 表示所有，語意不合。',
          'whom 用於人的受格。'
        ]
      }
    },
    {
      title: '③ 主格與受格',
      body: '主格：後面直接接動詞\n' +
            '　 The man who lives next door is a doctor.\n' +
            '受格：後面接主詞加動詞\n' +
            '　 The man (whom) I met is a doctor.\n' +
            '⚠ 判斷方法：關係代名詞後面缺主詞就用主格。',
      viz: { type: 'compareexp',
             factor: '後面缺什麼',
             a: { label: '主格', note: '後面直接接動詞：who lives' },
             b: { label: '受格', note: '後面接主詞加動詞：whom I met' },
             same: ['都在修飾前面的名詞'] },
      check: {
        q: 'The girl ___ won the prize is my sister. 空格要填什麼？',
        options: ['who', 'whom', 'which', 'whose'],
        answer: 0,
        why: [
          null,
          '後面直接接動詞，要用主格。',
          'which 用於物。',
          'whose 後面要接名詞。'
        ]
      }
    },
    {
      title: '④ 受格可以省略',
      body: 'The book (which) I read was great.\n' +
            '★ 只有受格可以省略，主格不能省。\n' +
            '⚠ 檢查方法：省略後如果動詞前面沒主詞，就不能省。',
      viz: { type: 'compareexp',
             factor: '能不能省略',
             a: { label: '受格', note: '可以省略：the book I read' },
             b: { label: '主格', note: '不能省略：the man who lives here' },
             same: ['都在引導形容詞子句'] },
      check: {
        q: '下列哪一句的關係代名詞可以省略？',
        options: [
          'The movie that we watched was funny.',
          'The man who called me is my uncle.',
          'The dog which is barking is loud.',
          'The girl who sits there is Amy.'
        ],
        answer: 0,
        why: [
          null,
          '這裡的 who 是主格，不能省略。',
          '這裡的 which 是主格，不能省略。',
          '這裡的 who 是主格，不能省略。'
        ]
      }
    },
    {
      title: '⑤ whose 表示所有',
      body: 'I have a friend whose father is a pilot.\n' +
            '⚠ whose 後面一定接名詞，人和物都可以用。',
      viz: { type: 'sentence', label: 'whose 的用法', items: [
        { t: 'a friend', r: '先行詞' }, { t: 'whose', r: '所有格' },
        { t: 'father is a pilot', r: '名詞加動詞' }],
        note: 'whose 後面一定接名詞。' },
      check: {
        q: 'I know a girl ___ brother is a singer. 空格要填什麼？',
        options: ['whose', 'who', 'whom', 'which'],
        answer: 0,
        why: [
          null,
          'who 後面直接接動詞。',
          'whom 是受格，後面接主詞加動詞。',
          'which 用於物。'
        ]
      }
    },
    {
      title: '⑥ 只能用 that 的情況',
      body: '先行詞是最高級、序數、all、every、the only、the same 時，\n' +
            '習慣用 that：\n' +
            'This is the best movie that I have ever seen.\n' +
            '⚠ 先行詞同時包含人和物時也用 that。',
      viz: { type: 'classify', groups: [
        { label: '習慣用 that', items: ['the best…', 'the first…', 'the only…', 'all…', 'everything…'] }] },
      check: {
        q: 'This is the only book ___ I want to read. 空格填什麼最合適？',
        options: ['that', 'who', 'whose', 'what'],
        answer: 0,
        why: [
          null,
          'who 用於人。',
          'whose 後面要接名詞。',
          'what 不能當關係代名詞接在先行詞後面。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第6單元 間接問句'] = {
  intro: '把問句放進另一個句子裡，語序就要變回陳述句。',
  cards: [
    {
      title: '① 什麼是間接問句',
      body: '直接問句：Where is he?\n' +
            '間接問句：I don’t know where he is.\n' +
            '★ 放進句子裡之後，語序改回「主詞 ＋ 動詞」。\n' +
            '⚠ 這是最常錯的地方。',
      viz: { type: 'compareexp',
             factor: '語序',
             a: { label: '直接問句', note: 'Where is he?（動詞在前）' },
             b: { label: '間接問句', note: '…where he is.（主詞在前）' },
             same: ['問的內容相同'] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'Do you know where he lives?',
          'Do you know where does he live?',
          'Do you know where lives he?',
          'Do you know where he live?'
        ],
        answer: 0,
        why: [
          null,
          '間接問句裡不用助動詞倒裝。',
          '間接問句要用陳述句的語序。',
          '第三人稱單數的動詞要加 s。'
        ]
      }
    },
    {
      title: '② 助動詞要拿掉',
      body: '直接：What does he want?\n' +
            '間接：I don’t know what he wants.\n' +
            '★ 助動詞 does 消失，它帶的 s 回到動詞上。\n' +
            '⚠ 過去式也一樣：did want → wanted。',
      viz: { type: 'energyflow', steps: ['What does he want?', '拿掉 does', 's 回到動詞上', '…what he wants.'] },
      check: {
        q: 'Can you tell me what time the movie ___? 空格要填什麼？',
        options: ['starts', 'does start', 'start', 'starting'],
        answer: 0,
        why: [
          null,
          '間接問句裡不用助動詞。',
          '主詞是第三人稱單數，動詞要加 s。',
          '這個形式缺少 be 動詞。'
        ]
      }
    },
    {
      title: '③ 沒有疑問詞時用 if 或 whether',
      body: '直接：Is he a teacher?\n' +
            '間接：I wonder if he is a teacher.\n' +
            '⚠ 沒有疑問詞的是非問句，要用 if 或 whether 引導。',
      viz: { type: 'compareexp',
             factor: '原本的問句有沒有疑問詞',
             a: { label: '有疑問詞', note: '直接沿用：where he is' },
             b: { label: '沒有疑問詞', note: '要加 if／whether' },
             same: ['都改成陳述句語序'] },
      check: {
        q: 'I don’t know ___ she will come. 空格填什麼最合適？',
        options: ['whether', 'what', 'who', 'that if'],
        answer: 0,
        why: [
          null,
          '句子裡沒有要問「什麼」。',
          '句子裡沒有要問「誰」。',
          '兩個連接詞不能連用。'
        ]
      }
    },
    {
      title: '④ 整句是問句還是陳述句',
      body: 'Do you know where he is?（整句是問句，句尾用問號）\n' +
            'I don’t know where he is.（整句是陳述句，用句點）\n' +
            '⚠ 標點看的是「整個句子」，不是裡面的間接問句。',
      viz: { type: 'compareexp',
             factor: '主句的類型',
             a: { label: '主句是問句', note: 'Do you know…? 用問號' },
             b: { label: '主句是陳述句', note: 'I know… 用句點' },
             same: ['裡面都是間接問句'] },
      check: {
        q: 'I wonder where she went 這句話結尾應該用什麼標點？',
        options: [
          '句點，因為主句是陳述句',
          '問號，因為裡面有疑問詞',
          '驚嘆號',
          '不用標點'
        ],
        answer: 0,
        why: [
          null,
          '標點要看整個句子而不是裡面的部分。',
          '這個句子沒有強烈的情緒。',
          '英文句子結尾一定要有標點。'
        ]
      }
    },
    {
      title: '⑤ 常見的引導句',
      body: 'Do you know…?　Can you tell me…?\n' +
            'I wonder…　I have no idea…　Could you tell me…?\n' +
            '⚠ 用間接問句問路或請教，語氣比直接問更客氣。',
      viz: { type: 'energyflow', steps: ['Where is the station?（直接）', 'Do you know where the station is?（客氣）', 'Could you tell me where the station is?（更客氣）'] },
      check: {
        q: '向陌生人問路時，比較有禮貌的說法是什麼？',
        options: [
          'Could you tell me where the station is?',
          'Where is the station.',
          'Station where?',
          'Tell me the station now.'
        ],
        answer: 0,
        why: [
          null,
          '單純的直接問句語氣較唐突。',
          '這個說法不是完整的句子。',
          '命令的語氣不禮貌。'
        ]
      }
    },
    {
      title: '⑥ 檢查三步驟',
      body: '① 有沒有把語序改回主詞加動詞\n' +
            '② 有沒有拿掉 do／does／did\n' +
            '③ 沒有疑問詞時有沒有補 if 或 whether\n' +
            '⚠ 三個都檢查過，間接問句就不會錯。',
      viz: { type: 'energyflow', steps: ['改語序', '拿掉助動詞', '補 if／whether', '確認標點'] },
      check: {
        q: '把 What did he say? 放進 I don’t know 之後，正確的說法是什麼？',
        options: [
          'I don’t know what he said.',
          'I don’t know what did he say.',
          'I don’t know what he did say it.',
          'I don’t know that what he said.'
        ],
        answer: 0,
        why: [
          null,
          '間接問句裡不用助動詞倒裝。',
          '這個句子多了不必要的字。',
          '兩個連接詞不能連用。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第7單元 使役動詞'] = {
  intro: '叫別人做事的動詞，後面的動詞形式有特別規定。',
  cards: [
    {
      title: '① 三個使役動詞',
      body: 'make（強迫、使得）　let（讓、允許）　have（要求、請）\n' +
            '★ 結構：使役動詞 ＋ 受詞 ＋ 原形動詞（不加 to）\n' +
            'My mom made me clean my room.',
      viz: { type: 'sentence', label: '使役動詞結構', items: [
        { t: 'made', r: '使役動詞' }, { t: 'me', r: '受詞' },
        { t: 'clean', r: '原形動詞（不加 to）' }],
        note: '使役動詞後面用原形動詞。' },
      check: {
        q: 'She let me ___ her bike. 空格要填什麼？',
        options: ['use', 'to use', 'using', 'used'],
        answer: 0,
        why: [
          null,
          'let 後面不加 to。',
          '這個位置要用原形動詞。',
          '這個位置不用過去式。'
        ]
      }
    },
    {
      title: '② 三者的語氣差別',
      body: 'make：帶有強迫的意味（他不想也得做）\n' +
            'let：允許（他本來就想做）\n' +
            'have：交代、請人去做（多用於職務上）\n' +
            '⚠ 意思差很多，不要互換。',
      viz: { type: 'compareexp',
             factor: '對方願不願意',
             a: { label: 'make', note: '強迫：made him apologize' },
             b: { label: 'let', note: '允許：let him go' },
             same: ['後面都接原形動詞'] },
      check: {
        q: '「媽媽讓我出去玩」的正確說法是什麼？',
        options: [
          'My mom let me go out.',
          'My mom made me go out.',
          'My mom let me to go out.',
          'My mom let me going out.'
        ],
        answer: 0,
        why: [
          null,
          'make 帶有強迫的意味，語意不合。',
          'let 後面不加 to。',
          'let 後面要用原形動詞。'
        ]
      }
    },
    {
      title: '③ help 比較特別',
      body: 'help ＋ 受詞 ＋ (to) ＋ 原形動詞\n' +
            'She helped me (to) carry the box.\n' +
            '⚠ help 後面加不加 to 都可以，加不加都對。',
      viz: { type: 'classify', groups: [
        { label: '不加 to', items: ['make', 'let', 'have'] },
        { label: '加不加都可以', items: ['help'] },
        { label: '一定要加 to', items: ['ask', 'tell', 'want'] }] },
      check: {
        q: '下列哪一個動詞後面加不加 to 都正確？',
        options: ['help', 'make', 'let', 'want'],
        answer: 0,
        why: [
          null,
          'make 後面一定不加 to。',
          'let 後面一定不加 to。',
          'want 後面一定要加 to。'
        ]
      }
    },
    {
      title: '④ 被動時 to 要出現',
      body: '主動：They made him apologize.\n' +
            '被動：He was made to apologize.\n' +
            '★ make 改成被動後，原形動詞前面要補 to。\n' +
            '⚠ let 通常不用被動，改用 be allowed to。',
      viz: { type: 'compareexp',
             factor: '主動還是被動',
             a: { label: '主動', note: 'made him go（不加 to）' },
             b: { label: '被動', note: 'was made to go（要加 to）' },
             same: ['都是 make 的用法'] },
      check: {
        q: 'He was made ___ the room. 空格要填什麼？',
        options: ['to clean', 'clean', 'cleaning', 'cleaned'],
        answer: 0,
        why: [
          null,
          '被動語態時要補上 to。',
          '這個位置不用動名詞。',
          '這個位置不用過去分詞。'
        ]
      }
    },
    {
      title: '⑤ have 的另一種用法',
      body: 'have ＋ 事物 ＋ 過去分詞 ＝ 請人做某事\n' +
            'I had my hair cut.（我去剪了頭髮，不是自己剪的。）\n' +
            'She had her car repaired.\n' +
            '⚠ 受詞是「東西」時，後面用過去分詞。',
      viz: { type: 'compareexp',
             factor: '受詞是人還是東西',
             a: { label: '受詞是人', note: 'have him clean（原形動詞）' },
             b: { label: '受詞是東西', note: 'have my hair cut（過去分詞）' },
             same: ['都表示請別人做'] },
      check: {
        q: 'I had my bike ___ yesterday.（請人修好）空格要填什麼？',
        options: ['repaired', 'repair', 'to repair', 'repairing'],
        answer: 0,
        why: [
          null,
          '受詞是東西時要用過去分詞。',
          '這裡腳踏車是被修理的，要用被動的形式。',
          '這個位置不用進行式。'
        ]
      }
    },
    {
      title: '⑥ 相似但要加 to 的動詞',
      body: 'ask／tell／want／advise ＋ 受詞 ＋ to ＋ 原形動詞\n' +
            'She asked me to help her.\n' +
            '⚠ 這一組和使役動詞長得很像，但一定要加 to，\n' +
            '兩組要分開記。',
      viz: { type: 'classify', groups: [
        { label: '不加 to（使役）', items: ['make', 'let', 'have'] },
        { label: '要加 to', items: ['ask', 'tell', 'want', 'advise', 'allow'] }] },
      check: {
        q: 'My teacher told me ___ harder. 空格要填什麼？',
        options: ['to study', 'study', 'studying', 'studied'],
        answer: 0,
        why: [
          null,
          'tell 後面要加 to。',
          '這個位置不用動名詞。',
          '這個位置不用過去式。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第8單元 感官動詞與知覺'] = {
  intro: '看到、聽到、感覺到，後面的動詞形式也有規則。',
  cards: [
    {
      title: '① 感官動詞的句型',
      body: 'see／hear／watch／feel／notice ＋ 受詞 ＋ 原形動詞或動詞 ing\n' +
            'I saw him enter the room.\n' +
            'I saw him entering the room.\n' +
            '⚠ 和使役動詞一樣，不加 to。',
      viz: { type: 'sentence', label: '感官動詞句型', items: [
        { t: 'saw', r: '感官動詞' }, { t: 'him', r: '受詞' },
        { t: 'enter', r: '原形動詞（不加 to）' }],
        note: '感官動詞後面不加 to。' },
      check: {
        q: 'I heard someone ___ my name. 空格要填什麼？',
        options: ['call', 'to call', 'called', 'calls'],
        answer: 0,
        why: [
          null,
          '感官動詞後面不加 to。',
          '這個位置要用原形動詞或動詞 ing。',
          '這個位置不用第三人稱單數形。'
        ]
      }
    },
    {
      title: '② 原形與 ing 的差別',
      body: '原形：看到完整的過程（從頭到尾）\n' +
            '　 I saw him cross the street.（看他走完）\n' +
            'ing：看到正在進行的片段\n' +
            '　 I saw him crossing the street.（看到他正在走）',
      viz: { type: 'compareexp',
             factor: '看到多少',
             a: { label: '原形動詞', note: '完整的動作' },
             b: { label: '動詞 ing', note: '進行中的片段' },
             same: ['都不加 to'] },
      check: {
        q: '「我經過時看到他正在打球」比較適合用哪一種？',
        options: [
          '動詞 ing，因為是看到進行中的片段',
          '原形動詞，因為看到全部',
          '過去分詞',
          '不定詞'
        ],
        answer: 0,
        why: [
          null,
          '經過時只看到片段而不是全部。',
          '過去分詞用於被動的情況。',
          '感官動詞後面不加 to。'
        ]
      }
    },
    {
      title: '③ 被動時要加 to',
      body: '主動：I saw him leave.\n' +
            '被動：He was seen to leave.\n' +
            '⚠ 和 make 一樣，改成被動後 to 要補回來。',
      viz: { type: 'energyflow', steps: ['主動：saw him leave', '改被動', '補上 to', 'was seen to leave'] },
      check: {
        q: 'He was heard ___ the song. 空格要填什麼？',
        options: ['to sing', 'sing', 'sang', 'sings'],
        answer: 0,
        why: [
          null,
          '被動語態時要補上 to。',
          '這個位置不用過去式。',
          '這個位置不用第三人稱單數形。'
        ]
      }
    },
    {
      title: '④ 受詞是被動的情況',
      body: 'I heard my name called.（我聽到有人叫我的名字。）\n' +
            '⚠ 受詞和後面的動作是被動關係時，用過去分詞。\n' +
            '判斷方法：受詞是「做」還是「被做」。',
      viz: { type: 'compareexp',
             factor: '受詞是主動還是被動',
             a: { label: '受詞主動', note: 'saw him run（他自己跑）' },
             b: { label: '受詞被動', note: 'heard my name called（名字被叫）' },
             same: ['都接在感官動詞後面'] },
      check: {
        q: 'I saw the window ___ by the wind. 空格要填什麼？',
        options: ['broken', 'break', 'breaking', 'to break'],
        answer: 0,
        why: [
          null,
          '窗戶是被風打破的，要用過去分詞。',
          '窗戶不是主動打破東西的一方。',
          '感官動詞後面不加 to。'
        ]
      }
    },
    {
      title: '⑤ 感官動詞當連綴動詞',
      body: '同一批動詞也可以直接接形容詞（第八上第六單元學過）：\n' +
            'It looks good.／It sounds strange.\n' +
            '⚠ 後面接受詞加動詞是「知覺」用法，\n' +
            '後面接形容詞是「連綴」用法，兩者要分清楚。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: '連綴用法', note: '接形容詞：It looks nice.' },
             b: { label: '知覺用法', note: '接受詞加動詞：I saw him run.' },
             same: ['是同一批動詞'] },
      check: {
        q: 'The music sounds ___. 空格要填什麼？',
        options: ['beautiful', 'beautifully', 'to be beauty', 'beauty'],
        answer: 0,
        why: [
          null,
          '連綴動詞後面要接形容詞而不是副詞。',
          '這裡不需要不定詞。',
          'beauty 是名詞，語意不通。'
        ]
      }
    },
    {
      title: '⑥ 整理成一張表',
      body: '使役 make／let／have ＋ 受詞 ＋ 原形\n' +
            '感官 see／hear／watch ＋ 受詞 ＋ 原形或 ing\n' +
            '受詞被動時 → 過去分詞\n' +
            '改成被動時 → 補上 to\n' +
            '⚠ 這四條規則涵蓋了大多數考題。',
      viz: { type: 'energyflow', steps: ['判斷是使役還是感官', '看受詞是主動還是被動', '主動用原形或 ing', '被動用過去分詞'] },
      check: {
        q: '判斷感官動詞後面要用原形、ing 還是過去分詞，第一步該看什麼？',
        options: [
          '受詞和動作是主動還是被動關係',
          '句子有幾個字',
          '主詞是不是複數',
          '有沒有時間副詞'
        ],
        answer: 0,
        why: [
          null,
          '句子長度與這個判斷無關。',
          '主詞單複數不影響這個選擇。',
          '時間副詞影響的是時態而不是這個。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|八下|第9單元 too...to 與 enough to'] = {
  intro: '一個表示「太…以致於不能」，一個表示「夠…可以」。',
  cards: [
    {
      title: '① too 加形容詞加 to',
      body: 'too ＋ 形容詞／副詞 ＋ to ＋ 原形動詞\n' +
            'He is too young to drive.（他太年輕了，不能開車。）\n' +
            '★ 句子沒有 not，但意思是否定的。\n' +
            '⚠ 這是最容易誤解的地方。',
      viz: { type: 'sentence', label: 'too…to 結構', items: [
        { t: 'too young', r: '太年輕' }, { t: 'to drive', r: '以致於不能開車' }],
        note: '形式肯定，意思否定。' },
      check: {
        q: 'The coffee is too hot to drink. 這句話的意思是什麼？',
        options: [
          '咖啡太燙了，沒辦法喝',
          '咖啡很燙，可以喝',
          '咖啡不燙',
          '咖啡剛好可以喝'
        ],
        answer: 0,
        why: [
          null,
          'too…to 表示不能做這件事。',
          '句中的 too hot 表示很燙。',
          'too…to 表示程度超過了。'
        ]
      }
    },
    {
      title: '② 換句話說：so…that…not',
      body: 'He is too young to drive.\n' +
            '＝ He is so young that he can’t drive.\n' +
            '⚠ 改寫時要補上 not 或 can’t，\n' +
            '因為 too…to 本身就含否定。',
      viz: { type: 'compareexp',
             factor: '否定藏在哪裡',
             a: { label: 'too…to', note: '沒有 not，但意思是否定' },
             b: { label: 'so…that…not', note: '有明確的否定詞' },
             same: ['意思完全相同'] },
      check: {
        q: 'She is too tired to work. 換句話說是什麼？',
        options: [
          'She is so tired that she can’t work.',
          'She is so tired that she can work.',
          'She is very tired and works.',
          'She is not tired so she works.'
        ],
        answer: 0,
        why: [
          null,
          '改寫時要保留否定的意思。',
          '這個說法失去了原句的否定意味。',
          '這個說法與原句的意思相反。'
        ]
      }
    },
    {
      title: '③ enough 的位置',
      body: '★ enough 放在形容詞、副詞「後面」：\n' +
            'old enough（夠大）、fast enough（夠快）\n' +
            '★ 放在名詞「前面」：\n' +
            'enough money（足夠的錢）\n' +
            '⚠ 這個位置差異很常考。',
      viz: { type: 'compareexp',
             factor: '修飾什麼',
             a: { label: '修飾形容詞', note: '放後面：tall enough' },
             b: { label: '修飾名詞', note: '放前面：enough time' },
             same: ['都表示足夠'] },
      check: {
        q: '下列哪一個位置正確？',
        options: [
          'He is tall enough to reach it.',
          'He is enough tall to reach it.',
          'He is tall to enough reach it.',
          'He enough is tall to reach it.'
        ],
        answer: 0,
        why: [
          null,
          'enough 修飾形容詞時要放後面。',
          'enough 的位置不正確。',
          'enough 不放在 be 動詞前面。'
        ]
      }
    },
    {
      title: '④ enough to 是肯定的',
      body: 'She is old enough to vote.（她夠大了，可以投票。）\n' +
            '＝ She is so old that she can vote.\n' +
            '⚠ 和 too…to 相反，enough to 的意思是肯定的。',
      viz: { type: 'compareexp',
             factor: '意思是肯定還是否定',
             a: { label: 'too…to', note: '否定：太…不能…' },
             b: { label: 'enough to', note: '肯定：夠…可以…' },
             same: ['結構都有 to 加原形動詞'] },
      check: {
        q: 'The box is light enough to carry. 這句話的意思是什麼？',
        options: [
          '箱子夠輕，搬得動',
          '箱子太輕了搬不動',
          '箱子太重了',
          '箱子搬不動'
        ],
        answer: 0,
        why: [
          null,
          'enough to 表示可以做到。',
          'light 是輕的意思。',
          '這句話表示可以搬得動。'
        ]
      }
    },
    {
      title: '⑤ not…enough to',
      body: 'He is not old enough to drive.（他還不夠大，不能開車。）\n' +
            '＝ He is too young to drive.\n' +
            '⚠ 兩種說法意思相同，只是角度不同。',
      viz: { type: 'compareexp',
             factor: '從哪個角度說',
             a: { label: 'too young to', note: '太年輕' },
             b: { label: 'not old enough to', note: '不夠大' },
             same: ['意思完全相同'] },
      check: {
        q: 'He is too short to reach the shelf. 換句話說是什麼？',
        options: [
          'He is not tall enough to reach the shelf.',
          'He is tall enough to reach the shelf.',
          'He is not short enough to reach it.',
          'He is too tall to reach the shelf.'
        ],
        answer: 0,
        why: [
          null,
          '這個說法的意思與原句相反。',
          '這樣改寫語意變得不通。',
          '這個說法的意思與原句相反。'
        ]
      }
    },
    {
      title: '⑥ to 後面的受詞省略',
      body: 'The tea is too hot to drink (it).\n' +
            '★ 不定詞的受詞和主詞是同一個東西時，it 要省略。\n' +
            '⚠ ✗ too hot to drink it（重複了）。',
      viz: { type: 'sentence', label: '受詞要省略', items: [
        { t: 'The tea', r: '主詞' }, { t: 'is too hot to drink', r: '不再重複受詞' }],
        note: '受詞與主詞相同時要省略。' },
      check: {
        q: '下列哪一句正確？',
        options: [
          'The soup is too salty to eat.',
          'The soup is too salty to eat it.',
          'The soup is too salty to eating.',
          'The soup is too salty for eat it.'
        ],
        answer: 0,
        why: [
          null,
          '受詞與主詞相同時要省略 it。',
          'to 後面要接原形動詞。',
          '這個句子的結構不正確。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第1單元 條件句'] = {
  intro: '如果…就…，英文用 if 子句，但時態有嚴格的搭配。',
  cards: [
    {
      title: '① 真實條件句',
      body: 'If ＋ 現在式, 主句用 will ＋ 原形動詞\n' +
            'If it rains tomorrow, I will stay home.\n' +
            '★ if 子句裡不用 will，這是最常考的規則。\n' +
            '⚠ 條件有可能成真時，用這個句型。',
      viz: { type: 'sentence', label: '真實條件句', items: [
        { t: 'If it rains', r: 'if 子句：現在式' },
        { t: 'I will stay home', r: '主句：未來式' }],
        note: 'if 子句用現在式代替未來式。' },
      check: {
        q: 'If you ___ hard, you will pass. 空格要填什麼？',
        options: ['study', 'will study', 'studied', 'would study'],
        answer: 0,
        why: [
          null,
          'if 子句裡不用 will。',
          '這句講的是未來可能發生的事。',
          'would 用於與現在事實相反的假設。'
        ]
      }
    },
    {
      title: '② 恆真條件句',
      body: 'If ＋ 現在式, 主句也用現在式\n' +
            'If you heat water to 100 degrees, it boils.\n' +
            '⚠ 講科學道理或必然的結果時，兩邊都用現在式。',
      viz: { type: 'compareexp',
             factor: '主句的時態',
             a: { label: '會發生一次', note: 'If it rains, I will stay home.' },
             b: { label: '每次都這樣', note: 'If you drop it, it breaks.' },
             same: ['if 子句都用現在式'] },
      check: {
        q: 'If you mix blue and yellow, you ___ green. 空格填什麼最合適？',
        options: ['get', 'will got', 'would get', 'got'],
        answer: 0,
        why: [
          null,
          'will 後面要接原形動詞。',
          'would 用於與事實相反的假設。',
          '這是恆常的道理，不用過去式。'
        ]
      }
    },
    {
      title: '③ 與現在事實相反',
      body: 'If ＋ 過去式, 主句用 would／could ＋ 原形動詞\n' +
            'If I were you, I would apologize.（我不是你）\n' +
            '★ be 動詞一律用 were，不管主詞是誰。\n' +
            '⚠ 用過去式不是在講過去，而是表示「不是真的」。',
      viz: { type: 'compareexp',
             factor: '事情是不是真的',
             a: { label: '真實條件', note: 'If I have time, I will go.' },
             b: { label: '與事實相反', note: 'If I had time, I would go.（我沒時間）' },
             same: ['都用 if 開頭'] },
      check: {
        q: 'If I ___ rich, I would travel around the world. 空格要填什麼？',
        options: ['were', 'am', 'will be', 'have been'],
        answer: 0,
        why: [
          null,
          '與現在事實相反的假設要用過去式。',
          'if 子句裡不用 will。',
          '這裡不用完成式。'
        ]
      }
    },
    {
      title: '④ 與過去事實相反',
      body: 'If ＋ had ＋ p.p., 主句用 would have ＋ p.p.\n' +
            'If I had studied harder, I would have passed.\n' +
            '⚠ 這是「後悔」的句型：事情已經發生，無法改變。',
      viz: { type: 'energyflow', steps: ['真實條件：現在式加 will', '與現在相反：過去式加 would', '與過去相反：過去完成式加 would have'] },
      check: {
        q: 'If I had known, I ___ told you. 空格要填什麼？',
        options: [
          'would have',
          'will have',
          'would',
          'had'
        ],
        answer: 0,
        why: [
          null,
          '與過去事實相反時不用 will。',
          '主句要用 would have 加過去分詞。',
          'had 不能單獨出現在主句這個位置。'
        ]
      }
    },
    {
      title: '⑤ 三種條件句對照',
      body: '① 未來可能：If it rains, I will stay.\n' +
            '② 現在相反：If it rained, I would stay.（其實沒下雨）\n' +
            '③ 過去相反：If it had rained, I would have stayed.（當時沒下雨）\n' +
            '⚠ 時態往後退一格，就表示「越不可能」。',
      viz: { type: 'classify', groups: [
        { label: '可能發生', items: ['if 現在式 + will'] },
        { label: '與現在相反', items: ['if 過去式 + would'] },
        { label: '與過去相反', items: ['if 過去完成 + would have'] }] },
      check: {
        q: 'If I had a car, I would drive you home. 這句話表示什麼？',
        options: [
          '我其實沒有車',
          '我有車而且會載你',
          '我以前有車',
          '我明天會買車'
        ],
        answer: 0,
        why: [
          null,
          '這個句型表示與現在事實相反。',
          '這句講的是現在的狀況。',
          '句中沒有提到買車。'
        ]
      }
    },
    {
      title: '⑥ 其他條件的說法',
      body: 'unless ＝ if…not（除非）\n' +
            'as long as（只要）　in case（以防萬一）\n' +
            'Take an umbrella in case it rains.\n' +
            '⚠ 這些連接詞後面同樣不用未來式。',
      viz: { type: 'classify', groups: [
        { label: '條件類連接詞', items: ['if', 'unless', 'as long as', 'in case', 'provided that'] }] },
      check: {
        q: 'Bring a jacket in case it ___ cold. 空格要填什麼？',
        options: ['gets', 'will get', 'would get', 'got'],
        answer: 0,
        why: [
          null,
          '條件子句裡不用 will。',
          'would 用於與事實相反的假設。',
          '這句講的是未來的可能，不用過去式。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第2單元 分詞'] = {
  intro: '動詞加 ing 或改成過去分詞，就能當形容詞用。',
  cards: [
    {
      title: '① 兩種分詞',
      body: '現在分詞（動詞 ing）：主動、進行\n' +
            '　 a running boy（正在跑的男孩）\n' +
            '過去分詞（p.p.）：被動、完成\n' +
            '　 a broken window（被打破的窗戶）\n' +
            '⚠ 判斷關鍵：被修飾的名詞是「做」還是「被做」。',
      viz: { type: 'compareexp',
             factor: '主動還是被動',
             a: { label: '現在分詞', note: '主動：a crying baby' },
             b: { label: '過去分詞', note: '被動：a stolen bike' },
             same: ['都當形容詞用'] },
      check: {
        q: '「一扇破掉的窗戶」的正確說法是什麼？',
        options: [
          'a broken window',
          'a breaking window',
          'a break window',
          'a windows broken'
        ],
        answer: 0,
        why: [
          null,
          '窗戶是被打破的，要用過去分詞。',
          '這裡需要分詞形式當形容詞。',
          '形容詞要放在名詞前面。'
        ]
      }
    },
    {
      title: '② 情緒形容詞',
      body: 'ing 結尾形容「事物」：The movie is boring.\n' +
            'ed 結尾形容「人的感受」：I am bored.\n' +
            '⚠ 說 I am boring 就變成「我這個人很無聊」，\n' +
            '意思完全不同。',
      viz: { type: 'compareexp',
             factor: '形容誰',
             a: { label: 'ing 結尾', note: '事物讓人有感覺：exciting news' },
             b: { label: 'ed 結尾', note: '人的感受：I am excited.' },
             same: ['來自同一個動詞'] },
      check: {
        q: '「我對這本書很有興趣」的正確說法是什麼？',
        options: [
          'I am interested in this book.',
          'I am interesting in this book.',
          'This book is interested.',
          'I am interest this book.'
        ],
        answer: 0,
        why: [
          null,
          'ing 結尾用來形容事物。',
          '書是引起興趣的一方，要用 interesting。',
          '這個句子缺少介系詞與正確的形容詞。'
        ]
      }
    },
    {
      title: '③ 分詞片語修飾名詞',
      body: '分詞單獨用放名詞前面：a sleeping cat\n' +
            '分詞帶著其他字時放名詞後面：\n' +
            'The girl sitting by the window is my sister.\n' +
            '⚠ 這等於省略了關係代名詞與 be 動詞。',
      viz: { type: 'sentence', label: '分詞片語', items: [
        { t: 'The girl', r: '被修飾的名詞' },
        { t: 'sitting by the window', r: '分詞片語（放後面）' },
        { t: 'is my sister', r: '主要動詞' }],
        note: '分詞片語放在被修飾的名詞後面。' },
      check: {
        q: 'The man ___ over there is my teacher.（站在那裡）空格要填什麼？',
        options: ['standing', 'stood', 'to stand', 'stands'],
        answer: 0,
        why: [
          null,
          '這裡要用現在分詞表示主動進行。',
          '這個位置不用不定詞。',
          '句子已有主要動詞 is。'
        ]
      }
    },
    {
      title: '④ 由關係子句簡化而來',
      body: 'The boy who is running ＝ The boy running\n' +
            'The book which was written by him ＝ The book written by him\n' +
            '⚠ 省略「關係代名詞 ＋ be 動詞」就變成分詞片語。',
      viz: { type: 'energyflow', steps: ['關係子句：who is running', '省略 who is', '剩下 running', '分詞片語完成'] },
      check: {
        q: 'The letter which was sent yesterday 可以簡化成什麼？',
        options: [
          'The letter sent yesterday',
          'The letter sending yesterday',
          'The letter to send yesterday',
          'The letter sends yesterday'
        ],
        answer: 0,
        why: [
          null,
          '信是被寄出的，要用過去分詞。',
          '這裡不用不定詞。',
          '簡化後不會留下限定動詞。'
        ]
      }
    },
    {
      title: '⑤ 分詞構句',
      body: 'Walking down the street, I met an old friend.\n' +
            '＝ While I was walking down the street, I met…\n' +
            '⚠ 兩個子句的主詞相同時，可以把附屬子句簡化成分詞。',
      viz: { type: 'energyflow', steps: ['找出兩句的主詞', '主詞相同才能簡化', '刪掉連接詞與主詞', '動詞改成分詞'] },
      check: {
        q: '把 Because he was tired, he went to bed early. 改成分詞構句是什麼？',
        options: [
          'Being tired, he went to bed early.',
          'Been tired, he went to bed early.',
          'Be tired, he went to bed early.',
          'Tiring, he went to bed early.'
        ],
        answer: 0,
        why: [
          null,
          'been 不能單獨開頭。',
          '分詞構句不用原形動詞。',
          'tiring 形容事物，語意不對。'
        ]
      }
    },
    {
      title: '⑥ 分詞構句的主詞要一致',
      body: '✗ Walking down the street, a dog bit me.（狗在走路？）\n' +
            '✓ Walking down the street, I was bitten by a dog.\n' +
            '⚠ 分詞的動作要由主句的主詞來做，\n' +
            '不然就會鬧笑話（叫做「懸垂分詞」）。',
      viz: { type: 'compareexp',
             factor: '主詞一不一致',
             a: { label: '正確', note: '分詞的動作由主句主詞做' },
             b: { label: '錯誤', note: '主詞不一致就變成懸垂分詞' },
             same: ['形式看起來一樣'] },
      check: {
        q: '下列哪一句沒有懸垂分詞的問題？',
        options: [
          'Running to the bus, I dropped my keys.',
          'Running to the bus, my keys were dropped.',
          'Running to the bus, the keys fell.',
          'Running to the bus, it was raining.'
        ],
        answer: 0,
        why: [
          null,
          '鑰匙不會自己跑向公車。',
          '鑰匙不會自己跑向公車。',
          '天氣不會跑向公車。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第3單元 名詞子句'] = {
  intro: '一整個子句當名詞用，可以當主詞、受詞或補語。',
  cards: [
    {
      title: '① 什麼是名詞子句',
      body: 'I know that he is honest.\n' +
            '★ that he is honest 整個當 know 的受詞，就是名詞子句。\n' +
            '⚠ 名詞子句可以放名詞能放的任何位置。',
      viz: { type: 'sentence', label: '名詞子句當受詞', items: [
        { t: 'I know', r: '主句' }, { t: 'that he is honest', r: '名詞子句（當受詞）' }],
        note: '整個子句扮演一個名詞的角色。' },
      check: {
        q: 'I believe that she will come. 這裡的 that 子句在做什麼？',
        options: [
          '當 believe 的受詞',
          '當句子的主詞',
          '修飾前面的名詞',
          '表示原因'
        ],
        answer: 0,
        why: [
          null,
          '句子的主詞是 I。',
          '這裡沒有被修飾的名詞。',
          'that 在這裡不表示原因。'
        ]
      }
    },
    {
      title: '② that 引導的名詞子句',
      body: '當受詞時 that 常可省略：I think (that) he is right.\n' +
            '當主詞時不能省略，而且常改用 it 當虛主詞：\n' +
            'It is true that he lied.',
      viz: { type: 'compareexp',
             factor: '在句中的位置',
             a: { label: '當受詞', note: 'that 可以省略' },
             b: { label: '當主詞', note: 'that 不能省略，常用 it 代替' },
             same: ['都是完整的子句'] },
      check: {
        q: '下列哪一句的 that 可以省略？',
        options: [
          'I hope that you feel better.',
          'That he is honest is well known.',
          'The fact that he lied surprised us.',
          'That she left early is strange.'
        ],
        answer: 0,
        why: [
          null,
          '當主詞時 that 不能省略。',
          '這裡的 that 引導同位語，不能省略。',
          '當主詞時 that 不能省略。'
        ]
      }
    },
    {
      title: '③ 疑問詞引導的名詞子句',
      body: 'I don’t know where he lives.（間接問句就是名詞子句）\n' +
            'What he said is true.（當主詞）\n' +
            '⚠ 語序一律是陳述句：疑問詞 ＋ 主詞 ＋ 動詞。',
      viz: { type: 'sentence', label: '陳述句語序', items: [
        { t: 'where', r: '疑問詞' }, { t: 'he', r: '主詞' },
        { t: 'lives', r: '動詞' }],
        note: '名詞子句裡用陳述句的語序。' },
      check: {
        q: '下列哪一句正確？',
        options: [
          'What she wants is a new phone.',
          'What does she want is a new phone.',
          'What wants she is a new phone.',
          'What she want is a new phone.'
        ],
        answer: 0,
        why: [
          null,
          '名詞子句裡不用助動詞倒裝。',
          '名詞子句要用陳述句的語序。',
          '第三人稱單數的動詞要加 s。'
        ]
      }
    },
    {
      title: '④ whether 與 if',
      body: '兩者都表示「是否」，但：\n' +
            '★ 當主詞、放介系詞後面、後接 or not 時只能用 whether。\n' +
            'Whether he comes or not is not important.\n' +
            '⚠ 當受詞時兩個都可以：I don’t know if／whether he will come.',
      viz: { type: 'classify', groups: [
        { label: '只能用 whether', items: ['當主詞', '介系詞後面', '接 or not', '接不定詞'] },
        { label: '兩者皆可', items: ['當一般動詞的受詞'] }] },
      check: {
        q: '___ he will come is still unknown. 空格要填什麼？',
        options: ['Whether', 'If', 'That if', 'What'],
        answer: 0,
        why: [
          null,
          '當主詞時只能用 whether。',
          '兩個連接詞不能連用。',
          'what 在這裡語意不通。'
        ]
      }
    },
    {
      title: '⑤ 名詞子句當補語',
      body: 'The problem is that we have no money.\n' +
            'My question is why he did it.\n' +
            '⚠ 放在 be 動詞後面說明主詞的內容，就是補語。',
      viz: { type: 'sentence', label: '名詞子句當補語', items: [
        { t: 'The problem', r: '主詞' }, { t: 'is', r: 'be 動詞' },
        { t: 'that we have no money', r: '名詞子句（補語）' }],
        note: 'be 動詞後面的子句說明主詞的內容。' },
      check: {
        q: 'The truth is ___ he never came. 空格填什麼最合適？',
        options: ['that', 'what', 'which', 'who'],
        answer: 0,
        why: [
          null,
          'what 後面的子句會缺一個成分。',
          'which 用來引導形容詞子句。',
          'who 用來指人。'
        ]
      }
    },
    {
      title: '⑥ 名詞子句與形容詞子句的差別',
      body: '名詞子句：本身就是一個成分（主詞、受詞、補語）\n' +
            '形容詞子句：修飾前面的名詞\n' +
            'I know that he is honest.（名詞子句）\n' +
            'The man that I met is honest.（形容詞子句）\n' +
            '⚠ 看 that 前面有沒有被修飾的名詞。',
      viz: { type: 'compareexp',
             factor: 'that 前面有沒有先行詞',
             a: { label: '名詞子句', note: '前面沒有被修飾的名詞' },
             b: { label: '形容詞子句', note: '前面有先行詞' },
             same: ['都可以用 that 引導'] },
      check: {
        q: '要分辨名詞子句與形容詞子句，最快的方法是什麼？',
        options: [
          '看 that 前面有沒有被修飾的名詞',
          '看句子有幾個字',
          '看主詞是不是複數',
          '看句尾的標點'
        ],
        answer: 0,
        why: [
          null,
          '句子長度與子句類型無關。',
          '主詞單複數不影響子句的種類。',
          '標點符號無法區分這兩種子句。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第4單元 疑問詞 + to V'] = {
  intro: '疑問詞加不定詞，是名詞子句的濃縮版。',
  cards: [
    {
      title: '① 基本結構',
      body: '疑問詞 ＋ to ＋ 原形動詞\n' +
            'what to do（該做什麼）　how to swim（怎麼游泳）\n' +
            'where to go　when to start　which to choose\n' +
            '⚠ 這整組相當於一個名詞，可以當受詞或主詞。',
      viz: { type: 'sentence', label: '結構', items: [
        { t: 'I don’t know', r: '主句' }, { t: 'what to do', r: '疑問詞加不定詞' }],
        note: '這整組當作一個受詞。' },
      check: {
        q: 'Can you show me ___ this machine? 空格填什麼最合適？',
        options: [
          'how to use',
          'how use',
          'how using',
          'how to using'
        ],
        answer: 0,
        why: [
          null,
          '疑問詞後面要加 to。',
          '這個結構要用不定詞。',
          'to 後面要接原形動詞。'
        ]
      }
    },
    {
      title: '② 由名詞子句簡化而來',
      body: 'I don’t know what I should do.\n' +
            '＝ I don’t know what to do.\n' +
            '⚠ 兩句主詞相同、而且帶有「該…」的意思時才能簡化。',
      viz: { type: 'energyflow', steps: ['I don’t know what I should do.', '主詞相同', '刪掉主詞與助動詞', 'what to do'] },
      check: {
        q: 'She asked me where she should go. 可以簡化成什麼？',
        options: [
          'She asked me where to go.',
          'She asked me where going.',
          'She asked me where she to go.',
          'She asked me where go.'
        ],
        answer: 0,
        why: [
          null,
          '這個結構要用不定詞而不是動名詞。',
          '簡化後不保留主詞。',
          '疑問詞後面要加 to。'
        ]
      }
    },
    {
      title: '③ why 不用這個結構',
      body: '✗ I don’t know why to go.\n' +
            '✓ I don’t know why I should go.\n' +
            '⚠ why 不能接不定詞（Why not 是例外的固定用法）。',
      viz: { type: 'classify', groups: [
        { label: '可以接不定詞', items: ['what', 'how', 'where', 'when', 'which', 'whether'] },
        { label: '不接不定詞', items: ['why'] }] },
      check: {
        q: '下列哪一個疑問詞不能接不定詞？',
        options: ['why', 'how', 'where', 'what'],
        answer: 0,
        why: [
          null,
          'how to 是很常見的用法。',
          'where to go 是正確的說法。',
          'what to do 是正確的說法。'
        ]
      }
    },
    {
      title: '④ whether 也可以',
      body: 'I can’t decide whether to go or stay.\n' +
            '⚠ 表示「要不要」時用 whether，不用 if。\n' +
            '★ if 不能接不定詞。',
      viz: { type: 'compareexp',
             factor: '能不能接不定詞',
             a: { label: 'whether', note: '可以：whether to go' },
             b: { label: 'if', note: '不可以：不能說 if to go' },
             same: ['意思都是「是否」'] },
      check: {
        q: 'He is not sure ___ accept the offer. 空格要填什麼？',
        options: [
          'whether to',
          'if to',
          'that to',
          'whether'
        ],
        answer: 0,
        why: [
          null,
          'if 不能接不定詞。',
          'that 不能接不定詞構成這個結構。',
          '這裡需要 to 才能接原形動詞。'
        ]
      }
    },
    {
      title: '⑤ 當主詞或受詞',
      body: '當受詞：I learned how to cook.\n' +
            '當主詞：How to solve it is the question.\n' +
            '當補語：The problem is what to do next.\n' +
            '⚠ 這個結構等於一個名詞，位置很自由。',
      viz: { type: 'classify', groups: [
        { label: '可以放的位置', items: ['當主詞', '當受詞', '當補語'] }] },
      check: {
        q: 'What to wear to the party is still a problem. 這裡的 what to wear 在做什麼？',
        options: [
          '當句子的主詞',
          '當動詞的受詞',
          '修飾名詞',
          '表示目的'
        ],
        answer: 0,
        why: [
          null,
          '句中的動詞是 is，沒有受詞。',
          '這裡沒有被修飾的名詞。',
          '這個結構在句中不表示目的。'
        ]
      }
    },
    {
      title: '⑥ 常見的搭配動詞',
      body: 'know、learn、decide、forget、remember、show、tell、teach\n' +
            'Please tell me how to get there.\n' +
            '⚠ 這些動詞後面很常接疑問詞加不定詞。',
      viz: { type: 'classify', groups: [
        { label: '常見搭配', items: ['know how to', 'learn how to', 'decide what to', 'show me how to'] }] },
      check: {
        q: '「請教我怎麼用這個程式」的正確說法是什麼？',
        options: [
          'Please teach me how to use this program.',
          'Please teach me how use this program.',
          'Please teach me how to using this program.',
          'Please teach me what to use how this program.'
        ],
        answer: 0,
        why: [
          null,
          '疑問詞後面要加 to。',
          'to 後面要接原形動詞。',
          '這個句子重複了疑問詞，結構不通。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第5單元 授與動詞'] = {
  intro: '有些動詞可以帶兩個受詞：給誰、給什麼。',
  cards: [
    {
      title: '① 兩個受詞的句型',
      body: '動詞 ＋ 人 ＋ 物\n' +
            'He gave me a book.\n' +
            '★ me 是間接受詞（給誰），a book 是直接受詞（給什麼）。\n' +
            '⚠ 這類動詞叫授與動詞。',
      viz: { type: 'sentence', label: '兩個受詞', items: [
        { t: 'gave', r: '授與動詞' }, { t: 'me', r: '間接受詞（人）' },
        { t: 'a book', r: '直接受詞（物）' }],
        note: '人在前、物在後。' },
      check: {
        q: 'She sent me a postcard. 這句話裡的 me 是什麼？',
        options: [
          '間接受詞，表示寄給誰',
          '直接受詞，表示寄什麼',
          '主詞',
          '補語'
        ],
        answer: 0,
        why: [
          null,
          '直接受詞是 a postcard。',
          '句子的主詞是 She。',
          '這個句子沒有補語。'
        ]
      }
    },
    {
      title: '② 換順序要加介系詞',
      body: 'He gave me a book. ＝ He gave a book to me.\n' +
            '★ 物放前面時，人的前面要加介系詞。\n' +
            '⚠ 大多數用 to，少數用 for。',
      viz: { type: 'compareexp',
             factor: '哪個受詞在前',
             a: { label: '人在前', note: 'gave me a book（不加介系詞）' },
             b: { label: '物在前', note: 'gave a book to me（要加 to）' },
             same: ['意思相同'] },
      check: {
        q: 'He showed me the photo. 換句話說是什麼？',
        options: [
          'He showed the photo to me.',
          'He showed the photo me.',
          'He showed to me the photo.',
          'He showed for me the photo.'
        ],
        answer: 0,
        why: [
          null,
          '物放前面時人的前面要加介系詞。',
          '介系詞片語要放在直接受詞後面。',
          'show 搭配的介系詞是 to。'
        ]
      }
    },
    {
      title: '③ 用 to 的動詞',
      body: 'give、send、show、tell、teach、lend、pass、write、offer\n' +
            '⚠ 這些動作都有「傳遞給對方」的意味，所以用 to。',
      viz: { type: 'classify', groups: [
        { label: '搭配 to', items: ['give', 'send', 'show', 'teach', 'lend', 'pass'] }] },
      check: {
        q: 'He lent his bike ___ me. 空格要填什麼？',
        options: ['to', 'for', 'at', 'with'],
        answer: 0,
        why: [
          null,
          'lend 搭配的介系詞是 to。',
          'at 不用於這個句型。',
          'with 不用於這個句型。'
        ]
      }
    },
    {
      title: '④ 用 for 的動詞',
      body: 'buy、make、cook、get、find、sing、do\n' +
            'She made a cake for me.\n' +
            '⚠ 這些動作是「為了某人做」，所以用 for。',
      viz: { type: 'compareexp',
             factor: '動作的性質',
             a: { label: 'to（傳遞給）', note: 'give、send、show' },
             b: { label: 'for（為了某人）', note: 'buy、make、cook' },
             same: ['都可以帶兩個受詞'] },
      check: {
        q: 'My mom bought a gift ___ me. 空格要填什麼？',
        options: ['for', 'to', 'at', 'of'],
        answer: 0,
        why: [
          null,
          'buy 搭配的介系詞是 for。',
          'at 不用於這個句型。',
          'of 不用於這個句型。'
        ]
      }
    },
    {
      title: '⑤ 受詞是代名詞時',
      body: 'Give it to me.（○）　Give me it.（少用）\n' +
            '⚠ 直接受詞是代名詞（it、them）時，\n' +
            '習慣用「物 ＋ to ＋ 人」的順序。',
      viz: { type: 'compareexp',
             factor: '受詞是名詞還是代名詞',
             a: { label: '名詞', note: 'Give me the book.（自然）' },
             b: { label: '代名詞', note: 'Give it to me.（自然）' },
             same: ['意思相同'] },
      check: {
        q: '下列哪一個說法最自然？',
        options: [
          'Please pass it to me.',
          'Please pass me it.',
          'Please pass to me it.',
          'Please pass it me to.'
        ],
        answer: 0,
        why: [
          null,
          '直接受詞是代名詞時這樣說較不自然。',
          '介系詞片語要放在直接受詞後面。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '⑥ 只能用一種順序的動詞',
      body: 'explain、introduce、suggest、describe 只能用「to ＋ 人」：\n' +
            '✗ He explained me the rule.\n' +
            '✓ He explained the rule to me.\n' +
            '⚠ 這幾個動詞不能直接接「人」。',
      viz: { type: 'classify', groups: [
        { label: '兩種順序都可以', items: ['give', 'send', 'show', 'buy'] },
        { label: '只能用 to 加人', items: ['explain', 'introduce', 'suggest', 'describe'] }] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'He explained the problem to us.',
          'He explained us the problem.',
          'He explained to us it problem.',
          'He explained us to the problem.'
        ],
        answer: 0,
        why: [
          null,
          'explain 不能直接接人當受詞。',
          '這個句子的結構不通順。',
          '介系詞的位置不正確。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第6單元 反身代名詞'] = {
  intro: '動作回到自己身上時，受詞要用反身代名詞。',
  cards: [
    {
      title: '① 八個反身代名詞',
      body: 'myself、yourself、himself、herself、itself\n' +
            'ourselves、yourselves、themselves\n' +
            '⚠ 單數用 self，複數用 selves；\n' +
            'yourself 與 yourselves 靠上下文區分。',
      viz: { type: 'classify', groups: [
        { label: '單數（self）', items: ['myself', 'yourself', 'himself', 'herself', 'itself'] },
        { label: '複數（selves）', items: ['ourselves', 'yourselves', 'themselves'] }] },
      check: {
        q: 'they 的反身代名詞是什麼？',
        options: ['themselves', 'themself', 'theirselves', 'theirself'],
        answer: 0,
        why: [
          null,
          '複數要用 selves。',
          '這個拼法並不存在。',
          '這個拼法並不存在。'
        ]
      }
    },
    {
      title: '② 動作回到自己身上',
      body: 'He hurt himself.（他弄傷了自己。）\n' +
            '★ 主詞和受詞是同一個人時，受詞要用反身代名詞。\n' +
            '⚠ ✗ He hurt him.（這個 him 是別人）',
      viz: { type: 'compareexp',
             factor: '受詞是誰',
             a: { label: 'himself', note: '受詞就是主詞本人' },
             b: { label: 'him', note: '受詞是另一個人' },
             same: ['都放在動詞後面'] },
      check: {
        q: 'She looked at ___ in the mirror.（看自己）空格要填什麼？',
        options: ['herself', 'her', 'she', 'hers'],
        answer: 0,
        why: [
          null,
          'her 指的是另一個女生。',
          '主格不能放在介系詞後面。',
          'hers 表示所有，語意不通。'
        ]
      }
    },
    {
      title: '③ 表示強調',
      body: 'I did it myself.（我親自做的。）\n' +
            'The teacher himself said so.（老師本人這麼說的。）\n' +
            '⚠ 這個用法可以省略，句子照樣完整；\n' +
            '位置可以放主詞後面或句尾。',
      viz: { type: 'compareexp',
             factor: '能不能省略',
             a: { label: '當受詞', note: '不能省略：He hurt himself.' },
             b: { label: '表示強調', note: '可以省略：I did it (myself).' },
             same: ['形式完全一樣'] },
      check: {
        q: 'The president himself attended the meeting. 這裡的 himself 在做什麼？',
        options: [
          '強調是總統本人親自出席',
          '當動詞的受詞',
          '表示總統受了傷',
          '當句子的主詞'
        ],
        answer: 0,
        why: [
          null,
          '句子的受詞是 the meeting。',
          '句中沒有提到受傷。',
          '句子的主詞是 the president。'
        ]
      }
    },
    {
      title: '④ 常見片語',
      body: 'by oneself（獨自、靠自己）\n' +
            'enjoy oneself（玩得開心）\n' +
            'help oneself (to)（自行取用）\n' +
            'make oneself at home（別客氣，當自己家）\n' +
            '⚠ 這些是固定用法，直接整組記。',
      viz: { type: 'classify', groups: [
        { label: '常見片語', items: ['by myself', 'enjoy yourself', 'help yourself', 'teach myself'] }] },
      check: {
        q: '請客人自行取用食物，可以說什麼？',
        options: [
          'Help yourself.',
          'Help you.',
          'Help your.',
          'Yourself help.'
        ],
        answer: 0,
        why: [
          null,
          '這個片語要用反身代名詞。',
          'your 是所有格，後面要接名詞。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '⑤ 不用反身代名詞的情況',
      body: '穿衣服、洗澡這類日常動作，英文不用反身代名詞：\n' +
            '✗ I dressed myself every morning.\n' +
            '✓ I get dressed every morning.\n' +
            '⚠ 中文說「自己穿衣服」，英文不用特別加 myself。',
      viz: { type: 'classify', groups: [
        { label: '要用反身代名詞', items: ['hurt oneself', 'enjoy oneself', 'teach oneself'] },
        { label: '通常不用', items: ['get dressed', 'take a shower', 'wake up'] }] },
      check: {
        q: '下列哪一句比較自然？',
        options: [
          'I take a shower every day.',
          'I shower myself every day.',
          'I wash myself shower every day.',
          'I take myself a shower every day.'
        ],
        answer: 0,
        why: [
          null,
          '這類日常動作不需要反身代名詞。',
          '這個句子的結構不通順。',
          '這個句型不需要反身代名詞。'
        ]
      }
    },
    {
      title: '⑥ by oneself 與 on one’s own',
      body: 'I did it by myself. ＝ I did it on my own.\n' +
            '⚠ 兩者都表示「靠自己」，可以互換；\n' +
            '注意 on 後面用的是所有格（my own），不是反身代名詞。',
      viz: { type: 'compareexp',
             factor: '搭配的形式',
             a: { label: 'by oneself', note: '用反身代名詞' },
             b: { label: 'on one’s own', note: '用所有格' },
             same: ['意思相同'] },
      check: {
        q: '「他自己完成了這個專案」哪一個說法正確？',
        options: [
          'He finished the project on his own.',
          'He finished the project on himself.',
          'He finished the project by his own.',
          'He finished the project by his self.'
        ],
        answer: 0,
        why: [
          null,
          'on 後面要用所有格。',
          'by 要搭配反身代名詞。',
          '反身代名詞要寫成一個字。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第7單元 不定代名詞'] = {
  intro: 'some、any、one、none 這類字，指的是不特定的人或物。',
  cards: [
    {
      title: '① some 與 any',
      body: 'some：肯定句、期待肯定回答的邀請\n' +
            'any：否定句、一般疑問句\n' +
            'Would you like some coffee?（邀請仍用 some）\n' +
            '⚠ any 用在肯定句時意思變成「任何一個」。',
      viz: { type: 'compareexp',
             factor: '句子的類型',
             a: { label: 'some', note: '肯定句與邀請句' },
             b: { label: 'any', note: '否定句與疑問句' },
             same: ['都表示不確定的數量'] },
      check: {
        q: 'Would you like ___ tea? 空格填什麼最自然？',
        options: ['some', 'any', 'a', 'much'],
        answer: 0,
        why: [
          null,
          '邀請句期待肯定回答，習慣用 some。',
          'tea 是不可數名詞，不加冠詞 a。',
          'much 多用在否定句與疑問句。'
        ]
      }
    },
    {
      title: '② 複合不定代名詞',
      body: 'someone／somebody／something／somewhere\n' +
            'anyone／anything　　no one／nothing　　everyone／everything\n' +
            '★ 這些字一律當「單數」，動詞用單數形。\n' +
            '⚠ Everyone is here.（不是 are）',
      viz: { type: 'sentence', label: '一律當單數', items: [
        { t: 'Everyone', r: '不定代名詞（單數）' }, { t: 'is', r: '單數動詞' },
        { t: 'here', r: '補語' }],
        note: '這類字視為單數。' },
      check: {
        q: 'Everybody ___ ready. 空格要填什麼？',
        options: ['is', 'are', 'were', 'be'],
        answer: 0,
        why: [
          null,
          '這類不定代名詞視為單數。',
          '句子講的是現在的狀況。',
          'be 是原形，句子需要現在式。'
        ]
      }
    },
    {
      title: '③ 形容詞放後面',
      body: 'something new（新的東西）　anyone else（其他任何人）\n' +
            '★ 修飾這類字的形容詞要放在「後面」。\n' +
            '⚠ ✗ new something',
      viz: { type: 'compareexp',
             factor: '形容詞的位置',
             a: { label: '一般名詞', note: '形容詞在前：a new book' },
             b: { label: '不定代名詞', note: '形容詞在後：something new' },
             same: ['都是形容詞修飾名詞'] },
      check: {
        q: '「有趣的事」的正確說法是什麼？',
        options: [
          'something interesting',
          'interesting something',
          'something is interesting thing',
          'an interesting something'
        ],
        answer: 0,
        why: [
          null,
          '修飾這類字的形容詞要放後面。',
          '這個說法重複而且不通順。',
          '這類字前面不加冠詞。'
        ]
      }
    },
    {
      title: '④ one 與 it',
      body: 'one 指「同類的另一個」：I lost my pen. I need to buy one.\n' +
            'it 指「就是那一個」：I lost my pen. I can’t find it.\n' +
            '⚠ 這是很常考的區別。',
      viz: { type: 'compareexp',
             factor: '指的是不是同一個',
             a: { label: 'one', note: '同類的另一個' },
             b: { label: 'it', note: '就是原本那一個' },
             same: ['都代替前面提過的名詞'] },
      check: {
        q: 'My phone is broken. I want to buy a new ___. 空格要填什麼？',
        options: ['one', 'it', 'that', 'this'],
        answer: 0,
        why: [
          null,
          'it 指的是原本那支壞掉的手機。',
          'that 在這裡指代不清楚。',
          'this 在這裡指代不清楚。'
        ]
      }
    },
    {
      title: '⑤ both、either、neither、all、none',
      body: 'both（兩者都，複數動詞）　either（兩者之一，單數）\n' +
            'neither（兩者都不，單數）　all（全部）　none（都沒有）\n' +
            '⚠ both 用複數動詞，either 與 neither 用單數動詞。',
      viz: { type: 'classify', groups: [
        { label: '複數動詞', items: ['both', 'all（可數時）'] },
        { label: '單數動詞', items: ['either', 'neither', 'each', 'every'] }] },
      check: {
        q: 'Neither of the answers ___ correct. 空格填什麼最合適？',
        options: ['is', 'are', 'were', 'have'],
        answer: 0,
        why: [
          null,
          'neither 視為單數。',
          '句子講的是現在的狀況。',
          '這裡需要 be 動詞而不是 have。'
        ]
      }
    },
    {
      title: '⑥ other 家族',
      body: 'another（三者以上中的另一個，單數）\n' +
            'the other（兩者中的另一個）\n' +
            'others（其他幾個）　the others（其餘全部）\n' +
            '⚠ 有 the 表示「特定、剩下的全部」。',
      viz: { type: 'classify', groups: [
        { label: '不特定', items: ['another', 'others'] },
        { label: '特定（剩下的）', items: ['the other', 'the others'] }] },
      check: {
        q: 'I have two pens. One is red, and ___ is blue. 空格要填什麼？',
        options: ['the other', 'another', 'other', 'others'],
        answer: 0,
        why: [
          null,
          'another 用於三者以上。',
          'other 後面要接名詞。',
          'others 是複數，這裡只剩一枝。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第8單元 附加問句'] = {
  intro: '句尾加一小段問句，用來確認或尋求同意。',
  cards: [
    {
      title: '① 基本規則',
      body: '★ 前肯後否、前否後肯\n' +
            'You are a student, aren’t you?\n' +
            'He isn’t here, is he?\n' +
            '⚠ 附加問句用的助動詞要對應前面的句子。',
      viz: { type: 'compareexp',
             factor: '前面是肯定還是否定',
             a: { label: '前面肯定', note: '後面用否定：…, isn’t it?' },
             b: { label: '前面否定', note: '後面用肯定：…, is it?' },
             same: ['都在確認對方的看法'] },
      check: {
        q: 'She is your sister, ___? 空格要填什麼？',
        options: ['isn’t she', 'is she', 'doesn’t she', 'isn’t it'],
        answer: 0,
        why: [
          null,
          '前面是肯定句，後面要用否定。',
          '前面用 be 動詞，附加問句也要用 be 動詞。',
          '代名詞要對應主詞 she。'
        ]
      }
    },
    {
      title: '② 用什麼助動詞',
      body: 'be 動詞句 → 用 be 動詞：You are ready, aren’t you?\n' +
            '一般動詞句 → 用 do／does／did：He likes it, doesn’t he?\n' +
            '有助動詞 → 沿用那個助動詞：She can swim, can’t she?',
      viz: { type: 'classify', groups: [
        { label: 'be 動詞句', items: ['is → isn’t', 'are → aren’t'] },
        { label: '一般動詞句', items: ['likes → doesn’t', 'went → didn’t'] },
        { label: '有助動詞', items: ['can → can’t', 'will → won’t'] }] },
      check: {
        q: 'They went to the party, ___? 空格要填什麼？',
        options: ['didn’t they', 'don’t they', 'weren’t they', 'haven’t they'],
        answer: 0,
        why: [
          null,
          '句子是過去式，要用 didn’t。',
          '句中用的是一般動詞而不是 be 動詞。',
          '句子不是完成式。'
        ]
      }
    },
    {
      title: '③ 主詞用代名詞',
      body: 'Tom is your friend, isn’t he?（不是 isn’t Tom）\n' +
            'The books are new, aren’t they?\n' +
            '⚠ 附加問句的主詞一律換成代名詞。',
      viz: { type: 'energyflow', steps: ['找出主詞', '換成代名詞', '決定肯定或否定', '完成附加問句'] },
      check: {
        q: 'Your parents are teachers, ___? 空格要填什麼？',
        options: ['aren’t they', 'aren’t your parents', 'isn’t he', 'don’t they'],
        answer: 0,
        why: [
          null,
          '附加問句的主詞要用代名詞。',
          '主詞是複數，代名詞要用 they。',
          '句中用的是 be 動詞。'
        ]
      }
    },
    {
      title: '④ 特殊情況',
      body: 'I am…, aren’t I?（固定用法）\n' +
            'Let’s…, shall we?\n' +
            '祈使句, will you?：Close the door, will you?\n' +
            'There is…, isn’t there?（保留 there）',
      viz: { type: 'classify', groups: [
        { label: '固定搭配', items: ['I am → aren’t I', 'Let’s → shall we', '祈使句 → will you'] }] },
      check: {
        q: 'Let’s go for a walk, ___? 空格要填什麼？',
        options: ['shall we', 'will you', 'don’t we', 'aren’t we'],
        answer: 0,
        why: [
          null,
          'will you 用在祈使句後面。',
          'Let’s 的固定搭配是 shall we。',
          'Let’s 的固定搭配是 shall we。'
        ]
      }
    },
    {
      title: '⑤ 句中有否定詞時',
      body: 'never、seldom、hardly、few、little 都算否定：\n' +
            'He never comes late, does he?（後面用肯定）\n' +
            '⚠ 這些字讓句子變成否定，附加問句就要用肯定。',
      viz: { type: 'classify', groups: [
        { label: '算否定的字', items: ['never', 'seldom', 'hardly', 'few', 'little', 'no'] }] },
      check: {
        q: 'She hardly ever eats meat, ___? 空格要填什麼？',
        options: ['does she', 'doesn’t she', 'is she', 'has she'],
        answer: 0,
        why: [
          null,
          'hardly 讓句子帶否定，後面要用肯定。',
          '句中用的是一般動詞。',
          '句子不是完成式。'
        ]
      }
    },
    {
      title: '⑥ 語調決定意思',
      body: '語調下降：只是尋求同意（我知道答案）\n' +
            '語調上揚：真的在問（我不確定）\n' +
            '⚠ 同樣一句話，語調不同意思就不同，\n' +
            '這在聽力測驗常出現。',
      viz: { type: 'compareexp',
             factor: '語調',
             a: { label: '下降', note: '尋求認同，不是真的疑問' },
             b: { label: '上揚', note: '真的不確定，在問對方' },
             same: ['文字完全一樣'] },
      check: {
        q: '附加問句用「上揚」的語調時，表示說話者的態度是什麼？',
        options: [
          '真的不確定，在詢問對方',
          '已經很確定，只是尋求同意',
          '在命令對方',
          '在表達生氣'
        ],
        answer: 0,
        why: [
          null,
          '已經確定時語調通常下降。',
          '附加問句不是命令的語氣。',
          '語調上揚表示疑問而不是生氣。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九上|第9單元 時態綜合複習'] = {
  intro: '把國中三年學的時態整理成一張地圖。',
  cards: [
    {
      title: '① 五個核心時態',
      body: '現在簡單式：習慣與事實\n' +
            '現在進行式：此刻正在做\n' +
            '過去簡單式：過去發生並結束\n' +
            '未來式：還沒發生\n' +
            '現在完成式：從過去延續或影響到現在',
      viz: { type: 'tense', verb: 'eat', highlight: '現在完成式' },
      check: {
        q: '哪一種時態強調「過去的事對現在造成的影響」？',
        options: [
          '現在完成式',
          '過去簡單式',
          '現在進行式',
          '未來式'
        ],
        answer: 0,
        why: [
          null,
          '過去簡單式只講過去，與現在無關。',
          '現在進行式講的是此刻正在做的事。',
          '未來式講的是還沒發生的事。'
        ]
      }
    },
    {
      title: '② 靠時間副詞判斷',
      body: 'every day、usually → 現在簡單式\n' +
            'now、Look! → 現在進行式\n' +
            'yesterday、ago、last… → 過去簡單式\n' +
            'tomorrow、next… → 未來式\n' +
            'since、for、already、ever → 現在完成式',
      viz: { type: 'classify', groups: [
        { label: '現在簡單式', items: ['every day', 'always', 'usually'] },
        { label: '過去式', items: ['yesterday', 'ago', 'last week'] },
        { label: '完成式', items: ['since', 'for', 'already', 'ever'] }] },
      check: {
        q: '看到 since 2018 這個訊號，應該用哪一種時態？',
        options: [
          '現在完成式',
          '過去簡單式',
          '現在進行式',
          '未來式'
        ],
        answer: 0,
        why: [
          null,
          '過去式不能搭配 since 表示持續。',
          '現在進行式不表示從過去持續。',
          'since 指的是過去的起點。'
        ]
      }
    },
    {
      title: '③ 過去式與完成式怎麼選',
      body: '有明確的過去時間 → 過去式\n' +
            '沒有指明時間、強調經驗或結果 → 完成式\n' +
            'I lost my key yesterday.（過去式）\n' +
            'I have lost my key.（完成式：現在還找不到）',
      viz: { type: 'compareexp',
             factor: '有沒有指明時間',
             a: { label: '過去式', note: '有明確時間點' },
             b: { label: '現在完成式', note: '不指明時間，強調現在的影響' },
             same: ['動作都發生在過去'] },
      check: {
        q: 'I ___ my homework. Now I can play.（剛寫完）哪一個最合適？',
        options: [
          'have finished',
          'finish',
          'will finish',
          'am finishing'
        ],
        answer: 0,
        why: [
          null,
          '現在簡單式無法表達剛完成。',
          '未來式表示還沒做。',
          '進行式表示還在做。'
        ]
      }
    },
    {
      title: '④ 子句裡的時態',
      body: '① 時間與條件子句用現在式代替未來式\n' +
            '　 I will call you when I arrive.\n' +
            '② 主要子句是過去式時，附屬子句通常也用過去式\n' +
            '　 He said that he was tired.\n' +
            '⚠ 這叫時態一致。',
      viz: { type: 'sentence', label: '時態一致', items: [
        { t: 'He said', r: '主句：過去式' }, { t: 'that he was tired', r: '子句：也用過去式' }],
        note: '主句是過去式時，子句通常跟著往前推。' },
      check: {
        q: 'She said that she ___ busy. 空格填什麼最合適？',
        options: ['was', 'is', 'will be', 'has been'],
        answer: 0,
        why: [
          null,
          '主句是過去式，子句要配合。',
          '這裡不用未來式。',
          '這裡不用完成式。'
        ]
      }
    },
    {
      title: '⑤ 進行式的兩個限制',
      body: '① 狀態動詞不用進行式：know、like、want、have（擁有）\n' +
            '② 進行式一定要有 be 動詞，缺一不可\n' +
            '⚠ 這兩點是最常見的扣分點。',
      viz: { type: 'classify', groups: [
        { label: '可用進行式', items: ['run', 'eat', 'study', 'write'] },
        { label: '不用進行式', items: ['know', 'like', 'want', 'belong'] }] },
      check: {
        q: '下列哪一句正確？',
        options: [
          'I know the answer.',
          'I am knowing the answer.',
          'I knowing the answer.',
          'I am know the answer.'
        ],
        answer: 0,
        why: [
          null,
          'know 是狀態動詞，不用進行式。',
          '這個句子缺少動詞的正確形式。',
          'be 動詞不能直接接原形動詞。'
        ]
      }
    },
    {
      title: '⑥ 三步驟檢查法',
      body: '① 找時間副詞 → 決定時態\n' +
            '② 看主詞 → 決定動詞形式（加不加 s）\n' +
            '③ 看是主動還是被動 → 決定要不要用 be 加過去分詞\n' +
            '⚠ 寫完一句就跑一次這三步，錯誤會少一半。',
      viz: { type: 'energyflow', steps: ['找時間副詞', '看主詞', '判斷主動或被動', '檢查完成'] },
      check: {
        q: '檢查一個英文句子的時態時，第一步該做什麼？',
        options: [
          '先找出句中的時間副詞',
          '先數句子有幾個字',
          '先看標點符號',
          '先看句子有沒有形容詞'
        ],
        answer: 0,
        why: [
          null,
          '句子長度和時態選擇無關。',
          '標點符號不決定時態。',
          '形容詞不影響時態的判斷。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第1單元 閱讀：主旨大意'] = {
  intro: '抓主旨不是把文章讀完就好，而是知道要看哪裡。',
  cards: [
    {
      title: '① 主旨是什麼',
      body: '主旨 ＝ 整篇文章最想說的一句話。\n' +
            '不是某個細節，也不是某一句好句子。\n' +
            '⚠ 檢查方法：如果拿掉這句，整篇就沒有重點了。',
      viz: { type: 'compareexp',
             factor: '涵蓋範圍',
             a: { label: '主旨', note: '涵蓋整篇的中心想法' },
             b: { label: '細節', note: '只支持其中一段' },
             same: ['都出現在文章裡'] },
      check: {
        q: '判斷一個選項是不是主旨，最好的方法是什麼？',
        options: [
          '看它能不能涵蓋文章的每一段',
          '看它是不是文章的第一句',
          '看它有沒有出現生字',
          '看它的句子最長'
        ],
        answer: 0,
        why: [
          null,
          '第一句不一定是主旨。',
          '生字多寡與主旨無關。',
          '句子長度與主旨無關。'
        ]
      }
    },
    {
      title: '② 主題句常在哪裡',
      body: '① 段落第一句（最常見）\n' +
            '② 段落最後一句（先舉例再總結）\n' +
            '③ 沒有明說（要自己歸納）\n' +
            '⚠ 先看每段的第一句和最後一句，效率最高。',
      viz: { type: 'energyflow', steps: ['讀每段第一句', '讀每段最後一句', '找共同的主題', '歸納出主旨'] },
      check: {
        q: '快速抓文章大意時，最有效率的做法是什麼？',
        options: [
          '先讀每一段的第一句與最後一句',
          '從頭到尾逐字查字典',
          '只看標題',
          '只看最後一段'
        ],
        answer: 0,
        why: [
          null,
          '逐字查字典很花時間，也容易迷失重點。',
          '標題有時很籠統，不足以判斷。',
          '只看最後一段可能漏掉主要論點。'
        ]
      }
    },
    {
      title: '③ 轉折詞是路標',
      body: 'however、but、although → 前後意思相反，重點常在後面\n' +
            'therefore、so、thus → 帶出結論\n' +
            'for example、such as → 只是舉例，不是重點\n' +
            '⚠ 看到 however 要特別注意，後面常是作者真正的立場。',
      viz: { type: 'classify', groups: [
        { label: '轉折（重點在後）', items: ['however', 'but', 'yet', 'although'] },
        { label: '結論', items: ['therefore', 'so', 'in conclusion'] },
        { label: '舉例（非重點）', items: ['for example', 'such as', 'for instance'] }] },
      check: {
        q: '看到 However 開頭的句子，通常代表什麼？',
        options: [
          '後面是作者真正想強調的看法',
          '後面只是舉例說明',
          '文章結束了',
          '前面的內容不重要'
        ],
        answer: 0,
        why: [
          null,
          '舉例的訊號字是 for example。',
          'however 不表示文章結束。',
          '前面的內容是後面轉折的對照，仍有意義。'
        ]
      }
    },
    {
      title: '④ 常見的主旨題問法',
      body: 'What is the main idea of the passage?\n' +
            'What is the best title for this article?\n' +
            'The passage is mainly about…\n' +
            '⚠ 看到 main、best title、mainly 就是主旨題。',
      viz: { type: 'classify', groups: [
        { label: '主旨題的訊號', items: ['main idea', 'best title', 'mainly about', 'purpose'] },
        { label: '細節題的訊號', items: ['According to…', 'Which of the following…', 'When／Where'] }] },
      check: {
        q: 'What is the best title for this passage? 這是哪一種題型？',
        options: [
          '主旨題',
          '細節題',
          '字義題',
          '推論題'
        ],
        answer: 0,
        why: [
          null,
          '細節題會問特定的資訊。',
          '字義題會指定某個單字。',
          '推論題會問文章沒有明說的內容。'
        ]
      }
    },
    {
      title: '⑤ 三種錯誤選項',
      body: '① 範圍太小：只講到某一段的細節\n' +
            '② 範圍太大：超出文章談的內容\n' +
            '③ 張冠李戴：文章有提到，但不是主要論點\n' +
            '⚠ 主旨要「剛剛好」涵蓋全文。',
      viz: { type: 'compareexp',
             factor: '涵蓋的範圍',
             a: { label: '太小', note: '只是一個細節' },
             b: { label: '太大', note: '超出文章的範圍' },
             same: ['都不是正確的主旨'] },
      check: {
        q: '一篇談「運動對青少年健康的好處」的文章，哪一個選項範圍太大？',
        options: [
          '運動改變了人類歷史',
          '運動有助於青少年的身心健康',
          '規律運動能改善睡眠品質',
          '青少年應該每天運動'
        ],
        answer: 0,
        why: [
          null,
          '這正好涵蓋文章的主題。',
          '這是文章中的一個細節。',
          '這與文章的主題相符。'
        ]
      }
    },
    {
      title: '⑥ 實戰步驟',
      body: '① 先看題目，知道要找什麼\n' +
            '② 掃過每段的首尾句\n' +
            '③ 用自己的話歸納出一句主旨\n' +
            '④ 再去比對選項，選最接近的\n' +
            '⚠ 先歸納再看選項，不容易被誘答選項帶走。',
      viz: { type: 'energyflow', steps: ['先看題目', '掃首尾句', '自己歸納一句', '比對選項'] },
      check: {
        q: '做主旨題時，為什麼建議先自己歸納再看選項？',
        options: [
          '避免被似是而非的誘答選項影響判斷',
          '因為選項通常是錯的',
          '因為這樣比較快',
          '因為老師規定要這樣做'
        ],
        answer: 0,
        why: [
          null,
          '選項中只有誘答，正確答案仍在其中。',
          '這個做法重點在準確而不是速度。',
          '這是閱讀策略而不是規定。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第2單元 閱讀：細節與推論'] = {
  intro: '細節題找得到答案，推論題要多想一步。',
  cards: [
    {
      title: '① 細節題怎麼做',
      body: '細節題的答案一定寫在文章裡。\n' +
            '★ 做法：從題目抓關鍵字 → 回文章找到那一句 → 對照選項。\n' +
            '⚠ 不要憑印象作答，一定要回去找到那一行。',
      viz: { type: 'energyflow', steps: ['題目抓關鍵字', '回文章定位', '讀前後兩句', '對照選項'] },
      check: {
        q: '做細節題時，最重要的動作是什麼？',
        options: [
          '回到文章中找到寫著答案的那一句',
          '憑印象直接選',
          '選看起來最長的選項',
          '選有出現生字的選項'
        ],
        answer: 0,
        why: [
          null,
          '憑印象很容易記錯細節。',
          '選項長度和正確與否無關。',
          '生字的有無和答案無關。'
        ]
      }
    },
    {
      title: '② 小心同義改寫',
      body: '正確選項很少和原文用一模一樣的字，\n' +
            '通常會換句話說（paraphrase）。\n' +
            '文章：The store closes at nine.\n' +
            '選項：The shop is open until nine.\n' +
            '⚠ 字面一樣的選項反而常是陷阱。',
      viz: { type: 'compareexp',
             factor: '和原文的關係',
             a: { label: '同義改寫', note: '換句話說，意思相同' },
             b: { label: '字面照抄', note: '看似相同，細節被改掉' },
             same: ['都和原文長得很像'] },
      check: {
        q: '正確選項通常和原文的關係是什麼？',
        options: [
          '意思相同但換句話說',
          '一字不差地照抄',
          '完全沒有關聯',
          '比原文長很多'
        ],
        answer: 0,
        why: [
          null,
          '照抄的選項常被改動關鍵字。',
          '正確選項一定和文章有關。',
          '選項長度和正確與否無關。'
        ]
      }
    },
    {
      title: '③ 推論題的界線',
      body: '推論 ＝ 根據文章的線索合理推出來的結論。\n' +
            '★ 不能憑自己的常識或想像。\n' +
            '⚠ 檢查方法：能不能在文章裡指出支持這個推論的句子。',
      viz: { type: 'compareexp',
             factor: '有沒有文本依據',
             a: { label: '合理推論', note: '文章有線索支持' },
             b: { label: '過度推論', note: '只是自己的想像' },
             same: ['文章都沒有直接明說'] },
      check: {
        q: '判斷一個推論合不合理，關鍵是什麼？',
        options: [
          '能不能在文章裡找到支持它的線索',
          '聽起來合不合常理',
          '自己同不同意',
          '選項有沒有出現關鍵字'
        ],
        answer: 0,
        why: [
          null,
          '符合常理不代表文章這樣說。',
          '個人意見不是判斷的依據。',
          '出現關鍵字可能只是陷阱。'
        ]
      }
    },
    {
      title: '④ 推論題的訊號字',
      body: 'infer、imply、suggest、probably、most likely\n' +
            'What can we infer from the passage?\n' +
            '⚠ 看到這些字就知道答案不會直接寫在文章裡。',
      viz: { type: 'classify', groups: [
        { label: '推論題訊號', items: ['infer', 'imply', 'suggest', 'probably', 'most likely'] },
        { label: '細節題訊號', items: ['According to', 'state', 'mention'] }] },
      check: {
        q: 'What can be inferred from the passage? 這題的答案會在哪裡？',
        options: [
          '文章沒有直說，要根據線索推出來',
          '文章第一句',
          '文章最後一句',
          '題目本身'
        ],
        answer: 0,
        why: [
          null,
          '推論題的答案不會直接寫出來。',
          '推論題的答案不會直接寫出來。',
          '題目只是提問，不含答案。'
        ]
      }
    },
    {
      title: '⑤ 從語氣判斷態度',
      body: '作者的態度可以從用字看出來：\n' +
            'unfortunately、sadly → 負面\n' +
            'fortunately、impressive → 正面\n' +
            '只列出事實、沒有評價 → 中立\n' +
            '⚠ 態度題要看形容詞和副詞，不是看內容主題。',
      viz: { type: 'classify', groups: [
        { label: '正面用字', items: ['fortunately', 'impressive', 'remarkable'] },
        { label: '負面用字', items: ['unfortunately', 'sadly', 'disappointing'] },
        { label: '中立', items: ['according to', 'the data shows'] }] },
      check: {
        q: '判斷作者態度時，應該特別注意什麼？',
        options: [
          '帶有評價意味的形容詞與副詞',
          '文章的長度',
          '出現了幾個數字',
          '段落的數量'
        ],
        answer: 0,
        why: [
          null,
          '文章長度與作者態度無關。',
          '數字通常是中性的事實。',
          '段落數量與態度無關。'
        ]
      }
    },
    {
      title: '⑥ 猜字義的方法',
      body: '① 看定義：… , or ＋ 解釋\n' +
            '② 看對比：unlike、however 後面是相反的意思\n' +
            '③ 看例子：such as 後面的例子透露類別\n' +
            '④ 看字根字首（下一單元）\n' +
            '⚠ 遇到生字先猜，不要立刻放棄整句。',
      viz: { type: 'energyflow', steps: ['看有沒有定義', '看有沒有對比', '看有沒有舉例', '拆字根字首'] },
      check: {
        q: '文章寫 He is very frugal; he never wastes money. 由此可推 frugal 是什麼意思？',
        options: [
          '節儉的',
          '浪費的',
          '生氣的',
          '快樂的'
        ],
        answer: 0,
        why: [
          null,
          '後半句說他從不浪費錢，意思相反。',
          '句中沒有提到情緒。',
          '句中沒有提到心情愉快。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第3單元 字彙：字首與字尾'] = {
  intro: '拆解一個字的組成，就能猜出沒學過的單字。',
  cards: [
    {
      title: '① 單字的三個部分',
      body: '字首（prefix）＋ 字根（root）＋ 字尾（suffix）\n' +
            'unhappiness ＝ un ＋ happy ＋ ness\n' +
            '★ 字首改變意思，字尾決定詞性。\n' +
            '⚠ 這是擴充字彙最有效率的方法。',
      viz: { type: 'sentence', label: '拆解單字', items: [
        { t: 'un', r: '字首：否定' }, { t: 'happi', r: '字根：快樂' },
        { t: 'ness', r: '字尾：名詞' }],
        note: '字首管意思，字尾管詞性。' },
      check: {
        q: '單字的字尾主要決定什麼？',
        options: [
          '這個字的詞性',
          '這個字的長度',
          '這個字的發音重音一定在字尾',
          '這個字是不是外來語'
        ],
        answer: 0,
        why: [
          null,
          '字尾與單字長度沒有必然關係。',
          '重音位置不一定在字尾。',
          '字尾不能判斷是否為外來語。'
        ]
      }
    },
    {
      title: '② 否定字首',
      body: 'un（unhappy、unfair）　in／im／ir／il（impossible、illegal）\n' +
            'dis（dislike、disagree）　non（nonstop）\n' +
            '⚠ im 用在 m、p、b 前面；ir 用在 r 前面；il 用在 l 前面。',
      viz: { type: 'classify', groups: [
        { label: 'un', items: ['unhappy', 'unfair', 'unable'] },
        { label: 'im／in／ir／il', items: ['impossible', 'incorrect', 'irregular', 'illegal'] },
        { label: 'dis', items: ['dislike', 'disagree', 'dishonest'] }] },
      check: {
        q: 'possible 的否定形是什麼？',
        options: ['impossible', 'unpossible', 'dispossible', 'inpossible'],
        answer: 0,
        why: [
          null,
          '這個字的否定字首不是 un。',
          '這個字的否定字首不是 dis。',
          '字首在 p 前面要變成 im。'
        ]
      }
    },
    {
      title: '③ 常見字首的意思',
      body: 're（再一次）：rewrite、return\n' +
            'pre（之前）：preview、prepare\n' +
            'ex（向外）：export、exit\n' +
            'inter（之間）：international、Internet\n' +
            'trans（橫越）：transport、translate',
      viz: { type: 'classify', groups: [
        { label: '時間', items: ['pre（之前）', 're（再一次）'] },
        { label: '方向', items: ['ex（向外）', 'inter（之間）', 'trans（橫越）'] }] },
      check: {
        q: 'preview 這個字裡的 pre 表示什麼？',
        options: [
          '事先、之前',
          '再一次',
          '向外',
          '否定'
        ],
        answer: 0,
        why: [
          null,
          '再一次是字首 re。',
          '向外是字首 ex。',
          '否定是 un 或 in 這類字首。'
        ]
      }
    },
    {
      title: '④ 名詞字尾',
      body: 'tion／sion：action、decision\n' +
            'ment：development、agreement\n' +
            'ness：happiness、kindness\n' +
            'er／or／ist：teacher、actor、artist（人）\n' +
            'ity：ability、activity',
      viz: { type: 'classify', groups: [
        { label: '抽象名詞', items: ['action', 'movement', 'happiness', 'ability'] },
        { label: '表示人', items: ['teacher', 'actor', 'scientist'] }] },
      check: {
        q: '下列哪一個字尾表示「做某件事的人」？',
        options: ['ist', 'ness', 'tion', 'ly'],
        answer: 0,
        why: [
          null,
          'ness 構成抽象名詞。',
          'tion 構成抽象名詞。',
          'ly 多構成副詞。'
        ]
      }
    },
    {
      title: '⑤ 形容詞與副詞字尾',
      body: '形容詞：ful（helpful）、less（useless）、able（comfortable）、\n' +
            '　　　　ous（dangerous）、ive（active）、al（natural）\n' +
            '副詞：ly（quickly）\n' +
            '⚠ ful 表示有、less 表示沒有，剛好相反。',
      viz: { type: 'compareexp',
             factor: '有還是沒有',
             a: { label: 'ful', note: '充滿：helpful（有幫助的）' },
             b: { label: 'less', note: '沒有：helpless（無助的）' },
             same: ['都構成形容詞'] },
      check: {
        q: 'careless 的意思最接近什麼？',
        options: [
          '粗心的',
          '小心的',
          '關心的',
          '可以照顧的'
        ],
        answer: 0,
        why: [
          null,
          '小心的是 careful。',
          '關心的意思是 caring。',
          'less 表示缺乏而不是可以。'
        ]
      }
    },
    {
      title: '⑥ 動詞字尾',
      body: 'ize／ise：realize、organize\n' +
            'ify：simplify、classify\n' +
            'en：strengthen、widen\n' +
            '⚠ 同一個字根換不同字尾，就變成不同詞性：\n' +
            'beauty（名）→ beautiful（形）→ beautifully（副）→ beautify（動）',
      viz: { type: 'energyflow', steps: ['beauty（名詞）', 'beautiful（形容詞）', 'beautifully（副詞）', 'beautify（動詞）'] },
      check: {
        q: 'strong 加上字尾變成動詞是哪一個字？',
        options: ['strengthen', 'strongly', 'strength', 'stronger'],
        answer: 0,
        why: [
          null,
          'strongly 是副詞。',
          'strength 是名詞。',
          'stronger 是比較級形容詞。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第4單元 常見片語動詞'] = {
  intro: '動詞加上介副詞，意思常常變得完全不同。',
  cards: [
    {
      title: '① 什麼是片語動詞',
      body: '動詞 ＋ 介副詞 ＝ 新的意思\n' +
            'look（看）→ look after（照顧）→ look for（尋找）\n' +
            '⚠ 不能拆開來翻譯，要整組記。',
      viz: { type: 'classify', groups: [
        { label: 'look 家族', items: ['look after（照顧）', 'look for（尋找）', 'look up（查詢）', 'look forward to（期待）'] }] },
      check: {
        q: 'look after 的意思是什麼？',
        options: ['照顧', '尋找', '往後看', '查字典'],
        answer: 0,
        why: [
          null,
          '尋找是 look for。',
          '這是字面直譯，不是實際意思。',
          '查字典是 look up。'
        ]
      }
    },
    {
      title: '② 常見的 take 與 get',
      body: 'take off（起飛、脫下）　take care of（照顧）　take part in（參加）\n' +
            'get up（起床）　get on／off（上下車）　get along with（相處）\n' +
            '⚠ 同一個動詞配不同介副詞，意思差很多。',
      viz: { type: 'classify', groups: [
        { label: 'take', items: ['take off', 'take care of', 'take part in', 'take place'] },
        { label: 'get', items: ['get up', 'get on', 'get along with', 'get over'] }] },
      check: {
        q: 'take part in 的意思是什麼？',
        options: ['參加', '拆開', '拿走一部分', '起飛'],
        answer: 0,
        why: [
          null,
          '拆開是 take apart。',
          '這是字面直譯，不是實際意思。',
          '起飛是 take off。'
        ]
      }
    },
    {
      title: '③ 可分離與不可分離',
      body: '可分離：受詞可以放中間\n' +
            '　 turn on the light ＝ turn the light on\n' +
            '★ 受詞是代名詞時「一定」要放中間：turn it on（不是 turn on it）\n' +
            '不可分離：look after him（不能說 look him after）',
      viz: { type: 'compareexp',
             factor: '受詞能不能放中間',
             a: { label: '可分離', note: 'turn it on（代名詞一定放中間）' },
             b: { label: '不可分離', note: 'look after it（代名詞也放後面）' },
             same: ['都是動詞加介副詞'] },
      check: {
        q: '「把它關掉」的正確說法是什麼？',
        options: [
          'Turn it off.',
          'Turn off it.',
          'Turn off of it.',
          'It turn off.'
        ],
        answer: 0,
        why: [
          null,
          '代名詞受詞一定要放中間。',
          '這個說法多了不必要的介系詞。',
          '這個語序不正確。'
        ]
      }
    },
    {
      title: '④ 常見的 put 與 turn',
      body: 'put on（穿上）　put off（延期）　put up with（忍受）\n' +
            'turn on／off（開／關）　turn down（拒絕、調小）　turn in（繳交）\n' +
            '⚠ put off 不是「放下」，是「延期」。',
      viz: { type: 'classify', groups: [
        { label: 'put', items: ['put on', 'put off', 'put away', 'put up with'] },
        { label: 'turn', items: ['turn on', 'turn off', 'turn down', 'turn in'] }] },
      check: {
        q: 'The game was put off because of the rain. 這句話的意思是什麼？',
        options: [
          '比賽因雨延期了',
          '比賽因雨取消了',
          '比賽在雨中進行',
          '比賽被放在一旁'
        ],
        answer: 0,
        why: [
          null,
          '取消是 call off，延期是 put off。',
          '句子表示比賽沒有照原訂進行。',
          '這是字面直譯，不是實際意思。'
        ]
      }
    },
    {
      title: '⑤ 常見的 give 與 come',
      body: 'give up（放棄）　give in（讓步）　give away（送出）\n' +
            'come up with（想出）　come across（偶然遇到）　come true（實現）\n' +
            '⚠ give up 後面接動名詞：give up smoking。',
      viz: { type: 'classify', groups: [
        { label: 'give', items: ['give up', 'give in', 'give away', 'give back'] },
        { label: 'come', items: ['come up with', 'come across', 'come true', 'come over'] }] },
      check: {
        q: 'She came up with a great idea. 這句話的意思是什麼？',
        options: [
          '她想出了一個好點子',
          '她走上來了',
          '她同意了這個點子',
          '她放棄了這個點子'
        ],
        answer: 0,
        why: [
          null,
          '這是字面直譯，不是實際意思。',
          '同意是 agree with。',
          '放棄是 give up。'
        ]
      }
    },
    {
      title: '⑥ 怎麼有效率地記',
      body: '① 依動詞分組（look 家族、take 家族）\n' +
            '② 依介副詞的意象分組（up 常表示完成或增加，off 常表示分離）\n' +
            '③ 放進句子裡記，不要只背中文\n' +
            '⚠ 片語動詞是英文口語的核心，會用比會背更重要。',
      viz: { type: 'classify', groups: [
        { label: 'up（完成、增加）', items: ['eat up', 'grow up', 'speak up'] },
        { label: 'off（分離、離開）', items: ['take off', 'get off', 'turn off'] },
        { label: 'out（向外、耗盡）', items: ['go out', 'run out of', 'find out'] }] },
      check: {
        q: '記片語動詞時，比較有效的方法是什麼？',
        options: [
          '把它放進完整的句子裡記',
          '只背中文意思',
          '按字母順序背',
          '只記動詞不記介副詞'
        ],
        answer: 0,
        why: [
          null,
          '只背中文很難在說話時用出來。',
          '字母順序和意思之間沒有關聯。',
          '介副詞決定了片語的意思，不能省略。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第5單元 會話：問路與購物'] = {
  intro: '出門在外最常用的兩種對話。',
  cards: [
    {
      title: '① 問路的開場',
      body: 'Excuse me, how can I get to the train station?\n' +
            'Could you tell me where the post office is?\n' +
            '⚠ 先說 Excuse me，再用間接問句，最有禮貌。',
      viz: { type: 'energyflow', steps: ['Excuse me（引起注意）', '禮貌提問', '聽指示', 'Thank you（道謝）'] },
      check: {
        q: '向陌生人問路時，最好的開場是什麼？',
        options: [
          'Excuse me, could you help me?',
          'Hey, where is it?',
          'You! Tell me the way.',
          'Where station.'
        ],
        answer: 0,
        why: [
          null,
          '這個說法太隨便也不夠清楚。',
          '命令的語氣非常不禮貌。',
          '這不是完整的句子。'
        ]
      }
    },
    {
      title: '② 指路的說法',
      body: 'Go straight ahead.（直走）\n' +
            'Turn left／right at the corner.（在轉角左轉／右轉）\n' +
            'It’s on your left.（在你的左手邊。）\n' +
            'Walk two blocks.（走兩個街區。）',
      viz: { type: 'classify', groups: [
        { label: '方向', items: ['go straight', 'turn left', 'turn right'] },
        { label: '距離與位置', items: ['two blocks', 'on your left', 'across from'] }] },
      check: {
        q: 'Turn right at the second corner. 這句話的意思是什麼？',
        options: [
          '在第二個轉角右轉',
          '在第二個轉角左轉',
          '走過兩個街區',
          '在右邊第二棟'
        ],
        answer: 0,
        why: [
          null,
          'right 是右邊而不是左邊。',
          '這句話講的是轉角而不是街區。',
          '這句話講的是轉彎的位置。'
        ]
      }
    },
    {
      title: '③ 聽不懂時怎麼辦',
      body: 'Sorry, could you say that again?\n' +
            'Could you speak more slowly, please?\n' +
            'Do you mean…?（你的意思是…？）\n' +
            '⚠ 請對方重說一次比亂點頭好得多。',
      viz: { type: 'classify', groups: [
        { label: '請對方重說', items: ['Pardon?', 'Could you say that again?'] },
        { label: '確認理解', items: ['Do you mean…?', 'So I should…?'] }] },
      check: {
        q: '沒聽清楚對方說的話，最好的回應是什麼？',
        options: [
          'Sorry, could you say that again?',
          '點頭裝作聽懂了',
          '直接走開',
          'No.'
        ],
        answer: 0,
        why: [
          null,
          '裝懂之後可能走錯方向。',
          '直接走開很失禮。',
          '這個回應與問題無關。'
        ]
      }
    },
    {
      title: '④ 購物的基本對話',
      body: 'Can I help you?→ I’m just looking, thanks.（只是看看）\n' +
            'I’m looking for a jacket.（我在找一件外套。）\n' +
            'How much is it?／Can I try it on?（可以試穿嗎？）',
      viz: { type: 'energyflow', steps: ['店員招呼', '說出需求', '詢問價格', '試穿或購買'] },
      check: {
        q: '店員問 Can I help you? 但你只想隨便看看，可以怎麼回？',
        options: [
          'I’m just looking, thanks.',
          'No! Go away.',
          'I don’t know you.',
          'Help me now.'
        ],
        answer: 0,
        why: [
          null,
          '這個回應太不客氣。',
          '這個回應與情境無關。',
          '這樣說像在使喚別人。'
        ]
      }
    },
    {
      title: '⑤ 尺寸、顏色與價格',
      body: 'Do you have this in a larger size?（有大一點的嗎？）\n' +
            'Do you have it in blue?（有藍色的嗎？）\n' +
            'It’s too expensive. Is there a discount?（有折扣嗎？）\n' +
            '⚠ in ＋ 尺寸或顏色，是固定用法。',
      viz: { type: 'sentence', label: '詢問尺寸顏色', items: [
        { t: 'Do you have this', r: '你們有這個嗎' }, { t: 'in a smaller size', r: 'in 加尺寸' }],
        note: 'in 後面接尺寸或顏色。' },
      check: {
        q: '「有沒有紅色的？」的正確說法是什麼？',
        options: [
          'Do you have it in red?',
          'Do you have it red?',
          'Do you have red it?',
          'Is it have red?'
        ],
        answer: 0,
        why: [
          null,
          '顏色前面要加介系詞 in。',
          '這個語序不正確。',
          '這個句子的結構不通順。'
        ]
      }
    },
    {
      title: '⑥ 結帳與退換',
      body: 'I’ll take it.（我要買這個。）\n' +
            'Cash or credit card?（現金還是刷卡？）\n' +
            'Can I get a refund?（可以退錢嗎？）\n' +
            'Can I exchange this?（可以換貨嗎？）',
      viz: { type: 'classify', groups: [
        { label: '結帳', items: ['I’ll take it.', 'Cash or card?', 'Here is your change.'] },
        { label: '售後', items: ['refund（退款）', 'exchange（換貨）', 'receipt（收據）'] }] },
      check: {
        q: '想把買錯尺寸的衣服換一件，應該說什麼？',
        options: [
          'Can I exchange this for a larger size?',
          'Can I refund this money now?',
          'I’ll take it.',
          'Do you have it in red?'
        ],
        answer: 0,
        why: [
          null,
          'refund 是退錢，不是換貨。',
          '這是決定要買的時候說的。',
          '這是在問顏色而不是換貨。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第6單元 會話：電話與邀約'] = {
  intro: '打電話和邀約，都有固定的說法可以照著用。',
  cards: [
    {
      title: '① 電話的開場',
      body: 'Hello, this is Amy.（我是 Amy。）\n' +
            'May I speak to Mr. Lin, please?（請問林先生在嗎？）\n' +
            'Is that Ben?（請問是 Ben 嗎？）\n' +
            '⚠ 電話裡自稱用 this，不用 I am。',
      viz: { type: 'sentence', label: '電話用語', items: [
        { t: 'This is Amy', r: '自稱用 this' }, { t: 'May I speak to…', r: '找人的固定說法' }],
        note: '電話中自稱用 this is。' },
      check: {
        q: '打電話時自我介紹，正確的說法是什麼？',
        options: [
          'Hello, this is Amy.',
          'Hello, I am Amy here.',
          'Hello, that is Amy.',
          'Hello, Amy is me.'
        ],
        answer: 0,
        why: [
          null,
          '電話中的慣用法是 this is。',
          'that 用來稱呼對方。',
          '這個語序不自然。'
        ]
      }
    },
    {
      title: '② 接電話與轉接',
      body: 'Speaking.（我就是。）\n' +
            'Hold on, please.／Just a moment.（請稍等。）\n' +
            'He is not in right now.（他現在不在。）\n' +
            'May I take a message?（要留言嗎？）',
      viz: { type: 'energyflow', steps: ['接起電話', '確認找誰', '轉接或告知不在', '留言或再打'] },
      check: {
        q: '對方要找的正是你自己，可以怎麼回應？',
        options: [
          'Speaking.',
          'That is me here.',
          'I am he.',
          'Yes, I am speaking now.'
        ],
        answer: 0,
        why: [
          null,
          '這個說法不是電話的慣用語。',
          '這個說法在電話中不自然。',
          '這句話的意思變成「我正在說話」。'
        ]
      }
    },
    {
      title: '③ 留言',
      body: 'Could you tell him to call me back?（請他回電給我。）\n' +
            'Can I leave a message?（我可以留言嗎？）\n' +
            'I’ll call back later.（我晚點再打。）\n' +
            '⚠ call back 是回電，call up 是打電話給某人。',
      viz: { type: 'classify', groups: [
        { label: '留言相關', items: ['take a message', 'leave a message', 'call back'] }] },
      check: {
        q: '想請對方轉告「請他回電」，應該說什麼？',
        options: [
          'Could you ask him to call me back?',
          'Could you ask him to call me up?',
          'Could you take him a phone?',
          'Could you tell him I call?'
        ],
        answer: 0,
        why: [
          null,
          'call up 是主動打給某人，語意不合。',
          '這個說法不通順。',
          '這個句子的時態與語意不清楚。'
        ]
      }
    },
    {
      title: '④ 提出邀約',
      body: 'Would you like to go to the movies?\n' +
            'How about going out for dinner?\n' +
            'Are you free this Saturday?\n' +
            '⚠ Would you like to 後面接原形動詞，\n' +
            'How about 後面接動名詞。',
      viz: { type: 'compareexp',
             factor: '後面接什麼',
             a: { label: 'Would you like to', note: '接原形動詞：to go' },
             b: { label: 'How about', note: '接動名詞：going' },
             same: ['都在提出邀約'] },
      check: {
        q: 'How about ___ a movie tonight? 空格要填什麼？',
        options: ['watching', 'watch', 'to watch', 'watched'],
        answer: 0,
        why: [
          null,
          'about 是介系詞，後面接動名詞。',
          '介系詞後面不接不定詞。',
          '介系詞後面不接過去式。'
        ]
      }
    },
    {
      title: '⑤ 接受與婉拒',
      body: '接受：Sure, I’d love to.／That sounds great.\n' +
            '婉拒：I’d love to, but I have to study.\n' +
            '　　　I’m afraid I can’t. Maybe next time.\n' +
            '⚠ 婉拒時先表達意願再說原因，比直接說 No 得體。',
      viz: { type: 'energyflow', steps: ['先表達想去的心意', '說明無法赴約的原因', '提出下次的可能', '道謝'] },
      check: {
        q: '被邀約但真的沒空時，比較得體的回應是什麼？',
        options: [
          'I’d love to, but I have plans. Maybe next time.',
          'No.',
          'I don’t want to go with you.',
          'Ask someone else.'
        ],
        answer: 0,
        why: [
          null,
          '單獨說 No 顯得冷淡。',
          '這樣說會讓對方難堪。',
          '這個回應把責任推給對方。'
        ]
      }
    },
    {
      title: '⑥ 約定時間地點',
      body: 'What time should we meet?→ How about seven?\n' +
            'Where should we meet?→ Let’s meet at the station.\n' +
            'See you then!（到時見！）\n' +
            '⚠ 約好之後複述一次時間地點，可以避免誤會。',
      viz: { type: 'energyflow', steps: ['提出邀約', '對方接受', '敲定時間', '確認地點', '複述一次'] },
      check: {
        q: '約好見面之後，為什麼最好複述一次時間與地點？',
        options: [
          '確認雙方認知一致，避免誤會',
          '讓對話變長',
          '展示自己的英文能力',
          '這是規定'
        ],
        answer: 0,
        why: [
          null,
          '複述的目的不是拉長對話。',
          '複述是為了確認而不是展示。',
          '這是溝通的好習慣而不是規定。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第7單元 書信與電子郵件'] = {
  intro: '英文書信有固定格式，照著寫就不會失禮。',
  cards: [
    {
      title: '① 信件的五個部分',
      body: '① 稱呼（Dear…）\n' +
            '② 開場（說明寫信的目的）\n' +
            '③ 主體（詳細內容）\n' +
            '④ 結尾（期待回覆或道謝）\n' +
            '⑤ 署名（結尾語 ＋ 名字）',
      viz: { type: 'energyflow', steps: ['稱呼', '開場說明目的', '主體內容', '結尾', '署名'] },
      check: {
        q: '英文書信的第一個部分是什麼？',
        options: [
          '稱呼，例如 Dear Ms. Lin',
          '署名',
          '主體內容',
          '結尾祝福'
        ],
        answer: 0,
        why: [
          null,
          '署名放在信的最後。',
          '主體內容在開場之後。',
          '結尾祝福放在署名之前。'
        ]
      }
    },
    {
      title: '② 稱呼怎麼寫',
      body: '認識的人：Dear Amy,（後面用逗號）\n' +
            '正式：Dear Mr. Wang,／Dear Ms. Lin,\n' +
            '不知道對方是誰：Dear Sir or Madam,／To Whom It May Concern,\n' +
            '⚠ Mrs. 用於已婚，Ms. 不區分婚姻狀態，較安全。',
      viz: { type: 'classify', groups: [
        { label: '非正式', items: ['Dear Amy,', 'Hi Ben,'] },
        { label: '正式', items: ['Dear Mr. Wang,', 'Dear Sir or Madam,'] }] },
      check: {
        q: '寫信給不知道姓名的公司窗口，稱呼可以怎麼寫？',
        options: [
          'Dear Sir or Madam,',
          'Hi there,',
          'Dear friend,',
          'Hey,'
        ],
        answer: 0,
        why: [
          null,
          '這個稱呼在正式信件中太隨便。',
          '對方不是朋友，這樣稱呼不恰當。',
          '這個稱呼過於口語。'
        ]
      }
    },
    {
      title: '③ 開場句',
      body: 'I am writing to ask about…（我寫信是想詢問…）\n' +
            'Thank you for your email.（謝謝您的來信。）\n' +
            'How have you been?（近來好嗎？非正式）\n' +
            '⚠ 正式信件第一段就要說清楚目的。',
      viz: { type: 'compareexp',
             factor: '正式程度',
             a: { label: '正式', note: 'I am writing to inquire about…' },
             b: { label: '非正式', note: 'How’s it going? I want to ask…' },
             same: ['都在開場說明來意'] },
      check: {
        q: '正式書信的第一段應該做什麼？',
        options: [
          '直接說明寫信的目的',
          '先閒聊天氣',
          '先說自己的興趣',
          '直接進入結尾'
        ],
        answer: 0,
        why: [
          null,
          '正式信件不宜花太多篇幅閒聊。',
          '個人興趣與來意無關。',
          '沒有說明來意就結束會讓人困惑。'
        ]
      }
    },
    {
      title: '④ 結尾語',
      body: '正式：Sincerely,／Yours sincerely,／Best regards,\n' +
            '非正式：Best,／Take care,／Love,（家人與親密朋友）\n' +
            '⚠ 結尾語後面加逗號，下一行才寫名字。',
      viz: { type: 'classify', groups: [
        { label: '正式', items: ['Sincerely,', 'Yours sincerely,', 'Best regards,'] },
        { label: '非正式', items: ['Best,', 'Take care,', 'Love,'] }] },
      check: {
        q: '寫信給老師或公司，結尾語用哪一個最合適？',
        options: [
          'Sincerely,',
          'Love,',
          'See ya,',
          'Bye bye,'
        ],
        answer: 0,
        why: [
          null,
          'Love 只用於家人或很親密的朋友。',
          '這個說法太口語。',
          '這個說法太隨便。'
        ]
      }
    },
    {
      title: '⑤ 電子郵件的主旨',
      body: '主旨要短而具體：\n' +
            '✗ Hello　✗ Question\n' +
            '✓ Question about the summer camp schedule\n' +
            '⚠ 好的主旨讓對方一眼知道信的內容。',
      viz: { type: 'compareexp',
             factor: '主旨的品質',
             a: { label: '好', note: '具體：Request for a class change' },
             b: { label: '差', note: '空泛：Hi／Important' },
             same: ['都是一封信的主旨'] },
      check: {
        q: '下列哪一個電子郵件主旨最合適？',
        options: [
          'Request for Friday’s homework details',
          'Hello',
          'URGENT!!!',
          'Question'
        ],
        answer: 0,
        why: [
          null,
          '這個主旨沒有傳達任何資訊。',
          '只強調緊急卻沒說明內容。',
          '這個主旨太籠統。'
        ]
      }
    },
    {
      title: '⑥ 常見錯誤',
      body: '① 用注音或中文標點（，。）→ 要用英文標點（, .）\n' +
            '② 全部小寫或全部大寫（全大寫等於在吼人）\n' +
            '③ 忘記署名\n' +
            '④ 正式信件用縮寫與表情符號\n' +
            '⚠ 寄出前一定要重讀一次。',
      viz: { type: 'energyflow', steps: ['檢查稱呼', '檢查目的清楚', '檢查標點與大小寫', '檢查署名', '寄出'] },
      check: {
        q: '在正式的英文信件中，為什麼不應該整句用大寫？',
        options: [
          '全大寫在英文裡等於大聲吼叫，很失禮',
          '因為比較難打字',
          '因為會被系統擋下來',
          '因為大寫字母比較長'
        ],
        answer: 0,
        why: [
          null,
          '打字難易不是主要原因。',
          '系統通常不會因此擋信。',
          '字母長度不是重點。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第8單元 圖表判讀'] = {
  intro: '看懂圖表題，關鍵在標題、單位和趨勢。',
  cards: [
    {
      title: '① 先看三個地方',
      body: '① 標題：這張圖在講什麼\n' +
            '② 座標軸與單位：橫軸是什麼、縱軸是什麼\n' +
            '③ 圖例：不同顏色或線條代表誰\n' +
            '⚠ 這三個看完再看數字，才不會誤讀。',
      viz: { type: 'energyflow', steps: ['看標題', '看座標軸與單位', '看圖例', '再讀數字'] },
      check: {
        q: '看圖表題時，第一步應該做什麼？',
        options: [
          '先看標題，確認圖表在講什麼',
          '直接找最大的數字',
          '先看選項',
          '先數有幾條線'
        ],
        answer: 0,
        why: [
          null,
          '不知道主題就看數字容易誤判。',
          '先看選項容易被誘答影響。',
          '線條數量不等於理解內容。'
        ]
      }
    },
    {
      title: '② 描述趨勢的字',
      body: '上升：increase、rise、go up、grow\n' +
            '下降：decrease、fall、drop、decline\n' +
            '持平：stay the same、remain stable\n' +
            '⚠ 這些字在圖表題的選項裡出現頻率極高。',
      viz: { type: 'classify', groups: [
        { label: '上升', items: ['increase', 'rise', 'grow', 'go up'] },
        { label: '下降', items: ['decrease', 'fall', 'drop', 'decline'] },
        { label: '持平', items: ['stay the same', 'remain stable'] }] },
      check: {
        q: 'The number of students declined. 這句話的意思是什麼？',
        options: [
          '學生人數減少了',
          '學生人數增加了',
          '學生人數沒有變化',
          '學生拒絕了'
        ],
        answer: 0,
        why: [
          null,
          'decline 表示下降而不是上升。',
          'decline 表示有變化。',
          '這裡的 decline 用於數量而不是拒絕。'
        ]
      }
    },
    {
      title: '③ 描述幅度的字',
      body: '大幅：sharply、dramatically、significantly\n' +
            '小幅：slightly、gradually、steadily\n' +
            'Sales rose sharply in June.（六月銷售大幅上升。）\n' +
            '⚠ 幅度形容詞常是選項對錯的關鍵。',
      viz: { type: 'energyflow', steps: ['slightly（微幅）', 'gradually（逐漸）', 'significantly（顯著）', 'sharply（急遽）'] },
      check: {
        q: 'The price rose slightly. 這句話表示什麼？',
        options: [
          '價格微幅上升',
          '價格大幅上升',
          '價格微幅下降',
          '價格沒有變'
        ],
        answer: 0,
        why: [
          null,
          'slightly 表示幅度很小。',
          'rose 表示上升而不是下降。',
          '句子明確表示有上升。'
        ]
      }
    },
    {
      title: '④ 比較的說法',
      body: 'twice as many as（是…的兩倍）\n' +
            'the highest／the lowest（最高／最低）\n' +
            'account for 40%（占四成）\n' +
            'A is followed by B.（A 之後是 B，指排名）',
      viz: { type: 'classify', groups: [
        { label: '倍數與比例', items: ['twice as many as', 'account for', 'make up'] },
        { label: '排名', items: ['the highest', 'the second largest', 'followed by'] }] },
      check: {
        q: 'Group A is followed by Group B. 這句話的意思是什麼？',
        options: [
          '排名上 B 緊接在 A 之後',
          'B 跟蹤了 A',
          'A 排在 B 後面',
          'A 和 B 一樣多'
        ],
        answer: 0,
        why: [
          null,
          '這是字面直譯，不是圖表的用法。',
          '被 followed 的是排在前面的一方。',
          '這句話表示有先後差別。'
        ]
      }
    },
    {
      title: '⑤ 常見的陷阱',
      body: '① 混淆單位（人數與百分比）\n' +
            '② 混淆年份或組別\n' +
            '③ 選項寫「最多」但圖上其實是第二多\n' +
            '④ 選項推論超出圖表所能顯示的範圍\n' +
            '⚠ 圖表只呈現數據，不會說明原因。',
      viz: { type: 'compareexp',
             factor: '圖表能不能告訴你',
             a: { label: '可以判斷', note: '數量、比例、趨勢、排名' },
             b: { label: '無法判斷', note: '原因、動機、未來一定會怎樣' },
             same: ['都可能出現在選項裡'] },
      check: {
        q: '一張顯示各年級閱讀時數的長條圖，下列哪一個選項無法從圖中判斷？',
        options: [
          '學生閱讀時數增加的原因',
          '哪一個年級閱讀時數最長',
          '各年級之間的差距',
          '整體的高低分布'
        ],
        answer: 0,
        why: [
          null,
          '這可以直接從長條的高度看出來。',
          '這可以由長條之間的差距看出來。',
          '這可以從整張圖的分布看出來。'
        ]
      }
    },
    {
      title: '⑥ 作答步驟',
      body: '① 讀題目，確認要找什麼\n' +
            '② 回圖表定位（哪一年、哪一組）\n' +
            '③ 讀出數字或趨勢\n' +
            '④ 逐一刪去不符的選項\n' +
            '⚠ 每個選項都要回圖表驗證一次。',
      viz: { type: 'energyflow', steps: ['讀題目', '回圖表定位', '讀出數據', '逐一驗證選項'] },
      check: {
        q: '做圖表題時，為什麼每個選項都要回圖表驗證？',
        options: [
          '因為誘答選項常只改動一個數字或年份',
          '因為題目很長',
          '因為選項都很像',
          '因為時間很充裕'
        ],
        answer: 0,
        why: [
          null,
          '題目長度不是驗證的理由。',
          '選項相似只是表象，關鍵是細節差異。',
          '考試時間通常有限，但仍要驗證。'
        ]
      }
    }
  ]
};

window.APP_LESSONS['english|九下|第9單元 綜合演練'] = {
  intro: '把三年學的東西串起來，用在真正的考題上。',
  cards: [
    {
      title: '① 文法題的三步驟',
      body: '① 先看空格前後：需要什麼詞性\n' +
            '② 再看時間副詞：決定時態\n' +
            '③ 最後看主詞：決定動詞形式\n' +
            '⚠ 大部分文法題三步就能解決。',
      viz: { type: 'energyflow', steps: ['看空格前後', '看時間副詞', '看主詞', '選答案'] },
      check: {
        q: '做文法填空題時，第一步應該看什麼？',
        options: [
          '空格前後的字，判斷需要什麼詞性',
          '先看有幾個選項',
          '先看句子有多長',
          '先看有沒有生字'
        ],
        answer: 0,
        why: [
          null,
          '選項數量固定，不影響判斷。',
          '句子長度與答案無關。',
          '生字可以稍後再處理。'
        ]
      }
    },
    {
      title: '② 詞性判斷的訊號',
      body: '冠詞或形容詞後面 → 名詞\n' +
            '主詞後面 → 動詞\n' +
            'be 動詞或連綴動詞後面 → 形容詞\n' +
            '介系詞後面 → 名詞或動名詞\n' +
            '⚠ 詞性選對，一半的題目就對了。',
      viz: { type: 'classify', groups: [
        { label: '後面要名詞', items: ['a／an／the', '形容詞', '介系詞'] },
        { label: '後面要形容詞', items: ['be 動詞', 'look／sound／feel'] }] },
      check: {
        q: 'His ___ surprised everyone.（空格在所有格後面）應該填什麼詞性？',
        options: ['名詞', '動詞', '副詞', '介系詞'],
        answer: 0,
        why: [
          null,
          '所有格後面不能直接接動詞。',
          '所有格後面不接副詞。',
          '所有格後面不接介系詞。'
        ]
      }
    },
    {
      title: '③ 克漏字的做法',
      body: '① 先把整段快速看一遍，抓住主題\n' +
            '② 再逐格作答，注意前後文的邏輯\n' +
            '③ 特別留意連接詞的空格（but、because、however）\n' +
            '⚠ 克漏字考的是「上下文」，不能只看一句。',
      viz: { type: 'energyflow', steps: ['快速看完全段', '抓住主題', '逐格作答', '回頭通讀檢查'] },
      check: {
        q: '做克漏字時，為什麼不能只看空格所在的那一句？',
        options: [
          '因為答案常取決於前後文的邏輯關係',
          '因為那一句通常沒有意義',
          '因為時間不夠',
          '因為那一句一定有生字'
        ],
        answer: 0,
        why: [
          null,
          '空格所在的句子仍然重要。',
          '時間因素不是主要原因。',
          '有沒有生字不影響這個原則。'
        ]
      }
    },
    {
      title: '④ 遇到不會的題目',
      body: '① 先刪掉明顯錯的選項（文法不通、詞性不對）\n' +
            '② 再從剩下的判斷語意\n' +
            '③ 真的不會就標記起來，先做別題\n' +
            '⚠ 不要在一題上耗掉太多時間。',
      viz: { type: 'energyflow', steps: ['刪去文法不通的', '刪去詞性不對的', '從剩下的判斷語意', '不會就先跳過'] },
      check: {
        q: '考試遇到完全不會的題目，最好的做法是什麼？',
        options: [
          '先刪去明顯錯的選項，標記後繼續往下做',
          '一直想到會為止',
          '直接空著不看',
          '把整張考卷重看一遍'
        ],
        answer: 0,
        why: [
          null,
          '在一題上卡住會壓縮其他題的時間。',
          '空著等於放棄得分機會。',
          '重看整張考卷很花時間。'
        ]
      }
    },
    {
      title: '⑤ 最常錯的五個地方',
      body: '① 第三人稱單數忘記加 s\n' +
            '② 有 did／does 之後動詞沒回原形\n' +
            '③ be 動詞和一般動詞並用\n' +
            '④ 可數與不可數搞混\n' +
            '⑤ 間接問句沒改回陳述句語序\n' +
            '⚠ 寫完檢查這五項，分數就會穩定。',
      viz: { type: 'classify', groups: [
        { label: '動詞相關', items: ['三單加 s', 'did 後用原形', '不與 be 動詞並用'] },
        { label: '句型相關', items: ['可數不可數', '間接問句語序'] }] },
      check: {
        q: '下列哪一句犯了「be 動詞和一般動詞並用」的錯誤？',
        options: [
          'He is go to school every day.',
          'He goes to school every day.',
          'He is at school now.',
          'He does not go to school on Sunday.'
        ],
        answer: 0,
        why: [
          null,
          '這句只有一般動詞，完全正確。',
          '這句只有 be 動詞，完全正確。',
          '這句用助動詞加原形動詞，完全正確。'
        ]
      }
    },
    {
      title: '⑥ 平時怎麼準備',
      body: '① 每天讀一小段英文（新聞、故事都好）\n' +
            '② 生字記在句子裡，不要只記中文\n' +
            '③ 錯題本：把錯的原因寫下來，不只抄答案\n' +
            '④ 開口唸出來，聽力與口說一起練\n' +
            '⚠ 每天二十分鐘，勝過考前熬夜。',
      viz: { type: 'energyflow', steps: ['每天讀一小段', '生字放進句子', '整理錯題原因', '開口唸出來'] },
      check: {
        q: '整理錯題時，最有價值的做法是什麼？',
        options: [
          '寫下自己為什麼會錯，而不只是抄正確答案',
          '只把正確答案抄一遍',
          '把整題重抄十遍',
          '只記下題號'
        ],
        answer: 0,
        why: [
          null,
          '抄答案無法避免下次犯同樣的錯。',
          '重抄多遍不等於理解錯在哪裡。',
          '只記題號之後回顧時看不懂。'
        ]
      }
    }
  ]
};
