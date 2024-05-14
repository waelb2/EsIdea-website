"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the express module
const express_1 = __importDefault(require("express"));
// Importing the acceptInvitation function from invitationControllers module
const invitationControllers_1 = require("./invitationControllers");
// Creating an instance of express router
const router = express_1.default.Router();
// Defining a route for handling POST requests to '/accept' endpoint, using the acceptInvitation controller function
router.post('/accept', invitationControllers_1.acceptInvitation);
// Exporting the router to make it available for other modules
exports.default = router;
