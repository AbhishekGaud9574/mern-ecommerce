import React from 'react'
import { Link } from 'react-router-dom'
import '../../css/Footer.css'

function Footer() {
  return (
    <div>
      <div className='footer'>
        <p>@ Copyright 2025 by <span> ShopEase </span>. All Rights Reserved.</p>
        <p className='text-center'>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {/* <Link to="/policy">Privacy & Policy</Link> */}
        </p>
      </div>
    </div>
  )
}

export default Footer