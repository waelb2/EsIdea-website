import express from "express"
import { getEvents } from "./eventControllers"

const router =  express.Router()


router.get("/getClubs", getEvents)

export default router