// eslint-disable-next-line no-unused-vars
import React,{useState,useRef, useContext, useEffect} from 'react'
import propTypes from 'prop-types'
import { blackClose } from '../../../assets'
import axios from 'axios'
import { projectContext } from '../Dashbord'
import { useNavigate } from 'react-router-dom'
const EditProject = ({visible,closePopUp,projectToEdit}) => {
    const navigate = useNavigate();
    const {displayMessageToUser,getProjects} = useContext(projectContext)
    const [image, setImage] = useState(null)
    const [projectName,setProjectName] = useState("");
    const [description,setDescription] = useState("");
    useEffect(()=>{
        setProjectName(projectToEdit.projectTitle);
        setDescription(projectToEdit.Description);
    },[projectToEdit.projectTitle,projectToEdit.Description])
    const [banner,setBanner] = useState(projectToEdit.ThumbnailUrl
    );
    const handleDragOver = (event)=>{
        event.preventDefault();
    }
    const handleUpload=(event)=>{
        setBanner(URL.createObjectURL(event.target.files[0]))
        setImage(event.target.files[0])
    }
    const handleDrop=(event)=>{
        setBanner(URL.createObjectURL(event.dataTransfer.files[0]));
        event.preventDefault();
    }
    const myForm = new FormData()
    myForm.append('thumbnailUrl',image)
    myForm.append('title', "wael");
    myForm.append('description', "description");
    const browseRef = useRef();
    const userToken = localStorage.getItem('userToken')
    const editProject = ()=>{
        axios.patch(`http://localhost:3000/project/update-project/${projectToEdit.projectId}`,myForm, {headers: {
            'Authorization': `Bearer ${userToken}`
        },
        }).then(response => {
            closePopUp();
            displayMessageToUser("success","Project updated succesfully.")
            getProjects();
        })
        .catch(error => {
            console.error('Error:', error.response.data.error);
            if (error.response && error.response.status === 401){
                navigate('/login') 
            }
        });
    }
  return (
    <div onClick={closePopUp} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation()}} className='bg-white max-w-full w-[600px] min-h-[450px] ss:min-h-[500px]  max-h-full  rounded-2xl shadow-md  px-3 py-4 sm:py-7 sm:px-9 m-4'>
                    <div className='w-full h-full flex flex-col'>
                        <div  className='flex justify-end w-full'>
                            <img onClick={closePopUp} className='w-5 h-5 cursor-pointer' src={blackClose} alt="close" />
                        </div>
                        <div className='w-full flex flex-col items-center'>

                            <h1 className='font-bold text-2xl text-center mb-4'>Edit Project metadata</h1>

                            <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                                <label htmlFor="projectTitle" className='text-black font-semibold'>
                                    Give us a new title
                                </label>
                                <input value={projectName} onChange={(e)=>{setProjectName(e.target.value)}} id='projectTitle' className='outline-none text-sm border-[1px] border-grey rounded-md py-2 px-4' type="text" placeholder='Project title' />
                            </div>
                            <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                                <label htmlFor="projectDescriptionEdit" className='text-black font-semibold'>
                                    Give us a new description
                                </label>
                                <textarea value={description} placeholder='Description' onChange={(e)=>{setDescription(e.target.value)}} className='outline-none text-sm border-[1px] border-grey rounded-md resize-none py-2 px-4' name="Description" id="projectDescriptionEdit" cols="30" rows="3">
                                    
                                </textarea>
                            </div>
                            <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                                <h1 className='text-black font-semibold'>
                                    Give us a new thumbnail
                                </h1>
                                <div className='border-2 border-dashed border-skyBlue p-1 rounded-md'>
                                    {
                                        !banner ? <div onDrop={handleDrop} onDragOver={handleDragOver} className='flex flex-col items-center justify-center gap-1'>
                                            <h1 className='text-black'>Drag and Drop pic to upload</h1>
                                            <h1 className='text-black'>Or</h1>
                                            <input  accept='image/*' onChange={handleUpload}  ref={browseRef} hidden type="file" />
                                            <button className='bg-skyBlue py-1 px-2 rounded-xl text-realWhite' onClick={()=>{browseRef.current.click()}}>Browse</button>
                                        </div>:
                                        <div className='flex flex-col items-center justify-center gap-1'>
                                            <h1 className='text-black'>Banner selected:</h1>
                                            <img className='rounded-md object-contain w-28' src={banner} alt="banner" />
                                            <button onClick={()=>{setBanner(null)}} className='bg-red text-realWhite py-1 px-2 rounded-lg'>Cancel</button>
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>
                        <div className={`w-[90%] self-center flex justify-end`}>
                                <button onClick={editProject} className={`bg-skyBlue px-3 py-1 rounded-md text-white`}>Save</button>
                        </div>
                    </div>
                </div>
    </div>
  )
}
EditProject.propTypes={
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired,
    projectToEdit:propTypes.object.isRequired
}

export default EditProject