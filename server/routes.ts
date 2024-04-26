import express from "express"
import userRoutes from "./src/components/user/userRoutes"
import projectRoutes from "./src/components/project/projectRoutes"
import clubRoutes from "./src/components/club/clubRoutes"
import moduleRoutes from "./src/components/module/moduleRoutes"
import eventRoutes from "./src/components/event/eventRoutes"

const router = express.Router()

router.use("/user", userRoutes)
router.use('/project', projectRoutes)
router.use('/club', clubRoutes)
router.use('/module', moduleRoutes)
router.use('/event', eventRoutes)

export default router 