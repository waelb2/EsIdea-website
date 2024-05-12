// eslint-disable-next-line no-unused-vars
import React from 'react'
import propTypes from "prop-types"
const Feature = (props) => {
  return (
    <div className='flex items-center md:items-start flex-col justify-center gap-2'>
      <img className='h-24 w-24' src={props.image}/>
      <p className='font-medium text-center md:text-left text-2xl'>{props.title}</p>
      <p className='text-md text-center md:text-left'>{props.description}</p>
    </div>
  )
}
Feature.propTypes={
    image:propTypes.string.isRequired,
    title:propTypes.string.isRequired,
    description:propTypes.string.isRequired
}
export default Feature