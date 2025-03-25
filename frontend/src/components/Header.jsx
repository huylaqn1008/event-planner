import Image from 'next/image'
import React from 'react'
import Logo from '@/assets/images/logo.png'
import { IoPerson } from 'react-icons/io5'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { UserSlicePath } from '@/app/redux/slices/UserSlice'
import { useMainContext } from '@/context/MainContext'

const Header = () => {
  const user = useSelector(UserSlicePath)
  const { logoutHandler } = useMainContext()

  return (
    <>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link href={'/'} className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <Image src={Logo} alt='logo' className='w-[20%]' width={1000} height={1000} />
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link href={'/'} className="mr-5 text-black hover:text-gray-900">Home</Link>
          </nav>
          {
            user && user.email ?
              <button onClick={logoutHandler} className="outline-none px-6 py-3 font-pmedium border-indigo-500 border 
              text-indigo-500 rounded-sm cursor-pointer flex items-center justify-center gap-2">
                Logout
              </button> :
              <Link href={'/login'} className="outline-none border-none px-6 py-3 font-pmedium bg-secondary 
              text-white rounded-sm cursor-pointer flex items-center justify-center gap-2">
                <span>Login</span> <IoPerson />
              </Link>
          }
        </div>
      </header>
    </>
  )
}

export default Header