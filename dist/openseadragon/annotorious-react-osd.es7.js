import { j as e } from "./annotorious-react-osd.es5.js";
import { forwardRef as g } from "react";
import { useDraggable as i } from "./annotorious-react-osd.es9.js";
const p = g((r, o) => {
  const { children: t, className: a, onDragStart: s, onDragEnd: n } = r;
  return i(o, { onDragStart: s, onDragEnd: n, cancel: "button, .no-drag" }), /* @__PURE__ */ e.jsx(
    "div",
    {
      ref: o,
      className: a,
      style: { position: "absolute" },
      children: t
    }
  );
});
export {
  p as Draggable
};
//# sourceMappingURL=annotorious-react-osd.es7.js.map
