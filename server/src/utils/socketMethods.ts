import { Socket } from 'socket.io'

interface User {
  lastName: string
  profilePicUrl: string
}

const getSocketByUserName = (
  userName: string,
  connectedUsers: Record<string, User>,
  io: any
) => {
  for (const socketId in connectedUsers) {
    const user = connectedUsers[socketId]
    if (user.lastName === userName) {
      return io.sockets.sockets.get(socketId)
    }
  }
  return null
}

export default getSocketByUserName
