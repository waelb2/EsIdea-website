// Importing the express module
import express from 'express'
// Importing the getModules function from moduleControllers
import { getModules } from './moduleControllers'
// Importing the authMiddleWare function from authMiddleware
import { authMiddleWare } from '../auth/authMiddleware'

// Creating an instance of express router
const router = express.Router()

// Defining a route for handling GET requests to '/getModules' endpoint,
// applying the authMiddleWare middleware for authentication,
// and using the getModules controller function
router.get('/getModules', authMiddleWare, getModules)

// Exporting the router to make it available for other modules
export default router
