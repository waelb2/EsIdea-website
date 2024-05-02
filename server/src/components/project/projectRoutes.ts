import express from 'express'
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectByUserId,
  trashProject,
  restoreProject
} from './projectControllers'

import multer from 'multer'
import { authMiddleWare } from '../auth/authMiddleware'

const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.post(
  '/create-project',
  upload.single('projectThumbnail'),
  authMiddleWare,
  createProject
)
router.patch('/update-project/:projectId',authMiddleWare, updateProject)
router.delete('/delete-project/:projectId', deleteProject)
router.get('/get-all-projects/:userId', authMiddleWare, getProjectByUserId)
router.delete('/trash-project/:projectId', authMiddleWare, trashProject)
router.post('/restore-project/', restoreProject)

export default router
