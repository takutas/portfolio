//メガメニュー
document.addEventListener('DOMContentLoaded', function () {
	const parentItems = document.querySelectorAll('.header__nav-item--parent');
	const parentButtons = document.querySelectorAll('.header__nav-button');

	// 子メニューの高さを取得（ulを対象）
	const getSublistHeight = (button) => {
		const child = button.nextElementSibling;
		const sublist = child?.querySelector('ul');
		return sublist ? sublist.offsetHeight : 0;
	};

	parentButtons.forEach(button => {
		// マウス or フォーカス時に高さを計算しておく
		['mouseenter', 'focus'].forEach(evt => {
			button.addEventListener(evt, () => {
				const height = getSublistHeight(button);
				button.dataset.childHeight = height;
			});
		});

		button.addEventListener('click', (e) => {
			e.preventDefault();
			const currentParent = button.closest('.header__nav-item--parent');
			const child = button.nextElementSibling;

			// 全ての親メニューを閉じる
			parentItems.forEach(item => {
				item.classList.remove('active');
				const childEl = item.querySelector('ul')?.parentElement;
				if (childEl) childEl.style.height = '';
			});

			// 開閉の切り替え
			const isOpen = button.getAttribute('aria-expanded') === 'true';
			parentButtons.forEach(btn => {
				btn.setAttribute('aria-expanded', 'false');
				btn.setAttribute('aria-label', 'メニューを開く');
			});

			if (isOpen) {
				// すでに開いていたら閉じるだけで終了
				return;
			}

			// 開く
			currentParent.classList.add('active');
			const height = button.dataset.childHeight || getSublistHeight(button);
			if (child) child.style.height = `${height}px`;
			button.setAttribute('aria-expanded', 'true');
			button.setAttribute('aria-label', 'メニューを閉じる');
		});
	});

	// 領域外クリックで全て閉じる
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