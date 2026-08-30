const fs=require('fs'),path=require('path');
global.window={};['science','social','english','math','civics','geography','history','physics','chemistry','biology','earth'].forEach(s=>require(path.resolve('js/data',s+'.js')));
const D=window.APP_DATA,W={};Object.keys(D).forEach(k=>Array.isArray(D[k])&&D[k].forEach(it=>{if(it&&it.id)W[it.id]=it}));
JSON.parse(fs.readFileSync(process.argv[2],'utf8')).forEach(p=>{
 const it=W[p.id];if(!it)return console.log('✗ '+p.id);
 const cl=String(it.options[it.answer]).length;
 const mx=p.d?Math.max(...p.d.map(x=>x.length)):p.one.length;
 if(mx<cl-3)console.log(p.id+' 差 '+(cl-3-mx)+"字（現 "+mx+"，需 "+(cl-3)+'）');
});
console.log('--- 檢查完畢');
