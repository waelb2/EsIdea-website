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
exports.projectAssociation = exports.ProjectVisibility = exports.ProjectStatus = exports.Project = void 0;
// Importing mongoose and Schema from mongoose
const mongoose_1 = __importStar(require("mongoose"));
// Enum for project status
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["InProgress"] = "in_progress";
    ProjectStatus["Completed"] = "completed";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
// Enum for project visibility
var ProjectVisibility;
(function (ProjectVisibility) {
    ProjectVisibility["PUBLIC"] = "public";
    ProjectVisibility["PRIVATE"] = "private";
})(ProjectVisibility || (exports.ProjectVisibility = ProjectVisibility = {}));
// Enum for project associations
var projectAssociation;
(function (projectAssociation) {
    projectAssociation["MODULE"] = "module";
    projectAssociation["CLUB"] = "club";
    projectAssociation["EVENT"] = "event";
})(projectAssociation || (exports.projectAssociation = projectAssociation = {}));
// Defining project schema
const projectSchema = new mongoose_1.Schema({
    // Coordinator of the project
    coordinator: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project coordinator (creator) is required']
    },
    // Title of the project
    title: {
        type: String,
        required: [true, 'Project title is required']
    },
    // Description of the project
    description: {
        type: String
    },
    // Template used for the project
    template: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Template'
    },
    // Ideation method employed for the project
    ideationMethod: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'IdeationMethod',
        required: [true, 'Ideation method is required']
    },
    // Date of project creation
    creationDate: {
        type: mongoose_1.Schema.Types.Date,
        default: () => new Date()
    },
    // Status of the project
    status: {
        type: String,
        required: [true, 'Project status is required'],
        enum: Object.values(ProjectStatus),
        default: ProjectStatus.InProgress
    },
    // Visibility of the project
    visibility: {
        type: String,
        required: [true, 'Project visibility is required'],
        enum: Object.values(ProjectVisibility),
        default: ProjectVisibility.PRIVATE
    },
    // Number of collaborators in the project
    collaboratorsCount: {
        type: Number,
        default: 0
    },
    // List of collaborators with their join dates
    collaborators: [
        {
            member: {
                type: mongoose_1.default.Types.ObjectId,
                ref: 'User'
            },
            joinedAt: Date
        }
    ],
    // List of ideas associated with the project
    ideas: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Idea'
        }
    ],
    // Main topic of the project
    mainTopic: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Main topic is required']
    },
    // Sub-topics of the project
    subTopics: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Topic'
        }
    ],
    // Clubs associated with the project
    clubs: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Club'
        }
    ],
    // Modules associated with the project
    modules: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Module'
        }
    ],
    // Events associated with the project
    events: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Event'
        }
    ],
    // URL of the project thumbnail
    thumbnailUrl: String,
    // Timer setting for the project
    timer: Number
}, { versionKey: 'version' });
// Pre-save hook to validate associations
projectSchema.pre('save', function (next) {
    if (this.clubs.length === 0 &&
        this.modules.length == 0 &&
        this.events.length == 0) {
        const error = new Error('At least one of module, club or event must be provided');
        return next(error);
    }
    next();
});
// Pre-save hook to validate project visibility
projectSchema.pre('save', function (next) {
    if (!Object.values(ProjectVisibility).includes(this.visibility)) {
        const error = new Error(`Project visibility must be either one of these values : ${(ProjectVisibility.PRIVATE, ProjectVisibility.PUBLIC)}`);
        return next(error);
    }
    next();
});
// Creating Project model
const Project = mongoose_1.default.model('Project', projectSchema);
exports.Project = Project;
