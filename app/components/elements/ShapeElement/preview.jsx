import { shapeList } from "./shapes"

export default function ShapePreview({ config }) {
  const d = config.defaultProps
  const entry = shapeList.find(s => s.name === d.shape)
  const Shape = entry?.component

  return (
    <div
      style={{
        width: d.width,
        height: d.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: d.backgroundColor,
        borderRadius: d.borderRadius,
        padding: d.padding,
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      {Shape && (
        <Shape
          color={d.color}
          borderColor={d.strokeColor}
          borderWidth={d.strokeWidth}
          borderRadius={d.shapeRadius}
        />
      )}
    </div>
  )
}
