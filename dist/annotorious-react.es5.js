import { j as n } from "./annotorious-react.es12.js";
import { Children as x, useContext as g, useEffect as e, cloneElement as d } from "react";
import { createImageAnnotator as u } from "@annotorious/annotorious";
import { AnnotoriousContext as h } from "./annotorious-react.es2.js";
const F = (t) => {
  const { children: i, tool: y, ...l } = t, r = x.only(i), { anno: o, setAnno: m } = g(h), s = (c) => {
    if (!o) {
      const f = c.target, a = u(f, l);
      m(a);
    }
  };
  return e(() => {
    t.tool && o && o.setDrawingTool(t.tool);
  }, [t.tool, o]), e(() => {
    o && o.setFilter(t.filter);
  }, [t.filter]), e(() => {
    o && o.setStyle(t.style);
  }, [t.style]), /* @__PURE__ */ n.jsx(n.Fragment, { children: d(r, { onLoad: s }) });
};
export {
  F as ImageAnnotator
};
//# sourceMappingURL=annotorious-react.es5.js.map
