// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Routes,Route, Navigate } from 'react-router-dom';
import { LoginPage,Dashbord,Projects,Recents,Favorites,Public,Trash, LandingPage, AdminDashboard, General, Tags, Logs, Users, FeedBacks, ForgotPassword, ResetPassword } from './components';
const App = () => {
  const [user,setUser] = useState(true);
  return (
  <>
      <Routes>

        <Route path="/login" element={user ? <Navigate to="/Home/Projects"/>:<LoginPage/>}/>
        <Route path='/' element={user?<Navigate to="/Home/Projects"/>:<LandingPage/>}/>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/ResetPassword' element={<ResetPassword/>}></Route>

        <Route  path='/Home' element={user?<Dashbord/>:<Navigate to="/login"/>}>
            <Route index={true} element={<Navigate to="/Home/Projects"/>}/>
            <Route path='Projects' element={<Projects/>}/>
            <Route path='Recents' element={<Recents/>}/>
            <Route path='Favorites' element={<Favorites/>}/>
            <Route path='Public' element={<Public/>}/>
            <Route path='Trash' element={<Trash/>}/>
            <Route path='*' element={<h1>Page Not Found</h1>}/>
        </Route>

        <Route  path='/Admin' element={user?<AdminDashboard/>:<Navigate to="/login"/>}>
            <Route index={true} element={<Navigate to="/Admin/General"/>}/>
            <Route index={true} path='General' element={<General/>}/>
            <Route path='Tags' element={<Tags/>}/>
            <Route path='FeedBacks' element={<FeedBacks/>}/>
            <Route path='Users' element={<Users/>}/>
            <Route path='Logs' element={<Logs/>}/>
            <Route path='*' element={<h1>Page Not Found</h1>}/>
        </Route>

      </Routes>
  </>
  )
}
export default App