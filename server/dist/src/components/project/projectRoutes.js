"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectControllers_1 = require("./projectControllers");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = express_1.default.Router();
// router.post('/create-project', upload.single('projectThumbnail'), createProject)
router.patch('/update-project/:projectId', projectControllers_1.updateProject);
router.delete('/delete-project/:projectId', projectControllers_1.deleteProject);
router.get('/get-all-projects/:userId', projectControllers_1.getProjectByUserId);
exports.default = router;
