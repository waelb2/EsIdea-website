// eslint-disable-next-line no-unused-vars
import React from 'react'
import { ColorRing } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#3A86FF', '#3A86FF', '#3A86FF', '#3A86FF', '#3A86FF']}
        />
    </div>
  )
}

export default Loader