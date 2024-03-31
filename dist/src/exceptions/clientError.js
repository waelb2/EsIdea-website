"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientError = void 0;
const customError_1 = require("./customError");
class ClientError extends customError_1.CustomError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ClientError = ClientError;
