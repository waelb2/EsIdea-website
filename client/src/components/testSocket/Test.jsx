import { useLocation } from "react-router-dom";
import Project from "./Project"
import { useState } from "react"

function Test() {
  

  const location  = useLocation()
  const user = JSON.parse(localStorage.getItem('user'))
  const userToken = localStorage.getItem('userToken')
  const profilePicUrl = user.profilePicUrl
  const queryParams = new URLSearchParams(location.search);
  const project = {
    projectId : '66304643fffed1280d828d8d',
    projectTitle :"Esi cup"
  } 
  const [userName, setUserName] = useState(user.firstName +'_'+ user.lastName)

 
  return (
    <>
    <div className="flex flex-col items-center justify-center">
<h3 className="text-lg font-bold mb-4">You are logged in as <span className="text-blue-500 ">{userName} <img src={profilePicUrl} alt="" className="inline-block w-10 h-10 rounded-full ml-2" /></span></h3>
<Project projectTitle={project.projectTitle} projectId={project.projectId} userToken={userToken} profilePicUrl={profilePicUrl}></Project>
 
</div>
</> 
  )
}

export default Test