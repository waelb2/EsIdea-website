// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import AdminNavBar from './AdminNavBar'
import SearchCat from './SearchCat'
import axios from '../../../utils/axios'
const Logs = () => {
  const [searchInput,setSearchInput] = useState("");
  return (
    <>
      <AdminNavBar location='Logs'/>
      <div className='flex justify-between flex-col gap-2 ss:gap-0 ss:flex-row items-center'>
        <SearchCat setSearchInput={setSearchInput}/>
        <button className='bg-lightGrey px-3 self-stretch rounded-2xl shadow-md'>
            Empty Logs
        </button>
      </div>
    </>
  )
}

export default Logs