import express, { Request, Response} from "express";
import { User } from "../user/userModels";
import { Project } from "../project/projectModels";
import {Statistiques} from "./adminInterface";
import { nbVisites24h, nbProjetsMethodes } from "../../utils/middlewares/adminMiddlewares";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import { body, validationResult } from "express-validator";
import { ClubInterface } from "../club/clubInterface";
import { ModuleInterface } from "../module/moduleInterface";
import { EventInterface } from "../event/eventInterface";
import { Club } from "../club/clubModel";
import { Module } from "../module/moduleModel";
import { Event } from "../event/eventModel";

const router = express.Router();

router.get("/admin/stats", async (req: Request, res: Response) => {
    let stats : Statistiques = {nbUsers: 0, nbProjets: [], nbVisite24h: 0, nbProjets24h: 0};
    
    try {
        //Nombre d'utilisateurs
            stats.nbUsers = await User.countDocuments();

        //Nombre de projets par methode
            await nbProjetsMethodes()
                .then( (nbproj: number[]) => {
                    stats.nbProjets = nbproj;
                });

        //Nombre de visites du site (par une periode de 24h)
            await nbVisites24h()
                .then((nb: number) => { 
                    stats.nbVisite24h = nb;
                });
        
        //Nombre de nouveaux projets (par une periode de 24h)
            const avant24h = Date.now() - 24 * 60 * 60 * 1000;
            //filtrer les projets qui ont etaient créer dans les dernieres 24h
            const projets24h = await Project.find({creationDate: { $gte: avant24h }});
            stats.nbProjets24h = projets24h.length;

        return res.status(200).send(stats);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get("/admin/users", async (req: Request, res: Response) => { 
    try {
        const users = await User.find({});
        return res.status(200).send(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.delete("/admin/users", 
    body("id")
        .notEmpty().withMessage("Must provide the id of the user")
    ,
    async (req: Request, res: Response) => {
        const errResult = validationResult(req);
        if(!errResult.isEmpty())
            return res.status(400).send({ errors: errResult.array() });

        const userId: string = req.body.id;
        
        if ( ! isObjectIdOrHexString(userId)) {
            return res.status(400).send({error: "Bad id must be 24 character hex string"});
        }
        const objectId = new mongoose.Types.ObjectId(userId);
        
        try {
            const user = await User.findById(objectId);
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            await User.deleteOne(objectId);
            console.log(user);
            return res.sendStatus(200);

        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }  
    }
);

router.get("/admin/tags",
    body("type")
        .notEmpty().withMessage("Must provide the tag type")
        .isString().withMessage("The tag type must be a string")
    , 
    async (req: Request, res: Response) => {
        const errResult = validationResult(req);
        if(!errResult.isEmpty())
            return res.status(400).send({ errors: errResult.array() });

        const type: string = req.body.type;
        let docs: (ClubInterface | ModuleInterface | EventInterface)[];
        try {
            switch(type.toLowerCase()) {
                case "club" :
                    docs = await Club.find({});
                    break;
                case "module" :
                    docs = await Module.find({});
                    break;
                case "event" :
                    docs = await Event.find({});
                    break;
                default:
                    return res.status(400).send({ error: "Invalid tag type" });
            }
            return res.status(200).send(docs);
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }    
);

router.post("/admin/tags", 
    body("type")
        .notEmpty().withMessage("Must provide the tag type")
        .isString().withMessage("The tag type must be a string")
    ,
    async (req: Request, res: Response) => {
        const errResult = validationResult(req);
        if(!errResult.isEmpty())
            return res.status(400).send({ errors: errResult.array() });
        
        const {type, ...tag} = req.body;
        let savedDoc: ClubInterface | ModuleInterface | EventInterface;
        
        try {
            switch(type.toLowerCase()) {
                case "club" :
                    const newClub = new Club(tag);
                    savedDoc = await newClub.save();
                    break;
                case "module" :
                    const newModule = new Module(tag);
                    savedDoc = await newModule.save();
                    break;
                case "event" :
                    const newEvent = new Event(tag);
                    savedDoc = await newEvent.save();
                    break;
                default:
                    return res.status(400).send({ error: "Invalid tag type" });
            }
            return res.status(201).send(savedDoc);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }
);

router.delete("/admin/tags",
    [
        body("id")
        .notEmpty().withMessage("Must provide the id of the user"),
        body("type")
        .notEmpty().withMessage("Must provide the tag type")
        .isString().withMessage("The tag type must be a string")
    ],
    async (req: Request, res: Response) => {
        const errResult = validationResult(req);
        if(!errResult.isEmpty())
            return res.status(400).send({ errors: errResult.array() });

        const id: string = req.body.id,
        type: string = req.body.type;
        
        if ( ! isObjectIdOrHexString(id)) {
            return res.status(400).send({error: "Bad id must be 24 character hex string"});
        }
        const objectId = new mongoose.Types.ObjectId(id);
        
        try {
            switch(type.toLowerCase()) {
                case "club" :
                    const club = await Club.findById(objectId);
                    if (!club) {
                        return res.status(404).send({ error: "Club not found" });
                    }
                    await Club.deleteOne(objectId);
                    console.log(club);
                    break;
                case "module" :
                    const module = await Module.findById(objectId);
                    if (!module) {
                        return res.status(404).send({ error: "Module not found" });
                    }
                    await Module.deleteOne(objectId);
                    console.log(module);
                    break;
                case "event" :
                    const event = await Event.findById(objectId);
                    if (!event) {
                        return res.status(404).send({ error: "Event not found" });
                    }
                    await Event.deleteOne(objectId);
                    console.log(event);
                    break;
                default:
                    return res.status(400).send({ error: "Invalid tag type" });
            }
            return res.sendStatus(200);

        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }
);

router.patch("/admin/tags", 
    [
        body("id")
        .notEmpty().withMessage("Must provide the id of the user"),
        body("type")
        .notEmpty().withMessage("Must provide the tag type")
        .isString().withMessage("The tag type must be a string")
    ],
    async (req: Request, res: Response) => {
        const errResult = validationResult(req);
        if(!errResult.isEmpty())
            return res.status(400).send({ errors: errResult.array() });
        
        const { id, type, ...tag } = req.body;

        if ( ! isObjectIdOrHexString(id)) {
            return res.status(400).send({error: "Bad id must be 24 character hex string"});
        }
        const objectId = new mongoose.Types.ObjectId(id);

        try {
            switch(type.toLowerCase()) {
                case "club" :
                    const club = await Club.findById(objectId);
                    if (!club) {
                        return res.status(404).send({ error: "Club not found" });
                    }
                    if (tag.clubName)
                        club.clubName = tag.clubName;
                    if (tag.description)
                        club.description = tag.description;
                    await club.save();
                    console.log(tag);
                    break;

                case "module" :
                    const module = await Module.findById(objectId);
                    if (!module) {
                        return res.status(404).send({ error: "Module not found" });
                    }
                    if (tag.moduleName)
                        module.moduleName = tag.moduleName;
                    if (tag.description)
                        module.description = tag.description;
                    await module.save();
                    console.log(tag);
                    break;
                    
                case "event" :
                    let event = await Event.findById(objectId);
                    if (!event) {
                        return res.status(404).send({ error: "Event not found" });
                    }
                    if (tag.eventName)
                        event.eventName = tag.eventName;
                    if (tag.description)
                        event.description = tag.description;
                    await event.save();
                    console.log(tag);
                    break;
                    
                default:
                    return res.status(400).send({ error: "Invalid tag type" });
            }
            return res.sendStatus(200);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }
);

export default router;