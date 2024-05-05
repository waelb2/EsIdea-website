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
exports.addFavouriteProject = exports.getUser = exports.createPublicProjectRequest = exports.createFeedback = exports.modifyProfilePicture = exports.upload = void 0;
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
const modifyProfilePicture = (req, res, image) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    if (!image)
        return res
            .status(400)
            .send({ error: 'Must provide the new profile picture' });
    const userId = req.body.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId))
        return res.status(400).send({ error: "Bad id: must be 24 character hex string" });
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        const result = yield cloudConfig_1.default.uploader.upload(image.path, { public_id: userId });
        const secure_url = result.secure_url;
        user.profilePicUrl = secure_url;
        yield user.save();
        fs_1.default.unlink(image.path, err => {
            if (err) {
                console.log(err);
            }
        });
        return res.status(200).send({ msg: 'User profile picture updated successfully' });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.modifyProfilePicture = modifyProfilePicture;
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const { created_by, description, title } = req.body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(created_by)) {
        return res
            .status(400)
            .send({ error: 'Bad id must be 24 character hex string' });
    }
    const objectId = new mongoose_1.default.Types.ObjectId(created_by);
    const fdb = { created_by, title, description };
    try {
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const fb = new feedbackModel_1.feedback(fdb);
        yield fb.save();
        return res.status(201).send(fb);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createFeedback = createFeedback;
const createPublicProjectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const { projectId } = req.body;
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
        const ppr = new publicProjectRequestModel_1.publicProjectRequest({ projectId });
        yield ppr.save();
        return res.status(201).send(ppr);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createPublicProjectRequest = createPublicProjectRequest;
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
            error: "Internal Server Error"
        });
    }
});
exports.getUser = getUser;
const addFavouriteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const { userId, projectId } = req.body;
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
            console.log("got in !!!\n");
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
