export default function ButtonElement({ el, isPreview, getShadow, onAction }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        if (isPreview) {
          onAction(el.action)
        }
      }}
      style={{
        width: "100%",
        height: "100%",
        fontSize: el.fontSize,
        fontWeight: el.fontWeight,
        fontStyle: el.fontStyle,
        textAlign: el.textAlign,
        letterSpacing: el.letterSpacing,
        textTransform: el.textTransform,
        color: el.color,
        backgroundColor: el.backgroundColor,
        border: `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}`,
        borderRadius: el.borderRadius,
        padding: el.padding,
        opacity: el.opacity / 100,
        boxShadow: getShadow(el.boxShadow),
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent:
          el.textAlign === "left" ? "flex-start"
          : el.textAlign === "right" ? "flex-end"
          : "center",
      }}
    >
      {el.label}
    </button>
  )
}
