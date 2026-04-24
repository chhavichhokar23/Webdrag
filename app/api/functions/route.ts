// app/api/functions/route.js

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const FUNCTIONS_FILE = join(process.cwd(), "app/config/functions.js")
const START_MARKER = "// __CUSTOM_FUNCTIONS_START__"
const END_MARKER = "// __CUSTOM_FUNCTIONS_END__"

// ── GET — load all custom functions from the file
export async function GET() {
  try {
    const content = readFileSync(FUNCTIONS_FILE, "utf-8")

    const startIndex = content.indexOf(START_MARKER) + START_MARKER.length
    const endIndex = content.indexOf(END_MARKER)

    if (startIndex === -1 || endIndex === -1) {
      return Response.json({ error: "Markers not found in functions.js" }, { status: 500 })
    }

    const block = content.slice(startIndex, endIndex).trim()

    // Parse each function out of the block
    // Each function is wrapped like:
    // // fn:sayHello
    // sayHello: () => { ... },
    // // end:sayHello
    const functions = []
    const regex = /\/\/ fn:(\w+)\n([\s\S]*?)\/\/ end:\w+/g
    let match

    while ((match = regex.exec(block)) !== null) {
      const name = match[1]
      // Extract just the body code from:  name: () => {\n  code  \n},
      const fullEntry = match[2].trim()
      const bodyMatch = fullEntry.match(/:\s*\(\)\s*=>\s*\{([\s\S]*)\},?\s*$/)
      const code = bodyMatch ? bodyMatch[1].trim() : fullEntry

      functions.push({ name, code })
    }

    return Response.json(functions)

  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

// ── POST — save or update a function in the file
export async function POST(req) {
  try {
    const { name, code } = await req.json()

    let content = readFileSync(FUNCTIONS_FILE, "utf-8")

    const startIndex = content.indexOf(START_MARKER) + START_MARKER.length
    const endIndex = content.indexOf(END_MARKER)

    if (startIndex === -1 || endIndex === -1) {
      return Response.json({ error: "Markers not found in functions.js" }, { status: 500 })
    }

    let block = content.slice(startIndex, endIndex)

    // Format the new entry
    const indentedCode = code
      .split("\n")
      .map(line => `    ${line}`)
      .join("\n")

    const entry = `
  // fn:${name}
  ${name}: () => {
${indentedCode}
  },
  // end:${name}
`

    // If it already exists → replace it
    const existingRegex = new RegExp(
      `\\s*\\/\\/ fn:${name}[\\s\\S]*?\\/\\/ end:${name}\\n?`,
      "g"
    )

    if (existingRegex.test(block)) {
      block = block.replace(existingRegex, entry)
    } else {
      // New function → append before end marker
      block = block + entry
    }

    // Stitch the file back together
    const newContent =
      content.slice(0, startIndex) +
      block +
      content.slice(endIndex)

    writeFileSync(FUNCTIONS_FILE, newContent, "utf-8")
    return Response.json({ ok: true })

  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

// ── DELETE — remove a function from the file
export async function DELETE(req) {
  try {
    const { name } = await req.json()

    let content = readFileSync(FUNCTIONS_FILE, "utf-8")

    const existingRegex = new RegExp(
      `\\s*\\/\\/ fn:${name}[\\s\\S]*?\\/\\/ end:${name}\\n?`,
      "g"
    )

    const newContent = content.replace(existingRegex, "")
    writeFileSync(FUNCTIONS_FILE, newContent, "utf-8")

    return Response.json({ ok: true })

  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}