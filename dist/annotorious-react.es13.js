import { useState as c, useRef as n, useEffect as s } from "react";
const m = (e, t) => {
  const [u, o] = c(e), r = n();
  return s(() => (r.current = setTimeout(() => o(e), t), () => {
    clearTimeout(r.current);
  }), [e, t]), u;
};
export {
  m as useDebounce
};
//# sourceMappingURL=annotorious-react.es13.js.map
