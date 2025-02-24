import React from 'react'
import { Outlet } from 'react-router-dom'
import ShopingHeader from './ShopingHeader'

const ShopingLayout = () => {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
      {/* common header for shoping view */}
      <ShopingHeader />
      <main className='flex flex-col w-full'>
            <Outlet/>
      </main>
    </div>
  )
}

export default ShopingLayout  
