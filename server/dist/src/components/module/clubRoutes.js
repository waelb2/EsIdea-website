"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const userModels_1 = require("./userModels");
const userControllers_1 = require("./userControllers");
const feedbackModel_1 = require("../feedback/feedbackModel");
const router = express_1.default.Router();
router.get("/users", (req, res) => { });
router.patch("/settings/profile/password");
router.patch("/settings/profile/picture", userControllers_1.upload.single('profilePicture'), (0, express_validator_1.checkSchema)(userModels_1.userIdValidationSchema), (req, res) => (0, userControllers_1.modifyProfilePicture)(req, res, req.file));
router.post("/settings/feedback", (0, express_validator_1.checkSchema)(feedbackModel_1.createFeedbackValidationSchema), userControllers_1.createFeedback);
exports.default = router;
