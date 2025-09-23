// DOM構築完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
	// イベント委譲の起点：.accordionGroup01 があればその配下、なければ document 全体
	const root = document.querySelector('.accordionGroup01') || document;

	// クリックでトグル（イベント委譲）
	root.addEventListener('click', (e) => {
		// 押された要素の親方向に .accordionUnit__btn があるかを検索
		const btn = e.target.closest('.accordionUnit__btn');
		if (btn) toggle(btn);
	});

	// Enter / Space でトグル（キーボード対応）
	root.addEventListener('keydown', (e) => {
		const btn = e.target.closest('.accordionUnit__btn');
		if (!btn) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault(); // Space のページスクロールなどを抑制
			toggle(btn);
		}
	});

	/**
	 * クリック（またはキー操作）されたボタンのみ開閉。
	 * すでに開いている他のパネルは閉じる＝「アコーディオン」挙動
	 */
	function toggle(btn) {
		const isOpen = btn.getAttribute('aria-expanded') === 'true';

		// いま開いている他のパネルをすべて閉じる
		document
			.querySelectorAll('.accordionUnit__btn[aria-expanded="true"]')
			.forEach((b) => {
				if (b !== btn) set(b, false);
			});

		// 対象ボタンを反転
		set(btn, !isOpen);
	}

	/**
	 * 実際の開閉処理
	 * - ARIA属性（aria-expanded / aria-label）更新
	 * - hidden 属性の付け外し
	 * - height を使ったトランジション（auto → 固定値の往復）
	 */
	function set(btn, expand) {
		const content = document.getElementById(btn.getAttribute('aria-controls'));

		// 状態をスクリーンリーダーへ伝える
		btn.setAttribute('aria-expanded', String(expand));
		btn.setAttribute('aria-label', expand ? '閉じる' : '開く');

		if (expand) {
			// 開く：hidden を外してから、0 → scrollHeight にアニメ
			content.removeAttribute('hidden');

			// まず height を実値にしてトランジションさせる
			content.style.height = content.scrollHeight + 'px';

			// アニメ完了後は高さを auto に戻して、可変コンテンツに追従
			content.addEventListener(
				'transitionend',
				() => {
					content.style.height = 'auto';
				},
				{ once: true }
			);
		} else {
			// 閉じる：現在の高さを固定 → 次フレームで 0 に
			content.style.height = content.scrollHeight + 'px';
			requestAnimationFrame(() => {
				content.style.height = '0px';
			});

			// 高さが 0 になったら非表示（hidden）へ
			content.addEventListener(
				'transitionend',
				() => {
					content.setAttribute('hidden', '');
				},
				{ once: true }
			);
		}
	}
});