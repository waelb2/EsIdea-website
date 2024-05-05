import React from 'react';
import Close from '../../assets/close.png';
import Status from '../../assets/StatusUpdate.png';

const IdeaComment = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-black rounded-3xl w-4/5 h-5/6">
        <button className="absolute right-5 top-5" onClick={onClose}>
          <img src={Close} alt="Close" />
        </button>

        <div className="flex justify-center items-center gap-20 w-full px-10">
          <img src={Status} className="w-64" />
          <div className="flex flex-col gap-4 w-1/2">
            <p className="text-3xl font-semibold">
              Tell us what you think <br /> about this idea
            </p>
            <textarea
              type="text"
              placeholder="I think it needs more clarification"
              className="text-black text-sm resize-none pl-3 pt-2 w-full h-44 block border-black border-[0.5px] mr-10 rounded-xl"
            />
            <div className="flex justify-end pr-3">
              <button className="bg-skyBlue text-white h-12 w-44 text-lg rounded-full ">
                Send comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaComment;
