import { configureStore } from "@reduxjs/toolkit"
import elementsReducer from "./slices/elementsSlice"
import uiReducer from "./slices/uiSlice"
import customFunctionsReducer from "./slices/customFunctionsSlice"

export const store = configureStore({
  reducer: {
    elements: elementsReducer,
    ui: uiReducer,
    customFunctions: customFunctionsReducer,
  }
})