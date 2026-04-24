"use client"
import { useRef } from "react"
import { useEffect } from "react"
import { removeElement } from "../store/slices/elementsSlice"
import { useDispatch, useSelector } from "react-redux"
import { addElement, updateElement } from "../store/slices/elementsSlice"
import { setSelectedId, setDraggedElement, clearDraggedElement, setPendingElement, setOverlappingWith, clearPending, setEditingId } from "../store/slices/uiSlice"
import { elementConfig } from "./elements/registry"
import ElementRenderer from "./elements/ElementRenderer"
import ResizeHandles from "./ResizeHandles"
import { functionRegistry } from "../config/functions"
import { addOrUpdateFunction } from "../store/slices/customFunctionsSlice"
import { AlertTriangle } from "lucide-react"
import { runAction } from "../utils/runAction"


export default function Canvas() {
  const dispatch = useDispatch()
  const canvasRef = useRef(null)
  const elements = useSelector(state => state.elements)
  const { isPreview, selectedId, draggedElementId, dragOffset, pendingElement, overlappingWith, dragOriginalPos, editingId, selectedIcon } = useSelector(state => state.ui)
  const customFunctions = useSelector(state => state.customFunctions)

  function handleAction(actionName) {
    runAction(actionName, customFunctions)
  }
  useEffect(() => {
  async function loadCustomFunctions() {
    try {
      const res = await fetch("/api/functions")
      const data = await res.json()
      if (Array.isArray(data)) {
        data.forEach(fn => {
          dispatch(addOrUpdateFunction({ name: fn.name, code: fn.code }))
        })
      }
    } catch (err) {
      console.error("Failed to load functions:", err)
    }
  }
  loadCustomFunctions()
}, [])
  useEffect(() => {
  function handleKeyDown(e) {

    if ((e.key === "Delete") && selectedId) {
      dispatch(removeElement(selectedId))
      dispatch(setSelectedId(null))
    }
  }

  window.addEventListener("keydown", handleKeyDown)
  return () => window.removeEventListener("keydown", handleKeyDown)
}, [selectedId])

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
  e.preventDefault()

  const type = e.dataTransfer.getData("elementType")
  if (!type) return

  const canvasRect = e.currentTarget.getBoundingClientRect()

  // read offset from dataTransfer
  const offsetX = parseFloat(e.dataTransfer.getData("offsetX")) || 0
  const offsetY = parseFloat(e.dataTransfer.getData("offsetY")) || 0

  // subtract offset so element places at ghost position not mouse position
  const x = e.clientX - canvasRect.left - offsetX
  const y = e.clientY - canvasRect.top - offsetY

  const newElement = {
    id: Date.now(),
    type,
    x: Math.max(0, x),
    y: Math.max(0, y),
    z: elements.length + 1,
    ...elementConfig[type].defaultProps,
    ...(selectedIcon && selectedIcon[type] && { icon: selectedIcon[type] })
  }

  const overlaps = checkOverlap(newElement)
  if (overlaps.length > 0) {
    dispatch(setPendingElement(newElement))
    dispatch(setOverlappingWith(overlaps))
  } else {
    dispatch(addElement(newElement))
  }
  // console.log("Dropped element:", newElement)
}
function handleOverlapConfirm() {
  if (pendingElement.id && elements.find(el => el.id === pendingElement.id)) {
    // It's a dragged element, just clear the pending state (keep new position)
    dispatch(clearPending())
  } else {
    // It's a new element from drag-drop
    dispatch(addElement({ ...pendingElement }))
    dispatch(clearPending())
  }
}

