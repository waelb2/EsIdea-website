import express from 'express'
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectByUserId,
  trashProject,
  restoreProject,
  deleteProjectManyIdeas,
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

router.patch(
  '/update-project/:projectId', 
  upload.single('thumbnailUrl'),
  authMiddleWare, 
  updateProject
)

router.delete('/delete-project/:projectId', authMiddleWare, deleteProject)

router.get('/get-all-projects', authMiddleWare, getProjectByUserId)

router.delete('/trash-project/:projectId', authMiddleWare, trashProject)
<<<<<<< HEAD
router.post('/restore-project/', restoreProject)
router.delete('/:projectId/ideas', deleteProjectManyIdeas )
=======

router.post('/restore-project/', authMiddleWare, restoreProject)
>>>>>>> 2fc1cd1516f8c0502478abdf548f86e1be08ed67

export default router
