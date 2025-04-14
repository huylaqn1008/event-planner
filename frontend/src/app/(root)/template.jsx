'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { LuLayoutDashboard } from "react-icons/lu"
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { SidebarSlicePath, toggleCollapse, toggleSidebar } from '../redux/slices/SidebarSlice'
import { MdOutlineDoubleArrow } from "react-icons/md"
import { UserSlicePath } from '../redux/slices/UserSlice'
import Loader from '@/components/Loader/Loader'

const CustomMenuItem = ({ title, link, Icon }) => {
  const pathname = usePathname()

  return (
    <MenuItem
      active={pathname === link}
      style={{
        background: pathname === link ? '#f08a24' : '',
        borderRadius: '5px',
        color: pathname === link ? 'white' : 'black',
        textDecoration: 'none',
        marginBottom: '10px',
        padding: '10px 15px',
        transition: 'background-color 0.3s ease',
        fontFamily: 'Poppins-medium'
      }}
      component={<Link href={link} />}
      icon={<Icon className='text-3xl' />}
    >
      {title}
    </MenuItem>
  )
}

const RootTemplate = ({ children }) => {
  const { isToggle, isCollapsed } = useSelector(SidebarSlicePath)
  const dispatch = useDispatch()
  const user = useSelector(UserSlicePath)
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && user.email) {
        setLoading(false)
      } else {
        router.push('/login')
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [user])

  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
  //       <Loader />
  //     </div>
  //   )
  // }

  return (
    <section className="flex items-start">
      <aside className="relative">
        <div className="relative sidebar-container">
          {/* Sidebar */}
          <Sidebar
            collapsed={isCollapsed}
            toggled={isToggle}
            onBackdropClick={() => dispatch(toggleSidebar())}
            breakPoint="750px"
            className="h-screen"
          >
            <Menu className="min-h-screen py-6 px-3 bg-white shadow-xl  relative">
              <CustomMenuItem Icon={LuLayoutDashboard} link={'/dashboard'} title={'Dashboard'} />
              <CustomMenuItem Icon={LuLayoutDashboard} link={'/profile'} title={'Profile'} />
            </Menu>
          </Sidebar>

          <div className="absolute top-1/2 right-[-18px] -translate-y-1/2 z-10 hidden lg:block">
            <button
              onClick={() => dispatch(toggleCollapse())}
              className={`w-10 h-10 flex items-center justify-center bg-white border border-gray-300 
                rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${!isCollapsed ? 'rotate-180' : ''}`}
            >
              <MdOutlineDoubleArrow className="text-gray-600 text-2xl" />
            </button>
          </div>
        </div>
      </aside>
      <main className='w-full'>{children}</main>
    </section>
  )
}

export default RootTemplate
