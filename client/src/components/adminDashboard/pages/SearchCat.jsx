// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Search } from '../../../assets'
import propTypes from 'prop-types'
const SearchCat = ({setSearchInput}) => {
  return (
    <div className='w-full ss:w-[55%]'>
        <div className='flex border-grey border-[1px] px-3 rounded-lg py-0.5 ss:w-80 w-full bg-white'>
            <input onChange={(e)=>{setSearchInput(e.target.value)}} className='border-none outline-none w-full flex-shrink' type="text" placeholder='Search...' />
            <img className='w-8 h-8' src={Search} alt="Search icon" />
        </div>
    </div>
  )
}
SearchCat.propTypes={
  setSearchInput:propTypes.func.isRequired
}
export default SearchCat