// スクロールバーの幅をCSSカスタムプロパティ（--scrollbar）にセット
const setScrollbarWidth = () => {
	let scrollbarWidth = window.innerWidth - document.body.clientWidth;
	document.documentElement.style.setProperty('--scrollbar', `${scrollbarWidth}px`);
};

window.addEventListener('load', setScrollbarWidth);
window.addEventListener('resize', setScrollbarWidth);
