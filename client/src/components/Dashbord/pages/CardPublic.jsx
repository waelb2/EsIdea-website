// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
const CardPublic = ({proj}) => {
  const dataOptions  = { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: 'numeric', 
  minute: 'numeric', 
  second: 'numeric', 
  timeZoneName: 'short' 
  }
  return (
    <div   className={`group flex flex-col w-full  rounded-md   relative transition-all duration-500   hover:shadow-lg border-2 border-gray-200 cursor-pointer`}>
        <img className='h-32 object-contain rounded-t-md' src={proj.ThumbnailUrl === "" ? "https://img.freepik.com/free-vector/startup-success-launch-business-project_107791-4758.jpg?t=st=1714342322~exp=1714345922~hmac=81d1a808f2b5abda57ed89b74489360abce54b3c9bdc7816ecd6a489f3339b35&w=1380": proj.ThumbnailUrl} alt="Project_Picture" />
        <div className='flex flex-col gap-y-1 p-3 bg-slate-100  rounded-b-md flex-grow'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[14px] font-semibold'>{proj.ProjectTitle}</h1>
                <p className='text-[12px] '>{new Date(proj.joinedDate).toLocaleDateString(dataOptions)}</p>
            </div>
            <p className='text-sm text-grey font-medium line-clamp-[4]'>
                {proj.Description}
            </p>
        </div>
    </div>
  )
}
CardPublic.propTypes = {
    proj:PropTypes.object,
    index:PropTypes.number.isRequired,
    openedMore:PropTypes.number.isRequired,
    setOpenedMore:PropTypes.func.isRequired
};
export default CardPublic