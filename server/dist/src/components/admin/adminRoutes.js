"use strict";
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
const express_1 = __importDefault(require("express"));
const userModels_1 = require("../user/userModels");
const adminMiddlewares_1 = require("../../utils/middlewares/adminMiddlewares");
const router = express_1.default.Router();
router.get("/admin/stats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let stats = { nbUsers: 0, nbProjects: [], nbVisite24h: 0 };
    try {
        //Nombre d'utilisateurs
        stats.nbUsers = yield userModels_1.User.countDocuments();
        //Nombre de projets par methode
        yield (0, adminMiddlewares_1.nbProjetsMethodes)()
            .then((nbproj) => {
            stats.nbProjects = nbproj;
        });
        //Nombre de visites du site (par une periode de 24h)
        yield (0, adminMiddlewares_1.nbVisites24h)()
            .then((nb) => {
            stats.nbVisite24h = nb;
        });
        return res.status(200).send(stats);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}));
exports.default = router;
