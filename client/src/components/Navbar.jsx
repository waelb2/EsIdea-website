import React , {useState} from 'react'; // Importing React library
import Logo from '../assets/Asset_2.svg'; // Importing the logo image
import Modal from './Modal';


// Defining a functional component named Navbar
const Navbar = ({setShowPopup}) => {
  return (
    // Navbar container
    <nav className='w-full px-7 pt-3 items-center flex justify-between align-middle'>
      {/* Logo */}
      <a href="#">
        <img className='w-[124px] h-[32px]' src={Logo} alt="ESIdea_logo" />
      </a>

      {/* Navigation links */}
      <ul className='flex items-center'>
        {/* Log in link */}
        <li>
          <a className='text-[#59AEF8] font-semibold' href="#">Log in</a>
        </li>
        {/* Sign up link */}
        <li>
          <a className='bg-[#59AEF8] ml-5 px-8 py-2 text-white font-semibold rounded-full'  href="#" onClick={() => setShowPopup(true)}>Sign up</a>
        </li>
      </ul>
    </nav>
  );
}

// Exporting the Navbar component as default
export default Navbar;
