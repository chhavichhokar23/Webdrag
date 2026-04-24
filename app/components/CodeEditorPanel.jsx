
"use client"
import { createPortal } from "react-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addOrUpdateFunction, deleteFunction } from "../store/slices/customFunctionsSlice"
import { functionRegistry } from "../config/functions"

export default function CodeEditorPanel({ onClose }) {
  const dispatch = useDispatch()
  const customFunctions = useSelector(state => state.customFunctions)

  const [name, setName]       = useState("")
  const [code, setCode]       = useState("")
  const [editing, setEditing] = useState(null)
  const [error, setError]     = useState("")


  const builtinNames = Object.keys(functionRegistry)

  // handleSave — now calls the API
async function handleSave() {
  setError("")
  const trimmed = name.trim()

  if (!trimmed) return setError("Name is required.")
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmed))
    return setError("Must be a valid JS identifier (no spaces or special chars).")
  if (builtinNames.includes(trimmed) && trimmed !== editing)
    return setError(`"${trimmed}" is a built-in — pick a different name.`)
  try { new Function(code) }
  catch (e) { return setError(`Syntax error: ${e.message}`) }

  //  API call instead of just dispatching
  const res = await fetch("/api/functions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: trimmed, code })
  })

  if (!res.ok) return setError("Failed to save to file.")

  // Update Redux immediately so UI reflects without reload
  dispatch(addOrUpdateFunction({ name: trimmed, code }))
  setName(""); setCode(""); setEditing(null)
}

  function handleEdit(fn) {
    setName(fn.name); setCode(fn.code); setEditing(fn.name); setError("")
  }

  // handleDelete — now calls the API
async function handleDelete(fnName) {
  if (!confirm(`Delete "${fnName}"?`)) return

  const res = await fetch("/api/functions", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: fnName })
  })

  if (!res.ok) return alert("Failed to delete from file.")

  dispatch(deleteFunction(fnName))
  if (editing === fnName) { setName(""); setCode(""); setEditing(null) }
}

  return createPortal (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-xl shadow-2xl w-[700px] max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">⚡ Custom Functions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg">✕</button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <div className="w-44 border-r border-gray-100 bg-gray-50 flex flex-col overflow-y-auto shrink-0">

            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
              Built-in
            </p>
            {builtinNames.map(n => (
              <div key={n} className="px-3 py-1 text-xs text-gray-400 font-mono">{n}</div>
            ))}

            <p className="px-3 pt-4 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide border-t border-gray-200 mt-2">
              Custom
            </p>
            {customFunctions.length === 0 && (
              <p className="px-3 text-[11px] text-gray-300 italic">None yet</p>
            )}
            {customFunctions.map(fn => (
              <div
                key={fn.name}
                onClick={() => handleEdit(fn)}
                className={`px-3 py-1.5 text-xs font-mono cursor-pointer flex items-center justify-between group
                  ${editing === fn.name ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <span>{fn.name}</span>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(fn.name) }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs"
                >✕</button>
              </div>
            ))}

            <button
              onClick={() => { setName(""); setCode(""); setEditing(null); setError("") }}
              className="mx-3 mt-3 text-xs text-blue-500 hover:text-blue-700 text-left"
            >
              + New function
            </button>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-12 shrink-0">Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="myFunction"
                className="flex-1 border border-gray-300 text-black rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-500">
                Body{" "}
                <span className="text-gray-400 font-normal">
                  — write as if inside <code>{"function() { ... }"}</code>
                </span>
              </label>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                rows={12}
                placeholder={`// Example:\nconst inputs = document.querySelectorAll("input")\nconst sum = [...inputs].reduce((a, i) => a + Number(i.value), 0)\nalert("Sum: " + sum)`}
                className="border border-gray-300 rounded p-3 text-sm font-mono bg-gray-950 text-green-400 resize-none focus:outline-none focus:border-blue-400"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                ⚠ {error}
              </p>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="text-xs px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editing ? "Update" : "Save function"}
              </button>
            </div>

            <p className="text-[11px] text-gray-400 border-t border-gray-100 pt-3">
              💡 Set the <strong>Function</strong> field on a Button to this function's name to use it.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}