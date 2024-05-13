// eslint-disable-next-line no-unused-vars
import React, {useState } from 'react';
import Faq from 'react-faq-component';
const questions1 = {
  title: "Frequently Asked Questions (FAQ)-ESIDEA",
  rows: [
    {
      title: "What is this application about?",
      content: "This application is designed to support the ideation process for students and teachers of the school. It helps in generating, organizing, and prioritizing ideas for various projects and activities."
    },
    {
      title: "Who can access this application?",
      content: "The application is accessible to both students and teachers of the school. Users need to authenticate themselves before accessing the features of the application."
    },
    {
      title: "What are the main features of this application?",
      content: 'The main features include:<br/>--> Creation and tracking of ideation projects.<br/>--> Selection of school modules and clubs.<br/>--> Management of ideation process with techniques like brainstorming and brain-writing.<br/>--> Visualization of ideas using various tools and techniques.<br/>--> Integration of optional chatbot for ideation assistance.'
    },
    {
      title: "How can I update the lists of school modules and clubs?",
      content: "Users can not update the lists of school modules and clubs directly within the application. So only admins have the ability to do so, and there are options provided to add, remove, or modify the existing entries."
    },
    {
      title: "Is there a way to save my ideation projects for future reference?",
      content: "Yes, the application allows users to save and restore their ideation projects locally or on external storage such as Google Drive. This ensures that your work is securely stored and accessible whenever needed."
    },
    {
      title: "Can I get help or guidance during the ideation process?",
      content: "Absolutely! The application offers an optional chatbot feature that provides personalized and interactive assistance during the ideation process. It aims to stimulate creativity and aid decision-making."
    },
    {
      title: "How user-friendly is the application?",
      content: "The application is designed with user-friendliness in mind. It adheres to usability standards, provides intuitive interfaces, and offers contextual help wherever necessary to ensure a smooth user experience."
    },
    {
      title: "What should I do if I encounter any issues or errors while using the application?",
      content: "If you encounter any issues or errors, please reach out to our support team through the provided contact channels. We are committed to resolving any issues promptly and ensuring your satisfaction with the application."
    },
    {
      title: "Is there a limit to the number of ideation projects I can create?",
      content: "No, there is no limit to the number of ideation projects you can create within the application. You can create and manage as many projects as needed to support your creative endeavors."
    },
    {
      title: "Are there any tutorials or guides available for using the application?",
      content: "Yes, we provide comprehensive tutorials and guides within the application to help users get started and make the most out of its features. Additionally, our support team is available to assist you with any questions or issues you may encounter."
    },
    {
      title: "Can I export my ideation projects to other formats?",
      content: "Yes, the application offers export functionalities that allow users to export their ideation projects to various formats such as PDF, CSV, or Excel. This enables easy sharing and collaboration with others outside the application."
    },
    {
      title: "Can I share my ideation projects with others?",
      content: "Yes, you can easily share your ideation projects with others by inviting them to collaborate or by exporting the project to a shareable format such as PDF or Excel.  You can also make your project public, so other users can see it, rate it and give you feedbacks!"
    },
    {
      title: "Is there a way to track the progress of my ideation projects?",
      content: "Yes, the application provides tools for tracking the progress of your ideation projects. You can monitor the status of each idea, track discussions and comments, and view the overall progress of the project."
    },
    {
      title: "What happens if I accidentally delete a project or idea?",
      content: "Don't worry! The application provides safeguards against accidental deletions. Deleted projects and ideas are moved to a recycle bin where they can be restored if needed. Additionally, our support team can assist you in recovering any lost data."
    },
    {
      title: "Can I customize the visual appearance of my ideation projects?",
      content: "Yes, the application offers customization options for the visual appearance of your ideation projects. You can choose from different themes, color schemes, and layout options to personalize the look and feel of your projects."
    },
    {
      title: "Is there a way to integrate third-party tools or services with the application?",
      content: "Yes, the application supports integration with third-party tools and services through APIs and plugins. This allows you to extend the functionality of the application and integrate it seamlessly into your existing workflows."
    },
    {
      title: "How frequently is the application updated?",
      content: "The application is regularly updated with new features, improvements, and bug fixes. Updates are typically released on a regular basis to ensure that users have access to the latest enhancements and optimizations."
    },
    {
      title: "Is my data secure in the application?",
      content: "Yes, we take data security seriously. The application employs industry-standard encryption and security measures to protect your data from unauthorized access or breaches."
    },
    {
      title: "What languages are supported by the application?",
      content: "The application currently supports only english. We are continuously working to add support for more languages in future updates."
    },]
};
const questions2 = {
  title: "Help-ESIDEA",
  rows: [
    {
      title: "How can I create a new account?",
      content: "To create a new account, simply click on the 'Sign Up' button or choose 'Continue with Google.' If you have an email ending with @esi.dz, you can use it directly to create your account."
    },
    {
      title: "What should I do if I forgot my password?",
      content: "If you've forgotten you password you can easily reset it by clicking on the 'Forgot Password' link on the login page. Enter you email address associated with your account, and we'll send you a link to reset you password"
    },
    {
      title: "How do I create a new project?",
      content: "To create a new project, simply click on the add icon, then choose your preferred ideation method. Next, input essential project details such as the title, description, timer, category, and collaborators. Define the main topic and subtopics, and upload a picture to represent your project."
    },
    {
      title: "How Can I Create a New Brainstorming Project?",
      content: "To create a new brainstorming project, simply click on the add icon, then choose the brainstorming method. Next, input essential project details, or you can simply click on the brainstorming icon on the dashboard and provide the necessary information about the project. After that, your project will be created successfully."
    },
    {
      title: "How Can I Create a New Brainwriting Project?",
      content: "To create a new brainwriting project, simply click on the add icon, then choose the brainwriting method. Next, input essential project details, or you can simply click on the brainwriting icon on the dashboard and provide the necessary information about the project. After that, your project will be created successfully."
    },
    {
      title: "How Can I Access the Whiteboard?",
      content: "To access the whiteboard, simply navigate to the dashboard and click on the whiteboard icon. You'll be redirected to the whiteboard page where you can utilize its features for your needs."
    },
    {     
      title: "How to Edit Project Information?",
      content: "To modify the information of a project, simply hover over the project and click on the three dots icon. A menu will appear with various options; select 'Edit file info.' From there, you can easily update the details of the project as needed."

    },
    {
      title: "How to view recent projects?",
      content: "To access recent projects, navigate to the dashboard. On the left side, you'll find multiple options, including 'Recents.' Click on 'Recents', and it will promptly display the most recent projects for easy access and tracking."
    },
    {
      title: "How to add a project to favorites?",
      content: "To add a project to your favorites, hover over the project and click on the three dots icon. A menu will appear with various options; select 'Move to Favorites,' and the project will be relocated to the favorites section for easy access."
    },
    {
      title: "How to access to favorite projects",
      content: "To access favorite projects, navigate to the dashboard. On the left side, you'll find multiple options, including 'Favorites.' Click on 'Favorites,' and it will promptly display the favorite projects for easy access and tracking."
    },
    {
      title: "How to move a project to the trash?",
      content: "To transfer a project to the trash, hover over the project and click on the three dots icon. A menu will appear with various options; select 'Move to Trash' and the project will be relocated to trash."
    },
    {
      title: "How to view projects moved to trash",
      content: " To view projects moved to the trash, navigate to the dashboard. On the left side, you'll find multiple options, including 'Trash.' Click on 'Trash,' and it will promptly display the projects moved to the trash for easy access and tracking."
    },
    {
      title: "How to publish a project that I created?",
      content: "To publish a project you've created, hover over the project and click on the three dots icon. A menu will appear with various options; select 'Publish.' Click on it, and your project will be published for others to view."
    },
    {
      title: "How to view projects which are public",
      content: "To view public projects, navigate to the dashboard. On the left side, you'll find multiple options, including 'Public.' Click on 'Public,' and it will promptly display the projects available to the public for easy access and tracking."
    },
    {
      title: "How to access to the project ",
      content: ""
    },
    {
      title: "How to see the cordinator and collaborators of a project?",
      content: " To see the coordinator and collaborators of a project, hover over the project and click on the three dots icon. A menu will appear with various options; select 'Collaborators,' and you'll see the coordinator and collaborators listed for the project."
    },
    {
      title: "How to search for a specific project?",
      content: "To search for a specific project, navigate to the dashboard. In the top-right corner, you'll find a search bar. Click on it, then type the name of the project you're looking for, and you'll get the results matching your search query."
    },
    {
      title: "How to change the profile picture?",
      content: "To change your profile picture, navigate to the dashboard. In the top-right corner, you'll find your current profile picture. Click on it, then select 'pfp' from the options provided. Upload your new profile picture and click 'Change.' Your profile picture will be updated accordingly."
    },
    {
      title: "How to change the password within my account?",
      content: "To change your password within your account, navigate to the dashboard. In the top-right corner, you'll find your current profile picture. Click on it, you'll find the option 'Change Password.' Click on it, then set your new password and click 'Change.' Your password will be successfully updated."
    },
    {
      title: "How Can I Provide Feedback to the Application?",
      content: "To submit feedback for the project, navigate to the dashboard. In the top-right corner, you'll find your current profile picture. Click on it, then select 'Feedback' from the options provided. Fill out the title and description fields, then click 'Send.'"
    },
    {
      title: "How Do I Log Out from My Account?",
      content: "To log out from your account, navigate to the dashboard. In the top-right corner, you'll find your current profile picture. Click on it, then select 'Log out,' and you'll be redirected to the signup page successfully."
    },
    {
      title: "How Do I Begin Ideation?",
      content: "To start the ideation process, enter the project. If you're the coordinator, you'll find a button labeled 'Start Ideation.' Click on it to initiate the countdown timer and commence the ideation session. As a collaborator, you'll need to wait until the coordinator starts the ideation, at which point the countdown timer will begin, marking the start of the ideation session."
    },
    {
      title: "How Do I Create an Idea?",
      content: "To create an idea, use the input field located at the bottom where you can enter a single idea at a time. Once you've entered your idea, click on the send icon to share it with others."
    },
    {
      title: "How Do I Create an Idea with Bold Font?",
      content: "To create an idea with bold font, utilize the formatting options available on the left side. Click on the first option, which is for bold. Then, use the input field located at the bottom to enter your idea. After typing your idea, click on the send icon to share it with others. You'll notice that the idea appears in bold font."
    },
    {
      title: "How Do I Create an Idea with Italic Font?",
      content: "To create an idea with Italic font, utilize the formatting options available on the left side. Click on the second option, which is for italic. Then, use the input field located at the bottom to enter your idea. After typing your idea, click on the send icon to share it with others. You'll notice that the idea appears in italic font."
    },
    {
      title: "How Do I Create an Idea with Italic Font?",
      content: "To create an idea with Italic font, utilize the formatting options available on the left side. Click on the second option, which is for italic. Then, use the input field located at the bottom to enter your idea. After typing your idea, click on the send icon to share it with others. You'll notice that the idea appears in italic font."
    },
    {
      title: "How Do I Colorize My Idea?",
      content: "To create an idea with a color of your choice, use the formatting options available on the left side. Click on the third option, which is for colors, then select any color you desire. Next, use the input field located at the bottom to enter your idea. After typing your idea, click on the send icon to share it with others. You'll notice that the idea appears in the color you've chosen."
    },
    {
      title: "How to Delete All My Ideas?",
      content: "To delete all of your ideas, utilize the formatting options available on the left side. Click on the fourth option, which is for deleting all the ideas, and you'll notice that all your ideas have been deleted"
    },
    {
      title: "How Can I Delete One of My Ideas?",
      content: "To delete one of your ideas, you can hover over the idea before the countdown finishes. Once hovered, a trash icon will appear. Click on it, and your idea will be promptly deleted."
    },
    {
      title: "How Can I Modify One of My Ideas?",
      content: "To modify one of your ideas, follow these steps: hover over the idea before the countdown finishes. Once hovered, a pen icon will appear. Click on it, then select the idea you want to change. After modifying the idea, click on the 'Save' button, and your idea will be successfully modified."
    },
    {
      title: "How Can I Indicate That I Liked an Idea?",
      content: "To express your appreciation for an idea, wait until the countdown timer finishes. At this point, an icon of a heart will appear alongside each idea. Click on this heart icon to increment it, signifying that you have liked the respective idea."
    },
    {
      title: "How to Combine Several Ideas?",
      content: "To combine multiple ideas after the countdown timer has elapsed, follow these steps: Firstly, select the ideas you wish to combine by clicking on each one. A selected idea will be indicated by a changed border appearance. Next, hover over any selected idea, whereupon a combine icon will appear. Click on this icon to open a popup containing the selected ideas. Within this popup, you'll find an input field at the bottom where you can write the new combined idea. After entering the new idea, click 'Send' or 'Save' to finalize the process. The popup will close, and the selected ideas will be replaced by the newly combined idea."
    },
    {
      title: "How to Extend an Idea into Multiple Ideas?",
      content: "To expand an idea into multiple ideas after the countdown timer has elapsed, hover over the idea you wish to extend. Upon hovering, an extend icon will appear. Click on this icon to open a popup containing the chosen idea. At the bottom of the popup, you'll find an input field where you can write your new ideas. Once entered, the new ideas will appear inside the popup. After completing this, click 'Save' to replace the previous idea you intended to extend with the newly formulated ideas."
    },
    {
      title: "How to Utilize the Chatbot as an Assistant?",
      content: "The chatbot stands ready to assist you throughout the application. Simply locate and click on the chatbot icon situated in the bottom-left corner. Once activated, feel free to engage with the chatbot by posing your queries or requests, and it will promptly respond with helpful information and assistance."
    },
  ]
}


const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setSearchVisible] = useState(false);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterQuestions = (faqData) => {
    return faqData.rows.filter((question) =>
      question.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div>
      <div className='relative mb-4'>
        <i
          className='absolute right-0 top-0 mt-2 mr-4 cursor-pointer'
          onClick={() => setSearchVisible(!isSearchVisible)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d={isSearchVisible ? "M6 18L18 6M6 6l12 12" : "M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"}
            />
          </svg>
        </i>
        {isSearchVisible && (
          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={handleSearch}
            className='p-2 pl-10 border rounded-md w-full focus:outline-none focus:border-blue-500'
          />
        )}
      </div>

      <div className='px-2 mb-10'>
        <Faq data={{ ...questions1, rows: filterQuestions(questions1) }} />
      </div>

      <div className='px-2'>
        <Faq data={{ ...questions2, rows: filterQuestions(questions2) }} />
      </div>
    </div>
  );
};

export default FaqPage;