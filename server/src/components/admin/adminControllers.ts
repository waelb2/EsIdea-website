import { Request, Response} from "express";
import { User } from "../user/userModels";
import { Project, ProjectVisibility } from "../project/projectModels";
import {Statistiques, banMsg} from "./adminInterface";
import { nbVisites24h } from "./adminMethods";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import { validationResult } from "express-validator";
import { ClubInterface } from "../club/clubInterface";
import { ModuleInterface } from "../module/moduleInterface";
import { EventInterface } from "../event/eventInterface";
import { Club } from "../club/clubModel";
import { Module } from "../module/moduleModel";
import { Event } from "../event/eventModel";
import { feedback } from "../feedback/feedbackModel";
import { publicProjectRequest } from "../publicProjectRequest/publicProjectRequestModel";
import { IdeationMethod } from "../idea/ideationMethodModel";

const getStats = async (req: Request, res: Response) => {
    let stats : Statistiques = {nbUsers: 0, nbProjets: [], nbVisite24h: 0, nbProjets24h: 0};
    
    try {
        //Nombre d'utilisateurs
            stats.nbUsers = await User.countDocuments();

        //Nombre de projets par methode
            const methods = await IdeationMethod.find();
            for(const method of methods) {
                const nb = await Project.find({ideationMethod: method._id}).countDocuments();
                stats.nbProjets.push(nb);
            }

        //Nombre de visites du site (par une periode de 24h)
            stats.nbVisite24h = await nbVisites24h();
        
        //Nombre de nouveaux projets (par une periode de 24h)
            const avant24h = Date.now() - 24 * 3600 * 1000;
            //filtrer les projets qui ont etaient créer dans les dernieres 24h
            //const projets24h = await Project.find({creationDate: { $gte: avant24h }}); // marche dans le cas ou creation timestamp (ms since 1970)
            const projets = await Project.find({});
            const projets24h = projets.filter( project => project.creationDate.getTime() >= avant24h );
            stats.nbProjets24h = projets24h.length;

        return res.status(200).send(stats);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const getUsers = async (req: Request, res: Response) => { 
    try {
        const users = await User.find({});
        return res.status(200).send(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const deleteUser = async (req: Request, res: Response) => {
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

const banUser = async (req: Request, res: Response) => {
    const errResult = validationResult(req);
    if(!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });

    const userId: string = req.body.id;
    const duration: number = req.body.duration;
    
    if (duration <= 0)
        return res.status(400).send({error: "Bad duration: must be positive different from 0 integer"});
    if ( ! isObjectIdOrHexString(userId))
        return res.status(400).send({error: "Bad id: must be 24 character hex string"});

    const objectId = new mongoose.Types.ObjectId(userId);
    
    try {
        const user = await User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        const endDate: Date = new Date( Date.now() + (duration * 24 * 3600 * 1000) );
        user.ban.isBan = true;
        user.ban.banEnd = endDate;
        await user.save();
        console.log(user);
        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }  
}

const unbanUser = async (req: Request, res: Response) => {
    const errResult = validationResult(req);
    if(!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });

    const userId: string = req.body.id;

    if ( ! isObjectIdOrHexString(userId))
        return res.status(400).send({error: "Bad id: must be 24 character hex string"});

    const objectId = new mongoose.Types.ObjectId(userId);
    
    try {
        const user = await User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        if ( user.ban.isBan ) {
            if ( Date.now() >= user.ban.banEnd.getTime() ) {
                user.ban.isBan = false;
                await user.save();
                console.log(user);
                return res.sendStatus(200);
            }
            return res.status(403).send({ error: banMsg });
        }
        return res.status(400).send({ error: "User is not banned" });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }  
}

const forceUnbanUser = async (req: Request, res: Response) => {
    const errResult = validationResult(req);
    if(!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });

    const userId: string = req.body.id;

    if ( ! isObjectIdOrHexString(userId))
        return res.status(400).send({error: "Bad id: must be 24 character hex string"});

    const objectId = new mongoose.Types.ObjectId(userId);
    
    try {
        const user = await User.findById(objectId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        if ( user.ban.isBan ) {
            user.ban.isBan = false;
            await user.save();
            console.log(user);
            return res.sendStatus(200);
        }
        return res.status(400).send({ error: "User is not banned" });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }  
}

const getTags = async (req: Request, res: Response) => {
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

const createTag = async (req: Request, res: Response) => {
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
        return res.status(201).send({msg: "Created successfully", savedDoc});
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

const deleteTag = async (req: Request, res: Response) => {
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

const modifyTag = async (req: Request, res: Response) => {
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
                let club = await Club.findById(objectId);
                if (!club) {
                    return res.status(404).send({ error: "Club not found" });
                }
                if (tag.clubName)
                    club.clubName = tag.clubName;
                if (tag.description)
                    club.description = {...club.description, ...tag.description };
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
                    module.description = {...module.description, ...tag.description };
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

const getFeedbacks = async (req: Request, res: Response) => { 
    try {
        const fbs = await feedback.find({});
        return res.status(200).send(fbs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const createFeedback = async (req: Request, res: Response) => { 
    try {
        const fb = new feedback(req.body);
        await fb.save();
        return res.status(201).send(fb);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

const replyFeedback = async (req: Request, res: Response) => {
    const errResult = validationResult(req);
    if(!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });

    const fbId: string = req.body.id,
        adminRes: string = req.body.response;
    
    if ( ! isObjectIdOrHexString(fbId))
        return res.status(400).send({error: "Bad id: must be 24 character hex string"});

    const fbObjectId = new mongoose.Types.ObjectId(fbId);
    
    try {
        const fb = await feedback.findById(fbObjectId);
        if (!fb) {
            return res.status(404).send({ error: "feedback not found" });
        }
        fb.adminResponse = adminRes;
        await fb.save();
        console.log(fb);
        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }  
}

const getPublicProjectRequests = async (req: Request, res: Response) => { 
    try {
        const ppRequests = await publicProjectRequest.find({});
        return res.status(200).send(ppRequests);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const createPublicProjectRequest = async (req: Request, res: Response) => { 
    try {
        const ppr = new publicProjectRequest(req.body);
        await ppr.save();
        return res.status(201).send(ppr);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

const approvePublicProjectRequest = async (req: Request, res: Response) => {
    const errResult = validationResult(req);
    if(!errResult.isEmpty())
        return res.status(400).send({ errors: errResult.array() });

    const pprId: string = req.body.id;
    
    if ( ! isObjectIdOrHexString(pprId))
        return res.status(400).send({error: "Bad id: must be 24 character hex string"});

    const pprObjectId = new mongoose.Types.ObjectId(pprId);
    
    try {
        const ppr = await publicProjectRequest.findById(pprObjectId);
        if (!ppr) {
            return res.status(404).send({ error: "Project publication request not found" });
        }
        const project = await Project.findById(ppr.projectId);
        if (!project) {
            return res.status(404).send({ error: "The project of the publication request not found" });
        }
        project.visibility = ProjectVisibility.PUBLIC;
        await project.save();
        console.log(project);
        return res.status(200).send({msg: "The public"});

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }  
}

export { getStats, 
        getUsers, 
        deleteUser, 
        banUser, 
        unbanUser, 
        forceUnbanUser, 
        getTags, 
        createTag, 
        deleteTag, 
        modifyTag, 
        getFeedbacks,
        createFeedback,
        replyFeedback,
        getPublicProjectRequests,
        createPublicProjectRequest,
        approvePublicProjectRequest
}