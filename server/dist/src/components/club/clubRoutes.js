"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clubControllers_1 = require("./clubControllers");
const router = express_1.default.Router();
router.get("/getClubs", clubControllers_1.getClubs);
exports.default = router;
