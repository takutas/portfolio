document.addEventListener("DOMContentLoaded", () => {
    setUpAccordion();
});

// 初期化：各 details/summary に動作をセット
function setUpAccordion() {
    const detailsList = document.querySelectorAll(".js-details");
    const IS_OPENED_CLASS = "is-opened";

    detailsList.forEach((details) => {
        const summary = details.querySelector(".js-summary");
        const content = details.querySelector(".js-content");

        summary.addEventListener("click", (e) => {
            e.preventDefault();

            // 連打ロック中は無視
            if (details.dataset.animating === "1") return;

            const isOpened = details.classList.contains(IS_OPENED_CLASS);

            if (isOpened) {
                // 自分を閉じる
                closeOne(details, content);
            } else {
                // 自分以外を全部閉じる
                detailsList.forEach((other) => {
                    if (other === details) return;
                    if (other.classList.contains(IS_OPENED_CLASS)) {
                        const otherContent = other.querySelector(".js-content");
                        closeOne(other, otherContent);
                    }
                });
                // 自分を開く
                openOne(details, content);
            }
        });
    });

    // 1項目を閉じる：見た目クラスを外し→高さ/不透明度のアニメ→完了後にopen属性除去
    function closeOne(detailsEl, contentEl) {
        detailsEl.dataset.animating = "1";
        detailsEl.classList.remove("is-opened");
        gsap.killTweensOf(contentEl); // 競合防止
        closingAnim(contentEl, detailsEl).then(() => {
            detailsEl.dataset.animating = "0";
        });
    }

    // 1項目を開く：見た目クラス付与 & open属性付与→高さ/不透明度のアニメ
    function openOne(detailsEl, contentEl) {
        detailsEl.dataset.animating = "1";
        detailsEl.classList.add("is-opened");
        detailsEl.setAttribute("open", "true");
        gsap.killTweensOf(contentEl); // 競合防止
        openingAnim(contentEl).then(() => {
            detailsEl.dataset.animating = "0";
        });
    }
}

// ===== GSAP アニメーション =====

// 閉じるアニメ：0.4s、高さ→0 / 透明→0、完了後に open 属性を外す
function closingAnim(content, detailsEl) {
    return new Promise((resolve) => {
        gsap.to(content, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
            overwrite: true,
            onComplete: () => {
                detailsEl.removeAttribute("open");
                resolve();
            },
        });
    });
}

// 開くアニメ：0.4s、高さ 0→auto / 透明 0→1
function openingAnim(content) {
    return new Promise((resolve) => {
        gsap.fromTo(
            content,
            { height: 0, opacity: 0 },
            {
                height: "auto",
                opacity: 1,
                duration: 0.4,
                ease: "power3.out",
                overwrite: true,
                onComplete: resolve,
            }
        );
    });
}