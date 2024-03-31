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
exports.ProjectVisibility = exports.ProjectStatus = exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Draft"] = "draft";
    ProjectStatus["InProgress"] = "in_progress";
    ProjectStatus["Completed"] = "completed";
    ProjectStatus["OnHold"] = "on_hold";
    ProjectStatus["Cancelled"] = "cancelled";
    ProjectStatus["UnderReview"] = "under_review";
    ProjectStatus["Approved"] = "approved";
    ProjectStatus["Rejected"] = "rejected";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectVisibility;
(function (ProjectVisibility) {
    ProjectVisibility["PUBLIC"] = "public";
    ProjectVisibility["PRIVATE"] = "private";
})(ProjectVisibility || (exports.ProjectVisibility = ProjectVisibility = {}));
// Topic schema 
const topicSchema = new mongoose_1.Schema({
    topicName: {
        type: String,
        required: [true, "Topic name is required"]
    },
    parentTopic: { type: mongoose_1.default.Types.ObjectId,
        ref: 'Topic' },
});
// project schema 
const projectSchema = new mongoose_1.Schema({
    coordinator: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: [true, "Project coordinator (creator) is required"]
    },
    title: {
        type: String,
        required: [true, "Project title is required"]
    },
    description: {
        type: String,
    },
    template: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Template',
        required: [true, "Project template is required"]
    },
    ideationMethod: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'IdeationMethod',
        required: [true, "Ideation method is required"]
    },
    status: {
        type: String,
        required: [true, "Project status is required"],
        enum: Object.values(ProjectStatus),
        default: ProjectStatus.Draft,
    },
    visibility: {
        type: String,
        required: [true, "Project visibility is required"],
        enum: Object.values(ProjectVisibility),
        default: ProjectVisibility.PRIVATE,
    },
    collaboratorsCount: {
        type: Number,
    },
    collaborators: [{
            member: {
                type: mongoose_1.default.Types.ObjectId,
                ref: 'User',
            },
            joinedAt: Date
        }],
    ideas: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Idea',
        }],
    mainTopic: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Topic',
        required: [true, "Main topic is required"]
    },
    subTopics: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Topic',
        }],
    club: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Club',
    },
    module: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Module',
    },
    event: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Event',
    },
    thumbnailUrl: String
});
const Project = mongoose_1.default.model('Project', projectSchema);
exports.Project = Project;
