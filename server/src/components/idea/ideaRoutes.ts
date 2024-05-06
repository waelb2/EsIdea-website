import express from 'express'
import { deleteIdea, getIdeasByProject, postIdea } from './ideaControllers'
import { authMiddleWare } from '../auth/authMiddleware'
const router = express.Router()

router.get('/get-ideas/:projectId', getIdeasByProject)
router.post('/post-idea',authMiddleWare, postIdea)
router.delete('/delete-idea/:ideaId', deleteIdea)

export default router
