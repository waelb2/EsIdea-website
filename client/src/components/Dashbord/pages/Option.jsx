// eslint-disable-next-line no-unused-vars
import React, { useState,useContext } from 'react'
import propTypes from 'prop-types'
import { FaCheck } from "react-icons/fa6";
import { DependenciesContext } from './CreateNewProject';
const Option = ({title,item,accesorKey}) => {
    const Dependencies = useContext(DependenciesContext);
    const [selected,setSelected] = useState(false);
    const obj = {   
        tagType:title,
        tagName:item[accesorKey]
    }
    const handleClick = ()=>{
        if(!selected){
            setSelected(true);
            Dependencies.addTag({obj,setSelected})
        }
    }
  return (
    <div className={`flex justify-between p-2 items-center ${selected && "bg-gray-300"} ${!selected && "hover:bg-gray-100"} cursor-pointer transition-all`} onClick={handleClick}>
        <p title={`${item[accesorKey]}`} className='whitespace-nowrap text-ellipsis overflow-hidden w-11/12'>{item[accesorKey]}</p>
        {selected && <FaCheck/>}
    </div>
  )
}
Option.propTypes={
    item:propTypes.object,
    accesorKey:propTypes.string,
    title:propTypes.string
}
export default Option