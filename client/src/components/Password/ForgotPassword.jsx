// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import NavBar from '../LandingPage/NavBar'
import { ForgotPasswordImage } from '../../assets'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email,setEmail]=useState("");
    const data = { email: email };
    const handleForgotPassword = () => {
        axios.post('auth/forgetPassword', data, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => {
            navigate("/login", { state: { fromForgotPassword: true } });
          })
          .catch((error) => {
            toast.error(error.response.data.message, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "colored",
              });
          });
      };
    // const handleForgotPassword=()=>{
    //     fetch(url, {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //         'Content-type': 'application/json; charset=UTF-8',
    //     },
    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         navigate("/login", { state: { fromForgotPassword: true } })
    //     })
    //     .catch((err) => {
    //         console.log(err.message);
    //     });
    // }
  return (
    <div className="bg-white w-full overflow-hidden min-h-screen flex flex-col">
        <div className="sm:px-16 px-6 flex justify-center items-center">
            <div className="xl:max-w-[1280px] w-full">
                <NavBar/>
            </div>
        </div>
          <div className='sm:px-16 px-6 flex justify-center items-center h-full flex-grow'>
                <div className='xl:max-w-[1280px] w-full h-full flex md:flex-row md:justify-center gap-6 flex-col items-center'>
                    <div className='shadow-md rounded-lg px-7 py-10  max-w-[450px] w-full mt-5 md:mt-0 border-[2px] border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-3' >
                        <h1 className='font-bold text-2xl'>Forgot Password</h1>
                        <p className='text-sm'>Please enter your email address below. Further instructions on how to reset your password will be sent to you.</p>
                        <form className='w-full flex flex-col gap-4' action="">
                            <div className='flex flex-col gap-1'>
                                <label className='text-gray-500' htmlFor="Emailid">Email :</label>
                                <input onChange={(e)=>{setEmail(e.target.value)}} id='Emailid' className='border-gray-300 border-2 rounded-xl text-base p-2 outline-none' placeholder='Enter your email' type="text" />
                            </div>
                            <button onClick={(e)=>{e.preventDefault();handleForgotPassword()}} className='self-center bg-skyBlue px-12 py-3 rounded-full text-white font-semibold shadow-custom hover:shadow-hover transition-shadow duration-500'>Submit</button>
                        </form>
                    </div>
                    <img className='w-[400px] h-[400px] object-cover mt-3 md:mt-0 p-6 ' src={ForgotPasswordImage} alt="ForgotPasswordImage" />
                </div>
          </div>
          <ToastContainer/>
    </div>


  )
}

export default ForgotPassword