"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./src/components/user/userRoutes"));
const projectRoutes_1 = __importDefault(require("./src/components/project/projectRoutes"));
const adminRoutes_1 = __importDefault(require("./src/components/admin/adminRoutes"));
const globalUtils_1 = require("./src/utils/globalUtils");
const router = express_1.default.Router();
router.use(globalUtils_1.loggerMiddleware);
router.use('/user', userRoutes_1.default);
router.use('/project', projectRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
exports.default = router;
