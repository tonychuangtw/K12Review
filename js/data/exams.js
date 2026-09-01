/* 歷屆學測索引（2026-08-31 建）
   每一卷的題目放在 js/data/exam/<年>-<科>.js，進到那一卷才動態載入。
   題目原文取自大考中心公開釋出的歷屆試題，題號與原卷相同；解析為本站自撰。
   欄位：id / year（民國年）/ subj（chinese english matha mathb math social science）
        n（本站收錄題數）/ max（本站滿分＝收錄題目的配分總和）/ mins（原卷作答時間） */
window.APP_EXAMS = [
  { id: '115-chinese', year: 115, subj: 'chinese', n: 33, max: 80, mins: 90 },
  { id: '115-english', year: 115, subj: 'english', n: 46, max: 64, mins: 100 }
];
