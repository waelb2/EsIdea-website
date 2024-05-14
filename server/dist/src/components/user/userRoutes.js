"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const userControllers_1 = require("./userControllers");
const feedbackModel_1 = require("../feedback/feedbackModel");
const authMiddleware_1 = require("../auth/authMiddleware");
const publicProjectRequestModel_1 = require("../publicProjectRequest/publicProjectRequestModel");
const router = express_1.default.Router();
/**
 * Route to update user profile picture.
 */
router.patch('/settings/profile/picture', userControllers_1.upload.single('profilePic'), authMiddleware_1.authMiddleWare, (req, res) => (0, userControllers_1.modifyProfilePicture)(req, res, req.file));
/**
 * Route to create user feedback.
 */
router.post('/settings/feedback', (0, express_validator_1.checkSchema)(feedbackModel_1.createFeedbackValidationSchema), authMiddleware_1.authMiddleWare, userControllers_1.createFeedback);
/**
 * Route to search user by email.
 */
router.post('/search-user-email', userControllers_1.getUserByEmail);
/**
 * Route to search user by last name.
 */
router.post('/search-user-last-name', userControllers_1.getUserByLastName);
/**
 * Route to get user by ID.
 */
router.get('/get-user', authMiddleware_1.authMiddleWare, userControllers_1.getUserById);
/**
 * Route to create public project request.
 */
router.post("/publicProjectRequest", (0, express_validator_1.checkSchema)(publicProjectRequestModel_1.createPublicProjectRequestValidationSchema), authMiddleware_1.authMiddleWare, userControllers_1.createPublicProjectRequest);
/**
 * Route to add a project to user's favorites.
 */
router.patch("/project/favourite", authMiddleware_1.authMiddleWare, userControllers_1.addFavouriteProject);
/**
 * Route to get public projects.
 */
router.get('/publicProjects', userControllers_1.getPublicProjects);
exports.default = router;
