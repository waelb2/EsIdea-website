// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react'
import { logo,close,arrow} from '../../assets';
import {AdminNavLinks} from './constants';
import {Link, useLocation} from 'react-router-dom';
const AdminSideBar = () => {
    const {pathname} = useLocation()
    const [toggle,setToggle] = useState(false);
    return (
        <aside className={`${toggle ? "left-0":"-left-64"} w-64 h-screen bg-darkBlue px-4 py-5 absolute md:sticky md:left-0 transition-all duration-500 z-10 flex-shrink-0`}>
            <div className='flex items-center justify-between mb-5'>
                <img className='w-32 h-8' src={logo} alt="ESIdea_logo" />
                <img onClick={()=>{setToggle(false)}} className='w-4 h-4 object-contain cursor-pointer block md:hidden' src={close} alt="close_icon" />
            </div>
            <ul className='flex flex-col gap-3'>
                {AdminNavLinks.map( nav => (
                    <li onClick={()=>{toggle && setToggle(false)}} className={`${pathname === nav.path ? "bg-skyBlue" : null} w-56 rounded-lg cursor-pointer`} key={nav.title}>
                        <Link className='text-white flex items-center gap-3 p-2' to={`${nav.path}`}>
                            <img className='object-contain w-6 h-6' src={nav.icon} alt={`${nav.title}_icon`} />
                            <p className='font-medium text-sm'>{nav.title}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <img onClick={()=>{setToggle(prev => !prev)}}  className={`${toggle ?"hidden":"block"} cursor-pointer md:hidden w-7 h-7 absolute top-[45%] left-[250px]`} src={arrow} alt="slide_right"/>
        </aside>
  )
}

export default AdminSideBar