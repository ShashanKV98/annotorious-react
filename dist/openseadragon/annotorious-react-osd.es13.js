import { useRef as ge, useState as ae, useEffect as ie } from "react";
var O = { dragStart: !0 }, he = (e, t = {}) => {
  let o, c, { bounds: l, axis: m = "both", gpuAcceleration: f = !0, legacyTranslate: B = !0, transform: M, applyUserSelectHack: N = !0, disabled: R = !1, ignoreMultitouch: $ = !1, recomputeBounds: b = O, grid: H, position: u, cancel: D, handle: E, defaultClass: S = "neodrag", defaultClassDragging: i = "neodrag-dragging", defaultClassDragged: g = "neodrag-dragged", defaultPosition: W = { x: 0, y: 0 }, onDragStart: ce, onDrag: le, onDragEnd: ue } = t, X = !1, x = 0, A = 0, L = 0, T = 0, j = 0, z = 0, { x: Y, y: q } = u ? { x: (u == null ? void 0 : u.x) ?? 0, y: (u == null ? void 0 : u.y) ?? 0 } : W;
  I(Y, q);
  let y, C, P, F, _, ee = "", fe = !!u;
  b = { ...O, ...b };
  const G = document.body.style, v = e.classList;
  function I(n = x, a = A) {
    if (!M) {
      if (B) {
        let d = `${+n}px, ${+a}px`;
        return k(e, "transform", f ? `translate3d(${d}, 0)` : `translate(${d})`);
      }
      return k(e, "translate", `${+n}px ${+a}px ${f ? "1px" : ""}`);
    }
    const s = M({ offsetX: n, offsetY: a, rootNode: e });
    Q(s) && k(e, "transform", s);
  }
  const J = (n, a) => {
    const s = { offsetX: x, offsetY: A, rootNode: e, currentNode: _ };
    e.dispatchEvent(new CustomEvent(n, { detail: s })), a == null || a(s);
  }, K = addEventListener;
  K("pointerdown", re, !1), K("pointerup", te, !1), K("pointermove", oe, !1), k(e, "touch-action", "none");
  const ne = () => {
    let n = e.offsetWidth / C.width;
    return isNaN(n) && (n = 1), n;
  };
  function re(n) {
    if (R || n.button === 2 || $ && !n.isPrimary)
      return;
    if (b.dragStart && (y = V(l, e)), Q(E) && Q(D) && E === D)
      throw new Error("`handle` selector can't be same as `cancel` selector");
    if (v.add(S), P = function(r, p) {
      if (!r)
        return [p];
      if (Z(r))
        return [r];
      if (Array.isArray(r))
        return r;
      const w = p.querySelectorAll(r);
      if (w === null)
        throw new Error("Selector passed for `handle` option should be child of the element on which the action is applied");
      return Array.from(w.values());
    }(E, e), F = function(r, p) {
      if (!r)
        return [];
      if (Z(r))
        return [r];
      if (Array.isArray(r))
        return r;
      const w = p.querySelectorAll(r);
      if (w === null)
        throw new Error("Selector passed for `cancel` option should be child of the element on which the action is applied");
      return Array.from(w.values());
    }(D, e), o = /(both|x)/.test(m), c = /(both|y)/.test(m), de(F, P))
      throw new Error("Element being dragged can't be a child of the element on which `cancel` is applied");
    const a = n.composedPath()[0];
    if (!P.some((r) => {
      var p;
      return r.contains(a) || ((p = r.shadowRoot) == null ? void 0 : p.contains(a));
    }) || de(F, [a]))
      return;
    _ = P.length === 1 ? e : P.find((r) => r.contains(a)), X = !0, C = e.getBoundingClientRect(), N && (ee = G.userSelect, G.userSelect = "none"), J("neodrag:start", ce);
    const { clientX: s, clientY: d } = n, h = ne();
    o && (L = s - Y / h), c && (T = d - q / h), y && (j = s - C.left, z = d - C.top);
  }
  function te() {
    X && (b.dragEnd && (y = V(l, e)), v.remove(i), v.add(g), N && (G.userSelect = ee), J("neodrag:end", ue), o && (L = x), c && (T = A), X = !1);
  }
  function oe(n) {
    if (!X)
      return;
    b.drag && (y = V(l, e)), v.add(i), n.preventDefault(), C = e.getBoundingClientRect();
    let a = n.clientX, s = n.clientY;
    const d = ne();
    if (y) {
      const h = { left: y.left + j, top: y.top + z, right: y.right + j - C.width, bottom: y.bottom + z - C.height };
      a = se(a, h.left, h.right), s = se(s, h.top, h.bottom);
    }
    if (Array.isArray(H)) {
      let [h, r] = H;
      if (isNaN(+h) || h < 0)
        throw new Error("1st argument of `grid` must be a valid positive number");
      if (isNaN(+r) || r < 0)
        throw new Error("2nd argument of `grid` must be a valid positive number");
      let p = a - L, w = s - T;
      [p, w] = pe([h / d, r / d], p, w), a = L + p, s = T + w;
    }
    o && (x = Math.round((a - L) * d)), c && (A = Math.round((s - T) * d)), Y = x, q = A, J("neodrag", le), I();
  }
  return { destroy: () => {
    const n = removeEventListener;
    n("pointerdown", re, !1), n("pointerup", te, !1), n("pointermove", oe, !1);
  }, update: (n) => {
    var s, d;
    m = n.axis || "both", R = n.disabled ?? !1, $ = n.ignoreMultitouch ?? !1, E = n.handle, l = n.bounds, b = n.recomputeBounds ?? O, D = n.cancel, N = n.applyUserSelectHack ?? !0, H = n.grid, f = n.gpuAcceleration ?? !0, B = n.legacyTranslate ?? !0, M = n.transform;
    const a = v.contains(g);
    v.remove(S, g), S = n.defaultClass ?? "neodrag", i = n.defaultClassDragging ?? "neodrag-dragging", g = n.defaultClassDragged ?? "neodrag-dragged", v.add(S), a && v.add(g), fe && (Y = x = ((s = n.position) == null ? void 0 : s.x) ?? x, q = A = ((d = n.position) == null ? void 0 : d.y) ?? A, I());
  } };
}, se = (e, t, o) => Math.min(Math.max(e, t), o), Q = (e) => typeof e == "string", pe = ([e, t], o, c) => {
  const l = (m, f) => f === 0 ? 0 : Math.ceil(m / f) * f;
  return [l(o, e), l(c, t)];
}, de = (e, t) => e.some((o) => t.some((c) => o.contains(c)));
function V(e, t) {
  if (e === void 0)
    return;
  if (Z(e))
    return e.getBoundingClientRect();
  if (typeof e == "object") {
    const { top: c = 0, left: l = 0, right: m = 0, bottom: f = 0 } = e;
    return { top: c, right: window.innerWidth - m, bottom: window.innerHeight - f, left: l };
  }
  if (e === "parent")
    return t.parentNode.getBoundingClientRect();
  const o = document.querySelector(e);
  if (o === null)
    throw new Error("The selector provided for bound doesn't exists in the document.");
  return o.getBoundingClientRect();
}
var k = (e, t, o) => e.style.setProperty(t, o), Z = (e) => e instanceof HTMLElement;
function U(e) {
  return e == null || typeof e == "string" || e instanceof HTMLElement ? e : "current" in e ? e.current : Array.isArray(e) ? e.map((t) => t instanceof HTMLElement ? t : t.current) : void 0;
}
function ye(e, t = {}) {
  const o = ge(), [c, l] = ae(!1), [m, f] = ae();
  let { onDragStart: B, onDrag: M, onDragEnd: N, handle: R, cancel: $ } = t, b = U(R), H = U($);
  function u(i, g) {
    f(i), g == null || g(i);
  }
  function D(i) {
    l(!0), u(i, B);
  }
  function E(i) {
    u(i, M);
  }
  function S(i) {
    l(!1), u(i, N);
  }
  return ie(() => {
    if (typeof window > "u")
      return;
    const i = e.current;
    if (!i)
      return;
    ({ onDragStart: B, onDrag: M, onDragEnd: N } = t);
    const { update: g, destroy: W } = he(i, { ...t, handle: b, cancel: H, onDragStart: D, onDrag: E, onDragEnd: S });
    return o.current = g, W;
  }, []), ie(() => {
    var i;
    (i = o.current) == null || i.call(o, { ...t, handle: U(R), cancel: U($), onDragStart: D, onDrag: E, onDragEnd: S });
  }, [t]), { isDragging: c, dragState: m };
}
export {
  ye as useDraggable
};
//# sourceMappingURL=annotorious-react-osd.es13.js.map
