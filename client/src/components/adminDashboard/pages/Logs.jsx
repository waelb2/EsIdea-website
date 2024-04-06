// eslint-disable-next-line no-unused-vars
import React from 'react'
import AdminNavBar from './AdminNavBar'
import SearchCat from './SearchCat'
const Logs = () => {
  return (
    <>
      <AdminNavBar location='Logs'/>
      <div className='flex justify-between flex-col gap-2 ss:gap-0 ss:flex-row items-center'>
        <SearchCat/>
        <button className='bg-lightGrey px-3 self-stretch rounded-2xl shadow-md'>
            Empty Logs
        </button>
      </div>
    </>
  )
}

export default Logs