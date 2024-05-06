import React, { useState, useEffect } from 'react';
import UserIdea from '../idea generation phase/UserIdea';
import IdeaEvaluation from '../idea generation phase/IdeaEvaluation';
import IdeaComment from '../Idea Comment/IdeaComment';
import CountdownTimerBW from '../Contdown Timer/CountdownTimerBW';
import Back from '../../assets/Back.png';
import Line from '../../assets/Line 3.png';
import Download from '../../assets/Download from the Cloud.png';
import User from '../Avatar/User';
import Bold from '../../assets/Bold.png';
import Italic from '../../assets/Italic.png';
import Clear from '../../assets/Clear Symbol.png';
import Color from '../../assets/Color Mode.png';
import Line1 from '../../assets/Line 1.png';
import Brain from '../../assets/Brain.png';
import Send from '../../assets/Send.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import axios from '../../utils/axios';

const BrainWriting = ({project, ideas, socket, onlineUsers}) => {

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


  const initialMinutes = 0;
  const initialSeconds = 7;
  const [rounds, setRounds] = useState(1);

  const [textInput, setTextInput] = useState('');
  const [userThoughts, setUserThoughts] = useState([]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showComment, setShowComment] = useState(false);
  const [countdownEnded, setCountdownEnded] = useState(false);
  const user = useUser();
  const userToken = localStorage.getItem('userToken')
  const [userIdeas, setUserIdeas] = useState([])
  const [countDownStarted, setCountDownStarted] = useState(false)


  const [userArray, setUserArray] = useState([]);

  const [activeUserIndex, setActiveUserIndex] = useState(0);

    // init user thoughts
    useEffect(() => { 
      setUserIdeas(ideas)
    } , [ideas])

    useEffect(()=>{
      setUserArray(onlineUsers)
    },[onlineUsers])

    useEffect(() => { 
      let collaborators = []
      collaborators.push(
        {lastName : project.coordinator.firstName, imageUrl: project.coordinator.profilePicUrl}
      )
     for( const collaborator of project.collaborators){

        collaborators.push({
          lastName : collaborator.firstName,
          imageUrl : collaborator.profilePicUrl
        })
     }
          
     } , [project])
  
    const handleSend = async () => {
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

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  const toggleBold = () => {
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  const handleColorChange = color => {
    setSelectedColor(color);
  };

  const clearIdeas = () => {
    setUserThoughts([]);
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

  const handleCountdownEnd = () => {
    setActiveUserIndex(previousIndex => (previousIndex + 1) % userArray.length);
    if(activeUserIndex === userArray.length -1){
      setRounds(previousRound => previousRound-1);
    }
  };

  const updateIdeas = (newIdeas) => {
    setUserThoughts(newIdeas);
  }

  const updateUserThoughtsCards = (cards) => {

  }

   useEffect(()=>{
      if(socket){
      socket.on('counterFiredBw',()=>{
        console.log('your admin fired the counter')
        setCountDownStarted(true)})
      }
},[socket])

  useEffect(() => {
    if(rounds === 0) setCountdownEnded(true);
  }, [rounds])
    const navigate = useNavigate();
  return (
    <div className="h-screen bg-[#F1F6FB] relative py-36">
      <div className="flex justify-between items-center py-4 px-5 fixed top-0 left-0 right-0">
        <div className="bg-white border border-black flex justify-between items-center px-2 w-56 h-10 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
          
          <img className='cursor-pointer' onClick={()=>{navigate(-1)}} src={Back} />
          <p className="font-medium">{project.ProjectTitle}</p>
          <img src={Line} className="h-6" />
          <img src={Download} />
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center mr-4 bg-white font-medium h-10 w-32 rounded-full border border-black shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
            {rounds} round{rounds > 1 ? 's' : ''} left
          </div>
          <div className="flex items-center justify-center gap-2 mr-4 bg-white font-medium h-10 w-32 rounded-full border border-black shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
            <CountdownTimerBW initialMinutes={initialMinutes} initialSeconds={initialSeconds} countdownEnded={countdownEnded} onCountdownEnd={handleCountdownEnd}  countDownStarted={countDownStarted}/>
            left
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end absolute right-0">
        {userArray.map((user, index) => (
          <User key={index} userName={user.lastName} imageUrl={user.profilePicUrl} useGradientBorder={index === activeUserIndex} showName={index === activeUserIndex} />
        ))}
      </div>

      <div className="text-center w-80 absolute left-1/2 transform -translate-x-1/2 top-8">
        <p className="text-3xl font-medium">{project.MainTopic}</p>
        <p className="">Use the prompt bellow to add your ideas about this theme</p>
      </div>

      <div className="flex flex-col gap-1 bg-white fixed rounded-full px-2 py-3 top-1/2 transform -translate-y-1/2 ml-5">
        <img src={Bold} className="w-6" onClick={toggleBold} style={{ cursor: 'pointer', background: isBold ? 'rgba(120, 120, 120 , 0.4)' : 'white' }} />
        <img src={Line1} className="w-6" />
        <img src={Italic} className="w-6" onClick={toggleItalic} style={{ cursor: 'pointer', background: isItalic ? 'rgba(120, 120, 120 , 0.4)' : 'white' }} />
        <img src={Line1} className="w-6" />

        <label htmlFor="color-picker">
          <img src={Color} className="w-6 cursor-pointer" />
        </label>
        <input type="color" id="color-picker" value={selectedColor} onChange={e => handleColorChange(e.target.value)} className="hidden" />

        <img src={Line1} className="w-6" />
        <img src={Clear} className="w-6" onClick={clearIdeas} />
      </div>

      {countDownStarted && (<div className="w-full fixed bottom-0 h-24 flex justify-center items-start">
        <div className="bg-white flex items-center w-1/2 rounded-full px-2 py-1">
          <img src={Brain} className="w-8" />
          <input
            type="text"
            placeholder="What’s in your mind?..."
            className="w-full  outline-none focus:outline-none"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal', color: selectedColor }}
          />
          <div className="flex items-center">
            <div className="flex items-center justify-center rounded-full bg-[#59AEF8] p-2" onClick={handleSend}>
              <img src={Send} className="w-6" />
            </div>
          </div>
        </div>
      </div>)}

      <div className="flex flex-wrap justify-start px-12 h-[55vh] w-5/6 ml-24 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-webkit" style={{ wordWrap: 'break-word' }}>
        {userIdeas.map((idea, index) => (
          <div key={index} className="w-[30%]">
            {countdownEnded ? (
              <IdeaEvaluation ideas={[idea]} toggleCommentPopup={toggleCommentPopup} />
            ) : (
              <UserIdea ideas={[idea]}  onDelete={(ideaId) => handleDelete(index,ideaId)} />
            )}
          </div>
        ))}
        {showComment && <IdeaComment onClose={toggleCommentPopup} />}
      </div>

    </div>
  );
};

export default BrainWriting;