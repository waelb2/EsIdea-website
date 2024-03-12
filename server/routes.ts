import express from "express"
import userRoutes from "./src/components/user/userRoutes"
import projectRoutes from "./src/components/project/projectRoutes"

const router = express.Router()

router.use("/user", userRoutes)
router.use('/project',projectRoutes)

export default router 