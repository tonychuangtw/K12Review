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
    }
  };

  window.AnimStory = {
    has: function (id) { return !!STORIES[id]; },
    scenes: function (id) { return STORIES[id] ? STORIES[id]() : []; },
    count: function () { return Object.keys(STORIES).length; }
  };
})();
