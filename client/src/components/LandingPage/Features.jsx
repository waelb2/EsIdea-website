// eslint-disable-next-line no-unused-vars
import React from 'react'; // Importing React library
import Feature from './Feature'; // Importing Feature component
import {brainstorming,collaborative,drive,chatbot,whiteboard,reactions} from '../../assets'

// Defining a functional component named Features
const Features = () => {
  return (
    // Container for the features section
    <div className='flex flex-col justify-center items-center my-16'>
      {/* Section titles */}
      <div className='flex flex-col gap-1 justify-center items-center px-3'>
        <p className='font-bold text-2xl md:font-extrabold md:text-4xl'>Features for running</p>
        <p className='font-bold text-2xl md:font-extrabold md:text-4xl'>a better online ideation</p>
        <p className='font-bold text-2xl md:font-extrabold md:text-4xl'>sessions</p>
      </div>

      {/* Grid for displaying features */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10 mt-12'>
        {/* Feature components with respective images, titles, and descriptions */}
        <div className='p-4'>
          <Feature 
            image={brainstorming}
            title='Ideation Guidance'
            description='Unlock creativity with guided ideation assistance, offering step-by-step support for effective brainstorming and brainwriting sessions.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={collaborative}
            title='Real-time Collaboration'
            description='Enable multiple users to brainstorm and ideate simultaneously, fostering teamwork and creativity in real-time.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={drive}
            title='Import and Export to Drive'
            description='Seamlessly import and export projects using Google Drive for effortless collaboration and secure storage.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={chatbot}
            title='AI-powered Suggestions'
            description='Offer AI-powered suggestions and prompts to spark creativity and assist users in generating innovative ideas.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={whiteboard}
            title='Whiteboard Collaboration'
            description='Offer virtual whiteboard functionality with collaborative drawing and annotation tools, allowing users to visualize their ideas in real-time.' 
          />
        </div>
        
        <div className='p-4'>
          <Feature 
            image={reactions}
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