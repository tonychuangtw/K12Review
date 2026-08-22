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
          '句子缺少 be 動詞。'
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
