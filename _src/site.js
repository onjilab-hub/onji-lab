function dd(s){return Math.floor((new Date(s+"T23:59:59+09:00")-new Date())/864e5)}
(function(){
function toast(t){var e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(function(){e.remove()},1600)}
function copy(text){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){toast("복사했어요")},function(){toast("길게 눌러 직접 복사해주세요")})}else toast("길게 눌러 직접 복사해주세요")}
document.addEventListener("click",function(e){var b=e.target.closest("[data-copy]");if(b){var c=b.parentNode.querySelector("code");if(c)copy(c.textContent.replace(/\n$/,""));return}
  var t=e.target.closest("[data-copytext]");if(t)copy(t.getAttribute("data-copytext"))});
var el=document.getElementById("data");if(!el)return;
var D=JSON.parse(el.textContent),cat="",q="",PAGE=30,shown=PAGE,grid=document.getElementById("grid"),more=document.getElementById("more"),empty=document.getElementById("empty");
var TONE={"AI 영상":"t1","AI 이미지":"t3","자동화":"t2","이커머스":"t4","음성":"t5","할인소식":"t6"};
function esc(s){return String(s||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function dl(e){if(e===undefined||e===null)return "";if(!e)return '<span class="dl">기한 미정</span>';var d=dd(e);return d<0?'<span class="dl end">마감</span>':'<span class="dl hot">'+(d===0?"D-DAY":"D-"+d)+'</span>'}
function card(g,n){var th=g.i?'<img src="'+esc(g.i)+'" alt="" width="76" height="76" decoding="async"'+(n<8?' fetchpriority="high"':' loading="lazy"')+'>':'<span class="lab '+(TONE[g.c]||"t1")+'">'+esc(g.l||g.c)+"</span>";
  var inner='<div class="thumb">'+th+'</div><div class="ctxt"><div class="cm"><span class="cat">'+esc(g.c)+"</span><span>"+esc(g.d)+"</span>"+(g.r?"":'<span class="soonb">옮기는 중</span>')+dl(g.e)+'</div><p class="ct">'+esc(g.t)+'</p></div>'+(g.r?'<span class="chev" aria-hidden="true">›</span>':"");
  return g.r?'<a class="card" href="'+esc(g.h)+'"'+(g.x?' target="_blank" rel="noopener"':"")+'>'+inner+"</a>":'<div class="card soon">'+inner+"</div>"}
function render(){var k=q.trim().toLowerCase(),L=D.slice().sort(function(a,b){return (a.e&&dd(a.e)<0?1:0)-(b.e&&dd(b.e)<0?1:0)}).filter(function(g){return (!cat||g.c===cat)&&(!k||(g.t+" "+g.u+" "+g.c+" "+g.l).toLowerCase().indexOf(k)>=0)});
  grid.innerHTML=L.slice(0,shown).map(function(g,n){return card(g,n)}).join("");
  var left=L.length-Math.min(shown,L.length);more.hidden=left<=0;more.textContent="더 보기 ("+left+")";empty.hidden=L.length>0}
document.querySelectorAll(".tile").forEach(function(c){c.addEventListener("click",function(){cat=c.getAttribute("data-cat");shown=PAGE;document.querySelectorAll(".tile").forEach(function(x){x.setAttribute("aria-pressed",x===c?"true":"false")});render()})});
document.getElementById("q").addEventListener("input",function(e){q=e.target.value;shown=PAGE;render()});
more.addEventListener("click",function(){shown+=PAGE;render()});
render();
})();

document.querySelectorAll("[data-until]").forEach(function(el){var u=el.getAttribute("data-until"),d=dd(u);el.textContent=d<0?"마감된 혜택이에요":(el.textContent+" · "+(d===0?"D-DAY":"D-"+d));if(d<0)el.classList.add("end")});
