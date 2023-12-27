import { jsx as s } from "./annotorious-react.es12.js";
import { forwardRef as g } from "react";
import { useDraggable as i } from "./annotorious-react.es14.js";
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
//# sourceMappingURL=annotorious-react.es4.js.map
