// eslint-disable-next-line no-unused-vars
import React from 'react'
import propTypes from 'prop-types'
const PopUpTags = ({visible,closePopUp,operation,id,tag,type}) => {
  return (
    <div onClick={closePopUp} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation()}} className='bg-white max-w-full w-[37.5rem]   rounded-2xl shadow-md  px-3 py-4 sm:py-7 sm:px-9 m-4'>
                    {
                        operation === "modification"?<div>
                            <h1></h1>
                        </div>:operation === "Add"?<div>

                        </div>:null
                    }
                </div>
    </div>
  )
}
PopUpTags.propTypes = {
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired,
    operation:propTypes.string.isRequired,
    id:propTypes.string,
    tag:propTypes.object,
    type:propTypes.string
}
export default PopUpTags