"use client"
import { removeUser, setUser } from "@/app/redux/slices/UserSlice"
import Loader from "@/components/Loader/Loader"
import { axiosClient } from "@/utils/AxiosClient"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

export const mainContext = createContext({
  fetchUserProfile() {},
  logoutHandler() {}
})

export const useMainContext = () => useContext(mainContext)

export const MainContextProvider = ({ children }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token") || ""
    if (!token) {
      setLoading(false) // Nếu không có token, không cần gọi API
      return
    }

    setLoading(true) // Bắt đầu hiển thị Loader

    try {
      const res = await axiosClient.get("http://192.168.1.13:1234/api/v1/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.data
      dispatch(setUser(data))
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      dispatch(removeUser({}))
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }

  const logoutHandler = () => {
    try {
      dispatch(removeUser({}))
      localStorage.removeItem("token")
      toast.success("Logout Success")
      router.push("/login")
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, []) // Thêm dependency array để chỉ gọi một lần khi component mount

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return <mainContext.Provider value={{fetchUserProfile, logoutHandler}}>
    {children}
  </mainContext.Provider>
}