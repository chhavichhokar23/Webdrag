import { functionRegistry } from "./functions"
import { getShadow } from "../utils/styles"
// import { elementConfig } from "../components/elements/registry"

function extractFunctionBody(fn) {
  const fnString = fn.toString()
  return fnString.substring(
    fnString.indexOf("{") + 1,
    fnString.lastIndexOf("}")
  )
}
export function generateHTML(elements) {

  const elementsHTML = elements.map(el => {
    // Build comprehensive style object
    const styles = {
      position: 'absolute',
      left: `${el.x}px`,
      top: `${el.y}px`,
      width: `${el.width}px`,
      height: `${el.height}px`,
      padding: `${el.padding || 0}px`,
      'font-size': `${el.fontSize}px`,
      'font-weight': el.fontWeight || 'normal',
      'font-style': el.fontStyle || 'normal',
      'font-family': el.fontFamily || 'Arial, sans-serif',
      'text-align': el.textAlign || 'left',
      'letter-spacing': `${el.letterSpacing || 0}px`,
      'line-height': el.lineHeight || 1.5,
      'text-transform': el.textTransform || 'none',
      'text-decoration': el.textDecoration || 'none',
      color: el.color || '#000000',
      'background-color': el.backgroundColor || (el.type === 'text' ? 'transparent' : '#ffffff'),
      'border-width': `${el.borderWidth || 0}px`,
      'border-style': el.borderStyle || 'solid',
      'border-color': el.borderColor || '#d1d5db',
      'border-radius': `${el.borderRadius}px`,
      opacity: (el.opacity || 100) / 100,
      'box-shadow': getBoxShadow(el.boxShadow),
      'z-index': el.z,
      'box-sizing': 'border-box',
      'cursor': el.type === 'button' ? 'pointer' : (el.type === 'text' ? 'default' : 'text'),
      'overflow': 'hidden',
      'word-wrap': 'break-word'
    }

    // Convert styles object to CSS string
    const styleString = Object.entries(styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')

    if (el.type === "input") {
      return `<input
        value="${el.value || ''}"
        placeholder="${el.placeholder || ''}"
        style="${styleString}"
      />`
    }

    if (el.type === "button") {
      return `<button
        onclick="${el.action ? el.action.replace('()', '').trim() + '()' : ''}"
        style="${styleString}"
      >${el.label || 'Button'}</button>`
    }

    if (el.type === "text") {
      return `<div
        style="${styleString}"
      >${el.text || 'Text Element'}</div>`
    }

    return ""
  }).join("\n")

  // get only functions that are actually used on canvas
  const usedFunctionNames = [...new Set(
    elements
      .filter(el => el.type === "button" && el.action)
      .map(el => el.action.replace("()", "").trim())
  )]

  // convert each function to string dynamically
  const functionsScript = usedFunctionNames.map(fnName => {
    const fn = functionRegistry[fnName]
    if (!fn) return ""
    
    // .toString() converts function to its source code string!
    return `function ${fnName}() {
      ${extractFunctionBody(fn)}
    }`
  }).join("\n")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Exported Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100vw; height: 100vh; position: relative; }
  </style>
</head>
<body>
  ${elementsHTML}
  <script>
    ${functionsScript}
  </script>
</body>
</html>`
}
