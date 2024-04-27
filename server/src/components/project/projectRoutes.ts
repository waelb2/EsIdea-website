import express from 'express'
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectByUserId
} from './projectControllers'

import multer from 'multer'
import { authMiddleWare } from '../auth/authMiddleware'

const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.post('/create-project', upload.single('projectThumbnail'), createProject)
router.patch('/update-project/:projectId', updateProject)
router.delete('/delete-project/:projectId', deleteProject)
router.get('/get-all-projects/:userId', authMiddleWare, getProjectByUserId)

export default router
