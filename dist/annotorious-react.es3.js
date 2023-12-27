import { useEffect as i } from "react";
import { useAnnotator as s } from "./annotorious-react.es2.js";
const m = (t) => {
  const { plugin: u, opts: r } = t, n = s();
  return i(() => {
    if (n) {
      const o = u(n, r);
      return () => {
        o && "unmount" in o && o.unmount();
      };
    }
  }, [n]), null;
};
export {
  m as AnnotoriousPlugin
};
//# sourceMappingURL=annotorious-react.es3.js.map
