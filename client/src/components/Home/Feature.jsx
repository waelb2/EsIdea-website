import React from 'react'

const Feature = (props) => {
  return (
    <div className='flex flex-col md:items-start xs:items-center justify-center gap-1'>
      <img className='xs:w-24 md:w-32' src={props.image}/>
      <div>
        <p className=' font-medium text-lg xs:text-center md:text-start'>{props.title}</p>
        <p className='text-sm xs:text-center md:text-start'>{props.description}</p>
      </div>
    </div>
  )
}

export default Feature