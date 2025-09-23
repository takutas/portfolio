// DOMの読み込みが完了したらアコーディオンを初期化
document.addEventListener("DOMContentLoaded", () => {
    setUpAccordion();
});

function setUpAccordion() {
    // .js-details 要素をすべて取得
    const detailsList = document.querySelectorAll(".js-details");
    const IS_OPENED_CLASS = "is-opened"; // 開閉状態を示すクラス

    // 各 <details> 要素ごとにイベントを設定
    detailsList.forEach((details) => {
        const summary = details.querySelector(".js-summary"); // 開閉ボタン（summary）
        const content = details.querySelector(".js-content"); // 中身（アニメ対象）

        // summary クリック時の動作
        summary.addEventListener("click", (e) => {
            e.preventDefault(); // デフォルトの開閉挙動をキャンセル

            // アニメーション中は操作無効化
            if (details.dataset.animating === "1") return;

            const isOpened = details.classList.contains(IS_OPENED_CLASS);

            if (isOpened) {
                // すでに開いている場合 → 閉じる
                closeOne(details, content);
            } else {
                // 他の開いているアコーディオンを閉じる
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

    // ===== 個別の開閉処理 =====

    // 1つのアコーディオンを閉じる
    function closeOne(detailsEl, contentEl) {
        detailsEl.dataset.animating = "1"; // アニメーション中フラグ
        detailsEl.classList.remove("is-opened"); // 見た目クラスを外す
        gsap.killTweensOf(contentEl); // 競合するアニメを止める
        closingAnim(contentEl, detailsEl).then(() => {
            detailsEl.dataset.animating = "0"; // アニメ完了で解除
        });
    }

    // 1つのアコーディオンを開く
    function openOne(detailsEl, contentEl) {
        detailsEl.dataset.animating = "1"; // アニメーション中フラグ
        detailsEl.classList.add("is-opened"); // 見た目クラス付与
        detailsEl.setAttribute("open", "true"); // open属性を付与
        gsap.killTweensOf(contentEl); // 競合するアニメを止める
        openingAnim(contentEl).then(() => {
            detailsEl.dataset.animating = "0"; // アニメ完了で解除
        });
    }
}

// ===== GSAP アニメーション部分 =====

// 閉じるアニメーション
// 高さを0に、透明度を0にする（0.4秒）
// 終了後に open 属性を外す
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

// 開くアニメーション
// 高さ0→auto、透明度0→1にする（0.4秒）
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