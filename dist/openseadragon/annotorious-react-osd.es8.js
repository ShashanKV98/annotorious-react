import d from "openseadragon";
const L = (i, h) => {
  const e = i.element.getBoundingClientRect(), { minX: n, minY: l, maxX: t, maxY: c } = h.target.selector.geometry.bounds, s = i.viewport.imageToViewerElementCoordinates(new d.Point(n, l)), x = i.viewport.imageToViewerElementCoordinates(new d.Point(t, c));
  return {
    x: s.x + e.x,
    right: x.x + e.x,
    y: s.y + e.y,
    bottom: x.y + e.y,
    width: x.x - s.x,
    height: x.y - s.y
  };
}, T = (i, h, e, n = 5) => {
  const l = i.element.getBoundingClientRect(), t = L(i, h), c = t.y - l.y, s = l.right - t.x, x = l.bottom - t.bottom, w = t.x - l.left, o = e.firstElementChild.getBoundingClientRect(), a = c / o.height, g = s / o.width, y = x / o.height, r = w / o.width, $ = () => {
    e.style.left = `${t.x}px`, e.style.top = `${t.y - n - o.height}px`;
  }, f = () => {
    e.style.left = `${t.right - o.width}px`, e.style.top = `${t.y - n - o.height}px`;
  }, B = () => {
    e.style.left = `${t.x - o.width - n}px`, e.style.top = `${t.y}px`;
  }, v = () => {
    e.style.left = `${t.right + n}px`, e.style.top = `${t.y}px`;
  }, R = () => {
    e.style.left = `${t.x - o.width - n}px`, e.style.top = `${t.bottom - o.height}px`;
  }, C = () => {
    e.style.left = `${t.x + t.width + n}px`, e.style.top = `${t.bottom - o.height}px`;
  }, A = () => {
    e.style.left = `${t.x}px`, e.style.top = `${t.bottom + n}px`;
  }, E = () => {
    e.style.left = `${t.right - o.width}px`, e.style.top = `${t.bottom + n}px`;
  }, b = [a, g, y, r], m = b.indexOf(Math.max(...b));
  m === 0 ? g > r ? $() : f() : m === 1 ? a > y ? C() : v() : m === 2 ? g > r ? A() : E() : a > y ? R() : B();
};
export {
  T as setPosition
};
//# sourceMappingURL=annotorious-react-osd.es8.js.map
