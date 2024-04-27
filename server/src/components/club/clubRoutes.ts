import express from 'express'
import { getClubs } from './clubControllers'
import { authMiddleWare } from '../auth/authMiddleware'

const router = express.Router()

router.get('/getClubs', authMiddleWare, getClubs)

export default router
