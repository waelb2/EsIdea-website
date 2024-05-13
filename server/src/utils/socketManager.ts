import { Server, Socket } from 'socket.io'

interface ConnectedUsers {
  [key: string]: { profilePicUrl: string; email: string; lastName: string }
}

export default function initializeSocket (io: Server) {
  const connectedUsers: ConnectedUsers = {}

  io.on('connection', (socket: Socket) => {
    console.log('New client connected')

    // Handle joining a project room
    socket.on('joinRoom', projectId => {
      socket.join(projectId)
    })

    socket.on('userData', userData => {
      connectedUsers[socket.id] = userData
      // Broadcast updated user list to all clients
      io.emit('connectedUsers', Object.values(connectedUsers))
    })

    // Handle receiving a new idea
    socket.on('newIdea', data => {
      const { idea, projectId } = data
      io.to(projectId).emit('newIdea', idea)

      console.log(
        `New idea ${JSON.stringify(
          idea.ideaId
        )} broadcasted to room: ${projectId}`
      )
    })

    socket.on('deleteIdea', data => {
      const { ideaId, projectId } = data
      io.to(projectId).emit('deleteId', ideaId)
    })

    socket.on('deleteManyIdeas', data => {
      const { newIdeas, projectId } = data
      socket.broadcast.to(projectId).emit('deleteManyIdeas', newIdeas)
    })

    // handle firing counter
    socket.on('fireCounter', counterFired => {
      socket.broadcast.emit('counterFired', counterFired)
    })

    socket.on('fireCounterBw', data => {
      const { concernedUser, counterFired } = data
      const socketId = Object.keys(connectedUsers).find(
        id => connectedUsers[id].email === concernedUser.email
      )
      if (socketId) {
        io.to(socketId).emit('counterFiredBw', counterFired)
      }
    })

    // Handle disconnections
    socket.on('disconnect', () => {
      delete connectedUsers[socket.id]
      io.emit('connectedUsers', Object.values(connectedUsers))
      console.log('Client disconnected')
    })
  })
}
