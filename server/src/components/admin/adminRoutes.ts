import express from "express"
import { checkSchema } from "express-validator"
import { 
    approvePublicProjectRequest, 
    banUser, 
    createTag, 
    deleteLogs, 
    deleteTag, 
    deleteUser, 
    forceUnbanUser, 
    getFeedbacks, 
    getLogs, 
    getPublicProjectRequests, 
    getStats, 
    getTags, 
    getUsers, 
    modifyTag, 
    unbanUser 
} from "./adminControllers" // Importing controller functions
import { 
    feedbackReplyValidationSchema, 
    publicProjectRequestApproveValidationSchema, 
    tagTypeIdValidationSchema, 
    tagTypeValidationSchema, 
    userBanValidationSchema, 
    userIdValidationSchema 
} from "./adminInterface" // Importing validation schemas

const router = express.Router()

router.get("/stats", getStats)

router.get("/users", getUsers)

router.delete("/users", checkSchema(userIdValidationSchema), deleteUser)

router.patch("/users/ban", checkSchema(userBanValidationSchema), banUser)

router.patch("/users/unban", checkSchema(userIdValidationSchema), unbanUser)

router.patch("/users/forceUnban", checkSchema(userIdValidationSchema), forceUnbanUser)

router.get("/tags", checkSchema(tagTypeValidationSchema), getTags)

router.post("/tags", checkSchema(tagTypeValidationSchema), createTag)

router.delete("/tags", checkSchema(tagTypeIdValidationSchema), deleteTag)

router.patch("/tags", checkSchema(tagTypeIdValidationSchema), modifyTag)

router.get("/feedbacks", getFeedbacks)

router.get("/publicProjectRequest", getPublicProjectRequests)

router.patch("/publicProjectRequest/approve", checkSchema(publicProjectRequestApproveValidationSchema), approvePublicProjectRequest)

router.get("/logs", getLogs)

router.delete("/logs", deleteLogs)

export default router // Exporting router for use in routes file