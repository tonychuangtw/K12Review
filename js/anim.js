/* 成語動畫卡播放器（標準風格）
   - 資料驅動：任何成語條目（term/zhuyin/pinyin/meaning/example/wordExp/deep）自動生成分鏡
   - 換幕採「語音唸完 + 最短秒數」雙條件；點畫面可跳下一段
   - 語音用瀏覽器內建 TTS（zh-TW），$0、離線可用
   - 用法：IdiomAnim.play(item, { phon: 'zhuyin'|'pinyin' })                          */
(function () {
  if (typeof document === 'undefined') return; // node 測試環境不執行

  var TTS = ('speechSynthesis' in window);
  var zhVoice = null;
  function pickVoice() {
    var vs = speechSynthesis.getVoices();
    zhVoice = vs.find(function (v) { return /zh[-_]TW/i.test(v.lang); }) ||
              vs.find(function (v) { return /^zh/i.test(v.lang); }) || null;
  }
  if (TTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

  var overlay = null, stage = null, sub = null, voiceBtn = null;
  var gen = 0, voiceOn = true, playing = null; // playing = {item, scenes, idx}

  function buildDom() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'animOverlay';
    overlay.innerHTML =
      '<div id="animStage"></div>' +
      '<div id="animSub"></div>' +
      '<div id="animCtrl">' +
        '<button id="animNext">⏭ 下一段</button>' +
        '<button id="animVoice">🔊 語音</button>' +
        '<button id="animClose">✕ 關閉</button>' +
      '</div>';
    document.body.appendChild(overlay);
    stage = document.getElementById('animStage');
    sub = document.getElementById('animSub');
    voiceBtn = document.getElementById('animVoice');
    document.getElementById('animClose').addEventListener('click', close);
    document.getElementById('animNext').addEventListener('click', skip);
    stage.addEventListener('click', skip);
    voiceBtn.addEventListener('click', function () {
      voiceOn = !voiceOn;
      voiceBtn.textContent = voiceOn ? '🔊 語音' : '🔇 語音';
      if (!voiceOn && TTS) speechSynthesis.cancel();
    });
  }

  function speakText(t) { // 給 TTS 唸的版本（把符號轉成口語）
    return String(t).replace(/＝/g, '，就是').replace(/[；;]/g, '。')
                    .replace(/[「」『』（）()【】]/g, '').replace(/\n+/g, '。');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- 由成語資料生成標準分鏡 ---------- */
  function buildScenes(it, phon) {
    var scenes = [];
    var chars = Array.from(it.term);
    var zy = (phon === 'pinyin' ? (it.pinyin || '') : (it.zhuyin || '')).trim().split(/\s+/);
    var zyOk = zy.length === chars.length;

    // 1. 成語登場：逐字彈出 + 注音
    var h = '<div class="anim-zirow">';
    chars.forEach(function (c, i) {
      h += '<div class="anim-zib" style="animation-delay:' + (0.15 + i * 0.35) + 's">' +
             '<div class="anim-zi">' + esc(c) + '</div>' +
             (zyOk ? '<div class="anim-zy">' + esc(zy[i]) + '</div>' : '') +
           '</div>';
    });
    h += '</div>' + (zyOk ? '' : '<div class="anim-zy-line">' + esc(zy.join(' ')) + '</div>');
    scenes.push({ html: h, text: it.term, speak: it.term, minDur: 2600 + chars.length * 350 });

    // 2. 意思（配圖 Ken Burns）
    var img = 'img/idioms/' + it.id + '.webp';
    scenes.push({
      html: '<div class="anim-imgwrap"><img class="anim-img" src="' + img + '" ' +
            'onerror="this.parentNode.style.display=\'none\'"></div>' +
            '<div class="anim-title">' + esc(it.term) + '</div>' +
            '<div class="anim-text anim-fadeup">💡 ' + esc(it.meaning) + '</div>',
      text: it.meaning, speak: it.term + '。意思是：' + it.meaning, minDur: 4200
    });

    // 3. 逐字解析
    if (it.wordExp) {
      var parts = it.wordExp.split(/[；;]/).filter(function (s) { return s.trim(); });
      var h3 = '<div class="anim-title">🔍 逐字解析</div><div class="anim-lines">';
      parts.forEach(function (p, i) {
        h3 += '<div class="anim-line" style="animation-delay:' + (0.3 + i * 0.9) + 's">' + esc(p.trim()) + '</div>';
      });
      h3 += '</div>';
      scenes.push({ html: h3, text: it.wordExp, speak: speakText(it.wordExp), minDur: 3000 + parts.length * 900 });
    }

    // 4. 典故／字面／引申（拆 deep 欄位）
    if (it.deep) {
      var lines = it.deep.split(/\n+/);
      var story = null, rest = [];
      lines.forEach(function (l) {
        if (/^典故由來/.test(l)) story = l;
        else if (l.trim()) rest.push(l);
      });
      if (story && !/無特定典故/.test(story)) {
        scenes.push({
          html: '<div class="anim-title">📜 典故</div>' +
                '<div class="anim-text anim-fadeup anim-story">' + esc(story.replace(/^典故由來[：:]\s*/, '')) + '</div>',
          text: '', speak: speakText(story.replace(/^典故由來[：:]/, '')), minDur: 5200
        });
      }
      if (rest.length) {
        var h4 = '<div class="anim-lines">';
        rest.forEach(function (l, i) {
          h4 += '<div class="anim-line" style="animation-delay:' + (0.3 + i * 1.1) + 's">' + esc(l) + '</div>';
        });
        h4 += '</div>';
        scenes.push({ html: h4, text: '', speak: speakText(rest.join('。')), minDur: 3200 + rest.length * 1100 });
      }
    }

    // 5. 例句（逐字亮起）
    if (it.example) {
      var exChars = Array.from(it.example);
      var h5 = '<div class="anim-title">✏️ 例句</div><div class="anim-karaoke">';
      exChars.forEach(function (c, i) {
        var hl = it.example.indexOf(it.term) >= 0 &&
                 i >= it.example.indexOf(it.term) && i < it.example.indexOf(it.term) + chars.length;
        h5 += '<span class="anim-kchar' + (hl ? ' hl' : '') + '" style="animation-delay:' +
              (0.3 + i * 0.09) + 's">' + esc(c) + '</span>';
      });
      h5 += '</div>';
      scenes.push({ html: h5, text: '', speak: '例句：' + it.example, minDur: 2200 + exChars.length * 95 });
    }

    // 6. 結尾
    scenes.push({
      html: '<div class="anim-zirow anim-end">' + chars.map(function (c) {
              return '<div class="anim-zib"><div class="anim-zi">' + esc(c) + '</div></div>';
            }).join('') + '</div>' +
            '<div class="anim-endbtns">' +
              '<button class="anim-bigbtn" id="animReplay">🔁 再看一次</button>' +
              '<button class="anim-bigbtn alt" id="animDone">✅ 我學會了</button>' +
            '</div>',
      text: '', speak: '', minDur: 999999, end: true
    });
    return scenes;
  }

  function showScene(i) {
    var P = playing; if (!P) return;
    gen++; var myGen = gen;
    P.idx = i;
    var s = P.scenes[i];
    stage.innerHTML = '<div class="anim-scene">' + s.html + '</div>';
    sub.textContent = s.text || '';
    sub.style.display = s.text ? '' : 'none';
    if (s.end) {
      var rp = document.getElementById('animReplay');
      var dn = document.getElementById('animDone');
      if (rp) rp.addEventListener('click', function (ev) { ev.stopPropagation(); showScene(0); });
      if (dn) dn.addEventListener('click', function (ev) { ev.stopPropagation(); close(); });
    }

    var timeDone = false, speechDone = !(voiceOn && TTS && s.speak);
    function tryNext() {
      if (gen !== myGen || !playing) return;
      if (timeDone && speechDone && i < P.scenes.length - 1 && !s.end) showScene(i + 1);
    }
    setTimeout(function () { timeDone = true; tryNext(); }, s.minDur);
    if (voiceOn && TTS && s.speak) {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(s.speak);
      if (zhVoice) u.voice = zhVoice;
      u.lang = 'zh-TW'; u.rate = 0.92;
      var done = function () { if (speechDone) return; speechDone = true; setTimeout(tryNext, 700); };
      u.onend = done; u.onerror = done;
      setTimeout(done, s.minDur + 20000); // 保險絲
      speechSynthesis.speak(u);
    }
  }

  function skip() {
    var P = playing; if (!P) return;
    var s = P.scenes[P.idx];
    if (s && s.end) return;
    if (TTS) speechSynthesis.cancel();
    if (P.idx < P.scenes.length - 1) showScene(P.idx + 1);
  }

  function close() {
    gen++;
    playing = null;
    if (TTS) speechSynthesis.cancel();
    if (overlay) overlay.classList.remove('show');
    document.body.classList.remove('anim-lock');
  }

  function play(item, opts) {
    if (!item || !item.term) return;
    buildDom();
    voiceBtn.textContent = voiceOn ? '🔊 語音' : '🔇 語音';
    playing = { item: item, scenes: buildScenes(item, (opts && opts.phon) || 'zhuyin'), idx: 0 };
    overlay.classList.add('show');
    document.body.classList.add('anim-lock');
    if (TTS) { var u = new SpeechSynthesisUtterance(''); speechSynthesis.speak(u); } // 解鎖行動裝置語音
    showScene(0);
  }

  window.IdiomAnim = { play: play, close: close };
})();
