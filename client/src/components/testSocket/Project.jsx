import React, { useState } from 'react'

function Project({socket, userName, room }) {
  const [currentMessage, setCurrentMessage] = useState('')
  const sendMessage = async ()=>{
    if(currentMessage !== ''){
       const messageData = {
        room ,
        author : 'userName',
        message : currentMessage,
        sentAt : new Date(Date.now()).getHours() + new Date(Date.now()).getMinutes()
       } 
    await socket.emit('message',messageData)
    }
  }
  return (
    <>
     <div>
         <h1>Project</h1>
    </div>
    <div>
        <input type="text" placeholder='chat...' onChange={(e)=>setCurrentMessage(e.target.value)} />
        <button onClick={sendMessage}>send</button>
    </div>

    </>
     )
}

export default Project