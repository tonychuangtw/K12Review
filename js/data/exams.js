/* 歷屆學測索引（2026-08-31 建）
   每一卷的題目放在 js/data/exam/<年>-<科>.js，進到那一卷才動態載入。
   題目原文取自大考中心公開釋出的歷屆試題，題號與原卷相同；解析為本站自撰。
   欄位：id / year（民國年）/ subj（chinese english matha mathb math social science）
        n（本站收錄題數）/ max（本站滿分＝收錄題目的配分總和）/ mins（原卷作答時間） */
window.APP_EXAMS = [
  { id: '115-chinese', year: 115, subj: 'chinese', n: 33, max: 80, mins: 90 },
  { id: '115-english', year: 115, subj: 'english', n: 47, max: 66, mins: 100 },
  { id: '115-social', year: 115, subj: 'social', n: 53, max: 106, mins: 110 },
  { id: '114-chinese', year: 114, subj: 'chinese', n: 33, max: 80, mins: 90 },
  { id: '114-english', year: 114, subj: 'english', n: 47, max: 66, mins: 100 },
  { id: '114-social', year: 114, subj: 'social', n: 54, max: 108, mins: 110 },
  { id: '113-chinese', year: 113, subj: 'chinese', n: 33, max: 80, mins: 90 },
  { id: '113-english', year: 113, subj: 'english', n: 47, max: 66, mins: 100 }
];
