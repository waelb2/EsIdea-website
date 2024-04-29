// eslint-disable-next-line no-unused-vars
import React from 'react'
import PropTypes from 'prop-types'
import { More, RemoveRed, Restore } from '../../../assets'
import { Link } from 'react-router-dom'
const CardTrash = ({proj,index,openedMore,setOpenedMore}) => {
    const projectTrashDetails = [
        {
            title:"Restore",
            icon:Restore,
            line:false
        },
        {
            title:"Remove",
            icon:RemoveRed,
            line:false
        }
    ]
  return (
    <div className={`group flex flex-col w-full  rounded-xl   relative transition-all duration-500   hover:shadow-lg borderGrey cursor-pointer`}>
        {/* <input  onChange={handleCheck} className='absolute top-2 left-2 outline-none border-none scale-110 cursor-pointer hidden group-hover:inline ' type="checkbox" /> */}
        <img className='h-32 object-cover rounded-t-xl' src={proj.ThumbnailUrl} alt="Project_Picture" />
        <div className=' flex flex-col gap-y-1 p-3 bg-slate-100  rounded-b-xl flex-grow'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[14px] font-semibold'>{proj.ProjectTitle}</h1>
                <p className='text-[12px] '>{proj.date}</p>
            </div>
            <p className='text-sm text-grey font-medium line-clamp-[4]'>
                {proj.Description}
            </p>
        </div>
        <div onClick={(e)=>{e.stopPropagation()}}>
          <img onClick={()=>{index !== openedMore ? setOpenedMore(index):setOpenedMore(-1)}} className='absolute bottom-2 right-2  w-6 h-6 duration-500 transition-all rounded-full p-1 hover:bg-slate-300 hidden group-hover:inline cursor-pointer' src={More} alt='More'/>
          <div className={`${index !== openedMore ?"hidden":"bg-realWhite min-w-[10.625rem] absolute shadow-xl bottom-8 right-4 border p-3 rounded-lg border-black sidebar"}`}>
              <ul>
                  {projectTrashDetails.map(pd=><li key={pd.title}>
                    <Link className={`flex px-2 py-1 items-center hover:bg-[#d9e9f6]  rounded-md transition-all`}>
                      <img className='mr-2' src={pd.icon} alt={pd.title} />
                      <p>{pd.title}</p>
                    </Link>
                    {pd.line && <hr className='border-t-2 border-gray-300 my-0.5'/>}
                  </li>)}
              </ul>
          </div>
        </div>
    </div>
  )
}
CardTrash.propTypes = {
  proj:PropTypes.object,
  index:PropTypes.number.isRequired,
  openedMore:PropTypes.number.isRequired,
  setOpenedMore:PropTypes.func.isRequired
  };
export default CardTrash