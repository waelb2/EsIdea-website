import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SubTopic from "./SubTopic";
import HomeIcon from "../assets/Home.svg";
import profilePic from "../assets/profile-pic.png";
import html2canvas from "html2canvas"; // Import html2canvas for exporting
import MainTopic from "./MainTopic";

// This is a functional component named Visualisation
const Visualisation = () => {
  // Define state variables using useState hook
  const [mainTopic, setMainTopic] = useState("");
  const [subTopics, setSubTopics] = useState([]);
  const [singleTopic, setSingleTopic] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const profileRef = useRef(null);
  const isMultiple = false; // Boolean flag indicating whether there are multiple topics

  // useEffect hook to fetch data from APIs when the component mounts
  useEffect(() => {
    const fetchDataMultiple = async () => {
      try {
        // Fetch main topic data
        const mainTopicResponse = await axios.get(
          "http://localhost:3000/main-topic"
        );
        setMainTopic(mainTopicResponse.data[0].title);

        // Fetch sub topics data
        const subTopicsResponse = await axios.get(
          "http://localhost:3000/sub-topics"
        );
        setSubTopics(subTopicsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchDataSingle = async () => {
      try {
        // Fetch single topic data
        const singleTopicResponse = await axios.get(
          "http://localhost:3000/single-topic"
        );
        setSingleTopic(singleTopicResponse.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataMultiple(); // Call function to fetch multiple topics data
    fetchDataSingle(); // Call function to fetch single topic data
  }, []); // Run this effect only once on component mount

  // useEffect hook to handle click outside of profile popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Run this effect only once on component mount

  // Function to toggle profile popup visibility
  const handleProfileClick = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  // Function to handle export click and generate image from HTML content
  const handleExportClick = () => {
    html2canvas(document.querySelector("#exportContent")).then((canvas) => {
      // Generate image data
      const imgData = canvas.toDataURL("image/png");

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "exported-image.png";
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);
    });
  };

  return (
    <div className="container bg-[#FEFEFE] mx-auto py-8 pt-20">
      {/* Profile Icon and Popup */}
      <div className="fixed top-6 right-6 px-8 cursor-pointer">
        <div className="relative" onClick={handleProfileClick}>
          <img
            src={profilePic}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          {showProfilePopup && (
            <div
              className="absolute right-0 top-16 flex items-center justify-center border-2 rounded-lg"
              ref={profileRef}
            >
              <div className="bg-white py-6 px-10 rounded-lg max-w-sm">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-2"
                />
                <p className="text-xl font-bold text-center">Full Name</p>
                <p className="text-center mb-2">example@mail.com</p>
                <hr />
                <p className="text-red text-center mt-2">Log Out</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex gap-4 fixed top-6 left-6 px-8 py-4 bg-white shadow rounded-2xl">
        {/* Home Icon with Tooltip */}
        <div className="flex relative">
          <img
            src={HomeIcon}
            className="items-center"
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          {showTooltip && (
            <div className="absolute left-0 top-6 bg-gray-800 text-white px-2 py-1 rounded">
              <p>Go to Dashboard</p>
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <div className=" border-l border-gray-300 h-auto"></div>

        {/* Main Topic Title */}
        <h1 className="text-md font-bold">{mainTopic}</h1>

        {/* Vertical Separator */}
        <div className="border-l border-gray-300 h-auto"></div>

        {/* Export Button */}
        <button onClick={handleExportClick}>Export as Image</button>
      </div>

      {/* Render content based on the condition (isMultiple flag) */}
      {isMultiple && (
        <div id="exportContent">
          <h1 className="text-center text-3xl font-bold my-8">{mainTopic}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Render SubTopic components for multiple topics */}
            {subTopics.map((subTopic) => (
              <SubTopic key={subTopic.id} Prop={subTopic} />
            ))}
          </div>
        </div>
      )}

      {/* Render MainTopic component for single topic */}
      {!isMultiple && (
        <div className="grid grid-cols-1">
          <div id="exportContent">
            <MainTopic Prop={singleTopic} />
          </div>
        </div>
      )}
    </div>
  );
};

// Export the Visualisation component as the default export from this module.
export default Visualisation;
