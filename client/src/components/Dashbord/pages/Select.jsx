// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import Option from './Option'
import { DependenciesContext } from './CreateNewProject';
import propTypes from 'prop-types'
const Select = ({title,data,accesorKey}) => {
    const {active,setActive}=useContext(DependenciesContext);
    const [searchInput,setSearchInput] = useState("");
    const [filteredTags,setFilteredTags] = useState([]);
    useEffect(()=>{
        if(data){
            const arr = data.filter(tag => tag[accesorKey].toLowerCase().includes(searchInput.toLowerCase()));
            setFilteredTags(arr);
        }
    },[data,searchInput,accesorKey])
    return (data ? (<div className='flex-grow relative'>
                <div className={`overflow-y-auto mb-2 sidebar scrollbar-thin  absolute max-h-96 w-full bottom-full z-50 bg-white rounded-md border-2   border-gray-400 ${active === title ? "opacity-100 transition-opacity duration-300":"opacity-0 pointer-events-none"}`}>  
                    {data.length !== 0 ? filteredTags.map((val,index)=><Option title={title} key={index} item={val} accesorKey={accesorKey}/>):<div className='p-2'><p>{`No ${title}`}</p></div>}
                </div>
                <div onClick={()=>{active === title  ?setActive(""):setActive(title)}} className={`flex justify-between items-center border-2 p-2 rounded-md cursor-pointer ${active === title && "border-black"}`}>
                    {active === title ? <input onClick={e=>e.stopPropagation()} className='flex-shrink flex-grow w-full outline-none text-sm' placeholder={`Search for ${title}`} autoFocus onChange={(e)=>{setSearchInput(e.target.value)}} type='text'/>:<p>{title}</p>}
                </div>
        </div>):null
  )
}
Select.propTypes={
    title:propTypes.string,
    data:propTypes.array,
    accesorKey:propTypes.string
}
Select.defaultProps = {
    data:[]
}
export default Select