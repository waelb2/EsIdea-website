// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Form from './Form';
import {loginPic,google} from '../../assets';
import { useLocation } from 'react-router-dom';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const LoginPage = () => {
  const {state} = useLocation();
  const [fromResetPassword,setFromResetPassword] = useState(false);
  const [fromForgotPassword,setFromForgotPassword] = useState(false);
  useEffect(()=>{
    if(state){
      // eslint-disable-next-line no-prototype-builtins
      if(state.hasOwnProperty('fromResetPassword')){
        setFromResetPassword(true);
      }
      // eslint-disable-next-line no-prototype-builtins
      if(state.hasOwnProperty('fromForgotPassword')){
        setFromForgotPassword(true);
      }
    }
  },[state])
  useEffect(()=>{
      if(fromResetPassword){
        toast.success('Password reset successfully. you can login with your new password', {
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
      if(fromForgotPassword){
        toast.success('A reset password email has been sent to your email address.', {
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
  },[fromResetPassword,fromForgotPassword])
  const login = ()=>{
    window.open("http://localhost:3000/auth/google","_self")
  }
  return (
    <>
    <div className="bg-white w-full overflow-hidden min-h-screen flex flex-col">
      <div className="sm:px-16 px-6 flex justify-center items-center">
          <div className="xl:max-w-[1280px] w-full">
              <Navbar/>
          </div>
      </div>
      <div className='sm:px-16 px-6 flex justify-center items-center h-full flex-grow'>
          <div className='xl:max-w-[1280px] w-full h-full flex md:flex-row md:justify-around flex-col-reverse items-center'>
              <img className='w-[450px] h-[450px] object-cover mt-3 md:mt-0 p-6 ' src={loginPic} alt="Brain" />
              <div className='shadow-md rounded-lg p-7  max-w-[450px] w-full mt-5 md:mt-0 border-[2px] border-[rgba(0,0,0,0.1)]'>
                <div className='mb-4'>
                  <h4 className='text-2xl font-medium'>Welcome to</h4>
                  <h1 className='text-skyBlue font-black text-2xl'>ESIdea</h1>
                </div>
                <button onClick={login}  className='flex gap-2 items-center justify-center rounded-[10px] shadow-[0_1px_6px_rgb(0,0,0,0.2)] w-full py-[11px] mb-5'>
                  <img className='w-[28px] h-[28px]' src={google} alt="Google_Icon" />
                  <span className='text-grey font-medium'>Login with Google</span>
                </button>
                  <div className='relative mb-4 h-2 flex items-center justify-center'>
                    <hr className='w-full h-[1px] bg-grey'/>
                    <span className='absolute bg-white px-3 text-grey font-medium'>Or</span>
                  </div>
                <Form/>
              </div>
          </div>
      </div>
    </div>
    <ToastContainer />
    </>
  )
}
export default LoginPage