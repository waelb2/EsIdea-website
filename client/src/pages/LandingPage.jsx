import React from 'react'; // Importing React library
import Navbar from '../components/Navbar'; // Importing Navbar component
import LandingPageFirstSection from '../components/Home/LandingPageFirstSection'; // Importing LandingPageFirstSection component
import Footer from '../components/Home/Footer'; // Importing Footer component
import Features from '../components/Home/Features'; // Importing Features component

// Defining a functional component named LandingPage
const LandingPage = () => {
  return (
    // Main container for the LandingPage component
    <div>
      {/* Rendering Navbar component */}
      <Navbar />
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