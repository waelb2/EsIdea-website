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
Object.defineProperty(exports, "__esModule", { value: true });
exports.nbProjetsMethodes = exports.nbVisites24h = exports.loggerMiddleware = void 0;
const fs_1 = require("fs");
const ideationMethodInterface_1 = require("../../components/idea/ideationMethodInterface");
const projectModels_1 = require("../../components/project/projectModels");
const ideationMethodModel_1 = require("../../components/idea/ideationMethodModel");
function loggerMiddleware(req, res, next) {
    console.log(`-------------------------------------
    ${req.method} request made to ${req.path}`);
    // Rajouter la requete dans le fichier log
    (0, fs_1.appendFile)('access.log', `${new Date().toISOString()} - ${req.method} ${req.url}\n`, (err) => {
        if (err) {
            console.error('Error writing to access.log file:', err);
        }
    });
    next();
}
exports.loggerMiddleware = loggerMiddleware;
function nbVisites24h() {
    return new Promise((resolve, reject) => {
        (0, fs_1.readFile)('access.log', 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            // Diviser le contenu du fichier log en lignes
            const logLines = data.split('\n');
            // Obtenir la date et l'heure actuelles
            const now = Date.now();
            // Calculer le timestamp d'il y a 24 heures
            const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000).getTime();
            // Filtrer les requetes qui se sont produites au cours des dernières 24 heures
            const requestsInLast24Hours = logLines.filter(line => {
                // Extraire le timestamp de la ligne du log
                const timestampStr = line.split(' - ')[0].trim();
                const timestamp = new Date(timestampStr).getTime();
                // Verifier si le timestamp est dans les dernières 24 heures
                if (!isNaN(timestamp))
                    return timestamp > twentyFourHoursAgo && timestamp <= now;
            });
            // Obtenir le nombre de requêtes au cours des dernières 24 heures
            resolve(requestsInLast24Hours.length);
        });
    });
}
exports.nbVisites24h = nbVisites24h;
function nbProjetsMethodes() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const projects = yield projectModels_1.Project.find({}); // Trouver tous les documents
        // Obtenir les documents 'ideationMethod' de tous les projets et les mettre dans un tableau
        const ideationMethodsPromises = projects.map((project) => __awaiter(this, void 0, void 0, function* () {
            const ideationMethod = yield ideationMethodModel_1.IdeationMethod.findById(project.ideationMethod);
            return ideationMethod;
        }));
        const projectsIdeationMethods = yield Promise.all(ideationMethodsPromises);
        // Obtenir le nombre de projets qui ont "method" comme methode d'ideation, pour chaque methode d'ideation
        const nbProjects = [];
        ideationMethodInterface_1.IdeationMethodNames.forEach((method) => {
            const filteredProjectsIdeationMethods = projectsIdeationMethods.filter(ideationmethod => (ideationmethod === null || ideationmethod === void 0 ? void 0 : ideationmethod.methodName) === method);
            // Rajouter le nombre de projets pour la 'method' dans le tableau nbProjects de stats
            nbProjects.push(filteredProjectsIdeationMethods.length);
        });
        resolve(nbProjects);
    }));
}
exports.nbProjetsMethodes = nbProjetsMethodes;
