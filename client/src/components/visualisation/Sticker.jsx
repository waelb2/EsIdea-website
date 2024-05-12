import React from "react";

const Sticker = ({ color, idea }) => {
  console.log(color, "wiw");
  console.log("wiw");

  // Define a style object to calculate the height based on the width of the sticker
  const stickerStyle = {
    display: "inline-block",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "100%", // Set the width to 100% to make the sticker responsive
    paddingBottom: "100%", // Maintain aspect ratio (height = width)
    position: "relative", // Positioning context for absolute children
  };

  return (
    <div style={stickerStyle} className={` ${color}`}>
      <p className="text-xs absolute top-0 left-0 right-0 bottom-0 m-3 overflow-scroll">
        {idea.content}
      </p>
    </div>
  );
};

export default Sticker;
