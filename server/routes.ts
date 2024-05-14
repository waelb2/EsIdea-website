import express from 'express'
// Importing routes for different components of the application
import userRoutes from './src/components/user/userRoutes'
import authRoutes from './src/components/auth/authRoutes'
import dashboardRoutes from './src/components/dashboard/dashboardRoutes'
import projectRoutes from './src/components/project/projectRoutes'
import homeRoutes from './src/components/home/homeRoutes'
import invitationRoutes from './src/components/invitation/invitationRoutes'
import clubRoutes from './src/components/club/clubRoutes'
import moduleRoutes from './src/components/module/moduleRoutes'
import eventRoutes from './src/components/event/eventRoutes'
import ideaRoutes from './src/components/idea/ideaRoutes'
import adminRoutes from "./src/components/admin/adminRoutes"
// Importing the logger middleware to log requests
import { loggerMiddleware } from "./src/utils/globalUtils"

// Creating an Express router instance
const router = express.Router()

// Applying the logger middleware to log requests
router.use(loggerMiddleware)

// Defining routes for various components
router.use('/user', userRoutes)
router.use('/home', homeRoutes)
router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/project', projectRoutes)
router.use('/invitation', invitationRoutes)
router.use('/club', clubRoutes)
router.use('/module', moduleRoutes)
router.use('/event', eventRoutes)
router.use('/idea', ideaRoutes)
router.use('/admin', adminRoutes)

// Exporting the router for use in the application
export default router
