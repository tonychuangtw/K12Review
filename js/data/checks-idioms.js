/* 解析確認題（idioms）：看完解析後再問一題，確認他真的讀懂解析。
 * 格式：id → { q: 題目, o: [4 個選項], a: 正解索引 }
 *   · 題目一定要答案就在剛剛看過的解析裡（不能靠背原題答案猜）
 *   · 答錯 ⇒ 原題重新排入錯題本（複習日拉到隔天、連對次數歸零），不另外生成新錯題
 * 逐條人工撰寫（不可交 subagent 量產），改完跑 node test/test.js
 */
window.APP_CHECKS = Object.assign(window.APP_CHECKS || {}, {
});
