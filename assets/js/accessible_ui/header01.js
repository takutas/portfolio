// メガメニュー
document.addEventListener('DOMContentLoaded', function () {
	// 親メニュー <li> と、開閉トリガーとなる <button>
	const parentItems = document.querySelectorAll('.header__nav-item--parent');
	const parentButtons = document.querySelectorAll('.header__nav-button');

	/**
	 * 子メニュー（.header__nav-child 内の ul）の実高さを取得
	 * height トランジション用に、事前計算して dataset に保持しておく
	 */
	const getSublistHeight = (button) => {
		const child = button.nextElementSibling;
		const sublist = child?.querySelector('ul');
		return sublist ? sublist.offsetHeight : 0;
	};

	parentButtons.forEach(button => {
		/**
		 * PC での hover / keyboard focus 時に高さを先読みしてキャッシュ
		 * こうしておくと、クリック時に高さをすぐ適用できてチラつきにくい
		 */
		['mouseenter', 'focus'].forEach(evt => {
			button.addEventListener(evt, () => {
				const height = getSublistHeight(button);
				button.dataset.childHeight = height; // 例: "248"
			});
		});

		/**
		 * クリックで自分だけ開く（他は閉じる）
		 * SP のアコーディオン想定：CSS 側に height の transition を定義しておく
		 */
		button.addEventListener('click', (e) => {
			e.preventDefault();

			const currentParent = button.closest('.header__nav-item--parent');
			const child = button.nextElementSibling;

			// まず全て閉じる（active解除 & height 初期化）
			parentItems.forEach(item => {
				item.classList.remove('active');
				const childEl = item.querySelector('ul')?.parentElement; // = .header__nav-child
				if (childEl) childEl.style.height = '';
			});

			// クリックしたボタンの現在状態（開いている？）
			const isOpen = button.getAttribute('aria-expanded') === 'true';

			// すべてのボタンの ARIA をいったん false に
			parentButtons.forEach(btn => {
				btn.setAttribute('aria-expanded', 'false');
				btn.setAttribute('aria-label', 'メニューを開く');
			});

			// 既に開いていたなら、ここで終了（結果として全閉状態）
			if (isOpen) return;

			// 開く：active 付与・height を実高さにセット・ARIA 更新
			currentParent.classList.add('active');
			const height = button.dataset.childHeight || getSublistHeight(button);
			if (child) child.style.height = `${height}px`;
			button.setAttribute('aria-expanded', 'true');
			button.setAttribute('aria-label', 'メニューを閉じる');
		});
	});

	/**
	 * メニュー領域外のクリックで全て閉じる
	 * - active 解除
	 * - height 初期化（0/auto ではなく空文字にして CSS 初期値へ）
	 * - ARIA を false に戻す
	 */
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.header__nav-item--parent')) {
			parentItems.forEach(item => {
				item.classList.remove('active');
				const child = item.querySelector('ul')?.parentElement;
				if (child) child.style.height = '';
				const btn = item.querySelector('button');
				if (btn) {
					btn.setAttribute('aria-expanded', 'false');
					btn.setAttribute('aria-label', 'メニューを開く');
				}
			});
		}
	});
});