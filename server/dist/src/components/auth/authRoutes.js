"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const authController_1 = require("./authController");
const authMiddleware_1 = require("./authMiddleware");
const userModels_1 = require("../user/userModels");
const router = express_1.default.Router();
//////////////////////////////// oauth /////////////////////////////////
router.get('/google', authController_1.authenticate);
router.get('/logout', authController_1.logout);
router.get('/failure', authController_1.failure);
router.get('/google/callback', authController_1.authenticateCallback);
//////////////////////////////// oauth /////////////////////////////////
// localhost:3000/auth/google 
//////////////////////////////// login ///////////////////////////////
router.get("/", authController_1.auth);
router.get('/login', authMiddleware_1.verifyToken, (0, authMiddleware_1.authorize)([userModels_1.UserRole.ADMIN]), authController_1.login_get);
router.post('/login', authController_1.login_post);
router.post('/addPassword', authController_1.addPassword);
router.post('/updatePassword', authController_1.updatePassword);
router.patch('/resetPassword/:token', authController_1.resetPassword);
router.post('/forgetPassword', authController_1.forgetPassword);
module.exports = router;
