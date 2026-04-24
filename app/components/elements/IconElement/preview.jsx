import { iconList } from "./icons"

export default function IconPreview({ config }) {
  const iconEntry = iconList.find(i => i.name === config.defaultProps.icon)
  const Icon = iconEntry?.icon

  return (
    <div
      style={{
        width: config.defaultProps.width,
        height: config.defaultProps.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      {Icon && <Icon size={config.defaultProps.size} color={config.defaultProps.color} />}
    </div>
  )
}