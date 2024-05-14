"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const fs_1 = require("fs");
/**
 * Middleware to log incoming requests.
 * Logs the method and path of the incoming request.
 * Appends the request to the 'access.log' file.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the middleware chain.
 */
function loggerMiddleware(req, res, next) {
    console.log(`-------------------------------------
    ${req.method} request made to ${req.path}`);
    // Append the request to the log file
    (0, fs_1.appendFile)('access.log', `${new Date().toISOString()} - ${req.method} ${req.url}\n`, err => {
        if (err) {
            console.error('Error writing to access.log file:', err);
        }
    });
    next();
}
exports.loggerMiddleware = loggerMiddleware;
