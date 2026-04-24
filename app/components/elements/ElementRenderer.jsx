import { elementRegistry } from "./registry"
import { getShadow } from "../../utils/styles"

export default function ElementRenderer({ el, isPreview, onAction, onChange, isEditing, onEditStart, onEditEnd }) {
  const entry = elementRegistry[el.type]
  if (!entry) return null

  const Component = entry.component

  return (
    <Component
      el={el}
      isPreview={isPreview}
      getShadow={getShadow}
      onAction={onAction}
      onChange={onChange}
      isEditing={isEditing}
      onEditStart={onEditStart}
      onEditEnd={onEditEnd}
    />
  )
}