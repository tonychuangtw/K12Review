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
