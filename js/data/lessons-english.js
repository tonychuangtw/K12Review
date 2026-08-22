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
          '順序相反了。',
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
          '句子缺少 be 動詞。',
          '句子缺少主詞。'
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
          '語序不正確。',
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
