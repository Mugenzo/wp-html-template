import Swiper from 'swiper'
import { Pagination, Navigation, Autoplay, Scrollbar, Thumbs, EffectFade } from 'swiper/modules'

new Swiper('.demo-swiper', {
  modules: [Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 16,
  loop: true,
  pagination: {
    el: '.demo-swiper .swiper-pagination',
    clickable: true,
  },
  navigation: {
    prevEl: '.demo-swiper .swiper-button-prev',
    nextEl: '.demo-swiper .swiper-button-next',
  },
})

export { Swiper, Pagination, Navigation, Autoplay, Scrollbar, Thumbs, EffectFade }
