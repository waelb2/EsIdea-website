import express, { Request, Response} from "express";
import { User } from "../user/userModels";
import { Project } from "../project/projectModels";
import {Statistiques} from "./adminInterface"
import { loggerMiddleware } from "../../utils/middlewares/adminMiddlewares";
import { IdeationMethodNames } from "../idea/ideationMethodInterface";
import { nbVisites24h, nbProjetsMethodes } from "../../utils/middlewares/adminMiddlewares";
import { IdeationMethod } from "../idea/ideationMethodModel";
import { ObjectId } from "mongoose";
import { Console } from "console";

const router = express.Router();

router.get("/admin/stats", async (req: Request, res: Response) => {
    let stats : Statistiques = {nbUsers: 0, nbProjects: [], nbVisite24h: 0};
    
    try {
        //Nombre d'utilisateurs
            stats.nbUsers = await User.countDocuments();

        //Nombre de projets par methode
            await nbProjetsMethodes()
                .then( (nbproj: number[]) => {
                    stats.nbProjects = nbproj;
                });

        //Nombre de visites du site (par une periode de 24h)
            await nbVisites24h()
                .then((nb: number) => { 
                    stats.nbVisite24h = nb;
                });

        return res.status(200).send(stats);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});

export default router;