// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from 'react'
import propTypes from 'prop-types'
import { UploadProjectPic, blackClose } from '../../../assets';
const UploadProject = ({visible,closePopUp}) => {
    const [project,setProject] = useState(null);
    const browseRef = useRef();
    const handleDragOver = (event)=>{
        event.preventDefault();
    }
    const handleDrop=(event)=>{
        event.preventDefault();
        setProject(event.dataTransfer.files[0]);
    }
  return (
    <div onClick={closePopUp} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation();}} className='bg-white max-w-full w-[37.5rem]  rounded-2xl shadow-md  px-3 py-4 sm:py-7 sm:px-9 m-4'>
                    
                    <div className='w-full h-full flex flex-col gap-3'>
                        <div className={`w-full flex justify-end`}>
                            <img onClick={closePopUp} className={`w-5 h-5 cursor-pointer`} src={blackClose} alt="Close" />
                        </div>
                        <div className='h-full w-full'>
                        {!project ? <div onDrop={handleDrop} onDragOver={handleDragOver} className='flex flex-col items-center justify-center gap-1 border-2 border-dashed border-skyBlue rounded-lg p-3 h-full'>
                                    <img className='w-64' src={UploadProjectPic} alt="files" />
                                    <h1 className='text-black font-bold'>Drag and Drop pic to upload</h1>
                                    <h1 className='text-black font-semibold'>Or</h1>
                                    <input onChange={(event)=>{setProject(event.target.files[0]);}}  ref={browseRef} hidden type="file" />
                                    <button onClick={()=>{browseRef.current.click()}} className='bg-skyBlue py-1 px-2 rounded-xl text-realWhite'>Browse</button>
                                </div>:<div className='flex flex-col gap-5 border-2 border-gray-600 rounded-md p-2 justify-center items-center flex-grow'>
                                        <h1 className='text-black font-semibold text-lg'>Selected picture:{project ? project.name : 'None'}</h1>
                                        <h1>Selected file: </h1>
                                        <button onClick={()=>{setProject(null)}} className='bg-red text-realWhite py-1 px-2 rounded-lg'>Cancel</button>
                                    </div>}
                        </div>
                        <div className={`w-full self-end flex justify-end`}>
                                <button  className={`bg-skyBlue px-3 py-1 rounded-md text-white`}>Save</button>
                        </div>
                    </div>
                </div>
    </div>
  )
}
UploadProject.propTypes={
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired
}
export default UploadProject