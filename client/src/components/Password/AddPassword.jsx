// eslint-disable-next-line no-unused-vars
import React,{useState,useEffect } from 'react'
import { Eye, blackLogo, hidePassword } from '../../assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import axios from '../../utils/axios'

const AddPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    const queryParams = new URLSearchParams(location.search);
  
    // Get a specific query parameter
    const userToken = queryParams.get('userToken'); 
    const user =JSON.parse(queryParams.get('user')); 

    const { setUser } = useUser();
    
    const [password,setPassword] = useState("");
    const [passwordError,setPasswordError] = useState(true);
    const [toggle1,setToggle1] = useState(false);

    useEffect(()=>{
        // Effect to init user context's data with Google sign up data
        localStorage.setItem('userToken', userToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        if(user.passwordIsSet){
            navigate("../Home/Projects");
        }
    }, [])

    useEffect(()=>{
        if(password.length < 8 && password !== ""){
            setPasswordError(true);
        }else{
            setPasswordError(false);
        }
    },[password])

    const data = {email:user.email,newPassword:password}
    const addPassword = (e)=>{
        e.preventDefault();
        if(!passwordError){
            axios.post(`auth/addPassword`, data, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            })
            .then((response) => {
                localStorage.setItem('userToken',response.data.userToken);
                localStorage.setItem('user', JSON.stringify(response.data.formattedUser));
                setUser(response.data.formattedUser);

                navigate("../Home/Projects");
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    }
  return (
    (!user.passwordIsSet && <div className='w-screen flex h-screen justify-center items-center'>
    <div className='shadow-md rounded-lg px-7 py-8  max-w-[28.125rem] w-full mt-5 md:mt-0 border-2 border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-3' >
        <img className='w-96 h-10 mb-4' src={blackLogo} alt="logo" />
        <h1 className='font-bold text-2xl'>Add Password</h1>
        <p className='text-sm'>Add a password for secure login next time. Would you like to set it up now?</p>
        <form className='w-full flex flex-col gap-2' action="">
            <div>
                <div className='flex flex-col relative mb-2'>
                                <label className='text-gray-500 font-normal text-sm mb-[3px]' htmlFor="password">New Password :</label>

                                <input onChange={(e)=>{setPassword(e.target.value)}}  className={`${passwordError ? "border-red text-red":"border-gray-400"} border-2 rounded-xl h-10 p-4 outline-none text-[0.875rem]`} id='password' type={toggle1 ?"text":"password"} />
                                
                                <img onClick={()=>{setToggle1(prev => !prev)}} className='w-5 h-5 absolute right-3 top-2/4  cursor-pointer' src={toggle1 ? Eye:hidePassword} alt="Show_password" />
                    </div>
            </div>
            <div className='flex justify-end items-center gap-3'>
                <Link className='hover:underline decoration-gray-500' to="/Home/Projects"><span className='text-gray-500'>Skip</span></Link>
                <button onClick={addPassword} className='bg-skyBlue px-6 py-2 rounded-full shadow-custom hover:shadow-hover transition-shadow duration-500 text-white font-semibold'>Submit</button>
            </div>
        </form>

    </div>
</div>)
  )
}

export default AddPassword