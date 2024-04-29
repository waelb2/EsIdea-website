// eslint-disable-next-line no-unused-vars
import React, { createContext, useEffect, useRef, useState } from 'react'
import SideBar from './SideBar';
import { Outlet} from 'react-router-dom';
import ScrollToTop from './pages/ScrollToTop'
import EditProject from './pages/EditProject';
import DisplayCollaborators from './pages/DisplayCollaborators';
export const projectContext = createContext();
const Dashbord = () => {
    const [editProjectPopUp,setEditProjectPopUp] = useState(false);
    const [collaboratorsPopUp,setCollaboratorPopUp] = useState(false);
    const [idProject,setIdProjects] = useState('');
    const [collaborators,setCollaborators] = useState([]);
    const editProjectDependencies = {setEditProjectPopUp,setIdProjects,setCollaborators,setCollaboratorPopUp}
    const DivContainer = useRef();
    return (
        <div className='w-full h-screen flex justify-between'>
            <SideBar/>
            <div ref={DivContainer} className='flex-grow bg-realWhite px-10 pt-8 flex flex-col gap-y-4 overflow-y-auto relative'>
                <projectContext.Provider value={editProjectDependencies}>
                    <Outlet/>
                </projectContext.Provider>
            </div>
            <ScrollToTop container={DivContainer}/>
            <EditProject visible={editProjectPopUp} closePopUp={()=>{setEditProjectPopUp(false)}} idProject={idProject}/>
            <DisplayCollaborators visible={collaboratorsPopUp} closePopUp={()=>{setCollaboratorPopUp(false)}} collaborators={collaborators}/>
        </div>
  )
}

export default Dashbord