import express from "express";
import { body, checkSchema } from "express-validator";
import { approvePublicProjectRequest, banUser, createFeedback, createPublicProjectRequest, createTag, deleteTag, deleteUser, forceUnbanUser, getFeedbacks, getPublicProjectRequests, getStats, getTags, getUsers, modifyTag, replyFeedback, unbanUser } from "./adminControllers";
import { feedbackReplyValidationSchema, publicProjectRequestApproveValidationSchema, tagTypeIdValidationSchema, tagTypeValidationSchema, userBanValidationSchema, userIdValidationSchema } from "./adminValidationSchemas";

const router = express.Router();

router.get("/admin/stats", getStats);

router.get("/admin/users", getUsers);

router.delete("/admin/users", checkSchema(userIdValidationSchema), deleteUser);

router.patch("/admin/users/ban", checkSchema(userBanValidationSchema), banUser);

router.patch("/admin/users/unban", checkSchema(userIdValidationSchema), unbanUser);

router.patch("/admin/users/forceUnban", checkSchema(userIdValidationSchema), forceUnbanUser);

router.get("/admin/tags", checkSchema(tagTypeValidationSchema), getTags);

router.post("/admin/tags", checkSchema(tagTypeValidationSchema), createTag);

router.delete("/admin/tags", checkSchema(tagTypeIdValidationSchema), deleteTag);

router.patch("/admin/tags", checkSchema(tagTypeIdValidationSchema), modifyTag);

router.get("/admin/feedbacks", getFeedbacks);

router.post("/admin/feedbacks", createFeedback);

router.patch("/admin/feedbacks/reply", checkSchema(feedbackReplyValidationSchema), replyFeedback);

router.get("/admin/publicProjectRequest", getPublicProjectRequests);

router.post("/admin/publicProjectRequest", createPublicProjectRequest);

router.patch("/admin/publicProjectRequest/approve", checkSchema(publicProjectRequestApproveValidationSchema), approvePublicProjectRequest);

export default router;