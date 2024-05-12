import React from 'react'

const User = ({ userName, imageUrl, useGradientBorder, showName }) => {
  return (
    <>
         <div className={useGradientBorder ? 'bg-gradient-to-r from-[#599FF8] to-[#263238] py-1 pl-1 rounded-l-full' : 'border border-black py-1 pl-1 rounded-l-full'}>
            <div className={`flex items-center bg-white h-8 rounded-l-full ${showName ? 'pl-4' : 'pr-2'}`} >
              <img className='h-6 rounded-full' src={imageUrl}/>
              {showName && <p className='ml-2 mr-2'>{userName}</p>}
            </div>
          </div>
    </>
  )
}

export default User