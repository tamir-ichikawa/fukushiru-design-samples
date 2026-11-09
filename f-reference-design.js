'use strict';

// F is a static design sample. Form values exist only in this page's memory.
const fUi={menu:false,draft:null,confirmed:false};
const fTopics=['実地指導への備え','加算・制度の確認','書類・運用の見直し','スタッフマネジメント','その他'];
function fMenuIcon(){return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';}
function fBulbIcon(){return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M8 16v-2a6 6 0 1 1 8 0v2M8 17h8M9 20h6M12 1v1M3 4l2 2m14-2-2 2M1 12h2m18 0h2"/></svg>';}
function fSymbol(name){
  const shapes={yen:'<path d="m6 3 6 8 6-8M12 11v10M6 12h12M6 16h12"/>',play:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4Z"/>',building:'<path d="M6 22V2h12v20M2 22h20M2 22V10h4m12 0h4v12M9 6h.1M15 6h.1M9 10h.1M15 10h.1M9 14h.1M15 14h.1M10 22v-4h4v4"/>',laptop:'<path d="M4 17V4h16v13M1 20h22l-3-3H4Z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>'};
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]||''}</svg>`;
}
function fHeader(r){
  return `<header class="site-header f-header"><div class="shell header-inner"><a class="brand f-brand" href="${link(r.design)}" aria-label="フクシル ホーム"><span class="f-brand-word">フクシル</span><span class="f-brand-descriptor">現場で使える<br>資料とノウハウのサイト</span></a><nav class="f-header-nav" aria-label="メインメニュー"><a href="${link(r.design,'operation')}">資料を探す</a><button type="button" data-f-action="guide">使い方ガイド</button><button type="button" data-f-action="notice">お知らせ</button></nav><div class="f-header-actions"><button type="button" class="f-account" data-f-action="account">${icon('user')}マイページ</button><button type="button" class="f-menu-toggle" data-f-action="menu" aria-label="メニューを開閉" aria-expanded="${fUi.menu}">${fMenuIcon()}</button></div>${fUi.menu?`<nav class="f-menu" aria-label="カテゴリーのメニュー"><a href="${link(r.design)}">ホーム</a>${categories.map(c=>`<a href="${link(r.design,c.id)}">${c.name}${icon('arrow')}</a>`).join('')}<a href="${link(r.design,'consult')}">個別相談${icon('arrow')}</a></nav>`:''}</div></header>`;
}
function fCategoryCard(category,r,index){
  const content={operation:{title:'運営',description:'運営規程・届出・<br>チェックリスト'},people:{title:'人員配置',description:'勤務形態・一覧表・<br>常勤換算・シフト'},finance:{title:'工賃・会計',description:'工賃規程・工賃明細<br>会計書類・加算'},training:{title:'研修',description:'研修資料・動画<br>1分解説・スタッフ教育'}}[category.id];
  const symbol=category.id==='finance'?fSymbol('yen'):category.id==='training'?fSymbol('play'):icon(category.icon);
  return `<a class="f-entry-card cat-${category.id}" href="${link(r.design,category.id)}"><span class="f-entry-number">${String(index+1).padStart(2,'0')}</span><h3>${content.title}</h3><p>${content.description}</p><div class="f-entry-scene"><img src="./assets/card-f-${category.id}-ink.png" class="f-entry-art" alt="" width="1254" height="1254" decoding="async"><span class="f-entry-symbol" aria-hidden="true">${symbol}</span></div><span class="f-entry-arrow">${icon('arrow')}</span></a>`;
}
function fHome(r){
  const chips=[['運営規程','operation','運営規程'],['人員配置','people',''],['工賃','finance','工賃'],['実地指導','operation',''],['BCP','training','BCP'],['加算','finance','加算']];
  return `<main class="f-main" id="main" tabindex="-1">
    <section class="f-hero shell"><div class="f-hero-copy"><h1>むずかしいを、<br><span>かんたんに。</span></h1><p>福祉事業の運営に必要な資料・動画・ノウハウを<br>すぐ見つけて、すぐ使えるサイトです。</p>${searchForm(r,true).replace('どんな資料をお探しですか？','資料名・キーワードで検索')}<div class="f-search-chips">${chips.map(([label,category,q])=>`<a href="${link(r.design,category,q?new URLSearchParams({q}):undefined)}">${label}</a>`).join('')}</div></div><div class="f-hero-visual"><span class="f-hero-wash" aria-hidden="true"></span><span class="f-hero-note">これ<br>使える！</span><img src="./assets/hero-f-ink.png" alt="パソコンで資料を探す女性の手描きイラスト" width="1536" height="1024" fetchpriority="high"></div></section>
    <section class="f-category-section shell" aria-labelledby="f-category-heading"><div class="f-section-heading"><h2 id="f-category-heading">カテゴリから探す<span class="f-yellow-rays" aria-hidden="true"><i></i><i></i><i></i></span></h2><a href="${link(r.design,'operation',new URLSearchParams({scope:'all'}))}">すべての資料を見る ${icon('arrow')}</a></div><div class="f-entry-grid">${categories.map((c,i)=>fCategoryCard(c,r,i)).join('')}</div></section>
    <section class="f-benefits shell" aria-label="フクシルの特徴"><div class="f-benefit"><span class="f-benefit-icon">${icon('document')}</span><div><h2>豊富な資料</h2><p>すぐ使える様式・ひな形を<br>多数掲載</p></div></div><div class="f-benefit"><span class="f-benefit-icon">${fSymbol('play')}</span><div><h2>1分でわかる</h2><p>資料ごとに短い解説動画で<br>使い方まで理解できる</p></div></div><div class="f-benefit"><span class="f-benefit-icon">${fBulbIcon()}</span><div><h2>現場目線</h2><p>運営のリアルなノウハウを<br>わかりやすく</p></div></div></section>
    <section class="f-consult shell" aria-labelledby="f-consult-heading"><svg class="f-consult-wash" viewBox="0 0 960 340" preserveAspectRatio="none" aria-hidden="true"><path d="M0 28C100-12 230-8 350 42S445 68 505 30S730 17 960 0V340H0Z" fill="#fcf7ed"/></svg><div class="f-consult-visual"><span class="f-consult-note">ひとりで<br>悩まなくていい。</span><img src="./assets/consult-f-ink.png" alt="資料を見ながら運営について相談する二人の手描きイラスト" width="1536" height="1024" loading="lazy" decoding="async"></div><div class="f-consult-copy"><p class="f-consult-kicker">福祉事業の運営サポート</p><h2 id="f-consult-heading">実地指導・運営の不安を、<br><span>60分で整理。</span></h2><p>今の体制や運用を一緒に整理し、<br>必要な対応を具体的にお伝えします。</p><a class="f-consult-button" href="${link(r.design,'consult')}">個別相談を申し込む ${icon('arrow')}</a></div></section>
  </main>`;
}
function fConsultBreadcrumb(r,confirm=false){return `<div class="shell breadcrumb"><a href="${link(r.design)}">ホーム</a>${icon('chevron')}${confirm?`<a href="${link(r.design,'consult')}">個別相談</a>${icon('chevron')}<span>入力内容の確認</span>`:'<span>個別相談</span>'}</div>`;}
function fConsultPage(r){
  return `<main class="f-consult-page" id="main" tabindex="-1"><div class="f-consult-intro shell">${fConsultBreadcrumb(r)}<section class="f-consult-hero"><div class="f-consult-hero-copy"><p class="f-consult-kicker">福祉事業の運営サポート</p><h1>実地指導・運営の不安を、<br><span>60分</span>で整理。</h1><p>今の体制や運用を伺い、確認すべき点と<br>次に取り組むことを一緒に整理します。</p><button class="f-consult-button" type="button" data-f-action="form">${fSymbol('laptop')}オンライン個別相談<span>｜60分</span>${icon('arrow')}</button></div><div class="f-consult-hero-art"><span class="f-worry-note">こんなお悩み<br>ありませんか？</span><ul class="f-worry-list">${['実地指導の準備','加算の確認','書類・運用の見直し','スタッフ育成'].map(t=>`<li>${icon('check')}${t}</li>`).join('')}</ul><img src="./assets/hero-f-ink.png" alt="パソコンに向かい、運営について考える女性" width="1536" height="1024"></div></section></div>
    <section class="f-support shell" aria-labelledby="f-support-heading"><h2 id="f-support-heading">現場を知るLITAXIAがサポート。</h2><div class="f-support-grid"><article>${fSymbol('building')}<h3>直営事業所の運営経験</h3><p>実際の事業所運営で得た<br>視点をもとにサポート。</p></article><article>${icon('document')}<h3>開業から運営まで</h3><p>事業の段階に合わせて<br>課題を整理。</p></article><article>${icon('people')}<h3>人材育成・行政対応</h3><p>現場体制と日々の運用を<br>サポート。</p></article></div><p class="f-support-caption">必要なときに、単発で相談できます。</p></section>
    <section class="f-application shell" id="f-application" aria-labelledby="f-form-heading"><h2 id="f-form-heading">個別相談のお申し込み</h2><p class="f-form-intro">相談したい内容と、ご希望の日時をお知らせください。</p><p class="f-demo-note">デザイン確認用のフォームです。入力内容は送信・保存されません。</p>${fConsultForm()}</section>
  </main>`;
}
function fConsultForm(){
  const d=fUi.draft||{},value=name=>esc(d[name]||'');
  return `<form class="f-consult-form" data-f-consult-form novalidate><div class="f-form-pair"><label for="f-company">事業所名<input id="f-company" name="company" required maxlength="100" autocomplete="off" placeholder="例）株式会社〇〇" value="${value('company')}"></label><label for="f-name">お名前<input id="f-name" name="name" required maxlength="80" autocomplete="off" placeholder="例）山田 太郎" value="${value('name')}"></label><label for="f-email">メールアドレス<input id="f-email" name="email" type="email" required maxlength="160" autocomplete="off" placeholder="例）example@sample.com" value="${value('email')}"></label><label for="f-phone">電話番号 <span>（任意）</span><input id="f-phone" name="phone" type="tel" maxlength="40" autocomplete="off" placeholder="例）090-1234-5678" value="${value('phone')}"></label></div>
    <fieldset class="f-topics"><legend>ご相談のテーマ <span>（複数選択できます）</span></legend><div>${fTopics.map((t,i)=>`<label><input type="checkbox" name="themes" value="${t}" ${d.themes?.includes(t)?'checked':''}>${t}</label>`).join('')}</div></fieldset>
    <label for="f-dates">ご希望の日時<div class="f-date-input"><input id="f-dates" name="dates" required maxlength="250" placeholder="候補日時を2〜3つご記入ください" value="${value('dates')}">${fSymbol('calendar')}</div></label>
    <label for="f-message">ご相談内容 <span>（具体的な内容をご記入ください）</span><textarea id="f-message" name="message" required maxlength="2000" rows="4" placeholder="現在の状況や、相談したい内容をご記入ください。">${value('message')}</textarea></label>
    <div class="f-agreement"><label><input type="checkbox" name="consent" required ${d.consent?'checked':''}>個人情報の取り扱いに同意する</label><button type="button" data-f-action="privacy">プライバシーポリシーを見る</button></div><button type="submit" class="f-consult-button f-confirm-button">確認画面へ進む ${icon('arrow')}</button>
  </form>`;
}
function fConsultConfirm(r){
  const d=fUi.draft;
  if(!d||!fUi.confirmed)return `<main class="shell f-confirm-page" id="main" tabindex="-1"><h1>個別相談のお申し込み</h1><p>お申し込み内容を入力すると、こちらで確認できます。</p><a class="f-consult-button" href="${link(r.design,'consult')}">入力画面へ ${icon('arrow')}</a></main>`;
  const rows=[['事業所名',d.company],['お名前',d.name],['メールアドレス',d.email],['電話番号',d.phone||'未入力'],['ご相談のテーマ',d.themes.join('、')],['ご希望の日時',d.dates],['ご相談内容',d.message],['個人情報の取り扱い','同意する']];
  return `<main class="f-confirm-page shell" id="main" tabindex="-1">${fConsultBreadcrumb(r,true)}<section class="f-confirm-panel"><p class="f-consult-kicker">個別相談のお申し込み</p><h1>入力内容の確認</h1><p>内容をご確認ください。</p><dl class="f-confirm-details">${rows.map(([label,v])=>`<div><dt>${label}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><p class="f-demo-note">こちらは確認画面の見本です。お申し込みは送信されません。</p><div class="f-confirm-actions"><a href="${link(r.design,'consult')}">戻って修正する</a><button type="button" disabled>サンプルのため送信できません</button></div></section></main>`;
}
function fInformation(kind){
  const content={guide:{title:'使い方ガイド',body:'<ol class="f-guide-steps"><li><strong>カテゴリを選ぶ</strong><p>運営・人員配置・工賃会計・研修の入口から探せます。</p></li><li><strong>キーワードやテーマで絞る</strong><p>資料一覧では検索と形式の絞り込みを組み合わせられます。</p></li><li><strong>資料の表示見本を見る</strong><p>資料名を押すと表示見本が開きます。実ファイルの取得や動画再生は未接続です。</p></li></ol>'},notice:{title:'お知らせ（表示見本）',body:'<p class="f-info-body">こちらはお知らせ欄の表示見本です。実際のお知らせは掲載していません。</p>'},account:{title:'マイページ（表示見本）',body:'<p class="f-info-body">こちらは画面確認用のサンプルです。ログインや会員情報の変更には接続していません。</p>'},privacy:{title:'プライバシーポリシー（表示見本）',body:'<p class="f-info-body">このフォームはデザイン確認用です。入力内容は外部へ送信せず、この画面を再読み込みすると消えます。正式なプライバシーポリシーはサービス公開時に掲載する想定です。</p>'}}[kind];
  if(!content)return;
  lastOpened=document.activeElement;
  dialog.innerHTML=`<button type="button" class="dialog-close" data-close aria-label="閉じる">${icon('close')}</button><span class="dialog-label">デザイン確認用</span><h2 id="dialog-title">${content.title}</h2>${content.body}<button type="button" class="f-info-close" data-close>閉じる</button>`;
  dialog.showModal();
}
function fCaptureDraft(form){const data=new FormData(form);fUi.draft={company:String(data.get('company')||''),name:String(data.get('name')||''),email:String(data.get('email')||''),phone:String(data.get('phone')||''),dates:String(data.get('dates')||''),message:String(data.get('message')||''),themes:data.getAll('themes').filter(v=>fTopics.includes(v)),consent:data.has('consent')};}
document.addEventListener('input',event=>{const form=event.target.closest('[data-f-consult-form]');if(form){fCaptureDraft(form);fUi.confirmed=false;form.querySelector('[name=themes]').setCustomValidity('');}});
document.addEventListener('submit',event=>{
  if(!event.target.matches('[data-f-consult-form]'))return;
  event.preventDefault();const form=event.target;fCaptureDraft(form);
  form.querySelector('[name=themes]').setCustomValidity(fUi.draft.themes.length?'':'ご相談のテーマを1つ以上選択してください。');
  if(!form.reportValidity())return;
  fUi.confirmed=true;location.hash=link('f','consult-confirm');
});
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-f-action]');if(!trigger)return;
  event.preventDefault();const action=trigger.dataset.fAction;
  if(action==='menu'){fUi.menu=!fUi.menu;render();document.querySelector('[data-f-action=menu]')?.focus();return;}
  if(action==='form'){document.getElementById('f-application')?.scrollIntoView({behavior:'smooth',block:'start'});document.getElementById('f-company')?.focus({preventScroll:true});return;}
  fInformation(action);
});
window.addEventListener('hashchange',()=>{fUi.menu=false;});
