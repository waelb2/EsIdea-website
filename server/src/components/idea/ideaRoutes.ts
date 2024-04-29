import express from 'express'
import { deleteIdea, getIdeasByProject, postIdea } from './ideaControllers'
const router = express.Router()

router.get('/get-ideas/:projectId', getIdeasByProject)
router.post('/post-idea', postIdea)
router.delete('/delete-idea/:ideaId', deleteIdea)

export default router
