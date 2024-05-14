import React, { useContext, useEffect, useState } from 'react'
import AdminNavBar from './pages/AdminNavBar'
import axios from '../../utils/axios'
import { MagnifyingGlass } from 'react-loader-spinner';
import { MessageToUserContext } from './AdminDashboard';
const PublicProjectRequests = () => {
    const [loading,setLoading] = useState(true);
    const [data,setData] = useState([]);
    const displayMessageToUser = useContext(MessageToUserContext);
    const getPublicProjectRequests = async()=>{
        setLoading(true);
        try {
            const response = await axios.get("admin/publicProjectRequest");
            if (response.statusText == 'OK') {
                setData(response.data);
                console.log(response.data)
                setLoading(false);
            } else {
                console.log(response)
                throw new Error ("Authentication has failed")
            }
        } catch (error) {
            console.log(error);
        }
    }
    const approveRequest = async(id)=>{
        try {
            const response = await axios.patch("admin/publicProjectRequest/approve",{id});
            if (response.status == 200) {
                displayMessageToUser("success","The public project request has been approved");
                getPublicProjectRequests();
            } else {
                console.log(response)
                throw new Error ("Authentication has failed")
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        getPublicProjectRequests();
    },[])
    return (
        <>
        <AdminNavBar location='Public projects Requests'/>
        {data.length !== 0 ?<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2'>
            {data.map(req => <div className='flex flex-col ss:flex-row gap-x-4 bg-realWhite rounded-md overflow-hidden hover:shadow-xl border-2 border-transparent hover:border-slate-400 transition-all duration-500 cursor-pointer' key={req._id}>
                <img className='ss:w-40 ss:h-40 w-full h-32 p-2 object-contain bg-realWhite' src={req.projectId.thumbnailUrl === ""?"https://img.freepik.com/free-vector/startup-success-launch-business-project_107791-4758.jpg?t=st=1714342322~exp=1714345922~hmac=81d1a808f2b5abda57ed89b74489360abce54b3c9bdc7816ecd6a489f3339b35&w=1380":req.projectId.thumbnailUrl} alt="Banner" />
                <div className='flex-grow flex flex-col justify-between px-4 py-3'>
                    <h1 className='font-semibold text-lg'>{req.projectId.title}</h1>
                    <p title={req.projectId.description} className='line-clamp-3 mb-1'>{req.projectId.description}</p>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-x-1'>
                            <img  className='w-8 h-8 rounded-full border-2 border-[#10b981] p-0.5' src={req.projectId.coordinator.profilePicUrl} alt="" />
                            <p className='text-xs max-w-[18ch] text-nowrap '>{`${req.projectId.coordinator.firstName} ${req.projectId.coordinator.lastName}`}</p>
                        </div>
                        <button onClick={()=>{approveRequest(req._id)}} className="relative rounded px-3 py-1 overflow-hidden group bg-[#10b981] text-white hover:ring-1 hover:ring-offset-2 hover:ring-[#10b981] transition-all ease-out duration-300">
                            Approve
                        </button>
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
                  <h1 className='font-semibold text-lg'>No public Project requests</h1>
              </div>}
        </>
    )
}

export default PublicProjectRequests