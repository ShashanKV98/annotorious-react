import { jsx as v } from "./annotorious-react-osd.es5.js";
import { useRef as w, useState as d, useEffect as c } from "react";
import { Draggable as S } from "./annotorious-react-osd.es7.js";
import { useViewer as x } from "./annotorious-react-osd.es2.js";
import { useSelection as D } from "./annotorious-react-osd.es6.js";
import { setPosition as I } from "./annotorious-react-osd.es8.js";
const q = (u) => {
  const n = w(null), o = x(), { selected: t } = D(), [l, f] = d([]), [s, i] = d(!1), m = () => i(!0), p = () => {
    const e = t[0].annotation;
    I(o, e, n.current);
  }, g = (e, r) => e.every((a) => r.includes(a)) && r.every((a) => e.includes(a));
  return c(() => {
    const e = t.map(({ annotation: r }) => r.id);
    g(l, e) || (i(!1), f(e));
  }, [t]), c(() => {
    if (!n.current)
      return;
    s || p();
    const e = () => {
      s || p();
    };
    return o.addHandler("update-viewport", e), () => {
      o.removeHandler("update-viewport", e);
    };
  }, [t, s]), t.length > 0 ? /* @__PURE__ */ v(
    S,
    {
      ref: n,
      className: "a9s-popup a9s-osd-popup",
      onDragStart: m,
      children: u.popup({ viewer: o, selected: t })
    },
    t.map(({ annotation: e }) => e.id).join("-")
  ) : null;
};
export {
  q as OpenSeadragonPopup
};
//# sourceMappingURL=annotorious-react-osd.es3.js.map
