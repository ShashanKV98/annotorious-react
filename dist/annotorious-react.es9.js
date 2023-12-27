import { j as d } from "./annotorious-react.es12.js";
import { createContext as u, useState as w, useContext as l, useEffect as n } from "react";
import { createOSDAnnotator as m } from "@annotorious/openseadragon";
import { AnnotoriousContext as x } from "./annotorious-react.es2.js";
const s = u({ viewer: null, setViewer: null }), y = (e) => {
  const { children: g, tool: i, ...c } = e, [o, f] = w(), { anno: t, setAnno: a } = l(x);
  return n(() => {
    if (o) {
      const r = m(o, c);
      return e.tool && r.setDrawingTool(e.tool), a(r), () => {
        r.destroy(), a(void 0);
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
  }, [e.style]), /* @__PURE__ */ d.jsx(s.Provider, { value: { viewer: o, setViewer: f }, children: e.children });
}, C = () => {
  const { viewer: e } = l(s);
  return e;
};
export {
  y as OpenSeadragonAnnotator,
  s as OpenSeadragonAnnotatorContext,
  C as useViewer
};
//# sourceMappingURL=annotorious-react.es9.js.map
