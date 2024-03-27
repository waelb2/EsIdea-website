import { Request, Response } from "express";
import { NextFunction } from "express";
import { appendFile, readFile } from "fs";
import { Statistiques } from "../../components/admin/adminInterface";
import { IdeationMethodNames } from "../../components/idea/ideationMethodInterface";
import { Project } from "../../components/project/projectModels";
import { IdeationMethod } from "../../components/idea/ideationMethodModel";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
    console.log(`-------------------------------------
    ${req.method} request made to ${req.path}`);
    // Rajouter la requete dans le fichier log
    appendFile('access.log', `${new Date().toISOString()} - ${req.method} ${req.url}\n`, (err) => {
        if (err) {
            console.error('Error writing to access.log file:', err);
        }
    });
    next();
}

export function nbVisites24h(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        readFile('access.log', 'utf8', (err, data) => {
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
                if(!isNaN(timestamp))
                    return timestamp > twentyFourHoursAgo && timestamp <= now;
            });
        
            // Obtenir le nombre de requêtes au cours des dernières 24 heures
            resolve(requestsInLast24Hours.length);
        });
    });
}

export function nbProjetsMethodes(): Promise<number[]> {
    return new Promise<number[]>( async (resolve, reject) => {
        const projects = await Project.find({}); // Trouver tous les documents
        // Obtenir les documents 'ideationMethod' de tous les projets et les mettre dans un tableau
        const ideationMethodsPromises = projects.map(async (project) => {
            const ideationMethod = await IdeationMethod.findById(project.ideationMethod);
            return ideationMethod;
        });
        const projectsIdeationMethods = await Promise.all(ideationMethodsPromises);
        // Obtenir le nombre de projets qui ont "method" comme methode d'ideation, pour chaque methode d'ideation
        const nbProjects: number[] = [];
        IdeationMethodNames.forEach( (method: string) => {
            const filteredProjectsIdeationMethods = projectsIdeationMethods.filter(ideationmethod => 
                ideationmethod?.methodName === method);
            // Rajouter le nombre de projets pour la 'method' dans le tableau nbProjects de stats
            nbProjects.push(filteredProjectsIdeationMethods.length);
        });
        resolve(nbProjects);
    });
}
