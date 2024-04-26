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
export const DependenciesContext = createContext();
const PopUpMethods = ({visible,closePopUp,currentPage,nextPage,prevPage}) => {
    ////////////////////////////////////////////////////////////////////////////////////////
    // Data for test
        const data = [{"id":1,"first_name":"Bernardina","last_name":"Bastone"},
        {"id":2,"first_name":"Heall","last_name":"Langlois"},
        {"id":3,"first_name":"Ricki","last_name":"Doohan"},
        {"id":4,"first_name":"Galina","last_name":"Scourfield"},
        {"id":5,"first_name":"Fergus","last_name":"Bagley"},
        {"id":6,"first_name":"Domini","last_name":"Aiston"},
        {"id":7,"first_name":"Dulcinea","last_name":"Conachy"},
        {"id":8,"first_name":"Bernadine","last_name":"Reinert"},
        {"id":9,"first_name":"Torin","last_name":"Perroni"},
        {"id":10,"first_name":"Christabella","last_name":"Wix"},
        {"id":11,"first_name":"Gretel","last_name":"Cornau"},
        {"id":12,"first_name":"Gideon","last_name":"Bool"},
        {"id":13,"first_name":"Antoni","last_name":"Devenny"},
        {"id":14,"first_name":"Patsy","last_name":"Waker"},
        {"id":15,"first_name":"Latisha","last_name":"Strowthers"},
        {"id":16,"first_name":"Haley","last_name":"Gerald"},
        {"id":17,"first_name":"Celine","last_name":"Beardon"},
        {"id":18,"first_name":"Emmie","last_name":"Tasker"},
        {"id":19,"first_name":"Kellen","last_name":"Brion"},
        {"id":20,"first_name":"Karin","last_name":"Wathall"},
        {"id":21,"first_name":"Quent","last_name":"Novis"},
        {"id":22,"first_name":"Elisabeth","last_name":"Birkmyr"},
        {"id":23,"first_name":"Hilly","last_name":"Stolz"},
        {"id":24,"first_name":"Adan","last_name":"Barwick"},
        {"id":25,"first_name":"Patricia","last_name":"Jira"},
        {"id":26,"first_name":"Erl","last_name":"Sullivan"},
        {"id":27,"first_name":"Ogdan","last_name":"Backshaw"},
        {"id":28,"first_name":"Ursulina","last_name":"Kurdani"},
        {"id":29,"first_name":"June","last_name":"Lapham"},
        {"id":30,"first_name":"Rodrigo","last_name":"Kolodziejski"},
        {"id":31,"first_name":"Carny","last_name":"Harbach"},
        {"id":32,"first_name":"Aluin","last_name":"Gusticke"},
        {"id":33,"first_name":"Lurline","last_name":"Volett"},
        {"id":34,"first_name":"Marybelle","last_name":"Jorden"},
        {"id":35,"first_name":"Mamie","last_name":"Brand-Hardy"},
        {"id":36,"first_name":"Alec","last_name":"Maden"},
        {"id":37,"first_name":"Ede","last_name":"Cornner"},
        {"id":38,"first_name":"Fowler","last_name":"Riddett"},
        {"id":39,"first_name":"Krista","last_name":"Buckel"},
        {"id":40,"first_name":"Janessa","last_name":"Vesco"},
        {"id":41,"first_name":"Jaye","last_name":"Brugman"},
        {"id":43,"first_name":"Creight","last_name":"Stammirs"},
        {"id":44,"first_name":"Noby","last_name":"Salliere"},
        {"id":45,"first_name":"Fabio","last_name":"Stannas"},
        {"id":46,"first_name":"Adelheid","last_name":"Verheijden"},
        {"id":47,"first_name":"Axe","last_name":"Bertwistle"},
        {"id":48,"first_name":"Mollee","last_name":"Di Biasi"},
        {"id":49,"first_name":"Griffie","last_name":"Daughtery"},
        {"id":50,"first_name":"Joshia","last_name":"Ledeker"},
        {"id":51,"first_name":"Dionne","last_name":"Borges"},
        {"id":52,"first_name":"Cecil","last_name":"Wallington"},
        {"id":53,"first_name":"Doretta","last_name":"McFee"},
        {"id":54,"first_name":"Eimile","last_name":"Stronghill"},
        {"id":55,"first_name":"Raddie","last_name":"Mingaud"},
        {"id":56,"first_name":"Neal","last_name":"Orrell"},
        {"id":57,"first_name":"Abby","last_name":"Calabry"},
        {"id":58,"first_name":"Salli","last_name":"Gregoire"},
        {"id":59,"first_name":"Kai","last_name":"Choak"},
        {"id":60,"first_name":"Tish","last_name":"Armstrong"},
        {"id":61,"first_name":"Ara","last_name":"Bellamy"},
        {"id":62,"first_name":"Melba","last_name":"Gorner"},
        {"id":63,"first_name":"Ashil","last_name":"Suttling"},
        {"id":64,"first_name":"Fredra","last_name":"Reimers"},
        {"id":65,"first_name":"Kenny","last_name":"Wylie"},
        {"id":66,"first_name":"Truman","last_name":"Ammer"},
        {"id":67,"first_name":"Alexis","last_name":"Smallcomb"},
        {"id":68,"first_name":"Murial","last_name":"Clyne"},
        {"id":69,"first_name":"Hube","last_name":"Finley"},
        {"id":70,"first_name":"Herrick","last_name":"Luten"},
        {"id":71,"first_name":"Trefor","last_name":"Wingfield"},
        {"id":72,"first_name":"Maryann","last_name":"Sedgman"},
        {"id":73,"first_name":"Glenn","last_name":"Clere"},
        {"id":74,"first_name":"Bond","last_name":"Porteous"},
        {"id":75,"first_name":"Brittany","last_name":"Roelofsen"},
        {"id":76,"first_name":"Brig","last_name":"Ostick"},
        {"id":77,"first_name":"Olimpia","last_name":"Bromage"},
        {"id":78,"first_name":"Franky","last_name":"Pennetti"},
        {"id":79,"first_name":"Quintilla","last_name":"Jurgensen"},
        {"id":80,"first_name":"Pepillo","last_name":"Sarle"},
        {"id":81,"first_name":"Lockwood","last_name":"Carnaman"},
        {"id":82,"first_name":"Sonya","last_name":"MacCollom"},
        {"id":83,"first_name":"Randy","last_name":"Baigrie"},
        {"id":84,"first_name":"Lemmy","last_name":"Boays"},
        {"id":85,"first_name":"Gradey","last_name":"Nairns"},
        {"id":86,"first_name":"Butch","last_name":"Clinning"},
        {"id":87,"first_name":"Standford","last_name":"Hollow"},
        {"id":88,"first_name":"Florian","last_name":"Kopec"},
        {"id":89,"first_name":"Elyn","last_name":"Veldstra"},
        {"id":90,"first_name":"Ameline","last_name":"Grise"},
        {"id":92,"first_name":"Ashely","last_name":"Alasdair"},
        {"id":93,"first_name":"Patrizio","last_name":"Kissick"},
        {"id":94,"first_name":"Cynthia","last_name":"Cunnington"},
        {"id":95,"first_name":"Gaspard","last_name":"Bursell"},
        {"id":96,"first_name":"Lorelle","last_name":"Gley"},
        {"id":97,"first_name":"Dolores","last_name":"Dudny"},
        {"id":98,"first_name":"Lacie","last_name":"Skells"},
        {"id":99,"first_name":"Carmela","last_name":"Jodrelle"},
        {"id":100,"first_name":"Gael","last_name":"Gawkroge"}]
    //////////////////////////////////////////////////////
    const [method,setMethod] = useState("");
    const [projectName,setProjectName] = useState("");
    const [description,setDescription] = useState("");
    const [tags,setTags] = useState([]);
    const [tagsDisplayed,setTagsDisplayed] = useState([]);
    const [mainTopic,setMainTopic] = useState("");
    ///////////////////////////////////////////////
    const [subTopics,setSubTopics] = useState([]);
    const [addSubTopicState,setAddSubTopicState] = useState(false);
    const [subTopicInputValue,setSubTopicInputValue] = useState("");
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
    // ////////////////////////////////
    const addTag= (item)=>{
        setTags(prevtags => [...prevtags,item.item]);
        setTagsDisplayed(prevDisTags=>[...prevDisTags,item]);
    }
    const removeTag = (index)=>{
        tagsDisplayed[index].setSelected(false);
        const arr1 = tagsDisplayed.filter((_,ind)=>ind !== index);
        const arr2 = tags.filter((_,ind)=>ind !== index);
        setTagsDisplayed([...arr1]);
        setTags([...arr2]);
    }
    //////////::files:://////////////
    const [banner,setBanner] = useState(null);
    const handleDragOver = (event)=>{
        event.preventDefault();
    }
    const handleDrop=(event)=>{
        setBanner(URL.createObjectURL(event.dataTransfer.files[0]));
        event.preventDefault();
    }
    const browseRef = useRef();
    ////////////////////////////////


    // /////////:: Search collaborators////////////////::
    const [loading,setLoading] = useState(false);
    const [searchColl,setSearchColl] = useState("");
    const [displayedCollaborators,setDisplayedCollaborators] = useState([]);
    const [collaborators,setCollaborators] = useState([]);
    const debouncedSearch = useDebounce(searchColl,500);
    useEffect(()=>{
        const  loadCollaborators = ()=>{
            setLoading(true);
            axios.get('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                const coll = response.data.filter(collaborator => collaborator.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
                setDisplayedCollaborators(coll);
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



    /////////////////////////


    const [active,setActive] = useState("");
    const dependencies = {addTag,removeTag,active,setActive};
    ////////////////////////////////////////////////////////////////////////////////////////
    const [inputValue,setInputValue] = useState("");
    const methods = [
        {
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
    return (
        <div onClick={closePopUp} className={`fixed top-0 left-0 bg-black bg-opacity-40 w-screen min-h-screen backdrop-blur z-50 duration-500  transition-opacity ease-in-out flex justify-center items-center  ${visible?"Pop-up-Active":"Pop-up-notActive"}`}>
                <div onClick={(e)=>{e.stopPropagation();setActive("")}} className='bg-white max-w-full w-[600px] min-h-[450px] ss:min-h-[500px]  max-h-full  rounded-2xl shadow-md  px-3 py-4 sm:py-7 sm:px-9 m-4'>

                <div className={`w-full h-full flex flex-col`}>
                        <div className={`w-full flex  ${currentPage === 1 ? "justify-end":"justify-between"}`}>

                            <img onClick={prevPage} className={`w-6 h-6 cursor-pointer ${currentPage > 1 ?"block":"hidden"}`} src={Back} alt="Back" />

                            <img onClick={closePopUp} className={`w-5 h-5 cursor-pointer`} src={blackClose} alt="Close" />

                        </div>

                        <div className={`w-full ${currentPage === 1 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                Choose a method
                            </h1>
                            <div className='flex w-full ss:w-[87%] self-center border-[2px] rounded-md ss:p-1 shadow-md mb-5 p-2'>
                                <input  onChange={(e)=>{setInputValue(e.target.value)}} className='flex-grow flex-shrink w-full outline-none ml-2 text-sm' placeholder='Search' type="text" />
                                <img className='w-5 h-5 ss:w-7 ss:h-7 ml-1' src={Search} alt="Search" />
                            </div>

                            <div className='flex flex-wrap gap-3 justify-center  ss:px-9 ss:justify-start overflow-y-auto scroll-smooth py-2'>
                                {displayedMethods.map((method)=>(<div onClick={method.action}className='bg-lightGrey w-[144px] h-[113px] rounded-md flex flex-col items-center justify-center cursor-pointer transition-shadow duration-300 hover:shadow-md' key={method.Id}>
                                    <img className='w-[65px] h-[65px]' src={method.icon} alt={method.title} />
                                    <p className='text-black text-[14px] font-medium'>{method.title}</p>
                                </div>))}
                            </div>
                        </div>

                        <div className={`w-full ${currentPage === 2 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                New <span className='text-skyBlue'>{method}</span>
                            </h1>

                            <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                                <label htmlFor="projectName" className='text-black font-semibold'>
                                    What shall we name your project
                                </label>
                                <input onChange={(e)=>{setProjectName(e.target.value)}} id='projectName' className='outline-none text-sm border-[1px] border-grey rounded-md py-2 px-4' type="text" />
                            </div>

                            <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                                <label htmlFor="projectDescription" className='text-black font-semibold'>
                                    Give your project a short description
                                </label>
                                <textarea onChange={(e)=>{setDescription(e.target.value)}} className='outline-none text-sm border-[1px] border-grey rounded-md resize-none py-2 px-4' name="Description" id="projectDescription" cols="30" rows="4">
                                </textarea>
                            </div>
                            <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                                <h1 className='text-black font-semibold'>In which category do you wanna put your project </h1>
                                <div className='border-[1px] border-grey rounded-md py-3 px-4 mb-2 '>
                                    {tagsDisplayed.length !== 0 ?
                                        <div className='w-full flex flex-wrap gap-2 h-16 overflow-y-auto'>
                                            {tagsDisplayed.map((val,ind)=><div className='flex gap-1 p-1 items-center rounded-md bg-gray-200' key={val.item.id}>
                                            <p className='text-xs'>{val.item[val.accesorKey]}</p>
                                            <img onClick={()=>{removeTag(ind)}} className='w-2 cursor-pointer' src={blackClose} alt="remove" />
                                        </div>)}
                                        </div>
                                    :<p className='text-xs text-gray-700'>Please use the lists bellow to associate a category to your project</p>}
                                </div>
                                <DependenciesContext.Provider value={dependencies}>
                                    <div onClick={(e)=>{e.stopPropagation()}} className='flex gap-2 items-center flex-wrap relative'>
                                        <Select title={"Modules"} data={data} accesorKey={"first_name"}/>
                                        <Select title={"Club"} data={data} accesorKey={"last_name"}/>
                                        <Select title={"Events"} data={data} accesorKey={"first_name"}/>
                                    </div>
                                </DependenciesContext.Provider>
                            </div>
                            
                        </div>

                        <div className={`w-full ${currentPage === 3 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                New <span className='text-skyBlue'>Brainstorming</span>
                            </h1>
                        
                            <label className='text-black font-semibold ss:w-[90%] mb-2'  htmlFor="collaborator">Do you want to add some collaborator</label>

                            <div className='w-full ss:w-[90%] self-center relative'>
                                <div className='flex w-full  self-center border-[2px] rounded-md ss:p-1 shadow-lg mb-5 p-2'>
                                    <input value={searchColl} onChange={(e)=>{setSearchColl(e.target.value)}} className='flex-grow w-full flex-shrink outline-none ml-2 text-sm' id='collaborator' placeholder='Search' type="text" />
                                    <img className='w-5 h-5 ss:w-7 ss:h-7 ml-1' src={Search} alt="Search" />
                                </div>

                                <div className={`border shadow-md absolute top-10 rounded-md p-1 w-full mb-3 bg-realWhite ${debouncedSearch !== "" || loading ?"block":"hidden"}`}>
                                    {loading? <div className='flex justify-center items-center'><ColorRing visible={true} height="50" width="50" ariaLabel="color-ring-loading" wrapperStyle={{}} wrapperClass="color-ring-wrapper" colors={['#3A86FF', '#3A86FF', '#3A86FF', '#3A86FF', '#3A86FF']}
                                    /></div> : displayedCollaborators.length !== 0 && debouncedSearch !== "" ? <div className='flex flex-col gap-1 max-h-44 overflow-y-auto scroll-smooth'>
                                    {
                                        displayedCollaborators.map((collaborator)=><div  className='flex justify-between items-center border rounded-md border-black p-1' key={collaborator.name}>
                                             <div className='flex gap-2'>
                                                <img className='w-11 h-11' src={User} alt="user" />
                                                <div className='flex flex-col justify-center'>
                                                    <p className='font-medium text-sm'>{collaborator.name}</p>
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

                            <div className='w-full ss:w-[90%] self-center mb-2'>
                                {collaborators.length === 0 ? <div className='flex flex-col items-center justify-center h-64'>
                                        <img className='w-32 h-32' src={ProjectsEmpty} alt="empty" />
                                        <p className='text-base'>{"No collaborator :("}</p>
                                        <p className='text-center text-base'>Don’t worry you can add them by just searching there names.</p>
                                    </div>:<div className='flex flex-col gap-1 overflow-y-auto scroll-smooth h-56'>
                                        {collaborators.map((collab,ind)=><div className='flex justify-between items-center border rounded-md border-black p-1 w-full' key={collab.name}>
                                            <div className='flex gap-2'>
                                                <img className='w-11 h-11' src={User} alt="user" />
                                                <div className='flex flex-col justify-center'>
                                                    <p className='font-medium text-sm'>{collab.name}</p>
                                                    <p className='text-sm'>{collab.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={()=>{handleRemoveCollaborator(ind)}} className='bg-red text-realWhite px-2 py-0.5 rounded-lg'>Remove</button>
                                        </div>)}
                                    </div>}
                            </div>
                            
                        </div>


                        <div className={`w-full ${currentPage === 4 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                New <span className='text-skyBlue'>{method}</span>
                            </h1>

                            <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                                <label htmlFor="MainTopic" className='text-black font-semibold'>
                                    Give me the main topic of your ideation section
                                </label>
                                <input onChange={(e)=>{setMainTopic(e.target.value)}} id='MainTopic' className='outline-none text-sm border-[1px] border-grey rounded-md py-2 px-4' type="text" />
                            </div>
                            <div className='flex flex-col w-full ss:w-[90%] gap-1 mb-3'>
                                <div className='flex justify-between items-center'>
                                    <label htmlFor='subTopic' className='text-black font-semibold'>Do you want to add sub topics</label>
                                    <button onClick={handleAddNewSubTopic} className='bg-skyBlue py-1 px-2 rounded-lg text-realWhite'>Add new +</button>
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

                        <div className={`w-full  ${currentPage === 5 ?"flex flex-col items-center":"hidden"}`}>
                            <h1 className='font-bold text-2xl text-center mb-4'>
                                New <span className='text-skyBlue'>{method}</span>
                            </h1>
                            <div className='my-2 w-full ss:w-[90%]'>
                                <h1 className='text-black font-bold mb-2'>Upload a picture to use it as a banner for the project ( you can not use one )</h1>
                                {!banner ? <div onDrop={handleDrop} onDragOver={handleDragOver} className='flex flex-col items-center justify-center gap-1 border-2 border-dashed border-skyBlue rounded-lg p-2'>
                                    <img src={dragdropfiles} alt="files" />
                                    <h1 className='text-black font-bold'>Drag and Drop pic to upload</h1>
                                    <h1 className='text-black font-semibold'>Or</h1>
                                    <input accept='image/*' onChange={(event)=>{setBanner(URL.createObjectURL(event.target.files[0]));}}  ref={browseRef} hidden type="file" />
                                    <button onClick={()=>{browseRef.current.click()}} className='bg-skyBlue py-1 px-2 rounded-xl text-realWhite'>Browse</button>
                                </div>:<div className='flex flex-col gap-4 border-2 border-gray-600 rounded-md p-2 justify-center items-center flex-grow'>
                                        <img className='w-72 object-contain rounded-md' src={banner} alt="banner" />
                                        <button onClick={()=>{setBanner(null)}} className='bg-red text-realWhite py-1 px-2 rounded-lg'>Cancel</button>
                                    </div>}
                            </div> 
                            
                        </div>
                        <div className={`w-[90%] self-center  ${currentPage>1 && currentPage <=5 ? "flex justify-end" : "hidden" }`}>
                                <button onClick={nextPage} className={`bg-skyBlue px-3 py-1 rounded-md text-white ${currentPage < 5 ?"inline":"hidden"}`}>Next</button>
                                <button className={`bg-skyBlue px-3 py-1 rounded-md text-white ${currentPage < 5 ?"hidden":"inline"}`}>Create</button>
                        </div>
                </div>
                </div>
                <ToastContainer/>
        </div>
  )
}
PopUpMethods.propTypes = {
    visible:propTypes.bool.isRequired,
    closePopUp:propTypes.func.isRequired,
    nextPage:propTypes.func.isRequired,
    prevPage:propTypes.func.isRequired,
    currentPage:propTypes.number.isRequired
}
export default PopUpMethods