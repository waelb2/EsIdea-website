"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Importing routes for different components of the application
const userRoutes_1 = __importDefault(require("./src/components/user/userRoutes"));
const authRoutes_1 = __importDefault(require("./src/components/auth/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./src/components/dashboard/dashboardRoutes"));
const projectRoutes_1 = __importDefault(require("./src/components/project/projectRoutes"));
const homeRoutes_1 = __importDefault(require("./src/components/home/homeRoutes"));
const invitationRoutes_1 = __importDefault(require("./src/components/invitation/invitationRoutes"));
const clubRoutes_1 = __importDefault(require("./src/components/club/clubRoutes"));
const moduleRoutes_1 = __importDefault(require("./src/components/module/moduleRoutes"));
const eventRoutes_1 = __importDefault(require("./src/components/event/eventRoutes"));
const ideaRoutes_1 = __importDefault(require("./src/components/idea/ideaRoutes"));
const adminRoutes_1 = __importDefault(require("./src/components/admin/adminRoutes"));
// Importing the logger middleware to log requests
const globalUtils_1 = require("./src/utils/globalUtils");
// Creating an Express router instance
const router = express_1.default.Router();
// Applying the logger middleware to log requests
router.use(globalUtils_1.loggerMiddleware);
// Defining routes for various components
router.use('/user', userRoutes_1.default);
router.use('/home', homeRoutes_1.default);
router.use('/auth', authRoutes_1.default);
router.use('/dashboard', dashboardRoutes_1.default);
router.use('/project', projectRoutes_1.default);
router.use('/invitation', invitationRoutes_1.default);
router.use('/club', clubRoutes_1.default);
router.use('/module', moduleRoutes_1.default);
router.use('/event', eventRoutes_1.default);
router.use('/idea', ideaRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
// Exporting the router for use in the application
exports.default = router;
