// eslint-disable-next-line no-unused-vars
import React, { createContext, useEffect, useRef, useState } from 'react'
import { BrainstormingMethodIcon, BrainwritingMethodIcon, Search, blackClose,Back, ProjectsEmpty, dragdropfiles, User } from '../../../assets';
import propTypes from 'prop-types';
import Select from './Select'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDebounce } from '../constants';
import { ColorRing } from 'react-loader-spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const DependenciesContext = createContext();
const CreateNewProject = ({method,setMethod,visible,closePopUp,currentPage,nextPage,prevPage}) => {
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const [clubs,setClubs] = useState(null);
    const [modules,setModules] = useState(null);
    const [events,setEvents] = useState(null);
    const [projectName,setProjectName] = useState("");
    const [description,setDescription] = useState("");
    const [tags,setTags] = useState([]);
    const [tagsDisplayed,setTagsDisplayed] = useState([]);
    const [mainTopic,setMainTopic] = useState("");
    const [subTopics,setSubTopics] = useState([]);
    const [addSubTopicState,setAddSubTopicState] = useState(false);
    const [subTopicInputValue,setSubTopicInputValue] = useState("");
    const [banner,setBanner] = useState(null);
    const [loading,setLoading] = useState(false);
    const [searchColl,setSearchColl] = useState("");
    const [displayedCollaborators,setDisplayedCollaborators] = useState([]);
    const [collaborators,setCollaborators] = useState([]);
    const debouncedSearch = useDebounce(searchColl,500);
    const [active,setActive] = useState("");
    const [inputValue,setInputValue] = useState("");
    const browseRef = useRef();
    const userToken = localStorage.getItem('userToken')
    const methods = [{
            Id:"BrainstormingMethodIcon_btn",
            icon:BrainstormingMethodIcon,
            title:"Brainstorming",
            action:function(){
                setMethod("Brainstorming")
                nextPage();
            }
        },
        {
            Id:"BrainwritingMethodIcon_btn",
            icon:BrainwritingMethodIcon,
            title:"Brainwriting",
            action:function(){
                setMethod("Brainwriting");
                nextPage();
            }
        }
    ]
    const displayedMethods = methods.filter(method=>method.title.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()))
    const formattedTags = tags.map(tag=>{
        return (
            {tagType : tag.tagType,
            tagId : tag.tagId
            }
        )
    })
    // creating the project data object
    const myForm = new FormData()
    myForm.append('projectThumbnail',image)
    myForm.append('projectTitle', projectName);
    myForm.append('description', description);
    myForm.append('ideationMethodName', method);
    collaborators.forEach(collaborator => {
        myForm.append('collaborators[]', collaborator.email);
    });
    myForm.append('mainTopic', mainTopic);
    subTopics.forEach(subTopic => {
        myForm.append('subTopics[]', subTopic);
    });
    formattedTags.forEach(tag => {
        myForm.append('tags[]',JSON.stringify( tag));
    });
    ////////////////////:::::Methods::::://///////////////////////////
    const getTags = async (tagPath,callback) =>{
        try {
            const userToken = localStorage.getItem('userToken')
            const response = await axios.get(`http://localhost:3000/${tagPath}`, {
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
             'Authorization': `Bearer ${userToken}`
          },
        });
        if (response.status === 200) {
            callback(response.data);
        } else {
          throw new Error("Authentication has failed!");
        } 
        } catch (error) {
            console.log(error) 
            throw new Error 
        }
    }
    useEffect(()=>{
        getTags('club/getClubs',setClubs)
        getTags('module/getModules',setModules)
        getTags('event/getEvents',setEvents)
    }, [])
    const handleAddNewSubTopic = ()=>{
        setAddSubTopicState(true);
    }
    const handleAddSubTopic = ()=>{
        if(subTopicInputValue !== ""){
            setSubTopics(prev => [...prev,subTopicInputValue]);
            setSubTopicInputValue("");
            setAddSubTopicState(false);
        }else{
            toast.error('You can\'t add empty sub topic!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
                });
        }
    }
    const handleRemoveSubTopic = (ind)=>{
        const arr = subTopics.filter((_,index)=>ind !== index);
        setSubTopics(arr);
    }
    const addTag= (item)=>{
        setTags(prevtags => [...prevtags,item.obj]);
        setTagsDisplayed(prevDisTags=>[...prevDisTags,item]);
    }
    const removeTag = (index)=>{
        tagsDisplayed[index].setSelected(false);
        const arr1 = tagsDisplayed.filter((_,ind)=>ind !== index);
        const arr2 = tags.filter((_,ind)=>ind !== index);
        setTagsDisplayed([...arr1]);
        setTags([...arr2]);
    }
    const handleDragOver = (event)=>{
        event.preventDefault();
    }
    const handleDrop=(event)=>{
        setBanner(URL.createObjectURL(event.dataTransfer.files[0]));
        event.preventDefault();
    }
    const handleUpload=(event)=>{
        setBanner(URL.createObjectURL(event.target.files[0]))
        setImage(event.target.files[0])
    }
    useEffect(()=>{
        const  loadCollaborators = ()=>{
            setLoading(true);
            axios.post('http://localhost:3000/user/search-user-email', {
                emailQuery : debouncedSearch
            })
            .then(response => {
                setDisplayedCollaborators( response.data.matchedUsers);
                setLoading(false);
            }).catch(err => console.log(err));
        }
        loadCollaborators();
    },[debouncedSearch])

    const handleAddCollaborator = (collaborator)=>{
        setCollaborators(prev => [...prev,collaborator]);
        setSearchColl("");
    }
    const handleRemoveCollaborator = (ind)=>{
        setCollaborators(prev => {
            const arr = prev.filter((_,index)=>index !== ind);
            return arr;
        });
    }
    const createProject = async ()=>{
        axios.post('http://localhost:3000/project/create-project',myForm, {headers: {
            'Authorization': `Bearer ${userToken}`
        },
        }).then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => { 
            console.error('Error:', error.response.data.error);
            if (error.response && error.response.status === 401){
            navigate('/login') 
            }
        });
    }
    const displayError = ()=>{
        toast.error('Please fill all fields!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
            });
    }
    const handleNext=()=>{
        switch(currentPage){
            case 2:
                if(projectName !== '' && description !== '' && tags.length !== 0){
                    nextPage()
                }else{
                    displayError();
                }
                break;
            case 3:
                if(collaborators.length !== 0){
                    nextPage()   
                }else{
                    displayError();
                }
                break;
            case 4:
                if(mainTopic !== ""){
                    nextPage()   
                }else{
                    displayError();
                }
                break
        }
    }
    const dependencies = {addTag,removeTag,active,setActive};
    return (
        <div onClick={closePopUp} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation();setActive("")}} className='bg-white max-w-full w-[37.5rem]   rounded-2xl shadow-md  px-3 py-4 sm:py-7 sm:px-9 m-4'>
                <div className={`flex flex-col justify-center items-center`}>

                        <div className={`w-full flex  ${currentPage === 1 ? "justify-end":"justify-between"}`}>
                            <img onClick={prevPage} className={`w-6 h-6 cursor-pointer ${currentPage > 1 ?"block":"hidden"}`} src={Back} alt="Back" />
                            <img onClick={closePopUp} className={`w-5 h-5 cursor-pointer`} src={blackClose} alt="Close" />
                        </div>

                        <div className={`w-full ${currentPage === 1 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                Choose a method
                            </h1>
                            <div className='flex w-full  self-center border-2 rounded-md ss:p-1 shadow-md mb-5 p-2'>
                                <input  onChange={(e)=>{setInputValue(e.target.value)}} className='flex-grow flex-shrink w-full outline-none ml-2 text-sm' placeholder='Search' type="text" />
                                <img className='w-5 h-5 ss:w-7 ss:h-7 ml-1' src={Search} alt="Search" />
                            </div>

                            <div className='flex flex-wrap gap-3 justify-center  ss:px-9 ss:justify-start overflow-y-auto scroll-smooth py-2'>
                                {displayedMethods.map((method)=>(<div onClick={method.action} className='bg-lightGrey w-[9rem] h-[7rem] rounded-md flex flex-col items-center justify-center cursor-pointer transition-shadow duration-300 hover:shadow-md' key={method.Id}>
                                    <img className='w-16 h-16' src={method.icon} alt={method.title} />
                                    <p className='text-black text-sm font-medium'>{method.title}</p>
                                </div>))}
                            </div>
                        </div>

                        <div className={`w-full ss:px-3 ${currentPage === 2 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                New <span className='text-skyBlue'>{method}</span>
                            </h1>

                            <div className='flex flex-col w-full  gap-1 mb-3'>
                                <label htmlFor="projectName" className='text-black font-semibold'>
                                    What shall we name your project
                                </label>
                                <input onChange={(e)=>{setProjectName(e.target.value)}} id='projectName' className='outline-none text-sm border border-grey rounded-md py-2 px-4' type="text" />
                            </div>

                            <div className='flex flex-col w-full  gap-1 mb-3'>
                                <label htmlFor="projectDescription" className='text-black font-semibold'>
                                    Give your project a short description
                                </label>
                                <textarea onChange={(e)=>{setDescription(e.target.value)}} className='outline-none text-sm border border-grey rounded-md resize-none py-2 px-4' name="Description" id="projectDescription" cols="30" rows="4">
                                </textarea>
                            </div>
                            <div className='flex flex-col w-full  gap-1 mb-3'>
                                <h1 className='text-black font-semibold'>In which category do you wanna put your project </h1>
                                <div className='border border-grey rounded-md py-3 px-4 mb-2 '>
                                    {tagsDisplayed.length !== 0 ?
                                        <div className='w-full flex flex-wrap gap-2 max-h-16 overflow-y-auto'>
                                            {tagsDisplayed.map((val,ind)=><div className='flex gap-1 p-1 items-center rounded-md bg-gray-200' key={ind}>
                                            <p className='text-xs'>{val.obj.tagName}</p>
                                            <img onClick={()=>{removeTag(ind)}} className='w-2 cursor-pointer' src={blackClose} alt="remove" />
                                        </div>)}
                                        </div>
                                    :<p className='text-xs text-gray-700'>Please use the lists bellow to associate a category to your project</p>}
                                </div>
                                <DependenciesContext.Provider value={dependencies}>
                                    <div onClick={(e)=>{e.stopPropagation()}} className='flex gap-2 items-center flex-wrap relative'>
                                        <Select  title={"module"} data={modules} accesorKey={"moduleName"}/>
                                        <Select  title={"club"} data={clubs} accesorKey={"clubName"}/>
                                        <Select  title={"event"} data={events} accesorKey={"eventName"}/>
                                    </div>
                                </DependenciesContext.Provider>
                            </div>
                            
                        </div>

                        <div className={`w-full  ${currentPage === 3 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                New <span className='text-skyBlue'>Brainstorming</span>
                            </h1>
                        
                            <label className='text-black font-semibold self-start mb-2'  htmlFor="collaborator">Do you want to add some collaborator</label>

                            <div className='w-full  self-center relative'>
                                <div className='flex w-full  self-center border-2 rounded-md ss:p-1 shadow-lg mb-5 p-2'>
                                    <input value={searchColl} onChange={(e)=>{setSearchColl(e.target.value)}} className='flex-grow w-full flex-shrink outline-none ml-2 text-sm' id='collaborator' placeholder='Search' type="text" />
                                    <img className='w-5 h-5 ss:w-7 ss:h-7 ml-1' src={Search} alt="Search" />
                                </div>

                                <div className={`border shadow-md absolute top-10 rounded-md p-1 w-full mb-3 bg-realWhite ${debouncedSearch !== "" || loading ?"block":"hidden"}`}>
                                    {loading? <div className='flex justify-center items-center'><ColorRing visible={true} height="50" width="50" ariaLabel="color-ring-loading" wrapperStyle={{}} wrapperClass="color-ring-wrapper" colors={['#3A86FF', '#3A86FF', '#3A86FF', '#3A86FF', '#3A86FF']}
                                    /></div> : displayedCollaborators.length !== 0 && debouncedSearch !== "" ? <div className='flex flex-col gap-1 max-h-44 overflow-y-auto scroll-smooth'>
                                    {
                                        displayedCollaborators.map((collaborator)=><div  className='flex justify-between items-center border rounded-md border-black p-2' key={collaborator.name}>
                                             <div className='flex gap-2'>
                                                <img className='w-11 h-11 rounded-full' src={collaborator.profilePicUrl !== "" ? collaborator.profilePicUrl : User} alt="user" />
                                                <div className='flex flex-col justify-center'>
                                                    <p className='font-medium text-sm'>{collaborator.firstName + ' ' + collaborator.lastName}</p>
                                                    <p className='text-sm'>{collaborator.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={()=>{handleAddCollaborator(collaborator)}} className='bg-skyBlue text-realWhite px-2 py-0.5 rounded-lg'>invite</button>
                                        </div>)
                                    }
                                </div> : debouncedSearch !== "" && <div className='flex flex-col items-center justify-center'>
                                    <img className='w-32 h-32' src={ProjectsEmpty} alt="empty" />
                                    <p className='text-center text-base'>
                                        Sadly, We couldn’t find this user in <br /> our database
                                    </p>
                                </div> }
                                </div>
                            </div>

                            <div className='w-full  self-center mb-2'>
                                {collaborators.length === 0 ? <div className='flex flex-col items-center justify-center max-h-64'>
                                        <img className='w-32 h-32' src={ProjectsEmpty} alt="empty" />
                                        <p className='text-base'>{"No collaborator :("}</p>
                                        <p className='text-center text-base'>Don’t worry you can add them by just searching there names.</p>
                                    </div>:<div className='flex flex-col gap-1 overflow-y-auto scroll-smooth max-h-56'>
                                        {collaborators.map((collaborator,ind)=><div className='flex justify-between items-center border rounded-md border-black p-1 w-full' key={collaborator.email}>
                                            <div className='flex gap-2'>
                                                <img className='w-11 h-11 rounded-full' src={collaborator.profilePicUrl !== "" ? collaborator.profilePicUrl : User} alt="user" />
                                                <div className='flex flex-col justify-center'>
                                                    <p className='font-medium text-sm'>{collaborator.firstName + ' ' + collaborator.lastName}</p>
                                                    <p className='text-sm'>{collaborator.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={()=>{handleRemoveCollaborator(ind)}} className='bg-red text-realWhite px-2 py-0.5 rounded-lg'>Remove</button>
                                        </div>)}
                                    </div>}
                            </div>
                            
                        </div>


                        <div className={`w-full ss:px-3 ${currentPage === 4 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                New <span className='text-skyBlue'>{method}</span>
                            </h1>

                            <div className='flex flex-col w-full gap-1 mb-3'>
                                <label htmlFor="MainTopic" className='text-black font-semibold'>
                                    Give me the main topic of your ideation section
                                </label>
                                <input onChange={(e)=>{setMainTopic(e.target.value)}} id='MainTopic' className='outline-none text-sm border border-grey rounded-md py-2 px-4' type="text" />
                            </div>
                            <div className='flex flex-col w-full gap-1 mb-3'>
                                <div className='flex justify-between items-center'>
                                    <label htmlFor='subTopic' className='text-black font-semibold'>Do you want to add sub topics</label>
                                    <button onClick={handleAddNewSubTopic} className='bg-skyBlue py-1 px-2 rounded-lg text-realWhite text-nowrap'>Add new +</button>
                                </div>
                                <div className={`${addSubTopicState ? "block":"hidden"} flex justify-between items-center border rounded-md border-gray-700 p-2 gap-2`}>
                                                <input autoFocus  value={subTopicInputValue} onKeyUp={(e)=>{e.key === 'Enter' && handleAddSubTopic()}} onChange={(e)=>{setSubTopicInputValue(e.target.value)}}  className='text-sm py-1 px-2 border border-gray-400 outline-none flex-grow rounded-sm' placeholder='Add sub topic here' type="text" />
                                                <button onClick={handleAddSubTopic}  className='bg-skyBlue text-realWhite px-2 py-0.5 rounded-lg'>Add</button>
                                                <button onClick={()=>{setAddSubTopicState(false)}}  className='bg-red text-realWhite px-2 py-0.5 rounded-lg'>Cancel</button>
                                            </div>
                                <div>
                                    {subTopics.length === 0 ? <div className='flex flex-col items-center justify-center'>
                                        <img className='w-32 h-32' src={ProjectsEmpty} alt="empty" />
                                        <p className='text-base'>{"No sub topics :("}</p>
                                        <p className='text-center text-base'>Don’t worry you can make a section with no sub topics and you can also add new ones her.</p>
                                    </div>:<div className='flex flex-col gap-2'>
                                            {subTopics.map((subTopic,ind)=><div className='flex justify-between items-center border rounded-md border-black p-2' key={ind}>
                                                <p>{subTopic}</p>
                                                <button onClick={()=>{handleRemoveSubTopic(ind)}} className='bg-red text-realWhite px-2 py-0.5 rounded-lg'>Remove</button>
                                            </div>)}
                                        </div>}
                                </div>
                            </div>
                            
                        </div>

                        <div className={`w-full ss:px-3  ${currentPage === 5 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                New <span className='text-skyBlue'>{method}</span>
                            </h1>
                            <div className='my-2 w-full'>
                                <h1 className='text-black font-bold mb-2'>Upload a picture to use it as a banner for the project ( you can not use one )</h1>
                                {!banner ? <div onDrop={handleDrop} onDragOver={handleDragOver} className='flex flex-col items-center justify-center gap-1 border-2 border-dashed border-skyBlue rounded-lg p-2'>
                                    <img src={dragdropfiles} alt="files" />
                                    <h1 className='text-black font-bold'>Drag and Drop pic to upload</h1>
                                    <h1 className='text-black font-semibold'>Or</h1>
                                    <input  onChange={handleUpload}  ref={browseRef} hidden type="file" />
                                    <button onClick={()=>{browseRef.current.click()}} className='bg-skyBlue py-1 px-2 rounded-xl text-realWhite'>Browse</button>
                                </div>:<div className='flex flex-col gap-4 border-2 border-gray-600 rounded-md p-2 justify-center items-center flex-grow'>
                                        <img className='w-72 object-contain rounded-md' src={banner} alt="banner" />
                                        <button onClick={()=>{setBanner(null)}} className='bg-red text-realWhite py-1 px-2 rounded-lg'>Cancel</button>
                                    </div>}
                            </div> 
                            
                        </div>
                        <div className={`w-full ss:px-3 self-end  ${currentPage>1 && currentPage <=5 ? "flex justify-end" : "hidden" }`}>
                                <button onClick={handleNext} className={`bg-skyBlue px-3 py-1 rounded-md text-white ${currentPage < 5 ?"inline":"hidden"}`}>Next</button>
                                <button onClick={createProject} className={`bg-skyBlue px-3 py-1 rounded-md text-white ${currentPage < 5 ?"hidden":"inline"}`}>Create</button>
                        </div>
                </div>
                </div>
                <ToastContainer/>
        </div>
  )
}
CreateNewProject.propTypes = {
    method:propTypes.string.isRequired,
    setMethod:propTypes.func.isRequired,
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired,
    nextPage:propTypes.func.isRequired,
    prevPage:propTypes.func.isRequired,
    currentPage:propTypes.number.isRequired
}
export default CreateNewProject