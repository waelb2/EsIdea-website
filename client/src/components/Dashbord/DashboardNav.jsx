// eslint-disable-next-line no-unused-vars
import React,{useRef, useState} from 'react'
import {More, Search,blackClose, User} from '../../assets';
import propTypes from 'prop-types';
import { userDetails } from './constants';
import { Link } from 'react-router-dom';
const DashboardNav = ({currentLoc,action}) => {
    const [toggleSearch,setToggleSearch] = useState(false);
    const inputRef = useRef();
    const [toggle,setToggle] = useState(false);
    return (
    <nav className='flex items-center justify-between'>
        <h1 className='text-black font-bold text-2xl'>{currentLoc}</h1>
        <div className='flex items-center gap-3'>
            <img className='w-4 h-4 md:w-6 md:h-6 cursor-pointer' src={More} alt="More" />
            <div className={`flex flex-shrink items-center justify-center gap-1 ${toggleSearch && "border-grey border-[1px] px-1 py-[6px] rounded-md"}`}>
                                <img onClick={()=>{setToggleSearch(true);inputRef.current.focus()}} className={`w-6 h-6 ${!toggleSearch && "cursor-pointer"}`} src={Search} alt="Search" />
                                <input ref={inputRef}  onChange={(e)=>{action(e)}} className={`bg-realWhite outline-none border-none min-w-0 ${!toggleSearch ?"w-0":" w-8 ss:w-16 md:w-36"} transition-all flex-shrink`} type="text" />
                                <img onClick={()=>{setToggleSearch(false)}} className={`w-5 h-5 cursor-pointer ${!toggleSearch && "hidden"}`} src={blackClose} alt="Close" />
            </div>
            <div>
                <img onClick={()=>{setToggle(prev => !prev)}} className='w-10 h-10 cursor-pointer object-contain' src={User} alt="User" />
                <div className={`${!toggle ? "hidden":"flex border-[2px]"} p-4 bg-white absolute z-20 top-16 right-6 mx-4 my-2 min-w-[250px] rounded-xl sidebar flex-col`}>
                    <img onClick={()=>{setToggle(prev => !prev)}} className='w-5 h-5 object-contain cursor-pointer fixed top-2 right-3' src={blackClose} alt="Close"/>
                    <div className='flex flex-col items-center mb-3'>
                        <img className='w-20 h-20 object-contain' src={User} alt="UserPic" />
                        <p className='font-medium'>Ahcen Chabbi</p>
                        <p>ma_chabbi@esi.dz</p>
                    </div>
                    <ul className='list-none flex justify-end items-start flex-1 flex-col'>
                        {userDetails.map((det,ind) =><div className='w-full' key={det.title}>
                            <li className={`w-full rounded-md transition-all hover:bg-lightGrey p-2`}>
                                <Link className='flex w-full items-center'>
                                    <img className='mr-3 w-5 h-5 object-contain' src={det.icon} alt={det.title} />
                                    <p className='flex-grow'>{det.title}</p>
                                </Link>
                            </li>
                            {ind === userDetails.length -2 && <hr className='my-2 border-t-2 border-gray-300 w-full'/>}
                        </div>)}
                    </ul>
                </div>
            </div>
        </div>
    </nav>
  )
}
DashboardNav.propTypes= {
    currentLoc:propTypes.string.isRequired,
    action:propTypes.func.isRequired
}
export default DashboardNav