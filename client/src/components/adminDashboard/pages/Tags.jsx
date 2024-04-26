// eslint-disable-next-line no-unused-vars
import React from 'react'
import AdminNavBar from './AdminNavBar'
import SearchCat from './SearchCat'
const Tags = () => {
  return (
    <>
      <AdminNavBar location='Tags'/>
      <div className='flex justify-between flex-col gap-2 ss:gap-0 ss:flex-row items-center'>
        <SearchCat/>
        <button className='px-4 rounded-lg self-stretch bg-skyBlue text-white flex  items-center justify-between'>
          <p>Add new tag &nbsp;</p>
         <span className='text-3xl'>+</span>
        </button>
      </div>
    </>
  )
}

export default Tags