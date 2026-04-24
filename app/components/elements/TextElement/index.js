import { useRef, useEffect } from "react"

export default function TextElement({ el, isPreview, getShadow, onChange, isEditing, onEditStart, onEditEnd }) {
  const textRef = useRef(null)

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus()
      // place cursor at end
      const range = document.createRange()
      range.selectNodeContents(textRef.current)
      range.collapse(false)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [isEditing])

  return (
    <div
      ref={textRef}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={(e) => {
        e.stopPropagation()
        if (!isPreview) onEditStart?.()
      }}
      onBlur={(e) => {
        if (isEditing) {
          onChange?.({ text: e.currentTarget.innerText })
          onEditEnd?.()
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onChange?.({ text: e.currentTarget.innerText })
          onEditEnd?.()
        }
        e.stopPropagation()  // prevent Delete key from deleting element while typing
      }}
      style={{
        width: "100%",
        height: "100%",
        fontSize: el.fontSize,
        fontWeight: el.fontWeight,
        fontStyle: el.fontStyle,
        fontFamily: el.fontFamily,
        textAlign: el.textAlign,
        letterSpacing: `${el.letterSpacing}px`,
        lineHeight: el.lineHeight,
        color: el.color,
        backgroundColor: el.backgroundColor,
        border: isEditing ? "2px solid #3b82f6" : `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}`,
        borderRadius: `${el.borderRadius}px`,
        opacity: (el.opacity || 100) / 100,
        boxShadow: getShadow ? getShadow(el.boxShadow) : 'none',
        padding: `${el.padding}px`,
        textDecoration: el.textDecoration,
        textTransform: el.textTransform,
        cursor: isEditing ? "text" : "default",
        overflow: "hidden",
        wordWrap: "break-word",
        boxSizing: "border-box",
        outline: "none",
        userSelect: isEditing ? "text" : "none",
        minWidth: "20px",
        minHeight: "20px",
        display: "inline-block",  // ← takes only space of text
        whiteSpace: "pre-wrap",
      }}
    >
      {el.text || "Text"}
    </div>
  )
}