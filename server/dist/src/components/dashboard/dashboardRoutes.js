"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const dashboardControllers_1 = require("./dashboardControllers");
const authMiddleware_1 = require("../auth/authMiddleware");
const router = express_1.default.Router();
// Route to access the dashboard, requires user to be logged in
router.get('/', authMiddleware_1.isLoggedIn, dashboardControllers_1.dashboard);
module.exports = router;
