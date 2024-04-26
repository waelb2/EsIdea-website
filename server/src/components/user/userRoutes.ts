import { profile } from 'console'
import express, { Request, Response } from 'express'
import { body, checkSchema, validationResult } from 'express-validator'
import mongoose, { isObjectIdOrHexString } from 'mongoose'
import { User, userIdValidationSchema } from './userModels'
import {
  createFeedback,
  getUserByEmail,
  getUserByLastName,
  modifyProfilePicture,
  upload
} from './userControllers'
import { createFeedbackValidationSchema } from '../feedback/feedbackModel'

const router = express.Router()

router.get('/users', (req: Request, res: Response) => {})

router.patch(
  '/settings/profile/password'
  // Use bahaa's auth forget password handler
)

router.patch(
  '/settings/profile/picture',
  upload.single('profilePicture'),
  checkSchema(userIdValidationSchema),
  (req: Request, res: Response) => modifyProfilePicture(req, res, req.file)
)

router.post(
  '/settings/feedback',
  checkSchema(createFeedbackValidationSchema),
  createFeedback
)

router.post('/search-user-email', getUserByEmail)
router.post('/search-user-last-name', getUserByLastName)

export default router
