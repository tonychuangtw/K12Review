/* Q版動畫舞台：依成語用字自動選角（動物/人物表情/場景），生成會動的 SVG 舞台
   用法：AnimStage.build(term) -> svg 字串（給 anim.js 嵌在動畫卡上方）
   全向量、零圖檔；動態靠 style.css 的 .st-* keyframes                        */
(function () {
  if (typeof document === 'undefined') return;

  /* ---------- 小工具 ---------- */
  function eye(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 4) + '" fill="#3a2e26"/>' +
           '<circle cx="' + (x + 1.3) + '" cy="' + (y - 1.3) + '" r="' + ((r || 4) * .36) + '" fill="#fff"/>';
  }
  function blush(x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="5" ry="3.4" fill="#ffb3a3"/>'; }

  /* ---------- 角色庫（原點在腳底中心，高約 90） ---------- */
  var ACTORS = {
    kid: function (emo) {
      var face;
      if (emo === 'sad') face = eye(-8, -52) + eye(8, -52) + blush(-15, -44) + blush(15, -44) +
        '<path d="M-5 -38 Q0 -42 5 -38" stroke="#3a2e26" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<circle class="st-tear" cx="-14" cy="-46" r="3.2" fill="#8fc6ff"/>';
      else if (emo === 'angry') face =
        '<line x1="-13" y1="-60" x2="-4" y2="-56" stroke="#3a2e26" stroke-width="2.6" stroke-linecap="round"/>' +
        '<line x1="13" y1="-60" x2="4" y2="-56" stroke="#3a2e26" stroke-width="2.6" stroke-linecap="round"/>' +
        eye(-8, -51) + eye(8, -51) + '<path d="M-5 -38 Q0 -35 5 -38" stroke="#3a2e26" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      else if (emo === 'wow') face = eye(-8, -52, 4.6) + eye(8, -52, 4.6) + blush(-15, -44) + blush(15, -44) +
        '<ellipse cx="0" cy="-38" rx="4.5" ry="6" fill="#3a2e26"/>';
      else face = eye(-8, -52) + eye(8, -52) + blush(-15, -44) + blush(15, -44) +
        '<path d="M-6 -40 Q0 -34 6 -40" stroke="#3a2e26" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
      return '<g class="st-bob">' +
        '<rect x="-16" y="-14" width="13" height="14" rx="6" fill="#4a5b7d"/>' +
        '<rect x="3" y="-14" width="13" height="14" rx="6" fill="#4a5b7d"/>' +
        '<rect x="-20" y="-46" width="40" height="36" rx="15" fill="#6fbf8e" stroke="#54a274" stroke-width="2.4"/>' +
        '<line x1="-18" y1="-38" x2="-30" y2="-24" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/>' +
        '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>' +
        '<circle cx="0" cy="-54" r="24" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>' +
        '<path d="M-24 -60 Q-20 -80 0 -80 Q20 -80 24 -60 Q12 -70 0 -68 Q-12 -70 -24 -60 Z" fill="#6b4a32"/>' +
        '<path d="M-4 -80 Q0 -90 8 -84" stroke="#6b4a32" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        face + '</g>';
    },
    rabbit: function () {
      return '<g class="st-hop">' +
        '<ellipse cx="4" cy="-18" rx="26" ry="19" fill="#fff" stroke="#e3dcd4" stroke-width="2"/>' +
        '<circle cx="32" cy="-12" r="8" fill="#fff" stroke="#e3dcd4" stroke-width="2"/>' +
        '<circle cx="-20" cy="-34" r="17" fill="#fff" stroke="#e3dcd4" stroke-width="2"/>' +
        '<g class="st-earwig"><ellipse cx="-30" cy="-60" rx="7" ry="17" fill="#fff" stroke="#e3dcd4" stroke-width="2" transform="rotate(-16 -30 -60)"/>' +
        '<ellipse cx="-30" cy="-58" rx="3.6" ry="11" fill="#ffc4d0" transform="rotate(-16 -30 -58)"/></g>' +
        '<ellipse cx="-14" cy="-62" rx="7" ry="17" fill="#fff" stroke="#e3dcd4" stroke-width="2" transform="rotate(10 -14 -62)"/>' +
        '<ellipse cx="-14" cy="-60" rx="3.6" ry="11" fill="#ffc4d0" transform="rotate(10 -14 -60)"/>' +
        eye(-26, -36) + blush(-32, -28) +
        '<path d="M-36 -31 q-3 2 -2 5" stroke="#e8899a" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
    },
    horse: function () {
      return '<g class="st-bob">' +
        '<ellipse cx="0" cy="-26" rx="30" ry="21" fill="#c68a5a" stroke="#a86f42" stroke-width="2"/>' +
        '<rect x="-24" y="-14" width="10" height="14" rx="4" fill="#a86f42"/><rect x="14" y="-14" width="10" height="14" rx="4" fill="#a86f42"/>' +
        '<g class="st-tailwag"><path d="M28 -34 q16 4 14 22" stroke="#7a4f2c" stroke-width="7" fill="none" stroke-linecap="round"/></g>' +
        '<circle cx="-26" cy="-48" r="16" fill="#c68a5a" stroke="#a86f42" stroke-width="2"/>' +
        '<ellipse cx="-38" cy="-42" rx="10" ry="8" fill="#d9a878"/>' +
        '<circle cx="-40" cy="-44" r="1.8" fill="#7a4f2c"/>' +
        '<path d="M-34 -62 l4 -9 l5 8 z" fill="#a86f42"/><path d="M-22 -63 l4 -9 l5 8 z" fill="#a86f42"/>' +
        '<path d="M-16 -60 Q-8 -66 -6 -54 Q-4 -44 -12 -40" stroke="#7a4f2c" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        eye(-30, -50) + blush(-34, -41) + '</g>';
    },
    ox: function () {
      return '<g class="st-bob">' +
        '<ellipse cx="0" cy="-24" rx="31" ry="21" fill="#9fb4c7" stroke="#7e94a8" stroke-width="2"/>' +
        '<rect x="-24" y="-12" width="10" height="12" rx="4" fill="#7e94a8"/><rect x="14" y="-12" width="10" height="12" rx="4" fill="#7e94a8"/>' +
        '<circle cx="-24" cy="-46" r="17" fill="#9fb4c7" stroke="#7e94a8" stroke-width="2"/>' +
        '<ellipse cx="-30" cy="-38" rx="11" ry="8" fill="#f2c9c0"/>' +
        '<circle cx="-34" cy="-38" r="1.6" fill="#8a5a50"/><circle cx="-27" cy="-38" r="1.6" fill="#8a5a50"/>' +
        '<path d="M-38 -56 q-10 -4 -10 -14" stroke="#e8e0d0" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<path d="M-12 -58 q10 -4 10 -14" stroke="#e8e0d0" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        eye(-28, -48) + blush(-16, -40) + '</g>';
    },
    tiger: function () {
      return '<g class="st-bob">' +
        '<ellipse cx="2" cy="-24" rx="30" ry="21" fill="#f5a742" stroke="#d9882a" stroke-width="2"/>' +
        '<path d="M-2 -42 l6 10 M10 -44 l6 10 M20 -38 l6 9" stroke="#7a4b12" stroke-width="4" stroke-linecap="round"/>' +
        '<g class="st-tailwag"><path d="M30 -30 q18 2 16 20" stroke="#f5a742" stroke-width="8" fill="none" stroke-linecap="round"/></g>' +
        '<circle cx="-22" cy="-46" r="18" fill="#f5a742" stroke="#d9882a" stroke-width="2"/>' +
        '<circle cx="-34" cy="-60" r="6.5" fill="#f5a742" stroke="#d9882a" stroke-width="2"/><circle cx="-10" cy="-62" r="6.5" fill="#f5a742" stroke="#d9882a" stroke-width="2"/>' +
        '<text x="-22" y="-52" text-anchor="middle" font-size="9" font-weight="bold" fill="#7a4b12">王</text>' +
        '<ellipse cx="-24" cy="-38" rx="8" ry="6" fill="#fff"/>' +
        '<circle cx="-24" cy="-40" r="2" fill="#3a2e26"/>' +
        eye(-32, -46, 3.6) + eye(-14, -46, 3.6) + blush(-36, -38) +
        '<rect x="-20" y="-12" width="9" height="12" rx="4" fill="#d9882a"/><rect x="8" y="-12" width="9" height="12" rx="4" fill="#d9882a"/></g>';
    },
    fish: function () {
      return '<g class="st-swim">' +
        '<ellipse cx="0" cy="-34" rx="26" ry="16" fill="#7fb2e0" stroke="#5a8fc4" stroke-width="2"/>' +
        '<path d="M22 -34 l16 -12 l-3 12 l3 12 z" fill="#5a8fc4"/>' +
        '<path d="M-2 -50 q6 -8 12 0 z" fill="#5a8fc4"/>' +
        '<path d="M0 -22 q5 7 11 2" stroke="#5a8fc4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        eye(-14, -36) + blush(-20, -29) +
        '<circle class="st-bub" cx="-30" cy="-50" r="4" fill="none" stroke="#bfe0ff" stroke-width="2"/></g>';
    },
    bird: function () {
      return '<g class="st-fly">' +
        '<ellipse cx="0" cy="-46" rx="19" ry="15" fill="#8fd0e8" stroke="#6cb0cc" stroke-width="2"/>' +
        '<g class="st-flap"><path d="M2 -50 q16 -14 26 -4 q-12 12 -26 8 z" fill="#6cb0cc"/></g>' +
        '<path d="M16 -42 l12 4 l-12 5 z" fill="#6cb0cc"/>' +
        '<path d="M-16 -50 l-8 -3 l8 -3 z" fill="#f5a742"/>' +
        '<path d="M2 -33 q-2 5 2 7 M8 -33 q-2 5 2 7" stroke="#f5a742" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        eye(-8, -50) + blush(-13, -43) + '</g>';
    },
    chicken: function () {
      return '<g class="st-bob">' +
        '<ellipse cx="0" cy="-24" rx="22" ry="18" fill="#fff" stroke="#e3dcd4" stroke-width="2"/>' +
        '<path d="M18 -30 q12 0 12 10 q-8 4 -14 -2 z" fill="#e8ddca"/>' +
        '<circle cx="-12" cy="-44" r="13" fill="#fff" stroke="#e3dcd4" stroke-width="2"/>' +
        '<path d="M-16 -56 q-1 -8 5 -7 q0 -7 6 -5 q4 -6 7 0 q-2 6 -6 7 z" fill="#ff6b5c"/>' +
        '<path d="M-24 -44 l-8 3 l8 4 z" fill="#f5a742"/>' +
        '<path d="M-10 -30 q-2 5 2 6 M-3 -30 q-2 5 2 6" stroke="#f5a742" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
        eye(-16, -46, 3.4) + blush(-21, -39) + '</g>';
    },
    dog: function () {
      return '<g class="st-bob">' +
        '<ellipse cx="2" cy="-22" rx="26" ry="19" fill="#e8c48f" stroke="#c9a066" stroke-width="2"/>' +
        '<g class="st-tailwag"><path d="M26 -30 q14 -8 12 -20" stroke="#c9a066" stroke-width="8" fill="none" stroke-linecap="round"/></g>' +
        '<circle cx="-20" cy="-42" r="17" fill="#e8c48f" stroke="#c9a066" stroke-width="2"/>' +
        '<ellipse cx="-34" cy="-52" rx="7" ry="13" fill="#c9a066" transform="rotate(24 -34 -52)"/>' +
        '<ellipse cx="-6" cy="-54" rx="7" ry="13" fill="#c9a066" transform="rotate(-18 -6 -54)"/>' +
        '<ellipse cx="-24" cy="-34" rx="7" ry="5.4" fill="#fff"/>' +
        '<circle cx="-25" cy="-36" r="2.4" fill="#3a2e26"/>' +
        '<path d="M-22 -30 q1 5 6 4" stroke="#e88" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
        eye(-30, -44, 3.6) + eye(-12, -44, 3.6) + blush(-35, -36) +
        '<rect x="-18" y="-10" width="9" height="10" rx="4" fill="#c9a066"/><rect x="8" y="-10" width="9" height="10" rx="4" fill="#c9a066"/></g>';
    },
    dragon: function () {
      return '<g class="st-fly">' +
        '<path d="M-30 -44 q20 -18 44 -6 q18 10 8 26 q-8 12 -28 8" fill="none" stroke="#7cc47f" stroke-width="14" stroke-linecap="round"/>' +
        '<circle cx="-30" cy="-48" r="15" fill="#7cc47f" stroke="#5aa35e" stroke-width="2"/>' +
        '<path d="M-40 -60 l-3 -10 l7 6 z M-30 -62 l0 -11 l6 8 z" fill="#f0c05a"/>' +
        '<path d="M-44 -46 q-7 0 -9 5 M-44 -42 q-6 2 -7 7" stroke="#5aa35e" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="-42" cy="-42" rx="6" ry="4.6" fill="#a5d9a7"/>' +
        eye(-34, -50) + blush(-26, -42) +
        '<path d="M20 -18 l10 6 l-12 4 z" fill="#5aa35e"/></g>';
    },
    snake: function () {
      return '<g class="st-bob">' +
        '<path d="M-26 -40 q26 -12 34 4 q6 14 -10 18 q-16 4 -22 -4" fill="none" stroke="#9ccc65" stroke-width="13" stroke-linecap="round"/>' +
        '<circle cx="-28" cy="-42" r="13" fill="#9ccc65" stroke="#7cab48" stroke-width="2"/>' +
        '<path d="M-40 -40 l-8 0 m8 0 l-6 -4 m6 4 l-6 4" stroke="#e85a4f" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
        eye(-30, -46, 3.4) + blush(-24, -37) + '</g>';
    },
    goat: function () {
      return '<g class="st-bob">' +
        '<ellipse cx="2" cy="-24" rx="25" ry="19" fill="#f4f1e8" stroke="#d5cfc0" stroke-width="2"/>' +
        '<circle cx="6" cy="-30" r="7" fill="#fff" opacity=".8"/><circle cx="16" cy="-22" r="8" fill="#fff" opacity=".8"/><circle cx="-6" cy="-18" r="7" fill="#fff" opacity=".8"/>' +
        '<circle cx="-20" cy="-44" r="15" fill="#f4f1e8" stroke="#d5cfc0" stroke-width="2"/>' +
        '<path d="M-32 -56 q-8 -2 -8 -10 q8 0 10 7 z" fill="#d9b878"/>' +
        '<path d="M-10 -58 q8 -2 8 -10 q-8 0 -10 7 z" fill="#d9b878"/>' +
        '<ellipse cx="-34" cy="-46" rx="5" ry="8" fill="#e8e2d4" transform="rotate(20 -34 -46)"/>' +
        eye(-24, -46, 3.4) + blush(-29, -38) +
        '<path d="M-22 -37 q3 3 6 1" stroke="#b8ae9c" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<rect x="-14" y="-10" width="8" height="10" rx="4" fill="#d5cfc0"/><rect x="8" y="-10" width="8" height="10" rx="4" fill="#d5cfc0"/></g>';
    },
    monkey: function () {
      return '<g class="st-hop">' +
        '<ellipse cx="0" cy="-22" rx="21" ry="17" fill="#b98a5d" stroke="#96683c" stroke-width="2"/>' +
        '<g class="st-tailwag"><path d="M18 -22 q16 2 14 -16" stroke="#96683c" stroke-width="6" fill="none" stroke-linecap="round"/></g>' +
        '<circle cx="-6" cy="-46" r="16" fill="#b98a5d" stroke="#96683c" stroke-width="2"/>' +
        '<circle cx="-24" cy="-48" r="7" fill="#b98a5d" stroke="#96683c" stroke-width="2"/><circle cx="12" cy="-48" r="7" fill="#b98a5d" stroke="#96683c" stroke-width="2"/>' +
        '<path d="M-16 -52 q10 -12 20 0 q4 8 -2 12 q-8 5 -16 0 q-6 -4 -2 -12 z" fill="#f2dcc2"/>' +
        eye(-11, -48, 3.4) + eye(-1, -48, 3.4) + blush(-17, -41) +
        '<path d="M-9 -39 Q-6 -36 -3 -39" stroke="#7a5230" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
    },
    mouse: function () {
      return '<g class="st-hop">' +
        '<ellipse cx="2" cy="-18" rx="19" ry="14" fill="#c4c9d4" stroke="#a3a9b8" stroke-width="2"/>' +
        '<g class="st-tailwag"><path d="M18 -16 q16 4 20 -8" stroke="#a3a9b8" stroke-width="4" fill="none" stroke-linecap="round"/></g>' +
        '<circle cx="-14" cy="-32" r="12" fill="#c4c9d4" stroke="#a3a9b8" stroke-width="2"/>' +
        '<circle cx="-26" cy="-44" r="8" fill="#c4c9d4" stroke="#a3a9b8" stroke-width="2"/><circle cx="-6" cy="-46" r="8" fill="#c4c9d4" stroke="#a3a9b8" stroke-width="2"/>' +
        '<circle cx="-26" cy="-44" r="4.4" fill="#f2c9d0"/><circle cx="-6" cy="-46" r="4.4" fill="#f2c9d0"/>' +
        '<circle cx="-24" cy="-30" r="2" fill="#e88"/>' +
        eye(-18, -34, 3) + blush(-13, -27) + '</g>';
    },
    turtle: function () {
      return '<g class="st-bob">' +
        '<path d="M-24 -22 q24 -30 48 0 z" fill="#7cab6e" stroke="#5d8a50" stroke-width="2"/>' +
        '<path d="M-12 -26 l8 -10 l8 10 z M0 -38 l0 0" fill="#a5c99a" opacity=".7"/>' +
        '<ellipse cx="0" cy="-20" rx="26" ry="7" fill="#5d8a50"/>' +
        '<circle cx="-32" cy="-26" r="10" fill="#a5cc8e" stroke="#7cab6e" stroke-width="2"/>' +
        '<rect x="-18" y="-16" width="8" height="8" rx="4" fill="#7cab6e"/><rect x="10" y="-16" width="8" height="8" rx="4" fill="#7cab6e"/>' +
        eye(-35, -28, 3) + blush(-39, -22) + '</g>';
    },
    fox: function () {
      return '<g class="st-bob">' +
        '<ellipse cx="2" cy="-22" rx="24" ry="18" fill="#f0925e" stroke="#d1713c" stroke-width="2"/>' +
        '<g class="st-tailwag"><path d="M24 -26 q18 -2 16 16" stroke="#f0925e" stroke-width="10" fill="none" stroke-linecap="round"/>' +
        '<circle cx="41" cy="-8" r="5" fill="#fff"/></g>' +
        '<circle cx="-18" cy="-44" r="16" fill="#f0925e" stroke="#d1713c" stroke-width="2"/>' +
        '<path d="M-32 -54 l-4 -13 l11 7 z" fill="#d1713c"/><path d="M-6 -56 l4 -13 l-11 7 z" fill="#d1713c"/>' +
        '<path d="M-32 -38 q14 -8 26 0 q-8 10 -13 10 q-5 0 -13 -10 z" fill="#fff"/>' +
        '<circle cx="-19" cy="-33" r="2.2" fill="#3a2e26"/>' +
        eye(-26, -44, 3.4) + eye(-10, -44, 3.4) + blush(-31, -37) + '</g>';
    },
    butterfly: function () {
      return '<g class="st-fly">' +
        '<g class="st-flap"><path d="M0 -50 q-18 -16 -26 -2 q-4 10 8 12 q-14 2 -8 12 q6 8 26 -6 z" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2"/></g>' +
        '<path d="M0 -50 q18 -16 26 -2 q4 10 -8 12 q14 2 8 12 q-6 8 -26 -6 z" fill="#fbc4d8" stroke="#e07ba3" stroke-width="2"/>' +
        '<ellipse cx="0" cy="-42" rx="4.5" ry="13" fill="#7a5230"/>' +
        '<path d="M-2 -54 q-4 -6 -8 -6 M2 -54 q4 -6 8 -6" stroke="#7a5230" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        eye(-2, -50, 2.4) + '</g>';
    }
  };

  /* ---------- 用字 → 角色/場景 ---------- */
  var ANIMAL_MAP = [
    [/兔/, 'rabbit'], [/[馬駒驥騮騏]/, 'horse'], [/牛/, 'ox'], [/[虎豹獅]/, 'tiger'],
    [/[魚鯉鮒鱉鰲]/, 'fish'], [/[鳥雀燕鴉鵲鶯雁鵬鳩雛鶴鷺鳳凰鴻]/, 'bird'], [/雞/, 'chicken'],
    [/[狗犬]/, 'dog'], [/龍/, 'dragon'], [/蛇/, 'snake'], [/羊/, 'goat'], [/[猴猿]/, 'monkey'],
    [/鼠/, 'mouse'], [/龜/, 'turtle'], [/[狐狼豺貓]/, 'fox'], [/[蝶蜂蟬蟻蟲螳螂]/, 'butterfly']
  ];

  function pick(term) {
    var animals = [];
    ANIMAL_MAP.forEach(function (m) {
      if (m[0].test(term) && animals.indexOf(m[1]) < 0 && animals.length < 2) animals.push(m[1]);
    });
    var emo = 'happy';
    if (/[哭泣悲愁傷淚喪]/.test(term)) emo = 'sad';
    else if (/[怒憤忿罵斥]/.test(term)) emo = 'angry';
    else if (/[驚懼怕恐駭愕]/.test(term)) emo = 'wow';
    return {
      animals: animals, emo: emo,
      night: /[月夜宵星辰]/.test(term),
      water: /[水河海江川波浪潮沉舟渡溪湖]/.test(term),
      fire: /[火焚燃炬烈]/.test(term),
      mountain: /[山嶽岳峰嶺]/.test(term),
      rain: /[雨露霖]/.test(term),
      snow: /[雪霜冰寒]/.test(term),
      wind: /[風飄]/.test(term),
      tree: /[樹木林森柏松株梅竹柳]/.test(term),
      book: /[書文筆讀學詩墨卷]/.test(term)
    };
  }

  /* ---------- 舞台組裝 ---------- */
  function build(term) {
    var c = pick(term);
    var sky = c.night ? '#31406b' : '#aee3f5';
    var s = '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" class="st-svg">';
    s += '<rect width="800" height="300" fill="' + sky + '"/>';

    if (c.night) {
      s += '<g fill="#fff"><circle class="st-tw" cx="120" cy="52" r="3"/><circle class="st-tw" style="animation-delay:.6s" cx="300" cy="36" r="2.4"/>' +
           '<circle class="st-tw" style="animation-delay:1.1s" cx="520" cy="50" r="3"/><circle class="st-tw" style="animation-delay:.3s" cx="430" cy="80" r="2"/></g>' +
           '<g transform="translate(660,70)"><path d="M14 -26 A30 30 0 1 0 26 16 A24 24 0 1 1 14 -26 Z" fill="#f4f1de" stroke="#d8d4bd" stroke-width="2"/>' +
           '<circle cx="-2" cy="-2" r="2.6" fill="#8d886c"/><path d="M-8 8 Q-4 11 0 8" stroke="#8d886c" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
    } else {
      s += '<g class="st-rays" style="transform-origin:660px 70px"><g stroke="#ffcf4d" stroke-width="6" stroke-linecap="round">' +
           '<line x1="660" y1="18" x2="660" y2="32"/><line x1="660" y1="108" x2="660" y2="122"/>' +
           '<line x1="608" y1="70" x2="622" y2="70"/><line x1="698" y1="70" x2="712" y2="70"/>' +
           '<line x1="624" y1="34" x2="634" y2="44"/><line x1="686" y1="96" x2="696" y2="106"/>' +
           '<line x1="696" y1="34" x2="686" y2="44"/><line x1="634" y1="96" x2="624" y2="106"/></g></g>' +
           '<circle cx="660" cy="70" r="30" fill="#ffdd66" stroke="#f5b73e" stroke-width="3"/>' +
           '<circle cx="650" cy="66" r="3" fill="#7a4b12"/><circle cx="670" cy="66" r="3" fill="#7a4b12"/>' +
           '<path d="M652 77 Q660 83 668 77" stroke="#7a4b12" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
           '<g class="st-cloud"><ellipse cx="180" cy="60" rx="32" ry="14" fill="#fff"/><ellipse cx="158" cy="66" rx="19" ry="10" fill="#fff"/><ellipse cx="204" cy="66" rx="21" ry="11" fill="#fff"/></g>';
    }
    if (c.mountain) {
      s += '<path d="M-20 232 L120 96 L260 232 Z" fill="#8fb0a0"/><path d="M120 96 L96 122 L120 132 L146 120 Z" fill="#eef4f0"/>' +
           '<path d="M180 232 L300 130 L420 232 Z" fill="#a5c2b2" opacity=".85"/>';
    }
    // 草地
    s += '<ellipse cx="180" cy="290" rx="330" ry="90" fill="#b8e08e"/>' +
         '<ellipse cx="640" cy="300" rx="360" ry="95" fill="#a5d47c"/>' +
         '<rect y="262" width="800" height="38" fill="#95c96e"/>';
    // 小花
    s += '<g fill="#ff9eb5"><circle cx="86" cy="268" r="5"/><circle cx="93" cy="261" r="5"/><circle cx="79" cy="261" r="5"/><circle cx="86" cy="255" r="5"/><circle cx="86" cy="262" r="3.4" fill="#ffe066"/></g>' +
         '<g fill="#a5c8ff"><circle cx="716" cy="274" r="4.4"/><circle cx="722" cy="268" r="4.4"/><circle cx="710" cy="268" r="4.4"/><circle cx="716" cy="262" r="4.4"/><circle cx="716" cy="268" r="3" fill="#fff"/></g>';
    if (c.tree) {
      s += '<g transform="translate(700,262)"><rect x="-9" y="-46" width="18" height="46" rx="7" fill="#a8734a"/>' +
           '<circle cx="0" cy="-64" r="30" fill="#7cc47f"/><circle cx="-24" cy="-50" r="20" fill="#8fd08f"/><circle cx="24" cy="-52" r="21" fill="#8fd08f"/>' +
           '<circle cx="-10" cy="-70" r="5" fill="#ff8a80"/><circle cx="14" cy="-56" r="5" fill="#ff8a80"/></g>';
    }
    if (c.water) {
      s += '<g class="st-wavemove"><path d="M-40 288 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="9" stroke-linecap="round" opacity=".9"/></g>' +
           '<g class="st-wavemove" style="animation-delay:.7s"><path d="M-70 300 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#8fc8e8" stroke-width="8" stroke-linecap="round" opacity=".8"/></g>';
    }
    if (c.fire) {
      s += '<g transform="translate(480,268)"><path d="M-16 0 l10 -6 l12 8 l10 -8 M-14 6 l30 -2" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/>' +
           '<g class="st-flick"><path d="M0 -8 q-14 -18 0 -34 q3 10 10 14 q8 -8 6 -16 q12 14 2 30 q-8 10 -18 6 z" fill="#ff9c40"/>' +
           '<path d="M2 -10 q-7 -10 0 -20 q6 8 8 12 q3 8 -8 8 z" fill="#ffd166"/></g></g>';
    }
    if (c.rain) {
      s += '<g stroke="#8fc6ff" stroke-width="3.4" stroke-linecap="round">' +
           '<line class="st-rain" x1="140" y1="30" x2="134" y2="52"/><line class="st-rain" style="animation-delay:.4s" x1="300" y1="16" x2="294" y2="38"/>' +
           '<line class="st-rain" style="animation-delay:.8s" x1="450" y1="30" x2="444" y2="52"/><line class="st-rain" style="animation-delay:.2s" x1="580" y1="14" x2="574" y2="36"/>' +
           '<line class="st-rain" style="animation-delay:.6s" x1="220" y1="60" x2="214" y2="82"/><line class="st-rain" style="animation-delay:1s" x1="520" y1="66" x2="514" y2="88"/></g>';
    }
    if (c.snow) {
      s += '<g fill="#fff"><circle class="st-snow" cx="160" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1.2s" cx="330" cy="20" r="3.4"/>' +
           '<circle class="st-snow" style="animation-delay:.5s" cx="470" cy="36" r="4"/><circle class="st-snow" style="animation-delay:1.7s" cx="560" cy="24" r="3"/></g>';
    }
    if (c.wind) {
      s += '<g stroke="#e8f4fb" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9">' +
           '<path class="st-windln" d="M60 110 q60 -18 120 0 q30 9 52 -4"/>' +
           '<path class="st-windln" style="animation-delay:.9s" d="M120 160 q70 -16 130 2 q26 8 48 -6"/></g>';
    }

    // 角色：小孩 + 動物（最多 2 隻）
    var px = c.animals.length ? 250 : 330;
    s += '<g transform="translate(' + px + ',268)">' + ACTORS.kid(c.emo) + '</g>';
    if (c.book) {
      s += '<g transform="translate(' + (px - 66) + ',268)"><g class="st-bob" style="animation-delay:.4s">' +
           '<rect x="-20" y="-38" width="40" height="30" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/>' +
           '<line x1="-1" y1="-38" x2="-5" y2="-9" stroke="#c9bfa8" stroke-width="2"/>' +
           '<path d="M-14 -30 h10 M-14 -24 h10 M4 -31 h10 M4 -25 h10" stroke="#8fa3bf" stroke-width="2" transform="rotate(-8)"/></g></g>';
    }
    c.animals.forEach(function (a, i) {
      var ax = 470 + i * 130;
      var sc = a === 'butterfly' || a === 'bird' ? .95 : 1;
      var ay = (a === 'butterfly') ? 190 : (a === 'bird' ? 220 : 268);
      s += '<g transform="translate(' + ax + ',' + ay + ') scale(' + sc + ')"><g class="st-actor" style="animation-delay:' + (0.2 + i * 0.3) + 's">' + ACTORS[a]() + '</g></g>';
    });
    s += '</svg>';
    return s;
  }

  window.AnimStage = { build: build, pick: pick };
})();
