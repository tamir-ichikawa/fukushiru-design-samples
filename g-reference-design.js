'use strict';

// G is a static design sample. Form values exist only in this page's memory.
const gUi={menu:false,draft:null,confirmed:false};
const gTopics=['実地指導への備え','加算・制度の確認','書類・運用の見直し','スタッフマネジメント','その他'];
function gMenuIcon(){return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';}
function gBulbIcon(){return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M8 16v-2a6 6 0 1 1 8 0v2M8 17h8M9 20h6M12 1v1M3 4l2 2m14-2-2 2M1 12h2m18 0h2"/></svg>';}
function gSymbol(name){
  const shapes={yen:'<path d="m6 3 6 8 6-8M12 11v10M6 12h12M6 16h12"/>',play:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4Z"/>',building:'<path d="M6 22V2h12v20M2 22h20M2 22V10h4m12 0h4v12M9 6h.1M15 6h.1M9 10h.1M15 10h.1M9 14h.1M15 14h.1M10 22v-4h4v4"/>',laptop:'<path d="M4 17V4h16v13M1 20h22l-3-3H4Z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>'};
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]||''}</svg>`;
}
function gHeader(r){
  return `<header class="site-header g-header"><div class="shell header-inner"><a class="brand g-brand" href="${link(r.design)}" aria-label="フクシル ホーム"><span class="g-brand-word">フクシル</span><span class="g-brand-descriptor">現場で使える<br>資料とノウハウのサイト</span></a><nav class="g-header-nav" aria-label="メインメニュー"><a href="${link(r.design,'operation')}">資料を探す</a><button type="button" data-g-action="guide">使い方ガイド</button><button type="button" data-g-action="notice">お知らせ</button></nav><div class="g-header-actions"><button type="button" class="g-account" data-g-action="account">${icon('user')}マイページ</button><button type="button" class="g-menu-toggle" data-g-action="menu" aria-label="メニューを開閉" aria-expanded="${gUi.menu}">${gMenuIcon()}</button></div>${gUi.menu?`<nav class="g-menu" aria-label="カテゴリーのメニュー"><a href="${link(r.design)}">ホーム</a>${categories.map(c=>`<a href="${link(r.design,c.id)}">${c.name}${icon('arrow')}</a>`).join('')}<a href="${link(r.design,'consult')}">個別相談${icon('arrow')}</a></nav>`:''}</div></header>`;
}
function gCategoryCard(category,r,index){
  const content={operation:{title:'運営',description:'運営規程・届出・<br>チェックリスト'},people:{title:'人員配置',description:'勤務形態・一覧表・<br>常勤換算・シフト'},finance:{title:'工賃・会計',description:'工賃規程・工賃明細<br>会計書類・加算'},training:{title:'研修',description:'研修資料・動画<br>1分解説・スタッフ教育'}}[category.id];
  const symbol=category.id==='finance'?gSymbol('yen'):category.id==='training'?gSymbol('play'):icon(category.icon);
  return `<a class="g-entry-card cat-${category.id}" href="${link(r.design,category.id)}"><span class="g-entry-number">${String(index+1).padStart(2,'0')}</span><h3>${content.title}</h3><p>${content.description}</p><div class="g-entry-scene"><img src="./assets/card-g-${category.id}.png" class="g-entry-art" alt="" width="1254" height="1254" decoding="async"><span class="g-entry-symbol" aria-hidden="true">${symbol}</span></div><span class="g-entry-arrow">${icon('arrow')}</span></a>`;
}
function gHome(r){
  const chips=[['運営規程','operation','運営規程'],['人員配置','people',''],['工賃','finance','工賃'],['実地指導','operation',''],['BCP','training','BCP'],['加算','finance','加算']];
  return `<main class="g-main" id="main" tabindex="-1">
    <section class="g-hero shell"><div class="g-hero-copy"><h1>むずかしいを、<br><span>かんたんに。</span></h1><p>福祉事業の運営に必要な資料・動画・ノウハウを<br>すぐ見つけて、すぐ使えるサイトです。</p>${searchForm(r,true).replace('どんな資料をお探しですか？','資料名・キーワードで検索')}<div class="g-search-chips">${chips.map(([label,category,q])=>`<a href="${link(r.design,category,q?new URLSearchParams({q}):undefined)}">${label}</a>`).join('')}</div></div><div class="g-hero-visual"><span class="g-hero-wash" aria-hidden="true"></span><span class="g-hero-note">これ<br>使える！</span><img src="./assets/hero-g.png" alt="パソコンで資料を探す女性の手描きイラスト" width="1536" height="1024" fetchpriority="high"></div></section>
    <section class="g-category-section shell" aria-labelledby="g-category-heading"><div class="g-section-heading"><h2 id="g-category-heading">カテゴリから探す<span class="g-yellow-rays" aria-hidden="true"><i></i><i></i><i></i></span></h2><a href="${link(r.design,'operation',new URLSearchParams({scope:'all'}))}">すべての資料を見る ${icon('arrow')}</a></div><div class="g-entry-grid">${categories.map((c,i)=>gCategoryCard(c,r,i)).join('')}</div></section>
    <section class="g-benefits shell" aria-label="フクシルの特徴"><div class="g-benefit"><span class="g-benefit-icon">${icon('document')}</span><div><h2>豊富な資料</h2><p>すぐ使える様式・ひな形を<br>多数掲載</p></div></div><div class="g-benefit"><span class="g-benefit-icon">${gSymbol('play')}</span><div><h2>1分でわかる</h2><p>資料ごとに短い解説動画で<br>使い方まで理解できる</p></div></div><div class="g-benefit"><span class="g-benefit-icon">${gBulbIcon()}</span><div><h2>現場目線</h2><p>運営のリアルなノウハウを<br>わかりやすく</p></div></div></section>
    <section class="g-consult shell" aria-labelledby="g-consult-heading"><svg class="g-consult-wash" viewBox="0 0 960 340" preserveAspectRatio="none" aria-hidden="true"><path d="M0 28C100-12 230-8 350 42S445 68 505 30S730 17 960 0V340H0Z" fill="#fcf7ed"/></svg><div class="g-consult-visual"><span class="g-consult-note">ひとりで<br>悩まなくていい。</span><img src="./assets/consult-g.png" alt="資料を見ながら運営について相談する二人の手描きイラスト" width="1536" height="1024" loading="lazy" decoding="async"></div><div class="g-consult-copy"><p class="g-consult-kicker">福祉事業の運営サポート</p><h2 id="g-consult-heading">実地指導・運営の不安を、<br><span>60分で整理。</span></h2><p>今の体制や運用を一緒に整理し、<br>必要な対応を具体的にお伝えします。</p><a class="g-consult-button" href="${link(r.design,'consult')}">個別相談を申し込む ${icon('arrow')}</a></div></section>
  </main>`;
}
function gConsultBreadcrumb(r,confirm=false){return `<div class="shell breadcrumb"><a href="${link(r.design)}">ホーム</a>${icon('chevron')}${confirm?`<a href="${link(r.design,'consult')}">個別相談</a>${icon('chevron')}<span>入力内容の確認</span>`:'<span>個別相談</span>'}</div>`;}
function gConsultPage(r){
  return `<main class="g-consult-page" id="main" tabindex="-1"><div class="g-consult-intro shell">${gConsultBreadcrumb(r)}<section class="g-consult-hero"><div class="g-consult-hero-copy"><p class="g-consult-kicker">福祉事業の運営サポート</p><h1>実地指導・運営の不安を、<br><span>60分</span>で整理。</h1><p>今の体制や運用を伺い、確認すべき点と<br>次に取り組むことを一緒に整理します。</p><button class="g-consult-button" type="button" data-g-action="form">${gSymbol('laptop')}オンライン個別相談<span>｜60分</span>${icon('arrow')}</button></div><div class="g-consult-hero-art"><span class="g-worry-note">こんなお悩み<br>ありませんか？</span><ul class="g-worry-list">${['実地指導の準備','加算の確認','書類・運用の見直し','スタッフ育成'].map(t=>`<li>${icon('check')}${t}</li>`).join('')}</ul><img src="./assets/hero-g.png" alt="パソコンに向かい、運営について考える女性" width="1536" height="1024"></div></section></div>
    <section class="g-support shell" aria-labelledby="g-support-heading"><h2 id="g-support-heading">現場を知るLITAXIAがサポート。</h2><div class="g-support-grid"><article>${gSymbol('building')}<h3>直営事業所の運営経験</h3><p>実際の事業所運営で得た<br>視点をもとにサポート。</p></article><article>${icon('document')}<h3>開業から運営まで</h3><p>事業の段階に合わせて<br>課題を整理。</p></article><article>${icon('people')}<h3>人材育成・行政対応</h3><p>現場体制と日々の運用を<br>サポート。</p></article></div><p class="g-support-caption">必要なときに、単発で相談できます。</p></section>
    <section class="g-application shell" id="g-application" aria-labelledby="g-form-heading"><h2 id="g-form-heading">個別相談のお申し込み</h2><p class="g-form-intro">相談したい内容と、ご希望の日時をお知らせください。</p><p class="g-demo-note">デザイン確認用のフォームです。入力内容は送信・保存されません。</p>${gConsultForm()}</section>
  </main>`;
}
function gConsultForm(){
  const d=gUi.draft||{},value=name=>esc(d[name]||'');
  return `<form class="g-consult-form" data-g-consult-form novalidate><div class="g-form-pair"><label for="g-company">事業所名<input id="g-company" name="company" required maxlength="100" autocomplete="off" placeholder="例）株式会社〇〇" value="${value('company')}"></label><label for="g-name">お名前<input id="g-name" name="name" required maxlength="80" autocomplete="off" placeholder="例）山田 太郎" value="${value('name')}"></label><label for="g-email">メールアドレス<input id="g-email" name="email" type="email" required maxlength="160" autocomplete="off" placeholder="例）example@sample.com" value="${value('email')}"></label><label for="g-phone">電話番号 <span>（任意）</span><input id="g-phone" name="phone" type="tel" maxlength="40" autocomplete="off" placeholder="例）090-1234-5678" value="${value('phone')}"></label></div>
    <fieldset class="g-topics"><legend>ご相談のテーマ <span>（複数選択できます）</span></legend><div>${gTopics.map((t,i)=>`<label><input type="checkbox" name="themes" value="${t}" ${d.themes?.includes(t)?'checked':''}>${t}</label>`).join('')}</div></fieldset>
    <label for="g-dates">ご希望の日時<div class="g-date-input"><input id="g-dates" name="dates" required maxlength="250" placeholder="候補日時を2〜3つご記入ください" value="${value('dates')}">${gSymbol('calendar')}</div></label>
    <label for="g-message">ご相談内容 <span>（具体的な内容をご記入ください）</span><textarea id="g-message" name="message" required maxlength="2000" rows="4" placeholder="現在の状況や、相談したい内容をご記入ください。">${value('message')}</textarea></label>
    <div class="g-agreement"><label><input type="checkbox" name="consent" required ${d.consent?'checked':''}>個人情報の取り扱いに同意する</label><button type="button" data-g-action="privacy">プライバシーポリシーを見る</button></div><button type="submit" class="g-consult-button g-confirm-button">確認画面へ進む ${icon('arrow')}</button>
  </form>`;
}
function gConsultConfirm(r){
  const d=gUi.draft;
  if(!d||!gUi.confirmed)return `<main class="shell g-confirm-page" id="main" tabindex="-1"><h1>個別相談のお申し込み</h1><p>お申し込み内容を入力すると、こちらで確認できます。</p><a class="g-consult-button" href="${link(r.design,'consult')}">入力画面へ ${icon('arrow')}</a></main>`;
  const rows=[['事業所名',d.company],['お名前',d.name],['メールアドレス',d.email],['電話番号',d.phone||'未入力'],['ご相談のテーマ',d.themes.join('、')],['ご希望の日時',d.dates],['ご相談内容',d.message],['個人情報の取り扱い','同意する']];
  return `<main class="g-confirm-page shell" id="main" tabindex="-1">${gConsultBreadcrumb(r,true)}<section class="g-confirm-panel"><p class="g-consult-kicker">個別相談のお申し込み</p><h1>入力内容の確認</h1><p>内容をご確認ください。</p><dl class="g-confirm-details">${rows.map(([label,v])=>`<div><dt>${label}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><p class="g-demo-note">こちらは確認画面の見本です。お申し込みは送信されません。</p><div class="g-confirm-actions"><a href="${link(r.design,'consult')}">戻って修正する</a><button type="button" disabled>サンプルのため送信できません</button></div></section></main>`;
}
function gInformation(kind){
  const content={guide:{title:'使い方ガイド',body:'<ol class="g-guide-steps"><li><strong>カテゴリを選ぶ</strong><p>運営・人員配置・工賃会計・研修の入口から探せます。</p></li><li><strong>キーワードやテーマで絞る</strong><p>資料一覧では検索と形式の絞り込みを組み合わせられます。</p></li><li><strong>資料の表示見本を見る</strong><p>資料名を押すと表示見本が開きます。実ファイルの取得や動画再生は未接続です。</p></li></ol>'},notice:{title:'お知らせ（表示見本）',body:'<p class="g-info-body">こちらはお知らせ欄の表示見本です。実際のお知らせは掲載していません。</p>'},account:{title:'マイページ（表示見本）',body:'<p class="g-info-body">こちらは画面確認用のサンプルです。ログインや会員情報の変更には接続していません。</p>'},privacy:{title:'プライバシーポリシー（表示見本）',body:'<p class="g-info-body">このフォームはデザイン確認用です。入力内容は外部へ送信せず、この画面を再読み込みすると消えます。正式なプライバシーポリシーはサービス公開時に掲載する想定です。</p>'}}[kind];
  if(!content)return;
  lastOpened=document.activeElement;
  dialog.innerHTML=`<button type="button" class="dialog-close" data-close aria-label="閉じる">${icon('close')}</button><span class="dialog-label">デザイン確認用</span><h2 id="dialog-title">${content.title}</h2>${content.body}<button type="button" class="g-info-close" data-close>閉じる</button>`;
  dialog.showModal();
}
function gCaptureDraft(form){const data=new FormData(form);gUi.draft={company:String(data.get('company')||''),name:String(data.get('name')||''),email:String(data.get('email')||''),phone:String(data.get('phone')||''),dates:String(data.get('dates')||''),message:String(data.get('message')||''),themes:data.getAll('themes').filter(v=>gTopics.includes(v)),consent:data.has('consent')};}
document.addEventListener('input',event=>{const form=event.target.closest('[data-g-consult-form]');if(form){gCaptureDraft(form);gUi.confirmed=false;form.querySelector('[name=themes]').setCustomValidity('');}});
document.addEventListener('submit',event=>{
  if(!event.target.matches('[data-g-consult-form]'))return;
  event.preventDefault();const form=event.target;gCaptureDraft(form);
  form.querySelector('[name=themes]').setCustomValidity(gUi.draft.themes.length?'':'ご相談のテーマを1つ以上選択してください。');
  if(!form.reportValidity())return;
  gUi.confirmed=true;location.hash=link('g','consult-confirm');
});
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-g-action]');if(!trigger)return;
  event.preventDefault();const action=trigger.dataset.gAction;
  if(action==='menu'){gUi.menu=!gUi.menu;render();document.querySelector('[data-g-action=menu]')?.focus();return;}
  if(action==='form'){document.getElementById('g-application')?.scrollIntoView({behavior:'smooth',block:'start'});document.getElementById('g-company')?.focus({preventScroll:true});return;}
  gInformation(action);
});
window.addEventListener('hashchange',()=>{gUi.menu=false;});


