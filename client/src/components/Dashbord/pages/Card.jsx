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
        }
    },
    {
        title:"Move to trash",
        icon:TrashBlack,
        line:false,
        action:(ind)=>{
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
        }
    }
]
  return (
    <div className={`group flex flex-col max-h-64 w-full  rounded-xl   relative transition-shadow duration-400  hover:shadow-lg borderGrey`}>
        {/* <input className='absolute top-2 left-2 outline-none border-none scale-110 cursor-pointer hidden group-hover:inline ' type="checkbox" /> */}
        <img className='h-32 object-contain rounded-t-xl' src={proj.ThumbnailUrl === "" ? "https://img.freepik.com/free-vector/startup-success-launch-business-project_107791-4758.jpg?t=st=1714342322~exp=1714345922~hmac=81d1a808f2b5abda57ed89b74489360abce54b3c9bdc7816ecd6a489f3339b35&w=1380": proj.ThumbnailUrl} alt="Project_Picture" />
        <div className=' flex flex-col gap-y-1 p-3 bg-lightGrey flex-grow'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[14px] font-semibold'>{proj.ProjectTitle}</h1>
                <p className='text-[12px] '>{new Date().toLocaleDateString()}</p>
            </div>
            <p className='text-[12px] font-normal line-clamp-[4]'>
                {proj.Description}
            </p>
        </div>
        <div onClick={(e)=>{e.stopPropagation()}}>
          <img onClick={()=>{index !== openedMore ? setOpenedMore(index):setOpenedMore(-1)}} className='absolute bottom-3 right-2 w-4 h-4 hidden group-hover:inline cursor-pointer' src={More} alt='More'/>
          <div className={`${index !== openedMore ?"hidden":"bg-lightBlue min-w-[10.625rem] absolute bottom-8 right-4 border p-3 rounded-lg border-black sidebar"}`}>
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