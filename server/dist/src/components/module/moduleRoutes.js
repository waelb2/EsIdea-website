"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the express module
const express_1 = __importDefault(require("express"));
// Importing the getModules function from moduleControllers
const moduleControllers_1 = require("./moduleControllers");
// Importing the authMiddleWare function from authMiddleware
const authMiddleware_1 = require("../auth/authMiddleware");
// Creating an instance of express router
const router = express_1.default.Router();
// Defining a route for handling GET requests to '/getModules' endpoint,
// applying the authMiddleWare middleware for authentication,
// and using the getModules controller function
router.get('/getModules', authMiddleware_1.authMiddleWare, moduleControllers_1.getModules);
// Exporting the router to make it available for other modules
exports.default = router;
