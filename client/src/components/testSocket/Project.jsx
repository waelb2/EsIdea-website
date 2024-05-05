import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import io from 'socket.io-client';

function Project({ projectTitle, projectId, userToken, profilePicUrl }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers]= useState([]) 
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get(`idea/get-ideas/${projectId}`);
        setIdeas(response.data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas();

    // Connect to the socket server
    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);
   // Join the project room
    newSocket.emit('joinRoom', projectId);
    
    //sending the connected user profile pic 
    newSocket.emit('userData',{
      profilePicUrl
    })
    // Clean up function to disconnect socket on component unmount
    return () => newSocket.disconnect();
  }, [projectId]);

  // Listen for new ideas
  useEffect(() => {
    if (socket) {
      socket.on('newIdea', (idea) => {
        setIdeas((prevIdeas) => [...prevIdeas, idea]);
      });
        socket.on('connectedUsers',connectedUsers =>setOnlineUsers(connectedUsers))
        console.log(onlineUsers)
    }
  }, [socket]);

  const postIdea = async () => {
    try {
      const response = await axios.post(`idea/post-idea`, {
        projectId: projectId,
        content: currentMessage,
        topicId: '66304643fffed1280d828d88'
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      // Emit the new idea to the server for broadcasting
      if (socket) {
        socket.emit('newIdea',{idea : response.data, projectId});
      }

      // Add the new idea received in the response to the state
      setIdeas([...ideas, response.data]);
      
      // Clear the input field after posting
      setCurrentMessage('');
    } catch (error) {
      console.error('Error posting idea:', error);
    }
  };

  return (
    <>
      <div className="online-users-container">
      <h2>Online Users</h2>
      <div className="online-users-list">
        {onlineUsers.map((user,index) => (
          <img key={index} src={user.profilePicUrl}  className="profile-pic m-2 w-10 h-10 rounded-full " />
        ))}
      </div>
    </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 rounded-lg p-4">
          <h4 className="text-xl font-bold mb-2">{projectTitle}</h4>
        </div>
        <div className="col-span-2">
          <h2 className="m-5">Project Ideas</h2>
          <div className="grid grid-cols-2 gap-4">
            {ideas.map((idea) => (
              <div key={idea._id} className="border p-4 flex items-center justify-between">
                <div className="border p-4 relative">
                  <img src={idea.createdBy.profilePicUrl} alt="Profile Pic" className="w-5 h-5 rounded-full absolute top-0 right-0" />
                  <p><strong>Created By:</strong> {idea.createdBy.name}</p>
                  <p><strong>Email:</strong> {idea.createdBy.email}</p>
                  <p><strong>Topic:</strong> {idea.topic}</p>
                  <p><strong>Content:</strong> {idea.content}</p>
                  <p><strong>Creation Date:</strong> {new Date(idea.creationDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex m-20">
        <input type="text" placeholder="post your idea..." className="border rounded-l py-2 px-4 focus:outline-none focus:ring focus:border-blue-300" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r mr-4" onClick={postIdea}>Send</button>
      </div>
    </>
  );
}

export default Project;
