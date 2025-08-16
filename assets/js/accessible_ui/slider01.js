const swiper = new Swiper('.demoSlider01 .swiper', {
	loop: true,
	slidesPerView: 1,
	initialSlide: 0,
	speed: 600,
	a11y: {
		enabled: true,
		containerMessage: 'デモスライダー',
		prevSlideMessage: '前のスライドへ',
		nextSlideMessage: '次のスライドへ',
		slideLabelMessage: '{{index}}枚目のスライド',
		paginationBulletMessage: '{{index}}枚目のスライドを表示',
	},
	keyboard: {
		enabled: true,
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});