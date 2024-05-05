// eslint-disable-next-line no-unused-vars
import React,{useState,useEffect} from 'react'
import NavBar from '../LandingPage/NavBar'
import { Eye, ResetPasswordImage, hidePassword } from '../../assets'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';


const ResetPassword = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [toggle1,setToggle1] = useState(false);
    const [toggle2,setToggle2] = useState(false);
    const [password,setPassword] = useState("");
    const [passwordError,setPasswordError] = useState(false);
    const [passwordConfirm,setPasswordConfirm] = useState("");
    const [passwordConfirmError,setPasswordConfirmError] = useState(false);
    useEffect(()=>{
        if(password.length < 8 && password !== ""){
            setPasswordError(true);
        }else{
            setPasswordError(false);
        }
    },[password])
    

    useEffect(()=>{
        if(password !== "" && passwordConfirm !== "" && password !== passwordConfirm){
            setPasswordConfirmError(true);
        }else{
            setPasswordConfirmError(false);
        }
    },[passwordConfirm])
    const data = { newPassword: password,confirmNewPassword:passwordConfirm };

    // const resetPass = (e)=>{
    //     e.preventDefault();
    //     if(!passwordError && !passwordConfirmError){
    //         fetch(`http://localhost:3000${pathname}`, {
    //         method: 'PATCH',
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-type': 'application/json; charset=UTF-8',
    //         },
    //         })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             navigate("/login", { state: { fromResetPassword: true } })
    //         })
    //         .catch((err) => {
    //             console.log(err.message);
    //         });
    //     }
    // }
    const resetPass = (e) => {
        e.preventDefault();
        if (!passwordError && !passwordConfirmError) {
          axios.patch(`http://localhost:3000${pathname}`, data, {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => {
              navigate("/login", { state: { fromResetPassword: true } });
            })
            .catch((error) => {
                toast.error(error.message, {
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
        }
      };
  return (
    <div className="bg-white w-full overflow-hidden min-h-screen flex flex-col">
        <div className="sm:px-16 px-6 flex justify-center items-center">
            <div className="xl:max-w-[1280px] w-full">
                <NavBar/>
            </div>
        </div>
          <div className='sm:px-16 px-6 flex justify-center items-center h-full flex-grow'>
                <div className='xl:max-w-[1280px] w-full h-full flex md:flex-row md:justify-center gap-6 flex-col items-center'>
                    <div className='shadow-md rounded-lg px-7 py-8  max-w-[450px] w-full mt-5 md:mt-0 border-[2px] border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-3' >
                        <h1 className='font-bold text-2xl'>Reset Password</h1>
                        <p className='text-sm'>Here you can change your password. Please type it twice to avoid any typos.</p>
                        <form className='w-full flex flex-col gap-4' action="">
                            <div className='flex flex-col'>
                                <div className='flex flex-col relative mb-2'>
                                    <label className='text-gray-500 font-normal text-sm mb-[3px]' htmlFor="password">New Password :</label>

                                    <input onChange={(e)=>{setPassword(e.target.value)}}  className={`${passwordError ? "border-red text-red":"border-gray-400"} border-2 rounded-xl h-10 p-4 outline-none text-[0.875rem]`} id='password' type={toggle1 ?"text":"password"} />
                                    
                                    <img onClick={()=>{setToggle1(prev => !prev)}} className='w-[20px] h-[20px] absolute right-3 top-2/4  cursor-pointer' src={toggle1 ? Eye:hidePassword} alt="Show_password" />
                                </div>
                                <div className='flex flex-col relative'>
                                    <label className='text-gray-500 font-normal text-sm mb-[3px]' htmlFor="PasswordConfirm">Confirm New Password :</label>

                                    <input onChange={(e)=>{setPasswordConfirm(e.target.value)}}  className={`${passwordConfirmError ? "border-red text-red":"border-gray-400"} border-2 rounded-xl h-10 p-4 outline-none text-[0.875rem]`} id='PasswordConfirm' type={toggle2 ?"text":"password"} />
                                    
                                    <img onClick={()=>{setToggle2(prev => !prev)}} className='w-[20px] h-[20px] absolute right-3 top-2/4  cursor-pointer' src={toggle2 ? Eye:hidePassword} alt="Show_password" />
                                </div>
                                {passwordConfirmError && <p className='text-red text-sm mt-1'>doesn&apos;t match New Password</p>}
                            </div>
                            <button onClick={resetPass} className='self-center bg-skyBlue px-12 py-3 rounded-full shadow-custom hover:shadow-hover transition-shadow duration-500 text-white font-semibold'>Submit</button>
                        </form>
                    </div>
                    <img className='w-[450px] h-[450px] object-cover mt-3 md:mt-0 p-6 ' src={ResetPasswordImage} alt="ForgotPasswordImage" />
                </div>
          </div>
          <ToastContainer/>
    </div>
  )
}

export default ResetPassword