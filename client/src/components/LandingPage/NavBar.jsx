// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react'; // Importing React library
import { blackLogo } from '../../assets';
import { Link } from 'react-router-dom';
import PopUp from '../LoginPage/PopUp';
// Defining a functional component named Navbar
const NavBar = () => {
  const [popUpVisible,setPopUpVisible] = useState(false);
  const togglePopUp=()=>{
    setPopUpVisible(prev => !prev);
  }

  const informUser = {
    title:"Initiating Remote Connection",
    content:"We have opened a Google login page in your system's browser. Please go to this page and log in using your ESI google account. Keep the current page open until the connection process is complete. If you encounter any issues, you can click \"Retry\" to attempt the connection again or \"Cancel\" to go back."
  }

  const errorConnection={
    title:"Oops! Something Went Wrong.",
    content:"We encountered an issue while attempting to connect with your Google account. Please make sure you have a stable internet connection and try again. If the problem persists, contact our support team for assistance."
  }
  const invalidMail={
    title:"Oops! Invalid Email Address.",
    content:"ESIdea is exclusive to ESI school email accounts. Please use your ESI email address to sign up or log in."
  }
  const signUp = ()=>{
    window.open("http://localhost:3000/auth/google","_self")
  }
  return (
    // Navbar container
    <>
      <nav className='w-full flex justify-between items-center py-3'>
      {/* Logo */}
      <Link to="/">
        <img className='w-[124px] h-[32px]' src={blackLogo} alt="ESIdea_logo" />
      </Link>

      {/* Navigation links */}
      <ul className='flex items-center gap-6'>
        {/* Log in link */}
        <li>
          <Link to="/login" className='text-[#59AEF8] font-semibold'>Log in</Link>
        </li>
        {/* Sign up link */}
        <li>
          <button onClick={signUp} className='bg-skyBlue w-[120px] p-2 text-white  sm:w-[152px] sm:p-[10px] rounded-3xl font-bold '>Sign up</button>
        </li>
      </ul>
      </nav>
      <PopUp visible={popUpVisible} togglePopUp={togglePopUp} content={invalidMail}/>
    </>
  );
}

// Exporting the Navbar component as default
export default NavBar;