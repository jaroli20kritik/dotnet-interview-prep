/* Hinglish word tooltips: hover a word for 2 s (mouse) or press and hold ~0.6 s (touch). */
{
const G=window.GLOSSARY||{},HOVER_MS=2000,HOLD_MS=600;
const tip=document.createElement("div");tip.className="wtip";tip.setAttribute("role","tooltip");tip.hidden=true;document.body.appendChild(tip);
const WC=/[A-Za-z0-9#+._'’-]/;
function lookup(raw){let w=raw.toLowerCase().replace(/[’]/g,"'").replace(/^[._'-]+|[._'-]+$/g,"");if(!w)return null;
const c=[w,w.replace(/'s$/,"")];const parts=w.split(".");if(parts.length>1)c.push(parts[0],parts[parts.length-1]);
for(const b of [...c]){c.push(b.replace(/ies$/,"y"),b.replace(/es$/,""),b.replace(/s$/,""),b.replace(/ed$/,""),b.replace(/ed$/,"e"),b.replace(/d$/,""),b.replace(/ing$/,""),b.replace(/ing$/,"e"),b.replace(/ly$/,""))}
for(const k of c)if(k&&Object.prototype.hasOwnProperty.call(G,k))return {k,m:G[k]};return null}
function wordAt(x,y){let node,off;
if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(!p)return null;node=p.offsetNode;off=p.offset}
else if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(!r)return null;node=r.startContainer;off=r.startOffset}else return null;
if(!node||node.nodeType!==3)return null;const el=node.parentElement;if(!el||el.closest("input,textarea,.wtip"))return null;
const t=node.data;let a=off,b=off;while(a>0&&WC.test(t[a-1]))a--;while(b<t.length&&WC.test(t[b]))b++;if(a===b)return null;
const r=document.createRange();r.setStart(node,a);r.setEnd(node,b);const rect=[...r.getClientRects()].find(q=>x>=q.left-1&&x<=q.right+1&&y>=q.top-1&&y<=q.bottom+1);
if(!rect)return null;return {word:t.slice(a,b),rect}}
function show(hit,res){tip.innerHTML="";const b=document.createElement("b");b.textContent=hit.word.replace(/^[._'-]+|[._'-]+$/g,"");const s=document.createElement("span");s.textContent=res.m;tip.append(b,s);tip.hidden=false;
const r=hit.rect,tw=tip.offsetWidth,th=tip.offsetHeight,vw=innerWidth;let left=Math.min(Math.max(8,r.left+r.width/2-tw/2),vw-tw-8);let top=r.top-th-10;let below=false;if(top<8){top=r.bottom+10;below=true}
tip.style.left=left+"px";tip.style.top=top+"px";tip.classList.toggle("below",below);tip.style.setProperty("--ax",(r.left+r.width/2-left)+"px")}
function hide(){tip.hidden=true;cur=null;clearTimeout(timer)}
let timer=null,cur=null,raf=0,lastX=0,lastY=0,holding=false,startX=0,startY=0;
function check(x,y){const hit=wordAt(x,y);const key=hit?hit.word+"@"+Math.round(hit.rect.left)+","+Math.round(hit.rect.top):null;
if(key===cur)return;cur=key;tip.hidden=true;clearTimeout(timer);if(!hit)return;const res=lookup(hit.word);if(!res)return;
timer=setTimeout(()=>{const again=wordAt(lastX,lastY);if(again&&again.word===hit.word)show(again,res)},HOVER_MS)}
document.addEventListener("pointermove",e=>{if(e.pointerType==="mouse"){lastX=e.clientX;lastY=e.clientY;if(!raf)raf=requestAnimationFrame(()=>{raf=0;check(lastX,lastY)})}
else if(holding&&Math.hypot(e.clientX-startX,e.clientY-startY)>10){holding=false;clearTimeout(timer)}},{passive:true});
document.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse")return;if(!tip.hidden&&!e.target.closest(".wtip"))hide();
holding=true;startX=lastX=e.clientX;startY=lastY=e.clientY;clearTimeout(timer);
timer=setTimeout(()=>{if(!holding)return;const hit=wordAt(startX,startY);if(!hit)return;const res=lookup(hit.word);if(!res)return;
try{getSelection().removeAllRanges()}catch(_){}show(hit,res);suppress=true},HOLD_MS)},{passive:true});
let suppress=false;
document.addEventListener("pointerup",()=>{holding=false;if(tip.hidden)clearTimeout(timer)});
document.addEventListener("pointercancel",()=>{holding=false});
document.addEventListener("contextmenu",e=>{if(suppress){e.preventDefault();suppress=false}});
document.addEventListener("selectionchange",()=>{if(suppress)try{getSelection().removeAllRanges()}catch(_){}});
document.addEventListener("mouseleave",hide);addEventListener("scroll",()=>{if(!tip.hidden)hide()},{passive:true});addEventListener("keydown",e=>{if(e.key==="Escape")hide()});
}
