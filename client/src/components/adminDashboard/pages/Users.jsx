// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import AdminNavBar from './AdminNavBar'
import SearchCat from './SearchCat'
import axios from '../../../utils/axios'
import {useReactTable,flexRender,getCoreRowModel,getPaginationRowModel,getFilteredRowModel} from '@tanstack/react-table'
import { Hammer, Remove, View } from '../../../assets'
import { MagnifyingGlass } from 'react-loader-spinner'
const Users = () => {
  const [searchInput,setSearchInput] = useState("");
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const getUsers = async()=>{
    setLoading(true);
    try {
    const response = await axios.get("http://localhost:3000/admin/users");
    if (response.statusText == 'OK') {
      setData(response.data);
      setLoading(false);
    } else {
        console.log(response)
        throw new Error ("Authentication has failed")
    }
    } catch (error) {
        console.log(error);
    }
}
  const columns=[
    {
      header:"Full name",
      accessorFn:row=>`${row.firstName} ${row.lastName}`
    },
    {
      header:"Email",
      accessorKey:'email'
    },{
      header:"Date",
      accessorKey:'joinDate',
      accessorFn:row=> new Date(row.joinDate).toLocaleDateString({ 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric', 
        timeZoneName: 'short' 
      })
    }
]
useEffect(()=>{
  getUsers();
},[]);
const deleteUser = async (id) => {
  try {
    const response = await axios.delete("admin/users", { data: { id } });
    if (response.statusText === 'OK') {
      getUsers();
    } else {
      console.log(response);
      throw new Error("Authentication has failed");
    }
  } catch (error) {
    console.log(error);
  }
};
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel:getPaginationRowModel(),
  getFilteredRowModel:getFilteredRowModel(),
  state:{
    globalFilter: searchInput
  },
  onGlobalFilterChange:setSearchInput
})
const tdStyle="py-2 text-center border-lightGrey border-[1px]"
return (
    <>
      <AdminNavBar location='Users'/>
      <SearchCat setSearchInput={setSearchInput}/>
      {data.length !== 0?<>
        <div className='mb-3 overflow-x-auto'>
        <table className='w-full max-w-full bg-white rounded-xl border-collapse'>
          <thead>
              {table.getHeaderGroups().map(headerGroup =>(
                <tr  key={headerGroup.id}>
                  {headerGroup.headers.map(header=>(
                    <th className={tdStyle} key={header.id}>
                      {flexRender(header.column.columnDef.header,header.getContext())}
                    </th>
                  ))}
                  <th className={tdStyle}>Options</th>
                </tr>
              ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row=>(
              <tr className='hover:bg-lightGrey transition-all' key={row.id}>
                {row.getVisibleCells().map(cell=>(
                  <td className={`${tdStyle}`} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell,cell.getContext())
                    }
                  </td>
                ))}
                <td key={row.id} className={`${tdStyle} flex justify-center px-2`}>
                  {/* <img className='cursor-pointer' src={View} alt="View" />
                  <img className='cursor-pointer' src={Hammer} alt="Hammer" /> */}
                  <img title='Delete user' onClick={()=>{deleteUser(row.original._id)}} className='cursor-pointer' src={Remove} alt="Remove" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex flex-col ss:flex-row items-center justify-between mb-3'>

          <div className='flex items-center gap-2 order-2 ss:order-1 mb-2 ss:mb-0'>

            <button onClick={()=>{table.previousPage()}} className={`bg-white p-2 rounded-lg flex items-center gap-1 border-[1px] border-transparent hover:border-black transition-all duration-500 ${!table.getCanPreviousPage()&& "pointer-events-none"}`}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" strokeWidth="2" points="7 2 17 12 7 22" transform="matrix(-1 0 0 1 24 0)"></polyline>
              </svg>
              <p>Prev</p>
            </button>

            <button onClick={()=>{table.nextPage()}}  className={`bg-white p-2 rounded-lg flex items-center gap-1 border-[1px] border-transparent hover:border-black transition-all duration-500 ${!table.getCanNextPage()&&"pointer-events-none"}`}>
              <p>Next</p>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" strokeWidth="2" points="7 2 17 12 7 22"></polyline>
              </svg>
            </button>

          </div>

            <p className='bg-white p-2 rounded-lg flex items-center font-semibold mb-2 ss:mb-0 order-1 ss:order-2'>{table.getState().pagination.pageIndex + 1} of{" "} {table.getPageCount()}
            </p>

          <div className='flex items-center gap-2 order-3'>
            <button onClick={()=>{table.setPageIndex(0)}} className='bg-white p-2 rounded-lg border-[1px] border-transparent hover:border-black transition-all duration-500'>First page</button>
            <button onClick={()=>{table.setPageIndex(table.getPageCount()-1)}} className='bg-white p-2 rounded-lg border-[1px] border-transparent hover:border-black transition-all duration-500'>Last page</button>
          </div>

        </div>
      </>:loading ?<div className='h-full w-full flex justify-center items-center'>
            <MagnifyingGlass
                visible={true}
                height="80"
                width="80"
                ariaLabel="magnifying-glass-loading"
                wrapperStyle={{}}
                wrapperClass="magnifying-glass-wrapper"
                glassColor="#c0efff"
                color="#59AEF8"
                />
            </div>:<div className='h-full w-full flex justify-center items-center'>
                  <h1 className='font-semibold text-lg'>No users</h1>
              </div>}
    </>
  )
}

export default Users