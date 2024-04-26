// eslint-disable-next-line no-unused-vars
import React, { useState,useEffect,useMemo } from 'react';
import { Routes,Route, Navigate } from 'react-router-dom';
import { LoginPage,Dashbord,Projects,Recents,Favorites,Public,Trash, LandingPage, AdminDashboard, General, Tags, Logs, Users, FeedBacks, ForgotPassword, ResetPassword, AddPassword, ChangePassword } from './components';
import Loader from './components/loader/Loader';
import {createContext} from 'react';
import axios from 'axios';
export const UserContext = createContext();
const App = () => {
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useMemo(() => User, [User]);
  // useEffect(() => {
  //   const getUser = () => {
  //     fetch("http://localhost:3000/dashboard", {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": true,
  //       },
  //     })
  //       .then((response) => {
  //         if (response.status === 200) return response.json();
  //         throw new Error("authentication has been failed!");
  //       })
  //       .then((resObject) => {
  //         setUser(resObject.user);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setLoading(false);
  //       });
  //   };
  //   getUser();
  // }, []);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/dashboard", {
          withCredentials: true, // Ensure cookies are sent
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setUser(response.data.user);
          setLoading(false);
        } else {
          throw new Error("Authentication has failed!");
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getUser();
  }, []);
  if (loading) {
    return <Loader/>;
  }
  return (
  <>
   <UserContext.Provider value={{user,setUser}}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/Home/Projects"/>:<LoginPage setUser={setUser}/>}/>
        <Route path='/' element={user?<Navigate to="/Home/Projects"/>:<LandingPage/>}/>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/addPassword' element={<AddPassword/>}></Route>
        <Route path='/auth/resetPassword/*' element={<ResetPassword/>}></Route>
        <Route path='/ChangePassword' element={<ChangePassword/>}></Route>

        <Route  path='/Admin' element={user?<AdminDashboard/>:<Navigate to="/login"/>}>
            <Route index={true} element={<Navigate to="/Admin/General"/>}/>
            <Route path='General' element={<General/>}/>
            <Route path='Tags' element={<Tags/>}/>
            <Route path='FeedBacks' element={<FeedBacks/>}/>
            <Route path='Users' element={<Users/>}/>
            <Route path='Logs' element={<Logs/>}/>
            <Route path='*' element={<h1>Page Not Found</h1>}/>
        </Route>

        <Route  path='/Home' element={user?<Dashbord/>:<Navigate to="/login"/>}>
            <Route index={true} element={<Navigate to="/Home/Projects"/>}/>
            <Route path='Projects' element={<Projects/>}/>
            <Route path='Recents' element={<Recents/>}/>
            <Route path='Favorites' element={<Favorites/>}/>
            <Route path='Public' element={<Public/>}/>
            <Route path='Trash' element={<Trash/>}/>
            <Route path='*' element={<h1>Page Not Found</h1>}/>
        </Route>
      </Routes>
      </UserContext.Provider>
  </>
  )
}
export default App