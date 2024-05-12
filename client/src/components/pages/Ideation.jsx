import { useFetcher, useLocation, useNavigate } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import AdminBrainStorming from '../Admin Brainstorming/AdminBrainstorming'
import AdminBrainWriting from '../Admin Brainwriting/AdmingBrainwriting'
import BrainStorming from './BrainStorming'
import BrainWriting from './BrainWriting'
import axios from '../../utils/axios'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const Ideation = () => {
  const { user } = useUser()
  const location = useLocation()
  const { project } = location.state
  const [ideas, setIdeas] = useState([])
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const projectCompleted = project.ProjectStatus === "completed"
  const navigate = useNavigate()

  if (!project) throw new Error('where is the project!!!!!!!!!!!')

  const isCoordinator = user.email === project.coordinator.email
    console.log(project.ProjectStatus)
  const getProjectIdeas = async () => {
    try {
      const response = await axios.get(`idea/get-ideas/${project.projectId}`)
      setIdeas(response.data)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  useEffect(() => {
    getProjectIdeas()
    // Connecting to the server
    const newSocket = io(import.meta.env.VITE_API_URL)
    setSocket(newSocket)

    newSocket.emit('joinRoom', project.projectId)

    const profilePicUrl = user.profilePicUrl

    newSocket.emit('userData', {
      lastName: user.lastName,
      profilePicUrl,
      email: user.email
    })
    return () => newSocket.disconnect()
  }, [project.projectId])

  useEffect(() => {
    if (socket) {
      socket.on('newIdea', idea => {
        setIdeas(prevIdeas => [...prevIdeas, idea])
      })

      socket.on('deleteId', ideaId => {
        setIdeas(prevIdeas => prevIdeas.filter(idea => idea.ideaId !== ideaId))
      })

      socket.on('deleteManyIdeas', newIdeas => {
        setIdeas(newIdeas)
      })
      socket.on('connectedUsers', connectedUsers => {
        const sortedUsers = connectedUsers.sort((a, b) => {
          return a.email.localeCompare(b.email)
        })
        setOnlineUsers(sortedUsers)
      })
    }
  }, [socket])


  useEffect(()=>{
    if(projectCompleted){
        (
        navigate('/visualisation', {
          state: {
            project: project
          }
        })
      )
    }
  },[])
  return (
    <>
      {!projectCompleted && (isCoordinator ? (
        project.IdeationMethod === 'brainstorming' ? (
          <AdminBrainStorming
            project={project}
            ideas={ideas}
            onlineUsers={onlineUsers}
            socket={socket}
          />
        ) : (
          <AdminBrainWriting
            project={project}
            ideas={ideas}
            onlineUsers={onlineUsers}
            socket={socket}
          />
        )
      ) : project.IdeationMethod === 'brainstorming' ? (
        <BrainStorming
          project={project}
          ideas={ideas}
          onlineUsers={onlineUsers}
          socket={socket}
        />
      ) : (
        <BrainWriting
          project={project}
          ideas={ideas}
          onlineUsers={onlineUsers}
          socket={socket}
        />
      ))}
    </>
  )
}

export default Ideation
