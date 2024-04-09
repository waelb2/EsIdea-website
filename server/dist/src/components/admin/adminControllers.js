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
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvePublicProjectRequest = exports.createPublicProjectRequest = exports.getPublicProjectRequests = exports.replyFeedback = exports.createFeedback = exports.getFeedbacks = exports.modifyTag = exports.deleteTag = exports.createTag = exports.getTags = exports.forceUnbanUser = exports.unbanUser = exports.banUser = exports.deleteUser = exports.getUsers = exports.getStats = void 0;
const userModels_1 = require("../user/userModels");
const projectModels_1 = require("../project/projectModels");
const adminInterface_1 = require("./adminInterface");
const adminMethods_1 = require("./adminMethods");
const mongoose_1 = __importStar(require("mongoose"));
const express_validator_1 = require("express-validator");
const clubModel_1 = require("../club/clubModel");
const moduleModel_1 = require("../module/moduleModel");
const eventModel_1 = require("../event/eventModel");
const feedbackModel_1 = require("../feedback/feedbackModel");
const publicProjectRequestModel_1 = require("../publicProjectRequest/publicProjectRequestModel");
const ideationMethodModel_1 = require("../idea/ideationMethodModel");
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let stats = { nbUsers: 0, nbProjets: [], nbVisite24h: 0, nbProjets24h: 0 };
    try {
        //Nombre d'utilisateurs
        stats.nbUsers = yield userModels_1.User.countDocuments();
        //Nombre de projets par methode
        const methods = yield ideationMethodModel_1.IdeationMethod.find();
        for (const method of methods) {
            const nb = yield projectModels_1.Project.find({ ideationMethod: method._id }).countDocuments();
            stats.nbProjets.push(nb);
        }
        //Nombre de visites du site (par une periode de 24h)
        stats.nbVisite24h = yield (0, adminMethods_1.nbVisites24h)();
        //Nombre de nouveaux projets (par une periode de 24h)
        const avant24h = Date.now() - 24 * 3600 * 1000;
        //filtrer les projets qui ont etaient créer dans les dernieres 24h
        //const projets24h = await Project.find({creationDate: { $gte: avant24h }}); // marche dans le cas ou creation timestamp (ms since 1970)
        const projets = yield projectModels_1.Project.find({});
        const projets24h = projets.filter(project => project.creationDate.getTime() >= avant24h);
        stats.nbProjets24h = projets24h.length;
        return res.status(200).send(stats);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getStats = getStats;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModels_1.User.find({});
        return res.status(200).send(users);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const userId = req.body.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId)) {
        return res.status(400).send({ error: "Bad id must be 24 character hex string" });
    }
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        yield userModels_1.User.deleteOne(objectId);
        console.log(user);
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.deleteUser = deleteUser;
const banUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const userId = req.body.id;
    const duration = req.body.duration;
    if (duration <= 0)
        return res.status(400).send({ error: "Bad duration: must be positive different from 0 integer" });
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId))
        return res.status(400).send({ error: "Bad id: must be 24 character hex string" });
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        const endDate = new Date(Date.now() + (duration * 24 * 3600 * 1000));
        user.ban.isBan = true;
        user.ban.banEnd = endDate;
        yield user.save();
        console.log(user);
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.banUser = banUser;
const unbanUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const userId = req.body.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId))
        return res.status(400).send({ error: "Bad id: must be 24 character hex string" });
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        if (user.ban.isBan) {
            if (Date.now() >= user.ban.banEnd.getTime()) {
                user.ban.isBan = false;
                yield user.save();
                console.log(user);
                return res.sendStatus(200);
            }
            return res.status(403).send({ error: adminInterface_1.banMsg });
        }
        return res.status(400).send({ error: "User is not banned" });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.unbanUser = unbanUser;
const forceUnbanUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const userId = req.body.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(userId))
        return res.status(400).send({ error: "Bad id: must be 24 character hex string" });
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const user = yield userModels_1.User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        if (user.ban.isBan) {
            user.ban.isBan = false;
            yield user.save();
            console.log(user);
            return res.sendStatus(200);
        }
        return res.status(400).send({ error: "User is not banned" });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.forceUnbanUser = forceUnbanUser;
const getTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const type = req.body.type;
    let docs;
    try {
        switch (type.toLowerCase()) {
            case "club":
                docs = yield clubModel_1.Club.find({});
                break;
            case "module":
                docs = yield moduleModel_1.Module.find({});
                break;
            case "event":
                docs = yield eventModel_1.Event.find({});
                break;
            default:
                return res.status(400).send({ error: "Invalid tag type" });
        }
        return res.status(200).send(docs);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getTags = getTags;
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const _a = req.body, { type } = _a, tag = __rest(_a, ["type"]);
    let savedDoc;
    try {
        switch (type.toLowerCase()) {
            case "club":
                const newClub = new clubModel_1.Club(tag);
                savedDoc = yield newClub.save();
                break;
            case "module":
                const newModule = new moduleModel_1.Module(tag);
                savedDoc = yield newModule.save();
                break;
            case "event":
                const newEvent = new eventModel_1.Event(tag);
                savedDoc = yield newEvent.save();
                break;
            default:
                return res.status(400).send({ error: "Invalid tag type" });
        }
        return res.status(201).send({ msg: "Created successfully", savedDoc });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createTag = createTag;
const deleteTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const id = req.body.id, type = req.body.type;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        return res.status(400).send({ error: "Bad id must be 24 character hex string" });
    }
    const objectId = new mongoose_1.default.Types.ObjectId(id);
    try {
        switch (type.toLowerCase()) {
            case "club":
                const club = yield clubModel_1.Club.findById(objectId);
                if (!club) {
                    return res.status(404).send({ error: "Club not found" });
                }
                yield clubModel_1.Club.deleteOne(objectId);
                console.log(club);
                break;
            case "module":
                const module = yield moduleModel_1.Module.findById(objectId);
                if (!module) {
                    return res.status(404).send({ error: "Module not found" });
                }
                yield moduleModel_1.Module.deleteOne(objectId);
                console.log(module);
                break;
            case "event":
                const event = yield eventModel_1.Event.findById(objectId);
                if (!event) {
                    return res.status(404).send({ error: "Event not found" });
                }
                yield eventModel_1.Event.deleteOne(objectId);
                console.log(event);
                break;
            default:
                return res.status(400).send({ error: "Invalid tag type" });
        }
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.deleteTag = deleteTag;
const modifyTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const _b = req.body, { id, type } = _b, tag = __rest(_b, ["id", "type"]);
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        return res.status(400).send({ error: "Bad id must be 24 character hex string" });
    }
    const objectId = new mongoose_1.default.Types.ObjectId(id);
    try {
        switch (type.toLowerCase()) {
            case "club":
                let club = yield clubModel_1.Club.findById(objectId);
                if (!club) {
                    return res.status(404).send({ error: "Club not found" });
                }
                if (tag.clubName)
                    club.clubName = tag.clubName;
                if (tag.description)
                    club.description = Object.assign(Object.assign({}, club.description), tag.description);
                yield club.save();
                console.log(tag);
                break;
            case "module":
                const module = yield moduleModel_1.Module.findById(objectId);
                if (!module) {
                    return res.status(404).send({ error: "Module not found" });
                }
                if (tag.moduleName)
                    module.moduleName = tag.moduleName;
                if (tag.description)
                    module.description = Object.assign(Object.assign({}, module.description), tag.description);
                yield module.save();
                console.log(tag);
                break;
            case "event":
                let event = yield eventModel_1.Event.findById(objectId);
                if (!event) {
                    return res.status(404).send({ error: "Event not found" });
                }
                if (tag.eventName)
                    event.eventName = tag.eventName;
                if (tag.description)
                    event.description = tag.description;
                yield event.save();
                console.log(tag);
                break;
            default:
                return res.status(400).send({ error: "Invalid tag type" });
        }
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
        const fbs = yield feedbackModel_1.feedback.find({});
        return res.status(200).send(fbs);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getFeedbacks = getFeedbacks;
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fb = new feedbackModel_1.feedback(req.body);
        yield fb.save();
        return res.status(201).send(fb);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createFeedback = createFeedback;
const replyFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const fbId = req.body.id, adminRes = req.body.response;
    if (!(0, mongoose_1.isObjectIdOrHexString)(fbId))
        return res.status(400).send({ error: "Bad id: must be 24 character hex string" });
    const fbObjectId = new mongoose_1.default.Types.ObjectId(fbId);
    try {
        const fb = yield feedbackModel_1.feedback.findById(fbObjectId);
        if (!fb) {
            return res.status(404).send({ error: "feedback not found" });
        }
        fb.adminResponse = adminRes;
        yield fb.save();
        console.log(fb);
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.replyFeedback = replyFeedback;
const getPublicProjectRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ppRequests = yield publicProjectRequestModel_1.publicProjectRequest.find({});
        return res.status(200).send(ppRequests);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getPublicProjectRequests = getPublicProjectRequests;
const createPublicProjectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ppr = new publicProjectRequestModel_1.publicProjectRequest(req.body);
        yield ppr.save();
        return res.status(201).send(ppr);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createPublicProjectRequest = createPublicProjectRequest;
const approvePublicProjectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errResult = (0, express_validator_1.validationResult)(req);
    if (!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });
    const pprId = req.body.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(pprId))
        return res.status(400).send({ error: "Bad id: must be 24 character hex string" });
    const pprObjectId = new mongoose_1.default.Types.ObjectId(pprId);
    try {
        const ppr = yield publicProjectRequestModel_1.publicProjectRequest.findById(pprObjectId);
        if (!ppr) {
            return res.status(404).send({ error: "Project publication request not found" });
        }
        const project = yield projectModels_1.Project.findById(ppr.projectId);
        if (!project) {
            return res.status(404).send({ error: "The project of the publication request not found" });
        }
        project.visibility = projectModels_1.ProjectVisibility.PUBLIC;
        yield project.save();
        console.log(project);
        return res.status(200).send({ msg: "The public" });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.approvePublicProjectRequest = approvePublicProjectRequest;
