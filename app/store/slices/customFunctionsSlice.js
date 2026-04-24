
import { createSlice } from "@reduxjs/toolkit"

const customFunctionsSlice = createSlice({
  name: "customFunctions",
  initialState: [],
  reducers: {
    addOrUpdateFunction: (state, action) => {
      const { name, code } = action.payload
      const existing = state.find(f => f.name === name)
      if (existing) {
        existing.code = code
      } else {
        state.push({ name, code })
      }
    },
    deleteFunction: (state, action) => {
      return state.filter(f => f.name !== action.payload)
    }
  }
})

export const { addOrUpdateFunction, deleteFunction } = customFunctionsSlice.actions
export default customFunctionsSlice.reducer