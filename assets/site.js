// Shared runtime for the R193 static multi-page EDF research wiki.
// Independent article content is already in HTML: JS is for discoverability,
// filters, on-demand full-text search and legacy link compatibility only.
(() => {
 'use strict';
 const cfg=window.EDF_SITE||{prefix:'',article:'docs-home'};
 const prefix=cfg.prefix||'';
 const $=s=>document.querySelector(s);
 const q=$('#q'),nav=$('#nav'),out=$('#out'),searchResults=$('#searchResults'),domain=$('#domain'),version=$('#version'),evidence=$('#evidence');
 // Keep the full navigation as a no-JavaScript fallback. On narrow screens,
 // progressively enhance it with an accessible, collapsible topic selector.
 const sidebar=nav?.closest?.('aside');
 let mobileNavToggle=null;
 if(sidebar&&q){
  sidebar.id='reader-sidebar';
  mobileNavToggle=document.createElement('button');
  mobileNavToggle.id='mobileNavToggle';
  mobileNavToggle.type='button';
  mobileNavToggle.setAttribute('aria-controls',sidebar.id);
  mobileNavToggle.setAttribute('aria-expanded','false');
  mobileNavToggle.textContent='Browse topics';
  q.parentNode.insertBefore(mobileNavToggle,q);
  document.body.classList.add('mobile-nav-ready');
  const setMobileNav=open=>{
   document.body.classList.toggle('mobile-nav-open',open);
   mobileNavToggle.setAttribute('aria-expanded',String(open));
   mobileNavToggle.textContent=open?'Hide topics':'Browse topics';
  };
  mobileNavToggle.addEventListener('click',()=>setMobileNav(!document.body.classList.contains('mobile-nav-open')));
  nav.addEventListener('click',event=>{
   if(event.target.closest('a[href="#article-start"]'))setMobileNav(false);
  });
  document.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&document.body.classList.contains('mobile-nav-open')){
    setMobileNav(false);
    mobileNavToggle.focus();
   }
  });
 }
 // R207: keep original claim-level credits available without repeating them in every reading path.
 function compactClaimCredits(){
  const article=$('#out article');
  if(!article)return;
  const rows=[...article.querySelectorAll('#articleBody p')].filter(p=>{
   const first=p.firstElementChild;
   return first?.tagName==='STRONG' && /^Attribution:\s*$/i.test(first.textContent.trim()) && /^Attribution:\s*/i.test(p.textContent.trim());
  });
  for(const p of rows)p.classList.add('claim-credit');
  if(rows.length)document.body.classList.add('credits-collapsed');
  if(cfg.article==='materials-used')return;
  const footer=document.createElement('footer');
  footer.className='materials-footer';
  const blurb=document.createElement('p');
  blurb.innerHTML='Sources and acknowledgments: <a href="'+prefix+'materials-used.html">Materials used</a>.';
  footer.appendChild(blurb);
  if(rows.length){
   const toggle=document.createElement('button');
   toggle.type='button';
   toggle.className='credits-toggle';
   toggle.setAttribute('aria-pressed','false');
   toggle.textContent='Show claim credits';
   toggle.addEventListener('click',()=>{
    const visible=document.body.classList.toggle('credits-collapsed');
    toggle.textContent=visible?'Show claim credits':'Hide claim credits';
    toggle.setAttribute('aria-pressed',String(!visible));
   });
   footer.appendChild(toggle);
  }
  article.appendChild(footer);
 }
 compactClaimCredits();
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
  html+='<a class="docnav featured '+(cfg.article==='materials-used'?'active':'')+'" href="'+prefix+'materials-used.html">Materials used</a>';
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
  html+='</details><p><a class="docnav featured" href="'+prefix+'all-articles.html">All 595 articles</a></p>';
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
  try{corpus=await loadSearch()}catch(err){
   if(serial!==lastSearchSerial)return;
   searchResults.innerHTML='<h1>Search unavailable</h1><p role="alert">The search index could not load. Use the article navigation or <a href="'+prefix+'all-articles.html">full article list</a>.</p>';
   return;
  }
  if(serial!==lastSearchSerial)return;
  // AND across query words, but allow each word to occur in a different field.
  // Keep punctuation in technical names (g_mass, Texture2DArray, R×A, FOG_FADE).
  const terms=[...new Set(term.split(/\s+/u).filter(Boolean))];
  // A single explicit game edition is a ranking intent, not a hard filter:
  // cross-generation/conversion findings must still remain discoverable.
  const editions=[...new Set([...term.matchAll(/\bedf\s*(4\.1|5|6)\b/gu)].map(match=>'EDF '+match[1]))];
  const requestedEdition=editions.length===1?editions[0]:null;
  const hasSubjectBeyondEdition=Boolean(term.replace(/\bedf\s*(?:4\.1|5|6)\b/gu,'').trim());
  const texts=new Map(corpus.map(x=>[x.id,x.text]));
  const hits=catalog.filter(matches).map(a=>{
   const body=texts.get(a.id)||'',name=a.title.toLowerCase(),keywords=(a.keywords||[]).join(' ').toLowerCase();
   if(!terms.every(word=>name.includes(word)||keywords.includes(word)||body.includes(word)))return {a,body,index:-1,score:0};
   const phraseIndex=body.indexOf(term);
   let score=name===term?80:name.startsWith(term)?50:name.includes(term)?35:keywords.includes(term)?25:phraseIndex>=0?12:0;
   for(const word of terms){
    if(name.startsWith(word))score+=22;
    else if(name.includes(word))score+=16;
    else if(keywords.includes(word))score+=10;
    else score+=2;
   }
   // Prefer articles in an explicitly named subject over incidental mentions
   // in unrelated research notes (e.g. "shaders" inside a map LOD note).
   const topic=(a.topic||'').toLowerCase();
   const topicWords=topic.split(/[^a-z0-9]+/u).filter(Boolean);
   if(terms.some(word=>word.length>=4&&topicWords.some(t=>t.length>=4&&
    (word===t||word.replace(/s$/u,'')===t.replace(/s$/u,'')))))score+=20;
   if(a.kind==='Documentation')score+=8;
   if(requestedEdition){
    if(a.scope===requestedEdition)score+=32;
    else if((a.versions||[]).includes(requestedEdition))score+=18;
    else if(a.scope==='Conversion')score+=8;
    else if(a.scope==='Universal')score+=4;
    else score-=14;
    // A broad landing page should not outrank an on-topic technical finding.
    if(hasSubjectBeyondEdition&&a.kind==='Documentation'&&a.topic==='Start')score-=20;
   }else if(editions.length>1){
    // Queries comparing two EDF generations should surface conversion and
    // multi-edition findings, without suppressing individual game evidence.
    const recorded=(a.versions||[]).filter(v=>editions.includes(v)).length;
    if(a.scope==='Conversion')score+=28;
    else if(recorded===editions.length)score+=18;
   }
   // Prefer a meaningful technical token instead of a generic first-page excerpt.
   const byLength=[...terms].sort((a,b)=>b.length-a.length);
   const snippetIndex=phraseIndex>=0?phraseIndex:byLength.map(word=>body.indexOf(word)).find(i=>i>=0);
   return {a,body,index:snippetIndex??-1,score};
  }).filter(x=>x.score>0).sort((x,y)=>y.score-x.score||x.a.title.localeCompare(y.a.title));
  searchResults.innerHTML='<h1>Search: '+escape(q.value.trim())+'</h1><p class="searchnote" role="status">'+hits.length+' matching documentation pages and technical references. '+(terms.length>1?'All search words must match. ':'')+'Exact topic pages appear first.</p>'+
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
