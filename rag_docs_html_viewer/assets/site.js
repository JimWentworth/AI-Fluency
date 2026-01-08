
async function loadJSON(path){
  const res = await fetch(path, {cache:"no-store"});
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function el(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === "class") n.className = v;
    else if(k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  for(const c of children){
    if(typeof c === "string") n.appendChild(document.createTextNode(c));
    else if(c) n.appendChild(c);
  }
  return n;
}

function norm(s){ return (s||"").toLowerCase(); }

function buildDocList(docs){
  const list = document.getElementById("docList");
  if(!list) return;
  list.innerHTML = "";
  for(const d of docs){
    const a = el("a", {href:`../${d.path}`, class:"docitem", "data-slug": d.slug});
    a.appendChild(el("div", {class:"docname"}, [d.title]));
    a.appendChild(el("div", {class:"docfile"}, [d.filename]));
    list.appendChild(a);
  }
  // highlight current, if on a doc page
  if(window.__CURRENT__){
    const cur = list.querySelector(`a[data-slug="${window.__CURRENT__}"]`);
    if(cur) cur.classList.add("active");
  }
}

function attachHTMLToggles(){
  document.querySelectorAll(".notice [data-toggle]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const wrap = btn.closest("article, .doc-body")?.querySelector(".html-dual");
      if(!wrap) return;
      const mode = btn.getAttribute("data-toggle");
      wrap.setAttribute("data-mode", mode);
      const buttons = btn.parentElement.querySelectorAll("button");
      buttons.forEach(b=>b.setAttribute("aria-pressed", String(b===btn)));
    });
  });
}

function renderSearch(results){
  const box = document.getElementById("searchResults");
  if(!box) return;
  box.innerHTML = "";
  if(results.length === 0){
    box.classList.remove("show");
    return;
  }
  for(const r of results.slice(0, 8)){
    const a = el("a", {href: `../docs/${r.slug}.html`, role:"option"});
    a.appendChild(el("div", {style:"font-weight:700"}, [r.title]));
    a.appendChild(el("div", {style:"font-size:12px; opacity:.75"}, [r.filename]));
    box.appendChild(a);
  }
  box.classList.add("show");
}

async function setupSearch(){
  const input = document.getElementById("q");
  if(!input) return;
  const index = await loadJSON("../assets/search.json");
  input.addEventListener("input", ()=>{
    const q = norm(input.value).trim();
    if(q.length < 2){ renderSearch([]); return; }
    const hits = [];
    for(const d of index){
      const hay = norm(d.title + " " + d.filename + " " + d.text);
      if(hay.includes(q)) hits.push({slug:d.slug, title:d.title, filename:d.filename});
    }
    renderSearch(hits.slice(0, 30));
  });
  input.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){ input.value=""; renderSearch([]); input.blur(); }
  });
  document.addEventListener("click", (e)=>{
    const box = document.getElementById("searchResults");
    if(!box) return;
    if(!box.contains(e.target) && e.target !== input){
      box.classList.remove("show");
    }
  });
}

async function init(){
  try{
    const docs = await loadJSON("../assets/manifest.json");
    buildDocList(docs);
    await setupSearch();
    attachHTMLToggles();
  }catch(err){
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", init);
