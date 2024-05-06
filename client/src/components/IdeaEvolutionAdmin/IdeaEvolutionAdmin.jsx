import React , {useEffect, useState} from 'react'
import IdeaComment from '../Idea Comment/IdeaComment';
import Enlarge from '../../assets/Enlarge.png'
import Compress from '../../assets/Compress.png'
import CombinePopUp from '../Combine/CombinePopUp';
import Extend from '../Extend/Extend';

const IdeaEvaluationAdmin = ({ideas, toggleCommentPopup, onEnlargeClick, toggleCombinePopUp, toggleExtendPopUp, selectedIdeas, setSelectedIdeas}) => {

  const [clicked, setClicked] = useState(false);
  const [count, setCount] = useState(0);
  const user = ideas[0].createdBy
  const handleClick = () => {
    setClicked(!clicked);
    if (!clicked) {
      setSelectedIdeas(prevSelectedIdeas => [...prevSelectedIdeas, ...ideas]);
    } else {
      setSelectedIdeas(prevSelectedIdeas => prevSelectedIdeas.filter(idea => !ideas.includes(idea)));
    }
  };
  const handleIncrement = () => {
      setCount(prevCount => {
        if (prevCount === 0) {
          return 1;
        } else {
          return 0;
        }
      });
    };


  const handleEnlarge = (text) => {
    onEnlargeClick(text);
  };
    
    
    return (
        <div className={`bg-[#FEFEFE] p-8 m-2 rounded-2xl shadow-md hover:shadow-lg border ${clicked ? 'border-skyBlue border-2' : 'border-black'} max-w-[400px] relative group`} onClick={handleClick}>
    
        <div className='flex items-center justify-between'>
            <p className='font-medium'>{user.firstName}  thinks :</p>
            <div className='flex items-center justify-center w-9 opacity-0 group-hover:opacity-100 transition-opacity'>
              <img src={Enlarge} alt="Enlarge" className='cursor-pointer' onClick={() => handleEnlarge(ideas[0].content)} />
              <img src={Compress} alt="Compress" className='cursor-pointer' onClick={(event) => toggleCombinePopUp(event, selectedIdeas)}/>
            </div>
        </div>

    
          {ideas.map(idea => (
            <p key={idea.ideaId} className="relative mt-2 pl-1.5 text-sm" style={{ color: idea.color }} >
                <span className="absolute left-0 top-0">&#8226;</span> 
                <span className="overflow-hidden whitespace-pre-wrap break-words ml-2" style={{fontWeight: idea.isBold ? 'bold' : 'normal', fontStyle: idea.isItalic ? 'italic' : 'normal'}}>
                {idea.content}
              </span>
            </p>
          ))}


          <div className='flex justify-between items-center mt-3'>
            <div className='flex item bg-center'>
              <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" strokeWidth="1.5" fill={count === 1 ? 'currentColor' : 'none'} stroke="currentColor" className="w-6 h-6 cursor-pointer"  onClick={handleIncrement}>   <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /> </svg>  
              <p>{count}</p>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer" onClick={toggleCommentPopup}>
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
            </svg>

          </div>  

        </div>

      );

};
export default IdeaEvaluationAdmin