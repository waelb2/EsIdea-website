"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./src/components/user/userRoutes"));
const projectRoutes_1 = __importDefault(require("./src/components/project/projectRoutes"));
const clubRoutes_1 = __importDefault(require("./src/components/club/clubRoutes"));
const moduleRoutes_1 = __importDefault(require("./src/components/module/moduleRoutes"));
const eventRoutes_1 = __importDefault(require("./src/components/event/eventRoutes"));
const router = express_1.default.Router();
router.use("/user", userRoutes_1.default);
router.use('/project', projectRoutes_1.default);
router.use('/club', clubRoutes_1.default);
router.use('/module', moduleRoutes_1.default);
router.use('/event', eventRoutes_1.default);
exports.default = router;
