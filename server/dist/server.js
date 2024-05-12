"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
require("./src/config/passport-setup");
const db_1 = require("./src/config/db");
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
// Configuring the host
const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DATABASE_URI;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5174',
        methods: ['GET', 'POST']
    }
});
// app config
app.use((0, express_session_1.default)({
    secret: 'secret_key',
    resave: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
/////////////////////////////////////// o auth ///////////////////////////////
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// routes
const routes_1 = __importDefault(require("./routes"));
app.use(routes_1.default);
const connectedUsers = {};
io.on('connection', socket => {
    console.log('New client connected');
    // Handle joining a project room
    socket.on('joinRoom', projectId => {
        socket.join(projectId);
    });
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
    socket.on('deleteIdea', data => {
        const { ideaId, projectId } = data;
        io.to(projectId).emit('deleteId', ideaId);
    });
    socket.on('deleteManyIdeas', data => {
        const { newIdeas, projectId } = data;
        socket.broadcast.to(projectId).emit('deleteManyIdeas', newIdeas);
    });
    // handle firing counter
    socket.on('fireCounter', counterFired => {
        socket.broadcast.emit('counterFired', counterFired);
    });
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
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)(String(process.env.DATABASE_URI));
        console.log('DATABASE CONNECTED');
        server.listen(3000, () => {
            console.log(`Server starting at ${HOST}:${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start();
