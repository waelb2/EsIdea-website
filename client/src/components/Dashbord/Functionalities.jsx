// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react'
import CreateNewProject from './pages/CreateNewProject'
import { add,Folder,BrainstormingMethodIcon,BrainwritingMethodIcon,Flipboard } from '../../assets';
import UploadProject from './pages/UploadProject';
import { useNavigate } from 'react-router-dom';
const Functionalities = () => {
    const navigate = useNavigate();
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
        setCurrentPage(1);
    }
    const functionality = [
        {
            Id:"Add_btn",
            icon:add,
            title:"",
            action:()=>{
                setCreateProjectVisible(true);
            },
            tooltip:"Create new project"
        },{
            Id:"Folder_btn",
            icon:Folder,
            title:"",
            action: () => {
               //setUploadProjectVisible(true);  
            },
            tooltip:"Not available"

        },
        {
            Id:"BrainstormingMethodIcon_btn",
            icon:BrainstormingMethodIcon,
            title:"Brainstorming",
            action: () => {
                setMethod("Brainstorming");
                setCurrentPage(2);
                setCreateProjectVisible(true);
            },
            tooltip:"Creative group technique generating ideas, fostering innovation, collaboration, problem-solving."
        },
        {
            Id:"BrainwritingMethodIcon_btn",
            icon:BrainwritingMethodIcon,
            title:"Brainwriting",
            action: () => {
                setMethod("Brainwriting");
                setCurrentPage(2);
                setCreateProjectVisible(true);
            },
            tooltip:"Silent idea generation, written collaboration, fostering creativity, teamwork."
        },
        {
            Id:"Flipboard_btn",
            icon:Flipboard,
            title:"White board",
            action: () => {
                 navigate("/whiteboard");
            },
            tooltip:"Visualize ideas, collaborate seamlessly, share creative concepts."
        }
    ]
    const [method,setMethod] = useState("");
    const [tooltipIndex, setTooltipIndex] = useState(null);
    return (
            <div className='flex flex-col gap-y-1'>
                <div onClick={()=>{setCreateProjectVisible(true);setCurrentPage(1)}} className={`self-end font-light text-xs text-primary hover:underline ${!createProjectVisible && "cursor-pointer"}`}>
                    Show all methodes
                </div>
                <div className='flex gap-6 overflow-x-auto overflow-y-hidden md:overflow-visible'>
                    {functionality.map((util,index)=>
                        (<div onMouseEnter={() => setTooltipIndex(index)}
                        onMouseLeave={() => setTooltipIndex(null)} onClick={util.action} className={`${index === 0 ?"bg-primary":"bg-lightGrey"} border-2 hover:border-slate-400 border-transparent duration-500 transition-all w-[9rem] h-[7rem] flex flex-col items-center justify-center rounded-lg cursor-pointer relative flex-shrink-0`} key={util.Id} >
                                <img className='w-16 h-16' src={util.icon} alt={util.title}/>
                                {util.title && <p className='text-black text-sm font-medium'>{util.title}</p>}
                                {util.tooltip && (
                                    <span className={`absolute top-full left-1/2 -translate-x-1/2 bg-gray-500 text-white px-1 py-0.5 rounded-md text-nowrap text-sm mt-1 transition-opacity duration-500 ${tooltipIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                                        {util.tooltip}
                                    </span>
                                )}
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