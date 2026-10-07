export const COMPANIES=['동원약품','동원아이팜','아이팜코리아','동원헬스케어 본점','동원헬스케어 의정부','동원약품중부 본점','동원약품중부 아산','동원약품남부','동원약품강릉','동원약품제주'];
export const DEMO='체험용 데이터';
export function todayKorea(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
export function validQuantity(x:unknown){return typeof x==='number'&&Number.isSafeInteger(x)&&x>=0&&x<=1000000000}
export function parseCsv(text:string){const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;const t=text.replace(/^\uFEFF/,'');for(let i=0;i<t.length;i++){const c=t[i];if(c==='"'){if(quoted&&t[i+1]==='"'){cell+='"';i++}else if(quoted||cell==='')quoted=!quoted;else throw new Error('따옴표 형식이 올바르지 않습니다.')}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&t[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=''}else cell+=c}if(quoted)throw new Error('닫히지 않은 따옴표가 있습니다.');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);return rows}
export function csvCell(v:unknown){let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}
