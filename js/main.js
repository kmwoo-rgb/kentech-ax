/**
 * KENTECH AX대학원 - 화면 동작
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initToTop();
  initFamilySites();
  initPendingLinks();
  initReveal();
  initHeroNetwork();
  initApplyModal();
  initApplyForm();
});

/* ==========================================================================
   Header: 스크롤 시 배경 표시 (메인 페이지는 첫 화면에서 투명)
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ==========================================================================
   Mobile Menu (전체 화면 메뉴 + 아코디언)
   ========================================================================== */
function initMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('menuClose');
  if (!menu || !toggle) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && close) close.focus();
    else toggle.focus({ preventScroll: true });
  };

  toggle.addEventListener('click', () => setOpen(true));
  if (close) close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
  });

  menu.querySelectorAll('.mm-title').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.mm-group');
      const open = group.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}

/* ==========================================================================
   Back To Top
   ========================================================================== */
function initToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  const update = () => btn.classList.toggle('visible', window.scrollY > 400);
  update();
  window.addEventListener('scroll', update, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ==========================================================================
   Family Sites (선택 즉시 새 창으로 이동)
   ========================================================================== */
function initFamilySites() {
  const select = /** @type {HTMLSelectElement | null} */ (document.getElementById('familySites'));
  if (!select) return;
  select.addEventListener('change', () => {
    if (select.value) window.open(select.value, '_blank', 'noopener');
    select.selectedIndex = 0;
  });
}

/* ==========================================================================
   Pending Links (대상 페이지/섹션이 아직 없는 '#앵커' 링크)
   ========================================================================== */
function initPendingLinks() {
  document.addEventListener('click', (e) => {
    const a = /** @type {Element} */ (e.target).closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href.length < 2 || href === '#main') return;
    if (document.getElementById(decodeURIComponent(href.slice(1)))) return;
    e.preventDefault();
    showToast('준비 중인 페이지입니다.');
  });
}

/* ==========================================================================
   Reveal on scroll (.reveal 요소가 화면에 들어오면 서서히 표시)
   ========================================================================== */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }),
    { rootMargin: '0px 0px -10% 0px' }
  );
  items.forEach((el) => io.observe(el));
}

/* ==========================================================================
   Hero Network (메인 첫 화면 배경: 점과 선이 연결되는 AI 네트워크 그림)
   ========================================================================== */
