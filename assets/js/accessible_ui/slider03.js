const root = document.querySelector('.demoSlider03');              // ラッパ
const sliderEl = root?.querySelector('.swiper');                    // スライダー本体
const nextBtn = root?.querySelector('.swiper-button-next');
const prevBtn = root?.querySelector('.swiper-button-prev');
const pagEl = root?.querySelector('.swiper-pagination');

// 直近の操作タイプと「ユーザーが操作したか」フラグ
let lastInteractionType = 'pointer'; // 'keyboard' | 'pointer'
let userInteracted = false;

const swiper = new Swiper('.demoSlider03 .swiper', {
	slidesPerView: 1,
	loop: true,
	spaceBetween: 20,
	pagination: { el: '.swiper-pagination', clickable: true },
	navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	keyboard: { enabled: true },
	a11y: {
		enabled: true,
		containerMessage: 'デモスライダー',
		prevSlideMessage: '前のスライドへ',
		nextSlideMessage: '次のスライドへ',
		slideLabelMessage: '{{index}}枚目のスライド',
		paginationBulletMessage: '{{index}}枚目を表示',
	},
	on: {
		init(sw) {
			updateAccessibility(sw);          // 初期化時は属性だけ更新（自動フォーカスしない）
		},
		slideChange(sw) {
			updateAccessibility(sw);          // 変化中でも属性はなるべく早く更新
		},
		slideChangeTransitionEnd(sw) {
			updateAccessibility(sw);          // 念のため最終確定でも更新
			// キーボード操作で遷移した時だけ、アクティブスライド内リンクに自動フォーカス
			if (userInteracted && lastInteractionType === 'keyboard' && document.hasFocus()) {
				// loop:true だと複製差し替えが起きるので 1 フレーム遅らせてからフォーカス
				requestAnimationFrame(() => autoFocusActiveLink(sw));
			}
			userInteracted = false;
		},
		resize(sw) {
			updateAccessibility(sw);
		}
	}
});

// ---- 操作タイプの検出（クリック/ポインタ） ----
document.addEventListener('mousedown', () => lastInteractionType = 'pointer', { capture: true });
document.addEventListener('pointerdown', () => lastInteractionType = 'pointer', { capture: true });
document.addEventListener('touchstart', () => lastInteractionType = 'pointer', { capture: true });

// ---- スライダー内のキーボード操作を検出 ----
sliderEl?.addEventListener('keydown', (e) => {
	lastInteractionType = 'keyboard';
	// スライド移動につながる操作のときに「ユーザー操作あり」を立てる
	if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
		userInteracted = true;
	}
});

// ---- ナビゲーション（クリック／キーボード起動の両方） ----
[nextBtn, prevBtn].forEach(btn => {
	btn?.addEventListener('click', () => { lastInteractionType = 'pointer'; userInteracted = true; });
	btn?.addEventListener('keydown', (e) => {
		lastInteractionType = 'keyboard';
		if (e.key === 'Enter' || e.key === ' ') userInteracted = true;
	});
});

// ---- ページネーション（クリック／キーボード起動の両方） ----
pagEl?.addEventListener('click', (e) => {
	if (e.target && e.target.matches('.swiper-pagination-bullet')) {
		lastInteractionType = 'pointer';
		userInteracted = true;
	}
});
pagEl?.addEventListener('keydown', (e) => {
	lastInteractionType = 'keyboard';
	if (e.key === 'Enter' || e.key === ' ') userInteracted = true;
});

// ====== アクセシビリティ属性を更新 ======
function updateAccessibility(swiperInstance) {
	const slides = Array.from(swiperInstance.slides);
	const uniqueTotal = slides.filter(s => !s.classList.contains('swiper-slide-duplicate')).length || slides.length;
	const activeEl = swiperInstance.slides[swiperInstance.activeIndex];

	slides.forEach((slide) => {
		const link = slide.querySelector('a');
		const isActive = slide === activeEl;

		// もとのインデックス（loop:true だと data-swiper-slide-index が付く）
		const origIndex = slide.getAttribute('data-swiper-slide-index');
		const ordinal = origIndex ? Number(origIndex) + 1 : (slides.indexOf(slide) + 1);

		slide.setAttribute('role', 'group');
		slide.setAttribute('aria-roledescription', 'slide');
		slide.setAttribute('aria-label', `スライド ${ordinal} / ${uniqueTotal}`);

		// アクティブのみ読み上げ対象＆Tab移動可
		slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
		if (link) link.setAttribute('tabindex', isActive ? '0' : '-1');
	});
}

// ====== アクティブスライド内リンクへ自動フォーカス ======
function autoFocusActiveLink(swiperInstance) {
	const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
	if (!activeSlide) return;
	const focusable = activeSlide.querySelector('a[tabindex="0"], button[tabindex="0"], [tabindex="0"]');
	if (!focusable) return;
	try {
		focusable.focus({ preventScroll: true });
	} catch {
		focusable.focus();
	}
}