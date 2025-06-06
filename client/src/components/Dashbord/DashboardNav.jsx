// eslint-disable-next-line no-unused-vars
import React,{useRef, useState,useContext} from 'react'
import {More, Search,blackClose, ChangePFP, ChangePassIcon, HelpIcon, FeedBackIcon, LogoutIcon} from '../../assets';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import ChangePfp from './ChangePfp';
import SendFeedBackPopUp from './SendFeedBackPopUp';
const DashboardNav = ({currentLoc,action}) => {
    const { user } = useUser();
    const [changePfpVisible,setChangePfpVisible] = useState(false);
    const [sendFeedbackVisible,setSendFeedbackVisible] = useState(false);
    const [tooltip,setToolTip] = useState("");
    const closePopUp = ()=>{
        setChangePfpVisible(false);
    }
    const openPopUp = ()=>{
        setChangePfpVisible(true);
    }
    const userDetails = [
        {
            icon:ChangePFP,
            title:"Change pfp",
            path:"",
            action:()=>{
                openPopUp();
            }
        },{
            icon:ChangePassIcon,
            title:"Change password",
            path:"/ChangePassword"
        },{
            icon:HelpIcon,
            title:"Help",
            path:"/faq",
            target: "_blank",
            rel: "noopener noreferrer",
            action:()=>{
                
            }
        },{
            icon:FeedBackIcon,
            title:"Feedback",
            path:"",
            action:()=>{
                setSendFeedbackVisible(true);
            }
        },{
            icon:LogoutIcon,
            title:"Log out",
            path: import.meta.env.VITE_API_URL + "/auth/logout",
            action:()=>{
                    localStorage.removeItem('user')
                    localStorage.removeItem('userToken')
            }
        }
    ]
    const [toggleSearch,setToggleSearch] = useState(false);
    const inputRef = useRef();
    const [toggle,setToggle] = useState(false);
    return (
    <nav className='flex items-center justify-between'>
        <h1 className='text-black font-bold text-2xl'>{currentLoc}</h1>
        <div className='flex items-center gap-3'>
            {/* <img className='w-4 h-4 md:w-6 md:h-6 cursor-pointer' src={More} alt="More" /> */}
            <div className={`flex flex-shrink items-center justify-center gap-1 ${toggleSearch && "border-grey border px-1 py-[0.375rem] rounded-md"}`}>
                                <div className='relative'>
                                    <img onMouseLeave={()=>{setToolTip("")}} onMouseOver={()=>{setToolTip("Search")}} onClick={()=>{setToggleSearch(true);inputRef.current.focus()}} className={`w-6 h-6 ${!toggleSearch && "cursor-pointer"}`} src={Search} alt="Search" />
                                    <span className={`${tooltip === "Search" ? "opacity-100" : "opacity-0"} absolute bottom-full left-1/2 -translate-x-1/2 transition-opacity duration-500 bg-gray-500 text-realWhite px-1 py-0.5 rounded-md text-sm mb-1`}>Search</span>
                                </div>
                                <input ref={inputRef}  onChange={(e)=>{action(e)}} className={`bg-realWhite outline-none border-none min-w-0 ${!toggleSearch ?"w-0":" w-8 ss:w-16 md:w-36"} transition-all flex-shrink`} type="text" />
                                <img onClick={()=>{setToggleSearch(false)}} className={`w-5 h-5 cursor-pointer ${!toggleSearch && "hidden"}`} src={blackClose} alt="Close" />
            </div>
            <div>
                <div className='relative'>
                    <img onMouseLeave={()=>{setToolTip("")}} onMouseOver={()=>{setToolTip("Profile")}} onClick={()=>{setToggle(prev => !prev)}} className='w-10 h-10 cursor-pointer object-contain rounded-full border-2 border-skyBlue p-0.5' src={user.profilePicUrl} alt="User" />
                    <span className={`${tooltip === "Profile" ? "opacity-100" : "opacity-0"} absolute bottom-full left-1/2 -translate-x-1/2 transition-opacity duration-500 bg-gray-500 text-realWhite px-1 py-0.5 rounded-md text-sm mb-1`}>Profile</span>
                </div>
                <div className={`${!toggle ? "hidden":"flex border-2"} p-4 bg-realWhite absolute z-20 top-16 right-6 shadow-xl mx-4 my-2 min-w-[15.625rem] rounded-xl slideDown flex-col overflow-hidden`}>
                    <img onClick={()=>{setToggle(prev => !prev)}} className='w-5 h-5 object-contain cursor-pointer fixed top-2 right-3' src={blackClose} alt="Close"/>
                    <div className='flex flex-col items-center mb-3'>
                        <img className='w-20 h-20 rounded-full object-contain mb-2 border-2 border-skyBlue p-0.5' src={user.profilePicUrl} alt="UserPic" />
                        <p className='font-medium'>{`${user.firstName} ${user.lastName}`}</p>
                        <p>{user.email}</p>
                    </div>
                    <ul className='list-none flex justify-end items-start flex-1 flex-col'>
                        {userDetails.map((det,ind) =><div className='w-full' key={det.title}>
                            <li className={`w-full rounded-md transition-all hover:bg-[#d9e9f6]`}>
                                <Link onClick={det.action} to={det.path} {...(det.target && { target: det.target })}
                                    {...(det.rel && { rel: det.rel })} className='flex w-full items-center  p-2'>
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
        <ChangePfp visible={changePfpVisible} closePopUp={closePopUp}/>
        <SendFeedBackPopUp visible={sendFeedbackVisible} closePopUp={()=>{
            setSendFeedbackVisible(false);
        }} />
    </nav>
  )
}
DashboardNav.propTypes= {
    currentLoc:propTypes.string.isRequired,
    action:propTypes.func.isRequired
}
export default DashboardNav