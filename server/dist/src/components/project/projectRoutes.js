"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectControllers_1 = require("./projectControllers");
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = require("../auth/authMiddleware");
// Multer configuration for file uploads
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Creating an instance of express Router
const router = express_1.default.Router();
// Routes for project operations
router.post('/create-project', upload.single('projectThumbnail'), authMiddleware_1.authMiddleWare, projectControllers_1.createProject);
router.patch('/update-project/:projectId', upload.single('thumbnailUrl'), authMiddleware_1.authMiddleWare, projectControllers_1.updateProject);
router.patch('/update-project-status/:projectId', authMiddleware_1.authMiddleWare, projectControllers_1.updateProjectStatus);
router.delete('/delete-project/:projectId', authMiddleware_1.authMiddleWare, projectControllers_1.deleteProject);
router.get('/get-all-projects', authMiddleware_1.authMiddleWare, projectControllers_1.getProjectByUserId);
router.delete('/trash-project/:projectId', authMiddleware_1.authMiddleWare, projectControllers_1.trashProject);
router.post('/restore-project/', authMiddleware_1.authMiddleWare, projectControllers_1.restoreProject);
router.delete('/:projectId/ideas', projectControllers_1.deleteProjectManyIdeas);
// Exporting the router
exports.default = router;
