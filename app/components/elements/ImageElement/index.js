export default function ImageElement({ el, isPreview, getShadow }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: `${el.borderRadius}px`,
        border: `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}`,
        opacity: el.opacity / 100,
        boxShadow: getShadow(el.boxShadow),
        overflow: "hidden",
        padding: el.padding,
        boxSizing: "border-box",
      }}
    >
      {el.src ? (
        <img
          src={el.src}
          alt={el.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: el.objectFit,
            display: "block",
            pointerEvents: "none",
          }}
          onError={(e) => {
            e.target.style.display = "none"
            e.target.nextSibling.style.display = "flex"
          }}
        />
      ) : null}
      <div
        style={{
          display: el.src ? "none" : "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 6,
          backgroundColor: "#f3f4f6",
          color: "#9ca3af",
          fontSize: 12,
          pointerEvents: "none",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span>No image</span>
      </div>
    </div>
  )
}