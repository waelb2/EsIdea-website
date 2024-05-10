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
  const getFeedbacks = async()=>{
    setLoading(true);
    try {
      const response = await axios.get('/admin/feedbacks',);
      setFeedbacks(response.data);
      console.log(response.data);
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
        feedbacks.length !== 0 ?<div className='flex flex-col gap-y-1'>
          {feedbacks.map(feedback=><div className='bg-realWhite px-2 py-1 rounded-md'  key={feedback._id}>
              <p>{feedback.title}</p>
              <p>{feedback.description}</p>
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