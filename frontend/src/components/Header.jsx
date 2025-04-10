import Image from 'next/image'
import React from 'react'
import Logo from '@/assets/images/logo2.png'
import { IoPerson } from 'react-icons/io5'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { UserSlicePath } from '@/app/redux/slices/UserSlice'
import ProfileButton from './Auth/ProfileButton'
import { CgMenuLeftAlt } from "react-icons/cg"
import { toggleSidebar } from '@/app/redux/slices/SidebarSlice'

const Header = () => {
  const user = useSelector(UserSlicePath)
  const dispatch = useDispatch()

  return (
    <header className="text-gray-600 body-font h-20 fixed w-full bg-white z-50 shadow-sm">
      <div className="container mx-auto h-full flex items-center justify-between">
        <div className='flex items-center justify-center gap-x-2'>
          <button onClick={() => dispatch(toggleSidebar())} className='text-3xl text-black lg:hidden'>
            <CgMenuLeftAlt />
          </button>
          <Link href="/" className="flex items-center w-fit h-fit">
            <div className="p-2"> {/* padding tạo cảm giác lớn hơn */}
              <Image
                src={Logo}
                alt="logo"
                width={190}
                height={100}
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Menu + User */}
        <div className="flex items-center space-x-6">
          <nav className="flex items-center space-x-5">
            <Link href="/" className="text-black hover:text-gray-900">Home</Link>
          </nav>
          {
            user && user.email ? (
              <ProfileButton />
            ) : (
              <Link href="/login" className="outline-none border-none px-6 py-3 font-medium bg-blue-600 
            text-white rounded-sm cursor-pointer flex items-center gap-2 hover:bg-blue-700 transition">
                <span>Login</span> <IoPerson />
              </Link>
            )
          }
        </div>
      </div>
    </header>

  )
}

export default Header