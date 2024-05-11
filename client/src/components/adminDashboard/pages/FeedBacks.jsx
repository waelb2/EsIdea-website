// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import AdminNavBar from './AdminNavBar'
import axios from '../../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass } from 'react-loader-spinner'
const FeedBacks = () => {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(true);
  const [feedbacks,setFeedbacks] = useState([]);
  const dateOptions  = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    timeZoneName: 'short' 
  }
  const getFeedbacks = async()=>{
    setLoading(true);
    try {
      const response = await axios.get('/admin/feedbacks',);
      setFeedbacks(response.data);
      setLoading(false);
  } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
          navigate('/login');
      }
  }
  }
  useEffect(()=>{
    getFeedbacks();
  },[])
  return (
    <>
      <AdminNavBar location='FeedBacks'/>
      {
        feedbacks.length !== 0 ?<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2'>
          {feedbacks.map(feedback=><div className='bg-realWhite p-2 rounded-md hover:shadow-xl border-2 border-transparent hover:border-slate-400 transition-all duration-500 cursor-pointer' key={feedback._id}>
              <div className='flex justify-between items-center mb-2'> 
                  <div className='flex gap-x-1 items-center'>
                      <img className='rounded-full  w-9 h-9 p-0.5 border-2 border-[#10b981]' src={feedback.created_by.profilePicUrl} alt="Profile pic" />
                      <div>
                          <p className='text-sm font-medium'>{`${feedback.created_by.firstName} ${feedback.created_by.lastName}`}
                          </p>
                      </div>
                  </div>
                  <p>{new Date(feedback.creationDate).toLocaleDateString(dateOptions)}</p>
              </div>
              <div className='p-2'>
                  <div className='flex gap-x-1'>
                    <p className='font-semibold'>Title:</p>
                    <p>{feedback.title}</p>
                  </div>

                  <div className='flex gap-x-1'>
                    <p className='font-semibold'>Description:</p>
                    <p>{feedback.description}</p>
                  </div>
              </div>
          </div>)}
        </div>:loading ?<div className='h-full w-full flex justify-center items-center'>
            <MagnifyingGlass
                visible={true}
                height="80"
                width="80"
                ariaLabel="magnifying-glass-loading"
                wrapperStyle={{}}
                wrapperClass="magnifying-glass-wrapper"
                glassColor="#c0efff"
                color="#59AEF8"
                />
            </div>:<div className='h-full w-full flex justify-center items-center'>
                  <h1 className='font-semibold text-lg'>No FeedBacks</h1>
              </div>
      }
    </>
  )
}

export default FeedBacks