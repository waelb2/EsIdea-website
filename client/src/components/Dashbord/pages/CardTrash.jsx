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
    <div className={`group flex flex-col h-[256px] w-full rounded-xl   relative transition-shadow duration-400 borderGrey hover:shadow-lg`}>
        {/* <input  onChange={handleCheck} className='absolute top-2 left-2 outline-none border-none scale-110 cursor-pointer hidden group-hover:inline ' type="checkbox" /> */}
        <img className='h-[128px] object-cover rounded-t-xl' src={proj.ThumbnailUrl} alt="Project_Picture" />
        <div className=' flex flex-col gap-y-1 p-3 bg-lightGrey flex-grow'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[14px] font-semibold'>{proj.ProjectTitle}</h1>
                <p className='text-[12px] '>{proj.date}</p>
            </div>
            <p className='text-[12px] font-normal'>
                {proj.Description}
            </p>
        </div>
        <div onClick={(e)=>{e.stopPropagation()}}>
          <img onClick={()=>{index !== openedMore ? setOpenedMore(index):setOpenedMore(-1)}} className='absolute bottom-3 right-2 w-4 h-4 hidden group-hover:inline cursor-pointer' src={More} alt='More'/>
          <div className={`${index !== openedMore ?"hidden":"bg-lightBlue min-w-[170px] absolute bottom-8 right-4 border-[1px] p-3 rounded-lg border-black sidebar"}`}>
              <ul>
                  {projectTrashDetails.map(pd=><li key={pd.title}>
                    <Link className={`flex px-2 py-1 items-center hover:bg-lightGrey  rounded-md transition-all`}>
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