// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState,useContext  } from 'react'
import DashboardNav from '../DashboardNav'
import Functionalities from '../Functionalities'
import Card from './Card'
import { ProjectsEmpty } from '../../../assets'
import { UserContext } from '../../../App'
import { useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import EditProject from './EditProject'
const Projects = () => {
    //User
    const {user} = useContext(UserContext);

    const {state} = useLocation();
    const [fromChangePassword,setFromChangePassword] = useState(false);
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
          toast.success('Password changed successfully.', {
            position: "top-center",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
            });
        }
    },[fromChangePassword])

    const [openedMore,setOpenedMore] = useState(-1);
    const [Projects,setProjects] = useState([
        {
            projectId:"Project_1",
            thumbnailUrl:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-1",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        },
        {
            projectId:"Project_2",
            thumbnailUrl:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-2",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        },
        {
            projectId:"Project-3",
            thumbnailUrl:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-1",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        },
        {
            projectId:"Project_4",
            thumbnailUrl:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-4",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        },
        {
            projectId:"Project-5",
            thumbnailUrl:"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title:"Project-5",
            date: new Date().toLocaleDateString(),
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptatum fuga labore delectus illum tempora laudantium officia quam optio vero"
        }
    ]);
    const [displayedProjects,setDisplayedProjects] = useState([]);

    const [inputValue,setInputValue] = useState("");

    const handleSearch = (e)=>{
        setInputValue(e.target.value);
    }
    useEffect(()=>{
        const arr = Projects.filter((proj)=>proj.title.toLowerCase().includes(inputValue.toLowerCase()));
        setDisplayedProjects([...arr]);
    },[inputValue,Projects])

    const [editProjectPopUp,setEditProjectPopUp] = useState(false);

    const handleEditProjects = (ind)=>{
        console.log(Projects[ind]);
        setEditProjectPopUp(true);
    }

    return (
    <>
    <div className='flex flex-col gap-y-4' onClick={()=>{setOpenedMore(-1)}}>
        <DashboardNav currentLoc='Projects' action={handleSearch}/>
        <Functionalities/>
        <div className={`${displayedProjects.length === 0 ?"flex flex-wrap":"grid grid-cols-1 ss:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"} gap-[15px] mt-3 flex-grow ${displayedProjects.length === 0 && "items-center justify-center"}`}>
            {(displayedProjects.length !== 0 ? displayedProjects.map((proj,ind)=><Card key={proj.projectId} proj={proj} index={ind} openedMore={openedMore} setOpenedMore={setOpenedMore} handleEditProjects={handleEditProjects} />): <div className='flex flex-col items-center justify-start gap-y-2'>
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
    </div>
    <ToastContainer />
    <EditProject visible={editProjectPopUp} closePopUp={()=>{setEditProjectPopUp(false)}}/>
    </>
  )
}
export default Projects