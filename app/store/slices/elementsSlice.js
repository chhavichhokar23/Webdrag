import { createSlice } from "@reduxjs/toolkit"

const elementsSlice = createSlice({
  name: "elements",
  initialState: [],
  reducers: {

    addElement: (state, action) => {
      // give new element z = length + 1 (always highest)
      const newEl = { ...action.payload, z: state.length + 1 }
      state.push(newEl)
    },

    updateElement: (state, action) => {
      const el = state.find(e => e.id === action.payload.id)
      if (el) {
        Object.assign(el, action.payload.changes)
      }
    },

    removeElement: (state, action) => {
      const index = state.findIndex(e => e.id === action.payload)
      if (index !== -1) state.splice(index, 1)
      // re-assign z values after removal
      state.forEach((el, i) => { el.z = i + 1 })
    },

    bringForward: (state, action) => {
      const el = state.find(e => e.id === action.payload)
      if (!el) return
      const above = state.find(e => e.z === el.z + 1)
      if (above) above.z = el.z   // swap
      el.z += 1
    },

    sendBackward: (state, action) => {
      const el = state.find(e => e.id === action.payload)
      if (!el || el.z <= 1) return
      const below = state.find(e => e.z === el.z - 1)
      if (below) below.z = el.z   // swap
      el.z -= 1
    },

    bringToFront: (state, action) => {
      const el = state.find(e => e.id === action.payload)
      if (!el) return
      const maxZ = Math.max(...state.map(e => e.z))
      if (el.z === maxZ) return   // already on top
      // shift everything above down
      state.forEach(e => { if (e.z > el.z) e.z -= 1 })
      el.z = maxZ
    },

    sendToBack: (state, action) => {
      const el = state.find(e => e.id === action.payload)
      if (!el) return
      const minZ = Math.min(...state.map(e => e.z))
      if (el.z === minZ) return   // already at bottom
      // shift everything below up
      state.forEach(e => { if (e.z < el.z) e.z += 1 })
      el.z = minZ
    }

  }
})

export const { 
  addElement, 
  updateElement, 
  removeElement,
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack
} = elementsSlice.actions

export default elementsSlice.reducer