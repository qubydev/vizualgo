import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div className="w-full px-6 shadow-md">
      <nav className='h-16 flex items-center justify-between'>
        <Link href="/">
          ~/vizualgo
        </Link>
      </nav>
    </div>
  )
}
