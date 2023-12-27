import { jsx as s } from "./annotorious-react-osd.es5.js";
import { forwardRef as g } from "react";
import { useDraggable as i } from "./annotorious-react-osd.es13.js";
const d = g((r, o) => {
  const { children: a, className: t, onDragStart: n, onDragEnd: e } = r;
  return i(o, { onDragStart: n, onDragEnd: e, cancel: "button, .no-drag" }), /* @__PURE__ */ s(
    "div",
    {
      ref: o,
      className: t,
      style: { position: "absolute" },
      children: a
    }
  );
});
export {
  d as Draggable
};
//# sourceMappingURL=annotorious-react-osd.es7.js.map
