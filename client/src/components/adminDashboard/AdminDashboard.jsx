// eslint-disable-next-line no-unused-vars
import React, { createContext } from 'react'
import AdminSideBar from './AdminSideBar'
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
export const MessageToUserContext = createContext();
const AdminDashboard = () => {
  const displayMessageToUser = (type,message)=>{
    if(type === "success"){
      toast.success(message, {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
        });
    }else if(type === "error"){
      toast.error(message, {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
        });
    }
  }
  return (
    <div className='w-full h-screen flex justify-between'>
            <AdminSideBar/>
            <div className='flex-grow bg-lightBlue px-5 sm:px-10 pt-4 sm:pt-8 flex flex-col gap-y-4 overflow-y-auto relative'>
              <MessageToUserContext.Provider value={displayMessageToUser}>
                <Outlet/>
              </MessageToUserContext.Provider>
            </div>
            <ToastContainer/>
        </div>
  )
}

export default AdminDashboard