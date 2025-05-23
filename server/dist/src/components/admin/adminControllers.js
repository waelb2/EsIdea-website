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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLogs = exports.getLogs = exports.approvePublicProjectRequest = exports.getPublicProjectRequests = exports.getFeedbacks = exports.modifyTag = exports.deleteTag = exports.createTag = exports.getTags = exports.forceUnbanUser = exports.unbanUser = exports.banUser = exports.deleteUser = exports.getUsers = exports.getStats = void 0;
const userModels_1 = require("../user/userModels");
const projectModels_1 = require("../project/projectModels");
const adminInterface_1 = require("./adminInterface");
const adminUtils_1 = require("../../utils/adminUtils");
const mongoose_1 = __importStar(require("mongoose"));
const express_validator_1 = require("express-validator");
const clubModel_1 = require("../club/clubModel");
const moduleModel_1 = require("../module/moduleModel");
const eventModel_1 = require("../event/eventModel");
const feedbackModel_1 = require("../feedback/feedbackModel");
const publicProjectRequestModel_1 = require("../publicProjectRequest/publicProjectRequestModel");
const ideationMethodModel_1 = require("../idea/ideationMethodModel");
const fs_1 = __importDefault(require("fs"));
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize statistics object
    let stats = {
        nbUsers: 0,
        nbProjects: [],
        nbVisits24h: 0,
        nbProjects24h: 0
    };
    try {
        // Number of users
        stats.nbUsers = yield userModels_1.User.countDocuments();
        // Number of projects per method
        const methods = yield ideationMethodModel_1.IdeationMethod.find();
        for (const method of methods) {
            const nb = yield projectModels_1.Project.find({
                ideationMethod: method._id
            }).countDocuments();
            stats.nbProjects.push(nb);
        }
        // Number of website visits in the last 24 hours
        stats.nbVisits24h = yield (0, adminUtils_1.nbVisits24h)();
        // Number of new projects in the last 24 hours
        const avant24h = new Date(Date.now() - 24 * 3600 * 1000);
        // Filtering the projects created in the last 24 hours
        const projects24h = yield projectModels_1.Project.find({ creationDate: { $gte: avant24h } });
        stats.nbProjects24h = projects24h.length;
        // Send statistics in response
        return res.status(200).send(stats);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500); // Internal server error
    }
});
exports.getStats = getStats;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all users
        const users = yield userModels_1.User.find({});
        // Send users in response
        return res.status(200).send(users);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500); // Internal server error
    }
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    // Extract user ID from request body
    const userId = req.body.id;
    // Check if user ID is valid
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId)) {
        return res
            .status(400)
            .send({ error: 'Bad id must be 24 character hex string' });
    }
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        // Find user by ID
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        // Remove user from collaborators of all projects
        for (const projectObj of user.projects) {
            const project = yield projectModels_1.Project.findById(new mongoose_1.default.Types.ObjectId(projectObj.project._id.toString()));
            if (project) {
                const updatedCollaborators = project.collaborators.filter(collaborator => collaborator.member._id.toString() !== userId);
                project.collaborators = updatedCollaborators;
                yield project.save();
            }
            else {
                return res.status(404).send({ error: 'Project of the user not found' });
            }
        }
        // Delete user
        yield userModels_1.User.deleteOne(objectId);
        return res.sendStatus(200); // Success response
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500); // Internal server error
    }
});
exports.deleteUser = deleteUser;
const banUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    // Extract user ID and duration from request body
    const userId = req.body.id;
    const duration = req.body.duration;
    // Check if duration is valid
    if (duration <= 0)
        return res.status(400).send({
            error: 'Bad duration: must be positive different from 0 integer'
        });
    // Check if user ID is valid
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId))
        return res
            .status(400)
            .send({ error: 'Bad id: must be 24 character hex string' });
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        // Find user by ID
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        // Calculate end date of ban
        const endDate = new Date(Date.now() + duration * 24 * 3600 * 1000);
        user.ban.isBan = true;
        user.ban.banEnd = endDate;
        yield user.save();
        return res.sendStatus(200); // Success response
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500); // Internal server error
    }
});
exports.banUser = banUser;
const unbanUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    // Extract user ID from request body
    const userId = req.body.id;
    // Check if user ID is valid
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId))
        return res
            .status(400)
            .send({ error: 'Bad id: must be 24 character hex string' });
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        // Find user by ID
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        // Check if user is banned
        if (user.ban.isBan) {
            // Check if ban period has expired
            if (Date.now() >= user.ban.banEnd.getTime()) {
                user.ban.isBan = false;
                yield user.save();
                return res.sendStatus(200); // Success response
            }
            return res.status(403).send({ error: adminInterface_1.banMsg }); // Forbidden response
        }
        return res.status(400).send({ error: 'User is not banned' }); // Bad request response
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500); // Internal server error
    }
});
exports.unbanUser = unbanUser;
const forceUnbanUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    // Extract user ID from request body
    const userId = req.body.id;
    // Check if user ID is valid
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId))
        return res
            .status(400)
            .send({ error: 'Bad id: must be 24 character hex string' });
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        // Find user by ID
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        // Check if user is banned
        if (user.ban.isBan) {
            user.ban.isBan = false;
            yield user.save();
            return res.sendStatus(200); // Success response
        }
        return res.status(400).send({ error: 'User is not banned' }); // Bad request response
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500); // Internal server error
    }
});
exports.forceUnbanUser = forceUnbanUser;
const getTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    // Extract type from query parameters
    const type = req.query.type;
    let docs;
    try {
        // Retrieve documents based on type
        switch (type.toLowerCase()) {
            case 'club':
                docs = yield clubModel_1.Club.find({});
                break;
            case 'module':
                docs = yield moduleModel_1.Module.find({});
                break;
            case 'event':
                docs = yield eventModel_1.Event.find({});
                break;
            default:
                return res.status(400).send({ error: 'Invalid tag type' });
        }
        // Send retrieved documents
        return res.status(200).send(docs);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getTags = getTags;
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    // Extract type and tag details from request body
    const _a = req.body, { type } = _a, tag = __rest(_a, ["type"]);
    let savedDoc;
    try {
        // Create new document based on type
        switch (type.toLowerCase()) {
            case 'club':
                const newClub = new clubModel_1.Club(tag);
                savedDoc = yield newClub.save();
                break;
            case 'module':
                const newModule = new moduleModel_1.Module(tag);
                savedDoc = yield newModule.save();
                break;
            case 'event':
                const newEvent = new eventModel_1.Event(tag);
                savedDoc = yield newEvent.save();
                break;
            default:
                return res.status(400).send({ error: 'Invalid tag type' });
        }
        // Send success response
        return res.status(201).send({ msg: 'Created successfully', savedDoc });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createTag = createTag;
const deleteTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    // Extract tag ID and type from request body
    const id = req.body.id, type = req.body.type;
    // Check if ID is valid
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        return res
            .status(400)
            .send({ error: 'Bad id must be 24 character hex string' });
    }
    const objectId = new mongoose_1.default.Types.ObjectId(id);
    try {
        // Delete document based on type and ID
        switch (type.toLowerCase()) {
            // If type is 'club', delete the club document
            case 'club':
                // Find the club document by its ID
                const club = yield clubModel_1.Club.findById(objectId);
                // If club document not found, send error response
                if (!club) {
                    return res.status(404).send({ error: 'Club not found' });
                }
                // Delete the club document
                yield clubModel_1.Club.deleteOne(objectId);
                break;
            // If type is 'module', delete the module document
            case 'module':
                // Find the module document by its ID
                const module = yield moduleModel_1.Module.findById(objectId);
                // If module document not found, send error response
                if (!module) {
                    return res.status(404).send({ error: 'Module not found' });
                }
                // Delete the module document
                yield moduleModel_1.Module.deleteOne(objectId);
                break;
            // If type is 'event', delete the event document
            case 'event':
                // Find the event document by its ID
                const event = yield eventModel_1.Event.findById(objectId);
                // If event document not found, send error response
                if (!event) {
                    return res.status(404).send({ error: 'Event not found' });
                }
                // Delete the event document
                yield eventModel_1.Event.deleteOne(objectId);
                break;
            // If type is not recognized, send invalid tag type error response
            default:
                return res.status(400).send({ error: 'Invalid tag type' });
        }
        // Send success response
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.deleteTag = deleteTag;
const modifyTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const { id, type, tag } = req.body;
    // Check if ID is valid
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        return res
            .status(400)
            .send({ error: 'Bad id must be 24 character hex string' });
    }
    const objectId = mongoose_1.default.Types.ObjectId.createFromHexString(id);
    try {
        // Modify document based on type
        switch (type.toLowerCase()) {
            case 'club':
                let club = yield clubModel_1.Club.findById(objectId);
                if (!club) {
                    return res.status(404).send({ error: 'Club not found' });
                }
                if (tag.clubName)
                    club.clubName = tag.clubName;
                if (tag.description)
                    club.description = Object.assign(Object.assign({}, club.description), tag.description);
                yield club.save();
                break;
            case 'module':
                const module = yield moduleModel_1.Module.findById(objectId);
                if (!module) {
                    return res.status(404).send({ error: 'Module not found' });
                }
                if (tag.moduleName)
                    module.moduleName = tag.moduleName;
                if (tag.description)
                    module.description = Object.assign(Object.assign({}, module.description), tag.description);
                yield module.save();
                break;
            case 'event':
                let event = yield eventModel_1.Event.findById(objectId);
                if (!event) {
                    return res.status(404).send({ error: 'Event not found' });
                }
                if (tag.eventName)
                    event.eventName = tag.eventName;
                if (tag.description)
                    event.description = tag.description;
                yield event.save();
                break;
            default:
                return res.status(400).send({ error: 'Invalid tag type' });
        }
        // Send success response
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.modifyTag = modifyTag;
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve feedbacks
        const fbs = yield feedbackModel_1.feedback.find({});
        // Send success response
        return res.status(200).send(fbs);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getFeedbacks = getFeedbacks;
const getPublicProjectRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve public project requests with populated data
        const ppRequests = yield publicProjectRequestModel_1.publicProjectRequest.find({})
            .populate({
            path: 'projectId',
            populate: {
                path: 'coordinator',
                model: 'User'
            }
        });
        // Send success response
        return res.status(200).send(ppRequests);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getPublicProjectRequests = getPublicProjectRequests;
const approvePublicProjectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body parameters
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    // Extract project publication request ID from request body
    const pprId = req.body.id;
    // Validate project publication request ID
    if (!(0, mongoose_1.isObjectIdOrHexString)(pprId))
        return res
            .status(400)
            .send({ error: 'Bad id: must be 24 character hex string' });
    // Convert project publication request ID to MongoDB ObjectId
    const pprObjectId = new mongoose_1.default.Types.ObjectId(pprId);
    try {
        // Find the project publication request by ID
        const ppr = yield publicProjectRequestModel_1.publicProjectRequest.findById(pprObjectId);
        if (!ppr) {
            return res
                .status(404)
                .send({ error: 'Project publication request not found' });
        }
        // Find the project associated with the publication request
        const project = yield projectModels_1.Project.findById(ppr.projectId);
        if (!project) {
            return res
                .status(404)
                .send({ error: 'The project of the publication request not found' });
        }
        // Approve the public visibility of the project
        project.visibility = projectModels_1.ProjectVisibility.PUBLIC;
        yield project.save();
        // Delete the approved project publication request
        yield publicProjectRequestModel_1.publicProjectRequest.deleteOne(pprObjectId);
        // Send success response
        return res.status(200).send({ msg: "The public project request has been approved" });
    }
    catch (error) {
        // Handle errors and send error response
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.approvePublicProjectRequest = approvePublicProjectRequest;
const getLogs = (req, res) => {
    // Read the content of the access log file
    fs_1.default.readFile("./access.log", 'utf8', (error, data) => {
        if (error) {
            // If error occurs during file reading, send error response
            console.log(error);
            return res.status(500).send({ error: 'Error in reading logs file' });
        }
        // Split the data into individual lines
        const lines = data.split('\n');
        // Initialize an array to store parsed log entries
        const parsedLogs = [];
        // Iterate over each line of the log file
        lines.forEach((line) => {
            // Split the line to extract date, request type, and route
            if (line) {
                const [date, requestInfo] = line.split(' - ');
                const [requestType, route] = requestInfo.split(' ');
                // Create an object for the log entry
                const logEntry = {
                    date: new Date(date.trim()),
                    requestType: requestType.trim(),
                    route: route.trim()
                };
                // Push the object to the array
                parsedLogs.push(logEntry);
            }
        });
        // Send the parsed log entries as response
        return res.status(200).send(parsedLogs);
    });
};
exports.getLogs = getLogs;
const deleteLogs = (req, res) => {
    // Overwrite the content of the access log file with an empty string
    fs_1.default.writeFile("./access.log", '', (error) => {
        if (error) {
            // If error occurs during file writing, send error response
            return res.status(500).send({ msg: 'Error deleting file content', error });
        }
        // Send success response after deleting file content
        return res.sendStatus(200);
    });
};
exports.deleteLogs = deleteLogs;
