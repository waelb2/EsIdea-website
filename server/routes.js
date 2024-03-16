"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userRoutes_1 = require("./src/components/user/userRoutes");
var projectRoutes_1 = require("./src/components/project/projectRoutes");
var router = express_1.default.Router();
router.use("/user", userRoutes_1.default);
router.use('/project', projectRoutes_1.default);
exports.default = router;
