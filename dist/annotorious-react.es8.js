var f = /* @__PURE__ */ ((t) => (t.EDIT = "EDIT", t.SELECT = "SELECT", t.NONE = "NONE", t))(f || {});
let c;
const p = new Uint8Array(16);
function g() {
  if (!c && (c = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !c))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return c(p);
}
const o = [];
for (let t = 0; t < 256; ++t)
  o.push((t + 256).toString(16).slice(1));
function y(t, r = 0) {
  return o[t[r + 0]] + o[t[r + 1]] + o[t[r + 2]] + o[t[r + 3]] + "-" + o[t[r + 4]] + o[t[r + 5]] + "-" + o[t[r + 6]] + o[t[r + 7]] + "-" + o[t[r + 8]] + o[t[r + 9]] + "-" + o[t[r + 10]] + o[t[r + 11]] + o[t[r + 12]] + o[t[r + 13]] + o[t[r + 14]] + o[t[r + 15]];
}
const m = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), i = {
  randomUUID: m
};
function U(t, r, e) {
  if (i.randomUUID && !r && !t)
    return i.randomUUID();
  t = t || {};
  const a = t.random || (t.rng || g)();
  if (a[6] = a[6] & 15 | 64, a[8] = a[8] & 63 | 128, r) {
    e = e || 0;
    for (let n = 0; n < 16; ++n)
      r[e + n] = a[n];
    return r;
  }
  return y(a);
}
const O = (t, r, e, a) => ({
  id: U(),
  annotation: t.id,
  created: e || /* @__PURE__ */ new Date(),
  creator: a,
  ...r
});
var h = /* @__PURE__ */ ((t) => (t.LOCAL = "LOCAL", t.REMOTE = "REMOTE", t))(h || {});
let E = (t) => crypto.getRandomValues(new Uint8Array(t)), R = (t, r, e) => {
  let a = (2 << Math.log(t.length - 1) / Math.LN2) - 1, n = -~(1.6 * a * r / t.length);
  return (d = r) => {
    let s = "";
    for (; ; ) {
      let l = e(n), u = n;
      for (; u--; )
        if (s += t[l[u] & a] || "", s.length === d)
          return s;
    }
  };
}, w = (t, r = 21) => R(t, r, E), C = (t = 21) => crypto.getRandomValues(new Uint8Array(t)).reduce((r, e) => (e &= 63, e < 36 ? r += e.toString(36) : e < 62 ? r += (e - 26).toString(36).toUpperCase() : e > 62 ? r += "-" : r += "_", r), "");
const b = () => ({ isGuest: !0, id: w("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_", 20)() }), D = [
  "#ff7c00",
  // orange
  "#1ac938",
  // green
  "#e8000b",
  // red
  "#8b2be2",
  // purple
  "#9f4800",
  // brown
  "#f14cc1",
  // pink
  "#ffc400",
  // khaki
  "#00d7ff",
  // cyan
  "#023eff"
  // blue
], A = () => {
  const t = [...D];
  return { assignRandomColor: () => {
    const r = Math.floor(Math.random() * t.length), e = t[r];
    return t.splice(r, 1), e;
  }, releaseColor: (r) => t.push(r) };
};
C();
export {
  h as Origin,
  f as PointerSelectAction,
  b as createAnonymousGuest,
  O as createBody,
  A as defaultColorProvider
};
//# sourceMappingURL=annotorious-react.es8.js.map
