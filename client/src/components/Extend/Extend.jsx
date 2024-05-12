import React, { useEffect, useState } from 'react';
import Brain from '../../assets/Brain.png';
import Attach from '../../assets/Attach.png';
import Send from '../../assets/Send.png';
import Star from '../../assets/Star.png';
import Nothing from '../../assets/ProjectsEmpty.svg';

const Extend = ({ onClose, enlargedText, userIdeas, updateUserThoughts }) => {

  const [inputValue, setInputValue] = useState('');
  const [ideas , setIdeas] = useState([]);
  const coordinator = localStorage.getItem('user')
 
  const handleSendClick = () => {
    if (inputValue.trim() !== '') {
      setIdeas([...ideas, inputValue.trim()]);
      setInputValue(''); 
    }
  };

  
  const handleSaveClick = () => {
    if (ideas.length > 0) {
      updateUserThoughts([...userIdeas, ...ideas.map(text => ({
        content: text,
        createdBy:{
          firstName : coordinator.firstName,
          email  : coordinator.email,
          profilePicUrl  : coordinator.profilePicUrl
        },
        isBold: false,
        isItalic: false,
        color: '#000',
        selected: false,
      }))]);
      onClose(); 
    }
  };

  return (
    <div className='h-screen flex justify-center items-center fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-50'>
      <div className='bg-white border border-black rounded-xl w-4/5 relative h-[90%]'>    
        
        <ul className='flex absolute right-24 top-7 '>
          <li className='flex justify-center items-center w-16 rounded-full text-sm text-skyBlue font-semibold cursor-pointer' onClick={onClose}>Cancel</li>
          <li className='bg-skyBlue flex justify-center items-center w-16 h-7 rounded-full text-sm text-white font-semibold ml-3 cursor-pointer' onClick={handleSaveClick}>Save</li>
        </ul>

        <div className='flex flex-col w-full h-full items-center gap-y-1'>
          
          <div className='text-center w-80 mt-4 mx-auto'>
            <p className='text-4xl font-medium'>Extend idea</p>
            <p className='text-sm'>Here is the idea you want to extend. <br />Please use the prompt to create the <br />new ideas </p>
          </div>

          <div className=' w-5/6 h-4/6 my-0 mx-auto'>
            <p className='font-medium mb-1'>The idea to extend :</p>
            
            <div className=' px-4 py-2 shadow-[0_6px_16px_0px_rgba(0,0,0,0.3)]  border border-black rounded-2xl mb-4'>
              <p className='text-sm'><span>•</span> {enlargedText}</p>
            </div>
            
            <p className='font-medium'>The new ideas :</p>
            
            <div className={`flex flex-wrap justify-center h-3/5 w-full pt-2 pb-20 gap-4  ${ideas.length>0 ? 'overflow-y-auto' : 'overflow-y-hidden'} `}>
              {ideas.length > 0 ? (
                  ideas.map((idea, index) => (
                    <div key={idea} className='bg-white border border-black w-[40%]  p-4 rounded-2xl'>
                      <p className='text-lg font-medium mb-3'> {coordinator.firstName} thinks :</p>
                      <p className='text-gray-800'>•{idea}</p>
                    </div>
                  ))
                ) : (
                  <div className='flex flex-col items-center'>
                    <img src={Nothing} className='w-28' />
                    <p className='text-center text-[#D9D9D9] font-bold opacity-80'>This is your new ideas section ... but it’s empty <br />Create at least two ideas to continue</p>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className='w-full absolute bottom-0 h-20 flex justify-center items-center'>
          <div className='bg-white flex items-center w-1/2 rounded-full px-2 py-1 mr-4 border border-black'>
            <img src={Brain} className='w-8' />
            
            <input
              type="text"
              placeholder='What’s in your mind?...'
              className='w-full  outline-none focus:outline-none'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendClick();
                }
              }}
            />
            
            <div className='flex items-center '> 
              <div 
                className='flex items-center justify-center rounded-full bg-[#59AEF8] p-2 cursor-pointer'
                onClick={handleSendClick}
              >
                <img src={Send} className='w-6'/>
              </div>
            </div>

          </div>

          <div className='flex justify-center items-center w-20 rounded-full bg-white h-10 border border-black'>
            <p>AI</p>
            <img src={Star} className='ml-2' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extend;
