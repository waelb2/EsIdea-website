import { useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser"
import AdminBrainStorming from "../Admin Brainstorming/AdminBrainstorming";
import AdminBrainWriting from "../Admin Brainwriting/AdmingBrainwriting";
import BrainStorming from "./BrainStorming";
import BrainWriting from "./BrainWriting";
import axios from "axios";
import { useEffect, useState } from "react";

const Ideation = () => {
    const { user } = useUser();
    const location = useLocation();
    const { project } = location.state;
    const [ideas, setIdeas] = useState([])

    if(!project) throw new Error("where is the project!!!!!!!!!!!");

    const isCoordinator = user.email === project.coordinator.email;

    const getProjectIdeas = async ()=>{
        try {
            
            const response = await  axios.get(`http://localhost:3000/idea/get-ideas/${project.projectId}`)
            setIdeas(response.data)
    } catch (error) {
           console.log(error) 
           throw new Error(error)
        }
    }

    useEffect(()=>{
        getProjectIdeas()
    },[])
    return (
        <>
            {
                isCoordinator
                ? project.IdeationMethod === "brainstorming" ? <AdminBrainStorming project={project} ideas={ideas}/> : <AdminBrainWriting project={project} ideas={ideas}/>
                : project.IdeationMethod === "brainstorming" ? <BrainStorming project={project} ideas={ideas}/> : <BrainWriting  project={project} ideas={ideas}/>
            }
        </>

    )
}

export default Ideation