function initHeroNetwork() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (document.getElementById('heroCanvas'));
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINK = 140; // 이 거리(px) 안의 점끼리 선으로 연결
  let w = 0;
  let h = 0;
  let nodes = [];
  let raf = 0;
  let visible = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(110, (w * h) / 14000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
      hot: Math.random() < 0.12,
    }));
    if (still || !raf) draw();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > LINK) continue;
        ctx.strokeStyle = `rgba(129, 140, 248, ${(1 - d / LINK) * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    nodes.forEach((n) => {
      ctx.fillStyle = n.hot ? 'rgba(34, 211, 238, 0.95)' : 'rgba(199, 210, 254, 0.7)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.hot ? n.r + 1 : n.r, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const step = () => {
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
    draw();
    raf = visible && !document.hidden ? requestAnimationFrame(step) : 0;
  };

  const start = () => {
    if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(step);
  };

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', start);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    }).observe(canvas);
  }
  start();
}

/* ==========================================================================
   학부인턴 지원 창 (data-open-apply 속성이 있는 버튼이면 어디서든 열림)
   주소 끝에 #apply 를 붙여 들어오면 바로 연다. (예: index.html#apply - 포스터 QR 용)
   ========================================================================== */
function initApplyModal() {
  const modal = document.getElementById('applyModal');
  if (!modal) return;
  let opener = null;

  const setOpen = (open) => {
    modal.classList.toggle('active', open);
    modal.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      modal.querySelector('.modal-close').focus();
    } else if (opener) {
      opener.focus({ preventScroll: true });
      opener = null;
    }
  };

  document.addEventListener('click', (e) => {
    const btn = /** @type {Element} */ (e.target).closest('[data-open-apply]');
    if (!btn) return;
    e.preventDefault();
    // 모바일 전체 메뉴에서 눌렀으면 메뉴를 먼저 닫는다.
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) document.getElementById('menuClose').click();
    opener = /** @type {HTMLElement} */ (btn);
    setOpen(true);
  });
  modal.querySelector('.modal-close').addEventListener('click', () => setOpen(false));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) setOpen(false);
  });

  /** @type {any} */ (window).closeApplyModal = () => setOpen(false);
  if (location.hash === '#apply') setOpen(true);
}

/* ==========================================================================
   학부인턴 지원 Form
   - APPLY_ENDPOINT 에 Google Apps Script 웹앱 URL(…/exec)을 넣으면 지원 내용과
     제출서류는 구글 시트·드라이브에 저장된다. (설정 방법: server/README.md)
   - 비어 있으면 데모 모드로 동작한다. (실제 저장 없음)
   ========================================================================== */
const APPLY_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxj_bnhjVktwPYVSEgfzRxMCyMSagULFXuretFPhksZ_Y1Sx8dHXOyvVkU3zSEvAdBuEQ/exec';
const APPLY_MAX_FILE_MB = 10;
const APPLY_MAX_TOTAL_MB = 20; // 첨부 합계 한도 (server/apps-script.gs 의 MAX_TOTAL_MB 와 같게)
const APPLY_FILE_EXT = /\.(pdf|hwp|hwpx|doc|docx|jpg|jpeg|png)$/i;

function initApplyForm() {
  const form = /** @type {HTMLFormElement | null} */ (document.getElementById('applyForm'));
  if (!form) return;

  const errorEl = document.getElementById('applyError');
  const submitBtn = /** @type {HTMLButtonElement} */ (document.getElementById('applySubmit'));
  const submitLabel = submitBtn.textContent;
  const fields = Array.from(
    /** @type {NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (
      form.querySelectorAll('input, select, textarea')
    )
  ).filter((f) => f.type !== 'hidden' && !f.classList.contains('form-honeypot'));
  const fileInputs = /** @type {HTMLInputElement[]} */ (fields.filter((f) => f.type === 'file'));
  const labelOf = (f) => {
    const label = form.querySelector(`label[for="${f.id}"]`);
    return label ? label.childNodes[0].textContent.replace('*', '').trim() : '입력값';
  };

  const showError = (msg) => {
    errorEl.textContent = msg;
    errorEl.hidden = !msg;
  };

  // 파일 형식·크기 검사 (선택 즉시)
  fileInputs.forEach((f) =>
    f.addEventListener('change', () => {
      const file = f.files[0];
      let msg = '';
      if (file && !APPLY_FILE_EXT.test(file.name)) msg = `${labelOf(f)}: PDF, HWP, Word, 이미지 파일만 첨부할 수 있습니다.`;
      else if (file && file.size > APPLY_MAX_FILE_MB * 1024 * 1024) msg = `${labelOf(f)}: 파일은 ${APPLY_MAX_FILE_MB}MB 이하만 첨부할 수 있습니다.`;
      f.setCustomValidity(msg);
    })
  );

  fields.forEach((f) =>
    ['input', 'change'].forEach((type) =>
      f.addEventListener(type, () => {
        f.classList.remove('invalid');
        showError('');
      })
    )
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const invalid = fields.filter((f) => !f.checkValidity());
    fields.forEach((f) => f.classList.toggle('invalid', invalid.includes(f)));
    if (invalid.length) {
      const first = invalid[0];
      showError(
        first.validationMessage && first.validity.customError
          ? first.validationMessage
          : first.dataset.error || `${labelOf(first)} 항목을 올바르게 입력해 주세요.`
      );
      first.focus();
      return;
    }
    const total = fileInputs.reduce((sum, f) => sum + f.files[0].size, 0);
    if (total > APPLY_MAX_TOTAL_MB * 1024 * 1024) {
      showError(`첨부파일 합계는 ${APPLY_MAX_TOTAL_MB}MB 이하만 보낼 수 있습니다. 파일 크기를 줄여 주세요.`);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '제출 중입니다… (파일 업로드에 시간이 걸릴 수 있습니다)';
    showError('');

    try {
      const payload = {};
      new FormData(form).forEach((value, key) => {
        if (typeof value === 'string') payload[key] = value;
      });
      payload.files = {};
      for (const f of fileInputs) {
        const file = f.files[0];
        payload.files[f.name] = { name: file.name, type: file.type, data: await readBase64(file) };
      }

      let receiptNo = '';
      if (APPLY_ENDPOINT) {
        // Apps Script 는 CORS 사전요청(preflight)을 지원하지 않으므로 text/plain 으로 보낸다.
        const res = await fetch(APPLY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (!result.ok) {
          showError(result.message || '지원서 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          return;
        }
        receiptNo = result.receiptNo || '';
      } else {
        console.warn('[apply] APPLY_ENDPOINT 가 비어 있어 저장하지 않았습니다. (데모 모드)', payload);
      }
      showToast(`지원서가 접수되었습니다.${receiptNo ? ` (접수번호 ${receiptNo})` : ''}`);
      form.reset();
      setTimeout(() => /** @type {any} */ (window).closeApplyModal(), 1500);
    } catch (err) {
      showError('지원서 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });
}

// File -> base64 문자열 (data:...;base64, 앞부분 제외)
function readBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/* ==========================================================================
   Toast
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(/** @type {any} */ (toast).timer);
  /** @type {any} */ (toast).timer = setTimeout(() => toast.classList.remove('show'), 2400);
}
