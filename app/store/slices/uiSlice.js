import { createSlice } from "@reduxjs/toolkit"

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    selectedId: null,
    isPreview: false,
    zoom: 100,
    breakpoint: "desktop",
    draggedElementId: null,
    dragOffset: { x: 0, y: 0 },
    pendingElement: null,       
    overlappingWith: [],   
    dragOriginalPos: null,  
    editingId: null,
    selectedIcon: {},
    openPicker: null,
  },
  reducers: {

    setSelectedId: (state, action) => {
      state.selectedId = action.payload
    },

    setIsPreview: (state, action) => {
      state.isPreview = action.payload
    },

    setZoom: (state, action) => {
      state.zoom = action.payload
    },

    setBreakpoint: (state, action) => {
      state.breakpoint = action.payload
    },

    setDraggedElement: (state, action) => {
      state.draggedElementId = action.payload.id
      state.dragOffset = action.payload.offset
      state.dragOriginalPos = action.payload.originalPos
    },

    clearDraggedElement: (state) => {
      state.draggedElementId = null
      state.dragOffset = { x: 0, y: 0 }
      state.dragOriginalPos = null
    },

    setPendingElement: (state, action) => {
      state.pendingElement = action.payload
    },

    setOverlappingWith: (state, action) => { 
      state.overlappingWith = action.payload
    },

    clearPending: (state) => {                
      state.pendingElement = null
      state.overlappingWith = []
    },

    setEditingId: (state, action) => {
    state.editingId = action.payload
  },
  setSelectedIcon: (state, action) => {
    const { type, icon } = action.payload
    state.selectedIcon[type] = icon
  },

  setOpenPicker: (state, action) => {
    state.openPicker = action.payload  
  },
  }
})

export const {
  setSelectedId,
  setIsPreview,
  setZoom,
  setBreakpoint,
  setDraggedElement,
  clearDraggedElement,
  setPendingElement,
  setOverlappingWith,
  clearPending,
  setEditingId,
  setSelectedIcon,
  setOpenPicker
} = uiSlice.actions

export default uiSlice.reducer