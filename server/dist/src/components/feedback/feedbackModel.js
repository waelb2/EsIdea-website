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
exports.createFeedbackValidationSchema = exports.feedback = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const feedbackSchema = new mongoose_1.Schema({
    created_by: {
        firstName: {
            type: String,
            required: [true, 'First name is required']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required']
        },
        profilePicUrl: {
            type: String
        }
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: [true, 'feedback creation date is required']
    }
});
const feedback = mongoose_1.default.model('feedback', feedbackSchema);
exports.feedback = feedback;
const createFeedbackValidationSchema = {
    title: {
        isString: {
            errorMessage: "The title of the feedback must be a string"
        },
        notEmpty: {
            errorMessage: "Must provide the title of feedback"
        }
    },
    description: {
        isString: {
            errorMessage: "The feedback must be a string"
        },
        notEmpty: {
            errorMessage: "Must provide the feedback of the user"
        }
    }
};
exports.createFeedbackValidationSchema = createFeedbackValidationSchema;
