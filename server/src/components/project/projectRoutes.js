"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var projectControllers_1 = require("./projectControllers");
var router = express_1.default.Router();
router.post('/create-project', projectControllers_1.createProject);
exports.default = router;
