import { jsx as d } from "./annotorious-react-osd.es5.js";
import { createContext as u, useState as w, useContext as a, useEffect as n } from "react";
import { createOSDAnnotator as m } from "@annotorious/openseadragon";
import { AnnotoriousContext as g } from "./annotorious-react-osd.es6.js";
const s = u({ viewer: null, setViewer: null }), C = (e) => {
  const { children: v, tool: i, ...c } = e, [o, f] = w(), { anno: t, setAnno: l } = a(g);
  return n(() => {
    if (o) {
      const r = m(o, c);
      return e.tool && r.setDrawingTool(e.tool), l(r), () => {
        r.destroy(), l(void 0);
      };
    }
  }, [o]), n(() => {
    t && t.setDrawingTool(i);
  }, [i]), n(() => {
    t && t.setDrawingEnabled(e.drawingEnabled);
  }, [e.drawingEnabled]), n(() => {
    t && t.setFilter(e.filter);
  }, [e.filter]), n(() => {
    t && t.setStyle(e.style);
  }, [e.style]), /* @__PURE__ */ d(s.Provider, { value: { viewer: o, setViewer: f }, children: e.children });
}, D = () => {
  const { viewer: e } = a(s);
  return e;
};
export {
  C as OpenSeadragonAnnotator,
  s as OpenSeadragonAnnotatorContext,
  D as useViewer
};
//# sourceMappingURL=annotorious-react-osd.es2.js.map
