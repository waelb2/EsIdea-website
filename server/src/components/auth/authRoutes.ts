import express, { Router } from "express" // Importing express and Router from express library
import { 
  login_get, 
  login_post, 
  auth, 
  authenticate, 
  authenticateCallback, 
  failure, 
  logout, 
  addPassword, 
  updatePassword, 
  forgetPassword, 
  resetPassword 
} from "./authController" // Importing controller functions

const router: Router = express.Router() // Creating a new router instance

// Routes for Google authentication
router.get('/google', authenticate) // Route to initiate Google authentication
router.get('/logout', logout) // Route to logout user
router.get('/failure', failure) // Route for authentication failure
router.get('/google/callback', authenticateCallback) // Route for Google authentication callback

// Additional routes
router.get("/", auth) // Route for authentication
router.get('/login', login_get) // Route to render login form
router.post('/login', login_post) // Route to handle login
router.post('/addPassword', addPassword) // Route to add password
router.post('/updatePassword', updatePassword) // Route to update password
router.patch('/resetPassword/:token', resetPassword) // Route to reset password
router.post('/forgetPassword', forgetPassword) // Route to handle forgot password

export = router // Exporting router