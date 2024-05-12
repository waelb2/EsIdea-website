import React from 'react'
import Sticker from './Sticker'

const MainTopic = ({ ideas, mainTopic }) => {
  const colors = [
    'bg-[#c2cad2] text-white',
    'bg-[#d8b2f4] text-white',
    'bg-[#d094f7] text-white',
    'bg-[#8fa2f8] text-white',
    'bg-[#a3c3f8] text-white',
    'bg-[#f7d6a1] text-white',
    'bg-[#eea87d] text-white',
    'bg-[#85c69a] text-white',
    'bg-[#a4ce91] text-white',
    'bg-[#eba9a3] text-white',
    'bg-[#ec8885] text-white'
  ]

  return (
    <div className='flex flex-1 flex-col bg-gray-100 rounded-lg shadow-md p-8 my-8'>
      <h1 className='text-center text-3xl font-bold mb-4'>{mainTopic}</h1>
      {ideas && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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
  )
}

export default MainTopic
