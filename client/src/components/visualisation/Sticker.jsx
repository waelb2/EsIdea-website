import React from 'react';

const getRandomRotation = () => {
  // Generate a random rotation angle between -5 and 5 degrees
  return `rotate(${Math.random() * 10 - 5}deg)`;
};

const Sticker = ({ color, idea }) => {
  const stickerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '200px',
    height: 'auto',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    transform: getRandomRotation(), 
    marginBottom: '20px', 
  };

  const cornerStyle = {
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    width: '10px',
    height: '10px',
    transform: 'rotate(45deg)',
    background:'#f3f4f6',
    zIndex: '1',
      clipPath: 'polygon(100% 0, 100% 100%, 0% 100%)', // Add curvature to the corner

  };

  return (
    <div className={` ${color}`} style={stickerStyle}>
      <div style={cornerStyle} ></div>
      <p
        className="text-xl font-semibold p-4"
        style={{ position: 'relative', zIndex: '2' }}
      >
        {idea.content}
      </p>
    </div>
  );
};

export default Sticker;
