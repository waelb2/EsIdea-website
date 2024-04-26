import express from "express"
import { getClubs } from "./clubControllers"

const router =  express.Router()


router.get("/getClubs", getClubs)

export default router