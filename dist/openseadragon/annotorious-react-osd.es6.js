import { jsx as j } from "./annotorious-react-osd.es5.js";
import { createContext as E, forwardRef as H, useState as i, useImperativeHandle as I, useEffect as O, useContext as P } from "react";
const b = E({
  anno: void 0,
  setAnno: void 0,
  annotations: [],
  selection: { selected: [] }
});
H((s, m) => {
  const [n, p] = i(null), [x, l] = i([]), [S, a] = i({ selected: [] });
  return I(m, () => n), O(() => {
    if (n) {
      const { selection: h, store: e } = n.state;
      e.all().length > 0 && l(e.all());
      const u = (r) => l(() => e.all());
      e.observe(u);
      let o;
      const A = h.subscribe(({ selected: r, pointerEvent: g }) => {
        o && e.unobserve(o);
        const C = (r || []).map(({ id: t, editable: c }) => ({ annotation: e.getAnnotation(t), editable: c }));
        a({ selected: C, pointerEvent: g }), o = (t) => {
          const { updated: c } = t.changes;
          a(({ selected: w }) => ({
            selected: w.map(({ annotation: d, editable: v }) => {
              const f = c.find((V) => V.oldValue.id === d.id);
              return f ? { annotation: f.newValue, editable: v } : { annotation: d, editable: v };
            })
          }));
        }, e.observe(o, { annotations: r.map(({ id: t }) => t) });
      });
      return () => {
        e.unobserve(u), A();
      };
    }
  }, [n]), /* @__PURE__ */ j(b.Provider, { value: {
    anno: n,
    setAnno: p,
    annotations: x,
    selection: S
  }, children: s.children });
});
const q = () => {
  const { selection: s } = P(b);
  return s;
};
export {
  b as AnnotoriousContext,
  q as useSelection
};
//# sourceMappingURL=annotorious-react-osd.es6.js.map
