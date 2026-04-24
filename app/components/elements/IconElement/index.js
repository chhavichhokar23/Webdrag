import { iconList } from "./icons"

export default function IconElement({ el, getShadow }) {
  const iconEntry = iconList.find(i => i.name === el.icon)
  const Icon = iconEntry?.icon

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: el.backgroundColor,
        border: `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}`,
        borderRadius: `${el.borderRadius}px`,
        padding: el.padding,
        opacity: el.opacity / 100,
        boxShadow: getShadow?.(el.boxShadow),
        boxSizing: "border-box",
      }}
    >
      {Icon ? (
        <Icon
          size={el.size}
          color={el.color}
          strokeWidth={el.strokeWidth}
        />
      ) : (
        <span style={{ fontSize: 10, color: "#999" }}>?</span>
      )}
    </div>
  )
}