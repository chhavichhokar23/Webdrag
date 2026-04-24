export default function InputElement({ el, isPreview, getShadow, onChange }) {
  return (
    <input
      id={`element-${el.id}`}
      placeholder={el.placeholder}
      value={el.value ?? ""}
      onChange={(e) => {
        if (onChange) onChange({ value: e.target.value })
      }}
      style={{
        width: "100%",
        height: "100%",
        fontSize: el.fontSize,
        fontWeight: el.fontWeight,
        fontStyle: el.fontStyle,
        textAlign: el.textAlign,
        letterSpacing: el.letterSpacing,
        color: el.color,
        backgroundColor: el.backgroundColor,
        border: `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}`,
        borderRadius: el.borderRadius,
        padding: el.padding,
        opacity: el.opacity / 100,
        boxShadow: getShadow(el.boxShadow),
        boxSizing: "border-box",
        outline: "none",
        cursor: isPreview ? "text" : "inherit",
      }}
    />
  )
}