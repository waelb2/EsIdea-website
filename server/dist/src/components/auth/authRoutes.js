"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express")); // Importing express and Router from express library
const authController_1 = require("./authController"); // Importing controller functions
const router = express_1.default.Router(); // Creating a new router instance
// Routes for Google authentication
router.get('/google', authController_1.authenticate); // Route to initiate Google authentication
router.get('/logout', authController_1.logout); // Route to logout user
router.get('/failure', authController_1.failure); // Route for authentication failure
router.get('/google/callback', authController_1.authenticateCallback); // Route for Google authentication callback
// Additional routes
router.get("/", authController_1.auth); // Route for authentication
router.get('/login', authController_1.login_get); // Route to render login form
router.post('/login', authController_1.login_post); // Route to handle login
router.post('/addPassword', authController_1.addPassword); // Route to add password
router.post('/updatePassword', authController_1.updatePassword); // Route to update password
router.patch('/resetPassword/:token', authController_1.resetPassword); // Route to reset password
router.post('/forgetPassword', authController_1.forgetPassword); // Route to handle forgot password
module.exports = router;