// G-only fictional catalog, shaped after the supplied resource-list reference.
function gDocuments(){
  const rows=[
    ['就労継続支援B型 運営規程（ひな形）','運営規程','Excel','そのまま使えるひな形です。\n事業所のルールを整理。','運営規程の\nポイントを解説'],
    ['変更届出書（ひな形）','各種届出','PDF','事業所の変更時に使用する\n届出書のひな形です。','変更届の書き方\nを解説'],
    ['指定基準チェックリスト','指定基準','PDF','開設・運営時に確認する\n項目をまとめています。','確認しておきたい\nポイント'],
    ['常勤換算の計算シート','チェックリスト','Excel','勤務時間を入力して、常勤換算を\n確認するためのシートです。','計算方法を\nわかりやすく解説'],
    ['重要事項説明書（ひな形）','運営規程','Word','利用者への説明に使用できる\nひな形です。','作成時の注意点\nを解説'],
    ['施設外就労加算の要件と解説','加算の要件','PDF','算定要件・必要書類・\n注意点を確認する資料です。','加算のポイント\nを解説'],
    ['運営記録様式集','チェックリスト','Word','日々の運営に使える記録の\nひな形です。','記録作成の\nポイントを解説'],
    ['事業所の掲示チェック表','チェックリスト','PDF','掲示内容をひとつずつ\n確認するためのチェック表。','掲示内容の\n確認ポイント'],
    ['指定申請の準備リスト','指定基準','Excel','開設までの準備を\n見渡すリストです。','準備の進め方\nを解説'],
    ['運営に関するQ&A','Q&A','PDF','日々の運営で気になる\nテーマを確認できます。','よくある疑問\nを解説'],
    ['変更手続きチェックシート','各種届出','Excel','変更の内容と必要な手続きを\n整理するためのシートです。','手続きの流れ\nを解説'],
    ['加算確認チェックリスト','加算の要件','PDF','必要な記録や書類を\n確認するためのリストです。','確認の進め方\nを解説']
  ];
  return rows.map((v,i)=>({id:`g-operation-${i+1}`,category:'operation',title:v[0],topic:v[1],format:v[2],description:v[3],lesson:v[4],art:'rules'})).concat(documents.filter(d=>d.category!=='operation').map(d=>({...d,id:`g-${d.id}`,lesson:'使い方のポイント\nを解説'})));
}
function gPaper(){return '<span class="g-paper" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>';}
function gResourceCard(d){
  const saved=bookmarks.has(d.id),fmt=d.format.toLowerCase();
  const tag={'各種届出':'届出','指定基準':'チェックリスト','加算の要件':'加算'}[d.topic]||d.topic;
  return `<article class="g-resource-card cat-${d.category}"><button class="g-resource-thumb" data-g-preview="${d.id}" aria-label="${esc(d.title)}の表示見本を開く">${gPaper()}<span class="g-format fmt-${fmt}">${d.format}</span></button><div class="g-resource-copy"><span class="g-topic">${tag}</span><h3><button data-g-preview="${d.id}">${esc(d.title)}</button></h3><p>${esc(d.description).replaceAll('\n','<br>')}</p></div><div class="g-lesson"><span>1分解説</span><button data-g-video="${d.id}" aria-label="${esc(d.title)}の解説動画の表示見本"><span class="g-play">${gSymbol('play')}</span><b>${esc(d.lesson).replaceAll('\n','<br>')}</b></button></div><button class="g-bookmark ${saved?'is-saved':''}" data-g-bookmark="${d.id}" aria-label="${esc(d.title)}を${saved?'保存から外す':'保存する'}" aria-pressed="${saved}">${icon('bookmark')}</button></article>`;
}
function gList(r){
  const c=r.category,p=r.params,all=p.get('scope')==='all',q=p.get('q')||'',topic=p.get('topic')||'',format=p.get('format')||'',sort=p.get('sort')||'default';
  const tokens=normalize(q).split(/\s+/).filter(Boolean);
  let result=gDocuments().filter(d=>(all||d.category===c.id)&&(!topic||d.topic===topic)&&(!format||d.format===format)&&tokens.every(t=>normalize(`${d.title} ${d.topic} ${d.description}`).includes(t)));
  if(sort==='title')result.sort((a,b)=>a.title.localeCompare(b.title,'ja'));
  const pages=Math.max(1,Math.ceil(result.length/7)),page=Math.min(pages,Math.max(1,parseInt(p.get('page'),10)||1));
  const topics=c.id==='operation'?['運営規程','各種届出','加算の要件','指定基準','チェックリスト','Q&A']:c.topics;
  return `<main id="main" class="g-list-page" tabindex="-1"><section class="g-list-banner shell cat-${c.id}"><div class="breadcrumb"><a href="${link('g')}">ホーム</a>${icon('chevron')}<a href="${link('g','operation',new URLSearchParams({scope:'all'}))}">カテゴリー</a>${icon('chevron')}<span>${all?'すべての資料':c.short}</span></div><div class="g-list-heading"><div><h1>${all?'すべての資料':c.short}</h1><h2>${all?'資料・ひな形・解説動画':c.id==='operation'?'運営規程・届出・チェックリスト':c.words}</h2><p>${c.id==='operation'?'事業所の立ち上げから日々の運営まで、<br>必要な資料と解説をまとめています。':'毎日の仕事に使える資料と、<br>使い方の解説をまとめています。'}</p></div><div class="g-list-art"><span class="g-list-symbol">${icon(c.icon)}</span><img src="./assets/${c.id==='operation'?'hero-g.png':`card-g-${c.id}.png`}" alt="" width="1440" height="1080"></div></div></section><div class="shell g-list-shell"><nav class="g-tabs" aria-label="資料のカテゴリー">${categories.map(x=>`<a href="${link('g',x.id)}" class="cat-${x.id} ${!all&&x.id===c.id?'selected':''}" ${!all&&x.id===c.id?'aria-current="page"':''}>${icon(x.icon)}${x.short}</a>`).join('')}</nav><div class="g-library-layout"><aside class="g-filter" aria-label="資料の絞り込み"><h2>${c.short}の資料</h2><div class="g-filter-options">${['',...topics].map(t=>`<button data-topic="${t}" class="${topic===t?'selected':''}" aria-pressed="${topic===t}">${t||'すべて'}</button>`).join('')}</div><div class="g-request"><div class="g-request-art">${gPaper()}${gPaper()}</div><p>探している資料が<br>見つからない時は<br>リクエストできます</p><button data-g-request>資料リクエスト ${icon('arrow')}</button></div></aside><section class="g-results" aria-label="資料一覧">${searchForm(r).replace('キーワードで資料を探す','キーワードで検索（例：運営規程、届出、加算など）')}<div class="g-results-toolbar"><p role="status">${q?`「${esc(q)}」 `:''}全 <strong>${result.length}</strong> 件</p><div class="g-selects"><select data-select="sort" aria-label="並び順"><option value="default" ${sort==='default'?'selected':''}>新着順</option><option value="title" ${sort==='title'?'selected':''}>名前順</option></select><select data-select="format" aria-label="ファイル形式">${['','Excel','Word','PDF','動画'].map(v=>`<option value="${v}" ${v===format?'selected':''}>${v||'すべての形式'}</option>`).join('')}</select></div></div>${q||topic||format?`<div class="active-filters">${[q?['q',q]:null,topic?['topic',topic]:null,format?['format',format]:null].filter(Boolean).map(([key,v])=>`<button data-clear="${key}" aria-label="${esc(v)}の条件を解除">${esc(v)} ${icon('close')}</button>`).join('')}<button data-clear="all">すべて解除</button></div>`:''}<div class="g-resource-grid">${result.length?result.slice((page-1)*7,page*7).map(gResourceCard).join(''):'<div class="empty-state"><h2>一致する資料がありません</h2><p>キーワードや条件を変えてみてください。</p><button data-clear="all">条件をクリア</button></div>'}</div>${pages>1?`<nav class="pagination" aria-label="資料一覧のページ"><button data-page="${page-1}" ${page===1?'disabled':''}>前へ</button>${Array.from({length:pages},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}<button data-page="${page+1}" ${page===pages?'disabled':''}>次へ</button></nav>`:''}<p class="sample-note">掲載内容・資料画像・解説動画はデザイン確認用の見本です。</p></section></div></div></main>`;
}
function gResourceDialog(d,video=false){
  lastOpened=document.activeElement;
  dialog.innerHTML=`<button class="dialog-close" data-close aria-label="閉じる">${icon('close')}</button><span class="dialog-label">デザイン確認用・表示見本</span><h2 id="dialog-title">${video?'1分解説｜':''}${esc(d.title)}</h2><p class="dialog-description">${esc(d.description)}</p><div class="g-preview ${video?'g-video-preview':''}">${video?gSymbol('play'):gPaper()}<span>SAMPLE</span></div><div class="dialog-bottom"><p>${video?'実際の動画は接続していません。':'実際の資料は接続していません。'}</p><button disabled>${video?'動画未接続':'ファイル未接続'}</button></div>`;
  dialog.showModal();
}
document.addEventListener('click',event=>{
  const preview=event.target.closest('[data-g-preview],[data-g-video]');
  if(preview){event.preventDefault();const d=gDocuments().find(x=>x.id===(preview.dataset.gPreview||preview.dataset.gVideo));if(d)gResourceDialog(d,!!preview.dataset.gVideo);return;}
  const mark=event.target.closest('[data-g-bookmark]');
  if(mark){const id=mark.dataset.gBookmark,d=gDocuments().find(x=>x.id===id);if(!d)return;bookmarks.has(id)?bookmarks.delete(id):bookmarks.add(id);const saved=bookmarks.has(id);mark.classList.toggle('is-saved',saved);mark.setAttribute('aria-pressed',String(saved));mark.setAttribute('aria-label',`${d.title}を${saved?'保存から外す':'保存する'}`);return;}
  if(event.target.closest('[data-g-request]')){lastOpened=document.activeElement;dialog.innerHTML=`<button class="dialog-close" data-close aria-label="閉じる">${icon('close')}</button><span class="dialog-label">デザイン確認用</span><h2 id="dialog-title">資料リクエスト</h2><p class="g-info-body">資料リクエストの入口の見本です。実際のリクエスト送信には接続していません。</p><button class="g-info-close" data-close>閉じる</button>`;dialog.showModal();}
});
