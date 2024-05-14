"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Initializes socket connections.
 * @param io The Socket.IO server instance.
 */
function initializeSocket(io) {
    const connectedUsers = {};
    io.on('connection', (socket) => {
        console.log('New client connected');
        // Handle joining a project room
        socket.on('joinRoom', projectId => {
            socket.join(projectId);
        });
        // Handle receiving user data
        socket.on('userData', userData => {
            connectedUsers[socket.id] = userData;
            // Broadcast updated user list to all clients
            io.emit('connectedUsers', Object.values(connectedUsers));
        });
        // Handle receiving a new idea
        socket.on('newIdea', data => {
            const { idea, projectId } = data;
            io.to(projectId).emit('newIdea', idea);
            console.log(`New idea ${JSON.stringify(idea.ideaId)} broadcasted to room: ${projectId}`);
        });
        // Handle deleting an idea
        socket.on('deleteIdea', data => {
            const { ideaId, projectId } = data;
            io.to(projectId).emit('deleteId', ideaId);
        });
        // Handle deleting multiple ideas
        socket.on('deleteManyIdeas', data => {
            const { newIdeas, projectId } = data;
            socket.broadcast.to(projectId).emit('deleteManyIdeas', newIdeas);
        });
        // Handle firing counter
        socket.on('fireCounter', counterFired => {
            socket.broadcast.emit('counterFired', counterFired);
        });
        // Handle firing counter between users
        socket.on('fireCounterBw', data => {
            const { concernedUser, counterFired } = data;
            const socketId = Object.keys(connectedUsers).find(id => connectedUsers[id].email === concernedUser.email);
            if (socketId) {
                io.to(socketId).emit('counterFiredBw', counterFired);
            }
        });
        // Handle disconnections
        socket.on('disconnect', () => {
            delete connectedUsers[socket.id];
            io.emit('connectedUsers', Object.values(connectedUsers));
            console.log('Client disconnected');
        });
    });
}
exports.default = initializeSocket;
