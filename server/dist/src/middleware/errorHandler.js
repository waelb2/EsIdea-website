"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customError_1 = require("../exceptions/customError");
function errorHandler(err, req, res, next) {
    // Log the error to console, this could be configured to be done only in a production environment
    console.error(err);
    // If the error is a known, custom error, handle it that way
    // Otherwise return a generic 500 error
    if (!(err instanceof customError_1.CustomError)) {
        res.status(500).send(JSON.stringify({
            message: 'Server error, please try again later'
        }));
    }
    else {
        const customError = err;
        let response = {
            message: customError.message
        };
        // Check if more info to return
        if (customError.additionalInfo) {
            response.additionalInfo = customError.additionalInfo;
        }
        res.status(customError.status).type('json').send(JSON.stringify(response));
    }
}
exports.errorHandler = errorHandler;
