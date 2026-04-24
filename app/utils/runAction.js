// utils/runAction.js

import { functionRegistry } from "../config/functions" // ✅ matches your folder structure

export function runAction(actionName, customFunctions = []) {

  // 1. Check user-saved custom functions first (Redux) — handles full fn declarations too
  const custom = customFunctions.find(f => f.name === actionName)
  if (custom) {
    try {
      const trimmed = custom.code.trim()
      const fnMatch = trimmed.match(/^function\s+(\w+)\s*\(/)
      const execCode = fnMatch ? `${trimmed}\n${fnMatch[1]}()` : trimmed
      new Function(execCode)()
    } catch (err) {
      alert(`Error in "${actionName}": ${err.message}`)
    }
    return
  }

  // 2. Check built-in functions (addition, subtraction, etc.)
  if (functionRegistry[actionName]) {
    functionRegistry[actionName]()
    return
  }

  // 3. Nothing matched
  if (actionName) alert(`No function named "${actionName}" found.`)
}