import Google from '../../assets/google.png'; // Importing the Google logo image
import BackgroundImage from '../../assets/Pic.png'; // Importing the background image

// Defining a functional component named LandingPageFirstSection
const LandingPageFirstSection = ({setShowPopup}) => {
  return (
    // Container for the first section of the landing page
    <div className='flex flex-col justify-center items-center my-16 bg-[length:105%_65%] bg-no-repeat bg-right-bottom' style={{backgroundImage: `url(${BackgroundImage})`}}>
      {/* Section title */}
      <p className='text-[#55555E] text-2xl font-medium tracking-wide mb-4'>It all starts with an idea.</p>
      {/* Main title */}
      <p className='font-extrabold md:-6xl xs:text-5xl'>Collaborative </p>
      <p className='font-extrabold md:text-6xl xs:text-5xl mb-14'>Idea Collection </p>
      {/* Button for continuing with Google */}
      <div className='mt-12 p-5 bg-white rounded-full'>
        <button className='flex justify-center items-center bg-skyBlue shadow-[0_6px_16px_0px_rgba(0,0,0,0.3)] px-10 py-3 rounded-full'  onClick={() => setShowPopup(true)}>
          <img className='h-6 mr-2' src={Google} alt="Google logo" />
          <p className='text-white font-bold'>Continue with Google</p>
        </button>
      </div>
      {/* Additional information */}
      <p className='text-[#55555E] text-sm mt-6'>Trusted by 13 person</p>
      <p className='text-[#55555E] text-sm pt-2'>happy user esiwide</p>
      <p className='text-[#55555E] text-sm pt-2'>Rated 4.8 out of 5</p>
    </div>
  );
}

// Exporting the LandingPageFirstSection component as default
export default LandingPageFirstSection;