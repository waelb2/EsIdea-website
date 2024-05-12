"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
