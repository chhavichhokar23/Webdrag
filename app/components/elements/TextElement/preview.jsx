export default function TextPreview({ config }) {
  return (
    <div
      style={{
        width: config.defaultProps.width,
        height: config.defaultProps.height,
        fontSize: config.defaultProps.fontSize,
        fontWeight: config.defaultProps.fontWeight,
        fontFamily: config.defaultProps.fontFamily,
        color: config.defaultProps.color,
        backgroundColor: config.defaultProps.backgroundColor,
        padding: `${config.defaultProps.padding}px`,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {config.defaultProps.text}
    </div>
  )
}