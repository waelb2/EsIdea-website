"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Retrieves the socket corresponding to the given user name.
 * @param userName The last name of the user.
 * @param connectedUsers The record of connected users.
 * @param io The Socket.IO server instance.
 * @returns The socket corresponding to the user name, or null if not found.
 */
const getSocketByUserName = (userName, connectedUsers, io) => {
    for (const socketId in connectedUsers) {
        const user = connectedUsers[socketId];
        if (user.lastName === userName) {
            return io.sockets.sockets.get(socketId);
        }
    }
    return null;
};
exports.default = getSocketByUserName;
