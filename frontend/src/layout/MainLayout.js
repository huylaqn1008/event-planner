"use client"
import { store } from "@/app/redux/store"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { MainContextProvider } from "@/context/MainContext"
import React from "react"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const MainLayout = ({ children }) => {
  return (
    <div className="min-w-[250px] w-full overflow-x-hidden"> {/* Giới hạn chiều ngang tối thiểu */}
      <Provider store={store}>
        <MainContextProvider>
          <Header />
          <ToastContainer />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </MainContextProvider>
      </Provider>
    </div>
  )
}

export default MainLayout
