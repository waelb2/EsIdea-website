// eslint-disable-next-line no-unused-vars
import React from 'react'; // Importing React library
import NavBar from './NavBar';
import LandingPageFirstSection from './LandingPageFirstSection';
import Features from './Features';
import Footer from './Footer';
// Defining a functional component named LandingPage
const LandingPage = () => {
  return (
    // Main container for the LandingPage component
    <div className='w-full'>
      {/* Rendering Navbar component */}
      <div className="sm:px-16 px-6 flex justify-center items-center">
            <div className="xl:max-w-[1280px] w-full">
                <NavBar/>
            </div>
        </div>
      {/* Rendering LandingPageFirstSection component */}
      <LandingPageFirstSection />
      {/* Rendering Features component */}
      <Features />
      {/* Rendering Footer component */}
      <Footer />
    </div>
  );
}

// Exporting the LandingPage component as default
export default LandingPage;