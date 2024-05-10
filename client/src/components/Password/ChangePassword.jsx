// eslint-disable-next-line no-unused-vars
import React,{useState,useEffect} from 'react'
import { ChangePFP, ChangePassIcon, Eye, FeedBackIcon, HelpIcon, LogoutIcon, ResetPasswordImage, blackClose, blackLogo, hidePassword, notification } from '../../assets'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'
import useUser from '../../hooks/useUser';
import ChangePfp from '../Dashbord/ChangePfp';

const ResetPassword = () => {
    const { user } = useUser()
    const navigate = useNavigate();
    const [toggle1,setToggle1] = useState(false);
    const [toggle2,setToggle2] = useState(false);
    const [toggle3,setToggle3] = useState(false);
    const [oldPassword,setOldPassword] = useState("");
    const [oldPasswordError,setOldPasswordError] = useState(false);

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
    const data = { email: user.email,currentPassword:oldPassword,newPassword:password,confirmNewPassword:passwordConfirm };

    const changePass = (e) => {
        e.preventDefault();
        if (!passwordError && !passwordConfirmError) {
          axios.post("auth/updatePassword", data, {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => {
              if (response.status === 200) {
                navigate("../Home/Projects", { state: { fromChangePassword: true } });
              }
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
      };
    const [toggle,setToggle] = useState(false);
    const [changePfpVisible,setChangePfpVisible] = useState(false);
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
            path:"",
            action:()=>{

            }
        },{
            icon:FeedBackIcon,
            title:"Feedback",
            path:"/",
            action:()=>{

            }
        },{
            icon:LogoutIcon,
            title:"Log out",
            path: import.meta.env.VITE_API_URL + "/auth/logout",
            action:()=>{

            }
        }
    ]

  return (
    <div className="bg-white w-full overflow-hidden min-h-screen flex flex-col">
        <div className="sm:px-11 px-6 py-3 flex justify-center items-center">
            <div className="xl:max-w-[80rem] w-full">
            <nav className='flex items-center justify-between'>
                <Link to="/">
                    <img className='w-[7.75rem] h-10' src={blackLogo} alt="ESIdea_logo" />
                </Link>
                <div className='flex gap-2 items-center'>
                    <img className='w-8 h-8 cursor-pointer' src={notification} alt="Notification" />
                    <img onClick={()=>{setToggle(prev => !prev)}} className='w-10 h-10 cursor-pointer rounded-full border-2 border-skyBlue p-0.5' src={user.profilePicUrl} alt="User" />
                    <div className={`${!toggle ? "hidden":"flex border-[2px]"} p-4 bg-realWhite shadow-xl absolute z-20 top-11 right-6 mx-4 my-2 min-w-[250px] rounded-xl slideDown overflow-hidden flex-col`}>
                        <img onClick={()=>{setToggle(prev => !prev)}} className='w-5 h-5 object-contain cursor-pointer fixed top-2 right-3' src={blackClose} alt="Close"/>
                        <div className='flex flex-col items-center mb-3'>
                            <img className='w-20 h-20 object-contain rounded-full border-2 border-skyBlue p-0.5' src={user.profilePicUrl} alt="UserPic" />
                            <p className='font-medium'>{`${user.firstName} ${user.lastName}`}</p>
                            <p>{user.email}</p>
                        </div>
                        <ul className='list-none flex justify-end items-start flex-1 flex-col'>
                            {userDetails.map((det,ind) =><div className='w-full' key={det.title}>
                                    <li className={`w-full rounded-md transition-all hover:bg-[#d9e9f6]`}>
                                        <Link onClick={det.action} to={det.path} className='flex w-full items-center  p-2'>
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
        </div>
    </div>
          <div className='sm:px-16 px-6 flex justify-center items-center h-full flex-grow'>
                <div className='xl:max-w-[80rem] w-full h-full flex md:flex-row md:justify-center gap-6 flex-col items-center'>
                    <div className='shadow-md rounded-lg px-7 py-8  max-w-[28.125rem] w-full mt-5 md:mt-0 border-2 border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-3' >
                        <h1 className='font-bold text-2xl'>Change Password</h1>
                        <p className='text-sm'>Here you can change your password. Please type it twice to avoid any typos.</p>
                        <form className='w-full flex flex-col gap-4' action="">
                            <div className='flex flex-col'>
                            <div className='flex flex-col relative mb-2'>
                                    <label className='text-gray-500 font-normal text-sm mb-[3px]' htmlFor="oldPassword">Old Password :</label>
                                    <input onChange={(e)=>{setOldPassword(e.target.value)}}  className={`${oldPasswordError ? "border-red text-red":"border-gray-400"} border-2 rounded-xl h-10 p-4 outline-none text-[0.875rem]`} id='oldPassword' type={toggle3 ?"text":"password"} />
                                    
                                    <img onClick={()=>{setToggle3(prev => !prev)}} className='w-5 h-5 absolute right-3 top-2/4  cursor-pointer' src={toggle3 ? Eye:hidePassword} alt="Show_password" />
                                </div>
                                <div className='flex flex-col relative mb-2'>
                                    <label className='text-gray-500 font-normal text-sm mb-[3px]' htmlFor="password">New Password :</label>
                                    <input onChange={(e)=>{setPassword(e.target.value)}}  className={`${passwordError ? "border-red text-red":"border-gray-400"} border-2 rounded-xl h-10 p-4 outline-none text-[0.875rem]`} id='password' type={toggle1 ?"text":"password"} />
                                    
                                    <img onClick={()=>{setToggle1(prev => !prev)}} className='w-5 h-5 absolute right-3 top-2/4  cursor-pointer' src={toggle1 ? Eye:hidePassword} alt="Show_password" />
                                </div>
                                <div className='flex flex-col relative'>
                                    <label className='text-gray-500 font-normal text-sm mb-[3px]' htmlFor="PasswordConfirm">Confirm New Password :</label>

                                    <input onChange={(e)=>{setPasswordConfirm(e.target.value)}}  className={`${passwordConfirmError ? "border-red text-red":"border-gray-400"} border-2 rounded-xl h-10 p-4 outline-none text-[0.875rem]`} id='PasswordConfirm' type={toggle2 ?"text":"password"} />
                                    
                                    <img onClick={()=>{setToggle2(prev => !prev)}} className='w-5 h-5 absolute right-3 top-2/4  cursor-pointer' src={toggle2 ? Eye:hidePassword} alt="Show_password" />
                                </div>
                                {passwordConfirmError && <p className='text-red text-sm mt-1'>doesn&apos;t match New Password</p>}
                            </div>
                            <button onClick={changePass} className='self-center bg-skyBlue px-12 py-3 rounded-full shadow-custom hover:shadow-hover transition-shadow duration-500 text-white font-semibold'>Change</button>
                        </form>
                    </div>
                    <img className='w-[28.125rem] h-[28.125rem] object-cover mt-3 md:mt-0 p-6 ' src={ResetPasswordImage} alt="ForgotPasswordImage" />
                </div>
          </div>
          <ChangePfp visible={changePfpVisible} closePopUp={closePopUp}/>
    </div>
  )
}

export default ResetPassword