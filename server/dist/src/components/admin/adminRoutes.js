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
const express_1 = __importDefault(require("express"));
const userModels_1 = require("../user/userModels");
const projectModels_1 = require("../project/projectModels");
const adminMiddlewares_1 = require("../../utils/middlewares/adminMiddlewares");
const mongoose_1 = __importStar(require("mongoose"));
const express_validator_1 = require("express-validator");
const clubModel_1 = require("../club/clubModel");
const moduleModel_1 = require("../module/moduleModel");
const eventModel_1 = require("../event/eventModel");
const router = express_1.default.Router();
router.get("/admin/stats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let stats = { nbUsers: 0, nbProjets: [], nbVisite24h: 0, nbProjets24h: 0 };
    try {
        //Nombre d'utilisateurs
        stats.nbUsers = yield userModels_1.User.countDocuments();
        //Nombre de projets par methode
        yield (0, adminMiddlewares_1.nbProjetsMethodes)()
            .then((nbproj) => {
            stats.nbProjets = nbproj;
        });
        //Nombre de visites du site (par une periode de 24h)
        yield (0, adminMiddlewares_1.nbVisites24h)()
            .then((nb) => {
            stats.nbVisite24h = nb;
        });
        //Nombre de nouveaux projets (par une periode de 24h)
        const avant24h = Date.now() - 24 * 60 * 60 * 1000;
        //filtrer les projets qui ont etaient créer dans les dernieres 24h
        const projets24h = yield projectModels_1.Project.find({ creationDate: { $gte: avant24h } });
        stats.nbProjets24h = projets24h.length;
        return res.status(200).send(stats);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}));
router.get("/admin/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModels_1.User.find({});
        return res.status(200).send(users);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}));
router.delete("/admin/users", (0, express_validator_1.body)("id")
    .notEmpty().withMessage("Must provide the id of the user"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
router.get("/admin/tags", (0, express_validator_1.body)("type")
    .notEmpty().withMessage("Must provide the tag type")
    .isString().withMessage("The tag type must be a string"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
router.post("/admin/tags", (0, express_validator_1.body)("type")
    .notEmpty().withMessage("Must provide the tag type")
    .isString().withMessage("The tag type must be a string"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        return res.status(201).send(savedDoc);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}));
router.delete("/admin/tags", [
    (0, express_validator_1.body)("id")
        .notEmpty().withMessage("Must provide the id of the user"),
    (0, express_validator_1.body)("type")
        .notEmpty().withMessage("Must provide the tag type")
        .isString().withMessage("The tag type must be a string")
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
router.patch("/admin/tags", [
    (0, express_validator_1.body)("id")
        .notEmpty().withMessage("Must provide the id of the user"),
    (0, express_validator_1.body)("type")
        .notEmpty().withMessage("Must provide the tag type")
        .isString().withMessage("The tag type must be a string")
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const club = yield clubModel_1.Club.findById(objectId);
                if (!club) {
                    return res.status(404).send({ error: "Club not found" });
                }
                if (tag.clubName)
                    club.clubName = tag.clubName;
                if (tag.description)
                    club.description = tag.description;
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
                    module.description = tag.description;
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
}));
exports.default = router;
