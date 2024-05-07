// eslint-disable-next-line no-unused-vars
import React, { createContext, useEffect, useRef, useState } from 'react'
import SideBar from './SideBar';
import { Outlet} from 'react-router-dom';
import ScrollToTop from './pages/ScrollToTop'
import EditProject from './pages/EditProject';
import DisplayCollaborators from './pages/DisplayCollaborators';
import axios from '../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
export const projectContext = createContext();
const Dashbord = () => {
    const [editProjectPopUp,setEditProjectPopUp] = useState(false);
    const [collaboratorsPopUp,setCollaboratorPopUp] = useState(false);
    const [projectToEdit,setprojectToEdit] = useState({});
    const [collaborators,setCollaborators] = useState([]);
    const [coordinator,setCoordinator] = useState({});
    const DivContainer = useRef();
    const [allProjects,setAllProjects] = useState([]);
    const [loading,setLoading] = useState(true);
    const displayMessageToUser = (type,message)=>{
      if(type === "success"){
        toast.success(message, {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
          });
      }else if(type === "error"){
        toast.error(message, {
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
    }
    const getProjects = async()=>{
          setLoading(true);
         try {
        const userToken = localStorage.getItem('userToken') 
        const response = await axios.get("project/get-all-projects", {
          headers: {
             'Authorization': `Bearer ${userToken}`
          },
        });
        if (response.statusText == 'OK') {
          setAllProjects(response.data);
          setLoading(false)
        } else {
            console.log(response)
            throw new Error ("Authentication has failed")
        }
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(()=>{
      getProjects();
    },[])
    const projectDependencies = {setEditProjectPopUp,setprojectToEdit,setCollaborators,setCollaboratorPopUp,allProjects,loading,getProjects,displayMessageToUser,setCoordinator}
    return (
      <projectContext.Provider value={projectDependencies}>
        <div className='w-full h-screen flex justify-between'>
            <SideBar/>
            <div ref={DivContainer} className='flex-grow bg-realWhite px-10 pt-8 flex flex-col gap-y-4 overflow-y-auto relative'>
                    <Outlet/>
            </div>
            <ScrollToTop container={DivContainer}/>
            <EditProject visible={editProjectPopUp} closePopUp={()=>{setEditProjectPopUp(false)}} projectToEdit={projectToEdit}/>

            <DisplayCollaborators visible={collaboratorsPopUp} closePopUp={()=>{setCollaboratorPopUp(false)}} coordinator={coordinator} collaborators={collaborators}/>

            <ToastContainer />
        </div>
        </projectContext.Provider>
        
  )
}

export default Dashbord