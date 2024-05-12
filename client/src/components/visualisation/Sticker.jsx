import React from "react";

// This is a functional component named Sticker that takes two props: `color` and `idea`.
const Sticker = ({ color, idea }) => {
  return (
    // Render a <div> element with dynamic styling based on the `color` prop.
    <div
      className={` ${color} px-6 py-3 m-1 inline-block rounded-lg shadow-md`}
    >
      {/* Render a <p> element to display the `idea` prop as text. */}
      <p className="text-xs">{idea.content}</p>
    </div>
  );
};

// Export the Sticker component as the default export from this module.
export default Sticker;
