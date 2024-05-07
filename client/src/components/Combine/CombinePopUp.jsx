import React, { useState } from 'react';
import Brain from '../../assets/Brain.png';
import Attach from '../../assets/Attach.png';
import Send from '../../assets/Send.png';
import Star from '../../assets/Star.png';

const CombinePopUp = ({ onClose, selectedIdeas , onSend , setUserIdeas }) => {

  const [combinedIdea, setCombinedIdea] = useState('');

  const handleSend = () => {
    if (combinedIdea.trim() !== '') {
      setCombinedIdea('');
      onSend(combinedIdea);
    }
  };


  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-black rounded-3xl w-4/5 h-5/6 ">

        {/* Control buttons */}
        <ul className='flex absolute right-8 top-10'>
          <li className='flex justify-center items-center w-16 rounded-full text-sm text-skyBlue font-semibold cursor-pointer' onClick={onClose}>Cancel</li>
          <li className='bg-skyBlue flex justify-center items-center w-16 h-7 rounded-full text-sm text-white font-semibold ml-3 cursor-pointer' onClick={handleSend}>Save</li>
        </ul>

        {/* Content container */}
        <div className='flex flex-col w-4/5 h-4/5 pt-8 justify-between items-center gap-y-4'>
          <div className='text-center w-80 transform'>
            <p className='text-4xl font-medium'>Combine ideas</p>
            <p className='text-sm'>Here are all the ideas you selected. <br /> Please use the prompt below to <br /> combine them</p>
          </div>

          <div className='flex flex-wrap h-4/5 w-full pt-2 pb-20 gap-4 overflow-y-auto'>
            {selectedIdeas.map(idea => (
              <div key={idea.ideaId} className='bg-white border border-black w-[40%] h-fit p-4 rounded-2xl'>
                <p className='text-lg font-medium mb-3'> {idea.createdBy.firstName} thinks :</p>
                <p className='text-gray-800'>•{idea.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input controls */}
        <div className='w-3/5 absolute bottom-0 h-24 flex justify-center items-center'>
          <div className='bg-white flex items-center w-full rounded-full px-2 py-1 mr-4 border border-black'>
            <img src={Brain} className='w-8' />
            <input
              type="text"
              placeholder='New combined idea ...'
              className='w-full outline-none focus:outline-none'
              value={combinedIdea}
              onChange={(e) => setCombinedIdea(e.target.value)}
            />
            <div className='flex items-center '>
              <div className='flex items-center justify-center rounded-full cursor-pointer bg-[#59AEF8] p-2'>
                <img src={Send} className='w-6' onClick={handleSend}/>
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

export default CombinePopUp;
