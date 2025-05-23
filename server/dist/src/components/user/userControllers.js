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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicProjects = exports.createPublicProjectRequest = exports.addFavouriteProject = exports.getUserById = exports.getUserByLastName = exports.getUserByEmail = exports.getUser = exports.createFeedback = exports.modifyProfilePicture = exports.upload = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importStar(require("mongoose"));
const cloudConfig_1 = __importDefault(require("../../config/cloudConfig"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const feedbackModel_1 = require("../feedback/feedbackModel");
const projectModels_1 = require("../project/projectModels");
const publicProjectRequestModel_1 = require("../publicProjectRequest/publicProjectRequestModel");
const userModels_1 = require("./userModels");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
exports.upload = upload;
/**
 * Modify user profile picture.
 *
 * @param req Request object.
 * @param res Response object.
 * @param image Profile picture file.
 */
const modifyProfilePicture = (req, res, image) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if image is provided
    if (!image)
        return res
            .status(400)
            .send({ error: 'Must provide the new profile picture' });
    const { userId } = req.user;
    // Check if userId is a valid ObjectId
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId))
        return res
            .status(400)
            .send({ error: 'Bad id: must be 24 character hex string' });
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const result = yield cloudConfig_1.default.uploader.upload(image.path, {
            public_id: userId,
            folder: 'profilesPictures'
        });
        const secure_url = result.secure_url;
        user.profilePicUrl = secure_url;
        yield user.save();
        fs_1.default.unlink(image.path, err => {
            if (err) {
                console.log(err);
            }
        });
        return res
            .status(200)
            .send({ msg: 'User profile picture updated successfully' });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.modifyProfilePicture = modifyProfilePicture;
/**
 * Create feedback.
 *
 * @param req Request object.
 * @param res Response object.
 */
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const { userId } = req.user;
    const { title, description } = req.body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId)) {
        return res
            .status(400)
            .send({ error: 'Bad id must be 24 character hex string' });
    }
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const { firstName, lastName, profilePicUrl } = user;
        const fdb = { created_by: { firstName, lastName, profilePicUrl }, title, description, creationDate: new Date() };
        const fb = new feedbackModel_1.feedback(fdb);
        yield fb.save();
        return res.status(201).send(fb);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.createFeedback = createFeedback;
/**
 * Create public project request.
 *
 * @param req Request object.
 * @param res Response object.
 */
const createPublicProjectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const { projectId } = req.body;
    const { userId } = req.user;
    if (!(0, mongoose_1.isObjectIdOrHexString)(projectId)) {
        return res
            .status(400)
            .send({ error: 'Bad id must be 24 character hex string' });
    }
    const objectId = new mongoose_1.default.Types.ObjectId(projectId);
    try {
        const project = yield projectModels_1.Project.findById(objectId);
        if (!project) {
            return res.status(404).send({ error: "The project of the publication request is not found" });
        }
        if (!(userId == project.coordinator.toString()))
            return res.status(400).send({ error: "Your are not the coordinator of the project" });
        const existReq = yield publicProjectRequestModel_1.publicProjectRequest.findOne({ projectId: objectId });
        if (!existReq) {
            if (project.visibility === projectModels_1.ProjectVisibility.PUBLIC)
                return res.status(400).send({ error: 'The project is already public' });
            const ppr = new publicProjectRequestModel_1.publicProjectRequest({ projectId });
            yield ppr.save();
            return res.status(201).send(ppr);
        }
        return res.status(400).send({ error: 'Public project request already exists' });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.createPublicProjectRequest = createPublicProjectRequest;
/**
 * Get user by ID.
 *
 * @param req Request object.
 * @param res Response object.
 */
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, email } = req.user;
    try {
        const user = yield userModels_1.User.findById(userId);
        res.status(200).json({
            user: {
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                email: user === null || user === void 0 ? void 0 : user.email,
                profilePicUrl: user === null || user === void 0 ? void 0 : user.profilePicUrl
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
exports.getUserById = getUserById;
/**
 * Get user by email.
 *
 * @param req Request object.
 * @param res Response object.
 */
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailQuery } = req.body;
    try {
        const matchedUsers = yield userModels_1.User.find({
            email: { $regex: emailQuery, $options: 'i' }
        });
        if (matchedUsers.length == 0) {
            return res.status(200).json({
                matchedUsers: []
            });
        }
        const formattedUsers = matchedUsers.map(user => {
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePicUrl: user.profilePicUrl
            };
        });
        res.status(200).json({
            matchedUsers: formattedUsers
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});
exports.getUserByEmail = getUserByEmail;
/**
 * Get user by last name.
 *
 * @param req Request object.
 * @param res Response object.
 */
const getUserByLastName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lastNameQuery } = req.body;
    try {
        const matchedUsers = yield userModels_1.User.find({
            lastName: { $regex: lastNameQuery, $options: 'i' }
        });
        if (matchedUsers.length == 0) {
            return res.status(200).json({
                matchedUsers: []
            });
        }
        const formattedUsers = matchedUsers.map(user => {
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePicUrl: user.profilePicUrl
            };
        });
        res.status(200).json({
            matchedUsers: formattedUsers
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});
exports.getUserByLastName = getUserByLastName;
/**
 * Get user details.
 *
 * @param req Request object.
 * @param res Response object.
 */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: 'unauthorized'
        });
    }
    try {
        console.log(req.user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});
