import express from "express"
import { getMoudules } from "./moduleControllers"

const router =  express.Router()


router.get("/getClubs", getMoudules)

export default router