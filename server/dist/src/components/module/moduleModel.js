"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
// Importing mongoose and necessary types
const mongoose_1 = __importStar(require("mongoose"));
// Defining the module schema using Mongoose's Schema class
const moduleSchema = new mongoose_1.Schema({
    // Defining moduleName field with type String and required constraint
    moduleName: {
        type: String,
        required: [true, 'Module name is required']
    },
    // Defining description field with sub-fields
    description: {
        title: String, // Title of the module description
        field: String, // Field of study the module belongs to
        credit: mongoose_1.default.Schema.Types.Number, // Number of credits associated with the module
        coef: mongoose_1.default.Schema.Types.Number, // Coefficient of the module
        edition: String, // Edition of the module
        courseHours: String, // Total course hours of the module
        tdHours: String, // Total tutorial hours of the module
        tpHours: String // Total practical hours of the module
    }
});
// Creating and exporting the Module model based on the defined schema
exports.Module = mongoose_1.default.model('Module', moduleSchema);
