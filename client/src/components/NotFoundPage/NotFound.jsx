import React from 'react'
import { NotFoundPic, blackLogo, logo } from '../../assets'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate();
    const goBack = ()=>{
        navigate(-1, { replace: true })
    }
  return (
    <div className='min-h-screen w-screen flex justify-center items-center'>
        <img onClick={goBack} className='w-32 h-10 absolute top-4 left-8 cursor-pointer' src={blackLogo} alt="Page not found" />
        <div className='flex flex-col md:flex-row justify-center gap-20 items-center w-full px-8 mt-20 md:mt-0'>
            <div className='flex flex-col gap-3'>
                <h1 className='font-extrabold text-5xl text-black text-center md:text-left'>Ooops...</h1>
                <h2 className='text-black text-xl text-center md:text-left'>Page not found</h2>
                <p className='text-sm max-w-96 text-center md:text-left'>The page you are looking for does not exist or some other error occured,go back to home page.</p>
                <button onClick={goBack} className='bg-skyBlue shadow-custom hover:shadow-hover px-10 py-3 rounded-3xl text-realWhite text-lg font-semibold self-center md:self-start duration-500 transition-shadow '>Go back</button>
            </div>
            <img className='w-80 h-80' src={NotFoundPic} alt="Page nt found" />
        </div>

    </div>
  )
}

export default NotFound