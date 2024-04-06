// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { BrainstormingMethodIcon, BrainwritingMethodIcon, Flipboard, Search, blackClose,Back } from '../../../assets';
import propTypes from 'prop-types';
const PopUpMethods = ({visible,closePopUp,currentPage,nextPage,prevPage}) => {
    const [displayedMethods,setDisplayedMethods] = useState([]);
    const [inputValue,setInputValue] = useState("");
    const [methods,setmethods] = useState([
        {
            Id:"BrainstormingMethodIcon_btn",
            icon:BrainstormingMethodIcon,
            title:"Brainstorming",
            action:function(){
                nextPage();
            }
        },
        {
            Id:"BrainwritingMethodIcon_btn",
            icon:BrainwritingMethodIcon,
            title:"Brainwriting",
            action:function(){
                nextPage();
            }
        },
        {
            Id:"Flipboard_btn",
            icon:Flipboard,
            title:"White board",
            action:function(){
                nextPage();
            }
        }
    ])

    useEffect(()=>{
        setDisplayedMethods([...methods]);
    },[methods]);

    useEffect(()=>{
        const arr = methods.filter(method => method.title.toLowerCase().includes(inputValue.toLowerCase()))
        setDisplayedMethods([...arr]);
    },[inputValue])

    return (
        <div onClick={closePopUp} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>

                <div onClick={(e)=>{e.stopPropagation()}} className='bg-white max-w-full w-[600px] min-h-[450px] ss:h-[500px]  max-h-full rounded-2xl shadow-md flex flex-col px-3 py-4 sm:py-7 sm:px-9 m-4'>

                    <div className={`w-full h-full ${currentPage === 1 ? "flex flex-col items-center":"hidden"}`}>
                        <div  className='flex justify-end w-full'>
                            <img onClick={closePopUp} className='w-5 h-5 cursor-pointer' src={blackClose} alt="close" />
                        </div>
                        <h1 className='font-bold text-2xl text-center mb-4'>
                            Choose a method
                        </h1>
                        <div className='flex w-full ss:w-[87%] self-center border-[2px] rounded-md ss:p-1 shadow-md mb-5 p-2'>
                            <input onChange={(e)=>{setInputValue(e.target.value)}} className='flex-grow flex-shrink w-full outline-none ml-2 text-sm' placeholder='Search' type="text" />
                            <img className='w-5 h-5 ss:w-7 ss:h-7 ml-1' src={Search} alt="Search" />
                        </div>

                        <div className='flex flex-wrap gap-3 justify-center  ss:px-9 ss:justify-start overflow-y-auto py-2'>
                            {displayedMethods.map((method)=>(<div onClick={method.action}className='bg-lightGrey w-[144px] h-[113px] rounded-md flex flex-col items-center justify-center cursor-pointer transition-shadow duration-300 hover:shadow-md' key={method.Id}>
                                <img className='w-[65px] h-[65px]' src={method.icon} alt={method.title} />
                                <p className='text-black text-[14px] font-medium'>{method.title}</p>
                            </div>))}
                        </div>
                    </div>

                    <div className={`w-full h-full ${currentPage === 2 ? "flex flex-col items-center":"hidden"}`}>
                        <div className='w-full flex justify-between'>
                            <img onClick={prevPage} className='w-6 h-6 cursor-pointer' src={Back} alt="Back" />
                            <img onClick={closePopUp} className='w-5 h-5 cursor-pointer' src={blackClose} alt="Close" />
                        </div>
                        <h1 className='font-bold text-2xl text-center mb-4'>
                            New <span className='text-skyBlue'>Brainstorming</span>
                        </h1>

                        <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                            <label htmlFor="projectName" className='text-black font-semibold'>
                                What shall we name your project
                            </label>
                            <input id='projectName' className='outline-none text-sm border-[1px] border-grey rounded-md py-2 px-4' type="text" />
                        </div>

                        <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                            <label htmlFor="projectDescription" className='text-black font-semibold'>
                                Give your project a short description
                            </label>
                            <textarea className='outline-none text-sm border-[1px] border-grey rounded-md resize-none py-2 px-4' name="Description" id="projectDescription" cols="30" rows="4">
                            </textarea>
                        </div>
                        <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                            <h1 className='text-black font-semibold'>In which category do you wanna put your project </h1>
                            <div className='border-[1px] border-grey rounded-md py-3 px-4 mb-2'>
                                <p className='text-xs text-gray-700'>Please use the lists bellow to associate a category to your project</p>
                            </div>
                            <div className='flex gap-2 items-center flex-wrap'>
                                <select id="countries" className="border border-grey text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block flex-1 p-2.5 outline-none">
                                    <option>Modules</option>
                                    <option value="US">United States</option>
                                    
                                </select>
                                <select id="countries" className="border border-grey text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block flex-1 p-2.5 outline-none">
                                    <option>Clubs</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="FR">France</option>
                                    <option value="DE">Germany</option>
                                </select>
                                <select id="countries" className="border border-grey text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block flex-1 p-2.5 outline-none">
                                    <option>Events</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="FR">France</option>
                                    <option value="DE">Germany</option>
                                </select>
                            </div>
                        </div>
                        <div className='w-full ss:w-[90%] flex justify-end'>
                            <button onClick={nextPage} className='bg-skyBlue px-3 py-1 rounded-md text-white'>next</button>
                        </div>
                    </div>

                    <div className={`w-full h-full ${currentPage === 3 ? "flex flex-col items-center":"hidden"}`}>

                        <div className='w-full flex justify-between'>
                            <img onClick={prevPage} className='w-6 h-6 cursor-pointer' src={Back} alt="Back" />
                            <img onClick={closePopUp} className='w-5 h-5 cursor-pointer' src={blackClose} alt="Close" />
                        </div>
                        <h1 className='font-bold text-2xl text-center mb-4'>
                            New <span className='text-skyBlue'>Brainstorming</span>
                        </h1>
                        
                        <label className='text-black font-semibold ss:w-[90%] mb-2'  htmlFor="collaborator">Do you want to add some collaborator</label>

                        <div className='flex w-full ss:w-[90%] self-center border-[2px] rounded-md ss:p-1 shadow-md mb-5 p-2'>
                            <input className='flex-grow w-full flex-shrink outline-none ml-2 text-sm' id='collaborator' placeholder='Search' type="text" />
                            <img className='w-5 h-5 ss:w-7 ss:h-7 ml-1' src={Search} alt="Search" />
                        </div>
                    </div>

                </div>
            </div>
  )
}
PopUpMethods.propTypes = {
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired,
    nextPage:propTypes.func.isRequired,
    prevPage:propTypes.func.isRequired,
    currentPage:propTypes.number.isRequired
}
export default PopUpMethods