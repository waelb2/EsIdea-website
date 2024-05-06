import React , {useEffect, useState} from 'react'
import UserIdea from '../idea generation phase/UserIdea'
import IdeaEvaluationAdmin from '../IdeaEvolutionAdmin/IdeaEvolutionAdmin'
import IdeaComment from '../Idea Comment/IdeaComment'
import CountdownTimerBS from '../CountdownTimerBS/CountdownTimerBS'
import Back from '../../assets/Back.png'
import Line from '../../assets/Line 3.png'
import Download from '../../assets/Download from the Cloud.png'
import Group from '../../assets/group.png'
import Bold from '../../assets/Bold.png'
import Italic from '../../assets/Italic.png'
import Clear from '../../assets/Clear Symbol.png'
import Color from '../../assets/Color Mode.png';
import Line1 from '../../assets/Line 1.png'
import Brain from '../../assets/Brain.png'
import Send from '../../assets/Send.png'
import CombinePopUp from '../Combine/CombinePopUp'
import Extend from '../Extend/Extend'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import axios from '../../utils/axios'


const AdminBrainStorming = ({project, ideas, onlineUsers, socket}) => {
  const trashThoughts = [
    {
      text: "feu",
      isBold: false,
      isItalic: false,
      color: "#000",
      selected: false,
    },
    {
      text: "jardin",
      isBold: false,
      isItalic: false,
      color: "#000",
      selected: false,
    },
    {
      text: "zino",
      isBold: false,
      isItalic: false,
      color: "#000",
      selected: false,
    },
    {
      text: "good luck l7bib",
      isBold: false,
      isItalic: false,
      color: "#000",
      selected: false,
    },
  ]

  const [textInput, setTextInput] = useState('');
  const [userThoughts, setUserThoughts] = useState([]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000'); 
  const [showComment, setShowComment] = useState(false);
  const [showCombinePopUp, setShowCombinePopUp] = useState(false);
  const [showExtendPopUp, setShowExtendPopUp] = useState(false)
  const [countdownEnded, setCountdownEnded] = useState(false);
  const [countdownTime, setCountdownTime] = useState(30);
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [enlargedText, setEnlargedText] = useState('');
  const [enlargedIndex, setEnlargedIndex] = useState(null);
  const [userIdeas, setUserIdeas]= useState([])
  const userToken = localStorage.getItem('userToken')

 // init user thoughts
 useEffect(() => { 
  setUserIdeas(ideas)
} , [ideas])

  const handleSend = async() => {
    if (textInput.trim() !== '') {
    
      setTextInput('');
      try {
        const response = await axios.post('idea/post-idea',{
          
            projectId : project.projectId,
            topicId : project.MainTopicId,
            content : textInput,
            isBold,
            isItalic,
            color : selectedColor,
            selected: false
          }
        ,{
          headers: {
            Authorization :`Bearer ${userToken}`
          }
        })
        
        socket.emit('newIdea', { idea: response.data, projectId: project.projectId });
        setUserIdeas([...userIdeas, response.data])

      } catch (error) {
        console.log(error)
      }
    }
  };

  const toggleBold = () => {
    setIsBold(!isBold)
  }

  const toggleItalic = () => {
    setIsItalic(!isItalic)
  }

  const clearIdeas = () => {
    setUserThoughts([]);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      handleSend(); 
    }
  };

 const handleDelete = async (index, ideaId) => {
    const updatedIdeas = userIdeas.filter((_, i) => i !== index);
    setUserIdeas(updatedIdeas);
    try {
      const response = await axios.delete(`idea/delete-idea/${ideaId}`
      ,{
        headers: {
          Authorization :`Bearer ${userToken}`
        }
      })
    } catch (error) {
      console.log(error)
    }
  };
  
    const toggleCommentPopup = () => {
    setShowComment(!showComment);
  };

  
  const handleCancel = () => {
    setShowCombinePopUp(false);
  };

  const toggleExtendPopUp = () => {
    setShowExtendPopUp(prev => !prev);
  };

  const handleCountdownEnd = () => {
    setCountdownEnded(true); 
  };

  const groupUserThoughts = () => {
    return userIdeas.map(idea => [idea]);
  };
  
  const toggleCombinePopUp = (event) => {
    event.stopPropagation();
    if(showCombinePopUp){
      // the pop up is displayed, close it
      setShowCombinePopUp(false);
    }else{
      // the popup is hidden, show it
      if (selectedIdeas.length >= 2) {
        // just copy the selected ideas (already done, through the "selectedIdeas" state)

        // open the pop up
        setShowCombinePopUp(true);
      }
    }
  };

  const updateIdeas = (newIdeas) => {
    setUserThoughts(newIdeas);
  }

  // update cards after ideas combination
  const updateUserThoughtsCards = (cards) => {

  }

  const handleCombinedIdeaSend = (newIdeaText) => {
    // filter out the selected ideas from the global ideas array, then create the new idea
    const selectedIdeasTexts = selectedIdeas.map(idea => idea.text);

    const newThoughtsState = [...userThoughts.filter(userThought => !selectedIdeasTexts.includes(userThought.text)), {
      text: newIdeaText,
      color: '#000',
      isBold: false,
      isItalic: false,
      selected: false,
    }]

    setUserThoughts(newThoughtsState);

    updateUserThoughtsCards(newThoughtsState)
    // clear out the selectedIdeas state
    setSelectedIdeas([]);

    // close the popup
    setShowCombinePopUp(false);
  };

  const handleEnlarge = (text) => {
    setEnlargedText(text);
    toggleExtendPopUp();
    setUserThoughts(prevUserThoughts => prevUserThoughts.filter(idea => idea.text !== text));
  };
  
    const { user } = useUser();
    const navigate = useNavigate();
  return (
    <div className='bg-[#F1F6FB] relative pt-36 min-h-screen'>
      <div className='flex justify-between items-center py-4 px-5 fixed top-0 left-0 right-0'>
        <div className='bg-white border border-black flex justify-between items-center px-2 w-56 h-10 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.2)]'>
          <img className='cursor-pointer' onClick={()=>{navigate(-1)}} src={Back}/>
          <p className='font-medium'>{project.ProjectTitle}</p>
          <img src={Line} className='h-6'/>
          <img src={Download}/>
        </div>
        <div className='flex items-center'>
          <div className='flex items-center justify-center mr-4 bg-white font-medium h-10 w-32 rounded-full border border-black shadow-[0_4px_4px_rgba(0,0,0,0.2)]'>
          <CountdownTimerBS initialMinutes={0} initialSeconds={5} onCountdownEnd={handleCountdownEnd} countdownTime={countdownTime} /> left
          </div>
          <div className='flex bg-white border border-black items-center justify-around w-44 px-3 h-10 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.2)]'>
            <img src={Group} className='h-6'/>
            <img  src={user.profilePicUrl} className='h-8 rounded-full'/>
          </div>
        </div>
      </div>

      <div className='text-center w-80 fixed left-1/2 transform -translate-x-1/2 top-8'>
        <p className='text-3xl font-medium'>{project.MainTopic}</p>
        <p className=''>Use the prompt bellow to add your ideas about this theme</p>
      </div>

      <div className='flex flex-col gap-1 bg-white fixed rounded-full px-2 py-3 top-1/2 transform -translate-y-1/2 ml-5'>
        <img src={Bold}  className='w-6 cursor-pointer' onClick={toggleBold} style={{ cursor: 'pointer', background: isBold ? 'rgba(120, 120, 120 , 0.4)' : 'white' }}/>
        <img src={Line1} className='w-6'/>
        <img src={Italic} className='w-6 cursor-pointer' onClick={toggleItalic} style={{cursor: 'pointer', background: isItalic ? 'rgba(120, 120, 120 , 0.4)' : 'white'}} />
        <img src={Line1} className='w-6'/>

        <label htmlFor="color-picker">
          <img src={Color} className='w-6 cursor-pointer'/>
        </label>
        <input type='color' id='color-picker' value={selectedColor} onChange={(e) => handleColorChange(e.target.value)} className='hidden'/>

        <img src={Line1} className='w-6'/>
        <img src={Clear} className='w-6 cursor-pointer' onClick={clearIdeas}/>
      </div>

          <div className=' w-full fixed bottom-0 h-24 flex justify-end items-start'>
            <div className='bg-white flex items-center w-1/2 rounded-full px-2 py-1'>
              <img src={Brain} className='w-8' />
              <input
                 type="text"
                 placeholder='What’s in your mind?...'
                 className='w-full  outline-none focus:outline-none'
                 value={textInput}
                 onChange={(e) => setTextInput(e.target.value)}
                 onKeyPress={handleKeyPress} 
                 style={{ fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal' , color: selectedColor }}
              />
              <div className='flex items-center '>
                <div 
                  className='flex items-center justify-center rounded-full bg-[#59AEF8] p-2 cursor-pointer'
                  onClick={handleSend}
                >
                  <img src={Send} className='w-6'/>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-center bg-skyBlue rounded-full w-40 h-10 mr-8 ml-40 cursor-pointer'>
                <p className='mr-4 text-white text-sm font-semibold'>END Ideation</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-skyBlue rounded-full bg-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeWidth="2" />
                </svg>
            </div>

          </div>
           
           
            {userIdeas.length > 0 && (
              <div className="flex flex-wrap justify-start px-12 h-[55vh] w-5/6 ml-24 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-webkit" style={{ wordWrap: 'break-word' }}>
                {groupUserThoughts().map((pair , index) => (
                  <div key={pair.text} className="w-[30%]">
                    {countdownEnded ? (
                      <div className="w-full">
                        <IdeaEvaluationAdmin
                          ideas={pair}
                          toggleCommentPopup={toggleCommentPopup}
                          onEnlargeClick={handleEnlarge}
                          toggleCombinePopUp={toggleCombinePopUp}
                          toggleExtendPopUp={toggleExtendPopUp}
                          selectedIdeas={selectedIdeas}
                          setSelectedIdeas={setSelectedIdeas}
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <UserIdea ideas={pair} onDelete={(ideaId) => handleDelete(index,ideaId)}/>
                      </div>
                    )}
                  </div>
                ))}
                {showComment && <IdeaComment onClose={toggleCommentPopup} />}
                {showCombinePopUp && ( <CombinePopUp onClose={(event) => toggleCombinePopUp(event)} selectedIdeas={selectedIdeas} onSend={handleCombinedIdeaSend} setUserThoughts={setUserThoughts}/>)}
                {showExtendPopUp && <Extend onClose={toggleExtendPopUp} enlargedText={enlargedText} enlargedIndex={enlargedIndex} userThoughts={userThoughts} updateUserThoughts={setUserThoughts} />}
              </div>
            )}

          
            <div className="online-users-container">
          <h2>Online Users</h2>
         <div className="online-users-list">
           {onlineUsers.map((user,index) => (
          <img key={index} src={user.profilePicUrl}  className="profile-pic m-2 w-10 h-10 rounded-full " />
        ))}
      </div>
    </div>
           </div> 
  )
}

export default AdminBrainStorming