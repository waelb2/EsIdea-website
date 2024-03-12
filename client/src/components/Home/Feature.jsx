import React from 'react'

const Feature = (props) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <img className=' h-40 my-5' src={props.image}/>
      <p className='my-3 font-medium text-3xl'>{props.title}</p>
      <p className='text-lg'>{props.description}</p>
    </div>
  )
}

export default Feature