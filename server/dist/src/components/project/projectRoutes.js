"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectControllers_1 = require("./projectControllers");
const router = express_1.default.Router();
router.post('/create-project', projectControllers_1.createProject);
exports.default = router;
