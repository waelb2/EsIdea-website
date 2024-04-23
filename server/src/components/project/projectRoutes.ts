import express from 'express'
import {
  createProject,
  updateProject,
  deleteProject
} from './projectControllers'

import multer from 'multer'

const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.post('/create-project', upload.single('projectThumbnail'), createProject)
router.post('/update-project/:projectId', updateProject)
router.post('/delete-project/:projectId', deleteProject)

export default router
