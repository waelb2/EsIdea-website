import express from 'express'
import { getEvents } from './eventControllers'
import { authMiddleWare } from '../auth/authMiddleware'

const router = express.Router()

// Route to get events, protected by authentication middleware
router.get('/getEvents', authMiddleWare, getEvents)

export default router
