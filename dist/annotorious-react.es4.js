import { j as e } from "./annotorious-react.es12.js";
import { forwardRef as g } from "react";
import { useDraggable as i } from "./annotorious-react.es14.js";
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
//# sourceMappingURL=annotorious-react.es4.js.map
