// eslint-disable-next-line no-unused-vars
import React, { useContext, useRef, useState } from 'react'
import propTypes from 'prop-types'
import { blackClose, dragdropfiles } from '../../assets';
import axios  from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import { toast,ToastContainer } from 'react-toastify';
const ChangePfp = ({visible,closePopUp}) => {
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
    const navigate = useNavigate();
    const handleDragOver = (event)=>{
        event.preventDefault();
    }
    const changeButtonRef = useRef();
    const [image,setImage] = useState();
    const handleDrop=(event)=>{
        setProfilePic(URL.createObjectURL(event.dataTransfer.files[0]));
        setImage(event.dataTransfer.files[0]);
        event.preventDefault();
    }
    const [profilePic,setProfilePic] = useState(null);
    const handleUpload=(event)=>{
        setProfilePic(URL.createObjectURL(event.target.files[0]))
        setImage(event.target.files[0]);
    }
    const browseRef = useRef();
    const myForm = new FormData()
    myForm.append('profilePic',image);
    const userToken = localStorage.getItem('userToken')
    const [changeProfileState,setChangeProfileState] = useState(false);
    const changeProfile = async()=>{
        changeButtonRef.current.disabled = true;
        setChangeProfileState(true);
        try {
            const response = await axios.patch(
                'user/settings/profile/picture',
                 myForm ,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            closePopUp();
            displayMessageToUser("success","Profile picture updated successfully");
            setChangeProfileState(false);
        } catch (error) {
            console.error('Error:', error.response.data.error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    }
    return (
    <div onClick={closePopUp} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation();}} className='bg-white max-w-full w-[37.5rem]  rounded-2xl shadow-md  px-3 py-4 sm:py-7 sm:px-9 m-4'>
                    
                    <div className='w-full h-full flex flex-col gap-3'>
                        <div className={`w-full flex justify-end`}>
                            <img onClick={closePopUp} className={`w-5 h-5 cursor-pointer`} src={blackClose} alt="Close" />
                        </div>
                        <div className='h-full w-full'>
                        {!profilePic ? <div onDrop={handleDrop} onDragOver={handleDragOver} className='flex flex-col items-center justify-center gap-1 border-2 border-dashed border-skyBlue rounded-lg p-3 h-full'>
                                    <img className='w-64' src={dragdropfiles} alt="files" />
                                    <h1 className='text-black font-bold'>Drag and Drop pic to upload</h1>
                                    <h1 className='text-black font-semibold'>Or</h1>
                                    <input onChange={handleUpload}  ref={browseRef} hidden type="file" />
                                    <button onClick={()=>{browseRef.current.click()}} className='bg-skyBlue py-1 px-2 rounded-xl text-realWhite'>Browse</button>
                                </div>:<div className='flex flex-col gap-5 border-2 border-gray-600 rounded-md p-2 justify-center items-center flex-grow'>
                                        <h1 className='text-black font-semibold text-lg'>Selected picture:</h1>
                                        <img className='w-60 object-cover rounded-md' src={profilePic} alt="banner" />
                                        <button onClick={()=>{setProfilePic(null)}} className='bg-red text-realWhite py-1 px-2 rounded-lg'>Cancel</button>
                                    </div>}
                        </div>
                        <div className={`w-full self-end flex justify-end`}>
                                <button ref={changeButtonRef} onClick={changeProfile}  className={`bg-skyBlue px-3 py-1 rounded-md text-white`}>{changeProfileState ? (
                                        <ThreeDots
                                            visible={true}
                                            height='20'
                                            width='40'
                                            color='#fff'
                                            radius='9'
                                            ariaLabel='three-dots-loading'
                                            wrapperStyle={{}}
                                            wrapperClass=''
                                            />
                                        ) : ('Change')}
                                </button>
                        </div>
                    </div>
                    <ToastContainer/>
                </div>
    </div>
  )
}
ChangePfp.propTypes={
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired
}
export default ChangePfp