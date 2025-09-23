document.addEventListener('DOMContentLoaded', () => {
    const group = document.querySelector('.accordionGroup02');
    if (!group) return; // 対象が無ければ何もしない（保険）

    /**
     * クリック／Enter／Space で開閉をトグル（イベント委譲）
     * - クリック: onToggle をそのまま呼ぶ
     * - キー操作: Enter/Space のみ拾ってスクロール抑制＋onToggle
     */
    group.addEventListener('click', onToggle);
    group.addEventListener('keydown', (e) => {
        if (
            e.target.matches('.accordionUnit__btn') &&
            (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')
        ) {
            e.preventDefault();
            onToggle(e);
        }
    });

    /**
     * ボタンを特定して該当パネルを開閉
     * - data-animating=1 中は無視（連打対策）
     * - ARIA（aria-expanded/aria-label）を必ず同期
     * - height を 0 ⇄ scrollHeight にして CSS の transition でアニメ
     */
    function onToggle(e) {
        const btn = e.target.closest('.accordionUnit__btn');
        if (!btn) return;

        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel || panel.dataset.animating === '1') return;

        const willOpen = btn.getAttribute('aria-expanded') !== 'true';

        // 状態とラベル更新（スクリーンリーダー向け）
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        btn.setAttribute('aria-label', willOpen ? '閉じる' : '開く');

        // 開閉本体（height アニメ）
        panel.dataset.animating = '1';
        if (willOpen) {
            panel.hidden = false; // hidden を先に外す（scrollHeight を正しく得るため）
            panel.style.height = '0px'; // 0 → 実高へ
            requestAnimationFrame(() => {
                panel.style.height = panel.scrollHeight + 'px';
            });
        } else {
            panel.style.height = panel.scrollHeight + 'px'; // 現在高を固定
            requestAnimationFrame(() => {
                panel.style.height = '0px'; // 実高 → 0 へ
            });
        }

        // アニメ完了後の処理（auto復帰／hidden付け直し／ロック解除）
        panel.addEventListener('transitionend', function onEnd(ev) {
            if (ev.propertyName !== 'height') return;
            panel.style.height = willOpen ? 'auto' : '';
            if (!willOpen) panel.hidden = true;
            delete panel.dataset.animating;
            panel.removeEventListener('transitionend', onEnd);
        }, { once: true });
    }
});