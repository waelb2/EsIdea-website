"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const fs_1 = require("fs");
function loggerMiddleware(req, res, next) {
    console.log(`-------------------------------------
      ${req.method} request made to ${req.path}`);
    // Rajouter la requete dans le fichier log
    (0, fs_1.appendFile)('access.log', `${new Date().toISOString()} - ${req.method} ${req.url}\n`, err => {
        if (err) {
            console.error('Error writing to access.log file:', err);
        }
    });
    next();
}
exports.loggerMiddleware = loggerMiddleware;
