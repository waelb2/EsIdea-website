// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react'
import SideBar from './SideBar';
import { Outlet} from 'react-router-dom';
import ScrollToTop from './pages/ScrollToTop'
const Dashbord = () => {
    const DivContainer = useRef();
    return (
        <div className='w-full h-screen flex justify-between'>
            <SideBar/>
            <div ref={DivContainer} className='flex-grow bg-realWhite px-10 pt-8 flex flex-col gap-y-4 overflow-y-auto relative'>
                <Outlet/>
            </div>
            <ScrollToTop container={DivContainer}/>
        </div>
  )
}

export default Dashbord