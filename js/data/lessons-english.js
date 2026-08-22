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
