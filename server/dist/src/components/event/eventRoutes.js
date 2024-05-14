"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventControllers_1 = require("./eventControllers");
const authMiddleware_1 = require("../auth/authMiddleware");
const router = express_1.default.Router();
// Route to get events, protected by authentication middleware
router.get('/getEvents', authMiddleware_1.authMiddleWare, eventControllers_1.getEvents);
exports.default = router;
