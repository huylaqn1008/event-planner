'use client'
import React from 'react'
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar'

const RootTemplate = ({ children }) => {
  return (
    <>
      <section className="flex items-start">
        <Sidebar breakPoint='lg'>
          <Menu className='min-h-screen'>
            <SubMenu label="Charts">
              <MenuItem>Pie charts</MenuItem>
              <MenuItem>Line charts</MenuItem>
            </SubMenu>
            <MenuItem>Documentation</MenuItem>
            <MenuItem>Calendar</MenuItem>
          </Menu>
        </Sidebar>
        <main>{children}</main>
      </section>
    </>
  )
}

export default RootTemplate