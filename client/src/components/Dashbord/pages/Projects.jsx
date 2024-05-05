// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import DashboardNav from '../DashboardNav'
import Functionalities from '../Functionalities'
import Card from './Card'
import { ProjectsEmpty } from '../../../assets'
import { useLocation } from 'react-router-dom'
import {MagnifyingGlass } from 'react-loader-spinner'
import { projectContext } from '../Dashbord'
const Projects = () => {
    const {allProjects,loading,displayMessageToUser} = useContext(projectContext)
    const {state} = useLocation();
    const [fromChangePassword,setFromChangePassword] = useState(false);
    const [projects,setProjects] = useState([]);
    useEffect(()=>{
        const filteredProjects = allProjects.filter(project => !project.isTrashed)
        setProjects(filteredProjects);
    },[allProjects])
    useEffect(()=>{
        if(state){
          // eslint-disable-next-line no-prototype-builtins
          if(state.hasOwnProperty('fromChangePassword')){
            setFromChangePassword(true);
          }
        }
      },[state])
      useEffect(()=>{
        if(fromChangePassword){
            displayMessageToUser("success","Password changed successfully.")
        }
    },[fromChangePassword])

    const [openedMore,setOpenedMore] = useState(-1);
    const [displayedProjects,setDisplayedProjects] = useState([]);
    const handleMoveToTrash = (index) =>{
        const arr = displayedProjects.filter((_,ind)=>ind !== index)
        setDisplayedProjects(arr);
        displayMessageToUser("success","Project moved to trash.")
    }

    const [inputValue,setInputValue] = useState("");

    const handleSearch = (e)=>{
        setInputValue(e.target.value);
    }
    useEffect(()=>{
        const arr = projects.filter((proj)=>proj.ProjectTitle.toLowerCase().includes(inputValue.toLowerCase()));
        setDisplayedProjects([...arr]);
    },[inputValue,projects])

    useEffect(()=>{
        document.title = "Projects";
    },[])

    return (
    <>
    <div className='flex flex-col gap-y-4 h-full' onClick={()=>{setOpenedMore(-1)}}>
        <DashboardNav currentLoc='Projects' action={handleSearch}/>
        <Functionalities/>
        <div className={`${displayedProjects.length === 0 ?"flex flex-wrap":"grid grid-cols-1 ss:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"} ${loading && "flex-grow"} gap-[15px] mt-3  ${displayedProjects.length === 0 && "items-center justify-center"}`}>
            {(displayedProjects.length !== 0 ? displayedProjects.map((proj,ind)=><Card key={ind} proj={proj} index={ind} openedMore={openedMore} setOpenedMore={setOpenedMore} handleMoveToTrash={handleMoveToTrash} />): loading ? <div className='h-full w-full flex justify-center items-center'>
            <MagnifyingGlass
                visible={true}
                height="80"
                width="80"
                ariaLabel="magnifying-glass-loading"
                wrapperStyle={{}}
                wrapperClass="magnifying-glass-wrapper"
                glassColor="#c0efff"
                color="#59AEF8"
                />
            </div>:<div className='flex flex-col items-center justify-start gap-y-2'>
                <img className='w-[9.375rem] h-[9.375rem]' src={ProjectsEmpty} alt="Projects_Empty" />
                <div>
                    <h1 className='text-grey font-semibold text-center'>This is your projects section ... but it’s empty</h1>
                    <p className='text-center max-w-[45ch] text-sm font-medium text-grey'>You can find all your projects here once you have some. 
                        Start creating and come back later!
                    </p>
                </div>
            </div>)}
        </div>
    </div>
    </>
  )
}
export default Projects