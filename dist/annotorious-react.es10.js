import { j as v } from "./annotorious-react.es12.js";
import { useRef as w, useState as d, useEffect as u } from "react";
import { Draggable as x } from "./annotorious-react.es4.js";
import { useViewer as S } from "./annotorious-react.es9.js";
import { useSelection as j } from "./annotorious-react.es2.js";
import { setPosition as D } from "./annotorious-react.es15.js";
const R = (c) => {
  const n = w(null), o = S(), { selected: t } = j(), [l, m] = d([]), [s, i] = d(!1), f = () => i(!0), p = () => {
    const e = t[0].annotation;
    D(o, e, n.current);
  }, g = (e, r) => e.every((a) => r.includes(a)) && r.every((a) => e.includes(a));
  return u(() => {
    const e = t.map(({ annotation: r }) => r.id);
    g(l, e) || (i(!1), m(e));
  }, [t]), u(() => {
    if (!n.current)
      return;
    s || p();
    const e = () => {
      s || p();
    };
    return o.addHandler("update-viewport", e), () => {
      o.removeHandler("update-viewport", e);
    };
  }, [t, s]), t.length > 0 ? /* @__PURE__ */ v.jsx(
    x,
    {
      ref: n,
      className: "a9s-popup a9s-osd-popup",
      onDragStart: f,
      children: c.popup({ viewer: o, selected: t })
    },
    t.map(({ annotation: e }) => e.id).join("-")
  ) : null;
};
export {
  R as OpenSeadragonPopup
};
//# sourceMappingURL=annotorious-react.es10.js.map
