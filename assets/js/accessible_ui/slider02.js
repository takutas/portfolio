// ===============================
// demoSlider02 アクセシブルスライダー
// ===============================

const root = document.querySelector('.demoSlider02');

// Swiper 本体の初期化
const swiper = new Swiper('.demoSlider02 .swiper', {
	slidesPerView: 1,   // 1枚ずつ表示
	loop: false,        // 無限ループなし（実インデックス管理しやすい）
	spaceBetween: 20,   // スライド間の余白

	// ページネーション
	pagination: {
		el: root.querySelector('.swiper-pagination'),
		clickable: true,
	},

	// 前後ナビゲーション
	navigation: {
		nextEl: root.querySelector('.swiper-button-next'),
		prevEl: root.querySelector('.swiper-button-prev'),
	},

	// キーボード操作を有効化（← → キー）
	keyboard: { enabled: true },

	// アクセシビリティ関連テキスト
	a11y: {
		enabled: true,
		containerMessage: 'デモスライダー',
		prevSlideMessage: '前のスライドへ',
		nextSlideMessage: '次のスライドへ',
		slideLabelMessage: '{{index}}枚目のスライド',
		paginationBulletMessage: '{{index}}枚目を表示',
	},

	// イベントフック
	on: {
		// 初期化・スライド切替・リサイズ時に属性を更新
		init(sw) { updateA11y(sw); },
		slideChange(sw) { updateA11y(sw); },
		resize(sw) { updateA11y(sw); },

		// 遷移完了後：アクティブリンクへ自動フォーカス
		slideChangeTransitionEnd(sw) {
			updateA11y(sw);
			focusActiveLink(sw);
		}
	}
});

// ===============================
// a11y属性の更新（role/label/tabindex）
// ===============================
function updateA11y(sw) {
	const slides = sw.slides;

	// ループモード時、複製スライドを除いた総数を算出
	const uniqueTotal =
		slides.filter(s => !s.classList.contains('swiper-slide-duplicate')).length
		|| slides.length;

	slides.forEach(slide => {
		const isActive = slide.classList.contains('swiper-slide-active');
		const link = slide.querySelector('a,button,[tabindex]');

		// 元インデックス（loop:true時は data-swiper-slide-index を参照）
		const origIndex = slide.getAttribute('data-swiper-slide-index');
		const ordinal = origIndex
			? Number(origIndex) + 1
			: (Array.from(slides).indexOf(slide) + 1);

		// スライド要素にロール・ラベルを付与
		slide.setAttribute('role', 'group');
		slide.setAttribute('aria-roledescription', 'slide');
		slide.setAttribute('aria-label', `スライド ${ordinal} / ${uniqueTotal}`);
		slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

		// アクティブなスライド内リンクのみ Tab 移動可
		if (link) link.setAttribute('tabindex', isActive ? '0' : '-1');
	});
}

// ===============================
// アクティブスライドの要素へフォーカス移動
// ===============================
function focusActiveLink(sw) {
	const active = sw.slides[sw.activeIndex];
	if (!active) return;

	// フォーカス可能要素を優先的に取得
	const target = active.querySelector('a[tabindex="0"],button[tabindex="0"],[tabindex="0"]');
	if (!target) return;

	// preventScrollで画面スクロールを抑制（未対応ブラウザはcatchへ）
	try {
		target.focus({ preventScroll: true });
	} catch {
		target.focus();
	}
}