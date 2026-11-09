'use strict';

// Deliberately standalone: fictional content only, no API/SDK/storage integration.
const designs = {
  a: {name:'イラストポップ', label:'A', heading:'福祉のしごとに、<br><span>頼れる資料を。</span>', intro:'探して、見つけて。毎日の運営をもっと軽やかに。', image:'hero-a.png'},
  b: {name:'カラフルブロック', label:'B', heading:'必要なものが、<br><span>ぱっと見つかる。</span>', intro:'運営も、研修も。ここから、さくさく。', image:'hero-b.png'},
  d: {name:'すっきり案内', label:'D', heading:'探していた資料に、<br><span>すぐ、たどり着く。</span>', intro:'運営に必要なものを、4つの入口から。'},
  f: {name:'やさしい線画', label:'F'},
  g: {name:'参考レイアウト', label:'G'}
};
const categories = [
  {id:'operation', name:'運営・手続き', short:'運営', words:'規程・届出・チェックリスト', icon:'document',topics:['運営規程','届出・手続き','チェックリスト','契約・同意']},
  {id:'people', name:'人員配置', short:'人員配置', words:'勤務表・シフト・職員管理', icon:'people',topics:['勤務体制','シフト','職員管理','雇用・入退社']},
  {id:'finance', name:'工賃・会計', short:'工賃・会計', words:'工賃・収支・請求', icon:'calculator',topics:['工賃','収支・会計','請求','加算']},
  {id:'training', name:'研修', short:'研修', words:'研修資料・動画・年間計画', icon:'video',topics:['研修計画','感染症対策','虐待防止','BCP・防災']}
];
const rawDocuments = {
  operation:[
    ['運営規程のひな形','運営規程','Word','事業所のルールをまとめるときに。','rules'],
    ['変更届出書','届出・手続き','Excel','変更の内容を整理する書式。','sheet'],
    ['運営チェックリスト','チェックリスト','PDF','日々の運営をひとつずつ確認。','check'],
    ['重要事項説明書','契約・同意','Word','サービスの説明に使うひな形。','rules'],
    ['事故・ヒヤリハット報告書','チェックリスト','Excel','気づいたことを記録して共有。','sheet'],
    ['サービス利用契約書','契約・同意','Word','利用開始時の契約書のひな形。','rules'],
    ['新規開設の手続きリスト','届出・手続き','PDF','開設までの準備を見渡すリスト。','check'],
    ['個人情報の取扱い同意書','契約・同意','Word','情報の取扱いを説明する書式。','rules'],
    ['苦情受付・対応記録','チェックリスト','Excel','受付から対応までを記録。','sheet'],
    ['運営規程の変更記録','運営規程','Excel','規程の変更内容をまとめる表。','sheet'],
    ['事業所の掲示チェック表','チェックリスト','PDF','掲示する項目の確認に。','check'],
    ['届出書類の管理台帳','届出・手続き','Excel','提出する書類を一覧で管理。','sheet']
  ],
  people:[
    ['勤務形態一覧表','勤務体制','Excel','職員の勤務時間を見渡す表。','sheet'],
    ['月間シフト表','シフト','Excel','ひと月のシフトをまとめる書式。','sheet'],
    ['職員名簿','職員管理','Excel','職員の情報を一覧で整理。','sheet'],
    ['入職時の確認リスト','雇用・入退社','PDF','入職時の準備をひとつずつ確認。','check'],
    ['勤務体制チェックリスト','勤務体制','PDF','勤務体制の確認に使うリスト。','check'],
    ['雇用条件通知書','雇用・入退社','Word','雇用条件を伝える書式。','rules']
  ],
  finance:[
    ['月次収支表','収支・会計','Excel','ひと月の収入と支出を整理。','sheet'],
    ['工賃規程のひな形','工賃','Word','工賃に関するルールをまとめる書式。','rules'],
    ['工賃支給一覧表','工賃','Excel','工賃の支給額をまとめる表。','sheet'],
    ['請求確認チェック表','請求','PDF','請求前の確認に使うリスト。','check'],
    ['加算の確認シート','加算','Excel','加算に関する確認項目を整理。','sheet'],
    ['年間収支計画表','収支・会計','Excel','年間の収支の見通しを立てる表。','sheet']
  ],
  training:[
    ['年間研修計画表','研修計画','Excel','一年間の研修を見渡す表。','sheet'],
    ['感染症対策の研修資料','感染症対策','PDF','職員研修の資料イメージ。','rules'],
    ['虐待防止の研修資料','虐待防止','PDF','研修で考えるテーマを整理。','rules'],
    ['BCP研修の進め方','BCP・防災','PDF','研修の進め方をまとめる資料。','check'],
    ['感染症対策の動画','感染症対策','動画','研修動画の表示イメージ。','video'],
    ['研修実施記録','研修計画','Word','研修の内容を残す書式。','rules']
  ]
};
const documents = Object.entries(rawDocuments).flatMap(([category, rows]) => rows.map((r,i)=>({id:`sample-${category}-${i+1}`, category,title:r[0],topic:r[1],format:r[2],description:r[3],art:r[4]})));
const bookmarks = new Set();
const app = document.getElementById('app');
const dialog = document.getElementById('document-dialog');
let lastOpened = null;
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = s => s.normalize('NFKC').toLowerCase();
function icon(name, cls='') {
  const paths={
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    book:'<path d="M3 5q5-2 9 1 4-3 9-1v14q-5-2-9 1-4-3-9-1Z"/><path d="M12 6v14"/>',
    document:'<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h4M9 12h6m-6 4h6"/>',
    people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5"/>',
    calculator:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8v4H8Zm0 8h1m3 0h1m3 0h.1M8 18h1m3 0h1m3 0h.1"/>',
    video:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="m10 8 5 3-5 3Zm-3 8-2 4m10-4 2 4"/>',
    bookmark:'<path d="M6 3h12v18l-6-4-6 4Z"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    chevron:'<path d="m9 6 6 6-6 6"/>',
    filter:'<path d="M4 6h16M7 12h10m-7 6h4"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    home:'<path d="m3 10 9-7 9 7M5 9v12h14V9m-10 12v-7h6v7"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>'
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.document}</svg>`;
}
function illustration(name, design=route().design){
  const category={document:'operation',people:'people',calculator:'finance',video:'training'}[name]||'operation';
  const src=design==='d' ? (category==='people'?'guide-man.png':'guide-woman.png') : `card-${design}-${category}${design==='f'?'-ink':''}.png`;
  return `<img class="category-art" src="./assets/${src}" alt="" width="1024" height="1024" loading="lazy" decoding="async">`;
}

function route(){
  const [path,query='']=location.hash.replace(/^#\/?/,'').split('?');
  const [candidate='a',section='home']=path.split('/');
  const design=designs[candidate]?candidate:'a';
  const category=categories.find(c=>c.id===section)||categories[0];
  const sections=['home',...categories.map(c=>c.id),...(['f','g'].includes(design)?['consult','consult-confirm']:[])];
  return {design,section:sections.includes(section)?section:'home',category,params:new URLSearchParams(query)};
}
function link(design, section='home',params){if(!['f','g'].includes(design)&&section.startsWith('consult'))section='home';const q=params?.toString();return `#/${design}/${section}${q?'?'+q:''}`;}
function comparisonBar(r){
  return `<aside class="comparison-bar" aria-label="デザイン比較"><div class="comparison-inner"><span class="comparison-label">デザイン比較</span><nav aria-label="デザイン案">${Object.entries(designs).map(([key,d])=>`<a href="${link(key,r.section,r.params)}" class="design-choice ${key===r.design?'active':''}" ${key===r.design?'aria-current="true"':''}><span>${d.label}</span><b>${d.name}</b></a>`).join('')}</nav><span class="mock-label"><i></i>デザイン見本<span>・架空データ</span></span></div></aside>`;
}
function header(r){
  if(r.design==='g')return gHeader(r);
  if(r.design==='f')return fHeader(r);
  return `<header class="site-header"><div class="shell header-inner"><a class="brand" href="${link(r.design)}" aria-label="フクシル ホーム">${icon('book')}<span>フクシル</span></a><nav class="site-nav" aria-label="メインメニュー"><a class="${r.section==='home'?'current':''}" href="${link(r.design)}">ホーム</a><a class="${r.section!=='home'?'current':''}" href="${link(r.design,'operation')}">資料を探す ${icon('search')}</a></nav><span class="member-label">${icon('user')}会員ページ</span></div></header>`;
}
function searchForm(r,home=false){
  return `<form class="search-form ${home?'hero-search':''}" data-search><label class="sr-only" for="keyword">資料をキーワードで探す</label>${icon('search')}<input id="keyword" name="q" type="search" maxlength="100" value="${esc(r.params.get('q')||'')}" placeholder="${home?'どんな資料をお探しですか？':'キーワードで資料を探す'}"><button type="submit">検索 ${icon('arrow')}</button></form>`;
}
function categoryCard(c,r){
  const items={operation:['運営規程','各種届出','チェックリスト'],people:['勤務形態一覧表','シフト表','職員管理'],finance:['工賃規程','収支・会計','請求・加算'],training:['研修資料・動画','年間研修計画','BCP・防災']};
  return `<a class="entry-card cat-${c.id}" href="${link(r.design,c.id)}"><div class="entry-copy"><h3>${c.name}</h3>${r.design==='d'?`<ul class="guide-topics">${items[c.id].map(t=>`<li><span>${icon('check')}</span>${t}</li>`).join('')}</ul>`:''}</div>${r.design==='d'?'':illustration(c.icon,r.design)}<span class="entry-arrow">${icon('arrow')}</span></a>`;
}
function guideHome(r){
  return `<main id="main" tabindex="-1"><section class="guide-heading shell"><h1>探していた資料に、<br><span>すぐ、たどり着く。</span></h1>${searchForm(r,true)}</section><section class="guide-section" aria-labelledby="guide-title"><div class="guide-board shell"><h2 id="guide-title">何をお探しですか？</h2><div class="guide-stage"><img class="guide-person guide-person-left" src="./assets/guide-man.png" alt="" width="1024" height="1536"><div class="entry-grid">${categories.map(c=>categoryCard(c,r)).join('')}</div><img class="guide-person guide-person-right" src="./assets/guide-woman.png" alt="" width="1024" height="1536"></div><a class="guide-all" href="${link(r.design,'operation',new URLSearchParams({scope:'all'}))}">すべての資料を見る ${icon('arrow')}</a></div></section></main>`;
}

function home(r){
  if(r.design==='g')return gHome(r);
  if(r.design==='f')return fHome(r);
  if(r.design==='d')return guideHome(r);
  const d=designs[r.design];
  return `<main id="main" tabindex="-1"><section class="hero shell"><div class="hero-copy"><h1>${d.heading}</h1><p class="hero-intro">${d.intro}</p>${searchForm(r,true)}<div class="quick-search">${['運営規程','シフト','収支','BCP'].map(t=>`<a href="${link(r.design,'operation',new URLSearchParams({q:t,scope:'all'}))}">${t}</a>`).join('')}</div></div><div class="hero-visual"><span class="hero-sticker">${r.design==='a'?'毎日の<br>「これ使える！」':'探す、が<br>たのしく。'}</span><img class="hero-image" src="./assets/${d.image}" alt="${r.design==='a'?'資料を見ながら仕事をするふたりのスタッフのイラスト':'フォルダ、パソコン、電卓のカラフルな立体イラスト'}" width="1536" height="1024" fetchpriority="high"></div></section><section class="entry-section shell" aria-labelledby="entry-heading"><div class="section-heading"><h2 id="entry-heading">何をお探しですか？<span class="heading-spark">✳</span></h2><a class="all-link" href="${link(r.design,'operation',new URLSearchParams({scope:'all'}))}">すべての資料を見る ${icon('arrow')}</a></div><div class="entry-grid">${categories.map(c=>categoryCard(c,r)).join('')}</div></section></main>`;
}
function categoryTabs(r){
  return `<nav class="category-tabs" aria-label="資料のカテゴリー">${categories.map(c=>`<a href="${link(r.design,c.id)}" class="cat-${c.id} ${r.category.id===c.id?'selected':''}" ${r.category.id===c.id?'aria-current="page"':''}>${icon(c.icon)}${c.name}</a>`).join('')}</nav>`;
}
function filters(r){
  const topic=r.params.get('topic')||'';
  return `<aside class="filter-panel" aria-label="資料の絞り込み"><h2>${icon('filter')}テーマで探す</h2><div class="topic-options"><button type="button" data-topic="" class="${!topic?'selected':''}" aria-pressed="${!topic}">すべて ${icon('chevron')}</button>${r.category.topics.map(t=>`<button type="button" data-topic="${t}" class="${topic===t?'selected':''}" aria-pressed="${topic===t}">${t} ${icon('chevron')}</button>`).join('')}</div><div class="filter-illustration">${illustration(r.category.icon)}<p>探したい資料へ、<br>まっすぐ。</p></div></aside>`;
}
function documentArt(doc){
  if(doc.art==='video')return `<div class="document-sheet video-sheet"><span class="paper-title">研修動画</span>${icon('video')}</div>`;
  return `<div class="document-sheet ${doc.art}"><span class="paper-title">${esc(doc.title)}</span><span class="paper-rule"></span><span class="paper-rule short"></span><span class="paper-body">${Array.from({length:doc.art==='sheet'?4:5},()=>`<span>${doc.art==='check'?'<i>✓</i>':''}</span>`).join('')}</span></div>`;
}
function documentCard(doc){
  const saved=bookmarks.has(doc.id);
  return `<article class="document-card cat-${doc.category}"><a href="#preview-${doc.id}" class="document-thumb" data-preview="${doc.id}" aria-label="${esc(doc.title)}の表示見本を開く">${documentArt(doc)}<span class="format-badge fmt-${doc.format==='Excel'?'excel':doc.format==='Word'?'word':doc.format==='動画'?'video':'pdf'}">${doc.format}</span></a><div class="document-copy"><span class="topic-badge">${doc.topic}</span><h3><a href="#preview-${doc.id}" data-preview="${doc.id}">${esc(doc.title)}</a></h3><p>${doc.description}</p><a class="document-open" href="#preview-${doc.id}" data-preview="${doc.id}">資料を見る ${icon('arrow')}</a></div><button type="button" class="bookmark ${saved?'is-saved':''}" data-bookmark="${doc.id}" aria-label="${esc(doc.title)}を${saved?'保存から外す':'保存する'}" aria-pressed="${saved}">${icon('bookmark')}</button></article>`;
}
function list(r){
  if(r.design==='g')return gList(r);
  const c=r.category,all=r.params.get('scope')==='all',q=r.params.get('q')||'',topic=r.params.get('topic')||'',format=r.params.get('format')||'';
  const sort=r.params.get('sort')||'default';
  const tokens=normalize(q).split(/\s+/).filter(Boolean);
  let result=documents.filter(d=>(all||d.category===c.id)&&(!topic||d.topic===topic)&&(!format||d.format===format)&&tokens.every(t=>normalize(`${d.title} ${d.topic} ${d.description}`).includes(t)));
  if(sort==='title')result.sort((a,b)=>a.title.localeCompare(b.title,'ja'));
  const pages=Math.max(1,Math.ceil(result.length/6)),page=Math.min(pages,Math.max(1,Number.parseInt(r.params.get('page'),10)||1));
  const shown=result.slice((page-1)*6,page*6);
  return `<main id="main" tabindex="-1"><div class="shell breadcrumb"><a href="${link(r.design)}">ホーム</a>${icon('chevron')}<span>${all?'すべての資料':c.name}</span></div><section class="list-hero cat-${c.id}"><div class="shell list-hero-inner"><div><p class="list-kicker">資料を探す</p><h1>${all?'すべての資料':c.name}</h1><p>${all?'必要な資料を、キーワードから。':c.words}</p></div><div class="list-hero-art">${illustration(c.icon)}</div></div></section><div class="shell list-shell">${categoryTabs(r)}<div class="library-layout">${filters(r)}<section class="results" aria-label="資料一覧">${searchForm(r)}<div class="results-toolbar"><p class="result-count" role="status">${q?`「${esc(q)}」の検索結果 `:''}<strong>${result.length}</strong>件<span>の資料</span></p><div class="sort-controls"><label><span class="sr-only">並び順</span><select data-select="sort" aria-label="並び順"><option value="default" ${sort==='default'?'selected':''}>標準の並び順</option><option value="title" ${sort==='title'?'selected':''}>名前順</option></select></label><label><span class="sr-only">ファイル形式</span><select data-select="format" aria-label="ファイル形式">${[['','すべての形式'],['Word','Word'],['Excel','Excel'],['PDF','PDF'],['動画','動画']].map(([v,t])=>`<option value="${v}" ${format===v?'selected':''}>${t}</option>`).join('')}</select></label></div></div>${(q||topic||format)?`<div class="active-filters">${[q?['q',q]:null,topic?['topic',topic]:null,format?['format',format]:null].filter(Boolean).map(([key,v])=>`<button type="button" data-clear="${key}" aria-label="${esc(v)}の条件を解除">${esc(v)} ${icon('close')}</button>`).join('')}<button type="button" class="clear-all" data-clear="all">すべて解除</button></div>`:''}<div class="document-grid">${shown.length?shown.map(documentCard).join(''):`<div class="empty-state">${icon('search')}<h2>一致する資料がありません</h2><p>キーワードや条件を変えてみてください。</p><button type="button" data-clear="all">条件をクリア ${icon('arrow')}</button></div>`}</div>${pages>1?`<nav class="pagination" aria-label="資料一覧のページ"><button data-page="${page-1}" ${page===1?'disabled':''} aria-label="前のページ">前へ</button>${Array.from({length:pages},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}<button data-page="${page+1}" ${page===pages?'disabled':''} aria-label="次のページ">次へ</button></nav>`:''}<p class="sample-note">掲載内容・資料画像はすべてデザイン確認用の見本です。</p></section></div></div></main>`;
}
function render(){
  const r=route();
  if(/^#\/c(?:\/|$)/.test(location.hash))history.replaceState(null,'',link(r.design,r.section,r.params));
  const consult=['f','g'].includes(r.design)&&r.section.startsWith('consult');
  document.body.className=`design-${r.design} page-${consult?'consult':r.section==='home'?'home':'list'}`;
  document.title=`${designs[r.design].label} ${designs[r.design].name}｜${consult?(r.section==='consult-confirm'?'入力内容の確認':'個別相談'):r.section==='home'?'ホーム':r.category.name}｜フクシル`;
  const content=consult?(r.design==='g'?(r.section==='consult-confirm'?gConsultConfirm(r):gConsultPage(r)):(r.section==='consult-confirm'?fConsultConfirm(r):fConsultPage(r))):r.section==='home'?home(r):list(r);
  app.innerHTML=comparisonBar(r)+header(r)+content+`<footer class="site-footer shell"><a class="footer-brand" href="${link(r.design)}">${icon('book')}フクシル</a><a href="${link(r.design,r.section==='home'?'operation':'home')}">${r.section==='home'?'資料を探す':'ホームへ戻る'} ${icon('arrow')}</a></footer>`;
}
function updateParam(key,value){
  const r=route(),p=r.params;
  p.delete('page');
  if(value)p.set(key,value);else p.delete(key);
  location.hash=link(r.design,r.section,p);
}
function openDocument(id){
  const doc=documents.find(d=>d.id===id);if(!doc)return;
  lastOpened=document.activeElement;
  dialog.innerHTML=`<button type="button" class="dialog-close" data-close aria-label="閉じる">${icon('close')}</button><span class="dialog-label">デザイン確認用・表示見本</span><h2 id="dialog-title">${esc(doc.title)}</h2><p class="dialog-description">${doc.description}</p><div class="dialog-paper cat-${doc.category}">${documentArt(doc)}<span class="sample-watermark">SAMPLE</span></div><div class="dialog-bottom"><p>実際の資料・動画には接続していません。</p><button type="button" disabled>ファイル未接続</button></div>`;
  dialog.showModal();
}
document.addEventListener('submit',e=>{
  if(!e.target.matches('[data-search]'))return;
  e.preventDefault();
  const r=route(),q=new FormData(e.target).get('q').trim(),p=r.params;
  p.delete('page');if(q)p.set('q',q);else p.delete('q');
  if(r.section==='home')p.set('scope','all');
  location.hash=link(r.design,r.section==='home'?'operation':r.section,p);
});
document.addEventListener('change',e=>{if(e.target.dataset.select)updateParam(e.target.dataset.select,e.target.value);});
document.addEventListener('click',e=>{
  if(e.target.closest('.skip-link')){e.preventDefault();document.getElementById('main').focus();document.getElementById('main').scrollIntoView();return;}
  const preview=e.target.closest('[data-preview]');if(preview){e.preventDefault();openDocument(preview.dataset.preview);return;}
  const mark=e.target.closest('[data-bookmark]');if(mark){const id=mark.dataset.bookmark;bookmarks.has(id)?bookmarks.delete(id):bookmarks.add(id);const saved=bookmarks.has(id),doc=documents.find(d=>d.id===id);mark.classList.toggle('is-saved',saved);mark.setAttribute('aria-pressed',saved);mark.setAttribute('aria-label',`${doc.title}を${saved?'保存から外す':'保存する'}`);return;}
  const topic=e.target.closest('[data-topic]');if(topic){const r=route();r.params.delete('scope');r.params.delete('page');if(topic.dataset.topic)r.params.set('topic',topic.dataset.topic);else r.params.delete('topic');location.hash=link(r.design,r.section,r.params);return;}
  const clear=e.target.closest('[data-clear]');if(clear){const r=route();if(clear.dataset.clear==='all'){const scope=r.params.get('scope');r.params=new URLSearchParams(scope?{scope}:{});}else{r.params.delete(clear.dataset.clear);r.params.delete('page');}location.hash=link(r.design,r.section,r.params);return;}
  const page=e.target.closest('[data-page]');if(page){updateParam('page',page.dataset.page);return;}
  if(e.target.closest('[data-close]'))dialog.close();
  if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}
});
dialog.addEventListener('close',()=>{if(lastOpened?.isConnected)lastOpened.focus();});
window.addEventListener('hashchange',()=>{if(dialog.open)dialog.close();render();window.scrollTo({top:0,behavior:'instant'});});
render();
