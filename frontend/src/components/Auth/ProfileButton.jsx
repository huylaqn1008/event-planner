import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Link from 'next/link'
import { useMainContext } from '@/context/MainContext'

const ProfileButton = () => {
  const {logoutHandler} = useMainContext()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuItem>
            <Link href={'/'}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={'/dashboard'}>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logoutHandler} className={'cursor-pointer'}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}

export default ProfileButton