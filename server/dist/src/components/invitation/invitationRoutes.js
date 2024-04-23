"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invitationControllers_1 = require("./invitationControllers");
const router = express_1.default.Router();
router.post('/accept', invitationControllers_1.acceptInvitation);
exports.default = router;
