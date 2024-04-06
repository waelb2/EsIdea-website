// eslint-disable-next-line no-unused-vars
import React from 'react'
import AdminSideBar from './AdminSideBar'
import { Outlet } from 'react-router-dom';
const AdminDashboard = () => {
  return (
    <div className='w-full h-screen flex justify-between'>
            <AdminSideBar/>
            <div className='flex-grow bg-lightBlue px-5 sm:px-10 pt-4 sm:pt-8 flex flex-col gap-y-4 overflow-y-auto relative'>
                <Outlet/>
            </div>
        </div>
  )
}

export default AdminDashboard