// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState  } from 'react'
import DashboardNav from '../DashboardNav'
import Functionalities from '../Functionalities'
import Card from './Card'
import {RecentsEmpty } from '../../../assets'
import { useOutletContext } from 'react-router-dom'
const Recents = () => {
    const {allProjects,loading,getProjects} = useOutletContext();
    const [openedMore,setOpenedMore] = useState(-1);
    const [Projects,setProjects] = useState([
        {
            projectId:"Public_1",
            ThumbnailUrl:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ProjectTitle:"Public-1",
            date: new Date().toLocaleDateString(),
            Description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero lfkjdlf lkdjf lkdjfl kjfl kjdfl ksdjfl kjdflk jdslfkj lkdjf lkdjf lsdkjf lskdjf lkjdf lkjdf lkjdfl jdlfj lkdjf ljdfl jdflkj ldskfj lkdjf ldjfl jdflksjdf lkjd flkdfj ldkfj lkdfj ldkfj dskfj"
        },
        {
            projectId:"Public_2",
            ThumbnailUrl:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ProjectTitle:"Public-2",
            date: new Date().toLocaleDateString(),
            Description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        }
    ]);
    

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
    <div className='flex flex-col gap-y-4' onClick={()=>{setOpenedMore(-1)}}>
        <DashboardNav currentLoc='Recents' action={handleSearch}/>
        <Functionalities/>
        <div className={`${displayedProjects.length === 0 ?"flex flex-wrap":"grid grid-cols-1 ss:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"} gap-[15px] mt-3 flex-grow ${displayedProjects.length === 0 && "items-center justify-center"}`}>
            {(displayedProjects.length !== 0 ? displayedProjects.map((proj,ind)=><Card key={proj.projectId} proj={proj} index={ind} openedMore={openedMore} setOpenedMore={setOpenedMore}  />): <div className='flex flex-col items-center justify-start gap-y-2'>
                <img className='w-[9.375rem] h-[9.375rem]' src={RecentsEmpty} alt="Projects_Empty" />
                <div>
                    <h1 className='text-grey font-semibold text-center'>No Recent Maps</h1>
                    <p className='text-center max-w-[45ch] text-sm font-medium text-grey'>Start using ESIdea and your recently opened maps will show up here.
                    </p>
                </div>
            </div>)}
        </div>
    </div>
  )
}
export default Recents