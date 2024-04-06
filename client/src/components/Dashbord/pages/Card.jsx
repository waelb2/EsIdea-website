// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { More } from '../../../assets'
import { projectDetails } from '../constants'
import { Link } from 'react-router-dom'
const Card = ({img,title,date,description,checked,handleCheck}) => {
  const [toggle,setToggle] = useState(false);
  return (
    <div className={`group flex flex-col h-[256px] w-full ss:w-[278px] sm:w-[47%] lg:w-[295px] rounded-xl   relative transition-shadow duration-400 hover:shadow-lg ${checked ? "border-solid border-skyBlue border-[2.5px]":"borderGrey"}`}>
        <input  onChange={handleCheck} className='absolute top-2 left-2 outline-none border-none scale-110 cursor-pointer hidden group-hover:inline ' type="checkbox" />
        <img className='h-[128px] object-cover rounded-t-xl' src={img} alt="Project_Picture" />
        <div className=' flex flex-col gap-y-1 p-3 bg-lightGrey flex-grow'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[14px] font-semibold'>{title}</h1>
                <p className='text-[12px] '>{date}</p>
            </div>
            <p className='text-[12px] font-normal'>
                {description}
            </p>
        </div>
        <img onClick={()=>{setToggle(prev => !prev)}} className='absolute bottom-3 right-2 w-4 h-4 hidden group-hover:inline cursor-pointer' src={More} alt='More'/>
        <div className={`${!toggle ?"hidden":"bg-lightBlue min-w-[170px] absolute bottom-8 right-4 border-[1px] p-3 rounded-lg border-black sidebar"}`}>
            <ul>
                {projectDetails.map(pd=><li className={`transition-all rounded-md hover:bg-lightGrey`} key={pd.title}>
                  <Link className={`flex px-2 py-1 items-center`}>
                    <img className='mr-2' src={pd.icon} alt={pd.title} />
                    <p>{pd.title}</p>
                  </Link>
                  {pd.line && <hr className='border-t-2 border-gray-300 my-0.5'/>}
                </li>)}
            </ul>
        </div>
    </div>
  )
}
Card.propTypes = {
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    checked:PropTypes.bool,
    handleCheck:PropTypes.func.isRequired
  };
export default Card