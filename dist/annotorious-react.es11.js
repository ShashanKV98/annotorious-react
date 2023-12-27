import { jsx as a } from "./annotorious-react.es12.js";
import { forwardRef as m, useRef as p, useContext as c, useEffect as u, useImperativeHandle as d } from "react";
import l from "openseadragon";
import { OpenSeadragonAnnotatorContext as v } from "./annotorious-react.es9.js";
const S = m((n, i) => {
  const { className: s, options: t } = n, r = p(null), { viewer: f, setViewer: e } = c(v);
  return u(() => {
    if (r.current) {
      const o = l({ ...t, element: r.current });
      return e && e(o), () => {
        o.destroy(), e && e(void 0);
      };
    }
  }, [JSON.stringify(t)]), d(i, () => f), /* @__PURE__ */ a("div", { className: s, ref: r });
});
export {
  S as OpenSeadragonViewer
};
//# sourceMappingURL=annotorious-react.es11.js.map
