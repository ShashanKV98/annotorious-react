import { jsx as U } from "./annotorious-react.es12.js";
import { createContext as j, forwardRef as E, useState as f, useImperativeHandle as H, useEffect as h, useContext as c } from "react";
import { useDebounce as C } from "./annotorious-react.es13.js";
const o = j({
  anno: void 0,
  setAnno: void 0,
  annotations: [],
  selection: { selected: [] }
}), B = E((t, s) => {
  const [n, u] = f(null), [p, r] = f([]), [A, l] = f({ selected: [] });
  return H(s, () => n), h(() => {
    if (n) {
      const { selection: m, store: e } = n.state;
      e.all().length > 0 && r(e.all());
      const v = (a) => r(() => e.all());
      e.observe(v);
      let i;
      const b = m.subscribe(({ selected: a, pointerEvent: w }) => {
        i && e.unobserve(i);
        const D = (a || []).map(({ id: d, editable: S }) => ({ annotation: e.getAnnotation(d), editable: S }));
        l({ selected: D, pointerEvent: w }), i = (d) => {
          const { updated: S } = d.changes;
          l(({ selected: I }) => ({
            selected: I.map(({ annotation: V, editable: g }) => {
              const x = S.find((O) => O.oldValue.id === V.id);
              return x ? { annotation: x.newValue, editable: g } : { annotation: V, editable: g };
            })
          }));
        }, e.observe(i, { annotations: a.map(({ id: d }) => d) });
      });
      return () => {
        e.unobserve(v), b();
      };
    }
  }, [n]), /* @__PURE__ */ U(o.Provider, { value: {
    anno: n,
    setAnno: u,
    annotations: p,
    selection: A
  }, children: t.children });
}), F = () => {
  const { anno: t } = c(o);
  return t;
}, G = () => {
  const { anno: t } = c(o);
  return t == null ? void 0 : t.state.store;
}, P = () => {
  const { annotations: t } = c(o);
  return t;
}, R = (t) => {
  const { annotations: s } = c(o);
  return C(s, t);
}, J = (t) => t ? R(t) : P(), K = () => {
  const { selection: t } = c(o);
  return t;
}, L = () => {
  const { anno: t } = c(o);
  return t == null ? void 0 : t.getUser();
}, _ = () => {
  const { anno: t } = c(o), [s, n] = f([]);
  return h(() => {
    if (t) {
      const { store: u, viewport: p } = t.state;
      if (!p)
        return;
      let r;
      const A = p.subscribe((l) => {
        r && u.unobserve(r);
        const m = l.map((e) => u.getAnnotation(e));
        n(m), r = (e) => {
          const { updated: v } = e.changes;
          n((i) => i.map((b) => {
            const a = v.find((w) => w.oldValue.id === b.id);
            return a ? a.newValue : b;
          }));
        }, u.observe(r, { annotations: l });
      });
      return () => {
        A();
      };
    }
  }, [t]), s;
}, k = (t) => {
  const s = _();
  return C(s, t);
}, M = (t) => t ? k(t) : _();
export {
  B as Annotorious,
  o as AnnotoriousContext,
  G as useAnnotationStore,
  J as useAnnotations,
  F as useAnnotator,
  L as useAnnotatorUser,
  K as useSelection,
  M as useViewportState
};
//# sourceMappingURL=annotorious-react.es2.js.map
