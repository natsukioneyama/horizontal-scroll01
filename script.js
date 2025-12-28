/* =========================
   INFO PAGE TOGGLE
   ========================= */

const infoLinks = document.querySelectorAll('.js-info');
const infoPage = document.getElementById('infoPage');
const infoClose = document.querySelector('.js-info-close');

function setInfoOpen(isOpen){
  document.body.classList.toggle('info-open', isOpen);
  if(infoPage){
    infoPage.setAttribute('aria-hidden', String(!isOpen));
  }
}

if(infoLinks.length && infoPage){
  infoLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      setInfoOpen(!document.body.classList.contains('info-open'));
    });
  });

  infoPage.addEventListener('click', (e) => {
    if(e.target.closest('.info-page__inner')) return;
    setInfoOpen(false);
  });
}

if(infoClose){
  infoClose.addEventListener('click', (e) => {
    e.preventDefault();
    setInfoOpen(false);
  });
}


/* =========================
   NAV ACTIVE LINK
   ========================= */

(() => {
  const links = document.querySelectorAll('.nav-link[href]');
  const currentPath = location.pathname.split('/').pop();

  links.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();

    if (linkPath === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();



/* =========================
   Mobile Nav Toggle (nav-toggle + nav-open)
   ========================= */

(function () {
  const nav = document.querySelector('[data-nav]');
  const navInner = nav ? nav.querySelector('.nav-inner') : null;
  const navMenu = document.getElementById('navMenu');

  if (!nav || !navInner || !navMenu) return;

  // すでにボタンがあるなら二重生成しない
  if (navInner.querySelector('.nav-toggle')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = 'Menu';

  // 右側に置きたいので navInner の末尾に追加
  navInner.appendChild(btn);

  function setOpen(isOpen) {
    document.body.classList.toggle('nav-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  }

  btn.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('nav-open');
    setOpen(!isOpen);
  });

  // メニュー内リンククリックで閉じる（Overview/Project移動時のUX改善）
  navMenu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (document.body.classList.contains('nav-open')) setOpen(false);
  });

  // Escで閉じる（デスクトップ幅で確認する時にも便利）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setOpen(false);
    }
  });
})();




















/* =========================
HOrizontal scroll 
========================= */

(() => {
  const nav = document.querySelector("[data-nav]");
  const scroller = document.querySelector(".grid-inner"); // 横スクロール時の要素
  if (!nav) return;

  // “戻ったら出す” の判定幅（お好みで微調整）
  const THRESHOLD_Y = 14; // 縦：上に戻る/下に進む判定
  const THRESHOLD_X = 18; // 横：左に戻る/右に進む判定

  let lastY = window.scrollY;
  let lastX = scroller ? scroller.scrollLeft : 0;

  let ticking = false;

  const setHidden = (hidden) => {
    nav.classList.toggle("is-faded", hidden);
  };

  const update = () => {
    const y = window.scrollY;
    const x = scroller ? scroller.scrollLeft : 0;

    const dy = y - lastY; // +下へ / -上へ
    const dx = x - lastX; // +右へ / -左へ

    // 横スクロール“モード”判定：
    // ・横レイアウトが効いている（あなたのCSS条件）
    // ・かつ scroller が存在し、実際に横スクロールできる
    const horizontalMode =
      window.matchMedia("(min-width: 900px) and (orientation: landscape)").matches &&
      scroller &&
      scroller.scrollWidth > scroller.clientWidth;

    if (horizontalMode) {
      // 横スクロール時：右へ進めば隠す / 左へ戻せば出す
      if (dx > THRESHOLD_X) setHidden(true);
      if (dx < -THRESHOLD_X) setHidden(false);

      // 注意：x===0 でも強制表示しない（要件C）
    } else {
      // 縦スクロール時：下へ進めば隠す / 上へ戻せば出す
      if (dy > THRESHOLD_Y) setHidden(true);
      if (dy < -THRESHOLD_Y) setHidden(false);

      // 注意：y===0 でも強制表示しない（要件C）
    }

    lastY = y;
    lastX = x;
  };

  const rafUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  // 縦スクロール監視
  window.addEventListener("scroll", rafUpdate, { passive: true });

  // 横スクロール監視（scroller がある時だけ）
  if (scroller) scroller.addEventListener("scroll", rafUpdate, { passive: true });

  // 初期状態：表示
  setHidden(false);
})();



