// eslint-disable-next-line no-unused-vars
import React, { useState,useEffect,useMemo } from 'react';
import { Routes,Route, Navigate } from 'react-router-dom';
import { LoginPage,Dashbord,Projects,Recents,Favorites,Public,Trash, LandingPage, AdminDashboard, General, Tags, Logs, Users, FeedBacks, ForgotPassword, ResetPassword, AddPassword, ChangePassword, BrainStorming, BrainWriting, AdminBrainStorming, AdminBrainWriting, Whiteboard, PublicProjectRequests } from './components';
import RequireAuth from './components/auth/RequireAuth';
import UnauthorizedPage from './components/auth/UnauthorizedPage';
import NotFound from './components/NotFoundPage/NotFound';
import Ideation from './components/pages/Ideation';
import Visualisation from './components/visualisation/Visualisation';
import useUser from './hooks/useUser';

const App = () => {
    const {user} = useUser()
  return (
  <>
      <Routes>
        {/* <Route path="/login" element={user ? <Navigate to="/Home/Projects"/>:<LoginPage setUser={setUser}/>}/>
        <Route path='/' element={user?<Navigate to="/Home/Projects"/>:<LandingPage/>}/> */}
        <Route path="/login" element={<LoginPage/>}/>
        <Route path='/' element={user ? <Navigate to="/Home/Projects"/>: <LandingPage/> }/>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/addPassword' element={<AddPassword/>}></Route>
        <Route path='/auth/resetPassword/*' element={<ResetPassword/>}></Route>
        <Route path='/ChangePassword' element={<ChangePassword/>}></Route>
        <Route path='/unauthorized' element={<UnauthorizedPage/>}></Route>


        {/* <Route  path='/Admin' element={user?<AdminDashboard/>:<Navigate to="/login"/>}>
            <Route index={true} element={<Navigate to="/Admin/General"/>}/>
            <Route path='General' element={<General/>}/>
            <Route path='Tags' element={<Tags/>}/>
            <Route path='FeedBacks' element={<FeedBacks/>}/>
            <Route path='Users' element={<Users/>}/>
            <Route path='Logs' element={<Logs/>}/>
            <Route path='*' element={<h1>Page Not Found</h1>}/>
        </Route> */}

        <Route path='/Admin' element={<RequireAuth allowedRoles={["admin"]}/>}>
            <Route element={<AdminDashboard/>}>
                <Route index={true} element={<Navigate to="/Admin/Statistics"/>}/>
                <Route path='Statistics' element={<General/>}/>
                <Route path='Tags' element={<Tags/>}/>
                <Route path='FeedBacks' element={<FeedBacks/>}/>
                <Route path='Users' element={<Users/>}/>
                <Route path='Logs' element={<Logs/>}/>
                <Route path='PublicProjectRequests' element={<PublicProjectRequests/>}/>
            </Route>
        </Route>
        {/* <Route path='/Home' element={<RequireAuth allowedRoles={["user"]}/>}>
        <Route path='/Home' element={<Dashbord/>}>
            <Route index={true} element={<Navigate to="/Home/Projects"/>}/>
            <Route path='Projects' element={<Projects/>}/>
            <Route path='Recents' element={<Recents/>}/>
            <Route path='Favorites' element={<Favorites/>}/>
            <Route path='Public' element={<Public/>}/>
            <Route path='Trash' element={<Trash/>}/>
        </Route> */}
        <Route path='/Home' element={<RequireAuth allowedRoles={["user","admin"]}/>}>
            <Route element={<Dashbord/>}>
                <Route index={true} element={<Navigate to="/Home/Projects"/>}/>
                <Route path='Projects' element={<Projects/>}/>
                <Route path='Recents' element={<Recents/>}/>
                <Route path='Favorites' element={<Favorites/>}/>
                <Route path='Public' element={<Public/>}/>
                <Route path='Trash' element={<Trash/>}/>
            </Route>
        </Route>

        <Route path='/ideation' element={<Ideation/>}></Route>
        <Route path='/visualisation' element={<Visualisation/>}></Route>

        <Route path='/brainstorming' element={<BrainStorming/>}></Route>
        <Route path='/brainwriting' element={<BrainWriting/>}></Route>
        <Route path='/adminbrainStorming' element={<AdminBrainStorming/>}></Route>
        <Route path='/adminbrainWriting' element={<AdminBrainWriting/>}></Route>
        <Route path='/whiteboard' element={<Whiteboard/>}></Route>
        <Route path='*' element={<NotFound/>}/>
      </Routes>

  </>
  )
}
export default App