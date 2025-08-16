const root = document.querySelector('.demoSlider02');
if (!root) throw new Error('demoSlider02 が見つかりません');

const swiper = new Swiper('.demoSlider02 .swiper', {
	slidesPerView: 1,
	loop: false,
	spaceBetween: 20,
	pagination: {
		el: root.querySelector('.swiper-pagination'),
		clickable: true,
	},
	navigation: {
		nextEl: root.querySelector('.swiper-button-next'),
		prevEl: root.querySelector('.swiper-button-prev'),
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
		init(sw) { updateA11y(sw); },
		slideChange(sw) { updateA11y(sw); },
		resize(sw) { updateA11y(sw); },
		// 参考ソース同様、遷移完了時にアクティブのリンクへフォーカス
		slideChangeTransitionEnd(sw) {
			updateA11y(sw);
			focusActiveLink(sw);
		}
	}
});

// ---- a11y属性を更新（loop:true対応） ----
function updateA11y(sw) {
	const slides = sw.slides;
	// ループ複製を除いた実数
	const uniqueTotal =
		slides.filter(s => !s.classList.contains('swiper-slide-duplicate')).length || slides.length;

	slides.forEach(slide => {
		const isActive = slide.classList.contains('swiper-slide-active');
		const link = slide.querySelector('a,button,[tabindex]');

		// 元の順番（loop:trueだと data-swiper-slide-index が付与される）
		const origIndex = slide.getAttribute('data-swiper-slide-index');
		const ordinal = origIndex ? Number(origIndex) + 1 : (Array.from(slides).indexOf(slide) + 1);

		slide.setAttribute('role', 'group');
		slide.setAttribute('aria-roledescription', 'slide');
		slide.setAttribute('aria-label', `スライド ${ordinal} / ${uniqueTotal}`);
		slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

		if (link) link.setAttribute('tabindex', isActive ? '0' : '-1');
	});
}

// ---- アクティブスライド内のフォーカス可能要素にフォーカス ----
function focusActiveLink(sw) {
	const active = sw.slides[sw.activeIndex];
	if (!active) return;
	const target = active.querySelector('a[tabindex="0"],button[tabindex="0"],[tabindex="0"]');
	if (!target) return;
	try { target.focus({ preventScroll: true }); } catch { target.focus(); }
}