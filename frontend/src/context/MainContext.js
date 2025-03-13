"use client"
import { createContext, useContext } from "react"

export const mainContext = createContext()

export const useMainContext = () => useContext(mainContext)

export const MainContextProvider = ({children}) => {
    return(
        <mainContext.Provider value={{}}>
            {children}
        </mainContext.Provider>
    )
}