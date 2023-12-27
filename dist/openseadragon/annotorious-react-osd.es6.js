import _n from "openseadragon";
var ba = Object.prototype.hasOwnProperty;
function Je(r, e) {
  var t, i;
  if (r === e)
    return !0;
  if (r && e && (t = r.constructor) === e.constructor) {
    if (t === Date)
      return r.getTime() === e.getTime();
    if (t === RegExp)
      return r.toString() === e.toString();
    if (t === Array) {
      if ((i = r.length) === e.length)
        for (; i-- && Je(r[i], e[i]); )
          ;
      return i === -1;
    }
    if (!t || typeof r == "object") {
      i = 0;
      for (t in r)
        if (ba.call(r, t) && ++i && !ba.call(e, t) || !(t in e) || !Je(r[t], e[t]))
          return !1;
      return Object.keys(e).length === i;
    }
  }
  return r !== r && e !== e;
}
var Mu = /* @__PURE__ */ ((r) => (r.EDIT = "EDIT", r.SELECT = "SELECT", r.NONE = "NONE", r))(Mu || {});
const hc = [];
for (let r = 0; r < 256; ++r)
  hc.push((r + 256).toString(16).slice(1));
typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const uc = (r, e) => {
  const t = new Set(r.bodies.map((i) => i.id));
  return e.bodies.filter((i) => !t.has(i.id));
}, lc = (r, e) => {
  const t = new Set(e.bodies.map((i) => i.id));
  return r.bodies.filter((i) => !t.has(i.id));
}, cc = (r, e) => e.bodies.map((t) => {
  const i = r.bodies.find((n) => n.id === t.id);
  return { newBody: t, oldBody: i && !Je(i, t) ? i : void 0 };
}).filter(({ oldBody: t }) => t), dc = (r, e) => !Je(r.target, e.target), fc = (r, e) => {
  const t = uc(r, e), i = lc(r, e), n = cc(r, e);
  return {
    oldValue: r,
    newValue: e,
    bodiesCreated: t.length > 0 ? t : void 0,
    bodiesDeleted: i.length > 0 ? i : void 0,
    bodiesUpdated: n.length > 0 ? n : void 0,
    targetUpdated: dc(r, e) ? { oldTarget: r.target, newTarget: e.target } : void 0
  };
};
var Me = /* @__PURE__ */ ((r) => (r.LOCAL = "LOCAL", r.REMOTE = "REMOTE", r))(Me || {});
const pc = (r, e) => {
  const t = new Set((r.created || []).map((c) => c.id)), i = new Set((r.updated || []).map(({ newValue: c }) => c.id)), n = new Set((e.created || []).map((c) => c.id)), o = new Set((e.deleted || []).map((c) => c.id)), s = new Set((e.updated || []).map(({ oldValue: c }) => c.id)), a = new Set((e.updated || []).filter(({ oldValue: c }) => t.has(c.id) || i.has(c.id)).map(({ oldValue: c }) => c.id)), h = [
    ...(r.created || []).filter((c) => !o.has(c.id)).map((c) => s.has(c.id) ? e.updated.find(({ oldValue: d }) => d.id === c.id).newValue : c),
    ...e.created || []
  ], u = [
    ...(r.deleted || []).filter((c) => !n.has(c.id)),
    ...(e.deleted || []).filter((c) => !t.has(c.id))
  ], l = [
    ...(r.updated || []).filter(({ newValue: c }) => !o.has(c.id)).map((c) => {
      const { oldValue: d, newValue: f } = c;
      if (s.has(f.id)) {
        const p = e.updated.find((m) => m.oldValue.id === f.id).newValue;
        return fc(d, p);
      } else
        return c;
    }),
    ...(e.updated || []).filter(({ oldValue: c }) => !a.has(c.id))
  ];
  return { created: h, deleted: u, updated: l };
};
let mc = () => ({
  emit(r, ...e) {
    let t = this.events[r] || [];
    for (let i = 0, n = t.length; i < n; i++)
      t[i](...e);
  },
  events: {},
  on(r, e) {
    var t;
    return (t = this.events[r]) != null && t.push(e) || (this.events[r] = [e]), () => {
      var i;
      this.events[r] = (i = this.events[r]) == null ? void 0 : i.filter((n) => e !== n);
    };
  }
});
const yc = 250, _c = (r) => {
  const e = mc(), t = [];
  let i = -1, n = !1, o = 0;
  const s = (f) => {
    if (!n) {
      const { changes: p } = f, m = performance.now();
      if (m - o > yc)
        t.splice(i + 1), t.push(p), i = t.length - 1;
      else {
        const y = t.length - 1;
        t[y] = pc(t[y], p);
      }
      o = m;
    }
    n = !1;
  };
  r.observe(s, { origin: Me.LOCAL });
  const a = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkDeleteAnnotation(f), h = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkAddAnnotation(f, !1), u = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkUpdateAnnotation(f.map(({ oldValue: p }) => p)), l = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkUpdateAnnotation(f.map(({ newValue: p }) => p)), c = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkAddAnnotation(f, !1), d = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkDeleteAnnotation(f);
  return {
    canRedo: () => t.length - 1 > i,
    canUndo: () => i > -1,
    destroy: () => r.unobserve(s),
    on: (f, p) => e.on(f, p),
    redo: () => {
      if (t.length - 1 > i) {
        n = !0;
        const { created: f, updated: p, deleted: m } = t[i + 1];
        h(f), l(p), d(m), e.emit("redo", t[i + 1]), i += 1;
      }
    },
    undo: () => {
      if (i > -1) {
        n = !0;
        const { created: f, updated: p, deleted: m } = t[i];
        a(f), u(p), c(m), e.emit("undo", t[i]), i -= 1;
      }
    }
  };
}, gc = (r, e, t, i) => {
  const { store: n, selection: o, hover: s, viewport: a } = r, h = /* @__PURE__ */ new Map();
  let u = [], l, c;
  const d = (_, g) => {
    h.has(_) ? h.get(_).push(g) : h.set(_, [g]);
  }, f = (_, g) => {
    const v = h.get(_);
    v && v.indexOf(g) > 0 && v.splice(v.indexOf(g), 1);
  }, p = (_, g, v) => {
    h.has(_) && setTimeout(() => {
      h.get(_).forEach((b) => {
        if (t) {
          const T = Array.isArray(g) ? g.map((w) => t.serialize(w)) : t.serialize(g), S = v ? v instanceof PointerEvent ? v : t.serialize(v) : void 0;
          b(T, S);
        } else
          b(g, v);
      });
    }, 1);
  }, m = () => {
    const { selected: _ } = o, g = _.map(({ id: v }) => n.getAnnotation(v));
    g.forEach((v) => {
      const b = u.find((T) => T.id === v.id);
      (!b || !Je(b, v)) && p("updateAnnotation", v, b);
    }), u = u.map((v) => g.find(({ id: b }) => b === v.id) || v);
  };
  o.subscribe(({ selected: _ }) => {
    if (!(u.length === 0 && _.length === 0)) {
      if (u.length === 0 && _.length > 0)
        u = _.map(({ id: g }) => n.getAnnotation(g));
      else if (u.length > 0 && _.length === 0)
        u.forEach((g) => {
          const v = n.getAnnotation(g.id);
          v && !Je(v, g) && p("updateAnnotation", v, g);
        }), u = [];
      else {
        const g = new Set(u.map((b) => b.id)), v = new Set(_.map(({ id: b }) => b));
        u.filter((b) => !v.has(b.id)).forEach((b) => {
          const T = n.getAnnotation(b.id);
          T && !Je(T, b) && p("updateAnnotation", T, b);
        }), u = [
          // Remove annotations that were deselected
          ...u.filter((b) => v.has(b.id)),
          // Add editable annotations that were selected
          ..._.filter(({ id: b }) => !g.has(b)).map(({ id: b }) => n.getAnnotation(b))
        ];
      }
      p("selectionChanged", u);
    }
  }), s.subscribe((_) => {
    !l && _ ? p("mouseEnterAnnotation", n.getAnnotation(_)) : l && !_ ? p("mouseLeaveAnnotation", n.getAnnotation(l)) : l && _ && (p("mouseLeaveAnnotation", n.getAnnotation(l)), p("mouseEnterAnnotation", n.getAnnotation(_))), l = _;
  }), a == null || a.subscribe((_) => p("viewportIntersect", _.map(n.getAnnotation))), n.observe((_) => {
    i && (c && clearTimeout(c), c = setTimeout(m, 1e3));
    const { created: g, deleted: v } = _.changes;
    g.forEach((b) => p("createAnnotation", b)), v.forEach((b) => p("deleteAnnotation", b)), _.changes.updated.filter((b) => [
      ...b.bodiesCreated || [],
      ...b.bodiesDeleted || [],
      ...b.bodiesUpdated || []
    ].length > 0).forEach(({ oldValue: b, newValue: T }) => {
      const S = u.find((w) => w.id === b.id) || b;
      u = u.map((w) => w.id === b.id ? T : w), p("updateAnnotation", T, S);
    });
  }, { origin: Me.LOCAL }), n.observe((_) => {
    if (u) {
      const g = new Set(u.map((b) => b.id)), v = _.changes.updated.filter(({ newValue: b }) => g.has(b.id)).map(({ newValue: b }) => b);
      v.length > 0 && (u = u.map((b) => v.find((T) => T.id === b.id) || b));
    }
  }, { origin: Me.REMOTE });
  const y = (_) => (g) => {
    const { created: v, deleted: b, updated: T } = g;
    v.forEach((S) => p("createAnnotation", S)), b.forEach((S) => p("deleteAnnotation", S)), _ ? T.forEach((S) => p("updateAnnotation", S.oldValue, S.newValue)) : T.forEach((S) => p("updateAnnotation", S.newValue, S.oldValue));
  };
  return e.on("undo", y(!0)), e.on("redo", y(!1)), { on: d, off: f, emit: p };
}, vc = (r) => (e) => e.reduce((t, i) => {
  const { parsed: n, error: o } = r.parse(i);
  return o ? {
    parsed: t.parsed,
    failed: [...t.failed, i]
  } : {
    parsed: [...t.parsed, n],
    failed: t.failed
  };
}, { parsed: [], failed: [] }), bc = (r, e, t) => {
  const { store: i, selection: n } = r, o = (y) => {
    if (t) {
      const { parsed: _, error: g } = t.parse(y);
      _ ? i.addAnnotation(_, Me.REMOTE) : console.error(g);
    } else
      i.addAnnotation(y, Me.REMOTE);
  }, s = () => n.clear(), a = () => i.clear(), h = (y) => {
    const _ = i.getAnnotation(y);
    return t && _ ? t.serialize(_) : _;
  }, u = () => t ? i.all().map(t.serialize) : i.all(), l = () => {
    var y;
    const _ = (((y = n.selected) == null ? void 0 : y.map((g) => g.id)) || []).map((g) => i.getAnnotation(g));
    return t ? _.map(t.serialize) : _;
  }, c = (y) => fetch(y).then((_) => _.json()).then((_) => (f(_), _)), d = (y) => {
    if (typeof y == "string") {
      const _ = i.getAnnotation(y);
      return i.deleteAnnotation(y), t ? t.serialize(_) : _;
    } else {
      const _ = t ? t.parse(y).parsed : y;
      return i.deleteAnnotation(_), y;
    }
  }, f = (y) => {
    if (t) {
      const { parsed: _, failed: g } = vc(t)(y);
      g.length > 0 && console.warn(`Discarded ${g.length} invalid annotations`, g), i.bulkAddAnnotation(_, !0, Me.REMOTE);
    } else
      i.bulkAddAnnotation(y, !0, Me.REMOTE);
  }, p = (y) => {
    y ? n.setSelected(y) : n.clear();
  }, m = (y) => {
    if (t) {
      const _ = t.parse(y).parsed, g = t.serialize(i.getAnnotation(_.id));
      return i.updateAnnotation(_), g;
    } else {
      const _ = i.getAnnotation(y.id);
      return i.updateAnnotation(y), _;
    }
  };
  return {
    addAnnotation: o,
    cancelSelected: s,
    canRedo: e.canRedo,
    canUndo: e.canUndo,
    clearAnnotations: a,
    getAnnotationById: h,
    getAnnotations: u,
    getSelected: l,
    loadAnnotations: c,
    redo: e.redo,
    removeAnnotation: d,
    setAnnotations: f,
    setSelected: p,
    undo: e.undo,
    updateAnnotation: m
  };
};
let xc = (r) => crypto.getRandomValues(new Uint8Array(r)), Tc = (r, e, t) => {
  let i = (2 << Math.log(r.length - 1) / Math.LN2) - 1, n = -~(1.6 * i * e / r.length);
  return (o = e) => {
    let s = "";
    for (; ; ) {
      let a = t(n), h = n;
      for (; h--; )
        if (s += r[a[h] & i] || "", s.length === o)
          return s;
    }
  };
}, Ec = (r, e = 21) => Tc(r, e, xc), Ac = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
const Sc = () => ({ isGuest: !0, id: Ec("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_", 20)() });
Ac();
function nr() {
}
function wc(r, e) {
  for (const t in e)
    r[t] = e[t];
  return r;
}
function Iu(r) {
  return r();
}
function xa() {
  return /* @__PURE__ */ Object.create(null);
}
function ur(r) {
  r.forEach(Iu);
}
function Ut(r) {
  return typeof r == "function";
}
function xi(r, e) {
  return r != r ? e == e : r !== e || r && typeof r == "object" || typeof r == "function";
}
function Oc(r) {
  return Object.keys(r).length === 0;
}
function Rc(r, e, t, i) {
  if (r) {
    const n = Du(r, e, t, i);
    return r[0](n);
  }
}
function Du(r, e, t, i) {
  return r[1] && i ? wc(t.ctx.slice(), r[1](i(e))) : t.ctx;
}
function Pc(r, e, t, i) {
  if (r[2] && i) {
    const n = r[2](i(t));
    if (e.dirty === void 0)
      return n;
    if (typeof n == "object") {
      const o = [], s = Math.max(e.dirty.length, n.length);
      for (let a = 0; a < s; a += 1)
        o[a] = e.dirty[a] | n[a];
      return o;
    }
    return e.dirty | n;
  }
  return e.dirty;
}
function Mc(r, e, t, i, n, o) {
  if (n) {
    const s = Du(e, t, i, o);
    r.p(s, n);
  }
}
function Ic(r) {
  if (r.ctx.length > 32) {
    const e = [], t = r.ctx.length / 32;
    for (let i = 0; i < t; i++)
      e[i] = -1;
    return e;
  }
  return -1;
}
function rt(r, e, t) {
  r.insertBefore(e, t || null);
}
function et(r) {
  r.parentNode && r.parentNode.removeChild(r);
}
function Dc(r, e) {
  for (let t = 0; t < r.length; t += 1)
    r[t] && r[t].d(e);
}
function St(r) {
  return document.createElementNS("http://www.w3.org/2000/svg", r);
}
function Cu(r) {
  return document.createTextNode(r);
}
function $t() {
  return Cu(" ");
}
function Nu() {
  return Cu("");
}
function kt(r, e, t, i) {
  return r.addEventListener(e, t, i), () => r.removeEventListener(e, t, i);
}
function R(r, e, t) {
  t == null ? r.removeAttribute(e) : r.getAttribute(e) !== t && r.setAttribute(e, t);
}
function Cc(r) {
  return Array.from(r.childNodes);
}
function Nc(r, e, { bubbles: t = !1, cancelable: i = !1 } = {}) {
  const n = document.createEvent("CustomEvent");
  return n.initCustomEvent(r, t, i, e), n;
}
let ui;
function ri(r) {
  ui = r;
}
function Fu() {
  if (!ui)
    throw new Error("Function called outside component initialization");
  return ui;
}
function Lu(r) {
  Fu().$$.on_mount.push(r);
}
function js() {
  const r = Fu();
  return (e, t, { cancelable: i = !1 } = {}) => {
    const n = r.$$.callbacks[e];
    if (n) {
      const o = Nc(e, t, { cancelable: i });
      return n.slice().forEach((s) => {
        s.call(r, o);
      }), !o.defaultPrevented;
    }
    return !0;
  };
}
function Mr(r, e) {
  const t = r.$$.callbacks[e.type];
  t && t.slice().forEach((i) => i.call(this, e));
}
const Tr = [], Ta = [];
let Ir = [];
const Ea = [], Fc = /* @__PURE__ */ Promise.resolve();
let Uo = !1;
function Lc() {
  Uo || (Uo = !0, Fc.then(Bu));
}
function ko(r) {
  Ir.push(r);
}
const Yn = /* @__PURE__ */ new Set();
let fr = 0;
function Bu() {
  if (fr !== 0)
    return;
  const r = ui;
  do {
    try {
      for (; fr < Tr.length; ) {
        const e = Tr[fr];
        fr++, ri(e), Bc(e.$$);
      }
    } catch (e) {
      throw Tr.length = 0, fr = 0, e;
    }
    for (ri(null), Tr.length = 0, fr = 0; Ta.length; )
      Ta.pop()();
    for (let e = 0; e < Ir.length; e += 1) {
      const t = Ir[e];
      Yn.has(t) || (Yn.add(t), t());
    }
    Ir.length = 0;
  } while (Tr.length);
  for (; Ea.length; )
    Ea.pop()();
  Uo = !1, Yn.clear(), ri(r);
}
function Bc(r) {
  if (r.fragment !== null) {
    r.update(), ur(r.before_update);
    const e = r.dirty;
    r.dirty = [-1], r.fragment && r.fragment.p(r.ctx, e), r.after_update.forEach(ko);
  }
}
function Gc(r) {
  const e = [], t = [];
  Ir.forEach((i) => r.indexOf(i) === -1 ? e.push(i) : t.push(i)), t.forEach((i) => i()), Ir = e;
}
const ln = /* @__PURE__ */ new Set();
let Uc;
function Bn(r, e) {
  r && r.i && (ln.delete(r), r.i(e));
}
function Hs(r, e, t, i) {
  if (r && r.o) {
    if (ln.has(r))
      return;
    ln.add(r), Uc.c.push(() => {
      ln.delete(r), i && (t && r.d(1), i());
    }), r.o(e);
  } else
    i && i();
}
function Gu(r) {
  r && r.c();
}
function Ys(r, e, t, i) {
  const { fragment: n, after_update: o } = r.$$;
  n && n.m(e, t), i || ko(() => {
    const s = r.$$.on_mount.map(Iu).filter(Ut);
    r.$$.on_destroy ? r.$$.on_destroy.push(...s) : ur(s), r.$$.on_mount = [];
  }), o.forEach(ko);
}
function Vs(r, e) {
  const t = r.$$;
  t.fragment !== null && (Gc(t.after_update), ur(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function kc(r, e) {
  r.$$.dirty[0] === -1 && (Tr.push(r), Lc(), r.$$.dirty.fill(0)), r.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Ti(r, e, t, i, n, o, s, a = [-1]) {
  const h = ui;
  ri(r);
  const u = r.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: o,
    update: nr,
    not_equal: n,
    bound: xa(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (h ? h.$$.context : [])),
    // everything else
    callbacks: xa(),
    dirty: a,
    skip_bound: !1,
    root: e.target || h.$$.root
  };
  s && s(u.root);
  let l = !1;
  if (u.ctx = t ? t(r, e.props || {}, (c, d, ...f) => {
    const p = f.length ? f[0] : d;
    return u.ctx && n(u.ctx[c], u.ctx[c] = p) && (!u.skip_bound && u.bound[c] && u.bound[c](p), l && kc(r, c)), d;
  }) : [], u.update(), l = !0, ur(u.before_update), u.fragment = i ? i(u.ctx) : !1, e.target) {
    if (e.hydrate) {
      const c = Cc(e.target);
      u.fragment && u.fragment.l(c), c.forEach(et);
    } else
      u.fragment && u.fragment.c();
    e.intro && Bn(r.$$.fragment), Ys(r, e.target, e.anchor, e.customElement), Bu();
  }
  ri(h);
}
class Ei {
  $destroy() {
    Vs(this, 1), this.$destroy = nr;
  }
  $on(e, t) {
    if (!Ut(t))
      return nr;
    const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return i.push(t), () => {
      const n = i.indexOf(t);
      n !== -1 && i.splice(n, 1);
    };
  }
  $set(e) {
    this.$$set && !Oc(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
var jt = /* @__PURE__ */ ((r) => (r.ELLIPSE = "ELLIPSE", r.POLYGON = "POLYGON", r.RECTANGLE = "RECTANGLE", r))(jt || {});
const $s = {}, zs = (r, e) => $s[r] = e, Xo = (r) => $s[r.type].area(r), Xc = (r, e, t) => $s[r.type].intersects(r, e, t), jo = (r) => {
  let e = 1 / 0, t = 1 / 0, i = -1 / 0, n = -1 / 0;
  return r.forEach(([o, s]) => {
    e = Math.min(e, o), t = Math.min(t, s), i = Math.max(i, o), n = Math.max(n, s);
  }), { minX: e, minY: t, maxX: i, maxY: n };
}, jc = {
  area: (r) => Math.PI * r.geometry.rx * r.geometry.ry,
  intersects: (r, e, t) => {
    const { cx: i, cy: n, rx: o, ry: s } = r.geometry, a = 0, h = Math.cos(a), u = Math.sin(a), l = e - i, c = t - n, d = h * l + u * c, f = u * l - h * c;
    return d * d / (o * o) + f * f / (s * s) <= 1;
  }
};
zs(jt.ELLIPSE, jc);
const Hc = {
  area: (r) => {
    const { points: e } = r.geometry;
    let t = 0, i = e.length - 1;
    for (let n = 0; n < e.length; n++)
      t += (e[i][0] + e[n][0]) * (e[i][1] - e[n][1]), i = n;
    return Math.abs(0.5 * t);
  },
  intersects: (r, e, t) => {
    const { points: i } = r.geometry;
    let n = !1;
    for (let o = 0, s = i.length - 1; o < i.length; s = o++) {
      const a = i[o][0], h = i[o][1], u = i[s][0], l = i[s][1];
      h > t != l > t && e < (u - a) * (t - h) / (l - h) + a && (n = !n);
    }
    return n;
  }
};
zs(jt.POLYGON, Hc);
const Yc = {
  area: (r) => r.geometry.w * r.geometry.h,
  intersects: (r, e, t) => e >= r.geometry.x && e <= r.geometry.x + r.geometry.w && t >= r.geometry.y && t <= r.geometry.y + r.geometry.h
};
zs(jt.RECTANGLE, Yc);
const Vc = [];
for (let r = 0; r < 256; ++r)
  Vc.push((r + 256).toString(16).slice(1));
typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var Aa = Object.prototype.hasOwnProperty;
function gn(r, e) {
  var t, i;
  if (r === e)
    return !0;
  if (r && e && (t = r.constructor) === e.constructor) {
    if (t === Date)
      return r.getTime() === e.getTime();
    if (t === RegExp)
      return r.toString() === e.toString();
    if (t === Array) {
      if ((i = r.length) === e.length)
        for (; i-- && gn(r[i], e[i]); )
          ;
      return i === -1;
    }
    if (!t || typeof r == "object") {
      i = 0;
      for (t in r)
        if (Aa.call(r, t) && ++i && !Aa.call(e, t) || !(t in e) || !gn(r[t], e[t]))
          return !1;
      return Object.keys(e).length === i;
    }
  }
  return r !== r && e !== e;
}
function Vn() {
}
function $c(r, e) {
  return r != r ? e == e : r !== e || r && typeof r == "object" || typeof r == "function";
}
const pr = [];
function Ws(r, e = Vn) {
  let t;
  const i = /* @__PURE__ */ new Set();
  function n(a) {
    if ($c(r, a) && (r = a, t)) {
      const h = !pr.length;
      for (const u of i)
        u[1](), pr.push(u, r);
      if (h) {
        for (let u = 0; u < pr.length; u += 2)
          pr[u][0](pr[u + 1]);
        pr.length = 0;
      }
    }
  }
  function o(a) {
    n(a(r));
  }
  function s(a, h = Vn) {
    const u = [a, h];
    return i.add(u), i.size === 1 && (t = e(n) || Vn), a(r), () => {
      i.delete(u), i.size === 0 && t && (t(), t = null);
    };
  }
  return { set: n, update: o, subscribe: s };
}
const zc = (r) => {
  const { subscribe: e, set: t } = Ws(null);
  let i = null;
  return e((n) => i = n), r.observe(({ changes: n }) => {
    if (i) {
      n.deleted.some((s) => s.id === i) && t(null);
      const o = n.updated.find(({ oldValue: s }) => s.id === i);
      o && t(o.newValue.id);
    }
  }), {
    get current() {
      return i;
    },
    subscribe: e,
    set: t
  };
}, $n = { selected: [] }, Wc = (r, e = "EDIT") => {
  const { subscribe: t, set: i } = Ws($n);
  let n = $n;
  t((c) => n = c);
  const o = () => i($n), s = () => {
    var c;
    return ((c = n.selected) == null ? void 0 : c.length) === 0;
  }, a = (c) => {
    if (n.selected.length === 0)
      return !1;
    const d = typeof c == "string" ? c : c.id;
    return n.selected.some((f) => f.id === d);
  }, h = (c, d) => {
    const f = r.getAnnotation(c);
    if (f) {
      const p = qc(f, e);
      i(p === "EDIT" ? { selected: [{ id: c, editable: !0 }], pointerEvent: d } : p === "SELECT" ? { selected: [{ id: c }], pointerEvent: d } : { selected: [], pointerEvent: d });
    } else
      console.warn("Invalid selection: " + c);
  }, u = (c, d = !0) => {
    const f = Array.isArray(c) ? c : [c], p = f.map((m) => r.getAnnotation(m)).filter((m) => m);
    i({ selected: p.map(({ id: m }) => ({ id: m, editable: d })) }), p.length !== f.length && console.warn("Invalid selection", c);
  }, l = (c) => {
    if (n.selected.length === 0)
      return !1;
    const { selected: d } = n;
    d.filter(({ id: f }) => c.includes(f)).length > 0 && i({ selected: d.filter(({ id: f }) => !c.includes(f)) });
  };
  return r.observe(({ changes: c }) => l(c.deleted.map((d) => d.id))), {
    clear: o,
    clickSelect: h,
    get selected() {
      return n ? [...n.selected] : null;
    },
    get pointerEvent() {
      return n ? n.pointerEvent : null;
    },
    isEmpty: s,
    isSelected: a,
    setSelected: u,
    subscribe: t
  };
}, qc = (r, e) => typeof e == "function" ? e(r) || "EDIT" : e || "EDIT", Kc = [];
for (let r = 0; r < 256; ++r)
  Kc.push((r + 256).toString(16).slice(1));
typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const Zc = (r, e) => {
  const t = new Set(r.bodies.map((i) => i.id));
  return e.bodies.filter((i) => !t.has(i.id));
}, Jc = (r, e) => {
  const t = new Set(e.bodies.map((i) => i.id));
  return r.bodies.filter((i) => !t.has(i.id));
}, Qc = (r, e) => e.bodies.map((t) => {
  const i = r.bodies.find((n) => n.id === t.id);
  return { newBody: t, oldBody: i && !gn(i, t) ? i : void 0 };
}).filter(({ oldBody: t }) => t), td = (r, e) => !gn(r.target, e.target), ed = (r, e) => {
  const t = Zc(r, e), i = Jc(r, e), n = Qc(r, e);
  return {
    oldValue: r,
    newValue: e,
    bodiesCreated: t.length > 0 ? t : void 0,
    bodiesDeleted: i.length > 0 ? i : void 0,
    bodiesUpdated: n.length > 0 ? n : void 0,
    targetUpdated: td(r, e) ? { oldTarget: r.target, newTarget: e.target } : void 0
  };
};
var Gt = /* @__PURE__ */ ((r) => (r.LOCAL = "LOCAL", r.REMOTE = "REMOTE", r))(Gt || {});
const rd = (r, e) => {
  var t, i;
  const { changes: n, origin: o } = e;
  if (!(!r.options.origin || r.options.origin === o))
    return !1;
  if (r.options.ignore) {
    const { ignore: s } = r.options, a = (h) => (h == null ? void 0 : h.length) > 0;
    if (!(a(n.created) || a(n.deleted))) {
      const h = (t = n.updated) == null ? void 0 : t.some((l) => a(l.bodiesCreated) || a(l.bodiesDeleted) || a(l.bodiesUpdated)), u = (i = n.updated) == null ? void 0 : i.some((l) => l.targetUpdated);
      if (s === "BODY_ONLY" && h && !u || s === "TARGET_ONLY" && u && !h)
        return !1;
    }
  }
  if (r.options.annotations) {
    const s = /* @__PURE__ */ new Set([
      ...n.created.map((a) => a.id),
      ...n.deleted.map((a) => a.id),
      ...n.updated.map(({ oldValue: a }) => a.id)
    ]);
    return !!(Array.isArray(r.options.annotations) ? r.options.annotations : [r.options.annotations]).find((a) => s.has(a));
  } else
    return !0;
}, id = (r) => r.id !== void 0, nd = () => {
  const r = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), t = [], i = (A, x = {}) => t.push({ onChange: A, options: x }), n = (A) => {
    const x = t.findIndex((E) => E.onChange == A);
    x > -1 && t.splice(x, 1);
  }, o = (A, x) => {
    const E = {
      origin: A,
      changes: {
        created: x.created || [],
        updated: x.updated || [],
        deleted: x.deleted || []
      },
      state: [...r.values()]
    };
    t.forEach((O) => {
      rd(O, E) && O.onChange(E);
    });
  }, s = (A, x = Gt.LOCAL) => {
    if (r.get(A.id))
      throw Error(`Cannot add annotation ${A.id} - exists already`);
    r.set(A.id, A), A.bodies.forEach((E) => e.set(E.id, A.id)), o(x, { created: [A] });
  }, a = (A, x) => {
    const E = typeof A == "string" ? x : A, O = typeof A == "string" ? A : A.id, P = r.get(O);
    if (P) {
      const M = ed(P, E);
      return O === E.id ? r.set(O, E) : (r.delete(O), r.set(E.id, E)), P.bodies.forEach((F) => e.delete(F.id)), E.bodies.forEach((F) => e.set(F.id, E.id)), M;
    } else
      console.warn(`Cannot update annotation ${O} - does not exist`);
  }, h = (A, x = Gt.LOCAL, E = Gt.LOCAL) => {
    const O = id(x) ? E : x, P = a(A, x);
    P && o(O, { updated: [P] });
  }, u = (A, x = Gt.LOCAL) => {
    const E = A.reduce((O, P) => {
      const M = a(P);
      return M ? [...O, M] : O;
    }, []);
    E.length > 0 && o(x, { updated: E });
  }, l = (A, x = Gt.LOCAL) => {
    const E = r.get(A.annotation);
    if (E) {
      const O = {
        ...E,
        bodies: [...E.bodies, A]
      };
      r.set(E.id, O), e.set(A.id, O.id), o(x, { updated: [{
        oldValue: E,
        newValue: O,
        bodiesCreated: [A]
      }] });
    } else
      console.warn(`Attempt to add body to missing annotation: ${A.annotation}`);
  }, c = () => [...r.values()], d = (A = Gt.LOCAL) => {
    const x = [...r.values()];
    r.clear(), e.clear(), o(A, { deleted: x });
  }, f = (A, x = !0, E = Gt.LOCAL) => {
    if (x) {
      const O = [...r.values()];
      r.clear(), e.clear(), A.forEach((P) => {
        r.set(P.id, P), P.bodies.forEach((M) => e.set(M.id, P.id));
      }), o(E, { created: A, deleted: O });
    } else {
      const O = A.reduce((P, M) => {
        const F = r.get(M.id);
        return F ? [...P, F] : P;
      }, []);
      if (O.length > 0)
        throw Error(`Bulk insert would overwrite the following annotations: ${O.map((P) => P.id).join(", ")}`);
      A.forEach((P) => {
        r.set(P.id, P), P.bodies.forEach((M) => e.set(M.id, P.id));
      }), o(E, { created: A });
    }
  }, p = (A) => {
    const x = typeof A == "string" ? A : A.id, E = r.get(x);
    if (E)
      return r.delete(x), E.bodies.forEach((O) => e.delete(O.id)), E;
    console.warn(`Attempt to delete missing annotation: ${x}`);
  }, m = (A, x = Gt.LOCAL) => {
    const E = p(A);
    E && o(x, { deleted: [E] });
  }, y = (A, x = Gt.LOCAL) => {
    const E = A.reduce((O, P) => {
      const M = p(P);
      return M ? [...O, M] : O;
    }, []);
    E.length > 0 && o(x, { deleted: E });
  }, _ = (A, x = Gt.LOCAL) => {
    const E = r.get(A.annotation);
    if (E) {
      const O = E.bodies.find((P) => P.id === A.id);
      if (O) {
        e.delete(O.id);
        const P = {
          ...E,
          bodies: E.bodies.filter((M) => M.id !== A.id)
        };
        r.set(E.id, P), o(x, { updated: [{
          oldValue: E,
          newValue: P,
          bodiesDeleted: [O]
        }] });
      } else
        console.warn(`Attempt to delete missing body ${A.id} from annotation ${A.annotation}`);
    } else
      console.warn(`Attempt to delete body from missing annotation ${A.annotation}`);
  }, g = (A) => {
    const x = r.get(A);
    return x ? { ...x } : void 0;
  }, v = (A) => {
    const x = e.get(A);
    if (x) {
      const E = g(x).bodies.find((O) => O.id === A);
      if (E)
        return E;
      console.error(`Store integrity error: body ${A} in index, but not in annotation`);
    } else
      console.warn(`Attempt to retrieve missing body: ${A}`);
  }, b = (A, x) => {
    if (A.annotation !== x.annotation)
      throw "Annotation integrity violation: annotation ID must be the same when updating bodies";
    const E = r.get(A.annotation);
    if (E) {
      const O = E.bodies.find((M) => M.id === A.id), P = {
        ...E,
        bodies: E.bodies.map((M) => M.id === O.id ? x : M)
      };
      return r.set(E.id, P), O.id !== x.id && (e.delete(O.id), e.set(x.id, P.id)), {
        oldValue: E,
        newValue: P,
        bodiesUpdated: [{ oldBody: O, newBody: x }]
      };
    } else
      console.warn(`Attempt to add body to missing annotation ${A.annotation}`);
  }, T = (A, x, E = Gt.LOCAL) => {
    const O = b(A, x);
    o(E, { updated: [O] });
  }, S = (A, x = Gt.LOCAL) => {
    const E = A.map((O) => b({ id: O.id, annotation: O.annotation }, O));
    o(x, { updated: E });
  }, w = (A) => {
    const x = r.get(A.annotation);
    if (x) {
      const E = {
        ...x,
        target: {
          ...x.target,
          ...A
        }
      };
      return r.set(x.id, E), {
        oldValue: x,
        newValue: E,
        targetUpdated: {
          oldTarget: x.target,
          newTarget: A
        }
      };
    } else
      console.warn(`Attempt to update target on missing annotation: ${A.annotation}`);
  };
  return {
    addAnnotation: s,
    addBody: l,
    all: c,
    bulkAddAnnotation: f,
    bulkDeleteAnnotation: y,
    bulkUpdateAnnotation: u,
    bulkUpdateBodies: S,
    bulkUpdateTargets: (A, x = Gt.LOCAL) => {
      const E = A.map(w).filter((O) => O);
      E.length > 0 && o(x, { updated: E });
    },
    clear: d,
    deleteAnnotation: m,
    deleteBody: _,
    getAnnotation: g,
    getBody: v,
    observe: i,
    unobserve: n,
    updateAnnotation: h,
    updateBody: T,
    updateTarget: (A, x = Gt.LOCAL) => {
      const E = w(A);
      E && o(x, { updated: [E] });
    }
  };
}, od = () => {
  const { subscribe: r, set: e } = Ws([]);
  return {
    subscribe: r,
    set: e
  };
};
let sd = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
sd();
function Sa(r, e, t) {
  const i = r.slice();
  return i[11] = e[t], i[13] = t, i;
}
function wa(r) {
  let e, t, i, n, o;
  return {
    c() {
      e = St("rect"), R(e, "class", "a9s-corner-handle"), R(e, "x", t = /*point*/
      r[11][0] - /*handleSize*/
      r[3] / 2), R(e, "y", i = /*point*/
      r[11][1] - /*handleSize*/
      r[3] / 2), R(
        e,
        "height",
        /*handleSize*/
        r[3]
      ), R(
        e,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(s, a) {
      rt(s, e, a), n || (o = kt(e, "pointerdown", function() {
        Ut(
          /*grab*/
          r[10](H(
            /*idx*/
            r[13]
          ))
        ) && r[10](H(
          /*idx*/
          r[13]
        )).apply(this, arguments);
      }), n = !0);
    },
    p(s, a) {
      r = s, a & /*geom, handleSize*/
      24 && t !== (t = /*point*/
      r[11][0] - /*handleSize*/
      r[3] / 2) && R(e, "x", t), a & /*geom, handleSize*/
      24 && i !== (i = /*point*/
      r[11][1] - /*handleSize*/
      r[3] / 2) && R(e, "y", i), a & /*handleSize*/
      8 && R(
        e,
        "height",
        /*handleSize*/
        r[3]
      ), a & /*handleSize*/
      8 && R(
        e,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    d(s) {
      s && et(e), n = !1, o();
    }
  };
}
function ad(r) {
  let e, t, i, n, o, s, a, h, u, l, c = (
    /*geom*/
    r[4].points
  ), d = [];
  for (let f = 0; f < c.length; f += 1)
    d[f] = wa(Sa(r, c, f));
  return {
    c() {
      e = St("polygon"), n = $t(), o = St("polygon"), a = $t();
      for (let f = 0; f < d.length; f += 1)
        d[f].c();
      h = Nu(), R(e, "class", "a9s-outer"), R(e, "style", t = /*computedStyle*/
      r[1] ? "display:none;" : void 0), R(e, "points", i = /*geom*/
      r[4].points.map(Oa).join(" ")), R(o, "class", "a9s-inner a9s-shape-handle"), R(
        o,
        "style",
        /*computedStyle*/
        r[1]
      ), R(o, "points", s = /*geom*/
      r[4].points.map(Ra).join(" "));
    },
    m(f, p) {
      rt(f, e, p), rt(f, n, p), rt(f, o, p), rt(f, a, p);
      for (let m = 0; m < d.length; m += 1)
        d[m] && d[m].m(f, p);
      rt(f, h, p), u || (l = [
        kt(e, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.SHAPE)
          ) && r[10](H.SHAPE).apply(this, arguments);
        }),
        kt(o, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.SHAPE)
          ) && r[10](H.SHAPE).apply(this, arguments);
        })
      ], u = !0);
    },
    p(f, p) {
      if (r = f, p & /*computedStyle*/
      2 && t !== (t = /*computedStyle*/
      r[1] ? "display:none;" : void 0) && R(e, "style", t), p & /*geom*/
      16 && i !== (i = /*geom*/
      r[4].points.map(Oa).join(" ")) && R(e, "points", i), p & /*computedStyle*/
      2 && R(
        o,
        "style",
        /*computedStyle*/
        r[1]
      ), p & /*geom*/
      16 && s !== (s = /*geom*/
      r[4].points.map(Ra).join(" ")) && R(o, "points", s), p & /*geom, handleSize, grab, Handle*/
      1048) {
        c = /*geom*/
        r[4].points;
        let m;
        for (m = 0; m < c.length; m += 1) {
          const y = Sa(r, c, m);
          d[m] ? d[m].p(y, p) : (d[m] = wa(y), d[m].c(), d[m].m(h.parentNode, h));
        }
        for (; m < d.length; m += 1)
          d[m].d(1);
        d.length = c.length;
      }
    },
    d(f) {
      f && et(e), f && et(n), f && et(o), f && et(a), Dc(d, f), f && et(h), u = !1, ur(l);
    }
  };
}
function hd(r) {
  let e, t;
  return e = new ku({
    props: {
      shape: (
        /*shape*/
        r[0]
      ),
      transform: (
        /*transform*/
        r[2]
      ),
      editor: (
        /*editor*/
        r[5]
      ),
      $$slots: {
        default: [
          ad,
          ({ grab: i }) => ({ 10: i }),
          ({ grab: i }) => i ? 1024 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), e.$on(
    "change",
    /*change_handler*/
    r[7]
  ), e.$on(
    "grab",
    /*grab_handler*/
    r[8]
  ), e.$on(
    "release",
    /*release_handler*/
    r[9]
  ), {
    c() {
      Gu(e.$$.fragment);
    },
    m(i, n) {
      Ys(e, i, n), t = !0;
    },
    p(i, [n]) {
      const o = {};
      n & /*shape*/
      1 && (o.shape = /*shape*/
      i[0]), n & /*transform*/
      4 && (o.transform = /*transform*/
      i[2]), n & /*$$scope, geom, handleSize, grab, computedStyle*/
      17434 && (o.$$scope = { dirty: n, ctx: i }), e.$set(o);
    },
    i(i) {
      t || (Bn(e.$$.fragment, i), t = !0);
    },
    o(i) {
      Hs(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Vs(e, i);
    }
  };
}
const Oa = (r) => r.join(","), Ra = (r) => r.join(",");
function ud(r, e, t) {
  let i, n, { shape: o } = e, { computedStyle: s = void 0 } = e, { transform: a } = e, { viewportScale: h = 1 } = e;
  const u = (f, p, m) => {
    let y;
    p === H.SHAPE ? y = f.geometry.points.map(([g, v]) => [g + m[0], v + m[1]]) : y = f.geometry.points.map(([g, v], b) => p === H(b) ? [g + m[0], v + m[1]] : [g, v]);
    const _ = jo(y);
    return { ...f, geometry: { points: y, bounds: _ } };
  };
  function l(f) {
    Mr.call(this, r, f);
  }
  function c(f) {
    Mr.call(this, r, f);
  }
  function d(f) {
    Mr.call(this, r, f);
  }
  return r.$$set = (f) => {
    "shape" in f && t(0, o = f.shape), "computedStyle" in f && t(1, s = f.computedStyle), "transform" in f && t(2, a = f.transform), "viewportScale" in f && t(6, h = f.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && t(4, i = o.geometry), r.$$.dirty & /*viewportScale*/
    64 && t(3, n = 10 / h);
  }, [
    o,
    s,
    a,
    n,
    i,
    u,
    h,
    l,
    c,
    d
  ];
}
class ld extends Ei {
  constructor(e) {
    super(), Ti(this, e, ud, hd, xi, {
      shape: 0,
      computedStyle: 1,
      transform: 2,
      viewportScale: 6
    });
  }
}
function cd(r) {
  let e, t, i, n, o, s, a, h, u, l, c, d, f, p, m, y, _, g, v, b, T, S, w, A, x, E, O, P, M, F, D, C, V, st, q, L, I, j, K, J, mt, W, lt, vt, At, Q, ot, at, dt, Z;
  return {
    c() {
      e = St("rect"), a = $t(), h = St("rect"), f = $t(), p = St("rect"), g = $t(), v = St("rect"), w = $t(), A = St("rect"), P = $t(), M = St("rect"), V = $t(), st = St("rect"), I = $t(), j = St("rect"), mt = $t(), W = St("rect"), At = $t(), Q = St("rect"), R(e, "class", "a9s-outer"), R(e, "style", t = /*computedStyle*/
      r[1] ? "display:none;" : void 0), R(e, "x", i = /*geom*/
      r[4].x), R(e, "y", n = /*geom*/
      r[4].y), R(e, "width", o = /*geom*/
      r[4].w), R(e, "height", s = /*geom*/
      r[4].h), R(h, "class", "a9s-inner a9s-shape-handle"), R(
        h,
        "style",
        /*computedStyle*/
        r[1]
      ), R(h, "x", u = /*geom*/
      r[4].x), R(h, "y", l = /*geom*/
      r[4].y), R(h, "width", c = /*geom*/
      r[4].w), R(h, "height", d = /*geom*/
      r[4].h), R(p, "class", "a9s-edge-handle a9s-edge-handle-top"), R(p, "x", m = /*geom*/
      r[4].x), R(p, "y", y = /*geom*/
      r[4].y), R(p, "height", 1), R(p, "width", _ = /*geom*/
      r[4].w), R(v, "class", "a9s-edge-handle a9s-edge-handle-right"), R(v, "x", b = /*geom*/
      r[4].x + /*geom*/
      r[4].w), R(v, "y", T = /*geom*/
      r[4].y), R(v, "height", S = /*geom*/
      r[4].h), R(v, "width", 1), R(A, "class", "a9s-edge-handle a9s-edge-handle-bottom"), R(A, "x", x = /*geom*/
      r[4].x), R(A, "y", E = /*geom*/
      r[4].y + /*geom*/
      r[4].h), R(A, "height", 1), R(A, "width", O = /*geom*/
      r[4].w), R(M, "class", "a9s-edge-handle a9s-edge-handle-left"), R(M, "x", F = /*geom*/
      r[4].x), R(M, "y", D = /*geom*/
      r[4].y), R(M, "height", C = /*geom*/
      r[4].h), R(M, "width", 1), R(st, "class", "a9s-corner-handle a9s-corner-handle-topleft"), R(st, "x", q = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2), R(st, "y", L = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2), R(
        st,
        "height",
        /*handleSize*/
        r[3]
      ), R(
        st,
        "width",
        /*handleSize*/
        r[3]
      ), R(j, "class", "a9s-corner-handle a9s-corner-handle-topright"), R(j, "x", K = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2), R(j, "y", J = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2), R(
        j,
        "height",
        /*handleSize*/
        r[3]
      ), R(
        j,
        "width",
        /*handleSize*/
        r[3]
      ), R(W, "class", "a9s-corner-handle a9s-corner-handle-bottomright"), R(W, "x", lt = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2), R(W, "y", vt = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2), R(
        W,
        "height",
        /*handleSize*/
        r[3]
      ), R(
        W,
        "width",
        /*handleSize*/
        r[3]
      ), R(Q, "class", "a9s-corner-handle a9s-corner-handle-bottomleft"), R(Q, "x", ot = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2), R(Q, "y", at = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2), R(
        Q,
        "height",
        /*handleSize*/
        r[3]
      ), R(
        Q,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(U, B) {
      rt(U, e, B), rt(U, a, B), rt(U, h, B), rt(U, f, B), rt(U, p, B), rt(U, g, B), rt(U, v, B), rt(U, w, B), rt(U, A, B), rt(U, P, B), rt(U, M, B), rt(U, V, B), rt(U, st, B), rt(U, I, B), rt(U, j, B), rt(U, mt, B), rt(U, W, B), rt(U, At, B), rt(U, Q, B), dt || (Z = [
        kt(e, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.SHAPE)
          ) && r[10](H.SHAPE).apply(this, arguments);
        }),
        kt(h, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.SHAPE)
          ) && r[10](H.SHAPE).apply(this, arguments);
        }),
        kt(p, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.TOP)
          ) && r[10](H.TOP).apply(this, arguments);
        }),
        kt(v, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.RIGHT)
          ) && r[10](H.RIGHT).apply(this, arguments);
        }),
        kt(A, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.BOTTOM)
          ) && r[10](H.BOTTOM).apply(this, arguments);
        }),
        kt(M, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.LEFT)
          ) && r[10](H.LEFT).apply(this, arguments);
        }),
        kt(st, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.TOP_LEFT)
          ) && r[10](H.TOP_LEFT).apply(this, arguments);
        }),
        kt(j, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.TOP_RIGHT)
          ) && r[10](H.TOP_RIGHT).apply(this, arguments);
        }),
        kt(W, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.BOTTOM_RIGHT)
          ) && r[10](H.BOTTOM_RIGHT).apply(this, arguments);
        }),
        kt(Q, "pointerdown", function() {
          Ut(
            /*grab*/
            r[10](H.BOTTOM_LEFT)
          ) && r[10](H.BOTTOM_LEFT).apply(this, arguments);
        })
      ], dt = !0);
    },
    p(U, B) {
      r = U, B & /*computedStyle*/
      2 && t !== (t = /*computedStyle*/
      r[1] ? "display:none;" : void 0) && R(e, "style", t), B & /*geom*/
      16 && i !== (i = /*geom*/
      r[4].x) && R(e, "x", i), B & /*geom*/
      16 && n !== (n = /*geom*/
      r[4].y) && R(e, "y", n), B & /*geom*/
      16 && o !== (o = /*geom*/
      r[4].w) && R(e, "width", o), B & /*geom*/
      16 && s !== (s = /*geom*/
      r[4].h) && R(e, "height", s), B & /*computedStyle*/
      2 && R(
        h,
        "style",
        /*computedStyle*/
        r[1]
      ), B & /*geom*/
      16 && u !== (u = /*geom*/
      r[4].x) && R(h, "x", u), B & /*geom*/
      16 && l !== (l = /*geom*/
      r[4].y) && R(h, "y", l), B & /*geom*/
      16 && c !== (c = /*geom*/
      r[4].w) && R(h, "width", c), B & /*geom*/
      16 && d !== (d = /*geom*/
      r[4].h) && R(h, "height", d), B & /*geom*/
      16 && m !== (m = /*geom*/
      r[4].x) && R(p, "x", m), B & /*geom*/
      16 && y !== (y = /*geom*/
      r[4].y) && R(p, "y", y), B & /*geom*/
      16 && _ !== (_ = /*geom*/
      r[4].w) && R(p, "width", _), B & /*geom*/
      16 && b !== (b = /*geom*/
      r[4].x + /*geom*/
      r[4].w) && R(v, "x", b), B & /*geom*/
      16 && T !== (T = /*geom*/
      r[4].y) && R(v, "y", T), B & /*geom*/
      16 && S !== (S = /*geom*/
      r[4].h) && R(v, "height", S), B & /*geom*/
      16 && x !== (x = /*geom*/
      r[4].x) && R(A, "x", x), B & /*geom*/
      16 && E !== (E = /*geom*/
      r[4].y + /*geom*/
      r[4].h) && R(A, "y", E), B & /*geom*/
      16 && O !== (O = /*geom*/
      r[4].w) && R(A, "width", O), B & /*geom*/
      16 && F !== (F = /*geom*/
      r[4].x) && R(M, "x", F), B & /*geom*/
      16 && D !== (D = /*geom*/
      r[4].y) && R(M, "y", D), B & /*geom*/
      16 && C !== (C = /*geom*/
      r[4].h) && R(M, "height", C), B & /*geom, handleSize*/
      24 && q !== (q = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2) && R(st, "x", q), B & /*geom, handleSize*/
      24 && L !== (L = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2) && R(st, "y", L), B & /*handleSize*/
      8 && R(
        st,
        "height",
        /*handleSize*/
        r[3]
      ), B & /*handleSize*/
      8 && R(
        st,
        "width",
        /*handleSize*/
        r[3]
      ), B & /*geom, handleSize*/
      24 && K !== (K = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2) && R(j, "x", K), B & /*geom, handleSize*/
      24 && J !== (J = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2) && R(j, "y", J), B & /*handleSize*/
      8 && R(
        j,
        "height",
        /*handleSize*/
        r[3]
      ), B & /*handleSize*/
      8 && R(
        j,
        "width",
        /*handleSize*/
        r[3]
      ), B & /*geom, handleSize*/
      24 && lt !== (lt = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2) && R(W, "x", lt), B & /*geom, handleSize*/
      24 && vt !== (vt = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2) && R(W, "y", vt), B & /*handleSize*/
      8 && R(
        W,
        "height",
        /*handleSize*/
        r[3]
      ), B & /*handleSize*/
      8 && R(
        W,
        "width",
        /*handleSize*/
        r[3]
      ), B & /*geom, handleSize*/
      24 && ot !== (ot = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2) && R(Q, "x", ot), B & /*geom, handleSize*/
      24 && at !== (at = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2) && R(Q, "y", at), B & /*handleSize*/
      8 && R(
        Q,
        "height",
        /*handleSize*/
        r[3]
      ), B & /*handleSize*/
      8 && R(
        Q,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    d(U) {
      U && et(e), U && et(a), U && et(h), U && et(f), U && et(p), U && et(g), U && et(v), U && et(w), U && et(A), U && et(P), U && et(M), U && et(V), U && et(st), U && et(I), U && et(j), U && et(mt), U && et(W), U && et(At), U && et(Q), dt = !1, ur(Z);
    }
  };
}
function dd(r) {
  let e, t;
  return e = new ku({
    props: {
      shape: (
        /*shape*/
        r[0]
      ),
      transform: (
        /*transform*/
        r[2]
      ),
      editor: (
        /*editor*/
        r[5]
      ),
      $$slots: {
        default: [
          cd,
          ({ grab: i }) => ({ 10: i }),
          ({ grab: i }) => i ? 1024 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), e.$on(
    "grab",
    /*grab_handler*/
    r[7]
  ), e.$on(
    "change",
    /*change_handler*/
    r[8]
  ), e.$on(
    "release",
    /*release_handler*/
    r[9]
  ), {
    c() {
      Gu(e.$$.fragment);
    },
    m(i, n) {
      Ys(e, i, n), t = !0;
    },
    p(i, [n]) {
      const o = {};
      n & /*shape*/
      1 && (o.shape = /*shape*/
      i[0]), n & /*transform*/
      4 && (o.transform = /*transform*/
      i[2]), n & /*$$scope, geom, handleSize, grab, computedStyle*/
      3098 && (o.$$scope = { dirty: n, ctx: i }), e.$set(o);
    },
    i(i) {
      t || (Bn(e.$$.fragment, i), t = !0);
    },
    o(i) {
      Hs(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Vs(e, i);
    }
  };
}
function fd(r, e, t) {
  let i, n, { shape: o } = e, { computedStyle: s = void 0 } = e, { transform: a } = e, { viewportScale: h = 1 } = e;
  const u = (f, p, m) => {
    const y = f.geometry.bounds;
    let [_, g] = [y.minX, y.minY], [v, b] = [y.maxX, y.maxY];
    const [T, S] = m;
    if (p === H.SHAPE)
      _ += T, v += T, g += S, b += S;
    else {
      switch (p) {
        case H.TOP:
        case H.TOP_LEFT:
        case H.TOP_RIGHT: {
          g += S;
          break;
        }
        case H.BOTTOM:
        case H.BOTTOM_LEFT:
        case H.BOTTOM_RIGHT: {
          b += S;
          break;
        }
      }
      switch (p) {
        case H.LEFT:
        case H.TOP_LEFT:
        case H.BOTTOM_LEFT: {
          _ += T;
          break;
        }
        case H.RIGHT:
        case H.TOP_RIGHT:
        case H.BOTTOM_RIGHT: {
          v += T;
          break;
        }
      }
    }
    const w = Math.min(_, v), A = Math.min(g, b), x = Math.abs(v - _), E = Math.abs(b - g);
    return {
      ...f,
      geometry: {
        x: w,
        y: A,
        w: x,
        h: E,
        bounds: {
          minX: w,
          minY: A,
          maxX: w + x,
          maxY: A + E
        }
      }
    };
  };
  function l(f) {
    Mr.call(this, r, f);
  }
  function c(f) {
    Mr.call(this, r, f);
  }
  function d(f) {
    Mr.call(this, r, f);
  }
  return r.$$set = (f) => {
    "shape" in f && t(0, o = f.shape), "computedStyle" in f && t(1, s = f.computedStyle), "transform" in f && t(2, a = f.transform), "viewportScale" in f && t(6, h = f.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && t(4, i = o.geometry), r.$$.dirty & /*viewportScale*/
    64 && t(3, n = 10 / h);
  }, [
    o,
    s,
    a,
    n,
    i,
    u,
    h,
    l,
    c,
    d
  ];
}
class pd extends Ei {
  constructor(e) {
    super(), Ti(this, e, fd, dd, xi, {
      shape: 0,
      computedStyle: 1,
      transform: 2,
      viewportScale: 6
    });
  }
}
const Uu = /* @__PURE__ */ new Map([
  [jt.RECTANGLE, pd],
  [jt.POLYGON, ld]
]), Pa = (r) => Uu.get(r.type), md = (r, e) => Uu.set(r, e), H = (r) => `HANDLE-${r}`;
H.SHAPE = "SHAPE";
H.TOP = "TOP";
H.RIGHT = "RIGHT";
H.BOTTOM = "BOTTOM";
H.LEFT = "LEFT";
H.TOP_LEFT = "TOP_LEFT";
H.TOP_RIGHT = "TOP_RIGHT";
H.BOTTOM_RIGHT = "BOTTOM_RIGHT";
H.BOTTOM_LEFT = "BOTTOM_LEFT";
const yd = (r) => ({}), Ma = (r) => ({ grab: (
  /*onGrab*/
  r[0]
) });
function _d(r) {
  let e, t, i, n;
  const o = (
    /*#slots*/
    r[7].default
  ), s = Rc(
    o,
    r,
    /*$$scope*/
    r[6],
    Ma
  );
  return {
    c() {
      e = St("g"), s && s.c(), R(e, "class", "a9s-annotation selected");
    },
    m(a, h) {
      rt(a, e, h), s && s.m(e, null), t = !0, i || (n = [
        kt(
          e,
          "pointerup",
          /*onRelease*/
          r[2]
        ),
        kt(
          e,
          "pointermove",
          /*onPointerMove*/
          r[1]
        )
      ], i = !0);
    },
    p(a, [h]) {
      s && s.p && (!t || h & /*$$scope*/
      64) && Mc(
        s,
        o,
        a,
        /*$$scope*/
        a[6],
        t ? Pc(
          o,
          /*$$scope*/
          a[6],
          h,
          yd
        ) : Ic(
          /*$$scope*/
          a[6]
        ),
        Ma
      );
    },
    i(a) {
      t || (Bn(s, a), t = !0);
    },
    o(a) {
      Hs(s, a), t = !1;
    },
    d(a) {
      a && et(e), s && s.d(a), i = !1, ur(n);
    }
  };
}
function gd(r, e, t) {
  let { $$slots: i = {}, $$scope: n } = e;
  const o = js();
  let { shape: s } = e, { editor: a } = e, { transform: h } = e, u = null, l, c = null;
  const d = (m) => (y) => {
    u = m, l = h.elementToImage(y.offsetX, y.offsetY), c = s, y.target.setPointerCapture(y.pointerId), o("grab");
  }, f = (m) => {
    if (u) {
      const [y, _] = h.elementToImage(m.offsetX, m.offsetY), g = [y - l[0], _ - l[1]];
      t(3, s = a(c, u, g)), o("change", s);
    }
  }, p = (m) => {
    m.target.releasePointerCapture(m.pointerId), u = null, c = s, o("release");
  };
  return r.$$set = (m) => {
    "shape" in m && t(3, s = m.shape), "editor" in m && t(4, a = m.editor), "transform" in m && t(5, h = m.transform), "$$scope" in m && t(6, n = m.$$scope);
  }, [d, f, p, s, a, h, n, i];
}
class ku extends Ei {
  constructor(e) {
    super(), Ti(this, e, gd, _d, xi, { shape: 3, editor: 4, transform: 5 });
  }
}
function Ia(r) {
  let e, t;
  return {
    c() {
      e = St("rect"), t = St("rect"), R(e, "class", "a9s-outer"), R(
        e,
        "x",
        /*x*/
        r[1]
      ), R(
        e,
        "y",
        /*y*/
        r[2]
      ), R(
        e,
        "width",
        /*w*/
        r[3]
      ), R(
        e,
        "height",
        /*h*/
        r[4]
      ), R(t, "class", "a9s-inner"), R(
        t,
        "x",
        /*x*/
        r[1]
      ), R(
        t,
        "y",
        /*y*/
        r[2]
      ), R(
        t,
        "width",
        /*w*/
        r[3]
      ), R(
        t,
        "height",
        /*h*/
        r[4]
      );
    },
    m(i, n) {
      rt(i, e, n), rt(i, t, n);
    },
    p(i, n) {
      n & /*x*/
      2 && R(
        e,
        "x",
        /*x*/
        i[1]
      ), n & /*y*/
      4 && R(
        e,
        "y",
        /*y*/
        i[2]
      ), n & /*w*/
      8 && R(
        e,
        "width",
        /*w*/
        i[3]
      ), n & /*h*/
      16 && R(
        e,
        "height",
        /*h*/
        i[4]
      ), n & /*x*/
      2 && R(
        t,
        "x",
        /*x*/
        i[1]
      ), n & /*y*/
      4 && R(
        t,
        "y",
        /*y*/
        i[2]
      ), n & /*w*/
      8 && R(
        t,
        "width",
        /*w*/
        i[3]
      ), n & /*h*/
      16 && R(
        t,
        "height",
        /*h*/
        i[4]
      );
    },
    d(i) {
      i && et(e), i && et(t);
    }
  };
}
function vd(r) {
  let e, t = (
    /*origin*/
    r[0] && Ia(r)
  );
  return {
    c() {
      e = St("g"), t && t.c(), R(e, "class", "a9s-annotation a9s-rubberband");
    },
    m(i, n) {
      rt(i, e, n), t && t.m(e, null);
    },
    p(i, [n]) {
      i[0] ? t ? t.p(i, n) : (t = Ia(i), t.c(), t.m(e, null)) : t && (t.d(1), t = null);
    },
    i: nr,
    o: nr,
    d(i) {
      i && et(e), t && t.d();
    }
  };
}
function bd(r, e, t) {
  const i = js();
  let { addEventListener: n } = e, { drawingMode: o } = e, { transform: s } = e, a, h, u, l, c, d, f;
  const p = (g) => {
    a = performance.now(), o === "drag" && (t(0, h = s.elementToImage(g.offsetX, g.offsetY)), u = h, t(1, l = h[0]), t(2, c = h[1]), t(3, d = 1), t(4, f = 1));
  }, m = (g) => {
    h && (u = s.elementToImage(g.offsetX, g.offsetY), t(1, l = Math.min(u[0], h[0])), t(2, c = Math.min(u[1], h[1])), t(3, d = Math.abs(u[0] - h[0])), t(4, f = Math.abs(u[1] - h[1])));
  }, y = (g) => {
    const v = performance.now() - a;
    if (o === "click") {
      if (v > 300)
        return;
      g.stopPropagation(), h ? _() : (t(0, h = s.elementToImage(g.offsetX, g.offsetY)), u = h, t(1, l = h[0]), t(2, c = h[1]), t(3, d = 1), t(4, f = 1));
    } else
      h && (v > 300 || d * f > 100 ? (g.stopPropagation(), _()) : (t(0, h = null), u = null));
  }, _ = () => {
    if (d * f > 15) {
      const g = {
        type: jt.RECTANGLE,
        geometry: {
          bounds: {
            minX: l,
            minY: c,
            maxX: l + d,
            maxY: c + f
          },
          x: l,
          y: c,
          w: d,
          h: f
        }
      };
      i("create", g);
    }
    t(0, h = null), u = null;
  };
  return Lu(() => {
    n("pointerdown", p), n("pointermove", m), n("pointerup", y, !0);
  }), r.$$set = (g) => {
    "addEventListener" in g && t(5, n = g.addEventListener), "drawingMode" in g && t(6, o = g.drawingMode), "transform" in g && t(7, s = g.transform);
  }, [h, l, c, d, f, n, o, s];
}
class xd extends Ei {
  constructor(e) {
    super(), Ti(this, e, bd, vd, xi, {
      addEventListener: 5,
      drawingMode: 6,
      transform: 7
    });
  }
}
const zn = (r, e) => {
  const t = Math.abs(e[0] - r[0]), i = Math.abs(e[1] - r[1]);
  return Math.sqrt(Math.pow(t, 2) + Math.pow(i, 2));
};
function Wn(r) {
  const e = r.slice(), t = (
    /*isClosable*/
    (e[2] ? (
      /*points*/
      e[0]
    ) : [
      .../*points*/
      e[0],
      /*cursor*/
      e[1]
    ]).map((i) => i.join(",")).join(" ")
  );
  return e[15] = t, e;
}
function Da(r) {
  let e, t, i, n, o, s = (
    /*isClosable*/
    r[2] && Ca(r)
  );
  return {
    c() {
      e = St("polygon"), i = St("polygon"), s && s.c(), o = Nu(), R(e, "class", "a9s-outer"), R(e, "points", t = /*coords*/
      r[15]), R(i, "class", "a9s-inner"), R(i, "points", n = /*coords*/
      r[15]);
    },
    m(a, h) {
      rt(a, e, h), rt(a, i, h), s && s.m(a, h), rt(a, o, h);
    },
    p(a, h) {
      h & /*isClosable, points, cursor*/
      7 && t !== (t = /*coords*/
      a[15]) && R(e, "points", t), h & /*isClosable, points, cursor*/
      7 && n !== (n = /*coords*/
      a[15]) && R(i, "points", n), /*isClosable*/
      a[2] ? s ? s.p(a, h) : (s = Ca(a), s.c(), s.m(o.parentNode, o)) : s && (s.d(1), s = null);
    },
    d(a) {
      a && et(e), a && et(i), s && s.d(a), a && et(o);
    }
  };
}
function Ca(r) {
  let e, t, i;
  return {
    c() {
      e = St("rect"), R(e, "class", "a9s-corner-handle"), R(e, "x", t = /*points*/
      r[0][0][0] - /*handleSize*/
      r[3] / 2), R(e, "y", i = /*points*/
      r[0][0][1] - /*handleSize*/
      r[3] / 2), R(
        e,
        "height",
        /*handleSize*/
        r[3]
      ), R(
        e,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(n, o) {
      rt(n, e, o);
    },
    p(n, o) {
      o & /*points, handleSize*/
      9 && t !== (t = /*points*/
      n[0][0][0] - /*handleSize*/
      n[3] / 2) && R(e, "x", t), o & /*points, handleSize*/
      9 && i !== (i = /*points*/
      n[0][0][1] - /*handleSize*/
      n[3] / 2) && R(e, "y", i), o & /*handleSize*/
      8 && R(
        e,
        "height",
        /*handleSize*/
        n[3]
      ), o & /*handleSize*/
      8 && R(
        e,
        "width",
        /*handleSize*/
        n[3]
      );
    },
    d(n) {
      n && et(e);
    }
  };
}
function Td(r) {
  let e, t = (
    /*cursor*/
    r[1] && Da(Wn(r))
  );
  return {
    c() {
      e = St("g"), t && t.c(), R(e, "class", "a9s-annotation a9s-rubberband");
    },
    m(i, n) {
      rt(i, e, n), t && t.m(e, null);
    },
    p(i, [n]) {
      i[1] ? t ? t.p(Wn(i), n) : (t = Da(Wn(i)), t.c(), t.m(e, null)) : t && (t.d(1), t = null);
    },
    i: nr,
    o: nr,
    d(i) {
      i && et(e), t && t.d();
    }
  };
}
const Ed = 20;
function Ad(r, e, t) {
  let i;
  const n = js();
  let { addEventListener: o } = e, { drawingMode: s } = e, { transform: a } = e, { viewportScale: h = 1 } = e, u, l = [], c = null, d = !1;
  const f = (g) => {
    const { timeStamp: v, offsetX: b, offsetY: T } = g;
    if (u = { timeStamp: v, offsetX: b, offsetY: T }, s === "drag" && l.length === 0) {
      const S = a.elementToImage(g.offsetX, g.offsetY);
      l.push(S), t(1, c = S);
    }
  }, p = (g) => {
    if (l.length > 0 && (t(1, c = a.elementToImage(g.offsetX, g.offsetY)), l.length > 2)) {
      const v = zn(c, l[0]) * h;
      t(2, d = v < Ed);
    }
  }, m = (g) => {
    if (s === "click") {
      const v = g.timeStamp - u.timeStamp, b = zn([u.offsetX, u.offsetY], [g.offsetX, g.offsetY]);
      if (v > 300 || b > 15)
        return;
      if (d)
        _();
      else if (l.length === 0) {
        const T = a.elementToImage(g.offsetX, g.offsetY);
        l.push(T), t(1, c = T);
      } else
        l.push(c);
    } else {
      if (l.length === 1 && zn(l[0], c) <= 4) {
        t(0, l = []), t(1, c = null);
        return;
      }
      g.stopImmediatePropagation(), d ? _() : l.push(c);
    }
  }, y = () => {
    const g = [...l, c], v = {
      type: jt.POLYGON,
      geometry: { bounds: jo(g), points: g }
    };
    Xo(v) > 4 && (t(0, l = []), t(1, c = null), n("create", v));
  }, _ = () => {
    const g = {
      type: jt.POLYGON,
      geometry: {
        bounds: jo(l),
        points: [...l]
      }
    };
    t(0, l = []), t(1, c = null), n("create", g);
  };
  return Lu(() => {
    o("pointerdown", f, !0), o("pointermove", p), o("pointerup", m, !0), o("dblclick", y, !0);
  }), r.$$set = (g) => {
    "addEventListener" in g && t(4, o = g.addEventListener), "drawingMode" in g && t(5, s = g.drawingMode), "transform" in g && t(6, a = g.transform), "viewportScale" in g && t(7, h = g.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*viewportScale*/
    128 && t(3, i = 10 / h);
  }, [
    l,
    c,
    d,
    i,
    o,
    s,
    a,
    h
  ];
}
class Sd extends Ei {
  constructor(e) {
    super(), Ti(this, e, Ad, Td, xi, {
      addEventListener: 4,
      drawingMode: 5,
      transform: 6,
      viewportScale: 7
    });
  }
}
const qs = /* @__PURE__ */ new Map([
  ["rectangle", { tool: xd }],
  ["polygon", { tool: Sd }]
]), Ho = () => [...qs.keys()], Xu = (r) => qs.get(r), wd = (r, e, t) => qs.set(r, { tool: e, opts: t });
function Od(r, e, t, i, n) {
  ju(r, e, t || 0, i || r.length - 1, n || Rd);
}
function ju(r, e, t, i, n) {
  for (; i > t; ) {
    if (i - t > 600) {
      var o = i - t + 1, s = e - t + 1, a = Math.log(o), h = 0.5 * Math.exp(2 * a / 3), u = 0.5 * Math.sqrt(a * h * (o - h) / o) * (s - o / 2 < 0 ? -1 : 1), l = Math.max(t, Math.floor(e - s * h / o + u)), c = Math.min(i, Math.floor(e + (o - s) * h / o + u));
      ju(r, e, l, c, n);
    }
    var d = r[e], f = t, p = i;
    for (Vr(r, t, e), n(r[i], d) > 0 && Vr(r, t, i); f < p; ) {
      for (Vr(r, f, p), f++, p--; n(r[f], d) < 0; )
        f++;
      for (; n(r[p], d) > 0; )
        p--;
    }
    n(r[t], d) === 0 ? Vr(r, t, p) : (p++, Vr(r, p, i)), p <= e && (t = p + 1), e <= p && (i = p - 1);
  }
}
function Vr(r, e, t) {
  var i = r[e];
  r[e] = r[t], r[t] = i;
}
function Rd(r, e) {
  return r < e ? -1 : r > e ? 1 : 0;
}
class Pd {
  constructor(e = 9) {
    this._maxEntries = Math.max(4, e), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(e) {
    let t = this.data;
    const i = [];
    if (!Ci(e, t))
      return i;
    const n = this.toBBox, o = [];
    for (; t; ) {
      for (let s = 0; s < t.children.length; s++) {
        const a = t.children[s], h = t.leaf ? n(a) : a;
        Ci(e, h) && (t.leaf ? i.push(a) : Kn(e, h) ? this._all(a, i) : o.push(a));
      }
      t = o.pop();
    }
    return i;
  }
  collides(e) {
    let t = this.data;
    if (!Ci(e, t))
      return !1;
    const i = [];
    for (; t; ) {
      for (let n = 0; n < t.children.length; n++) {
        const o = t.children[n], s = t.leaf ? this.toBBox(o) : o;
        if (Ci(e, s)) {
          if (t.leaf || Kn(e, s))
            return !0;
          i.push(o);
        }
      }
      t = i.pop();
    }
    return !1;
  }
  load(e) {
    if (!(e && e.length))
      return this;
    if (e.length < this._minEntries) {
      for (let i = 0; i < e.length; i++)
        this.insert(e[i]);
      return this;
    }
    let t = this._build(e.slice(), 0, e.length - 1, 0);
    if (!this.data.children.length)
      this.data = t;
    else if (this.data.height === t.height)
      this._splitRoot(this.data, t);
    else {
      if (this.data.height < t.height) {
        const i = this.data;
        this.data = t, t = i;
      }
      this._insert(t, this.data.height - t.height - 1, !0);
    }
    return this;
  }
  insert(e) {
    return e && this._insert(e, this.data.height - 1), this;
  }
  clear() {
    return this.data = Er([]), this;
  }
  remove(e, t) {
    if (!e)
      return this;
    let i = this.data;
    const n = this.toBBox(e), o = [], s = [];
    let a, h, u;
    for (; i || o.length; ) {
      if (i || (i = o.pop(), h = o[o.length - 1], a = s.pop(), u = !0), i.leaf) {
        const l = Md(e, i.children, t);
        if (l !== -1)
          return i.children.splice(l, 1), o.push(i), this._condense(o), this;
      }
      !u && !i.leaf && Kn(i, n) ? (o.push(i), s.push(a), a = 0, h = i, i = i.children[0]) : h ? (a++, i = h.children[a], u = !1) : i = null;
    }
    return this;
  }
  toBBox(e) {
    return e;
  }
  compareMinX(e, t) {
    return e.minX - t.minX;
  }
  compareMinY(e, t) {
    return e.minY - t.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(e) {
    return this.data = e, this;
  }
  _all(e, t) {
    const i = [];
    for (; e; )
      e.leaf ? t.push(...e.children) : i.push(...e.children), e = i.pop();
    return t;
  }
  _build(e, t, i, n) {
    const o = i - t + 1;
    let s = this._maxEntries, a;
    if (o <= s)
      return a = Er(e.slice(t, i + 1)), mr(a, this.toBBox), a;
    n || (n = Math.ceil(Math.log(o) / Math.log(s)), s = Math.ceil(o / Math.pow(s, n - 1))), a = Er([]), a.leaf = !1, a.height = n;
    const h = Math.ceil(o / s), u = h * Math.ceil(Math.sqrt(s));
    Na(e, t, i, u, this.compareMinX);
    for (let l = t; l <= i; l += u) {
      const c = Math.min(l + u - 1, i);
      Na(e, l, c, h, this.compareMinY);
      for (let d = l; d <= c; d += h) {
        const f = Math.min(d + h - 1, c);
        a.children.push(this._build(e, d, f, n - 1));
      }
    }
    return mr(a, this.toBBox), a;
  }
  _chooseSubtree(e, t, i, n) {
    for (; n.push(t), !(t.leaf || n.length - 1 === i); ) {
      let o = 1 / 0, s = 1 / 0, a;
      for (let h = 0; h < t.children.length; h++) {
        const u = t.children[h], l = qn(u), c = Cd(e, u) - l;
        c < s ? (s = c, o = l < o ? l : o, a = u) : c === s && l < o && (o = l, a = u);
      }
      t = a || t.children[0];
    }
    return t;
  }
  _insert(e, t, i) {
    const n = i ? e : this.toBBox(e), o = [], s = this._chooseSubtree(n, this.data, t, o);
    for (s.children.push(e), ei(s, n); t >= 0 && o[t].children.length > this._maxEntries; )
      this._split(o, t), t--;
    this._adjustParentBBoxes(n, o, t);
  }
  // split overflowed node into two
  _split(e, t) {
    const i = e[t], n = i.children.length, o = this._minEntries;
    this._chooseSplitAxis(i, o, n);
    const s = this._chooseSplitIndex(i, o, n), a = Er(i.children.splice(s, i.children.length - s));
    a.height = i.height, a.leaf = i.leaf, mr(i, this.toBBox), mr(a, this.toBBox), t ? e[t - 1].children.push(a) : this._splitRoot(i, a);
  }
  _splitRoot(e, t) {
    this.data = Er([e, t]), this.data.height = e.height + 1, this.data.leaf = !1, mr(this.data, this.toBBox);
  }
  _chooseSplitIndex(e, t, i) {
    let n, o = 1 / 0, s = 1 / 0;
    for (let a = t; a <= i - t; a++) {
      const h = ti(e, 0, a, this.toBBox), u = ti(e, a, i, this.toBBox), l = Nd(h, u), c = qn(h) + qn(u);
      l < o ? (o = l, n = a, s = c < s ? c : s) : l === o && c < s && (s = c, n = a);
    }
    return n || i - t;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(e, t, i) {
    const n = e.leaf ? this.compareMinX : Id, o = e.leaf ? this.compareMinY : Dd, s = this._allDistMargin(e, t, i, n), a = this._allDistMargin(e, t, i, o);
    s < a && e.children.sort(n);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(e, t, i, n) {
    e.children.sort(n);
    const o = this.toBBox, s = ti(e, 0, t, o), a = ti(e, i - t, i, o);
    let h = Di(s) + Di(a);
    for (let u = t; u < i - t; u++) {
      const l = e.children[u];
      ei(s, e.leaf ? o(l) : l), h += Di(s);
    }
    for (let u = i - t - 1; u >= t; u--) {
      const l = e.children[u];
      ei(a, e.leaf ? o(l) : l), h += Di(a);
    }
    return h;
  }
  _adjustParentBBoxes(e, t, i) {
    for (let n = i; n >= 0; n--)
      ei(t[n], e);
  }
  _condense(e) {
    for (let t = e.length - 1, i; t >= 0; t--)
      e[t].children.length === 0 ? t > 0 ? (i = e[t - 1].children, i.splice(i.indexOf(e[t]), 1)) : this.clear() : mr(e[t], this.toBBox);
  }
}
function Md(r, e, t) {
  if (!t)
    return e.indexOf(r);
  for (let i = 0; i < e.length; i++)
    if (t(r, e[i]))
      return i;
  return -1;
}
function mr(r, e) {
  ti(r, 0, r.children.length, e, r);
}
function ti(r, e, t, i, n) {
  n || (n = Er(null)), n.minX = 1 / 0, n.minY = 1 / 0, n.maxX = -1 / 0, n.maxY = -1 / 0;
  for (let o = e; o < t; o++) {
    const s = r.children[o];
    ei(n, r.leaf ? i(s) : s);
  }
  return n;
}
function ei(r, e) {
  return r.minX = Math.min(r.minX, e.minX), r.minY = Math.min(r.minY, e.minY), r.maxX = Math.max(r.maxX, e.maxX), r.maxY = Math.max(r.maxY, e.maxY), r;
}
function Id(r, e) {
  return r.minX - e.minX;
}
function Dd(r, e) {
  return r.minY - e.minY;
}
function qn(r) {
  return (r.maxX - r.minX) * (r.maxY - r.minY);
}
function Di(r) {
  return r.maxX - r.minX + (r.maxY - r.minY);
}
function Cd(r, e) {
  return (Math.max(e.maxX, r.maxX) - Math.min(e.minX, r.minX)) * (Math.max(e.maxY, r.maxY) - Math.min(e.minY, r.minY));
}
function Nd(r, e) {
  const t = Math.max(r.minX, e.minX), i = Math.max(r.minY, e.minY), n = Math.min(r.maxX, e.maxX), o = Math.min(r.maxY, e.maxY);
  return Math.max(0, n - t) * Math.max(0, o - i);
}
function Kn(r, e) {
  return r.minX <= e.minX && r.minY <= e.minY && e.maxX <= r.maxX && e.maxY <= r.maxY;
}
function Ci(r, e) {
  return e.minX <= r.maxX && e.minY <= r.maxY && e.maxX >= r.minX && e.maxY >= r.minY;
}
function Er(r) {
  return {
    children: r,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function Na(r, e, t, i, n) {
  const o = [e, t];
  for (; o.length; ) {
    if (t = o.pop(), e = o.pop(), t - e <= i)
      continue;
    const s = e + Math.ceil((t - e) / i / 2) * i;
    Od(r, s, e, t, n), o.push(e, s, s, t);
  }
}
const Fd = () => {
  const r = new Pd(), e = /* @__PURE__ */ new Map(), t = () => [...e.values()], i = () => {
    r.clear(), e.clear();
  }, n = (s) => {
    const { minX: a, minY: h, maxX: u, maxY: l } = s.selector.geometry.bounds, c = { minX: a, minY: h, maxX: u, maxY: l, target: s };
    r.insert(c), e.set(s.annotation, c);
  }, o = (s) => {
    const a = e.get(s.annotation);
    r.remove(a), e.delete(s.annotation);
  };
  return {
    all: t,
    clear: i,
    getAt: (s, a) => {
      const h = r.search({
        minX: s,
        minY: a,
        maxX: s,
        maxY: a
      }).map((u) => u.target).filter((u) => u.selector.type === jt.RECTANGLE || Xc(u.selector, s, a));
      if (h.length > 0)
        return h.sort((u, l) => Xo(u.selector) - Xo(l.selector)), h[0];
    },
    getIntersecting: (s, a, h, u) => r.search({
      minX: s,
      minY: a,
      maxX: s + h,
      maxY: a + u
    }).map((l) => l.target),
    insert: n,
    remove: o,
    set: (s, a = !0) => {
      a && i();
      const h = s.map((u) => {
        const { minX: l, minY: c, maxX: d, maxY: f } = u.selector.geometry.bounds;
        return { minX: l, minY: c, maxX: d, maxY: f, target: u };
      });
      h.forEach((u) => e.set(u.target.annotation, u)), r.load(h);
    },
    size: () => r.all().length,
    update: (s, a) => {
      o(s), n(a);
    }
  };
}, Ld = (r) => {
  const e = nd(), t = Fd(), i = Wc(e, r.pointerSelectAction), n = zc(e), o = od();
  return e.observe(({ changes: s }) => {
    t.set(s.created.map((a) => a.target), !1), s.deleted.forEach((a) => t.remove(a.target)), s.updated.forEach(({ oldValue: a, newValue: h }) => t.update(a.target, h.target));
  }), {
    store: {
      ...e,
      getAt: (s, a) => {
        const h = t.getAt(s, a);
        return h ? e.getAnnotation(h.annotation) : void 0;
      },
      getIntersecting: (s, a, h, u) => t.getIntersecting(s, a, h, u).map((l) => e.getAnnotation(l.annotation))
    },
    selection: i,
    hover: n,
    viewport: o
  };
}, Bd = (r, e) => ({
  ...r,
  drawingEnabled: r.drawingEnabled === void 0 ? e.drawingEnabled : r.drawingEnabled,
  drawingMode: r.drawingMode || e.drawingMode,
  pointerSelectAction: r.pointerSelectAction || e.pointerSelectAction,
  theme: r.theme || e.theme
}), Fa = navigator.userAgent.indexOf("Mac OS X") !== -1, Gd = (r, e) => {
  const t = e || document, i = (s) => {
    s.key === "Z" && s.ctrlKey ? r.undo() : s.key === "Y" && s.ctrlKey && r.redo();
  }, n = (s) => {
    s.key === "z" && s.metaKey && (s.shiftKey ? r.redo() : r.undo());
  }, o = () => {
    Fa ? t.removeEventListener("keydown", n) : t.removeEventListener("keydown", i);
  };
  return Fa ? t.addEventListener("keydown", n) : t.addEventListener("keydown", i), {
    destroy: o
  };
};
function Ne() {
}
function Ud(r, e) {
  for (const t in e)
    r[t] = e[t];
  return r;
}
function Hu(r) {
  return r();
}
function La() {
  return /* @__PURE__ */ Object.create(null);
}
function Ai(r) {
  r.forEach(Hu);
}
function Ks(r) {
  return typeof r == "function";
}
function ee(r, e) {
  return r != r ? e == e : r !== e || r && typeof r == "object" || typeof r == "function";
}
function kd(r) {
  return Object.keys(r).length === 0;
}
function Xd(r, ...e) {
  if (r == null)
    return Ne;
  const t = r.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
function Yo(r, e, t) {
  r.$$.on_destroy.push(Xd(e, t));
}
function jd(r, e, t, i) {
  if (r) {
    const n = Yu(r, e, t, i);
    return r[0](n);
  }
}
function Yu(r, e, t, i) {
  return r[1] && i ? Ud(t.ctx.slice(), r[1](i(e))) : t.ctx;
}
function Hd(r, e, t, i) {
  if (r[2] && i) {
    const n = r[2](i(t));
    if (e.dirty === void 0)
      return n;
    if (typeof n == "object") {
      const o = [], s = Math.max(e.dirty.length, n.length);
      for (let a = 0; a < s; a += 1)
        o[a] = e.dirty[a] | n[a];
      return o;
    }
    return e.dirty | n;
  }
  return e.dirty;
}
function Yd(r, e, t, i, n, o) {
  if (n) {
    const s = Yu(e, t, i, o);
    r.p(s, n);
  }
}
function Vd(r) {
  if (r.ctx.length > 32) {
    const e = [], t = r.ctx.length / 32;
    for (let i = 0; i < t; i++)
      e[i] = -1;
    return e;
  }
  return -1;
}
const $d = typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : global;
function Qe(r, e) {
  r.appendChild(e);
}
function re(r, e, t) {
  r.insertBefore(e, t || null);
}
function Ht(r) {
  r.parentNode && r.parentNode.removeChild(r);
}
function Vu(r, e) {
  for (let t = 0; t < r.length; t += 1)
    r[t] && r[t].d(e);
}
function Kt(r) {
  return document.createElementNS("http://www.w3.org/2000/svg", r);
}
function $u(r) {
  return document.createTextNode(r);
}
function jr() {
  return $u("");
}
function Y(r, e, t) {
  t == null ? r.removeAttribute(e) : r.getAttribute(e) !== t && r.setAttribute(e, t);
}
function zd(r) {
  return Array.from(r.childNodes);
}
function Wd(r, e) {
  e = "" + e, r.data !== e && (r.data = e);
}
function Ba(r, e, t) {
  r.classList[t ? "add" : "remove"](e);
}
function qd(r, e, { bubbles: t = !1, cancelable: i = !1 } = {}) {
  const n = document.createEvent("CustomEvent");
  return n.initCustomEvent(r, t, i, e), n;
}
let li;
function ii(r) {
  li = r;
}
function Zs() {
  if (!li)
    throw new Error("Function called outside component initialization");
  return li;
}
function Gn(r) {
  Zs().$$.on_mount.push(r);
}
function Kd(r) {
  Zs().$$.on_destroy.push(r);
}
function Js() {
  const r = Zs();
  return (e, t, { cancelable: i = !1 } = {}) => {
    const n = r.$$.callbacks[e];
    if (n) {
      const o = qd(e, t, { cancelable: i });
      return n.slice().forEach((s) => {
        s.call(r, o);
      }), !o.defaultPrevented;
    }
    return !0;
  };
}
const Ar = [], vn = [];
let Dr = [];
const Ga = [], Zd = /* @__PURE__ */ Promise.resolve();
let Vo = !1;
function Jd() {
  Vo || (Vo = !0, Zd.then(zu));
}
function $o(r) {
  Dr.push(r);
}
const Zn = /* @__PURE__ */ new Set();
let yr = 0;
function zu() {
  if (yr !== 0)
    return;
  const r = li;
  do {
    try {
      for (; yr < Ar.length; ) {
        const e = Ar[yr];
        yr++, ii(e), Qd(e.$$);
      }
    } catch (e) {
      throw Ar.length = 0, yr = 0, e;
    }
    for (ii(null), Ar.length = 0, yr = 0; vn.length; )
      vn.pop()();
    for (let e = 0; e < Dr.length; e += 1) {
      const t = Dr[e];
      Zn.has(t) || (Zn.add(t), t());
    }
    Dr.length = 0;
  } while (Ar.length);
  for (; Ga.length; )
    Ga.pop()();
  Vo = !1, Zn.clear(), ii(r);
}
function Qd(r) {
  if (r.fragment !== null) {
    r.update(), Ai(r.before_update);
    const e = r.dirty;
    r.dirty = [-1], r.fragment && r.fragment.p(r.ctx, e), r.after_update.forEach($o);
  }
}
function tf(r) {
  const e = [], t = [];
  Dr.forEach((i) => r.indexOf(i) === -1 ? e.push(i) : t.push(i)), t.forEach((i) => i()), Dr = e;
}
const cn = /* @__PURE__ */ new Set();
let Ze;
function Le() {
  Ze = {
    r: 0,
    c: [],
    p: Ze
    // parent group
  };
}
function Be() {
  Ze.r || Ai(Ze.c), Ze = Ze.p;
}
function ut(r, e) {
  r && r.i && (cn.delete(r), r.i(e));
}
function _t(r, e, t, i) {
  if (r && r.o) {
    if (cn.has(r))
      return;
    cn.add(r), Ze.c.push(() => {
      cn.delete(r), i && (t && r.d(1), i());
    }), r.o(e);
  } else
    i && i();
}
function Ge(r) {
  r && r.c();
}
function xe(r, e, t, i) {
  const { fragment: n, after_update: o } = r.$$;
  n && n.m(e, t), i || $o(() => {
    const s = r.$$.on_mount.map(Hu).filter(Ks);
    r.$$.on_destroy ? r.$$.on_destroy.push(...s) : Ai(s), r.$$.on_mount = [];
  }), o.forEach($o);
}
function Te(r, e) {
  const t = r.$$;
  t.fragment !== null && (tf(t.after_update), Ai(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function ef(r, e) {
  r.$$.dirty[0] === -1 && (Ar.push(r), Jd(), r.$$.dirty.fill(0)), r.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Ee(r, e, t, i, n, o, s, a = [-1]) {
  const h = li;
  ii(r);
  const u = r.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: o,
    update: Ne,
    not_equal: n,
    bound: La(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (h ? h.$$.context : [])),
    // everything else
    callbacks: La(),
    dirty: a,
    skip_bound: !1,
    root: e.target || h.$$.root
  };
  s && s(u.root);
  let l = !1;
  if (u.ctx = t ? t(r, e.props || {}, (c, d, ...f) => {
    const p = f.length ? f[0] : d;
    return u.ctx && n(u.ctx[c], u.ctx[c] = p) && (!u.skip_bound && u.bound[c] && u.bound[c](p), l && ef(r, c)), d;
  }) : [], u.update(), l = !0, Ai(u.before_update), u.fragment = i ? i(u.ctx) : !1, e.target) {
    if (e.hydrate) {
      const c = zd(e.target);
      u.fragment && u.fragment.l(c), c.forEach(Ht);
    } else
      u.fragment && u.fragment.c();
    e.intro && ut(r.$$.fragment), xe(r, e.target, e.anchor, e.customElement), zu();
  }
  ii(h);
}
class Ae {
  $destroy() {
    Te(this, 1), this.$destroy = Ne;
  }
  $on(e, t) {
    if (!Ks(t))
      return Ne;
    const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return i.push(t), () => {
      const n = i.indexOf(t);
      n !== -1 && i.splice(n, 1);
    };
  }
  $set(e) {
    this.$$set && !kd(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
function rf(r) {
  var e = this.constructor;
  return this.then(
    function(t) {
      return e.resolve(r()).then(function() {
        return t;
      });
    },
    function(t) {
      return e.resolve(r()).then(function() {
        return e.reject(t);
      });
    }
  );
}
function nf(r) {
  var e = this;
  return new e(function(t, i) {
    if (!(r && typeof r.length < "u"))
      return i(
        new TypeError(
          typeof r + " " + r + " is not iterable(cannot read property Symbol(Symbol.iterator))"
        )
      );
    var n = Array.prototype.slice.call(r);
    if (n.length === 0)
      return t([]);
    var o = n.length;
    function s(h, u) {
      if (u && (typeof u == "object" || typeof u == "function")) {
        var l = u.then;
        if (typeof l == "function") {
          l.call(
            u,
            function(c) {
              s(h, c);
            },
            function(c) {
              n[h] = { status: "rejected", reason: c }, --o === 0 && t(n);
            }
          );
          return;
        }
      }
      n[h] = { status: "fulfilled", value: u }, --o === 0 && t(n);
    }
    for (var a = 0; a < n.length; a++)
      s(a, n[a]);
  });
}
function Wu(r, e) {
  this.name = "AggregateError", this.errors = r, this.message = e || "";
}
Wu.prototype = Error.prototype;
function of(r) {
  var e = this;
  return new e(function(t, i) {
    if (!(r && typeof r.length < "u"))
      return i(new TypeError("Promise.any accepts an array"));
    var n = Array.prototype.slice.call(r);
    if (n.length === 0)
      return i();
    for (var o = [], s = 0; s < n.length; s++)
      try {
        e.resolve(n[s]).then(t).catch(function(a) {
          o.push(a), o.length === n.length && i(
            new Wu(
              o,
              "All promises were rejected"
            )
          );
        });
      } catch (a) {
        i(a);
      }
  });
}
var sf = setTimeout;
function qu(r) {
  return !!(r && typeof r.length < "u");
}
function af() {
}
function hf(r, e) {
  return function() {
    r.apply(e, arguments);
  };
}
function Tt(r) {
  if (!(this instanceof Tt))
    throw new TypeError("Promises must be constructed via new");
  if (typeof r != "function")
    throw new TypeError("not a function");
  this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], Zu(r, this);
}
function Ku(r, e) {
  for (; r._state === 3; )
    r = r._value;
  if (r._state === 0) {
    r._deferreds.push(e);
    return;
  }
  r._handled = !0, Tt._immediateFn(function() {
    var t = r._state === 1 ? e.onFulfilled : e.onRejected;
    if (t === null) {
      (r._state === 1 ? zo : ci)(e.promise, r._value);
      return;
    }
    var i;
    try {
      i = t(r._value);
    } catch (n) {
      ci(e.promise, n);
      return;
    }
    zo(e.promise, i);
  });
}
function zo(r, e) {
  try {
    if (e === r)
      throw new TypeError("A promise cannot be resolved with itself.");
    if (e && (typeof e == "object" || typeof e == "function")) {
      var t = e.then;
      if (e instanceof Tt) {
        r._state = 3, r._value = e, Wo(r);
        return;
      } else if (typeof t == "function") {
        Zu(hf(t, e), r);
        return;
      }
    }
    r._state = 1, r._value = e, Wo(r);
  } catch (i) {
    ci(r, i);
  }
}
function ci(r, e) {
  r._state = 2, r._value = e, Wo(r);
}
function Wo(r) {
  r._state === 2 && r._deferreds.length === 0 && Tt._immediateFn(function() {
    r._handled || Tt._unhandledRejectionFn(r._value);
  });
  for (var e = 0, t = r._deferreds.length; e < t; e++)
    Ku(r, r._deferreds[e]);
  r._deferreds = null;
}
function uf(r, e, t) {
  this.onFulfilled = typeof r == "function" ? r : null, this.onRejected = typeof e == "function" ? e : null, this.promise = t;
}
function Zu(r, e) {
  var t = !1;
  try {
    r(
      function(i) {
        t || (t = !0, zo(e, i));
      },
      function(i) {
        t || (t = !0, ci(e, i));
      }
    );
  } catch (i) {
    if (t)
      return;
    t = !0, ci(e, i);
  }
}
Tt.prototype.catch = function(r) {
  return this.then(null, r);
};
Tt.prototype.then = function(r, e) {
  var t = new this.constructor(af);
  return Ku(this, new uf(r, e, t)), t;
};
Tt.prototype.finally = rf;
Tt.all = function(r) {
  return new Tt(function(e, t) {
    if (!qu(r))
      return t(new TypeError("Promise.all accepts an array"));
    var i = Array.prototype.slice.call(r);
    if (i.length === 0)
      return e([]);
    var n = i.length;
    function o(a, h) {
      try {
        if (h && (typeof h == "object" || typeof h == "function")) {
          var u = h.then;
          if (typeof u == "function") {
            u.call(
              h,
              function(l) {
                o(a, l);
              },
              t
            );
            return;
          }
        }
        i[a] = h, --n === 0 && e(i);
      } catch (l) {
        t(l);
      }
    }
    for (var s = 0; s < i.length; s++)
      o(s, i[s]);
  });
};
Tt.any = of;
Tt.allSettled = nf;
Tt.resolve = function(r) {
  return r && typeof r == "object" && r.constructor === Tt ? r : new Tt(function(e) {
    e(r);
  });
};
Tt.reject = function(r) {
  return new Tt(function(e, t) {
    t(r);
  });
};
Tt.race = function(r) {
  return new Tt(function(e, t) {
    if (!qu(r))
      return t(new TypeError("Promise.race accepts an array"));
    for (var i = 0, n = r.length; i < n; i++)
      Tt.resolve(r[i]).then(e, t);
  });
};
Tt._immediateFn = // @ts-ignore
typeof setImmediate == "function" && function(r) {
  setImmediate(r);
} || function(r) {
  sf(r, 0);
};
Tt._unhandledRejectionFn = function(r) {
  typeof console < "u" && console && console.warn("Possible Unhandled Promise Rejection:", r);
};
var dn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Qs(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function lf(r) {
  if (r.__esModule)
    return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function i() {
      return this instanceof i ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(i) {
    var n = Object.getOwnPropertyDescriptor(r, i);
    Object.defineProperty(t, i, n.get ? n : {
      enumerable: !0,
      get: function() {
        return r[i];
      }
    });
  }), t;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var Ua = Object.getOwnPropertySymbols, cf = Object.prototype.hasOwnProperty, df = Object.prototype.propertyIsEnumerable;
function ff(r) {
  if (r == null)
    throw new TypeError("Object.assign cannot be called with null or undefined");
  return Object(r);
}
function pf() {
  try {
    if (!Object.assign)
      return !1;
    var r = new String("abc");
    if (r[5] = "de", Object.getOwnPropertyNames(r)[0] === "5")
      return !1;
    for (var e = {}, t = 0; t < 10; t++)
      e["_" + String.fromCharCode(t)] = t;
    var i = Object.getOwnPropertyNames(e).map(function(o) {
      return e[o];
    });
    if (i.join("") !== "0123456789")
      return !1;
    var n = {};
    return "abcdefghijklmnopqrst".split("").forEach(function(o) {
      n[o] = o;
    }), Object.keys(Object.assign({}, n)).join("") === "abcdefghijklmnopqrst";
  } catch {
    return !1;
  }
}
var mf = pf() ? Object.assign : function(r, e) {
  for (var t, i = ff(r), n, o = 1; o < arguments.length; o++) {
    t = Object(arguments[o]);
    for (var s in t)
      cf.call(t, s) && (i[s] = t[s]);
    if (Ua) {
      n = Ua(t);
      for (var a = 0; a < n.length; a++)
        df.call(t, n[a]) && (i[n[a]] = t[n[a]]);
    }
  }
  return i;
};
const yf = /* @__PURE__ */ Qs(mf);
/*!
 * @pixi/polyfill - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/polyfill is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
typeof globalThis > "u" && (typeof self < "u" ? self.globalThis = self : typeof global < "u" && (global.globalThis = global));
globalThis.Promise || (globalThis.Promise = Tt);
Object.assign || (Object.assign = yf);
var _f = 16;
Date.now && Date.prototype.getTime || (Date.now = function() {
  return (/* @__PURE__ */ new Date()).getTime();
});
if (!(globalThis.performance && globalThis.performance.now)) {
  var gf = Date.now();
  globalThis.performance || (globalThis.performance = {}), globalThis.performance.now = function() {
    return Date.now() - gf;
  };
}
var Jn = Date.now(), ka = ["ms", "moz", "webkit", "o"];
for (var Qn = 0; Qn < ka.length && !globalThis.requestAnimationFrame; ++Qn) {
  var to = ka[Qn];
  globalThis.requestAnimationFrame = globalThis[to + "RequestAnimationFrame"], globalThis.cancelAnimationFrame = globalThis[to + "CancelAnimationFrame"] || globalThis[to + "CancelRequestAnimationFrame"];
}
globalThis.requestAnimationFrame || (globalThis.requestAnimationFrame = function(r) {
  if (typeof r != "function")
    throw new TypeError(r + "is not a function");
  var e = Date.now(), t = _f + Jn - e;
  return t < 0 && (t = 0), Jn = e, globalThis.self.setTimeout(function() {
    Jn = Date.now(), r(performance.now());
  }, t);
});
globalThis.cancelAnimationFrame || (globalThis.cancelAnimationFrame = function(r) {
  return clearTimeout(r);
});
Math.sign || (Math.sign = function(r) {
  return r = Number(r), r === 0 || isNaN(r) ? r : r > 0 ? 1 : -1;
});
Number.isInteger || (Number.isInteger = function(r) {
  return typeof r == "number" && isFinite(r) && Math.floor(r) === r;
});
globalThis.ArrayBuffer || (globalThis.ArrayBuffer = Array);
globalThis.Float32Array || (globalThis.Float32Array = Array);
globalThis.Uint32Array || (globalThis.Uint32Array = Array);
globalThis.Uint16Array || (globalThis.Uint16Array = Array);
globalThis.Uint8Array || (globalThis.Uint8Array = Array);
globalThis.Int32Array || (globalThis.Int32Array = Array);
/*!
 * @pixi/constants - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ve;
(function(r) {
  r[r.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", r[r.WEBGL = 1] = "WEBGL", r[r.WEBGL2 = 2] = "WEBGL2";
})(ve || (ve = {}));
var di;
(function(r) {
  r[r.UNKNOWN = 0] = "UNKNOWN", r[r.WEBGL = 1] = "WEBGL", r[r.CANVAS = 2] = "CANVAS";
})(di || (di = {}));
var bn;
(function(r) {
  r[r.COLOR = 16384] = "COLOR", r[r.DEPTH = 256] = "DEPTH", r[r.STENCIL = 1024] = "STENCIL";
})(bn || (bn = {}));
var X;
(function(r) {
  r[r.NORMAL = 0] = "NORMAL", r[r.ADD = 1] = "ADD", r[r.MULTIPLY = 2] = "MULTIPLY", r[r.SCREEN = 3] = "SCREEN", r[r.OVERLAY = 4] = "OVERLAY", r[r.DARKEN = 5] = "DARKEN", r[r.LIGHTEN = 6] = "LIGHTEN", r[r.COLOR_DODGE = 7] = "COLOR_DODGE", r[r.COLOR_BURN = 8] = "COLOR_BURN", r[r.HARD_LIGHT = 9] = "HARD_LIGHT", r[r.SOFT_LIGHT = 10] = "SOFT_LIGHT", r[r.DIFFERENCE = 11] = "DIFFERENCE", r[r.EXCLUSION = 12] = "EXCLUSION", r[r.HUE = 13] = "HUE", r[r.SATURATION = 14] = "SATURATION", r[r.COLOR = 15] = "COLOR", r[r.LUMINOSITY = 16] = "LUMINOSITY", r[r.NORMAL_NPM = 17] = "NORMAL_NPM", r[r.ADD_NPM = 18] = "ADD_NPM", r[r.SCREEN_NPM = 19] = "SCREEN_NPM", r[r.NONE = 20] = "NONE", r[r.SRC_OVER = 0] = "SRC_OVER", r[r.SRC_IN = 21] = "SRC_IN", r[r.SRC_OUT = 22] = "SRC_OUT", r[r.SRC_ATOP = 23] = "SRC_ATOP", r[r.DST_OVER = 24] = "DST_OVER", r[r.DST_IN = 25] = "DST_IN", r[r.DST_OUT = 26] = "DST_OUT", r[r.DST_ATOP = 27] = "DST_ATOP", r[r.ERASE = 26] = "ERASE", r[r.SUBTRACT = 28] = "SUBTRACT", r[r.XOR = 29] = "XOR";
})(X || (X = {}));
var qt;
(function(r) {
  r[r.POINTS = 0] = "POINTS", r[r.LINES = 1] = "LINES", r[r.LINE_LOOP = 2] = "LINE_LOOP", r[r.LINE_STRIP = 3] = "LINE_STRIP", r[r.TRIANGLES = 4] = "TRIANGLES", r[r.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", r[r.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(qt || (qt = {}));
var N;
(function(r) {
  r[r.RGBA = 6408] = "RGBA", r[r.RGB = 6407] = "RGB", r[r.RG = 33319] = "RG", r[r.RED = 6403] = "RED", r[r.RGBA_INTEGER = 36249] = "RGBA_INTEGER", r[r.RGB_INTEGER = 36248] = "RGB_INTEGER", r[r.RG_INTEGER = 33320] = "RG_INTEGER", r[r.RED_INTEGER = 36244] = "RED_INTEGER", r[r.ALPHA = 6406] = "ALPHA", r[r.LUMINANCE = 6409] = "LUMINANCE", r[r.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", r[r.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", r[r.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(N || (N = {}));
var tr;
(function(r) {
  r[r.TEXTURE_2D = 3553] = "TEXTURE_2D", r[r.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", r[r.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", r[r.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", r[r.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", r[r.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", r[r.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(tr || (tr = {}));
var k;
(function(r) {
  r[r.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", r[r.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", r[r.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", r[r.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", r[r.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", r[r.UNSIGNED_INT = 5125] = "UNSIGNED_INT", r[r.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", r[r.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", r[r.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", r[r.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", r[r.BYTE = 5120] = "BYTE", r[r.SHORT = 5122] = "SHORT", r[r.INT = 5124] = "INT", r[r.FLOAT = 5126] = "FLOAT", r[r.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", r[r.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(k || (k = {}));
var xn;
(function(r) {
  r[r.FLOAT = 0] = "FLOAT", r[r.INT = 1] = "INT", r[r.UINT = 2] = "UINT";
})(xn || (xn = {}));
var se;
(function(r) {
  r[r.NEAREST = 0] = "NEAREST", r[r.LINEAR = 1] = "LINEAR";
})(se || (se = {}));
var he;
(function(r) {
  r[r.CLAMP = 33071] = "CLAMP", r[r.REPEAT = 10497] = "REPEAT", r[r.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(he || (he = {}));
var Qt;
(function(r) {
  r[r.OFF = 0] = "OFF", r[r.POW2 = 1] = "POW2", r[r.ON = 2] = "ON", r[r.ON_MANUAL = 3] = "ON_MANUAL";
})(Qt || (Qt = {}));
var te;
(function(r) {
  r[r.NPM = 0] = "NPM", r[r.UNPACK = 1] = "UNPACK", r[r.PMA = 2] = "PMA", r[r.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", r[r.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", r[r.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA", r[r.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA";
})(te || (te = {}));
var Wt;
(function(r) {
  r[r.NO = 0] = "NO", r[r.YES = 1] = "YES", r[r.AUTO = 2] = "AUTO", r[r.BLEND = 0] = "BLEND", r[r.CLEAR = 1] = "CLEAR", r[r.BLIT = 2] = "BLIT";
})(Wt || (Wt = {}));
var Tn;
(function(r) {
  r[r.AUTO = 0] = "AUTO", r[r.MANUAL = 1] = "MANUAL";
})(Tn || (Tn = {}));
var Xt;
(function(r) {
  r.LOW = "lowp", r.MEDIUM = "mediump", r.HIGH = "highp";
})(Xt || (Xt = {}));
var Ot;
(function(r) {
  r[r.NONE = 0] = "NONE", r[r.SCISSOR = 1] = "SCISSOR", r[r.STENCIL = 2] = "STENCIL", r[r.SPRITE = 3] = "SPRITE", r[r.COLOR = 4] = "COLOR";
})(Ot || (Ot = {}));
var Xa;
(function(r) {
  r[r.RED = 1] = "RED", r[r.GREEN = 2] = "GREEN", r[r.BLUE = 4] = "BLUE", r[r.ALPHA = 8] = "ALPHA";
})(Xa || (Xa = {}));
var gt;
(function(r) {
  r[r.NONE = 0] = "NONE", r[r.LOW = 2] = "LOW", r[r.MEDIUM = 4] = "MEDIUM", r[r.HIGH = 8] = "HIGH";
})(gt || (gt = {}));
var ue;
(function(r) {
  r[r.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", r[r.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", r[r.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER";
})(ue || (ue = {}));
/*!
 * @pixi/settings - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/settings is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vf = {
  /**
   * Creates a canvas element of the given size.
   * This canvas is created using the browser's native canvas element.
   * @param width - width of the canvas
   * @param height - height of the canvas
   */
  createCanvas: function(r, e) {
    var t = document.createElement("canvas");
    return t.width = r, t.height = e, t;
  },
  getWebGLRenderingContext: function() {
    return WebGLRenderingContext;
  },
  getNavigator: function() {
    return navigator;
  },
  getBaseUrl: function() {
    var r;
    return (r = document.baseURI) !== null && r !== void 0 ? r : window.location.href;
  },
  fetch: function(r, e) {
    return fetch(r, e);
  }
}, eo = /iPhone/i, ja = /iPod/i, Ha = /iPad/i, Ya = /\biOS-universal(?:.+)Mac\b/i, ro = /\bAndroid(?:.+)Mobile\b/i, Va = /Android/i, _r = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, Ni = /Silk/i, de = /Windows Phone/i, $a = /\bWindows(?:.+)ARM\b/i, za = /BlackBerry/i, Wa = /BB10/i, qa = /Opera Mini/i, Ka = /\b(CriOS|Chrome)(?:.+)Mobile/i, Za = /Mobile(?:.+)Firefox\b/i, Ja = function(r) {
  return typeof r < "u" && r.platform === "MacIntel" && typeof r.maxTouchPoints == "number" && r.maxTouchPoints > 1 && typeof MSStream > "u";
};
function bf(r) {
  return function(e) {
    return e.test(r);
  };
}
function xf(r) {
  var e = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  !r && typeof navigator < "u" ? e = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints || 0
  } : typeof r == "string" ? e.userAgent = r : r && r.userAgent && (e = {
    userAgent: r.userAgent,
    platform: r.platform,
    maxTouchPoints: r.maxTouchPoints || 0
  });
  var t = e.userAgent, i = t.split("[FBAN");
  typeof i[1] < "u" && (t = i[0]), i = t.split("Twitter"), typeof i[1] < "u" && (t = i[0]);
  var n = bf(t), o = {
    apple: {
      phone: n(eo) && !n(de),
      ipod: n(ja),
      tablet: !n(eo) && (n(Ha) || Ja(e)) && !n(de),
      universal: n(Ya),
      device: (n(eo) || n(ja) || n(Ha) || n(Ya) || Ja(e)) && !n(de)
    },
    amazon: {
      phone: n(_r),
      tablet: !n(_r) && n(Ni),
      device: n(_r) || n(Ni)
    },
    android: {
      phone: !n(de) && n(_r) || !n(de) && n(ro),
      tablet: !n(de) && !n(_r) && !n(ro) && (n(Ni) || n(Va)),
      device: !n(de) && (n(_r) || n(Ni) || n(ro) || n(Va)) || n(/\bokhttp\b/i)
    },
    windows: {
      phone: n(de),
      tablet: n($a),
      device: n(de) || n($a)
    },
    other: {
      blackberry: n(za),
      blackberry10: n(Wa),
      opera: n(qa),
      firefox: n(Za),
      chrome: n(Ka),
      device: n(za) || n(Wa) || n(qa) || n(Za) || n(Ka)
    },
    any: !1,
    phone: !1,
    tablet: !1
  };
  return o.any = o.apple.device || o.android.device || o.windows.device || o.other.device, o.phone = o.apple.phone || o.android.phone || o.windows.phone, o.tablet = o.apple.tablet || o.android.tablet || o.windows.tablet, o;
}
var ae = xf(globalThis.navigator);
function Tf() {
  return !ae.apple.device;
}
function Ef(r) {
  var e = !0;
  if (ae.tablet || ae.phone) {
    if (ae.apple.device) {
      var t = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
      if (t) {
        var i = parseInt(t[1], 10);
        i < 11 && (e = !1);
      }
    }
    if (ae.android.device) {
      var t = navigator.userAgent.match(/Android\s([0-9.]*)/);
      if (t) {
        var i = parseInt(t[1], 10);
        i < 7 && (e = !1);
      }
    }
  }
  return e ? r : 4;
}
var G = {
  /**
   * This adapter is used to call methods that are platform dependent.
   * For example `document.createElement` only runs on the web but fails in node environments.
   * This allows us to support more platforms by abstracting away specific implementations per platform.
   *
   * By default the adapter is set to work in the browser. However you can create your own
   * by implementing the `IAdapter` interface. See `IAdapter` for more information.
   * @name ADAPTER
   * @memberof PIXI.settings
   * @type {PIXI.IAdapter}
   * @default PIXI.BrowserAdapter
   */
  ADAPTER: vf,
  /**
   * If set to true WebGL will attempt make textures mimpaped by default.
   * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
   * @static
   * @name MIPMAP_TEXTURES
   * @memberof PIXI.settings
   * @type {PIXI.MIPMAP_MODES}
   * @default PIXI.MIPMAP_MODES.POW2
   */
  MIPMAP_TEXTURES: Qt.POW2,
  /**
   * Default anisotropic filtering level of textures.
   * Usually from 0 to 16
   * @static
   * @name ANISOTROPIC_LEVEL
   * @memberof PIXI.settings
   * @type {number}
   * @default 0
   */
  ANISOTROPIC_LEVEL: 0,
  /**
   * Default resolution / device pixel ratio of the renderer.
   * @static
   * @name RESOLUTION
   * @memberof PIXI.settings
   * @type {number}
   * @default 1
   */
  RESOLUTION: 1,
  /**
   * Default filter resolution.
   * @static
   * @name FILTER_RESOLUTION
   * @memberof PIXI.settings
   * @type {number}
   * @default 1
   */
  FILTER_RESOLUTION: 1,
  /**
   * Default filter samples.
   * @static
   * @name FILTER_MULTISAMPLE
   * @memberof PIXI.settings
   * @type {PIXI.MSAA_QUALITY}
   * @default PIXI.MSAA_QUALITY.NONE
   */
  FILTER_MULTISAMPLE: gt.NONE,
  /**
   * The maximum textures that this device supports.
   * @static
   * @name SPRITE_MAX_TEXTURES
   * @memberof PIXI.settings
   * @type {number}
   * @default 32
   */
  SPRITE_MAX_TEXTURES: Ef(32),
  // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
  // TODO: maybe add PARTICLE.BATCH_SIZE: 15000
  /**
   * The default sprite batch size.
   *
   * The default aims to balance desktop and mobile devices.
   * @static
   * @name SPRITE_BATCH_SIZE
   * @memberof PIXI.settings
   * @type {number}
   * @default 4096
   */
  SPRITE_BATCH_SIZE: 4096,
  /**
   * The default render options if none are supplied to {@link PIXI.Renderer}
   * or {@link PIXI.CanvasRenderer}.
   * @static
   * @name RENDER_OPTIONS
   * @memberof PIXI.settings
   * @type {object}
   * @property {boolean} [antialias=false] - {@link PIXI.IRendererOptions.antialias}
   * @property {boolean} [autoDensity=false] - {@link PIXI.IRendererOptions.autoDensity}
   * @property {number} [backgroundAlpha=1] - {@link PIXI.IRendererOptions.backgroundAlpha}
   * @property {number} [backgroundColor=0x000000] - {@link PIXI.IRendererOptions.backgroundColor}
   * @property {boolean} [clearBeforeRender=true] - {@link PIXI.IRendererOptions.clearBeforeRender}
   * @property {number} [height=600] - {@link PIXI.IRendererOptions.height}
   * @property {boolean} [preserveDrawingBuffer=false] - {@link PIXI.IRendererOptions.preserveDrawingBuffer}
   * @property {boolean|'notMultiplied'} [useContextAlpha=true] - {@link PIXI.IRendererOptions.useContextAlpha}
   * @property {HTMLCanvasElement} [view=null] - {@link PIXI.IRendererOptions.view}
   * @property {number} [width=800] - {@link PIXI.IRendererOptions.width}
   */
  RENDER_OPTIONS: {
    view: null,
    width: 800,
    height: 600,
    autoDensity: !1,
    backgroundColor: 0,
    backgroundAlpha: 1,
    useContextAlpha: !0,
    clearBeforeRender: !0,
    antialias: !1,
    preserveDrawingBuffer: !1
  },
  /**
   * Default Garbage Collection mode.
   * @static
   * @name GC_MODE
   * @memberof PIXI.settings
   * @type {PIXI.GC_MODES}
   * @default PIXI.GC_MODES.AUTO
   */
  GC_MODE: Tn.AUTO,
  /**
   * Default Garbage Collection max idle.
   * @static
   * @name GC_MAX_IDLE
   * @memberof PIXI.settings
   * @type {number}
   * @default 3600
   */
  GC_MAX_IDLE: 60 * 60,
  /**
   * Default Garbage Collection maximum check count.
   * @static
   * @name GC_MAX_CHECK_COUNT
   * @memberof PIXI.settings
   * @type {number}
   * @default 600
   */
  GC_MAX_CHECK_COUNT: 60 * 10,
  /**
   * Default wrap modes that are supported by pixi.
   * @static
   * @name WRAP_MODE
   * @memberof PIXI.settings
   * @type {PIXI.WRAP_MODES}
   * @default PIXI.WRAP_MODES.CLAMP
   */
  WRAP_MODE: he.CLAMP,
  /**
   * Default scale mode for textures.
   * @static
   * @name SCALE_MODE
   * @memberof PIXI.settings
   * @type {PIXI.SCALE_MODES}
   * @default PIXI.SCALE_MODES.LINEAR
   */
  SCALE_MODE: se.LINEAR,
  /**
   * Default specify float precision in vertex shader.
   * @static
   * @name PRECISION_VERTEX
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @default PIXI.PRECISION.HIGH
   */
  PRECISION_VERTEX: Xt.HIGH,
  /**
   * Default specify float precision in fragment shader.
   * iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
   * @static
   * @name PRECISION_FRAGMENT
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @default PIXI.PRECISION.MEDIUM
   */
  PRECISION_FRAGMENT: ae.apple.device ? Xt.HIGH : Xt.MEDIUM,
  /**
   * Can we upload the same buffer in a single frame?
   * @static
   * @name CAN_UPLOAD_SAME_BUFFER
   * @memberof PIXI.settings
   * @type {boolean}
   */
  CAN_UPLOAD_SAME_BUFFER: Tf(),
  /**
   * Enables bitmap creation before image load. This feature is experimental.
   * @static
   * @name CREATE_IMAGE_BITMAP
   * @memberof PIXI.settings
   * @type {boolean}
   * @default false
   */
  CREATE_IMAGE_BITMAP: !1,
  /**
   * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
   * Advantages can include sharper image quality (like text) and faster rendering on canvas.
   * The main disadvantage is movement of objects may appear less smooth.
   * @static
   * @constant
   * @memberof PIXI.settings
   * @type {boolean}
   * @default false
   */
  ROUND_PIXELS: !1
}, Ju = { exports: {} };
(function(r) {
  var e = Object.prototype.hasOwnProperty, t = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (t = !1));
  function n(h, u, l) {
    this.fn = h, this.context = u, this.once = l || !1;
  }
  function o(h, u, l, c, d) {
    if (typeof l != "function")
      throw new TypeError("The listener must be a function");
    var f = new n(l, c || h, d), p = t ? t + u : u;
    return h._events[p] ? h._events[p].fn ? h._events[p] = [h._events[p], f] : h._events[p].push(f) : (h._events[p] = f, h._eventsCount++), h;
  }
  function s(h, u) {
    --h._eventsCount === 0 ? h._events = new i() : delete h._events[u];
  }
  function a() {
    this._events = new i(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var h = [], u, l;
    if (this._eventsCount === 0)
      return h;
    for (l in u = this._events)
      e.call(u, l) && h.push(t ? l.slice(1) : l);
    return Object.getOwnPropertySymbols ? h.concat(Object.getOwnPropertySymbols(u)) : h;
  }, a.prototype.listeners = function(h) {
    var u = t ? t + h : h, l = this._events[u];
    if (!l)
      return [];
    if (l.fn)
      return [l.fn];
    for (var c = 0, d = l.length, f = new Array(d); c < d; c++)
      f[c] = l[c].fn;
    return f;
  }, a.prototype.listenerCount = function(h) {
    var u = t ? t + h : h, l = this._events[u];
    return l ? l.fn ? 1 : l.length : 0;
  }, a.prototype.emit = function(h, u, l, c, d, f) {
    var p = t ? t + h : h;
    if (!this._events[p])
      return !1;
    var m = this._events[p], y = arguments.length, _, g;
    if (m.fn) {
      switch (m.once && this.removeListener(h, m.fn, void 0, !0), y) {
        case 1:
          return m.fn.call(m.context), !0;
        case 2:
          return m.fn.call(m.context, u), !0;
        case 3:
          return m.fn.call(m.context, u, l), !0;
        case 4:
          return m.fn.call(m.context, u, l, c), !0;
        case 5:
          return m.fn.call(m.context, u, l, c, d), !0;
        case 6:
          return m.fn.call(m.context, u, l, c, d, f), !0;
      }
      for (g = 1, _ = new Array(y - 1); g < y; g++)
        _[g - 1] = arguments[g];
      m.fn.apply(m.context, _);
    } else {
      var v = m.length, b;
      for (g = 0; g < v; g++)
        switch (m[g].once && this.removeListener(h, m[g].fn, void 0, !0), y) {
          case 1:
            m[g].fn.call(m[g].context);
            break;
          case 2:
            m[g].fn.call(m[g].context, u);
            break;
          case 3:
            m[g].fn.call(m[g].context, u, l);
            break;
          case 4:
            m[g].fn.call(m[g].context, u, l, c);
            break;
          default:
            if (!_)
              for (b = 1, _ = new Array(y - 1); b < y; b++)
                _[b - 1] = arguments[b];
            m[g].fn.apply(m[g].context, _);
        }
    }
    return !0;
  }, a.prototype.on = function(h, u, l) {
    return o(this, h, u, l, !1);
  }, a.prototype.once = function(h, u, l) {
    return o(this, h, u, l, !0);
  }, a.prototype.removeListener = function(h, u, l, c) {
    var d = t ? t + h : h;
    if (!this._events[d])
      return this;
    if (!u)
      return s(this, d), this;
    var f = this._events[d];
    if (f.fn)
      f.fn === u && (!c || f.once) && (!l || f.context === l) && s(this, d);
    else {
      for (var p = 0, m = [], y = f.length; p < y; p++)
        (f[p].fn !== u || c && !f[p].once || l && f[p].context !== l) && m.push(f[p]);
      m.length ? this._events[d] = m.length === 1 ? m[0] : m : s(this, d);
    }
    return this;
  }, a.prototype.removeAllListeners = function(h) {
    var u;
    return h ? (u = t ? t + h : h, this._events[u] && s(this, u)) : (this._events = new i(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = t, a.EventEmitter = a, r.exports = a;
})(Ju);
var Af = Ju.exports;
const Si = /* @__PURE__ */ Qs(Af);
var ta = { exports: {} };
ta.exports = Un;
ta.exports.default = Un;
function Un(r, e, t) {
  t = t || 2;
  var i = e && e.length, n = i ? e[0] * t : r.length, o = Qu(r, 0, n, t, !0), s = [];
  if (!o || o.next === o.prev)
    return s;
  var a, h, u, l, c, d, f;
  if (i && (o = Pf(r, e, o, t)), r.length > 80 * t) {
    a = u = r[0], h = l = r[1];
    for (var p = t; p < n; p += t)
      c = r[p], d = r[p + 1], c < a && (a = c), d < h && (h = d), c > u && (u = c), d > l && (l = d);
    f = Math.max(u - a, l - h), f = f !== 0 ? 32767 / f : 0;
  }
  return fi(o, s, t, a, h, f, 0), s;
}
function Qu(r, e, t, i, n) {
  var o, s;
  if (n === Zo(r, e, t, i) > 0)
    for (o = e; o < t; o += i)
      s = Qa(o, r[o], r[o + 1], s);
  else
    for (o = t - i; o >= e; o -= i)
      s = Qa(o, r[o], r[o + 1], s);
  return s && kn(s, s.next) && (mi(s), s = s.next), s;
}
function or(r, e) {
  if (!r)
    return r;
  e || (e = r);
  var t = r, i;
  do
    if (i = !1, !t.steiner && (kn(t, t.next) || xt(t.prev, t, t.next) === 0)) {
      if (mi(t), t = e = t.prev, t === t.next)
        break;
      i = !0;
    } else
      t = t.next;
  while (i || t !== e);
  return e;
}
function fi(r, e, t, i, n, o, s) {
  if (r) {
    !s && o && Nf(r, i, n, o);
    for (var a = r, h, u; r.prev !== r.next; ) {
      if (h = r.prev, u = r.next, o ? wf(r, i, n, o) : Sf(r)) {
        e.push(h.i / t | 0), e.push(r.i / t | 0), e.push(u.i / t | 0), mi(r), r = u.next, a = u.next;
        continue;
      }
      if (r = u, r === a) {
        s ? s === 1 ? (r = Of(or(r), e, t), fi(r, e, t, i, n, o, 2)) : s === 2 && Rf(r, e, t, i, n, o) : fi(or(r), e, t, i, n, o, 1);
        break;
      }
    }
  }
}
function Sf(r) {
  var e = r.prev, t = r, i = r.next;
  if (xt(e, t, i) >= 0)
    return !1;
  for (var n = e.x, o = t.x, s = i.x, a = e.y, h = t.y, u = i.y, l = n < o ? n < s ? n : s : o < s ? o : s, c = a < h ? a < u ? a : u : h < u ? h : u, d = n > o ? n > s ? n : s : o > s ? o : s, f = a > h ? a > u ? a : u : h > u ? h : u, p = i.next; p !== e; ) {
    if (p.x >= l && p.x <= d && p.y >= c && p.y <= f && wr(n, a, o, h, s, u, p.x, p.y) && xt(p.prev, p, p.next) >= 0)
      return !1;
    p = p.next;
  }
  return !0;
}
function wf(r, e, t, i) {
  var n = r.prev, o = r, s = r.next;
  if (xt(n, o, s) >= 0)
    return !1;
  for (var a = n.x, h = o.x, u = s.x, l = n.y, c = o.y, d = s.y, f = a < h ? a < u ? a : u : h < u ? h : u, p = l < c ? l < d ? l : d : c < d ? c : d, m = a > h ? a > u ? a : u : h > u ? h : u, y = l > c ? l > d ? l : d : c > d ? c : d, _ = qo(f, p, e, t, i), g = qo(m, y, e, t, i), v = r.prevZ, b = r.nextZ; v && v.z >= _ && b && b.z <= g; ) {
    if (v.x >= f && v.x <= m && v.y >= p && v.y <= y && v !== n && v !== s && wr(a, l, h, c, u, d, v.x, v.y) && xt(v.prev, v, v.next) >= 0 || (v = v.prevZ, b.x >= f && b.x <= m && b.y >= p && b.y <= y && b !== n && b !== s && wr(a, l, h, c, u, d, b.x, b.y) && xt(b.prev, b, b.next) >= 0))
      return !1;
    b = b.nextZ;
  }
  for (; v && v.z >= _; ) {
    if (v.x >= f && v.x <= m && v.y >= p && v.y <= y && v !== n && v !== s && wr(a, l, h, c, u, d, v.x, v.y) && xt(v.prev, v, v.next) >= 0)
      return !1;
    v = v.prevZ;
  }
  for (; b && b.z <= g; ) {
    if (b.x >= f && b.x <= m && b.y >= p && b.y <= y && b !== n && b !== s && wr(a, l, h, c, u, d, b.x, b.y) && xt(b.prev, b, b.next) >= 0)
      return !1;
    b = b.nextZ;
  }
  return !0;
}
function Of(r, e, t) {
  var i = r;
  do {
    var n = i.prev, o = i.next.next;
    !kn(n, o) && tl(n, i, i.next, o) && pi(n, o) && pi(o, n) && (e.push(n.i / t | 0), e.push(i.i / t | 0), e.push(o.i / t | 0), mi(i), mi(i.next), i = r = o), i = i.next;
  } while (i !== r);
  return or(i);
}
function Rf(r, e, t, i, n, o) {
  var s = r;
  do {
    for (var a = s.next.next; a !== s.prev; ) {
      if (s.i !== a.i && Bf(s, a)) {
        var h = el(s, a);
        s = or(s, s.next), h = or(h, h.next), fi(s, e, t, i, n, o, 0), fi(h, e, t, i, n, o, 0);
        return;
      }
      a = a.next;
    }
    s = s.next;
  } while (s !== r);
}
function Pf(r, e, t, i) {
  var n = [], o, s, a, h, u;
  for (o = 0, s = e.length; o < s; o++)
    a = e[o] * i, h = o < s - 1 ? e[o + 1] * i : r.length, u = Qu(r, a, h, i, !1), u === u.next && (u.steiner = !0), n.push(Lf(u));
  for (n.sort(Mf), o = 0; o < n.length; o++)
    t = If(n[o], t);
  return t;
}
function Mf(r, e) {
  return r.x - e.x;
}
function If(r, e) {
  var t = Df(r, e);
  if (!t)
    return e;
  var i = el(t, r);
  return or(i, i.next), or(t, t.next);
}
function Df(r, e) {
  var t = e, i = r.x, n = r.y, o = -1 / 0, s;
  do {
    if (n <= t.y && n >= t.next.y && t.next.y !== t.y) {
      var a = t.x + (n - t.y) * (t.next.x - t.x) / (t.next.y - t.y);
      if (a <= i && a > o && (o = a, s = t.x < t.next.x ? t : t.next, a === i))
        return s;
    }
    t = t.next;
  } while (t !== e);
  if (!s)
    return null;
  var h = s, u = s.x, l = s.y, c = 1 / 0, d;
  t = s;
  do
    i >= t.x && t.x >= u && i !== t.x && wr(n < l ? i : o, n, u, l, n < l ? o : i, n, t.x, t.y) && (d = Math.abs(n - t.y) / (i - t.x), pi(t, r) && (d < c || d === c && (t.x > s.x || t.x === s.x && Cf(s, t))) && (s = t, c = d)), t = t.next;
  while (t !== h);
  return s;
}
function Cf(r, e) {
  return xt(r.prev, r, e.prev) < 0 && xt(e.next, r, r.next) < 0;
}
function Nf(r, e, t, i) {
  var n = r;
  do
    n.z === 0 && (n.z = qo(n.x, n.y, e, t, i)), n.prevZ = n.prev, n.nextZ = n.next, n = n.next;
  while (n !== r);
  n.prevZ.nextZ = null, n.prevZ = null, Ff(n);
}
function Ff(r) {
  var e, t, i, n, o, s, a, h, u = 1;
  do {
    for (t = r, r = null, o = null, s = 0; t; ) {
      for (s++, i = t, a = 0, e = 0; e < u && (a++, i = i.nextZ, !!i); e++)
        ;
      for (h = u; a > 0 || h > 0 && i; )
        a !== 0 && (h === 0 || !i || t.z <= i.z) ? (n = t, t = t.nextZ, a--) : (n = i, i = i.nextZ, h--), o ? o.nextZ = n : r = n, n.prevZ = o, o = n;
      t = i;
    }
    o.nextZ = null, u *= 2;
  } while (s > 1);
  return r;
}
function qo(r, e, t, i, n) {
  return r = (r - t) * n | 0, e = (e - i) * n | 0, r = (r | r << 8) & 16711935, r = (r | r << 4) & 252645135, r = (r | r << 2) & 858993459, r = (r | r << 1) & 1431655765, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, r | e << 1;
}
function Lf(r) {
  var e = r, t = r;
  do
    (e.x < t.x || e.x === t.x && e.y < t.y) && (t = e), e = e.next;
  while (e !== r);
  return t;
}
function wr(r, e, t, i, n, o, s, a) {
  return (n - s) * (e - a) >= (r - s) * (o - a) && (r - s) * (i - a) >= (t - s) * (e - a) && (t - s) * (o - a) >= (n - s) * (i - a);
}
function Bf(r, e) {
  return r.next.i !== e.i && r.prev.i !== e.i && !Gf(r, e) && // dones't intersect other edges
  (pi(r, e) && pi(e, r) && Uf(r, e) && // locally visible
  (xt(r.prev, r, e.prev) || xt(r, e.prev, e)) || // does not create opposite-facing sectors
  kn(r, e) && xt(r.prev, r, r.next) > 0 && xt(e.prev, e, e.next) > 0);
}
function xt(r, e, t) {
  return (e.y - r.y) * (t.x - e.x) - (e.x - r.x) * (t.y - e.y);
}
function kn(r, e) {
  return r.x === e.x && r.y === e.y;
}
function tl(r, e, t, i) {
  var n = Li(xt(r, e, t)), o = Li(xt(r, e, i)), s = Li(xt(t, i, r)), a = Li(xt(t, i, e));
  return !!(n !== o && s !== a || n === 0 && Fi(r, t, e) || o === 0 && Fi(r, i, e) || s === 0 && Fi(t, r, i) || a === 0 && Fi(t, e, i));
}
function Fi(r, e, t) {
  return e.x <= Math.max(r.x, t.x) && e.x >= Math.min(r.x, t.x) && e.y <= Math.max(r.y, t.y) && e.y >= Math.min(r.y, t.y);
}
function Li(r) {
  return r > 0 ? 1 : r < 0 ? -1 : 0;
}
function Gf(r, e) {
  var t = r;
  do {
    if (t.i !== r.i && t.next.i !== r.i && t.i !== e.i && t.next.i !== e.i && tl(t, t.next, r, e))
      return !0;
    t = t.next;
  } while (t !== r);
  return !1;
}
function pi(r, e) {
  return xt(r.prev, r, r.next) < 0 ? xt(r, e, r.next) >= 0 && xt(r, r.prev, e) >= 0 : xt(r, e, r.prev) < 0 || xt(r, r.next, e) < 0;
}
function Uf(r, e) {
  var t = r, i = !1, n = (r.x + e.x) / 2, o = (r.y + e.y) / 2;
  do
    t.y > o != t.next.y > o && t.next.y !== t.y && n < (t.next.x - t.x) * (o - t.y) / (t.next.y - t.y) + t.x && (i = !i), t = t.next;
  while (t !== r);
  return i;
}
function el(r, e) {
  var t = new Ko(r.i, r.x, r.y), i = new Ko(e.i, e.x, e.y), n = r.next, o = e.prev;
  return r.next = e, e.prev = r, t.next = n, n.prev = t, i.next = t, t.prev = i, o.next = i, i.prev = o, i;
}
function Qa(r, e, t, i) {
  var n = new Ko(r, e, t);
  return i ? (n.next = i.next, n.prev = i, i.next.prev = n, i.next = n) : (n.prev = n, n.next = n), n;
}
function mi(r) {
  r.next.prev = r.prev, r.prev.next = r.next, r.prevZ && (r.prevZ.nextZ = r.nextZ), r.nextZ && (r.nextZ.prevZ = r.prevZ);
}
function Ko(r, e, t) {
  this.i = r, this.x = e, this.y = t, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
Un.deviation = function(r, e, t, i) {
  var n = e && e.length, o = n ? e[0] * t : r.length, s = Math.abs(Zo(r, 0, o, t));
  if (n)
    for (var a = 0, h = e.length; a < h; a++) {
      var u = e[a] * t, l = a < h - 1 ? e[a + 1] * t : r.length;
      s -= Math.abs(Zo(r, u, l, t));
    }
  var c = 0;
  for (a = 0; a < i.length; a += 3) {
    var d = i[a] * t, f = i[a + 1] * t, p = i[a + 2] * t;
    c += Math.abs(
      (r[d] - r[p]) * (r[f + 1] - r[d + 1]) - (r[d] - r[f]) * (r[p + 1] - r[d + 1])
    );
  }
  return s === 0 && c === 0 ? 0 : Math.abs((c - s) / s);
};
function Zo(r, e, t, i) {
  for (var n = 0, o = e, s = t - i; o < t; o += i)
    n += (r[s] - r[o]) * (r[o + 1] + r[s + 1]), s = o;
  return n;
}
Un.flatten = function(r) {
  for (var e = r[0][0].length, t = { vertices: [], holes: [], dimensions: e }, i = 0, n = 0; n < r.length; n++) {
    for (var o = 0; o < r[n].length; o++)
      for (var s = 0; s < e; s++)
        t.vertices.push(r[n][o][s]);
    n > 0 && (i += r[n - 1].length, t.holes.push(i));
  }
  return t;
};
var kf = ta.exports;
const rl = /* @__PURE__ */ Qs(kf);
var En = { exports: {} };
/*! https://mths.be/punycode v1.4.1 by @mathias */
En.exports;
(function(r, e) {
  (function(t) {
    var i = e && !e.nodeType && e, n = r && !r.nodeType && r, o = typeof dn == "object" && dn;
    (o.global === o || o.window === o || o.self === o) && (t = o);
    var s, a = 2147483647, h = 36, u = 1, l = 26, c = 38, d = 700, f = 72, p = 128, m = "-", y = /^xn--/, _ = /[^\x20-\x7E]/, g = /[\x2E\u3002\uFF0E\uFF61]/g, v = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, b = h - u, T = Math.floor, S = String.fromCharCode, w;
    function A(L) {
      throw new RangeError(v[L]);
    }
    function x(L, I) {
      for (var j = L.length, K = []; j--; )
        K[j] = I(L[j]);
      return K;
    }
    function E(L, I) {
      var j = L.split("@"), K = "";
      j.length > 1 && (K = j[0] + "@", L = j[1]), L = L.replace(g, ".");
      var J = L.split("."), mt = x(J, I).join(".");
      return K + mt;
    }
    function O(L) {
      for (var I = [], j = 0, K = L.length, J, mt; j < K; )
        J = L.charCodeAt(j++), J >= 55296 && J <= 56319 && j < K ? (mt = L.charCodeAt(j++), (mt & 64512) == 56320 ? I.push(((J & 1023) << 10) + (mt & 1023) + 65536) : (I.push(J), j--)) : I.push(J);
      return I;
    }
    function P(L) {
      return x(L, function(I) {
        var j = "";
        return I > 65535 && (I -= 65536, j += S(I >>> 10 & 1023 | 55296), I = 56320 | I & 1023), j += S(I), j;
      }).join("");
    }
    function M(L) {
      return L - 48 < 10 ? L - 22 : L - 65 < 26 ? L - 65 : L - 97 < 26 ? L - 97 : h;
    }
    function F(L, I) {
      return L + 22 + 75 * (L < 26) - ((I != 0) << 5);
    }
    function D(L, I, j) {
      var K = 0;
      for (L = j ? T(L / d) : L >> 1, L += T(L / I); L > b * l >> 1; K += h)
        L = T(L / b);
      return T(K + (b + 1) * L / (L + c));
    }
    function C(L) {
      var I = [], j = L.length, K, J = 0, mt = p, W = f, lt, vt, At, Q, ot, at, dt, Z, U;
      for (lt = L.lastIndexOf(m), lt < 0 && (lt = 0), vt = 0; vt < lt; ++vt)
        L.charCodeAt(vt) >= 128 && A("not-basic"), I.push(L.charCodeAt(vt));
      for (At = lt > 0 ? lt + 1 : 0; At < j; ) {
        for (Q = J, ot = 1, at = h; At >= j && A("invalid-input"), dt = M(L.charCodeAt(At++)), (dt >= h || dt > T((a - J) / ot)) && A("overflow"), J += dt * ot, Z = at <= W ? u : at >= W + l ? l : at - W, !(dt < Z); at += h)
          U = h - Z, ot > T(a / U) && A("overflow"), ot *= U;
        K = I.length + 1, W = D(J - Q, K, Q == 0), T(J / K) > a - mt && A("overflow"), mt += T(J / K), J %= K, I.splice(J++, 0, mt);
      }
      return P(I);
    }
    function V(L) {
      var I, j, K, J, mt, W, lt, vt, At, Q, ot, at = [], dt, Z, U, B;
      for (L = O(L), dt = L.length, I = p, j = 0, mt = f, W = 0; W < dt; ++W)
        ot = L[W], ot < 128 && at.push(S(ot));
      for (K = J = at.length, J && at.push(m); K < dt; ) {
        for (lt = a, W = 0; W < dt; ++W)
          ot = L[W], ot >= I && ot < lt && (lt = ot);
        for (Z = K + 1, lt - I > T((a - j) / Z) && A("overflow"), j += (lt - I) * Z, I = lt, W = 0; W < dt; ++W)
          if (ot = L[W], ot < I && ++j > a && A("overflow"), ot == I) {
            for (vt = j, At = h; Q = At <= mt ? u : At >= mt + l ? l : At - mt, !(vt < Q); At += h)
              B = vt - Q, U = h - Q, at.push(
                S(F(Q + B % U, 0))
              ), vt = T(B / U);
            at.push(S(F(vt, 0))), mt = D(j, Z, K == J), j = 0, ++K;
          }
        ++j, ++I;
      }
      return at.join("");
    }
    function st(L) {
      return E(L, function(I) {
        return y.test(I) ? C(I.slice(4).toLowerCase()) : I;
      });
    }
    function q(L) {
      return E(L, function(I) {
        return _.test(I) ? "xn--" + V(I) : I;
      });
    }
    if (s = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "1.4.1",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: O,
        encode: P
      },
      decode: C,
      encode: V,
      toASCII: q,
      toUnicode: st
    }, i && n)
      if (r.exports == i)
        n.exports = s;
      else
        for (w in s)
          s.hasOwnProperty(w) && (i[w] = s[w]);
    else
      t.punycode = s;
  })(dn);
})(En, En.exports);
var Xf = En.exports, jf = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var r = {}, e = Symbol("test"), t = Object(e);
  if (typeof e == "string" || Object.prototype.toString.call(e) !== "[object Symbol]" || Object.prototype.toString.call(t) !== "[object Symbol]")
    return !1;
  var i = 42;
  r[e] = i;
  for (e in r)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(r).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(r).length !== 0)
    return !1;
  var n = Object.getOwnPropertySymbols(r);
  if (n.length !== 1 || n[0] !== e || !Object.prototype.propertyIsEnumerable.call(r, e))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var o = Object.getOwnPropertyDescriptor(r, e);
    if (o.value !== i || o.enumerable !== !0)
      return !1;
  }
  return !0;
}, th = typeof Symbol < "u" && Symbol, Hf = jf, Yf = function() {
  return typeof th != "function" || typeof Symbol != "function" || typeof th("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : Hf();
}, eh = {
  foo: {}
}, Vf = Object, $f = function() {
  return { __proto__: eh }.foo === eh.foo && !({ __proto__: null } instanceof Vf);
}, zf = "Function.prototype.bind called on incompatible ", Wf = Object.prototype.toString, qf = Math.max, Kf = "[object Function]", rh = function(r, e) {
  for (var t = [], i = 0; i < r.length; i += 1)
    t[i] = r[i];
  for (var n = 0; n < e.length; n += 1)
    t[n + r.length] = e[n];
  return t;
}, Zf = function(r, e) {
  for (var t = [], i = e || 0, n = 0; i < r.length; i += 1, n += 1)
    t[n] = r[i];
  return t;
}, Jf = function(r, e) {
  for (var t = "", i = 0; i < r.length; i += 1)
    t += r[i], i + 1 < r.length && (t += e);
  return t;
}, Qf = function(r) {
  var e = this;
  if (typeof e != "function" || Wf.apply(e) !== Kf)
    throw new TypeError(zf + e);
  for (var t = Zf(arguments, 1), i, n = function() {
    if (this instanceof i) {
      var u = e.apply(
        this,
        rh(t, arguments)
      );
      return Object(u) === u ? u : this;
    }
    return e.apply(
      r,
      rh(t, arguments)
    );
  }, o = qf(0, e.length - t.length), s = [], a = 0; a < o; a++)
    s[a] = "$" + a;
  if (i = Function("binder", "return function (" + Jf(s, ",") + "){ return binder.apply(this,arguments); }")(n), e.prototype) {
    var h = function() {
    };
    h.prototype = e.prototype, i.prototype = new h(), h.prototype = null;
  }
  return i;
}, tp = Qf, ea = Function.prototype.bind || tp, ep = Function.prototype.call, rp = Object.prototype.hasOwnProperty, ip = ea, np = ip.call(ep, rp), tt, Br = SyntaxError, il = Function, Cr = TypeError, io = function(r) {
  try {
    return il('"use strict"; return (' + r + ").constructor;")();
  } catch {
  }
}, er = Object.getOwnPropertyDescriptor;
if (er)
  try {
    er({}, "");
  } catch {
    er = null;
  }
var no = function() {
  throw new Cr();
}, op = er ? function() {
  try {
    return arguments.callee, no;
  } catch {
    try {
      return er(arguments, "callee").get;
    } catch {
      return no;
    }
  }
}() : no, gr = Yf(), sp = $f(), It = Object.getPrototypeOf || (sp ? function(r) {
  return r.__proto__;
} : null), Sr = {}, ap = typeof Uint8Array > "u" || !It ? tt : It(Uint8Array), rr = {
  "%AggregateError%": typeof AggregateError > "u" ? tt : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? tt : ArrayBuffer,
  "%ArrayIteratorPrototype%": gr && It ? It([][Symbol.iterator]()) : tt,
  "%AsyncFromSyncIteratorPrototype%": tt,
  "%AsyncFunction%": Sr,
  "%AsyncGenerator%": Sr,
  "%AsyncGeneratorFunction%": Sr,
  "%AsyncIteratorPrototype%": Sr,
  "%Atomics%": typeof Atomics > "u" ? tt : Atomics,
  "%BigInt%": typeof BigInt > "u" ? tt : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? tt : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? tt : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? tt : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array > "u" ? tt : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? tt : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? tt : FinalizationRegistry,
  "%Function%": il,
  "%GeneratorFunction%": Sr,
  "%Int8Array%": typeof Int8Array > "u" ? tt : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? tt : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? tt : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": gr && It ? It(It([][Symbol.iterator]())) : tt,
  "%JSON%": typeof JSON == "object" ? JSON : tt,
  "%Map%": typeof Map > "u" ? tt : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !gr || !It ? tt : It((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? tt : Promise,
  "%Proxy%": typeof Proxy > "u" ? tt : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect > "u" ? tt : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? tt : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !gr || !It ? tt : It((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? tt : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": gr && It ? It(""[Symbol.iterator]()) : tt,
  "%Symbol%": gr ? Symbol : tt,
  "%SyntaxError%": Br,
  "%ThrowTypeError%": op,
  "%TypedArray%": ap,
  "%TypeError%": Cr,
  "%Uint8Array%": typeof Uint8Array > "u" ? tt : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? tt : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? tt : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? tt : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? tt : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? tt : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? tt : WeakSet
};
if (It)
  try {
    null.error;
  } catch (r) {
    var hp = It(It(r));
    rr["%Error.prototype%"] = hp;
  }
var up = function r(e) {
  var t;
  if (e === "%AsyncFunction%")
    t = io("async function () {}");
  else if (e === "%GeneratorFunction%")
    t = io("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    t = io("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var i = r("%AsyncGeneratorFunction%");
    i && (t = i.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var n = r("%AsyncGenerator%");
    n && It && (t = It(n.prototype));
  }
  return rr[e] = t, t;
}, ih = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, wi = ea, An = np, lp = wi.call(Function.call, Array.prototype.concat), cp = wi.call(Function.apply, Array.prototype.splice), nh = wi.call(Function.call, String.prototype.replace), Sn = wi.call(Function.call, String.prototype.slice), dp = wi.call(Function.call, RegExp.prototype.exec), fp = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, pp = /\\(\\)?/g, mp = function(r) {
  var e = Sn(r, 0, 1), t = Sn(r, -1);
  if (e === "%" && t !== "%")
    throw new Br("invalid intrinsic syntax, expected closing `%`");
  if (t === "%" && e !== "%")
    throw new Br("invalid intrinsic syntax, expected opening `%`");
  var i = [];
  return nh(r, fp, function(n, o, s, a) {
    i[i.length] = s ? nh(a, pp, "$1") : o || n;
  }), i;
}, yp = function(r, e) {
  var t = r, i;
  if (An(ih, t) && (i = ih[t], t = "%" + i[0] + "%"), An(rr, t)) {
    var n = rr[t];
    if (n === Sr && (n = up(t)), typeof n > "u" && !e)
      throw new Cr("intrinsic " + r + " exists, but is not available. Please file an issue!");
    return {
      alias: i,
      name: t,
      value: n
    };
  }
  throw new Br("intrinsic " + r + " does not exist!");
}, lr = function(r, e) {
  if (typeof r != "string" || r.length === 0)
    throw new Cr("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof e != "boolean")
    throw new Cr('"allowMissing" argument must be a boolean');
  if (dp(/^%?[^%]*%?$/, r) === null)
    throw new Br("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var t = mp(r), i = t.length > 0 ? t[0] : "", n = yp("%" + i + "%", e), o = n.name, s = n.value, a = !1, h = n.alias;
  h && (i = h[0], cp(t, lp([0, 1], h)));
  for (var u = 1, l = !0; u < t.length; u += 1) {
    var c = t[u], d = Sn(c, 0, 1), f = Sn(c, -1);
    if ((d === '"' || d === "'" || d === "`" || f === '"' || f === "'" || f === "`") && d !== f)
      throw new Br("property names with quotes must have matching quotes");
    if ((c === "constructor" || !l) && (a = !0), i += "." + c, o = "%" + i + "%", An(rr, o))
      s = rr[o];
    else if (s != null) {
      if (!(c in s)) {
        if (!e)
          throw new Cr("base intrinsic for " + r + " exists, but the property is not available.");
        return;
      }
      if (er && u + 1 >= t.length) {
        var p = er(s, c);
        l = !!p, l && "get" in p && !("originalValue" in p.get) ? s = p.get : s = s[c];
      } else
        l = An(s, c), s = s[c];
      l && !a && (rr[o] = s);
    }
  }
  return s;
}, nl = { exports: {} }, _p = lr, Jo = _p("%Object.defineProperty%", !0), Qo = function() {
  if (Jo)
    try {
      return Jo({}, "a", { value: 1 }), !0;
    } catch {
      return !1;
    }
  return !1;
};
Qo.hasArrayLengthDefineBug = function() {
  if (!Qo())
    return null;
  try {
    return Jo([], "length", { value: 1 }).length !== 1;
  } catch {
    return !0;
  }
};
var ol = Qo, gp = lr, fn = gp("%Object.getOwnPropertyDescriptor%", !0);
if (fn)
  try {
    fn([], "length");
  } catch {
    fn = null;
  }
var sl = fn, vp = ol(), ra = lr, ni = vp && ra("%Object.defineProperty%", !0);
if (ni)
  try {
    ni({}, "a", { value: 1 });
  } catch {
    ni = !1;
  }
var bp = ra("%SyntaxError%"), vr = ra("%TypeError%"), oh = sl, xp = function(r, e, t) {
  if (!r || typeof r != "object" && typeof r != "function")
    throw new vr("`obj` must be an object or a function`");
  if (typeof e != "string" && typeof e != "symbol")
    throw new vr("`property` must be a string or a symbol`");
  if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
    throw new vr("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
    throw new vr("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
    throw new vr("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && typeof arguments[6] != "boolean")
    throw new vr("`loose`, if provided, must be a boolean");
  var i = arguments.length > 3 ? arguments[3] : null, n = arguments.length > 4 ? arguments[4] : null, o = arguments.length > 5 ? arguments[5] : null, s = arguments.length > 6 ? arguments[6] : !1, a = !!oh && oh(r, e);
  if (ni)
    ni(r, e, {
      configurable: o === null && a ? a.configurable : !o,
      enumerable: i === null && a ? a.enumerable : !i,
      value: t,
      writable: n === null && a ? a.writable : !n
    });
  else if (s || !i && !n && !o)
    r[e] = t;
  else
    throw new bp("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}, al = lr, sh = xp, Tp = ol(), ah = sl, hh = al("%TypeError%"), Ep = al("%Math.floor%"), Ap = function(r, e) {
  if (typeof r != "function")
    throw new hh("`fn` is not a function");
  if (typeof e != "number" || e < 0 || e > 4294967295 || Ep(e) !== e)
    throw new hh("`length` must be a positive 32-bit integer");
  var t = arguments.length > 2 && !!arguments[2], i = !0, n = !0;
  if ("length" in r && ah) {
    var o = ah(r, "length");
    o && !o.configurable && (i = !1), o && !o.writable && (n = !1);
  }
  return (i || n || !t) && (Tp ? sh(r, "length", e, !0, !0) : sh(r, "length", e)), r;
};
(function(r) {
  var e = ea, t = lr, i = Ap, n = t("%TypeError%"), o = t("%Function.prototype.apply%"), s = t("%Function.prototype.call%"), a = t("%Reflect.apply%", !0) || e.call(s, o), h = t("%Object.defineProperty%", !0), u = t("%Math.max%");
  if (h)
    try {
      h({}, "a", { value: 1 });
    } catch {
      h = null;
    }
  r.exports = function(c) {
    if (typeof c != "function")
      throw new n("a function is required");
    var d = a(e, s, arguments);
    return i(
      d,
      1 + u(0, c.length - (arguments.length - 1)),
      !0
    );
  };
  var l = function() {
    return a(e, o, arguments);
  };
  h ? h(r.exports, "apply", { value: l }) : r.exports.apply = l;
})(nl);
var Sp = nl.exports, hl = lr, ul = Sp, wp = ul(hl("String.prototype.indexOf")), Op = function(r, e) {
  var t = hl(r, !!e);
  return typeof t == "function" && wp(r, ".prototype.") > -1 ? ul(t) : t;
};
const Rp = {}, Pp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rp
}, Symbol.toStringTag, { value: "Module" })), Mp = /* @__PURE__ */ lf(Pp);
var ia = typeof Map == "function" && Map.prototype, oo = Object.getOwnPropertyDescriptor && ia ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, wn = ia && oo && typeof oo.get == "function" ? oo.get : null, uh = ia && Map.prototype.forEach, na = typeof Set == "function" && Set.prototype, so = Object.getOwnPropertyDescriptor && na ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, On = na && so && typeof so.get == "function" ? so.get : null, lh = na && Set.prototype.forEach, Ip = typeof WeakMap == "function" && WeakMap.prototype, oi = Ip ? WeakMap.prototype.has : null, Dp = typeof WeakSet == "function" && WeakSet.prototype, si = Dp ? WeakSet.prototype.has : null, Cp = typeof WeakRef == "function" && WeakRef.prototype, ch = Cp ? WeakRef.prototype.deref : null, Np = Boolean.prototype.valueOf, Fp = Object.prototype.toString, Lp = Function.prototype.toString, Bp = String.prototype.match, oa = String.prototype.slice, Ie = String.prototype.replace, Gp = String.prototype.toUpperCase, dh = String.prototype.toLowerCase, ll = RegExp.prototype.test, fh = Array.prototype.concat, oe = Array.prototype.join, Up = Array.prototype.slice, ph = Math.floor, ts = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, ao = Object.getOwnPropertySymbols, es = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, Gr = typeof Symbol == "function" && typeof Symbol.iterator == "object", Bt = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === Gr || !0) ? Symbol.toStringTag : null, cl = Object.prototype.propertyIsEnumerable, mh = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function yh(r, e) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || ll.call(/e/, e))
    return e;
  var t = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var i = r < 0 ? -ph(-r) : ph(r);
    if (i !== r) {
      var n = String(i), o = oa.call(e, n.length + 1);
      return Ie.call(n, t, "$&_") + "." + Ie.call(Ie.call(o, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return Ie.call(e, t, "$&_");
}
var rs = Mp, _h = rs.custom, gh = fl(_h) ? _h : null, kp = function r(e, t, i, n) {
  var o = t || {};
  if (Re(o, "quoteStyle") && o.quoteStyle !== "single" && o.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (Re(o, "maxStringLength") && (typeof o.maxStringLength == "number" ? o.maxStringLength < 0 && o.maxStringLength !== 1 / 0 : o.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var s = Re(o, "customInspect") ? o.customInspect : !0;
  if (typeof s != "boolean" && s !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (Re(o, "indent") && o.indent !== null && o.indent !== "	" && !(parseInt(o.indent, 10) === o.indent && o.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (Re(o, "numericSeparator") && typeof o.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var a = o.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return ml(e, o);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var h = String(e);
    return a ? yh(e, h) : h;
  }
  if (typeof e == "bigint") {
    var u = String(e) + "n";
    return a ? yh(e, u) : u;
  }
  var l = typeof o.depth > "u" ? 5 : o.depth;
  if (typeof i > "u" && (i = 0), i >= l && l > 0 && typeof e == "object")
    return is(e) ? "[Array]" : "[Object]";
  var c = nm(o, i);
  if (typeof n > "u")
    n = [];
  else if (pl(n, e) >= 0)
    return "[Circular]";
  function d(M, F, D) {
    if (F && (n = Up.call(n), n.push(F)), D) {
      var C = {
        depth: o.depth
      };
      return Re(o, "quoteStyle") && (C.quoteStyle = o.quoteStyle), r(M, C, i + 1, n);
    }
    return r(M, o, i + 1, n);
  }
  if (typeof e == "function" && !vh(e)) {
    var f = qp(e), p = Bi(e, d);
    return "[Function" + (f ? ": " + f : " (anonymous)") + "]" + (p.length > 0 ? " { " + oe.call(p, ", ") + " }" : "");
  }
  if (fl(e)) {
    var m = Gr ? Ie.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : es.call(e);
    return typeof e == "object" && !Gr ? $r(m) : m;
  }
  if (em(e)) {
    for (var y = "<" + dh.call(String(e.nodeName)), _ = e.attributes || [], g = 0; g < _.length; g++)
      y += " " + _[g].name + "=" + dl(Xp(_[g].value), "double", o);
    return y += ">", e.childNodes && e.childNodes.length && (y += "..."), y += "</" + dh.call(String(e.nodeName)) + ">", y;
  }
  if (is(e)) {
    if (e.length === 0)
      return "[]";
    var v = Bi(e, d);
    return c && !im(v) ? "[" + ns(v, c) + "]" : "[ " + oe.call(v, ", ") + " ]";
  }
  if (Hp(e)) {
    var b = Bi(e, d);
    return !("cause" in Error.prototype) && "cause" in e && !cl.call(e, "cause") ? "{ [" + String(e) + "] " + oe.call(fh.call("[cause]: " + d(e.cause), b), ", ") + " }" : b.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + oe.call(b, ", ") + " }";
  }
  if (typeof e == "object" && s) {
    if (gh && typeof e[gh] == "function" && rs)
      return rs(e, { depth: l - i });
    if (s !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (Kp(e)) {
    var T = [];
    return uh && uh.call(e, function(M, F) {
      T.push(d(F, e, !0) + " => " + d(M, e));
    }), bh("Map", wn.call(e), T, c);
  }
  if (Qp(e)) {
    var S = [];
    return lh && lh.call(e, function(M) {
      S.push(d(M, e));
    }), bh("Set", On.call(e), S, c);
  }
  if (Zp(e))
    return ho("WeakMap");
  if (tm(e))
    return ho("WeakSet");
  if (Jp(e))
    return ho("WeakRef");
  if (Vp(e))
    return $r(d(Number(e)));
  if (zp(e))
    return $r(d(ts.call(e)));
  if ($p(e))
    return $r(Np.call(e));
  if (Yp(e))
    return $r(d(String(e)));
  if (typeof window < "u" && e === window)
    return "{ [object Window] }";
  if (e === dn)
    return "{ [object globalThis] }";
  if (!jp(e) && !vh(e)) {
    var w = Bi(e, d), A = mh ? mh(e) === Object.prototype : e instanceof Object || e.constructor === Object, x = e instanceof Object ? "" : "null prototype", E = !A && Bt && Object(e) === e && Bt in e ? oa.call(Ue(e), 8, -1) : x ? "Object" : "", O = A || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", P = O + (E || x ? "[" + oe.call(fh.call([], E || [], x || []), ": ") + "] " : "");
    return w.length === 0 ? P + "{}" : c ? P + "{" + ns(w, c) + "}" : P + "{ " + oe.call(w, ", ") + " }";
  }
  return String(e);
};
function dl(r, e, t) {
  var i = (t.quoteStyle || e) === "double" ? '"' : "'";
  return i + r + i;
}
function Xp(r) {
  return Ie.call(String(r), /"/g, "&quot;");
}
function is(r) {
  return Ue(r) === "[object Array]" && (!Bt || !(typeof r == "object" && Bt in r));
}
function jp(r) {
  return Ue(r) === "[object Date]" && (!Bt || !(typeof r == "object" && Bt in r));
}
function vh(r) {
  return Ue(r) === "[object RegExp]" && (!Bt || !(typeof r == "object" && Bt in r));
}
function Hp(r) {
  return Ue(r) === "[object Error]" && (!Bt || !(typeof r == "object" && Bt in r));
}
function Yp(r) {
  return Ue(r) === "[object String]" && (!Bt || !(typeof r == "object" && Bt in r));
}
function Vp(r) {
  return Ue(r) === "[object Number]" && (!Bt || !(typeof r == "object" && Bt in r));
}
function $p(r) {
  return Ue(r) === "[object Boolean]" && (!Bt || !(typeof r == "object" && Bt in r));
}
function fl(r) {
  if (Gr)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !es)
    return !1;
  try {
    return es.call(r), !0;
  } catch {
  }
  return !1;
}
function zp(r) {
  if (!r || typeof r != "object" || !ts)
    return !1;
  try {
    return ts.call(r), !0;
  } catch {
  }
  return !1;
}
var Wp = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function Re(r, e) {
  return Wp.call(r, e);
}
function Ue(r) {
  return Fp.call(r);
}
function qp(r) {
  if (r.name)
    return r.name;
  var e = Bp.call(Lp.call(r), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function pl(r, e) {
  if (r.indexOf)
    return r.indexOf(e);
  for (var t = 0, i = r.length; t < i; t++)
    if (r[t] === e)
      return t;
  return -1;
}
function Kp(r) {
  if (!wn || !r || typeof r != "object")
    return !1;
  try {
    wn.call(r);
    try {
      On.call(r);
    } catch {
      return !0;
    }
    return r instanceof Map;
  } catch {
  }
  return !1;
}
function Zp(r) {
  if (!oi || !r || typeof r != "object")
    return !1;
  try {
    oi.call(r, oi);
    try {
      si.call(r, si);
    } catch {
      return !0;
    }
    return r instanceof WeakMap;
  } catch {
  }
  return !1;
}
function Jp(r) {
  if (!ch || !r || typeof r != "object")
    return !1;
  try {
    return ch.call(r), !0;
  } catch {
  }
  return !1;
}
function Qp(r) {
  if (!On || !r || typeof r != "object")
    return !1;
  try {
    On.call(r);
    try {
      wn.call(r);
    } catch {
      return !0;
    }
    return r instanceof Set;
  } catch {
  }
  return !1;
}
function tm(r) {
  if (!si || !r || typeof r != "object")
    return !1;
  try {
    si.call(r, si);
    try {
      oi.call(r, oi);
    } catch {
      return !0;
    }
    return r instanceof WeakSet;
  } catch {
  }
  return !1;
}
function em(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function ml(r, e) {
  if (r.length > e.maxStringLength) {
    var t = r.length - e.maxStringLength, i = "... " + t + " more character" + (t > 1 ? "s" : "");
    return ml(oa.call(r, 0, e.maxStringLength), e) + i;
  }
  var n = Ie.call(Ie.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, rm);
  return dl(n, "single", e);
}
function rm(r) {
  var e = r.charCodeAt(0), t = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return t ? "\\" + t : "\\x" + (e < 16 ? "0" : "") + Gp.call(e.toString(16));
}
function $r(r) {
  return "Object(" + r + ")";
}
function ho(r) {
  return r + " { ? }";
}
function bh(r, e, t, i) {
  var n = i ? ns(t, i) : oe.call(t, ", ");
  return r + " (" + e + ") {" + n + "}";
}
function im(r) {
  for (var e = 0; e < r.length; e++)
    if (pl(r[e], `
`) >= 0)
      return !1;
  return !0;
}
function nm(r, e) {
  var t;
  if (r.indent === "	")
    t = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    t = oe.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: t,
    prev: oe.call(Array(e + 1), t)
  };
}
function ns(r, e) {
  if (r.length === 0)
    return "";
  var t = `
` + e.prev + e.base;
  return t + oe.call(r, "," + t) + `
` + e.prev;
}
function Bi(r, e) {
  var t = is(r), i = [];
  if (t) {
    i.length = r.length;
    for (var n = 0; n < r.length; n++)
      i[n] = Re(r, n) ? e(r[n], r) : "";
  }
  var o = typeof ao == "function" ? ao(r) : [], s;
  if (Gr) {
    s = {};
    for (var a = 0; a < o.length; a++)
      s["$" + o[a]] = o[a];
  }
  for (var h in r)
    Re(r, h) && (t && String(Number(h)) === h && h < r.length || Gr && s["$" + h] instanceof Symbol || (ll.call(/[^\w$]/, h) ? i.push(e(h, r) + ": " + e(r[h], r)) : i.push(h + ": " + e(r[h], r))));
  if (typeof ao == "function")
    for (var u = 0; u < o.length; u++)
      cl.call(r, o[u]) && i.push("[" + e(o[u]) + "]: " + e(r[o[u]], r));
  return i;
}
var sa = lr, Hr = Op, om = kp, sm = sa("%TypeError%"), Gi = sa("%WeakMap%", !0), Ui = sa("%Map%", !0), am = Hr("WeakMap.prototype.get", !0), hm = Hr("WeakMap.prototype.set", !0), um = Hr("WeakMap.prototype.has", !0), lm = Hr("Map.prototype.get", !0), cm = Hr("Map.prototype.set", !0), dm = Hr("Map.prototype.has", !0), aa = function(r, e) {
  for (var t = r, i; (i = t.next) !== null; t = i)
    if (i.key === e)
      return t.next = i.next, i.next = r.next, r.next = i, i;
}, fm = function(r, e) {
  var t = aa(r, e);
  return t && t.value;
}, pm = function(r, e, t) {
  var i = aa(r, e);
  i ? i.value = t : r.next = {
    // eslint-disable-line no-param-reassign
    key: e,
    next: r.next,
    value: t
  };
}, mm = function(r, e) {
  return !!aa(r, e);
}, ym = function() {
  var r, e, t, i = {
    assert: function(n) {
      if (!i.has(n))
        throw new sm("Side channel does not contain " + om(n));
    },
    get: function(n) {
      if (Gi && n && (typeof n == "object" || typeof n == "function")) {
        if (r)
          return am(r, n);
      } else if (Ui) {
        if (e)
          return lm(e, n);
      } else if (t)
        return fm(t, n);
    },
    has: function(n) {
      if (Gi && n && (typeof n == "object" || typeof n == "function")) {
        if (r)
          return um(r, n);
      } else if (Ui) {
        if (e)
          return dm(e, n);
      } else if (t)
        return mm(t, n);
      return !1;
    },
    set: function(n, o) {
      Gi && n && (typeof n == "object" || typeof n == "function") ? (r || (r = new Gi()), hm(r, n, o)) : Ui ? (e || (e = new Ui()), cm(e, n, o)) : (t || (t = { key: {}, next: null }), pm(t, n, o));
    }
  };
  return i;
}, _m = String.prototype.replace, gm = /%20/g, uo = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, ha = {
  default: uo.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return _m.call(r, gm, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: uo.RFC1738,
  RFC3986: uo.RFC3986
}, vm = ha, lo = Object.prototype.hasOwnProperty, Ke = Array.isArray, ne = function() {
  for (var r = [], e = 0; e < 256; ++e)
    r.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return r;
}(), bm = function(r) {
  for (; r.length > 1; ) {
    var e = r.pop(), t = e.obj[e.prop];
    if (Ke(t)) {
      for (var i = [], n = 0; n < t.length; ++n)
        typeof t[n] < "u" && i.push(t[n]);
      e.obj[e.prop] = i;
    }
  }
}, yl = function(r, e) {
  for (var t = e && e.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, i = 0; i < r.length; ++i)
    typeof r[i] < "u" && (t[i] = r[i]);
  return t;
}, xm = function r(e, t, i) {
  if (!t)
    return e;
  if (typeof t != "object") {
    if (Ke(e))
      e.push(t);
    else if (e && typeof e == "object")
      (i && (i.plainObjects || i.allowPrototypes) || !lo.call(Object.prototype, t)) && (e[t] = !0);
    else
      return [e, t];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(t);
  var n = e;
  return Ke(e) && !Ke(t) && (n = yl(e, i)), Ke(e) && Ke(t) ? (t.forEach(function(o, s) {
    if (lo.call(e, s)) {
      var a = e[s];
      a && typeof a == "object" && o && typeof o == "object" ? e[s] = r(a, o, i) : e.push(o);
    } else
      e[s] = o;
  }), e) : Object.keys(t).reduce(function(o, s) {
    var a = t[s];
    return lo.call(o, s) ? o[s] = r(o[s], a, i) : o[s] = a, o;
  }, n);
}, Tm = function(r, e) {
  return Object.keys(e).reduce(function(t, i) {
    return t[i] = e[i], t;
  }, r);
}, Em = function(r, e, t) {
  var i = r.replace(/\+/g, " ");
  if (t === "iso-8859-1")
    return i.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(i);
  } catch {
    return i;
  }
}, Am = function(r, e, t, i, n) {
  if (r.length === 0)
    return r;
  var o = r;
  if (typeof r == "symbol" ? o = Symbol.prototype.toString.call(r) : typeof r != "string" && (o = String(r)), t === "iso-8859-1")
    return escape(o).replace(/%u[0-9a-f]{4}/gi, function(u) {
      return "%26%23" + parseInt(u.slice(2), 16) + "%3B";
    });
  for (var s = "", a = 0; a < o.length; ++a) {
    var h = o.charCodeAt(a);
    if (h === 45 || h === 46 || h === 95 || h === 126 || h >= 48 && h <= 57 || h >= 65 && h <= 90 || h >= 97 && h <= 122 || n === vm.RFC1738 && (h === 40 || h === 41)) {
      s += o.charAt(a);
      continue;
    }
    if (h < 128) {
      s = s + ne[h];
      continue;
    }
    if (h < 2048) {
      s = s + (ne[192 | h >> 6] + ne[128 | h & 63]);
      continue;
    }
    if (h < 55296 || h >= 57344) {
      s = s + (ne[224 | h >> 12] + ne[128 | h >> 6 & 63] + ne[128 | h & 63]);
      continue;
    }
    a += 1, h = 65536 + ((h & 1023) << 10 | o.charCodeAt(a) & 1023), s += ne[240 | h >> 18] + ne[128 | h >> 12 & 63] + ne[128 | h >> 6 & 63] + ne[128 | h & 63];
  }
  return s;
}, Sm = function(r) {
  for (var e = [{ obj: { o: r }, prop: "o" }], t = [], i = 0; i < e.length; ++i)
    for (var n = e[i], o = n.obj[n.prop], s = Object.keys(o), a = 0; a < s.length; ++a) {
      var h = s[a], u = o[h];
      typeof u == "object" && u !== null && t.indexOf(u) === -1 && (e.push({ obj: o, prop: h }), t.push(u));
    }
  return bm(e), r;
}, wm = function(r) {
  return Object.prototype.toString.call(r) === "[object RegExp]";
}, Om = function(r) {
  return !r || typeof r != "object" ? !1 : !!(r.constructor && r.constructor.isBuffer && r.constructor.isBuffer(r));
}, Rm = function(r, e) {
  return [].concat(r, e);
}, Pm = function(r, e) {
  if (Ke(r)) {
    for (var t = [], i = 0; i < r.length; i += 1)
      t.push(e(r[i]));
    return t;
  }
  return e(r);
}, _l = {
  arrayToObject: yl,
  assign: Tm,
  combine: Rm,
  compact: Sm,
  decode: Em,
  encode: Am,
  isBuffer: Om,
  isRegExp: wm,
  maybeMap: Pm,
  merge: xm
}, gl = ym, pn = _l, ai = ha, Mm = Object.prototype.hasOwnProperty, xh = {
  brackets: function(r) {
    return r + "[]";
  },
  comma: "comma",
  indices: function(r, e) {
    return r + "[" + e + "]";
  },
  repeat: function(r) {
    return r;
  }
}, me = Array.isArray, Im = Array.prototype.push, vl = function(r, e) {
  Im.apply(r, me(e) ? e : [e]);
}, Dm = Date.prototype.toISOString, Th = ai.default, Lt = {
  addQueryPrefix: !1,
  allowDots: !1,
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encoder: pn.encode,
  encodeValuesOnly: !1,
  format: Th,
  formatter: ai.formatters[Th],
  // deprecated
  indices: !1,
  serializeDate: function(r) {
    return Dm.call(r);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, Cm = function(r) {
  return typeof r == "string" || typeof r == "number" || typeof r == "boolean" || typeof r == "symbol" || typeof r == "bigint";
}, co = {}, Nm = function r(e, t, i, n, o, s, a, h, u, l, c, d, f, p, m, y) {
  for (var _ = e, g = y, v = 0, b = !1; (g = g.get(co)) !== void 0 && !b; ) {
    var T = g.get(e);
    if (v += 1, typeof T < "u") {
      if (T === v)
        throw new RangeError("Cyclic object value");
      b = !0;
    }
    typeof g.get(co) > "u" && (v = 0);
  }
  if (typeof h == "function" ? _ = h(t, _) : _ instanceof Date ? _ = c(_) : i === "comma" && me(_) && (_ = pn.maybeMap(_, function(C) {
    return C instanceof Date ? c(C) : C;
  })), _ === null) {
    if (o)
      return a && !p ? a(t, Lt.encoder, m, "key", d) : t;
    _ = "";
  }
  if (Cm(_) || pn.isBuffer(_)) {
    if (a) {
      var S = p ? t : a(t, Lt.encoder, m, "key", d);
      return [f(S) + "=" + f(a(_, Lt.encoder, m, "value", d))];
    }
    return [f(t) + "=" + f(String(_))];
  }
  var w = [];
  if (typeof _ > "u")
    return w;
  var A;
  if (i === "comma" && me(_))
    p && a && (_ = pn.maybeMap(_, a)), A = [{ value: _.length > 0 ? _.join(",") || null : void 0 }];
  else if (me(h))
    A = h;
  else {
    var x = Object.keys(_);
    A = u ? x.sort(u) : x;
  }
  for (var E = n && me(_) && _.length === 1 ? t + "[]" : t, O = 0; O < A.length; ++O) {
    var P = A[O], M = typeof P == "object" && typeof P.value < "u" ? P.value : _[P];
    if (!(s && M === null)) {
      var F = me(_) ? typeof i == "function" ? i(E, P) : E : E + (l ? "." + P : "[" + P + "]");
      y.set(e, v);
      var D = gl();
      D.set(co, y), vl(w, r(
        M,
        F,
        i,
        n,
        o,
        s,
        i === "comma" && p && me(_) ? null : a,
        h,
        u,
        l,
        c,
        d,
        f,
        p,
        m,
        D
      ));
    }
  }
  return w;
}, Fm = function(r) {
  if (!r)
    return Lt;
  if (r.encoder !== null && typeof r.encoder < "u" && typeof r.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var e = r.charset || Lt.charset;
  if (typeof r.charset < "u" && r.charset !== "utf-8" && r.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var t = ai.default;
  if (typeof r.format < "u") {
    if (!Mm.call(ai.formatters, r.format))
      throw new TypeError("Unknown format option provided.");
    t = r.format;
  }
  var i = ai.formatters[t], n = Lt.filter;
  return (typeof r.filter == "function" || me(r.filter)) && (n = r.filter), {
    addQueryPrefix: typeof r.addQueryPrefix == "boolean" ? r.addQueryPrefix : Lt.addQueryPrefix,
    allowDots: typeof r.allowDots > "u" ? Lt.allowDots : !!r.allowDots,
    charset: e,
    charsetSentinel: typeof r.charsetSentinel == "boolean" ? r.charsetSentinel : Lt.charsetSentinel,
    delimiter: typeof r.delimiter > "u" ? Lt.delimiter : r.delimiter,
    encode: typeof r.encode == "boolean" ? r.encode : Lt.encode,
    encoder: typeof r.encoder == "function" ? r.encoder : Lt.encoder,
    encodeValuesOnly: typeof r.encodeValuesOnly == "boolean" ? r.encodeValuesOnly : Lt.encodeValuesOnly,
    filter: n,
    format: t,
    formatter: i,
    serializeDate: typeof r.serializeDate == "function" ? r.serializeDate : Lt.serializeDate,
    skipNulls: typeof r.skipNulls == "boolean" ? r.skipNulls : Lt.skipNulls,
    sort: typeof r.sort == "function" ? r.sort : null,
    strictNullHandling: typeof r.strictNullHandling == "boolean" ? r.strictNullHandling : Lt.strictNullHandling
  };
}, Lm = function(r, e) {
  var t = r, i = Fm(e), n, o;
  typeof i.filter == "function" ? (o = i.filter, t = o("", t)) : me(i.filter) && (o = i.filter, n = o);
  var s = [];
  if (typeof t != "object" || t === null)
    return "";
  var a;
  e && e.arrayFormat in xh ? a = e.arrayFormat : e && "indices" in e ? a = e.indices ? "indices" : "repeat" : a = "indices";
  var h = xh[a];
  if (e && "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var u = h === "comma" && e && e.commaRoundTrip;
  n || (n = Object.keys(t)), i.sort && n.sort(i.sort);
  for (var l = gl(), c = 0; c < n.length; ++c) {
    var d = n[c];
    i.skipNulls && t[d] === null || vl(s, Nm(
      t[d],
      d,
      h,
      u,
      i.strictNullHandling,
      i.skipNulls,
      i.encode ? i.encoder : null,
      i.filter,
      i.sort,
      i.allowDots,
      i.serializeDate,
      i.format,
      i.formatter,
      i.encodeValuesOnly,
      i.charset,
      l
    ));
  }
  var f = s.join(i.delimiter), p = i.addQueryPrefix === !0 ? "?" : "";
  return i.charsetSentinel && (i.charset === "iso-8859-1" ? p += "utf8=%26%2310003%3B&" : p += "utf8=%E2%9C%93&"), f.length > 0 ? p + f : "";
}, Ur = _l, os = Object.prototype.hasOwnProperty, Bm = Array.isArray, Mt = {
  allowDots: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decoder: Ur.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, Gm = function(r) {
  return r.replace(/&#(\d+);/g, function(e, t) {
    return String.fromCharCode(parseInt(t, 10));
  });
}, bl = function(r, e) {
  return r && typeof r == "string" && e.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, Um = "utf8=%26%2310003%3B", km = "utf8=%E2%9C%93", Xm = function(r, e) {
  var t = { __proto__: null }, i = e.ignoreQueryPrefix ? r.replace(/^\?/, "") : r, n = e.parameterLimit === 1 / 0 ? void 0 : e.parameterLimit, o = i.split(e.delimiter, n), s = -1, a, h = e.charset;
  if (e.charsetSentinel)
    for (a = 0; a < o.length; ++a)
      o[a].indexOf("utf8=") === 0 && (o[a] === km ? h = "utf-8" : o[a] === Um && (h = "iso-8859-1"), s = a, a = o.length);
  for (a = 0; a < o.length; ++a)
    if (a !== s) {
      var u = o[a], l = u.indexOf("]="), c = l === -1 ? u.indexOf("=") : l + 1, d, f;
      c === -1 ? (d = e.decoder(u, Mt.decoder, h, "key"), f = e.strictNullHandling ? null : "") : (d = e.decoder(u.slice(0, c), Mt.decoder, h, "key"), f = Ur.maybeMap(
        bl(u.slice(c + 1), e),
        function(p) {
          return e.decoder(p, Mt.decoder, h, "value");
        }
      )), f && e.interpretNumericEntities && h === "iso-8859-1" && (f = Gm(f)), u.indexOf("[]=") > -1 && (f = Bm(f) ? [f] : f), os.call(t, d) ? t[d] = Ur.combine(t[d], f) : t[d] = f;
    }
  return t;
}, jm = function(r, e, t, i) {
  for (var n = i ? e : bl(e, t), o = r.length - 1; o >= 0; --o) {
    var s, a = r[o];
    if (a === "[]" && t.parseArrays)
      s = [].concat(n);
    else {
      s = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var h = a.charAt(0) === "[" && a.charAt(a.length - 1) === "]" ? a.slice(1, -1) : a, u = parseInt(h, 10);
      !t.parseArrays && h === "" ? s = { 0: n } : !isNaN(u) && a !== h && String(u) === h && u >= 0 && t.parseArrays && u <= t.arrayLimit ? (s = [], s[u] = n) : h !== "__proto__" && (s[h] = n);
    }
    n = s;
  }
  return n;
}, Hm = function(r, e, t, i) {
  if (r) {
    var n = t.allowDots ? r.replace(/\.([^.[]+)/g, "[$1]") : r, o = /(\[[^[\]]*])/, s = /(\[[^[\]]*])/g, a = t.depth > 0 && o.exec(n), h = a ? n.slice(0, a.index) : n, u = [];
    if (h) {
      if (!t.plainObjects && os.call(Object.prototype, h) && !t.allowPrototypes)
        return;
      u.push(h);
    }
    for (var l = 0; t.depth > 0 && (a = s.exec(n)) !== null && l < t.depth; ) {
      if (l += 1, !t.plainObjects && os.call(Object.prototype, a[1].slice(1, -1)) && !t.allowPrototypes)
        return;
      u.push(a[1]);
    }
    return a && u.push("[" + n.slice(a.index) + "]"), jm(u, e, t, i);
  }
}, Ym = function(r) {
  if (!r)
    return Mt;
  if (r.decoder !== null && r.decoder !== void 0 && typeof r.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof r.charset < "u" && r.charset !== "utf-8" && r.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var e = typeof r.charset > "u" ? Mt.charset : r.charset;
  return {
    allowDots: typeof r.allowDots > "u" ? Mt.allowDots : !!r.allowDots,
    allowPrototypes: typeof r.allowPrototypes == "boolean" ? r.allowPrototypes : Mt.allowPrototypes,
    allowSparse: typeof r.allowSparse == "boolean" ? r.allowSparse : Mt.allowSparse,
    arrayLimit: typeof r.arrayLimit == "number" ? r.arrayLimit : Mt.arrayLimit,
    charset: e,
    charsetSentinel: typeof r.charsetSentinel == "boolean" ? r.charsetSentinel : Mt.charsetSentinel,
    comma: typeof r.comma == "boolean" ? r.comma : Mt.comma,
    decoder: typeof r.decoder == "function" ? r.decoder : Mt.decoder,
    delimiter: typeof r.delimiter == "string" || Ur.isRegExp(r.delimiter) ? r.delimiter : Mt.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof r.depth == "number" || r.depth === !1 ? +r.depth : Mt.depth,
    ignoreQueryPrefix: r.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof r.interpretNumericEntities == "boolean" ? r.interpretNumericEntities : Mt.interpretNumericEntities,
    parameterLimit: typeof r.parameterLimit == "number" ? r.parameterLimit : Mt.parameterLimit,
    parseArrays: r.parseArrays !== !1,
    plainObjects: typeof r.plainObjects == "boolean" ? r.plainObjects : Mt.plainObjects,
    strictNullHandling: typeof r.strictNullHandling == "boolean" ? r.strictNullHandling : Mt.strictNullHandling
  };
}, Vm = function(r, e) {
  var t = Ym(e);
  if (r === "" || r === null || typeof r > "u")
    return t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var i = typeof r == "string" ? Xm(r, t) : r, n = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = Object.keys(i), s = 0; s < o.length; ++s) {
    var a = o[s], h = Hm(a, i[a], t, typeof r == "string");
    n = Ur.merge(n, h, t);
  }
  return t.allowSparse === !0 ? n : Ur.compact(n);
}, $m = Lm, zm = Vm, Wm = ha, qm = {
  formats: Wm,
  parse: zm,
  stringify: $m
}, Km = Xf;
function Zt() {
  this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var Zm = /^([a-z0-9.+-]+:)/i, Jm = /:[0-9]*$/, Qm = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/, ty = [
  "<",
  ">",
  '"',
  "`",
  " ",
  "\r",
  `
`,
  "	"
], ey = [
  "{",
  "}",
  "|",
  "\\",
  "^",
  "`"
].concat(ty), ss = ["'"].concat(ey), Eh = [
  "%",
  "/",
  "?",
  ";",
  "#"
].concat(ss), Ah = [
  "/",
  "?",
  "#"
], ry = 255, Sh = /^[+a-z0-9A-Z_-]{0,63}$/, iy = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, ny = {
  javascript: !0,
  "javascript:": !0
}, as = {
  javascript: !0,
  "javascript:": !0
}, Nr = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
}, hs = qm;
function Xn(r, e, t) {
  if (r && typeof r == "object" && r instanceof Zt)
    return r;
  var i = new Zt();
  return i.parse(r, e, t), i;
}
Zt.prototype.parse = function(r, e, t) {
  if (typeof r != "string")
    throw new TypeError("Parameter 'url' must be a string, not " + typeof r);
  var i = r.indexOf("?"), n = i !== -1 && i < r.indexOf("#") ? "?" : "#", o = r.split(n), s = /\\/g;
  o[0] = o[0].replace(s, "/"), r = o.join(n);
  var a = r;
  if (a = a.trim(), !t && r.split("#").length === 1) {
    var h = Qm.exec(a);
    if (h)
      return this.path = a, this.href = a, this.pathname = h[1], h[2] ? (this.search = h[2], e ? this.query = hs.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : e && (this.search = "", this.query = {}), this;
  }
  var u = Zm.exec(a);
  if (u) {
    u = u[0];
    var l = u.toLowerCase();
    this.protocol = l, a = a.substr(u.length);
  }
  if (t || u || a.match(/^\/\/[^@/]+@[^@/]+/)) {
    var c = a.substr(0, 2) === "//";
    c && !(u && as[u]) && (a = a.substr(2), this.slashes = !0);
  }
  if (!as[u] && (c || u && !Nr[u])) {
    for (var d = -1, f = 0; f < Ah.length; f++) {
      var p = a.indexOf(Ah[f]);
      p !== -1 && (d === -1 || p < d) && (d = p);
    }
    var m, y;
    d === -1 ? y = a.lastIndexOf("@") : y = a.lastIndexOf("@", d), y !== -1 && (m = a.slice(0, y), a = a.slice(y + 1), this.auth = decodeURIComponent(m)), d = -1;
    for (var f = 0; f < Eh.length; f++) {
      var p = a.indexOf(Eh[f]);
      p !== -1 && (d === -1 || p < d) && (d = p);
    }
    d === -1 && (d = a.length), this.host = a.slice(0, d), a = a.slice(d), this.parseHost(), this.hostname = this.hostname || "";
    var _ = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!_)
      for (var g = this.hostname.split(/\./), f = 0, v = g.length; f < v; f++) {
        var b = g[f];
        if (b && !b.match(Sh)) {
          for (var T = "", S = 0, w = b.length; S < w; S++)
            b.charCodeAt(S) > 127 ? T += "x" : T += b[S];
          if (!T.match(Sh)) {
            var A = g.slice(0, f), x = g.slice(f + 1), E = b.match(iy);
            E && (A.push(E[1]), x.unshift(E[2])), x.length && (a = "/" + x.join(".") + a), this.hostname = A.join(".");
            break;
          }
        }
      }
    this.hostname.length > ry ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), _ || (this.hostname = Km.toASCII(this.hostname));
    var O = this.port ? ":" + this.port : "", P = this.hostname || "";
    this.host = P + O, this.href += this.host, _ && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), a[0] !== "/" && (a = "/" + a));
  }
  if (!ny[l])
    for (var f = 0, v = ss.length; f < v; f++) {
      var M = ss[f];
      if (a.indexOf(M) !== -1) {
        var F = encodeURIComponent(M);
        F === M && (F = escape(M)), a = a.split(M).join(F);
      }
    }
  var D = a.indexOf("#");
  D !== -1 && (this.hash = a.substr(D), a = a.slice(0, D));
  var C = a.indexOf("?");
  if (C !== -1 ? (this.search = a.substr(C), this.query = a.substr(C + 1), e && (this.query = hs.parse(this.query)), a = a.slice(0, C)) : e && (this.search = "", this.query = {}), a && (this.pathname = a), Nr[l] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
    var O = this.pathname || "", V = this.search || "";
    this.path = O + V;
  }
  return this.href = this.format(), this;
};
function oy(r) {
  return typeof r == "string" && (r = Xn(r)), r instanceof Zt ? r.format() : Zt.prototype.format.call(r);
}
Zt.prototype.format = function() {
  var r = this.auth || "";
  r && (r = encodeURIComponent(r), r = r.replace(/%3A/i, ":"), r += "@");
  var e = this.protocol || "", t = this.pathname || "", i = this.hash || "", n = !1, o = "";
  this.host ? n = r + this.host : this.hostname && (n = r + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (n += ":" + this.port)), this.query && typeof this.query == "object" && Object.keys(this.query).length && (o = hs.stringify(this.query, {
    arrayFormat: "repeat",
    addQueryPrefix: !1
  }));
  var s = this.search || o && "?" + o || "";
  return e && e.substr(-1) !== ":" && (e += ":"), this.slashes || (!e || Nr[e]) && n !== !1 ? (n = "//" + (n || ""), t && t.charAt(0) !== "/" && (t = "/" + t)) : n || (n = ""), i && i.charAt(0) !== "#" && (i = "#" + i), s && s.charAt(0) !== "?" && (s = "?" + s), t = t.replace(/[?#]/g, function(a) {
    return encodeURIComponent(a);
  }), s = s.replace("#", "%23"), e + n + t + s + i;
};
function sy(r, e) {
  return Xn(r, !1, !0).resolve(e);
}
Zt.prototype.resolve = function(r) {
  return this.resolveObject(Xn(r, !1, !0)).format();
};
Zt.prototype.resolveObject = function(r) {
  if (typeof r == "string") {
    var e = new Zt();
    e.parse(r, !1, !0), r = e;
  }
  for (var t = new Zt(), i = Object.keys(this), n = 0; n < i.length; n++) {
    var o = i[n];
    t[o] = this[o];
  }
  if (t.hash = r.hash, r.href === "")
    return t.href = t.format(), t;
  if (r.slashes && !r.protocol) {
    for (var s = Object.keys(r), a = 0; a < s.length; a++) {
      var h = s[a];
      h !== "protocol" && (t[h] = r[h]);
    }
    return Nr[t.protocol] && t.hostname && !t.pathname && (t.pathname = "/", t.path = t.pathname), t.href = t.format(), t;
  }
  if (r.protocol && r.protocol !== t.protocol) {
    if (!Nr[r.protocol]) {
      for (var u = Object.keys(r), l = 0; l < u.length; l++) {
        var c = u[l];
        t[c] = r[c];
      }
      return t.href = t.format(), t;
    }
    if (t.protocol = r.protocol, !r.host && !as[r.protocol]) {
      for (var v = (r.pathname || "").split("/"); v.length && !(r.host = v.shift()); )
        ;
      r.host || (r.host = ""), r.hostname || (r.hostname = ""), v[0] !== "" && v.unshift(""), v.length < 2 && v.unshift(""), t.pathname = v.join("/");
    } else
      t.pathname = r.pathname;
    if (t.search = r.search, t.query = r.query, t.host = r.host || "", t.auth = r.auth, t.hostname = r.hostname || r.host, t.port = r.port, t.pathname || t.search) {
      var d = t.pathname || "", f = t.search || "";
      t.path = d + f;
    }
    return t.slashes = t.slashes || r.slashes, t.href = t.format(), t;
  }
  var p = t.pathname && t.pathname.charAt(0) === "/", m = r.host || r.pathname && r.pathname.charAt(0) === "/", y = m || p || t.host && r.pathname, _ = y, g = t.pathname && t.pathname.split("/") || [], v = r.pathname && r.pathname.split("/") || [], b = t.protocol && !Nr[t.protocol];
  if (b && (t.hostname = "", t.port = null, t.host && (g[0] === "" ? g[0] = t.host : g.unshift(t.host)), t.host = "", r.protocol && (r.hostname = null, r.port = null, r.host && (v[0] === "" ? v[0] = r.host : v.unshift(r.host)), r.host = null), y = y && (v[0] === "" || g[0] === "")), m)
    t.host = r.host || r.host === "" ? r.host : t.host, t.hostname = r.hostname || r.hostname === "" ? r.hostname : t.hostname, t.search = r.search, t.query = r.query, g = v;
  else if (v.length)
    g || (g = []), g.pop(), g = g.concat(v), t.search = r.search, t.query = r.query;
  else if (r.search != null) {
    if (b) {
      t.host = g.shift(), t.hostname = t.host;
      var T = t.host && t.host.indexOf("@") > 0 ? t.host.split("@") : !1;
      T && (t.auth = T.shift(), t.hostname = T.shift(), t.host = t.hostname);
    }
    return t.search = r.search, t.query = r.query, (t.pathname !== null || t.search !== null) && (t.path = (t.pathname ? t.pathname : "") + (t.search ? t.search : "")), t.href = t.format(), t;
  }
  if (!g.length)
    return t.pathname = null, t.search ? t.path = "/" + t.search : t.path = null, t.href = t.format(), t;
  for (var S = g.slice(-1)[0], w = (t.host || r.host || g.length > 1) && (S === "." || S === "..") || S === "", A = 0, x = g.length; x >= 0; x--)
    S = g[x], S === "." ? g.splice(x, 1) : S === ".." ? (g.splice(x, 1), A++) : A && (g.splice(x, 1), A--);
  if (!y && !_)
    for (; A--; A)
      g.unshift("..");
  y && g[0] !== "" && (!g[0] || g[0].charAt(0) !== "/") && g.unshift(""), w && g.join("/").substr(-1) !== "/" && g.push("");
  var E = g[0] === "" || g[0] && g[0].charAt(0) === "/";
  if (b) {
    t.hostname = E ? "" : g.length ? g.shift() : "", t.host = t.hostname;
    var T = t.host && t.host.indexOf("@") > 0 ? t.host.split("@") : !1;
    T && (t.auth = T.shift(), t.hostname = T.shift(), t.host = t.hostname);
  }
  return y = y || t.host && g.length, y && !E && g.unshift(""), g.length > 0 ? t.pathname = g.join("/") : (t.pathname = null, t.path = null), (t.pathname !== null || t.search !== null) && (t.path = (t.pathname ? t.pathname : "") + (t.search ? t.search : "")), t.auth = r.auth || t.auth, t.slashes = t.slashes || r.slashes, t.href = t.format(), t;
};
Zt.prototype.parseHost = function() {
  var r = this.host, e = Jm.exec(r);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), r = r.substr(0, r.length - e.length)), r && (this.hostname = r);
};
var ay = Xn, hy = sy, uy = oy;
/*!
 * @pixi/utils - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/utils is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Or = {
  parse: ay,
  format: uy,
  resolve: hy
};
G.RETINA_PREFIX = /@([0-9\.]+)x/;
G.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1;
var wh = !1, Oh = "6.5.10";
function ly(r) {
  var e;
  if (!wh) {
    if (G.ADAPTER.getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
      var t = [
        `
 %c %c %c PixiJS ` + Oh + " - ✰ " + r + ` ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ 

`,
        "background: #ff66a5; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "color: #ff66a5; background: #030307; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "background: #ffc3dc; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;"
      ];
      (e = globalThis.console).log.apply(e, t);
    } else
      globalThis.console && globalThis.console.log("PixiJS " + Oh + " - " + r + " - http://www.pixijs.com/");
    wh = !0;
  }
}
var fo;
function cy() {
  return typeof fo > "u" && (fo = function() {
    var r = {
      stencil: !0,
      failIfMajorPerformanceCaveat: G.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
    };
    try {
      if (!G.ADAPTER.getWebGLRenderingContext())
        return !1;
      var e = G.ADAPTER.createCanvas(), t = e.getContext("webgl", r) || e.getContext("experimental-webgl", r), i = !!(t && t.getContextAttributes().stencil);
      if (t) {
        var n = t.getExtension("WEBGL_lose_context");
        n && n.loseContext();
      }
      return t = null, i;
    } catch {
      return !1;
    }
  }()), fo;
}
var dy = "#f0f8ff", fy = "#faebd7", py = "#00ffff", my = "#7fffd4", yy = "#f0ffff", _y = "#f5f5dc", gy = "#ffe4c4", vy = "#000000", by = "#ffebcd", xy = "#0000ff", Ty = "#8a2be2", Ey = "#a52a2a", Ay = "#deb887", Sy = "#5f9ea0", wy = "#7fff00", Oy = "#d2691e", Ry = "#ff7f50", Py = "#6495ed", My = "#fff8dc", Iy = "#dc143c", Dy = "#00ffff", Cy = "#00008b", Ny = "#008b8b", Fy = "#b8860b", Ly = "#a9a9a9", By = "#006400", Gy = "#a9a9a9", Uy = "#bdb76b", ky = "#8b008b", Xy = "#556b2f", jy = "#ff8c00", Hy = "#9932cc", Yy = "#8b0000", Vy = "#e9967a", $y = "#8fbc8f", zy = "#483d8b", Wy = "#2f4f4f", qy = "#2f4f4f", Ky = "#00ced1", Zy = "#9400d3", Jy = "#ff1493", Qy = "#00bfff", t_ = "#696969", e_ = "#696969", r_ = "#1e90ff", i_ = "#b22222", n_ = "#fffaf0", o_ = "#228b22", s_ = "#ff00ff", a_ = "#dcdcdc", h_ = "#f8f8ff", u_ = "#daa520", l_ = "#ffd700", c_ = "#808080", d_ = "#008000", f_ = "#adff2f", p_ = "#808080", m_ = "#f0fff0", y_ = "#ff69b4", __ = "#cd5c5c", g_ = "#4b0082", v_ = "#fffff0", b_ = "#f0e68c", x_ = "#fff0f5", T_ = "#e6e6fa", E_ = "#7cfc00", A_ = "#fffacd", S_ = "#add8e6", w_ = "#f08080", O_ = "#e0ffff", R_ = "#fafad2", P_ = "#d3d3d3", M_ = "#90ee90", I_ = "#d3d3d3", D_ = "#ffb6c1", C_ = "#ffa07a", N_ = "#20b2aa", F_ = "#87cefa", L_ = "#778899", B_ = "#778899", G_ = "#b0c4de", U_ = "#ffffe0", k_ = "#00ff00", X_ = "#32cd32", j_ = "#faf0e6", H_ = "#ff00ff", Y_ = "#800000", V_ = "#66cdaa", $_ = "#0000cd", z_ = "#ba55d3", W_ = "#9370db", q_ = "#3cb371", K_ = "#7b68ee", Z_ = "#00fa9a", J_ = "#48d1cc", Q_ = "#c71585", tg = "#191970", eg = "#f5fffa", rg = "#ffe4e1", ig = "#ffe4b5", ng = "#ffdead", og = "#000080", sg = "#fdf5e6", ag = "#808000", hg = "#6b8e23", ug = "#ffa500", lg = "#ff4500", cg = "#da70d6", dg = "#eee8aa", fg = "#98fb98", pg = "#afeeee", mg = "#db7093", yg = "#ffefd5", _g = "#ffdab9", gg = "#cd853f", vg = "#ffc0cb", bg = "#dda0dd", xg = "#b0e0e6", Tg = "#800080", Eg = "#663399", Ag = "#ff0000", Sg = "#bc8f8f", wg = "#4169e1", Og = "#8b4513", Rg = "#fa8072", Pg = "#f4a460", Mg = "#2e8b57", Ig = "#fff5ee", Dg = "#a0522d", Cg = "#c0c0c0", Ng = "#87ceeb", Fg = "#6a5acd", Lg = "#708090", Bg = "#708090", Gg = "#fffafa", Ug = "#00ff7f", kg = "#4682b4", Xg = "#d2b48c", jg = "#008080", Hg = "#d8bfd8", Yg = "#ff6347", Vg = "#40e0d0", $g = "#ee82ee", zg = "#f5deb3", Wg = "#ffffff", qg = "#f5f5f5", Kg = "#ffff00", Zg = "#9acd32", Jg = {
  aliceblue: dy,
  antiquewhite: fy,
  aqua: py,
  aquamarine: my,
  azure: yy,
  beige: _y,
  bisque: gy,
  black: vy,
  blanchedalmond: by,
  blue: xy,
  blueviolet: Ty,
  brown: Ey,
  burlywood: Ay,
  cadetblue: Sy,
  chartreuse: wy,
  chocolate: Oy,
  coral: Ry,
  cornflowerblue: Py,
  cornsilk: My,
  crimson: Iy,
  cyan: Dy,
  darkblue: Cy,
  darkcyan: Ny,
  darkgoldenrod: Fy,
  darkgray: Ly,
  darkgreen: By,
  darkgrey: Gy,
  darkkhaki: Uy,
  darkmagenta: ky,
  darkolivegreen: Xy,
  darkorange: jy,
  darkorchid: Hy,
  darkred: Yy,
  darksalmon: Vy,
  darkseagreen: $y,
  darkslateblue: zy,
  darkslategray: Wy,
  darkslategrey: qy,
  darkturquoise: Ky,
  darkviolet: Zy,
  deeppink: Jy,
  deepskyblue: Qy,
  dimgray: t_,
  dimgrey: e_,
  dodgerblue: r_,
  firebrick: i_,
  floralwhite: n_,
  forestgreen: o_,
  fuchsia: s_,
  gainsboro: a_,
  ghostwhite: h_,
  goldenrod: u_,
  gold: l_,
  gray: c_,
  green: d_,
  greenyellow: f_,
  grey: p_,
  honeydew: m_,
  hotpink: y_,
  indianred: __,
  indigo: g_,
  ivory: v_,
  khaki: b_,
  lavenderblush: x_,
  lavender: T_,
  lawngreen: E_,
  lemonchiffon: A_,
  lightblue: S_,
  lightcoral: w_,
  lightcyan: O_,
  lightgoldenrodyellow: R_,
  lightgray: P_,
  lightgreen: M_,
  lightgrey: I_,
  lightpink: D_,
  lightsalmon: C_,
  lightseagreen: N_,
  lightskyblue: F_,
  lightslategray: L_,
  lightslategrey: B_,
  lightsteelblue: G_,
  lightyellow: U_,
  lime: k_,
  limegreen: X_,
  linen: j_,
  magenta: H_,
  maroon: Y_,
  mediumaquamarine: V_,
  mediumblue: $_,
  mediumorchid: z_,
  mediumpurple: W_,
  mediumseagreen: q_,
  mediumslateblue: K_,
  mediumspringgreen: Z_,
  mediumturquoise: J_,
  mediumvioletred: Q_,
  midnightblue: tg,
  mintcream: eg,
  mistyrose: rg,
  moccasin: ig,
  navajowhite: ng,
  navy: og,
  oldlace: sg,
  olive: ag,
  olivedrab: hg,
  orange: ug,
  orangered: lg,
  orchid: cg,
  palegoldenrod: dg,
  palegreen: fg,
  paleturquoise: pg,
  palevioletred: mg,
  papayawhip: yg,
  peachpuff: _g,
  peru: gg,
  pink: vg,
  plum: bg,
  powderblue: xg,
  purple: Tg,
  rebeccapurple: Eg,
  red: Ag,
  rosybrown: Sg,
  royalblue: wg,
  saddlebrown: Og,
  salmon: Rg,
  sandybrown: Pg,
  seagreen: Mg,
  seashell: Ig,
  sienna: Dg,
  silver: Cg,
  skyblue: Ng,
  slateblue: Fg,
  slategray: Lg,
  slategrey: Bg,
  snow: Gg,
  springgreen: Ug,
  steelblue: kg,
  tan: Xg,
  teal: jg,
  thistle: Hg,
  tomato: Yg,
  turquoise: Vg,
  violet: $g,
  wheat: zg,
  white: Wg,
  whitesmoke: qg,
  yellow: Kg,
  yellowgreen: Zg
};
function kr(r, e) {
  return e === void 0 && (e = []), e[0] = (r >> 16 & 255) / 255, e[1] = (r >> 8 & 255) / 255, e[2] = (r & 255) / 255, e;
}
function xl(r) {
  var e = r.toString(16);
  return e = "000000".substring(0, 6 - e.length) + e, "#" + e;
}
function Rn(r) {
  return typeof r == "string" && (r = Jg[r.toLowerCase()] || r, r[0] === "#" && (r = r.slice(1))), parseInt(r, 16);
}
function Qg() {
  for (var r = [], e = [], t = 0; t < 32; t++)
    r[t] = t, e[t] = t;
  r[X.NORMAL_NPM] = X.NORMAL, r[X.ADD_NPM] = X.ADD, r[X.SCREEN_NPM] = X.SCREEN, e[X.NORMAL] = X.NORMAL_NPM, e[X.ADD] = X.ADD_NPM, e[X.SCREEN] = X.SCREEN_NPM;
  var i = [];
  return i.push(e), i.push(r), i;
}
var Tl = Qg();
function El(r, e) {
  return Tl[e ? 1 : 0][r];
}
function tv(r, e, t, i) {
  return t = t || new Float32Array(4), i || i === void 0 ? (t[0] = r[0] * e, t[1] = r[1] * e, t[2] = r[2] * e) : (t[0] = r[0], t[1] = r[1], t[2] = r[2]), t[3] = e, t;
}
function ua(r, e) {
  if (e === 1)
    return (e * 255 << 24) + r;
  if (e === 0)
    return 0;
  var t = r >> 16 & 255, i = r >> 8 & 255, n = r & 255;
  return t = t * e + 0.5 | 0, i = i * e + 0.5 | 0, n = n * e + 0.5 | 0, (e * 255 << 24) + (t << 16) + (i << 8) + n;
}
function Al(r, e, t, i) {
  return t = t || new Float32Array(4), t[0] = (r >> 16 & 255) / 255, t[1] = (r >> 8 & 255) / 255, t[2] = (r & 255) / 255, (i || i === void 0) && (t[0] *= e, t[1] *= e, t[2] *= e), t[3] = e, t;
}
function ev(r, e) {
  e === void 0 && (e = null);
  var t = r * 6;
  if (e = e || new Uint16Array(t), e.length !== t)
    throw new Error("Out buffer length is incorrect, got " + e.length + " and expected " + t);
  for (var i = 0, n = 0; i < t; i += 6, n += 4)
    e[i + 0] = n + 0, e[i + 1] = n + 1, e[i + 2] = n + 2, e[i + 3] = n + 0, e[i + 4] = n + 2, e[i + 5] = n + 3;
  return e;
}
function Sl(r) {
  if (r.BYTES_PER_ELEMENT === 4)
    return r instanceof Float32Array ? "Float32Array" : r instanceof Uint32Array ? "Uint32Array" : "Int32Array";
  if (r.BYTES_PER_ELEMENT === 2) {
    if (r instanceof Uint16Array)
      return "Uint16Array";
  } else if (r.BYTES_PER_ELEMENT === 1 && r instanceof Uint8Array)
    return "Uint8Array";
  return null;
}
function Pn(r) {
  return r += r === 0 ? 1 : 0, --r, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r + 1;
}
function Rh(r) {
  return !(r & r - 1) && !!r;
}
function Ph(r) {
  var e = (r > 65535 ? 1 : 0) << 4;
  r >>>= e;
  var t = (r > 255 ? 1 : 0) << 3;
  return r >>>= t, e |= t, t = (r > 15 ? 1 : 0) << 2, r >>>= t, e |= t, t = (r > 3 ? 1 : 0) << 1, r >>>= t, e |= t, e | r >> 1;
}
function Fr(r, e, t) {
  var i = r.length, n;
  if (!(e >= i || t === 0)) {
    t = e + t > i ? i - e : t;
    var o = i - t;
    for (n = e; n < o; ++n)
      r[n] = r[n + t];
    r.length = o;
  }
}
function Rr(r) {
  return r === 0 ? 0 : r < 0 ? -1 : 1;
}
var rv = 0;
function sr() {
  return ++rv;
}
var Mh = {};
function Jt(r, e, t) {
  if (t === void 0 && (t = 3), !Mh[e]) {
    var i = new Error().stack;
    typeof i > "u" ? console.warn("PixiJS Deprecation Warning: ", e + `
Deprecated since v` + r) : (i = i.split(`
`).splice(t).join(`
`), console.groupCollapsed ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", e + `
Deprecated since v` + r), console.warn(i), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", e + `
Deprecated since v` + r), console.warn(i))), Mh[e] = !0;
  }
}
var Ih = {}, pe = /* @__PURE__ */ Object.create(null), Xe = /* @__PURE__ */ Object.create(null), Dh = (
  /** @class */
  function() {
    function r(e, t, i) {
      this.canvas = G.ADAPTER.createCanvas(), this.context = this.canvas.getContext("2d"), this.resolution = i || G.RESOLUTION, this.resize(e, t);
    }
    return r.prototype.clear = function() {
      this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, r.prototype.resize = function(e, t) {
      this.canvas.width = Math.round(e * this.resolution), this.canvas.height = Math.round(t * this.resolution);
    }, r.prototype.destroy = function() {
      this.context = null, this.canvas = null;
    }, Object.defineProperty(r.prototype, "width", {
      /**
       * The width of the canvas buffer in pixels.
       * @member {number}
       */
      get: function() {
        return this.canvas.width;
      },
      set: function(e) {
        this.canvas.width = Math.round(e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "height", {
      /**
       * The height of the canvas buffer in pixels.
       * @member {number}
       */
      get: function() {
        return this.canvas.height;
      },
      set: function(e) {
        this.canvas.height = Math.round(e);
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
function iv(r) {
  var e = r.width, t = r.height, i = r.getContext("2d", {
    willReadFrequently: !0
  }), n = i.getImageData(0, 0, e, t), o = n.data, s = o.length, a = {
    top: null,
    left: null,
    right: null,
    bottom: null
  }, h = null, u, l, c;
  for (u = 0; u < s; u += 4)
    o[u + 3] !== 0 && (l = u / 4 % e, c = ~~(u / 4 / e), a.top === null && (a.top = c), (a.left === null || l < a.left) && (a.left = l), (a.right === null || a.right < l) && (a.right = l + 1), (a.bottom === null || a.bottom < c) && (a.bottom = c));
  return a.top !== null && (e = a.right - a.left, t = a.bottom - a.top + 1, h = i.getImageData(a.left, a.top, e, t)), {
    height: t,
    width: e,
    data: h
  };
}
var ki;
function nv(r, e) {
  if (e === void 0 && (e = globalThis.location), r.indexOf("data:") === 0)
    return "";
  e = e || globalThis.location, ki || (ki = document.createElement("a")), ki.href = r;
  var t = Or.parse(ki.href), i = !t.port && e.port === "" || t.port === e.port;
  return t.hostname !== e.hostname || !i || t.protocol !== e.protocol ? "anonymous" : "";
}
function Mn(r, e) {
  var t = G.RETINA_PREFIX.exec(r);
  return t ? parseFloat(t[1]) : e !== void 0 ? e : 1;
}
/*!
 * @pixi/math - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/math is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var In = Math.PI * 2, ov = 180 / Math.PI, sv = Math.PI / 180, Dt;
(function(r) {
  r[r.POLY = 0] = "POLY", r[r.RECT = 1] = "RECT", r[r.CIRC = 2] = "CIRC", r[r.ELIP = 3] = "ELIP", r[r.RREC = 4] = "RREC";
})(Dt || (Dt = {}));
var yt = (
  /** @class */
  function() {
    function r(e, t) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), this.x = 0, this.y = 0, this.x = e, this.y = t;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y);
    }, r.prototype.copyFrom = function(e) {
      return this.set(e.x, e.y), this;
    }, r.prototype.copyTo = function(e) {
      return e.set(this.x, this.y), e;
    }, r.prototype.equals = function(e) {
      return e.x === this.x && e.y === this.y;
    }, r.prototype.set = function(e, t) {
      return e === void 0 && (e = 0), t === void 0 && (t = e), this.x = e, this.y = t, this;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Point x=" + this.x + " y=" + this.y + "]";
    }, r;
  }()
), Xi = [new yt(), new yt(), new yt(), new yt()], nt = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), this.x = Number(e), this.y = Number(t), this.width = Number(i), this.height = Number(n), this.type = Dt.RECT;
    }
    return Object.defineProperty(r.prototype, "left", {
      /** Returns the left edge of the rectangle. */
      get: function() {
        return this.x;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "right", {
      /** Returns the right edge of the rectangle. */
      get: function() {
        return this.x + this.width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "top", {
      /** Returns the top edge of the rectangle. */
      get: function() {
        return this.y;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "bottom", {
      /** Returns the bottom edge of the rectangle. */
      get: function() {
        return this.y + this.height;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "EMPTY", {
      /** A constant empty rectangle. */
      get: function() {
        return new r(0, 0, 0, 0);
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.clone = function() {
      return new r(this.x, this.y, this.width, this.height);
    }, r.prototype.copyFrom = function(e) {
      return this.x = e.x, this.y = e.y, this.width = e.width, this.height = e.height, this;
    }, r.prototype.copyTo = function(e) {
      return e.x = this.x, e.y = this.y, e.width = this.width, e.height = this.height, e;
    }, r.prototype.contains = function(e, t) {
      return this.width <= 0 || this.height <= 0 ? !1 : e >= this.x && e < this.x + this.width && t >= this.y && t < this.y + this.height;
    }, r.prototype.intersects = function(e, t) {
      if (!t) {
        var i = this.x < e.x ? e.x : this.x, n = this.right > e.right ? e.right : this.right;
        if (n <= i)
          return !1;
        var o = this.y < e.y ? e.y : this.y, s = this.bottom > e.bottom ? e.bottom : this.bottom;
        return s > o;
      }
      var a = this.left, h = this.right, u = this.top, l = this.bottom;
      if (h <= a || l <= u)
        return !1;
      var c = Xi[0].set(e.left, e.top), d = Xi[1].set(e.left, e.bottom), f = Xi[2].set(e.right, e.top), p = Xi[3].set(e.right, e.bottom);
      if (f.x <= c.x || d.y <= c.y)
        return !1;
      var m = Math.sign(t.a * t.d - t.b * t.c);
      if (m === 0 || (t.apply(c, c), t.apply(d, d), t.apply(f, f), t.apply(p, p), Math.max(c.x, d.x, f.x, p.x) <= a || Math.min(c.x, d.x, f.x, p.x) >= h || Math.max(c.y, d.y, f.y, p.y) <= u || Math.min(c.y, d.y, f.y, p.y) >= l))
        return !1;
      var y = m * (d.y - c.y), _ = m * (c.x - d.x), g = y * a + _ * u, v = y * h + _ * u, b = y * a + _ * l, T = y * h + _ * l;
      if (Math.max(g, v, b, T) <= y * c.x + _ * c.y || Math.min(g, v, b, T) >= y * p.x + _ * p.y)
        return !1;
      var S = m * (c.y - f.y), w = m * (f.x - c.x), A = S * a + w * u, x = S * h + w * u, E = S * a + w * l, O = S * h + w * l;
      return !(Math.max(A, x, E, O) <= S * c.x + w * c.y || Math.min(A, x, E, O) >= S * p.x + w * p.y);
    }, r.prototype.pad = function(e, t) {
      return e === void 0 && (e = 0), t === void 0 && (t = e), this.x -= e, this.y -= t, this.width += e * 2, this.height += t * 2, this;
    }, r.prototype.fit = function(e) {
      var t = Math.max(this.x, e.x), i = Math.min(this.x + this.width, e.x + e.width), n = Math.max(this.y, e.y), o = Math.min(this.y + this.height, e.y + e.height);
      return this.x = t, this.width = Math.max(i - t, 0), this.y = n, this.height = Math.max(o - n, 0), this;
    }, r.prototype.ceil = function(e, t) {
      e === void 0 && (e = 1), t === void 0 && (t = 1e-3);
      var i = Math.ceil((this.x + this.width - t) * e) / e, n = Math.ceil((this.y + this.height - t) * e) / e;
      return this.x = Math.floor((this.x + t) * e) / e, this.y = Math.floor((this.y + t) * e) / e, this.width = i - this.x, this.height = n - this.y, this;
    }, r.prototype.enlarge = function(e) {
      var t = Math.min(this.x, e.x), i = Math.max(this.x + this.width, e.x + e.width), n = Math.min(this.y, e.y), o = Math.max(this.y + this.height, e.y + e.height);
      return this.x = t, this.width = i - t, this.y = n, this.height = o - n, this;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Rectangle x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
    }, r;
  }()
), av = (
  /** @class */
  function() {
    function r(e, t, i) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), i === void 0 && (i = 0), this.x = e, this.y = t, this.radius = i, this.type = Dt.CIRC;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.radius);
    }, r.prototype.contains = function(e, t) {
      if (this.radius <= 0)
        return !1;
      var i = this.radius * this.radius, n = this.x - e, o = this.y - t;
      return n *= n, o *= o, n + o <= i;
    }, r.prototype.getBounds = function() {
      return new nt(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }, r.prototype.toString = function() {
      return "[@pixi/math:Circle x=" + this.x + " y=" + this.y + " radius=" + this.radius + "]";
    }, r;
  }()
), hv = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), this.x = e, this.y = t, this.width = i, this.height = n, this.type = Dt.ELIP;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.width, this.height);
    }, r.prototype.contains = function(e, t) {
      if (this.width <= 0 || this.height <= 0)
        return !1;
      var i = (e - this.x) / this.width, n = (t - this.y) / this.height;
      return i *= i, n *= n, i + n <= 1;
    }, r.prototype.getBounds = function() {
      return new nt(this.x - this.width, this.y - this.height, this.width, this.height);
    }, r.prototype.toString = function() {
      return "[@pixi/math:Ellipse x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
    }, r;
  }()
), mn = (
  /** @class */
  function() {
    function r() {
      for (var e = arguments, t = [], i = 0; i < arguments.length; i++)
        t[i] = e[i];
      var n = Array.isArray(t[0]) ? t[0] : t;
      if (typeof n[0] != "number") {
        for (var o = [], s = 0, a = n.length; s < a; s++)
          o.push(n[s].x, n[s].y);
        n = o;
      }
      this.points = n, this.type = Dt.POLY, this.closeStroke = !0;
    }
    return r.prototype.clone = function() {
      var e = this.points.slice(), t = new r(e);
      return t.closeStroke = this.closeStroke, t;
    }, r.prototype.contains = function(e, t) {
      for (var i = !1, n = this.points.length / 2, o = 0, s = n - 1; o < n; s = o++) {
        var a = this.points[o * 2], h = this.points[o * 2 + 1], u = this.points[s * 2], l = this.points[s * 2 + 1], c = h > t != l > t && e < (u - a) * ((t - h) / (l - h)) + a;
        c && (i = !i);
      }
      return i;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Polygon" + ("closeStroke=" + this.closeStroke) + ("points=" + this.points.reduce(function(e, t) {
        return e + ", " + t;
      }, "") + "]");
    }, r;
  }()
), uv = (
  /** @class */
  function() {
    function r(e, t, i, n, o) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), o === void 0 && (o = 20), this.x = e, this.y = t, this.width = i, this.height = n, this.radius = o, this.type = Dt.RREC;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.width, this.height, this.radius);
    }, r.prototype.contains = function(e, t) {
      if (this.width <= 0 || this.height <= 0)
        return !1;
      if (e >= this.x && e <= this.x + this.width && t >= this.y && t <= this.y + this.height) {
        var i = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
        if (t >= this.y + i && t <= this.y + this.height - i || e >= this.x + i && e <= this.x + this.width - i)
          return !0;
        var n = e - (this.x + i), o = t - (this.y + i), s = i * i;
        if (n * n + o * o <= s || (n = e - (this.x + this.width - i), n * n + o * o <= s) || (o = t - (this.y + this.height - i), n * n + o * o <= s) || (n = e - (this.x + i), n * n + o * o <= s))
          return !0;
      }
      return !1;
    }, r.prototype.toString = function() {
      return "[@pixi/math:RoundedRectangle x=" + this.x + " y=" + this.y + ("width=" + this.width + " height=" + this.height + " radius=" + this.radius + "]");
    }, r;
  }()
), Pr = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      i === void 0 && (i = 0), n === void 0 && (n = 0), this._x = i, this._y = n, this.cb = e, this.scope = t;
    }
    return r.prototype.clone = function(e, t) {
      return e === void 0 && (e = this.cb), t === void 0 && (t = this.scope), new r(e, t, this._x, this._y);
    }, r.prototype.set = function(e, t) {
      return e === void 0 && (e = 0), t === void 0 && (t = e), (this._x !== e || this._y !== t) && (this._x = e, this._y = t, this.cb.call(this.scope)), this;
    }, r.prototype.copyFrom = function(e) {
      return (this._x !== e.x || this._y !== e.y) && (this._x = e.x, this._y = e.y, this.cb.call(this.scope)), this;
    }, r.prototype.copyTo = function(e) {
      return e.set(this._x, this._y), e;
    }, r.prototype.equals = function(e) {
      return e.x === this._x && e.y === this._y;
    }, r.prototype.toString = function() {
      return "[@pixi/math:ObservablePoint x=0 y=0 scope=" + this.scope + "]";
    }, Object.defineProperty(r.prototype, "x", {
      /** Position of the observable point on the x axis. */
      get: function() {
        return this._x;
      },
      set: function(e) {
        this._x !== e && (this._x = e, this.cb.call(this.scope));
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "y", {
      /** Position of the observable point on the y axis. */
      get: function() {
        return this._y;
      },
      set: function(e) {
        this._y !== e && (this._y = e, this.cb.call(this.scope));
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), Pt = (
  /** @class */
  function() {
    function r(e, t, i, n, o, s) {
      e === void 0 && (e = 1), t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 1), o === void 0 && (o = 0), s === void 0 && (s = 0), this.array = null, this.a = e, this.b = t, this.c = i, this.d = n, this.tx = o, this.ty = s;
    }
    return r.prototype.fromArray = function(e) {
      this.a = e[0], this.b = e[1], this.c = e[3], this.d = e[4], this.tx = e[2], this.ty = e[5];
    }, r.prototype.set = function(e, t, i, n, o, s) {
      return this.a = e, this.b = t, this.c = i, this.d = n, this.tx = o, this.ty = s, this;
    }, r.prototype.toArray = function(e, t) {
      this.array || (this.array = new Float32Array(9));
      var i = t || this.array;
      return e ? (i[0] = this.a, i[1] = this.b, i[2] = 0, i[3] = this.c, i[4] = this.d, i[5] = 0, i[6] = this.tx, i[7] = this.ty, i[8] = 1) : (i[0] = this.a, i[1] = this.c, i[2] = this.tx, i[3] = this.b, i[4] = this.d, i[5] = this.ty, i[6] = 0, i[7] = 0, i[8] = 1), i;
    }, r.prototype.apply = function(e, t) {
      t = t || new yt();
      var i = e.x, n = e.y;
      return t.x = this.a * i + this.c * n + this.tx, t.y = this.b * i + this.d * n + this.ty, t;
    }, r.prototype.applyInverse = function(e, t) {
      t = t || new yt();
      var i = 1 / (this.a * this.d + this.c * -this.b), n = e.x, o = e.y;
      return t.x = this.d * i * n + -this.c * i * o + (this.ty * this.c - this.tx * this.d) * i, t.y = this.a * i * o + -this.b * i * n + (-this.ty * this.a + this.tx * this.b) * i, t;
    }, r.prototype.translate = function(e, t) {
      return this.tx += e, this.ty += t, this;
    }, r.prototype.scale = function(e, t) {
      return this.a *= e, this.d *= t, this.c *= e, this.b *= t, this.tx *= e, this.ty *= t, this;
    }, r.prototype.rotate = function(e) {
      var t = Math.cos(e), i = Math.sin(e), n = this.a, o = this.c, s = this.tx;
      return this.a = n * t - this.b * i, this.b = n * i + this.b * t, this.c = o * t - this.d * i, this.d = o * i + this.d * t, this.tx = s * t - this.ty * i, this.ty = s * i + this.ty * t, this;
    }, r.prototype.append = function(e) {
      var t = this.a, i = this.b, n = this.c, o = this.d;
      return this.a = e.a * t + e.b * n, this.b = e.a * i + e.b * o, this.c = e.c * t + e.d * n, this.d = e.c * i + e.d * o, this.tx = e.tx * t + e.ty * n + this.tx, this.ty = e.tx * i + e.ty * o + this.ty, this;
    }, r.prototype.setTransform = function(e, t, i, n, o, s, a, h, u) {
      return this.a = Math.cos(a + u) * o, this.b = Math.sin(a + u) * o, this.c = -Math.sin(a - h) * s, this.d = Math.cos(a - h) * s, this.tx = e - (i * this.a + n * this.c), this.ty = t - (i * this.b + n * this.d), this;
    }, r.prototype.prepend = function(e) {
      var t = this.tx;
      if (e.a !== 1 || e.b !== 0 || e.c !== 0 || e.d !== 1) {
        var i = this.a, n = this.c;
        this.a = i * e.a + this.b * e.c, this.b = i * e.b + this.b * e.d, this.c = n * e.a + this.d * e.c, this.d = n * e.b + this.d * e.d;
      }
      return this.tx = t * e.a + this.ty * e.c + e.tx, this.ty = t * e.b + this.ty * e.d + e.ty, this;
    }, r.prototype.decompose = function(e) {
      var t = this.a, i = this.b, n = this.c, o = this.d, s = e.pivot, a = -Math.atan2(-n, o), h = Math.atan2(i, t), u = Math.abs(a + h);
      return u < 1e-5 || Math.abs(In - u) < 1e-5 ? (e.rotation = h, e.skew.x = e.skew.y = 0) : (e.rotation = 0, e.skew.x = a, e.skew.y = h), e.scale.x = Math.sqrt(t * t + i * i), e.scale.y = Math.sqrt(n * n + o * o), e.position.x = this.tx + (s.x * t + s.y * n), e.position.y = this.ty + (s.x * i + s.y * o), e;
    }, r.prototype.invert = function() {
      var e = this.a, t = this.b, i = this.c, n = this.d, o = this.tx, s = e * n - t * i;
      return this.a = n / s, this.b = -t / s, this.c = -i / s, this.d = e / s, this.tx = (i * this.ty - n * o) / s, this.ty = -(e * this.ty - t * o) / s, this;
    }, r.prototype.identity = function() {
      return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
    }, r.prototype.clone = function() {
      var e = new r();
      return e.a = this.a, e.b = this.b, e.c = this.c, e.d = this.d, e.tx = this.tx, e.ty = this.ty, e;
    }, r.prototype.copyTo = function(e) {
      return e.a = this.a, e.b = this.b, e.c = this.c, e.d = this.d, e.tx = this.tx, e.ty = this.ty, e;
    }, r.prototype.copyFrom = function(e) {
      return this.a = e.a, this.b = e.b, this.c = e.c, this.d = e.d, this.tx = e.tx, this.ty = e.ty, this;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Matrix a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + "]";
    }, Object.defineProperty(r, "IDENTITY", {
      /**
       * A default (identity) matrix
       * @readonly
       */
      get: function() {
        return new r();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "TEMP_MATRIX", {
      /**
       * A temp matrix
       * @readonly
       */
      get: function() {
        return new r();
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), $e = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], ze = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], We = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], qe = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], us = [], wl = [], ji = Math.sign;
function lv() {
  for (var r = 0; r < 16; r++) {
    var e = [];
    us.push(e);
    for (var t = 0; t < 16; t++)
      for (var i = ji($e[r] * $e[t] + We[r] * ze[t]), n = ji(ze[r] * $e[t] + qe[r] * ze[t]), o = ji($e[r] * We[t] + We[r] * qe[t]), s = ji(ze[r] * We[t] + qe[r] * qe[t]), a = 0; a < 16; a++)
        if ($e[a] === i && ze[a] === n && We[a] === o && qe[a] === s) {
          e.push(a);
          break;
        }
  }
  for (var r = 0; r < 16; r++) {
    var h = new Pt();
    h.set($e[r], ze[r], We[r], qe[r], 0, 0), wl.push(h);
  }
}
lv();
var bt = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: function(r) {
    return $e[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: function(r) {
    return ze[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: function(r) {
    return We[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: function(r) {
    return qe[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {PIXI.GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: function(r) {
    return r & 8 ? r & 15 : -r & 7;
  },
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {PIXI.GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {PIXI.GD8Symmetry} Composed operation
   */
  add: function(r, e) {
    return us[r][e];
  },
  /**
   * Reverse of `add`.
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotationSecond - Second operation
   * @param {PIXI.GD8Symmetry} rotationFirst - First operation
   * @returns {PIXI.GD8Symmetry} Result
   */
  sub: function(r, e) {
    return us[r][bt.inv(e)];
  },
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @memberof PIXI.groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: function(r) {
    return r ^ 4;
  },
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: function(r) {
    return (r & 3) === 2;
  },
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @memberof PIXI.groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {PIXI.GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: function(r, e) {
    return Math.abs(r) * 2 <= Math.abs(e) ? e >= 0 ? bt.S : bt.N : Math.abs(e) * 2 <= Math.abs(r) ? r > 0 ? bt.E : bt.W : e > 0 ? r > 0 ? bt.SE : bt.SW : r > 0 ? bt.NE : bt.NW;
  },
  /**
   * Helps sprite to compensate texture packer rotation.
   * @memberof PIXI.groupD8
   * @param {PIXI.Matrix} matrix - sprite world matrix
   * @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: function(r, e, t, i) {
    t === void 0 && (t = 0), i === void 0 && (i = 0);
    var n = wl[bt.inv(e)];
    n.tx = t, n.ty = i, r.append(n);
  }
}, Ol = (
  /** @class */
  function() {
    function r() {
      this.worldTransform = new Pt(), this.localTransform = new Pt(), this.position = new Pr(this.onChange, this, 0, 0), this.scale = new Pr(this.onChange, this, 1, 1), this.pivot = new Pr(this.onChange, this, 0, 0), this.skew = new Pr(this.updateSkew, this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._localID = 0, this._currentLocalID = 0, this._worldID = 0, this._parentID = 0;
    }
    return r.prototype.onChange = function() {
      this._localID++;
    }, r.prototype.updateSkew = function() {
      this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this._localID++;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Transform " + ("position=(" + this.position.x + ", " + this.position.y + ") ") + ("rotation=" + this.rotation + " ") + ("scale=(" + this.scale.x + ", " + this.scale.y + ") ") + ("skew=(" + this.skew.x + ", " + this.skew.y + ") ") + "]";
    }, r.prototype.updateLocalTransform = function() {
      var e = this.localTransform;
      this._localID !== this._currentLocalID && (e.a = this._cx * this.scale.x, e.b = this._sx * this.scale.x, e.c = this._cy * this.scale.y, e.d = this._sy * this.scale.y, e.tx = this.position.x - (this.pivot.x * e.a + this.pivot.y * e.c), e.ty = this.position.y - (this.pivot.x * e.b + this.pivot.y * e.d), this._currentLocalID = this._localID, this._parentID = -1);
    }, r.prototype.updateTransform = function(e) {
      var t = this.localTransform;
      if (this._localID !== this._currentLocalID && (t.a = this._cx * this.scale.x, t.b = this._sx * this.scale.x, t.c = this._cy * this.scale.y, t.d = this._sy * this.scale.y, t.tx = this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c), t.ty = this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d), this._currentLocalID = this._localID, this._parentID = -1), this._parentID !== e._worldID) {
        var i = e.worldTransform, n = this.worldTransform;
        n.a = t.a * i.a + t.b * i.c, n.b = t.a * i.b + t.b * i.d, n.c = t.c * i.a + t.d * i.c, n.d = t.c * i.b + t.d * i.d, n.tx = t.tx * i.a + t.ty * i.c + i.tx, n.ty = t.tx * i.b + t.ty * i.d + i.ty, this._parentID = e._worldID, this._worldID++;
      }
    }, r.prototype.setFromMatrix = function(e) {
      e.decompose(this), this._localID++;
    }, Object.defineProperty(r.prototype, "rotation", {
      /** The rotation of the object in radians. */
      get: function() {
        return this._rotation;
      },
      set: function(e) {
        this._rotation !== e && (this._rotation = e, this.updateSkew());
      },
      enumerable: !1,
      configurable: !0
    }), r.IDENTITY = new r(), r;
  }()
);
/*!
 * @pixi/display - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/display is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
G.SORTABLE_CHILDREN = !1;
var Dn = (
  /** @class */
  function() {
    function r() {
      this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.rect = null, this.updateID = -1;
    }
    return r.prototype.isEmpty = function() {
      return this.minX > this.maxX || this.minY > this.maxY;
    }, r.prototype.clear = function() {
      this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0;
    }, r.prototype.getRectangle = function(e) {
      return this.minX > this.maxX || this.minY > this.maxY ? nt.EMPTY : (e = e || new nt(0, 0, 1, 1), e.x = this.minX, e.y = this.minY, e.width = this.maxX - this.minX, e.height = this.maxY - this.minY, e);
    }, r.prototype.addPoint = function(e) {
      this.minX = Math.min(this.minX, e.x), this.maxX = Math.max(this.maxX, e.x), this.minY = Math.min(this.minY, e.y), this.maxY = Math.max(this.maxY, e.y);
    }, r.prototype.addPointMatrix = function(e, t) {
      var i = e.a, n = e.b, o = e.c, s = e.d, a = e.tx, h = e.ty, u = i * t.x + o * t.y + a, l = n * t.x + s * t.y + h;
      this.minX = Math.min(this.minX, u), this.maxX = Math.max(this.maxX, u), this.minY = Math.min(this.minY, l), this.maxY = Math.max(this.maxY, l);
    }, r.prototype.addQuad = function(e) {
      var t = this.minX, i = this.minY, n = this.maxX, o = this.maxY, s = e[0], a = e[1];
      t = s < t ? s : t, i = a < i ? a : i, n = s > n ? s : n, o = a > o ? a : o, s = e[2], a = e[3], t = s < t ? s : t, i = a < i ? a : i, n = s > n ? s : n, o = a > o ? a : o, s = e[4], a = e[5], t = s < t ? s : t, i = a < i ? a : i, n = s > n ? s : n, o = a > o ? a : o, s = e[6], a = e[7], t = s < t ? s : t, i = a < i ? a : i, n = s > n ? s : n, o = a > o ? a : o, this.minX = t, this.minY = i, this.maxX = n, this.maxY = o;
    }, r.prototype.addFrame = function(e, t, i, n, o) {
      this.addFrameMatrix(e.worldTransform, t, i, n, o);
    }, r.prototype.addFrameMatrix = function(e, t, i, n, o) {
      var s = e.a, a = e.b, h = e.c, u = e.d, l = e.tx, c = e.ty, d = this.minX, f = this.minY, p = this.maxX, m = this.maxY, y = s * t + h * i + l, _ = a * t + u * i + c;
      d = y < d ? y : d, f = _ < f ? _ : f, p = y > p ? y : p, m = _ > m ? _ : m, y = s * n + h * i + l, _ = a * n + u * i + c, d = y < d ? y : d, f = _ < f ? _ : f, p = y > p ? y : p, m = _ > m ? _ : m, y = s * t + h * o + l, _ = a * t + u * o + c, d = y < d ? y : d, f = _ < f ? _ : f, p = y > p ? y : p, m = _ > m ? _ : m, y = s * n + h * o + l, _ = a * n + u * o + c, d = y < d ? y : d, f = _ < f ? _ : f, p = y > p ? y : p, m = _ > m ? _ : m, this.minX = d, this.minY = f, this.maxX = p, this.maxY = m;
    }, r.prototype.addVertexData = function(e, t, i) {
      for (var n = this.minX, o = this.minY, s = this.maxX, a = this.maxY, h = t; h < i; h += 2) {
        var u = e[h], l = e[h + 1];
        n = u < n ? u : n, o = l < o ? l : o, s = u > s ? u : s, a = l > a ? l : a;
      }
      this.minX = n, this.minY = o, this.maxX = s, this.maxY = a;
    }, r.prototype.addVertices = function(e, t, i, n) {
      this.addVerticesMatrix(e.worldTransform, t, i, n);
    }, r.prototype.addVerticesMatrix = function(e, t, i, n, o, s) {
      o === void 0 && (o = 0), s === void 0 && (s = o);
      for (var a = e.a, h = e.b, u = e.c, l = e.d, c = e.tx, d = e.ty, f = this.minX, p = this.minY, m = this.maxX, y = this.maxY, _ = i; _ < n; _ += 2) {
        var g = t[_], v = t[_ + 1], b = a * g + u * v + c, T = l * v + h * g + d;
        f = Math.min(f, b - o), m = Math.max(m, b + o), p = Math.min(p, T - s), y = Math.max(y, T + s);
      }
      this.minX = f, this.minY = p, this.maxX = m, this.maxY = y;
    }, r.prototype.addBounds = function(e) {
      var t = this.minX, i = this.minY, n = this.maxX, o = this.maxY;
      this.minX = e.minX < t ? e.minX : t, this.minY = e.minY < i ? e.minY : i, this.maxX = e.maxX > n ? e.maxX : n, this.maxY = e.maxY > o ? e.maxY : o;
    }, r.prototype.addBoundsMask = function(e, t) {
      var i = e.minX > t.minX ? e.minX : t.minX, n = e.minY > t.minY ? e.minY : t.minY, o = e.maxX < t.maxX ? e.maxX : t.maxX, s = e.maxY < t.maxY ? e.maxY : t.maxY;
      if (i <= o && n <= s) {
        var a = this.minX, h = this.minY, u = this.maxX, l = this.maxY;
        this.minX = i < a ? i : a, this.minY = n < h ? n : h, this.maxX = o > u ? o : u, this.maxY = s > l ? s : l;
      }
    }, r.prototype.addBoundsMatrix = function(e, t) {
      this.addFrameMatrix(t, e.minX, e.minY, e.maxX, e.maxY);
    }, r.prototype.addBoundsArea = function(e, t) {
      var i = e.minX > t.x ? e.minX : t.x, n = e.minY > t.y ? e.minY : t.y, o = e.maxX < t.x + t.width ? e.maxX : t.x + t.width, s = e.maxY < t.y + t.height ? e.maxY : t.y + t.height;
      if (i <= o && n <= s) {
        var a = this.minX, h = this.minY, u = this.maxX, l = this.maxY;
        this.minX = i < a ? i : a, this.minY = n < h ? n : h, this.maxX = o > u ? o : u, this.maxY = s > l ? s : l;
      }
    }, r.prototype.pad = function(e, t) {
      e === void 0 && (e = 0), t === void 0 && (t = e), this.isEmpty() || (this.minX -= e, this.maxX += e, this.minY -= t, this.maxY += t);
    }, r.prototype.addFramePad = function(e, t, i, n, o, s) {
      e -= o, t -= s, i += o, n += s, this.minX = this.minX < e ? this.minX : e, this.maxX = this.maxX > i ? this.maxX : i, this.minY = this.minY < t ? this.minY : t, this.maxY = this.maxY > n ? this.maxY : n;
    }, r;
  }()
);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ls = function(r, e) {
  return ls = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, ls(r, e);
};
function la(r, e) {
  ls(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var wt = (
  /** @class */
  function(r) {
    la(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.tempDisplayObjectParent = null, t.transform = new Ol(), t.alpha = 1, t.visible = !0, t.renderable = !0, t.cullable = !1, t.cullArea = null, t.parent = null, t.worldAlpha = 1, t._lastSortedIndex = 0, t._zIndex = 0, t.filterArea = null, t.filters = null, t._enabledFilters = null, t._bounds = new Dn(), t._localBounds = null, t._boundsID = 0, t._boundsRect = null, t._localBoundsRect = null, t._mask = null, t._maskRefCount = 0, t._destroyed = !1, t.isSprite = !1, t.isMask = !1, t;
    }
    return e.mixin = function(t) {
      for (var i = Object.keys(t), n = 0; n < i.length; ++n) {
        var o = i[n];
        Object.defineProperty(e.prototype, o, Object.getOwnPropertyDescriptor(t, o));
      }
    }, Object.defineProperty(e.prototype, "destroyed", {
      /**
       * Fired when this DisplayObject is added to a Container.
       * @instance
       * @event added
       * @param {PIXI.Container} container - The container added to.
       */
      /**
       * Fired when this DisplayObject is removed from a Container.
       * @instance
       * @event removed
       * @param {PIXI.Container} container - The container removed from.
       */
      /**
       * Fired when this DisplayObject is destroyed. This event is emitted once
       * destroy is finished.
       * @instance
       * @event destroyed
       */
      /** Readonly flag for destroyed display objects. */
      get: function() {
        return this._destroyed;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype._recursivePostUpdateTransform = function() {
      this.parent ? (this.parent._recursivePostUpdateTransform(), this.transform.updateTransform(this.parent.transform)) : this.transform.updateTransform(this._tempDisplayObjectParent.transform);
    }, e.prototype.updateTransform = function() {
      this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
    }, e.prototype.getBounds = function(t, i) {
      return t || (this.parent ? (this._recursivePostUpdateTransform(), this.updateTransform()) : (this.parent = this._tempDisplayObjectParent, this.updateTransform(), this.parent = null)), this._bounds.updateID !== this._boundsID && (this.calculateBounds(), this._bounds.updateID = this._boundsID), i || (this._boundsRect || (this._boundsRect = new nt()), i = this._boundsRect), this._bounds.getRectangle(i);
    }, e.prototype.getLocalBounds = function(t) {
      t || (this._localBoundsRect || (this._localBoundsRect = new nt()), t = this._localBoundsRect), this._localBounds || (this._localBounds = new Dn());
      var i = this.transform, n = this.parent;
      this.parent = null, this.transform = this._tempDisplayObjectParent.transform;
      var o = this._bounds, s = this._boundsID;
      this._bounds = this._localBounds;
      var a = this.getBounds(!1, t);
      return this.parent = n, this.transform = i, this._bounds = o, this._bounds.updateID += this._boundsID - s, a;
    }, e.prototype.toGlobal = function(t, i, n) {
      return n === void 0 && (n = !1), n || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.apply(t, i);
    }, e.prototype.toLocal = function(t, i, n, o) {
      return i && (t = i.toGlobal(t, n, o)), o || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.applyInverse(t, n);
    }, e.prototype.setParent = function(t) {
      if (!t || !t.addChild)
        throw new Error("setParent: Argument must be a Container");
      return t.addChild(this), t;
    }, e.prototype.setTransform = function(t, i, n, o, s, a, h, u, l) {
      return t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 1), o === void 0 && (o = 1), s === void 0 && (s = 0), a === void 0 && (a = 0), h === void 0 && (h = 0), u === void 0 && (u = 0), l === void 0 && (l = 0), this.position.x = t, this.position.y = i, this.scale.x = n || 1, this.scale.y = o || 1, this.rotation = s, this.skew.x = a, this.skew.y = h, this.pivot.x = u, this.pivot.y = l, this;
    }, e.prototype.destroy = function(t) {
      this.parent && this.parent.removeChild(this), this._destroyed = !0, this.transform = null, this.parent = null, this._bounds = null, this.mask = null, this.cullArea = null, this.filters = null, this.filterArea = null, this.hitArea = null, this.interactive = !1, this.interactiveChildren = !1, this.emit("destroyed"), this.removeAllListeners();
    }, Object.defineProperty(e.prototype, "_tempDisplayObjectParent", {
      /**
       * @protected
       * @member {PIXI.Container}
       */
      get: function() {
        return this.tempDisplayObjectParent === null && (this.tempDisplayObjectParent = new Rl()), this.tempDisplayObjectParent;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.enableTempParent = function() {
      var t = this.parent;
      return this.parent = this._tempDisplayObjectParent, t;
    }, e.prototype.disableTempParent = function(t) {
      this.parent = t;
    }, Object.defineProperty(e.prototype, "x", {
      /**
       * The position of the displayObject on the x axis relative to the local coordinates of the parent.
       * An alias to position.x
       */
      get: function() {
        return this.position.x;
      },
      set: function(t) {
        this.transform.position.x = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "y", {
      /**
       * The position of the displayObject on the y axis relative to the local coordinates of the parent.
       * An alias to position.y
       */
      get: function() {
        return this.position.y;
      },
      set: function(t) {
        this.transform.position.y = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "worldTransform", {
      /**
       * Current transform of the object based on world (parent) factors.
       * @readonly
       */
      get: function() {
        return this.transform.worldTransform;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "localTransform", {
      /**
       * Current transform of the object based on local factors: position, scale, other stuff.
       * @readonly
       */
      get: function() {
        return this.transform.localTransform;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "position", {
      /**
       * The coordinate of the object relative to the local coordinates of the parent.
       * @since 4.0.0
       */
      get: function() {
        return this.transform.position;
      },
      set: function(t) {
        this.transform.position.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "scale", {
      /**
       * The scale factors of this object along the local coordinate axes.
       *
       * The default scale is (1, 1).
       * @since 4.0.0
       */
      get: function() {
        return this.transform.scale;
      },
      set: function(t) {
        this.transform.scale.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "pivot", {
      /**
       * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
       * is the projection of `pivot` in the parent's local space.
       *
       * By default, the pivot is the origin (0, 0).
       * @since 4.0.0
       */
      get: function() {
        return this.transform.pivot;
      },
      set: function(t) {
        this.transform.pivot.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "skew", {
      /**
       * The skew factor for the object in radians.
       * @since 4.0.0
       */
      get: function() {
        return this.transform.skew;
      },
      set: function(t) {
        this.transform.skew.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "rotation", {
      /**
       * The rotation of the object in radians.
       * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
       */
      get: function() {
        return this.transform.rotation;
      },
      set: function(t) {
        this.transform.rotation = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "angle", {
      /**
       * The angle of the object in degrees.
       * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
       */
      get: function() {
        return this.transform.rotation * ov;
      },
      set: function(t) {
        this.transform.rotation = t * sv;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "zIndex", {
      /**
       * The zIndex of the displayObject.
       *
       * If a container has the sortableChildren property set to true, children will be automatically
       * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
       * and thus rendered on top of other display objects within the same container.
       * @see PIXI.Container#sortableChildren
       */
      get: function() {
        return this._zIndex;
      },
      set: function(t) {
        this._zIndex = t, this.parent && (this.parent.sortDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "worldVisible", {
      /**
       * Indicates if the object is globally visible.
       * @readonly
       */
      get: function() {
        var t = this;
        do {
          if (!t.visible)
            return !1;
          t = t.parent;
        } while (t);
        return !0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "mask", {
      /**
       * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
       * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
       * {@link PIXI.Graphics} or a {@link PIXI.Sprite} object. This allows for much faster masking in canvas as it
       * utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
       * Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
       * To remove a mask, set this property to `null`.
       *
       * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
       * @example
       * const graphics = new PIXI.Graphics();
       * graphics.beginFill(0xFF3300);
       * graphics.drawRect(50, 250, 100, 100);
       * graphics.endFill();
       *
       * const sprite = new PIXI.Sprite(texture);
       * sprite.mask = graphics;
       * @todo At the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
       */
      get: function() {
        return this._mask;
      },
      set: function(t) {
        if (this._mask !== t) {
          if (this._mask) {
            var i = this._mask.isMaskData ? this._mask.maskObject : this._mask;
            i && (i._maskRefCount--, i._maskRefCount === 0 && (i.renderable = !0, i.isMask = !1));
          }
          if (this._mask = t, this._mask) {
            var i = this._mask.isMaskData ? this._mask.maskObject : this._mask;
            i && (i._maskRefCount === 0 && (i.renderable = !1, i.isMask = !0), i._maskRefCount++);
          }
        }
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(Si)
), Rl = (
  /** @class */
  function(r) {
    la(e, r);
    function e() {
      var t = r !== null && r.apply(this, arguments) || this;
      return t.sortDirty = null, t;
    }
    return e;
  }(wt)
);
wt.prototype.displayObjectUpdateTransform = wt.prototype.updateTransform;
function cv(r, e) {
  return r.zIndex === e.zIndex ? r._lastSortedIndex - e._lastSortedIndex : r.zIndex - e.zIndex;
}
var le = (
  /** @class */
  function(r) {
    la(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.children = [], t.sortableChildren = G.SORTABLE_CHILDREN, t.sortDirty = !1, t;
    }
    return e.prototype.onChildrenChange = function(t) {
    }, e.prototype.addChild = function() {
      for (var t = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = t[n];
      if (i.length > 1)
        for (var o = 0; o < i.length; o++)
          this.addChild(i[o]);
      else {
        var s = i[0];
        s.parent && s.parent.removeChild(s), s.parent = this, this.sortDirty = !0, s.transform._parentID = -1, this.children.push(s), this._boundsID++, this.onChildrenChange(this.children.length - 1), this.emit("childAdded", s, this, this.children.length - 1), s.emit("added", this);
      }
      return i[0];
    }, e.prototype.addChildAt = function(t, i) {
      if (i < 0 || i > this.children.length)
        throw new Error(t + "addChildAt: The index " + i + " supplied is out of bounds " + this.children.length);
      return t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1, this.children.splice(i, 0, t), this._boundsID++, this.onChildrenChange(i), t.emit("added", this), this.emit("childAdded", t, this, i), t;
    }, e.prototype.swapChildren = function(t, i) {
      if (t !== i) {
        var n = this.getChildIndex(t), o = this.getChildIndex(i);
        this.children[n] = i, this.children[o] = t, this.onChildrenChange(n < o ? n : o);
      }
    }, e.prototype.getChildIndex = function(t) {
      var i = this.children.indexOf(t);
      if (i === -1)
        throw new Error("The supplied DisplayObject must be a child of the caller");
      return i;
    }, e.prototype.setChildIndex = function(t, i) {
      if (i < 0 || i >= this.children.length)
        throw new Error("The index " + i + " supplied is out of bounds " + this.children.length);
      var n = this.getChildIndex(t);
      Fr(this.children, n, 1), this.children.splice(i, 0, t), this.onChildrenChange(i);
    }, e.prototype.getChildAt = function(t) {
      if (t < 0 || t >= this.children.length)
        throw new Error("getChildAt: Index (" + t + ") does not exist.");
      return this.children[t];
    }, e.prototype.removeChild = function() {
      for (var t = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = t[n];
      if (i.length > 1)
        for (var o = 0; o < i.length; o++)
          this.removeChild(i[o]);
      else {
        var s = i[0], a = this.children.indexOf(s);
        if (a === -1)
          return null;
        s.parent = null, s.transform._parentID = -1, Fr(this.children, a, 1), this._boundsID++, this.onChildrenChange(a), s.emit("removed", this), this.emit("childRemoved", s, this, a);
      }
      return i[0];
    }, e.prototype.removeChildAt = function(t) {
      var i = this.getChildAt(t);
      return i.parent = null, i.transform._parentID = -1, Fr(this.children, t, 1), this._boundsID++, this.onChildrenChange(t), i.emit("removed", this), this.emit("childRemoved", i, this, t), i;
    }, e.prototype.removeChildren = function(t, i) {
      t === void 0 && (t = 0), i === void 0 && (i = this.children.length);
      var n = t, o = i, s = o - n, a;
      if (s > 0 && s <= o) {
        a = this.children.splice(n, s);
        for (var h = 0; h < a.length; ++h)
          a[h].parent = null, a[h].transform && (a[h].transform._parentID = -1);
        this._boundsID++, this.onChildrenChange(t);
        for (var h = 0; h < a.length; ++h)
          a[h].emit("removed", this), this.emit("childRemoved", a[h], this, h);
        return a;
      } else if (s === 0 && this.children.length === 0)
        return [];
      throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
    }, e.prototype.sortChildren = function() {
      for (var t = !1, i = 0, n = this.children.length; i < n; ++i) {
        var o = this.children[i];
        o._lastSortedIndex = i, !t && o.zIndex !== 0 && (t = !0);
      }
      t && this.children.length > 1 && this.children.sort(cv), this.sortDirty = !1;
    }, e.prototype.updateTransform = function() {
      this.sortableChildren && this.sortDirty && this.sortChildren(), this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
      for (var t = 0, i = this.children.length; t < i; ++t) {
        var n = this.children[t];
        n.visible && n.updateTransform();
      }
    }, e.prototype.calculateBounds = function() {
      this._bounds.clear(), this._calculateBounds();
      for (var t = 0; t < this.children.length; t++) {
        var i = this.children[t];
        if (!(!i.visible || !i.renderable))
          if (i.calculateBounds(), i._mask) {
            var n = i._mask.isMaskData ? i._mask.maskObject : i._mask;
            n ? (n.calculateBounds(), this._bounds.addBoundsMask(i._bounds, n._bounds)) : this._bounds.addBounds(i._bounds);
          } else
            i.filterArea ? this._bounds.addBoundsArea(i._bounds, i.filterArea) : this._bounds.addBounds(i._bounds);
      }
      this._bounds.updateID = this._boundsID;
    }, e.prototype.getLocalBounds = function(t, i) {
      i === void 0 && (i = !1);
      var n = r.prototype.getLocalBounds.call(this, t);
      if (!i)
        for (var o = 0, s = this.children.length; o < s; ++o) {
          var a = this.children[o];
          a.visible && a.updateTransform();
        }
      return n;
    }, e.prototype._calculateBounds = function() {
    }, e.prototype._renderWithCulling = function(t) {
      var i = t.renderTexture.sourceFrame;
      if (i.width > 0 && i.height > 0) {
        var n, o;
        if (this.cullArea ? (n = this.cullArea, o = this.worldTransform) : this._render !== e.prototype._render && (n = this.getBounds(!0)), n && i.intersects(n, o))
          this._render(t);
        else if (this.cullArea)
          return;
        for (var s = 0, a = this.children.length; s < a; ++s) {
          var h = this.children[s], u = h.cullable;
          h.cullable = u || !this.cullArea, h.render(t), h.cullable = u;
        }
      }
    }, e.prototype.render = function(t) {
      if (!(!this.visible || this.worldAlpha <= 0 || !this.renderable))
        if (this._mask || this.filters && this.filters.length)
          this.renderAdvanced(t);
        else if (this.cullable)
          this._renderWithCulling(t);
        else {
          this._render(t);
          for (var i = 0, n = this.children.length; i < n; ++i)
            this.children[i].render(t);
        }
    }, e.prototype.renderAdvanced = function(t) {
      var i = this.filters, n = this._mask;
      if (i) {
        this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0;
        for (var o = 0; o < i.length; o++)
          i[o].enabled && this._enabledFilters.push(i[o]);
      }
      var s = i && this._enabledFilters && this._enabledFilters.length || n && (!n.isMaskData || n.enabled && (n.autoDetect || n.type !== Ot.NONE));
      if (s && t.batch.flush(), i && this._enabledFilters && this._enabledFilters.length && t.filter.push(this, this._enabledFilters), n && t.mask.push(this, this._mask), this.cullable)
        this._renderWithCulling(t);
      else {
        this._render(t);
        for (var o = 0, a = this.children.length; o < a; ++o)
          this.children[o].render(t);
      }
      s && t.batch.flush(), n && t.mask.pop(this), i && this._enabledFilters && this._enabledFilters.length && t.filter.pop();
    }, e.prototype._render = function(t) {
    }, e.prototype.destroy = function(t) {
      r.prototype.destroy.call(this), this.sortDirty = !1;
      var i = typeof t == "boolean" ? t : t && t.children, n = this.removeChildren(0, this.children.length);
      if (i)
        for (var o = 0; o < n.length; ++o)
          n[o].destroy(t);
    }, Object.defineProperty(e.prototype, "width", {
      /** The width of the Container, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.scale.x * this.getLocalBounds().width;
      },
      set: function(t) {
        var i = this.getLocalBounds().width;
        i !== 0 ? this.scale.x = t / i : this.scale.x = 1, this._width = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /** The height of the Container, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.scale.y * this.getLocalBounds().height;
      },
      set: function(t) {
        var i = this.getLocalBounds().height;
        i !== 0 ? this.scale.y = t / i : this.scale.y = 1, this._height = t;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(wt)
);
le.prototype.containerUpdateTransform = le.prototype.updateTransform;
/*!
 * @pixi/extensions - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/extensions is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var hi = function() {
  return hi = Object.assign || function(r) {
    for (var e = arguments, t, i = 1, n = arguments.length; i < n; i++) {
      t = e[i];
      for (var o in t)
        Object.prototype.hasOwnProperty.call(t, o) && (r[o] = t[o]);
    }
    return r;
  }, hi.apply(this, arguments);
}, ft;
(function(r) {
  r.Application = "application", r.RendererPlugin = "renderer-webgl-plugin", r.CanvasRendererPlugin = "renderer-canvas-plugin", r.Loader = "loader", r.LoadParser = "load-parser", r.ResolveParser = "resolve-parser", r.CacheParser = "cache-parser", r.DetectionParser = "detection-parser";
})(ft || (ft = {}));
var Ch = function(r) {
  if (typeof r == "function" || typeof r == "object" && r.extension) {
    if (!r.extension)
      throw new Error("Extension class must have an extension object");
    var e = typeof r.extension != "object" ? { type: r.extension } : r.extension;
    r = hi(hi({}, e), { ref: r });
  }
  if (typeof r == "object")
    r = hi({}, r);
  else
    throw new Error("Invalid extension type");
  return typeof r.type == "string" && (r.type = [r.type]), r;
}, Se = {
  /** @ignore */
  _addHandlers: null,
  /** @ignore */
  _removeHandlers: null,
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {PIXI.extensions} For chaining.
   */
  remove: function() {
    for (var r = arguments, e = this, t = [], i = 0; i < arguments.length; i++)
      t[i] = r[i];
    return t.map(Ch).forEach(function(n) {
      n.type.forEach(function(o) {
        var s, a;
        return (a = (s = e._removeHandlers)[o]) === null || a === void 0 ? void 0 : a.call(s, n);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {PIXI.extensions} For chaining.
   */
  add: function() {
    for (var r = arguments, e = this, t = [], i = 0; i < arguments.length; i++)
      t[i] = r[i];
    return t.map(Ch).forEach(function(n) {
      n.type.forEach(function(o) {
        var s = e._addHandlers, a = e._queue;
        s[o] ? s[o](n) : (a[o] = a[o] || [], a[o].push(n));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function for handling when extensions are added/registered passes {@link PIXI.ExtensionFormat}.
   * @param onRemove  - Function for handling when extensions are removed/unregistered passes {@link PIXI.ExtensionFormat}.
   * @returns {PIXI.extensions} For chaining.
   */
  handle: function(r, e, t) {
    var i = this._addHandlers = this._addHandlers || {}, n = this._removeHandlers = this._removeHandlers || {};
    if (i[r] || n[r])
      throw new Error("Extension type " + r + " already has a handler");
    i[r] = e, n[r] = t;
    var o = this._queue;
    return o[r] && (o[r].forEach(function(s) {
      return e(s);
    }), delete o[r]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByMap: function(r, e) {
    return this.handle(r, function(t) {
      e[t.name] = t.ref;
    }, function(t) {
      delete e[t.name];
    });
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByList: function(r, e) {
    return this.handle(r, function(t) {
      var i, n;
      e.includes(t.ref) || (e.push(t.ref), r === ft.Loader && ((n = (i = t.ref).add) === null || n === void 0 || n.call(i)));
    }, function(t) {
      var i = e.indexOf(t.ref);
      i !== -1 && e.splice(i, 1);
    });
  }
};
/*!
 * @pixi/runner - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/runner is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Nt = (
  /** @class */
  function() {
    function r(e) {
      this.items = [], this._name = e, this._aliasCount = 0;
    }
    return r.prototype.emit = function(e, t, i, n, o, s, a, h) {
      if (arguments.length > 8)
        throw new Error("max arguments reached");
      var u = this, l = u.name, c = u.items;
      this._aliasCount++;
      for (var d = 0, f = c.length; d < f; d++)
        c[d][l](e, t, i, n, o, s, a, h);
      return c === this.items && this._aliasCount--, this;
    }, r.prototype.ensureNonAliasedItems = function() {
      this._aliasCount > 0 && this.items.length > 1 && (this._aliasCount = 0, this.items = this.items.slice(0));
    }, r.prototype.add = function(e) {
      return e[this._name] && (this.ensureNonAliasedItems(), this.remove(e), this.items.push(e)), this;
    }, r.prototype.remove = function(e) {
      var t = this.items.indexOf(e);
      return t !== -1 && (this.ensureNonAliasedItems(), this.items.splice(t, 1)), this;
    }, r.prototype.contains = function(e) {
      return this.items.indexOf(e) !== -1;
    }, r.prototype.removeAll = function() {
      return this.ensureNonAliasedItems(), this.items.length = 0, this;
    }, r.prototype.destroy = function() {
      this.removeAll(), this.items = null, this._name = null;
    }, Object.defineProperty(r.prototype, "empty", {
      /**
       * `true` if there are no this Runner contains no listeners
       * @readonly
       */
      get: function() {
        return this.items.length === 0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "name", {
      /**
       * The name of the runner.
       * @readonly
       */
      get: function() {
        return this._name;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
Object.defineProperties(Nt.prototype, {
  /**
   * Alias for `emit`
   * @memberof PIXI.Runner#
   * @method dispatch
   * @see PIXI.Runner#emit
   */
  dispatch: { value: Nt.prototype.emit },
  /**
   * Alias for `emit`
   * @memberof PIXI.Runner#
   * @method run
   * @see PIXI.Runner#emit
   */
  run: { value: Nt.prototype.emit }
});
/*!
 * @pixi/ticker - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/ticker is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
G.TARGET_FPMS = 0.06;
var be;
(function(r) {
  r[r.INTERACTION = 50] = "INTERACTION", r[r.HIGH = 25] = "HIGH", r[r.NORMAL = 0] = "NORMAL", r[r.LOW = -25] = "LOW", r[r.UTILITY = -50] = "UTILITY";
})(be || (be = {}));
var po = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      t === void 0 && (t = null), i === void 0 && (i = 0), n === void 0 && (n = !1), this.next = null, this.previous = null, this._destroyed = !1, this.fn = e, this.context = t, this.priority = i, this.once = n;
    }
    return r.prototype.match = function(e, t) {
      return t === void 0 && (t = null), this.fn === e && this.context === t;
    }, r.prototype.emit = function(e) {
      this.fn && (this.context ? this.fn.call(this.context, e) : this.fn(e));
      var t = this.next;
      return this.once && this.destroy(!0), this._destroyed && (this.next = null), t;
    }, r.prototype.connect = function(e) {
      this.previous = e, e.next && (e.next.previous = this), this.next = e.next, e.next = this;
    }, r.prototype.destroy = function(e) {
      e === void 0 && (e = !1), this._destroyed = !0, this.fn = null, this.context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
      var t = this.next;
      return this.next = e ? null : t, this.previous = null, t;
    }, r;
  }()
), Ft = (
  /** @class */
  function() {
    function r() {
      var e = this;
      this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new po(null, null, 1 / 0), this.deltaMS = 1 / G.TARGET_FPMS, this.elapsedMS = 1 / G.TARGET_FPMS, this._tick = function(t) {
        e._requestId = null, e.started && (e.update(t), e.started && e._requestId === null && e._head.next && (e._requestId = requestAnimationFrame(e._tick)));
      };
    }
    return r.prototype._requestIfNeeded = function() {
      this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
    }, r.prototype._cancelIfNeeded = function() {
      this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
    }, r.prototype._startIfPossible = function() {
      this.started ? this._requestIfNeeded() : this.autoStart && this.start();
    }, r.prototype.add = function(e, t, i) {
      return i === void 0 && (i = be.NORMAL), this._addListener(new po(e, t, i));
    }, r.prototype.addOnce = function(e, t, i) {
      return i === void 0 && (i = be.NORMAL), this._addListener(new po(e, t, i, !0));
    }, r.prototype._addListener = function(e) {
      var t = this._head.next, i = this._head;
      if (!t)
        e.connect(i);
      else {
        for (; t; ) {
          if (e.priority > t.priority) {
            e.connect(i);
            break;
          }
          i = t, t = t.next;
        }
        e.previous || e.connect(i);
      }
      return this._startIfPossible(), this;
    }, r.prototype.remove = function(e, t) {
      for (var i = this._head.next; i; )
        i.match(e, t) ? i = i.destroy() : i = i.next;
      return this._head.next || this._cancelIfNeeded(), this;
    }, Object.defineProperty(r.prototype, "count", {
      /**
       * The number of listeners on this ticker, calculated by walking through linked list
       * @readonly
       * @member {number}
       */
      get: function() {
        if (!this._head)
          return 0;
        for (var e = 0, t = this._head; t = t.next; )
          e++;
        return e;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.start = function() {
      this.started || (this.started = !0, this._requestIfNeeded());
    }, r.prototype.stop = function() {
      this.started && (this.started = !1, this._cancelIfNeeded());
    }, r.prototype.destroy = function() {
      if (!this._protected) {
        this.stop();
        for (var e = this._head.next; e; )
          e = e.destroy(!0);
        this._head.destroy(), this._head = null;
      }
    }, r.prototype.update = function(e) {
      e === void 0 && (e = performance.now());
      var t;
      if (e > this.lastTime) {
        if (t = this.elapsedMS = e - this.lastTime, t > this._maxElapsedMS && (t = this._maxElapsedMS), t *= this.speed, this._minElapsedMS) {
          var i = e - this._lastFrame | 0;
          if (i < this._minElapsedMS)
            return;
          this._lastFrame = e - i % this._minElapsedMS;
        }
        this.deltaMS = t, this.deltaTime = this.deltaMS * G.TARGET_FPMS;
        for (var n = this._head, o = n.next; o; )
          o = o.emit(this.deltaTime);
        n.next || this._cancelIfNeeded();
      } else
        this.deltaTime = this.deltaMS = this.elapsedMS = 0;
      this.lastTime = e;
    }, Object.defineProperty(r.prototype, "FPS", {
      /**
       * The frames per second at which this ticker is running.
       * The default is approximately 60 in most modern browsers.
       * **Note:** This does not factor in the value of
       * {@link PIXI.Ticker#speed}, which is specific
       * to scaling {@link PIXI.Ticker#deltaTime}.
       * @member {number}
       * @readonly
       */
      get: function() {
        return 1e3 / this.elapsedMS;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "minFPS", {
      /**
       * Manages the maximum amount of milliseconds allowed to
       * elapse between invoking {@link PIXI.Ticker#update}.
       * This value is used to cap {@link PIXI.Ticker#deltaTime},
       * but does not effect the measured value of {@link PIXI.Ticker#FPS}.
       * When setting this property it is clamped to a value between
       * `0` and `PIXI.settings.TARGET_FPMS * 1000`.
       * @member {number}
       * @default 10
       */
      get: function() {
        return 1e3 / this._maxElapsedMS;
      },
      set: function(e) {
        var t = Math.min(this.maxFPS, e), i = Math.min(Math.max(0, t) / 1e3, G.TARGET_FPMS);
        this._maxElapsedMS = 1 / i;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "maxFPS", {
      /**
       * Manages the minimum amount of milliseconds required to
       * elapse between invoking {@link PIXI.Ticker#update}.
       * This will effect the measured value of {@link PIXI.Ticker#FPS}.
       * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
       * Otherwise it will be at least `minFPS`
       * @member {number}
       * @default 0
       */
      get: function() {
        return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
      },
      set: function(e) {
        if (e === 0)
          this._minElapsedMS = 0;
        else {
          var t = Math.max(this.minFPS, e);
          this._minElapsedMS = 1 / (t / 1e3);
        }
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "shared", {
      /**
       * The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
       * {@link PIXI.VideoResource} to update animation frames / video textures.
       *
       * It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
       *
       * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
       * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
       * @example
       * let ticker = PIXI.Ticker.shared;
       * // Set this to prevent starting this ticker when listeners are added.
       * // By default this is true only for the PIXI.Ticker.shared instance.
       * ticker.autoStart = false;
       * // FYI, call this to ensure the ticker is stopped. It should be stopped
       * // if you have not attempted to render anything yet.
       * ticker.stop();
       * // Call this when you are ready for a running shared ticker.
       * ticker.start();
       * @example
       * // You may use the shared ticker to render...
       * let renderer = PIXI.autoDetectRenderer();
       * let stage = new PIXI.Container();
       * document.body.appendChild(renderer.view);
       * ticker.add(function (time) {
       *     renderer.render(stage);
       * });
       * @example
       * // Or you can just update it manually.
       * ticker.autoStart = false;
       * ticker.stop();
       * function animate(time) {
       *     ticker.update(time);
       *     renderer.render(stage);
       *     requestAnimationFrame(animate);
       * }
       * animate(performance.now());
       * @member {PIXI.Ticker}
       * @static
       */
      get: function() {
        if (!r._shared) {
          var e = r._shared = new r();
          e.autoStart = !0, e._protected = !0;
        }
        return r._shared;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "system", {
      /**
       * The system ticker instance used by {@link PIXI.InteractionManager} and by
       * {@link PIXI.BasePrepare} for core timing functionality that shouldn't usually need to be paused,
       * unlike the `shared` ticker which drives visual animations and rendering which may want to be paused.
       *
       * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
       * @member {PIXI.Ticker}
       * @static
       */
      get: function() {
        if (!r._system) {
          var e = r._system = new r();
          e.autoStart = !0, e._protected = !0;
        }
        return r._system;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), dv = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(e) {
      var t = this;
      e = Object.assign({
        autoStart: !0,
        sharedTicker: !1
      }, e), Object.defineProperty(this, "ticker", {
        set: function(i) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = i, i && i.add(this.render, this, be.LOW);
        },
        get: function() {
          return this._ticker;
        }
      }), this.stop = function() {
        t._ticker.stop();
      }, this.start = function() {
        t._ticker.start();
      }, this._ticker = null, this.ticker = e.sharedTicker ? Ft.shared : new Ft(), e.autoStart && this.start();
    }, r.destroy = function() {
      if (this._ticker) {
        var e = this._ticker;
        this.ticker = null, e.destroy();
      }
    }, r.extension = ft.Application, r;
  }()
);
/*!
 * @pixi/core - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/core is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
G.PREFER_ENV = ae.any ? ve.WEBGL : ve.WEBGL2;
G.STRICT_TEXTURE_CACHE = !1;
var cs = [];
function Pl(r, e) {
  if (!r)
    return null;
  var t = "";
  if (typeof r == "string") {
    var i = /\.(\w{3,4})(?:$|\?|#)/i.exec(r);
    i && (t = i[1].toLowerCase());
  }
  for (var n = cs.length - 1; n >= 0; --n) {
    var o = cs[n];
    if (o.test && o.test(r, t))
      return new o(r, e);
  }
  throw new Error("Unrecognized source type to auto-detect Resource");
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ds = function(r, e) {
  return ds = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, ds(r, e);
};
function pt(r, e) {
  ds(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var fs = function() {
  return fs = Object.assign || function(r) {
    for (var e = arguments, t, i = 1, n = arguments.length; i < n; i++) {
      t = e[i];
      for (var o in t)
        Object.prototype.hasOwnProperty.call(t, o) && (r[o] = t[o]);
    }
    return r;
  }, fs.apply(this, arguments);
};
function fv(r, e) {
  var t = {};
  for (var i in r)
    Object.prototype.hasOwnProperty.call(r, i) && e.indexOf(i) < 0 && (t[i] = r[i]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var n = 0, i = Object.getOwnPropertySymbols(r); n < i.length; n++)
      e.indexOf(i[n]) < 0 && Object.prototype.propertyIsEnumerable.call(r, i[n]) && (t[i[n]] = r[i[n]]);
  return t;
}
var yi = (
  /** @class */
  function() {
    function r(e, t) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), this._width = e, this._height = t, this.destroyed = !1, this.internal = !1, this.onResize = new Nt("setRealSize"), this.onUpdate = new Nt("update"), this.onError = new Nt("onError");
    }
    return r.prototype.bind = function(e) {
      this.onResize.add(e), this.onUpdate.add(e), this.onError.add(e), (this._width || this._height) && this.onResize.emit(this._width, this._height);
    }, r.prototype.unbind = function(e) {
      this.onResize.remove(e), this.onUpdate.remove(e), this.onError.remove(e);
    }, r.prototype.resize = function(e, t) {
      (e !== this._width || t !== this._height) && (this._width = e, this._height = t, this.onResize.emit(e, t));
    }, Object.defineProperty(r.prototype, "valid", {
      /**
       * Has been validated
       * @readonly
       */
      get: function() {
        return !!this._width && !!this._height;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.update = function() {
      this.destroyed || this.onUpdate.emit();
    }, r.prototype.load = function() {
      return Promise.resolve(this);
    }, Object.defineProperty(r.prototype, "width", {
      /**
       * The width of the resource.
       * @readonly
       */
      get: function() {
        return this._width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "height", {
      /**
       * The height of the resource.
       * @readonly
       */
      get: function() {
        return this._height;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.style = function(e, t, i) {
      return !1;
    }, r.prototype.dispose = function() {
    }, r.prototype.destroy = function() {
      this.destroyed || (this.destroyed = !0, this.dispose(), this.onError.removeAll(), this.onError = null, this.onResize.removeAll(), this.onResize = null, this.onUpdate.removeAll(), this.onUpdate = null);
    }, r.test = function(e, t) {
      return !1;
    }, r;
  }()
), Oi = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      var n = this, o = i || {}, s = o.width, a = o.height;
      if (!s || !a)
        throw new Error("BufferResource width or height invalid");
      return n = r.call(this, s, a) || this, n.data = t, n;
    }
    return e.prototype.upload = function(t, i, n) {
      var o = t.gl;
      o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === te.UNPACK);
      var s = i.realWidth, a = i.realHeight;
      return n.width === s && n.height === a ? o.texSubImage2D(i.target, 0, 0, 0, s, a, i.format, n.type, this.data) : (n.width = s, n.height = a, o.texImage2D(i.target, 0, n.internalFormat, s, a, 0, i.format, n.type, this.data)), !0;
    }, e.prototype.dispose = function() {
      this.data = null;
    }, e.test = function(t) {
      return t instanceof Float32Array || t instanceof Uint8Array || t instanceof Uint32Array;
    }, e;
  }(yi)
), pv = {
  scaleMode: se.NEAREST,
  format: N.RGBA,
  alphaMode: te.NPM
}, it = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      t === void 0 && (t = null), i === void 0 && (i = null);
      var n = r.call(this) || this;
      i = i || {};
      var o = i.alphaMode, s = i.mipmap, a = i.anisotropicLevel, h = i.scaleMode, u = i.width, l = i.height, c = i.wrapMode, d = i.format, f = i.type, p = i.target, m = i.resolution, y = i.resourceOptions;
      return t && !(t instanceof yi) && (t = Pl(t, y), t.internal = !0), n.resolution = m || G.RESOLUTION, n.width = Math.round((u || 0) * n.resolution) / n.resolution, n.height = Math.round((l || 0) * n.resolution) / n.resolution, n._mipmap = s !== void 0 ? s : G.MIPMAP_TEXTURES, n.anisotropicLevel = a !== void 0 ? a : G.ANISOTROPIC_LEVEL, n._wrapMode = c || G.WRAP_MODE, n._scaleMode = h !== void 0 ? h : G.SCALE_MODE, n.format = d || N.RGBA, n.type = f || k.UNSIGNED_BYTE, n.target = p || tr.TEXTURE_2D, n.alphaMode = o !== void 0 ? o : te.UNPACK, n.uid = sr(), n.touched = 0, n.isPowerOfTwo = !1, n._refreshPOT(), n._glTextures = {}, n.dirtyId = 0, n.dirtyStyleId = 0, n.cacheId = null, n.valid = u > 0 && l > 0, n.textureCacheIds = [], n.destroyed = !1, n.resource = null, n._batchEnabled = 0, n._batchLocation = 0, n.parentTextureArray = null, n.setResource(t), n;
    }
    return Object.defineProperty(e.prototype, "realWidth", {
      /**
       * Pixel width of the source of this texture
       * @readonly
       */
      get: function() {
        return Math.round(this.width * this.resolution);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "realHeight", {
      /**
       * Pixel height of the source of this texture
       * @readonly
       */
      get: function() {
        return Math.round(this.height * this.resolution);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "mipmap", {
      /**
       * Mipmap mode of the texture, affects downscaled images
       * @default PIXI.settings.MIPMAP_TEXTURES
       */
      get: function() {
        return this._mipmap;
      },
      set: function(t) {
        this._mipmap !== t && (this._mipmap = t, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "scaleMode", {
      /**
       * The scale mode to apply when scaling this texture
       * @default PIXI.settings.SCALE_MODE
       */
      get: function() {
        return this._scaleMode;
      },
      set: function(t) {
        this._scaleMode !== t && (this._scaleMode = t, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "wrapMode", {
      /**
       * How the texture wraps
       * @default PIXI.settings.WRAP_MODE
       */
      get: function() {
        return this._wrapMode;
      },
      set: function(t) {
        this._wrapMode !== t && (this._wrapMode = t, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.setStyle = function(t, i) {
      var n;
      return t !== void 0 && t !== this.scaleMode && (this.scaleMode = t, n = !0), i !== void 0 && i !== this.mipmap && (this.mipmap = i, n = !0), n && this.dirtyStyleId++, this;
    }, e.prototype.setSize = function(t, i, n) {
      return n = n || this.resolution, this.setRealSize(t * n, i * n, n);
    }, e.prototype.setRealSize = function(t, i, n) {
      return this.resolution = n || this.resolution, this.width = Math.round(t) / this.resolution, this.height = Math.round(i) / this.resolution, this._refreshPOT(), this.update(), this;
    }, e.prototype._refreshPOT = function() {
      this.isPowerOfTwo = Rh(this.realWidth) && Rh(this.realHeight);
    }, e.prototype.setResolution = function(t) {
      var i = this.resolution;
      return i === t ? this : (this.resolution = t, this.valid && (this.width = Math.round(this.width * i) / t, this.height = Math.round(this.height * i) / t, this.emit("update", this)), this._refreshPOT(), this);
    }, e.prototype.setResource = function(t) {
      if (this.resource === t)
        return this;
      if (this.resource)
        throw new Error("Resource can be set only once");
      return t.bind(this), this.resource = t, this;
    }, e.prototype.update = function() {
      this.valid ? (this.dirtyId++, this.dirtyStyleId++, this.emit("update", this)) : this.width > 0 && this.height > 0 && (this.valid = !0, this.emit("loaded", this), this.emit("update", this));
    }, e.prototype.onError = function(t) {
      this.emit("error", this, t);
    }, e.prototype.destroy = function() {
      this.resource && (this.resource.unbind(this), this.resource.internal && this.resource.destroy(), this.resource = null), this.cacheId && (delete Xe[this.cacheId], delete pe[this.cacheId], this.cacheId = null), this.dispose(), e.removeFromCache(this), this.textureCacheIds = null, this.destroyed = !0;
    }, e.prototype.dispose = function() {
      this.emit("dispose", this);
    }, e.prototype.castToBaseTexture = function() {
      return this;
    }, e.from = function(t, i, n) {
      n === void 0 && (n = G.STRICT_TEXTURE_CACHE);
      var o = typeof t == "string", s = null;
      if (o)
        s = t;
      else {
        if (!t._pixiId) {
          var a = i && i.pixiIdPrefix || "pixiid";
          t._pixiId = a + "_" + sr();
        }
        s = t._pixiId;
      }
      var h = Xe[s];
      if (o && n && !h)
        throw new Error('The cacheId "' + s + '" does not exist in BaseTextureCache.');
      return h || (h = new e(t, i), h.cacheId = s, e.addToCache(h, s)), h;
    }, e.fromBuffer = function(t, i, n, o) {
      t = t || new Float32Array(i * n * 4);
      var s = new Oi(t, { width: i, height: n }), a = t instanceof Float32Array ? k.FLOAT : k.UNSIGNED_BYTE;
      return new e(s, Object.assign({}, pv, o || { width: i, height: n, type: a }));
    }, e.addToCache = function(t, i) {
      i && (t.textureCacheIds.indexOf(i) === -1 && t.textureCacheIds.push(i), Xe[i] && console.warn("BaseTexture added to the cache with an id [" + i + "] that already had an entry"), Xe[i] = t);
    }, e.removeFromCache = function(t) {
      if (typeof t == "string") {
        var i = Xe[t];
        if (i) {
          var n = i.textureCacheIds.indexOf(t);
          return n > -1 && i.textureCacheIds.splice(n, 1), delete Xe[t], i;
        }
      } else if (t && t.textureCacheIds) {
        for (var o = 0; o < t.textureCacheIds.length; ++o)
          delete Xe[t.textureCacheIds[o]];
        return t.textureCacheIds.length = 0, t;
      }
      return null;
    }, e._globalBatch = 0, e;
  }(Si)
), Ml = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      var n = this, o = i || {}, s = o.width, a = o.height;
      n = r.call(this, s, a) || this, n.items = [], n.itemDirtyIds = [];
      for (var h = 0; h < t; h++) {
        var u = new it();
        n.items.push(u), n.itemDirtyIds.push(-2);
      }
      return n.length = t, n._load = null, n.baseTexture = null, n;
    }
    return e.prototype.initFromArray = function(t, i) {
      for (var n = 0; n < this.length; n++)
        t[n] && (t[n].castToBaseTexture ? this.addBaseTextureAt(t[n].castToBaseTexture(), n) : t[n] instanceof yi ? this.addResourceAt(t[n], n) : this.addResourceAt(Pl(t[n], i), n));
    }, e.prototype.dispose = function() {
      for (var t = 0, i = this.length; t < i; t++)
        this.items[t].destroy();
      this.items = null, this.itemDirtyIds = null, this._load = null;
    }, e.prototype.addResourceAt = function(t, i) {
      if (!this.items[i])
        throw new Error("Index " + i + " is out of bounds");
      return t.valid && !this.valid && this.resize(t.width, t.height), this.items[i].setResource(t), this;
    }, e.prototype.bind = function(t) {
      if (this.baseTexture !== null)
        throw new Error("Only one base texture per TextureArray is allowed");
      r.prototype.bind.call(this, t);
      for (var i = 0; i < this.length; i++)
        this.items[i].parentTextureArray = t, this.items[i].on("update", t.update, t);
    }, e.prototype.unbind = function(t) {
      r.prototype.unbind.call(this, t);
      for (var i = 0; i < this.length; i++)
        this.items[i].parentTextureArray = null, this.items[i].off("update", t.update, t);
    }, e.prototype.load = function() {
      var t = this;
      if (this._load)
        return this._load;
      var i = this.items.map(function(o) {
        return o.resource;
      }).filter(function(o) {
        return o;
      }), n = i.map(function(o) {
        return o.load();
      });
      return this._load = Promise.all(n).then(function() {
        var o = t.items[0], s = o.realWidth, a = o.realHeight;
        return t.resize(s, a), Promise.resolve(t);
      }), this._load;
    }, e;
  }(yi)
), mv = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      var n = this, o = i || {}, s = o.width, a = o.height, h, u;
      return Array.isArray(t) ? (h = t, u = t.length) : u = t, n = r.call(this, u, { width: s, height: a }) || this, h && n.initFromArray(h, i), n;
    }
    return e.prototype.addBaseTextureAt = function(t, i) {
      if (t.resource)
        this.addResourceAt(t.resource, i);
      else
        throw new Error("ArrayResource does not support RenderTexture");
      return this;
    }, e.prototype.bind = function(t) {
      r.prototype.bind.call(this, t), t.target = tr.TEXTURE_2D_ARRAY;
    }, e.prototype.upload = function(t, i, n) {
      var o = this, s = o.length, a = o.itemDirtyIds, h = o.items, u = t.gl;
      n.dirtyId < 0 && u.texImage3D(u.TEXTURE_2D_ARRAY, 0, n.internalFormat, this._width, this._height, s, 0, i.format, n.type, null);
      for (var l = 0; l < s; l++) {
        var c = h[l];
        a[l] < c.dirtyId && (a[l] = c.dirtyId, c.valid && u.texSubImage3D(
          u.TEXTURE_2D_ARRAY,
          0,
          0,
          // xoffset
          0,
          // yoffset
          l,
          // zoffset
          c.resource.width,
          c.resource.height,
          1,
          i.format,
          n.type,
          c.resource.source
        ));
      }
      return !0;
    }, e;
  }(Ml)
), Fe = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      var i = this, n = t, o = n.naturalWidth || n.videoWidth || n.width, s = n.naturalHeight || n.videoHeight || n.height;
      return i = r.call(this, o, s) || this, i.source = t, i.noSubImage = !1, i;
    }
    return e.crossOrigin = function(t, i, n) {
      n === void 0 && i.indexOf("data:") !== 0 ? t.crossOrigin = nv(i) : n !== !1 && (t.crossOrigin = typeof n == "string" ? n : "anonymous");
    }, e.prototype.upload = function(t, i, n, o) {
      var s = t.gl, a = i.realWidth, h = i.realHeight;
      if (o = o || this.source, o instanceof HTMLImageElement) {
        if (!o.complete || o.naturalWidth === 0)
          return !1;
      } else if (o instanceof HTMLVideoElement && o.readyState <= 1)
        return !1;
      return s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === te.UNPACK), !this.noSubImage && i.target === s.TEXTURE_2D && n.width === a && n.height === h ? s.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, i.format, n.type, o) : (n.width = a, n.height = h, s.texImage2D(i.target, 0, n.internalFormat, i.format, n.type, o)), !0;
    }, e.prototype.update = function() {
      if (!this.destroyed) {
        var t = this.source, i = t.naturalWidth || t.videoWidth || t.width, n = t.naturalHeight || t.videoHeight || t.height;
        this.resize(i, n), r.prototype.update.call(this);
      }
    }, e.prototype.dispose = function() {
      this.source = null;
    }, e;
  }(yi)
), yv = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      return r.call(this, t) || this;
    }
    return e.test = function(t) {
      var i = globalThis.OffscreenCanvas;
      return i && t instanceof i ? !0 : globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement;
    }, e;
  }(Fe)
), _v = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      var n = this, o = i || {}, s = o.width, a = o.height, h = o.autoLoad, u = o.linkBaseTexture;
      if (t && t.length !== e.SIDES)
        throw new Error("Invalid length. Got " + t.length + ", expected 6");
      n = r.call(this, 6, { width: s, height: a }) || this;
      for (var l = 0; l < e.SIDES; l++)
        n.items[l].target = tr.TEXTURE_CUBE_MAP_POSITIVE_X + l;
      return n.linkBaseTexture = u !== !1, t && n.initFromArray(t, i), h !== !1 && n.load(), n;
    }
    return e.prototype.bind = function(t) {
      r.prototype.bind.call(this, t), t.target = tr.TEXTURE_CUBE_MAP;
    }, e.prototype.addBaseTextureAt = function(t, i, n) {
      if (!this.items[i])
        throw new Error("Index " + i + " is out of bounds");
      if (!this.linkBaseTexture || t.parentTextureArray || Object.keys(t._glTextures).length > 0)
        if (t.resource)
          this.addResourceAt(t.resource, i);
        else
          throw new Error("CubeResource does not support copying of renderTexture.");
      else
        t.target = tr.TEXTURE_CUBE_MAP_POSITIVE_X + i, t.parentTextureArray = this.baseTexture, this.items[i] = t;
      return t.valid && !this.valid && this.resize(t.realWidth, t.realHeight), this.items[i] = t, this;
    }, e.prototype.upload = function(t, i, n) {
      for (var o = this.itemDirtyIds, s = 0; s < e.SIDES; s++) {
        var a = this.items[s];
        (o[s] < a.dirtyId || n.dirtyId < i.dirtyId) && (a.valid && a.resource ? (a.resource.upload(t, a, n), o[s] = a.dirtyId) : o[s] < -1 && (t.gl.texImage2D(a.target, 0, n.internalFormat, i.realWidth, i.realHeight, 0, i.format, n.type, null), o[s] = -1));
      }
      return !0;
    }, e.test = function(t) {
      return Array.isArray(t) && t.length === e.SIDES;
    }, e.SIDES = 6, e;
  }(Ml)
), Il = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      var n = this;
      if (i = i || {}, !(t instanceof HTMLImageElement)) {
        var o = new Image();
        Fe.crossOrigin(o, t, i.crossorigin), o.src = t, t = o;
      }
      return n = r.call(this, t) || this, !t.complete && n._width && n._height && (n._width = 0, n._height = 0), n.url = t.src, n._process = null, n.preserveBitmap = !1, n.createBitmap = (i.createBitmap !== void 0 ? i.createBitmap : G.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap, n.alphaMode = typeof i.alphaMode == "number" ? i.alphaMode : null, n.bitmap = null, n._load = null, i.autoLoad !== !1 && n.load(), n;
    }
    return e.prototype.load = function(t) {
      var i = this;
      return this._load ? this._load : (t !== void 0 && (this.createBitmap = t), this._load = new Promise(function(n, o) {
        var s = i.source;
        i.url = s.src;
        var a = function() {
          i.destroyed || (s.onload = null, s.onerror = null, i.resize(s.width, s.height), i._load = null, i.createBitmap ? n(i.process()) : n(i));
        };
        s.complete && s.src ? a() : (s.onload = a, s.onerror = function(h) {
          o(h), i.onError.emit(h);
        });
      }), this._load);
    }, e.prototype.process = function() {
      var t = this, i = this.source;
      if (this._process !== null)
        return this._process;
      if (this.bitmap !== null || !globalThis.createImageBitmap)
        return Promise.resolve(this);
      var n = globalThis.createImageBitmap, o = !i.crossOrigin || i.crossOrigin === "anonymous";
      return this._process = fetch(i.src, {
        mode: o ? "cors" : "no-cors"
      }).then(function(s) {
        return s.blob();
      }).then(function(s) {
        return n(s, 0, 0, i.width, i.height, {
          premultiplyAlpha: t.alphaMode === null || t.alphaMode === te.UNPACK ? "premultiply" : "none"
        });
      }).then(function(s) {
        return t.destroyed ? Promise.reject() : (t.bitmap = s, t.update(), t._process = null, Promise.resolve(t));
      }), this._process;
    }, e.prototype.upload = function(t, i, n) {
      if (typeof this.alphaMode == "number" && (i.alphaMode = this.alphaMode), !this.createBitmap)
        return r.prototype.upload.call(this, t, i, n);
      if (!this.bitmap && (this.process(), !this.bitmap))
        return !1;
      if (r.prototype.upload.call(this, t, i, n, this.bitmap), !this.preserveBitmap) {
        var o = !0, s = i._glTextures;
        for (var a in s) {
          var h = s[a];
          if (h !== n && h.dirtyId !== i.dirtyId) {
            o = !1;
            break;
          }
        }
        o && (this.bitmap.close && this.bitmap.close(), this.bitmap = null);
      }
      return !0;
    }, e.prototype.dispose = function() {
      this.source.onload = null, this.source.onerror = null, r.prototype.dispose.call(this), this.bitmap && (this.bitmap.close(), this.bitmap = null), this._process = null, this._load = null;
    }, e.test = function(t) {
      return typeof t == "string" || t instanceof HTMLImageElement;
    }, e;
  }(Fe)
), gv = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      var n = this;
      return i = i || {}, n = r.call(this, G.ADAPTER.createCanvas()) || this, n._width = 0, n._height = 0, n.svg = t, n.scale = i.scale || 1, n._overrideWidth = i.width, n._overrideHeight = i.height, n._resolve = null, n._crossorigin = i.crossorigin, n._load = null, i.autoLoad !== !1 && n.load(), n;
    }
    return e.prototype.load = function() {
      var t = this;
      return this._load ? this._load : (this._load = new Promise(function(i) {
        if (t._resolve = function() {
          t.resize(t.source.width, t.source.height), i(t);
        }, e.SVG_XML.test(t.svg.trim())) {
          if (!btoa)
            throw new Error("Your browser doesn't support base64 conversions.");
          t.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(t.svg)));
        }
        t._loadSvg();
      }), this._load);
    }, e.prototype._loadSvg = function() {
      var t = this, i = new Image();
      Fe.crossOrigin(i, this.svg, this._crossorigin), i.src = this.svg, i.onerror = function(n) {
        t._resolve && (i.onerror = null, t.onError.emit(n));
      }, i.onload = function() {
        if (t._resolve) {
          var n = i.width, o = i.height;
          if (!n || !o)
            throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
          var s = n * t.scale, a = o * t.scale;
          (t._overrideWidth || t._overrideHeight) && (s = t._overrideWidth || t._overrideHeight / o * n, a = t._overrideHeight || t._overrideWidth / n * o), s = Math.round(s), a = Math.round(a);
          var h = t.source;
          h.width = s, h.height = a, h._pixiId = "canvas_" + sr(), h.getContext("2d").drawImage(i, 0, 0, n, o, 0, 0, s, a), t._resolve(), t._resolve = null;
        }
      };
    }, e.getSize = function(t) {
      var i = e.SVG_SIZE.exec(t), n = {};
      return i && (n[i[1]] = Math.round(parseFloat(i[3])), n[i[5]] = Math.round(parseFloat(i[7]))), n;
    }, e.prototype.dispose = function() {
      r.prototype.dispose.call(this), this._resolve = null, this._crossorigin = null;
    }, e.test = function(t, i) {
      return i === "svg" || typeof t == "string" && t.startsWith("data:image/svg+xml") || typeof t == "string" && e.SVG_XML.test(t);
    }, e.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m, e.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i, e;
  }(Fe)
), vv = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      var n = this;
      if (i = i || {}, !(t instanceof HTMLVideoElement)) {
        var o = document.createElement("video");
        o.setAttribute("preload", "auto"), o.setAttribute("webkit-playsinline", ""), o.setAttribute("playsinline", ""), typeof t == "string" && (t = [t]);
        var s = t[0].src || t[0];
        Fe.crossOrigin(o, s, i.crossorigin);
        for (var a = 0; a < t.length; ++a) {
          var h = document.createElement("source"), u = t[a], l = u.src, c = u.mime;
          l = l || t[a];
          var d = l.split("?").shift().toLowerCase(), f = d.slice(d.lastIndexOf(".") + 1);
          c = c || e.MIME_TYPES[f] || "video/" + f, h.src = l, h.type = c, o.appendChild(h);
        }
        t = o;
      }
      return n = r.call(this, t) || this, n.noSubImage = !0, n._autoUpdate = !0, n._isConnectedToTicker = !1, n._updateFPS = i.updateFPS || 0, n._msToNextUpdate = 0, n.autoPlay = i.autoPlay !== !1, n._load = null, n._resolve = null, n._onCanPlay = n._onCanPlay.bind(n), n._onError = n._onError.bind(n), i.autoLoad !== !1 && n.load(), n;
    }
    return e.prototype.update = function(t) {
      if (!this.destroyed) {
        var i = Ft.shared.elapsedMS * this.source.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - i), (!this._updateFPS || this._msToNextUpdate <= 0) && (r.prototype.update.call(this), this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0);
      }
    }, e.prototype.load = function() {
      var t = this;
      if (this._load)
        return this._load;
      var i = this.source;
      return (i.readyState === i.HAVE_ENOUGH_DATA || i.readyState === i.HAVE_FUTURE_DATA) && i.width && i.height && (i.complete = !0), i.addEventListener("play", this._onPlayStart.bind(this)), i.addEventListener("pause", this._onPlayStop.bind(this)), this._isSourceReady() ? this._onCanPlay() : (i.addEventListener("canplay", this._onCanPlay), i.addEventListener("canplaythrough", this._onCanPlay), i.addEventListener("error", this._onError, !0)), this._load = new Promise(function(n) {
        t.valid ? n(t) : (t._resolve = n, i.load());
      }), this._load;
    }, e.prototype._onError = function(t) {
      this.source.removeEventListener("error", this._onError, !0), this.onError.emit(t);
    }, e.prototype._isSourcePlaying = function() {
      var t = this.source;
      return !t.paused && !t.ended && this._isSourceReady();
    }, e.prototype._isSourceReady = function() {
      var t = this.source;
      return t.readyState > 2;
    }, e.prototype._onPlayStart = function() {
      this.valid || this._onCanPlay(), this.autoUpdate && !this._isConnectedToTicker && (Ft.shared.add(this.update, this), this._isConnectedToTicker = !0);
    }, e.prototype._onPlayStop = function() {
      this._isConnectedToTicker && (Ft.shared.remove(this.update, this), this._isConnectedToTicker = !1);
    }, e.prototype._onCanPlay = function() {
      var t = this.source;
      t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlay);
      var i = this.valid;
      this.resize(t.videoWidth, t.videoHeight), !i && this._resolve && (this._resolve(this), this._resolve = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && t.play();
    }, e.prototype.dispose = function() {
      this._isConnectedToTicker && (Ft.shared.remove(this.update, this), this._isConnectedToTicker = !1);
      var t = this.source;
      t && (t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), r.prototype.dispose.call(this);
    }, Object.defineProperty(e.prototype, "autoUpdate", {
      /** Should the base texture automatically update itself, set to true by default. */
      get: function() {
        return this._autoUpdate;
      },
      set: function(t) {
        t !== this._autoUpdate && (this._autoUpdate = t, !this._autoUpdate && this._isConnectedToTicker ? (Ft.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying() && (Ft.shared.add(this.update, this), this._isConnectedToTicker = !0));
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "updateFPS", {
      /**
       * How many times a second to update the texture from the video. Leave at 0 to update at every render.
       * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
       */
      get: function() {
        return this._updateFPS;
      },
      set: function(t) {
        t !== this._updateFPS && (this._updateFPS = t);
      },
      enumerable: !1,
      configurable: !0
    }), e.test = function(t, i) {
      return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement || e.TYPES.indexOf(i) > -1;
    }, e.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"], e.MIME_TYPES = {
      ogv: "video/ogg",
      mov: "video/quicktime",
      m4v: "video/mp4"
    }, e;
  }(Fe)
), bv = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      return r.call(this, t) || this;
    }
    return e.test = function(t) {
      return !!globalThis.createImageBitmap && typeof ImageBitmap < "u" && t instanceof ImageBitmap;
    }, e;
  }(Fe)
);
cs.push(Il, bv, yv, vv, gv, Oi, _v, mv);
var xv = (
  /** @class */
  function(r) {
    pt(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.upload = function(t, i, n) {
      var o = t.gl;
      o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === te.UNPACK);
      var s = i.realWidth, a = i.realHeight;
      return n.width === s && n.height === a ? o.texSubImage2D(i.target, 0, 0, 0, s, a, i.format, n.type, this.data) : (n.width = s, n.height = a, o.texImage2D(i.target, 0, n.internalFormat, s, a, 0, i.format, n.type, this.data)), !0;
    }, e;
  }(Oi)
), ps = (
  /** @class */
  function() {
    function r(e, t) {
      this.width = Math.round(e || 100), this.height = Math.round(t || 100), this.stencil = !1, this.depth = !1, this.dirtyId = 0, this.dirtyFormat = 0, this.dirtySize = 0, this.depthTexture = null, this.colorTextures = [], this.glFramebuffers = {}, this.disposeRunner = new Nt("disposeFramebuffer"), this.multisample = gt.NONE;
    }
    return Object.defineProperty(r.prototype, "colorTexture", {
      /**
       * Reference to the colorTexture.
       * @readonly
       */
      get: function() {
        return this.colorTextures[0];
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.addColorTexture = function(e, t) {
      return e === void 0 && (e = 0), this.colorTextures[e] = t || new it(null, {
        scaleMode: se.NEAREST,
        resolution: 1,
        mipmap: Qt.OFF,
        width: this.width,
        height: this.height
      }), this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.addDepthTexture = function(e) {
      return this.depthTexture = e || new it(new xv(null, { width: this.width, height: this.height }), {
        scaleMode: se.NEAREST,
        resolution: 1,
        width: this.width,
        height: this.height,
        mipmap: Qt.OFF,
        format: N.DEPTH_COMPONENT,
        type: k.UNSIGNED_SHORT
      }), this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.enableDepth = function() {
      return this.depth = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.enableStencil = function() {
      return this.stencil = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.resize = function(e, t) {
      if (e = Math.round(e), t = Math.round(t), !(e === this.width && t === this.height)) {
        this.width = e, this.height = t, this.dirtyId++, this.dirtySize++;
        for (var i = 0; i < this.colorTextures.length; i++) {
          var n = this.colorTextures[i], o = n.resolution;
          n.setSize(e / o, t / o);
        }
        if (this.depthTexture) {
          var o = this.depthTexture.resolution;
          this.depthTexture.setSize(e / o, t / o);
        }
      }
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroyDepthTexture = function() {
      this.depthTexture && (this.depthTexture.destroy(), this.depthTexture = null, ++this.dirtyId, ++this.dirtyFormat);
    }, r;
  }()
), Dl = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      t === void 0 && (t = {});
      var i = this;
      if (typeof t == "number") {
        var n = arguments[0], o = arguments[1], s = arguments[2], a = arguments[3];
        t = { width: n, height: o, scaleMode: s, resolution: a };
      }
      return t.width = t.width || 100, t.height = t.height || 100, t.multisample = t.multisample !== void 0 ? t.multisample : gt.NONE, i = r.call(this, null, t) || this, i.mipmap = Qt.OFF, i.valid = !0, i.clearColor = [0, 0, 0, 0], i.framebuffer = new ps(i.realWidth, i.realHeight).addColorTexture(0, i), i.framebuffer.multisample = t.multisample, i.maskStack = [], i.filterStack = [{}], i;
    }
    return e.prototype.resize = function(t, i) {
      this.framebuffer.resize(t * this.resolution, i * this.resolution), this.setRealSize(this.framebuffer.width, this.framebuffer.height);
    }, e.prototype.dispose = function() {
      this.framebuffer.dispose(), r.prototype.dispose.call(this);
    }, e.prototype.destroy = function() {
      r.prototype.destroy.call(this), this.framebuffer.destroyDepthTexture(), this.framebuffer = null;
    }, e;
  }(it)
), Cl = (
  /** @class */
  function() {
    function r() {
      this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsFloat32 = new Float32Array(8);
    }
    return r.prototype.set = function(e, t, i) {
      var n = t.width, o = t.height;
      if (i) {
        var s = e.width / 2 / n, a = e.height / 2 / o, h = e.x / n + s, u = e.y / o + a;
        i = bt.add(i, bt.NW), this.x0 = h + s * bt.uX(i), this.y0 = u + a * bt.uY(i), i = bt.add(i, 2), this.x1 = h + s * bt.uX(i), this.y1 = u + a * bt.uY(i), i = bt.add(i, 2), this.x2 = h + s * bt.uX(i), this.y2 = u + a * bt.uY(i), i = bt.add(i, 2), this.x3 = h + s * bt.uX(i), this.y3 = u + a * bt.uY(i);
      } else
        this.x0 = e.x / n, this.y0 = e.y / o, this.x1 = (e.x + e.width) / n, this.y1 = e.y / o, this.x2 = (e.x + e.width) / n, this.y2 = (e.y + e.height) / o, this.x3 = e.x / n, this.y3 = (e.y + e.height) / o;
      this.uvsFloat32[0] = this.x0, this.uvsFloat32[1] = this.y0, this.uvsFloat32[2] = this.x1, this.uvsFloat32[3] = this.y1, this.uvsFloat32[4] = this.x2, this.uvsFloat32[5] = this.y2, this.uvsFloat32[6] = this.x3, this.uvsFloat32[7] = this.y3;
    }, r.prototype.toString = function() {
      return "[@pixi/core:TextureUvs " + ("x0=" + this.x0 + " y0=" + this.y0 + " ") + ("x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " ") + ("y2=" + this.y2 + " x3=" + this.x3 + " y3=" + this.y3) + "]";
    }, r;
  }()
), Nh = new Cl();
function Hi(r) {
  r.destroy = function() {
  }, r.on = function() {
  }, r.once = function() {
  }, r.emit = function() {
  };
}
var $ = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i, n, o, s, a) {
      var h = r.call(this) || this;
      if (h.noFrame = !1, i || (h.noFrame = !0, i = new nt(0, 0, 1, 1)), t instanceof e && (t = t.baseTexture), h.baseTexture = t, h._frame = i, h.trim = o, h.valid = !1, h._uvs = Nh, h.uvMatrix = null, h.orig = n || i, h._rotate = Number(s || 0), s === !0)
        h._rotate = 2;
      else if (h._rotate % 2 !== 0)
        throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
      return h.defaultAnchor = a ? new yt(a.x, a.y) : new yt(0, 0), h._updateID = 0, h.textureCacheIds = [], t.valid ? h.noFrame ? t.valid && h.onBaseTextureUpdated(t) : h.frame = i : t.once("loaded", h.onBaseTextureUpdated, h), h.noFrame && t.on("update", h.onBaseTextureUpdated, h), h;
    }
    return e.prototype.update = function() {
      this.baseTexture.resource && this.baseTexture.resource.update();
    }, e.prototype.onBaseTextureUpdated = function(t) {
      if (this.noFrame) {
        if (!this.baseTexture.valid)
          return;
        this._frame.width = t.width, this._frame.height = t.height, this.valid = !0, this.updateUvs();
      } else
        this.frame = this._frame;
      this.emit("update", this);
    }, e.prototype.destroy = function(t) {
      if (this.baseTexture) {
        if (t) {
          var i = this.baseTexture.resource;
          i && i.url && pe[i.url] && e.removeFromCache(i.url), this.baseTexture.destroy();
        }
        this.baseTexture.off("loaded", this.onBaseTextureUpdated, this), this.baseTexture.off("update", this.onBaseTextureUpdated, this), this.baseTexture = null;
      }
      this._frame = null, this._uvs = null, this.trim = null, this.orig = null, this.valid = !1, e.removeFromCache(this), this.textureCacheIds = null;
    }, e.prototype.clone = function() {
      var t = this._frame.clone(), i = this._frame === this.orig ? t : this.orig.clone(), n = new e(this.baseTexture, !this.noFrame && t, i, this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
      return this.noFrame && (n._frame = t), n;
    }, e.prototype.updateUvs = function() {
      this._uvs === Nh && (this._uvs = new Cl()), this._uvs.set(this._frame, this.baseTexture, this.rotate), this._updateID++;
    }, e.from = function(t, i, n) {
      i === void 0 && (i = {}), n === void 0 && (n = G.STRICT_TEXTURE_CACHE);
      var o = typeof t == "string", s = null;
      if (o)
        s = t;
      else if (t instanceof it) {
        if (!t.cacheId) {
          var a = i && i.pixiIdPrefix || "pixiid";
          t.cacheId = a + "-" + sr(), it.addToCache(t, t.cacheId);
        }
        s = t.cacheId;
      } else {
        if (!t._pixiId) {
          var a = i && i.pixiIdPrefix || "pixiid";
          t._pixiId = a + "_" + sr();
        }
        s = t._pixiId;
      }
      var h = pe[s];
      if (o && n && !h)
        throw new Error('The cacheId "' + s + '" does not exist in TextureCache.');
      return !h && !(t instanceof it) ? (i.resolution || (i.resolution = Mn(t)), h = new e(new it(t, i)), h.baseTexture.cacheId = s, it.addToCache(h.baseTexture, s), e.addToCache(h, s)) : !h && t instanceof it && (h = new e(t), e.addToCache(h, s)), h;
    }, e.fromURL = function(t, i) {
      var n = Object.assign({ autoLoad: !1 }, i == null ? void 0 : i.resourceOptions), o = e.from(t, Object.assign({ resourceOptions: n }, i), !1), s = o.baseTexture.resource;
      return o.baseTexture.valid ? Promise.resolve(o) : s.load().then(function() {
        return Promise.resolve(o);
      });
    }, e.fromBuffer = function(t, i, n, o) {
      return new e(it.fromBuffer(t, i, n, o));
    }, e.fromLoader = function(t, i, n, o) {
      var s = new it(t, Object.assign({
        scaleMode: G.SCALE_MODE,
        resolution: Mn(i)
      }, o)), a = s.resource;
      a instanceof Il && (a.url = i);
      var h = new e(s);
      return n || (n = i), it.addToCache(h.baseTexture, n), e.addToCache(h, n), n !== i && (it.addToCache(h.baseTexture, i), e.addToCache(h, i)), h.baseTexture.valid ? Promise.resolve(h) : new Promise(function(u) {
        h.baseTexture.once("loaded", function() {
          return u(h);
        });
      });
    }, e.addToCache = function(t, i) {
      i && (t.textureCacheIds.indexOf(i) === -1 && t.textureCacheIds.push(i), pe[i] && console.warn("Texture added to the cache with an id [" + i + "] that already had an entry"), pe[i] = t);
    }, e.removeFromCache = function(t) {
      if (typeof t == "string") {
        var i = pe[t];
        if (i) {
          var n = i.textureCacheIds.indexOf(t);
          return n > -1 && i.textureCacheIds.splice(n, 1), delete pe[t], i;
        }
      } else if (t && t.textureCacheIds) {
        for (var o = 0; o < t.textureCacheIds.length; ++o)
          pe[t.textureCacheIds[o]] === t && delete pe[t.textureCacheIds[o]];
        return t.textureCacheIds.length = 0, t;
      }
      return null;
    }, Object.defineProperty(e.prototype, "resolution", {
      /**
       * Returns resolution of baseTexture
       * @readonly
       */
      get: function() {
        return this.baseTexture.resolution;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "frame", {
      /**
       * The frame specifies the region of the base texture that this texture uses.
       * Please call `updateUvs()` after you change coordinates of `frame` manually.
       */
      get: function() {
        return this._frame;
      },
      set: function(t) {
        this._frame = t, this.noFrame = !1;
        var i = t.x, n = t.y, o = t.width, s = t.height, a = i + o > this.baseTexture.width, h = n + s > this.baseTexture.height;
        if (a || h) {
          var u = a && h ? "and" : "or", l = "X: " + i + " + " + o + " = " + (i + o) + " > " + this.baseTexture.width, c = "Y: " + n + " + " + s + " = " + (n + s) + " > " + this.baseTexture.height;
          throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + (l + " " + u + " " + c));
        }
        this.valid = o && s && this.baseTexture.valid, !this.trim && !this.rotate && (this.orig = t), this.valid && this.updateUvs();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "rotate", {
      /**
       * Indicates whether the texture is rotated inside the atlas
       * set to 2 to compensate for texture packer rotation
       * set to 6 to compensate for spine packer rotation
       * can be used to rotate or mirror sprites
       * See {@link PIXI.groupD8} for explanation
       */
      get: function() {
        return this._rotate;
      },
      set: function(t) {
        this._rotate = t, this.valid && this.updateUvs();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "width", {
      /** The width of the Texture in pixels. */
      get: function() {
        return this.orig.width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /** The height of the Texture in pixels. */
      get: function() {
        return this.orig.height;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.castToBaseTexture = function() {
      return this.baseTexture;
    }, Object.defineProperty(e, "EMPTY", {
      /** An empty texture, used often to not have to create multiple empty textures. Can not be destroyed. */
      get: function() {
        return e._EMPTY || (e._EMPTY = new e(new it()), Hi(e._EMPTY), Hi(e._EMPTY.baseTexture)), e._EMPTY;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e, "WHITE", {
      /** A white texture of 16x16 size, used for graphics and other things Can not be destroyed. */
      get: function() {
        if (!e._WHITE) {
          var t = G.ADAPTER.createCanvas(16, 16), i = t.getContext("2d");
          t.width = 16, t.height = 16, i.fillStyle = "white", i.fillRect(0, 0, 16, 16), e._WHITE = new e(it.from(t)), Hi(e._WHITE), Hi(e._WHITE.baseTexture);
        }
        return e._WHITE;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(Si)
), ar = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      var n = r.call(this, t, i) || this;
      return n.valid = !0, n.filterFrame = null, n.filterPoolKey = null, n.updateUvs(), n;
    }
    return Object.defineProperty(e.prototype, "framebuffer", {
      /**
       * Shortcut to `this.baseTexture.framebuffer`, saves baseTexture cast.
       * @readonly
       */
      get: function() {
        return this.baseTexture.framebuffer;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "multisample", {
      /**
       * Shortcut to `this.framebuffer.multisample`.
       * @default PIXI.MSAA_QUALITY.NONE
       */
      get: function() {
        return this.framebuffer.multisample;
      },
      set: function(t) {
        this.framebuffer.multisample = t;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.resize = function(t, i, n) {
      n === void 0 && (n = !0);
      var o = this.baseTexture.resolution, s = Math.round(t * o) / o, a = Math.round(i * o) / o;
      this.valid = s > 0 && a > 0, this._frame.width = this.orig.width = s, this._frame.height = this.orig.height = a, n && this.baseTexture.resize(s, a), this.updateUvs();
    }, e.prototype.setResolution = function(t) {
      var i = this.baseTexture;
      i.resolution !== t && (i.setResolution(t), this.resize(i.width, i.height, !1));
    }, e.create = function(t) {
      for (var i = arguments, n = [], o = 1; o < arguments.length; o++)
        n[o - 1] = i[o];
      return typeof t == "number" && (Jt("6.0.0", "Arguments (width, height, scaleMode, resolution) have been deprecated."), t = {
        width: t,
        height: n[0],
        scaleMode: n[1],
        resolution: n[2]
      }), new e(new Dl(t));
    }, e;
  }($)
), Tv = (
  /** @class */
  function() {
    function r(e) {
      this.texturePool = {}, this.textureOptions = e || {}, this.enableFullScreen = !1, this._pixelsWidth = 0, this._pixelsHeight = 0;
    }
    return r.prototype.createTexture = function(e, t, i) {
      i === void 0 && (i = gt.NONE);
      var n = new Dl(Object.assign({
        width: e,
        height: t,
        resolution: 1,
        multisample: i
      }, this.textureOptions));
      return new ar(n);
    }, r.prototype.getOptimalTexture = function(e, t, i, n) {
      i === void 0 && (i = 1), n === void 0 && (n = gt.NONE);
      var o;
      e = Math.ceil(e * i - 1e-6), t = Math.ceil(t * i - 1e-6), !this.enableFullScreen || e !== this._pixelsWidth || t !== this._pixelsHeight ? (e = Pn(e), t = Pn(t), o = ((e & 65535) << 16 | t & 65535) >>> 0, n > 1 && (o += n * 4294967296)) : o = n > 1 ? -n : -1, this.texturePool[o] || (this.texturePool[o] = []);
      var s = this.texturePool[o].pop();
      return s || (s = this.createTexture(e, t, n)), s.filterPoolKey = o, s.setResolution(i), s;
    }, r.prototype.getFilterTexture = function(e, t, i) {
      var n = this.getOptimalTexture(e.width, e.height, t || e.resolution, i || gt.NONE);
      return n.filterFrame = e.filterFrame, n;
    }, r.prototype.returnTexture = function(e) {
      var t = e.filterPoolKey;
      e.filterFrame = null, this.texturePool[t].push(e);
    }, r.prototype.returnFilterTexture = function(e) {
      this.returnTexture(e);
    }, r.prototype.clear = function(e) {
      if (e = e !== !1, e)
        for (var t in this.texturePool) {
          var i = this.texturePool[t];
          if (i)
            for (var n = 0; n < i.length; n++)
              i[n].destroy(!0);
        }
      this.texturePool = {};
    }, r.prototype.setScreenSize = function(e) {
      if (!(e.width === this._pixelsWidth && e.height === this._pixelsHeight)) {
        this.enableFullScreen = e.width > 0 && e.height > 0;
        for (var t in this.texturePool)
          if (Number(t) < 0) {
            var i = this.texturePool[t];
            if (i)
              for (var n = 0; n < i.length; n++)
                i[n].destroy(!0);
            this.texturePool[t] = [];
          }
        this._pixelsWidth = e.width, this._pixelsHeight = e.height;
      }
    }, r.SCREEN_KEY = -1, r;
  }()
), Fh = (
  /** @class */
  function() {
    function r(e, t, i, n, o, s, a) {
      t === void 0 && (t = 0), i === void 0 && (i = !1), n === void 0 && (n = k.FLOAT), this.buffer = e, this.size = t, this.normalized = i, this.type = n, this.stride = o, this.start = s, this.instance = a;
    }
    return r.prototype.destroy = function() {
      this.buffer = null;
    }, r.from = function(e, t, i, n, o) {
      return new r(e, t, i, n, o);
    }, r;
  }()
), Ev = 0, Rt = (
  /** @class */
  function() {
    function r(e, t, i) {
      t === void 0 && (t = !0), i === void 0 && (i = !1), this.data = e || new Float32Array(1), this._glBuffers = {}, this._updateID = 0, this.index = i, this.static = t, this.id = Ev++, this.disposeRunner = new Nt("disposeBuffer");
    }
    return r.prototype.update = function(e) {
      e instanceof Array && (e = new Float32Array(e)), this.data = e || this.data, this._updateID++;
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroy = function() {
      this.dispose(), this.data = null;
    }, Object.defineProperty(r.prototype, "index", {
      get: function() {
        return this.type === ue.ELEMENT_ARRAY_BUFFER;
      },
      /**
       * Flags whether this is an index buffer.
       *
       * Index buffers are of type `ELEMENT_ARRAY_BUFFER`. Note that setting this property to false will make
       * the buffer of type `ARRAY_BUFFER`.
       *
       * For backwards compatibility.
       */
      set: function(e) {
        this.type = e ? ue.ELEMENT_ARRAY_BUFFER : ue.ARRAY_BUFFER;
      },
      enumerable: !1,
      configurable: !0
    }), r.from = function(e) {
      return e instanceof Array && (e = new Float32Array(e)), new r(e);
    }, r;
  }()
), Av = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array
};
function Sv(r, e) {
  for (var t = 0, i = 0, n = {}, o = 0; o < r.length; o++)
    i += e[o], t += r[o].length;
  for (var s = new ArrayBuffer(t * 4), a = null, h = 0, o = 0; o < r.length; o++) {
    var u = e[o], l = r[o], c = Sl(l);
    n[c] || (n[c] = new Av[c](s)), a = n[c];
    for (var d = 0; d < l.length; d++) {
      var f = (d / u | 0) * i + h, p = d % u;
      a[f + p] = l[d];
    }
    h += u;
  }
  return new Float32Array(s);
}
var Lh = { 5126: 4, 5123: 2, 5121: 1 }, wv = 0, Ov = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array,
  Uint16Array
}, Ri = (
  /** @class */
  function() {
    function r(e, t) {
      e === void 0 && (e = []), t === void 0 && (t = {}), this.buffers = e, this.indexBuffer = null, this.attributes = t, this.glVertexArrayObjects = {}, this.id = wv++, this.instanced = !1, this.instanceCount = 1, this.disposeRunner = new Nt("disposeGeometry"), this.refCount = 0;
    }
    return r.prototype.addAttribute = function(e, t, i, n, o, s, a, h) {
      if (i === void 0 && (i = 0), n === void 0 && (n = !1), h === void 0 && (h = !1), !t)
        throw new Error("You must pass a buffer when creating an attribute");
      t instanceof Rt || (t instanceof Array && (t = new Float32Array(t)), t = new Rt(t));
      var u = e.split("|");
      if (u.length > 1) {
        for (var l = 0; l < u.length; l++)
          this.addAttribute(u[l], t, i, n, o);
        return this;
      }
      var c = this.buffers.indexOf(t);
      return c === -1 && (this.buffers.push(t), c = this.buffers.length - 1), this.attributes[e] = new Fh(c, i, n, o, s, a, h), this.instanced = this.instanced || h, this;
    }, r.prototype.getAttribute = function(e) {
      return this.attributes[e];
    }, r.prototype.getBuffer = function(e) {
      return this.buffers[this.getAttribute(e).buffer];
    }, r.prototype.addIndex = function(e) {
      return e instanceof Rt || (e instanceof Array && (e = new Uint16Array(e)), e = new Rt(e)), e.type = ue.ELEMENT_ARRAY_BUFFER, this.indexBuffer = e, this.buffers.indexOf(e) === -1 && this.buffers.push(e), this;
    }, r.prototype.getIndex = function() {
      return this.indexBuffer;
    }, r.prototype.interleave = function() {
      if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer)
        return this;
      var e = [], t = [], i = new Rt(), n;
      for (n in this.attributes) {
        var o = this.attributes[n], s = this.buffers[o.buffer];
        e.push(s.data), t.push(o.size * Lh[o.type] / 4), o.buffer = 0;
      }
      for (i.data = Sv(e, t), n = 0; n < this.buffers.length; n++)
        this.buffers[n] !== this.indexBuffer && this.buffers[n].destroy();
      return this.buffers = [i], this.indexBuffer && this.buffers.push(this.indexBuffer), this;
    }, r.prototype.getSize = function() {
      for (var e in this.attributes) {
        var t = this.attributes[e], i = this.buffers[t.buffer];
        return i.data.length / (t.stride / 4 || t.size);
      }
      return 0;
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroy = function() {
      this.dispose(), this.buffers = null, this.indexBuffer = null, this.attributes = null;
    }, r.prototype.clone = function() {
      for (var e = new r(), t = 0; t < this.buffers.length; t++)
        e.buffers[t] = new Rt(this.buffers[t].data.slice(0));
      for (var t in this.attributes) {
        var i = this.attributes[t];
        e.attributes[t] = new Fh(i.buffer, i.size, i.normalized, i.type, i.stride, i.start, i.instance);
      }
      return this.indexBuffer && (e.indexBuffer = e.buffers[this.buffers.indexOf(this.indexBuffer)], e.indexBuffer.type = ue.ELEMENT_ARRAY_BUFFER), e;
    }, r.merge = function(e) {
      for (var t = new r(), i = [], n = [], o = [], s, a = 0; a < e.length; a++) {
        s = e[a];
        for (var h = 0; h < s.buffers.length; h++)
          n[h] = n[h] || 0, n[h] += s.buffers[h].data.length, o[h] = 0;
      }
      for (var a = 0; a < s.buffers.length; a++)
        i[a] = new Ov[Sl(s.buffers[a].data)](n[a]), t.buffers[a] = new Rt(i[a]);
      for (var a = 0; a < e.length; a++) {
        s = e[a];
        for (var h = 0; h < s.buffers.length; h++)
          i[h].set(s.buffers[h].data, o[h]), o[h] += s.buffers[h].data.length;
      }
      if (t.attributes = s.attributes, s.indexBuffer) {
        t.indexBuffer = t.buffers[s.buffers.indexOf(s.indexBuffer)], t.indexBuffer.type = ue.ELEMENT_ARRAY_BUFFER;
        for (var u = 0, l = 0, c = 0, d = 0, a = 0; a < s.buffers.length; a++)
          if (s.buffers[a] !== s.indexBuffer) {
            d = a;
            break;
          }
        for (var a in s.attributes) {
          var f = s.attributes[a];
          (f.buffer | 0) === d && (l += f.size * Lh[f.type] / 4);
        }
        for (var a = 0; a < e.length; a++) {
          for (var p = e[a].indexBuffer.data, h = 0; h < p.length; h++)
            t.indexBuffer.data[h + c] += u;
          u += e[a].buffers[d].data.length / l, c += p.length;
        }
      }
      return t;
    }, r;
  }()
), Rv = (
  /** @class */
  function(r) {
    pt(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.addAttribute("aVertexPosition", new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1
      ])).addIndex([0, 1, 3, 2]), t;
    }
    return e;
  }(Ri)
), Nl = (
  /** @class */
  function(r) {
    pt(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.vertices = new Float32Array([
        -1,
        -1,
        1,
        -1,
        1,
        1,
        -1,
        1
      ]), t.uvs = new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1
      ]), t.vertexBuffer = new Rt(t.vertices), t.uvBuffer = new Rt(t.uvs), t.addAttribute("aVertexPosition", t.vertexBuffer).addAttribute("aTextureCoord", t.uvBuffer).addIndex([0, 1, 2, 0, 2, 3]), t;
    }
    return e.prototype.map = function(t, i) {
      var n = 0, o = 0;
      return this.uvs[0] = n, this.uvs[1] = o, this.uvs[2] = n + i.width / t.width, this.uvs[3] = o, this.uvs[4] = n + i.width / t.width, this.uvs[5] = o + i.height / t.height, this.uvs[6] = n, this.uvs[7] = o + i.height / t.height, n = i.x, o = i.y, this.vertices[0] = n, this.vertices[1] = o, this.vertices[2] = n + i.width, this.vertices[3] = o, this.vertices[4] = n + i.width, this.vertices[5] = o + i.height, this.vertices[6] = n, this.vertices[7] = o + i.height, this.invalidate(), this;
    }, e.prototype.invalidate = function() {
      return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
    }, e;
  }(Ri)
), Pv = 0, ir = (
  /** @class */
  function() {
    function r(e, t, i) {
      this.group = !0, this.syncUniforms = {}, this.dirtyId = 0, this.id = Pv++, this.static = !!t, this.ubo = !!i, e instanceof Rt ? (this.buffer = e, this.buffer.type = ue.UNIFORM_BUFFER, this.autoManage = !1, this.ubo = !0) : (this.uniforms = e, this.ubo && (this.buffer = new Rt(new Float32Array(1)), this.buffer.type = ue.UNIFORM_BUFFER, this.autoManage = !0));
    }
    return r.prototype.update = function() {
      this.dirtyId++, !this.autoManage && this.buffer && this.buffer.update();
    }, r.prototype.add = function(e, t, i) {
      if (!this.ubo)
        this.uniforms[e] = new r(t, i);
      else
        throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
    }, r.from = function(e, t, i) {
      return new r(e, t, i);
    }, r.uboFrom = function(e, t) {
      return new r(e, t ?? !0, !0);
    }, r;
  }()
), Mv = (
  /** @class */
  function() {
    function r() {
      this.renderTexture = null, this.target = null, this.legacy = !1, this.resolution = 1, this.multisample = gt.NONE, this.sourceFrame = new nt(), this.destinationFrame = new nt(), this.bindingSourceFrame = new nt(), this.bindingDestinationFrame = new nt(), this.filters = [], this.transform = null;
    }
    return r.prototype.clear = function() {
      this.target = null, this.filters = null, this.renderTexture = null;
    }, r;
  }()
), Yi = [new yt(), new yt(), new yt(), new yt()], mo = new Pt(), Iv = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.defaultFilterStack = [{}], this.texturePool = new Tv(), this.texturePool.setScreenSize(e.view), this.statePool = [], this.quad = new Rv(), this.quadUv = new Nl(), this.tempRect = new nt(), this.activeState = {}, this.globalUniforms = new ir({
        outputFrame: new nt(),
        inputSize: new Float32Array(4),
        inputPixel: new Float32Array(4),
        inputClamp: new Float32Array(4),
        resolution: 1,
        // legacy variables
        filterArea: new Float32Array(4),
        filterClamp: new Float32Array(4)
      }, !0), this.forceClear = !1, this.useMaxPadding = !1;
    }
    return r.prototype.push = function(e, t) {
      for (var i, n, o = this.renderer, s = this.defaultFilterStack, a = this.statePool.pop() || new Mv(), h = this.renderer.renderTexture, u = t[0].resolution, l = t[0].multisample, c = t[0].padding, d = t[0].autoFit, f = (i = t[0].legacy) !== null && i !== void 0 ? i : !0, p = 1; p < t.length; p++) {
        var m = t[p];
        u = Math.min(u, m.resolution), l = Math.min(l, m.multisample), c = this.useMaxPadding ? Math.max(c, m.padding) : c + m.padding, d = d && m.autoFit, f = f || ((n = m.legacy) !== null && n !== void 0 ? n : !0);
      }
      s.length === 1 && (this.defaultFilterStack[0].renderTexture = h.current), s.push(a), a.resolution = u, a.multisample = l, a.legacy = f, a.target = e, a.sourceFrame.copyFrom(e.filterArea || e.getBounds(!0)), a.sourceFrame.pad(c);
      var y = this.tempRect.copyFrom(h.sourceFrame);
      o.projection.transform && this.transformAABB(mo.copyFrom(o.projection.transform).invert(), y), d ? (a.sourceFrame.fit(y), (a.sourceFrame.width <= 0 || a.sourceFrame.height <= 0) && (a.sourceFrame.width = 0, a.sourceFrame.height = 0)) : a.sourceFrame.intersects(y) || (a.sourceFrame.width = 0, a.sourceFrame.height = 0), this.roundFrame(a.sourceFrame, h.current ? h.current.resolution : o.resolution, h.sourceFrame, h.destinationFrame, o.projection.transform), a.renderTexture = this.getOptimalFilterTexture(a.sourceFrame.width, a.sourceFrame.height, u, l), a.filters = t, a.destinationFrame.width = a.renderTexture.width, a.destinationFrame.height = a.renderTexture.height;
      var _ = this.tempRect;
      _.x = 0, _.y = 0, _.width = a.sourceFrame.width, _.height = a.sourceFrame.height, a.renderTexture.filterFrame = a.sourceFrame, a.bindingSourceFrame.copyFrom(h.sourceFrame), a.bindingDestinationFrame.copyFrom(h.destinationFrame), a.transform = o.projection.transform, o.projection.transform = null, h.bind(a.renderTexture, a.sourceFrame, _), o.framebuffer.clear(0, 0, 0, 0);
    }, r.prototype.pop = function() {
      var e = this.defaultFilterStack, t = e.pop(), i = t.filters;
      this.activeState = t;
      var n = this.globalUniforms.uniforms;
      n.outputFrame = t.sourceFrame, n.resolution = t.resolution;
      var o = n.inputSize, s = n.inputPixel, a = n.inputClamp;
      if (o[0] = t.destinationFrame.width, o[1] = t.destinationFrame.height, o[2] = 1 / o[0], o[3] = 1 / o[1], s[0] = Math.round(o[0] * t.resolution), s[1] = Math.round(o[1] * t.resolution), s[2] = 1 / s[0], s[3] = 1 / s[1], a[0] = 0.5 * s[2], a[1] = 0.5 * s[3], a[2] = t.sourceFrame.width * o[2] - 0.5 * s[2], a[3] = t.sourceFrame.height * o[3] - 0.5 * s[3], t.legacy) {
        var h = n.filterArea;
        h[0] = t.destinationFrame.width, h[1] = t.destinationFrame.height, h[2] = t.sourceFrame.x, h[3] = t.sourceFrame.y, n.filterClamp = n.inputClamp;
      }
      this.globalUniforms.update();
      var u = e[e.length - 1];
      if (this.renderer.framebuffer.blit(), i.length === 1)
        i[0].apply(this, t.renderTexture, u.renderTexture, Wt.BLEND, t), this.returnFilterTexture(t.renderTexture);
      else {
        var l = t.renderTexture, c = this.getOptimalFilterTexture(l.width, l.height, t.resolution);
        c.filterFrame = l.filterFrame;
        var d = 0;
        for (d = 0; d < i.length - 1; ++d) {
          d === 1 && t.multisample > 1 && (c = this.getOptimalFilterTexture(l.width, l.height, t.resolution), c.filterFrame = l.filterFrame), i[d].apply(this, l, c, Wt.CLEAR, t);
          var f = l;
          l = c, c = f;
        }
        i[d].apply(this, l, u.renderTexture, Wt.BLEND, t), d > 1 && t.multisample > 1 && this.returnFilterTexture(t.renderTexture), this.returnFilterTexture(l), this.returnFilterTexture(c);
      }
      t.clear(), this.statePool.push(t);
    }, r.prototype.bindAndClear = function(e, t) {
      t === void 0 && (t = Wt.CLEAR);
      var i = this.renderer, n = i.renderTexture, o = i.state;
      if (e === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? this.renderer.projection.transform = this.activeState.transform : this.renderer.projection.transform = null, e && e.filterFrame) {
        var s = this.tempRect;
        s.x = 0, s.y = 0, s.width = e.filterFrame.width, s.height = e.filterFrame.height, n.bind(e, e.filterFrame, s);
      } else
        e !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? n.bind(e) : this.renderer.renderTexture.bind(e, this.activeState.bindingSourceFrame, this.activeState.bindingDestinationFrame);
      var a = o.stateId & 1 || this.forceClear;
      (t === Wt.CLEAR || t === Wt.BLIT && a) && this.renderer.framebuffer.clear(0, 0, 0, 0);
    }, r.prototype.applyFilter = function(e, t, i, n) {
      var o = this.renderer;
      o.state.set(e.state), this.bindAndClear(i, n), e.uniforms.uSampler = t, e.uniforms.filterGlobals = this.globalUniforms, o.shader.bind(e), e.legacy = !!e.program.attributeData.aTextureCoord, e.legacy ? (this.quadUv.map(t._frame, t.filterFrame), o.geometry.bind(this.quadUv), o.geometry.draw(qt.TRIANGLES)) : (o.geometry.bind(this.quad), o.geometry.draw(qt.TRIANGLE_STRIP));
    }, r.prototype.calculateSpriteMatrix = function(e, t) {
      var i = this.activeState, n = i.sourceFrame, o = i.destinationFrame, s = t._texture.orig, a = e.set(o.width, 0, 0, o.height, n.x, n.y), h = t.worldTransform.copyTo(Pt.TEMP_MATRIX);
      return h.invert(), a.prepend(h), a.scale(1 / s.width, 1 / s.height), a.translate(t.anchor.x, t.anchor.y), a;
    }, r.prototype.destroy = function() {
      this.renderer = null, this.texturePool.clear(!1);
    }, r.prototype.getOptimalFilterTexture = function(e, t, i, n) {
      return i === void 0 && (i = 1), n === void 0 && (n = gt.NONE), this.texturePool.getOptimalTexture(e, t, i, n);
    }, r.prototype.getFilterTexture = function(e, t, i) {
      if (typeof e == "number") {
        var n = e;
        e = t, t = n;
      }
      e = e || this.activeState.renderTexture;
      var o = this.texturePool.getOptimalTexture(e.width, e.height, t || e.resolution, i || gt.NONE);
      return o.filterFrame = e.filterFrame, o;
    }, r.prototype.returnFilterTexture = function(e) {
      this.texturePool.returnTexture(e);
    }, r.prototype.emptyPool = function() {
      this.texturePool.clear(!0);
    }, r.prototype.resize = function() {
      this.texturePool.setScreenSize(this.renderer.view);
    }, r.prototype.transformAABB = function(e, t) {
      var i = Yi[0], n = Yi[1], o = Yi[2], s = Yi[3];
      i.set(t.left, t.top), n.set(t.left, t.bottom), o.set(t.right, t.top), s.set(t.right, t.bottom), e.apply(i, i), e.apply(n, n), e.apply(o, o), e.apply(s, s);
      var a = Math.min(i.x, n.x, o.x, s.x), h = Math.min(i.y, n.y, o.y, s.y), u = Math.max(i.x, n.x, o.x, s.x), l = Math.max(i.y, n.y, o.y, s.y);
      t.x = a, t.y = h, t.width = u - a, t.height = l - h;
    }, r.prototype.roundFrame = function(e, t, i, n, o) {
      if (!(e.width <= 0 || e.height <= 0 || i.width <= 0 || i.height <= 0)) {
        if (o) {
          var s = o.a, a = o.b, h = o.c, u = o.d;
          if ((Math.abs(a) > 1e-4 || Math.abs(h) > 1e-4) && (Math.abs(s) > 1e-4 || Math.abs(u) > 1e-4))
            return;
        }
        o = o ? mo.copyFrom(o) : mo.identity(), o.translate(-i.x, -i.y).scale(n.width / i.width, n.height / i.height).translate(n.x, n.y), this.transformAABB(o, e), e.ceil(t), this.transformAABB(o.invert(), e);
      }
    }, r;
  }()
), jn = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e;
    }
    return r.prototype.flush = function() {
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r.prototype.start = function() {
    }, r.prototype.stop = function() {
      this.flush();
    }, r.prototype.render = function(e) {
    }, r;
  }()
), Dv = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.emptyRenderer = new jn(e), this.currentRenderer = this.emptyRenderer;
    }
    return r.prototype.setObjectRenderer = function(e) {
      this.currentRenderer !== e && (this.currentRenderer.stop(), this.currentRenderer = e, this.currentRenderer.start());
    }, r.prototype.flush = function() {
      this.setObjectRenderer(this.emptyRenderer);
    }, r.prototype.reset = function() {
      this.setObjectRenderer(this.emptyRenderer);
    }, r.prototype.copyBoundTextures = function(e, t) {
      for (var i = this.renderer.texture.boundTextures, n = t - 1; n >= 0; --n)
        e[n] = i[n] || null, e[n] && (e[n]._batchLocation = n);
    }, r.prototype.boundArray = function(e, t, i, n) {
      for (var o = e.elements, s = e.ids, a = e.count, h = 0, u = 0; u < a; u++) {
        var l = o[u], c = l._batchLocation;
        if (c >= 0 && c < n && t[c] === l) {
          s[u] = c;
          continue;
        }
        for (; h < n; ) {
          var d = t[h];
          if (d && d._batchEnabled === i && d._batchLocation === h) {
            h++;
            continue;
          }
          s[u] = h, l._batchLocation = h, t[h] = l;
          break;
        }
      }
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Bh = 0, Cv = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.webGLVersion = 1, this.extensions = {}, this.supports = {
        uint32Indices: !1
      }, this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this), e.view.addEventListener("webglcontextlost", this.handleContextLost, !1), e.view.addEventListener("webglcontextrestored", this.handleContextRestored, !1);
    }
    return Object.defineProperty(r.prototype, "isLost", {
      /**
       * `true` if the context is lost
       * @readonly
       */
      get: function() {
        return !this.gl || this.gl.isContextLost();
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.contextChange = function(e) {
      this.gl = e, this.renderer.gl = e, this.renderer.CONTEXT_UID = Bh++;
    }, r.prototype.initFromContext = function(e) {
      this.gl = e, this.validateContext(e), this.renderer.gl = e, this.renderer.CONTEXT_UID = Bh++, this.renderer.runners.contextChange.emit(e);
    }, r.prototype.initFromOptions = function(e) {
      var t = this.createContext(this.renderer.view, e);
      this.initFromContext(t);
    }, r.prototype.createContext = function(e, t) {
      var i;
      if (G.PREFER_ENV >= ve.WEBGL2 && (i = e.getContext("webgl2", t)), i)
        this.webGLVersion = 2;
      else if (this.webGLVersion = 1, i = e.getContext("webgl", t) || e.getContext("experimental-webgl", t), !i)
        throw new Error("This browser does not support WebGL. Try using the canvas renderer");
      return this.gl = i, this.getExtensions(), this.gl;
    }, r.prototype.getExtensions = function() {
      var e = this.gl, t = {
        loseContext: e.getExtension("WEBGL_lose_context"),
        anisotropicFiltering: e.getExtension("EXT_texture_filter_anisotropic"),
        floatTextureLinear: e.getExtension("OES_texture_float_linear"),
        s3tc: e.getExtension("WEBGL_compressed_texture_s3tc"),
        s3tc_sRGB: e.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
        etc: e.getExtension("WEBGL_compressed_texture_etc"),
        etc1: e.getExtension("WEBGL_compressed_texture_etc1"),
        pvrtc: e.getExtension("WEBGL_compressed_texture_pvrtc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
        atc: e.getExtension("WEBGL_compressed_texture_atc"),
        astc: e.getExtension("WEBGL_compressed_texture_astc")
      };
      this.webGLVersion === 1 ? Object.assign(this.extensions, t, {
        drawBuffers: e.getExtension("WEBGL_draw_buffers"),
        depthTexture: e.getExtension("WEBGL_depth_texture"),
        vertexArrayObject: e.getExtension("OES_vertex_array_object") || e.getExtension("MOZ_OES_vertex_array_object") || e.getExtension("WEBKIT_OES_vertex_array_object"),
        uint32ElementIndex: e.getExtension("OES_element_index_uint"),
        // Floats and half-floats
        floatTexture: e.getExtension("OES_texture_float"),
        floatTextureLinear: e.getExtension("OES_texture_float_linear"),
        textureHalfFloat: e.getExtension("OES_texture_half_float"),
        textureHalfFloatLinear: e.getExtension("OES_texture_half_float_linear")
      }) : this.webGLVersion === 2 && Object.assign(this.extensions, t, {
        // Floats and half-floats
        colorBufferFloat: e.getExtension("EXT_color_buffer_float")
      });
    }, r.prototype.handleContextLost = function(e) {
      var t = this;
      e.preventDefault(), setTimeout(function() {
        t.gl.isContextLost() && t.extensions.loseContext && t.extensions.loseContext.restoreContext();
      }, 0);
    }, r.prototype.handleContextRestored = function() {
      this.renderer.runners.contextChange.emit(this.gl);
    }, r.prototype.destroy = function() {
      var e = this.renderer.view;
      this.renderer = null, e.removeEventListener("webglcontextlost", this.handleContextLost), e.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), this.extensions.loseContext && this.extensions.loseContext.loseContext();
    }, r.prototype.postrender = function() {
      this.renderer.renderingToScreen && this.gl.flush();
    }, r.prototype.validateContext = function(e) {
      var t = e.getContextAttributes(), i = "WebGL2RenderingContext" in globalThis && e instanceof globalThis.WebGL2RenderingContext;
      i && (this.webGLVersion = 2), t && !t.stencil && console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
      var n = i || !!e.getExtension("OES_element_index_uint");
      this.supports.uint32Indices = n, n || console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
    }, r;
  }()
), Nv = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.framebuffer = e, this.stencil = null, this.dirtyId = -1, this.dirtyFormat = -1, this.dirtySize = -1, this.multisample = gt.NONE, this.msaaBuffer = null, this.blitFramebuffer = null, this.mipLevel = 0;
    }
    return r;
  }()
), Fv = new nt(), Lv = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.managedFramebuffers = [], this.unknownFramebuffer = new ps(10, 10), this.msaaSamples = null;
    }
    return r.prototype.contextChange = function() {
      this.disposeAll(!0);
      var e = this.gl = this.renderer.gl;
      if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.current = this.unknownFramebuffer, this.viewport = new nt(), this.hasMRT = !0, this.writeDepthTexture = !0, this.renderer.context.webGLVersion === 1) {
        var t = this.renderer.context.extensions.drawBuffers, i = this.renderer.context.extensions.depthTexture;
        G.PREFER_ENV === ve.WEBGL_LEGACY && (t = null, i = null), t ? e.drawBuffers = function(n) {
          return t.drawBuffersWEBGL(n);
        } : (this.hasMRT = !1, e.drawBuffers = function() {
        }), i || (this.writeDepthTexture = !1);
      } else
        this.msaaSamples = e.getInternalformatParameter(e.RENDERBUFFER, e.RGBA8, e.SAMPLES);
    }, r.prototype.bind = function(e, t, i) {
      i === void 0 && (i = 0);
      var n = this.gl;
      if (e) {
        var o = e.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(e);
        this.current !== e && (this.current = e, n.bindFramebuffer(n.FRAMEBUFFER, o.framebuffer)), o.mipLevel !== i && (e.dirtyId++, e.dirtyFormat++, o.mipLevel = i), o.dirtyId !== e.dirtyId && (o.dirtyId = e.dirtyId, o.dirtyFormat !== e.dirtyFormat ? (o.dirtyFormat = e.dirtyFormat, o.dirtySize = e.dirtySize, this.updateFramebuffer(e, i)) : o.dirtySize !== e.dirtySize && (o.dirtySize = e.dirtySize, this.resizeFramebuffer(e)));
        for (var s = 0; s < e.colorTextures.length; s++) {
          var a = e.colorTextures[s];
          this.renderer.texture.unbind(a.parentTextureArray || a);
        }
        if (e.depthTexture && this.renderer.texture.unbind(e.depthTexture), t) {
          var h = t.width >> i, u = t.height >> i, l = h / t.width;
          this.setViewport(t.x * l, t.y * l, h, u);
        } else {
          var h = e.width >> i, u = e.height >> i;
          this.setViewport(0, 0, h, u);
        }
      } else
        this.current && (this.current = null, n.bindFramebuffer(n.FRAMEBUFFER, null)), t ? this.setViewport(t.x, t.y, t.width, t.height) : this.setViewport(0, 0, this.renderer.width, this.renderer.height);
    }, r.prototype.setViewport = function(e, t, i, n) {
      var o = this.viewport;
      e = Math.round(e), t = Math.round(t), i = Math.round(i), n = Math.round(n), (o.width !== i || o.height !== n || o.x !== e || o.y !== t) && (o.x = e, o.y = t, o.width = i, o.height = n, this.gl.viewport(e, t, i, n));
    }, Object.defineProperty(r.prototype, "size", {
      /**
       * Get the size of the current width and height. Returns object with `width` and `height` values.
       * @readonly
       */
      get: function() {
        return this.current ? { x: 0, y: 0, width: this.current.width, height: this.current.height } : { x: 0, y: 0, width: this.renderer.width, height: this.renderer.height };
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.clear = function(e, t, i, n, o) {
      o === void 0 && (o = bn.COLOR | bn.DEPTH);
      var s = this.gl;
      s.clearColor(e, t, i, n), s.clear(o);
    }, r.prototype.initFramebuffer = function(e) {
      var t = this.gl, i = new Nv(t.createFramebuffer());
      return i.multisample = this.detectSamples(e.multisample), e.glFramebuffers[this.CONTEXT_UID] = i, this.managedFramebuffers.push(e), e.disposeRunner.add(this), i;
    }, r.prototype.resizeFramebuffer = function(e) {
      var t = this.gl, i = e.glFramebuffers[this.CONTEXT_UID];
      i.msaaBuffer && (t.bindRenderbuffer(t.RENDERBUFFER, i.msaaBuffer), t.renderbufferStorageMultisample(t.RENDERBUFFER, i.multisample, t.RGBA8, e.width, e.height)), i.stencil && (t.bindRenderbuffer(t.RENDERBUFFER, i.stencil), i.msaaBuffer ? t.renderbufferStorageMultisample(t.RENDERBUFFER, i.multisample, t.DEPTH24_STENCIL8, e.width, e.height) : t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_STENCIL, e.width, e.height));
      var n = e.colorTextures, o = n.length;
      t.drawBuffers || (o = Math.min(o, 1));
      for (var s = 0; s < o; s++) {
        var a = n[s], h = a.parentTextureArray || a;
        this.renderer.texture.bind(h, 0);
      }
      e.depthTexture && this.writeDepthTexture && this.renderer.texture.bind(e.depthTexture, 0);
    }, r.prototype.updateFramebuffer = function(e, t) {
      var i = this.gl, n = e.glFramebuffers[this.CONTEXT_UID], o = e.colorTextures, s = o.length;
      i.drawBuffers || (s = Math.min(s, 1)), n.multisample > 1 && this.canMultisampleFramebuffer(e) ? (n.msaaBuffer = n.msaaBuffer || i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, n.msaaBuffer), i.renderbufferStorageMultisample(i.RENDERBUFFER, n.multisample, i.RGBA8, e.width, e.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, n.msaaBuffer)) : n.msaaBuffer && (i.deleteRenderbuffer(n.msaaBuffer), n.msaaBuffer = null, n.blitFramebuffer && (n.blitFramebuffer.dispose(), n.blitFramebuffer = null));
      for (var a = [], h = 0; h < s; h++) {
        var u = o[h], l = u.parentTextureArray || u;
        this.renderer.texture.bind(l, 0), !(h === 0 && n.msaaBuffer) && (i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + h, u.target, l._glTextures[this.CONTEXT_UID].texture, t), a.push(i.COLOR_ATTACHMENT0 + h));
      }
      if (a.length > 1 && i.drawBuffers(a), e.depthTexture) {
        var c = this.writeDepthTexture;
        if (c) {
          var d = e.depthTexture;
          this.renderer.texture.bind(d, 0), i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, d._glTextures[this.CONTEXT_UID].texture, t);
        }
      }
      (e.stencil || e.depth) && !(e.depthTexture && this.writeDepthTexture) ? (n.stencil = n.stencil || i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, n.stencil), n.msaaBuffer ? i.renderbufferStorageMultisample(i.RENDERBUFFER, n.multisample, i.DEPTH24_STENCIL8, e.width, e.height) : i.renderbufferStorage(i.RENDERBUFFER, i.DEPTH_STENCIL, e.width, e.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.RENDERBUFFER, n.stencil)) : n.stencil && (i.deleteRenderbuffer(n.stencil), n.stencil = null);
    }, r.prototype.canMultisampleFramebuffer = function(e) {
      return this.renderer.context.webGLVersion !== 1 && e.colorTextures.length <= 1 && !e.depthTexture;
    }, r.prototype.detectSamples = function(e) {
      var t = this.msaaSamples, i = gt.NONE;
      if (e <= 1 || t === null)
        return i;
      for (var n = 0; n < t.length; n++)
        if (t[n] <= e) {
          i = t[n];
          break;
        }
      return i === 1 && (i = gt.NONE), i;
    }, r.prototype.blit = function(e, t, i) {
      var n = this, o = n.current, s = n.renderer, a = n.gl, h = n.CONTEXT_UID;
      if (s.context.webGLVersion === 2 && o) {
        var u = o.glFramebuffers[h];
        if (u) {
          if (!e) {
            if (!u.msaaBuffer)
              return;
            var l = o.colorTextures[0];
            if (!l)
              return;
            u.blitFramebuffer || (u.blitFramebuffer = new ps(o.width, o.height), u.blitFramebuffer.addColorTexture(0, l)), e = u.blitFramebuffer, e.colorTextures[0] !== l && (e.colorTextures[0] = l, e.dirtyId++, e.dirtyFormat++), (e.width !== o.width || e.height !== o.height) && (e.width = o.width, e.height = o.height, e.dirtyId++, e.dirtySize++);
          }
          t || (t = Fv, t.width = o.width, t.height = o.height), i || (i = t);
          var c = t.width === i.width && t.height === i.height;
          this.bind(e), a.bindFramebuffer(a.READ_FRAMEBUFFER, u.framebuffer), a.blitFramebuffer(t.left, t.top, t.right, t.bottom, i.left, i.top, i.right, i.bottom, a.COLOR_BUFFER_BIT, c ? a.NEAREST : a.LINEAR);
        }
      }
    }, r.prototype.disposeFramebuffer = function(e, t) {
      var i = e.glFramebuffers[this.CONTEXT_UID], n = this.gl;
      if (i) {
        delete e.glFramebuffers[this.CONTEXT_UID];
        var o = this.managedFramebuffers.indexOf(e);
        o >= 0 && this.managedFramebuffers.splice(o, 1), e.disposeRunner.remove(this), t || (n.deleteFramebuffer(i.framebuffer), i.msaaBuffer && n.deleteRenderbuffer(i.msaaBuffer), i.stencil && n.deleteRenderbuffer(i.stencil)), i.blitFramebuffer && i.blitFramebuffer.dispose();
      }
    }, r.prototype.disposeAll = function(e) {
      var t = this.managedFramebuffers;
      this.managedFramebuffers = [];
      for (var i = 0; i < t.length; i++)
        this.disposeFramebuffer(t[i], e);
    }, r.prototype.forceStencil = function() {
      var e = this.current;
      if (e) {
        var t = e.glFramebuffers[this.CONTEXT_UID];
        if (!(!t || t.stencil)) {
          e.stencil = !0;
          var i = e.width, n = e.height, o = this.gl, s = o.createRenderbuffer();
          o.bindRenderbuffer(o.RENDERBUFFER, s), t.msaaBuffer ? o.renderbufferStorageMultisample(o.RENDERBUFFER, t.multisample, o.DEPTH24_STENCIL8, i, n) : o.renderbufferStorage(o.RENDERBUFFER, o.DEPTH_STENCIL, i, n), t.stencil = s, o.framebufferRenderbuffer(o.FRAMEBUFFER, o.DEPTH_STENCIL_ATTACHMENT, o.RENDERBUFFER, s);
        }
      }
    }, r.prototype.reset = function() {
      this.current = this.unknownFramebuffer, this.viewport = new nt();
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), yo = { 5126: 4, 5123: 2, 5121: 1 }, Bv = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this.canUseUInt32ElementIndex = !1, this.managedGeometries = {};
    }
    return r.prototype.contextChange = function() {
      this.disposeAll(!0);
      var e = this.gl = this.renderer.gl, t = this.renderer.context;
      if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, t.webGLVersion !== 2) {
        var i = this.renderer.context.extensions.vertexArrayObject;
        G.PREFER_ENV === ve.WEBGL_LEGACY && (i = null), i ? (e.createVertexArray = function() {
          return i.createVertexArrayOES();
        }, e.bindVertexArray = function(o) {
          return i.bindVertexArrayOES(o);
        }, e.deleteVertexArray = function(o) {
          return i.deleteVertexArrayOES(o);
        }) : (this.hasVao = !1, e.createVertexArray = function() {
          return null;
        }, e.bindVertexArray = function() {
          return null;
        }, e.deleteVertexArray = function() {
          return null;
        });
      }
      if (t.webGLVersion !== 2) {
        var n = e.getExtension("ANGLE_instanced_arrays");
        n ? (e.vertexAttribDivisor = function(o, s) {
          return n.vertexAttribDivisorANGLE(o, s);
        }, e.drawElementsInstanced = function(o, s, a, h, u) {
          return n.drawElementsInstancedANGLE(o, s, a, h, u);
        }, e.drawArraysInstanced = function(o, s, a, h) {
          return n.drawArraysInstancedANGLE(o, s, a, h);
        }) : this.hasInstance = !1;
      }
      this.canUseUInt32ElementIndex = t.webGLVersion === 2 || !!t.extensions.uint32ElementIndex;
    }, r.prototype.bind = function(e, t) {
      t = t || this.renderer.shader.shader;
      var i = this.gl, n = e.glVertexArrayObjects[this.CONTEXT_UID], o = !1;
      n || (this.managedGeometries[e.id] = e, e.disposeRunner.add(this), e.glVertexArrayObjects[this.CONTEXT_UID] = n = {}, o = !0);
      var s = n[t.program.id] || this.initGeometryVao(e, t, o);
      this._activeGeometry = e, this._activeVao !== s && (this._activeVao = s, this.hasVao ? i.bindVertexArray(s) : this.activateVao(e, t.program)), this.updateBuffers();
    }, r.prototype.reset = function() {
      this.unbind();
    }, r.prototype.updateBuffers = function() {
      for (var e = this._activeGeometry, t = this.renderer.buffer, i = 0; i < e.buffers.length; i++) {
        var n = e.buffers[i];
        t.update(n);
      }
    }, r.prototype.checkCompatibility = function(e, t) {
      var i = e.attributes, n = t.attributeData;
      for (var o in n)
        if (!i[o])
          throw new Error('shader and geometry incompatible, geometry missing the "' + o + '" attribute');
    }, r.prototype.getSignature = function(e, t) {
      var i = e.attributes, n = t.attributeData, o = ["g", e.id];
      for (var s in i)
        n[s] && o.push(s, n[s].location);
      return o.join("-");
    }, r.prototype.initGeometryVao = function(e, t, i) {
      i === void 0 && (i = !0);
      var n = this.gl, o = this.CONTEXT_UID, s = this.renderer.buffer, a = t.program;
      a.glPrograms[o] || this.renderer.shader.generateProgram(t), this.checkCompatibility(e, a);
      var h = this.getSignature(e, a), u = e.glVertexArrayObjects[this.CONTEXT_UID], l = u[h];
      if (l)
        return u[a.id] = l, l;
      var c = e.buffers, d = e.attributes, f = {}, p = {};
      for (var m in c)
        f[m] = 0, p[m] = 0;
      for (var m in d)
        !d[m].size && a.attributeData[m] ? d[m].size = a.attributeData[m].size : d[m].size || console.warn("PIXI Geometry attribute '" + m + "' size cannot be determined (likely the bound shader does not have the attribute)"), f[d[m].buffer] += d[m].size * yo[d[m].type];
      for (var m in d) {
        var y = d[m], _ = y.size;
        y.stride === void 0 && (f[y.buffer] === _ * yo[y.type] ? y.stride = 0 : y.stride = f[y.buffer]), y.start === void 0 && (y.start = p[y.buffer], p[y.buffer] += _ * yo[y.type]);
      }
      l = n.createVertexArray(), n.bindVertexArray(l);
      for (var g = 0; g < c.length; g++) {
        var v = c[g];
        s.bind(v), i && v._glBuffers[o].refCount++;
      }
      return this.activateVao(e, a), this._activeVao = l, u[a.id] = l, u[h] = l, l;
    }, r.prototype.disposeGeometry = function(e, t) {
      var i;
      if (this.managedGeometries[e.id]) {
        delete this.managedGeometries[e.id];
        var n = e.glVertexArrayObjects[this.CONTEXT_UID], o = this.gl, s = e.buffers, a = (i = this.renderer) === null || i === void 0 ? void 0 : i.buffer;
        if (e.disposeRunner.remove(this), !!n) {
          if (a)
            for (var h = 0; h < s.length; h++) {
              var u = s[h]._glBuffers[this.CONTEXT_UID];
              u && (u.refCount--, u.refCount === 0 && !t && a.dispose(s[h], t));
            }
          if (!t) {
            for (var l in n)
              if (l[0] === "g") {
                var c = n[l];
                this._activeVao === c && this.unbind(), o.deleteVertexArray(c);
              }
          }
          delete e.glVertexArrayObjects[this.CONTEXT_UID];
        }
      }
    }, r.prototype.disposeAll = function(e) {
      for (var t = Object.keys(this.managedGeometries), i = 0; i < t.length; i++)
        this.disposeGeometry(this.managedGeometries[t[i]], e);
    }, r.prototype.activateVao = function(e, t) {
      var i = this.gl, n = this.CONTEXT_UID, o = this.renderer.buffer, s = e.buffers, a = e.attributes;
      e.indexBuffer && o.bind(e.indexBuffer);
      var h = null;
      for (var u in a) {
        var l = a[u], c = s[l.buffer], d = c._glBuffers[n];
        if (t.attributeData[u]) {
          h !== d && (o.bind(c), h = d);
          var f = t.attributeData[u].location;
          if (i.enableVertexAttribArray(f), i.vertexAttribPointer(f, l.size, l.type || i.FLOAT, l.normalized, l.stride, l.start), l.instance)
            if (this.hasInstance)
              i.vertexAttribDivisor(f, 1);
            else
              throw new Error("geometry error, GPU Instancing is not supported on this device");
        }
      }
    }, r.prototype.draw = function(e, t, i, n) {
      var o = this.gl, s = this._activeGeometry;
      if (s.indexBuffer) {
        var a = s.indexBuffer.data.BYTES_PER_ELEMENT, h = a === 2 ? o.UNSIGNED_SHORT : o.UNSIGNED_INT;
        a === 2 || a === 4 && this.canUseUInt32ElementIndex ? s.instanced ? o.drawElementsInstanced(e, t || s.indexBuffer.data.length, h, (i || 0) * a, n || 1) : o.drawElements(e, t || s.indexBuffer.data.length, h, (i || 0) * a) : console.warn("unsupported index buffer type: uint32");
      } else
        s.instanced ? o.drawArraysInstanced(e, i, t || s.getSize(), n || 1) : o.drawArrays(e, i, t || s.getSize());
      return this;
    }, r.prototype.unbind = function() {
      this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Gv = (
  /** @class */
  function() {
    function r(e) {
      e === void 0 && (e = null), this.type = Ot.NONE, this.autoDetect = !0, this.maskObject = e || null, this.pooled = !1, this.isMaskData = !0, this.resolution = null, this.multisample = G.FILTER_MULTISAMPLE, this.enabled = !0, this.colorMask = 15, this._filters = null, this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null, this._scissorRectLocal = null, this._colorMask = 15, this._target = null;
    }
    return Object.defineProperty(r.prototype, "filter", {
      /**
       * The sprite mask filter.
       * If set to `null`, the default sprite mask filter is used.
       * @default null
       */
      get: function() {
        return this._filters ? this._filters[0] : null;
      },
      set: function(e) {
        e ? this._filters ? this._filters[0] = e : this._filters = [e] : this._filters = null;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.reset = function() {
      this.pooled && (this.maskObject = null, this.type = Ot.NONE, this.autoDetect = !0), this._target = null, this._scissorRectLocal = null;
    }, r.prototype.copyCountersOrReset = function(e) {
      e ? (this._stencilCounter = e._stencilCounter, this._scissorCounter = e._scissorCounter, this._scissorRect = e._scissorRect) : (this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null);
    }, r;
  }()
);
function Gh(r, e, t) {
  var i = r.createShader(e);
  return r.shaderSource(i, t), r.compileShader(i), i;
}
function Uh(r, e) {
  var t = r.getShaderSource(e).split(`
`).map(function(u, l) {
    return l + ": " + u;
  }), i = r.getShaderInfoLog(e), n = i.split(`
`), o = {}, s = n.map(function(u) {
    return parseFloat(u.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"));
  }).filter(function(u) {
    return u && !o[u] ? (o[u] = !0, !0) : !1;
  }), a = [""];
  s.forEach(function(u) {
    t[u - 1] = "%c" + t[u - 1] + "%c", a.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
  });
  var h = t.join(`
`);
  a[0] = h, console.error(i), console.groupCollapsed("click to view full shader code"), console.warn.apply(console, a), console.groupEnd();
}
function Uv(r, e, t, i) {
  r.getProgramParameter(e, r.LINK_STATUS) || (r.getShaderParameter(t, r.COMPILE_STATUS) || Uh(r, t), r.getShaderParameter(i, r.COMPILE_STATUS) || Uh(r, i), console.error("PixiJS Error: Could not initialize shader."), r.getProgramInfoLog(e) !== "" && console.warn("PixiJS Warning: gl.getProgramInfoLog()", r.getProgramInfoLog(e)));
}
function _o(r) {
  for (var e = new Array(r), t = 0; t < e.length; t++)
    e[t] = !1;
  return e;
}
function Fl(r, e) {
  switch (r) {
    case "float":
      return 0;
    case "vec2":
      return new Float32Array(2 * e);
    case "vec3":
      return new Float32Array(3 * e);
    case "vec4":
      return new Float32Array(4 * e);
    case "int":
    case "uint":
    case "sampler2D":
    case "sampler2DArray":
      return 0;
    case "ivec2":
      return new Int32Array(2 * e);
    case "ivec3":
      return new Int32Array(3 * e);
    case "ivec4":
      return new Int32Array(4 * e);
    case "uvec2":
      return new Uint32Array(2 * e);
    case "uvec3":
      return new Uint32Array(3 * e);
    case "uvec4":
      return new Uint32Array(4 * e);
    case "bool":
      return !1;
    case "bvec2":
      return _o(2 * e);
    case "bvec3":
      return _o(3 * e);
    case "bvec4":
      return _o(4 * e);
    case "mat2":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}
var Ll = {}, zr = Ll;
function kv() {
  if (zr === Ll || zr && zr.isContextLost()) {
    var r = G.ADAPTER.createCanvas(), e = void 0;
    G.PREFER_ENV >= ve.WEBGL2 && (e = r.getContext("webgl2", {})), e || (e = r.getContext("webgl", {}) || r.getContext("experimental-webgl", {}), e ? e.getExtension("WEBGL_draw_buffers") : e = null), zr = e;
  }
  return zr;
}
var Vi;
function Xv() {
  if (!Vi) {
    Vi = Xt.MEDIUM;
    var r = kv();
    if (r && r.getShaderPrecisionFormat) {
      var e = r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.HIGH_FLOAT);
      Vi = e.precision ? Xt.HIGH : Xt.MEDIUM;
    }
  }
  return Vi;
}
function kh(r, e, t) {
  if (r.substring(0, 9) !== "precision") {
    var i = e;
    return e === Xt.HIGH && t !== Xt.HIGH && (i = Xt.MEDIUM), "precision " + i + ` float;
` + r;
  } else if (t !== Xt.HIGH && r.substring(0, 15) === "precision highp")
    return r.replace("precision highp", "precision mediump");
  return r;
}
var jv = {
  float: 1,
  vec2: 2,
  vec3: 3,
  vec4: 4,
  int: 1,
  ivec2: 2,
  ivec3: 3,
  ivec4: 4,
  uint: 1,
  uvec2: 2,
  uvec3: 3,
  uvec4: 4,
  bool: 1,
  bvec2: 2,
  bvec3: 3,
  bvec4: 4,
  mat2: 4,
  mat3: 9,
  mat4: 16,
  sampler2D: 1
};
function Bl(r) {
  return jv[r];
}
var $i = null, Xh = {
  FLOAT: "float",
  FLOAT_VEC2: "vec2",
  FLOAT_VEC3: "vec3",
  FLOAT_VEC4: "vec4",
  INT: "int",
  INT_VEC2: "ivec2",
  INT_VEC3: "ivec3",
  INT_VEC4: "ivec4",
  UNSIGNED_INT: "uint",
  UNSIGNED_INT_VEC2: "uvec2",
  UNSIGNED_INT_VEC3: "uvec3",
  UNSIGNED_INT_VEC4: "uvec4",
  BOOL: "bool",
  BOOL_VEC2: "bvec2",
  BOOL_VEC3: "bvec3",
  BOOL_VEC4: "bvec4",
  FLOAT_MAT2: "mat2",
  FLOAT_MAT3: "mat3",
  FLOAT_MAT4: "mat4",
  SAMPLER_2D: "sampler2D",
  INT_SAMPLER_2D: "sampler2D",
  UNSIGNED_INT_SAMPLER_2D: "sampler2D",
  SAMPLER_CUBE: "samplerCube",
  INT_SAMPLER_CUBE: "samplerCube",
  UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
  SAMPLER_2D_ARRAY: "sampler2DArray",
  INT_SAMPLER_2D_ARRAY: "sampler2DArray",
  UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
};
function Gl(r, e) {
  if (!$i) {
    var t = Object.keys(Xh);
    $i = {};
    for (var i = 0; i < t.length; ++i) {
      var n = t[i];
      $i[r[n]] = Xh[n];
    }
  }
  return $i[e];
}
var Lr = [
  // a float cache layer
  {
    test: function(r) {
      return r.type === "float" && r.size === 1 && !r.isArray;
    },
    code: function(r) {
      return `
            if(uv["` + r + '"] !== ud["' + r + `"].value)
            {
                ud["` + r + '"].value = uv["' + r + `"]
                gl.uniform1f(ud["` + r + '"].location, uv["' + r + `"])
            }
            `;
    }
  },
  // handling samplers
  {
    test: function(r, e) {
      return (r.type === "sampler2D" || r.type === "samplerCube" || r.type === "sampler2DArray") && r.size === 1 && !r.isArray && (e == null || e.castToBaseTexture !== void 0);
    },
    code: function(r) {
      return `t = syncData.textureCount++;

            renderer.texture.bind(uv["` + r + `"], t);

            if(ud["` + r + `"].value !== t)
            {
                ud["` + r + `"].value = t;
                gl.uniform1i(ud["` + r + `"].location, t);
; // eslint-disable-line max-len
            }`;
    }
  },
  // uploading pixi matrix object to mat3
  {
    test: function(r, e) {
      return r.type === "mat3" && r.size === 1 && !r.isArray && e.a !== void 0;
    },
    code: function(r) {
      return `
            gl.uniformMatrix3fv(ud["` + r + '"].location, false, uv["' + r + `"].toArray(true));
            `;
    },
    codeUbo: function(r) {
      return `
                var ` + r + "_matrix = uv." + r + `.toArray(true);

                data[offset] = ` + r + `_matrix[0];
                data[offset+1] = ` + r + `_matrix[1];
                data[offset+2] = ` + r + `_matrix[2];
        
                data[offset + 4] = ` + r + `_matrix[3];
                data[offset + 5] = ` + r + `_matrix[4];
                data[offset + 6] = ` + r + `_matrix[5];
        
                data[offset + 8] = ` + r + `_matrix[6];
                data[offset + 9] = ` + r + `_matrix[7];
                data[offset + 10] = ` + r + `_matrix[8];
            `;
    }
  },
  // uploading a pixi point as a vec2 with caching layer
  {
    test: function(r, e) {
      return r.type === "vec2" && r.size === 1 && !r.isArray && e.x !== void 0;
    },
    code: function(r) {
      return `
                cv = ud["` + r + `"].value;
                v = uv["` + r + `"];

                if(cv[0] !== v.x || cv[1] !== v.y)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    gl.uniform2f(ud["` + r + `"].location, v.x, v.y);
                }`;
    },
    codeUbo: function(r) {
      return `
                v = uv.` + r + `;

                data[offset] = v.x;
                data[offset+1] = v.y;
            `;
    }
  },
  // caching layer for a vec2
  {
    test: function(r) {
      return r.type === "vec2" && r.size === 1 && !r.isArray;
    },
    code: function(r) {
      return `
                cv = ud["` + r + `"].value;
                v = uv["` + r + `"];

                if(cv[0] !== v[0] || cv[1] !== v[1])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    gl.uniform2f(ud["` + r + `"].location, v[0], v[1]);
                }
            `;
    }
  },
  // upload a pixi rectangle as a vec4 with caching layer
  {
    test: function(r, e) {
      return r.type === "vec4" && r.size === 1 && !r.isArray && e.width !== void 0;
    },
    code: function(r) {
      return `
                cv = ud["` + r + `"].value;
                v = uv["` + r + `"];

                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    cv[2] = v.width;
                    cv[3] = v.height;
                    gl.uniform4f(ud["` + r + `"].location, v.x, v.y, v.width, v.height)
                }`;
    },
    codeUbo: function(r) {
      return `
                    v = uv.` + r + `;

                    data[offset] = v.x;
                    data[offset+1] = v.y;
                    data[offset+2] = v.width;
                    data[offset+3] = v.height;
                `;
    }
  },
  // a caching layer for vec4 uploading
  {
    test: function(r) {
      return r.type === "vec4" && r.size === 1 && !r.isArray;
    },
    code: function(r) {
      return `
                cv = ud["` + r + `"].value;
                v = uv["` + r + `"];

                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    cv[2] = v[2];
                    cv[3] = v[3];

                    gl.uniform4f(ud["` + r + `"].location, v[0], v[1], v[2], v[3])
                }`;
    }
  }
], Hv = {
  float: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1f(location, v);
    }`,
  vec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2f(location, v[0], v[1])
    }`,
  vec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3f(location, v[0], v[1], v[2])
    }`,
  vec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4f(location, v[0], v[1], v[2], v[3]);
    }`,
  int: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  ivec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
  ivec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
  ivec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,
  uint: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1ui(location, v);
    }`,
  uvec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2ui(location, v[0], v[1]);
    }`,
  uvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3ui(location, v[0], v[1], v[2]);
    }`,
  uvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
    }`,
  bool: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1i(location, v);
    }`,
  bvec2: `
    if (cv[0] != v[0] || cv[1] != v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
  bvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
  bvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,
  mat2: "gl.uniformMatrix2fv(location, false, v)",
  mat3: "gl.uniformMatrix3fv(location, false, v)",
  mat4: "gl.uniformMatrix4fv(location, false, v)",
  sampler2D: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  samplerCube: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  sampler2DArray: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`
}, Yv = {
  float: "gl.uniform1fv(location, v)",
  vec2: "gl.uniform2fv(location, v)",
  vec3: "gl.uniform3fv(location, v)",
  vec4: "gl.uniform4fv(location, v)",
  mat4: "gl.uniformMatrix4fv(location, false, v)",
  mat3: "gl.uniformMatrix3fv(location, false, v)",
  mat2: "gl.uniformMatrix2fv(location, false, v)",
  int: "gl.uniform1iv(location, v)",
  ivec2: "gl.uniform2iv(location, v)",
  ivec3: "gl.uniform3iv(location, v)",
  ivec4: "gl.uniform4iv(location, v)",
  uint: "gl.uniform1uiv(location, v)",
  uvec2: "gl.uniform2uiv(location, v)",
  uvec3: "gl.uniform3uiv(location, v)",
  uvec4: "gl.uniform4uiv(location, v)",
  bool: "gl.uniform1iv(location, v)",
  bvec2: "gl.uniform2iv(location, v)",
  bvec3: "gl.uniform3iv(location, v)",
  bvec4: "gl.uniform4iv(location, v)",
  sampler2D: "gl.uniform1iv(location, v)",
  samplerCube: "gl.uniform1iv(location, v)",
  sampler2DArray: "gl.uniform1iv(location, v)"
};
function Vv(r, e) {
  var t, i = [`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
    `];
  for (var n in r.uniforms) {
    var o = e[n];
    if (!o) {
      !((t = r.uniforms[n]) === null || t === void 0) && t.group && (r.uniforms[n].ubo ? i.push(`
                        renderer.shader.syncUniformBufferGroup(uv.` + n + ", '" + n + `');
                    `) : i.push(`
                        renderer.shader.syncUniformGroup(uv.` + n + `, syncData);
                    `));
      continue;
    }
    for (var s = r.uniforms[n], a = !1, h = 0; h < Lr.length; h++)
      if (Lr[h].test(o, s)) {
        i.push(Lr[h].code(n, s)), a = !0;
        break;
      }
    if (!a) {
      var u = o.size === 1 && !o.isArray ? Hv : Yv, l = u[o.type].replace("location", 'ud["' + n + '"].location');
      i.push(`
            cu = ud["` + n + `"];
            cv = cu.value;
            v = uv["` + n + `"];
            ` + l + ";");
    }
  }
  return new Function("ud", "uv", "renderer", "syncData", i.join(`
`));
}
var $v = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function zv(r) {
  for (var e = "", t = 0; t < r; ++t)
    t > 0 && (e += `
else `), t < r - 1 && (e += "if(test == " + t + ".0){}");
  return e;
}
function Wv(r, e) {
  if (r === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  for (var t = e.createShader(e.FRAGMENT_SHADER); ; ) {
    var i = $v.replace(/%forloop%/gi, zv(r));
    if (e.shaderSource(t, i), e.compileShader(t), !e.getShaderParameter(t, e.COMPILE_STATUS))
      r = r / 2 | 0;
    else
      break;
  }
  return r;
}
var Wr;
function qv() {
  if (typeof Wr == "boolean")
    return Wr;
  try {
    var r = new Function("param1", "param2", "param3", "return param1[param2] === param3;");
    Wr = r({ a: "b" }, "a", "b") === !0;
  } catch {
    Wr = !1;
  }
  return Wr;
}
var Kv = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor *= texture2D(uSampler, vTextureCoord);
}`, Zv = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void){
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vTextureCoord = aTextureCoord;
}
`, Jv = 0, zi = {}, Pi = (
  /** @class */
  function() {
    function r(e, t, i) {
      i === void 0 && (i = "pixi-shader"), this.id = Jv++, this.vertexSrc = e || r.defaultVertexSrc, this.fragmentSrc = t || r.defaultFragmentSrc, this.vertexSrc = this.vertexSrc.trim(), this.fragmentSrc = this.fragmentSrc.trim(), this.vertexSrc.substring(0, 8) !== "#version" && (i = i.replace(/\s+/g, "-"), zi[i] ? (zi[i]++, i += "-" + zi[i]) : zi[i] = 1, this.vertexSrc = "#define SHADER_NAME " + i + `
` + this.vertexSrc, this.fragmentSrc = "#define SHADER_NAME " + i + `
` + this.fragmentSrc, this.vertexSrc = kh(this.vertexSrc, G.PRECISION_VERTEX, Xt.HIGH), this.fragmentSrc = kh(this.fragmentSrc, G.PRECISION_FRAGMENT, Xv())), this.glPrograms = {}, this.syncUniforms = null;
    }
    return Object.defineProperty(r, "defaultVertexSrc", {
      /**
       * The default vertex shader source.
       * @constant
       */
      get: function() {
        return Zv;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "defaultFragmentSrc", {
      /**
       * The default fragment shader source.
       * @constant
       */
      get: function() {
        return Kv;
      },
      enumerable: !1,
      configurable: !0
    }), r.from = function(e, t, i) {
      var n = e + t, o = Ih[n];
      return o || (Ih[n] = o = new r(e, t, i)), o;
    }, r;
  }()
), Ce = (
  /** @class */
  function() {
    function r(e, t) {
      this.uniformBindCount = 0, this.program = e, t ? t instanceof ir ? this.uniformGroup = t : this.uniformGroup = new ir(t) : this.uniformGroup = new ir({}), this.disposeRunner = new Nt("disposeShader");
    }
    return r.prototype.checkUniformExists = function(e, t) {
      if (t.uniforms[e])
        return !0;
      for (var i in t.uniforms) {
        var n = t.uniforms[i];
        if (n.group && this.checkUniformExists(e, n))
          return !0;
      }
      return !1;
    }, r.prototype.destroy = function() {
      this.uniformGroup = null, this.disposeRunner.emit(this), this.disposeRunner.destroy();
    }, Object.defineProperty(r.prototype, "uniforms", {
      /**
       * Shader uniform values, shortcut for `uniformGroup.uniforms`.
       * @readonly
       */
      get: function() {
        return this.uniformGroup.uniforms;
      },
      enumerable: !1,
      configurable: !0
    }), r.from = function(e, t, i) {
      var n = Pi.from(e, t);
      return new r(n, i);
    }, r;
  }()
), go = 0, vo = 1, bo = 2, xo = 3, To = 4, Eo = 5, cr = (
  /** @class */
  function() {
    function r() {
      this.data = 0, this.blendMode = X.NORMAL, this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
    }
    return Object.defineProperty(r.prototype, "blend", {
      /**
       * Activates blending of the computed fragment color values.
       * @default true
       */
      get: function() {
        return !!(this.data & 1 << go);
      },
      set: function(e) {
        !!(this.data & 1 << go) !== e && (this.data ^= 1 << go);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "offsets", {
      /**
       * Activates adding an offset to depth values of polygon's fragments
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << vo);
      },
      set: function(e) {
        !!(this.data & 1 << vo) !== e && (this.data ^= 1 << vo);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "culling", {
      /**
       * Activates culling of polygons.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << bo);
      },
      set: function(e) {
        !!(this.data & 1 << bo) !== e && (this.data ^= 1 << bo);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "depthTest", {
      /**
       * Activates depth comparisons and updates to the depth buffer.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << xo);
      },
      set: function(e) {
        !!(this.data & 1 << xo) !== e && (this.data ^= 1 << xo);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "depthMask", {
      /**
       * Enables or disables writing to the depth buffer.
       * @default true
       */
      get: function() {
        return !!(this.data & 1 << Eo);
      },
      set: function(e) {
        !!(this.data & 1 << Eo) !== e && (this.data ^= 1 << Eo);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "clockwiseFrontFace", {
      /**
       * Specifies whether or not front or back-facing polygons can be culled.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << To);
      },
      set: function(e) {
        !!(this.data & 1 << To) !== e && (this.data ^= 1 << To);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "blendMode", {
      /**
       * The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
       * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
       * @default PIXI.BLEND_MODES.NORMAL
       */
      get: function() {
        return this._blendMode;
      },
      set: function(e) {
        this.blend = e !== X.NONE, this._blendMode = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "polygonOffset", {
      /**
       * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
       * @default 0
       */
      get: function() {
        return this._polygonOffset;
      },
      set: function(e) {
        this.offsets = !!e, this._polygonOffset = e;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.toString = function() {
      return "[@pixi/core:State " + ("blendMode=" + this.blendMode + " ") + ("clockwiseFrontFace=" + this.clockwiseFrontFace + " ") + ("culling=" + this.culling + " ") + ("depthMask=" + this.depthMask + " ") + ("polygonOffset=" + this.polygonOffset) + "]";
    }, r.for2d = function() {
      var e = new r();
      return e.depthTest = !1, e.blend = !0, e;
    }, r;
  }()
), Qv = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`, t0 = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`, ke = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i, n) {
      var o = this, s = Pi.from(t || e.defaultVertexSrc, i || e.defaultFragmentSrc);
      return o = r.call(this, s, n) || this, o.padding = 0, o.resolution = G.FILTER_RESOLUTION, o.multisample = G.FILTER_MULTISAMPLE, o.enabled = !0, o.autoFit = !0, o.state = new cr(), o;
    }
    return e.prototype.apply = function(t, i, n, o, s) {
      t.applyFilter(this, i, n, o);
    }, Object.defineProperty(e.prototype, "blendMode", {
      /**
       * Sets the blend mode of the filter.
       * @default PIXI.BLEND_MODES.NORMAL
       */
      get: function() {
        return this.state.blendMode;
      },
      set: function(t) {
        this.state.blendMode = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "resolution", {
      /**
       * The resolution of the filter. Setting this to be lower will lower the quality but
       * increase the performance of the filter.
       */
      get: function() {
        return this._resolution;
      },
      set: function(t) {
        this._resolution = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e, "defaultVertexSrc", {
      /**
       * The default vertex shader source
       * @constant
       */
      get: function() {
        return t0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e, "defaultFragmentSrc", {
      /**
       * The default fragment shader source
       * @constant
       */
      get: function() {
        return Qv;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(Ce)
), e0 = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 otherMatrix;

varying vec2 vMaskCoord;
varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;
}
`, r0 = `varying vec2 vMaskCoord;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D mask;
uniform float alpha;
uniform float npmAlpha;
uniform vec4 maskClamp;

void main(void)
{
    float clip = step(3.5,
        step(maskClamp.x, vMaskCoord.x) +
        step(maskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, maskClamp.z) +
        step(vMaskCoord.y, maskClamp.w));

    vec4 original = texture2D(uSampler, vTextureCoord);
    vec4 masky = texture2D(mask, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    original *= (alphaMul * masky.r * alpha * clip);

    gl_FragColor = original;
}
`, jh = new Pt(), ca = (
  /** @class */
  function() {
    function r(e, t) {
      this._texture = e, this.mapCoord = new Pt(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, this.clampMargin = typeof t > "u" ? 0.5 : t, this.isSimple = !1;
    }
    return Object.defineProperty(r.prototype, "texture", {
      /** Texture property. */
      get: function() {
        return this._texture;
      },
      set: function(e) {
        this._texture = e, this._textureID = -1;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.multiplyUvs = function(e, t) {
      t === void 0 && (t = e);
      for (var i = this.mapCoord, n = 0; n < e.length; n += 2) {
        var o = e[n], s = e[n + 1];
        t[n] = o * i.a + s * i.c + i.tx, t[n + 1] = o * i.b + s * i.d + i.ty;
      }
      return t;
    }, r.prototype.update = function(e) {
      var t = this._texture;
      if (!t || !t.valid || !e && this._textureID === t._updateID)
        return !1;
      this._textureID = t._updateID, this._updateID++;
      var i = t._uvs;
      this.mapCoord.set(i.x1 - i.x0, i.y1 - i.y0, i.x3 - i.x0, i.y3 - i.y0, i.x0, i.y0);
      var n = t.orig, o = t.trim;
      o && (jh.set(n.width / o.width, 0, 0, n.height / o.height, -o.x / o.width, -o.y / o.height), this.mapCoord.append(jh));
      var s = t.baseTexture, a = this.uClampFrame, h = this.clampMargin / s.resolution, u = this.clampOffset;
      return a[0] = (t._frame.x + h + u) / s.width, a[1] = (t._frame.y + h + u) / s.height, a[2] = (t._frame.x + t._frame.width - h + u) / s.width, a[3] = (t._frame.y + t._frame.height - h + u) / s.height, this.uClampOffset[0] = u / s.realWidth, this.uClampOffset[1] = u / s.realHeight, this.isSimple = t._frame.width === s.width && t._frame.height === s.height && t.rotate === 0, !0;
    }, r;
  }()
), i0 = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i, n) {
      var o = this, s = null;
      return typeof t != "string" && i === void 0 && n === void 0 && (s = t, t = void 0, i = void 0, n = void 0), o = r.call(this, t || e0, i || r0, n) || this, o.maskSprite = s, o.maskMatrix = new Pt(), o;
    }
    return Object.defineProperty(e.prototype, "maskSprite", {
      /**
       * Sprite mask
       * @type {PIXI.DisplayObject}
       */
      get: function() {
        return this._maskSprite;
      },
      set: function(t) {
        this._maskSprite = t, this._maskSprite && (this._maskSprite.renderable = !1);
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.apply = function(t, i, n, o) {
      var s = this._maskSprite, a = s._texture;
      a.valid && (a.uvMatrix || (a.uvMatrix = new ca(a, 0)), a.uvMatrix.update(), this.uniforms.npmAlpha = a.baseTexture.alphaMode ? 0 : 1, this.uniforms.mask = a, this.uniforms.otherMatrix = t.calculateSpriteMatrix(this.maskMatrix, s).prepend(a.uvMatrix.mapCoord), this.uniforms.alpha = s.worldAlpha, this.uniforms.maskClamp = a.uvMatrix.uClampFrame, t.applyFilter(this, i, n, o));
    }, e;
  }(ke)
), n0 = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.enableScissor = !0, this.alphaMaskPool = [], this.maskDataPool = [], this.maskStack = [], this.alphaMaskIndex = 0;
    }
    return r.prototype.setMaskStack = function(e) {
      this.maskStack = e, this.renderer.scissor.setMaskStack(e), this.renderer.stencil.setMaskStack(e);
    }, r.prototype.push = function(e, t) {
      var i = t;
      if (!i.isMaskData) {
        var n = this.maskDataPool.pop() || new Gv();
        n.pooled = !0, n.maskObject = t, i = n;
      }
      var o = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
      if (i.copyCountersOrReset(o), i._colorMask = o ? o._colorMask : 15, i.autoDetect && this.detect(i), i._target = e, i.type !== Ot.SPRITE && this.maskStack.push(i), i.enabled)
        switch (i.type) {
          case Ot.SCISSOR:
            this.renderer.scissor.push(i);
            break;
          case Ot.STENCIL:
            this.renderer.stencil.push(i);
            break;
          case Ot.SPRITE:
            i.copyCountersOrReset(null), this.pushSpriteMask(i);
            break;
          case Ot.COLOR:
            this.pushColorMask(i);
            break;
        }
      i.type === Ot.SPRITE && this.maskStack.push(i);
    }, r.prototype.pop = function(e) {
      var t = this.maskStack.pop();
      if (!(!t || t._target !== e)) {
        if (t.enabled)
          switch (t.type) {
            case Ot.SCISSOR:
              this.renderer.scissor.pop(t);
              break;
            case Ot.STENCIL:
              this.renderer.stencil.pop(t.maskObject);
              break;
            case Ot.SPRITE:
              this.popSpriteMask(t);
              break;
            case Ot.COLOR:
              this.popColorMask(t);
              break;
          }
        if (t.reset(), t.pooled && this.maskDataPool.push(t), this.maskStack.length !== 0) {
          var i = this.maskStack[this.maskStack.length - 1];
          i.type === Ot.SPRITE && i._filters && (i._filters[0].maskSprite = i.maskObject);
        }
      }
    }, r.prototype.detect = function(e) {
      var t = e.maskObject;
      t ? t.isSprite ? e.type = Ot.SPRITE : this.enableScissor && this.renderer.scissor.testScissor(e) ? e.type = Ot.SCISSOR : e.type = Ot.STENCIL : e.type = Ot.COLOR;
    }, r.prototype.pushSpriteMask = function(e) {
      var t, i, n = e.maskObject, o = e._target, s = e._filters;
      s || (s = this.alphaMaskPool[this.alphaMaskIndex], s || (s = this.alphaMaskPool[this.alphaMaskIndex] = [new i0()]));
      var a = this.renderer, h = a.renderTexture, u, l;
      if (h.current) {
        var c = h.current;
        u = e.resolution || c.resolution, l = (t = e.multisample) !== null && t !== void 0 ? t : c.multisample;
      } else
        u = e.resolution || a.resolution, l = (i = e.multisample) !== null && i !== void 0 ? i : a.multisample;
      s[0].resolution = u, s[0].multisample = l, s[0].maskSprite = n;
      var d = o.filterArea;
      o.filterArea = n.getBounds(!0), a.filter.push(o, s), o.filterArea = d, e._filters || this.alphaMaskIndex++;
    }, r.prototype.popSpriteMask = function(e) {
      this.renderer.filter.pop(), e._filters ? e._filters[0].maskSprite = null : (this.alphaMaskIndex--, this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null);
    }, r.prototype.pushColorMask = function(e) {
      var t = e._colorMask, i = e._colorMask = t & e.colorMask;
      i !== t && this.renderer.gl.colorMask((i & 1) !== 0, (i & 2) !== 0, (i & 4) !== 0, (i & 8) !== 0);
    }, r.prototype.popColorMask = function(e) {
      var t = e._colorMask, i = this.maskStack.length > 0 ? this.maskStack[this.maskStack.length - 1]._colorMask : 15;
      i !== t && this.renderer.gl.colorMask((i & 1) !== 0, (i & 2) !== 0, (i & 4) !== 0, (i & 8) !== 0);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Ul = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.maskStack = [], this.glConst = 0;
    }
    return r.prototype.getStackLength = function() {
      return this.maskStack.length;
    }, r.prototype.setMaskStack = function(e) {
      var t = this.renderer.gl, i = this.getStackLength();
      this.maskStack = e;
      var n = this.getStackLength();
      n !== i && (n === 0 ? t.disable(this.glConst) : (t.enable(this.glConst), this._useCurrent()));
    }, r.prototype._useCurrent = function() {
    }, r.prototype.destroy = function() {
      this.renderer = null, this.maskStack = null;
    }, r;
  }()
), Hh = new Pt(), Yh = [], o0 = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.glConst = G.ADAPTER.getWebGLRenderingContext().SCISSOR_TEST, i;
    }
    return e.prototype.getStackLength = function() {
      var t = this.maskStack[this.maskStack.length - 1];
      return t ? t._scissorCounter : 0;
    }, e.prototype.calcScissorRect = function(t) {
      var i;
      if (!t._scissorRectLocal) {
        var n = t._scissorRect, o = t.maskObject, s = this.renderer, a = s.renderTexture, h = o.getBounds(!0, (i = Yh.pop()) !== null && i !== void 0 ? i : new nt());
        this.roundFrameToPixels(h, a.current ? a.current.resolution : s.resolution, a.sourceFrame, a.destinationFrame, s.projection.transform), n && h.fit(n), t._scissorRectLocal = h;
      }
    }, e.isMatrixRotated = function(t) {
      if (!t)
        return !1;
      var i = t.a, n = t.b, o = t.c, s = t.d;
      return (Math.abs(n) > 1e-4 || Math.abs(o) > 1e-4) && (Math.abs(i) > 1e-4 || Math.abs(s) > 1e-4);
    }, e.prototype.testScissor = function(t) {
      var i = t.maskObject;
      if (!i.isFastRect || !i.isFastRect() || e.isMatrixRotated(i.worldTransform) || e.isMatrixRotated(this.renderer.projection.transform))
        return !1;
      this.calcScissorRect(t);
      var n = t._scissorRectLocal;
      return n.width > 0 && n.height > 0;
    }, e.prototype.roundFrameToPixels = function(t, i, n, o, s) {
      e.isMatrixRotated(s) || (s = s ? Hh.copyFrom(s) : Hh.identity(), s.translate(-n.x, -n.y).scale(o.width / n.width, o.height / n.height).translate(o.x, o.y), this.renderer.filter.transformAABB(s, t), t.fit(o), t.x = Math.round(t.x * i), t.y = Math.round(t.y * i), t.width = Math.round(t.width * i), t.height = Math.round(t.height * i));
    }, e.prototype.push = function(t) {
      t._scissorRectLocal || this.calcScissorRect(t);
      var i = this.renderer.gl;
      t._scissorRect || i.enable(i.SCISSOR_TEST), t._scissorCounter++, t._scissorRect = t._scissorRectLocal, this._useCurrent();
    }, e.prototype.pop = function(t) {
      var i = this.renderer.gl;
      t && Yh.push(t._scissorRectLocal), this.getStackLength() > 0 ? this._useCurrent() : i.disable(i.SCISSOR_TEST);
    }, e.prototype._useCurrent = function() {
      var t = this.maskStack[this.maskStack.length - 1]._scissorRect, i;
      this.renderer.renderTexture.current ? i = t.y : i = this.renderer.height - t.height - t.y, this.renderer.gl.scissor(t.x, i, t.width, t.height);
    }, e;
  }(Ul)
), s0 = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.glConst = G.ADAPTER.getWebGLRenderingContext().STENCIL_TEST, i;
    }
    return e.prototype.getStackLength = function() {
      var t = this.maskStack[this.maskStack.length - 1];
      return t ? t._stencilCounter : 0;
    }, e.prototype.push = function(t) {
      var i = t.maskObject, n = this.renderer.gl, o = t._stencilCounter;
      o === 0 && (this.renderer.framebuffer.forceStencil(), n.clearStencil(0), n.clear(n.STENCIL_BUFFER_BIT), n.enable(n.STENCIL_TEST)), t._stencilCounter++;
      var s = t._colorMask;
      s !== 0 && (t._colorMask = 0, n.colorMask(!1, !1, !1, !1)), n.stencilFunc(n.EQUAL, o, 4294967295), n.stencilOp(n.KEEP, n.KEEP, n.INCR), i.renderable = !0, i.render(this.renderer), this.renderer.batch.flush(), i.renderable = !1, s !== 0 && (t._colorMask = s, n.colorMask((s & 1) !== 0, (s & 2) !== 0, (s & 4) !== 0, (s & 8) !== 0)), this._useCurrent();
    }, e.prototype.pop = function(t) {
      var i = this.renderer.gl;
      if (this.getStackLength() === 0)
        i.disable(i.STENCIL_TEST);
      else {
        var n = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null, o = n ? n._colorMask : 15;
        o !== 0 && (n._colorMask = 0, i.colorMask(!1, !1, !1, !1)), i.stencilOp(i.KEEP, i.KEEP, i.DECR), t.renderable = !0, t.render(this.renderer), this.renderer.batch.flush(), t.renderable = !1, o !== 0 && (n._colorMask = o, i.colorMask((o & 1) !== 0, (o & 2) !== 0, (o & 4) !== 0, (o & 8) !== 0)), this._useCurrent();
      }
    }, e.prototype._useCurrent = function() {
      var t = this.renderer.gl;
      t.stencilFunc(t.EQUAL, this.getStackLength(), 4294967295), t.stencilOp(t.KEEP, t.KEEP, t.KEEP);
    }, e;
  }(Ul)
), a0 = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.destinationFrame = null, this.sourceFrame = null, this.defaultFrame = null, this.projectionMatrix = new Pt(), this.transform = null;
    }
    return r.prototype.update = function(e, t, i, n) {
      this.destinationFrame = e || this.destinationFrame || this.defaultFrame, this.sourceFrame = t || this.sourceFrame || e, this.calculateProjection(this.destinationFrame, this.sourceFrame, i, n), this.transform && this.projectionMatrix.append(this.transform);
      var o = this.renderer;
      o.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix, o.globalUniforms.update(), o.shader.shader && o.shader.syncUniformGroup(o.shader.shader.uniforms.globals);
    }, r.prototype.calculateProjection = function(e, t, i, n) {
      var o = this.projectionMatrix, s = n ? -1 : 1;
      o.identity(), o.a = 1 / t.width * 2, o.d = s * (1 / t.height * 2), o.tx = -1 - t.x * o.a, o.ty = -s - t.y * o.d;
    }, r.prototype.setTransform = function(e) {
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), je = new nt(), qr = new nt(), h0 = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.clearColor = e._backgroundColorRgba, this.defaultMaskStack = [], this.current = null, this.sourceFrame = new nt(), this.destinationFrame = new nt(), this.viewportFrame = new nt();
    }
    return r.prototype.bind = function(e, t, i) {
      e === void 0 && (e = null);
      var n = this.renderer;
      this.current = e;
      var o, s, a;
      e ? (o = e.baseTexture, a = o.resolution, t || (je.width = e.frame.width, je.height = e.frame.height, t = je), i || (qr.x = e.frame.x, qr.y = e.frame.y, qr.width = t.width, qr.height = t.height, i = qr), s = o.framebuffer) : (a = n.resolution, t || (je.width = n.screen.width, je.height = n.screen.height, t = je), i || (i = je, i.width = t.width, i.height = t.height));
      var h = this.viewportFrame;
      h.x = i.x * a, h.y = i.y * a, h.width = i.width * a, h.height = i.height * a, e || (h.y = n.view.height - (h.y + h.height)), h.ceil(), this.renderer.framebuffer.bind(s, h), this.renderer.projection.update(i, t, a, !s), e ? this.renderer.mask.setMaskStack(o.maskStack) : this.renderer.mask.setMaskStack(this.defaultMaskStack), this.sourceFrame.copyFrom(t), this.destinationFrame.copyFrom(i);
    }, r.prototype.clear = function(e, t) {
      this.current ? e = e || this.current.baseTexture.clearColor : e = e || this.clearColor;
      var i = this.destinationFrame, n = this.current ? this.current.baseTexture : this.renderer.screen, o = i.width !== n.width || i.height !== n.height;
      if (o) {
        var s = this.viewportFrame, a = s.x, h = s.y, u = s.width, l = s.height;
        a = Math.round(a), h = Math.round(h), u = Math.round(u), l = Math.round(l), this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST), this.renderer.gl.scissor(a, h, u, l);
      }
      this.renderer.framebuffer.clear(e[0], e[1], e[2], e[3], t), o && this.renderer.scissor.pop();
    }, r.prototype.resize = function() {
      this.bind(null);
    }, r.prototype.reset = function() {
      this.bind(null);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
);
function u0(r, e, t, i, n) {
  t.buffer.update(n);
}
var l0 = {
  float: `
        data[offset] = v;
    `,
  vec2: `
        data[offset] = v[0];
        data[offset+1] = v[1];
    `,
  vec3: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

    `,
  vec4: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];
        data[offset+3] = v[3];
    `,
  mat2: `
        data[offset] = v[0];
        data[offset+1] = v[1];

        data[offset+4] = v[2];
        data[offset+5] = v[3];
    `,
  mat3: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];

        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];
    `,
  mat4: `
        for(var i = 0; i < 16; i++)
        {
            data[offset + i] = v[i];
        }
    `
}, kl = {
  float: 4,
  vec2: 8,
  vec3: 12,
  vec4: 16,
  int: 4,
  ivec2: 8,
  ivec3: 12,
  ivec4: 16,
  uint: 4,
  uvec2: 8,
  uvec3: 12,
  uvec4: 16,
  bool: 4,
  bvec2: 8,
  bvec3: 12,
  bvec4: 16,
  mat2: 16 * 2,
  mat3: 16 * 3,
  mat4: 16 * 4
};
function c0(r) {
  for (var e = r.map(function(h) {
    return {
      data: h,
      offset: 0,
      dataLen: 0,
      dirty: 0
    };
  }), t = 0, i = 0, n = 0, o = 0; o < e.length; o++) {
    var s = e[o];
    if (t = kl[s.data.type], s.data.size > 1 && (t = Math.max(t, 16) * s.data.size), s.dataLen = t, i % t !== 0 && i < 16) {
      var a = i % t % 16;
      i += a, n += a;
    }
    i + t > 16 ? (n = Math.ceil(n / 16) * 16, s.offset = n, n += t, i = t) : (s.offset = n, i += t, n += t);
  }
  return n = Math.ceil(n / 16) * 16, { uboElements: e, size: n };
}
function d0(r, e) {
  var t = [];
  for (var i in r)
    e[i] && t.push(e[i]);
  return t.sort(function(n, o) {
    return n.index - o.index;
  }), t;
}
function f0(r, e) {
  if (!r.autoManage)
    return { size: 0, syncFunc: u0 };
  for (var t = d0(r.uniforms, e), i = c0(t), n = i.uboElements, o = i.size, s = [`
    var v = null;
    var v2 = null;
    var cv = null;
    var t = 0;
    var gl = renderer.gl
    var index = 0;
    var data = buffer.data;
    `], a = 0; a < n.length; a++) {
    for (var h = n[a], u = r.uniforms[h.data.name], l = h.data.name, c = !1, d = 0; d < Lr.length; d++) {
      var f = Lr[d];
      if (f.codeUbo && f.test(h.data, u)) {
        s.push("offset = " + h.offset / 4 + ";", Lr[d].codeUbo(h.data.name, u)), c = !0;
        break;
      }
    }
    if (!c)
      if (h.data.size > 1) {
        var p = Bl(h.data.type), m = Math.max(kl[h.data.type] / 16, 1), y = p / m, _ = (4 - y % 4) % 4;
        s.push(`
                cv = ud.` + l + `.value;
                v = uv.` + l + `;
                offset = ` + h.offset / 4 + `;

                t = 0;

                for(var i=0; i < ` + h.data.size * m + `; i++)
                {
                    for(var j = 0; j < ` + y + `; j++)
                    {
                        data[offset++] = v[t++];
                    }
                    offset += ` + _ + `;
                }

                `);
      } else {
        var g = l0[h.data.type];
        s.push(`
                cv = ud.` + l + `.value;
                v = uv.` + l + `;
                offset = ` + h.offset / 4 + `;
                ` + g + `;
                `);
      }
  }
  return s.push(`
       renderer.buffer.update(buffer);
    `), {
    size: o,
    // eslint-disable-next-line no-new-func
    syncFunc: new Function("ud", "uv", "renderer", "syncData", "buffer", s.join(`
`))
  };
}
var p0 = (
  /** @class */
  function() {
    function r(e, t) {
      this.program = e, this.uniformData = t, this.uniformGroups = {}, this.uniformDirtyGroups = {}, this.uniformBufferBindings = {};
    }
    return r.prototype.destroy = function() {
      this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.uniformBufferBindings = null, this.program = null;
    }, r;
  }()
);
function m0(r, e) {
  for (var t = {}, i = e.getProgramParameter(r, e.ACTIVE_ATTRIBUTES), n = 0; n < i; n++) {
    var o = e.getActiveAttrib(r, n);
    if (o.name.indexOf("gl_") !== 0) {
      var s = Gl(e, o.type), a = {
        type: s,
        name: o.name,
        size: Bl(s),
        location: e.getAttribLocation(r, o.name)
      };
      t[o.name] = a;
    }
  }
  return t;
}
function y0(r, e) {
  for (var t = {}, i = e.getProgramParameter(r, e.ACTIVE_UNIFORMS), n = 0; n < i; n++) {
    var o = e.getActiveUniform(r, n), s = o.name.replace(/\[.*?\]$/, ""), a = !!o.name.match(/\[.*?\]$/), h = Gl(e, o.type);
    t[s] = {
      name: s,
      index: n,
      type: h,
      size: o.size,
      isArray: a,
      value: Fl(h, o.size)
    };
  }
  return t;
}
function _0(r, e) {
  var t = Gh(r, r.VERTEX_SHADER, e.vertexSrc), i = Gh(r, r.FRAGMENT_SHADER, e.fragmentSrc), n = r.createProgram();
  if (r.attachShader(n, t), r.attachShader(n, i), r.linkProgram(n), r.getProgramParameter(n, r.LINK_STATUS) || Uv(r, n, t, i), e.attributeData = m0(n, r), e.uniformData = y0(n, r), !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(e.vertexSrc)) {
    var o = Object.keys(e.attributeData);
    o.sort(function(l, c) {
      return l > c ? 1 : -1;
    });
    for (var s = 0; s < o.length; s++)
      e.attributeData[o[s]].location = s, r.bindAttribLocation(n, s, o[s]);
    r.linkProgram(n);
  }
  r.deleteShader(t), r.deleteShader(i);
  var a = {};
  for (var s in e.uniformData) {
    var h = e.uniformData[s];
    a[s] = {
      location: r.getUniformLocation(n, s),
      value: Fl(h.type, h.size)
    };
  }
  var u = new p0(n, a);
  return u;
}
var g0 = 0, Wi = { textureCount: 0, uboCount: 0 }, v0 = (
  /** @class */
  function() {
    function r(e) {
      this.destroyed = !1, this.renderer = e, this.systemCheck(), this.gl = null, this.shader = null, this.program = null, this.cache = {}, this._uboCache = {}, this.id = g0++;
    }
    return r.prototype.systemCheck = function() {
      if (!qv())
        throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
    }, r.prototype.contextChange = function(e) {
      this.gl = e, this.reset();
    }, r.prototype.bind = function(e, t) {
      e.disposeRunner.add(this), e.uniforms.globals = this.renderer.globalUniforms;
      var i = e.program, n = i.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(e);
      return this.shader = e, this.program !== i && (this.program = i, this.gl.useProgram(n.program)), t || (Wi.textureCount = 0, Wi.uboCount = 0, this.syncUniformGroup(e.uniformGroup, Wi)), n;
    }, r.prototype.setUniforms = function(e) {
      var t = this.shader.program, i = t.glPrograms[this.renderer.CONTEXT_UID];
      t.syncUniforms(i.uniformData, e, this.renderer);
    }, r.prototype.syncUniformGroup = function(e, t) {
      var i = this.getGlProgram();
      (!e.static || e.dirtyId !== i.uniformDirtyGroups[e.id]) && (i.uniformDirtyGroups[e.id] = e.dirtyId, this.syncUniforms(e, i, t));
    }, r.prototype.syncUniforms = function(e, t, i) {
      var n = e.syncUniforms[this.shader.program.id] || this.createSyncGroups(e);
      n(t.uniformData, e.uniforms, this.renderer, i);
    }, r.prototype.createSyncGroups = function(e) {
      var t = this.getSignature(e, this.shader.program.uniformData, "u");
      return this.cache[t] || (this.cache[t] = Vv(e, this.shader.program.uniformData)), e.syncUniforms[this.shader.program.id] = this.cache[t], e.syncUniforms[this.shader.program.id];
    }, r.prototype.syncUniformBufferGroup = function(e, t) {
      var i = this.getGlProgram();
      if (!e.static || e.dirtyId !== 0 || !i.uniformGroups[e.id]) {
        e.dirtyId = 0;
        var n = i.uniformGroups[e.id] || this.createSyncBufferGroup(e, i, t);
        e.buffer.update(), n(i.uniformData, e.uniforms, this.renderer, Wi, e.buffer);
      }
      this.renderer.buffer.bindBufferBase(e.buffer, i.uniformBufferBindings[t]);
    }, r.prototype.createSyncBufferGroup = function(e, t, i) {
      var n = this.renderer.gl;
      this.renderer.buffer.bind(e.buffer);
      var o = this.gl.getUniformBlockIndex(t.program, i);
      t.uniformBufferBindings[i] = this.shader.uniformBindCount, n.uniformBlockBinding(t.program, o, this.shader.uniformBindCount), this.shader.uniformBindCount++;
      var s = this.getSignature(e, this.shader.program.uniformData, "ubo"), a = this._uboCache[s];
      if (a || (a = this._uboCache[s] = f0(e, this.shader.program.uniformData)), e.autoManage) {
        var h = new Float32Array(a.size / 4);
        e.buffer.update(h);
      }
      return t.uniformGroups[e.id] = a.syncFunc, t.uniformGroups[e.id];
    }, r.prototype.getSignature = function(e, t, i) {
      var n = e.uniforms, o = [i + "-"];
      for (var s in n)
        o.push(s), t[s] && o.push(t[s].type);
      return o.join("-");
    }, r.prototype.getGlProgram = function() {
      return this.shader ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID] : null;
    }, r.prototype.generateProgram = function(e) {
      var t = this.gl, i = e.program, n = _0(t, i);
      return i.glPrograms[this.renderer.CONTEXT_UID] = n, n;
    }, r.prototype.reset = function() {
      this.program = null, this.shader = null;
    }, r.prototype.disposeShader = function(e) {
      this.shader === e && (this.shader = null);
    }, r.prototype.destroy = function() {
      this.renderer = null, this.destroyed = !0;
    }, r;
  }()
);
function b0(r, e) {
  return e === void 0 && (e = []), e[X.NORMAL] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.ADD] = [r.ONE, r.ONE], e[X.MULTIPLY] = [r.DST_COLOR, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.SCREEN] = [r.ONE, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.OVERLAY] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.DARKEN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.LIGHTEN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.COLOR_DODGE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.COLOR_BURN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.HARD_LIGHT] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.SOFT_LIGHT] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.DIFFERENCE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.EXCLUSION] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.HUE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.SATURATION] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.COLOR] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.LUMINOSITY] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.NONE] = [0, 0], e[X.NORMAL_NPM] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.ADD_NPM] = [r.SRC_ALPHA, r.ONE, r.ONE, r.ONE], e[X.SCREEN_NPM] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], e[X.SRC_IN] = [r.DST_ALPHA, r.ZERO], e[X.SRC_OUT] = [r.ONE_MINUS_DST_ALPHA, r.ZERO], e[X.SRC_ATOP] = [r.DST_ALPHA, r.ONE_MINUS_SRC_ALPHA], e[X.DST_OVER] = [r.ONE_MINUS_DST_ALPHA, r.ONE], e[X.DST_IN] = [r.ZERO, r.SRC_ALPHA], e[X.DST_OUT] = [r.ZERO, r.ONE_MINUS_SRC_ALPHA], e[X.DST_ATOP] = [r.ONE_MINUS_DST_ALPHA, r.SRC_ALPHA], e[X.XOR] = [r.ONE_MINUS_DST_ALPHA, r.ONE_MINUS_SRC_ALPHA], e[X.SUBTRACT] = [r.ONE, r.ONE, r.ONE, r.ONE, r.FUNC_REVERSE_SUBTRACT, r.FUNC_ADD], e;
}
var x0 = 0, T0 = 1, E0 = 2, A0 = 3, S0 = 4, w0 = 5, O0 = (
  /** @class */
  function() {
    function r() {
      this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = X.NONE, this._blendEq = !1, this.map = [], this.map[x0] = this.setBlend, this.map[T0] = this.setOffset, this.map[E0] = this.setCullFace, this.map[A0] = this.setDepthTest, this.map[S0] = this.setFrontFace, this.map[w0] = this.setDepthMask, this.checks = [], this.defaultState = new cr(), this.defaultState.blend = !0;
    }
    return r.prototype.contextChange = function(e) {
      this.gl = e, this.blendModes = b0(e), this.set(this.defaultState), this.reset();
    }, r.prototype.set = function(e) {
      if (e = e || this.defaultState, this.stateId !== e.data) {
        for (var t = this.stateId ^ e.data, i = 0; t; )
          t & 1 && this.map[i].call(this, !!(e.data & 1 << i)), t = t >> 1, i++;
        this.stateId = e.data;
      }
      for (var i = 0; i < this.checks.length; i++)
        this.checks[i](this, e);
    }, r.prototype.forceState = function(e) {
      e = e || this.defaultState;
      for (var t = 0; t < this.map.length; t++)
        this.map[t].call(this, !!(e.data & 1 << t));
      for (var t = 0; t < this.checks.length; t++)
        this.checks[t](this, e);
      this.stateId = e.data;
    }, r.prototype.setBlend = function(e) {
      this.updateCheck(r.checkBlendMode, e), this.gl[e ? "enable" : "disable"](this.gl.BLEND);
    }, r.prototype.setOffset = function(e) {
      this.updateCheck(r.checkPolygonOffset, e), this.gl[e ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
    }, r.prototype.setDepthTest = function(e) {
      this.gl[e ? "enable" : "disable"](this.gl.DEPTH_TEST);
    }, r.prototype.setDepthMask = function(e) {
      this.gl.depthMask(e);
    }, r.prototype.setCullFace = function(e) {
      this.gl[e ? "enable" : "disable"](this.gl.CULL_FACE);
    }, r.prototype.setFrontFace = function(e) {
      this.gl.frontFace(this.gl[e ? "CW" : "CCW"]);
    }, r.prototype.setBlendMode = function(e) {
      if (e !== this.blendMode) {
        this.blendMode = e;
        var t = this.blendModes[e], i = this.gl;
        t.length === 2 ? i.blendFunc(t[0], t[1]) : i.blendFuncSeparate(t[0], t[1], t[2], t[3]), t.length === 6 ? (this._blendEq = !0, i.blendEquationSeparate(t[4], t[5])) : this._blendEq && (this._blendEq = !1, i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD));
      }
    }, r.prototype.setPolygonOffset = function(e, t) {
      this.gl.polygonOffset(e, t);
    }, r.prototype.reset = function() {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = -1, this.setBlendMode(0);
    }, r.prototype.updateCheck = function(e, t) {
      var i = this.checks.indexOf(e);
      t && i === -1 ? this.checks.push(e) : !t && i !== -1 && this.checks.splice(i, 1);
    }, r.checkBlendMode = function(e, t) {
      e.setBlendMode(t.blendMode);
    }, r.checkPolygonOffset = function(e, t) {
      e.setPolygonOffset(1, t.polygonOffset);
    }, r.prototype.destroy = function() {
      this.gl = null;
    }, r;
  }()
), R0 = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.count = 0, this.checkCount = 0, this.maxIdle = G.GC_MAX_IDLE, this.checkCountMax = G.GC_MAX_CHECK_COUNT, this.mode = G.GC_MODE;
    }
    return r.prototype.postrender = function() {
      this.renderer.renderingToScreen && (this.count++, this.mode !== Tn.MANUAL && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
    }, r.prototype.run = function() {
      for (var e = this.renderer.texture, t = e.managedTextures, i = !1, n = 0; n < t.length; n++) {
        var o = t[n];
        !o.framebuffer && this.count - o.touched > this.maxIdle && (e.destroyTexture(o, !0), t[n] = null, i = !0);
      }
      if (i) {
        for (var s = 0, n = 0; n < t.length; n++)
          t[n] !== null && (t[s++] = t[n]);
        t.length = s;
      }
    }, r.prototype.unload = function(e) {
      var t = this.renderer.texture, i = e._texture;
      i && !i.framebuffer && t.destroyTexture(i);
      for (var n = e.children.length - 1; n >= 0; n--)
        this.unload(e.children[n]);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
);
function P0(r) {
  var e, t, i, n, o, s, a, h, u, l, c, d, f, p, m, y, _, g, v, b, T, S, w;
  return "WebGL2RenderingContext" in globalThis && r instanceof globalThis.WebGL2RenderingContext ? w = (e = {}, e[k.UNSIGNED_BYTE] = (t = {}, t[N.RGBA] = r.RGBA8, t[N.RGB] = r.RGB8, t[N.RG] = r.RG8, t[N.RED] = r.R8, t[N.RGBA_INTEGER] = r.RGBA8UI, t[N.RGB_INTEGER] = r.RGB8UI, t[N.RG_INTEGER] = r.RG8UI, t[N.RED_INTEGER] = r.R8UI, t[N.ALPHA] = r.ALPHA, t[N.LUMINANCE] = r.LUMINANCE, t[N.LUMINANCE_ALPHA] = r.LUMINANCE_ALPHA, t), e[k.BYTE] = (i = {}, i[N.RGBA] = r.RGBA8_SNORM, i[N.RGB] = r.RGB8_SNORM, i[N.RG] = r.RG8_SNORM, i[N.RED] = r.R8_SNORM, i[N.RGBA_INTEGER] = r.RGBA8I, i[N.RGB_INTEGER] = r.RGB8I, i[N.RG_INTEGER] = r.RG8I, i[N.RED_INTEGER] = r.R8I, i), e[k.UNSIGNED_SHORT] = (n = {}, n[N.RGBA_INTEGER] = r.RGBA16UI, n[N.RGB_INTEGER] = r.RGB16UI, n[N.RG_INTEGER] = r.RG16UI, n[N.RED_INTEGER] = r.R16UI, n[N.DEPTH_COMPONENT] = r.DEPTH_COMPONENT16, n), e[k.SHORT] = (o = {}, o[N.RGBA_INTEGER] = r.RGBA16I, o[N.RGB_INTEGER] = r.RGB16I, o[N.RG_INTEGER] = r.RG16I, o[N.RED_INTEGER] = r.R16I, o), e[k.UNSIGNED_INT] = (s = {}, s[N.RGBA_INTEGER] = r.RGBA32UI, s[N.RGB_INTEGER] = r.RGB32UI, s[N.RG_INTEGER] = r.RG32UI, s[N.RED_INTEGER] = r.R32UI, s[N.DEPTH_COMPONENT] = r.DEPTH_COMPONENT24, s), e[k.INT] = (a = {}, a[N.RGBA_INTEGER] = r.RGBA32I, a[N.RGB_INTEGER] = r.RGB32I, a[N.RG_INTEGER] = r.RG32I, a[N.RED_INTEGER] = r.R32I, a), e[k.FLOAT] = (h = {}, h[N.RGBA] = r.RGBA32F, h[N.RGB] = r.RGB32F, h[N.RG] = r.RG32F, h[N.RED] = r.R32F, h[N.DEPTH_COMPONENT] = r.DEPTH_COMPONENT32F, h), e[k.HALF_FLOAT] = (u = {}, u[N.RGBA] = r.RGBA16F, u[N.RGB] = r.RGB16F, u[N.RG] = r.RG16F, u[N.RED] = r.R16F, u), e[k.UNSIGNED_SHORT_5_6_5] = (l = {}, l[N.RGB] = r.RGB565, l), e[k.UNSIGNED_SHORT_4_4_4_4] = (c = {}, c[N.RGBA] = r.RGBA4, c), e[k.UNSIGNED_SHORT_5_5_5_1] = (d = {}, d[N.RGBA] = r.RGB5_A1, d), e[k.UNSIGNED_INT_2_10_10_10_REV] = (f = {}, f[N.RGBA] = r.RGB10_A2, f[N.RGBA_INTEGER] = r.RGB10_A2UI, f), e[k.UNSIGNED_INT_10F_11F_11F_REV] = (p = {}, p[N.RGB] = r.R11F_G11F_B10F, p), e[k.UNSIGNED_INT_5_9_9_9_REV] = (m = {}, m[N.RGB] = r.RGB9_E5, m), e[k.UNSIGNED_INT_24_8] = (y = {}, y[N.DEPTH_STENCIL] = r.DEPTH24_STENCIL8, y), e[k.FLOAT_32_UNSIGNED_INT_24_8_REV] = (_ = {}, _[N.DEPTH_STENCIL] = r.DEPTH32F_STENCIL8, _), e) : w = (g = {}, g[k.UNSIGNED_BYTE] = (v = {}, v[N.RGBA] = r.RGBA, v[N.RGB] = r.RGB, v[N.ALPHA] = r.ALPHA, v[N.LUMINANCE] = r.LUMINANCE, v[N.LUMINANCE_ALPHA] = r.LUMINANCE_ALPHA, v), g[k.UNSIGNED_SHORT_5_6_5] = (b = {}, b[N.RGB] = r.RGB, b), g[k.UNSIGNED_SHORT_4_4_4_4] = (T = {}, T[N.RGBA] = r.RGBA, T), g[k.UNSIGNED_SHORT_5_5_5_1] = (S = {}, S[N.RGBA] = r.RGBA, S), g), w;
}
var Ao = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.texture = e, this.width = -1, this.height = -1, this.dirtyId = -1, this.dirtyStyleId = -1, this.mipmap = !1, this.wrapMode = 33071, this.type = k.UNSIGNED_BYTE, this.internalFormat = N.RGBA, this.samplerType = 0;
    }
    return r;
  }()
), M0 = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.boundTextures = [], this.currentLocation = -1, this.managedTextures = [], this._unknownBoundTextures = !1, this.unknownTexture = new it(), this.hasIntegerTextures = !1;
    }
    return r.prototype.contextChange = function() {
      var e = this.gl = this.renderer.gl;
      this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.webGLVersion = this.renderer.context.webGLVersion, this.internalFormats = P0(e);
      var t = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);
      this.boundTextures.length = t;
      for (var i = 0; i < t; i++)
        this.boundTextures[i] = null;
      this.emptyTextures = {};
      var n = new Ao(e.createTexture());
      e.bindTexture(e.TEXTURE_2D, n.texture), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, new Uint8Array(4)), this.emptyTextures[e.TEXTURE_2D] = n, this.emptyTextures[e.TEXTURE_CUBE_MAP] = new Ao(e.createTexture()), e.bindTexture(e.TEXTURE_CUBE_MAP, this.emptyTextures[e.TEXTURE_CUBE_MAP].texture);
      for (var i = 0; i < 6; i++)
        e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, null);
      e.texParameteri(e.TEXTURE_CUBE_MAP, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_CUBE_MAP, e.TEXTURE_MIN_FILTER, e.LINEAR);
      for (var i = 0; i < this.boundTextures.length; i++)
        this.bind(null, i);
    }, r.prototype.bind = function(e, t) {
      t === void 0 && (t = 0);
      var i = this.gl;
      if (e = e == null ? void 0 : e.castToBaseTexture(), e && e.valid && !e.parentTextureArray) {
        e.touched = this.renderer.textureGC.count;
        var n = e._glTextures[this.CONTEXT_UID] || this.initTexture(e);
        this.boundTextures[t] !== e && (this.currentLocation !== t && (this.currentLocation = t, i.activeTexture(i.TEXTURE0 + t)), i.bindTexture(e.target, n.texture)), n.dirtyId !== e.dirtyId ? (this.currentLocation !== t && (this.currentLocation = t, i.activeTexture(i.TEXTURE0 + t)), this.updateTexture(e)) : n.dirtyStyleId !== e.dirtyStyleId && this.updateTextureStyle(e), this.boundTextures[t] = e;
      } else
        this.currentLocation !== t && (this.currentLocation = t, i.activeTexture(i.TEXTURE0 + t)), i.bindTexture(i.TEXTURE_2D, this.emptyTextures[i.TEXTURE_2D].texture), this.boundTextures[t] = null;
    }, r.prototype.reset = function() {
      this._unknownBoundTextures = !0, this.hasIntegerTextures = !1, this.currentLocation = -1;
      for (var e = 0; e < this.boundTextures.length; e++)
        this.boundTextures[e] = this.unknownTexture;
    }, r.prototype.unbind = function(e) {
      var t = this, i = t.gl, n = t.boundTextures;
      if (this._unknownBoundTextures) {
        this._unknownBoundTextures = !1;
        for (var o = 0; o < n.length; o++)
          n[o] === this.unknownTexture && this.bind(null, o);
      }
      for (var o = 0; o < n.length; o++)
        n[o] === e && (this.currentLocation !== o && (i.activeTexture(i.TEXTURE0 + o), this.currentLocation = o), i.bindTexture(e.target, this.emptyTextures[e.target].texture), n[o] = null);
    }, r.prototype.ensureSamplerType = function(e) {
      var t = this, i = t.boundTextures, n = t.hasIntegerTextures, o = t.CONTEXT_UID;
      if (n)
        for (var s = e - 1; s >= 0; --s) {
          var a = i[s];
          if (a) {
            var h = a._glTextures[o];
            h.samplerType !== xn.FLOAT && this.renderer.texture.unbind(a);
          }
        }
    }, r.prototype.initTexture = function(e) {
      var t = new Ao(this.gl.createTexture());
      return t.dirtyId = -1, e._glTextures[this.CONTEXT_UID] = t, this.managedTextures.push(e), e.on("dispose", this.destroyTexture, this), t;
    }, r.prototype.initTextureType = function(e, t) {
      var i, n;
      t.internalFormat = (n = (i = this.internalFormats[e.type]) === null || i === void 0 ? void 0 : i[e.format]) !== null && n !== void 0 ? n : e.format, this.webGLVersion === 2 && e.type === k.HALF_FLOAT ? t.type = this.gl.HALF_FLOAT : t.type = e.type;
    }, r.prototype.updateTexture = function(e) {
      var t = e._glTextures[this.CONTEXT_UID];
      if (t) {
        var i = this.renderer;
        if (this.initTextureType(e, t), e.resource && e.resource.upload(i, e, t))
          t.samplerType !== xn.FLOAT && (this.hasIntegerTextures = !0);
        else {
          var n = e.realWidth, o = e.realHeight, s = i.gl;
          (t.width !== n || t.height !== o || t.dirtyId < 0) && (t.width = n, t.height = o, s.texImage2D(e.target, 0, t.internalFormat, n, o, 0, e.format, t.type, null));
        }
        e.dirtyStyleId !== t.dirtyStyleId && this.updateTextureStyle(e), t.dirtyId = e.dirtyId;
      }
    }, r.prototype.destroyTexture = function(e, t) {
      var i = this.gl;
      if (e = e.castToBaseTexture(), e._glTextures[this.CONTEXT_UID] && (this.unbind(e), i.deleteTexture(e._glTextures[this.CONTEXT_UID].texture), e.off("dispose", this.destroyTexture, this), delete e._glTextures[this.CONTEXT_UID], !t)) {
        var n = this.managedTextures.indexOf(e);
        n !== -1 && Fr(this.managedTextures, n, 1);
      }
    }, r.prototype.updateTextureStyle = function(e) {
      var t = e._glTextures[this.CONTEXT_UID];
      t && ((e.mipmap === Qt.POW2 || this.webGLVersion !== 2) && !e.isPowerOfTwo ? t.mipmap = !1 : t.mipmap = e.mipmap >= 1, this.webGLVersion !== 2 && !e.isPowerOfTwo ? t.wrapMode = he.CLAMP : t.wrapMode = e.wrapMode, e.resource && e.resource.style(this.renderer, e, t) || this.setStyle(e, t), t.dirtyStyleId = e.dirtyStyleId);
    }, r.prototype.setStyle = function(e, t) {
      var i = this.gl;
      if (t.mipmap && e.mipmap !== Qt.ON_MANUAL && i.generateMipmap(e.target), i.texParameteri(e.target, i.TEXTURE_WRAP_S, t.wrapMode), i.texParameteri(e.target, i.TEXTURE_WRAP_T, t.wrapMode), t.mipmap) {
        i.texParameteri(e.target, i.TEXTURE_MIN_FILTER, e.scaleMode === se.LINEAR ? i.LINEAR_MIPMAP_LINEAR : i.NEAREST_MIPMAP_NEAREST);
        var n = this.renderer.context.extensions.anisotropicFiltering;
        if (n && e.anisotropicLevel > 0 && e.scaleMode === se.LINEAR) {
          var o = Math.min(e.anisotropicLevel, i.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
          i.texParameterf(e.target, n.TEXTURE_MAX_ANISOTROPY_EXT, o);
        }
      } else
        i.texParameteri(e.target, i.TEXTURE_MIN_FILTER, e.scaleMode === se.LINEAR ? i.LINEAR : i.NEAREST);
      i.texParameteri(e.target, i.TEXTURE_MAG_FILTER, e.scaleMode === se.LINEAR ? i.LINEAR : i.NEAREST);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), So = new Pt(), I0 = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t, i) {
      t === void 0 && (t = di.UNKNOWN);
      var n = r.call(this) || this;
      return i = Object.assign({}, G.RENDER_OPTIONS, i), n.options = i, n.type = t, n.screen = new nt(0, 0, i.width, i.height), n.view = i.view || G.ADAPTER.createCanvas(), n.resolution = i.resolution || G.RESOLUTION, n.useContextAlpha = i.useContextAlpha, n.autoDensity = !!i.autoDensity, n.preserveDrawingBuffer = i.preserveDrawingBuffer, n.clearBeforeRender = i.clearBeforeRender, n._backgroundColor = 0, n._backgroundColorRgba = [0, 0, 0, 1], n._backgroundColorString = "#000000", n.backgroundColor = i.backgroundColor || n._backgroundColor, n.backgroundAlpha = i.backgroundAlpha, i.transparent !== void 0 && (Jt("6.0.0", "Option transparent is deprecated, please use backgroundAlpha instead."), n.useContextAlpha = i.transparent, n.backgroundAlpha = i.transparent ? 0 : 1), n._lastObjectRendered = null, n.plugins = {}, n;
    }
    return e.prototype.initPlugins = function(t) {
      for (var i in t)
        this.plugins[i] = new t[i](this);
    }, Object.defineProperty(e.prototype, "width", {
      /**
       * Same as view.width, actual number of pixels in the canvas by horizontal.
       * @member {number}
       * @readonly
       * @default 800
       */
      get: function() {
        return this.view.width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /**
       * Same as view.height, actual number of pixels in the canvas by vertical.
       * @member {number}
       * @readonly
       * @default 600
       */
      get: function() {
        return this.view.height;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.resize = function(t, i) {
      this.view.width = Math.round(t * this.resolution), this.view.height = Math.round(i * this.resolution);
      var n = this.view.width / this.resolution, o = this.view.height / this.resolution;
      this.screen.width = n, this.screen.height = o, this.autoDensity && (this.view.style.width = n + "px", this.view.style.height = o + "px"), this.emit("resize", n, o);
    }, e.prototype.generateTexture = function(t, i, n, o) {
      i === void 0 && (i = {}), typeof i == "number" && (Jt("6.1.0", "generateTexture options (scaleMode, resolution, region) are now object options."), i = { scaleMode: i, resolution: n, region: o });
      var s = i.region, a = fv(i, ["region"]);
      o = s || t.getLocalBounds(null, !0), o.width === 0 && (o.width = 1), o.height === 0 && (o.height = 1);
      var h = ar.create(fs({ width: o.width, height: o.height }, a));
      return So.tx = -o.x, So.ty = -o.y, this.render(t, {
        renderTexture: h,
        clear: !1,
        transform: So,
        skipUpdateTransform: !!t.parent
      }), h;
    }, e.prototype.destroy = function(t) {
      for (var i in this.plugins)
        this.plugins[i].destroy(), this.plugins[i] = null;
      t && this.view.parentNode && this.view.parentNode.removeChild(this.view);
      var n = this;
      n.plugins = null, n.type = di.UNKNOWN, n.view = null, n.screen = null, n._tempDisplayObjectParent = null, n.options = null, this._backgroundColorRgba = null, this._backgroundColorString = null, this._lastObjectRendered = null;
    }, Object.defineProperty(e.prototype, "backgroundColor", {
      /**
       * The background color to fill if not transparent
       * @member {number}
       */
      get: function() {
        return this._backgroundColor;
      },
      set: function(t) {
        this._backgroundColor = t, this._backgroundColorString = xl(t), kr(t, this._backgroundColorRgba);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "backgroundAlpha", {
      /**
       * The background color alpha. Setting this to 0 will make the canvas transparent.
       * @member {number}
       */
      get: function() {
        return this._backgroundColorRgba[3];
      },
      set: function(t) {
        this._backgroundColorRgba[3] = t;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(Si)
), D0 = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.buffer = e || null, this.updateID = -1, this.byteLength = -1, this.refCount = 0;
    }
    return r;
  }()
), C0 = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.managedBuffers = {}, this.boundBufferBases = {};
    }
    return r.prototype.destroy = function() {
      this.renderer = null;
    }, r.prototype.contextChange = function() {
      this.disposeAll(!0), this.gl = this.renderer.gl, this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    }, r.prototype.bind = function(e) {
      var t = this, i = t.gl, n = t.CONTEXT_UID, o = e._glBuffers[n] || this.createGLBuffer(e);
      i.bindBuffer(e.type, o.buffer);
    }, r.prototype.bindBufferBase = function(e, t) {
      var i = this, n = i.gl, o = i.CONTEXT_UID;
      if (this.boundBufferBases[t] !== e) {
        var s = e._glBuffers[o] || this.createGLBuffer(e);
        this.boundBufferBases[t] = e, n.bindBufferBase(n.UNIFORM_BUFFER, t, s.buffer);
      }
    }, r.prototype.bindBufferRange = function(e, t, i) {
      var n = this, o = n.gl, s = n.CONTEXT_UID;
      i = i || 0;
      var a = e._glBuffers[s] || this.createGLBuffer(e);
      o.bindBufferRange(o.UNIFORM_BUFFER, t || 0, a.buffer, i * 256, 256);
    }, r.prototype.update = function(e) {
      var t = this, i = t.gl, n = t.CONTEXT_UID, o = e._glBuffers[n];
      if (e._updateID !== o.updateID)
        if (o.updateID = e._updateID, i.bindBuffer(e.type, o.buffer), o.byteLength >= e.data.byteLength)
          i.bufferSubData(e.type, 0, e.data);
        else {
          var s = e.static ? i.STATIC_DRAW : i.DYNAMIC_DRAW;
          o.byteLength = e.data.byteLength, i.bufferData(e.type, e.data, s);
        }
    }, r.prototype.dispose = function(e, t) {
      if (this.managedBuffers[e.id]) {
        delete this.managedBuffers[e.id];
        var i = e._glBuffers[this.CONTEXT_UID], n = this.gl;
        e.disposeRunner.remove(this), i && (t || n.deleteBuffer(i.buffer), delete e._glBuffers[this.CONTEXT_UID]);
      }
    }, r.prototype.disposeAll = function(e) {
      for (var t = Object.keys(this.managedBuffers), i = 0; i < t.length; i++)
        this.dispose(this.managedBuffers[t[i]], e);
    }, r.prototype.createGLBuffer = function(e) {
      var t = this, i = t.CONTEXT_UID, n = t.gl;
      return e._glBuffers[i] = new D0(n.createBuffer()), this.managedBuffers[e.id] = e, e.disposeRunner.add(this), e._glBuffers[i];
    }, r;
  }()
), Xl = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      var i = r.call(this, di.WEBGL, t) || this;
      return t = i.options, i.gl = null, i.CONTEXT_UID = 0, i.runners = {
        destroy: new Nt("destroy"),
        contextChange: new Nt("contextChange"),
        reset: new Nt("reset"),
        update: new Nt("update"),
        postrender: new Nt("postrender"),
        prerender: new Nt("prerender"),
        resize: new Nt("resize")
      }, i.runners.contextChange.add(i), i.globalUniforms = new ir({
        projectionMatrix: new Pt()
      }, !0), i.addSystem(n0, "mask").addSystem(Cv, "context").addSystem(O0, "state").addSystem(v0, "shader").addSystem(M0, "texture").addSystem(C0, "buffer").addSystem(Bv, "geometry").addSystem(Lv, "framebuffer").addSystem(o0, "scissor").addSystem(s0, "stencil").addSystem(a0, "projection").addSystem(R0, "textureGC").addSystem(Iv, "filter").addSystem(h0, "renderTexture").addSystem(Dv, "batch"), i.initPlugins(e.__plugins), i.multisample = void 0, t.context ? i.context.initFromContext(t.context) : i.context.initFromOptions({
        alpha: !!i.useContextAlpha,
        antialias: t.antialias,
        premultipliedAlpha: i.useContextAlpha && i.useContextAlpha !== "notMultiplied",
        stencil: !0,
        preserveDrawingBuffer: t.preserveDrawingBuffer,
        powerPreference: i.options.powerPreference
      }), i.renderingToScreen = !0, ly(i.context.webGLVersion === 2 ? "WebGL 2" : "WebGL 1"), i.resize(i.options.width, i.options.height), i;
    }
    return e.create = function(t) {
      if (cy())
        return new e(t);
      throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
    }, e.prototype.contextChange = function() {
      var t = this.gl, i;
      if (this.context.webGLVersion === 1) {
        var n = t.getParameter(t.FRAMEBUFFER_BINDING);
        t.bindFramebuffer(t.FRAMEBUFFER, null), i = t.getParameter(t.SAMPLES), t.bindFramebuffer(t.FRAMEBUFFER, n);
      } else {
        var n = t.getParameter(t.DRAW_FRAMEBUFFER_BINDING);
        t.bindFramebuffer(t.DRAW_FRAMEBUFFER, null), i = t.getParameter(t.SAMPLES), t.bindFramebuffer(t.DRAW_FRAMEBUFFER, n);
      }
      i >= gt.HIGH ? this.multisample = gt.HIGH : i >= gt.MEDIUM ? this.multisample = gt.MEDIUM : i >= gt.LOW ? this.multisample = gt.LOW : this.multisample = gt.NONE;
    }, e.prototype.addSystem = function(t, i) {
      var n = new t(this);
      if (this[i])
        throw new Error('Whoops! The name "' + i + '" is already in use');
      this[i] = n;
      for (var o in this.runners)
        this.runners[o].add(n);
      return this;
    }, e.prototype.render = function(t, i) {
      var n, o, s, a;
      if (i && (i instanceof ar ? (Jt("6.0.0", "Renderer#render arguments changed, use options instead."), n = i, o = arguments[2], s = arguments[3], a = arguments[4]) : (n = i.renderTexture, o = i.clear, s = i.transform, a = i.skipUpdateTransform)), this.renderingToScreen = !n, this.runners.prerender.emit(), this.emit("prerender"), this.projection.transform = s, !this.context.isLost) {
        if (n || (this._lastObjectRendered = t), !a) {
          var h = t.enableTempParent();
          t.updateTransform(), t.disableTempParent(h);
        }
        this.renderTexture.bind(n), this.batch.currentRenderer.start(), (o !== void 0 ? o : this.clearBeforeRender) && this.renderTexture.clear(), t.render(this), this.batch.currentRenderer.flush(), n && n.baseTexture.update(), this.runners.postrender.emit(), this.projection.transform = null, this.emit("postrender");
      }
    }, e.prototype.generateTexture = function(t, i, n, o) {
      i === void 0 && (i = {});
      var s = r.prototype.generateTexture.call(this, t, i, n, o);
      return this.framebuffer.blit(), s;
    }, e.prototype.resize = function(t, i) {
      r.prototype.resize.call(this, t, i), this.runners.resize.emit(this.screen.height, this.screen.width);
    }, e.prototype.reset = function() {
      return this.runners.reset.emit(), this;
    }, e.prototype.clear = function() {
      this.renderTexture.bind(), this.renderTexture.clear();
    }, e.prototype.destroy = function(t) {
      this.runners.destroy.emit();
      for (var i in this.runners)
        this.runners[i].destroy();
      r.prototype.destroy.call(this, t), this.gl = null;
    }, Object.defineProperty(e.prototype, "extract", {
      /**
       * Please use `plugins.extract` instead.
       * @member {PIXI.Extract} extract
       * @deprecated since 6.0.0
       * @readonly
       */
      get: function() {
        return Jt("6.0.0", "Renderer#extract has been deprecated, please use Renderer#plugins.extract instead."), this.plugins.extract;
      },
      enumerable: !1,
      configurable: !0
    }), e.registerPlugin = function(t, i) {
      Jt("6.5.0", "Renderer.registerPlugin() has been deprecated, please use extensions.add() instead."), Se.add({
        name: t,
        type: ft.RendererPlugin,
        ref: i
      });
    }, e.__plugins = {}, e;
  }(I0)
);
Se.handleByMap(ft.RendererPlugin, Xl.__plugins);
function jl(r) {
  return Xl.create(r);
}
var N0 = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`, F0 = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`, L0 = N0, Hl = F0, ms = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
      this.texArray = null, this.blend = 0, this.type = qt.TRIANGLES, this.start = 0, this.size = 0, this.data = null;
    }
    return r;
  }()
), ys = (
  /** @class */
  function() {
    function r() {
      this.elements = [], this.ids = [], this.count = 0;
    }
    return r.prototype.clear = function() {
      for (var e = 0; e < this.count; e++)
        this.elements[e] = null;
      this.count = 0;
    }, r;
  }()
), _s = (
  /** @class */
  function() {
    function r(e) {
      typeof e == "number" ? this.rawBinaryData = new ArrayBuffer(e) : e instanceof Uint8Array ? this.rawBinaryData = e.buffer : this.rawBinaryData = e, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData);
    }
    return Object.defineProperty(r.prototype, "int8View", {
      /** View on the raw binary data as a `Int8Array`. */
      get: function() {
        return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "uint8View", {
      /** View on the raw binary data as a `Uint8Array`. */
      get: function() {
        return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "int16View", {
      /**  View on the raw binary data as a `Int16Array`. */
      get: function() {
        return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "uint16View", {
      /** View on the raw binary data as a `Uint16Array`. */
      get: function() {
        return this._uint16View || (this._uint16View = new Uint16Array(this.rawBinaryData)), this._uint16View;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "int32View", {
      /** View on the raw binary data as a `Int32Array`. */
      get: function() {
        return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.view = function(e) {
      return this[e + "View"];
    }, r.prototype.destroy = function() {
      this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
    }, r.sizeOf = function(e) {
      switch (e) {
        case "int8":
        case "uint8":
          return 1;
        case "int16":
        case "uint16":
          return 2;
        case "int32":
        case "uint32":
        case "float32":
          return 4;
        default:
          throw new Error(e + " isn't a valid view type");
      }
    }, r;
  }()
), B0 = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.shaderGenerator = null, i.geometryClass = null, i.vertexSize = null, i.state = cr.for2d(), i.size = G.SPRITE_BATCH_SIZE * 4, i._vertexCount = 0, i._indexCount = 0, i._bufferedElements = [], i._bufferedTextures = [], i._bufferSize = 0, i._shader = null, i._packedGeometries = [], i._packedGeometryPoolSize = 2, i._flushId = 0, i._aBuffers = {}, i._iBuffers = {}, i.MAX_TEXTURES = 1, i.renderer.on("prerender", i.onPrerender, i), t.runners.contextChange.add(i), i._dcIndex = 0, i._aIndex = 0, i._iIndex = 0, i._attributeBuffer = null, i._indexBuffer = null, i._tempBoundTextures = [], i;
    }
    return e.prototype.contextChange = function() {
      var t = this.renderer.gl;
      G.PREFER_ENV === ve.WEBGL_LEGACY ? this.MAX_TEXTURES = 1 : (this.MAX_TEXTURES = Math.min(t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), G.SPRITE_MAX_TEXTURES), this.MAX_TEXTURES = Wv(this.MAX_TEXTURES, t)), this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
      for (var i = 0; i < this._packedGeometryPoolSize; i++)
        this._packedGeometries[i] = new this.geometryClass();
      this.initFlushBuffers();
    }, e.prototype.initFlushBuffers = function() {
      for (var t = e._drawCallPool, i = e._textureArrayPool, n = this.size / 4, o = Math.floor(n / this.MAX_TEXTURES) + 1; t.length < n; )
        t.push(new ms());
      for (; i.length < o; )
        i.push(new ys());
      for (var s = 0; s < this.MAX_TEXTURES; s++)
        this._tempBoundTextures[s] = null;
    }, e.prototype.onPrerender = function() {
      this._flushId = 0;
    }, e.prototype.render = function(t) {
      t._texture.valid && (this._vertexCount + t.vertexData.length / 2 > this.size && this.flush(), this._vertexCount += t.vertexData.length / 2, this._indexCount += t.indices.length, this._bufferedTextures[this._bufferSize] = t._texture.baseTexture, this._bufferedElements[this._bufferSize++] = t);
    }, e.prototype.buildTexturesAndDrawCalls = function() {
      var t = this, i = t._bufferedTextures, n = t.MAX_TEXTURES, o = e._textureArrayPool, s = this.renderer.batch, a = this._tempBoundTextures, h = this.renderer.textureGC.count, u = ++it._globalBatch, l = 0, c = o[0], d = 0;
      s.copyBoundTextures(a, n);
      for (var f = 0; f < this._bufferSize; ++f) {
        var p = i[f];
        i[f] = null, p._batchEnabled !== u && (c.count >= n && (s.boundArray(c, a, u, n), this.buildDrawCalls(c, d, f), d = f, c = o[++l], ++u), p._batchEnabled = u, p.touched = h, c.elements[c.count++] = p);
      }
      c.count > 0 && (s.boundArray(c, a, u, n), this.buildDrawCalls(c, d, this._bufferSize), ++l, ++u);
      for (var f = 0; f < a.length; f++)
        a[f] = null;
      it._globalBatch = u;
    }, e.prototype.buildDrawCalls = function(t, i, n) {
      var o = this, s = o._bufferedElements, a = o._attributeBuffer, h = o._indexBuffer, u = o.vertexSize, l = e._drawCallPool, c = this._dcIndex, d = this._aIndex, f = this._iIndex, p = l[c];
      p.start = this._iIndex, p.texArray = t;
      for (var m = i; m < n; ++m) {
        var y = s[m], _ = y._texture.baseTexture, g = Tl[_.alphaMode ? 1 : 0][y.blendMode];
        s[m] = null, i < m && p.blend !== g && (p.size = f - p.start, i = m, p = l[++c], p.texArray = t, p.start = f), this.packInterleavedGeometry(y, a, h, d, f), d += y.vertexData.length / 2 * u, f += y.indices.length, p.blend = g;
      }
      i < n && (p.size = f - p.start, ++c), this._dcIndex = c, this._aIndex = d, this._iIndex = f;
    }, e.prototype.bindAndClearTexArray = function(t) {
      for (var i = this.renderer.texture, n = 0; n < t.count; n++)
        i.bind(t.elements[n], t.ids[n]), t.elements[n] = null;
      t.count = 0;
    }, e.prototype.updateGeometry = function() {
      var t = this, i = t._packedGeometries, n = t._attributeBuffer, o = t._indexBuffer;
      G.CAN_UPLOAD_SAME_BUFFER ? (i[this._flushId]._buffer.update(n.rawBinaryData), i[this._flushId]._indexBuffer.update(o), this.renderer.geometry.updateBuffers()) : (this._packedGeometryPoolSize <= this._flushId && (this._packedGeometryPoolSize++, i[this._flushId] = new this.geometryClass()), i[this._flushId]._buffer.update(n.rawBinaryData), i[this._flushId]._indexBuffer.update(o), this.renderer.geometry.bind(i[this._flushId]), this.renderer.geometry.updateBuffers(), this._flushId++);
    }, e.prototype.drawBatches = function() {
      for (var t = this._dcIndex, i = this.renderer, n = i.gl, o = i.state, s = e._drawCallPool, a = null, h = 0; h < t; h++) {
        var u = s[h], l = u.texArray, c = u.type, d = u.size, f = u.start, p = u.blend;
        a !== l && (a = l, this.bindAndClearTexArray(l)), this.state.blendMode = p, o.set(this.state), n.drawElements(c, d, n.UNSIGNED_SHORT, f * 2);
      }
    }, e.prototype.flush = function() {
      this._vertexCount !== 0 && (this._attributeBuffer = this.getAttributeBuffer(this._vertexCount), this._indexBuffer = this.getIndexBuffer(this._indexCount), this._aIndex = 0, this._iIndex = 0, this._dcIndex = 0, this.buildTexturesAndDrawCalls(), this.updateGeometry(), this.drawBatches(), this._bufferSize = 0, this._vertexCount = 0, this._indexCount = 0);
    }, e.prototype.start = function() {
      this.renderer.state.set(this.state), this.renderer.texture.ensureSamplerType(this.MAX_TEXTURES), this.renderer.shader.bind(this._shader), G.CAN_UPLOAD_SAME_BUFFER && this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }, e.prototype.stop = function() {
      this.flush();
    }, e.prototype.destroy = function() {
      for (var t = 0; t < this._packedGeometryPoolSize; t++)
        this._packedGeometries[t] && this._packedGeometries[t].destroy();
      this.renderer.off("prerender", this.onPrerender, this), this._aBuffers = null, this._iBuffers = null, this._packedGeometries = null, this._attributeBuffer = null, this._indexBuffer = null, this._shader && (this._shader.destroy(), this._shader = null), r.prototype.destroy.call(this);
    }, e.prototype.getAttributeBuffer = function(t) {
      var i = Pn(Math.ceil(t / 8)), n = Ph(i), o = i * 8;
      this._aBuffers.length <= n && (this._iBuffers.length = n + 1);
      var s = this._aBuffers[o];
      return s || (this._aBuffers[o] = s = new _s(o * this.vertexSize * 4)), s;
    }, e.prototype.getIndexBuffer = function(t) {
      var i = Pn(Math.ceil(t / 12)), n = Ph(i), o = i * 12;
      this._iBuffers.length <= n && (this._iBuffers.length = n + 1);
      var s = this._iBuffers[n];
      return s || (this._iBuffers[n] = s = new Uint16Array(o)), s;
    }, e.prototype.packInterleavedGeometry = function(t, i, n, o, s) {
      for (var a = i.uint32View, h = i.float32View, u = o / this.vertexSize, l = t.uvs, c = t.indices, d = t.vertexData, f = t._texture.baseTexture._batchLocation, p = Math.min(t.worldAlpha, 1), m = p < 1 && t._texture.baseTexture.alphaMode ? ua(t._tintRGB, p) : t._tintRGB + (p * 255 << 24), y = 0; y < d.length; y += 2)
        h[o++] = d[y], h[o++] = d[y + 1], h[o++] = l[y], h[o++] = l[y + 1], a[o++] = m, h[o++] = f;
      for (var y = 0; y < c.length; y++)
        n[s++] = u + c[y];
    }, e._drawCallPool = [], e._textureArrayPool = [], e;
  }(jn)
), G0 = (
  /** @class */
  function() {
    function r(e, t) {
      if (this.vertexSrc = e, this.fragTemplate = t, this.programCache = {}, this.defaultGroupCache = {}, t.indexOf("%count%") < 0)
        throw new Error('Fragment template must contain "%count%".');
      if (t.indexOf("%forloop%") < 0)
        throw new Error('Fragment template must contain "%forloop%".');
    }
    return r.prototype.generateShader = function(e) {
      if (!this.programCache[e]) {
        for (var t = new Int32Array(e), i = 0; i < e; i++)
          t[i] = i;
        this.defaultGroupCache[e] = ir.from({ uSamplers: t }, !0);
        var n = this.fragTemplate;
        n = n.replace(/%count%/gi, "" + e), n = n.replace(/%forloop%/gi, this.generateSampleSrc(e)), this.programCache[e] = new Pi(this.vertexSrc, n);
      }
      var o = {
        tint: new Float32Array([1, 1, 1, 1]),
        translationMatrix: new Pt(),
        default: this.defaultGroupCache[e]
      };
      return new Ce(this.programCache[e], o);
    }, r.prototype.generateSampleSrc = function(e) {
      var t = "";
      t += `
`, t += `
`;
      for (var i = 0; i < e; i++)
        i > 0 && (t += `
else `), i < e - 1 && (t += "if(vTextureId < " + i + ".5)"), t += `
{`, t += `
	color = texture2D(uSamplers[` + i + "], vTextureCoord);", t += `
}`;
      return t += `
`, t += `
`, t;
    }, r;
  }()
), Yl = (
  /** @class */
  function(r) {
    pt(e, r);
    function e(t) {
      t === void 0 && (t = !1);
      var i = r.call(this) || this;
      return i._buffer = new Rt(null, t, !1), i._indexBuffer = new Rt(null, t, !0), i.addAttribute("aVertexPosition", i._buffer, 2, !1, k.FLOAT).addAttribute("aTextureCoord", i._buffer, 2, !1, k.FLOAT).addAttribute("aColor", i._buffer, 4, !0, k.UNSIGNED_BYTE).addAttribute("aTextureId", i._buffer, 1, !0, k.FLOAT).addIndex(i._indexBuffer), i;
    }
    return e;
  }(Ri)
), Vh = `precision highp float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;
attribute float aTextureId;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform vec4 tint;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

void main(void){
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vTextureId = aTextureId;
    vColor = aColor * tint;
}
`, $h = `varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    gl_FragColor = color * vColor;
}
`, U0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.create = function(e) {
      var t = Object.assign({
        vertex: Vh,
        fragment: $h,
        geometryClass: Yl,
        vertexSize: 6
      }, e), i = t.vertex, n = t.fragment, o = t.vertexSize, s = t.geometryClass;
      return (
        /** @class */
        function(a) {
          pt(h, a);
          function h(u) {
            var l = a.call(this, u) || this;
            return l.shaderGenerator = new G0(i, n), l.geometryClass = s, l.vertexSize = o, l;
          }
          return h;
        }(B0)
      );
    }, Object.defineProperty(r, "defaultVertexSrc", {
      /**
       * The default vertex shader source
       * @readonly
       */
      get: function() {
        return Vh;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "defaultFragmentTemplate", {
      /**
       * The default fragment shader source
       * @readonly
       */
      get: function() {
        return $h;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), Vl = U0.create();
Object.assign(Vl, {
  extension: {
    name: "batch",
    type: ft.RendererPlugin
  }
});
/*!
 * @pixi/accessibility - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/accessibility is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var k0 = {
  /**
   *  Flag for if the object is accessible. If true AccessibilityManager will overlay a
   *   shadow div with attributes set
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   */
  accessible: !1,
  /**
   * Sets the title attribute of the shadow div
   * If accessibleTitle AND accessibleHint has not been this will default to 'displayObject [tabIndex]'
   * @member {?string}
   * @memberof PIXI.DisplayObject#
   */
  accessibleTitle: null,
  /**
   * Sets the aria-label attribute of the shadow div
   * @member {string}
   * @memberof PIXI.DisplayObject#
   */
  accessibleHint: null,
  /**
   * @member {number}
   * @memberof PIXI.DisplayObject#
   * @private
   * @todo Needs docs.
   */
  tabIndex: 0,
  /**
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   * @todo Needs docs.
   */
  _accessibleActive: !1,
  /**
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   * @todo Needs docs.
   */
  _accessibleDiv: null,
  /**
   * Specify the type of div the accessible layer is. Screen readers treat the element differently
   * depending on this type. Defaults to button.
   * @member {string}
   * @memberof PIXI.DisplayObject#
   * @default 'button'
   */
  accessibleType: "button",
  /**
   * Specify the pointer-events the accessible div will use
   * Defaults to auto.
   * @member {string}
   * @memberof PIXI.DisplayObject#
   * @default 'auto'
   */
  accessiblePointerEvents: "auto",
  /**
   * Setting to false will prevent any children inside this container to
   * be accessible. Defaults to true.
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   * @default true
   */
  accessibleChildren: !0,
  renderId: -1
};
wt.mixin(k0);
var X0 = 9, qi = 100, j0 = 0, H0 = 0, zh = 2, Wh = 1, Y0 = -1e3, V0 = -1e3, $0 = 2, z0 = (
  /** @class */
  function() {
    function r(e) {
      this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this.pool = [], this.renderId = 0, this.children = [], this.androidUpdateCount = 0, this.androidUpdateFrequency = 500, this._hookDiv = null, (ae.tablet || ae.phone) && this.createTouchHook();
      var t = document.createElement("div");
      t.style.width = qi + "px", t.style.height = qi + "px", t.style.position = "absolute", t.style.top = j0 + "px", t.style.left = H0 + "px", t.style.zIndex = zh.toString(), this.div = t, this.renderer = e, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, !1);
    }
    return Object.defineProperty(r.prototype, "isActive", {
      /**
       * Value of `true` if accessibility is currently active and accessibility layers are showing.
       * @member {boolean}
       * @readonly
       */
      get: function() {
        return this._isActive;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "isMobileAccessibility", {
      /**
       * Value of `true` if accessibility is enabled for touch devices.
       * @member {boolean}
       * @readonly
       */
      get: function() {
        return this._isMobileAccessibility;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.createTouchHook = function() {
      var e = this, t = document.createElement("button");
      t.style.width = Wh + "px", t.style.height = Wh + "px", t.style.position = "absolute", t.style.top = Y0 + "px", t.style.left = V0 + "px", t.style.zIndex = $0.toString(), t.style.backgroundColor = "#FF0000", t.title = "select to enable accessibility for this content", t.addEventListener("focus", function() {
        e._isMobileAccessibility = !0, e.activate(), e.destroyTouchHook();
      }), document.body.appendChild(t), this._hookDiv = t;
    }, r.prototype.destroyTouchHook = function() {
      this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
    }, r.prototype.activate = function() {
      var e;
      this._isActive || (this._isActive = !0, globalThis.document.addEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown, !1), this.renderer.on("postrender", this.update, this), (e = this.renderer.view.parentNode) === null || e === void 0 || e.appendChild(this.div));
    }, r.prototype.deactivate = function() {
      var e;
      !this._isActive || this._isMobileAccessibility || (this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.addEventListener("keydown", this._onKeyDown, !1), this.renderer.off("postrender", this.update), (e = this.div.parentNode) === null || e === void 0 || e.removeChild(this.div));
    }, r.prototype.updateAccessibleObjects = function(e) {
      if (!(!e.visible || !e.accessibleChildren)) {
        e.accessible && e.interactive && (e._accessibleActive || this.addChild(e), e.renderId = this.renderId);
        var t = e.children;
        if (t)
          for (var i = 0; i < t.length; i++)
            this.updateAccessibleObjects(t[i]);
      }
    }, r.prototype.update = function() {
      var e = performance.now();
      if (!(ae.android.device && e < this.androidUpdateCount) && (this.androidUpdateCount = e + this.androidUpdateFrequency, !!this.renderer.renderingToScreen)) {
        this.renderer._lastObjectRendered && this.updateAccessibleObjects(this.renderer._lastObjectRendered);
        var t = this.renderer.view.getBoundingClientRect(), i = t.left, n = t.top, o = t.width, s = t.height, a = this.renderer, h = a.width, u = a.height, l = a.resolution, c = o / h * l, d = s / u * l, f = this.div;
        f.style.left = i + "px", f.style.top = n + "px", f.style.width = h + "px", f.style.height = u + "px";
        for (var p = 0; p < this.children.length; p++) {
          var m = this.children[p];
          if (m.renderId !== this.renderId)
            m._accessibleActive = !1, Fr(this.children, p, 1), this.div.removeChild(m._accessibleDiv), this.pool.push(m._accessibleDiv), m._accessibleDiv = null, p--;
          else {
            f = m._accessibleDiv;
            var y = m.hitArea, _ = m.worldTransform;
            m.hitArea ? (f.style.left = (_.tx + y.x * _.a) * c + "px", f.style.top = (_.ty + y.y * _.d) * d + "px", f.style.width = y.width * _.a * c + "px", f.style.height = y.height * _.d * d + "px") : (y = m.getBounds(), this.capHitArea(y), f.style.left = y.x * c + "px", f.style.top = y.y * d + "px", f.style.width = y.width * c + "px", f.style.height = y.height * d + "px", f.title !== m.accessibleTitle && m.accessibleTitle !== null && (f.title = m.accessibleTitle), f.getAttribute("aria-label") !== m.accessibleHint && m.accessibleHint !== null && f.setAttribute("aria-label", m.accessibleHint)), (m.accessibleTitle !== f.title || m.tabIndex !== f.tabIndex) && (f.title = m.accessibleTitle, f.tabIndex = m.tabIndex, this.debug && this.updateDebugHTML(f));
          }
        }
        this.renderId++;
      }
    }, r.prototype.updateDebugHTML = function(e) {
      e.innerHTML = "type: " + e.type + "</br> title : " + e.title + "</br> tabIndex: " + e.tabIndex;
    }, r.prototype.capHitArea = function(e) {
      e.x < 0 && (e.width += e.x, e.x = 0), e.y < 0 && (e.height += e.y, e.y = 0);
      var t = this.renderer, i = t.width, n = t.height;
      e.x + e.width > i && (e.width = i - e.x), e.y + e.height > n && (e.height = n - e.y);
    }, r.prototype.addChild = function(e) {
      var t = this.pool.pop();
      t || (t = document.createElement("button"), t.style.width = qi + "px", t.style.height = qi + "px", t.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", t.style.position = "absolute", t.style.zIndex = zh.toString(), t.style.borderStyle = "none", navigator.userAgent.toLowerCase().indexOf("chrome") > -1 ? t.setAttribute("aria-live", "off") : t.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? t.setAttribute("aria-relevant", "additions") : t.setAttribute("aria-relevant", "text"), t.addEventListener("click", this._onClick.bind(this)), t.addEventListener("focus", this._onFocus.bind(this)), t.addEventListener("focusout", this._onFocusOut.bind(this))), t.style.pointerEvents = e.accessiblePointerEvents, t.type = e.accessibleType, e.accessibleTitle && e.accessibleTitle !== null ? t.title = e.accessibleTitle : (!e.accessibleHint || e.accessibleHint === null) && (t.title = "displayObject " + e.tabIndex), e.accessibleHint && e.accessibleHint !== null && t.setAttribute("aria-label", e.accessibleHint), this.debug && this.updateDebugHTML(t), e._accessibleActive = !0, e._accessibleDiv = t, t.displayObject = e, this.children.push(e), this.div.appendChild(e._accessibleDiv), e._accessibleDiv.tabIndex = e.tabIndex;
    }, r.prototype._onClick = function(e) {
      var t = this.renderer.plugins.interaction, i = e.target.displayObject, n = t.eventData;
      t.dispatchEvent(i, "click", n), t.dispatchEvent(i, "pointertap", n), t.dispatchEvent(i, "tap", n);
    }, r.prototype._onFocus = function(e) {
      e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "assertive");
      var t = this.renderer.plugins.interaction, i = e.target.displayObject, n = t.eventData;
      t.dispatchEvent(i, "mouseover", n);
    }, r.prototype._onFocusOut = function(e) {
      e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "polite");
      var t = this.renderer.plugins.interaction, i = e.target.displayObject, n = t.eventData;
      t.dispatchEvent(i, "mouseout", n);
    }, r.prototype._onKeyDown = function(e) {
      e.keyCode === X0 && this.activate();
    }, r.prototype._onMouseMove = function(e) {
      e.movementX === 0 && e.movementY === 0 || this.deactivate();
    }, r.prototype.destroy = function() {
      this.destroyTouchHook(), this.div = null, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown), this.pool = null, this.children = null, this.renderer = null;
    }, r.extension = {
      name: "accessibility",
      type: [
        ft.RendererPlugin,
        ft.CanvasRendererPlugin
      ]
    }, r;
  }()
);
/*!
 * @pixi/interaction - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/interaction is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var qh = (
  /** @class */
  function() {
    function r() {
      this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0, this.global = new yt(), this.target = null, this.originalEvent = null, this.identifier = null, this.isPrimary = !1, this.button = 0, this.buttons = 0, this.width = 0, this.height = 0, this.tiltX = 0, this.tiltY = 0, this.pointerType = null, this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0;
    }
    return Object.defineProperty(r.prototype, "pointerId", {
      /**
       * The unique identifier of the pointer. It will be the same as `identifier`.
       * @readonly
       * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId
       */
      get: function() {
        return this.identifier;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.getLocalPosition = function(e, t, i) {
      return e.worldTransform.applyInverse(i || this.global, t);
    }, r.prototype.copyEvent = function(e) {
      "isPrimary" in e && e.isPrimary && (this.isPrimary = !0), this.button = "button" in e && e.button;
      var t = "buttons" in e && e.buttons;
      this.buttons = Number.isInteger(t) ? t : "which" in e && e.which, this.width = "width" in e && e.width, this.height = "height" in e && e.height, this.tiltX = "tiltX" in e && e.tiltX, this.tiltY = "tiltY" in e && e.tiltY, this.pointerType = "pointerType" in e && e.pointerType, this.pressure = "pressure" in e && e.pressure, this.rotationAngle = "rotationAngle" in e && e.rotationAngle, this.twist = "twist" in e && e.twist || 0, this.tangentialPressure = "tangentialPressure" in e && e.tangentialPressure || 0;
    }, r.prototype.reset = function() {
      this.isPrimary = !1;
    }, r;
  }()
);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var gs = function(r, e) {
  return gs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, gs(r, e);
};
function W0(r, e) {
  gs(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var q0 = (
  /** @class */
  function() {
    function r() {
      this.stopped = !1, this.stopsPropagatingAt = null, this.stopPropagationHint = !1, this.target = null, this.currentTarget = null, this.type = null, this.data = null;
    }
    return r.prototype.stopPropagation = function() {
      this.stopped = !0, this.stopPropagationHint = !0, this.stopsPropagatingAt = this.currentTarget;
    }, r.prototype.reset = function() {
      this.stopped = !1, this.stopsPropagatingAt = null, this.stopPropagationHint = !1, this.currentTarget = null, this.target = null;
    }, r;
  }()
), wo = (
  /** @class */
  function() {
    function r(e) {
      this._pointerId = e, this._flags = r.FLAGS.NONE;
    }
    return r.prototype._doSet = function(e, t) {
      t ? this._flags = this._flags | e : this._flags = this._flags & ~e;
    }, Object.defineProperty(r.prototype, "pointerId", {
      /**
       * Unique pointer id of the event
       * @readonly
       * @private
       * @member {number}
       */
      get: function() {
        return this._pointerId;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "flags", {
      /**
       * State of the tracking data, expressed as bit flags
       * @private
       * @member {number}
       */
      get: function() {
        return this._flags;
      },
      set: function(e) {
        this._flags = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "none", {
      /**
       * Is the tracked event inactive (not over or down)?
       * @private
       * @member {number}
       */
      get: function() {
        return this._flags === r.FLAGS.NONE;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "over", {
      /**
       * Is the tracked event over the DisplayObject?
       * @private
       * @member {boolean}
       */
      get: function() {
        return (this._flags & r.FLAGS.OVER) !== 0;
      },
      set: function(e) {
        this._doSet(r.FLAGS.OVER, e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "rightDown", {
      /**
       * Did the right mouse button come down in the DisplayObject?
       * @private
       * @member {boolean}
       */
      get: function() {
        return (this._flags & r.FLAGS.RIGHT_DOWN) !== 0;
      },
      set: function(e) {
        this._doSet(r.FLAGS.RIGHT_DOWN, e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "leftDown", {
      /**
       * Did the left mouse button come down in the DisplayObject?
       * @private
       * @member {boolean}
       */
      get: function() {
        return (this._flags & r.FLAGS.LEFT_DOWN) !== 0;
      },
      set: function(e) {
        this._doSet(r.FLAGS.LEFT_DOWN, e);
      },
      enumerable: !1,
      configurable: !0
    }), r.FLAGS = Object.freeze({
      NONE: 0,
      OVER: 1,
      LEFT_DOWN: 2,
      RIGHT_DOWN: 4
    }), r;
  }()
), K0 = (
  /** @class */
  function() {
    function r() {
      this._tempPoint = new yt();
    }
    return r.prototype.recursiveFindHit = function(e, t, i, n, o) {
      var s;
      if (!t || !t.visible)
        return !1;
      var a = e.data.global;
      o = t.interactive || o;
      var h = !1, u = o, l = !0;
      if (t.hitArea)
        n && (t.worldTransform.applyInverse(a, this._tempPoint), t.hitArea.contains(this._tempPoint.x, this._tempPoint.y) ? h = !0 : (n = !1, l = !1)), u = !1;
      else if (t._mask && n) {
        var c = t._mask.isMaskData ? t._mask.maskObject : t._mask;
        c && !(!((s = c.containsPoint) === null || s === void 0) && s.call(c, a)) && (n = !1);
      }
      if (l && t.interactiveChildren && t.children)
        for (var d = t.children, f = d.length - 1; f >= 0; f--) {
          var p = d[f], m = this.recursiveFindHit(e, p, i, n, u);
          if (m) {
            if (!p.parent)
              continue;
            u = !1, m && (e.target && (n = !1), h = !0);
          }
        }
      return o && (n && !e.target && !t.hitArea && t.containsPoint && t.containsPoint(a) && (h = !0), t.interactive && (h && !e.target && (e.target = t), i && i(e, t, !!h))), h;
    }, r.prototype.findHit = function(e, t, i, n) {
      this.recursiveFindHit(e, t, i, n, !1);
    }, r;
  }()
), Z0 = {
  interactive: !1,
  interactiveChildren: !0,
  hitArea: null,
  /**
   * If enabled, the mouse cursor use the pointer behavior when hovered over the displayObject if it is interactive
   * Setting this changes the 'cursor' property to `'pointer'`.
   * @example
   * const sprite = new PIXI.Sprite(texture);
   * sprite.interactive = true;
   * sprite.buttonMode = true;
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   */
  get buttonMode() {
    return this.cursor === "pointer";
  },
  set buttonMode(r) {
    r ? this.cursor = "pointer" : this.cursor === "pointer" && (this.cursor = null);
  },
  /**
   * This defines what cursor mode is used when the mouse cursor
   * is hovered over the displayObject.
   * @example
   * const sprite = new PIXI.Sprite(texture);
   * sprite.interactive = true;
   * sprite.cursor = 'wait';
   * @see https://developer.mozilla.org/en/docs/Web/CSS/cursor
   * @member {string}
   * @memberof PIXI.DisplayObject#
   */
  cursor: null,
  /**
   * Internal set of all active pointers, by identifier
   * @member {Map<number, InteractionTrackingData>}
   * @memberof PIXI.DisplayObject#
   * @private
   */
  get trackedPointers() {
    return this._trackedPointers === void 0 && (this._trackedPointers = {}), this._trackedPointers;
  },
  /**
   * Map of all tracked pointers, by identifier. Use trackedPointers to access.
   * @private
   * @type {Map<number, InteractionTrackingData>}
   */
  _trackedPointers: void 0
};
wt.mixin(Z0);
var Ki = 1, Zi = {
  target: null,
  data: {
    global: null
  }
}, J0 = (
  /** @class */
  function(r) {
    W0(e, r);
    function e(t, i) {
      var n = r.call(this) || this;
      return i = i || {}, n.renderer = t, n.autoPreventDefault = i.autoPreventDefault !== void 0 ? i.autoPreventDefault : !0, n.interactionFrequency = i.interactionFrequency || 10, n.mouse = new qh(), n.mouse.identifier = Ki, n.mouse.global.set(-999999), n.activeInteractionData = {}, n.activeInteractionData[Ki] = n.mouse, n.interactionDataPool = [], n.eventData = new q0(), n.interactionDOMElement = null, n.moveWhenInside = !1, n.eventsAdded = !1, n.tickerAdded = !1, n.mouseOverRenderer = !("PointerEvent" in globalThis), n.supportsTouchEvents = "ontouchstart" in globalThis, n.supportsPointerEvents = !!globalThis.PointerEvent, n.onPointerUp = n.onPointerUp.bind(n), n.processPointerUp = n.processPointerUp.bind(n), n.onPointerCancel = n.onPointerCancel.bind(n), n.processPointerCancel = n.processPointerCancel.bind(n), n.onPointerDown = n.onPointerDown.bind(n), n.processPointerDown = n.processPointerDown.bind(n), n.onPointerMove = n.onPointerMove.bind(n), n.processPointerMove = n.processPointerMove.bind(n), n.onPointerOut = n.onPointerOut.bind(n), n.processPointerOverOut = n.processPointerOverOut.bind(n), n.onPointerOver = n.onPointerOver.bind(n), n.cursorStyles = {
        default: "inherit",
        pointer: "pointer"
      }, n.currentCursorMode = null, n.cursor = null, n.resolution = 1, n.delayedEvents = [], n.search = new K0(), n._tempDisplayObject = new Rl(), n._eventListenerOptions = { capture: !0, passive: !1 }, n._useSystemTicker = i.useSystemTicker !== void 0 ? i.useSystemTicker : !0, n.setTargetElement(n.renderer.view, n.renderer.resolution), n;
    }
    return Object.defineProperty(e.prototype, "useSystemTicker", {
      /**
       * Should the InteractionManager automatically add {@link tickerUpdate} to {@link PIXI.Ticker.system}.
       * @default true
       */
      get: function() {
        return this._useSystemTicker;
      },
      set: function(t) {
        this._useSystemTicker = t, t ? this.addTickerListener() : this.removeTickerListener();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "lastObjectRendered", {
      /**
       * Last rendered object or temp object.
       * @readonly
       * @protected
       */
      get: function() {
        return this.renderer._lastObjectRendered || this._tempDisplayObject;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.hitTest = function(t, i) {
      return Zi.target = null, Zi.data.global = t, i || (i = this.lastObjectRendered), this.processInteractive(Zi, i, null, !0), Zi.target;
    }, e.prototype.setTargetElement = function(t, i) {
      i === void 0 && (i = 1), this.removeTickerListener(), this.removeEvents(), this.interactionDOMElement = t, this.resolution = i, this.addEvents(), this.addTickerListener();
    }, e.prototype.addTickerListener = function() {
      this.tickerAdded || !this.interactionDOMElement || !this._useSystemTicker || (Ft.system.add(this.tickerUpdate, this, be.INTERACTION), this.tickerAdded = !0);
    }, e.prototype.removeTickerListener = function() {
      this.tickerAdded && (Ft.system.remove(this.tickerUpdate, this), this.tickerAdded = !1);
    }, e.prototype.addEvents = function() {
      if (!(this.eventsAdded || !this.interactionDOMElement)) {
        var t = this.interactionDOMElement.style;
        globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "none", t.msTouchAction = "none") : this.supportsPointerEvents && (t.touchAction = "none"), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerover", this.onPointerOver, this._eventListenerOptions), globalThis.addEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions), globalThis.addEventListener("pointerup", this.onPointerUp, this._eventListenerOptions)) : (globalThis.document.addEventListener("mousemove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mousedown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mouseout", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mouseover", this.onPointerOver, this._eventListenerOptions), globalThis.addEventListener("mouseup", this.onPointerUp, this._eventListenerOptions)), this.supportsTouchEvents && (this.interactionDOMElement.addEventListener("touchstart", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchend", this.onPointerUp, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchmove", this.onPointerMove, this._eventListenerOptions)), this.eventsAdded = !0;
      }
    }, e.prototype.removeEvents = function() {
      if (!(!this.eventsAdded || !this.interactionDOMElement)) {
        var t = this.interactionDOMElement.style;
        globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "", t.msTouchAction = "") : this.supportsPointerEvents && (t.touchAction = ""), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerover", this.onPointerOver, this._eventListenerOptions), globalThis.removeEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions), globalThis.removeEventListener("pointerup", this.onPointerUp, this._eventListenerOptions)) : (globalThis.document.removeEventListener("mousemove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mousedown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mouseout", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mouseover", this.onPointerOver, this._eventListenerOptions), globalThis.removeEventListener("mouseup", this.onPointerUp, this._eventListenerOptions)), this.supportsTouchEvents && (this.interactionDOMElement.removeEventListener("touchstart", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchend", this.onPointerUp, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchmove", this.onPointerMove, this._eventListenerOptions)), this.interactionDOMElement = null, this.eventsAdded = !1;
      }
    }, e.prototype.tickerUpdate = function(t) {
      this._deltaTime += t, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this.update());
    }, e.prototype.update = function() {
      if (this.interactionDOMElement) {
        if (this._didMove) {
          this._didMove = !1;
          return;
        }
        this.cursor = null;
        for (var t in this.activeInteractionData)
          if (this.activeInteractionData.hasOwnProperty(t)) {
            var i = this.activeInteractionData[t];
            if (i.originalEvent && i.pointerType !== "touch") {
              var n = this.configureInteractionEventForDOMEvent(this.eventData, i.originalEvent, i);
              this.processInteractive(n, this.lastObjectRendered, this.processPointerOverOut, !0);
            }
          }
        this.setCursorMode(this.cursor);
      }
    }, e.prototype.setCursorMode = function(t) {
      t = t || "default";
      var i = !0;
      if (globalThis.OffscreenCanvas && this.interactionDOMElement instanceof OffscreenCanvas && (i = !1), this.currentCursorMode !== t) {
        this.currentCursorMode = t;
        var n = this.cursorStyles[t];
        if (n)
          switch (typeof n) {
            case "string":
              i && (this.interactionDOMElement.style.cursor = n);
              break;
            case "function":
              n(t);
              break;
            case "object":
              i && Object.assign(this.interactionDOMElement.style, n);
              break;
          }
        else
          i && typeof t == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) && (this.interactionDOMElement.style.cursor = t);
      }
    }, e.prototype.dispatchEvent = function(t, i, n) {
      (!n.stopPropagationHint || t === n.stopsPropagatingAt) && (n.currentTarget = t, n.type = i, t.emit(i, n), t[i] && t[i](n));
    }, e.prototype.delayDispatchEvent = function(t, i, n) {
      this.delayedEvents.push({ displayObject: t, eventString: i, eventData: n });
    }, e.prototype.mapPositionToPoint = function(t, i, n) {
      var o;
      this.interactionDOMElement.parentElement ? o = this.interactionDOMElement.getBoundingClientRect() : o = {
        x: 0,
        y: 0,
        width: this.interactionDOMElement.width,
        height: this.interactionDOMElement.height,
        left: 0,
        top: 0
      };
      var s = 1 / this.resolution;
      t.x = (i - o.left) * (this.interactionDOMElement.width / o.width) * s, t.y = (n - o.top) * (this.interactionDOMElement.height / o.height) * s;
    }, e.prototype.processInteractive = function(t, i, n, o) {
      var s = this.search.findHit(t, i, n, o), a = this.delayedEvents;
      if (!a.length)
        return s;
      t.stopPropagationHint = !1;
      var h = a.length;
      this.delayedEvents = [];
      for (var u = 0; u < h; u++) {
        var l = a[u], c = l.displayObject, d = l.eventString, f = l.eventData;
        f.stopsPropagatingAt === c && (f.stopPropagationHint = !0), this.dispatchEvent(c, d, f);
      }
      return s;
    }, e.prototype.onPointerDown = function(t) {
      if (!(this.supportsTouchEvents && t.pointerType === "touch")) {
        var i = this.normalizeToPointerData(t);
        if (this.autoPreventDefault && i[0].isNormalized) {
          var n = t.cancelable || !("cancelable" in t);
          n && t.preventDefault();
        }
        for (var o = i.length, s = 0; s < o; s++) {
          var a = i[s], h = this.getInteractionDataForPointerId(a), u = this.configureInteractionEventForDOMEvent(this.eventData, a, h);
          if (u.data.originalEvent = t, this.processInteractive(u, this.lastObjectRendered, this.processPointerDown, !0), this.emit("pointerdown", u), a.pointerType === "touch")
            this.emit("touchstart", u);
          else if (a.pointerType === "mouse" || a.pointerType === "pen") {
            var l = a.button === 2;
            this.emit(l ? "rightdown" : "mousedown", this.eventData);
          }
        }
      }
    }, e.prototype.processPointerDown = function(t, i, n) {
      var o = t.data, s = t.data.identifier;
      if (n) {
        if (i.trackedPointers[s] || (i.trackedPointers[s] = new wo(s)), this.dispatchEvent(i, "pointerdown", t), o.pointerType === "touch")
          this.dispatchEvent(i, "touchstart", t);
        else if (o.pointerType === "mouse" || o.pointerType === "pen") {
          var a = o.button === 2;
          a ? i.trackedPointers[s].rightDown = !0 : i.trackedPointers[s].leftDown = !0, this.dispatchEvent(i, a ? "rightdown" : "mousedown", t);
        }
      }
    }, e.prototype.onPointerComplete = function(t, i, n) {
      var o = this.normalizeToPointerData(t), s = o.length, a = t.target;
      t.composedPath && t.composedPath().length > 0 && (a = t.composedPath()[0]);
      for (var h = a !== this.interactionDOMElement ? "outside" : "", u = 0; u < s; u++) {
        var l = o[u], c = this.getInteractionDataForPointerId(l), d = this.configureInteractionEventForDOMEvent(this.eventData, l, c);
        if (d.data.originalEvent = t, this.processInteractive(d, this.lastObjectRendered, n, i || !h), this.emit(i ? "pointercancel" : "pointerup" + h, d), l.pointerType === "mouse" || l.pointerType === "pen") {
          var f = l.button === 2;
          this.emit(f ? "rightup" + h : "mouseup" + h, d);
        } else
          l.pointerType === "touch" && (this.emit(i ? "touchcancel" : "touchend" + h, d), this.releaseInteractionDataForPointerId(l.pointerId));
      }
    }, e.prototype.onPointerCancel = function(t) {
      this.supportsTouchEvents && t.pointerType === "touch" || this.onPointerComplete(t, !0, this.processPointerCancel);
    }, e.prototype.processPointerCancel = function(t, i) {
      var n = t.data, o = t.data.identifier;
      i.trackedPointers[o] !== void 0 && (delete i.trackedPointers[o], this.dispatchEvent(i, "pointercancel", t), n.pointerType === "touch" && this.dispatchEvent(i, "touchcancel", t));
    }, e.prototype.onPointerUp = function(t) {
      this.supportsTouchEvents && t.pointerType === "touch" || this.onPointerComplete(t, !1, this.processPointerUp);
    }, e.prototype.processPointerUp = function(t, i, n) {
      var o = t.data, s = t.data.identifier, a = i.trackedPointers[s], h = o.pointerType === "touch", u = o.pointerType === "mouse" || o.pointerType === "pen", l = !1;
      if (u) {
        var c = o.button === 2, d = wo.FLAGS, f = c ? d.RIGHT_DOWN : d.LEFT_DOWN, p = a !== void 0 && a.flags & f;
        n ? (this.dispatchEvent(i, c ? "rightup" : "mouseup", t), p && (this.dispatchEvent(i, c ? "rightclick" : "click", t), l = !0)) : p && this.dispatchEvent(i, c ? "rightupoutside" : "mouseupoutside", t), a && (c ? a.rightDown = !1 : a.leftDown = !1);
      }
      n ? (this.dispatchEvent(i, "pointerup", t), h && this.dispatchEvent(i, "touchend", t), a && ((!u || l) && this.dispatchEvent(i, "pointertap", t), h && (this.dispatchEvent(i, "tap", t), a.over = !1))) : a && (this.dispatchEvent(i, "pointerupoutside", t), h && this.dispatchEvent(i, "touchendoutside", t)), a && a.none && delete i.trackedPointers[s];
    }, e.prototype.onPointerMove = function(t) {
      if (!(this.supportsTouchEvents && t.pointerType === "touch")) {
        var i = this.normalizeToPointerData(t);
        (i[0].pointerType === "mouse" || i[0].pointerType === "pen") && (this._didMove = !0, this.cursor = null);
        for (var n = i.length, o = 0; o < n; o++) {
          var s = i[o], a = this.getInteractionDataForPointerId(s), h = this.configureInteractionEventForDOMEvent(this.eventData, s, a);
          h.data.originalEvent = t, this.processInteractive(h, this.lastObjectRendered, this.processPointerMove, !0), this.emit("pointermove", h), s.pointerType === "touch" && this.emit("touchmove", h), (s.pointerType === "mouse" || s.pointerType === "pen") && this.emit("mousemove", h);
        }
        i[0].pointerType === "mouse" && this.setCursorMode(this.cursor);
      }
    }, e.prototype.processPointerMove = function(t, i, n) {
      var o = t.data, s = o.pointerType === "touch", a = o.pointerType === "mouse" || o.pointerType === "pen";
      a && this.processPointerOverOut(t, i, n), (!this.moveWhenInside || n) && (this.dispatchEvent(i, "pointermove", t), s && this.dispatchEvent(i, "touchmove", t), a && this.dispatchEvent(i, "mousemove", t));
    }, e.prototype.onPointerOut = function(t) {
      if (!(this.supportsTouchEvents && t.pointerType === "touch")) {
        var i = this.normalizeToPointerData(t), n = i[0];
        n.pointerType === "mouse" && (this.mouseOverRenderer = !1, this.setCursorMode(null));
        var o = this.getInteractionDataForPointerId(n), s = this.configureInteractionEventForDOMEvent(this.eventData, n, o);
        s.data.originalEvent = n, this.processInteractive(s, this.lastObjectRendered, this.processPointerOverOut, !1), this.emit("pointerout", s), n.pointerType === "mouse" || n.pointerType === "pen" ? this.emit("mouseout", s) : this.releaseInteractionDataForPointerId(o.identifier);
      }
    }, e.prototype.processPointerOverOut = function(t, i, n) {
      var o = t.data, s = t.data.identifier, a = o.pointerType === "mouse" || o.pointerType === "pen", h = i.trackedPointers[s];
      n && !h && (h = i.trackedPointers[s] = new wo(s)), h !== void 0 && (n && this.mouseOverRenderer ? (h.over || (h.over = !0, this.delayDispatchEvent(i, "pointerover", t), a && this.delayDispatchEvent(i, "mouseover", t)), a && this.cursor === null && (this.cursor = i.cursor)) : h.over && (h.over = !1, this.dispatchEvent(i, "pointerout", this.eventData), a && this.dispatchEvent(i, "mouseout", t), h.none && delete i.trackedPointers[s]));
    }, e.prototype.onPointerOver = function(t) {
      if (!(this.supportsTouchEvents && t.pointerType === "touch")) {
        var i = this.normalizeToPointerData(t), n = i[0], o = this.getInteractionDataForPointerId(n), s = this.configureInteractionEventForDOMEvent(this.eventData, n, o);
        s.data.originalEvent = n, n.pointerType === "mouse" && (this.mouseOverRenderer = !0), this.emit("pointerover", s), (n.pointerType === "mouse" || n.pointerType === "pen") && this.emit("mouseover", s);
      }
    }, e.prototype.getInteractionDataForPointerId = function(t) {
      var i = t.pointerId, n;
      return i === Ki || t.pointerType === "mouse" ? n = this.mouse : this.activeInteractionData[i] ? n = this.activeInteractionData[i] : (n = this.interactionDataPool.pop() || new qh(), n.identifier = i, this.activeInteractionData[i] = n), n.copyEvent(t), n;
    }, e.prototype.releaseInteractionDataForPointerId = function(t) {
      var i = this.activeInteractionData[t];
      i && (delete this.activeInteractionData[t], i.reset(), this.interactionDataPool.push(i));
    }, e.prototype.configureInteractionEventForDOMEvent = function(t, i, n) {
      return t.data = n, this.mapPositionToPoint(n.global, i.clientX, i.clientY), i.pointerType === "touch" && (i.globalX = n.global.x, i.globalY = n.global.y), n.originalEvent = i, t.reset(), t;
    }, e.prototype.normalizeToPointerData = function(t) {
      var i = [];
      if (this.supportsTouchEvents && t instanceof TouchEvent)
        for (var n = 0, o = t.changedTouches.length; n < o; n++) {
          var s = t.changedTouches[n];
          typeof s.button > "u" && (s.button = t.touches.length ? 1 : 0), typeof s.buttons > "u" && (s.buttons = t.touches.length ? 1 : 0), typeof s.isPrimary > "u" && (s.isPrimary = t.touches.length === 1 && t.type === "touchstart"), typeof s.width > "u" && (s.width = s.radiusX || 1), typeof s.height > "u" && (s.height = s.radiusY || 1), typeof s.tiltX > "u" && (s.tiltX = 0), typeof s.tiltY > "u" && (s.tiltY = 0), typeof s.pointerType > "u" && (s.pointerType = "touch"), typeof s.pointerId > "u" && (s.pointerId = s.identifier || 0), typeof s.pressure > "u" && (s.pressure = s.force || 0.5), typeof s.twist > "u" && (s.twist = 0), typeof s.tangentialPressure > "u" && (s.tangentialPressure = 0), typeof s.layerX > "u" && (s.layerX = s.offsetX = s.clientX), typeof s.layerY > "u" && (s.layerY = s.offsetY = s.clientY), s.isNormalized = !0, i.push(s);
        }
      else if (!globalThis.MouseEvent || t instanceof MouseEvent && (!this.supportsPointerEvents || !(t instanceof globalThis.PointerEvent))) {
        var a = t;
        typeof a.isPrimary > "u" && (a.isPrimary = !0), typeof a.width > "u" && (a.width = 1), typeof a.height > "u" && (a.height = 1), typeof a.tiltX > "u" && (a.tiltX = 0), typeof a.tiltY > "u" && (a.tiltY = 0), typeof a.pointerType > "u" && (a.pointerType = "mouse"), typeof a.pointerId > "u" && (a.pointerId = Ki), typeof a.pressure > "u" && (a.pressure = 0.5), typeof a.twist > "u" && (a.twist = 0), typeof a.tangentialPressure > "u" && (a.tangentialPressure = 0), a.isNormalized = !0, i.push(a);
      } else
        i.push(t);
      return i;
    }, e.prototype.destroy = function() {
      this.removeEvents(), this.removeTickerListener(), this.removeAllListeners(), this.renderer = null, this.mouse = null, this.eventData = null, this.interactionDOMElement = null, this.onPointerDown = null, this.processPointerDown = null, this.onPointerUp = null, this.processPointerUp = null, this.onPointerCancel = null, this.processPointerCancel = null, this.onPointerMove = null, this.processPointerMove = null, this.onPointerOut = null, this.processPointerOverOut = null, this.onPointerOver = null, this.search = null;
    }, e.extension = {
      name: "interaction",
      type: [
        ft.RendererPlugin,
        ft.CanvasRendererPlugin
      ]
    }, e;
  }(Si)
);
/*!
 * @pixi/extract - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/extract is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Q0 = new nt(), tb = 4, eb = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e;
    }
    return r.prototype.image = function(e, t, i) {
      var n = new Image();
      return n.src = this.base64(e, t, i), n;
    }, r.prototype.base64 = function(e, t, i) {
      return this.canvas(e).toDataURL(t, i);
    }, r.prototype.canvas = function(e, t) {
      var i = this._rawPixels(e, t), n = i.pixels, o = i.width, s = i.height, a = i.flipY, h = new Dh(o, s, 1), u = h.context.getImageData(0, 0, o, s);
      if (r.arrayPostDivide(n, u.data), h.context.putImageData(u, 0, 0), a) {
        var l = new Dh(h.width, h.height, 1);
        l.context.scale(1, -1), l.context.drawImage(h.canvas, 0, -s), h.destroy(), h = l;
      }
      return h.canvas;
    }, r.prototype.pixels = function(e, t) {
      var i = this._rawPixels(e, t).pixels;
      return r.arrayPostDivide(i, i), i;
    }, r.prototype._rawPixels = function(e, t) {
      var i = this.renderer, n, o = !1, s, a = !1;
      if (e)
        if (e instanceof ar)
          s = e;
        else {
          var h = i.context.webGLVersion >= 2 ? i.multisample : gt.NONE;
          if (s = this.renderer.generateTexture(e, { multisample: h }), h !== gt.NONE) {
            var u = ar.create({
              width: s.width,
              height: s.height
            });
            i.framebuffer.bind(s.framebuffer), i.framebuffer.blit(u.framebuffer), i.framebuffer.bind(null), s.destroy(!0), s = u;
          }
          a = !0;
        }
      s ? (n = s.baseTexture.resolution, t = t ?? s.frame, o = !1, i.renderTexture.bind(s)) : (n = i.resolution, t || (t = Q0, t.width = i.width, t.height = i.height), o = !0, i.renderTexture.bind(null));
      var l = Math.round(t.width * n), c = Math.round(t.height * n), d = new Uint8Array(tb * l * c), f = i.gl;
      return f.readPixels(Math.round(t.x * n), Math.round(t.y * n), l, c, f.RGBA, f.UNSIGNED_BYTE, d), a && s.destroy(!0), { pixels: d, width: l, height: c, flipY: o };
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r.arrayPostDivide = function(e, t) {
      for (var i = 0; i < e.length; i += 4) {
        var n = t[i + 3] = e[i + 3];
        n !== 0 ? (t[i] = Math.round(Math.min(e[i] * 255 / n, 255)), t[i + 1] = Math.round(Math.min(e[i + 1] * 255 / n, 255)), t[i + 2] = Math.round(Math.min(e[i + 2] * 255 / n, 255))) : (t[i] = e[i], t[i + 1] = e[i + 1], t[i + 2] = e[i + 2]);
      }
    }, r.extension = {
      name: "extract",
      type: ft.RendererPlugin
    }, r;
  }()
);
/*!
 * @pixi/loaders - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/loaders is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Ji = (
  /** @class */
  function() {
    function r(e, t, i) {
      t === void 0 && (t = !1), this._fn = e, this._once = t, this._thisArg = i, this._next = this._prev = this._owner = null;
    }
    return r.prototype.detach = function() {
      return this._owner === null ? !1 : (this._owner.detach(this), !0);
    }, r;
  }()
);
function Kh(r, e) {
  return r._head ? (r._tail._next = e, e._prev = r._tail, r._tail = e) : (r._head = e, r._tail = e), e._owner = r, e;
}
var ye = (
  /** @class */
  function() {
    function r() {
      this._head = this._tail = void 0;
    }
    return r.prototype.handlers = function(e) {
      e === void 0 && (e = !1);
      var t = this._head;
      if (e)
        return !!t;
      for (var i = []; t; )
        i.push(t), t = t._next;
      return i;
    }, r.prototype.has = function(e) {
      if (!(e instanceof Ji))
        throw new Error("MiniSignal#has(): First arg must be a SignalBinding object.");
      return e._owner === this;
    }, r.prototype.dispatch = function() {
      for (var e = arguments, t = [], i = 0; i < arguments.length; i++)
        t[i] = e[i];
      var n = this._head;
      if (!n)
        return !1;
      for (; n; )
        n._once && this.detach(n), n._fn.apply(n._thisArg, t), n = n._next;
      return !0;
    }, r.prototype.add = function(e, t) {
      if (t === void 0 && (t = null), typeof e != "function")
        throw new Error("MiniSignal#add(): First arg must be a Function.");
      return Kh(this, new Ji(e, !1, t));
    }, r.prototype.once = function(e, t) {
      if (t === void 0 && (t = null), typeof e != "function")
        throw new Error("MiniSignal#once(): First arg must be a Function.");
      return Kh(this, new Ji(e, !0, t));
    }, r.prototype.detach = function(e) {
      if (!(e instanceof Ji))
        throw new Error("MiniSignal#detach(): First arg must be a SignalBinding object.");
      return e._owner !== this ? this : (e._prev && (e._prev._next = e._next), e._next && (e._next._prev = e._prev), e === this._head ? (this._head = e._next, e._next === null && (this._tail = null)) : e === this._tail && (this._tail = e._prev, this._tail._next = null), e._owner = null, this);
    }, r.prototype.detachAll = function() {
      var e = this._head;
      if (!e)
        return this;
      for (this._head = this._tail = null; e; )
        e._owner = null, e = e._next;
      return this;
    }, r;
  }()
);
function $l(r, e) {
  e = e || {};
  for (var t = {
    // eslint-disable-next-line max-len
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
      name: "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      // eslint-disable-next-line max-len
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      // eslint-disable-next-line max-len
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  }, i = t.parser[e.strictMode ? "strict" : "loose"].exec(r), n = {}, o = 14; o--; )
    n[t.key[o]] = i[o] || "";
  return n[t.q.name] = {}, n[t.key[12]].replace(t.q.parser, function(s, a, h) {
    a && (n[t.q.name][a] = h);
  }), n;
}
var Oo, Qi = null, rb = 0, Zh = 200, ib = 204, nb = 1223, ob = 2;
function Jh() {
}
function Qh(r, e, t) {
  e && e.indexOf(".") === 0 && (e = e.substring(1)), e && (r[e] = t);
}
function Ro(r) {
  return r.toString().replace("object ", "");
}
var Et = (
  /** @class */
  function() {
    function r(e, t, i) {
      if (this._dequeue = Jh, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = null, this._boundOnError = null, this._boundOnProgress = null, this._boundOnTimeout = null, this._boundXhrOnError = null, this._boundXhrOnTimeout = null, this._boundXhrOnAbort = null, this._boundXhrOnLoad = null, typeof e != "string" || typeof t != "string")
        throw new Error("Both name and url are required for constructing a resource.");
      i = i || {}, this._flags = 0, this._setFlag(r.STATUS_FLAGS.DATA_URL, t.indexOf("data:") === 0), this.name = e, this.url = t, this.extension = this._getExtension(), this.data = null, this.crossOrigin = i.crossOrigin === !0 ? "anonymous" : i.crossOrigin, this.timeout = i.timeout || 0, this.loadType = i.loadType || this._determineLoadType(), this.xhrType = i.xhrType, this.metadata = i.metadata || {}, this.error = null, this.xhr = null, this.children = [], this.type = r.TYPE.UNKNOWN, this.progressChunk = 0, this._dequeue = Jh, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = this.complete.bind(this), this._boundOnError = this._onError.bind(this), this._boundOnProgress = this._onProgress.bind(this), this._boundOnTimeout = this._onTimeout.bind(this), this._boundXhrOnError = this._xhrOnError.bind(this), this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this), this._boundXhrOnAbort = this._xhrOnAbort.bind(this), this._boundXhrOnLoad = this._xhrOnLoad.bind(this), this.onStart = new ye(), this.onProgress = new ye(), this.onComplete = new ye(), this.onAfterMiddleware = new ye();
    }
    return r.setExtensionLoadType = function(e, t) {
      Qh(r._loadTypeMap, e, t);
    }, r.setExtensionXhrType = function(e, t) {
      Qh(r._xhrTypeMap, e, t);
    }, Object.defineProperty(r.prototype, "isDataUrl", {
      /**
       * When the resource starts to load.
       * @memberof PIXI.LoaderResource
       * @callback OnStartSignal
       * @param {PIXI.Resource} resource - The resource that the event happened on.
       */
      /**
       * When the resource reports loading progress.
       * @memberof PIXI.LoaderResource
       * @callback OnProgressSignal
       * @param {PIXI.Resource} resource - The resource that the event happened on.
       * @param {number} percentage - The progress of the load in the range [0, 1].
       */
      /**
       * When the resource finishes loading.
       * @memberof PIXI.LoaderResource
       * @callback OnCompleteSignal
       * @param {PIXI.Resource} resource - The resource that the event happened on.
       */
      /**
       * @memberof PIXI.LoaderResource
       * @typedef {object} IMetadata
       * @property {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [loadElement=null] - The
       *      element to use for loading, instead of creating one.
       * @property {boolean} [skipSource=false] - Skips adding source(s) to the load element. This
       *      is useful if you want to pass in a `loadElement` that you already added load sources to.
       * @property {string|string[]} [mimeType] - The mime type to use for the source element
       *      of a video/audio elment. If the urls are an array, you can pass this as an array as well
       *      where each index is the mime type to use for the corresponding url index.
       */
      /**
       * Stores whether or not this url is a data url.
       * @readonly
       * @member {boolean}
       */
      get: function() {
        return this._hasFlag(r.STATUS_FLAGS.DATA_URL);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "isComplete", {
      /**
       * Describes if this resource has finished loading. Is true when the resource has completely
       * loaded.
       * @readonly
       * @member {boolean}
       */
      get: function() {
        return this._hasFlag(r.STATUS_FLAGS.COMPLETE);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "isLoading", {
      /**
       * Describes if this resource is currently loading. Is true when the resource starts loading,
       * and is false again when complete.
       * @readonly
       * @member {boolean}
       */
      get: function() {
        return this._hasFlag(r.STATUS_FLAGS.LOADING);
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.complete = function() {
      this._clearEvents(), this._finish();
    }, r.prototype.abort = function(e) {
      if (!this.error) {
        if (this.error = new Error(e), this._clearEvents(), this.xhr)
          this.xhr.abort();
        else if (this.xdr)
          this.xdr.abort();
        else if (this.data)
          if (this.data.src)
            this.data.src = r.EMPTY_GIF;
          else
            for (; this.data.firstChild; )
              this.data.removeChild(this.data.firstChild);
        this._finish();
      }
    }, r.prototype.load = function(e) {
      var t = this;
      if (!this.isLoading) {
        if (this.isComplete) {
          e && setTimeout(function() {
            return e(t);
          }, 1);
          return;
        } else
          e && this.onComplete.once(e);
        switch (this._setFlag(r.STATUS_FLAGS.LOADING, !0), this.onStart.dispatch(this), (this.crossOrigin === !1 || typeof this.crossOrigin != "string") && (this.crossOrigin = this._determineCrossOrigin(this.url)), this.loadType) {
          case r.LOAD_TYPE.IMAGE:
            this.type = r.TYPE.IMAGE, this._loadElement("image");
            break;
          case r.LOAD_TYPE.AUDIO:
            this.type = r.TYPE.AUDIO, this._loadSourceElement("audio");
            break;
          case r.LOAD_TYPE.VIDEO:
            this.type = r.TYPE.VIDEO, this._loadSourceElement("video");
            break;
          case r.LOAD_TYPE.XHR:
          default:
            typeof Oo > "u" && (Oo = !!(globalThis.XDomainRequest && !("withCredentials" in new XMLHttpRequest()))), Oo && this.crossOrigin ? this._loadXdr() : this._loadXhr();
            break;
        }
      }
    }, r.prototype._hasFlag = function(e) {
      return (this._flags & e) !== 0;
    }, r.prototype._setFlag = function(e, t) {
      this._flags = t ? this._flags | e : this._flags & ~e;
    }, r.prototype._clearEvents = function() {
      clearTimeout(this._elementTimer), this.data && this.data.removeEventListener && (this.data.removeEventListener("error", this._boundOnError, !1), this.data.removeEventListener("load", this._boundComplete, !1), this.data.removeEventListener("progress", this._boundOnProgress, !1), this.data.removeEventListener("canplaythrough", this._boundComplete, !1)), this.xhr && (this.xhr.removeEventListener ? (this.xhr.removeEventListener("error", this._boundXhrOnError, !1), this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, !1), this.xhr.removeEventListener("abort", this._boundXhrOnAbort, !1), this.xhr.removeEventListener("progress", this._boundOnProgress, !1), this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1)) : (this.xhr.onerror = null, this.xhr.ontimeout = null, this.xhr.onprogress = null, this.xhr.onload = null));
    }, r.prototype._finish = function() {
      if (this.isComplete)
        throw new Error("Complete called again for an already completed resource.");
      this._setFlag(r.STATUS_FLAGS.COMPLETE, !0), this._setFlag(r.STATUS_FLAGS.LOADING, !1), this.onComplete.dispatch(this);
    }, r.prototype._loadElement = function(e) {
      this.metadata.loadElement ? this.data = this.metadata.loadElement : e === "image" && typeof globalThis.Image < "u" ? this.data = new Image() : this.data = document.createElement(e), this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), this.metadata.skipSource || (this.data.src = this.url), this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }, r.prototype._loadSourceElement = function(e) {
      if (this.metadata.loadElement ? this.data = this.metadata.loadElement : e === "audio" && typeof globalThis.Audio < "u" ? this.data = new Audio() : this.data = document.createElement(e), this.data === null) {
        this.abort("Unsupported element: " + e);
        return;
      }
      if (this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), !this.metadata.skipSource)
        if (navigator.isCocoonJS)
          this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
        else if (Array.isArray(this.url))
          for (var t = this.metadata.mimeType, i = 0; i < this.url.length; ++i)
            this.data.appendChild(this._createSource(e, this.url[i], Array.isArray(t) ? t[i] : t));
        else {
          var t = this.metadata.mimeType;
          this.data.appendChild(this._createSource(e, this.url, Array.isArray(t) ? t[0] : t));
        }
      this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.data.addEventListener("canplaythrough", this._boundComplete, !1), this.data.load(), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }, r.prototype._loadXhr = function() {
      typeof this.xhrType != "string" && (this.xhrType = this._determineXhrType());
      var e = this.xhr = new XMLHttpRequest();
      this.crossOrigin === "use-credentials" && (e.withCredentials = !0), e.open("GET", this.url, !0), e.timeout = this.timeout, this.xhrType === r.XHR_RESPONSE_TYPE.JSON || this.xhrType === r.XHR_RESPONSE_TYPE.DOCUMENT ? e.responseType = r.XHR_RESPONSE_TYPE.TEXT : e.responseType = this.xhrType, e.addEventListener("error", this._boundXhrOnError, !1), e.addEventListener("timeout", this._boundXhrOnTimeout, !1), e.addEventListener("abort", this._boundXhrOnAbort, !1), e.addEventListener("progress", this._boundOnProgress, !1), e.addEventListener("load", this._boundXhrOnLoad, !1), e.send();
    }, r.prototype._loadXdr = function() {
      typeof this.xhrType != "string" && (this.xhrType = this._determineXhrType());
      var e = this.xhr = new globalThis.XDomainRequest();
      e.timeout = this.timeout || 5e3, e.onerror = this._boundXhrOnError, e.ontimeout = this._boundXhrOnTimeout, e.onprogress = this._boundOnProgress, e.onload = this._boundXhrOnLoad, e.open("GET", this.url, !0), setTimeout(function() {
        return e.send();
      }, 1);
    }, r.prototype._createSource = function(e, t, i) {
      i || (i = e + "/" + this._getExtension(t));
      var n = document.createElement("source");
      return n.src = t, n.type = i, n;
    }, r.prototype._onError = function(e) {
      this.abort("Failed to load element using: " + e.target.nodeName);
    }, r.prototype._onProgress = function(e) {
      e && e.lengthComputable && this.onProgress.dispatch(this, e.loaded / e.total);
    }, r.prototype._onTimeout = function() {
      this.abort("Load timed out.");
    }, r.prototype._xhrOnError = function() {
      var e = this.xhr;
      this.abort(Ro(e) + " Request failed. Status: " + e.status + ', text: "' + e.statusText + '"');
    }, r.prototype._xhrOnTimeout = function() {
      var e = this.xhr;
      this.abort(Ro(e) + " Request timed out.");
    }, r.prototype._xhrOnAbort = function() {
      var e = this.xhr;
      this.abort(Ro(e) + " Request was aborted by the user.");
    }, r.prototype._xhrOnLoad = function() {
      var e = this.xhr, t = "", i = typeof e.status > "u" ? Zh : e.status;
      (e.responseType === "" || e.responseType === "text" || typeof e.responseType > "u") && (t = e.responseText), i === rb && (t.length > 0 || e.responseType === r.XHR_RESPONSE_TYPE.BUFFER) ? i = Zh : i === nb && (i = ib);
      var n = i / 100 | 0;
      if (n === ob)
        if (this.xhrType === r.XHR_RESPONSE_TYPE.TEXT)
          this.data = t, this.type = r.TYPE.TEXT;
        else if (this.xhrType === r.XHR_RESPONSE_TYPE.JSON)
          try {
            this.data = JSON.parse(t), this.type = r.TYPE.JSON;
          } catch (a) {
            this.abort("Error trying to parse loaded json: " + a);
            return;
          }
        else if (this.xhrType === r.XHR_RESPONSE_TYPE.DOCUMENT)
          try {
            if (globalThis.DOMParser) {
              var o = new DOMParser();
              this.data = o.parseFromString(t, "text/xml");
            } else {
              var s = document.createElement("div");
              s.innerHTML = t, this.data = s;
            }
            this.type = r.TYPE.XML;
          } catch (a) {
            this.abort("Error trying to parse loaded xml: " + a);
            return;
          }
        else
          this.data = e.response || t;
      else {
        this.abort("[" + e.status + "] " + e.statusText + ": " + e.responseURL);
        return;
      }
      this.complete();
    }, r.prototype._determineCrossOrigin = function(e, t) {
      if (e.indexOf("data:") === 0)
        return "";
      if (globalThis.origin !== globalThis.location.origin)
        return "anonymous";
      t = t || globalThis.location, Qi || (Qi = document.createElement("a")), Qi.href = e;
      var i = $l(Qi.href, { strictMode: !0 }), n = !i.port && t.port === "" || i.port === t.port, o = i.protocol ? i.protocol + ":" : "";
      return i.host !== t.hostname || !n || o !== t.protocol ? "anonymous" : "";
    }, r.prototype._determineXhrType = function() {
      return r._xhrTypeMap[this.extension] || r.XHR_RESPONSE_TYPE.TEXT;
    }, r.prototype._determineLoadType = function() {
      return r._loadTypeMap[this.extension] || r.LOAD_TYPE.XHR;
    }, r.prototype._getExtension = function(e) {
      e === void 0 && (e = this.url);
      var t = "";
      if (this.isDataUrl) {
        var i = e.indexOf("/");
        t = e.substring(i + 1, e.indexOf(";", i));
      } else {
        var n = e.indexOf("?"), o = e.indexOf("#"), s = Math.min(n > -1 ? n : e.length, o > -1 ? o : e.length);
        e = e.substring(0, s), t = e.substring(e.lastIndexOf(".") + 1);
      }
      return t.toLowerCase();
    }, r.prototype._getMimeFromXhrType = function(e) {
      switch (e) {
        case r.XHR_RESPONSE_TYPE.BUFFER:
          return "application/octet-binary";
        case r.XHR_RESPONSE_TYPE.BLOB:
          return "application/blob";
        case r.XHR_RESPONSE_TYPE.DOCUMENT:
          return "application/xml";
        case r.XHR_RESPONSE_TYPE.JSON:
          return "application/json";
        case r.XHR_RESPONSE_TYPE.DEFAULT:
        case r.XHR_RESPONSE_TYPE.TEXT:
        default:
          return "text/plain";
      }
    }, r;
  }()
);
(function(r) {
  (function(e) {
    e[e.NONE = 0] = "NONE", e[e.DATA_URL = 1] = "DATA_URL", e[e.COMPLETE = 2] = "COMPLETE", e[e.LOADING = 4] = "LOADING";
  })(r.STATUS_FLAGS || (r.STATUS_FLAGS = {})), function(e) {
    e[e.UNKNOWN = 0] = "UNKNOWN", e[e.JSON = 1] = "JSON", e[e.XML = 2] = "XML", e[e.IMAGE = 3] = "IMAGE", e[e.AUDIO = 4] = "AUDIO", e[e.VIDEO = 5] = "VIDEO", e[e.TEXT = 6] = "TEXT";
  }(r.TYPE || (r.TYPE = {})), function(e) {
    e[e.XHR = 1] = "XHR", e[e.IMAGE = 2] = "IMAGE", e[e.AUDIO = 3] = "AUDIO", e[e.VIDEO = 4] = "VIDEO";
  }(r.LOAD_TYPE || (r.LOAD_TYPE = {})), function(e) {
    e.DEFAULT = "text", e.BUFFER = "arraybuffer", e.BLOB = "blob", e.DOCUMENT = "document", e.JSON = "json", e.TEXT = "text";
  }(r.XHR_RESPONSE_TYPE || (r.XHR_RESPONSE_TYPE = {})), r._loadTypeMap = {
    // images
    gif: r.LOAD_TYPE.IMAGE,
    png: r.LOAD_TYPE.IMAGE,
    bmp: r.LOAD_TYPE.IMAGE,
    jpg: r.LOAD_TYPE.IMAGE,
    jpeg: r.LOAD_TYPE.IMAGE,
    tif: r.LOAD_TYPE.IMAGE,
    tiff: r.LOAD_TYPE.IMAGE,
    webp: r.LOAD_TYPE.IMAGE,
    tga: r.LOAD_TYPE.IMAGE,
    avif: r.LOAD_TYPE.IMAGE,
    svg: r.LOAD_TYPE.IMAGE,
    "svg+xml": r.LOAD_TYPE.IMAGE,
    // audio
    mp3: r.LOAD_TYPE.AUDIO,
    ogg: r.LOAD_TYPE.AUDIO,
    wav: r.LOAD_TYPE.AUDIO,
    // videos
    mp4: r.LOAD_TYPE.VIDEO,
    webm: r.LOAD_TYPE.VIDEO
  }, r._xhrTypeMap = {
    // xml
    xhtml: r.XHR_RESPONSE_TYPE.DOCUMENT,
    html: r.XHR_RESPONSE_TYPE.DOCUMENT,
    htm: r.XHR_RESPONSE_TYPE.DOCUMENT,
    xml: r.XHR_RESPONSE_TYPE.DOCUMENT,
    tmx: r.XHR_RESPONSE_TYPE.DOCUMENT,
    svg: r.XHR_RESPONSE_TYPE.DOCUMENT,
    // This was added to handle Tiled Tileset XML, but .tsx is also a TypeScript React Component.
    // Since it is way less likely for people to be loading TypeScript files instead of Tiled files,
    // this should probably be fine.
    tsx: r.XHR_RESPONSE_TYPE.DOCUMENT,
    // images
    gif: r.XHR_RESPONSE_TYPE.BLOB,
    png: r.XHR_RESPONSE_TYPE.BLOB,
    bmp: r.XHR_RESPONSE_TYPE.BLOB,
    jpg: r.XHR_RESPONSE_TYPE.BLOB,
    jpeg: r.XHR_RESPONSE_TYPE.BLOB,
    tif: r.XHR_RESPONSE_TYPE.BLOB,
    tiff: r.XHR_RESPONSE_TYPE.BLOB,
    webp: r.XHR_RESPONSE_TYPE.BLOB,
    tga: r.XHR_RESPONSE_TYPE.BLOB,
    avif: r.XHR_RESPONSE_TYPE.BLOB,
    // json
    json: r.XHR_RESPONSE_TYPE.JSON,
    // text
    text: r.XHR_RESPONSE_TYPE.TEXT,
    txt: r.XHR_RESPONSE_TYPE.TEXT,
    // fonts
    ttf: r.XHR_RESPONSE_TYPE.BUFFER,
    otf: r.XHR_RESPONSE_TYPE.BUFFER
  }, r.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
})(Et || (Et = {}));
function He() {
}
function sb(r) {
  return function() {
    for (var e = arguments, t = [], i = 0; i < arguments.length; i++)
      t[i] = e[i];
    if (r === null)
      throw new Error("Callback was already called.");
    var n = r;
    r = null, n.apply(this, t);
  };
}
var ab = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.data = e, this.callback = t;
    }
    return r;
  }()
), Po = (
  /** @class */
  function() {
    function r(e, t) {
      var i = this;
      if (t === void 0 && (t = 1), this.workers = 0, this.saturated = He, this.unsaturated = He, this.empty = He, this.drain = He, this.error = He, this.started = !1, this.paused = !1, this._tasks = [], this._insert = function(n, o, s) {
        if (s && typeof s != "function")
          throw new Error("task callback must be a function");
        if (i.started = !0, n == null && i.idle()) {
          setTimeout(function() {
            return i.drain();
          }, 1);
          return;
        }
        var a = new ab(n, typeof s == "function" ? s : He);
        o ? i._tasks.unshift(a) : i._tasks.push(a), setTimeout(i.process, 1);
      }, this.process = function() {
        for (; !i.paused && i.workers < i.concurrency && i._tasks.length; ) {
          var n = i._tasks.shift();
          i._tasks.length === 0 && i.empty(), i.workers += 1, i.workers === i.concurrency && i.saturated(), i._worker(n.data, sb(i._next(n)));
        }
      }, this._worker = e, t === 0)
        throw new Error("Concurrency must not be zero");
      this.concurrency = t, this.buffer = t / 4;
    }
    return r.prototype._next = function(e) {
      var t = this;
      return function() {
        for (var i = arguments, n = [], o = 0; o < arguments.length; o++)
          n[o] = i[o];
        t.workers -= 1, e.callback.apply(e, n), n[0] != null && t.error(n[0], e.data), t.workers <= t.concurrency - t.buffer && t.unsaturated(), t.idle() && t.drain(), t.process();
      };
    }, r.prototype.push = function(e, t) {
      this._insert(e, !1, t);
    }, r.prototype.kill = function() {
      this.workers = 0, this.drain = He, this.started = !1, this._tasks = [];
    }, r.prototype.unshift = function(e, t) {
      this._insert(e, !0, t);
    }, r.prototype.length = function() {
      return this._tasks.length;
    }, r.prototype.running = function() {
      return this.workers;
    }, r.prototype.idle = function() {
      return this._tasks.length + this.workers === 0;
    }, r.prototype.pause = function() {
      this.paused !== !0 && (this.paused = !0);
    }, r.prototype.resume = function() {
      if (this.paused !== !1) {
        this.paused = !1;
        for (var e = 1; e <= this.concurrency; e++)
          this.process();
      }
    }, r.eachSeries = function(e, t, i, n) {
      var o = 0, s = e.length;
      function a(h) {
        if (h || o === s) {
          i && i(h);
          return;
        }
        n ? setTimeout(function() {
          t(e[o++], a);
        }, 1) : t(e[o++], a);
      }
      a();
    }, r.queue = function(e, t) {
      return new r(e, t);
    }, r;
  }()
), Mo = 100, hb = /(#[\w-]+)?$/, Cn = (
  /** @class */
  function() {
    function r(e, t) {
      var i = this;
      e === void 0 && (e = ""), t === void 0 && (t = 10), this.progress = 0, this.loading = !1, this.defaultQueryString = "", this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(h, u) {
        return i._loadResource(h, u);
      }, this.resources = {}, this.baseUrl = e, this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(h, u) {
        return i._loadResource(h, u);
      }, this._queue = Po.queue(this._boundLoadResource, t), this._queue.pause(), this.resources = {}, this.onProgress = new ye(), this.onError = new ye(), this.onLoad = new ye(), this.onStart = new ye(), this.onComplete = new ye();
      for (var n = 0; n < r._plugins.length; ++n) {
        var o = r._plugins[n], s = o.pre, a = o.use;
        s && this.pre(s), a && this.use(a);
      }
      this._protected = !1;
    }
    return r.prototype._add = function(e, t, i, n) {
      if (this.loading && (!i || !i.parentResource))
        throw new Error("Cannot add resources while the loader is running.");
      if (this.resources[e])
        throw new Error('Resource named "' + e + '" already exists.');
      if (t = this._prepareUrl(t), this.resources[e] = new Et(e, t, i), typeof n == "function" && this.resources[e].onAfterMiddleware.once(n), this.loading) {
        for (var o = i.parentResource, s = [], a = 0; a < o.children.length; ++a)
          o.children[a].isComplete || s.push(o.children[a]);
        var h = o.progressChunk * (s.length + 1), u = h / (s.length + 2);
        o.children.push(this.resources[e]), o.progressChunk = u;
        for (var a = 0; a < s.length; ++a)
          s[a].progressChunk = u;
        this.resources[e].progressChunk = u;
      }
      return this._queue.push(this.resources[e]), this;
    }, r.prototype.pre = function(e) {
      return this._beforeMiddleware.push(e), this;
    }, r.prototype.use = function(e) {
      return this._afterMiddleware.push(e), this;
    }, r.prototype.reset = function() {
      this.progress = 0, this.loading = !1, this._queue.kill(), this._queue.pause();
      for (var e in this.resources) {
        var t = this.resources[e];
        t._onLoadBinding && t._onLoadBinding.detach(), t.isLoading && t.abort("loader reset");
      }
      return this.resources = {}, this;
    }, r.prototype.load = function(e) {
      if (Jt("6.5.0", "@pixi/loaders is being replaced with @pixi/assets in the next major release."), typeof e == "function" && this.onComplete.once(e), this.loading)
        return this;
      if (this._queue.idle())
        this._onStart(), this._onComplete();
      else {
        for (var t = this._queue._tasks.length, i = Mo / t, n = 0; n < this._queue._tasks.length; ++n)
          this._queue._tasks[n].data.progressChunk = i;
        this._onStart(), this._queue.resume();
      }
      return this;
    }, Object.defineProperty(r.prototype, "concurrency", {
      /**
       * The number of resources to load concurrently.
       * @default 10
       */
      get: function() {
        return this._queue.concurrency;
      },
      set: function(e) {
        this._queue.concurrency = e;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype._prepareUrl = function(e) {
      var t = $l(e, { strictMode: !0 }), i;
      if (t.protocol || !t.path || e.indexOf("//") === 0 ? i = e : this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && e.charAt(0) !== "/" ? i = this.baseUrl + "/" + e : i = this.baseUrl + e, this.defaultQueryString) {
        var n = hb.exec(i)[0];
        i = i.slice(0, i.length - n.length), i.indexOf("?") !== -1 ? i += "&" + this.defaultQueryString : i += "?" + this.defaultQueryString, i += n;
      }
      return i;
    }, r.prototype._loadResource = function(e, t) {
      var i = this;
      e._dequeue = t, Po.eachSeries(this._beforeMiddleware, function(n, o) {
        n.call(i, e, function() {
          o(e.isComplete ? {} : null);
        });
      }, function() {
        e.isComplete ? i._onLoad(e) : (e._onLoadBinding = e.onComplete.once(i._onLoad, i), e.load());
      }, !0);
    }, r.prototype._onStart = function() {
      this.progress = 0, this.loading = !0, this.onStart.dispatch(this);
    }, r.prototype._onComplete = function() {
      this.progress = Mo, this.loading = !1, this.onComplete.dispatch(this, this.resources);
    }, r.prototype._onLoad = function(e) {
      var t = this;
      e._onLoadBinding = null, this._resourcesParsing.push(e), e._dequeue(), Po.eachSeries(this._afterMiddleware, function(i, n) {
        i.call(t, e, n);
      }, function() {
        e.onAfterMiddleware.dispatch(e), t.progress = Math.min(Mo, t.progress + e.progressChunk), t.onProgress.dispatch(t, e), e.error ? t.onError.dispatch(e.error, t, e) : t.onLoad.dispatch(t, e), t._resourcesParsing.splice(t._resourcesParsing.indexOf(e), 1), t._queue.idle() && t._resourcesParsing.length === 0 && t._onComplete();
      }, !0);
    }, r.prototype.destroy = function() {
      this._protected || this.reset();
    }, Object.defineProperty(r, "shared", {
      /** A premade instance of the loader that can be used to load resources. */
      get: function() {
        var e = r._shared;
        return e || (e = new r(), e._protected = !0, r._shared = e), e;
      },
      enumerable: !1,
      configurable: !0
    }), r.registerPlugin = function(e) {
      return Jt("6.5.0", "Loader.registerPlugin() is deprecated, use extensions.add() instead."), Se.add({
        type: ft.Loader,
        ref: e
      }), r;
    }, r._plugins = [], r;
  }()
);
Se.handleByList(ft.Loader, Cn._plugins);
Cn.prototype.add = function(r, e, t, i) {
  if (Array.isArray(r)) {
    for (var n = 0; n < r.length; ++n)
      this.add(r[n]);
    return this;
  }
  if (typeof r == "object" && (t = r, i = e || t.callback || t.onComplete, e = t.url, r = t.name || t.key || t.url), typeof e != "string" && (i = t, t = e, e = r), typeof e != "string")
    throw new Error("No url passed to add resource to loader.");
  return typeof t == "function" && (i = t, t = null), this._add(r, e, t, i);
};
var ub = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(e) {
      e = Object.assign({
        sharedLoader: !1
      }, e), this.loader = e.sharedLoader ? Cn.shared : new Cn();
    }, r.destroy = function() {
      this.loader && (this.loader.destroy(), this.loader = null);
    }, r.extension = ft.Application, r;
  }()
), lb = (
  /** @class */
  function() {
    function r() {
    }
    return r.add = function() {
      Et.setExtensionLoadType("svg", Et.LOAD_TYPE.XHR), Et.setExtensionXhrType("svg", Et.XHR_RESPONSE_TYPE.TEXT);
    }, r.use = function(e, t) {
      if (e.data && (e.type === Et.TYPE.IMAGE || e.extension === "svg")) {
        var i = e.data, n = e.url, o = e.name, s = e.metadata;
        $.fromLoader(i, n, o, s).then(function(a) {
          e.texture = a, t();
        }).catch(t);
      } else
        t();
    }, r.extension = ft.Loader, r;
  }()
), cb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function db(r) {
  for (var e = "", t = 0; t < r.length; ) {
    for (var i = [0, 0, 0], n = [0, 0, 0, 0], o = 0; o < i.length; ++o)
      t < r.length ? i[o] = r.charCodeAt(t++) & 255 : i[o] = 0;
    n[0] = i[0] >> 2, n[1] = (i[0] & 3) << 4 | i[1] >> 4, n[2] = (i[1] & 15) << 2 | i[2] >> 6, n[3] = i[2] & 63;
    var s = t - (r.length - 1);
    switch (s) {
      case 2:
        n[3] = 64, n[2] = 64;
        break;
      case 1:
        n[3] = 64;
        break;
    }
    for (var o = 0; o < n.length; ++o)
      e += cb.charAt(n[o]);
  }
  return e;
}
function fb(r, e) {
  if (!r.data) {
    e();
    return;
  }
  if (r.xhr && r.xhrType === Et.XHR_RESPONSE_TYPE.BLOB) {
    if (!self.Blob || typeof r.data == "string") {
      var t = r.xhr.getResponseHeader("content-type");
      if (t && t.indexOf("image") === 0) {
        r.data = new Image(), r.data.src = "data:" + t + ";base64," + db(r.xhr.responseText), r.type = Et.TYPE.IMAGE, r.data.onload = function() {
          r.data.onload = null, e();
        };
        return;
      }
    } else if (r.data.type.indexOf("image") === 0) {
      var i = globalThis.URL || globalThis.webkitURL, n = i.createObjectURL(r.data);
      r.blob = r.data, r.data = new Image(), r.data.src = n, r.type = Et.TYPE.IMAGE, r.data.onload = function() {
        i.revokeObjectURL(n), r.data.onload = null, e();
      };
      return;
    }
  }
  e();
}
var pb = (
  /** @class */
  function() {
    function r() {
    }
    return r.extension = ft.Loader, r.use = fb, r;
  }()
);
Se.add(lb, pb);
/*!
 * @pixi/compressed-textures - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/compressed-textures is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ct, z;
(function(r) {
  r[r.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", r[r.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", r[r.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", r[r.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", r[r.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", r[r.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", r[r.COMPRESSED_RGBA8_ETC2_EAC = 37496] = "COMPRESSED_RGBA8_ETC2_EAC", r[r.COMPRESSED_SRGB8_ETC2 = 37493] = "COMPRESSED_SRGB8_ETC2", r[r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", r[r.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG", r[r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", r[r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", r[r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG", r[r.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL", r[r.COMPRESSED_RGB_ATC_WEBGL = 35986] = "COMPRESSED_RGB_ATC_WEBGL", r[r.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", r[r.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL", r[r.COMPRESSED_RGBA_ASTC_4x4_KHR = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR";
})(z || (z = {}));
var Nn = (ct = {}, // WEBGL_compressed_texture_s3tc
ct[z.COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5, ct[z.COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5, ct[z.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1, ct[z.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1, // WEBGL_compressed_texture_s3tc
ct[z.COMPRESSED_SRGB_S3TC_DXT1_EXT] = 0.5, ct[z.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = 0.5, ct[z.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1, ct[z.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1, // WEBGL_compressed_texture_etc
ct[z.COMPRESSED_R11_EAC] = 0.5, ct[z.COMPRESSED_SIGNED_R11_EAC] = 0.5, ct[z.COMPRESSED_RG11_EAC] = 1, ct[z.COMPRESSED_SIGNED_RG11_EAC] = 1, ct[z.COMPRESSED_RGB8_ETC2] = 0.5, ct[z.COMPRESSED_RGBA8_ETC2_EAC] = 1, ct[z.COMPRESSED_SRGB8_ETC2] = 0.5, ct[z.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1, ct[z.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, ct[z.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, // WEBGL_compressed_texture_pvrtc
ct[z.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5, ct[z.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5, ct[z.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25, ct[z.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25, // WEBGL_compressed_texture_etc1
ct[z.COMPRESSED_RGB_ETC1_WEBGL] = 0.5, // @see https://www.khronos.org/registry/OpenGL/extensions/AMD/AMD_compressed_ATC_texture.txt
// WEBGL_compressed_texture_atc
ct[z.COMPRESSED_RGB_ATC_WEBGL] = 0.5, ct[z.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1, ct[z.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1, // @see https://registry.khronos.org/OpenGL/extensions/KHR/KHR_texture_compression_astc_hdr.txt
// WEBGL_compressed_texture_astc
/* eslint-disable-next-line camelcase */
ct[z.COMPRESSED_RGBA_ASTC_4x4_KHR] = 1, ct);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var vs = function(r, e) {
  return vs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, vs(r, e);
};
function zl(r, e) {
  vs(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function mb(r, e, t, i) {
  function n(o) {
    return o instanceof t ? o : new t(function(s) {
      s(o);
    });
  }
  return new (t || (t = Promise))(function(o, s) {
    function a(l) {
      try {
        u(i.next(l));
      } catch (c) {
        s(c);
      }
    }
    function h(l) {
      try {
        u(i.throw(l));
      } catch (c) {
        s(c);
      }
    }
    function u(l) {
      l.done ? o(l.value) : n(l.value).then(a, h);
    }
    u((i = i.apply(r, e || [])).next());
  });
}
function yb(r, e) {
  var t = { label: 0, sent: function() {
    if (o[0] & 1)
      throw o[1];
    return o[1];
  }, trys: [], ops: [] }, i, n, o, s;
  return s = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function a(u) {
    return function(l) {
      return h([u, l]);
    };
  }
  function h(u) {
    if (i)
      throw new TypeError("Generator is already executing.");
    for (; t; )
      try {
        if (i = 1, n && (o = u[0] & 2 ? n.return : u[0] ? n.throw || ((o = n.return) && o.call(n), 0) : n.next) && !(o = o.call(n, u[1])).done)
          return o;
        switch (n = 0, o && (u = [u[0] & 2, o.value]), u[0]) {
          case 0:
          case 1:
            o = u;
            break;
          case 4:
            return t.label++, { value: u[1], done: !1 };
          case 5:
            t.label++, n = u[1], u = [0];
            continue;
          case 7:
            u = t.ops.pop(), t.trys.pop();
            continue;
          default:
            if (o = t.trys, !(o = o.length > 0 && o[o.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              t = 0;
              continue;
            }
            if (u[0] === 3 && (!o || u[1] > o[0] && u[1] < o[3])) {
              t.label = u[1];
              break;
            }
            if (u[0] === 6 && t.label < o[1]) {
              t.label = o[1], o = u;
              break;
            }
            if (o && t.label < o[2]) {
              t.label = o[2], t.ops.push(u);
              break;
            }
            o[2] && t.ops.pop(), t.trys.pop();
            continue;
        }
        u = e.call(r, t);
      } catch (l) {
        u = [6, l], n = 0;
      } finally {
        i = o = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}
var _b = (
  /** @class */
  function(r) {
    zl(e, r);
    function e(t, i) {
      i === void 0 && (i = { width: 1, height: 1, autoLoad: !0 });
      var n = this, o, s;
      return typeof t == "string" ? (o = t, s = new Uint8Array()) : (o = null, s = t), n = r.call(this, s, i) || this, n.origin = o, n.buffer = s ? new _s(s) : null, n.origin && i.autoLoad !== !1 && n.load(), s && s.length && (n.loaded = !0, n.onBlobLoaded(n.buffer.rawBinaryData)), n;
    }
    return e.prototype.onBlobLoaded = function(t) {
    }, e.prototype.load = function() {
      return mb(this, void 0, Promise, function() {
        var t, i, n;
        return yb(this, function(o) {
          switch (o.label) {
            case 0:
              return [4, fetch(this.origin)];
            case 1:
              return t = o.sent(), [4, t.blob()];
            case 2:
              return i = o.sent(), [4, i.arrayBuffer()];
            case 3:
              return n = o.sent(), this.data = new Uint32Array(n), this.buffer = new _s(n), this.loaded = !0, this.onBlobLoaded(n), this.update(), [2, this];
          }
        });
      });
    }, e;
  }(Oi)
), bs = (
  /** @class */
  function(r) {
    zl(e, r);
    function e(t, i) {
      var n = r.call(this, t, i) || this;
      return n.format = i.format, n.levels = i.levels || 1, n._width = i.width, n._height = i.height, n._extension = e._formatToExtension(n.format), (i.levelBuffers || n.buffer) && (n._levelBuffers = i.levelBuffers || e._createLevelBuffers(
        t instanceof Uint8Array ? t : n.buffer.uint8View,
        n.format,
        n.levels,
        4,
        4,
        // PVRTC has 8x4 blocks in 2bpp mode
        n.width,
        n.height
      )), n;
    }
    return e.prototype.upload = function(t, i, n) {
      var o = t.gl, s = t.context.extensions[this._extension];
      if (!s)
        throw new Error(this._extension + " textures are not supported on the current machine");
      if (!this._levelBuffers)
        return !1;
      for (var a = 0, h = this.levels; a < h; a++) {
        var u = this._levelBuffers[a], l = u.levelID, c = u.levelWidth, d = u.levelHeight, f = u.levelBuffer;
        o.compressedTexImage2D(o.TEXTURE_2D, l, this.format, c, d, 0, f);
      }
      return !0;
    }, e.prototype.onBlobLoaded = function() {
      this._levelBuffers = e._createLevelBuffers(
        this.buffer.uint8View,
        this.format,
        this.levels,
        4,
        4,
        // PVRTC has 8x4 blocks in 2bpp mode
        this.width,
        this.height
      );
    }, e._formatToExtension = function(t) {
      if (t >= 33776 && t <= 33779)
        return "s3tc";
      if (t >= 37488 && t <= 37497)
        return "etc";
      if (t >= 35840 && t <= 35843)
        return "pvrtc";
      if (t >= 36196)
        return "etc1";
      if (t >= 35986 && t <= 34798)
        return "atc";
      throw new Error("Invalid (compressed) texture format given!");
    }, e._createLevelBuffers = function(t, i, n, o, s, a, h) {
      for (var u = new Array(n), l = t.byteOffset, c = a, d = h, f = c + o - 1 & ~(o - 1), p = d + s - 1 & ~(s - 1), m = f * p * Nn[i], y = 0; y < n; y++)
        u[y] = {
          levelID: y,
          levelWidth: n > 1 ? c : f,
          levelHeight: n > 1 ? d : p,
          levelBuffer: new Uint8Array(t.buffer, l, m)
        }, l += m, c = c >> 1 || 1, d = d >> 1 || 1, f = c + o - 1 & ~(o - 1), p = d + s - 1 & ~(s - 1), m = f * p * Nn[i];
      return u;
    }, e;
  }(_b)
), gb = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(e, t) {
      var i = e.data, n = this;
      if (e.type === Et.TYPE.JSON && i && i.cacheID && i.textures) {
        for (var o = i.textures, s = void 0, a = void 0, h = 0, u = o.length; h < u; h++) {
          var l = o[h], c = l.src, d = l.format;
          if (d || (a = c), r.textureFormats[d]) {
            s = c;
            break;
          }
        }
        if (s = s || a, !s) {
          t(new Error("Cannot load compressed-textures in " + e.url + ", make sure you provide a fallback"));
          return;
        }
        if (s === e.url) {
          t(new Error("URL of compressed texture cannot be the same as the manifest's URL"));
          return;
        }
        var f = {
          crossOrigin: e.crossOrigin,
          metadata: e.metadata.imageMetadata,
          parentResource: e
        }, p = Or.resolve(e.url.replace(n.baseUrl, ""), s), m = i.cacheID;
        n.add(m, p, f, function(y) {
          if (y.error) {
            t(y.error);
            return;
          }
          var _ = y.texture, g = _ === void 0 ? null : _, v = y.textures, b = v === void 0 ? {} : v;
          Object.assign(e, { texture: g, textures: b }), t();
        });
      } else
        t();
    }, Object.defineProperty(r, "textureExtensions", {
      /**  Map of available texture extensions. */
      get: function() {
        if (!r._textureExtensions) {
          var e = G.ADAPTER.createCanvas(), t = e.getContext("webgl");
          if (!t)
            return console.warn("WebGL not available for compressed textures. Silently failing."), {};
          var i = {
            s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"),
            s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
            etc: t.getExtension("WEBGL_compressed_texture_etc"),
            etc1: t.getExtension("WEBGL_compressed_texture_etc1"),
            pvrtc: t.getExtension("WEBGL_compressed_texture_pvrtc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
            atc: t.getExtension("WEBGL_compressed_texture_atc"),
            astc: t.getExtension("WEBGL_compressed_texture_astc")
          };
          r._textureExtensions = i;
        }
        return r._textureExtensions;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "textureFormats", {
      /** Map of available texture formats. */
      get: function() {
        if (!r._textureFormats) {
          var e = r.textureExtensions;
          r._textureFormats = {};
          for (var t in e) {
            var i = e[t];
            i && Object.assign(r._textureFormats, Object.getPrototypeOf(i));
          }
        }
        return r._textureFormats;
      },
      enumerable: !1,
      configurable: !0
    }), r.extension = ft.Loader, r;
  }()
);
function Wl(r, e, t) {
  var i = {
    textures: {},
    texture: null
  };
  if (!e)
    return i;
  var n = e.map(function(o) {
    return new $(new it(o, Object.assign({
      mipmap: Qt.OFF,
      alphaMode: te.NO_PREMULTIPLIED_ALPHA
    }, t)));
  });
  return n.forEach(function(o, s) {
    var a = o.baseTexture, h = r + "-" + (s + 1);
    it.addToCache(a, h), $.addToCache(o, h), s === 0 && (it.addToCache(a, r), $.addToCache(o, r), i.texture = o), i.textures[h] = o;
  }), i;
}
var Kr, Yt, Io = 4, tn = 124, vb = 32, tu = 20, bb = 542327876, en = {
  SIZE: 1,
  FLAGS: 2,
  HEIGHT: 3,
  WIDTH: 4,
  MIPMAP_COUNT: 7,
  PIXEL_FORMAT: 19
}, xb = {
  SIZE: 0,
  FLAGS: 1,
  FOURCC: 2,
  RGB_BITCOUNT: 3,
  R_BIT_MASK: 4,
  G_BIT_MASK: 5,
  B_BIT_MASK: 6,
  A_BIT_MASK: 7
}, rn = {
  DXGI_FORMAT: 0,
  RESOURCE_DIMENSION: 1,
  MISC_FLAG: 2,
  ARRAY_SIZE: 3,
  MISC_FLAGS2: 4
}, zt;
(function(r) {
  r[r.DXGI_FORMAT_UNKNOWN = 0] = "DXGI_FORMAT_UNKNOWN", r[r.DXGI_FORMAT_R32G32B32A32_TYPELESS = 1] = "DXGI_FORMAT_R32G32B32A32_TYPELESS", r[r.DXGI_FORMAT_R32G32B32A32_FLOAT = 2] = "DXGI_FORMAT_R32G32B32A32_FLOAT", r[r.DXGI_FORMAT_R32G32B32A32_UINT = 3] = "DXGI_FORMAT_R32G32B32A32_UINT", r[r.DXGI_FORMAT_R32G32B32A32_SINT = 4] = "DXGI_FORMAT_R32G32B32A32_SINT", r[r.DXGI_FORMAT_R32G32B32_TYPELESS = 5] = "DXGI_FORMAT_R32G32B32_TYPELESS", r[r.DXGI_FORMAT_R32G32B32_FLOAT = 6] = "DXGI_FORMAT_R32G32B32_FLOAT", r[r.DXGI_FORMAT_R32G32B32_UINT = 7] = "DXGI_FORMAT_R32G32B32_UINT", r[r.DXGI_FORMAT_R32G32B32_SINT = 8] = "DXGI_FORMAT_R32G32B32_SINT", r[r.DXGI_FORMAT_R16G16B16A16_TYPELESS = 9] = "DXGI_FORMAT_R16G16B16A16_TYPELESS", r[r.DXGI_FORMAT_R16G16B16A16_FLOAT = 10] = "DXGI_FORMAT_R16G16B16A16_FLOAT", r[r.DXGI_FORMAT_R16G16B16A16_UNORM = 11] = "DXGI_FORMAT_R16G16B16A16_UNORM", r[r.DXGI_FORMAT_R16G16B16A16_UINT = 12] = "DXGI_FORMAT_R16G16B16A16_UINT", r[r.DXGI_FORMAT_R16G16B16A16_SNORM = 13] = "DXGI_FORMAT_R16G16B16A16_SNORM", r[r.DXGI_FORMAT_R16G16B16A16_SINT = 14] = "DXGI_FORMAT_R16G16B16A16_SINT", r[r.DXGI_FORMAT_R32G32_TYPELESS = 15] = "DXGI_FORMAT_R32G32_TYPELESS", r[r.DXGI_FORMAT_R32G32_FLOAT = 16] = "DXGI_FORMAT_R32G32_FLOAT", r[r.DXGI_FORMAT_R32G32_UINT = 17] = "DXGI_FORMAT_R32G32_UINT", r[r.DXGI_FORMAT_R32G32_SINT = 18] = "DXGI_FORMAT_R32G32_SINT", r[r.DXGI_FORMAT_R32G8X24_TYPELESS = 19] = "DXGI_FORMAT_R32G8X24_TYPELESS", r[r.DXGI_FORMAT_D32_FLOAT_S8X24_UINT = 20] = "DXGI_FORMAT_D32_FLOAT_S8X24_UINT", r[r.DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS = 21] = "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS", r[r.DXGI_FORMAT_X32_TYPELESS_G8X24_UINT = 22] = "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT", r[r.DXGI_FORMAT_R10G10B10A2_TYPELESS = 23] = "DXGI_FORMAT_R10G10B10A2_TYPELESS", r[r.DXGI_FORMAT_R10G10B10A2_UNORM = 24] = "DXGI_FORMAT_R10G10B10A2_UNORM", r[r.DXGI_FORMAT_R10G10B10A2_UINT = 25] = "DXGI_FORMAT_R10G10B10A2_UINT", r[r.DXGI_FORMAT_R11G11B10_FLOAT = 26] = "DXGI_FORMAT_R11G11B10_FLOAT", r[r.DXGI_FORMAT_R8G8B8A8_TYPELESS = 27] = "DXGI_FORMAT_R8G8B8A8_TYPELESS", r[r.DXGI_FORMAT_R8G8B8A8_UNORM = 28] = "DXGI_FORMAT_R8G8B8A8_UNORM", r[r.DXGI_FORMAT_R8G8B8A8_UNORM_SRGB = 29] = "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB", r[r.DXGI_FORMAT_R8G8B8A8_UINT = 30] = "DXGI_FORMAT_R8G8B8A8_UINT", r[r.DXGI_FORMAT_R8G8B8A8_SNORM = 31] = "DXGI_FORMAT_R8G8B8A8_SNORM", r[r.DXGI_FORMAT_R8G8B8A8_SINT = 32] = "DXGI_FORMAT_R8G8B8A8_SINT", r[r.DXGI_FORMAT_R16G16_TYPELESS = 33] = "DXGI_FORMAT_R16G16_TYPELESS", r[r.DXGI_FORMAT_R16G16_FLOAT = 34] = "DXGI_FORMAT_R16G16_FLOAT", r[r.DXGI_FORMAT_R16G16_UNORM = 35] = "DXGI_FORMAT_R16G16_UNORM", r[r.DXGI_FORMAT_R16G16_UINT = 36] = "DXGI_FORMAT_R16G16_UINT", r[r.DXGI_FORMAT_R16G16_SNORM = 37] = "DXGI_FORMAT_R16G16_SNORM", r[r.DXGI_FORMAT_R16G16_SINT = 38] = "DXGI_FORMAT_R16G16_SINT", r[r.DXGI_FORMAT_R32_TYPELESS = 39] = "DXGI_FORMAT_R32_TYPELESS", r[r.DXGI_FORMAT_D32_FLOAT = 40] = "DXGI_FORMAT_D32_FLOAT", r[r.DXGI_FORMAT_R32_FLOAT = 41] = "DXGI_FORMAT_R32_FLOAT", r[r.DXGI_FORMAT_R32_UINT = 42] = "DXGI_FORMAT_R32_UINT", r[r.DXGI_FORMAT_R32_SINT = 43] = "DXGI_FORMAT_R32_SINT", r[r.DXGI_FORMAT_R24G8_TYPELESS = 44] = "DXGI_FORMAT_R24G8_TYPELESS", r[r.DXGI_FORMAT_D24_UNORM_S8_UINT = 45] = "DXGI_FORMAT_D24_UNORM_S8_UINT", r[r.DXGI_FORMAT_R24_UNORM_X8_TYPELESS = 46] = "DXGI_FORMAT_R24_UNORM_X8_TYPELESS", r[r.DXGI_FORMAT_X24_TYPELESS_G8_UINT = 47] = "DXGI_FORMAT_X24_TYPELESS_G8_UINT", r[r.DXGI_FORMAT_R8G8_TYPELESS = 48] = "DXGI_FORMAT_R8G8_TYPELESS", r[r.DXGI_FORMAT_R8G8_UNORM = 49] = "DXGI_FORMAT_R8G8_UNORM", r[r.DXGI_FORMAT_R8G8_UINT = 50] = "DXGI_FORMAT_R8G8_UINT", r[r.DXGI_FORMAT_R8G8_SNORM = 51] = "DXGI_FORMAT_R8G8_SNORM", r[r.DXGI_FORMAT_R8G8_SINT = 52] = "DXGI_FORMAT_R8G8_SINT", r[r.DXGI_FORMAT_R16_TYPELESS = 53] = "DXGI_FORMAT_R16_TYPELESS", r[r.DXGI_FORMAT_R16_FLOAT = 54] = "DXGI_FORMAT_R16_FLOAT", r[r.DXGI_FORMAT_D16_UNORM = 55] = "DXGI_FORMAT_D16_UNORM", r[r.DXGI_FORMAT_R16_UNORM = 56] = "DXGI_FORMAT_R16_UNORM", r[r.DXGI_FORMAT_R16_UINT = 57] = "DXGI_FORMAT_R16_UINT", r[r.DXGI_FORMAT_R16_SNORM = 58] = "DXGI_FORMAT_R16_SNORM", r[r.DXGI_FORMAT_R16_SINT = 59] = "DXGI_FORMAT_R16_SINT", r[r.DXGI_FORMAT_R8_TYPELESS = 60] = "DXGI_FORMAT_R8_TYPELESS", r[r.DXGI_FORMAT_R8_UNORM = 61] = "DXGI_FORMAT_R8_UNORM", r[r.DXGI_FORMAT_R8_UINT = 62] = "DXGI_FORMAT_R8_UINT", r[r.DXGI_FORMAT_R8_SNORM = 63] = "DXGI_FORMAT_R8_SNORM", r[r.DXGI_FORMAT_R8_SINT = 64] = "DXGI_FORMAT_R8_SINT", r[r.DXGI_FORMAT_A8_UNORM = 65] = "DXGI_FORMAT_A8_UNORM", r[r.DXGI_FORMAT_R1_UNORM = 66] = "DXGI_FORMAT_R1_UNORM", r[r.DXGI_FORMAT_R9G9B9E5_SHAREDEXP = 67] = "DXGI_FORMAT_R9G9B9E5_SHAREDEXP", r[r.DXGI_FORMAT_R8G8_B8G8_UNORM = 68] = "DXGI_FORMAT_R8G8_B8G8_UNORM", r[r.DXGI_FORMAT_G8R8_G8B8_UNORM = 69] = "DXGI_FORMAT_G8R8_G8B8_UNORM", r[r.DXGI_FORMAT_BC1_TYPELESS = 70] = "DXGI_FORMAT_BC1_TYPELESS", r[r.DXGI_FORMAT_BC1_UNORM = 71] = "DXGI_FORMAT_BC1_UNORM", r[r.DXGI_FORMAT_BC1_UNORM_SRGB = 72] = "DXGI_FORMAT_BC1_UNORM_SRGB", r[r.DXGI_FORMAT_BC2_TYPELESS = 73] = "DXGI_FORMAT_BC2_TYPELESS", r[r.DXGI_FORMAT_BC2_UNORM = 74] = "DXGI_FORMAT_BC2_UNORM", r[r.DXGI_FORMAT_BC2_UNORM_SRGB = 75] = "DXGI_FORMAT_BC2_UNORM_SRGB", r[r.DXGI_FORMAT_BC3_TYPELESS = 76] = "DXGI_FORMAT_BC3_TYPELESS", r[r.DXGI_FORMAT_BC3_UNORM = 77] = "DXGI_FORMAT_BC3_UNORM", r[r.DXGI_FORMAT_BC3_UNORM_SRGB = 78] = "DXGI_FORMAT_BC3_UNORM_SRGB", r[r.DXGI_FORMAT_BC4_TYPELESS = 79] = "DXGI_FORMAT_BC4_TYPELESS", r[r.DXGI_FORMAT_BC4_UNORM = 80] = "DXGI_FORMAT_BC4_UNORM", r[r.DXGI_FORMAT_BC4_SNORM = 81] = "DXGI_FORMAT_BC4_SNORM", r[r.DXGI_FORMAT_BC5_TYPELESS = 82] = "DXGI_FORMAT_BC5_TYPELESS", r[r.DXGI_FORMAT_BC5_UNORM = 83] = "DXGI_FORMAT_BC5_UNORM", r[r.DXGI_FORMAT_BC5_SNORM = 84] = "DXGI_FORMAT_BC5_SNORM", r[r.DXGI_FORMAT_B5G6R5_UNORM = 85] = "DXGI_FORMAT_B5G6R5_UNORM", r[r.DXGI_FORMAT_B5G5R5A1_UNORM = 86] = "DXGI_FORMAT_B5G5R5A1_UNORM", r[r.DXGI_FORMAT_B8G8R8A8_UNORM = 87] = "DXGI_FORMAT_B8G8R8A8_UNORM", r[r.DXGI_FORMAT_B8G8R8X8_UNORM = 88] = "DXGI_FORMAT_B8G8R8X8_UNORM", r[r.DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM = 89] = "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM", r[r.DXGI_FORMAT_B8G8R8A8_TYPELESS = 90] = "DXGI_FORMAT_B8G8R8A8_TYPELESS", r[r.DXGI_FORMAT_B8G8R8A8_UNORM_SRGB = 91] = "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB", r[r.DXGI_FORMAT_B8G8R8X8_TYPELESS = 92] = "DXGI_FORMAT_B8G8R8X8_TYPELESS", r[r.DXGI_FORMAT_B8G8R8X8_UNORM_SRGB = 93] = "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB", r[r.DXGI_FORMAT_BC6H_TYPELESS = 94] = "DXGI_FORMAT_BC6H_TYPELESS", r[r.DXGI_FORMAT_BC6H_UF16 = 95] = "DXGI_FORMAT_BC6H_UF16", r[r.DXGI_FORMAT_BC6H_SF16 = 96] = "DXGI_FORMAT_BC6H_SF16", r[r.DXGI_FORMAT_BC7_TYPELESS = 97] = "DXGI_FORMAT_BC7_TYPELESS", r[r.DXGI_FORMAT_BC7_UNORM = 98] = "DXGI_FORMAT_BC7_UNORM", r[r.DXGI_FORMAT_BC7_UNORM_SRGB = 99] = "DXGI_FORMAT_BC7_UNORM_SRGB", r[r.DXGI_FORMAT_AYUV = 100] = "DXGI_FORMAT_AYUV", r[r.DXGI_FORMAT_Y410 = 101] = "DXGI_FORMAT_Y410", r[r.DXGI_FORMAT_Y416 = 102] = "DXGI_FORMAT_Y416", r[r.DXGI_FORMAT_NV12 = 103] = "DXGI_FORMAT_NV12", r[r.DXGI_FORMAT_P010 = 104] = "DXGI_FORMAT_P010", r[r.DXGI_FORMAT_P016 = 105] = "DXGI_FORMAT_P016", r[r.DXGI_FORMAT_420_OPAQUE = 106] = "DXGI_FORMAT_420_OPAQUE", r[r.DXGI_FORMAT_YUY2 = 107] = "DXGI_FORMAT_YUY2", r[r.DXGI_FORMAT_Y210 = 108] = "DXGI_FORMAT_Y210", r[r.DXGI_FORMAT_Y216 = 109] = "DXGI_FORMAT_Y216", r[r.DXGI_FORMAT_NV11 = 110] = "DXGI_FORMAT_NV11", r[r.DXGI_FORMAT_AI44 = 111] = "DXGI_FORMAT_AI44", r[r.DXGI_FORMAT_IA44 = 112] = "DXGI_FORMAT_IA44", r[r.DXGI_FORMAT_P8 = 113] = "DXGI_FORMAT_P8", r[r.DXGI_FORMAT_A8P8 = 114] = "DXGI_FORMAT_A8P8", r[r.DXGI_FORMAT_B4G4R4A4_UNORM = 115] = "DXGI_FORMAT_B4G4R4A4_UNORM", r[r.DXGI_FORMAT_P208 = 116] = "DXGI_FORMAT_P208", r[r.DXGI_FORMAT_V208 = 117] = "DXGI_FORMAT_V208", r[r.DXGI_FORMAT_V408 = 118] = "DXGI_FORMAT_V408", r[r.DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE = 119] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE", r[r.DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE = 120] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE", r[r.DXGI_FORMAT_FORCE_UINT = 121] = "DXGI_FORMAT_FORCE_UINT";
})(zt || (zt = {}));
var xs;
(function(r) {
  r[r.DDS_DIMENSION_TEXTURE1D = 2] = "DDS_DIMENSION_TEXTURE1D", r[r.DDS_DIMENSION_TEXTURE2D = 3] = "DDS_DIMENSION_TEXTURE2D", r[r.DDS_DIMENSION_TEXTURE3D = 6] = "DDS_DIMENSION_TEXTURE3D";
})(xs || (xs = {}));
var Tb = 1, Eb = 2, Ab = 4, Sb = 64, wb = 512, Ob = 131072, Rb = 827611204, Pb = 861165636, Mb = 894720068, Ib = 808540228, Db = 4, Cb = (Kr = {}, Kr[Rb] = z.COMPRESSED_RGBA_S3TC_DXT1_EXT, Kr[Pb] = z.COMPRESSED_RGBA_S3TC_DXT3_EXT, Kr[Mb] = z.COMPRESSED_RGBA_S3TC_DXT5_EXT, Kr), Nb = (Yt = {}, // WEBGL_compressed_texture_s3tc
Yt[zt.DXGI_FORMAT_BC1_TYPELESS] = z.COMPRESSED_RGBA_S3TC_DXT1_EXT, Yt[zt.DXGI_FORMAT_BC1_UNORM] = z.COMPRESSED_RGBA_S3TC_DXT1_EXT, Yt[zt.DXGI_FORMAT_BC2_TYPELESS] = z.COMPRESSED_RGBA_S3TC_DXT3_EXT, Yt[zt.DXGI_FORMAT_BC2_UNORM] = z.COMPRESSED_RGBA_S3TC_DXT3_EXT, Yt[zt.DXGI_FORMAT_BC3_TYPELESS] = z.COMPRESSED_RGBA_S3TC_DXT5_EXT, Yt[zt.DXGI_FORMAT_BC3_UNORM] = z.COMPRESSED_RGBA_S3TC_DXT5_EXT, // WEBGL_compressed_texture_s3tc_srgb
Yt[zt.DXGI_FORMAT_BC1_UNORM_SRGB] = z.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT, Yt[zt.DXGI_FORMAT_BC2_UNORM_SRGB] = z.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, Yt[zt.DXGI_FORMAT_BC3_UNORM_SRGB] = z.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT, Yt);
function Fb(r) {
  var e = new Uint32Array(r), t = e[0];
  if (t !== bb)
    throw new Error("Invalid DDS file magic word");
  var i = new Uint32Array(r, 0, tn / Uint32Array.BYTES_PER_ELEMENT), n = i[en.HEIGHT], o = i[en.WIDTH], s = i[en.MIPMAP_COUNT], a = new Uint32Array(r, en.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT, vb / Uint32Array.BYTES_PER_ELEMENT), h = a[Tb];
  if (h & Ab) {
    var u = a[xb.FOURCC];
    if (u !== Ib) {
      var l = Cb[u], c = Io + tn, d = new Uint8Array(r, c), f = new bs(d, {
        format: l,
        width: o,
        height: n,
        levels: s
        // CompressedTextureResource will separate the levelBuffers for us!
      });
      return [f];
    }
    var p = Io + tn, m = new Uint32Array(e.buffer, p, tu / Uint32Array.BYTES_PER_ELEMENT), y = m[rn.DXGI_FORMAT], _ = m[rn.RESOURCE_DIMENSION], g = m[rn.MISC_FLAG], v = m[rn.ARRAY_SIZE], b = Nb[y];
    if (b === void 0)
      throw new Error("DDSParser cannot parse texture data with DXGI format " + y);
    if (g === Db)
      throw new Error("DDSParser does not support cubemap textures");
    if (_ === xs.DDS_DIMENSION_TEXTURE3D)
      throw new Error("DDSParser does not supported 3D texture data");
    var T = new Array(), S = Io + tn + tu;
    if (v === 1)
      T.push(new Uint8Array(r, S));
    else {
      for (var w = Nn[b], A = 0, x = o, E = n, O = 0; O < s; O++) {
        var P = Math.max(1, x + 3 & -4), M = Math.max(1, E + 3 & -4), F = P * M * w;
        A += F, x = x >>> 1, E = E >>> 1;
      }
      for (var D = S, O = 0; O < v; O++)
        T.push(new Uint8Array(r, D, A)), D += A;
    }
    return T.map(function(C) {
      return new bs(C, {
        format: b,
        width: o,
        height: n,
        levels: s
      });
    });
  }
  throw h & Sb ? new Error("DDSParser does not support uncompressed texture data.") : h & wb ? new Error("DDSParser does not supported YUV uncompressed texture data.") : h & Ob ? new Error("DDSParser does not support single-channel (lumninance) texture data!") : h & Eb ? new Error("DDSParser does not support single-channel (alpha) texture data!") : new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
var we, fe, Zr, eu = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10], Lb = 67305985, Vt = {
  FILE_IDENTIFIER: 0,
  ENDIANNESS: 12,
  GL_TYPE: 16,
  GL_TYPE_SIZE: 20,
  GL_FORMAT: 24,
  GL_INTERNAL_FORMAT: 28,
  GL_BASE_INTERNAL_FORMAT: 32,
  PIXEL_WIDTH: 36,
  PIXEL_HEIGHT: 40,
  PIXEL_DEPTH: 44,
  NUMBER_OF_ARRAY_ELEMENTS: 48,
  NUMBER_OF_FACES: 52,
  NUMBER_OF_MIPMAP_LEVELS: 56,
  BYTES_OF_KEY_VALUE_DATA: 60
}, Ts = 64, ru = (we = {}, we[k.UNSIGNED_BYTE] = 1, we[k.UNSIGNED_SHORT] = 2, we[k.INT] = 4, we[k.UNSIGNED_INT] = 4, we[k.FLOAT] = 4, we[k.HALF_FLOAT] = 8, we), Bb = (fe = {}, fe[N.RGBA] = 4, fe[N.RGB] = 3, fe[N.RG] = 2, fe[N.RED] = 1, fe[N.LUMINANCE] = 1, fe[N.LUMINANCE_ALPHA] = 2, fe[N.ALPHA] = 1, fe), Gb = (Zr = {}, Zr[k.UNSIGNED_SHORT_4_4_4_4] = 2, Zr[k.UNSIGNED_SHORT_5_5_5_1] = 2, Zr[k.UNSIGNED_SHORT_5_6_5] = 2, Zr);
function Ub(r, e, t) {
  t === void 0 && (t = !1);
  var i = new DataView(e);
  if (!kb(r, i))
    return null;
  var n = i.getUint32(Vt.ENDIANNESS, !0) === Lb, o = i.getUint32(Vt.GL_TYPE, n), s = i.getUint32(Vt.GL_FORMAT, n), a = i.getUint32(Vt.GL_INTERNAL_FORMAT, n), h = i.getUint32(Vt.PIXEL_WIDTH, n), u = i.getUint32(Vt.PIXEL_HEIGHT, n) || 1, l = i.getUint32(Vt.PIXEL_DEPTH, n) || 1, c = i.getUint32(Vt.NUMBER_OF_ARRAY_ELEMENTS, n) || 1, d = i.getUint32(Vt.NUMBER_OF_FACES, n), f = i.getUint32(Vt.NUMBER_OF_MIPMAP_LEVELS, n), p = i.getUint32(Vt.BYTES_OF_KEY_VALUE_DATA, n);
  if (u === 0 || l !== 1)
    throw new Error("Only 2D textures are supported");
  if (d !== 1)
    throw new Error("CubeTextures are not supported by KTXLoader yet!");
  if (c !== 1)
    throw new Error("WebGL does not support array textures");
  var m = 4, y = 4, _ = h + 3 & -4, g = u + 3 & -4, v = new Array(c), b = h * u;
  o === 0 && (b = _ * g);
  var T;
  if (o !== 0 ? ru[o] ? T = ru[o] * Bb[s] : T = Gb[o] : T = Nn[a], T === void 0)
    throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
  for (var S = t ? jb(i, p, n) : null, w = b * T, A = w, x = h, E = u, O = _, P = g, M = Ts + p, F = 0; F < f; F++) {
    for (var D = i.getUint32(M, n), C = M + 4, V = 0; V < c; V++) {
      var st = v[V];
      st || (st = v[V] = new Array(f)), st[F] = {
        levelID: F,
        // don't align mipWidth when texture not compressed! (glType not zero)
        levelWidth: f > 1 || o !== 0 ? x : O,
        levelHeight: f > 1 || o !== 0 ? E : P,
        levelBuffer: new Uint8Array(e, C, A)
      }, C += A;
    }
    M += D + 4, M = M % 4 !== 0 ? M + 4 - M % 4 : M, x = x >> 1 || 1, E = E >> 1 || 1, O = x + m - 1 & ~(m - 1), P = E + y - 1 & ~(y - 1), A = O * P * T;
  }
  return o !== 0 ? {
    uncompressed: v.map(function(q) {
      var L = q[0].levelBuffer, I = !1;
      return o === k.FLOAT ? L = new Float32Array(q[0].levelBuffer.buffer, q[0].levelBuffer.byteOffset, q[0].levelBuffer.byteLength / 4) : o === k.UNSIGNED_INT ? (I = !0, L = new Uint32Array(q[0].levelBuffer.buffer, q[0].levelBuffer.byteOffset, q[0].levelBuffer.byteLength / 4)) : o === k.INT && (I = !0, L = new Int32Array(q[0].levelBuffer.buffer, q[0].levelBuffer.byteOffset, q[0].levelBuffer.byteLength / 4)), {
        resource: new Oi(L, {
          width: q[0].levelWidth,
          height: q[0].levelHeight
        }),
        type: o,
        format: I ? Xb(s) : s
      };
    }),
    kvData: S
  } : {
    compressed: v.map(function(q) {
      return new bs(null, {
        format: a,
        width: h,
        height: u,
        levels: f,
        levelBuffers: q
      });
    }),
    kvData: S
  };
}
function kb(r, e) {
  for (var t = 0; t < eu.length; t++)
    if (e.getUint8(t) !== eu[t])
      return console.error(r + " is not a valid *.ktx file!"), !1;
  return !0;
}
function Xb(r) {
  switch (r) {
    case N.RGBA:
      return N.RGBA_INTEGER;
    case N.RGB:
      return N.RGB_INTEGER;
    case N.RG:
      return N.RG_INTEGER;
    case N.RED:
      return N.RED_INTEGER;
    default:
      return r;
  }
}
function jb(r, e, t) {
  for (var i = /* @__PURE__ */ new Map(), n = 0; n < e; ) {
    var o = r.getUint32(Ts + n, t), s = Ts + n + 4, a = 3 - (o + 3) % 4;
    if (o === 0 || o > e - n) {
      console.error("KTXLoader: keyAndValueByteSize out of bounds");
      break;
    }
    for (var h = 0; h < o && r.getUint8(s + h) !== 0; h++)
      ;
    if (h === -1) {
      console.error("KTXLoader: Failed to find null byte terminating kvData key");
      break;
    }
    var u = new TextDecoder().decode(new Uint8Array(r.buffer, s, h)), l = new DataView(r.buffer, s + h + 1, o - h - 1);
    i.set(u, l), n += 4 + o + a;
  }
  return i;
}
Et.setExtensionXhrType("dds", Et.XHR_RESPONSE_TYPE.BUFFER);
var Hb = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(e, t) {
      if (e.extension === "dds" && e.data)
        try {
          Object.assign(e, Wl(e.name || e.url, Fb(e.data), e.metadata));
        } catch (i) {
          t(i);
          return;
        }
      t();
    }, r.extension = ft.Loader, r;
  }()
);
Et.setExtensionXhrType("ktx", Et.XHR_RESPONSE_TYPE.BUFFER);
var Yb = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(e, t) {
      if (e.extension === "ktx" && e.data)
        try {
          var i = e.name || e.url, n = Ub(i, e.data, this.loadKeyValueData), o = n.compressed, s = n.uncompressed, a = n.kvData;
          if (o) {
            var h = Wl(i, o, e.metadata);
            if (a && h.textures)
              for (var u in h.textures)
                h.textures[u].baseTexture.ktxKeyValueData = a;
            Object.assign(e, h);
          } else if (s) {
            var l = {};
            s.forEach(function(c, d) {
              var f = new $(new it(c.resource, {
                mipmap: Qt.OFF,
                alphaMode: te.NO_PREMULTIPLIED_ALPHA,
                type: c.type,
                format: c.format
              })), p = i + "-" + (d + 1);
              a && (f.baseTexture.ktxKeyValueData = a), it.addToCache(f.baseTexture, p), $.addToCache(f, p), d === 0 && (l[i] = f, it.addToCache(f.baseTexture, i), $.addToCache(f, i)), l[p] = f;
            }), Object.assign(e, { textures: l });
          }
        } catch (c) {
          t(c);
          return;
        }
      t();
    }, r.extension = ft.Loader, r.loadKeyValueData = !1, r;
  }()
);
/*!
 * @pixi/particle-container - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/particle-container is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Es = function(r, e) {
  return Es = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Es(r, e);
};
function ql(r, e) {
  Es(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
(function(r) {
  ql(e, r);
  function e(t, i, n, o) {
    t === void 0 && (t = 1500), n === void 0 && (n = 16384), o === void 0 && (o = !1);
    var s = r.call(this) || this, a = 16384;
    return n > a && (n = a), s._properties = [!1, !0, !1, !1, !1], s._maxSize = t, s._batchSize = n, s._buffers = null, s._bufferUpdateIDs = [], s._updateID = 0, s.interactiveChildren = !1, s.blendMode = X.NORMAL, s.autoResize = o, s.roundPixels = !0, s.baseTexture = null, s.setProperties(i), s._tint = 0, s.tintRgb = new Float32Array(4), s.tint = 16777215, s;
  }
  return e.prototype.setProperties = function(t) {
    t && (this._properties[0] = "vertices" in t || "scale" in t ? !!t.vertices || !!t.scale : this._properties[0], this._properties[1] = "position" in t ? !!t.position : this._properties[1], this._properties[2] = "rotation" in t ? !!t.rotation : this._properties[2], this._properties[3] = "uvs" in t ? !!t.uvs : this._properties[3], this._properties[4] = "tint" in t || "alpha" in t ? !!t.tint || !!t.alpha : this._properties[4]);
  }, e.prototype.updateTransform = function() {
    this.displayObjectUpdateTransform();
  }, Object.defineProperty(e.prototype, "tint", {
    /**
     * The tint applied to the container. This is a hex value.
     * A value of 0xFFFFFF will remove any tint effect.
     * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
     * @default 0xFFFFFF
     */
    get: function() {
      return this._tint;
    },
    set: function(t) {
      this._tint = t, kr(t, this.tintRgb);
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.render = function(t) {
    var i = this;
    !this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable || (this.baseTexture || (this.baseTexture = this.children[0]._texture.baseTexture, this.baseTexture.valid || this.baseTexture.once("update", function() {
      return i.onChildrenChange(0);
    })), t.batch.setObjectRenderer(t.plugins.particle), t.plugins.particle.render(this));
  }, e.prototype.onChildrenChange = function(t) {
    for (var i = Math.floor(t / this._batchSize); this._bufferUpdateIDs.length < i; )
      this._bufferUpdateIDs.push(0);
    this._bufferUpdateIDs[i] = ++this._updateID;
  }, e.prototype.dispose = function() {
    if (this._buffers) {
      for (var t = 0; t < this._buffers.length; ++t)
        this._buffers[t].destroy();
      this._buffers = null;
    }
  }, e.prototype.destroy = function(t) {
    r.prototype.destroy.call(this, t), this.dispose(), this._properties = null, this._buffers = null, this._bufferUpdateIDs = null;
  }, e;
})(le);
var iu = (
  /** @class */
  function() {
    function r(e, t, i) {
      this.geometry = new Ri(), this.indexBuffer = null, this.size = i, this.dynamicProperties = [], this.staticProperties = [];
      for (var n = 0; n < e.length; ++n) {
        var o = e[n];
        o = {
          attributeName: o.attributeName,
          size: o.size,
          uploadFunction: o.uploadFunction,
          type: o.type || k.FLOAT,
          offset: o.offset
        }, t[n] ? this.dynamicProperties.push(o) : this.staticProperties.push(o);
      }
      this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this._updateID = 0, this.initBuffers();
    }
    return r.prototype.initBuffers = function() {
      var e = this.geometry, t = 0;
      this.indexBuffer = new Rt(ev(this.size), !0, !0), e.addIndex(this.indexBuffer), this.dynamicStride = 0;
      for (var i = 0; i < this.dynamicProperties.length; ++i) {
        var n = this.dynamicProperties[i];
        n.offset = t, t += n.size, this.dynamicStride += n.size;
      }
      var o = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
      this.dynamicData = new Float32Array(o), this.dynamicDataUint32 = new Uint32Array(o), this.dynamicBuffer = new Rt(this.dynamicData, !1, !1);
      var s = 0;
      this.staticStride = 0;
      for (var i = 0; i < this.staticProperties.length; ++i) {
        var n = this.staticProperties[i];
        n.offset = s, s += n.size, this.staticStride += n.size;
      }
      var a = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
      this.staticData = new Float32Array(a), this.staticDataUint32 = new Uint32Array(a), this.staticBuffer = new Rt(this.staticData, !0, !1);
      for (var i = 0; i < this.dynamicProperties.length; ++i) {
        var n = this.dynamicProperties[i];
        e.addAttribute(n.attributeName, this.dynamicBuffer, 0, n.type === k.UNSIGNED_BYTE, n.type, this.dynamicStride * 4, n.offset * 4);
      }
      for (var i = 0; i < this.staticProperties.length; ++i) {
        var n = this.staticProperties[i];
        e.addAttribute(n.attributeName, this.staticBuffer, 0, n.type === k.UNSIGNED_BYTE, n.type, this.staticStride * 4, n.offset * 4);
      }
    }, r.prototype.uploadDynamic = function(e, t, i) {
      for (var n = 0; n < this.dynamicProperties.length; n++) {
        var o = this.dynamicProperties[n];
        o.uploadFunction(e, t, i, o.type === k.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, o.offset);
      }
      this.dynamicBuffer._updateID++;
    }, r.prototype.uploadStatic = function(e, t, i) {
      for (var n = 0; n < this.staticProperties.length; n++) {
        var o = this.staticProperties[n];
        o.uploadFunction(e, t, i, o.type === k.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, o.offset);
      }
      this.staticBuffer._updateID++;
    }, r.prototype.destroy = function() {
      this.indexBuffer = null, this.dynamicProperties = null, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this.staticProperties = null, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.geometry.destroy();
    }, r;
  }()
), Vb = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void){
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = color;
}`, $b = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;

attribute vec2 aPositionCoord;
attribute float aRotation;

uniform mat3 translationMatrix;
uniform vec4 uColor;

varying vec2 vTextureCoord;
varying vec4 vColor;

void main(void){
    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);
    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);

    vec2 v = vec2(x, y);
    v = v + aPositionCoord;

    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vColor = aColor * uColor;
}
`, zb = (
  /** @class */
  function(r) {
    ql(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.shader = null, i.properties = null, i.tempMatrix = new Pt(), i.properties = [
        // verticesData
        {
          attributeName: "aVertexPosition",
          size: 2,
          uploadFunction: i.uploadVertices,
          offset: 0
        },
        // positionData
        {
          attributeName: "aPositionCoord",
          size: 2,
          uploadFunction: i.uploadPosition,
          offset: 0
        },
        // rotationData
        {
          attributeName: "aRotation",
          size: 1,
          uploadFunction: i.uploadRotation,
          offset: 0
        },
        // uvsData
        {
          attributeName: "aTextureCoord",
          size: 2,
          uploadFunction: i.uploadUvs,
          offset: 0
        },
        // tintData
        {
          attributeName: "aColor",
          size: 1,
          type: k.UNSIGNED_BYTE,
          uploadFunction: i.uploadTint,
          offset: 0
        }
      ], i.shader = Ce.from($b, Vb, {}), i.state = cr.for2d(), i;
    }
    return e.prototype.render = function(t) {
      var i = t.children, n = t._maxSize, o = t._batchSize, s = this.renderer, a = i.length;
      if (a !== 0) {
        a > n && !t.autoResize && (a = n);
        var h = t._buffers;
        h || (h = t._buffers = this.generateBuffers(t));
        var u = i[0]._texture.baseTexture, l = u.alphaMode > 0;
        this.state.blendMode = El(t.blendMode, l), s.state.set(this.state);
        var c = s.gl, d = t.worldTransform.copyTo(this.tempMatrix);
        d.prepend(s.globalUniforms.uniforms.projectionMatrix), this.shader.uniforms.translationMatrix = d.toArray(!0), this.shader.uniforms.uColor = tv(t.tintRgb, t.worldAlpha, this.shader.uniforms.uColor, l), this.shader.uniforms.uSampler = u, this.renderer.shader.bind(this.shader);
        for (var f = !1, p = 0, m = 0; p < a; p += o, m += 1) {
          var y = a - p;
          y > o && (y = o), m >= h.length && h.push(this._generateOneMoreBuffer(t));
          var _ = h[m];
          _.uploadDynamic(i, p, y);
          var g = t._bufferUpdateIDs[m] || 0;
          f = f || _._updateID < g, f && (_._updateID = t._updateID, _.uploadStatic(i, p, y)), s.geometry.bind(_.geometry), c.drawElements(c.TRIANGLES, y * 6, c.UNSIGNED_SHORT, 0);
        }
      }
    }, e.prototype.generateBuffers = function(t) {
      for (var i = [], n = t._maxSize, o = t._batchSize, s = t._properties, a = 0; a < n; a += o)
        i.push(new iu(this.properties, s, o));
      return i;
    }, e.prototype._generateOneMoreBuffer = function(t) {
      var i = t._batchSize, n = t._properties;
      return new iu(this.properties, n, i);
    }, e.prototype.uploadVertices = function(t, i, n, o, s, a) {
      for (var h = 0, u = 0, l = 0, c = 0, d = 0; d < n; ++d) {
        var f = t[i + d], p = f._texture, m = f.scale.x, y = f.scale.y, _ = p.trim, g = p.orig;
        _ ? (u = _.x - f.anchor.x * g.width, h = u + _.width, c = _.y - f.anchor.y * g.height, l = c + _.height) : (h = g.width * (1 - f.anchor.x), u = g.width * -f.anchor.x, l = g.height * (1 - f.anchor.y), c = g.height * -f.anchor.y), o[a] = u * m, o[a + 1] = c * y, o[a + s] = h * m, o[a + s + 1] = c * y, o[a + s * 2] = h * m, o[a + s * 2 + 1] = l * y, o[a + s * 3] = u * m, o[a + s * 3 + 1] = l * y, a += s * 4;
      }
    }, e.prototype.uploadPosition = function(t, i, n, o, s, a) {
      for (var h = 0; h < n; h++) {
        var u = t[i + h].position;
        o[a] = u.x, o[a + 1] = u.y, o[a + s] = u.x, o[a + s + 1] = u.y, o[a + s * 2] = u.x, o[a + s * 2 + 1] = u.y, o[a + s * 3] = u.x, o[a + s * 3 + 1] = u.y, a += s * 4;
      }
    }, e.prototype.uploadRotation = function(t, i, n, o, s, a) {
      for (var h = 0; h < n; h++) {
        var u = t[i + h].rotation;
        o[a] = u, o[a + s] = u, o[a + s * 2] = u, o[a + s * 3] = u, a += s * 4;
      }
    }, e.prototype.uploadUvs = function(t, i, n, o, s, a) {
      for (var h = 0; h < n; ++h) {
        var u = t[i + h]._texture._uvs;
        u ? (o[a] = u.x0, o[a + 1] = u.y0, o[a + s] = u.x1, o[a + s + 1] = u.y1, o[a + s * 2] = u.x2, o[a + s * 2 + 1] = u.y2, o[a + s * 3] = u.x3, o[a + s * 3 + 1] = u.y3, a += s * 4) : (o[a] = 0, o[a + 1] = 0, o[a + s] = 0, o[a + s + 1] = 0, o[a + s * 2] = 0, o[a + s * 2 + 1] = 0, o[a + s * 3] = 0, o[a + s * 3 + 1] = 0, a += s * 4);
      }
    }, e.prototype.uploadTint = function(t, i, n, o, s, a) {
      for (var h = 0; h < n; ++h) {
        var u = t[i + h], l = u._texture.baseTexture.alphaMode > 0, c = u.alpha, d = c < 1 && l ? ua(u._tintRGB, c) : u._tintRGB + (c * 255 << 24);
        o[a] = d, o[a + s] = d, o[a + s * 2] = d, o[a + s * 3] = d, a += s * 4;
      }
    }, e.prototype.destroy = function() {
      r.prototype.destroy.call(this), this.shader && (this.shader.destroy(), this.shader = null), this.tempMatrix = null;
    }, e.extension = {
      name: "particle",
      type: ft.RendererPlugin
    }, e;
  }(jn)
);
/*!
 * @pixi/graphics - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/graphics is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var _e;
(function(r) {
  r.MITER = "miter", r.BEVEL = "bevel", r.ROUND = "round";
})(_e || (_e = {}));
var De;
(function(r) {
  r.BUTT = "butt", r.ROUND = "round", r.SQUARE = "square";
})(De || (De = {}));
var _i = {
  adaptive: !0,
  maxLength: 10,
  minSegments: 8,
  maxSegments: 2048,
  epsilon: 1e-4,
  _segmentsCount: function(r, e) {
    if (e === void 0 && (e = 20), !this.adaptive || !r || isNaN(r))
      return e;
    var t = Math.ceil(r / this.maxLength);
    return t < this.minSegments ? t = this.minSegments : t > this.maxSegments && (t = this.maxSegments), t;
  }
}, Kl = (
  /** @class */
  function() {
    function r() {
      this.color = 16777215, this.alpha = 1, this.texture = $.WHITE, this.matrix = null, this.visible = !1, this.reset();
    }
    return r.prototype.clone = function() {
      var e = new r();
      return e.color = this.color, e.alpha = this.alpha, e.texture = this.texture, e.matrix = this.matrix, e.visible = this.visible, e;
    }, r.prototype.reset = function() {
      this.color = 16777215, this.alpha = 1, this.texture = $.WHITE, this.matrix = null, this.visible = !1;
    }, r.prototype.destroy = function() {
      this.texture = null, this.matrix = null;
    }, r;
  }()
);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var As = function(r, e) {
  return As = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, As(r, e);
};
function da(r, e) {
  As(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function nu(r, e) {
  var t, i;
  e === void 0 && (e = !1);
  var n = r.length;
  if (!(n < 6)) {
    for (var o = 0, s = 0, a = r[n - 2], h = r[n - 1]; s < n; s += 2) {
      var u = r[s], l = r[s + 1];
      o += (u - a) * (l + h), a = u, h = l;
    }
    if (!e && o > 0 || e && o <= 0)
      for (var c = n / 2, s = c + c % 2; s < n; s += 2) {
        var d = n - s - 2, f = n - s - 1, p = s, m = s + 1;
        t = [r[p], r[d]], r[d] = t[0], r[p] = t[1], i = [r[m], r[f]], r[f] = i[0], r[m] = i[1];
      }
  }
}
var Zl = {
  build: function(r) {
    r.points = r.shape.points.slice();
  },
  triangulate: function(r, e) {
    var t = r.points, i = r.holes, n = e.points, o = e.indices;
    if (t.length >= 6) {
      nu(t, !1);
      for (var s = [], a = 0; a < i.length; a++) {
        var h = i[a];
        nu(h.points, !0), s.push(t.length / 2), t = t.concat(h.points);
      }
      var u = rl(t, s, 2);
      if (!u)
        return;
      for (var l = n.length / 2, a = 0; a < u.length; a += 3)
        o.push(u[a] + l), o.push(u[a + 1] + l), o.push(u[a + 2] + l);
      for (var a = 0; a < t.length; a++)
        n.push(t[a]);
    }
  }
}, Fn = {
  build: function(r) {
    var e = r.points, t, i, n, o, s, a;
    if (r.type === Dt.CIRC) {
      var h = r.shape;
      t = h.x, i = h.y, s = a = h.radius, n = o = 0;
    } else if (r.type === Dt.ELIP) {
      var u = r.shape;
      t = u.x, i = u.y, s = u.width, a = u.height, n = o = 0;
    } else {
      var l = r.shape, c = l.width / 2, d = l.height / 2;
      t = l.x + c, i = l.y + d, s = a = Math.max(0, Math.min(l.radius, Math.min(c, d))), n = c - s, o = d - a;
    }
    if (!(s >= 0 && a >= 0 && n >= 0 && o >= 0)) {
      e.length = 0;
      return;
    }
    var f = Math.ceil(2.3 * Math.sqrt(s + a)), p = f * 8 + (n ? 4 : 0) + (o ? 4 : 0);
    if (e.length = p, p !== 0) {
      if (f === 0) {
        e.length = 8, e[0] = e[6] = t + n, e[1] = e[3] = i + o, e[2] = e[4] = t - n, e[5] = e[7] = i - o;
        return;
      }
      var m = 0, y = f * 4 + (n ? 2 : 0) + 2, _ = y, g = p;
      {
        var v = n + s, b = o, T = t + v, S = t - v, w = i + b;
        if (e[m++] = T, e[m++] = w, e[--y] = w, e[--y] = S, o) {
          var A = i - b;
          e[_++] = S, e[_++] = A, e[--g] = A, e[--g] = T;
        }
      }
      for (var x = 1; x < f; x++) {
        var E = Math.PI / 2 * (x / f), v = n + Math.cos(E) * s, b = o + Math.sin(E) * a, T = t + v, S = t - v, w = i + b, A = i - b;
        e[m++] = T, e[m++] = w, e[--y] = w, e[--y] = S, e[_++] = S, e[_++] = A, e[--g] = A, e[--g] = T;
      }
      {
        var v = n, b = o + a, T = t + v, S = t - v, w = i + b, A = i - b;
        e[m++] = T, e[m++] = w, e[--g] = A, e[--g] = T, n && (e[m++] = S, e[m++] = w, e[--g] = A, e[--g] = S);
      }
    }
  },
  triangulate: function(r, e) {
    var t = r.points, i = e.points, n = e.indices;
    if (t.length !== 0) {
      var o = i.length / 2, s = o, a, h;
      if (r.type !== Dt.RREC) {
        var u = r.shape;
        a = u.x, h = u.y;
      } else {
        var l = r.shape;
        a = l.x + l.width / 2, h = l.y + l.height / 2;
      }
      var c = r.matrix;
      i.push(r.matrix ? c.a * a + c.c * h + c.tx : a, r.matrix ? c.b * a + c.d * h + c.ty : h), o++, i.push(t[0], t[1]);
      for (var d = 2; d < t.length; d += 2)
        i.push(t[d], t[d + 1]), n.push(o++, s, o);
      n.push(s + 1, s, o);
    }
  }
}, Wb = {
  build: function(r) {
    var e = r.shape, t = e.x, i = e.y, n = e.width, o = e.height, s = r.points;
    s.length = 0, s.push(t, i, t + n, i, t + n, i + o, t, i + o);
  },
  triangulate: function(r, e) {
    var t = r.points, i = e.points, n = i.length / 2;
    i.push(t[0], t[1], t[2], t[3], t[6], t[7], t[4], t[5]), e.indices.push(n, n + 1, n + 2, n + 1, n + 2, n + 3);
  }
};
function br(r, e, t) {
  var i = e - r;
  return r + i * t;
}
function nn(r, e, t, i, n, o, s) {
  s === void 0 && (s = []);
  for (var a = 20, h = s, u = 0, l = 0, c = 0, d = 0, f = 0, p = 0, m = 0, y = 0; m <= a; ++m)
    y = m / a, u = br(r, t, y), l = br(e, i, y), c = br(t, n, y), d = br(i, o, y), f = br(u, c, y), p = br(l, d, y), !(m === 0 && h[h.length - 2] === f && h[h.length - 1] === p) && h.push(f, p);
  return h;
}
var qb = {
  build: function(r) {
    if (hr.nextRoundedRectBehavior) {
      Fn.build(r);
      return;
    }
    var e = r.shape, t = r.points, i = e.x, n = e.y, o = e.width, s = e.height, a = Math.max(0, Math.min(e.radius, Math.min(o, s) / 2));
    t.length = 0, a ? (nn(i, n + a, i, n, i + a, n, t), nn(i + o - a, n, i + o, n, i + o, n + a, t), nn(i + o, n + s - a, i + o, n + s, i + o - a, n + s, t), nn(i + a, n + s, i, n + s, i, n + s - a, t)) : t.push(i, n, i + o, n, i + o, n + s, i, n + s);
  },
  triangulate: function(r, e) {
    if (hr.nextRoundedRectBehavior) {
      Fn.triangulate(r, e);
      return;
    }
    for (var t = r.points, i = e.points, n = e.indices, o = i.length / 2, s = rl(t, null, 2), a = 0, h = s.length; a < h; a += 3)
      n.push(s[a] + o), n.push(s[a + 1] + o), n.push(s[a + 2] + o);
    for (var a = 0, h = t.length; a < h; a++)
      i.push(t[a], t[++a]);
  }
};
function ou(r, e, t, i, n, o, s, a) {
  var h = r - t * n, u = e - i * n, l = r + t * o, c = e + i * o, d, f;
  s ? (d = i, f = -t) : (d = -i, f = t);
  var p = h + d, m = u + f, y = l + d, _ = c + f;
  return a.push(p, m), a.push(y, _), 2;
}
function Ye(r, e, t, i, n, o, s, a) {
  var h = t - r, u = i - e, l = Math.atan2(h, u), c = Math.atan2(n - r, o - e);
  a && l < c ? l += Math.PI * 2 : !a && l > c && (c += Math.PI * 2);
  var d = l, f = c - l, p = Math.abs(f), m = Math.sqrt(h * h + u * u), y = (15 * p * Math.sqrt(m) / Math.PI >> 0) + 1, _ = f / y;
  if (d += _, a) {
    s.push(r, e), s.push(t, i);
    for (var g = 1, v = d; g < y; g++, v += _)
      s.push(r, e), s.push(r + Math.sin(v) * m, e + Math.cos(v) * m);
    s.push(r, e), s.push(n, o);
  } else {
    s.push(t, i), s.push(r, e);
    for (var g = 1, v = d; g < y; g++, v += _)
      s.push(r + Math.sin(v) * m, e + Math.cos(v) * m), s.push(r, e);
    s.push(n, o), s.push(r, e);
  }
  return y * 2;
}
function Kb(r, e) {
  var t = r.shape, i = r.points || t.points.slice(), n = e.closePointEps;
  if (i.length !== 0) {
    var o = r.lineStyle, s = new yt(i[0], i[1]), a = new yt(i[i.length - 2], i[i.length - 1]), h = t.type !== Dt.POLY || t.closeStroke, u = Math.abs(s.x - a.x) < n && Math.abs(s.y - a.y) < n;
    if (h) {
      i = i.slice(), u && (i.pop(), i.pop(), a.set(i[i.length - 2], i[i.length - 1]));
      var l = (s.x + a.x) * 0.5, c = (a.y + s.y) * 0.5;
      i.unshift(l, c), i.push(l, c);
    }
    var d = e.points, f = i.length / 2, p = i.length, m = d.length / 2, y = o.width / 2, _ = y * y, g = o.miterLimit * o.miterLimit, v = i[0], b = i[1], T = i[2], S = i[3], w = 0, A = 0, x = -(b - S), E = v - T, O = 0, P = 0, M = Math.sqrt(x * x + E * E);
    x /= M, E /= M, x *= y, E *= y;
    var F = o.alignment, D = (1 - F) * 2, C = F * 2;
    h || (o.cap === De.ROUND ? p += Ye(v - x * (D - C) * 0.5, b - E * (D - C) * 0.5, v - x * D, b - E * D, v + x * C, b + E * C, d, !0) + 2 : o.cap === De.SQUARE && (p += ou(v, b, x, E, D, C, !0, d))), d.push(v - x * D, b - E * D), d.push(v + x * C, b + E * C);
    for (var V = 1; V < f - 1; ++V) {
      v = i[(V - 1) * 2], b = i[(V - 1) * 2 + 1], T = i[V * 2], S = i[V * 2 + 1], w = i[(V + 1) * 2], A = i[(V + 1) * 2 + 1], x = -(b - S), E = v - T, M = Math.sqrt(x * x + E * E), x /= M, E /= M, x *= y, E *= y, O = -(S - A), P = T - w, M = Math.sqrt(O * O + P * P), O /= M, P /= M, O *= y, P *= y;
      var st = T - v, q = b - S, L = T - w, I = A - S, j = st * L + q * I, K = q * L - I * st, J = K < 0;
      if (Math.abs(K) < 1e-3 * Math.abs(j)) {
        d.push(T - x * D, S - E * D), d.push(T + x * C, S + E * C), j >= 0 && (o.join === _e.ROUND ? p += Ye(T, S, T - x * D, S - E * D, T - O * D, S - P * D, d, !1) + 4 : p += 2, d.push(T - O * C, S - P * C), d.push(T + O * D, S + P * D));
        continue;
      }
      var mt = (-x + v) * (-E + S) - (-x + T) * (-E + b), W = (-O + w) * (-P + S) - (-O + T) * (-P + A), lt = (st * W - L * mt) / K, vt = (I * mt - q * W) / K, At = (lt - T) * (lt - T) + (vt - S) * (vt - S), Q = T + (lt - T) * D, ot = S + (vt - S) * D, at = T - (lt - T) * C, dt = S - (vt - S) * C, Z = Math.min(st * st + q * q, L * L + I * I), U = J ? D : C, B = Z + U * U * _, ht = At <= B;
      ht ? o.join === _e.BEVEL || At / _ > g ? (J ? (d.push(Q, ot), d.push(T + x * C, S + E * C), d.push(Q, ot), d.push(T + O * C, S + P * C)) : (d.push(T - x * D, S - E * D), d.push(at, dt), d.push(T - O * D, S - P * D), d.push(at, dt)), p += 2) : o.join === _e.ROUND ? J ? (d.push(Q, ot), d.push(T + x * C, S + E * C), p += Ye(T, S, T + x * C, S + E * C, T + O * C, S + P * C, d, !0) + 4, d.push(Q, ot), d.push(T + O * C, S + P * C)) : (d.push(T - x * D, S - E * D), d.push(at, dt), p += Ye(T, S, T - x * D, S - E * D, T - O * D, S - P * D, d, !1) + 4, d.push(T - O * D, S - P * D), d.push(at, dt)) : (d.push(Q, ot), d.push(at, dt)) : (d.push(T - x * D, S - E * D), d.push(T + x * C, S + E * C), o.join === _e.ROUND ? J ? p += Ye(T, S, T + x * C, S + E * C, T + O * C, S + P * C, d, !0) + 2 : p += Ye(T, S, T - x * D, S - E * D, T - O * D, S - P * D, d, !1) + 2 : o.join === _e.MITER && At / _ <= g && (J ? (d.push(at, dt), d.push(at, dt)) : (d.push(Q, ot), d.push(Q, ot)), p += 2), d.push(T - O * D, S - P * D), d.push(T + O * C, S + P * C), p += 2);
    }
    v = i[(f - 2) * 2], b = i[(f - 2) * 2 + 1], T = i[(f - 1) * 2], S = i[(f - 1) * 2 + 1], x = -(b - S), E = v - T, M = Math.sqrt(x * x + E * E), x /= M, E /= M, x *= y, E *= y, d.push(T - x * D, S - E * D), d.push(T + x * C, S + E * C), h || (o.cap === De.ROUND ? p += Ye(T - x * (D - C) * 0.5, S - E * (D - C) * 0.5, T - x * D, S - E * D, T + x * C, S + E * C, d, !1) + 2 : o.cap === De.SQUARE && (p += ou(T, S, x, E, D, C, !1, d)));
    for (var ie = e.indices, dr = _i.epsilon * _i.epsilon, V = m; V < p + m - 2; ++V)
      v = d[V * 2], b = d[V * 2 + 1], T = d[(V + 1) * 2], S = d[(V + 1) * 2 + 1], w = d[(V + 2) * 2], A = d[(V + 2) * 2 + 1], !(Math.abs(v * (S - A) + T * (A - b) + w * (b - S)) < dr) && ie.push(V, V + 1, V + 2);
  }
}
function Zb(r, e) {
  var t = 0, i = r.shape, n = r.points || i.points, o = i.type !== Dt.POLY || i.closeStroke;
  if (n.length !== 0) {
    var s = e.points, a = e.indices, h = n.length / 2, u = s.length / 2, l = u;
    for (s.push(n[0], n[1]), t = 1; t < h; t++)
      s.push(n[t * 2], n[t * 2 + 1]), a.push(l, l + 1), l++;
    o && a.push(l, u);
  }
}
function su(r, e) {
  r.lineStyle.native ? Zb(r, e) : Kb(r, e);
}
var au = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveTo = function(e, t, i, n, o, s) {
      var a = s[s.length - 2], h = s[s.length - 1], u = h - t, l = a - e, c = n - t, d = i - e, f = Math.abs(u * d - l * c);
      if (f < 1e-8 || o === 0)
        return (s[s.length - 2] !== e || s[s.length - 1] !== t) && s.push(e, t), null;
      var p = u * u + l * l, m = c * c + d * d, y = u * c + l * d, _ = o * Math.sqrt(p) / f, g = o * Math.sqrt(m) / f, v = _ * y / p, b = g * y / m, T = _ * d + g * l, S = _ * c + g * u, w = l * (g + v), A = u * (g + v), x = d * (_ + b), E = c * (_ + b), O = Math.atan2(A - S, w - T), P = Math.atan2(E - S, x - T);
      return {
        cx: T + e,
        cy: S + t,
        radius: o,
        startAngle: O,
        endAngle: P,
        anticlockwise: l * c > d * u
      };
    }, r.arc = function(e, t, i, n, o, s, a, h, u) {
      for (var l = a - s, c = _i._segmentsCount(Math.abs(l) * o, Math.ceil(Math.abs(l) / In) * 40), d = l / (c * 2), f = d * 2, p = Math.cos(d), m = Math.sin(d), y = c - 1, _ = y % 1 / y, g = 0; g <= y; ++g) {
        var v = g + _ * g, b = d + s + f * v, T = Math.cos(b), S = -Math.sin(b);
        u.push((p * T + m * S) * o + i, (p * -S + m * T) * o + n);
      }
    }, r;
  }()
), Jb = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveLength = function(e, t, i, n, o, s, a, h) {
      for (var u = 10, l = 0, c = 0, d = 0, f = 0, p = 0, m = 0, y = 0, _ = 0, g = 0, v = 0, b = 0, T = e, S = t, w = 1; w <= u; ++w)
        c = w / u, d = c * c, f = d * c, p = 1 - c, m = p * p, y = m * p, _ = y * e + 3 * m * c * i + 3 * p * d * o + f * a, g = y * t + 3 * m * c * n + 3 * p * d * s + f * h, v = T - _, b = S - g, T = _, S = g, l += Math.sqrt(v * v + b * b);
      return l;
    }, r.curveTo = function(e, t, i, n, o, s, a) {
      var h = a[a.length - 2], u = a[a.length - 1];
      a.length -= 2;
      var l = _i._segmentsCount(r.curveLength(h, u, e, t, i, n, o, s)), c = 0, d = 0, f = 0, p = 0, m = 0;
      a.push(h, u);
      for (var y = 1, _ = 0; y <= l; ++y)
        _ = y / l, c = 1 - _, d = c * c, f = d * c, p = _ * _, m = p * _, a.push(f * h + 3 * d * _ * e + 3 * c * p * i + m * o, f * u + 3 * d * _ * t + 3 * c * p * n + m * s);
    }, r;
  }()
), Qb = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveLength = function(e, t, i, n, o, s) {
      var a = e - 2 * i + o, h = t - 2 * n + s, u = 2 * i - 2 * e, l = 2 * n - 2 * t, c = 4 * (a * a + h * h), d = 4 * (a * u + h * l), f = u * u + l * l, p = 2 * Math.sqrt(c + d + f), m = Math.sqrt(c), y = 2 * c * m, _ = 2 * Math.sqrt(f), g = d / m;
      return (y * p + m * d * (p - _) + (4 * f * c - d * d) * Math.log((2 * m + g + p) / (g + _))) / (4 * y);
    }, r.curveTo = function(e, t, i, n, o) {
      for (var s = o[o.length - 2], a = o[o.length - 1], h = _i._segmentsCount(r.curveLength(s, a, e, t, i, n)), u = 0, l = 0, c = 1; c <= h; ++c) {
        var d = c / h;
        u = s + (e - s) * d, l = a + (t - a) * d, o.push(u + (e + (i - e) * d - u) * d, l + (t + (n - t) * d - l) * d);
      }
    }, r;
  }()
), t1 = (
  /** @class */
  function() {
    function r() {
      this.reset();
    }
    return r.prototype.begin = function(e, t, i) {
      this.reset(), this.style = e, this.start = t, this.attribStart = i;
    }, r.prototype.end = function(e, t) {
      this.attribSize = t - this.attribStart, this.size = e - this.start;
    }, r.prototype.reset = function() {
      this.style = null, this.size = 0, this.start = 0, this.attribStart = 0, this.attribSize = 0;
    }, r;
  }()
), Ve, Do = (Ve = {}, Ve[Dt.POLY] = Zl, Ve[Dt.CIRC] = Fn, Ve[Dt.ELIP] = Fn, Ve[Dt.RECT] = Wb, Ve[Dt.RREC] = qb, Ve), hu = [], on = [], uu = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      t === void 0 && (t = null), i === void 0 && (i = null), n === void 0 && (n = null), this.points = [], this.holes = [], this.shape = e, this.lineStyle = i, this.fillStyle = t, this.matrix = n, this.type = e.type;
    }
    return r.prototype.clone = function() {
      return new r(this.shape, this.fillStyle, this.lineStyle, this.matrix);
    }, r.prototype.destroy = function() {
      this.shape = null, this.holes.length = 0, this.holes = null, this.points.length = 0, this.points = null, this.lineStyle = null, this.fillStyle = null;
    }, r;
  }()
), xr = new yt(), e1 = (
  /** @class */
  function(r) {
    da(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.closePointEps = 1e-4, t.boundsPadding = 0, t.uvsFloat32 = null, t.indicesUint16 = null, t.batchable = !1, t.points = [], t.colors = [], t.uvs = [], t.indices = [], t.textureIds = [], t.graphicsData = [], t.drawCalls = [], t.batchDirty = -1, t.batches = [], t.dirty = 0, t.cacheDirty = -1, t.clearDirty = 0, t.shapeIndex = 0, t._bounds = new Dn(), t.boundsDirty = -1, t;
    }
    return Object.defineProperty(e.prototype, "bounds", {
      /**
       * Get the current bounds of the graphic geometry.
       * @readonly
       */
      get: function() {
        return this.updateBatches(), this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty, this.calculateBounds()), this._bounds;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.invalidate = function() {
      this.boundsDirty = -1, this.dirty++, this.batchDirty++, this.shapeIndex = 0, this.points.length = 0, this.colors.length = 0, this.uvs.length = 0, this.indices.length = 0, this.textureIds.length = 0;
      for (var t = 0; t < this.drawCalls.length; t++)
        this.drawCalls[t].texArray.clear(), on.push(this.drawCalls[t]);
      this.drawCalls.length = 0;
      for (var t = 0; t < this.batches.length; t++) {
        var i = this.batches[t];
        i.reset(), hu.push(i);
      }
      this.batches.length = 0;
    }, e.prototype.clear = function() {
      return this.graphicsData.length > 0 && (this.invalidate(), this.clearDirty++, this.graphicsData.length = 0), this;
    }, e.prototype.drawShape = function(t, i, n, o) {
      i === void 0 && (i = null), n === void 0 && (n = null), o === void 0 && (o = null);
      var s = new uu(t, i, n, o);
      return this.graphicsData.push(s), this.dirty++, this;
    }, e.prototype.drawHole = function(t, i) {
      if (i === void 0 && (i = null), !this.graphicsData.length)
        return null;
      var n = new uu(t, null, null, i), o = this.graphicsData[this.graphicsData.length - 1];
      return n.lineStyle = o.lineStyle, o.holes.push(n), this.dirty++, this;
    }, e.prototype.destroy = function() {
      r.prototype.destroy.call(this);
      for (var t = 0; t < this.graphicsData.length; ++t)
        this.graphicsData[t].destroy();
      this.points.length = 0, this.points = null, this.colors.length = 0, this.colors = null, this.uvs.length = 0, this.uvs = null, this.indices.length = 0, this.indices = null, this.indexBuffer.destroy(), this.indexBuffer = null, this.graphicsData.length = 0, this.graphicsData = null, this.drawCalls.length = 0, this.drawCalls = null, this.batches.length = 0, this.batches = null, this._bounds = null;
    }, e.prototype.containsPoint = function(t) {
      for (var i = this.graphicsData, n = 0; n < i.length; ++n) {
        var o = i[n];
        if (o.fillStyle.visible && o.shape && (o.matrix ? o.matrix.applyInverse(t, xr) : xr.copyFrom(t), o.shape.contains(xr.x, xr.y))) {
          var s = !1;
          if (o.holes)
            for (var a = 0; a < o.holes.length; a++) {
              var h = o.holes[a];
              if (h.shape.contains(xr.x, xr.y)) {
                s = !0;
                break;
              }
            }
          if (!s)
            return !0;
        }
      }
      return !1;
    }, e.prototype.updateBatches = function() {
      if (!this.graphicsData.length) {
        this.batchable = !0;
        return;
      }
      if (this.validateBatching()) {
        this.cacheDirty = this.dirty;
        var t = this.uvs, i = this.graphicsData, n = null, o = null;
        this.batches.length > 0 && (n = this.batches[this.batches.length - 1], o = n.style);
        for (var s = this.shapeIndex; s < i.length; s++) {
          this.shapeIndex++;
          var a = i[s], h = a.fillStyle, u = a.lineStyle, l = Do[a.type];
          l.build(a), a.matrix && this.transformPoints(a.points, a.matrix), (h.visible || u.visible) && this.processHoles(a.holes);
          for (var c = 0; c < 2; c++) {
            var d = c === 0 ? h : u;
            if (d.visible) {
              var f = d.texture.baseTexture, p = this.indices.length, m = this.points.length / 2;
              f.wrapMode = he.REPEAT, c === 0 ? this.processFill(a) : this.processLine(a);
              var y = this.points.length / 2 - m;
              y !== 0 && (n && !this._compareStyles(o, d) && (n.end(p, m), n = null), n || (n = hu.pop() || new t1(), n.begin(d, p, m), this.batches.push(n), o = d), this.addUvs(this.points, t, d.texture, m, y, d.matrix));
            }
          }
        }
        var _ = this.indices.length, g = this.points.length / 2;
        if (n && n.end(_, g), this.batches.length === 0) {
          this.batchable = !0;
          return;
        }
        var v = g > 65535;
        this.indicesUint16 && this.indices.length === this.indicesUint16.length && v === this.indicesUint16.BYTES_PER_ELEMENT > 2 ? this.indicesUint16.set(this.indices) : this.indicesUint16 = v ? new Uint32Array(this.indices) : new Uint16Array(this.indices), this.batchable = this.isBatchable(), this.batchable ? this.packBatches() : this.buildDrawCalls();
      }
    }, e.prototype._compareStyles = function(t, i) {
      return !(!t || !i || t.texture.baseTexture !== i.texture.baseTexture || t.color + t.alpha !== i.color + i.alpha || !!t.native != !!i.native);
    }, e.prototype.validateBatching = function() {
      if (this.dirty === this.cacheDirty || !this.graphicsData.length)
        return !1;
      for (var t = 0, i = this.graphicsData.length; t < i; t++) {
        var n = this.graphicsData[t], o = n.fillStyle, s = n.lineStyle;
        if (o && !o.texture.baseTexture.valid || s && !s.texture.baseTexture.valid)
          return !1;
      }
      return !0;
    }, e.prototype.packBatches = function() {
      this.batchDirty++, this.uvsFloat32 = new Float32Array(this.uvs);
      for (var t = this.batches, i = 0, n = t.length; i < n; i++)
        for (var o = t[i], s = 0; s < o.size; s++) {
          var a = o.start + s;
          this.indicesUint16[a] = this.indicesUint16[a] - o.attribStart;
        }
    }, e.prototype.isBatchable = function() {
      if (this.points.length > 65535 * 2)
        return !1;
      for (var t = this.batches, i = 0; i < t.length; i++)
        if (t[i].style.native)
          return !1;
      return this.points.length < e.BATCHABLE_SIZE * 2;
    }, e.prototype.buildDrawCalls = function() {
      for (var t = ++it._globalBatch, i = 0; i < this.drawCalls.length; i++)
        this.drawCalls[i].texArray.clear(), on.push(this.drawCalls[i]);
      this.drawCalls.length = 0;
      var n = this.colors, o = this.textureIds, s = on.pop();
      s || (s = new ms(), s.texArray = new ys()), s.texArray.count = 0, s.start = 0, s.size = 0, s.type = qt.TRIANGLES;
      var a = 0, h = null, u = 0, l = !1, c = qt.TRIANGLES, d = 0;
      this.drawCalls.push(s);
      for (var i = 0; i < this.batches.length; i++) {
        var f = this.batches[i], p = 8, m = f.style, y = m.texture.baseTexture;
        l !== !!m.native && (l = !!m.native, c = l ? qt.LINES : qt.TRIANGLES, h = null, a = p, t++), h !== y && (h = y, y._batchEnabled !== t && (a === p && (t++, a = 0, s.size > 0 && (s = on.pop(), s || (s = new ms(), s.texArray = new ys()), this.drawCalls.push(s)), s.start = d, s.size = 0, s.texArray.count = 0, s.type = c), y.touched = 1, y._batchEnabled = t, y._batchLocation = a, y.wrapMode = he.REPEAT, s.texArray.elements[s.texArray.count++] = y, a++)), s.size += f.size, d += f.size, u = y._batchLocation, this.addColors(n, m.color, m.alpha, f.attribSize, f.attribStart), this.addTextureIds(o, u, f.attribSize, f.attribStart);
      }
      it._globalBatch = t, this.packAttributes();
    }, e.prototype.packAttributes = function() {
      for (var t = this.points, i = this.uvs, n = this.colors, o = this.textureIds, s = new ArrayBuffer(t.length * 3 * 4), a = new Float32Array(s), h = new Uint32Array(s), u = 0, l = 0; l < t.length / 2; l++)
        a[u++] = t[l * 2], a[u++] = t[l * 2 + 1], a[u++] = i[l * 2], a[u++] = i[l * 2 + 1], h[u++] = n[l], a[u++] = o[l];
      this._buffer.update(s), this._indexBuffer.update(this.indicesUint16);
    }, e.prototype.processFill = function(t) {
      if (t.holes.length)
        Zl.triangulate(t, this);
      else {
        var i = Do[t.type];
        i.triangulate(t, this);
      }
    }, e.prototype.processLine = function(t) {
      su(t, this);
      for (var i = 0; i < t.holes.length; i++)
        su(t.holes[i], this);
    }, e.prototype.processHoles = function(t) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i], o = Do[n.type];
        o.build(n), n.matrix && this.transformPoints(n.points, n.matrix);
      }
    }, e.prototype.calculateBounds = function() {
      var t = this._bounds;
      t.clear(), t.addVertexData(this.points, 0, this.points.length), t.pad(this.boundsPadding, this.boundsPadding);
    }, e.prototype.transformPoints = function(t, i) {
      for (var n = 0; n < t.length / 2; n++) {
        var o = t[n * 2], s = t[n * 2 + 1];
        t[n * 2] = i.a * o + i.c * s + i.tx, t[n * 2 + 1] = i.b * o + i.d * s + i.ty;
      }
    }, e.prototype.addColors = function(t, i, n, o, s) {
      s === void 0 && (s = 0);
      var a = (i >> 16) + (i & 65280) + ((i & 255) << 16), h = ua(a, n);
      t.length = Math.max(t.length, s + o);
      for (var u = 0; u < o; u++)
        t[s + u] = h;
    }, e.prototype.addTextureIds = function(t, i, n, o) {
      o === void 0 && (o = 0), t.length = Math.max(t.length, o + n);
      for (var s = 0; s < n; s++)
        t[o + s] = i;
    }, e.prototype.addUvs = function(t, i, n, o, s, a) {
      a === void 0 && (a = null);
      for (var h = 0, u = i.length, l = n.frame; h < s; ) {
        var c = t[(o + h) * 2], d = t[(o + h) * 2 + 1];
        if (a) {
          var f = a.a * c + a.c * d + a.tx;
          d = a.b * c + a.d * d + a.ty, c = f;
        }
        h++, i.push(c / l.width, d / l.height);
      }
      var p = n.baseTexture;
      (l.width < p.width || l.height < p.height) && this.adjustUvs(i, n, u, s);
    }, e.prototype.adjustUvs = function(t, i, n, o) {
      for (var s = i.baseTexture, a = 1e-6, h = n + o * 2, u = i.frame, l = u.width / s.width, c = u.height / s.height, d = u.x / u.width, f = u.y / u.height, p = Math.floor(t[n] + a), m = Math.floor(t[n + 1] + a), y = n + 2; y < h; y += 2)
        p = Math.min(p, Math.floor(t[y] + a)), m = Math.min(m, Math.floor(t[y + 1] + a));
      d -= p, f -= m;
      for (var y = n; y < h; y += 2)
        t[y] = (t[y] + d) * l, t[y + 1] = (t[y + 1] + f) * c;
    }, e.BATCHABLE_SIZE = 100, e;
  }(Yl)
), r1 = (
  /** @class */
  function(r) {
    da(e, r);
    function e() {
      var t = r !== null && r.apply(this, arguments) || this;
      return t.width = 0, t.alignment = 0.5, t.native = !1, t.cap = De.BUTT, t.join = _e.MITER, t.miterLimit = 10, t;
    }
    return e.prototype.clone = function() {
      var t = new e();
      return t.color = this.color, t.alpha = this.alpha, t.texture = this.texture, t.matrix = this.matrix, t.visible = this.visible, t.width = this.width, t.alignment = this.alignment, t.native = this.native, t.cap = this.cap, t.join = this.join, t.miterLimit = this.miterLimit, t;
    }, e.prototype.reset = function() {
      r.prototype.reset.call(this), this.color = 0, this.alignment = 0.5, this.width = 0, this.native = !1;
    }, e;
  }(Kl)
), i1 = new Float32Array(3), Co = {}, hr = (
  /** @class */
  function(r) {
    da(e, r);
    function e(t) {
      t === void 0 && (t = null);
      var i = r.call(this) || this;
      return i.shader = null, i.pluginName = "batch", i.currentPath = null, i.batches = [], i.batchTint = -1, i.batchDirty = -1, i.vertexData = null, i._fillStyle = new Kl(), i._lineStyle = new r1(), i._matrix = null, i._holeMode = !1, i.state = cr.for2d(), i._geometry = t || new e1(), i._geometry.refCount++, i._transformID = -1, i.tint = 16777215, i.blendMode = X.NORMAL, i;
    }
    return Object.defineProperty(e.prototype, "geometry", {
      /**
       * Includes vertex positions, face indices, normals, colors, UVs, and
       * custom attributes within buffers, reducing the cost of passing all
       * this data to the GPU. Can be shared between multiple Mesh or Graphics objects.
       * @readonly
       */
      get: function() {
        return this._geometry;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.clone = function() {
      return this.finishPoly(), new e(this._geometry);
    }, Object.defineProperty(e.prototype, "blendMode", {
      get: function() {
        return this.state.blendMode;
      },
      /**
       * The blend mode to be applied to the graphic shape. Apply a value of
       * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.  Note that, since each
       * primitive in the GraphicsGeometry list is rendered sequentially, modes
       * such as `PIXI.BLEND_MODES.ADD` and `PIXI.BLEND_MODES.MULTIPLY` will
       * be applied per-primitive.
       * @default PIXI.BLEND_MODES.NORMAL
       */
      set: function(t) {
        this.state.blendMode = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "tint", {
      /**
       * The tint applied to each graphic shape. This is a hex value. A value of
       * 0xFFFFFF will remove any tint effect.
       * @default 0xFFFFFF
       */
      get: function() {
        return this._tint;
      },
      set: function(t) {
        this._tint = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "fill", {
      /**
       * The current fill style.
       * @readonly
       */
      get: function() {
        return this._fillStyle;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "line", {
      /**
       * The current line style.
       * @readonly
       */
      get: function() {
        return this._lineStyle;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.lineStyle = function(t, i, n, o, s) {
      return t === void 0 && (t = null), i === void 0 && (i = 0), n === void 0 && (n = 1), o === void 0 && (o = 0.5), s === void 0 && (s = !1), typeof t == "number" && (t = { width: t, color: i, alpha: n, alignment: o, native: s }), this.lineTextureStyle(t);
    }, e.prototype.lineTextureStyle = function(t) {
      t = Object.assign({
        width: 0,
        texture: $.WHITE,
        color: t && t.texture ? 16777215 : 0,
        alpha: 1,
        matrix: null,
        alignment: 0.5,
        native: !1,
        cap: De.BUTT,
        join: _e.MITER,
        miterLimit: 10
      }, t), this.currentPath && this.startPoly();
      var i = t.width > 0 && t.alpha > 0;
      return i ? (t.matrix && (t.matrix = t.matrix.clone(), t.matrix.invert()), Object.assign(this._lineStyle, { visible: i }, t)) : this._lineStyle.reset(), this;
    }, e.prototype.startPoly = function() {
      if (this.currentPath) {
        var t = this.currentPath.points, i = this.currentPath.points.length;
        i > 2 && (this.drawShape(this.currentPath), this.currentPath = new mn(), this.currentPath.closeStroke = !1, this.currentPath.points.push(t[i - 2], t[i - 1]));
      } else
        this.currentPath = new mn(), this.currentPath.closeStroke = !1;
    }, e.prototype.finishPoly = function() {
      this.currentPath && (this.currentPath.points.length > 2 ? (this.drawShape(this.currentPath), this.currentPath = null) : this.currentPath.points.length = 0);
    }, e.prototype.moveTo = function(t, i) {
      return this.startPoly(), this.currentPath.points[0] = t, this.currentPath.points[1] = i, this;
    }, e.prototype.lineTo = function(t, i) {
      this.currentPath || this.moveTo(0, 0);
      var n = this.currentPath.points, o = n[n.length - 2], s = n[n.length - 1];
      return (o !== t || s !== i) && n.push(t, i), this;
    }, e.prototype._initCurve = function(t, i) {
      t === void 0 && (t = 0), i === void 0 && (i = 0), this.currentPath ? this.currentPath.points.length === 0 && (this.currentPath.points = [t, i]) : this.moveTo(t, i);
    }, e.prototype.quadraticCurveTo = function(t, i, n, o) {
      this._initCurve();
      var s = this.currentPath.points;
      return s.length === 0 && this.moveTo(0, 0), Qb.curveTo(t, i, n, o, s), this;
    }, e.prototype.bezierCurveTo = function(t, i, n, o, s, a) {
      return this._initCurve(), Jb.curveTo(t, i, n, o, s, a, this.currentPath.points), this;
    }, e.prototype.arcTo = function(t, i, n, o, s) {
      this._initCurve(t, i);
      var a = this.currentPath.points, h = au.curveTo(t, i, n, o, s, a);
      if (h) {
        var u = h.cx, l = h.cy, c = h.radius, d = h.startAngle, f = h.endAngle, p = h.anticlockwise;
        this.arc(u, l, c, d, f, p);
      }
      return this;
    }, e.prototype.arc = function(t, i, n, o, s, a) {
      if (a === void 0 && (a = !1), o === s)
        return this;
      !a && s <= o ? s += In : a && o <= s && (o += In);
      var h = s - o;
      if (h === 0)
        return this;
      var u = t + Math.cos(o) * n, l = i + Math.sin(o) * n, c = this._geometry.closePointEps, d = this.currentPath ? this.currentPath.points : null;
      if (d) {
        var f = Math.abs(d[d.length - 2] - u), p = Math.abs(d[d.length - 1] - l);
        f < c && p < c || d.push(u, l);
      } else
        this.moveTo(u, l), d = this.currentPath.points;
      return au.arc(u, l, t, i, n, o, s, a, d), this;
    }, e.prototype.beginFill = function(t, i) {
      return t === void 0 && (t = 0), i === void 0 && (i = 1), this.beginTextureFill({ texture: $.WHITE, color: t, alpha: i });
    }, e.prototype.beginTextureFill = function(t) {
      t = Object.assign({
        texture: $.WHITE,
        color: 16777215,
        alpha: 1,
        matrix: null
      }, t), this.currentPath && this.startPoly();
      var i = t.alpha > 0;
      return i ? (t.matrix && (t.matrix = t.matrix.clone(), t.matrix.invert()), Object.assign(this._fillStyle, { visible: i }, t)) : this._fillStyle.reset(), this;
    }, e.prototype.endFill = function() {
      return this.finishPoly(), this._fillStyle.reset(), this;
    }, e.prototype.drawRect = function(t, i, n, o) {
      return this.drawShape(new nt(t, i, n, o));
    }, e.prototype.drawRoundedRect = function(t, i, n, o, s) {
      return this.drawShape(new uv(t, i, n, o, s));
    }, e.prototype.drawCircle = function(t, i, n) {
      return this.drawShape(new av(t, i, n));
    }, e.prototype.drawEllipse = function(t, i, n, o) {
      return this.drawShape(new hv(t, i, n, o));
    }, e.prototype.drawPolygon = function() {
      for (var t = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = t[n];
      var o, s = !0, a = i[0];
      a.points ? (s = a.closeStroke, o = a.points) : Array.isArray(i[0]) ? o = i[0] : o = i;
      var h = new mn(o);
      return h.closeStroke = s, this.drawShape(h), this;
    }, e.prototype.drawShape = function(t) {
      return this._holeMode ? this._geometry.drawHole(t, this._matrix) : this._geometry.drawShape(t, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix), this;
    }, e.prototype.clear = function() {
      return this._geometry.clear(), this._lineStyle.reset(), this._fillStyle.reset(), this._boundsID++, this._matrix = null, this._holeMode = !1, this.currentPath = null, this;
    }, e.prototype.isFastRect = function() {
      var t = this._geometry.graphicsData;
      return t.length === 1 && t[0].shape.type === Dt.RECT && !t[0].matrix && !t[0].holes.length && !(t[0].lineStyle.visible && t[0].lineStyle.width);
    }, e.prototype._render = function(t) {
      this.finishPoly();
      var i = this._geometry;
      i.updateBatches(), i.batchable ? (this.batchDirty !== i.batchDirty && this._populateBatches(), this._renderBatched(t)) : (t.batch.flush(), this._renderDirect(t));
    }, e.prototype._populateBatches = function() {
      var t = this._geometry, i = this.blendMode, n = t.batches.length;
      this.batchTint = -1, this._transformID = -1, this.batchDirty = t.batchDirty, this.batches.length = n, this.vertexData = new Float32Array(t.points);
      for (var o = 0; o < n; o++) {
        var s = t.batches[o], a = s.style.color, h = new Float32Array(this.vertexData.buffer, s.attribStart * 4 * 2, s.attribSize * 2), u = new Float32Array(t.uvsFloat32.buffer, s.attribStart * 4 * 2, s.attribSize * 2), l = new Uint16Array(t.indicesUint16.buffer, s.start * 2, s.size), c = {
          vertexData: h,
          blendMode: i,
          indices: l,
          uvs: u,
          _batchRGB: kr(a),
          _tintRGB: a,
          _texture: s.style.texture,
          alpha: s.style.alpha,
          worldAlpha: 1
        };
        this.batches[o] = c;
      }
    }, e.prototype._renderBatched = function(t) {
      if (this.batches.length) {
        t.batch.setObjectRenderer(t.plugins[this.pluginName]), this.calculateVertices(), this.calculateTints();
        for (var i = 0, n = this.batches.length; i < n; i++) {
          var o = this.batches[i];
          o.worldAlpha = this.worldAlpha * o.alpha, t.plugins[this.pluginName].render(o);
        }
      }
    }, e.prototype._renderDirect = function(t) {
      var i = this._resolveDirectShader(t), n = this._geometry, o = this.tint, s = this.worldAlpha, a = i.uniforms, h = n.drawCalls;
      a.translationMatrix = this.transform.worldTransform, a.tint[0] = (o >> 16 & 255) / 255 * s, a.tint[1] = (o >> 8 & 255) / 255 * s, a.tint[2] = (o & 255) / 255 * s, a.tint[3] = s, t.shader.bind(i), t.geometry.bind(n, i), t.state.set(this.state);
      for (var u = 0, l = h.length; u < l; u++)
        this._renderDrawCallDirect(t, n.drawCalls[u]);
    }, e.prototype._renderDrawCallDirect = function(t, i) {
      for (var n = i.texArray, o = i.type, s = i.size, a = i.start, h = n.count, u = 0; u < h; u++)
        t.texture.bind(n.elements[u], u);
      t.geometry.draw(o, s, a);
    }, e.prototype._resolveDirectShader = function(t) {
      var i = this.shader, n = this.pluginName;
      if (!i) {
        if (!Co[n]) {
          for (var o = t.plugins[n].MAX_TEXTURES, s = new Int32Array(o), a = 0; a < o; a++)
            s[a] = a;
          var h = {
            tint: new Float32Array([1, 1, 1, 1]),
            translationMatrix: new Pt(),
            default: ir.from({ uSamplers: s }, !0)
          }, u = t.plugins[n]._shader.program;
          Co[n] = new Ce(u, h);
        }
        i = Co[n];
      }
      return i;
    }, e.prototype._calculateBounds = function() {
      this.finishPoly();
      var t = this._geometry;
      if (t.graphicsData.length) {
        var i = t.bounds, n = i.minX, o = i.minY, s = i.maxX, a = i.maxY;
        this._bounds.addFrame(this.transform, n, o, s, a);
      }
    }, e.prototype.containsPoint = function(t) {
      return this.worldTransform.applyInverse(t, e._TEMP_POINT), this._geometry.containsPoint(e._TEMP_POINT);
    }, e.prototype.calculateTints = function() {
      if (this.batchTint !== this.tint) {
        this.batchTint = this.tint;
        for (var t = kr(this.tint, i1), i = 0; i < this.batches.length; i++) {
          var n = this.batches[i], o = n._batchRGB, s = t[0] * o[0] * 255, a = t[1] * o[1] * 255, h = t[2] * o[2] * 255, u = (s << 16) + (a << 8) + (h | 0);
          n._tintRGB = (u >> 16) + (u & 65280) + ((u & 255) << 16);
        }
      }
    }, e.prototype.calculateVertices = function() {
      var t = this.transform._worldID;
      if (this._transformID !== t) {
        this._transformID = t;
        for (var i = this.transform.worldTransform, n = i.a, o = i.b, s = i.c, a = i.d, h = i.tx, u = i.ty, l = this._geometry.points, c = this.vertexData, d = 0, f = 0; f < l.length; f += 2) {
          var p = l[f], m = l[f + 1];
          c[d++] = n * p + s * m + h, c[d++] = a * m + o * p + u;
        }
      }
    }, e.prototype.closePath = function() {
      var t = this.currentPath;
      return t && (t.closeStroke = !0, this.finishPoly()), this;
    }, e.prototype.setMatrix = function(t) {
      return this._matrix = t, this;
    }, e.prototype.beginHole = function() {
      return this.finishPoly(), this._holeMode = !0, this;
    }, e.prototype.endHole = function() {
      return this.finishPoly(), this._holeMode = !1, this;
    }, e.prototype.destroy = function(t) {
      this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose(), this._matrix = null, this.currentPath = null, this._lineStyle.destroy(), this._lineStyle = null, this._fillStyle.destroy(), this._fillStyle = null, this._geometry = null, this.shader = null, this.vertexData = null, this.batches.length = 0, this.batches = null, r.prototype.destroy.call(this, t);
    }, e.nextRoundedRectBehavior = !1, e._TEMP_POINT = new yt(), e;
  }(le)
);
/*!
 * @pixi/sprite - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/sprite is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ss = function(r, e) {
  return Ss = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ss(r, e);
};
function n1(r, e) {
  Ss(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Jr = new yt(), o1 = new Uint16Array([0, 1, 2, 0, 2, 3]), Mi = (
  /** @class */
  function(r) {
    n1(e, r);
    function e(t) {
      var i = r.call(this) || this;
      return i._anchor = new Pr(i._onAnchorUpdate, i, t ? t.defaultAnchor.x : 0, t ? t.defaultAnchor.y : 0), i._texture = null, i._width = 0, i._height = 0, i._tint = null, i._tintRGB = null, i.tint = 16777215, i.blendMode = X.NORMAL, i._cachedTint = 16777215, i.uvs = null, i.texture = t || $.EMPTY, i.vertexData = new Float32Array(8), i.vertexTrimmedData = null, i._transformID = -1, i._textureID = -1, i._transformTrimmedID = -1, i._textureTrimmedID = -1, i.indices = o1, i.pluginName = "batch", i.isSprite = !0, i._roundPixels = G.ROUND_PIXELS, i;
    }
    return e.prototype._onTextureUpdate = function() {
      this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this._width && (this.scale.x = Rr(this.scale.x) * this._width / this._texture.orig.width), this._height && (this.scale.y = Rr(this.scale.y) * this._height / this._texture.orig.height);
    }, e.prototype._onAnchorUpdate = function() {
      this._transformID = -1, this._transformTrimmedID = -1;
    }, e.prototype.calculateVertices = function() {
      var t = this._texture;
      if (!(this._transformID === this.transform._worldID && this._textureID === t._updateID)) {
        this._textureID !== t._updateID && (this.uvs = this._texture._uvs.uvsFloat32), this._transformID = this.transform._worldID, this._textureID = t._updateID;
        var i = this.transform.worldTransform, n = i.a, o = i.b, s = i.c, a = i.d, h = i.tx, u = i.ty, l = this.vertexData, c = t.trim, d = t.orig, f = this._anchor, p = 0, m = 0, y = 0, _ = 0;
        if (c ? (m = c.x - f._x * d.width, p = m + c.width, _ = c.y - f._y * d.height, y = _ + c.height) : (m = -f._x * d.width, p = m + d.width, _ = -f._y * d.height, y = _ + d.height), l[0] = n * m + s * _ + h, l[1] = a * _ + o * m + u, l[2] = n * p + s * _ + h, l[3] = a * _ + o * p + u, l[4] = n * p + s * y + h, l[5] = a * y + o * p + u, l[6] = n * m + s * y + h, l[7] = a * y + o * m + u, this._roundPixels)
          for (var g = G.RESOLUTION, v = 0; v < l.length; ++v)
            l[v] = Math.round((l[v] * g | 0) / g);
      }
    }, e.prototype.calculateTrimmedVertices = function() {
      if (!this.vertexTrimmedData)
        this.vertexTrimmedData = new Float32Array(8);
      else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID)
        return;
      this._transformTrimmedID = this.transform._worldID, this._textureTrimmedID = this._texture._updateID;
      var t = this._texture, i = this.vertexTrimmedData, n = t.orig, o = this._anchor, s = this.transform.worldTransform, a = s.a, h = s.b, u = s.c, l = s.d, c = s.tx, d = s.ty, f = -o._x * n.width, p = f + n.width, m = -o._y * n.height, y = m + n.height;
      i[0] = a * f + u * m + c, i[1] = l * m + h * f + d, i[2] = a * p + u * m + c, i[3] = l * m + h * p + d, i[4] = a * p + u * y + c, i[5] = l * y + h * p + d, i[6] = a * f + u * y + c, i[7] = l * y + h * f + d;
    }, e.prototype._render = function(t) {
      this.calculateVertices(), t.batch.setObjectRenderer(t.plugins[this.pluginName]), t.plugins[this.pluginName].render(this);
    }, e.prototype._calculateBounds = function() {
      var t = this._texture.trim, i = this._texture.orig;
      !t || t.width === i.width && t.height === i.height ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(), this._bounds.addQuad(this.vertexTrimmedData));
    }, e.prototype.getLocalBounds = function(t) {
      return this.children.length === 0 ? (this._localBounds || (this._localBounds = new Dn()), this._localBounds.minX = this._texture.orig.width * -this._anchor._x, this._localBounds.minY = this._texture.orig.height * -this._anchor._y, this._localBounds.maxX = this._texture.orig.width * (1 - this._anchor._x), this._localBounds.maxY = this._texture.orig.height * (1 - this._anchor._y), t || (this._localBoundsRect || (this._localBoundsRect = new nt()), t = this._localBoundsRect), this._localBounds.getRectangle(t)) : r.prototype.getLocalBounds.call(this, t);
    }, e.prototype.containsPoint = function(t) {
      this.worldTransform.applyInverse(t, Jr);
      var i = this._texture.orig.width, n = this._texture.orig.height, o = -i * this.anchor.x, s = 0;
      return Jr.x >= o && Jr.x < o + i && (s = -n * this.anchor.y, Jr.y >= s && Jr.y < s + n);
    }, e.prototype.destroy = function(t) {
      r.prototype.destroy.call(this, t), this._texture.off("update", this._onTextureUpdate, this), this._anchor = null;
      var i = typeof t == "boolean" ? t : t && t.texture;
      if (i) {
        var n = typeof t == "boolean" ? t : t && t.baseTexture;
        this._texture.destroy(!!n);
      }
      this._texture = null;
    }, e.from = function(t, i) {
      var n = t instanceof $ ? t : $.from(t, i);
      return new e(n);
    }, Object.defineProperty(e.prototype, "roundPixels", {
      get: function() {
        return this._roundPixels;
      },
      /**
       * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
       *
       * Advantages can include sharper image quality (like text) and faster rendering on canvas.
       * The main disadvantage is movement of objects may appear less smooth.
       *
       * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}.
       * @default false
       */
      set: function(t) {
        this._roundPixels !== t && (this._transformID = -1), this._roundPixels = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "width", {
      /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return Math.abs(this.scale.x) * this._texture.orig.width;
      },
      set: function(t) {
        var i = Rr(this.scale.x) || 1;
        this.scale.x = i * t / this._texture.orig.width, this._width = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return Math.abs(this.scale.y) * this._texture.orig.height;
      },
      set: function(t) {
        var i = Rr(this.scale.y) || 1;
        this.scale.y = i * t / this._texture.orig.height, this._height = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "anchor", {
      /**
       * The anchor sets the origin point of the sprite. The default value is taken from the {@link PIXI.Texture|Texture}
       * and passed to the constructor.
       *
       * The default is `(0,0)`, this means the sprite's origin is the top left.
       *
       * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
       *
       * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
       *
       * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
       * @example
       * const sprite = new PIXI.Sprite(texture);
       * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
       */
      get: function() {
        return this._anchor;
      },
      set: function(t) {
        this._anchor.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "tint", {
      /**
       * The tint applied to the sprite. This is a hex value.
       *
       * A value of 0xFFFFFF will remove any tint effect.
       * @default 0xFFFFFF
       */
      get: function() {
        return this._tint;
      },
      set: function(t) {
        this._tint = t, this._tintRGB = (t >> 16) + (t & 65280) + ((t & 255) << 16);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "texture", {
      /** The texture that the sprite is using. */
      get: function() {
        return this._texture;
      },
      set: function(t) {
        this._texture !== t && (this._texture && this._texture.off("update", this._onTextureUpdate, this), this._texture = t || $.EMPTY, this._cachedTint = 16777215, this._textureID = -1, this._textureTrimmedID = -1, t && (t.baseTexture.valid ? this._onTextureUpdate() : t.once("update", this._onTextureUpdate, this)));
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(le)
);
/*!
 * @pixi/text - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/text is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ws = function(r, e) {
  return ws = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, ws(r, e);
};
function s1(r, e) {
  ws(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var gi;
(function(r) {
  r[r.LINEAR_VERTICAL = 0] = "LINEAR_VERTICAL", r[r.LINEAR_HORIZONTAL = 1] = "LINEAR_HORIZONTAL";
})(gi || (gi = {}));
var No = {
  align: "left",
  breakWords: !1,
  dropShadow: !1,
  dropShadowAlpha: 1,
  dropShadowAngle: Math.PI / 6,
  dropShadowBlur: 0,
  dropShadowColor: "black",
  dropShadowDistance: 5,
  fill: "black",
  fillGradientType: gi.LINEAR_VERTICAL,
  fillGradientStops: [],
  fontFamily: "Arial",
  fontSize: 26,
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "normal",
  letterSpacing: 0,
  lineHeight: 0,
  lineJoin: "miter",
  miterLimit: 10,
  padding: 0,
  stroke: "black",
  strokeThickness: 0,
  textBaseline: "alphabetic",
  trim: !1,
  whiteSpace: "pre",
  wordWrap: !1,
  wordWrapWidth: 100,
  leading: 0
}, a1 = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
], Xr = (
  /** @class */
  function() {
    function r(e) {
      this.styleID = 0, this.reset(), Lo(this, e, e);
    }
    return r.prototype.clone = function() {
      var e = {};
      return Lo(e, this, No), new r(e);
    }, r.prototype.reset = function() {
      Lo(this, No, No);
    }, Object.defineProperty(r.prototype, "align", {
      /**
       * Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
       *
       * @member {string}
       */
      get: function() {
        return this._align;
      },
      set: function(e) {
        this._align !== e && (this._align = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "breakWords", {
      /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
      get: function() {
        return this._breakWords;
      },
      set: function(e) {
        this._breakWords !== e && (this._breakWords = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadow", {
      /** Set a drop shadow for the text. */
      get: function() {
        return this._dropShadow;
      },
      set: function(e) {
        this._dropShadow !== e && (this._dropShadow = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowAlpha", {
      /** Set alpha for the drop shadow. */
      get: function() {
        return this._dropShadowAlpha;
      },
      set: function(e) {
        this._dropShadowAlpha !== e && (this._dropShadowAlpha = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowAngle", {
      /** Set a angle of the drop shadow. */
      get: function() {
        return this._dropShadowAngle;
      },
      set: function(e) {
        this._dropShadowAngle !== e && (this._dropShadowAngle = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowBlur", {
      /** Set a shadow blur radius. */
      get: function() {
        return this._dropShadowBlur;
      },
      set: function(e) {
        this._dropShadowBlur !== e && (this._dropShadowBlur = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowColor", {
      /** A fill style to be used on the dropshadow e.g 'red', '#00FF00'. */
      get: function() {
        return this._dropShadowColor;
      },
      set: function(e) {
        var t = Fo(e);
        this._dropShadowColor !== t && (this._dropShadowColor = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowDistance", {
      /** Set a distance of the drop shadow. */
      get: function() {
        return this._dropShadowDistance;
      },
      set: function(e) {
        this._dropShadowDistance !== e && (this._dropShadowDistance = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fill", {
      /**
       * A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'.
       *
       * Can be an array to create a gradient eg ['#000000','#FFFFFF']
       * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
       *
       * @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
       */
      get: function() {
        return this._fill;
      },
      set: function(e) {
        var t = Fo(e);
        this._fill !== t && (this._fill = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fillGradientType", {
      /**
       * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
       *
       * @see PIXI.TEXT_GRADIENT
       */
      get: function() {
        return this._fillGradientType;
      },
      set: function(e) {
        this._fillGradientType !== e && (this._fillGradientType = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fillGradientStops", {
      /**
       * If fill is an array of colours to create a gradient, this array can set the stop points
       * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
       */
      get: function() {
        return this._fillGradientStops;
      },
      set: function(e) {
        h1(this._fillGradientStops, e) || (this._fillGradientStops = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontFamily", {
      /** The font family. */
      get: function() {
        return this._fontFamily;
      },
      set: function(e) {
        this.fontFamily !== e && (this._fontFamily = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontSize", {
      /**
       * The font size
       * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
       */
      get: function() {
        return this._fontSize;
      },
      set: function(e) {
        this._fontSize !== e && (this._fontSize = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontStyle", {
      /**
       * The font style
       * ('normal', 'italic' or 'oblique')
       *
       * @member {string}
       */
      get: function() {
        return this._fontStyle;
      },
      set: function(e) {
        this._fontStyle !== e && (this._fontStyle = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontVariant", {
      /**
       * The font variant
       * ('normal' or 'small-caps')
       *
       * @member {string}
       */
      get: function() {
        return this._fontVariant;
      },
      set: function(e) {
        this._fontVariant !== e && (this._fontVariant = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontWeight", {
      /**
       * The font weight
       * ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
       *
       * @member {string}
       */
      get: function() {
        return this._fontWeight;
      },
      set: function(e) {
        this._fontWeight !== e && (this._fontWeight = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "letterSpacing", {
      /** The amount of spacing between letters, default is 0. */
      get: function() {
        return this._letterSpacing;
      },
      set: function(e) {
        this._letterSpacing !== e && (this._letterSpacing = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "lineHeight", {
      /** The line height, a number that represents the vertical space that a letter uses. */
      get: function() {
        return this._lineHeight;
      },
      set: function(e) {
        this._lineHeight !== e && (this._lineHeight = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "leading", {
      /** The space between lines. */
      get: function() {
        return this._leading;
      },
      set: function(e) {
        this._leading !== e && (this._leading = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "lineJoin", {
      /**
       * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
       * Default is 'miter' (creates a sharp corner).
       *
       * @member {string}
       */
      get: function() {
        return this._lineJoin;
      },
      set: function(e) {
        this._lineJoin !== e && (this._lineJoin = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "miterLimit", {
      /**
       * The miter limit to use when using the 'miter' lineJoin mode.
       *
       * This can reduce or increase the spikiness of rendered text.
       */
      get: function() {
        return this._miterLimit;
      },
      set: function(e) {
        this._miterLimit !== e && (this._miterLimit = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "padding", {
      /**
       * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
       * by adding padding to all sides of the text.
       */
      get: function() {
        return this._padding;
      },
      set: function(e) {
        this._padding !== e && (this._padding = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "stroke", {
      /**
       * A canvas fillstyle that will be used on the text stroke
       * e.g 'blue', '#FCFF00'
       */
      get: function() {
        return this._stroke;
      },
      set: function(e) {
        var t = Fo(e);
        this._stroke !== t && (this._stroke = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "strokeThickness", {
      /**
       * A number that represents the thickness of the stroke.
       *
       * @default 0
       */
      get: function() {
        return this._strokeThickness;
      },
      set: function(e) {
        this._strokeThickness !== e && (this._strokeThickness = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "textBaseline", {
      /**
       * The baseline of the text that is rendered.
       *
       * @member {string}
       */
      get: function() {
        return this._textBaseline;
      },
      set: function(e) {
        this._textBaseline !== e && (this._textBaseline = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "trim", {
      /** Trim transparent borders. */
      get: function() {
        return this._trim;
      },
      set: function(e) {
        this._trim !== e && (this._trim = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "whiteSpace", {
      /**
       * How newlines and spaces should be handled.
       * Default is 'pre' (preserve, preserve).
       *
       *  value       | New lines     |   Spaces
       *  ---         | ---           |   ---
       * 'normal'     | Collapse      |   Collapse
       * 'pre'        | Preserve      |   Preserve
       * 'pre-line'   | Preserve      |   Collapse
       *
       * @member {string}
       */
      get: function() {
        return this._whiteSpace;
      },
      set: function(e) {
        this._whiteSpace !== e && (this._whiteSpace = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "wordWrap", {
      /** Indicates if word wrap should be used. */
      get: function() {
        return this._wordWrap;
      },
      set: function(e) {
        this._wordWrap !== e && (this._wordWrap = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "wordWrapWidth", {
      /** The width at which text will wrap, it needs wordWrap to be set to true. */
      get: function() {
        return this._wordWrapWidth;
      },
      set: function(e) {
        this._wordWrapWidth !== e && (this._wordWrapWidth = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.toFontString = function() {
      var e = typeof this.fontSize == "number" ? this.fontSize + "px" : this.fontSize, t = this.fontFamily;
      Array.isArray(this.fontFamily) || (t = this.fontFamily.split(","));
      for (var i = t.length - 1; i >= 0; i--) {
        var n = t[i].trim();
        !/([\"\'])[^\'\"]+\1/.test(n) && a1.indexOf(n) < 0 && (n = '"' + n + '"'), t[i] = n;
      }
      return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + e + " " + t.join(",");
    }, r;
  }()
);
function lu(r) {
  return typeof r == "number" ? xl(r) : (typeof r == "string" && r.indexOf("0x") === 0 && (r = r.replace("0x", "#")), r);
}
function Fo(r) {
  if (Array.isArray(r)) {
    for (var e = 0; e < r.length; ++e)
      r[e] = lu(r[e]);
    return r;
  } else
    return lu(r);
}
function h1(r, e) {
  if (!Array.isArray(r) || !Array.isArray(e) || r.length !== e.length)
    return !1;
  for (var t = 0; t < r.length; ++t)
    if (r[t] !== e[t])
      return !1;
  return !0;
}
function Lo(r, e, t) {
  for (var i in t)
    Array.isArray(e[i]) ? r[i] = e[i].slice() : r[i] = e[i];
}
var sn = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, ce = (
  /** @class */
  function() {
    function r(e, t, i, n, o, s, a, h, u) {
      this.text = e, this.style = t, this.width = i, this.height = n, this.lines = o, this.lineWidths = s, this.lineHeight = a, this.maxLineWidth = h, this.fontProperties = u;
    }
    return r.measureText = function(e, t, i, n) {
      n === void 0 && (n = r._canvas), i = i ?? t.wordWrap;
      var o = t.toFontString(), s = r.measureFont(o);
      s.fontSize === 0 && (s.fontSize = t.fontSize, s.ascent = t.fontSize);
      var a = n.getContext("2d", sn);
      a.font = o;
      for (var h = i ? r.wordWrap(e, t, n) : e, u = h.split(/(?:\r\n|\r|\n)/), l = new Array(u.length), c = 0, d = 0; d < u.length; d++) {
        var f = a.measureText(u[d]).width + (u[d].length - 1) * t.letterSpacing;
        l[d] = f, c = Math.max(c, f);
      }
      var p = c + t.strokeThickness;
      t.dropShadow && (p += t.dropShadowDistance);
      var m = t.lineHeight || s.fontSize + t.strokeThickness, y = Math.max(m, s.fontSize + t.strokeThickness) + (u.length - 1) * (m + t.leading);
      return t.dropShadow && (y += t.dropShadowDistance), new r(e, t, p, y, u, l, m + t.leading, c, s);
    }, r.wordWrap = function(e, t, i) {
      i === void 0 && (i = r._canvas);
      for (var n = i.getContext("2d", sn), o = 0, s = "", a = "", h = /* @__PURE__ */ Object.create(null), u = t.letterSpacing, l = t.whiteSpace, c = r.collapseSpaces(l), d = r.collapseNewlines(l), f = !c, p = t.wordWrapWidth + u, m = r.tokenize(e), y = 0; y < m.length; y++) {
        var _ = m[y];
        if (r.isNewline(_)) {
          if (!d) {
            a += r.addLine(s), f = !c, s = "", o = 0;
            continue;
          }
          _ = " ";
        }
        if (c) {
          var g = r.isBreakingSpace(_), v = r.isBreakingSpace(s[s.length - 1]);
          if (g && v)
            continue;
        }
        var b = r.getFromCache(_, u, h, n);
        if (b > p)
          if (s !== "" && (a += r.addLine(s), s = "", o = 0), r.canBreakWords(_, t.breakWords))
            for (var T = r.wordWrapSplit(_), S = 0; S < T.length; S++) {
              for (var w = T[S], A = 1; T[S + A]; ) {
                var x = T[S + A], E = w[w.length - 1];
                if (!r.canBreakChars(E, x, _, S, t.breakWords))
                  w += x;
                else
                  break;
                A++;
              }
              S += w.length - 1;
              var O = r.getFromCache(w, u, h, n);
              O + o > p && (a += r.addLine(s), f = !1, s = "", o = 0), s += w, o += O;
            }
          else {
            s.length > 0 && (a += r.addLine(s), s = "", o = 0);
            var P = y === m.length - 1;
            a += r.addLine(_, !P), f = !1, s = "", o = 0;
          }
        else
          b + o > p && (f = !1, a += r.addLine(s), s = "", o = 0), (s.length > 0 || !r.isBreakingSpace(_) || f) && (s += _, o += b);
      }
      return a += r.addLine(s, !1), a;
    }, r.addLine = function(e, t) {
      return t === void 0 && (t = !0), e = r.trimRight(e), e = t ? e + `
` : e, e;
    }, r.getFromCache = function(e, t, i, n) {
      var o = i[e];
      if (typeof o != "number") {
        var s = e.length * t;
        o = n.measureText(e).width + s, i[e] = o;
      }
      return o;
    }, r.collapseSpaces = function(e) {
      return e === "normal" || e === "pre-line";
    }, r.collapseNewlines = function(e) {
      return e === "normal";
    }, r.trimRight = function(e) {
      if (typeof e != "string")
        return "";
      for (var t = e.length - 1; t >= 0; t--) {
        var i = e[t];
        if (!r.isBreakingSpace(i))
          break;
        e = e.slice(0, -1);
      }
      return e;
    }, r.isNewline = function(e) {
      return typeof e != "string" ? !1 : r._newlines.indexOf(e.charCodeAt(0)) >= 0;
    }, r.isBreakingSpace = function(e, t) {
      return typeof e != "string" ? !1 : r._breakingSpaces.indexOf(e.charCodeAt(0)) >= 0;
    }, r.tokenize = function(e) {
      var t = [], i = "";
      if (typeof e != "string")
        return t;
      for (var n = 0; n < e.length; n++) {
        var o = e[n], s = e[n + 1];
        if (r.isBreakingSpace(o, s) || r.isNewline(o)) {
          i !== "" && (t.push(i), i = ""), t.push(o);
          continue;
        }
        i += o;
      }
      return i !== "" && t.push(i), t;
    }, r.canBreakWords = function(e, t) {
      return t;
    }, r.canBreakChars = function(e, t, i, n, o) {
      return !0;
    }, r.wordWrapSplit = function(e) {
      return e.split("");
    }, r.measureFont = function(e) {
      if (r._fonts[e])
        return r._fonts[e];
      var t = {
        ascent: 0,
        descent: 0,
        fontSize: 0
      }, i = r._canvas, n = r._context;
      n.font = e;
      var o = r.METRICS_STRING + r.BASELINE_SYMBOL, s = Math.ceil(n.measureText(o).width), a = Math.ceil(n.measureText(r.BASELINE_SYMBOL).width), h = Math.ceil(r.HEIGHT_MULTIPLIER * a);
      a = a * r.BASELINE_MULTIPLIER | 0, i.width = s, i.height = h, n.fillStyle = "#f00", n.fillRect(0, 0, s, h), n.font = e, n.textBaseline = "alphabetic", n.fillStyle = "#000", n.fillText(o, 0, a);
      var u = n.getImageData(0, 0, s, h).data, l = u.length, c = s * 4, d = 0, f = 0, p = !1;
      for (d = 0; d < a; ++d) {
        for (var m = 0; m < c; m += 4)
          if (u[f + m] !== 255) {
            p = !0;
            break;
          }
        if (!p)
          f += c;
        else
          break;
      }
      for (t.ascent = a - d, f = l - c, p = !1, d = h; d > a; --d) {
        for (var m = 0; m < c; m += 4)
          if (u[f + m] !== 255) {
            p = !0;
            break;
          }
        if (!p)
          f -= c;
        else
          break;
      }
      return t.descent = d - a, t.fontSize = t.ascent + t.descent, r._fonts[e] = t, t;
    }, r.clearMetrics = function(e) {
      e === void 0 && (e = ""), e ? delete r._fonts[e] : r._fonts = {};
    }, Object.defineProperty(r, "_canvas", {
      /**
       * Cached canvas element for measuring text
       * TODO: this should be private, but isn't because of backward compat, will fix later.
       * @ignore
       */
      get: function() {
        if (!r.__canvas) {
          var e = void 0;
          try {
            var t = new OffscreenCanvas(0, 0), i = t.getContext("2d", sn);
            if (i && i.measureText)
              return r.__canvas = t, t;
            e = G.ADAPTER.createCanvas();
          } catch {
            e = G.ADAPTER.createCanvas();
          }
          e.width = e.height = 10, r.__canvas = e;
        }
        return r.__canvas;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "_context", {
      /**
       * TODO: this should be private, but isn't because of backward compat, will fix later.
       * @ignore
       */
      get: function() {
        return r.__context || (r.__context = r._canvas.getContext("2d", sn)), r.__context;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
ce._fonts = {};
ce.METRICS_STRING = "|ÉqÅ";
ce.BASELINE_SYMBOL = "M";
ce.BASELINE_MULTIPLIER = 1.4;
ce.HEIGHT_MULTIPLIER = 2;
ce._newlines = [
  10,
  13
];
ce._breakingSpaces = [
  9,
  32,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8200,
  8201,
  8202,
  8287,
  12288
];
var u1 = {
  texture: !0,
  children: !1,
  baseTexture: !0
}, Jl = (
  /** @class */
  function(r) {
    s1(e, r);
    function e(t, i, n) {
      var o = this, s = !1;
      n || (n = G.ADAPTER.createCanvas(), s = !0), n.width = 3, n.height = 3;
      var a = $.from(n);
      return a.orig = new nt(), a.trim = new nt(), o = r.call(this, a) || this, o._ownCanvas = s, o.canvas = n, o.context = n.getContext("2d", {
        // required for trimming to work without warnings
        willReadFrequently: !0
      }), o._resolution = G.RESOLUTION, o._autoResolution = !0, o._text = null, o._style = null, o._styleListener = null, o._font = "", o.text = t, o.style = i, o.localStyleID = -1, o;
    }
    return e.prototype.updateText = function(t) {
      var i = this._style;
      if (this.localStyleID !== i.styleID && (this.dirty = !0, this.localStyleID = i.styleID), !(!this.dirty && t)) {
        this._font = this._style.toFontString();
        var n = this.context, o = ce.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas), s = o.width, a = o.height, h = o.lines, u = o.lineHeight, l = o.lineWidths, c = o.maxLineWidth, d = o.fontProperties;
        this.canvas.width = Math.ceil(Math.ceil(Math.max(1, s) + i.padding * 2) * this._resolution), this.canvas.height = Math.ceil(Math.ceil(Math.max(1, a) + i.padding * 2) * this._resolution), n.scale(this._resolution, this._resolution), n.clearRect(0, 0, this.canvas.width, this.canvas.height), n.font = this._font, n.lineWidth = i.strokeThickness, n.textBaseline = i.textBaseline, n.lineJoin = i.lineJoin, n.miterLimit = i.miterLimit;
        for (var f, p, m = i.dropShadow ? 2 : 1, y = 0; y < m; ++y) {
          var _ = i.dropShadow && y === 0, g = _ ? Math.ceil(Math.max(1, a) + i.padding * 2) : 0, v = g * this._resolution;
          if (_) {
            n.fillStyle = "black", n.strokeStyle = "black";
            var b = i.dropShadowColor, T = kr(typeof b == "number" ? b : Rn(b)), S = i.dropShadowBlur * this._resolution, w = i.dropShadowDistance * this._resolution;
            n.shadowColor = "rgba(" + T[0] * 255 + "," + T[1] * 255 + "," + T[2] * 255 + "," + i.dropShadowAlpha + ")", n.shadowBlur = S, n.shadowOffsetX = Math.cos(i.dropShadowAngle) * w, n.shadowOffsetY = Math.sin(i.dropShadowAngle) * w + v;
          } else
            n.fillStyle = this._generateFillStyle(i, h, o), n.strokeStyle = i.stroke, n.shadowColor = "black", n.shadowBlur = 0, n.shadowOffsetX = 0, n.shadowOffsetY = 0;
          var A = (u - d.fontSize) / 2;
          (!e.nextLineHeightBehavior || u - d.fontSize < 0) && (A = 0);
          for (var x = 0; x < h.length; x++)
            f = i.strokeThickness / 2, p = i.strokeThickness / 2 + x * u + d.ascent + A, i.align === "right" ? f += c - l[x] : i.align === "center" && (f += (c - l[x]) / 2), i.stroke && i.strokeThickness && this.drawLetterSpacing(h[x], f + i.padding, p + i.padding - g, !0), i.fill && this.drawLetterSpacing(h[x], f + i.padding, p + i.padding - g);
        }
        this.updateTexture();
      }
    }, e.prototype.drawLetterSpacing = function(t, i, n, o) {
      o === void 0 && (o = !1);
      var s = this._style, a = s.letterSpacing, h = e.experimentalLetterSpacing && ("letterSpacing" in CanvasRenderingContext2D.prototype || "textLetterSpacing" in CanvasRenderingContext2D.prototype);
      if (a === 0 || h) {
        h && (this.context.letterSpacing = a, this.context.textLetterSpacing = a), o ? this.context.strokeText(t, i, n) : this.context.fillText(t, i, n);
        return;
      }
      for (var u = i, l = Array.from ? Array.from(t) : t.split(""), c = this.context.measureText(t).width, d = 0, f = 0; f < l.length; ++f) {
        var p = l[f];
        o ? this.context.strokeText(p, u, n) : this.context.fillText(p, u, n);
        for (var m = "", y = f + 1; y < l.length; ++y)
          m += l[y];
        d = this.context.measureText(m).width, u += c - d + a, c = d;
      }
    }, e.prototype.updateTexture = function() {
      var t = this.canvas;
      if (this._style.trim) {
        var i = iv(t);
        i.data && (t.width = i.width, t.height = i.height, this.context.putImageData(i.data, 0, 0));
      }
      var n = this._texture, o = this._style, s = o.trim ? 0 : o.padding, a = n.baseTexture;
      n.trim.width = n._frame.width = t.width / this._resolution, n.trim.height = n._frame.height = t.height / this._resolution, n.trim.x = -s, n.trim.y = -s, n.orig.width = n._frame.width - s * 2, n.orig.height = n._frame.height - s * 2, this._onTextureUpdate(), a.setRealSize(t.width, t.height, this._resolution), n.updateUvs(), this.dirty = !1;
    }, e.prototype._render = function(t) {
      this._autoResolution && this._resolution !== t.resolution && (this._resolution = t.resolution, this.dirty = !0), this.updateText(!0), r.prototype._render.call(this, t);
    }, e.prototype.updateTransform = function() {
      this.updateText(!0), r.prototype.updateTransform.call(this);
    }, e.prototype.getBounds = function(t, i) {
      return this.updateText(!0), this._textureID === -1 && (t = !1), r.prototype.getBounds.call(this, t, i);
    }, e.prototype.getLocalBounds = function(t) {
      return this.updateText(!0), r.prototype.getLocalBounds.call(this, t);
    }, e.prototype._calculateBounds = function() {
      this.calculateVertices(), this._bounds.addQuad(this.vertexData);
    }, e.prototype._generateFillStyle = function(t, i, n) {
      var o = t.fill;
      if (Array.isArray(o)) {
        if (o.length === 1)
          return o[0];
      } else
        return o;
      var s, a = t.dropShadow ? t.dropShadowDistance : 0, h = t.padding || 0, u = this.canvas.width / this._resolution - a - h * 2, l = this.canvas.height / this._resolution - a - h * 2, c = o.slice(), d = t.fillGradientStops.slice();
      if (!d.length)
        for (var f = c.length + 1, p = 1; p < f; ++p)
          d.push(p / f);
      if (c.unshift(o[0]), d.unshift(0), c.push(o[o.length - 1]), d.push(1), t.fillGradientType === gi.LINEAR_VERTICAL) {
        s = this.context.createLinearGradient(u / 2, h, u / 2, l + h);
        for (var m = n.fontProperties.fontSize + t.strokeThickness, p = 0; p < i.length; p++) {
          var y = n.lineHeight * (p - 1) + m, _ = n.lineHeight * p, g = _;
          p > 0 && y > _ && (g = (_ + y) / 2);
          var v = _ + m, b = n.lineHeight * (p + 1), T = v;
          p + 1 < i.length && b < v && (T = (v + b) / 2);
          for (var S = (T - g) / l, w = 0; w < c.length; w++) {
            var A = 0;
            typeof d[w] == "number" ? A = d[w] : A = w / c.length;
            var x = Math.min(1, Math.max(0, g / l + A * S));
            x = Number(x.toFixed(5)), s.addColorStop(x, c[w]);
          }
        }
      } else {
        s = this.context.createLinearGradient(h, l / 2, u + h, l / 2);
        for (var E = c.length + 1, O = 1, p = 0; p < c.length; p++) {
          var P = void 0;
          typeof d[p] == "number" ? P = d[p] : P = O / E, s.addColorStop(P, c[p]), O++;
        }
      }
      return s;
    }, e.prototype.destroy = function(t) {
      typeof t == "boolean" && (t = { children: t }), t = Object.assign({}, u1, t), r.prototype.destroy.call(this, t), this._ownCanvas && (this.canvas.height = this.canvas.width = 0), this.context = null, this.canvas = null, this._style = null;
    }, Object.defineProperty(e.prototype, "width", {
      /** The width of the Text, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.updateText(!0), Math.abs(this.scale.x) * this._texture.orig.width;
      },
      set: function(t) {
        this.updateText(!0);
        var i = Rr(this.scale.x) || 1;
        this.scale.x = i * t / this._texture.orig.width, this._width = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /** The height of the Text, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height;
      },
      set: function(t) {
        this.updateText(!0);
        var i = Rr(this.scale.y) || 1;
        this.scale.y = i * t / this._texture.orig.height, this._height = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "style", {
      /**
       * Set the style of the text.
       *
       * Set up an event listener to listen for changes on the style object and mark the text as dirty.
       */
      get: function() {
        return this._style;
      },
      set: function(t) {
        t = t || {}, t instanceof Xr ? this._style = t : this._style = new Xr(t), this.localStyleID = -1, this.dirty = !0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "text", {
      /** Set the copy for the text object. To split a line you can use '\n'. */
      get: function() {
        return this._text;
      },
      set: function(t) {
        t = String(t ?? ""), this._text !== t && (this._text = t, this.dirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "resolution", {
      /**
       * The resolution / device pixel ratio of the canvas.
       *
       * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
       * @default 1
       */
      get: function() {
        return this._resolution;
      },
      set: function(t) {
        this._autoResolution = !1, this._resolution !== t && (this._resolution = t, this.dirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), e.nextLineHeightBehavior = !1, e.experimentalLetterSpacing = !1, e;
  }(Mi)
);
/*!
 * @pixi/prepare - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/prepare is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
G.UPLOADS_PER_FRAME = 4;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Os = function(r, e) {
  return Os = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Os(r, e);
};
function l1(r, e) {
  Os(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var c1 = (
  /** @class */
  function() {
    function r(e) {
      this.maxItemsPerFrame = e, this.itemsLeft = 0;
    }
    return r.prototype.beginFrame = function() {
      this.itemsLeft = this.maxItemsPerFrame;
    }, r.prototype.allowedToUpload = function() {
      return this.itemsLeft-- > 0;
    }, r;
  }()
);
function d1(r, e) {
  var t = !1;
  if (r && r._textures && r._textures.length) {
    for (var i = 0; i < r._textures.length; i++)
      if (r._textures[i] instanceof $) {
        var n = r._textures[i].baseTexture;
        e.indexOf(n) === -1 && (e.push(n), t = !0);
      }
  }
  return t;
}
function f1(r, e) {
  if (r.baseTexture instanceof it) {
    var t = r.baseTexture;
    return e.indexOf(t) === -1 && e.push(t), !0;
  }
  return !1;
}
function p1(r, e) {
  if (r._texture && r._texture instanceof $) {
    var t = r._texture.baseTexture;
    return e.indexOf(t) === -1 && e.push(t), !0;
  }
  return !1;
}
function m1(r, e) {
  return e instanceof Jl ? (e.updateText(!0), !0) : !1;
}
function y1(r, e) {
  if (e instanceof Xr) {
    var t = e.toFontString();
    return ce.measureFont(t), !0;
  }
  return !1;
}
function _1(r, e) {
  if (r instanceof Jl) {
    e.indexOf(r.style) === -1 && e.push(r.style), e.indexOf(r) === -1 && e.push(r);
    var t = r._texture.baseTexture;
    return e.indexOf(t) === -1 && e.push(t), !0;
  }
  return !1;
}
function g1(r, e) {
  return r instanceof Xr ? (e.indexOf(r) === -1 && e.push(r), !0) : !1;
}
var v1 = (
  /** @class */
  function() {
    function r(e) {
      var t = this;
      this.limiter = new c1(G.UPLOADS_PER_FRAME), this.renderer = e, this.uploadHookHelper = null, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.delayedTick = function() {
        t.queue && t.prepareItems();
      }, this.registerFindHook(_1), this.registerFindHook(g1), this.registerFindHook(d1), this.registerFindHook(f1), this.registerFindHook(p1), this.registerUploadHook(m1), this.registerUploadHook(y1);
    }
    return r.prototype.upload = function(e, t) {
      var i = this;
      return typeof e == "function" && (t = e, e = null), t && Jt("6.5.0", "BasePrepare.upload callback is deprecated, use the return Promise instead."), new Promise(function(n) {
        e && i.add(e);
        var o = function() {
          t == null || t(), n();
        };
        i.queue.length ? (i.completes.push(o), i.ticking || (i.ticking = !0, Ft.system.addOnce(i.tick, i, be.UTILITY))) : o();
      });
    }, r.prototype.tick = function() {
      setTimeout(this.delayedTick, 0);
    }, r.prototype.prepareItems = function() {
      for (this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload(); ) {
        var e = this.queue[0], t = !1;
        if (e && !e._destroyed) {
          for (var i = 0, n = this.uploadHooks.length; i < n; i++)
            if (this.uploadHooks[i](this.uploadHookHelper, e)) {
              this.queue.shift(), t = !0;
              break;
            }
        }
        t || this.queue.shift();
      }
      if (this.queue.length)
        Ft.system.addOnce(this.tick, this, be.UTILITY);
      else {
        this.ticking = !1;
        var o = this.completes.slice(0);
        this.completes.length = 0;
        for (var i = 0, n = o.length; i < n; i++)
          o[i]();
      }
    }, r.prototype.registerFindHook = function(e) {
      return e && this.addHooks.push(e), this;
    }, r.prototype.registerUploadHook = function(e) {
      return e && this.uploadHooks.push(e), this;
    }, r.prototype.add = function(e) {
      for (var t = 0, i = this.addHooks.length; t < i && !this.addHooks[t](e, this.queue); t++)
        ;
      if (e instanceof le)
        for (var t = e.children.length - 1; t >= 0; t--)
          this.add(e.children[t]);
      return this;
    }, r.prototype.destroy = function() {
      this.ticking && Ft.system.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null, this.limiter = null, this.uploadHookHelper = null;
    }, r;
  }()
);
function Ql(r, e) {
  return e instanceof it ? (e._glTextures[r.CONTEXT_UID] || r.texture.bind(e), !0) : !1;
}
function b1(r, e) {
  if (!(e instanceof hr))
    return !1;
  var t = e.geometry;
  e.finishPoly(), t.updateBatches();
  for (var i = t.batches, n = 0; n < i.length; n++) {
    var o = i[n].style.texture;
    o && Ql(r, o.baseTexture);
  }
  return t.batchable || r.geometry.bind(t, e._resolveDirectShader(r)), !0;
}
function x1(r, e) {
  return r instanceof hr ? (e.push(r), !0) : !1;
}
var T1 = (
  /** @class */
  function(r) {
    l1(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.uploadHookHelper = i.renderer, i.registerFindHook(x1), i.registerUploadHook(Ql), i.registerUploadHook(b1), i;
    }
    return e.extension = {
      name: "prepare",
      type: ft.RendererPlugin
    }, e;
  }(v1)
);
/*!
 * @pixi/spritesheet - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/spritesheet is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var E1 = (
  /** @class */
  function() {
    function r(e, t, i) {
      i === void 0 && (i = null), this.linkedSheets = [], this._texture = e instanceof $ ? e : null, this.baseTexture = e instanceof it ? e : this._texture.baseTexture, this.textures = {}, this.animations = {}, this.data = t;
      var n = this.baseTexture.resource;
      this.resolution = this._updateResolution(i || (n ? n.url : null)), this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
    }
    return r.prototype._updateResolution = function(e) {
      e === void 0 && (e = null);
      var t = this.data.meta.scale, i = Mn(e, null);
      return i === null && (i = t !== void 0 ? parseFloat(t) : 1), i !== 1 && this.baseTexture.setResolution(i), i;
    }, r.prototype.parse = function(e) {
      var t = this;
      return e && Jt("6.5.0", "Spritesheet.parse callback is deprecated, use the return Promise instead."), new Promise(function(i) {
        t._callback = function(n) {
          e == null || e(n), i(n);
        }, t._batchIndex = 0, t._frameKeys.length <= r.BATCH_SIZE ? (t._processFrames(0), t._processAnimations(), t._parseComplete()) : t._nextBatch();
      });
    }, r.prototype._processFrames = function(e) {
      for (var t = e, i = r.BATCH_SIZE; t - e < i && t < this._frameKeys.length; ) {
        var n = this._frameKeys[t], o = this._frames[n], s = o.frame;
        if (s) {
          var a = null, h = null, u = o.trimmed !== !1 && o.sourceSize ? o.sourceSize : o.frame, l = new nt(0, 0, Math.floor(u.w) / this.resolution, Math.floor(u.h) / this.resolution);
          o.rotated ? a = new nt(Math.floor(s.x) / this.resolution, Math.floor(s.y) / this.resolution, Math.floor(s.h) / this.resolution, Math.floor(s.w) / this.resolution) : a = new nt(Math.floor(s.x) / this.resolution, Math.floor(s.y) / this.resolution, Math.floor(s.w) / this.resolution, Math.floor(s.h) / this.resolution), o.trimmed !== !1 && o.spriteSourceSize && (h = new nt(Math.floor(o.spriteSourceSize.x) / this.resolution, Math.floor(o.spriteSourceSize.y) / this.resolution, Math.floor(s.w) / this.resolution, Math.floor(s.h) / this.resolution)), this.textures[n] = new $(this.baseTexture, a, l, h, o.rotated ? 2 : 0, o.anchor), $.addToCache(this.textures[n], n);
        }
        t++;
      }
    }, r.prototype._processAnimations = function() {
      var e = this.data.animations || {};
      for (var t in e) {
        this.animations[t] = [];
        for (var i = 0; i < e[t].length; i++) {
          var n = e[t][i];
          this.animations[t].push(this.textures[n]);
        }
      }
    }, r.prototype._parseComplete = function() {
      var e = this._callback;
      this._callback = null, this._batchIndex = 0, e.call(this, this.textures);
    }, r.prototype._nextBatch = function() {
      var e = this;
      this._processFrames(this._batchIndex * r.BATCH_SIZE), this._batchIndex++, setTimeout(function() {
        e._batchIndex * r.BATCH_SIZE < e._frameKeys.length ? e._nextBatch() : (e._processAnimations(), e._parseComplete());
      }, 0);
    }, r.prototype.destroy = function(e) {
      var t;
      e === void 0 && (e = !1);
      for (var i in this.textures)
        this.textures[i].destroy();
      this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, e && ((t = this._texture) === null || t === void 0 || t.destroy(), this.baseTexture.destroy()), this._texture = null, this.baseTexture = null, this.linkedSheets = [];
    }, r.BATCH_SIZE = 1e3, r;
  }()
), A1 = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(e, t) {
      var i, n, o = this, s = e.name + "_image";
      if (!e.data || e.type !== Et.TYPE.JSON || !e.data.frames || o.resources[s]) {
        t();
        return;
      }
      var a = (n = (i = e.data) === null || i === void 0 ? void 0 : i.meta) === null || n === void 0 ? void 0 : n.related_multi_packs;
      if (Array.isArray(a))
        for (var h = function(p) {
          if (typeof p != "string")
            return "continue";
          var m = p.replace(".json", ""), y = Or.resolve(e.url.replace(o.baseUrl, ""), p);
          if (o.resources[m] || Object.values(o.resources).some(function(g) {
            return Or.format(Or.parse(g.url)) === y;
          }))
            return "continue";
          var _ = {
            crossOrigin: e.crossOrigin,
            loadType: Et.LOAD_TYPE.XHR,
            xhrType: Et.XHR_RESPONSE_TYPE.JSON,
            parentResource: e,
            metadata: e.metadata
          };
          o.add(m, y, _);
        }, u = 0, l = a; u < l.length; u++) {
          var c = l[u];
          h(c);
        }
      var d = {
        crossOrigin: e.crossOrigin,
        metadata: e.metadata.imageMetadata,
        parentResource: e
      }, f = r.getResourcePath(e, o.baseUrl);
      o.add(s, f, d, function(p) {
        if (p.error) {
          t(p.error);
          return;
        }
        var m = new E1(p.texture, e.data, e.url);
        m.parse().then(function() {
          e.spritesheet = m, e.textures = m.textures, t();
        });
      });
    }, r.getResourcePath = function(e, t) {
      return e.isDataUrl ? e.data.meta.image : Or.resolve(e.url.replace(t, ""), e.data.meta.image);
    }, r.extension = ft.Loader, r;
  }()
);
/*!
 * @pixi/sprite-tiling - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/sprite-tiling is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Rs = function(r, e) {
  return Rs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Rs(r, e);
};
function tc(r, e) {
  Rs(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Qr = new yt();
(function(r) {
  tc(e, r);
  function e(t, i, n) {
    i === void 0 && (i = 100), n === void 0 && (n = 100);
    var o = r.call(this, t) || this;
    return o.tileTransform = new Ol(), o._width = i, o._height = n, o.uvMatrix = o.texture.uvMatrix || new ca(t), o.pluginName = "tilingSprite", o.uvRespectAnchor = !1, o;
  }
  return Object.defineProperty(e.prototype, "clampMargin", {
    /**
     * Changes frame clamping in corresponding textureTransform, shortcut
     * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
     * @default 0.5
     * @member {number}
     */
    get: function() {
      return this.uvMatrix.clampMargin;
    },
    set: function(t) {
      this.uvMatrix.clampMargin = t, this.uvMatrix.update(!0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "tileScale", {
    /** The scaling of the image that is being tiled. */
    get: function() {
      return this.tileTransform.scale;
    },
    set: function(t) {
      this.tileTransform.scale.copyFrom(t);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "tilePosition", {
    /** The offset of the image that is being tiled. */
    get: function() {
      return this.tileTransform.position;
    },
    set: function(t) {
      this.tileTransform.position.copyFrom(t);
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._onTextureUpdate = function() {
    this.uvMatrix && (this.uvMatrix.texture = this._texture), this._cachedTint = 16777215;
  }, e.prototype._render = function(t) {
    var i = this._texture;
    !i || !i.valid || (this.tileTransform.updateLocalTransform(), this.uvMatrix.update(), t.batch.setObjectRenderer(t.plugins[this.pluginName]), t.plugins[this.pluginName].render(this));
  }, e.prototype._calculateBounds = function() {
    var t = this._width * -this._anchor._x, i = this._height * -this._anchor._y, n = this._width * (1 - this._anchor._x), o = this._height * (1 - this._anchor._y);
    this._bounds.addFrame(this.transform, t, i, n, o);
  }, e.prototype.getLocalBounds = function(t) {
    return this.children.length === 0 ? (this._bounds.minX = this._width * -this._anchor._x, this._bounds.minY = this._height * -this._anchor._y, this._bounds.maxX = this._width * (1 - this._anchor._x), this._bounds.maxY = this._height * (1 - this._anchor._y), t || (this._localBoundsRect || (this._localBoundsRect = new nt()), t = this._localBoundsRect), this._bounds.getRectangle(t)) : r.prototype.getLocalBounds.call(this, t);
  }, e.prototype.containsPoint = function(t) {
    this.worldTransform.applyInverse(t, Qr);
    var i = this._width, n = this._height, o = -i * this.anchor._x;
    if (Qr.x >= o && Qr.x < o + i) {
      var s = -n * this.anchor._y;
      if (Qr.y >= s && Qr.y < s + n)
        return !0;
    }
    return !1;
  }, e.prototype.destroy = function(t) {
    r.prototype.destroy.call(this, t), this.tileTransform = null, this.uvMatrix = null;
  }, e.from = function(t, i) {
    var n = t instanceof $ ? t : $.from(t, i);
    return new e(n, i.width, i.height);
  }, Object.defineProperty(e.prototype, "width", {
    /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
    get: function() {
      return this._width;
    },
    set: function(t) {
      this._width = t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "height", {
    /** The height of the TilingSprite, setting this will actually modify the scale to achieve the value set. */
    get: function() {
      return this._height;
    },
    set: function(t) {
      this._height = t;
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(Mi);
var S1 = `#version 100
#define SHADER_NAME Tiling-Sprite-Simple-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;

void main(void)
{
    vec4 texSample = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texSample * uColor;
}
`, cu = `#version 100
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`, w1 = `#version 100
#ifdef GL_EXT_shader_texture_lod
    #extension GL_EXT_shader_texture_lod : enable
#endif
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;

void main(void)
{
    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);
    coord = (uMapCoord * vec3(coord, 1.0)).xy;
    vec2 unclamped = coord;
    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

    #ifdef GL_EXT_shader_texture_lod
        vec4 texSample = unclamped == coord
            ? texture2D(uSampler, coord) 
            : texture2DLodEXT(uSampler, coord, 0);
    #else
        vec4 texSample = texture2D(uSampler, coord);
    #endif

    gl_FragColor = texSample * uColor;
}
`, O1 = `#version 300 es
#define SHADER_NAME Tiling-Sprite-300

precision lowp float;

in vec2 aVertexPosition;
in vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

out vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`, R1 = `#version 300 es
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

in vec2 vTextureCoord;

out vec4 fragmentColor;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;

void main(void)
{
    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);
    coord = (uMapCoord * vec3(coord, 1.0)).xy;
    vec2 unclamped = coord;
    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

    vec4 texSample = texture(uSampler, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0

    fragmentColor = texSample * uColor;
}
`, an = new Pt(), P1 = (
  /** @class */
  function(r) {
    tc(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return t.runners.contextChange.add(i), i.quad = new Nl(), i.state = cr.for2d(), i;
    }
    return e.prototype.contextChange = function() {
      var t = this.renderer, i = { globals: t.globalUniforms };
      this.simpleShader = Ce.from(cu, S1, i), this.shader = t.context.webGLVersion > 1 ? Ce.from(O1, R1, i) : Ce.from(cu, w1, i);
    }, e.prototype.render = function(t) {
      var i = this.renderer, n = this.quad, o = n.vertices;
      o[0] = o[6] = t._width * -t.anchor.x, o[1] = o[3] = t._height * -t.anchor.y, o[2] = o[4] = t._width * (1 - t.anchor.x), o[5] = o[7] = t._height * (1 - t.anchor.y);
      var s = t.uvRespectAnchor ? t.anchor.x : 0, a = t.uvRespectAnchor ? t.anchor.y : 0;
      o = n.uvs, o[0] = o[6] = -s, o[1] = o[3] = -a, o[2] = o[4] = 1 - s, o[5] = o[7] = 1 - a, n.invalidate();
      var h = t._texture, u = h.baseTexture, l = u.alphaMode > 0, c = t.tileTransform.localTransform, d = t.uvMatrix, f = u.isPowerOfTwo && h.frame.width === u.width && h.frame.height === u.height;
      f && (u._glTextures[i.CONTEXT_UID] ? f = u.wrapMode !== he.CLAMP : u.wrapMode === he.CLAMP && (u.wrapMode = he.REPEAT));
      var p = f ? this.simpleShader : this.shader, m = h.width, y = h.height, _ = t._width, g = t._height;
      an.set(c.a * m / _, c.b * m / g, c.c * y / _, c.d * y / g, c.tx / _, c.ty / g), an.invert(), f ? an.prepend(d.mapCoord) : (p.uniforms.uMapCoord = d.mapCoord.toArray(!0), p.uniforms.uClampFrame = d.uClampFrame, p.uniforms.uClampOffset = d.uClampOffset), p.uniforms.uTransform = an.toArray(!0), p.uniforms.uColor = Al(t.tint, t.worldAlpha, p.uniforms.uColor, l), p.uniforms.translationMatrix = t.transform.worldTransform.toArray(!0), p.uniforms.uSampler = h, i.shader.bind(p), i.geometry.bind(n), this.state.blendMode = El(t.blendMode, l), i.state.set(this.state), i.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
    }, e.extension = {
      name: "tilingSprite",
      type: ft.RendererPlugin
    }, e;
  }(jn)
);
/*!
 * @pixi/mesh - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mesh is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ps = function(r, e) {
  return Ps = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ps(r, e);
};
function fa(r, e) {
  Ps(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var M1 = (
  /** @class */
  function() {
    function r(e, t) {
      this.uvBuffer = e, this.uvMatrix = t, this.data = null, this._bufferUpdateId = -1, this._textureUpdateId = -1, this._updateID = 0;
    }
    return r.prototype.update = function(e) {
      if (!(!e && this._bufferUpdateId === this.uvBuffer._updateID && this._textureUpdateId === this.uvMatrix._updateID)) {
        this._bufferUpdateId = this.uvBuffer._updateID, this._textureUpdateId = this.uvMatrix._updateID;
        var t = this.uvBuffer.data;
        (!this.data || this.data.length !== t.length) && (this.data = new Float32Array(t.length)), this.uvMatrix.multiplyUvs(t, this.data), this._updateID++;
      }
    }, r;
  }()
), Bo = new yt(), du = new mn(), vi = (
  /** @class */
  function(r) {
    fa(e, r);
    function e(t, i, n, o) {
      o === void 0 && (o = qt.TRIANGLES);
      var s = r.call(this) || this;
      return s.geometry = t, s.shader = i, s.state = n || cr.for2d(), s.drawMode = o, s.start = 0, s.size = 0, s.uvs = null, s.indices = null, s.vertexData = new Float32Array(1), s.vertexDirty = -1, s._transformID = -1, s._roundPixels = G.ROUND_PIXELS, s.batchUvs = null, s;
    }
    return Object.defineProperty(e.prototype, "geometry", {
      /**
       * Includes vertex positions, face indices, normals, colors, UVs, and
       * custom attributes within buffers, reducing the cost of passing all
       * this data to the GPU. Can be shared between multiple Mesh objects.
       */
      get: function() {
        return this._geometry;
      },
      set: function(t) {
        this._geometry !== t && (this._geometry && (this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose()), this._geometry = t, this._geometry && this._geometry.refCount++, this.vertexDirty = -1);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "uvBuffer", {
      /**
       * To change mesh uv's, change its uvBuffer data and increment its _updateID.
       * @readonly
       */
      get: function() {
        return this.geometry.buffers[1];
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "verticesBuffer", {
      /**
       * To change mesh vertices, change its uvBuffer data and increment its _updateID.
       * Incrementing _updateID is optional because most of Mesh objects do it anyway.
       * @readonly
       */
      get: function() {
        return this.geometry.buffers[0];
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "material", {
      get: function() {
        return this.shader;
      },
      /** Alias for {@link PIXI.Mesh#shader}. */
      set: function(t) {
        this.shader = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "blendMode", {
      get: function() {
        return this.state.blendMode;
      },
      /**
       * The blend mode to be applied to the Mesh. Apply a value of
       * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
       * @default PIXI.BLEND_MODES.NORMAL;
       */
      set: function(t) {
        this.state.blendMode = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "roundPixels", {
      get: function() {
        return this._roundPixels;
      },
      /**
       * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
       * Advantages can include sharper image quality (like text) and faster rendering on canvas.
       * The main disadvantage is movement of objects may appear less smooth.
       * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
       * @default false
       */
      set: function(t) {
        this._roundPixels !== t && (this._transformID = -1), this._roundPixels = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "tint", {
      /**
       * The multiply tint applied to the Mesh. This is a hex value. A value of
       * `0xFFFFFF` will remove any tint effect.
       *
       * Null for non-MeshMaterial shaders
       * @default 0xFFFFFF
       */
      get: function() {
        return "tint" in this.shader ? this.shader.tint : null;
      },
      set: function(t) {
        this.shader.tint = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "texture", {
      /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
      get: function() {
        return "texture" in this.shader ? this.shader.texture : null;
      },
      set: function(t) {
        this.shader.texture = t;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype._render = function(t) {
      var i = this.geometry.buffers[0].data, n = this.shader;
      n.batchable && this.drawMode === qt.TRIANGLES && i.length < e.BATCHABLE_SIZE * 2 ? this._renderToBatch(t) : this._renderDefault(t);
    }, e.prototype._renderDefault = function(t) {
      var i = this.shader;
      i.alpha = this.worldAlpha, i.update && i.update(), t.batch.flush(), i.uniforms.translationMatrix = this.transform.worldTransform.toArray(!0), t.shader.bind(i), t.state.set(this.state), t.geometry.bind(this.geometry, i), t.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
    }, e.prototype._renderToBatch = function(t) {
      var i = this.geometry, n = this.shader;
      n.uvMatrix && (n.uvMatrix.update(), this.calculateUvs()), this.calculateVertices(), this.indices = i.indexBuffer.data, this._tintRGB = n._tintRGB, this._texture = n.texture;
      var o = this.material.pluginName;
      t.batch.setObjectRenderer(t.plugins[o]), t.plugins[o].render(this);
    }, e.prototype.calculateVertices = function() {
      var t = this.geometry, i = t.buffers[0], n = i.data, o = i._updateID;
      if (!(o === this.vertexDirty && this._transformID === this.transform._worldID)) {
        this._transformID = this.transform._worldID, this.vertexData.length !== n.length && (this.vertexData = new Float32Array(n.length));
        for (var s = this.transform.worldTransform, a = s.a, h = s.b, u = s.c, l = s.d, c = s.tx, d = s.ty, f = this.vertexData, p = 0; p < f.length / 2; p++) {
          var m = n[p * 2], y = n[p * 2 + 1];
          f[p * 2] = a * m + u * y + c, f[p * 2 + 1] = h * m + l * y + d;
        }
        if (this._roundPixels)
          for (var _ = G.RESOLUTION, p = 0; p < f.length; ++p)
            f[p] = Math.round((f[p] * _ | 0) / _);
        this.vertexDirty = o;
      }
    }, e.prototype.calculateUvs = function() {
      var t = this.geometry.buffers[1], i = this.shader;
      i.uvMatrix.isSimple ? this.uvs = t.data : (this.batchUvs || (this.batchUvs = new M1(t, i.uvMatrix)), this.batchUvs.update(), this.uvs = this.batchUvs.data);
    }, e.prototype._calculateBounds = function() {
      this.calculateVertices(), this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
    }, e.prototype.containsPoint = function(t) {
      if (!this.getBounds().contains(t.x, t.y))
        return !1;
      this.worldTransform.applyInverse(t, Bo);
      for (var i = this.geometry.getBuffer("aVertexPosition").data, n = du.points, o = this.geometry.getIndex().data, s = o.length, a = this.drawMode === 4 ? 3 : 1, h = 0; h + 2 < s; h += a) {
        var u = o[h] * 2, l = o[h + 1] * 2, c = o[h + 2] * 2;
        if (n[0] = i[u], n[1] = i[u + 1], n[2] = i[l], n[3] = i[l + 1], n[4] = i[c], n[5] = i[c + 1], du.contains(Bo.x, Bo.y))
          return !0;
      }
      return !1;
    }, e.prototype.destroy = function(t) {
      r.prototype.destroy.call(this, t), this._cachedTexture && (this._cachedTexture.destroy(), this._cachedTexture = null), this.geometry = null, this.shader = null, this.state = null, this.uvs = null, this.indices = null, this.vertexData = null;
    }, e.BATCHABLE_SIZE = 100, e;
  }(le)
), I1 = `varying vec2 vTextureCoord;
uniform vec4 uColor;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
`, D1 = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTextureMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;
}
`, bi = (
  /** @class */
  function(r) {
    fa(e, r);
    function e(t, i) {
      var n = this, o = {
        uSampler: t,
        alpha: 1,
        uTextureMatrix: Pt.IDENTITY,
        uColor: new Float32Array([1, 1, 1, 1])
      };
      return i = Object.assign({
        tint: 16777215,
        alpha: 1,
        pluginName: "batch"
      }, i), i.uniforms && Object.assign(o, i.uniforms), n = r.call(this, i.program || Pi.from(D1, I1), o) || this, n._colorDirty = !1, n.uvMatrix = new ca(t), n.batchable = i.program === void 0, n.pluginName = i.pluginName, n.tint = i.tint, n.alpha = i.alpha, n;
    }
    return Object.defineProperty(e.prototype, "texture", {
      /** Reference to the texture being rendered. */
      get: function() {
        return this.uniforms.uSampler;
      },
      set: function(t) {
        this.uniforms.uSampler !== t && (!this.uniforms.uSampler.baseTexture.alphaMode != !t.baseTexture.alphaMode && (this._colorDirty = !0), this.uniforms.uSampler = t, this.uvMatrix.texture = t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "alpha", {
      get: function() {
        return this._alpha;
      },
      /**
       * This gets automatically set by the object using this.
       * @default 1
       */
      set: function(t) {
        t !== this._alpha && (this._alpha = t, this._colorDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "tint", {
      get: function() {
        return this._tint;
      },
      /**
       * Multiply tint for the material.
       * @default 0xFFFFFF
       */
      set: function(t) {
        t !== this._tint && (this._tint = t, this._tintRGB = (t >> 16) + (t & 65280) + ((t & 255) << 16), this._colorDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.update = function() {
      if (this._colorDirty) {
        this._colorDirty = !1;
        var t = this.texture.baseTexture;
        Al(this._tint, this._alpha, this.uniforms.uColor, t.alphaMode);
      }
      this.uvMatrix.update() && (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
    }, e;
  }(Ce)
), Hn = (
  /** @class */
  function(r) {
    fa(e, r);
    function e(t, i, n) {
      var o = r.call(this) || this, s = new Rt(t), a = new Rt(i, !0), h = new Rt(n, !0, !0);
      return o.addAttribute("aVertexPosition", s, 2, !1, k.FLOAT).addAttribute("aTextureCoord", a, 2, !1, k.FLOAT).addIndex(h), o._updateId = -1, o;
    }
    return Object.defineProperty(e.prototype, "vertexDirtyId", {
      /**
       * If the vertex position is updated.
       * @readonly
       * @private
       */
      get: function() {
        return this.buffers[0]._updateID;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(Ri)
);
/*!
 * @pixi/text-bitmap - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/text-bitmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ms = function(r, e) {
  return Ms = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ms(r, e);
};
function C1(r, e) {
  Ms(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Ln = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
      this.info = [], this.common = [], this.page = [], this.char = [], this.kerning = [], this.distanceField = [];
    }
    return r;
  }()
), N1 = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(e) {
      return typeof e == "string" && e.indexOf("info face=") === 0;
    }, r.parse = function(e) {
      var t = e.match(/^[a-z]+\s+.+$/gm), i = {
        info: [],
        common: [],
        page: [],
        char: [],
        chars: [],
        kerning: [],
        kernings: [],
        distanceField: []
      };
      for (var n in t) {
        var o = t[n].match(/^[a-z]+/gm)[0], s = t[n].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), a = {};
        for (var h in s) {
          var u = s[h].split("="), l = u[0], c = u[1].replace(/"/gm, ""), d = parseFloat(c), f = isNaN(d) ? c : d;
          a[l] = f;
        }
        i[o].push(a);
      }
      var p = new Ln();
      return i.info.forEach(function(m) {
        return p.info.push({
          face: m.face,
          size: parseInt(m.size, 10)
        });
      }), i.common.forEach(function(m) {
        return p.common.push({
          lineHeight: parseInt(m.lineHeight, 10)
        });
      }), i.page.forEach(function(m) {
        return p.page.push({
          id: parseInt(m.id, 10),
          file: m.file
        });
      }), i.char.forEach(function(m) {
        return p.char.push({
          id: parseInt(m.id, 10),
          page: parseInt(m.page, 10),
          x: parseInt(m.x, 10),
          y: parseInt(m.y, 10),
          width: parseInt(m.width, 10),
          height: parseInt(m.height, 10),
          xoffset: parseInt(m.xoffset, 10),
          yoffset: parseInt(m.yoffset, 10),
          xadvance: parseInt(m.xadvance, 10)
        });
      }), i.kerning.forEach(function(m) {
        return p.kerning.push({
          first: parseInt(m.first, 10),
          second: parseInt(m.second, 10),
          amount: parseInt(m.amount, 10)
        });
      }), i.distanceField.forEach(function(m) {
        return p.distanceField.push({
          distanceRange: parseInt(m.distanceRange, 10),
          fieldType: m.fieldType
        });
      }), p;
    }, r;
  }()
), Is = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(e) {
      return e instanceof XMLDocument && e.getElementsByTagName("page").length && e.getElementsByTagName("info")[0].getAttribute("face") !== null;
    }, r.parse = function(e) {
      for (var t = new Ln(), i = e.getElementsByTagName("info"), n = e.getElementsByTagName("common"), o = e.getElementsByTagName("page"), s = e.getElementsByTagName("char"), a = e.getElementsByTagName("kerning"), h = e.getElementsByTagName("distanceField"), u = 0; u < i.length; u++)
        t.info.push({
          face: i[u].getAttribute("face"),
          size: parseInt(i[u].getAttribute("size"), 10)
        });
      for (var u = 0; u < n.length; u++)
        t.common.push({
          lineHeight: parseInt(n[u].getAttribute("lineHeight"), 10)
        });
      for (var u = 0; u < o.length; u++)
        t.page.push({
          id: parseInt(o[u].getAttribute("id"), 10) || 0,
          file: o[u].getAttribute("file")
        });
      for (var u = 0; u < s.length; u++) {
        var l = s[u];
        t.char.push({
          id: parseInt(l.getAttribute("id"), 10),
          page: parseInt(l.getAttribute("page"), 10) || 0,
          x: parseInt(l.getAttribute("x"), 10),
          y: parseInt(l.getAttribute("y"), 10),
          width: parseInt(l.getAttribute("width"), 10),
          height: parseInt(l.getAttribute("height"), 10),
          xoffset: parseInt(l.getAttribute("xoffset"), 10),
          yoffset: parseInt(l.getAttribute("yoffset"), 10),
          xadvance: parseInt(l.getAttribute("xadvance"), 10)
        });
      }
      for (var u = 0; u < a.length; u++)
        t.kerning.push({
          first: parseInt(a[u].getAttribute("first"), 10),
          second: parseInt(a[u].getAttribute("second"), 10),
          amount: parseInt(a[u].getAttribute("amount"), 10)
        });
      for (var u = 0; u < h.length; u++)
        t.distanceField.push({
          fieldType: h[u].getAttribute("fieldType"),
          distanceRange: parseInt(h[u].getAttribute("distanceRange"), 10)
        });
      return t;
    }, r;
  }()
), F1 = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(e) {
      if (typeof e == "string" && e.indexOf("<font>") > -1) {
        var t = new globalThis.DOMParser().parseFromString(e, "text/xml");
        return Is.test(t);
      }
      return !1;
    }, r.parse = function(e) {
      var t = new globalThis.DOMParser().parseFromString(e, "text/xml");
      return Is.parse(t);
    }, r;
  }()
), Go = [
  N1,
  Is,
  F1
];
function ec(r) {
  for (var e = 0; e < Go.length; e++)
    if (Go[e].test(r))
      return Go[e];
  return null;
}
function L1(r, e, t, i, n, o) {
  var s = t.fill;
  if (Array.isArray(s)) {
    if (s.length === 1)
      return s[0];
  } else
    return s;
  var a, h = t.dropShadow ? t.dropShadowDistance : 0, u = t.padding || 0, l = r.width / i - h - u * 2, c = r.height / i - h - u * 2, d = s.slice(), f = t.fillGradientStops.slice();
  if (!f.length)
    for (var p = d.length + 1, m = 1; m < p; ++m)
      f.push(m / p);
  if (d.unshift(s[0]), f.unshift(0), d.push(s[s.length - 1]), f.push(1), t.fillGradientType === gi.LINEAR_VERTICAL) {
    a = e.createLinearGradient(l / 2, u, l / 2, c + u);
    for (var y = 0, _ = o.fontProperties.fontSize + t.strokeThickness, g = _ / c, m = 0; m < n.length; m++)
      for (var v = o.lineHeight * m, b = 0; b < d.length; b++) {
        var T = 0;
        typeof f[b] == "number" ? T = f[b] : T = b / d.length;
        var S = v / c + T * g, w = Math.max(y, S);
        w = Math.min(w, 1), a.addColorStop(w, d[b]), y = w;
      }
  } else {
    a = e.createLinearGradient(u, c / 2, l + u, c / 2);
    for (var A = d.length + 1, x = 1, m = 0; m < d.length; m++) {
      var E = void 0;
      typeof f[m] == "number" ? E = f[m] : E = x / A, a.addColorStop(E, d[m]), x++;
    }
  }
  return a;
}
function B1(r, e, t, i, n, o, s) {
  var a = t.text, h = t.fontProperties;
  e.translate(i, n), e.scale(o, o);
  var u = s.strokeThickness / 2, l = -(s.strokeThickness / 2);
  if (e.font = s.toFontString(), e.lineWidth = s.strokeThickness, e.textBaseline = s.textBaseline, e.lineJoin = s.lineJoin, e.miterLimit = s.miterLimit, e.fillStyle = L1(r, e, s, o, [a], t), e.strokeStyle = s.stroke, s.dropShadow) {
    var c = s.dropShadowColor, d = kr(typeof c == "number" ? c : Rn(c)), f = s.dropShadowBlur * o, p = s.dropShadowDistance * o;
    e.shadowColor = "rgba(" + d[0] * 255 + "," + d[1] * 255 + "," + d[2] * 255 + "," + s.dropShadowAlpha + ")", e.shadowBlur = f, e.shadowOffsetX = Math.cos(s.dropShadowAngle) * p, e.shadowOffsetY = Math.sin(s.dropShadowAngle) * p;
  } else
    e.shadowColor = "black", e.shadowBlur = 0, e.shadowOffsetX = 0, e.shadowOffsetY = 0;
  s.stroke && s.strokeThickness && e.strokeText(a, u, l + t.lineHeight - h.descent), s.fill && e.fillText(a, u, l + t.lineHeight - h.descent), e.setTransform(1, 0, 0, 1, 0, 0), e.fillStyle = "rgba(0, 0, 0, 0)";
}
function rc(r) {
  return Array.from ? Array.from(r) : r.split("");
}
function G1(r) {
  typeof r == "string" && (r = [r]);
  for (var e = [], t = 0, i = r.length; t < i; t++) {
    var n = r[t];
    if (Array.isArray(n)) {
      if (n.length !== 2)
        throw new Error("[BitmapFont]: Invalid character range length, expecting 2 got " + n.length + ".");
      var o = n[0].charCodeAt(0), s = n[1].charCodeAt(0);
      if (s < o)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (var a = o, h = s; a <= h; a++)
        e.push(String.fromCharCode(a));
    } else
      e.push.apply(e, rc(n));
  }
  if (e.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return e;
}
function yn(r) {
  return r.codePointAt ? r.codePointAt(0) : r.charCodeAt(0);
}
var Oe = (
  /** @class */
  function() {
    function r(e, t, i) {
      var n, o, s = e.info[0], a = e.common[0], h = e.page[0], u = e.distanceField[0], l = Mn(h.file), c = {};
      this._ownsTextures = i, this.font = s.face, this.size = s.size, this.lineHeight = a.lineHeight / l, this.chars = {}, this.pageTextures = c;
      for (var d = 0; d < e.page.length; d++) {
        var f = e.page[d], p = f.id, m = f.file;
        c[p] = t instanceof Array ? t[d] : t[m], u != null && u.fieldType && u.fieldType !== "none" && (c[p].baseTexture.alphaMode = te.NO_PREMULTIPLIED_ALPHA, c[p].baseTexture.mipmap = Qt.OFF);
      }
      for (var d = 0; d < e.char.length; d++) {
        var y = e.char[d], p = y.id, _ = y.page, g = e.char[d], v = g.x, b = g.y, T = g.width, S = g.height, w = g.xoffset, A = g.yoffset, x = g.xadvance;
        v /= l, b /= l, T /= l, S /= l, w /= l, A /= l, x /= l;
        var E = new nt(v + c[_].frame.x / l, b + c[_].frame.y / l, T, S);
        this.chars[p] = {
          xOffset: w,
          yOffset: A,
          xAdvance: x,
          kerning: {},
          texture: new $(c[_].baseTexture, E),
          page: _
        };
      }
      for (var d = 0; d < e.kerning.length; d++) {
        var O = e.kerning[d], P = O.first, M = O.second, F = O.amount;
        P /= l, M /= l, F /= l, this.chars[M] && (this.chars[M].kerning[P] = F);
      }
      this.distanceFieldRange = u == null ? void 0 : u.distanceRange, this.distanceFieldType = (o = (n = u == null ? void 0 : u.fieldType) === null || n === void 0 ? void 0 : n.toLowerCase()) !== null && o !== void 0 ? o : "none";
    }
    return r.prototype.destroy = function() {
      for (var e in this.chars)
        this.chars[e].texture.destroy(), this.chars[e].texture = null;
      for (var e in this.pageTextures)
        this._ownsTextures && this.pageTextures[e].destroy(!0), this.pageTextures[e] = null;
      this.chars = null, this.pageTextures = null;
    }, r.install = function(e, t, i) {
      var n;
      if (e instanceof Ln)
        n = e;
      else {
        var o = ec(e);
        if (!o)
          throw new Error("Unrecognized data format for font.");
        n = o.parse(e);
      }
      t instanceof $ && (t = [t]);
      var s = new r(n, t, i);
      return r.available[s.font] = s, s;
    }, r.uninstall = function(e) {
      var t = r.available[e];
      if (!t)
        throw new Error("No font found named '" + e + "'");
      t.destroy(), delete r.available[e];
    }, r.from = function(e, t, i) {
      if (!e)
        throw new Error("[BitmapFont] Property `name` is required.");
      var n = Object.assign({}, r.defaultOptions, i), o = n.chars, s = n.padding, a = n.resolution, h = n.textureWidth, u = n.textureHeight, l = G1(o), c = t instanceof Xr ? t : new Xr(t), d = h, f = new Ln();
      f.info[0] = {
        face: c.fontFamily,
        size: c.fontSize
      }, f.common[0] = {
        lineHeight: c.fontSize
      };
      for (var p = 0, m = 0, y, _, g, v = 0, b = [], T = 0; T < l.length; T++) {
        y || (y = G.ADAPTER.createCanvas(), y.width = h, y.height = u, _ = y.getContext("2d"), g = new it(y, { resolution: a }), b.push(new $(g)), f.page.push({
          id: b.length - 1,
          file: ""
        }));
        var S = l[T], w = ce.measureText(S, c, !1, y), A = w.width, x = Math.ceil(w.height), E = Math.ceil((c.fontStyle === "italic" ? 2 : 1) * A);
        if (m >= u - x * a) {
          if (m === 0)
            throw new Error("[BitmapFont] textureHeight " + u + "px is too small " + ("(fontFamily: '" + c.fontFamily + "', fontSize: " + c.fontSize + "px, char: '" + S + "')"));
          --T, y = null, _ = null, g = null, m = 0, p = 0, v = 0;
          continue;
        }
        if (v = Math.max(x + w.fontProperties.descent, v), E * a + p >= d) {
          if (p === 0)
            throw new Error("[BitmapFont] textureWidth " + h + "px is too small " + ("(fontFamily: '" + c.fontFamily + "', fontSize: " + c.fontSize + "px, char: '" + S + "')"));
          --T, m += v * a, m = Math.ceil(m), p = 0, v = 0;
          continue;
        }
        B1(y, _, w, p, m, a, c);
        var O = yn(w.text);
        f.char.push({
          id: O,
          page: b.length - 1,
          x: p / a,
          y: m / a,
          width: E,
          height: x,
          xoffset: 0,
          yoffset: 0,
          xadvance: Math.ceil(A - (c.dropShadow ? c.dropShadowDistance : 0) - (c.stroke ? c.strokeThickness : 0))
        }), p += (E + 2 * s) * a, p = Math.ceil(p);
      }
      if (!(i != null && i.skipKerning))
        for (var T = 0, P = l.length; T < P; T++)
          for (var M = l[T], F = 0; F < P; F++) {
            var D = l[F], C = _.measureText(M).width, V = _.measureText(D).width, st = _.measureText(M + D).width, q = st - (C + V);
            q && f.kerning.push({
              first: yn(M),
              second: yn(D),
              amount: q
            });
          }
      var L = new r(f, b, !0);
      return r.available[e] !== void 0 && r.uninstall(e), r.available[e] = L, L;
    }, r.ALPHA = [["a", "z"], ["A", "Z"], " "], r.NUMERIC = [["0", "9"]], r.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], r.ASCII = [[" ", "~"]], r.defaultOptions = {
      resolution: 1,
      textureWidth: 512,
      textureHeight: 512,
      padding: 4,
      chars: r.ALPHANUMERIC
    }, r.available = {}, r;
  }()
), U1 = `// Pixi texture info\r
varying vec2 vTextureCoord;\r
uniform sampler2D uSampler;\r
\r
// Tint\r
uniform vec4 uColor;\r
\r
// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange\r
uniform float uFWidth;\r
\r
void main(void) {\r
\r
  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.\r
  vec4 texColor = texture2D(uSampler, vTextureCoord);\r
\r
  // MSDF\r
  float median = texColor.r + texColor.g + texColor.b -\r
                  min(texColor.r, min(texColor.g, texColor.b)) -\r
                  max(texColor.r, max(texColor.g, texColor.b));\r
  // SDF\r
  median = min(median, texColor.a);\r
\r
  float screenPxDistance = uFWidth * (median - 0.5);\r
  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r
  if (median < 0.01) {\r
    alpha = 0.0;\r
  } else if (median > 0.99) {\r
    alpha = 1.0;\r
  }\r
\r
  // NPM Textures, NPM outputs\r
  gl_FragColor = vec4(uColor.rgb, uColor.a * alpha);\r
\r
}\r
`, k1 = `// Mesh material default fragment\r
attribute vec2 aVertexPosition;\r
attribute vec2 aTextureCoord;\r
\r
uniform mat3 projectionMatrix;\r
uniform mat3 translationMatrix;\r
uniform mat3 uTextureMatrix;\r
\r
varying vec2 vTextureCoord;\r
\r
void main(void)\r
{\r
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r
\r
    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\r
}\r
`, fu = [], pu = [], mu = [];
(function(r) {
  C1(e, r);
  function e(t, i) {
    i === void 0 && (i = {});
    var n = r.call(this) || this;
    n._tint = 16777215;
    var o = Object.assign({}, e.styleDefaults, i), s = o.align, a = o.tint, h = o.maxWidth, u = o.letterSpacing, l = o.fontName, c = o.fontSize;
    if (!Oe.available[l])
      throw new Error('Missing BitmapFont "' + l + '"');
    return n._activePagesMeshData = [], n._textWidth = 0, n._textHeight = 0, n._align = s, n._tint = a, n._font = void 0, n._fontName = l, n._fontSize = c, n.text = t, n._maxWidth = h, n._maxLineHeight = 0, n._letterSpacing = u, n._anchor = new Pr(function() {
      n.dirty = !0;
    }, n, 0, 0), n._roundPixels = G.ROUND_PIXELS, n.dirty = !0, n._resolution = G.RESOLUTION, n._autoResolution = !0, n._textureCache = {}, n;
  }
  return e.prototype.updateText = function() {
    for (var t, i = Oe.available[this._fontName], n = this.fontSize, o = n / i.size, s = new yt(), a = [], h = [], u = [], l = this._text.replace(/(?:\r\n|\r)/g, `
`) || " ", c = rc(l), d = this._maxWidth * i.size / n, f = i.distanceFieldType === "none" ? fu : pu, p = null, m = 0, y = 0, _ = 0, g = -1, v = 0, b = 0, T = 0, S = 0, w = 0; w < c.length; w++) {
      var A = c[w], x = yn(A);
      if (/(?:\s)/.test(A) && (g = w, v = m, S++), A === "\r" || A === `
`) {
        h.push(m), u.push(-1), y = Math.max(y, m), ++_, ++b, s.x = 0, s.y += i.lineHeight, p = null, S = 0;
        continue;
      }
      var E = i.chars[x];
      if (E) {
        p && E.kerning[p] && (s.x += E.kerning[p]);
        var O = mu.pop() || {
          texture: $.EMPTY,
          line: 0,
          charCode: 0,
          prevSpaces: 0,
          position: new yt()
        };
        O.texture = E.texture, O.line = _, O.charCode = x, O.position.x = s.x + E.xOffset + this._letterSpacing / 2, O.position.y = s.y + E.yOffset, O.prevSpaces = S, a.push(O), m = O.position.x + Math.max(E.xAdvance - E.xOffset, E.texture.orig.width), s.x += E.xAdvance + this._letterSpacing, T = Math.max(T, E.yOffset + E.texture.height), p = x, g !== -1 && d > 0 && s.x > d && (++b, Fr(a, 1 + g - b, 1 + w - g), w = g, g = -1, h.push(v), u.push(a.length > 0 ? a[a.length - 1].prevSpaces : 0), y = Math.max(y, v), _++, s.x = 0, s.y += i.lineHeight, p = null, S = 0);
      }
    }
    var P = c[c.length - 1];
    P !== "\r" && P !== `
` && (/(?:\s)/.test(P) && (m = v), h.push(m), y = Math.max(y, m), u.push(-1));
    for (var M = [], w = 0; w <= _; w++) {
      var F = 0;
      this._align === "right" ? F = y - h[w] : this._align === "center" ? F = (y - h[w]) / 2 : this._align === "justify" && (F = u[w] < 0 ? 0 : (y - h[w]) / u[w]), M.push(F);
    }
    var D = a.length, C = {}, V = [], st = this._activePagesMeshData;
    f.push.apply(f, st);
    for (var w = 0; w < D; w++) {
      var q = a[w].texture, L = q.baseTexture.uid;
      if (!C[L]) {
        var I = f.pop();
        if (!I) {
          var j = new Hn(), K = void 0, J = void 0;
          i.distanceFieldType === "none" ? (K = new bi($.EMPTY), J = X.NORMAL) : (K = new bi($.EMPTY, { program: Pi.from(k1, U1), uniforms: { uFWidth: 0 } }), J = X.NORMAL_NPM);
          var mt = new vi(j, K);
          mt.blendMode = J, I = {
            index: 0,
            indexCount: 0,
            vertexCount: 0,
            uvsCount: 0,
            total: 0,
            mesh: mt,
            vertices: null,
            uvs: null,
            indices: null
          };
        }
        I.index = 0, I.indexCount = 0, I.vertexCount = 0, I.uvsCount = 0, I.total = 0;
        var W = this._textureCache;
        W[L] = W[L] || new $(q.baseTexture), I.mesh.texture = W[L], I.mesh.tint = this._tint, V.push(I), C[L] = I;
      }
      C[L].total++;
    }
    for (var w = 0; w < st.length; w++)
      V.indexOf(st[w]) === -1 && this.removeChild(st[w].mesh);
    for (var w = 0; w < V.length; w++)
      V[w].mesh.parent !== this && this.addChild(V[w].mesh);
    this._activePagesMeshData = V;
    for (var w in C) {
      var I = C[w], lt = I.total;
      if (!(((t = I.indices) === null || t === void 0 ? void 0 : t.length) > 6 * lt) || I.vertices.length < vi.BATCHABLE_SIZE * 2)
        I.vertices = new Float32Array(4 * 2 * lt), I.uvs = new Float32Array(4 * 2 * lt), I.indices = new Uint16Array(6 * lt);
      else
        for (var vt = I.total, At = I.vertices, Q = vt * 4 * 2; Q < At.length; Q++)
          At[Q] = 0;
      I.mesh.size = 6 * lt;
    }
    for (var w = 0; w < D; w++) {
      var A = a[w], ot = A.position.x + M[A.line] * (this._align === "justify" ? A.prevSpaces : 1);
      this._roundPixels && (ot = Math.round(ot));
      var at = ot * o, dt = A.position.y * o, q = A.texture, Z = C[q.baseTexture.uid], U = q.frame, B = q._uvs, ht = Z.index++;
      Z.indices[ht * 6 + 0] = 0 + ht * 4, Z.indices[ht * 6 + 1] = 1 + ht * 4, Z.indices[ht * 6 + 2] = 2 + ht * 4, Z.indices[ht * 6 + 3] = 0 + ht * 4, Z.indices[ht * 6 + 4] = 2 + ht * 4, Z.indices[ht * 6 + 5] = 3 + ht * 4, Z.vertices[ht * 8 + 0] = at, Z.vertices[ht * 8 + 1] = dt, Z.vertices[ht * 8 + 2] = at + U.width * o, Z.vertices[ht * 8 + 3] = dt, Z.vertices[ht * 8 + 4] = at + U.width * o, Z.vertices[ht * 8 + 5] = dt + U.height * o, Z.vertices[ht * 8 + 6] = at, Z.vertices[ht * 8 + 7] = dt + U.height * o, Z.uvs[ht * 8 + 0] = B.x0, Z.uvs[ht * 8 + 1] = B.y0, Z.uvs[ht * 8 + 2] = B.x1, Z.uvs[ht * 8 + 3] = B.y1, Z.uvs[ht * 8 + 4] = B.x2, Z.uvs[ht * 8 + 5] = B.y2, Z.uvs[ht * 8 + 6] = B.x3, Z.uvs[ht * 8 + 7] = B.y3;
    }
    this._textWidth = y * o, this._textHeight = (s.y + i.lineHeight) * o;
    for (var w in C) {
      var I = C[w];
      if (this.anchor.x !== 0 || this.anchor.y !== 0)
        for (var ie = 0, dr = this._textWidth * this.anchor.x, Ii = this._textHeight * this.anchor.y, ya = 0; ya < I.total; ya++)
          I.vertices[ie++] -= dr, I.vertices[ie++] -= Ii, I.vertices[ie++] -= dr, I.vertices[ie++] -= Ii, I.vertices[ie++] -= dr, I.vertices[ie++] -= Ii, I.vertices[ie++] -= dr, I.vertices[ie++] -= Ii;
      this._maxLineHeight = T * o;
      var _a = I.mesh.geometry.getBuffer("aVertexPosition"), ga = I.mesh.geometry.getBuffer("aTextureCoord"), va = I.mesh.geometry.getIndex();
      _a.data = I.vertices, ga.data = I.uvs, va.data = I.indices, _a.update(), ga.update(), va.update();
    }
    for (var w = 0; w < a.length; w++)
      mu.push(a[w]);
    this._font = i, this.dirty = !1;
  }, e.prototype.updateTransform = function() {
    this.validate(), this.containerUpdateTransform();
  }, e.prototype._render = function(t) {
    this._autoResolution && this._resolution !== t.resolution && (this._resolution = t.resolution, this.dirty = !0);
    var i = Oe.available[this._fontName], n = i.distanceFieldRange, o = i.distanceFieldType, s = i.size;
    if (o !== "none")
      for (var a = this.worldTransform, h = a.a, u = a.b, l = a.c, c = a.d, d = Math.sqrt(h * h + u * u), f = Math.sqrt(l * l + c * c), p = (Math.abs(d) + Math.abs(f)) / 2, m = this.fontSize / s, y = 0, _ = this._activePagesMeshData; y < _.length; y++) {
        var g = _[y];
        g.mesh.shader.uniforms.uFWidth = p * n * m * this._resolution;
      }
    r.prototype._render.call(this, t);
  }, e.prototype.getLocalBounds = function() {
    return this.validate(), r.prototype.getLocalBounds.call(this);
  }, e.prototype.validate = function() {
    var t = Oe.available[this._fontName];
    if (!t)
      throw new Error('Missing BitmapFont "' + this._fontName + '"');
    this._font !== t && (this.dirty = !0), this.dirty && this.updateText();
  }, Object.defineProperty(e.prototype, "tint", {
    /**
     * The tint of the BitmapText object.
     * @default 0xffffff
     */
    get: function() {
      return this._tint;
    },
    set: function(t) {
      if (this._tint !== t) {
        this._tint = t;
        for (var i = 0; i < this._activePagesMeshData.length; i++)
          this._activePagesMeshData[i].mesh.tint = t;
      }
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "align", {
    /**
     * The alignment of the BitmapText object.
     * @member {string}
     * @default 'left'
     */
    get: function() {
      return this._align;
    },
    set: function(t) {
      this._align !== t && (this._align = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "fontName", {
    /** The name of the BitmapFont. */
    get: function() {
      return this._fontName;
    },
    set: function(t) {
      if (!Oe.available[t])
        throw new Error('Missing BitmapFont "' + t + '"');
      this._fontName !== t && (this._fontName = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "fontSize", {
    /** The size of the font to display. */
    get: function() {
      var t;
      return (t = this._fontSize) !== null && t !== void 0 ? t : Oe.available[this._fontName].size;
    },
    set: function(t) {
      this._fontSize !== t && (this._fontSize = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "anchor", {
    /**
     * The anchor sets the origin point of the text.
     *
     * The default is `(0,0)`, this means the text's origin is the top left.
     *
     * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
     *
     * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
     */
    get: function() {
      return this._anchor;
    },
    set: function(t) {
      typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "text", {
    /** The text of the BitmapText object. */
    get: function() {
      return this._text;
    },
    set: function(t) {
      t = String(t ?? ""), this._text !== t && (this._text = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "maxWidth", {
    /**
     * The max width of this bitmap text in pixels. If the text provided is longer than the
     * value provided, line breaks will be automatically inserted in the last whitespace.
     * Disable by setting the value to 0.
     */
    get: function() {
      return this._maxWidth;
    },
    set: function(t) {
      this._maxWidth !== t && (this._maxWidth = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "maxLineHeight", {
    /**
     * The max line height. This is useful when trying to use the total height of the Text,
     * i.e. when trying to vertically align.
     * @readonly
     */
    get: function() {
      return this.validate(), this._maxLineHeight;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "textWidth", {
    /**
     * The width of the overall text, different from fontSize,
     * which is defined in the style object.
     * @readonly
     */
    get: function() {
      return this.validate(), this._textWidth;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "letterSpacing", {
    /** Additional space between characters. */
    get: function() {
      return this._letterSpacing;
    },
    set: function(t) {
      this._letterSpacing !== t && (this._letterSpacing = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "roundPixels", {
    /**
     * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Advantages can include sharper image quality (like text) and faster rendering on canvas.
     * The main disadvantage is movement of objects may appear less smooth.
     * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
     * @default PIXI.settings.ROUND_PIXELS
     */
    get: function() {
      return this._roundPixels;
    },
    set: function(t) {
      t !== this._roundPixels && (this._roundPixels = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "textHeight", {
    /**
     * The height of the overall text, different from fontSize,
     * which is defined in the style object.
     * @readonly
     */
    get: function() {
      return this.validate(), this._textHeight;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "resolution", {
    /**
     * The resolution / device pixel ratio of the canvas.
     *
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @default 1
     */
    get: function() {
      return this._resolution;
    },
    set: function(t) {
      this._autoResolution = !1, this._resolution !== t && (this._resolution = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.destroy = function(t) {
    var i = this._textureCache, n = Oe.available[this._fontName], o = n.distanceFieldType === "none" ? fu : pu;
    o.push.apply(o, this._activePagesMeshData);
    for (var s = 0, a = this._activePagesMeshData; s < a.length; s++) {
      var h = a[s];
      this.removeChild(h.mesh);
    }
    this._activePagesMeshData = [], o.filter(function(c) {
      return i[c.mesh.texture.baseTexture.uid];
    }).forEach(function(c) {
      c.mesh.texture = $.EMPTY;
    });
    for (var u in i) {
      var l = i[u];
      l.destroy(), delete i[u];
    }
    this._font = null, this._textureCache = null, r.prototype.destroy.call(this, t);
  }, e.styleDefaults = {
    align: "left",
    tint: 16777215,
    maxWidth: 0,
    letterSpacing: 0
  }, e;
})(le);
var X1 = (
  /** @class */
  function() {
    function r() {
    }
    return r.add = function() {
      Et.setExtensionXhrType("fnt", Et.XHR_RESPONSE_TYPE.TEXT);
    }, r.use = function(e, t) {
      var i = ec(e.data);
      if (!i) {
        t();
        return;
      }
      for (var n = r.getBaseUrl(this, e), o = i.parse(e.data), s = {}, a = function(m) {
        s[m.metadata.pageFile] = m.texture, Object.keys(s).length === o.page.length && (e.bitmapFont = Oe.install(o, s, !0), t());
      }, h = 0; h < o.page.length; ++h) {
        var u = o.page[h].file, l = n + u, c = !1;
        for (var d in this.resources) {
          var f = this.resources[d];
          if (f.url === l) {
            f.metadata.pageFile = u, f.texture ? a(f) : f.onAfterMiddleware.add(a), c = !0;
            break;
          }
        }
        if (!c) {
          var p = {
            crossOrigin: e.crossOrigin,
            loadType: Et.LOAD_TYPE.IMAGE,
            metadata: Object.assign({ pageFile: u }, e.metadata.imageMetadata),
            parentResource: e
          };
          this.add(l, p, a);
        }
      }
    }, r.getBaseUrl = function(e, t) {
      var i = t.isDataUrl ? "" : r.dirname(t.url);
      return t.isDataUrl && (i === "." && (i = ""), e.baseUrl && i && e.baseUrl.charAt(e.baseUrl.length - 1) === "/" && (i += "/")), i = i.replace(e.baseUrl, ""), i && i.charAt(i.length - 1) !== "/" && (i += "/"), i;
    }, r.dirname = function(e) {
      var t = e.replace(/\\/g, "/").replace(/\/$/, "").replace(/\/[^\/]*$/, "");
      return t === e ? "." : t === "" ? "/" : t;
    }, r.extension = ft.Loader, r;
  }()
);
/*!
 * @pixi/filter-alpha - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-alpha is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ds = function(r, e) {
  return Ds = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ds(r, e);
};
function j1(r, e) {
  Ds(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var H1 = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;
(function(r) {
  j1(e, r);
  function e(t) {
    t === void 0 && (t = 1);
    var i = r.call(this, L0, H1, { uAlpha: 1 }) || this;
    return i.alpha = t, i;
  }
  return Object.defineProperty(e.prototype, "alpha", {
    /**
     * Coefficient for alpha multiplication
     * @default 1
     */
    get: function() {
      return this.uniforms.uAlpha;
    },
    set: function(t) {
      this.uniforms.uAlpha = t;
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(ke);
/*!
 * @pixi/filter-blur - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Cs = function(r, e) {
  return Cs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Cs(r, e);
};
function ic(r, e) {
  Cs(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Y1 = `
    attribute vec2 aVertexPosition;

    uniform mat3 projectionMatrix;

    uniform float strength;

    varying vec2 vBlurTexCoords[%size%];

    uniform vec4 inputSize;
    uniform vec4 outputFrame;

    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;
function V1(r, e) {
  var t = Math.ceil(r / 2), i = Y1, n = "", o;
  e ? o = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);" : o = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
  for (var s = 0; s < r; s++) {
    var a = o.replace("%index%", s.toString());
    a = a.replace("%sampleIndex%", s - (t - 1) + ".0"), n += a, n += `
`;
  }
  return i = i.replace("%blur%", n), i = i.replace("%size%", r.toString()), i;
}
var $1 = {
  5: [0.153388, 0.221461, 0.250301],
  7: [0.071303, 0.131514, 0.189879, 0.214607],
  9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
  11: [93e-4, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
  13: [2406e-6, 9255e-6, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
  15: [489e-6, 2403e-6, 9246e-6, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
}, z1 = [
  "varying vec2 vBlurTexCoords[%size%];",
  "uniform sampler2D uSampler;",
  "void main(void)",
  "{",
  "    gl_FragColor = vec4(0.0);",
  "    %blur%",
  "}"
].join(`
`);
function W1(r) {
  for (var e = $1[r], t = e.length, i = z1, n = "", o = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;", s, a = 0; a < r; a++) {
    var h = o.replace("%index%", a.toString());
    s = a, a >= t && (s = r - a - 1), h = h.replace("%value%", e[s].toString()), n += h, n += `
`;
  }
  return i = i.replace("%blur%", n), i = i.replace("%size%", r.toString()), i;
}
var yu = (
  /** @class */
  function(r) {
    ic(e, r);
    function e(t, i, n, o, s) {
      i === void 0 && (i = 8), n === void 0 && (n = 4), o === void 0 && (o = G.FILTER_RESOLUTION), s === void 0 && (s = 5);
      var a = this, h = V1(s, t), u = W1(s);
      return a = r.call(
        this,
        // vertex shader
        h,
        // fragment shader
        u
      ) || this, a.horizontal = t, a.resolution = o, a._quality = 0, a.quality = n, a.blur = i, a;
    }
    return e.prototype.apply = function(t, i, n, o) {
      if (n ? this.horizontal ? this.uniforms.strength = 1 / n.width * (n.width / i.width) : this.uniforms.strength = 1 / n.height * (n.height / i.height) : this.horizontal ? this.uniforms.strength = 1 / t.renderer.width * (t.renderer.width / i.width) : this.uniforms.strength = 1 / t.renderer.height * (t.renderer.height / i.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, this.passes === 1)
        t.applyFilter(this, i, n, o);
      else {
        var s = t.getFilterTexture(), a = t.renderer, h = i, u = s;
        this.state.blend = !1, t.applyFilter(this, h, u, Wt.CLEAR);
        for (var l = 1; l < this.passes - 1; l++) {
          t.bindAndClear(h, Wt.BLIT), this.uniforms.uSampler = u;
          var c = u;
          u = h, h = c, a.shader.bind(this), a.geometry.draw(5);
        }
        this.state.blend = !0, t.applyFilter(this, u, n, o), t.returnFilterTexture(s);
      }
    }, Object.defineProperty(e.prototype, "blur", {
      /**
       * Sets the strength of both the blur.
       * @default 16
       */
      get: function() {
        return this.strength;
      },
      set: function(t) {
        this.padding = 1 + Math.abs(t) * 2, this.strength = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "quality", {
      /**
       * Sets the quality of the blur by modifying the number of passes. More passes means higher
       * quality bluring but the lower the performance.
       * @default 4
       */
      get: function() {
        return this._quality;
      },
      set: function(t) {
        this._quality = t, this.passes = t;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(ke)
);
(function(r) {
  ic(e, r);
  function e(t, i, n, o) {
    t === void 0 && (t = 8), i === void 0 && (i = 4), n === void 0 && (n = G.FILTER_RESOLUTION), o === void 0 && (o = 5);
    var s = r.call(this) || this;
    return s.blurXFilter = new yu(!0, t, i, n, o), s.blurYFilter = new yu(!1, t, i, n, o), s.resolution = n, s.quality = i, s.blur = t, s.repeatEdgePixels = !1, s;
  }
  return e.prototype.apply = function(t, i, n, o) {
    var s = Math.abs(this.blurXFilter.strength), a = Math.abs(this.blurYFilter.strength);
    if (s && a) {
      var h = t.getFilterTexture();
      this.blurXFilter.apply(t, i, h, Wt.CLEAR), this.blurYFilter.apply(t, h, n, o), t.returnFilterTexture(h);
    } else
      a ? this.blurYFilter.apply(t, i, n, o) : this.blurXFilter.apply(t, i, n, o);
  }, e.prototype.updatePadding = function() {
    this._repeatEdgePixels ? this.padding = 0 : this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
  }, Object.defineProperty(e.prototype, "blur", {
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     * @default 2
     */
    get: function() {
      return this.blurXFilter.blur;
    },
    set: function(t) {
      this.blurXFilter.blur = this.blurYFilter.blur = t, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "quality", {
    /**
     * Sets the number of passes for blur. More passes means higher quality bluring.
     * @default 1
     */
    get: function() {
      return this.blurXFilter.quality;
    },
    set: function(t) {
      this.blurXFilter.quality = this.blurYFilter.quality = t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "blurX", {
    /**
     * Sets the strength of the blurX property
     * @default 2
     */
    get: function() {
      return this.blurXFilter.blur;
    },
    set: function(t) {
      this.blurXFilter.blur = t, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "blurY", {
    /**
     * Sets the strength of the blurY property
     * @default 2
     */
    get: function() {
      return this.blurYFilter.blur;
    },
    set: function(t) {
      this.blurYFilter.blur = t, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "blendMode", {
    /**
     * Sets the blendmode of the filter
     * @default PIXI.BLEND_MODES.NORMAL
     */
    get: function() {
      return this.blurYFilter.blendMode;
    },
    set: function(t) {
      this.blurYFilter.blendMode = t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "repeatEdgePixels", {
    /**
     * If set to true the edge of the target will be clamped
     * @default false
     */
    get: function() {
      return this._repeatEdgePixels;
    },
    set: function(t) {
      this._repeatEdgePixels = t, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(ke);
/*!
 * @pixi/filter-color-matrix - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-color-matrix is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ns = function(r, e) {
  return Ns = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ns(r, e);
};
function q1(r, e) {
  Ns(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var K1 = `varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float m[20];
uniform float uAlpha;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);

    if (uAlpha == 0.0) {
        gl_FragColor = c;
        return;
    }

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (c.a > 0.0) {
      c.rgb /= c.a;
    }

    vec4 result;

    result.r = (m[0] * c.r);
        result.r += (m[1] * c.g);
        result.r += (m[2] * c.b);
        result.r += (m[3] * c.a);
        result.r += m[4];

    result.g = (m[5] * c.r);
        result.g += (m[6] * c.g);
        result.g += (m[7] * c.b);
        result.g += (m[8] * c.a);
        result.g += m[9];

    result.b = (m[10] * c.r);
       result.b += (m[11] * c.g);
       result.b += (m[12] * c.b);
       result.b += (m[13] * c.a);
       result.b += m[14];

    result.a = (m[15] * c.r);
       result.a += (m[16] * c.g);
       result.a += (m[17] * c.b);
       result.a += (m[18] * c.a);
       result.a += m[19];

    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);

    // Premultiply alpha again.
    rgb *= result.a;

    gl_FragColor = vec4(rgb, result.a);
}
`, _u = (
  /** @class */
  function(r) {
    q1(e, r);
    function e() {
      var t = this, i = {
        m: new Float32Array([
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0
        ]),
        uAlpha: 1
      };
      return t = r.call(this, Hl, K1, i) || this, t.alpha = 1, t;
    }
    return e.prototype._loadMatrix = function(t, i) {
      i === void 0 && (i = !1);
      var n = t;
      i && (this._multiply(n, this.uniforms.m, t), n = this._colorMatrix(n)), this.uniforms.m = n;
    }, e.prototype._multiply = function(t, i, n) {
      return t[0] = i[0] * n[0] + i[1] * n[5] + i[2] * n[10] + i[3] * n[15], t[1] = i[0] * n[1] + i[1] * n[6] + i[2] * n[11] + i[3] * n[16], t[2] = i[0] * n[2] + i[1] * n[7] + i[2] * n[12] + i[3] * n[17], t[3] = i[0] * n[3] + i[1] * n[8] + i[2] * n[13] + i[3] * n[18], t[4] = i[0] * n[4] + i[1] * n[9] + i[2] * n[14] + i[3] * n[19] + i[4], t[5] = i[5] * n[0] + i[6] * n[5] + i[7] * n[10] + i[8] * n[15], t[6] = i[5] * n[1] + i[6] * n[6] + i[7] * n[11] + i[8] * n[16], t[7] = i[5] * n[2] + i[6] * n[7] + i[7] * n[12] + i[8] * n[17], t[8] = i[5] * n[3] + i[6] * n[8] + i[7] * n[13] + i[8] * n[18], t[9] = i[5] * n[4] + i[6] * n[9] + i[7] * n[14] + i[8] * n[19] + i[9], t[10] = i[10] * n[0] + i[11] * n[5] + i[12] * n[10] + i[13] * n[15], t[11] = i[10] * n[1] + i[11] * n[6] + i[12] * n[11] + i[13] * n[16], t[12] = i[10] * n[2] + i[11] * n[7] + i[12] * n[12] + i[13] * n[17], t[13] = i[10] * n[3] + i[11] * n[8] + i[12] * n[13] + i[13] * n[18], t[14] = i[10] * n[4] + i[11] * n[9] + i[12] * n[14] + i[13] * n[19] + i[14], t[15] = i[15] * n[0] + i[16] * n[5] + i[17] * n[10] + i[18] * n[15], t[16] = i[15] * n[1] + i[16] * n[6] + i[17] * n[11] + i[18] * n[16], t[17] = i[15] * n[2] + i[16] * n[7] + i[17] * n[12] + i[18] * n[17], t[18] = i[15] * n[3] + i[16] * n[8] + i[17] * n[13] + i[18] * n[18], t[19] = i[15] * n[4] + i[16] * n[9] + i[17] * n[14] + i[18] * n[19] + i[19], t;
    }, e.prototype._colorMatrix = function(t) {
      var i = new Float32Array(t);
      return i[4] /= 255, i[9] /= 255, i[14] /= 255, i[19] /= 255, i;
    }, e.prototype.brightness = function(t, i) {
      var n = [
        t,
        0,
        0,
        0,
        0,
        0,
        t,
        0,
        0,
        0,
        0,
        0,
        t,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(n, i);
    }, e.prototype.tint = function(t, i) {
      var n = t >> 16 & 255, o = t >> 8 & 255, s = t & 255, a = [
        n / 255,
        0,
        0,
        0,
        0,
        0,
        o / 255,
        0,
        0,
        0,
        0,
        0,
        s / 255,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(a, i);
    }, e.prototype.greyscale = function(t, i) {
      var n = [
        t,
        t,
        t,
        0,
        0,
        t,
        t,
        t,
        0,
        0,
        t,
        t,
        t,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(n, i);
    }, e.prototype.blackAndWhite = function(t) {
      var i = [
        0.3,
        0.6,
        0.1,
        0,
        0,
        0.3,
        0.6,
        0.1,
        0,
        0,
        0.3,
        0.6,
        0.1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.hue = function(t, i) {
      t = (t || 0) / 180 * Math.PI;
      var n = Math.cos(t), o = Math.sin(t), s = Math.sqrt, a = 1 / 3, h = s(a), u = n + (1 - n) * a, l = a * (1 - n) - h * o, c = a * (1 - n) + h * o, d = a * (1 - n) + h * o, f = n + a * (1 - n), p = a * (1 - n) - h * o, m = a * (1 - n) - h * o, y = a * (1 - n) + h * o, _ = n + a * (1 - n), g = [
        u,
        l,
        c,
        0,
        0,
        d,
        f,
        p,
        0,
        0,
        m,
        y,
        _,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(g, i);
    }, e.prototype.contrast = function(t, i) {
      var n = (t || 0) + 1, o = -0.5 * (n - 1), s = [
        n,
        0,
        0,
        0,
        o,
        0,
        n,
        0,
        0,
        o,
        0,
        0,
        n,
        0,
        o,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(s, i);
    }, e.prototype.saturate = function(t, i) {
      t === void 0 && (t = 0);
      var n = t * 2 / 3 + 1, o = (n - 1) * -0.5, s = [
        n,
        o,
        o,
        0,
        0,
        o,
        n,
        o,
        0,
        0,
        o,
        o,
        n,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(s, i);
    }, e.prototype.desaturate = function() {
      this.saturate(-1);
    }, e.prototype.negative = function(t) {
      var i = [
        -1,
        0,
        0,
        1,
        0,
        0,
        -1,
        0,
        1,
        0,
        0,
        0,
        -1,
        1,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.sepia = function(t) {
      var i = [
        0.393,
        0.7689999,
        0.18899999,
        0,
        0,
        0.349,
        0.6859999,
        0.16799999,
        0,
        0,
        0.272,
        0.5339999,
        0.13099999,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.technicolor = function(t) {
      var i = [
        1.9125277891456083,
        -0.8545344976951645,
        -0.09155508482755585,
        0,
        11.793603434377337,
        -0.3087833385928097,
        1.7658908555458428,
        -0.10601743074722245,
        0,
        -70.35205161461398,
        -0.231103377548616,
        -0.7501899197440212,
        1.847597816108189,
        0,
        30.950940869491138,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.polaroid = function(t) {
      var i = [
        1.438,
        -0.062,
        -0.062,
        0,
        0,
        -0.122,
        1.378,
        -0.122,
        0,
        0,
        -0.016,
        -0.016,
        1.483,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.toBGR = function(t) {
      var i = [
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.kodachrome = function(t) {
      var i = [
        1.1285582396593525,
        -0.3967382283601348,
        -0.03992559172921793,
        0,
        63.72958762196502,
        -0.16404339962244616,
        1.0835251566291304,
        -0.05498805115633132,
        0,
        24.732407896706203,
        -0.16786010706155763,
        -0.5603416277695248,
        1.6014850761964943,
        0,
        35.62982807460946,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.browni = function(t) {
      var i = [
        0.5997023498159715,
        0.34553243048391263,
        -0.2708298674538042,
        0,
        47.43192855600873,
        -0.037703249837783157,
        0.8609577587992641,
        0.15059552388459913,
        0,
        -36.96841498319127,
        0.24113635128153335,
        -0.07441037908422492,
        0.44972182064877153,
        0,
        -7.562075277591283,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.vintage = function(t) {
      var i = [
        0.6279345635605994,
        0.3202183420819367,
        -0.03965408211312453,
        0,
        9.651285835294123,
        0.02578397704808868,
        0.6441188644374771,
        0.03259127616149294,
        0,
        7.462829176470591,
        0.0466055556782719,
        -0.0851232987247891,
        0.5241648018700465,
        0,
        5.159190588235296,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.colorTone = function(t, i, n, o, s) {
      t = t || 0.2, i = i || 0.15, n = n || 16770432, o = o || 3375104;
      var a = (n >> 16 & 255) / 255, h = (n >> 8 & 255) / 255, u = (n & 255) / 255, l = (o >> 16 & 255) / 255, c = (o >> 8 & 255) / 255, d = (o & 255) / 255, f = [
        0.3,
        0.59,
        0.11,
        0,
        0,
        a,
        h,
        u,
        t,
        0,
        l,
        c,
        d,
        i,
        0,
        a - l,
        h - c,
        u - d,
        0,
        0
      ];
      this._loadMatrix(f, s);
    }, e.prototype.night = function(t, i) {
      t = t || 0.1;
      var n = [
        t * -2,
        -t,
        0,
        0,
        0,
        -t,
        0,
        t,
        0,
        0,
        0,
        t,
        t * 2,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(n, i);
    }, e.prototype.predator = function(t, i) {
      var n = [
        // row 1
        11.224130630493164 * t,
        -4.794486999511719 * t,
        -2.8746118545532227 * t,
        0 * t,
        0.40342438220977783 * t,
        // row 2
        -3.6330697536468506 * t,
        9.193157196044922 * t,
        -2.951810836791992 * t,
        0 * t,
        -1.316135048866272 * t,
        // row 3
        -3.2184197902679443 * t,
        -4.2375030517578125 * t,
        7.476448059082031 * t,
        0 * t,
        0.8044459223747253 * t,
        // row 4
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(n, i);
    }, e.prototype.lsd = function(t) {
      var i = [
        2,
        -0.4,
        0.5,
        0,
        0,
        -0.5,
        2,
        -0.4,
        0,
        0,
        -0.4,
        -0.5,
        3,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(i, t);
    }, e.prototype.reset = function() {
      var t = [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(t, !1);
    }, Object.defineProperty(e.prototype, "matrix", {
      /**
       * The matrix of the color matrix filter
       * @member {number[]}
       * @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
       */
      get: function() {
        return this.uniforms.m;
      },
      set: function(t) {
        this.uniforms.m = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "alpha", {
      /**
       * The opacity value to use when mixing the original and resultant colors.
       *
       * When the value is 0, the original color is used without modification.
       * When the value is 1, the result color is used.
       * When in the range (0, 1) the color is interpolated between the original and result by this amount.
       * @default 1
       */
      get: function() {
        return this.uniforms.uAlpha;
      },
      set: function(t) {
        this.uniforms.uAlpha = t;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(ke)
);
_u.prototype.grayscale = _u.prototype.greyscale;
/*!
 * @pixi/filter-displacement - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-displacement is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Fs = function(r, e) {
  return Fs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Fs(r, e);
};
function Z1(r, e) {
  Fs(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var J1 = `varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

uniform vec2 scale;
uniform mat2 rotation;
uniform sampler2D uSampler;
uniform sampler2D mapSampler;

uniform highp vec4 inputSize;
uniform vec4 inputClamp;

void main(void)
{
  vec4 map =  texture2D(mapSampler, vFilterCoord);

  map -= 0.5;
  map.xy = scale * inputSize.zw * (rotation * map.xy);

  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));
}
`, Q1 = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
	gl_Position = filterVertexPosition();
	vTextureCoord = filterTextureCoord();
	vFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;
}
`;
(function(r) {
  Z1(e, r);
  function e(t, i) {
    var n = this, o = new Pt();
    return t.renderable = !1, n = r.call(this, Q1, J1, {
      mapSampler: t._texture,
      filterMatrix: o,
      scale: { x: 1, y: 1 },
      rotation: new Float32Array([1, 0, 0, 1])
    }) || this, n.maskSprite = t, n.maskMatrix = o, i == null && (i = 20), n.scale = new yt(i, i), n;
  }
  return e.prototype.apply = function(t, i, n, o) {
    this.uniforms.filterMatrix = t.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x, this.uniforms.scale.y = this.scale.y;
    var s = this.maskSprite.worldTransform, a = Math.sqrt(s.a * s.a + s.b * s.b), h = Math.sqrt(s.c * s.c + s.d * s.d);
    a !== 0 && h !== 0 && (this.uniforms.rotation[0] = s.a / a, this.uniforms.rotation[1] = s.b / a, this.uniforms.rotation[2] = s.c / h, this.uniforms.rotation[3] = s.d / h), t.applyFilter(this, i, n, o);
  }, Object.defineProperty(e.prototype, "map", {
    /** The texture used for the displacement map. Must be power of 2 sized texture. */
    get: function() {
      return this.uniforms.mapSampler;
    },
    set: function(t) {
      this.uniforms.mapSampler = t;
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(ke);
/*!
 * @pixi/filter-fxaa - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-fxaa is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ls = function(r, e) {
  return Ls = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ls(r, e);
};
function tx(r, e) {
  Ls(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var ex = `
attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

void texcoords(vec2 fragCoord, vec2 inverseVP,
               out vec2 v_rgbNW, out vec2 v_rgbNE,
               out vec2 v_rgbSW, out vec2 v_rgbSE,
               out vec2 v_rgbM) {
    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    v_rgbM = vec2(fragCoord * inverseVP);
}

void main(void) {

   gl_Position = filterVertexPosition();

   vFragCoord = aVertexPosition * outputFrame.zw;

   texcoords(vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
`, rx = `varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;
uniform sampler2D uSampler;
uniform highp vec4 inputSize;


/**
 Basic FXAA implementation based on the code on geeks3d.com with the
 modification that the texture2DLod stuff was removed since it's
 unsupported by WebGL.

 --

 From:
 https://github.com/mitsuhiko/webgl-meincraft

 Copyright (c) 2011 by Armin Ronacher.

 Some rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are
 met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the following
 disclaimer in the documentation and/or other materials provided
 with the distribution.

 * The names of the contributors may not be used to endorse or
 promote products derived from this software without specific
 prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef FXAA_REDUCE_MIN
#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
#define FXAA_SPAN_MAX     8.0
#endif

//optimized version for mobile, where dependent
//texture reads can be a bottleneck
vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,
          vec2 v_rgbNW, vec2 v_rgbNE,
          vec2 v_rgbSW, vec2 v_rgbSE,
          vec2 v_rgbM) {
    vec4 color;
    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;
    vec4 texColor = texture2D(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                  dir * rcpDirMin)) * inverseVP;

    vec3 rgbA = 0.5 * (
                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, texColor.a);
    else
        color = vec4(rgbB, texColor.a);
    return color;
}

void main() {

      vec4 color;

      color = fxaa(uSampler, vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

      gl_FragColor = color;
}
`;
(function(r) {
  tx(e, r);
  function e() {
    return r.call(this, ex, rx) || this;
  }
  return e;
})(ke);
/*!
 * @pixi/filter-noise - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-noise is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Bs = function(r, e) {
  return Bs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Bs(r, e);
};
function ix(r, e) {
  Bs(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var nx = `precision highp float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform float uNoise;
uniform float uSeed;
uniform sampler2D uSampler;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    float randomValue = rand(gl_FragCoord.xy * uSeed);
    float diff = (randomValue - 0.5) * uNoise;

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    color.r += diff;
    color.g += diff;
    color.b += diff;

    // Premultiply alpha again.
    color.rgb *= color.a;

    gl_FragColor = color;
}
`;
(function(r) {
  ix(e, r);
  function e(t, i) {
    t === void 0 && (t = 0.5), i === void 0 && (i = Math.random());
    var n = r.call(this, Hl, nx, {
      uNoise: 0,
      uSeed: 0
    }) || this;
    return n.noise = t, n.seed = i, n;
  }
  return Object.defineProperty(e.prototype, "noise", {
    /**
     * The amount of noise to apply, this value should be in the range (0, 1].
     * @default 0.5
     */
    get: function() {
      return this.uniforms.uNoise;
    },
    set: function(t) {
      this.uniforms.uNoise = t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "seed", {
    /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
    get: function() {
      return this.uniforms.uSeed;
    },
    set: function(t) {
      this.uniforms.uSeed = t;
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(ke);
/*!
 * @pixi/mixin-cache-as-bitmap - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mixin-cache-as-bitmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var nc = new Pt();
wt.prototype._cacheAsBitmap = !1;
wt.prototype._cacheData = null;
wt.prototype._cacheAsBitmapResolution = null;
wt.prototype._cacheAsBitmapMultisample = gt.NONE;
var ox = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
      this.textureCacheId = null, this.originalRender = null, this.originalRenderCanvas = null, this.originalCalculateBounds = null, this.originalGetLocalBounds = null, this.originalUpdateTransform = null, this.originalDestroy = null, this.originalMask = null, this.originalFilterArea = null, this.originalContainsPoint = null, this.sprite = null;
    }
    return r;
  }()
);
Object.defineProperties(wt.prototype, {
  /**
   * The resolution to use for cacheAsBitmap. By default this will use the renderer's resolution
   * but can be overriden for performance. Lower values will reduce memory usage at the expense
   * of render quality. A falsey value of `null` or `0` will default to the renderer's resolution.
   * If `cacheAsBitmap` is set to `true`, this will re-render with the new resolution.
   * @member {number} cacheAsBitmapResolution
   * @memberof PIXI.DisplayObject#
   * @default null
   */
  cacheAsBitmapResolution: {
    get: function() {
      return this._cacheAsBitmapResolution;
    },
    set: function(r) {
      r !== this._cacheAsBitmapResolution && (this._cacheAsBitmapResolution = r, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
    }
  },
  /**
   * The number of samples to use for cacheAsBitmap. If set to `null`, the renderer's
   * sample count is used.
   * If `cacheAsBitmap` is set to `true`, this will re-render with the new number of samples.
   * @member {number} cacheAsBitmapMultisample
   * @memberof PIXI.DisplayObject#
   * @default PIXI.MSAA_QUALITY.NONE
   */
  cacheAsBitmapMultisample: {
    get: function() {
      return this._cacheAsBitmapMultisample;
    },
    set: function(r) {
      r !== this._cacheAsBitmapMultisample && (this._cacheAsBitmapMultisample = r, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
    }
  },
  /**
   * Set this to true if you want this display object to be cached as a bitmap.
   * This basically takes a snap shot of the display object as it is at that moment. It can
   * provide a performance benefit for complex static displayObjects.
   * To remove simply set this property to `false`
   *
   * IMPORTANT GOTCHA - Make sure that all your textures are preloaded BEFORE setting this property to true
   * as it will take a snapshot of what is currently there. If the textures have not loaded then they will not appear.
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   */
  cacheAsBitmap: {
    get: function() {
      return this._cacheAsBitmap;
    },
    set: function(r) {
      if (this._cacheAsBitmap !== r) {
        this._cacheAsBitmap = r;
        var e;
        r ? (this._cacheData || (this._cacheData = new ox()), e = this._cacheData, e.originalRender = this.render, e.originalRenderCanvas = this.renderCanvas, e.originalUpdateTransform = this.updateTransform, e.originalCalculateBounds = this.calculateBounds, e.originalGetLocalBounds = this.getLocalBounds, e.originalDestroy = this.destroy, e.originalContainsPoint = this.containsPoint, e.originalMask = this._mask, e.originalFilterArea = this.filterArea, this.render = this._renderCached, this.renderCanvas = this._renderCachedCanvas, this.destroy = this._cacheAsBitmapDestroy) : (e = this._cacheData, e.sprite && this._destroyCachedDisplayObject(), this.render = e.originalRender, this.renderCanvas = e.originalRenderCanvas, this.calculateBounds = e.originalCalculateBounds, this.getLocalBounds = e.originalGetLocalBounds, this.destroy = e.originalDestroy, this.updateTransform = e.originalUpdateTransform, this.containsPoint = e.originalContainsPoint, this._mask = e.originalMask, this.filterArea = e.originalFilterArea);
      }
    }
  }
});
wt.prototype._renderCached = function(r) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(r), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._render(r));
};
wt.prototype._initCachedDisplayObject = function(r) {
  var e;
  if (!(this._cacheData && this._cacheData.sprite)) {
    var t = this.alpha;
    this.alpha = 1, r.batch.flush();
    var i = this.getLocalBounds(null, !0).clone();
    if (this.filters && this.filters.length) {
      var n = this.filters[0].padding;
      i.pad(n);
    }
    i.ceil(G.RESOLUTION);
    var o = r.renderTexture.current, s = r.renderTexture.sourceFrame.clone(), a = r.renderTexture.destinationFrame.clone(), h = r.projection.transform, u = ar.create({
      width: i.width,
      height: i.height,
      resolution: this.cacheAsBitmapResolution || r.resolution,
      multisample: (e = this.cacheAsBitmapMultisample) !== null && e !== void 0 ? e : r.multisample
    }), l = "cacheAsBitmap_" + sr();
    this._cacheData.textureCacheId = l, it.addToCache(u.baseTexture, l), $.addToCache(u, l);
    var c = this.transform.localTransform.copyTo(nc).invert().translate(-i.x, -i.y);
    this.render = this._cacheData.originalRender, r.render(this, { renderTexture: u, clear: !0, transform: c, skipUpdateTransform: !1 }), r.framebuffer.blit(), r.projection.transform = h, r.renderTexture.bind(o, s, a), this.render = this._renderCached, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = t;
    var d = new Mi(u);
    d.transform.worldTransform = this.transform.worldTransform, d.anchor.x = -(i.x / i.width), d.anchor.y = -(i.y / i.height), d.alpha = t, d._bounds = this._bounds, this._cacheData.sprite = d, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.enableTempParent(), this.updateTransform(), this.disableTempParent(null)), this.containsPoint = d.containsPoint.bind(d);
  }
};
wt.prototype._renderCachedCanvas = function(r) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(r), this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._renderCanvas(r));
};
wt.prototype._initCachedDisplayObjectCanvas = function(r) {
  if (!(this._cacheData && this._cacheData.sprite)) {
    var e = this.getLocalBounds(null, !0), t = this.alpha;
    this.alpha = 1;
    var i = r.context, n = r._projTransform;
    e.ceil(G.RESOLUTION);
    var o = ar.create({ width: e.width, height: e.height }), s = "cacheAsBitmap_" + sr();
    this._cacheData.textureCacheId = s, it.addToCache(o.baseTexture, s), $.addToCache(o, s);
    var a = nc;
    this.transform.localTransform.copyTo(a), a.invert(), a.tx -= e.x, a.ty -= e.y, this.renderCanvas = this._cacheData.originalRenderCanvas, r.render(this, { renderTexture: o, clear: !0, transform: a, skipUpdateTransform: !1 }), r.context = i, r._projTransform = n, this.renderCanvas = this._renderCachedCanvas, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = t;
    var h = new Mi(o);
    h.transform.worldTransform = this.transform.worldTransform, h.anchor.x = -(e.x / e.width), h.anchor.y = -(e.y / e.height), h.alpha = t, h._bounds = this._bounds, this._cacheData.sprite = h, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.parent = r._tempDisplayObjectParent, this.updateTransform(), this.parent = null), this.containsPoint = h.containsPoint.bind(h);
  }
};
wt.prototype._calculateCachedBounds = function() {
  this._bounds.clear(), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite._calculateBounds(), this._bounds.updateID = this._boundsID;
};
wt.prototype._getCachedLocalBounds = function() {
  return this._cacheData.sprite.getLocalBounds(null);
};
wt.prototype._destroyCachedDisplayObject = function() {
  this._cacheData.sprite._texture.destroy(!0), this._cacheData.sprite = null, it.removeFromCache(this._cacheData.textureCacheId), $.removeFromCache(this._cacheData.textureCacheId), this._cacheData.textureCacheId = null;
};
wt.prototype._cacheAsBitmapDestroy = function(r) {
  this.cacheAsBitmap = !1, this.destroy(r);
};
/*!
 * @pixi/mixin-get-child-by-name - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mixin-get-child-by-name is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
wt.prototype.name = null;
le.prototype.getChildByName = function(r, e) {
  for (var t = 0, i = this.children.length; t < i; t++)
    if (this.children[t].name === r)
      return this.children[t];
  if (e)
    for (var t = 0, i = this.children.length; t < i; t++) {
      var n = this.children[t];
      if (n.getChildByName) {
        var o = n.getChildByName(r, !0);
        if (o)
          return o;
      }
    }
  return null;
};
/*!
 * @pixi/mixin-get-global-position - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mixin-get-global-position is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
wt.prototype.getGlobalPosition = function(r, e) {
  return r === void 0 && (r = new yt()), e === void 0 && (e = !1), this.parent ? this.parent.toGlobal(this.position, r, e) : (r.x = this.position.x, r.y = this.position.y), r;
};
/*!
 * @pixi/app - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/app is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var sx = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(e) {
      var t = this;
      Object.defineProperty(
        this,
        "resizeTo",
        /**
         * The HTML element or window to automatically resize the
         * renderer's view element to match width and height.
         * @member {Window|HTMLElement}
         * @name resizeTo
         * @memberof PIXI.Application#
         */
        {
          set: function(i) {
            globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = i, i && (globalThis.addEventListener("resize", this.queueResize), this.resize());
          },
          get: function() {
            return this._resizeTo;
          }
        }
      ), this.queueResize = function() {
        t._resizeTo && (t.cancelResize(), t._resizeId = requestAnimationFrame(function() {
          return t.resize();
        }));
      }, this.cancelResize = function() {
        t._resizeId && (cancelAnimationFrame(t._resizeId), t._resizeId = null);
      }, this.resize = function() {
        if (t._resizeTo) {
          t.cancelResize();
          var i, n;
          if (t._resizeTo === globalThis.window)
            i = globalThis.innerWidth, n = globalThis.innerHeight;
          else {
            var o = t._resizeTo, s = o.clientWidth, a = o.clientHeight;
            i = s, n = a;
          }
          t.renderer.resize(i, n);
        }
      }, this._resizeId = null, this._resizeTo = null, this.resizeTo = e.resizeTo || null;
    }, r.destroy = function() {
      globalThis.removeEventListener("resize", this.queueResize), this.cancelResize(), this.cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
    }, r.extension = ft.Application, r;
  }()
), ax = (
  /** @class */
  function() {
    function r(e) {
      var t = this;
      this.stage = new le(), e = Object.assign({
        forceCanvas: !1
      }, e), this.renderer = jl(e), r._plugins.forEach(function(i) {
        i.init.call(t, e);
      });
    }
    return r.registerPlugin = function(e) {
      Jt("6.5.0", "Application.registerPlugin() is deprecated, use extensions.add()"), Se.add({
        type: ft.Application,
        ref: e
      });
    }, r.prototype.render = function() {
      this.renderer.render(this.stage);
    }, Object.defineProperty(r.prototype, "view", {
      /**
       * Reference to the renderer's canvas element.
       * @member {HTMLCanvasElement}
       * @readonly
       */
      get: function() {
        return this.renderer.view;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "screen", {
      /**
       * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
       * @member {PIXI.Rectangle}
       * @readonly
       */
      get: function() {
        return this.renderer.screen;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.destroy = function(e, t) {
      var i = this, n = r._plugins.slice(0);
      n.reverse(), n.forEach(function(o) {
        o.destroy.call(i);
      }), this.stage.destroy(t), this.stage = null, this.renderer.destroy(e), this.renderer = null;
    }, r._plugins = [], r;
  }()
);
Se.handleByList(ft.Application, ax._plugins);
Se.add(sx);
/*!
 * @pixi/mesh-extras - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mesh-extras is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Gs = function(r, e) {
  return Gs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Gs(r, e);
};
function Yr(r, e) {
  Gs(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var hx = (
  /** @class */
  function(r) {
    Yr(e, r);
    function e(t, i, n, o) {
      t === void 0 && (t = 100), i === void 0 && (i = 100), n === void 0 && (n = 10), o === void 0 && (o = 10);
      var s = r.call(this) || this;
      return s.segWidth = n, s.segHeight = o, s.width = t, s.height = i, s.build(), s;
    }
    return e.prototype.build = function() {
      for (var t = this.segWidth * this.segHeight, i = [], n = [], o = [], s = this.segWidth - 1, a = this.segHeight - 1, h = this.width / s, u = this.height / a, l = 0; l < t; l++) {
        var c = l % this.segWidth, d = l / this.segWidth | 0;
        i.push(c * h, d * u), n.push(c / s, d / a);
      }
      for (var f = s * a, l = 0; l < f; l++) {
        var p = l % s, m = l / s | 0, y = m * this.segWidth + p, _ = m * this.segWidth + p + 1, g = (m + 1) * this.segWidth + p, v = (m + 1) * this.segWidth + p + 1;
        o.push(y, _, g, _, v, g);
      }
      this.buffers[0].data = new Float32Array(i), this.buffers[1].data = new Float32Array(n), this.indexBuffer.data = new Uint16Array(o), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
    }, e;
  }(Hn)
), ux = (
  /** @class */
  function(r) {
    Yr(e, r);
    function e(t, i, n) {
      t === void 0 && (t = 200), n === void 0 && (n = 0);
      var o = r.call(this, new Float32Array(i.length * 4), new Float32Array(i.length * 4), new Uint16Array((i.length - 1) * 6)) || this;
      return o.points = i, o._width = t, o.textureScale = n, o.build(), o;
    }
    return Object.defineProperty(e.prototype, "width", {
      /**
       * The width (i.e., thickness) of the rope.
       * @readonly
       */
      get: function() {
        return this._width;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.build = function() {
      var t = this.points;
      if (t) {
        var i = this.getBuffer("aVertexPosition"), n = this.getBuffer("aTextureCoord"), o = this.getIndex();
        if (!(t.length < 1)) {
          i.data.length / 4 !== t.length && (i.data = new Float32Array(t.length * 4), n.data = new Float32Array(t.length * 4), o.data = new Uint16Array((t.length - 1) * 6));
          var s = n.data, a = o.data;
          s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 1;
          for (var h = 0, u = t[0], l = this._width * this.textureScale, c = t.length, d = 0; d < c; d++) {
            var f = d * 4;
            if (this.textureScale > 0) {
              var p = u.x - t[d].x, m = u.y - t[d].y, y = Math.sqrt(p * p + m * m);
              u = t[d], h += y / l;
            } else
              h = d / (c - 1);
            s[f] = h, s[f + 1] = 0, s[f + 2] = h, s[f + 3] = 1;
          }
          for (var _ = 0, d = 0; d < c - 1; d++) {
            var f = d * 2;
            a[_++] = f, a[_++] = f + 1, a[_++] = f + 2, a[_++] = f + 2, a[_++] = f + 1, a[_++] = f + 3;
          }
          n.update(), o.update(), this.updateVertices();
        }
      }
    }, e.prototype.updateVertices = function() {
      var t = this.points;
      if (!(t.length < 1)) {
        for (var i = t[0], n, o = 0, s = 0, a = this.buffers[0].data, h = t.length, u = 0; u < h; u++) {
          var l = t[u], c = u * 4;
          u < t.length - 1 ? n = t[u + 1] : n = l, s = -(n.x - i.x), o = n.y - i.y;
          var d = Math.sqrt(o * o + s * s), f = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
          o /= d, s /= d, o *= f, s *= f, a[c] = l.x + o, a[c + 1] = l.y + s, a[c + 2] = l.x - o, a[c + 3] = l.y - s, i = l;
        }
        this.buffers[0].update();
      }
    }, e.prototype.update = function() {
      this.textureScale > 0 ? this.build() : this.updateVertices();
    }, e;
  }(Hn)
);
(function(r) {
  Yr(e, r);
  function e(t, i, n) {
    n === void 0 && (n = 0);
    var o = this, s = new ux(t.height, i, n), a = new bi(t);
    return n > 0 && (t.baseTexture.wrapMode = he.REPEAT), o = r.call(this, s, a) || this, o.autoUpdate = !0, o;
  }
  return e.prototype._render = function(t) {
    var i = this.geometry;
    (this.autoUpdate || i._width !== this.shader.texture.height) && (i._width = this.shader.texture.height, i.update()), r.prototype._render.call(this, t);
  }, e;
})(vi);
var lx = (
  /** @class */
  function(r) {
    Yr(e, r);
    function e(t, i, n) {
      var o = this, s = new hx(t.width, t.height, i, n), a = new bi($.WHITE);
      return o = r.call(this, s, a) || this, o.texture = t, o.autoResize = !0, o;
    }
    return e.prototype.textureUpdated = function() {
      this._textureID = this.shader.texture._updateID;
      var t = this.geometry, i = this.shader.texture, n = i.width, o = i.height;
      this.autoResize && (t.width !== n || t.height !== o) && (t.width = this.shader.texture.width, t.height = this.shader.texture.height, t.build());
    }, Object.defineProperty(e.prototype, "texture", {
      get: function() {
        return this.shader.texture;
      },
      set: function(t) {
        this.shader.texture !== t && (this.shader.texture = t, this._textureID = -1, t.baseTexture.valid ? this.textureUpdated() : t.once("update", this.textureUpdated, this));
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype._render = function(t) {
      this._textureID !== this.shader.texture._updateID && this.textureUpdated(), r.prototype._render.call(this, t);
    }, e.prototype.destroy = function(t) {
      this.shader.texture.off("update", this.textureUpdated, this), r.prototype.destroy.call(this, t);
    }, e;
  }(vi)
);
(function(r) {
  Yr(e, r);
  function e(t, i, n, o, s) {
    t === void 0 && (t = $.EMPTY);
    var a = this, h = new Hn(i, n, o);
    h.getBuffer("aVertexPosition").static = !1;
    var u = new bi(t);
    return a = r.call(this, h, u, null, s) || this, a.autoUpdate = !0, a;
  }
  return Object.defineProperty(e.prototype, "vertices", {
    /**
     * Collection of vertices data.
     * @type {Float32Array}
     */
    get: function() {
      return this.geometry.getBuffer("aVertexPosition").data;
    },
    set: function(t) {
      this.geometry.getBuffer("aVertexPosition").data = t;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._render = function(t) {
    this.autoUpdate && this.geometry.getBuffer("aVertexPosition").update(), r.prototype._render.call(this, t);
  }, e;
})(vi);
var hn = 10;
(function(r) {
  Yr(e, r);
  function e(t, i, n, o, s) {
    i === void 0 && (i = hn), n === void 0 && (n = hn), o === void 0 && (o = hn), s === void 0 && (s = hn);
    var a = r.call(this, $.WHITE, 4, 4) || this;
    return a._origWidth = t.orig.width, a._origHeight = t.orig.height, a._width = a._origWidth, a._height = a._origHeight, a._leftWidth = i, a._rightWidth = o, a._topHeight = n, a._bottomHeight = s, a.texture = t, a;
  }
  return e.prototype.textureUpdated = function() {
    this._textureID = this.shader.texture._updateID, this._refresh();
  }, Object.defineProperty(e.prototype, "vertices", {
    get: function() {
      return this.geometry.getBuffer("aVertexPosition").data;
    },
    set: function(t) {
      this.geometry.getBuffer("aVertexPosition").data = t;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.updateHorizontalVertices = function() {
    var t = this.vertices, i = this._getMinScale();
    t[9] = t[11] = t[13] = t[15] = this._topHeight * i, t[17] = t[19] = t[21] = t[23] = this._height - this._bottomHeight * i, t[25] = t[27] = t[29] = t[31] = this._height;
  }, e.prototype.updateVerticalVertices = function() {
    var t = this.vertices, i = this._getMinScale();
    t[2] = t[10] = t[18] = t[26] = this._leftWidth * i, t[4] = t[12] = t[20] = t[28] = this._width - this._rightWidth * i, t[6] = t[14] = t[22] = t[30] = this._width;
  }, e.prototype._getMinScale = function() {
    var t = this._leftWidth + this._rightWidth, i = this._width > t ? 1 : this._width / t, n = this._topHeight + this._bottomHeight, o = this._height > n ? 1 : this._height / n, s = Math.min(i, o);
    return s;
  }, Object.defineProperty(e.prototype, "width", {
    /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    get: function() {
      return this._width;
    },
    set: function(t) {
      this._width = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "height", {
    /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    get: function() {
      return this._height;
    },
    set: function(t) {
      this._height = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "leftWidth", {
    /** The width of the left column. */
    get: function() {
      return this._leftWidth;
    },
    set: function(t) {
      this._leftWidth = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "rightWidth", {
    /** The width of the right column. */
    get: function() {
      return this._rightWidth;
    },
    set: function(t) {
      this._rightWidth = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "topHeight", {
    /** The height of the top row. */
    get: function() {
      return this._topHeight;
    },
    set: function(t) {
      this._topHeight = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "bottomHeight", {
    /** The height of the bottom row. */
    get: function() {
      return this._bottomHeight;
    },
    set: function(t) {
      this._bottomHeight = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._refresh = function() {
    var t = this.texture, i = this.geometry.buffers[1].data;
    this._origWidth = t.orig.width, this._origHeight = t.orig.height;
    var n = 1 / this._origWidth, o = 1 / this._origHeight;
    i[0] = i[8] = i[16] = i[24] = 0, i[1] = i[3] = i[5] = i[7] = 0, i[6] = i[14] = i[22] = i[30] = 1, i[25] = i[27] = i[29] = i[31] = 1, i[2] = i[10] = i[18] = i[26] = n * this._leftWidth, i[4] = i[12] = i[20] = i[28] = 1 - n * this._rightWidth, i[9] = i[11] = i[13] = i[15] = o * this._topHeight, i[17] = i[19] = i[21] = i[23] = 1 - o * this._bottomHeight, this.updateHorizontalVertices(), this.updateVerticalVertices(), this.geometry.buffers[0].update(), this.geometry.buffers[1].update();
  }, e;
})(lx);
/*!
 * @pixi/sprite-animated - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/sprite-animated is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Us = function(r, e) {
  return Us = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Us(r, e);
};
function cx(r, e) {
  Us(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
(function(r) {
  cx(e, r);
  function e(t, i) {
    i === void 0 && (i = !0);
    var n = r.call(this, t[0] instanceof $ ? t[0] : t[0].texture) || this;
    return n._textures = null, n._durations = null, n._autoUpdate = i, n._isConnectedToTicker = !1, n.animationSpeed = 1, n.loop = !0, n.updateAnchor = !1, n.onComplete = null, n.onFrameChange = null, n.onLoop = null, n._currentTime = 0, n._playing = !1, n._previousFrame = null, n.textures = t, n;
  }
  return e.prototype.stop = function() {
    this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (Ft.shared.remove(this.update, this), this._isConnectedToTicker = !1));
  }, e.prototype.play = function() {
    this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (Ft.shared.add(this.update, this, be.HIGH), this._isConnectedToTicker = !0));
  }, e.prototype.gotoAndStop = function(t) {
    this.stop();
    var i = this.currentFrame;
    this._currentTime = t, i !== this.currentFrame && this.updateTexture();
  }, e.prototype.gotoAndPlay = function(t) {
    var i = this.currentFrame;
    this._currentTime = t, i !== this.currentFrame && this.updateTexture(), this.play();
  }, e.prototype.update = function(t) {
    if (this._playing) {
      var i = this.animationSpeed * t, n = this.currentFrame;
      if (this._durations !== null) {
        var o = this._currentTime % 1 * this._durations[this.currentFrame];
        for (o += i / 60 * 1e3; o < 0; )
          this._currentTime--, o += this._durations[this.currentFrame];
        var s = Math.sign(this.animationSpeed * t);
        for (this._currentTime = Math.floor(this._currentTime); o >= this._durations[this.currentFrame]; )
          o -= this._durations[this.currentFrame] * s, this._currentTime += s;
        this._currentTime += o / this._durations[this.currentFrame];
      } else
        this._currentTime += i;
      this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : n !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < n ? this.onLoop() : this.animationSpeed < 0 && this.currentFrame > n && this.onLoop()), this.updateTexture());
    }
  }, e.prototype.updateTexture = function() {
    var t = this.currentFrame;
    this._previousFrame !== t && (this._previousFrame = t, this._texture = this._textures[t], this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this.uvs = this._texture._uvs.uvsFloat32, this.updateAnchor && this._anchor.copyFrom(this._texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame));
  }, e.prototype.destroy = function(t) {
    this.stop(), r.prototype.destroy.call(this, t), this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
  }, e.fromFrames = function(t) {
    for (var i = [], n = 0; n < t.length; ++n)
      i.push($.from(t[n]));
    return new e(i);
  }, e.fromImages = function(t) {
    for (var i = [], n = 0; n < t.length; ++n)
      i.push($.from(t[n]));
    return new e(i);
  }, Object.defineProperty(e.prototype, "totalFrames", {
    /**
     * The total number of frames in the AnimatedSprite. This is the same as number of textures
     * assigned to the AnimatedSprite.
     * @readonly
     * @default 0
     */
    get: function() {
      return this._textures.length;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "textures", {
    /** The array of textures used for this AnimatedSprite. */
    get: function() {
      return this._textures;
    },
    set: function(t) {
      if (t[0] instanceof $)
        this._textures = t, this._durations = null;
      else {
        this._textures = [], this._durations = [];
        for (var i = 0; i < t.length; i++)
          this._textures.push(t[i].texture), this._durations.push(t[i].time);
      }
      this._previousFrame = null, this.gotoAndStop(0), this.updateTexture();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "currentFrame", {
    /**
     * The AnimatedSprites current frame index.
     * @readonly
     */
    get: function() {
      var t = Math.floor(this._currentTime) % this._textures.length;
      return t < 0 && (t += this._textures.length), t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "playing", {
    /**
     * Indicates if the AnimatedSprite is currently playing.
     * @readonly
     */
    get: function() {
      return this._playing;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "autoUpdate", {
    /** Whether to use PIXI.Ticker.shared to auto update animation time. */
    get: function() {
      return this._autoUpdate;
    },
    set: function(t) {
      t !== this._autoUpdate && (this._autoUpdate = t, !this._autoUpdate && this._isConnectedToTicker ? (Ft.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (Ft.shared.add(this.update, this), this._isConnectedToTicker = !0));
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(Mi);
/*!
 * pixi.js - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
Se.add(
  // Install renderer plugins
  z0,
  eb,
  J0,
  zb,
  T1,
  Vl,
  P1,
  // Install loader plugins
  X1,
  gb,
  Hb,
  Yb,
  A1,
  // Install application plugins
  dv,
  ub
);
var ge = /* @__PURE__ */ ((r) => (r.ELLIPSE = "ELLIPSE", r.POLYGON = "POLYGON", r.RECTANGLE = "RECTANGLE", r))(ge || {});
const pa = (r, e) => e, dx = {
  area: (r) => Math.PI * r.geometry.rx * r.geometry.ry,
  intersects: (r, e, t) => {
    const { cx: i, cy: n, rx: o, ry: s } = r.geometry, a = 0, h = Math.cos(a), u = Math.sin(a), l = e - i, c = t - n, d = h * l + u * c, f = u * l - h * c;
    return d * d / (o * o) + f * f / (s * s) <= 1;
  }
};
pa(ge.ELLIPSE, dx);
const fx = {
  area: (r) => {
    const { points: e } = r.geometry;
    let t = 0, i = e.length - 1;
    for (let n = 0; n < e.length; n++)
      t += (e[i][0] + e[n][0]) * (e[i][1] - e[n][1]), i = n;
    return Math.abs(0.5 * t);
  },
  intersects: (r, e, t) => {
    const { points: i } = r.geometry;
    let n = !1;
    for (let o = 0, s = i.length - 1; o < i.length; s = o++) {
      const a = i[o][0], h = i[o][1], u = i[s][0], l = i[s][1];
      h > t != l > t && e < (u - a) * (t - h) / (l - h) + a && (n = !n);
    }
    return n;
  }
};
pa(ge.POLYGON, fx);
const px = {
  area: (r) => r.geometry.w * r.geometry.h,
  intersects: (r, e, t) => e >= r.geometry.x && e <= r.geometry.x + r.geometry.w && t >= r.geometry.y && t <= r.geometry.y + r.geometry.h
};
pa(ge.RECTANGLE, px);
let un;
const mx = new Uint8Array(16);
function yx() {
  if (!un && (un = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !un))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return un(mx);
}
const Ct = [];
for (let r = 0; r < 256; ++r)
  Ct.push((r + 256).toString(16).slice(1));
function _x(r, e = 0) {
  return Ct[r[e + 0]] + Ct[r[e + 1]] + Ct[r[e + 2]] + Ct[r[e + 3]] + "-" + Ct[r[e + 4]] + Ct[r[e + 5]] + "-" + Ct[r[e + 6]] + Ct[r[e + 7]] + "-" + Ct[r[e + 8]] + Ct[r[e + 9]] + "-" + Ct[r[e + 10]] + Ct[r[e + 11]] + Ct[r[e + 12]] + Ct[r[e + 13]] + Ct[r[e + 14]] + Ct[r[e + 15]];
}
const gx = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), gu = {
  randomUUID: gx
};
function vx(r, e, t) {
  if (gu.randomUUID && !e && !r)
    return gu.randomUUID();
  r = r || {};
  const i = r.random || (r.rng || yx)();
  if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, e) {
    t = t || 0;
    for (let n = 0; n < 16; ++n)
      e[t + n] = i[n];
    return e;
  }
  return _x(i);
}
ge.RECTANGLE, ge.POLYGON;
const bx = (r, e) => {
  const t = typeof e == "function" ? e(r) : e;
  if (t) {
    const { fill: i, fillOpacity: n } = t;
    let o = "";
    return i && (o += `fill:${i};stroke:${i};`), o += `fill-opacity:${n || "0.25"};`, o;
  }
};
function xx(r, e, t) {
  let i;
  const n = Js();
  let { annotation: o } = e, { editor: s } = e, { style: a = void 0 } = e, { target: h } = e, { transform: u } = e, { viewportScale: l } = e, c;
  return Gn(() => (t(6, c = new s({
    target: h,
    props: {
      shape: o.target.selector,
      computedStyle: i,
      transform: u,
      viewportScale: l
    }
  })), c.$on("change", (d) => {
    c.$$set({ shape: d.detail }), n("change", d.detail);
  }), c.$on("grab", (d) => n("grab", d.detail)), c.$on("release", (d) => n("release", d.detail)), () => {
    c.$destroy();
  })), r.$$set = (d) => {
    "annotation" in d && t(0, o = d.annotation), "editor" in d && t(1, s = d.editor), "style" in d && t(2, a = d.style), "target" in d && t(3, h = d.target), "transform" in d && t(4, u = d.transform), "viewportScale" in d && t(5, l = d.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation, style*/
    5 && (i = bx(o, a)), r.$$.dirty & /*annotation, editorComponent*/
    65 && o && (c == null || c.$set({ shape: o.target.selector })), r.$$.dirty & /*editorComponent, transform*/
    80 && c && c.$set({ transform: u }), r.$$.dirty & /*editorComponent, viewportScale*/
    96 && c && c.$set({ viewportScale: l });
  }, [o, s, a, h, u, l, c];
}
class Tx extends Ae {
  constructor(e) {
    super(), Ee(this, e, xx, null, ee, {
      annotation: 0,
      editor: 1,
      style: 2,
      target: 3,
      transform: 4,
      viewportScale: 5
    });
  }
}
const Ex = (r) => {
  let e, t;
  if (r.nodeName === "CANVAS")
    e = r, t = e.getContext("2d", { willReadFrequently: !0 });
  else {
    const n = r;
    e = document.createElement("canvas"), e.width = n.width, e.height = n.height, t = e.getContext("2d", { willReadFrequently: !0 }), t.drawImage(n, 0, 0, n.width, n.height);
  }
  let i = 0;
  for (let n = 1; n < 10; n++)
    for (let o = 1; o < 10; o++) {
      const s = Math.round(o * e.width / 10), a = Math.round(n * e.height / 10), h = t.getImageData(s, a, 1, 1).data, u = (0.299 * h[0] + 0.587 * h[1] + 0.114 * h[2]) / 255;
      i += u;
    }
  return i / 81;
}, Ax = (r) => {
  const e = Ex(r), t = e > 0.6 ? "dark" : "light";
  return console.log(`[Annotorious] Image brightness: ${e.toFixed(1)}. Setting ${t} theme.`), t;
};
navigator.userAgent.indexOf("Mac OS X");
const Sx = 1733608, wx = 0.25;
let Pe = !1, ks;
const Xs = (r) => {
  const e = {
    tint: r != null && r.fill ? Rn(r.fill) : Sx,
    alpha: (r == null ? void 0 : r.fillOpacity) === void 0 ? wx : Math.min(r.fillOpacity, 1)
  }, t = {
    tint: (r == null ? void 0 : r.stroke) && Rn(r.stroke),
    alpha: (r == null ? void 0 : r.strokeOpacity) === void 0 ? 0 : Math.min(r.strokeOpacity, 1),
    lineWidth: r != null && r.stroke ? (r == null ? void 0 : r.strokeWidth) || 1 : 0
  };
  return { fillStyle: e, strokeStyle: t };
}, ma = (r) => (e, t, i) => {
  const { fillStyle: n, strokeStyle: o } = Xs(i), s = new hr();
  s.beginFill(16777215), r(t, s), s.endFill(), s.tint = n.tint, s.alpha = n.alpha, e.addChild(s);
  const a = new hr();
  return a.lineStyle(o.lineWidth / ks, 16777215, 1, 0.5, o.lineWidth === 1), r(t, a), a.tint = o.tint, a.alpha = o.alpha, e.addChild(a), { fill: s, stroke: a, strokeWidth: o.lineWidth };
}, Ox = ma((r, e) => {
  const { cx: t, cy: i, rx: n, ry: o } = r.geometry;
  e.drawEllipse(t, i, n, o);
}), Rx = ma((r, e) => {
  const t = r.geometry.points.reduce((i, n) => [...i, ...n], []);
  e.drawPolygon(t);
}), Px = ma((r, e) => {
  const { x: t, y: i, w: n, h: o } = r.geometry;
  e.drawRect(t, i, n, o);
}), Mx = (r, e, t, i) => () => {
  const n = r.viewport.viewportToImageRectangle(r.viewport.getBounds(!0)), o = r.viewport.getContainerSize().x, s = r.viewport.getZoom(!0) * o / r.world.getContentFactor();
  s !== ks && !Pe && (Pe = !0, t.forEach(({ stroke: d, strokeWidth: f }) => {
    const { lineStyle: p } = d.geometry.graphicsData[0];
    f > 1 ? (Pe = !1, p.width = f / s, d.geometry.invalidate()) : f === 1 && !p.native && (p.width = 1, p.native = !0, d.geometry.invalidate());
  })), ks = s;
  const a = Math.PI * r.viewport.getRotation() / 180, h = -n.x * s, u = -n.y * s;
  let l, c;
  a > 0 && a <= Math.PI / 2 ? (l = n.height * s, c = 0) : a > Math.PI / 2 && a <= Math.PI ? (l = n.width * s, c = n.height * s) : a > Math.PI && a <= Math.PI * 1.5 ? (l = 0, c = n.width * s) : (l = 0, c = 0), e.position.x = l + h * Math.cos(a) - u * Math.sin(a), e.position.y = c + h * Math.sin(a) + u * Math.cos(a), e.scale.set(s, s), e.rotation = a, i.render(e);
}, Ix = (r, e) => {
  const t = new hr(), i = jl({
    width: e.width,
    height: e.height,
    backgroundAlpha: 0,
    view: e,
    antialias: !0,
    resolution: 2
  }), n = /* @__PURE__ */ new Map();
  let o = /* @__PURE__ */ new Set(), s;
  const a = (p) => {
    Pe = !1;
    const { selector: m } = p.target, y = typeof s == "function" ? s(p) : s;
    let _;
    m.type === ge.RECTANGLE ? _ = Px(t, m, y) : m.type === ge.POLYGON ? _ = Rx(t, m, y) : m.type === ge.ELLIPSE ? _ = Ox(t, m, y) : console.warn(`Unsupported shape type: ${m.type}`), _ && n.set(p.id, { annotation: p, ..._ });
  }, h = (p) => {
    const m = n.get(p.id);
    m && (n.delete(p.id), m.fill.destroy(), m.stroke.destroy());
  }, u = (p, m) => {
    Pe = !1;
    const y = n.get(p.id);
    y && (n.delete(p.id), y.fill.destroy(), y.stroke.destroy(), a(m));
  }, l = (p, m) => {
    i.resize(p, m), i.render(t);
  }, c = (p) => {
    Pe = !1;
    const { children: m } = t;
    n.forEach(({ fill: y, stroke: _, annotation: g }) => {
      const v = p ? o.has(g.id) || p(g) : !0;
      v && !m.includes(y) ? (t.addChild(y), t.addChild(_)) : !v && m.includes(y) && (t.removeChild(y), t.removeChild(_));
    }), i.render(t);
  }, d = (p) => {
    const { selected: m } = p;
    o = new Set(m.map((y) => y.id));
  }, f = (p) => {
    if (typeof p == "function")
      n.forEach(({ annotation: m, fill: y, stroke: _, strokeWidth: g }, v) => {
        g > 1 && (Pe = !1);
        const { fillStyle: b, strokeStyle: T } = Xs(p(m));
        y.tint = b.tint, y.alpha = b.alpha, _.tint = T.tint, _.alpha = T.alpha, n.set(m.id, { annotation: m, fill: y, stroke: _, strokeWidth: g });
      });
    else {
      const { fillStyle: m, strokeStyle: y } = Xs(p);
      y.lineWidth > 1 && (Pe = !1), n.forEach(({ annotation: _, fill: g, stroke: v, strokeWidth: b }, T) => {
        g.tint = m.tint, g.alpha = m.alpha, v.tint = y.tint, v.alpha = y.alpha, n.set(_.id, { annotation: _, fill: g, stroke: v, strokeWidth: b });
      });
    }
    s = p, i.render(t);
  };
  return {
    addAnnotation: a,
    destroy: () => i.destroy(),
    redraw: Mx(r, t, n, i),
    removeAnnotation: h,
    resize: l,
    setFilter: c,
    setSelected: d,
    setStyle: f,
    updateAnnotation: u
  };
};
function Dx(r, e, t) {
  let i, n, { filter: o = void 0 } = e, { state: s } = e, { style: a = void 0 } = e, { viewer: h } = e;
  const { store: u, hover: l, selection: c, viewport: d } = s;
  Yo(r, l, (T) => t(10, i = T)), Yo(r, c, (T) => t(7, n = T));
  const f = Js();
  let p, m = !1;
  const y = (T) => {
    const S = new _n.Point(T.x, T.y), { x: w, y: A } = h.viewport.pointFromPixel(S);
    return h.viewport.viewportToImageCoordinates(w, A);
  }, _ = (T) => (S) => {
    const { x: w, y: A } = y(new _n.Point(S.offsetX, S.offsetY)), x = u.getAt(w, A);
    x && (!o || o(x)) ? (T.classList.add("hover"), i !== x.id && l.set(x.id)) : (T.classList.remove("hover"), i && l.set(null));
  }, g = (T) => {
    const S = T.originalEvent;
    if (!m) {
      const { x: w, y: A } = y(T.position), x = u.getAt(w, A);
      x ? f("click", { originalEvent: S, annotation: x }) : f("click", { originalEvent: S });
    }
    m = !1;
  }, v = () => m = !0;
  let b;
  return Gn(() => {
    const { offsetWidth: T, offsetHeight: S } = h.canvas, w = document.createElement("canvas");
    w.width = T, w.height = S, w.className = "a9s-gl-canvas", h.element.querySelector(".openseadragon-canvas").appendChild(w), t(6, p = Ix(h, w));
    const A = _(w);
    w.addEventListener("pointermove", A), new ResizeObserver((E) => {
      try {
        const { width: O, height: P } = E[0].contentRect;
        w.width = O, w.height = P, p.resize(O, P);
      } catch {
        console.warn("WebGL canvas already disposed");
      }
    }).observe(w);
    const x = () => {
      const E = h.viewport.getBounds();
      b = h.viewport.viewportToImageRectangle(E);
      const { x: O, y: P, width: M, height: F } = b, D = u.getIntersecting(O, P, M, F);
      d.set(D.map((C) => C.id));
    };
    return h.addHandler("canvas-drag", v), h.addHandler("canvas-release", g), h.addHandler("update-viewport", p.redraw), h.addHandler("animation-finish", x), () => {
      w.removeEventListener("pointermove", A), h.removeHandler("canvas-drag", v), h.removeHandler("canvas-release", g), h.removeHandler("update-viewport", p.redraw), h.removeHandler("animation-finish", x), p.destroy(), w.parentNode.removeChild(w);
    };
  }), u.observe((T) => {
    const { created: S, updated: w, deleted: A } = T.changes;
    if (S.forEach((x) => p.addAnnotation(x)), w.forEach(({ oldValue: x, newValue: E }) => p.updateAnnotation(x, E)), A.forEach((x) => p.removeAnnotation(x)), b) {
      const { x, y: E, width: O, height: P } = b, M = u.getIntersecting(x, E, O, P);
      d.set(M.map((F) => F.id));
    } else
      d.set(u.all().map((x) => x.id));
    p.redraw();
  }), r.$$set = (T) => {
    "filter" in T && t(2, o = T.filter), "state" in T && t(3, s = T.state), "style" in T && t(4, a = T.style), "viewer" in T && t(5, h = T.viewer);
  }, r.$$.update = () => {
    r.$$.dirty & /*stage, filter*/
    68 && (p == null || p.setFilter(o)), r.$$.dirty & /*stage, $selection*/
    192 && (p == null || p.setSelected(n)), r.$$.dirty & /*stage, style*/
    80 && (p == null || p.setStyle(a));
  }, [l, c, o, s, a, h, p, n];
}
class Cx extends Ae {
  constructor(e) {
    super(), Ee(this, e, Dx, null, ee, { filter: 2, state: 3, style: 4, viewer: 5 });
  }
}
const Nx = (r) => ({
  transform: r & /*layerTransform*/
  2,
  scale: r & /*scale*/
  1
}), vu = (r) => ({
  transform: (
    /*layerTransform*/
    r[1]
  ),
  scale: (
    /*scale*/
    r[0]
  )
});
function Fx(r) {
  let e;
  const t = (
    /*#slots*/
    r[4].default
  ), i = jd(
    t,
    r,
    /*$$scope*/
    r[3],
    vu
  );
  return {
    c() {
      i && i.c();
    },
    m(n, o) {
      i && i.m(n, o), e = !0;
    },
    p(n, [o]) {
      i && i.p && (!e || o & /*$$scope, layerTransform, scale*/
      11) && Yd(
        i,
        t,
        n,
        /*$$scope*/
        n[3],
        e ? Hd(
          t,
          /*$$scope*/
          n[3],
          o,
          Nx
        ) : Vd(
          /*$$scope*/
          n[3]
        ),
        vu
      );
    },
    i(n) {
      e || (ut(i, n), e = !0);
    },
    o(n) {
      _t(i, n), e = !1;
    },
    d(n) {
      i && i.d(n);
    }
  };
}
function Lx(r, e, t) {
  let { $$slots: i = {}, $$scope: n } = e, { viewer: o } = e, s = 1, a;
  const h = () => {
    const u = o.viewport.getContainerSize().x, l = o.viewport.getZoom(!0), c = o.viewport.getFlip(), d = o.viewport.pixelFromPoint(new _n.Point(0, 0), !0);
    c && (d.x = u - d.x);
    const f = l * u / o.world.getContentFactor(), p = c ? -f : f, m = o.viewport.getRotation();
    t(1, a = `translate(${d.x}, ${d.y}) scale(${p}, ${f}) rotate(${m})`), t(0, s = l * u / o.world.getContentFactor());
  };
  return Gn(() => (o.addHandler("update-viewport", h), () => {
    o.removeHandler("update-viewport", h);
  })), r.$$set = (u) => {
    "viewer" in u && t(2, o = u.viewer), "$$scope" in u && t(3, n = u.$$scope);
  }, [s, a, o, n, i];
}
class oc extends Ae {
  constructor(e) {
    super(), Ee(this, e, Lx, Fx, ee, { viewer: 2 });
  }
}
function Bx(r, e, t) {
  const i = Js();
  let { drawingMode: n } = e, { target: o } = e, { tool: s } = e, { transform: a } = e, { viewer: h } = e, { viewportScale: u } = e, l;
  return Gn(() => {
    const c = o.closest("svg"), d = [], f = (p, m, y) => {
      if (c.addEventListener(p, m, y), d.push(() => c.removeEventListener(p, m, y)), p === "pointerup" || p === "dblclick") {
        const _ = (v) => {
          const { originalEvent: b } = v;
          m(b);
        }, g = p === "pointerup" ? "canvas-click" : "canvas-double-click";
        h.addHandler(g, _), d.push(() => h.removeHandler(g, _));
      } else if (p === "pointermove") {
        const _ = (g) => {
          const { originalEvent: v } = g;
          m(v);
        };
        h.addHandler("canvas-drag", _), d.push(() => h.removeHandler("canvas-drag", _));
      }
    };
    return t(6, l = new s({
      target: o,
      props: {
        addEventListener: f,
        drawingMode: n,
        transform: a,
        viewportScale: u
      }
    })), l.$on("create", (p) => i("create", p.detail)), () => {
      d.forEach((p) => p()), l.$destroy();
    };
  }), r.$$set = (c) => {
    "drawingMode" in c && t(0, n = c.drawingMode), "target" in c && t(1, o = c.target), "tool" in c && t(2, s = c.tool), "transform" in c && t(3, a = c.transform), "viewer" in c && t(4, h = c.viewer), "viewportScale" in c && t(5, u = c.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*toolComponent, transform*/
    72 && l && l.$set({ transform: a }), r.$$.dirty & /*toolComponent, viewportScale*/
    96 && l && l.$set({ viewportScale: u });
  }, [n, o, s, a, h, u, l];
}
class Gx extends Ae {
  constructor(e) {
    super(), Ee(this, e, Bx, null, ee, {
      drawingMode: 0,
      target: 1,
      tool: 2,
      transform: 3,
      viewer: 4,
      viewportScale: 5
    });
  }
}
function bu(r, e, t) {
  const i = r.slice();
  return i[24] = e[t], i;
}
function Ux(r) {
  let e = (
    /*toolName*/
    r[1]
  ), t, i, n = xu(r);
  return {
    c() {
      n.c(), t = jr();
    },
    m(o, s) {
      n.m(o, s), re(o, t, s), i = !0;
    },
    p(o, s) {
      s & /*toolName*/
      2 && ee(e, e = /*toolName*/
      o[1]) ? (Le(), _t(n, 1, 1, Ne), Be(), n = xu(o), n.c(), ut(n, 1), n.m(t.parentNode, t)) : n.p(o, s);
    },
    i(o) {
      i || (ut(n), i = !0);
    },
    o(o) {
      _t(n), i = !1;
    },
    d(o) {
      o && Ht(t), n.d(o);
    }
  };
}
function kx(r) {
  let e, t, i = (
    /*editableAnnotations*/
    r[5]
  ), n = [];
  for (let s = 0; s < i.length; s += 1)
    n[s] = Eu(bu(r, i, s));
  const o = (s) => _t(n[s], 1, 1, () => {
    n[s] = null;
  });
  return {
    c() {
      for (let s = 0; s < n.length; s += 1)
        n[s].c();
      e = jr();
    },
    m(s, a) {
      for (let h = 0; h < n.length; h += 1)
        n[h] && n[h].m(s, a);
      re(s, e, a), t = !0;
    },
    p(s, a) {
      if (a & /*editableAnnotations, drawingEl, getEditor, toolTransform, scale, onGrab, onChangeSelected, onRelease*/
      8392496) {
        i = /*editableAnnotations*/
        s[5];
        let h;
        for (h = 0; h < i.length; h += 1) {
          const u = bu(s, i, h);
          n[h] ? (n[h].p(u, a), ut(n[h], 1)) : (n[h] = Eu(u), n[h].c(), ut(n[h], 1), n[h].m(e.parentNode, e));
        }
        for (Le(), h = i.length; h < n.length; h += 1)
          o(h);
        Be();
      }
    },
    i(s) {
      if (!t) {
        for (let a = 0; a < i.length; a += 1)
          ut(n[a]);
        t = !0;
      }
    },
    o(s) {
      n = n.filter(Boolean);
      for (let a = 0; a < n.length; a += 1)
        _t(n[a]);
      t = !1;
    },
    d(s) {
      Vu(n, s), s && Ht(e);
    }
  };
}
function xu(r) {
  let e, t;
  return e = new Gx({
    props: {
      target: (
        /*drawingEl*/
        r[4]
      ),
      tool: (
        /*tool*/
        r[6]
      ),
      drawingMode: (
        /*drawingMode*/
        r[3]
      ),
      transform: { elementToImage: (
        /*toolTransform*/
        r[8]
      ) },
      viewer: (
        /*viewer*/
        r[2]
      ),
      viewportScale: (
        /*scale*/
        r[23]
      )
    }
  }), e.$on(
    "create",
    /*onSelectionCreated*/
    r[12]
  ), {
    c() {
      Ge(e.$$.fragment);
    },
    m(i, n) {
      xe(e, i, n), t = !0;
    },
    p(i, n) {
      const o = {};
      n & /*drawingEl*/
      16 && (o.target = /*drawingEl*/
      i[4]), n & /*tool*/
      64 && (o.tool = /*tool*/
      i[6]), n & /*drawingMode*/
      8 && (o.drawingMode = /*drawingMode*/
      i[3]), n & /*viewer*/
      4 && (o.viewer = /*viewer*/
      i[2]), n & /*scale*/
      8388608 && (o.viewportScale = /*scale*/
      i[23]), e.$set(o);
    },
    i(i) {
      t || (ut(e.$$.fragment, i), t = !0);
    },
    o(i) {
      _t(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Te(e, i);
    }
  };
}
function Tu(r) {
  let e, t;
  return e = new Tx({
    props: {
      target: (
        /*drawingEl*/
        r[4]
      ),
      editor: Pa(
        /*editable*/
        r[24].target.selector
      ),
      annotation: (
        /*editable*/
        r[24]
      ),
      transform: { elementToImage: (
        /*toolTransform*/
        r[8]
      ) },
      viewportScale: (
        /*scale*/
        r[23]
      )
    }
  }), e.$on(
    "grab",
    /*onGrab*/
    r[9]
  ), e.$on("change", function() {
    Ks(
      /*onChangeSelected*/
      r[11](
        /*editable*/
        r[24]
      )
    ) && r[11](
      /*editable*/
      r[24]
    ).apply(this, arguments);
  }), e.$on(
    "release",
    /*onRelease*/
    r[10]
  ), {
    c() {
      Ge(e.$$.fragment);
    },
    m(i, n) {
      xe(e, i, n), t = !0;
    },
    p(i, n) {
      r = i;
      const o = {};
      n & /*drawingEl*/
      16 && (o.target = /*drawingEl*/
      r[4]), n & /*editableAnnotations*/
      32 && (o.editor = Pa(
        /*editable*/
        r[24].target.selector
      )), n & /*editableAnnotations*/
      32 && (o.annotation = /*editable*/
      r[24]), n & /*scale*/
      8388608 && (o.viewportScale = /*scale*/
      r[23]), e.$set(o);
    },
    i(i) {
      t || (ut(e.$$.fragment, i), t = !0);
    },
    o(i) {
      _t(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Te(e, i);
    }
  };
}
function Eu(r) {
  let e = (
    /*editable*/
    r[24].id
  ), t, i, n = Tu(r);
  return {
    c() {
      n.c(), t = jr();
    },
    m(o, s) {
      n.m(o, s), re(o, t, s), i = !0;
    },
    p(o, s) {
      s & /*editableAnnotations*/
      32 && ee(e, e = /*editable*/
      o[24].id) ? (Le(), _t(n, 1, 1, Ne), Be(), n = Tu(o), n.c(), ut(n, 1), n.m(t.parentNode, t)) : n.p(o, s);
    },
    i(o) {
      i || (ut(n), i = !0);
    },
    o(o) {
      _t(n), i = !1;
    },
    d(o) {
      o && Ht(t), n.d(o);
    }
  };
}
function Xx(r) {
  let e, t, i, n, o, s;
  const a = [kx, Ux], h = [];
  function u(l, c) {
    return (
      /*drawingEl*/
      l[4] && /*editableAnnotations*/
      l[5] ? 0 : (
        /*drawingEl*/
        l[4] && /*tool*/
        l[6] && /*drawingEnabled*/
        l[0] ? 1 : -1
      )
    );
  }
  return ~(i = u(r)) && (n = h[i] = a[i](r)), {
    c() {
      e = Kt("svg"), t = Kt("g"), n && n.c(), Y(t, "transform", o = /*transform*/
      r[22]), Y(t, "class", "svelte-190cqdf"), Y(e, "class", "a9s-annotationlayer a9s-osd-drawinglayer svelte-190cqdf"), Ba(
        e,
        "drawing",
        /*drawingEnabled*/
        r[0]
      );
    },
    m(l, c) {
      re(l, e, c), Qe(e, t), ~i && h[i].m(t, null), r[18](t), s = !0;
    },
    p(l, c) {
      let d = i;
      i = u(l), i === d ? ~i && h[i].p(l, c) : (n && (Le(), _t(h[d], 1, 1, () => {
        h[d] = null;
      }), Be()), ~i ? (n = h[i], n ? n.p(l, c) : (n = h[i] = a[i](l), n.c()), ut(n, 1), n.m(t, null)) : n = null), (!s || c & /*transform*/
      4194304 && o !== (o = /*transform*/
      l[22])) && Y(t, "transform", o), (!s || c & /*drawingEnabled*/
      1) && Ba(
        e,
        "drawing",
        /*drawingEnabled*/
        l[0]
      );
    },
    i(l) {
      s || (ut(n), s = !0);
    },
    o(l) {
      _t(n), s = !1;
    },
    d(l) {
      l && Ht(e), ~i && h[i].d(), r[18](null);
    }
  };
}
function jx(r) {
  let e, t;
  return e = new oc({
    props: {
      viewer: (
        /*viewer*/
        r[2]
      ),
      $$slots: {
        default: [
          Xx,
          ({ transform: i, scale: n }) => ({ 22: i, 23: n }),
          ({ transform: i, scale: n }) => (i ? 4194304 : 0) | (n ? 8388608 : 0)
        ]
      },
      $$scope: { ctx: r }
    }
  }), {
    c() {
      Ge(e.$$.fragment);
    },
    m(i, n) {
      xe(e, i, n), t = !0;
    },
    p(i, [n]) {
      const o = {};
      n & /*viewer*/
      4 && (o.viewer = /*viewer*/
      i[2]), n & /*$$scope, drawingEnabled, transform, drawingEl, editableAnnotations, scale, toolName, tool, drawingMode, viewer*/
      146800767 && (o.$$scope = { dirty: n, ctx: i }), e.$set(o);
    },
    i(i) {
      t || (ut(e.$$.fragment, i), t = !0);
    },
    o(i) {
      _t(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Te(e, i);
    }
  };
}
function Hx(r, e, t) {
  let i, n, o, s, { drawingEnabled: a } = e, { preferredDrawingMode: h } = e, { state: u } = e, { toolName: l = Ho().length > 0 ? Ho()[0] : void 0 } = e, { user: c } = e, { viewer: d } = e, f;
  const { store: p, selection: m } = u;
  Yo(r, m, (x) => t(17, s = x));
  let y = null, _ = null;
  const g = (x) => {
    p.unobserve(y);
    const E = x.filter(({ editable: O }) => O).map(({ id: O }) => O);
    E.length > 0 ? (t(5, _ = E.map((O) => p.getAnnotation(O))), y = (O) => {
      const { updated: P } = O.changes;
      t(5, _ = P.map((M) => M.newValue));
    }, p.observe(y, { annotations: E })) : t(5, _ = null);
  }, v = (x, E) => {
    const { x: O, y: P } = d.viewport.viewerElementToImageCoordinates(new _n.Point(x, E));
    return [O, P];
  }, b = () => d.setMouseNavEnabled(!1), T = () => d.setMouseNavEnabled(!0), S = (x) => (E) => {
    var O;
    const { target: P } = x, M = 10 * 60 * 1e3, F = ((O = P.creator) == null ? void 0 : O.id) !== c.id || !P.created || (/* @__PURE__ */ new Date()).getTime() - P.created.getTime() > M;
    p.updateTarget({
      ...P,
      selector: E.detail,
      created: F ? P.created : /* @__PURE__ */ new Date(),
      updated: F ? /* @__PURE__ */ new Date() : null,
      updatedBy: F ? c : null
    });
  }, w = (x) => {
    const E = vx(), O = {
      id: E,
      bodies: [],
      target: {
        annotation: E,
        selector: x.detail,
        creator: c,
        created: /* @__PURE__ */ new Date()
      }
    };
    p.addAnnotation(O), m.setSelected(O.id), d.setMouseNavEnabled(!0);
  };
  function A(x) {
    vn[x ? "unshift" : "push"](() => {
      f = x, t(4, f);
    });
  }
  return r.$$set = (x) => {
    "drawingEnabled" in x && t(0, a = x.drawingEnabled), "preferredDrawingMode" in x && t(13, h = x.preferredDrawingMode), "state" in x && t(14, u = x.state), "toolName" in x && t(1, l = x.toolName), "user" in x && t(15, c = x.user), "viewer" in x && t(2, d = x.viewer);
  }, r.$$.update = () => {
    r.$$.dirty & /*toolName*/
    2 && t(6, { tool: i, opts: n } = Xu(l), i, (t(16, n), t(1, l))), r.$$.dirty & /*opts, preferredDrawingMode*/
    73728 && t(3, o = (n == null ? void 0 : n.drawingMode) || h), r.$$.dirty & /*drawingEnabled, drawingMode, viewer*/
    13 && (a && o === "drag" ? d.setMouseNavEnabled(!1) : d.setMouseNavEnabled(!0)), r.$$.dirty & /*drawingEnabled*/
    1 && a && m.clear(), r.$$.dirty & /*$selection, drawingMode, drawingEnabled, viewer*/
    131085 && s.selected.length === 0 && o === "drag" && a && d.setMouseNavEnabled(!1), r.$$.dirty & /*$selection*/
    131072 && g(s.selected);
  }, [
    a,
    l,
    d,
    o,
    f,
    _,
    i,
    m,
    v,
    b,
    T,
    S,
    w,
    h,
    u,
    c,
    n,
    s,
    A
  ];
}
class Yx extends Ae {
  constructor(e) {
    super(), Ee(this, e, Hx, jx, ee, {
      drawingEnabled: 0,
      preferredDrawingMode: 13,
      state: 14,
      toolName: 1,
      user: 15,
      viewer: 2
    });
  }
}
function Vx(r) {
  let e, t, i, n, o, s, a, h = (
    /*user*/
    r[2].appearance.label + ""
  ), u, l, c, d;
  return {
    c() {
      e = Kt("g"), t = Kt("rect"), a = Kt("text"), u = $u(h), Y(t, "class", "a9s-presence-label-bg svelte-1rehw2p"), Y(
        t,
        "x",
        /*x*/
        r[0]
      ), Y(t, "y", i = /*y*/
      r[1] - 18 / /*scale*/
      r[3]), Y(t, "height", n = 18 / /*scale*/
      r[3]), Y(t, "fill", o = /*user*/
      r[2].appearance.color), Y(t, "stroke", s = /*user*/
      r[2].appearance.color), Y(a, "font-size", l = 12 / /*scale*/
      r[3]), Y(a, "x", c = /*x*/
      r[0] + Math.round(5 / /*scale*/
      r[3])), Y(a, "y", d = /*y*/
      r[1] - 5 / /*scale*/
      r[3]), Y(a, "class", "svelte-1rehw2p"), Y(e, "class", "a9s-presence-label");
    },
    m(f, p) {
      re(f, e, p), Qe(e, t), Qe(e, a), Qe(a, u), r[6](e);
    },
    p(f, [p]) {
      p & /*x*/
      1 && Y(
        t,
        "x",
        /*x*/
        f[0]
      ), p & /*y, scale*/
      10 && i !== (i = /*y*/
      f[1] - 18 / /*scale*/
      f[3]) && Y(t, "y", i), p & /*scale*/
      8 && n !== (n = 18 / /*scale*/
      f[3]) && Y(t, "height", n), p & /*user*/
      4 && o !== (o = /*user*/
      f[2].appearance.color) && Y(t, "fill", o), p & /*user*/
      4 && s !== (s = /*user*/
      f[2].appearance.color) && Y(t, "stroke", s), p & /*user*/
      4 && h !== (h = /*user*/
      f[2].appearance.label + "") && Wd(u, h), p & /*scale*/
      8 && l !== (l = 12 / /*scale*/
      f[3]) && Y(a, "font-size", l), p & /*x, scale*/
      9 && c !== (c = /*x*/
      f[0] + Math.round(5 / /*scale*/
      f[3])) && Y(a, "x", c), p & /*y, scale*/
      10 && d !== (d = /*y*/
      f[1] - 5 / /*scale*/
      f[3]) && Y(a, "y", d);
    },
    i: Ne,
    o: Ne,
    d(f) {
      f && Ht(e), r[6](null);
    }
  };
}
function $x(r, e, t) {
  let { x: i } = e, { y: n } = e, { user: o } = e, { scale: s } = e, { hAlign: a = null } = e, h;
  const u = (c) => {
    const d = h.querySelector("text"), f = h.querySelector("rect"), p = d.getBBox().width + 10 / c;
    a === "CENTER" && h.setAttribute("style", `transform: translateX(-${p / 2}px)`), f.setAttribute("width", `${p}`);
  };
  function l(c) {
    vn[c ? "unshift" : "push"](() => {
      h = c, t(4, h);
    });
  }
  return r.$$set = (c) => {
    "x" in c && t(0, i = c.x), "y" in c && t(1, n = c.y), "user" in c && t(2, o = c.user), "scale" in c && t(3, s = c.scale), "hAlign" in c && t(5, a = c.hAlign);
  }, r.$$.update = () => {
    r.$$.dirty & /*g, scale*/
    24 && h && u(s);
  }, [i, n, o, s, h, a, l];
}
class sc extends Ae {
  constructor(e) {
    super(), Ee(this, e, $x, Vx, ee, { x: 0, y: 1, user: 2, scale: 3, hAlign: 5 });
  }
}
function zx(r) {
  let e, t, i, n, o, s;
  return t = new sc({
    props: {
      scale: (
        /*scale*/
        r[1]
      ),
      user: (
        /*user*/
        r[0]
      ),
      x: (
        /*origin*/
        r[3][0]
      ),
      y: (
        /*origin*/
        r[3][1]
      ),
      hAlign: "CENTER"
    }
  }), {
    c() {
      e = Kt("g"), Ge(t.$$.fragment), i = Kt("polygon"), Y(i, "class", "a9s-presence-shape a9s-presence-polygon svelte-fgq4n0"), Y(i, "stroke", n = /*user*/
      r[0].appearance.color), Y(i, "fill", "transparent"), Y(i, "points", o = /*geom*/
      r[2].points.map(Au).join(" ")), Y(e, "class", "a9s-presence-overlay");
    },
    m(a, h) {
      re(a, e, h), xe(t, e, null), Qe(e, i), s = !0;
    },
    p(a, [h]) {
      const u = {};
      h & /*scale*/
      2 && (u.scale = /*scale*/
      a[1]), h & /*user*/
      1 && (u.user = /*user*/
      a[0]), h & /*origin*/
      8 && (u.x = /*origin*/
      a[3][0]), h & /*origin*/
      8 && (u.y = /*origin*/
      a[3][1]), t.$set(u), (!s || h & /*user*/
      1 && n !== (n = /*user*/
      a[0].appearance.color)) && Y(i, "stroke", n), (!s || h & /*geom*/
      4 && o !== (o = /*geom*/
      a[2].points.map(Au).join(" "))) && Y(i, "points", o);
    },
    i(a) {
      s || (ut(t.$$.fragment, a), s = !0);
    },
    o(a) {
      _t(t.$$.fragment, a), s = !1;
    },
    d(a) {
      a && Ht(e), Te(t);
    }
  };
}
const Au = (r) => r.join(",");
function Wx(r, e, t) {
  let i, n, { annotation: o } = e, { user: s } = e, { scale: a } = e;
  const h = (u) => {
    let [l, ...c] = u.points;
    return c.forEach(([d, f]) => {
      f < l[1] && (l = [d, f]);
    }), l;
  };
  return r.$$set = (u) => {
    "annotation" in u && t(4, o = u.annotation), "user" in u && t(0, s = u.user), "scale" in u && t(1, a = u.scale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation*/
    16 && t(2, i = o.target.selector.geometry), r.$$.dirty & /*geom*/
    4 && t(3, n = h(i));
  }, [s, a, i, n, o];
}
class qx extends Ae {
  constructor(e) {
    super(), Ee(this, e, Wx, zx, ee, { annotation: 4, user: 0, scale: 1 });
  }
}
function Kx(r) {
  let e, t, i, n, o, s, a, h, u;
  return t = new sc({
    props: {
      scale: (
        /*scale*/
        r[1]
      ),
      user: (
        /*user*/
        r[0]
      ),
      x: (
        /*geom*/
        r[2].x
      ),
      y: (
        /*geom*/
        r[2].y
      )
    }
  }), {
    c() {
      e = Kt("g"), Ge(t.$$.fragment), i = Kt("rect"), Y(i, "class", "a9s-presence-shape a9s-presence-rectangle svelte-gze948"), Y(i, "stroke", n = /*user*/
      r[0].appearance.color), Y(i, "fill", "transparent"), Y(i, "x", o = /*geom*/
      r[2].x), Y(i, "y", s = /*geom*/
      r[2].y), Y(i, "width", a = /*geom*/
      r[2].w), Y(i, "height", h = /*geom*/
      r[2].h), Y(e, "class", "a9s-presence-overlay");
    },
    m(l, c) {
      re(l, e, c), xe(t, e, null), Qe(e, i), u = !0;
    },
    p(l, [c]) {
      const d = {};
      c & /*scale*/
      2 && (d.scale = /*scale*/
      l[1]), c & /*user*/
      1 && (d.user = /*user*/
      l[0]), c & /*geom*/
      4 && (d.x = /*geom*/
      l[2].x), c & /*geom*/
      4 && (d.y = /*geom*/
      l[2].y), t.$set(d), (!u || c & /*user*/
      1 && n !== (n = /*user*/
      l[0].appearance.color)) && Y(i, "stroke", n), (!u || c & /*geom*/
      4 && o !== (o = /*geom*/
      l[2].x)) && Y(i, "x", o), (!u || c & /*geom*/
      4 && s !== (s = /*geom*/
      l[2].y)) && Y(i, "y", s), (!u || c & /*geom*/
      4 && a !== (a = /*geom*/
      l[2].w)) && Y(i, "width", a), (!u || c & /*geom*/
      4 && h !== (h = /*geom*/
      l[2].h)) && Y(i, "height", h);
    },
    i(l) {
      u || (ut(t.$$.fragment, l), u = !0);
    },
    o(l) {
      _t(t.$$.fragment, l), u = !1;
    },
    d(l) {
      l && Ht(e), Te(t);
    }
  };
}
function Zx(r, e, t) {
  let i, { annotation: n } = e, { user: o } = e, { scale: s } = e;
  return r.$$set = (a) => {
    "annotation" in a && t(3, n = a.annotation), "user" in a && t(0, o = a.user), "scale" in a && t(1, s = a.scale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation*/
    8 && t(2, i = n.target.selector.geometry);
  }, [o, s, i, n];
}
class Jx extends Ae {
  constructor(e) {
    super(), Ee(this, e, Zx, Kx, ee, { annotation: 3, user: 0, scale: 1 });
  }
}
const { Boolean: Qx } = $d;
function Su(r, e, t) {
  const i = r.slice();
  return i[8] = e[t], i;
}
function wu(r) {
  let e, t;
  return e = new oc({
    props: {
      viewer: (
        /*viewer*/
        r[0]
      ),
      $$slots: {
        default: [
          rT,
          ({ transform: i, scale: n }) => ({ 6: i, 7: n }),
          ({ transform: i, scale: n }) => (i ? 64 : 0) | (n ? 128 : 0)
        ]
      },
      $$scope: { ctx: r }
    }
  }), {
    c() {
      Ge(e.$$.fragment);
    },
    m(i, n) {
      xe(e, i, n), t = !0;
    },
    p(i, n) {
      const o = {};
      n & /*viewer*/
      1 && (o.viewer = /*viewer*/
      i[0]), n & /*$$scope, transform, trackedAnnotations, scale*/
      2244 && (o.$$scope = { dirty: n, ctx: i }), e.$set(o);
    },
    i(i) {
      t || (ut(e.$$.fragment, i), t = !0);
    },
    o(i) {
      _t(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Te(e, i);
    }
  };
}
function Ou(r) {
  let e, t, i = (
    /*trackedAnnotations*/
    r[2]
  ), n = [];
  for (let s = 0; s < i.length; s += 1)
    n[s] = Ru(Su(r, i, s));
  const o = (s) => _t(n[s], 1, 1, () => {
    n[s] = null;
  });
  return {
    c() {
      for (let s = 0; s < n.length; s += 1)
        n[s].c();
      e = jr();
    },
    m(s, a) {
      for (let h = 0; h < n.length; h += 1)
        n[h] && n[h].m(s, a);
      re(s, e, a), t = !0;
    },
    p(s, a) {
      if (a & /*trackedAnnotations, scale, ShapeType*/
      132) {
        i = /*trackedAnnotations*/
        s[2];
        let h;
        for (h = 0; h < i.length; h += 1) {
          const u = Su(s, i, h);
          n[h] ? (n[h].p(u, a), ut(n[h], 1)) : (n[h] = Ru(u), n[h].c(), ut(n[h], 1), n[h].m(e.parentNode, e));
        }
        for (Le(), h = i.length; h < n.length; h += 1)
          o(h);
        Be();
      }
    },
    i(s) {
      if (!t) {
        for (let a = 0; a < i.length; a += 1)
          ut(n[a]);
        t = !0;
      }
    },
    o(s) {
      n = n.filter(Qx);
      for (let a = 0; a < n.length; a += 1)
        _t(n[a]);
      t = !1;
    },
    d(s) {
      Vu(n, s), s && Ht(e);
    }
  };
}
function tT(r) {
  let e, t;
  return e = new qx({
    props: {
      annotation: (
        /*tracked*/
        r[8].annotation
      ),
      user: (
        /*tracked*/
        r[8].selectedBy
      ),
      scale: (
        /*scale*/
        r[7]
      )
    }
  }), {
    c() {
      Ge(e.$$.fragment);
    },
    m(i, n) {
      xe(e, i, n), t = !0;
    },
    p(i, n) {
      const o = {};
      n & /*trackedAnnotations*/
      4 && (o.annotation = /*tracked*/
      i[8].annotation), n & /*trackedAnnotations*/
      4 && (o.user = /*tracked*/
      i[8].selectedBy), n & /*scale*/
      128 && (o.scale = /*scale*/
      i[7]), e.$set(o);
    },
    i(i) {
      t || (ut(e.$$.fragment, i), t = !0);
    },
    o(i) {
      _t(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Te(e, i);
    }
  };
}
function eT(r) {
  let e, t;
  return e = new Jx({
    props: {
      annotation: (
        /*tracked*/
        r[8].annotation
      ),
      user: (
        /*tracked*/
        r[8].selectedBy
      ),
      scale: (
        /*scale*/
        r[7]
      )
    }
  }), {
    c() {
      Ge(e.$$.fragment);
    },
    m(i, n) {
      xe(e, i, n), t = !0;
    },
    p(i, n) {
      const o = {};
      n & /*trackedAnnotations*/
      4 && (o.annotation = /*tracked*/
      i[8].annotation), n & /*trackedAnnotations*/
      4 && (o.user = /*tracked*/
      i[8].selectedBy), n & /*scale*/
      128 && (o.scale = /*scale*/
      i[7]), e.$set(o);
    },
    i(i) {
      t || (ut(e.$$.fragment, i), t = !0);
    },
    o(i) {
      _t(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Te(e, i);
    }
  };
}
function Ru(r) {
  let e, t, i, n;
  const o = [eT, tT], s = [];
  function a(h, u) {
    return (
      /*tracked*/
      h[8].annotation.target.selector.type === jt.RECTANGLE ? 0 : (
        /*tracked*/
        h[8].annotation.target.selector.type === jt.POLYGON ? 1 : -1
      )
    );
  }
  return ~(e = a(r)) && (t = s[e] = o[e](r)), {
    c() {
      t && t.c(), i = jr();
    },
    m(h, u) {
      ~e && s[e].m(h, u), re(h, i, u), n = !0;
    },
    p(h, u) {
      let l = e;
      e = a(h), e === l ? ~e && s[e].p(h, u) : (t && (Le(), _t(s[l], 1, 1, () => {
        s[l] = null;
      }), Be()), ~e ? (t = s[e], t ? t.p(h, u) : (t = s[e] = o[e](h), t.c()), ut(t, 1), t.m(i.parentNode, i)) : t = null);
    },
    i(h) {
      n || (ut(t), n = !0);
    },
    o(h) {
      _t(t), n = !1;
    },
    d(h) {
      ~e && s[e].d(h), h && Ht(i);
    }
  };
}
function rT(r) {
  let e, t, i, n, o = (
    /*trackedAnnotations*/
    r[2].length > 0 && Ou(r)
  );
  return {
    c() {
      e = Kt("svg"), t = Kt("g"), o && o.c(), Y(t, "transform", i = /*transform*/
      r[6]), Y(e, "class", "a9s-osd-presencelayer svelte-1krwc4m");
    },
    m(s, a) {
      re(s, e, a), Qe(e, t), o && o.m(t, null), n = !0;
    },
    p(s, a) {
      s[2].length > 0 ? o ? (o.p(s, a), a & /*trackedAnnotations*/
      4 && ut(o, 1)) : (o = Ou(s), o.c(), ut(o, 1), o.m(t, null)) : o && (Le(), _t(o, 1, 1, () => {
        o = null;
      }), Be()), (!n || a & /*transform*/
      64 && i !== (i = /*transform*/
      s[6])) && Y(t, "transform", i);
    },
    i(s) {
      n || (ut(o), n = !0);
    },
    o(s) {
      _t(o), n = !1;
    },
    d(s) {
      s && Ht(e), o && o.d();
    }
  };
}
function iT(r) {
  let e = !!/*provider*/
  r[1], t, i, n = e && wu(r);
  return {
    c() {
      n && n.c(), t = jr();
    },
    m(o, s) {
      n && n.m(o, s), re(o, t, s), i = !0;
    },
    p(o, [s]) {
      s & /*provider*/
      2 && (e = !!/*provider*/
      o[1]), e ? n ? (n.p(o, s), s & /*provider*/
      2 && ut(n, 1)) : (n = wu(o), n.c(), ut(n, 1), n.m(t.parentNode, t)) : n && (Le(), _t(n, 1, 1, () => {
        n = null;
      }), Be());
    },
    i(o) {
      i || (ut(n), i = !0);
    },
    o(o) {
      _t(n), i = !1;
    },
    d(o) {
      n && n.d(o), o && Ht(t);
    }
  };
}
function nT(r, e, t) {
  let { store: i } = e, { viewer: n } = e, { provider: o = null } = e, s = [], a = null;
  const h = (u, l) => {
    t(2, s = [
      ...s.filter(({ selectedBy: c }) => c.presenceKey !== u.presenceKey),
      ...(l || []).map((c) => ({
        // Warning - could be undefined!
        annotation: i.getAnnotation(c),
        selectedBy: u
      }))
    ].filter(({ annotation: c }) => (c || console.warn("Selection event on unknown annotation"), !!c))), a && i.unobserve(a), a = (c) => {
      const { deleted: d, updated: f } = c.changes, p = new Set(d.map((y) => y.id)), m = s.filter(({ annotation: y }) => !p.has(y.id)).map((y) => {
        const _ = f.find((g) => g.oldValue.id === y.annotation.id);
        return _ ? {
          selectedBy: y.selectedBy,
          annotation: _.newValue
        } : y;
      });
      t(2, s = m);
    }, i.observe(a, {
      annotations: s.map((c) => c.annotation.id)
    });
  };
  return Kd(() => {
    a && i.unobserve(a);
  }), r.$$set = (u) => {
    "store" in u && t(3, i = u.store), "viewer" in u && t(0, n = u.viewer), "provider" in u && t(1, o = u.provider);
  }, r.$$.update = () => {
    r.$$.dirty & /*provider*/
    2 && o && o.on("selectionChange", h);
  }, [n, o, s, i];
}
class oT extends Ae {
  constructor(e) {
    super(), Ee(this, e, nT, iT, ee, { store: 3, viewer: 0, provider: 1 });
  }
}
const Pu = (r, e) => {
  e === "auto" ? r.addHandler("open", (t) => {
    const i = r.world.getItemCount();
    r.world.getItemAt(i - 1).addOnceHandler("fully-loaded-change", (n) => {
      const { fullyLoaded: o } = n;
      if (o) {
        const s = r.canvas.querySelector("canvas"), a = Ax(s);
        r.element.setAttribute("data-theme", a);
      }
    });
  }) : r.element.setAttribute("data-theme", e);
}, ac = (r, e, t) => (i, n = {}) => {
  const o = typeof i == "string" ? i : i.id, s = e.getAnnotation(o);
  if (!s)
    return;
  const a = r.container.getBoundingClientRect(), { padding: h } = n;
  let [u, l, c, d] = h ? Array.isArray(h) ? h : [h, h, h, h] : [0, 0, 0, 0];
  u = u / a.height, l = l / a.width, c = c / a.height, d = d / a.width;
  const { minX: f, minY: p, maxX: m, maxY: y } = s.target.selector.geometry.bounds, _ = m - f, g = y - p, v = f - d * _, b = p - u * g, T = _ + (l + d) * _, S = g + (u + c) * g, w = r.viewport.imageToViewportRectangle(v, b, T, S);
  r.viewport[t](w, n.immediately);
}, sT = (r, e) => ac(r, e, "fitBounds"), aT = (r, e) => ac(r, e, "fitBoundsWithConstraints"), uT = (r, e = {}) => {
  const t = Bd(e, {
    drawingEnabled: !1,
    drawingMode: "click",
    pointerSelectAction: Mu.EDIT,
    theme: "light"
  }), i = Ld(t), { hover: n, selection: o, store: s } = i, a = _c(s), h = gc(
    i,
    a,
    t.adapter,
    t.autoSave
  );
  let u = Sc(), l = t.drawingEnabled, c = t.drawingMode;
  const d = Gd(a, r.element), f = new Cx({
    target: r.element,
    props: {
      state: i,
      viewer: r,
      style: t.style
    }
  }), p = new oT({
    target: r.element.querySelector(".openseadragon-canvas"),
    props: {
      store: s,
      viewer: r,
      provider: null
    }
  }), m = new Yx({
    target: r.element.querySelector(".openseadragon-canvas"),
    props: {
      drawingEnabled: l,
      preferredDrawingMode: c,
      state: i,
      user: u,
      viewer: r
    }
  });
  f.$on("click", (F) => {
    const { originalEvent: D, annotation: C } = F.detail;
    C && !(c === "click" && l) ? o.clickSelect(C.id, D) : o.isEmpty() || o.clear();
  }), r.element.addEventListener("pointerdown", (F) => {
    if (n.current) {
      const D = s.getAnnotation(n.current);
      h.emit("clickAnnotation", D, F);
    }
  }), Pu(r, t.theme);
  const y = bc(i, a, t.adapter), _ = () => {
    f.$destroy(), p.$destroy(), m.$destroy(), d.destroy(), a.destroy();
  }, g = sT(r, s), v = aT(r, s), b = () => u, T = (F, D, C) => wd(F, D, C), S = (F, D) => md(F, D), w = (F) => {
    if (!Xu(F))
      throw `No drawing tool named ${F}`;
    m.$set({ toolName: F });
  }, A = (F) => {
    l = F, m.$set({ drawingEnabled: l });
  }, x = (F) => f.$set({ filter: F }), E = (F) => f.$set({ style: F }), O = (F) => p.$set({ provider: F }), P = (F) => Pu(r, F), M = (F) => {
    u = F, m.$set({ user: F });
  };
  return {
    ...y,
    destroy: _,
    fitBounds: g,
    fitBoundsWithConstraints: v,
    getUser: b,
    listDrawingTools: Ho,
    on: h.on,
    off: h.off,
    registerDrawingTool: T,
    registerShapeEditor: S,
    setDrawingEnabled: A,
    setDrawingTool: w,
    setFilter: x,
    setPresenceProvider: O,
    setStyle: E,
    setTheme: P,
    setUser: M,
    state: i,
    viewer: r
  };
};
export {
  uT as createOSDAnnotator
};
//# sourceMappingURL=annotorious-react-osd.es6.js.map
