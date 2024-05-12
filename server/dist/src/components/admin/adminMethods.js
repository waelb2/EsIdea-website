"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nbVisites24h = exports.loggerMiddleware = void 0;
const fs_1 = require("fs");
function loggerMiddleware(req, res, next) {
    console.log(`-------------------------------------
    ${req.method} request made to ${req.path}`);
    // Rajouter la requete dans le fichier log
    (0, fs_1.appendFile)('access.log', `${new Date().toISOString()} - ${req.method} ${req.url}\n`, err => {
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
