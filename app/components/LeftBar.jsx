"use client"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedIcon, setOpenPicker } from "../store/slices/uiSlice"
import { elementRegistry } from "./elements/registry"
import { iconList } from "./elements/IconElement/icons"

export default function LeftBar() {
  const dispatch = useDispatch()
  const { isPreview, selectedIcon, openPicker } = useSelector(state => state.ui)

  function handleDragStart(e, type) {
    e.dataTransfer.setData("elementType", type)
    const rect = e.currentTarget.getBoundingClientRect()
    e.dataTransfer.setData("offsetX", (e.clientX - rect.left).toString())
    e.dataTransfer.setData("offsetY", (e.clientY - rect.top).toString())
    if (type === "icon" && selectedIcon[type]) {
      e.dataTransfer.setData("selectedIcon", selectedIcon[type])
    }
  }

  if (isPreview) return null

  return (
    <div className="w-64 h-full border-r bg-white border-gray-100 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Elements
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {Object.entries(elementRegistry).map(([type, entry]) => {
          const Preview = entry.preview
          const isIconType = type === "icon"
          const currentIcon = selectedIcon[type] || entry.config.defaultProps.icon

          return (
            <div key={type} className="flex flex-col gap-1">

              <div
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                className="cursor-grab w-fit"
              >
                <Preview
                  config={{
                    ...entry.config,
                    defaultProps: {
                      ...entry.config.defaultProps,
                      ...(isIconType && { icon: currentIcon })
                    }
                  }}
                />
              </div>

              {isIconType && (
                <button
                  onClick={() => dispatch(setOpenPicker(openPicker === type ? null : type))}
                  className="text-[10px] text-blue-500 hover:text-blue-700 text-left mt-1"
                >
                  {openPicker === type ? "▲ Close picker" : "▼ Choose icon"}
                </button>
              )}

              {isIconType && openPicker === type && (
                <div className="grid grid-cols-6 gap-1 p-2 bg-gray-50 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {iconList.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      title={name}
                      onClick={() => dispatch(setSelectedIcon({ type, icon: name }))}
                      className={`p-1.5 rounded flex items-center justify-center hover:bg-blue-50 transition-colors ${
                        currentIcon === name
                          ? "bg-blue-100 border border-blue-400"
                          : "border border-transparent"
                      }`}
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              )}

            </div>
          )
        })}
      </div>
    </div>
  )
}
