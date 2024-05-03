import React from 'react';
import Brain from '../../assets/Brain.png';
import Attach from '../../assets/Attach.png';
import Send from '../../assets/Send.png';
import Star from '../../assets/Star.png';

const CombinePopUp = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-black rounded-3xl w-4/5 h-5/6 ">

        {/* Control buttons */}
        <ul className='flex absolute right-8 top-10'>
          <li className='flex justify-center items-center w-16 rounded-full text-sm text-skyBlue font-semibold cursor-pointer' onClick={onClose}>Cancel</li>
          <li className='bg-skyBlue flex justify-center items-center w-16 h-7 rounded-full text-sm text-white font-semibold ml-3 cursor-pointer'>Save</li>
        </ul>

        {/* Content container */}
        <div className='flex flex-col w-4/5 h-full pt-8 justify-between items-center gap-y-4'>
          <div className='text-center w-80 transform'>
            <p className='text-4xl font-medium'>Combine ideas</p>
            <p className='text-sm'>Here are all the ideas you selected. <br /> Please use the prompt below to <br /> combine them</p>
          </div>

          <div className='flex h-4/5 w-full pt-2 pb-20 gap-24 overflow-y-auto'>
            <div className='bg-green-400 w-full'>hello</div>
            <div className='bg-blue-400 w-full h-screen'>world</div>
          </div>
        </div>

        {/* Input controls */}
        <div className='w-full absolute bottom-0 h-24 flex justify-center items-center'>
          <div className='bg-white flex items-center w-1/2 rounded-full px-2 py-1 mr-4 border border-black'>
            <img src={Brain} className='w-8' />
            <input
              type="text"
              placeholder='New combined idea ...'
              className='w-full outline-none focus:outline-none'
            />
            <div className='flex items-center '>
              <img src={Attach} className='w-8' />
              <input
                type="file"
                className="hidden"
              />
              <div className='flex items-center justify-center rounded-full bg-[#59AEF8] p-2'>
                <img src={Send} className='w-8' />
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
