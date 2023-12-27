import { jsx as a, Fragment as g } from "./annotorious-react.es12.js";
import { Children as d, useContext as x, useEffect as e, cloneElement as h } from "react";
import { createImageAnnotator as u } from "@annotorious/annotorious";
import { AnnotoriousContext as y } from "./annotorious-react.es2.js";
const j = (t) => {
  const { children: n, tool: A, ...i } = t, l = d.only(n), { anno: o, setAnno: r } = x(y), c = (m) => {
    if (!o) {
      const f = m.target, s = u(f, i);
      r(s);
    }
  };
  return e(() => {
    t.tool && o && o.setDrawingTool(t.tool);
  }, [t.tool, o]), e(() => {
    o && o.setFilter(t.filter);
  }, [t.filter]), e(() => {
    o && o.setStyle(t.style);
  }, [t.style]), /* @__PURE__ */ a(g, { children: h(l, { onLoad: c }) });
};
export {
  j as ImageAnnotator
};
//# sourceMappingURL=annotorious-react.es5.js.map
