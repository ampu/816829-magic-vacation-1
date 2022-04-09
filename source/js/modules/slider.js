import Swiper from 'swiper';

import {isMobileOrPortrait} from 'helpers/document-helpers';

/** @enum {string} */
const SlideEventType = {
  SLIDE_CHANGE: `slidechange`,
};

export const SLIDES = [
  {
    image: `url("img/slide1.jpg")`,
    gradient: `linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523e75 16.85%)`,
    themeColor: `#a67ee5`,
    textureUrl: `./img/scenes-textures/scene-1.png`,
  },
  {
    isCustom: true,
    image: `url("img/slide2.jpg")`,
    gradient: `linear-gradient(180deg, rgba(45, 54, 179, 0) 0%, #2a34b0 16.85%)`,
    themeColor: `#5468ff`,
    textureUrl: `./img/scenes-textures/scene-2.png`,
    hueRotation: [0, -20],
  },
  {
    image: `url("img/slide3.jpg")`,
    gradient: `linear-gradient(180deg, rgba(92, 138, 198, 0) 0%, #5183c4 16.85%)`,
    themeColor: `#a2ffff`,
    textureUrl: `./img/scenes-textures/scene-3.png`,
  },
  {
    image: `url("img/slide4.jpg")`,
    gradient: `linear-gradient(180deg, rgba(45, 39, 63, 0) 0%, #2f2a42 16.85%)`,
    themeColor: `#5e5484`,
    textureUrl: `./img/scenes-textures/scene-4.png`,
  },
];

const dispatchSlideChangeEvent = (slide) => {
  document.body.dispatchEvent(new CustomEvent(SlideEventType.SLIDE_CHANGE, {
    detail: {
      slideIndex: SLIDES.indexOf(slide),
      slide,
    },
  }));
};

export const addSlideChangeListener = (callback) => {
  document.body.addEventListener(SlideEventType.SLIDE_CHANGE, (evt) => {
    callback(evt.detail);
  });
};

/** @enum {object} */
const SwiperProps = {
  DEFAULT: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    pagination: {
      el: `.swiper-pagination`,
      type: `fraction`,
    },
    navigation: {
      nextEl: `.js-control-next`,
      prevEl: `.js-control-prev`,
    },
    keyboard: {
      enabled: true,
    },
    observer: true,
    observeParents: true,
  },
  MOBILE_PORTRAIT: {
    pagination: {
      el: `.swiper-pagination`,
      type: `bullets`,
    },
    keyboard: {
      enabled: true,
    },
    observer: true,
    observeParents: true,
  },
};

export default () => {
  let storySlider = null;

  const handlers = {
    slideChange: () => {
      renderSlide(SLIDES[Math.floor(storySlider.activeIndex / 2)]);
    },
    resize: () => {
      storySlider.update();
    },
    destroy: () => {
      document.body.style.removeProperty(`--theme-color`);
    },
  };

  const renderSlider = () => {
    if (storySlider) {
      storySlider.destroy();
    }

    if (isMobileOrPortrait()) {
      storySlider = new Swiper(`.js-slider`, {
        ...SwiperProps.MOBILE_PORTRAIT,
        on: handlers,
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        ...SwiperProps.DEFAULT,
        on: handlers,
      });
    }
  };

  const renderSlide = (slide) => {
    if (!slide) {
      return;
    }
    document.documentElement.style.setProperty(`--theme-color`, slide.themeColor);
    dispatchSlideChangeEvent(slide);
  };

  renderSlide(SLIDES[0]);

  window.addEventListener(`resize`, renderSlider);
  renderSlider();
};
