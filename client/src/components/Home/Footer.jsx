import React from 'react'; // Importing React library
import { logo } from '../../assets'; // Importing the logo image
import { RiArrowRightFill } from 'react-icons/ri'; // Importing the RiArrowRightFill icon from react-icons

// Defining a functional component named Footer
const Footer = () => {
  return (
    // Container for the footer section
    <div>
      {/* First section of the footer */}
      <div className='flex flex-col justify-center items-center bg-[#3A86FF] py-4 text-center'>
        {/* Heading */}
        <p className='text-[#FEFEFE] opacity-65 text-xl pt-3'>Brainstorm a Brighter Tomorrow</p>
        <p className='text-[#FCFFFF] text-4xl font-bold'>Beautiful Projects are waiting</p>
        <p className='text-[#FCFFFF] text-4xl font-bold'>for Teams.</p>
        {/* Button for creating the first project */}
        <button className="flex mt-6 items-center justify-center bg-[#FCFFFF] text-sm font-medium text-black px-6 py-3 mb-6 rounded-full">
          <span>Create your first project</span>
          <RiArrowRightFill className="ml-2 text-[#3A86FF]" /> {/* Arrow icon */}
        </button>
      </div>

      {/* Second section of the footer */}
      <div className='flex flex-col justify-center items-center bg-[#55555E] py-4 text-center'>
        {/* Logo */}
        <img className='mt-1' src={logo} alt="Logo" />
        {/* Made by text */}
        <p className='text-white font-semibold mt-5'>Made by ❤️ for ESI community</p>
        {/* Footer text */}
        <p className='text-white font-semibold text-sm'>ESIdea © 2024</p>
      </div>
    </div>
  );
}

// Exporting the Footer component as default
export default Footer;
