import React from "react";
import Sticker from "./Sticker";

const MainTopic = ({ ideas, mainTopic }) => {
  const colors = [
    "#c2cad2",
    "#d8b2f4",
    "#d094f7",
    "#8fa2f8",
    "#a3c3f8",
    "#f7d6a1",
    "#eea87d",
    "#85c69a",
    "#a4ce91",
    "#eba9a3",
    "#ec8885",
  ];

  return (
    <div className="flex flex-1 flex-col bg-gray-100 rounded-lg shadow-md p-8 my-8">
      <h1 className="text-center text-3xl font-bold mb-4">{mainTopic}</h1>
      {ideas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea, index) => (
            <Sticker
              key={index}
              idea={idea}
              color={colors[index % colors.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainTopic;
