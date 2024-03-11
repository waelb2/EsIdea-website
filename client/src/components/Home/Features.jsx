import React from 'react'; // Importing React library
import Feature from './Feature'; // Importing Feature component
import Brainstorming from '../../assets/brainstorming.png'; // Importing the brainstorming image
import Collaborative from '../../assets/collaborative.png'; // Importing the collaborative image
import Drive from '../../assets/drive.png'; // Importing the drive image
import Chatbot from '../../assets/chatbot.png'; // Importing the chatbot image
import Whiteboard from '../../assets/whiteboard.png'; // Importing the whiteboard image
import Reactions from '../../assets/reactions.png'; // Importing the reactions image

// Defining a functional component named Features
const Features = () => {
  return (
    // Container for the features section
    <div className='flex flex-col justify-center items-center my-16'>
      {/* Section titles */}
      <p className='font-extrabold text-4xl py-1'>Features for running</p>
      <p className='font-extrabold text-4xl py-1'>a better online ideation</p>
      <p className='font-extrabold text-4xl py-1'>sessions</p>

      {/* Grid for displaying features */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10 mt-12'>
        {/* Feature components with respective images, titles, and descriptions */}
        <div className='p-4'>
          <Feature 
            image={Brainstorming}
            title='Ideation Guidance'
            description='Unlock creativity with guided ideation assistance, offering step-by-step support for effective brainstorming and brainwriting sessions.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={Collaborative}
            title='Real-time Collaboration'
            description='Enable multiple users to brainstorm and ideate simultaneously, fostering teamwork and creativity in real-time.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={Drive}
            title='Import and Export to Drive'
            description='Seamlessly import and export projects using Google Drive for effortless collaboration and secure storage.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={Chatbot}
            title='AI-powered Suggestions'
            description='Offer AI-powered suggestions and prompts to spark creativity and assist users in generating innovative ideas.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={Whiteboard}
            title='Whiteboard Collaboration'
            description='Offer virtual whiteboard functionality with collaborative drawing and annotation tools, allowing users to visualize their ideas in real-time.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={Reactions}
            title='Public Project Sharing'
            description='Enable project visibility to all users for inspiration and idea discovery.' 
          />
        </div>
      </div>
    </div>
  );
}

// Exporting the Features component as default
export default Features;
