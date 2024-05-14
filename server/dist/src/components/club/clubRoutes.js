"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clubControllers_1 = require("./clubControllers");
const authMiddleware_1 = require("../auth/authMiddleware");
const router = express_1.default.Router();
// Route to get clubs, protected by authentication middleware
router.get('/getClubs', authMiddleware_1.authMiddleWare, clubControllers_1.getClubs);
exports.default = router;
