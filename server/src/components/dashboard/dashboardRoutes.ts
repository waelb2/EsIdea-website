import express, { Router } from "express"
import { dashboard } from "./dashboardControllers"
import { isLoggedIn } from "../auth/authMiddleware"

const router: Router = express.Router()

// Route to access the dashboard, requires user to be logged in
router.get('/', isLoggedIn, dashboard)

export = router
