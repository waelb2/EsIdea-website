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

/**
 * Route to update user profile picture.
 */
router.patch(
  '/settings/profile/picture',
  upload.single('profilePic'),
  authMiddleWare,
  (req: Request, res: Response) => modifyProfilePicture(req, res, req.file)
)

/**
 * Route to create user feedback.
 */
router.post(
  '/settings/feedback',
  checkSchema(createFeedbackValidationSchema),
  authMiddleWare,
  createFeedback
)

/**
 * Route to search user by email.
 */
router.post('/search-user-email', getUserByEmail)

/**
 * Route to search user by last name.
 */
router.post('/search-user-last-name', getUserByLastName)

/**
 * Route to get user by ID.
 */
router.get('/get-user', authMiddleWare, getUserById)

/**
 * Route to create public project request.
 */
router.post("/publicProjectRequest",
  checkSchema(createPublicProjectRequestValidationSchema),
  authMiddleWare,
  createPublicProjectRequest)

/**
 * Route to add a project to user's favorites.
 */
router.patch("/project/favourite", authMiddleWare, addFavouriteProject)

/**
 * Route to get public projects.
 */
router.get('/publicProjects', getPublicProjects)

export default router
