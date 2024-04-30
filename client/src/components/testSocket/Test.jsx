// import io from "socket.io-client"
// import Project from "./Project"
// import { useState } from "react"

// const socket = io.connect('http://localhost:3001')
// function Test() {
  

//   const user = JSON.parse(localStorage.getItem('user'))
//   const [userName, setUserName] = useState(user.firstName +'_'+ user.lastName)
//   const [room, setRoom] = useState("")
//   const joinRoom = ()=>{
//     if(userName !== "" && room !==""){
//     socket.emit('join_room',{room,userName})  
//     }
//   }
 
 
//   return (
//     <>
//      <div className='project'>
//       <h3>You are logged in as {userName}</h3>
//       <input type="text" placeholder='Room id...' onChange={e=>{setRoom(e.target.value)}}/><br></br>
//       <button onClick={joinRoom}>Join a room</button><br></br>

//       </div> 
//       <Project socket={socket} userName={userName} room={room}>

//       </Project>
//     </>
//   )
// }

// export default Test