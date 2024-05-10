// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import AdminNavBar from './AdminNavBar'
import { DashboardImage,chart1, chart2, chart3 } from '../../../assets'
import BarChart from './BarChart'
import PieChart from './PieChart'
import axios from '../../../utils/axios'

const General = () => {
  const [data,setData] = useState({});
  const Data1 = {labels:["","","","",""],datasets:[
    {
      label:"Label",
      data:[1200,300,150,180,100],
      backgroundColor:"#6BC977"
    }
  ]}
  const Data2 = {labels:["Brainwriting","Brainstorming"],datasets:[
    {
      label:"",
      data:data.nbProjects,
      backgroundColor:["#6AD6D7","#4B6FF6"]
    }
  ]}
  const Data3 = {
    labels:["Facebook","Instagram","Youtube","TikTok","LinkedIn"],
    datasets:[
      {
        label:"Label",
        data:[120,60,30,90,45],
        backgroundColor:["#FF7777","#694BDB","#2BEBC8"],
        hoverOffset:2
      }]
  }
  const options = {responsive:true,plugins:{legend:{position:"bottom"}}}
  const getStats = async()=>{
    try {
      const response = await axios.get("admin/stats");
      if (response.statusText == 'OK') {
        setData(response.data);
      } else {
          console.log(response)
          throw new Error ("Authentication has failed")
      }
      } catch (error) {
          console.log(error);
      }
  }
  useEffect(()=>{
    getStats();
  },[])
  return (
    <>
      <AdminNavBar location='Statistics'/>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 mb-3'>

          <div className='flex flex-col xs:flex-row items-center bg-Lime p-2
           rounded-md justify-between col-span-3'>
              <div className='pl-4'>
                  <h1 className='mb-2 font-bold'>Welcome to your dashboard!</h1>
                  <p className='max-w-full sm:max-w-72 text-grey text-sm'>
                    Try our new Admin Dashboard Template, build with live Ant-Design components. Customize it to your needs and release to production!
                  </p>
              </div>
              <img className='w-72 object-contain' src={DashboardImage} alt="Dashboard image" />
          </div> 
           
           {/* <div className='bg-realWhite rounded-md p-3 flex flex-col justify-around col-span-2 md:col-span-1'>
                  <div className='mb-2'>
                      <h1 className='font-semibold'>Chart Title</h1>
                      <p className='text-sm text-grey'>Short description about the chart</p>
                  </div>
                  <BarChart options={options} data={Data1}></BarChart>
            </div> */}

            <div className='bg-realWhite flex  p-2 items-center gap-1 rounded-md col-span-2 md:col-span-1'>
                  <div className='flex-grow flex flex-col gap-1'>
                      <h1 className='font-semibold text-grey text-sm'>Page visits since 24h</h1>
                      <h1 className='font-bold'>{data.nbVisits24h}</h1>
                      {/* <div className='flex items-center'>
                            <svg stroke="#6BC977" fill="#6BC977" strokeWidth="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M277.375 427V167.296l119.702 119.702L427 256 256 85 85 256l29.924 29.922 119.701-118.626V427h42.75z"></path></svg> 
                            <p className='text-xs font-normal'>1.10% Since yesterday</p>
                      </div> */}
                  </div>
                  <div> 
                        <img className='w-24' src={chart1} alt="chart" />
                    </div>
                </div>

                <div className='bg-realWhite flex  p-2 items-center gap-1 rounded-md col-span-2 md:col-span-1'>
                  <div className='flex-grow flex flex-col gap-1'>
                      <h1 className='font-semibold text-grey text-sm'>Number of users</h1>
                      <h1 className='font-bold'>{data.nbUsers}</h1>
                      {/* <div className='flex items-center'>
                            <svg stroke="#6BC977" fill="#6BC977" strokeWidth="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M277.375 427V167.296l119.702 119.702L427 256 256 85 85 256l29.924 29.922 119.701-118.626V427h42.75z"></path></svg> 
                            <p className='text-xs font-normal'>1.10% Since yesterday</p>
                      </div> */}
                  </div>
                  <div> 
                        <img className='w-24' src={chart2} alt="chart" />
                    </div>
                </div>

                <div className='bg-realWhite flex p-2 items-center gap-1 rounded-md col-span-2 md:col-span-1'>
                  <div className='flex-grow flex flex-col gap-1'>
                      <h1 className='font-semibold text-grey text-sm'>New Projects since 24h</h1>
                      <h1 className='font-bold'>{data.nbProjects24h}</h1>
                      {/* <div className='flex items-center'>
                            <svg stroke="#6BC977" fill="#6BC977" strokeWidth="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M277.375 427V167.296l119.702 119.702L427 256 256 85 85 256l29.924 29.922 119.701-118.626V427h42.75z"></path></svg> 
                            <p className='text-xs font-normal'>1.10% Since yesterday</p>
                      </div> */}
                  </div>
                  <div> 
                        <img className='w-24' src={chart3} alt="chart" />
                    </div>
                </div> 

                <div className=' bg-realWhite col-span-3 p-3 rounded-md'>
                    <h1 className='font-medium text-center mb-2'>Bar chart representing the number of projects per method</h1>
                    <BarChart options={options} data={Data2}></BarChart>
                </div>

                {/* <div className='bg-realWhite p-3 col-span-2 md:col-span-1 rounded-md'>
                  <div className='flex justify-between items-center mb-2'> 
                    <h1 className='font-medium'>Chart Title</h1>
                    <div className='flex justify-center items-center'>
                      <svg stroke="#6BC977" fill="#6BC977" strokeWidth="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M277.375 427V167.296l119.702 119.702L427 256 256 85 85 256l29.924 29.922 119.701-118.626V427h42.75z"></path></svg>
                      <p className='text-xs font-normal'>1.10% Since yesterday</p> 
                    </div>
                  </div>
                  <PieChart options={options} data={Data3}></PieChart>
                </div> */}
      </div>
    </>
  )
}

export default General