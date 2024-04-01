"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
var mongoose_1 = require("mongoose");
var connectDB = function (uri) {
    return mongoose_1.default.connect(uri);
};
exports.connectDB = connectDB;
