export default function ButtonPreview({ config }) {
  return (
    <button
      style={{
        width: config.defaultProps.width,
        height: config.defaultProps.height,
        fontSize: config.defaultProps.fontSize,
        borderRadius: config.defaultProps.borderRadius,
        backgroundColor: config.defaultProps.backgroundColor,
        color: config.defaultProps.color,
        border: "none",
        pointerEvents: "none",
        display: "block",
        cursor: "grab",
      }}
    >
      {config.defaultProps.label}
    </button>
  )
}