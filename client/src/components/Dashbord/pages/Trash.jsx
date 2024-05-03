// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState,useContext } from 'react'
import DashboardNav from '../DashboardNav'
import CardTrash from './CardTrash'
import {TrashEmpty } from '../../../assets'
import { projectContext } from '../Dashbord'
import { MagnifyingGlass } from 'react-loader-spinner'
const Trash = () => {
    const {allProjects,loading} = useContext(projectContext)
    const [openedMore,setOpenedMore] = useState(-1);
    const [Projects,setProjects] = useState([]);
    useEffect(()=>{
        const filteredProjects = allProjects.filter(project => project.isTrashed)
        setProjects(filteredProjects);
    },[allProjects])

    const [displayedProjects,setDisplayedProjects] = useState([]);

    const [inputValue,setInputValue] = useState("");

    const handleSearch = (e)=>{
        setInputValue(e.target.value);
    }

    useEffect(()=>{
        const arr = Projects.filter((proj)=>proj.ProjectTitle.toLowerCase().includes(inputValue.toLowerCase()));
        setDisplayedProjects([...arr]);
    },[inputValue,Projects])
    return (
    <div className='flex flex-col gap-y-4 h-full' onClick={()=>{setOpenedMore(-1)}}>
        <DashboardNav currentLoc='Trash' action={handleSearch}/>
        <div className={`${displayedProjects.length === 0 ?"flex flex-wrap":"grid grid-cols-1 ss:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"} ${loading && "flex-grow"} gap-[15px] mt-3  ${displayedProjects.length === 0 && "items-center justify-center"}`}>
            {(displayedProjects.length !== 0 ? displayedProjects.map((proj,ind)=><CardTrash key={proj.projectId} proj={proj} index={ind} openedMore={openedMore} setOpenedMore={setOpenedMore} />): loading ?<div className='h-full w-full flex justify-center items-center'>
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
            </div> :<div className='flex flex-col items-center justify-start gap-y-2'>
                <img className='w-[9.375rem] h-[9.375rem]' src={TrashEmpty} alt="Projects_Empty" />
                <div>
                    <h1 className='text-grey font-semibold text-center'>Trash Empty</h1>
                    <p className='text-center max-w-[45ch] text-sm font-medium text-grey'>There are no deleted items.
                    </p>
                </div>
            </div>)}
        </div>
    </div>
  )
}
export default Trash