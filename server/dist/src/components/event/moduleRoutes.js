"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moduleControllers_1 = require("./moduleControllers");
const router = express_1.default.Router();
router.get("/getClubs", moduleControllers_1.getMoudules);
exports.default = router;
