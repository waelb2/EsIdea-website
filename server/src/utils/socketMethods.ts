import { Socket } from 'socket.io'

/**
 * Interface representing the structure of a user.
 */
interface User {
  lastName: string
  profilePicUrl: string
}

/**
 * Retrieves the socket corresponding to the given user name.
 * @param userName The last name of the user.
 * @param connectedUsers The record of connected users.
 * @param io The Socket.IO server instance.
 * @returns The socket corresponding to the user name, or null if not found.
 */
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
