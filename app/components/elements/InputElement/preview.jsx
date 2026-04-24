export default function InputPreview({ config }) {
  return (
    <input
      placeholder={config.defaultProps.placeholder}
      readOnly
      style={{
        width: config.defaultProps.width,
        height: config.defaultProps.height,
        fontSize: config.defaultProps.fontSize,
        borderRadius: config.defaultProps.borderRadius,
        backgroundColor: config.defaultProps.backgroundColor,
        border: `${config.defaultProps.borderWidth}px ${config.defaultProps.borderStyle} ${config.defaultProps.borderColor}`,
        padding: "0 8px",
        boxSizing: "border-box",
        pointerEvents: "none",
        display: "block",
      }}
    />
  )
}