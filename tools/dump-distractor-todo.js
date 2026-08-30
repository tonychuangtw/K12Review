/* 列出某一科還有哪些題目「正解比最長誘答多 6 字以上」（誘答重寫第三輪的待辦清單）
 * 用法：node tools/dump-distractor-todo.js <科目> [要印幾題]
 * 印出的 [誘答需≥N] 就是最長那個誘答至少要寫到幾個字。 */
global.window=global; const fs=require('path');
const p=process.argv[2], n=parseInt(process.argv[3]||'0');
require(require('path').join(__dirname,'..','js/data',p+'.js'));
const A=global.APP_DATA[p]||[];
const CJ=s=>(String(s).match(/[一-鿿]/g)||[]).length;
const j=A.filter(it=>{const L=it.options.map(x=>String(x).length),c=L[it.answer],m=Math.max(...L.filter((_,i)=>i!==it.answer));
if(c-m<6)return false;
return it.options.every((o,i)=>i===it.answer||CJ(o)>=3);});
console.log(p+' 剩 '+j.length);
j.slice(0,n).forEach(it=>{const L=it.options.map(x=>String(x).length);
console.log(it.id+' [誘答需≥'+(L[it.answer]-5)+'] '+it.q+'　✅ '+it.options[it.answer]+'　❌ '+it.options.map((o,i)=>i===it.answer?null:'('+String(o).length+')'+o).filter(Boolean).join(' / '));});
