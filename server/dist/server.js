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
// Load environment variables from .env file
dotenv_1.default.config();
// Configuring the host, port, and database URI
const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DATABASE_URI;
// Create an Express application instance
const app = (0, express_1.default)();
// Create an HTTP server instance
const server = http_1.default.createServer(app);
// Create a Socket.IO server instance
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5174',
        methods: ['GET', 'POST']
    }
});
// Configure middleware
// Configure session middleware
app.use((0, express_session_1.default)({
    secret: 'secret_key',
    resave: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false
}));
// Initialize Passport and session middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Configure CORS middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}));
// Parse request bodies as JSON
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Import routes
const routes_1 = __importDefault(require("./routes"));
const socketManager_1 = __importDefault(require("./src/utils/socketManager"));
// Mount routes
app.use(routes_1.default);
// Initialize Socket.IO
(0, socketManager_1.default)(io);
// Start the server
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        yield (0, db_1.connectDB)(String(process.env.DATABASE_URI));
        console.log('DATABASE CONNECTED');
        // Start listening on the specified port
        server.listen(3000, () => {
            console.log(`Server starting at ${HOST}:${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start();
