import express, { Express } from 'express'
import dotenv from 'dotenv'
import passport from 'passport'
import './src/config/passport-setup'
import { connectDB } from './src/config/db'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
// Load environment variables from .env file
dotenv.config()

// Configuring the host, port, and database URI
const HOST = process.env.HOST
const PORT = process.env.PORT || 3000
const DB_URI = process.env.DATABASE_URI

// Create an Express application instance
const app: Express = express()

// Create an HTTP server instance
const server = http.createServer(app)

// Create a Socket.IO server instance
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: ['GET', 'POST']
  }
})

// Configure middleware

// Configure session middleware
app.use(
  session({
    secret: 'secret_key',
    resave: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false
  })
)

// Initialize Passport and session middleware
app.use(passport.initialize())
app.use(passport.session())

// Configure CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
  })
)

// Parse request bodies as JSON
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Import routes
import routes from './routes'
import initializeSocket from './src/utils/socketManager'

// Mount routes
app.use(routes)

// Initialize Socket.IO
initializeSocket(io)

// Start the server
const start = async () => {
  try {
    // Connect to the database
    await connectDB(String(process.env.DATABASE_URI))
    console.log('DATABASE CONNECTED')
    // Start listening on the specified port
    server.listen(3000, () => {
      console.log(`Server starting at ${HOST}:${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
