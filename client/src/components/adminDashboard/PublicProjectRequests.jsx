import React, { useEffect, useState } from 'react'
import AdminNavBar from './pages/AdminNavBar'
import axios from '../../utils/axios'
const PublicProjectRequests = () => {
    const [loading,setLoading] = useState(true);
    const [data,setData] = useState([]);
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
            const response = await axios.patch("admin/publicProjectRequest/approve",{id:"663e65c69519fca17d323e71"});
            if (response.statusText == 'OK') {
                console.log(response.data)
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
        approveRequest();
    },[])
    return (
        <>
        <AdminNavBar location='Public projects Request'/>
        </>
    )
}

export default PublicProjectRequests