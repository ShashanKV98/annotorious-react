import { j as E } from "./annotorious-react-osd.es5.js";
import { createContext as R, forwardRef as V, useState as i, useImperativeHandle as H, useEffect as I, useContext as O } from "react";
const m = R({
  anno: void 0,
  setAnno: void 0,
  annotations: [],
  selection: { selected: [] }
});
V((s, p) => {
  const [n, b] = i(null), [x, a] = i([]), [S, l] = i({ selected: [] });
  return H(p, () => n), I(() => {
    if (n) {
      const { selection: h, store: e } = n.state;
      e.all().length > 0 && a(e.all());
      const u = (r) => a(() => e.all());
      e.observe(u);
      let o;
      const A = h.subscribe(({ selected: r, pointerEvent: g }) => {
        o && e.unobserve(o);
        const C = (r || []).map(({ id: t, editable: c }) => ({ annotation: e.getAnnotation(t), editable: c }));
        l({ selected: C, pointerEvent: g }), o = (t) => {
          const { updated: c } = t.changes;
          l(({ selected: j }) => ({
            selected: j.map(({ annotation: d, editable: v }) => {
              const f = c.find((w) => w.oldValue.id === d.id);
              return f ? { annotation: f.newValue, editable: v } : { annotation: d, editable: v };
            })
          }));
        }, e.observe(o, { annotations: r.map(({ id: t }) => t) });
      });
      return () => {
        e.unobserve(u), A();
      };
    }
  }, [n]), /* @__PURE__ */ E.jsx(m.Provider, { value: {
    anno: n,
    setAnno: b,
    annotations: x,
    selection: S
  }, children: s.children });
});
const q = () => {
  const { selection: s } = O(m);
  return s;
};
export {
  m as AnnotoriousContext,
  q as useSelection
};
//# sourceMappingURL=annotorious-react-osd.es6.js.map
