/* Shared: mobile menu toggle */
{
const b=document.getElementById("menuBtn"),n=document.getElementById("nav");
if(b&&n){
const set=o=>{n.classList.toggle("open",o);b.setAttribute("aria-expanded",o)};
b.addEventListener("click",()=>set(!n.classList.contains("open")));
n.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
addEventListener("keydown",e=>{if(e.key==="Escape")set(false)});
}
}
