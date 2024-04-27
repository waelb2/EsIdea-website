// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import Option from './Option'
import { DependenciesContext } from './CreateNewProject';
import propTypes from 'prop-types'
const Select = ({title,data,accesorKey}) => {
    const {active,setActive}=useContext(DependenciesContext);
    return (data ? (<div className='flex-grow relative'>
                <div className={`overflow-y-auto mb-2 sidebar scrollbar-thin  absolute max-h-96 w-full bottom-full z-50 bg-white rounded-md border-2 border-gray-400 ${active === title ? "block":"hidden"}`}>  
                    {data.length !== 0 ? data.map((val,index)=><Option title={title} key={index} item={val} accesorKey={accesorKey}/>):<div className='p-2'><p>{`No ${title}`}</p></div>}
                </div>
                <div onClick={()=>{active === title  ?setActive(""):setActive(title)}} className={`flex justify-between items-center border-2 p-2 rounded-md cursor-pointer ${active === title && "border-black"}`}>
                    <p>{title}</p>
                    {active === title ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
                </div>
        </div>):null
  )
}
Select.propTypes={
    title:propTypes.string,
    data:propTypes.array,
    accesorKey:propTypes.string
}
export default Select