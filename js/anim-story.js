/* 成語分鏡動畫引擎：像動畫片一樣逐幕演出成語故事
   - 角色沿用 anim-stage.js 的 Q 版角色庫，這裡負責「片場」：布景、走位、動作、特效
   - 劇本放 STORIES（每條成語 3-5 幕），之後分批擴充；有劇本的成語，動畫卡自動演劇情
   - 介面：AnimStory.has(id) / AnimStory.scenes(id) -> [{html,sub,minDur}]              */
(function () {
  if (typeof document === 'undefined') return;

  function A(name, arg) { return window.AnimStage.actors[name](arg); }

  /* 定位：外層 g 用屬性 transform 定位（CSS 動畫不會蓋掉），內層掛動作 class */
  function P(x, y, inner, cls, delay, scale, flip) {
    var tr = 'translate(' + x + ',' + y + ')';
    if (scale || flip) tr += ' scale(' + ((flip ? -1 : 1) * (scale || 1)) + ',' + (scale || 1) + ')';
    return '<g transform="' + tr + '">' +
           '<g' + (cls ? ' class="' + cls + '"' : '') + (delay ? ' style="animation-delay:' + delay + 's"' : '') + '>' +
           inner + '</g></g>';
  }

  /* ---------- 布景 ---------- */
  function sky(mode) {
    if (mode === 'night') {
      return '<rect width="800" height="340" fill="#31406b"/>' +
        '<g fill="#fff"><circle class="st-tw" cx="120" cy="52" r="3"/><circle class="st-tw" style="animation-delay:.6s" cx="300" cy="36" r="2.4"/>' +
        '<circle class="st-tw" style="animation-delay:1.1s" cx="520" cy="50" r="3"/><circle class="st-tw" style="animation-delay:.3s" cx="640" cy="90" r="2"/></g>' +
        '<g transform="translate(680,70)"><path d="M14 -26 A30 30 0 1 0 26 16 A24 24 0 1 1 14 -26 Z" fill="#f4f1de"/></g>';
    }
    return '<rect width="800" height="340" fill="#aee3f5"/>' +
      '<g class="st-rays" style="transform-origin:680px 66px"><g stroke="#ffcf4d" stroke-width="6" stroke-linecap="round">' +
      '<line x1="680" y1="18" x2="680" y2="30"/><line x1="680" y1="102" x2="680" y2="114"/>' +
      '<line x1="632" y1="66" x2="644" y2="66"/><line x1="716" y1="66" x2="728" y2="66"/></g></g>' +
      '<circle cx="680" cy="66" r="28" fill="#ffdd66" stroke="#f5b73e" stroke-width="3"/>' +
      '<circle cx="671" cy="62" r="2.8" fill="#7a4b12"/><circle cx="689" cy="62" r="2.8" fill="#7a4b12"/>' +
      '<path d="M673 73 Q680 79 687 73" stroke="#7a4b12" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<g class="st-cloud"><ellipse cx="170" cy="56" rx="30" ry="13" fill="#fff"/><ellipse cx="148" cy="62" rx="18" ry="9" fill="#fff"/><ellipse cx="192" cy="62" rx="19" ry="10" fill="#fff"/></g>';
  }
  function ground() {
    return '<ellipse cx="180" cy="330" rx="330" ry="86" fill="#b8e08e"/>' +
      '<ellipse cx="640" cy="340" rx="360" ry="90" fill="#a5d47c"/>' +
      '<rect y="302" width="800" height="38" fill="#95c96e"/>';
  }
  function scene(body, mode) {
    return '<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg" class="story-svg">' +
      sky(mode) + ground() + body + '</svg>';
  }

  /* ---------- 道具 ---------- */
  var STUMP = '<path d="M-30 0 Q-34 38 -26 42 L26 42 Q34 38 30 0 Z" fill="#a8734a"/>' +
    '<ellipse cx="0" cy="0" rx="32" ry="12" fill="#d8a878"/>' +
    '<ellipse cx="0" cy="0" rx="20" ry="7.5" fill="none" stroke="#b9885a" stroke-width="2.4"/>' +
    '<circle cx="0" cy="0" r="2.4" fill="#b9885a"/>';
  var HOE = '<line x1="0" y1="0" x2="58" y2="-44" stroke="#a8734a" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M58 -44 q18 2 22 10 l-14 11 q-7 -8 -8 -21 z" fill="#8b93a3"/>';
  function fence(hole) {
    var s = '<g stroke="#b98a5d" stroke-width="7" stroke-linecap="round">';
    [-120, -60, 0, 60, 120].forEach(function (x, i) {
      if (hole && (i === 2)) return; // 破洞：中間柱子倒了
      s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="-52"/>';
    });
    s += '</g><g stroke="#c9a06c" stroke-width="6" stroke-linecap="round">';
    if (hole) {
      s += '<line x1="-130" y1="-36" x2="-30" y2="-36"/><line x1="30" y1="-36" x2="130" y2="-36"/>' +
           '<line x1="-130" y1="-14" x2="-30" y2="-14"/><line x1="30" y1="-14" x2="130" y2="-14"/>' +
           '<line x1="-6" y1="-6" x2="40" y2="4" stroke="#a8734a"/>';
    } else {
      s += '<line x1="-130" y1="-36" x2="130" y2="-36"/><line x1="-130" y1="-14" x2="130" y2="-14"/>';
    }
    return s + '</g>';
  }
  var QIN = '<rect x="-44" y="-10" width="88" height="20" rx="8" fill="#a8734a" stroke="#8a5a33" stroke-width="2"/>' +
    '<g stroke="#f0e6d0" stroke-width="1.6"><line x1="-38" y1="-4" x2="38" y2="-4"/><line x1="-38" y1="0" x2="38" y2="0"/><line x1="-38" y1="4" x2="38" y2="4"/></g>';
  var JUG = '<path d="M-10 0 Q-16 -10 -10 -22 L10 -22 Q16 -10 10 0 Z" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2"/>' +
    '<rect x="-6" y="-30" width="12" height="9" rx="3" fill="#6d87ab"/>' +
    '<ellipse cx="0" cy="0" rx="11" ry="3.5" fill="#6d87ab"/>';
  function chalkSnake(legs) {
    var s = '<path d="M-30 0 q14 -18 30 -6 q16 12 30 -2 q10 -8 18 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".95"/>' +
      '<circle cx="-32" cy="-2" r="6" fill="#fff" opacity=".95"/><circle cx="-34" cy="-3" r="1.4" fill="#7a8a5a"/>';
    if (legs) s += '<g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".95" class="st-draw">' +
      '<line x1="-12" y1="4" x2="-16" y2="16"/><line x1="2" y1="6" x2="0" y2="18"/>' +
      '<line x1="22" y1="2" x2="22" y2="14"/><line x1="38" y1="0" x2="42" y2="12"/></g>';
    return s;
  }
  var TREE = '<rect x="-8" y="-44" width="16" height="44" rx="6" fill="#a8734a"/>' +
    '<circle cx="0" cy="-62" r="28" fill="#7cc47f"/><circle cx="-22" cy="-48" r="18" fill="#8fd08f"/><circle cx="22" cy="-50" r="19" fill="#8fd08f"/>';

  /* ---------- 特效 ---------- */
  function bang(x, y) {
    return P(x, y, '<path d="M0-30 L8-11 L28-18 L14 0 L30 12 L9 11 L6 31 L-6 12 L-27 18 L-12 0 L-28-14 L-9-9 Z" ' +
      'fill="#ff8a5c" stroke="#f26d3d" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<text x="0" y="8" text-anchor="middle" font-size="21" font-weight="bold" fill="#fff">碰!</text>', 'st-bang');
  }
  function hearts(x, y) {
    return P(x, y, '<path d="M0 5 C-7 -5 -19 2 -10 12 L0 20 L10 12 C19 2 7 -5 0 5 Z" fill="#ff7b9c"/>', 'st-heart') +
           P(x + 34, y - 16, '<path d="M0 4 C-5 -4 -14 1 -8 9 L0 15 L8 9 C14 1 5 -4 0 4 Z" fill="#ff9eb5"/>', 'st-heart', .6);
  }
  function zzz(x, y) {
    return P(x, y, '<text font-size="24" fill="#eef4ff" font-weight="bold">z</text>' +
      '<text x="16" y="-16" font-size="18" fill="#eef4ff">z</text><text x="28" y="-29" font-size="13" fill="#eef4ff">z</text>', 'st-zfloat');
  }
  function notes(x, y) {
    return P(x, y, '<text font-size="26" fill="#5c82ba">♪</text>', 'st-note') +
           P(x + 26, y - 14, '<text font-size="20" fill="#7fa8e0">♫</text>', 'st-note', .7) +
           P(x - 20, y - 8, '<text font-size="17" fill="#9fb9dd">♪</text>', 'st-note', 1.3);
  }
  function sweat(x, y) { return P(x, y, '<path d="M0 0 Q-6 10 0 15 Q6 10 0 0 Z" fill="#8fc6ff"/>', 'st-sweat'); }
  function qmark(x, y) { return P(x, y, '<text font-size="30" font-weight="bold" fill="#ffd97a">?</text>', 'st-zfloat'); }
  var WEEDS = '<g class="st-grow"><path d="M560 318 q-6 -30 -16 -38 M560 318 q4 -32 14 -42" stroke="#5f8a46" stroke-width="5" fill="none" stroke-linecap="round"/></g>' +
    '<g class="st-grow" style="animation-delay:.5s"><path d="M200 322 q-6 -26 -14 -32 M200 322 q6 -28 16 -36" stroke="#5f8a46" stroke-width="5" fill="none" stroke-linecap="round"/></g>';

  /* ---------- 劇本 ---------- */
  var STORIES = {
    /* 守株待兔 */
    i031: function () {
      return [
        { minDur: 5200, sub: '宋國有個農夫，每天在田裡辛苦耕作。',
          html: scene(P(400, 302, STUMP) +
            P(180, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe'), 'st-inL')) },
        { minDur: 5400, sub: '有一天，一隻兔子飛奔而來，一頭撞上樹樁，昏倒在地！',
          html: scene(P(400, 302, STUMP) + P(180, 302, A('kid', 'wow')) +
            P(455, 302, '<g class="st-faint">' + A('rabbit') + '</g>', 'st-dashL') +
            bang(410, 236)) },
        { minDur: 5200, sub: '農夫不費半點力氣就撿到兔子，樂得心花怒放！',
          html: scene(P(500, 302, STUMP) +
            P(320, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(40, -66, A('rabbit'), '', 0, .55) + '</g>') +
            hearts(260, 190) + hearts(420, 160)) },
        { minDur: 7800, sub: '從此他丟下鋤頭，天天守著樹樁呆等。田荒了，兔子卻再也沒有出現……',
          html: scene(P(400, 302, STUMP) + WEEDS +
            P(452, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') +
            P(150, 316, HOE, '', 0, 1) + zzz(500, 210), 'night') },
        { minDur: 6000, sub: '守株待兔：比喻拘泥守成，妄想不勞而獲。',
          html: scene(P(400, 302, STUMP) + P(250, 302, A('kid', 'happy')) + P(520, 302, A('rabbit')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">守株待兔</text>') }
      ];
    },
    /* 亡羊補牢 */
    i032: function () {
      return [
        { minDur: 5000, sub: '牧羊人的羊圈，破了一個大洞。',
          html: scene(P(420, 300, fence(true)) + P(340, 296, A('goat'), '', 0, .8) +
            P(500, 296, A('goat'), '', 0, .75) + P(150, 302, A('kid', 'happy'), 'st-inL')) },
        { minDur: 5600, sub: '夜裡，野狼從破洞鑽進來，叼走了一隻羊！',
          html: scene(P(420, 300, fence(true)) + P(340, 296, A('goat'), '', 0, .8) +
            P(560, 298, A('fox') + qmark(0, -90), 'st-dashL') + bang(470, 240), 'night') },
        { minDur: 6800, sub: '鄰人勸他快補羊圈，他卻說：「羊都丟了，補圈做什麼？」結果又丟了一隻！',
          html: scene(P(420, 300, fence(true)) + P(180, 302, A('kid', 'angry')) +
            P(300, 302, A('kid', 'sad'), '', 0, .9) + qmark(210, 200) + sweat(330, 220)) },
        { minDur: 6800, sub: '他終於後悔了，趕緊把羊圈修得牢牢的。從此，再也沒有丟過羊。',
          html: scene(P(420, 300, fence(false)) + P(340, 296, A('goat'), '', 0, .8) +
            P(500, 296, A('goat'), '', 0, .75) +
            P(200, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(300, 180)) },
        { minDur: 6200, sub: '亡羊補牢：出了差錯及時補救，還不算晚。',
          html: scene(P(420, 300, fence(false)) + P(200, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">亡羊補牢</text>') }
      ];
    },
    /* 畫蛇添足 */
    i009: function () {
      return [
        { minDur: 6200, sub: '楚國人分一壺酒：在地上比賽畫蛇，誰先畫好，酒就歸誰！',
          html: scene(P(400, 240, JUG) + P(180, 302, A('kid', 'happy'), 'st-inL') +
            P(620, 302, A('kid', 'happy'), 'st-inR', 0, 1, true) +
            P(260, 318, chalkSnake(false)) + P(560, 318, '<path d="M-24 0 q10 -14 24 -6" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>')) },
        { minDur: 6600, sub: '一人先畫好了，拿起酒壺卻想炫耀：「我還能幫蛇畫上腳呢！」',
          html: scene(P(180, 302, A('kid', 'happy') + P(38, -70, JUG, '', 0, .8)) +
            P(620, 302, A('kid', 'wow'), '', 0, 1, true) +
            P(260, 318, chalkSnake(true)) + P(560, 318, chalkSnake(false))) },
        { minDur: 7200, sub: '就在他畫腳時，另一人畫好了蛇，一把拿走酒壺：「蛇本來就沒有腳，你畫的根本不是蛇！」',
          html: scene(P(180, 302, A('kid', 'wow') + sweat(-30, -80)) +
            P(560, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(-40, -70, JUG, '', 0, .8) + '</g>', '', 0, 1, true) +
            P(260, 318, chalkSnake(true)) + P(500, 318, chalkSnake(false)) + bang(400, 180)) },
        { minDur: 6000, sub: '畫蛇添足：多此一舉，反而把事情弄糟了。',
          html: scene(P(300, 302, A('kid', 'sad')) + P(430, 318, chalkSnake(true)) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">畫蛇添足</text>') }
      ];
    },
    /* 對牛彈琴 */
    i233: function () {
      return [
        { minDur: 5400, sub: '有位樂師，對著一頭牛彈起優美的琴曲。',
          html: scene(P(230, 302, A('kid', 'happy'), 'st-inL') + P(320, 316, QIN) +
            P(560, 300, A('ox')) + notes(360, 200)) },
        { minDur: 6200, sub: '琴聲再動聽，牛只顧低頭吃草，一點反應也沒有。',
          html: scene(P(230, 302, A('kid', 'happy')) + P(320, 316, QIN) +
            P(560, 300, A('ox')) + notes(360, 190) +
            P(520, 314, '<path d="M-10 0 q5 -12 10 0 M2 0 q5 -10 10 0" stroke="#5f8a46" stroke-width="4" fill="none" stroke-linecap="round"/>') +
            qmark(600, 190)) },
        { minDur: 6400, sub: '樂師嘆了口氣：不是琴聲不美，是聽的對象聽不懂啊！',
          html: scene(P(230, 302, A('kid', 'sad') + sweat(28, -84)) + P(320, 316, QIN) +
            P(560, 300, A('ox')) + hearts(600, 210)) },
        { minDur: 6200, sub: '對牛彈琴：比喻對不懂道理的人講道理，白費脣舌。',
          html: scene(P(260, 302, A('kid', 'happy')) + P(560, 300, A('ox')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">對牛彈琴</text>') }
      ];
    },
    /* 狐假虎威 */
    i050: function () {
      return [
        { minDur: 6400, sub: '老虎抓住狐狸，狐狸急中生智：「我是天帝派來的百獸之王，不信你跟在我後面走！」',
          html: scene(P(120, 302, TREE) + P(300, 302, A('fox')) +
            P(520, 302, A('tiger'), 'st-inR') + sweat(270, 210) + qmark(560, 190)) },
        { minDur: 6600, sub: '狐狸大搖大擺走在前面，老虎跟在後面。動物們一看，嚇得四處逃竄！',
          html: scene(P(120, 302, TREE) + P(260, 302, A('fox'), 'st-strut') +
            P(430, 302, A('tiger'), 'st-strut', .3) +
            P(620, 296, A('rabbit'), 'st-fleeR') + P(700, 298, A('mouse'), 'st-fleeR', .3)) },
        { minDur: 6800, sub: '老虎以為大家怕的是狐狸——其實，動物們怕的是牠自己啊！',
          html: scene(P(120, 302, TREE) + P(260, 302, A('fox')) + hearts(300, 190) +
            P(480, 302, A('tiger')) + qmark(530, 180) + sweat(510, 210)) },
        { minDur: 6200, sub: '狐假虎威：借別人的威勢欺壓人。',
          html: scene(P(300, 302, A('fox')) + P(500, 302, A('tiger')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">狐假虎威</text>') }
      ];
    }
  };

  window.AnimStory = {
    has: function (id) { return !!STORIES[id]; },
    scenes: function (id) { return STORIES[id] ? STORIES[id]() : []; },
    count: function () { return Object.keys(STORIES).length; }
  };
})();
