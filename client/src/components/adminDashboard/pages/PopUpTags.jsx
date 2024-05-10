// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import propTypes from 'prop-types'
import axios from '../../../utils/axios'
import { blackClose } from '../../../assets';
import { MessageToUserContext } from '../AdminDashboard';
const PopUpTags = ({visible,closePopUp,operation,type,tagToModify,getTags}) => {
  const displayMessageToUser = useContext(MessageToUserContext);
  const [error,setError] = useState(false);
  const addTag = async ()=>{
    let tag;
    if(type === "module"){
      tag = {description:{title,field,credit,coef,edition,courseHours,tdHours,tpHours},moduleName}
      setError(title === "" || field === "" || edition === "" || courseHours === "" || tdHours === "" || tpHours === "" || moduleName === "");
    }else if (type === "club"){
      tag = {clubName,description:{imageUrl,creationDate,field,numberOfEvents,majorEvents}}
      setError(creationDate === "" || field === "" || clubName === "" || imageUrl === "");
    }else{
      tag = {eventName,description};
      setError(eventName === "" || description === "");
    }
    if(!error){
      try {
        const response = await axios.post("admin/tags",{type,...tag });
        if (response.status === 201) {
          close();
          getTags();
          displayMessageToUser("success","Tag added succesfully");
        } else {
          if(response.status === 400){
            displayMessageToUser("error","Please try again!");
          }
          throw new Error("Authentication has failed");
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      displayMessageToUser("error","Please fill all fields!")
    }
  }
  const updateTag = async()=>{
    let tag;
    const id = tagToModify._id;
    if(type === "module"){
      tag = {description:{title,field,credit,coef,edition,courseHours,tdHours,tpHours},moduleName}
      setError(title === "" || field === "" || edition === "" || courseHours === "" || tdHours === "" || tpHours === "" || moduleName === "");
    }else if (type === "club"){
      tag = {clubName,description:{imageUrl,creationDate,field,numberOfEvents,majorEvents}}
      setError(creationDate === "" || field === "" || clubName === "" || imageUrl === "");
    }else{
      tag = {eventName,description};
      setError(eventName === "" || description === "");
    }
    if(!error){
      try {
        const response = await axios.patch("admin/tags",{ id,type,tag });
        if (response.status === 200) {
          close();
          getTags();
          displayMessageToUser("success","Tag modified succesfully");
        } else {
          console.log(response);
          throw new Error("Authentication has failed");
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      displayMessageToUser("error","Please fill all fields!")
    }
  }
  const labelStyle = "block min-w-fit text-md font-medium text-gray-900 dark:text-white";
  const inputStyle = "bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2";
  //attributs
  //-------module--------------
  const [moduleName,setModuleName] = useState("");
  const [title,setTitle] = useState("");
  const [field,setField] = useState("");
  const [credit,setCredit] = useState(1);
  const [coef,setCoef] = useState(1);
  const [edition,setEdition] = useState("");
  const [courseHours,setCourseHours] = useState("");
  const [tdHours,setTdHours] = useState("");
  const [tpHours,setTpHours] = useState("");
  useEffect(()=>{
    if(operation === "Modify" && type === "module"){
      setModuleName(tagToModify.moduleName);
      setTitle(tagToModify.description.title);
      setField(tagToModify.description.field);
      setCredit(tagToModify.description.credit);
      setCoef(tagToModify.description.coef);
      setEdition(tagToModify.description.edition);
      setCourseHours(tagToModify.description.courseHours);
      setTdHours(tagToModify.description.tdHours);
      setTpHours(tagToModify.description.tpHours);
    }
    if(operation === "Modify" && type === "club"){
      setClubName(tagToModify.clubName);
      setField(tagToModify.description.field);
      setImageUrl(tagToModify.description.imageUrl);
      setCreationDate(tagToModify.description.creationDate);
      setNumberOfEvents(tagToModify.description.numberOfEvents);
      setMajorEvents(tagToModify.description.majorEvents.join(', '));
    }
    if(operation === "Modify" && type === "event"){
      setEventName(tagToModify.eventName);
      setDescription(tagToModify.description);
    }
  },[tagToModify,operation,type])
  const moduleInputFields = [
    {
      label:"Module name",
      value: moduleName,
      onChange:(e)=>{
        setModuleName(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Title",
      value: title,
      onChange:(e)=>{
        setTitle(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Field",
      value: field,
      onChange:(e)=>{
        setField(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Credit",
      value: credit,
      onChange:(e)=>{
        setCredit(Number(e.target.value));
      },
      inputType:"number"
    },
    {
      label:"Coef",
      value: coef,
      onChange:(e)=>{
        setCoef(Number(e.target.value));
      },
      inputType:"number"
    },
    {
      label:"Edition",
      value: edition,
      onChange:(e)=>{
        setEdition(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Course Hours",
      value: courseHours,
      onChange:(e)=>{
        setCourseHours(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Td Hours",
      value: tdHours,
      onChange:(e)=>{
        setTdHours(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Tp Hours",
      value:tpHours,
      onChange:(e)=>{
        setTpHours(e.target.value);
      },
      inputType:"text"
    }
  ]
  const generateInputFields = (label,onChange,value,inputType)=>{
    return(
      <div className='grid grid-cols-3' key={label}>
        <label className={labelStyle} htmlFor={label}>{`${label}:`}</label>
        <input min={1} placeholder={`${operation} ${label}`} className={`${inputStyle} col-span-2`} onChange={onChange} value={value} id={label} type={inputType} />
      </div>
    )
  }
  //---------------Club---------------------
  const [clubName,setClubName] = useState("");
  const [creationDate,setCreationDate] = useState("");
  const [imageUrl,setImageUrl] = useState("");
  const [numberOfEvents,setNumberOfEvents] = useState(0);
  const [majorEvents,setMajorEvents] = useState([]);
  const clubInputFields = [
    {
      label:"Club name",
      value: clubName,
      onChange:(e)=>{
        setClubName(e.target.value);
      },
      inputType:"text"
    },{
      label:"Image URL",
      value:imageUrl,
      onChange:(e)=>{
        setImageUrl(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Creation date",
      value: creationDate,
      onChange:(e)=>{
        setCreationDate(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Field",
      value: field,
      onChange:(e)=>{
        setField(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Number of events",
      value: numberOfEvents,
      onChange:(e)=>{
        setNumberOfEvents(Number(e.target.value));
      },
      inputType:"number"
    },
    {
      label:"Major events",
      value: majorEvents,
      onChange:(e)=>{
        setMajorEvents(e.target.value.split(','));
      },
      inputType:"text"
    }
  ]
  //------------------------------------------
  const [eventName,setEventName] = useState("");
  const [description,setDescription] = useState("");
  const eventInputFields = [
    {
      label:"Event name",
      value: eventName,
      onChange:(e)=>{
        setEventName(e.target.value);
      },
      inputType:"text"
    },
    {
      label:"Description",
      value: description,
      onChange:(e)=>{
        setDescription(e.target.value);
      },
      inputType:"text"
    }
  ]
  const close = ()=>{
    closePopUp();
    setModuleName("");
    setTitle("");
    setField("");
    setImageUrl("");
    setCredit(1);
    setCoef(1);
    setEdition("");
    setCourseHours("");
    setTdHours("");
    setTpHours("");
    setClubName("");
    setCreationDate("");
    setNumberOfEvents(0);
    setMajorEvents([]);
    setEventName("");
    setDescription("");
    setImageUrl("");
  }
  return (
    <div onClick={close} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center overflow-y-auto  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation()}} className='bg-white max-w-full w-[37.5rem]   rounded-2xl shadow-md relative  py-3 px-5 m-4'>
                    <img onClick={close} className={`w-4 h-4 absolute right-2 top-2 cursor-pointer`} src={blackClose} alt="Close" />
                     <div>
                        <h1 className='text-center text-lg font-bold mb-2'>{`${operation +" "+ type}`}</h1>
                        <div className='flex flex-col gap-y-2'>
                          {
                            type === "module"?<>
                              {moduleInputFields.map(module=>generateInputFields(module.label,module.onChange,module.value,module.inputType))}
                            </>:type==="club"?<>
                              {clubInputFields.map(club=>generateInputFields(club.label,club.onChange,club.value,club.inputType))}
                            </>:<>
                            {eventInputFields.map(event=>generateInputFields(event.label,event.onChange,event.value,event.inputType))}
                            </>
                          }
                        </div>
                        <button onClick={operation === "Add" ?addTag:updateTag} type="button" className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2 mb-2 relative left-full -translate-x-full mt-3">
                          {operation}
                        </button>
                      </div> 
                </div>
    </div>
  )
}
PopUpTags.propTypes = {
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired,
    operation:propTypes.string.isRequired,
    tagToModify:propTypes.object,
    getTags:propTypes.func.isRequired,
    type:propTypes.string
}
export default PopUpTags