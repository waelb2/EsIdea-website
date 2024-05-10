// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import AdminNavBar from './AdminNavBar'
import SearchCat from './SearchCat'
import axios from '../../../utils/axios'
import {useReactTable,flexRender,getCoreRowModel,getPaginationRowModel,getFilteredRowModel} from '@tanstack/react-table'
import {Remove } from '../../../assets'
import PopUpTags from './PopUpTags'
import { MessageToUserContext } from '../AdminDashboard'
const Tags = () => {
  const displayMessageToUser = useContext(MessageToUserContext)
  const [data,setData] = useState([]);
  const [searchInput,setSearchInput] = useState("");
  const [type,setType] = useState("module");
  const getTags = async () => {
    try {
      const response = await axios.get("admin/tags", { params: { type:type } });
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.log(response);
        throw new Error("Authentication has failed");
      }
    } catch (error) {
      console.error(error);
    }
  };  
  useEffect(()=>{
    getTags();
  },[type]);
  const moduleColumns = [{
    header:"Module name",
    accessorKey:"moduleName"
  },
  {
    header:"Code",
    accessorKey:"description.title"
  },{
    header:"Field",
    accessorKey:'description.field',
  },
  {
    header:"Coef",
    accessorKey:"description.coef"
  },
  {
    header:"Edition year",
    accessorKey:"description.edition"
  }]
  const clubColumns = [
    {
      header:"Club name",
      accessorKey:"clubName"
    },
    {
      header:"Creation date",
      accessorKey:"description.creationDate"
    },{
      header:"Number of events",
      accessorKey:'description.numberOfEvents',
    }
]
  const eventColumns = [{
    header:"Event name",
    accessorKey:"eventName"
  },{
    header:"Description",
    accessorKey:"description"
  }]
  const [columns,setColumns] = useState(moduleColumns)
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
  const tdStyle="py-2 text-center border-lightGrey border-[1px]";
  const deleteTag = async(id,type) =>{
    try {
      const response = await axios.delete("admin/tags", { data: { id,type } });
      if (response.statusText === 'OK') {
        getTags();
        displayMessageToUser("success","Tag deleted successfully")
      } else {
        console.log(response);
        throw new Error("Authentication has failed");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const [active,setActive] = useState(false);
  const tags = [
    {
      tagType:"module",
      action:()=>{
        setType("module");
        setActive(false);
        setColumns(moduleColumns);
      }
    },
    {
      tagType:"club",
      action:()=>{
        setType("club");
        setActive(false);
        setColumns(clubColumns);
      }
    },
    {
      tagType:"event",
      action:()=>{
        setType("event");
        setActive(false);
        setColumns(eventColumns);
      }
    }
  ]
  const [visible,setVisible] = useState(false);
  const [operation,setOperation] = useState("");
  const [tagToModify,setTagToModify] = useState({});
  return (
    <>
      <PopUpTags visible={visible} closePopUp={()=>{setVisible(false)}} operation={operation} type={type} tagToModify={tagToModify} getTags={getTags}/>
      <AdminNavBar location='Tags'/>
      <div className='flex justify-between flex-col gap-2 ss:gap-0 ss:flex-row items-center'>
        <div className='flex gap-7 w-4/5 items-center'>
          <SearchCat setSearchInput={setSearchInput}/>
          <div className='relative'>
            <div onClick={()=>{setActive(prev => !prev)}} className='text-center py-1 px-4 mb-1 cursor-pointer border-2 border-slate-700 bg-realWhite rounded-md min-w-[6.161rem]'>{type}</div>
            <div className={`bg-realWhite border-2 border-slate-700 absolute overflow-hidden top-full  rounded-md shadow-xl ${!active && "hidden"}`}>
                {tags.map(tag=><div className='px-4 py-1 cursor-pointer text-center hover:bg-gray-200' onClick={tag.action} key={tag.tagType}>{tag.tagType}</div>)}
            </div>
          </div>
        </div>
        
        <button onClick={()=>{
          setOperation("Add");
          setVisible(true);
        }} className='px-2 rounded-lg self-stretch bg-skyBlue text-white flex  items-center justify-between'>
          <p>Add new {type} &nbsp;</p>
         <span className='text-3xl'>+</span>
        </button>
      </div>
      {data.length !== 0?<>
        <div className='mb-3 overflow-auto'>
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
                <td key={row.id} className={`${tdStyle} flex justify-between px-2`}>
                <svg onClick={()=>{setOperation("Modify");setTagToModify(row.original);setVisible(true)}} className='cursor-pointer' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"></path></svg>
                  <img onClick={()=>{
                      deleteTag(row.original._id,type)
                  }}   className='cursor-pointer' src={Remove} alt="Remove" />
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
      </>:null}
    </>
  )
}

export default Tags