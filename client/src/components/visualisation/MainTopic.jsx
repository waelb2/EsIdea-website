import React from "react";
import Sticker from "./Sticker";

// This is a functional component named MainTopic that accepts a single prop `Prop`.
const MainTopic = ({ ideas , mainTopic }) => {
  // Define an array of colors used for the stickers.
  const colors = [
    "bg-yellow-600 text-gray-900",
    "bg-blue-600 text-white",
    "bg-pink-600 text-white",
    "bg-purple-600 text-white",
    "bg-red-600 text-white",
    "bg-indigo-600 text-white",
    "bg-orange-600 text-gray-900",
    "bg-teal-600 text-white",
    "bg-cyan-600 text-gray-900",
    "bg-lime-600 text-gray-900",
    "bg-amber-600 text-gray-900",
    "bg-light-blue-600 text-gray-900",
    "bg-rose-600 text-white",
    "bg-emerald-600 text-white",
    "bg-sky-600 text-gray-900",
    "bg-fuchsia-600 text-white",
  ];

  return (
    // Render a <div> element with specific styling classes for layout and appearance.
    <div className="flex flex-1 flex-col bg-gray-100 rounded-lg shadow-md p-8 my-8">
      {/* Render a heading element with dynamic content based on the `Prop.title` */}
      <h1 className="text-center text-3xl font-bold mb-4">{mainTopic}</h1>
      {/* Conditionally render content if `Prop.ideas` is not null or undefined */}
      {ideas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Map through the `Prop.ideas` array to render Sticker components */}
          {ideas.map((idea, index) => (
            <Sticker
              key={index} // Assign a unique key to each sticker
              idea={idea} // Pass the `idea` to the Sticker component
              color={colors[index % colors.length]} // Assign a color to the sticker based on its index
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Export the MainTopic component as the default export from this module.
export default MainTopic;
