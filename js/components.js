/**
 * KENTECH AX대학원 - 공통 레이아웃 컴포넌트
 *
 * 헤더 / 서브 페이지 상단(제목·경로·탭) / 푸터 / 모바일 메뉴를 한 곳에서 관리한다.
 * 페이지에는 아래 플레이스홀더만 두면 된다. (fetch 를 쓰지 않아 file:// 로도 동작)
 *
 *   <div id="site-header"></div>    상단 헤더 + 전체 메뉴(메가 메뉴)
 *   <div id="site-subhead"></div>   서브 페이지 상단: 분류·제목·경로·같은 분류의 탭 (현재 페이지 기준 자동 생성)
 *   <div id="site-footer"></div>    푸터
 *   <div id="site-overlays"></div>  맨 위로 버튼 + 모바일 메뉴
 *
 * <body data-title="..." data-desc="..."> 로 서브 페이지 제목·설명을 직접 지정할 수 있다.
 * 상세 페이지(예: 공지 글)는 <body data-menu-file="notice.html"> 로 소속 메뉴를 지정한다.
 * 메뉴 항목을 추가하려면 아래 MENU 만 수정하면 모든 페이지에 반영된다.
 */
(function () {
  const SITE = {
    university: 'KENTECH',
    name: 'AX대학원',
    nameEn: 'AX Graduate School',
    home: 'index.html',
    address: '(58330) 전라남도 나주시 켄텍길 21 한국에너지공과대학교(KENTECH)',
    // ※ 대표 전화·이메일이 정해지면 입력하세요. (비어 있으면 푸터에 표시하지 않음)
    tel: '',
    email: '',
    year: 2026,
  };

  /* 실제 페이지가 없는 항목은 '#앵커'로 두면 공용 "작성중" 페이지(page.html)로 연결된다. */
  const MENU = [
    {
      label: '대학원소개',
      en: 'ABOUT',
      children: [
        { label: '원장 인사말', href: '#greeting' },
        { label: '설립목적 및 비전', href: '#vision' },
        { label: '연혁', href: '#history' },
        { label: '조직도', href: '#organization' },
        { label: '오시는 길', href: '#intro-map' },
      ],
    },
    {
      label: '교육과정',
      en: 'ACADEMICS',
      children: [
        { label: '학위과정 안내', href: '#degree' },
        { label: '전공 및 트랙', href: '#tracks' },
        { label: '교과과정', href: '#curriculum' },
        { label: '학사일정', href: '#calendar' },
      ],
    },
    {
      label: '입학안내',
      en: 'ADMISSIONS',
      children: [
        { label: '모집요강', href: '#admission-guide' },
        { label: '입학설명회', href: '#admission-info' },
        { label: '장학제도', href: '#scholarship' },
        { label: '입학 FAQ', href: '#admission-faq' },
      ],
    },
    {
      label: '구성원',
      en: 'PEOPLE',
      children: [
        { label: '교수진', href: '#faculty' },
        { label: '행정직원', href: '#staff' },
      ],
    },
    {
      label: '연구·산학',
      en: 'RESEARCH',
      children: [
        { label: '연구분야', href: '#research-areas' },
        { label: '산학협력', href: '#industry' },
        { label: '연구성과', href: '#achievements' },
      ],
    },
    {
      label: '대학원소식',
      en: 'NEWS',
      children: [
        { label: '공지사항', href: '#notice' },
        { label: '행사·세미나', href: '#events' },
        { label: '언론보도', href: '#press' },
        { label: '자료실', href: '#archive' },
      ],
    },
  ];

  const FAMILY_SITES = [
    ['KENTECH (한국에너지공과대학교)', 'https://www.kentech.ac.kr'],
    ['KENTECH 전남광주지능화혁신연구센터', 'https://jnax.kentech.ac.kr'],
    ['과학기술정보통신부', 'https://www.msit.go.kr'],
    ['산업통상자원부', 'https://www.motie.go.kr'],
  ];

  /** @type {Array<[string, string, boolean?]>} */
  const FOOTER_LINKS = [
    ['개인정보처리방침', '#privacy', true],
    ['이용약관', '#terms'],
    ['이메일무단수집거부', '#email-refusal'],
    ['사이트맵', '#sitemap'],
    ['오시는 길', '#intro-map'],
  ];

  /* 학부인턴 지원 창(applyModal): 모집이 바뀌면 여기와 notice-001.html 을 수정 */
  const INTERN = {
    season: '2026 동계',
    title: 'AX 융합 학부인턴',
    period: '2026. 11. 20.(금) ~ 12. 10.(목)',
    activity: '2026. 12. 28.(월) ~ 2027. 2. 12.(금), 총 7주',
    maxFileMb: 10,
    accept: '.pdf,.hwp,.hwpx,.doc,.docx,.jpg,.jpeg,.png',
    files: [
      { label: '모집 포스터', name: '2026 동계 AX 융합 학부인턴 모집 포스터.pdf', href: 'assets/files/2026-winter-intern-poster.pdf' },
      { label: '붙임1. 참여 연구실 및 연구 주제 소개', name: '붙임1. 참여 연구실 및 연구 주제 소개.pdf', href: 'assets/files/2026-winter-intern-labs.pdf' },
      { label: '붙임2. 자기소개서 및 연구계획서 양식', name: '붙임2. 자기소개서 및 연구계획서 양식.hwpx', href: 'assets/files/2026-winter-intern-essay.hwpx', form: true },
    ],
  };

  // 참여 연구실 (붙임1 기준): [트랙, [지도교수, 연구실명], ...]
  const LABS = [
    ['에너지AI', [
      ['김종권', 'TEAT'], ['안수명', 'Robust Energy AI Lab (REAL)'], ['이범식', 'ENergy, Vision Intelligence Lab (ENVI Lab)'],
      ['이석주', 'Visual Intelligence Energy-Wise (Viewlab)'], ['임혁', 'Sustainable AI Lab'],
    ]],
    ['에너지신소재', [
      ['송주현', 'Battery Software Group'], ['오상호', 'Electron Microscopy for Energy Materials via Environment Manipulation (eM3)'],
      ['윤재호', 'NextGen Photovoltaic Materials & Devices Lab (PMDL)'],
    ]],
    ['차세대그리드', [
      ['김희태', 'Grid Complexity Lab'], ['박화평', 'AI-PEL'], ['이진오', 'Power Systems Laboratory'],
    ]],
    ['수소에너지', [
      ['구근호', 'Meta Lab'],
    ]],
    ['환경기후기술', [
      ['김우열', 'Operando analysis for photo/electro-catalysis lab'], ['오명환', 'Artificial Living Systems (ALS)'],
    ]],
  ];

  /* ------------------------------------------------------------------ */
  /* Pending pages: '#앵커' 항목은 공용 "작성중" 페이지(page.html)로 연결 */
  /* ------------------------------------------------------------------ */
  const PENDING = {};
  // 내용이 작성된 페이지: 여기에 id 를 추가하면 '#id' 링크가 'id.html' 로 연결된다.
  const READY = [
    'greeting', 'vision', 'history', 'organization', 'intro-map',
    'degree', 'tracks', 'curriculum',
    'scholarship',
    'faculty',
    'research-areas', 'industry',
    'notice',
    'sitemap',
  ].reduce((o, id) => ((o[id] = `${id}.html`), o), {});
  const pendingHref = (href) => {
    if (href.charAt(0) !== '#') return href;
    const id = href.slice(1);
    return READY[id] || `page.html?id=${id}`;
  };
  MENU.forEach((m) =>
    m.children.forEach((c) => {
      const id = c.href.charAt(0) === '#' ? c.href.slice(1) : null;
      if (id && !READY[id]) PENDING[id] = { label: c.label, category: m.label };
      c.href = pendingHref(c.href);
    })
  );
  FOOTER_LINKS.forEach((l) => {
    if (l[1].charAt(0) !== '#') return;
    const id = l[1].slice(1);
    if (!PENDING[id] && !READY[id]) PENDING[id] = { label: l[0], category: '' };
    l[1] = pendingHref(l[1]);
  });
  const site = /** @type {any} */ (window);
  site.SITE = SITE;
  site.SITE_MENU = MENU;
  site.SITE_FOOTER_LINKS = FOOTER_LINKS.map(([label, href]) => ({ label, href }));
  site.SITE_PENDING = PENDING;

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  const currentFile = (
    document.body.dataset.menuFile ||
    (location.pathname.split('/').pop() || SITE.home) + (location.search || '')
  ).toLowerCase();

  const menuHref = (item) => item.children[0].href;
  const isCurrent = (href) => href.toLowerCase() === currentFile;
  const activeMenu = MENU.find((m) => m.children.some((c) => isCurrent(c.href)));
  const activeSub = activeMenu && activeMenu.children.find((c) => isCurrent(c.href));
  const footerCurrent = site.SITE_FOOTER_LINKS.find((l) => isCurrent(l.href));
  const cls = (...names) => names.filter(Boolean).join(' ');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const mount = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.outerHTML = html;
  };

  const icon = {
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    external: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
    close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    home: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>',
  };

  const brand = (extra = '') => `
      <a href="${SITE.home}" class="${cls('brand', extra)}" aria-label="${SITE.university} ${SITE.name} 홈으로 이동">
        <img src="assets/images/kentech_symbol.svg" alt="" width="40" height="35">
        <span class="brand-text">
          <span class="brand-univ">${SITE.university}</span>
          <span class="brand-name">${SITE.name}</span>
        </span>
      </a>`;

  /* ------------------------------------------------------------------ */
  /* Header (메뉴에 마우스를 올리면 전체 하위 메뉴가 한 번에 펼쳐지는 메가 메뉴) */
  /* ------------------------------------------------------------------ */
  function renderHeader() {
    const nav = MENU.map(
      (m) => `
          <li class="${cls('gnb-item', m === activeMenu && 'active')}">
            <a href="${menuHref(m)}" class="gnb-link">${m.label}</a>
            <ul class="gnb-sub">
              ${m.children
                .map(
                  (c) =>
                    `<li><a href="${c.href}" class="${cls(isCurrent(c.href) && 'active')}">${esc(c.label)}</a></li>`
                )
                .join('\n              ')}
            </ul>
          </li>`
    ).join('');

    mount(
      'site-header',
      `
  <a href="#main" class="skip-link">본문 바로가기</a>
  <header class="site-header" id="siteHeader">
    <div class="container header-inner">
      ${brand()}

      <nav class="gnb" aria-label="주 메뉴">
        <ul class="gnb-list">${nav}
        </ul>
      </nav>

      <div class="header-actions">
        <a href="https://www.kentech.ac.kr/" class="header-util" target="_blank" rel="noopener noreferrer">KENTECH ${icon.external}</a>
        <button type="button" class="btn btn-accent btn-sm header-cta" data-open-apply>동계인턴 지원</button>
        <button type="button" class="menu-toggle" id="menuToggle" aria-label="전체 메뉴 열기" aria-controls="mobileMenu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`
    );
  }

  /* ------------------------------------------------------------------ */
  /* Sub page head: 분류 · 제목 · 경로 · 같은 분류의 탭                   */
  /* ------------------------------------------------------------------ */
  function renderSubhead() {
    if (!document.getElementById('site-subhead')) return;
    const ds = document.body.dataset;
    const pendingId = new URLSearchParams(location.search).get('id');
    const pendingInfo = currentFile.indexOf('page.html') === 0 ? PENDING[pendingId] : null;

    const title =
      ds.title ||
      (activeSub && activeSub.label) ||
      (footerCurrent && footerCurrent.label) ||
      (pendingInfo && pendingInfo.label) ||
      '작성중';
    const category = activeMenu ? activeMenu.label : '';
    const categoryEn = activeMenu ? activeMenu.en : 'AX GRADUATE SCHOOL';
    document.title = `${title} | ${SITE.university} ${SITE.name}`;

    const crumbs = [`<a href="${SITE.home}" class="crumb-home">${icon.home}<span>홈</span></a>`];
    if (activeMenu) crumbs.push(`<a href="${menuHref(activeMenu)}">${activeMenu.label}</a>`);
    crumbs.push(`<span aria-current="page">${esc(title)}</span>`);

    const tabs = activeMenu
      ? `
    <nav class="subnav" aria-label="${activeMenu.label} 하위 메뉴">
      <div class="container">
        <ul class="subnav-list">
          ${activeMenu.children
            .map(
              (c) =>
                `<li><a href="${c.href}" class="${cls(isCurrent(c.href) && 'active')}"${isCurrent(c.href) ? ' aria-current="page"' : ''}>${esc(c.label)}</a></li>`
            )
            .join('\n          ')}
        </ul>
      </div>
    </nav>`
      : '';

    mount(
      'site-subhead',
      `
  <section class="subhead" aria-labelledby="pageTitle">
    <div class="subhead-bg" aria-hidden="true"></div>
    <div class="container subhead-inner">
      <p class="eyebrow">${categoryEn}${category ? ` · ${category}` : ''}</p>
      <h1 class="subhead-title" id="pageTitle">${esc(title)}</h1>
      ${ds.desc ? `<p class="subhead-desc">${esc(ds.desc)}</p>` : ''}
      <ol class="crumbs" aria-label="현재 위치">${crumbs.map((c) => `<li>${c}</li>`).join('')}</ol>
    </div>
  </section>${tabs}`
    );
  }

  /* ------------------------------------------------------------------ */
  /* Footer                                                              */
  /* ------------------------------------------------------------------ */
  function renderFooter() {
    const links = FOOTER_LINKS.map(
      ([label, href, highlight]) => `<li><a href="${href}" class="${cls(highlight && 'highlight')}">${label}</a></li>`
    ).join('\n            ');
    const options = FAMILY_SITES.map(([label, url]) => `<option value="${url}">${label}</option>`).join(
      '\n              '
    );
    const contact = [
      SITE.tel && `<span>TEL ${SITE.tel}</span>`,
      SITE.email && `<span>E-MAIL <a href="mailto:${SITE.email}">${SITE.email}</a></span>`,
    ]
      .filter(Boolean)
      .join('');

    mount(
      'site-footer',
      `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        ${brand('brand-footer')}
        <ul class="footer-links">
            ${links}
        </ul>
      </div>
      <div class="footer-bottom">
        <div class="footer-info">
          <p>${SITE.address}</p>
          ${contact ? `<p class="footer-contact">${contact}</p>` : ''}
          <p class="footer-copy">Copyright © ${SITE.year} ${SITE.university} ${SITE.name}. All rights reserved.</p>
        </div>
        <div class="footer-family">
          <label for="familySites" class="sr-only">관련 기관 바로가기</label>
          <select id="familySites" class="family-select">
            <option value="">관련 기관 바로가기</option>
              ${options}
          </select>
        </div>
      </div>
    </div>
  </footer>`
    );
  }

  /* ------------------------------------------------------------------ */
  /* Overlays: 맨 위로 버튼, 모바일 전체 메뉴                              */
  /* ------------------------------------------------------------------ */
  function renderOverlays() {
    const groups = MENU.map((m) => {
      const open = m === activeMenu;
      return `
        <div class="${cls('mm-group', open && 'open')}">
          <button type="button" class="mm-title" aria-expanded="${open}">
            <span>${m.label}</span>${icon.chevron}
          </button>
          <ul class="mm-sub">
            ${m.children
              .map(
                (c) => `<li><a href="${c.href}" class="${cls(isCurrent(c.href) && 'active')}">${esc(c.label)}</a></li>`
              )
              .join('\n            ')}
          </ul>
        </div>`;
    }).join('');

    const labOptions = LABS.map(
      ([track, labs]) => `
            <optgroup label="${track}">${labs
              .map(([prof, lab]) => `<option value="[${track}] ${prof} - ${esc(lab)}">${prof} · ${esc(lab)}</option>`)
              .join('')}</optgroup>`
    ).join('');

    mount(
      'site-overlays',
      `
  <button type="button" class="to-top" id="toTop" aria-label="맨 위로 가기">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>
  </button>

  <div class="mobile-menu" id="mobileMenu" aria-label="전체 메뉴" aria-hidden="true">
    <div class="mm-head">
      ${brand()}
      <button type="button" class="mm-close" id="menuClose" aria-label="전체 메뉴 닫기">${icon.close}</button>
    </div>
    <div class="mm-body">${groups}
    </div>
    <div class="mm-foot">
      <button type="button" class="btn btn-accent" data-open-apply>동계인턴 지원하기 ${icon.arrow}</button>
    </div>
  </div>

  <!-- 학부인턴 지원 (지원 내용은 구글 시트, 제출서류는 구글 드라이브에 저장 - 설정 방법: server/README.md) -->
  <div class="modal-overlay" id="applyModal" role="dialog" aria-modal="true" aria-labelledby="applyModalTitle" aria-hidden="true">
    <div class="modal-box">
      <button type="button" class="modal-close" aria-label="지원서 닫기">${icon.close}</button>
      <div class="modal-head">
        <h2 id="applyModalTitle">${INTERN.title} 지원</h2>
      </div>

      <dl class="event-info">
        <dt>접수기간</dt><dd>${INTERN.period}</dd>
        <dt>활동기간</dt><dd>${INTERN.activity}</dd>
        <dt>모집대상</dt><dd>타 대학교 학부 2학년 이상 재학생(내국인)</dd>
      </dl>

      <form id="applyForm" class="form-stack" novalidate>
        <input type="hidden" name="program" value="${INTERN.season} ${INTERN.title}">
        <!-- 스팸 방지용 (사람에게는 보이지 않음) -->
        <input type="text" name="website" class="form-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">

        <div class="form-row">
          <div class="form-field">
            <label for="applyName">성명 *</label>
            <input type="text" id="applyName" name="name" required autocomplete="name" placeholder="홍길동">
          </div>
          <div class="form-field">
            <label for="applyGrade">학년 *</label>
            <select id="applyGrade" name="grade" required>
              <option value="">선택하세요</option>
              <option>2학년</option>
              <option>3학년</option>
              <option>4학년</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="applyUniv">소속 대학교 *</label>
            <input type="text" id="applyUniv" name="university" required autocomplete="organization" placeholder="예: OO대학교">
          </div>
          <div class="form-field">
            <label for="applyMajor">학과(전공) *</label>
            <input type="text" id="applyMajor" name="major" required placeholder="예: 전기공학과">
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="applyPhone">연락처 *</label>
            <input type="tel" id="applyPhone" name="phone" required autocomplete="tel" inputmode="numeric" pattern="0\\d{1,2}-?\\d{3,4}-?\\d{4}" placeholder="010-0000-0000">
          </div>
          <div class="form-field">
            <label for="applyEmail">이메일 *</label>
            <input type="email" id="applyEmail" name="email" required autocomplete="email" placeholder="example@univ.ac.kr">
          </div>
        </div>

        <div class="form-field">
          <label for="applyLab">희망 연구실 *</label>
          <select id="applyLab" name="lab" required>
            <option value="">선택하세요</option>${labOptions}
          </select>
          <p class="form-hint">연구실별 연구 주제는 <a href="${INTERN.files[1].href}" target="_blank" rel="noopener">붙임1. 참여 연구실 및 연구 주제 소개</a>에서 확인하세요.</p>
        </div>

        <fieldset class="form-files">
          <legend>제출서류 * <small>PDF·HWP·Word·이미지, 파일당 ${INTERN.maxFileMb}MB · 합계 20MB 이하</small></legend>
          <div class="form-downloads">
            <span>양식 내려받기</span>
            ${INTERN.files
              .filter((f) => f.form)
              .map((f) => `<a href="${f.href}" download="${f.name}">${f.label}</a>`)
              .join('\n            ')}
          </div>
          <div class="form-field">
            <label for="fileEssay">자기소개서 및 연구계획서 *</label>
            <input type="file" id="fileEssay" name="fileEssay" required accept="${INTERN.accept}">
          </div>
          <div class="form-field">
            <label for="fileTranscript">성적증명서 * <small>(2026년 8월 이후 발급 권장)</small></label>
            <input type="file" id="fileTranscript" name="fileTranscript" required accept="${INTERN.accept}">
          </div>
        </fieldset>

        <div class="form-notice">
          <strong>개인정보 수집·이용 안내</strong><br>
          수집 항목: 성명, 소속 대학교·학과·학년, 연락처, 이메일, 제출서류 · 이용 목적: 학부인턴 선발 및 안내 연락 · 보유 기간: 선발 종료 후 1년<br>
          동의를 거부할 수 있으나, 거부 시 지원이 제한됩니다.
        </div>
        <label class="form-check" for="applyAgree">
          <input type="checkbox" id="applyAgree" name="agree" value="Y" required data-error="개인정보 수집·이용에 동의해 주세요.">
          <span>개인정보 수집·이용에 동의합니다. *</span>
        </label>

        <p class="form-error" id="applyError" role="alert" hidden></p>

        <button type="submit" class="btn btn-accent btn-submit" id="applySubmit">지원서 제출하기</button>
      </form>
    </div>
  </div>`
    );
  }

  renderHeader();
  renderSubhead();
  renderFooter();
  renderOverlays();

  // 페이지 본문의 '#앵커' 링크 중 대상이 없는 것도 실제 페이지 또는 "작성중" 페이지로 연결
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if ((PENDING[id] || READY[id]) && !document.getElementById(id)) a.setAttribute('href', pendingHref('#' + id));
  });
})();
