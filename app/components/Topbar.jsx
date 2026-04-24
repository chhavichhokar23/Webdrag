"use client"
import { useDispatch, useSelector } from "react-redux"
import { setIsPreview } from "../store/slices/uiSlice"
import { generateHTML } from "../config/exportHTML"
import { Eye, EyeOff, Download, Layers } from "lucide-react"
import { useSelector as useReduxSelector } from "react-redux"

export default function Topbar() {
  const dispatch = useDispatch()
  const isPreview = useSelector(state => state.ui.isPreview)
  const elements = useSelector(state => state.elements)
  const customFunctions = useSelector(state => state.customFunctions)

  function handlePreview() {
    dispatch(setIsPreview(!isPreview))
  }

  function handleExport() {
    const html = generateHTML(elements, customFunctions)
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-11 bg-gray-950 border-b border-gray-800 flex items-center px-4 gap-4 shrink-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
          <Layers size={12} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">WebDrag</span>
      </div>

      <div className="w-px h-5 bg-gray-700" />

      <div className="flex items-center gap-1 ml-auto">
        {!isPreview && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <Download size={13} />
            Export
          </button>
        )}
        <button
          onClick={handlePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            isPreview
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "text-gray-300 hover:text-white hover:bg-gray-800"
          }`}
        >
          {isPreview ? <EyeOff size={13} /> : <Eye size={13} />}
          {isPreview ? "Exit Preview" : "Preview"}
        </button>
      </div>
    </div>
  )
}
