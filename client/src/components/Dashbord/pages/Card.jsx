// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Colaborators, Edit, ExportProj, More, MoveFavorite, OpenProj, Publish, TrashBlack } from '../../../assets'

const Card = ({proj,index,openedMore,setOpenedMore,handleEditProjects}) => {
  const projectDetails = [
    {
        title:"Open",
        icon:OpenProj,
        line:false,
        action:(ind)=>{
            console.log(ind);
        }
    },
    {
        title:"Edit file info",
        icon:Edit,
        line:true,
        action:(ind)=>{
          handleEditProjects(ind);

        }
    },
    {
        title:"Move to favorites",
        icon:MoveFavorite,
        line:false,
        action:(ind)=>{
          console.log(ind);
        }
    },
    {
        title:"Move to trash",
        icon:TrashBlack,
        line:false,
        action:(ind)=>{
          console.log(ind);
        }
    },
    {
        title:"Publish",
        icon:Publish,
        line:true,
        action:(ind)=>{
          console.log(ind);
        }
    },
    {
        title:"Export",
        icon:ExportProj,
        line:true,
        action:(ind)=>{
          console.log(ind);
        }
    },
    {
        title:"Colaborators",
        icon:Colaborators,
        line:false,
        action:(ind)=>{
          console.log(ind);
        }
    }
]
  return (
    <div className={`group flex flex-col h-[256px] w-full  rounded-xl   relative transition-shadow duration-400 hover:shadow-lg borderGrey`}>
        {/* <input className='absolute top-2 left-2 outline-none border-none scale-110 cursor-pointer hidden group-hover:inline ' type="checkbox" /> */}
        <img className='h-[128px] object-cover rounded-t-xl' src={proj.thumbnailUrl} alt="Project_Picture" />
        <div className=' flex flex-col gap-y-1 p-3 bg-lightGrey flex-grow'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[14px] font-semibold'>{proj.title}</h1>
                <p className='text-[12px] '>{proj.date}</p>
            </div>
            <p className='text-[12px] font-normal'>
                {proj.description}
            </p>
        </div>
        <div onClick={(e)=>{e.stopPropagation()}}>
          <img onClick={()=>{index !== openedMore ? setOpenedMore(index):setOpenedMore(-1)}} className='absolute bottom-3 right-2 w-4 h-4 hidden group-hover:inline cursor-pointer' src={More} alt='More'/>
          <div className={`${index !== openedMore ?"hidden":"bg-lightBlue min-w-[170px] absolute bottom-8 right-4 border-[1px] p-3 rounded-lg border-black sidebar"}`}>
              <ul>
                  {projectDetails.map(pd=><li key={pd.title}>
                    <button onClick={()=>{pd.action(index)}}  className={`flex px-2 py-1 items-center hover:bg-lightGrey w-full  rounded-md transition-all`}>
                      <img className='mr-2' src={pd.icon} alt={pd.title} />
                      <p>{pd.title}</p>
                    </button>
                    {pd.line && <hr className='border-t-2 border-gray-300 my-0.5'/>}
                  </li>)}
              </ul>
          </div>
        </div>
    </div>
  )
}
Card.propTypes = {
    proj:PropTypes.object,
    index:PropTypes.number.isRequired,
    openedMore:PropTypes.number.isRequired,
    setOpenedMore:PropTypes.func.isRequired,
    handleEditProjects:PropTypes.func.isRequired
  };
export default Card