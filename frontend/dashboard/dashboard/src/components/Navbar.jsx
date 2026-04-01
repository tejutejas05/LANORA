
import React from 'react'
import { link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='bg-slate-400 shadow-lg flex items-center justify-around px-3 py-23 fixed top-0 left-0 w-full'>
      <link>
        <span className='font-medium text-lg flex items-center gap-4 text-blue-50'>
          <span className='font-semibold text-2x1'>lanora</span>
        </span>
      </link>
    </nav>
  )
}

export default Navbar
