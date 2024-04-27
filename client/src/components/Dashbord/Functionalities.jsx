// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react'
import CreateNewProject from './pages/CreateNewProject'
import { add,Folder,BrainstormingMethodIcon,BrainwritingMethodIcon,Flipboard } from '../../assets';
const Functionalities = () => {
    const [AllMethodsVisible,setAllMethodVisible] = useState(false);

    const [currentPage,setCurrentPage] = useState(1);
    const nextPage=()=>{
        setCurrentPage(prev => prev +1);
    }
    const prevPage=()=>{
        setCurrentPage(prev => prev -1);
    }
    const closePopUp = ()=>{
        setAllMethodVisible(false);
        setTimeout(()=>{setCurrentPage(1);},1000);
    }
    const functionality = [
        {
            Id:"Add_btn",
            icon:add,
            title:"",
            action:()=>{
                setAllMethodVisible(true);
            }
        },{
            Id:"Folder_btn",
            icon:Folder,
            title:"",
            action: () => {
                console.log("Hello world!");  
            }
        },
        {
            Id:"BrainstormingMethodIcon_btn",
            icon:BrainstormingMethodIcon,
            title:"Brainstorming",
            action: () => {
                console.log("Hello world!");  
            }
        },
        {
            Id:"BrainwritingMethodIcon_btn",
            icon:BrainwritingMethodIcon,
            title:"Brainwriting",
            action: () => {
                console.log("Hello world!"); 
            }
        },
        {
            Id:"Flipboard_btn",
            icon:Flipboard,
            title:"White board",
            action: () => {
                console.log("Hello world!"); 
            }
        }
    ]
    return (
            <div className='flex flex-col gap-y-1'>
                <div onClick={()=>{setAllMethodVisible(true)}} className={`self-end font-light text-xs text-primary hover:underline ${!AllMethodsVisible && "cursor-pointer"}`}>
                    Show all methodes
                </div>
                <div className='flex gap-6 overflow-x-auto'>
                    {functionality.map((util,index)=>
                        (<div onClick={util.action} className={`${index === 0 ?"bg-primary border hover:border-black":"bg-lightGrey hover:borderGrey"} transition-all w-[9rem] h-[7rem] flex flex-col items-center justify-center rounded-lg cursor-pointer flex-shrink-0 grey-shadow`} key={util.Id} >
                                <img className='w-16 h-16' src={util.icon} alt={util.title}/>
                                {util.title && <p className='text-black text-sm font-medium'>{util.title}</p>}
                        </div>)
                    )}
                </div>
                <CreateNewProject visible={AllMethodsVisible} currentPage={currentPage} closePopUp={closePopUp} nextPage={nextPage} prevPage={prevPage}/>
            </div>
  )
}
export default Functionalities