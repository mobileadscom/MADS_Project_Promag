/* global window, requestAnimationFrame */

const getParameterByName = (name, url) => {
  let tmpUrl = url;
  let tmpName = name;
  if (!tmpUrl) tmpUrl = window.location.href;
  tmpName = tmpName.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${tmpName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(tmpUrl);
  if (!results) return null;
  if (!results[2]) return '';
  try {
    return JSON.parse(decodeURIComponent(results[2].replace(/\+/g, ' ')));
  } catch (e) {
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
};

const fadeIn = (el) => {
  const tmpEl = el;
  let opacity = 0;

  tmpEl.style.display = 'block';
  tmpEl.style.opacity = 0;
  tmpEl.style.filter = '';

  let last = +new Date();
  const tick = () => {
    opacity += (new Date() - last) / 400;
    tmpEl.style.opacity = opacity;
    tmpEl.style.filter = `alpha(opacity=${(100 * opacity) | 0})`; // eslint-disable-line no-bitwise

    last = +new Date();

    if (opacity < 1) {
      // eslint-disable-next-line no-unused-expressions
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    } else {
      tmpEl.style.display = 'block';
    }
  };

  tick();
};

const fadeOut = (el) => {
  const tmpEl = el;
  let opacity = 1;

  tmpEl.style.opacity = 1;
  tmpEl.style.filter = `alpha(opacity=${(100 * opacity) | 1})`; // eslint-disable-line no-bitwise

  let last = +new Date();
  const tick = () => {
    opacity -= (new Date() - last) / 400;
    tmpEl.style.opacity = opacity;
    tmpEl.style.filter = `alpha(opacity=${(100 * opacity) | 0})`; // eslint-disable-line no-bitwise

    last = +new Date();

    if (opacity > 0) {
      // eslint-disable-next-line no-unused-expressions
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    } else {
      tmpEl.style.display = 'none';
    }
  };

  tick();
};

const fadeOutIn = (elOut, elIn) => {
  fadeOut(elOut);
  fadeIn(elIn);
};

export default null;

export { getParameterByName, fadeIn, fadeOut, fadeOutIn };
