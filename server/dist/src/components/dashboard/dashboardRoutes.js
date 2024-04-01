"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const dashboardControllers_1 = require("./dashboardControllers");
const router = express_1.default.Router();
router.get('/profile', dashboardControllers_1.isLoggedIn, dashboardControllers_1.profile);
module.exports = router;
