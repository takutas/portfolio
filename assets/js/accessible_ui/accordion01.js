document.addEventListener('DOMContentLoaded', () => {
	const buttons = document.querySelectorAll('.accordionUnit__btn');

	buttons.forEach(button => {
		button.addEventListener('click', () => toggleAccordion(button));
		button.addEventListener('keydown', e => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggleAccordion(button);
			}
		});
	});

	function toggleAccordion(clickedButton) {
		const clickedContent = document.getElementById(clickedButton.getAttribute('aria-controls'));
		const isExpanded = clickedButton.getAttribute('aria-expanded') === 'true';

		// すべて閉じる
		buttons.forEach(button => {
			const content = document.getElementById(button.getAttribute('aria-controls'));
			if (button.getAttribute('aria-expanded') === 'true') {
				closeAccordion(button, content);
			}
		});

		// 開くべきだったら開く（1フレーム遅らせることで閉じるtransitionが完了するのを待つ）
		if (!isExpanded) {
			setTimeout(() => {
				openAccordion(clickedButton, clickedContent);
			}, 10); // 少しだけ遅らせるのがポイント
		}
	}

	function openAccordion(button, content) {
		button.setAttribute('aria-expanded', 'true');
		button.setAttribute('aria-label', '閉じる');
		content.removeAttribute('hidden');

		content.style.height = content.scrollHeight + 'px';

		content.addEventListener('transitionend', function handler() {
			if (button.getAttribute('aria-expanded') === 'true') {
				content.style.height = 'auto';
			}
			content.removeEventListener('transitionend', handler);
		});
	}

	function closeAccordion(button, content) {
		button.setAttribute('aria-expanded', 'false');
		button.setAttribute('aria-label', '開く');

		content.style.height = content.scrollHeight + 'px';
		requestAnimationFrame(() => {
			content.style.height = '0';
		});

		content.addEventListener('transitionend', function handler() {
			if (button.getAttribute('aria-expanded') === 'false') {
				content.setAttribute('hidden', '');
			}
			content.removeEventListener('transitionend', handler);
		});
	}
});