// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react'
import propTypes from 'prop-types'
import { User, notification,blackClose } from '../../../assets'
import { userDetails } from '../../Dashbord/constants'
import { Link } from 'react-router-dom'
const AdminNavBar = ({location}) => {
  const [toggle,setToggle] = useState(false);
  return (
    <nav className='flex items-center justify-between'>
        <h1 className='text-black font-bold text-2xl'>{location}</h1>
        <div className='flex gap-2 items-center'>
            <img className='w-8 h-8 cursor-pointer' src={notification} alt="Notification" />
            <img onClick={()=>{setToggle(prev => !prev)}} className='w-10 h-10 cursor-pointer' src={User} alt="User" />
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
    </nav>
  )
}
AdminNavBar.propTypes={
    location:propTypes.string.isRequired
}
export default AdminNavBar