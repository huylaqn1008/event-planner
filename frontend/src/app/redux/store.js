"use client"
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { UserSlice } from "./slices/UserSlice"
import { SidebarSlice } from "./slices/SidebarSlice"

export const store = configureStore({
  reducer: {
    [UserSlice.name]: UserSlice.reducer,
    [SidebarSlice.name]: SidebarSlice.reducer,
  },
  middleware: (f) => f().concat(),
})

setupListeners(store.dispatch)
