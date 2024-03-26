import express, {NextFunction, Request, Response} from "express";
import { User } from "../user/userModels";
import { Project } from "../project/projectModels";
import {Statistiques} from "./adminInterface"
import { loggerMiddleware } from "../../utils/middlewares/adminMiddlewares";
import { IdeationMethodNames } from "../idea/ideationMethodInterface";
import { readFilePromise } from "../../utils/middlewares/adminMiddlewares";
import { IdeationMethod } from "../idea/ideationMethodModel";
import { ObjectId } from "mongoose";
import { Console } from "console";

const router = express.Router();

router.get("/admin/stats", loggerMiddleware, async (req: Request, res: Response) => {
    let stats : Statistiques = {nbUsers: 0, nbProjects: [], nbVisite24h: 0};
    
    try {
        //Nombre d'utilisateurs
        // const nb: number = await User.countDocuments();
        // stats.nbUsers = nb;

        //Nombre de projets par methode
        const projects = await Project.find({}); // Trouver tous les documents
            // .populate('ideationMethod') // Populer le champ 'ideationMethod' (remplacer les references par les documents)
            // .exec() // Executer le query
        const projectsIdeationMethodsPromises = projects.map(async (project) => {
            const ideationMethod = await IdeationMethod.findById(project.ideationMethod);
            return ideationMethod;
        });
        const projectsIdeationMethods = await Promise.all(projectsIdeationMethodsPromises);

        // const projectsNumberPerMethodPromises = IdeationMethodNames.map(async (method: string) => {
        //     const filteredProjectsIdeationMethods = projectsIdeationMethods.filter(ideationmethod => ideationmethod?.methodName === method);
        //     const filteredProjectsPromises = projects.map(async (project) => {
        //         const ideationMethod = await IdeationMethod.findById(project.ideationMethod);
        //         console.log(method);
        //         if (ideationMethod && (ideationMethod.methodName === method) ) {
        //             console.log("!!!!!!!!!!! WE GOT ONE HERE !!!!!!!!!!");
        //             return project;
        //         }
        //         return null;
        //     });
        //     const filteredPromisesArray = filteredProjectsPromises.filter(promise => promise !== null);
        //     const filteredProjects = await Promise.all(filteredPromisesArray);
        //     return filteredProjects.length;
        // });

        IdeationMethodNames.forEach( (method: string) => {
            const filteredProjectsIdeationMethods = projectsIdeationMethods.filter(ideationmethod => 
                ideationmethod?.methodName === method);
            // Rajouter le nombre de documents pour la 'method' dans le tableau nbProjects de stats
            stats.nbProjects.push(filteredProjectsIdeationMethods.length);
        });
        
        // Wait for all promises to resolve
        // const nbProjects = await Promise.all(projectsNumberPerMethodPromises);
        
        // // Now you have an array of results, which you can use as needed
        // console.log(nbProjects);


        // IdeationMethodNames.forEach( async (method: string) => {
        //     // Filtrer les projets qui ont 'method' dans le champ 'ideationMethod'
        //     const filteredProjects = await projects.filter( async (project) => {    //loukan nzid async hna bach nest3ml "await IdeationMethod.findById()" (psq loukan nekder man7tajch populate()) had l fonction ra7 tweli async w mayexecutihach !!! TSMA LAZM POPULATE RESOLVE THE FKIN PROBLEM
        //         // verifier si 'ideationMethod' existe et contient 'method' dans le champ 'ideationMethod'
        //         console.log("project.ideationMethod = " + project.ideationMethod + "\nproject.ideationMethod.methodName = "+project.ideationMethod.methodName);
        //         let projectMethod: string = "";
        //         const ideationMethod = await IdeationMethod.findById(project.ideationMethod);
        //         console.log(ideationMethod?.methodName);
        //         if(ideationMethod?.methodName === method )
        //             return project;
        //     });
        //     // Rajouter le nombre de documents pour la 'method' dans le tableau nbProjects de stats
        //     stats.nbProjects.push(filteredProjects.length);
        // });
        
        //Nombre de visites du site (par une periode)
        // await readFilePromise()
        //     .then((nbVisite24h: number) => { 
        //         stats.nbVisite24h = nbVisite24h;
        //     });

        return res.status(200).send(stats);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});

export default router;