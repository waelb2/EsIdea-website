"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ideaControllers_1 = require("./ideaControllers");
const authMiddleware_1 = require("../auth/authMiddleware");
// Create a router instance
const router = express_1.default.Router();
// Route to get ideas by project ID
router.get('/get-ideas/:projectId', ideaControllers_1.getIdeasByProject);
// Route to post an idea
router.post('/post-idea', authMiddleware_1.authMiddleWare, ideaControllers_1.postIdea);
// Route to delete an idea by idea ID
router.delete('/delete-idea/:ideaId', ideaControllers_1.deleteIdea);
// Export the router
exports.default = router;
