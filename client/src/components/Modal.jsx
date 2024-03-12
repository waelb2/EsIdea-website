import React from 'react'; // Importing React library
import Close from '../assets/close.png'; // Importing the close image

// Defining a functional component named Modal, which takes props as input
const Modal = (props) => {
  return (
    // Outer container for the modal, using flexbox to center vertically and horizontally
    <div className='flex justify-center items-center h-screen'>
      {/* Inner container for modal content */}
      <div className='relative w-2/5 rounded-3xl p-4 border border-black'>
        {/* Close button */}
        <a className='absolute right-5' href="#"><img src={Close} alt="Close"/></a>
        {/* Title */}
        <p className='text-center text-3xl font-bold p-4'>Sign up</p>
        {/* Notification message */}
        <p className='font-bold text-xl mb-2'>{props.notification}</p>
        {/* Main text */}
        <p className='mb-7'>{props.text}</p>
        {/* Buttons section */}
        <div className='flex justify-end items-center'>
          {/* Cancel button */}
          <button>
            <a className='font-medium' href="#">Cancel</a>
          </button>
          {/* Retry button */}
          <button>
            <a className='text-sm bg-skyBlue px-7 py-3 rounded-full text-white ml-4 font-medium' href="#">Retry</a>
          </button>
        </div>
      </div>
    </div>
  );
}

// Exporting the Modal component as default
export default Modal;