exports.getUser = getUser;
/**
 * Add project to user's favourites.
 *
 * @param req Request object.
 * @param res Response object.
 */
const addFavouriteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { projectId } = req.body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId) || !(0, mongoose_1.isObjectIdOrHexString)(projectId)) {
        return res
            .status(400)
            .send({ error: 'Bad id must be 24 character hex string' });
    }
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const projectObjectId = new mongoose_1.default.Types.ObjectId(projectId);
    try {
        const user = yield userModels_1.User.findById(userObjectId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        for (const projectObj of user.projects) {
            if (projectObjectId.equals(new mongoose_1.default.Types.ObjectId(projectObj.project.toString()))) {
                user.projects[user.projects.indexOf(projectObj)].isFav = true;
                yield user.save();
                return res.status(200).send({ msg: 'Project added to favourites' });
            }
        }
        return res.status(400).send({ error: 'The user is not a member of the given project' });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.addFavouriteProject = addFavouriteProject;
/**
 * Get public projects.
 *
 * @param req Request object.
 * @param res Response object.
 */
const getPublicProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicProjects = yield projectModels_1.Project.find({ visibility: 'public' })
            .populate({
            path: 'subTopics',
            model: 'Topic'
        })
            .populate({
            path: 'collaborators.member',
            model: 'User'
        })
            .populate({
            path: 'mainTopic',
            model: 'Topic'
        })
            .populate({
            path: 'clubs',
            model: 'Club'
        })
            .populate({
            path: 'events',
            model: 'Event'
        })
            .populate({
            path: 'modules',
            model: 'Module'
        })
            .populate({
            path: 'ideationMethod',
            model: 'IdeationMethod'
        })
            .populate({
            path: 'coordinator',
            model: 'User'
        });
        const publicProjectsStrings = publicProjects.map(project => {
            const { title, description, creationDate, visibility, collaboratorsCount, collaborators, mainTopic, subTopics, clubs, modules, events, thumbnailUrl } = project;
            const formattedSubTopics = subTopics === null || subTopics === void 0 ? void 0 : subTopics.map(topic => {
                return {
                    topicId: topic._id,
                    topicName: topic.topicName
                };
            });
            const formattedCollaborators = collaborators === null || collaborators === void 0 ? void 0 : collaborators.map(collaborator => {
                if (collaborator.member) {
                    const { firstName, lastName, email, profilePicUrl } = collaborator.member;
                    return {
                        firstName,
                        lastName,
                        email,
                        profilePicUrl
                    };
                }
                return null;
            });
            const coordinator = {
                firstName: project.coordinator.firstName,
                lastName: project.coordinator.lastName,
                email: project.coordinator.email,
                profilePicUrl: project.coordinator.profilePicUrl
            };
            const formattedProject = {
                projectId: project.id,
                IdeationMethod: project.ideationMethod.methodName,
                ProjectTitle: title,
                Description: description,
                coordinator,
                Visibility: visibility,
                CollaboratorsCount: collaboratorsCount.toString(),
                collaborators: formattedCollaborators,
                MainTopic: (mainTopic === null || mainTopic === void 0 ? void 0 : mainTopic.topicName) || '',
                MainTopicId: mainTopic === null || mainTopic === void 0 ? void 0 : mainTopic.id,
                SubTopics: formattedSubTopics,
                Clubs: clubs.map(club => club.clubName),
                Modules: modules.map(module => module.moduleName),
                Events: events.map(event => event.eventName),
                ThumbnailUrl: thumbnailUrl,
                joinedDate: creationDate,
                projectStatus: project.status,
                timer: project.timer
            };
            return formattedProject;
        });
        res.status(200).json(publicProjectsStrings);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getPublicProjects = getPublicProjects;
