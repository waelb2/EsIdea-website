// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react'
import { whiteLogo,close,arrow} from '../../assets';
import {NavLinks} from './constants';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Chat from '../ChatBot/Chat';
import { RxDashboard } from "react-icons/rx";
import useUser from '../../hooks/useUser';
const SideBar = () => {
    const {pathname} = useLocation()  
    const [toggle,setToggle] = useState(false);
    const {user} = useUser();
    const navigate = useNavigate();
    return (
        <aside className={`${toggle ? "left-0":"-left-64"} w-64 h-screen bg-darkBlue px-4 py-5 absolute md:sticky md:left-0 transition-all duration-500 z-10 flex-shrink-0`}>
            <Chat/>
            <div className={`flex items-center justify-between md:justify-center mb-9`}>
                <img className='w-32 h-10 md:self-center' src={whiteLogo} alt="ESIdea_logo" />
                <img onClick={()=>{setToggle(false)}} className='w-4 h-4 object-contain cursor-pointer block md:hidden' src={close} alt="close_icon" />
            </div>
            <ul className='flex flex-col gap-3'>
                {NavLinks.map( nav => (
                    <li onClick={()=>{toggle && setToggle(false)}} className={`${pathname === nav.path ? "bg-primary" : null} w-56 rounded-lg cursor-pointer`} key={nav.title}>
                        <Link className='text-white flex items-center gap-3 p-2' to={`${nav.path}`}>
                            <img className='object-contain w-6 h-6' src={nav.icon} alt={`${nav.title}_icon`} />
                            <p className='font-medium text-sm'>{nav.title}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <img onClick={()=>{setToggle(prev => !prev)}}  className={`${toggle ?"hidden":"block"} cursor-pointer md:hidden w-7 h-7 absolute top-[45%] left-[250px]`} src={arrow} alt="slide_right"/>
            {user.role === "admin"?
                <button onClick={()=>{navigate("/Admin/Statistics")}} className='absolute bottom-3 text-realWhite flex gap-2 items-center bg-transparent transition-all duration-500 border-realWhite border-2 p-1 rounded-md group hover:bg-realWhite hover:text-black w-56 justify-center'>
                    <RxDashboard className='fill-realWhite group-hover:fill-black w-5 h-5' />
                    <span>Admin Dashboard</span>
                </button>
            :null}
        </aside>
  )
}

export default SideBar