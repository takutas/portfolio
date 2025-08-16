document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.accordionUnit__btn');

    buttons.forEach((button) => {
        button.addEventListener('click', () => toggle(button));
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(button);
            }
        });
    });

    // 連打対策フラグを各contentに持たせる
    function isAnimating(content) { return content.dataset.animating === '1'; }
    function lock(content) { content.dataset.animating = '1'; }
    function unlock(content) { delete content.dataset.animating; }

    function toggle(button) {
        const content = document.getElementById(button.getAttribute('aria-controls'));
        const expanded = button.getAttribute('aria-expanded') === 'true';
        if (isAnimating(content)) return;

        expanded ? close(button, content) : open(button, content);
    }

    function open(button, content) {
        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('aria-label', '閉じる');
        content.removeAttribute('hidden');

        // いったん 0 → 実高さ へ
        lock(content);
        content.style.height = '0px';
        // 次フレームでscrollHeight反映
        requestAnimationFrame(() => {
            content.style.height = content.scrollHeight + 'px';
        });

        content.addEventListener('transitionend', function handler(e) {
            if (e.propertyName !== 'height') return;
            content.style.height = 'auto'; // 可変に対応
            unlock(content);
            content.removeEventListener('transitionend', handler);
        }, { once: true });
    }

    function close(button, content) {
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', '開く');

        // auto → 固定値 → 0 へ
        lock(content);
        content.style.height = content.scrollHeight + 'px';
        requestAnimationFrame(() => {
            content.style.height = '0px';
        });

        content.addEventListener('transitionend', function handler(e) {
            if (e.propertyName !== 'height') return;
            content.setAttribute('hidden', '');
            unlock(content);
            content.removeEventListener('transitionend', handler);
        }, { once: true });
    }
});