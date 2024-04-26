// eslint-disable-next-line no-unused-vars
import React, { useState,useContext } from 'react'
import { FaCheck } from "react-icons/fa6";
import propTypes from 'prop-types'
import { DependenciesContext } from './CreateNewProject';
const Option = ({item,accesorKey}) => {
    const Dependencies = useContext(DependenciesContext);
    const [selected,setSelected] = useState(false);
    const handleClick = ()=>{
        if(!selected){
            setSelected(true);
            Dependencies.addTag({item,accesorKey,setSelected})
        }
    }
  return (
    <div className={`flex justify-between p-2 items-center ${selected && "bg-gray-300"} ${!selected && "hover:bg-gray-100"} cursor-pointer`} onClick={handleClick}>
        <p>{item[accesorKey]}</p>
        {selected && <FaCheck/>}
    </div>
  )
}
Option.propTypes={
    item:propTypes.object,
    accesorKey:propTypes.string
}
export default Option