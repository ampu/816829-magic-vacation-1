const Viewport = {
  TABLET: 768,
  STOP_SCALING: 2000,
};

/**
 * @param {Element} element
 */
const scrollIntoViewIfNeeded = (element) => {
  if (!element) {
    return;
  }
  const clientRect = element.getBoundingClientRect();
  if (clientRect.top < 0 || clientRect.bottom >= window.innerHeight) {
    const centerDifference = {
      left: window.innerWidth > clientRect.width ? ((window.innerWidth - clientRect.width) / 2) : 0,
      top: window.innerHeight > clientRect.height ? ((window.innerHeight - clientRect.height) / 2) : 0,
    };
    window.scroll({
      left: window.scrollX + clientRect.left - centerDifference.left,
      top: window.scrollY + clientRect.top - centerDifference.top,
    });
  }
};

/**
 * @param {Element} element
 * @param {String} selector
 * @return {Element | null}
 */
const findAncestor = (element, selector) => {
  for (let ancestor = element; ancestor; ancestor = ancestor.parentNode) {
    if (ancestor.matches(selector)) {
      return ancestor;
    }
  }
  return null;
};

const isPortrait = () => {
  return (window.innerWidth / window.innerHeight) <= 1;
};

const isMobileOrPortrait = () => {
  return window.innerWidth < Viewport.TABLET || isPortrait();
};

const isStopScaling = () => {
  return window.innerWidth >= Viewport.STOP_SCALING;
};

const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const addClassToken = (element, classToken) => {
  element.classList.remove(classToken);
  setTimeout(() => {
    element.classList.add(classToken);
  });
};

const reloadSvg = (element) => {
  element.replaceWith(element.cloneNode(true));
};

/**
 * @param {HTMLImageElement | string} imageOrSource
 * @return {HTMLImageElement}
 */
const ensureImage = (imageOrSource) => {
  if (imageOrSource instanceof HTMLImageElement) {
    return imageOrSource;
  }
  const image = new Image();
  image.src = imageOrSource;
  return image;
};

const coverSize = ([width, height], [boxWidth, boxHeight]) => {
  const aspect = width / height;
  return boxWidth / boxHeight < aspect
    ? [
      boxWidth,
      boxWidth / aspect,
    ]
    : [
      boxHeight * aspect,
      boxHeight,
    ];
};

const containSize = ([width, height], [boxWidth, boxHeight]) => {
  const aspect = width / height;
  return boxWidth / boxHeight > aspect
    ? [
      boxWidth,
      boxWidth / aspect,
    ]
    : [
      boxHeight * aspect,
      boxHeight,
    ];
};

export {
  scrollIntoViewIfNeeded,
  findAncestor,
  isPortrait,
  isMobileOrPortrait,
  isStopScaling,
  sleep,
  addClassToken,
  reloadSvg,
  ensureImage,
  coverSize,
  containSize,
};
