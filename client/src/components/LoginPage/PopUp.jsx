// eslint-disable-next-line no-unused-vars
import React from 'react';
import { blackClose } from '../../assets';
import propTypes from 'prop-types';
const PopUp = ({visible,togglePopUp,content}) => {
  return (
    <div onClick={togglePopUp} className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-40 backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
        <div onClick={(e)=>{e.stopPropagation()}} className='bg-white w-[460px] max-w-full rounded-lg flex flex-col mx-4'>
            <div className='w-full relative mb-6'>
                <img onClick={togglePopUp} className='w-5 h-5 absolute top-3 right-3 cursor-pointer' src={blackClose} alt="Close" />
            </div>

            <div className='w-full px-5 pb-3 h-full flex flex-col gap-1'>
                <h1 className='text-center font-bold text-2xl'>Sign up</h1>
                <h2 className='font-bold text-md'>{content.title}</h2>
                <p className='text-sm'>{content.content}</p>
                <div className='flex justify-end gap-4'>
                    <button onClick={togglePopUp} className='cursor-pointer'>Cancel</button>
                    <button className='bg-skyBlue px-4 py-1 rounded-lg text-white cursor-pointer'>Retry</button>
                </div>
            </div>

        </div>
    </div>
  )
}
PopUp.propTypes={
    visible:propTypes.bool.isRequired,
    togglePopUp:propTypes.func.isRequired,
    content:propTypes.object.isRequired
}
export default PopUp