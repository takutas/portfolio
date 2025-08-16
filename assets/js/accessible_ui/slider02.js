const swiper = new Swiper('.demoSlider02 .swiper', {
	slidesPerView: 'auto',
	centeredSlides: true,
	loop: false,
	spaceBetween: 20,
	pagination: { el: '.swiper-pagination', clickable: true },
	navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	keyboard: { enabled: true, onlyInViewport: true },
	a11y: {
		enabled: true,
		containerMessage: 'デモスライダー',
		prevSlideMessage: '前のスライドへ',
		nextSlideMessage: '次のスライドへ',
		slideLabelMessage: '{{index}}枚目のスライド',
		paginationBulletMessage: '{{index}}枚目を表示',
	},
	observeParents: true,
	observer: true,
	on: {
		init(sw) { updateAccessibility(sw); /* 初期化時は自動フォーカスしない */ },
		slideChange(sw) { updateAccessibility(sw); },
		resize(sw) { updateAccessibility(sw); },
		slideChangeTransitionEnd(sw) {
			// キーボード操作で遷移したときは、遷移完了後にリンクへ自動フォーカス
			if (userInteracted && lastInteractionType === 'keyboard' && document.hasFocus()) {
				autoFocusActiveLink(sw);
			}
			userInteracted = false;
		}
	}
});

// ====== 直近の操作種別とユーザー操作フラグ ======
let userInteracted = false;
let lastInteractionType = 'pointer'; // 'keyboard' | 'pointer'

// 要素参照
const root = document.querySelector('.demoSlider02');
const sliderEl = root?.querySelector('.swiper');
const nextBtn = root?.querySelector('.swiper-button-next');
const prevBtn = root?.querySelector('.swiper-button-prev');
const pagination = root?.querySelector('.swiper-pagination');

// ---- 操作種別の検出 ----
document.addEventListener('mousedown', () => lastInteractionType = 'pointer', { capture: true });
document.addEventListener('pointerdown', () => lastInteractionType = 'pointer', { capture: true });
document.addEventListener('touchstart', () => lastInteractionType = 'pointer', { capture: true });

// スライダー内でキー操作があれば keyboard 扱い
sliderEl?.addEventListener('keydown', (e) => {
	lastInteractionType = 'keyboard';
	// スライド移動につながるキーでは「ユーザー操作あり」に
	if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
		userInteracted = true;
	}
});

// ---- ナビゲーション（クリック／キーボード起動） ----
[nextBtn, prevBtn].forEach(btn => {
	btn?.addEventListener('click', () => { lastInteractionType = 'pointer'; userInteracted = true; });
	btn?.addEventListener('keydown', (e) => {
		lastInteractionType = 'keyboard';
		if (e.key === 'Enter' || e.key === ' ') userInteracted = true;
	});
});

// ---- ページネーション（クリック／キーボード起動） ----
pagination?.addEventListener('click', (e) => {
	if (e.target && e.target.matches('.swiper-pagination-bullet')) {
		lastInteractionType = 'pointer';
		userInteracted = true;
	}
});
pagination?.addEventListener('keydown', (e) => {
	lastInteractionType = 'keyboard';
	if (e.key === 'Enter' || e.key === ' ') userInteracted = true;
});

// ====== アクセシビリティ属性の更新 ======
function updateAccessibility(swiperInstance) {
	const { slides, activeIndex } = swiperInstance;
	const TOTAL = slides.length;

	slides.forEach((slide, index) => {
		const link = slide.querySelector('a');
		const isActive = index === activeIndex;

		slide.setAttribute('role', 'group');
		slide.setAttribute('aria-roledescription', 'slide');
		slide.setAttribute('aria-label', `スライド ${index + 1} / ${TOTAL}`);
		slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

		// アクティブのみ Tab でフォーカス可能
		if (link) link.setAttribute('tabindex', isActive ? '0' : '-1');
	});
}

// ====== アクティブスライド内リンクへ自動フォーカス ======
function autoFocusActiveLink(swiperInstance) {
	const active = swiperInstance.slides[swiperInstance.activeIndex];
	const link = active ? active.querySelector('a[tabindex="0"]') : null;
	if (!link) return;
	try { link.focus({ preventScroll: true }); } catch { link.focus(); }
}