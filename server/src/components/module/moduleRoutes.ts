import express from 'express'
import { getModules } from './moduleControllers'
import { authMiddleWare } from '../auth/authMiddleware'

const router = express.Router()

router.get('/getModules', authMiddleWare, getModules)

export default router
