{
/* ===== APP ===== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const ROAD=window.ROAD,DAYS=window.DAYS,WEAK=window.WEAK;
let marks=store.get("np45marks",{}),showHi=store.get("np45hi",true);
const latest=Math.max(...Object.keys(DAYS).map(Number));
let view="today",day=latest,tab="qa",filt="all",open={};
const pct=Math.round(latest/45*100);
$("#pt").textContent="Day "+latest+" of 45";$("#pb").style.width=Math.max(pct,2)+"%";$("#pp").textContent=pct+"%";

function side(){let h="",w="";for(const [n,wk,t] of ROAD){if(wk!==w){w=wk;h+=`<div class="wk">${esc(wk)}</div>`}
const has=DAYS[n];h+=has?`<a class="dl${view==="today"&&day===n?" on":""}" href="#day-${n}"><span>Day ${n} · ${esc(t)}</span></a>`:`<div class="dl lock"><span>Day ${n} · ${esc(t)}</span><small>soon</small></div>`}
$("#side").innerHTML=h}
function codeBlock(c){return `<div class="code"><pre><code>${esc(c)}</code></pre><button data-copy>Copy</button></div>`}
function qCard(q,i,d){const id=d+"-"+i,m=marks[id],isOpen=open[id]??(i===0);
return `<article class="card q"><button class="qh" data-open="${id}" aria-expanded="${isOpen}"><span class="n">Q${i+1}</span><span class="t">${esc(q.t)}</span>${q.s?'<span class="tag">Scenario</span>':""}${m==="ok"?'<span class="tag ok">Understood</span>':m==="rv"?'<span class="tag rv">Review</span>':""}</button>
${isOpen?`<div class="qb"><div class="box en"><div class="lbl">Interview answer · English</div><p>${esc(q.a)}</p></div>
<div class="box hi"><div class="lbl">Samjho · Hinglish</div><p>${esc(q.h)}</p></div>
${q.c?codeBlock(q.c):""}
<div class="two"><div><div class="lbl" style="color:var(--mut)">Follow-up questions</div><ul>${q.f.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="tip"><div class="lbl">Interview tip</div>${esc(q.tip)}</div></div>
<div class="act"><button class="btn${m==="ok"?" pri":""}" data-mark="${id}|ok">Mark as understood</button><button class="btn${m==="rv"?" pri":""}" data-mark="${id}|rv">Review later</button></div></div>`:""}</article>`}
function dayView(){const D=DAYS[day];const tabs=[["concepts","Concepts"],["qa","Q&A · "+D.qa.length],["coding","Coding · "+D.coding.length],["sql","SQL (DB2) · "+D.sql.items.length],["turn","Your turn · "+D.yourTurn.length],["rev","Revision"]];
let body="";
if(tab==="concepts")body=`<div class="card sec">${D.concepts}</div>`;
if(tab==="qa"){const list=D.qa.map((q,i)=>[q,i]).filter(([q,i])=>filt==="all"||(filt==="sc"&&q.s)||(filt==="rv"&&marks[day+"-"+i]==="rv"));
body=`<div class="tools"><div class="pills">${[["all","All"],["sc","Scenario"],["rv","Review later"]].map(([k,l])=>`<button class="pill${filt===k?" on":""}" data-f="${k}">${l}</button>`).join("")}</div><label class="tg"><input type="checkbox" id="hiT"${showHi?" checked":""}> Show Hinglish explanations</label></div>
<div class="${showHi?"":"hideHi"}" style="display:flex;flex-direction:column;gap:10px">${list.length?list.map(([q,i])=>qCard(q,i,day)).join(""):'<div class="card empty">Nothing here yet.</div>'}</div>`}
if(tab==="coding")body=D.coding.map(c=>`<div class="card sec"><h2>${esc(c.t)}</h2><p>${c.p}</p><details><summary>Hint (Hinglish)</summary><p class="note">${c.hint}</p></details>${c.sol?`<details><summary>Solution</summary>${c.sol}</details>`:'<p class="note">Attempt it yourself first. The solution is added after the practice round.</p>'}</div>`).join("");
if(tab==="sql")body=`<div class="card sec"><h2>Table used today</h2>${codeBlock(D.sql.schema)}</div>`+D.sql.items.map(s=>`<div class="card sec"><h2>${esc(s.t)}</h2><p>${esc(s.p)}</p>${s.sol?`<details><summary>Solution</summary>${s.sol}</details>`:'<p class="note">Write it in DB2 syntax first. The solution is added after the practice round.</p>'}</div>`).join("");
if(tab==="turn")body=`<div class="card sec"><h2>Test yourself</h2><p class="note">Answer out loud or on paper before checking the Q&amp;A tab.</p><ol>${D.yourTurn.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>`;
if(tab==="rev")body=`<div class="card sec"><h2>Quick revision</h2><ul>${D.revision.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`;
$("#main").innerHTML=`<div style="display:flex;flex-direction:column;gap:10px"><div class="kick">${esc(D.week)}</div><h1>Day ${day} — ${esc(D.title)}</h1><div class="chips">${D.chips.map(c=>`<span class="chip">${esc(c)}</span>`).join("")}</div></div>
<div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button role="tab" aria-selected="${tab===k}" class="${tab===k?"on":""}" data-tab="${k}">${esc(l)}</button>`).join("")}</div>${body}`}
function roadView(){let rows="";for(const [n,wk,t] of ROAD){const D=DAYS[n];let ok=0,tot=0;if(D){tot=D.qa.length;ok=D.qa.filter((q,i)=>marks[n+"-"+i]==="ok").length}
rows+=`<tr><td>${n}</td><td>${esc(wk)}</td><td>${D?`<a href="#day-${n}">${esc(t)}</a>`:esc(t)}</td><td>${D?ok+" / "+tot+" understood":"Upcoming"}</td></tr>`}
$("#main").innerHTML=`<h1>45-day roadmap</h1><p class="note">New days are added as the preparation progresses.</p><div class="card scroll"><table class="stack"><thead><tr><th>Day</th><th>Block</th><th>Topic</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`}
function weakView(){const rv=[];for(const d in DAYS)DAYS[d].qa.forEach((q,i)=>{if(marks[d+"-"+i]==="rv")rv.push([d,i,q])});
$("#main").innerHTML=`<h1>Weak areas</h1>
<div class="card sec"><h2>Known weak areas</h2>${WEAK.length?`<ul>${WEAK.map(w=>`<li>${esc(w)}</li>`).join("")}</ul>`:'<p class="note">Nothing listed yet.</p>'}</div>
<div class="card sec"><h2>Marked "review later" on this device</h2>${rv.length?`<ul>${rv.map(([d,i,q])=>`<li><a href="#day-${d}" data-goq="${d}-${i}">Day ${d} · Q${i+1}</a> — ${esc(q.t)}</li>`).join("")}</ul>`:'<p class="note">No questions marked yet.</p>'}</div>`}
function searchView(){$("#main").innerHTML=`<h1>Search</h1><input type="search" id="sq" placeholder="Search all questions, e.g. boxing, DB2, StringBuilder" aria-label="Search questions"><div id="sr" style="display:flex;flex-direction:column;gap:10px"></div>`;
const run=()=>{const v=$("#sq").value.trim().toLowerCase();const out=[];if(v)for(const d in DAYS)DAYS[d].qa.forEach((q,i)=>{if((q.t+" "+q.a+" "+q.h).toLowerCase().includes(v))out.push(`<a class="card dl" href="#day-${d}" data-goq="${d}-${i}" style="padding:14px 16px"><span><b>Day ${d} · Q${i+1}</b> — ${esc(q.t)}</span></a>`)});
$("#sr").innerHTML=v?(out.join("")||'<div class="card empty">No matches.</div>'):""};$("#sq").addEventListener("input",run);$("#sq").focus()}
function render(){document.querySelectorAll("#nav a").forEach(a=>a.classList.toggle("on",a.dataset.v===view));side();
({today:dayView,roadmap:roadView,weak:weakView,search:searchView})[view]()}
function route(){const h=location.hash.slice(1);const m=h.match(/^day-(\d+)$/);
if(m&&DAYS[+m[1]]){view="today";if(day!==+m[1]){day=+m[1];tab="qa"}}else if(["roadmap","weak","search"].includes(h))view=h;else{view="today";day=latest}
render();$("#side").classList.remove("open")}
document.addEventListener("click",e=>{const t=e.target.closest("button,a");if(!t)return;
if(t.dataset.tab){tab=t.dataset.tab;render()}
else if(t.dataset.f){filt=t.dataset.f;render()}
else if(t.dataset.open){const id=t.dataset.open,i=+id.split("-")[1];open[id]=!(open[id]??(i===0));render()}
else if(t.dataset.mark){const [id,v]=t.dataset.mark.split("|");marks[id]=marks[id]===v?undefined:v;store.set("np45marks",marks);render()}
else if(t.dataset.goq){const [d,i]=t.dataset.goq.split("-");tab="qa";filt="all";open[d+"-"+i]=true;day=+d;view="today";render()}
else if(t.hasAttribute("data-copy")){const c=t.previousElementSibling.textContent;try{navigator.clipboard.writeText(c).then(()=>{t.textContent="Copied";setTimeout(()=>t.textContent="Copy",1500)},()=>{})}catch(err){}}
else if(t.id==="sideBtn"){$("#side").classList.toggle("open")}});
document.addEventListener("change",e=>{if(e.target.id==="hiT"){showHi=e.target.checked;store.set("np45hi",showHi);render()}});
const mq=matchMedia("(max-width:860px)");const sb=()=>{$("#sideBtn").style.display=mq.matches?"block":"none"};mq.addEventListener("change",sb);sb();
addEventListener("hashchange",route);route();
}
