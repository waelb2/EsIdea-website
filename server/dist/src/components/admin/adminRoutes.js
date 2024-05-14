"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const adminControllers_1 = require("./adminControllers"); // Importing controller functions
const adminInterface_1 = require("./adminInterface"); // Importing validation schemas
const router = express_1.default.Router();
router.get("/stats", adminControllers_1.getStats);
router.get("/users", adminControllers_1.getUsers);
router.delete("/users", (0, express_validator_1.checkSchema)(adminInterface_1.userIdValidationSchema), adminControllers_1.deleteUser);
router.patch("/users/ban", (0, express_validator_1.checkSchema)(adminInterface_1.userBanValidationSchema), adminControllers_1.banUser);
router.patch("/users/unban", (0, express_validator_1.checkSchema)(adminInterface_1.userIdValidationSchema), adminControllers_1.unbanUser);
router.patch("/users/forceUnban", (0, express_validator_1.checkSchema)(adminInterface_1.userIdValidationSchema), adminControllers_1.forceUnbanUser);
router.get("/tags", (0, express_validator_1.checkSchema)(adminInterface_1.tagTypeValidationSchema), adminControllers_1.getTags);
router.post("/tags", (0, express_validator_1.checkSchema)(adminInterface_1.tagTypeValidationSchema), adminControllers_1.createTag);
router.delete("/tags", (0, express_validator_1.checkSchema)(adminInterface_1.tagTypeIdValidationSchema), adminControllers_1.deleteTag);
router.patch("/tags", (0, express_validator_1.checkSchema)(adminInterface_1.tagTypeIdValidationSchema), adminControllers_1.modifyTag);
router.get("/feedbacks", adminControllers_1.getFeedbacks);
router.get("/publicProjectRequest", adminControllers_1.getPublicProjectRequests);
router.patch("/publicProjectRequest/approve", (0, express_validator_1.checkSchema)(adminInterface_1.publicProjectRequestApproveValidationSchema), adminControllers_1.approvePublicProjectRequest);
router.get("/logs", adminControllers_1.getLogs);
router.delete("/logs", adminControllers_1.deleteLogs);
exports.default = router; // Exporting router for use in routes file
