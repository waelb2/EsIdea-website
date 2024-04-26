// eslint-disable-next-line no-unused-vars
import React,{useState,useEffect, useContext} from 'react'
import { Eye, blackLogo, hidePassword } from '../../assets';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
const AddPassword = () => {
    const {user} = useContext(UserContext);
    useEffect(()=>{
        if(user.password !== null){
            navigate("/");
        }
    },[user])
    const [password,setPassword] = useState("");
    const [passwordError,setPasswordError] = useState(true);
    const [toggle1,setToggle1] = useState(false);
    useEffect(()=>{
        if(password.length < 8 && password !== ""){
            setPasswordError(true);
        }else{
            setPasswordError(false);
        }
    },[password])
    const navigate = useNavigate();
    const data = {email:user.email,newPassword:password}
    const addPassword = (e)=>{
        e.preventDefault();
        if(!passwordError){
            fetch(`http://localhost:3000/auth/addPassword`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            })
            .then((response) => response.json())
            .then((data) => {
                navigate("../Home/Projects");
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    }
  return (
    user.password == null && (<div className='w-screen flex h-screen justify-center items-center'>
    <div className='shadow-md rounded-lg px-7 py-8  max-w-[450px] w-full mt-5 md:mt-0 border-[2px] border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-3' >
        <img className='w-96 h-10 mb-4' src={blackLogo} alt="logo" />
        <h1 className='font-bold text-2xl'>Add Password</h1>
        <p className='text-sm'>Add a password for secure login next time. Would you like to set it up now?</p>
        <form className='w-full flex flex-col gap-2' action="">
            <div>
                <div className='flex flex-col relative mb-2'>
                                <label className='text-gray-500 font-normal text-sm mb-[3px]' htmlFor="password">New Password :</label>

                                <input onChange={(e)=>{setPassword(e.target.value)}}  className={`${passwordError ? "border-red text-red":"border-gray-400"} border-2 rounded-xl h-10 p-4 outline-none text-[0.875rem]`} id='password' type={toggle1 ?"text":"password"} />
                                
                                <img onClick={()=>{setToggle1(prev => !prev)}} className='w-[20px] h-[20px] absolute right-3 top-2/4  cursor-pointer' src={toggle1 ? Eye:hidePassword} alt="Show_password" />
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