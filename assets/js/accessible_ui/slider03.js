const root03 = document.querySelector('.demoSlider03');
if (!root03) throw new Error('demoSlider03 が見つかりません');

const swiper03 = new Swiper('.demoSlider03 .swiper', {
	slidesPerView: 1,
	loop: true,
	spaceBetween: 20,
	pagination: {
		el: root03.querySelector('.swiper-pagination'),
		clickable: true,
	},
	navigation: {
		nextEl: root03.querySelector('.swiper-button-next'),
		prevEl: root03.querySelector('.swiper-button-prev'),
	},
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
		init(sw) { updateA11y03(sw); },
		slideChange(sw) { updateA11y03(sw); },
		resize(sw) { updateA11y03(sw); },
		slideChangeTransitionEnd(sw) {
			updateA11y03(sw);
			focusActiveLink03(sw);
		},
	}
});

// --- a11y属性を更新（loop:true対応：重複スライド除外で実数を表示） ---
function updateA11y03(sw) {
	const slides = sw.slides;
	const uniqueTotal =
		Array.from(slides).filter(s => !s.classList.contains('swiper-slide-duplicate')).length
		|| slides.length;

	Array.from(slides).forEach(slide => {
		const isActive = slide.classList.contains('swiper-slide-active');
		const link = slide.querySelector('a,button,[tabindex]');

		// loop:true では data-swiper-slide-index に元インデックスが入る
		const origIndex = slide.getAttribute('data-swiper-slide-index');
		const ordinal = origIndex ? Number(origIndex) + 1 : (Array.from(slides).indexOf(slide) + 1);

		slide.setAttribute('role', 'group');
		slide.setAttribute('aria-roledescription', 'slide');
		slide.setAttribute('aria-label', `スライド ${ordinal} / ${uniqueTotal}`);
		slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

		if (link) link.setAttribute('tabindex', isActive ? '0' : '-1');
	});
}

// --- アクティブスライド内のリンクへフォーカス（遷移完了時） ---
function focusActiveLink03(sw) {
	const active = sw.slides[sw.activeIndex];
	if (!active) return;
	const target = active.querySelector('a[tabindex="0"],button[tabindex="0"],[tabindex="0"]');
	if (!target) return;
	try {
		target.focus({ preventScroll: true });
	} catch {
		target.focus();
	}
}