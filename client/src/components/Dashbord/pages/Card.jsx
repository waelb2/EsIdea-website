// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Colaborators, Edit, ExportProj, More, MoveFavorite, OpenProj, Publish, TrashBlack } from '../../../assets'
import { projectContext } from '../Dashbord';
import { useNavigate } from 'react-router-dom';
import axios  from '../../../utils/axios';
const Card = ({proj,index,openedMore,setOpenedMore}) => {
  const {displayMessageToUser,getProjects} = useContext(projectContext);
  const navigate = useNavigate()
  const dataOptions  = { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: 'numeric', 
  minute: 'numeric', 
  second: 'numeric', 
  timeZoneName: 'short' 
}
  const userToken = localStorage.getItem('userToken')
  const moveToTrash = async (projectId)=>{
      setOpenedMore(-1);
      axios.delete(`project/trash-project/${projectId}`, {headers: {
            'Authorization': `Bearer ${userToken}`
        },
        }).then(response => {
          displayMessageToUser("success","Project moved to trash successfully")
          getProjects();
        })
        .catch(error => { 
            console.error('Error:', error.response.data.error);
            if (error.response && error.response.status === 401){
            navigate('/login') 
            }
        });
  }
  const addToFavourite = async (projectId) => {
    try {
        const response = await axios.patch(
            'user/project/favourite',
            { projectId },
            {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }
        );
        displayMessageToUser("success","Project added to favourites successfully!")
        getProjects();
    } catch (error) {
        console.error('Error:', error.response.data.error);
        if (error.response && error.response.status === 401) {
            navigate('/login');
        }
    }
}
const addToPublic = async(projectId)=>{
  try {
    const response = await axios.post("user/publicProjectRequest",{projectId},
    {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
    if (response.status === 201) {
      displayMessageToUser("success","Public request sent successfully");
    } else {
      throw new Error("Authentication has failed");
    }
  } catch (error) {
    if(error.response.status === 400){
      displayMessageToUser("error",error.response.data.error);
    }
  }
  setOpenedMore(-1);
}
  const {setprojectToEdit,setEditProjectPopUp,setCollaborators,setCoordinator,setCollaboratorPopUp} = useContext(projectContext);
  const projectDetails = [
    {
        title:"Open",
        icon:OpenProj,
        line:false,
        action:()=>{
        }
    },
    {
        title:"Edit file info",
        icon:Edit,
        line:true,
        action:()=>{
          setprojectToEdit(proj);
          setEditProjectPopUp(true);
        }
    },
    {
        title:"Move to favorites",
        icon:MoveFavorite,
        line:false,
        action:()=>{
          if(!proj.isFav){
            addToFavourite(proj.projectId);
          }else{
            displayMessageToUser("error","Project is already in favourites!")
          }
        }
    },
    {
        title:"Move to trash",
        icon:TrashBlack,
        line:false,
        action:()=>{
          moveToTrash(proj.projectId)
        }
    },
    {
        title:"Publish",
        icon:Publish,
        line:true,
        action:()=>{
          addToPublic(proj.projectId);
        }
    },
    {
        title:"Export",
        icon:ExportProj,
        line:true,
        action:()=>{
        }
    },
    {
        title:"Colaborators",
        icon:Colaborators,
        line:false,
        action:()=>{
          setCollaborators(proj.collaborators);
          setCoordinator(proj.coordinator)
          setCollaboratorPopUp(true);
          setOpenedMore(-1);
        }
    }
]

  const navigateToIdeationPage = ()=>{
    // const userIsCoordinator = user.user.email === proj.coordinator.email;
    // if(userIsCoordinator){
    //     navigate(`/admin${proj.IdeationMethod}?ProjectTitle=${proj.ProjectTitle}&MainTopic=${proj.MainTopic}`)
    // }else{
    //   navigate(`/${proj.IdeationMethod}?ProjectTitle=${proj.ProjectTitle}&MainTopic=${proj.MainTopic}`);
    // }

    navigate("/project/ideation", {state: {
      project: proj
    }})
  }

  return (
    <div onClick={navigateToIdeationPage}  className={`group flex flex-col w-full  rounded-md   relative transition-all duration-500   hover:shadow-lg border-2 border-gray-200 cursor-pointer`}>
        <img className='h-32 object-contain rounded-t-md' src={proj.ThumbnailUrl === "" ? "https://img.freepik.com/free-vector/startup-success-launch-business-project_107791-4758.jpg?t=st=1714342322~exp=1714345922~hmac=81d1a808f2b5abda57ed89b74489360abce54b3c9bdc7816ecd6a489f3339b35&w=1380": proj.ThumbnailUrl} alt="Project_Picture" />
        <div className='flex flex-col gap-y-1 p-3 bg-slate-100  rounded-b-md flex-grow'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[14px] font-semibold'>{proj.ProjectTitle}</h1>
                <p className='text-[12px] '>{new Date(proj.joinedDate).toLocaleDateString(dataOptions)}</p>
            </div>
            <p className='text-sm text-grey font-medium line-clamp-[4]'>
                {proj.Description}
            </p>
        </div>
        <div onClick={(e)=>{e.stopPropagation()}}>
          <img onClick={()=>{index !== openedMore ? setOpenedMore(index):setOpenedMore(-1)}} className='absolute bottom-2 right-2 w-6 h-6 duration-500 transition-all rounded-full p-1 hover:bg-slate-300 hidden group-hover:inline cursor-pointer' src={More} alt='More'/>
          <div className={`${index !== openedMore ?"hidden":"bg-realWhite min-w-[10.625rem] absolute shadow-2xl bottom-8 right-4 border p-3 rounded-lg border-black slideTop"} overflow-hidden`}>
              <ul>
                  {projectDetails.map(pd=><li key={pd.title}>
                    <button onClick={()=>{pd.action()}}  className={`flex px-2 py-1 items-center hover:bg-[#d9e9f6] w-full  rounded-md transition-all`}>
                      <img className='mr-2' src={pd.icon} alt={pd.title} />
                      <p>{pd.title}</p>
                    </button>
                    {pd.line && <hr className='border-t-2 border-gray-300 my-0.5'/>}
                  </li>)}
              </ul>
          </div>
        </div>
    </div>
  )
}
Card.propTypes = {
    proj:PropTypes.object,
    index:PropTypes.number.isRequired,
    openedMore:PropTypes.number.isRequired,
    setOpenedMore:PropTypes.func.isRequired
};
export default Card