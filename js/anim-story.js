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
  var HAMMER = '<g class="st-hammer"><line x1="0" y1="0" x2="26" y2="-26" stroke="#a8734a" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="16" y="-40" width="24" height="15" rx="4" fill="#8b93a3" transform="rotate(45 28 -32)"/></g>';
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
      var HOLE_MARK = '<circle cx="0" cy="-22" r="36" fill="none" stroke="#ff6b5c" stroke-width="4" stroke-dasharray="9 9" class="st-tw"/>';
      return [
        { minDur: 5000, sub: '牧羊人養了兩隻羊。可是羊圈，破了一個大洞！',
          html: scene(P(430, 300, fence(true) + HOLE_MARK) + P(340, 296, A('goat'), '', 0, .8) +
            P(520, 296, A('goat'), '', 0, .75) + P(160, 302, A('kid', 'happy'), 'st-inL')) },
        { minDur: 6200, sub: '夜裡，野狼從破洞鑽進來，叼走了第一隻羊！',
          html: scene(P(430, 300, fence(true)) +
            P(300, 296, A('goat') + sweat(-30, -70), '', 0, .8) +
            P(520, 298, '<g class="st-fleeR">' + A('fox') + P(6, -54, A('goat'), '', 0, .42) + '</g>', 'st-dashL') +
            bang(470, 236), 'night') },
        { minDur: 6800, sub: '鄰人指著破洞勸他：「快補起來吧！」他卻擺擺手：「羊都丟了，還補圈做什麼？」',
          html: scene(P(430, 300, fence(true) + HOLE_MARK) + P(300, 296, A('goat'), '', 0, .8) +
            P(150, 302, A('kid', 'angry')) + P(270, 302, A('kid', 'wow'), '', 0, .9) +
            qmark(180, 198) + sweat(300, 214)) },
        { minDur: 6400, sub: '結果，野狼又從同一個破洞鑽進來，叼走了第二隻羊！羊圈空了……',
          html: scene(P(430, 300, fence(true)) +
            P(520, 298, '<g class="st-fleeR">' + A('fox') + P(6, -54, A('goat'), '', 0, .42) + '</g>', 'st-dashL') +
            P(160, 302, A('kid', 'wow') + sweat(30, -84)) + bang(470, 236), 'night') },
        { minDur: 6400, sub: '他終於後悔了，拿起鎚子，叮叮咚咚把破洞補得牢牢的。',
          html: scene(P(430, 300, fence(false)) +
            P(300, 302, A('kid', 'happy') + P(22, -40, HAMMER)) +
            P(430, 252, '<g class="st-bang"><path d="M0-8 L2-2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2-2 Z" fill="#fff27a"/></g>')) },
        { minDur: 6000, sub: '從此，羊兒們安安全全，再也沒有丟過一隻。',
          html: scene(P(430, 300, fence(false)) + P(360, 296, A('goat'), '', 0, .8) +
            P(520, 296, A('goat'), '', 0, .75) +
            P(180, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(280, 180)) },
        { minDur: 6200, sub: '亡羊補牢：出了差錯及時補救，還不算晚。',
          html: scene(P(430, 300, fence(false)) + P(200, 302, A('kid', 'happy')) + P(360, 296, A('goat'), '', 0, .8) +
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
    /* 拔苗助長 */
    i1004: function () {
      function seedlings(h, wilt) {
        var s='', xs=[-90,-45,0,45,90];
        xs.forEach(function(x,i){
          s += '<g transform="translate('+x+',0)'+(wilt?' rotate('+(i%2?38:-42)+')':'')+'">'+
               '<line x1="0" y1="0" x2="0" y2="'+(-h)+'" stroke="'+(wilt?'#b9a25a':'#5f8a46')+'" stroke-width="5" stroke-linecap="round"/>'+
               '<path d="M0 '+(-h)+' q-8 -8 -4 -14 M0 '+(-h)+' q8 -8 4 -14" stroke="'+(wilt?'#b9a25a':'#7cc47f')+'" stroke-width="4" fill="none" stroke-linecap="round"/></g>';
        });
        return s;
      }
      return [
        { minDur: 5600, sub: '宋國有個農夫，嫌田裡的秧苗長得太慢，天天煩惱。',
          html: scene(P(500, 316, seedlings(26)) + P(180, 302, A('kid', 'sad') + qmark(34, -100), 'st-inL')) },
        { minDur: 6400, sub: '他想出一個「好辦法」：把每一棵苗都往上拔高一截！忙了一整天，累得滿頭大汗。',
          html: scene(P(500, 316, seedlings(46)) +
            P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + sweat(400, 200) + sweat(320, 210)) },
        { minDur: 6200, sub: '他得意地回家宣布：「今天幫苗長高了不少！」兒子急忙跑到田裡一看——',
          html: scene(P(180, 302, A('kid', 'happy') + hearts(0, -110)) +
            P(560, 302, A('kid', 'wow'), 'st-dashL', 0, .9), 'night') },
        { minDur: 6000, sub: '秧苗全都枯萎了！拔起來的苗，根離了土，再也活不成。',
          html: scene(P(500, 316, seedlings(46, true)) + P(300, 302, A('kid', 'wow') + sweat(-30, -84)) + bang(500, 210)) },
        { minDur: 6000, sub: '拔苗助長：不顧規律硬求速成，反而把事情弄糟。',
          html: scene(P(500, 316, seedlings(26)) + P(240, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">拔苗助長</text>') }
      ];
    },
    /* 鶴立雞群 */
    i131: function () {
      var CRANE = '<g class="st-bob">' +
        '<ellipse cx="0" cy="-70" rx="20" ry="15" fill="#fff" stroke="#e3dcd4" stroke-width="2"/>' +
        '<path d="M-14 -80 q-16 -14 -12 -34" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        '<circle cx="-28" cy="-116" r="9" fill="#fff" stroke="#e3dcd4" stroke-width="2"/>' +
        '<circle cx="-28" cy="-124" r="4" fill="#ff6b5c"/>' +
        '<path d="M-36 -116 l-10 -3 l10 -3 z" fill="#f5a742"/>' +
        '<circle cx="-31" cy="-118" r="2.4" fill="#3a2e26"/>' +
        '<path d="M14 -76 q10 4 8 12" stroke="#4a4a4a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<line x1="-5" y1="-56" x2="-5" y2="0" stroke="#f5a742" stroke-width="4"/>' +
        '<line x1="7" y1="-56" x2="7" y2="0" stroke="#f5a742" stroke-width="4"/></g>';
      return [
        { minDur: 5400, sub: '雞群裡熱熱鬧鬧，大家長得都差不多。',
          html: scene(P(250, 300, A('chicken'), '', 0, .9) + P(370, 300, A('chicken'), '', 0, .85, true) +
            P(490, 300, A('chicken'), '', 0, .9) + P(610, 300, A('chicken'), '', 0, .85, true)) },
        { minDur: 6200, sub: '忽然，一隻仙鶴走了進來——脖子長長、亭亭玉立，一下子就看出不一樣！',
          html: scene(P(250, 300, A('chicken') + qmark(-20, -90), '', 0, .9) +
            P(560, 300, A('chicken') + qmark(30, -86), '', 0, .85, true) +
            P(400, 302, CRANE, 'st-inR') + P(430, 300, A('chicken'), '', 0, .8)) },
        { minDur: 6200, sub: '大家都忍不住看牠：站在雞群中的鶴，實在太出眾了！',
          html: scene(P(260, 300, A('chicken'), '', 0, .9) + P(540, 300, A('chicken'), '', 0, .85, true) +
            P(400, 302, CRANE) + hearts(330, 160) + hearts(480, 150)) },
        { minDur: 6000, sub: '鶴立雞群：比喻才能儀表出眾，超越眾人。',
          html: scene(P(400, 302, CRANE) + P(260, 300, A('chicken'), '', 0, .85) + P(540, 300, A('chicken'), '', 0, .85, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">鶴立雞群</text>') }
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
    },
    /* 畫龍點睛 */
    i008: function () {
      function wallDragon(hasEye) {
        var s = '<path d="M-26 6 q14 -18 34 -8 q14 8 6 18 q-7 8 -20 4" fill="none" stroke="#e8b84a" stroke-width="7" stroke-linecap="round"/>' +
          '<circle cx="-28" cy="3" r="8" fill="#e8b84a"/>' +
          '<path d="M-33 -4 l-2 -7 l6 4 z M-26 -5 l1 -7 l4 5 z" fill="#c98f2a"/>';
        if (hasEye) s += '<circle cx="-30" cy="2" r="2.2" fill="#3a2e26"/>';
        return s;
      }
      var WALL = '<rect x="-180" y="-170" width="360" height="170" rx="6" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="4"/>' +
        '<line x1="-180" y1="-86" x2="180" y2="-86" stroke="#ddd2b8" stroke-width="2"/>' +
        '<line x1="0" y1="-170" x2="0" y2="-86" stroke="#ddd2b8" stroke-width="2"/>' +
        '<line x1="-90" y1="-86" x2="-90" y2="0" stroke="#ddd2b8" stroke-width="2"/>' +
        '<line x1="90" y1="-86" x2="90" y2="0" stroke="#ddd2b8" stroke-width="2"/>';
      var BRUSH = '<line x1="0" y1="0" x2="14" y2="-34" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M0 0 q-3 6 -1 11 q4 -2 5 -8 z" fill="#3a2e26"/>';
      function fourDragons(eyeOn) {
        return P(-90, -110, wallDragon(eyeOn === 0), '', 0, .9) + P(90, -110, wallDragon(eyeOn === 1), '', 0, .9) +
               P(-90, -30, wallDragon(eyeOn === 2), '', 0, .9) + P(90, -30, wallDragon(eyeOn === 3), '', 0, .9);
      }
      return [
        { minDur: 6400, sub: '畫家張僧繇在牆上畫了四條龍，活靈活現，卻一隻眼睛也沒畫。',
          html: scene(P(400, 300, WALL + fourDragons(-1)) +
            P(150, 302, A('kid', 'happy') + P(20, -40, BRUSH), 'st-inL')) },
        { minDur: 6800, sub: '大家好奇地問：「為什麼不畫眼睛呢？」他說：「點上眼睛，龍就會飛走！」大家都不相信。',
          html: scene(P(400, 300, WALL + fourDragons(-1)) +
            P(150, 302, A('kid', 'happy')) + P(660, 302, A('kid', 'wow'), '', 0, .95, true) +
            qmark(690, 190) + qmark(120, 200)) },
        { minDur: 5800, sub: '張僧繇提起筆，輕輕為其中一條龍，點上了眼睛……',
          html: scene(P(400, 300, WALL + fourDragons(0)) +
            P(260, 302, A('kid', 'happy') + P(24, -44, BRUSH)) +
            P(310, 190, '<g class="st-bang"><path d="M0-8 L2-2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2-2 Z" fill="#fff27a"/></g>')) },
        { minDur: 6800, sub: '轟隆！雷聲大作，那條龍破牆而出，騰空飛上天去了！',
          html: scene(P(400, 300, WALL + P(90, -110, wallDragon(false), '', 0, .9) +
              P(-90, -30, wallDragon(false), '', 0, .9) + P(90, -30, wallDragon(false), '', 0, .9) +
              '<path d="M-120 -140 l18 20 M-70 -152 l-12 22 M-60 -96 l-20 10" stroke="#c9bfa8" stroke-width="4" stroke-linecap="round"/>') +
            P(220, 130, A('dragon'), 'st-fleeR', 0, 1.15) + bang(310, 100) +
            P(660, 302, A('kid', 'wow'), '', 0, .95, true) + sweat(690, 214)) },
        { minDur: 6200, sub: '畫龍點睛：比喻最後加上關鍵一筆，使整體更加生動完美。',
          html: scene(P(280, 190, A('dragon')) + P(520, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">畫龍點睛</text>') }
      ];
    },
    /* 掩耳盜鈴 */
    i033: function () {
      var FRAME = '<path d="M-64 0 L-64 -96 L64 -96 L64 0" stroke="#a8734a" stroke-width="9" fill="none" stroke-linecap="round"/>';
      var BELL = '<line x1="0" y1="-96" x2="0" y2="-86" stroke="#8a5a33" stroke-width="4"/>' +
        '<path d="M-26 -46 Q-26 -84 0 -88 Q26 -84 26 -46 Z" fill="#e8b84a" stroke="#c98f2a" stroke-width="3"/>' +
        '<rect x="-30" y="-46" width="60" height="9" rx="4.5" fill="#c98f2a"/>' +
        '<circle cx="0" cy="-32" r="6" fill="#c98f2a"/>';
      var EARS_COVERED = '<circle cx="-24" cy="-54" r="8.5" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>' +
        '<circle cx="24" cy="-54" r="8.5" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>';
      return [
        { minDur: 6200, sub: '有個人路過大戶人家，看見門前掛著一口大鐘，心想：把它偷回家多好！',
          html: scene(P(500, 302, FRAME + BELL) +
            P(180, 302, A('kid', 'happy'), 'st-inL') + hearts(240, 190)) },
        { minDur: 6600, sub: '大鐘又大又重，怎麼搬也搬不動。他想到一個辦法：把鐘敲碎，再一塊塊搬走！',
          html: scene(P(500, 302, FRAME + BELL) +
            P(390, 302, A('kid', 'angry') + P(26, -42, HAMMER)) +
            sweat(360, 200) + sweat(440, 210)) },
        { minDur: 6800, sub: '他又怕鐘聲被人聽見，靈機一動，緊緊摀住自己的耳朵：「我聽不見，別人一定也聽不見！」',
          html: scene(P(500, 302, FRAME + BELL) +
            P(390, 302, A('kid', 'happy') + EARS_COVERED) + qmark(320, 190)) },
        { minDur: 6600, sub: '「噹——！」鎚子一敲，鐘聲又響又亮，大家全聽見了，跑出來把他抓個正著！',
          html: scene(P(500, 302, FRAME + BELL) + bang(500, 200) +
            notes(560, 150) + notes(420, 130) +
            P(390, 302, A('kid', 'wow') + EARS_COVERED + sweat(34, -90)) +
            P(120, 302, A('kid', 'angry'), 'st-dashL', 0, .95) +
            P(210, 302, A('kid', 'angry'), 'st-dashL', .3, .9)) },
        { minDur: 6000, sub: '掩耳盜鈴：比喻自欺欺人，掩蓋不了事實。',
          html: scene(P(500, 302, FRAME + BELL) + P(240, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">掩耳盜鈴</text>') }
      ];
    },
    /* 井底之蛙 */
    i235: function () {
      var SHAFT = '<rect x="-120" y="-150" width="240" height="150" fill="#9c8468"/>' +
        '<rect x="-40" y="-150" width="80" height="150" fill="#5f574c"/>' +
        '<g stroke="#8a7a66" stroke-width="2"><line x1="-40" y1="-120" x2="40" y2="-120"/><line x1="-40" y1="-88" x2="40" y2="-88"/>' +
        '<line x1="-40" y1="-56" x2="40" y2="-56"/><line x1="-40" y1="-24" x2="40" y2="-24"/></g>' +
        '<ellipse cx="0" cy="-150" rx="40" ry="8" fill="#aee3f5" stroke="#8fd0e8" stroke-width="3"/>';
      var RING = '<path d="M-46 0 L-38 -34 L38 -34 L46 0 Z" fill="#b0a390" stroke="#8a7a66" stroke-width="3"/>' +
        '<ellipse cx="0" cy="-34" rx="38" ry="9" fill="#6d6357"/>' +
        '<line x1="-30" y1="-17" x2="30" y2="-17" stroke="#8a7a66" stroke-width="2"/>';
      var SEAWAVES = '<rect y="252" width="800" height="88" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 262 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="9" stroke-linecap="round" opacity=".9"/></g>' +
        '<g class="st-wavemove" style="animation-delay:.7s"><path d="M-70 286 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="8" stroke-linecap="round" opacity=".8"/></g>';
      return [
        { minDur: 6400, sub: '一隻青蛙住在井底。牠抬頭望著小小的井口，說：「天空呀，就只有井口這麼大！」',
          html: scene(P(400, 340, SHAFT + P(0, -8, A('frog'), '', 0, .9)) + qmark(400, 160)) },
        { minDur: 6600, sub: '有一天，一隻大海龜路過井邊。青蛙得意地誇耀：「我在井裡自由自在，你要不要進來玩呀？」',
          html: scene(P(330, 302, RING + P(0, -40, A('frog'), '', 0, .85)) +
            P(520, 302, A('turtle'), 'st-inR') + hearts(300, 190)) },
        { minDur: 6800, sub: '海龜笑著說：「大海千里遼闊、萬丈深。住在大海裡，那才是真正的快樂呀！」',
          html: scene(SEAWAVES + P(400, 296, A('turtle'), '', 0, 1.1) +
            P(600, 290, A('fish')) + P(180, 286, A('fish'), '', .5, .8, true)) },
        { minDur: 6200, sub: '青蛙聽得目瞪口呆——原來井外的世界，這麼大！',
          html: scene(P(330, 302, RING + P(0, -40, A('frog'), '', 0, .85)) +
            P(520, 302, A('turtle')) + sweat(300, 200) + qmark(360, 170)) },
        { minDur: 6000, sub: '井底之蛙：比喻見識淺薄狹隘的人。',
          html: scene(P(330, 302, RING + P(0, -40, A('frog'), '', 0, .85)) + P(540, 302, A('turtle')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">井底之蛙</text>') }
      ];
    },
    /* 自相矛盾 */
    i236: function () {
      var SPEAR = '<line x1="0" y1="8" x2="0" y2="-56" stroke="#a8734a" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M0 -74 l-9 18 h18 z" fill="#8b93a3" stroke="#6d7585" stroke-width="2"/>';
      var SHIELD = '<path d="M-22 -52 h44 q0 36 -22 46 q-22 -10 -22 -46 z" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>' +
        '<circle cx="0" cy="-28" r="6.5" fill="#e8b84a"/>' +
        '<path d="M-22 -38 h44" stroke="#a85a1e" stroke-width="2.4"/>';
      var STALL = '<rect x="-70" y="-30" width="140" height="30" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<line x1="-58" y1="0" x2="-58" y2="-30" stroke="#a8734a" stroke-width="4"/><line x1="58" y1="0" x2="58" y2="-30" stroke="#a8734a" stroke-width="4"/>';
      return [
        { minDur: 6600, sub: '楚國商人在市場擺攤，賣矛又賣盾。他先舉起盾誇口：「我的盾最堅固，什麼矛都刺不穿！」',
          html: scene(P(430, 302, STALL + P(40, -30, SPEAR, '', 0, .9)) +
            P(300, 302, A('kid', 'happy') + P(34, -66, SHIELD, '', 0, .85), 'st-inL') +
            P(640, 302, A('kid', 'happy'), '', 0, .95, true)) },
        { minDur: 6400, sub: '他又舉起矛誇口：「我的矛最鋒利，天下的盾，沒有一面刺不穿！」',
          html: scene(P(430, 302, STALL + P(40, -32, SHIELD, '', 0, .8)) +
            P(300, 302, A('kid', 'happy') + P(34, -60, SPEAR, '', 0, .9)) +
            P(640, 302, A('kid', 'wow'), '', 0, .95, true)) },
        { minDur: 6800, sub: '一位路人問：「那……用你的矛，刺你的盾，會怎麼樣呢？」',
          html: scene(P(430, 240, P(-40, 0, SPEAR, '', 0, 1) + P(40, 10, SHIELD)) +
            qmark(430, 130) +
            P(180, 302, A('kid', 'happy')) + P(640, 302, A('kid', 'wow'), '', 0, .95, true) +
            sweat(660, 200)) },
        { minDur: 6200, sub: '商人張口結舌，漲紅了臉，一句話也答不上來。',
          html: scene(P(430, 302, STALL + P(-40, -30, SPEAR, '', 0, .9) + P(40, -32, SHIELD, '', 0, .8)) +
            P(300, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') +
            sweat(340, 200) + P(640, 302, A('kid', 'happy'), '', 0, .95, true)) },
        { minDur: 6000, sub: '自相矛盾：言行前後牴觸，互相衝突。',
          html: scene(P(400, 260, P(-60, 0, SPEAR, '', 0, 1.1) + P(60, 12, SHIELD, '', 0, 1.1)) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">自相矛盾</text>') }
      ];
    },
    /* 刻舟求劍 */
    i238: function () {
      var RIVER = '<rect y="258" width="800" height="82" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 268 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="8" stroke-linecap="round" opacity=".9"/></g>';
      var BOAT = '<path d="M-72 0 L72 0 L52 24 L-52 24 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>';
      var SWORD = '<rect x="-3" y="-34" width="6" height="34" rx="2.4" fill="#c4cede" stroke="#8b93a3" stroke-width="1.6"/>' +
        '<rect x="-11" y="0" width="22" height="5.5" rx="2.6" fill="#c98f2a"/>' +
        '<rect x="-3.5" y="5.5" width="7" height="13" rx="3" fill="#8a5a33"/>';
      var MARK = '<path d="M-7 -7 L7 7 M-7 7 L7 -7" stroke="#e85a4f" stroke-width="4.5" stroke-linecap="round"/>';
      var SPLASH = '<g class="st-bang"><path d="M-14 0 q-4 -12 -10 -14 M0 -4 q0 -14 -2 -18 M14 0 q4 -12 10 -14" stroke="#bfe0ff" stroke-width="4" fill="none" stroke-linecap="round"/></g>';
      return [
        { minDur: 6600, sub: '楚國人坐船過江，船身搖搖晃晃——「撲通！」寶劍從腰間滑落，掉進江裡！',
          html: scene(RIVER + P(400, 262, BOAT + P(-20, -24, A('kid', 'wow'), '', 0, .9)) +
            P(310, 290, SWORD, '', 0, 1, false) + SPLASH.replace('<g class="st-bang">', '<g class="st-bang" transform="translate(310,286)">') +
            sweat(360, 190)) },
        { minDur: 6800, sub: '他不慌不忙，拿出小刀在船邊刻了一個記號：「我的劍，就是從這裡掉下去的。」',
          html: scene(RIVER + P(400, 262, BOAT + P(-58, 12, MARK) +
              P(0, -24, A('kid', 'happy'), '', 0, .9) +
              P(-40, -20, '<line x1="0" y1="0" x2="10" y2="-14" stroke="#8b93a3" stroke-width="4" stroke-linecap="round"/>')) +
            qmark(300, 170)) },
        { minDur: 6400, sub: '船走了很遠才靠岸。他立刻從刻記號的地方，跳進水裡撈劍。',
          html: scene(RIVER + '<ellipse cx="740" cy="330" rx="150" ry="60" fill="#b8e08e"/>' +
            P(560, 262, BOAT + P(-58, 12, MARK)) +
            P(460, 296, A('kid', 'wow'), '', 0, .9, true) + SPLASH.replace('<g class="st-bang">', '<g class="st-bang" transform="translate(460,290)">')) },
        { minDur: 6800, sub: '撈了半天，什麼也撈不到——船一直往前走，劍卻早就沉在原來的江心呀！',
          html: scene(RIVER + P(560, 262, BOAT + P(-58, 12, MARK)) +
            P(460, 300, A('kid', 'sad'), '', 0, .9) + sweat(430, 210) + qmark(500, 180) +
            P(150, 330, SWORD, '', 0, .9)) },
        { minDur: 6000, sub: '刻舟求劍：比喻拘泥固執，不知隨情勢變通。',
          html: scene(RIVER + P(400, 262, BOAT + P(-58, 12, MARK) + P(20, -24, A('kid', 'happy'), '', 0, .9)) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">刻舟求劍</text>') }
      ];
    },
    /* 愚公移山 */
    i042: function () {
      function mt(w, h, fill) {
        return '<path d="M-' + w + ' 0 L0 -' + h + ' L' + w + ' 0 Z" fill="' + fill + '"/>' +
          '<path d="M0 -' + h + ' L-' + Math.round(w * .18) + ' -' + Math.round(h * .78) + ' L0 -' + Math.round(h * .7) + ' L' + Math.round(w * .18) + ' -' + Math.round(h * .76) + ' Z" fill="#eef4f0"/>';
      }
      var MTS = P(300, 302, mt(150, 190, '#8fb0a0')) + P(520, 302, mt(130, 150, '#a5c2b2'));
      return [
        { minDur: 6600, sub: '愚公家門口擋著兩座大山，一家人出門，都得繞好遠好遠的路。',
          html: scene(MTS +
            '<path d="M120 310 q120 24 300 20 q220 -6 330 -18" stroke="#e8dcc0" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="14 12"/>' +
            P(110, 296, A('kid', 'sad'), 'st-inL', 0, .95) + sweat(140, 210) + qmark(80, 190)) },
        { minDur: 6800, sub: '愚公召集全家：「我們一起把山移走吧！」大家拿起鋤頭，一擔一擔把石土挑走。',
          html: scene(MTS +
            P(110, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe')) +
            P(660, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe'), '', .4, .9) +
            P(720, 320, '<ellipse cx="0" cy="0" rx="22" ry="9" fill="#b0a390"/><ellipse cx="-6" cy="-6" rx="8" ry="5" fill="#9c8468"/><ellipse cx="8" cy="-5" rx="7" ry="5" fill="#8a7a66"/>')) },
        { minDur: 7400, sub: '智叟笑他：「你這麼老了，怎麼可能移得完？」愚公說：「我還有兒子、孫子，子子孫孫挖下去，總有一天挖得完！」',
          html: scene(MTS +
            P(110, 302, A('kid', 'wow'), '', 0, .95) + qmark(80, 190) +
            P(690, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(16, -30, HOE, 'st-hoe') + '</g>', '', 0, .95, true)) },
        { minDur: 6600, sub: '天帝被愚公的決心感動了，派天神把兩座大山，一座一座背走了！',
          html: scene(P(280, 160, '<g class="st-fly">' + mt(110, 130, '#8fb0a0') + '</g>') +
            P(560, 120, '<g class="st-fly" style="animation-delay:.5s">' + mt(90, 104, '#a5c2b2') + '</g>') +
            P(200, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(600, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', .3, .9) + hearts(400, 220)) },
        { minDur: 6000, sub: '愚公移山：比喻意志堅強，終能成功。',
          html: scene(P(650, 302, mt(110, 130, '#a5c2b2')) + P(250, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">愚公移山</text>') }
      ];
    },
    /* 杯弓蛇影 */
    i044: function () {
      var WALLBG = '<rect x="-200" y="-190" width="400" height="190" rx="8" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="4"/>';
      var BOW = '<path d="M0 -42 q30 22 0 42" fill="none" stroke="#a8734a" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="0" y1="-42" x2="0" y2="0" stroke="#d9cbb0" stroke-width="2.4"/>';
      var TABLE = '<rect x="-64" y="-34" width="128" height="12" rx="5" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<line x1="-50" y1="-22" x2="-50" y2="0" stroke="#a8734a" stroke-width="6"/><line x1="50" y1="-22" x2="50" y2="0" stroke="#a8734a" stroke-width="6"/>';
      function cup(withSnake) {
        var s = '<path d="M-14 0 L-10 -22 L10 -22 L14 0 Z" fill="#e8f0f8" stroke="#9fb4c7" stroke-width="2.4"/>' +
          '<ellipse cx="0" cy="-22" rx="10" ry="3.6" fill="#c8dcc8"/>';
        if (withSnake) s += '<path d="M-6 -22 q3 -4 6 0 q3 4 6 0" fill="none" stroke="#5a7a48" stroke-width="2.6" stroke-linecap="round"/>';
        return s;
      }
      return [
        { minDur: 6600, sub: '主人請朋友到家裡喝酒。牆上掛著一張弓，弓的影子，正好落在朋友的酒杯裡。',
          html: scene(P(400, 300, WALLBG + P(60, -120, BOW) + P(0, 0, TABLE) + P(-20, -34, cup(true), '', 0, .9)) +
            P(160, 302, A('kid', 'happy')) + P(640, 302, A('kid', 'happy'), '', 0, .95, true)) },
        { minDur: 6600, sub: '朋友舉杯正要喝，忽然看見杯子裡好像有一條小蛇在游動，嚇了一大跳！',
          html: scene(P(400, 300, WALLBG + P(60, -120, BOW) + P(0, 0, TABLE)) +
            P(620, 302, A('kid', 'wow') + P(-34, -62, cup(true), '', 0, 1.3), '', 0, 1, true) +
            sweat(560, 200) + bang(430, 190)) },
        { minDur: 7000, sub: '他硬著頭皮把酒喝下肚，回家越想越害怕：「我把蛇喝進肚子裡了！」竟然嚇得生了病。',
          html: scene(P(560, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') +
            sweat(600, 210) + zzz(500, 190) +
            P(300, 180, '<g class="st-zfloat"><path d="M-12 0 q6 -8 12 0 q6 8 12 0" fill="none" stroke="#9ccc65" stroke-width="4" stroke-linecap="round"/></g>') +
            qmark(350, 150), 'night') },
        { minDur: 7000, sub: '主人知道後請他再來，指著牆說：「杯裡哪有蛇？那是弓的影子呀！」朋友一看，病立刻就好了。',
          html: scene(P(400, 300, WALLBG + P(60, -120, BOW) + P(0, 0, TABLE) + P(-20, -34, cup(false), '', 0, .9) +
              '<line x1="60" y1="-118" x2="-16" y2="-40" stroke="#ffd97a" stroke-width="3" stroke-dasharray="7 7"/>') +
            P(160, 302, A('kid', 'happy')) + P(640, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .95, true) +
            hearts(690, 200)) },
        { minDur: 6000, sub: '杯弓蛇影：比喻過度疑心，自相驚擾。',
          html: scene(P(400, 280, TABLE + P(0, -34, cup(true), '', 0, 1.2) + P(90, -80, BOW)) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">杯弓蛇影</text>') }
      ];
    },
    /* 濫竽充數 */
    i237: function () {
      var YU = '<g stroke="#a8734a" stroke-width="3.6" stroke-linecap="round">' +
        '<line x1="-9" y1="-34" x2="-9" y2="-58"/><line x1="-3" y1="-34" x2="-3" y2="-64"/>' +
        '<line x1="3" y1="-34" x2="3" y2="-60"/><line x1="9" y1="-34" x2="9" y2="-54"/></g>' +
        '<path d="M-14 -34 h28 q2 12 -14 12 q-16 0 -14 -12 z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"/>';
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      function player(x, sc, dly, fake) {
        return P(x, 302, A('kid', fake ? 'wow' : 'happy') + P(26, -20, YU) + (fake ? sweat(-26, -90) : ''), '', dly, sc);
      }
      return [
        { minDur: 7000, sub: '齊宣王愛聽吹竽，一定要三百人一起大合奏。南郭先生根本不會吹，也混了進去領賞。',
          html: scene(P(120, 302, A('kid', 'happy') + CROWN) +
            player(320, .85, 0) + player(440, .85, .2) + player(560, .85, .4) +
            player(680, .85, 0, true) + notes(430, 160)) },
        { minDur: 6800, sub: '合奏時，他捧著竽裝模作樣，跟著搖頭晃腦，日子過得舒舒服服。',
          html: scene(P(120, 302, A('kid', 'happy') + CROWN) + hearts(170, 190) +
            player(340, .9, 0) + player(480, .9, .3) + notes(400, 150) +
            P(640, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(26, -20, YU) + '</g>', '', 0, .9)) },
        { minDur: 6400, sub: '後來齊宣王去世，新王即位。新王的口味不一樣——他喜歡聽人一個一個獨奏！',
          html: scene(P(120, 302, A('kid', 'angry') + CROWN) +
            player(430, 1, 0) + notes(480, 150) +
            P(660, 302, A('kid', 'wow') + P(26, -20, YU), '', 0, .85) + sweat(630, 200)) },
        { minDur: 6600, sub: '快輪到南郭先生獨奏了——他一個音也吹不出來，只好連夜收拾包袱，偷偷逃走了。',
          html: scene(P(500, 302, '<g class="st-fleeR">' + A('kid', 'wow') +
              P(-30, -70, '<circle cx="0" cy="0" r="12" fill="#e8c48f" stroke="#c9a066" stroke-width="2.4"/><line x1="8" y1="-8" x2="22" y2="-22" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>') +
              '</g>', 'st-dashL') + sweat(460, 200) + zzz(150, 180), 'night') },
        { minDur: 6000, sub: '濫竽充數：沒有真本領的人，混在行家中充數。',
          html: scene(P(300, 302, A('kid', 'happy') + P(26, -20, YU)) + P(520, 302, A('kid', 'wow') + P(26, -20, YU), '', 0, .9) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">濫竽充數</text>') }
      ];
    },
    /* 塞翁失馬 */
    i245: function () {
      return [
        { minDur: 6600, sub: '邊塞的老翁養了一匹馬。有一天，馬兒忽然跑掉了，鄰居都來安慰他。',
          html: scene(P(620, 302, A('horse'), 'st-fleeR') +
            P(200, 302, A('kid', 'happy')) + P(330, 302, A('kid', 'sad'), '', 0, .9) + sweat(360, 205)) },
        { minDur: 6200, sub: '老翁卻不著急：「馬跑掉了，怎麼知道不是好事呢？」大家聽得一頭霧水。',
          html: scene(P(200, 302, A('kid', 'happy')) + P(330, 302, A('kid', 'wow'), '', 0, .9) +
            qmark(370, 185) + qmark(250, 165)) },
        { minDur: 6800, sub: '過了幾個月，那匹馬自己回來了，身邊還跟著一匹駿馬！鄰居們都跑來道賀。',
          html: scene(P(520, 302, A('horse'), 'st-inR') + P(660, 302, A('horse'), 'st-inR', .3, .9) +
            P(200, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(330, 302, A('kid', 'happy'), '', 0, .9) + hearts(420, 180)) },
        { minDur: 7000, sub: '老翁又說：「白白得了一匹馬，怎麼知道不是壞事呢？」果然，兒子騎新馬時摔了下來，跌斷了腿。',
          html: scene(P(540, 302, A('horse')) +
            P(400, 306, '<g class="st-faint">' + A('kid', 'wow') + '</g>') + bang(430, 230) +
            P(180, 302, A('kid', 'happy')) + sweat(370, 230)) },
        { minDur: 7400, sub: '後來戰爭爆發，年輕人都被徵召上戰場；兒子卻因為腿傷留在家裡，保住了性命。禍福，真的說不準呀！',
          html: scene(P(120, 302, A('kid', 'angry') + P(26, -50, '<line x1="0" y1="10" x2="0" y2="-40" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -52 l-7 14 h14 z" fill="#8b93a3"/>'), 'st-fleeR', 0, .9) +
            P(230, 302, A('kid', 'angry') + P(26, -50, '<line x1="0" y1="10" x2="0" y2="-40" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -52 l-7 14 h14 z" fill="#8b93a3"/>'), 'st-fleeR', .3, .85) +
            P(560, 302, A('kid', 'happy')) + P(680, 302, A('horse'), '', 0, .9) + hearts(620, 190)) },
        { minDur: 6200, sub: '塞翁失馬：禍福無常，壞事也可能帶來好結果。',
          html: scene(P(280, 302, A('kid', 'happy')) + P(520, 302, A('horse')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">塞翁失馬</text>') }
      ];
    },
    /* 葉公好龍 */
    i1007: function () {
      function drgPic(x, y, sc) {
        return P(x, y, '<path d="M-24 6 q13 -16 31 -7 q13 7 5 16 q-6 7 -18 3" fill="none" stroke="#e8b84a" stroke-width="6" stroke-linecap="round"/>' +
          '<circle cx="-26" cy="3" r="7" fill="#e8b84a"/><circle cx="-28" cy="2" r="2" fill="#3a2e26"/>' +
          '<path d="M-31 -4 l-2 -6 l5 4 z" fill="#c98f2a"/>', '', 0, sc || 1);
      }
      var HOUSE = '<rect x="-190" y="-180" width="380" height="180" rx="8" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="4"/>' +
        '<rect x="60" y="-120" width="90" height="70" rx="6" fill="#aee3f5" stroke="#a8734a" stroke-width="5"/>' +
        '<line x1="105" y1="-120" x2="105" y2="-50" stroke="#a8734a" stroke-width="4"/>';
      return [
        { minDur: 6800, sub: '葉公最愛龍了：衣服上繡著龍、柱子上刻著龍、牆上畫滿了龍。',
          html: scene(P(400, 300, HOUSE + drgPic(-110, -130, .95) + drgPic(-30, -70, .85) + drgPic(-120, -40, .8)) +
            P(620, 302, A('kid', 'happy') +
              '<path d="M-12 -30 q6 -6 14 -2 q6 4 2 9" fill="none" stroke="#e8b84a" stroke-width="3" stroke-linecap="round"/>') +
            hearts(560, 180)) },
        { minDur: 6400, sub: '天上的真龍聽說了，很感動：「他這麼喜歡我，我去拜訪他吧！」',
          html: scene(P(340, 150, A('dragon'), '', 0, 1.2) + hearts(420, 100) +
            P(400, 340, '<ellipse cx="0" cy="0" rx="420" ry="40" fill="#c9dff0" opacity=".5"/>')) },
        { minDur: 7000, sub: '真龍把頭探進窗戶，尾巴拖到廳堂——葉公一看是真龍，嚇得臉色發白，轉頭就逃！',
          html: scene(P(400, 300, HOUSE + drgPic(-110, -130, .95) + drgPic(-120, -40, .8)) +
            P(500, 218, A('dragon'), '', 0, 1.1) + bang(560, 140) +
            P(250, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL') + sweat(300, 200)) },
        { minDur: 6400, sub: '真龍失望地飛走了。原來葉公喜歡的，只是畫上的假龍，不是真的龍呀！',
          html: scene(P(400, 300, HOUSE + drgPic(-30, -70, .85)) +
            P(240, 140, A('dragon'), 'st-fleeR') + sweat(300, 120) +
            P(640, 302, A('kid', 'sad'), '', 0, .95, true) + qmark(690, 190)) },
        { minDur: 6200, sub: '葉公好龍：比喻表面上愛好某事物，其實並非真的愛好。',
          html: scene(P(300, 190, A('dragon')) + P(540, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">葉公好龍</text>') }
      ];
    },
    /* 朝三暮四 */
    i239: function () {
      function acorn(x, y) {
        return P(x, y, '<ellipse cx="0" cy="2" rx="7" ry="8" fill="#c9a06c"/>' +
          '<path d="M-7 -2 q7 -6 14 0 l-1 3 h-12 z" fill="#8a5a33"/><line x1="0" y1="-5" x2="0" y2="-9" stroke="#8a5a33" stroke-width="2.4" stroke-linecap="round"/>');
      }
      function acornRow(x, y, n) { var s = ''; for (var i = 0; i < n; i++) s += acorn(x + i * 26, y); return s; }
      var SUNICO = '<circle cx="0" cy="0" r="13" fill="#ffdd66" stroke="#f5b73e" stroke-width="2.4"/>';
      var MOONICO = '<path d="M6 -11 A13 13 0 1 0 11 7 A10 10 0 1 1 6 -11 Z" fill="#f4f1de" stroke="#d8d4bd" stroke-width="2"/>';
      var BASKET = '<path d="M-26 0 q0 18 26 18 q26 0 26 -18 z" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<path d="M-26 0 q26 -22 52 0" fill="none" stroke="#a8734a" stroke-width="4"/>';
      return [
        { minDur: 6600, sub: '養猴人養了一群猴子，家裡的橡實快不夠吃了，只好跟猴子們商量減量。',
          html: scene(P(200, 302, A('kid', 'sad') + P(50, -6, BASKET + acorn(-8, -8) + acorn(10, -10))) + sweat(150, 200) +
            P(460, 302, A('monkey')) + P(580, 302, A('monkey'), '', .3, .9) + P(690, 302, A('monkey'), '', .5, .85)) },
        { minDur: 7000, sub: '他說：「以後橡實早上給三顆、晚上給四顆，好嗎？」猴子們一聽，氣得又蹦又跳，大吵大鬧！',
          html: scene(P(150, 160, SUNICO) + acornRow(185, 160, 3) +
            P(150, 210, MOONICO) + acornRow(185, 210, 4) +
            P(200, 302, A('kid', 'happy')) +
            P(470, 302, A('monkey')) + P(580, 302, A('monkey'), '', .2, .9) + P(690, 302, A('monkey'), '', .4, .85) +
            bang(560, 200) + sweat(640, 190)) },
        { minDur: 6800, sub: '他改口說：「那——早上給四顆、晚上給三顆！」猴子們以為變多了，開心得拍手歡呼！',
          html: scene(P(150, 160, SUNICO) + acornRow(185, 160, 4) +
            P(150, 210, MOONICO) + acornRow(185, 210, 3) +
            P(200, 302, A('kid', 'happy')) +
            P(470, 302, '<g class="st-cheer">' + A('monkey') + '</g>') +
            P(580, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('monkey') + '</g>', '', 0, .9) +
            P(690, 302, '<g class="st-cheer" style="animation-delay:.4s">' + A('monkey') + '</g>', '', 0, .85) +
            hearts(600, 170)) },
        { minDur: 6800, sub: '其實早三晚四、早四晚三，一天都是七顆，一顆也沒變多呀！猴子們被數字騙得團團轉。',
          html: scene(P(230, 150, SUNICO) + acornRow(265, 150, 4) + P(230, 205, MOONICO) + acornRow(265, 205, 3) +
            '<text x="530" y="185" font-size="34" font-weight="bold" fill="#4a3200">＝ 7 顆</text>' +
            P(200, 302, A('kid', 'happy')) + P(520, 302, A('monkey')) + qmark(570, 200)) },
        { minDur: 6200, sub: '朝三暮四：本指用詐術欺人，後比喻反覆無常。',
          html: scene(P(280, 302, A('kid', 'happy')) + P(520, 302, A('monkey')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">朝三暮四</text>') }
      ];
    },
    /* 東施效顰 */
    i246: function () {
      var CHEST = '<circle cx="-8" cy="-24" r="7" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '美女西施心口疼，皺著眉、捂著胸口走在街上。大家看了都說：「連皺眉的樣子都這麼美！」',
          html: scene(P(300, 302, A('kid', 'sad') + CHEST) +
            P(560, 302, A('kid', 'happy'), '', 0, .95, true) + P(670, 302, A('kid', 'happy'), '', .3, .9, true) +
            hearts(480, 180) + hearts(620, 160)) },
        { minDur: 6200, sub: '鄰居東施看見了，心想：「原來皺眉捂胸這麼美，我也來學一學！」',
          html: scene(P(300, 302, A('kid', 'sad') + CHEST, '', 0, .9) +
            P(600, 302, A('kid', 'wow'), '', 0, 1, true) + qmark(650, 180) + hearts(560, 200)) },
        { minDur: 7000, sub: '東施也捂著胸口、皺起眉頭在街上走——村裡的人一看，嚇得逃跑的逃跑、關門的關門！',
          html: scene(P(300, 302, A('kid', 'angry') + CHEST) +
            P(560, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .95) +
            P(690, 302, '<g class="st-fleeR" style="animation-delay:.2s">' + A('kid', 'wow') + '</g>', 'st-dashL', .2, .9) +
            sweat(520, 200) + bang(430, 180)) },
        { minDur: 6800, sub: '東施不知道：西施美的是天生的模樣，不是皺眉這個動作。盲目模仿，反而更不好看了呀！',
          html: scene(P(300, 302, A('kid', 'sad') + CHEST) + sweat(340, 200) + qmark(260, 180)) },
        { minDur: 6200, sub: '東施效顰：盲目模仿別人，反而弄巧成拙。',
          html: scene(P(300, 302, A('kid', 'sad') + CHEST) + P(540, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">東施效顰</text>') }
      ];
    },
    /* 驚弓之鳥 */
    i854: function () {
      var BOW2 = '<path d="M0 -46 q32 24 0 46" fill="none" stroke="#a8734a" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="0" y1="-46" x2="0" y2="0" stroke="#d9cbb0" stroke-width="2.6"/>';
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 7200, sub: '神射手更羸陪魏王出遊，指著天上一隻飛得又慢又低的大雁說：「我不用箭，只拉一下弓弦，就能讓牠掉下來！」',
          html: scene(P(560, 150, A('bird')) +
            P(180, 302, A('kid', 'happy') + CROWN) + qmark(230, 190) +
            P(340, 302, A('kid', 'happy') + P(30, -40, BOW2, '', 0, .8))) },
        { minDur: 6200, sub: '只聽「嘣」的一聲弦響——那隻大雁真的從空中掉了下來！',
          html: scene(P(340, 302, A('kid', 'happy') + P(30, -40, BOW2, '', 0, .8)) + bang(390, 220) +
            P(600, 292, '<g class="st-faint">' + A('bird') + '</g>', 'st-dashL') +
            P(180, 302, A('kid', 'wow') + CROWN) + sweat(230, 200)) },
        { minDur: 7000, sub: '魏王大吃一驚。更羸解釋：「這隻雁受過箭傷，傷口還沒好，又離了群，叫聲才那麼悲哀。」',
          html: scene(P(180, 302, A('kid', 'wow') + CROWN) + qmark(140, 190) +
            P(360, 302, A('kid', 'happy')) +
            P(600, 296, A('bird') + '<rect x="-4" y="-52" width="14" height="7" rx="3.5" fill="#fff" stroke="#e3dcd4" stroke-width="1.6" transform="rotate(-18)"/>') +
            sweat(640, 220)) },
        { minDur: 7200, sub: '「牠一聽到弦聲，以為又有箭射來，嚇得拚命往高處飛，一用力，舊傷裂開，就掉下來了。」',
          html: scene(P(560, 120, A('bird')) + sweat(600, 90) + bang(500, 80) +
            P(340, 302, A('kid', 'happy') + P(30, -40, BOW2, '', 0, .8)) +
            P(180, 302, A('kid', 'happy') + CROWN)) },
        { minDur: 6200, sub: '驚弓之鳥：比喻受過驚嚇、遇事就害怕的人。',
          html: scene(P(540, 180, A('bird')) + P(260, 302, A('kid', 'happy') + P(30, -40, BOW2, '', 0, .8)) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">驚弓之鳥</text>') }
      ];
    },
    /* 望梅止渴 */
    i1015: function () {
      var PLUMTREE = TREE + '<circle cx="-12" cy="-66" r="5" fill="#ff8a80"/><circle cx="10" cy="-58" r="5" fill="#ff8a80"/><circle cx="0" cy="-74" r="5" fill="#a5d47c"/><circle cx="18" cy="-68" r="5" fill="#ff8a80"/>';
      function soldier(x, dly, sc, cls) {
        return P(x, 302, A('kid', cls === 'sad' ? 'sad' : 'happy'), cls === 'sad' ? '' : 'st-strut', dly, sc);
      }
      return [
        { minDur: 6800, sub: '曹操帶兵急行軍。烈日當空，水早就喝光了，士兵們又渴又累，一步也走不動了。',
          html: scene(P(200, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') +
            P(340, 302, '<g class="st-slump" style="animation-delay:.3s">' + A('kid', 'sad') + '</g>', '', 0, .9) +
            P(470, 302, '<g class="st-slump" style="animation-delay:.5s">' + A('kid', 'sad') + '</g>', '', 0, .85) +
            sweat(240, 200) + sweat(380, 210) + sweat(500, 205) +
            P(660, 302, A('kid', 'happy'))) },
        { minDur: 6800, sub: '曹操心生一計，指著前方大聲說：「前面有一大片梅林，梅子又酸又甜，大家快走呀！」',
          html: scene(P(660, 302, A('kid', 'happy')) +
            P(560, 180, '<circle cx="0" cy="0" r="52" fill="#fff" opacity=".85"/>' + P(0, 34, PLUMTREE, '', 0, .72)) +
            P(200, 302, A('kid', 'wow')) + P(340, 302, A('kid', 'wow'), '', 0, .9) + qmark(260, 190)) },
        { minDur: 6800, sub: '士兵們一聽到酸梅子，口水都流出來了，覺得沒那麼渴，精神大振，加快腳步往前走！',
          html: scene(soldier(180, 0, 1) + soldier(320, .2, .9) + soldier(450, .4, .85) +
            P(660, 302, A('kid', 'happy')) + hearts(400, 170) + notes(250, 150)) },
        { minDur: 6400, sub: '靠著想像中的梅子，大軍一路撐到了有水的地方，人人喝了個痛快。',
          html: scene('<rect y="286" width="800" height="54" fill="#7fb2e0"/>' +
            '<g class="st-wavemove"><path d="M-40 294 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>' +
            P(240, 296, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(420, 296, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            hearts(330, 180)) },
        { minDur: 6200, sub: '望梅止渴：比喻用空想安慰自己，願望無法真正實現。',
          html: scene(P(620, 302, PLUMTREE, '', 0, 1.2) + P(300, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">望梅止渴</text>') }
      ];
    },
    /* 聞雞起舞 */
    i113: function () {
      var SWORD2 = '<line x1="0" y1="0" x2="26" y2="-40" stroke="#c4cede" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="4" y1="-12" x2="14" y2="-4" stroke="#c98f2a" stroke-width="4" stroke-linecap="round"/>';
      var BED = '<rect x="-90" y="-18" width="180" height="18" rx="6" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<rect x="-84" y="-34" width="52" height="18" rx="8" fill="#f4ecd8" stroke="#ddd2b8" stroke-width="2"/>' +
        '<rect x="-30" y="-32" width="116" height="16" rx="7" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '晉朝的祖逖和好友劉琨，立志報效國家。兩人同睡一張床，天天互相勉勵。',
          html: scene(P(400, 302, BED + P(-10, -30, '<circle cx="0" cy="0" r="15" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>', '', 0, .9) +
              P(46, -30, '<circle cx="0" cy="0" r="15" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>', '', 0, .9)) +
            zzz(480, 220) + zzz(330, 230), 'night') },
        { minDur: 6600, sub: '半夜，雞叫了！祖逖一骨碌爬起來，推醒劉琨：「聽！雞在叫我們起床練劍了！」',
          html: scene(P(660, 302, A('chicken')) + notes(620, 190) +
            P(330, 302, A('kid', 'happy')) + P(450, 302, A('kid', 'wow'), '', 0, .95) +
            qmark(490, 190) + bang(600, 150), 'night') },
        { minDur: 6600, sub: '兩人翻身下床，在院子裡拔劍起舞，一招一式，勤練武藝。',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(24, -40, SWORD2) + '</g>') +
            P(540, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + P(24, -40, SWORD2) + '</g>', '', 0, .95, true) +
            P(700, 302, A('chicken'), '', 0, .85), 'night') },
        { minDur: 6800, sub: '從此不論寒冬酷暑，天天雞鳴即起，從不間斷。後來兩人都成了保家衛國的大將軍！',
          html: scene('<g fill="#fff"><circle class="st-snow" cx="160" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1.2s" cx="330" cy="20" r="3.4"/>' +
            '<circle class="st-snow" style="animation-delay:.5s" cx="470" cy="36" r="4"/><circle class="st-snow" style="animation-delay:1.7s" cx="560" cy="24" r="3"/></g>' +
            P(300, 302, A('kid', 'happy') + P(24, -40, SWORD2)) +
            P(520, 302, A('kid', 'happy') + P(24, -40, SWORD2), '', 0, .95) + hearts(410, 170)) },
        { minDur: 6200, sub: '聞雞起舞：一聽到雞叫就起身練習，比喻立志發奮。',
          html: scene(P(280, 302, A('kid', 'happy') + P(24, -40, SWORD2)) + P(560, 302, A('chicken')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">聞雞起舞</text>') }
      ];
    },
    /* 老馬識途 */
    i051: function () {
      function mt2(w, h, fill) {
        return '<path d="M-' + w + ' 0 L0 -' + h + ' L' + w + ' 0 Z" fill="' + fill + '"/>';
      }
      var VALLEY = P(120, 302, mt2(140, 170, '#8fb0a0')) + P(680, 302, mt2(150, 190, '#8fb0a0')) + P(400, 302, mt2(110, 120, '#a5c2b2'));
      var SNOWFX = '<g fill="#fff"><circle class="st-snow" cx="160" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1.2s" cx="330" cy="20" r="3.4"/>' +
        '<circle class="st-snow" style="animation-delay:.5s" cx="470" cy="36" r="4"/><circle class="st-snow" style="animation-delay:1.7s" cx="600" cy="24" r="3"/></g>';
      return [
        { minDur: 6600, sub: '齊桓公出兵遠征，回程時大軍在山谷裡迷了路，怎麼繞都繞不出去。',
          html: scene(VALLEY + P(300, 302, A('kid', 'wow'), '', 0, .95) + P(430, 302, A('kid', 'sad'), '', .3, .9) +
            qmark(350, 180) + sweat(460, 210)) },
        { minDur: 6400, sub: '天寒地凍，雪越下越大，糧食也越來越少，大家都急壞了。',
          html: scene(VALLEY + SNOWFX +
            P(300, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, .95) +
            P(430, 302, '<g class="st-slump" style="animation-delay:.3s">' + A('kid', 'sad') + '</g>', '', 0, .9) +
            sweat(340, 200)) },
        { minDur: 7000, sub: '管仲想到辦法：「老馬走過的路多，一定認得回家的路！」於是解開一匹老馬，讓牠在前面帶路。',
          html: scene(VALLEY + P(260, 302, A('horse'), 'st-strut') +
            P(450, 302, A('kid', 'happy'), '', 0, .95) + P(570, 302, A('kid', 'happy'), '', .3, .9) +
            hearts(380, 190)) },
        { minDur: 6600, sub: '大軍跟著老馬走，果然一步步走出了山谷，平安回到了齊國！',
          html: scene(P(680, 302, mt2(120, 140, '#a5c2b2')) +
            P(200, 302, A('horse'), 'st-strut') +
            P(380, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            P(500, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            hearts(300, 180)) },
        { minDur: 6200, sub: '老馬識途：比喻經驗豐富的人，有能力解決問題。',
          html: scene(P(300, 302, A('horse')) + P(540, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">老馬識途</text>') }
      ];
    },
    /* 三顧茅廬 */
    i243: function () {
      var HUT = '<path d="M-90 -70 L0 -130 L90 -70 Z" fill="#c9a06c" stroke="#a8734a" stroke-width="4"/>' +
        '<g stroke="#a8734a" stroke-width="2.4"><line x1="-60" y1="-90" x2="-52" y2="-70"/><line x1="-20" y1="-116" x2="-14" y2="-70"/><line x1="30" y1="-110" x2="36" y2="-70"/></g>' +
        '<rect x="-74" y="-70" width="148" height="70" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>' +
        '<rect x="-22" y="-52" width="44" height="52" rx="4" fill="#8a5a33"/>';
      var SNOWFX = '<g fill="#fff"><circle class="st-snow" cx="160" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1.2s" cx="330" cy="20" r="3.4"/>' +
        '<circle class="st-snow" style="animation-delay:.5s" cx="470" cy="36" r="4"/><circle class="st-snow" style="animation-delay:1.7s" cx="600" cy="24" r="3"/></g>';
      return [
        { minDur: 7000, sub: '劉備聽說臥龍先生諸葛亮是難得的賢才，親自到茅廬拜訪——可惜先生出遠門了，撲了個空。',
          html: scene(P(550, 302, HUT) + P(250, 302, A('kid', 'happy'), 'st-inL') +
            qmark(300, 190) + sweat(220, 210)) },
        { minDur: 7000, sub: '過了些日子，劉備冒著大雪第二次拜訪——還是沒見到人。同行的關羽、張飛都等得不耐煩了。',
          html: scene(P(550, 302, HUT) + SNOWFX +
            P(220, 302, A('kid', 'sad')) +
            P(110, 302, A('kid', 'angry'), '', 0, .9) + P(330, 302, A('kid', 'angry'), '', .3, .9) +
            bang(140, 190)) },
        { minDur: 7200, sub: '第三次再去，諸葛亮正在午睡。劉備不敢驚動，恭恭敬敬地站在門外，一直等到先生睡醒。',
          html: scene(P(550, 302, HUT) + zzz(560, 190) +
            P(300, 302, A('kid', 'happy')) +
            P(140, 302, A('kid', 'angry'), '', 0, .85) + sweat(170, 215)) },
        { minDur: 6800, sub: '諸葛亮被劉備的誠意感動，答應出山相助，後來幫他三分天下，成就一番大業！',
          html: scene(P(550, 302, HUT) +
            P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(470, 302, A('kid', 'happy') + '<path d="M-16 -86 q16 -12 32 0" stroke="#8a5a33" stroke-width="3" fill="none" stroke-linecap="round"/>', 'st-inR', 0, .95) +
            hearts(390, 180)) },
        { minDur: 6200, sub: '三顧茅廬：比喻誠心誠意，一再邀請賢才。',
          html: scene(P(550, 302, HUT, '', 0, .9) + P(260, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">三顧茅廬</text>') }
      ];
    },
    /* 打草驚蛇 */
    i247: function () {
      var COIN = '<circle cx="0" cy="0" r="10" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/><rect x="-3.4" y="-3.4" width="6.8" height="6.8" fill="none" stroke="#c98f2a" stroke-width="2"/>';
      var PAPER = '<rect x="-20" y="-30" width="40" height="56" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<g stroke="#8fa3bf" stroke-width="2.4"><line x1="-12" y1="-18" x2="12" y2="-18"/><line x1="-12" y1="-6" x2="12" y2="-6"/><line x1="-12" y1="6" x2="12" y2="6"/></g>';
      var GRASS = '<g stroke="#5f8a46" stroke-width="5" fill="none" stroke-linecap="round">' +
        '<path d="M-40 0 q-6 -30 -16 -38 M-40 0 q4 -32 12 -40 M0 0 q-6 -26 -14 -32 M0 0 q6 -28 16 -36 M40 0 q-4 -30 -12 -36 M40 0 q6 -26 14 -32"/></g>';
      var STICK = '<line x1="0" y1="0" x2="34" y2="-48" stroke="#a8734a" stroke-width="5" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '縣官王魯愛貪錢，他的手下也跟著撈油水，百姓苦不堪言。',
          html: scene(P(280, 302, A('kid', 'happy') + P(36, -62, COIN) + P(52, -46, COIN, '', 0, .8)) +
            P(560, 302, A('kid', 'sad'), '', 0, .9) + P(670, 302, A('kid', 'sad'), '', .3, .85) + sweat(590, 205)) },
        { minDur: 6200, sub: '有一天，百姓們聯名寫了狀紙，控告他的手下貪汙。',
          html: scene(P(560, 302, A('kid', 'angry') + P(-40, -50, PAPER, '', 0, .9)) +
            P(670, 302, A('kid', 'angry'), '', .3, .9) +
            P(280, 302, A('kid', 'wow')) + qmark(240, 185)) },
        { minDur: 7200, sub: '王魯一看狀紙，嚇出一身冷汗：「這說的不就是我嗎？」提筆寫下：「你們雖然只是打草，我這條藏著的蛇，已經受驚了！」',
          html: scene(P(280, 302, A('kid', 'wow') + P(-40, -50, PAPER, '', 0, .9)) +
            sweat(230, 195) + sweat(330, 205) + bang(430, 170)) },
        { minDur: 7000, sub: '就像拿棍子打草，草叢裡的蛇受了驚，立刻竄逃——行動不保密，就會讓對方有了防備。',
          html: scene(P(300, 302, A('kid', 'happy') + P(20, -34, STICK, 'st-hoe')) +
            P(470, 318, GRASS) + bang(450, 240) +
            P(600, 302, '<g class="st-fleeR">' + A('snake') + '</g>', 'st-dashL') + sweat(640, 220)) },
        { minDur: 6200, sub: '打草驚蛇：行動不密，讓對方有所警覺防備。',
          html: scene(P(470, 318, GRASS) + P(280, 302, A('kid', 'happy') + P(20, -34, STICK)) + P(600, 302, A('snake')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">打草驚蛇</text>') }
      ];
    },
    /* 螳臂當車 */
    i251: function () {
      var MANTIS = '<g class="st-bob">' +
        '<ellipse cx="6" cy="-12" rx="15" ry="8" fill="#8fc866" stroke="#6da844" stroke-width="2"/>' +
        '<circle cx="-12" cy="-26" r="7" fill="#8fc866" stroke="#6da844" stroke-width="2"/>' +
        '<circle cx="-14" cy="-28" r="2" fill="#3a2e26"/>' +
        '<path d="M-16 -32 q-3 -6 -7 -7 M-9 -33 q1 -7 5 -8" stroke="#6da844" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M-18 -22 q-10 -6 -12 -16 l4 -2 q2 8 10 12 z M-6 -20 q-2 -12 4 -18 l4 3 q-5 6 -3 13 z" fill="#6da844"/>' +
        '<g stroke="#6da844" stroke-width="2.4" stroke-linecap="round"><line x1="2" y1="-5" x2="-2" y2="4"/><line x1="10" y1="-4" x2="10" y2="5"/><line x1="17" y1="-6" x2="22" y2="2"/></g></g>';
      function cart(sc) {
        return P(0, 0, '<circle cx="0" cy="-30" r="30" fill="#c9a06c" stroke="#a8734a" stroke-width="5"/>' +
          '<g stroke="#a8734a" stroke-width="4"><line x1="0" y1="-52" x2="0" y2="-8"/><line x1="-22" y1="-30" x2="22" y2="-30"/><line x1="-16" y1="-46" x2="16" y2="-14"/><line x1="16" y1="-46" x2="-16" y2="-14"/></g>' +
          '<rect x="-14" y="-92" width="120" height="44" rx="8" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>' +
          '<circle cx="86" cy="-30" r="30" fill="#c9a06c" stroke="#a8734a" stroke-width="5"/>' +
          '<g stroke="#a8734a" stroke-width="4"><line x1="86" y1="-52" x2="86" y2="-8"/><line x1="64" y1="-30" x2="108" y2="-30"/></g>' +
          '<line x1="-14" y1="-48" x2="-58" y2="-40" stroke="#a8734a" stroke-width="5" stroke-linecap="round"/>', '', 0, sc);
      }
      return [
        { minDur: 6400, sub: '齊莊公坐著馬車出遊，路中央有一隻小螳螂，看見大車轟隆隆地駛來。',
          html: scene(P(520, 302, cart(1) + P(150, 0, A('kid', 'happy') + '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>', '', 0, .9)) +
            P(200, 302, MANTIS) + qmark(240, 230)) },
        { minDur: 6600, sub: '螳螂不但不躲，反而氣呼呼地高高舉起雙臂，想擋住滾來的車輪！',
          html: scene(P(430, 302, cart(1.05)) +
            P(250, 302, MANTIS, '', 0, 1.2) + bang(330, 220) + sweat(210, 240)) },
        { minDur: 7200, sub: '莊公看了說：「這小蟲真勇敢，可惜不自量力。要是人有這股勇氣，必是天下勇士！」便叫車伕繞開牠走。',
          html: scene(P(520, 302, cart(1) + P(150, 0, A('kid', 'happy') + '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>', '', 0, .9)) +
            P(200, 302, MANTIS) + hearts(280, 210) +
            '<path d="M310 316 q-60 14 -140 8" stroke="#e8dcc0" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 10"/>') },
        { minDur: 6600, sub: '小小的臂膀，怎麼擋得住大車呢？不自量力去硬拚，只會白白送命呀。',
          html: scene(P(500, 302, cart(1.15)) + P(240, 302, MANTIS) +
            sweat(280, 240) + qmark(200, 220)) },
        { minDur: 6200, sub: '螳臂當車：比喻不自量力，去做辦不到的事。',
          html: scene(P(520, 302, cart(.95)) + P(240, 302, MANTIS, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">螳臂當車</text>') }
      ];
    },
    /* 畫餅充飢 */
    i252: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var DRAWNBING = '<circle cx="0" cy="0" r="26" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 8" opacity=".95"/>' +
        '<circle cx="-8" cy="-5" r="2.4" fill="#fff" opacity=".9"/><circle cx="7" cy="3" r="2.4" fill="#fff" opacity=".9"/><circle cx="2" cy="-9" r="2.4" fill="#fff" opacity=".9"/>';
      var REALBING = '<circle cx="0" cy="0" r="22" fill="#e8b84a" stroke="#c98f2a" stroke-width="3"/>' +
        '<circle cx="-7" cy="-4" r="2" fill="#8a5a33"/><circle cx="6" cy="3" r="2" fill="#8a5a33"/><circle cx="1" cy="-8" r="2" fill="#8a5a33"/><circle cx="-2" cy="7" r="2" fill="#8a5a33"/>';
      return [
        { minDur: 6400, sub: '魏文帝要選拔人才，對大臣盧毓說：「這一次選人，千萬不能只看名聲。」',
          html: scene(P(280, 302, A('kid', 'happy') + CROWN) +
            P(540, 302, A('kid', 'happy'), '', 0, .95, true)) },
        { minDur: 6800, sub: '「名聲就像畫在地上的餅，看起來又圓又香，肚子餓了，卻不能拿來吃呀！」',
          html: scene(P(430, 316, DRAWNBING) +
            P(240, 302, A('kid', 'happy') + CROWN) +
            P(620, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(660, 190)) },
        { minDur: 6600, sub: '肚子餓的人，就算把餅畫得再圓再大，畫上一百個，也填不飽肚子——',
          html: scene(P(300, 316, DRAWNBING) + P(430, 320, DRAWNBING, '', 0, .8) + P(540, 314, DRAWNBING, '', 0, .65) +
            P(180, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') +
            sweat(220, 205) + qmark(140, 185)) },
        { minDur: 6600, sub: '真正能填飽肚子的，是實實在在的餅。做事也一樣：空想和虛名，解決不了真正的問題。',
          html: scene(P(500, 302, A('kid', 'happy') + P(-38, -60, REALBING, '', 0, .9)) + hearts(560, 190) +
            P(240, 316, DRAWNBING, '', 0, .8) + P(180, 302, A('kid', 'happy'), '', 0, .9)) },
        { minDur: 6200, sub: '畫餅充飢：比喻用空想安慰自己，無濟於事。',
          html: scene(P(400, 306, DRAWNBING, '', 0, 1.25) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">畫餅充飢</text>') }
      ];
    },
    /* 四面楚歌 */
    i013: function () {
      var TENT = '<path d="M-46 0 L0 -64 L46 0 Z" fill="#c9a06c" stroke="#a8734a" stroke-width="4"/>' +
        '<path d="M-10 0 L0 -18 L10 0 Z" fill="#8a5a33"/>' +
        '<line x1="0" y1="-64" x2="0" y2="-84" stroke="#a8734a" stroke-width="4"/>' +
        '<path d="M0 -84 h26 l-7 7 l7 7 h-26 z" fill="#e85a4f"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      function enemy(x, sc, dly, flip) { return P(x, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', dly, sc, flip); }
      return [
        { minDur: 6800, sub: '楚漢相爭，項羽的軍隊被劉邦的大軍團團圍在垓下，糧食也快吃完了。',
          html: scene(P(400, 300, TENT) + P(400, 302, A('kid', 'angry'), '', 0, .95) +
            enemy(90, .8, 0) + enemy(210, .75, .2) + enemy(600, .75, .3, true) + enemy(710, .8, .1, true)) },
        { minDur: 6800, sub: '夜裡，四面八方忽然傳來楚國的歌聲——那是項羽士兵們家鄉的歌呀！',
          html: scene(P(400, 300, TENT) + P(400, 302, A('kid', 'wow'), '', 0, .95) +
            notes(120, 150) + notes(680, 140) + notes(250, 100) + notes(540, 110) + qmark(450, 180), 'night') },
        { minDur: 7000, sub: '楚軍士兵聽了，以為家鄉全被占領，個個想起家來——哭的哭、逃的逃，軍心全散了。',
          html: scene(P(400, 300, TENT) +
            P(280, 302, A('kid', 'sad'), '', 0, .85) + sweat(310, 210) +
            P(560, 302, '<g class="st-fleeR">' + A('kid', 'sad') + '</g>', 'st-dashL', 0, .85) +
            P(680, 302, '<g class="st-fleeR" style="animation-delay:.3s">' + A('kid', 'sad') + '</g>', 'st-dashL', .3, .8), 'night') },
        { minDur: 6600, sub: '項羽嘆道：「難道楚地全都失守了嗎？」孤立無援，大勢已去……',
          html: scene(P(400, 300, TENT) +
            P(400, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, .95) +
            qmark(450, 180) + sweat(360, 210), 'night') },
        { minDur: 6200, sub: '四面楚歌：處於四面受敵的孤立困境。',
          html: scene(P(400, 302, A('kid', 'sad'), '', 0, .95) +
            notes(150, 170) + notes(650, 160) + notes(300, 120) + notes(520, 130) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">四面楚歌</text>') }
      ];
    },
    /* 一鳴驚人 */
    i067: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var MOUND = '<ellipse cx="0" cy="0" rx="70" ry="26" fill="#b8a071"/><ellipse cx="0" cy="-6" rx="52" ry="16" fill="#c9b184"/>';
      return [
        { minDur: 6800, sub: '楚莊王即位三年，天天吃喝玩樂，什麼國事都不管，大臣們急壞了。',
          html: scene(P(300, 302, A('kid', 'happy') + CROWN + P(40, -66, JUG, '', 0, .8)) +
            notes(360, 170) + hearts(240, 180) +
            P(620, 302, A('kid', 'sad'), '', 0, .9) + sweat(650, 205)) },
        { minDur: 7000, sub: '大臣伍舉打了個謎語問他：「有隻大鳥停在山丘上，三年不飛也不叫，這是什麼鳥呢？」',
          html: scene(P(560, 316, MOUND) + P(560, 300, A('bird')) +
            P(200, 302, A('kid', 'happy'), '', 0, .95) + qmark(260, 180) +
            P(360, 302, A('kid', 'happy') + CROWN, '', 0, .95, true)) },
        { minDur: 7000, sub: '莊王笑著回答：「牠三年不飛，一飛沖天；三年不叫，一叫就要震驚所有人！」',
          html: scene(P(560, 130, A('bird'), '', 0, 1.2) + bang(640, 90) +
            '<path d="M560 280 Q570 200 560 150" stroke="#8fd0e8" stroke-width="4" fill="none" stroke-dasharray="8 8"/>' +
            P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + CROWN + '</g>')) },
        { minDur: 6600, sub: '從此莊王發憤治國、勤理朝政，楚國果然強盛起來，稱霸諸侯！',
          html: scene(P(300, 302, A('kid', 'happy') + CROWN) +
            P(540, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            P(660, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .85) +
            hearts(430, 170)) },
        { minDur: 6200, sub: '一鳴驚人：初次表現，就引起驚人的注意。',
          html: scene(P(540, 150, A('bird'), '', 0, 1.1) + P(280, 302, A('kid', 'happy') + CROWN) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一鳴驚人</text>') }
      ];
    },
    /* 臥薪嘗膽 */
    i263: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var BROOM = '<line x1="0" y1="0" x2="20" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M0 0 l-10 12 M0 0 l-2 14 M0 0 l6 13" stroke="#c9a06c" stroke-width="3.4" stroke-linecap="round"/>';
      var WOODPILE = '<g stroke="#a8734a" stroke-width="8" stroke-linecap="round"><line x1="-52" y1="-6" x2="52" y2="-6"/><line x1="-44" y1="-16" x2="44" y2="-16"/><line x1="-34" y1="-26" x2="34" y2="-26"/></g>';
      var GALL = '<line x1="0" y1="-52" x2="0" y2="-24" stroke="#8a7a66" stroke-width="2.4"/>' +
        '<path d="M0 -24 q-12 4 -12 16 q0 12 12 12 q12 0 12 -12 q0 -12 -12 -16 z" fill="#5f7a4a" stroke="#4a6238" stroke-width="2"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 6800, sub: '越國被吳國打敗，越王勾踐被抓去當了三年僕人，天天做苦工，受盡屈辱。',
          html: scene(P(300, 302, A('kid', 'sad') + P(20, -34, BROOM)) + sweat(260, 200) +
            P(600, 302, A('kid', 'angry') + CROWN, '', 0, 1, true)) },
        { minDur: 6600, sub: '回國以後，他不睡舒服的床，天天睡在柴薪上，屋裡還掛了一顆苦膽。',
          html: scene(P(360, 316, WOODPILE) +
            P(360, 296, '<ellipse cx="0" cy="-8" rx="34" ry="12" fill="#6fbf8e"/><circle cx="-28" cy="-16" r="13" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>') +
            P(560, 240, GALL) + zzz(300, 220), 'night') },
        { minDur: 6800, sub: '每天起床，他先嘗一口苦膽，提醒自己：「不要忘記戰敗的恥辱！」',
          html: scene(P(400, 302, A('kid', 'angry') + P(36, -70, GALL, '', 0, .9)) +
            sweat(340, 200) + bang(520, 170)) },
        { minDur: 6800, sub: '他勤練士兵、努力生產，越國一天天強大。十年後一舉打敗吳國，終於一雪前恥！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + CROWN + '</g>') +
            P(520, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + P(26, -50, SPEAR3) + '</g>', '', 0, .9) +
            P(650, 302, '<g class="st-cheer" style="animation-delay:.4s">' + A('kid', 'happy') + P(26, -50, SPEAR3) + '</g>', '', 0, .85) +
            hearts(420, 160)) },
        { minDur: 6200, sub: '臥薪嘗膽：刻苦自勵，發憤圖強，不忘雪恥。',
          html: scene(P(300, 316, WOODPILE) + P(520, 250, GALL, '', 0, 1.1) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">臥薪嘗膽</text>') }
      ];
    },
    /* 負荊請罪 */
    i264: function () {
      var THORNS = '<g transform="rotate(-24)"><line x1="-6" y1="-2" x2="34" y2="-2" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="-2" y1="4" x2="38" y2="4" stroke="#a8734a" stroke-width="5" stroke-linecap="round"/>' +
        '<g stroke="#8a5a33" stroke-width="2.4" stroke-linecap="round"><line x1="6" y1="-2" x2="3" y2="-9"/><line x1="16" y1="-2" x2="19" y2="-9"/><line x1="26" y1="-2" x2="23" y2="-9"/><line x1="12" y1="4" x2="12" y2="11"/><line x1="24" y1="4" x2="27" y2="11"/></g></g>';
      return [
        { minDur: 6800, sub: '藺相如立了大功，官位升得比大將軍廉頗還高。廉頗不服氣：「我要當面給他難看！」',
          html: scene(P(280, 302, A('kid', 'angry')) + bang(350, 180) +
            P(580, 302, A('kid', 'happy'), '', 0, .95, true)) },
        { minDur: 7400, sub: '藺相如卻處處躲著他。門客不解，他說：「秦國不敢打趙國，就因為有我們兩人。我怎能為了私人恩怨，誤了國家大事呢！」',
          html: scene(P(180, 302, A('kid', 'happy'), '', 0, .95, true) +
            P(420, 302, A('kid', 'wow'), '', 0, .9) + qmark(470, 190) +
            P(660, 302, A('kid', 'angry'), '', 0, .9)) },
        { minDur: 7000, sub: '廉頗聽說後羞愧極了。他脫下戰袍，背上帶刺的荊條，親自登門請罪。',
          html: scene(P(120, 302, TREE) +
            P(340, 302, A('kid', 'sad') + P(-34, -60, THORNS), 'st-inL') + sweat(300, 205) +
            P(580, 302, A('kid', 'wow'), '', 0, .95, true)) },
        { minDur: 6800, sub: '藺相如連忙扶起他。兩人從此成了同生共死的好朋友，同心保衛趙國！',
          html: scene(P(340, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(500, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .95, true) +
            hearts(420, 170)) },
        { minDur: 6200, sub: '負荊請罪：背著荊條請罪，表示誠心認錯。',
          html: scene(P(340, 302, A('kid', 'sad') + P(-34, -60, THORNS)) + P(560, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">負荊請罪</text>') }
      ];
    },
    /* 完璧歸趙 */
    i265: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var JADE = '<circle cx="0" cy="0" r="20" fill="#8fd0c0" stroke="#5aa896" stroke-width="3"/><circle cx="0" cy="0" r="7" fill="#aee3f5" stroke="#5aa896" stroke-width="2"/>';
      var PILLAR = '<rect x="-16" y="-160" width="32" height="160" rx="6" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/><rect x="-24" y="-172" width="48" height="14" rx="5" fill="#a85a1e"/>';
      return [
        { minDur: 7000, sub: '趙王得到稀世寶玉「和氏璧」。秦王來信說：願意用十五座城來交換！藺相如帶著寶玉出使秦國。',
          html: scene(P(200, 302, A('kid', 'happy') + P(38, -64, JADE, '', 0, .8), 'st-strut') +
            '<path d="M300 316 q160 14 340 6" stroke="#e8dcc0" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 10"/>' +
            P(660, 302, A('kid', 'happy') + CROWN, '', 0, .95, true)) },
        { minDur: 6800, sub: '秦王捧著寶玉看了又看、愛不釋手，卻絕口不提十五座城的事。',
          html: scene(P(560, 302, A('kid', 'happy') + CROWN + P(-38, -64, JADE, '', 0, .9), '', 0, 1, true) +
            hearts(620, 180) +
            P(240, 302, A('kid', 'angry'), '', 0, .95) + qmark(200, 185)) },
        { minDur: 7400, sub: '藺相如說：「玉上有個小斑點，我指給大王看。」把玉要回手中，退到柱子旁：「大王不給城，我就和寶玉一起撞碎在這柱子上！」',
          html: scene(P(380, 302, PILLAR) +
            P(290, 302, A('kid', 'angry') + P(34, -70, JADE, '', 0, .9)) + bang(360, 150) +
            P(600, 302, A('kid', 'wow') + CROWN, '', 0, 1, true) + sweat(560, 200)) },
        { minDur: 6800, sub: '秦王只好作罷。藺相如暗中派人連夜把寶玉送回趙國——完好無缺，一點也沒損傷！',
          html: scene(P(300, 302, '<g class="st-fleeR">' + A('kid', 'happy') + P(30, -64, JADE, '', 0, .8) + '</g>', 'st-dashL') +
            P(660, 302, A('kid', 'happy') + CROWN, 'st-inR', 0, .95, true) + hearts(700, 190), 'night') },
        { minDur: 6200, sub: '完璧歸趙：把原物完好無缺地歸還本人。',
          html: scene(P(400, 250, JADE, '', 0, 1.6) + P(200, 302, A('kid', 'happy')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">完璧歸趙</text>') }
      ];
    },
    /* 杞人憂天 */
    i350: function () {
      return [
        { minDur: 6800, sub: '杞國有個人，整天擔心天會塌下來、地會陷下去，愁得吃不下飯、睡不著覺。',
          html: scene(P(360, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') +
            sweat(320, 200) + qmark(420, 170) + zzz(500, 230), 'night') },
        { minDur: 7000, sub: '朋友來開導他：「天不過是一大團氣，你一舉一動都在氣裡活動，它怎麼會塌下來呢？」',
          html: scene(P(280, 302, A('kid', 'happy') +
              '<path d="M18 -70 q10 -14 4 -24" stroke="#ffe3c1" stroke-width="6" fill="none" stroke-linecap="round"/>') +
            P(540, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(590, 185)) },
        { minDur: 7000, sub: '他又問：「那太陽、月亮、星星，不會掉下來砸到人嗎？」朋友說：「那些只是會發光的氣，掉下來也砸不傷人呀！」',
          html: scene(P(280, 302, A('kid', 'happy')) +
            P(540, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(500, 180), 'night') },
        { minDur: 6600, sub: '杞人這才放下心來，開開心心吃飯睡覺。天下本無事，庸人自擾之呀！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(560, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(460, 170)) },
        { minDur: 6200, sub: '杞人憂天：毫無必要的憂慮。',
          html: scene(P(360, 302, A('kid', 'sad')) + qmark(410, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">杞人憂天</text>') }
      ];
    },
    /* 指鹿為馬 */
    i370: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 7200, sub: '秦朝宰相趙高想篡權，先試探誰站在他那邊：他牽來一頭鹿獻給皇帝，卻說：「這是一匹好馬！」',
          html: scene(P(430, 300, A('deer')) +
            P(250, 302, A('kid', 'happy')) +
            P(640, 302, A('kid', 'wow') + CROWN, '', 0, .95, true) + qmark(690, 185)) },
        { minDur: 6800, sub: '皇帝笑說：「宰相弄錯了吧？這明明是一頭鹿呀！」趙高不回答，轉頭問滿朝大臣。',
          html: scene(P(430, 300, A('deer')) +
            P(640, 302, A('kid', 'happy') + CROWN, '', 0, .95, true) +
            P(250, 302, A('kid', 'angry')) +
            P(120, 302, A('kid', 'happy'), '', 0, .8) + qmark(160, 200)) },
        { minDur: 7200, sub: '大臣們怕趙高的權勢——有的低頭不敢出聲，有的違心地說「是馬」，只有少數人照實說「是鹿」。',
          html: scene(P(430, 300, A('deer'), '', 0, .9) +
            P(150, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, .85) + sweat(180, 210) +
            P(270, 302, A('kid', 'wow'), '', 0, .85) + sweat(300, 205) +
            P(640, 302, A('kid', 'angry'), '', 0, .85) + bang(600, 180)) },
        { minDur: 6800, sub: '事後，說實話的大臣都被趙高陷害了。從此朝廷裡，再也沒有人敢說真話……',
          html: scene(P(300, 302, A('kid', 'angry')) +
            P(560, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, .9) + sweat(600, 205), 'night') },
        { minDur: 6200, sub: '指鹿為馬：顛倒是非，混淆黑白。',
          html: scene(P(280, 300, A('deer')) + P(560, 302, A('horse'), '', 0, .95) + qmark(420, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">指鹿為馬</text>') }
      ];
    },
    /* 黔驢技窮 */
    i399: function () {
      return [
        { minDur: 6600, sub: '黔地本來沒有驢子。有人用船運來一頭驢，放養在山腳下。',
          html: scene(P(660, 302, '<path d="M-110 0 L0 -130 L110 0 Z" fill="#8fb0a0"/>') +
            P(340, 300, A('donkey'), 'st-inL')) },
        { minDur: 6800, sub: '老虎第一次見到驢，以為是什麼神獸，嚇得躲在樹林裡，偷偷觀察牠。',
          html: scene(P(340, 300, A('donkey')) +
            P(640, 302, TREE, '', 0, 1.2) + P(700, 302, A('tiger'), '', 0, .85) + sweat(680, 215)) },
        { minDur: 7000, sub: '有一天驢子放聲大叫，老虎嚇了一大跳！但看久了，發現牠好像也沒什麼別的本事。',
          html: scene(P(340, 300, A('donkey')) + bang(400, 200) + notes(300, 160) +
            P(600, 302, A('tiger')) + sweat(640, 210) + qmark(560, 180)) },
        { minDur: 7200, sub: '老虎故意衝撞挑釁，驢子氣得抬起後腿猛踢——原來這就是牠全部的本領！老虎大喜，撲上去把驢吃掉了。',
          html: scene(P(320, 300, A('donkey') +
              '<line x1="24" y1="-10" x2="46" y2="-30" stroke="#84858f" stroke-width="8" stroke-linecap="round" class="st-hoe"/>') +
            P(520, 302, '<g class="st-cheer">' + A('tiger') + '</g>') + bang(430, 200)) },
        { minDur: 6200, sub: '黔驢技窮：有限的本領用完了，再也無計可施。',
          html: scene(P(300, 300, A('donkey')) + P(540, 302, A('tiger')) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">黔驢技窮</text>') }
      ];
    },
    /* 買櫝還珠 */
    i936: function () {
      var BOX = '<rect x="-34" y="-40" width="68" height="40" rx="7" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>' +
        '<rect x="-34" y="-46" width="68" height="10" rx="5" fill="#e8b84a" stroke="#c98f2a" stroke-width="2"/>' +
        '<circle cx="-18" cy="-22" r="5" fill="#8fd0c0"/><circle cx="0" cy="-18" r="5" fill="#ff9eb5"/><circle cx="18" cy="-24" r="5" fill="#a5c8ff"/>' +
        '<path d="M-26 -10 q10 -6 20 0 q10 6 20 0" stroke="#ffd97a" stroke-width="2.4" fill="none"/>';
      var PEARL = '<circle cx="0" cy="0" r="12" fill="#f4f1ea" stroke="#d5cfc0" stroke-width="2"/><circle cx="-4" cy="-4" r="3.4" fill="#fff"/>';
      return [
        { minDur: 7000, sub: '楚國商人要賣一顆珍珠，特地做了個華麗至極的木盒：香木雕花、鑲玉綴寶，把珍珠放在裡面。',
          html: scene(P(430, 300, BOX, '', 0, 1.1) + P(430, 252, PEARL) +
            P(200, 302, A('kid', 'happy'))) },
        { minDur: 6600, sub: '鄭國人一看，眼睛都亮了——他盯著的，卻是那個漂亮盒子！',
          html: scene(P(430, 300, BOX, '', 0, 1.1) +
            P(640, 302, A('kid', 'wow'), '', 0, 1, true) + hearts(560, 190) + hearts(660, 160)) },
        { minDur: 7000, sub: '他付了大錢，開開心心把盒子抱回家，卻把珍珠退還給商人：「珠子你留著吧！」',
          html: scene(P(560, 302, '<g class="st-fleeR">' + A('kid', 'happy') + P(-34, -60, BOX, '', 0, .6) + '</g>', 'st-dashL', 0, 1, true) +
            P(240, 302, A('kid', 'wow') + P(34, -66, PEARL, '', 0, .9)) + qmark(190, 180)) },
        { minDur: 6800, sub: '華麗的包裝迷住了他的眼，真正貴重的珍珠反而被退了回來——取捨完全顛倒了呀！',
          html: scene(P(300, 302, A('kid', 'wow') + P(34, -66, PEARL, '', 0, .9)) +
            sweat(250, 200) + qmark(360, 175)) },
        { minDur: 6200, sub: '買櫝還珠：取捨失當、捨本逐末。',
          html: scene(P(320, 296, BOX, '', 0, 1.15) + P(520, 260, PEARL, '', 0, 1.3) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">買櫝還珠</text>') }
      ];
    },
    /* 鷸蚌相爭 */
    i1086: function () {
      function clam(open) {
        var s = '<path d="M-24 0 q0 -22 24 -22 q24 0 24 22 z" fill="#c9a8b8" stroke="#a8869a" stroke-width="2.4"' +
          (open ? ' transform="rotate(-28)"' : '') + '/>';
        s += '<path d="M-24 0 q24 10 48 0 q-6 10 -24 10 q-18 0 -24 -10 z" fill="#b895a8" stroke="#a8869a" stroke-width="2.4"/>';
        if (open) s += '<circle cx="4" cy="-6" r="5" fill="#ffd0dc"/>';
        return s;
      }
      var RIVERBANK = '<rect y="278" width="800" height="62" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 286 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>' +
        '<ellipse cx="330" cy="316" rx="220" ry="34" fill="#e8d5a8"/>';
      return [
        { minDur: 6800, sub: '河蚌張開殼，在河灘上舒服地晒太陽。一隻鷸鳥飛來，一口啄住牠的肉！',
          html: scene(RIVERBANK + P(330, 306, clam(true), '', 0, 1.2) +
            P(300, 296, A('bird'), '', 0, 1.05) + bang(350, 230)) },
        { minDur: 6400, sub: '河蚌立刻「啪」地合起殼來，把鷸的長嘴緊緊夾住！',
          html: scene(RIVERBANK + P(330, 306, clam(false), '', 0, 1.2) +
            P(300, 288, A('bird'), '', 0, 1.05) + bang(310, 240) + sweat(260, 230)) },
        { minDur: 7400, sub: '鷸說：「今天不下雨、明天不下雨，你就渴死了！」蚌說：「今天不放你、明天不放你，你就餓死了！」誰也不肯讓誰。',
          html: scene(RIVERBANK + P(330, 306, clam(false), '', 0, 1.2) +
            P(300, 288, A('bird'), '', 0, 1.05) + qmark(250, 200) + qmark(400, 220) + sweat(330, 190)) },
        { minDur: 6600, sub: '就在牠們僵持不下的時候，一個漁夫走了過來，輕輕鬆鬆把鷸和蚌一起抓走了！',
          html: scene(RIVERBANK +
            P(500, 302, '<g class="st-cheer">' + A('kid', 'happy') +
              P(-40, -60, clam(false), '', 0, .6) + P(40, -70, A('bird'), '', 0, .55) + '</g>', 'st-inR') +
            hearts(580, 180)) },
        { minDur: 6400, sub: '鷸蚌相爭，漁翁得利：雙方僵持不下，反而讓第三者得到好處。',
          html: scene(RIVERBANK + P(260, 306, clam(false), '', 0, 1.1) + P(230, 290, A('bird')) +
            P(560, 302, A('kid', 'happy')) +
            '<text x="400" y="80" text-anchor="middle" font-size="50" font-weight="bold" fill="#4a3200">鷸蚌相爭</text>') }
      ];
    },
    /* 磨杵成針 */
    i786: function () {
      var PESTLE = '<line x1="0" y1="0" x2="30" y2="-40" stroke="#6d7585" stroke-width="9" stroke-linecap="round"/>';
      var STONE = '<ellipse cx="0" cy="0" rx="34" ry="13" fill="#b0b4bf" stroke="#8b93a3" stroke-width="2.4"/>';
      var NEEDLE = '<line x1="-14" y1="6" x2="14" y2="-6" stroke="#c4cede" stroke-width="2.6" stroke-linecap="round"/><circle cx="14" cy="-6" r="2" fill="none" stroke="#c4cede" stroke-width="1.4"/>';
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      return [
        { minDur: 6600, sub: '小時候的李白不愛讀書，這天又偷偷溜出學堂，跑到河邊玩耍。',
          html: scene(P(300, 302, '<g class="st-fleeR">' + A('kid', 'happy') + '</g>', 'st-dashL') +
            P(120, 296, BOOK, '', 0, 1.1) + notes(400, 180)) },
        { minDur: 6800, sub: '河邊，他看見一位老婆婆拿著一根粗鐵杵，在大石頭上一下一下地磨。',
          html: scene(P(520, 316, STONE) +
            P(440, 302, A('kid', 'happy') + P(20, -30, PESTLE, 'st-hoe'), '', 0, .9) +
            P(220, 302, A('kid', 'wow')) + qmark(280, 190)) },
        { minDur: 7400, sub: '李白好奇地問：「婆婆，您磨鐵杵做什麼？」婆婆說：「磨成一根繡花針呀！只要天天磨、不放棄，總有一天磨得成！」',
          html: scene(P(520, 316, STONE) +
            P(440, 302, A('kid', 'happy') + P(20, -30, PESTLE), '', 0, .9) +
            P(300, 220, '<circle cx="0" cy="0" r="30" fill="#fff" opacity=".9"/>' + NEEDLE) +
            P(200, 302, A('kid', 'wow')) + hearts(260, 170)) },
        { minDur: 6800, sub: '李白深受感動，回到學堂發憤讀書。後來，他成了名傳千古的大詩人！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-40, -50, BOOK)) +
            P(580, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(470, 170)) },
        { minDur: 6200, sub: '磨杵成針：只要功夫深，功到自然成。',
          html: scene(P(360, 316, STONE) + P(300, 296, PESTLE, '', 0, 1.1) + P(520, 250, NEEDLE, '', 0, 1.4) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">磨杵成針</text>') }
      ];
    },
    /* 騎虎難下 */
    i891: function () {
      function riding(cls) {
        return P(430, 302, A('tiger') + P(4, -34, A('kid', 'wow'), '', 0, .72), cls);
      }
      return [
        { minDur: 6600, sub: '有個人在山裡遇到野獸，慌忙逃命，情急之下竟一躍跳上了一隻老虎的背！',
          html: scene(P(120, 302, TREE) + riding('st-inR') + bang(520, 200) + sweat(360, 200)) },
        { minDur: 6600, sub: '老虎馱著他狂奔起來！他嚇得緊緊抱住虎背——現在跳下來，一定會被老虎咬呀！',
          html: scene(riding('st-dashL') + sweat(500, 190) + sweat(380, 180) +
            '<path d="M560 316 q90 8 180 2" stroke="#e8dcc0" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 10"/>') },
        { minDur: 6800, sub: '想下又不敢下，只好硬著頭皮一直騎著——進也不是、退也不是，兩頭為難。',
          html: scene(riding('') + qmark(360, 170) + qmark(520, 180) + sweat(430, 150)) },
        { minDur: 6800, sub: '很多事也一樣：做到一半，情勢逼人，想停也停不下來，只能硬著頭皮做下去。',
          html: scene(riding('') + sweat(470, 170), 'night') },
        { minDur: 6200, sub: '騎虎難下：事情做到一半，迫於形勢無法停止。',
          html: scene(riding('') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">騎虎難下</text>') }
      ];
    },
    /* 胸有成竹 */
    i085: function () {
      function bamboo(x, h, dly) {
        return P(x, 302, '<line x1="0" y1="0" x2="0" y2="' + (-h) + '" stroke="#5f9a4a" stroke-width="8" stroke-linecap="round"/>' +
          '<g stroke="#4a7a38" stroke-width="2.4"><line x1="-5" y1="' + (-h * .33) + '" x2="5" y2="' + (-h * .33) + '"/><line x1="-5" y1="' + (-h * .66) + '" x2="5" y2="' + (-h * .66) + '"/></g>' +
          '<path d="M0 ' + (-h) + ' q-14 -10 -26 -8 M0 ' + (-h) + ' q14 -10 26 -8 M0 ' + (-h * .8) + ' q12 -6 22 -2" stroke="#6fae58" stroke-width="4" fill="none" stroke-linecap="round"/>', '', dly);
      }
      var BRUSH = '<line x1="0" y1="0" x2="14" y2="-34" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M0 0 q-3 6 -1 11 q4 -2 5 -8 z" fill="#3a2e26"/>';
      var INKBAMBOO = '<line x1="0" y1="0" x2="0" y2="-64" stroke="#4a4a55" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M0 -64 q-10 -8 -18 -6 M0 -64 q10 -8 18 -6 M0 -40 q10 -5 18 -2" stroke="#4a4a55" stroke-width="3" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '宋朝畫家文同最愛畫竹子。他在屋前屋後種滿了竹子，天天細細觀察。',
          html: scene(bamboo(560, 130, 0) + bamboo(640, 110, .3) + bamboo(710, 140, .5) +
            P(340, 302, A('kid', 'happy'))) },
        { minDur: 6800, sub: '晴天雨天、春夏秋冬，竹子的每一種姿態，他都看得清清楚楚、記在心裡。',
          html: scene(bamboo(560, 130, 0) + bamboo(650, 115, .3) +
            '<g stroke="#8fc6ff" stroke-width="3.4" stroke-linecap="round">' +
            '<line class="st-rain" x1="140" y1="30" x2="134" y2="52"/><line class="st-rain" style="animation-delay:.4s" x1="300" y1="16" x2="294" y2="38"/>' +
            '<line class="st-rain" style="animation-delay:.8s" x1="450" y1="30" x2="444" y2="52"/></g>' +
            P(340, 302, A('kid', 'happy'))) },
        { minDur: 6800, sub: '所以每次提筆，他心中早有一幅完整的竹子，下筆一氣呵成，畫得又快又好！',
          html: scene(P(430, 300, '<rect x="-90" y="-140" width="180" height="140" rx="6" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>' +
              P(0, -30, INKBAMBOO)) +
            P(250, 302, A('kid', 'happy') + P(24, -44, BRUSH)) +
            P(620, 230, '<circle cx="0" cy="0" r="40" fill="#fff" opacity=".85"/>' + P(0, 28, INKBAMBOO, '', 0, .7))) },
        { minDur: 6600, sub: '朋友們讚嘆：「文同畫竹，早就胸有成竹了呀！」',
          html: scene(P(430, 300, '<rect x="-90" y="-140" width="180" height="140" rx="6" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>' +
              P(0, -30, INKBAMBOO)) +
            P(250, 302, A('kid', 'happy')) +
            P(640, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(560, 180)) },
        { minDur: 6200, sub: '胸有成竹：做事很有把握，心中早有計畫。',
          html: scene(bamboo(620, 130, 0) + P(280, 302, A('kid', 'happy') + P(24, -44, BRUSH)) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">胸有成竹</text>') }
      ];
    },
    /* 南轅北轍 */
    i043: function () {
      var CART2 = '<circle cx="0" cy="-24" r="24" fill="#c9a06c" stroke="#a8734a" stroke-width="4"/>' +
        '<g stroke="#a8734a" stroke-width="3.4"><line x1="0" y1="-42" x2="0" y2="-6"/><line x1="-18" y1="-24" x2="18" y2="-24"/></g>' +
        '<rect x="-12" y="-74" width="96" height="36" rx="7" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>';
      var SIGN = '<line x1="0" y1="0" x2="0" y2="-84" stroke="#a8734a" stroke-width="6"/>' +
        '<g><rect x="-6" y="-84" width="64" height="22" rx="4" fill="#e8dcc0" stroke="#a8734a" stroke-width="2.4"/>' +
        '<text x="26" y="-68" text-anchor="middle" font-size="15" font-weight="bold" fill="#4a3200">楚國→</text></g>';
      function rig(x, cls, dly) {
        return P(x, 302, A('horse') + P(70, 0, CART2), cls, dly, 1, true) ;
      }
      return [
        { minDur: 6600, sub: '有個人要去南方的楚國，卻駕著馬車，一路往北走。',
          html: scene(P(130, 302, SIGN) + rig(420, 'st-strut', 0) +
            P(560, 302, A('kid', 'happy'), '', 0, .9)) },
        { minDur: 6800, sub: '朋友攔住他：「楚國在南邊，你怎麼往北走呀？」他說：「沒關係，我的馬跑得特別快！」',
          html: scene(P(130, 302, SIGN) + rig(460, '', 0) +
            P(600, 302, A('kid', 'happy'), '', 0, .9) +
            P(260, 302, A('kid', 'wow')) + qmark(300, 185)) },
        { minDur: 7000, sub: '「馬再快，方向錯了呀！」「不怕不怕，我的路費帶得多、車伕的技術特別好！」',
          html: scene(P(130, 302, SIGN) + rig(460, '', 0) +
            P(600, 302, A('kid', 'happy'), '', 0, .9) +
            P(260, 302, A('kid', 'angry')) + bang(330, 180) + sweat(230, 200)) },
        { minDur: 6800, sub: '馬越快、錢越多、車伕越好，他只會離楚國越來越遠啊！',
          html: scene(P(90, 302, SIGN) + rig(640, 'st-strut', 0) +
            P(300, 302, A('kid', 'sad'), '', 0, .9) + sweat(340, 200) + qmark(250, 180)) },
        { minDur: 6200, sub: '南轅北轍：行動和目標相反，背道而馳。',
          html: scene(P(150, 302, SIGN) + rig(520, '', 0) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">南轅北轍</text>') }
      ];
    },
    /* 樂不思蜀 */
    i046: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '蜀國滅亡後，後主劉禪被接到魏國的都城居住，天天有酒宴、有歌舞，日子過得逍遙快活。',
          html: scene(P(320, 302, A('kid', 'happy') + CROWN + P(40, -66, JUG, '', 0, .8)) +
            notes(420, 160) + hearts(250, 180)) },
        { minDur: 7000, sub: '司馬昭故意安排蜀地的歌舞。跟來的蜀國舊臣看了，難過得低頭掉淚；劉禪卻看得津津有味。',
          html: scene(P(320, 302, '<g class="st-cheer">' + A('kid', 'happy') + CROWN + '</g>') + notes(400, 150) +
            P(580, 302, A('kid', 'sad'), '', 0, .9) + sweat(610, 205) +
            P(690, 302, A('kid', 'sad'), '', .3, .85)) },
        { minDur: 7000, sub: '司馬昭問他：「你想不想念蜀國呀？」劉禪說：「這裡這麼快樂，我一點也不想念蜀國！」',
          html: scene(P(240, 302, A('kid', 'happy'), '', 0, .95) + qmark(290, 185) +
            P(500, 302, A('kid', 'happy') + CROWN, '', 0, 1, true) + hearts(560, 180)) },
        { minDur: 6600, sub: '連自己的故國都忘得一乾二淨——「樂不思蜀」從此成了千古笑話。',
          html: scene(P(500, 302, A('kid', 'happy') + CROWN + P(40, -66, JUG, '', 0, .8), '', 0, 1, true) +
            P(240, 302, A('kid', 'wow'), '', 0, .9) + sweat(280, 195) + qmark(200, 180)) },
        { minDur: 6200, sub: '樂不思蜀：沉溺於享樂，忘記故鄉。',
          html: scene(P(400, 302, A('kid', 'happy') + CROWN) + notes(480, 170) + hearts(320, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">樂不思蜀</text>') }
      ];
    },
    /* 邯鄲學步 */
    i368: function () {
      var SIGN = '<line x1="0" y1="0" x2="0" y2="-84" stroke="#a8734a" stroke-width="6"/>' +
        '<g><rect x="-6" y="-84" width="64" height="22" rx="4" fill="#e8dcc0" stroke="#a8734a" stroke-width="2.4"/>' +
        '<text x="26" y="-68" text-anchor="middle" font-size="15" font-weight="bold" fill="#4a3200">邯鄲→</text></g>';
      return [
        { minDur: 6600, sub: '燕國有個少年，聽說趙國邯鄲人走路的姿勢特別優美，決定親自去學一學。',
          html: scene(P(150, 302, SIGN) +
            P(400, 302, A('kid', 'happy'), 'st-strut') + hearts(470, 180) + qmark(340, 170)) },
        { minDur: 6800, sub: '到了邯鄲，他天天跟在路人後面模仿：學這個人的擺手、學那個人的抬腿，越學越亂。',
          html: scene(P(250, 302, A('kid', 'happy'), 'st-strut') +
            P(400, 302, A('kid', 'happy'), 'st-strut', .3, .95) +
            P(560, 302, A('kid', 'wow'), '', 0, .95) + sweat(600, 195) + qmark(520, 175)) },
        { minDur: 6600, sub: '結果，邯鄲的走法沒學會，連自己原來怎麼走路，都忘得一乾二淨！',
          html: scene(P(400, 302, '<g class="st-slump">' + A('kid', 'wow') + '</g>') +
            sweat(350, 195) + sweat(450, 200) + qmark(400, 160)) },
        { minDur: 6800, sub: '最後，他只好手腳並用、一路爬著回燕國，被人笑了上千年。',
          html: scene(P(360, 296, '<g transform="rotate(76)">' + A('kid', 'wow') + '</g>') + sweat(320, 230) +
            P(640, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(690, 190)) },
        { minDur: 6200, sub: '邯鄲學步：模仿別人不成，反而失去自己原有的本領。',
          html: scene(P(360, 296, '<g transform="rotate(76)">' + A('kid', 'wow') + '</g>') + P(600, 302, A('kid', 'happy'), 'st-strut') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">邯鄲學步</text>') }
      ];
    },
    /* 破釜沉舟 */
    i268: function () {
      var RIVER2 = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 272 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="8" stroke-linecap="round" opacity=".9"/></g>';
      var BOAT2 = '<path d="M-60 0 L60 0 L44 20 L-44 20 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>';
      var POT = '<path d="M-20 0 q-6 -20 4 -26 h32 q10 6 4 26 q-10 8 -20 8 q-10 0 -20 -8 z" transform="translate(-10,-8) scale(.9)" fill="#6d7585" stroke="#4a5462" stroke-width="2.4"/>';
      var POTBROKEN = '<path d="M-22 0 l10 -22 l8 8 l6 -12 l10 20 q-8 8 -17 8 q-9 0 -17 -2 z" fill="#6d7585" stroke="#4a5462" stroke-width="2.4"/>' +
        '<path d="M-30 6 l8 -10 l4 8 z M22 4 l6 -10 l5 9 z" fill="#6d7585"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 6600, sub: '秦軍重重圍住鉅鹿，項羽率領楚軍渡河救援。',
          html: scene(RIVER2 + P(400, 268, BOAT2 + P(-20, 0, A('kid', 'angry'), '', 0, .8) + P(24, 0, A('kid', 'angry'), '', 0, .75)) ) },
        { minDur: 7000, sub: '一過河，項羽就下令：砸破全部飯鍋、鑿沉所有渡船，每人只帶三天乾糧！',
          html: scene(RIVER2 + '<ellipse cx="360" cy="330" rx="260" ry="30" fill="#b8e08e"/>' +
            P(300, 320, POTBROKEN) + bang(300, 260) +
            P(560, 286, '<g transform="rotate(-22)">' + BOAT2 + '</g>') +
            P(200, 302, A('kid', 'angry') + P(24, -42, HAMMER))) },
        { minDur: 7000, sub: '「退路沒有了！要活命，只有拚死向前！」楚軍個個以一當十，奮勇殺敵。',
          html: scene(P(240, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut') +
            P(390, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .2, .9) +
            P(530, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .4, .85) +
            bang(650, 200) + bang(700, 260)) },
        { minDur: 6600, sub: '九戰九勝！楚軍大破秦軍，解了鉅鹿之圍，項羽從此威震諸侯。',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(26, -50, SPEAR3) + '</g>') +
            P(480, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + P(26, -50, SPEAR3) + '</g>', '', 0, .9) +
            hearts(400, 160)) },
        { minDur: 6200, sub: '破釜沉舟：下定決心，不留退路地拚到底。',
          html: scene(P(280, 316, POTBROKEN, '', 0, 1.2) + P(540, 292, '<g transform="rotate(-18)">' + BOAT2 + '</g>', '', 0, .9) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">破釜沉舟</text>') }
      ];
    },
    /* 程門立雪 */
    i1037: function () {
      var HOUSE2 = '<path d="M-100 -80 L0 -140 L100 -80 Z" fill="#8a5a33"/>' +
        '<rect x="-84" y="-80" width="168" height="80" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>' +
        '<rect x="-24" y="-58" width="48" height="58" rx="4" fill="#8a5a33"/>';
      var SNOWFX = '<g fill="#fff"><circle class="st-snow" cx="160" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1.2s" cx="330" cy="20" r="3.4"/>' +
        '<circle class="st-snow" style="animation-delay:.5s" cx="470" cy="36" r="4"/><circle class="st-snow" style="animation-delay:1.7s" cx="600" cy="24" r="3"/>' +
        '<circle class="st-snow" style="animation-delay:.8s" cx="240" cy="50" r="3.6"/><circle class="st-snow" style="animation-delay:1.4s" cx="540" cy="46" r="3.2"/></g>';
      var SNOWDRIFT = '<ellipse cx="0" cy="0" rx="120" ry="18" fill="#fff" opacity=".95"/><ellipse cx="-60" cy="-4" rx="40" ry="12" fill="#fff"/><ellipse cx="60" cy="-4" rx="40" ry="12" fill="#fff"/>';
      return [
        { minDur: 6600, sub: '宋朝學者楊時和游酢，一起去拜見老師程頤，想請教學問。',
          html: scene(P(560, 302, HOUSE2) +
            P(220, 302, A('kid', 'happy'), 'st-inL') + P(330, 302, A('kid', 'happy'), 'st-inL', .3, .92)) },
        { minDur: 6800, sub: '老師正閉著眼睛休息。兩人不敢打擾，恭恭敬敬地站在門外靜靜等候。',
          html: scene(P(560, 302, HOUSE2) + zzz(570, 200) +
            P(240, 302, A('kid', 'happy')) + P(350, 302, A('kid', 'happy'), '', 0, .92)) },
        { minDur: 6800, sub: '天上下起了大雪，越下越大——他們仍然一動也不動地站著。',
          html: scene(P(560, 302, HOUSE2) + SNOWFX + zzz(570, 200) +
            P(240, 302, A('kid', 'happy')) + P(350, 302, A('kid', 'happy'), '', 0, .92) +
            P(295, 318, '<ellipse cx="0" cy="0" rx="90" ry="10" fill="#fff" opacity=".9"/>'), 'night') },
        { minDur: 7000, sub: '老師醒來開門一看：門外的雪，已經積了一尺深！兩人的誠心，從此傳為千古佳話。',
          html: scene(P(560, 302, HOUSE2) + SNOWFX +
            P(560, 302, A('kid', 'wow'), '', 0, .9) + qmark(600, 190) +
            P(240, 302, A('kid', 'happy')) + P(350, 302, A('kid', 'happy'), '', 0, .92) +
            P(295, 316, SNOWDRIFT) + hearts(300, 170), 'night') },
        { minDur: 6200, sub: '程門立雪：尊敬師長，誠心求教。',
          html: scene(P(560, 302, HOUSE2) + SNOWFX + P(280, 302, A('kid', 'happy')) + P(280, 318, '<ellipse cx="0" cy="0" rx="70" ry="12" fill="#fff" opacity=".95"/>') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">程門立雪</text>', 'night') }
      ];
    },
    /* 鑿壁偷光 */
    i109: function () {
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      var WALLMID = '<rect x="-10" y="-170" width="20" height="170" fill="#b0a390" stroke="#8a7a66" stroke-width="2"/>';
      var GLOW = '<circle cx="0" cy="0" r="46" fill="#ffdd66" opacity=".35"/><circle cx="0" cy="0" r="24" fill="#ffdd66" opacity=".5"/><circle cx="0" cy="0" r="9" fill="#ffe9a0"/>';
      var BEAM = '<path d="M0 0 L150 -34 L150 30 Z" fill="#ffe9a0" opacity=".55"/>';
      return [
        { minDur: 6800, sub: '漢朝的匡衡最愛讀書，家裡卻窮得點不起油燈。天一黑，書就讀不成了。',
          html: scene(P(300, 302, A('kid', 'sad') + P(-40, -50, BOOK)) + sweat(260, 200) + qmark(360, 180), 'night') },
        { minDur: 6800, sub: '隔壁人家燈火通明。匡衡靈機一動，悄悄在牆上鑿出一個小洞——',
          html: scene(P(430, 302, WALLMID) + P(560, 200, GLOW) +
            P(320, 302, A('kid', 'happy') + P(26, -42, HAMMER)) +
            P(430, 220, '<g class="st-bang"><path d="M0-8 L2-2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2-2 Z" fill="#fff27a"/></g>'), 'night') },
        { minDur: 6800, sub: '一道亮光從小洞透了過來！他就著這道光，捧著書一夜一夜地苦讀。',
          html: scene(P(430, 302, WALLMID) + P(560, 200, GLOW) +
            P(430, 220, '<g transform="scale(-1,1)">' + BEAM + '</g>') +
            P(310, 302, A('kid', 'happy') + P(-40, -56, BOOK)), 'night') },
        { minDur: 6600, sub: '勤學不倦的匡衡，後來成了大學問家，還當上了宰相！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(-40, -60, BOOK) + '</g>') +
            P(580, 302, A('kid', 'happy'), '', 0, .9) + hearts(470, 170)) },
        { minDur: 6200, sub: '鑿壁偷光：窮困中仍勤奮讀書。',
          html: scene(P(430, 302, WALLMID) + P(430, 220, '<g transform="scale(-1,1)">' + BEAM + '</g>') + P(560, 200, GLOW) +
            P(300, 302, A('kid', 'happy') + P(-40, -56, BOOK), '', 0, .95) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">鑿壁偷光</text>', 'night') }
      ];
    },
    /* 囊螢映雪 */
    i108: function () {
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      var FIREFLYBAG = '<path d="M-16 0 Q-20 -26 0 -30 Q20 -26 16 0 Z" fill="#e8f4d8" opacity=".85" stroke="#c9d8b0" stroke-width="2"/>' +
        '<line x1="0" y1="-30" x2="0" y2="-40" stroke="#c9d8b0" stroke-width="2.4"/>' +
        '<circle class="st-tw" cx="-6" cy="-14" r="2.6" fill="#d8f060"/><circle class="st-tw" style="animation-delay:.5s" cx="5" cy="-9" r="2.4" fill="#d8f060"/><circle class="st-tw" style="animation-delay:.9s" cx="2" cy="-20" r="2.2" fill="#d8f060"/>';
      function fly(x, y, dly) { return '<circle class="st-tw" style="animation-delay:' + dly + 's" cx="' + x + '" cy="' + y + '" r="2.6" fill="#d8f060"/>'; }
      var SNOWGROUND = '<ellipse cx="400" cy="330" rx="420" ry="40" fill="#fff" opacity=".95"/>';
      return [
        { minDur: 6800, sub: '晉朝的車胤家貧，買不起燈油。夏天夜裡，他抓來許多螢火蟲，裝進薄薄的紗袋——',
          html: scene(fly(200, 160, 0) + fly(300, 120, .4) + fly(500, 150, .8) + fly(620, 110, .2) +
            P(360, 302, A('kid', 'happy') + P(38, -60, FIREFLYBAG)), 'night') },
        { minDur: 6600, sub: '靠著螢火蟲的微微亮光，他捧著書，一夜又一夜地苦讀。',
          html: scene(P(430, 240, FIREFLYBAG, '', 0, 1.3) +
            P(310, 302, A('kid', 'happy') + P(-40, -56, BOOK)), 'night') },
        { minDur: 6800, sub: '同時代的孫康，則在冬天的夜裡坐到雪地旁，借著白雪反射的月光讀書。',
          html: scene(SNOWGROUND +
            '<g fill="#fff"><circle class="st-snow" cx="200" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1s" cx="420" cy="24" r="3.4"/><circle class="st-snow" style="animation-delay:.5s" cx="580" cy="40" r="4"/></g>' +
            P(380, 296, A('kid', 'happy') + P(-40, -56, BOOK)), 'night') },
        { minDur: 6600, sub: '兩個人都憑著這股勤勁，成了有大學問的人。「囊螢映雪」說的就是他們！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(38, -64, FIREFLYBAG, '', 0, .8) + '</g>') +
            P(540, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + P(-40, -60, BOOK) + '</g>', '', 0, .95) +
            hearts(430, 165)) },
        { minDur: 6200, sub: '囊螢映雪：刻苦勤奮地讀書。',
          html: scene(P(300, 250, FIREFLYBAG, '', 0, 1.2) + SNOWGROUND + P(560, 296, A('kid', 'happy') + P(-40, -56, BOOK), '', 0, .95) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">囊螢映雪</text>', 'night') }
      ];
    },
    /* 半途而廢 */
    i213: function () {
      var LOOM = '<path d="M-50 0 L-50 -80 L50 -80 L50 0" stroke="#a8734a" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<rect x="-42" y="-72" width="84" height="40" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2"/>' +
        '<g stroke="#c9d6e8" stroke-width="1.8"><line x1="-42" y1="-62" x2="42" y2="-62"/><line x1="-42" y1="-52" x2="42" y2="-52"/><line x1="-42" y1="-42" x2="42" y2="-42"/></g>';
      var LOOMCUT = '<path d="M-50 0 L-50 -80 L50 -80 L50 0" stroke="#a8734a" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<rect x="-42" y="-72" width="84" height="22" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2"/>' +
        '<path d="M-42 -50 l10 6 l12 -7 l11 6 l12 -6 l11 7 l12 -6 l16 5" stroke="#6d87ab" stroke-width="2.4" fill="none"/>' +
        '<rect x="-42" y="-34" width="84" height="14" fill="#8fa8c9" opacity=".5"/>';
      var SCISSORS = '<g stroke="#8b93a3" stroke-width="4" stroke-linecap="round"><line x1="-10" y1="10" x2="12" y2="-12"/><line x1="-10" y1="-12" x2="12" y2="10"/></g><circle cx="-12" cy="12" r="4" fill="none" stroke="#8b93a3" stroke-width="2.6"/><circle cx="-12" cy="-14" r="4" fill="none" stroke="#8b93a3" stroke-width="2.6"/>';
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      return [
        { minDur: 6600, sub: '樂羊子出遠門拜師求學，才過一年就想家，半路跑回來了。',
          html: scene(P(620, 302, '<path d="M-70 -60 L0 -104 L70 -60 Z" fill="#8a5a33"/><rect x="-58" y="-60" width="116" height="60" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/><rect x="-16" y="-42" width="32" height="42" rx="3" fill="#8a5a33"/>') +
            P(300, 302, A('kid', 'happy'), 'st-dashL')) },
        { minDur: 6800, sub: '妻子正在織布機前織布。她拿起剪刀，「喀嚓」一聲，把織了一半的布剪斷了！',
          html: scene(P(430, 302, LOOMCUT) + P(560, 250, SCISSORS) + bang(500, 200) +
            P(250, 302, A('kid', 'wow')) + sweat(300, 200)) },
        { minDur: 7200, sub: '她說：「布織到一半剪斷，前面的功夫全白費了——你讀書讀到一半跑回來，不是一樣嗎？」',
          html: scene(P(430, 302, LOOMCUT) +
            P(600, 302, A('kid', 'angry'), '', 0, .95, true) +
            P(250, 302, A('kid', 'wow')) + sweat(210, 200) + qmark(300, 175)) },
        { minDur: 6800, sub: '樂羊子大受震動，回去繼續苦讀，整整七年學成才回家！',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, BOOK), 'st-strut') +
            P(560, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(440, 170)) },
        { minDur: 6200, sub: '半途而廢：事情做到一半就放棄。',
          html: scene(P(400, 302, LOOMCUT, '', 0, 1.1) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">半途而廢</text>') }
      ];
    },
    /* 一箭雙鵰 */
    i254: function () {
      var BOW2 = '<path d="M0 -46 q32 24 0 46" fill="none" stroke="#a8734a" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="0" y1="-46" x2="0" y2="0" stroke="#d9cbb0" stroke-width="2.6"/>';
      var MEAT = '<ellipse cx="0" cy="0" rx="11" ry="8" fill="#e88a7a" stroke="#c96a5a" stroke-width="2"/><rect x="-3" y="-14" width="6" height="8" rx="3" fill="#f4f1e8"/>';
      var ARROW = '<line x1="-30" y1="0" x2="30" y2="0" stroke="#8a5a33" stroke-width="3.4" stroke-linecap="round"/><path d="M30 0 l-10 -5 v10 z" fill="#8b93a3"/><path d="M-30 -4 l-8 4 l8 4 z" fill="#c9a06c"/>';
      return [
        { minDur: 6800, sub: '北周的長孫晟箭術高超。這天，天上兩隻大鵰正為了一塊肉，爭搶得不可開交。',
          html: scene(P(430, 130, A('bird')) + P(530, 150, A('bird'), '', .3, .9, true) +
            P(485, 110, MEAT) + bang(480, 170) +
            P(200, 302, A('kid', 'happy'))) },
        { minDur: 6400, sub: '同伴遞給他兩支箭：「請把牠們射下來吧！」',
          html: scene(P(430, 130, A('bird')) + P(530, 150, A('bird'), '', .3, .9, true) +
            P(200, 302, A('kid', 'happy') + P(30, -40, BOW2, '', 0, .8)) +
            P(330, 302, A('kid', 'happy'), '', 0, .9) + qmark(370, 190)) },
        { minDur: 6800, sub: '長孫晟只搭上一支箭，「咻」地射出——竟一箭同時穿過了兩隻大鵰！',
          html: scene(P(480, 140, ARROW, '', 0, 1.3) +
            P(430, 150, '<g class="st-faint">' + A('bird') + '</g>') +
            P(540, 160, '<g class="st-faint" style="animation-delay:.2s">' + A('bird') + '</g>', '', 0, .9, true) +
            bang(490, 90) +
            P(200, 302, A('kid', 'happy') + P(30, -40, BOW2, '', 0, .8))) },
        { minDur: 6400, sub: '大家看得目瞪口呆，齊聲喝采：「一箭雙鵰，真是神箭手！」',
          html: scene(P(200, 302, A('kid', 'happy') + P(30, -40, BOW2, '', 0, .8)) +
            P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            P(530, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'wow') + '</g>', '', 0, .85) +
            hearts(340, 170)) },
        { minDur: 6200, sub: '一箭雙鵰：一次行動，同時達到兩個目的。',
          html: scene(P(400, 180, ARROW, '', 0, 1.4) + P(340, 190, A('bird'), '', 0, .9) + P(470, 200, A('bird'), '', 0, .8, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一箭雙鵰</text>') }
      ];
    },
    /* 臨渴掘井 */
    i557: function () {
      var JAR = '<path d="M-16 0 Q-22 -16 -14 -34 L14 -34 Q22 -16 16 0 Z" fill="#b98a5d" stroke="#96683c" stroke-width="2.6"/><ellipse cx="0" cy="-34" rx="14" ry="4.6" fill="#6d5a44"/>';
      var CRACKS = '<g stroke="#96683c" stroke-width="2.6" fill="none" opacity=".8"><path d="M180 316 l24 6 l18 -5 M420 322 l20 4 l16 -6 M600 318 l22 5"/></g>';
      return [
        { minDur: 6600, sub: '有個人從不儲水，家裡連一口井也懶得挖：「等要喝水的時候再說吧！」',
          html: scene(P(560, 302, JAR, '', 0, 1.1) +
            P(300, 302, A('kid', 'happy')) + zzz(360, 200)) },
        { minDur: 6600, sub: '大旱來了！河乾了、水缸也空了，他渴得嘴唇發白、頭昏眼花。',
          html: scene(CRACKS + P(560, 302, '<g transform="rotate(76)">' + JAR + '</g>') +
            P(300, 302, A('kid', 'sad')) + sweat(260, 200) + sweat(340, 195)) },
        { minDur: 6800, sub: '他這才慌慌張張抓起鋤頭挖井——可是挖一口井要好多天，水一時哪裡出得來？',
          html: scene(CRACKS + P(430, 316, '<ellipse cx="0" cy="0" rx="40" ry="12" fill="#8a7a66"/>') +
            P(320, 302, A('kid', 'wow') + P(16, -30, HOE, 'st-hoe')) +
            sweat(280, 195) + qmark(400, 175)) },
        { minDur: 6600, sub: '口渴了才想到挖井，早就來不及了。凡事，要及早準備呀！',
          html: scene(CRACKS + P(430, 316, '<ellipse cx="0" cy="0" rx="40" ry="12" fill="#8a7a66"/>') +
            P(320, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') + sweat(360, 200)) },
        { minDur: 6200, sub: '臨渴掘井：事到臨頭才想辦法，為時已晚。',
          html: scene(P(320, 302, A('kid', 'sad') + P(16, -30, HOE)) + P(500, 316, '<ellipse cx="0" cy="0" rx="40" ry="12" fill="#8a7a66"/>') +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">臨渴掘井</text>') }
      ];
    },
    /* 孟母三遷 */
    i717: function () {
      var GRAVES = '<path d="M-60 0 a26 22 0 0 1 52 0 z" fill="#9aa88f" stroke="#7a8a70" stroke-width="2.4"/>' +
        '<path d="M10 0 a22 18 0 0 1 44 0 z" fill="#9aa88f" stroke="#7a8a70" stroke-width="2.4"/>' +
        '<rect x="-40" y="-34" width="10" height="24" rx="2" fill="#b0b4a8"/>';
      var STALL = '<rect x="-60" y="-30" width="120" height="30" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<line x1="-50" y1="0" x2="-50" y2="-30" stroke="#a8734a" stroke-width="4"/><line x1="50" y1="0" x2="50" y2="-30" stroke="#a8734a" stroke-width="4"/>' +
        '<circle cx="-24" cy="-36" r="7" fill="#ff8a80"/><circle cx="0" cy="-37" r="7" fill="#ffd97a"/><circle cx="24" cy="-36" r="7" fill="#a5d47c"/>';
      var SCHOOL = '<path d="M-80 -70 L0 -118 L80 -70 Z" fill="#8a5a33"/>' +
        '<rect x="-66" y="-70" width="132" height="70" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>' +
        '<rect x="-18" y="-48" width="36" height="48" rx="4" fill="#8a5a33"/>' +
        '<text x="0" y="-78" text-anchor="middle" font-size="16" font-weight="bold" fill="#f4ecd8">學</text>';
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      var BUNDLE = '<circle cx="0" cy="-6" r="11" fill="#e8c48f" stroke="#c9a066" stroke-width="2.4"/><line x1="8" y1="-14" x2="20" y2="-26" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>';
      return [
        { minDur: 7000, sub: '孟子小時候家住墓地旁，天天學人辦喪事、挖墳掃墓。孟母搖搖頭：「這裡不能住！」搬家！',
          html: scene(P(560, 302, GRAVES) +
            P(430, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe'), '', 0, .8) +
            P(220, 302, A('kid', 'sad') + P(-30, -60, BUNDLE, '', 0, .9)) + qmark(180, 185)) },
        { minDur: 7000, sub: '搬到市場旁，孟子又學起小販大聲吆喝、討價還價。孟母又搖頭：「這裡也不行！」再搬！',
          html: scene(P(560, 302, STALL) +
            P(440, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .8) + notes(480, 190) +
            P(220, 302, A('kid', 'sad') + P(-30, -60, BUNDLE, '', 0, .9)) + sweat(180, 200)) },
        { minDur: 7000, sub: '第三次，搬到了學堂旁邊——孟子跟著讀書學禮。孟母終於笑了：「這才是孩子該住的地方！」',
          html: scene(P(560, 302, SCHOOL) +
            P(430, 302, A('kid', 'happy') + P(-36, -50, BOOK, '', 0, .9), '', 0, .8) +
            P(220, 302, A('kid', 'happy')) + hearts(280, 180)) },
        { minDur: 6600, sub: '在好環境裡長大的孟子，後來成了僅次於孔子的大思想家，被尊稱「亞聖」！',
          html: scene(P(400, 302, A('kid', 'happy') + P(-40, -56, BOOK)) +
            P(600, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(500, 170)) },
        { minDur: 6200, sub: '孟母三遷：重視環境對教育的影響。',
          html: scene(P(600, 302, SCHOOL, '', 0, .9) + P(300, 302, A('kid', 'happy') + P(-30, -60, BUNDLE, '', 0, .9)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">孟母三遷</text>') }
      ];
    },
    /* 開卷有益 */
    i1008: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      var STACK = '<g stroke-width="2"><rect x="-34" y="-14" width="68" height="14" rx="3" fill="#c9762f" stroke="#a85a1e"/><rect x="-30" y="-28" width="60" height="14" rx="3" fill="#5c82ba" stroke="#46689a"/><rect x="-32" y="-42" width="64" height="14" rx="3" fill="#6fae58" stroke="#548a40"/><rect x="-28" y="-56" width="56" height="14" rx="3" fill="#e0a458" stroke="#c08838"/></g>';
      return [
        { minDur: 6800, sub: '宋太宗命人編了一部一千卷的大書《太平御覽》，規定自己每天一定要讀三卷。',
          html: scene(P(560, 302, STACK, '', 0, 1.2) +
            P(300, 302, A('kid', 'happy') + CROWN + P(-40, -56, BOOK))) },
        { minDur: 7200, sub: '政事再忙，沒讀完的隔天一定補上。大臣勸他多休息，他說：「只要打開書就有收穫，我一點也不覺得累呀！」',
          html: scene(P(300, 302, A('kid', 'happy') + CROWN + P(-40, -56, BOOK)) + hearts(240, 180) +
            P(580, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(620, 185)) },
        { minDur: 6600, sub: '在皇帝帶頭之下，全國讀書的風氣越來越興盛。',
          html: scene(P(240, 302, A('kid', 'happy') + P(-36, -52, BOOK, '', 0, .9), '', 0, .95) +
            P(420, 302, A('kid', 'happy') + P(-36, -52, BOOK, '', 0, .9), '', .3, .9) +
            P(590, 302, A('kid', 'happy') + P(-36, -52, BOOK, '', 0, .9), '', .5, .85) +
            hearts(400, 160)) },
        { minDur: 6200, sub: '開卷有益：只要打開書本閱讀，就會有收穫。',
          html: scene(P(560, 302, STACK, '', 0, 1.1) + P(300, 302, A('kid', 'happy') + P(-40, -56, BOOK)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">開卷有益</text>') }
      ];
    },
    /* 唇亡齒寒 */
    i045: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var JADE = '<circle cx="0" cy="0" r="16" fill="#8fd0c0" stroke="#5aa896" stroke-width="3"/><circle cx="0" cy="0" r="5.6" fill="#aee3f5" stroke="#5aa896" stroke-width="2"/>';
      var MOUTH = '<path d="M-40 -10 Q0 -34 40 -10 Q0 6 -40 -10 Z" fill="#e8899a" stroke="#c96a7a" stroke-width="3"/>' +
        '<g fill="#fff" stroke="#d5cfc0" stroke-width="1.6"><rect x="-26" y="-16" width="12" height="12" rx="3"/><rect x="-11" y="-18" width="12" height="13" rx="3"/><rect x="4" y="-18" width="12" height="13" rx="3"/><rect x="18" y="-16" width="12" height="12" rx="3"/></g>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 6800, sub: '晉國想攻打虢國，先送上美玉和寶馬給中間的虞國國君，請求借路。',
          html: scene(P(240, 302, A('kid', 'happy') + P(38, -64, JADE, '', 0, .9)) + P(400, 302, A('horse'), '', 0, .9) +
            P(620, 302, A('kid', 'happy') + CROWN, '', 0, 1, true) + hearts(680, 185)) },
        { minDur: 7200, sub: '大臣宮之奇急忙勸阻：「虞虢兩國就像嘴唇和牙齒——嘴唇沒了，牙齒就要受凍呀！千萬不能借！」',
          html: scene(P(400, 190, '<circle cx="0" cy="-12" r="58" fill="#fff" opacity=".9"/>' + MOUTH) +
            P(240, 302, A('kid', 'angry')) + sweat(200, 200) +
            P(620, 302, A('kid', 'happy') + CROWN, '', 0, 1, true) + qmark(670, 190)) },
        { minDur: 6800, sub: '虞君貪圖寶物，不聽勸告，讓晉國大軍借道通過，滅掉了虢國。',
          html: scene(P(200, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut') +
            P(330, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .2, .9) +
            bang(680, 200) +
            P(540, 302, A('kid', 'happy') + CROWN + P(-38, -64, JADE, '', 0, .8), '', 0, .9, true)) },
        { minDur: 7000, sub: '晉軍回程時，順手把虞國也滅了，美玉寶馬又全被拿了回去！虞君後悔莫及。',
          html: scene(P(500, 302, '<g class="st-fleeR">' + A('kid', 'angry') + P(30, -64, JADE, '', 0, .8) + '</g>', 'st-dashL') +
            P(640, 302, A('horse'), 'st-fleeR', .3, .85) +
            P(240, 302, '<g class="st-slump">' + A('kid', 'sad') + CROWN + '</g>') + sweat(280, 200), 'night') },
        { minDur: 6200, sub: '唇亡齒寒：利益相關，禍福相連。',
          html: scene(P(400, 220, '<circle cx="0" cy="-12" r="58" fill="#fff" opacity=".9"/>' + MOUTH) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">唇亡齒寒</text>') }
      ];
    },
    /* 熟能生巧 */
    i1005: function () {
      var TARGET = '<circle cx="0" cy="-50" r="30" fill="#fff" stroke="#c96a5a" stroke-width="4"/><circle cx="0" cy="-50" r="18" fill="none" stroke="#c96a5a" stroke-width="4"/><circle cx="0" cy="-50" r="6" fill="#c96a5a"/><line x1="0" y1="-20" x2="0" y2="0" stroke="#a8734a" stroke-width="5"/>' +
        '<line x1="-3" y1="-52" x2="-26" y2="-58" stroke="#8a5a33" stroke-width="3.4"/><line x1="4" y1="-46" x2="-18" y2="-40" stroke="#8a5a33" stroke-width="3.4"/>';
      var BOW2 = '<path d="M0 -46 q32 24 0 46" fill="none" stroke="#a8734a" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="0" y1="-46" x2="0" y2="0" stroke="#d9cbb0" stroke-width="2.6"/>';
      var GOURD = '<path d="M-10 0 q-12 -8 -8 -20 q3 -9 12 -10 q-8 -6 -5 -14 q4 -9 11 -9 q7 0 11 9 q3 8 -5 14 q9 1 12 10 q4 12 -8 20 z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4" transform="translate(0,-2)"/>';
      var COINOIL = '<circle cx="0" cy="0" r="13" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.6"/><rect x="-4" y="-4" width="8" height="8" fill="#aee3f5" stroke="#c98f2a" stroke-width="1.6"/>' +
        '<line x1="0" y1="-42" x2="0" y2="-5" stroke="#e8b84a" stroke-width="2" opacity=".9"/>';
      return [
        { minDur: 6600, sub: '宋朝的陳堯咨箭術高明，十箭能中八九支，他得意極了。',
          html: scene(P(620, 302, TARGET) +
            P(240, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(30, -40, BOW2, '', 0, .8) + '</g>') + hearts(330, 175)) },
        { minDur: 6600, sub: '路旁賣油的老翁看了，卻只是微微點頭。陳堯咨不高興：「你懂什麼射箭？」',
          html: scene(P(620, 302, TARGET, '', 0, .9) +
            P(280, 302, A('kid', 'angry') + P(30, -40, BOW2, '', 0, .8)) + bang(350, 185) +
            P(520, 302, A('kid', 'happy'), '', 0, .9, true)) },
        { minDur: 7400, sub: '老翁拿出葫蘆，在瓶口放一枚銅錢，高高舉杓倒油——油像一條細線穿過錢孔流進去，銅錢竟一滴也沒沾到！',
          html: scene(P(430, 260, COINOIL, '', 0, 1.2) + P(430, 300, GOURD) +
            P(560, 302, A('kid', 'happy'), '', 0, .95, true) +
            P(260, 302, A('kid', 'wow')) + sweat(310, 195) + bang(360, 160)) },
        { minDur: 6800, sub: '老翁說：「沒什麼特別的，只是手熟罷了。」陳堯咨聽了，心服口服。',
          html: scene(P(520, 302, A('kid', 'happy'), '', 0, .95, true) +
            P(280, 302, A('kid', 'happy')) + hearts(400, 175)) },
        { minDur: 6200, sub: '熟能生巧：做事熟練了，自然產生巧妙的方法。',
          html: scene(P(300, 290, COINOIL, '', 0, 1.2) + P(300, 316, GOURD, '', 0, .9) + P(560, 302, TARGET, '', 0, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">熟能生巧</text>') }
      ];
    },
    /* 名落孫山 */
    i244: function () {
      var LISTBOARD = '<rect x="-40" y="-120" width="80" height="120" rx="5" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>' +
        '<text x="0" y="-100" text-anchor="middle" font-size="15" font-weight="bold" fill="#c96a5a">榜</text>' +
        '<g stroke="#8fa3bf" stroke-width="2.6"><line x1="-24" y1="-84" x2="24" y2="-84"/><line x1="-24" y1="-68" x2="24" y2="-68"/><line x1="-24" y1="-52" x2="24" y2="-52"/><line x1="-24" y1="-36" x2="24" y2="-36"/></g>' +
        '<line x1="-24" y1="-20" x2="24" y2="-20" stroke="#c96a5a" stroke-width="3"/>';
      var BUNDLE = '<circle cx="0" cy="-6" r="11" fill="#e8c48f" stroke="#c9a066" stroke-width="2.4"/><line x1="8" y1="-14" x2="20" y2="-26" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>';
      return [
        { minDur: 6400, sub: '宋朝的孫山和同鄉的兒子，一起上京城趕考。',
          html: scene(P(280, 302, A('kid', 'happy') + P(-30, -60, BUNDLE, '', 0, .9), 'st-strut') +
            P(430, 302, A('kid', 'happy') + P(-30, -60, BUNDLE, '', 0, .9), 'st-strut', .3, .92)) },
        { minDur: 7000, sub: '放榜了！孫山考中了最後一名；同鄉的兒子，榜上卻找不到名字。',
          html: scene(P(430, 302, LISTBOARD) +
            P(250, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(600, 302, A('kid', 'sad'), '', 0, .92) + sweat(640, 200)) },
        { minDur: 7400, sub: '孫山先回到家鄉。同鄉急著問：「我兒子考上了嗎？」他幽默地說：「榜單最後一名是孫山，令郎的名字，還在孫山後面呢。」',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(560, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(610, 185) + sweat(520, 200)) },
        { minDur: 6400, sub: '「名落孫山」從此成了考試沒考上的委婉說法。',
          html: scene(P(430, 302, LISTBOARD, '', 0, .95) + P(620, 302, A('kid', 'sad'), '', 0, .92) + sweat(660, 200)) },
        { minDur: 6200, sub: '名落孫山：考試或選拔沒有錄取。',
          html: scene(P(300, 302, LISTBOARD, '', 0, .95) + P(560, 302, A('kid', 'sad')) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">名落孫山</text>') }
      ];
    },
    /* 毛遂自薦 */
    i266: function () {
      var BAG = '<path d="M-20 0 Q-26 -30 0 -36 Q26 -30 20 0 Z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>' +
        '<path d="M-8 -36 q8 -6 16 0" stroke="#a8734a" stroke-width="3" fill="none"/>' +
        '<path d="M6 -40 l6 -12 l4 13 z" fill="#8b93a3"/>';
      var SWORD2 = '<line x1="0" y1="0" x2="26" y2="-40" stroke="#c4cede" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="4" y1="-12" x2="14" y2="-4" stroke="#c98f2a" stroke-width="4" stroke-linecap="round"/>';
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '秦軍圍攻趙國都城，平原君要挑二十位人才出使楚國求救，挑來挑去，還缺一個人。',
          html: scene(P(180, 302, A('kid', 'sad') + CROWN) + qmark(230, 185) +
            P(400, 302, A('kid', 'happy'), '', 0, .85) + P(510, 302, A('kid', 'happy'), '', .2, .85) +
            P(620, 302, A('kid', 'happy'), '', .4, .85)) },
        { minDur: 7400, sub: '門客毛遂站了出來：「帶我去吧！」平原君說：「人才就像錐子放進布袋，尖端立刻會露出來——你來了三年，我卻沒聽說過你。」',
          html: scene(P(430, 210, '<circle cx="0" cy="-14" r="46" fill="#fff" opacity=".9"/>' + BAG) +
            P(240, 302, A('kid', 'happy')) +
            P(600, 302, A('kid', 'wow') + CROWN, '', 0, .95, true) + qmark(650, 185)) },
        { minDur: 6800, sub: '毛遂不慌不忙：「那是因為我今天才請您把我放進袋子裡呀！」平原君覺得有理，帶上了他。',
          html: scene(P(240, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(600, 302, A('kid', 'happy') + CROWN, '', 0, .95, true) + hearts(420, 175)) },
        { minDur: 7200, sub: '到了楚國，談判僵持不下。毛遂手按寶劍走上前，慷慨陳詞，楚王當場答應出兵救趙！',
          html: scene(P(300, 302, A('kid', 'angry') + P(24, -40, SWORD2)) + bang(380, 170) +
            P(580, 302, A('kid', 'wow') + CROWN, '', 0, 1, true) + sweat(540, 195)) },
        { minDur: 6200, sub: '毛遂自薦：自我推薦，主動爭取任務。',
          html: scene(P(300, 302, A('kid', 'happy'), '', 0, 1.05) + P(560, 260, BAG, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">毛遂自薦</text>') }
      ];
    },
    /* 紙上談兵 */
    i267: function () {
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 7000, sub: '趙國名將趙奢的兒子趙括，從小熟讀兵書，講起打仗頭頭是道，連父親都辯不過他。',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, BOOK)) + notes(380, 170) +
            P(560, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(630, 185)) },
        { minDur: 6600, sub: '可是趙奢搖頭憂心：「打仗是生死大事，他卻說得太輕鬆了。」',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, BOOK)) +
            P(560, 302, A('kid', 'sad'), '', 0, .95, true) + sweat(600, 200) + qmark(520, 180)) },
        { minDur: 6800, sub: '長平之戰，趙王讓趙括代替老將廉頗領兵。他照搬兵書、硬衝硬打——',
          html: scene(P(260, 302, A('kid', 'happy') + P(-40, -56, BOOK) + P(26, -50, SPEAR3), 'st-strut') +
            P(420, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .2, .9) +
            P(560, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .4, .85) + bang(680, 220)) },
        { minDur: 6800, sub: '結果中了秦軍的埋伏，四十萬大軍全軍覆沒。只會背書本，害了整個趙國！',
          html: scene(P(300, 306, '<g class="st-faint">' + A('kid', 'sad') + '</g>', '', 0, .9) +
            P(460, 306, '<g class="st-faint" style="animation-delay:.3s">' + A('kid', 'sad') + '</g>', '', 0, .85) +
            bang(560, 190) + sweat(380, 220), 'night') },
        { minDur: 6200, sub: '紙上談兵：空談理論，不能解決實際問題。',
          html: scene(P(340, 302, A('kid', 'happy') + P(-40, -56, BOOK)) + notes(430, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">紙上談兵</text>') }
      ];
    },
    /* 呆若木雞 */
    i831: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 7000, sub: '紀渻子替齊王訓練鬥雞。十天後齊王問：「練好了嗎？」「還不行——牠又驕傲又浮躁，一碰就跳。」',
          html: scene(P(430, 302, '<g class="st-cheer">' + A('chicken') + '</g>') + bang(490, 230) +
            P(200, 302, A('kid', 'happy') + CROWN) + qmark(250, 185) +
            P(620, 302, A('kid', 'happy'), '', 0, .9)) },
        { minDur: 6800, sub: '又過了幾十天，雞一聽到聲音、看到影子，還是會激動地撲騰——「還是不行。」',
          html: scene(P(430, 302, A('chicken')) + sweat(470, 230) + notes(330, 190) +
            P(620, 302, A('kid', 'sad'), '', 0, .9) + qmark(660, 195)) },
        { minDur: 6800, sub: '最後，這隻雞不管周圍多吵，都站著一動也不動，看上去就像一隻木頭刻的雞——「成了！」',
          html: scene(P(430, 302, A('chicken'), '', 0, 1.1) +
            P(200, 302, A('kid', 'happy') + CROWN) + hearts(280, 185) +
            P(620, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9)) },
        { minDur: 6800, sub: '別的雞一看到牠這副沉穩無畏的氣勢，嚇得掉頭就跑，根本不敢應戰！',
          html: scene(P(340, 302, A('chicken'), '', 0, 1.1) +
            P(560, 302, '<g class="st-fleeR">' + A('chicken') + '</g>', 'st-dashL', 0, .85) +
            P(680, 302, '<g class="st-fleeR" style="animation-delay:.3s">' + A('chicken') + '</g>', 'st-dashL', .3, .8) +
            sweat(540, 230)) },
        { minDur: 6400, sub: '呆若木雞：像木頭雞一樣發呆，今多形容嚇傻或愣住的樣子。',
          html: scene(P(400, 302, A('chicken'), '', 0, 1.2) + qmark(460, 200) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">呆若木雞</text>') }
      ];
    },
    /* 舉一反三 */
    i250: function () {
      function corner(x, y, lit, rot) {
        return P(x, y, '<path d="M-16 0 L0 0 L0 -16" stroke="' + (lit ? '#e0a458' : '#8fa3bf') + '" stroke-width="7" fill="none" stroke-linecap="round" transform="rotate(' + rot + ')"/>');
      }
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      return [
        { minDur: 6800, sub: '孔子教學生時，指著屋子的一個角落說：「我告訴你這一個角是什麼樣子……」',
          html: scene(corner(520, 250, true, 0) +
            P(240, 302, A('kid', 'happy') +
              '<path d="M18 -60 q14 -4 22 2" stroke="#ffe3c1" stroke-width="6" fill="none" stroke-linecap="round"/>') +
            P(430, 302, A('kid', 'happy'), '', 0, .85)) },
        { minDur: 7000, sub: '「如果你不能自己推想出另外三個角的樣子，我就不再往下教了。」',
          html: scene(corner(430, 190, true, 0) + corner(560, 190, false, 90) +
            corner(560, 280, false, 180) + corner(430, 280, false, 270) +
            qmark(495, 230) +
            P(220, 302, A('kid', 'happy')) + P(680, 302, A('kid', 'wow'), '', 0, .85)) },
        { minDur: 6800, sub: '學生們學著從一件事推想出許多道理，越學越聰明、越學越通透！',
          html: scene(P(300, 302, A('kid', 'happy') + P(-36, -52, BOOK, '', 0, .9)) +
            P(470, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', .2, .9) +
            P(620, 302, A('kid', 'happy') + P(-36, -52, BOOK, '', 0, .9), '', .4, .85) +
            hearts(400, 165) + bang(540, 170)) },
        { minDur: 6200, sub: '舉一反三：從一件事，類推明白其他許多事。',
          html: scene(corner(300, 240, true, 0) + corner(430, 240, false, 90) + corner(530, 240, false, 90) + corner(630, 240, false, 90) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">舉一反三</text>') }
      ];
    },
    /* 螳螂捕蟬 */
    i1071: function () {
      var MANTIS2 = '<ellipse cx="6" cy="-10" rx="12" ry="6.5" fill="#8fc866" stroke="#6da844" stroke-width="1.8"/>' +
        '<circle cx="-8" cy="-19" r="5.5" fill="#8fc866" stroke="#6da844" stroke-width="1.8"/>' +
        '<circle cx="-10" cy="-20" r="1.6" fill="#3a2e26"/>' +
        '<path d="M-13 -16 q-8 -5 -9 -12 l3 -2 q2 7 8 10 z M-4 -15 q-2 -9 3 -13 l3 2 q-4 5 -2 10 z" fill="#6da844"/>';
      var CICADA = '<ellipse cx="0" cy="0" rx="9" ry="6" fill="#8a7a5a" stroke="#6d6044" stroke-width="1.8"/>' +
        '<path d="M2 -3 q10 -5 16 0 q-6 6 -16 3 z" fill="#c9d6b8" opacity=".85"/>' +
        '<circle cx="-7" cy="-2" r="1.6" fill="#3a2e26"/>';
      var SLINGSHOT = '<path d="M0 0 L0 -18 M0 -18 L-9 -32 M0 -18 L9 -32" stroke="#a8734a" stroke-width="4.6" fill="none" stroke-linecap="round"/>' +
        '<path d="M-9 -32 Q0 -24 9 -32" stroke="#8b93a3" stroke-width="2.4" fill="none"/>';
      var BIGTREE = '<rect x="-11" y="-120" width="22" height="120" rx="8" fill="#a8734a"/>' +
        '<circle cx="0" cy="-150" r="44" fill="#7cc47f"/><circle cx="-38" cy="-126" r="28" fill="#8fd08f"/><circle cx="38" cy="-128" r="30" fill="#8fd08f"/>';
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 6600, sub: '吳王執意要出兵攻打楚國，還下令：「誰敢勸阻，就處死誰！」',
          html: scene(P(300, 302, A('kid', 'angry') + CROWN) + bang(380, 180) +
            P(560, 302, A('kid', 'sad'), '', 0, .9) + sweat(600, 200)) },
        { minDur: 6800, sub: '一位少年連著三天拿彈弓在後園裡轉。吳王好奇：「你在做什麼？」他說：「大王，您看那棵樹上——」',
          html: scene(P(560, 302, BIGTREE) +
            P(260, 302, A('kid', 'happy') + P(30, -44, SLINGSHOT)) +
            P(420, 302, A('kid', 'happy') + CROWN, '', 0, .95, true) + qmark(460, 185)) },
        { minDur: 8000, sub: '「蟬在高處喝露水，不知道螳螂在牠身後；螳螂想捕蟬，不知道黃雀在牠後面；黃雀想吃螳螂，卻不知道我的彈弓正瞄準著牠！」',
          html: scene(P(560, 302, BIGTREE) +
            P(500, 150, CICADA) + P(555, 165, MANTIS2) + P(625, 155, A('bird'), '', 0, .75) +
            P(300, 302, A('kid', 'happy') + P(30, -44, SLINGSHOT)) +
            qmark(500, 110) + qmark(580, 120)) },
        { minDur: 7000, sub: '吳王恍然大悟：「只顧眼前的利益，不顧身後的危險，太危險了！」立刻取消了出兵。',
          html: scene(P(400, 302, A('kid', 'wow') + CROWN) + bang(470, 175) +
            P(220, 302, A('kid', 'happy'), '', 0, .9) + hearts(310, 190)) },
        { minDur: 6400, sub: '螳螂捕蟬，黃雀在後：只顧眼前利益，不顧身後禍患。',
          html: scene(P(240, 260, CICADA, '', 0, 1.4) + P(380, 268, MANTIS2, '', 0, 1.5) + P(540, 250, A('bird'), '', 0, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="50" font-weight="bold" fill="#4a3200">螳螂捕蟬</text>') }
      ];
    },
    /* 口蜜腹劍 */
    i861: function () {
      var HONEY = '<path d="M0 0 q-7 10 0 16 q7 -6 0 -16 z" fill="#e8b84a"/>';
      var DAGGER = '<line x1="0" y1="0" x2="18" y2="-26" stroke="#c4cede" stroke-width="4.6" stroke-linecap="round"/>' +
        '<line x1="3" y1="-8" x2="11" y2="-2" stroke="#c98f2a" stroke-width="3.4" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '唐朝宰相李林甫，見了人總是滿臉堆笑，說出來的話甜得像抹了蜜。',
          html: scene(P(340, 302, A('kid', 'happy') + P(30, -46, HONEY)) + hearts(430, 180) +
            P(580, 302, A('kid', 'happy'), '', 0, .95, true)) },
        { minDur: 6800, sub: '可是一轉身，他就在背地裡設計陷害比他有才能的人。',
          html: scene(P(340, 302, A('kid', 'happy') + P(-34, -40, DAGGER, '', 0, .9)) +
            P(580, 306, '<g class="st-faint">' + A('kid', 'sad') + '</g>', '', 0, .9) + sweat(620, 210) + bang(500, 190), 'night') },
        { minDur: 6800, sub: '大家漸漸看穿了他：「李林甫嘴上像抹了蜜，肚子裡卻藏著一把劍！」人人對他又怕又防。',
          html: scene(P(340, 302, A('kid', 'happy') + P(0, -96, HONEY) + P(-14, -30, DAGGER, '', 0, .8)) +
            P(560, 302, A('kid', 'wow'), '', 0, .9) + sweat(600, 200) +
            P(680, 302, A('kid', 'sad'), '', .3, .85)) },
        { minDur: 6200, sub: '口蜜腹劍：嘴上甜如蜜，心裡藏著劍，形容人陰險。',
          html: scene(P(320, 250, HONEY, '', 0, 1.8) + P(500, 260, DAGGER, '', 0, 1.5) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">口蜜腹劍</text>') }
      ];
    },
    /* 世外桃源 */
    i841: function () {
      var RIVERW = '<rect y="266" width="800" height="74" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 276 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>';
      var BOAT2 = '<path d="M-52 0 L52 0 L38 18 L-38 18 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>';
      function peach(x, y, sc) {
        return P(x, y, '<rect x="-7" y="-38" width="14" height="38" rx="6" fill="#a8734a"/>' +
          '<circle cx="0" cy="-52" r="24" fill="#f7b8cc"/><circle cx="-19" cy="-40" r="15" fill="#fbc9d9"/><circle cx="19" cy="-42" r="16" fill="#fbc9d9"/>' +
          '<circle cx="-6" cy="-58" r="3.4" fill="#fff"/><circle cx="10" cy="-46" r="3.4" fill="#fff"/>', '', 0, sc);
      }
      var CAVE = '<path d="M-60 0 L-60 -40 Q-60 -110 0 -110 Q60 -110 60 -40 L60 0 Z" fill="#8a7a66"/>' +
        '<path d="M-26 0 Q-26 -52 0 -52 Q26 -52 26 0 Z" fill="#4a4238"/>' +
        '<circle cx="0" cy="-24" r="9" fill="#ffe9a0" opacity=".9"/>';
      var HOUSE3 = '<path d="M-40 -34 L0 -60 L40 -34 Z" fill="#8a5a33"/><rect x="-32" y="-34" width="64" height="34" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.4"/><rect x="-9" y="-24" width="18" height="24" rx="3" fill="#8a5a33"/>';
      return [
        { minDur: 6800, sub: '東晉有位漁夫，沿著小溪划船——兩岸忽然開滿了桃花，粉紅一片，美得像畫一樣。',
          html: scene(RIVERW + peach(120, 270, 1) + peach(680, 268, 1.05) + peach(250, 274, .8) +
            P(430, 272, BOAT2 + P(0, 0, A('kid', 'happy'), '', 0, .8)) + hearts(500, 180)) },
        { minDur: 6600, sub: '溪水的盡頭有座小山，山腳下有個洞口，隱隱透著光。他把船靠岸，鑽了進去——',
          html: scene(P(560, 302, CAVE) + peach(180, 300, .95) +
            P(360, 302, A('kid', 'wow'), 'st-inR') + qmark(410, 190)) },
        { minDur: 7200, sub: '眼前豁然開朗：良田美屋、雞犬相聞，人人安居樂業，見了生人也笑臉相迎！',
          html: scene(P(180, 302, HOUSE3) + P(650, 302, HOUSE3, '', 0, .9) +
            P(300, 302, A('kid', 'happy'), '', 0, .9) + P(430, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', .3, .85) +
            P(540, 300, A('chicken'), '', 0, .8) + P(620, 300, A('dog'), '', .3, .8) +
            hearts(400, 165) + peach(80, 300, .8)) },
        { minDur: 7000, sub: '漁夫回家之後，再想帶人去尋找，卻怎麼也找不到那個入口了。「世外桃源」從此成了理想世界的代名詞。',
          html: scene(peach(560, 300, 1) + peach(680, 298, .85) +
            P(300, 302, A('kid', 'sad')) + qmark(360, 185) + sweat(250, 200)) },
        { minDur: 6200, sub: '世外桃源：與世隔絕、安樂美好的理想世界。',
          html: scene(peach(180, 302, 1) + P(600, 302, HOUSE3) + P(400, 302, A('kid', 'happy'), '', 0, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">世外桃源</text>') }
      ];
    },
    /* 圖窮匕見 */
    i371: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var DAGGER2 = '<line x1="0" y1="0" x2="16" y2="-24" stroke="#c4cede" stroke-width="4.6" stroke-linecap="round"/>' +
        '<line x1="3" y1="-8" x2="11" y2="-2" stroke="#c98f2a" stroke-width="3.4" stroke-linecap="round"/>';
      var SCROLLROLLED = '<rect x="-30" y="-10" width="60" height="20" rx="9" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<circle cx="-30" cy="0" r="10" fill="#d5c9a8" stroke="#c9bfa8" stroke-width="2"/><circle cx="30" cy="0" r="10" fill="#d5c9a8" stroke="#c9bfa8" stroke-width="2"/>';
      function scrollOpen(withDagger) {
        var s = '<rect x="-90" y="-30" width="180" height="60" rx="4" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.6"/>' +
          '<circle cx="-90" cy="0" r="11" fill="#d5c9a8" stroke="#c9bfa8" stroke-width="2"/><circle cx="90" cy="0" r="11" fill="#d5c9a8" stroke="#c9bfa8" stroke-width="2"/>' +
          '<path d="M-70 8 q20 -26 44 -6 q22 18 42 -4 q14 -14 30 -2" stroke="#8fa3bf" stroke-width="3" fill="none"/>';
        if (withDagger) s += P(58, -4, DAGGER2, '', 0, 1.2);
        return s;
      }
      var PILLAR = '<rect x="-14" y="-150" width="28" height="150" rx="6" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>';
      return [
        { minDur: 6800, sub: '燕太子丹派荊軻去刺殺秦王。荊軻捧著燕國的地圖上殿，假裝要獻上土地。',
          html: scene(P(280, 302, A('kid', 'happy') + P(36, -60, SCROLLROLLED, '', 0, .8)) +
            P(600, 302, A('kid', 'happy') + CROWN, '', 0, 1, true)) },
        { minDur: 7000, sub: '秦王在殿上緩緩展開地圖，一卷、一卷……攤到盡頭——竟露出一把匕首！',
          html: scene(P(430, 240, scrollOpen(true)) + bang(540, 190) +
            P(620, 302, A('kid', 'wow') + CROWN, '', 0, 1, true) + sweat(660, 200) +
            P(240, 302, A('kid', 'angry'))) },
        { minDur: 6800, sub: '荊軻一把抓起匕首刺向秦王！秦王嚇得繞著柱子逃命，驚險萬分。',
          html: scene(P(430, 302, PILLAR) +
            P(300, 302, A('kid', 'angry') + P(28, -50, DAGGER2), 'st-dashL') +
            P(560, 302, '<g class="st-fleeR">' + A('kid', 'wow') + CROWN + '</g>') + sweat(600, 190) + bang(430, 150)) },
        { minDur: 6600, sub: '刺殺終究沒有成功，荊軻被侍衛所殺。但「圖窮匕見」這個成語流傳了下來。',
          html: scene(P(340, 306, '<g class="st-faint">' + A('kid', 'sad') + '</g>') +
            P(560, 302, A('kid', 'angry'), '', 0, .9) + P(670, 302, A('kid', 'angry'), '', .2, .85), 'night') },
        { minDur: 6200, sub: '圖窮匕見：事情發展到最後，真相或本意顯露出來。',
          html: scene(P(400, 250, scrollOpen(true), '', 0, 1.15) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">圖窮匕見</text>') }
      ];
    },
    /* 圍魏救趙 */
    i922: function () {
      var WALL2 = '<rect x="-80" y="-70" width="160" height="70" fill="#b0a390" stroke="#8a7a66" stroke-width="3"/>' +
        '<path d="M-80 -70 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20" fill="none" stroke="#8a7a66" stroke-width="3"/>' +
        '<rect x="-18" y="-44" width="36" height="44" rx="4" fill="#6d6357"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      function troop(x, cls, dly, sc, flip) { return P(x, 302, A('kid', 'angry') + P(26, -50, SPEAR3), cls, dly, sc || .85, flip); }
      return [
        { minDur: 6800, sub: '魏國大軍團團圍住趙國都城邯鄲，趙國急忙派人向齊國求救。',
          html: scene(P(560, 302, WALL2) +
            troop(400, '', 0, .8) + troop(700, '', .2, .75, true) +
            P(160, 302, A('kid', 'sad'), 'st-dashL', 0, .9) + sweat(200, 200)) },
        { minDur: 7400, sub: '齊將田忌想直奔邯鄲硬拚，軍師孫臏搖頭：「魏國的精兵全在趙國，老巢大梁一定空虛——我們直接攻打大梁！」',
          html: scene(P(280, 302, A('kid', 'angry') + P(26, -50, SPEAR3)) +
            P(520, 302, A('kid', 'happy'), '', 0, .95, true) + bang(430, 170) + qmark(240, 180)) },
        { minDur: 6800, sub: '齊軍直撲大梁，魏軍大驚失色，只好丟下邯鄲，日夜兼程趕回去救援。',
          html: scene(troop(220, 'st-strut', 0, .9) + troop(340, 'st-strut', .2, .85) +
            P(560, 302, '<g class="st-fleeR">' + A('kid', 'wow') + P(26, -50, SPEAR3) + '</g>', 'st-dashL', 0, .85) +
            P(680, 302, '<g class="st-fleeR" style="animation-delay:.2s">' + A('kid', 'wow') + P(26, -50, SPEAR3) + '</g>', 'st-dashL', .2, .8) +
            sweat(600, 200)) },
        { minDur: 7000, sub: '孫臏早在半路設好埋伏，把疲累不堪的魏軍打得大敗——邯鄲之圍，不攻自解！',
          html: scene(P(120, 302, TREE) + bang(400, 190) +
            troop(300, '', 0, .9) +
            P(500, 306, '<g class="st-faint">' + A('kid', 'sad') + '</g>', '', 0, .85) +
            P(620, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(680, 190)) },
        { minDur: 6400, sub: '圍魏救趙：不正面迎擊，改攻敵方要害來解圍。',
          html: scene(P(560, 302, WALL2, '', 0, .9) + P(260, 302, A('kid', 'happy') + P(26, -50, SPEAR3)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">圍魏救趙</text>') }
      ];
    },
    /* 對症下藥 */
    i636: function () {
      var MEDBAG1 = '<path d="M-14 0 Q-18 -22 0 -26 Q18 -22 14 0 Z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"/><line x1="-6" y1="-26" x2="6" y2="-26" stroke="#a8734a" stroke-width="3"/>';
      var MEDBAG2 = '<rect x="-14" y="-24" width="28" height="24" rx="5" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2.4"/><line x1="-14" y1="-12" x2="14" y2="-12" stroke="#6d87ab" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '名醫華佗遇到兩位病人，都是頭痛發燒，症狀看起來一模一樣。',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(520, 302, A('kid', 'sad'), '', 0, .9) + sweat(550, 200) +
            P(660, 302, A('kid', 'sad'), '', .3, .88) + sweat(690, 205)) },
        { minDur: 6800, sub: '華佗細細把脈之後，開出的藥方竟然完全不同！兩人都很疑惑。',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(520, 302, A('kid', 'wow') + P(-34, -56, MEDBAG1, '', 0, .9), '', 0, .9) + qmark(560, 185) +
            P(670, 302, A('kid', 'wow') + P(-34, -56, MEDBAG2, '', 0, .9), '', .3, .88) + qmark(710, 195)) },
        { minDur: 7200, sub: '華佗解釋：「你們的病因不同——一個病在腸胃、一個病在體表。病根不一樣，藥當然也不一樣！」',
          html: scene(P(300, 302, A('kid', 'happy') +
              '<path d="M18 -60 q14 -4 22 2" stroke="#ffe3c1" stroke-width="6" fill="none" stroke-linecap="round"/>') +
            P(520, 302, A('kid', 'happy'), '', 0, .9) + P(670, 302, A('kid', 'happy'), '', .3, .88) +
            hearts(430, 175)) },
        { minDur: 6600, sub: '兩人照著各自的藥方吃藥，第二天全都好了！找對病因、下對藥，才治得好病。',
          html: scene(P(520, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            P(670, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .88) +
            P(300, 302, A('kid', 'happy')) + hearts(590, 170)) },
        { minDur: 6200, sub: '對症下藥：針對問題的根源採取對策。',
          html: scene(P(320, 280, MEDBAG1, '', 0, 1.4) + P(500, 282, MEDBAG2, '', 0, 1.4) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">對症下藥</text>') }
      ];
    },
    /* 洛陽紙貴 */
    i320: function () {
      var BRUSH = '<line x1="0" y1="0" x2="14" y2="-34" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M0 0 q-3 6 -1 11 q4 -2 5 -8 z" fill="#3a2e26"/>';
      function paper(x, y, rot) {
        return P(x, y, '<rect x="-14" y="-20" width="28" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(' + rot + ')"/>' +
          '<path d="M-8 -12 h16 M-8 -4 h16 M-8 4 h16" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(' + rot + ')"/>');
      }
      var COIN = '<circle cx="0" cy="0" r="10" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/><rect x="-3.4" y="-3.4" width="6.8" height="6.8" fill="none" stroke="#c98f2a" stroke-width="2"/>';
      return [
        { minDur: 6600, sub: '晉朝的左思其貌不揚，卻立下大志：要寫出一篇傳世的大文章〈三都賦〉。',
          html: scene(P(340, 302, A('kid', 'happy') + P(24, -44, BRUSH)) + paper(450, 290, 6) + hearts(280, 180)) },
        { minDur: 6800, sub: '他構思了整整十年，家裡牆上、門上到處掛著紙筆，想到一句，就立刻記下來。',
          html: scene(paper(150, 200, -8) + paper(250, 170, 5) + paper(560, 190, -5) + paper(660, 220, 8) +
            P(400, 302, A('kid', 'happy') + P(24, -44, BRUSH)) + bang(480, 200)) },
        { minDur: 6800, sub: '〈三都賦〉一完成就轟動天下，大家爭先恐後地借來抄寫傳閱——',
          html: scene(P(240, 302, A('kid', 'happy') + P(24, -44, BRUSH), '', 0, .9) +
            P(420, 302, A('kid', 'happy') + P(24, -44, BRUSH), '', .2, .88) +
            P(600, 302, A('kid', 'happy') + P(24, -44, BRUSH), '', .4, .86) +
            paper(330, 280, -6) + paper(510, 282, 7) + hearts(420, 165)) },
        { minDur: 7000, sub: '抄的人實在太多，洛陽城的紙都被買光了，紙價一路大漲！這就是「洛陽紙貴」。',
          html: scene(paper(300, 290, -5) + paper(340, 284, 6) + paper(380, 292, -3) +
            P(540, 250, COIN, '', 0, 1.2) + P(580, 220, COIN, '', .2, 1) + P(615, 190, COIN, '', .4, .85) +
            '<path d="M520 270 L640 170" stroke="#e0a458" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 8"/>' +
            bang(660, 150)) },
        { minDur: 6200, sub: '洛陽紙貴：著作風行一時，流傳甚廣。',
          html: scene(paper(280, 290, -6) + paper(340, 282, 5) + P(540, 270, COIN, '', 0, 1.4) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">洛陽紙貴</text>') }
      ];
    },
    /* 狡兔三窟 */
    i840: function () {
      function hole(x, y, sc) {
        return P(x, y, '<ellipse cx="0" cy="0" rx="26" ry="12" fill="#4a4238"/><path d="M-30 2 a30 14 0 0 1 60 0" fill="none" stroke="#8a7a66" stroke-width="4"/>', '', 0, sc || 1);
      }
      return [
        { minDur: 6600, sub: '聰明的兔子不會只挖一個洞——牠在山坡上，準備了三個洞穴！',
          html: scene(hole(220, 316) + hole(430, 320, .9) + hole(640, 314, .95) +
            P(330, 300, A('rabbit')) + hearts(390, 200)) },
        { minDur: 6800, sub: '獵狗追來了！兔子鑽進第一個洞；洞口被堵住，牠立刻從第二個洞溜了出去！',
          html: scene(hole(220, 316) + hole(430, 320, .9) + hole(640, 314, .95) +
            P(150, 300, A('dog'), 'st-dashL') + bang(220, 260) +
            P(560, 300, '<g class="st-fleeR">' + A('rabbit') + '</g>') + sweat(500, 240)) },
        { minDur: 7200, sub: '戰國時，門客馮諼也用同樣的道理，替孟嘗君安排了三條後路，果然在他失勢時保住了平安。',
          html: scene(P(280, 302, A('kid', 'happy')) +
            P(520, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(400, 175) +
            hole(660, 318, .8)) },
        { minDur: 6200, sub: '狡兔三窟：預留多條退路，以保安全。',
          html: scene(hole(200, 316) + hole(400, 320, .9) + hole(600, 314, .95) + P(300, 300, A('rabbit')) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">狡兔三窟</text>') }
      ];
    },
    /* 草木皆兵 */
    i1107: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      var MTGRASS = '<path d="M-160 0 L0 -170 L160 0 Z" fill="#8fb0a0"/>' +
        '<g class="st-grow" stroke="#4a7a38" stroke-width="4.6" fill="none" stroke-linecap="round">' +
        '<path d="M-70 -30 q-4 -22 -12 -28 M-70 -30 q6 -24 12 -30 M0 -80 q-4 -20 -10 -26 M0 -80 q6 -22 12 -26 M60 -40 q-4 -20 -12 -26 M60 -40 q6 -22 12 -26"/></g>';
      return [
        { minDur: 7000, sub: '前秦苻堅率八十萬大軍南下攻晉，驕傲地說：「我軍把馬鞭丟進江裡，都能截斷江水！」',
          html: scene(P(240, 302, A('kid', 'angry') + CROWN) + bang(320, 175) +
            P(480, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', 0, .85) +
            P(600, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', .2, .8) +
            P(700, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', .4, .78)) },
        { minDur: 7400, sub: '沒想到先鋒一交戰就吃了敗仗。苻堅登上城樓遠望——八公山上的草木隨風搖動，他竟看成了滿山遍野的晉兵！',
          html: scene(P(560, 302, MTGRASS) +
            P(240, 302, A('kid', 'wow') + CROWN) + sweat(200, 195) + sweat(290, 200) + qmark(320, 165)) },
        { minDur: 7000, sub: '秦軍從此人心惶惶。淝水一戰大敗，士兵們聽到風聲鶴叫，都以為追兵來了，沒命地奔逃！',
          html: scene(P(400, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .9) +
            P(540, 302, '<g class="st-fleeR" style="animation-delay:.2s">' + A('kid', 'wow') + '</g>', 'st-dashL', .2, .85) +
            P(670, 302, '<g class="st-fleeR" style="animation-delay:.4s">' + A('kid', 'wow') + '</g>', 'st-dashL', .4, .8) +
            notes(200, 150) + P(150, 160, A('bird')) + sweat(480, 200), 'night') },
        { minDur: 6400, sub: '草木皆兵：把草木都看成敵兵，形容驚慌疑懼、自相驚擾。',
          html: scene(P(560, 302, MTGRASS, '', 0, .9) + P(240, 302, A('kid', 'wow') + CROWN) + sweat(290, 200) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">草木皆兵</text>') }
      ];
    },
    /* 一諾千金 */
    i1179: function () {
      var GOLD = '<g stroke-width="2"><path d="M-26 0 l8 -14 h36 l8 14 z" fill="#ffd97a" stroke="#e8b84a"/><path d="M-20 -14 l7 -12 h26 l7 12 z" fill="#ffe9a0" stroke="#e8b84a"/></g>';
      var CHECKBUBBLE = '<path d="M-34 -20 a30 24 0 1 1 60 8 q-2 10 -14 12 l-16 14 l2 -14 q-28 -2 -32 -20 z" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<path d="M-14 -12 l8 10 l16 -18" stroke="#548a40" stroke-width="5" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '漢朝的季布為人爽快守信——只要是他答應過的事，就一定做到。',
          html: scene(P(340, 302, A('kid', 'happy') + P(40, -80, CHECKBUBBLE, '', 0, .8)) +
            P(580, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(470, 180)) },
        { minDur: 6800, sub: '楚地流傳著一句話：「得到黃金百斤，不如得到季布的一句承諾！」',
          html: scene(P(240, 290, GOLD, '', 0, 1.2) + P(430, 240, CHECKBUBBLE, '', 0, 1.1) +
            '<text x="330" y="240" text-anchor="middle" font-size="26" font-weight="bold" fill="#4a3200">＜</text>' +
            P(620, 302, A('kid', 'happy'), '', 0, .95) + hearts(680, 195)) },
        { minDur: 7000, sub: '後來季布遭到追捕，許多人冒著危險輪流保護他——平日一諾千金的信用，救了他的性命。',
          html: scene(P(430, 302, A('kid', 'sad'), '', 0, .9) +
            P(300, 302, A('kid', 'angry')) + P(560, 302, A('kid', 'angry'), '', 0, .95, true) +
            hearts(430, 175)) },
        { minDur: 6200, sub: '一諾千金：一句承諾價值千金，說話極守信用。',
          html: scene(P(300, 290, GOLD, '', 0, 1.3) + P(520, 250, CHECKBUBBLE, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一諾千金</text>') }
      ];
    },
    /* 江郎才盡 */
    i1114: function () {
      var BRUSH5 = '<line x1="0" y1="0" x2="16" y2="-38" stroke="#a8734a" stroke-width="4.6" stroke-linecap="round"/>' +
        '<path d="M0 0 q-3 7 -1 12 q4 -2 5 -9 z" fill="#3a2e26"/>' +
        '<g stroke-width="3.4" stroke-linecap="round"><line x1="4" y1="-10" x2="7" y2="-17" stroke="#e85a4f"/><line x1="7" y1="-17" x2="10" y2="-24" stroke="#e0a458"/><line x1="10" y1="-24" x2="13" y2="-31" stroke="#548a40"/><line x1="13" y1="-31" x2="16" y2="-38" stroke="#5c82ba"/></g>';
      function paper2(x, y, blank) {
        return P(x, y, '<rect x="-14" y="-20" width="28" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/>' +
          (blank ? '' : '<path d="M-8 -12 h16 M-8 -4 h16 M-8 4 h16 M-8 12 h10" stroke="#8fa3bf" stroke-width="1.8"/>'));
      }
      return [
        { minDur: 6800, sub: '南朝的江淹年輕時文思泉湧，文章寫得又快又好，人人稱讚這位「江郎」。',
          html: scene(P(320, 302, A('kid', 'happy') + P(24, -44, BRUSH5)) +
            paper2(460, 286, false) + paper2(520, 292, false) + hearts(250, 180)) },
        { minDur: 7400, sub: '有一夜，他夢見神人對他說：「我有一支五色筆放在你那裡多年，該還我了。」江淹從懷中掏出五彩筆，還了回去。',
          html: scene(P(430, 180, '<circle cx="0" cy="0" r="62" fill="#fff" opacity=".85"/>' + P(-10, 34, BRUSH5, '', 0, 1.1)) +
            P(300, 302, A('kid', 'happy'), '', 0, .95) + zzz(220, 220), 'night') },
        { minDur: 6800, sub: '醒來之後，他提筆半天，一個好句子也寫不出來了。大家嘆息：「江郎才盡了呀！」',
          html: scene(P(320, 302, A('kid', 'sad') + P(24, -44, '<line x1="0" y1="0" x2="14" y2="-34" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 0 q-3 6 -1 11 q4 -2 5 -8 z" fill="#3a2e26"/>')) +
            paper2(460, 288, true) + sweat(280, 195) + qmark(400, 175)) },
        { minDur: 6200, sub: '江郎才盡：比喻才思枯竭，寫不出好作品。',
          html: scene(P(320, 280, BRUSH5, '', 0, 1.4) + paper2(520, 280, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">江郎才盡</text>') }
      ];
    },
    /* 曾參殺人 */
    i1048: function () {
      var LOOM2 = '<path d="M-50 0 L-50 -80 L50 -80 L50 0" stroke="#a8734a" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<rect x="-42" y="-72" width="84" height="40" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2"/>' +
        '<g stroke="#c9d6e8" stroke-width="1.8"><line x1="-42" y1="-62" x2="42" y2="-62"/><line x1="-42" y1="-52" x2="42" y2="-52"/><line x1="-42" y1="-42" x2="42" y2="-42"/></g>';
      var WALLE = '<rect x="-14" y="-96" width="28" height="96" fill="#b0a390" stroke="#8a7a66" stroke-width="2.6"/><path d="M-14 -96 h9 v-10 h10 v10 h9" fill="none" stroke="#8a7a66" stroke-width="2.6"/>';
      return [
        { minDur: 6800, sub: '曾參是孔子門下有名的賢人。有一天，一個和他同名同姓的人殺了人，消息很快傳開——',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(560, 302, A('kid', 'wow'), '', 0, .9) + bang(620, 185) + qmark(500, 180)) },
        { minDur: 6800, sub: '第一個人跑來喊：「曾參殺人了！」曾母頭也不抬：「我兒子絕不會殺人。」照樣安心織布。',
          html: scene(P(320, 302, LOOM2 + P(52, 0, A('kid', 'happy'), '', 0, .9)) +
            P(600, 302, A('kid', 'wow'), 'st-dashL', 0, .9) + bang(660, 190)) },
        { minDur: 6600, sub: '第二個人又跑來說。曾母仍然不信——但織布的手，慢了下來……',
          html: scene(P(320, 302, LOOM2 + P(52, 0, A('kid', 'wow'), '', 0, .9)) + sweat(400, 210) +
            P(600, 302, A('kid', 'wow'), 'st-dashL', 0, .9) + qmark(430, 175)) },
        { minDur: 7000, sub: '第三個人再跑來喊——曾母嚇得丟下織布機，翻牆逃走了！謠言說了三遍，連最信任兒子的母親都動搖了。',
          html: scene(P(280, 302, LOOM2) + P(560, 302, WALLE) +
            P(470, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .95) + sweat(430, 200) +
            P(160, 302, A('kid', 'wow'), '', 0, .85) + bang(200, 190)) },
        { minDur: 6400, sub: '曾參殺人：謠言傳的次數多了，連最信任的人也會動搖。',
          html: scene(P(300, 302, LOOM2, '', 0, .9) + P(560, 302, A('kid', 'wow')) + qmark(620, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">曾參殺人</text>') }
      ];
    },
    /* 抱薪救火 */
    i1049: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var WOODARM = '<g stroke="#a8734a" stroke-width="6" stroke-linecap="round"><line x1="-20" y1="-40" x2="16" y2="-52"/><line x1="-18" y1="-34" x2="18" y2="-44"/><line x1="-16" y1="-46" x2="14" y2="-58"/></g>';
      function fire(x, y, sc) {
        return P(x, y, '<g class="st-flick"><path d="M0 -8 q-16 -20 0 -38 q3 11 11 15 q9 -9 7 -18 q13 16 2 34 q-9 11 -20 7 z" fill="#ff9c40"/>' +
          '<path d="M2 -10 q-8 -11 0 -22 q7 9 9 13 q3 9 -9 9 z" fill="#ffd166"/></g>' +
          '<path d="M-18 0 l12 -7 l13 9 l11 -9 M-16 6 l33 -2" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/>', '', 0, sc || 1);
      }
      return [
        { minDur: 6800, sub: '戰國末年，秦國不斷攻打魏國。魏王害怕了：「割幾座城給秦國，換個平安吧！」',
          html: scene(P(300, 302, A('kid', 'sad') + CROWN) + sweat(250, 195) +
            bang(600, 200) + P(680, 302, A('kid', 'angry'), '', 0, .9)) },
        { minDur: 7400, sub: '大臣蘇代勸他：「用土地去討好秦國，就像抱著柴草去救火——柴一天不燒完，火就一天不會滅呀！」',
          html: scene(fire(560, 300, 1.2) +
            P(330, 302, A('kid', 'happy') + WOODARM, 'st-inL') +
            P(160, 302, A('kid', 'wow') + CROWN, '', 0, .95) + qmark(210, 180)) },
        { minDur: 7000, sub: '魏王不聽，一次又一次割地求和；秦國的胃口卻越來越大，最後魏國還是滅亡了。',
          html: scene(fire(430, 300, 1.5) + fire(620, 302, 1.1) +
            P(200, 302, '<g class="st-slump">' + A('kid', 'sad') + CROWN + '</g>') + sweat(250, 200), 'night') },
        { minDur: 6400, sub: '抱薪救火：用錯誤的方法消除禍患，反而使禍患擴大。',
          html: scene(fire(520, 300, 1.3) + P(300, 302, A('kid', 'sad') + WOODARM) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">抱薪救火</text>') }
      ];
    },
    /* 投鼠忌器 */
    i1047: function () {
      var VASE = '<path d="M-13 0 Q-20 -12 -13 -26 Q-6 -34 -9 -44 L9 -44 Q6 -34 13 -26 Q20 -12 13 0 Z" fill="#8fd0c0" stroke="#5aa896" stroke-width="2.6"/>' +
        '<path d="M-8 -20 q8 -6 16 0" stroke="#5aa896" stroke-width="2" fill="none"/>' +
        '<ellipse cx="0" cy="-44" rx="9" ry="3" fill="#5aa896"/>';
      var STICK = '<line x1="0" y1="0" x2="30" y2="-46" stroke="#a8734a" stroke-width="5.5" stroke-linecap="round"/>';
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '一隻老鼠，躲在珍貴的瓷瓶旁邊。有人高高舉起棍子要打——卻遲遲不敢揮下去。',
          html: scene(P(520, 302, VASE, '', 0, 1.2) + P(580, 300, A('mouse'), '', 0, .9) +
            P(300, 302, A('kid', 'angry') + P(20, -34, STICK)) + sweat(260, 195)) },
        { minDur: 6600, sub: '「打下去，萬一砸破了寶貝瓷瓶，怎麼辦？」他顧忌著，只能乾瞪眼。',
          html: scene(P(520, 302, VASE, '', 0, 1.2) + P(580, 300, A('mouse'), '', 0, .9) +
            P(300, 302, A('kid', 'wow') + P(20, -34, STICK)) + qmark(360, 175) + sweat(250, 195)) },
        { minDur: 7400, sub: '漢朝的賈誼用這句俗諺勸諫皇帝：懲治君王身邊的近臣，也要顧到君王的體面——就像打老鼠，得顧忌牠旁邊的器皿呀。',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(560, 302, A('kid', 'happy') + CROWN, '', 0, 1, true) + hearts(440, 180) +
            P(680, 290, VASE, '', 0, .8)) },
        { minDur: 6400, sub: '投鼠忌器：想打擊壞人，卻因有所顧忌而不敢放手去做。',
          html: scene(P(430, 292, VASE, '', 0, 1.4) + P(520, 300, A('mouse')) + P(240, 302, A('kid', 'angry') + P(20, -34, STICK)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">投鼠忌器</text>') }
      ];
    },
    /* 縱虎歸山 */
    i1072: function () {
      var MT3 = '<path d="M-130 0 L0 -150 L130 0 Z" fill="#8fb0a0"/><path d="M0 -150 L-22 -122 L0 -112 L24 -120 Z" fill="#eef4f0"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 6800, sub: '三國時，劉璋把劉備請進蜀地，還想派他帶兵去討伐張魯。',
          html: scene(P(280, 302, A('kid', 'happy')) +
            P(540, 302, A('kid', 'happy') + P(26, -50, SPEAR3), '', 0, .95, true)) },
        { minDur: 6800, sub: '謀士劉巴急忙勸阻：「派劉備出去帶兵，就像把老虎放回山林呀！千萬不可！」',
          html: scene(P(560, 250, '<circle cx="0" cy="-20" r="66" fill="#fff" opacity=".9"/>' + P(0, 30, A('tiger'), '', 0, .8)) +
            P(240, 302, A('kid', 'angry')) + sweat(200, 200) +
            P(400, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(440, 185)) },
        { minDur: 7000, sub: '劉璋不聽。劉備一去果然日益壯大，回頭反取了益州——放走的老虎，再也叫不回來了。',
          html: scene(P(620, 302, MT3) +
            P(520, 302, A('tiger'), 'st-strut') +
            P(200, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') + sweat(250, 200), 'night') },
        { minDur: 6400, sub: '縱虎歸山：放走敵人或惡人，留下後患。',
          html: scene(P(620, 302, MT3, '', 0, .9) + P(480, 302, A('tiger'), 'st-strut') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">縱虎歸山</text>') }
      ];
    },
    /* 期期艾艾 */
    i1060: function () {
      function bubble(x, y, txt, sc) {
        return P(x, y, '<path d="M-30 -18 a26 20 0 1 1 52 6 q-2 9 -12 10 l-13 12 l1 -12 q-24 -2 -28 -16 z" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
          '<text x="-3" y="-4" text-anchor="middle" font-size="16" font-weight="bold" fill="#4a3200">' + txt + '</text>', '', 0, sc || 1);
      }
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 7400, sub: '漢朝大臣周昌有口吃。皇帝要廢掉太子，他氣得漲紅了臉，大聲說：「臣、臣口不能言，但臣期、期……期期知道不可以！」',
          html: scene(P(300, 302, A('kid', 'angry')) + bubble(390, 190, '期期…', 1.1) +
            P(600, 302, A('kid', 'wow') + CROWN, '', 0, 1, true) + sweat(260, 200)) },
        { minDur: 7000, sub: '三國的鄧艾也口吃，自我介紹總說：「艾……艾……」旁人打趣他：「到底有幾個艾呀？」',
          html: scene(P(300, 302, A('kid', 'happy')) + bubble(390, 190, '艾…艾…', 1.1) +
            P(600, 302, A('kid', 'happy'), '', 0, .95, true) + qmark(660, 185)) },
        { minDur: 6600, sub: '後人把兩個故事合在一起，用「期期艾艾」形容說話結結巴巴、不流利的樣子。',
          html: scene(P(260, 302, A('kid', 'happy')) + bubble(340, 195, '期期', .9) +
            P(560, 302, A('kid', 'happy'), '', 0, .95) + bubble(640, 200, '艾艾', .9)) },
        { minDur: 6400, sub: '期期艾艾：形容人口吃，說話結結巴巴不流利。',
          html: scene(bubble(300, 230, '期期', 1.2) + bubble(500, 235, '艾艾', 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">期期艾艾</text>') }
      ];
    },
    /* 焚書坑儒 */
    i1116: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var BOOKPILE = '<g stroke-width="2"><rect x="-30" y="-12" width="60" height="12" rx="2.6" fill="#c9a06c" stroke="#a8734a"/><rect x="-26" y="-24" width="52" height="12" rx="2.6" fill="#e8dcc0" stroke="#c9bfa8"/><rect x="-28" y="-36" width="56" height="12" rx="2.6" fill="#c9a06c" stroke="#a8734a"/></g>';
      var FIRE2 = '<g class="st-flick"><path d="M0 -8 q-16 -20 0 -38 q3 11 11 15 q9 -9 7 -18 q13 16 2 34 q-9 11 -20 7 z" fill="#ff9c40"/>' +
        '<path d="M2 -10 q-8 -11 0 -22 q7 9 9 13 q3 9 -9 9 z" fill="#ffd166"/></g>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 6800, sub: '秦始皇統一天下後，丞相李斯建議：民間收藏的詩書和諸子典籍，一律燒掉！',
          html: scene(P(240, 302, A('kid', 'angry') + CROWN) +
            P(420, 302, A('kid', 'happy'), '', 0, .95) +
            P(600, 316, BOOKPILE, '', 0, 1.1) + bang(320, 180)) },
        { minDur: 6600, sub: '大批書簡被投進火裡，千年累積的智慧，化成了灰燼……',
          html: scene(P(430, 316, BOOKPILE, '', 0, 1.2) + P(430, 302, FIRE2, '', 0, 1.4) +
            P(220, 302, A('kid', 'sad')) + sweat(270, 200), 'night') },
        { minDur: 7000, sub: '第二年，方士的誹謗讓秦始皇大怒，四百多名儒生在咸陽被坑殺，讀書人人人自危。',
          html: scene(P(240, 302, A('kid', 'angry') + CROWN) + bang(310, 180) +
            P(500, 302, A('kid', 'sad'), '', 0, .9) + sweat(540, 200) +
            P(620, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', 0, .9), 'night') },
        { minDur: 6800, sub: '「焚書坑儒」從此成了摧殘文化的代名詞，秦朝也失去了天下讀書人的心。',
          html: scene(P(300, 316, BOOKPILE, '', 0, .9) + P(300, 306, FIRE2) +
            P(560, 302, A('kid', 'sad')) + sweat(600, 200), 'night') },
        { minDur: 6400, sub: '焚書坑儒：摧殘文化、迫害知識分子。',
          html: scene(P(360, 316, BOOKPILE, '', 0, 1.1) + P(360, 306, FIRE2, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">焚書坑儒</text>', 'night') }
      ];
    },
    /* 甘拜下風 */
    i1055: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      function bowKid(x, sc) {
        return P(x, 302, '<g transform="rotate(38)">' + A('kid', 'happy') + '</g>', '', 0, sc || 1);
      }
      return [
        { minDur: 6800, sub: '春秋時，秦國和晉國在韓原大戰。晉軍戰敗，連晉惠公都被俘虜了。',
          html: scene(P(240, 302, A('kid', 'angry') + P(26, -50, SPEAR3)) + bang(400, 190) +
            P(540, 302, A('kid', 'sad') + CROWN, '', 0, .95) + sweat(580, 200)) },
        { minDur: 7000, sub: '晉國的大夫們跟到秦營，站在下風的位置，恭恭敬敬地向秦穆公下拜致意。',
          html: scene(P(600, 302, A('kid', 'happy') + CROWN, '', 0, 1, true) +
            bowKid(300, .95) + bowKid(420, .9) + hearts(660, 190)) },
        { minDur: 6600, sub: '「甘拜下風」從此流傳下來——真心佩服對方，承認自己不如人家。',
          html: scene(P(560, 302, A('kid', 'happy'), '', 0, 1, true) + bowKid(320, .95) + hearts(450, 180)) },
        { minDur: 6400, sub: '甘拜下風：真心佩服別人，承認自己不如對方。',
          html: scene(P(560, 302, A('kid', 'happy'), '', 0, 1, true) + bowKid(300, 1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">甘拜下風</text>') }
      ];
    },
    /* 脣亡齒寒（與 i045 唇亡齒寒同典，異體字條目） */
    i1139: function () {
      var sc = STORIES.i045();
      var last = sc[sc.length - 1];
      last.sub = '脣亡齒寒：雙方關係密切、利害相依。';
      last.html = last.html.replace('唇亡齒寒', '脣亡齒寒');
      return sc;
    },
    /* 一日千里 */
    i1091: function () {
      var SPEEDLINES = '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9">' +
        '<line class="st-windln" x1="80" y1="230" x2="180" y2="230"/><line class="st-windln" style="animation-delay:.5s" x1="60" y1="260" x2="150" y2="260"/></g>';
      var BRUSH = '<line x1="0" y1="0" x2="14" y2="-34" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M0 0 q-3 6 -1 11 q4 -2 5 -8 z" fill="#3a2e26"/>';
      return [
        { minDur: 6600, sub: '騏驥、驊騮這些千里良馬，撒開四蹄，一天就能奔馳一千里路！',
          html: scene(SPEEDLINES + P(400, 302, A('horse'), 'st-dashL', 0, 1.1) + bang(540, 200)) },
        { minDur: 6600, sub: '普通的馬慢慢走，走上十天，也追不上牠一天跑的路程。',
          html: scene(P(240, 302, A('donkey'), '', 0, .95) + sweat(290, 210) +
            '<path d="M330 316 q160 10 330 4" stroke="#e8dcc0" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 10"/>' +
            P(680, 302, A('horse'), '', 0, .9) + qmark(200, 185)) },
        { minDur: 6800, sub: '後來「一日千里」也用來形容人進步飛快——像天天勤練書法的孩子，字一天比一天漂亮！',
          html: scene(P(300, 302, A('kid', 'happy') + P(24, -44, BRUSH)) +
            P(470, 288, '<rect x="-14" y="-20" width="28" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -12 h16 M-8 -4 h16 M-8 4 h16" stroke="#8fa3bf" stroke-width="1.8"/>') +
            hearts(390, 175) + bang(540, 200)) },
        { minDur: 6200, sub: '一日千里：形容進步或發展極快。',
          html: scene(P(400, 302, A('horse'), 'st-strut', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一日千里</text>') }
      ];
    },
    /* 有備無患 */
    i1057: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var GOLD = '<g stroke-width="2"><path d="M-26 0 l8 -14 h36 l8 14 z" fill="#ffd97a" stroke="#e8b84a"/><path d="M-20 -14 l7 -12 h26 l7 12 z" fill="#ffe9a0" stroke="#e8b84a"/></g>';
      var GRAIN = '<path d="M-26 0 Q-30 -34 0 -40 Q30 -34 26 0 Z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>' +
        '<path d="M-12 -40 q12 -8 24 0" stroke="#a8734a" stroke-width="3" fill="none"/>' +
        '<circle cx="-8" cy="-16" r="2.4" fill="#8a5a33"/><circle cx="4" cy="-22" r="2.4" fill="#8a5a33"/><circle cx="10" cy="-12" r="2.4" fill="#8a5a33"/>';
      var SHIELD2 = '<path d="M-18 -44 h36 q0 30 -18 38 q-18 -8 -18 -38 z" fill="#c9762f" stroke="#a85a1e" stroke-width="2.6"/><circle cx="0" cy="-24" r="5" fill="#e8b84a"/>';
      return [
        { minDur: 6800, sub: '春秋時晉國連連得勝，晉悼公把功勞歸給大臣魏絳，賜給他豐厚的賞賜。',
          html: scene(P(280, 302, A('kid', 'happy') + CROWN) + P(430, 290, GOLD, '', 0, 1.1) +
            P(580, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(480, 185)) },
        { minDur: 7400, sub: '魏絳卻不居功，反而提醒國君：「安逸的時候要想到危險，想到了就先做準備——有了準備，就不會有禍患！」',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(520, 290, GRAIN, '', 0, 1) + P(630, 292, SHIELD2, '', 0, 1.1) +
            P(160, 302, A('kid', 'wow') + CROWN, '', 0, .95) + qmark(210, 185)) },
        { minDur: 6600, sub: '晉悼公大為敬佩，時時警惕、處處準備，晉國因此長保強盛。',
          html: scene(P(280, 302, '<g class="st-cheer">' + A('kid', 'happy') + CROWN + '</g>') +
            P(520, 290, GRAIN, '', 0, .9) + P(620, 292, SHIELD2) + hearts(420, 180)) },
        { minDur: 6200, sub: '有備無患：事先有準備，就不會發生禍患。',
          html: scene(P(300, 290, GRAIN, '', 0, 1.2) + P(500, 292, SHIELD2, '', 0, 1.3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">有備無患</text>') }
      ];
    },
    /* 鬼斧神工 */
    i1102: function () {
      var JU = '<g stroke="#8a5a33" stroke-width="5" stroke-linecap="round" fill="none">' +
        '<path d="M-40 0 L-40 -70 Q-40 -86 -24 -86 L24 -86 Q40 -86 40 -70 L40 0"/>' +
        '<path d="M-40 -70 q-12 -8 -8 -20 M40 -70 q12 -8 8 -20"/>' +
        '<path d="M-24 -86 q0 -12 10 -14 M24 -86 q0 -12 -10 -14"/></g>' +
        '<circle cx="-40" cy="-92" r="5" fill="#e8b84a"/><circle cx="40" cy="-92" r="5" fill="#e8b84a"/>';
      var CHISEL = '<line x1="0" y1="0" x2="20" y2="-28" stroke="#a8734a" stroke-width="4.6" stroke-linecap="round"/><path d="M20 -28 l8 -12 l5 6 z" fill="#8b93a3"/>';
      return [
        { minDur: 7000, sub: '木匠梓慶削木頭做「鐻」——掛鐘鼓的架子。作品一完成，看到的人都驚呆了：「這簡直像鬼神做出來的！」',
          html: scene(P(430, 302, JU) +
            P(220, 302, A('kid', 'happy') + P(24, -40, CHISEL)) +
            P(620, 302, A('kid', 'wow'), '', 0, .9) + bang(560, 180) + hearts(670, 200)) },
        { minDur: 7400, sub: '魯侯問他有什麼祕訣。梓慶說：「動工前我先靜心齋戒，忘掉賞賜名利，再進山挑選天生就合適的木材——」',
          html: scene(P(120, 302, TREE, '', 0, 1.2) +
            P(320, 302, A('kid', 'happy')) +
            P(560, 302, A('kid', 'happy') + '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>', '', 0, .95, true) +
            qmark(610, 185)) },
        { minDur: 6800, sub: '「用我的天性，去配合木材的天性——做出來的東西，才會像神工一樣。」',
          html: scene(P(430, 302, JU, '', 0, 1.1) + P(240, 302, A('kid', 'happy') + P(24, -40, CHISEL)) +
            hearts(340, 175)) },
        { minDur: 6400, sub: '鬼斧神工：技藝或自然景觀精巧絕妙，非人力所能為。',
          html: scene(P(400, 296, JU, '', 0, 1.15) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">鬼斧神工</text>') }
      ];
    },
    /* 推心置腹 */
    i1136: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var HEART = '<path d="M0 6 C-8 -6 -22 2 -12 14 L0 24 L12 14 C22 2 8 -6 0 6 Z" fill="#ff7b9c"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 7000, sub: '東漢光武帝劉秀打了勝仗，收編大批投降的士兵。降兵們心裡不安：「他會不會找機會害我們？」',
          html: scene(P(240, 302, A('kid', 'happy') + CROWN) +
            P(500, 302, A('kid', 'sad'), '', 0, .9) + sweat(540, 200) +
            P(640, 302, A('kid', 'sad'), '', .3, .85) + qmark(690, 190)) },
        { minDur: 6800, sub: '劉秀卻毫不設防，只帶著幾個隨從，輕裝騎馬到各營巡視，把降兵完全當自己人信任。',
          html: scene(P(300, 302, A('horse') + P(6, -36, A('kid', 'happy') + CROWN, '', 0, .7), 'st-strut') +
            P(540, 302, A('kid', 'wow') + P(26, -50, SPEAR3), '', 0, .9) +
            P(670, 302, A('kid', 'wow') + P(26, -50, SPEAR3), '', .3, .85)) },
        { minDur: 7000, sub: '降兵們感動極了：「蕭王把一顆真心都放到我們肚子裡了，我們怎能不為他拚命！」',
          html: scene(P(360, 220, HEART, '', 0, 1.4) +
            '<path d="M370 250 q40 30 120 40" stroke="#ff9eb5" stroke-width="4" fill="none" stroke-dasharray="8 8"/>' +
            P(240, 302, A('kid', 'happy') + CROWN) +
            P(540, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(620, 190)) },
        { minDur: 6400, sub: '推心置腹：把真心交給對方，以至誠待人。',
          html: scene(P(400, 240, HEART, '', 0, 1.8) + P(260, 302, A('kid', 'happy')) + P(540, 302, A('kid', 'happy'), '', 0, .95, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">推心置腹</text>') }
      ];
    },
    /* 信口雌黃 */
    i1167: function () {
      function paperY(x, y, patched) {
        return P(x, y, '<rect x="-16" y="-22" width="32" height="44" rx="3" fill="#f2e6b8" stroke="#d5c37a" stroke-width="2"/>' +
          '<path d="M-9 -14 h18 M-9 -6 h18 M-9 2 h18 M-9 10 h12" stroke="#8a7a4a" stroke-width="1.8"/>' +
          (patched ? '<rect x="-10" y="-9" width="20" height="7" rx="2" fill="#e8c840"/>' : ''));
      }
      return [
        { minDur: 7000, sub: '晉朝的王衍好談玄理，講得天花亂墜；說錯了、前後矛盾了，就隨口改來改去，臉不紅氣不喘。',
          html: scene(P(300, 302, A('kid', 'happy')) + notes(380, 170) + qmark(250, 175) +
            P(580, 302, A('kid', 'wow'), '', 0, .9, true) + sweat(620, 200)) },
        { minDur: 7400, sub: '當時人用黃紙寫字，寫錯了就拿「雌黃」一塗，蓋掉重寫。大家便笑他：「王衍這張嘴，就像含著雌黃！」',
          html: scene(paperY(430, 260, true) + bang(500, 200) +
            P(240, 302, A('kid', 'happy')) +
            P(620, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9)) },
        { minDur: 6600, sub: '「信口雌黃」從此用來形容不顧事實、隨口亂說的人。',
          html: scene(P(300, 302, A('kid', 'happy')) + notes(370, 175) +
            P(560, 302, A('kid', 'sad'), '', 0, .9) + sweat(600, 200) + qmark(520, 180)) },
        { minDur: 6400, sub: '信口雌黃：不顧事實，隨口亂說或妄加批評。',
          html: scene(paperY(320, 260, true) + paperY(480, 265, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">信口雌黃</text>') }
      ];
    },
    /* 過河拆橋 */
    i1154: function () {
      var RIVER3 = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 274 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>' +
        '<ellipse cx="90" cy="330" rx="140" ry="46" fill="#b8e08e"/><ellipse cx="710" cy="330" rx="140" ry="46" fill="#b8e08e"/>';
      function bridge(broken) {
        var s = '<g stroke="#a8734a" stroke-width="6" stroke-linecap="round"><line x1="-120" y1="0" x2="-120" y2="22"/><line x1="120" y1="0" x2="120" y2="22"/></g>';
        if (broken) {
          s += '<g stroke="#c9a06c" stroke-width="8" stroke-linecap="round"><line x1="-130" y1="0" x2="-60" y2="0"/></g>' +
            '<g transform="translate(-10,26) rotate(24)"><line x1="-30" y1="0" x2="30" y2="0" stroke="#c9a06c" stroke-width="8" stroke-linecap="round"/></g>';
        } else {
          s += '<line x1="-130" y1="0" x2="130" y2="0" stroke="#c9a06c" stroke-width="8" stroke-linecap="round"/>' +
            '<g stroke="#a8734a" stroke-width="2.6"><line x1="-90" y1="-4" x2="-90" y2="4"/><line x1="-45" y1="-4" x2="-45" y2="4"/><line x1="0" y1="-4" x2="0" y2="4"/><line x1="45" y1="-4" x2="45" y2="4"/><line x1="90" y1="-4" x2="90" y2="4"/></g>';
        }
        return s;
      }
      return [
        { minDur: 6600, sub: '有個人要過河，踏著一座木橋，平平安安走到了對岸。',
          html: scene(RIVER3 + P(400, 268, bridge(false)) +
            P(560, 302, A('kid', 'happy'), 'st-strut')) },
        { minDur: 7000, sub: '一到對岸，他回頭就把橋拆了：「反正我用不到了，管別人怎麼過！」對岸要過河的人，全傻了眼。',
          html: scene(RIVER3 + P(400, 268, bridge(true)) +
            P(600, 302, A('kid', 'happy') + P(-30, -42, HAMMER)) + bang(480, 220) +
            P(130, 302, A('kid', 'wow'), '', 0, .9) + qmark(170, 190) + sweat(90, 200)) },
        { minDur: 7200, sub: '元朝廢科舉時，一位靠科舉當上官的大臣竟然帶頭贊成廢除。人們諷刺他：「這就是過河拆橋！」',
          html: scene(P(300, 302, A('kid', 'happy')) + sweat(340, 195) +
            P(540, 302, A('kid', 'angry'), '', 0, .95, true) + bang(430, 180)) },
        { minDur: 6400, sub: '過河拆橋：達到目的後，拋棄曾幫助過自己的人。',
          html: scene(RIVER3 + P(400, 268, bridge(true)) + P(600, 302, A('kid', 'happy'), '', 0, .95) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">過河拆橋</text>') }
      ];
    },
    /* 孤掌難鳴 */
    i1160: function () {
      function palm(x, y, flip, cls, dly) {
        return P(x, y, '<path d="M-14 20 q-8 -18 -6 -34 q1 -8 7 -8 q5 0 5 8 l0 10 q0 -22 2 -28 q2 -7 8 -6 q5 1 5 9 l-1 16 q2 -18 4 -23 q3 -7 8 -5 q5 2 4 10 l-2 18 q3 -12 5 -15 q3 -5 7 -3 q5 3 3 10 q-3 14 -8 30 q-4 13 -18 15 q-15 2 -23 -4 z" fill="#ffe3c1" stroke="#eec39a" stroke-width="2.4"/>', cls, dly, 1, flip);
      }
      return [
        { minDur: 6800, sub: '《韓非子》裡說：一隻手單獨拍，拍得再快、再用力，也發不出聲音。',
          html: scene(palm(400, 220, false, 'st-wave') + qmark(480, 160) +
            P(200, 302, A('kid', 'wow'), '', 0, .95)) },
        { minDur: 6600, sub: '兩隻手掌合起來拍，才能「啪」地一聲響——做事也一樣，單打獨鬥，難成大事。',
          html: scene(palm(340, 220, false) + palm(470, 220, true) + bang(405, 160) + notes(500, 130) +
            P(180, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 7000, sub: '一個人搬不動大木頭；大家一起抬，一二三——輕輕鬆鬆就抬起來了！',
          html: scene(P(430, 316, '<line x1="-110" y1="0" x2="110" y2="0" stroke="#a8734a" stroke-width="14" stroke-linecap="round"/>') +
            P(300, 302, A('kid', 'happy'), '', 0, .9) + P(430, 302, A('kid', 'happy'), '', .2, .9) +
            P(560, 302, A('kid', 'happy'), '', .4, .9) + hearts(430, 175)) },
        { minDur: 6400, sub: '孤掌難鳴：勢單力薄，難以成事。',
          html: scene(palm(400, 240, false, 'st-wave') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">孤掌難鳴</text>') }
      ];
    },
    /* 烏合之眾 */
    i1161: function () {
      function crow(x, y, sc, dly, cls) {
        return P(x, y, '<g class="st-bob"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<ellipse cx="0" cy="-14" rx="14" ry="10" fill="#4a4a55" stroke="#33333c" stroke-width="2"/>' +
          '<circle cx="-11" cy="-24" r="7.5" fill="#4a4a55" stroke="#33333c" stroke-width="2"/>' +
          '<path d="M-17 -24 l-7 2 l7 3 z" fill="#e0a458"/>' +
          '<circle cx="-13" cy="-26" r="1.8" fill="#fff"/>' +
          '<path d="M4 -18 l12 -6 l-4 9 z" fill="#33333c"/></g>', cls, dly, sc);
      }
      return [
        { minDur: 6600, sub: '一群烏鴉臨時聚在一起，黑壓壓一大片，看起來聲勢驚人。',
          html: scene(crow(240, 300, 1, 0) + crow(340, 296, .9, .2) + crow(440, 302, 1.05, .1) +
            crow(540, 298, .85, .3) + crow(630, 300, .95, .15) + notes(430, 190)) },
        { minDur: 6600, sub: '可是稍有風吹草動——「砰！」牠們立刻四散奔逃，誰也不管誰。',
          html: scene(bang(400, 250) +
            crow(220, 240, .9, 0, 'st-fleeR') + crow(360, 200, .85, .1, 'st-fleeR') +
            crow(520, 220, .9, .2, 'st-fleeR') + crow(650, 250, .8, .15, 'st-fleeR') + sweat(430, 200)) },
        { minDur: 7000, sub: '東漢名將耿弇評敵軍：「用精銳騎兵去衝擊這種烏合之眾，就像摧枯拉朽一樣容易！」',
          html: scene(P(240, 302, A('kid', 'angry') + P(26, -50, '<line x1=\"0\" y1=\"10\" x2=\"0\" y2=\"-46\" stroke=\"#a8734a\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M0 -58 l-7 14 h14 z\" fill=\"#8b93a3\"/>')) +
            P(500, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .85) +
            P(640, 302, '<g class="st-fleeR" style="animation-delay:.2s">' + A('kid', 'wow') + '</g>', 'st-dashL', .2, .8) +
            bang(420, 200)) },
        { minDur: 6400, sub: '烏合之眾：無組織、無紀律的群體。',
          html: scene(crow(260, 300, 1, 0) + crow(400, 296, .9, .2) + crow(540, 300, .95, .1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">烏合之眾</text>') }
      ];
    },
    /* 一言九鼎 */
    i1186: function () {
      var DING = '<path d="M-34 -14 L-30 -52 Q-30 -60 -22 -60 L22 -60 Q30 -60 30 -52 L34 -14 Q34 -4 22 -4 L-22 -4 Q-34 -4 -34 -14 Z" fill="#8a7a5a" stroke="#6d6044" stroke-width="3"/>' +
        '<path d="M-24 -60 q-2 -12 8 -14 M24 -60 q2 -12 -8 -14" stroke="#6d6044" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<g stroke="#6d6044" stroke-width="4"><line x1="-22" y1="-4" x2="-26" y2="14"/><line x1="22" y1="-4" x2="26" y2="14"/><line x1="0" y1="-4" x2="0" y2="14"/></g>' +
        '<path d="M-20 -38 h40 M-20 -28 h40" stroke="#a89878" stroke-width="2.6"/>';
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var SWORD2 = '<line x1="0" y1="0" x2="26" y2="-40" stroke="#c4cede" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="4" y1="-12" x2="14" y2="-4" stroke="#c98f2a" stroke-width="4" stroke-linecap="round"/>';
      return [
        { minDur: 7000, sub: '毛遂跟著平原君出使楚國，一番慷慨陳詞，說得楚王當場答應聯合出兵抗秦。',
          html: scene(P(300, 302, A('kid', 'angry') + P(24, -40, SWORD2)) + bang(380, 175) +
            P(580, 302, A('kid', 'wow') + CROWN, '', 0, 1, true) + sweat(540, 195)) },
        { minDur: 7000, sub: '平原君讚嘆：「毛先生一到楚國，就讓趙國的分量，重過了傳國的九鼎大呂！」',
          html: scene(P(430, 300, DING, '', 0, 1.5) +
            P(200, 302, A('kid', 'happy')) + hearts(280, 180) +
            P(650, 302, A('kid', 'happy'), '', 0, .9, true)) },
        { minDur: 6600, sub: '「一言九鼎」從此形容一句話分量極重，說出來就算數。',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(500, 290, DING, '', 0, 1.1) + hearts(400, 180)) },
        { minDur: 6400, sub: '一言九鼎：一句話重如九鼎，說話極有分量。',
          html: scene(P(400, 290, DING, '', 0, 1.7) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一言九鼎</text>') }
      ];
    },
    /* 泥牛入海 */
    i1137: function () {
      var SEA3 = '<rect y="252" width="800" height="88" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 262 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="9" stroke-linecap="round" opacity=".9"/></g>';
      function mudOx(x, y, sc, flip, cls) {
        return P(x, y, '<g class="st-bob"><ellipse cx="0" cy="-20" rx="26" ry="17" fill="#9c8468" stroke="#7a6650" stroke-width="2.4"/>' +
          '<circle cx="-20" cy="-38" r="13" fill="#9c8468" stroke="#7a6650" stroke-width="2.4"/>' +
          '<path d="M-30 -46 q-8 -3 -8 -11 M-10 -48 q8 -3 8 -11" stroke="#7a6650" stroke-width="4.6" fill="none" stroke-linecap="round"/>' +
          '<circle cx="-24" cy="-40" r="1.8" fill="#4a3a2c"/>' +
          '<rect x="-18" y="-10" width="8" height="10" rx="3.6" fill="#7a6650"/><rect x="10" y="-10" width="8" height="10" rx="3.6" fill="#7a6650"/></g>', cls, 0, sc, flip);
      }
      return [
        { minDur: 7000, sub: '禪師洞山說過一句妙語：「我看見兩頭泥做的牛，打鬥著跳進了大海——到現在，都沒有半點消息。」',
          html: scene(SEA3 + mudOx(300, 280, 1, false) + mudOx(470, 284, .95, true) + bang(390, 220)) },
        { minDur: 6600, sub: '泥做的牛一碰到海水，立刻就融化了，無影無蹤——怎麼可能再回來呢？',
          html: scene(SEA3 + P(380, 290, '<circle cx="0" cy="0" r="16" fill="#9c8468" opacity=".5"/><circle cx="30" cy="6" r="9" fill="#9c8468" opacity=".35"/><circle cx="-26" cy="8" r="7" fill="#9c8468" opacity=".3"/>') +
            qmark(400, 190)) },
        { minDur: 6800, sub: '後來「泥牛入海」就用來比喻一去不返、毫無音訊——像寄出去的信石沉大海，再也等不到回音。',
          html: scene(SEA3 +
            P(240, 296, A('kid', 'sad') + P(36, -60, '<rect x="-14" y="-9" width="28" height="18" rx="2.6" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -9 L0 2 L14 -9" stroke="#c9bfa8" stroke-width="2" fill="none"/>', '', 0, .9)) +
            sweat(200, 200) + qmark(320, 180)) },
        { minDur: 6400, sub: '泥牛入海：一去不返，毫無消息。',
          html: scene(SEA3 + mudOx(360, 280, 1.05, false) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">泥牛入海</text>') }
      ];
    },
    /* 琳瑯滿目 */
    i1090: function () {
      function gem(x, y, color, dly) {
        return P(x, y, '<path class="st-tw"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + ' d="M-10 -4 L0 -14 L10 -4 L0 12 Z" fill="' + color + '" stroke="#fff" stroke-width="1.6"/>');
      }
      var SHELF = '<g stroke="#a8734a" stroke-width="5"><line x1="-110" y1="0" x2="-110" y2="-110"/><line x1="110" y1="0" x2="110" y2="-110"/><line x1="-110" y1="-36" x2="110" y2="-36"/><line x1="-110" y1="-74" x2="110" y2="-74"/><line x1="-110" y1="-110" x2="110" y2="-110"/></g>';
      return [
        { minDur: 6800, sub: '晉朝有人到王家作客，只見王家子弟個個俊美出眾、談吐不凡，看得他目不轉睛。',
          html: scene(P(430, 302, A('kid', 'happy'), '', 0, .95) + P(560, 302, A('kid', 'happy'), '', .2, .9) +
            P(670, 302, A('kid', 'happy'), '', .4, .88) +
            P(220, 302, A('kid', 'wow')) + hearts(310, 180)) },
        { minDur: 6800, sub: '回家後他讚嘆：「今天一路看過去，滿眼都是美玉珠寶呀！」',
          html: scene(gem(340, 200, '#8fd0c0', 0) + gem(420, 170, '#f7a8c4', .3) + gem(500, 210, '#a5c8ff', .6) +
            gem(580, 180, '#ffd97a', .2) + gem(260, 180, '#c9a8e0', .5) +
            P(180, 302, A('kid', 'happy')) + hearts(240, 210)) },
        { minDur: 6800, sub: '「琳瑯滿目」從此形容眼前盡是美好的東西——像文具店的貨架琳瑯滿目，看得目不暇給！',
          html: scene(P(480, 302, SHELF +
              gem(-70, -92, '#f7a8c4', 0) + gem(0, -94, '#8fd0c0', .3) + gem(70, -90, '#ffd97a', .5) +
              gem(-70, -54, '#a5c8ff', .2) + gem(0, -56, '#c9a8e0', .4) + gem(70, -52, '#8fd0c0', .6) +
              gem(-70, -16, '#ffd97a', .1) + gem(0, -18, '#f7a8c4', .35) + gem(70, -14, '#a5c8ff', .55)) +
            P(200, 302, A('kid', 'wow')) + hearts(280, 190)) },
        { minDur: 6400, sub: '琳瑯滿目：眼前盡是美好的東西，多得看不完。',
          html: scene(gem(260, 230, '#8fd0c0', 0) + gem(360, 250, '#f7a8c4', .3) + gem(460, 225, '#ffd97a', .5) + gem(560, 250, '#a5c8ff', .2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">琳瑯滿目</text>') }
      ];
    },
    /* 神出鬼沒 */
    i1119: function () {
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 7000, sub: '《淮南子》說：善於用兵的人，行動像神一樣突然出現、像鬼一樣悄悄消失，讓敵人完全摸不著頭腦。',
          html: scene(P(300, 302, '<g opacity=".55">' + A('kid', 'angry') + P(26, -50, SPEAR3) + '</g>', 'st-inL') +
            P(560, 302, A('kid', 'wow'), '', 0, .9) + qmark(610, 185), 'night') },
        { minDur: 6800, sub: '敵人往東邊防守，他從西邊冒出來；敵人急忙回頭堵，他又消失得無影無蹤！',
          html: scene(P(160, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-inL') + bang(240, 200) +
            P(520, 302, A('kid', 'wow'), '', 0, .9, true) + P(650, 302, A('kid', 'wow'), '', .3, .85) +
            sweat(560, 195) + qmark(690, 185), 'night') },
        { minDur: 6800, sub: '「神出鬼沒」形容行動變化迅速、難以捉摸——就像巷口那隻貓，想找牠時，永遠不知道牠在哪裡。',
          html: scene(P(540, 302, A('fox'), '', 0, .9) +
            P(260, 302, A('kid', 'wow')) + qmark(320, 180) + qmark(210, 190)) },
        { minDur: 6400, sub: '神出鬼沒：出沒無常，行動迅速、難以捉摸。',
          html: scene(P(300, 302, '<g opacity=".5">' + A('kid', 'happy') + '</g>') + P(560, 302, A('kid', 'happy'), '', 0, .95) + qmark(430, 200) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">神出鬼沒</text>', 'night') }
      ];
    },
    /* 丟盔棄甲 */
    i1104: function () {
      var HELMET = '<path d="M-16 0 a16 14 0 0 1 32 0 z" fill="#8b93a3" stroke="#6d7585" stroke-width="2.6"/><circle cx="0" cy="-16" r="4" fill="#c96a5a"/>';
      var ARMOR = '<path d="M-16 0 l4 -30 h24 l4 30 q-8 6 -16 6 q-8 0 -16 -6 z" fill="#8a7a5a" stroke="#6d6044" stroke-width="2.4"/><path d="M-8 -12 h16 M-9 -22 h18" stroke="#6d6044" stroke-width="2"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 7000, sub: '戰場上一交鋒，敗下陣來的士兵頭盔一丟、鎧甲一扔，拖著兵器沒命地逃！',
          html: scene(P(300, 316, HELMET) + P(400, 314, ARMOR, '', 0, .9) +
            P(520, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .9) +
            P(660, 302, '<g class="st-fleeR" style="animation-delay:.2s">' + A('kid', 'wow') + '</g>', 'st-dashL', .2, .85) +
            bang(180, 220) + sweat(560, 200)) },
        { minDur: 7200, sub: '孟子講「五十步笑百步」時，就描寫過這種「棄甲曳兵而走」的狼狽相——逃五十步的，還好意思笑逃一百步的呢。',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            P(620, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .85) +
            P(300, 316, ARMOR, '', 0, .8) + qmark(450, 185) + sweat(660, 195)) },
        { minDur: 6600, sub: '「丟盔棄甲」就是打敗仗逃跑時，那副連裝備都不要了的狼狽樣子。',
          html: scene(P(280, 316, HELMET, '', 0, 1.2) + P(400, 314, ARMOR, '', 0, 1.1) + P(510, 316, SPEAR3, '', 0, .9) +
            sweat(400, 240)) },
        { minDur: 6400, sub: '丟盔棄甲：形容打敗仗逃跑的狼狽相。',
          html: scene(P(300, 316, HELMET, '', 0, 1.3) + P(450, 314, ARMOR, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">丟盔棄甲</text>') }
      ];
    },
    /* 拭目以待 */
    i1126: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var BIGEYE = '<path d="M-36 0 Q0 -30 36 0 Q0 30 -36 0 Z" fill="#fff" stroke="#4a3200" stroke-width="3"/>' +
        '<circle cx="0" cy="0" r="11" fill="#6b4a32"/><circle cx="4" cy="-4" r="3.6" fill="#fff"/>' +
        '<g class="st-rays" style="transform-origin:0px 0px"><g stroke="#ffd97a" stroke-width="3" stroke-linecap="round"><line x1="-46" y1="-14" x2="-40" y2="-11"/><line x1="46" y1="-14" x2="40" y2="-11"/><line x1="0" y1="-36" x2="0" y2="-30"/></g></g>';
      var TROPHY = '<path d="M-14 -34 h28 v10 q0 14 -14 16 q-14 -2 -14 -16 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/>' +
        '<path d="M-14 -30 q-12 0 -10 12 q2 8 10 6 M14 -30 q12 0 10 12 q-2 8 -10 6" stroke="#e8b84a" stroke-width="2.6" fill="none"/>' +
        '<rect x="-4" y="-8" width="8" height="8" fill="#c98f2a"/><rect x="-12" y="0" width="24" height="6" rx="2.4" fill="#c98f2a"/>';
      return [
        { minDur: 7000, sub: '漢朝大臣張敞上書勸諫時說：天下的百姓，都擦亮了眼睛，等著看陛下英明的決定！',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(580, 302, A('kid', 'happy') + CROWN, '', 0, 1, true) +
            P(430, 190, BIGEYE, '', 0, .9)) },
        { minDur: 6400, sub: '把眼睛擦得亮亮的、專心等著看結果——這就是「拭目以待」。',
          html: scene(P(400, 210, BIGEYE, '', 0, 1.3) +
            P(200, 302, A('kid', 'happy') + '<circle cx="-24" cy="-54" r="8" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>')) },
        { minDur: 6800, sub: '比賽就要開始了！冠軍會是誰呢？大家都拭目以待。',
          html: scene(P(430, 290, TROPHY, '', 0, 1.2) +
            P(220, 302, A('kid', 'happy'), '', 0, .9) + P(600, 302, A('kid', 'happy'), '', .2, .9, true) +
            qmark(430, 200) + hearts(300, 190)) },
        { minDur: 6400, sub: '拭目以待：擦亮眼睛等著看，殷切期待結果。',
          html: scene(P(400, 230, BIGEYE, '', 0, 1.4) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">拭目以待</text>') }
      ];
    },
    /* 以德報怨 */
    i1130: function () {
      var GIFT = '<rect x="-14" y="-24" width="28" height="24" rx="4" fill="#e88a9a" stroke="#c96a7a" stroke-width="2.4"/>' +
        '<line x1="0" y1="-24" x2="0" y2="0" stroke="#fff" stroke-width="3.4"/><line x1="-14" y1="-12" x2="14" y2="-12" stroke="#fff" stroke-width="3.4"/>' +
        '<path d="M-6 -24 q-8 -10 0 -12 q5 -1 6 6 q1 -7 6 -6 q8 2 0 12 z" fill="#c96a7a"/>';
      return [
        { minDur: 6800, sub: '有學生問孔子：「用恩德去回報仇怨，怎麼樣？」',
          html: scene(P(280, 302, A('kid', 'happy')) + qmark(340, 180) +
            P(540, 302, A('kid', 'happy') +
              '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05, true)) },
        { minDur: 7200, sub: '孔子反問：「那要用什麼回報恩德呢？應該用正直對待仇怨、用恩德回報恩德，才公平呀。」',
          html: scene(P(540, 302, A('kid', 'happy') +
              '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05, true) +
            P(280, 302, A('kid', 'wow')) + qmark(230, 185) + hearts(420, 180)) },
        { minDur: 7000, sub: '不過「以德報怨」仍流傳下來，稱許寬大的胸懷——別人對不起你，你反而用善意相待。',
          html: scene(P(300, 302, A('kid', 'happy') + P(38, -60, GIFT, '', 0, .9)) +
            P(540, 302, A('kid', 'sad'), '', 0, .95, true) + hearts(430, 175)) },
        { minDur: 6400, sub: '以德報怨：用恩德回報仇怨。',
          html: scene(P(400, 270, GIFT, '', 0, 1.6) + hearts(500, 200) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">以德報怨</text>') }
      ];
    },
    /* 攻無不克 */
    i1098: function () {
      var WALL2 = '<rect x="-80" y="-70" width="160" height="70" fill="#b0a390" stroke="#8a7a66" stroke-width="3"/>' +
        '<path d="M-80 -70 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20" fill="none" stroke="#8a7a66" stroke-width="3"/>' +
        '<rect x="-18" y="-44" width="36" height="44" rx="4" fill="#6d6357"/>';
      var FLAG = '<line x1="0" y1="0" x2="0" y2="-56" stroke="#a8734a" stroke-width="4"/><path d="M0 -56 h30 l-8 8 l8 8 h-30 z" fill="#e85a4f"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      var TROPHY = '<path d="M-14 -34 h28 v10 q0 14 -14 16 q-14 -2 -14 -16 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/>' +
        '<path d="M-14 -30 q-12 0 -10 12 q2 8 10 6 M14 -30 q12 0 10 12 q-2 8 -10 6" stroke="#e8b84a" stroke-width="2.6" fill="none"/>' +
        '<rect x="-4" y="-8" width="8" height="8" fill="#c98f2a"/><rect x="-12" y="0" width="24" height="6" rx="2.4" fill="#c98f2a"/>';
      return [
        { minDur: 6800, sub: '戰國時的秦軍勇猛善戰——只要出兵攻城，就沒有攻不下來的！',
          html: scene(P(560, 302, WALL2 + P(0, -70, FLAG)) + bang(460, 210) +
            P(240, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut') +
            P(360, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .2, .9)) },
        { minDur: 6800, sub: '《戰國策》記載：秦國打仗未嘗不勝、攻城未嘗不取。「攻無不克」就是這樣來的。',
          html: scene(P(560, 302, WALL2 + P(0, -70, FLAG)) +
            P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(26, -50, SPEAR3) + '</g>') + hearts(420, 180)) },
        { minDur: 6600, sub: '現在也用來形容實力強大：這支球隊士氣如虹，一路過關斬將，攻無不克！',
          html: scene(P(430, 290, TROPHY, '', 0, 1.2) +
            P(260, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            P(580, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(430, 190)) },
        { minDur: 6400, sub: '攻無不克：只要進攻，沒有攻不下的，形容力量強大。',
          html: scene(P(560, 302, WALL2, '', 0, .9) + P(300, 302, A('kid', 'angry') + P(26, -50, SPEAR3)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">攻無不克</text>') }
      ];
    },
    /* 戰無不勝 */
    i1099: function () {
      var FLAG = '<line x1="0" y1="0" x2="0" y2="-56" stroke="#a8734a" stroke-width="4"/><path d="M0 -56 h30 l-8 8 l8 8 h-30 z" fill="#e85a4f"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      var PAPER100 = '<rect x="-18" y="-24" width="36" height="48" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/>' +
        '<text x="0" y="0" text-anchor="middle" font-size="15" font-weight="bold" fill="#e85a4f">100</text>' +
        '<path d="M-10 10 l6 7 l13 -13" stroke="#e85a4f" stroke-width="3" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '「戰必勝，攻必取」——每一次上戰場，都能打勝仗！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + P(26, -50, SPEAR3) + '</g>') +
            P(450, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + P(0, -60, FLAG) + '</g>', '', 0, .9) +
            hearts(380, 165) + bang(560, 200)) },
        { minDur: 6600, sub: '「戰無不勝」常和「攻無不克」連著用，形容百戰百勝、極為強大。',
          html: scene(P(400, 302, A('kid', 'happy') + P(0, -60, FLAG), '', 0, 1.05) +
            P(200, 302, A('kid', 'happy') + P(26, -50, SPEAR3), '', 0, .9) +
            P(600, 302, A('kid', 'happy') + P(26, -50, SPEAR3), '', .2, .9) + hearts(400, 160)) },
        { minDur: 6800, sub: '生活裡也能用：只要準備充分、全力以赴，考場上就能戰無不勝！',
          html: scene(P(500, 280, PAPER100, '', 0, 1.2) +
            P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(400, 185)) },
        { minDur: 6400, sub: '戰無不勝：每次作戰都獲勝，形容極為強大。',
          html: scene(P(400, 302, A('kid', 'happy') + P(0, -60, FLAG), '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">戰無不勝</text>') }
      ];
    },
    /* 監守自盜 */
    i913: function () {
      var STOREHOUSE = '<path d="M-90 -70 L0 -114 L90 -70 Z" fill="#8a5a33"/><rect x="-76" y="-70" width="152" height="70" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<rect x="-20" y="-48" width="40" height="48" rx="4" fill="#8a5a33"/><text x="0" y="-78" text-anchor="middle" font-size="15" font-weight="bold" fill="#f4ecd8">倉</text>';
      var GOLD = '<g stroke-width="2"><path d="M-26 0 l8 -14 h36 l8 14 z" fill="#ffd97a" stroke="#e8b84a"/><path d="M-20 -14 l7 -12 h26 l7 12 z" fill="#ffe9a0" stroke="#e8b84a"/></g>';
      return [
        { minDur: 6600, sub: '倉庫管理員負責看守官府的財物，官府對他十分信任。',
          html: scene(P(430, 302, STOREHOUSE) + P(620, 290, GOLD, '', 0, .9) +
            P(220, 302, A('kid', 'happy')) + hearts(300, 190)) },
        { minDur: 6800, sub: '沒想到他竟然監守自盜——半夜偷偷打開倉門，把保管的財物一箱箱搬回自己家！',
          html: scene(P(430, 302, STOREHOUSE) +
            P(260, 302, '<g class="st-fleeR">' + A('kid', 'wow') + P(-34, -60, GOLD, '', 0, .7) + '</g>', 'st-dashL') +
            sweat(320, 200), 'night') },
        { minDur: 7000, sub: '從漢朝起，法律就對「看守的人自己偷」罪加一等——辜負別人的信任，最不可原諒。',
          html: scene(P(560, 302, A('kid', 'angry')) + bang(500, 185) +
            P(300, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') + sweat(340, 200)) },
        { minDur: 6400, sub: '監守自盜：負責看守的人，自己偷竊所保管的財物。',
          html: scene(P(430, 302, STOREHOUSE, '', 0, .95) + P(240, 302, A('kid', 'wow') + P(-34, -60, GOLD, '', 0, .7)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">監守自盜</text>') }
      ];
    },
    /* 束手就擒 */
    i1106: function () {
      var ROPEHANDS = '<circle cx="-8" cy="0" r="8" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/><circle cx="8" cy="0" r="8" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>' +
        '<path d="M-16 -4 h32 M-16 0 h32 M-16 4 h32" stroke="#a8734a" stroke-width="2.6"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 6800, sub: '宋朝將軍符彥卿被敵軍團團包圍，情勢危急，有人勸他乾脆投降。',
          html: scene(P(400, 302, A('kid', 'sad')) + sweat(440, 195) +
            P(150, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', 0, .85) +
            P(650, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', .2, .85, true) + qmark(340, 180)) },
        { minDur: 6800, sub: '他說：「與其綁起雙手讓人活捉，不如拚死一戰！」帶著部下奮勇衝殺，竟然突圍成功！',
          html: scene(P(300, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut') + bang(420, 190) +
            P(560, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .85) + hearts(250, 180)) },
        { minDur: 6600, sub: '「束手就擒」就是把手一伸、任人捆綁捉拿，一點也不抵抗——符彥卿偏偏不肯這樣。',
          html: scene(P(400, 240, ROPEHANDS, '', 0, 1.6) +
            P(220, 302, A('kid', 'sad'), '', 0, .95) + sweat(260, 200)) },
        { minDur: 6400, sub: '束手就擒：不作抵抗，甘願被擒。',
          html: scene(P(400, 250, ROPEHANDS, '', 0, 1.8) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">束手就擒</text>') }
      ];
    },
    /* 撥雲見日 */
    i1156: function () {
      var SUNBIG = '<g class="st-rays" style="transform-origin:0px 0px"><g stroke="#ffcf4d" stroke-width="5" stroke-linecap="round">' +
        '<line x1="0" y1="-46" x2="0" y2="-34"/><line x1="0" y1="34" x2="0" y2="46"/><line x1="-46" y1="0" x2="-34" y2="0"/><line x1="34" y1="0" x2="46" y2="0"/></g></g>' +
        '<circle cx="0" cy="0" r="26" fill="#ffdd66" stroke="#f5b73e" stroke-width="3"/>';
      function cloudG(x, y, cls) {
        return P(x, y, '<ellipse cx="0" cy="0" rx="46" ry="20" fill="#8b93a3" opacity=".92"/><ellipse cx="-34" cy="8" rx="26" ry="14" fill="#a3a9b8" opacity=".92"/><ellipse cx="34" cy="8" rx="28" ry="15" fill="#a3a9b8" opacity=".92"/>', cls);
      }
      return [
        { minDur: 6800, sub: '晉朝的樂廣最會講道理，再難的問題，他都能分析得清清楚楚。',
          html: scene(P(300, 302, A('kid', 'happy')) + notes(380, 175) +
            P(560, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(610, 185)) },
        { minDur: 6800, sub: '有人聽完他的分析，忍不住讚嘆：「就像撥開了滿天雲霧，一下子看見了青天！」',
          html: scene(P(400, 130, SUNBIG) + cloudG(230, 120, 'st-inL') + cloudG(580, 130, 'st-inR') +
            P(300, 302, A('kid', 'happy')) + P(540, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .95) + hearts(430, 210)) },
        { minDur: 6800, sub: '「撥雲見日」比喻疑團消除、重見光明——就像想通難題的那一刻，豁然開朗！',
          html: scene(P(400, 140, SUNBIG) +
            P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + bang(450, 200) + hearts(280, 210)) },
        { minDur: 6400, sub: '撥雲見日：衝破黑暗、疑團消除，重見光明。',
          html: scene(P(400, 160, SUNBIG, '', 0, 1.2) + cloudG(180, 130) + cloudG(620, 140) +
            '<text x="400" y="270" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">撥雲見日</text>') }
      ];
    },
    /* 天壤之別 */
    i1153: function () {
      var ARROWUD = '<line x1="0" y1="-70" x2="0" y2="70" stroke="#4a3200" stroke-width="4" stroke-dasharray="9 8"/>' +
        '<path d="M0 -82 l-8 14 h16 z M0 82 l-8 -14 h16 z" fill="#4a3200"/>';
      function room(x, messy) {
        var inner = '<rect x="-70" y="-90" width="140" height="90" rx="6" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>';
        if (messy) {
          inner += '<rect x="-52" y="-30" width="26" height="14" rx="3" fill="#c96a5a" transform="rotate(18 -40 -22)"/>' +
            '<circle cx="8" cy="-18" r="9" fill="#8fa8c9"/>' +
            '<rect x="26" y="-36" width="24" height="12" rx="3" fill="#e0a458" transform="rotate(-24 38 -30)"/>' +
            '<path d="M-40 -66 q10 8 22 2 q10 -6 20 2" stroke="#a3a9b8" stroke-width="4" fill="none"/>';
        } else {
          inner += '<rect x="-52" y="-26" width="30" height="14" rx="3" fill="#8fa8c9"/>' +
            '<rect x="-14" y="-26" width="30" height="14" rx="3" fill="#a5d47c"/>' +
            '<rect x="24" y="-26" width="26" height="14" rx="3" fill="#e0a458"/>' +
            '<line x1="-52" y1="-48" x2="50" y2="-48" stroke="#c9bfa8" stroke-width="3"/>';
        }
        return P(x, 300, inner);
      }
      return [
        { minDur: 6600, sub: '天高高在上、地近在腳邊——一個高不可攀，一個伸手可及，差距有多大呢？',
          html: scene(P(400, 165, ARROWUD) +
            '<text x="470" y="110" font-size="22" font-weight="bold" fill="#4a3200">天</text>' +
            '<text x="470" y="245" font-size="22" font-weight="bold" fill="#4a3200">地</text>' +
            P(200, 302, A('kid', 'wow')) + qmark(260, 190)) },
        { minDur: 6600, sub: '晉朝的葛洪就用「天壤」——天與土地——來形容兩件事的差別極大。',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>')) +
            P(540, 165, ARROWUD, '', 0, .8)) },
        { minDur: 6800, sub: '生活裡也常用：哥哥的房間亂七八糟，弟弟的整整齊齊——兩間簡直天壤之別！',
          html: scene(room(230, true) + room(570, false) +
            sweat(230, 230) + hearts(570, 230)) },
        { minDur: 6400, sub: '天壤之別：像天和地那樣大的差別。',
          html: scene(P(400, 175, ARROWUD, '', 0, 1.1) +
            '<text x="400" y="290" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">天壤之別</text>') }
      ];
    },
    /* 克勤克儉 */
    i1159: function () {
      var HOUSE3 = '<path d="M-40 -34 L0 -60 L40 -34 Z" fill="#8a5a33"/><rect x="-32" y="-34" width="64" height="34" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.4"/><rect x="-9" y="-24" width="18" height="24" rx="3" fill="#8a5a33"/>';
      var WAVES = '<rect y="280" width="800" height="60" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 290 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="8" stroke-linecap="round" opacity=".9"/></g>';
      var BOWL = '<path d="M-16 -6 q0 14 16 14 q16 0 16 -14 z" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.4"/><ellipse cx="0" cy="-6" rx="16" ry="5" fill="#f4f1e8"/>';
      return [
        { minDur: 7000, sub: '大禹治水，十三年在外奔波，三次經過自己家門口，都忙得沒空進去看一眼——勤於國事！',
          html: scene(WAVES + P(620, 276, HOUSE3) +
            P(300, 296, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe'), 'st-strut') + sweat(250, 195)) },
        { minDur: 6600, sub: '回到家裡，他吃得簡單、穿得樸素，一點一滴都不浪費——儉於持家！',
          html: scene(P(430, 302, HOUSE3, '', 0, 1.3) +
            P(250, 302, A('kid', 'happy') + P(38, -50, BOWL, '', 0, .9))) },
        { minDur: 6800, sub: '《尚書》稱讚他「克勤于邦，克儉于家」——這就是「克勤克儉」的由來。',
          html: scene(P(300, 302, A('kid', 'happy')) + hearts(380, 180) +
            P(560, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9)) },
        { minDur: 6400, sub: '克勤克儉：既能勤勞，又能節儉。',
          html: scene(P(300, 296, A('kid', 'happy') + P(16, -30, HOE)) + P(540, 290, BOWL, '', 0, 1.4) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">克勤克儉</text>') }
      ];
    },
    /* 吳牛喘月 */
    i1051: function () {
      var MOON = '<path d="M14 -26 A30 30 0 1 0 26 16 A24 24 0 1 1 14 -26 Z" fill="#f4f1de" stroke="#d8d4bd" stroke-width="2"/>';
      var PANT = '<g class="st-sweat"><path d="M0 0 q8 -4 16 0 M0 8 q8 -4 16 0" stroke="#bfe0ff" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>';
      var WINDOW = '<rect x="-40" y="-70" width="80" height="70" rx="6" fill="#aee3f5" stroke="#a8734a" stroke-width="5"/>' +
        '<line x1="0" y1="-70" x2="0" y2="0" stroke="#a8734a" stroke-width="4"/><line x1="-40" y1="-35" x2="40" y2="-35" stroke="#a8734a" stroke-width="4"/>' +
        '<g class="st-rays" style="transform-origin:0px -35px"><line x1="-14" y1="-49" x2="14" y2="-21" stroke="#fff" stroke-width="3" opacity=".8"/></g>';
      return [
        { minDur: 7000, sub: '吳地天氣炎熱，水牛最怕烈日。夜裡看見圓圓的月亮，竟誤以為是太陽，嚇得直喘大氣！',
          html: scene(P(680, 70, MOON) +
            P(400, 300, A('ox')) + P(330, 240, PANT, '', 0, 1.2) + sweat(460, 230) + qmark(350, 190), 'night') },
        { minDur: 7400, sub: '晉朝大臣滿奮怕風。他見琉璃窗透著光，以為窗子漏風，臉色發難——又自我解嘲：「臣就像吳地的牛，看見月亮也會喘呀！」',
          html: scene(P(560, 300, WINDOW) +
            P(280, 302, A('kid', 'wow')) + sweat(230, 200) + qmark(340, 180) +
            P(680, 302, A('kid', 'happy'), '', 0, .85)) },
        { minDur: 6800, sub: '「吳牛喘月」比喻曾受過驚嚇，遇到類似的事物就過度害怕、疑神疑鬼。',
          html: scene(P(680, 70, MOON) + P(400, 300, A('ox')) + P(330, 240, PANT, '', 0, 1.1) + sweat(460, 230), 'night') },
        { minDur: 6400, sub: '吳牛喘月：因曾受驚嚇，遇類似事物便過度害怕。',
          html: scene(P(650, 90, MOON, '', 0, 1.1) + P(380, 300, A('ox'), '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">吳牛喘月</text>', 'night') }
      ];
    },
    /* 響遏行雲 */
    i1073: function () {
      var CLOUDSTOP = '<g class="st-cloud"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#fff"/><ellipse cx="-24" cy="6" rx="19" ry="10" fill="#fff"/><ellipse cx="26" cy="6" rx="20" ry="11" fill="#fff"/></g>';
      var BUNDLE = '<circle cx="0" cy="-6" r="11" fill="#e8c48f" stroke="#c9a066" stroke-width="2.4"/><line x1="8" y1="-14" x2="20" y2="-26" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>';
      return [
        { minDur: 7000, sub: '薛譚向名師秦青學唱歌，才學了一半，就自以為都學會了，收拾行李要回家。',
          html: scene(P(300, 302, A('kid', 'happy') + P(-30, -60, BUNDLE, '', 0, .9), 'st-strut') +
            P(560, 302, A('kid', 'sad'), '', 0, .95, true) + notes(250, 180)) },
        { minDur: 7400, sub: '秦青沒挽留，只在郊外設宴送行。席間他撫著節拍高歌一曲——歌聲震動林木，連天上流動的雲，都停下來聽！',
          html: scene(P(240, 90, CLOUDSTOP) + P(560, 70, CLOUDSTOP) +
            P(120, 302, TREE) + P(690, 302, TREE, '', 0, .9) +
            P(400, 302, A('kid', 'happy')) + notes(320, 150) + notes(480, 130) + bang(400, 90)) },
        { minDur: 6800, sub: '薛譚聽得目瞪口呆，慚愧地道歉，請求繼續學習——從此再也不敢說要回家了。',
          html: scene(P(300, 302, '<g transform="rotate(30)">' + A('kid', 'sad') + '</g>') + sweat(260, 210) +
            P(540, 302, A('kid', 'happy'), '', 0, 1.05, true) + hearts(430, 180)) },
        { minDur: 6400, sub: '響遏行雲：歌聲響亮高亢，連行雲都被攔住。',
          html: scene(P(250, 100, CLOUDSTOP) + P(550, 85, CLOUDSTOP) + P(400, 302, A('kid', 'happy')) + notes(400, 170) +
            '<text x="400" y="230" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">響遏行雲</text>') }
      ];
    },
    /* 暴虎馮河 */
    i1061: function () {
      var RIVER4 = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 274 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="8" stroke-linecap="round" opacity=".9"/></g>';
      return [
        { minDur: 6800, sub: '有人空著兩手就想和老虎搏鬥，什麼武器也不帶——這就是「暴虎」！',
          html: scene(P(500, 302, A('tiger'), '', 0, 1.05) + bang(420, 200) +
            P(280, 302, A('kid', 'angry')) + sweat(230, 195)) },
        { minDur: 6800, sub: '河水又深又急，他不找船、不搭橋，抬腿就想蹚水過河——這就是「馮河」！',
          html: scene(RIVER4 + P(400, 296, A('kid', 'angry')) + sweat(360, 210) + qmark(460, 190)) },
        { minDur: 7200, sub: '孔子說：「這種空手打虎、徒步渡河，死了都不後悔的人，我不跟他共事——我要的是遇事謹慎、善於謀劃的人。」',
          html: scene(P(540, 302, A('kid', 'happy') +
              '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05, true) +
            P(280, 302, A('kid', 'wow')) + qmark(230, 185)) },
        { minDur: 6400, sub: '暴虎馮河：有勇無謀，冒險蠻幹。',
          html: scene(RIVER4 + P(560, 296, A('tiger'), '', 0, .95) + P(300, 296, A('kid', 'angry')) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">暴虎馮河</text>') }
      ];
    },
    /* 城下之盟 */
    i1050: function () {
      var WALL2 = '<rect x="-80" y="-70" width="160" height="70" fill="#b0a390" stroke="#8a7a66" stroke-width="3"/>' +
        '<path d="M-80 -70 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20" fill="none" stroke="#8a7a66" stroke-width="3"/>' +
        '<rect x="-18" y="-44" width="36" height="44" rx="4" fill="#6d6357"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      var TREATY = '<rect x="-18" y="-26" width="36" height="52" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<path d="M-10 -16 h20 M-10 -8 h20 M-10 0 h20 M-10 8 h14" stroke="#8fa3bf" stroke-width="2"/>' +
        '<circle cx="8" cy="16" r="6" fill="none" stroke="#c96a5a" stroke-width="2.4"/>';
      return [
        { minDur: 6800, sub: '春秋時，楚國攻打絞國，還設下誘敵之計，把絞軍打得大敗。',
          html: scene(P(560, 302, WALL2) + bang(430, 210) +
            P(240, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut') +
            P(360, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .2, .9)) },
        { minDur: 7000, sub: '楚軍一路打到城牆下。絞國無力再戰，只好在自己的城下，被迫簽下了屈辱的盟約。',
          html: scene(P(560, 302, WALL2) +
            P(430, 290, TREATY, '', 0, 1.1) +
            P(280, 302, A('kid', 'angry') + P(26, -50, SPEAR3)) +
            P(640, 302, '<g transform="rotate(30)">' + A('kid', 'sad') + '</g>', '', 0, .9) + sweat(680, 210)) },
        { minDur: 6800, sub: '敵人兵臨城下才簽的盟約，是莫大的恥辱——「城下之盟」由此而來。',
          html: scene(P(430, 260, TREATY, '', 0, 1.5) +
            P(200, 302, A('kid', 'sad')) + sweat(250, 200), 'night') },
        { minDur: 6400, sub: '城下之盟：在強大壓力下，被迫接受的屈辱協議。',
          html: scene(P(560, 302, WALL2, '', 0, .9) + P(360, 280, TREATY, '', 0, 1.3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">城下之盟</text>') }
      ];
    },
    /* 尾大不掉 */
    i1075: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var BIGTAILOX = '<g class="st-bob"><ellipse cx="0" cy="-24" rx="28" ry="19" fill="#9fb4c7" stroke="#7e94a8" stroke-width="2"/>' +
        '<circle cx="-22" cy="-44" r="15" fill="#9fb4c7" stroke="#7e94a8" stroke-width="2"/>' +
        '<ellipse cx="-28" cy="-37" rx="9" ry="7" fill="#f2c9c0"/><circle cx="-31" cy="-37" r="1.6" fill="#8a5a50"/>' +
        '<circle cx="-26" cy="-46" r="2.6" fill="#3a2e26"/>' +
        '<path d="M24 -32 q34 4 52 -12 q20 -18 44 -8 q14 6 12 22 q-3 18 -26 18 q-30 0 -48 -6" fill="#7e94a8" stroke="#6d8296" stroke-width="2.6"/>' +
        '<rect x="-20" y="-12" width="9" height="12" rx="4" fill="#7e94a8"/><rect x="6" y="-12" width="9" height="12" rx="4" fill="#7e94a8"/></g>';
      return [
        { minDur: 7000, sub: '楚靈王問大夫申無宇：「封給大臣的城太大，會怎麼樣？」',
          html: scene(P(280, 302, A('kid', 'happy') + CROWN) + qmark(340, 180) +
            P(560, 302, A('kid', 'happy'), '', 0, .95, true)) },
        { minDur: 7400, sub: '申無宇回答：「樹梢太重，樹幹必定折斷；尾巴太大，就甩不動了——這道理，大王您是知道的呀。」',
          html: scene(P(430, 300, BIGTAILOX, '', 0, 1.1) + sweat(380, 230) + qmark(560, 200) +
            P(180, 302, A('kid', 'happy'), '', 0, .9)) },
        { minDur: 6800, sub: '「尾大不掉」從此比喻部屬勢力太大、指揮不動，或機構臃腫、難以調度。',
          html: scene(P(430, 300, BIGTAILOX, '', 0, 1.05) +
            P(180, 302, A('kid', 'sad') + CROWN, '', 0, .95) + sweat(230, 200)) },
        { minDur: 6400, sub: '尾大不掉：勢力龐大，難以指揮調度。',
          html: scene(P(400, 300, BIGTAILOX, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">尾大不掉</text>') }
      ];
    },
    /* 積羽沉舟 */
    i1169: function () {
      var RIVER5 = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 274 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="8" stroke-linecap="round" opacity=".9"/></g>';
      var BOAT3 = '<path d="M-60 0 L60 0 L46 20 L-46 20 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>';
      function feather(x, y, dly, rot) {
        return P(x, y, '<g class="st-snow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '><path d="M0 0 q-8 -14 0 -26 q8 12 0 26 z" fill="#fff" stroke="#e3dcd4" stroke-width="1.6" transform="rotate(' + (rot || 0) + ')"/><line x1="0" y1="0" x2="0" y2="-24" stroke="#d5cfc0" stroke-width="1" transform="rotate(' + (rot || 0) + ')"/></g>');
      }
      function featherPile(x, y) {
        return P(x, y, '<ellipse cx="0" cy="0" rx="46" ry="14" fill="#fff" stroke="#e3dcd4" stroke-width="2"/><ellipse cx="-16" cy="-8" rx="24" ry="9" fill="#fff"/><ellipse cx="16" cy="-10" rx="20" ry="8" fill="#fff"/>');
      }
      return [
        { minDur: 6600, sub: '一根羽毛輕飄飄的，落在船上，什麼感覺也沒有。',
          html: scene(RIVER5 + P(400, 268, BOAT3) + feather(390, 220, 0, 10)) },
        { minDur: 6800, sub: '可是羽毛一根接一根落下、越積越多——堆成小山的羽毛，竟然把船壓沉了！',
          html: scene(RIVER5 + P(400, 282, '<g transform="rotate(-9)">' + BOAT3 + '</g>') + featherPile(400, 252) +
            feather(320, 190, 0, -12) + feather(470, 175, .5, 14) + feather(400, 150, .9, 4) + sweat(500, 230)) },
        { minDur: 7000, sub: '《戰國策》說：「積羽沉舟，群輕折軸」——再小的問題，累積起來也足以釀成大禍，不能輕忽呀。',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(560, 288, featherPile(0, 0) + '', '', 0, .9) + qmark(480, 200)) },
        { minDur: 6400, sub: '積羽沉舟：小問題累積起來，足以釀成大禍。',
          html: scene(RIVER5 + P(400, 282, '<g transform="rotate(-9)">' + BOAT3 + '</g>') + featherPile(400, 252) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">積羽沉舟</text>') }
      ];
    },
    /* 得魚忘筌 */
    i1052: function () {
      var QUAN = '<path d="M-16 0 Q-20 -30 -8 -42 L8 -42 Q20 -30 16 0 Z" fill="none" stroke="#c9a06c" stroke-width="3.4"/>' +
        '<g stroke="#c9a06c" stroke-width="2"><line x1="-14" y1="-12" x2="14" y2="-12"/><line x1="-16" y1="-24" x2="16" y2="-24"/><line x1="-12" y1="-36" x2="12" y2="-36"/></g>' +
        '<ellipse cx="0" cy="0" rx="16" ry="4.6" fill="none" stroke="#a8734a" stroke-width="3"/>';
      var RIVER5 = '<rect y="270" width="800" height="70" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 280 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>';
      return [
        { minDur: 6600, sub: '漁人帶著竹編的捕魚簍「筌」來到河邊，把它沉進水裡等魚游進去。',
          html: scene(RIVER5 + P(430, 296, QUAN, '', 0, 1.1) +
            P(240, 296, A('kid', 'happy'))) },
        { minDur: 6600, sub: '捕到魚啦！他開開心心提著魚回家——竹簍呢？早忘在河邊了。',
          html: scene(RIVER5 + P(560, 296, QUAN, '', 0, .9) +
            P(300, 296, '<g class="st-cheer">' + A('kid', 'happy') + P(40, -60, A('fish'), '', 0, .6) + '</g>') + hearts(230, 200)) },
        { minDur: 7400, sub: '莊子說：「筌是用來捕魚的，捕到了魚，就忘了筌。」他的本意是：工具為目的服務，領會了道理，就不必拘泥形式；但後人也用它譏諷成功後忘本的人。',
          html: scene(P(300, 302, A('kid', 'happy') +
              '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>') +
            P(540, 290, QUAN, '', 0, 1.1) + P(620, 250, A('fish'), '', 0, .9) + qmark(450, 190)) },
        { minDur: 6400, sub: '得魚忘筌：達到目的後，便忘掉了憑藉的工具。',
          html: scene(P(320, 260, A('fish'), '', 0, 1.2) + P(520, 290, QUAN, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">得魚忘筌</text>') }
      ];
    },
    /* 管窺蠡測 */
    i1063: function () {
      var TUBE = '<rect x="-6" y="-40" width="12" height="40" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4" transform="rotate(32)"/>';
      var LADLE = '<path d="M-14 0 a14 11 0 0 0 28 0 z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"/><line x1="12" y1="-4" x2="30" y2="-18" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>';
      var SEA5 = '<rect y="252" width="800" height="88" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 262 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="9" stroke-linecap="round" opacity=".9"/></g>';
      return [
        { minDur: 6800, sub: '拿一根細竹管看天——管子裡的天空，只有小小的一圈，哪裡看得見整片天？',
          html: scene(P(300, 302, A('kid', 'happy') + P(4, -70, TUBE)) +
            P(560, 130, '<circle cx="0" cy="0" r="34" fill="#aee3f5" stroke="#8fd0e8" stroke-width="4"/><circle class="st-tw" cx="-8" cy="-6" r="3" fill="#fff"/>') + qmark(430, 180)) },
        { minDur: 6800, sub: '拿一個小瓢舀海水，想量出大海有多少水——量到什麼時候才量得完？',
          html: scene(SEA5 + P(340, 296, A('kid', 'wow') + P(34, -50, LADLE, '', 0, .9)) + sweat(300, 210) + qmark(440, 190)) },
        { minDur: 7200, sub: '漢朝的東方朔自謙說：「以管窺天、以蠡測海，用這麼淺陋的工具，怎麼度量得了宏大的事物呢？」',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(500, 260, TUBE, '', 0, 1.2) + P(600, 280, LADLE, '', 0, 1.2)) },
        { minDur: 6400, sub: '管窺蠡測：見識狹小淺薄，無法窺見全貌。',
          html: scene(P(300, 270, TUBE, '', 0, 1.5) + P(500, 285, LADLE, '', 0, 1.5) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">管窺蠡測</text>') }
      ];
    },
    /* 擢髮難數 */
    i1064: function () {
      function hairKid(messy) {
        return A('kid', messy ? 'wow' : 'sad') +
          (messy ? '<g stroke="#6b4a32" stroke-width="2.4" stroke-linecap="round"><line x1="-16" y1="-80" x2="-22" y2="-92"/><line x1="-6" y1="-84" x2="-8" y2="-96"/><line x1="6" y1="-84" x2="10" y2="-96"/><line x1="16" y1="-80" x2="22" y2="-92"/></g>' : '');
      }
      var PAPERLONG = '<rect x="-16" y="-46" width="32" height="92" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<g stroke="#8fa3bf" stroke-width="1.8"><line x1="-9" y1="-36" x2="9" y2="-36"/><line x1="-9" y1="-26" x2="9" y2="-26"/><line x1="-9" y1="-16" x2="9" y2="-16"/><line x1="-9" y1="-6" x2="9" y2="-6"/><line x1="-9" y1="4" x2="9" y2="4"/><line x1="-9" y1="14" x2="9" y2="14"/><line x1="-9" y1="24" x2="9" y2="24"/><line x1="-9" y1="34" x2="9" y2="34"/></g>';
      return [
        { minDur: 7000, sub: '戰國時，魏國使者須賈曾陷害過范雎。後來范雎在秦國當了宰相，須賈嚇得前來謝罪：「我有幾條罪呢？」',
          html: scene(P(560, 302, A('kid', 'happy'), '', 0, 1.05, true) +
            P(300, 302, '<g transform="rotate(30)">' + A('kid', 'wow') + '</g>') + sweat(260, 210) + qmark(370, 185)) },
        { minDur: 7200, sub: '范雎冷冷回答：「把你的頭髮全拔下來，一根頭髮記一條罪，都還不夠用！」',
          html: scene(P(560, 302, A('kid', 'angry'), '', 0, 1.05, true) + bang(470, 180) +
            P(300, 302, hairKid(true)) + sweat(340, 200)) },
        { minDur: 6800, sub: '一根頭髮記一條罪狀，拔光了都數不完——罪狀之多，可想而知！',
          html: scene(P(300, 302, hairKid(true)) + P(500, 280, PAPERLONG, '', 0, 1.1) + qmark(580, 200)) },
        { minDur: 6400, sub: '擢髮難數：罪狀多得數不清。',
          html: scene(P(340, 302, hairKid(true)) + P(520, 280, PAPERLONG, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">擢髮難數</text>') }
      ];
    },
    /* 魑魅魍魎 */
    i1062: function () {
      function ghost(x, y, color, dly, sc) {
        return P(x, y, '<g class="st-zfloat"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<path d="M-14 10 L-14 -14 Q-14 -30 0 -30 Q14 -30 14 -14 L14 10 L7 3 L0 10 L-7 3 Z" fill="' + color + '" opacity=".9"/>' +
          '<circle cx="-5" cy="-16" r="2.6" fill="#fff"/><circle cx="5" cy="-16" r="2.6" fill="#fff"/></g>', '', 0, sc || 1);
      }
      var DING = '<path d="M-34 -14 L-30 -52 Q-30 -60 -22 -60 L22 -60 Q30 -60 30 -52 L34 -14 Q34 -4 22 -4 L-22 -4 Q-34 -4 -34 -14 Z" fill="#8a7a5a" stroke="#6d6044" stroke-width="3"/>' +
        '<path d="M-24 -60 q-2 -12 8 -14 M24 -60 q2 -12 -8 -14" stroke="#6d6044" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<g stroke="#6d6044" stroke-width="4"><line x1="-22" y1="-4" x2="-26" y2="14"/><line x1="22" y1="-4" x2="26" y2="14"/><line x1="0" y1="-4" x2="0" y2="14"/></g>' +
        '<circle cx="-10" cy="-38" r="4" fill="#a89878"/><circle cx="10" cy="-38" r="4" fill="#a89878"/><path d="M-12 -22 q12 8 24 0" stroke="#a89878" stroke-width="2.6" fill="none"/>';
      return [
        { minDur: 6800, sub: '傳說山林和川澤裡，住著形形色色的鬼怪精靈——魑魅、魍魎，會迷惑走進去的人。',
          html: scene(P(120, 302, TREE, '', 0, 1.2) +
            ghost(300, 220, '#9ccc65', 0, 1) + ghost(430, 190, '#8fa8c9', .4, .9) + ghost(560, 230, '#c9a8e0', .8, .95), 'night') },
        { minDur: 7400, sub: '周朝人把這些鬼怪的樣子鑄在九鼎上，讓百姓認得牠們——認得了，進山入澤就能避開，不受迷惑！',
          html: scene(P(400, 300, DING, '', 0, 1.6) +
            P(180, 302, A('kid', 'wow'), '', 0, .95) + hearts(260, 190), 'night') },
        { minDur: 6800, sub: '後來「魑魅魍魎」用來比喻各式各樣的壞人——認清他們的真面目，才不會上當。',
          html: scene(ghost(300, 210, '#9ccc65', 0, 1) + ghost(520, 200, '#c9a8e0', .5, .95) +
            P(400, 302, A('kid', 'angry')) + bang(460, 180), 'night') },
        { minDur: 6400, sub: '魑魅魍魎：形形色色的壞人。',
          html: scene(ghost(250, 220, '#9ccc65', 0, 1.1) + ghost(400, 200, '#8fa8c9', .4, 1) + ghost(550, 225, '#c9a8e0', .8, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">魑魅魍魎</text>', 'night') }
      ];
    },
    /* 言過其實 */
    i1187: function () {
      var BED = '<rect x="-90" y="-18" width="180" height="18" rx="6" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<rect x="-84" y="-34" width="52" height="18" rx="8" fill="#f4ecd8" stroke="#ddd2b8" stroke-width="2"/>' +
        '<rect x="-30" y="-32" width="116" height="16" rx="7" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2"/>';
      var MT3 = '<path d="M-130 0 L0 -150 L130 0 Z" fill="#8fb0a0"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      var FAN = '<path d="M0 0 L-16 -34 A22 22 0 0 1 16 -34 Z" fill="#f4f1e8" stroke="#c9bfa8" stroke-width="2.4"/><g stroke="#c9bfa8" stroke-width="1.6"><line x1="0" y1="0" x2="-8" y2="-36"/><line x1="0" y1="0" x2="0" y2="-38"/><line x1="0" y1="0" x2="8" y2="-36"/></g>';
      return [
        { minDur: 7000, sub: '劉備臨終前，特別告誡諸葛亮：「馬謖這個人說話誇張、超過實際本領，不能重用！」',
          html: scene(P(400, 302, BED + P(-10, -30, '<circle cx="0" cy="0" r="15" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>', '', 0, .9)) +
            P(620, 302, A('kid', 'sad') + P(-30, -40, FAN, '', 0, .9), '', 0, .95, true), 'night') },
        { minDur: 6800, sub: '馬謖平日談起兵法頭頭是道，諸葛亮很賞識他，派他去鎮守軍事要地街亭。',
          html: scene(P(300, 302, A('kid', 'happy')) + notes(380, 175) +
            P(560, 302, A('kid', 'happy') + P(-30, -40, FAN, '', 0, .9), '', 0, .95, true) + hearts(460, 190)) },
        { minDur: 7200, sub: '到了街亭，馬謖不聽副將勸告，硬把大軍駐紮在山頂——被魏軍切斷水源，圍山猛攻，街亭大敗！',
          html: scene(P(430, 302, MT3 + P(0, -150, A('kid', 'wow'), '', 0, .7)) +
            P(150, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', 0, .85) +
            P(680, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', .2, .85, true) +
            bang(430, 120) + sweat(470, 160)) },
        { minDur: 7000, sub: '諸葛亮揮淚處置馬謖，想起先主的告誡——「言過其實，不可大用」，悔之晚矣。',
          html: scene(P(400, 302, A('kid', 'sad') + P(-30, -40, FAN, '', 0, .9)) + sweat(350, 195) + sweat(450, 200), 'night') },
        { minDur: 6400, sub: '言過其實：言辭誇張，超過實際才能或情形。',
          html: scene(P(340, 302, A('kid', 'happy')) + notes(420, 180) + qmark(280, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">言過其實</text>') }
      ];
    },
    /* 身先士卒 */
    i708: function () {
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      var BROOM2 = '<line x1="0" y1="0" x2="20" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M0 0 l-10 12 M0 0 l-2 14 M0 0 l6 13" stroke="#c9a06c" stroke-width="3.4" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '打仗的時候，好的將軍不躲在隊伍後面，而是高舉武器，衝在所有士兵的最前面！',
          html: scene(P(240, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', 0, 1.05) +
            P(420, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .2, .88) +
            P(560, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .4, .84) + bang(150, 200)) },
        { minDur: 6600, sub: '將軍身先士卒、不怕危險，士兵們士氣大振，個個奮勇向前！',
          html: scene(P(240, 302, '<g class="st-cheer">' + A('kid', 'angry') + P(26, -50, SPEAR3) + '</g>', '', 0, 1.05) +
            P(430, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + P(26, -50, SPEAR3) + '</g>', '', 0, .88) +
            P(590, 302, '<g class="st-cheer" style="animation-delay:.4s">' + A('kid', 'happy') + P(26, -50, SPEAR3) + '</g>', '', 0, .84) +
            hearts(400, 165)) },
        { minDur: 6800, sub: '生活裡也一樣：班長帶頭捲起袖子打掃，同學們也跟著一起動起來！',
          html: scene(P(280, 302, A('kid', 'happy') + P(20, -34, BROOM2, 'st-hoe')) +
            P(460, 302, A('kid', 'happy') + P(20, -34, BROOM2), '', .3, .9) +
            P(620, 302, A('kid', 'happy'), 'st-inR', .5, .85) + hearts(380, 180)) },
        { minDur: 6400, sub: '身先士卒：走在最前面，率先垂範。',
          html: scene(P(300, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', 0, 1.1) +
            P(520, 302, A('kid', 'happy') + P(26, -50, SPEAR3), '', 0, .85) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">身先士卒</text>') }
      ];
    },
    /* 盤根錯節 */
    i1141: function () {
      var ROOTS = '<g stroke="#8a5a33" stroke-width="7" fill="none" stroke-linecap="round">' +
        '<path d="M0 -60 L0 -20 M0 -20 q-30 10 -56 2 q-18 -6 -30 8 M0 -20 q30 10 56 0 q18 -8 32 6 M0 -20 q-14 22 -6 40 M0 -20 q16 20 30 26"/>' +
        '<path d="M-40 -6 q-10 14 -26 14 M42 -8 q12 12 26 10" stroke-width="5"/></g>' +
        '<circle cx="0" cy="-72" r="20" fill="#7cc47f"/><circle cx="-17" cy="-62" r="13" fill="#8fd08f"/><circle cx="17" cy="-63" r="14" fill="#8fd08f"/>';
      var BLADE = '<path d="M0 0 L26 -40 q6 -10 -2 -12 q-8 -2 -12 8 L0 0 z" fill="#c4cede" stroke="#8b93a3" stroke-width="2"/><rect x="-6" y="0" width="12" height="12" rx="3" fill="#8a5a33"/>';
      return [
        { minDur: 7000, sub: '東漢的虞詡被派到最難治理的朝歌當官，朋友們都來安慰他：「這差事太苦了！」',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(540, 302, A('kid', 'sad'), '', 0, .95, true) + sweat(580, 200) + qmark(480, 185)) },
        { minDur: 7200, sub: '虞詡卻笑著說：「不碰上盤繞的樹根、交錯的枝節，怎麼顯得出刀刃的鋒利呢？」',
          html: scene(P(500, 302, ROOTS, '', 0, 1.1) +
            P(240, 302, A('kid', 'happy') + P(30, -50, BLADE, '', 0, .9)) + hearts(320, 180)) },
        { minDur: 6800, sub: '他果然大展身手，把難題一一解決，聲名大噪！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(560, 302, A('kid', 'happy'), '', 0, .9) + hearts(430, 175) + bang(500, 200)) },
        { minDur: 6400, sub: '盤根錯節：事情複雜難以處理，或勢力根深柢固。',
          html: scene(P(400, 302, ROOTS, '', 0, 1.3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">盤根錯節</text>') }
      ];
    },
    /* 各自為政 */
    i1197: function () {
      function cart2() {
        return '<circle cx="0" cy="-24" r="24" fill="#c9a06c" stroke="#a8734a" stroke-width="4"/>' +
          '<g stroke="#a8734a" stroke-width="3.4"><line x1="0" y1="-42" x2="0" y2="-6"/><line x1="-18" y1="-24" x2="18" y2="-24"/></g>' +
          '<rect x="-12" y="-74" width="96" height="36" rx="7" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>';
      }
      var MEAT = '<ellipse cx="0" cy="0" rx="12" ry="9" fill="#e88a7a" stroke="#c96a5a" stroke-width="2"/><rect x="-3" y="-15" width="6" height="8" rx="3" fill="#f4f1e8"/>';
      return [
        { minDur: 7200, sub: '宋鄭交戰前夜，宋軍主帥華元殺羊犒賞全軍——偏偏漏掉了自己的車夫羊斟，一口也沒分給他。',
          html: scene(P(240, 302, A('kid', 'happy') + P(40, -60, MEAT, '', 0, .9)) +
            P(420, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .85) +
            P(530, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .82) +
            P(680, 302, A('kid', 'sad'), '', 0, .9) + sweat(710, 205) + qmark(650, 185)) },
        { minDur: 7400, sub: '開戰了！羊斟冷冷地說：「昨天分羊肉，你作主；今天駕車，我作主！」竟駕著主帥的戰車，直衝進敵陣！',
          html: scene(P(360, 302, A('horse') + P(70, 0, cart2() + P(30, -74, A('kid', 'wow'), '', 0, .6)), 'st-dashL', 0, 1, true) +
            bang(620, 210) + sweat(500, 180)) },
        { minDur: 6800, sub: '主帥當場被敵軍活捉，宋軍大敗——只因為兩個人「各自為政」，不互相配合。',
          html: scene(P(500, 302, '<g transform="rotate(30)">' + A('kid', 'sad') + '</g>', '', 0, .95) +
            P(300, 302, A('kid', 'angry'), '', 0, .9) + P(650, 302, A('kid', 'angry'), '', .2, .9) + sweat(540, 210), 'night') },
        { minDur: 6400, sub: '各自為政：各自按自己的主張行事，不互相配合。',
          html: scene(P(260, 302, A('kid', 'happy')) + P(560, 302, A('kid', 'angry'), '', 0, .95, true) +
            '<path d="M370 240 L430 240 M370 250 L430 250" stroke="#c96a5a" stroke-width="4" stroke-dasharray="8 8"/>' +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">各自為政</text>') }
      ];
    },
    /* 輔車相依 */
    i1199: function () {
      var JAW = '<path d="M-44 -14 Q0 -40 44 -14 Q44 8 0 14 Q-44 8 -44 -14 Z" fill="#f2c9b8" stroke="#d9a890" stroke-width="3"/>' +
        '<g fill="#fff" stroke="#d5cfc0" stroke-width="1.6"><rect x="-30" y="-18" width="13" height="13" rx="3"/><rect x="-13" y="-21" width="13" height="14" rx="3"/><rect x="3" y="-21" width="13" height="14" rx="3"/><rect x="19" y="-18" width="13" height="13" rx="3"/></g>';
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '頰骨和牙床，一外一內、互相支撐依靠——少了哪一個，都咬不動東西。',
          html: scene(P(400, 200, '<circle cx="0" cy="-4" r="62" fill="#fff" opacity=".9"/>' + JAW, '', 0, 1.1) +
            P(200, 302, A('kid', 'wow')) + qmark(260, 190)) },
        { minDur: 7200, sub: '宮之奇勸虞公：「虞虢兩國就像輔車相依、脣亡齒寒——虢國亡了，虞國一定跟著遭殃！」',
          html: scene(P(400, 190, '<circle cx="0" cy="-4" r="56" fill="#fff" opacity=".9"/>' + P(0, 0, JAW, '', 0, .85)) +
            P(200, 302, A('kid', 'angry')) + sweat(160, 200) +
            P(600, 302, A('kid', 'happy') + CROWN, '', 0, 1, true) + qmark(650, 190)) },
        { minDur: 6800, sub: '虞公貪圖財寶不聽勸。虢國滅亡後，虞國果然也被晉國順手滅了。',
          html: scene(P(560, 302, '<g class="st-slump">' + A('kid', 'sad') + CROWN + '</g>') + sweat(600, 200) + bang(300, 200), 'night') },
        { minDur: 6400, sub: '輔車相依：兩者關係密切，互相依存。',
          html: scene(P(400, 230, '<circle cx="0" cy="-4" r="66" fill="#fff" opacity=".9"/>' + JAW, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">輔車相依</text>') }
      ];
    },
    /* 神機妙算 */
    i700: function () {
      var FAN = '<path d="M0 0 L-16 -34 A22 22 0 0 1 16 -34 Z" fill="#f4f1e8" stroke="#c9bfa8" stroke-width="2.4"/><g stroke="#c9bfa8" stroke-width="1.6"><line x1="0" y1="0" x2="-8" y2="-36"/><line x1="0" y1="0" x2="0" y2="-38"/><line x1="0" y1="0" x2="8" y2="-36"/></g>';
      var STRAWBOAT = '<path d="M-52 0 L52 0 L40 16 L-40 16 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>' +
        '<g stroke="#c9a06c" stroke-width="5" stroke-linecap="round"><line x1="-30" y1="0" x2="-30" y2="-26"/><line x1="0" y1="0" x2="0" y2="-30"/><line x1="30" y1="0" x2="30" y2="-24"/></g>' +
        '<circle cx="-30" cy="-32" r="7" fill="#e8dcc0"/><circle cx="0" cy="-36" r="7" fill="#e8dcc0"/><circle cx="30" cy="-30" r="7" fill="#e8dcc0"/>';
      function arrows(x, y) {
        return P(x, y, '<g stroke="#8a5a33" stroke-width="2.6" stroke-linecap="round"><line x1="0" y1="0" x2="-20" y2="10"/><line x1="10" y1="-8" x2="-12" y2="4"/><line x1="20" y1="4" x2="-2" y2="16"/></g><path d="M-20 10 l-6 5 l3 -8 z M-12 4 l-6 5 l3 -8 z M-2 16 l-6 5 l3 -8 z" fill="#6d7585"/>');
      }
      var FOG = '<ellipse cx="200" cy="200" rx="150" ry="40" fill="#fff" opacity=".45"/><ellipse cx="520" cy="160" rx="180" ry="46" fill="#fff" opacity=".4"/><ellipse cx="400" cy="240" rx="220" ry="42" fill="#fff" opacity=".35"/>';
      var RIVER6 = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>';
      return [
        { minDur: 7000, sub: '周瑜故意刁難諸葛亮：「十天之內，造出十萬支箭！」諸葛亮搖著羽扇微笑：「三天就夠了。」',
          html: scene(P(280, 302, A('kid', 'angry')) + qmark(340, 180) +
            P(540, 302, A('kid', 'happy') + P(-30, -40, FAN, '', 0, .9), '', 0, 1, true) + hearts(600, 190)) },
        { minDur: 7200, sub: '第三天夜裡大霧瀰漫。諸葛亮派出二十艘綁滿草人的船，敲鑼打鼓，慢慢駛近曹軍水寨——',
          html: scene(RIVER6 + FOG + P(300, 268, STRAWBOAT) + P(520, 274, STRAWBOAT, '', 0, .85) +
            notes(400, 170), 'night') },
        { minDur: 7000, sub: '曹軍在霧裡看不清虛實，只敢拚命放箭！箭像雨點般射來，全都插在草人身上。',
          html: scene(RIVER6 + FOG + P(300, 268, STRAWBOAT + arrows(-10, -40)) + arrows(430, 180) + arrows(200, 160) +
            bang(600, 200), 'night') },
        { minDur: 7000, sub: '天亮返航，十萬支箭輕鬆到手！周瑜嘆服：「諸葛亮神機妙算，我真不如他呀！」',
          html: scene(P(300, 302, A('kid', 'happy') + P(-30, -40, FAN, '', 0, .9)) + hearts(380, 175) +
            P(560, 302, '<g transform="rotate(24)">' + A('kid', 'wow') + '</g>', '', 0, .95) + sweat(610, 205)) },
        { minDur: 6400, sub: '神機妙算：神奇的機智，巧妙的謀劃。',
          html: scene(P(340, 302, A('kid', 'happy') + P(-30, -40, FAN, '', 0, .9), '', 0, 1.05) + bang(480, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">神機妙算</text>') }
      ];
    },
    /* 徒有虛名 */
    i1189: function () {
      var GRAIN2 = '<path d="M-26 0 Q-30 -34 0 -40 Q30 -34 26 0 Z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>' +
        '<path d="M-12 -40 q12 -8 24 0" stroke="#a8734a" stroke-width="3" fill="none"/>';
      var TINYBOWL = '<path d="M-8 -3 q0 7 8 7 q8 0 8 -7 z" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2"/><circle cx="0" cy="-4" r="1.6" fill="#c9a06c"/>';
      return [
        { minDur: 6800, sub: '北齊鬧饑荒，朝廷宣布要開倉發糧救災——聽起來，好大方呀！',
          html: scene(P(280, 302, A('kid', 'happy') + '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>') +
            P(520, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            P(650, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .85) + hearts(430, 180)) },
        { minDur: 7200, sub: '大臣李元忠一算：一萬石糧分到全國，每戶分不到一升一斗——這一點點，根本救不了災！',
          html: scene(P(300, 302, A('kid', 'wow')) + P(480, 296, TINYBOWL, '', 0, 1.4) + qmark(430, 200) +
            sweat(260, 195)) },
        { minDur: 6800, sub: '他直言：「這樣的救濟只是空有名聲，解決不了問題！」力主加倍發糧，才真正救了百姓。',
          html: scene(P(300, 302, A('kid', 'angry')) + bang(380, 180) +
            P(540, 290, GRAIN2, '', 0, 1) + P(640, 292, GRAIN2, '', .2, .9) + hearts(600, 200)) },
        { minDur: 6400, sub: '徒有虛名：空有名聲，沒有實際本領或內涵。',
          html: scene(P(400, 296, TINYBOWL, '', 0, 1.8) + qmark(500, 220) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">徒有虛名</text>') }
      ];
    },
    /* 譁眾取寵 */
    i1198: function () {
      return [
        { minDur: 7000, sub: '有的讀書人不肯下功夫鑽研道理，專挑浮誇聳動的話講，逗得群眾又笑又叫好。',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + notes(380, 160) +
            P(520, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .85) +
            P(650, 302, '<g class="st-cheer" style="animation-delay:.4s">' + A('kid', 'happy') + '</g>', '', 0, .8) + hearts(560, 180)) },
        { minDur: 6800, sub: '台下喝采聲不斷——可是仔細一聽，內容空空洞洞，什麼真道理也沒有。',
          html: scene(P(300, 302, A('kid', 'happy'), '', 0, 1.05) + notes(370, 165) +
            P(560, 302, A('kid', 'wow'), '', 0, .9) + qmark(610, 185) + sweat(520, 200)) },
        { minDur: 6800, sub: '《漢書》批評這種人「譁眾取寵」：違背了學問的根本，只為博取一時的喝采。',
          html: scene(P(300, 302, A('kid', 'sad'), '', 0, 1.05) + sweat(250, 195) +
            P(540, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>'), '', 0, .95, true)) },
        { minDur: 6400, sub: '譁眾取寵：用浮誇言行討好群眾，博取喝采。',
          html: scene(P(340, 302, A('kid', 'happy'), '', 0, 1.05) + notes(420, 170) + hearts(260, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">譁眾取寵</text>') }
      ];
    },
    /* 委曲求全 */
    i1135: function () {
      return [
        { minDur: 6800, sub: '團隊裡意見不合、吵得不可開交——有人選擇先退讓一步，勉強遷就，不讓爭吵毀了大事。',
          html: scene(P(280, 302, A('kid', 'angry')) + bang(400, 180) +
            P(540, 302, A('kid', 'sad'), '', 0, .95, true) + sweat(580, 200)) },
        { minDur: 6800, sub: '委屈了自己、顧全了大局——事情才得以繼續往前走。',
          html: scene(P(320, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .95, true) +
            hearts(410, 175)) },
        { minDur: 7200, sub: '不過漢朝的嚴彭祖也說過：「怎麼能委曲自己迎合世俗，只為求富貴呢！」——該堅持的原則，還是要堅持。',
          html: scene(P(400, 302, A('kid', 'angry'), '', 0, 1.05) + bang(480, 180) +
            P(200, 302, A('kid', 'wow'), '', 0, .9) + qmark(250, 185)) },
        { minDur: 6400, sub: '委曲求全：勉強遷就忍讓，以求保全大局。',
          html: scene(P(300, 302, '<g transform="rotate(20)">' + A('kid', 'happy') + '</g>') + P(540, 302, A('kid', 'happy'), '', 0, .95, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">委曲求全</text>') }
      ];
    },
    /* 量入為出 */
    i1162: function () {
      var COIN = '<circle cx="0" cy="0" r="10" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/><rect x="-3.4" y="-3.4" width="6.8" height="6.8" fill="none" stroke="#c98f2a" stroke-width="2"/>';
      var LEDGER = '<rect x="-20" y="-26" width="40" height="52" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<line x1="0" y1="-26" x2="0" y2="26" stroke="#c9bfa8" stroke-width="2"/>' +
        '<g stroke="#8fa3bf" stroke-width="1.8"><line x1="-14" y1="-14" x2="-5" y2="-14"/><line x1="-14" y1="-4" x2="-5" y2="-4"/><line x1="5" y1="-14" x2="14" y2="-14"/><line x1="5" y1="-4" x2="14" y2="-4"/></g>' +
        '<text x="-9" y="16" text-anchor="middle" font-size="10" fill="#548a40">入</text><text x="9" y="16" text-anchor="middle" font-size="10" fill="#c96a5a">出</text>';
      var JAR = '<path d="M-16 0 Q-22 -14 -14 -30 L14 -30 Q22 -14 16 0 Z" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2.6"/><rect x="-10" y="-36" width="20" height="8" rx="3" fill="#6d87ab"/><line x1="-5" y1="-32" x2="5" y2="-32" stroke="#fff" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '《禮記》說：國家要先算清一年收入多少，再決定能支出多少——「量入以為出」。',
          html: scene(P(400, 280, LEDGER, '', 0, 1.4) +
            P(200, 302, A('kid', 'happy')) + P(600, 290, COIN, '', 0, 1.2)) },
        { minDur: 6600, sub: '收入十枚錢，就別花掉十二枚；先存下一些，缺錢的時候才不會慌張。',
          html: scene(P(300, 290, COIN, '', 0, 1) + P(345, 290, COIN, '', .1, 1) + P(390, 290, COIN, '', .2, 1) +
            P(540, 296, JAR, '', 0, 1.1) +
            '<path d="M420 270 q60 -30 100 -10" stroke="#548a40" stroke-width="3.4" fill="none" stroke-dasharray="7 7"/>' + hearts(620, 220)) },
        { minDur: 6800, sub: '零用錢也一樣：記帳、量入為出，把想買的東西列進計畫——需要時就買得起！',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, LEDGER, '', 0, .8)) +
            P(520, 296, JAR, '', 0, 1) + hearts(420, 180)) },
        { minDur: 6400, sub: '量入為出：衡量收入來決定支出。',
          html: scene(P(320, 280, LEDGER, '', 0, 1.3) + P(520, 292, JAR, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">量入為出</text>') }
      ];
    },
    /* 除舊布新 */
    i1097: function () {
      var COMET = '<g class="st-fly"><circle cx="0" cy="0" r="9" fill="#ffe9a0" stroke="#ffd97a" stroke-width="2"/>' +
        '<path d="M6 -4 q40 -18 76 -22 M7 2 q42 -6 78 -4 M5 7 q38 8 70 16" stroke="#ffe9a0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/></g>';
      var BROOM2 = '<line x1="0" y1="0" x2="20" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M0 0 l-10 12 M0 0 l-2 14 M0 0 l6 13" stroke="#c9a06c" stroke-width="3.4" stroke-linecap="round"/>';
      var LANTERN = '<line x1="0" y1="-40" x2="0" y2="-30" stroke="#a85a1e" stroke-width="2.6"/>' +
        '<path d="M-12 -30 Q-16 -12 -12 0 L12 0 Q16 -12 12 -30 Z" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.4"/>' +
        '<line x1="-6" y1="-28" x2="-6" y2="-2" stroke="#c94a3f" stroke-width="1.6"/><line x1="6" y1="-28" x2="6" y2="-2" stroke="#c94a3f" stroke-width="1.6"/>' +
        '<path d="M-6 0 l0 8 M0 0 l0 9 M6 0 l0 8" stroke="#ffd97a" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '古人看見拖著長尾巴的彗星劃過天空，說：「這是一把大掃帚，要掃除舊的、布置新的了！」',
          html: scene(P(430, 110, COMET, '', 0, 1.2) +
            P(240, 302, A('kid', 'wow')) + qmark(300, 190), 'night') },
        { minDur: 6600, sub: '就像過年大掃除：把舊灰塵掃出門，掛上新春聯、新燈籠，迎接新的一年！',
          html: scene(P(280, 302, A('kid', 'happy') + P(20, -34, BROOM2, 'st-hoe')) +
            P(560, 300, LANTERN, '', 0, 1.2) + P(640, 296, LANTERN, '', .3, 1) + hearts(430, 180)) },
        { minDur: 6600, sub: '「除舊布新」：去除舊的、建立新的——生活和制度，都要不斷更新進步。',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(540, 300, LANTERN, '', 0, 1.1) + hearts(430, 185)) },
        { minDur: 6400, sub: '除舊布新：去除舊的，建立新的。',
          html: scene(P(300, 302, A('kid', 'happy') + P(20, -34, BROOM2)) + P(540, 298, LANTERN, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">除舊布新</text>') }
      ];
    },
    /* 革故鼎新 */
    i1115: function () {
      var DING = '<path d="M-34 -14 L-30 -52 Q-30 -60 -22 -60 L22 -60 Q30 -60 30 -52 L34 -14 Q34 -4 22 -4 L-22 -4 Q-34 -4 -34 -14 Z" fill="#8a7a5a" stroke="#6d6044" stroke-width="3"/>' +
        '<path d="M-24 -60 q-2 -12 8 -14 M24 -60 q2 -12 -8 -14" stroke="#6d6044" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<g stroke="#6d6044" stroke-width="4"><line x1="-22" y1="-4" x2="-26" y2="14"/><line x1="22" y1="-4" x2="26" y2="14"/><line x1="0" y1="-4" x2="0" y2="14"/></g>';
      var OLDSCROLL = '<rect x="-26" y="-9" width="52" height="18" rx="8" fill="#c9bfa8" stroke="#a89878" stroke-width="2.4"/><path d="M-18 -4 h36 M-18 2 h36" stroke="#a89878" stroke-width="1.6"/>';
      return [
        { minDur: 7000, sub: '《周易》裡有「革」「鼎」兩卦：「革」是去除舊的，「鼎」是取用新的。',
          html: scene(P(300, 290, OLDSCROLL, '', 0, 1.2) + P(540, 300, DING, '', 0, 1.2) +
            '<path d="M360 260 L470 260" stroke="#4a3200" stroke-width="4" stroke-dasharray="9 8"/><path d="M470 260 l-12 -8 v16 z" fill="#4a3200"/>') },
        { minDur: 7000, sub: '朝代更替、制度改革，把過時的規矩革除，建立起全新的秩序——這就是「革故鼎新」。',
          html: scene(P(240, 302, A('kid', 'happy') + '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>') +
            P(520, 300, DING, '', 0, 1.3) + hearts(400, 185) + bang(620, 210)) },
        { minDur: 6800, sub: '它多用在大的變革上：新政推行、制度翻新，讓國家煥然一新！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(500, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            P(650, 300, DING, '', 0, .9) + hearts(420, 170)) },
        { minDur: 6400, sub: '革故鼎新：革除舊的，建立新的（多指重大改革）。',
          html: scene(P(400, 298, DING, '', 0, 1.6) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">革故鼎新</text>') }
      ];
    },
    /* 俯首稱臣 */
    i1113: function () {
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      function bow2(x, sc, dly) {
        return P(x, 302, '<g transform="rotate(42)">' + A('kid', 'happy') + '</g>', '', dly, sc || 1);
      }
      return [
        { minDur: 6800, sub: '兩軍交戰，敗的一方打不下去了——國君只好低下頭，向對方自稱臣子。',
          html: scene(P(560, 302, A('kid', 'happy') + CROWN, '', 0, 1.05, true) +
            bow2(300, 1) + sweat(340, 210)) },
        { minDur: 6800, sub: '「俯首」是低頭，「稱臣」是自稱臣子——合起來，就是徹底屈服、甘拜下風。',
          html: scene(P(560, 302, A('kid', 'happy') + CROWN, '', 0, 1.05, true) +
            bow2(280, 1) + bow2(400, .9, .3) + qmark(480, 190)) },
        { minDur: 6800, sub: '現在也用在比賽或較量上：面對這位棋王，挑戰者一個個俯首稱臣！',
          html: scene(P(560, 302, A('kid', 'happy'), '', 0, 1.05, true) + hearts(620, 190) +
            P(430, 260, '<rect x="-24" y="-24" width="48" height="48" rx="5" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.6"/><g stroke="#a89878" stroke-width="1.8"><line x1="-24" y1="-8" x2="24" y2="-8"/><line x1="-24" y1="8" x2="24" y2="8"/><line x1="-8" y1="-24" x2="-8" y2="24"/><line x1="8" y1="-24" x2="8" y2="24"/></g><circle cx="-16" cy="-16" r="5" fill="#3a2e26"/><circle cx="16" cy="0" r="5" fill="#fff" stroke="#c9bfa8"/>') +
            bow2(260, .95)) },
        { minDur: 6400, sub: '俯首稱臣：屈服投降，甘拜下風。',
          html: scene(P(560, 302, A('kid', 'happy') + CROWN, '', 0, 1.05, true) + bow2(300, 1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">俯首稱臣</text>') }
      ];
    },
    /* 言之鑿鑿 */
    i1166: function () {
      var STONE2 = '<path d="M-24 0 q-6 -20 8 -26 q16 -7 28 4 q10 10 2 22 z" fill="#e8e2d4" stroke="#b8ae9c" stroke-width="2.6"/>';
      var CHECKDOC = '<rect x="-18" y="-24" width="36" height="48" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<path d="M-10 -14 h20 M-10 -6 h20 M-10 2 h20" stroke="#8fa3bf" stroke-width="2"/>' +
        '<path d="M-8 12 l6 7 l12 -12" stroke="#548a40" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '《詩經》裡說溪水中的白石「鑿鑿」——稜角分明、清清楚楚，一眼就看得真切。',
          html: scene('<rect y="286" width="800" height="54" fill="#7fb2e0"/>' +
            P(300, 300, STONE2, '', 0, 1.1) + P(440, 304, STONE2, '', .2, .9) + P(560, 300, STONE2, '', .4, 1) +
            P(150, 296, A('kid', 'happy'), '', 0, .9)) },
        { minDur: 6800, sub: '後來「言之鑿鑿」形容話說得像白石一樣分明：有憑有據、非常確實。',
          html: scene(P(300, 302, A('kid', 'happy')) + P(450, 270, CHECKDOC, '', 0, 1.2) +
            P(620, 302, A('kid', 'happy'), '', 0, .9, true) + hearts(560, 195)) },
        { minDur: 6800, sub: '不過要小心：有人「言之鑿鑿」，講得斬釘截鐵，內容卻未必是真的——證據才是關鍵！',
          html: scene(P(300, 302, A('kid', 'happy')) + notes(370, 175) +
            P(560, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(610, 185)) },
        { minDur: 6400, sub: '言之鑿鑿：說得非常確實、有憑有據的樣子。',
          html: scene(P(320, 290, STONE2, '', 0, 1.3) + P(500, 272, CHECKDOC, '', 0, 1.3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">言之鑿鑿</text>') }
      ];
    },
    /* 曠日持久 */
    i1142: function () {
      var CAL = '<rect x="-26" y="-30" width="52" height="60" rx="5" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<rect x="-26" y="-30" width="52" height="14" rx="5" fill="#c96a5a"/>' +
        '<g stroke="#8fa3bf" stroke-width="1.8"><line x1="-16" y1="-6" x2="16" y2="-6"/><line x1="-16" y1="4" x2="16" y2="4"/><line x1="-16" y1="14" x2="16" y2="14"/></g>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      var WALL2 = '<rect x="-60" y="-50" width="120" height="50" fill="#b0a390" stroke="#8a7a66" stroke-width="3"/>' +
        '<path d="M-60 -50 h15 v-11 h15 v11 h15 v-11 h15 v11 h15 v-11 h15 v11 h15" fill="none" stroke="#8a7a66" stroke-width="3"/>';
      return [
        { minDur: 7000, sub: '戰國時，趙國名將趙奢分析：這場仗打下去，會拖上好幾年，士兵的力氣都耗在壕溝壁壘裡。',
          html: scene(P(560, 302, WALL2) +
            P(240, 302, A('kid', 'happy')) +
            P(420, 302, A('kid', 'sad') + P(26, -50, SPEAR3), '', 0, .9) + sweat(460, 200)) },
        { minDur: 6800, sub: '日子一天天翻過去，仗還沒打完——荒廢了時日，拖延得長長久久。',
          html: scene(P(300, 270, CAL, '', 0, 1.1) + P(430, 276, CAL, '', .2, .9) + P(540, 272, CAL, '', .4, .75) +
            sweat(430, 210) + zzz(620, 210)) },
        { minDur: 6800, sub: '「曠日持久」用來形容事情拖延太久、遲遲沒有結果——寫作業拖拖拉拉，也是一種曠日持久呀！',
          html: scene(P(300, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') +
            P(460, 280, '<rect x="-14" y="-20" width="28" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -12 h16 M-8 -4 h16" stroke="#8fa3bf" stroke-width="1.8"/>') +
            zzz(380, 200) + sweat(250, 200)) },
        { minDur: 6400, sub: '曠日持久：荒廢時日，拖延長久。',
          html: scene(P(320, 272, CAL, '', 0, 1.2) + P(480, 276, CAL, '', .3, 1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">曠日持久</text>') }
      ];
    },
    /* 不著邊際 */
    i1184: function () {
      var LAKE = '<rect y="220" width="800" height="120" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 240 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>';
      var BOAT4 = '<path d="M-40 0 L40 0 L30 14 L-30 14 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>';
      return [
        { minDur: 7000, sub: '《水滸傳》裡，何濤困在八百里水泊中，四面望去全是水，摸不著岸邊——「在此不著邊際，怎生奈何！」',
          html: scene(LAKE + P(400, 250, BOAT4 + P(0, 0, A('kid', 'wow'), '', 0, .8)) +
            qmark(480, 170) + sweat(330, 180)) },
        { minDur: 6800, sub: '後來「不著邊際」形容說話空泛、離題萬里——講了半天，一句也碰不到重點的邊！',
          html: scene(P(300, 302, A('kid', 'happy')) + notes(250, 175) + notes(380, 160) +
            P(560, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(610, 185) + sweat(520, 200)) },
        { minDur: 6800, sub: '寫作文也一樣：緊扣題目才拿得到分數，天馬行空、不著邊際，可就離題啦。',
          html: scene(P(300, 302, A('kid', 'sad') + P(-40, -56, '<rect x="-14" y="-20" width="28" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -12 h16 M-8 -4 h16 M-8 4 h16" stroke="#8fa3bf" stroke-width="1.8"/>')) +
            qmark(400, 180) + sweat(250, 200)) },
        { minDur: 6400, sub: '不著邊際：言論空泛、不切實際或離題。',
          html: scene(LAKE + P(400, 252, BOAT4) + qmark(480, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">不著邊際</text>') }
      ];
    },
    /* 言不及義 */
    i1193: function () {
      return [
        { minDur: 7000, sub: '孔子感嘆：有些人整天聚在一起，說的話卻沒有一句碰得到正經道理，只愛耍小聰明——這種人很難教好呀！',
          html: scene(P(260, 302, A('kid', 'happy'), '', 0, .9) + P(390, 302, A('kid', 'happy'), '', .2, .88) +
            P(510, 302, A('kid', 'happy'), '', .4, .86) + notes(380, 165) +
            P(680, 302, A('kid', 'sad') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1, true) + sweat(720, 200)) },
        { minDur: 6800, sub: '嘻嘻哈哈聊了一整天，功課沒討論、正事沒半句——時間就這樣溜走了。',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(460, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            notes(380, 165) + zzz(560, 200)) },
        { minDur: 6600, sub: '「言不及義」提醒我們：談天說地之餘，也別忘了把正經事放在心上。',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>')) +
            P(540, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(430, 180)) },
        { minDur: 6400, sub: '言不及義：說的話都觸及不到正經道理。',
          html: scene(P(300, 302, A('kid', 'happy')) + P(480, 302, A('kid', 'happy'), '', 0, .9) + notes(400, 170) + qmark(560, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">言不及義</text>') }
      ];
    },
    /* 各行其是 */
    i1196: function () {
      return [
        { minDur: 6800, sub: '莊子說：天下沒有人人公認的「對」，每個人都覺得自己才是對的。',
          html: scene(P(280, 302, A('kid', 'angry')) + P(540, 302, A('kid', 'angry'), '', 0, .95, true) +
            bang(410, 180) + qmark(220, 185) + qmark(600, 190)) },
        { minDur: 7000, sub: '划一條船，一個往東划、一個往西划——誰也不服誰，船就在原地打轉！',
          html: scene('<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
            P(400, 268, '<path d="M-60 0 L60 0 L46 20 L-46 20 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>' +
              P(-24, 0, A('kid', 'angry'), '', 0, .75) + P(28, 0, A('kid', 'angry'), '', 0, .72, true) +
              '<line x1="-52" y1="10" x2="-76" y2="26" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/>' +
              '<line x1="52" y1="10" x2="76" y2="26" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/>') +
            qmark(400, 170) + sweat(320, 200) + sweat(490, 205)) },
        { minDur: 6800, sub: '團體裡如果人人「各行其是」、缺乏協調，力氣再大也拉不動一件事。',
          html: scene(P(280, 302, A('kid', 'angry'), 'st-inL') +
            P(540, 302, A('kid', 'angry'), 'st-inR', 0, .95, true) +
            '<line x1="360" y1="260" x2="460" y2="260" stroke="#a8734a" stroke-width="8" stroke-linecap="round"/>' + sweat(410, 220)) },
        { minDur: 6400, sub: '各行其是：各人按自己認為對的去做，缺乏協調。',
          html: scene(P(280, 302, A('kid', 'happy')) + P(540, 302, A('kid', 'happy'), '', 0, .95, true) +
            '<path d="M300 230 l-40 -30 M500 230 l40 -30" stroke="#c96a5a" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 7"/>' +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">各行其是</text>') }
      ];
    },
    /* 名聞遐邇 */
    i734: function () {
      var MEGA = '<path d="M0 0 L30 -14 L30 14 Z" fill="#e0a458" stroke="#c08838" stroke-width="2.4"/><rect x="-12" y="-7" width="14" height="14" rx="4" fill="#c08838"/>';
      function mtn(x, sc) { return P(x, 302, '<path d="M-90 0 L0 -100 L90 0 Z" fill="#a5c2b2"/>', '', 0, sc); }
      return [
        { minDur: 6800, sub: '「遐」是遠，「邇」是近——名聲傳得又遠又近，人人都聽過，就叫「名聞遐邇」。',
          html: scene(P(300, 302, A('kid', 'happy') + P(30, -56, MEGA, '', 0, .9)) + notes(400, 160) +
            mtn(650, .9) + hearts(220, 185)) },
        { minDur: 6800, sub: '一位小鎮師傅的手藝出了名，連山那頭、海對岸的人都專程趕來拜訪！',
          html: scene(P(300, 302, A('kid', 'happy')) + hearts(360, 180) +
            P(520, 302, A('kid', 'happy'), 'st-inR', 0, .9) + P(650, 302, A('kid', 'happy'), 'st-inR', .3, .85) +
            mtn(120, .7)) },
        { minDur: 6600, sub: '從《魏書》的時代起，人們就用「名聞遐邇」稱讚名聲遠播的人與事。',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>')) +
            notes(420, 170) + hearts(500, 195)) },
        { minDur: 6400, sub: '名聞遐邇：名聲遠近皆知。',
          html: scene(P(330, 302, A('kid', 'happy') + P(30, -56, MEGA, '', 0, 1)) + notes(450, 160) + mtn(680, .8) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">名聞遐邇</text>') }
      ];
    },
    /* 耳目一新 */
    i754: function () {
      var SPARK = '<g class="st-tw"><path d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z" fill="#ffd97a"/></g>';
      return [
        { minDur: 6800, sub: '走進重新布置的教室：新窗簾、新壁報、新書櫃——眼睛看到的，全都亮了起來！',
          html: scene(P(430, 300, '<rect x="-90" y="-140" width="180" height="140" rx="6" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>' +
              '<rect x="-70" y="-120" width="52" height="36" rx="4" fill="#aee3f5" stroke="#8fd0e8" stroke-width="2.6"/>' +
              '<rect x="16" y="-120" width="56" height="42" rx="4" fill="#a5d47c" stroke="#7cab6e" stroke-width="2.6"/>' +
              '<rect x="-64" y="-60" width="120" height="20" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"/>') +
            P(430, 150, SPARK) + P(340, 180, SPARK) +
            P(200, 302, A('kid', 'wow')) + hearts(270, 190)) },
        { minDur: 6600, sub: '耳朵聽到的也不一樣了：新歌、新故事、新想法——處處是新鮮感！',
          html: scene(P(300, 302, A('kid', 'happy')) + notes(380, 160) + P(480, 190, SPARK) +
            P(560, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(640, 195)) },
        { minDur: 6600, sub: '所見所聞煥然一新，讓人精神一振——這就是「耳目一新」。',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(430, 160, SPARK) + P(300, 190, SPARK) + P(540, 200, SPARK) + hearts(470, 220)) },
        { minDur: 6400, sub: '耳目一新：所見所聞都有新鮮感。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) + P(330, 180, SPARK) + P(480, 160, SPARK) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">耳目一新</text>') }
      ];
    },
    /* 開宗明義 */
    i999: function () {
      var BOOKOPEN = '<path d="M-52 0 Q-26 -12 0 0 Q26 -12 52 0 L52 -56 Q26 -68 0 -56 Q-26 -68 -52 -56 Z" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<line x1="0" y1="0" x2="0" y2="-56" stroke="#c9bfa8" stroke-width="2"/>' +
        '<g stroke="#8fa3bf" stroke-width="1.8"><line x1="-42" y1="-44" x2="-10" y2="-48"/><line x1="-42" y1="-34" x2="-10" y2="-38"/><line x1="10" y1="-48" x2="42" y2="-44"/><line x1="10" y1="-38" x2="42" y2="-34"/></g>' +
        '<rect x="-42" y="-58" width="32" height="9" rx="2" fill="#ffd97a"/>';
      return [
        { minDur: 7000, sub: '《孝經》的第一章，章名就叫「開宗明義」——一開卷，就把全書的宗旨、孝道的大義說得明明白白。',
          html: scene(P(400, 290, BOOKOPEN, '', 0, 1.4) +
            P(180, 302, A('kid', 'happy'), '', 0, .95) + hearts(260, 195)) },
        { minDur: 6800, sub: '說話、寫文章也一樣：第一段就亮出主旨，聽的人、讀的人立刻抓得住重點！',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(470, 260, '<rect x="-16" y="-22" width="32" height="44" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/><rect x="-10" y="-16" width="20" height="7" rx="2" fill="#ffd97a"/><path d="M-10 -2 h20 M-10 6 h20 M-10 14 h14" stroke="#8fa3bf" stroke-width="1.8"/>') +
            bang(560, 200) + hearts(380, 180)) },
        { minDur: 6600, sub: '反過來，開頭繞來繞去不進主題，大家聽得一頭霧水——所以要「開宗明義」！',
          html: scene(P(300, 302, A('kid', 'happy')) + notes(370, 170) +
            P(560, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(610, 185) + sweat(520, 200)) },
        { minDur: 6400, sub: '開宗明義：一開頭就闡明主旨要義。',
          html: scene(P(400, 292, BOOKOPEN, '', 0, 1.5) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">開宗明義</text>') }
      ];
    },
    /* 一心一意 */
    i001: function () {
      var HOOP = '<line x1="0" y1="0" x2="0" y2="-110" stroke="#8b93a3" stroke-width="6"/>' +
        '<rect x="-26" y="-152" width="52" height="42" rx="4" fill="#fff" stroke="#8b93a3" stroke-width="3"/>' +
        '<ellipse cx="0" cy="-112" rx="18" ry="5" fill="none" stroke="#e0a458" stroke-width="4"/>' +
        '<path d="M-16 -110 q4 20 16 22 q12 -2 16 -22" stroke="#c9bfa8" stroke-width="2" fill="none"/>';
      var BALL = '<circle cx="0" cy="0" r="12" fill="#e0a458" stroke="#c08838" stroke-width="2.4"/><path d="M-12 0 h24 M0 -12 v24" stroke="#c08838" stroke-width="1.8"/>';
      return [
        { minDur: 6600, sub: '小明練投籃，心裡只有一個念頭：把球投進籃框！',
          html: scene(P(600, 302, HOOP) + P(560, 180, BALL, '', 0, .9) +
            P(300, 302, A('kid', 'happy'))) },
        { minDur: 6800, sub: '同學找他去玩、去吃冰，他搖搖頭：「我要先練完一百球！」繼續一球一球投。',
          html: scene(P(600, 302, HOOP) + P(430, 240, BALL) +
            P(300, 302, A('kid', 'happy')) + sweat(260, 195) +
            P(130, 302, A('kid', 'happy'), '', 0, .85) + qmark(170, 195)) },
        { minDur: 6600, sub: '一心一意練了一個月，他投得又準又穩，還入選了校隊！',
          html: scene(P(600, 302, HOOP) + P(590, 145, BALL, '', 0, .9) + bang(600, 100) +
            P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(400, 175)) },
        { minDur: 6400, sub: '一心一意：心思專注不變，完全投入。',
          html: scene(P(600, 302, HOOP, '', 0, .95) + P(320, 302, A('kid', 'happy') + P(40, -70, BALL, '', 0, .9)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一心一意</text>') }
      ];
    },
    /* 三心二意 */
    i004: function () {
      var DESK = '<rect x="-60" y="-30" width="120" height="10" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>' +
        '<line x1="-48" y1="-20" x2="-48" y2="0" stroke="#a8734a" stroke-width="5"/><line x1="48" y1="-20" x2="48" y2="0" stroke="#a8734a" stroke-width="5"/>';
      function thought(x, y, inner, dly) {
        return P(x, y, '<circle cx="0" cy="0" r="26" fill="#fff" opacity=".92"/>' + inner, 'st-zfloat', dly);
      }
      var COMIC = '<rect x="-12" y="-15" width="24" height="30" rx="3" fill="#a5c8ff" stroke="#5c82ba" stroke-width="2"/><text x="0" y="6" text-anchor="middle" font-size="13" fill="#2c4a75">漫</text>';
      var TOY = '<circle cx="0" cy="2" r="10" fill="#ff9eb5"/><circle cx="-8" cy="-8" r="6" fill="#ffd97a"/><circle cx="8" cy="-8" r="6" fill="#a5d47c"/>';
      var SNACK = '<path d="M-10 8 L0 -12 L10 8 Z" fill="#ffe9a0" stroke="#e8b84a" stroke-width="2"/><circle cx="0" cy="-14" r="4" fill="#e8899a"/>';
      return [
        { minDur: 6800, sub: '寫功課的時候，小華一下想看漫畫、一下想玩玩具、一下又想吃點心——',
          html: scene(P(400, 302, DESK) + P(400, 302, A('kid', 'happy'), '', 0, .95) +
            thought(200, 150, COMIC, 0) + thought(400, 110, TOY, .4) + thought(600, 150, SNACK, .8)) },
        { minDur: 6800, sub: '摸摸這個、碰碰那個，一個小時過去了，作業竟然一個字也沒寫！',
          html: scene(P(400, 302, DESK) + P(400, 302, A('kid', 'wow'), '', 0, .95) +
            P(340, 260, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/>') +
            sweat(460, 200) + qmark(300, 180)) },
        { minDur: 6800, sub: '三心二意，什麼事都做不好；下定決心專心寫，反而一下子就寫完了！',
          html: scene(P(400, 302, DESK) + P(400, 302, A('kid', 'happy'), '', 0, .95) +
            P(340, 260, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16 M-8 6 h16" stroke="#8fa3bf" stroke-width="1.8"/>') +
            hearts(480, 185)) },
        { minDur: 6400, sub: '三心二意：心思不定，搖擺不決。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) +
            thought(240, 160, COMIC, 0) + thought(560, 160, SNACK, .5) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">三心二意</text>') }
      ];
    },
    /* 火冒三丈 */
    i007: function () {
      var MODEL = '<rect x="-16" y="-20" width="32" height="20" rx="3" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2.4"/>' +
        '<rect x="-10" y="-34" width="20" height="14" rx="3" fill="#a5c8ff" stroke="#6d87ab" stroke-width="2"/><circle cx="0" cy="-40" r="4" fill="#e85a4f"/>';
      var MODELBROKEN = '<rect x="-20" y="-10" width="18" height="12" rx="3" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2" transform="rotate(-18)"/>' +
        '<rect x="6" y="-14" width="16" height="10" rx="3" fill="#a5c8ff" stroke="#6d87ab" stroke-width="2" transform="rotate(22)"/>' +
        '<circle cx="-2" cy="-2" r="4" fill="#e85a4f"/>';
      var HEADFIRE = '<g class="st-flick"><path d="M0 -8 q-10 -14 0 -26 q2 8 8 10 q6 -6 4 -12 q9 10 2 22 q-6 8 -14 6 z" fill="#ff9c40"/><path d="M1 -9 q-5 -8 0 -15 q5 6 6 9 q2 6 -6 6 z" fill="#ffd166"/></g>';
      return [
        { minDur: 6600, sub: '弟弟跑過來一個不小心，把哥哥剛拼好的模型撞倒了，摔得四分五裂！',
          html: scene(P(430, 316, MODELBROKEN, '', 0, 1.2) + bang(430, 250) +
            P(600, 302, A('kid', 'wow'), '', 0, .85) + sweat(640, 210) +
            P(240, 302, A('kid', 'wow'))) },
        { minDur: 6600, sub: '哥哥氣得火冒三丈——頭頂像冒出三丈高的火焰，臉都漲紅了！',
          html: scene(P(240, 302, A('kid', 'angry') + P(0, -104, HEADFIRE, '', 0, 1.2)) +
            P(560, 302, A('kid', 'sad'), '', 0, .85) + sweat(600, 205)) },
        { minDur: 6800, sub: '深呼吸、慢慢數到十……火氣消了。弟弟誠心道歉，兩人一起把模型重新拼好。',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(470, 302, A('kid', 'happy'), '', 0, .85) +
            P(400, 316, MODEL, '', 0, 1.1) + hearts(380, 190)) },
        { minDur: 6400, sub: '火冒三丈：非常生氣，怒火中燒。',
          html: scene(P(360, 302, A('kid', 'angry') + P(0, -104, HEADFIRE, '', 0, 1.3)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">火冒三丈</text>') }
      ];
    },
    /* 虎頭蛇尾 */
    i015: function () {
      var CAL2 = '<rect x="-26" y="-30" width="52" height="60" rx="5" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<rect x="-26" y="-30" width="52" height="14" rx="5" fill="#c96a5a"/>' +
        '<g stroke="#548a40" stroke-width="2.4"><path d="M-18 -8 l4 4 l7 -7 M-18 6 l4 4 l7 -7"/></g>' +
        '<g stroke="#c9bfa8" stroke-width="2"><line x1="4" y1="-6" x2="16" y2="-6"/><line x1="4" y1="8" x2="16" y2="8"/></g>';
      return [
        { minDur: 6600, sub: '開學時小強立下志願：每天早起跑步！第一週天天五點起床，跑得虎虎生風！',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-strut', 0, 1.05) + bang(200, 210) + hearts(400, 180)) },
        { minDur: 6800, sub: '第二週開始賴床，第三週只跑了兩天，到最後……乾脆不跑了。',
          html: scene(P(360, 302, '<ellipse cx="0" cy="-8" rx="34" ry="12" fill="#6fbf8e"/><circle cx="-28" cy="-16" r="13" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>') +
            zzz(300, 230) + P(540, 272, CAL2) + sweat(600, 220)) },
        { minDur: 6800, sub: '開頭像老虎一樣威猛，結尾卻像蛇尾巴一樣細小無力——這就是「虎頭蛇尾」！',
          html: scene(P(260, 300, A('tiger')) + P(560, 300, A('snake'), '', 0, .9) +
            '<path d="M330 260 q70 -30 150 0" stroke="#c9bfa8" stroke-width="4" fill="none" stroke-dasharray="8 8"/>' + qmark(430, 200)) },
        { minDur: 6400, sub: '虎頭蛇尾：開始猛烈，後來無力，不能堅持到底。',
          html: scene(P(280, 300, A('tiger')) + P(560, 300, A('snake'), '', 0, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">虎頭蛇尾</text>') }
      ];
    },
    /* 目不轉睛 */
    i016: function () {
      var FLASK = '<path d="M-6 -34 L-6 -16 L-20 6 Q-24 16 -12 16 L12 16 Q24 16 20 6 L6 -16 L6 -34 Z" fill="#e8f0f8" stroke="#9fb4c7" stroke-width="2.6"/>' +
        '<path d="M-14 4 Q0 -2 14 4 L12 10 Q0 14 -12 10 Z" fill="#c9a8e0"/>' +
        '<rect x="-9" y="-38" width="18" height="6" rx="3" fill="#9fb4c7"/>';
      var BIGEYE2 = '<path d="M-24 0 Q0 -20 24 0 Q0 20 -24 0 Z" fill="#fff" stroke="#4a3200" stroke-width="2.6"/><circle cx="0" cy="0" r="8" fill="#6b4a32"/><circle cx="3" cy="-3" r="2.6" fill="#fff"/>';
      return [
        { minDur: 6600, sub: '科學課上，老師做了一個神奇的實驗——瓶子裡的液體，「啵」地一聲突然變色！',
          html: scene(P(430, 290, FLASK, '', 0, 1.3) + bang(500, 210) +
            P(220, 302, A('kid', 'happy'))) },
        { minDur: 6600, sub: '全班同學看得目不轉睛，眼睛一眨也不眨，深怕錯過任何一秒！',
          html: scene(P(430, 290, FLASK, '', 0, 1.1) +
            P(220, 302, A('kid', 'wow'), '', 0, .9) + P(600, 302, A('kid', 'wow'), '', .2, .9, true) +
            P(300, 180, BIGEYE2, '', 0, .9) + P(540, 175, BIGEYE2, '', .3, .9)) },
        { minDur: 6600, sub: '下課鈴響了，大家還捨不得走，圍著講桌問個不停：「為什麼會變色呀？」',
          html: scene(P(430, 290, FLASK, '', 0, 1) +
            P(260, 302, A('kid', 'happy'), '', 0, .9) + P(560, 302, A('kid', 'happy'), '', .2, .9, true) +
            qmark(340, 190) + qmark(500, 185) + hearts(430, 150)) },
        { minDur: 6400, sub: '目不轉睛：眼睛緊盯著，不移開視線。',
          html: scene(P(400, 210, BIGEYE2, '', 0, 1.6) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">目不轉睛</text>') }
      ];
    },
    /* 兩手空空 */
    i003: function () {
      var SANDWICH = '<path d="M-14 4 L0 -10 L14 4 Z" fill="#ffe9a0" stroke="#e8b84a" stroke-width="2"/><line x1="-10" y1="1" x2="10" y2="1" stroke="#a5d47c" stroke-width="3"/>';
      var APPLE = '<circle cx="0" cy="0" r="9" fill="#e85a4f"/><path d="M0 -8 q2 -6 6 -7" stroke="#548a40" stroke-width="2.4" fill="none"/>';
      var BOTTLE = '<rect x="-6" y="-18" width="12" height="24" rx="4" fill="#a5c8ff" stroke="#5c82ba" stroke-width="2"/><rect x="-4" y="-24" width="8" height="6" rx="2" fill="#5c82ba"/>';
      var OPENHANDS = '<circle cx="-26" cy="-24" r="8.5" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/><circle cx="26" cy="-24" r="8.5" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>';
      var MAT = '<ellipse cx="0" cy="0" rx="120" ry="26" fill="#f2c9c0" stroke="#d9a890" stroke-width="2.6"/>';
      return [
        { minDur: 6800, sub: '野餐的日子到了！大家都帶了好吃的：三明治、蘋果、果汁——只有小輝什麼也沒帶，兩手空空！',
          html: scene(P(430, 316, MAT) + P(370, 300, SANDWICH) + P(440, 298, APPLE) + P(500, 300, BOTTLE) +
            P(180, 302, A('kid', 'happy'), '', 0, .9) + P(650, 302, A('kid', 'sad') + OPENHANDS) + sweat(690, 205)) },
        { minDur: 6600, sub: '他不好意思地攤開兩隻手：「我出門太急，東西全忘在家裡了……」',
          html: scene(P(400, 302, A('kid', 'sad') + OPENHANDS, '', 0, 1.05) + sweat(350, 195) + qmark(470, 180)) },
        { minDur: 6600, sub: '大家笑著分他一起吃。下次出門前記得檢查背包，別再兩手空空啦！',
          html: scene(P(430, 316, MAT) + P(400, 300, SANDWICH) +
            P(250, 302, A('kid', 'happy'), '', 0, .9) + P(600, 302, A('kid', 'happy'), '', .2, .9, true) + hearts(430, 200)) },
        { minDur: 6400, sub: '兩手空空：什麼都沒有，一無所有。',
          html: scene(P(400, 302, A('kid', 'sad') + OPENHANDS, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">兩手空空</text>') }
      ];
    },
    /* 十全十美 */
    i005: function () {
      var CARD = '<rect x="-20" y="-26" width="40" height="52" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<path d="M-6 -10 q-8 -10 0 -12 q5 -1 6 6 q1 -7 6 -6 q8 2 0 12 l-6 7 z" fill="#ff9eb5"/>' +
        '<path d="M-12 8 h24 M-12 16 h16" stroke="#8fa3bf" stroke-width="2"/>';
      var ERASER = '<rect x="-10" y="-7" width="20" height="14" rx="3" fill="#a5c8ff" stroke="#5c82ba" stroke-width="2" transform="rotate(-12)"/>';
      return [
        { minDur: 6800, sub: '美勞課上，小婷想做一張「完美」的母親節卡片：畫了又擦、擦了又畫，總覺得差那麼一點點。',
          html: scene(P(400, 302, A('kid', 'sad') + P(-44, -50, CARD, '', 0, .9) + P(30, -40, ERASER)) +
            sweat(350, 195) + qmark(470, 180)) },
        { minDur: 6800, sub: '老師輕輕說：「世界上很難有十全十美的作品——用心完成的，就是最棒的！」',
          html: scene(P(560, 302, A('kid', 'happy'), '', 0, 1.05, true) +
            P(300, 302, A('kid', 'wow')) + hearts(430, 180)) },
        { minDur: 6800, sub: '她安下心完成卡片——雖然愛心畫得有點歪，媽媽卻感動地抱著她說：「這是最美的禮物！」',
          html: scene(P(300, 302, A('kid', 'happy') + P(-44, -50, CARD, '', 0, .95)) +
            P(460, 302, A('kid', 'happy'), '', 0, 1.1, true) + hearts(390, 170) + hearts(520, 190)) },
        { minDur: 6400, sub: '十全十美：完美無缺，沒有任何缺點。',
          html: scene(P(400, 280, CARD, '', 0, 1.5) + hearts(500, 210) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">十全十美</text>') }
      ];
    },
    /* 大同小異 */
    i006: function () {
      function drawing(x, cloudLeft) {
        return P(x, 290, '<rect x="-44" y="-56" width="88" height="70" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
          '<path d="M-30 8 L-4 -26 L22 8 Z" fill="#a5c2b2"/>' +
          '<circle cx="26" cy="-38" r="9" fill="#ffdd66"/>' +
          '<ellipse cx="' + (cloudLeft ? -20 : 8) + '" cy="-42" rx="12" ry="5.6" fill="#c9dff0"/>');
      }
      var MOLE = '<circle cx="-16" cy="-46" r="2.2" fill="#6b4a32"/>';
      return [
        { minDur: 6800, sub: '雙胞胎兄弟長得幾乎一模一樣——仔細看才發現：哥哥臉上有顆小痣，弟弟沒有！',
          html: scene(P(300, 302, A('kid', 'happy') + MOLE) + P(500, 302, A('kid', 'happy')) +
            qmark(400, 180)) },
        { minDur: 6800, sub: '他們畫的圖也大同小異：都是一座山、一個太陽——只有雲的位置，一左一右不一樣。',
          html: scene(drawing(270, true) + drawing(530, false) + qmark(400, 190)) },
        { minDur: 6600, sub: '「大同小異」就是大部分相同，只有細微的小差別。',
          html: scene(P(300, 302, A('kid', 'happy') + MOLE) + P(500, 302, A('kid', 'happy')) + hearts(400, 175)) },
        { minDur: 6400, sub: '大同小異：差不多，只有細微差別。',
          html: scene(drawing(280, true) + drawing(520, false) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">大同小異</text>') }
      ];
    },
    /* 百聞不如一見 */
    i010: function () {
      var SUNRISE = '<ellipse cx="330" cy="180" rx="260" ry="36" fill="#fff" opacity=".9"/><ellipse cx="560" cy="200" rx="220" ry="30" fill="#fff" opacity=".8"/>' +
        '<circle cx="430" cy="150" r="30" fill="#ffdd66" stroke="#f5b73e" stroke-width="3"/>' +
        '<g class="st-rays" style="transform-origin:430px 150px"><g stroke="#ffcf4d" stroke-width="5" stroke-linecap="round"><line x1="430" y1="102" x2="430" y2="114"/><line x1="382" y1="150" x2="394" y2="150"/><line x1="466" y1="150" x2="478" y2="150"/></g></g>';
      return [
        { minDur: 6800, sub: '同學們都說：「山上的日出美極了！」小平聽了一百遍，還是想像不出到底有多美。',
          html: scene(P(260, 302, A('kid', 'happy'), '', 0, .9) + P(400, 302, A('kid', 'happy'), '', .2, .88) + notes(330, 170) +
            P(600, 302, A('kid', 'wow'), '', 0, .95, true) + qmark(650, 185)) },
        { minDur: 6800, sub: '這天他跟著爸爸半夜上山——當太陽從雲海裡跳出來的那一刻，他整個人驚呆了！',
          html: scene(SUNRISE +
            P(240, 302, A('kid', 'wow')) + P(400, 302, A('kid', 'happy'), '', 0, 1.1) + bang(550, 220)) },
        { minDur: 6600, sub: '「原來聽別人講一百次，都不如自己親眼看一次呀！」',
          html: scene(SUNRISE + P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(420, 230)) },
        { minDur: 6400, sub: '百聞不如一見：親眼看到，比聽別人說更確實。',
          html: scene(SUNRISE +
            '<text x="400" y="300" text-anchor="middle" font-size="46" font-weight="bold" fill="#4a3200">百聞不如一見</text>') }
      ];
    },
    /* 五光十色 */
    i012: function () {
      function lamp(x, y, color, dly) {
        return P(x, y, '<circle class="st-tw"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + ' cx="0" cy="0" r="7" fill="' + color + '"/>');
      }
      var STALL2 = '<rect x="-60" y="-30" width="120" height="30" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<path d="M-66 -30 h132 l-10 -18 h-112 z" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.4"/>' +
        '<circle cx="-30" cy="-38" r="7" fill="#ffd97a"/><circle cx="0" cy="-40" r="7" fill="#a5d47c"/><circle cx="30" cy="-38" r="7" fill="#a5c8ff"/>';
      function balloon(x, y, color, dly) {
        return P(x, y, '<ellipse cx="0" cy="-14" rx="10" ry="13" fill="' + color + '"/><line x1="0" y1="-1" x2="0" y2="14" stroke="#8b93a3" stroke-width="1.6"/>', 'st-zfloat', dly);
      }
      return [
        { minDur: 6600, sub: '天一黑，夜市的燈一盞盞亮起來：紅的、黃的、藍的、綠的，閃閃爍爍——',
          html: scene(lamp(200, 120, '#ff8a80', 0) + lamp(280, 100, '#ffd97a', .3) + lamp(360, 130, '#a5c8ff', .6) +
            lamp(440, 105, '#a5d47c', .2) + lamp(520, 125, '#f7a8c4', .5) + lamp(600, 110, '#c9a8e0', .8) +
            P(300, 302, A('kid', 'wow')) + hearts(380, 200), 'night') },
        { minDur: 6800, sub: '攤位上的玩具、糖果、氣球也五顏六色，看得人眼花撩亂、捨不得眨眼！',
          html: scene(P(430, 302, STALL2) +
            balloon(620, 220, '#ff9eb5', 0) + balloon(670, 250, '#a5c8ff', .4) +
            P(220, 302, A('kid', 'wow')) + hearts(300, 200), 'night') },
        { minDur: 6600, sub: '「五光十色」就是形容這樣色彩繽紛、光彩奪目的景象！',
          html: scene(lamp(250, 130, '#ff8a80', 0) + lamp(400, 110, '#ffd97a', .4) + lamp(550, 135, '#a5c8ff', .7) +
            P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(460, 200), 'night') },
        { minDur: 6400, sub: '五光十色：色彩繽紛，光彩奪目。',
          html: scene(lamp(230, 140, '#ff8a80', 0) + lamp(330, 115, '#ffd97a', .3) + lamp(430, 145, '#a5d47c', .5) +
            lamp(530, 120, '#a5c8ff', .2) + lamp(620, 140, '#f7a8c4', .6) +
            '<text x="400" y="270" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">五光十色</text>', 'night') }
      ];
    },
    /* 千里馬 */
    i002: function () {
      return [
        { minDur: 6800, sub: '千里馬一天能跑一千里，是世上最珍貴的良馬——可是牠混在普通馬群裡，誰認得出來呢？',
          html: scene(P(260, 302, A('horse'), '', 0, .9) + P(420, 302, A('horse'), '', .2, .9) +
            P(580, 302, A('horse'), '', .4, .9) + qmark(400, 180)) },
        { minDur: 6800, sub: '幸好有懂馬的伯樂！他一眼認出千里馬，解開韁繩讓牠盡情奔馳——果然快如閃電！',
          html: scene(P(240, 302, A('kid', 'happy')) + hearts(310, 185) +
            P(520, 302, A('horse'), 'st-dashL', 0, 1.1) + bang(660, 220)) },
        { minDur: 6800, sub: '「千里馬」比喻有才能的人——但也要遇上識才的「伯樂」，才能大放光彩呀！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(520, 302, A('horse'), '', 0, 1.05) + hearts(420, 175)) },
        { minDur: 6400, sub: '千里馬：比喻有才能的人。',
          html: scene(P(430, 302, A('horse'), 'st-strut', 0, 1.15) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千里馬</text>') }
      ];
    },
    /* 千變萬化 */
    i011: function () {
      function cloudShape(x, y, inner, dly) {
        return P(x, y, '<g class="st-cloud"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<ellipse cx="0" cy="0" rx="42" ry="17" fill="#fff"/><ellipse cx="-30" cy="7" rx="22" ry="11" fill="#fff"/><ellipse cx="30" cy="7" rx="24" ry="12" fill="#fff"/>' + inner + '</g>');
      }
      var DOGCLOUD = '<ellipse cx="34" cy="-12" rx="12" ry="9" fill="#fff"/><ellipse cx="44" cy="-20" rx="5" ry="8" fill="#fff"/>';
      var DRGCLOUD = '<path d="M-40 -8 q16 -14 36 -6 q16 8 30 -2" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '躺在草地上看天上的雲：一會兒像小狗、一會兒像棉花糖、一會兒又變成一條龍！',
          html: scene(cloudShape(240, 110, DOGCLOUD, 0) + cloudShape(540, 90, DRGCLOUD, .5) +
            P(400, 316, '<g transform="rotate(76)">' + A('kid', 'happy') + '</g>') + hearts(500, 240)) },
        { minDur: 6600, sub: '還沒看清楚，風一吹——雲又變成新的樣子！變化多得根本數不完。',
          html: scene(cloudShape(340, 100, '', 0) + cloudShape(560, 130, DOGCLOUD, .4) +
            '<g stroke="#e8f4fb" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"><path class="st-windln" d="M100 140 q60 -18 120 0"/></g>' +
            P(400, 316, '<g transform="rotate(76)">' + A('kid', 'wow') + '</g>') + qmark(480, 250)) },
        { minDur: 6600, sub: '「千變萬化」就是形容變化極多、讓人猜不透接下來會變成什麼樣子。',
          html: scene(cloudShape(230, 120, DRGCLOUD, 0) + cloudShape(450, 90, '', .3) + cloudShape(640, 130, DOGCLOUD, .6) +
            P(360, 302, A('kid', 'happy'))) },
        { minDur: 6400, sub: '千變萬化：形容變化極多，難以預測。',
          html: scene(cloudShape(260, 130, DOGCLOUD, 0) + cloudShape(540, 110, DRGCLOUD, .4) +
            '<text x="400" y="270" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千變萬化</text>') }
      ];
    },
    /* 龍騰虎躍 */
    i014: function () {
      return [
        { minDur: 6800, sub: '運動會開始了！操場上人人生龍活虎：有的騰空跳遠、有的猛衝短跑，活力十足！',
          html: scene(P(240, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(420, 302, A('kid', 'happy'), 'st-dashL', 0, .95) +
            P(600, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) + bang(520, 190)) },
        { minDur: 6800, sub: '龍在空中騰飛、老虎在地上跳躍——這幅畫面，就是最有活力的樣子！',
          html: scene(P(300, 160, A('dragon'), '', 0, 1.1) + P(540, 302, '<g class="st-hop">' + A('tiger') + '</g>') +
            hearts(420, 200)) },
        { minDur: 6600, sub: '加油聲、歡呼聲此起彼落，整個操場龍騰虎躍、熱鬧非凡！',
          html: scene(P(260, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(430, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            P(590, 302, '<g class="st-cheer" style="animation-delay:.4s">' + A('kid', 'happy') + '</g>', '', 0, .85) +
            notes(350, 165) + hearts(500, 180)) },
        { minDur: 6400, sub: '龍騰虎躍：生龍活虎，充滿活力。',
          html: scene(P(280, 170, A('dragon')) + P(540, 302, '<g class="st-hop">' + A('tiger') + '</g>') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">龍騰虎躍</text>') }
      ];
    },
    /* 聲名狼藉 */
    i017: function () {
      var STALL3 = '<rect x="-60" y="-30" width="120" height="30" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<line x1="-50" y1="0" x2="-50" y2="-30" stroke="#a8734a" stroke-width="4"/><line x1="50" y1="0" x2="50" y2="-30" stroke="#a8734a" stroke-width="4"/>';
      var BROKENGOOD = '<circle cx="0" cy="-4" r="9" fill="#e85a4f"/><path d="M-4 -10 l8 12 M4 -10 l-8 12" stroke="#8a3a30" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '有個商人賣東西總是缺斤少兩、拿壞的充好的，騙過了不少客人。',
          html: scene(P(430, 302, STALL3 + P(-20, -36, BROKENGOOD)) +
            P(280, 302, A('kid', 'happy')) +
            P(620, 302, A('kid', 'angry'), '', 0, .9) + bang(560, 190)) },
        { minDur: 6800, sub: '一傳十、十傳百，大家都知道他不老實——名聲壞得一塌糊塗，店門口再也沒有人上門。',
          html: scene(P(430, 302, STALL3) +
            P(300, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') + sweat(340, 200) + zzz(550, 220)) },
        { minDur: 6800, sub: '「聲名狼藉」：名聲敗壞到了極點。誠信一旦失去，就很難再挽回了呀。',
          html: scene(P(300, 302, A('kid', 'sad')) + sweat(250, 195) + qmark(370, 180) +
            P(560, 302, A('kid', 'angry'), '', 0, .9, true)) },
        { minDur: 6400, sub: '聲名狼藉：名聲很壞，惡名昭著。',
          html: scene(P(360, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, 1.05) + sweat(420, 200) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">聲名狼藉</text>') }
      ];
    },
    /* 奮力直追 */
    i018: function () {
      var BATON = '<rect x="-4" y="-20" width="8" height="26" rx="4" fill="#e0a458" stroke="#c08838" stroke-width="2"/>';
      var TRACK = '<rect y="296" width="800" height="18" fill="#d9a890"/><g stroke="#fff" stroke-width="3" stroke-dasharray="18 14"><line x1="0" y1="305" x2="800" y2="305"/></g>';
      var FINISH = '<line x1="0" y1="0" x2="0" y2="-80" stroke="#8b93a3" stroke-width="4"/><path d="M0 -80 h34 v20 h-34 z" fill="#fff" stroke="#8b93a3" stroke-width="2"/><path d="M0 -80 h8.5 v10 h8.5 v-10 h8.5 v10 h8.5" fill="#3a2e26"/>';
      return [
        { minDur: 6600, sub: '接力賽上，小杰接過棒子時，已經落後前面的人半圈了！',
          html: scene(TRACK + P(600, 296, A('kid', 'happy'), 'st-strut', 0, .9) +
            P(240, 296, A('kid', 'wow') + P(30, -50, BATON)) + sweat(200, 200)) },
        { minDur: 6800, sub: '他咬緊牙關、手臂用力擺動，一步一步奮力直追——距離越來越近！',
          html: scene(TRACK +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="100" y1="240" x2="190" y2="240"/><line class="st-windln" style="animation-delay:.4s" x1="80" y1="270" x2="160" y2="270"/></g>' +
            P(360, 296, A('kid', 'angry') + P(30, -50, BATON), 'st-dashL') +
            P(560, 296, A('kid', 'happy'), 'st-strut', 0, .9) + sweat(400, 200)) },
        { minDur: 6800, sub: '終點線前，他竟然一口氣追過兩位選手，幫隊伍搶回了第三名！',
          html: scene(TRACK + P(650, 296, FINISH) +
            P(560, 296, A('kid', 'happy') + P(30, -50, BATON), 'st-dashL', 0, 1.05) +
            P(380, 296, A('kid', 'wow'), '', 0, .9) + bang(640, 200) +
            P(180, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .85) + hearts(250, 190)) },
        { minDur: 6400, sub: '奮力直追：用力追趕，努力追上。',
          html: scene(TRACK + P(400, 296, A('kid', 'angry') + P(30, -50, BATON), 'st-dashL', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">奮力直追</text>') }
      ];
    },
    /* 一舉兩得 */
    i201: function () {
      var BASKET2 = '<path d="M-16 0 q0 12 16 12 q16 0 16 -12 z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>' +
        '<path d="M-16 0 q16 -16 32 0" fill="none" stroke="#a8734a" stroke-width="3"/>' +
        '<circle cx="-4" cy="-4" r="5" fill="#a5d47c"/><circle cx="8" cy="-6" r="5" fill="#e85a4f"/>';
      var BROOM2 = '<line x1="0" y1="0" x2="20" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M0 0 l-10 12 M0 0 l-2 14 M0 0 l6 13" stroke="#c9a06c" stroke-width="3.4" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '小安幫奶奶跑腿買菜——順便當作運動，一路小跑，跑得滿身大汗！',
          html: scene(P(340, 302, A('kid', 'happy') + P(34, -30, BASKET2), 'st-dashL') + sweat(290, 195)) },
        { minDur: 6800, sub: '菜買回來了，奶奶好開心；身體也越跑越壯——做一件事，同時得到兩個好處！',
          html: scene(P(300, 302, A('kid', 'happy') + P(34, -30, BASKET2)) +
            P(520, 302, A('kid', 'happy'), '', 0, 1.02, true) + hearts(410, 175) + hearts(560, 195)) },
        { minDur: 6600, sub: '掃地也一樣：教室變乾淨了，還被老師稱讚愛勞動——又是一舉兩得！',
          html: scene(P(300, 302, A('kid', 'happy') + P(20, -34, BROOM2, 'st-hoe')) +
            P(560, 302, A('kid', 'happy'), '', 0, 1.05, true) + hearts(440, 180)) },
        { minDur: 6400, sub: '一舉兩得：做一件事，同時獲得兩種好處。',
          html: scene(P(360, 302, A('kid', 'happy') + P(34, -30, BASKET2)) + hearts(260, 190) + hearts(500, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一舉兩得</text>') }
      ];
    },
    /* 自言自語 */
    i202: function () {
      var PUZZLE = '<g stroke-width="2"><rect x="-26" y="-20" width="24" height="20" rx="3" fill="#a5c8ff" stroke="#5c82ba"/><rect x="2" y="-20" width="24" height="20" rx="3" fill="#a5d47c" stroke="#7cab6e"/><rect x="-26" y="4" width="24" height="20" rx="3" fill="#ffd97a" stroke="#e8b84a"/><rect x="2" y="4" width="24" height="20" rx="3" fill="#fff" stroke="#c9bfa8" stroke-dasharray="4 4"/></g>';
      function bub(x, y, txt, sc) {
        return P(x, y, '<path d="M-30 -18 a26 20 0 1 1 52 6 q-2 9 -12 10 l-13 12 l1 -12 q-24 -2 -28 -16 z" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
          '<text x="-3" y="-4" text-anchor="middle" font-size="13" fill="#4a3200">' + txt + '</text>', '', 0, sc || 1);
      }
      return [
        { minDur: 6800, sub: '小美一邊拼拼圖，一邊小聲嘀咕：「這片放這裡……不對不對，應該在那邊才對……」',
          html: scene(P(300, 302, A('kid', 'happy')) + P(440, 290, PUZZLE, '', 0, 1.1) +
            bub(360, 180, '嗯…這裡?', 1)) },
        { minDur: 6600, sub: '弟弟湊過來，好奇地問：「姊姊，妳在跟誰說話呀？」「沒有呀——我在自己跟自己說話！」',
          html: scene(P(300, 302, A('kid', 'happy')) + P(440, 290, PUZZLE, '', 0, 1) +
            P(600, 302, A('kid', 'wow'), '', 0, .8) + qmark(650, 200)) },
        { minDur: 6600, sub: '自己對自己說話，就叫「自言自語」——專心想事情的時候，常常不知不覺就說出聲了。',
          html: scene(P(360, 302, A('kid', 'happy')) + bub(440, 180, '自言自語', 1) + hearts(280, 190)) },
        { minDur: 6400, sub: '自言自語：自己對自己說話。',
          html: scene(P(360, 302, A('kid', 'happy')) + bub(450, 190, '……', 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">自言自語</text>') }
      ];
    },
    /* 不知不覺 */
    i203: function () {
      var COMICBOOK = '<rect x="-18" y="-24" width="36" height="48" rx="3" fill="#a5c8ff" stroke="#5c82ba" stroke-width="2.4"/><text x="0" y="4" text-anchor="middle" font-size="14" fill="#2c4a75">漫</text>';
      var CLOCK = '<circle cx="0" cy="0" r="18" fill="#fff" stroke="#8b93a3" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-11" stroke="#3a2e26" stroke-width="2.6"/><line x1="0" y1="0" x2="8" y2="4" stroke="#3a2e26" stroke-width="2.6"/>';
      return [
        { minDur: 6600, sub: '小凱打開一本好看的漫畫，才翻了幾頁，就完全入迷了。',
          html: scene(P(360, 302, A('kid', 'happy') + P(-42, -54, COMICBOOK, '', 0, .95)) + hearts(280, 185)) },
        { minDur: 6800, sub: '窗外的天色從亮變暗，肚子咕嚕咕嚕叫——他抬頭一看鐘：「什麼？已經晚上七點了！」',
          html: scene(P(360, 302, A('kid', 'wow') + P(-42, -54, COMICBOOK, '', 0, .95)) +
            P(560, 200, CLOCK, '', 0, 1.2) + bang(640, 160) + sweat(300, 195), 'night') },
        { minDur: 6600, sub: '沒有察覺、沒有留意，時間就悄悄溜走了——這就是「不知不覺」。',
          html: scene(P(360, 302, A('kid', 'happy')) + P(540, 220, CLOCK, '', 0, 1) + qmark(440, 180), 'night') },
        { minDur: 6400, sub: '不知不覺：沒有察覺、沒有意識到。',
          html: scene(P(340, 302, A('kid', 'happy') + P(-42, -54, COMICBOOK, '', 0, .95)) + P(540, 230, CLOCK, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">不知不覺</text>') }
      ];
    },
    /* 東張西望 */
    i204: function () {
      var BUILDINGS = '<rect x="60" y="120" width="70" height="182" fill="#8fa8c9" stroke="#6d87ab" stroke-width="3"/>' +
        '<rect x="150" y="80" width="80" height="222" fill="#a3a9b8" stroke="#84858f" stroke-width="3"/>' +
        '<g fill="#ffe9a0"><rect x="72" y="140" width="14" height="14"/><rect x="98" y="140" width="14" height="14"/><rect x="72" y="170" width="14" height="14"/><rect x="165" y="100" width="14" height="14"/><rect x="195" y="100" width="14" height="14"/><rect x="165" y="132" width="14" height="14"/></g>' +
        '<rect x="600" y="140" width="90" height="162" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<rect x="616" y="160" width="58" height="18" rx="4" fill="#e85a4f"/>';
      var POLE = '<line x1="0" y1="0" x2="0" y2="-150" stroke="#8b93a3" stroke-width="8"/><line x1="-18" y1="-140" x2="18" y2="-140" stroke="#8b93a3" stroke-width="5"/>';
      return [
        { minDur: 6800, sub: '第一次到大城市，小庭邊走邊東看看、西瞧瞧：高樓、招牌、車子，什麼都新鮮！',
          html: scene(BUILDINGS + P(400, 302, A('kid', 'wow'), 'st-strut') +
            hearts(320, 190) + qmark(480, 180)) },
        { minDur: 6600, sub: '走著走著，一個不留神——咚！一頭撞上了電線桿！',
          html: scene(BUILDINGS + P(520, 302, POLE) +
            P(460, 306, '<g class="st-faint">' + A('kid', 'wow') + '</g>') + bang(500, 200)) },
        { minDur: 6600, sub: '「東張西望」是四處張望的意思——走路的時候，可要看好前方呀！',
          html: scene(P(400, 302, A('kid', 'sad') + '<circle cx="24" cy="-78" r="7" fill="#ffb3a3"/>') + sweat(350, 195) +
            P(600, 302, A('kid', 'happy'), '', 0, .9, true)) },
        { minDur: 6400, sub: '東張西望：四處張望，心神不定或好奇觀看。',
          html: scene(BUILDINGS + P(400, 302, A('kid', 'wow')) + qmark(330, 190) + qmark(470, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">東張西望</text>') }
      ];
    },
    /* 大吃一驚 */
    i205: function () {
      var SOFA = '<rect x="-60" y="-34" width="120" height="34" rx="10" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>' +
        '<rect x="-66" y="-46" width="22" height="34" rx="8" fill="#a85a1e"/><rect x="44" y="-46" width="22" height="34" rx="8" fill="#a85a1e"/>';
      var CAKE = '<rect x="-20" y="-16" width="40" height="16" rx="4" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2.4"/>' +
        '<path d="M-20 -16 q10 6 20 0 q10 6 20 0" stroke="#fff" stroke-width="3" fill="none"/>' +
        '<line x1="0" y1="-16" x2="0" y2="-26" stroke="#e8b84a" stroke-width="2.6"/><circle cx="0" cy="-29" r="3" fill="#ff9c40"/>';
      return [
        { minDur: 6600, sub: '生日這天放學回家，屋裡黑漆漆、靜悄悄——奇怪，大家都去哪裡了？',
          html: scene(P(430, 302, SOFA) + P(220, 302, A('kid', 'happy'), 'st-inL') + qmark(280, 185), 'night') },
        { minDur: 6800, sub: '燈「啪」地亮起——「生日快樂！」全家人從沙發後面跳出來，小睿嚇了一大跳，眼睛瞪得圓圓的！',
          html: scene(P(430, 302, SOFA) + bang(430, 200) +
            P(380, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .85) +
            P(500, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .82) +
            P(220, 302, A('kid', 'wow')) + sweat(180, 195)) },
        { minDur: 6600, sub: '從驚訝變成哈哈大笑——這真是最棒的生日驚喜！',
          html: scene(P(400, 280, CAKE, '', 0, 1.3) +
            P(240, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(560, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(400, 190)) },
        { minDur: 6400, sub: '大吃一驚：非常吃驚。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.1) + bang(490, 180) + sweat(330, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">大吃一驚</text>') }
      ];
    },
    /* 依依不捨 */
    i206: function () {
      var GATE = '<g stroke="#a8734a" stroke-width="8"><line x1="-70" y1="0" x2="-70" y2="-110"/><line x1="70" y1="0" x2="70" y2="-110"/></g>' +
        '<rect x="-80" y="-130" width="160" height="24" rx="6" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>' +
        '<text x="0" y="-112" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">快樂國小</text>';
      return [
        { minDur: 6800, sub: '好朋友要搬家轉學了。放學後，大家聚在校門口為她送行。',
          html: scene(P(430, 302, GATE) +
            P(280, 302, A('kid', 'sad'), '', 0, .95) + P(400, 302, A('kid', 'sad'), '', .2, .9) +
            P(560, 302, A('kid', 'sad'), '', 0, 1) + sweat(600, 200)) },
        { minDur: 6800, sub: '說了再見又回頭、走了幾步又揮手——誰都捨不得放開手。',
          html: scene(P(600, 302, A('kid', 'sad'), 'st-inR') +
            P(300, 302, A('kid', 'sad')) + P(420, 302, A('kid', 'sad'), '', .2, .92) +
            hearts(500, 190) + sweat(350, 200)) },
        { minDur: 6600, sub: '「依依不捨」就是非常留戀、捨不得分離——大家約好：放假一定再見面！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(520, 302, A('kid', 'happy'), '', 0, .95, true) +
            hearts(410, 170)) },
        { minDur: 6400, sub: '依依不捨：非常留戀，捨不得分離。',
          html: scene(P(300, 302, A('kid', 'sad')) + P(540, 302, A('kid', 'sad'), '', 0, .95, true) + hearts(420, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">依依不捨</text>') }
      ];
    },
    /* 興高采烈 */
    i207: function () {
      return [
        { minDur: 6600, sub: '明天要去動物園遠足！小朋友們又蹦又跳，開心得不得了。',
          html: scene(P(260, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(420, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .92) +
            P(580, 302, '<g class="st-cheer" style="animation-delay:.4s">' + A('kid', 'happy') + '</g>', '', 0, .88) +
            hearts(340, 170) + hearts(520, 165)) },
        { minDur: 6600, sub: '一路上唱歌、拍手，興致高昂——連太陽公公都好像跟著笑了！',
          html: scene(P(280, 302, A('kid', 'happy'), 'st-strut') + P(430, 302, A('kid', 'happy'), 'st-strut', .2, .92) +
            notes(360, 160) + notes(500, 150)) },
        { minDur: 6600, sub: '看到小猴子盪鞦韆、翻跟斗，大家興高采烈地歡呼拍手！',
          html: scene(P(560, 300, A('monkey'), '', 0, 1.05) +
            P(260, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(400, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            hearts(480, 180) + notes(330, 165)) },
        { minDur: 6400, sub: '興高采烈：興致高昂，情緒熱烈。',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(460, 180) + notes(280, 170) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">興高采烈</text>') }
      ];
    },
    /* 手忙腳亂 */
    i208: function () {
      var SOCK = '<path d="M-6 -14 L-6 2 Q-6 10 2 10 L10 10 Q16 10 14 2 L10 -2 L4 -2 L4 -14 Z" fill="#ff9eb5" stroke="#e07ba3" stroke-width="2"/>';
      var BAG = '<rect x="-16" y="-22" width="32" height="26" rx="6" fill="#5c82ba" stroke="#46689a" stroke-width="2.4"/><path d="M-10 -22 q10 -10 20 0" stroke="#46689a" stroke-width="3" fill="none"/>';
      var TOOTHBRUSH = '<line x1="0" y1="0" x2="18" y2="-18" stroke="#a5c8ff" stroke-width="4" stroke-linecap="round"/><rect x="14" y="-26" width="10" height="9" rx="2" fill="#fff" stroke="#8fa3bf" stroke-width="1.6" transform="rotate(45 19 -21)"/>';
      var CLOCK = '<circle cx="0" cy="0" r="18" fill="#fff" stroke="#8b93a3" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-11" stroke="#e85a4f" stroke-width="2.6"/><line x1="0" y1="0" x2="8" y2="-4" stroke="#e85a4f" stroke-width="2.6"/>';
      return [
        { minDur: 6800, sub: '糟糕，睡過頭了！小奇一邊刷牙、一邊找襪子、一邊抓書包，整個人團團轉——',
          html: scene(P(360, 302, A('kid', 'wow') + P(24, -44, TOOTHBRUSH)) +
            P(220, 290, SOCK, 'st-zfloat') + P(520, 280, BAG, 'st-zfloat', .3) +
            P(620, 190, CLOCK, '', 0, 1.1) + sweat(300, 190) + sweat(430, 195)) },
        { minDur: 6800, sub: '結果牙膏擠到衣服上、襪子一長一短，最重要的課本竟然忘了帶！',
          html: scene(P(360, 302, A('kid', 'wow') +
              '<path d="M-8 -26 q6 4 12 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/>') +
            bang(450, 190) + sweat(300, 195) + qmark(520, 185)) },
        { minDur: 6800, sub: '手忙腳亂，只會越忙越亂——前一晚先把東西準備好，早上就從容多啦！',
          html: scene(P(340, 302, A('kid', 'happy') + P(-44, -46, BAG, '', 0, .95)) +
            P(560, 190, CLOCK, '', 0, 1) + hearts(440, 185)) },
        { minDur: 6400, sub: '手忙腳亂：做事慌張忙亂，沒有條理。',
          html: scene(P(380, 302, A('kid', 'wow'), '', 0, 1.05) + P(250, 280, SOCK, 'st-zfloat') + P(540, 275, BAG, 'st-zfloat', .3) + sweat(320, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">手忙腳亂</text>') }
      ];
    },
    /* 五顏六色 */
    i209: function () {
      function flower(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="-16" stroke="#5f8a46" stroke-width="3"/>' +
          '<circle cx="0" cy="-22" r="5" fill="' + color + '"/><circle cx="-6" cy="-18" r="5" fill="' + color + '"/><circle cx="6" cy="-18" r="5" fill="' + color + '"/><circle cx="0" cy="-14" r="5" fill="' + color + '"/><circle cx="0" cy="-18" r="3.4" fill="#ffe066"/></g>');
      }
      var RAINBOW = '<g fill="none" stroke-width="7"><path d="M180 220 A220 220 0 0 1 620 220" stroke="#e85a4f"/><path d="M192 220 A208 208 0 0 1 608 220" stroke="#ffb14d"/><path d="M204 220 A196 196 0 0 1 596 220" stroke="#ffe066"/><path d="M216 220 A184 184 0 0 1 584 220" stroke="#a5d47c"/><path d="M228 220 A172 172 0 0 1 572 220" stroke="#a5c8ff"/><path d="M240 220 A160 160 0 0 1 560 220" stroke="#c9a8e0"/></g>';
      return [
        { minDur: 6600, sub: '雨過天晴，花園裡的花全開了：紅的、黃的、紫的、粉的，一朵比一朵鮮豔——',
          html: scene(flower(200, 318, '#ff8a80', 0) + flower(290, 322, '#ffd97a', .3) + flower(380, 318, '#c9a8e0', .5) +
            flower(470, 322, '#ff9eb5', .2) + flower(560, 318, '#a5c8ff', .6) +
            P(660, 302, A('kid', 'wow'), '', 0, .95) + hearts(600, 200)) },
        { minDur: 6600, sub: '天邊還掛起一道彩虹，七種顏色排排站，美得像一幅畫！',
          html: scene(RAINBOW + P(300, 302, A('kid', 'happy')) + hearts(430, 250)) },
        { minDur: 6600, sub: '「五顏六色」就是形容這樣色彩繁多、繽紛美麗的景象！',
          html: scene(flower(230, 320, '#ff8a80', 0) + flower(330, 318, '#a5d47c', .3) + flower(430, 322, '#ffd97a', .5) +
            P(560, 302, A('kid', 'happy')) + P(660, 200, A('butterfly'), '', 0, .95) + hearts(600, 240)) },
        { minDur: 6400, sub: '五顏六色：色彩繁多、繽紛美麗。',
          html: scene(RAINBOW + flower(260, 320, '#ff9eb5', 0) + flower(540, 320, '#a5c8ff', .4) +
            '<text x="400" y="290" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">五顏六色</text>') }
      ];
    },
    /* 四面八方 */
    i210: function () {
      var DRUM = '<ellipse cx="0" cy="-30" rx="22" ry="8" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<path d="M-22 -30 L-22 -6 Q0 4 22 -6 L22 -30" fill="#c96a5a" stroke="#a84a3f" stroke-width="2.4"/>' +
        '<line x1="-10" y1="-44" x2="-2" y2="-34" stroke="#a8734a" stroke-width="3.4" stroke-linecap="round"/><line x1="12" y1="-46" x2="4" y2="-34" stroke="#a8734a" stroke-width="3.4" stroke-linecap="round"/>';
      var ARROWS8 = '<g stroke="#4a3200" stroke-width="4" stroke-linecap="round">' +
        '<line x1="0" y1="-28" x2="0" y2="-52"/><line x1="0" y1="28" x2="0" y2="52"/><line x1="-28" y1="0" x2="-52" y2="0"/><line x1="28" y1="0" x2="52" y2="0"/>' +
        '<line x1="-20" y1="-20" x2="-38" y2="-38"/><line x1="20" y1="-20" x2="38" y2="-38"/><line x1="-20" y1="20" x2="-38" y2="38"/><line x1="20" y1="20" x2="38" y2="38"/></g>' +
        '<path d="M0 -60 l-6 10 h12 z M0 60 l-6 -10 h12 z M-60 0 l10 -6 v12 z M60 0 l-10 -6 v12 z" fill="#4a3200"/>' +
        '<circle cx="0" cy="0" r="12" fill="#e0a458" stroke="#c08838" stroke-width="3"/>';
      return [
        { minDur: 6800, sub: '廟會開始了！鑼鼓「咚咚鏘」一響，人們從東邊、西邊、南邊、北邊全湧了過來——',
          html: scene(P(400, 302, DRUM, '', 0, 1.2) + notes(400, 180) +
            P(150, 302, A('kid', 'happy'), 'st-inL', 0, .9) + P(650, 302, A('kid', 'happy'), 'st-inR', .2, .9, true) +
            P(280, 302, A('kid', 'happy'), 'st-inL', .4, .85)) },
        { minDur: 6600, sub: '廣場上很快擠滿了人，四面八方都是笑臉、都是歡呼聲！',
          html: scene(P(400, 302, DRUM, '', 0, 1) +
            P(220, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            P(320, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .85) +
            P(500, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .88) +
            P(610, 302, '<g class="st-cheer" style="animation-delay:.5s">' + A('kid', 'happy') + '</g>', '', 0, .82) +
            hearts(400, 165) + notes(540, 175)) },
        { minDur: 6600, sub: '東、西、南、北，加上四個斜角——「四面八方」就是每一個方向、每一個地方！',
          html: scene(P(400, 200, ARROWS8, '', 0, 1.1) +
            P(200, 302, A('kid', 'happy'), '', 0, .9)) },
        { minDur: 6400, sub: '四面八方：各個方向、各個地方。',
          html: scene(P(400, 210, ARROWS8, '', 0, 1.2) +
            '<text x="400" y="315" text-anchor="middle" font-size="50" font-weight="bold" fill="#4a3200">四面八方</text>') }
      ];
    },
    /* 手舞足蹈 */
    i401: function () {
      var BIKE = '<circle cx="-24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/><circle cx="24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/>' +
        '<path d="M-24 0 L-8 -22 L14 -22 L24 0 M-8 -22 L-2 0 M14 -22 L10 -30 M-8 -22 L-14 -30 L-4 -30" stroke="#e85a4f" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
      var GIFT2 = '<rect x="-16" y="-26" width="32" height="26" rx="4" fill="#a5d47c" stroke="#7cab6e" stroke-width="2.4"/>' +
        '<line x1="0" y1="-26" x2="0" y2="0" stroke="#fff" stroke-width="3.4"/><line x1="-16" y1="-13" x2="16" y2="-13" stroke="#fff" stroke-width="3.4"/>';
      return [
        { minDur: 6600, sub: '小樂拆開生日禮物——竟然是夢寐以求的新腳踏車！',
          html: scene(P(500, 300, BIKE, '', 0, 1.2) + P(340, 292, GIFT2, '', 0, .9) +
            P(240, 302, A('kid', 'wow')) + bang(420, 210)) },
        { minDur: 6600, sub: '他高興得手也揮、腳也跳，整個人快要飛起來了！',
          html: scene(P(500, 300, BIKE, '', 0, 1.1) +
            P(280, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.1) +
            hearts(370, 165) + notes(220, 175)) },
        { minDur: 6600, sub: '高興到手腳都像在跳舞——這就是「手舞足蹈」！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(480, 302, '<g class="st-hop">' + A('kid', 'happy') + '</g>', '', 0, .92) +
            notes(390, 160) + hearts(550, 180)) },
        { minDur: 6400, sub: '手舞足蹈：高興得手腳都舞動起來。',
          html: scene(P(380, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.1) + notes(470, 170) + hearts(290, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">手舞足蹈</text>') }
      ];
    },
    /* 東奔西跑 */
    i402: function () {
      var FLAG2 = '<line x1="0" y1="0" x2="0" y2="-46" stroke="#a8734a" stroke-width="3.4"/><path d="M0 -46 h26 l-7 7 l7 7 h-26 z" fill="#5c82ba"/>';
      var TABLE2 = '<rect x="-30" y="-16" width="60" height="8" rx="3" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"/><line x1="-24" y1="-8" x2="-24" y2="4" stroke="#a8734a" stroke-width="4"/><line x1="24" y1="-8" x2="24" y2="4" stroke="#a8734a" stroke-width="4"/>';
      return [
        { minDur: 6800, sub: '運動會前一天，班長為了準備道具東奔西跑：跑操場、跑器材室、又跑辦公室——',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-dashL') + sweat(250, 195) +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="120" y1="250" x2="200" y2="250"/></g>') },
        { minDur: 6800, sub: '一下借旗子、一下搬桌子、一下又去領號碼布，忙得團團轉，卻一點也不喊累！',
          html: scene(P(280, 302, A('kid', 'happy') + P(30, -50, FLAG2)) +
            P(480, 300, TABLE2, '', 0, 1) + sweat(340, 195) + bang(560, 220)) },
        { minDur: 6600, sub: '為了大家的事到處奔走，就是「東奔西跑」——記得跟辛苦的人說聲謝謝呀！',
          html: scene(P(300, 302, A('kid', 'happy'))+
            P(500, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .92) +
            P(620, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .88) + hearts(420, 175)) },
        { minDur: 6400, sub: '東奔西跑：到處奔走忙碌。',
          html: scene(P(360, 302, A('kid', 'happy'), 'st-dashL', 0, 1.05) + sweat(300, 192) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">東奔西跑</text>') }
      ];
    },
    /* 大搖大擺 */
    i403: function () {
      return [
        { minDur: 6600, sub: '大公雞吃飽了，挺起胸膛在院子裡走路——左搖一下、右擺一下，神氣極了！',
          html: scene(P(400, 302, '<g class="st-strut">' + A('chicken') + '</g>', '', 0, 1.25) + hearts(500, 200)) },
        { minDur: 6600, sub: '連小貓經過都要讓牠三分，牠頭抬得更高、步子擺得更大了！',
          html: scene(P(360, 302, '<g class="st-strut">' + A('chicken') + '</g>', '', 0, 1.2) +
            P(600, 302, A('fox'), '', 0, .85) + sweat(640, 215) + qmark(560, 195)) },
        { minDur: 6600, sub: '走路搖搖擺擺、一副滿不在乎的神氣樣子——就是「大搖大擺」！',
          html: scene(P(300, 302, '<g class="st-strut">' + A('chicken') + '</g>', '', 0, 1.1) +
            P(560, 302, A('kid', 'wow'), '', 0, .9) + qmark(610, 190)) },
        { minDur: 6400, sub: '大搖大擺：走路搖擺神氣，滿不在乎的樣子。',
          html: scene(P(400, 302, '<g class="st-strut">' + A('chicken') + '</g>', '', 0, 1.3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">大搖大擺</text>') }
      ];
    },
    /* 交頭接耳 */
    i404: function () {
      var WHISPER = '<path d="M-16 -10 a14 11 0 1 1 28 4 q-1 5 -7 6 l-7 6 l1 -6 q-13 -1 -15 -10 z" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><text x="-2" y="-3" text-anchor="middle" font-size="9" fill="#8a7a4a">悄悄話</text>';
      return [
        { minDur: 6600, sub: '上課的時候，小軒和同桌頭靠著頭、湊在耳朵邊，嘀嘀咕咕說起悄悄話。',
          html: scene(P(330, 302, '<g transform="rotate(12)">' + A('kid', 'happy') + '</g>') +
            P(450, 302, '<g transform="rotate(-12)">' + A('kid', 'happy') + '</g>', '', 0, 1, true) +
            P(390, 180, WHISPER, '', 0, 1.3)) },
        { minDur: 6800, sub: '講台上的老師咳了一聲：「有什麼有趣的事，要不要跟全班分享呀？」兩人的臉一下子紅了。',
          html: scene(P(150, 302, A('kid', 'happy'), '', 0, 1.05) +
            P(400, 302, A('kid', 'wow') + '<ellipse cx="-15" cy="-44" rx="7" ry="5" fill="#ff9c8a"/><ellipse cx="15" cy="-44" rx="7" ry="5" fill="#ff9c8a"/>', '', 0, .9) +
            P(520, 302, A('kid', 'wow'), '', 0, .88) + sweat(470, 195)) },
        { minDur: 6600, sub: '「交頭接耳」是湊近耳邊低聲說話——上課時，可要專心聽講呀！',
          html: scene(P(330, 302, A('kid', 'happy')) + P(470, 302, A('kid', 'happy'), '', 0, .95) + hearts(400, 175)) },
        { minDur: 6400, sub: '交頭接耳：湊近耳邊低聲私語。',
          html: scene(P(330, 302, '<g transform="rotate(12)">' + A('kid', 'happy') + '</g>') +
            P(450, 302, '<g transform="rotate(-12)">' + A('kid', 'happy') + '</g>', '', 0, 1, true) + P(390, 190, WHISPER, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">交頭接耳</text>') }
      ];
    },
    /* 面紅耳赤 */
    i405: function () {
      var REDFACE = '<circle cx="0" cy="-54" r="24" fill="#ffb3a3" opacity=".55"/><ellipse cx="-24" cy="-54" rx="6" ry="8" fill="#ff8a80"/><ellipse cx="24" cy="-54" rx="6" ry="8" fill="#ff8a80"/>';
      var STAGE = '<rect x="-90" y="0" width="180" height="14" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>';
      return [
        { minDur: 6600, sub: '輪到小甄上台自我介紹。她一緊張，臉「唰」地一下，紅到了耳根！',
          html: scene(P(400, 288, STAGE) +
            P(400, 288, A('kid', 'wow') + REDFACE, '', 0, .95) + sweat(340, 190) +
            P(160, 302, A('kid', 'happy'), '', 0, .8) + P(640, 302, A('kid', 'happy'), '', .2, .8, true)) },
        { minDur: 6600, sub: '辯論比賽上，兩隊你一句我一句，爭得面紅耳赤，誰也不肯讓誰！',
          html: scene(P(300, 302, A('kid', 'angry') + REDFACE) +
            P(520, 302, A('kid', 'angry') + REDFACE, '', 0, .98, true) + bang(410, 180)) },
        { minDur: 6600, sub: '因為害羞、緊張或激動，而滿臉通紅——這就是「面紅耳赤」。',
          html: scene(P(400, 302, A('kid', 'happy') + REDFACE, '', 0, 1.05) + hearts(490, 190)) },
        { minDur: 6400, sub: '面紅耳赤：因害羞、緊張或激動而滿臉通紅。',
          html: scene(P(400, 302, A('kid', 'wow') + REDFACE, '', 0, 1.1) + sweat(330, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">面紅耳赤</text>') }
      ];
    },
    /* 張口結舌 */
    i406: function () {
      var PAPER59 = '<rect x="-18" y="-24" width="36" height="48" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<text x="0" y="2" text-anchor="middle" font-size="16" font-weight="bold" fill="#e85a4f">59</text>' +
        '<path d="M-10 12 q10 8 20 0" stroke="#e85a4f" stroke-width="2.6" fill="none"/>';
      var OPENMOUTH = '<ellipse cx="0" cy="-38" rx="6" ry="9" fill="#3a2e26"/>';
      return [
        { minDur: 6600, sub: '考試前，小強跟同學誇下海口：「這次我一定考滿分！」考卷發下來——五十九分。',
          html: scene(P(300, 302, A('kid', 'wow') + P(-42, -56, PAPER59, '', 0, .95)) + sweat(250, 195) +
            P(560, 302, A('kid', 'happy'), '', 0, .92, true)) },
        { minDur: 6600, sub: '同學問：「你不是說一定滿分嗎？」他張著嘴巴，半天答不出一句話……',
          html: scene(P(300, 302, A('kid', 'wow') + OPENMOUTH) + sweat(340, 195) +
            P(540, 302, A('kid', 'happy'), '', 0, .95, true) + qmark(590, 185)) },
        { minDur: 6600, sub: '理虧了、或是嚇呆了，張著嘴說不出話——這就是「張口結舌」。',
          html: scene(P(400, 302, A('kid', 'wow') + OPENMOUTH, '', 0, 1.05) + qmark(480, 180) + sweat(320, 190)) },
        { minDur: 6400, sub: '張口結舌：張著嘴說不出話，形容理屈或驚呆。',
          html: scene(P(400, 302, A('kid', 'wow') + OPENMOUTH, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">張口結舌</text>') }
      ];
    },
    /* 搖頭晃腦 */
    i407: function () {
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><line x1="-1" y1="-14" x2="-3" y2="11" stroke="#c9bfa8" stroke-width="2"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      return [
        { minDur: 6600, sub: '晨讀時間，小安背起唐詩——頭跟著節奏左搖右晃，讀得津津有味！',
          html: scene(P(360, 302, '<g class="st-wave">' + A('kid', 'happy') + '</g>' + P(-42, -54, BOOK)) +
            notes(280, 170) + notes(460, 160)) },
        { minDur: 6600, sub: '爺爺聽京劇也搖頭晃腦，手還跟著咿咿呀呀打拍子呢！',
          html: scene(P(400, 302, '<g class="st-wave">' + A('kid', 'happy') +
              '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/></g>', '', 0, 1.05) +
            notes(310, 165) + notes(500, 170) + hearts(430, 200)) },
        { minDur: 6600, sub: '頭搖來搖去、一副自得其樂的樣子——就是「搖頭晃腦」。',
          html: scene(P(340, 302, '<g class="st-wave">' + A('kid', 'happy') + '</g>') +
            P(520, 302, '<g class="st-wave" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .92) + notes(430, 165)) },
        { minDur: 6400, sub: '搖頭晃腦：頭搖來搖去，自得其樂的樣子。',
          html: scene(P(400, 302, '<g class="st-wave">' + A('kid', 'happy') + '</g>', '', 0, 1.1) + notes(490, 170) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">搖頭晃腦</text>') }
      ];
    },
    /* 大名鼎鼎 */
    i408: function () {
      var CAP = '<path d="M-16 -78 a16 10 0 0 1 32 0 l0 4 h-40 q0 -4 8 -4 z" fill="#5c82ba" stroke="#46689a" stroke-width="2"/>';
      var BAT = '<line x1="0" y1="0" x2="20" y2="-44" stroke="#c9a06c" stroke-width="6" stroke-linecap="round"/>';
      var SIGNPAPER = '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 8 q8 -8 16 -2" stroke="#3a2e26" stroke-width="2" fill="none"/>';
      return [
        { minDur: 6800, sub: '學校來了一位大名鼎鼎的棒球明星！人還沒進門，操場就擠滿了想看他的人。',
          html: scene(P(300, 302, A('kid', 'happy') + CAP + P(26, -40, BAT), '', 0, 1.05) +
            P(520, 302, A('kid', 'wow'), '', 0, .88) + P(620, 302, A('kid', 'wow'), '', .2, .85) +
            P(700, 302, A('kid', 'happy'), '', .4, .82) + hearts(440, 175)) },
        { minDur: 6600, sub: '「鼎鼎」是盛大的樣子——名氣大到人人都知道，就叫「大名鼎鼎」！',
          html: scene(P(300, 302, A('kid', 'happy') + CAP + P(26, -40, BAT), '', 0, 1.05) +
            notes(400, 165) + hearts(230, 180)) },
        { minDur: 6600, sub: '簽名會上，隊伍繞了操場整整三圈，人人都想要一張簽名！',
          html: scene(P(240, 302, A('kid', 'happy') + CAP + P(-38, -50, SIGNPAPER, '', 0, .9)) +
            P(430, 302, A('kid', 'happy'), '', 0, .88) + P(540, 302, A('kid', 'happy'), '', .2, .85) +
            P(650, 302, A('kid', 'happy'), '', .4, .82) + hearts(480, 180)) },
        { minDur: 6400, sub: '大名鼎鼎：名氣非常大。',
          html: scene(P(360, 302, A('kid', 'happy') + CAP + P(26, -40, BAT), '', 0, 1.1) + hearts(470, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">大名鼎鼎</text>') }
      ];
    },
    /* 二話不說 */
    i409: function () {
      var UMB = '<path d="M0 -50 q-30 0 -34 22 q8 -8 17 0 q8 -8 17 0 q8 -8 17 0 q8 -8 17 0 q-4 -22 -34 -22 z" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.4"/>' +
        '<line x1="0" y1="-28" x2="0" y2="8" stroke="#8b93a3" stroke-width="3.4"/><path d="M0 8 q0 8 8 6" stroke="#8b93a3" stroke-width="3.4" fill="none"/>';
      var RAINFX = '<g stroke="#8fc6ff" stroke-width="3.4" stroke-linecap="round">' +
        '<line class="st-rain" x1="140" y1="30" x2="134" y2="52"/><line class="st-rain" style="animation-delay:.4s" x1="300" y1="16" x2="294" y2="38"/>' +
        '<line class="st-rain" style="animation-delay:.8s" x1="450" y1="30" x2="444" y2="52"/><line class="st-rain" style="animation-delay:.2s" x1="580" y1="14" x2="574" y2="36"/></g>';
      var BOOKSTACK = '<g stroke-width="2"><rect x="-22" y="-10" width="44" height="10" rx="2" fill="#c9762f" stroke="#a85a1e"/><rect x="-20" y="-20" width="40" height="10" rx="2" fill="#5c82ba" stroke="#46689a"/><rect x="-21" y="-30" width="42" height="10" rx="2" fill="#6fae58" stroke="#548a40"/></g>';
      return [
        { minDur: 6800, sub: '放學下起大雨，同學沒帶傘急得直跺腳。小捷二話不說，把傘往他頭上一遮：「一起撐！」',
          html: scene(RAINFX + P(360, 302, A('kid', 'happy') + P(30, -70, UMB, '', 0, 1.1)) +
            P(470, 302, A('kid', 'happy'), '', 0, .95) + hearts(420, 190)) },
        { minDur: 6600, sub: '看到老師抱著一大疊作業本，他也二話不說，馬上跑過去幫忙搬。',
          html: scene(P(560, 302, A('kid', 'happy') + P(-40, -50, BOOKSTACK, '', 0, 1), '', 0, 1.05, true) +
            P(330, 302, A('kid', 'happy'), 'st-dashL') + hearts(450, 185)) },
        { minDur: 6600, sub: '不囉嗦、不猶豫，立刻行動——這就是「二話不說」！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + bang(460, 190) + hearts(280, 185)) },
        { minDur: 6400, sub: '二話不說：不多說什麼，立刻行動。',
          html: scene(P(380, 302, A('kid', 'happy'), 'st-dashL', 0, 1.05) + bang(300, 200) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">二話不說</text>') }
      ];
    },
    /* 人山人海 */
    i410: function () {
      function crowd(y, sc, n, dly) {
        var s = '';
        for (var i = 0; i < n; i++) s += P(120 + i * (560 / (n - 1)), y, A('kid', 'happy'), '', (dly || 0) + i * .1, sc);
        return s;
      }
      return [
        { minDur: 6800, sub: '跨年晚會的廣場上，放眼望去全是人——多得像山一樣高、像海一樣寬！',
          html: scene(crowd(302, .95, 5, 0) + crowd(260, .7, 6, .2) + crowd(228, .5, 7, .4), 'night') },
        { minDur: 6600, sub: '想擠到舞台前面？寸步難行！人挨著人、肩碰著肩。',
          html: scene(crowd(302, .95, 6, 0) +
            P(400, 302, A('kid', 'wow'), '', 0, 1) + sweat(450, 195), 'night') },
        { minDur: 6600, sub: '「人山人海」就是形容人非常多、非常擁擠的場面！',
          html: scene(crowd(302, .9, 5, 0) + crowd(258, .65, 6, .3) +
            bang(400, 120) + notes(250, 140), 'night') },
        { minDur: 6400, sub: '人山人海：人多得像山和海，非常擁擠。',
          html: scene(crowd(302, .85, 6, 0) + crowd(262, .6, 7, .3) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">人山人海</text>', 'night') }
      ];
    },
    /* 車水馬龍 */
    i411: function () {
      function car(x, y, color, dly) {
        return P(x, y, '<g class="st-windln"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<rect x="-22" y="-16" width="44" height="14" rx="5" fill="' + color + '"/>' +
          '<rect x="-12" y="-26" width="24" height="12" rx="4" fill="#e8f0f8"/>' +
          '<circle cx="-12" cy="0" r="6" fill="#3a2e26"/><circle cx="12" cy="0" r="6" fill="#3a2e26"/></g>');
      }
      var ROAD = '<rect y="290" width="800" height="26" fill="#8b93a3"/><g stroke="#fff" stroke-width="3" stroke-dasharray="20 16"><line x1="0" y1="303" x2="800" y2="303"/></g>';
      return [
        { minDur: 6600, sub: '站上天橋往下看：大街上的車一輛接著一輛，像流水一樣沒停過——',
          html: scene(ROAD + car(200, 292, '#e85a4f', 0) + car(360, 292, '#5c82ba', .3) + car(520, 292, '#6fae58', .6) + car(660, 292, '#e0a458', .2) +
            P(120, 302, A('kid', 'wow'), '', 0, .9)) },
        { minDur: 6600, sub: '古時候則是馬車來來往往：車如流水、馬如游龍，好不熱鬧！',
          html: scene(P(260, 302, A('horse'), 'st-strut') +
            P(430, 302, A('horse'), 'st-strut', .3, .9) + P(590, 302, A('horse'), 'st-strut', .5, .85) + notes(400, 175)) },
        { minDur: 6600, sub: '「車水馬龍」就是形容車馬往來不絕、街市熱鬧繁華的樣子！',
          html: scene(ROAD + car(260, 292, '#e0a458', 0) + car(450, 292, '#e85a4f', .4) +
            P(620, 302, A('horse'), 'st-strut', 0, .85) + hearts(350, 200)) },
        { minDur: 6400, sub: '車水馬龍：車馬往來不絕，熱鬧繁華。',
          html: scene(ROAD + car(240, 292, '#5c82ba', 0) + car(430, 292, '#e85a4f', .3) + car(610, 292, '#6fae58', .5) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">車水馬龍</text>') }
      ];
    },
    /* 良師益友 */
    i412: function () {
      var BOOK = '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>';
      return [
        { minDur: 6800, sub: '王老師教小新功課，也教他做人的道理；小新有心事，老師也總是耐心地聽。',
          html: scene(P(300, 302, A('kid', 'happy'), '', 0, .95) +
            P(520, 302, A('kid', 'happy') + P(-40, -56, BOOK), '', 0, 1.08, true) + hearts(410, 175)) },
        { minDur: 6800, sub: '好朋友阿哲總在他遇到困難時伸出手，也會直接說出他的缺點，幫他變得更好。',
          html: scene(P(320, 302, A('kid', 'happy')) + P(470, 302, A('kid', 'happy'), '', 0, .97, true) +
            hearts(400, 172) + bang(560, 200)) },
        { minDur: 6600, sub: '讓人受益的好老師、好朋友——就是「良師益友」，一定要好好珍惜！',
          html: scene(P(240, 302, A('kid', 'happy'), '', 0, 1.05) + P(400, 302, A('kid', 'happy'), '', .2, .95) +
            P(550, 302, A('kid', 'happy'), '', .4, .95) + hearts(400, 165)) },
        { minDur: 6400, sub: '良師益友：使人受益的好老師與好朋友。',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, BOOK)) + P(520, 302, A('kid', 'happy'), '', 0, .95) + hearts(420, 178) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">良師益友</text>') }
      ];
    },
    /* 一言為定 */
    i413: function () {
      var PINKY = '<path d="M-20 -6 q10 -14 20 0 q10 14 20 0" stroke="#ffe3c1" stroke-width="9" fill="none" stroke-linecap="round"/>';
      var BIKE = '<circle cx="-24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/><circle cx="24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/>' +
        '<path d="M-24 0 L-8 -22 L14 -22 L24 0 M-8 -22 L-2 0" stroke="#e85a4f" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '「週六早上七點，公園門口見，一起去騎車！」「好——一言為定！」兩人勾勾手指。',
          html: scene(P(330, 302, A('kid', 'happy')) + P(470, 302, A('kid', 'happy'), '', 0, 1, true) +
            P(400, 210, PINKY, '', 0, 1.2) + hearts(400, 160)) },
        { minDur: 6600, sub: '週六一大早，兩個人果然都準時出現——說好的事，絕不改變！',
          html: scene(P(120, 302, TREE, '', 0, 1.1) +
            P(320, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(470, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            P(620, 300, BIKE, '', 0, 1) + hearts(400, 175)) },
        { minDur: 6600, sub: '「一言為定」：一句話說定，就不再改變——守信用的人，最棒！',
          html: scene(P(400, 210, PINKY, '', 0, 1.4) +
            P(300, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(400, 260)) },
        { minDur: 6400, sub: '一言為定：一句話說定，不再改變。',
          html: scene(P(400, 220, PINKY, '', 0, 1.6) + hearts(500, 190) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一言為定</text>') }
      ];
    },
    /* 百依百順 */
    i414: function () {
      return [
        { minDur: 6800, sub: '小狗胖胖對主人百依百順：叫牠坐下就坐下、叫牠握手就伸出前腳，乖得不得了！',
          html: scene(P(300, 302, A('kid', 'happy') +
              '<path d="M18 -40 q14 2 20 10" stroke="#ffe3c1" stroke-width="6" fill="none" stroke-linecap="round"/>') +
            P(500, 300, A('dog'), '', 0, 1.05) + hearts(410, 190)) },
        { minDur: 6800, sub: '可是對人就不能凡事百依百順——同學慫恿你做不對的事，要勇敢說「不」！',
          html: scene(P(300, 302, A('kid', 'angry') +
              '<path d="M18 -60 q14 -4 22 2" stroke="#ffe3c1" stroke-width="6" fill="none" stroke-linecap="round"/>') +
            bang(400, 180) + P(540, 302, A('kid', 'wow'), '', 0, .95, true) + sweat(580, 200)) },
        { minDur: 6600, sub: '「百依百順」就是凡事都依從對方——用對地方是乖巧，用錯地方就變成沒主見了。',
          html: scene(P(300, 302, A('kid', 'happy')) + P(500, 300, A('dog'), '', 0, .95) + qmark(410, 185)) },
        { minDur: 6400, sub: '百依百順：凡事都依從對方。',
          html: scene(P(340, 302, A('kid', 'happy')) + P(520, 300, A('dog'), '', 0, 1.05) + hearts(430, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">百依百順</text>') }
      ];
    },
    /* 一石二鳥 */
    i801: function () {
      var STONE3 = '<circle cx="0" cy="0" r="7" fill="#8b93a3" stroke="#6d7585" stroke-width="2"/>';
      var SHIRT = '<path d="M-12 -20 L-22 -12 L-16 -4 L-12 -8 L-12 12 L12 12 L12 -8 L16 -4 L22 -12 L12 -20 Q0 -14 -12 -20 Z" fill="#a5c8ff" stroke="#5c82ba" stroke-width="2"/>';
      var LINE2 = '<line x1="-120" y1="0" x2="120" y2="0" stroke="#8b93a3" stroke-width="3"/>';
      return [
        { minDur: 6800, sub: '傳說有位好射手，一顆石子擲出去——咻！竟然同時打下了兩隻鳥！',
          html: scene(P(430, 150, STONE3, '', 0, 1.2) + bang(480, 110) +
            P(380, 160, '<g class="st-faint">' + A('bird') + '</g>', '', 0, .95) +
            P(520, 170, '<g class="st-faint" style="animation-delay:.2s">' + A('bird') + '</g>', '', 0, .9, true) +
            P(220, 302, A('kid', 'happy'))) },
        { minDur: 6800, sub: '就像幫媽媽晾衣服：家事做完了，還順便晒晒太陽做運動——一件事、兩個收穫！',
          html: scene(P(430, 220, LINE2 + P(-60, 4, SHIRT, '', 0, .9) + P(40, 4, SHIRT, '', .2, .85)) +
            P(240, 302, A('kid', 'happy')) + hearts(330, 185)) },
        { minDur: 6600, sub: '「一石二鳥」和「一舉兩得」意思相近：做一件事，同時得到兩種好處！',
          html: scene(P(400, 180, STONE3, '', 0, 1.1) +
            P(330, 200, A('bird'), '', 0, .85) + P(480, 210, A('bird'), '', .2, .8, true) +
            P(240, 302, A('kid', 'happy')) + hearts(400, 260)) },
        { minDur: 6400, sub: '一石二鳥：做一件事同時得到兩種好處。',
          html: scene(P(400, 190, STONE3, '', 0, 1.3) + P(320, 210, A('bird'), '', 0, .9) + P(490, 220, A('bird'), '', .2, .85, true) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一石二鳥</text>') }
      ];
    },
    /* 大驚小怪 */
    i802: function () {
      var SPIDER = '<circle cx="0" cy="0" r="7" fill="#6d6044"/><circle cx="0" cy="-8" r="4.6" fill="#6d6044"/>' +
        '<g stroke="#6d6044" stroke-width="1.8" stroke-linecap="round"><line x1="-6" y1="-2" x2="-14" y2="-8"/><line x1="-6" y1="2" x2="-15" y2="2"/><line x1="-6" y1="5" x2="-13" y2="10"/><line x1="6" y1="-2" x2="14" y2="-8"/><line x1="6" y1="2" x2="15" y2="2"/><line x1="6" y1="5" x2="13" y2="10"/></g>' +
        '<circle cx="-2" cy="-9" r="1" fill="#fff"/><circle cx="2" cy="-9" r="1" fill="#fff"/>';
      return [
        { minDur: 6600, sub: '「啊——！蜘蛛！」小美看到牆角一隻小蜘蛛，尖叫得整層樓都聽見了。',
          html: scene(P(560, 260, SPIDER, '', 0, 1.1) +
            P(300, 302, A('kid', 'wow')) + bang(380, 180) + sweat(250, 195)) },
        { minDur: 6800, sub: '哥哥跑來一看，笑了：「這麼小一隻，別大驚小怪啦！」輕輕把牠請到花園去了。',
          html: scene(P(300, 302, A('kid', 'happy') + P(40, -60, SPIDER, '', 0, .8)) +
            P(500, 302, A('kid', 'happy'), '', 0, .95) + hearts(410, 185)) },
        { minDur: 6600, sub: '為了不重要的小事過分驚訝、大呼小叫——就是「大驚小怪」。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) + bang(490, 185) + qmark(320, 185)) },
        { minDur: 6400, sub: '大驚小怪：為了小事過分驚訝。',
          html: scene(P(360, 302, A('kid', 'wow'), '', 0, 1.05) + P(560, 250, SPIDER, '', 0, 1) + bang(450, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">大驚小怪</text>') }
      ];
    },
    /* 早出晚歸 */
    i803: function () {
      var BRIEFCASE = '<rect x="-14" y="-16" width="28" height="20" rx="4" fill="#8a5a33" stroke="#6d4426" stroke-width="2.4"/><path d="M-6 -16 q6 -8 12 0" stroke="#6d4426" stroke-width="3" fill="none"/>';
      return [
        { minDur: 6600, sub: '天剛濛濛亮，爸爸就提著公事包出門上班了。',
          html: scene(P(300, 302, A('kid', 'happy') + P(-38, -30, BRIEFCASE), 'st-inR', 0, 1.05)) },
        { minDur: 6600, sub: '星星都出來了，他才拖著疲憊的腳步回到家。',
          html: scene(P(400, 302, A('kid', 'sad') + P(-38, -30, BRIEFCASE), 'st-inL', 0, 1.05) + sweat(350, 195) + zzz(500, 200), 'night') },
        { minDur: 6800, sub: '農夫伯伯也是早出晚歸，天天在田裡辛勤工作——記得跟辛苦的家人說聲「辛苦了」！',
          html: scene(P(340, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe')) + sweat(290, 195) +
            P(560, 302, A('kid', 'happy'), '', 0, .9) + hearts(470, 185)) },
        { minDur: 6400, sub: '早出晚歸：早上出門、很晚回家，形容辛勤忙碌。',
          html: scene(P(360, 302, A('kid', 'sad') + P(-38, -30, BRIEFCASE), '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">早出晚歸</text>', 'night') }
      ];
    },
    /* 大街小巷 */
    i804: function () {
      var LANTERN = '<line x1="0" y1="-40" x2="0" y2="-30" stroke="#a85a1e" stroke-width="2.6"/>' +
        '<path d="M-12 -30 Q-16 -12 -12 0 L12 0 Q16 -12 12 -30 Z" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.4"/>' +
        '<path d="M-6 0 l0 8 M0 0 l0 9 M6 0 l0 8" stroke="#ffd97a" stroke-width="2"/>';
      var HOUSE4 = '<path d="M-40 -34 L0 -60 L40 -34 Z" fill="#8a5a33"/><rect x="-32" y="-34" width="64" height="34" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<rect x="-24" y="-26" width="10" height="20" fill="#e85a4f"/><rect x="14" y="-26" width="10" height="20" fill="#e85a4f"/>';
      var TANGHULU = '<line x1="0" y1="0" x2="0" y2="-40" stroke="#a8734a" stroke-width="3"/><circle cx="0" cy="-38" r="6" fill="#e85a4f"/><circle cx="0" cy="-27" r="6" fill="#e85a4f"/><circle cx="0" cy="-16" r="6" fill="#e85a4f"/>';
      return [
        { minDur: 6600, sub: '過年到了！大街小巷都掛起紅燈籠，家家戶戶貼上春聯，喜氣洋洋。',
          html: scene(P(220, 302, HOUSE4) + P(600, 302, HOUSE4, '', 0, .9) +
            P(330, 240, LANTERN, '', 0, 1) + P(480, 235, LANTERN, '', .3, .95) + hearts(400, 190)) },
        { minDur: 6600, sub: '賣糖葫蘆的叫賣聲，傳遍了每一條大街、每一條小巷。',
          html: scene(P(320, 302, A('kid', 'happy') + P(30, -50, TANGHULU)) + notes(400, 170) +
            P(560, 302, A('kid', 'happy'), 'st-inR', 0, .9) + hearts(480, 195)) },
        { minDur: 6600, sub: '「大街小巷」指城裡所有的街道巷弄——也就是每一個角落！',
          html: scene(P(200, 302, HOUSE4, '', 0, .9) + P(430, 302, HOUSE4, '', 0, .8) + P(640, 302, HOUSE4, '', 0, .85) +
            P(320, 240, LANTERN, '', 0, .9)) },
        { minDur: 6400, sub: '大街小巷：城裡所有的街道巷弄，每個角落。',
          html: scene(P(230, 302, HOUSE4) + P(580, 302, HOUSE4, '', 0, .9) + P(400, 235, LANTERN, '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">大街小巷</text>') }
      ];
    },
    /* 心花怒放 */
    i805: function () {
      function bloom(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<circle cx="0" cy="-8" r="6" fill="' + color + '"/><circle cx="-7" cy="-3" r="6" fill="' + color + '"/><circle cx="7" cy="-3" r="6" fill="' + color + '"/><circle cx="-4" cy="4" r="6" fill="' + color + '"/><circle cx="4" cy="4" r="6" fill="' + color + '"/><circle cx="0" cy="-1" r="4" fill="#ffe066"/></g>');
      }
      var REPORT = '<rect x="-16" y="-22" width="32" height="44" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<path d="M-9 -12 h18 M-9 -4 h18 M-9 4 h18" stroke="#8fa3bf" stroke-width="1.8"/>' +
        '<path d="M-8 12 l5 6 l11 -10" stroke="#548a40" stroke-width="3" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '成績單發下來——小婷竟然進步了二十名！她的心裡樂開了花。',
          html: scene(P(360, 302, A('kid', 'wow') + P(-42, -56, REPORT, '', 0, .95)) + bang(460, 190) + hearts(280, 185)) },
        { minDur: 6600, sub: '高興得像心裡的花朵「啪」地一下全部盛開——這就是「心花怒放」！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) +
            bloom(280, 200, '#ff9eb5', 0) + bloom(400, 170, '#ffd97a', .3) + bloom(520, 200, '#c9a8e0', .6) + hearts(460, 240)) },
        { minDur: 6600, sub: '媽媽知道了也心花怒放，晚餐特地加菜，全家一起慶祝！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(480, 302, A('kid', 'happy'), '', 0, 1.05, true) +
            bloom(400, 190, '#ff9eb5', 0) + hearts(390, 240)) },
        { minDur: 6400, sub: '心花怒放：心裡高興得像花朵盛開。',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) +
            bloom(270, 210, '#ff9eb5', 0) + bloom(530, 210, '#ffd97a', .4) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">心花怒放</text>') }
      ];
    },
    /* 七手八腳 */
    i806: function () {
      var BUCKET = '<path d="M-12 -18 L-9 2 Q0 6 9 2 L12 -18 Z" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2.4"/><path d="M-12 -18 q12 -12 24 0" stroke="#6d87ab" stroke-width="2.6" fill="none"/>';
      var PUDDLE = '<ellipse cx="0" cy="0" rx="46" ry="10" fill="#a8d4ee" opacity=".8"/>';
      var CLOTH = '<path d="M-14 0 q7 -8 14 0 q7 8 14 0" stroke="#ffd97a" stroke-width="7" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '啊，金魚缸打翻了！大家七手八腳搶救：有人撈魚、有人提水桶、有人拿抹布擦地——',
          html: scene(P(430, 318, PUDDLE) + P(430, 300, A('fish'), '', 0, .8) + bang(430, 240) +
            P(260, 302, A('kid', 'wow')) +
            P(560, 302, A('kid', 'wow') + P(-34, -30, BUCKET, '', 0, .9), '', 0, .92) +
            P(670, 302, A('kid', 'wow') + P(-30, -24, CLOTH, '', 0, .8), '', .2, .88)) },
        { minDur: 6600, sub: '人多手雜，你撞我、我擠你，反而亂成一團！金魚差點又摔了出去。',
          html: scene(P(430, 318, PUDDLE) +
            P(340, 302, A('kid', 'wow')) + P(440, 302, A('kid', 'wow'), '', 0, .92, true) +
            bang(395, 200) + sweat(300, 195) + sweat(490, 200)) },
        { minDur: 6800, sub: '很多人一起動手、卻忙亂沒條理，就是「七手八腳」——分工合作，才有效率呀！',
          html: scene(P(300, 302, A('kid', 'happy') + P(-34, -30, BUCKET, '', 0, .9)) +
            P(470, 302, A('kid', 'happy'), '', 0, .95) + hearts(390, 180)) },
        { minDur: 6400, sub: '七手八腳：很多人一起動手，忙亂沒有條理。',
          html: scene(P(330, 302, A('kid', 'wow')) + P(450, 302, A('kid', 'wow'), '', 0, .92, true) + bang(395, 195) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">七手八腳</text>') }
      ];
    },
    /* 三長兩短 */
    i807: function () {
      var CHESS = '<rect x="-24" y="-24" width="48" height="48" rx="5" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.6"/><g stroke="#a89878" stroke-width="1.8"><line x1="-24" y1="-8" x2="24" y2="-8"/><line x1="-24" y1="8" x2="24" y2="8"/><line x1="-8" y1="-24" x2="-8" y2="24"/><line x1="8" y1="-24" x2="8" y2="24"/></g><circle cx="-16" cy="-16" r="5" fill="#3a2e26"/><circle cx="16" cy="0" r="5" fill="#fff" stroke="#c9bfa8"/>';
      return [
        { minDur: 6800, sub: '爺爺出門好久沒回來，天都黑了。奶奶急得在門口走來走去：「可別出了什麼三長兩短呀！」',
          html: scene(P(360, 302, A('kid', 'sad'), '', 0, 1.02) + sweat(310, 195) + qmark(430, 180), 'night') },
        { minDur: 6800, sub: '原來爺爺只是在公園下棋下過了頭！平平安安回到家，大家都鬆了一口氣。',
          html: scene(P(300, 302, A('kid', 'happy') +
              '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', 'st-inL', 0, 1.05) +
            P(520, 260, CHESS, '', 0, .9) +
            P(620, 302, A('kid', 'happy'), '', 0, .95) + hearts(450, 190), 'night') },
        { minDur: 6600, sub: '「三長兩短」指意外的災禍——是一句擔心親人安危的話。',
          html: scene(P(360, 302, A('kid', 'sad'), '', 0, 1) + qmark(430, 180) + sweat(300, 195)) },
        { minDur: 6400, sub: '三長兩短：指意外的災禍或事故。',
          html: scene(P(380, 302, A('kid', 'sad'), '', 0, 1.05) + qmark(460, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">三長兩短</text>') }
      ];
    },
    /* 眼明手快 */
    i808: function () {
      var VASE2 = '<path d="M-10 0 Q-15 -10 -10 -22 Q-5 -28 -7 -34 L7 -34 Q5 -28 10 -22 Q15 -10 10 0 Z" fill="#8fd0c0" stroke="#5aa896" stroke-width="2.4"/>';
      var PADDLE = '<ellipse cx="8" cy="-24" rx="11" ry="14" fill="#c96a5a" stroke="#a84a3f" stroke-width="2.4"/><line x1="4" y1="-12" x2="0" y2="0" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>';
      var BALL2 = '<circle cx="0" cy="0" r="6" fill="#fff" stroke="#c9bfa8" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '花瓶被手肘一碰、滑下桌子的那一瞬間——小哲眼明手快，「唰」地伸手接住了！',
          html: scene(P(430, 250, '<g transform="rotate(28)">' + VASE2 + '</g>') + bang(500, 200) +
            P(330, 302, A('kid', 'wow') + '<circle cx="30" cy="-58" r="8.5" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>') + sweat(270, 195)) },
        { minDur: 6600, sub: '打桌球也要眼明手快：看得準、出手快，才接得住每一顆球！',
          html: scene(P(300, 302, A('kid', 'happy') + P(28, -40, PADDLE)) +
            P(470, 220, BALL2, '', 0, 1.1) +
            P(600, 302, A('kid', 'happy') + P(28, -40, PADDLE), '', 0, .95, true) + bang(480, 170)) },
        { minDur: 6600, sub: '「眼明手快」：眼睛看得準、動作又敏捷——反應快的人真厲害！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 185) + bang(310, 195)) },
        { minDur: 6400, sub: '眼明手快：眼睛看得準，動作敏捷。',
          html: scene(P(360, 302, A('kid', 'happy') + P(28, -40, PADDLE), '', 0, 1.05) + P(520, 230, BALL2, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">眼明手快</text>') }
      ];
    },
    /* 積少成多 */
    i1001: function () {
      var PIGGY = '<ellipse cx="0" cy="-16" rx="24" ry="18" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2.6"/>' +
        '<circle cx="-20" cy="-24" r="7" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2"/>' +
        '<ellipse cx="-24" cy="-23" rx="3.4" ry="4" fill="#e07ba3"/>' +
        '<rect x="-5" y="-36" width="12" height="3.4" rx="1.7" fill="#c95a83"/>' +
        '<rect x="-14" y="-2" width="7" height="7" rx="3" fill="#e07ba3"/><rect x="8" y="-2" width="7" height="7" rx="3" fill="#e07ba3"/>' +
        '<circle cx="-14" cy="-26" r="1.8" fill="#3a2e26"/>';
      var COIN = '<circle cx="0" cy="0" r="9" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/><rect x="-3" y="-3" width="6" height="6" fill="none" stroke="#c98f2a" stroke-width="1.8"/>';
      return [
        { minDur: 6600, sub: '小杉每天把五塊錢投進小豬撲滿——叮咚、叮咚，一天存一點。',
          html: scene(P(460, 302, PIGGY, '', 0, 1.2) + P(430, 230, COIN, '', 0, 1) +
            P(280, 302, A('kid', 'happy')) + notes(520, 200)) },
        { minDur: 6800, sub: '一年後打開一數：哇！竟然存了一千八百多塊，夠買那套一直想要的百科全書了！',
          html: scene(P(430, 300, COIN, '', 0, 1) + P(470, 296, COIN, '', .1, 1) + P(510, 300, COIN, '', .2, 1) + P(450, 280, COIN, '', .3, .9) + P(490, 278, COIN, '', .4, .9) +
            P(280, 302, A('kid', 'wow')) + bang(560, 220) + hearts(340, 185)) },
        { minDur: 6800, sub: '一點一滴累積，少的也會變成多——讀書也一樣：每天記一點，學問就越來越多！',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>')) +
            P(520, 302, PIGGY, '', 0, 1) + hearts(420, 185)) },
        { minDur: 6400, sub: '積少成多：一點一滴累積，少的也會變成多。',
          html: scene(P(400, 302, PIGGY, '', 0, 1.4) + P(360, 230, COIN, '', 0, 1) + P(450, 220, COIN, '', .3, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">積少成多</text>') }
      ];
    },
    /* 遙遙領先 */
    i1002: function () {
      var TRACK = '<rect y="296" width="800" height="18" fill="#d9a890"/><g stroke="#fff" stroke-width="3" stroke-dasharray="18 14"><line x1="0" y1="305" x2="800" y2="305"/></g>';
      return [
        { minDur: 6600, sub: '賽跑槍聲一響，小捷一馬當先衝到最前面，把其他人甩開一大段距離！',
          html: scene(TRACK + P(620, 296, A('kid', 'happy'), 'st-dashL', 0, 1.05) +
            P(240, 296, A('kid', 'happy'), 'st-strut', 0, .85) + P(140, 296, A('kid', 'happy'), 'st-strut', .2, .8) + bang(700, 220)) },
        { minDur: 6600, sub: '跑到操場另一頭回頭一看——第二名還遠遠落在後面呢！',
          html: scene(TRACK + P(640, 296, A('kid', 'happy'), '', 0, 1.05, true) +
            P(150, 296, A('kid', 'wow'), 'st-strut', 0, .8) + sweat(200, 210) +
            '<path d="M240 260 q180 -20 340 0" stroke="#c9bfa8" stroke-width="4" fill="none" stroke-dasharray="9 8"/>') },
        { minDur: 6600, sub: '「遙遙領先」：遠遠走在最前面，大幅超過其他人！',
          html: scene(TRACK + P(600, 296, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(680, 200) +
            P(180, 296, A('kid', 'happy'), 'st-strut', 0, .8)) },
        { minDur: 6400, sub: '遙遙領先：遠遠走在最前面，大幅超過別人。',
          html: scene(TRACK + P(620, 296, A('kid', 'happy'), 'st-dashL', 0, 1.1) + P(160, 296, A('kid', 'happy'), 'st-strut', 0, .78) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">遙遙領先</text>') }
      ];
    },
    /* 鐵杵磨針（與磨杵成針同典） */
    i1003: function () {
      var sc = STORIES.i786();
      var last = sc[sc.length - 1];
      last.sub = '鐵杵磨針：有恆心肯下功夫，再難的事也能成功。';
      last.html = last.html.replace('磨杵成針', '鐵杵磨針');
      return sc;
    },
    /* 生龍活虎 */
    i019: function () {
      return [
        { minDur: 6600, sub: '一大早的操場上，小朋友們跑的跑、跳的跳，個個精神飽滿、活力十足！',
          html: scene(P(240, 302, A('kid', 'happy'), 'st-dashL') +
            P(430, 302, '<g class="st-hop">' + A('kid', 'happy') + '</g>', '', .2, .95) +
            P(600, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', .4, .9) + bang(330, 200)) },
        { minDur: 6600, sub: '像騰飛的龍、像跳躍的虎——這種精力充沛的樣子，就叫「生龍活虎」！',
          html: scene(P(280, 160, A('dragon'), '', 0, 1.05) + P(540, 302, '<g class="st-hop">' + A('tiger') + '</g>') +
            hearts(410, 210)) },
        { minDur: 6600, sub: '睡飽吃好、天天運動，每個人都能生龍活虎、精神百倍！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(480, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .93) + hearts(390, 170)) },
        { minDur: 6400, sub: '生龍活虎：精力充沛，充滿活力。',
          html: scene(P(270, 180, A('dragon'), '', 0, .95) + P(530, 302, '<g class="st-hop">' + A('tiger') + '</g>') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">生龍活虎</text>') }
      ];
    },
    /* 一帆風順 */
    i020: function () {
      var SAIL = '<path d="M-46 0 L46 0 L34 16 L-34 16 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>' +
        '<line x1="0" y1="0" x2="0" y2="-66" stroke="#8a5a33" stroke-width="4"/>' +
        '<path d="M0 -66 Q34 -46 0 -8 Z" fill="#fff" stroke="#d5cfc0" stroke-width="2.4"/>';
      var SEA6 = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 274 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>';
      var WINDLN = '<g stroke="#e8f4fb" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"><path class="st-windln" d="M80 140 q60 -14 120 0"/><path class="st-windln" style="animation-delay:.7s" d="M140 180 q70 -14 130 2"/></g>';
      return [
        { minDur: 6600, sub: '小帆船揚起白帆，順著風出發——風把帆吹得鼓鼓的，船兒輕快地往前跑！',
          html: scene(SEA6 + WINDLN + P(400, 268, SAIL, 'st-strut')) },
        { minDur: 6600, sub: '一路上沒有大浪、沒有暗礁，順順利利抵達了目的地！',
          html: scene(SEA6 + P(600, 268, SAIL) +
            '<ellipse cx="720" cy="330" rx="130" ry="46" fill="#b8e08e"/>' + hearts(520, 200)) },
        { minDur: 6800, sub: '「一帆風順」比喻事情進行得順順利利、沒有阻礙——也常用來祝福出遠門的人！',
          html: scene(SEA6 + P(360, 268, SAIL, 'st-strut', 0, .95) +
            P(150, 296, A('kid', 'happy') +
              '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>', '', 0, .9) + hearts(250, 210)) },
        { minDur: 6400, sub: '一帆風順：事情進行順利，沒有障礙。',
          html: scene(SEA6 + WINDLN + P(430, 268, SAIL, '', 0, 1.1) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一帆風順</text>') }
      ];
    },
    /* 春暖花開 */
    i022: function () {
      function flower2(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="-16" stroke="#5f8a46" stroke-width="3"/>' +
          '<circle cx="0" cy="-22" r="5" fill="' + color + '"/><circle cx="-6" cy="-18" r="5" fill="' + color + '"/><circle cx="6" cy="-18" r="5" fill="' + color + '"/><circle cx="0" cy="-14" r="5" fill="' + color + '"/><circle cx="0" cy="-18" r="3.4" fill="#ffe066"/></g>');
      }
      return [
        { minDur: 6600, sub: '冬天過去了，太陽變得暖洋洋——公園裡的花一朵接一朵，全都開了！',
          html: scene(flower2(220, 318, '#ff9eb5', 0) + flower2(320, 322, '#ffd97a', .3) + flower2(420, 318, '#c9a8e0', .5) + flower2(520, 322, '#ff8a80', .2) +
            P(650, 200, A('butterfly'), '', 0, .95) + hearts(580, 250)) },
        { minDur: 6600, sub: '蝴蝶飛來了、小鳥唱歌了，大家脫下厚外套，出門野餐踏青！',
          html: scene(flower2(180, 320, '#ff9eb5', 0) + flower2(650, 318, '#ffd97a', .4) +
            P(300, 302, A('kid', 'happy'), 'st-strut') + P(450, 302, A('kid', 'happy'), 'st-strut', .2, .93) +
            P(560, 190, A('bird')) + notes(620, 150)) },
        { minDur: 6600, sub: '「春暖花開」：春天氣溫回暖、百花綻放——一年裡最舒服的季節！',
          html: scene(flower2(250, 320, '#ff9eb5', 0) + flower2(400, 318, '#c9a8e0', .3) + flower2(550, 322, '#ffd97a', .5) +
            P(660, 210, A('butterfly'), '', 0, .9) + hearts(400, 240)) },
        { minDur: 6400, sub: '春暖花開：春天氣溫回暖，花朵綻放。',
          html: scene(flower2(240, 320, '#ff9eb5', 0) + flower2(360, 318, '#ffd97a', .2) + flower2(480, 322, '#ff8a80', .4) + flower2(590, 318, '#c9a8e0', .6) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">春暖花開</text>') }
      ];
    },
    /* 雨過天晴 */
    i024: function () {
      var RAINFX = '<g stroke="#8fc6ff" stroke-width="3.4" stroke-linecap="round">' +
        '<line class="st-rain" x1="140" y1="30" x2="134" y2="52"/><line class="st-rain" style="animation-delay:.4s" x1="300" y1="16" x2="294" y2="38"/>' +
        '<line class="st-rain" style="animation-delay:.8s" x1="450" y1="30" x2="444" y2="52"/><line class="st-rain" style="animation-delay:.2s" x1="580" y1="14" x2="574" y2="36"/></g>' +
        '<g class="st-cloud"><ellipse cx="300" cy="60" rx="60" ry="20" fill="#8b93a3"/><ellipse cx="480" cy="50" rx="70" ry="22" fill="#a3a9b8"/></g>';
      var RAINBOW = '<g fill="none" stroke-width="7"><path d="M200 240 A200 200 0 0 1 600 240" stroke="#e85a4f"/><path d="M212 240 A188 188 0 0 1 588 240" stroke="#ffb14d"/><path d="M224 240 A176 176 0 0 1 576 240" stroke="#ffe066"/><path d="M236 240 A164 164 0 0 1 564 240" stroke="#a5d47c"/><path d="M248 240 A152 152 0 0 1 552 240" stroke="#a5c8ff"/></g>';
      return [
        { minDur: 6600, sub: '嘩啦啦——大雨下個不停，小朋友們只能待在屋裡，望著窗外嘆氣。',
          html: scene(RAINFX + P(360, 302, A('kid', 'sad')) + sweat(310, 200) + qmark(430, 185)) },
        { minDur: 6600, sub: '雨停了！太陽鑽出雲層，天邊還掛起一道彩虹——大家歡呼著衝出門玩！',
          html: scene(RAINBOW + P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(470, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .93) + hearts(390, 260)) },
        { minDur: 6800, sub: '「雨過天晴」也比喻困難過去、心情好轉——考差了難過一晚，隔天打起精神繼續加油！',
          html: scene(P(300, 302, A('kid', 'happy')) + hearts(380, 180) +
            P(560, 302, A('kid', 'happy'), '', 0, .95) + bang(480, 200)) },
        { minDur: 6400, sub: '雨過天晴：雨停天晴，比喻困難過去了。',
          html: scene(RAINBOW +
            '<text x="400" y="300" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">雨過天晴</text>') }
      ];
    },
    /* 七嘴八舌 */
    i025: function () {
      function bub2(x, y, txt, dly) {
        return P(x, y, '<g class="st-zfloat"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<path d="M-24 -14 a20 16 0 1 1 40 5 q-2 7 -10 8 l-10 9 l1 -9 q-19 -2 -21 -13 z" fill="#fff" stroke="#c9bfa8" stroke-width="2.2"/>' +
          '<text x="-2" y="-3" text-anchor="middle" font-size="11" fill="#4a3200">' + txt + '</text></g>');
      }
      return [
        { minDur: 6800, sub: '班會討論園遊會要賣什麼——「賣冰沙！」「賣熱狗！」「套圈圈啦！」大家同時開口，教室鬧成一團！',
          html: scene(P(240, 302, A('kid', 'happy'), '', 0, .95) + P(400, 302, A('kid', 'happy'), '', .2, .93) +
            P(560, 302, A('kid', 'happy'), '', .4, .9) +
            bub2(240, 170, '冰沙!', 0) + bub2(400, 145, '熱狗!', .3) + bub2(560, 170, '套圈圈!', .6)) },
        { minDur: 6600, sub: '你一句、我一句，誰也聽不清誰——班長敲敲桌子：「一個一個說！」',
          html: scene(P(300, 302, A('kid', 'wow')) + sweat(250, 195) +
            P(540, 302, A('kid', 'angry'), '', 0, .97, true) + bang(440, 185)) },
        { minDur: 6600, sub: '許多人同時各說各的、亂成一片——就是「七嘴八舌」。輪流發言才聽得清楚呀！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(470, 302, A('kid', 'happy'), '', .2, .93) +
            '<path d="M300 240 q0 -20 14 -22" stroke="#548a40" stroke-width="4" fill="none" stroke-linecap="round"/>' + hearts(400, 180)) },
        { minDur: 6400, sub: '七嘴八舌：許多人同時各說各的話，亂成一片。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.02) +
            bub2(260, 170, '…', 0) + bub2(400, 140, '…!', .3) + bub2(540, 170, '?!', .6) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">七嘴八舌</text>') }
      ];
    },
    /* 百般刁難 */
    i021: function () {
      var CHESS = '<rect x="-24" y="-24" width="48" height="48" rx="5" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.6"/><g stroke="#a89878" stroke-width="1.8"><line x1="-24" y1="-8" x2="24" y2="-8"/><line x1="-24" y1="8" x2="24" y2="8"/><line x1="-8" y1="-24" x2="-8" y2="24"/><line x1="8" y1="-24" x2="8" y2="24"/></g><circle cx="-16" cy="-16" r="5" fill="#3a2e26"/><circle cx="16" cy="0" r="5" fill="#fff" stroke="#c9bfa8"/>';
      return [
        { minDur: 6800, sub: '小新想加入棋社，學長卻故意出難題：「想進來？先連贏我三盤再說！」',
          html: scene(P(430, 260, CHESS, '', 0, .95) +
            P(280, 302, A('kid', 'sad')) + sweat(230, 195) +
            P(560, 302, A('kid', 'angry'), '', 0, 1.02, true) + bang(480, 185)) },
        { minDur: 6800, sub: '一下又說要先背棋譜、一下又叫他天天擦棋盤——用各種辦法故意為難人，就是「百般刁難」。',
          html: scene(P(300, 302, A('kid', 'sad') + P(-30, -24, '<path d="M-14 0 q7 -8 14 0 q7 8 14 0" stroke="#ffd97a" stroke-width="7" fill="none" stroke-linecap="round"/>', '', 0, .8)) +
            sweat(250, 195) + qmark(370, 180) +
            P(560, 302, A('kid', 'happy'), '', 0, 1, true)) },
        { minDur: 6800, sub: '老師知道了，對學長說：「社團應該歡迎新同學，不該刁難。」大家握手言和，一起下棋！',
          html: scene(P(430, 260, CHESS, '', 0, .9) +
            P(280, 302, A('kid', 'happy')) + P(560, 302, A('kid', 'happy'), '', 0, .98, true) + hearts(420, 190)) },
        { minDur: 6400, sub: '百般刁難：用各種辦法故意為難別人。',
          html: scene(P(300, 302, A('kid', 'sad')) + P(540, 302, A('kid', 'angry'), '', 0, 1.02, true) + qmark(420, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">百般刁難</text>') }
      ];
    },
    /* 齊頭並進 */
    i023: function () {
      var ROPE = '<line x1="-140" y1="-20" x2="140" y2="-20" stroke="#a8734a" stroke-width="7" stroke-linecap="round"/><circle cx="0" cy="-20" r="8" fill="#e85a4f"/>';
      return [
        { minDur: 6800, sub: '拔河比賽前，兩排隊員肩並著肩練習齊步走——「一、二！一、二！」步伐整整齊齊。',
          html: scene(P(240, 302, A('kid', 'happy'), 'st-strut', 0, .95) +
            P(360, 302, A('kid', 'happy'), 'st-strut', .05, .95) +
            P(480, 302, A('kid', 'happy'), 'st-strut', .1, .95) +
            P(600, 302, A('kid', 'happy'), 'st-strut', .15, .95) + notes(420, 165)) },
        { minDur: 6800, sub: '功課也能齊頭並進：數學、國語每天各練一點點，兩科一起穩穩進步！',
          html: scene(P(300, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#a5c8ff" stroke="#5c82ba" stroke-width="2" transform="rotate(-8)"/>')) +
            P(500, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#a5d47c" stroke="#7cab6e" stroke-width="2" transform="rotate(-8)"/>'), '', .2, .97) +
            '<path d="M330 220 L420 190 M530 220 L620 190" stroke="#548a40" stroke-width="4" stroke-linecap="round"/><path d="M420 190 l-12 -2 v12 z M620 190 l-12 -2 v12 z" fill="#548a40"/>') },
        { minDur: 6600, sub: '同時往前走、互相配合不掉隊——這就是「齊頭並進」！',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-strut') + P(430, 302, A('kid', 'happy'), 'st-strut', .05, .97) +
            P(560, 302, A('kid', 'happy'), 'st-strut', .1, .95) + hearts(430, 175)) },
        { minDur: 6400, sub: '齊頭並進：同時向前進行，協調一致。',
          html: scene(P(280, 302, A('kid', 'happy'), 'st-strut') + P(420, 302, A('kid', 'happy'), 'st-strut', .05, .97) +
            P(560, 302, A('kid', 'happy'), 'st-strut', .1, .95) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">齊頭並進</text>') }
      ];
    },
    /* 安居樂業 */
    i026: function () {
      var HOUSE4 = '<path d="M-40 -34 L0 -60 L40 -34 Z" fill="#8a5a33"/><rect x="-32" y="-34" width="64" height="34" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.4"/><rect x="-9" y="-24" width="18" height="24" rx="3" fill="#8a5a33"/>';
      var TABLE3 = '<ellipse cx="0" cy="-10" rx="44" ry="14" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/><line x1="-30" y1="0" x2="-30" y2="10" stroke="#a8734a" stroke-width="4"/><line x1="30" y1="0" x2="30" y2="10" stroke="#a8734a" stroke-width="4"/>' +
        '<circle cx="-14" cy="-13" r="6" fill="#fff" stroke="#c9bfa8" stroke-width="1.6"/><circle cx="10" cy="-15" r="6" fill="#fff" stroke="#c9bfa8" stroke-width="1.6"/>';
      return [
        { minDur: 6800, sub: '小鎮上，人們住得安安穩穩：白天開店的開店、種田的種田，各自忙著自己的事。',
          html: scene(P(180, 302, HOUSE4) + P(650, 302, HOUSE4, '', 0, .9) +
            P(340, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe')) +
            P(520, 302, A('kid', 'happy'), '', .2, .95)) },
        { minDur: 6800, sub: '傍晚，一家人圍著飯桌吃飯，笑聲不斷——住得安心、做事順心，就是最幸福的日子。',
          html: scene(P(430, 302, TABLE3, '', 0, 1.1) +
            P(280, 302, A('kid', 'happy'), '', 0, .95) + P(580, 302, A('kid', 'happy'), '', .2, .95, true) +
            hearts(430, 200), 'night') },
        { minDur: 6600, sub: '「安居樂業」：安定地居住、快樂地工作——人人都嚮往的生活！',
          html: scene(P(220, 302, HOUSE4) + P(600, 302, HOUSE4, '', 0, .92) +
            P(410, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .97) + hearts(480, 185)) },
        { minDur: 6400, sub: '安居樂業：住得安心，工作順利，生活滿足。',
          html: scene(P(250, 302, HOUSE4, '', 0, 1.05) + P(480, 302, A('kid', 'happy') + P(16, -30, HOE)) + hearts(560, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">安居樂業</text>') }
      ];
    },
    /* 頑強不屈 */
    i027: function () {
      var STONE4 = '<path d="M-30 0 q-8 -24 10 -30 q20 -8 34 6 q12 12 2 24 z" fill="#b0b4bf" stroke="#8b93a3" stroke-width="2.6"/>';
      var GRASS2 = '<g class="st-grow"><path d="M0 0 q-6 -22 -14 -28 M0 0 q4 -26 12 -32 M0 0 q0 -30 -2 -36" stroke="#5f8a46" stroke-width="4.6" fill="none" stroke-linecap="round"/></g>';
      var MT4 = '<path d="M-150 0 L0 -180 L150 0 Z" fill="#8fb0a0"/><path d="M0 -180 L-24 -150 L0 -140 L26 -148 Z" fill="#eef4f0"/>';
      var SNOWFX = '<g fill="#fff"><circle class="st-snow" cx="200" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1s" cx="400" cy="24" r="3.4"/><circle class="st-snow" style="animation-delay:.5s" cx="560" cy="40" r="4"/></g>';
      return [
        { minDur: 6800, sub: '牆角的小草被大石頭壓住了——它彎著腰、側著身，硬是從石縫裡鑽了出來，朝著陽光生長！',
          html: scene(P(430, 316, STONE4, '', 0, 1.2) + P(490, 318, GRASS2, '', 0, 1.2) +
            P(220, 302, A('kid', 'wow')) + hearts(300, 200)) },
        { minDur: 6800, sub: '登山隊遇上風雪也不放棄，頂著寒風，一步一步朝山頂前進！',
          html: scene(P(560, 302, MT4) + SNOWFX +
            P(300, 302, A('kid', 'angry'), 'st-strut', 0, .95) + P(420, 302, A('kid', 'angry'), 'st-strut', .2, .9) + sweat(350, 200)) },
        { minDur: 6600, sub: '再大的困難都壓不倒、不低頭認輸——這就是「頑強不屈」！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'angry') + '</g>', '', 0, 1.02) + bang(490, 190) + hearts(310, 190)) },
        { minDur: 6400, sub: '頑強不屈：堅定不屈，不肯低頭認輸。',
          html: scene(P(360, 316, STONE4, '', 0, 1.1) + P(420, 318, GRASS2, '', 0, 1.3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">頑強不屈</text>') }
      ];
    },
    /* 苦盡甘來 */
    i028: function () {
      var BIKE = '<circle cx="-24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/><circle cx="24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/>' +
        '<path d="M-24 0 L-8 -22 L14 -22 L24 0 M-8 -22 L-2 0 M14 -22 L10 -30 M-8 -22 L-14 -30 L-4 -30" stroke="#e85a4f" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '學騎腳踏車，小真摔了一次又一次，膝蓋都破皮了……好想放棄。',
          html: scene(P(430, 306, '<g transform="rotate(-16)">' + BIKE + '</g>') +
            P(300, 306, '<g class="st-faint">' + A('kid', 'sad') + '</g>') + bang(380, 230) + sweat(250, 200)) },
        { minDur: 6800, sub: '她擦擦眼淚、忍著痛繼續練——終於！車輪穩穩地滑出去，風在耳邊唱起歌來！',
          html: scene(P(400, 296, BIKE + P(-4, -32, A('kid', 'happy'), '', 0, .8), 'st-strut') +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="120" y1="240" x2="210" y2="240"/></g>' + hearts(520, 200)) },
        { minDur: 6600, sub: '辛苦到了盡頭，甜美的果實就來了——這就是「苦盡甘來」！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) +
            P(540, 302, A('kid', 'happy'), '', 0, .95) + hearts(450, 175)) },
        { minDur: 6400, sub: '苦盡甘來：辛苦過後，得到甜蜜的回報。',
          html: scene(P(400, 296, BIKE + P(-4, -32, A('kid', 'happy'), '', 0, .8), '', 0, 1.1) + hearts(520, 200) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">苦盡甘來</text>') }
      ];
    },
    /* 欣欣向榮 */
    i029: function () {
      function sprout(x, y, h, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="' + (-h) + '" stroke="#5f8a46" stroke-width="4"/>' +
          '<path d="M0 ' + (-h) + ' q-8 -8 -4 -14 M0 ' + (-h) + ' q8 -8 4 -14" stroke="#7cc47f" stroke-width="4" fill="none" stroke-linecap="round"/></g>');
      }
      var SHOP = '<rect x="-40" y="-44" width="80" height="44" rx="4" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<path d="M-46 -44 h92 l-8 -14 h-76 z" fill="#e0a458" stroke="#c08838" stroke-width="2.4"/>' +
        '<rect x="-12" y="-28" width="24" height="28" rx="3" fill="#8a5a33"/><text x="0" y="-48" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">書店</text>';
      return [
        { minDur: 6600, sub: '春天的菜園裡，種子冒出嫩芽：一天天長高、一天天變綠，生機蓬勃！',
          html: scene(sprout(240, 320, 24, 0) + sprout(340, 322, 32, .3) + sprout(440, 318, 40, .5) + sprout(540, 322, 28, .2) +
            P(660, 302, A('kid', 'happy'), '', 0, .95) + hearts(600, 210)) },
        { minDur: 6600, sub: '小鎮也一樣：新書店開張、新公園啟用，處處熱熱鬧鬧、蒸蒸日上！',
          html: scene(P(300, 302, SHOP) +
            P(520, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            P(640, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) + hearts(430, 190)) },
        { minDur: 6600, sub: '「欣欣向榮」：草木長得茂盛，也形容事業蓬勃發展、越來越好！',
          html: scene(sprout(260, 320, 34, 0) + sprout(360, 318, 42, .3) +
            P(540, 302, A('kid', 'happy')) + hearts(460, 200)) },
        { minDur: 6400, sub: '欣欣向榮：興盛發展，蓬勃成長。',
          html: scene(sprout(260, 320, 30, 0) + sprout(400, 318, 44, .3) + sprout(540, 322, 34, .5) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">欣欣向榮</text>') }
      ];
    },
    /* 披荊斬棘 */
    i030: function () {
      function thornBush(x, y, sc) {
        return P(x, y, '<g stroke="#7a6650" stroke-width="4" fill="none" stroke-linecap="round">' +
          '<path d="M-20 0 q-8 -18 -22 -22 M-8 0 q0 -24 -10 -32 M6 0 q6 -20 18 -26 M18 0 q10 -12 24 -12"/>' +
          '<path d="M-30 -14 l-5 -5 M-14 -22 l-5 -5 M14 -18 l5 -5 M30 -8 l6 -3" stroke-width="2.6"/></g>', '', 0, sc || 1);
      }
      var MACHETE = '<path d="M0 0 L28 -36 q7 -9 -1 -12 q-8 -2 -13 8 L0 0 z" fill="#c4cede" stroke="#8b93a3" stroke-width="2"/><rect x="-6" y="0" width="12" height="12" rx="3" fill="#8a5a33"/>';
      return [
        { minDur: 6800, sub: '探險隊走進荒野——前方長滿帶刺的荊棘，把路整個擋住了！',
          html: scene(thornBush(430, 318, 1.2) + thornBush(560, 320, 1) + thornBush(650, 316, .9) +
            P(240, 302, A('kid', 'wow')) + qmark(310, 185)) },
        { minDur: 6800, sub: '隊長掄起刀開路，大家跟著劈開一叢又一叢——硬是走出了一條路！',
          html: scene(thornBush(600, 318, 1) +
            P(340, 302, A('kid', 'angry') + P(28, -46, MACHETE, 'st-hoe')) + bang(470, 230) +
            P(200, 302, A('kid', 'happy'), '', .3, .9) +
            '<path d="M120 316 q140 10 280 6" stroke="#e8dcc0" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 10"/>') },
        { minDur: 6600, sub: '克服一重又一重的困難、開出新的道路——這就是「披荊斬棘」！',
          html: scene(P(340, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(500, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .93) + hearts(420, 175)) },
        { minDur: 6400, sub: '披荊斬棘：克服困難，勇往直前開創局面。',
          html: scene(thornBush(560, 318, 1.1) + P(320, 302, A('kid', 'angry') + P(28, -46, MACHETE)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">披荊斬棘</text>') }
      ];
    },
    /* 爭先恐後 */
    i211: function () {
      return [
        { minDur: 6600, sub: '「叮——」下課鈴一響，大家爭先恐後衝向操場，誰都不想落在最後！',
          html: scene(P(260, 302, A('kid', 'happy'), 'st-dashL', 0, 1) +
            P(400, 302, A('kid', 'happy'), 'st-dashL', .1, .95) +
            P(540, 302, A('kid', 'happy'), 'st-dashL', .2, .9) + bang(180, 200) + sweat(470, 195)) },
        { minDur: 6800, sub: '排隊打飯也你擠我、我擠你，搶成一團——其實排好隊，反而更快呀！',
          html: scene(P(330, 302, A('kid', 'wow')) + P(430, 302, A('kid', 'wow'), '', 0, .95, true) +
            bang(385, 195) + sweat(280, 195) +
            P(620, 302, A('kid', 'happy'), '', 0, .9) + hearts(680, 200)) },
        { minDur: 6600, sub: '「爭先恐後」：爭著搶第一，唯恐落在後面。',
          html: scene(P(280, 302, A('kid', 'happy'), 'st-dashL', 0, 1.02) +
            P(430, 302, A('kid', 'happy'), 'st-dashL', .1, .95) + sweat(500, 195)) },
        { minDur: 6400, sub: '爭先恐後：爭著搶先，唯恐落後。',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-dashL', 0, 1.05) + P(460, 302, A('kid', 'happy'), 'st-dashL', .15, .95) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">爭先恐後</text>') }
      ];
    },
    /* 一模一樣 */
    i212: function () {
      function portrait(x) {
        return P(x, 280, '<rect x="-36" y="-46" width="72" height="88" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
          '<circle cx="0" cy="-14" r="17" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>' +
          '<path d="M-17 -18 Q-14 -32 0 -32 Q14 -32 17 -18 Q8 -25 0 -24 Q-8 -25 -17 -18 Z" fill="#6b4a32"/>' +
          '<circle cx="-6" cy="-13" r="2.4" fill="#3a2e26"/><circle cx="6" cy="-13" r="2.4" fill="#3a2e26"/>' +
          '<path d="M-4 -5 Q0 -2 4 -5" stroke="#3a2e26" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
          '<circle cx="-10" cy="-6" r="2" fill="#ffb3a3"/><circle cx="10" cy="-6" r="2" fill="#ffb3a3"/>');
      }
      return [
        { minDur: 6800, sub: '美術課畫自畫像。雙胞胎小雙和小胞交出作品——連畫出來的臉都一模一樣！',
          html: scene(portrait(300) + portrait(500) +
            P(150, 302, A('kid', 'happy'), '', 0, .9) + qmark(400, 170)) },
        { minDur: 6600, sub: '老師左看右看，還是分不出誰是誰：「你們連笑起來的酒窩，都長在同一邊呀！」',
          html: scene(P(300, 302, A('kid', 'happy')) + P(440, 302, A('kid', 'happy'), '', 0, 1) +
            P(620, 302, A('kid', 'wow'), '', 0, 1.02, true) + qmark(670, 185) + sweat(580, 200)) },
        { minDur: 6600, sub: '「一模一樣」：完全相同，一點差別也沒有！',
          html: scene(P(320, 302, A('kid', 'happy')) + P(480, 302, A('kid', 'happy')) + hearts(400, 172)) },
        { minDur: 6400, sub: '一模一樣：完全相同，沒有差別。',
          html: scene(portrait(310) + portrait(490) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一模一樣</text>') }
      ];
    },
    /* 日積月累 */
    i214: function () {
      function card(x, y, txt, rot) {
        return P(x, y, '<rect x="-16" y="-11" width="32" height="22" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(' + rot + ')"/>' +
          '<text x="0" y="4" text-anchor="middle" font-size="10" fill="#5c82ba" transform="rotate(' + rot + ')">' + txt + '</text>');
      }
      return [
        { minDur: 6600, sub: '小語每天背三個英文單字：一天一點點，從不間斷。',
          html: scene(P(340, 302, A('kid', 'happy')) +
            card(470, 270, 'cat', -6) + card(520, 285, 'sun', 5) + card(560, 265, 'run', -3) + hearts(270, 190)) },
        { minDur: 6800, sub: '一年過去，她已經認得一千多個單字，開口說英語，讓大家嚇了一跳！',
          html: scene(P(300, 302, A('kid', 'happy')) +
            card(450, 250, 'apple', -5) + card(500, 268, 'book', 4) + card(548, 248, 'blue', -2) + card(478, 288, 'fish', 6) + card(540, 290, 'jump', -4) +
            P(650, 302, A('kid', 'wow'), '', 0, .92) + bang(590, 190)) },
        { minDur: 6800, sub: '長時間一點一滴地累積，就是「日積月累」——它和「積少成多」是好朋友！',
          html: scene(P(340, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>')) + hearts(460, 185)) },
        { minDur: 6400, sub: '日積月累：長時間一點一滴地累積。',
          html: scene(card(300, 260, 'day', -5) + card(400, 245, 'by', 3) + card(500, 262, 'day', -3) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">日積月累</text>') }
      ];
    },
    /* 歡天喜地 */
    i215: function () {
      var TROPHY = '<path d="M-14 -34 h28 v10 q0 14 -14 16 q-14 -2 -14 -16 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/>' +
        '<path d="M-14 -30 q-12 0 -10 12 q2 8 10 6 M14 -30 q12 0 10 12 q-2 8 -10 6" stroke="#e8b84a" stroke-width="2.6" fill="none"/>' +
        '<rect x="-4" y="-8" width="8" height="8" fill="#c98f2a"/><rect x="-12" y="0" width="24" height="6" rx="2.4" fill="#c98f2a"/>';
      function confettiDots() {
        return '<g><circle class="st-tw" cx="250" cy="140" r="4" fill="#ff9eb5"/><circle class="st-tw" style="animation-delay:.3s" cx="380" cy="110" r="4" fill="#ffd97a"/>' +
          '<circle class="st-tw" style="animation-delay:.6s" cx="520" cy="145" r="4" fill="#a5c8ff"/><circle class="st-tw" style="animation-delay:.2s" cx="450" cy="90" r="3.4" fill="#a5d47c"/></g>';
      }
      return [
        { minDur: 6600, sub: '好消息！我們班拿下整潔比賽冠軍！獎盃亮晶晶地捧回教室——',
          html: scene(P(400, 290, TROPHY, '', 0, 1.3) + confettiDots() +
            P(250, 302, A('kid', 'wow')) + bang(480, 210)) },
        { minDur: 6600, sub: '大家又叫又跳、擊掌歡呼，整間教室都是笑聲！',
          html: scene(confettiDots() +
            P(260, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(420, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            P(570, 302, '<g class="st-cheer" style="animation-delay:.4s">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            hearts(340, 165) + notes(500, 160)) },
        { minDur: 6600, sub: '高興得像天地都在跟著慶祝——這就是「歡天喜地」！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) +
            confettiDots() + hearts(480, 185) + hearts(310, 190)) },
        { minDur: 6400, sub: '歡天喜地：非常歡喜快樂。',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + P(520, 290, TROPHY, '', 0, 1) + confettiDots() +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">歡天喜地</text>') }
      ];
    },
    /* 全神貫注 */
    i216: function () {
      var MODEL2 = '<rect x="-18" y="-14" width="36" height="14" rx="3" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2"/><rect x="-10" y="-26" width="20" height="12" rx="3" fill="#a5c8ff" stroke="#6d87ab" stroke-width="2"/>';
      var TWEEZER = '<path d="M0 0 L14 -22 M2 2 L18 -18" stroke="#8b93a3" stroke-width="2.6" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '小宇組裝小小的飛機模型：捏著鑷子、屏住呼吸，眼睛一眨也不眨——',
          html: scene(P(360, 302, A('kid', 'happy') + P(28, -40, TWEEZER)) +
            P(480, 292, MODEL2, '', 0, 1) + qmark(280, 185)) },
        { minDur: 6600, sub: '窗外的吵鬧聲、電視聲，他統統聽不見——全部精神都放在模型上！',
          html: scene(P(360, 302, A('kid', 'happy') + P(28, -40, TWEEZER)) + P(480, 292, MODEL2, '', 0, 1) +
            notes(150, 160) + bang(120, 220) + '<circle cx="420" cy="250" r="120" fill="none" stroke="#ffd97a" stroke-width="3" stroke-dasharray="10 10" opacity=".7"/>') },
        { minDur: 6600, sub: '把全部精神集中在一件事情上，就是「全神貫注」——做事最容易成功的祕訣！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(500, 280, MODEL2, '', 0, 1.2) + hearts(430, 185)) },
        { minDur: 6400, sub: '全神貫注：全部精神集中在一件事上。',
          html: scene(P(380, 302, A('kid', 'happy') + P(28, -40, TWEEZER), '', 0, 1.05) + P(510, 288, MODEL2, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">全神貫注</text>') }
      ];
    },
    /* 無憂無慮 */
    i217: function () {
      return [
        { minDur: 6600, sub: '暑假第一天！小樂躺在草地上看雲，藍天白雲，微風輕輕吹——',
          html: scene(P(400, 316, '<g transform="rotate(76)">' + A('kid', 'happy') + '</g>') +
            '<g class="st-cloud"><ellipse cx="250" cy="100" rx="40" ry="16" fill="#fff"/><ellipse cx="222" cy="108" rx="22" ry="11" fill="#fff"/><ellipse cx="278" cy="108" rx="24" ry="12" fill="#fff"/></g>' +
            hearts(500, 240)) },
        { minDur: 6600, sub: '沒有考試、沒有煩惱，心裡輕飄飄的，像雲一樣自在。',
          html: scene(P(360, 302, A('kid', 'happy'), 'st-strut') + P(560, 200, A('butterfly'), '', 0, .95) +
            notes(280, 170) + hearts(470, 190)) },
        { minDur: 6600, sub: '「無憂無慮」：沒有煩惱、沒有憂愁——最輕鬆快樂的樣子！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) + hearts(490, 185) + notes(310, 175)) },
        { minDur: 6400, sub: '無憂無慮：沒有煩惱和憂愁。',
          html: scene(P(400, 316, '<g transform="rotate(76)">' + A('kid', 'happy') + '</g>') + hearts(500, 250) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">無憂無慮</text>') }
      ];
    },
    /* 自由自在 */
    i218: function () {
      var SEA7 = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 274 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>';
      return [
        { minDur: 6600, sub: '小魚在水裡游來游去，想去哪就去哪；小鳥在天上飛高飛低，多麼快活！',
          html: scene(SEA7 + P(300, 300, A('fish')) + P(480, 296, A('fish'), '', .3, .85, true) +
            P(560, 150, A('bird')) + P(250, 130, A('bird'), '', .4, .85, true)) },
        { minDur: 6600, sub: '假日的午後，騎著車在河堤上兜風——不受拘束、想快就快、想停就停！',
          html: scene(P(400, 296, '<circle cx="-24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/><circle cx="24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/><path d="M-24 0 L-8 -22 L14 -22 L24 0 M-8 -22 L-2 0" stroke="#e85a4f" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
              P(-4, -32, A('kid', 'happy'), '', 0, .8), 'st-strut') +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="120" y1="230" x2="210" y2="230"/></g>' + hearts(520, 200)) },
        { minDur: 6600, sub: '「自由自在」：不受拘束、安然舒適的樣子！',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-strut') + P(560, 170, A('bird')) + P(180, 200, A('butterfly'), '', .3, .9) + hearts(430, 185)) },
        { minDur: 6400, sub: '自由自在：不受拘束、安然舒適的樣子。',
          html: scene(SEA7 + P(320, 298, A('fish')) + P(540, 160, A('bird')) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">自由自在</text>') }
      ];
    },
    /* 垂頭喪氣 */
    i220: function () {
      return [
        { minDur: 6600, sub: '球賽輸了……小威低著頭、拖著腳步走回家，連書包都好像變重了。',
          html: scene(P(360, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, 1.02) +
            sweat(310, 198) + qmark(430, 185)) },
        { minDur: 6600, sub: '低著頭、無精打采——這副失意沮喪的樣子，就是「垂頭喪氣」。',
          html: scene(P(300, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') +
            P(520, 302, A('kid', 'happy'), '', 0, .95, true) + qmark(440, 185)) },
        { minDur: 6800, sub: '爸爸拍拍他的肩：「輸了再練就好！」小威抬起頭，決定明天繼續加油！',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(470, 302, A('kid', 'happy'), '', 0, 1.08, true) + hearts(390, 175) + bang(560, 200)) },
        { minDur: 6400, sub: '垂頭喪氣：低著頭無精打采，失意沮喪。',
          html: scene(P(380, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, 1.05) + sweat(440, 195) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">垂頭喪氣</text>') }
      ];
    },
    /* 理直氣壯 */
    i219: function () {
      var PEN = '<line x1="0" y1="0" x2="14" y2="-26" stroke="#5c82ba" stroke-width="4" stroke-linecap="round"/><path d="M14 -26 l4 -8 l3 8 z" fill="#2c4a75"/>';
      return [
        { minDur: 6800, sub: '「你是不是拿了我的筆？」小平被冤枉了——可是他一點也不慌。',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(540, 302, A('kid', 'angry'), '', 0, 1, true) + qmark(440, 180) + bang(590, 195)) },
        { minDur: 6800, sub: '他挺起胸膛、聲音響亮：「我的筆有刻名字，你看！」證據一亮出來，大家都明白了。',
          html: scene(P(300, 302, A('kid', 'happy') + P(34, -60, PEN, '', 0, 1.1)) + bang(400, 180) +
            P(540, 302, A('kid', 'wow'), '', 0, .97, true) + sweat(580, 200)) },
        { minDur: 6600, sub: '理由正當充分，說話自然有氣勢——這就是「理直氣壯」！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) + hearts(450, 180)) },
        { minDur: 6400, sub: '理直氣壯：理由正當充分，說話有氣勢。',
          html: scene(P(380, 302, A('kid', 'happy'), '', 0, 1.05) + bang(470, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">理直氣壯</text>') }
      ];
    },
    /* 眉開眼笑 */
    i221: function () {
      var CARD2 = '<rect x="-20" y="-26" width="40" height="52" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<path d="M-6 -10 q-8 -10 0 -12 q5 -1 6 6 q1 -7 6 -6 q8 2 0 12 l-6 7 z" fill="#ff9eb5"/>' +
        '<path d="M-12 10 h24 M-12 18 h16" stroke="#8fa3bf" stroke-width="2"/>';
      var SMILEBROWS = '<path d="M-14 -62 q6 -5 12 0 M2 -62 q6 -5 12 0" stroke="#3a2e26" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '孫子親手畫了一張卡片送給爺爺：「爺爺，謝謝您每天接我放學！」',
          html: scene(P(300, 302, A('kid', 'happy') + P(38, -56, CARD2, '', 0, .9)) +
            P(520, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.08, true) + hearts(420, 180)) },
        { minDur: 6600, sub: '爺爺一看，眉毛舒展開、眼睛瞇成一條線，滿臉都是笑容！',
          html: scene(P(430, 302, A('kid', 'happy') + SMILEBROWS +
              '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.15) +
            hearts(520, 180) + hearts(330, 190)) },
        { minDur: 6600, sub: '「眉開眼笑」：眉眼舒展、滿臉笑容——高興全寫在臉上！',
          html: scene(P(320, 302, A('kid', 'happy') + SMILEBROWS) +
            P(500, 302, A('kid', 'happy') + SMILEBROWS, '', 0, .95) + hearts(410, 172)) },
        { minDur: 6400, sub: '眉開眼笑：眉眼舒展，滿臉笑容。',
          html: scene(P(400, 302, A('kid', 'happy') + SMILEBROWS, '', 0, 1.15) + hearts(500, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">眉開眼笑</text>') }
      ];
    },
    /* 異口同聲 */
    i222: function () {
      function bub3(x, y, txt, dly) {
        return P(x, y, '<g' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<path d="M-22 -13 a19 15 0 1 1 38 5 q-2 6 -9 7 l-9 8 l1 -8 q-18 -2 -19 -12 z" fill="#fff" stroke="#c9bfa8" stroke-width="2.2"/>' +
          '<text x="-2" y="-2" text-anchor="middle" font-size="13" font-weight="bold" fill="#e85a4f">' + txt + '</text></g>');
      }
      return [
        { minDur: 6800, sub: '老師問：「這個週末，要不要加開一次戶外教學呀？」',
          html: scene(P(180, 302, A('kid', 'happy'), '', 0, 1.05) + qmark(240, 185) +
            P(400, 302, A('kid', 'happy'), '', 0, .9) + P(520, 302, A('kid', 'happy'), '', .1, .88) + P(640, 302, A('kid', 'happy'), '', .2, .86)) },
        { minDur: 6600, sub: '「要——！」全班不約而同，同一秒喊出同一個字，聲音大得屋頂都快掀了！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            P(480, 302, '<g class="st-cheer" style="animation-delay:.05s">' + A('kid', 'happy') + '</g>', '', 0, .92) +
            P(600, 302, '<g class="st-cheer" style="animation-delay:.1s">' + A('kid', 'happy') + '</g>', '', 0, .9) +
            bub3(360, 170, '要!', 0) + bub3(480, 155, '要!', .05) + bub3(600, 170, '要!', .1)) },
        { minDur: 6600, sub: '大家不約而同說出同樣的話——這就是「異口同聲」！',
          html: scene(P(330, 302, A('kid', 'happy')) + P(470, 302, A('kid', 'happy'), '', .1, .95) +
            bub3(330, 172, '好!', 0) + bub3(470, 168, '好!', .05) + hearts(400, 230)) },
        { minDur: 6400, sub: '異口同聲：大家不約而同說出同樣的話。',
          html: scene(P(300, 302, A('kid', 'happy')) + P(430, 302, A('kid', 'happy'), '', .05, .95) + P(560, 302, A('kid', 'happy'), '', .1, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">異口同聲</text>') }
      ];
    },
    /* 川流不息 */
    i223: function () {
      function car2(x, y, color, dly) {
        return P(x, y, '<g class="st-windln"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<rect x="-20" y="-14" width="40" height="12" rx="5" fill="' + color + '"/>' +
          '<rect x="-11" y="-23" width="22" height="11" rx="4" fill="#e8f0f8"/>' +
          '<circle cx="-11" cy="0" r="5.4" fill="#3a2e26"/><circle cx="11" cy="0" r="5.4" fill="#3a2e26"/></g>');
      }
      var ROAD = '<rect y="290" width="800" height="26" fill="#8b93a3"/><g stroke="#fff" stroke-width="3" stroke-dasharray="20 16"><line x1="0" y1="303" x2="800" y2="303"/></g>';
      return [
        { minDur: 6600, sub: '放學時間的馬路上，車一輛接著一輛，像河水一樣流動不停——',
          html: scene(ROAD + car2(180, 292, '#e85a4f', 0) + car2(330, 292, '#5c82ba', .3) + car2(480, 292, '#6fae58', .6) + car2(630, 292, '#e0a458', .2) +
            P(100, 302, A('kid', 'wow'), '', 0, .85)) },
        { minDur: 6600, sub: '車站的人潮也是：進站的、出站的，一波接一波，從早到晚沒停過。',
          html: scene(P(240, 302, A('kid', 'happy'), 'st-inL', 0, .92) + P(360, 302, A('kid', 'happy'), 'st-inL', .2, .88) +
            P(500, 302, A('kid', 'happy'), 'st-inR', .1, .9, true) + P(630, 302, A('kid', 'happy'), 'st-inR', .3, .86, true)) },
        { minDur: 6600, sub: '「川」就是河流——像河水一樣往來不斷，就叫「川流不息」！',
          html: scene('<rect y="270" width="800" height="70" fill="#7fb2e0"/>' +
            '<g class="st-wavemove"><path d="M-40 285 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>' +
            P(300, 296, A('kid', 'happy'), '', 0, .95) + qmark(380, 190)) },
        { minDur: 6400, sub: '川流不息：像河水流動不停，人車往來不斷。',
          html: scene(ROAD + car2(240, 292, '#5c82ba', 0) + car2(420, 292, '#e85a4f', .3) + car2(600, 292, '#6fae58', .5) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">川流不息</text>') }
      ];
    },
    /* 風和日麗 */
    i224: function () {
      var KITE = '<path d="M0 0 L16 -20 L0 -40 L-16 -20 Z" fill="#ff9eb5" stroke="#e07ba3" stroke-width="2.4"/>' +
        '<path d="M0 0 q4 12 -2 22 q-5 8 -1 16" stroke="#e07ba3" stroke-width="2" fill="none"/>';
      return [
        { minDur: 6600, sub: '今天的天氣真好：微風輕輕吹、太陽亮晶晶，天空藍得像洗過一樣！',
          html: scene('<g stroke="#e8f4fb" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"><path class="st-windln" d="M100 130 q60 -14 120 0"/></g>' +
            P(360, 302, A('kid', 'happy'), 'st-strut') + hearts(450, 190)) },
        { minDur: 6600, sub: '這麼好的天氣，最適合野餐、放風箏——風箏乘著微風，越飛越高！',
          html: scene(P(560, 140, KITE, 'st-zfloat', 0, 1.2) +
            '<path d="M560 180 Q480 260 400 280" stroke="#c9bfa8" stroke-width="2" fill="none"/>' +
            P(380, 302, A('kid', 'happy')) + hearts(300, 195)) },
        { minDur: 6600, sub: '「風和日麗」：微風和暢、陽光明麗——形容晴朗美好的天氣！',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-strut') + P(500, 302, A('kid', 'happy'), 'st-strut', .2, .93) +
            P(640, 210, A('butterfly'), '', 0, .9) + hearts(420, 185)) },
        { minDur: 6400, sub: '風和日麗：微風和暢，陽光明麗，天氣晴好。',
          html: scene(P(540, 150, KITE, 'st-zfloat', 0, 1.1) + P(340, 302, A('kid', 'happy'), 'st-strut') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">風和日麗</text>') }
      ];
    },
    /* 千軍萬馬 */
    i415: function () {
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      var FLAG = '<line x1="0" y1="0" x2="0" y2="-56" stroke="#a8734a" stroke-width="4"/><path d="M0 -56 h30 l-8 8 l8 8 h-30 z" fill="#e85a4f"/>';
      return [
        { minDur: 6800, sub: '站上城樓往下望：旌旗獵獵、萬馬奔騰，士兵一排接一排，一眼望不到盡頭！',
          html: scene(P(200, 302, A('horse'), 'st-strut', 0, .95) + P(340, 302, A('horse'), 'st-strut', .15, .9) + P(480, 302, A('horse'), 'st-strut', .3, .85) +
            P(600, 302, A('kid', 'angry') + P(0, -60, FLAG), '', 0, .9) +
            P(700, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', .2, .85)) },
        { minDur: 6600, sub: '兵馬眾多、聲勢浩大——這樣的陣仗，就是「千軍萬馬」！',
          html: scene(P(240, 302, A('horse'), 'st-strut', 0, 1) + P(400, 302, A('horse'), 'st-strut', .15, .95) +
            P(560, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-strut', .3, .9) + bang(680, 220)) },
        { minDur: 6800, sub: '現在也形容氣勢驚人：運動會進場時，全校的隊伍浩浩蕩蕩，有如千軍萬馬！',
          html: scene(P(240, 302, A('kid', 'happy') + P(0, -60, FLAG), 'st-strut') +
            P(380, 302, A('kid', 'happy'), 'st-strut', .1, .95) + P(500, 302, A('kid', 'happy'), 'st-strut', .2, .9) +
            P(620, 302, A('kid', 'happy'), 'st-strut', .3, .85) + notes(430, 165)) },
        { minDur: 6400, sub: '千軍萬馬：兵馬眾多，聲勢浩大。',
          html: scene(P(260, 302, A('horse'), 'st-strut', 0, 1.05) + P(430, 302, A('horse'), 'st-strut', .15, .95) + P(590, 302, A('horse'), 'st-strut', .3, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千軍萬馬</text>') }
      ];
    },
    /* 萬眾一心 */
    i416: function () {
      var ROPE2 = '<line x1="-160" y1="-22" x2="160" y2="-22" stroke="#a8734a" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="-22" r="9" fill="#e85a4f"/>';
      var HEART2 = '<path d="M0 6 C-8 -6 -22 2 -12 14 L0 24 L12 14 C22 2 8 -6 0 6 Z" fill="#ff7b9c"/>';
      return [
        { minDur: 6800, sub: '拔河決賽！全班握緊繩子，喊著同一個節奏：「一、二，嘿呦！一、二，嘿呦！」',
          html: scene(P(400, 302, ROPE2) +
            P(240, 302, A('kid', 'angry'), '', 0, .95) + P(340, 302, A('kid', 'angry'), '', .05, .93) +
            P(470, 302, A('kid', 'angry'), '', .1, .93) + P(570, 302, A('kid', 'angry'), '', .15, .95) +
            notes(400, 165) + sweat(300, 200)) },
        { minDur: 6600, sub: '所有人的力氣往同一個方向使、所有人的心跳同一個節拍——繩子一寸寸被拉了過來，贏了！',
          html: scene(P(400, 190, HEART2, '', 0, 1.6) +
            P(280, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(430, 302, '<g class="st-cheer" style="animation-delay:.15s">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            P(570, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .9) + bang(650, 200)) },
        { minDur: 6600, sub: '「萬眾一心」：眾人同一條心、協力合作——再難的事也能完成！',
          html: scene(P(400, 200, HEART2, '', 0, 1.4) +
            P(300, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', .15, .95) + hearts(400, 260)) },
        { minDur: 6400, sub: '萬眾一心：眾人同心協力。',
          html: scene(P(400, 210, HEART2, '', 0, 1.7) +
            P(270, 302, A('kid', 'happy')) + P(400, 302, A('kid', 'happy'), '', .1, .95) + P(530, 302, A('kid', 'happy'), '', .2, .92) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">萬眾一心</text>') }
      ];
    },
    /* 眾志成城 */
    i417: function () {
      var SANDBAGS = '<g fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"><ellipse cx="-40" cy="-8" rx="20" ry="11"/><ellipse cx="0" cy="-8" rx="20" ry="11"/><ellipse cx="40" cy="-8" rx="20" ry="11"/><ellipse cx="-20" cy="-24" rx="20" ry="11"/><ellipse cx="20" cy="-24" rx="20" ry="11"/><ellipse cx="0" cy="-40" rx="20" ry="11"/></g>';
      var WALLCITY = '<rect x="-90" y="-60" width="180" height="60" fill="#b0a390" stroke="#8a7a66" stroke-width="3"/>' +
        '<path d="M-90 -60 h22 v-13 h23 v13 h22 v-13 h23 v13 h22 v-13 h23 v13 h23" fill="none" stroke="#8a7a66" stroke-width="3"/>';
      return [
        { minDur: 6800, sub: '颱風要來了，河水一直漲！村裡的人全出動：傳沙包的傳沙包、堆沙包的堆沙包——',
          html: scene('<rect y="286" width="800" height="54" fill="#7fb2e0"/>' +
            P(430, 316, SANDBAGS) +
            P(220, 302, A('kid', 'angry'), '', 0, .95) + P(620, 302, A('kid', 'angry'), '', .2, .92, true) + sweat(300, 200)) },
        { minDur: 6600, sub: '一袋又一袋、一層又一層——沙包牆越堆越高，洪水終於被擋住了！',
          html: scene('<rect y="292" width="800" height="48" fill="#7fb2e0"/>' +
            P(430, 314, SANDBAGS, '', 0, 1.25) + bang(560, 220) +
            P(240, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .95) + hearts(320, 195)) },
        { minDur: 6800, sub: '眾人的意志聚在一起，就像一座堅固的城牆——「眾志成城」，沒有攻不破的難關！',
          html: scene(P(430, 302, WALLCITY, '', 0, 1) +
            P(240, 302, A('kid', 'happy'), '', 0, .92) + P(620, 302, A('kid', 'happy'), '', .2, .9, true) + hearts(430, 200)) },
        { minDur: 6400, sub: '眾志成城：眾人齊心，力量堅固如城。',
          html: scene(P(430, 302, WALLCITY, '', 0, 1.1) + P(240, 302, A('kid', 'happy')) + P(620, 302, A('kid', 'happy'), '', .2, .95, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">眾志成城</text>') }
      ];
    },
    /* 風平浪靜 */
    i418: function () {
      var CALMSEA = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
        '<g stroke="#a8d4ee" stroke-width="4" stroke-linecap="round" opacity=".8"><line x1="120" y1="285" x2="240" y2="285"/><line x1="380" y1="300" x2="520" y2="300"/><line x1="580" y1="280" x2="700" y2="280"/></g>';
      var STORMSEA = '<rect y="252" width="800" height="88" fill="#5a7fa8"/>' +
        '<g class="st-wavemove"><path d="M-40 268 q30 -22 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#8fb2d4" stroke-width="10" stroke-linecap="round"/></g>';
      var SAIL = '<path d="M-46 0 L46 0 L34 16 L-34 16 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>' +
        '<line x1="0" y1="0" x2="0" y2="-66" stroke="#8a5a33" stroke-width="4"/>' +
        '<path d="M0 -66 Q34 -46 0 -8 Z" fill="#fff" stroke="#d5cfc0" stroke-width="2.4"/>';
      return [
        { minDur: 6600, sub: '昨夜狂風大浪，小船在海上搖得像鞦韆，大家嚇得緊緊抓住船舷！',
          html: scene(STORMSEA + P(400, 262, '<g transform="rotate(-10)">' + SAIL + '</g>') + sweat(480, 190) +
            '<g stroke="#e8f4fb" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"><path class="st-windln" d="M100 120 q60 -18 120 0"/><path class="st-windln" style="animation-delay:.5s" d="M500 100 q70 -16 130 2"/></g>', 'night') },
        { minDur: 6600, sub: '天亮了，風停了、浪也平了——海面像鏡子一樣平靜，太陽照得閃閃發亮。',
          html: scene(CALMSEA + P(400, 268, SAIL) + hearts(520, 200)) },
        { minDur: 6800, sub: '「風平浪靜」除了形容海面，也比喻事情平息、恢復平靜——吵完架和好了，教室又風平浪靜啦！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(400, 178)) },
        { minDur: 6400, sub: '風平浪靜：沒有風浪，平靜無事。',
          html: scene(CALMSEA + P(430, 268, SAIL, '', 0, 1.05) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">風平浪靜</text>') }
      ];
    },
    /* 花好月圓 */
    i419: function () {
      var FULLMOON = '<circle cx="0" cy="0" r="34" fill="#f4f1de" stroke="#d8d4bd" stroke-width="3"/><circle cx="-8" cy="-6" r="4" fill="#d8d4bd" opacity=".6"/><circle cx="10" cy="8" r="5" fill="#d8d4bd" opacity=".5"/>';
      function flower3(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="-16" stroke="#5f8a46" stroke-width="3"/>' +
          '<circle cx="0" cy="-22" r="5" fill="' + color + '"/><circle cx="-6" cy="-18" r="5" fill="' + color + '"/><circle cx="6" cy="-18" r="5" fill="' + color + '"/><circle cx="0" cy="-14" r="5" fill="' + color + '"/><circle cx="0" cy="-18" r="3.4" fill="#ffe066"/></g>');
      }
      var MOONCAKE = '<circle cx="0" cy="0" r="14" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"/><circle cx="0" cy="0" r="8" fill="none" stroke="#a8734a" stroke-width="1.6"/><circle cx="0" cy="0" r="3" fill="#a8734a"/>';
      return [
        { minDur: 6600, sub: '中秋夜，圓圓的月亮掛上天空；院子裡的桂花、月季也開得正好——',
          html: scene(P(600, 100, FULLMOON) +
            flower3(200, 320, '#ff9eb5', 0) + flower3(300, 318, '#ffd97a', .3) +
            P(450, 302, A('kid', 'happy'), '', 0, .95), 'night') },
        { minDur: 6600, sub: '全家人圍坐在一起賞月、吃月餅，說說笑笑，多麼圓滿幸福！',
          html: scene(P(600, 100, FULLMOON) +
            P(300, 302, A('kid', 'happy')) + P(450, 302, A('kid', 'happy'), '', .2, 1.02, true) +
            P(380, 280, MOONCAKE, '', 0, 1.1) + hearts(380, 190), 'night') },
        { minDur: 6600, sub: '「花好月圓」：花開得好、月亮圓滿——比喻美好圓滿，常用來祝福！',
          html: scene(P(560, 110, FULLMOON, '', 0, .95) + flower3(240, 320, '#ff9eb5', 0) + flower3(340, 318, '#c9a8e0', .3) +
            hearts(430, 200), 'night') },
        { minDur: 6400, sub: '花好月圓：花開得好、月亮圓滿，美好圓滿。',
          html: scene(P(560, 110, FULLMOON) + flower3(240, 320, '#ff9eb5', 0) + flower3(350, 322, '#ffd97a', .3) +
            '<text x="400" y="240" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">花好月圓</text>', 'night') }
      ];
    },
    /* 秋高氣爽 */
    i420: function () {
      function mapleLeaf(x, y, dly) {
        return P(x, y, '<g class="st-snow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<path d="M0 -10 L3 -3 L10 -6 L5 0 L10 6 L3 3 L0 10 L-3 3 L-10 6 L-5 0 L-10 -6 L-3 -3 Z" fill="#e0a458"/></g>');
      }
      return [
        { minDur: 6600, sub: '秋天到了！天空又高又藍，空氣涼涼爽爽，深呼吸一口，全身都舒暢！',
          html: scene(mapleLeaf(250, 130, 0) + mapleLeaf(450, 100, .5) + mapleLeaf(600, 150, .9) +
            P(360, 302, A('kid', 'happy'), 'st-strut') + hearts(460, 195)) },
        { minDur: 6600, sub: '這種天氣最適合爬山、遠足——站上山頂眺望，視野好得不得了！',
          html: scene(P(620, 302, '<path d="M-120 0 L0 -140 L120 0 Z" fill="#a5c2b2"/>') +
            P(300, 302, A('kid', 'happy'), 'st-strut') + P(430, 302, A('kid', 'happy'), 'st-strut', .2, .93) + mapleLeaf(200, 140, 0)) },
        { minDur: 6600, sub: '「秋高氣爽」：秋天天空晴朗、氣候涼爽宜人！',
          html: scene(mapleLeaf(280, 140, 0) + mapleLeaf(500, 110, .4) +
            P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) + hearts(490, 190)) },
        { minDur: 6400, sub: '秋高氣爽：秋天天空晴朗，氣候涼爽宜人。',
          html: scene(mapleLeaf(260, 130, 0) + mapleLeaf(430, 100, .4) + mapleLeaf(580, 150, .7) +
            '<text x="400" y="270" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">秋高氣爽</text>') }
      ];
    },
    /* 冰天雪地 */
    i421: function () {
      var SNOWSCAPE = '<g fill="#fff"><circle class="st-snow" cx="160" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1.2s" cx="330" cy="20" r="3.4"/><circle class="st-snow" style="animation-delay:.5s" cx="470" cy="36" r="4"/><circle class="st-snow" style="animation-delay:1.7s" cx="600" cy="24" r="3"/></g>' +
        '<ellipse cx="400" cy="330" rx="420" ry="42" fill="#fff" opacity=".95"/>';
      var SNOWMAN = '<circle cx="0" cy="-16" r="18" fill="#fff" stroke="#d5e4ee" stroke-width="2.6"/><circle cx="0" cy="-44" r="13" fill="#fff" stroke="#d5e4ee" stroke-width="2.6"/>' +
        '<circle cx="-4" cy="-46" r="1.8" fill="#3a2e26"/><circle cx="4" cy="-46" r="1.8" fill="#3a2e26"/>' +
        '<path d="M-1 -42 l-7 2 l7 2 z" fill="#f5a742"/>' +
        '<path d="M-14 -56 a14 8 0 0 1 28 0 z" fill="#e85a4f"/>';
      return [
        { minDur: 6600, sub: '北方的冬天，放眼望去白茫茫一片：地上結冰、天上飄雪，呼出的氣都變成白霧！',
          html: scene(SNOWSCAPE + P(360, 300, A('kid', 'wow')) + sweat(300, 195), 'night') },
        { minDur: 6600, sub: '大家穿上厚外套，堆雪人、打雪仗——冰天雪地裡也有滿滿的樂趣！',
          html: scene(SNOWSCAPE + P(500, 300, SNOWMAN, '', 0, 1.2) +
            P(300, 300, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(400, 200)) },
        { minDur: 6600, sub: '「冰天雪地」：冰雪遍布、非常寒冷的景象！',
          html: scene(SNOWSCAPE + P(430, 300, SNOWMAN, '', 0, 1) + P(260, 300, A('kid', 'happy'))) },
        { minDur: 6400, sub: '冰天雪地：冰雪遍布，非常寒冷的景象。',
          html: scene(SNOWSCAPE + P(480, 300, SNOWMAN, '', 0, 1.15) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">冰天雪地</text>') }
      ];
    },
    /* 寒風刺骨 */
    i422: function () {
      var WINDCOLD = '<g stroke="#d5e8f5" stroke-width="5" fill="none" stroke-linecap="round" opacity=".95">' +
        '<path class="st-windln" d="M60 140 q60 -18 120 0 q30 9 52 -4"/><path class="st-windln" style="animation-delay:.6s" d="M120 190 q70 -16 130 2 q26 8 48 -6"/>' +
        '<path class="st-windln" style="animation-delay:1s" d="M80 240 q60 -14 120 0"/></g>';
      return [
        { minDur: 6600, sub: '寒流來了！北風呼呼地吹，像小刀子一樣往骨頭裡鑽——好冷呀！',
          html: scene(WINDCOLD + P(400, 302, A('kid', 'wow')) + sweat(340, 195) +
            '<g fill="#fff"><circle class="st-snow" cx="250" cy="40" r="3.4"/><circle class="st-snow" style="animation-delay:.8s" cx="520" cy="30" r="3"/></g>') },
        { minDur: 6600, sub: '大家縮著脖子、抱著手臂快步走，圍巾手套全都出動了！',
          html: scene(WINDCOLD +
            P(320, 302, A('kid', 'wow') + '<path d="M-16 -38 h32 l-4 10 h-24 z" fill="#e85a4f"/>', 'st-dashL') +
            P(500, 302, A('kid', 'wow'), 'st-dashL', .2, .93) + sweat(420, 195)) },
        { minDur: 6600, sub: '「寒風刺骨」：寒冷的風像刺進骨頭一樣——記得添衣保暖呀！',
          html: scene(WINDCOLD + P(400, 302, A('kid', 'happy') + '<path d="M-16 -38 h32 l-4 10 h-24 z" fill="#e85a4f"/>') + hearts(490, 190)) },
        { minDur: 6400, sub: '寒風刺骨：寒冷的風像刺進骨頭一樣。',
          html: scene(WINDCOLD + P(400, 302, A('kid', 'wow'), '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">寒風刺骨</text>') }
      ];
    },
    /* 春風滿面 */
    i423: function () {
      var SMILEBROWS = '<path d="M-14 -62 q6 -5 12 0 M2 -62 q6 -5 12 0" stroke="#3a2e26" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '比賽得獎的消息一公布，小晴一路春風滿面地走回教室——臉上的笑容藏都藏不住！',
          html: scene(P(360, 302, A('kid', 'happy') + SMILEBROWS, 'st-strut', 0, 1.05) + hearts(460, 185) +
            '<g stroke="#e8f4fb" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"><path class="st-windln" d="M150 180 q50 -12 100 0"/></g>') },
        { minDur: 6600, sub: '同學們圍過來道賀，她笑得像春天的暖風拂過臉龐，又開心又溫柔。',
          html: scene(P(360, 302, A('kid', 'happy') + SMILEBROWS) +
            P(520, 302, A('kid', 'happy'), '', .2, .93) + P(230, 302, A('kid', 'happy'), '', .3, .9) + hearts(400, 170)) },
        { minDur: 6600, sub: '「春風滿面」：滿臉笑容、心情愉快的樣子！',
          html: scene(P(400, 302, A('kid', 'happy') + SMILEBROWS, '', 0, 1.1) + hearts(500, 185) + notes(300, 180)) },
        { minDur: 6400, sub: '春風滿面：滿臉笑容，心情愉快的樣子。',
          html: scene(P(400, 302, A('kid', 'happy') + SMILEBROWS, '', 0, 1.12) + hearts(490, 188) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">春風滿面</text>') }
      ];
    },
    /* 笑容可掬 */
    i424: function () {
      var SMILEBROWS = '<path d="M-14 -62 q6 -5 12 0 M2 -62 q6 -5 12 0" stroke="#3a2e26" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '巷口麵包店的老闆娘，見到每位客人都笑瞇瞇：「歡迎光臨，今天的麵包剛出爐喔！」',
          html: scene(P(430, 302, '<rect x="-60" y="-30" width="120" height="30" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/><circle cx="-24" cy="-38" r="8" fill="#e8b84a"/><circle cx="2" cy="-40" r="8" fill="#e0a458"/><circle cx="28" cy="-38" r="8" fill="#c98f2a"/>') +
            P(300, 302, A('kid', 'happy') + SMILEBROWS, '', 0, 1.05) +
            P(620, 302, A('kid', 'happy'), 'st-inR', 0, .92) + hearts(500, 190)) },
        { minDur: 6600, sub: '那笑容溫暖親切，好像雙手捧著送到你面前——大家都喜歡跟她買麵包！',
          html: scene(P(400, 302, A('kid', 'happy') + SMILEBROWS, '', 0, 1.1) + hearts(480, 180) + hearts(320, 190)) },
        { minDur: 6600, sub: '「掬」是用雙手捧起——笑容滿面、和藹可親，就是「笑容可掬」！',
          html: scene(P(400, 302, A('kid', 'happy') + SMILEBROWS +
              '<circle cx="-26" cy="-24" r="8" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/><circle cx="26" cy="-24" r="8" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>', '', 0, 1.08) + hearts(500, 190)) },
        { minDur: 6400, sub: '笑容可掬：笑容滿面，和藹可親。',
          html: scene(P(400, 302, A('kid', 'happy') + SMILEBROWS, '', 0, 1.12) + hearts(300, 190) + hearts(500, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">笑容可掬</text>') }
      ];
    },
    /* 綠樹成蔭 */
    i425: function () {
      function bigTree(x, sc) {
        return P(x, 302, '<rect x="-10" y="-52" width="20" height="52" rx="7" fill="#a8734a"/>' +
          '<circle cx="0" cy="-76" r="34" fill="#7cc47f"/><circle cx="-28" cy="-58" r="22" fill="#8fd08f"/><circle cx="28" cy="-60" r="23" fill="#8fd08f"/>', '', 0, sc || 1);
      }
      var SHADE = '<ellipse cx="0" cy="0" rx="90" ry="14" fill="#5f8a46" opacity=".35"/>';
      return [
        { minDur: 6600, sub: '公園的大樹一棵挨著一棵，枝葉茂密，把陽光都篩成了細細碎碎的光點。',
          html: scene(bigTree(200, 1.05) + bigTree(400, 1.15) + bigTree(600, 1) +
            P(400, 322, SHADE)) },
        { minDur: 6600, sub: '烈日當空也不怕——躲進樹蔭下，涼快又舒服，最適合乘涼、下棋、講故事！',
          html: scene(bigTree(430, 1.25) + P(430, 322, SHADE) +
            P(330, 302, A('kid', 'happy'), '', 0, .92) + P(520, 302, A('kid', 'happy'), '', .2, .9) + hearts(430, 210)) },
        { minDur: 6600, sub: '「綠樹成蔭」：樹木茂密、樹蔭連成一片——夏天最棒的天然涼傘！',
          html: scene(bigTree(250, 1.1) + bigTree(480, 1.2) + P(360, 322, SHADE) +
            P(370, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6400, sub: '綠樹成蔭：樹木茂密，樹蔭遮蔽成片。',
          html: scene(bigTree(260, 1.1) + bigTree(520, 1.15) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">綠樹成蔭</text>') }
      ];
    },
    /* 說三道四 */
    i809: function () {
      function bub4(x, y, dly) {
        return P(x, y, '<g class="st-zfloat"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<path d="M-20 -12 a17 13 0 1 1 34 4 q-2 6 -8 7 l-8 7 l1 -7 q-17 -2 -19 -11 z" fill="#fff" stroke="#c9bfa8" stroke-width="2"/>' +
          '<text x="-2" y="-3" text-anchor="middle" font-size="11" fill="#8a7a4a">嘰嘰喳喳</text></g>');
      }
      return [
        { minDur: 6800, sub: '走廊上，兩個同學湊在一起，對別人的穿著、成績指指點點、議論個不停。',
          html: scene(P(300, 302, A('kid', 'happy')) + P(420, 302, A('kid', 'happy'), '', 0, .96, true) +
            bub4(360, 172, 0) +
            P(620, 302, A('kid', 'sad'), '', 0, .92) + sweat(660, 200)) },
        { minDur: 6800, sub: '被議論的同學聽見了，心裡好難受——隨便批評別人的事，是很不禮貌的行為。',
          html: scene(P(560, 302, A('kid', 'sad')) + sweat(600, 195) + qmark(510, 182) +
            P(280, 302, A('kid', 'wow'), '', 0, .93)) },
        { minDur: 6600, sub: '「說三道四」：隨意批評、議論別人的事——管好自己、尊重別人，才是好風度！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .96, true) + hearts(400, 178)) },
        { minDur: 6400, sub: '說三道四：隨意批評、議論別人的事。',
          html: scene(P(340, 302, A('kid', 'happy')) + bub4(410, 175, 0) + qmark(530, 195) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">說三道四</text>') }
      ];
    },
    /* 九霄雲外 */
    i810: function () {
      function cloudsHigh() {
        return '<g class="st-cloud"><ellipse cx="200" cy="70" rx="44" ry="16" fill="#fff"/><ellipse cx="430" cy="45" rx="52" ry="18" fill="#fff"/><ellipse cx="640" cy="80" rx="40" ry="15" fill="#fff"/></g>';
      }
      return [
        { minDur: 6800, sub: '一放暑假，小齊玩得不亦樂乎——老師交代的暑假作業，早被他拋到九霄雲外去了！',
          html: scene(cloudsHigh() +
            P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + notes(450, 180) +
            P(180, 120, '<g class="st-zfloat"><rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16" stroke="#8fa3bf" stroke-width="1.8"/></g>')) },
        { minDur: 6800, sub: '「九霄」是天空最高最高的地方——東西被丟到那裡，就是忘得一乾二淨啦！',
          html: scene(cloudsHigh() + P(400, 302, A('kid', 'happy')) + qmark(480, 185) +
            '<path d="M430 250 Q420 160 400 90" stroke="#c9bfa8" stroke-width="3" fill="none" stroke-dasharray="8 8"/>') },
        { minDur: 6800, sub: '開學前一晚他才想起來——挑燈夜戰寫作業！該記的事，可別拋到九霄雲外呀。',
          html: scene(P(360, 302, A('kid', 'wow') + P(-42, -54, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95)) +
            sweat(300, 195) + zzz(500, 200), 'night') },
        { minDur: 6400, sub: '九霄雲外：非常遙遠的地方，或忘得一乾二淨。',
          html: scene(cloudsHigh() +
            '<text x="400" y="270" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">九霄雲外</text>') }
      ];
    },
    /* 度日如年 */
    i811: function () {
      var CLOCK2 = '<circle cx="0" cy="0" r="22" fill="#fff" stroke="#8b93a3" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-13" stroke="#3a2e26" stroke-width="2.8"/><line x1="0" y1="0" x2="9" y2="5" stroke="#3a2e26" stroke-width="2.8"/>';
      return [
        { minDur: 6800, sub: '打預防針前的等待好難熬——小旭盯著時鐘，秒針好像走得特別特別慢……',
          html: scene(P(500, 190, CLOCK2, '', 0, 1.3) +
            P(300, 302, A('kid', 'sad')) + sweat(250, 195) + qmark(370, 182)) },
        { minDur: 6600, sub: '明明只過了五分鐘，卻覺得像過了一整年——這就是「度日如年」的感覺！',
          html: scene(P(500, 190, CLOCK2, '', 0, 1.2) + zzz(380, 200) +
            P(300, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>')) },
        { minDur: 6600, sub: '其實針一下就打完了！很多害怕的事，真正面對時並沒有想像中可怕。',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(500, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(400, 180)) },
        { minDur: 6400, sub: '度日如年：日子難熬，過一天像過一年。',
          html: scene(P(430, 200, CLOCK2, '', 0, 1.5) + P(260, 302, A('kid', 'sad')) + sweat(310, 195) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">度日如年</text>') }
      ];
    },
    /* 日新月異 */
    i812: function () {
      var OLDPHONE = '<rect x="-12" y="-30" width="24" height="46" rx="5" fill="#8b93a3" stroke="#6d7585" stroke-width="2.4"/><rect x="-8" y="-24" width="16" height="16" rx="2" fill="#c9d6e8"/><g fill="#6d7585"><circle cx="-5" cy="2" r="2"/><circle cx="3" cy="2" r="2"/><circle cx="-5" cy="8" r="2"/><circle cx="3" cy="8" r="2"/></g>';
      var NEWPHONE = '<rect x="-13" y="-32" width="26" height="52" rx="6" fill="#3a2e26" stroke="#1e1812" stroke-width="2"/><rect x="-10" y="-27" width="20" height="42" rx="3" fill="#7fb2e0"/>';
      return [
        { minDur: 6800, sub: '爺爺翻出他年輕時的舊手機：又厚又重，只能打電話。再看看現在的手機——薄薄一片什麼都會！',
          html: scene(P(300, 280, OLDPHONE, '', 0, 1.2) + P(500, 278, NEWPHONE, '', 0, 1.2) +
            '<path d="M340 250 L450 250" stroke="#4a3200" stroke-width="4" stroke-dasharray="9 8"/><path d="M450 250 l-12 -8 v16 z" fill="#4a3200"/>' +
            P(160, 302, A('kid', 'wow'), '', 0, .92)) },
        { minDur: 6800, sub: '高鐵、機器人、會說話的音箱……新發明一個接一個，每天每月都有新變化！',
          html: scene(P(400, 302, A('kid', 'happy')) + bang(310, 190) + bang(500, 175) + hearts(430, 220)) },
        { minDur: 6600, sub: '「日新月異」：進步飛快，天天有新氣象——我們的學習也要跟上腳步！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(540, 278, NEWPHONE, '', 0, 1) + hearts(450, 190)) },
        { minDur: 6400, sub: '日新月異：每天每月都有新變化，進步非常快。',
          html: scene(P(300, 285, OLDPHONE, '', 0, 1) + P(500, 280, NEWPHONE, '', 0, 1.15) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">日新月異</text>') }
      ];
    },
    /* 龍飛鳳舞 */
    i813: function () {
      var CALLIG = '<rect x="-60" y="-70" width="120" height="140" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="3"/>' +
        '<path d="M-30 -48 q30 -14 44 8 q10 18 -14 22 q-26 4 -18 24 q6 16 28 12 M-34 30 q20 16 52 6" stroke="#3a2e26" stroke-width="6" fill="none" stroke-linecap="round"/>';
      var BRUSH = '<line x1="0" y1="0" x2="14" y2="-34" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 0 q-3 6 -1 11 q4 -2 5 -8 z" fill="#3a2e26"/>';
      return [
        { minDur: 6800, sub: '書法老師揮毫寫下一幅大字：筆走龍蛇、氣勢奔放，像龍在飛、鳳在舞！',
          html: scene(P(430, 300, CALLIG, '', 0, 1) +
            P(220, 302, A('kid', 'happy') + P(24, -44, BRUSH)) + hearts(320, 185)) },
        { minDur: 6600, sub: '同學們看得目瞪口呆：「哇——這字活起來了！」',
          html: scene(P(430, 300, CALLIG, '', 0, 1.05) +
            P(200, 302, A('kid', 'wow'), '', 0, .92) + P(650, 302, A('kid', 'wow'), '', .2, .9, true) + bang(560, 170)) },
        { minDur: 6800, sub: '「龍飛鳳舞」形容書法筆勢活潑奔放——不過有時也拿來開玩笑，說字跡潦草看不懂啦！',
          html: scene(P(300, 160, A('dragon'), '', 0, .95) + P(540, 300, CALLIG, '', 0, .9) + notes(430, 200)) },
        { minDur: 6400, sub: '龍飛鳳舞：書法筆勢活潑奔放（也戲稱字跡潦草）。',
          html: scene(P(400, 300, CALLIG, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">龍飛鳳舞</text>') }
      ];
    },
    /* 快馬加鞭 */
    i814: function () {
      var WHIP = '<path d="M0 0 q16 -18 34 -20" stroke="#8a5a33" stroke-width="4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '送信的騎士接到緊急任務！他騎上快馬，還揚起馬鞭：「駕——再快一點！」',
          html: scene(P(400, 302, A('horse') + P(4, -34, A('kid', 'angry'), '', 0, .72) + P(30, -60, WHIP), 'st-dashL', 0, 1.05) +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="120" y1="240" x2="210" y2="240"/></g>' + bang(600, 220)) },
        { minDur: 6800, sub: '馬已經跑得飛快，再加上一鞭——比喻事情進行得很快了，還要再加速！',
          html: scene(P(360, 302, A('horse'), 'st-dashL', 0, 1.1) + sweat(300, 210) +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="100" y1="230" x2="190" y2="230"/><line class="st-windln" style="animation-delay:.4s" x1="80" y1="260" x2="160" y2="260"/></g>') },
        { minDur: 6800, sub: '考試前一週，小杰快馬加鞭複習功課，進度突飛猛進！',
          html: scene(P(340, 302, A('kid', 'happy') + P(-42, -54, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16 M-8 6 h16" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95)) +
            bang(460, 190) + hearts(260, 188)) },
        { minDur: 6400, sub: '快馬加鞭：對快馬再加鞭，加速進行。',
          html: scene(P(400, 302, A('horse') + P(30, -60, WHIP), 'st-dashL', 0, 1.15) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">快馬加鞭</text>') }
      ];
    },
    /* 馬不停蹄 */
    i815: function () {
      return [
        { minDur: 6800, sub: '古時候送緊急公文，驛馬一站接一站地跑，馬蹄一刻也不停歇！',
          html: scene(P(340, 302, A('horse') + P(4, -34, A('kid', 'angry'), '', 0, .7), 'st-dashL', 0, 1.05) +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="110" y1="240" x2="200" y2="240"/></g>' + sweat(280, 210)) },
        { minDur: 6800, sub: '園遊會當天，總務股長馬不停蹄：補貨、收錢、擦桌子，一刻也沒歇著！',
          html: scene(P(340, 302, A('kid', 'happy'), 'st-dashL') + sweat(290, 195) +
            P(540, 302, '<rect x="-60" y="-30" width="120" height="30" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>') + bang(620, 230)) },
        { minDur: 6600, sub: '「馬不停蹄」：一刻也不休息地連續進行——真是辛苦又拚勁十足！',
          html: scene(P(400, 302, A('horse'), 'st-strut', 0, 1.1) + hearts(500, 200)) },
        { minDur: 6400, sub: '馬不停蹄：一刻不休息地連續進行。',
          html: scene(P(400, 302, A('horse'), 'st-dashL', 0, 1.15) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">馬不停蹄</text>') }
      ];
    },
    /* 走馬看花 */
    i816: function () {
      function flower4(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="-14" stroke="#5f8a46" stroke-width="3"/>' +
          '<circle cx="0" cy="-20" r="4.6" fill="' + color + '"/><circle cx="-5" cy="-16" r="4.6" fill="' + color + '"/><circle cx="5" cy="-16" r="4.6" fill="' + color + '"/><circle cx="0" cy="-12" r="4.6" fill="' + color + '"/></g>');
      }
      return [
        { minDur: 6800, sub: '騎在奔跑的馬上看花——咻一下就過去了，哪朵是紅的、哪朵是黃的，根本看不清！',
          html: scene(flower4(200, 320, '#ff9eb5', 0) + flower4(300, 318, '#ffd97a', .2) + flower4(400, 322, '#c9a8e0', .4) +
            P(500, 302, A('horse') + P(4, -34, A('kid', 'happy'), '', 0, .7), 'st-dashL', 0, 1) + qmark(600, 200)) },
        { minDur: 6800, sub: '逛博物館也一樣：一路衝著走馬看花，出了門什麼也想不起來——慢慢看，才有收穫！',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-dashL') + sweat(250, 195) +
            P(540, 260, '<rect x="-30" y="-36" width="60" height="46" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/><path d="M-18 -20 L0 -34 L18 -20 Z" fill="#a5c2b2"/><circle cx="12" cy="-28" r="5" fill="#ffdd66"/>') + qmark(430, 190)) },
        { minDur: 6600, sub: '「走馬看花」：粗略地看、匆匆一瞥，沒有仔細觀察。',
          html: scene(flower4(250, 320, '#ff9eb5', 0) + flower4(360, 318, '#ffd97a', .3) +
            P(500, 302, A('horse'), 'st-strut', 0, .95) + qmark(590, 200)) },
        { minDur: 6400, sub: '走馬看花：騎馬奔跑中看花，粗略地觀察。',
          html: scene(flower4(240, 320, '#ff9eb5', 0) + flower4(340, 322, '#c9a8e0', .3) + P(520, 302, A('horse'), 'st-dashL', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">走馬看花</text>') }
      ];
    },
    /* 汗流浹背 */
    i817: function () {
      return [
        { minDur: 6800, sub: '大熱天的體育課跑完八百公尺——小安整件衣服都濕透了，連背上都是汗！',
          html: scene(P(360, 302, A('kid', 'wow')) +
            sweat(300, 185) + sweat(420, 190) + sweat(340, 165) + sweat(390, 210) +
            '<rect y="296" width="800" height="18" fill="#d9a890"/>') },
        { minDur: 6800, sub: '農夫伯伯在烈日下插秧，也是汗流浹背——每一粒米，都是辛苦換來的！',
          html: scene(P(340, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe')) +
            sweat(290, 190) + sweat(390, 195) + hearts(480, 200)) },
        { minDur: 6600, sub: '「浹」是濕透——汗水濕透背部，形容非常辛勞（或非常緊張）！',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) + sweat(340, 185) + sweat(460, 188) + sweat(400, 160)) },
        { minDur: 6400, sub: '汗流浹背：汗水濕透背部，非常辛勞或緊張。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.08) + sweat(340, 185) + sweat(460, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">汗流浹背</text>') }
      ];
    },
    /* 舉手之勞 */
    i818: function () {
      var ERASERDROP = '<rect x="-9" y="-6" width="18" height="12" rx="3" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '前座同學的橡皮擦掉到地上了。小其彎個腰、伸個手，順手撿起來遞回去。',
          html: scene(P(430, 316, ERASERDROP) +
            P(320, 302, '<g transform="rotate(24)">' + A('kid', 'happy') + '</g>') +
            P(540, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(470, 190)) },
        { minDur: 6800, sub: '「謝謝你！」「小事一樁，舉手之勞而已！」——舉一下手的力氣，一點也不費力。',
          html: scene(P(320, 302, A('kid', 'happy') +
              '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>') +
            P(500, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(410, 175)) },
        { minDur: 6800, sub: '關門、撿垃圾、幫忙按電梯——生活裡的舉手之勞，累積起來就是大大的溫暖！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(470, 302, A('kid', 'happy'), '', .2, .95) +
            hearts(390, 172) + hearts(540, 190)) },
        { minDur: 6400, sub: '舉手之勞：毫不費力的小事。',
          html: scene(P(400, 302, A('kid', 'happy') +
              '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>', '', 0, 1.08) + hearts(500, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">舉手之勞</text>') }
      ];
    },
    /* 輕而易舉 */
    i819: function () {
      var FEATHER2 = '<path d="M0 0 q-8 -14 0 -26 q8 12 0 26 z" fill="#fff" stroke="#e3dcd4" stroke-width="1.6"/>';
      var BOX2 = '<rect x="-20" y="-24" width="40" height="24" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/><path d="M-20 -16 h40" stroke="#a8734a" stroke-width="2"/>';
      return [
        { minDur: 6600, sub: '搬一根羽毛，誰都做得到——輕輕一拿就起來了，毫不費力！',
          html: scene(P(400, 260, FEATHER2, '', 0, 1.6) +
            P(300, 302, A('kid', 'happy')) + hearts(480, 210)) },
        { minDur: 6800, sub: '大力士抬起小紙箱，也是輕而易舉——對有本領的人來說，這種小事太簡單啦！',
          html: scene(P(360, 302, A('kid', 'happy') + P(0, -104, BOX2, '', 0, .9), '', 0, 1.1) + bang(470, 190)) },
        { minDur: 6600, sub: '「輕而易舉」：很輕鬆、毫不費力就能做到。',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 188)) },
        { minDur: 6400, sub: '輕而易舉：很輕鬆、毫不費力就能做到。',
          html: scene(P(360, 250, FEATHER2, '', 0, 1.5) + P(480, 302, A('kid', 'happy')) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">輕而易舉</text>') }
      ];
    },
    /* 東拼西湊 */
    i820: function () {
      var PATCHWORK = '<g stroke-width="2"><rect x="-40" y="-30" width="30" height="30" fill="#a5c8ff" stroke="#5c82ba"/><rect x="-10" y="-30" width="24" height="18" fill="#ffd97a" stroke="#e8b84a"/><rect x="14" y="-30" width="26" height="30" fill="#a5d47c" stroke="#7cab6e"/><rect x="-10" y="-12" width="24" height="12" fill="#f7a8c4" stroke="#e07ba3"/></g>';
      var COIN = '<circle cx="0" cy="0" r="9" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/>';
      return [
        { minDur: 6800, sub: '勞作課要做機器人，材料不夠——小組東找一個紙箱、西撿一個瓶蓋，四處拼湊材料！',
          html: scene(P(430, 290, PATCHWORK, '', 0, 1.1) +
            P(240, 302, A('kid', 'happy'), 'st-inL') + P(620, 302, A('kid', 'happy'), 'st-inR', .2, .92, true) + qmark(500, 200)) },
        { minDur: 6800, sub: '買禮物錢不夠，兄妹倆東拼西湊零用錢，總算湊出了媽媽的生日禮金！',
          html: scene(P(360, 290, COIN, '', 0, 1) + P(400, 285, COIN, '', .1, 1) + P(440, 292, COIN, '', .2, 1) +
            P(260, 302, A('kid', 'happy')) + P(540, 302, A('kid', 'happy'), '', 0, .93, true) + hearts(400, 220)) },
        { minDur: 6600, sub: '「東拼西湊」：到處拼湊、七拼八湊地聚集起來——雖然辛苦，也是一種努力！',
          html: scene(P(430, 290, PATCHWORK, '', 0, 1.05) + P(260, 302, A('kid', 'happy')) + hearts(350, 195)) },
        { minDur: 6400, sub: '東拼西湊：到處拼湊聚集起來。',
          html: scene(P(400, 288, PATCHWORK, '', 0, 1.2) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">東拼西湊</text>') }
      ];
    },
    /* 風雨無阻 */
    i821: function () {
      var RAINFX2 = '<g stroke="#8fc6ff" stroke-width="3.4" stroke-linecap="round">' +
        '<line class="st-rain" x1="140" y1="30" x2="134" y2="52"/><line class="st-rain" style="animation-delay:.4s" x1="300" y1="16" x2="294" y2="38"/>' +
        '<line class="st-rain" style="animation-delay:.8s" x1="450" y1="30" x2="444" y2="52"/><line class="st-rain" style="animation-delay:.2s" x1="580" y1="14" x2="574" y2="36"/></g>';
      var UMB = '<path d="M0 -50 q-30 0 -34 22 q8 -8 17 0 q8 -8 17 0 q8 -8 17 0 q8 -8 17 0 q-4 -22 -34 -22 z" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.4"/>' +
        '<line x1="0" y1="-28" x2="0" y2="8" stroke="#8b93a3" stroke-width="3.4"/>';
      return [
        { minDur: 6800, sub: '每週六早上的晨跑約定——就算下大雨，小威也撐著傘準時出現在公園門口！',
          html: scene(RAINFX2 + P(360, 302, A('kid', 'happy') + P(30, -70, UMB, '', 0, 1.05)) + hearts(460, 200)) },
        { minDur: 6800, sub: '郵差叔叔也是風雨無阻：颳風下雨，信件照樣一封封送到家！',
          html: scene(RAINFX2 +
            P(340, 302, A('kid', 'happy') + P(-38, -30, '<rect x="-14" y="-16" width="28" height="20" rx="4" fill="#5c82ba" stroke="#46689a" stroke-width="2.4"/>', '', 0, 1), 'st-strut') + sweat(290, 195)) },
        { minDur: 6600, sub: '「風雨無阻」：颳風下雨都擋不住，照常進行——說到做到的毅力！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) + hearts(450, 185) + bang(280, 195)) },
        { minDur: 6400, sub: '風雨無阻：颳風下雨都不能阻擋，照常進行。',
          html: scene(RAINFX2 + P(400, 302, A('kid', 'happy') + P(30, -70, UMB, '', 0, 1.1)) +
            '<text x="400" y="90" text-anchor="middle" font-size="50" font-weight="bold" fill="#4a3200">風雨無阻</text>') }
      ];
    },
    /* 一馬當先 */
    i1006: function () {
      return [
        { minDur: 6800, sub: '衝鋒號一響，將軍策馬衝在隊伍最前面——一馬當先，帶著大家往前衝！',
          html: scene(P(560, 302, A('horse') + P(4, -34, A('kid', 'angry'), '', 0, .72), 'st-dashL', 0, 1.1) +
            P(300, 302, A('horse'), 'st-strut', .2, .9) + P(160, 302, A('horse'), 'st-strut', .4, .85) + bang(680, 220)) },
        { minDur: 6800, sub: '打掃時間，班長一馬當先拿起掃把——同學們也跟著捲起袖子動起來！',
          html: scene(P(300, 302, A('kid', 'happy') + P(20, -34, '<line x1="0" y1="0" x2="20" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 0 l-10 12 M0 0 l-2 14 M0 0 l6 13" stroke="#c9a06c" stroke-width="3.4" stroke-linecap="round"/>', 'st-hoe')) +
            P(480, 302, A('kid', 'happy'), 'st-inR', .3, .93) + P(620, 302, A('kid', 'happy'), 'st-inR', .5, .9) + hearts(400, 180)) },
        { minDur: 6600, sub: '「一馬當先」：搶在最前面，帶頭去做——領頭的人最需要勇氣！',
          html: scene(P(430, 302, A('horse'), 'st-strut', 0, 1.15) + hearts(530, 195)) },
        { minDur: 6400, sub: '一馬當先：策馬走在最前面，領先帶頭。',
          html: scene(P(500, 302, A('horse'), 'st-dashL', 0, 1.15) + P(220, 302, A('horse'), 'st-strut', .3, .85) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一馬當先</text>') }
      ];
    },
    /* 一五一十 */
    i1041: function () {
      var COIN = '<circle cx="0" cy="0" r="9" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/>';
      return [
        { minDur: 6800, sub: '數銅板的時候，五個一數：五、十、十五、二十——一筆一筆數得清清楚楚！',
          html: scene(P(300, 290, COIN) + P(340, 288, COIN) + P(380, 292, COIN) + P(420, 287, COIN) + P(460, 290, COIN) +
            P(200, 302, A('kid', 'happy')) +
            '<text x="540" y="270" font-size="26" font-weight="bold" fill="#4a3200">5·10·15…</text>') },
        { minDur: 6800, sub: '打破花瓶後，小威把經過一五一十告訴媽媽，一點也不隱瞞——誠實的孩子！',
          html: scene(P(300, 302, A('kid', 'sad')) +
            P(500, 302, A('kid', 'happy'), '', 0, 1.05, true) + hearts(410, 180) +
            P(200, 316, '<path d="M-10 0 l6 -14 l6 6 l5 -9 l7 17 z" fill="#8fd0c0" stroke="#5aa896" stroke-width="2"/>') ) },
        { minDur: 6600, sub: '「一五一十」：像數數一樣毫無遺漏——原原本本、清清楚楚地說出來！',
          html: scene(P(320, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .96, true) + hearts(410, 178)) },
        { minDur: 6400, sub: '一五一十：原原本本，清楚無遺漏。',
          html: scene(P(300, 288, COIN) + P(345, 286, COIN) + P(390, 290, COIN) + P(435, 287, COIN) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一五一十</text>') }
      ];
    },
    /* 自食其力 */
    i1053: function () {
      var LEMONADE = '<rect x="-46" y="-30" width="92" height="30" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
        '<rect x="-32" y="-52" width="20" height="22" rx="3" fill="#ffe066" stroke="#e8b84a" stroke-width="2"/>' +
        '<text x="14" y="-36" text-anchor="middle" font-size="12" font-weight="bold" fill="#4a3200">果汁</text>';
      var COIN = '<circle cx="0" cy="0" r="9" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/>';
      return [
        { minDur: 6800, sub: '暑假裡，小柔擺了個小果汁攤：自己榨汁、自己叫賣，賺自己的零用錢！',
          html: scene(P(430, 302, LEMONADE) + P(300, 302, A('kid', 'happy')) +
            P(600, 302, A('kid', 'happy'), 'st-inR', 0, .92) + hearts(500, 195)) },
        { minDur: 6800, sub: '長大以後也一樣：靠自己的雙手工作、養活自己，不依賴別人——多有骨氣！',
          html: scene(P(340, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe')) + sweat(290, 195) +
            P(540, 288, COIN, '', 0, 1) + P(580, 285, COIN, '', .2, 1) + hearts(470, 200)) },
        { minDur: 6600, sub: '「自食其力」：靠自己的勞力養活自己——最踏實、最光榮！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 188)) },
        { minDur: 6400, sub: '自食其力：靠自己的勞力養活自己。',
          html: scene(P(360, 302, A('kid', 'happy') + P(16, -30, HOE)) + P(540, 288, COIN, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">自食其力</text>') }
      ];
    },
    /* 傾盆大雨 */
    i1065: function () {
      var HEAVYRAIN = '<g stroke="#8fc6ff" stroke-width="4" stroke-linecap="round">' +
        '<line class="st-rain" x1="120" y1="20" x2="110" y2="56"/><line class="st-rain" style="animation-delay:.2s" x1="220" y1="10" x2="210" y2="46"/>' +
        '<line class="st-rain" style="animation-delay:.4s" x1="320" y1="24" x2="310" y2="60"/><line class="st-rain" style="animation-delay:.1s" x1="430" y1="8" x2="420" y2="44"/>' +
        '<line class="st-rain" style="animation-delay:.5s" x1="530" y1="20" x2="520" y2="56"/><line class="st-rain" style="animation-delay:.3s" x1="640" y1="12" x2="630" y2="48"/>' +
        '<line class="st-rain" style="animation-delay:.6s" x1="180" y1="70" x2="170" y2="106"/><line class="st-rain" style="animation-delay:.7s" x1="480" y1="66" x2="470" y2="102"/></g>' +
        '<g class="st-cloud"><ellipse cx="260" cy="46" rx="70" ry="22" fill="#8b93a3"/><ellipse cx="520" cy="36" rx="80" ry="24" fill="#a3a9b8"/></g>';
      var BASIN = '<path d="M-24 -8 L24 -8 L18 10 L-18 10 Z" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2.6"/>';
      return [
        { minDur: 6600, sub: '轟隆一聲雷響——嘩啦啦！大雨像整盆水從天上倒下來，眼前白茫茫一片！',
          html: scene(HEAVYRAIN + P(400, 302, A('kid', 'wow')) + sweat(340, 195) + bang(560, 140), 'night') },
        { minDur: 6600, sub: '「傾盆」就是把盆子整個倒過來——形容雨勢又大又急！',
          html: scene(P(430, 200, '<g transform="rotate(160)">' + BASIN + '</g>', '', 0, 1.4) +
            '<g stroke="#8fc6ff" stroke-width="4" stroke-linecap="round"><line class="st-rain" x1="410" y1="230" x2="404" y2="266"/><line class="st-rain" style="animation-delay:.3s" x1="450" y1="226" x2="444" y2="262"/></g>' +
            P(240, 302, A('kid', 'happy'))) },
        { minDur: 6600, sub: '遇上傾盆大雨，記得快找地方躲雨，別淋成落湯雞呀！',
          html: scene(HEAVYRAIN +
            P(400, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL') + sweat(340, 200), 'night') },
        { minDur: 6400, sub: '傾盆大雨：雨大得像整盆水倒下來。',
          html: scene(HEAVYRAIN +
            '<text x="400" y="280" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">傾盆大雨</text>', 'night') }
      ];
    },
    /* 湖光山色 */
    i1077: function () {
      var LAKE2 = '<rect y="252" width="800" height="88" fill="#7fb2e0"/>' +
        '<g stroke="#a8d4ee" stroke-width="4" stroke-linecap="round" opacity=".8"><line x1="140" y1="280" x2="260" y2="280"/><line x1="400" y1="300" x2="540" y2="300"/><line x1="580" y1="272" x2="700" y2="272"/></g>';
      var MTS = '<path d="M-20 252 L150 100 L320 252 Z" fill="#8fb0a0"/><path d="M240 252 L420 130 L600 252 Z" fill="#a5c2b2" opacity=".9"/><path d="M520 252 L660 150 L800 252 Z" fill="#8fb0a0" opacity=".85"/>';
      return [
        { minDur: 6600, sub: '走到湖邊一看：湖水閃著金色的波光，遠處的青山倒映在水裡——美得像一幅畫！',
          html: scene(MTS + LAKE2 + P(150, 296, A('kid', 'wow'), '', 0, .92) + hearts(230, 210)) },
        { minDur: 6600, sub: '「湖光」是湖水的波光，「山色」是山的景色——合起來就是最美的山水風景！',
          html: scene(MTS + LAKE2 + P(400, 296, '<path d="M-40 0 L40 0 L30 14 L-30 14 Z" fill="#a8734a" stroke="#8a5a33" stroke-width="3"/>' +
              P(0, 0, A('kid', 'happy'), '', 0, .78))) },
        { minDur: 6600, sub: '日月潭、大湖公園……台灣也有許多湖光山色的好地方，假日去走走吧！',
          html: scene(MTS + LAKE2 + P(200, 296, A('kid', 'happy')) + P(330, 296, A('kid', 'happy'), '', .2, .93) + hearts(270, 210)) },
        { minDur: 6400, sub: '湖光山色：湖水波光與山景，山水風景優美。',
          html: scene(MTS + LAKE2 +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">湖光山色</text>') }
      ];
    },
    /* 臨時抱佛腳 */
    i034: function () {
      var STATUE = '<ellipse cx="0" cy="0" rx="34" ry="10" fill="#b8ae9c"/>' +
        '<path d="M-24 0 Q-26 -34 0 -38 Q26 -34 24 0 Z" fill="#d9cbb0" stroke="#b8ae9c" stroke-width="2.6"/>' +
        '<circle cx="0" cy="-50" r="14" fill="#d9cbb0" stroke="#b8ae9c" stroke-width="2.4"/>' +
        '<path d="M-5 -50 q5 4 10 0" stroke="#8a7a5a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<circle cx="-5" cy="-53" r="1.4" fill="#8a7a5a"/><circle cx="5" cy="-53" r="1.4" fill="#8a7a5a"/>';
      var BOOKS2 = '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16 M-8 6 h16" stroke="#8fa3bf" stroke-width="1.8"/>';
      return [
        { minDur: 6800, sub: '明天就要大考，小威今晚才第一次翻開課本——桌上堆得像小山，怎麼讀得完呀！',
          html: scene(P(360, 302, A('kid', 'wow') + P(-44, -50, BOOKS2, '', 0, 1)) +
            sweat(300, 192) + zzz(500, 200) + qmark(430, 178), 'night') },
        { minDur: 7000, sub: '俗話說：「平時不燒香，臨時抱佛腳。」傳說有人平日從不拜佛，遇到急難才衝進廟裡，抱著佛像的腳苦苦哀求！',
          html: scene(P(500, 302, STATUE, '', 0, 1.3) +
            P(400, 302, '<g transform="rotate(30)">' + A('kid', 'wow') + '</g>', '', 0, .92) + sweat(350, 200)) },
        { minDur: 6800, sub: '真本事要靠平時一點一滴累積——臨時抱佛腳，只能碰碰運氣呀！',
          html: scene(P(320, 302, A('kid', 'happy') + P(-42, -54, BOOKS2, '', 0, .9)) + hearts(430, 185)) },
        { minDur: 6400, sub: '臨時抱佛腳：平時不努力，急時才匆忙應付。',
          html: scene(P(500, 302, STATUE, '', 0, 1.15) + P(400, 302, '<g transform="rotate(30)">' + A('kid', 'wow') + '</g>', '', 0, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="48" font-weight="bold" fill="#4a3200">臨時抱佛腳</text>') }
      ];
    },
    /* 黃粱一夢 */
    i040: function () {
      var POT = '<path d="M-20 0 q-6 -20 4 -26 h32 q10 6 4 26 q-10 8 -20 8 q-10 0 -20 -8 z" transform="translate(-10,-8) scale(.9)" fill="#6d7585" stroke="#4a5462" stroke-width="2.4"/>' +
        '<g class="st-sweat"><path d="M-6 -40 q3 -6 0 -12 M4 -42 q3 -6 0 -12" stroke="#d5e4ee" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>';
      var CROWN = '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>';
      var GOLD = '<g stroke-width="2"><path d="M-26 0 l8 -14 h36 l8 14 z" fill="#ffd97a" stroke="#e8b84a"/><path d="M-20 -14 l7 -12 h26 l7 12 z" fill="#ffe9a0" stroke="#e8b84a"/></g>';
      return [
        { minDur: 7000, sub: '書生盧生在旅店裡唉聲嘆氣，怨自己不得志。道士遞給他一個枕頭，此時店家正煮著一鍋黃粱米飯。',
          html: scene(P(560, 300, POT, '', 0, 1.1) +
            P(300, 302, A('kid', 'sad')) + sweat(250, 195) +
            P(430, 290, '<ellipse cx="0" cy="0" rx="22" ry="9" fill="#f4ecd8" stroke="#ddd2b8" stroke-width="2.4"/>')) },
        { minDur: 7200, sub: '他枕著枕頭睡著了——夢裡考中狀元、當上宰相、兒孫滿堂，享盡八十年榮華富貴！',
          html: scene(P(430, 170, '<circle cx="0" cy="0" r="72" fill="#fff" opacity=".9"/>' +
              P(-30, 40, A('kid', 'happy') + CROWN, '', 0, .6) + P(30, 30, GOLD, '', 0, .7)) +
            P(300, 302, '<ellipse cx="0" cy="-8" rx="34" ry="12" fill="#6fbf8e"/><circle cx="-28" cy="-16" r="13" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>') +
            zzz(230, 230), 'night') },
        { minDur: 7000, sub: '一覺醒來——鍋裡的黃粱飯竟然都還沒煮熟！八十年的榮華，原來只是短短一場夢。',
          html: scene(P(560, 300, POT, '', 0, 1.1) +
            P(300, 302, A('kid', 'wow')) + sweat(250, 195) + qmark(370, 180)) },
        { minDur: 6400, sub: '黃粱一夢：美夢一場，虛幻不實。',
          html: scene(P(500, 300, POT, '', 0, 1.2) + P(300, 302, A('kid', 'sad')) + zzz(370, 200) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">黃粱一夢</text>') }
      ];
    },
    /* 庸人自擾 */
    i041: function () {
      return [
        { minDur: 7000, sub: '唐朝宰相陸象先說過一句名言：「天下本來沒有事，都是平庸的人自己攪擾出麻煩來的！」',
          html: scene(P(360, 302, A('kid', 'happy') +
              '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05) +
            P(580, 302, A('kid', 'wow'), '', 0, .93, true) + qmark(630, 188)) },
        { minDur: 7000, sub: '明天要抽背課文，小凡整晚胡思亂想：「一定會抽到我……」嚇得睡不著——結果隔天根本沒抽到他！',
          html: scene(P(340, 302, A('kid', 'sad')) + sweat(290, 192) + qmark(410, 178) + zzz(500, 205), 'night') },
        { minDur: 6800, sub: '自尋煩惱、自己嚇自己——就是「庸人自擾」。把擔心的力氣拿來準備，才實在！',
          html: scene(P(340, 302, A('kid', 'happy') + P(-42, -54, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95)) + hearts(450, 185)) },
        { minDur: 6400, sub: '庸人自擾：自作聰明，自尋煩惱。',
          html: scene(P(380, 302, A('kid', 'sad'), '', 0, 1.05) + qmark(450, 180) + sweat(310, 192) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">庸人自擾</text>') }
      ];
    },
    /* 走投無路 */
    i039: function () {
      var DEADWALL = '<rect x="-16" y="-110" width="32" height="110" fill="#b0a390" stroke="#8a7a66" stroke-width="2.6"/><path d="M-16 -110 h10 v-10 h12 v10 h10" fill="none" stroke="#8a7a66" stroke-width="2.6"/>';
      return [
        { minDur: 6800, sub: '小老鼠被貓追進了死巷——前面是高牆、後面是貓，一點退路也沒有了！',
          html: scene(P(620, 302, DEADWALL) +
            P(520, 300, A('mouse')) + sweat(560, 240) +
            P(280, 302, A('fox'), 'st-dashL', 0, 1.05) + bang(420, 220), 'night') },
        { minDur: 6600, sub: '「走投無路」：無處可去、陷入絕境——連一條出路都找不到。',
          html: scene(P(620, 302, DEADWALL) + P(500, 300, A('mouse')) + qmark(540, 240) + sweat(460, 250), 'night') },
        { minDur: 6800, sub: '不過遇到困境別絕望：靜下心多想一步，常常就能找到新的路！',
          html: scene(P(300, 302, A('kid', 'happy')) + bang(400, 185) + hearts(490, 190) +
            '<path d="M540 316 q80 -6 160 -30" stroke="#e8dcc0" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 10"/>') },
        { minDur: 6400, sub: '走投無路：無處可去，陷入絕境。',
          html: scene(P(620, 302, DEADWALL) + P(500, 300, A('mouse')) + P(300, 302, A('fox'), '', 0, 1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">走投無路</text>', 'night') }
      ];
    },
    /* 分道揚鑣 */
    i047: function () {
      function cart3(flip) {
        return '<g' + (flip ? ' transform="scale(-1,1)"' : '') + '>' + A('horse') +
          P(70, 0, '<circle cx="0" cy="-24" r="22" fill="#c9a06c" stroke="#a8734a" stroke-width="4"/><rect x="-10" y="-68" width="84" height="32" rx="6" fill="#c9762f" stroke="#a85a1e" stroke-width="3"/>') + '</g>';
      }
      return [
        { minDur: 7000, sub: '北魏的元志和李彪在大街上狹路相逢——兩輛車誰也不肯讓誰，一路吵到了皇帝面前！',
          html: scene(P(240, 302, cart3(false)) + P(620, 302, cart3(true)) + bang(430, 200) +
            qmark(360, 170) + qmark(500, 175)) },
        { minDur: 7000, sub: '皇帝笑著裁決：「洛陽是你們共同的地方——那就把路分成兩半，一人一邊，各走各的吧！」',
          html: scene('<path d="M400 340 L400 220" stroke="#fff" stroke-width="5" stroke-dasharray="16 12"/>' +
            P(240, 302, cart3(false)) + P(620, 302, cart3(true)) +
            P(400, 180, A('kid', 'happy') + '<path d="M-13 -88 l5 8 l8 -9 l8 9 l5 -8 v11 h-26 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2"/>', '', 0, .8) + hearts(400, 240)) },
        { minDur: 7000, sub: '「分道揚鑣」：各走各的路、各奔前程——朋友目標不同時好聚好散，也用這個詞。',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-inL', 0, 1, true) +
            P(500, 302, A('kid', 'happy'), 'st-inR') +
            '<path d="M370 316 q-60 -10 -120 -40 M430 316 q60 -10 120 -40" stroke="#e8dcc0" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="10 9"/>') },
        { minDur: 6400, sub: '分道揚鑣：各走各的路，各奔前程。',
          html: scene(P(280, 302, cart3(true)) + P(580, 302, cart3(false)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">分道揚鑣</text>') }
      ];
    },
    /* 汗牛充棟 */
    i048: function () {
      var BOOKPILE2 = '<g stroke-width="2"><rect x="-26" y="-12" width="52" height="12" rx="2.6" fill="#c9762f" stroke="#a85a1e"/><rect x="-23" y="-24" width="46" height="12" rx="2.6" fill="#5c82ba" stroke="#46689a"/><rect x="-25" y="-36" width="50" height="12" rx="2.6" fill="#6fae58" stroke="#548a40"/><rect x="-22" y="-48" width="44" height="12" rx="2.6" fill="#e0a458" stroke="#c08838"/></g>';
      return [
        { minDur: 6800, sub: '古人搬家運書：牛車上的書堆得像小山，老牛拉得滿身大汗、直喘大氣！',
          html: scene(P(360, 302, A('ox')) + sweat(320, 230) + sweat(410, 240) +
            P(500, 302, '<rect x="-10" y="-56" width="110" height="40" rx="5" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>' +
              P(45, -56, BOOKPILE2, '', 0, .9) + '<circle cx="10" cy="0" r="18" fill="#8a5a33"/><circle cx="80" cy="0" r="18" fill="#8a5a33"/>')) },
        { minDur: 6800, sub: '搬進屋裡一放——書一疊疊堆到屋樑那麼高！「充棟」就是把整間屋子都塞滿了。',
          html: scene(P(300, 302, BOOKPILE2, '', 0, 1.5) + P(430, 300, BOOKPILE2, '', .2, 1.8) + P(560, 302, BOOKPILE2, '', .4, 1.4) +
            P(180, 302, A('kid', 'wow'), '', 0, .92) + qmark(230, 190)) },
        { minDur: 6600, sub: '「汗牛充棟」：牛搬到出汗、屋子堆到滿——形容書籍非常非常多！',
          html: scene(P(300, 302, A('ox'), '', 0, .95) + sweat(340, 235) + P(520, 302, BOOKPILE2, '', 0, 1.6) + hearts(430, 200)) },
        { minDur: 6400, sub: '汗牛充棟：形容書籍極多，堆滿房屋。',
          html: scene(P(280, 302, A('ox'), '', 0, .95) + P(500, 302, BOOKPILE2, '', 0, 1.7) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">汗牛充棟</text>') }
      ];
    },
    /* 坐以待斃 */
    i035: function () {
      var RAFT = '<g stroke="#a8734a" stroke-width="8" stroke-linecap="round"><line x1="-44" y1="0" x2="44" y2="0"/><line x1="-44" y1="-9" x2="44" y2="-9"/></g>';
      return [
        { minDur: 6800, sub: '洪水慢慢漲上來了！有人卻只坐在原地發呆：「反正逃不掉，等著吧……」',
          html: scene('<rect y="286" width="800" height="54" fill="#7fb2e0"/>' +
            P(360, 296, '<g class="st-slump">' + A('kid', 'sad') + '</g>') + sweat(310, 200) + qmark(430, 185)) },
        { minDur: 6800, sub: '另一個人立刻動手：綁木筏、堆沙包、找高地——絕不坐著等災難上門！',
          html: scene('<rect y="292" width="800" height="48" fill="#7fb2e0"/>' +
            P(340, 296, A('kid', 'angry') + P(24, -42, HAMMER)) + P(520, 300, RAFT) + bang(440, 230)) },
        { minDur: 6800, sub: '「坐以待斃」：不主動想辦法，被動地等著失敗——遇到危難，行動才有生機！',
          html: scene(P(280, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, .95) + sweat(320, 200) +
            P(540, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, .98) + hearts(610, 190)) },
        { minDur: 6400, sub: '坐以待斃：不主動行動，被動等待失敗。',
          html: scene(P(380, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, 1.05) + qmark(450, 182) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">坐以待斃</text>') }
      ];
    },
    /* 臨危不懼 */
    i036: function () {
      var FIRE3 = '<g class="st-flick"><path d="M0 -8 q-16 -20 0 -38 q3 11 11 15 q9 -9 7 -18 q13 16 2 34 q-9 11 -20 7 z" fill="#ff9c40"/><path d="M2 -10 q-8 -11 0 -22 q7 9 9 13 q3 9 -9 9 z" fill="#ffd166"/></g>';
      return [
        { minDur: 6800, sub: '教室旁的垃圾桶突然冒出火苗！同學們嚇得四散，班長卻鎮定地大喊：「別慌，走安全門！」',
          html: scene(P(560, 300, FIRE3, '', 0, 1.1) +
            P(300, 302, A('kid', 'happy')) + bang(480, 230) +
            P(180, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .9) + sweat(240, 195)) },
        { minDur: 6800, sub: '他一邊指揮大家排隊離開，一邊請老師拿滅火器——整個過程冷靜又有條理！',
          html: scene(P(300, 302, A('kid', 'happy') +
              '<path d="M18 -60 q14 -4 22 2" stroke="#ffe3c1" stroke-width="6" fill="none" stroke-linecap="round"/>') +
            P(470, 302, A('kid', 'happy'), 'st-inR', .2, .93) + P(600, 302, A('kid', 'happy'), 'st-inR', .4, .9) + hearts(390, 180)) },
        { minDur: 6600, sub: '「臨危不懼」：面對危險不慌不怕、勇敢沉著——關鍵時刻最可靠的品格！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.08) + hearts(490, 185) + bang(300, 195)) },
        { minDur: 6400, sub: '臨危不懼：面臨危險不害怕，勇敢沉著。',
          html: scene(P(560, 300, FIRE3, '', 0, .95) + P(340, 302, A('kid', 'happy'), '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">臨危不懼</text>') }
      ];
    },
    /* 臨危授命 */
    i037: function () {
      var BATON2 = '<rect x="-4" y="-20" width="8" height="26" rx="4" fill="#e0a458" stroke="#c08838" stroke-width="2"/>';
      return [
        { minDur: 7000, sub: '接力賽最後一棒的選手突然扭傷了腳！教練看向替補的小捷：「現在，只能靠你了！」',
          html: scene(P(300, 306, '<g class="st-faint">' + A('kid', 'sad') + '</g>', '', 0, .95) + sweat(340, 210) +
            P(500, 302, A('kid', 'happy'), '', 0, 1.02, true) +
            P(640, 302, A('kid', 'wow'), '', 0, .95) + qmark(690, 188)) },
        { minDur: 6800, sub: '小捷深吸一口氣接過棒子——在最危急的時刻，接下最重要的任務！',
          html: scene(P(400, 302, A('kid', 'angry') + P(30, -50, BATON2), '', 0, 1.05) + bang(500, 190) + hearts(300, 190)) },
        { minDur: 6800, sub: '「臨危授命」：在危急時刻接受重任——被託付的人，責任重大也光榮！',
          html: scene(P(360, 302, A('kid', 'happy') + P(30, -50, BATON2), 'st-dashL', 0, 1.05) +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="120" y1="240" x2="210" y2="240"/></g>' + hearts(500, 195)) },
        { minDur: 6400, sub: '臨危授命：在危急時刻接受重要職責。',
          html: scene(P(400, 302, A('kid', 'angry') + P(30, -50, BATON2), '', 0, 1.08) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">臨危授命</text>') }
      ];
    },
    /* 明眼人 */
    i038: function () {
      var BIGEYE3 = '<path d="M-28 0 Q0 -22 28 0 Q0 22 -28 0 Z" fill="#fff" stroke="#4a3200" stroke-width="2.8"/><circle cx="0" cy="0" r="9" fill="#6b4a32"/><circle cx="3" cy="-3" r="2.8" fill="#fff"/>';
      var VASEFAKE = '<path d="M-10 0 Q-15 -10 -10 -22 Q-5 -28 -7 -34 L7 -34 Q5 -28 10 -22 Q15 -10 10 0 Z" fill="#8fd0c0" stroke="#5aa896" stroke-width="2.4"/><path d="M-4 -18 l8 8 M4 -18 l-8 8" stroke="#c96a5a" stroke-width="1.8"/>';
      return [
        { minDur: 6800, sub: '市場上有人喊：「祖傳青花瓷，便宜賣！」圍觀的人議論紛紛，看不出真假。',
          html: scene(P(430, 296, VASEFAKE, '', 0, 1.3) +
            P(260, 302, A('kid', 'happy')) + P(600, 302, A('kid', 'wow'), '', .2, .93, true) + qmark(520, 190)) },
        { minDur: 6800, sub: '一位懂行的老先生瞄了一眼就搖頭：「釉色不對，這是新做的仿品。」——行家一出手，就知有沒有！',
          html: scene(P(430, 296, VASEFAKE, '', 0, 1.1) +
            P(280, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>') + bang(360, 195)) },
        { minDur: 6600, sub: '「明眼人」：有眼光、有見識的人——一眼就能看出門道！',
          html: scene(P(400, 200, BIGEYE3, '', 0, 1.4) + P(280, 302, A('kid', 'happy')) + hearts(490, 240)) },
        { minDur: 6400, sub: '明眼人：有眼光、有見識的人。',
          html: scene(P(400, 210, BIGEYE3, '', 0, 1.6) +
            '<text x="400" y="310" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">明眼人</text>') }
      ];
    },
    /* 鳳毛麟角 */
    i049: function () {
      var PHOENIXFEATHER = '<path d="M0 0 q-12 -22 0 -44 q12 22 0 44 z" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2"/><line x1="0" y1="0" x2="0" y2="-40" stroke="#e07ba3" stroke-width="1.6"/>' +
        '<circle cx="0" cy="-48" r="4" fill="#ffd97a"/>';
      var SPARK = '<g class="st-tw"><path d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z" fill="#ffd97a"/></g>';
      return [
        { minDur: 6800, sub: '傳說中，鳳凰的羽毛、麒麟的角，一百年也難見到一次——是世上最稀有的寶物！',
          html: scene(P(360, 250, PHOENIXFEATHER, '', 0, 1.5) + P(500, 230, SPARK) + P(280, 210, SPARK) +
            P(180, 302, A('kid', 'wow'), '', 0, .92) + hearts(260, 210)) },
        { minDur: 6800, sub: '就像全國比賽的金牌選手、百年一遇的天才——人群中極少極少的佼佼者！',
          html: scene(P(400, 302, A('kid', 'happy') + P(0, -104, '<circle cx="0" cy="0" r="12" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.6"/><text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#8a5a33">1</text>', '', 0, 1.1), '', 0, 1.05) +
            P(220, 302, A('kid', 'happy'), '', 0, .85) + P(580, 302, A('kid', 'happy'), '', .2, .85) + hearts(400, 165)) },
        { minDur: 6600, sub: '「鳳毛麟角」：極為罕見、稀有難得的人或物！',
          html: scene(P(400, 250, PHOENIXFEATHER, '', 0, 1.3) + P(300, 220, SPARK) + P(500, 225, SPARK) + hearts(400, 300)) },
        { minDur: 6400, sub: '鳳毛麟角：極為罕見，稀有難得。',
          html: scene(P(400, 255, PHOENIXFEATHER, '', 0, 1.5) + P(290, 220, SPARK) + P(510, 218, SPARK) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">鳳毛麟角</text>') }
      ];
    },
    /* 萬紫千紅 */
    i225: function () {
      function flower5(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="-16" stroke="#5f8a46" stroke-width="3"/>' +
          '<circle cx="0" cy="-22" r="5" fill="' + color + '"/><circle cx="-6" cy="-18" r="5" fill="' + color + '"/><circle cx="6" cy="-18" r="5" fill="' + color + '"/><circle cx="0" cy="-14" r="5" fill="' + color + '"/><circle cx="0" cy="-18" r="3.4" fill="#ffe066"/></g>');
      }
      return [
        { minDur: 6800, sub: '春天的花博會場一望無際：紫的、紅的、粉的、黃的……上千種花同時盛開！',
          html: scene(flower5(180, 320, '#c9a8e0', 0) + flower5(260, 318, '#e85a4f', .2) + flower5(340, 322, '#ff9eb5', .4) +
            flower5(420, 318, '#ffd97a', .1) + flower5(500, 322, '#c9a8e0', .3) + flower5(580, 318, '#e85a4f', .5) + flower5(660, 320, '#a5c8ff', .6) +
            P(120, 302, A('kid', 'wow'), '', 0, .9)) },
        { minDur: 6600, sub: '宋朝朱熹的詩說：「萬紫千紅總是春」——滿眼繽紛，就是春天的顏色！',
          html: scene(flower5(240, 320, '#c9a8e0', 0) + flower5(360, 318, '#e85a4f', .3) + flower5(480, 322, '#ff9eb5', .5) +
            P(620, 302, A('kid', 'happy') + P(-40, -56, '<rect x="-20" y="-14" width="40" height="26" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2" transform="rotate(-8)"/><path d="M-14 -7 h10 M-14 -1 h10 M4 -8 h10 M4 -2 h10" stroke="#8fa3bf" stroke-width="1.8" transform="rotate(-8)"/>', '', 0, .95)) + hearts(430, 240)) },
        { minDur: 6600, sub: '「萬紫千紅」：百花齊放、色彩絢麗——形容繁盛美好的景象！',
          html: scene(flower5(220, 320, '#e85a4f', 0) + flower5(330, 318, '#c9a8e0', .2) + flower5(440, 322, '#ffd97a', .4) + flower5(550, 318, '#ff9eb5', .6) +
            P(660, 210, A('butterfly'), '', 0, .9) + hearts(400, 250)) },
        { minDur: 6400, sub: '萬紫千紅：百花齊放，色彩絢麗繁盛。',
          html: scene(flower5(230, 320, '#c9a8e0', 0) + flower5(340, 318, '#e85a4f', .2) + flower5(450, 322, '#ff9eb5', .4) + flower5(560, 318, '#ffd97a', .6) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">萬紫千紅</text>') }
      ];
    },
    /* 鳥語花香 */
    i226: function () {
      function flower6(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="-15" stroke="#5f8a46" stroke-width="3"/>' +
          '<circle cx="0" cy="-21" r="4.8" fill="' + color + '"/><circle cx="-5.6" cy="-17" r="4.8" fill="' + color + '"/><circle cx="5.6" cy="-17" r="4.8" fill="' + color + '"/><circle cx="0" cy="-13" r="4.8" fill="' + color + '"/><circle cx="0" cy="-17" r="3.2" fill="#ffe066"/></g>');
      }
      return [
        { minDur: 6600, sub: '清晨的山林步道上：小鳥在枝頭吱吱喳喳唱歌，花香隨著微風一陣陣飄來——',
          html: scene(P(140, 302, TREE, '', 0, 1.2) + P(220, 170, A('bird')) + notes(300, 130) +
            flower6(420, 320, '#ff9eb5', 0) + flower6(520, 318, '#ffd97a', .3) +
            P(640, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6600, sub: '深深吸一口氣，聽著鳥鳴、聞著花香——整個人的心情都亮了起來！',
          html: scene(P(560, 170, A('bird')) + notes(480, 140) + flower6(240, 320, '#c9a8e0', 0) +
            P(380, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(300, 190)) },
        { minDur: 6600, sub: '「鳥語花香」：鳥兒鳴唱、花朵飄香——形容春光明媚的美好景象！',
          html: scene(P(200, 180, A('bird')) + P(600, 190, A('bird'), '', .3, .9, true) + notes(400, 140) +
            flower6(300, 320, '#ff9eb5', 0) + flower6(500, 318, '#ffd97a', .4) + hearts(400, 250)) },
        { minDur: 6400, sub: '鳥語花香：鳥兒鳴唱，花朵飄香，春光明媚。',
          html: scene(P(240, 180, A('bird')) + notes(330, 145) + flower6(400, 320, '#ff9eb5', 0) + flower6(520, 318, '#c9a8e0', .3) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">鳥語花香</text>') }
      ];
    },
    /* 一絲不苟 */
    i227: function () {
      var NEEDLEWORK = '<rect x="-24" y="-24" width="48" height="48" rx="5" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<path d="M-14 -8 q7 -8 14 0 q7 8 14 0" stroke="#e07ba3" stroke-width="2.6" fill="none"/>' +
        '<path d="M-14 6 q7 -8 14 0 q7 8 14 0" stroke="#5c82ba" stroke-width="2.6" fill="none"/>' +
        '<line x1="16" y1="-18" x2="24" y2="-26" stroke="#8b93a3" stroke-width="1.8"/>';
      return [
        { minDur: 6800, sub: '刺繡老師傅一針一線慢慢繡：每一針的距離、每一條線的顏色，全都分毫不差！',
          html: scene(P(430, 280, NEEDLEWORK, '', 0, 1.3) +
            P(260, 302, A('kid', 'happy')) + hearts(340, 195)) },
        { minDur: 6800, sub: '小潔寫作業也是一絲不苟：字寫得端端正正，寫錯了立刻擦掉重寫。',
          html: scene(P(340, 302, A('kid', 'happy') + P(-44, -50, '<rect x="-16" y="-20" width="32" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/><path d="M-9 -12 h18 M-9 -4 h18 M-9 4 h18 M-9 12 h12" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, 1)) + hearts(460, 190)) },
        { minDur: 6600, sub: '「苟」是隨便——連一根絲那麼小的地方都不隨便，就是「一絲不苟」！',
          html: scene(P(400, 280, NEEDLEWORK, '', 0, 1.2) + bang(520, 210) + hearts(300, 220)) },
        { minDur: 6400, sub: '一絲不苟：做事認真仔細，一點也不馬虎。',
          html: scene(P(400, 285, NEEDLEWORK, '', 0, 1.35) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一絲不苟</text>') }
      ];
    },
    /* 井然有序 */
    i228: function () {
      var SHELFBOOKS = '<g stroke="#a8734a" stroke-width="4"><line x1="-90" y1="0" x2="-90" y2="-96"/><line x1="90" y1="0" x2="90" y2="-96"/><line x1="-90" y1="-48" x2="90" y2="-48"/><line x1="-90" y1="-96" x2="90" y2="-96"/></g>' +
        '<g stroke-width="1.8"><rect x="-80" y="-92" width="12" height="42" fill="#e85a4f" stroke="#c94a3f"/><rect x="-66" y="-92" width="12" height="42" fill="#e0a458" stroke="#c08838"/><rect x="-52" y="-92" width="12" height="42" fill="#6fae58" stroke="#548a40"/><rect x="-38" y="-92" width="12" height="42" fill="#5c82ba" stroke="#46689a"/>' +
        '<rect x="-80" y="-44" width="12" height="42" fill="#c9a8e0" stroke="#a884c4"/><rect x="-66" y="-44" width="12" height="42" fill="#5c82ba" stroke="#46689a"/><rect x="-52" y="-44" width="12" height="42" fill="#e0a458" stroke="#c08838"/></g>';
      return [
        { minDur: 6800, sub: '圖書館裡的書照著編號一本本排好，書架一排排整整齊齊——要找哪本，一下就找到！',
          html: scene(P(430, 302, SHELFBOOKS) +
            P(220, 302, A('kid', 'happy')) + hearts(300, 195)) },
        { minDur: 6800, sub: '放學排路隊也是：一班接一班、一列跟一列，秩序井然，又快又安全！',
          html: scene(P(240, 302, A('kid', 'happy'), 'st-strut', 0, .95) + P(360, 302, A('kid', 'happy'), 'st-strut', .05, .93) +
            P(480, 302, A('kid', 'happy'), 'st-strut', .1, .91) + P(600, 302, A('kid', 'happy'), 'st-strut', .15, .89)) },
        { minDur: 6600, sub: '「井然有序」：整齊而有條理——東西有序、做事有序，效率自然高！',
          html: scene(P(430, 302, SHELFBOOKS, '', 0, .95) + P(230, 302, A('kid', 'happy')) + bang(330, 200)) },
        { minDur: 6400, sub: '井然有序：整齊而有條理。',
          html: scene(P(400, 302, SHELFBOOKS, '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">井然有序</text>') }
      ];
    },
    /* 迫不及待 */
    i229: function () {
      var GIFT3 = '<rect x="-18" y="-28" width="36" height="28" rx="4" fill="#a5d47c" stroke="#7cab6e" stroke-width="2.4"/><line x1="0" y1="-28" x2="0" y2="0" stroke="#fff" stroke-width="3.4"/><line x1="-18" y1="-14" x2="18" y2="-14" stroke="#fff" stroke-width="3.4"/><path d="M-6 -28 q-8 -10 0 -12 q5 -1 6 6 q1 -7 6 -6 q8 2 0 12 z" fill="#fff"/>';
      return [
        { minDur: 6800, sub: '快遞送來期待已久的新書！小佑迫不及待，鞋都來不及脫就衝過去拆包裹！',
          html: scene(P(500, 292, GIFT3, '', 0, 1.2) +
            P(300, 302, A('kid', 'happy'), 'st-dashL') + sweat(250, 195) + bang(430, 220)) },
        { minDur: 6600, sub: '拆開的手都在發抖——急得一秒鐘也等不下去啦！',
          html: scene(P(400, 302, A('kid', 'wow') + P(-44, -50, GIFT3, '', 0, 1)) + bang(500, 195) + hearts(300, 190)) },
        { minDur: 6600, sub: '「迫不及待」：急切得不能再等待——那種心癢癢的期待，人人都懂！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) +
            P(520, 292, GIFT3, '', 0, .95) + hearts(440, 185)) },
        { minDur: 6400, sub: '迫不及待：急切得不能再等待。',
          html: scene(P(340, 302, A('kid', 'happy'), 'st-dashL', 0, 1.08) + P(540, 292, GIFT3, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">迫不及待</text>') }
      ];
    },
    /* 恍然大悟 */
    i230: function () {
      var BULB = '<circle cx="0" cy="-14" r="16" fill="#ffe066" stroke="#e8b84a" stroke-width="2.6"/>' +
        '<rect x="-7" y="0" width="14" height="9" rx="3" fill="#b8ae9c"/>' +
        '<g class="st-rays" style="transform-origin:0px -14px"><g stroke="#ffd97a" stroke-width="3.4" stroke-linecap="round"><line x1="0" y1="-40" x2="0" y2="-33"/><line x1="-24" y1="-14" x2="-18" y2="-14"/><line x1="24" y1="-14" x2="18" y2="-14"/></g></g>';
      return [
        { minDur: 6800, sub: '數學題想了半天解不出來，小恩抓著頭髮直嘆氣……',
          html: scene(P(360, 302, A('kid', 'sad') + P(-44, -50, '<rect x="-16" y="-20" width="32" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/><text x="0" y="4" text-anchor="middle" font-size="15" fill="#8fa3bf">?</text>', '', 0, 1)) +
            sweat(300, 192) + qmark(440, 178)) },
        { minDur: 6800, sub: '老師一句提示：「先畫圖看看！」——啊！他腦中燈泡一亮，一下子全明白了！',
          html: scene(P(360, 302, A('kid', 'wow') + P(0, -110, BULB, '', 0, 1.1)) + bang(470, 185) +
            P(580, 302, A('kid', 'happy'), '', 0, .95, true)) },
        { minDur: 6600, sub: '「恍然大悟」：忽然完全明白過來——那一刻真是暢快！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>' + P(0, -116, BULB, '', 0, 1)) + hearts(500, 195)) },
        { minDur: 6400, sub: '恍然大悟：忽然完全明白過來。',
          html: scene(P(400, 302, A('kid', 'wow') + P(0, -110, BULB, '', 0, 1.2)) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">恍然大悟</text>') }
      ];
    },
    /* 再接再厲 */
    i231: function () {
      var MEDAL = '<circle cx="0" cy="0" r="13" fill="#c9d6e8" stroke="#8b93a3" stroke-width="2.4"/><text x="0" y="5" text-anchor="middle" font-size="12" font-weight="bold" fill="#5c82ba">2</text><path d="M-6 -12 l-4 -10 h20 l-4 10" fill="#e85a4f"/>';
      return [
        { minDur: 6800, sub: '游泳比賽拿到第二名——小蓉有點可惜，但她擦乾眼淚：「下次一定要拿第一！」',
          html: scene(P(360, 302, A('kid', 'happy') + P(0, -104, MEDAL, '', 0, 1.1)) +
            P(560, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(460, 190)) },
        { minDur: 6800, sub: '她天天加練：划水、轉身、衝刺，一次比一次進步——一次又一次繼續努力！',
          html: scene('<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
            '<g class="st-wavemove"><path d="M-40 274 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>' +
            P(400, 290, '<g transform="rotate(76)">' + A('kid', 'happy') + '</g>') + sweat(320, 230) + bang(540, 230)) },
        { minDur: 6600, sub: '「再接再厲」：一次又一次地繼續努力——成功屬於不放棄的人！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 185) + bang(300, 195)) },
        { minDur: 6400, sub: '再接再厲：一次又一次地繼續努力。',
          html: scene(P(400, 302, A('kid', 'happy') + P(0, -104, MEDAL, '', 0, 1.1), '', 0, 1.05) + hearts(500, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">再接再厲</text>') }
      ];
    },
    /* 精益求精 */
    i232: function () {
      var CUP2 = '<path d="M-14 -34 h28 v10 q0 14 -14 16 q-14 -2 -14 -16 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/><rect x="-4" y="-8" width="8" height="8" fill="#c98f2a"/><rect x="-12" y="0" width="24" height="6" rx="2.4" fill="#c98f2a"/>';
      var VIOLIN = '<path d="M-8 0 q-12 -4 -12 -16 q0 -8 6 -10 q-4 -6 0 -12 q4 -6 10 -4 l0 -22 l4 0 l0 22 q6 -2 10 4 q4 6 0 12 q6 2 6 10 q0 12 -12 16 q-6 2 -12 0 z" fill="#c9762f" stroke="#a85a1e" stroke-width="2"/><line x1="0" y1="-64" x2="0" y2="-42" stroke="#6d4426" stroke-width="2.6"/>';
      return [
        { minDur: 6800, sub: '小提琴比賽得了第一名！但小育回家後照樣練習：「這一段，還可以拉得更好。」',
          html: scene(P(340, 302, A('kid', 'happy') + P(30, -50, VIOLIN, '', 0, .9)) +
            P(540, 290, CUP2, '', 0, 1) + notes(260, 180)) },
        { minDur: 6800, sub: '已經很好了，還要求更好——把「好」磨成「更好」，把「更好」磨成「最好」！',
          html: scene(P(360, 302, A('kid', 'happy') + P(30, -50, VIOLIN, '', 0, .95)) + notes(460, 165) + hearts(270, 188) + bang(540, 200)) },
        { minDur: 6600, sub: '「精益求精」：追求卓越、永不滿足於現狀——大師都是這樣煉成的！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) + hearts(490, 188) + notes(310, 180)) },
        { minDur: 6400, sub: '精益求精：已經很好，還要求更好。',
          html: scene(P(360, 302, A('kid', 'happy') + P(30, -50, VIOLIN, '', 0, 1)) + notes(470, 170) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">精益求精</text>') }
      ];
    },
    /* 如魚得水 */
    i234: function () {
      var SEA8 = '<rect y="262" width="800" height="78" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 274 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>';
      return [
        { minDur: 6800, sub: '擱淺在沙灘上的小魚奄奄一息——一放回水裡，立刻活蹦亂跳、游得飛快！',
          html: scene(SEA8 + '<ellipse cx="200" cy="330" rx="180" ry="40" fill="#e8d5a8"/>' +
            P(430, 296, A('fish'), '', 0, 1.1) + hearts(520, 230) + bang(340, 240)) },
        { minDur: 7000, sub: '三國的劉備得到諸葛亮相助後說：「我得到孔明，就像魚得到水一樣呀！」',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(520, 302, A('kid', 'happy') + '<path d="M0 0 L-16 -34 A22 22 0 0 1 16 -34 Z" fill="#f4f1e8" stroke="#c9bfa8" stroke-width="2.4" transform="translate(-30,-40) scale(.9)"/>', '', 0, .98, true) + hearts(410, 178)) },
        { minDur: 6800, sub: '轉學生小柏加入棋社後如魚得水，天天下得不亦樂乎——找到最適合自己的地方了！',
          html: scene(P(340, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', .2, .95, true) +
            P(430, 250, '<rect x="-22" y="-22" width="44" height="44" rx="5" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.4"/>', '', 0, .9) + hearts(420, 175)) },
        { minDur: 6400, sub: '如魚得水：像魚回到水中，得到契合的環境或夥伴。',
          html: scene(SEA8 + P(400, 294, A('fish'), '', 0, 1.2) + hearts(500, 230) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">如魚得水</text>') }
      ];
    },
    /* 半信半疑 */
    i240: function () {
      return [
        { minDur: 6800, sub: '同學神祕兮兮地說：「操場的老榕樹下埋著寶藏！」小晉聽了，有點想信，又覺得怪怪的……',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(520, 302, A('kid', 'wow'), '', 0, .97, true) + qmark(570, 182) +
            P(150, 302, TREE, '', 0, 1.1)) },
        { minDur: 6800, sub: '一半相信、一半懷疑，心裡像有兩個小人在拔河——「要不要去挖挖看呢？」',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) +
            P(300, 190, '<circle cx="0" cy="0" r="26" fill="#fff" opacity=".9"/><path d="M-8 4 l6 6 l12 -12" stroke="#548a40" stroke-width="3.4" fill="none" stroke-linecap="round"/>', '', 0, .95) +
            P(500, 190, '<circle cx="0" cy="0" r="26" fill="#fff" opacity=".9"/><text x="0" y="8" text-anchor="middle" font-size="26" font-weight="bold" fill="#c96a5a">?</text>', '', .3, .95)) },
        { minDur: 6800, sub: '「半信半疑」：有點相信、又有點懷疑——查證清楚，才不會被騙也不會錯過！',
          html: scene(P(340, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe')) + P(150, 302, TREE, '', 0, 1.05) + qmark(430, 185)) },
        { minDur: 6400, sub: '半信半疑：有點相信，又有點懷疑。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) +
            P(310, 195, '<circle cx="0" cy="0" r="22" fill="#fff" opacity=".9"/><path d="M-7 3 l5 5 l10 -10" stroke="#548a40" stroke-width="3" fill="none" stroke-linecap="round"/>') +
            P(490, 195, '<circle cx="0" cy="0" r="22" fill="#fff" opacity=".9"/><text x="0" y="7" text-anchor="middle" font-size="22" font-weight="bold" fill="#c96a5a">?</text>') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">半信半疑</text>') }
      ];
    },
    /* 津津有味 */
    i241: function () {
      var NOODLES = '<path d="M-16 -6 q0 10 16 10 q16 0 16 -10 z" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.4"/><path d="M-10 -6 q2 -10 -2 -16 M0 -6 q2 -12 -1 -18 M10 -6 q2 -8 0 -14" stroke="#ffe066" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6600, sub: '媽媽煮的牛肉麵香噴噴——小宇呼嚕呼嚕吃得津津有味，連湯都喝得一滴不剩！',
          html: scene(P(360, 302, A('kid', 'happy') + P(38, -46, NOODLES, '', 0, 1.1)) + hearts(470, 190) + notes(270, 185)) },
        { minDur: 6800, sub: '聽爺爺講古早的故事，他也聽得津津有味，眼睛發亮：「後來呢？後來呢？」',
          html: scene(P(300, 302, A('kid', 'wow')) + qmark(360, 180) +
            P(520, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05, true) + notes(430, 170)) },
        { minDur: 6600, sub: '「津津有味」：吃得有滋味，或聽得、看得興致盎然！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -50, '<rect x="-16" y="-20" width="32" height="40" rx="3" fill="#a5c8ff" stroke="#5c82ba" stroke-width="2.4"/>', '', 0, .95)) + hearts(470, 188)) },
        { minDur: 6400, sub: '津津有味：吃得有滋味或聽得有興致。',
          html: scene(P(380, 302, A('kid', 'happy') + P(38, -46, NOODLES, '', 0, 1.15)) + hearts(490, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">津津有味</text>') }
      ];
    },
    /* 目瞪口呆 */
    i242: function () {
      var OPENMOUTH2 = '<ellipse cx="0" cy="-38" rx="6" ry="9" fill="#3a2e26"/>';
      var BIGEYES = '<circle cx="-8" cy="-52" r="6.4" fill="#fff" stroke="#3a2e26" stroke-width="2"/><circle cx="8" cy="-52" r="6.4" fill="#fff" stroke="#3a2e26" stroke-width="2"/><circle cx="-8" cy="-52" r="2.6" fill="#3a2e26"/><circle cx="8" cy="-52" r="2.6" fill="#3a2e26"/>';
      return [
        { minDur: 6800, sub: '魔術師把手帕一抖——變出一隻活生生的鴿子！台下的小朋友全都看傻了。',
          html: scene(P(300, 302, A('kid', 'happy') +
              '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>') +
            P(400, 170, A('bird')) + bang(470, 130) +
            P(580, 302, A('kid', 'wow') + BIGEYES + OPENMOUTH2, '', 0, .95)) },
        { minDur: 6600, sub: '眼睛瞪得圓圓的、嘴巴張得大大的，半天說不出一句話——嚇到了、也驚呆了！',
          html: scene(P(400, 302, A('kid', 'wow') + BIGEYES + OPENMOUTH2, '', 0, 1.08) + sweat(330, 190) + qmark(480, 180)) },
        { minDur: 6600, sub: '「目瞪口呆」：瞪大眼睛說不出話——形容非常驚訝的樣子！',
          html: scene(P(320, 302, A('kid', 'wow') + BIGEYES + OPENMOUTH2) +
            P(500, 302, A('kid', 'wow') + BIGEYES + OPENMOUTH2, '', .2, .95) + bang(410, 180)) },
        { minDur: 6400, sub: '目瞪口呆：瞪大眼睛說不出話，受驚或驚訝。',
          html: scene(P(400, 302, A('kid', 'wow') + BIGEYES + OPENMOUTH2, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">目瞪口呆</text>') }
      ];
    },
    /* 狼吞虎嚥 */
    i426: function () {
      var BURGER = '<path d="M-14 -8 a14 8 0 0 1 28 0 z" fill="#e8b84a" stroke="#c98f2a" stroke-width="2"/><rect x="-14" y="-8" width="28" height="5" fill="#a5d47c"/><rect x="-14" y="-3" width="28" height="5" rx="1" fill="#8a5a33"/><path d="M-14 2 a14 7 0 0 0 28 0 z" fill="#e8b84a" stroke="#c98f2a" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '踢完球回家，小豪餓壞了——抓起漢堡三兩口就吞下肚，又猛又急！',
          html: scene(P(360, 302, A('kid', 'wow') + P(38, -50, BURGER, '', 0, 1.2)) + bang(470, 200) + sweat(280, 192)) },
        { minDur: 6800, sub: '像餓狼吞肉、像老虎嚥食——「狼吞虎嚥」就是吃相又猛又急的樣子！',
          html: scene(P(280, 302, A('fox'), '', 0, .95) + P(520, 302, A('tiger'), '', .2, .95) + bang(400, 200)) },
        { minDur: 6800, sub: '不過吃太快容易噎到、也傷腸胃——細嚼慢嚥，才是健康的吃法！',
          html: scene(P(360, 302, A('kid', 'happy') + P(38, -50, BURGER, '', 0, 1)) + hearts(470, 190)) },
        { minDur: 6400, sub: '狼吞虎嚥：吃東西又猛又急。',
          html: scene(P(340, 302, A('kid', 'wow') + P(38, -50, BURGER, '', 0, 1.15)) + P(560, 302, A('tiger'), '', 0, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">狼吞虎嚥</text>') }
      ];
    },
    /* 垂涎三尺 */
    i427: function () {
      var CAKE2 = '<rect x="-22" y="-18" width="44" height="18" rx="4" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2.4"/><path d="M-22 -18 q11 7 22 0 q11 7 22 0" stroke="#fff" stroke-width="3" fill="none"/><circle cx="0" cy="-24" r="4" fill="#e85a4f"/>';
      var DROOL = '<path d="M0 -34 q-2 8 0 14 q4 -2 3 -10 z" fill="#8fc6ff"/>';
      return [
        { minDur: 6800, sub: '蛋糕店的櫥窗裡擺著草莓蛋糕——小饞貓盯著看，口水都快流下來了！',
          html: scene(P(500, 290, CAKE2, '', 0, 1.3) +
            P(300, 302, A('kid', 'wow') + DROOL) + hearts(400, 200)) },
        { minDur: 6600, sub: '「垂涎」就是流口水——饞得口水掛了三尺長，太想吃、太想要啦！',
          html: scene(P(360, 302, A('kid', 'wow') + DROOL +
              '<path d="M2 -20 q-2 16 1 30" stroke="#8fc6ff" stroke-width="3" fill="none" stroke-linecap="round"/>', '', 0, 1.08) +
            P(540, 290, CAKE2, '', 0, 1.1) + qmark(280, 188)) },
        { minDur: 6800, sub: '別人的寶貝讓人垂涎三尺也不能搶——自己努力存錢買，吃起來最香！',
          html: scene(P(340, 302, A('kid', 'happy') + P(38, -50, CAKE2, '', 0, .9)) + hearts(460, 190)) },
        { minDur: 6400, sub: '垂涎三尺：非常貪饞或渴望得到。',
          html: scene(P(340, 302, A('kid', 'wow') + DROOL, '', 0, 1.08) + P(540, 288, CAKE2, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">垂涎三尺</text>') }
      ];
    },
    /* 飢腸轆轆 */
    i428: function () {
      var RUMBLE = '<g class="st-bang"><path d="M-10 0 q5 -8 10 0 q5 8 10 0" stroke="#e0a458" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>';
      var RICE = '<path d="M-16 -6 q0 12 16 12 q16 0 16 -12 z" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.4"/><ellipse cx="0" cy="-6" rx="16" ry="5" fill="#fff"/>';
      return [
        { minDur: 6800, sub: '爬了一上午的山，還沒到中餐時間——小杜的肚子「咕嚕咕嚕」叫個不停！',
          html: scene(P(360, 302, A('kid', 'sad') + P(0, -26, RUMBLE)) + sweat(300, 192) +
            P(600, 302, '<path d="M-90 0 L0 -110 L90 0 Z" fill="#a5c2b2"/>')) },
        { minDur: 6600, sub: '「轆轆」是車輪滾動的聲音——肚子餓得像車輪一樣叫，就是「飢腸轆轆」！',
          html: scene(P(400, 302, A('kid', 'sad') + P(0, -26, RUMBLE), '', 0, 1.08) + qmark(480, 182) + sweat(320, 192)) },
        { minDur: 6600, sub: '終於開飯啦！熱騰騰的飯一入口，整個人都活過來了！',
          html: scene(P(360, 302, A('kid', 'happy') + P(38, -46, RICE, '', 0, 1.1)) + hearts(470, 190)) },
        { minDur: 6400, sub: '飢腸轆轆：肚子餓得咕嚕作響。',
          html: scene(P(400, 302, A('kid', 'sad') + P(0, -26, RUMBLE), '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">飢腸轆轆</text>') }
      ];
    },
    /* 白紙黑字 */
    i429: function () {
      var CONTRACT = '<rect x="-22" y="-30" width="44" height="60" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>' +
        '<path d="M-14 -20 h28 M-14 -12 h28 M-14 -4 h28 M-14 4 h20" stroke="#3a2e26" stroke-width="2.2"/>' +
        '<path d="M-14 16 q8 -6 16 0" stroke="#c96a5a" stroke-width="2.4" fill="none"/>';
      return [
        { minDur: 6800, sub: '兄弟倆約好輪流洗碗，還寫在紙上、各自簽名：「每週一三五換人！」',
          html: scene(P(430, 270, CONTRACT, '', 0, 1.2) +
            P(280, 302, A('kid', 'happy')) + P(580, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(430, 200)) },
        { minDur: 6800, sub: '哥哥想耍賴？弟弟把紙一亮：「白紙黑字寫得清清楚楚，賴不掉喔！」',
          html: scene(P(300, 302, A('kid', 'happy') + P(-42, -56, CONTRACT, '', 0, .8)) + bang(400, 185) +
            P(540, 302, A('kid', 'wow'), '', 0, .97, true) + sweat(580, 198)) },
        { minDur: 6600, sub: '「白紙黑字」：寫成文字的憑據，清楚明確——說話算話，寫下來更可靠！',
          html: scene(P(400, 265, CONTRACT, '', 0, 1.35) + hearts(500, 220)) },
        { minDur: 6400, sub: '白紙黑字：寫成文字的憑據，清楚明確。',
          html: scene(P(400, 270, CONTRACT, '', 0, 1.4) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">白紙黑字</text>') }
      ];
    },
    /* 一清二楚 */
    i430: function () {
      var GLASS = '<circle cx="0" cy="0" r="20" fill="none" stroke="#8b93a3" stroke-width="4"/><line x1="14" y1="14" x2="28" y2="28" stroke="#8b93a3" stroke-width="5" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '玻璃窗擦得亮晶晶，窗外的每一片葉子、每一隻小鳥都看得一清二楚！',
          html: scene(P(430, 260, '<rect x="-70" y="-60" width="140" height="100" rx="6" fill="#aee3f5" stroke="#a8734a" stroke-width="5"/><line x1="0" y1="-60" x2="0" y2="40" stroke="#a8734a" stroke-width="4"/>') +
            P(470, 230, A('bird'), '', 0, .7) +
            P(220, 302, A('kid', 'happy')) + hearts(300, 200)) },
        { minDur: 6800, sub: '班長把班費記在帳本上：誰交了、買了什麼、剩多少——每一筆都一清二楚！',
          html: scene(P(340, 302, A('kid', 'happy') + P(-44, -52, '<rect x="-18" y="-24" width="36" height="48" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/><path d="M-10 -14 h20 M-10 -6 h20 M-10 2 h20 M-10 10 h14" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, 1)) + hearts(460, 190)) },
        { minDur: 6600, sub: '「一清二楚」：非常清楚明白——沒有一點含糊！',
          html: scene(P(400, 230, GLASS, '', 0, 1.5) + bang(500, 200) + P(260, 302, A('kid', 'happy'))) },
        { minDur: 6400, sub: '一清二楚：非常清楚明白。',
          html: scene(P(400, 240, GLASS, '', 0, 1.7) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一清二楚</text>') }
      ];
    },
    /* 一乾二淨 */
    i431: function () {
      var PLATE = '<ellipse cx="0" cy="0" rx="24" ry="8" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/><ellipse cx="0" cy="-1" rx="15" ry="4.6" fill="#e8f0f8"/>';
      var SPARKLE = '<g class="st-tw"><path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#ffd97a"/></g>';
      return [
        { minDur: 6600, sub: '晚餐太好吃了！小治把飯菜吃得一粒不剩，盤子乾淨得像洗過一樣！',
          html: scene(P(430, 292, PLATE, '', 0, 1.3) + P(500, 260, SPARKLE) +
            P(280, 302, A('kid', 'happy')) + hearts(380, 200)) },
        { minDur: 6800, sub: '大掃除之後，教室的地板、窗戶、黑板全被擦得一乾二淨，亮得反光！',
          html: scene(P(300, 302, A('kid', 'happy') + P(20, -34, '<line x1="0" y1="0" x2="20" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 0 l-10 12 M0 0 l-2 14 M0 0 l6 13" stroke="#c9a06c" stroke-width="3.4" stroke-linecap="round"/>')) +
            P(500, 240, SPARKLE) + P(580, 270, SPARKLE) + hearts(430, 200)) },
        { minDur: 6800, sub: '它還能形容「忘光光」：假期玩瘋了，老師教的內容忘得一乾二淨——這可不行呀！',
          html: scene(P(360, 302, A('kid', 'wow')) + qmark(430, 180) + sweat(300, 192) +
            P(540, 260, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><text x="0" y="6" text-anchor="middle" font-size="16" fill="#c9bfa8">?</text>')) },
        { minDur: 6400, sub: '一乾二淨：非常乾淨；一點不剩。',
          html: scene(P(400, 290, PLATE, '', 0, 1.4) + P(490, 250, SPARKLE) + P(310, 255, SPARKLE) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一乾二淨</text>') }
      ];
    },
    /* 三三兩兩 */
    i432: function () {
      return [
        { minDur: 6800, sub: '放學後的操場上，同學們三個一群、兩個一夥：有的聊天、有的打球、有的散步——',
          html: scene(P(220, 302, A('kid', 'happy'), '', 0, .92) + P(300, 302, A('kid', 'happy'), '', .1, .9) +
            P(480, 302, A('kid', 'happy'), '', .2, .93) + P(560, 302, A('kid', 'happy'), '', .3, .9) + P(640, 302, A('kid', 'happy'), '', .4, .88) +
            notes(260, 180) + hearts(560, 185)) },
        { minDur: 6600, sub: '不是整整齊齊的大隊伍，而是零零散散的小群體——這就是「三三兩兩」。',
          html: scene(P(240, 302, A('kid', 'happy'), 'st-strut', 0, .92) + P(320, 302, A('kid', 'happy'), 'st-strut', .1, .9) +
            P(540, 302, A('kid', 'happy'), 'st-strut', .3, .92) + P(620, 302, A('kid', 'happy'), 'st-strut', .4, .9)) },
        { minDur: 6600, sub: '黃昏的公園裡，人們三三兩兩散著步，悠悠閒閒，多愜意！',
          html: scene(P(150, 302, TREE, '', 0, 1.1) +
            P(300, 302, A('kid', 'happy'), 'st-strut', 0, .95) + P(380, 302, A('kid', 'happy'), 'st-strut', .1, .92) +
            P(580, 302, A('kid', 'happy'), 'st-strut', .3, .9) + hearts(460, 195), 'night') },
        { minDur: 6400, sub: '三三兩兩：三兩成群，零零散散。',
          html: scene(P(260, 302, A('kid', 'happy'), '', 0, .95) + P(340, 302, A('kid', 'happy'), '', .1, .92) +
            P(540, 302, A('kid', 'happy'), '', .2, .93) + P(620, 302, A('kid', 'happy'), '', .3, .9) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">三三兩兩</text>') }
      ];
    },
    /* 五湖四海 */
    i433: function () {
      var GLOBE = '<circle cx="0" cy="0" r="34" fill="#7fb2e0" stroke="#5a8fc4" stroke-width="3"/>' +
        '<path d="M-20 -14 q10 -8 22 -2 q8 4 4 12 q-10 6 -20 0 q-10 -4 -6 -10 z M2 12 q10 -4 16 4 q-4 8 -14 6 q-6 -4 -2 -10 z" fill="#a5d47c"/>';
      return [
        { minDur: 6800, sub: '夏令營開營了！有人從台北來、有人從台東來，還有從澎湖、金門坐飛機來的——',
          html: scene(P(240, 302, A('kid', 'happy'), 'st-inL', 0, .93) + P(360, 302, A('kid', 'happy'), 'st-inL', .2, .9) +
            P(540, 302, A('kid', 'happy'), 'st-inR', .1, .92, true) + P(650, 302, A('kid', 'happy'), 'st-inR', .3, .9, true) +
            hearts(450, 185)) },
        { minDur: 6600, sub: '「五湖四海」泛指天南地北、各個地方——來自五湖四海的朋友相聚，特別有緣！',
          html: scene(P(400, 200, GLOBE, '', 0, 1.4) + hearts(500, 240) + P(220, 302, A('kid', 'happy'), '', 0, .92)) },
        { minDur: 6600, sub: '大家圍成一圈自我介紹，口音不同、故鄉不同，很快就變成好朋友！',
          html: scene(P(280, 302, A('kid', 'happy'), '', 0, .95) + P(400, 302, A('kid', 'happy'), '', .1, .93) +
            P(520, 302, A('kid', 'happy'), '', .2, .95) + hearts(400, 172) + notes(480, 185)) },
        { minDur: 6400, sub: '五湖四海：泛指各地各方。',
          html: scene(P(400, 210, GLOBE, '', 0, 1.6) +
            '<text x="400" y="310" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">五湖四海</text>') }
      ];
    },
    /* 八面玲瓏 */
    i434: function () {
      var CRYSTAL = '<path d="M0 -30 L22 -10 L14 22 L-14 22 L-22 -10 Z" fill="#c9e2f5" stroke="#8fc0e0" stroke-width="2.6"/>' +
        '<path d="M0 -30 L0 22 M-22 -10 L14 22 M22 -10 L-14 22" stroke="#8fc0e0" stroke-width="1.6" opacity=".7"/>' +
        '<g class="st-tw"><circle cx="8" cy="-12" r="3" fill="#fff"/></g>';
      return [
        { minDur: 6800, sub: '玲瓏是精巧透亮的玉石——八個面都打磨得光滑閃亮，哪一面看都漂亮！',
          html: scene(P(400, 230, CRYSTAL, '', 0, 1.5) + P(230, 302, A('kid', 'wow'), '', 0, .92) + hearts(320, 210)) },
        { minDur: 7000, sub: '班上的康樂股長就是這樣：跟誰都合得來、什麼場面都應付得宜，人人誇他會做人。',
          html: scene(P(400, 302, A('kid', 'happy')) +
            P(250, 302, A('kid', 'happy'), '', .1, .9) + P(550, 302, A('kid', 'happy'), '', .2, .9) + hearts(400, 172) + hearts(300, 190)) },
        { minDur: 6800, sub: '「八面玲瓏」：處事圓滑、面面俱到——但太過圓滑失去原則，就不可取囉！',
          html: scene(P(400, 240, CRYSTAL, '', 0, 1.3) + qmark(510, 210) + P(250, 302, A('kid', 'happy'), '', 0, .92)) },
        { minDur: 6400, sub: '八面玲瓏：處事圓滑，面面俱到。',
          html: scene(P(400, 240, CRYSTAL, '', 0, 1.6) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">八面玲瓏</text>') }
      ];
    },
    /* 九死一生 */
    i435: function () {
      var STORMSEA2 = '<rect y="252" width="800" height="88" fill="#5a7fa8"/>' +
        '<g class="st-wavemove"><path d="M-40 268 q30 -22 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#8fb2d4" stroke-width="10" stroke-linecap="round"/></g>';
      var RAFT2 = '<g stroke="#a8734a" stroke-width="8" stroke-linecap="round"><line x1="-40" y1="0" x2="40" y2="0"/><line x1="-40" y1="-9" x2="40" y2="-9"/></g>';
      return [
        { minDur: 6800, sub: '探險家的木筏在暴風雨的大海上翻騰：大浪一個接一個，好幾次差點被吞沒！',
          html: scene(STORMSEA2 + P(400, 262, '<g transform="rotate(-12)">' + RAFT2 + P(0, -9, A('kid', 'wow'), '', 0, .8) + '</g>') +
            sweat(490, 190) + bang(250, 200), 'night') },
        { minDur: 6600, sub: '歷經千難萬險，他終於漂到岸邊獲救——撿回一條命！',
          html: scene('<rect y="272" width="800" height="68" fill="#7fb2e0"/><ellipse cx="620" cy="330" rx="180" ry="48" fill="#e8d5a8"/>' +
            P(560, 300, '<g transform="rotate(30)">' + A('kid', 'sad') + '</g>') +
            P(680, 302, A('kid', 'happy'), '', 0, .92) + hearts(620, 220)) },
        { minDur: 6600, sub: '「九死一生」：九分死、一分生——歷經極大危險而倖存！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + sweat(330, 192) + hearts(490, 188)) },
        { minDur: 6400, sub: '九死一生：歷經極大危險而倖存。',
          html: scene(STORMSEA2 + P(400, 265, '<g transform="rotate(-10)">' + RAFT2 + '</g>') +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">九死一生</text>', 'night') }
      ];
    },
    /* 十拿九穩 */
    i436: function () {
      var TARGET2 = '<circle cx="0" cy="-50" r="30" fill="#fff" stroke="#c96a5a" stroke-width="4"/><circle cx="0" cy="-50" r="18" fill="none" stroke="#c96a5a" stroke-width="4"/><circle cx="0" cy="-50" r="6" fill="#c96a5a"/><line x1="0" y1="-20" x2="0" y2="0" stroke="#a8734a" stroke-width="5"/>' +
        '<line x1="-3" y1="-52" x2="-26" y2="-58" stroke="#8a5a33" stroke-width="3.4"/>';
      return [
        { minDur: 6800, sub: '罰球線上，隊長穩穩舉球——他練了三年，這個位置十球能進九球！',
          html: scene(P(600, 302, '<line x1="0" y1="0" x2="0" y2="-110" stroke="#8b93a3" stroke-width="6"/><rect x="-26" y="-152" width="52" height="42" rx="4" fill="#fff" stroke="#8b93a3" stroke-width="3"/><ellipse cx="0" cy="-112" rx="18" ry="5" fill="none" stroke="#e0a458" stroke-width="4"/>') +
            P(300, 302, A('kid', 'happy') + P(34, -70, '<circle cx="0" cy="0" r="12" fill="#e0a458" stroke="#c08838" stroke-width="2.4"/>', '', 0, 1)) + hearts(220, 190)) },
        { minDur: 6600, sub: '「唰——」空心入網！平時苦練出來的把握，就是這麼穩！',
          html: scene(P(600, 302, '<line x1="0" y1="0" x2="0" y2="-110" stroke="#8b93a3" stroke-width="6"/><rect x="-26" y="-152" width="52" height="42" rx="4" fill="#fff" stroke="#8b93a3" stroke-width="3"/><ellipse cx="0" cy="-112" rx="18" ry="5" fill="none" stroke="#e0a458" stroke-width="4"/>') +
            P(590, 150, '<circle cx="0" cy="0" r="12" fill="#e0a458" stroke="#c08838" stroke-width="2.4"/>', '', 0, .95) + bang(600, 100) +
            P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>')) },
        { minDur: 6600, sub: '「十拿九穩」：十次拿九次——非常有把握！但別忘了，把握來自練習。',
          html: scene(P(500, 300, TARGET2, '', 0, 1.1) + P(280, 302, A('kid', 'happy')) + hearts(390, 195)) },
        { minDur: 6400, sub: '十拿九穩：非常有把握。',
          html: scene(P(500, 300, TARGET2, '', 0, 1.2) + P(280, 302, A('kid', 'happy'), '', 0, 1.02) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">十拿九穩</text>') }
      ];
    },
    /* 百年樹人 */
    i437: function () {
      function sapling(x, y) {
        return P(x, y, '<g class="st-grow"><line x1="0" y1="0" x2="0" y2="-22" stroke="#5f8a46" stroke-width="4"/><path d="M0 -22 q-8 -8 -4 -14 M0 -22 q8 -8 4 -14" stroke="#7cc47f" stroke-width="4" fill="none" stroke-linecap="round"/></g>');
      }
      var BIGTREE2 = '<rect x="-11" y="-70" width="22" height="70" rx="8" fill="#a8734a"/><circle cx="0" cy="-98" r="40" fill="#7cc47f"/><circle cx="-32" cy="-78" r="26" fill="#8fd08f"/><circle cx="32" cy="-80" r="27" fill="#8fd08f"/>';
      return [
        { minDur: 7000, sub: '《管子》說：「一年之計，莫如樹穀；十年之計，莫如樹木；終身之計，莫如樹人。」',
          html: scene(sapling(240, 320) + P(430, 302, BIGTREE2, '', 0, .8) +
            P(620, 302, A('kid', 'happy'), '', 0, .95) +
            P(140, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, .92)) },
        { minDur: 7000, sub: '種穀一年收成、種樹十年成材——培養一個人才，要花上百年的耐心！',
          html: scene(sapling(220, 320) + P(400, 302, BIGTREE2, '', 0, .95) +
            P(600, 302, A('kid', 'happy') + P(-42, -54, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95), '', 0, .95)) },
        { minDur: 6800, sub: '「百年樹人」：教育是長遠的大計——每一位用心的老師，都在種百年的樹！',
          html: scene(P(430, 302, BIGTREE2, '', 0, 1.05) +
            P(240, 302, A('kid', 'happy')) + P(620, 302, A('kid', 'happy'), '', .2, .92) + hearts(430, 170)) },
        { minDur: 6400, sub: '百年樹人：培育人才是長遠大計。',
          html: scene(sapling(250, 320) + P(480, 302, BIGTREE2, '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">百年樹人</text>') }
      ];
    },
    /* 千方百計 */
    i438: function () {
      var JARHIGH = '<path d="M-16 0 Q-22 -14 -14 -30 L14 -30 Q22 -14 16 0 Z" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2.6"/><rect x="-10" y="-36" width="20" height="8" rx="3" fill="#6d87ab"/>';
      var STOOL = '<rect x="-20" y="-14" width="40" height="8" rx="3" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"/><line x1="-14" y1="-6" x2="-14" y2="6" stroke="#a8734a" stroke-width="4"/><line x1="14" y1="-6" x2="14" y2="6" stroke="#a8734a" stroke-width="4"/>';
      return [
        { minDur: 6800, sub: '餅乾罐被放到櫃子最上層！小圓想了一個又一個辦法：墊椅子、拿掃把、疊枕頭——',
          html: scene(P(560, 200, JARHIGH, '', 0, 1) +
            P(560, 302, '<rect x="-40" y="-90" width="80" height="90" rx="5" fill="#c9a06c" stroke="#a8734a" stroke-width="3"/>') +
            P(340, 302, A('kid', 'wow') + P(-40, -20, STOOL, '', 0, .9)) + qmark(280, 185) + sweat(400, 192)) },
        { minDur: 6800, sub: '方法一個不行就換下一個——想盡各種辦法，就是「千方百計」！',
          html: scene(P(400, 302, A('kid', 'happy')) +
            P(280, 200, '<circle cx="0" cy="0" r="22" fill="#fff" opacity=".9"/><text x="0" y="7" text-anchor="middle" font-size="18" fill="#5c82ba">1</text>') +
            P(400, 170, '<circle cx="0" cy="0" r="22" fill="#fff" opacity=".9"/><text x="0" y="7" text-anchor="middle" font-size="18" fill="#548a40">2</text>', '', .2) +
            P(520, 200, '<circle cx="0" cy="0" r="22" fill="#fff" opacity=".9"/><text x="0" y="7" text-anchor="middle" font-size="18" fill="#c96a5a">3</text>', '', .4)) },
        { minDur: 6800, sub: '最後他搬來小樓梯，安安全全拿到了餅乾——動腦筋，總會有辦法！',
          html: scene(P(500, 302, '<g stroke="#a8734a" stroke-width="5" stroke-linecap="round"><line x1="-30" y1="0" x2="10" y2="-70"/><line x1="10" y1="0" x2="50" y2="-70"/><line x1="-18" y1="-22" x2="24" y2="-22"/><line x1="-6" y1="-44" x2="36" y2="-44"/></g>') +
            P(430, 302, A('kid', 'happy') + P(30, -90, JARHIGH, '', 0, .7)) + hearts(330, 190) + bang(560, 180)) },
        { minDur: 6400, sub: '千方百計：想盡各種辦法。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + qmark(330, 182) + bang(490, 188) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千方百計</text>') }
      ];
    },
    /* 千言萬語 */
    i439: function () {
      var LETTER = '<rect x="-20" y="-14" width="40" height="28" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/><path d="M-20 -14 L0 2 L20 -14" stroke="#c9bfa8" stroke-width="2" fill="none"/>';
      function bub5(x, y, dly) {
        return P(x, y, '<g class="st-zfloat"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<path d="M-18 -11 a15 12 0 1 1 30 4 q-2 5 -8 6 l-7 6 l1 -6 q-14 -2 -16 -10 z" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><text x="-2" y="-2" text-anchor="middle" font-size="10" fill="#8a7a4a">…</text></g>');
      }
      return [
        { minDur: 6800, sub: '好朋友要出國念書了。送別的時候，小瑄有好多好多話想說——卻不知從哪句開始……',
          html: scene(P(300, 302, A('kid', 'sad')) + bub5(250, 180, 0) + bub5(340, 155, .3) + bub5(420, 185, .6) +
            P(540, 302, A('kid', 'sad'), '', 0, .97, true) + sweat(580, 198)) },
        { minDur: 6800, sub: '最後她把千言萬語寫成長長的一封信，塞進朋友的行李：「到了要看喔！」',
          html: scene(P(300, 302, A('kid', 'happy') + P(38, -56, LETTER, '', 0, 1)) +
            P(520, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(420, 180)) },
        { minDur: 6600, sub: '「千言萬語」：想說的話多得說不完——濃濃的情意都在裡面！',
          html: scene(P(400, 260, LETTER, '', 0, 1.6) + hearts(500, 220) + bub5(280, 200, 0)) },
        { minDur: 6400, sub: '千言萬語：要說的話非常多。',
          html: scene(bub5(280, 200, 0) + bub5(400, 170, .3) + bub5(520, 205, .6) +
            '<text x="400" y="290" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千言萬語</text>') }
      ];
    },
    /* 萬水千山 */
    i440: function () {
      var MTS2 = '<path d="M-20 252 L140 110 L300 252 Z" fill="#8fb0a0"/><path d="M220 252 L400 140 L580 252 Z" fill="#a5c2b2" opacity=".9"/><path d="M500 252 L640 160 L800 252 Z" fill="#8fb0a0" opacity=".85"/>';
      var RIVERB = '<rect y="252" width="800" height="88" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 266 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>';
      return [
        { minDur: 6800, sub: '唐僧取經的路上：翻過一座山又一座山、渡過一條河又一條河……',
          html: scene(MTS2 + RIVERB +
            P(300, 296, A('kid', 'happy'), 'st-strut', 0, .95) + P(420, 296, A('horse'), 'st-strut', .2, .9) + sweat(350, 210)) },
        { minDur: 6600, sub: '「萬水千山」：一萬條河、一千座山——形容路途遙遠、艱難險阻！',
          html: scene(MTS2 + RIVERB + qmark(400, 120)) },
        { minDur: 6800, sub: '外婆住在遠方，但再遠也擋不住想念——放假時跨過萬水千山也要去看她！',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-strut') +
            P(560, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.02, true) + hearts(440, 180)) },
        { minDur: 6400, sub: '萬水千山：路途遙遠險阻。',
          html: scene(MTS2 + RIVERB +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">萬水千山</text>') }
      ];
    },
    /* 三令五申 */
    i441: function () {
      return [
        { minDur: 6800, sub: '游泳課前，老師一再叮嚀：「不准跑跳！不准推人！沒教練不准下水！」說了一遍又一遍。',
          html: scene(P(300, 302, A('kid', 'happy') +
              '<path d="M18 -60 q14 -4 22 2" stroke="#ffe3c1" stroke-width="6" fill="none" stroke-linecap="round"/>', '', 0, 1.05) +
            P(500, 302, A('kid', 'happy'), '', 0, .92) + P(610, 302, A('kid', 'happy'), '', .2, .9) +
            bang(390, 180) + '<rect y="286" width="800" height="54" fill="#7fb2e0"/>') },
        { minDur: 7000, sub: '這典故來自孫子練兵：他三令五申說明軍令，違令者依法處置——號令一出，人人遵守！',
          html: scene(P(300, 302, A('kid', 'angry')) + bang(380, 182) +
            P(500, 302, A('kid', 'happy'), 'st-strut', .1, .92) + P(610, 302, A('kid', 'happy'), 'st-strut', .2, .9)) },
        { minDur: 6600, sub: '「三令五申」：一再命令告誡——重要的規矩，多說幾次才記得牢！',
          html: scene(P(360, 302, A('kid', 'happy')) +
            P(280, 190, '<circle cx="0" cy="0" r="20" fill="#fff" opacity=".9"/><text x="0" y="7" text-anchor="middle" font-size="17" fill="#c96a5a">1</text>') +
            P(400, 165, '<circle cx="0" cy="0" r="20" fill="#fff" opacity=".9"/><text x="0" y="7" text-anchor="middle" font-size="17" fill="#e0a458">2</text>', '', .2) +
            P(520, 190, '<circle cx="0" cy="0" r="20" fill="#fff" opacity=".9"/><text x="0" y="7" text-anchor="middle" font-size="17" fill="#548a40">3</text>', '', .4)) },
        { minDur: 6400, sub: '三令五申：一再命令告誡。',
          html: scene(P(360, 302, A('kid', 'angry'), '', 0, 1.05) + bang(450, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">三令五申</text>') }
      ];
    },
    /* 四平八穩 */
    i442: function () {
      var TABLE4 = '<rect x="-50" y="-30" width="100" height="10" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>' +
        '<line x1="-40" y1="-20" x2="-40" y2="0" stroke="#a8734a" stroke-width="5"/><line x1="40" y1="-20" x2="40" y2="0" stroke="#a8734a" stroke-width="5"/>' +
        '<line x1="-20" y1="-20" x2="-20" y2="0" stroke="#a8734a" stroke-width="5"/><line x1="20" y1="-20" x2="20" y2="0" stroke="#a8734a" stroke-width="5"/>';
      return [
        { minDur: 6800, sub: '木匠師傅做的桌子四隻腳一樣長，怎麼搖都不晃——放在哪裡都平平穩穩！',
          html: scene(P(430, 302, TABLE4, '', 0, 1.3) +
            P(240, 302, A('kid', 'happy')) + hearts(330, 200)) },
        { minDur: 6800, sub: '寫字也講究四平八穩：橫平豎直、方方正正，看起來特別端正舒服！',
          html: scene(P(430, 260, '<rect x="-30" y="-30" width="60" height="60" rx="4" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/><text x="0" y="12" text-anchor="middle" font-size="36" font-weight="bold" fill="#3a2e26">正</text>') +
            P(240, 302, A('kid', 'happy') + P(24, -44, '<line x1="0" y1="0" x2="14" y2="-34" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 0 q-3 6 -1 11 q4 -2 5 -8 z" fill="#3a2e26"/>'))) },
        { minDur: 6800, sub: '「四平八穩」：穩妥周全——不過太求穩、不敢創新，有時也會錯過好機會喔！',
          html: scene(P(400, 302, TABLE4, '', 0, 1.1) + qmark(520, 210) + P(240, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6400, sub: '四平八穩：穩妥周全，也指保守不出錯。',
          html: scene(P(400, 302, TABLE4, '', 0, 1.35) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">四平八穩</text>') }
      ];
    },
    /* 五體投地 */
    i443: function () {
      function kneelKid(x, sc) {
        return P(x, 316, '<g transform="rotate(72)">' + A('kid', 'happy') + '</g>', '', 0, sc || 1);
      }
      return [
        { minDur: 6800, sub: '魔術社的學長變出一連串神奇戲法，台下的小軍看得下巴都要掉了——',
          html: scene(P(500, 302, A('kid', 'happy') +
              '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>', '', 0, 1.05) +
            bang(580, 180) + P(280, 302, A('kid', 'wow')) + sweat(230, 192)) },
        { minDur: 6800, sub: '「五體」是雙手、雙膝加頭——全部貼到地上行大禮，表示佩服到了極點！',
          html: scene(kneelKid(300, 1) + P(540, 302, A('kid', 'happy'), '', 0, 1.02, true) + hearts(430, 200)) },
        { minDur: 6600, sub: '「我對你佩服得五體投地！」——最高等級的讚嘆，就是這句！',
          html: scene(kneelKid(280, .95) + kneelKid(400, .9) + P(580, 302, A('kid', 'happy'), '', 0, 1.05, true) + hearts(500, 190)) },
        { minDur: 6400, sub: '五體投地：佩服到了極點。',
          html: scene(kneelKid(320, 1) + P(560, 302, A('kid', 'happy'), '', 0, 1.05, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">五體投地</text>') }
      ];
    },
    /* 七拼八湊 */
    i444: function () {
      var ROBOT = '<rect x="-18" y="-40" width="36" height="28" rx="5" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2.6"/>' +
        '<rect x="-12" y="-58" width="24" height="18" rx="4" fill="#c9d6e8" stroke="#6d87ab" stroke-width="2.4"/>' +
        '<circle cx="-5" cy="-50" r="2.6" fill="#3a2e26"/><circle cx="5" cy="-50" r="2.6" fill="#3a2e26"/>' +
        '<rect x="-26" y="-36" width="8" height="18" rx="3" fill="#e0a458"/><rect x="18" y="-36" width="8" height="18" rx="3" fill="#a5d47c"/>' +
        '<rect x="-14" y="-12" width="10" height="12" rx="3" fill="#c96a5a"/><rect x="4" y="-12" width="10" height="12" rx="3" fill="#ffd97a"/>';
      return [
        { minDur: 6800, sub: '勞作比賽前一晚才動工！小組把紙箱、瓶蓋、吸管、舊玩具全搬出來，東拼一塊、西湊一片……',
          html: scene(P(430, 296, ROBOT, '', 0, 1.2) +
            P(250, 302, A('kid', 'wow')) + P(600, 302, A('kid', 'wow'), '', .2, .93, true) + sweat(320, 195)) },
        { minDur: 6800, sub: '拼出來的機器人歪歪扭扭：手一長一短、頭還會掉下來——勉強湊合的東西就是不牢靠！',
          html: scene(P(430, 296, ROBOT, '', 0, 1.15) + bang(520, 210) + sweat(350, 200) + qmark(300, 185)) },
        { minDur: 6800, sub: '「七拼八湊」：把零碎的東西勉強湊在一起——想做出好作品，還是要提早準備！',
          html: scene(P(400, 296, ROBOT, '', 0, 1.1) + P(230, 302, A('kid', 'happy'), '', 0, .95) + hearts(320, 195)) },
        { minDur: 6400, sub: '七拼八湊：把零碎的東西勉強湊在一起。',
          html: scene(P(400, 296, ROBOT, '', 0, 1.25) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">七拼八湊</text>') }
      ];
    },
    /* 亂七八糟 */
    i445: function () {
      var MESS = '<rect x="-46" y="-14" width="26" height="12" rx="3" fill="#c96a5a" transform="rotate(22 -33 -8)"/>' +
        '<circle cx="-4" cy="-10" r="9" fill="#8fa8c9"/>' +
        '<rect x="14" y="-20" width="24" height="10" rx="3" fill="#e0a458" transform="rotate(-18 26 -15)"/>' +
        '<path d="M-30 6 q12 8 26 2 q12 -6 24 4" stroke="#a3a9b8" stroke-width="4" fill="none"/>' +
        '<rect x="-16" y="-30" width="14" height="18" rx="3" fill="#a5d47c" transform="rotate(35 -9 -21)"/>';
      return [
        { minDur: 6800, sub: '打開小凱的房間門——玩具、衣服、課本丟得到處都是，連踩腳的地方都沒有！',
          html: scene(P(400, 306, MESS, '', 0, 1.5) +
            P(180, 302, A('kid', 'wow'), '', 0, .95) + sweat(240, 195) + qmark(500, 220)) },
        { minDur: 6600, sub: '想找一隻襪子？在玩具堆裡翻了十分鐘還找不到——亂七八糟，什麼都難找！',
          html: scene(P(400, 306, MESS, '', 0, 1.4) + P(300, 302, A('kid', 'sad')) + sweat(250, 192) + qmark(370, 182)) },
        { minDur: 6800, sub: '花一小時分類收好：玩具進箱、衣服進櫃、書本上架——房間立刻清爽，找東西一秒到位！',
          html: scene(P(430, 302, '<g stroke-width="2"><rect x="-60" y="-40" width="36" height="40" rx="4" fill="#a5c8ff" stroke="#5c82ba"/><rect x="-18" y="-40" width="36" height="40" rx="4" fill="#a5d47c" stroke="#7cab6e"/><rect x="24" y="-40" width="36" height="40" rx="4" fill="#ffd97a" stroke="#e8b84a"/></g>') +
            P(240, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(330, 195)) },
        { minDur: 6400, sub: '亂七八糟：混亂沒有條理。',
          html: scene(P(400, 306, MESS, '', 0, 1.5) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">亂七八糟</text>') }
      ];
    },
    /* 千奇百怪 */
    i446: function () {
      var SHELL = '<path d="M0 0 a16 16 0 0 1 16 -16 a12 12 0 0 1 -4 -12 a20 20 0 0 0 -24 20 a14 14 0 0 0 12 8 z" fill="#e8b84a" stroke="#c98f2a" stroke-width="2"/>';
      var STARFISH = '<path d="M0 -14 L4 -4 L14 -4 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4 L-4 -4 Z" fill="#f0925e" stroke="#d1713c" stroke-width="2"/>';
      var CORAL = '<path d="M0 0 q-2 -14 -10 -18 M0 0 q0 -18 6 -24 M0 0 q6 -12 14 -14" stroke="#f7a8c4" stroke-width="4.6" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '海邊退潮後的沙灘上，撿到好多寶貝：螺旋形的貝殼、五角星的海星、樹枝狀的珊瑚——',
          html: scene('<ellipse cx="400" cy="330" rx="420" ry="46" fill="#e8d5a8"/>' +
            P(280, 300, SHELL, '', 0, 1.2) + P(420, 302, STARFISH, '', .2, 1.3) + P(560, 300, CORAL, '', .4, 1.2) +
            P(150, 302, A('kid', 'wow'), '', 0, .95) + hearts(220, 210)) },
        { minDur: 6800, sub: '世界上的東西各式各樣、什麼形狀都有——奇形怪狀看得人嘖嘖稱奇！',
          html: scene(P(300, 260, SHELL, '', 0, 1.4) + P(430, 250, STARFISH, '', .2, 1.5) + P(560, 258, CORAL, '', .4, 1.4) +
            P(180, 302, A('kid', 'happy'), '', 0, .95) + bang(430, 180)) },
        { minDur: 6600, sub: '「千奇百怪」：各種各樣奇怪的事物——大自然就是最大的驚奇博物館！',
          html: scene(P(320, 270, STARFISH, '', 0, 1.4) + P(500, 265, SHELL, '', .3, 1.3) + hearts(410, 220) +
            P(180, 302, A('kid', 'happy'), '', 0, .92)) },
        { minDur: 6400, sub: '千奇百怪：各種各樣奇怪的事物。',
          html: scene(P(280, 265, SHELL, '', 0, 1.4) + P(420, 258, STARFISH, '', .2, 1.5) + P(550, 264, CORAL, '', .4, 1.4) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千奇百怪</text>') }
      ];
    },
    /* 口是心非 */
    i447: function () {
      var HEART3 = '<path d="M0 5 C-7 -5 -19 2 -10 12 L0 20 L10 12 C19 2 7 -5 0 5 Z" fill="#ff7b9c"/>';
      var XMARK = '<path d="M-8 -8 L8 8 M-8 8 L8 -8" stroke="#c96a5a" stroke-width="4" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '妹妹問：「哥哥，你想吃這塊蛋糕嗎？」哥哥嘴上說「不想」，眼睛卻一直偷瞄……',
          html: scene(P(300, 302, A('kid', 'happy')) +
            P(430, 280, '<rect x="-22" y="-18" width="44" height="18" rx="4" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2.4"/><path d="M-22 -18 q11 7 22 0 q11 7 22 0" stroke="#fff" stroke-width="3" fill="none"/>', '', 0, 1.1) +
            P(560, 302, A('kid', 'happy'), '', 0, .9, true) + qmark(620, 190)) },
        { minDur: 6800, sub: '嘴巴說的是一套、心裡想的是另一套——「口是心非」就是說話不老實！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) +
            P(300, 180, '<circle cx="0" cy="0" r="26" fill="#fff" opacity=".92"/>' + P(0, -8, XMARK)) +
            P(500, 180, '<circle cx="0" cy="0" r="26" fill="#fff" opacity=".92"/>' + P(0, -12, HEART3, '', 0, .8))) },
        { minDur: 6800, sub: '有話直說、心口如一，別人才知道你真正的想法——誠實最可愛！',
          html: scene(P(320, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(410, 178)) },
        { minDur: 6400, sub: '口是心非：嘴上說的和心裡想的不一致。',
          html: scene(P(310, 200, '<circle cx="0" cy="0" r="24" fill="#fff" opacity=".92"/>' + P(0, -7, XMARK)) +
            P(490, 200, '<circle cx="0" cy="0" r="24" fill="#fff" opacity=".92"/>' + P(0, -11, HEART3, '', 0, .75)) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">口是心非</text>') }
      ];
    },
    /* 有始有終 */
    i448: function () {
      var PUZZLEDONE = '<g stroke-width="2"><rect x="-28" y="-22" width="26" height="22" rx="3" fill="#a5c8ff" stroke="#5c82ba"/><rect x="2" y="-22" width="26" height="22" rx="3" fill="#a5d47c" stroke="#7cab6e"/><rect x="-28" y="4" width="26" height="22" rx="3" fill="#ffd97a" stroke="#e8b84a"/><rect x="2" y="4" width="26" height="22" rx="3" fill="#f7a8c4" stroke="#e07ba3"/></g>';
      return [
        { minDur: 6800, sub: '一千片的大拼圖！拼到一半好想放棄——小恆咬咬牙：「開始了，就要拼完它！」',
          html: scene(P(430, 280, '<g stroke-width="2"><rect x="-28" y="-22" width="26" height="22" rx="3" fill="#a5c8ff" stroke="#5c82ba"/><rect x="2" y="-22" width="26" height="22" rx="3" fill="#a5d47c" stroke="#7cab6e"/><rect x="-28" y="4" width="26" height="22" rx="3" fill="#ffd97a" stroke="#e8b84a"/><rect x="2" y="4" width="26" height="22" rx="3" fill="#fff" stroke="#c9bfa8" stroke-dasharray="4 4"/></g>', '', 0, 1.2) +
            P(260, 302, A('kid', 'sad')) + sweat(210, 192) + qmark(330, 182)) },
        { minDur: 6800, sub: '一天拼一點，兩個星期後——最後一片喀擦放上，完成！那一刻成就感爆棚！',
          html: scene(P(430, 275, PUZZLEDONE, '', 0, 1.3) + bang(540, 210) +
            P(260, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(340, 195)) },
        { minDur: 6600, sub: '「有始有終」：開始了就堅持到最後——半途而廢最可惜！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + hearts(490, 188) +
            '<path d="M250 250 L550 250" stroke="#548a40" stroke-width="4" stroke-linecap="round"/><circle cx="250" cy="250" r="7" fill="#548a40"/><circle cx="550" cy="250" r="7" fill="#548a40"/>') },
        { minDur: 6400, sub: '有始有終：做事能堅持到底。',
          html: scene(P(400, 275, PUZZLEDONE, '', 0, 1.3) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">有始有終</text>') }
      ];
    },
    /* 自告奮勇 */
    i449: function () {
      return [
        { minDur: 6800, sub: '老師問：「誰願意代表班上參加演講比賽？」教室一片安靜——小勇舉起了手：「我來！」',
          html: scene(P(560, 302, A('kid', 'happy'), '', 0, 1.02, true) + qmark(610, 185) +
            P(300, 302, A('kid', 'happy') +
              '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-62" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>') + bang(380, 180)) },
        { minDur: 6800, sub: '沒人指派、主動請纓——「自告奮勇」就是自己站出來承擔任務！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(450, 185) +
            P(200, 302, A('kid', 'happy'), '', 0, .9) + P(580, 302, A('kid', 'happy'), '', .2, .9)) },
        { minDur: 6800, sub: '他認真準備了兩星期，上台侃侃而談，為班上拿下第二名——勇敢站出來的人最帥氣！',
          html: scene(P(400, 288, '<rect x="-90" y="0" width="180" height="14" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>') +
            P(400, 288, A('kid', 'happy'), '', 0, 1.02) + hearts(490, 190) + notes(310, 185)) },
        { minDur: 6400, sub: '自告奮勇：主動要求承擔任務。',
          html: scene(P(400, 302, A('kid', 'happy') +
              '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-62" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>', '', 0, 1.08) + bang(490, 180) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">自告奮勇</text>') }
      ];
    },
    /* 小心翼翼 */
    i450: function () {
      var EGGTRAY = '<path d="M-24 0 q0 10 24 10 q24 0 24 -10 z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.4"/>' +
        '<ellipse cx="-10" cy="-4" rx="7" ry="9" fill="#fff" stroke="#e3dcd4" stroke-width="1.8"/><ellipse cx="8" cy="-5" rx="7" ry="9" fill="#ffe9d0" stroke="#e3dcd4" stroke-width="1.8"/>';
      return [
        { minDur: 6800, sub: '幫媽媽端一盤雞蛋——小葳放慢腳步、雙手端平，眼睛盯著盤子，大氣都不敢喘！',
          html: scene(P(360, 302, A('kid', 'happy') + P(0, -100, EGGTRAY, '', 0, 1)) + sweat(300, 192)) },
        { minDur: 6800, sub: '過獨木橋也一樣：一步一步踩穩，張開雙手保持平衡——謹慎再謹慎！',
          html: scene('<rect y="286" width="800" height="54" fill="#7fb2e0"/>' +
            P(430, 268, '<line x1="-140" y1="0" x2="140" y2="0" stroke="#a8734a" stroke-width="9" stroke-linecap="round"/>') +
            P(400, 268, A('kid', 'wow'), '', 0, .95) + sweat(340, 190)) },
        { minDur: 6600, sub: '「翼翼」是恭敬謹慎的樣子——做事非常小心、不敢有一點疏忽！',
          html: scene(P(400, 302, A('kid', 'happy') + P(0, -100, EGGTRAY, '', 0, .95), '', 0, 1.05) + hearts(500, 195)) },
        { minDur: 6400, sub: '小心翼翼：非常謹慎，不敢疏忽。',
          html: scene(P(400, 302, A('kid', 'happy') + P(0, -100, EGGTRAY, '', 0, 1.05), '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">小心翼翼</text>') }
      ];
    },
    /* 白手起家 */
    i822: function () {
      var CART4 = '<rect x="-30" y="-24" width="60" height="18" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/><circle cx="-16" cy="0" r="8" fill="#8a5a33"/><circle cx="16" cy="0" r="8" fill="#8a5a33"/><line x1="30" y1="-18" x2="48" y2="-10" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/>';
      var SHOP2 = '<rect x="-50" y="-50" width="100" height="50" rx="4" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.6"/><path d="M-56 -50 h112 l-9 -16 h-94 z" fill="#e0a458" stroke="#c08838" stroke-width="2.4"/><rect x="-14" y="-32" width="28" height="32" rx="3" fill="#8a5a33"/>';
      return [
        { minDur: 6800, sub: '爺爺年輕時全身上下只有一雙手：推著小推車沿街賣饅頭，天不亮就出門……',
          html: scene(P(360, 302, A('kid', 'happy') + P(-50, -6, CART4, '', 0, 1)) + sweat(300, 192), 'night') },
        { minDur: 6800, sub: '省吃儉用幾十年，小推車變成小店面、小店面變成大商行——全靠自己的雙手打拚！',
          html: scene(P(430, 302, SHOP2, '', 0, 1.1) +
            P(250, 302, A('kid', 'happy')) + hearts(340, 195) + bang(540, 200)) },
        { minDur: 6600, sub: '「白手起家」：不靠背景、不靠本錢，憑自己的努力創立事業——最令人敬佩！',
          html: scene(P(300, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05) +
            P(540, 302, A('kid', 'wow'), '', 0, .93) + hearts(430, 185)) },
        { minDur: 6400, sub: '白手起家：憑自己的努力創立事業。',
          html: scene(P(300, 302, A('kid', 'happy') + P(-50, -6, CART4, '', 0, .9)) + P(560, 302, SHOP2, '', 0, .95) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">白手起家</text>') }
      ];
    },
    /* 半斤八兩 */
    i823: function () {
      var SCALE = '<line x1="0" y1="0" x2="0" y2="-56" stroke="#8b93a3" stroke-width="5"/><line x1="-60" y1="-56" x2="60" y2="-56" stroke="#8b93a3" stroke-width="4"/>' +
        '<path d="M-60 -56 l-12 22 h24 z" fill="none" stroke="#8b93a3" stroke-width="3"/><path d="M60 -56 l-12 22 h24 z" fill="none" stroke="#8b93a3" stroke-width="3"/>' +
        '<rect x="-16" y="0" width="32" height="8" rx="3" fill="#8b93a3"/>';
      return [
        { minDur: 6800, sub: '古秤一斤是十六兩——所以「半斤」剛好就是「八兩」，兩邊放上秤，一樣重！',
          html: scene(P(400, 290, SCALE, '', 0, 1.3) + qmark(520, 200) +
            P(200, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6800, sub: '兩兄弟比賽釣魚：一個釣三條小魚、一個釣一條大魚——秤起來竟然一樣重，半斤八兩！',
          html: scene(P(300, 302, A('kid', 'happy') + P(40, -60, A('fish'), '', 0, .55)) +
            P(500, 302, A('kid', 'happy') + P(-40, -60, A('fish'), '', 0, .75), '', 0, .98, true) + qmark(400, 180)) },
        { minDur: 6800, sub: '「半斤八兩」：程度相當、不相上下——不過多用來笑雙方「一樣差」喔！',
          html: scene(P(320, 302, A('kid', 'sad')) + P(490, 302, A('kid', 'sad'), '', 0, .98, true) +
            sweat(280, 192) + sweat(530, 195) + qmark(405, 178)) },
        { minDur: 6400, sub: '半斤八兩：彼此程度相當，不相上下。',
          html: scene(P(400, 292, SCALE, '', 0, 1.35) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">半斤八兩</text>') }
      ];
    },
    /* 舉世聞名 */
    i824: function () {
      var TOWER101 = '<path d="M-10 0 h20 l-2 -10 h-16 z M-9 -10 h18 l-2 -10 h-14 z M-8 -20 h16 l-2 -10 h-12 z M-7 -30 h14 l-2 -10 h-10 z M-6 -40 h12 l-2 -10 h-8 z M-5 -50 h10 l-1 -8 h-8 z" fill="#8fa8c9" stroke="#6d87ab" stroke-width="1.6"/><line x1="0" y1="-58" x2="0" y2="-72" stroke="#6d87ab" stroke-width="2.6"/>';
      var GLOBE2 = '<circle cx="0" cy="0" r="30" fill="#7fb2e0" stroke="#5a8fc4" stroke-width="3"/><path d="M-18 -12 q9 -7 20 -2 q7 4 3 11 q-9 5 -18 0 q-9 -4 -5 -9 z" fill="#a5d47c"/>';
      return [
        { minDur: 6800, sub: '外國朋友一提到台灣就說：「我知道101大樓！還有夜市小吃！」——全世界都聽過！',
          html: scene(P(300, 302, TOWER101, '', 0, 1.6) +
            P(540, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(440, 190)) },
        { minDur: 6600, sub: '「舉世」是全世界——名聲大到全世界都知道，就是「舉世聞名」！',
          html: scene(P(400, 210, GLOBE2, '', 0, 1.4) + notes(500, 170) + hearts(300, 200)) },
        { minDur: 6800, sub: '長城、金字塔、萬里長城……這些舉世聞名的奇景，吸引全球旅客朝聖！',
          html: scene(P(430, 302, '<path d="M-120 0 l30 -20 l30 8 l30 -16 l30 10 l30 -12 l-6 -14 l-30 12 l-30 -10 l-30 16 l-30 -8 l-30 20 z" fill="#b0a390" stroke="#8a7a66" stroke-width="2.4"/>', '', 0, 1.1) +
            P(220, 302, A('kid', 'wow'), '', 0, .93) + hearts(320, 200)) },
        { minDur: 6400, sub: '舉世聞名：全世界都知道，名聲極大。',
          html: scene(P(400, 220, GLOBE2, '', 0, 1.5) + notes(510, 180) +
            '<text x="400" y="310" text-anchor="middle" font-size="50" font-weight="bold" fill="#4a3200">舉世聞名</text>') }
      ];
    },
    /* 別有洞天 */
    i825: function () {
      var CAVE2 = '<path d="M-60 0 L-60 -40 Q-60 -110 0 -110 Q60 -110 60 -40 L60 0 Z" fill="#8a7a66"/><path d="M-26 0 Q-26 -52 0 -52 Q26 -52 26 0 Z" fill="#4a4238"/>';
      function flower7(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="-14" stroke="#5f8a46" stroke-width="3"/><circle cx="0" cy="-19" r="4.6" fill="' + color + '"/><circle cx="-5" cy="-15" r="4.6" fill="' + color + '"/><circle cx="5" cy="-15" r="4.6" fill="' + color + '"/></g>');
      }
      return [
        { minDur: 6800, sub: '爬山時發現一個不起眼的小山洞——彎腰鑽進去，會有什麼呢？',
          html: scene(P(500, 302, CAVE2) + P(320, 302, A('kid', 'wow'), 'st-inR') + qmark(390, 190)) },
        { minDur: 6800, sub: '哇！洞的另一頭竟然是一片開滿花的山谷，還有瀑布和彩蝶——像另一個世界！',
          html: scene(flower7(250, 320, '#ff9eb5', 0) + flower7(360, 318, '#ffd97a', .3) + flower7(470, 322, '#c9a8e0', .5) +
            P(620, 250, '<path d="M0 -60 q-4 30 0 60 M12 -60 q4 30 0 60" stroke="#a8d4ee" stroke-width="6" fill="none" stroke-linecap="round"/>') +
            P(560, 200, A('butterfly'), '', 0, .95) +
            P(180, 302, A('kid', 'wow')) + hearts(280, 210) + bang(400, 170)) },
        { minDur: 6600, sub: '「別有洞天」：另有一番美妙的境界——意想不到的驚喜世界！',
          html: scene(P(500, 302, CAVE2, '', 0, .9) + flower7(250, 320, '#ff9eb5', 0) +
            P(320, 302, A('kid', 'happy')) + hearts(400, 195)) },
        { minDur: 6400, sub: '別有洞天：另有一番美妙的境界。',
          html: scene(P(500, 302, CAVE2, '', 0, .95) + flower7(240, 320, '#ffd97a', 0) + flower7(330, 318, '#ff9eb5', .3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">別有洞天</text>') }
      ];
    },
    /* 面黃肌瘦 */
    i826: function () {
      var THINKID = '<g class="st-bob"><rect x="-11" y="-14" width="9" height="14" rx="4" fill="#4a5b7d"/><rect x="2" y="-14" width="9" height="14" rx="4" fill="#4a5b7d"/>' +
        '<rect x="-13" y="-44" width="26" height="34" rx="11" fill="#6fbf8e" stroke="#54a274" stroke-width="2.2"/>' +
        '<circle cx="0" cy="-54" r="19" fill="#e8d5a0" stroke="#c9b880" stroke-width="2"/>' +
        '<path d="M-19 -58 Q-16 -74 0 -74 Q16 -74 19 -58 Q10 -66 0 -65 Q-10 -66 -19 -58 Z" fill="#6b4a32"/>' +
        '<circle cx="-6" cy="-53" r="2.6" fill="#3a2e26"/><circle cx="6" cy="-53" r="2.6" fill="#3a2e26"/>' +
        '<path d="M-4 -42 Q0 -45 4 -42" stroke="#3a2e26" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
      return [
        { minDur: 6800, sub: '故事書裡的孤兒臉色蠟黃、瘦得只剩皮包骨——長期吃不飽，營養不良……',
          html: scene(P(360, 302, THINKID) + sweat(310, 200) +
            P(560, 302, A('kid', 'sad'), '', 0, .95, true) + qmark(610, 190), 'night') },
        { minDur: 6800, sub: '好心人送來熱粥和麵包，天天照顧——幾個月後，他的臉色紅潤、長高長壯了！',
          html: scene(P(360, 302, A('kid', 'happy')) +
            P(540, 302, A('kid', 'happy') + P(-38, -50, '<path d="M-16 -6 q0 12 16 12 q16 0 16 -12 z" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.4"/>', '', 0, .95), '', 0, 1.02, true) + hearts(450, 185)) },
        { minDur: 6600, sub: '「面黃肌瘦」：臉色發黃、身體消瘦——營養均衡，才能頭好壯壯！',
          html: scene(P(320, 302, THINKID) + P(520, 302, A('kid', 'happy'), '', 0, 1.02) +
            '<path d="M400 250 L450 250" stroke="#548a40" stroke-width="4" stroke-linecap="round"/><path d="M450 250 l-10 -6 v12 z" fill="#548a40"/>') },
        { minDur: 6400, sub: '面黃肌瘦：臉色發黃、身體消瘦，營養不良。',
          html: scene(P(400, 302, THINKID, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">面黃肌瘦</text>') }
      ];
    },
    /* 骨瘦如柴 */
    i827: function () {
      var FIREWOOD = '<g stroke="#a8734a" stroke-width="5" stroke-linecap="round"><line x1="-24" y1="8" x2="20" y2="-14"/><line x1="-20" y1="-2" x2="24" y2="10"/><line x1="-14" y1="14" x2="16" y2="-18"/></g>';
      var THINCAT = '<g class="st-bob"><ellipse cx="0" cy="-18" rx="17" ry="11" fill="#e8c48f" stroke="#c9a066" stroke-width="2"/>' +
        '<g stroke="#c9a066" stroke-width="1.6"><line x1="-10" y1="-24" x2="-10" y2="-12"/><line x1="-3" y1="-26" x2="-3" y2="-11"/><line x1="4" y1="-26" x2="4" y2="-11"/></g>' +
        '<circle cx="-16" cy="-32" r="10" fill="#e8c48f" stroke="#c9a066" stroke-width="2"/>' +
        '<path d="M-24 -40 l-3 -8 l7 4 z M-10 -41 l3 -8 l4 7 z" fill="#c9a066"/>' +
        '<circle cx="-19" cy="-33" r="1.8" fill="#3a2e26"/>' +
        '<path d="M14 -20 q10 2 8 12" stroke="#c9a066" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>';
      return [
        { minDur: 6800, sub: '巷口的流浪貓好幾天沒吃東西，瘦得肋骨一根根都看得見——像一把細柴！',
          html: scene(P(400, 300, THINCAT, '', 0, 1.2) + sweat(350, 240) +
            P(200, 302, A('kid', 'sad')) + qmark(270, 190), 'night') },
        { minDur: 6800, sub: '小語每天帶飼料和水去餵牠——慢慢地，小貓毛色發亮、圓潤了起來！',
          html: scene(P(480, 300, A('fox'), '', 0, .95) +
            P(300, 302, A('kid', 'happy') + P(38, -30, '<path d="M-12 -6 q0 10 12 10 q12 0 12 -10 z" fill="#8fa8c9" stroke="#6d87ab" stroke-width="2.4"/>', '', 0, .95)) + hearts(400, 190)) },
        { minDur: 6600, sub: '「骨瘦如柴」：瘦得只剩骨頭、像木柴一樣——照顧小動物，人人有責！',
          html: scene(P(320, 296, FIREWOOD, '', 0, 1.2) + P(520, 300, THINCAT, '', 0, 1) +
            '<text x="410" y="240" text-anchor="middle" font-size="24" fill="#4a3200">＝</text>') },
        { minDur: 6400, sub: '骨瘦如柴：瘦得只剩骨頭，像木柴一樣。',
          html: scene(P(400, 300, THINCAT, '', 0, 1.2) + P(250, 300, FIREWOOD, '', 0, 1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">骨瘦如柴</text>') }
      ];
    },
    /* 虎背熊腰 */
    i828: function () {
      var STRONGKID = '<g class="st-bob"><rect x="-20" y="-14" width="16" height="14" rx="6" fill="#4a5b7d"/><rect x="4" y="-14" width="16" height="14" rx="6" fill="#4a5b7d"/>' +
        '<rect x="-28" y="-50" width="56" height="40" rx="16" fill="#6fbf8e" stroke="#54a274" stroke-width="2.6"/>' +
        '<line x1="-26" y1="-42" x2="-42" y2="-24" stroke="#ffe3c1" stroke-width="12" stroke-linecap="round"/>' +
        '<line x1="26" y1="-42" x2="42" y2="-24" stroke="#ffe3c1" stroke-width="12" stroke-linecap="round"/>' +
        '<circle cx="0" cy="-60" r="22" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>' +
        '<path d="M-22 -66 Q-18 -84 0 -84 Q18 -84 22 -66 Q11 -75 0 -74 Q-11 -75 -22 -66 Z" fill="#6b4a32"/>' +
        '<circle cx="-7" cy="-59" r="2.6" fill="#3a2e26"/><circle cx="7" cy="-59" r="2.6" fill="#3a2e26"/>' +
        '<path d="M-5 -48 Q0 -44 5 -48" stroke="#3a2e26" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>';
      return [
        { minDur: 6800, sub: '舉重隊的教練走過來——背像老虎一樣寬、腰像熊一樣壯，整個人像一座小山！',
          html: scene(P(400, 302, STRONGKID, '', 0, 1.15) +
            P(200, 302, A('kid', 'wow'), '', 0, .92) + hearts(290, 200)) },
        { minDur: 6600, sub: '他輕輕鬆鬆舉起大槓鈴，肌肉結實有力——「虎背熊腰」就是形容魁梧強壯的身材！',
          html: scene(P(400, 302, STRONGKID + P(0, -108, '<line x1="-40" y1="0" x2="40" y2="0" stroke="#8b93a3" stroke-width="6"/><circle cx="-40" cy="0" r="12" fill="#3a2e26"/><circle cx="40" cy="0" r="12" fill="#3a2e26"/>', '', 0, 1)) + bang(540, 200)) },
        { minDur: 6600, sub: '多運動、吃得營養，身體才會強壯——目標：虎背熊腰的健康體格！',
          html: scene(P(300, 302, A('kid', 'happy'), 'st-dashL') + P(520, 302, STRONGKID, '', 0, .95) + hearts(410, 190)) },
        { minDur: 6400, sub: '虎背熊腰：背寬腰粗，身材魁梧強壯。',
          html: scene(P(400, 302, STRONGKID, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">虎背熊腰</text>') }
      ];
    },
    /* 揮汗如雨 */
    i829: function () {
      return [
        { minDur: 6800, sub: '盛夏正午，工地的叔叔們搬磚扛料——汗水一甩，像下雨一樣灑落！',
          html: scene(P(340, 302, A('kid', 'angry') + P(24, -42, HAMMER)) +
            sweat(280, 185) + sweat(390, 178) + sweat(330, 160) + sweat(430, 195) +
            P(560, 302, '<rect x="-40" y="-60" width="80" height="60" fill="#b0a390" stroke="#8a7a66" stroke-width="3"/>')) },
        { minDur: 6600, sub: '球場上的球員也是揮汗如雨：進攻、防守、衝刺，汗水濕透全身！',
          html: scene(P(360, 302, A('kid', 'happy'), 'st-dashL') +
            sweat(300, 180) + sweat(420, 175) + sweat(360, 155) + bang(500, 210)) },
        { minDur: 6600, sub: '「揮汗如雨」：汗水灑落像下雨——天氣酷熱，或勞動辛苦！',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.08) + sweat(330, 175) + sweat(470, 172) + sweat(400, 150)) },
        { minDur: 6400, sub: '揮汗如雨：汗水像下雨，天熱或勞動辛苦。',
          html: scene(P(400, 302, A('kid', 'angry') + P(24, -42, HAMMER), '', 0, 1.05) + sweat(330, 175) + sweat(470, 178) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">揮汗如雨</text>') }
      ];
    },
    /* 持之以恆 */
    i1009: function () {
      var CAL3 = '<rect x="-26" y="-30" width="52" height="60" rx="5" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/><rect x="-26" y="-30" width="52" height="14" rx="5" fill="#548a40"/>' +
        '<g stroke="#548a40" stroke-width="2.2"><path d="M-18 -8 l4 4 l7 -7 M-2 -8 l4 4 l7 -7 M-18 6 l4 4 l7 -7 M-2 6 l4 4 l7 -7"/></g>';
      return [
        { minDur: 6800, sub: '小恆立志每天晨讀二十分鐘——第一週很新鮮、第二週有點累、第三週好想放棄……',
          html: scene(P(340, 302, A('kid', 'sad') + P(-44, -50, '<rect x="-16" y="-20" width="32" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/><path d="M-9 -12 h18 M-9 -4 h18" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95)) +
            sweat(280, 192) + qmark(420, 182)) },
        { minDur: 6800, sub: '他咬牙撐了下去——日曆上的勾勾一天天增加，一年三百六十五天，一天也沒斷！',
          html: scene(P(430, 272, CAL3, '', 0, 1.3) + bang(540, 210) +
            P(250, 302, A('kid', 'happy')) + hearts(340, 195)) },
        { minDur: 6600, sub: '「持之以恆」：用恆心長久堅持——一年後，他成了全班詞彙量最大的人！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) + hearts(450, 185) +
            P(560, 272, CAL3, '', 0, .9)) },
        { minDur: 6400, sub: '持之以恆：以恆心長久堅持下去。',
          html: scene(P(400, 272, CAL3, '', 0, 1.35) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">持之以恆</text>') }
      ];
    },
    /* 死裡逃生 */
    i1010: function () {
      return [
        { minDur: 6800, sub: '地震來襲，登山隊被落石困在山谷裡——四周轟隆隆，情況萬分危急！',
          html: scene(P(560, 302, '<path d="M-110 0 L0 -130 L110 0 Z" fill="#8fb0a0"/>') + bang(430, 200) +
            P(280, 302, A('kid', 'wow')) + sweat(230, 192) + P(400, 260, '<circle cx="0" cy="0" r="14" fill="#8b93a3"/>', 'st-bang'), 'night') },
        { minDur: 6800, sub: '他們沉著找路、互相扶持，終於在救難隊幫助下爬出山谷——撿回一條命！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(430, 302, A('kid', 'happy'), '', .2, .95) +
            P(580, 302, A('kid', 'happy'), 'st-inR', .3, .93) + hearts(430, 180)) },
        { minDur: 6600, sub: '「死裡逃生」：從極危險的境地中逃脫、保住性命——大難不死的慶幸！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 188) + sweat(310, 195)) },
        { minDur: 6400, sub: '死裡逃生：從極危險的境地中逃脫。',
          html: scene(P(560, 302, '<path d="M-110 0 L0 -130 L110 0 Z" fill="#8fb0a0"/>', '', 0, .9) +
            P(300, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">死裡逃生</text>') }
      ];
    },
    /* 左顧右盼 */
    i1042: function () {
      return [
        { minDur: 6800, sub: '在車站等好朋友，小盼一下看左邊、一下望右邊：「怎麼還沒來呀？」',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) +
            qmark(310, 182) + qmark(490, 185) +
            '<path d="M340 240 q-40 -10 -70 0 M460 240 q40 -10 70 0" stroke="#c9bfa8" stroke-width="3" fill="none" stroke-dasharray="7 7"/>') },
        { minDur: 6800, sub: '過馬路更要左顧右盼：先看左、再看右、確定沒車才通過——這時候的張望是保命絕招！',
          html: scene('<rect y="290" width="800" height="26" fill="#8b93a3"/><g stroke="#fff" stroke-width="3" stroke-dasharray="20 16"><line x1="0" y1="303" x2="800" y2="303"/></g>' +
            P(400, 288, A('kid', 'happy'), '', 0, 1) + hearts(490, 195)) },
        { minDur: 6600, sub: '「左顧右盼」：左看看、右望望——形容張望或心神不定的樣子！',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.08) + qmark(320, 182) + qmark(480, 186)) },
        { minDur: 6400, sub: '左顧右盼：向左看看，又向右望望。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.1) + qmark(310, 185) + qmark(490, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">左顧右盼</text>') }
      ];
    },
    /* 提心吊膽 */
    i1054: function () {
      var HEART4 = '<path d="M0 5 C-7 -5 -19 2 -10 12 L0 20 L10 12 C19 2 7 -5 0 5 Z" fill="#ff7b9c"/>' +
        '<line x1="0" y1="-14" x2="0" y2="2" stroke="#c96a5a" stroke-width="2.6" stroke-dasharray="4 4"/>';
      return [
        { minDur: 6800, sub: '打雷的夜裡自己在家，每個聲音都嚇人一跳——小膽整晚提心吊膽，抱著枕頭不敢睡。',
          html: scene(P(360, 302, A('kid', 'wow')) + sweat(300, 190) +
            P(500, 180, HEART4, 'st-zfloat', 0, 1.1) + bang(600, 140), 'night') },
        { minDur: 6800, sub: '心和膽都懸在半空中放不下來——「提心吊膽」就是非常擔心害怕的樣子！',
          html: scene(P(400, 200, HEART4, 'st-zfloat', 0, 1.5) +
            P(260, 302, A('kid', 'wow'), '', 0, .95) + sweat(320, 195)) },
        { minDur: 6800, sub: '爸媽回來了！開燈一看，剛剛的怪聲只是窗簾被風吹——心終於放回肚子裡啦！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(480, 302, A('kid', 'happy'), '', 0, 1.05, true) + hearts(400, 185)) },
        { minDur: 6400, sub: '提心吊膽：心膽懸著放不下，非常擔心害怕。',
          html: scene(P(400, 210, HEART4, 'st-zfloat', 0, 1.6) + P(260, 302, A('kid', 'wow'), '', 0, .95) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">提心吊膽</text>', 'night') }
      ];
    },
    /* 綠意盎然 */
    i1078: function () {
      function sprout2(x, y, h, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="' + (-h) + '" stroke="#5f8a46" stroke-width="4"/>' +
          '<path d="M0 ' + (-h) + ' q-8 -8 -4 -14 M0 ' + (-h) + ' q8 -8 4 -14" stroke="#7cc47f" stroke-width="4" fill="none" stroke-linecap="round"/></g>');
      }
      return [
        { minDur: 6600, sub: '春雨過後的森林步道：樹葉綠得發亮、蕨類爬滿山坡，連空氣都是青草香！',
          html: scene(P(150, 302, TREE, '', 0, 1.25) + P(650, 302, TREE, '', .2, 1.1) +
            sprout2(300, 320, 24, 0) + sprout2(400, 318, 32, .3) + sprout2(500, 322, 26, .5) +
            P(360, 302, A('kid', 'happy'), '', 0, .95) + hearts(450, 200)) },
        { minDur: 6600, sub: '陽台的小盆栽也冒出新芽，一片生機勃勃——看著就充滿活力！',
          html: scene(P(430, 296, '<path d="M-16 -6 q0 12 16 12 q16 0 16 -12 z" fill="#c9762f" stroke="#a85a1e" stroke-width="2.4"/>' +
              sprout2(0, -6, 22, 0)) +
            P(260, 302, A('kid', 'happy')) + hearts(350, 200)) },
        { minDur: 6600, sub: '「盎然」是充滿洋溢的樣子——到處都是綠色植物、充滿生機，就是「綠意盎然」！',
          html: scene(P(200, 302, TREE, '', 0, 1.2) + sprout2(340, 320, 28, 0) + sprout2(440, 318, 34, .3) + sprout2(540, 322, 26, .5) +
            P(650, 302, A('kid', 'happy'), '', 0, .92)) },
        { minDur: 6400, sub: '綠意盎然：到處是綠色植物，充滿生機。',
          html: scene(P(180, 302, TREE, '', 0, 1.2) + P(620, 302, TREE, '', .2, 1.05) + sprout2(360, 320, 30, 0) + sprout2(460, 318, 26, .3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">綠意盎然</text>') }
      ];
    },
    /* 依山傍水 */
    i1079: function () {
      var MTW = '<path d="M-20 252 L150 110 L320 252 Z" fill="#8fb0a0"/><path d="M240 252 L420 140 L600 252 Z" fill="#a5c2b2" opacity=".9"/>';
      var RIVERW2 = '<rect y="266" width="800" height="74" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 278 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#a8d4ee" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>';
      var HOUSE5 = '<path d="M-36 -30 L0 -54 L36 -30 Z" fill="#8a5a33"/><rect x="-28" y="-30" width="56" height="30" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.4"/><rect x="-8" y="-22" width="16" height="22" rx="3" fill="#8a5a33"/>';
      return [
        { minDur: 6800, sub: '外婆的老家背後靠著青山、前面挨著小河——「依山傍水」，風景美極了！',
          html: scene(MTW + RIVERW2 + P(620, 268, HOUSE5, '', 0, 1.1) +
            P(300, 296, A('kid', 'happy'), '', 0, .92) + hearts(400, 210)) },
        { minDur: 6800, sub: '早上聽鳥叫、傍晚看夕陽映在河面上——住在依山傍水的地方，多麼舒服！',
          html: scene(MTW + RIVERW2 + P(620, 268, HOUSE5, '', 0, 1.05) +
            P(200, 180, A('bird')) + notes(280, 150) + P(400, 296, A('kid', 'happy'), '', 0, .9)) },
        { minDur: 6600, sub: '「依山傍水」：靠著山、挨著水——形容地理位置好、風景優美！',
          html: scene(MTW + RIVERW2 + P(600, 268, HOUSE5, '', 0, 1.1) + hearts(430, 220)) },
        { minDur: 6400, sub: '依山傍水：靠著山、挨著水，風景優美。',
          html: scene(MTW + RIVERW2 + P(620, 268, HOUSE5, '', 0, 1.1) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">依山傍水</text>') }
      ];
    },
    /* 腳踏實地 */
    i1089: function () {
      var LADDER2 = '<g stroke="#a8734a" stroke-width="5" stroke-linecap="round"><line x1="-26" y1="0" x2="6" y2="-100"/><line x1="6" y1="0" x2="38" y2="-100"/><line x1="-17" y1="-28" x2="15" y2="-28"/><line x1="-8" y1="-56" x2="24" y2="-56"/><line x1="1" y1="-84" x2="33" y2="-84"/></g>';
      return [
        { minDur: 6800, sub: '學功夫沒有捷徑——師父說：「先蹲穩馬步！腳踩得實，功夫才紮得深。」',
          html: scene(P(360, 302, A('kid', 'angry')) + sweat(300, 192) +
            P(560, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.02, true)) },
        { minDur: 6800, sub: '讀書也一樣：一課一課讀懂、一題一題弄清，像爬梯子一階一階往上——不跳步、不偷懶！',
          html: scene(P(500, 302, LADDER2) + P(430, 302, A('kid', 'happy'), '', 0, .95) +
            P(240, 302, A('kid', 'happy') + P(-42, -54, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95), '', 0, .95)) },
        { minDur: 6600, sub: '「腳踏實地」：做事切實穩健、不虛浮——一步一腳印，走得最遠！',
          html: scene(P(400, 302, A('kid', 'happy'), 'st-strut', 0, 1.05) + hearts(490, 190) +
            '<g fill="#a8734a" opacity=".6"><ellipse cx="250" cy="320" rx="10" ry="5"/><ellipse cx="310" cy="322" rx="10" ry="5"/><ellipse cx="370" cy="320" rx="10" ry="5"/></g>') },
        { minDur: 6400, sub: '腳踏實地：做事切實穩健，不虛浮。',
          html: scene(P(400, 302, A('kid', 'happy'), 'st-strut', 0, 1.08) +
            '<g fill="#a8734a" opacity=".6"><ellipse cx="240" cy="320" rx="10" ry="5"/><ellipse cx="300" cy="322" rx="10" ry="5"/></g>' +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">腳踏實地</text>') }
      ];
    },
    /* 無影無蹤 */
    i1117: function () {
      return [
        { minDur: 6800, sub: '魔術師把手一揮，蓋上布再掀開——籠子裡的鴿子不見了！影子、蹤跡，全都沒有！',
          html: scene(P(430, 290, '<rect x="-34" y="-40" width="68" height="40" rx="5" fill="none" stroke="#8b93a3" stroke-width="3"/><line x1="-34" y1="-20" x2="34" y2="-20" stroke="#8b93a3" stroke-width="1.6"/><line x1="-17" y1="-40" x2="-17" y2="0" stroke="#8b93a3" stroke-width="1.6"/><line x1="17" y1="-40" x2="17" y2="0" stroke="#8b93a3" stroke-width="1.6"/>') +
            P(260, 302, A('kid', 'happy') + '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>') +
            qmark(430, 220) + bang(540, 190)) },
        { minDur: 6800, sub: '桌上的餅乾也無影無蹤了——地上只剩幾粒餅乾屑，通往小狗的窩……',
          html: scene(P(360, 290, '<ellipse cx="0" cy="0" rx="24" ry="8" fill="#fff" stroke="#c9bfa8" stroke-width="2.6"/>') +
            '<g fill="#c9a06c"><circle cx="420" cy="310" r="3"/><circle cx="470" cy="316" r="3"/><circle cx="520" cy="312" r="3"/></g>' +
            P(600, 300, A('dog'), '', 0, .95) + qmark(300, 220) + P(200, 302, A('kid', 'wow'), '', 0, .92)) },
        { minDur: 6600, sub: '「無影無蹤」：一點影子和蹤跡都沒有——完全消失不見！',
          html: scene(P(400, 240, '<circle cx="0" cy="0" r="40" fill="none" stroke="#c9bfa8" stroke-width="3" stroke-dasharray="10 10"/><text x="0" y="10" text-anchor="middle" font-size="30" fill="#c9bfa8">?</text>') +
            P(240, 302, A('kid', 'wow'), '', 0, .95) + sweat(300, 195)) },
        { minDur: 6400, sub: '無影無蹤：完全消失，蹤影全無。',
          html: scene(P(400, 245, '<circle cx="0" cy="0" r="44" fill="none" stroke="#c9bfa8" stroke-width="3" stroke-dasharray="10 10"/><text x="0" y="12" text-anchor="middle" font-size="34" fill="#c9bfa8">?</text>') +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">無影無蹤</text>') }
      ];
    },
    /* 分工合作 */
    i1145: function () {
      return [
        { minDur: 6800, sub: '大掃除開始！班長分派任務：你擦窗、我掃地、他排桌椅——每個人都有自己的工作。',
          html: scene(P(240, 302, A('kid', 'happy') + P(20, -34, '<path d="M-14 0 q7 -8 14 0 q7 8 14 0" stroke="#ffd97a" stroke-width="7" fill="none" stroke-linecap="round"/>', '', 0, .9)) +
            P(400, 302, A('kid', 'happy') + P(20, -34, '<line x1="0" y1="0" x2="20" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 0 l-10 12 M0 0 l-2 14 M0 0 l6 13" stroke="#c9a06c" stroke-width="3.4" stroke-linecap="round"/>', 'st-hoe'), '', .2, .95) +
            P(560, 302, A('kid', 'happy'), '', .4, .93)) },
        { minDur: 6800, sub: '各做各的、又互相配合——不到一小時，教室煥然一新，比一個人做快十倍！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(450, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            P(590, 302, '<g class="st-cheer" style="animation-delay:.4s">' + A('kid', 'happy') + '</g>', '', 0, .93) +
            hearts(450, 172) + bang(340, 190)) },
        { minDur: 6600, sub: '「分工合作」：分配工作、互相配合——團隊的力量最大！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(430, 302, A('kid', 'happy'), '', .1, .95) + P(560, 302, A('kid', 'happy'), '', .2, .93) +
            '<path d="M300 240 q130 -40 260 0" stroke="#548a40" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="9 8"/>') },
        { minDur: 6400, sub: '分工合作：分配工作、互相配合，共同完成。',
          html: scene(P(280, 302, A('kid', 'happy')) + P(420, 302, A('kid', 'happy'), '', .1, .95) + P(560, 302, A('kid', 'happy'), '', .2, .93) + hearts(420, 175) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">分工合作</text>') }
      ];
    },
    /* 揠苗助長（與拔苗助長同典） */
    i057: function () {
      var sc = STORIES.i1004();
      var last = sc[sc.length - 1];
      last.sub = '揠苗助長：急功近利硬求速成，反而壞事。';
      last.html = last.html.replace('拔苗助長', '揠苗助長');
      return sc;
    },
    /* 未雨綢繆 */
    i056: function () {
      var NEST = '<path d="M-24 0 q0 12 24 12 q24 0 24 -12 z" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>' +
        '<g stroke="#a8734a" stroke-width="2"><line x1="-20" y1="-2" x2="-8" y2="4"/><line x1="4" y1="-3" x2="16" y2="3"/></g>';
      var RAINFX3 = '<g stroke="#8fc6ff" stroke-width="3.4" stroke-linecap="round">' +
        '<line class="st-rain" x1="180" y1="30" x2="174" y2="52"/><line class="st-rain" style="animation-delay:.4s" x1="360" y1="16" x2="354" y2="38"/>' +
        '<line class="st-rain" style="animation-delay:.8s" x1="520" y1="30" x2="514" y2="52"/></g>';
      return [
        { minDur: 7000, sub: '《詩經》裡的小鳥最勤勞：天還沒下雨，就先啣來樹皮草莖，把窩修補得牢牢的！',
          html: scene(P(150, 302, TREE, '', 0, 1.2) + P(240, 200, NEST) + P(230, 176, A('bird'), '', 0, .8) +
            P(500, 302, A('kid', 'happy'), '', 0, .95) + hearts(400, 210)) },
        { minDur: 6800, sub: '暴風雨真的來了——別的窩被吹散，牠的窩穩穩當當，一家平安！',
          html: scene(RAINFX3 + P(150, 302, TREE, '', 0, 1.15) + P(240, 200, NEST) + P(230, 176, A('bird'), '', 0, .8) +
            bang(560, 190), 'night') },
        { minDur: 6800, sub: '「未雨綢繆」：趁還沒下雨先修門窗——凡事提前準備，才不會臨時慌張！',
          html: scene(P(340, 302, A('kid', 'happy') + P(-44, -46, '<rect x="-14" y="-16" width="28" height="20" rx="4" fill="#5c82ba" stroke="#46689a" stroke-width="2.4"/>', '', 0, 1)) + hearts(450, 190)) },
        { minDur: 6400, sub: '未雨綢繆：提前預備，防患未然。',
          html: scene(P(300, 220, NEST, '', 0, 1.2) + P(290, 194, A('bird'), '', 0, .85) + RAINFX3 +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">未雨綢繆</text>') }
      ];
    },
    /* 大器晚成 */
    i059: function () {
      var SMALLPOT = '<path d="M-10 0 q-4 -10 2 -13 h16 q6 3 2 13 q-5 4 -10 4 q-5 0 -10 -4 z" fill="#c9a06c" stroke="#a8734a" stroke-width="2"/>';
      var BIGDING = '<path d="M-34 -14 L-30 -52 Q-30 -60 -22 -60 L22 -60 Q30 -60 30 -52 L34 -14 Q34 -4 22 -4 L-22 -4 Q-34 -4 -34 -14 Z" fill="#8a7a5a" stroke="#6d6044" stroke-width="3"/>' +
        '<path d="M-24 -60 q-2 -12 8 -14 M24 -60 q2 -12 -8 -14" stroke="#6d6044" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<g stroke="#6d6044" stroke-width="4"><line x1="-22" y1="-4" x2="-26" y2="14"/><line x1="22" y1="-4" x2="26" y2="14"/><line x1="0" y1="-4" x2="0" y2="14"/></g>';
      return [
        { minDur: 7000, sub: '老子說：「大器晚成」——小碗小杯一下就燒好，鑄一座大鼎，卻要花上好多好多年！',
          html: scene(P(280, 296, SMALLPOT, '', 0, 1.2) + P(520, 300, BIGDING, '', 0, 1.3) +
            P(150, 302, A('kid', 'happy'), '', 0, .92) + qmark(400, 200)) },
        { minDur: 7000, sub: '漢朝的百里奚七十歲才當上宰相、畫家齊白石五十多歲畫風才大放異彩——成就來得晚，一樣了不起！',
          html: scene(P(360, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05) +
            hearts(460, 185) + bang(280, 195)) },
        { minDur: 6800, sub: '「大器晚成」：大才的人成就來得較晚——別急，好好累積，你的時刻總會到來！',
          html: scene(P(400, 300, BIGDING, '', 0, 1.4) + hearts(520, 220) +
            P(220, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6400, sub: '大器晚成：大才的人成就來得較晚。',
          html: scene(P(400, 300, BIGDING, '', 0, 1.5) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">大器晚成</text>') }
      ];
    },
    /* 蛛絲馬跡 */
    i060: function () {
      var WEB = '<g stroke="#c9d6e8" stroke-width="1.6" fill="none"><path d="M0 0 L-30 -30 M0 0 L0 -42 M0 0 L30 -30 M0 0 L-38 6 M0 0 L38 6"/><path d="M-18 -18 Q0 -26 18 -18 M-26 -4 Q0 -12 26 -4 M-12 -10 Q0 -15 12 -10"/></g>';
      var HOOFPRINTS = '<g fill="#a8734a" opacity=".75"><ellipse cx="0" cy="0" rx="8" ry="5"/><ellipse cx="50" cy="-6" rx="8" ry="5"/><ellipse cx="100" cy="0" rx="8" ry="5"/><ellipse cx="150" cy="-6" rx="8" ry="5"/></g>';
      var GLASS2 = '<circle cx="0" cy="0" r="18" fill="none" stroke="#8b93a3" stroke-width="4"/><line x1="13" y1="13" x2="26" y2="26" stroke="#8b93a3" stroke-width="5" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '小偵探辦案！屋角有細細的蜘蛛絲、地上有淡淡的馬蹄印——都是微小的線索！',
          html: scene(P(200, 180, WEB, '', 0, 1.3) + P(340, 316, HOOFPRINTS) +
            P(560, 302, A('kid', 'happy') + P(-36, -50, GLASS2, '', 0, .8)) + qmark(480, 190)) },
        { minDur: 6800, sub: '順著蹄印一路追蹤——果然在馬廄找到了「偷吃紅蘿蔔的犯人」：一匹小馬！',
          html: scene(P(300, 316, HOOFPRINTS) +
            P(560, 302, A('horse')) + P(620, 260, '<path d="M0 0 L-5 14 L5 14 Z" fill="#e0764a"/><path d="M0 0 q-3 -7 -7 -8 M0 0 q3 -7 7 -8" stroke="#548a40" stroke-width="2.4" fill="none"/>', '', 0, 1.2) +
            P(240, 302, A('kid', 'happy') + P(-36, -50, GLASS2, '', 0, .8)) + bang(430, 200)) },
        { minDur: 6600, sub: '「蛛絲馬跡」：極微小的痕跡——細心觀察，再小的線索都能揭開真相！',
          html: scene(P(300, 200, WEB, '', 0, 1.2) + P(430, 316, HOOFPRINTS) +
            P(620, 302, A('kid', 'happy') + P(-36, -50, GLASS2, '', 0, .8), '', 0, .95)) },
        { minDur: 6400, sub: '蛛絲馬跡：極微小的痕跡，可作為線索。',
          html: scene(P(260, 190, WEB, '', 0, 1.3) + P(400, 316, HOOFPRINTS) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">蛛絲馬跡</text>') }
      ];
    },
    /* 水落石出 */
    i061: function () {
      var STONES = '<path d="M-40 6 q-6 -18 8 -22 q16 -6 26 4 q10 8 2 18 z" fill="#b0b4bf" stroke="#8b93a3" stroke-width="2.4"/>' +
        '<path d="M30 8 q-4 -14 8 -16 q12 -3 18 5 q6 8 0 11 z" fill="#c4c9d4" stroke="#8b93a3" stroke-width="2"/>';
      return [
        { minDur: 6800, sub: '夏天的溪水滿滿的，什麼都看不見；到了枯水期，水位一降——河床的大石頭全露了出來！',
          html: scene('<rect y="252" width="800" height="88" fill="#7fb2e0" opacity=".6"/>' +
            P(400, 322, STONES, '', 0, 1.3) +
            P(180, 302, A('kid', 'wow'), '', 0, .92) + qmark(260, 200)) },
        { minDur: 7000, sub: '蘇軾在〈後赤壁賦〉寫下「山高月小，水落石出」——後來用來比喻：真相總有大白的一天！',
          html: scene(P(600, 90, '<path d="M14 -26 A30 30 0 1 0 26 16 A24 24 0 1 1 14 -26 Z" fill="#f4f1de"/>') +
            P(400, 322, STONES, '', 0, 1.2) +
            P(220, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, .95), 'night') },
        { minDur: 6800, sub: '教室的失竊案查清楚了——原來是風把作業吹進了櫃子後面！水落石出，大家都鬆了口氣。',
          html: scene(P(300, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .97, true) +
            hearts(400, 180) + bang(560, 200)) },
        { minDur: 6400, sub: '水落石出：事實真相終於顯露。',
          html: scene(P(400, 322, STONES, '', 0, 1.4) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">水落石出</text>') }
      ];
    },
    /* 十年磨劍 */
    i063: function () {
      var SWORD3 = '<line x1="0" y1="0" x2="32" y2="-50" stroke="#c4cede" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="5" y1="-14" x2="17" y2="-5" stroke="#c98f2a" stroke-width="4.6" stroke-linecap="round"/>';
      var WHET = '<rect x="-26" y="-8" width="52" height="12" rx="4" fill="#8b93a3" stroke="#6d7585" stroke-width="2.4"/>';
      return [
        { minDur: 7000, sub: '唐朝賈島的詩說：「十年磨一劍，霜刃未曾試。」——鑄劍師十年只磨一把劍，劍刃亮如寒霜！',
          html: scene(P(430, 312, WHET) + P(400, 302, A('kid', 'angry') + P(28, -40, SWORD3, 'st-hoe', 0, .8)) +
            sweat(340, 195), 'night') },
        { minDur: 6800, sub: '奧運選手也一樣：十年苦練基本功，只為賽場上發光的那幾分鐘！',
          html: scene(P(360, 302, A('kid', 'angry'), 'st-dashL') + sweat(300, 190) +
            P(560, 290, '<path d="M-14 -34 h28 v10 q0 14 -14 16 q-14 -2 -14 -16 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/><rect x="-12" y="0" width="24" height="6" rx="2.4" fill="#c98f2a"/>', '', 0, 1)) },
        { minDur: 6800, sub: '「十年磨劍」：花費多年默默準備，一出手就驚人——深藏的功夫最鋒利！',
          html: scene(P(400, 302, A('kid', 'happy') + P(28, -40, SWORD3, '', 0, .9), '', 0, 1.05) + bang(520, 190) + hearts(300, 192)) },
        { minDur: 6400, sub: '十年磨劍：多年準備，一鳴驚人。',
          html: scene(P(400, 300, SWORD3, '', 0, 1.5) + P(340, 316, WHET, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">十年磨劍</text>') }
      ];
    },
    /* 柳暗花明 */
    i065: function () {
      var WILLOW = '<rect x="-8" y="-50" width="16" height="50" rx="6" fill="#a8734a"/>' +
        '<path d="M-4 -50 q-16 6 -20 30 M0 -52 q-4 12 -2 32 M4 -50 q14 8 16 30 M-8 -48 q-24 2 -30 20" stroke="#8fd08f" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
      function flower8(x, y, color, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<line x1="0" y1="0" x2="0" y2="-14" stroke="#5f8a46" stroke-width="3"/><circle cx="0" cy="-19" r="4.6" fill="' + color + '"/><circle cx="-5" cy="-15" r="4.6" fill="' + color + '"/><circle cx="5" cy="-15" r="4.6" fill="' + color + '"/><circle cx="0" cy="-15" r="3" fill="#ffe066"/></g>');
      }
      var HOUSE6 = '<path d="M-36 -30 L0 -54 L36 -30 Z" fill="#8a5a33"/><rect x="-28" y="-30" width="56" height="30" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="2.4"/><rect x="-8" y="-22" width="16" height="22" rx="3" fill="#8a5a33"/>';
      return [
        { minDur: 7000, sub: '陸游走在山路上：山重重、水重重，前面好像沒路了……正想折返——',
          html: scene(P(560, 302, '<path d="M-110 0 L0 -130 L110 0 Z" fill="#8fb0a0"/>') +
            P(280, 302, A('kid', 'sad'), 'st-strut') + sweat(230, 195) + qmark(360, 185), 'night') },
        { minDur: 7000, sub: '轉個彎——柳樹成蔭、繁花似錦，一座村莊出現在眼前！「柳暗花明又一村」！',
          html: scene(P(200, 302, WILLOW, '', 0, 1.2) + flower8(320, 320, '#ff9eb5', 0) + flower8(400, 318, '#ffd97a', .3) +
            P(560, 302, HOUSE6, '', 0, 1.1) +
            P(300, 302, A('kid', 'wow'), '', 0, .95) + bang(450, 190) + hearts(500, 230)) },
        { minDur: 6800, sub: '「柳暗花明」：山窮水盡時忽然出現轉機——絕處逢生，別輕易放棄！',
          html: scene(P(220, 302, WILLOW, '', 0, 1.1) + flower8(350, 320, '#c9a8e0', 0) +
            P(500, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(420, 190)) },
        { minDur: 6400, sub: '柳暗花明：豁然開朗，絕處逢生。',
          html: scene(P(220, 302, WILLOW, '', 0, 1.2) + flower8(360, 320, '#ff9eb5', 0) + flower8(460, 318, '#ffd97a', .3) + P(600, 302, HOUSE6, '', 0, 1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">柳暗花明</text>') }
      ];
    },
    /* 披著羊皮的狼 */
    i052: function () {
      var SHEEPSKIN = '<path d="M-26 -40 a26 20 0 0 1 52 0 l0 14 a26 16 0 0 1 -52 0 z" fill="#f4f1e8" stroke="#d5cfc0" stroke-width="2.4" opacity=".92"/>' +
        '<circle cx="-14" cy="-46" r="7" fill="#fff" opacity=".9"/><circle cx="4" cy="-50" r="8" fill="#fff" opacity=".9"/><circle cx="16" cy="-44" r="7" fill="#fff" opacity=".9"/>';
      return [
        { minDur: 6800, sub: '寓言裡的狼想混進羊圈——牠披上一張羊皮，遠遠看去，就像一隻溫馴的綿羊！',
          html: scene(P(400, 302, A('fox') + SHEEPSKIN, '', 0, 1.05) +
            P(200, 296, A('goat'), '', 0, .85) + P(620, 296, A('goat'), '', .2, .8) + qmark(500, 195)) },
        { minDur: 6800, sub: '牧羊人數羊時發現不對勁——羊皮下露出了尖尖的爪子！壞心眼再會偽裝，也會露出馬腳。',
          html: scene(P(400, 302, A('fox') + SHEEPSKIN, '', 0, 1.05) + bang(500, 200) +
            P(200, 302, A('kid', 'wow')) + sweat(260, 192)) },
        { minDur: 6800, sub: '「披著羊皮的狼」：外表善良、內心狡詐的偽裝者——交朋友要看人心，不是只看外表！',
          html: scene(P(320, 302, A('goat'), '', 0, .9) + P(520, 302, A('fox'), '', 0, .95) +
            '<text x="420" y="200" text-anchor="middle" font-size="24" fill="#4a3200">≠</text>') },
        { minDur: 6400, sub: '披著羊皮的狼：外表善良，實則狡詐的偽裝者。',
          html: scene(P(400, 302, A('fox') + SHEEPSKIN, '', 0, 1.15) +
            '<text x="400" y="80" text-anchor="middle" font-size="44" font-weight="bold" fill="#4a3200">披著羊皮的狼</text>') }
      ];
    },
    /* 千篇一律 */
    i053: function () {
      function samePaper(x, y, dly) {
        return P(x, y, '<g' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '><rect x="-16" y="-20" width="32" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.2"/>' +
          '<path d="M-9 -12 h18 M-9 -5 h18 M-9 2 h18 M-9 9 h12" stroke="#8fa3bf" stroke-width="1.8"/></g>');
      }
      return [
        { minDur: 6800, sub: '改作文的老師嘆氣：三十篇〈我的假日〉，全都寫「睡覺、看電視、寫作業」——一模一樣！',
          html: scene(samePaper(280, 260, 0) + samePaper(400, 255, .1) + samePaper(520, 262, .2) +
            P(160, 302, A('kid', 'sad'), '', 0, .95) + sweat(220, 195) + zzz(600, 210)) },
        { minDur: 6800, sub: '只有一篇寫「陪爺爺放風箏，線斷了追過三條街」——特別生動，讓人眼睛一亮！',
          html: scene(samePaper(280, 262, 0) +
            P(460, 255, '<rect x="-16" y="-20" width="32" height="40" rx="3" fill="#fff7d9" stroke="#e8b84a" stroke-width="2.6"/><path d="M-9 -12 h18 M-9 -5 h18 M-9 2 h18" stroke="#e0a458" stroke-width="1.8"/>', '', 0, 1.2) +
            bang(560, 200) + P(160, 302, A('kid', 'happy'), '', 0, .95) + hearts(240, 195)) },
        { minDur: 6600, sub: '「千篇一律」：全部一個樣、毫無變化——寫出自己的觀察和感受，才有味道！',
          html: scene(samePaper(260, 262, 0) + samePaper(360, 258, .1) + samePaper(460, 264, .2) + qmark(560, 210)) },
        { minDur: 6400, sub: '千篇一律：全部一樣，毫無變化。',
          html: scene(samePaper(280, 260, 0) + samePaper(400, 256, .1) + samePaper(520, 262, .2) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千篇一律</text>') }
      ];
    },
    /* 禍在眼前 */
    i055: function () {
      return [
        { minDur: 6800, sub: '騎車不看路、邊騎邊滑手機——前面的水溝就在三步之外！禍事眼看就要發生！',
          html: scene(P(340, 296, '<circle cx="-24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/><circle cx="24" cy="0" r="16" fill="none" stroke="#5c82ba" stroke-width="4"/><path d="M-24 0 L-8 -22 L14 -22 L24 0 M-8 -22 L-2 0" stroke="#e85a4f" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
              P(-4, -32, A('kid', 'happy'), '', 0, .78), 'st-strut') +
            P(560, 322, '<rect x="-40" y="-6" width="80" height="12" rx="4" fill="#4a4238"/>') + bang(560, 260) + sweat(430, 200)) },
        { minDur: 6800, sub: '路人大喊：「小心前面！」他及時剎車——好險！差一點就摔進溝裡。',
          html: scene(P(400, 296, A('kid', 'wow'), '', 0, 1) + sweat(340, 190) +
            P(180, 302, A('kid', 'angry')) + bang(280, 185) +
            P(560, 322, '<rect x="-40" y="-6" width="80" height="12" rx="4" fill="#4a4238"/>')) },
        { minDur: 6600, sub: '「禍在眼前」：危險迫在眉睫——保持警覺，才能及時避開！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + hearts(490, 190)) },
        { minDur: 6400, sub: '禍在眼前：危險就在眼前，迫在眉睫。',
          html: scene(P(340, 302, A('kid', 'wow'), '', 0, 1.05) + bang(480, 200) + sweat(280, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">禍在眼前</text>') }
      ];
    },
    /* 豐功偉績 */
    i058: function () {
      var MONUMENT = '<rect x="-16" y="-90" width="32" height="90" rx="4" fill="#b0b4bf" stroke="#8b93a3" stroke-width="2.6"/><rect x="-26" y="0" width="52" height="10" rx="3" fill="#8b93a3"/><path d="M-16 -90 L0 -108 L16 -90 Z" fill="#b0b4bf" stroke="#8b93a3" stroke-width="2.6"/>';
      return [
        { minDur: 6800, sub: '大禹治水十三年，讓百姓免於洪災；李時珍寫《本草綱目》，救人無數——都是了不起的大功勞！',
          html: scene(P(300, 302, A('kid', 'happy') + P(16, -30, HOE, 'st-hoe')) +
            P(540, 302, A('kid', 'happy') + P(-42, -54, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95), '', 0, .97) + hearts(430, 185)) },
        { minDur: 6600, sub: '人們立碑紀念這些偉大的功績，讓後代永遠記得！',
          html: scene(P(430, 302, MONUMENT, '', 0, 1.1) +
            P(250, 302, A('kid', 'happy')) + P(600, 302, A('kid', 'happy'), '', .2, .93) + hearts(430, 180)) },
        { minDur: 6600, sub: '「豐功偉績」：偉大的功勞和成就——用一生做對世界有益的事！',
          html: scene(P(430, 302, MONUMENT, '', 0, 1.05) + hearts(530, 210) + P(250, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6400, sub: '豐功偉績：偉大的功績和成就。',
          html: scene(P(400, 302, MONUMENT, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">豐功偉績</text>') }
      ];
    },
    /* 眾所周知 */
    i062: function () {
      return [
        { minDur: 6800, sub: '「太陽從東邊升起」「一年有四季」——這些事大家都知道，不用再解釋！',
          html: scene(P(650, 80, '<circle cx="0" cy="0" r="26" fill="#ffdd66" stroke="#f5b73e" stroke-width="3"/>') +
            P(300, 302, A('kid', 'happy')) + P(460, 302, A('kid', 'happy'), '', .2, .95) + hearts(380, 185)) },
        { minDur: 6800, sub: '演講時可以說：「眾所周知，運動有益健康……」——從大家都認同的事實開始，最有說服力！',
          html: scene(P(400, 288, '<rect x="-90" y="0" width="180" height="14" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>') +
            P(400, 288, A('kid', 'happy'), '', 0, 1.02) +
            P(200, 302, A('kid', 'happy'), '', 0, .88) + P(600, 302, A('kid', 'happy'), '', .2, .88, true) + notes(480, 180)) },
        { minDur: 6600, sub: '「眾所周知」：大家都知道、公開的事實！',
          html: scene(P(300, 302, A('kid', 'happy'), '', 0, .95) + P(430, 302, A('kid', 'happy'), '', .1, .93) + P(560, 302, A('kid', 'happy'), '', .2, .95) +
            P(430, 190, '<circle cx="0" cy="0" r="24" fill="#fff" opacity=".92"/><path d="M-9 0 l6 7 l13 -13" stroke="#548a40" stroke-width="4" fill="none" stroke-linecap="round"/>')) },
        { minDur: 6400, sub: '眾所周知：大家都知道，公開的事實。',
          html: scene(P(280, 302, A('kid', 'happy')) + P(420, 302, A('kid', 'happy'), '', .1, .95) + P(560, 302, A('kid', 'happy'), '', .2, .93) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">眾所周知</text>') }
      ];
    },
    /* 卧虎藏龍 */
    i064: function () {
      return [
        { minDur: 6800, sub: '新來的轉學生看起來安安靜靜——鋼琴比賽一上台，竟然彈出全場最動人的曲子！',
          html: scene(P(360, 302, A('kid', 'happy')) + notes(450, 165) + notes(300, 175) +
            P(580, 302, A('kid', 'wow'), '', 0, .93, true) + bang(500, 190)) },
        { minDur: 6800, sub: '掃地的大叔原來是書法名家、餐廳阿姨是前羽球國手——高手就藏在人群裡！',
          html: scene(P(280, 302, A('kid', 'happy') + P(20, -34, '<line x1="0" y1="0" x2="20" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 0 l-10 12 M0 0 l-2 14 M0 0 l6 13" stroke="#c9a06c" stroke-width="3.4" stroke-linecap="round"/>', '', 0, .95)) +
            P(520, 302, A('kid', 'happy'), '', .2, .95) + qmark(400, 182) + hearts(600, 195)) },
        { minDur: 6800, sub: '「卧虎藏龍」：像趴著的虎、藏起來的龍——隱藏著許多有本領的人才！',
          html: scene(P(280, 302, A('tiger'), '', 0, .95) + P(540, 190, A('dragon'), '', .2, .95) + hearts(420, 240)) },
        { minDur: 6400, sub: '卧虎藏龍：隱伏著德才兼備的人。',
          html: scene(P(300, 302, A('tiger')) + P(520, 190, A('dragon')) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">卧虎藏龍</text>') }
      ];
    },
    /* 峰迴路轉 */
    i066: function () {
      var WINDPATH = '<path d="M100 330 q120 -30 60 -80 q-50 -42 60 -70 q100 -26 180 -60" stroke="#e8dcc0" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="16 12"/>';
      var MTBIG = '<path d="M240 302 L430 90 L640 302 Z" fill="#8fb0a0"/><path d="M430 90 L404 122 L430 134 L458 120 Z" fill="#eef4f0"/>';
      return [
        { minDur: 6800, sub: '山路彎彎曲曲，繞著山峰轉了一圈又一圈——每轉一個彎，風景就完全不同！',
          html: scene(MTBIG + WINDPATH +
            P(200, 302, A('kid', 'happy'), 'st-strut', 0, .92)) },
        { minDur: 7000, sub: '歐陽脩在〈醉翁亭記〉寫「峰迴路轉」——後來也比喻：事情有了新轉機，絕處又逢生！',
          html: scene(MTBIG +
            P(250, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, .95) + hearts(360, 200)) },
        { minDur: 6800, sub: '比賽落後十分，眼看要輸——最後三分鐘連進四球逆轉！峰迴路轉，絕不放棄！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(470, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .95) + bang(400, 180) + hearts(560, 195)) },
        { minDur: 6400, sub: '峰迴路轉：山路迂迴，比喻出現轉機。',
          html: scene(MTBIG + WINDPATH +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">峰迴路轉</text>') }
      ];
    },
    /* 無可厚非 */
    i054: function () {
      return [
        { minDur: 7000, sub: '下大雨，小安遲到了十分鐘。有同學想責怪他，班長說：「風雨這麼大，遲到情有可原呀。」',
          html: scene('<g stroke=\"#8fc6ff\" stroke-width=\"3.4\" stroke-linecap=\"round\"><line class=\"st-rain\" x1=\"160\" y1=\"30\" x2=\"154\" y2=\"52\"/><line class=\"st-rain\" style=\"animation-delay:.4s\" x1=\"330\" y1=\"16\" x2=\"324\" y2=\"38\"/></g>' +
            P(300, 302, A('kid', 'sad')) + sweat(250, 195) +
            P(520, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(420, 185)) },
        { minDur: 6800, sub: '做法雖然不完美，但理由正當、可以理解——沒什麼好過分責備的！',
          html: scene(P(320, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .97, true) +
            P(410, 190, '<circle cx="0" cy="0" r="24" fill="#fff" opacity=".92"/><path d="M-9 0 l6 7 l13 -13" stroke="#548a40" stroke-width="4" fill="none" stroke-linecap="round"/>')) },
        { minDur: 6600, sub: '「無可厚非」：沒有什麼過分的地方，可以體諒——待人多一分寬容！',
          html: scene(P(360, 302, A('kid', 'happy'), '', 0, 1.02) + P(540, 302, A('kid', 'happy'), '', .2, .95) + hearts(450, 180)) },
        { minDur: 6400, sub: '無可厚非：沒有什麼過分之處，可以理解。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) +
            P(400, 195, '<circle cx="0" cy="0" r="26" fill="#fff" opacity=".92"/><path d="M-10 0 l7 8 l14 -14" stroke="#548a40" stroke-width="4.4" fill="none" stroke-linecap="round"/>') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">無可厚非</text>') }
      ];
    },
    /* 雪上加霜 */
    i248: function () {
      var SNOWFX2 = '<g fill="#fff"><circle class="st-snow" cx="180" cy="30" r="4"/><circle class="st-snow" style="animation-delay:1s" cx="380" cy="22" r="3.4"/><circle class="st-snow" style="animation-delay:.5s" cx="540" cy="38" r="4"/></g>';
      return [
        { minDur: 6800, sub: '出門就摔了一跤，褲子破了個洞——結果又下起大雪，全身濕透，冷上加冷！',
          html: scene(SNOWFX2 + '<ellipse cx="400" cy="330" rx="420" ry="40" fill="#fff" opacity=".9"/>' +
            P(360, 306, '<g class="st-faint">' + A('kid', 'sad') + '</g>') + sweat(300, 200) + bang(450, 230), 'night') },
        { minDur: 6800, sub: '雪已經夠冷了，再加上一層霜——壞事一件接一件，處境更加艱難！',
          html: scene(SNOWFX2 + '<ellipse cx="400" cy="330" rx="420" ry="40" fill="#fff" opacity=".95"/>' +
            P(400, 300, A('kid', 'wow')) + sweat(340, 190) + qmark(470, 182), 'night') },
        { minDur: 6800, sub: '朋友遇到「雪上加霜」的時候，一句安慰、一把雨傘，就是雪中送炭的溫暖！',
          html: scene(SNOWFX2 + P(300, 302, A('kid', 'sad')) +
            P(480, 302, A('kid', 'happy') + P(30, -70, '<path d="M0 -50 q-30 0 -34 22 q8 -8 17 0 q8 -8 17 0 q8 -8 17 0 q8 -8 17 0 q-4 -22 -34 -22 z" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.4"/><line x1="0" y1="-28" x2="0" y2="8" stroke="#8b93a3" stroke-width="3.4"/>', '', 0, 1), '', 0, .98, true) + hearts(400, 190)) },
        { minDur: 6400, sub: '雪上加霜：災禍接連而來，處境更加困難。',
          html: scene(SNOWFX2 + '<ellipse cx="400" cy="330" rx="420" ry="40" fill="#fff" opacity=".95"/>' +
            P(400, 300, A('kid', 'sad'), '', 0, 1.05) + sweat(340, 192) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">雪上加霜</text>', 'night') }
      ];
    },
    /* 錦囊妙計 */
    i249: function () {
      var POUCH = '<path d="M-18 0 Q-24 -28 0 -34 Q24 -28 18 0 Z" fill="#c96a5a" stroke="#a84a3f" stroke-width="2.6"/>' +
        '<path d="M-8 -34 q8 -6 16 0" stroke="#a84a3f" stroke-width="3" fill="none"/>' +
        '<path d="M-10 -16 q10 6 20 0" stroke="#ffd97a" stroke-width="2.4" fill="none"/>' +
        '<circle cx="0" cy="-24" r="3" fill="#ffd97a"/>';
      var NOTE = '<rect x="-12" y="-16" width="24" height="32" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-6 -8 h12 M-6 0 h12 M-6 8 h8" stroke="#8fa3bf" stroke-width="1.8"/>';
      return [
        { minDur: 7000, sub: '《三國演義》裡，諸葛亮交給趙雲三個錦囊：「遇到危急，就依序打開！」',
          html: scene(P(300, 302, A('kid', 'happy') + '<path d="M0 0 L-16 -34 A22 22 0 0 1 16 -34 Z" fill="#f4f1e8" stroke="#c9bfa8" stroke-width="2.4" transform="translate(-30,-40) scale(.9)"/>') +
            P(500, 302, A('kid', 'angry') + P(-36, -50, POUCH, '', 0, .8), '', 0, .98, true) + hearts(410, 190)) },
        { minDur: 7000, sub: '果然每次遇到絕境，一打開錦囊，裡面的妙計都剛好化險為夷——神機妙算！',
          html: scene(P(360, 302, A('kid', 'wow') + P(38, -60, POUCH, '', 0, .9)) +
            P(470, 230, NOTE, '', 0, 1.1) + bang(560, 190) + hearts(280, 195)) },
        { minDur: 6800, sub: '「錦囊妙計」：預先準備好的高明辦法——考前把重點整理成小卡，也是你的錦囊妙計！',
          html: scene(P(340, 302, A('kid', 'happy') + P(-44, -50, NOTE, '', 0, .95)) + hearts(450, 190)) },
        { minDur: 6400, sub: '錦囊妙計：預先準備好的高明計策。',
          html: scene(P(400, 290, POUCH, '', 0, 1.6) + P(520, 260, NOTE, '', 0, 1.1) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">錦囊妙計</text>') }
      ];
    },
    /* 掩人耳目 */
    i253: function () {
      var BOXCOVER = '<rect x="-26" y="-20" width="52" height="20" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/><text x="0" y="-6" text-anchor="middle" font-size="11" fill="#4a3200">舊玩具</text>';
      return [
        { minDur: 6800, sub: '漫畫被媽媽發現會被收走——小聰把漫畫藏進寫著「舊玩具」的箱子裡，想騙過媽媽的眼睛。',
          html: scene(P(430, 296, BOXCOVER, '', 0, 1.2) +
            P(260, 302, A('kid', 'happy')) + qmark(340, 190) + sweat(200, 195)) },
        { minDur: 6800, sub: '可是紙包不住火——媽媽整理房間一打開箱子，全露餡了！',
          html: scene(P(430, 296, BOXCOVER, '', 0, 1.1) + bang(520, 220) +
            P(600, 302, A('kid', 'angry'), '', 0, 1.02, true) +
            P(260, 302, A('kid', 'wow')) + sweat(310, 192)) },
        { minDur: 6800, sub: '「掩人耳目」：遮住別人的視聽、隱瞞真相——但謊言總有被拆穿的一天，誠實最好！',
          html: scene(P(320, 302, A('kid', 'sad')) + P(500, 302, A('kid', 'happy'), '', 0, 1.02, true) + hearts(410, 185)) },
        { minDur: 6400, sub: '掩人耳目：遮蔽別人的視聽，隱瞞真相。',
          html: scene(P(400, 296, BOXCOVER, '', 0, 1.3) + qmark(520, 230) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">掩人耳目</text>') }
      ];
    },
    /* 見義勇為 */
    i255: function () {
      return [
        { minDur: 6800, sub: '公車上有人偷拿乘客的錢包！大家都看見了，卻不敢出聲……',
          html: scene(P(300, 302, A('kid', 'happy') + P(40, -40, '<rect x="-10" y="-14" width="20" height="14" rx="4" fill="#8a5a33" stroke="#6d4426" stroke-width="2"/>', '', 0, .9)) +
            P(500, 302, A('kid', 'wow'), '', 0, .93) + sweat(550, 195) + qmark(420, 182), 'night') },
        { minDur: 6800, sub: '一位高年級的哥哥站了出來：「請把錢包還給人家！」同時請司機協助處理——勇敢又冷靜！',
          html: scene(P(360, 302, A('kid', 'angry')) + bang(450, 182) +
            P(560, 302, A('kid', 'sad'), '', 0, .95) + P(180, 302, A('kid', 'happy'), '', .2, .92) + hearts(270, 190)) },
        { minDur: 6800, sub: '「見義勇為」：看到正義的事就勇敢去做——但記得也要保護自己、找大人幫忙！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 188)) },
        { minDur: 6400, sub: '見義勇為：看到合乎正義的事就勇敢去做。',
          html: scene(P(400, 302, A('kid', 'angry'), '', 0, 1.05) + bang(490, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">見義勇為</text>') }
      ];
    },
    /* 樂善好施 */
    i256: function () {
      var DONATEBOX = '<rect x="-24" y="-30" width="48" height="30" rx="4" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.6"/><rect x="-10" y="-34" width="20" height="4" rx="2" fill="#c94a3f"/><path d="M-6 -14 q-8 -8 0 -10 q4 -1 6 4 q2 -5 6 -4 q8 2 0 10 l-6 6 z" fill="#fff"/>';
      var COIN = '<circle cx="0" cy="0" r="8" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.2"/>';
      return [
        { minDur: 6800, sub: '巷口的麵店老闆常送熱湯給獨居的爺爺奶奶，還捐錢幫學校修圖書室——',
          html: scene(P(300, 302, A('kid', 'happy') + P(38, -46, '<path d="M-12 -6 q0 10 12 10 q12 0 12 -10 z" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.2"/>', '', 0, .95)) +
            P(520, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, .95, true) + hearts(420, 185)) },
        { minDur: 6800, sub: '有人問他為什麼？他笑笑：「幫助別人，自己心裡最快樂呀！」',
          html: scene(P(360, 302, A('kid', 'happy'), '', 0, 1.05) + hearts(450, 180) + hearts(280, 190)) },
        { minDur: 6600, sub: '「樂善好施」：樂於行善、喜歡助人——小小的零錢捐款，也是大大的善意！',
          html: scene(P(430, 296, DONATEBOX, '', 0, 1.2) + P(390, 240, COIN, '', 0, 1) +
            P(260, 302, A('kid', 'happy')) + hearts(350, 200)) },
        { minDur: 6400, sub: '樂善好施：樂於行善，喜歡施捨助人。',
          html: scene(P(400, 296, DONATEBOX, '', 0, 1.3) + P(360, 240, COIN, '', 0, 1.05) + hearts(500, 220) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">樂善好施</text>') }
      ];
    },
    /* 專心致志 */
    i257: function () {
      var GOBOARD = '<rect x="-24" y="-24" width="48" height="48" rx="5" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.6"/><g stroke="#a89878" stroke-width="1.6"><line x1="-24" y1="-8" x2="24" y2="-8"/><line x1="-24" y1="8" x2="24" y2="8"/><line x1="-8" y1="-24" x2="-8" y2="24"/><line x1="8" y1="-24" x2="8" y2="24"/></g><circle cx="-16" cy="-16" r="4.6" fill="#3a2e26"/><circle cx="8" cy="0" r="4.6" fill="#fff" stroke="#c9bfa8"/>';
      return [
        { minDur: 7000, sub: '《孟子》裡的故事：兩個學生跟棋王弈秋學下棋。一個專心致志，句句聽進心裡——',
          html: scene(P(430, 260, GOBOARD, '', 0, 1.1) +
            P(260, 302, A('kid', 'happy')) +
            P(590, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.02, true)) },
        { minDur: 7000, sub: '另一個人在座位上，心卻想著「天上有大雁飛來，我要拿弓箭射牠」——同一位老師，學出兩種結果！',
          html: scene(P(430, 260, GOBOARD, '', 0, 1) +
            P(260, 302, A('kid', 'happy')) +
            P(550, 150, A('bird')) +
            P(620, 302, A('kid', 'wow'), '', 0, .95) + qmark(670, 190)) },
        { minDur: 6800, sub: '「專心致志」：心思專一、全神投入——學任何本領，專心是第一步！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -50, GOBOARD, '', 0, .7)) + hearts(470, 190)) },
        { minDur: 6400, sub: '專心致志：心思專一，全神投入。',
          html: scene(P(400, 260, GOBOARD, '', 0, 1.25) + P(240, 302, A('kid', 'happy'), '', 0, .95) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">專心致志</text>') }
      ];
    },
    /* 聚精會神 */
    i258: function () {
      var MICROSCOPE = '<rect x="-16" y="0" width="40" height="8" rx="3" fill="#8b93a3"/><line x1="0" y1="0" x2="8" y2="-30" stroke="#6d7585" stroke-width="5"/><rect x="2" y="-44" width="12" height="18" rx="3" fill="#8b93a3" transform="rotate(16 8 -35)"/><circle cx="-2" cy="-4" r="5" fill="#c9d6e8"/>';
      return [
        { minDur: 6800, sub: '自然課用顯微鏡觀察洋蔥細胞——小研眼睛貼著鏡頭，一格一格仔細看，大氣都不敢出！',
          html: scene(P(430, 296, MICROSCOPE, '', 0, 1.3) +
            P(300, 302, A('kid', 'happy')) + qmark(220, 190)) },
        { minDur: 6800, sub: '全教室安安靜靜，每個人都把精神集中在鏡頭裡的小世界——連下課鈴都沒聽到！',
          html: scene(P(300, 302, A('kid', 'happy'), '', 0, .95) + P(460, 302, A('kid', 'happy'), '', .2, .93) +
            P(560, 296, MICROSCOPE, '', 0, 1) + notes(180, 170)) },
        { minDur: 6600, sub: '「聚精會神」：把精神集中在一起——和「專心致志」是好朋友！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) +
            '<circle cx="400" cy="240" r="90" fill="none" stroke="#ffd97a" stroke-width="3" stroke-dasharray="10 10" opacity=".7"/>' + hearts(500, 195)) },
        { minDur: 6400, sub: '聚精會神：集中精神，專心一意。',
          html: scene(P(360, 302, A('kid', 'happy')) + P(500, 296, MICROSCOPE, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">聚精會神</text>') }
      ];
    },
    /* 突飛猛進 */
    i259: function () {
      var CHART = '<g stroke="#8b93a3" stroke-width="3"><line x1="-60" y1="30" x2="60" y2="30"/><line x1="-60" y1="30" x2="-60" y2="-50"/></g>' +
        '<path d="M-52 22 L-20 12 L8 -8 L52 -44" stroke="#548a40" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<path d="M52 -44 l-14 -2 l8 12 z" fill="#548a40"/>';
      return [
        { minDur: 6800, sub: '小躍原本五十公尺要跑十二秒。暑假天天練起跑、擺臂、衝刺——',
          html: scene(P(340, 302, A('kid', 'angry'), 'st-dashL') + sweat(280, 190) +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="120" y1="240" x2="200" y2="240"/></g>') },
        { minDur: 6800, sub: '開學一測：九秒八！進步得又快又猛，教練都嚇一跳——「你是坐火箭進步的嗎？」',
          html: scene(P(430, 250, CHART, '', 0, 1.2) + bang(560, 190) +
            P(220, 302, A('kid', 'wow'), '', 0, .95) + hearts(300, 200)) },
        { minDur: 6600, sub: '「突飛猛進」：像飛一樣快速進步——用對方法加上努力，人人都能突飛猛進！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + bang(490, 185) + hearts(300, 192)) },
        { minDur: 6400, sub: '突飛猛進：進步非常快速。',
          html: scene(P(400, 255, CHART, '', 0, 1.35) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">突飛猛進</text>') }
      ];
    },
    /* 一鼓作氣 */
    i260: function () {
      var WARDRUM = '<ellipse cx="0" cy="-30" rx="24" ry="9" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.4"/>' +
        '<path d="M-24 -30 L-24 -4 Q0 6 24 -4 L24 -30" fill="#c96a5a" stroke="#a84a3f" stroke-width="2.4"/>' +
        '<line x1="-12" y1="-46" x2="-3" y2="-34" stroke="#a8734a" stroke-width="3.6" stroke-linecap="round"/><line x1="14" y1="-48" x2="5" y2="-34" stroke="#a8734a" stroke-width="3.6" stroke-linecap="round"/>';
      var SPEAR3 = '<line x1="0" y1="10" x2="0" y2="-46" stroke="#a8734a" stroke-width="4" stroke-linecap="round"/><path d="M0 -58 l-7 14 h14 z" fill="#8b93a3"/>';
      return [
        { minDur: 7200, sub: '《左傳》曹劌論戰：齊軍擂第一通鼓，士氣最旺；第二通鼓就弱了；第三通鼓，力氣全洩光！',
          html: scene(P(300, 302, A('kid', 'angry') + P(36, -40, WARDRUM, '', 0, .9)) + bang(400, 185) +
            P(560, 302, A('kid', 'angry') + P(26, -50, SPEAR3), '', 0, .93) + notes(470, 165)) },
        { minDur: 7200, sub: '曹劌等齊軍擂完三通鼓才下令出擊——魯軍趁著第一股銳氣，一口氣衝垮了敵人！',
          html: scene(P(300, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-dashL') +
            P(430, 302, A('kid', 'angry') + P(26, -50, SPEAR3), 'st-dashL', .15, .93) + bang(580, 200) +
            P(660, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', '', 0, .88)) },
        { minDur: 6800, sub: '「一鼓作氣」：趁勁頭最足時一口氣做完——寫作業也是，一鼓作氣寫完再玩最痛快！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -50, '<rect x="-16" y="-20" width="32" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/><path d="M-9 -12 h18 M-9 -4 h18 M-9 4 h18" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95)) + bang(470, 190) + hearts(280, 192)) },
        { minDur: 6400, sub: '一鼓作氣：趁著勁頭一口氣把事情做完。',
          html: scene(P(400, 300, WARDRUM, '', 0, 1.5) + bang(510, 220) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">一鼓作氣</text>') }
      ];
    },
    /* 千辛萬苦 */
    i261: function () {
      var MTBIG2 = '<path d="M480 302 L640 130 L800 302 Z" fill="#8fb0a0"/>';
      return [
        { minDur: 6800, sub: '登山隊翻山越嶺：頂著烈日、冒著風雨、踩過碎石坡——一路吃盡苦頭！',
          html: scene(MTBIG2 +
            P(280, 302, A('kid', 'angry'), 'st-strut', 0, .95) + P(400, 302, A('kid', 'sad'), 'st-strut', .2, .9) +
            sweat(330, 195) + sweat(450, 200) +
            '<g stroke="#8fc6ff" stroke-width="3" stroke-linecap="round"><line class="st-rain" x1="180" y1="30" x2="174" y2="52"/></g>') },
        { minDur: 6800, sub: '歷經千辛萬苦，終於站上頂峰——雲海在腳下翻騰，一切辛苦都值得！',
          html: scene('<ellipse cx="300" cy="250" rx="240" ry="34" fill="#fff" opacity=".85"/><ellipse cx="560" cy="270" rx="220" ry="30" fill="#fff" opacity=".8"/>' +
            P(400, 240, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1) + hearts(500, 180) + bang(300, 190)) },
        { minDur: 6600, sub: '「千辛萬苦」：經歷許許多多的艱難困苦——通往成功的路，本來就不平坦！',
          html: scene(MTBIG2 + P(300, 302, A('kid', 'happy'), 'st-strut') + sweat(250, 192) + hearts(400, 195)) },
        { minDur: 6400, sub: '千辛萬苦：經歷極多的艱難困苦。',
          html: scene(MTBIG2 + P(300, 302, A('kid', 'angry'), 'st-strut', 0, 1.02) + sweat(250, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千辛萬苦</text>') }
      ];
    },
    /* 不屈不撓 */
    i262: function () {
      return [
        { minDur: 6800, sub: '發明大王愛迪生做燈泡，失敗了上千次——有人笑他，他說：「我只是找到了一千種不能用的材料！」',
          html: scene(P(360, 302, A('kid', 'happy') + P(0, -110, '<circle cx="0" cy="-14" r="16" fill="#ffe066" stroke="#e8b84a" stroke-width="2.6"/><rect x="-7" y="0" width="14" height="9" rx="3" fill="#b8ae9c"/>', '', 0, 1)) +
            P(580, 302, A('kid', 'wow'), '', 0, .93, true) + qmark(630, 190)) },
        { minDur: 6800, sub: '再失敗也不彎腰、不放棄，一次次重新站起來——終於，燈泡亮了，照亮全世界！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>' +
              P(0, -116, '<circle cx="0" cy="-14" r="16" fill="#ffe066" stroke="#e8b84a" stroke-width="2.6"/><g class="st-rays" style="transform-origin:0px -14px"><g stroke="#ffd97a" stroke-width="3" stroke-linecap="round"><line x1="0" y1="-38" x2="0" y2="-32"/><line x1="-22" y1="-14" x2="-16" y2="-14"/><line x1="22" y1="-14" x2="16" y2="-14"/></g></g>', '', 0, 1)) + bang(510, 190) + hearts(290, 192)) },
        { minDur: 6600, sub: '「不屈不撓」：意志堅定，遇到挫折也不屈服——跌倒幾次不重要，站起來就好！',
          html: scene(P(400, 302, A('kid', 'angry'), '', 0, 1.05) + bang(490, 188) + hearts(300, 192)) },
        { minDur: 6400, sub: '不屈不撓：意志堅定，遇挫折也不屈服。',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'angry') + '</g>', '', 0, 1.05) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">不屈不撓</text>') }
      ];
    },
    /* 喜出望外 */
    i451: function () {
      var TICKET = '<rect x="-22" y="-14" width="44" height="28" rx="4" fill="#ffe066" stroke="#e8b84a" stroke-width="2.4"/><circle cx="-22" cy="0" r="4" fill="#fff"/><circle cx="22" cy="0" r="4" fill="#fff"/><text x="0" y="5" text-anchor="middle" font-size="11" font-weight="bold" fill="#8a5a33">門票</text>';
      return [
        { minDur: 6800, sub: '本來以為生日只有蛋糕——爸爸卻突然拿出遊樂園門票：「明天全家出發！」',
          html: scene(P(300, 302, A('kid', 'wow')) + bang(390, 185) +
            P(520, 302, A('kid', 'happy') + P(-40, -60, TICKET, '', 0, .95), '', 0, 1.05, true)) },
        { minDur: 6600, sub: '期待之外的驚喜，讓人高興得跳起來——「喜出望外」就是這種心情！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.08) +
            hearts(460, 180) + hearts(280, 188) + notes(400, 155)) },
        { minDur: 6800, sub: '「望外」是期望之外——沒想到的好事突然發生，快樂加倍！',
          html: scene(P(400, 260, TICKET, '', 0, 1.5) + bang(510, 210) + hearts(300, 220)) },
        { minDur: 6400, sub: '喜出望外：遇到意想不到的好事而特別高興。',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.08) + hearts(490, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">喜出望外</text>') }
      ];
    },
    /* 忐忑不安 */
    i452: function () {
      var HEARTBEAT = '<path d="M0 5 C-7 -5 -19 2 -10 12 L0 20 L10 12 C19 2 7 -5 0 5 Z" fill="#ff7b9c"/>' +
        '<path d="M-30 8 h12 l4 -10 l6 18 l5 -12 l3 4 h12" stroke="#c96a5a" stroke-width="2.6" fill="none" stroke-linecap="round" transform="translate(0,34)"/>';
      return [
        { minDur: 6800, sub: '成績單今天發下來……小忑在座位上坐立難安：考得好嗎？考砸了怎麼辦？',
          html: scene(P(360, 302, A('kid', 'wow')) + sweat(300, 190) + qmark(430, 178) +
            P(500, 200, HEARTBEAT, 'st-zfloat', 0, 1.1)) },
        { minDur: 6800, sub: '「忐忑」兩個字很妙：心一上一下——心裡七上八下、怦怦亂跳，就是「忐忑不安」！',
          html: scene(P(400, 210, HEARTBEAT, 'st-zfloat', 0, 1.5) +
            '<text x="300" y="160" font-size="30" font-weight="bold" fill="#4a3200">忐</text><text x="470" y="250" font-size="30" font-weight="bold" fill="#4a3200">忑</text>' +
            P(240, 302, A('kid', 'wow'), '', 0, .95)) },
        { minDur: 6800, sub: '結果成績比預期好！深呼吸、把心放回原位——其實多數擔心的事都不會發生！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(460, 185)) },
        { minDur: 6400, sub: '忐忑不安：心神不定，惶恐不安。',
          html: scene(P(400, 215, HEARTBEAT, 'st-zfloat', 0, 1.5) + P(250, 302, A('kid', 'wow'), '', 0, .95) + sweat(310, 195) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">忐忑不安</text>') }
      ];
    },
    /* 無精打采 */
    i453: function () {
      return [
        { minDur: 6800, sub: '熬夜看球賽的隔天早上——小采眼皮沉重、走路拖拖拉拉，連書包都背不動……',
          html: scene(P(360, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, 1.02) +
            zzz(450, 195) + sweat(300, 195)) },
        { minDur: 6600, sub: '上課哈欠連連、眼神放空——一點精神和活力都沒有，就是「無精打采」！',
          html: scene(P(360, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>') + zzz(440, 190) +
            P(580, 302, A('kid', 'happy'), '', 0, .95, true) + qmark(630, 188)) },
        { minDur: 6800, sub: '早睡早起、吃頓好早餐——隔天整個人神清氣爽，活力滿滿！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(460, 185) + bang(280, 192)) },
        { minDur: 6400, sub: '無精打采：提不起精神，沒有活力。',
          html: scene(P(400, 302, '<g class="st-slump">' + A('kid', 'sad') + '</g>', '', 0, 1.05) + zzz(480, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">無精打采</text>') }
      ];
    },
    /* 興致勃勃 */
    i454: function () {
      var BUGBOX = '<rect x="-18" y="-24" width="36" height="24" rx="4" fill="none" stroke="#8b93a3" stroke-width="2.6"/><line x1="-18" y1="-12" x2="18" y2="-12" stroke="#8b93a3" stroke-width="1.4"/><line x1="-6" y1="-24" x2="-6" y2="0" stroke="#8b93a3" stroke-width="1.4"/><line x1="6" y1="-24" x2="6" y2="0" stroke="#8b93a3" stroke-width="1.4"/>';
      return [
        { minDur: 6800, sub: '自然老師宣布：「這週末去溪邊觀察昆蟲！」全班眼睛發亮，興趣一下子被點燃！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(460, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .95) +
            hearts(380, 172) + bang(550, 195)) },
        { minDur: 6800, sub: '當天大家帶著觀察箱、放大鏡，興致勃勃地出發——一路上問題問個不停！',
          html: scene(P(300, 302, A('kid', 'happy') + P(-44, -46, BUGBOX, '', 0, .95), 'st-strut') +
            P(460, 302, A('kid', 'happy'), 'st-strut', .2, .95) + qmark(390, 180) + P(620, 210, A('butterfly'), '', 0, .95)) },
        { minDur: 6600, sub: '「勃勃」是旺盛的樣子——興趣濃厚、情緒高昂，就是「興致勃勃」！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 185) + notes(310, 180)) },
        { minDur: 6400, sub: '興致勃勃：興趣濃厚，情緒高昂。',
          html: scene(P(360, 302, A('kid', 'happy'), 'st-strut', 0, 1.05) + P(560, 210, A('butterfly'), '', 0, .95) + hearts(460, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">興致勃勃</text>') }
      ];
    },
    /* 依依難捨 */
    i455: function () {
      return [
        { minDur: 6800, sub: '夏令營最後一天，來自各地的營友要各自回家了——大家抱在一起，遲遲不肯說再見。',
          html: scene(P(300, 302, A('kid', 'sad')) + P(430, 302, A('kid', 'sad'), '', .1, .97) +
            P(560, 302, A('kid', 'sad'), '', .2, .95) + hearts(430, 180) + sweat(360, 198)) },
        { minDur: 6800, sub: '巴士開動了，車窗內外互相揮手，直到看不見彼此——「依依難捨」，滿滿的不捨！',
          html: scene(P(560, 296, '<rect x="-60" y="-46" width="120" height="46" rx="8" fill="#ffd97a" stroke="#e8b84a" stroke-width="3"/><circle cx="-34" cy="0" r="11" fill="#3a2e26"/><circle cx="34" cy="0" r="11" fill="#3a2e26"/><rect x="-48" y="-36" width="28" height="18" rx="3" fill="#aee3f5"/><rect x="-12" y="-36" width="28" height="18" rx="3" fill="#aee3f5"/>', 'st-inR') +
            P(240, 302, A('kid', 'sad') + '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>') + hearts(400, 195)) },
        { minDur: 6600, sub: '約好明年再一起參加——把不捨化成期待，友誼不會因距離變淡！',
          html: scene(P(320, 302, A('kid', 'happy')) + P(490, 302, A('kid', 'happy'), '', 0, .97, true) +
            P(405, 210, '<path d="M-20 -6 q10 -14 20 0 q10 14 20 0" stroke="#ffe3c1" stroke-width="9" fill="none" stroke-linecap="round"/>', '', 0, 1.1) + hearts(405, 165)) },
        { minDur: 6400, sub: '依依難捨：非常留戀，捨不得離開。',
          html: scene(P(300, 302, A('kid', 'sad')) + P(520, 302, A('kid', 'sad'), '', 0, .97, true) + hearts(410, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">依依難捨</text>') }
      ];
    },
    /* 情不自禁 */
    i456: function () {
      return [
        { minDur: 6800, sub: '畢業典禮上，看著大螢幕播放六年來的照片——小情忍不住，眼淚自己流了下來……',
          html: scene(P(430, 240, '<rect x="-60" y="-40" width="120" height="70" rx="5" fill="#c9d6e8" stroke="#8b93a3" stroke-width="3"/><circle cx="-20" cy="-10" r="10" fill="#ffe3c1"/><circle cx="20" cy="-10" r="10" fill="#ffe3c1"/>') +
            P(240, 302, A('kid', 'sad')) + sweat(200, 195)) },
        { minDur: 6800, sub: '聽到最愛的歌，腳跟著打拍子；看到好笑的影片，哈哈大笑——感情湧上來，想忍也忍不住！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + notes(450, 170) + hearts(280, 188)) },
        { minDur: 6600, sub: '「情不自禁」：感情激動，控制不住自己——真情流露，一點也不丟臉！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + hearts(490, 185) + notes(310, 182)) },
        { minDur: 6400, sub: '情不自禁：感情激動，控制不住自己。',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(300, 190) + hearts(500, 185) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">情不自禁</text>') }
      ];
    },
    /* 不由自主 */
    i457: function () {
      return [
        { minDur: 6800, sub: '雲霄飛車俯衝而下——小主明明想忍住，卻不由自主放聲尖叫！',
          html: scene(P(400, 240, '<path d="M-140 40 q60 -80 140 -30 q70 44 140 -20" stroke="#8b93a3" stroke-width="7" fill="none"/>' +
              P(-20, -30, '<rect x="-24" y="-16" width="48" height="20" rx="6" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.6"/>' + P(0, -16, A('kid', 'wow'), '', 0, .6), '', 0, 1)) +
            bang(560, 160) + sweat(280, 190)) },
        { minDur: 6800, sub: '天氣太冷，牙齒不由自主打顫；聽到好笑的事，嘴角不由自主上揚——身體自己反應了！',
          html: scene(P(320, 302, A('kid', 'wow')) + sweat(270, 192) +
            P(520, 302, A('kid', 'happy'), '', 0, .97) + hearts(590, 190)) },
        { minDur: 6600, sub: '「不由自主」：由不得自己作主、控制不了——和「情不自禁」很像，但更強調身體的反應！',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) + qmark(480, 182) + bang(310, 190)) },
        { minDur: 6400, sub: '不由自主：由不得自己作主，控制不了。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.08) + sweat(330, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">不由自主</text>') }
      ];
    },
    /* 破涕為笑 */
    i458: function () {
      return [
        { minDur: 6800, sub: '心愛的冰淇淋掉在地上，妹妹哇哇大哭，眼淚像斷線的珍珠……',
          html: scene(P(360, 302, A('kid', 'sad'), '', 0, 1.02) + sweat(300, 190) +
            P(470, 318, '<path d="M-8 0 a8 5 0 0 0 16 0 z" fill="#f7a8c4"/><path d="M-4 -2 L0 -14 L4 -2" stroke="#c9a06c" stroke-width="2.4" fill="none"/>') ) },
        { minDur: 6800, sub: '哥哥變出一個鬼臉，再遞上自己的冰淇淋——妹妹「噗哧」一聲，眼淚還掛著就笑了！',
          html: scene(P(300, 302, A('kid', 'happy') + P(38, -50, '<path d="M-4 -2 L0 -14 L4 -2 z" fill="#c9a06c"/><circle cx="0" cy="-18" r="7" fill="#f7a8c4"/>', '', 0, 1.1)) +
            P(490, 302, A('kid', 'happy'), '', 0, .95) + hearts(400, 185) + notes(560, 190)) },
        { minDur: 6600, sub: '「破涕為笑」：停止哭泣、轉為笑容——從哭到笑，只需要一點點溫暖！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 185)) },
        { minDur: 6400, sub: '破涕為笑：停止哭泣，轉為笑容。',
          html: scene(P(300, 302, A('kid', 'sad'), '', 0, .95) +
            '<path d="M370 240 L430 240" stroke="#548a40" stroke-width="4" stroke-linecap="round"/><path d="M430 240 l-10 -6 v12 z" fill="#548a40"/>' +
            P(500, 302, A('kid', 'happy'), '', 0, 1.02) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">破涕為笑</text>') }
      ];
    },
    /* 淚流滿面 */
    i459: function () {
      var TEARS = '<circle class="st-tear" cx="-14" cy="-46" r="3.2" fill="#8fc6ff"/><circle class="st-tear" style="animation-delay:.4s" cx="14" cy="-46" r="3.2" fill="#8fc6ff"/><path d="M-14 -44 q-2 8 0 14 M14 -44 q2 8 0 14" stroke="#8fc6ff" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '離家三年的哥哥從國外回來——一開門，媽媽抱著他，眼淚一下子流了滿臉！',
          html: scene(P(320, 302, A('kid', 'sad') + TEARS, '', 0, 1.05) +
            P(470, 302, A('kid', 'happy'), '', 0, 1.02, true) + hearts(400, 180)) },
        { minDur: 6800, sub: '有傷心的淚，也有感動、喜悅的淚——「淚流滿面」的原因，可以很不一樣！',
          html: scene(P(300, 302, A('kid', 'sad') + TEARS) +
            P(520, 302, A('kid', 'happy') + TEARS, '', 0, .97) + hearts(590, 190) + sweat(250, 195)) },
        { minDur: 6600, sub: '眼淚流了滿臉——非常傷心，或非常感動的樣子！',
          html: scene(P(400, 302, A('kid', 'sad') + TEARS, '', 0, 1.08)) },
        { minDur: 6400, sub: '淚流滿面：眼淚流滿臉，非常傷心或感動。',
          html: scene(P(400, 302, A('kid', 'sad') + TEARS, '', 0, 1.1) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">淚流滿面</text>') }
      ];
    },
    /* 百感交集 */
    i460: function () {
      return [
        { minDur: 7000, sub: '畢業典禮這天：想到要和同學分開很難過、想到升上國中又期待、還捨不得老師……各種心情湧上來！',
          html: scene(P(400, 302, A('kid', 'sad')) +
            P(280, 190, '<circle cx="0" cy="0" r="22" fill="#fff" opacity=".9"/><path d="M0 3 C-5 -4 -13 1 -7 8 L0 13 L7 8 C13 1 5 -4 0 3 Z" fill="#ff7b9c" transform="translate(0,-6)"/>') +
            P(400, 160, '<circle cx="0" cy="0" r="22" fill="#fff" opacity=".9"/><path d="M-7 2 q7 -10 14 0" stroke="#8fc6ff" stroke-width="3" fill="none" stroke-linecap="round"/>', '', .2) +
            P(520, 190, '<circle cx="0" cy="0" r="22" fill="#fff" opacity=".9"/><text x="0" y="7" text-anchor="middle" font-size="20" fill="#e0a458">!</text>', '', .4)) },
        { minDur: 6800, sub: '難過、期待、感謝、不捨——一百種感覺交織在心頭，說不清是哭還是笑！',
          html: scene(P(400, 302, A('kid', 'happy') + '<circle class="st-tear" cx="-14" cy="-46" r="3" fill="#8fc6ff"/>', '', 0, 1.05) +
            hearts(490, 185) + sweat(320, 192)) },
        { minDur: 6600, sub: '「百感交集」：各種感觸交織在心頭——人生的重要時刻，常常就是這種滋味！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.02) + hearts(300, 190) + qmark(480, 182) + notes(400, 160)) },
        { minDur: 6400, sub: '百感交集：各種感觸交織在心頭。',
          html: scene(P(400, 302, A('kid', 'sad'), '', 0, 1.05) + hearts(310, 190) + sweat(480, 192) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">百感交集</text>') }
      ];
    },
    /* 歷歷在目 */
    i461: function () {
      function photo(x, y, rot, inner) {
        return P(x, y, '<g transform="rotate(' + rot + ')"><rect x="-24" y="-20" width="48" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>' + inner + '</g>');
      }
      return [
        { minDur: 6800, sub: '翻開去年環島旅行的相簿——花蓮的海、阿里山的日出、夜市的章魚燒……',
          html: scene(photo(280, 250, -6, '<rect x="-18" y="-14" width="36" height="22" fill="#7fb2e0"/><circle cx="10" cy="-8" r="5" fill="#ffdd66"/>') +
            photo(420, 240, 5, '<path d="M-16 8 L0 -12 L16 8 Z" fill="#a5c2b2"/>') +
            photo(550, 255, -3, '<circle cx="0" cy="-3" r="9" fill="#e0a458"/>') +
            P(160, 302, A('kid', 'happy'), '', 0, .95) + hearts(230, 210)) },
        { minDur: 6800, sub: '每個畫面都清清楚楚浮現眼前，好像昨天才發生——這就是「歷歷在目」！',
          html: scene(P(430, 200, '<circle cx="0" cy="0" r="66" fill="#fff" opacity=".9"/><path d="M-30 20 L0 -20 L30 20 Z" fill="#a5c2b2"/><circle cx="26" cy="-24" r="10" fill="#ffdd66"/>') +
            P(240, 302, A('kid', 'happy')) + hearts(330, 210)) },
        { minDur: 6600, sub: '把美好的時刻用心記住——多年後回想，依然歷歷在目！',
          html: scene(photo(350, 250, -4, '<rect x="-18" y="-14" width="36" height="22" fill="#a5d47c"/>') +
            P(520, 302, A('kid', 'happy'), '', 0, .97) + hearts(440, 200)) },
        { minDur: 6400, sub: '歷歷在目：過去的情景清楚浮現眼前。',
          html: scene(photo(300, 250, -5, '<rect x="-18" y="-14" width="36" height="22" fill="#7fb2e0"/>') + photo(480, 245, 4, '<path d="M-16 8 L0 -12 L16 8 Z" fill="#a5c2b2"/>') +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">歷歷在目</text>') }
      ];
    },
    /* 記憶猶新 */
    i462: function () {
      return [
        { minDur: 7000, sub: '爺爺說起五十年前第一天上學的情景：老師的名字、教室的窗、同桌的笑話——記得一清二楚！',
          html: scene(P(360, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05) +
            P(560, 302, A('kid', 'wow'), '', 0, .9) + qmark(610, 190) +
            P(240, 200, '<circle cx="0" cy="0" r="40" fill="#fff" opacity=".9"/><path d="M-20 12 L0 -14 L20 12 Z" fill="#8a5a33"/><rect x="-14" y="12" width="28" height="10" fill="#f4ecd8"/>')) },
        { minDur: 6800, sub: '過了這麼多年，記憶卻像新的一樣鮮明——「記憶猶新」！',
          html: scene(P(400, 220, '<circle cx="0" cy="0" r="52" fill="#fff" opacity=".92"/><g class="st-tw"><path d="M0 -20 L3 -8 L15 -6 L5 2 L8 14 L0 7 L-8 14 L-5 2 L-15 -6 L-3 -8 Z" fill="#ffd97a"/></g>') +
            P(240, 302, A('kid', 'happy'), '', 0, .95) + hearts(320, 210)) },
        { minDur: 6800, sub: '印象深刻的事、重要的教訓，都會記憶猶新——好的回憶是一輩子的寶藏！',
          html: scene(P(320, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, 1.02, true) + hearts(410, 182)) },
        { minDur: 6400, sub: '記憶猶新：對過去的事記得清清楚楚。',
          html: scene(P(400, 225, '<circle cx="0" cy="0" r="50" fill="#fff" opacity=".92"/><g class="st-tw"><path d="M0 -18 L3 -7 L14 -5 L5 2 L7 13 L0 6 L-7 13 L-5 2 L-14 -5 L-3 -7 Z" fill="#ffd97a"/></g>') +
            '<text x="400" y="320" text-anchor="middle" font-size="50" font-weight="bold" fill="#4a3200">記憶猶新</text>') }
      ];
    },
    /* 煥然一新 */
    i463: function () {
      function room2(x, fresh) {
        return P(x, 300, '<rect x="-70" y="-90" width="140" height="90" rx="6" fill="' + (fresh ? '#fdfbf4' : '#e0d8c4') + '" stroke="#c9bfa8" stroke-width="3"/>' +
          (fresh
            ? '<rect x="-52" y="-72" width="44" height="30" rx="4" fill="#aee3f5" stroke="#8fd0e8" stroke-width="2.4"/><rect x="12" y="-72" width="40" height="42" rx="4" fill="#a5d47c" stroke="#7cab6e" stroke-width="2.4"/><g class="st-tw"><path d="M-10 -20 L-8 -14 L-2 -12 L-8 -10 L-10 -4 L-12 -10 L-18 -12 L-12 -14 Z" fill="#ffd97a"/></g>'
            : '<path d="M-52 -70 q14 10 30 4 M6 -66 q16 8 34 2" stroke="#b8ae9c" stroke-width="4" fill="none"/><circle cx="-20" cy="-30" r="8" fill="#b8ae9c" opacity=".6"/>'));
      }
      return [
        { minDur: 6800, sub: '社區活動中心又舊又暗：牆壁斑駁、窗戶灰濛濛——大家決定一起動手改造！',
          html: scene(room2(430, false) + P(220, 302, A('kid', 'happy') + P(20, -34, '<path d="M-14 0 q7 -8 14 0 q7 8 14 0" stroke="#ffd97a" stroke-width="7" fill="none" stroke-linecap="round"/>', '', 0, .9)) + sweat(300, 200)) },
        { minDur: 6800, sub: '刷上新油漆、換上亮窗簾、擺上綠盆栽——整個空間亮了起來，完全變了一個樣！',
          html: scene(room2(430, true) + bang(560, 200) +
            P(220, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(310, 195)) },
        { minDur: 6600, sub: '「煥然一新」：面貌完全改變、呈現嶄新氣象——動手改變，處處都能發光！',
          html: scene(room2(400, true) + hearts(540, 220) + P(200, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6400, sub: '煥然一新：面貌完全改變，嶄新氣象。',
          html: scene(room2(400, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">煥然一新</text>') }
      ];
    },
    /* 五彩繽紛 */
    i464: function () {
      function confetti2(x, y, color, dly) {
        return P(x, y, '<rect class="st-snow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + ' x="-4" y="-6" width="8" height="12" rx="2" fill="' + color + '" transform="rotate(20)"/>');
      }
      function balloon2(x, y, color, dly) {
        return P(x, y, '<ellipse cx="0" cy="-14" rx="11" ry="14" fill="' + color + '"/><line x1="0" y1="0" x2="0" y2="16" stroke="#8b93a3" stroke-width="1.6"/>', 'st-zfloat', dly);
      }
      return [
        { minDur: 6800, sub: '園遊會開幕！彩帶從天而降：紅的、藍的、金的、綠的，在陽光下閃閃發亮——',
          html: scene(confetti2(220, 120, '#ff8a80', 0) + confetti2(340, 90, '#a5c8ff', .3) + confetti2(460, 130, '#ffd97a', .6) +
            confetti2(560, 100, '#a5d47c', .2) + confetti2(650, 140, '#c9a8e0', .5) +
            P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(460, 200)) },
        { minDur: 6600, sub: '氣球五顏六色、攤位旗海飄揚——整個操場繽紛得像打翻了調色盤！',
          html: scene(balloon2(250, 200, '#ff9eb5', 0) + balloon2(420, 170, '#a5c8ff', .3) + balloon2(580, 210, '#ffd97a', .6) +
            P(340, 302, A('kid', 'happy'), '', 0, .97) + hearts(450, 240)) },
        { minDur: 6600, sub: '「五彩繽紛」：色彩繁多而絢麗——熱鬧歡樂的場面最適合它！',
          html: scene(confetti2(260, 130, '#ff8a80', 0) + confetti2(400, 100, '#ffd97a', .3) + confetti2(540, 135, '#a5c8ff', .5) +
            balloon2(320, 210, '#a5d47c', .2) + balloon2(490, 200, '#c9a8e0', .4) + hearts(400, 260)) },
        { minDur: 6400, sub: '五彩繽紛：色彩繁多而絢麗。',
          html: scene(confetti2(240, 130, '#ff8a80', 0) + confetti2(380, 100, '#a5c8ff', .2) + confetti2(520, 130, '#ffd97a', .4) + confetti2(640, 105, '#a5d47c', .6) +
            '<text x="400" y="270" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">五彩繽紛</text>') }
      ];
    },
    /* 爭奇鬥豔 */
    i465: function () {
      function fancyflower(x, y, color, petals, dly) {
        var s = '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '><line x1="0" y1="0" x2="0" y2="-18" stroke="#5f8a46" stroke-width="3.4"/>';
        for (var i = 0; i < petals; i++) {
          var a = (i * 360 / petals) * Math.PI / 180;
          s += '<circle cx="' + (Math.sin(a) * 8).toFixed(1) + '" cy="' + (-22 + Math.cos(a) * 8).toFixed(1) + '" r="6" fill="' + color + '"/>';
        }
        return P(x, y, s + '<circle cx="0" cy="-22" r="4.4" fill="#ffe066"/></g>');
      }
      return [
        { minDur: 6800, sub: '花展會場上，玫瑰開得豔、牡丹開得大、蘭花姿態最優雅——每一種花都使出渾身解數！',
          html: scene(fancyflower(240, 318, '#e85a4f', 6, 0) + fancyflower(400, 320, '#ff9eb5', 8, .3) + fancyflower(560, 318, '#c9a8e0', 5, .5) +
            P(140, 302, A('kid', 'wow'), '', 0, .9) + hearts(320, 230)) },
        { minDur: 6600, sub: '你比奇特、我比豔麗，互不相讓——就像選美大賽一樣熱鬧！',
          html: scene(fancyflower(300, 318, '#ffd97a', 7, 0) + fancyflower(470, 320, '#e85a4f', 6, .3) +
            bang(390, 220) + P(620, 210, A('butterfly'), '', 0, .95)) },
        { minDur: 6600, sub: '「爭奇鬥豔」：競相展現奇特豔麗——百花如此，各展所長的人也是！',
          html: scene(fancyflower(260, 318, '#ff9eb5', 6, 0) + fancyflower(410, 320, '#c9a8e0', 8, .2) + fancyflower(560, 318, '#ffd97a', 5, .4) +
            hearts(410, 250)) },
        { minDur: 6400, sub: '爭奇鬥豔：競相展現奇特豔麗。',
          html: scene(fancyflower(280, 318, '#e85a4f', 6, 0) + fancyflower(430, 320, '#ff9eb5', 8, .2) + fancyflower(570, 318, '#c9a8e0', 5, .4) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">爭奇鬥豔</text>') }
      ];
    },
    /* 生機盎然 */
    i466: function () {
      function sprout3(x, y, h, dly) {
        return P(x, y, '<g class="st-grow"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '><line x1="0" y1="0" x2="0" y2="' + (-h) + '" stroke="#5f8a46" stroke-width="4"/><path d="M0 ' + (-h) + ' q-8 -8 -4 -14 M0 ' + (-h) + ' q8 -8 4 -14" stroke="#7cc47f" stroke-width="4" fill="none" stroke-linecap="round"/></g>');
      }
      return [
        { minDur: 6800, sub: '雨後的稻田邊：秧苗抽高、青蛙鳴叫、白鷺鷥飛過、蜻蜓點水——處處是生命力！',
          html: scene(sprout3(240, 320, 26, 0) + sprout3(330, 318, 32, .3) +
            P(450, 300, A('frog'), '', 0, .95) + P(580, 160, A('bird')) + notes(520, 200) +
            P(660, 210, A('butterfly'), '', .3, .9)) },
        { minDur: 6600, sub: '校園的生態池也生機盎然：小魚穿梭、蝌蚪擺尾、睡蓮開花！',
          html: scene('<ellipse cx="400" cy="300" rx="260" ry="40" fill="#7fb2e0"/>' +
            P(320, 296, A('fish'), '', 0, .9) + P(500, 292, A('fish'), '', .3, .8, true) +
            P(420, 270, '<circle cx="0" cy="0" r="8" fill="#ff9eb5"/><ellipse cx="-14" cy="6" rx="12" ry="5" fill="#5f8a46"/><ellipse cx="14" cy="6" rx="12" ry="5" fill="#5f8a46"/>') + hearts(400, 210)) },
        { minDur: 6600, sub: '「盎然」是洋溢的樣子——充滿生命力與活力，就是「生機盎然」！',
          html: scene(sprout3(300, 320, 30, 0) + sprout3(420, 318, 36, .3) + sprout3(540, 322, 28, .5) +
            P(650, 210, A('butterfly'), '', 0, .92) + hearts(430, 250)) },
        { minDur: 6400, sub: '生機盎然：充滿生命力與活力。',
          html: scene(sprout3(280, 320, 30, 0) + sprout3(400, 318, 38, .2) + sprout3(520, 322, 30, .4) + P(630, 300, A('frog'), '', 0, .9) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">生機盎然</text>') }
      ];
    },
    /* 枝繁葉茂 */
    i467: function () {
      var LUSHTREE = '<rect x="-12" y="-64" width="24" height="64" rx="8" fill="#a8734a"/>' +
        '<circle cx="0" cy="-96" r="42" fill="#7cc47f"/><circle cx="-36" cy="-74" r="28" fill="#8fd08f"/><circle cx="36" cy="-76" r="29" fill="#8fd08f"/><circle cx="0" cy="-64" r="24" fill="#6fae58"/>' +
        '<path d="M-8 -64 q-14 -8 -26 -4 M8 -66 q14 -10 26 -6" stroke="#8a5a33" stroke-width="4" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '校門口的老榕樹一百歲了：枝幹粗壯、分枝一層又一層，葉子密得連陽光都穿不透！',
          html: scene(P(400, 302, LUSHTREE, '', 0, 1.2) +
            P(200, 302, A('kid', 'wow'), '', 0, .92) + hearts(280, 210)) },
        { minDur: 6600, sub: '夏天全班擠在樹下乘涼，小鳥在枝頭築巢——大樹是大家的好朋友！',
          html: scene(P(400, 302, LUSHTREE, '', 0, 1.15) +
            P(280, 302, A('kid', 'happy'), '', 0, .9) + P(520, 302, A('kid', 'happy'), '', .2, .88) +
            P(430, 180, A('bird'), '', 0, .8) + notes(500, 150)) },
        { minDur: 6600, sub: '「枝繁葉茂」：枝葉繁多茂盛——也祝福家族興旺、事業蓬勃！',
          html: scene(P(400, 302, LUSHTREE, '', 0, 1.2) + hearts(540, 220)) },
        { minDur: 6400, sub: '枝繁葉茂：枝葉繁多茂盛。',
          html: scene(P(400, 302, LUSHTREE, '', 0, 1.25) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">枝繁葉茂</text>') }
      ];
    },
    /* 碩果僅存 */
    i468: function () {
      var BARETREE = '<rect x="-9" y="-56" width="18" height="56" rx="7" fill="#a8734a"/>' +
        '<path d="M-4 -56 q-16 -10 -22 -26 M4 -56 q16 -10 22 -26 M0 -58 q-2 -18 0 -30" stroke="#8a5a33" stroke-width="4.6" fill="none" stroke-linecap="round"/>';
      var APPLE2 = '<circle cx="0" cy="0" r="11" fill="#e85a4f" stroke="#c94a3f" stroke-width="2"/><path d="M0 -10 q2 -6 6 -7" stroke="#548a40" stroke-width="2.4" fill="none"/>';
      return [
        { minDur: 6800, sub: '颱風過後的果園一片狼藉——滿樹的蘋果掉光了，只剩最高的枝頭上，孤零零掛著一顆！',
          html: scene(P(400, 302, BARETREE, '', 0, 1.2) + P(390, 190, APPLE2, '', 0, 1.1) +
            P(200, 302, A('kid', 'sad'), '', 0, .95) + sweat(260, 200)) },
        { minDur: 6800, sub: '果農小心翼翼把它摘下：「這是今年僅存的珍寶呀！」',
          html: scene(P(360, 302, A('kid', 'happy') + P(38, -64, APPLE2, '', 0, 1)) + hearts(470, 190)) },
        { minDur: 6600, sub: '「碩果僅存」：大果子只剩這一顆——比喻留存下來的珍貴人或物！',
          html: scene(P(400, 250, APPLE2, '', 0, 2) + hearts(500, 210) + P(240, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6400, sub: '碩果僅存：留存下來的珍貴人或物。',
          html: scene(P(400, 302, BARETREE, '', 0, 1.15) + P(390, 195, APPLE2, '', 0, 1.2) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">碩果僅存</text>') }
      ];
    },
    /* 從容不迫 */
    i469: function () {
      return [
        { minDur: 6800, sub: '演講比賽突然停電、麥克風沒聲音——台上的小容不慌不忙，清清嗓子直接開講！',
          html: scene(P(400, 288, '<rect x="-90" y="0" width="180" height="14" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>') +
            P(400, 288, A('kid', 'happy'), '', 0, 1.02) + bang(280, 190) +
            P(600, 302, A('kid', 'wow'), '', 0, .88) + sweat(650, 200), 'night') },
        { minDur: 6800, sub: '聲音穩、步調穩，反而讓全場聽得更專注——評審豎起大拇指！',
          html: scene(P(400, 288, A('kid', 'happy'), '', 0, 1.05) + hearts(490, 190) +
            P(200, 302, A('kid', 'happy'), '', 0, .9) + notes(300, 185)) },
        { minDur: 6600, sub: '「從容不迫」：鎮定沉著、不慌不忙——大將之風就是這樣！',
          html: scene(P(400, 302, A('kid', 'happy'), 'st-strut', 0, 1.05) + hearts(500, 190)) },
        { minDur: 6400, sub: '從容不迫：鎮定沉著，不慌不忙。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.08) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">從容不迫</text>') }
      ];
    },
    /* 手足無措 */
    i470: function () {
      return [
        { minDur: 6800, sub: '第一次上台抽背課文，小措腦中一片空白——手不知道放哪、腳不知道站哪！',
          html: scene(P(400, 288, '<rect x="-90" y="0" width="180" height="14" rx="4" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>') +
            P(400, 288, A('kid', 'wow'), '', 0, 1.02) + sweat(330, 185) + sweat(470, 188) + qmark(400, 155)) },
        { minDur: 6800, sub: '慌張得不知如何是好——「手足無措」！深呼吸三秒，先想起第一句就好。',
          html: scene(P(400, 288, A('kid', 'wow'), '', 0, 1.05) + sweat(340, 185) +
            P(200, 302, A('kid', 'happy'), '', 0, .9) + hearts(280, 195)) },
        { minDur: 6800, sub: '定下心來，一句接一句流暢背完——原來慌張才是最大的敵人！',
          html: scene(P(400, 288, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) + hearts(490, 188) + notes(310, 182)) },
        { minDur: 6400, sub: '手足無措：慌張得不知如何是好。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.08) + sweat(330, 188) + sweat(470, 190) + qmark(400, 158) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">手足無措</text>') }
      ];
    },
    /* 若無其事 */
    i471: function () {
      return [
        { minDur: 6800, sub: '躲貓貓時，小若就藏在窗簾後——鬼走過來了，他屏住呼吸、臉上裝作什麼都沒發生……',
          html: scene(P(300, 302, '<rect x="-30" y="-110" width="60" height="110" rx="6" fill="#c9a8e0" opacity=".85"/>' +
              P(0, 0, A('kid', 'happy'), '', 0, .9)) +
            P(540, 302, A('kid', 'wow'), 'st-strut', 0, .95) + qmark(600, 188)) },
        { minDur: 6800, sub: '打翻了水卻假裝沒事繼續看書？——「若無其事」有時是鎮定，有時卻是裝傻喔！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -50, '<rect x="-16" y="-20" width="32" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/>', '', 0, .95)) +
            P(480, 318, '<ellipse cx="0" cy="0" rx="30" ry="8" fill="#a8d4ee" opacity=".8"/>') + qmark(560, 200)) },
        { minDur: 6600, sub: '「若無其事」：好像沒發生事情一樣、不動聲色——用在鎮定是本事，用在闖禍要反省！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + notes(490, 185)) },
        { minDur: 6400, sub: '若無其事：好像沒發生事情，不動聲色。',
          html: scene(P(400, 302, A('kid', 'happy'), 'st-strut', 0, 1.05) + notes(490, 188) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">若無其事</text>') }
      ];
    },
    /* 屏氣凝神 */
    i472: function () {
      var DOMINO = '<g stroke-width="2"><rect x="-40" y="-20" width="8" height="24" rx="2" fill="#e85a4f" stroke="#c94a3f" transform="rotate(-6 -36 -8)"/><rect x="-22" y="-20" width="8" height="24" rx="2" fill="#5c82ba" stroke="#46689a" transform="rotate(-3 -18 -8)"/><rect x="-4" y="-20" width="8" height="24" rx="2" fill="#6fae58" stroke="#548a40"/><rect x="14" y="-20" width="8" height="24" rx="2" fill="#e0a458" stroke="#c08838" transform="rotate(3 18 -8)"/><rect x="32" y="-20" width="8" height="24" rx="2" fill="#c9a8e0" stroke="#a884c4" transform="rotate(6 36 -8)"/></g>';
      return [
        { minDur: 6800, sub: '骨牌排到最後一張了！小凝屏住呼吸、集中精神，手指穩穩放下——',
          html: scene(P(430, 300, DOMINO, '', 0, 1.3) +
            P(260, 302, A('kid', 'happy')) + sweat(210, 195)) },
        { minDur: 6800, sub: '大氣都不敢出——「屏氣」是憋住呼吸、「凝神」是集中精神，關鍵時刻就要這樣！',
          html: scene(P(430, 300, DOMINO, '', 0, 1.25) +
            '<circle cx="400" cy="250" r="100" fill="none" stroke="#ffd97a" stroke-width="3" stroke-dasharray="10 10" opacity=".7"/>' +
            P(250, 302, A('kid', 'happy'), '', 0, .95)) },
        { minDur: 6800, sub: '成功了！三千張骨牌嘩啦啦漂亮倒下，全場歡呼！',
          html: scene(P(430, 300, DOMINO, '', 0, 1.2) + bang(560, 210) +
            P(250, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') + hearts(340, 195)) },
        { minDur: 6400, sub: '屏氣凝神：屏住呼吸，集中精神。',
          html: scene(P(400, 300, DOMINO, '', 0, 1.35) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">屏氣凝神</text>') }
      ];
    },
    /* 聚沙成塔 */
    i473: function () {
      var SANDTOWER = '<path d="M-40 0 L-24 -30 L-14 -30 L-8 -58 L8 -58 L14 -30 L24 -30 L40 0 Z" fill="#e8d5a8" stroke="#c9b184" stroke-width="2.6"/><path d="M-8 -58 L0 -76 L8 -58" fill="#e8d5a8" stroke="#c9b184" stroke-width="2.6"/>';
      return [
        { minDur: 6800, sub: '海邊玩沙：一把沙、又一把沙，慢慢堆——竟然堆出一座又高又漂亮的沙塔！',
          html: scene('<ellipse cx="400" cy="330" rx="420" ry="46" fill="#e8d5a8"/>' +
            P(430, 302, SANDTOWER, '', 0, 1.3) +
            P(250, 302, A('kid', 'happy')) + hearts(340, 200)) },
        { minDur: 6800, sub: '一粒沙微不足道，聚在一起卻能成塔——小小的力量累積起來，就是大大的成就！',
          html: scene(P(400, 300, SANDTOWER, '', 0, 1.4) + bang(530, 210) + hearts(280, 210)) },
        { minDur: 6800, sub: '每天存一點錢、背一個單字、做一件好事——聚沙成塔，一年後回頭看，嚇你一跳！',
          html: scene(P(300, 302, A('kid', 'happy') + P(-44, -50, '<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2"/><path d="M-8 -10 h16 M-8 -2 h16" stroke="#8fa3bf" stroke-width="1.8"/>', '', 0, .95)) +
            P(520, 302, SANDTOWER, '', 0, .95) + hearts(420, 190)) },
        { minDur: 6400, sub: '聚沙成塔：累積微小的力量而成大功。',
          html: scene('<ellipse cx="400" cy="330" rx="420" ry="46" fill="#e8d5a8"/>' + P(400, 302, SANDTOWER, '', 0, 1.45) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">聚沙成塔</text>') }
      ];
    },
    /* 眉飛色舞 */
    i830: function () {
      var DANCEBROWS = '<path d="M-15 -64 q7 -7 13 -1 M2 -65 q7 -7 13 -1" stroke="#3a2e26" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '小舞講起校外教學看到的海豚表演——眉毛揚起來、眼睛發亮、手比來比去，整張臉都在發光！',
          html: scene(P(340, 302, A('kid', 'happy') + DANCEBROWS +
              '<g class="st-wave"><line x1="18" y1="-38" x2="30" y2="-58" stroke="#ffe3c1" stroke-width="9" stroke-linecap="round"/></g>', '', 0, 1.08) +
            P(560, 302, A('kid', 'happy'), '', 0, .93) + hearts(460, 185) + notes(260, 182)) },
        { minDur: 6600, sub: '講到精彩處手舞足蹈，聽的人也被感染得哈哈大笑——快樂會傳染！',
          html: scene(P(320, 302, '<g class="st-cheer">' + A('kid', 'happy') + DANCEBROWS + '</g>') +
            P(500, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .95) + hearts(410, 172)) },
        { minDur: 6600, sub: '「眉飛色舞」：眉毛飛揚、神采煥發——喜悅全寫在臉上！',
          html: scene(P(400, 302, A('kid', 'happy') + DANCEBROWS, '', 0, 1.1) + hearts(500, 188)) },
        { minDur: 6400, sub: '眉飛色舞：眉揚神飛，非常得意興奮。',
          html: scene(P(400, 302, A('kid', 'happy') + DANCEBROWS, '', 0, 1.12) + hearts(490, 186) + notes(300, 184) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">眉飛色舞</text>') }
      ];
    },
    /* 千叮萬囑 */
    i832: function () {
      function bub6(x, y, txt, dly) {
        return P(x, y, '<g class="st-zfloat"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + '>' +
          '<path d="M-26 -13 a22 16 0 1 1 44 5 q-2 6 -9 7 l-9 8 l1 -8 q-22 -2 -27 -12 z" fill="#fff" stroke="#c9bfa8" stroke-width="2"/>' +
          '<text x="-3" y="-3" text-anchor="middle" font-size="10" fill="#8a7a4a">' + txt + '</text></g>');
      }
      return [
        { minDur: 6800, sub: '第一次自己搭車去奶奶家——媽媽在車站說了又說：「要看好站牌！別跟陌生人走！到了打電話！」',
          html: scene(P(300, 302, A('kid', 'happy'), '', 0, 1.05) +
            bub6(240, 170, '看好站牌', 0) + bub6(370, 145, '打電話!', .3) + bub6(480, 175, '小心喔', .6) +
            P(540, 302, A('kid', 'happy') + P(-38, -30, '<rect x="-14" y="-16" width="28" height="20" rx="4" fill="#5c82ba" stroke="#46689a" stroke-width="2.4"/>', '', 0, .95), '', 0, .95)) },
        { minDur: 6800, sub: '一句話叮嚀一千遍一萬遍——因為放不下心呀！這就是「千叮萬囑」。',
          html: scene(P(360, 302, A('kid', 'happy'), '', 0, 1.05) + bub6(300, 165, '記得喔', 0) + bub6(450, 175, '要小心', .4) + hearts(400, 230)) },
        { minDur: 6800, sub: '小朋友平安抵達、立刻回電報平安——不辜負每一句叮嚀，就是最好的回報！',
          html: scene(P(360, 302, A('kid', 'happy') + P(38, -56, '<rect x="-10" y="-16" width="20" height="30" rx="4" fill="#3a2e26"/><rect x="-7" y="-12" width="14" height="20" rx="2" fill="#7fb2e0"/>', '', 0, .95)) + hearts(470, 190)) },
        { minDur: 6400, sub: '千叮萬囑：一再叮嚀交代，非常不放心。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + bub6(320, 168, '……', 0) + bub6(470, 172, '……', .3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">千叮萬囑</text>') }
      ];
    },
    /* 精打細算 */
    i833: function () {
      var ABACUS = '<rect x="-30" y="-22" width="60" height="44" rx="5" fill="#c9a06c" stroke="#a8734a" stroke-width="2.6"/>' +
        '<g stroke="#a8734a" stroke-width="1.8"><line x1="-30" y1="-8" x2="30" y2="-8"/><line x1="-20" y1="-22" x2="-20" y2="22"/><line x1="-7" y1="-22" x2="-7" y2="22"/><line x1="7" y1="-22" x2="7" y2="22"/><line x1="20" y1="-22" x2="20" y2="22"/></g>' +
        '<g fill="#8a5a33"><circle cx="-20" cy="-14" r="3.4"/><circle cx="-7" cy="-14" r="3.4"/><circle cx="7" cy="-14" r="3.4"/><circle cx="-20" cy="2" r="3.4"/><circle cx="-20" cy="10" r="3.4"/><circle cx="-7" cy="6" r="3.4"/><circle cx="20" cy="4" r="3.4"/></g>';
      return [
        { minDur: 6800, sub: '班級旅行預算有限——總務股長撥著算盤精算：車錢、門票、保險，每一塊錢都花在刀口上！',
          html: scene(P(430, 270, ABACUS, '', 0, 1.2) +
            P(260, 302, A('kid', 'happy')) + qmark(340, 195)) },
        { minDur: 6800, sub: '貨比三家、集體訂票打折——省下的錢還能多加一站景點！大家鼓掌叫好！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(470, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .95) + hearts(390, 175) + bang(560, 195)) },
        { minDur: 6600, sub: '「精打細算」：精細地計劃盤算、不浪費一分一毫——會理財的人從小養成！',
          html: scene(P(400, 268, ABACUS, '', 0, 1.25) + hearts(530, 220)) },
        { minDur: 6400, sub: '精打細算：精細盤算，不浪費分毫。',
          html: scene(P(400, 270, ABACUS, '', 0, 1.3) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">精打細算</text>') }
      ];
    },
    /* 開源節流 */
    i834: function () {
      var FAUCET = '<path d="M-20 -20 h24 q10 0 10 10 l0 6 h-10 l0 -4 q0 -4 -4 -4 h-20 z" fill="#8b93a3" stroke="#6d7585" stroke-width="2"/><path d="M4 0 q-1 8 2 12 q4 -2 3 -10 z" fill="#8fc6ff"/>';
      var COIN = '<circle cx="0" cy="0" r="9" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/>';
      var SPRING = '<path d="M0 0 q-6 -16 4 -22 q10 -6 16 4" stroke="#8fc6ff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="0" cy="4" r="10" fill="#a8d4ee"/>';
      return [
        { minDur: 6800, sub: '「開源」像挖一道新泉水：擺攤賣手作、回收換零錢——讓收入的來源變多！',
          html: scene(P(300, 290, SPRING, '', 0, 1.3) + P(430, 288, COIN, '', .2, 1.1) + P(470, 284, COIN, '', .3, 1) +
            P(180, 302, A('kid', 'happy'), '', 0, .95) + hearts(260, 210)) },
        { minDur: 6800, sub: '「節流」像關緊水龍頭：隨手關燈、自帶水壺——讓支出慢慢變少！',
          html: scene(P(430, 260, FAUCET, '', 0, 1.4) +
            P(250, 302, A('kid', 'happy')) + hearts(340, 200)) },
        { minDur: 6800, sub: '收入多一點、支出省一點，撲滿越來越重——「開源節流」是理財的第一課！',
          html: scene(P(400, 302, '<ellipse cx="0" cy="-16" rx="24" ry="18" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2.6"/><circle cx="-20" cy="-24" r="7" fill="#f7a8c4" stroke="#e07ba3" stroke-width="2"/><rect x="-5" y="-36" width="12" height="3.4" rx="1.7" fill="#c95a83"/><circle cx="-14" cy="-26" r="1.8" fill="#3a2e26"/>', '', 0, 1.3) +
            P(360, 230, COIN, '', 0, 1) + hearts(500, 220)) },
        { minDur: 6400, sub: '開源節流：開拓收入、節省支出。',
          html: scene(P(300, 280, SPRING, '', 0, 1.2) + P(500, 262, FAUCET, '', 0, 1.2) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">開源節流</text>') }
      ];
    },
    /* 忍氣吞聲 */
    i835: function () {
      return [
        { minDur: 6800, sub: '排隊被插隊，小忍氣得臉都紅了——卻怕惹麻煩，把到嘴邊的話又吞了回去……',
          html: scene(P(360, 302, A('kid', 'angry') + '<ellipse cx="-15" cy="-44" rx="7" ry="5" fill="#ff9c8a"/><ellipse cx="15" cy="-44" rx="7" ry="5" fill="#ff9c8a"/>') +
            P(520, 302, A('kid', 'happy'), '', 0, .95) + sweat(300, 192)) },
        { minDur: 6800, sub: '把怒氣硬憋著、話往肚裡吞——「忍氣吞聲」久了，心裡會很委屈！',
          html: scene(P(400, 302, A('kid', 'sad'), '', 0, 1.05) + sweat(330, 192) + qmark(480, 182)) },
        { minDur: 6800, sub: '其實可以好好說：「請排隊喔！」——有禮貌地表達，比悶著更勇敢、更有用！',
          html: scene(P(320, 302, A('kid', 'happy')) + bang(410, 185) +
            P(520, 302, A('kid', 'happy'), '', 0, .95, true) + hearts(430, 210)) },
        { minDur: 6400, sub: '忍氣吞聲：忍住怒氣，話吞回去不敢發作。',
          html: scene(P(400, 302, A('kid', 'sad'), '', 0, 1.05) + sweat(330, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">忍氣吞聲</text>') }
      ];
    },
    /* 心平氣和 */
    i836: function () {
      var CALMHEART = '<path d="M0 5 C-7 -5 -19 2 -10 12 L0 20 L10 12 C19 2 7 -5 0 5 Z" fill="#a5d47c"/>';
      return [
        { minDur: 6800, sub: '桌遊輸了，小和差點要發火——他停三秒、深呼吸：「沒關係，再來一局！」',
          html: scene(P(360, 302, A('kid', 'happy')) +
            P(500, 260, '<rect x="-24" y="-18" width="48" height="30" rx="4" fill="#a5c8ff" stroke="#5c82ba" stroke-width="2.6"/>') +
            P(240, 200, CALMHEART, '', 0, 1.2) + hearts(430, 195)) },
        { minDur: 6800, sub: '同學起爭執，他也心平氣和當和事佬：「先聽對方說完，再輪流講。」',
          html: scene(P(300, 302, A('kid', 'angry'), '', 0, .93) + P(520, 302, A('kid', 'angry'), '', 0, .93, true) +
            P(410, 302, A('kid', 'happy'), '', 0, 1.02) + hearts(410, 180)) },
        { minDur: 6600, sub: '「心平氣和」：心情平靜、態度溫和——冷靜的人最有力量！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + P(400, 195, CALMHEART, '', 0, 1.5) + hearts(500, 220)) },
        { minDur: 6400, sub: '心平氣和：心情平靜、態度溫和。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.08) + P(400, 198, CALMHEART, '', 0, 1.6) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">心平氣和</text>') }
      ];
    },
    /* 神清氣爽 */
    i837: function () {
      return [
        { minDur: 6800, sub: '清晨的山上空氣涼涼的、混著草香——深深吸一口，整個腦袋都醒過來了！',
          html: scene(P(600, 302, '<path d="M-110 0 L0 -130 L110 0 Z" fill="#a5c2b2"/>') +
            P(300, 302, A('kid', 'happy'), '', 0, 1.05) + hearts(400, 190) +
            '<g stroke="#e8f4fb" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"><path class="st-windln" d="M150 160 q50 -12 100 0"/></g>') },
        { minDur: 6800, sub: '睡飽起床、洗把冷水臉，也會神清氣爽——精神清朗、心情舒暢！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) +
            P(500, 240, '<g class="st-tw"><path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#ffd97a"/></g>', '', 0, 1.2) + hearts(280, 195)) },
        { minDur: 6600, sub: '運動流汗後沖個澡、房間整理乾淨後坐下來——都是「神清氣爽」的時刻！',
          html: scene(P(400, 302, A('kid', 'happy'), 'st-strut', 0, 1.05) + hearts(500, 190) + notes(300, 185)) },
        { minDur: 6400, sub: '神清氣爽：精神清朗、心情舒暢。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.08) + hearts(490, 188) +
            P(320, 220, '<g class="st-tw"><path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#ffd97a"/></g>') +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">神清氣爽</text>') }
      ];
    },
    /* 千載難逢 */
    i838: function () {
      var COMET2 = '<g class="st-fly"><circle cx="0" cy="0" r="10" fill="#ffe9a0" stroke="#ffd97a" stroke-width="2"/><path d="M7 -5 q44 -20 84 -24 M8 2 q46 -6 86 -4 M6 8 q42 9 78 18" stroke="#ffe9a0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/></g>';
      return [
        { minDur: 6800, sub: '新聞說：今晚的大彗星，要再等七十六年才會回來！全家搬著椅子上頂樓等待——',
          html: scene(P(400, 110, COMET2, '', 0, 1.1) +
            P(300, 302, A('kid', 'wow')) + P(460, 302, A('kid', 'happy'), '', .2, 1.02) + hearts(390, 200), 'night') },
        { minDur: 6800, sub: '「千載」是一千年——一千年才遇得到一次的機會，千萬別錯過！',
          html: scene(P(430, 120, COMET2, '', 0, 1.2) + bang(560, 170) +
            P(300, 302, A('kid', 'happy')) + hearts(400, 210), 'night') },
        { minDur: 6800, sub: '奧運在自己的城市舉辦、和偶像面對面——遇上千載難逢的機會，勇敢抓住它！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(460, 185) + bang(280, 192)) },
        { minDur: 6400, sub: '千載難逢：機會極為難得。',
          html: scene(P(400, 130, COMET2, '', 0, 1.25) +
            '<text x="400" y="280" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">千載難逢</text>', 'night') }
      ];
    },
    /* 易如反掌 */
    i839: function () {
      var PALM2 = '<path d="M-12 16 q-6 -14 -5 -28 q1 -7 6 -7 q4 0 4 7 l0 8 q0 -18 2 -23 q2 -6 7 -5 q4 1 4 8 l-1 13 q2 -15 3 -19 q3 -6 7 -4 q4 2 3 8 l-2 15 q3 -10 4 -12 q3 -4 6 -2 q4 2 2 8 q-2 12 -6 25 q-4 11 -15 12 q-13 2 -19 -4 z" fill="#ffe3c1" stroke="#eec39a" stroke-width="2.2"/>';
      return [
        { minDur: 6800, sub: '把手掌翻過來——一秒鐘就做到，誰都會！',
          html: scene(P(340, 230, PALM2, '', 0, 1.4) +
            P(480, 230, '<g transform="scale(-1,1)">' + PALM2 + '</g>', '', .4, 1.4) +
            P(200, 302, A('kid', 'happy'), '', 0, .95) + bang(410, 170)) },
        { minDur: 6800, sub: '游泳健將表演打水漂、心算高手秒答二位數乘法——對高手來說，這些事易如反掌！',
          html: scene(P(340, 302, A('kid', 'happy')) +
            P(500, 250, '<text x="0" y="0" font-size="24" font-weight="bold" fill="#4a3200">23×47=1081</text>', '', 0, .9) + bang(590, 200) + hearts(260, 195)) },
        { minDur: 6600, sub: '「易如反掌」：像翻一下手掌那麼容易——不過別人的「容易」，背後都是苦練！',
          html: scene(P(400, 230, PALM2, '', 0, 1.5) + hearts(510, 210)) },
        { minDur: 6400, sub: '易如反掌：像翻手掌那麼容易。',
          html: scene(P(400, 235, PALM2, '', 0, 1.6) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">易如反掌</text>') }
      ];
    },
    /* 眼高手低 */
    i1011: function () {
      return [
        { minDur: 6800, sub: '看別人做蛋糕影片：「這麼簡單，我也會！」小高信心滿滿開工——',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -56, '<rect x="-18" y="-14" width="36" height="24" rx="3" fill="#3a2e26"/><rect x="-15" y="-11" width="30" height="18" rx="2" fill="#7fb2e0"/>', '', 0, .95)) + hearts(470, 190)) },
        { minDur: 6800, sub: '結果麵糊打得到處都是、蛋糕烤成黑炭——眼光很高，動手能力卻跟不上！',
          html: scene(P(360, 302, A('kid', 'wow')) + sweat(300, 190) +
            P(500, 290, '<path d="M-18 -8 a18 10 0 0 1 36 0 l-3 12 h-30 z" fill="#4a4238"/><g class="st-sweat"><path d="M-6 -18 q3 -6 0 -12 M6 -20 q3 -6 0 -12" stroke="#8b93a3" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>', '', 0, 1.1) + bang(580, 220)) },
        { minDur: 6800, sub: '「眼高手低」提醒我們：看會了不等於做得到——從基本功開始，一步步把手練起來！',
          html: scene(P(360, 302, A('kid', 'happy') + P(38, -46, '<path d="M-12 -6 q0 10 12 10 q12 0 12 -10 z" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.2"/>', '', 0, .95)) + hearts(470, 190)) },
        { minDur: 6400, sub: '眼高手低：眼光很高，實際能力不足。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) + qmark(480, 182) + sweat(320, 190) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">眼高手低</text>') }
      ];
    },
    /* 尊師重道 */
    i1012: function () {
      return [
        { minDur: 6800, sub: '程門立雪的楊時、每天幫老師曬書的學生——古人把老師看得和父母一樣重要！',
          html: scene(P(560, 302, '<path d="M-80 -70 L0 -118 L80 -70 Z" fill="#8a5a33"/><rect x="-66" y="-70" width="132" height="70" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/><rect x="-18" y="-48" width="36" height="48" rx="4" fill="#8a5a33"/>') +
            P(300, 302, '<g transform="rotate(30)">' + A('kid', 'happy') + '</g>') + hearts(400, 200)) },
        { minDur: 6800, sub: '上課專心、作業用心、見到老師問聲好——尊敬老師，也珍惜老師教的道理與學問！',
          html: scene(P(320, 302, A('kid', 'happy')) +
            P(520, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05, true) + hearts(420, 182)) },
        { minDur: 6600, sub: '「尊師重道」：尊敬師長、重視學問之道——是中華文化最美的傳統之一！',
          html: scene(P(300, 302, A('kid', 'happy')) + P(460, 302, A('kid', 'happy'), '', .2, .95) +
            P(600, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.02, true) + hearts(460, 178)) },
        { minDur: 6400, sub: '尊師重道：尊敬師長，重視道理與學問。',
          html: scene(P(320, 302, '<g transform="rotate(24)">' + A('kid', 'happy') + '</g>') +
            P(520, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, 1.05, true) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">尊師重道</text>') }
      ];
    },
    /* 更上層樓 */
    i1013: function () {
      var TOWER = '<rect x="-46" y="-40" width="92" height="40" fill="#c9762f" stroke="#a85a1e" stroke-width="2.6"/><path d="M-54 -40 h108 l-10 -12 h-88 z" fill="#8a5a33"/>' +
        '<rect x="-36" y="-76" width="72" height="36" fill="#c9762f" stroke="#a85a1e" stroke-width="2.6"/><path d="M-44 -76 h88 l-9 -11 h-70 z" fill="#8a5a33"/>' +
        '<rect x="-26" y="-108" width="52" height="32" fill="#c9762f" stroke="#a85a1e" stroke-width="2.6"/><path d="M-34 -108 h68 l-8 -11 h-52 z" fill="#8a5a33"/>';
      return [
        { minDur: 7000, sub: '王之渙登鸛雀樓寫下名句：「欲窮千里目，更上一層樓」——想看得更遠，就要爬得更高！',
          html: scene(P(430, 302, TOWER, '', 0, 1.1) +
            P(240, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, .95) + hearts(330, 200)) },
        { minDur: 6800, sub: '已經考到九十分了？下次挑戰九十五！游泳學會了？挑戰換氣更順——境界再提高一層！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.02) +
            '<path d="M280 260 L360 230 L440 200 L520 170" stroke="#548a40" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M520 170 l-13 -3 l7 12 z" fill="#548a40"/>' + bang(560, 150)) },
        { minDur: 6600, sub: '「更上層樓」：再提高一層水準——永遠給自己一個新目標！',
          html: scene(P(430, 302, TOWER, '', 0, 1.05) + P(250, 302, A('kid', 'happy'), 'st-strut', 0, .95) + hearts(340, 200)) },
        { minDur: 6400, sub: '更上層樓：再提高一層境界或水準。',
          html: scene(P(400, 302, TOWER, '', 0, 1.15) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">更上層樓</text>') }
      ];
    },
    /* 適可而止 */
    i1014: function () {
      return [
        { minDur: 6800, sub: '吃到飽餐廳裡，小止吃得剛剛好就放下筷子：「再吃就撐啦！」隔壁桌卻硬塞到肚子痛……',
          html: scene(P(300, 302, A('kid', 'happy') + P(38, -46, '<path d="M-12 -6 q0 10 12 10 q12 0 12 -10 z" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2.2"/>', '', 0, .95)) + hearts(390, 190) +
            P(540, 302, A('kid', 'wow')) + sweat(590, 195)) },
        { minDur: 6800, sub: '打電動三十分鐘就下線、開玩笑點到為止——懂得「適可而止」，才不會樂極生悲！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -56, '<rect x="-18" y="-14" width="36" height="24" rx="3" fill="#3a2e26"/><rect x="-15" y="-11" width="30" height="18" rx="2" fill="#7fb2e0"/>', '', 0, .95)) +
            P(500, 220, '<circle cx="0" cy="0" r="20" fill="#fff" stroke="#8b93a3" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-12" stroke="#e85a4f" stroke-width="2.6"/><line x1="0" y1="0" x2="8" y2="4" stroke="#e85a4f" stroke-width="2.6"/>', '', 0, 1)) },
        { minDur: 6600, sub: '「適可而止」：做到恰當的程度就停止——分寸拿捏得好，是大智慧！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) +
            P(400, 200, '<path d="M-40 0 h80" stroke="#8b93a3" stroke-width="4" stroke-linecap="round"/><path d="M20 -8 L20 8" stroke="#e85a4f" stroke-width="4" stroke-linecap="round"/>', '', 0, 1.2) + hearts(500, 220)) },
        { minDur: 6400, sub: '適可而止：做到恰當程度就停止，不過分。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.08) + hearts(490, 188) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">適可而止</text>') }
      ];
    },
    /* 有頭有尾 */
    i1043: function () {
      return [
        { minDur: 6800, sub: '小尾答應照顧班上的盆栽——從播種、澆水到開花，每一天都沒偷懶，直到全班看見花開！',
          html: scene(P(430, 296, '<path d="M-16 -6 q0 12 16 12 q16 0 16 -12 z" fill="#c9762f" stroke="#a85a1e" stroke-width="2.4"/>' +
              '<g class="st-grow"><line x1="0" y1="-6" x2="0" y2="-28" stroke="#5f8a46" stroke-width="3.4"/><circle cx="0" cy="-34" r="5" fill="#ff9eb5"/><circle cx="-6" cy="-30" r="5" fill="#ff9eb5"/><circle cx="6" cy="-30" r="5" fill="#ff9eb5"/><circle cx="0" cy="-30" r="3.4" fill="#ffe066"/></g>') +
            P(260, 302, A('kid', 'happy')) + hearts(350, 200)) },
        { minDur: 6800, sub: '做事有開頭、也有好結尾——不像有的人起頭轟轟烈烈，後面就不見人影啦！',
          html: scene('<path d="M220 250 L580 250" stroke="#548a40" stroke-width="5" stroke-linecap="round"/><circle cx="220" cy="250" r="9" fill="#548a40"/><circle cx="580" cy="250" r="9" fill="#548a40"/>' +
            P(400, 302, A('kid', 'happy'), '', 0, 1.02) + hearts(490, 195)) },
        { minDur: 6600, sub: '「有頭有尾」：有始有終、堅持到底——答應的事就負責到最後！',
          html: scene(P(400, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.05) + hearts(490, 185)) },
        { minDur: 6400, sub: '有頭有尾：做事有始有終。',
          html: scene('<path d="M240 250 L560 250" stroke="#548a40" stroke-width="5" stroke-linecap="round"/><circle cx="240" cy="250" r="9" fill="#548a40"/><circle cx="560" cy="250" r="9" fill="#548a40"/>' +
            P(400, 302, A('kid', 'happy'), '', 0, 1.05) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">有頭有尾</text>') }
      ];
    },
    /* 頭頭是道 */
    i1066: function () {
      return [
        { minDur: 6800, sub: '班會討論怎麼辦義賣——小道站起來：「第一，先調查大家想買什麼；第二，分組準備；第三，定價要親民！」',
          html: scene(P(360, 302, A('kid', 'happy') +
              '<path d="M18 -60 q14 -4 22 2" stroke="#ffe3c1" stroke-width="6" fill="none" stroke-linecap="round"/>', '', 0, 1.05) +
            P(280, 190, '<circle cx="0" cy="0" r="17" fill="#fff" opacity=".92"/><text x="0" y="6" text-anchor="middle" font-size="15" fill="#5c82ba">1</text>') +
            P(400, 165, '<circle cx="0" cy="0" r="17" fill="#fff" opacity=".92"/><text x="0" y="6" text-anchor="middle" font-size="15" fill="#548a40">2</text>', '', .2) +
            P(520, 190, '<circle cx="0" cy="0" r="17" fill="#fff" opacity=".92"/><text x="0" y="6" text-anchor="middle" font-size="15" fill="#c96a5a">3</text>', '', .4)) },
        { minDur: 6600, sub: '一條一條講得清清楚楚，每點都有道理——同學聽得連連點頭！',
          html: scene(P(300, 302, A('kid', 'happy'), '', 0, 1.02) +
            P(500, 302, A('kid', 'happy'), '', 0, .95) + P(620, 302, A('kid', 'happy'), '', .2, .93) + hearts(460, 182)) },
        { minDur: 6600, sub: '「頭頭是道」：說話做事條理分明——先想清楚再開口，人人都能頭頭是道！',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + notes(490, 185) + hearts(310, 188)) },
        { minDur: 6400, sub: '頭頭是道：條理分明，每一點都有道理。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.08) +
            P(300, 190, '<circle cx="0" cy="0" r="15" fill="#fff" opacity=".92"/><text x="0" y="5" text-anchor="middle" font-size="13" fill="#5c82ba">1</text>') +
            P(400, 170, '<circle cx="0" cy="0" r="15" fill="#fff" opacity=".92"/><text x="0" y="5" text-anchor="middle" font-size="13" fill="#548a40">2</text>') +
            P(500, 190, '<circle cx="0" cy="0" r="15" fill="#fff" opacity=".92"/><text x="0" y="5" text-anchor="middle" font-size="13" fill="#c96a5a">3</text>') +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">頭頭是道</text>') }
      ];
    },
    /* 古色古香 */
    i1080: function () {
      var OLDHOUSE = '<path d="M-90 -70 q90 -40 180 0 l-12 0 q-78 -32 -156 0 z" fill="#8a5a33"/>' +
        '<rect x="-76" y="-70" width="152" height="70" fill="#f4ecd8" stroke="#c9bfa8" stroke-width="3"/>' +
        '<g stroke="#8a5a33" stroke-width="3"><rect x="-58" y="-54" width="34" height="34" fill="#c9762f"/><line x1="-41" y1="-54" x2="-41" y2="-20"/><line x1="-58" y1="-37" x2="-24" y2="-37"/></g>' +
        '<rect x="-12" y="-48" width="34" height="48" rx="3" fill="#8a5a33"/>' +
        '<circle cx="52" cy="-40" r="12" fill="#e85a4f"/><path d="M46 -40 h12 M52 -46 v12" stroke="#f4ecd8" stroke-width="1.6"/>';
      return [
        { minDur: 6800, sub: '走進老街的百年茶樓：木雕窗花、紅磚牆、老燈籠——到處都是歲月的味道！',
          html: scene(P(430, 302, OLDHOUSE, '', 0, 1.1) +
            P(200, 302, A('kid', 'wow'), '', 0, .92) + hearts(290, 205)) },
        { minDur: 6800, sub: '爺爺的書房也古色古香：硯台、毛筆、線裝書，連椅子都是古早的木頭椅！',
          html: scene(P(430, 280, '<rect x="-50" y="-30" width="100" height="12" rx="4" fill="#8a5a33"/><line x1="-40" y1="-18" x2="-40" y2="6" stroke="#8a5a33" stroke-width="5"/><line x1="40" y1="-18" x2="40" y2="6" stroke="#8a5a33" stroke-width="5"/><rect x="-34" y="-44" width="26" height="14" rx="2" fill="#e8dcc0" stroke="#c9bfa8" stroke-width="2"/><line x1="12" y1="-52" x2="20" y2="-32" stroke="#a8734a" stroke-width="3.4" stroke-linecap="round"/>') +
            P(240, 302, A('kid', 'happy')) + hearts(330, 200)) },
        { minDur: 6600, sub: '「古色古香」：帶有古雅的色彩和情調——老東西有新玩具沒有的韻味！',
          html: scene(P(400, 302, OLDHOUSE, '', 0, 1.05) + hearts(550, 210)) },
        { minDur: 6400, sub: '古色古香：帶有古雅的色彩和情調。',
          html: scene(P(400, 302, OLDHOUSE, '', 0, 1.15) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">古色古香</text>') }
      ];
    },
    /* 大獲全勝 */
    i1092: function () {
      var TROPHY2 = '<path d="M-14 -34 h28 v10 q0 14 -14 16 q-14 -2 -14 -16 z" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.4"/><path d="M-14 -30 q-12 0 -10 12 q2 8 10 6 M14 -30 q12 0 10 12 q-2 8 -10 6" stroke="#e8b84a" stroke-width="2.6" fill="none"/><rect x="-4" y="-8" width="8" height="8" fill="#c98f2a"/><rect x="-12" y="0" width="24" height="6" rx="2.4" fill="#c98f2a"/>';
      return [
        { minDur: 6800, sub: '躲避球決賽！我們班從第一局贏到最後一局，對手一分都沒拿到——完勝！',
          html: scene(P(300, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(450, 302, '<g class="st-cheer" style="animation-delay:.2s">' + A('kid', 'happy') + '</g>', '', 0, .95) + bang(560, 195) +
            '<text x="620" y="180" font-size="26" font-weight="bold" fill="#4a3200">10:0</text>') },
        { minDur: 6600, sub: '捧回冠軍獎盃，歡呼聲響徹操場——「大獲全勝」就是贏得徹徹底底！',
          html: scene(P(400, 290, TROPHY2, '', 0, 1.4) +
            P(260, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>') +
            P(540, 302, '<g class="st-cheer" style="animation-delay:.3s">' + A('kid', 'happy') + '</g>', '', 0, .95) + hearts(400, 200)) },
        { minDur: 6600, sub: '勝利的背後是整學期的練習——「大獲全勝」的果實，最甜！',
          html: scene(P(400, 290, TROPHY2, '', 0, 1.3) + hearts(500, 220) + notes(300, 210)) },
        { minDur: 6400, sub: '大獲全勝：獲得完全的勝利。',
          html: scene(P(400, 288, TROPHY2, '', 0, 1.5) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">大獲全勝</text>') }
      ];
    },
    /* 落荒而逃 */
    i1093: function () {
      return [
        { minDur: 6800, sub: '偷菜的野豬被農家的大狗發現——嚇得連菜都不要了，慌慌張張往荒草叢裡鑽！',
          html: scene(P(300, 302, A('dog'), 'st-dashL', 0, 1.05) + bang(420, 210) +
            P(560, 302, '<g class="st-fleeR">' + A('fox') + '</g>', 'st-dashL', 0, .95) + sweat(500, 230) +
            '<g stroke="#5f8a46" stroke-width="4.6" fill="none" stroke-linecap="round"><path d="M680 318 q-5 -24 -12 -30 M680 318 q5 -26 13 -32"/></g>') },
        { minDur: 6800, sub: '不走大路、逃向荒野——形容輸得狼狽、逃得倉皇的樣子！',
          html: scene(P(400, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, 1.02) + sweat(340, 195) +
            '<g stroke="#5f8a46" stroke-width="4.6" fill="none" stroke-linecap="round"><path d="M620 318 q-5 -24 -12 -30 M620 318 q5 -26 13 -32 M700 320 q-4 -20 -10 -26"/></g>', 'night') },
        { minDur: 6600, sub: '「落荒而逃」：離開大路逃向荒野——常用來形容比賽或爭論中敗下陣來、狼狽離場！',
          html: scene(P(300, 302, A('kid', 'happy')) + bang(390, 188) +
            P(560, 302, '<g class="st-fleeR">' + A('kid', 'wow') + '</g>', 'st-dashL', 0, .93) + sweat(500, 195)) },
        { minDur: 6400, sub: '落荒而逃：逃向荒野，狼狽逃走。',
          html: scene(P(450, 302, '<g class="st-fleeR">' + A('fox') + '</g>', 'st-dashL', 0, 1.05) + sweat(390, 225) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">落荒而逃</text>') }
      ];
    },
    /* 來去無蹤 */
    i1118: function () {
      return [
        { minDur: 6800, sub: '武俠片裡的俠客：一陣風似地出現、救了人又一閃而去——連衣角都抓不到！',
          html: scene(P(360, 302, '<g opacity=".55">' + A('kid', 'angry') + '</g>', 'st-inL', 0, 1.05) +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="480" y1="230" x2="580" y2="230"/><line class="st-windln" style="animation-delay:.4s" x1="460" y1="260" x2="550" y2="260"/></g>' +
            P(600, 302, A('kid', 'wow'), '', 0, .92) + qmark(650, 188), 'night') },
        { minDur: 6800, sub: '巷口的野貓也來去無蹤：早上還在牆頭晒太陽，一眨眼就不見了！',
          html: scene(P(300, 260, '<rect x="-60" y="0" width="120" height="42" fill="#b0a390" stroke="#8a7a66" stroke-width="2.6"/>') +
            P(300, 258, A('fox'), '', 0, .85) + qmark(430, 210) +
            P(560, 302, A('kid', 'wow'), '', 0, .93)) },
        { minDur: 6600, sub: '「來去無蹤」：來和去都不留痕跡——行動飄忽、難以捉摸！',
          html: scene(P(400, 250, '<circle cx="0" cy="0" r="40" fill="none" stroke="#c9bfa8" stroke-width="3" stroke-dasharray="10 10"/><text x="0" y="10" text-anchor="middle" font-size="30" fill="#c9bfa8">?</text>') +
            '<g stroke="#c9dff0" stroke-width="4" stroke-linecap="round" opacity=".8"><line class="st-windln" x1="200" y1="220" x2="280" y2="220"/><line class="st-windln" style="animation-delay:.5s" x1="520" y1="240" x2="600" y2="240"/></g>') },
        { minDur: 6400, sub: '來去無蹤：來去不留蹤跡，行動飄忽。',
          html: scene(P(400, 302, '<g opacity=".5">' + A('kid', 'happy') + '</g>', '', 0, 1.05) +
            '<g stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".9"><line class="st-windln" x1="480" y1="240" x2="570" y2="240"/></g>' +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">來去無蹤</text>', 'night') }
      ];
    },
    /* 省吃儉用 */
    i1146: function () {
      var PATCHSHIRT = '<path d="M-12 -20 L-22 -12 L-16 -4 L-12 -8 L-12 12 L12 12 L12 -8 L16 -4 L22 -12 L12 -20 Q0 -14 -12 -20 Z" fill="#8fa8c9" stroke="#5c82ba" stroke-width="2"/><rect x="-6" y="0" width="9" height="8" fill="#ffd97a" stroke="#e8b84a" stroke-width="1.4" stroke-dasharray="2 2"/>';
      var COIN = '<circle cx="0" cy="0" r="8" fill="#ffd97a" stroke="#e8b84a" stroke-width="2.2"/>';
      return [
        { minDur: 7000, sub: '阿嬤常說她小時候：衣服破了縫補丁繼續穿、一塊豆腐配三餐——省下的錢供孩子讀書！',
          html: scene(P(360, 260, PATCHSHIRT, '', 0, 1.4) +
            P(200, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, .95) + hearts(280, 210)) },
        { minDur: 6800, sub: '就這樣一分一毫省下來，家裡的日子越過越穩，孩子們也都念完了書！',
          html: scene(P(400, 290, COIN, '', 0, 1) + P(440, 286, COIN, '', .1, 1) + P(480, 292, COIN, '', .2, 1) +
            P(260, 302, A('kid', 'happy')) + hearts(350, 200)) },
        { minDur: 6600, sub: '「省吃儉用」：吃的用的都節省——珍惜資源的美德，什麼時代都不過時！',
          html: scene(P(360, 260, PATCHSHIRT, '', 0, 1.2) + P(520, 288, COIN, '', 0, 1.1) + hearts(440, 220)) },
        { minDur: 6400, sub: '省吃儉用：吃用節省，生活節儉。',
          html: scene(P(350, 262, PATCHSHIRT, '', 0, 1.3) + P(510, 288, COIN, '', 0, 1.2) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">省吃儉用</text>') }
      ];
    },
    /* 胡言亂語 */
    i1173: function () {
      function bub7(x, y, txt, rot, dly) {
        return P(x, y, '<g class="st-zfloat"' + (dly ? ' style="animation-delay:' + dly + 's"' : '') + ' transform="rotate(' + rot + ')">' +
          '<path d="M-22 -12 a19 14 0 1 1 38 4 q-2 6 -8 7 l-8 7 l1 -7 q-18 -2 -21 -11 z" fill="#fff" stroke="#c9bfa8" stroke-width="2"/>' +
          '<text x="-2" y="-2" text-anchor="middle" font-size="10" fill="#8a7a4a">' + txt + '</text></g>');
      }
      return [
        { minDur: 6800, sub: '發燒說夢話的弟弟嘴裡念念有詞：「大象在天上游泳……數學課吃冰淇淋……」誰也聽不懂！',
          html: scene(P(360, 302, '<ellipse cx="0" cy="-8" rx="34" ry="12" fill="#6fbf8e"/><circle cx="-28" cy="-16" r="13" fill="#ffe3c1" stroke="#eec39a" stroke-width="2"/>') +
            bub7(300, 200, '大象游泳?', -6, 0) + bub7(460, 185, '吃冰淇淋?', 5, .3) + zzz(250, 230), 'night') },
        { minDur: 6800, sub: '沒有根據、沒有條理地亂說一通——就是「胡言亂語」！',
          html: scene(P(360, 302, A('kid', 'happy'), '', 0, 1.02) +
            bub7(290, 180, '？？', -5, 0) + bub7(450, 170, '！？', 6, .3) +
            P(580, 302, A('kid', 'wow'), '', 0, .92) + qmark(630, 190)) },
        { minDur: 6800, sub: '說話前先想一想、查一查——有憑有據，別人才會相信你！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -50, '<rect x="-16" y="-20" width="32" height="40" rx="3" fill="#fff" stroke="#c9bfa8" stroke-width="2.4"/><path d="M-8 12 l5 6 l11 -10" stroke="#548a40" stroke-width="3" fill="none" stroke-linecap="round"/>', '', 0, .95)) + hearts(470, 190)) },
        { minDur: 6400, sub: '胡言亂語：毫無根據、沒有條理地亂說。',
          html: scene(P(400, 302, A('kid', 'happy'), '', 0, 1.05) + bub7(310, 180, '？！', -5, 0) + bub7(480, 175, '？？', 5, .3) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">胡言亂語</text>') }
      ];
    },
    /* 甜言蜜語 */
    i1174: function () {
      var HONEY2 = '<path d="M0 0 q-7 10 0 16 q7 -6 0 -16 z" fill="#e8b84a"/>';
      return [
        { minDur: 6800, sub: '童話裡的狐狸對烏鴉說：「您的歌聲是森林裡最美的！」烏鴉一開心張嘴唱歌——嘴裡的肉掉了！',
          html: scene(P(200, 180, '<g class="st-bob"><ellipse cx="0" cy="-14" rx="14" ry="10" fill="#4a4a55"/><circle cx="-11" cy="-24" r="7.5" fill="#4a4a55"/><path d="M-17 -24 l-7 2 l7 3 z" fill="#e0a458"/><circle cx="-13" cy="-26" r="1.8" fill="#fff"/></g>') +
            P(400, 302, A('fox'), '', 0, 1.05) + P(470, 220, HONEY2, '', 0, 1.2) +
            P(240, 240, '<ellipse cx="0" cy="0" rx="10" ry="7" fill="#e88a7a" stroke="#c96a5a" stroke-width="2"/>', 'st-bang')) },
        { minDur: 6800, sub: '像糖蜜一樣甜的話，聽起來舒服——但目的常常是討好或哄騙，要小心！',
          html: scene(P(360, 302, A('kid', 'happy') + P(38, -60, HONEY2, '', 0, 1.4)) +
            P(560, 302, A('kid', 'wow'), '', 0, .95) + qmark(610, 188)) },
        { minDur: 6800, sub: '真正的朋友不只說好聽話，也會誠實提醒你的缺點——那才是真心！',
          html: scene(P(320, 302, A('kid', 'happy')) + P(500, 302, A('kid', 'happy'), '', 0, .97, true) + hearts(410, 180)) },
        { minDur: 6400, sub: '甜言蜜語：討好或哄騙人的甜美話語。',
          html: scene(P(360, 250, HONEY2, '', 0, 2) + P(480, 260, HONEY2, '', .3, 1.6) + qmark(560, 220) +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">甜言蜜語</text>') }
      ];
    },
    /* 厚積薄發 */
    i068: function () {
      var BOOKS3 = '<g stroke-width="2"><rect x="-30" y="-12" width="60" height="12" rx="2.6" fill="#c9762f" stroke="#a85a1e"/><rect x="-27" y="-24" width="54" height="12" rx="2.6" fill="#5c82ba" stroke="#46689a"/><rect x="-29" y="-36" width="58" height="12" rx="2.6" fill="#6fae58" stroke="#548a40"/><rect x="-25" y="-48" width="50" height="12" rx="2.6" fill="#e0a458" stroke="#c08838"/><rect x="-27" y="-60" width="54" height="12" rx="2.6" fill="#c9a8e0" stroke="#a884c4"/></g>';
      return [
        { minDur: 7000, sub: '蘇軾說：「博觀而約取，厚積而薄發」——像蓄水一樣大量累積學問，出手時只取最精華的一點！',
          html: scene(P(430, 302, BOOKS3, '', 0, 1.3) +
            P(240, 302, A('kid', 'happy') + '<path d="M-10 -34 q10 8 20 0 l0 6 q-10 8 -20 0 z" fill="#d5cfc0"/>', '', 0, .95) + hearts(330, 205)) },
        { minDur: 6800, sub: '竹子前四年只長三公分——第五年起每天長三十公分！因為前四年根在地下蔓延了幾百公尺！',
          html: scene(P(430, 302, '<g class="st-grow"><line x1="0" y1="0" x2="0" y2="-140" stroke="#5f9a4a" stroke-width="9" stroke-linecap="round"/><g stroke="#4a7a38" stroke-width="2.6"><line x1="-6" y1="-46" x2="6" y2="-46"/><line x1="-6" y1="-92" x2="6" y2="-92"/></g><path d="M0 -140 q-14 -10 -26 -8 M0 -140 q14 -10 26 -8" stroke="#6fae58" stroke-width="4" fill="none" stroke-linecap="round"/></g>' +
              '<g stroke="#a8734a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".7"><path d="M0 4 q-40 14 -80 10 M0 6 q40 12 84 8 M0 8 q-20 20 -18 30"/></g>') +
            P(220, 302, A('kid', 'wow'), '', 0, .92) + bang(560, 190)) },
        { minDur: 6800, sub: '「厚積薄發」：長期累積，爆發時力量驚人——現在的每一分努力都在扎根！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -56, BOOKS3, '', 0, .7)) + hearts(470, 190) + bang(280, 195)) },
        { minDur: 6400, sub: '厚積薄發：長期累積，爆發時力量強大。',
          html: scene(P(400, 302, BOOKS3, '', 0, 1.35) + bang(520, 220) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">厚積薄發</text>') }
      ];
    },
    /* 海納百川 */
    i069: function () {
      var SEA9 = '<rect y="252" width="800" height="88" fill="#7fb2e0"/>' +
        '<g class="st-wavemove"><path d="M-40 264 q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#6db3d9" stroke-width="9" stroke-linecap="round" opacity=".9"/></g>';
      var RIVERS = '<path d="M100 180 q40 40 90 74 M700 180 q-40 40 -90 74 M400 160 q0 50 0 92" stroke="#a8d4ee" stroke-width="8" fill="none" stroke-linecap="round"/>';
      return [
        { minDur: 6800, sub: '一百條江河，從四面八方奔流入海——大海從不挑剔，全部容納！',
          html: scene(SEA9 + RIVERS + qmark(250, 130)) },
        { minDur: 7000, sub: '林則徐寫過對聯：「海納百川，有容乃大」——心胸像大海一樣，才能容得下各種不同的意見！',
          html: scene(SEA9 +
            P(300, 296, A('kid', 'happy')) + P(480, 296, A('kid', 'happy'), '', .2, .95) + hearts(390, 210)) },
        { minDur: 6800, sub: '討論時聽得進反對的聲音、交朋友不分你我他——「海納百川」的度量最受歡迎！',
          html: scene(P(280, 302, A('kid', 'happy')) + P(420, 302, A('kid', 'happy'), '', .1, .95) + P(560, 302, A('kid', 'happy'), '', .2, .93) + hearts(420, 178)) },
        { minDur: 6400, sub: '海納百川：寬容開放，包容各方。',
          html: scene(SEA9 + RIVERS +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">海納百川</text>') }
      ];
    },
    /* 百尺竿頭 */
    i070: function () {
      var POLE2 = '<line x1="0" y1="0" x2="0" y2="-170" stroke="#a8734a" stroke-width="7"/><g stroke="#8a5a33" stroke-width="2.4"><line x1="-6" y1="-34" x2="6" y2="-34"/><line x1="-6" y1="-68" x2="6" y2="-68"/><line x1="-6" y1="-102" x2="6" y2="-102"/><line x1="-6" y1="-136" x2="6" y2="-136"/></g>';
      return [
        { minDur: 7000, sub: '雜技高手爬上百尺高竿的頂端，全場喝采——師父卻說：「百尺竿頭，更進一步！」',
          html: scene(P(430, 302, POLE2) + P(430, 132, A('kid', 'happy'), '', 0, .7) +
            P(220, 302, A('kid', 'wow'), '', 0, .9) + hearts(300, 210)) },
        { minDur: 6800, sub: '已經到頂了還怎麼進步？——放開手、向上跳！超越顛峰，境界才能再開闊！',
          html: scene(P(430, 302, POLE2) + P(430, 90, '<g class="st-hop">' + A('kid', 'happy') + '</g>', '', 0, .7) + bang(530, 80)) },
        { minDur: 6800, sub: '「百尺竿頭」：已達最高點，還要更進一步——第一名之後，仍然天天練習的人最了不起！',
          html: scene(P(360, 302, '<g class="st-cheer">' + A('kid', 'happy') + '</g>', '', 0, 1.02) + hearts(460, 185) +
            '<path d="M280 250 L380 210 L480 170 L580 130" stroke="#548a40" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M580 130 l-13 -3 l7 12 z" fill="#548a40"/>') },
        { minDur: 6400, sub: '百尺竿頭：已達高點，更進一步。',
          html: scene(P(400, 302, POLE2) + P(400, 130, A('kid', 'happy'), '', 0, .7) +
            '<text x="400" y="60" text-anchor="middle" font-size="48" font-weight="bold" fill="#4a3200">百尺竿頭</text>') }
      ];
    },
    /* 四通八達 */
    i269: function () {
      var ROADS = '<g stroke="#8b93a3" stroke-width="14"><line x1="0" y1="240" x2="800" y2="240"/><line x1="400" y1="120" x2="400" y2="340"/><line x1="150" y1="130" x2="650" y2="335"/><line x1="650" y1="130" x2="150" y2="335"/></g>' +
        '<g stroke="#fff" stroke-width="2.4" stroke-dasharray="12 10"><line x1="0" y1="240" x2="800" y2="240"/><line x1="400" y1="120" x2="400" y2="340"/></g>';
      return [
        { minDur: 6800, sub: '站上天橋看路口：東西南北的大路、斜向的快速道路，四面八方都能走！',
          html: scene(ROADS + P(150, 302, A('kid', 'wow'), '', 0, .9) + hearts(230, 210)) },
        { minDur: 6800, sub: '高鐵、捷運、公車、渡輪——台灣的交通四通八達，想去哪裡都方便！',
          html: scene(P(300, 292, '<rect x="-40" y="-20" width="80" height="26" rx="6" fill="#e0a458" stroke="#c08838" stroke-width="2.6"/><circle cx="-22" cy="8" r="7" fill="#3a2e26"/><circle cx="22" cy="8" r="7" fill="#3a2e26"/><rect x="-32" y="-14" width="18" height="12" rx="2" fill="#aee3f5"/><rect x="-8" y="-14" width="18" height="12" rx="2" fill="#aee3f5"/>', 'st-strut') +
            P(560, 292, '<rect x="-46" y="-16" width="92" height="22" rx="10" fill="#c9d6e8" stroke="#8b93a3" stroke-width="2.6"/><rect x="-36" y="-10" width="20" height="10" rx="2" fill="#5c82ba"/><rect x="-8" y="-10" width="20" height="10" rx="2" fill="#5c82ba"/>', 'st-strut', .3)) },
        { minDur: 6600, sub: '「四通八達」：交通便利、各方通行無阻——也形容人脈或資訊流通廣！',
          html: scene(ROADS + bang(400, 90)) },
        { minDur: 6400, sub: '四通八達：交通便利，各方通行無阻。',
          html: scene(ROADS +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#eef4ff">四通八達</text>') }
      ];
    },
    /* 五花八門 */
    i270: function () {
      return [
        { minDur: 6800, sub: '社團博覽會上：魔術社、烘焙社、機器人社、街舞社、天文社……攤位一個比一個精彩！',
          html: scene(P(240, 302, '<rect x="-40" y="-30" width="80" height="30" rx="4" fill="#e85a4f" stroke="#c94a3f" stroke-width="2.6"/>') +
            P(400, 302, '<rect x="-40" y="-30" width="80" height="30" rx="4" fill="#5c82ba" stroke="#46689a" stroke-width="2.6"/>') +
            P(560, 302, '<rect x="-40" y="-30" width="80" height="30" rx="4" fill="#6fae58" stroke="#548a40" stroke-width="2.6"/>') +
            P(320, 302, A('kid', 'wow'), '', 0, .9) + hearts(470, 230)) },
        { minDur: 6800, sub: '夜市小吃也是五花八門：蚵仔煎、地瓜球、木瓜牛奶——選擇多到不知道吃哪個！',
          html: scene(P(300, 290, '<circle cx="0" cy="0" r="12" fill="#ffd97a"/>', '', 0, 1.1) +
            P(400, 285, '<circle cx="0" cy="0" r="10" fill="#e0a458"/>', '', .2, 1.1) +
            P(500, 292, '<rect x="-10" y="-14" width="20" height="24" rx="6" fill="#ff9eb5"/>', '', .4, 1.1) +
            P(220, 302, A('kid', 'happy')) + qmark(360, 200) + hearts(560, 220)) },
        { minDur: 6600, sub: '「五花八門」：花樣繁多、變化多端——目不暇給的豐富世界！',
          html: scene(P(280, 260, '<circle cx="0" cy="0" r="14" fill="#ff9eb5"/>', '', 0, 1) + P(380, 245, '<rect x="-12" y="-12" width="24" height="24" rx="4" fill="#a5c8ff"/>', '', .2, 1) +
            P(480, 262, '<path d="M0 -14 L12 8 L-12 8 Z" fill="#a5d47c"/>', '', .4, 1) + P(560, 248, '<circle cx="0" cy="0" r="11" fill="#ffd97a"/>', '', .5, 1) + hearts(420, 300)) },
        { minDur: 6400, sub: '五花八門：花樣繁多，變化多端。',
          html: scene(P(280, 255, '<circle cx="0" cy="0" r="14" fill="#ff9eb5"/>') + P(400, 240, '<rect x="-12" y="-12" width="24" height="24" rx="4" fill="#a5c8ff"/>') +
            P(520, 258, '<path d="M0 -14 L12 8 L-12 8 Z" fill="#a5d47c"/>') +
            '<text x="400" y="90" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">五花八門</text>') }
      ];
    },
    /* 六神無主 */
    i271: function () {
      return [
        { minDur: 6800, sub: '書包不見了！明明放在椅子上——小主急得原地打轉：找老師？回教室？打電話？完全亂了方寸！',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) +
            qmark(310, 180) + qmark(400, 155) + qmark(490, 180) + sweat(340, 195) + sweat(460, 198)) },
        { minDur: 6800, sub: '「六神」是古人說掌管心肝脾肺腎膽的神——六神都沒了主意，就是慌到極點！',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.05) +
            P(290, 190, '<circle cx="0" cy="0" r="15" fill="#fff" opacity=".9"/><text x="0" y="5" text-anchor="middle" font-size="12" fill="#c96a5a">?</text>') +
            P(360, 165, '<circle cx="0" cy="0" r="15" fill="#fff" opacity=".9"/><text x="0" y="5" text-anchor="middle" font-size="12" fill="#e0a458">?</text>', '', .1) +
            P(440, 165, '<circle cx="0" cy="0" r="15" fill="#fff" opacity=".9"/><text x="0" y="5" text-anchor="middle" font-size="12" fill="#548a40">?</text>', '', .2) +
            P(510, 190, '<circle cx="0" cy="0" r="15" fill="#fff" opacity=".9"/><text x="0" y="5" text-anchor="middle" font-size="12" fill="#5c82ba">?</text>', '', .3)) },
        { minDur: 6800, sub: '深呼吸、按順序想：最後在哪裡看到它？——冷靜下來，果然在體育館找回書包！',
          html: scene(P(360, 302, A('kid', 'happy') + P(-44, -46, '<rect x="-14" y="-16" width="28" height="20" rx="4" fill="#5c82ba" stroke="#46689a" stroke-width="2.4"/>', '', 0, 1)) + hearts(470, 190)) },
        { minDur: 6400, sub: '六神無主：驚慌失措，拿不定主意。',
          html: scene(P(400, 302, A('kid', 'wow'), '', 0, 1.08) + qmark(320, 180) + qmark(480, 182) + sweat(400, 158) +
            '<text x="400" y="80" text-anchor="middle" font-size="52" font-weight="bold" fill="#4a3200">六神無主</text>') }
      ];
    }
  };

  window.AnimStory = {
    has: function (id) { return !!STORIES[id]; },
    scenes: function (id) { return STORIES[id] ? STORIES[id]() : []; },
    count: function () { return Object.keys(STORIES).length; }
  };
})();
