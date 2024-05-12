import React from 'react'

const Sticker = ({ color, idea }) => {

  // Define a style object to calculate the height based on the width of the sticker
  const stickerStyle = {
    display: 'inline-block',
    boxShadow: '10px  10px 10px rgba(0, 0, 0, 0.1)',
    width: '100%', // Set the width to 100% to make the sticker responsive
    paddingBottom: '100%', // Maintain aspect ratio (height = width)
    position: 'relative', // Positioning context for absolute children,,

  }

  return (
    <div style={stickerStyle} className={` ${color}`}>
      <p className='text-xl  font-semibold absolute m-[20%] top-0 left-0 right-0 bottom-0 overflow-auto'>
        {idea.content}
      </p>
    </div>
  )
}

export default Sticker
