window.APP_DATA = window.APP_DATA || {};
// 全科架構（2026-08-03 Tony 定案）：進站先選年級+科目；國語以外先有架構、題庫後補。
// APP_SUBJECTS 順序即首頁科目卡順序；ready=false 的科目顯示「題庫建置中」。
window.APP_SUBJECTS = [
  { key: 'chinese', name: '國語', icon: '📖', ready: true,  desc: '成語・俚語・字音・字形・閱讀' },
  { key: 'english', name: '英文', icon: '🔤', ready: true,  desc: '一年級～十二年級・文法／字彙／閱讀／寫作' },
  { key: 'math',    name: '數學', icon: '🔢', ready: true,  desc: '一年級～十二年級・數與量／代數／幾何／統計' },
  { key: 'science', name: '自然', icon: '🔬', ready: true,  desc: '三年級～九年級・生物／理化／地科' },
  { key: 'social',  name: '社會', icon: '🌏', ready: true,  desc: '三年級～九年級・地理／歷史／公民' },
  // 高中分科（Tony 2026-08-20 定案「高中要拆」）：自然拆成物理/化學/生物/地科，
  // 社會拆成歷史/地理/公民與社會。國中維持「自然」「社會」領域合科。
  { key: 'physics',   name: '物理',     icon: '⚛️', ready: true, desc: '高中・力學／波動／電磁／近代物理' },
  { key: 'chemistry', name: '化學',     icon: '🧪', ready: true, desc: '高中・原子／鍵結／反應／有機' },
  { key: 'biology',   name: '生物',     icon: '🧬', ready: true, desc: '高中・細胞／遺傳／生理／生態' },
  { key: 'earth',     name: '地球科學', icon: '🌎', ready: true, desc: '高中・地質／大氣／海洋／天文' },
  { key: 'history',   name: '歷史',     icon: '📜', ready: true, desc: '高中・臺灣史／東亞史／世界史' },
  { key: 'geography', name: '地理',     icon: '🗺️', ready: true, desc: '高中・通論地理／區域地理／專題' },
  { key: 'civics',    name: '公民與社會', icon: '⚖️', ready: true, desc: '高中・社會／政治／法律／經濟' }
];
// 非國語科目題庫（先空著）。schema（選擇題，比照 custom）：
// { id:"e001"(英)/"m001"(數)/"n001"(自)/"o001"(社), grade:1-12, book:"五上", lesson:"第1課",
//   q:"題目文字", options:["A","B","C","D"], answer:0, exp:"解說" }
// 各科題庫都在自己的檔案（都在這支之後載入）：
//   國語 idioms/slang/phonics/chars/reading + custom
//   英文 english.js / english-custom.js　數學 math.js / math-custom.js
//   自然 science.js / science-custom.js　社會 social.js / social-custom.js
