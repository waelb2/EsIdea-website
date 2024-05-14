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
exports.Idea = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema for the Idea model
const ideaSchema = new mongoose_1.Schema({
    // The user who created the idea
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The project to which the idea belongs
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    // The content of the idea
    content: {
        type: String,
        required: true
    },
    // The date when the idea was created (defaults to current date)
    creationDate: {
        type: Date,
        default: Date.now()
    },
    // The topic associated with the idea
    topic: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    // Comments on the idea
    comments: [
        {
            // The content of the comment
            content: String,
            // The author of the comment
            author: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    // Number of votes received by the idea
    votes: {
        type: Number,
        default: 0
    },
    // Whether the idea text is bold
    isBold: Boolean,
    // Whether the idea text is italicized
    isItalic: Boolean,
    // The color of the idea text
    color: String
});
// Create the Idea model
const Idea = mongoose_1.default.model('Idea', ideaSchema);
exports.Idea = Idea;
