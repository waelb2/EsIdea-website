// eslint-disable-next-line no-unused-vars
import React,{useEffect, useState} from 'react'
import {Eye, hidePassword} from '../../assets';
import { Link, useNavigate } from 'react-router-dom';
const Form = () => {
    const [toggle,setToggle] = useState(false);
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [emailError,setEmailError] = useState(false);
    const [passwordError,setPasswordError] = useState(false);

    useEffect(()=>{
        if(!email.endsWith('@esi.dz') && email !== ""){
            setEmailError(true);
        }else{
            setEmailError(false);
        }
    },[email])

    useEffect(()=>{
        if(password.length < 8 && password !== ""){
            setPasswordError(true);
        }else{
            setPasswordError(false);
        }
    },[password])
    return (
        <form action="">

            <div className='flex flex-col mb-2'>
                <label className='text-grey font-normal text-[0.875rem] mb-[1px]' htmlFor="emailInput">Email :</label>
                <input onChange={(e)=>{setEmail(e.target.value)}}  className={`${emailError ? "border-red text-red":"border-grey"} border rounded-md h-10 p-4 outline-none text-[0.875rem]`} id='emailInput' type="email" />
            </div>

            <div className='flex flex-col relative'>
                <label className='text-grey font-normal text-[0.875rem] mb-[1px]' htmlFor="passwordInput">Password :</label>

                <input onChange={(e)=>{setPassword(e.target.value)}}  className={`${passwordError ? "border-red text-red":"border-grey"} border rounded-md h-10 p-4 outline-none text-[0.875rem]`} id='passwordInput' type={toggle ?"text":"password"} />
                
                <img onClick={()=>{setToggle(prev => !prev)}} className='w-[20px] h-[20px] absolute right-3 top-2/4  cursor-pointer' src={toggle?Eye:hidePassword} alt="Show_password" />
            </div>

            <div className='flex justify-between items-center mt-1'>
                <div className='flex items-center'>
                    <input type="checkbox" name="Remember_me" id="rememberMe" />
                    <label className='ml-1 text-[0.875rem]' htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/ForgotPassword" className='text-skyBlue hover:underline text-[0.875rem]'>Forgot Password?</Link>
            </div>

            <div className='flex justify-center items-center mt-3'>
                <button onClick={()=>{navigate("/Projects")}} className={`bg-skyBlue w-[120px] p-2 text-white  sm:w-[152px] sm:p-[10px] rounded-3xl font-bold`}>Login
                </button>
            </div>

            <p className='text-center mt-4 text-[0.875rem]'>
            Don’t have an account? <span className='text-skyBlue hover:underline inline'>Sign up</span>
            </p>
    </form>
  )
}
export default Form