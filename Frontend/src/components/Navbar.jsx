import React from 'react'
import { assets } from '../assets/assets'

const Navbar = () => {
  return (
    <div className='w-full h-16 flex items-center justify-center'>
        <img className='w-auto h-2/3' src={assets.logo} alt="Logo of curevo"/>

    </div>
  )
}

export default Navbar

