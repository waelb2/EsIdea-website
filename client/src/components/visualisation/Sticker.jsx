import React from 'react';

const getRandomRotation = () => {
  return `rotate(${Math.random() * 10 - 5}deg)`;
};

const Sticker = ({ color, idea }) => {
  const stickerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '300px',
    height: 'auto',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    transform: getRandomRotation(), 
    marginBottom: '20px', 
  };
  
  return (
    <div className={` ${color}`} style={stickerStyle}>
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
