// ===============================
// demoSlider03 アクセシブルスライダー
// ===============================

// スライダー全体のラッパ要素を取得
const root = document.querySelector('.demoSlider03');

// Swiper の初期化
const swiper = new Swiper('.demoSlider03 .swiper', {
	slidesPerView: 1,   // 1枚表示
	loop: true,         // 無限ループ
	spaceBetween: 20,   // スライド間の余白

	// ページネーション
	pagination: {
		el: root.querySelector('.swiper-pagination'),
		clickable: true,
	},

	// 前後ボタン
	navigation: {
		nextEl: root.querySelector('.swiper-button-next'),
		prevEl: root.querySelector('.swiper-button-prev'),
	},

	// キーボード操作（←→）を有効化
	keyboard: { enabled: true },

	// アクセシビリティ用のメッセージ群
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
		// 初期化時・スライド切替・リサイズ時 → 属性を更新
		init(sw) { updateA11y03(sw); },
		slideChange(sw) { updateA11y03(sw); },
		resize(sw) { updateA11y03(sw); },

		// 遷移完了時 → 属性更新 ＋ アクティブ要素に自動フォーカス
		slideChangeTransitionEnd(sw) {
			updateA11y03(sw);
			focusActiveLink03(sw);
		},
	}
});

// ===============================
// a11y属性の更新処理
// （loop:true時に複製スライドを除外して総数を算出）
// ===============================
function updateA11y03(sw) {
	const slides = sw.slides;

	// 実際のスライド数（複製は除外）
	const uniqueTotal =
		Array.from(slides).filter(s => !s.classList.contains('swiper-slide-duplicate')).length
		|| slides.length;

	Array.from(slides).forEach(slide => {
		const isActive = slide.classList.contains('swiper-slide-active');
		const link = slide.querySelector('a,button,[tabindex]');

		// loop:true の場合は data-swiper-slide-index から元の順番を取得
		const origIndex = slide.getAttribute('data-swiper-slide-index');
		const ordinal = origIndex
			? Number(origIndex) + 1
			: (Array.from(slides).indexOf(slide) + 1);

		// スクリーンリーダー用の情報を付与
		slide.setAttribute('role', 'group');
		slide.setAttribute('aria-roledescription', 'slide');
		slide.setAttribute('aria-label', `スライド ${ordinal} / ${uniqueTotal}`);
		slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

		// アクティブスライド内のみ Tab 移動を許可
		if (link) link.setAttribute('tabindex', isActive ? '0' : '-1');
	});
}

// ===============================
// アクティブスライド内のリンクへフォーカス
// （遷移完了後に実行）
// ===============================
function focusActiveLink03(sw) {
	const active = sw.slides[sw.activeIndex];
	if (!active) return;

	// フォーカス可能要素を探す
	const target = active.querySelector('a[tabindex="0"],button[tabindex="0"],[tabindex="0"]');
	if (!target) return;

	// preventScroll で不要なスクロールを抑制（未対応ブラウザは fallback）
	try {
		target.focus({ preventScroll: true });
	} catch {
		target.focus();
	}
}