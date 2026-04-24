
const handles = [
  { id: "TL", top: -4,   left: -4,   cursor: "nw-resize" },
  { id: "TC", top: -4,   left: "50%", cursor: "n-resize"  },
  { id: "TR", top: -4,   right: -4,  cursor: "ne-resize" },
  { id: "ML", top: "50%", left: -4,  cursor: "w-resize"  },
  { id: "MR", top: "50%", right: -4, cursor: "e-resize"  },
  { id: "BL", bottom: -4, left: -4,  cursor: "sw-resize" },
  { id: "BC", bottom: -4, left: "50%", cursor: "s-resize" },
  { id: "BR", bottom: -4, right: -4, cursor: "se-resize" },
]

export default function ResizeHandles({ element, onResize }) {

  function handleMouseDown(e, handleId) {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const startW = element.width
    const startH = element.height
    const startElX = element.x
    const startElY = element.y

    function onMouseMove(e) {
      const dx = e.clientX - startX   // how much mouse moved X
      const dy = e.clientY - startY   // how much mouse moved Y

      let newX = startElX
      let newY = startElY
      let newW = startW
      let newH = startH

      // handle each direction
      if (handleId.includes("R")) newW = Math.max(20, startW + dx)
      if (handleId.includes("B")) newH = Math.max(20, startH + dy)
      if (handleId.includes("L")) {
        newW = Math.max(20, startW - dx)
        newX = startElX + (startW - newW)
      }
      if (handleId.includes("T")) {
        newH = Math.max(20, startH - dy)
        newY = startElY + (startH - newH)
      }

      onResize({ x: newX, y: newY, width: newW, height: newH })
    }

    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <>
      {handles.map(handle => (
        <div
          key={handle.id}
          onMouseDown={(e) => handleMouseDown(e, handle.id)}
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            background: "white",
            border: "1px solid #3b82f6",
            borderRadius: "50%",
            cursor: handle.cursor,
            top: handle.top,
            left: handle.left,
            right: handle.right,
            bottom: handle.bottom,
            transform: handle.left === "50%" || handle.top === "50%" 
              ? handle.left === "50%" ? "translateX(-50%)" : "translateY(-50%)"
              : undefined,
            zIndex: 999,
          }}
        />
      ))}
    </>
  )
}