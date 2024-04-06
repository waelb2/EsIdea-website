// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import DashboardNav from '../DashboardNav'
import Functionalities from '../Functionalities'
import Card from './Card'
import { ProjectsEmpty } from '../../../assets'
const Projects = () => {
    const [Projects,setProjects] = useState([
        {
            projectId:"Project_1",
            img:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-1",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        },
        {
            projectId:"Project_2",
            img:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-2",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        },
        {
            projectId:"Project-3",
            img:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-1",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        },
        {
            projectId:"Project_4",
            img:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-4",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        },
        {
            projectId:"Project-5",
            img:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-5",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        }
    ]);
    const handleCheck = (ind)=>{
        const arr = [...displayedProjects];
        arr[ind].checked = !arr[ind].checked
        setDisplayedProjects(arr);
    }
    const [displayedProjects,setDisplayedProjects] = useState([]);

    useEffect(()=>{
        const arr = Projects.map(proj => {
            return {...proj,checked:false}
        })
        setDisplayedProjects(arr);
    },[Projects]);

    const [inputValue,setInputValue] = useState("");

    const handleSearch = (e)=>{
        setInputValue(e.target.value);
    }

    useEffect(()=>{
        const arr = Projects.filter((proj)=>proj.title.toLowerCase().includes(inputValue.toLowerCase()));
        setDisplayedProjects([...arr]);
    },[inputValue,Projects])

    return (
    <>
        <DashboardNav currentLoc='Projects' action={handleSearch}/>
        <Functionalities/>
        <div className={`flex flex-wrap gap-[15px] mt-3 flex-grow ${displayedProjects.length === 0 && "items-center justify-center"}`}>
            {(displayedProjects.length !== 0 ? displayedProjects.map((proj,ind)=><Card key={proj.projectId} img={proj.img} title={`${proj.title}`} date={proj.date} description={proj.description} checked={proj.checked} handleCheck={()=>{handleCheck(ind)}} />): <div className='flex flex-col items-center justify-start gap-y-2'>
                <img className='w-[150px] h-[150px]' src={ProjectsEmpty} alt="Projects_Empty" />
                <div>
                    <h1 className='text-grey font-semibold text-center'>This is your projects section ... but it’s empty</h1>
                    <p className='text-center max-w-[45ch] text-[14px] font-medium text-grey'>You can find all your projects here once you have some. 
                        Start creating and come back later!
                    </p>
                </div>
                <button className='bg-grey text-white px-6 py-1 rounded-2xl text-base font-medium'>Create my first project</button>
            </div>)}
        </div>
    </>
  )
}

export default Projects