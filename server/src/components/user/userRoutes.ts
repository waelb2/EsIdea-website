import { profile } from 'console'
import express, { Request, Response } from 'express'
import { body, checkSchema, validationResult } from 'express-validator'
import mongoose, { isObjectIdOrHexString } from 'mongoose'
import { User, addFavouriteProjectValidationSchema, userIdValidationSchema } from './userModels'
import {
  addFavouriteProject,
  createFeedback,
  createPublicProjectRequest,
  getPublicProjects,
  getUserByEmail,
  getUserById,
  getUserByLastName,
  modifyProfilePicture,
  upload
} from './userControllers'
import { createFeedbackValidationSchema } from '../feedback/feedbackModel'
import { authMiddleWare } from '../auth/authMiddleware'
import { createPublicProjectRequestValidationSchema } from '../publicProjectRequest/publicProjectRequestModel'

const router = express.Router()

router.get('/users', (req: Request, res: Response) => {})

router.patch(
  '/settings/profile/password'
  // Use bahaa's auth forget password handler
)

router.patch(
  '/settings/profile/picture',
  upload.single('profilePic'),
  authMiddleWare,
  (req: Request, res: Response) => modifyProfilePicture(req, res, req.file)
)

router.post(
  '/settings/feedback',
  checkSchema(createFeedbackValidationSchema),
  authMiddleWare,
  createFeedback
)

router.post('/search-user-email', getUserByEmail)
router.post('/search-user-last-name', getUserByLastName)
router.get('/get-user', authMiddleWare, getUserById)

router.post("/publicProjectRequest",
  checkSchema(createPublicProjectRequestValidationSchema),
  authMiddleWare,
  createPublicProjectRequest)

router.patch("/project/favourite", authMiddleWare, addFavouriteProject)

router.get('/publicProjects', getPublicProjects)

export default router