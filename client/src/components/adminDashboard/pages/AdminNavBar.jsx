// eslint-disable-next-line no-unused-vars
import React,{useContext, useState} from 'react'
import propTypes from 'prop-types'
import { User, notification,blackClose, ChangePFP, ChangePassIcon, HelpIcon, FeedBackIcon, LogoutIcon } from '../../../assets'
import { Link } from 'react-router-dom'
import useUser from '../../../hooks/useUser'
const AdminNavBar = ({location}) => {
    const { user } = useUser()
    const userDetails = [
        {
            icon:ChangePFP,
            title:"Change pfp",
            path:""
        },{
            icon:ChangePassIcon,
            title:"Change password",
            path:""
        },{
            icon:HelpIcon,
            title:"Help",
            path:""
        },{
            icon:FeedBackIcon,
            title:"Feedback",
            path:"/"
        },{
            icon:LogoutIcon,
            title:"Log out",
            path:"http://localhost:3000/auth/logout"
        }
    ]
  const [toggle,setToggle] = useState(false);
  return (
    <nav className='flex items-center justify-between'>
        <h1 className='text-black font-bold text-2xl'>{location}</h1>
        <div className='flex gap-2 items-center'>
            <img className='w-8 h-8 cursor-pointer' src={notification} alt="Notification" />
            <img onClick={()=>{setToggle(prev => !prev)}} className='w-10 h-10 cursor-pointer rounded-full border-2 border-skyBlue p-0.5' src={user.profilePicUrl} alt="User" />
            <div className={`${!toggle ? "hidden":"flex border-[2px]"} p-4 bg-realWhite shadow-xl absolute z-20 top-16 right-6 mx-4 my-2 min-w-[250px] rounded-xl sidebar flex-col`}>
                    <img onClick={()=>{setToggle(prev => !prev)}} className='w-5 h-5 object-contain cursor-pointer fixed top-2 right-3' src={blackClose} alt="Close"/>
                    <div className='flex flex-col items-center mb-3'>
                        <img className='w-20 h-20 object-contain rounded-full border-2 border-skyBlue p-0.5' src={user.profilePicUrl} alt="UserPic" />
                        <p className='font-medium'>{`${user.firstName} ${user.lastName}`}</p>
                        <p>{user.email}</p>
                    </div>
                    <ul className='list-none flex justify-end items-start flex-1 flex-col'>
                        {userDetails.map((det,ind) =><div className='w-full' key={det.title}>
                            <li className={`w-full rounded-md transition-all hover:bg-[#d9e9f6]`}>
                                <Link className='flex w-full items-center  p-2'>
                                    <img className='mr-3 w-5 h-5 object-contain' src={det.icon} alt={det.title} />
                                    <p className='flex-grow'>{det.title}</p>
                                </Link>
                            </li>
                            {ind === userDetails.length -2 && <hr className='my-2 border-t-2 border-gray-300 w-full'/>}
                        </div>)}
                    </ul>
                </div>
        </div>
    </nav>
  )
}
AdminNavBar.propTypes={
    location:propTypes.string.isRequired
}
export default AdminNavBar