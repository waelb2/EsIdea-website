// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react'
import CreateNewProject from './pages/CreateNewProject'
import { add,Folder,BrainstormingMethodIcon,BrainwritingMethodIcon,Flipboard } from '../../assets';
import UploadProject from './pages/UploadProject';
const Functionalities = () => {
    const [createProjectVisible,setCreateProjectVisible] = useState(false);
    const [uploadProjectVisible,setUploadProjectVisible] = useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const nextPage=()=>{
        setCurrentPage(prev => prev +1);
    }
    const prevPage=()=>{
        setCurrentPage(prev => prev -1);
    }
    const closePopUp = ()=>{
        setCreateProjectVisible(false);
    }
    const functionality = [
        {
            Id:"Add_btn",
            icon:add,
            title:"",
            action:()=>{
                setCreateProjectVisible(true);
            }
        },{
            Id:"Folder_btn",
            icon:Folder,
            title:"",
            action: () => {
               setUploadProjectVisible(true);  
            }
        },
        {
            Id:"BrainstormingMethodIcon_btn",
            icon:BrainstormingMethodIcon,
            title:"Brainstorming",
            action: () => {
                setMethod("Brainstorming");
                setCurrentPage(2);
                setCreateProjectVisible(true);
            }
        },
        {
            Id:"BrainwritingMethodIcon_btn",
            icon:BrainwritingMethodIcon,
            title:"Brainwriting",
            action: () => {
                setMethod("Brainwriting");
                setCurrentPage(2);
                setCreateProjectVisible(true);
            }
        },
        {
            Id:"Flipboard_btn",
            icon:Flipboard,
            title:"White board",
            action: () => {
                 
            }
        }
    ]
    const [method,setMethod] = useState("");
    return (
            <div className='flex flex-col gap-y-1'>
                <div onClick={()=>{setCreateProjectVisible(true);setCurrentPage(1)}} className={`self-end font-light text-xs text-primary hover:underline ${!createProjectVisible && "cursor-pointer"}`}>
                    Show all methodes
                </div>
                <div className='flex gap-6 overflow-x-auto'>
                    {functionality.map((util,index)=>
                        (<div onClick={util.action} className={`${index === 0 ?"bg-primary border hover:border-black":"bg-lightGrey hover:borderGrey"} transition-all w-[9rem] h-[7rem] flex flex-col items-center justify-center rounded-lg cursor-pointer flex-shrink-0`} key={util.Id} >
                                <img className='w-16 h-16' src={util.icon} alt={util.title}/>
                                {util.title && <p className='text-black text-sm font-medium'>{util.title}</p>}
                        </div>)
                    )}
                </div>
                <CreateNewProject method={method} setMethod={setMethod} visible={createProjectVisible} currentPage={currentPage} closePopUp={closePopUp} nextPage={nextPage} prevPage={prevPage}/>
                <UploadProject visible={uploadProjectVisible} closePopUp={()=>{
                    setUploadProjectVisible(false);
                }} />
            </div>
  )
}
export default Functionalities