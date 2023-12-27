import { j as m } from "./annotorious-react-osd.es5.js";
import { forwardRef as a, useRef as p, useContext as u, useEffect as c, useImperativeHandle as d } from "react";
import l from "openseadragon";
import { OpenSeadragonAnnotatorContext as x } from "./annotorious-react-osd.es2.js";
const O = a((n, s) => {
  const { className: i, options: t } = n, r = p(null), { viewer: f, setViewer: e } = u(x);
  return c(() => {
    if (r.current) {
      const o = l({ ...t, element: r.current });
      return e && e(o), () => {
        o.destroy(), e && e(void 0);
      };
    }
  }, [JSON.stringify(t)]), d(s, () => f), /* @__PURE__ */ m.jsx("div", { className: i, ref: r });
});
export {
  O as OpenSeadragonViewer
};
//# sourceMappingURL=annotorious-react-osd.es4.js.map
