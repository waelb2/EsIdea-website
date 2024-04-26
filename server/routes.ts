import express from "express"
import userRoutes from "./src/components/user/userRoutes"
import projectRoutes from "./src/components/project/projectRoutes"
import adminRoutes from "./src/components/admin/adminRoutes"
import { loggerMiddleware } from "./src/utils/globalUtils"

const router = express.Router()

router.use(loggerMiddleware)
router.use('/user', userRoutes)
router.use('/project', projectRoutes)
router.use('/admin', adminRoutes)

export default router