"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
// Create a router instance
const router = express_1.default.Router();
// Define a route to handle GET requests to '/profile'
router.get('/profile', (req, res) => {
    // Send back the query parameters received in the request
    res.send(req.query);
});
module.exports = router;
