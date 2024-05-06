import { useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser"
import AdminBrainStorming from "../Admin Brainstorming/AdminBrainstorming";
import AdminBrainWriting from "../Admin Brainwriting/AdmingBrainwriting";
import BrainStorming from "./BrainStorming";
import BrainWriting from "./BrainWriting";
import axios from "../../utils/axios";
import { useEffect, useState } from "react";
import io from "socket.io-client"

const Ideation = () => {
    const { user } = useUser();
    const location = useLocation();
    const { project } = location.state;
    const [ideas, setIdeas] = useState([])
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])

    if(!project) throw new Error("where is the project!!!!!!!!!!!");

    const isCoordinator = user.email === project.coordinator.email;

    const getProjectIdeas = async ()=>{
        try {
            
            const response = await  axios.get(`idea/get-ideas/${project.projectId}`)
            setIdeas(response.data)
    } catch (error) {
           console.log(error) 
           throw new Error(error)
        }
    }

    useEffect(()=>{
        getProjectIdeas()

        // Connecting to the server 
        const newSocket = io(import.meta.env.VITE_API_URL);
        setSocket(newSocket);
        
        newSocket.emit('joinRoom', project.projectId)

        const profilePicUrl = user.profilePicUrl
        newSocket.emit('userData',{
            profilePicUrl
        })
         return () => newSocket.disconnect();
    },[project.projectId])

    useEffect(()=>{
        if(socket){
               socket.on('newIdea', (idea) => {
               setIdeas((prevIdeas) => [...prevIdeas, idea]);
                });
             socket.on('connectedUsers',connectedUsers =>setOnlineUsers(connectedUsers))
        }
    },[socket])

    return (
        <>
            {
                isCoordinator
                ? project.IdeationMethod === "brainstorming" ? <AdminBrainStorming project={project} ideas={ideas} onlineUsers={onlineUsers} socket={socket}/> : <AdminBrainWriting project={project} ideas={ideas} onlineUsers={onlineUsers} socket={socket}/>
                : project.IdeationMethod === "brainstorming" ? <BrainStorming project={project} ideas={ideas} onlineUsers={onlineUsers} socket={socket}/> : <BrainWriting  project={project} ideas={ideas} onlineUsers={onlineUsers} socket={socket}/>
            }
        </>

    )
}

export default Ideation