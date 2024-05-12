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
dotenv.config()

// Configuring the host
const HOST = process.env.HOST
const PORT = process.env.PORT || 3000
const DB_URI = process.env.DATABASE_URI

const app: Express = express()

const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: ['GET', 'POST']
  }
})

// app config

app.use(
  session({
    secret: 'secret_key',
    resave: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())

/////////////////////////////////////// o auth ///////////////////////////////
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// routes
import routes from './routes'

app.use(routes)

interface ConnectedUsers {
  [key: string]: { profilePicUrl: string; email: string; lastName: string }
}

const connectedUsers: ConnectedUsers = {}
io.on('connection', socket => {
  console.log('New client connected')

  // Handle joining a project room
  socket.on('joinRoom', projectId => {
    socket.join(projectId)
    console.log(`User joined project: ${projectId}`)
    console.log(connectedUsers)
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
    console.log(newIdeas)
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

const start = async () => {
  try {
    await connectDB(String(process.env.DATABASE_URI))
    console.log('DATABASE CONNECTED')
    server.listen(3000, () => {
      console.log(`Server starting at ${HOST}:${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
