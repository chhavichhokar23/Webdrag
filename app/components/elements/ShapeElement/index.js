import { shapeList } from "./shapes"

export default function ShapeElement({ el, getShadow }) {
  const entry = shapeList.find(s => s.name === el.shape)
  const Shape = entry?.component

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: el.backgroundColor,
        borderRadius: el.borderRadius,
        padding: el.padding ?? 8,
        opacity: (el.opacity ?? 100) / 100,
        boxShadow: getShadow?.(el.boxShadow),
        boxSizing: "border-box",
      }}
    >
      {Shape ? (
        <Shape
          color={el.color ?? "#3b82f6"}
          borderColor={el.strokeColor ?? "#1d4ed8"}
          borderWidth={el.strokeWidth ?? 0}
          borderRadius={el.shapeRadius ?? 4}
        />
      ) : (
        <span style={{ fontSize: 10, color: "#999" }}>?</span>
      )}
    </div>
  )
}
