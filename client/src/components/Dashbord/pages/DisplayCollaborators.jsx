// eslint-disable-next-line no-unused-vars
import React from 'react'
import propTypes from 'prop-types'
import { User } from '../../../assets'
const DisplayCollaborators = ({visible,closePopUp,collaborators}) => {
  return (
    <div onClick={closePopUp} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation()}} className='bg-white max-w-full w-[400px] max-h-full  rounded-2xl shadow-md px-3 py-4 sm:py-7 sm:px-9 m-4'>
                    <div className=''>
                        <h1 className='font-bold text-2xl text-center mb-2'>Collaborators</h1>
                        <div className='flex flex-col gap-2'>
                            {collaborators.map(collaborator=><div className='flex items-center gap-2 cursor-pointer rounded-md hover:bg-gray-100 border-2 border-transparent hover:border-skyBlue duration-500 transition-all p-2' key={collaborator.email}>
                                <img className='w-11 h-11 rounded-full border-gray-400 border-2 p-0.5' src={collaborator.profilePicUrl ? collaborator.profilePicUrl : User} alt="user" />
                                <div className='flex flex-col justify-center'>
                                    <p className='font-medium text-sm'>{collaborator.firstName + ' ' + collaborator.lastName}</p>
                                    <p className='text-sm '>{collaborator.email}</p>
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
    </div>
  )
}
DisplayCollaborators.propTypes={
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired,
    collaborators:propTypes.array.isRequired
}
export default DisplayCollaborators