"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moduleControllers_1 = require("./moduleControllers");
const authMiddleware_1 = require("../auth/authMiddleware");
const router = express_1.default.Router();
router.get('/getModules', authMiddleware_1.authMiddleWare, moduleControllers_1.getModules);
exports.default = router;
