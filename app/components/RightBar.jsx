"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateElement, bringForward, sendBackward, bringToFront, sendToBack } from "../store/slices/elementsSlice"
import { setSelectedId } from "../store/slices/uiSlice"
import { elementConfig } from "./elements/registry"
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, ChevronDown, ChevronRight, Layers } from "lucide-react"
import IconPicker from "./elements/IconElement/Iconpicker"
import { iconList } from "./elements/IconElement/icons"
import CodeEditorPanel from "./CodeEditorPanel"

const GROUP_LABELS = {
  content: "Content",
  actions: "Actions",
  layout: "Layout",
  typography: "Typography",
  background: "Background",
  border: "Border",
  effects: "Effects",
  general: "General",
}

export default function RightBar() {
  const dispatch = useDispatch()
  const elements = useSelector(state => state.elements)
  const { selectedId, isPreview } = useSelector(state => state.ui)
  const [groupOrder, setGroupOrder] = useState([])
  const [draggedGroup, setDraggedGroup] = useState(null)
  const [expandedGroups, setExpandedGroups] = useState({})
  const [showEditor, setShowEditor] = useState(false)

  const selected = elements.find(el => el.id === selectedId)
  const properties = selected ? elementConfig[selected.type].properties : []

  const groupedProperties = properties.reduce((acc, prop) => {
    const group = prop.group || "general"
    if (!acc[group]) acc[group] = []
    acc[group].push(prop)
    return acc
  }, {})

  const groupNames = Object.keys(groupedProperties)
  const groupNamesKey = groupNames.join("|")

  useEffect(() => {
    setGroupOrder(prev => {
      const next = prev.filter(g => groupNames.includes(g))
      const missing = groupNames.filter(g => !next.includes(g))
      return [...next, ...missing]
    })
  }, [groupNamesKey])

  useEffect(() => {
    setExpandedGroups(prev =>
      Object.fromEntries(
        groupNames.map(g => [g, prev[g] ?? g === groupNames[0]])
      )
    )
  }, [groupNamesKey])

  if (isPreview) return null

  function handleChange(property, value) {
    dispatch(updateElement({ id: selectedId, changes: { [property]: value } }))
  }

  function toggleGroup(group) {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  function handleGroupDragStart(group) { setDraggedGroup(group) }
  function handleGroupDragEnd() { setDraggedGroup(null) }
  function handleGroupDrop(targetGroup) {
    if (!draggedGroup || draggedGroup === targetGroup) return
    setGroupOrder(prev => {
      const next = [...prev]
      const di = next.indexOf(draggedGroup)
      const ti = next.indexOf(targetGroup)
      if (di === -1 || ti === -1) return prev
      next.splice(di, 1)
      next.splice(ti, 0, draggedGroup)
      return next
    })
    setDraggedGroup(null)
  }

  // Sort properties within each group
  Object.keys(groupedProperties).forEach(group => {
    groupedProperties[group].sort((a, b) => {
      if (a.key === "value") return -1
      if (b.key === "value") return 1
      if (a.key === "placeholder" && b.key !== "value") return -1
      if (b.key === "placeholder" && a.key !== "value") return 1
      return 0
    })
  })

  const orderedGroupNames = [
    ...groupOrder.filter(g => groupNames.includes(g)),
    ...groupNames.filter(g => !groupOrder.includes(g)),
  ]
  const orderedGroups = orderedGroupNames.map(g => [g, groupedProperties[g]])

  /* ── No element selected → Layers panel ── */
  if (!selected) {
    return (
      <div className="w-60 h-full bg-gray-950 border-l border-gray-800 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
          <Layers size={13} className="text-gray-500" />
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Layers</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {[...elements].sort((a, b) => b.z - a.z).map(el => (
            <div
              key={el.id}
              onClick={() => dispatch(setSelectedId(el.id))}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs cursor-pointer hover:border-gray-600 hover:bg-gray-800 transition-colors"
            >
              <span className="text-gray-300 capitalize">{el.type}</span>
              <span className="text-gray-600 font-mono">z{el.z}</span>
            </div>
          ))}
          {elements.length === 0 && (
            <p className="text-[11px] text-gray-600 px-1 pt-2">No elements yet. Drag one onto the canvas.</p>
          )}
        </div>
      </div>
    )
  }

  /* ── Element selected → Properties panel ── */
  return (
    <div className="w-60 h-full bg-gray-950 border-l border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Properties</p>
        <p className="text-xs text-gray-400 capitalize mt-0.5">{selected.type}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Layer controls */}
        <div className="p-3 border-b border-gray-800">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">Layer</p>
          <div className="grid grid-cols-2 gap-1">
            {[
              { label: "Front",    icon: ChevronsUp,   action: () => dispatch(bringToFront(selectedId))  },
              { label: "Back",     icon: ChevronsDown,  action: () => dispatch(sendToBack(selectedId))    },
              { label: "Forward",  icon: ArrowUp,       action: () => dispatch(bringForward(selectedId))  },
              { label: "Backward", icon: ArrowDown,     action: () => dispatch(sendBackward(selectedId))  },
            ].map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-gray-400 bg-gray-900 hover:bg-gray-800 hover:text-gray-200 border border-gray-800 hover:border-gray-600 rounded-md transition-colors"
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 mt-2">z-index: {selected.z}</p>
        </div>

        {/* Property groups */}
        <div className="p-2 flex flex-col gap-1">
          {orderedGroups.map(([group, groupProps]) => (
            <div
              key={group}
              draggable
              onDragStart={() => handleGroupDragStart(group)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleGroupDrop(group)}
              onDragEnd={handleGroupDragEnd}
              className={`rounded-lg overflow-hidden border transition-opacity ${
                draggedGroup === group
                  ? "opacity-40 border-blue-600"
                  : "border-gray-800"
              }`}
            >
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-900 hover:bg-gray-800 transition-colors text-left cursor-grab active:cursor-grabbing"
              >
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {GROUP_LABELS[group] || group}
                </span>
                {expandedGroups[group]
                  ? <ChevronDown size={12} className="text-gray-600" />
                  : <ChevronRight size={12} className="text-gray-600" />
                }
              </button>

              {/* Group body */}
              <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
                expandedGroups[group] ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="p-3 bg-gray-950 flex flex-col gap-3">
                  {groupProps.map(prop => (
                    <div key={prop.key}>
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                        {prop.label}
                      </label>

                      {prop.type === "select" ? (
                        <select
                          value={selected[prop.key] ?? ""}
                          onChange={e => handleChange(prop.key, e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5 text-xs text-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                        >
                          {prop.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>

                      ) : prop.type === "iconpicker" ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 bg-gray-900 border border-gray-700 rounded-md">
                            {(() => {
                              const iconName = typeof selected[prop.key] === "string"
                                ? selected[prop.key]
                                : selected[prop.key]?.icon || selected[prop.key]?.name
                              const entry = iconList.find(i => i.name === iconName)
                              const Icon = entry?.icon
                              return Icon ? <Icon size={14} className="text-gray-300" /> : null
                            })()}
                            <span className="text-xs text-gray-400">
                              {typeof selected[prop.key] === "string"
                                ? selected[prop.key]
                                : selected[prop.key]?.icon || selected[prop.key]?.name || "No icon"}
                            </span>
                          </div>
                          <IconPicker
                            currentIcon={typeof selected[prop.key] === "string"
                              ? selected[prop.key]
                              : selected[prop.key]?.icon || selected[prop.key]?.name}
                            onSelect={name => handleChange(prop.key, name)}
                          />
                        </div>

                      ) : prop.type === "color" ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <input
                              type="color"
                              value={selected[prop.key] ?? "#000000"}
                              onChange={e => handleChange(prop.key, e.target.value)}
                              className="w-8 h-8 cursor-pointer rounded-md border border-gray-700 bg-transparent p-0.5"
                            />
                          </div>
                          <input
                            type="text"
                            value={selected[prop.key] ?? ""}
                            onChange={e => handleChange(prop.key, e.target.value)}
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5 text-xs text-gray-200 font-mono focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="#000000"
                          />
                        </div>

                      ) : prop.key === "action" ? (
                        <div className="flex flex-col gap-1.5">
                          <input
                            type="text"
                            value={selected[prop.key] ?? ""}
                            onChange={e => handleChange(prop.key, e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5 text-xs text-gray-200 font-mono focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="e.g. addition"
                          />
                          {selected.type === "button" && (
                            <>
                              <button
                                onClick={() => setShowEditor(true)}
                                className="text-[11px] text-blue-400 hover:text-blue-300 text-left font-mono transition-colors"
                              >
                                {"</>"} Manage functions
                              </button>
                              {showEditor && <CodeEditorPanel onClose={() => setShowEditor(false)} />}
                            </>
                          )}
                        </div>

                      ) : (
                        <input
                          type={prop.type}
                          value={selected[prop.key] ?? ""}
                          onChange={e => {
                            const value = prop.type === "number"
                              ? (e.target.value === "" ? "" : parseInt(e.target.value, 10) || 0)
                              : e.target.value
                            handleChange(prop.key, value)
                          }}
                          className="w-full bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5 text-xs text-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
