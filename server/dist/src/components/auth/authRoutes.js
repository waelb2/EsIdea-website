"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const authController_1 = require("./authController");
const router = express_1.default.Router();
router.get('/google', authController_1.authenticate);
router.get('/logout', authController_1.logout);
router.get('/google/callback', authController_1.authenticateCallback, (req, res) => {
    res.redirect('/dashboard/profile');
});
router.get('/', authController_1.auth);
router.get('/login', authController_1.login_get);
router.post('/login', authController_1.login_post);
module.exports = router;
