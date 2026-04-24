export default function ImagePreview({ config }) {
  return (
    <div
      style={{
        width: config.defaultProps.width,
        height: config.defaultProps.height,
        borderRadius: config.defaultProps.borderRadius,
        overflow: "hidden",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      {config.defaultProps.src ? (
        <img
          src={config.defaultProps.src}
          alt={config.defaultProps.alt}
          style={{ width: "100%", height: "100%", objectFit: config.defaultProps.objectFit, display: "block" }}
          onError={(e) => { e.target.style.display = "none" }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6", color: "#9ca3af", fontSize: 11 }}>
          No image
        </div>
      )}
    </div>
  )
}