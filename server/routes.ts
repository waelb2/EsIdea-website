import express from "express"
import userRoutes from "./src/user/userRoutes"

const router = express.Router()

router.use("/user", userRoutes)

export default router 