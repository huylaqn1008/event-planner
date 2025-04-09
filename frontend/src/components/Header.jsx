import Image from 'next/image'
import React from 'react'
import Logo from '@/assets/images/logo.png'
import { IoPerson } from 'react-icons/io5'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { UserSlicePath } from '@/app/redux/slices/UserSlice'
import ProfileButton from './Auth/ProfileButton'

const Header = () => {
  const user = useSelector(UserSlicePath)

  return (
    <header className="text-gray-600 body-font h-20 fixed w-full bg-white z-50 shadow-sm">
      <div className="container mx-auto h-full flex items-center justify-between px-5">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={Logo}
            alt="logo"
            width={200} // tăng width
            height={200} // tăng height
            className="w-[150px] h-auto object-contain shrink-0"
            priority
          />
        </Link>

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