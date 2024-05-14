import express from 'express'
import { deleteIdea, getIdeasByProject, postIdea } from './ideaControllers'
import { authMiddleWare } from '../auth/authMiddleware'

// Create a router instance
const router = express.Router()

// Route to get ideas by project ID
router.get('/get-ideas/:projectId', getIdeasByProject)

// Route to post an idea
router.post('/post-idea', authMiddleWare, postIdea)

// Route to delete an idea by idea ID
router.delete('/delete-idea/:ideaId', deleteIdea)

// Export the router
export default router
