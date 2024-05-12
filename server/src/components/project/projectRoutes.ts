import express from 'express'
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectByUserId,
  trashProject,
  restoreProject,
  deleteProjectManyIdeas,
  updateProjectStatus
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

router.patch('/update-project/:projectId',upload.single('thumbnailUrl') ,authMiddleWare, updateProject)
router.patch('/update-project-status/:projectId',authMiddleWare, updateProjectStatus)
router.delete('/delete-project/:projectId', authMiddleWare, deleteProject)
router.get('/get-all-projects', authMiddleWare, getProjectByUserId)
router.delete('/trash-project/:projectId', authMiddleWare, trashProject)
router.post('/restore-project/', authMiddleWare, restoreProject)
router.delete('/:projectId/ideas', deleteProjectManyIdeas)

export default router
