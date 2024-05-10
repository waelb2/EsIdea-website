import React, { useContext, useRef, useState } from 'react'
import { blackClose } from '../../assets'
import propTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios'
import { projectContext } from './Dashbord';
import { ThreeDots } from 'react-loader-spinner';
const SendFeedBackPopUp = ({visible,closePopUp}) => {
    const {displayMessageToUser} = useContext(projectContext);
    const labelStyle = "block min-w-fit text-md font-medium text-gray-900";
    const inputStyle = "bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2";
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken');
    const sendButtonRef = useRef();
    const [sendFeedbackState,setSendFeedbackState] = useState(false);
    const sendFeedback = async()=>{
        const error = (title === "" && description === "");
        if(!error){
            sendButtonRef.current.disabled = true;
            setSendFeedbackState(true);
            try {
                const response = await axios.post(
                    'user/settings/feedback',
                    {title,description} ,
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    }
                );
                closePopUp();
                setSendFeedbackState(false);
                setDescription("");
                setTitle("");
                displayMessageToUser("success","Feedback sent successfully");
            } catch (error) {
                console.log(error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        }else{
            displayMessageToUser("error","Please fill all fields!");
        }
}
  return (
    <div onClick={close} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center overflow-y-auto  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation()}} className='bg-white max-w-full w-[37.5rem]   rounded-2xl shadow-md relative  py-3 px-5 m-4'>
                    <img onClick={closePopUp} className={`w-4 h-4 absolute right-2 top-2 cursor-pointer`} src={blackClose} alt="Close" />
                     <div>
                        <h1 className='text-center text-lg font-bold mb-2'>Send feedback</h1>
                        <div className='flex flex-col gap-y-2'>
                            <div className='grid grid-cols-3'>
                                <label className={labelStyle} htmlFor='title'>Title:</label>
                                <input placeholder='Title' className={`${inputStyle} col-span-2`} onChange={(e)=>{setTitle(e.target.value)}} value={title} id="title" type='text' />
                            </div>
                            <div className='grid grid-cols-3'>
                                <label className={labelStyle} htmlFor='title'>Description:</label>
                                <input placeholder='Description' className={`${inputStyle} col-span-2`} onChange={(e)=>{setDescription(e.target.value)}} value={description} id="Description" type='text' />
                            </div>
                        </div>
                        <button ref={sendButtonRef} onClick={sendFeedback} type="button" className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2 mb-2 relative left-full -translate-x-full mt-3">
                            {sendFeedbackState ? (<ThreeDots visible={true} height='20' width='40' color='#fff' radius='9' ariaLabel='three-dots-loading' wrapperStyle={{}}wrapperClass=''
                            />
                            ) : (
                                'Send'
                            )}
                        </button>
                    </div>
                </div>
    </div>
  )
}
SendFeedBackPopUp.propTypes = {
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired,
}
export default SendFeedBackPopUp