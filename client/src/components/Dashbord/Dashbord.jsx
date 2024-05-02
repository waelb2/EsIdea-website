// eslint-disable-next-line no-unused-vars
import React, { createContext, useEffect, useRef, useState } from 'react'
import SideBar from './SideBar';
import { Outlet} from 'react-router-dom';
import ScrollToTop from './pages/ScrollToTop'
import EditProject from './pages/EditProject';
import DisplayCollaborators from './pages/DisplayCollaborators';
import axios from 'axios';
export const projectContext = createContext();
const Dashbord = () => {
    const [editProjectPopUp,setEditProjectPopUp] = useState(false);
    const [collaboratorsPopUp,setCollaboratorPopUp] = useState(false);
    const [projectToEdit,setprojectToEdit] = useState({});
    const [collaborators,setCollaborators] = useState([]);
    const DivContainer = useRef();
    const getProjects = async(setProjects, setLoading)=>{
          setLoading(true);
         try {
        const userToken = localStorage.getItem('userToken') 
        const response = await axios.get(`http://localhost:3000/project/get-all-projects/}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
             'Authorization': `Bearer ${userToken}`
          },
        });

        if (response.statusText == 'OK') {
          setProjects(response.data);
          setLoading(false)
        } else {
            console.log(response)
            throw new Error ("Authentication has failed")
        }
      } catch (error) {
        console.log(error);
      }
    }
    const editProjectDependencies = {setEditProjectPopUp,setprojectToEdit,setCollaborators,setCollaboratorPopUp, getProjects}
    return (
        <div className='w-full h-screen flex justify-between'>
            <SideBar/>
            <div ref={DivContainer} className='flex-grow bg-realWhite px-10 pt-8 flex flex-col gap-y-4 overflow-y-auto relative'>
                <projectContext.Provider value={editProjectDependencies}>
                    <Outlet/>
                </projectContext.Provider>
            </div>
            <ScrollToTop container={DivContainer}/>
            <EditProject visible={editProjectPopUp} closePopUp={()=>{setEditProjectPopUp(false)}} projectToEdit={projectToEdit}/>
            <DisplayCollaborators visible={collaboratorsPopUp} closePopUp={()=>{setCollaboratorPopUp(false)}} collaborators={collaborators}/>
        </div>
  )
}

export default Dashbord