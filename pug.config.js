const wrapSlides = (str) =>
  str
    .split('<hr>')
    .map((slide) => `<section class="slide">${slide}</section>`)
    .join('');
const anchors = (str) =>
  str.replace(/\<a\shref/g, '<a target="_blank" rel="noopener noreferer" href');

module.exports = {
  filters: {
    slides: (str) => anchors(wrapSlides(str)),
  },
};
