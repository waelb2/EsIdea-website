import express from "express"
import userRoutes from "./src/components/user/userRoutes"
import projectRoutes from "./src/components/project/projectRoutes"
import adminRoutes from "./src/components/admin/adminRoutes"
import { loggerMiddleware } from "./src/components/admin/adminMethods"

const router = express.Router()

router.use(loggerMiddleware);
router.use(userRoutes);
router.use(projectRoutes);
router.use(adminRoutes);

export default router 