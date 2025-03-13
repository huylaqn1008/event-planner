"use client"
import { store } from "@/app/redux/store"
import Header from "@/components/Header"
import { MainContextProvider } from "@/context/MainContext"
import React from "react"
import { Provider } from "react-redux"

const MainLayout = ({ children }) => {
  return (
    <>
      <Provider store={store}>
        <Header/>
        <MainContextProvider>{children}</MainContextProvider>
      </Provider>
    </>
  )
}

export default MainLayout
