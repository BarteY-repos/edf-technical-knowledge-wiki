// Shared runtime for the R193 static multi-page EDF research wiki.
// Independent article content is already in HTML: JS is for discoverability,
// filters, on-demand full-text search and legacy link compatibility only.
(() => {
 'use strict';
 const cfg=window.EDF_SITE||{prefix:'',article:'docs-home'};
 const prefix=cfg.prefix||'';
 const $=s=>document.querySelector(s);
 const q=$('#q'),nav=$('#nav'),out=$('#out'),searchResults=$('#searchResults'),domain=$('#domain'),version=$('#version'),evidence=$('#evidence');
 const topicNames=['File Formats','Shaders','Models','Textures','Animation','Audio','Maps','Collision & Physics','Navigation','Missions','Scripting','Networking','Gameplay & AI','Resource Loading','Performance','Conversion','Troubleshooting'];
 const groups=['Universal','EDF 4.1','EDF 5','EDF 6','Conversion'];
 const aliases={
  'edf5-online-crate-spawn-pickup-protocol-end-to-end-states':'edf5-online-crate-pickup-types-host-dedup-remote-mark',
  'edf5-online-crate-reward-counters-1024-and-result-timing':'edf5-online-pickup-counters-1024-cap-and-end-results',
  'edf5-bvm-original-source-corpus-335-files-shipping-141':'missions-&-scripting-mission-corpus-scope-corrected-final-classification',
  'edf5-bvm-original-event-graph-registrations-target-counters':'missions-&-scripting-event-registration-scheduling-and-state',
  'edf5-bvm-source-void-opcodes-stack-switch-and-voice':'missions-&-scripting-source-void-and-ordering-rules-do-not-regress'
 };
 const escape=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 const pathOf=a=>(a.id==='docs-home'?'index.html':a.path);
 const href=a=>a.id===cfg.article?'#article-start':prefix+pathOf(a);
 const versions=a=>['EDF 4.1','EDF 5','EDF 6'].filter(v=>(a.versions||[]).join(' / ').includes(v));
 const matchesVersion=a=>{const v=version.value;if(!v)return true;if(v==='Universal'||v==='Conversion')return a.scope===v;return versions(a).includes(v)};
 const matches=a=>matchesVersion(a)&&(!domain.value||a.topic===domain.value)&&(!evidence.value||(a.evidence||'').toLowerCase().includes(evidence.value.toLowerCase()));
 let catalog=[],searchCorpus=null,searchPromise=null,lastSearchSerial=0;

 function link(a,featured=false){return '<a class="docnav '+(featured?'featured ':'')+(a.id===cfg.article?'active':'')+'" href="'+escape(href(a))+'">'+escape(a.title)+'</a>'}
 function group(name,list,key){if(!list.length)return '';
  const open=new Set([...nav.querySelectorAll('details[open][data-key]')].map(x=>x.dataset.key));
  return '<details data-key="'+escape(key)+'" '+(open.has(key)?'open':'')+'><summary>'+escape(name)+' <span class="navcount">('+list.length+')</span></summary>'+list.map(a=>link(a)).join('')+'</details>';
 }
 function renderNav(){
  if(!catalog.length)return;
  const byId=new Map(catalog.map(x=>[x.id,x]));
  const docs=catalog.filter(x=>x.kind==='Documentation');
  const topicDoc=new Map(docs.filter(x=>x.topic!=='Start').map(x=>[x.topic,x]));
  let html='<div class="sectionheading">Documentation</div>';
  for(const id of ['docs-home','docs-universal','docs-edf41','docs-edf5','docs-edf6','docs-compatibility','docs-community-knowledge-hub']){
   const a=byId.get(id);if(a)html+=link(a,id==='docs-home'||id==='docs-community-knowledge-hub');
  }
  html+='<div class="sectionheading">Topics</div>';
  for(const name of topicNames){const a=topicDoc.get(name);if(a&&(!domain.value||domain.value===name))html+=link(a,true)}
  const fixed=new Set(['docs-home','docs-universal','docs-edf41','docs-edf5','docs-edf6','docs-compatibility','docs-community-knowledge-hub',...topicNames.map(x=>topicDoc.get(x)?.id)]);
  html+=group('More indexes',docs.filter(a=>!fixed.has(a.id)),'more-indexes');
  const references=catalog.filter(x=>x.kind==='Reference'&&matches(x));
  html+='<div class="sectionheading">Technical references <span class="navcount">('+references.length+')</span></div>';
  for(const g of groups)html+=group(g,references.filter(a=>a.scope===g).sort((x,y)=>x.title.localeCompare(y.title)),'ref-'+g);
  const research=catalog.filter(x=>x.kind==='Research'&&matches(x));
  html+='<div class="sectionheading">Research and case studies <span class="navcount">('+research.length+')</span></div>';
  const open=new Set([...nav.querySelectorAll('details[open][data-key]')].map(x=>x.dataset.key));
  html+='<details data-key="research" '+(open.has('research')||document.body.classList.contains('show-notes')?'open':'')+'><summary>Research appendices, grouped by game</summary>';
  for(const g of groups)html+=group(g,research.filter(a=>a.scope===g).sort((x,y)=>x.title.localeCompare(y.title)),'research-'+g);
  html+='</details><p><a class="docnav featured" href="'+prefix+'all-articles.html">All 581 articles</a></p>';
  nav.innerHTML='<nav aria-label="Documentation navigation">'+html+'</nav>';
 }
 function readLegacyHash(){
  const h=location.hash.slice(1);
  if(!h||h==='article-start')return;
  let decoded=h;try{decoded=decodeURIComponent(h)}catch(_e){}
  const [rawId,anchor,...other]=decoded.split('~');
  const id=aliases[rawId]||rawId;
  const entry=catalog.find(x=>x.id===id);
  if(other.length||!entry)return;
  if(id===cfg.article){if(anchor)location.replace('#'+encodeURIComponent(anchor));return}
  location.replace(prefix+pathOf(entry)+(anchor?'#'+encodeURIComponent(anchor):''));
 }
 function addFilterOptions(){
  const names=[...new Set(catalog.map(x=>x.topic).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  const core=document.createElement('optgroup');core.label='Core topics';
  for(const name of topicNames)core.append(new Option(name,name));domain.add(core);
  const extra=document.createElement('optgroup');extra.label='Specialist topics';
  for(const name of names.filter(x=>!topicNames.includes(x)))extra.append(new Option(name,name));
  domain.add(extra);
 }
 async function loadSearch(){
  if(searchCorpus)return searchCorpus;
  if(!searchPromise)searchPromise=fetch(prefix+'data/search-index.json').then(response=>{if(!response.ok)throw Error('HTTP '+response.status);return response.json()});
  searchCorpus=await searchPromise;
  return searchCorpus;
 }
 async function search(){
  const term=q.value.trim().toLowerCase(),serial=++lastSearchSerial;
  if(!term){searchResults.hidden=true;out.hidden=false;return}
  out.hidden=true;searchResults.hidden=false;
  searchResults.innerHTML='<h1>Search: '+escape(q.value.trim())+'</h1><p class="search-state" role="status">Loading search index…</p>';
  let corpus;
  try{corpus=await loadSearch()}catch(err){searchResults.innerHTML='<h1>Search unavailable</h1><p role="alert">The search index could not load. Use the article navigation or <a href="'+prefix+'all-articles.html">full article list</a>.</p>';return}
  if(serial!==lastSearchSerial)return;
  const texts=new Map(corpus.map(x=>[x.id,x.text]));
  const hits=catalog.filter(matches).map(a=>{
   const body=texts.get(a.id)||'',name=a.title.toLowerCase(),keywords=(a.keywords||[]).join(' ').toLowerCase();
   const index=body.indexOf(term),title=name.indexOf(term);
   let score=title===0?30:title>=0?24:keywords.includes(term)?18:index>=0?4:0;
   if(score>0&&a.kind==='Documentation')score+=10;
   return {a,body,index,score};
  }).filter(x=>x.score>0).sort((x,y)=>y.score-x.score||x.a.title.localeCompare(y.a.title));
  searchResults.innerHTML='<h1>Search: '+escape(q.value.trim())+'</h1><p class="searchnote" role="status">'+hits.length+' matching documentation pages and technical references. Exact topic pages appear first.</p>'+
   hits.map(({a,body,index})=>'<a class="hit" style="display:block;text-decoration:none;color:inherit" href="'+escape(href(a))+'"><div class="result-title">'+escape(a.title)+'</div><div class="kindlabel">'+escape(a.scope)+' · '+escape(a.topic)+' · '+escape(a.kind)+'</div><div class="snippet">'+escape(body.slice(Math.max(0,index-70),Math.max(0,index-70)+230))+'</div></a>').join('');
  searchResults.querySelectorAll('a.hit[href="#article-start"]').forEach(link=>link.addEventListener('click',()=>{q.value='';++lastSearchSerial;searchResults.hidden=true;out.hidden=false}));
 }
 q.addEventListener('input',search);
 [version,domain,evidence].forEach(el=>el.addEventListener('change',()=>{renderNav();if(q.value)search()}));
 document.addEventListener('keydown',event=>{
  const active=document.activeElement?.tagName||'';
  if((event.ctrlKey&&event.key.toLowerCase()==='k')||(event.key==='/'&&!['INPUT','TEXTAREA'].includes(active))){event.preventDefault();q.focus()}
  if(event.key==='Escape'&&document.activeElement===q){q.value='';search();q.blur()}
 });
 const notes=$('#notesToggle');
 notes.addEventListener('click',()=>{document.body.classList.toggle('show-notes');notes.setAttribute('aria-pressed',String(document.body.classList.contains('show-notes')));notes.textContent=document.body.classList.contains('show-notes')?'Hide research pages':'Research pages';renderNav()});
 $('#theme').addEventListener('click',()=>{document.body.classList.toggle('light');try{localStorage.setItem('edf-theme',document.body.classList.contains('light')?'light':'dark')}catch(_e){}});
 try{if(localStorage.getItem('edf-theme')==='light')document.body.classList.add('light')}catch(_e){}
 async function init(){
  try{
   const r=await fetch(prefix+'data/catalog.json');if(!r.ok)throw Error('HTTP '+r.status);
   catalog=await r.json();
   addFilterOptions();renderNav();readLegacyHash();
  }catch(err){nav.innerHTML='<p role="alert">Navigation metadata is unavailable. Open <a href="'+prefix+'all-articles.html">the complete article index</a>.</p>'}
 }
 function filterWeaponAtlas(){
  const root=document.getElementById('weapon-atlas-controls');if(!root)return;
  const query=(document.getElementById('weapon-atlas-search')?.value||'').trim().toLowerCase();
  const policy=document.getElementById('weapon-atlas-policy')?.value||'';
  const star=document.getElementById('weapon-atlas-star')?.checked||false;
  const rows=document.querySelectorAll('#weapon-atlas-table tbody tr[data-atlas]');let shown=0;
  for(const row of rows){const ok=(!query||row.dataset.find.includes(query))&&(!policy||row.dataset.policy.includes(policy))&&(!star||row.dataset.star==='1');row.hidden=!ok;if(ok)shown++}
  const count=document.getElementById('weapon-atlas-visible');if(count)count.textContent=shown.toLocaleString('en-US')+' / '+rows.length.toLocaleString('en-US');
 }
 document.addEventListener('input',event=>{if(['weapon-atlas-search','weapon-atlas-star'].includes(event.target?.id))filterWeaponAtlas()});
 document.addEventListener('change',event=>{if(event.target?.id==='weapon-atlas-policy')filterWeaponAtlas()});
 init();
})();