function handleOverlapCancel() {
  if (pendingElement.id && elements.find(el => el.id === pendingElement.id)) {
    // existing element → revert using originalPos saved in pendingElement
    if (pendingElement.originalPos) {
      dispatch(updateElement({
        id: pendingElement.id,
        changes: { 
          x: pendingElement.originalPos.x, 
          y: pendingElement.originalPos.y 
        }
      }))
    }
  }
  dispatch(clearPending())
}

  function handleElementMouseDown(e, elementId) {
    if (isPreview) return
    
    // Shift + MouseDown to drag
    if (e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      dispatch(setSelectedId(elementId))
      
      const element = elements.find(el => el.id === elementId)
      if (!canvasRef.current) return
      
      const canvasRect = canvasRef.current.getBoundingClientRect()
      
      dispatch(setDraggedElement({
        id: elementId,
        offset: {
          x: e.clientX - canvasRect.left - element.x,
          y: e.clientY - canvasRect.top - element.y
        },
        originalPos: { x: element.x, y: element.y }
      }))
    }
  }

  function handleMouseMove(e) {
    if (!draggedElementId || isPreview) return
    if (!canvasRef.current) return
    
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - dragOffset.x
    const newY = e.clientY - canvasRect.top - dragOffset.y
    
    dispatch(updateElement({
      id: draggedElementId,
      changes: { x: Math.max(0, newX), y: Math.max(0, newY) }
    }))
  }

  function handleMouseUp() {
    if (draggedElementId) {
      const draggedElement = elements.find(el => el.id === draggedElementId)
      if (draggedElement) {
        const overlaps = checkOverlap(draggedElement)
        if (overlaps.length > 0) {
          dispatch(setPendingElement({...draggedElement, originalPos: dragOriginalPos}))
          dispatch(setOverlappingWith(overlaps))
        }
      }
    }
    dispatch(clearDraggedElement())
  }

  function handleButtonClick(action) {
  if (!action) {
    alert("No function assigned to this button!")
    return
  }

  const functionName = action.replace("()", "").trim()

  // handle clearInputs via Redux so state persists
  if (functionName === "clearInputs") {
    elements
      .filter(el => el.type === "input")
      .forEach(el => {
        dispatch(updateElement({ id: el.id, changes: { value: "" } }))
      })
    return   // ← return early, don't call functionRegistry
  }

  const fn = functionRegistry[functionName]

  if (!fn) {
    alert(`Function "${functionName}" not found!`)
    return
  }

  fn()   // ← no args
}
  function checkOverlap(newEl) {
  return elements.filter(el => {
    if (el.id === newEl.id) return false

    const xOverlap = newEl.x < el.x + el.width && newEl.x + newEl.width > el.x
    const yOverlap = newEl.y < el.y + el.height && newEl.y + el.height > el.y

    return xOverlap && yOverlap
  })
}
  return (
    <div
      ref={canvasRef}
      className="flex-1 h-full relative canvas"
      // style={{ backgroundColor: "#f8f9fb", backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
          if (e.target === e.currentTarget) {
            dispatch(setSelectedId(null))
            dispatch(setEditingId(null)) 
          }
        }}
    >
      {pendingElement && (
  <div
    style={{
      position: "absolute",
      left: pendingElement.x,
      top: pendingElement.y + pendingElement.height + 8, 
      zIndex: 100,
    }}
    className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-56"
  >
    <div className="flex items-center gap-1 mb-2">
      <AlertTriangle size={12} className="text-amber-500" />
      <p className="text-xs text-gray-500">
        Overlaps with {overlappingWith.length} element{overlappingWith.length > 1 ? "s" : ""}
      </p>
    </div>
    <div className="flex gap-2">
      <button
        onClick={handleOverlapCancel}
        className="flex-1 border border-gray-300 rounded py-1 text-xs text-gray-600 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        onClick={handleOverlapConfirm}
        className="flex-1 bg-blue-500 text-white rounded py-1 text-xs hover:bg-blue-600"
      >
        Place anyway
      </button>
    </div>
  </div>
)}

      {elements.map((el) => (
  <div
    key={el.id}
    onMouseDown={(e) => {
      if (isPreview) return
      if (e.shiftKey) {
        handleElementMouseDown(e, el.id)
      } else {
        dispatch(setSelectedId(el.id))
      }
    }}
    style={{
      position: "absolute",
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      zIndex: el.z,
      cursor: draggedElementId === el.id ? "grabbing" : "grab",
      userSelect: draggedElementId === el.id ? "none" : "auto",
    }}
    className={`border-transparent ${
      isPreview
        ? "border-transparent"
        : el.id === selectedId
          ? "border-blue-500"
          : " hover:border-blue-300"
    }`}
    title="Shift+Click to drag"
  >
    {!isPreview && el.id === selectedId && (
      <ResizeHandles
        element={el}
        onResize={(changes) => dispatch(updateElement({ id: el.id, changes }))}
      />
    )}
    

    <ElementRenderer
      el={el}
      isPreview={isPreview}
      onAction={handleAction}
      onChange={(changes) => dispatch(updateElement({ id: el.id, changes }))}
      isEditing={editingId === el.id}
      onEditStart={() => dispatch(setEditingId(el.id))}
      onEditEnd={() => dispatch(setEditingId(null))}
    />

  </div>
))}
    </div>
  )
}
