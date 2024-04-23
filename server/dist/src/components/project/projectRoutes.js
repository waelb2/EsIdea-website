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
router.post('/create-project', upload.single('projectThumbnail'), projectControllers_1.createProject);
router.post('/update-project/:projectId', projectControllers_1.updateProject);
router.post('/delete-project/:projectId', projectControllers_1.deleteProject);
exports.default = router;
