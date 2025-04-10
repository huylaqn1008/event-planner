'use client'
import Link from 'next/link'
import React from 'react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { LuLayoutDashboard } from "react-icons/lu"
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { SidebarSlicePath, toggleCollapse, toggleSidebar } from '../redux/slices/SidebarSlice'
import { MdOutlineDoubleArrow } from "react-icons/md"

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

  return (
    <>
      <section className="flex items-start gap-x-4">
        <aside className="relative">
          <div className="relative sidebar-container">
            {/* Sidebar */}
            <Sidebar
              collapsed={isCollapsed}
              toggled={isToggle}
              onBackdropClick={() => dispatch(toggleSidebar())}
            >
              <Menu className="min-h-screen py-6 px-3 bg-white shadow-xl border-r border-gray-100 rounded-tr-2xl rounded-br-2xl relative">
                <CustomMenuItem Icon={LuLayoutDashboard} link={'/dashboard'} title={'Dashboard'} />
                <CustomMenuItem Icon={LuLayoutDashboard} link={'/profile'} title={'Profile'} />
              </Menu>
            </Sidebar>

            <div className="absolute top-1/2 right-[-14px] -translate-y-1/2 z-10">
              <button
                onClick={() => dispatch(toggleCollapse())}
                className={`w-8 h-8 flex items-center justify-center bg-white border border-gray-300 
                  rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${!isCollapsed ? 'rotate-180' : ''}`}
              >
                <MdOutlineDoubleArrow className="text-gray-600" />
              </button>
            </div>
          </div>
        </aside>
        <main>{children}</main>
      </section>
    </>
  )
}

export default RootTemplate
